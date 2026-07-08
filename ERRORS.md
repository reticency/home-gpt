# HomeGPT 错误清单

> 记录项目开发过程中遇到的所有错误，作为开发准则，**禁止重犯**。

---

## 一、AI 返回数据处理类错误

### 1.1 TypeError: x.map is not a function

**错误描述**：
- `tip.tips.map is not a function`
- `phase.focus.map is not a function`

**根因**：AI 返回的数据结构不符合预期，某个字段应该是数组但实际是对象、字符串或 undefined。

**解决方案**：
- 在 normalize 函数中对所有数组字段进行类型校验
- 使用 `Array.isArray()` 判断是否为数组
- 非数组时提供空数组作为默认值

**预防措施**：
```typescript
// 禁止直接调用 .map()，必须先校验
// ✅ 正确
const items = Array.isArray(data.items) ? data.items : [];
items.map(item => ...);

// ❌ 错误 - 禁止这样写
data.items.map(item => ...);
```

### 1.2 数字字段解析失败

**错误描述**：面积显示为"0平方米"，层高显示为"0米"，预算显示为"0元"

**根因**：AI 返回的数字可能是字符串格式（如"约90平方米"），直接判断 `typeof === 'number'` 会失败。

**解决方案**：
- 创建 `parseNumber()` 函数统一处理数字解析
- 从字符串中提取数字部分
- 提供默认值兜底

**预防措施**：
```typescript
// ✅ 正确
function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }
  return 0;
}

// ❌ 错误 - 禁止这样写
const area = typeof data.area === 'number' ? data.area : 0;
```

### 1.3 AI 返回英文内容

**错误描述**：采光分析、通风分析等内容返回英文

**根因**：prompt 中未明确要求使用中文，或 AI 模型自动切换语言。

**解决方案**：
- 在所有 prompt 中明确添加"请用中文"指令
- 强调"所有字段的值必须使用中文"

**预防措施**：
```typescript
// ✅ 正确
const prompt = `请用中文分析这张户型图...
所有字段的值必须使用中文`;

// ❌ 错误 - 禁止缺少中文要求
const prompt = `分析这张户型图...`;
```

### 1.4 数据字段为空或缺失

**错误描述**：窗户分布为空、装修决策无内容

**根因**：AI 返回的数据结构不完整，某些字段缺失或为空数组。

**解决方案**：
- 在 normalize 函数中为所有字段提供默认值
- 过滤掉无效数据（如空名称的对象）
- 添加数据完整性校验

**预防措施**：
```typescript
// ✅ 正确
windows: Array.isArray(d.lighting.windows) ? d.lighting.windows
  .map(w => ({ location: w?.location || '', ... }))
  .filter(w => w.location) : [],

// ❌ 错误 - 禁止直接传递可能为空的数据
windows: d.lighting.windows || [];
```

---

## 二、业务逻辑类错误

### 2.1 预算单位错误

**错误描述**：用户输入"10万元"，显示为"10元"

**根因**：未进行单位转换，用户输入的是"万元"但存储和显示时按"元"处理。

**解决方案**：
- 在存储预算时乘以 10000（万元转元）
- 在显示时除以 10000（元转万元）
- 统一使用"元"作为内部存储单位

**预防措施**：
```typescript
// ✅ 正确
budget: budget * 10000,  // 用户输入10 → 存储为100000元

// ❌ 错误 - 禁止直接存储用户输入值
budget: budget,  // 用户输入10 → 存储为10元
```

### 2.2 模拟数据回退

**错误描述**：AI 调用失败时使用模拟数据，导致报告内容不是真实 AI 结果

**根因**：代码中存在 try/catch 块，catch 时生成模拟数据。

**解决方案**：
- 移除所有模拟数据生成逻辑
- AI 调用失败时显示错误提示并返回上一步
- 确保报告内容始终来自真实 AI 调用

**预防措施**：
```typescript
// ✅ 正确
} catch (error) {
  console.error('Analysis error:', error);
  alert('分析失败，请稍后重试');
  router.push('/requirements');
}

// ❌ 错误 - 禁止使用模拟数据回退
} catch (error) {
  return generateMockData();  // 禁止！
}
```

---

## 三、技术配置类错误

### 3.1 Next.js Image 域名未配置

**错误描述**：
```
Error: Invalid src prop (...) on `next/image`, 
hostname "ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com" 
is not configured under images in your `next.config.js`
```

**根因**：即梦 API 返回的图片域名未添加到 Next.js 的 images.domains 配置中。

**解决方案**：
- 在 `next.config.js` 中配置允许的图片域名
- 包括所有可能的 CDN 域名

**预防措施**：
```typescript
// ✅ 正确
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com'],
  },
};

// ❌ 错误 - 禁止遗漏图片域名配置
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],  // 缺少即梦域名
  },
};
```

### 3.2 localStorage SSR 错误

**错误描述**：服务端渲染时调用 localStorage 报错

**根因**：在服务端环境中直接调用 localStorage，而 localStorage 仅在浏览器中可用。

**解决方案**：
- 在所有 localStorage 操作前检查 `typeof window !== 'undefined'`
- 使用 React Context 管理客户端状态

**预防措施**：
```typescript
// ✅ 正确
export const getStorageData = (): HomeGPTData => {
  if (typeof window === 'undefined') {
    return defaultData;
  }
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultData;
};

// ❌ 错误 - 禁止直接调用
export const getStorageData = (): HomeGPTData => {
  const data = localStorage.getItem(STORAGE_KEY);  // SSR 环境会报错
  return data ? JSON.parse(data) : defaultData;
};
```

### 3.3 API Key 泄露风险

**错误描述**：API Key 可能被提交到版本控制或暴露给前端

**根因**：`.env.local` 文件未加入 `.gitignore`，或在前端代码中直接使用 API Key。

**解决方案**：
- 将 `.env.local` 加入 `.gitignore`
- 所有 API 调用必须通过服务端 API 路由
- 创建 `.env.example` 作为配置模板

**预防措施**：
```
# ✅ 正确 - .gitignore 中包含
node_modules/
.next/
.env.local
.env
.env.*.local

# ❌ 错误 - 禁止将 API Key 写在前端代码中
const apiKey = 'sk-xxxxxxxx';  // 禁止！
```

---

## 四、开发流程类错误

### 4.1 未检查现有代码直接重写

**错误描述**：重复实现已有的工具函数或模式

**根因**：不了解代码库，重新造轮子。

**解决方案**：
- 修改前先搜索代码库，确认是否已有类似实现
- 优先复用现有代码

**预防措施**：
```
✅ 正确流程：
1. 使用 Grep/SearchCodebase 搜索相关代码
2. 确认是否已有实现
3. 复用或扩展现有代码

❌ 错误流程：
1. 直接写新代码
2. 发现重复代码后删除
```

### 4.2 盲目修改未理解的代码

**错误描述**：修改了不理解的代码，导致引入新问题

**根因**：在不理解代码逻辑的情况下进行修改。

**解决方案**：
- 修改前先追踪数据流向，理解代码逻辑
- 对复杂修改进行充分测试

**预防措施**：
```
✅ 正确流程：
1. 阅读相关代码，理解逻辑
2. 追踪数据从输入到输出的完整流程
3. 制定修改方案
4. 进行测试验证

❌ 错误流程：
1. 看到错误信息直接修改
2. 修改后未验证是否影响其他功能
```

---

## 五、代码质量类错误

### 5.1 使用 console.log 调试

**错误描述**：生产代码中遗留 console.log 语句

**根因**：调试后未清理 console.log。

**解决方案**：
- 使用 ESLint 规则禁止 console.log
- 使用 logger.ts 进行统一日志管理

**预防措施**：
```typescript
// ✅ 正确
logAIRequest('chat', 'DoubaoAPI', '/chat/completions', model, prompt);

// ❌ 错误 - 禁止使用 console.log
console.log('AI request:', prompt);
```

### 5.2 忽略 TypeScript 错误

**错误描述**：TypeScript 报错但仍继续开发

**根因**：认为类型错误不影响运行。

**解决方案**：
- 修复所有 TypeScript 错误后再提交
- 使用 `strict: true` 启用严格类型检查

**预防措施**：
```json
// ✅ 正确 - tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## 错误处理检查清单

每次修改代码前，检查以下项目：

- [ ] AI 返回的数据是否有类型校验和默认值？
- [ ] 数组字段是否使用 `Array.isArray()` 校验？
- [ ] 数字字段是否使用 `parseNumber()` 处理？
- [ ] 所有 prompt 是否明确要求中文？
- [ ] 是否存在模拟数据回退逻辑？
- [ ] localStorage 操作前是否检查 `typeof window`？
- [ ] 新的图片域名是否已配置到 `next.config.js`？
- [ ] API Key 是否安全存储在环境变量中？
- [ ] 是否复用了现有代码而非重复实现？
- [ ] TypeScript 错误是否全部修复？

---

*本文件记录项目开发过程中遇到的所有错误及解决方案，**禁止重犯**。*
