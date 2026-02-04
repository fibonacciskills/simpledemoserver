# JEDx Skills Extension Proposal

**Proposal:** Extend JEDx Job schema to include machine-readable skills and qualifications

**Status:** Proposed Enhancement to JEDx Standard

**Date:** 2026-02-04

---

## Executive Summary

We propose extending the JEDx (Job Exchange Data) format to include structured skills and credential requirements. This enhancement enables:
- Machine-readable job qualifications
- Automated candidate-job matching
- Skills gap analysis
- Integration with learning/credentialing systems
- Data-driven workforce planning

**Key Point:** This extension maintains **full backward compatibility** with existing JEDx implementations while enabling next-generation workforce applications.

---

## The Problem

### Current State: JEDx Job Schema

**What JEDx has today:**
```json
{
  "job": {
    "jobId": "SWE-001",
    "title": "Senior Software Engineer",
    "jobDuties": "Design and implement scalable backend services...",
    "socInfo": [...]
  }
}
```

**Limitations:**
- ✅ Job title and duties (human-readable)
- ✅ SOC codes (occupation classification)
- ❌ **No structured skills requirements**
- ❌ **No proficiency levels**
- ❌ **No machine-readable qualifications**

### Impact

**Without structured skills, systems cannot:**
- Automatically match candidates to jobs by skills
- Quantify qualification gaps (e.g., "candidate is 75% match")
- Recommend training to close skill gaps
- Track workforce skill inventory
- Enable skills-based internal mobility
- Connect learning outcomes to job requirements

**Result:** Job data remains siloed from skills/learning/credential systems

---

## The Proposal

### Add Optional "skills" Field to JEDx Job Schema

Extend the job schema to include an optional `skills` field containing a **SkillAssertionCollection** (IMS Global Open Badges v3.0 format).

### Example: Extended JEDx Job

```json
{
  "@context": [
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
    {
      "schema": "https://schema.org/",
      "Skill": "schema:Skill",
      "SkillAssertion": "schema:SkillAssertion"
    }
  ],
  "job": {
    "RefId": "550e8400-e29b-41d4-a716-446655440001",
    "senderId": "techcorp-system-01",
    "receiverId": "",
    "organizationRefId": "7a3b4c5d-e6f7-48a9-b0c1-d2e3f4a5b6c7",
    "organizationId": "TechCorp-2026",
    "jobId": "SWE-001",
    "title": "Senior Software Engineer",
    "jobDuties": "Design and implement scalable backend services using Go and PostgreSQL.",
    "socInfo": [
      {
        "classificationSys": "1",
        "assigningEntity": "1",
        "socCodeValue": "15-1252"
      }
    ],
    "skills": {
      "type": "SkillAssertionCollection",
      "targetType": "https://schema.org/JobPosting",
      "targetId": "https://techcorp.example.com/jobs/SWE-001",
      "assertions": [
        {
          "type": "SkillAssertion",
          "skill": {
            "id": "https://api.hropen.org/skills/GO-PROGRAMMING",
            "type": "Skill",
            "name": "Go Programming Language",
            "codedNotation": "GO"
          },
          "proficiencyLevel": {
            "id": "https://techcorp.example.com/proficiency-scales/4-level/4",
            "type": "DefinedTerm",
            "name": "Advanced",
            "rank": 4
          },
          "proficiencyScale": "https://techcorp.example.com/proficiency-scales/4-level"
        }
      ]
    }
  }
}
```

---

## Why This Approach

### 1. Builds on Existing Standards

**Not inventing new formats** - reusing **IMS Global Open Badges v3.0**:
- Already used by education institutions worldwide
- Standard format for skills and credentials
- Supported by LMS platforms (Canvas, Moodle, Blackboard)
- Compatible with digital credentialing systems

**Benefit:** Instant interoperability with learning/credential ecosystems

### 2. Maintains Backward Compatibility

**Key Design Principle:** `skills` field is **optional**

**Existing JEDx implementations:**
- Continue working without any changes
- Can ignore the skills field if not needed
- No breaking changes to current integrations

**New implementations:**
- Can use skills field for enhanced matching
- Get access to structured qualification data
- Enable new use cases

### 3. Enables Machine-Readable HR

**With this extension, systems can:**

**Matching & Recommendations:**
- "Find all candidates qualified for this job"
- "Show me internal employees who could fill this role"
- "Which jobs can this candidate do?"

**Gap Analysis:**
- "Candidate has Go: Intermediate, needs Advanced - 1 level gap"
- "75% skills match - missing AWS and Kubernetes"
- "Recommend training: Advanced Go Programming course"

**Workforce Analytics:**
- "We have 15 people with Go skills across the org"
- "Critical skill shortage: Only 2 people have AWS Expert level"
- "Skills inventory dashboard by department"

**Learning-to-Work Pipeline:**
- "This course develops skills needed for Software Engineer roles"
- "After completing CS-401, students qualify for 12 open positions"
- "Show ROI: Training program fills 80% of open roles internally"

---

## Technical Specification

### Schema Extension

**Add to job_schema.jschema:**

```json
{
  "properties": {
    "skills": {
      "type": "object",
      "description": "Skills and qualifications required for the job using IMS Global Open Badges v3.0 SkillAssertionCollection format",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["SkillAssertionCollection"]
        },
        "targetType": {
          "type": "string",
          "format": "uri"
        },
        "targetId": {
          "type": "string",
          "format": "uri"
        },
        "assertions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {"type": "string", "enum": ["SkillAssertion"]},
              "skill": {
                "type": "object",
                "required": ["id", "type", "name"],
                "properties": {
                  "id": {"type": "string", "format": "uri"},
                  "type": {"type": "string"},
                  "name": {"type": "string"},
                  "description": {"type": "string"},
                  "codedNotation": {"type": "string"}
                }
              },
              "proficiencyLevel": {
                "type": "object",
                "properties": {
                  "id": {"type": "string", "format": "uri"},
                  "type": {"type": "string"},
                  "name": {"type": "string"},
                  "description": {"type": "string"},
                  "rank": {"type": "integer"},
                  "termCode": {"type": "string"}
                }
              },
              "proficiencyScale": {
                "type": "string",
                "format": "uri"
              }
            },
            "required": ["type", "skill"]
          }
        }
      },
      "required": ["type", "assertions"]
    }
  }
}
```

**Change:**
```json
"additionalProperties": false
```

**To:**
```json
"additionalProperties": true
```

Or explicitly allow skills field while keeping strict validation for other properties.

---

## Use Cases

### Use Case 1: Skills-Based Hiring

**Scenario:** State workforce agency helping job seekers find qualified positions

**Today (without skills):**
1. Job seeker searches by job title
2. Manual review of job description
3. No quantified match score
4. Guesswork on qualifications

**With Skills Extension:**
1. Job seeker enters skills: "Go: Advanced, PostgreSQL: Intermediate"
2. System matches against all jobs with skills data
3. Returns: "SWE-001: 75% match - need AWS (Novice level)"
4. Recommends: "Take 'AWS Fundamentals' course to qualify"

**Impact:** Faster placements, better matches, clear development paths

### Use Case 2: Internal Mobility

**Scenario:** Large employer with 5,000 employees wants to fill roles internally before external hiring

**Today:**
1. Post job internally
2. Employees self-assess fit
3. HR manually reviews applications
4. High cost of external hiring

**With Skills Extension:**
1. New role opens: Senior DevOps Engineer (skills defined)
2. System queries employee skill profiles
3. Auto-identifies: "12 employees are 80%+ qualified"
4. Recommends specific training to close gaps
5. Internal hire saves $15K+ in recruiting costs

**Impact:** Lower hiring costs, faster fills, better retention

### Use Case 3: Workforce Development Planning

**Scenario:** Regional workforce board planning training programs

**Today:**
1. Survey employers about needs (slow, incomplete)
2. Anecdotal data on skill gaps
3. Hard to prove ROI of training programs
4. Disconnected from actual job requirements

**With Skills Extension:**
1. Query all jobs in region with skills data
2. Identify: "300 open positions need Python: Advanced"
3. Compare to current workforce skills
4. Plan training: "Need 200 people trained in Advanced Python"
5. Track outcomes: "150 completers placed in Python roles"

**Impact:** Data-driven workforce planning, measurable ROI

### Use Case 4: Education-Workforce Alignment

**Scenario:** University wants to show graduates are job-ready

**Today:**
1. Claim "graduates are prepared for tech jobs"
2. No quantified proof
3. Employers unsure what skills graduates have

**With Skills Extension:**
1. Courses define skill outcomes (IMS Global format)
2. Graduates get digital credentials with skills
3. Compare graduate skills to job requirements
4. Show: "CS degree develops skills for 85 job titles"
5. Employers can filter by skill, not just degree

**Impact:** Better grad outcomes, employer confidence, program improvement

---

## Reference Implementation

**Live Demo:** https://simpledemoserver.onrender.com

**Endpoints:**
```
GET /api/v1/jedx/jobs/SWE-001
→ Returns extended JEDx job with skills

GET /api/v1/jedx/jobs/SWE-001/skills
→ Returns just the skills (also available separately)
```

**Sample Files:**
- `/sample-data/skillsapi/job-skills-architecture.json` - Full example
- `/sample-data/skillsapi/job-swe-001.json` - JEDx only
- `/sample-data/skillsapi/job-swe-001-skills.json` - Skills only

**Code:** Available at [GitHub repo]

---

## Benefits

### For State Agencies
- Better job-seeker matching
- Quantified skill gaps
- Training program ROI measurement
- Integration with learning systems

### For Employers
- Automated candidate screening
- Internal mobility insights
- Workforce planning data
- Reduced hiring costs

### For Workers
- Clear skill requirements
- Recommended training paths
- Portable skill credentials
- Better job search results

### For Education/Training
- Align programs to labor market
- Demonstrate graduate outcomes
- Issue digital credentials
- Show employer value

---

## Standards Alignment

This proposal aligns with:

✅ **IMS Global Open Badges v3.0**
- Standard skills/credential format
- Used by education worldwide
- Active standard body (IMS Global)

✅ **Schema.org Vocabulary**
- Skill, JobPosting, Course types
- Widely adopted linked data standard

✅ **W3C Verifiable Credentials**
- Future-proof for digital credentials
- Enables credential verification

✅ **HR Open Standards**
- HR Open Skills taxonomy
- Used by enterprise HR systems

**Not reinventing the wheel** - connecting existing standards!

---

## Migration Path

### Phase 1: Optional Field (Proposed)
- Add `skills` as optional field
- Existing implementations continue working
- New implementations can use skills
- No breaking changes

### Phase 2: Ecosystem Adoption
- State agencies add skills to job data
- Employers publish jobs with skills
- Training providers align to skills

### Phase 3: Enhanced Services
- Skills-based matching platforms
- Workforce analytics dashboards
- Learning recommendation engines
- Credential verification systems

---

## Comparison to Alternatives

### Alternative 1: Keep Skills Separate

**Approach:** Skills always in separate endpoint/file

**Pros:**
- Maintains strict JEDx schema
- Clear separation of concerns

**Cons:**
- ❌ Two requests instead of one
- ❌ No single source of truth
- ❌ Can get out of sync
- ❌ Harder for consuming systems

### Alternative 2: Embed in jobDuties Text

**Approach:** Continue using free-text job descriptions

**Pros:**
- No schema changes needed

**Cons:**
- ❌ Not machine-readable
- ❌ No automated matching
- ❌ No proficiency levels
- ❌ Inconsistent formats

### Alternative 3: Create Entirely New Standard

**Approach:** Define brand new job-skills format

**Cons:**
- ❌ Reinvents the wheel
- ❌ No existing ecosystem
- ❌ Adoption challenges
- ❌ More complexity

### Proposed Approach: Extend JEDx ✅

**Pros:**
- ✅ Single integrated format
- ✅ Backward compatible
- ✅ Reuses proven standards (IMS Global)
- ✅ Enables new use cases
- ✅ Natural evolution of JEDx

---

## Open Questions for JEDx Governance

1. **Schema Validation:** Should `additionalProperties` be set to `true` or should we explicitly enumerate allowed extensions?

2. **Required vs Optional:** Should `skills` field be:
   - Optional (proposed) - gradual adoption
   - Required for new implementations - faster standardization
   - Recommended - middle ground

3. **Version Management:** Should this be:
   - JEDx v2.0 (breaking change implied)
   - JEDx v1.1 (minor enhancement)
   - JEDx extension profile (keeps v1.0)

4. **Credential Support:** Should we also add:
   - `requiredCredentials` field (licenses, certifications)
   - `preferredEducation` field
   - Other qualification types

5. **Backward Compatibility:** How should parsers handle:
   - Jobs with skills field (new)
   - Jobs without skills field (existing)
   - Mixed environments

---

## Next Steps

### For This Proposal

1. **Community Feedback:** Share with JEDx stakeholders
2. **Pilot Testing:** Deploy in production with willing partners
3. **Metrics Collection:** Measure impact on matching/placement
4. **Specification Draft:** Formal schema and documentation
5. **Standards Process:** Submit to JEDx governance

### For Implementers

**You can use this NOW** as an extension:
1. Deploy the reference implementation
2. Collect feedback from users
3. Demonstrate value (better matching, etc.)
4. Build the business case
5. Share results with standards body

---

## Conclusion

**JEDx is excellent at job metadata.** This proposal enhances it to include **machine-readable qualifications** by integrating with IMS Global Open Badges v3.0 - a proven, widely-adopted standard for skills and credentials.

**Key Benefits:**
- ✅ Backward compatible
- ✅ Builds on existing standards
- ✅ Enables powerful new use cases
- ✅ Natural evolution of JEDx
- ✅ Reference implementation available

**This positions JEDx as the comprehensive standard for modern, skills-based workforce systems.**

---

## Appendix A: Field Reference

### Skills Field Structure

```
job.skills                           SkillAssertionCollection (IMS Global)
├── type                             "SkillAssertionCollection"
├── targetType                       URI (e.g., https://schema.org/JobPosting)
├── targetId                         URI pointing to this job
├── assertions[]                     Array of required skills
    ├── type                         "SkillAssertion"
    ├── skill
    │   ├── id                       Skill URI (e.g., HR Open, ESCO)
    │   ├── type                     "Skill"
    │   ├── name                     Skill name
    │   ├── description              Skill description
    │   └── codedNotation            Short code
    ├── proficiencyLevel
    │   ├── id                       Level URI
    │   ├── type                     "DefinedTerm"
    │   ├── name                     Level name (e.g., "Advanced")
    │   ├── description              Level description
    │   ├── rank                     Numeric rank (1-5)
    │   └── termCode                 Code for level
    └── proficiencyScale             URI to scale definition
```

---

## Appendix B: Example Payloads

See:
- `/sample-data/skillsapi/job-skills-architecture.json` - Complete example
- `/docs/SKILLS_API_GUIDE.md` - Full API documentation
- Live demo: https://simpledemoserver.onrender.com

---

**Document Version:** 1.0
**Last Updated:** 2026-02-04
**Contact:** [Your contact info]
