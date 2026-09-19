import { getSupabase, withTimeout } from './supabase.ts';
import { Song, CreateSongInput, UpdateSongInput } from '../types/songs.ts';

const INITIAL_SONGS: Song[] = [];

let localSongsStore: Song[] = [];

export async function getSongs(category?: string): Promise<Song[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('songs')
        .select('*')
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (category && category !== 'Tất cả') {
        query = query.eq('category', category);
      }

      const { data, error } = await withTimeout(query, 1800);
      if (!error && Array.isArray(data)) {
        return data as Song[];
      }
    } catch (e) {
      console.warn('Unable to query Supabase songs, using local fallback:', e);
    }
  }

  let list = localSongsStore.filter(s => s.is_active);
  if (category && category !== 'Tất cả') {
    list = list.filter(s => s.category === category);
  }
  return list.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getSongById(id: string): Promise<Song | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return data as Song;
      }
    } catch (e) {
      console.warn('Unable to fetch song by id:', e);
    }
  }

  return localSongsStore.find(s => s.id === id) || null;
}

export async function createSong(input: CreateSongInput): Promise<Song> {
  const now = new Date().toISOString();
  const newSong: Song = {
    id: 'song-' + Date.now().toString(36),
    title: input.title,
    composer: input.composer || '',
    category: input.category || 'Nhập lễ',
    key_signature: input.key_signature || 'C',
    lyrics: input.lyrics || '',
    sheet_url: input.sheet_url || '',
    audio_url: input.audio_url || '',
    video_url: input.video_url || '',
    thumbnail_url: input.thumbnail_url || '',
    is_active: input.is_active !== undefined ? input.is_active : true,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('songs')
        .insert([{
          title: newSong.title,
          composer: newSong.composer,
          category: newSong.category,
          key_signature: newSong.key_signature,
          lyrics: newSong.lyrics,
          sheet_url: newSong.sheet_url,
          audio_url: newSong.audio_url,
          video_url: newSong.video_url,
          thumbnail_url: newSong.thumbnail_url,
          is_active: newSong.is_active,
        }])
        .select()
        .single();

      if (!error && data) {
        return data as Song;
      }
    } catch (e) {
      console.warn('Failed to insert song into Supabase, saving locally:', e);
    }
  }

  localSongsStore.push(newSong);
  return newSong;
}

export async function updateSong(id: string, input: UpdateSongInput): Promise<Song> {
  const now = new Date().toISOString();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('songs')
        .update({ ...input, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as Song;
      }
    } catch (e) {
      console.warn('Failed to update song in Supabase:', e);
    }
  }

  const idx = localSongsStore.findIndex(s => s.id === id);
  if (idx !== -1) {
    const updated = { ...localSongsStore[idx], ...input, updated_at: now };
    localSongsStore[idx] = updated;
    return updated;
  }
  throw new Error('Song not found');
}

export async function deleteSong(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Failed to delete song from Supabase:', e);
    }
  }

  localSongsStore = localSongsStore.filter(s => s.id !== id);
  return true;
}
