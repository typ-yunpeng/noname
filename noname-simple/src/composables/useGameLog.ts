import { ref } from 'vue'
import type { LogEntry } from '@/components/GameLog.vue'

/**
 * 游戏日志管理
 * 记录游戏过程中的各种事件
 */
export function useGameLog() {
  const logs = ref<LogEntry[]>([])
  
  /**
   * 添加日志
   */
  const addLog = (type: LogEntry['type'], message: string) => {
    logs.value.push({
      type,
      message,
      timestamp: Date.now()
    })
    
    // 限制日志数量，最多保留100条
    if (logs.value.length > 100) {
      logs.value.shift()
    }
  }
  
  /**
   * 添加信息日志
   */
  const info = (message: string) => {
    addLog('info', message)
  }
  
  /**
   * 添加成功日志
   */
  const success = (message: string) => {
    addLog('success', message)
  }
  
  /**
   * 添加警告日志
   */
  const warning = (message: string) => {
    addLog('warning', message)
  }
  
  /**
   * 添加错误日志
   */
  const error = (message: string) => {
    addLog('error', message)
  }
  
  /**
   * 添加卡牌日志
   */
  const card = (message: string) => {
    addLog('card', message)
  }
  
  /**
   * 添加技能日志
   */
  const skill = (message: string) => {
    addLog('skill', message)
  }
  
  /**
   * 添加伤害日志
   */
  const damage = (message: string) => {
    addLog('damage', message)
  }
  
  /**
   * 添加回复日志
   */
  const recover = (message: string) => {
    addLog('recover', message)
  }
  
  /**
   * 清空日志
   */
  const clear = () => {
    logs.value = []
  }
  
  return {
    logs,
    addLog,
    info,
    success,
    warning,
    error,
    card,
    skill,
    damage,
    recover,
    clear
  }
}