export const SITE = {
  title: 'Digital Garden',
  name: 'VaneMask',
  url: 'https://vanemask.me',
  description: '生命中的全部偶然，其实都是命中注定。是为宿命。',
  locale: 'zh-CN',
  ogImage: '/images/og-default.webp',
} as const

export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/projects', label: '项目' },
  { href: '/tools', label: '工具' },
  { href: '/archive', label: '记录' },
  { href: '/photos', label: '照片墙' },
  { href: '/moments', label: '说说' },
  { href: '/about', label: '关于' },
] as const

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/VaneMask', icon: 'github' },
  { name: 'Email', url: 'mailto:hi@vanemask.me', icon: 'email' },
] as const

export const TOOL_CATEGORIES = [
  { key: 'dev', label: '开发工具', icon: 'code' },
  { key: 'ai', label: 'AI 工具', icon: 'sparkles' },
  { key: 'productivity', label: '效率工具', icon: 'zap' },
  { key: 'design', label: '设计工具', icon: 'palette' },
  { key: 'browser', label: '浏览器插件', icon: 'puzzle' },
] as const
