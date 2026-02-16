/**
 * Swagger/OpenAPI 3.0 Configuration for Skills API
 * HR Open Standards Skills Proficiency Data API
 */

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'HR Open Skills Proficiency Data API',
    version: '1.0.0',
    description: `
# Skills-Based Hiring & Workforce Transformation API

The **Skills Proficiency Data API** is the first open, comprehensive standard for representing skills proficiency data across HCM, assessment, learning, and talent platforms.

## Key Features
- 🔄 **Interoperable**: Works across HCM, assessment, learning, and talent systems
- 🎯 **Precise**: Structured proficiency levels with evidence sources
- 🤝 **Complementary**: Integrates with JEDx, Open Badges, CLR, and other standards

## Standards Compliance
- IMS Global Open Badges v3.0
- W3C Verifiable Credentials
- JSON-LD 1.1
- Schema.org

## Related Standards
- **Trusted Career Profile (TCP)**: Portable, verifiable career credentials
- **JEDx API**: Job Exchange Data for workforce data exchange
- **Open Badges**: Digital credentials with verification
- **CLR**: Comprehensive Learner Records

## Use Cases
- Skills-based hiring and talent matching
- Workforce analytics and intelligence
- Learning & development pathways
- Skills assessment and validation
- Internal talent mobility
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
    {
      url: 'https://api.hropen.org/v1/skills',
      description: 'Production server (example)',
    },
  ],
  tags: [
    {
      name: 'Skills',
      description: 'Skill taxonomy and skill definitions',
    },
    {
      name: 'Skill Assertions',
      description: 'Skill proficiency assertions for people, jobs, courses, etc.',
    },
    {
      name: 'Proficiency Scales',
      description: 'Proficiency level scales and definitions',
    },
    {
      name: 'Assessments',
      description: 'Map assessment results to proficiency levels',
    },
    {
      name: 'Analytics',
      description: 'Workforce analytics and skills intelligence',
    },
    {
      name: 'JEDx Integration',
      description: 'Integration with HR Open JEDx API',
    },
    {
      name: 'Credentials',
      description: 'Digital badges and verifiable credentials',
    },
    {
      name: 'Taxonomies',
      description: 'Skills taxonomy mappings (ESCO, O*NET, etc.)',
    },
  ],
  paths: {
    '/': {
      get: {
        summary: 'Get skill assertions for a target',
        description: 'Retrieve skill assertions for a person, job, course, or other target entity',
        tags: ['Skill Assertions'],
        parameters: [
          {
            name: 'identifier',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Unique identifier of the target entity',
            example: 'https://example.com/people/john-doe',
          },
          {
            name: 'targetType',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              enum: ['Person', 'Job', 'LearningProgram', 'Assessment', 'Organization'],
            },
            description: 'Type of the target entity',
          },
        ],
        responses: {
          200: {
            description: 'Skill assertions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SkillAssertionCollection',
                },
              },
            },
          },
          400: {
            description: 'Missing required parameters',
          },
        },
      },
    },
    '/skills': {
      get: {
        summary: 'List all skills',
        description: 'Get a paginated list of all skills in the system',
        tags: ['Skills'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 },
            description: 'Maximum number of results to return',
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', default: 0 },
            description: 'Number of results to skip',
          },
        ],
        responses: {
          200: {
            description: 'List of skills',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    '@context': { type: 'string', example: 'https://schema.org' },
                    '@type': { type: 'string', example: 'ItemList' },
                    itemListElement: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Skill' },
                    },
                    numberOfItems: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new skill',
        description: 'Add a new skill to the skills taxonomy',
        tags: ['Skills'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SkillInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Skill created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Skill' },
              },
            },
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/skills/search': {
      get: {
        summary: 'Search skills',
        description: 'Search for skills by keyword, taxonomy, or fuzzy matching',
        tags: ['Skills'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search query string',
            example: 'Python',
          },
          {
            name: 'taxonomy',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by taxonomy (ESCO, O*NET, etc.)',
          },
          {
            name: 'fuzzy',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Enable fuzzy matching',
          },
        ],
        responses: {
          200: {
            description: 'Search results',
          },
        },
      },
    },
    '/skills/{skillId}': {
      get: {
        summary: 'Get skill by ID',
        description: 'Retrieve a specific skill by its identifier or coded notation',
        tags: ['Skills'],
        parameters: [
          {
            name: 'skillId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Skill identifier or coded notation',
            example: 'PYTHON',
          },
        ],
        responses: {
          200: {
            description: 'Skill retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Skill' },
              },
            },
          },
          404: {
            description: 'Skill not found',
          },
        },
      },
    },
    '/assertions': {
      get: {
        summary: 'Get skill assertions',
        description: 'Retrieve skill assertions for a person with optional filtering',
        tags: ['Skill Assertions'],
        parameters: [
          {
            name: 'personId',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Person identifier',
          },
          {
            name: 'currentOnly',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Only return current (non-expired) assertions',
          },
          {
            name: 'includeEvidence',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Include evidence sources',
          },
          {
            name: 'skillId',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by specific skill',
          },
        ],
        responses: {
          200: {
            description: 'Skill assertions retrieved',
          },
          400: {
            description: 'Missing required parameter: personId',
          },
        },
      },
      post: {
        summary: 'Create skill assertion',
        description: 'Create a new skill proficiency assertion',
        tags: ['Skill Assertions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SkillAssertionInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Assertion created successfully',
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/proficiency-scales': {
      get: {
        summary: 'List proficiency scales',
        description: 'Get all available proficiency scales',
        tags: ['Proficiency Scales'],
        responses: {
          200: {
            description: 'List of proficiency scales',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    '@context': { type: 'string' },
                    '@type': { type: 'string' },
                    itemListElement: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ProficiencyScale' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/assessments/map-to-proficiency': {
      post: {
        summary: 'Map assessment to proficiency',
        description: 'Convert raw assessment scores to standardized proficiency levels',
        tags: ['Assessments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rawScore: { type: 'number', example: 85 },
                  scoreScale: {
                    type: 'object',
                    properties: {
                      minValue: { type: 'number', example: 0 },
                      maxValue: { type: 'number', example: 100 },
                    },
                  },
                  proficiencyScaleId: {
                    type: 'string',
                    example: 'https://api.hropen.org/proficiency-scales/4-level',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Proficiency level mapped successfully',
          },
          400: {
            description: 'Invalid proficiency scale',
          },
        },
      },
    },
    '/analytics/skills-inventory': {
      get: {
        summary: 'Skills inventory report',
        description: 'Generate skills inventory analytics across the workforce',
        tags: ['Analytics'],
        parameters: [
          {
            name: 'department',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by department',
          },
          {
            name: 'currentOnly',
            in: 'query',
            schema: { type: 'boolean', default: true },
            description: 'Only include current skill assertions',
          },
        ],
        responses: {
          200: {
            description: 'Skills inventory report generated',
          },
        },
      },
    },
    '/analytics/gap-analysis': {
      post: {
        summary: 'Skills gap analysis',
        description: 'Analyze skills gaps for a target role or population',
        tags: ['Analytics'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  targetRole: { type: 'string' },
                  currentPopulation: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Gap analysis completed',
          },
        },
      },
    },
    '/jedx/jobs/{jobId}/skills': {
      get: {
        summary: 'Get job required skills',
        description: 'Retrieve skill requirements for a specific job (JEDx integration)',
        tags: ['JEDx Integration'],
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Job identifier',
            example: 'swe-001',
          },
        ],
        responses: {
          200: {
            description: 'Job skills retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SkillAssertionCollection' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Set job required skills',
        description: 'Define skill requirements for a job',
        tags: ['JEDx Integration'],
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SkillAssertionCollection' },
            },
          },
        },
        responses: {
          200: {
            description: 'Job skills updated',
          },
        },
      },
    },
    '/credentials/badges': {
      post: {
        summary: 'Issue digital badge',
        description: 'Issue a digital badge credential with skill assertions',
        tags: ['Credentials'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  credentialSubject: { type: 'object' },
                  issuer: { type: 'object' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Badge issued successfully',
          },
        },
      },
    },
    '/taxonomies': {
      get: {
        summary: 'List taxonomies',
        description: 'Get available skills taxonomies (ESCO, O*NET, etc.)',
        tags: ['Taxonomies'],
        responses: {
          200: {
            description: 'List of taxonomies',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Skill: {
        type: 'object',
        properties: {
          '@context': {
            type: 'string',
            example: 'https://schema.org',
          },
          '@type': {
            type: 'string',
            example: 'Skill',
          },
          '@id': {
            type: 'string',
            format: 'uri',
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
            example: 'PYTHON',
          },
        },
        required: ['name'],
      },
      SkillInput: {
        type: 'object',
        properties: {
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
            example: 'PYTHON',
          },
        },
        required: ['name'],
      },
      ProficiencyLevel: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uri',
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
            minimum: 1,
            maximum: 5,
            example: 4,
          },
        },
      },
      ProficiencyScale: {
        type: 'object',
        properties: {
          '@type': {
            type: 'string',
            example: 'DefinedTermSet',
          },
          '@id': {
            type: 'string',
            format: 'uri',
          },
          name: {
            type: 'string',
            example: '5-Level Proficiency Scale',
          },
          description: {
            type: 'string',
          },
          hasDefinedTerm: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                '@type': { type: 'string', example: 'DefinedTerm' },
                termCode: { type: 'string', example: '1' },
                name: { type: 'string', example: 'Fundamental Awareness' },
                description: { type: 'string', example: 'Basic knowledge' },
              },
            },
          },
        },
      },
      SkillAssertion: {
        type: 'object',
        properties: {
          skill: {
            $ref: '#/components/schemas/Skill',
          },
          proficiencyLevel: {
            $ref: '#/components/schemas/ProficiencyLevel',
          },
          proficiencyScale: {
            type: 'integer',
            description: 'Maximum scale value',
            example: 4,
          },
          source: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: { type: 'string', example: 'Assessment' },
              name: { type: 'string' },
            },
          },
        },
      },
      SkillAssertionInput: {
        type: 'object',
        properties: {
          skill: {
            type: 'object',
            properties: {
              '@id': { type: 'string' },
            },
          },
          proficiencyLevel: {
            type: 'object',
          },
          source: {
            type: 'object',
          },
        },
        required: ['skill', 'proficiencyLevel'],
      },
      SkillAssertionCollection: {
        type: 'object',
        properties: {
          identifier: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/people/john-doe',
          },
          targetType: {
            type: 'string',
            enum: ['Person', 'Job', 'LearningProgram', 'Assessment', 'Organization'],
            example: 'Person',
          },
          assertions: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/SkillAssertion',
            },
          },
        },
      },
    },
  },
};
