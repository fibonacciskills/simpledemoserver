# Demo Server Quick Start Guide

Complete setup guide for running the JEDx & Skills API demo server locally and deploying to Render.com.

## 📦 What You Have

- ✅ **Demo Server** - Node.js/Express implementing both APIs
- ✅ **Sample Data** - Real JSON files automatically loaded
- ✅ **Postman Collections** - Updated to work with demo server
- ✅ **Environment Files** - Local and production configs
- ✅ **Deploy Config** - Ready for Render.com

## 🚀 Option 1: Run Locally (5 minutes)

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Start Server

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════╗
║   JEDx & Skills API Demo Server          ║
║   Server running on: http://localhost:3000║
╚═══════════════════════════════════════════╝
```

### Step 3: Test It

Open browser to: `http://localhost:3000`

You should see API info with available endpoints.

### Step 4: Import Postman Collections

1. Open Postman
2. Click **Import**
3. Import these files:
   - `JEDx_API.postman_collection.json`
   - `Skills_API.postman_collection.json`
   - `Postman_Environment_Local.json`

### Step 5: Select Environment

In Postman:
1. Click the environment dropdown (top right)
2. Select **"JEDx & Skills API - Local"**

### Step 6: Test Requests

Try these in Postman:

**Get API Info:**
```
GET http://localhost:3000/
```

**List All Skills:**
```
GET {{skills_base_url}}/skills
```

**Get Person Skills:**
```
GET {{skills_base_url}}/assertions?personId=employee-45678&currentOnly=true
```

**List Jobs:**
```
GET {{jedx_base_url}}/jobs
```

**Get Job Details:**
```
GET {{jedx_base_url}}/jobs/SWE-001
```

**Get Job Skills:**
```
GET {{jedx_base_url}}/jobs/SWE-001/skills
```

## ☁️ Option 2: Deploy to Render.com (10 minutes)

### Prerequisites

- GitHub account
- Render.com account (free tier available)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Add JEDx & Skills API demo server"

# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub account
4. Select your repository
5. Render will detect `render.yaml` automatically
6. Click **Deploy Web Service**

**Or use the Deploy Button:**

Add this to your README.md:
```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
```

### Step 3: Wait for Deployment

Render will:
- Install dependencies (`npm install`)
- Start server (`npm start`)
- Assign a URL like: `https://your-app-name.onrender.com`

Takes ~2-3 minutes.

### Step 4: Test Production URL

Open: `https://your-app-name.onrender.com`

You should see the API info page.

### Step 5: Update Postman Environment

1. Import `Postman_Environment_Production.json`
2. Edit the environment
3. Replace `your-app-name` with your actual Render URL:
   ```
   jedx_base_url: https://YOUR-APP.onrender.com/api/v1/jedx
   skills_base_url: https://YOUR-APP.onrender.com/api/v1/skills
   ```
4. Save

### Step 6: Test Production

Select the **Production** environment in Postman and run the same requests!

## 📊 What Data is Loaded?

The server automatically loads from `/sample-data/`:

### Jobs
- ✅ 1 job (SWE-001 Senior Software Engineer)
- From: `job-skills-architecture.json`

### Skills
- ✅ 15+ unique skills
- From: `person-skills-profile.json`, `course-skills-assertions.json`, `open-badge-credential.json`

### Assertions
- ✅ 8 skill assertions for employee-45678
- From: `person-skills-profile.json`

### Workers
- ✅ 10 workers from Arkansas state agency
- From: `stateAgencyArkansas_4034/worker*.json`

### Organizations
- ✅ 1 organization
- From: `stateAgencyArkansas_4034/organization.json`

### Badges/Credentials
- ✅ 1 AWS Cloud Architect badge
- From: `open-badge-credential.json`

## 🧪 Demo Scenarios

### Scenario 1: Skills-Based Hiring

```
1. GET {{jedx_base_url}}/jobs/SWE-001
   → See job details

2. GET {{jedx_base_url}}/jobs/SWE-001/skills
   → See required skills (Go, PostgreSQL, AWS)

3. GET {{skills_base_url}}/assertions?personId=employee-45678
   → See candidate's skills

4. POST {{skills_base_url}}/jedx/match
   Body: {
     "candidateId": "employee-45678",
     "jobId": "SWE-001"
   }
   → Get match score and gaps
```

### Scenario 2: Workforce Analytics

```
1. GET {{skills_base_url}}/analytics/skills-inventory?department=Engineering
   → See skills distribution

2. POST {{skills_base_url}}/analytics/gap-analysis
   Body: {
     "targetRole": { "@id": "SWE-001" },
     "currentPopulation": { "department": "Engineering" }
   }
   → Identify gaps
```

### Scenario 3: Add Your Own Data

**Create a new skill:**
```
POST {{skills_base_url}}/skills
Body: {
  "@context": "https://schema.org",
  "@type": "Skill",
  "name": "Kubernetes",
  "codedNotation": "K8S",
  "skillCategory": "Technical"
}
```

**Create a new job:**
```
POST {{jedx_base_url}}/jobs
Body: {
  "job": {
    "organizationId": "TechCorp-2026",
    "jobId": "DEVOPS-001",
    "title": "DevOps Engineer",
    "jobDuties": "Build and maintain CI/CD pipelines",
    "department": "Engineering"
  }
}
```

**Create skill assertion:**
```
POST {{skills_base_url}}/assertions
Body: {
  "@context": [
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
    "https://schema.org"
  ],
  "@type": "SkillAssertion",
  "skill": { "@id": "https://api.hropen.org/skills/K8S" },
  "about": { "@id": "https://organization.example.com/people/employee-45678" },
  "proficiencyLevel": {
    "@id": "https://organization.example.com/proficiency-scales/4-level/3"
  },
  "validFrom": "2026-02-03T00:00:00Z",
  "validUntil": "2028-02-03T00:00:00Z"
}
```

## 🔧 Troubleshooting

### Server Won't Start

**Error: "Cannot find module 'express'"**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 3000 already in use"**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Postman Errors

**Error: "Could not get response"**
- Check server is running: `http://localhost:3000`
- Verify environment is selected (top right in Postman)
- Check `jedx_base_url` and `skills_base_url` variables

**Error: "404 Not Found"**
- Ensure URL includes `/api/v1/jedx` or `/api/v1/skills`
- Example: `http://localhost:3000/api/v1/jedx/jobs` (NOT `/jobs`)

### Render Deployment Issues

**Build Failed**
- Check `package.json` is in `server/` directory
- Verify Node version in `package.json` engines
- Check Render build logs

**503 Service Unavailable**
- Wait 2-3 minutes for first deploy
- Check Render logs for errors
- Free tier may take longer to start

## 📚 Next Steps

### Customize the Server

Edit `server/routes/jedx.js` or `server/routes/skills.js` to:
- Add more endpoints
- Implement real business logic
- Add database persistence
- Enhance matching algorithms

### Add More Sample Data

Create JSON files in `/sample-data/`:
- More jobs
- More workers
- More skills
- More credentials

Server will auto-load on restart.

### Connect to Real Database

Replace in-memory storage with PostgreSQL:
1. Install `pg` package
2. Update routes to query database
3. Add connection in `server.js`

### Add Authentication

1. Install `jsonwebtoken`
2. Add auth middleware
3. Protect endpoints
4. Validate tokens

## 📖 Documentation

- **Server README**: `server/README.md`
- **Skills API Guide**: `SKILLS_API_GUIDE.md`
- **JEDx Guide**: `POSTMAN_GUIDE.md`
- **Examples**: `SKILLS_API_EXAMPLES.md`

## 💡 Tips

- **Auto-reload during development**: `npm install -g nodemon && npm run dev`
- **Test with curl**: `curl http://localhost:3000/health`
- **View logs**: Check terminal where server is running
- **Reset data**: Restart server (in-memory storage resets)

## 🎯 Success Checklist

- [ ] Server starts locally without errors
- [ ] Can access `http://localhost:3000` in browser
- [ ] Postman collections imported
- [ ] Local environment selected in Postman
- [ ] Can list skills via Postman
- [ ] Can list jobs via Postman
- [ ] Can get person skills profile
- [ ] (Optional) Deployed to Render.com
- [ ] (Optional) Production environment configured

---

**You're all set!** 🎉

Start making requests and exploring the demo APIs. The server is production-ready and can be extended with your own logic and data.

**Questions?** Check the server logs or README files for more details.
