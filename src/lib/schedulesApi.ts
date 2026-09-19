import { getSupabase, withTimeout } from './supabase.ts';
import { RehearsalSchedule, CreateScheduleInput, UpdateScheduleInput } from '../types/schedules.ts';

const LOCAL_STORAGE_KEY = 'ca_doan_portal_schedules_v1';

function getLocalSchedules(): RehearsalSchedule[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage error reading schedules:', e);
  }
  return [];
}

function saveLocalSchedules(list: RehearsalSchedule[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('LocalStorage error saving schedules:', e);
  }
}

export async function getSchedules(status = 'published'): Promise<RehearsalSchedule[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('rehearsal_schedules')
        .select('*')
        .order('start_at', { ascending: true });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await withTimeout(query, 1800);
      if (!error && Array.isArray(data)) {
        saveLocalSchedules(data as RehearsalSchedule[]);
        return data as RehearsalSchedule[];
      }
    } catch (e) {
      console.warn('Unable to query Supabase rehearsal_schedules, using local fallback:', e);
    }
  }

  let list = getLocalSchedules();
  if (status !== 'all') {
    list = list.filter(s => s.status === status);
  }
  return [...list].sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
}

export async function getScheduleById(id: string): Promise<RehearsalSchedule | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('rehearsal_schedules')
          .select('*')
          .eq('id', id)
          .single(),
        1800
      );
      if (!error && data) {
        return data as RehearsalSchedule;
      }
    } catch (e) {
      console.warn('Unable to fetch schedule by id from Supabase:', e);
    }
  }

  return getLocalSchedules().find(s => s.id === id) || null;
}

export async function createSchedule(input: CreateScheduleInput): Promise<RehearsalSchedule> {
  const now = new Date().toISOString();
  const newSched: RehearsalSchedule = {
    id: 'sched-' + Date.now().toString(36),
    title: input.title,
    start_at: input.start_at,
    end_at: input.end_at,
    location: input.location || 'Nhà Phụng Vụ / Phòng Tập Ca Đoàn',
    description: input.description,
    status: input.status || 'published',
    created_at: now,
    updated_at: now,
  };

  const current = getLocalSchedules();
  saveLocalSchedules([newSched, ...current]);

  const supabase = getSupabase();
  if (supabase) {
    withTimeout(
      supabase
        .from('rehearsal_schedules')
        .insert([{
          title: newSched.title,
          start_at: newSched.start_at,
          end_at: newSched.end_at,
          location: newSched.location,
          description: newSched.description,
          status: newSched.status,
        }])
        .select()
        .single(),
      3000
    )
    .then(({ data, error }) => {
      if (!error && data) {
        const fresh = getLocalSchedules().map(s => s.id === newSched.id ? (data as RehearsalSchedule) : s);
        saveLocalSchedules(fresh);
      }
    })
    .catch((e) => console.warn('Background schedule insert sync:', e));
  }

  return newSched;
}

export async function updateSchedule(id: string, input: UpdateScheduleInput): Promise<RehearsalSchedule> {
  const now = new Date().toISOString();
  const current = getLocalSchedules();
  const idx = current.findIndex(s => s.id === id);
  const updated = idx !== -1 ? { ...current[idx], ...input, updated_at: now } : { id, ...input, created_at: now, updated_at: now } as RehearsalSchedule;

  if (idx !== -1) {
    current[idx] = updated;
    saveLocalSchedules(current);
  }

  const supabase = getSupabase();
  if (supabase) {
    withTimeout(
      supabase
        .from('rehearsal_schedules')
        .update({ ...input, updated_at: now })
        .eq('id', id)
        .select()
        .single(),
      3000
    )
    .then(({ data, error }) => {
      if (!error && data) {
        const fresh = getLocalSchedules().map(s => s.id === id ? (data as RehearsalSchedule) : s);
        saveLocalSchedules(fresh);
      }
    })
    .catch((e) => console.warn('Background schedule update sync:', e));
  }

  return updated;
}

export async function deleteSchedule(id: string): Promise<boolean> {
  const current = getLocalSchedules();
  saveLocalSchedules(current.filter(s => s.id !== id));

  const supabase = getSupabase();
  if (supabase) {
    withTimeout(
      supabase
        .from('rehearsal_schedules')
        .delete()
        .eq('id', id),
      3000
    ).catch((e) => console.warn('Background schedule delete sync:', e));
  }

  return true;
}

export function subscribeSchedulesRealtime(onChange: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('public:rehearsal_schedules')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rehearsal_schedules' }, () => {
      onChange();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
