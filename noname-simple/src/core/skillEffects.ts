import type { Skill, Player, Game } from '@/types'

/**
 * 武将技能效果处理器
 * 处理各种武将技能的效果
 */

/**
 * 主动技能效果
 */
export const activeSkillEffects = {
  /**
   * 制衡（孙权）
   * 弃置任意张牌，然后摸等量的牌
   */
  zhiheng: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动制衡`)
    
    // 简化处理：随机弃一半手牌，然后摸等量的牌
    const discardCount = Math.floor(player.handCards.length / 2)
    if (discardCount > 0) {
      const cardsToDiscard = player.handCards.splice(0, discardCount)
      console.log(`${player.character.name} 弃掉了 ${discardCount} 张牌`)
      game.drawCard(player, discardCount)
    }
  },
  
  /**
   * 观星（诸葛亮）
   * 观看牌堆顶的五张牌，然后将这些牌以任意顺序放回牌堆顶或牌堆底
   */
  guanxing: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动观星`)
    // 简化处理：摸一张牌
    game.drawCard(player, 1)
  },
  
  /**
   * 结姻（孙尚香）
   * 弃置两张手牌，然后令一名其他角色回复1点体力
   */
  jieyin: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动结姻`)
    
    if (player.handCards.length >= 2) {
      // 弃置两张手牌
      const cardsToDiscard = player.handCards.splice(0, 2)
      console.log(`${player.character.name} 弃掉了 2 张牌`)
      
      // 简化处理：自己回复1点体力
      player.recover(1)
    }
  },
  
  /**
   * 突袭（张辽）
   * 放弃摸牌，改为获得最多两名其他角色的各一张手牌
   */
  tuxi: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动突袭`)
    
    // 简化处理：从其他玩家那里获得一张牌
    const otherPlayers = game.players.filter(p => p.id !== player.id && p.status === 'alive')
    if (otherPlayers.length > 0) {
      const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
      if (target.handCards.length > 0) {
        const cardIndex = Math.floor(Math.random() * target.handCards.length)
        const card = target.handCards.splice(cardIndex, 1)[0]
        player.handCards.push(card)
        console.log(`${player.character.name} 从 ${target.character.name} 那里获得了 ${card.name}`)
      }
    }
  },
  
  /**
   * 裸衣（许褚）
   * 少摸一张牌，然后本回合使用【杀】或【决斗】造成的伤害+1
   */
  luoyi: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动裸衣`)
    // 简化处理：只记录状态，实际伤害+1在卡牌效果中处理
  },
  
  /**
   * 除疠（华佗）
   * 选择一名其他角色，弃置其区域内的一张牌
   */
  chuli: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动除疠`)
    
    const otherPlayers = game.players.filter(p => p.id !== player.id && p.status === 'alive')
    if (otherPlayers.length > 0) {
      const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
      
      // 优先弃装备
      const equipCards = Object.values(target.equipCards).filter(card => card !== undefined)
      if (equipCards.length > 0) {
        const randomEquip = equipCards[Math.floor(Math.random() * equipCards.length)]
        if (randomEquip && randomEquip.equipType) {
          target.equipCards[randomEquip.equipType as keyof typeof target.equipCards] = undefined
          console.log(`${target.character.name} 的 ${randomEquip.name} 被弃掉了`)
        }
      } else if (target.handCards.length > 0) {
        const cardIndex = Math.floor(Math.random() * target.handCards.length)
        const card = target.handCards.splice(cardIndex, 1)[0]
        console.log(`${target.character.name} 的 ${card.name} 被弃掉了`)
      }
    }
  },
  
  /**
   * 仁望（刘备）
   * 将一张手牌交给一名其他角色
   */
  renwang: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动仁望`)
    
    if (player.handCards.length > 0) {
      const cardIndex = Math.floor(Math.random() * player.handCards.length)
      const card = player.handCards.splice(cardIndex, 1)[0]
      
      const otherPlayers = game.players.filter(p => p.id !== player.id && p.status === 'alive')
      if (otherPlayers.length > 0) {
        const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
        target.handCards.push(card)
        console.log(`${player.character.name} 将 ${card.name} 给了 ${target.character.name}`)
      }
    }
  },
  
  /**
   * 离间（貂蝉）
   * 弃置一张手牌并选择两名男性角色，令其中一名角色对另一名角色使用一张【杀】
   */
  lihun: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动离间`)
    
    if (player.handCards.length > 0) {
      const cardIndex = Math.floor(Math.random() * player.handCards.length)
      player.handCards.splice(cardIndex, 1)
      
      // 简化处理：随机选择一个目标造成1点伤害
      const otherPlayers = game.players.filter(p => p.id !== player.id && p.status === 'alive')
      if (otherPlayers.length > 0) {
        const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
        target.takeDamage(1)
      }
    }
  }
}

/**
 * 被动技能效果
 */
export const passiveSkillEffects = {
  /**
   * 奸雄（曹操）
   * 受到伤害后，获得伤害来源的一张牌
   */
  jianxiong: async (player: Player, game: Game, damageSource?: Player) => {
    console.log(`${player.character.name} 发动奸雄`)
    
    if (damageSource && damageSource.id !== player.id) {
      if (damageSource.handCards.length > 0) {
        const cardIndex = Math.floor(Math.random() * damageSource.handCards.length)
        const card = damageSource.handCards.splice(cardIndex, 1)[0]
        player.handCards.push(card)
        console.log(`${player.character.name} 获得了 ${card.name}`)
      }
    }
  },
  
  /**
   * 反馈（司马懿）
   * 受到伤害后，获得伤害来源的一张牌
   */
  fanhui: async (player: Player, game: Game, damageSource?: Player) => {
    console.log(`${player.character.name} 发动反馈`)
    
    if (damageSource && damageSource.id !== player.id) {
      if (damageSource.handCards.length > 0) {
        const cardIndex = Math.floor(Math.random() * damageSource.handCards.length)
        const card = damageSource.handCards.splice(cardIndex, 1)[0]
        player.handCards.push(card)
        console.log(`${player.character.name} 获得了 ${card.name}`)
      }
    }
  },
  
  /**
   * 刚烈（夏侯惇）
   * 受到伤害后，进行判定：若结果不为红色，选择一名其他角色，令其受到1点伤害
   */
  ganglie: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动刚烈`)
    
    // 简化处理：50%概率对其他角色造成1点伤害
    if (Math.random() > 0.5) {
      const otherPlayers = game.players.filter(p => p.id !== player.id && p.status === 'alive')
      if (otherPlayers.length > 0) {
        const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)]
        target.takeDamage(1)
        console.log(`${target.character.name} 受到刚烈伤害`)
      }
    }
  },
  
  /**
   * 英姿（周瑜）
   * 摸牌阶段多摸一张牌
   */
  yingzi: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动英姿`)
    game.drawCard(player, 1)
  },
  
  /**
   * 集智（黄月英）
   * 使用非延时类锦囊牌时，展示牌堆顶的一张牌
   */
  jizhi: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动集智`)
    // 简化处理：摸一张牌
    game.drawCard(player, 1)
  },
  
  /**
   * 铁骑（马超）
   * 使用【杀】时，进行判定：若结果为红色，此【杀】不可被【闪】响应
   */
  tieqi: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动铁骑`)
    // 简化处理：记录状态，实际效果在卡牌效果中处理
  },
  
  /**
   * 天妒（郭嘉）
   * 判定牌生效后，获得此牌
   */
  tiandu: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动天妒`)
    // 简化处理：摸一张牌
    game.drawCard(player, 1)
  },
  
  /**
   * 连营（陆逊）
   * 失去手牌后，若没有手牌，摸一张牌
   */
  lianying: async (player: Player, game: Game) => {
    console.log(`${player.character.name} 发动连营`)
    if (player.handCards.length === 0) {
      game.drawCard(player, 1)
    }
  }
}

/**
 * 锁定技效果
 */
export const lockedSkillEffects = {
  /**
   * 咆哮（张飞）
   * 使用【杀】无次数限制
   */
  paoxiao: async (player: Player, game: Game) => {
    // 锁定技，自动生效
    console.log(`${player.character.name} 的咆哮生效`)
  },
  
  /**
   * 无双（吕布）
   * 使用【杀】时，目标需使用两张【闪】；进行【决斗】时，对手需打出两张【杀】
   */
  wushuang: async (player: Player, game: Game) => {
    // 锁定技，自动生效
    console.log(`${player.character.name} 的无双生效`)
  },
  
  /**
   * 武圣（关羽）
   * 可以将红色牌当【杀】使用
   */
  wusheng: async (player: Player, game: Game) => {
    // 锁定技，自动生效
    console.log(`${player.character.name} 的武圣生效`)
  },
  
  /**
   * 龙胆（赵云）
   * 可以将【杀】当【闪】使用，或将【闪】当【杀】使用
   */
  longdan: async (player: Player, game: Game) => {
    // 锁定技，自动生效
    console.log(`${player.character.name} 的龙胆生效`)
  },
  
  /**
   * 奇袭（甘宁）
   * 可以将黑色牌当【过河拆桥】使用
   */
  qixi: async (player: Player, game: Game) => {
    // 锁定技，自动生效
    console.log(`${player.character.name} 的奇袭生效`)
  },
  
  /**
   * 克己（吕蒙）
   * 未于出牌阶段使用或打出过【杀】，可以跳过弃牌阶段
   */
  keji: async (player: Player, game: Game) => {
    // 锁定技，自动生效
    console.log(`${player.character.name} 的克己生效`)
  }
}

/**
 * 执行技能效果
 */
export async function executeSkillEffect(
  skill: Skill,
  player: Player,
  game: Game,
  extraData?: any
): Promise<void> {
  // 根据技能类型执行不同的效果
  if (skill.active) {
    // 主动技能
    const effect = activeSkillEffects[skill.id as keyof typeof activeSkillEffects]
    if (effect) {
      await effect(player, game)
    }
  } else {
    // 被动技能或锁定技
    const passiveEffect = passiveSkillEffects[skill.id as keyof typeof passiveSkillEffects]
    if (passiveEffect) {
      await passiveEffect(player, game, extraData?.damageSource)
      return
    }
    
    const lockedEffect = lockedSkillEffects[skill.id as keyof typeof lockedSkillEffects]
    if (lockedEffect) {
      await lockedEffect(player, game)
    }
  }
}