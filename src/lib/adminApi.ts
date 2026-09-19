import { getSupabase } from './supabase.ts';
import { AuditLog, PortalNotification, Profile } from '../types/portal.ts';

const INITIAL_LOGS: AuditLog[] = [];

export async function getAuditLogs(): Promise<AuditLog[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && Array.isArray(data)) return data as AuditLog[];
    } catch (e) {
      console.warn('Unable to fetch audit logs:', e);
    }
  }

  return INITIAL_LOGS;
}

export async function logAuditAction(action: string, entityType: string, entityId?: string, metadata?: Record<string, any>): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('audit_logs').insert([{
        user_id: 'Admin',
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata || {},
      }]);
    } catch (e) {
      console.warn('Failed to insert audit log:', e);
    }
  }
}
