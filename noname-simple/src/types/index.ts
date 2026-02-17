/**
 * 游戏核心类型定义
 */

// 身份类型
export type Identity = 'zhu' | 'zhong' | 'fan' | 'nei'

// 势力类型
export type Faction = 'wei' | 'shu' | 'wu' | 'qun'

// 花色类型
export type Suit = 'spade' | 'heart' | 'club' | 'diamond'

// 卡牌类型
export type CardType = 'basic' | 'trick' | 'equip'

// 装备类型
export type EquipType = 'weapon' | 'armor' | 'defendHorse' | 'offenseHorse'

// 游戏阶段
export type Phase = 'prepare' | 'judge' | 'draw' | 'play' | 'discard' | 'finish'

// 玩家状态
export type PlayerStatus = 'alive' | 'dead' | 'flipped' | 'linked'

// 技能触发时机
export type SkillTrigger = 'phaseBegin' | 'phaseEnd' | 'useCard' | 'damage' | 'recover' | 'judge' | 'draw'

/**
 * 卡牌接口
 */
export interface Card {
  id: string
  name: string
  suit: Suit
  number: number
  type: CardType
  equipType?: EquipType
  description: string
}

/**
 * 技能接口
 */
export interface Skill {
  id: string
  name: string
  description: string
  trigger: SkillTrigger[]
  active: boolean // 是否为主动技能
  limited: boolean // 是否为限定技
  execute: (player: Player, game: Game) => void
}

/**
 * 武将接口
 */
export interface Character {
  id: string
  name: string
  identity: Identity
  faction: Faction
  hp: number
  maxHp: number
  skills: Skill[]
  avatar: string
}

/**
 * 玩家接口
 */
export interface Player {
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
  takeDamage: (amount: number) => void
  recover: (amount: number) => void
  equip: (card: Card) => void
}

/**
 * 游戏事件接口
 */
export interface GameEvent {
  type: string
  player: Player
  data?: any
  timestamp: number
}

/**
 * 玩家控制状态
 */
export type PlayerControlState = 'idle' | 'selectingCard' | 'selectingTarget' | 'selectingSkill' | 'selectingCardForSkill' | 'confirming' | 'selectingDiscard'

/**
 * 玩家控制信息
 */
export interface PlayerControl {
  playerId: string
  isHuman: boolean // 是否为人类玩家
  controlState: PlayerControlState
  selectedCard?: Card
  selectedTargets: Player[]
  selectedSkill?: Skill
  requiredTargetCount: number
}

/**
 * 游戏状态接口
 */
export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  phase: Phase
  roundNumber: number
  isGameOver: boolean
  winner?: Identity
  waitingForPlayer: boolean // 是否等待玩家操作
  playerControl?: PlayerControl // 当前玩家控制信息
  waitingForResponse: boolean // 是否等待响应卡牌
  responseTarget?: Player // 需要响应的目标玩家
  responseCard?: string // 需要响应的卡牌名称
  responseHasCard?: boolean // 目标是否有响应卡牌
}

/**
 * 日志记录器接口
 */
export interface GameLogger {
  info: (message: string) => void
  success: (message: string) => void
  warning: (message: string) => void
  error: (message: string) => void
  card: (message: string) => void
  skill: (message: string) => void
  damage: (message: string) => void
  recover: (message: string) => void
}

/**
 * 游戏类接口
 */
export interface Game {
  state: GameState
  players: Player[]
  init: () => void
  start: () => void
  nextPhase: () => void
  nextTurn: () => void
  useCard: (player: Player, card: Card, targets?: Player[]) => void
  drawCard: (player: Player, count: number) => void
  discardCard: (player: Player, cards: Card[]) => void
  checkGameOver: () => boolean
  endPlayPhase: () => void
  createPlayersWithCharacters: (characters: any[]) => void
  dealInitialCards: () => void
  initializeDeck: () => void
  setLogger: (logger: GameLogger) => void
}