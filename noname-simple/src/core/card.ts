import type { Card, Suit, CardType, EquipType } from '@/types'

/**
 * 卡牌类
 * 管理卡牌的属性和效果
 */
export class CardEntity implements Card {
  id: string
  name: string
  suit: Suit
  number: number
  type: CardType
  equipType?: EquipType
  description: string

  constructor(
    id: string,
    name: string,
    suit: Suit,
    number: number,
    type: CardType,
    description: string,
    equipType?: EquipType
  ) {
    this.id = id
    this.name = name
    this.suit = suit
    this.number = number
    this.type = type
    this.description = description
    this.equipType = equipType
  }

  /**
   * 获取卡牌颜色
   */
  getColor(): 'red' | 'black' {
    return this.suit === 'heart' || this.suit === 'diamond' ? 'red' : 'black'
  }

  /**
   * 获取卡牌花色符号
   */
  getSuitSymbol(): string {
    const symbols: Record<Suit, string> = {
      spade: '♠',
      heart: '♥',
      club: '♣',
      diamond: '♦'
    }
    return symbols[this.suit]
  }

  /**
   * 获取卡牌点数显示
   */
  getNumberDisplay(): string {
    if (this.number === 1) return 'A'
    if (this.number === 11) return 'J'
    if (this.number === 12) return 'Q'
    if (this.number === 13) return 'K'
    return this.number.toString()
  }

  /**
   * 是否为基本牌
   */
  isBasic(): boolean {
    return this.type === 'basic'
  }

  /**
   * 是否为锦囊牌
   */
  isTrick(): boolean {
    return this.type === 'trick'
  }

  /**
   * 是否为装备牌
   */
  isEquip(): boolean {
    return this.type === 'equip'
  }

  /**
   * 是否为武器
   */
  isWeapon(): boolean {
    return this.type === 'equip' && this.equipType === 'weapon'
  }

  /**
   * 是否为防具
   */
  isArmor(): boolean {
    return this.type === 'equip' && this.equipType === 'armor'
  }

  /**
   * 是否为坐骑
   */
  isHorse(): boolean {
    return (
      this.type === 'equip' &&
      (this.equipType === 'defendHorse' || this.equipType === 'offenseHorse')
    )
  }
}