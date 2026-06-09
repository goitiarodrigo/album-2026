import { useCallback, useEffect, useState } from 'react';

const PROFILE_KEY = 'panini-2026:profile';

export type Profile = { name: string; avatar: string };

const DEFAULT: Profile = { name: '', avatar: 'preset:pelota' };

function load(): Profile {
  try {
    const r = localStorage.getItem(PROFILE_KEY);
    if (!r) return DEFAULT;
    const p = JSON.parse(r);
    return { name: p.name ?? '', avatar: p.avatar ?? DEFAULT.avatar };
  } catch {
    return DEFAULT;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(load);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore quota
    }
  }, [profile]);

  const update = useCallback((p: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const hasProfile = profile.name.trim().length > 0;

  return { profile, update, hasProfile };
}
