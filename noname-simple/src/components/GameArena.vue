<template>
  <div class="game-arena">
    <div class="arena-content">
      <!-- 游戏日志 -->
      <GameLog :logs="gameLog.logs.value" @clear="gameLog.clear" />
      <!-- 上方玩家 -->
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

      <!-- 中间区域 -->
      <div class="arena-middle">
        <!-- 左侧玩家 -->
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

        <!-- 右侧玩家 -->
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

      <!-- 下方玩家（自己）- 不显示当前玩家，因为右下角有详细信息 -->
      <div class="player-row player-row-bottom">
        <PlayerInfo
          v-for="player in bottomPlayers"
          :key="player.id"
          :player="player"
          :is-current="isCurrentPlayer(player)"
          :is-target="isTargetSelected(player)"
          :can-select="canSelectAsTarget(player)"
          @click="selectPlayer(player)"
        />
      </div>

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

      <!-- 技能按钮区和结束出牌按钮 - 只在非响应状态下显示 -->
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

      <!-- 右下角当前玩家信息 -->
      <div v-if="displayPlayer" class="current-player-info">
        <!-- 技能按钮区域（左侧） -->
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
            <span v-if="skill.limited" class="skill-button-limited">限定</span>
            <span v-if="skill.active" class="skill-button-active">主动</span>
          </div>
        </div>

        <!-- 角色卡片区域（右侧） -->
        <div class="character-card">
          <!-- 左侧信息区 -->
          <div class="character-info-left">
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
                ⚔️ {{ displayPlayer.equipCards.weapon.name }}
              </div>
              <div v-if="displayPlayer.equipCards.armor" class="equip-item" title="防具">
                🛡️ {{ displayPlayer.equipCards.armor.name }}
              </div>
              <div v-if="displayPlayer.equipCards.defendHorse" class="equip-item" title="防御马">
                🐴 {{ displayPlayer.equipCards.defendHorse.name }}
              </div>
              <div v-if="displayPlayer.equipCards.offenseHorse" class="equip-item" title="进攻马">
                🐎 {{ displayPlayer.equipCards.offenseHorse.name }}
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
  
  const winnerMap: Record<string, string> = {
    zhu: '主公和忠臣获胜！',
    fan: '反贼获胜！',
    nei: '内奸获胜！'
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
  if (props.players.length <= 3) return []
  
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
  if (props.players.length <= 4) return []
  
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

// 处理卡牌点击
const handleCardClick = (card: Card) => {
  // 检查是否处于弃牌选择状态
  if (playerControl.value?.controlState === 'selectingDiscard') {
    console.log('选择要弃置的卡牌:', card.name)
    playerControl.value.selectDiscardCard(card)
    return
  }
  
  // 检查是否处于等待响应状态
  if (props.game.state.waitingForResponse && props.game.state.responseTarget) {
    const responseTarget = props.game.state.responseTarget
    const responseCard = props.game.state.responseCard
    
    // 检查当前玩家是否是需要响应的目标
    if (displayPlayer.value.id === responseTarget.id) {
      // 检查点击的卡牌是否是需要的响应卡牌
      if (card.name === responseCard) {
        console.log('选中响应卡牌:', card.name)
        // 选中响应卡牌，但不立即使用
        if (playerControl.value) {
          playerControl.value.selectCard(card)
          console.log('selectCard调用后，selectedCard:', playerControl.value.selectedCard)
        } else {
          console.log('playerControl.value为空')
        }
        return
      }
      return
    }
  }
  
  // 正常的卡牌选择逻辑
  if (playerControl.value) {
    playerControl.value.selectCard(card)
  }
}

// 处理卡牌悬停
const handleCardHover = (card: Card | null) => {
  if (card) {
    console.log('悬停卡牌:', card.name)
  }
}

// 处理技能点击
const handleSkillClick = (skill: Skill) => {
  console.log('点击技能:', skill.name)
  if (playerControl.value) {
    playerControl.value.startSelectSkill(skill)
  }
}

// 处理技能悬停
const handleSkillHover = (skill: Skill | null) => {
  if (skill) {
    console.log('悬停技能:', skill.name)
  }
}

// 确认操作
const confirmAction = () => {
  // 检查是否处于弃牌确认状态
  if (playerControl.value?.controlState === 'confirming' && playerControl.value.selectedDiscards?.length > 0) {
    console.log('确认弃牌')
    playerControl.value.confirmDiscard()
    return
  }
  
  // 检查是否处于等待响应状态
  if (props.game.state.waitingForResponse && props.game.state.responseTarget) {
    const responseTarget = props.game.state.responseTarget
    const responseCard = props.game.state.responseCard
    const selectedCard = playerControl.value?.selectedCard
    
    // 检查是否选中了响应卡牌
    if (selectedCard && selectedCard.name === responseCard) {
      console.log('使用响应卡牌:', selectedCard.name)
      // 使用响应卡牌
      props.gameLog.card(`${responseTarget.character.name} 使用【${selectedCard.name}】响应`)
      
      // 从手牌中移除
      const cardIndex = responseTarget.handCards.findIndex(c => c.id === selectedCard.id)
      if (cardIndex !== -1) {
        responseTarget.handCards.splice(cardIndex, 1)
      }
      
      // 清除响应状态
      props.game.state.waitingForResponse = false
      props.game.state.responseTarget = undefined
      props.game.state.responseCard = undefined
      
      // 清空选择
      if (playerControl.value) {
        playerControl.value.cancelSelection()
      }
      return
    }
  }
  
  // 正常的确认操作
  if (playerControl.value) {
    playerControl.value.confirmAction()
  }
}

// 取消操作
const cancelAction = () => {
  if (playerControl.value) {
    playerControl.value.cancelSelection()
  }
}

// 结束出牌阶段
const endPlayPhase = () => {
  if (playerControl.value) {
    playerControl.value.endPlayPhase()
  }
}

// 确认弃牌
const confirmDiscard = () => {
  if (playerControl.value) {
    playerControl.value.confirmDiscard()
  }
}

// 跳过响应
const skipResponse = () => {
  if (props.game.state.waitingForResponse && props.game.state.responseTarget) {
    const responseTarget = props.game.state.responseTarget
    const hasCard = props.game.state.responseHasCard || false
    
    if (hasCard) {
      console.log(`${responseTarget.character.name} 选择不使用【${props.game.state.responseCard}】`)
      props.gameLog.info(`${responseTarget.character.name} 选择不使用【${props.game.state.responseCard}】`)
    } else {
      console.log(`${responseTarget.character.name} 确认受到伤害`)
      props.gameLog.info(`${responseTarget.character.name} 确认受到伤害`)
    }
    
    // 目标受到伤害
    if (props.game.state.responseCard === '闪') {
      // 找到使用杀的玩家
      const attacker = props.players.find(p => p.isTurn)
      if (attacker) {
        props.gameLog.damage(`${responseTarget.character.name} 受到1点伤害`)
        responseTarget.takeDamage(1)
      }
    }
    
    // 清除响应状态
    props.game.state.waitingForResponse = false
    props.game.state.responseTarget = undefined
    props.game.state.responseCard = undefined
    props.game.state.responseHasCard = undefined
  }
}

// 判断是否可以选中玩家为目标
const canSelectAsTarget = (player: Player) => {
  if (!playerControl.value) return false
  return playerControl.value.canSelectAsTarget(player)
}

// 判断玩家是否已被选中为目标
const isTargetSelected = (player: Player) => {
  if (!playerControl.value) return false
  return playerControl.value.isTargetSelected(player)
}

// 判断卡牌是否可用
const canUseCard = (card: Card) => {
  // 检查是否处于等待响应状态
  const isWaitingForResponse = props.game.state.waitingForResponse
  const isResponseTarget = props.game.state.responseTarget?.id === displayPlayer.value.id
  const responseCard = props.game.state.responseCard
  
  // 如果处于等待响应状态，且显示玩家是响应目标
  if (isWaitingForResponse && isResponseTarget) {
    // 只能使用响应卡牌
    return card.name === responseCard
  }
  
  // 否则使用playerControl的判断
  if (!playerControl.value) return false
  return playerControl.value.canUseCard(card)
}

// 判断技能是否可用
const canUseSkill = (skill: Skill) => {
  if (!playerControl.value) return false
  return playerControl.value.canUseSkill(skill)
}

// 获取身份文本
const identityText = (identity: string) => {
  // 根据玩家位置显示"队友"或"敌人"
  // 下面是1号位（player_0），右边是2号位（player_1），上面是3号位（player_2），左边是4号位（player_3）
  // 1号位和4号位是队友
  // 2号位和3号位是敌人
  const playerId = displayPlayer.value.id
  if (playerId === 'player_0' || playerId === 'player_3') {
    return '队友'
  }
  return '敌人'
}

// 势力文本
const factionText = computed(() => {
  const factionMap: Record<string, string> = {
    'wei': '魏',
    'shu': '蜀',
    'wu': '吴',
    'qun': '群'
  }
  return factionMap[displayPlayer.value.character.faction] || ''
})

// 判断是否为盟友
const isAlly = computed(() => {
  const playerId = displayPlayer.value.id
  // 1号位和4号位是队友
  // 2号位和3号位是敌人
  return playerId === 'player_0' || playerId === 'player_3'
})

// 技能悬停状态
const hoveredSkill = ref<any>(null)

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
.game-arena {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.arena-content {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  position: relative;
}

/* 游戏日志 - 左上角 */
.game-log {
  position: absolute;
  top: -5rem;
  left: -5rem;
  z-index: 10;
}

.player-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem;
}

.player-row-top {
  flex: 0 0 auto;
  margin-top: -20px;
}

.player-row-bottom {
  flex: 0 0 auto;
}

.arena-middle {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-row-left,
.player-row-right {
  flex-direction: column;
  height: 100%;
  margin-top: -20px;
}

.arena-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-status {
  text-align: center;
}

.game-over {
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem 4rem;
  border-radius: 8px;
}

.game-over h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.game-over p {
  font-size: 1.5rem;
  margin: 0;
}

.game-info {
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.phase-info,
.round-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.phase-label,
.round-label {
  color: rgba(255, 255, 255, 0.7);
}

.phase-value,
.round-value {
  color: #ffd700;
  font-weight: bold;
}

.hand-cards-section {
  position: absolute;
  bottom: -8rem;
  left: 0;
  right: 0;
  z-index: 10;
}

.skills-section {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* 结束出牌按钮 */
.btn-end-phase {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  white-space: nowrap;
}

.btn-end-phase:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e53935 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.5);
}

.btn-end-phase:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
}

.action-confirm-section {
  position: absolute;
  bottom: 240px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 2px solid #ffd700;
}

.action-confirm-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.action-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: white;
  font-size: 0.9rem;
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
  font-size: 1rem;
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
}

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-confirm {
  background: #4caf50;
  color: white;
}

.btn-confirm:hover {
  background: #45a049;
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-cancel:hover {
  background: #da190b;
}

.btn-skip {
  background: #ff9800;
  color: white;
}

.btn-skip:hover {
  background: #f57c00;
}

.current-player-info {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 200px;
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
  border-radius: 12px;
  pointer-events: none;
  z-index: 0;
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
  min-height: 220px;
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
  gap: 0.5rem;
  padding-right: 0.5rem;
  min-width: 60px;
}

/* 势力标识 */
.faction-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
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

/* 武将名字（竖着显示） */
.character-name-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.25rem;
}

/* 右侧图片区 */
.character-image-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  max-width: 80px;
}

.character-image-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  max-width: 80px;
  max-height: 200px;
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
  width: 20px;
  height: 20px;
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

/* 旧样式 - 删除 */
.character-avatar-section,
.equipments-section,
.equipments-header,
.equipments-title,
.equipments-grid,
.equip-slot,
.equip-weapon,
.equip-armor,
.equip-defend-horse,
.equip-offense-horse,
.equip-icon,
.equip-name,
.character-avatar-image,
.skills-list,
.skill-item,
.skill-item-header,
.skill-item-name,
.skill-limited-badge,
.skill-active-badge {
  display: none;
}

.skill-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.skill-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 215, 0, 0.5);
}

.skill-item.skill-active {
  border-color: rgba(76, 175, 80, 0.5);
  background: rgba(76, 175, 80, 0.1);
}

.skill-item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.skill-item-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.skill-limited-badge {
  font-size: 0.65rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
}

.skill-active-badge {
  font-size: 0.65rem;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
}

.skill-item-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.skill-item-trigger {
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

.skill-detail-tooltip {
  position: absolute;
  bottom: 100%;
  right: 0;
  width: 280px;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  z-index: 200;
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
  font-size: 0.95rem;
  font-weight: bold;
  color: #ffd700;
}

.tooltip-limited {
  font-size: 0.7rem;
  color: #e53935;
  background: rgba(229, 57, 53, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.tooltip-active {
  font-size: 0.7rem;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.tooltip-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.tooltip-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 装备区样式 */
.equipments-section {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.equipments-header {
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
}

.equipments-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffd700;
}

.equipments-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.equip-slot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.equip-slot:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-2px);
}

.equip-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.equip-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.equip-weapon {
  border-left: 3px solid #ff6b6b;
}

.equip-armor {
  border-left: 3px solid #4caf50;
}

.equip-defend-horse {
  border-left: 3px solid #2196f3;
}

.equip-offense-horse {
  border-left: 3px solid #ff9800;
}

/* 武将头像区域 */
.character-avatar-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.character-avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.character-avatar-image:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 215, 0, 0.8);
}
</style>