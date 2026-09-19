export type ScheduleStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface RehearsalSchedule {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  location: string;
  description?: string;
  notes?: string;
  status: ScheduleStatus;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateScheduleInput {
  title: string;
  start_at: string;
  end_at: string;
  location: string;
  description?: string;
  notes?: string;
  status?: ScheduleStatus;
  created_by?: string;
}

export interface UpdateScheduleInput {
  title?: string;
  start_at?: string;
  end_at?: string;
  location?: string;
  description?: string;
  notes?: string;
  status?: ScheduleStatus;
  created_by?: string;
}
