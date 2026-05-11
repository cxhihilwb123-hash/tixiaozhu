# 题小助

题小助是一个面向学生练习、拍题批改、错题强化、会员付费和后台运营管理的完整业务项目。当前代码支持本地启动和测试模式，但项目定位按可生产化产品推进，不按纯展示 Demo 设计。

## 应用组成

- `frontend`: 学生端 React/Vite 应用，包含年级引导、首页、练习中心、拍题、错题、我的、会员与支付入口。
- `admin`: 运营后台 React/Vite 应用，包含仪表盘、用户、题包、AI 出题、知识点、学习记录、订单、支付流水、套餐和系统设置。
- `backend`: Node API 服务，承载用户、题库、练习、错题、会员、订单、支付会话、支付确认、退款和运营接口。
- 学生端账号已提供正式 API 闭环：`POST /api/auth/register`、`POST /api/auth/login`、`GET /api/auth/session`，会话使用 Bearer token 签名校验。

## 当前后台登录

后台现在需要先登录才能进入，默认测试账号为：

```text
账号：admin
密码：admin123
```

后端关键管理写接口也会校验管理员 token，不再是“打开后台地址直接改数据”的裸奔状态。

## 本地启动

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
npm --prefix admin run dev
```

默认接口地址：

```text
http://127.0.0.1:8787/api
```

如需改接口地址，可在前端或后台启动时设置：

```bash
VITE_API_BASE=http://127.0.0.1:8787/api npm --prefix frontend run dev
VITE_API_BASE=http://127.0.0.1:8787/api npm --prefix admin run dev
```

后端现在会把运行期写操作持久化到本地文件：

```text
backend/data/store.json
```

这意味着题包解锁、积分流水、练习记录、错题状态、拍题沉淀、后台设置、题包调题与版本记录在服务重启后不会丢失。

## 验证

```bash
npm run build
npm run check:api
npm --prefix backend run audit:question-bank
npm --prefix backend run audit:product-readiness
npm --prefix backend run audit:commercial-launch
npm --prefix backend run store:export -- backend/data/store-backup.json
npm --prefix backend run store:import -- backend/data/store-backup.json
npm --prefix backend run reset:store
```

## 生产环境配置

上线前按 `.env.production.example` 准备部署环境变量。真实密钥不要提交到仓库，只写入部署平台或服务器环境。

生产环境默认启用商业上线启动闸门：`TIXIAOZHU_ENV=production` 且审计未达到 `launch_ready` 时，后端会拒绝启动。仅隔离验证可临时设置 `ALLOW_BLOCKED_PRODUCTION_START=true`。

切换 PostgreSQL 前可先执行 `store:export` 备份当前数据，再在带 `TIXIAOZHU_DATA_LAYER=postgres` 和 `DATABASE_URL` 的环境执行 `store:import` 导入。

## 产品化要求

- 账号体系、权限、题库、练习记录、学科成绩、会员订单和支付模块都按正式业务对象设计。
- 测试阶段可以使用内存数据、测试支付和隐藏入口，但不能删除业务模块或把产品定义成“本地展示”。
- 支付模块至少包含支付配置、订单、支付会话、支付流水、支付确认、退款和会员生效链路。
- 生产接入时需要替换为持久化数据库、真实认证、真实 OCR/AI 服务、微信/支付宝支付网关、支付回调验签和文件上传存储。
- 当前已补充 `GET /api/product-readiness` 和 `audit:product-readiness`，用于检查用户、学习记录、错题、AI 出题、积分流水和内容购买是否仍混有旧 demo 脏数据。
- 当前已补充 `GET /api/commercial-launch-readiness` 和 `audit:commercial-launch`，用于按商业上线标准检查生产数据库、管理员安全、真实账号、真实支付、对象存储、监控和正式域名配置；当前内测状态会被正确判为 `blocked`，不能误判为可商业发布。
- 后端数据层支持 `TIXIAOZHU_DATA_LAYER=postgres`，配置 `DATABASE_URL` / `TIXIAOZHU_DATABASE_URL` 后会使用 PostgreSQL JSONB 快照保存业务主数据；未配置时仅用于本地开发文件存储。
- 后台登录支持 `ADMIN_USERNAME`、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET` 环境变量覆盖，登录失败会进入基础限流；CORS 已补充 `Authorization` 和 `X-Admin-Token` 头。
- 学生端登录支持 `STUDENT_SESSION_SECRET`，生产环境必须设置高强度随机字符串，不能依赖本地默认密钥。
- 学生端“我的”页已接入登录/注册入口，并会在应用启动时通过 `GET /api/auth/session` 恢复正式账号会话。
- 前端请求会自动携带学生 Bearer token；生产环境或 `REQUIRE_STUDENT_AUTH=true` 时，练习记录、收藏题、拍题沉淀、内容购买、积分购买和支付会话必须绑定真实学生账号。
- 生产环境下个人学习记录、错题、收藏、上传题、内容购买、积分账户和题包导出也会按登录学生或管理员权限读取，不再信任 query 里的任意昵称。
- 支付已补充正式回调入口 `POST /api/payments/webhook`，使用 `PAYMENT_WEBHOOK_SECRET` 生成 `X-Payment-Signature` 验签，并记录 `paymentWebhookEvents` 防止重复通知导致重复发放会员或积分。
- 订单、支付流水、用户列表、积分流水、商业上线审计和退款接口已收口到管理员 token；直接创建已支付订单只允许测试支付模式使用，生产模式必须走支付会话和回调状态机。
- 系统设置、AI 出题和 AI 生成历史已收口到管理员 token；生产环境缺少 `AI_API_KEY`、`AI_API_BASE`、`AI_MODEL` 或 `OCR_API_URL` 时，不再返回假 AI/OCR 结果冒充正式服务。
- 当前已补充本地文件持久化层，先把“重启即丢数据”的原型短板收口；未来上线时再把这一层替换为真实数据库即可。
- 题库 schema 已进一步升级到“教研编排版”：题包带产品定位、适用场景、教学目标、目标能力、课程标签；单题带领域、认知层级、场景类型、素养维度、答案模板、家长讲评提示、评分说明与干扰项分析。
- 题库现已补充 `GET /api/question-bank-coverage`，可直接检查每个知识点是否同时具备教材同步、专项训练、试卷诊断和认知层级覆盖。
- 单题内容已进入“命题人编审版”：每题带命题意图、步骤化解析、错因诊断、变式价值、课堂讲评脚本、家长复盘脚本、评分要点和内容层级；`audit:question-bank` 会检查这些资产是否缺失。
- 题目正文也已按高标准改造为“情境/材料 + 核心任务 + 作答要求”的出题形态，数学题减少纯口算模板，语文题强调文本依据，英语题进入短语境和真实任务。
- 题库继续升级到“成组变式编排”：每题进入 `A组·概念识别`、`B组·基础稳定`、`C组·方法迁移`、`D组·综合应用`、`E组·易错回收`、`F组·压轴挑战` 六类题组角色，并对核心题干增加机械题检查，避免裸计算、裸方程或泛化练习题残留。
- 本地持久化加载时会自动把同 ID 的 seed 题包、题目和知识点升级到最新教研字段，同时保留题包价格、上架状态、调题顺序等运营数据，避免旧 `store.json` 让运行时 API 停留在旧题库结构。
