/**
 * 武将头像占位符生成器
 * 为武将生成SVG格式的占位符头像
 */

export function generateCharacterAvatar(name: string, identity: string): string {
  const colors: Record<string, { bg: string; text: string }> = {
    zhu: { bg: '#ffd700', text: '#333333' },
    zhong: { bg: '#4CAF50', text: '#ffffff' },
    fan: { bg: '#f44336', text: '#ffffff' },
    nei: { bg: '#9c27b0', text: '#ffffff' }
  }

  const color = colors[identity] || colors.fan
  const firstChar = name.charAt(0)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(color.bg, -30)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#grad-${name})" stroke="${color.text}" stroke-width="5"/>
      <text x="100" y="100" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
            fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
        ${firstChar}
      </text>
      <text x="100" y="160" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
            fill="${color.text}" text-anchor="middle" opacity="0.8">
        ${name}
      </text>
    </svg>
  `

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * 调整颜色亮度
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const num = parseInt(hex, 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

/**
 * 获取武将头像URL
 * 如果有实际图片路径则返回实际路径，否则生成占位符
 */
export function getCharacterAvatar(avatar: string, name: string, identity: string): string {
  if (avatar && avatar.trim() !== '') {
    return avatar
  }
  return generateCharacterAvatar(name, identity)
}