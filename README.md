# JEDx & Skills API Demo

Production-ready demo implementation of **HR Open Standards** for skills-based hiring, workforce transformation, and talent optimization.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🎯 What This Is

A complete, working demo server implementing:

- **JEDx API** - Job Exchange Data format for employment data
- **Skills Data API** - HR Open Skills Proficiency API with JSON-LD
- **Sample Data** - Real-world examples including jobs, workers, skills, and credentials
- **Postman Collections** - Ready-to-use API testing collections

## 🚀 Quick Start (2 Steps)

```bash
cd server
npm install && npm start
```

Then open: `http://localhost:3000`

**Full Setup Guide:** [docs/DEMO_SERVER_QUICKSTART.md](docs/DEMO_SERVER_QUICKSTART.md)

## 📦 What's Included

### 1. Demo Server (`/server`)

- **Node.js + Express** REST API
- **42 endpoints** across both APIs
- **Auto-loads** sample data on startup
- **In-memory storage** (perfect for demos)
- **CORS enabled** for frontend integration
- **Ready for Render.com** deployment

### 2. Postman Collections (`/postman`)

- **JEDx_API.postman_collection.json** - 28 endpoints
- **Skills_API.postman_collection.json** - 21 endpoints
- **Environment files** for local and production
- **Sample requests** with real data

### 3. Sample Data (`/sample-data`)

Real-world examples demonstrating the APIs:

- **job-skills-architecture.json** - Job with embedded skills requirements
- **person-skills-profile.json** - Employee skills inventory (8 skills)
- **course-skills-assertions.json** - University course learning outcomes
- **open-badge-credential.json** - AWS certification badge
- **comprehensive-learner-record.json** - Complete CLR with degree, courses, badges
- **Workers & Organizations** - 10+ workers, organizations from Arkansas state agency

### 4. Documentation (`/docs`)

- **DEMO_SERVER_QUICKSTART.md** - Complete setup guide
- **SKILLS_API_GUIDE.md** - Skills API deep dive with workflows
- **SKILLS_API_EXAMPLES.md** - Real-world use cases explained
- **POSTMAN_GUIDE.md** - JEDx API Postman guide
- **API_COLLECTIONS_README.md** - Overview of both APIs

### 5. Schemas & Specs (`/schemas`, `/skillsapi`)

- JEDx JSON Schemas (job, worker, organization)
- Skills API OpenAPI 3.1 specification
- JSON-LD context files

## 🎯 Use Cases Demonstrated

### Skills-Based Hiring

```
1. Define job requirements (JEDx + Skills API)
2. Assess candidates (Assessment integration)
3. Map scores to proficiency levels
4. Match candidates to jobs
5. Identify skill gaps
```

### Workforce Analytics

```
1. Aggregate skills inventory
2. Analyze skill gaps
3. Identify internal mobility candidates
4. Track skills currency and decay
5. Plan reskilling initiatives
```

### Credentials & Badges

```
1. Issue Open Badges for skills
2. Create Comprehensive Learner Records
3. Verify credentials
4. Share portable skills data
```

## 🌐 Deploy to Production

### Render.com (Free Tier)

1. Push to GitHub
2. Connect to [Render.com](https://render.com)
3. Select repository
4. Render auto-detects `render.yaml`
5. Click Deploy

**Result:** `https://your-app.onrender.com`

### Other Platforms

- **Heroku**: `heroku create && git push heroku main`
- **Railway**: Import GitHub repo
- **Vercel**: Deploy as serverless
- **Docker**: `docker build -t jedx-api . && docker run -p 3000:3000 jedx-api`

## 📊 API Endpoints

### JEDx API (`/api/v1/jedx`)

**Jobs:**
- `GET /jobs` - List jobs
- `GET /jobs/:jobId` - Get job details
- `POST /jobs` - Create job
- `GET /jobs/:jobId/skills` - Get job skills (integrates with Skills API)

**Workers:**
- `GET /workers` - List workers
- `GET /workers/:workerId` - Get worker details
- `POST /workers` - Create worker

**Organizations:**
- `GET /organizations` - List organizations
- `GET /organizations/:orgId` - Get organization details

### Skills API (`/api/v1/skills`)

**Skills:**
- `GET /skills` - List all skills
- `GET /skills/:skillId` - Get skill details
- `POST /skills` - Create skill

**Skill Assertions:**
- `GET /assertions?personId=...` - Get person's skills
- `POST /assertions` - Create skill assertion

**Proficiency:**
- `GET /proficiency-scales` - List scales
- `POST /assessments/map-to-proficiency` - Map scores to levels

**Analytics:**
- `GET /analytics/skills-inventory` - Workforce skills
- `POST /analytics/gap-analysis` - Skills gap analysis
- `POST /analytics/mobility-candidates` - Internal mobility

**Credentials:**
- `POST /credentials/badges` - Issue Open Badge
- `GET /credentials` - Get credentials

## 🧪 Testing with Postman

### 1. Import Collections

In Postman, import:
- `postman/JEDx_API.postman_collection.json`
- `postman/Skills_API.postman_collection.json`
- `postman/Postman_Environment_Local.json`

### 2. Select Environment

Click environment dropdown → Select **"JEDx & Skills API - Local"**

### 3. Try These Requests

```
GET {{jedx_base_url}}/jobs
GET {{jedx_base_url}}/jobs/SWE-001/skills
GET {{skills_base_url}}/skills
GET {{skills_base_url}}/assertions?personId=employee-45678
POST {{skills_base_url}}/jedx/match
```

## 🏗️ Architecture

### Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Data Format**: JSON-LD 1.1
- **Storage**: In-memory (for demo)
- **Standards**: IMS Global Open Badges v3.0, W3C Verifiable Credentials

### Data Flow

```
Sample JSON Files → Load on Startup → In-Memory Storage → REST API → Postman/Client
```

## 📈 Standards Compliance

This demo implements:

- **HR Open JEDx** - Job Exchange Data format
- **IMS Global Open Badges v3.0** - Digital credentials
- **W3C Verifiable Credentials** - Cryptographically secure credentials
- **JSON-LD 1.1** - Linked Data format
- **Schema.org** - Vocabulary for structured data
- **Credential Engine CTDL** - Credential transparency

## 🔧 Configuration

### Environment Variables

```bash
PORT=3000              # Server port
NODE_ENV=development   # Environment
```

### CORS

CORS is enabled for all origins by default. For production:

```javascript
// server/server.js
app.use(cors({
  origin: ['https://your-frontend.com']
}));
```

## 📚 Documentation

| File | Description |
|------|-------------|
| [DEMO_SERVER_QUICKSTART.md](docs/DEMO_SERVER_QUICKSTART.md) | Complete setup guide |
| [SKILLS_API_GUIDE.md](docs/SKILLS_API_GUIDE.md) | Skills API comprehensive guide |
| [SKILLS_API_EXAMPLES.md](docs/SKILLS_API_EXAMPLES.md) | Real-world examples explained |
| [POSTMAN_GUIDE.md](docs/POSTMAN_GUIDE.md) | JEDx API Postman guide |
| [server/README.md](server/README.md) | Server documentation |

## 🤝 Contributing

This is a demo implementation. Feel free to:

- Add more endpoints
- Implement real database persistence
- Enhance matching algorithms
- Add authentication
- Improve error handling

## ⚠️ Security Notes

**This is a DEMO server:**

- ❌ No authentication
- ❌ In-memory storage (data lost on restart)
- ❌ No input validation
- ❌ CORS open to all origins

**For production, add:**

- ✅ JWT/OAuth authentication
- ✅ Database (PostgreSQL, MongoDB)
- ✅ Input validation & sanitization
- ✅ Rate limiting
- ✅ Restricted CORS
- ✅ HTTPS only

## 📊 Sample Data Summary

**Loaded on startup:**

- **Jobs**: 1 (Senior Software Engineer with Go, PostgreSQL, AWS skills)
- **Skills**: 15+ unique skills
- **Assertions**: 8 skill assertions for employee
- **Workers**: 10 workers from Arkansas state agency
- **Organizations**: 1 organization
- **Badges**: 1 AWS Cloud Architect certification
- **Proficiency Scales**: 5-level scale (Novice → Expert)

## 🔗 Resources

- **HR Open Standards**: https://www.hropenstandards.org/
- **IMS Global Open Badges**: https://openbadges.org/
- **Credential Engine**: https://credentialengine.org/
- **W3C Verifiable Credentials**: https://www.w3.org/TR/vc-data-model/
- **Schema.org**: https://schema.org/

## 📄 License

MIT License - Free for demo, educational, and commercial use.

## 💡 Questions?

1. Check [DEMO_SERVER_QUICKSTART.md](docs/DEMO_SERVER_QUICKSTART.md)
2. Review sample data in `/sample-data`
3. Test with Postman collections
4. Check server logs for errors

---

**Version**: 1.0.0
**Last Updated**: 2026-02-03
**Node Version**: 16+
**Standards**: HR Open JEDx, IMS Global OB v3.0, W3C VC, JSON-LD 1.1
