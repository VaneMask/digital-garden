# 检查 Supabase 数据

请在 Supabase SQL Editor 中执行以下查询：

```sql
-- 查看 todos 表的所有数据和设备ID
select id, text, done, device_id, created_at 
from todos 
order by created_at desc;

-- 查看有多少个不同的设备ID
select device_id, count(*) as count
from todos
group by device_id;
```

这样可以看到：
1. 每条数据对应的设备ID
2. 有多少个不同的设备在使用

## 问题分析

当前的实现中，每个浏览器都有独立的 device_id，所以：
- 电脑浏览器有自己的 device_id
- 手机浏览器有另一个 device_id
- 它们只能看到自己设备的数据

## 解决方案

有两个选择：

### 方案1：所有设备共享数据（推荐）
修改代码，不使用 device_id 过滤，所有设备看到所有数据。

### 方案2：添加用户登录
实现真正的用户系统，用 user_id 代替 device_id。

您想用哪个方案？
