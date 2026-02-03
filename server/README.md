# JEDx & Skills API Demo Server

Production-ready demo server implementing **HR Open JEDx API** and **Skills Data API** with real sample data.

## 🚀 Quick Start

### Local Development

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:3000`

### Deploy to Render.com

1. Push this repo to GitHub
2. Go to [Render.com](https://render.com)
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Render will auto-detect `render.yaml` and deploy

**Or use this button:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 📚 API Documentation

### Base URLs

- **Local**: `http://localhost:3000`
- **Production**: `https://your-app.onrender.com`

### Available APIs

#### 1. **JEDx API** - `/api/v1/jedx`

Job Exchange Data API for employment data.

**Endpoints:**

```
# Jobs
GET    /api/v1/jedx/jobs
GET    /api/v1/jedx/jobs/:jobId
POST   /api/v1/jedx/jobs
PUT    /api/v1/jedx/jobs/:jobId
DELETE /api/v1/jedx/jobs/:jobId
GET    /api/v1/jedx/jobs/:jobId/skills

# Workers
GET    /api/v1/jedx/workers
GET    /api/v1/jedx/workers/:workerId
POST   /api/v1/jedx/workers

# Organizations
GET    /api/v1/jedx/organizations
GET    /api/v1/jedx/organizations/:orgId
POST   /api/v1/jedx/organizations

# Documentation
GET    /api/v1/jedx/docs
```

#### 2. **Skills API** - `/api/v1/skills`

Skills-based workflows and talent optimization.

**Endpoints:**

```
# Skills
GET    /api/v1/skills
GET    /api/v1/skills/:skillId
POST   /api/v1/skills
GET    /api/v1/skills/search

# Skill Assertions
GET    /api/v1/assertions?personId=:id
POST   /api/v1/assertions
GET    /api/v1/assertions/:assertionId

# Proficiency Scales
GET    /api/v1/proficiency-scales
GET    /api/v1/proficiency-scales/:scaleId

# Assessment Integration
POST   /api/v1/assessments/map-to-proficiency
POST   /api/v1/assessments/create-assertion

# Workforce Analytics
GET    /api/v1/analytics/skills-inventory
POST   /api/v1/analytics/gap-analysis
POST   /api/v1/analytics/mobility-candidates

# JEDx Integration
GET    /api/v1/skills/jedx/jobs/:jobId/skills
POST   /api/v1/skills/jedx/match

# Credentials & Badges
POST   /api/v1/credentials/badges
GET    /api/v1/credentials

# Taxonomies
GET    /api/v1/taxonomies
POST   /api/v1/taxonomies/map

# Documentation
GET    /api/v1/skills/docs
```

### Other Endpoints

```
GET    /                      # API info
GET    /health                # Health check
GET    /api/v1/sample-data    # List sample files
GET    /api/v1/sample-data/:filename  # Get sample file
```

## 📦 Sample Data

The server automatically loads sample data from `/sample-data/`:

- ✅ `job-skills-architecture.json` - Job with embedded skills
- ✅ `person-skills-profile.json` - Employee skills inventory
- ✅ `course-skills-assertions.json` - Course learning outcomes
- ✅ `open-badge-credential.json` - Skills badge
- ✅ `comprehensive-learner-record.json` - Complete CLR
- ✅ Workers and organizations from `stateAgencyArkansas_4034/`

**Data loaded on startup:**
- Jobs: 1+
- Workers: 10+
- Organizations: 1+
- Skills: 15+
- Skill Assertions: 8+
- Proficiency Scales: 1

## 🧪 Testing with Postman

### Import Collections

1. Import `JEDx_API.postman_collection.json`
2. Import `Skills_API.postman_collection.json`

### Configure Environment

Create a Postman environment with:

```json
{
  "jedx_base_url": "http://localhost:3000/api/v1/jedx",
  "skills_base_url": "http://localhost:3000/api/v1/skills",
  "api_token": "demo-token"
}
```

For production, change to:
```json
{
  "jedx_base_url": "https://your-app.onrender.com/api/v1/jedx",
  "skills_base_url": "https://your-app.onrender.com/api/v1/skills"
}
```

### Try These Requests

**1. Get API Info**
```
GET http://localhost:3000/
```

**2. List All Skills**
```
GET http://localhost:3000/api/v1/skills
```

**3. Get Person Skills Profile**
```
GET http://localhost:3000/api/v1/assertions?personId=employee-45678&currentOnly=true
```

**4. Get Job Skills**
```
GET http://localhost:3000/api/v1/jedx/jobs/SWE-001/skills
```

**5. Create New Skill**
```
POST http://localhost:3000/api/v1/skills
Content-Type: application/ld+json

{
  "@context": "https://schema.org",
  "@type": "Skill",
  "name": "Kubernetes",
  "codedNotation": "K8S",
  "skillCategory": "Technical"
}
```

## 🔧 Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### CORS

CORS is enabled for all origins. In production, you may want to restrict this:

```javascript
// server.js
app.use(cors({
  origin: ['https://your-frontend.com']
}));
```

## 🏗️ Architecture

### Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Data**: In-memory (resets on restart)
- **Format**: JSON-LD 1.1

### Directory Structure

```
server/
├── server.js           # Main server
├── package.json        # Dependencies
├── render.yaml         # Render.com config
├── routes/
│   ├── jedx.js        # JEDx API routes
│   └── skills.js      # Skills API routes
└── README.md          # This file
```

### Data Flow

```
Sample JSON Files → Load on Startup → In-Memory Storage
                                            ↓
Client Request → Express Router → Route Handler → Response
```

## 🎯 Use Cases

### 1. **Skills-Based Hiring Demo**

```bash
# Define job requirements
PUT /api/v1/jedx/jobs/SWE-001/skills

# Assess candidate
POST /api/v1/assessments/map-to-proficiency

# Create skill assertion
POST /api/v1/assertions

# Match candidate to job
POST /api/v1/skills/jedx/match
```

### 2. **Workforce Analytics Demo**

```bash
# Get skills inventory
GET /api/v1/analytics/skills-inventory?department=Engineering

# Analyze gaps
POST /api/v1/analytics/gap-analysis

# Find mobility candidates
POST /api/v1/analytics/mobility-candidates
```

### 3. **Credentials Demo**

```bash
# Issue Open Badge
POST /api/v1/credentials/badges

# Get learner credentials
GET /api/v1/credentials?personId=employee-45678
```

## 📝 Adding Your Own Data

### Option 1: API Requests

Use POST endpoints to add data dynamically:

```bash
curl -X POST http://localhost:3000/api/v1/skills \
  -H "Content-Type: application/ld+json" \
  -d '{
    "@type": "Skill",
    "name": "React",
    "codedNotation": "REACT"
  }'
```

### Option 2: Sample Files

Add JSON files to `/sample-data/` and restart server.

## 🐛 Troubleshooting

### Server won't start

```bash
# Check Node version (need 16+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

Enable CORS in `server.js` (already done by default).

### Data not loading

Check console output on startup:
```
✓ Loaded job-skills-architecture.json
✓ Loaded 10 workers
✓ Loaded organization data
```

## 🔐 Security Notes

**⚠️ This is a DEMO server**

- No authentication (accept any token)
- In-memory storage (data lost on restart)
- No input validation
- CORS open to all origins

**For production:**
- Add proper authentication (JWT, OAuth)
- Use real database (PostgreSQL, MongoDB)
- Add input validation & sanitization
- Restrict CORS origins
- Add rate limiting
- Enable HTTPS only

## 📊 Performance

- **Response time**: < 50ms (local)
- **Concurrent requests**: 100+
- **Data capacity**: ~1000 records in-memory
- **Startup time**: ~1 second

## 🚢 Deployment Options

### Render.com (Recommended)

✅ Free tier available
✅ Auto-deploy from GitHub
✅ HTTPS included
✅ Custom domains

### Alternatives

- **Heroku**: `heroku create && git push heroku main`
- **Railway**: Import GitHub repo
- **Vercel**: Deploy as serverless function
- **AWS**: Deploy to EC2 or Lambda
- **Docker**: `docker build -t jedx-api . && docker run -p 3000:3000 jedx-api`

## 📈 Roadmap

- [ ] Add database persistence (PostgreSQL)
- [ ] Implement authentication (JWT)
- [ ] Add GraphQL endpoint
- [ ] OpenAPI/Swagger documentation
- [ ] Admin dashboard
- [ ] Real-time updates (WebSockets)
- [ ] Export data (CSV, JSON)
- [ ] Import bulk data

## 📄 License

MIT License - Free for demo and educational use

## 🤝 Contributing

This is a demo server. Feel free to:
- Add more endpoints
- Improve matching algorithms
- Add real database
- Enhance error handling

## 📚 Resources

- **HR Open Standards**: https://www.hropenstandards.org/
- **IMS Global Open Badges**: https://openbadges.org/
- **Skills API Guide**: See `SKILLS_API_GUIDE.md`
- **JEDx Guide**: See `POSTMAN_GUIDE.md`

## 💡 Support

For issues:
1. Check `/health` endpoint
2. Review console logs
3. Verify sample data files exist
4. Test with Postman collections

---

**Server Version**: 1.0.0
**Last Updated**: 2026-02-03
**Node Version**: 16+
