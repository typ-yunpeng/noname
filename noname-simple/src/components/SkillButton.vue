<template>
  <div class="skill-button-container">
    <button
      v-for="skill in activeSkills"
      :key="skill.id"
      class="skill-button"
      :class="[
        `skill-${skill.id}`,
        { 'skill-disabled': !canUseSkillFn(skill), 'skill-active': isActiveSkill(skill) }
      ]"
      :disabled="!canUseSkillFn(skill)"
      @click="handleSkillClick(skill)"
      @mouseenter="handleSkillHover(skill)"
      @mouseleave="handleSkillLeave"
    >
      <div class="skill-icon">
        <span class="skill-symbol">{{ getSkillSymbol(skill) }}</span>
      </div>
      <div class="skill-info">
        <span class="skill-name">{{ skill.name }}</span>
        <span v-if="skill.limited" class="skill-limited">限定</span>
      </div>
    </button>
    
    <!-- 技能详情提示 -->
    <div v-if="hoveredSkill" class="skill-tooltip">
      <div class="tooltip-header">
        <span class="tooltip-name">{{ hoveredSkill.name }}</span>
        <span v-if="hoveredSkill.limited" class="tooltip-limited">限定技</span>
      </div>
      <div class="tooltip-description">{{ hoveredSkill.description }}</div>
      <div class="tooltip-trigger">
        <span class="trigger-label">触发时机：</span>
        <span class="trigger-value">{{ getTriggerText(hoveredSkill) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Skill, Player, Game, Phase } from '@/types'

interface Props {
  player: Player
  game: Game
  canUseSkill?: (skill: Skill) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  canUseSkill: undefined
})

const emit = defineEmits<{
  skillClick: [skill: Skill]
  skillHover: [skill: Skill | null]
}>()

// 当前悬停的技能
const hoveredSkill = ref<Skill | null>(null)

// 获取可用的主动技能
const activeSkills = computed(() => {
  return props.player.character.skills.filter(skill => skill.active)
})

// 判断是否可以使用技能
const canUseSkillFn = (skill: Skill): boolean => {
  // 如果父组件传入了canUseSkill函数，使用父组件的
  if (props.canUseSkill) {
    return props.canUseSkill(skill)
  }
  
  // 否则使用默认逻辑
  // 只有当前回合的玩家才能使用主动技能
  if (!props.player.isTurn) return false
  
  // 检查技能是否在当前阶段可以触发
  const currentPhase = props.game.state.phase
  const canTrigger = skill.trigger.some(trigger => {
    // 简化处理：主动技能通常在出牌阶段使用
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

// 判断技能是否处于激活状态
const isActiveSkill = (skill: Skill): boolean => {
  // 这里可以根据游戏状态判断技能是否已经激活
  // 简化处理，返回false
  return false
}

// 获取技能符号
const getSkillSymbol = (skill: Skill): string => {
  // 根据技能ID返回不同的符号
  const symbolMap: Record<string, string> = {
    'rende': '仁',
    'wusheng': '武',
    'paoxiao': '咆',
    'longdan': '龙',
    'tieji': '铁',
    'jizhi': '集',
    'guanxing': '观',
    'jianxiong': '奸',
    'fankui': '反',
    'guicai': '鬼',
    'zhiheng': '制',
    'gongxin': '攻',
    'keji': '克',
    'qixi': '奇',
    'lianying': '连',
    'kurou': '苦',
    'qiaobian': '巧',
    'fanjian': '反',
    'guose': '国',
    'liju': '离',
    'wushuang': '无',
    'lijian': '离',
    'biyue': '闭',
    'jijiu': '救'
  }
  return symbolMap[skill.id] || '技'
}

// 获取触发时机文本
const getTriggerText = (skill: Skill): string => {
  const triggerMap: Record<string, string> = {
    phaseBegin: '回合开始',
    phaseEnd: '回合结束',
    useCard: '使用卡牌时',
    damage: '受到伤害时',
    recover: '回复体力时',
    judge: '判定阶段',
    draw: '摸牌阶段'
  }
  
  return skill.trigger
    .map(trigger => triggerMap[trigger] || trigger)
    .join('、')
}

// 处理技能点击
const handleSkillClick = (skill: Skill) => {
  if (!canUseSkillFn(skill)) return
  
  emit('skillClick', skill)
}

// 处理技能悬停
const handleSkillHover = (skill: Skill) => {
  hoveredSkill.value = skill
  emit('skillHover', skill)
}

// 处理技能离开
const handleSkillLeave = () => {
  hoveredSkill.value = null
  emit('skillHover', null)
}
</script>

<style scoped>
.skill-button-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%);
  border-radius: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
}

.skill-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.skill-button:hover:not(.skill-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-color: #ffd700;
}

.skill-button:active:not(.skill-disabled) {
  transform: translateY(0);
}

.skill-button.skill-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.skill-button.skill-active {
  border-color: #4caf50;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.skill-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.skill-symbol {
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.skill-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.skill-name {
  font-size: 0.875rem;
  font-weight: bold;
  color: #333;
}

.skill-limited {
  font-size: 0.625rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.1);
  padding: 1px 4px;
  border-radius: 2px;
  margin-top: 2px;
}

/* 技能详情提示 */
.skill-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
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

.tooltip-limited {
  font-size: 0.75rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

.tooltip-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.tooltip-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.trigger-label {
  font-weight: bold;
}

.trigger-value {
  color: rgba(255, 255, 255, 0.8);
}
</style>