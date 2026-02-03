# API Demo Walkthrough

A step-by-step guide to demonstrate the JEDx & Skills API implementation.

## 🎯 What We're Showing

We've implemented **REST endpoints with CRUD operations** that show **Job attributes AND associated skills** using standardized formats (JEDx + IMS Global Open Badges).

---

## 📍 Phase 1: Single Job Example (Start Here)

### The Simplest Demo

**Goal:** Show ONE job with its attributes and skills.

**Job:** Senior Software Engineer (SWE-001)

### Step 1: Get Job Details

**Request:**
```http
GET /api/v1/jedx/jobs/SWE-001
```

**What You'll See:**
```json
{
  "job": {
    "jobId": "SWE-001",
    "title": "Senior Software Engineer",
    "department": "Engineering",
    "jobDuties": "Design and implement scalable backend services..."
  }
}
```

**Key Point:** ✅ Job attributes defined with proper structure

### Step 2: Get Job Skills

**Request:**
```http
GET /api/v1/jedx/jobs/SWE-001/skills
```

**What You'll See:**
```json
{
  "targetType": "JobPosting",
  "targetName": "Senior Software Engineer",
  "assertions": [
    {
      "skill": {
        "name": "Go Programming Language",
        "codedNotation": "GO"
      },
      "proficiencyLevel": {
        "name": "Advanced",
        "rank": 4
      },
      "proficiencyScale": "https://techcorp.example.com/proficiency-scales/4-level"
    }
  ]
}
```

**Key Point:** ✅ Same Job ID now shows required skills with proficiency levels

### Step 3: See Combined View

**File:** `sample-data/job-skills-architecture.json`

This shows how job attributes and skills are connected in a single payload.

**Key Point:** ✅ Complete payload example showing both together

---

## 📍 Phase 2: CRUD Operations

Now show we can **Create, Read, Update, Delete** jobs.

### Read (We Just Did This)
```http
GET /api/v1/jedx/jobs/SWE-001
```
✅ Shows existing job

### Create New Job
```http
POST /api/v1/jedx/jobs
Content-Type: application/json

{
  "job": {
    "organizationId": "TechCorp-2026",
    "jobId": "DEVOPS-001",
    "title": "DevOps Engineer",
    "department": "Engineering",
    "jobDuties": "Build and maintain CI/CD pipelines"
  }
}
```
✅ Creates new job, returns with RefId

### Update Existing Job
```http
PUT /api/v1/jedx/jobs/SWE-001
Content-Type: application/json

{
  "job": {
    "jobId": "SWE-001",
    "title": "Senior Software Engineer",
    "jobDuties": "Updated duties: Lead backend team..."
  }
}
```
✅ Updates job attributes

### Delete Job
```http
DELETE /api/v1/jedx/jobs/DEVOPS-001
```
✅ Removes job

**Key Point:** ✅ Full CRUD lifecycle implemented

---

## 📍 Phase 3: Skills API Integration

Show how skills work across **Jobs, People, Courses**.

### Skills for Different Targets

**1. Job Skills:**
```http
GET /api/v1/jedx/jobs/SWE-001/skills
```
→ Required skills for a job

**2. Person Skills:**
```http
GET /api/v1/skills/assertions?personId=employee-45678
```
→ Skills a person has

**3. Course Skills:**
See `sample-data/course-skills-assertions.json`
→ Skills taught in a course

**Key Point:** ✅ Same skills model works everywhere

---

## 📍 Phase 4: Payload Examples

Show we have **real, valid examples** for everything.

### Sample Data Files

| File | What It Shows |
|------|---------------|
| `job-skills-architecture.json` | Job with embedded skills |
| `person-skills-profile.json` | Employee with 8 skill assertions |
| `course-skills-assertions.json` | Course with skill outcomes |
| `open-badge-credential.json` | Skills credential/badge |

**Key Point:** ✅ Multiple real-world payload examples

### Interactive Testing

**Option 1: Postman**
1. Import `JEDx_API.postman_collection.json`
2. Select environment (Local or Production)
3. Click any request → Send
4. See live response

**Option 2: Live Server**
```bash
# Local
npm start
# Visit: http://localhost:3000

# Production
https://your-app.onrender.com
```

**Key Point:** ✅ Working implementation you can test now

---

## 📍 Phase 5: Standards Compliance

Show we're using **industry standards**, not making it up.

### REST Standards
✅ Standard HTTP methods (GET, POST, PUT, DELETE)
✅ Proper status codes (200, 201, 404)
✅ JSON payloads with Content-Type headers

### Data Standards
✅ **JEDx** format for jobs/workers/organizations
✅ **IMS Global Open Badges v3.0** for skills
✅ **JSON-LD** with proper @context
✅ **Schema.org** vocabulary where applicable

### Example Context:
```json
{
  "@context": [
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
    "https://schema.org"
  ]
}
```

**Key Point:** ✅ Built on recognized standards, not custom format

---

## 🎬 Demo Script (Copy-Paste)

Use this exact sequence when presenting:

### 1. Start Server (30 seconds)
```bash
cd server
npm start
# Server running on http://localhost:3000
```

### 2. Show Job (30 seconds)
```bash
# In browser or Postman:
GET http://localhost:3000/api/v1/jedx/jobs/SWE-001
```
**Say:** "Here's a job with standard attributes like title, department, duties."

### 3. Show Skills for Same Job (30 seconds)
```bash
GET http://localhost:3000/api/v1/jedx/jobs/SWE-001/skills
```
**Say:** "Same job ID, now showing required skills with proficiency levels using IMS Global standards."

### 4. Show Payload Example (30 seconds)
**Open:** `sample-data/job-skills-architecture.json`

**Say:** "Here's the complete payload showing both together. This is the format we send/receive."

### 5. Show CRUD (1 minute)
**In Postman:**
- GET all jobs
- POST create new job
- PUT update job
- DELETE remove job

**Say:** "Full CRUD operations implemented. Create, read, update, delete all working."

### 6. Show Person Skills (30 seconds)
```bash
GET http://localhost:3000/api/v1/skills/assertions?personId=employee-45678
```
**Say:** "Same skills model works for people, jobs, courses - consistent across use cases."

**Total: 3.5 minutes**

---

## 📦 What to Share

### Minimum Package:
1. **This walkthrough document** ← You're reading it
2. **Postman collection** (`JEDx_API.postman_collection.json`)
3. **One sample file** (`job-skills-architecture.json`)
4. **Live URL** (if deployed to Render)

### Complete Package:
- All documentation in `/docs/`
- All sample data in `/sample-data/`
- Both Postman collections
- Server code in `/server/`
- Instructions in `DEMO_SERVER_QUICKSTART.md`

---

## 💡 Talking Points

When explaining, emphasize:

1. **"Job ID shows attributes AND skills"**
   - Same identifier (`SWE-001`)
   - Two endpoints: one for job, one for skills
   - Can be combined in single payload

2. **"REST with CRUD"**
   - Standard HTTP methods
   - Predictable URLs
   - Proper error handling

3. **"Real payload examples"**
   - Not just specs, actual working JSON
   - Can test immediately
   - Based on industry standards

4. **"Industry standards"**
   - JEDx for workforce data
   - IMS Global for skills/credentials
   - Schema.org vocabularies
   - JSON-LD for linked data

---

## 🚀 Quick Start for Reviewers

**To verify everything works:**

```bash
# 1. Clone repo
git clone [your-repo]

# 2. Install and start
cd server
npm install
npm start

# 3. Test in browser
open http://localhost:3000/api/v1/jedx/jobs/SWE-001

# 4. Or use Postman
# Import JEDx_API.postman_collection.json
# Select "Local" environment
# Try any request
```

**That's it!** Everything should work immediately.

---

## ✅ Requirements Checklist

- [x] **Define REST endpoints** - Documented in Postman collections
- [x] **CRUD operations** - All four operations implemented
- [x] **Payload examples** - 10+ sample JSON files
- [x] **Job ID** - `SWE-001` and others defined
- [x] **Job attributes** - Title, department, duties, etc.
- [x] **Job skills** - Skills with proficiency levels
- [x] **Combined view** - Both in single payload possible
- [x] **Working implementation** - Server runs and responds
- [x] **Industry standards** - JEDx + IMS Global compliance

**Status: ✅ COMPLETE**

---

## 📧 Email Template

Copy this when sharing:

```
Subject: JEDx & Skills API - Demo Ready

Hi [Name],

I've completed the REST API implementation with CRUD operations
showing job attributes and skills. Here's what's ready:

✅ REST endpoints defined (Postman collections included)
✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Job ID shows both attributes AND skills
✅ 10+ payload examples in standard formats
✅ Working server you can test now

Quick Start:
1. Live demo: [URL if deployed]
2. Or run locally: npm start
3. Import Postman collection to test all endpoints

Key Example:
- GET /api/v1/jedx/jobs/SWE-001 → Job attributes
- GET /api/v1/jedx/jobs/SWE-001/skills → Required skills

Documentation: See DEMO_WALKTHROUGH.md

Let me know if you'd like me to walk through it!

[Your name]
```

---

**You're ready to share!** Start with Phase 1, build up from there based on their questions.
