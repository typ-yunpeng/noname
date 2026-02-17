import type { Player, Character, Card, Skill, Identity, PlayerStatus, GameLogger } from '@/types'

/**
 * 玩家类
 * 管理玩家的状态、手牌、装备等
 */
export class PlayerEntity implements Player {
  id: string
  character: Character
  identity: Identity
  hp: number
  maxHp: number
  handCards: Card[]
  equipCards: {
    weapon?: Card
    armor?: Card
    defendHorse?: Card
    offenseHorse?: Card
  }
  status: PlayerStatus
  isTurn: boolean
  shaCount: number // 当前回合已使用的杀的数量
  private logger?: GameLogger

  constructor(id: string, character: Character, identity: Identity, logger?: GameLogger) {
    this.id = id
    this.character = character
    this.identity = identity
    this.hp = character.hp
    this.maxHp = character.maxHp
    this.handCards = []
    this.equipCards = {}
    this.status = 'alive'
    this.isTurn = false
    this.shaCount = 0
    this.logger = logger
  }

  /**
   * 设置日志记录器
   */
  setLogger(logger: GameLogger): void {
    this.logger = logger
  }

  /**
   * 记录日志
   */
  private log(type: 'info' | 'success' | 'warning' | 'error' | 'card' | 'skill' | 'damage' | 'recover', message: string): void {
    if (this.logger) {
      this.logger[type](message)
    }
  }

  /**
   * 受到伤害
   */
  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount)
    console.log(`${this.character.name} 受到 ${amount} 点伤害，剩余体力: ${this.hp}`)
    this.log('damage', `${this.character.name} 受到 ${amount} 点伤害，剩余体力: ${this.hp}`)
    
    if (this.hp === 0) {
      this.die()
    }
  }

  /**
   * 回复体力
   */
  recover(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount)
    console.log(`${this.character.name} 回复 ${amount} 点体力，当前体力: ${this.hp}`)
    this.log('recover', `${this.character.name} 回复 ${amount} 点体力，当前体力: ${this.hp}`)
  }

  /**
   * 死亡
   */
  die(): void {
    this.status = 'dead'
    console.log(`${this.character.name} 阵亡！`)
    this.log('error', `${this.character.name} 阵亡！`)
    
    // 弃掉所有手牌和装备
    this.handCards = []
    this.equipCards = {}
  }

  /**
   * 装备卡牌
   */
  equip(card: Card): void {
    if (card.type !== 'equip') {
      console.log('只能装备装备牌')
      return
    }

    switch (card.equipType) {
      case 'weapon':
        this.equipCards.weapon = card
        break
      case 'armor':
        this.equipCards.armor = card
        break
      case 'defendHorse':
        this.equipCards.defendHorse = card
        break
      case 'offenseHorse':
        this.equipCards.offenseHorse = card
        break
    }
    
    console.log(`${this.character.name} 装备了 ${card.name}`)
  }

  /**
   * 卸下装备
   */
  unequip(equipType: string): void {
    switch (equipType) {
      case 'weapon':
        this.equipCards.weapon = undefined
        break
      case 'armor':
        this.equipCards.armor = undefined
        break
      case 'defendHorse':
        this.equipCards.defendHorse = undefined
        break
      case 'offenseHorse':
        this.equipCards.offenseHorse = undefined
        break
    }
  }

  /**
   * 检查是否有某个技能
   */
  hasSkill(skillId: string): boolean {
    return this.character.skills.some(skill => skill.id === skillId)
  }

  /**
   * 获取可用的主动技能
   */
  getActiveSkills(): Skill[] {
    return this.character.skills.filter(skill => skill.active)
  }

  /**
   * 计算攻击距离
   */
  getAttackRange(): number {
    let range = 1
    
    if (this.equipCards.weapon) {
      // 武器增加攻击距离
      range += this.getWeaponRange(this.equipCards.weapon)
    }
    
    if (this.equipCards.offenseHorse) {
      // 进攻马增加攻击距离
      range += 1
    }
    
    return range
  }

  /**
   * 计算防御距离
   */
  getDefenseRange(): number {
    let range = 0
    
    if (this.equipCards.defendHorse) {
      // 防御马增加防御距离
      range += 1
    }
    
    return range
  }

  /**
   * 获取武器攻击距离
   */
  private getWeaponRange(weapon: Card): number {
    // 简化处理，实际应该根据武器类型返回不同距离
    return 1
  }

  /**
   * 翻面
   */
  flip(): void {
    this.status = this.status === 'flipped' ? 'alive' : 'flipped'
    console.log(`${this.character.name} ${this.status === 'flipped' ? '翻面' : '翻回'}`)
  }

  /**
   * 横置
   */
  link(): void {
    this.status = this.status === 'linked' ? 'alive' : 'linked'
    console.log(`${this.character.name} ${this.status === 'linked' ? '横置' : '解除横置'}`)
  }
}