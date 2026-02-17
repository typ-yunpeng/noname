import { ref, computed, toRefs } from 'vue'
import type { Player, Game, Card, Skill, PlayerControlState, PlayerControl } from '@/types'

/**
 * 玩家控制管理
 * 处理玩家操作的等待、选择卡牌、选择目标等逻辑
 */
export function usePlayerControl(player: Player, game: Game) {
  // 玩家控制状态
  const controlState = ref<PlayerControlState>('idle')
  
  // 选中的卡牌
  const selectedCard = ref<Card | null>(null)
  
  // 选中的目标玩家
  const selectedTargets = ref<Player[]>([])
  
  // 选中的技能
  const selectedSkill = ref<Skill | null>(null)
  
  // 当前需要选择的目标数量
  const requiredTargetCount = ref(0)
  
  // 选中的弃牌
  const selectedDiscards = ref<Card[]>([])
  
  // 需要弃置的卡牌数量
  const requiredDiscardCount = ref(0)
  
  // 是否为人类玩家
  const isHuman = ref(true) // 默认所有玩家都是人类玩家
  
  /**
   * 判断是否可以使用卡牌
   */
  const canUseCard = (card: Card): boolean => {
    // 闪不能主动使用，只能在响应杀或万箭齐发时使用
    if (card.name === '闪') {
      // 只有在等待响应状态，且响应卡牌是闪时才能使用
      if (!game.state.waitingForResponse) return false
      if (game.state.responseCard !== '闪') return false
      if (game.state.responseTarget?.id !== player.id) return false
      return true
    }
    
    // 只有当前回合的玩家在出牌阶段才能使用卡牌
    if (!player.isTurn) return false
    if (game.state.phase !== 'play') return false
    
    // 检查桃的使用条件：只有当前体力小于体力上限时才能使用
    if (card.name === '桃') {
      if (player.hp >= player.maxHp) {
        return false
      }
    }
    
    // 检查杀的使用次数限制
    if (card.name === '杀') {
      // 默认每回合只能使用1张杀
      const maxShaCount = 1
      if (player.shaCount >= maxShaCount) {
        return false
      }
    }
    
    // 基本牌和锦囊牌可以在出牌阶段使用
    if (card.type === 'basic' || card.type === 'trick') return true
    
    // 装备牌需要特殊处理
    if (card.type === 'equip') {
      const equipType = card.equipType
      if (equipType && player.equipCards[equipType as keyof typeof player.equipCards]) {
        return false
      }
      return true
    }
    
    return false
  }
  
  /**
   * 获取卡牌需要的目标数量
   */
  const getRequiredTargetCount = (card: Card): number => {
    // 根据卡牌类型返回需要的目标数量
    // 杀：需要1个目标
    if (card.name === '杀') return 1
    
    // 顺手牵羊：需要1个目标
    if (card.name === '顺手牵羊') return 1
    
    // 过河拆桥：需要1个目标
    if (card.name === '过河拆桥') return 1
    
    // 决斗：需要1个目标
    if (card.name === '决斗') return 1
    
    // 南蛮入侵、万箭齐发：需要所有其他玩家
    if (card.name === '南蛮入侵' || card.name === '万箭齐发') {
      return game.players.filter((p: Player) => p.id !== player.id && p.status === 'alive').length
    }
    
    // 无中生有、无懈可击、桃：不需要目标
    return 0
  }
  
  /**
   * 开始选择卡牌
   */
  const startSelectCard = () => {
    controlState.value = 'selectingCard'
    selectedCard.value = null
    selectedTargets.value = []
    selectedSkill.value = null
    game.state.waitingForPlayer = true
  }
  
  /**
   * 选择卡牌
   */
  const selectCard = (card: Card) => {
    // 如果正在为武圣技能选择卡牌
    if (controlState.value === 'selectingCardForSkill') {
      // 只能选择红色牌
      if (card.suit !== 'heart' && card.suit !== 'diamond') {
        return
      }
      
      // 选中卡牌
      selectedCard.value = card
      
      // 武圣技能将红色牌当杀使用，需要选择目标
      requiredTargetCount.value = 1
      controlState.value = 'selectingTarget'
      return
    }
    
    // 检查是否是响应卡牌的情况
    const isResponseCard = game.state.waitingForResponse &&
                          game.state.responseTarget?.id === player.id &&
                          game.state.responseCard === card.name
    
    if (!isResponseCard && !canUseCard(card)) return
    
    // 如果已经选中该卡牌，取消选中
    if (selectedCard.value?.id === card.id) {
      cancelSelection()
      return
    }
    
    // 选中卡牌
    selectedCard.value = card
    controlState.value = 'selectingCard'
    
    // 检查是否需要选择目标
    const targetCount = getRequiredTargetCount(card)
    if (targetCount > 0) {
      requiredTargetCount.value = targetCount
      controlState.value = 'selectingTarget'
    } else {
      // 不需要目标，进入确认状态
      controlState.value = 'confirming'
    }
  }
  
  /**
   * 选择目标玩家
   */
  const selectTarget = (target: Player) => {
    if (controlState.value !== 'selectingTarget') return
    
    // 不能选择自己（除非特殊卡牌）
    if (target.id === player.id) return
    
    // 不能选择已死亡玩家
    if (target.status === 'dead') return
    
    // 检查是否已经选中
    const index = selectedTargets.value.findIndex((p: Player) => p.id === target.id)
    if (index !== -1) {
      // 取消选中
      selectedTargets.value.splice(index, 1)
    } else {
      // 添加选中
      selectedTargets.value.push(target)
    }
    
    // 检查是否已经选择了足够的目标
    if (selectedTargets.value.length >= requiredTargetCount.value) {
      // 进入确认状态
      controlState.value = 'confirming'
    }
  }
  
  /**
   * 开始选择技能
   */
  const startSelectSkill = (skill: Skill) => {
    if (!canUseSkill(skill)) return
    
    selectedSkill.value = skill
    selectedCard.value = null
    selectedTargets.value = []
    controlState.value = 'selectingSkill'
    game.state.waitingForPlayer = true
    
    // 武圣技能需要选择一张红色牌
    if (skill.id === 'wusheng') {
      controlState.value = 'selectingCardForSkill'
    } else {
      // 其他技能直接进入确认状态
      controlState.value = 'confirming'
    }
  }
  
  /**
   * 判断是否可以使用技能
   */
  const canUseSkill = (skill: Skill): boolean => {
    // 只有当前回合的玩家才能使用主动技能
    if (!player.isTurn) return false
    
    // 检查技能是否在当前阶段可以触发
    const currentPhase = game.state.phase
    const canTrigger = skill.trigger.some(trigger => {
      // 主动技能通常在出牌阶段使用
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
   * 确认操作
   */
  const confirmAction = async () => {
    if (controlState.value !== 'confirming') return
    
    if (selectedCard.value && selectedSkill.value && selectedSkill.value.id === 'wusheng') {
      // 武圣技能：将红色牌当杀使用
      // 创建一张杀牌
      const shaCard = {
        ...selectedCard.value,
        name: '杀',
        type: 'basic' as const
      }
      
      // 使用杀牌
      await game.useCard(player, shaCard, selectedTargets.value)
      
      // 记录技能使用
      console.log(`${player.character.name} 发动武圣，将 ${selectedCard.value.name} 当杀使用`)
    } else if (selectedCard.value) {
      // 使用卡牌
      await game.useCard(player, selectedCard.value, selectedTargets.value)
    } else if (selectedSkill.value) {
      // 使用技能
      try {
        selectedSkill.value.execute(player, game)
      } catch (error) {
        console.error(`技能执行失败: ${selectedSkill.value.name}`, error)
      }
    }
    
    // 清空选择
    cancelSelection()
  }
  
  /**
   * 取消选择
   */
  const cancelSelection = () => {
    selectedCard.value = null
    selectedTargets.value = []
    selectedSkill.value = null
    selectedDiscards.value = []
    requiredDiscardCount.value = 0
    controlState.value = 'idle'
    game.state.waitingForPlayer = false
  }
  
  /**
   * 结束出牌阶段
   */
  const endPlayPhase = () => {
    if (game.state.phase === 'play') {
      cancelSelection()
      
      // 计算需要弃置的卡牌数量
      const handCardCount = player.handCards.length
      const maxHandCards = player.hp
      
      if (handCardCount > maxHandCards) {
        // 需要弃牌
        requiredDiscardCount.value = handCardCount - maxHandCards
        selectedDiscards.value = []
        controlState.value = 'selectingDiscard'
        game.state.waitingForPlayer = true
      } else {
        // 不需要弃牌，直接进入下一阶段
        game.nextPhase()
      }
    }
  }
  
  /**
   * 选择要弃置的卡牌
   */
  const selectDiscardCard = (card: Card) => {
    if (controlState.value !== 'selectingDiscard') return
    
    // 检查是否已经选中
    const index = selectedDiscards.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      // 取消选中
      selectedDiscards.value.splice(index, 1)
    } else {
      // 添加选中
      if (selectedDiscards.value.length < requiredDiscardCount.value) {
        selectedDiscards.value.push(card)
      }
    }
    
    // 检查是否已经选择了足够的卡牌
    if (selectedDiscards.value.length >= requiredDiscardCount.value) {
      controlState.value = 'confirming'
    }
  }
  
  /**
   * 确认弃牌
   */
  const confirmDiscard = () => {
    if (controlState.value !== 'confirming' || selectedDiscards.value.length === 0) return
    
    // 弃置选中的卡牌
    game.discardCard(player, selectedDiscards.value)
    
    // 清空选择
    selectedDiscards.value = []
    requiredDiscardCount.value = 0
    controlState.value = 'idle'
    game.state.waitingForPlayer = false
    
    // 进入下一阶段
    game.nextPhase()
  }
  
  /**
   * 计算两个玩家之间的距离
   */
  const calculateDistance = (target: Player): number => {
    const playerIndex = game.players.findIndex((p: Player) => p.id === player.id)
    const targetIndex = game.players.findIndex((p: Player) => p.id === target.id)
    
    if (playerIndex === -1 || targetIndex === -1) return Infinity
    
    const playerCount = game.players.length
    // 计算顺时针和逆时针的距离，取较小值
    const distance1 = Math.abs(targetIndex - playerIndex)
    const distance2 = playerCount - distance1
    
    return Math.min(distance1, distance2)
  }
  
  /**
   * 判断玩家是否可以被选中为目标
   */
  const canSelectAsTarget = (target: Player): boolean => {
    if (controlState.value !== 'selectingTarget') return false
    if (target.id === player.id) return false
    if (target.status === 'dead') return false
    
    // 检查是否已经选中
    const index = selectedTargets.value.findIndex((p: Player) => p.id === target.id)
    if (index !== -1) return true
    
    // 检查是否还可以选择更多目标
    if (selectedTargets.value.length >= requiredTargetCount.value) return false
    
    // 检查卡牌的距离限制
    if (selectedCard.value) {
      const card = selectedCard.value
      const distance = calculateDistance(target)
      
      // 顺手牵羊和过河拆桥只能对距离为1的玩家使用
      if (card.name === '顺手牵羊' || card.name === '过河拆桥') {
        if (distance > 1) return false
      }
      
      // 杀的攻击距离默认为1，如果有武器则增加攻击距离
      if (card.name === '杀') {
        const attackRange = player.equipCards.weapon ? 3 : 1
        if (distance > attackRange) return false
      }
    }
    
    return true
  }
  
  /**
   * 判断玩家是否已被选中为目标
   */
  const isTargetSelected = (target: Player): boolean => {
    return selectedTargets.value.some((p: Player) => p.id === target.id)
  }
  
  /**
   * 获取当前控制信息
   */
  const getControlInfo = (): PlayerControl => {
    return {
      playerId: player.id,
      isHuman: isHuman.value,
      controlState: controlState.value,
      selectedCard: selectedCard.value || undefined,
      selectedTargets: selectedTargets.value,
      selectedSkill: selectedSkill.value || undefined,
      requiredTargetCount: requiredTargetCount.value
    }
  }
  
  /**
   * 设置玩家类型（人类或AI）
   */
  const setPlayerType = (human: boolean) => {
    isHuman.value = human
  }
  
  // 返回所有ref，让Vue模板自动解包
  return {
    controlState,
    selectedCard,
    selectedTargets,
    selectedSkill,
    requiredTargetCount,
    selectedDiscards,
    requiredDiscardCount,
    isHuman,
    canUseCard,
    getRequiredTargetCount,
    startSelectCard,
    selectCard,
    selectTarget,
    startSelectSkill,
    canUseSkill,
    confirmAction,
    cancelSelection,
    endPlayPhase,
    selectDiscardCard,
    confirmDiscard,
    canSelectAsTarget,
    isTargetSelected,
    getControlInfo,
    setPlayerType
  }
}