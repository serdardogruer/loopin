
# 13-Deployment.md
deployment = """# Loopin
## Deployment Guide
### Version 1.0

---

# 1. Genel Bakis

Bu dokuman, Loopin platformunun gelistirme, staging ve production ortamlarina deployment sureclerini, CI/CD pipeline'larini ve altyapi yapilandirmalarini tanimlar.

---

# 2. Ortam Yapilandirmasi

## 2.1 Ortamlar

| Ortam | Amaç | URL |
|-------|------|-----|
| **Development** | Yerel gelistirme | localhost |
| **Staging** | Test ve QA | staging.loopin.app |
| **Production** | Canli sistem | loopin.app |

## 2.2 Branch Stratejisi

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (feature branches)
  ↑
hotfix/* (emergency fixes)
```

| Branch | Deploy Target | CI/CD Trigger |
|--------|--------------|---------------|
| `main` | Production | PR merge to main |
| `develop` | Staging | Push to develop |
| `feature/*` | - | PR only |
| `hotfix/*` | Production | PR merge to main |

---

# 3. Altyapi Mimarisi

## 3.1 Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN (CloudFront)                         │
│                    Static Assets + Media Files                    │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Load Balancer (ALB)                         │
│                    SSL Termination + Routing                      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐   ┌────────▼────────┐   ┌────────▼────────┐
│  API Server 1  │   │  API Server 2   │   │  API Server N   │
│  (NestJS)      │   │  (NestJS)       │   │  (NestJS)       │
│  t3.medium     │   │  t3.medium      │   │  t3.medium      │
└───────┬───────┘   └────────┬────────┘   └────────┬────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────────┐
│                      Data Layer                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Redis     │  │    S3        │          │
│  │  (RDS)       │  │  (ElastiCache)│  │  (Media)     │          │
│  │  Multi-AZ    │  │  Cluster     │  │  + CloudFront│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 3.2 AWS Servisleri

| Servis | Kullanim Amaci | Instance/Tip |
|--------|---------------|--------------|
| **EC2** | API sunuculari | t3.medium (2 vCPU, 4GB) |
| **RDS** | PostgreSQL | db.t3.medium, Multi-AZ |
| **ElastiCache** | Redis | cache.t3.micro, cluster |
| **S3** | Dosya depolama | Standard, versioning |
| **CloudFront** | CDN | Global edge locations |
| **ALB** | Load balancer | Application Load Balancer |
| **Route 53** | DNS | Hosted zone |
| **CloudWatch** | Monitoring | Logs, metrics, alarms |
| **SNS** | Bildirimler | Email, SMS alerts |
| **Secrets Manager** | Sifre yonetimi | Rotasyon aktif |

---

# 4. Docker Yapilandirmasi

## 4.1 Backend Dockerfile

```dockerfile
# backend/Dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

USER node

CMD ["node", "dist/main.js"]
```

## 4.2 Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://loopin:loopin@postgres:5432/loopin_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    networks:
      - loopin-network

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=loopin
      - POSTGRES_PASSWORD=loopin
      - POSTGRES_DB=loopin_dev
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - loopin-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - loopin-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
    networks:
      - loopin-network

volumes:
  postgres-data:
  redis-data:

networks:
  loopin-network:
    driver: bridge
```

## 4.3 Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - S3_BUCKET=${S3_BUCKET}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - loopin-network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - loopin-network

networks:
  loopin-network:
    driver: bridge
```

---

# 5. CI/CD Pipeline

## 5.1 GitHub Actions - Backend CI

```yaml
# .github/workflows/backend-ci.yml
name: Backend CI

on:
  push:
    branches: [develop, main]
    paths:
      - 'backend/**'
  pull_request:
    branches: [develop, main]
    paths:
      - 'backend/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: loopin
          POSTGRES_PASSWORD: loopin
          POSTGRES_DB: loopin_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: './backend/package-lock.json'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run typecheck

      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://loopin:loopin@localhost:5432/loopin_test
          REDIS_URL: redis://localhost:6379

      - name: Run e2e tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://loopin:loopin@localhost:5432/loopin_test
          REDIS_URL: redis://localhost:6379

      - name: Build
        run: npm run build

  build-and-push:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: loopin-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
```

## 5.2 GitHub Actions - Mobile CI

```yaml
# .github/workflows/mobile-ci.yml
name: Mobile CI

on:
  push:
    branches: [develop, main]
    paths:
      - 'mobile/**'
  pull_request:
    branches: [develop, main]
    paths:
      - 'mobile/**'

jobs:
  analyze-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./mobile

    steps:
      - uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.0'
          channel: 'stable'

      - name: Get dependencies
        run: flutter pub get

      - name: Analyze code
        run: flutter analyze

      - name: Run tests
        run: flutter test

      - name: Build APK
        run: flutter build apk --release

  build-ios:
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main'
    defaults:
      run:
        working-directory: ./mobile

    steps:
      - uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.0'
          channel: 'stable'

      - name: Install dependencies
        run: flutter pub get

      - name: Build iOS
        run: flutter build ios --release --no-codesign
```

## 5.3 GitHub Actions - Deploy to Staging

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster loopin-staging \
            --service loopin-api \
            --force-new-deployment

      - name: Run database migrations
        run: |
          # Run migrations via ECS task
          aws ecs run-task \
            --cluster loopin-staging \
            --task-definition loopin-migrate \
            --launch-type FARGATE \
            --network-configuration "awsvpcConfiguration={subnets=[${{ secrets.STAGING_SUBNET }}],securityGroups=[${{ secrets.STAGING_SG }}],assignPublicIp=ENABLED}"

      - name: Verify deployment
        run: |
          sleep 30
          curl -f https://api-staging.loopin.app/health || exit 1
```

## 5.4 GitHub Actions - Deploy to Production

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Deploy to ECS (Blue/Green)
        run: |
          # Update task definition with new image
          aws ecs update-service \
            --cluster loopin-production \
            --service loopin-api \
            --force-new-deployment

      - name: Run database migrations
        run: |
          aws ecs run-task \
            --cluster loopin-production \
            --task-definition loopin-migrate \
            --launch-type FARGATE \
            --network-configuration "awsvpcConfiguration={subnets=[${{ secrets.PROD_SUBNET }}],securityGroups=[${{ secrets.PROD_SG }}],assignPublicIp=ENABLED}"

      - name: Health check
        run: |
          for i in {1..10}; do
            if curl -f https://api.loopin.app/health; then
              echo "Deployment successful!"
              exit 0
            fi
            sleep 10
          done
          echo "Deployment failed!"
          exit 1

      - name: Rollback on failure
        if: failure()
        run: |
          aws ecs update-service \
            --cluster loopin-production \
            --service loopin-api \
            --task-definition loopin-api-previous \
            --force-new-deployment
```

---

# 6. Terraform Altyapi Kodu

## 6.1 Main Terraform Yapilandirmasi

```hcl
# terraform/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "loopin-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "loopin-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Loopin"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "loopin-${var.environment}"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  single_nat_gateway = var.environment == "staging"

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "loopin-${var.environment}"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "loopin-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "api" {
  family                   = "loopin-api-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "api"
      image = "${var.ecr_repository_url}:${var.image_tag}"
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_secretsmanager_secret.database_url.arn
        },
        {
          name      = "JWT_SECRET"
          valueFrom = aws_secretsmanager_secret.jwt_secret.arn
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.api.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "api" {
  name            = "loopin-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.ecs_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 3000
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  depends_on = [aws_lb_listener.https]
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "loopin-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = var.environment == "production"
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier = "loopin-${var.environment}"

  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  multi_az               = var.environment == "production"
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment == "staging"

  enabled_cloudwatch_logs_exports = ["postgresql"]
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "main" {
  cluster_id           = "loopin-${var.environment}"
  engine               = "redis"
  node_type            = var.redis_node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  security_group_ids   = [aws_security_group.redis.id]
  subnet_group_name    = aws_elasticache_subnet_group.main.name
}

# S3 Bucket for Media
resource "aws_s3_bucket" "media" {
  bucket = "loopin-media-${var.environment}"
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_cors_rule" "media" {
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["https://*.loopin.app"]
    max_age_seconds = 3000
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "media" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id   = "S3-loopin-media"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.media.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-loopin-media"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 86400
    default_ttl            = 604800
    max_ttl                = 31536000
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

## 6.2 Terraform Variables

```hcl
# terraform/variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}

variable "private_subnets" {
  description = "Private subnet CIDRs"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnets" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "ecs_cpu" {
  description = "ECS task CPU"
  type        = string
  default     = "512"
}

variable "ecs_memory" {
  description = "ECS task memory"
  type        = string
  default     = "1024"
}

variable "ecs_desired_count" {
  description = "ECS desired task count"
  type        = number
  default     = 2
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS max allocated storage"
  type        = number
  default     = 100
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}
```

---

# 7. Nginx Yapilandirmasi

## 7.1 Development Nginx

```nginx
# nginx/nginx.conf
upstream api {
    server api:3000;
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        access_log off;
        proxy_pass http://api/health;
    }
}
```

## 7.2 Production Nginx

```nginx
# nginx/nginx.prod.conf
upstream api {
    least_conn;
    server api1:3000 weight=5;
    server api2:3000 weight=5;
    server api3:3000 backup;
}

server {
    listen 80;
    server_name api.loopin.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.loopin.app;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        access_log off;
        proxy_pass http://api/health;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

---

# 8. Environment Variables

## 8.1 Backend (.env)

```env
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1
APP_NAME=Loopin
APP_URL=https://loopin.app

# Database
DATABASE_URL=postgresql://username:password@host:5432/loopin
DATABASE_SSL=true

# Redis
REDIS_URL=redis://host:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Firebase
FIREBASE_PROJECT_ID=loopin-app
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@loopin-app.iam.gserviceaccount.com

# AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-central-1
AWS_S3_BUCKET=loopin-media-production
AWS_S3_ENDPOINT=https://s3.eu-central-1.amazonaws.com

# Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
IYZICO_BASE_URL=https://api.iyzipay.com

# SMS
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG...
FROM_EMAIL=noreply@loopin.app
FROM_NAME=Loopin

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
SENTRY_DSN=https://...@sentry.io/...

# Feature Flags
ENABLE_PREMIUM=true
ENABLE_ORGANIZATION=false
ENABLE_BUSINESS_NETWORK=false
```

## 8.2 Mobile (.env)

```env
# API
API_BASE_URL=https://api.loopin.app/api/v1
SOCKET_BASE_URL=wss://api.loopin.app

# Firebase
FIREBASE_API_KEY=AIza...
FIREBASE_APP_ID=1:...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_PROJECT_ID=loopin-app
FIREBASE_STORAGE_BUCKET=loopin-app.appspot.com

# Maps
GOOGLE_MAPS_API_KEY=AIza...
MAPBOX_ACCESS_TOKEN=pk...

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASHLYTICS=true
```

---

# 9. Monitoring ve Alerting

## 9.1 CloudWatch Alarmlari

```yaml
# cloudwatch-alarms.yml
Resources:
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: Loopin-HighCPU
      AlarmDescription: CPU utilization > 80%
      MetricName: CPUUtilization
      Namespace: AWS/ECS
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: ClusterName
          Value: loopin-production
        - Name: ServiceName
          Value: loopin-api
      AlarmActions:
        - !Ref SNSTopic

  HighMemoryAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: Loopin-HighMemory
      AlarmDescription: Memory utilization > 85%
      MetricName: MemoryUtilization
      Namespace: AWS/ECS
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 85
      ComparisonOperator: GreaterThanThreshold
      AlarmActions:
        - !Ref SNSTopic

  HighErrorRate:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: Loopin-HighErrorRate
      AlarmDescription: 5xx errors > 5%
      MetricName: HTTPCode_Target_5XX_Count
      Namespace: AWS/ApplicationELB
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 10
      ComparisonOperator: GreaterThanThreshold
      AlarmActions:
        - !Ref SNSTopic

  DatabaseConnections:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: Loopin-DBConnections
      AlarmDescription: DB connections > 80%
      MetricName: DatabaseConnections
      Namespace: AWS/RDS
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: DBInstanceIdentifier
          Value: loopin-production
      AlarmActions:
        - !Ref SNSTopic
```

## 9.2 Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Loopin Production",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "singlestat",
        "targets": [
          {
            "expr": "count(increase(user_sessions_total[1h]))"
          }
        ]
      }
    ]
  }
}
```

---

# 10. Backup ve Recovery

## 10.1 Database Backup

```bash
#!/bin/bash
# scripts/backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
RETENTION_DAYS=7

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_DIR/loopin_${DATE}.sql.gz"

# Upload to S3
aws s3 cp "$BACKUP_DIR/loopin_${DATE}.sql.gz" s3://loopin-backups/database/

# Delete old backups (local)
find "$BACKUP_DIR" -name "loopin_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Delete old backups (S3)
aws s3 ls s3://loopin-backups/database/ | awk '{print $4}' | while read file; do
  aws s3 rm s3://loopin-backups/database/$file
done
```

## 10.2 Disaster Recovery Plan

| Senaryo | RTO | RPO | Adimlar |
|---------|-----|-----|---------|
| Tek sunucu arizasi | 5 dk | 0 | Auto-scaling yeni instance baslatir |
| AZ kaybi | 15 dk | 0 | Multi-AZ failover |
| Database corruption | 30 dk | 1 saat | Son yedekten restore |
| Tum region kaybi | 2 saat | 1 saat | Cross-region backup'tan restore |
| Veri silinmesi | 1 saat | 1 saat | S3 versioning'den recovery |

## 10.3 Recovery Komutlari

```bash
# Database restore
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME loopin_20260720_030000.sql.gz

# Redis restore
cat redis_backup.rdb | redis-cli -x RESTORE

# S3 object recovery
aws s3api restore-object \
  --bucket loopin-media-production \
  --key uploads/profile.jpg \
  --restore-request Days=7
```

---

# 11. Guvenlik Kontrol Listesi

## 11.1 Pre-Deployment Kontrolleri

- [ ] Tum sifreler Secrets Manager'da
- [ ] SSL/TLS sertifikalari gecerli
- [ ] Security group'lar minimum erisim
- [ ] WAF kurallari aktif
- [ ] DDoS korumasi (AWS Shield)
- [ ] Penetration test tamamlandi
- [ ] Dependency scan (npm audit)
- [ ] Container scan (Trivy)
- [ ] IAM rolleri least-privilege
- [ ] CloudTrail logging aktif

## 11.2 Guvenlik Araclari

| Arac | Amaç |
|------|------|
| Trivy | Container image scanning |
| npm audit | Dependency vulnerability |
| OWASP ZAP | Web application scanning |
| SonarQube | Code quality & security |
| AWS Inspector | EC2 vulnerability scanning |
| AWS GuardDuty | Threat detection |

---

# 12. Deployment Checklist

## 12.1 Staging Deployment

- [ ] CI/CD pipeline basarili
- [ ] Unit test'ler gecti
- [ ] Integration test'ler gecti
- [ ] Database migration'lar calisti
- [ ] Health check basarili
- [ ] Smoke test'ler tamamlandi
- [ ] Log'lar kontrol edildi
- [ ] Monitoring dashboard'lari kontrol edildi

## 12.2 Production Deployment

- [ ] Staging'de 48 saat stabil calisti
- [ ] Rollback plani hazir
- [ ] Deployment oncesi backup alindi
- [ ] Blue/Green deployment hazir
- [ ] Canary deployment (10% -> 50% -> 100%)
- [ ] Monitoring aktif
- [ ] On-call ekibi hazir
- [ ] Communication plani hazir

---

# 13. Rollback Proseduru

## 13.1 Otomatik Rollback

```bash
# ECS rollback
aws ecs update-service \
  --cluster loopin-production \
  --service loopin-api \
  --task-definition loopin-api-previous \
  --force-new-deployment

# Database rollback (migration)
npm run migration:revert

# Redis flush (dikkat!)
redis-cli FLUSHDB
```

## 13.2 Manuel Rollback

1. Deployment'i durdur
2. Son calisan versiyona geri don
3. Database migration'lari geri al (eger varsa)
4. Cache'i temizle
5. Health check yap
6. Log'lari kontrol et
7. Takimi bilgilendir

---

# SONUC

Bu deployment rehberi, Loopin platformunun guvenli, otomatik ve izlenebilir bir sekilde deployment edilmesini saglar. Her deployment oncesi kontrol listeleri ve rollback prosedurleri takip edilmelidir.
"""

with open('/mnt/agents/output/13-Deployment.md', 'w', encoding='utf-8') as f:
    f.write(deployment)

print("✅ 13-Deployment.md olusturuldu")
print("\n" + "="*60)
print("TUM DOKUMANLAR BASARIYLA OLUSTURULDU!")
print("="*60)
print("\nToplam: 13 dokuman")
print("\nTum dosyalar: /mnt/agents/output/ dizininde")
