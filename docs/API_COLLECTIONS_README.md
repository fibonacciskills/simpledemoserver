# JEDx & Skills API - Postman Collections

## Overview

This repository contains comprehensive Postman collections for the **HR Open Standards** ecosystem, including:

1. **JEDx API** - Job Exchange Data API
2. **Skills Data API** - HR Open Skills Data Workgroup specification

These collections enable skills-based hiring, workforce transformation, and talent optimization using open, interoperable standards.

---

## 📦 What's Included

### Postman Collections

| File | Description | Endpoints | Version |
|------|-------------|-----------|---------|
| `JEDx_API.postman_collection.json` | Job, Worker, Organization, and Report management | 28 | v1.0.0 |
| `Skills_API.postman_collection.json` | Skills, Assertions, Proficiency, and Analytics | 35+ | v1.0.0 |

### Documentation

| File | Description |
|------|-------------|
| `POSTMAN_GUIDE.md` | Guide for JEDx API collection |
| `SKILLS_API_GUIDE.md` | Comprehensive guide for Skills API with workflows |
| `API_COLLECTIONS_README.md` | This overview document |

### Sample Data

| File | Description |
|------|-------------|
| `sample-data/job-skills-architecture.json` | Sample JEDx job with embedded Skills API format |
| `sample-data/stateAgencyArkansas_4034/*.json` | Sample JEDx objects (jobs, workers, organizations) |

### Schemas

| Directory | Contents |
|-----------|----------|
| `schemas/` | JSON schemas for JEDx objects |
| `skillsapi/` | Skills API OpenAPI specification and JSON-LD context |

---

## 🚀 Quick Start

### 1. Import Collections

**Option A: Import Both Collections**
```bash
# In Postman
1. Click Import
2. Select "Upload Files"
3. Choose both JSON files:
   - JEDx_API.postman_collection.json
   - Skills_API.postman_collection.json
4. Click Import
```

**Option B: Import Individual Collection**
- Import `JEDx_API.postman_collection.json` for job/worker data exchange
- Import `Skills_API.postman_collection.json` for skills-based workflows

### 2. Configure Variables

For each collection:

1. Click on the collection name
2. Go to **Variables** tab
3. Update these values:

**JEDx API**:
- `base_url`: `https://api.jedx.example.com/v1`
- `api_token`: Your authentication token

**Skills API**:
- `base_url`: `https://api.hropen.org/skills/v1`
- `api_token`: Your authentication token
- `organization_uri`: `https://organization.example.com`

### 3. Test the APIs

**JEDx API - Try these first**:
```
GET /jobs
GET /jobs/SWE-001
GET /jobs/SWE-001/skills
```

**Skills API - Try these first**:
```
GET /skills
GET /proficiency-scales
GET /assertions?personId=person-12345
```

---

## 📚 Collection Details

### JEDx API Collection

**Purpose**: Exchange job, worker, organization, and employment data

**Resources**:
- **Jobs** (6 endpoints) - Job roles and positions
- **Workers** (5 endpoints) - Employee/worker data
- **Organizations** (5 endpoints) - Employer/company information
- **Reports** (4 endpoints) - Compensation and hours
- **Skills API Integration** (1 endpoint) - Job skills via Skills API
- **Schemas** (4 endpoints) - JSON schema retrieval

**Key Features**:
- Full CRUD operations
- Skills API integration at `/jobs/:id/skills`
- Sample requests and responses
- POD (Privacy Obligation Document) compliance
- RefId-based referential integrity

**Standards**:
- JSON Schema Draft-07
- ISO standards (dates, countries, currencies)
- Schema.org vocabulary

### Skills Data API Collection

**Purpose**: Skills-based hiring, workforce transformation, and talent optimization

**Resources**:
- **Skills** (5 endpoints) - Skill definitions as shared infrastructure
- **Skill Assertions** (5 endpoints) - Time-bound capability claims
- **Proficiency Scales** (3 endpoints) - Standardized capability levels
- **Assessment Integration** (3 endpoints) - Map scores to proficiency
- **Workforce Analytics** (5 endpoints) - Insights and gap analysis
- **JEDx Integration** (4 endpoints) - Link skills to jobs/workers
- **Credentials & Badges** (2 endpoints) - Open Badges integration
- **Taxonomies** (3 endpoints) - ESCO, O*NET, Lightcast mapping

**Key Features**:
- JSON-LD 1.1 format
- Separation of skills, evidence, and proficiency
- Time-bound assertions with provenance
- Assessment-to-proficiency mapping
- Workforce analytics and gap analysis
- Open Badges v3.0 integration
- External taxonomy alignment

**Standards**:
- IMS Global Open Badges v3.0
- W3C Verifiable Credentials
- Credential Engine (CTDL)
- IEEE Competency Standards
- Schema.org vocabulary
- ESCO, O*NET, Lightcast taxonomies

---

## 🔗 Integration Patterns

### Pattern 1: Skills-Based Hiring

```
JEDx API: Define job requirements
   ↓
Assessments API: Candidate assessment
   ↓
Skills API: Map score → proficiency
   ↓
Skills API: Create skill assertion
   ↓
Skills API: Match candidate to job
   ↓
JEDx API: Update hiring workflow
```

**Postman Flow**:
1. `PUT /jedx/jobs/{jobId}/skills` (Skills API)
2. External: Assessment administered
3. `POST /skills/assessments/map-to-proficiency` (Skills API)
4. `POST /skills/assertions` (Skills API)
5. `POST /skills/jedx/match` (Skills API)

### Pattern 2: Workforce Skills Inventory

```
JEDx API: Get all workers
   ↓
Skills API: Get assertions for each worker
   ↓
Skills API: Aggregate skills inventory
   ↓
Skills API: Analyze trends and gaps
   ↓
Skills API: Identify reskilling needs
```

**Postman Flow**:
1. `GET /jedx/workers` (JEDx API)
2. `GET /skills/jedx/workers/{workerId}/skills` (Skills API)
3. `GET /skills/analytics/skills-inventory` (Skills API)
4. `GET /skills/analytics/trending` (Skills API)
5. `POST /skills/analytics/gap-analysis` (Skills API)

### Pattern 3: Internal Mobility

```
Skills API: Get job requirements
   ↓
Skills API: Find mobility candidates
   ↓
Skills API: Match skills profiles
   ↓
Skills API: Generate development plans
   ↓
JEDx API: Update worker assignments
```

**Postman Flow**:
1. `GET /skills/jedx/jobs/{jobId}/skills` (Skills API)
2. `POST /skills/analytics/mobility-candidates` (Skills API)
3. `POST /skills/jedx/match` (Skills API)
4. `POST /skills/analytics/gap-analysis` (Skills API)

---

## 🎯 Use Cases

### For Talent Acquisition

**Skills-Based Job Postings**:
- Define jobs with required skills and proficiency levels
- Match candidates based on verified skills, not just resumes
- Reduce bias with standardized proficiency assessments

**Endpoints**:
```
PUT /skills/jedx/jobs/{jobId}/skills
POST /skills/jedx/match
GET /skills/assessments/mapping-rules
```

### For Learning & Development

**Skills Gap Analysis**:
- Identify skills gaps across workforce
- Target learning investments
- Track skill development over time

**Endpoints**:
```
GET /skills/analytics/skills-inventory
POST /skills/analytics/gap-analysis
GET /skills/analytics/trending
```

### For HR Operations

**Internal Mobility**:
- Find qualified internal candidates
- Support career development
- Reduce external hiring costs

**Endpoints**:
```
POST /skills/analytics/mobility-candidates
GET /skills/jedx/workers/{workerId}/skills
POST /skills/analytics/gap-analysis
```

### For Workforce Planning

**Strategic Insights**:
- Understand current capabilities
- Forecast future skills needs
- Plan reskilling initiatives

**Endpoints**:
```
GET /skills/analytics/skills-inventory
GET /skills/analytics/currency
GET /skills/analytics/trending
```

---

## 📖 Best Practices

### 1. Skills as Shared Infrastructure

✅ **DO**: Define skills once, reference everywhere
```json
{
  "@id": "https://api.hropen.org/skills/GO-PROGRAMMING",
  "name": "Go Programming Language"
}
```

❌ **DON'T**: Duplicate skill definitions across systems

### 2. Separation of Concerns

✅ **DO**: Keep skills, evidence, and proficiency separate
```json
{
  "skill": { "@id": "..." },           // What capability
  "evidence": { "@id": "..." },        // How measured
  "proficiencyLevel": { "@id": "..." } // Interpreted level
}
```

❌ **DON'T**: Embed assessment scores in skill definitions

### 3. Time-Bound Assertions

✅ **DO**: Include validity periods
```json
{
  "validFrom": "2025-06-15T00:00:00Z",
  "validUntil": "2027-06-15T00:00:00Z"
}
```

❌ **DON'T**: Create permanent assertions without expiry

### 4. Provenance Tracking

✅ **DO**: Include source and evidence
```json
{
  "source": { "@id": "https://organization.example.com" },
  "assertedBy": { "@id": "https://org.example.com/people/manager-456" },
  "evidence": [{ "@id": "https://api.hropen.org/assessments/results/789" }]
}
```

❌ **DON'T**: Create assertions without attribution

### 5. Assessment Mapping

✅ **DO**: Document score-to-proficiency mappings
```json
{
  "mappingRules": [
    { "minScore": 70, "maxScore": 89, "proficiencyLevel": "Proficient" }
  ]
}
```

❌ **DON'T**: Use opaque or undocumented mappings

---

## 🔧 Configuration

### Environment Setup

Create a Postman environment with these variables:

```json
{
  "jedx_base_url": "https://api.jedx.example.com/v1",
  "skills_base_url": "https://api.hropen.org/skills/v1",
  "api_token": "your-auth-token",
  "organization_uri": "https://organization.example.com",
  "organization_id": "TechCorp-2026",
  "test_person_id": "person-12345",
  "test_job_id": "SWE-001"
}
```

### Authentication

Both collections use **Bearer Token** authentication.

Set in collection variables or environment:
```
Authorization: Bearer {{api_token}}
```

---

## 📊 Sample Workflows

### Complete Skills-Based Hiring Workflow

1. **Create Organization** (if needed)
   ```
   POST /jedx/organizations
   ```

2. **Create Job**
   ```
   POST /jedx/jobs
   ```

3. **Define Skills Requirements**
   ```
   PUT /skills/jedx/jobs/SWE-001/skills
   Body: SkillAssertionCollection with required proficiencies
   ```

4. **Candidate Assessment** (External Assessments API)
   ```
   Candidate completes Go Programming assessment
   Score: 87/100
   ```

5. **Map Score to Proficiency**
   ```
   POST /skills/assessments/map-to-proficiency
   Response: "Proficient" (level 4)
   ```

6. **Create Skill Assertion**
   ```
   POST /skills/assertions
   Body: Links to assessment evidence
   ```

7. **Match Candidate to Job**
   ```
   POST /skills/jedx/match
   Response: matchScore = 0.85, skill gaps identified
   ```

8. **Issue Skills Badge**
   ```
   POST /skills/credentials/badges
   Response: Open Badge credential issued
   ```

9. **Create Worker Record** (if hired)
   ```
   POST /jedx/workers
   ```

---

## 🌐 Standards & Specifications

### JEDx API

- **JSON Schema**: Draft-07
- **Data Format**: JSON
- **Standards**: ISO 8601 (dates), ISO 3166 (countries), ISO 4217 (currencies)
- **Privacy**: POD (Privacy Obligation Document) compliance

### Skills Data API

- **Data Format**: JSON-LD 1.1
- **Vocabulary**: Schema.org
- **Credentials**: IMS Global Open Badges v3.0, W3C Verifiable Credentials
- **Competencies**: IEEE 1484.20.2-2022, IEEE 1484.20.3-2023
- **Credentials**: Credential Engine CTDL
- **Taxonomies**: ESCO, O*NET, Lightcast

---

## 📝 Documentation

### Guides

- **POSTMAN_GUIDE.md** - JEDx API usage guide
- **SKILLS_API_GUIDE.md** - Skills API comprehensive guide with workflows
- **Best Practices Guide** (in collection description)

### API Specifications

- **skillsapi/openapi.yaml** - Skills API OpenAPI 3.1 specification
- **skillsapi/context-v1.json** - JSON-LD context for Skills API
- **schemas/*.jschema** - JEDx JSON schemas

---

## 🤝 Contributing

These collections are based on:
- **HR Open Standards** - https://www.hropenstandards.org/
- **HR Open Skills Data Workgroup** - Pre-Release Feb 2026 specification

---

## 📞 Support

For questions or issues:

1. Review the comprehensive guides (POSTMAN_GUIDE.md, SKILLS_API_GUIDE.md)
2. Check sample data in `/sample-data` directory
3. Validate against schemas in `/schemas` and `/skillsapi`
4. Consult HR Open Standards documentation

---

## 📜 License

These Postman collections implement open standards from:
- HR Open Standards Consortium
- IMS Global Learning Consortium
- Credential Engine
- IEEE Learning Technology Standards Committee

---

## 🔄 Version History

### v1.0.0 (2026-02-03)

**JEDx API Collection**:
- 28 endpoints across 6 resource categories
- Full CRUD operations
- Skills API integration
- Sample requests/responses

**Skills Data API Collection**:
- 35+ endpoints across 8 functional areas
- JSON-LD 1.1 format
- Complete skills-based hiring workflow
- Workforce analytics and gap analysis
- Open Badges integration
- Taxonomy alignment (ESCO, O*NET, Lightcast)

---

**Generated**: 2026-02-03
**Postman Version**: 2.1.0
**API Versions**: JEDx v1, Skills v1
