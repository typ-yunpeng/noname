import type { Player, Game, Card, Skill } from '@/types'

/**
 * AI控制管理
 * 处理AI玩家的自动操作逻辑
 */
export function useAIControl(player: Player, game: Game) {
  /**
   * AI执行出牌阶段
   */
  const executePlayPhase = async () => {
    console.log(`${player.character.name} (AI) 开始出牌`)
    
    // 简单的AI策略：
    // 1. 优先使用桃回复体力
    // 2. 使用杀攻击敌人
    // 3. 使用锦囊牌
    // 4. 装备装备牌
    
    let actionCount = 0
    const maxActions = 3 // 最多执行3次操作
    
    while (actionCount < maxActions && game.state.phase === 'play') {
      const action = decideNextAction()
      
      if (!action) {
        break
      }
      
      await executeAction(action)
      actionCount++
      
      // 等待一段时间，让玩家看清AI的操作
      await sleep(1000)
    }
    
    // 结束出牌阶段
    console.log(`${player.character.name} (AI) 结束出牌`)
    game.nextPhase()
  }
  
  /**
   * 决定下一个操作
   */
  const decideNextAction = (): { type: 'card' | 'skill'; card?: Card; skill?: Skill; targets?: Player[] } | null => {
    // 1. 优先使用桃回复体力
    if (player.hp < player.maxHp) {
      const peach = player.handCards.find(card => card.name === '桃')
      if (peach) {
        return { type: 'card', card: peach, targets: [] }
      }
    }
    
    // 2. 使用杀攻击敌人
    const sha = player.handCards.find(card => card.name === '杀')
    if (sha) {
      const target = selectTargetForSha()
      if (target) {
        return { type: 'card', card: sha, targets: [target] }
      }
    }
    
    // 3. 使用锦囊牌
    const trickCard = player.handCards.find(card => card.type === 'trick')
    if (trickCard) {
      const targets = selectTargetsForCard(trickCard)
      return { type: 'card', card: trickCard, targets }
    }
    
    // 4. 装备装备牌
    const equipCard = player.handCards.find(card => card.type === 'equip')
    if (equipCard) {
      return { type: 'card', card: equipCard, targets: [] }
    }
    
    // 5. 使用主动技能
    const activeSkill = player.character.skills.find(skill => skill.active && canUseSkill(skill))
    if (activeSkill) {
      return { type: 'skill', skill: activeSkill, targets: [] }
    }
    
    return null
  }
  
  /**
   * 执行操作
   */
  const executeAction = async (action: { type: 'card' | 'skill'; card?: Card; skill?: Skill; targets?: Player[] }) => {
    if (action.type === 'card' && action.card) {
      console.log(`${player.character.name} (AI) 使用 ${action.card.name}`)
      await game.useCard(player, action.card, action.targets || [])
    } else if (action.type === 'skill' && action.skill) {
      console.log(`${player.character.name} (AI) 使用技能 ${action.skill.name}`)
      try {
        action.skill.execute(player, game)
      } catch (error) {
        console.error(`AI技能执行失败: ${action.skill.name}`, error)
      }
    }
  }
  
  /**
   * 为杀选择目标
   */
  const selectTargetForSha = (): Player | null => {
    // 选择体力最低的敌人
    const enemies = game.players.filter(p => 
      p.id !== player.id && 
      p.status === 'alive' &&
      isEnemy(p)
    )
    
    if (enemies.length === 0) return null
    
    // 按体力排序，选择体力最低的
    enemies.sort((a, b) => a.hp - b.hp)
    return enemies[0]
  }
  
  /**
   * 为卡牌选择目标
   */
  const selectTargetsForCard = (card: Card): Player[] => {
    const targets: Player[] = []
    
    if (card.name === '过河拆桥' || card.name === '顺手牵羊' || card.name === '决斗') {
      // 选择一个敌人
      const target = selectTargetForSha()
      if (target) {
        targets.push(target)
      }
    } else if (card.name === '南蛮入侵' || card.name === '万箭齐发') {
      // 选择所有敌人
      const enemies = game.players.filter(p => 
        p.id !== player.id && 
        p.status === 'alive' &&
        isEnemy(p)
      )
      targets.push(...enemies)
    }
    
    return targets
  }
  
  /**
   * 判断是否为敌人
   */
  const isEnemy = (target: Player): boolean => {
    // 简化处理：根据身份判断
    if (player.identity === 'zhu') {
      // 主公的敌人是反贼和内奸
      return target.identity === 'fan' || target.identity === 'nei'
    } else if (player.identity === 'zhong') {
      // 忠臣的敌人是反贼和内奸
      return target.identity === 'fan' || target.identity === 'nei'
    } else if (player.identity === 'fan') {
      // 反贼的敌人是主公和忠臣
      return target.identity === 'zhu' || target.identity === 'zhong'
    } else if (player.identity === 'nei') {
      // 内奸的敌人是所有人
      return true
    }
    
    return false
  }
  
  /**
   * 判断是否可以使用技能
   */
  const canUseSkill = (skill: Skill): boolean => {
    if (!player.isTurn) return false
    
    const currentPhase = game.state.phase
    const canTrigger = skill.trigger.some(trigger => {
      if (trigger === 'phaseBegin' || trigger === 'phaseEnd') {
        return true
      }
      if (trigger === 'useCard' && currentPhase === 'play') {
        return true
      }
      return false
    })
    
    return canTrigger
  }
  
  /**
   * 睡眠函数
   */
  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  return {
    executePlayPhase
  }
}