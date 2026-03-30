/**
 * Swagger/OpenAPI 3.0 Configuration for Skills Proficiency API
 * Generated from skillsapi/openapi.yaml
 */

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Skills Proficiency API',
    version: '0.9',
    description: `
API for retrieving skill assertions associated with a referenced object.
Skill proficiency is expressed relative to an explicit proficiency scale.
Performance context and proficiency context may reference external
ontology nodes (e.g., CEDS, CASE, ASN, SCD) via URI.
`,
    contact: {
      name: 'HR Open Standards',
      url: 'https://www.hropenstandards.org/',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1/skills',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Skills',
      description: 'Skill assertions for a target object',
    },
  ],
  paths: {
    '/': {
      get: {
        summary: 'Get skill assertions for a target object',
        operationId: 'getSkills',
        tags: ['Skills'],
        parameters: [
          {
            name: 'identifier',
            in: 'query',
            required: true,
            description: 'Globally unique URI identifying the target object',
            schema: {
              type: 'string',
              format: 'uri',
            },
            example: 'https://example.com/people/john-doe',
          },
          {
            name: 'targetType',
            in: 'query',
            required: true,
            description: 'Type of the target object the identifier refers to',
            schema: {
              type: 'string',
              enum: ['Job', 'Person', 'JobRole', 'Assessment', 'Framework', 'LearningProgram', 'Other'],
            },
          },
        ],
        responses: {
          200: {
            description: 'Skill assertions associated with the target',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SkillAssertionCollection',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      SkillAssertionCollection: {
        type: 'object',
        required: ['identifier', 'targetType', 'assertions'],
        properties: {
          identifier: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/people/john-doe',
          },
          targetType: {
            type: 'string',
            example: 'Person',
          },
          proficiencyScale: {
            type: 'string',
            format: 'uri',
            description: 'URI identifying the proficiency scale against which all proficiency levels in this collection are defined. The scale itself may reference external rubric models such as CEDS or CASE rubric definitions.',
            example: 'https://api.hropen.org/proficiency-scales/4-level',
          },
          assertions: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/SkillAssertion',
            },
          },
        },
      },
      SkillAssertion: {
        type: 'object',
        required: ['skill', 'proficiencyLevel'],
        properties: {
          skill: {
            $ref: '#/components/schemas/Skill',
          },
          proficiencyLevel: {
            $ref: '#/components/schemas/ProficiencyLevel',
          },
          performanceContext: {
            type: 'array',
            description: 'Optional references describing the situational context in which the skill was demonstrated or assessed. Each entry can be a URI referencing an external ontology node describing conditions, environments, scenarios, job contexts, or assessment settings.',
            items: {
              type: 'string',
              format: 'uri',
            },
            example: ['https://ceds.ed.gov/element/001015'],
          },
          proficiencyContext: {
            type: 'string',
            format: 'uri',
            description: 'URI referencing an external rubric criterion level or proficiency definition from a competency framework such as CEDS, CASE, ASN, SCD or other standardized rubric models.',
            example: 'https://ceds.ed.gov/element/000558',
          },
          source: {
            type: 'object',
            description: 'Entity that issued or generated the assertion',
            properties: {
              id: { type: 'string', format: 'uri' },
              type: { type: 'string', example: 'Assessment' },
              name: { type: 'string' },
            },
          },
        },
      },
      Skill: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'string',
            format: 'uri',
            description: 'URI identifying the skill in an external taxonomy',
            example: 'https://api.hropen.org/skills/PYTHON',
          },
          name: {
            type: 'string',
            example: 'Python Programming',
          },
          description: {
            type: 'string',
            example: 'Proficiency in Python programming language',
          },
          codedNotation: {
            type: 'string',
            description: 'Optional code or notation associated with the skill within a specific competency framework.',
            example: 'PYTHON',
          },
        },
      },
      ProficiencyLevel: {
        type: 'object',
        required: ['name', 'rank'],
        properties: {
          id: {
            type: 'string',
            format: 'uri',
            description: 'Optional URI identifying this proficiency level within a rubric or proficiency framework.',
          },
          name: {
            type: 'string',
            example: 'Advanced',
          },
          description: {
            type: 'string',
            example: 'Independent application in complex contexts',
          },
          rank: {
            type: 'integer',
            description: 'Ordinal position within the proficiency scale.',
            example: 4,
          },
        },
      },
    },
  },
};
