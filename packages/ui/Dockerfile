########################
# 1. 构建阶段（builder）
########################
FROM node:22-alpine AS builder

# 工作目录（不存在会自动创建）
WORKDIR /workspace/

# 拷贝所有源码到容器
COPY . /workspace/

# armv7 目前只能用 node18，pnpm9 不支持 node18，所以这里锁 pnpm 8.15.7 版本（即便你现在是 node22，用这个版本也没问题）
RUN npm install -g pnpm@8.15.7

# ===== 构建前端 certd-client =====
WORKDIR /workspace/certd-client

# 安装依赖并构建前端
RUN pnpm install \
    && pnpm run build

# ===== 把前端构建产物拷贝到后端 public 目录 =====
WORKDIR /workspace

# 确保目标目录存在再拷贝
RUN mkdir -p /workspace/certd-server/public \
    && cp -r /workspace/certd-client/dist/* /workspace/certd-server/public/

# ===== 构建后端 certd-server =====
WORKDIR /workspace/certd-server

RUN pnpm install \
    && pnpm run build-on-docker



########################
# 2. 运行阶段（runtime）
########################
FROM node:22-alpine

EXPOSE 7001
EXPOSE 7002

# 安装运行时依赖
RUN apk add --no-cache openssl \
    && apk add --no-cache openjdk8

WORKDIR /app/

# 只拷贝构建好的服务器代码和依赖
COPY --from=builder /workspace/certd-server/ /app/

# 覆盖 ssh2 的协议文件（和你原来的保持一致）
COPY ./patch/ssh2/*.js /app/node_modules/.pnpm/node_modules/ssh2/lib/protocol/

# ====== lego 工具相关配置 ======
ENV LEGO_VERSION=4.22.2
ENV LEGO_DOWNLOAD_DIR=/app/tools/lego
RUN mkdir -p $LEGO_DOWNLOAD_DIR

# 根据架构下载不同的 lego 二进制
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget -O $LEGO_DOWNLOAD_DIR/lego_v${LEGO_VERSION}_linux_amd64.tar.gz https://github.com/go-acme/lego/releases/download/v${LEGO_VERSION}/lego_v${LEGO_VERSION}_linux_amd64.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget -O $LEGO_DOWNLOAD_DIR/lego_v${LEGO_VERSION}_linux_arm64.tar.gz https://github.com/go-acme/lego/releases/download/v${LEGO_VERSION}/lego_v${LEGO_VERSION}_linux_arm64.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH"; \
    fi

ENV TZ=Asia/Shanghai
ENV NODE_ENV=production
ENV MIDWAY_SERVER_ENV=production

CMD ["npm", "run", "start"]
