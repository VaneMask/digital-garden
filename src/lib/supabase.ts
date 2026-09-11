import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fqtljgqyjvresonccnak.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdGxqZ3F5anZyZXNvbmNjbmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMTM0NzcsImV4cCI6MjEwNDY4OTQ3N30.zZjXVUApyh9B8Nor-DDuCZSHqxj4oadzIO-Spf8nWWY'

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
