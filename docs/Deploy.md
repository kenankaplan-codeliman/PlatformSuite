# CRM — VPS Deployment Rehberi

Bu döküman, CRM projesinin Natro VPS (Ubuntu, 6GB RAM, 100GB HDD, 2 core) üzerine Docker Compose ile deploy edilmesini adım adım anlatır.

> **⚠️ Port Şeması Güncellendi**
>
> Container'lar artık 80/443'ü doğrudan **bind etmez**. Yeni varsayılan host port'ları:
>
> | Servis | CRM | CodePro |
> |---|---|---|
> | nginx (entrypoint) | `9080` | `9081` |
> | PostgreSQL | `54321` | `54322` |
> | Elasticsearch | `9201` | `9211` |
> | Kibana | `5601` | `5611` |
>
> **HTTPS termination ve `:80`/`:443` yayını harici reverse proxy'nin sorumluluğundadır** (sunucu nginx'i, traefik, haproxy ya da cloud LB). Aşağıdaki **Bölüm 3 (Let's Encrypt + container içinde SSL)** legacy bir yöntemdir; yeni şemada harici proxy kullanılır.

---

## Bölüm 1: VPS İlk Kurulum

### 1.1 — VPS'e Bağlan

```bash
ssh root@<VPS_IP>
```

### 1.2 — Sistem Güncellemesi

```bash
apt update && apt upgrade -y
```

### 1.3 — Docker Kurulumu

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Doğrula
docker compose version
```

### 1.4 — Swap Alanı (Elasticsearch için zorunlu)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 1.5 — Elasticsearch Kernel Ayarı (ZORUNLU)

Bu ayar yapılmazsa Elasticsearch başlamaz:

```bash
echo 'vm.max_map_count=262144' >> /etc/sysctl.conf
sysctl -p
```

### 1.6 — Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

---

## Bölüm 2: Projeyi Deploy Et

### 2.1 — GitHub'dan Kodu Çek

```bash
mkdir -p /opt/crm
cd /opt/crm
git clone https://github.com/<GITHUB_KULLANICI>/<REPO_ADI>.git .
```

> **ÖNEMLİ:** `docker-compose.override.yml` VPS'te OLMAMALI. Bu dosya PostgreSQL portunu dışarıya açar. Varsa sil:
> ```bash
> rm -f docker-compose.override.yml
> ```

### 2.2 — Production `.env` Dosyası Oluştur

`.env` dosyası `.gitignore`'da olduğu için VPS'te elle oluşturulmalı:

```bash
nano /opt/crm/.env
```

Aşağıdaki içeriği yapıştır, `<...>` alanlarını güçlü değerlerle doldur:

```env
# ── PostgreSQL ───────────────────────────────────────────────
POSTGRES_PASSWORD=<GÜÇLÜ_ŞİFRE>

# ── Connection string (API) ──────────────────────────────────
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=crm_db;Username=crm_user;Password=<GÜÇLÜ_ŞİFRE>

# ── JWT (min 32 karakter) ────────────────────────────────────
Jwt__Key=<RASTGELE_32_KARAKTER>

# ── Admin kullanıcı şifresi ──────────────────────────────────
DefaultValues__Admin_User_Password=<ADMIN_ŞİFRE>

# ── Azure AD ─────────────────────────────────────────────────
VITE_AZURE_CLIENT_ID=<AZURE_CLIENT_ID>
VITE_AZURE_TENANT_ID=<AZURE_TENANT_ID>

# ── Elasticsearch / Kibana ───────────────────────────────────
ELASTIC_PASSWORD=<ELASTIC_ŞİFRE>
KIBANA_SYSTEM_PASSWORD=<KIBANA_ŞİFRE>
Logging__Elastic__Enabled=true
Logging__Elastic__Username=elastic
Logging__Elastic__Password=<ELASTIC_ŞİFRE>
```

Güçlü şifre üretmek için:

```bash
openssl rand -base64 32
```

### 2.3 — İlk Deploy

```bash
cd /opt/crm
docker compose up -d --build
```

İlk başlatmada Elasticsearch ~2–3 dakika bekleyebilir, normaldir.

### 2.4 — Durum Kontrolü

```bash
docker compose ps         # tüm servisler "Up" olmalı
docker compose logs api   # API hatası var mı?
docker compose logs db    # DB init scripti çalıştı mı?
```

| URL | Servis |
|-----|--------|
| `http://<VPS_IP>:9080/` | Frontend (CRM nginx) |
| `http://<VPS_IP>:9080/api/swagger/index.html` | Swagger UI |
| `http://<VPS_IP>:9080/kibana` | Kibana |

> Harici reverse proxy çalışıyorsa istemci sadece `https://<domain>/` görür; yukarıdaki `:9080` adresleri proxy'nin upstream'idir.

---

## Bölüm 3: HTTPS — Let's Encrypt + Certbot *(LEGACY)*

> **⚠️ Bu bölüm güncel mimariyle uyumsuz.** Yeni port şemasında container nginx 80/443 değil **9080/9081** bind eder. HTTPS termination'ı **harici reverse proxy** yapar (sunucu nginx'i, traefik, haproxy, cloud LB).
>
> Önerilen akış:
> 1. Sunucuda **dış nginx** (Docker dışında) kurulur, `:80`/`:443` bunu dinler.
> 2. SSL sertifikalarını dış nginx tutar (certbot bu nginx üzerinden yenilenir).
> 3. Dış nginx, `https://<domain>` isteklerini `proxy_pass http://localhost:9080;` (CRM) ya da `http://localhost:9081;` (CodePro) ile container'a iletir.
> 4. Container içinde SSL gerekmez; aşağıdaki "container içinde 443 + certbot stop" akışına gerek kalmaz.
>
> Aşağıdaki adımlar yalnızca **tek bir uygulama** sunucuda koşacaksa ve external proxy yoksa geçerli. İki uygulamayı (CRM + CodePro) aynı sunucuda paralel çalıştırmak istiyorsanız bu bölüm yetersizdir — external proxy gereklidir.

### 3.1 — DNS Ayarı

Domain'in A kaydını VPS IP'sine yönlendir, ardından yayılımı doğrula:

```bash
ping yourdomain.com   # VPS IP'sini döndürmeli
```

### 3.2 — Certbot Kur

```bash
apt install certbot -y
```

### 3.3 — SSL Sertifikası Al

Nginx container'ı geçici durdur, certbot port 80'i kullanacak:

```bash
cd /opt/crm
docker compose stop nginx

certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com

docker compose start nginx
```

Sertifikalar şuraya kaydedilir:
```
/etc/letsencrypt/live/yourdomain.com/fullchain.pem
/etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### 3.4 — docker-compose.yml Güncelle

`docker-compose.yml` içindeki `nginx` servisine 443 portunu ve sertifika volume'ünü ekle:

```yaml
nginx:
  image: nginx:1.27-alpine
  ports:
    - "80:80"
    - "443:443"                              # ← ekle
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/conf.d:/etc/nginx/conf.d:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro   # ← ekle
  depends_on:
    - frontend
    - api
    - kibana
  networks:
    - app_net
  restart: unless-stopped
```

### 3.5 — Nginx Config Güncelle

`nginx/conf.d/default.conf` dosyasını aşağıdakiyle değiştir (`yourdomain.com` kısmını kendi domain'inle değiştir):

```nginx
upstream frontend {
    server frontend:80;
}

upstream api {
    server api:8080;
}

upstream kibana {
    server kibana:5601;
}

# HTTP → HTTPS yönlendirme
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

# HTTPS ana blok
server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    # Frontend SPA
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # .NET API — /api prefix'ini strip ederek ilet
    location /api/ {
        proxy_pass http://api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Kibana
    location /kibana {
        proxy_pass http://kibana;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }
}
```

### 3.6 — Nginx'i Yeniden Başlat

```bash
cd /opt/crm
docker compose up -d nginx
```

Doğrula:

```bash
curl -I https://yourdomain.com
```

### 3.7 — Otomatik Sertifika Yenileme

Let's Encrypt sertifikaları 90 günde bir yenilenir. Renewal hook'larını kur:

```bash
# Pre-hook: yenileme öncesi nginx durdur
cat > /etc/letsencrypt/renewal-hooks/pre/stop-nginx.sh << 'EOF'
#!/bin/bash
docker compose -f /opt/crm/docker-compose.yml stop nginx
EOF

# Post-hook: yenileme sonrası nginx başlat
cat > /etc/letsencrypt/renewal-hooks/post/start-nginx.sh << 'EOF'
#!/bin/bash
docker compose -f /opt/crm/docker-compose.yml up -d nginx
EOF

chmod +x /etc/letsencrypt/renewal-hooks/pre/stop-nginx.sh
chmod +x /etc/letsencrypt/renewal-hooks/post/start-nginx.sh
```

Cron'a ekle (günde 2 kez kontrol eder):

```bash
crontab -e
```

```cron
0 3,15 * * * certbot renew --quiet
```

Yenilemeyi simüle ederek test et:

```bash
certbot renew --dry-run
```

### 3.8 — Azure AD Redirect URI Güncelle

Frontend artık HTTPS üzerinde çalışacak. Azure Portal'da güncelle:

- **Azure Portal** → App Registrations → Uygulamanı seç → Authentication
- Redirect URI olarak `https://yourdomain.com` ekle

---

## Bölüm 4: Güncelleme & Bakım

### Kod Güncellemesi Deploy Etme

```bash
cd /opt/crm
git pull origin main

docker compose up -d --build api        # Sadece API
docker compose up -d --build frontend   # Sadece frontend
docker compose up -d --build            # Tümünü rebuild
```

### Faydalı Komutlar

```bash
docker compose ps                        # Servis durumu
docker compose logs -f api              # API logları (canlı)
docker compose logs -f                  # Tüm loglar (canlı)
docker compose restart nginx            # Nginx yeniden başlat
docker compose down                     # Durdur (volume'lar korunur)
docker compose down -v                  # Durdur + volume'ları sil (DB sıfırlanır!)
```

### DB Bağlantısı Doğrula

```bash
docker compose exec db psql -U crm_user -d crm_db -c "\dt"
```

### Elasticsearch Durumu

```bash
docker compose exec elasticsearch \
  curl -s -u elastic:${ELASTIC_PASSWORD} \
  http://localhost:9200/_cluster/health
```

---

## Önemli Notlar

| Konu | Açıklama |
|------|----------|
| `docker-compose.override.yml` | VPS'te OLMAMALI — DB portunu dışarıya açar |
| `vm.max_map_count=262144` | Elasticsearch için ZORUNLU kernel ayarı |
| `.env` | Gitignore'da — VPS'te elle oluşturulmalı |
| DB init scripti | Sadece ilk başlatmada ve volume boşsa çalışır |
| Elasticsearch başlangıcı | API servisi ES başlayana kadar retry yapar — normaldir |
| Swap alanı | ES bellek baskısına karşı güvenlik ağı sağlar |
