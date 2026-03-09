# CRM Application - .NET 10 + PostgreSQL + Elasticsearch

## **Architecture Overview**
Clean Architecture

```
CRM.Solution/
├── CRM.API/                (Presentation Layer - Controllers, Middleware)
├── CRM.Application/        (Application Layer - Use Cases, DTOs, Interfaces)
├── CRM.Domain/             (Domain Layer - Entities, Enums, Business Rules)
└── CRM.Infrastructure/     (Infrastructure Layer - Data Access, External Services)
└── CRM.Web/                (Frontend Layer - React Web)
```

### **Dependency Flow:**
```
API → Application → Domain
  ↘   Infrastructure  ↗
```

---

## **Quick Start**

### **Configure Database:**
```bash
# Edit appsettings.json
vi CRM.API/appsettings.json

# Update connection string:
"DefaultConnection": "Host=localhost;Database=crm_db;Username=crm_user;Password=your_password"
Database Script Files are inside the "CRM.Database" folder
```
### **4. Run Application:**
```bash
cd CRM.API
dotnet run

# API: http://localhost:5000, https://localhost:5001
# Swagger: http://localhost:5000/swagger/index.html, https://localhost:5001/swagger/index.html
```
---
##  **Configuration**

### **appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=crm_db;Username=crm_user;Password=your_password"
  },
  "Jwt": {
    "SecretKey": "your-super-secret-key-minimum-32-characters-long",
    "Issuer": "https://api.yourcompany.com",
    "Audience": "crm-api",
    "ExpirationMinutes": "15"
  },
  "Microsoft": {
    "TenantId": "YOUR_AZURE_TENANT_ID",
    "ClientId": "YOUR_AZURE_CLIENT_ID"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

---
## **Testing with Swagger**

1. Start application: `dotnet run`
2. Open Swagger: `http://localhost:5000/swagger`
3. Test endpoints:
   - Login → Copy `accessToken`
   - Click "Authorize" button
   - Paste token as: `Bearer {token}`
   - Test protected endpoints


## **Deployment**

### **Docker:**
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish CRM.API/CRM.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "CRM.API.dll"]
```

### **docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: crm_db
      POSTGRES_USER: crm_user
      POSTGRES_PASSWORD: fIvOp82KCPtA1BpTwz9ifKs9qqsGR2d3
    ports:
      - "5432:5432"

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.3
    container_name: data-platform-elasticsearch
    environment:
      # Temel Ayarlar
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"

      # GÜVENLİK AYARLARI (AÇIK ama SSL KAPALI)
      - xpack.security.enabled=true
      - xpack.security.http.ssl.enabled=false    
      - xpack.security.transport.ssl.enabled=false 

      # TÜM SİSTEM KULLANICI ŞİFRELERİ
      - ELASTIC_PASSWORD=elastic123          
    
      # Diğer
      - xpack.license.self_generated.type=basic
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    networks:
      - backend
    healthcheck:
      # 'elastic' kullanıcısı ve şifresi ile sağlık kontrolü
      test: ["CMD-SHELL", "curl -s -f -u elastic:elastic123 http://localhost:9200 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 20
      start_period: 40s
 
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Database=crm_db;Username=crm_user;Password=fIvOp82KCPtA1BpTwz9ifKs9qqsGR2d3"
    depends_on:
      - postgres
```

---

## **Seed Initial Data**

1. Default Organization (HQ-Headquarters)
2. Personel Default Role  (User Access Level)
3. Manager Role  (Organizational Access Level)
4. Administrator Role  (All Organizational Access Level)
5. Admin User
