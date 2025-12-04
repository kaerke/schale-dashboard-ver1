# Linux 服务器部署指南

## 1. 准备工作

确保服务器已安装：
- Node.js (v18+)
- Nginx
- PM2 (`npm install -g pm2`)

## 2. 构建项目 (在本地或服务器)

```bash
# 安装依赖
npm install

# 构建全栈 (生成 dist 和 dist-server 目录)
npm run build
```

## 3. 部署前端

前端是纯静态文件，不需要 Node.js 运行，只需要 Nginx 托管。

1.  **上传文件**: 将本地 `dist/` 目录下的**所有内容**上传到服务器的 Web 根目录（例如 `/var/www/html`）。
    ```bash
    # 示例 (假设你在项目根目录)
    scp -r dist/* user@your-server:/var/www/html/
    ```

2.  **配置 Nginx**: 确保 Nginx 配置了反向代理，将 `/api` 请求转发给后端端口 (4000)。

    *参考配置 (nginx.conf):*
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        # 前端静态文件
        location / {
            root /var/www/html;
            index index.html;
            try_files $uri $uri/ /index.html; # 必须：支持 React 路由
        }

        # 后端 API 转发
        location /api {
            proxy_pass http://localhost:4000; # 转发给 PM2 运行的后端
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **重启 Nginx**:
    ```bash
    sudo nginx -t # 检查配置语法
    sudo systemctl reload nginx
    ```

## 4. 部署后端

将以下文件/目录上传到服务器的一个新目录（例如 `/opt/schale-server`）：

1.  `dist-server/` (构建后的后端代码目录)
2.  `package.json` (用于安装依赖)
3.  `ecosystem.config.example.cjs` (配置模板)

> **注意**：不需要上传源码 (`src/`, `server/`) 或 `.env` 文件。所有配置均在 `ecosystem.config.cjs` 中管理。

在服务器上安装生产环境依赖并配置：

```bash
cd /opt/schale-server

# 安装依赖
npm install --production

# 复制并配置环境变量
cp ecosystem.config.example.cjs ecosystem.config.cjs
nano ecosystem.config.cjs
# -> 在此处填入你的 GEMINI_API_KEY 和其他配置
```

## 5. 启动后端

使用 PM2 启动后端服务：

```bash
pm2 start ecosystem.config.cjs
```

## 6. 常用维护命令

### 服务管理
```bash
# 查看服务状态
pm2 status

# 查看实时日志 (排查报错用)
pm2 logs schale-backend

# 重启服务 (修改配置后需要重启)
pm2 restart schale-backend

# 停止服务
pm2 stop schale-backend
```

### 更新部署流程
当你本地修改了代码后：
1. 本地运行 `npm run build` 重新构建。
2. 将新的 `dist-server/` 目录上传覆盖服务器上的旧目录。
3. 服务器上运行 `pm2 restart schale-backend`。

## 7. 验证

访问你的域名，检查页面是否加载，以及 Arona 聊天功能是否正常。
如果 Arona 报错，请检查 PM2 日志：
```bash
pm2 logs schale-backend
```
