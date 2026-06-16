import type { Dungeon } from '../models/dungeon';
import type { Bug } from '../models/bug';
import { BugType, BUG_TYPE_HP } from '../constants/bug';
import { DUNGEON_CONFIG } from '../constants/dungeon';
import { logGame } from './gameLogger';
import { getDifficultyConfig } from '../stores/settingsStore';

export function makeDungeon(level = 1): Dungeon {
  logGame('DUNGEON_GENERATE', { level });
  const tiles = Array.from({ length: DUNGEON_CONFIG.height }, (_, y) =>
    Array.from({ length: DUNGEON_CONFIG.width }, (_, x) =>
      x === 0 || y === 0 || x === DUNGEON_CONFIG.width - 1 || y === DUNGEON_CONFIG.height - 1
        ? 'wall'
        : 'floor'
    )
  );
  return {
    id: 'd-' + level,
    level,
    width: DUNGEON_CONFIG.width,
    height: DUNGEON_CONFIG.height,
    tiles,
    fog_map: tiles.map((row) => row.map(() => true)),
  };
}

export function makeBugs(): Bug[] {
  const config = getDifficultyConfig();
  return Object.values(BugType).map((type, i) => ({
    id: 'bug-' + i,
    type,
    hp: Math.floor(BUG_TYPE_HP[type] * config.enemyHpMul),
    attack: Math.floor((5 + i) * config.enemyAtkMul),
    defense: Math.floor((1 + (i % 3)) * config.enemyDefMul),
    position: { x: 4 + i * 2, y: 3 + (i % 5) },
    status: 'alive',
  }));
}
