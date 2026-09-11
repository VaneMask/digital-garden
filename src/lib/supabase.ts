import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fqtljgqyjvresonccnak.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdGxqZ3F5anZyZXNvbmNjbmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1ODQ4MjYsImV4cCI6MjA1MjE2MDgyNn0.invKRsCmbuh7Tkh-tMVQlg_h9_I5yW7'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 获取或生成设备唯一ID
export function getDeviceId(): string {
  const key = 'device-id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(key, id)
  }
  return id
}
