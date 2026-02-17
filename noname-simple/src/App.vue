<template>
  <div id="app">
    <header class="header">
      <h1>无名杀 - 简化版</h1>
      <div class="game-info">
        <span>回合: {{ game.state.roundNumber }}</span>
        <span>阶段: {{ phaseText }}</span>
      </div>
    </header>

    <main class="main">
      <GameArena v-if="game.players.length > 0" :players="game.players" :game="game" :game-log="gameLog" />
      <div v-else class="placeholder">
        <p>游戏尚未开始</p>
        <button @click="startCharacterSelection" class="btn-primary">开始游戏</button>
      </div>
    </main>

    <footer class="footer">
      <p>简化版无名杀 v0.1.0</p>
    </footer>

    <!-- 武将选择界面 -->
    <CharacterSelect
      v-if="showCharacterSelect"
      :player-index="0"
      :selected-characters="[]"
      @select="handleCharacterSelect"
      @cancel="handleCharacterCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GameEngine } from '@/core/game'
import GameArena from '@/components/GameArena.vue'
import CharacterSelect from '@/components/CharacterSelect.vue'
import { standardCharacters } from '@/data/characters/standard'
import { useGameLog } from '@/composables/useGameLog'
import type { Character } from '@/types'

const game = ref(new GameEngine())

// 创建游戏日志实例
const gameLog = useGameLog()

// 在组件挂载时设置日志记录器
onMounted(() => {
  game.value.setLogger(gameLog)
})

// 武将选择相关状态
const showCharacterSelect = ref(false)
const selectedCharacter = ref<Character | null>(null)

const phaseText = computed(() => {
  const phaseMap: Record<string, string> = {
    prepare: '准备',
    judge: '判定',
    draw: '摸牌',
    play: '出牌',
    discard: '弃牌',
    finish: '结束'
  }
  return phaseMap[game.value.state.phase] || game.value.state.phase
})

// 开始武将选择
const startCharacterSelection = () => {
  showCharacterSelect.value = true
  selectedCharacter.value = null
}

// 处理武将选择
const handleCharacterSelect = (character: Character) => {
  selectedCharacter.value = character
  startGameWithSelectedCharacter()
}

// 取消武将选择
const handleCharacterCancel = () => {
  showCharacterSelect.value = false
  selectedCharacter.value = null
}

// 使用选中的武将开始游戏
const startGameWithSelectedCharacter = () => {
  showCharacterSelect.value = false
  
  if (!selectedCharacter.value) return
  
  // 从所有武将中移除已选的武将
  const remainingCharacters = standardCharacters.filter(
    c => c.name !== selectedCharacter.value!.name
  )
  
  // 随机选择4个其他武将
  const shuffled = [...remainingCharacters].sort(() => Math.random() - 0.5)
  const randomCharacters = shuffled.slice(0, 4)
  
  // 组合所有武将：用户选择的 + 随机选择的
  const allCharacters = [selectedCharacter.value, ...randomCharacters]
  
  // 初始化牌堆
  game.value.initializeDeck()
  
  // 使用武将创建玩家
  game.value.createPlayersWithCharacters(allCharacters)
  
  // 分配初始手牌
  game.value.dealInitialCards()
  
  // 开始游戏
  game.value.start()
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header {
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.game-info {
  display: flex;
  gap: 2rem;
  font-size: 1rem;
}

.main {
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder {
  text-align: center;
}

.placeholder p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.btn-primary {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #45a049;
}

.footer {
  padding: 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  font-size: 0.9rem;
}
</style>