import { create } from 'zustand';
import type { Player } from '../models/player';
import type { Item } from '../models/item';
import { logGame } from '../utils/gameLogger';
import { ITEM_EFFECTS } from '../constants/item';
import { getItemEffectValue } from '../utils/combatCalculator';

const initial: Player = {
  id: 'p1',
  name: 'Bug Hunter',
  hp: 80,
  max_hp: 80,
  mp: 30,
  max_mp: 30,
  level: 1,
  exp: 0,
  attack: 12,
  defense: 3,
  position: { x: 2, y: 2 },
  inventory: [],
};

type PlayerState = {
  player: Player;
  setName: (name: string) => void;
  move: (dx: number, dy: number) => void;
  heal: (v: number) => void;
  useItem: (itemId: string) => void;
  addItem: (item: Item) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  player: initial,
  setName: (name) => set((s) => ({ player: { ...s.player, name } })),
  move: (dx, dy) =>
    set((s) => {
      const p = {
        ...s.player,
        position: {
          x: Math.max(1, Math.min(16, s.player.position.x + dx)),
          y: Math.max(1, Math.min(10, s.player.position.y + dy)),
        },
      };
      logGame('PLAYER_MOVE', { id: p.id, x: p.position.x, y: p.position.y });
      return { player: p };
    }),
  heal: (v) =>
    set((s) => ({ player: { ...s.player, hp: Math.min(s.player.max_hp, s.player.hp + v) } })),
  useItem: (itemId) =>
    set((s) => {
      const idx = s.player.inventory.findIndex((i) => i.id === itemId);
      if (idx === -1) return s;
      const item = s.player.inventory[idx];
      const baseValue = ITEM_EFFECTS[item.type];
      const value = getItemEffectValue(baseValue);
      const newInventory = [...s.player.inventory];
      newInventory.splice(idx, 1);
      logGame('ITEM_USE', { type: item.type });
      logGame('PLAYER_HEAL', { id: s.player.id, value });
      return {
        player: {
          ...s.player,
          hp: Math.min(s.player.max_hp, s.player.hp + value),
          inventory: newInventory,
        },
      };
    }),
  addItem: (item) =>
    set((s) => ({
      player: { ...s.player, inventory: [...s.player.inventory, item] },
    })),
}));
