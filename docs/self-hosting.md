# Self-Hosting Voyagr

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- A domain name with DNS access (for multi-tenant subdomains)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/voyagr.git
cd voyagr

# 2. Create your environment file from the template
cp .env.docker .env

# 3. Edit .env — at minimum change all CHANGE_ME values
#    Generate AUTH_SECRET with: openssl rand -base64 32
nano .env

# 4. Start the services (remove docker-compose.override.yml for production)
rm -f docker-compose.override.yml
docker compose up -d
```

The app will be available at `http://localhost:3000`.

## First Run — Database Migrations

After the containers start for the first time, run Prisma migrations to create the database tables:

```bash
docker compose exec app npx prisma migrate deploy
```

This reads the migration files from `prisma/migrations/` and applies them to the MySQL database.

## DNS Setup

Voyagr serves each tenant on a subdomain (e.g., `acme.yourdomain.com`). You need two DNS records:

| Type | Name              | Value            |
|------|-------------------|------------------|
| A    | `yourdomain.com`  | Your server IP   |
| A    | `*.yourdomain.com`| Your server IP   |

Replace `yourdomain.com` with your actual domain.

## SSL with Nginx + Certbot

In production you should terminate SSL at a reverse proxy. Here is a minimal nginx setup:

### 1. Install nginx and certbot

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### 2. Create nginx config

Create `/etc/nginx/sites-available/voyagr`:

```nginx
server {
    listen 80;
    server_name yourdomain.com *.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/voyagr /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Obtain SSL certificate

```bash
sudo certbot --nginx -d yourdomain.com -d "*.yourdomain.com"
```

> Wildcard certificates require DNS validation. Certbot will prompt you to add a TXT record. Alternatively, use a DNS plugin (e.g., `certbot-dns-cloudflare`) for automatic renewal.

## Updating

```bash
cd voyagr
git pull
docker compose build
docker compose up -d

# If there are new migrations:
docker compose exec app npx prisma migrate deploy
```

## Backup

### Database

```bash
# Dump the full database
docker compose exec mysql mysqldump -u root -p voyagr > backup-$(date +%F).sql

# Restore from backup
docker compose exec -T mysql mysql -u root -p voyagr < backup-2026-04-16.sql
```

### Uploads

User-uploaded media is stored in a Docker named volume. To back it up:

```bash
# Find the volume mount path
docker volume inspect voyagr_uploads

# Or copy files out of the container
docker compose cp app:/app/public/uploads ./uploads-backup
```

Keep both database and uploads backups together to ensure a consistent restore.
