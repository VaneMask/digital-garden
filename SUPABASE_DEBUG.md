# Supabase 权限配置说明

## 当前问题
遇到 401 错误，说明数据库表的访问权限配置有问题。

## 解决方案

### 方案 A：禁用 RLS（快速测试）
在 Supabase SQL Editor 中执行：

```sql
-- 临时禁用行级安全，用于测试
alter table todos disable row level security;
alter table inspirations disable row level security;
```

### 方案 B：正确配置 RLS 策略
如果方案 A 不生效，删除现有策略并重新创建：

```sql
-- 删除现有策略
drop policy if exists "允许所有人访问 todos" on todos;
drop policy if exists "允许所有人访问 inspirations" on inspirations;

-- 禁用 RLS
alter table todos disable row level security;
alter table inspirations disable row level security;
```

### 方案 C：检查 API 设置
1. 打开 https://supabase.com/dashboard/project/fqtljgqyjvresonccnak/settings/api
2. 确认 "API URL" 和 "anon public key" 是否正确
3. 检查 "API Settings" 中是否启用了 "Auto API documentation"

## 测试步骤
执行 SQL 后：
1. 清除浏览器缓存（Ctrl + Shift + Delete）
2. 强制刷新页面（Ctrl + Shift + R）
3. 在浏览器添加待办事项
4. 打开 Supabase Dashboard → Table Editor → todos 表
5. 查看是否有新数据

## 下一步
如果仍然不行，需要检查：
- Supabase 项目是否处于活跃状态
- API key 是否有过期
- 网络请求是否被拦截
