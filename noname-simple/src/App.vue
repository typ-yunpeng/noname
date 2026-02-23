<template>
  <div id="app">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="game-title">三国杀 · 2v2</h1>
          <div class="game-subtitle">简化版</div>
        </div>
        <div class="header-right">
          <div class="game-info">
            <div class="info-item">
              <span class="info-label">回合</span>
              <span class="info-value">{{ game.state.roundNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">阶段</span>
              <span class="info-value">{{ phaseText }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="header-decoration"></div>
    </header>

    <main class="main">
      <GameArena v-if="game.players.length > 0" :players="game.players" :game="game" :game-log="gameLog" />
      <div v-else class="placeholder">
        <div class="placeholder-content">
          <div class="placeholder-icon">⚔️</div>
          <h2 class="placeholder-title">三国杀 · 2v2</h2>
          <p class="placeholder-desc">蓝队 vs 红队，经典对战模式</p>
          <button @click="startCharacterSelection" class="btn-primary">
            <span class="btn-text">开始游戏</span>
            <span class="btn-decoration"></span>
          </button>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>三国杀简化版 v0.1.0 | 2v2对战模式</p>
      </div>
    </footer>

    <!-- 武将选择界面 -->
    <CharacterSelect
      v-show="showCharacterSelect"
      :key="showCharacterSelect ? 'show' : 'hide'"
      :player-index="0"
      :selected-characters="[]"
      @select="handleCharacterSelect"
      @cancel="handleCharacterCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
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
  console.log('handleCharacterSelect called', character)
  selectedCharacter.value = character
  startGameWithSelectedCharacter()
}

// 取消武将选择
const handleCharacterCancel = () => {
  console.log('handleCharacterCancel called')
  showCharacterSelect.value = false
  selectedCharacter.value = null
}

// 使用选中的武将开始游戏
const startGameWithSelectedCharacter = async () => {
  console.log('startGameWithSelectedCharacter called')
  console.log('Before: showCharacterSelect =', showCharacterSelect.value)
  showCharacterSelect.value = false
  console.log('After: showCharacterSelect =', showCharacterSelect.value)
  
  // 等待 DOM 更新
  await nextTick()
  console.log('After nextTick: showCharacterSelect =', showCharacterSelect.value)
  
  if (!selectedCharacter.value) {
    console.log('No character selected, returning')
    return
  }
  
  console.log('Selected character:', selectedCharacter.value.name)
  
  // 从所有武将中移除已选的武将
  const remainingCharacters = standardCharacters.filter(
    c => c.name !== selectedCharacter.value!.name
  )
  
  // 随机选择3个其他武将（2v2模式共4人）
  const shuffled = [...remainingCharacters].sort(() => Math.random() - 0.5)
  const randomCharacters = shuffled.slice(0, 3)
  
  // 组合所有武将：用户选择的 + 随机选择的
  const allCharacters = [selectedCharacter.value, ...randomCharacters]
  
  console.log('All characters:', allCharacters.map(c => c.name))
  
  // 初始化牌堆
  game.value.initializeDeck()
  
  // 使用武将创建玩家
  game.value.createPlayersWithCharacters(allCharacters)
  
  // 分配初始手牌
  game.value.dealInitialCards()
  
  // 开始游戏
  game.value.start()
  
  console.log('Game started')
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  position: relative;
  overflow: hidden;
}

/* 背景纹理 */
#app::before {
  content: '';
  position: fixed;
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
  pointer-events: none;
  z-index: 0;
}

/* 头部样式 */
.header {
  position: relative;
  z-index: 10;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
  border-bottom: 3px solid #ffd700;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  max-width: 1600px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.game-title {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.1em;
}

.game-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
}

.header-right {
  display: flex;
  align-items: center;
}

.game-info {
  display: flex;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
}

.info-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.info-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffd700;
}

.header-decoration {
  height: 4px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #ffd700 20%, 
    #ffed4e 50%, 
    #ffd700 80%, 
    transparent 100%
  );
}

/* 主内容区 */
.main {
  flex: 1;
  position: relative;
  z-index: 5;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 占位符样式 */
.placeholder {
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.placeholder-content {
  padding: 4rem 3rem;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.placeholder-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.placeholder-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2rem 0;
}

/* 按钮样式 */
.btn-primary {
  position: relative;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

.btn-primary:active {
  transform: translateY(0);
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
}

.btn-primary:hover .btn-decoration {
  left: 100%;
}

/* 底部样式 */
.footer {
  position: relative;
  z-index: 10;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-content p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .game-title {
    font-size: 1.5rem;
  }

  .game-info {
    gap: 1rem;
  }

  .placeholder-content {
    padding: 2rem 1.5rem;
  }

  .placeholder-title {
    font-size: 1.8rem;
  }

  .btn-primary {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }
}
</style>