# Skills API Sample Data

This directory contains sample skill assertion data files that demonstrate the **generic Skills API structure** defined in the OpenAPI specification.

## Generic Structure

All skill assertion files follow the same structure, regardless of target type:

```json
{
  "identifier": "URI identifying the target object",
  "targetType": "Type of the target (Job, Person, LearningProgram, etc.)",
  "assertions": [
    {
      "skill": {
        "id": "URI",
        "name": "Skill name",
        "description": "Optional description",
        "codedNotation": "Optional code"
      },
      "proficiencyLevel": {
        "id": "Optional URI",
        "name": "Level name (required)",
        "description": "Optional description",
        "rank": 1
      },
      "proficiencyScale": "URI to the proficiency scale",
      "source": {
        "id": "Optional URI",
        "type": "Optional type",
        "name": "Optional name"
      }
    }
  ]
}
```

## Target Types

The `targetType` field indicates what kind of object the skills are associated with:

- **Job** - Skills required for a job role
- **Person** - Skills possessed by an individual
- **LearningProgram** - Skills taught by a course or training program
- **Assessment** - Skills measured by an assessment or certification
- **Framework** - Skills defined in a competency framework
- **Role** - Skills needed for an organizational role
- **Other** - Any other target type

## Sample Files

### New Generic Examples (Simplified)
- `job-skills-new.json` - Job role skill requirements
- `course-skills-new.json` - Course/learning program outcomes
- `person-skills-new.json` - Individual's skill portfolio
- `assessment-skills-new.json` - Assessment skill coverage
- `framework-skills-new.json` - Framework competency definitions

### Legacy Examples (More Detailed)
- `job-swe-001-skills.json` - Software Engineer role (detailed)
- `course-skills-assertions.json` - CS-401 course (detailed)
- `open-badge-credential.json` - Badge credential format
- `comprehensive-learner-record.json` - CLR format

## Usage

### API Query
All files can be queried using the Skills API endpoint:

```
GET /api/v1/skills?identifier={URI}&targetType={Type}
```

**Examples:**
```
GET /api/v1/skills?identifier=https://example.com/jobs/SOFTWARE-ENGINEER-001&targetType=Job
GET /api/v1/skills?identifier=https://example.com/courses/WEB-DEV-101&targetType=LearningProgram
GET /api/v1/skills?identifier=https://example.com/people/john-doe-12345&targetType=Person
```

### Direct Access
Files can also be accessed directly:

```
GET /api/v1/sample-data/skillsapi/job-skills-new
GET /api/v1/sample-data/skillsapi/course-skills-new
```

## Key Points

1. **Same Structure, Different Targets**: The structure is identical across all target types. Only `identifier` and `targetType` change.

2. **Identifier Uniqueness**: Each target object must have a globally unique identifier (URI).

3. **Proficiency Scale**: All assertions reference a proficiency scale that defines the levels and ranks.

4. **Optional Source**: Assertions can optionally include a `source` field to indicate where the assertion comes from (e.g., employer, university, assessment).

5. **OpenAPI Compliance**: All new files strictly follow the OpenAPI specification at `/skillsapi/openapi.yaml`.
