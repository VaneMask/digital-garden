import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fqtljgqyjvresonccnak.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdGxqZ3F5anZyZXNvbmNjbmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMTM0NzcsImV4cCI6MjEwNDY4OTQ3N30.zZjXVUApyh9B8Nor-DDuCZSHqxj4oadzIO-Spf8nWWY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 使用固定的用户ID，所有设备共享数据
export function getUserId(): string {
  return 'shared-user'
}
