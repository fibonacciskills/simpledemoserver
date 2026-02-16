/**
 * Swagger/OpenAPI 3.0 Configuration for JEDx API
 * HR Open Job Exchange Data (JEDx) API
 */

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'HR Open JEDx API',
    version: '1.0.0',
    description: `
# Job Exchange Data (JEDx) API

The **JEDx API** provides a standardized format for exchanging workforce data including jobs, workers, organizations, and reporting.

## Key Features
- 📋 **Job Postings**: Structured job role and position data
- 👥 **Worker Profiles**: Employee information and records
- 🏢 **Organizations**: Employer data and organizational structure
- 📊 **Reporting**: Compensation and hours reporting

## Integration
- **Skills API Integration**: Jobs can link to detailed skill requirements via the Skills API
- **TCP/CLR Integration**: Worker profiles can reference portable career credentials
- **Privacy-Focused**: Supports privacy pod URLs for sensitive data

## Use Cases
- Job posting and distribution
- Workforce data exchange between systems
- Talent acquisition and recruiting
- HR data integration and reporting
- Employment verification
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
      url: 'http://localhost:3000/api/v1/jedx',
      description: 'Development server',
    },
    {
      url: 'https://api.jedx.example.com/v1',
      description: 'Production server (example)',
    },
  ],
  tags: [
    {
      name: 'Jobs',
      description: 'Job roles and position management',
    },
    {
      name: 'Workers',
      description: 'Worker (employee) profile management',
    },
    {
      name: 'Organizations',
      description: 'Organization (employer) data management',
    },
    {
      name: 'Reports',
      description: 'Compensation and hours reporting',
    },
    {
      name: 'Schemas',
      description: 'JSON Schema definitions for data structures',
    },
  ],
  paths: {
    '/jobs': {
      get: {
        summary: 'List all jobs',
        description: 'Retrieve a paginated list of job postings with optional filtering',
        tags: ['Jobs'],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by organization ID',
          },
          {
            name: 'department',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by department',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 },
            description: 'Maximum number of results',
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
            description: 'List of jobs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Job' },
                    },
                    pagination: {
                      $ref: '#/components/schemas/Pagination',
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a job',
        description: 'Create a new job posting',
        tags: ['Jobs'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  job: { $ref: '#/components/schemas/JobInput' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Job created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    job: { $ref: '#/components/schemas/Job' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/jobs/{jobId}': {
      get: {
        summary: 'Get job by ID',
        description: 'Retrieve a specific job posting by its identifier',
        tags: ['Jobs'],
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Job identifier',
            example: 'SWE-001',
          },
        ],
        responses: {
          200: {
            description: 'Job retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    job: { $ref: '#/components/schemas/Job' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Job not found',
          },
        },
      },
      put: {
        summary: 'Update job',
        description: 'Update an existing job posting',
        tags: ['Jobs'],
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
              schema: {
                type: 'object',
                properties: {
                  job: { $ref: '#/components/schemas/JobInput' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Job updated successfully',
          },
          404: {
            description: 'Job not found',
          },
        },
      },
      delete: {
        summary: 'Delete job',
        description: 'Delete a job posting',
        tags: ['Jobs'],
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: {
            description: 'Job deleted successfully',
          },
          404: {
            description: 'Job not found',
          },
        },
      },
    },
    '/jobs/{jobId}/skills': {
      get: {
        summary: 'Get job skill requirements',
        description: 'Retrieve skill requirements for a job (integrates with Skills API)',
        tags: ['Jobs'],
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'SWE-001',
          },
        ],
        responses: {
          200: {
            description: 'Job skills retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    identifier: { type: 'string' },
                    targetType: { type: 'string', example: 'Job' },
                    assertions: { type: 'array' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Job not found',
          },
        },
      },
    },
    '/workers': {
      get: {
        summary: 'List all workers',
        description: 'Retrieve a paginated list of workers (employees)',
        tags: ['Workers'],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by organization ID',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 },
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', default: 0 },
          },
        ],
        responses: {
          200: {
            description: 'List of workers',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Worker' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a worker',
        description: 'Create a new worker profile',
        tags: ['Workers'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  worker: { $ref: '#/components/schemas/WorkerInput' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Worker created successfully',
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/workers/{workerId}': {
      get: {
        summary: 'Get worker by ID',
        description: 'Retrieve a specific worker profile',
        tags: ['Workers'],
        parameters: [
          {
            name: 'workerId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Worker retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    worker: { $ref: '#/components/schemas/Worker' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Worker not found',
          },
        },
      },
      put: {
        summary: 'Update worker',
        description: 'Update worker profile',
        tags: ['Workers'],
        parameters: [
          {
            name: 'workerId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  worker: { $ref: '#/components/schemas/WorkerInput' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Worker updated',
          },
          404: {
            description: 'Worker not found',
          },
        },
      },
      delete: {
        summary: 'Delete worker',
        description: 'Delete a worker profile',
        tags: ['Workers'],
        parameters: [
          {
            name: 'workerId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: {
            description: 'Worker deleted',
          },
          404: {
            description: 'Worker not found',
          },
        },
      },
    },
    '/organizations': {
      get: {
        summary: 'List all organizations',
        description: 'Retrieve a paginated list of organizations',
        tags: ['Organizations'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 },
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', default: 0 },
          },
        ],
        responses: {
          200: {
            description: 'List of organizations',
          },
        },
      },
      post: {
        summary: 'Create organization',
        description: 'Create a new organization',
        tags: ['Organizations'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  organization: { $ref: '#/components/schemas/OrganizationInput' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Organization created',
          },
        },
      },
    },
    '/organizations/{orgId}': {
      get: {
        summary: 'Get organization by ID',
        description: 'Retrieve organization details',
        tags: ['Organizations'],
        parameters: [
          {
            name: 'orgId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Organization retrieved',
          },
          404: {
            description: 'Organization not found',
          },
        },
      },
    },
    '/reports/compensation': {
      get: {
        summary: 'Get compensation reports',
        description: 'Retrieve worker compensation reports',
        tags: ['Reports'],
        parameters: [
          {
            name: 'workerId',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'organizationId',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'startDate',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
          {
            name: 'endDate',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: {
          200: {
            description: 'Compensation reports retrieved',
          },
        },
      },
      post: {
        summary: 'Create compensation report',
        description: 'Submit a new compensation report',
        tags: ['Reports'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  worker_compensation_report: { type: 'object' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Report created',
          },
        },
      },
    },
    '/reports/hours': {
      get: {
        summary: 'Get hours reports',
        description: 'Retrieve worker paid hours reports',
        tags: ['Reports'],
        responses: {
          200: {
            description: 'Hours reports retrieved',
          },
        },
      },
      post: {
        summary: 'Create hours report',
        description: 'Submit a new paid hours report',
        tags: ['Reports'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  worker_paid_hours_report: { type: 'object' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Report created',
          },
        },
      },
    },
    '/schemas': {
      get: {
        summary: 'List all schemas',
        description: 'Get all available JSON Schema definitions',
        tags: ['Schemas'],
        responses: {
          200: {
            description: 'List of schemas',
          },
        },
      },
    },
    '/schemas/job': {
      get: {
        summary: 'Get job schema',
        description: 'Retrieve JSON Schema for Job',
        tags: ['Schemas'],
        responses: {
          200: {
            description: 'Job schema',
          },
        },
      },
    },
    '/schemas/worker': {
      get: {
        summary: 'Get worker schema',
        description: 'Retrieve JSON Schema for Worker',
        tags: ['Schemas'],
        responses: {
          200: {
            description: 'Worker schema',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Job: {
        type: 'object',
        properties: {
          RefId: {
            type: 'string',
            format: 'uuid',
            description: 'Unique reference identifier',
          },
          organizationRefId: {
            type: 'string',
            format: 'uuid',
            description: 'Reference to organization',
          },
          podURL: {
            type: 'string',
            format: 'uri',
            description: 'Privacy pod URL for sensitive data',
          },
          organizationId: {
            type: 'string',
            description: 'Organization identifier',
            example: 'TechCorp-2026',
          },
          jobId: {
            type: 'string',
            description: 'Job identifier',
            example: 'SWE-001',
          },
          title: {
            type: 'string',
            description: 'Job title',
            example: 'Senior Software Engineer',
          },
          jobDuties: {
            type: 'string',
            description: 'Job duties and responsibilities',
          },
          department: {
            type: 'string',
            description: 'Department name',
          },
          socInfo: {
            type: 'array',
            description: 'SOC (Standard Occupational Classification) codes',
            items: {
              type: 'object',
              properties: {
                classificationSys: { type: 'string' },
                assigningEntity: { type: 'string' },
                socCodeValue: {
                  type: 'string',
                  example: '15-1252',
                },
              },
            },
          },
        },
        required: ['organizationId', 'jobId'],
      },
      JobInput: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            example: 'TechCorp-2026',
          },
          jobId: {
            type: 'string',
            example: 'SWE-001',
          },
          title: {
            type: 'string',
            example: 'Senior Software Engineer',
          },
          jobDuties: {
            type: 'string',
          },
        },
        required: ['organizationId', 'jobId'],
      },
      Worker: {
        type: 'object',
        properties: {
          RefId: {
            type: 'string',
            format: 'uuid',
          },
          workerId: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              schemeId: { type: 'string' },
            },
          },
          ssn: {
            type: 'object',
            properties: {
              value: { type: 'string' },
            },
          },
          name: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              middleName: { type: 'string' },
              family: { type: 'string' },
            },
          },
        },
      },
      WorkerInput: {
        type: 'object',
        properties: {
          workerId: {
            type: 'object',
            properties: {
              value: { type: 'string' },
            },
          },
          ssn: {
            type: 'object',
            properties: {
              value: { type: 'string' },
            },
          },
          name: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              family: { type: 'string' },
            },
          },
        },
        required: ['workerId', 'ssn', 'name'],
      },
      OrganizationInput: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'object',
            properties: {
              value: { type: 'string' },
            },
          },
          tradeName: {
            type: 'string',
          },
        },
        required: ['organizationId'],
      },
      Pagination: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            description: 'Total number of items',
          },
          limit: {
            type: 'integer',
            description: 'Items per page',
          },
          offset: {
            type: 'integer',
            description: 'Number of items skipped',
          },
        },
      },
    },
  },
};
