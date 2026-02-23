import type { Game, GameState, Player, Card, Phase, Identity, GameLogger } from '@/types'
import { PlayerEntity } from './player'
import { DeckManager } from './deck'
import { standardCharacters } from '@/data/characters/standard'
import { executeCardEffect } from './cardEffects'

/**
 * 游戏主类
 * 负责游戏流程控制、回合管理、胜负判定
 */
export class GameEngine implements Game {
  state: GameState
  players: Player[]

  private deck: DeckManager = new DeckManager()
  private logger: GameLogger | null = null

  constructor() {
    this.state = {
      players: [],
      currentPlayerIndex: 0,
      phase: 'prepare',
      roundNumber: 0,
      isGameOver: false,
      waitingForPlayer: false,
      waitingForResponse: false,
      responseTarget: undefined,
      responseCard: undefined
    }
    this.players = []
  }

  /**
   * 设置日志记录器
   */
  setLogger(logger: GameLogger): void {
    this.logger = logger
  }

  /**
   * 记录日志（内部方法）
   */
  private log(type: 'info' | 'success' | 'warning' | 'error' | 'card' | 'skill' | 'damage' | 'recover', message: string): void {
    if (this.logger) {
      this.logger[type](message)
    }
  }

  /**
   * 初始化游戏
   */
  init(): void {
    console.log('游戏初始化...')
    
    // 初始化牌堆
    this.deck.initialize()
    
    // 创建玩家（使用默认随机武将）
    this.createPlayers()
    
    // 分配初始手牌
    this.dealInitialCards()
  }

  /**
   * 初始化牌堆
   */
  initializeDeck(): void {
    console.log('初始化牌堆...')
    this.deck.initialize()
  }

  /**
   * 创建玩家
   */
  private createPlayers(): void {
    // 随机选择5个武将
    const shuffledCharacters = [...standardCharacters].sort(() => Math.random() - 0.5)
    const selectedCharacters = shuffledCharacters.slice(0, 5)

    this.createPlayersWithCharacters(selectedCharacters)
  }

  /**
   * 使用指定的武将创建玩家（2v2模式）
   */
  createPlayersWithCharacters(characters: any[]): void {
    // 2v2模式：1号和3号为队友（蓝队），2号和4号为敌人（红队）
    // 1号：主公，3号：忠臣（蓝队队友）
    // 2号：反贼，4号：反贼（红队敌人）
    const identities: Identity[] = ['zhu', 'fan', 'zhong', 'fan']
    
    // 创建玩家
    this.players = characters.map((char, index) => {
      const character = {
        ...char,
        id: `char_${index}`,
        identity: identities[index] // 使用固定身份
      }
      const player = new PlayerEntity(`player_${index}`, character, character.identity, this.logger || undefined)
      return player
    })

    this.state.players = this.players
    console.log(`创建了 ${this.players.length} 个玩家（2v2模式）`)
    this.players.forEach((player, index) => {
      const position = index + 1
      const team = (index === 0 || index === 2) ? '蓝队' : '红队'
      console.log(`  ${position}号位置 - ${player.character.name} (${this.getIdentityText(player.identity)}) - ${team}`)
    })
  }

  /**
   * 获取身份文本
   */
  private getIdentityText(identity: Identity): string {
    const identityMap: Record<Identity, string> = {
      zhu: '主公',
      zhong: '忠臣',
      fan: '反贼',
      nei: '内奸'
    }
    return identityMap[identity] || identity
  }

  /**
   * 分配初始手牌
   */
  dealInitialCards(): void {
    console.log('分配初始手牌...')
    
    this.players.forEach(player => {
      // 每个玩家摸4张牌
      const cards = this.deck.draw(4)
      player.handCards.push(...cards)
      console.log(`  ${player.character.name} 摸了 ${cards.length} 张牌`)
    })
  }

  /**
   * 开始游戏
   */
  start(): void {
    console.log('游戏开始！')
    this.log('success', '游戏开始！')
    this.state.isGameOver = false
    this.state.roundNumber = 1
    this.state.currentPlayerIndex = 0
    this.state.phase = 'prepare'
    
    // 开始第一个回合
    this.startTurn()
  }

  /**
   * 开始回合
   */
  private startTurn(): void {
    const currentPlayer = this.players[this.state.currentPlayerIndex]
    currentPlayer.isTurn = true
    currentPlayer.shaCount = 0 // 重置杀的使用次数
    this.state.phase = 'prepare'
    
    console.log(`第${this.state.roundNumber}回合，${currentPlayer.character.name}的回合`)
    this.log('info', `第${this.state.roundNumber}回合，${currentPlayer.character.name}的回合`)
    
    // 进入准备阶段
    this.nextPhase()
  }

  /**
   * 进入下一阶段
   */
  nextPhase(): void {
    const phases: Phase[] = ['prepare', 'judge', 'draw', 'play', 'discard', 'finish']
    const currentIndex = phases.indexOf(this.state.phase)
    
    if (currentIndex < phases.length - 1) {
      this.state.phase = phases[currentIndex + 1]
      this.handlePhase(this.state.phase)
    } else {
      // 回合结束，进入下一回合
      this.nextTurn()
    }
  }

  /**
   * 处理当前阶段
   */
  private handlePhase(phase: Phase): void {
    const currentPlayer = this.players[this.state.currentPlayerIndex]
    
    switch (phase) {
      case 'prepare':
        console.log('准备阶段')
        this.log('info', `${currentPlayer.character.name} 进入准备阶段`)
        // 准备阶段逻辑
        setTimeout(() => this.nextPhase(), 1000)
        break
        
      case 'judge':
        console.log('判定阶段')
        this.log('info', `${currentPlayer.character.name} 进入判定阶段`)
        this.handleJudgePhase(currentPlayer)
        setTimeout(() => this.nextPhase(), 1000)
        break
        
      case 'draw':
        console.log('摸牌阶段')
        this.log('info', `${currentPlayer.character.name} 进入摸牌阶段`)
        
        // 检查是否有英姿技能（周瑜）
        const yingziSkill = currentPlayer.character.skills.find(skill => skill.id === 'yingzi')
        const drawCount = yingziSkill ? 3 : 2
        
        this.drawCard(currentPlayer, drawCount)
        
        // 如果有英姿技能，记录技能触发
        if (yingziSkill) {
          console.log(`${currentPlayer.character.name} 发动英姿，多摸1张牌`)
          this.log('skill', `${currentPlayer.character.name} 发动英姿，多摸1张牌`)
        }
        
        setTimeout(() => this.nextPhase(), 1000)
        break
        
      case 'play':
        console.log('出牌阶段')
        this.log('info', `${currentPlayer.character.name} 进入出牌阶段`)
        // 出牌阶段逻辑（等待玩家操作）
        this.state.waitingForPlayer = true
        // 不自动进入下一阶段，等待玩家操作
        break
        
      case 'discard':
        console.log('弃牌阶段')
        this.log('info', `${currentPlayer.character.name} 进入弃牌阶段`)
        this.handleDiscardPhase(currentPlayer)
        setTimeout(() => this.nextPhase(), 1000)
        break
        
      case 'finish':
        console.log('结束阶段')
        this.log('info', `${currentPlayer.character.name} 进入结束阶段`)
        // 结束阶段逻辑
        setTimeout(() => this.nextPhase(), 1000)
        break
    }
  }
  
  /**
   * 结束出牌阶段
   */
  endPlayPhase(): void {
    if (this.state.phase === 'play') {
      this.state.waitingForPlayer = false
      this.nextPhase()
    }
  }

  /**
   * 进入下一回合
   */
  nextTurn(): void {
    // 结束当前回合
    const currentPlayer = this.players[this.state.currentPlayerIndex]
    currentPlayer.isTurn = false
    
    // 检查游戏是否结束
    if (this.checkGameOver()) {
      return
    }
    
    // 找到下一个存活的玩家
    do {
      this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.players.length
    } while (this.players[this.state.currentPlayerIndex].status === 'dead')
    
    // 如果回到第一个玩家，回合数+1
    if (this.state.currentPlayerIndex === 0) {
      this.state.roundNumber++
    }
    
    // 开始新回合
    this.startTurn()
  }

  /**
   * 使用卡牌
   */
  async useCard(player: Player, card: Card, targets?: Player[]): Promise<void> {
    console.log(`${player.character.name} 使用了 ${card.name}`)
    
    // 记录日志
    if (targets && targets.length > 0) {
      const targetNames = targets.map(t => t.character.name).join('、')
      this.log('card', `${player.character.name} 对 ${targetNames} 使用了【${card.name}】`)
    } else {
      this.log('card', `${player.character.name} 使用了【${card.name}】`)
    }
    
    // 从手牌中移除
    const index = player.handCards.findIndex(c => c.id === card.id)
    if (index !== -1) {
      player.handCards.splice(index, 1)
    }
    
    // 将卡牌放入弃牌堆
    this.deck.discard([card])
    
    // 如果是杀，增加使用次数
    if (card.name === '杀') {
      player.shaCount++
      console.log(`${player.character.name} 本回合已使用 ${player.shaCount} 张杀`)
    }
    
    // 执行卡牌效果
    const targetPlayers = targets || []
    await executeCardEffect(card, player, targetPlayers, this)
    
    // 检查游戏是否结束
    this.checkGameOver()
  }

  /**
   * 摸牌
   */
  drawCard(player: Player, count: number): void {
    console.log(`${player.character.name} 摸了 ${count} 张牌`)
    
    const cards = this.deck.draw(count)
    player.handCards.push(...cards)
    console.log(`  实际摸到 ${cards.length} 张牌，当前手牌数: ${player.handCards.length}`)
    
    // 记录日志，显示具体摸到的牌
    const cardNames = cards.map(c => c.name).join('、')
    this.log('info', `${player.character.name} 摸了 ${cards.length} 张牌：【${cardNames}】`)
  }

  /**
   * 弃牌
   */
  discardCard(player: Player, cards: Card[]): void {
    console.log(`${player.character.name} 弃掉了 ${cards.length} 张牌`)
    
    const cardNames = cards.map(c => c.name).join('、')
    this.log('warning', `${player.character.name} 弃掉了【${cardNames}】`)
    
    cards.forEach(card => {
      const index = player.handCards.findIndex(c => c.id === card.id)
      if (index !== -1) {
        player.handCards.splice(index, 1)
      }
    })
    
    // 将弃掉的牌放入弃牌堆
    this.deck.discard(cards)
  }

  /**
   * 洗弃牌堆（已废弃，由DeckManager处理）
   */
  private shuffleDiscardPile(): void {
    console.log('洗牌...')
    // DeckManager会自动处理洗牌逻辑
  }

  /**
   * 检查游戏是否结束（2v2模式）
   */
  checkGameOver(): boolean {
    const alivePlayers = this.players.filter(p => p.status === 'alive')
    
    if (alivePlayers.length === 0) {
      this.state.isGameOver = true
      return true
    }
    
    // 2v2模式：蓝队（1号和3号）vs 红队（2号和4号）
    const blueTeamAlive = alivePlayers.filter(p => p.id === 'player_0' || p.id === 'player_2')
    const redTeamAlive = alivePlayers.filter(p => p.id === 'player_1' || p.id === 'player_3')
    
    // 如果蓝队全部死亡，红队获胜
    if (blueTeamAlive.length === 0) {
      this.state.isGameOver = true
      this.state.winner = 'fan' // 使用fan代表红队
      console.log('蓝队全部阵亡，红队获胜！')
      this.log('success', '蓝队全部阵亡，红队获胜！')
      return true
    }
    
    // 如果红队全部死亡，蓝队获胜
    if (redTeamAlive.length === 0) {
      this.state.isGameOver = true
      this.state.winner = 'zhu' // 使用zhu代表蓝队
      console.log('红队全部阵亡，蓝队获胜！')
      this.log('success', '红队全部阵亡，蓝队获胜！')
      return true
    }
    
    return false
  }
  
  /**
   * 处理判定阶段
   */
  private handleJudgePhase(player: Player): void {
    console.log(`${player.character.name} 进入判定阶段`)
    
    // 检查玩家是否有需要判定的技能
    const judgeSkills = player.character.skills.filter(skill =>
      skill.trigger.includes('judge')
    )
    
    if (judgeSkills.length > 0) {
      console.log(`${player.character.name} 有判定技能需要触发`)
      this.log('skill', `${player.character.name} 有判定技能需要触发`)
      judgeSkills.forEach(skill => {
        console.log(`触发判定技能: ${skill.name}`)
        this.log('skill', `触发判定技能: ${skill.name}`)
        try {
          skill.execute(player, this)
        } catch (error) {
          console.error(`判定技能执行失败: ${skill.name}`, error)
        }
      })
    } else {
      console.log(`${player.character.name} 没有需要判定的技能`)
    }
  }
  
  /**
   * 处理弃牌阶段
   */
  private handleDiscardPhase(player: Player): void {
    console.log(`${player.character.name} 进入弃牌阶段`)
    
    // 检查是否需要弃牌
    const handCardCount = player.handCards.length
    const maxHandCards = player.hp
    
    if (handCardCount > maxHandCards) {
      const discardCount = handCardCount - maxHandCards
      console.log(`${player.character.name} 需要弃掉 ${discardCount} 张牌`)
      
      // 自动弃牌（简化处理：随机弃牌）
      const cardsToDiscard: Card[] = []
      for (let i = 0; i < discardCount; i++) {
        if (player.handCards.length > 0) {
          const randomIndex = Math.floor(Math.random() * player.handCards.length)
          const card = player.handCards.splice(randomIndex, 1)[0]
          cardsToDiscard.push(card)
        }
      }
      
      // 将弃掉的牌放入弃牌堆
      this.deck.discard(cardsToDiscard)
      
      const cardNames = cardsToDiscard.map(c => c.name).join('、')
      console.log(`${player.character.name} 弃掉了 ${cardNames}`)
      this.log('warning', `${player.character.name} 弃掉了【${cardNames}】`)
      
      // 检查连营技能（陆逊）
      if (player.handCards.length === 0) {
        const lianyingSkill = player.character.skills.find(skill => skill.id === 'lianying')
        if (lianyingSkill) {
          console.log(`${player.character.name} 触发连营技能`)
          this.log('skill', `${player.character.name} 触发连营技能`)
          try {
            lianyingSkill.execute(player, this)
          } catch (error) {
            console.error('连营技能执行失败', error)
          }
        }
      }
    } else {
      console.log(`${player.character.name} 不需要弃牌`)
    }
  }
}