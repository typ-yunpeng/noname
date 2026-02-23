import type { Character, Skill, Identity } from '@/types'
import { executeSkillEffect } from '@/core/skillEffects'

/**
 * 标准武将数据
 * 包括：魏、蜀、吴、群雄势力的经典武将
 */

// 技能定义
const skills: Record<string, Skill> = {
  // 刘备技能
  renwang: {
    id: 'renwang',
    name: '仁望',
    description: '出牌阶段限一次，你可以将一张手牌交给一名其他角色。当你以此法给出第二张牌时，你可以令一名角色摸两张牌。',
    trigger: [],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.renwang, player, game)
  },

  // 曹操技能
  jianxiong: {
    id: 'jianxiong',
    name: '奸雄',
    description: '当你受到伤害后，你可以获得伤害来源的一张牌。',
    trigger: ['damage'],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.jianxiong, player, game)
  },

  // 孙权技能
  zhiheng: {
    id: 'zhiheng',
    name: '制衡',
    description: '出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌。',
    trigger: [],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.zhiheng, player, game)
  },

  // 关羽技能
  wusheng: {
    id: 'wusheng',
    name: '武圣',
    description: '你可以将一张红色牌当【杀】使用或打出。',
    trigger: ['useCard'],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.wusheng, player, game)
  },

  // 张飞技能
  paoxiao: {
    id: 'paoxiao',
    name: '咆哮',
    description: '锁定技，你使用【杀】无次数限制。',
    trigger: [],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.paoxiao, player, game)
  },

  // 赵云技能
  longdan: {
    id: 'longdan',
    name: '龙胆',
    description: '你可以将【杀】当【闪】使用或打出，或将【闪】当【杀】使用或打出。',
    trigger: [],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.longdan, player, game)
  },

  // 马超技能
  tieqi: {
    id: 'tieqi',
    name: '铁骑',
    description: '当你使用【杀】指定一名角色为目标后，你可以进行判定：若结果为红色，此【杀】不可被【闪】响应。',
    trigger: ['useCard'],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.tieqi, player, game)
  },

  // 黄月英技能
  jizhi: {
    id: 'jizhi',
    name: '集智',
    description: '当你使用非延时类锦囊牌时，你可以展示牌堆顶的一张牌。若此牌为基本牌或锦囊牌，你可以将此牌收入手牌。',
    trigger: ['useCard'],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.jizhi, player, game)
  },

  // 诸葛亮技能
  guanxing: {
    id: 'guanxing',
    name: '观星',
    description: '准备阶段，你可以观看牌堆顶的五张牌，然后将这些牌以任意顺序放回牌堆顶或牌堆底。',
    trigger: ['phaseBegin'],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.guanxing, player, game)
  },

  // 周瑜技能
  yingzi: {
    id: 'yingzi',
    name: '英姿',
    description: '摸牌阶段，你可以多摸一张牌。',
    trigger: ['draw'],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.yingzi, player, game)
  },

  // 吕蒙技能
  keji: {
    id: 'keji',
    name: '克己',
    description: '若你未于出牌阶段内使用或打出过【杀】，你可以跳过弃牌阶段。',
    trigger: [],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.keji, player, game)
  },

  // 陆逊技能
  lianying: {
    id: 'lianying',
    name: '连营',
    description: '当你失去手牌后，若你没有手牌，你可以摸一张牌。',
    trigger: [],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.lianying, player, game)
  },

  // 孙尚香技能
  jieyin: {
    id: 'jieyin',
    name: '结姻',
    description: '出牌阶段限一次，你可以弃置两张手牌，然后令一名其他角色回复1点体力。',
    trigger: [],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.jieyin, player, game)
  },

  // 甘宁技能
  qixi: {
    id: 'qixi',
    name: '奇袭',
    description: '你可以将一张黑色牌当【过河拆桥】使用。',
    trigger: [],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.qixi, player, game)
  },

  // 吕布技能
  wushuang: {
    id: 'wushuang',
    name: '无双',
    description: '锁定技，你使用【杀】时，目标角色需使用两张【闪】才能抵消；与你进行【决斗】的角色每次需打出两张【杀】。',
    trigger: [],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.wushuang, player, game)
  },

  // 貂蝉技能
  lihun: {
    id: 'lihun',
    name: '离间',
    description: '出牌阶段限一次，你可以弃置一张手牌并选择两名男性角色，令其中一名角色对另一名角色使用一张【杀】，否则该角色受到你造成的1点伤害。',
    trigger: [],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.lihun, player, game)
  },

  // 华佗技能
  chuli: {
    id: 'chuli',
    name: '除疠',
    description: '出牌阶段限一次，你可以选择一名其他角色，弃置其区域内的一张牌。',
    trigger: [],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.chuli, player, game)
  },

  // 司马懿技能
  fanhui: {
    id: 'fanhui',
    name: '反馈',
    description: '当你受到伤害后，你可以获得伤害来源的一张牌。',
    trigger: ['damage'],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.fanhui, player, game)
  },

  // 夏侯惇技能
  ganglie: {
    id: 'ganglie',
    name: '刚烈',
    description: '当你受到伤害后，你可以进行判定：若结果不为红色，你选择一名其他角色，令其受到1点伤害。',
    trigger: ['damage'],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.ganglie, player, game)
  },

  // 张辽技能
  tuxi: {
    id: 'tuxi',
    name: '突袭',
    description: '摸牌阶段，你可以放弃摸牌，改为获得最多两名其他角色的各一张手牌。',
    trigger: ['draw'],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.tuxi, player, game)
  },

  // 许褚技能
  luoyi: {
    id: 'luoyi',
    name: '裸衣',
    description: '摸牌阶段，你可以少摸一张牌，然后本回合你使用【杀】或【决斗】造成的伤害+1。',
    trigger: ['draw'],
    active: true,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.luoyi, player, game)
  },

  // 郭嘉技能
  tiandu: {
    id: 'tiandu',
    name: '天妒',
    description: '当你的判定牌生效后，你可以获得此牌。',
    trigger: ['judge'],
    active: false,
    limited: false,
    execute: (player: any, game: any) => executeSkillEffect(skills.tiandu, player, game)
  }
}

// 标准武将数据
export const standardCharacters: Omit<Character, 'id'>[] = [
  // 蜀势力
  {
    name: '刘备',
    identity: 'zhu' as Identity,
    hp: 4,
    maxHp: 4,
    skills: [skills.renwang],
    avatar: '/image/character/liubei.jpg'
  },
  {
    name: '关羽',
    identity: 'zhong' as Identity,
    faction: 'shu' as any,
    hp: 4,
    maxHp: 4,
    skills: [skills.wusheng],
    avatar: '/image/character/guanyu.jpg'
  },
  {
    name: '张飞',
    identity: 'fan' as Identity,
    hp: 4,
    maxHp: 4,
    skills: [skills.paoxiao],
    avatar: '/image/character/zhangfei.jpg'
  },
  {
    name: '赵云',
    identity: 'fan' as Identity,
    hp: 4,
    maxHp: 4,
    skills: [skills.longdan],
    avatar: '/image/character/zhaoyun.jpg'
  },
  {
    name: '马超',
    identity: 'nei' as Identity,
    hp: 4,
    maxHp: 4,
    skills: [skills.tieqi],
    avatar: '/image/character/machao.jpg'
  },
  {
    name: '黄月英',
    identity: 'zhong' as Identity,
    hp: 3,
    maxHp: 3,
    skills: [skills.jizhi],
    avatar: '/image/character/huangyueying.jpg'
  },
  {
    name: '诸葛亮',
    identity: 'zhong' as Identity,
    hp: 3,
    maxHp: 3,
    skills: [skills.guanxing],
    avatar: '/image/character/zhugeliang.jpg'
  },

  // 魏势力
  {
    name: '曹操',
    identity: 'zhu' as Identity,
    faction: 'wei' as any,
    hp: 4,
    maxHp: 4,
    skills: [skills.jianxiong],
    avatar: '/image/character/caocao.jpg'
  },
  {
    name: '司马懿',
    identity: 'zhong' as Identity,
    hp: 3,
    maxHp: 3,
    skills: [skills.fanhui],
    avatar: '/image/character/simayi.jpg'
  },
  {
    name: '夏侯惇',
    identity: 'fan' as Identity,
    faction: 'wei' as any,
    hp: 4,
    maxHp: 4,
    skills: [skills.ganglie],
    avatar: '/image/character/xiahoudun.jpg'
  },
  {
    name: '张辽',
    identity: 'fan' as Identity,
    faction: 'wei' as any,
    hp: 4,
    maxHp: 4,
    skills: [skills.tuxi],
    avatar: '/image/character/zhangliao.jpg'
  },
  {
    name: '许褚',
    identity: 'fan' as Identity,
    hp: 4,
    maxHp: 4,
    skills: [skills.luoyi],
    avatar: '/image/character/xuchu.jpeg'
  },
  {
    name: '郭嘉',
    identity: 'nei' as Identity,
    hp: 3,
    maxHp: 3,
    skills: [skills.tiandu],
    avatar: '/image/character/guojia.jpg'
  },

  // 吴势力
  {
    name: '孙权',
    identity: 'zhu' as Identity,
    hp: 4,
    maxHp: 4,
    skills: [skills.zhiheng],
    avatar: '/image/character/sunquan.jpg'
  },
  {
    name: '周瑜',
    identity: 'zhong' as Identity,
    faction: 'wu' as any,
    hp: 3,
    maxHp: 3,
    skills: [skills.yingzi],
    avatar: '/image/character/zhouyu.jpg'
  },
  {
    name: '吕蒙',
    identity: 'fan' as Identity,
    hp: 4,
    maxHp: 4,
    skills: [skills.keji],
    avatar: '/image/character/lvmeng.jpg'
  },
  {
    name: '陆逊',
    identity: 'fan' as Identity,
    faction: 'wu' as any,
    hp: 3,
    maxHp: 3,
    skills: [skills.lianying],
    avatar: '/image/character/luxun.jpg'
  },
  {
    name: '孙尚香',
    identity: 'nei' as Identity,
    hp: 3,
    maxHp: 3,
    skills: [skills.jieyin],
    avatar: '/image/character/sunshangxiang.jpg'
  },
  {
    name: '甘宁',
    identity: 'fan' as Identity,
    faction: 'wu' as any,
    hp: 4,
    maxHp: 4,
    skills: [skills.qixi],
    avatar: '/image/character/ganning.jpg'
  },

  // 群雄势力
  {
    name: '吕布',
    identity: 'zhu' as Identity,
    hp: 5,
    maxHp: 5,
    skills: [skills.wushuang],
    avatar: '/image/character/lvbu.jpg'
  },
  {
    name: '貂蝉',
    identity: 'nei' as Identity,
    hp: 3,
    maxHp: 3,
    skills: [skills.lihun],
    avatar: '/image/character/diaochan.jpg'
  },
  {
    name: '华佗',
    identity: 'zhong' as Identity,
    faction: 'qun' as any,
    hp: 3,
    maxHp: 3,
    skills: [skills.chuli],
    avatar: '/image/character/huatuo.jpg'
  }
]