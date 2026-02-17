<template>
  <div
    class="card"
    :class="[
      `card-${card.type}`,
      `card-${cardColor}`,
      { 'card-selected': isSelected, 'card-disabled': isDisabled }
    ]"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 卡牌背面（如果需要） -->
    <div v-if="isFaceDown" class="card-back">
      <div class="card-back-pattern"></div>
    </div>
    
    <!-- 卡牌正面 -->
    <div v-else class="card-front">
      <!-- 左上角花色 -->
      <div class="card-corner card-corner-top-left">
        <span class="card-suit">{{ suitSymbol }}</span>
      </div>
      
      <!-- 右上角数字 -->
      <div class="card-corner card-corner-top-right">
        <span class="card-number">{{ numberDisplay }}</span>
      </div>
      
      <!-- 卡牌中心内容 -->
      <div class="card-content">
        <div class="card-name">{{ card.name }}</div>
        <div class="card-type">{{ cardTypeText }}</div>
      </div>
      
      <!-- 左下角数字（旋转180度） -->
      <div class="card-corner card-corner-bottom-left">
        <span class="card-number">{{ numberDisplay }}</span>
      </div>
      
      <!-- 右下角花色（旋转180度） -->
      <div class="card-corner card-corner-bottom-right">
        <span class="card-suit">{{ suitSymbol }}</span>
      </div>
      
      <!-- 卡牌边框装饰 -->
      <div class="card-border"></div>
    </div>
    
    <!-- 选中标记 -->
    <div v-if="isSelected" class="card-selected-mark">
      <span class="mark-icon">✓</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/types'

interface Props {
  card: Card
  isSelected?: boolean
  isDisabled?: boolean
  isFaceDown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDisabled: false,
  isFaceDown: false
})

const emit = defineEmits<{
  click: [card: Card]
  mouseEnter: [card: Card]
  mouseLeave: [card: Card]
}>()

// 卡牌颜色
const cardColor = computed(() => {
  const colorMap: Record<string, 'red' | 'black'> = {
    heart: 'red',
    diamond: 'red',
    spade: 'black',
    club: 'black'
  }
  return colorMap[props.card.suit] || 'black'
})

// 花色符号
const suitSymbol = computed(() => {
  const symbols: Record<string, string> = {
    spade: '♠',
    heart: '♥',
    club: '♣',
    diamond: '♦'
  }
  return symbols[props.card.suit] || ''
})

// 点数显示
const numberDisplay = computed(() => {
  const num = props.card.number
  if (num === 1) return 'A'
  if (num === 11) return 'J'
  if (num === 12) return 'Q'
  if (num === 13) return 'K'
  return num.toString()
})

// 卡牌类型文本
const cardTypeText = computed(() => {
  const typeMap: Record<string, string> = {
    basic: '基本牌',
    trick: '锦囊牌',
    equip: '装备牌'
  }
  return typeMap[props.card.type] || ''
})

// 点击事件
const handleClick = () => {
  if (!props.isDisabled) {
    emit('click', props.card)
  }
}

// 鼠标进入事件
const handleMouseEnter = () => {
  emit('mouseEnter', props.card)
}

// 鼠标离开事件
const handleMouseLeave = () => {
  emit('mouseLeave', props.card)
}
</script>

<style scoped>
.card {
  position: relative;
  width: 100px;
  height: 140px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card:hover:not(.card-disabled) {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card-selected {
  transform: translateY(-12px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.card-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 卡牌背面 */
.card-back {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #3949ab;
}

.card-back-pattern {
  width: 80%;
  height: 80%;
  border: 2px dashed #5c6bc0;
  border-radius: 4px;
}

/* 卡牌正面 */
.card-front {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

/* 卡牌边框 */
.card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #ddd;
  border-radius: 8px;
  pointer-events: none;
}

/* 红色卡牌 */
.card-red .card-border {
  border-color: #e53935;
}

.card-red .card-suit {
  color: #e53935;
}

/* 黑色卡牌 */
.card-black .card-border {
  border-color: #212121;
}

.card-black .card-suit {
  color: #212121;
}

/* 基本牌样式 */
.card-basic .card-content {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

/* 锦囊牌样式 */
.card-trick .card-content {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

/* 装备牌样式 */
.card-equip .card-content {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

/* 卡牌角落 */
.card-corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}

.card-corner-top-left {
  top: 6px;
  left: 6px;
}

.card-corner-top-right {
  top: 6px;
  right: 6px;
}

.card-corner-bottom-left {
  bottom: 6px;
  left: 6px;
  transform: rotate(180deg);
}

.card-corner-bottom-right {
  bottom: 6px;
  right: 6px;
  transform: rotate(180deg);
}

.card-suit {
  font-size: 16px;
  margin-bottom: 2px;
}

.card-number {
  font-size: 14px;
  font-weight: bold;
}

/* 红色卡牌的数字 */
.card-red .card-number {
  color: #e53935;
}

/* 黑色卡牌的数字 */
.card-black .card-number {
  color: #212121;
}

/* 卡牌中心内容 */
.card-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 60%;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
  line-height: 1.2;
}

.card-type {
  font-size: 10px;
  color: #666;
  text-align: center;
}

/* 选中标记 */
.card-selected-mark {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.mark-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
}
</style>