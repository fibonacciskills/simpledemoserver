# HR Open Skills API - SkillAssertionCollection Generator

Generate a valid **SkillAssertionCollection** JSON file conforming to the HR Open Standards Skills Proficiency API (OpenAPI 3.0, v0.9).

## Your task

The user wants to create a new sample data file. They will describe a subject (a job, person, course, framework, credential, or assessment) and the skills associated with it.

Use `$ARGUMENTS` as the description of what to generate. If empty, ask the user what subject and skills they want to model.

## Schema (from `server/config/swagger-skills.js`)

The root object is a `SkillAssertionCollection`:

```json
{
  "identifier": "<URI - globally unique identifier for the target object>",
  "targetType": "<one of: Job | Person | JobRole | Assessment | Framework | LearningProgram | Other>",
  "proficiencyScale": "<URI - optional, identifies the proficiency scale used>",
  "assertions": [
    {
      "skill": {
        "id": "<URI - identifies the skill in an external taxonomy>",
        "name": "<string - human-readable skill name>",
        "description": "<string - optional>",
        "codedNotation": "<string - optional short code>"
      },
      "proficiencyLevel": {
        "name": "<string - level name>",
        "description": "<string - optional>",
        "rank": "<integer - ordinal position within the scale>"
      },
      "performanceContext": ["<URI - optional, situational context references>"],
      "proficiencyContext": "<URI - optional, external rubric criterion reference>",
      "source": {
        "id": "<URI>",
        "type": "<string - e.g. Organization, EducationalOrganization, Assessment>",
        "name": "<string>"
      }
    }
  ]
}
```

## Proficiency scale conventions

Use a consistent proficiency scale across all assertions in a collection. Common patterns from existing samples:

**5-Level Scale** (default for jobs, persons, assessments):
| Rank | Name | Description |
|------|------|-------------|
| 1 | Fundamental Awareness | Basic knowledge |
| 2 | Novice | Working knowledge with guidance |
| 3 | Intermediate | Routine independence |
| 4 | Advanced | Complex contexts |
| 5 | Expert | Recognized authority |

**3-Level Scale** (used by UNESCO AI Framework):
| Rank | Name | Description |
|------|------|-------------|
| 1 | Understand | Explain or exemplify knowledge with connections to real-life practices |
| 2 | Apply | Transfer and adapt knowledge to more complex contexts |
| 3 | Create | Generate new knowledge and create artefacts addressing authentic problems |

Choose the scale that fits the domain. If the user describes an educational framework, prefer 3-level. For jobs and workforce data, prefer 5-level. Always set the `proficiencyScale` URI accordingly.

## URI conventions

Follow these patterns from existing sample data:

- **Skill IDs**: `https://api.hropen.org/skills/<CODED-NOTATION>` (e.g., `https://api.hropen.org/skills/GO-PROGRAMMING`)
- **Proficiency scale URIs**: `https://<org>.example.com/proficiency-scales/<N>-level` or a real registry URI
- **Proficiency level IDs**: `<proficiencyScale>/<rank>` or `<proficiencyScale>#<LevelName>`
- **Performance context**: Reference external ontology URIs (CEDS, CASE, schema.org, CTDL)
- **Source org IDs**: `https://<org-domain>`
- **Framework identifiers**: Use Credential Engine registry URIs when modeling real frameworks

## JSON-LD context (optional, for rich samples)

For samples that need full linked-data fidelity (like the UNESCO example in `sample-data/unescoai_credengine.json`), include a `@context` block mapping types to schema.org terms. For simpler samples, omit the context and use plain JSON matching the OpenAPI spec.

## Rules

1. **Read existing samples first.** Before generating, read 1-2 relevant files from `sample-data/skillsapi/` to match the style for the chosen `targetType`. For frameworks, also read `sample-data/unescoai_credengine.json`.
2. **Every assertion MUST have both `skill` and `proficiencyLevel`** with at minimum `name` and `rank`.
3. **Skill IDs must be unique** within the collection -- no duplicate `skill.id` values.
4. **Use realistic, domain-appropriate skill names and descriptions.** Draw on real competency frameworks (ESCO, O*NET, CEDS) when possible.
5. **Include `codedNotation`** on every skill as a short uppercase code.
6. **Include `source`** on assertions when the issuing organization is known.
7. **Save the file** to `sample-data/` (root level for standalone files, or `sample-data/skillsapi/` for API-specific samples). Use kebab-case filenames ending in `.json`.
8. **Validate the JSON** is parseable before writing.
9. **Do NOT add the file to any hardcoded list** -- the sample data browser at `/api/v1/sample-data` dynamically scans the directory.
10. After writing the file, confirm it by reading it back and summarizing the contents (skill count, target type, proficiency scale used).
