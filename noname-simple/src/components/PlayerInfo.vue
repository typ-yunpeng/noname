<template>
  <div
    class="player-info"
    :class="{
      'is-current': isCurrent,
      'is-dead': player.status === 'dead',
      'is-flipped': player.status === 'flipped',
      'is-linked': player.status === 'linked',
      'is-target': isTarget,
      'can-select': canSelect
    }"
    @click="$emit('click', player)"
  >
    <!-- 技能按钮区域（左侧） -->
    <div class="skills-panel" v-if="player.character.skills && player.character.skills.length > 0">
      <div
        v-for="skill in player.character.skills"
        :key="skill.id"
        class="skill-button"
        :class="{ 'skill-active': skill.active }"
        :title="`${skill.name}: ${skill.description}`"
      >
        <span class="skill-button-name">{{ skill.name }}</span>
        <span v-if="skill.limited" class="skill-button-limited">限定</span>
        <span v-if="skill.active" class="skill-button-active">主动</span>
      </div>
    </div>

    <!-- 角色卡片区域（右侧） -->
    <div class="character-card">
      <!-- 势力标识（左上角） -->
      <div class="faction-badge" :class="`faction-${player.character.faction}`">
        {{ factionText }}
      </div>

      <!-- 友/敌标识（右上角） -->
      <div class="relation-badge" :class="isAlly ? 'relation-ally' : 'relation-enemy'">
        {{ isAlly ? '友' : '敌' }}
      </div>

      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-image">
          <img
            :src="getCharacterAvatar(player.character.avatar, player.character.name, player.identity)"
            :alt="player.character.name"
          />
        </div>
        <div class="character-name">{{ player.character.name }}</div>
      </div>

      <!-- 血量显示（绿色宝石） -->
      <div class="hp-section">
        <div class="hp-gems">
          <div
            v-for="i in player.maxHp"
            :key="i"
            class="hp-gem"
            :class="{ 'hp-lost': i > player.hp }"
          >
            <svg viewBox="0 0 24 24" class="gem-icon">
              <path d="M12 2L2 7l10 15 10-15-10-5z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 手牌数显示 -->
      <div class="hand-cards-section">
        <div class="hand-cards-count">{{ player.handCards.length }}</div>
        <div class="hand-cards-label">手牌</div>
      </div>

      <!-- 装备区域 -->
      <div class="equipments" v-if="hasEquipments">
        <div v-if="player.equipCards.weapon" class="equip-item" title="武器">
          ⚔️ {{ player.equipCards.weapon.name }}
        </div>
        <div v-if="player.equipCards.armor" class="equip-item" title="防具">
          🛡️ {{ player.equipCards.armor.name }}
        </div>
        <div v-if="player.equipCards.defendHorse" class="equip-item" title="防御马">
          🐴 {{ player.equipCards.defendHorse.name }}
        </div>
        <div v-if="player.equipCards.offenseHorse" class="equip-item" title="进攻马">
          🐎 {{ player.equipCards.offenseHorse.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '@/types'
import { getCharacterAvatar } from '@/utils/characterAvatar'

interface Props {
  player: Player
  isCurrent: boolean
  isTarget?: boolean
  canSelect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isTarget: false,
  canSelect: false
})

defineEmits<{
  click: [player: Player]
}>()

// 势力文本
const factionText = computed(() => {
  const factionMap: Record<string, string> = {
    'wei': '魏',
    'shu': '蜀',
    'wu': '吴',
    'qun': '群'
  }
  return factionMap[props.player.character.faction] || ''
})

// 判断是否为盟友
const isAlly = computed(() => {
  const playerId = props.player.id
  // 1号位和4号位是队友
  // 2号位和3号位是敌人
  return playerId === 'player_0' || playerId === 'player_3'
})

const hasEquipments = computed(() => {
  return (
    props.player.equipCards.weapon ||
    props.player.equipCards.armor ||
    props.player.equipCards.defendHorse ||
    props.player.equipCards.offenseHorse
  )
})
</script>

<style scoped>
.player-info {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 5;
  min-width: 200px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* 古朴建筑纹理背景 */
.player-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(139, 92, 246, 0.03) 10px,
      rgba(139, 92, 246, 0.03) 20px
    );
  border-radius: 12px;
  pointer-events: none;
  z-index: 0;
}

.player-info.can-select {
  z-index: 15;
}

.player-info:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  border-color: rgba(139, 92, 246, 0.6);
}

.player-info.is-current {
  border-color: #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.player-info.is-dead {
  opacity: 0.4;
  filter: grayscale(100%);
}

.player-info.is-flipped {
  transform: rotate(180deg);
}

.player-info.is-linked {
  border-color: #ff6b6b;
}

.player-info.is-target {
  border-color: #4caf50;
  box-shadow: 0 0 30px rgba(76, 175, 80, 0.6);
}

.player-info.can-select:hover {
  border-color: #4caf50;
  cursor: pointer;
}

/* 技能按钮区域 */
.skills-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
}

.skill-button {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: 2px solid #D2691E;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: #fff;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-width: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.skill-button:hover {
  background: linear-gradient(135deg, #A0522D 0%, #CD853F 100%);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.skill-button.skill-active {
  border-color: #4caf50;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
}

.skill-button-name {
  display: block;
  margin-bottom: 0.25rem;
}

.skill-button-limited {
  display: inline-block;
  font-size: 0.6rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.3);
  padding: 1px 4px;
  border-radius: 2px;
  margin-right: 0.25rem;
}

.skill-button-active {
  display: inline-block;
  font-size: 0.6rem;
  color: #ffffff;
  background: rgba(76, 175, 80, 0.5);
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: bold;
}

/* 角色卡片区域 */
.character-card {
  flex: 1;
  background: linear-gradient(135deg, #6B21A8 0%, #7C3AED 50%, #8B5CF6 100%);
  border-radius: 10px;
  padding: 0.75rem;
  position: relative;
  min-width: 140px;
  box-shadow: 0 4px 15px rgba(107, 33, 168, 0.4);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 势力标识 */
.faction-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 2;
  min-width: 24px;
  text-align: center;
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

/* 友/敌标识 */
.relation-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.relation-ally {
  background: linear-gradient(135deg, #166534 0%, #22c55e 100%);
  border: 2px solid #4ade80;
}

.relation-enemy {
  background: linear-gradient(135deg, #991b1b 0%, #ef4444 100%);
  border: 2px solid #f87171;
}

/* 头像区域 */
.avatar-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.75rem;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-name {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 血量显示 */
.hp-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.hp-gems {
  display: flex;
  gap: 0.25rem;
}

.hp-gem {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gem-icon {
  width: 100%;
  height: 100%;
  fill: #22c55e;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.hp-gem.hp-lost .gem-icon {
  fill: rgba(255, 255, 255, 0.2);
  filter: none;
}

/* 手牌数显示 */
.hand-cards-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.hand-cards-count {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hand-cards-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;
}

/* 装备区域 */
.equipments {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: auto;
}

.equip-item {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>