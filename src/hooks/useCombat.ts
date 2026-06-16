import { useDungeonStore } from '../stores/dungeonStore';
import { usePlayerStore } from '../stores/playerStore';
import { attackBug, bugAttackPlayer } from '../utils/combatCalculator';
import { useGameStore } from '../stores/gameStore';

export function useCombat() {
  const player = usePlayerStore((s) => s.player);
  const bugs = useDungeonStore((s) => s.bugs);
  const over = useGameStore((s) => s.over);

  return {
    attackNearest: () => {
      const bug = bugs.find((item) => item.status === 'alive');
      if (!bug) return { playerDamage: 0, bugDamage: 0 };

      const playerDamage = attackBug(player, bug);

      if (bug.status === 'alive') {
        const bugDamage = bugAttackPlayer(bug, player);
        if (player.hp <= 0) over();
        return { playerDamage, bugDamage };
      }

      return { playerDamage, bugDamage: 0 };
    },
  };
}
