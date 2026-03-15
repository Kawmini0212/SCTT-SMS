# Environment Configuration for Docker

## Overview

This project uses environment variables for managing sensitive configuration like database passwords. The `.env.docker` file contains credentials that should **never be committed to version control**.

---

## Setup Instructions

### Step 1: Environment Files

**Two environment files are used:**

```
.env.docker          → Docker Compose credentials (IGNORED by git)
.env                 → Frontend/Backend service configs (IGNORED by git)
```

Both files are listed in `.gitignore` and will not be tracked by Git.

---

### Step 2: Configure `.env.docker`

**File:** `.env.docker`

**Location:** Root directory of the project

**Content:**
```bash
# Database credentials for Docker Compose
MYSQL_ROOT_PASSWORD=Kawmini
DB_PASSWORD=Kawmini
```

**What it does:**
- `MYSQL_ROOT_PASSWORD`: MySQL root user password (used during DB initialization)
- `DB_PASSWORD`: Password for all microservices to connect to MySQL

---

### Step 3: Run Docker Compose with Environment File

**Load the environment file when starting containers:**

```powershell
# Load environment from .env.docker
docker-compose --env-file .env.docker up

# Or rebuild and start:
docker-compose --env-file .env.docker up --build

# Run in background:
docker-compose --env-file .env.docker up -d
```

**What happens:**
- Docker Compose reads `.env.docker` file
- Replaces all `${VARIABLE_NAME}` references with actual values
- Services start with correct database credentials

---

## How It Works

### Before (Hardcoded - ❌ Not Secure)
```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: Kawmini  # Visible in code!
    
auth-service:
  environment:
    DB_PASSWORD: Kawmini          # Exposed!
```

### After (Environment Variables - ✅ Secure)
```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}  # Read from .env.docker
    
auth-service:
  environment:
    DB_PASSWORD: ${DB_PASSWORD}                  # Read from .env.docker
```

---

## Security Best Practices

### ✅ DO:
- ✅ Keep `.env.docker` file **locally** on your machine
- ✅ Add `.env.docker` to `.gitignore` (already done)
- ✅ Never commit credentials to version control
- ✅ Use strong, unique passwords in production
- ✅ Rotate credentials regularly in production
- ✅ Use Docker Secrets for production deployments

### ❌ DON'T:
- ❌ Commit `.env.docker` to Git
- ❌ Share `.env.docker` file publicly
- ❌ Use the same password for all services in production
- ❌ Use "Kawmini" as password in production (example only)
- ❌ Hardcode credentials in docker-compose.yml
- ❌ Share credentials via email or chat

---

## Development vs Production

### Development (Local)
```bash
# Use example password
MYSQL_ROOT_PASSWORD=Kawmini
DB_PASSWORD=Kawmini

# Start with:
docker-compose --env-file .env.docker up
```

### Production (Real Server)
```bash
# Use strong, random password
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 32)

# Use Docker Secrets instead:
docker secret create db_root_password <(echo 'strong-password-here')
docker secret create db_password <(echo 'strong-password-here')

# Reference in docker-compose:
environment:
  MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
  DB_PASSWORD_FILE: /run/secrets/db_password
```

---

## `.gitignore` Configuration

**Verified entries (added to `.gitignore`):**

```
# Environment variables (Secrets - Never commit!)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.docker                    # ← Added for Docker credentials
```

---

## Verification

**Check that `.env.docker` is ignored:**

```powershell
# List files tracked by Git (should NOT include .env.docker)
git status

# If .env.docker was accidentally tracked, remove it:
git rm --cached .env.docker
git commit -m "Remove .env.docker from tracking"
```

**Verify docker-compose uses environment variables:**

```powershell
# See what values Docker will use (shows expanded variables):
docker-compose --env-file .env.docker config | grep -i password

# Should output:
# MYSQL_ROOT_PASSWORD: Kawmini
# DB_PASSWORD: Kawmini
```

---

## Troubleshooting

### Problem: "Connection refused: Database won't start"
**Solution:**
```powershell
# Ensure .env.docker exists
Test-Path .env.docker

# Verify passwords match in .env.docker
cat .env.docker

# Restart with env file
docker-compose --env-file .env.docker restart mysql
```

### Problem: "Environment variables not loading"
**Solution:**
```powershell
# Must use --env-file flag
docker-compose --env-file .env.docker up

# NOT:
docker-compose up  # ❌ Won't load .env.docker
```

### Problem: "Cannot access database" errors
**Solution:**
```powershell
# Check if .env.docker has correct format
cat .env.docker

# Should be:
# MYSQL_ROOT_PASSWORD=Kawmini
# DB_PASSWORD=Kawmini

# Rebuild containers to apply new credentials
docker-compose --env-file .env.docker down -v
docker-compose --env-file .env.docker up --build
```

---

## CI/CD Pipeline

**For GitHub Actions or deployment pipelines:**

```yaml
# Create secrets in GitHub/GitLab
MYSQL_ROOT_PASSWORD: ${{ secrets.MYSQL_ROOT_PASSWORD }}
DB_PASSWORD: ${{ secrets.DB_PASSWORD }}

# Use them:
docker-compose -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
               -e DB_PASSWORD=$DB_PASSWORD \
               up -d
```

---

## Summary

| Item | Status | Location |
|------|--------|----------|
| Credentials externalized | ✅ Yes | `.env.docker` |
| Environment variables | ✅ Yes | `${VARIABLE_NAME}` |
| Git ignored | ✅ Yes | `.gitignore` |
| Documented | ✅ Yes | This file |
| Secure defaults | ✅ Yes | Only for development |

---

## Quick Start

```powershell
# 1. Ensure .env.docker exists
Test-Path .env.docker  # Should return True

# 2. Start system
docker-compose --env-file .env.docker up -d

# 3. Verify containers
docker ps  # Should show 7 running containers

# 4. Check logs
docker-compose logs -f mysql
```

---

**Questions?** Refer to [Docker Environment Variables Documentation](https://docs.docker.com/compose/environment-variables/)
