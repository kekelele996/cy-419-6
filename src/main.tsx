import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useSettingsStore, getDifficultyConfig } from './stores/settingsStore';
import { makeBugs } from './utils/randomDungeon';
import { damage, bugAttackPlayer, getItemEffectValue } from './utils/combatCalculator';
import { ITEM_EFFECTS, ItemType } from './constants/item';
import { BugType, BUG_TYPE_HP } from './constants/bug';
import type { Player } from './models/player';
import { readLogs } from './utils/gameLogger';

declare global {
  interface Window {
    __debugDifficulty?: {
      setDifficulty: (d: 'easy' | 'normal' | 'hard') => void;
      getDifficulty: () => string;
      testAllDifficulties: () => void;
      readLogs: () => ReturnType<typeof readLogs>;
    };
  }
}

if (import.meta.env.DEV) {
  const testPlayer: Player = {
    id: 'test',
    name: 'Test',
    hp: 80,
    max_hp: 80,
    mp: 30,
    max_mp: 30,
    level: 1,
    exp: 0,
    attack: 12,
    defense: 3,
    position: { x: 0, y: 0 },
    inventory: [],
  };

  window.__debugDifficulty = {
    setDifficulty: (d) => useSettingsStore.getState().setDifficulty(d),
    getDifficulty: () => useSettingsStore.getState().difficulty,
    testAllDifficulties: () => {
      const diffs: Array<'easy' | 'normal' | 'hard'> = ['easy', 'normal', 'hard'];
      const results: Record<string, unknown> = {};
      for (const d of diffs) {
        useSettingsStore.getState().setDifficulty(d);
        const config = getDifficultyConfig();
        const bugs = makeBugs();
        const bug = bugs.find((b) => b.type === BugType.NULL_POINTER)!;
        results[d] = {
          config,
          bug: {
            baseHp: BUG_TYPE_HP[BugType.NULL_POINTER],
            actualHp: bug.hp,
            actualAtk: bug.attack,
            actualDef: bug.defense,
          },
          playerDamageToBug: damage(testPlayer.attack, bug.defense),
          bugDamageToPlayer: bugAttackPlayer(bug, { ...testPlayer }),
          potionHeal: getItemEffectValue(ITEM_EFFECTS[ItemType.POTION]),
          debuggerHeal: getItemEffectValue(ITEM_EFFECTS[ItemType.DEBUGGER]),
        };
      }
      console.table(results);
      return results;
    },
    readLogs,
  };

  console.log('调试接口已加载: window.__debugDifficulty');
  console.log('调用 window.__debugDifficulty.testAllDifficulties() 验证难度链路');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
