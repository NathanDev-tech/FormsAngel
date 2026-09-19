import { getSupabase, withTimeout } from './supabase.ts';
import { LiturgicalService, LiturgicalServiceSong } from '../types/portal.ts';

const INITIAL_SERVICES: LiturgicalService[] = [];

let localServicesStore: LiturgicalService[] = [];

export async function getLiturgicalServices(status = 'published'): Promise<LiturgicalService[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('liturgical_services')
        .select(`
          *,
          songs:liturgical_service_songs(*)
        `)
        .order('service_date', { ascending: true });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await withTimeout(query, 1800);
      if (!error && Array.isArray(data)) {
        return data as LiturgicalService[];
      }
    } catch (e) {
      console.warn('Unable to query Supabase liturgical_services, using local fallback:', e);
    }
  }

  let list = localServicesStore;
  if (status !== 'all') {
    list = list.filter(s => s.status === status);
  }
  return [...list].sort((a, b) => new Date(a.service_date).getTime() - new Date(b.service_date).getTime());
}

export async function getLiturgicalServiceById(id: string): Promise<LiturgicalService | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('liturgical_services')
        .select(`
          *,
          songs:liturgical_service_songs(*)
        `)
        .eq('id', id)
        .single();
      if (!error && data) {
        return data as LiturgicalService;
      }
    } catch (e) {
      console.warn('Unable to fetch liturgical service by id:', e);
    }
  }

  return localServicesStore.find(s => s.id === id) || null;
}

export async function createLiturgicalService(input: Partial<LiturgicalService>): Promise<LiturgicalService> {
  const now = new Date().toISOString();
  const newService: LiturgicalService = {
    id: 'lit-' + Date.now().toString(36),
    title: input.title || 'Thánh Lễ',
    service_date: input.service_date || new Date().toISOString().split('T')[0],
    service_time: input.service_time || '06:30',
    location: input.location || 'Nhà thờ Bắc Hòa',
    occasion: input.occasion || '',
    notes: input.notes || '',
    status: input.status || 'published',
    created_by: input.created_by || 'Ban Phụng Vụ',
    created_at: now,
    updated_at: now,
    songs: input.songs || [],
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('liturgical_services')
        .insert([{
          title: newService.title,
          service_date: newService.service_date,
          service_time: newService.service_time,
          location: newService.location,
          occasion: newService.occasion,
          notes: newService.notes,
          status: newService.status,
          created_by: newService.created_by,
        }])
        .select()
        .single();

      if (!error && data) {
        if (input.songs && input.songs.length > 0) {
          const songMappings = input.songs.map((s, idx) => ({
            service_id: data.id,
            custom_title: s.custom_title,
            song_position: s.song_position,
            display_order: idx + 1,
          }));
          await supabase.from('liturgical_service_songs').insert(songMappings);
        }
        return getLiturgicalServiceById(data.id) as Promise<LiturgicalService>;
      }
    } catch (e) {
      console.warn('Failed to insert service into Supabase, saving locally:', e);
    }
  }

  localServicesStore.push(newService);
  return newService;
}

export async function updateLiturgicalService(id: string, input: Partial<LiturgicalService>): Promise<LiturgicalService> {
  const now = new Date().toISOString();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('liturgical_services')
        .update({
          title: input.title,
          service_date: input.service_date,
          service_time: input.service_time,
          location: input.location,
          occasion: input.occasion,
          notes: input.notes,
          status: input.status,
          updated_at: now,
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        if (input.songs) {
          await supabase.from('liturgical_service_songs').delete().eq('service_id', id);
          if (input.songs.length > 0) {
            const songMappings = input.songs.map((s, idx) => ({
              service_id: id,
              custom_title: s.custom_title,
              song_position: s.song_position,
              display_order: idx + 1,
            }));
            await supabase.from('liturgical_service_songs').insert(songMappings);
          }
        }
        return getLiturgicalServiceById(id) as Promise<LiturgicalService>;
      }
    } catch (e) {
      console.warn('Failed to update service in Supabase:', e);
    }
  }

  const idx = localServicesStore.findIndex(s => s.id === id);
  if (idx !== -1) {
    const updated = { ...localServicesStore[idx], ...input, updated_at: now };
    localServicesStore[idx] = updated;
    return updated;
  }
  throw new Error('Service not found');
}

export async function deleteLiturgicalService(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('liturgical_services').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Failed to delete service:', e);
    }
  }

  localServicesStore = localServicesStore.filter(s => s.id !== id);
  return true;
}
