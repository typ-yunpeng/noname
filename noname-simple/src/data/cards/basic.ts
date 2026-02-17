import type { Card, Suit, CardType, EquipType } from '@/types'

/**
 * 基本卡牌数据
 * 包括：基本牌、锦囊牌、装备牌
 */

// 基本牌
export const basicCards: Omit<Card, 'id'>[] = [
  // 杀
  {
    name: '杀',
    suit: 'spade',
    number: 1,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 2,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 3,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 4,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 5,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 6,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 7,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 8,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 1,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 2,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 3,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 4,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 5,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 6,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 7,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 8,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 1,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 2,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 3,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 4,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 5,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 6,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 7,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 8,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 1,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 2,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 3,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 4,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 5,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 6,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 7,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 8,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 9,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 10,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 11,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 12,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'spade',
    number: 13,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 9,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 10,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 11,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 12,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'heart',
    number: 13,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 9,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 10,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 11,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 12,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'club',
    number: 13,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 9,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 10,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 11,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 12,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },
  {
    name: '杀',
    suit: 'diamond',
    number: 13,
    type: 'basic',
    description: '出牌阶段使用，对一名其他角色使用。目标角色需使用一张【闪】，否则受到1点伤害。'
  },

  // 闪
  {
    name: '闪',
    suit: 'spade',
    number: 2,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 3,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 4,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 5,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 6,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 7,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 8,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 2,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 3,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 4,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 5,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 6,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 7,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 8,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 2,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 3,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 4,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 5,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 6,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 7,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 8,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 2,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 3,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 4,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 5,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 6,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 7,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 8,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 9,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 10,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 11,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 12,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'spade',
    number: 13,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 9,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 10,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 11,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 12,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'heart',
    number: 13,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 9,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 10,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 11,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 12,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'club',
    number: 13,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 9,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 10,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 11,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 12,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },
  {
    name: '闪',
    suit: 'diamond',
    number: 13,
    type: 'basic',
    description: '当【杀】指定你为目标时，你可以使用【闪】进行响应。'
  },

  // 桃
  {
    name: '桃',
    suit: 'heart',
    number: 3,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 4,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 5,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 6,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 7,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 8,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 9,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 10,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 3,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 4,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 5,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 6,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 7,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 8,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 11,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 12,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'heart',
    number: 13,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 9,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 10,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 11,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 12,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  },
  {
    name: '桃',
    suit: 'diamond',
    number: 13,
    type: 'basic',
    description: '出牌阶段使用，为自己回复1点体力。当一名角色处于濒死状态时，你可以使用【桃】进行响应。'
  }
]

// 锦囊牌
export const trickCards: Omit<Card, 'id'>[] = [
  // 过河拆桥
  {
    name: '过河拆桥',
    suit: 'spade',
    number: 3,
    type: 'trick',
    description: '出牌阶段使用，选择一名其他角色，弃置其一张牌（手牌或装备区）。'
  },
  {
    name: '过河拆桥',
    suit: 'spade',
    number: 4,
    type: 'trick',
    description: '出牌阶段使用，选择一名其他角色，弃置其一张牌（手牌或装备区）。'
  },
  {
    name: '过河拆桥',
    suit: 'club',
    number: 3,
    type: 'trick',
    description: '出牌阶段使用，选择一名其他角色，弃置其一张牌（手牌或装备区）。'
  },
  {
    name: '过河拆桥',
    suit: 'club',
    number: 4,
    type: 'trick',
    description: '出牌阶段使用，选择一名其他角色，弃置其一张牌（手牌或装备区）。'
  },

  // 顺手牵羊
  {
    name: '顺手牵羊',
    suit: 'spade',
    number: 3,
    type: 'trick',
    description: '出牌阶段使用，选择距离为1的一名其他角色，获得其一张牌（手牌或装备区）。'
  },
  {
    name: '顺手牵羊',
    suit: 'spade',
    number: 4,
    type: 'trick',
    description: '出牌阶段使用，选择距离为1的一名其他角色，获得其一张牌（手牌或装备区）。'
  },
  {
    name: '顺手牵羊',
    suit: 'heart',
    number: 3,
    type: 'trick',
    description: '出牌阶段使用，选择距离为1的一名其他角色，获得其一张牌（手牌或装备区）。'
  },
  {
    name: '顺手牵羊',
    suit: 'heart',
    number: 4,
    type: 'trick',
    description: '出牌阶段使用，选择距离为1的一名其他角色，获得其一张牌（手牌或装备区）。'
  },

  // 无中生有
  {
    name: '无中生有',
    suit: 'heart',
    number: 7,
    type: 'trick',
    description: '出牌阶段使用，摸两张牌。'
  },
  {
    name: '无中生有',
    suit: 'heart',
    number: 8,
    type: 'trick',
    description: '出牌阶段使用，摸两张牌。'
  },
  {
    name: '无中生有',
    suit: 'heart',
    number: 9,
    type: 'trick',
    description: '出牌阶段使用，摸两张牌。'
  },
  {
    name: '无中生有',
    suit: 'heart',
    number: 10,
    type: 'trick',
    description: '出牌阶段使用，摸两张牌。'
  },

  // 决斗
  {
    name: '决斗',
    suit: 'spade',
    number: 1,
    type: 'trick',
    description: '出牌阶段使用，选择一名其他角色进行决斗。由目标角色开始，双方轮流打出【杀】，直到一方无法打出【杀】，受到1点伤害。'
  },
  {
    name: '决斗',
    suit: 'club',
    number: 1,
    type: 'trick',
    description: '出牌阶段使用，选择一名其他角色进行决斗。由目标角色开始，双方轮流打出【杀】，直到一方无法打出【杀】，受到1点伤害。'
  },

  // 南蛮入侵
  {
    name: '南蛮入侵',
    suit: 'spade',
    number: 7,
    type: 'trick',
    description: '出牌阶段使用，所有其他角色需打出一张【杀】，否则受到1点伤害。'
  },
  {
    name: '南蛮入侵',
    suit: 'spade',
    number: 13,
    type: 'trick',
    description: '出牌阶段使用，所有其他角色需打出一张【杀】，否则受到1点伤害。'
  },
  {
    name: '南蛮入侵',
    suit: 'club',
    number: 7,
    type: 'trick',
    description: '出牌阶段使用，所有其他角色需打出一张【杀】，否则受到1点伤害。'
  },

  // 万箭齐发
  {
    name: '万箭齐发',
    suit: 'heart',
    number: 1,
    type: 'trick',
    description: '出牌阶段使用，所有其他角色需打出一张【闪】，否则受到1点伤害。'
  },
  {
    name: '万箭齐发',
    suit: 'heart',
    number: 2,
    type: 'trick',
    description: '出牌阶段使用，所有其他角色需打出一张【闪】，否则受到1点伤害。'
  },

  // 无懈可击
  {
    name: '无懈可击',
    suit: 'spade',
    number: 11,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'spade',
    number: 12,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'spade',
    number: 13,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'heart',
    number: 11,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'heart',
    number: 12,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'heart',
    number: 13,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'club',
    number: 11,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'club',
    number: 12,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'club',
    number: 13,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'diamond',
    number: 11,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'diamond',
    number: 12,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  },
  {
    name: '无懈可击',
    suit: 'diamond',
    number: 13,
    type: 'trick',
    description: '当一张锦囊牌生效前，可以使用【无懈可击】抵消其效果。'
  }
]

// 装备牌
export const equipCards: Omit<Card, 'id'>[] = [
  // 武器
  {
    name: '诸葛连弩',
    suit: 'spade',
    number: 1,
    type: 'equip',
    equipType: 'weapon',
    description: '攻击范围：1。你可以于出牌阶段内使用任意数量的【杀】。'
  },
  {
    name: '青龙偃月刀',
    suit: 'spade',
    number: 5,
    type: 'equip',
    equipType: 'weapon',
    description: '攻击范围：3。当你使用的【杀】被目标角色使用的【闪】抵消时，你可以对该角色再使用一张【杀】。'
  },
  {
    name: '丈八蛇矛',
    suit: 'spade',
    number: 12,
    type: 'equip',
    equipType: 'weapon',
    description: '攻击范围：3。你可以将两张手牌当【杀】使用或打出。'
  },
  {
    name: '贯石斧',
    suit: 'spade',
    number: 5,
    type: 'equip',
    equipType: 'weapon',
    description: '攻击范围：3。当你使用的【杀】被目标角色使用的【闪】抵消时，你可以弃置两张牌，令此【杀】依然生效。'
  },
  {
    name: '方天画戟',
    suit: 'spade',
    number: 12,
    type: 'equip',
    equipType: 'weapon',
    description: '攻击范围：4。当你使用【杀】指定目标后，你可以选择一名其他角色，令其也成为此【杀】的目标。'
  },
  {
    name: '麒麟弓',
    suit: 'heart',
    number: 5,
    type: 'equip',
    equipType: 'weapon',
    description: '攻击范围：5。当你使用【杀】对目标角色造成伤害时，你可以弃置其装备区里的一张坐骑牌。'
  },

  // 防具
  {
    name: '八卦阵',
    suit: 'spade',
    number: 2,
    type: 'equip',
    equipType: 'armor',
    description: '当你需要使用或打出一张【闪】时，你可以进行判定：若结果为红色，则视为你使用或打出了一张【闪】。'
  },
  {
    name: '仁王盾',
    suit: 'club',
    number: 2,
    type: 'equip',
    equipType: 'armor',
    description: '锁定技，黑色的【杀】对你无效。'
  },

  // 防御马
  {
    name: '的卢',
    suit: 'club',
    number: 5,
    type: 'equip',
    equipType: 'defendHorse',
    description: '其他角色计算与你的距离+1。'
  },
  {
    name: '绝影',
    suit: 'spade',
    number: 5,
    type: 'equip',
    equipType: 'defendHorse',
    description: '其他角色计算与你的距离+1。'
  },

  // 进攻马
  {
    name: '赤兔',
    suit: 'heart',
    number: 5,
    type: 'equip',
    equipType: 'offenseHorse',
    description: '你计算与其他角色的距离-1。'
  },
  {
    name: '紫骍',
    suit: 'diamond',
    number: 13,
    type: 'equip',
    equipType: 'offenseHorse',
    description: '你计算与其他角色的距离-1。'
  }
]

// 导出所有卡牌
export const allCards: Omit<Card, 'id'>[] = [
  ...basicCards,
  ...trickCards,
  ...equipCards
]