<template>
  <div class="character-select">
    <div class="select-container">
      <div class="select-header">
        <h2 class="select-title">选择你的武将</h2>
        <p class="select-subtitle">2v2对战模式 - 蓝队 vs 红队</p>
      </div>
      
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
              <div class="faction-badge" :class="`faction-${character.faction}`">
                {{ factionText(character.faction) }}
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
          @click.stop="confirmSelection"
        >
          确认选择
        </button>
        <button class="btn btn-cancel" @click.stop="cancelSelection">
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
  console.log('confirmSelection called', selectedCharacter.value)
  if (selectedCharacter.value) {
    emit('select', selectedCharacter.value)
  }
}

// 取消选择
const cancelSelection = () => {
  console.log('cancelSelection called')
  emit('cancel')
}

// 获取势力文本
const factionText = (faction: string) => {
  const factionMap: Record<string, string> = {
    'wei': '魏',
    'shu': '蜀',
    'wu': '吴',
    'qun': '群'
  }
  return factionMap[faction] || faction
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
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.select-container {
  width: 90%;
  max-width: 1400px;
  max-height: 90vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 3px solid #ffd700;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
  overflow: hidden;
}

/* 装饰性边框 */
.select-container::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  pointer-events: none;
}

.select-header {
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  flex-shrink: 0;
}

.select-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.1em;
}

.select-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.select-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-bottom: 0;
  min-height: 0;
}

/* 自定义滚动条 */
.select-content::-webkit-scrollbar {
  width: 8px;
}

.select-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.select-content::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.5);
  border-radius: 4px;
}

.select-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.7);
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
}

.character-card {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.character-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.character-card:hover:not(.disabled) {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  border-color: rgba(255, 215, 0, 0.6);
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.character-card:hover::before {
  opacity: 1;
}

.character-card.selected {
  border-color: #4caf50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%);
  box-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
}

.character-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.faction-badge {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  min-width: 28px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.faction-wei {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-color: #60a5fa;
}

.faction-shu {
  background: linear-gradient(135deg, #166534 0%, #22c55e 100%);
  border-color: #4ade80;
}

.faction-wu {
  background: linear-gradient(135deg, #b45309 0%, #f97316 100%);
  border-color: #fb923c;
}

.faction-qun {
  background: linear-gradient(135deg, #7c2d12 0%, #ea580c 100%);
  border-color: #f97316;
}

.character-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: none;
  background: transparent;
}

.character-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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
  font-size: 0.95rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
}

.stat-value {
  color: #ffd700;
  font-weight: bold;
  font-size: 1.1rem;
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
  padding: 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-preview:hover {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 215, 0, 0.3);
}

.skill-name {
  color: white;
  font-weight: 500;
}

.skill-limited {
  font-size: 0.7rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(229, 57, 53, 0.3);
}

.skill-active {
  font-size: 0.7rem;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

/* 技能详情提示 */
.skill-tooltip {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 450px;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  z-index: 2000;
  backdrop-filter: blur(10px);
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
}

.tooltip-limited {
  font-size: 0.8rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.2);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(229, 57, 53, 0.3);
}

.tooltip-active {
  font-size: 0.8rem;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.tooltip-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.tooltip-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
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
  gap: 1.5rem;
  padding: 1.5rem 0 1rem 0;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  border-radius: 0 0 16px 16px;
}

.btn {
  position: relative;
  padding: 0.85rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  z-index: 101;
}

.btn-confirm {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-cancel {
  background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
}

.btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.6);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-decoration {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
  pointer-events: none;
}

.btn:hover .btn-decoration {
  left: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .select-container {
    width: 95%;
    padding: 1.5rem;
  }

  .select-title {
    font-size: 1.8rem;
  }

  .character-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .character-card {
    padding: 1rem;
  }

  .character-avatar {
    width: 80px;
    height: 80px;
  }

  .character-name {
    font-size: 1.2rem;
  }

  .skill-tooltip {
    width: 90%;
    bottom: 80px;
  }

  .select-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
  }
}
</style>