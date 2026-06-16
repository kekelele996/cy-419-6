export type Difficulty = 'easy' | 'normal' | 'hard';

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  enemyHpMul: number;
  enemyAtkMul: number;
  enemyDefMul: number;
  itemEffectMul: number;
}> = {
  easy: {
    label: '简单',
    enemyHpMul: 0.7,
    enemyAtkMul: 0.7,
    enemyDefMul: 0.6,
    itemEffectMul: 1.5,
  },
  normal: {
    label: '普通',
    enemyHpMul: 1,
    enemyAtkMul: 1,
    enemyDefMul: 1,
    itemEffectMul: 1,
  },
  hard: {
    label: '困难',
    enemyHpMul: 1.5,
    enemyAtkMul: 1.4,
    enemyDefMul: 1.5,
    itemEffectMul: 0.6,
  },
};
