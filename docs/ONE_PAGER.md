# JEDx & Skills API - One Pager

**Status:** ✅ Complete and Ready to Demo

**Innovation:** Proposing JEDx extension to include machine-readable skills

---

## What We Built

REST API with CRUD operations that connects **Job attributes** with **required Skills** using industry standards.

## The Proof (3 Requests)

### 1. Get Job Attributes
```bash
GET /api/v1/jedx/jobs/SWE-001
```
**Returns:** Job title, department, duties, SOC codes

### 2. Get Job Skills
```bash
GET /api/v1/jedx/jobs/SWE-001/skills
```
**Returns:** Required skills with proficiency levels (Go, PostgreSQL, AWS)

### 3. See Combined Payload
**File:** `sample-data/job-skills-architecture.json`
**Shows:** Both in single JSON payload

---

## CRUD Operations ✅

| Operation | Endpoint | What It Does |
|-----------|----------|--------------|
| **C**reate | `POST /jobs` | Create new job |
| **R**ead | `GET /jobs/SWE-001` | Get job by ID |
| **U**pdate | `PUT /jobs/SWE-001` | Update job |
| **D**elete | `DELETE /jobs/SWE-001` | Remove job |

---

## Payload Examples ✅

- ✅ 10+ real JSON files in `/sample-data/`
- ✅ Jobs, Skills, People, Courses, Badges
- ✅ All follow industry standards (JEDx, 1EdTech)

---

## Try It Now

**Live Server:** [Your Render URL]

**Or Run Locally:**
```bash
cd server && npm install && npm start
# Visit: http://localhost:3000
```

**Test with Postman:**
Import `JEDx_API.postman_collection.json` → Send any request

---

## Standards Used

- ✅ **JEDx** - Workforce data exchange format
- ✅ **1EdTech Open Badges v3.0** - Skills & credentials
- ✅ **Schema.org** - Linked data vocabulary
- ✅ **REST** - Standard HTTP methods

---

## Key Innovation

**Same Job ID (`SWE-001`) can:**
1. Show traditional job posting data (title, duties)
2. Show required skills with proficiency levels
3. Compare to candidate skills
4. Match internal talent
5. Identify skill gaps

**All through standardized REST endpoints.**

---

## Files to Review

| Priority | File | What It Shows |
|----------|------|---------------|
| 🔥 High | `docs/DEMO_WALKTHROUGH.md` | Step-by-step demo guide |
| 🔥 High | `sample-data/job-skills-architecture.json` | Complete job+skills example |
| 🔥 High | `JEDx_API.postman_collection.json` | All endpoints ready to test |
| ⭐ Medium | `sample-data/person-skills-profile.json` | Employee skills example |
| ⭐ Medium | `docs/SKILLS_API_GUIDE.md` | Skills API documentation |

---

## Questions?

**Q: Is this just documentation?**
A: No - working server with real endpoints and data.

**Q: Can I test it?**
A: Yes - server runs locally or on Render. Postman collection included.

**Q: What standards does it follow?**
A: JEDx (workforce data) + 1EdTech Open Badges (skills/credentials).

**Q: Where are the payload examples?**
A: `/sample-data/` directory - 10+ real JSON files.

**Q: Does it show job attributes AND skills?**
A: Yes - same Job ID shows both via different endpoints or combined payload.

---

**Next Step:** Import Postman collection and try `GET /jobs/SWE-001` → See it work!
