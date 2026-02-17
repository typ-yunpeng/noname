import type { Card, Player, Game } from '@/types'
import { GameEngine } from './game'

/**
 * 卡牌效果处理器
 * 处理各种卡牌的使用效果
 */

/**
 * 获取游戏引擎实例的日志记录器
 */
function getLogger(game: Game) {
  if (game instanceof GameEngine) {
    return (game as any).logger
  }
  return null
}

/**
 * 记录日志
 */
function log(game: Game, type: 'info' | 'success' | 'warning' | 'error' | 'card' | 'skill' | 'damage' | 'recover', message: string) {
  const logger = getLogger(game)
  if (logger) {
    logger[type](message)
  }
}

/**
 * 基本牌效果
 */
export const basicCardEffects = {
  /**
   * 杀
   * 对目标造成1点伤害，目标可以使用闪来抵消
   */
  杀: async (user: Player, target: Player, game: Game) => {
    console.log('=== 杀的效果开始执行 ===')
    console.log(`${user.character.name} 对 ${target.character.name} 使用了杀`)
    log(game, 'card', `${user.character.name} 对 ${target.character.name} 使用了【杀】`)
    
    // 检查目标是否在攻击范围内
    const attackRange = user.character.skills.some(s => s.id === 'wusheng') ? 3 : 1
    // 简化处理，暂时不检查攻击距离
    
    // 检查目标是否有闪
    const hasShan = target.handCards.some(card => card.name === '闪')
    console.log(`${target.character.name} 是否有闪:`, hasShan)
    
    // 无论是否有闪，都进入等待响应状态，让玩家手动确认
    console.log('设置等待响应状态')
    if (hasShan) {
      log(game, 'info', `${target.character.name} 可以使用【闪】来抵消【杀】`)
    } else {
      log(game, 'info', `${target.character.name} 没有【闪】，将受到1点伤害`)
    }
    
    // 设置游戏状态为等待响应
    if (game instanceof GameEngine) {
      game.state.waitingForResponse = true
      game.state.responseTarget = target
      game.state.responseCard = '闪'
      game.state.responseHasCard = hasShan // 记录是否有闪
      console.log('等待响应状态已设置:', game.state.waitingForResponse)
    }
    // 注意：实际使用闪的逻辑需要在玩家选择后执行
    // 这里只是设置状态，等待玩家操作
    console.log('=== 杀的效果执行完毕 ===')
  },
  
  /**
   * 闪
   * 抵消杀的效果
   */
  闪: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 使用了闪`)
    // 闪通常是被动的，不主动使用
  },
  
  /**
   * 桃
   * 回复1点体力
   */
  桃: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 对 ${target.character.name} 使用了桃`)
    log(game, 'recover', `${target.character.name} 回复了1点体力`)
    target.recover(1)
  }
}

/**
 * 锦囊牌效果
 */
export const trickCardEffects = {
  /**
   * 过河拆桥
   * 弃掉目标的一张牌（手牌或装备）
   */
  过河拆桥: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 对 ${target.character.name} 使用了过河拆桥`)
    
    // 优先弃装备，其次弃手牌
    const equipCards = Object.values(target.equipCards).filter(card => card !== undefined)
    
    if (equipCards.length > 0) {
      // 随机弃一张装备
      const randomEquip = equipCards[Math.floor(Math.random() * equipCards.length)]
      if (randomEquip) {
        console.log(`${target.character.name} 的 ${randomEquip.name} 被弃掉了`)
        log(game, 'warning', `${target.character.name} 的装备【${randomEquip.name}】被弃掉了`)
        // 移除装备
        if (randomEquip.equipType) {
          target.equipCards[randomEquip.equipType as keyof typeof target.equipCards] = undefined
        }
      }
    } else if (target.handCards.length > 0) {
      // 随机弃一张手牌
      const randomIndex = Math.floor(Math.random() * target.handCards.length)
      const card = target.handCards.splice(randomIndex, 1)[0]
      console.log(`${target.character.name} 的 ${card.name} 被弃掉了`)
      log(game, 'warning', `${target.character.name} 的手牌【${card.name}】被弃掉了`)
    }
  },
  
  /**
   * 顺手牵羊
   * 获得目标的一张手牌
   */
  顺手牵羊: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 对 ${target.character.name} 使用了顺手牵羊`)
    
    if (target.handCards.length > 0) {
      // 随机获得一张手牌
      const randomIndex = Math.floor(Math.random() * target.handCards.length)
      const card = target.handCards.splice(randomIndex, 1)[0]
      user.handCards.push(card)
      console.log(`${user.character.name} 获得了 ${card.name}`)
      log(game, 'card', `${user.character.name} 获得了【${card.name}】`)
    }
  },
  
  /**
   * 无中生有
   * 摸两张牌
   */
  无中生有: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 使用了无中生有`)
    game.drawCard(user, 2)
  },
  
  /**
   * 决斗
   * 与目标进行决斗，双方轮流出杀，不出杀的一方受到1点伤害
   */
  决斗: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 对 ${target.character.name} 发起了决斗`)
    
    // 简化处理：随机决定胜负
    const userHasSha = user.handCards.some(card => card.name === '杀')
    const targetHasSha = target.handCards.some(card => card.name === '杀')
    
    if (!userHasSha && !targetHasSha) {
      // 双方都没有杀，发起者受到伤害
      user.takeDamage(1)
    } else if (userHasSha && !targetHasSha) {
      // 目标没有杀，目标受到伤害
      target.takeDamage(1)
    } else if (!userHasSha && targetHasSha) {
      // 发起者没有杀，发起者受到伤害
      user.takeDamage(1)
    } else {
      // 双方都有杀，随机决定
      const loser = Math.random() > 0.5 ? user : target
      loser.takeDamage(1)
    }
  },
  
  /**
   * 南蛮入侵
   * 所有其他玩家必须使用杀，否则受到1点伤害
   */
  南蛮入侵: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 对 ${target.character.name} 使用了南蛮入侵`)
    
    const hasSha = target.handCards.some((card: any) => card.name === '杀')
    
    if (hasSha) {
      console.log(`${target.character.name} 使用杀抵消了南蛮入侵`)
      log(game, 'card', `${target.character.name} 使用【杀】抵消了【南蛮入侵】`)
      const shaIndex = target.handCards.findIndex((card: any) => card.name === '杀')
      if (shaIndex !== -1) {
        target.handCards.splice(shaIndex, 1)
      }
    } else {
      console.log(`${target.character.name} 受到南蛮入侵的伤害`)
      log(game, 'damage', `${target.character.name} 受到【南蛮入侵】的伤害`)
      target.takeDamage(1)
    }
  },
  
  /**
   * 万箭齐发
   * 所有其他玩家必须使用闪，否则受到1点伤害
   */
  万箭齐发: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 对 ${target.character.name} 使用了万箭齐发`)
    
    const hasShan = target.handCards.some((card: any) => card.name === '闪')
    
    if (hasShan) {
      console.log(`${target.character.name} 使用闪抵消了万箭齐发`)
      log(game, 'card', `${target.character.name} 使用【闪】抵消了【万箭齐发】`)
      const shanIndex = target.handCards.findIndex((card: any) => card.name === '闪')
      if (shanIndex !== -1) {
        target.handCards.splice(shanIndex, 1)
      }
    } else {
      console.log(`${target.character.name} 受到万箭齐发的伤害`)
      log(game, 'damage', `${target.character.name} 受到【万箭齐发】的伤害`)
      target.takeDamage(1)
    }
  },
  
  /**
   * 无懈可击
   * 抵消锦囊牌的效果
   */
  无懈可击: async (user: Player, target: Player, game: Game) => {
    console.log(`${user.character.name} 使用了无懈可击`)
    // 无懈可击需要特殊处理，通常在锦囊牌使用时触发
  }
}

/**
 * 装备牌效果
 */
export const equipCardEffects = {
  /**
   * 装备武器
   */
  weapon: async (user: Player, card: Card, game: Game) => {
    console.log(`${user.character.name} 装备了 ${card.name}`)
    log(game, 'info', `${user.character.name} 装备了【${card.name}】`)
    user.equip(card)
  },
  
  /**
   * 装备防具
   */
  armor: async (user: Player, card: Card, game: Game) => {
    console.log(`${user.character.name} 装备了 ${card.name}`)
    log(game, 'info', `${user.character.name} 装备了【${card.name}】`)
    user.equip(card)
  },
  
  /**
   * 装备防御马
   */
  defendHorse: async (user: Player, card: Card, game: Game) => {
    console.log(`${user.character.name} 装备了 ${card.name}`)
    log(game, 'info', `${user.character.name} 装备了【${card.name}】`)
    user.equip(card)
  },
  
  /**
   * 装备进攻马
   */
  offenseHorse: async (user: Player, card: Card, game: Game) => {
    console.log(`${user.character.name} 装备了 ${card.name}`)
    log(game, 'info', `${user.character.name} 装备了【${card.name}】`)
    user.equip(card)
  }
}

/**
 * 执行卡牌效果
 */
export async function executeCardEffect(
  card: Card,
  user: Player,
  targets: Player[],
  game: Game
): Promise<void> {
  // 根据卡牌类型执行不同的效果
  if (card.type === 'basic') {
    const effect = basicCardEffects[card.name as keyof typeof basicCardEffects]
    if (effect) {
      if (targets.length > 0) {
        await effect(user, targets[0], game)
      } else {
        // 不需要目标的卡牌（如桃、无中生有）
        await effect(user, user, game)
      }
    }
  } else if (card.type === 'trick') {
    const effect = trickCardEffects[card.name as keyof typeof trickCardEffects]
    if (effect) {
      // 对每个目标执行效果
      if (targets.length > 0) {
        for (const target of targets) {
          await effect(user, target, game)
        }
      } else {
        await effect(user, user, game)
      }
    }
  } else if (card.type === 'equip') {
    const equipType = card.equipType
    if (equipType) {
      const effect = equipCardEffects[equipType as keyof typeof equipCardEffects]
      if (effect) {
        await effect(user, card, game)
      }
    }
  }
}