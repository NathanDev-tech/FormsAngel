import { ChoirMember } from '../types.ts';

const STORAGE_CONFIG_KEY = 'ca_doan_github_config_v1';
const BROADCAST_CHANNEL_NAME = 'ca_doan_realtime_sync_v1';
const LOCAL_STORAGE_KEY = 'ca_doan_thien_than_members_v2';
const CLIENT_ID = 'client-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  filePath: string;
  gistId?: string;
  autoSync: boolean;
}

// Token đọc/ghi ngầm từ môi trường nếu có
const ENV_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITHUB_TOKEN) || '';

const DEFAULT_CONFIG: GitHubConfig = {
  token: ENV_TOKEN,
  owner: 'NathanDev-tech',
  repo: 'FormsAngel',
  filePath: 'data/members.json',
  gistId: '',
  autoSync: true,
};

type DataUpdateCallback = (members: ChoirMember[], isRemote: boolean) => void;

class SyncService {
  private config: GitHubConfig;
  private channel: BroadcastChannel | null = null;
  private listeners: Set<DataUpdateCallback> = new Set();
  private pollIntervalId: number | null = null;
  private lastKnownSha: string | null = null;
  private isFetching: boolean = false;
  private lastDataHash: string = '';

  constructor() {
    this.config = this.loadConfig();
    this.initBroadcastChannel();
    this.initFocusListeners();
  }

  public loadConfig(): GitHubConfig {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Lỗi đọc cấu hình GitHub:', e);
    }
    return { ...DEFAULT_CONFIG };
  }

  public saveConfig(newConfig: Partial<GitHubConfig>): void {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Lỗi lưu cấu hình GitHub:', e);
    }
    this.fetchRemoteData(true);
  }

  public getConfig(): GitHubConfig {
    return { ...this.config };
  }

  // 2. BroadcastChannel đồng bộ tức thì giữa các Tab trên cùng máy (<10ms)

  private initBroadcastChannel(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'MEMBERS_UPDATED' && event.data.sourceId !== CLIENT_ID) {
            const { members } = event.data;
            if (Array.isArray(members)) {
              this.notifyListeners(members, false);
            }
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    // Lắng nghe window storage event như phương án dự phòng
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed)) {
              this.notifyListeners(parsed, false);
            }
          } catch (err) {
            console.warn('Storage event parse error:', err);
          }
        }
      });
    }
  }

  public broadcastLocalChange(members: ChoirMember[]): void {
    this.lastDataHash = this.computeHash(members);
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'MEMBERS_UPDATED',
          members,
          sourceId: CLIENT_ID,
          timestamp: Date.now(),
        });
      } catch (e) {
        console.warn('Gửi broadcast thất bại:', e);
      }
    }
  }

  // 3. Tự động kiểm tra dữ liệu khi mở lại tab hoặc có thay đổi cửa sổ
  private initFocusListeners(): void {
    if (typeof window !== 'undefined') {
      const handleActive = () => {
        if (document.visibilityState === 'visible') {
          this.fetchRemoteData(false);
        }
      };
      window.addEventListener('visibilitychange', handleActive);
      window.addEventListener('focus', handleActive);
    }
  }

  // 4. Bắt đầu Vòng lặp Auto-Polling (Mặc định 4 giây một lần)
  public startAutoPolling(intervalMs = 4000): void {
    this.stopAutoPolling();
    // Chạy thử lần đầu ngay lập tức
    this.fetchRemoteData(false);

    this.pollIntervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible' && this.config.autoSync) {
        this.fetchRemoteData(false);
      }
    }, intervalMs);
  }

  public stopAutoPolling(): void {
    if (this.pollIntervalId !== null) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  }

  // 5. Đọc dữ liệu mới nhất từ GitHub REST API / Gist
  public async fetchRemoteData(forceNotify = false): Promise<ChoirMember[] | null> {
    if (this.isFetching) return null;
    this.isFetching = true;

    try {
      // Đọc từ Gist nếu có Gist ID
      if (this.config.gistId) {
        const gistMembers = await this.fetchFromGist();
        if (gistMembers) {
          const newHash = this.computeHash(gistMembers);
          if (newHash !== this.lastDataHash || forceNotify) {
            this.lastDataHash = newHash;
            this.notifyListeners(gistMembers, true);
            return gistMembers;
          }
        }
      }

      // Hoặc đọc từ GitHub Repository API
      const repoMembers = await this.fetchFromGitHubRepo();
      if (repoMembers) {
        const newHash = this.computeHash(repoMembers);
        if (newHash !== this.lastDataHash || forceNotify) {
          this.lastDataHash = newHash;
          this.notifyListeners(repoMembers, true);
          return repoMembers;
        }
      }
    } catch (error) {
      console.warn('Lỗi tải dữ liệu cloud từ GitHub:', error);
    } finally {
      this.isFetching = false;
    }
    return null;
  }

  private async fetchFromGitHubRepo(): Promise<ChoirMember[] | null> {
    const { owner, repo, filePath, token } = this.config;
    if (!owner || !repo) return null;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=main&t=${Date.now()}`;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) return null;

    const data = await res.json();
    if (data && data.content) {
      this.lastKnownSha = data.sha || null;
      // Decode Base64 UTF-8
      const decodedUtf8 = decodeURIComponent(
        escape(window.atob(data.content.replace(/\s/g, '')))
      );
      const parsed = JSON.parse(decodedUtf8);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return null;
  }

  private async fetchFromGist(): Promise<ChoirMember[] | null> {
    const { gistId, token } = this.config;
    if (!gistId) return null;

    const url = `https://api.github.com/gists/${gistId}?t=${Date.now()}`;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) return null;

    const gistData = await res.json();
    const fileKey = Object.keys(gistData.files || {})[0];
    if (fileKey && gistData.files[fileKey].content) {
      const parsed = JSON.parse(gistData.files[fileKey].content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return null;
  }

  // 6. Ghi / Push dữ liệu cập nhật lên GitHub
  public async pushRemoteData(members: ChoirMember[]): Promise<boolean> {
    const { token, owner, repo, filePath, gistId } = this.config;
    this.broadcastLocalChange(members);

    if (!token) {
      console.info('Chưa cấu hình GitHub Token, dữ liệu được đồng bộ qua Local & BroadcastChannel.');
      return false;
    }

    try {
      // Ưu tiên push lên Gist nếu có Gist ID
      if (gistId) {
        return await this.pushToGist(members);
      }
      // Push lên Repository
      if (owner && repo) {
        return await this.pushToGitHubRepo(members);
      }
    } catch (err) {
      console.error('Lỗi khi push dữ liệu lên GitHub:', err);
    }
    return false;
  }

  private async pushToGitHubRepo(members: ChoirMember[]): Promise<boolean> {
    const { token, owner, repo, filePath } = this.config;
    if (!token || !owner || !repo) return false;

    // Lấy SHA hiện tại nếu chưa có
    if (!this.lastKnownSha) {
      await this.fetchFromGitHubRepo();
    }

    const jsonString = JSON.stringify(members, null, 2);
    // Encode Base64 UTF-8 an toàn
    const contentBase64 = window.btoa(unescape(encodeURIComponent(jsonString)));

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const body: Record<string, any> = {
      message: `Cập nhật danh sách ca viên (${members.length} ca viên) [Realtime Sync]`,
      content: contentBase64,
      branch: 'main',
    };
    if (this.lastKnownSha) {
      body.sha = this.lastKnownSha;
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const responseData = await res.json();
      if (responseData.content && responseData.content.sha) {
        this.lastKnownSha = responseData.content.sha;
      }
      console.log('Đã đồng bộ dữ liệu mới lên GitHub thành công! ✨');
      return true;
    } else {
      const errorJson = await res.json().catch(() => ({}));
      console.warn('Lỗi GitHub API PUT:', errorJson);
      // Xử lý conflict SHA
      if (res.status === 409 || res.status === 422) {
        this.lastKnownSha = null;
        await this.fetchFromGitHubRepo();
      }
    }
    return false;
  }

  private async pushToGist(members: ChoirMember[]): Promise<boolean> {
    const { token, gistId } = this.config;
    if (!token || !gistId) return false;

    const jsonString = JSON.stringify(members, null, 2);
    const url = `https://api.github.com/gists/${gistId}`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        description: 'Dữ liệu Ca Đoàn Thiên Thần - Realtime Database',
        files: {
          'members.json': {
            content: jsonString,
          },
        },
      }),
    });

    return res.ok;
  }

  // 7. Đăng ký nhận sự kiện cập nhật dữ liệu
  public subscribe(callback: DataUpdateCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(members: ChoirMember[], isRemote: boolean): void {
    this.listeners.forEach((cb) => {
      try {
        cb(members, isRemote);
      } catch (err) {
        console.error('Lỗi listener callback:', err);
      }
    });
  }

  private computeHash(members: ChoirMember[]): string {
    return members.map((m) => `${m.id}-${m.updatedAt || ''}-${m.hoVaTen}`).join('|');
  }
}

export const syncService = new SyncService();
