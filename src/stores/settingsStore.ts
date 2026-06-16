import { create } from 'zustand';
import { logGame } from '../utils/gameLogger';
import type { Difficulty } from '../constants/difficulty';
import { DIFFICULTY_CONFIG } from '../constants/difficulty';

const SETTINGS_KEY = 'debugquest:settings';

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '');
  } catch {
    return null;
  }
}

const saved = loadSettings();

type SettingsState = {
  volume: number;
  theme: 'terminal' | 'paper';
  difficulty: Difficulty;
  setVolume: (v: number) => void;
  setTheme: (t: 'terminal' | 'paper') => void;
  setDifficulty: (d: Difficulty) => void;
};

function persist(state: Pick<SettingsState, 'volume' | 'theme' | 'difficulty'>) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
}

export const useSettingsStore = create<SettingsState>((set) => ({
  volume: saved?.volume ?? 0.5,
  theme: saved?.theme ?? 'terminal',
  difficulty: saved?.difficulty ?? 'normal',
  setVolume: (volume) => {
    logGame('SETTING_VOLUME', { value: volume });
    set((s) => {
      const next = { ...s, volume };
      persist(next);
      return { volume };
    });
  },
  setTheme: (theme) => {
    logGame('SETTING_THEME', { value: theme });
    set((s) => {
      const next = { ...s, theme };
      persist(next);
      return { theme };
    });
  },
  setDifficulty: (difficulty) => {
    logGame('SETTING_DIFFICULTY', { value: difficulty });
    set((s) => {
      const next = { ...s, difficulty };
      persist(next);
      return { difficulty };
    });
  },
}));

export function getDifficultyConfig() {
  const d = useSettingsStore.getState().difficulty;
  return DIFFICULTY_CONFIG[d];
}
