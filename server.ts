import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface ChoirMember {
  id: string;
  tenThanh: string;
  hoVaTen: string;
  ngaySinh: string;
  lop: string;
  soDienThoai: string;
  createdAt: string;
  updatedAt: string;
  ghiChu?: string;
  bonPhan?: string;
  trangThai?: string;
}

const DEFAULT_MEMBERS: ChoirMember[] = [];

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'members.json');

// Ensure data file exists with initial data
function loadMembersFromFile(): ChoirMember[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // Create with default members
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_MEMBERS, null, 2), 'utf-8');
    return DEFAULT_MEMBERS;
  } catch (error) {
    console.error('Error loading members file:', error);
    return DEFAULT_MEMBERS;
  }
}

function saveMembersToFile(members: ChoirMember[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving members file:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  let members = loadMembersFromFile();

  app.use(express.json());

  // API Routes
  // 1. Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', membersCount: members.length });
  });

  // 2. Get all members
  app.get('/api/members', (_req: Request, res: Response) => {
    res.json({ success: true, data: members });
  });

  // 3. Add new member (NO required fields, allows empty values)
  app.post('/api/members', (req: Request, res: Response) => {
    const { tenThanh, hoVaTen, ngaySinh, lop, soDienThoai, ghiChu, bonPhan, trangThai } = req.body || {};
    const now = new Date().toISOString();
    const newMember: ChoirMember = {
      id: 'ctt-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      tenThanh: (tenThanh || '').toString().trim(),
      hoVaTen: (hoVaTen || '').toString().trim(),
      ngaySinh: (ngaySinh || '').toString().trim(),
      lop: (lop || '').toString().trim(),
      soDienThoai: (soDienThoai || '').toString().trim(),
      ghiChu: (ghiChu || '').toString().trim(),
      bonPhan: (bonPhan || 'Thành viên').toString().trim(),
      trangThai: (trangThai || 'Hoạt động').toString().trim(),
      createdAt: now,
      updatedAt: now
    };

    members.unshift(newMember); // newer on top
    saveMembersToFile(members);

    res.status(201).json({ success: true, data: newMember });
  });

  // 4. Update member
  app.put('/api/members/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = members.findIndex(m => m.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Không tìm thấy thành viên cần sửa' });
      return;
    }

    const { tenThanh, hoVaTen, ngaySinh, lop, soDienThoai, ghiChu, bonPhan, trangThai } = req.body || {};
    const updatedMember: ChoirMember = {
      ...members[index],
      tenThanh: tenThanh !== undefined ? String(tenThanh).trim() : members[index].tenThanh,
      hoVaTen: hoVaTen !== undefined ? String(hoVaTen).trim() : members[index].hoVaTen,
      ngaySinh: ngaySinh !== undefined ? String(ngaySinh).trim() : members[index].ngaySinh,
      lop: lop !== undefined ? String(lop).trim() : members[index].lop,
      soDienThoai: soDienThoai !== undefined ? String(soDienThoai).trim() : members[index].soDienThoai,
      ghiChu: ghiChu !== undefined ? String(ghiChu).trim() : (members[index].ghiChu || ''),
      bonPhan: bonPhan !== undefined ? String(bonPhan).trim() : (members[index].bonPhan || 'Thành viên'),
      trangThai: trangThai !== undefined ? String(trangThai).trim() : (members[index].trangThai || 'Hoạt động'),
      updatedAt: new Date().toISOString()
    };

    members[index] = updatedMember;
    saveMembersToFile(members);

    res.json({ success: true, data: updatedMember });
  });

  // 5. Delete member
  app.delete('/api/members/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLength = members.length;
    members = members.filter(m => m.id !== id);

    if (members.length === initialLength) {
      res.status(404).json({ success: false, message: 'Không tìm thấy thành viên cần xoá' });
      return;
    }

    saveMembersToFile(members);
    res.json({ success: true, message: 'Đã xoá thành viên thành công' });
  });

  // 6. Reset / clear members list
  app.post('/api/members/reset', (_req: Request, res: Response) => {
    members = [...DEFAULT_MEMBERS];
    saveMembersToFile(members);
    res.json({ success: true, message: 'Đã làm mới danh sách ca viên', data: members });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ca Đoàn Thiên Thần app running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
