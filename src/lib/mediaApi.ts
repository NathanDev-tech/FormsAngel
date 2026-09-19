import { getSupabase } from './supabase.ts';
import { MediaAsset } from '../types/portal.ts';

const INITIAL_MEDIA: MediaAsset[] = [];

let localMediaStore: MediaAsset[] = [];

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data as MediaAsset[];
      }
    } catch (e) {
      console.warn('Unable to query Supabase media_assets:', e);
    }
  }

  return localMediaStore;
}

export async function createMediaAsset(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
  const newAsset: MediaAsset = {
    id: 'media-' + Date.now().toString(36),
    ...asset,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .insert([asset])
        .select()
        .single();
      if (!error && data) return data as MediaAsset;
    } catch (e) {
      console.warn('Failed to insert media asset into Supabase:', e);
    }
  }

  localMediaStore.unshift(newAsset);
  return newAsset;
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('media_assets').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Failed to delete media asset:', e);
    }
  }

  localMediaStore = localMediaStore.filter(m => m.id !== id);
  return true;
}
