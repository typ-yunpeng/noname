import type { Card } from '@/types'
import { CardEntity } from './card'
import { allCards } from '@/data/cards/basic'

/**
 * 牌堆管理器
 * 负责管理牌堆、洗牌、摸牌、弃牌等操作
 */
export class DeckManager {
  private cardPile: Card[] = []
  private discardPile: Card[] = []
  private cardIdCounter = 0

  /**
   * 初始化牌堆
   */
  initialize(): void {
    this.cardPile = []
    this.discardPile = []
    this.cardIdCounter = 0

    // 创建所有卡牌
    allCards.forEach(cardData => {
      const card = new CardEntity(
        this.generateCardId(),
        cardData.name,
        cardData.suit,
        cardData.number,
        cardData.type,
        cardData.description,
        cardData.equipType
      )
      this.cardPile.push(card)
    })

    // 洗牌
    this.shuffle()

    console.log(`牌堆初始化完成，共 ${this.cardPile.length} 张牌`)
  }

  /**
   * 生成卡牌ID
   */
  private generateCardId(): string {
    return `card_${this.cardIdCounter++}`
  }

  /**
   * 洗牌
   */
  shuffle(): void {
    console.log('洗牌...')
    
    // Fisher-Yates 洗牌算法
    for (let i = this.cardPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cardPile[i], this.cardPile[j]] = [this.cardPile[j], this.cardPile[i]]
    }
  }

  /**
   * 摸牌
   */
  draw(count: number): Card[] {
    const cards: Card[] = []

    for (let i = 0; i < count; i++) {
      if (this.cardPile.length === 0) {
        // 牌堆空了，洗弃牌堆
        this.reshuffleDiscardPile()
      }

      if (this.cardPile.length > 0) {
        const card = this.cardPile.pop()!
        cards.push(card)
      }
    }

    return cards
  }

  /**
   * 弃牌
   */
  discard(cards: Card[]): void {
    cards.forEach(card => {
      this.discardPile.push(card)
    })
  }

  /**
   * 洗弃牌堆
   */
  private reshuffleDiscardPile(): void {
    console.log('洗弃牌堆...')
    
    if (this.discardPile.length === 0) {
      console.log('弃牌堆为空，无法洗牌')
      return
    }

    // 将弃牌堆移入牌堆
    this.cardPile = [...this.discardPile]
    this.discardPile = []

    // 洗牌
    this.shuffle()
  }

  /**
   * 获取牌堆剩余数量
   */
  getCardPileCount(): number {
    return this.cardPile.length
  }

  /**
   * 获取弃牌堆数量
   */
  getDiscardPileCount(): number {
    return this.discardPile.length
  }

  /**
   * 查看牌堆顶的牌（不取出）
   */
  peekTopCard(count: number = 1): Card[] {
    return this.cardPile.slice(0, count)
  }

  /**
   * 查看弃牌堆顶的牌（不取出）
   */
  peekDiscardTopCard(count: number = 1): Card[] {
    return this.discardPile.slice(0, count)
  }
}