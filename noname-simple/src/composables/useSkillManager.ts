import { ref, computed } from 'vue'
import type { Skill, Player, Game } from '@/types'

/**
 * 技能管理
 * 处理技能的触发、执行等逻辑
 */
export function useSkillManager(player: Player, game: Game) {
  // 激活的技能列表
  const activeSkills = ref<Skill[]>([])
  
  // 技能使用次数记录（用于限定技）
  const skillUsageCount = ref<Record<string, number>>({})
  
  /**
   * 判断是否可以使用技能
   */
  const canUseSkill = (skill: Skill): boolean => {
    // 只有当前回合的玩家才能使用主动技能
    if (!player.isTurn) return false
    
    // 检查是否为限定技且已使用
    if (skill.limited && skillUsageCount.value[skill.id] > 0) {
      return false
    }
    
    // 检查技能是否在当前阶段可以触发
    const currentPhase = game.state.phase
    const canTrigger = skill.trigger.some(trigger => {
      // 主动技能通常在出牌阶段使用
      if (trigger === 'phaseBegin' || trigger === 'phaseEnd') {
        return true
      }
      if (trigger === 'useCard' && currentPhase === 'play') {
        return true
      }
      return false
    })
    
    return canTrigger
  }
  
  /**
   * 触发技能
   */
  const triggerSkill = (skill: Skill) => {
    if (!canUseSkill(skill)) return
    
    console.log(`触发技能: ${skill.name}`)
    
    // 记录技能使用次数
    if (skill.limited) {
      skillUsageCount.value[skill.id] = (skillUsageCount.value[skill.id] || 0) + 1
    }
    
    // 执行技能效果
    try {
      skill.execute(player, game)
      
      // 添加到激活技能列表
      if (!activeSkills.value.includes(skill)) {
        activeSkills.value.push(skill)
      }
    } catch (error) {
      console.error(`技能执行失败: ${skill.name}`, error)
    }
  }
  
  /**
   * 检查技能是否已激活
   */
  const isSkillActive = (skill: Skill): boolean => {
    return activeSkills.value.includes(skill)
  }
  
  /**
   * 获取可用的主动技能
   */
  const getAvailableSkills = (): Skill[] => {
    return player.character.skills.filter(skill => skill.active && canUseSkill(skill))
  }
  
  /**
   * 处理阶段开始时的技能触发
   */
  const handlePhaseBegin = (phase: string) => {
    player.character.skills.forEach(skill => {
      if (skill.trigger.includes('phaseBegin' as any)) {
        console.log(`阶段开始触发技能: ${skill.name}`)
        // 自动触发被动技能
        if (!skill.active) {
          triggerSkill(skill)
        }
      }
    })
  }
  
  /**
   * 处理阶段结束时的技能触发
   */
  const handlePhaseEnd = (phase: string) => {
    player.character.skills.forEach(skill => {
      if (skill.trigger.includes('phaseEnd' as any)) {
        console.log(`阶段结束触发技能: ${skill.name}`)
        // 自动触发被动技能
        if (!skill.active) {
          triggerSkill(skill)
        }
      }
    })
  }
  
  /**
   * 处理使用卡牌时的技能触发
   */
  const handleUseCard = (card: any) => {
    player.character.skills.forEach(skill => {
      if (skill.trigger.includes('useCard' as any)) {
        console.log(`使用卡牌触发技能: ${skill.name}`)
        // 自动触发被动技能
        if (!skill.active) {
          triggerSkill(skill)
        }
      }
    })
  }
  
  /**
   * 处理受到伤害时的技能触发
   */
  const handleDamage = (amount: number) => {
    player.character.skills.forEach(skill => {
      if (skill.trigger.includes('damage' as any)) {
        console.log(`受到伤害触发技能: ${skill.name}`)
        // 自动触发被动技能
        if (!skill.active) {
          triggerSkill(skill)
        }
      }
    })
  }
  
  /**
   * 处理回复体力时的技能触发
   */
  const handleRecover = (amount: number) => {
    player.character.skills.forEach(skill => {
      if (skill.trigger.includes('recover' as any)) {
        console.log(`回复体力触发技能: ${skill.name}`)
        // 自动触发被动技能
        if (!skill.active) {
          triggerSkill(skill)
        }
      }
    })
  }
  
  /**
   * 处理判定阶段的技能触发
   */
  const handleJudge = () => {
    player.character.skills.forEach(skill => {
      if (skill.trigger.includes('judge' as any)) {
        console.log(`判定阶段触发技能: ${skill.name}`)
        // 自动触发被动技能
        if (!skill.active) {
          triggerSkill(skill)
        }
      }
    })
  }
  
  /**
   * 处理摸牌阶段的技能触发
   */
  const handleDraw = () => {
    player.character.skills.forEach(skill => {
      if (skill.trigger.includes('draw' as any)) {
        console.log(`摸牌阶段触发技能: ${skill.name}`)
        // 自动触发被动技能
        if (!skill.active) {
          triggerSkill(skill)
        }
      }
    })
  }
  
  /**
   * 重置技能状态（新回合开始时）
   */
  const resetSkills = () => {
    activeSkills.value = []
    // 不重置限定技的使用次数
  }
  
  return {
    activeSkills,
    skillUsageCount,
    canUseSkill,
    triggerSkill,
    isSkillActive,
    getAvailableSkills,
    handlePhaseBegin,
    handlePhaseEnd,
    handleUseCard,
    handleDamage,
    handleRecover,
    handleJudge,
    handleDraw,
    resetSkills
  }
}