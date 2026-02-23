<template>
  <div class="game-log">
    <div class="log-header">
      <span class="log-title">游戏日志</span>
      <button class="log-clear" @click="clearLog">清空</button>
    </div>
    <div class="log-content" ref="logContent">
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="log-entry"
        :class="`log-${log.type}`"
      >
        <span class="log-message">{{ log.message }}</span>
      </div>
      <div v-if="logs.length === 0" class="log-empty">
        暂无日志
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

export interface LogEntry {
  type: 'info' | 'success' | 'warning' | 'error' | 'card' | 'skill' | 'damage' | 'recover'
  message: string
  timestamp: number
}

const props = defineProps<{
  logs: LogEntry[]
}>()

const emit = defineEmits<{
  clear: []
}>()

const logContent = ref<HTMLElement | null>(null)

// 监听日志变化，自动滚动到底部
watch(() => props.logs.length, async () => {
  await nextTick()
  if (logContent.value) {
    logContent.value.scrollTop = logContent.value.scrollHeight
  }
})

// 清空日志
const clearLog = () => {
  emit('clear')
}
</script>

<style scoped>
.game-log {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
}

.log-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.log-clear {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 4px;
  color: #ffd700;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}

.log-clear:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.5);
}

.log-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.log-content::-webkit-scrollbar {
  width: 4px;
}

.log-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.log-content::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 2px;
}

.log-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 215, 0, 0.5);
}

.log-entry {
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.2rem;
  border-radius: 4px;
  font-size: 0.75rem;
  line-height: 1.3;
  animation: slideIn 0.2s ease;
  border-left: 2px solid transparent;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-message {
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
}

.log-info {
  background: rgba(100, 181, 246, 0.1);
  border-left-color: #64b5f6;
}

.log-success {
  background: rgba(76, 175, 80, 0.1);
  border-left-color: #4caf50;
}

.log-warning {
  background: rgba(255, 152, 0, 0.1);
  border-left-color: #ff9800;
}

.log-error {
  background: rgba(244, 67, 54, 0.1);
  border-left-color: #f44336;
}

.log-card {
  background: rgba(156, 39, 176, 0.1);
  border-left-color: #9c27b0;
}

.log-skill {
  background: rgba(255, 193, 7, 0.1);
  border-left-color: #ffc107;
}

.log-damage {
  background: rgba(244, 67, 54, 0.15);
  border-left-color: #f44336;
  font-weight: bold;
  color: #ff6b6b;
}

.log-recover {
  background: rgba(76, 175, 80, 0.15);
  border-left-color: #4caf50;
  font-weight: bold;
  color: #81c784;
}

.log-empty {
  text-align: center;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .log-header {
    padding: 0.4rem 0.6rem;
  }

  .log-title {
    font-size: 0.75rem;
  }

  .log-clear {
    padding: 0.15rem 0.4rem;
    font-size: 0.65rem;
  }

  .log-content {
    padding: 0.4rem;
  }

  .log-entry {
    padding: 0.25rem 0.4rem;
    font-size: 0.7rem;
  }
}
</style>