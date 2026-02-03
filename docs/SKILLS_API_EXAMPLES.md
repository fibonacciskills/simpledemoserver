# Skills API Examples - Real-World Use Cases

## Overview

This document explains the concrete examples demonstrating how the HR Open Skills Data API works with different target types: **Jobs**, **Courses**, **People**, **Credentials**, and **CLRs**.

---

## 📁 Example Files

### 1. **job-skills-architecture.json** - Job Skills Requirements

**Target Type**: `https://schema.org/JobPosting`

**Use Case**: Define skills requirements for a job role

**Structure**:
- JEDx job metadata (RefId, organizationId, jobId, title, duties, SOC codes)
- Embedded Skills API `SkillAssertionCollection` at `/skills`
- Required proficiency levels for each skill
- Proficiency scale definition

**Example Skills**:
- Go Programming (Advanced - Level 4)
- PostgreSQL (Intermediate - Level 3)
- AWS (Novice - Level 2)

**Integration Pattern**:
```
JEDx Job Object
  └─ skills: SkillAssertionCollection
       └─ assertions: [SkillAssertion, ...]
```

**API Endpoints**:
```
GET /jedx/jobs/SWE-001
GET /skills/jedx/jobs/SWE-001/skills
PUT /skills/jedx/jobs/SWE-001/skills
```

---

### 2. **course-skills-assertions.json** - Course Learning Outcomes

**Target Type**: `https://schema.org/Course`

**Use Case**: Document skills students acquire by completing a course

**Structure**:
- Course metadata (courseCode, credits, level, duration)
- Skill assertions representing learning outcomes
- Assessment methods for each skill
- Educational provider information

**Example Course**: CS-401: Advanced Backend Development
- 4 credits, Graduate level, 15 weeks
- Tech University, Computer Science Department

**Skills Covered**:
- Go Programming (Advanced)
- PostgreSQL Design (Advanced)
- Microservices Architecture (Intermediate)
- Docker Containerization (Intermediate)
- RESTful API Design (Advanced)

**Key Features**:
- `learningOutcome` field describing what students can do
- `assessmentMethod` documenting how skills are evaluated
- Links to external taxonomies (ESCO, O*NET)
- Academic term and instructor metadata

**API Endpoints**:
```
GET /skills?identifier=https://university.example.com/courses/CS-401&targetType=Course
POST /skills (create course skill profile)
```

---

### 3. **person-skills-profile.json** - Employee/Worker Skills

**Target Type**: `https://schema.org/Person`

**Use Case**: Comprehensive skills profile for an individual worker/employee

**Structure**:
- Person metadata (name, jobTitle, employeeId, department)
- Time-bound skill assertions with validity periods
- Multiple evidence types (work experience, assessments, peer reviews, courses)
- Skills categorization (Technical, Leadership)
- Summary statistics

**Example Person**: Jane Martinez, Senior Backend Engineer
- Employee ID: EMP-45678
- Department: Engineering - Backend Systems

**Skills Inventory** (8 total):
- **Expert**: Python (5), FastAPI (5)
- **Advanced**: PostgreSQL (4), Redis (4), CI/CD (4), Distributed Systems (4), Technical Leadership (4)
- **Intermediate**: Kubernetes (3)

**Evidence Types**:
- Work Experience (project accomplishments)
- Assessment Results (certifications)
- Peer Reviews (360 feedback)
- Courses (training completion)

**Summary Metrics**:
- Total skills: 8
- By proficiency: Expert (2), Advanced (5), Intermediate (1)
- Currently valid: 8
- Expiring in 90 days: 1

**API Endpoints**:
```
GET /assertions?personId=employee-45678&currentOnly=true
GET /jedx/workers/employee-45678/skills
GET /analytics/skills-inventory?department=Engineering
POST /analytics/mobility-candidates
```

---

### 4. **open-badge-credential.json** - Skills Badge/Credential

**Target Type**: `https://schema.org/Person` (credential subject)

**Use Case**: Issue verifiable Open Badge credential with embedded skill assertions

**Structure**:
- W3C Verifiable Credential wrapper
- IMS Global Open Badges v3.0 format
- Achievement metadata (name, description, criteria, image)
- Multiple skill assertions embedded in credential
- Cryptographic proof for verification

**Example Badge**: AWS Cloud Architect - Professional Certification
- Issued by: TechCorp Learning Academy
- Valid: 2026-01-15 to 2028-01-15
- Recipient: Employee 67890

**Skills Certified**:
- AWS Cloud Architecture (Expert - Level 5)
- Infrastructure as Code (Advanced - Level 4)
- High Availability Design (Advanced - Level 4)
- Cloud Cost Optimization (Intermediate - Level 3)

**Evidence Included**:
- Certification exam (88%)
- Hands-on labs (92%)
- Capstone project (95%)

**Alignment**:
- HR Open Skills Framework
- ESCO taxonomy
- O*NET occupation codes

**Verification**:
- Cryptographic signature (Ed25519)
- Revocation list
- Credential status checking

**API Endpoints**:
```
POST /credentials/badges (issue badge)
GET /credentials?personId=employee-67890&type=SkillBadge
POST /assessments/create-assertion (from assessment to badge)
```

---

### 5. **comprehensive-learner-record.json** - Complete CLR

**Target Type**: Multiple (Person as subject, with degrees, courses, badges)

**Use Case**: Package all learning achievements, credentials, and skills in a portable format

**Structure**:
- W3C Verifiable Credential wrapper
- IMS Global CLR v2.0 format
- Multiple embedded credentials:
  - Degree (MS in Computer Science)
  - Course completion (CS-401)
  - Open Badge (Go Programming Expert)
- Aggregated skill assertions across all achievements
- Cryptographic proof for portability

**Example CLR**: Student 12345 - Complete Academic Record
- Issuer: Tech University
- Issuance: 2025-12-20

**Embedded Credentials** (3):
1. **Master's Degree**
   - MS in Computer Science
   - GPA: 3.85
   - 36 credits completed

2. **Course Credential**
   - CS-401: Advanced Backend Development
   - Grade: A (94%)
   - 4 credits

3. **Open Badge**
   - Go Programming Expert
   - Earned: 2025-12-15
   - Valid until: 2027-12-15

**Aggregated Skill Assertions** (5):
- Go Programming (Expert - Level 5)
- PostgreSQL Design (Advanced - Level 4)
- Microservices Architecture (Advanced - Level 4)
- Docker Containerization (Intermediate - Level 3)
- RESTful API Design (Advanced - Level 4)

**Evidence Cross-References**:
- Course → Skill assertions
- Badge → Skill assertions
- Projects → Multiple skills
- Assessments → Proficiency validation

**Use Cases**:
- Student applies for job (portable skills record)
- Transfer between institutions
- Professional licensing
- Workforce credential wallet

**API Endpoints**:
```
GET /credentials/clr?personId=student-12345
POST /credentials/clr (create CLR from assertions)
GET /assertions?personId=student-12345 (source data)
```

---

## 🔗 Relationship: JEDx API vs. Skills API

### They Are **Separate** APIs

**JEDx API**:
- **Purpose**: Job and employment data exchange
- **Resources**: Jobs, Workers, Organizations, Reports
- **Format**: JSON with JSON Schema validation
- **Standards**: ISO dates, countries, currencies; POD compliance
- **Use Cases**: HRIS integration, payroll, workforce reporting

**Skills API**:
- **Purpose**: Skills-based workflows and talent optimization
- **Resources**: Skills, Assertions, Proficiency Scales, Credentials
- **Format**: JSON-LD with semantic web support
- **Standards**: IMS Global, W3C, Schema.org, Credential Engine
- **Use Cases**: Skills-based hiring, learning pathways, credentials, analytics

### But They **Integrate** Seamlessly

**Integration Point 1: Jobs**
```json
// JEDx Job Object
{
  "job": {
    "jobId": "SWE-001",
    "title": "Senior Software Engineer",
    ...
    "skills": {
      // Skills API SkillAssertionCollection embedded here
      "@type": "SkillAssertionCollection",
      "assertions": [...]
    }
  }
}
```

**Integration Point 2: Workers**
```
JEDx Worker → Skills API Assertions
GET /jedx/workers/employee-45678        (worker data)
GET /skills/jedx/workers/employee-45678/skills  (worker skills)
```

**Integration Point 3: Hiring Workflow**
```
1. JEDx: Define job requirements
2. Skills API: Set required skills and proficiency
3. Assessment API: Candidate assessment
4. Skills API: Map score → proficiency → assertion
5. Skills API: Match candidate to job
6. JEDx: Update hiring workflow
```

---

## 📊 Target Types Summary

| Target Type | Example File | Use Case | Primary Users |
|-------------|--------------|----------|---------------|
| **Job** | job-skills-architecture.json | Define role requirements | Talent Acquisition, Hiring Managers |
| **Course** | course-skills-assertions.json | Document learning outcomes | Education, L&D |
| **Person** | person-skills-profile.json | Employee skills inventory | HR, Workforce Planning |
| **Badge** | open-badge-credential.json | Issue portable credentials | L&D, Certification Bodies |
| **CLR** | comprehensive-learner-record.json | Package all achievements | Education, Career Services |

---

## 🎯 Skills API Pattern

All examples follow this pattern:

```json
{
  "@context": [...],
  "@type": "SkillAssertionCollection",
  "targetType": "https://schema.org/[Job|Course|Person|...]",
  "targetId": "URI of the thing",
  "assertions": [
    {
      "@type": "SkillAssertion",
      "skill": { ... },
      "proficiencyLevel": { ... },
      "evidence": [...],
      "validFrom": "...",
      "validUntil": "...",
      "source": { ... }
    }
  ]
}
```

**Key Principles**:
1. **Skills as shared infrastructure** - Same skill definition referenced across job, course, person
2. **Separation of concerns** - Skill (concept) ≠ Evidence (assessment) ≠ Proficiency (level)
3. **Time-bound** - All assertions have validity periods
4. **Evidence-based** - Link to assessments, projects, courses, work experience
5. **Provenance** - Track source and asserter
6. **Standards-aligned** - ESCO, O*NET, IMS Global, W3C

---

## 🔄 Workflow Examples

### Workflow 1: Student → Job

```
1. Student completes course (course-skills-assertions.json)
   → Skills assertions created

2. Student earns degree and badge
   → CLR generated (comprehensive-learner-record.json)
   → Open Badge issued (open-badge-credential.json)

3. Student graduates and applies for job
   → Shares CLR with employer
   → Employer maps CLR skills to job requirements

4. Employer matches candidate
   POST /skills/jedx/match
   {
     "candidateId": "student-12345",
     "jobId": "SWE-001",
     "clrSource": "https://university.example.com/credentials/clr/student-12345"
   }

   Response: Skills match score, gaps, evidence trail

5. If hired, skills transfer to employee profile
   → person-skills-profile.json created
   → Continuous skill development tracked
```

### Workflow 2: Employee Development

```
1. Employee skills profile created (person-skills-profile.json)
   → Current: Python Expert, Kubernetes Intermediate

2. Gap analysis for promotion
   POST /analytics/gap-analysis
   {
     "currentPerson": "employee-45678",
     "targetRole": "Staff Engineer"
   }

   Response: Need Advanced Kubernetes, Expert Distributed Systems

3. Employee takes training
   → Completes Kubernetes Advanced course
   → Course creates skill assertions (course-skills-assertions.json pattern)

4. Employee earns certification
   → Badge issued (open-badge-credential.json)
   → Skills profile updated

5. Re-assess for promotion
   → Match score now meets threshold
   → Promotion approved
```

### Workflow 3: Organizational Skills Inventory

```
1. Aggregate all employee skills
   GET /analytics/skills-inventory?department=Engineering

   Sources:
   - person-skills-profile.json × 150 employees
   - Recent course completions
   - Certifications/badges

2. Identify trends
   GET /analytics/trending?timeframe=6M

   Result: Cloud skills growing, legacy skills declining

3. Strategic planning
   POST /analytics/gap-analysis
   {
     "currentPopulation": { "department": "Engineering" },
     "targetCapabilities": "Cloud-native architecture"
   }

   Result: Need to upskill 45 engineers in Kubernetes

4. Create learning programs
   → Design courses targeting gaps
   → Issue badges on completion
   → Track skills currency
```

---

## 💡 Key Takeaways

1. **Same Skills, Different Contexts**
   - Go Programming skill appears in job (requirement), course (outcome), person (capability), badge (certification)
   - Single skill definition, multiple references

2. **Evidence Trails**
   - Course → Assessment → Proficiency → Assertion
   - Job → Requirement → Candidate Assessment → Match → Hire
   - Training → Badge → CLR → Portfolio

3. **Standards Enable Portability**
   - CLR created by university
   - Badge verified by employer
   - Skills mapped to O*NET for labor market alignment
   - All using open standards (IMS Global, W3C, Schema.org)

4. **JEDx + Skills API = Complete Solution**
   - JEDx handles employment data (jobs, workers, orgs, pay)
   - Skills API handles capabilities (skills, proficiency, credentials, analytics)
   - Together: skills-based hiring and workforce transformation

---

## 📚 File Reference

| File | Size | Target | Description |
|------|------|--------|-------------|
| `job-skills-architecture.json` | ~6 KB | Job | JEDx job with Skills API requirements |
| `course-skills-assertions.json` | ~7 KB | Course | University course learning outcomes |
| `person-skills-profile.json` | ~10 KB | Person | Employee skills inventory with evidence |
| `open-badge-credential.json` | ~8 KB | Person | Verifiable credential with skill assertions |
| `comprehensive-learner-record.json` | ~12 KB | Person | Complete CLR with degrees, courses, badges |

**Total**: 5 complete examples demonstrating Skills API across all major use cases

---

**Generated**: 2026-02-03
**Standards**: IMS Global CLR v2.0, Open Badges v3.0, W3C VC, HR Open JEDx, Schema.org
