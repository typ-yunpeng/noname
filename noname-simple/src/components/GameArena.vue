<template>
  <div class="game-arena">
    <!-- 游戏日志 - 左上角 -->
    <div class="game-log-container">
      <GameLog :logs="gameLog.logs.value" @clear="gameLog.clear" />
    </div>

    <!-- 主游戏区域 -->
    <div class="arena-content">
      <!-- 上方对手区域 -->
      <div class="opponents-area">
        <div class="player-row player-row-top">
          <PlayerInfo
            v-for="(player, index) in topPlayers"
            :key="player.id"
            :player="player"
            :is-current="isCurrentPlayer(player)"
            :is-target="isTargetSelected(player)"
            :can-select="canSelectAsTarget(player)"
            @click="selectPlayer(player)"
          />
        </div>
      </div>

      <!-- 中间游戏区域 -->
      <div class="arena-middle">
        <!-- 左侧对手 -->
        <div class="player-row player-row-left">
          <PlayerInfo
            v-for="player in leftPlayers"
            :key="player.id"
            :player="player"
            :is-current="isCurrentPlayer(player)"
            :is-target="isTargetSelected(player)"
            :can-select="canSelectAsTarget(player)"
            @click="selectPlayer(player)"
          />
        </div>

        <!-- 中央区域 -->
        <div class="arena-center">
          <div class="game-status">
            <div v-if="game.state.isGameOver" class="game-over">
              <h2>游戏结束</h2>
              <p>{{ winnerText }}</p>
            </div>
            <div v-else class="game-info">
              <div class="phase-info">
                <span class="phase-label">当前阶段：</span>
                <span class="phase-value">{{ phaseText }}</span>
              </div>
              <div class="round-info">
                <span class="round-label">回合数：</span>
                <span class="round-value">{{ game.state.roundNumber }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧对手 -->
        <div class="player-row player-row-right">
          <PlayerInfo
            v-for="player in rightPlayers"
            :key="player.id"
            :player="player"
            :is-current="isCurrentPlayer(player)"
            :is-target="isTargetSelected(player)"
            :can-select="canSelectAsTarget(player)"
            @click="selectPlayer(player)"
          />
        </div>
      </div>

      <!-- 下方区域：手牌和操作 -->
      <div class="bottom-area">
        <!-- 手牌区 -->
        <div class="hand-cards-section">
          <HandCards
            v-if="displayPlayer"
            :cards="displayPlayer.handCards"
            :player="displayPlayer"
            :game="game"
            :can-use-card="canUseCard"
            :is-selecting-discard="playerControl?.controlState === 'selectingDiscard'"
            :control-state="playerControl?.controlState"
            @card-click="handleCardClick"
            @card-hover="handleCardHover"
          />
        </div>

        <!-- 技能按钮区和结束出牌按钮 -->
        <div class="skills-section">
          <SkillButton
            v-if="currentPlayer && !game.state.waitingForResponse"
            :player="currentPlayer"
            :game="game"
            :can-use-skill="canUseSkill"
            @skill-click="handleSkillClick"
            @skill-hover="handleSkillHover"
          />
          <!-- 结束出牌按钮 -->
          <button
            v-if="game.state.phase === 'play' && displayPlayer && displayPlayer.isTurn && !game.state.waitingForResponse"
            class="btn-end-phase"
            @click="endPlayPhase"
          >
            结束出牌
          </button>
        </div>
      </div>

      <!-- 操作确认区 -->
      <div v-if="playerControl && (playerControl.controlState !== 'idle' || game.state.waitingForResponse)" class="action-confirm-section">
        <div class="action-confirm-content">
          <div class="action-info">
            <!-- 弃牌提示 -->
            <span v-if="playerControl.controlState === 'selectingDiscard'" class="discard-hint">
              请选择 {{ playerControl.requiredDiscardCount - playerControl.selectedDiscards.length }} 张牌弃置
            </span>
            <span v-if="playerControl.controlState === 'selectingDiscard' && playerControl.selectedDiscards.length > 0" class="selected-discards">
              已选: {{ playerControl.selectedDiscards.map((c: Card) => c.name).join(', ') }}
            </span>
            <!-- 响应卡牌提示 -->
            <span v-if="game.state.waitingForResponse && game.state.responseTarget && displayPlayer.id === game.state.responseTarget.id" class="response-hint">
              <span v-if="game.state.responseHasCard">
                请选择【{{ game.state.responseCard }}】来响应，或点击"跳过"不响应
              </span>
              <span v-else>
                你没有【{{ game.state.responseCard }}】，将受到1点伤害，点击"确认"继续
              </span>
            </span>
            <span v-if="playerControl.selectedSkill" class="selected-skill">
              已选技能: {{ playerControl.selectedSkill.name }}
            </span>
            <span v-if="playerControl.controlState === 'selectingCardForSkill'" class="card-hint">
              请选择一张红色牌（红桃♥或方块♦）
            </span>
            <span v-if="playerControl.selectedCard" class="selected-card">
              已选卡牌: {{ playerControl.selectedCard.name }}
            </span>
            <span v-if="playerControl.selectedTargets.length > 0" class="selected-targets">
              已选目标: {{ playerControl.selectedTargets.map((p: Player) => p.character.name).join(', ') }}
            </span>
            <span v-if="playerControl.controlState === 'selectingTarget'" class="target-hint">
              请选择 {{ playerControl.requiredTargetCount - playerControl.selectedTargets.length }} 个目标
            </span>
          </div>
          <div class="action-buttons">
            <!-- 弃牌按钮 -->
            <button
              v-if="playerControl.controlState === 'confirming' && playerControl.selectedDiscards.length > 0"
              class="btn btn-confirm"
              @click="confirmDiscard"
            >
              确认弃牌
            </button>
            <!-- 响应卡牌按钮 -->
            <button
              v-if="game.state.waitingForResponse && game.state.responseTarget && displayPlayer.id === game.state.responseTarget.id && game.state.responseHasCard"
              class="btn btn-skip"
              @click="skipResponse"
            >
              跳过
            </button>
            <button
              v-if="game.state.waitingForResponse && game.state.responseTarget && displayPlayer.id === game.state.responseTarget.id && !game.state.responseHasCard"
              class="btn btn-confirm"
              @click="skipResponse"
            >
              不响应
            </button>
            <button
              v-if="game.state.waitingForResponse && game.state.responseTarget && displayPlayer.id === game.state.responseTarget.id && game.state.responseHasCard && playerControl && playerControl.selectedCard"
              class="btn btn-confirm"
              @click="confirmAction"
            >
              使用
            </button>
            <button
              v-if="!game.state.waitingForResponse && playerControl && playerControl.controlState === 'confirming' && playerControl.selectedDiscards.length === 0"
              class="btn btn-confirm"
              @click="confirmAction"
            >
              确认
            </button>
            <button
              class="btn btn-cancel"
              @click="cancelAction"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右下角当前玩家信息 -->
    <div v-if="displayPlayer" class="current-player-info">
      <!-- 技能按钮区域（左侧） -->
      <!-- 角色卡片区域 -->
      <div class="character-card">
        <!-- 左侧信息区 -->
        <div class="character-info-left">
          <!-- 队伍标识 -->
          <div class="team-badge" :class="isBlueTeam ? 'team-blue' : 'team-red'">
            {{ isBlueTeam ? '蓝' : '红' }}
          </div>

          <!-- 势力标识 -->
          <div class="faction-badge" :class="`faction-${displayPlayer.character.faction}`">
            {{ factionText }}
          </div>

          <!-- 武将名字（竖着显示） -->
          <div class="character-name-vertical">{{ displayPlayer.character.name }}</div>

          <!-- 血量显示（绿色宝石，竖着显示） -->
          <div class="hp-section">
            <div class="hp-gems">
              <div
                v-for="i in displayPlayer.maxHp"
                :key="i"
                class="hp-gem"
                :class="{ 'hp-lost': i > displayPlayer.hp }"
              >
                <svg viewBox="0 0 24 24" class="gem-icon">
                  <path d="M12 2L2 7l10 15 10-15-10-5z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 手牌数显示 -->
          <div class="hand-cards-info">
            <div class="hand-cards-count">{{ displayPlayer.handCards.length }}</div>
            <div class="hand-cards-label">手牌</div>
          </div>

          <!-- 装备区域 -->
          <div class="equipments" v-if="hasEquipments">
            <div v-if="displayPlayer.equipCards.weapon" class="equip-item" title="武器">
              ⚔️
            </div>
            <div v-if="displayPlayer.equipCards.armor" class="equip-item" title="防具">
              🛡️
            </div>
            <div v-if="displayPlayer.equipCards.defendHorse" class="equip-item" title="防御马">
              🐴
            </div>
            <div v-if="displayPlayer.equipCards.offenseHorse" class="equip-item" title="进攻马">
              🐎
            </div>
          </div>
        </div>

        <!-- 右侧图片区 -->
        <div class="character-image-right">
          <img
            :src="getCharacterAvatar(displayPlayer.character.avatar, displayPlayer.character.name, displayPlayer.identity)"
            :alt="displayPlayer.character.name"
          />
        </div>

        <!-- 友/敌标识（右上角） -->
        <div class="relation-badge" :class="isAlly ? 'relation-ally' : 'relation-enemy'">
          {{ isAlly ? '友' : '敌' }}
        </div>
      </div>

      <!-- 技能按钮区域（底部） -->
      <div class="skills-panel" v-if="displayPlayer.character.skills && displayPlayer.character.skills.length > 0">
        <div
          v-for="skill in displayPlayer.character.skills"
          :key="skill.id"
          class="skill-button"
          :class="{ 'skill-active': skill.active }"
          :title="`${skill.name}: ${skill.description}`"
          @mouseenter="hoveredSkill = skill"
          @mouseleave="hoveredSkill = null"
        >
          <span class="skill-button-name">{{ skill.name }}</span>
          <span v-if="skill.limited" class="skill-button-limited">限</span>
          <span v-if="skill.active" class="skill-button-active">主</span>
        </div>
      </div>

      <!-- 技能详情提示 -->
      <div v-if="hoveredSkill" class="skill-detail-tooltip">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import type { Player, Game, Card, Skill } from '@/types'
import PlayerInfo from './PlayerInfo.vue'
import HandCards from './HandCards.vue'
import SkillButton from './SkillButton.vue'
import GameLog from './GameLog.vue'
import { usePlayerControl } from '@/composables/usePlayerControl'
import { useGameLog } from '@/composables/useGameLog'
import { getCharacterAvatar } from '@/utils/characterAvatar'

interface Props {
  players: Player[]
  game: Game
  gameLog: ReturnType<typeof useGameLog>
}

const props = defineProps<Props>()

const currentPlayer = computed(() => {
  // 如果处于等待响应状态，返回响应目标玩家
  if (props.game.state.waitingForResponse && props.game.state.responseTarget) {
    console.log('处于等待响应状态，返回响应目标玩家:', props.game.state.responseTarget.character.name)
    return props.game.state.responseTarget
  }
  // 否则返回当前回合玩家
  const player = props.players[props.game.state.currentPlayerIndex]
  console.log('返回当前回合玩家:', player.character.name)
  return player
})

// 显示的玩家信息（用于右下角信息框）
const displayPlayer = computed(() => {
  // 如果处于等待响应状态，显示响应目标玩家
  if (props.game.state.waitingForResponse && props.game.state.responseTarget) {
    console.log('显示响应目标玩家信息:', props.game.state.responseTarget.character.name)
    return props.game.state.responseTarget
  }
  // 否则显示当前回合玩家
  const player = props.players[props.game.state.currentPlayerIndex]
  console.log('显示当前回合玩家信息:', player.character.name)
  return player
})

// 玩家控制管理 - 使用ref保持实例持久化
const playerControl = ref<ReturnType<typeof usePlayerControl> | null>(null)

// 监听当前玩家变化，重新创建控制实例
watch(() => props.game.state.currentPlayerIndex, (newIndex) => {
  const player = props.players[newIndex]
  if (player) {
    playerControl.value = usePlayerControl(player, props.game)
    // 设置所有玩家为人类玩家，由用户手动控制
    if (playerControl.value) {
      playerControl.value.setPlayerType(true)
    }
    console.log('当前玩家:', player.character.name)
    console.log('技能数量:', player.character.skills?.length || 0)
    console.log('技能列表:', player.character.skills)
  }
}, { immediate: true })

// 监听等待响应状态变化，切换到响应目标玩家
watch(() => props.game.state.waitingForResponse, (newValue) => {
  if (newValue && props.game.state.responseTarget) {
    const responsePlayer = props.game.state.responseTarget
    console.log('切换到响应目标玩家:', responsePlayer.character.name)
    playerControl.value = usePlayerControl(responsePlayer, props.game)
    if (playerControl.value) {
      playerControl.value.setPlayerType(true)
    }
  } else if (!newValue && props.game.state.currentPlayerIndex !== undefined) {
    // 恢复到当前回合玩家
    const currentPlayer = props.players[props.game.state.currentPlayerIndex]
    console.log('恢复到当前回合玩家:', currentPlayer.character.name)
    playerControl.value = usePlayerControl(currentPlayer, props.game)
    if (playerControl.value) {
      playerControl.value.setPlayerType(true)
    }
  }
})

// 监听等待响应状态变化
watch(() => props.game.state.waitingForResponse, (newValue, oldValue) => {
  console.log('=== 等待响应状态变化 ===')
  console.log('旧值:', oldValue)
  console.log('新值:', newValue)
  console.log('响应目标:', props.game.state.responseTarget?.character.name)
  console.log('响应卡牌:', props.game.state.responseCard)
  console.log('是否有响应卡牌:', props.game.state.responseHasCard)
  console.log('当前玩家:', displayPlayer.value.character.name)
  console.log('当前玩家ID:', displayPlayer.value.id)
  console.log('响应目标ID:', props.game.state.responseTarget?.id)
  console.log('是否匹配:', displayPlayer.value.id === props.game.state.responseTarget?.id)
  console.log('=====================')
})

const isCurrentPlayer = (player: Player) => {
  return player.id === displayPlayer.value.id
}

const winnerText = computed(() => {
  const winner = props.game.state.winner
  if (!winner) return ''
  
  // 2v2模式胜负判定
  const winnerMap: Record<string, string> = {
    zhu: '蓝队获胜！',
    fan: '红队获胜！',
    nei: '蓝队获胜！'
  }
  return winnerMap[winner] || ''
})

// 当前阶段文本
const phaseText = computed(() => {
  const phaseMap: Record<string, string> = {
    prepare: '准备阶段',
    judge: '判定阶段',
    draw: '摸牌阶段',
    play: '出牌阶段',
    discard: '弃牌阶段',
    finish: '结束阶段'
  }
  return phaseMap[props.game.state.phase] || ''
})

// 根据当前玩家动态分配其他玩家的位置
const topPlayers = computed(() => {
  if (props.players.length <= 2) return []
  
  const currentPlayerId = displayPlayer.value.id
  const playerMap: Record<string, string> = {
    'player_0': 'player_2',  // 控制1号位时，3号位在上方
    'player_1': 'player_3',  // 控制2号位时，4号位在上方
    'player_2': 'player_0',  // 控制3号位时，1号位在上方
    'player_3': 'player_1'   // 控制4号位时，2号位在上方
  }
  
  const targetId = playerMap[currentPlayerId]
  return props.players.filter(p => p.id === targetId)
})

const leftPlayers = computed(() => {
  if (props.players.length <= 2) return []
  
  const currentPlayerId = displayPlayer.value.id
  const playerMap: Record<string, string> = {
    'player_0': 'player_3',  // 控制1号位时，4号位在左边
    'player_1': 'player_0',  // 控制2号位时，1号位在左边
    'player_2': 'player_1',  // 控制3号位时，2号位在左边
    'player_3': 'player_2'   // 控制4号位时，3号位在左边
  }
  
  const targetId = playerMap[currentPlayerId]
  return props.players.filter(p => p.id === targetId)
})

const rightPlayers = computed(() => {
  if (props.players.length <= 2) return []
  
  const currentPlayerId = displayPlayer.value.id
  const playerMap: Record<string, string> = {
    'player_0': 'player_1',  // 控制1号位时，2号位在右边
    'player_1': 'player_2',  // 控制2号位时，3号位在右边
    'player_2': 'player_3',  // 控制3号位时，4号位在右边
    'player_3': 'player_0'   // 控制4号位时，1号位在右边
  }
  
  const targetId = playerMap[currentPlayerId]
  return props.players.filter(p => p.id === targetId)
})

const bottomPlayers = computed(() => {
  // 下方不显示任何玩家，因为右下角有详细信息
  return []
})

// 判断是否有装备
const hasEquipments = computed(() => {
  return (
    displayPlayer.value.equipCards.weapon ||
    displayPlayer.value.equipCards.armor ||
    displayPlayer.value.equipCards.defendHorse ||
    displayPlayer.value.equipCards.offenseHorse
  )
})

const selectPlayer = (player: Player) => {
  console.log('选中玩家:', player.character.name)
  if (playerControl.value) {
    playerControl.value.selectTarget(player)
  }
}

const isTargetSelected = (player: Player) => {
  return playerControl.value?.selectedTargets.some(t => t.id === player.id) || false
}

const canSelectAsTarget = (player: Player) => {
  return playerControl.value?.canSelectAsTarget(player) || false
}

const canUseCard = (card: Card) => {
  return playerControl.value?.canUseCard(card) || false
}

const canUseSkill = (skill: Skill) => {
  return playerControl.value?.canUseSkill(skill) || false
}

const handleCardClick = (card: Card) => {
  console.log('点击卡牌:', card.name)
  if (playerControl.value) {
    playerControl.value.selectCard(card)
  }
}

const handleCardHover = (card: Card | null) => {
  console.log('悬停卡牌:', card?.name)
}

const handleSkillClick = (skill: Skill) => {
  console.log('点击技能:', skill.name)
  if (playerControl.value) {
    playerControl.value.selectSkill(skill)
  }
}

const handleSkillHover = (skill: Skill | null) => {
  console.log('悬停技能:', skill?.name)
}

const confirmAction = () => {
  console.log('确认操作')
  if (playerControl.value) {
    playerControl.value.confirmAction()
  }
}

const cancelAction = () => {
  console.log('取消操作')
  if (playerControl.value) {
    playerControl.value.cancelAction()
  }
}

const confirmDiscard = () => {
  console.log('确认弃牌')
  if (playerControl.value) {
    playerControl.value.confirmDiscard()
  }
}

const skipResponse = () => {
  console.log('跳过响应')
  if (playerControl.value) {
    playerControl.value.skipResponse()
  }
}

const endPlayPhase = () => {
  console.log('结束出牌阶段')
  if (playerControl.value) {
    playerControl.value.endPlayPhase()
  }
}

// 判断是否为蓝队
const isBlueTeam = computed(() => {
  const playerId = displayPlayer.value.id
  return playerId === 'player_0' || playerId === 'player_2'
})

// 判断是否为队友
const isAlly = computed(() => {
  const currentPlayerId = displayPlayer.value.id
  const targetPlayerId = currentPlayerId
  
  // 2v2模式：蓝队（player_0和player_2）vs 红队（player_1和player_3）
  const blueTeam = ['player_0', 'player_2']
  const redTeam = ['player_1', 'player_3']
  
  // 如果当前玩家和目标玩家在同一队，则是队友
  return (blueTeam.includes(currentPlayerId) && blueTeam.includes(targetPlayerId)) ||
         (redTeam.includes(currentPlayerId) && redTeam.includes(targetPlayerId))
})

// 势力文本
const factionText = computed(() => {
  const factionMap: Record<string, string> = {
    wei: '魏',
    shu: '蜀',
    wu: '吴',
    qun: '群'
  }
  return factionMap[displayPlayer.value.character.faction] || ''
})

// 悬停的技能
const hoveredSkill = ref<Skill | null>(null)

// 获取技能触发时机文本
const getTriggerText = (skill: Skill): string => {
  const triggerMap: Record<string, string> = {
    'phase': '阶段开始时',
    'damage': '受到伤害时',
    'useCard': '使用卡牌时',
    'playCard': '出牌阶段',
    'judge': '判定阶段',
    'draw': '摸牌阶段',
    'discard': '弃牌阶段'
  }
  return triggerMap[skill.trigger] || skill.trigger
}
</script>

<style scoped>
.game-arena {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

/* 游戏日志容器 - 左上角 */
.game-log-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  left: 10px;
  z-index: 50;
  width: 300px;
  max-height: 200px;
}

.arena-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;
}

/* 上方对手区域 */
.opponents-area {
  flex: 0 0 auto;
  min-height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.player-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem;
}

.player-row-top {
  flex: 0 0 auto;
}

/* 中间游戏区域 */
.arena-middle {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  min-height: 0;
}

.player-row-left,
.player-row-right {
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.arena-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

.game-status {
  text-align: center;
}

.game-over {
  background: rgba(0, 0, 0, 0.9);
  padding: 3rem 5rem;
  border-radius: 16px;
  border: 3px solid #ffd700;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
}

.game-over h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.game-over p {
  font-size: 1.8rem;
  margin: 0;
  color: white;
}

.game-info {
  background: rgba(0, 0, 0, 0.7);
  padding: 1.5rem 2.5rem;
  border-radius: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  backdrop-filter: blur(10px);
}

.phase-info,
.round-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
}

.phase-label,
.round-label {
  color: rgba(255, 255, 255, 0.7);
}

.phase-value,
.round-value {
  color: #ffd700;
  font-weight: bold;
  font-size: 1.2rem;
}

/* 下方区域 */
.bottom-area {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
}

/* 手牌区 */
.hand-cards-section {
  width: 100%;
  max-height: 200px;
  z-index: 10;
}

/* 技能按钮区 */
.skills-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  z-index: 10;
}

/* 结束出牌按钮 */
.btn-end-phase {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  white-space: nowrap;
}

.btn-end-phase:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e53935 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.6);
}

.btn-end-phase:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
}

/* 操作确认区 */
.action-confirm-section {
  position: absolute;
  bottom: 250px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: rgba(0, 0, 0, 0.9);
  padding: 1.5rem 2.5rem;
  border-radius: 12px;
  border: 2px solid #ffd700;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  max-width: 80%;
}

.action-confirm-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.action-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: white;
  font-size: 1rem;
  text-align: center;
}

.selected-card,
.selected-skill,
.selected-targets {
  color: #ffd700;
  font-weight: bold;
}

.target-hint {
  color: #ff6b6b;
  font-style: italic;
}

.response-hint {
  color: #ff9800;
  font-weight: bold;
  font-size: 1.1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-confirm {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #43a047 0%, #5cb860 100%);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.6);
}

.btn-cancel {
  background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #e53935 0%, #f44336 100%);
  box-shadow: 0 6px 16px rgba(244, 67, 54, 0.6);
}

.btn-skip {
  background: linear-gradient(135deg, #ff9800 0%, #ffa726 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.btn-skip:hover {
  background: linear-gradient(135deg, #fb8c00 0%, #ff9800 100%);
  box-shadow: 0 6px 16px rgba(255, 152, 0, 0.6);
}

/* 右下角当前玩家信息 */
.current-player-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 50;
  right: 10px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* 古朴建筑纹理背景 */
.current-player-info::before {
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

/* 角色卡片区域 */
.character-card {
  flex: 1;
  background: linear-gradient(135deg, #6B21A8 0%, #7C3AED 50%, #8B5CF6 100%);
  border-radius: 8px;
  padding: 0.5rem;
  position: relative;
  min-width: 100px;
  min-height: 180px;
  box-shadow: 0 4px 15px rgba(107, 33, 168, 0.4);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

/* 左侧信息区 */
.character-info-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding-right: 0.3rem;
  min-width: 50px;
}

/* 队伍标识 */
.team-badge {
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: bold;
  color: white;
  min-width: 30px;
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
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
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

/* 武将名字（竖着显示） */
.character-name-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.2rem;
}

/* 右侧图片区 */
.character-image-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  max-width: 60px;
}

.character-image-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  max-width: 60px;
  max-height: 160px;
}

/* 友/敌标识 */
.relation-badge {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
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


/* 血量显示 */
.hp-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hp-gems {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: center;
}

.hp-gem {
  width: 16px;
  height: 16px;
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
.hand-cards-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05rem;
}

.hand-cards-count {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hand-cards-label {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 装备区域 */
.equipments {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  width: 100%;
}

.equip-item {
  font-size: 0.7rem;
  padding: 0.15rem 0.3rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 技能按钮区域 */
.skills-panel {
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  z-index: 1;
  justify-content: center;
  flex-wrap: wrap;
}

.skill-button {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: 1px solid #D2691E;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  color: #fff;
  font-size: 0.7rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-width: 40px;
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
  margin-bottom: 0.1rem;
}

.skill-button-limited {
  display: inline-block;
  font-size: 0.5rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.3);
  padding: 1px 3px;
  border-radius: 2px;
  margin-right: 0.1rem;
}

.skill-button-active {
  display: inline-block;
  font-size: 0.5rem;
  color: #ffffff;
  background: rgba(76, 175, 80, 0.5);
  padding: 1px 3px;
  border-radius: 2px;
  font-weight: bold;
}

/* 角色卡片区域 */
.character-card {
  flex: 1;
  background: linear-gradient(135deg, #6B21A8 0%, #7C3AED 50%, #8B5CF6 100%);
  border-radius: 10px;
  padding: 0.5rem;
  position: relative;
  min-width: 90px;
  min-height: 160px;
  box-shadow: 0 4px 15px rgba(107, 33, 168, 0.4);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

/* 左侧信息区 */
.character-info-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding-right: 0.3rem;
  min-width: 45px;
}

/* 队伍标识 */
.team-badge {
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: bold;
  color: white;
  min-width: 30px;
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
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
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

/* 武将名字（竖着显示） */
.character-name-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.15rem;
}

/* 右侧图片区 */
.character-image-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  max-width: 50px;
}

.character-image-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  max-width: 50px;
  max-height: 150px;
}

/* 友/敌标识 */
.relation-badge {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
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


/* 血量显示 */
.hp-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hp-gems {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  align-items: center;
}

.hp-gem {
  width: 16px;
  height: 16px;
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
.hand-cards-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.hand-cards-count {
  font-size: 1.25rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hand-cards-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 装备区域 */
.equipments {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  width: 100%;
}

.equip-item {
  font-size: 0.6rem;
  padding: 0.2rem 0.4rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 技能详情提示 */
.skill-detail-tooltip {
  position: absolute;
  bottom: 100%;
  right: 0;
  width: 280px;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 200;
  margin-bottom: 10px;
  padding: 0.75rem;
  backdrop-filter: blur(10px);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
}

.tooltip-name {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
}

.tooltip-limited {
  font-size: 0.65rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
}

.tooltip-active {
  font-size: 0.65rem;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
}

.tooltip-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.tooltip-trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

.trigger-label {
  font-weight: bold;
}

.trigger-value {
  color: rgba(255, 255, 255, 0.7);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .game-log-container {
    width: 250px;
    max-height: 150px;
  }
  
  .current-player-info {
    min-width: 180px;
  }
  
  .character-card {
    min-width: 120px;
    min-height: 180px;
  }
  
  .character-image-right {
    max-width: 60px;
  }
  
  .character-image-right img {
    max-width: 60px;
    max-height: 160px;
  }
}

@media (max-width: 768px) {
  .game-log-container {
    width: 200px;
    max-height: 120px;
  }
  
  .current-player-info {
    min-width: 150px;
    padding: 0.5rem;
  }
  
  .character-card {
    min-width: 100px;
    min-height: 160px;
  }
  
  .character-image-right {
    max-width: 50px;
  }
  
  .character-image-right img {
    max-width: 50px;
    max-height: 140px;
  }
  
  .action-confirm-section {
    bottom: 180px;
    padding: 1rem 1.5rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>