<template>
  <div class="hand-cards">
    <div class="hand-cards-header">
      <span class="hand-cards-title">手牌</span>
      <span class="hand-cards-count">{{ cards.length }}/{{ maxCards }}</span>
    </div>
    
    <div class="hand-cards-container" ref="containerRef">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="hand-card-wrapper"
        :class="{
          'card-hovered': hoveredCard?.id === card.id,
          'card-selected': selectedCardIds.includes(card.id),
          'card-overlap': shouldOverlap
        }"
        @mouseenter="handleCardHover(card)"
        @mouseleave="handleCardLeave"
      >
        <Card
          :card="card"
          :is-selected="selectedCardIds.includes(card.id)"
          :is-disabled="!canUseCardFn(card)"
          @click="handleCardClick(card)"
        />
      </div>
      
      <!-- 空状态提示 -->
      <div v-if="cards.length === 0" class="hand-cards-empty">
        <span>没有手牌</span>
      </div>
    </div>
    
    <!-- 卡牌详情提示 -->
    <div v-if="hoveredCard" class="card-tooltip">
      <div class="tooltip-header">
        <span class="tooltip-name">{{ hoveredCard.name }}</span>
        <span class="tooltip-type">{{ cardTypeText(hoveredCard) }}</span>
      </div>
      <div class="tooltip-description">{{ hoveredCard.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Card as CardType, Player, Game, Phase } from '@/types'
import Card from './Card.vue'

interface Props {
  cards: CardType[]
  player: Player
  game: Game
  canUseCard?: (card: CardType) => boolean
  maxCards?: number
  overlap?: number
  isSelectingDiscard?: boolean
  controlState?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxCards: 20,
  overlap: -50,
  canUseCard: undefined,
  isSelectingDiscard: false,
  controlState: 'idle'
})

const emit = defineEmits<{
  cardClick: [card: CardType]
  cardHover: [card: CardType | null]
}>()

const containerRef = ref<HTMLElement | null>(null)

// 卡牌宽度（假设）
const CARD_WIDTH = 100
const CARD_GAP = 10

// 判断是否需要重叠
const shouldOverlap = computed(() => {
  if (!containerRef.value || props.cards.length === 0) return false
  
  const containerWidth = containerRef.value.clientWidth
  const totalWidth = props.cards.length * CARD_WIDTH + (props.cards.length - 1) * CARD_GAP
  
  // 如果总宽度超过容器宽度，需要重叠
  return totalWidth > containerWidth
})


// 选中的卡牌ID列表
const selectedCardIds = ref<string[]>([])

// 当前悬停的卡牌
const hoveredCard = ref<CardType | null>(null)

// 判断是否可以使用卡牌
const canUseCardFn = (card: CardType): boolean => {
  // 如果处于弃牌选择状态，允许选择所有手牌
  if (props.isSelectingDiscard) {
    return true
  }
  
  // 如果处于为武圣技能选择卡牌的状态，只允许选择红色牌
  if (props.controlState === 'selectingCardForSkill') {
    // 红色牌：红桃(heart)和方块(diamond)
    return card.suit === 'heart' || card.suit === 'diamond'
  }
  
  // 闪不能主动使用，只能在响应杀或万箭齐发时使用
  if (card.name === '闪') {
    // 只有在等待响应状态，且响应卡牌是闪时才能使用
    if (!props.game.state.waitingForResponse) return false
    if (props.game.state.responseCard !== '闪') return false
    if (props.game.state.responseTarget?.id !== props.player.id) return false
    return true
  }
  
  // 如果父组件传入了canUseCard函数，使用父组件的
  if (props.canUseCard) {
    return props.canUseCard(card)
  }
  
  // 检查是否处于等待响应状态
  const isWaitingForResponse = props.game.state.waitingForResponse
  const isResponseTarget = props.game.state.responseTarget?.id === props.player.id
  const responseCard = props.game.state.responseCard
  
  // 如果处于等待响应状态，且当前玩家是响应目标
  if (isWaitingForResponse && isResponseTarget) {
    // 只能使用响应卡牌
    if (card.name === responseCard) {
      console.log('允许使用响应卡牌:', card.name)
      return true
    }
    console.log('不允许使用非响应卡牌:', card.name, '需要的卡牌:', responseCard)
    return false
  }
  
  // 否则使用默认逻辑
  // 只有当前回合的玩家在出牌阶段才能使用卡牌
  if (!props.player.isTurn) return false
  if (props.game.state.phase !== 'play') return false
  
  // 检查桃的使用条件：只有当前体力小于体力上限时才能使用
  if (card.name === '桃') {
    if (props.player.hp >= props.player.maxHp) {
      return false
    }
  }
  
  // 基本牌和锦囊牌可以在出牌阶段使用（除了闪）
  if (card.type === 'basic' || card.type === 'trick') {
    // 闪已经在上面处理过了，这里不会再返回true
    return true
  }
  
  // 装备牌需要特殊处理
  if (card.type === 'equip') {
    // 检查是否已经装备了同类型的装备
    const equipType = card.equipType
    if (equipType && props.player.equipCards[equipType as keyof typeof props.player.equipCards]) {
      return false
    }
    return true
  }
  
  return false
}

// 卡牌类型文本
const cardTypeText = (card: CardType): string => {
  const typeMap: Record<string, string> = {
    basic: '基本牌',
    trick: '锦囊牌',
    equip: '装备牌'
  }
  return typeMap[card.type] || ''
}

// 处理卡牌点击
const handleCardClick = (card: CardType) => {
  if (!canUseCardFn(card)) return
  
  // 如果已经选中，取消选中
  const index = selectedCardIds.value.indexOf(card.id)
  if (index !== -1) {
    selectedCardIds.value.splice(index, 1)
  } else {
    // 否则选中（单选模式）
    selectedCardIds.value = [card.id]
  }
  
  emit('cardClick', card)
}

// 处理卡牌悬停
const handleCardHover = (card: CardType) => {
  hoveredCard.value = card
  emit('cardHover', card)
}

// 处理卡牌离开
const handleCardLeave = () => {
  hoveredCard.value = null
  emit('cardHover', null)
}

// 获取选中的卡牌
const getSelectedCards = (): CardType[] => {
  return props.cards.filter(card => selectedCardIds.value.includes(card.id))
}

// 清空选中
const clearSelection = () => {
  selectedCardIds.value = []
}

// 暴露方法给父组件
defineExpose({
  getSelectedCards,
  clearSelection
})
</script>

<style scoped>
.hand-cards {
  position: relative;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%);
  border-radius: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
}

.hand-cards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
  gap: 1rem;
}

.hand-cards-title {
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hand-cards-count {
  font-size: 0.875rem;
  color: #ffd700;
  font-weight: bold;
}

.hand-cards-container {
  position: relative;
  height: 220px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 2rem 1rem 2rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  gap: 10px;
}

.hand-cards-container::-webkit-scrollbar {
  height: 8px;
}

.hand-cards-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.hand-cards-container::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.5);
  border-radius: 4px;
}

.hand-cards-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.7);
}

.hand-card-wrapper {
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

/* 需要重叠时的样式 */
.hand-card-wrapper.card-overlap {
  margin-left: -50px;
}

.hand-card-wrapper.card-overlap:first-child {
  margin-left: 0;
}

.hand-card-wrapper:hover {
  transform: translateY(-30px) scale(1.05);
  z-index: 100;
}

.hand-card-wrapper.card-hovered {
  transform: translateY(-30px) scale(1.05);
  z-index: 100;
}

.hand-card-wrapper.card-selected {
  transform: translateY(-30px) scale(1.05);
  z-index: 100;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

.hand-cards-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
}

/* 卡牌详情提示 */
.card-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  z-index: 100;
  margin-bottom: 10px;
  pointer-events: none;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-name {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
}

.tooltip-type {
  font-size: 0.75rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.tooltip-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}
</style>