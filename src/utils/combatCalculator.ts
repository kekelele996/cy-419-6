import type { Player } from '../models/player';
import type { Bug } from '../models/bug';
import { logGame } from './gameLogger';
import { getDifficultyConfig } from '../stores/settingsStore';

export function damage(attacker: number, defense: number) {
  const config = getDifficultyConfig();
  const adjustedDefense = Math.floor(defense * config.enemyDefMul);
  const value = Math.max(1, attacker - adjustedDefense);
  logGame('COMBAT_DAMAGE', { value });
  return value;
}

export function attackBug(player: Player, bug: Bug) {
  const value = damage(player.attack, bug.defense);
  bug.hp -= value;
  if (bug.hp <= 0) {
    bug.status = 'dead';
    player.exp += 12;
    logGame('BUG_DEAD', { type: bug.type });
  }
  return value;
}

export function bugAttackPlayer(bug: Bug, player: Player) {
  const config = getDifficultyConfig();
  const adjustedAttack = Math.floor(bug.attack * config.enemyAtkMul);
  const value = Math.max(1, adjustedAttack - player.defense);
  player.hp = Math.max(0, player.hp - value);
  logGame('BUG_ATTACK', { type: bug.type, value });
  return value;
}

export function getItemEffectValue(baseValue: number) {
  const config = getDifficultyConfig();
  return Math.max(1, Math.floor(baseValue * config.itemEffectMul));
}
