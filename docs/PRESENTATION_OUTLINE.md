# Presentation Outline: JEDx & Skills API Demo

Use this outline for meetings, presentations, or walkthroughs.

---

## 🎯 Opening (30 seconds)

**"We've built a REST API with CRUD operations that shows job attributes AND required skills using industry standards."**

**Key Message:**
- Not just specs - working implementation
- You can test it right now
- Built on JEDx and IMS Global standards

---

## 📊 Slide 1: The Problem We're Solving (1 minute)

**Traditional job postings:**
- Job attributes (title, duties) in one system
- Required skills in another system (or not captured)
- No standard format
- Hard to match candidates
- Can't track skill gaps

**Our Solution:**
- Single Job ID connects both
- Standardized format
- Skills with proficiency levels
- Ready for AI/matching algorithms

---

## 📊 Slide 2: What We Built (1 minute)

**REST API with:**
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Job attributes endpoint
- ✅ Job skills endpoint
- ✅ Combined payloads
- ✅ 10+ real examples
- ✅ Industry standard formats

**Technologies:**
- Node.js/Express server
- JSON-LD payloads
- JEDx format (workforce data)
- IMS Global Open Badges v3.0 (skills)

---

## 📊 Slide 3: Live Demo - Part 1 (2 minutes)

**SCREEN SHARE: Postman or Browser**

### Show Job Attributes
```
GET /api/v1/jedx/jobs/SWE-001
```

**Point out:**
- Standard job fields (title, department, duties)
- SOC codes for occupational classification
- Organization references

### Show Job Skills
```
GET /api/v1/jedx/jobs/SWE-001/skills
```

**Point out:**
- Same Job ID (`SWE-001`)
- Skills: Go, PostgreSQL, AWS
- Proficiency levels: Advanced (4), Intermediate (3), Novice (2)
- Links to skill definitions

**Key Message:** "Same job, two views - attributes and skills connected by ID."

---

## 📊 Slide 4: Live Demo - Part 2 (2 minutes)

**SCREEN SHARE: Postman**

### Show CRUD Operations

**1. Read (just did this)**
```
GET /jobs/SWE-001
```

**2. Create**
```
POST /jobs
{
  "job": {
    "jobId": "DEVOPS-001",
    "title": "DevOps Engineer",
    "department": "Engineering"
  }
}
```
**Show response with RefId**

**3. Update**
```
PUT /jobs/SWE-001
{
  "job": {
    "jobDuties": "Updated duties..."
  }
}
```

**4. Delete**
```
DELETE /jobs/DEVOPS-001
```

**Key Message:** "Full lifecycle management - create, read, update, delete all working."

---

## 📊 Slide 5: Payload Examples (1 minute)

**SCREEN SHARE: VS Code or File Explorer**

**Show directory:** `/sample-data/`

**Highlight files:**
- `job-skills-architecture.json` ← Job with skills
- `person-skills-profile.json` ← Employee with 8 skills
- `course-skills-assertions.json` ← Course outcomes
- `open-badge-credential.json` ← Skills credential

**Open one file:** `job-skills-architecture.json`

**Point out structure:**
```json
{
  "job": {
    "jobId": "SWE-001",
    "title": "Senior Software Engineer",
    "skills": {
      "assertions": [
        {
          "skill": { "name": "Go Programming" },
          "proficiencyLevel": { "name": "Advanced", "rank": 4 }
        }
      ]
    }
  }
}
```

**Key Message:** "Real, valid payloads - not pseudo-code. This is what the API sends and receives."

---

## 📊 Slide 6: Standards Compliance (1 minute)

**Why this matters:**
- Not inventing our own format
- Built on industry standards
- Interoperable with other systems
- Future-proof

**Standards Used:**

| Standard | What It Covers | Why We Use It |
|----------|----------------|---------------|
| **REST** | API architecture | Universal understanding |
| **JEDx** | Workforce data | State labor exchange format |
| **IMS Global OB v3.0** | Skills & credentials | Education/workforce standard |
| **Schema.org** | Vocabulary | SEO & linked data |
| **JSON-LD** | Data format | Machine-readable context |

**Key Message:** "We're using established standards, making this compatible with other systems."

---

## 📊 Slide 7: Architecture Overview (1 minute)

**SHOW DIAGRAM (or describe):**

```
┌─────────────────┐
│   Client        │
│  (Postman/App)  │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────────────────┐
│   Express Server            │
│   ┌─────────────────────┐   │
│   │  JEDx API           │   │
│   │  /api/v1/jedx       │   │
│   │  - Jobs CRUD        │   │
│   │  - Workers CRUD     │   │
│   │  - Organizations    │   │
│   └─────────────────────┘   │
│   ┌─────────────────────┐   │
│   │  Skills API         │   │
│   │  /api/v1/skills     │   │
│   │  - Skill assertions │   │
│   │  - Proficiency      │   │
│   │  - Analytics        │   │
│   └─────────────────────┘   │
└─────────────────────────────┘
         │
         │ Loads from
         │
┌────────▼────────────────────┐
│   Sample Data (JSON)        │
│   - Jobs                    │
│   - Workers                 │
│   - Skills                  │
│   - Credentials             │
└─────────────────────────────┘
```

**Key Message:** "Simple, clean architecture. Server loads sample data and exposes REST endpoints."

---

## 📊 Slide 8: What You Can Do With This (1 minute)

**Use Cases Enabled:**

**1. Skills-Based Hiring**
- Compare job requirements to candidate skills
- Quantify skill gaps
- Auto-match candidates

**2. Internal Mobility**
- Find employees qualified for open roles
- Identify development opportunities
- Career pathing based on skills

**3. Workforce Analytics**
- Skills inventory across organization
- Identify critical skill shortages
- Training ROI measurement

**4. Credential Verification**
- Issue digital badges for skills
- Verify achievements
- Portable credentials

**5. Course-Job Alignment**
- Map learning outcomes to job requirements
- Show which courses develop needed skills
- Education-workforce pipeline

**Key Message:** "This isn't just about job postings - it enables a whole ecosystem of skills-based applications."

---

## 📊 Slide 9: Try It Yourself (1 minute)

**Three Ways to Test:**

**1. Live Server (Easiest)**
```
https://your-app.onrender.com
```

**2. Local Server**
```bash
git clone [repo]
cd server
npm install && npm start
# Visit http://localhost:3000
```

**3. Postman Collection**
- Import `JEDx_API.postman_collection.json`
- Select environment (Local or Production)
- Send any request

**Recommended First Steps:**
1. `GET /jobs/SWE-001` - See a job
2. `GET /jobs/SWE-001/skills` - See its skills
3. Look at `sample-data/job-skills-architecture.json`

---

## 📊 Slide 10: Documentation Provided (1 minute)

**For Developers:**
- `DEMO_SERVER_QUICKSTART.md` - Setup in 5 minutes
- `SKILLS_API_GUIDE.md` - Complete API reference
- `POSTMAN_GUIDE.md` - Collection documentation
- OpenAPI specs (future)

**For Stakeholders:**
- `ONE_PAGER.md` - Quick overview
- `DEMO_WALKTHROUGH.md` - Detailed demo script
- Sample data files with comments

**For Integration:**
- JSON schemas
- Postman collections
- Sample payloads
- Working server code

**Key Message:** "Everything documented - technical and non-technical audiences covered."

---

## 🎬 Closing (1 minute)

**What We've Delivered:**
✅ Working REST API with CRUD operations
✅ Job attributes and skills connected
✅ 10+ real payload examples
✅ Industry standard formats
✅ Ready to test right now
✅ Complete documentation

**Requirements Met:**
✅ "Define payload and endpoints (REST)" - Documented + implemented
✅ "CRUD" - All operations working
✅ "Show payloads examples" - 10+ files in sample-data
✅ "Job ID shows attributes and skills" - Same ID, two endpoints

**Next Steps:**
1. Test the API (Postman or browser)
2. Review payload examples
3. Ask questions
4. Discuss integration points

**Questions?**

---

## 💡 Backup Slides (If Needed)

### Backup: Technical Stack Details

**Server:**
- Node.js 18+
- Express.js web framework
- UUID for ID generation
- In-memory storage (demo mode)
- Can connect to database

**Data Formats:**
- JSON (primary)
- JSON-LD for linked data
- HTTP/REST for transport

**Deployment:**
- Local: `npm start`
- Production: Render.com (or any Node host)
- Docker-ready (future)

### Backup: Proficiency Scale Detail

**4-Level Proficiency Scale:**
1. **Fundamental (1)** - Basic knowledge
2. **Novice (2)** - Working with guidance
3. **Intermediate (3)** - Routine independence
4. **Advanced (4)** - Complex contexts

**Previously used 5-level, now standardized on 4-level.**

### Backup: JSON-LD Context

**Why JSON-LD?**
- Adds meaning to data
- Enables linked data
- Makes data self-describing
- Compatible with regular JSON

**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "Skill",
  "name": "Go Programming"
}
```

The `@context` tells machines how to interpret the data.

### Backup: Sample Data Statistics

**Loaded automatically on server start:**
- 15+ unique skills
- 1 job with full skills architecture
- 8 skill assertions for employee-45678
- 10 workers from state agency
- 1 organization
- 1 digital badge/credential
- 1 course with skill outcomes

**All real, valid data following standards.**

---

## 📋 Presenter Checklist

**Before Presentation:**
- [ ] Server running (local or production URL ready)
- [ ] Postman open with collections imported
- [ ] Browser tabs: localhost:3000 and sample-data folder
- [ ] Screen sharing tested
- [ ] Backup: Screenshots if demo fails

**During Presentation:**
- [ ] Speak to the problem first (why this matters)
- [ ] Show working examples (not just code)
- [ ] Point out standards compliance
- [ ] Emphasize "you can test this now"
- [ ] Have URL ready to share

**After Presentation:**
- [ ] Share GitHub repo or documentation
- [ ] Send Postman collection
- [ ] Provide test URL
- [ ] Follow up on questions

---

## 🎤 Talking Points Cheat Sheet

**If asked: "Is this just a prototype?"**
→ "This is a working implementation with real endpoints, real data, and industry-standard formats. You can test it right now."

**If asked: "What standards are you using?"**
→ "JEDx for workforce data exchange and IMS Global Open Badges v3.0 for skills and credentials - both industry standards."

**If asked: "Can I see a real example?"**
→ [Open sample-data/job-skills-architecture.json] "Here's a complete payload showing a job with its required skills."

**If asked: "How do you connect jobs to skills?"**
→ "Same Job ID (like SWE-001) works with both endpoints: /jobs/SWE-001 for attributes, /jobs/SWE-001/skills for required skills."

**If asked: "Where are the CRUD operations?"**
→ [Open Postman] "Here - GET, POST, PUT, DELETE all implemented for jobs, workers, and skills."

**If asked: "Can we integrate this with our system?"**
→ "Yes - it's REST with JSON payloads. Any system that can make HTTP requests can integrate. Standards-based for interoperability."

---

**Good luck with your presentation! 🚀**
