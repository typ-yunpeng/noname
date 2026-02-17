import { ref, computed } from 'vue'
import type { Card, Player, Game } from '@/types'

/**
 * 卡牌交互管理
 * 处理卡牌的选择、使用等交互逻辑
 */
export function useCardInteraction(player: Player, game: Game) {
  // 选中的卡牌
  const selectedCard = ref<Card | null>(null)
  
  // 选中的目标玩家
  const selectedTargets = ref<Player[]>([])
  
  // 是否正在选择目标
  const isSelectingTargets = ref(false)
  
  // 当前需要选择的目标数量
  const requiredTargetCount = ref(0)
  
  /**
   * 判断是否可以使用卡牌
   */
  const canUseCard = (card: Card): boolean => {
    // 只有当前回合的玩家在出牌阶段才能使用卡牌
    if (!player.isTurn) return false
    if (game.state.phase !== 'play') return false
    
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
      return game.players.filter(p => p.id !== player.id && p.status === 'alive').length
    }
    
    // 无中生有、无懈可击、桃：不需要目标
    return 0
  }
  
  /**
   * 选择卡牌
   */
  const selectCard = (card: Card) => {
    if (!canUseCard(card)) return
    
    // 如果已经选中该卡牌，取消选中
    if (selectedCard.value?.id === card.id) {
      selectedCard.value = null
      selectedTargets.value = []
      isSelectingTargets.value = false
      return
    }
    
    // 选中卡牌
    selectedCard.value = card
    
    // 检查是否需要选择目标
    const targetCount = getRequiredTargetCount(card)
    if (targetCount > 0) {
      requiredTargetCount.value = targetCount
      isSelectingTargets.value = true
    } else {
      // 不需要目标，直接使用
      useCard(card, [])
    }
  }
  
  /**
   * 选择目标玩家
   */
  const selectTarget = (target: Player) => {
    if (!isSelectingTargets.value) return
    
    // 不能选择自己（除非特殊卡牌）
    if (target.id === player.id) return
    
    // 不能选择已死亡玩家
    if (target.status === 'dead') return
    
    // 检查是否已经选中
    const index = selectedTargets.value.findIndex(p => p.id === target.id)
    if (index !== -1) {
      // 取消选中
      selectedTargets.value.splice(index, 1)
    } else {
      // 添加选中
      selectedTargets.value.push(target)
    }
    
    // 检查是否已经选择了足够的目标
    if (selectedTargets.value.length >= requiredTargetCount.value) {
      // 使用卡牌
      if (selectedCard.value) {
        useCard(selectedCard.value, selectedTargets.value)
      }
    }
  }
  
  /**
   * 使用卡牌
   */
  const useCard = async (card: Card, targets: Player[]) => {
    console.log(`使用卡牌: ${card.name}`, targets.length > 0 ? `目标: ${targets.map(t => t.character.name).join(', ')}` : '')
    
    // 调用游戏引擎的useCard方法
    await game.useCard(player, card, targets)
    
    // 清空选择
    selectedCard.value = null
    selectedTargets.value = []
    isSelectingTargets.value = false
  }
  
  /**
   * 取消选择
   */
  const cancelSelection = () => {
    selectedCard.value = null
    selectedTargets.value = []
    isSelectingTargets.value = false
  }
  
  /**
   * 判断玩家是否可以被选中为目标
   */
  const canSelectAsTarget = (target: Player): boolean => {
    if (!isSelectingTargets.value) return false
    if (target.id === player.id) return false
    if (target.status === 'dead') return false
    
    // 检查是否已经选中
    const index = selectedTargets.value.findIndex(p => p.id === target.id)
    if (index !== -1) return true
    
    // 检查是否还可以选择更多目标
    return selectedTargets.value.length < requiredTargetCount.value
  }
  
  /**
   * 判断玩家是否已被选中为目标
   */
  const isTargetSelected = (target: Player): boolean => {
    return selectedTargets.value.some(p => p.id === target.id)
  }
  
  return {
    selectedCard,
    selectedTargets,
    isSelectingTargets,
    requiredTargetCount,
    canUseCard,
    selectCard,
    selectTarget,
    useCard,
    cancelSelection,
    canSelectAsTarget,
    isTargetSelected
  }
}