import { useSettingsStore } from '../stores/settingsStore';
import { clearSave } from '../utils/saveManager';
import { GameButton } from '../components/common/GameButton';
import { DIFFICULTY_CONFIG } from '../constants/difficulty';
import type { Difficulty } from '../constants/difficulty';

const difficulties: Difficulty[] = ['easy', 'normal', 'hard'];

export function Settings() {
  const store = useSettingsStore();

  return (
    <main className="page panel">
      <h1>设置</h1>

      <label>
        音量{' '}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={store.volume}
          onChange={(e) => store.setVolume(Number(e.target.value))}
        />
      </label>

      <div className="mt-4">
        <span>难度</span>
        <div className="flex gap-3 mt-2">
          {difficulties.map((d) => (
            <GameButton
              key={d}
              onClick={() => store.setDifficulty(d)}
            >
              {DIFFICULTY_CONFIG[d].label}
              {store.difficulty === d ? ' ✓' : ''}
            </GameButton>
          ))}
        </div>
        <p className="text-sm mt-1 opacity-70">
          {store.difficulty === 'easy' && '敌人更弱，药水效果更好'}
          {store.difficulty === 'normal' && '标准难度，原版体验'}
          {store.difficulty === 'hard' && '敌人更强，药水效果减弱'}
        </p>
      </div>

      <div className="mt-4">
        <GameButton onClick={() => store.setTheme(store.theme === 'terminal' ? 'paper' : 'terminal')}>
          切换主题
        </GameButton>
        <GameButton onClick={clearSave}>重置存档</GameButton>
      </div>
    </main>
  );
}
