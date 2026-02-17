<template>
  <div class="character-select">
    <div class="select-container">
      <h2 class="select-title">选择你的武将</h2>
      <p class="select-subtitle">选择一个武将开始游戏，其他玩家将随机分配武将</p>
      
      <div class="select-content">
        <div class="character-grid">
          <div
            v-for="character in availableCharacters"
            :key="character.name"
            class="character-card"
            :class="{
              'selected': selectedCharacter?.name === character.name
            }"
            @click="selectCharacter(character)"
          >
            <div class="character-avatar">
              <img
                :src="getCharacterAvatar(character.avatar, character.name, character.identity)"
                :alt="character.name"
                class="avatar-image"
              />
              <div class="identity-badge" :class="`identity-${character.identity}`">
                {{ identityText(character.identity) }}
              </div>
            </div>
            
            <div class="character-info">
              <h3 class="character-name">{{ character.name }}</h3>
              <div class="character-stats">
                <span class="stat-item">
                  <span class="stat-label">体力:</span>
                  <span class="stat-value">{{ character.hp }}</span>
                </span>
              </div>
               
              <div class="character-skills">
                <div
                  v-for="skill in character.skills"
                  :key="skill.id"
                  class="skill-preview"
                  @mouseenter="hoveredSkill = skill"
                  @mouseleave="hoveredSkill = null"
                >
                  <span class="skill-name">{{ skill.name }}</span>
                  <span v-if="skill.limited" class="skill-limited">限定</span>
                  <span v-if="skill.active" class="skill-active">主动</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 技能详情提示 -->
      <div v-if="hoveredSkill" class="skill-tooltip">
        <div class="tooltip-header">
          <span class="tooltip-name">{{ hoveredSkill.name }}</span>
          <span v-if="hoveredSkill.limited" class="tooltip-limited">限定技</span>
          <span v-if="hoveredSkill.active" class="tooltip-active">主动技</span>
        </div>
        <div class="tooltip-description">{{ hoveredSkill.description }}</div>
        <div class="tooltip-trigger">
          <span class="trigger-label">触发时机：</span>
          <span class="trigger-value">{{ getTriggerText(hoveredSkill) }}</span>
        </div>
      </div>
      
      <div class="select-actions">
        <button
          class="btn btn-confirm"
          :disabled="!selectedCharacter"
          @click="confirmSelection"
        >
          确认选择
        </button>
        <button class="btn btn-cancel" @click="cancelSelection">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { standardCharacters } from '@/data/characters/standard'
import type { Character } from '@/types'
import { getCharacterAvatar } from '@/utils/characterAvatar'

interface Props {
  playerIndex?: number
  selectedCharacters?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  playerIndex: 0,
  selectedCharacters: () => []
})

const emit = defineEmits<{
  select: [character: Character]
  cancel: []
}>()

// 可选武将列表
const availableCharacters = ref<any[]>([...standardCharacters])

// 选中的武将
const selectedCharacter = ref<Character | null>(null)

// 悬停的技能
const hoveredSkill = ref<any>(null)

// 选择武将
const selectCharacter = (character: Character) => {
  selectedCharacter.value = character
}

// 确认选择
const confirmSelection = () => {
  if (selectedCharacter.value) {
    emit('select', selectedCharacter.value)
  }
}

// 取消选择
const cancelSelection = () => {
  emit('cancel')
}

// 获取身份文本
const identityText = (identity: string) => {
  const identityMap: Record<string, string> = {
    zhu: '主',
    zhong: '忠',
    fan: '反',
    nei: '内'
  }
  return identityMap[identity] || identity
}

// 获取触发时机文本
const getTriggerText = (skill: any): string => {
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
    .map((trigger: string) => triggerMap[trigger] || trigger)
    .join('、')
}
</script>

<style scoped>
.character-select {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.select-container {
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #ffd700;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}

.select-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.select-title {
  text-align: center;
  font-size: 2rem;
  color: #ffd700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
}

.character-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.character-card:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.character-card.selected {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

.character-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.avatar-text {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.identity-badge {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  min-width: 24px;
  text-align: center;
}

.identity-zhu {
  background: #ffd700;
  color: #333;
}

.identity-zhong {
  background: #4CAF50;
}

.identity-fan {
  background: #f44336;
}

.identity-nei {
  background: #9c27b0;
}

.character-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.character-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin: 0;
  text-align: center;
}

.character-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
}

.stat-value {
  color: #ffd700;
  font-weight: bold;
}

.character-skills {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.skill-preview:hover {
  background: rgba(0, 0, 0, 0.3);
}

.skill-name {
  color: white;
  font-weight: 500;
}

.skill-limited {
  font-size: 0.65rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
}

.skill-active {
  font-size: 0.65rem;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
}

.skill-tooltip {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 2000;
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

.tooltip-active {
  font-size: 0.75rem;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
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

.select-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding-bottom: 1rem;
  z-index: 10;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm {
  background: #4caf50;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #45a049;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-cancel:hover {
  background: #da190b;
}
</style>