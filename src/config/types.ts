export interface ProjectFrontmatter {
  title: string
  description: string
  summary?: string
  coverImage?: string
  techTags: string[]
  githubUrl?: string
  demoUrl?: string
  featured: boolean
  date: Date
}

export interface ToolFrontmatter {
  name: string
  description: string
  icon?: string
  url: string
  category: 'dev' | 'ai' | 'productivity' | 'design' | 'browser'
  featured: boolean
}

export interface PostFrontmatter {
  title: string
  description: string
  date: Date
  tags: string[]
  categories: string[]
  draft: boolean
  coverImage?: string
}

export interface PhotoFrontmatter {
  image: string
  thumbnail?: string
  alt: string
  description?: string
  date: Date
  camera?: string
  lens?: string
  iso?: number
  aperture?: string
  shutter?: string
  location?: string
}

export interface MomentFrontmatter {
  content: string
  images?: string[]
  tags?: string[]
  date: Date
  location?: string
}
