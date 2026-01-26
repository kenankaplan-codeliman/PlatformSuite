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
```

### **Create Database:**
```sql
-- PostgreSQL
create database crm_db;
create user crm_user with password 'fIvOp82KCPtA1BpTwz9ifKs9qqsGR2d3';
grant connect on database crm_db to crm_user;
grant usage on schema public to crm_user;
grant create on schema public to crm_user;
grant select, insert, update, delete on all tables in schema public to crm_user;
alter default privileges in schema public grant select, insert, update, delete on tables to crm_user;
grant usage, select on all sequences in schema public to crm_user;
alter default privileges in schema public grant usage, select on sequences to crm_user;
```

### **4. Run Application:**
```bash
cd CRM.API
dotnet run

# API: http://localhost:5000, https://localhost:5001
# Swagger: http://localhost:5000/swagger/index.html, https://localhost:5001/swagger/index.html
```

---

## **Project Structure**

### ** CRM.Domain (Core Layer)**

**Entities:**
- `User.cs` - User with Microsoft SSO support
- `Organization.cs` - Multi-tenant organizations
- `Role.cs` - Role-based access control
- `UserSession.cs` - Refresh token management
- `Lead.cs` - Lead/prospect management
- `LeadActivity.cs` - Lead activity tracking

**Enums:**
- `LeadStatus` - New, Contacted, Qualified, Proposal, Negotiation, Won, Lost, Inactive
- `LeadSource` - Website, Referral, SocialMedia, Email, Phone, Event, Partner, Other
- `LeadActivityType` - Note, Email, Call, Meeting, StatusChange, Assignment

**No Dependencies!** Pure business logic.

---

### ** CRM.Application (Use Cases)**

**DTOs:**
- `Auth/` - LoginRequest, MicrosoftCallbackRequest, RefreshTokenRequest, LoginResponse, UserDto
- `Lead/` - CreateLeadRequest, UpdateLeadRequest, AssignLeadRequest, ChangeLeadStatusRequest, AddLeadActivityRequest, SearchLeadsRequest, LeadDto, LeadStatsResponse

**Interfaces:**
- `IAuthService` - Authentication business logic
- `ILeadService` - Lead management business logic
- `IJwtService` - JWT token operations
- `IPasswordService` - Password hashing
- `IMicrosoftGraphService` - Microsoft Graph API
- `IUnitOfWork` - Transaction management

**Dependencies:** CRM.Domain only

---

### ** CRM.Infrastructure (Data & External Services)**

**Data:**
- `ApplicationDbContext.cs` - EF Core DbContext with PostgreSQL

**Services:**
- `AuthService.cs` - IAuthService implementation
- `LeadService.cs` - ILeadService implementation
- `JwtService.cs` - JWT token generation
- `PasswordService.cs` - BCrypt password hashing
- `MicrosoftGraphService.cs` - Microsoft Graph API client

**Dependencies:** CRM.Application, CRM.Domain

---

### **4. CRM.API (Presentation)**

**Controllers:**
- `AuthController.cs` - Authentication endpoints
- `LeadController.cs` - Lead management endpoints

**Program.cs:**
- Dependency injection
- Authentication/Authorization
- CORS configuration
- Swagger/OpenAPI

**Dependencies:** CRM.Application, CRM.Infrastructure

---

## **Database Schema**

```sql
-- ============================================
-- CRM Database - PostgreSQL 16 Table Scripts
-- ============================================
-- Generated for Entity Framework Core entities
-- No quotes in table/column names as requested
-- ============================================

-- ============================================
-- 1. apporganization TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS apporganization (
    id UUID PRIMARY KEY,
    organizationcode VARCHAR(25) NOT NULL,
    organizationname VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    parentorganizationid UUID,
    isdefault BOOLEAN NOT NULL DEFAULT FALSE,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    createdby UUID NOT NULL,
    createdat TIMESTAMP NOT NULL,
    updatedby UUID,
    updatedat TIMESTAMP,
    isdeleted BOOLEAN NOT NULL DEFAULT FALSE,
    deletedby UUID,
    deletedat TIMESTAMP,
    CONSTRAINT fk_apporganization_parent FOREIGN KEY (parentorganizationid) 
        REFERENCES apporganization(id) ON DELETE SET NULL
);

-- Index for organization code (likely to be used for lookups)
CREATE INDEX IF NOT EXISTS idx_apporganization_code ON apporganization(organizationcode, isdeleted);

-- Index for parent organization (for hierarchical queries)
CREATE INDEX IF NOT EXISTS idx_apporganization_parent ON apporganization(parentorganizationid, isdeleted);

-- Index for active and non-deleted records
CREATE INDEX IF NOT EXISTS idx_apporganization_active ON apporganization(isactive, isdeleted);

-- ============================================
-- 2. appuser TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appuser (
    id UUID PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    organizationid UUID NOT NULL,
    microsoft365id VARCHAR(255),
    passwordhash VARCHAR(500),
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    createdby UUID NOT NULL,
    createdat TIMESTAMP NOT NULL,
    updatedby UUID,
    updatedat TIMESTAMP,
    isdeleted BOOLEAN NOT NULL DEFAULT FALSE,
    deletedby UUID,
    deletedat TIMESTAMP,
    CONSTRAINT fk_appuser_organization FOREIGN KEY (organizationid) 
        REFERENCES apporganization(id) ON DELETE RESTRICT
);

-- Unique constraint for email
CREATE UNIQUE INDEX IF NOT EXISTS idx_appuser_email_unique ON appuser(email) WHERE isdeleted = FALSE;

-- Index for organization
CREATE INDEX IF NOT EXISTS idx_appuser_organization ON appuser(organizationid);

-- Index for Microsoft 365 ID
CREATE INDEX IF NOT EXISTS idx_appuser_microsoft365id ON appuser(microsoft365id) WHERE microsoft365id IS NOT NULL;

-- Index for active and non-deleted users
CREATE INDEX IF NOT EXISTS idx_appuser_active ON appuser(isactive, isdeleted);

-- ============================================
-- 3. approle TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS approle (
    id UUID PRIMARY KEY,
    rolename VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    isdefault BOOLEAN NOT NULL DEFAULT FALSE,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    createdby UUID NOT NULL,
    createdat TIMESTAMP NOT NULL,
    updatedby UUID,
    updatedat TIMESTAMP
);

-- Unique constraint for role name
CREATE UNIQUE INDEX IF NOT EXISTS idx_approle_name_unique ON approle(rolename) WHERE isactive = TRUE;

-- Index for active roles
CREATE INDEX IF NOT EXISTS idx_approle_active ON approle(isactive);

-- ============================================
-- 4. appprivilege TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appprivilege (
    id UUID PRIMARY KEY,
    privilegecode VARCHAR(25) NOT NULL,
    privilegename VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    createdby UUID NOT NULL,
    createdat TIMESTAMP NOT NULL,
    updatedby UUID,
    updatedat TIMESTAMP
);

-- Unique constraint for privilege code
CREATE UNIQUE INDEX IF NOT EXISTS idx_appprivilege_code_unique ON appprivilege(privilegecode) WHERE isactive = TRUE;

-- Index for active privileges
CREATE INDEX IF NOT EXISTS idx_appprivilege_active ON appprivilege(isactive);

-- ============================================
-- 5. appuserrole TABLE (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS appuserrole (
    id UUID PRIMARY KEY,
    userid UUID NOT NULL,
    roleid UUID NOT NULL,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_appuserrole_user FOREIGN KEY (userid) 
        REFERENCES appuser(id) ON DELETE CASCADE,
    CONSTRAINT fk_appuserrole_role FOREIGN KEY (roleid) 
        REFERENCES approle(id) ON DELETE CASCADE
);

-- Unique constraint to prevent duplicate user-role assignments
CREATE UNIQUE INDEX IF NOT EXISTS idx_appuserrole_unique ON appuserrole(userid, roleid) WHERE isactive = TRUE;

-- Index for role lookups
CREATE INDEX IF NOT EXISTS idx_appuserrole_role ON appuserrole(roleid);

CREATE INDEX IF NOT EXISTS idx_appuserrole_user ON appuserrole(userid);

-- Index for active user roles
CREATE INDEX IF NOT EXISTS idx_appuserrole_active ON appuserrole(isactive);

-- ============================================
-- 6. approleprivilege TABLE (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS approleprivilege (
    id UUID PRIMARY KEY,
    roleid UUID NOT NULL,
    privilegecode VARCHAR(100) NOT NULL,
    accesslevel INTEGER NOT NULL DEFAULT 0,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_approleprivilege_role FOREIGN KEY (roleid) 
        REFERENCES approle(id) ON DELETE CASCADE
);

-- Unique constraint to prevent duplicate role-privilege assignments
CREATE UNIQUE INDEX IF NOT EXISTS idx_approleprivilege_unique ON approleprivilege(roleid, privilegecode) WHERE isactive = TRUE;

-- Index for privilege code lookups
CREATE INDEX IF NOT EXISTS idx_approleprivilege_code ON approleprivilege(privilegecode);

-- Index for active role privileges
CREATE INDEX IF NOT EXISTS idx_approleprivilege_active ON approleprivilege(isactive);

-- ============================================
-- 7. apploginhistory TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS apploginhistory (
    id UUID PRIMARY KEY,
    userid UUID NOT NULL,
    logindate TIMESTAMP NOT NULL,
    logoutdate TIMESTAMP,
    accesstokenid VARCHAR(100) NOT NULL,
    accesstokenexpiresat TIMESTAMP NOT NULL,
    refreshtoken VARCHAR(100) NOT NULL,
    refreshtokenexpiresat TIMESTAMP NOT NULL,
    refreshcount INTEGER NOT NULL DEFAULT 0,
    ipaddress VARCHAR(50),
    useragent VARCHAR(500),
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_apploginhistory_user FOREIGN KEY (userid) 
        REFERENCES appuser(id) ON DELETE CASCADE
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_apploginhistory_user ON apploginhistory(userid);

-- Index for login date (for reporting and analytics)
CREATE INDEX IF NOT EXISTS idx_apploginhistory_logindate ON apploginhistory(logindate DESC);

-- Index for access token lookups
CREATE INDEX IF NOT EXISTS idx_apploginhistory_accesstoken ON apploginhistory(accesstokenid);

-- Index for refresh token lookups
CREATE INDEX IF NOT EXISTS idx_apploginhistory_refreshtoken ON apploginhistory(refreshtoken);

-- Index for active sessions
CREATE INDEX IF NOT EXISTS idx_apploginhistory_active ON apploginhistory(isactive, logoutdate) WHERE isactive = TRUE AND logoutdate IS NULL;

-- ============================================
-- 8. lead TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lead (
    id UUID PRIMARY KEY,
    companyname VARCHAR(200) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    jobtitle VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    mobilephone VARCHAR(50),
    website VARCHAR(500),
    leadsource INTEGER NOT NULL,
    leadstatus INTEGER NOT NULL,
    leadrating INTEGER NOT NULL,
    industry VARCHAR(200),
    numberofemployees INTEGER,
    annualrevenue NUMERIC(18, 2),
    estimatedvalue NUMERIC(18, 2),
    description TEXT,
    address TEXT,
    converteddate TIMESTAMP,
    convertedaccountid UUID,
    convertedcontactid UUID,
    convertedopportunityid UUID,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    createdby UUID NOT NULL,
    createdat TIMESTAMP NOT NULL,
    updatedby UUID,
    updatedat TIMESTAMP,
    isdeleted BOOLEAN NOT NULL DEFAULT FALSE,
    deletedby UUID,
    deletedat TIMESTAMP,
    ownerid UUID NOT NULL,
    organizationid UUID NOT NULL,
    CONSTRAINT fk_lead_organization FOREIGN KEY (organizationid) 
        REFERENCES apporganization(id) ON DELETE RESTRICT,
    CONSTRAINT fk_lead_owner FOREIGN KEY (ownerid) 
        REFERENCES appuser(id) ON DELETE RESTRICT,
    CONSTRAINT fk_lead_createdby FOREIGN KEY (createdby) 
        REFERENCES appuser(id) ON DELETE RESTRICT
);

-- Index for owner lookups
CREATE INDEX IF NOT EXISTS idx_lead_owner ON lead(ownerid);

-- Index for organization
CREATE INDEX IF NOT EXISTS idx_lead_organization ON lead(organizationid);

-- Index for lead status
CREATE INDEX IF NOT EXISTS idx_lead_status ON lead(leadstatus);

-- Index for lead source
CREATE INDEX IF NOT EXISTS idx_lead_source ON lead(leadsource);

-- Index for lead rating
CREATE INDEX IF NOT EXISTS idx_lead_rating ON lead(leadrating);

-- Index for company name (for search)
CREATE INDEX IF NOT EXISTS idx_lead_companyname ON lead(companyname);

-- Index for email (for search and duplicate detection)
CREATE INDEX IF NOT EXISTS idx_lead_email ON lead(email) WHERE email IS NOT NULL;

-- Index for active and non-deleted leads
CREATE INDEX IF NOT EXISTS idx_lead_active ON lead(isactive, isdeleted);

-- Index for converted leads
CREATE INDEX IF NOT EXISTS idx_lead_converted ON lead(converteddate) WHERE converteddate IS NOT NULL;

-- Index for created date (for reporting)
CREATE INDEX IF NOT EXISTS idx_lead_createdat ON lead(createdat DESC);

-- ============================================
-- COMMENTS ON TABLES
-- ============================================
COMMENT ON TABLE apporganization IS 'Stores organization/company information with hierarchical structure support';
COMMENT ON TABLE appuser IS 'Stores user accounts with organization relationship and Microsoft 365 integration';
COMMENT ON TABLE approle IS 'Stores role definitions for role-based access control';
COMMENT ON TABLE appprivilege IS 'Stores privilege definitions for fine-grained access control';
COMMENT ON TABLE appuserrole IS 'Junction table linking users to roles (many-to-many)';
COMMENT ON TABLE approleprivilege IS 'Junction table linking roles to privileges with access levels (many-to-many)';
COMMENT ON TABLE apploginhistory IS 'Stores user login/logout history with token information for session management';
COMMENT ON TABLE lead IS 'Stores sales lead information with ownership and conversion tracking';

-- ============================================
-- COMMENTS ON IMPORTANT COLUMNS
-- ============================================
COMMENT ON COLUMN approleprivilege.accesslevel IS 'Access level enum: 0=None, other values as defined in application';
COMMENT ON COLUMN lead.leadsource IS 'Lead source enum as defined in application';
COMMENT ON COLUMN lead.leadstatus IS 'Lead status enum as defined in application';
COMMENT ON COLUMN lead.leadrating IS 'Lead rating enum as defined in application';
COMMENT ON COLUMN appuser.microsoft365id IS 'Microsoft 365 user ID for SSO integration';
COMMENT ON COLUMN apploginhistory.refreshcount IS 'Number of times the refresh token has been used';

-- ============================================
-- END OF SCRIPT
-- ============================================


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
