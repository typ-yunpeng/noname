<template>
  <div
    class="player-info"
    :class="{
      'is-current': isCurrent,
      'is-dead': player.status === 'dead',
      'is-flipped': player.status === 'flipped',
      'is-linked': player.status === 'linked',
      'is-target': isTarget,
      'can-select': canSelect,
      'team-blue': isBlueTeam,
      'team-red': isRedTeam
    }"
    @click="$emit('click', player)"
  >
    <!-- 角色卡片区域 -->
    <div class="character-card">
      <!-- 队伍标识（左上角） -->
      <div class="team-badge" :class="isBlueTeam ? 'team-blue' : 'team-red'">
        {{ isBlueTeam ? '蓝' : '红' }}
      </div>

      <!-- 势力标识（右上角） -->
      <div class="faction-badge" :class="`faction-${player.character.faction}`">
        {{ factionText }}
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
          ⚔️
        </div>
        <div v-if="player.equipCards.armor" class="equip-item" title="防具">
          🛡️
        </div>
        <div v-if="player.equipCards.defendHorse" class="equip-item" title="防御马">
          🐴
        </div>
        <div v-if="player.equipCards.offenseHorse" class="equip-item" title="进攻马">
          🐎
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

// 判断是否为蓝队（1号位和3号位）
const isBlueTeam = computed(() => {
  const playerId = props.player.id
  return playerId === 'player_0' || playerId === 'player_2'
})

// 判断是否为红队（2号位和4号位）
const isRedTeam = computed(() => {
  const playerId = props.player.id
  return playerId === 'player_1' || playerId === 'player_3'
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
  padding: 0.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 5;
  min-width: 120px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* 蓝队样式 */
.player-info.team-blue {
  border-color: rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(30, 58, 138, 0.3) 100%);
}

.player-info.team-blue:hover {
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

/* 红队样式 */
.player-info.team-red {
  border-color: rgba(239, 68, 68, 0.5);
  background: linear-gradient(135deg, rgba(153, 27, 27, 0.3) 0%, rgba(239, 68, 68, 0.2) 50%, rgba(153, 27, 27, 0.3) 100%);
}

.player-info.team-red:hover {
  border-color: rgba(239, 68, 68, 0.8);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
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
  border-radius: 10px;
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

/* 角色卡片区域 */
.character-card {
  flex: 1;
  background: linear-gradient(135deg, #6B21A8 0%, #7C3AED 50%, #8B5CF6 100%);
  border-radius: 8px;
  padding: 0.5rem;
  position: relative;
  min-width: 100px;
  box-shadow: 0 4px 15px rgba(107, 33, 168, 0.4);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 队伍标识 */
.team-badge {
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: bold;
  color: white;
  z-index: 2;
  min-width: 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.team-badge.team-blue {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-color: #60a5fa;
}

.team-badge.team-red {
  background: linear-gradient(135deg, #991b1b 0%, #ef4444 100%);
  border-color: #f87171;
}

/* 势力标识 */
.faction-badge {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 2;
  min-width: 20px;
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

/* 头像区域 */
.avatar-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-name {
  margin-top: 0.3rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 血量显示 */
.hp-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 0.3rem;
}

.hp-gems {
  display: flex;
  gap: 0.15rem;
}

.hp-gem {
  width: 18px;
  height: 18px;
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
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.hand-cards-count {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hand-cards-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.1rem;
}

/* 装备区域 */
.equipments {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-top: auto;
}

.equip-item {
  font-size: 0.7rem;
  padding: 0.15rem 0.3rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .player-info {
    min-width: 100px;
    padding: 0.4rem;
  }

  .character-card {
    min-width: 80px;
    padding: 0.4rem;
  }

  .avatar-image {
    width: 50px;
    height: 50px;
  }

  .character-name {
    font-size: 0.8rem;
  }

  .hp-gem {
    width: 16px;
    height: 16px;
  }

  .hand-cards-count {
    font-size: 1rem;
  }

  .hand-cards-label {
    font-size: 0.6rem;
  }
}
</style>