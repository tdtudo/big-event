# Big Event 内容管理后台

基于 Vue 3 全家桶的文章管理后台，覆盖登录鉴权、文章与分类的增删改查、富文本编辑、封面上传和个人信息维护。

> 说明：本项目按「黑马程序员 Vue3 实战 —— Big Event」课程功能实现，后端使用课程提供的公共接口服务。课程之外我自己完成的部分和已知可改进点，见文末两节。

## 技术栈

Vue 3（Composition API + `<script setup>`）、Vite、Vue Router、Pinia（+ 状态持久化）、Element Plus、Axios、Vue Quill 富文本、SCSS。

## 功能模块

- **登录鉴权**：登录 / 注册，token 持久化到 Pinia，全局前置守卫拦截未登录访问。
- **文章管理**：分页列表、按分类筛选、条件重置；新增与编辑共用一个抽屉表单（富文本正文 + 封面图上传）；发布 / 存草稿两种状态；删除带二次确认并自动刷新列表。
- **分类管理**：分类列表、新增 / 编辑弹窗、名称与别名的表单校验、删除后同步刷新文章筛选。
- **个人中心**：基本信息修改、密码修改、头像上传（本地图片经 FileReader 转 base64 提交）。
- **请求层**：统一 axios 实例 + 请求 / 响应拦截器，自动注入 `Authorization`，按业务 code 统一提示，401 自动跳回登录页。

## 快速开始

环境要求：Node `^22.18.0 || >=24.12.0`，包管理器 pnpm。

```sh
pnpm install
pnpm dev        # 开发，默认 http://localhost:5173
pnpm build      # 生产构建，产物在 dist/
pnpm preview    # 本地预览构建产物
```

### 体验方式

后端是课程方提供的公开接口服务，**任何人都能在登录页直接注册一个新账号**，注册后即可完成登录、发文、改分类、换头像的完整流程，不需要任何现成账号。

## 接口地址与跨域处理

开发环境不做任何写死域名，走 Vite 代理：

- `src/utils/request.js`：`baseURL = '/api'`
- `vite.config.js`：`server.proxy['/api']` 转发到 `https://big-event-vue-api-t.itheima.net`，`changeOrigin: true`，`rewrite` 去掉 `/api` 前缀。

`/api` 只是给代理的识别标记，不属于后端真实路径。

**构建产物里没有 Vite dev server，代理随之消失**，所以上线时二选一：

1. 在部署层补一份等价转发（Nginx `location /api/ { proxy_pass ...; }`），前端代码一行都不用改——推荐，也是生产环境的常规做法。
2. 把 `src/utils/request.js` 里的 `baseURL` 换成绝对域名（该文件里已留了一行注释可直接切换），依赖后端返回 CORS 头。课程服务返回 `Access-Control-Allow-Origin: *`，纯静态托管可用；**必须用 `https`**，用 `http` 会被 301 重定向，而预检请求不允许重定向，浏览器会直接报跨域错误。

## 目录结构

```
src/
├── api/          按业务模块划分的请求函数，组件只调 service 不直接调 axios
├── assets/       样式与静态资源
├── components/   全局通用组件（PageContainer、PageCrumbs 等）
├── router/       路由表 + 前置守卫
├── stores/       Pinia：用户信息与 token，持久化插件
├── utils/        axios 实例与拦截器
└── views/        页面：login / layout / article / user
```

## 我在课程之外做的事

- 排查并修复了表单校验未接线的问题（`el-form` 缺 `ref`、提交前没 `await validate()`），使 `rules` 真正生效。
- 把散落的接口调用统一为「service 函数必须 `return`」的约定，避免 `await` 到 `undefined` 导致的时序竞态。
- 修正了请求参数放错位置的一类问题：axios 的 `get/delete` 第二参是 config，必须用 `{ params: { id } }` 才会拼进查询串，直接传值会被静默丢弃。
- 编辑文章时补齐了封面回显：后端返回的是地址字符串，需要同时喂给预览用的变量和表单字段。

## 已知可改进点

- 删除当前页最后一条数据后没有回退页码，会短暂停在空页；应判断「本页只剩一条且不是第一页」时 `pagenum--`。
- 列表请求的 `loading` 没有放进 `try/finally`，接口失败时表格会一直转圈。
- 编辑文章会把原封面重新下载、转成 File 再上传一次，服务器会多出重复文件；应只在用户重新选择图片时才传 File。
- `el-pagination` 上有一个无效的 `size` 属性（该 prop 只接受视觉尺寸），每页条数实际由 `page-size` 控制。
- 新增文章后跳转的页码依赖「新文章排在列表最后一条」这一后端排序假设，排序规则变化会失效。

## License

仅用于个人学习与技术演示。
