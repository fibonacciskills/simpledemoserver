# JEDx API - Postman Collection Guide

## Overview

This Postman collection provides a complete set of endpoints for the Job Exchange Data (JEDx) API, including integration with the Skills Proficiency API.

## Import Instructions

### Method 1: Import from File
1. Open Postman
2. Click **Import** button (top left)
3. Select **Upload Files**
4. Choose `JEDx_API.postman_collection.json`
5. Click **Import**

### Method 2: Import from Raw Text
1. Open Postman
2. Click **Import** → **Raw text**
3. Copy and paste the entire contents of `JEDx_API.postman_collection.json`
4. Click **Import**

## Configuration

### Setting Up Environment Variables

After importing, configure the collection variables:

1. Click on the **JEDx API Collection**
2. Go to the **Variables** tab
3. Update these values:
   - `base_url`: Your JEDx API base URL (default: `https://api.jedx.example.com/v1`)
   - `api_token`: Your authentication token

### Authorization

The collection uses **Bearer Token** authentication. The token is automatically included in all requests using the `{{api_token}}` variable.

## Collection Structure

### 📁 Jobs
Complete CRUD operations for job management:
- **GET** `/jobs` - List all jobs with filtering
- **GET** `/jobs/:jobId` - Get single job
- **POST** `/jobs` - Create new job
- **PUT** `/jobs/:jobId` - Update job
- **DELETE** `/jobs/:jobId` - Delete job
- **GET** `/jobs/:jobId/skills` - Get job skills (Skills API format)

### 📁 Workers
Worker (employee) management:
- **GET** `/workers` - List workers
- **GET** `/workers/:workerId` - Get worker details
- **POST** `/workers` - Create worker
- **PUT** `/workers/:workerId` - Update worker
- **DELETE** `/workers/:workerId` - Delete worker

⚠️ **Note**: Worker endpoints contain PII. Ensure proper authorization.

### 📁 Organizations
Organization (employer) management:
- **GET** `/organizations` - List organizations
- **GET** `/organizations/:orgId` - Get organization
- **POST** `/organizations` - Create organization
- **PUT** `/organizations/:orgId` - Update organization
- **DELETE** `/organizations/:orgId` - Delete organization

### 📁 Reports
Worker compensation and hours reporting:
- **GET** `/reports/compensation` - Get compensation reports
- **POST** `/reports/compensation` - Submit compensation report
- **GET** `/reports/hours` - Get paid hours reports
- **POST** `/reports/hours` - Submit hours report

### 📁 Skills API
IMS Global Open Badges v3.0 compatible skills endpoints:
- **GET** `/skills` - Get skills for any target (Job, Person, Role, etc.)
- **PUT** `/skills` - Create/update skill assertions
- **GET** `/proficiency-scales` - List available scales
- **GET** `/proficiency-scales/:scaleId` - Get scale details

### 📁 Schemas
JSON Schema endpoints:
- **GET** `/schemas` - List all schemas
- **GET** `/schemas/job` - Job schema
- **GET** `/schemas/worker` - Worker schema
- **GET** `/schemas/organization` - Organization schema

## Key Features

### 1. Skills API Integration

The collection includes full Skills Proficiency API support:

```
GET /jobs/SWE-001/skills
```

Returns skills in IMS Global Open Badges v3.0 format:
- JSON-LD context
- SkillAssertionCollection with assertions
- Proficiency levels with ranks
- URI-based identifiers

### 2. Query Parameters

Most GET endpoints support filtering:
- `organizationId` - Filter by organization
- `department` - Filter by department
- `limit` / `offset` - Pagination
- `startDate` / `endDate` - Date range filtering

### 3. Sample Responses

Many endpoints include example responses showing:
- Successful responses (200, 201)
- Data structure examples
- Real sample data from the project

### 4. Comprehensive Documentation

Each request includes:
- Description of what it does
- Parameter explanations
- Response examples
- Usage notes and warnings

## Example Workflows

### Workflow 1: Create Job with Skills

1. **Create Organization** (if needed)
   ```
   POST /organizations
   ```

2. **Create Job**
   ```
   POST /jobs
   Body: {
     "job": {
       "organizationId": "TechCorp-2026",
       "jobId": "SWE-001",
       "title": "Senior Software Engineer",
       ...
     }
   }
   ```

3. **Add Skills to Job**
   ```
   PUT /skills
   Body: SkillAssertionCollection (JSON-LD format)
   ```

4. **Verify Skills**
   ```
   GET /jobs/SWE-001/skills
   ```

### Workflow 2: Worker Management

1. **Create Worker**
   ```
   POST /workers
   ```

2. **Submit Compensation Report**
   ```
   POST /reports/compensation
   ```

3. **Submit Hours Report**
   ```
   POST /reports/hours
   ```

4. **Query Reports**
   ```
   GET /reports/compensation?workerId=AGY-758391&startDate=2026-01-01
   ```

### Workflow 3: Skills Analysis

1. **Get Job Skills**
   ```
   GET /jobs/SWE-001/skills
   ```

2. **Get Proficiency Scale Details**
   ```
   GET /proficiency-scales/5-level
   ```

3. **Compare Skills Across Jobs**
   ```
   GET /skills?identifier=https://techcorp.example.com/jobs/SWE-001&targetType=Job
   GET /skills?identifier=https://techcorp.example.com/jobs/SWE-002&targetType=Job
   ```

## Data Standards Reference

### JEDx Metadata Fields

All JEDx objects include:
- `RefId` - UUID reference identifier
- `senderId` - Sender system identifier
- `receiverId` - Receiver system identifier (optional)
- `podURL` - Privacy Obligation Document URL
- `organizationRefId` - Reference to organization

### Skills API Format

Skills follow the SkillAssertionCollection schema:
```json
{
  "@context": [...],
  "id": "https://example.com/jobs/123",
  "type": "SkillAssertionCollection",
  "targetType": "https://schema.org/JobPosting",
  "assertions": [
    {
      "type": "SkillAssertion",
      "skill": { ... },
      "proficiencyLevel": { ... },
      "proficiencyScale": "https://..."
    }
  ]
}
```

### SOC Code Reference

SOC (Standard Occupational Classification) info:
- `classificationSys`: "1" = US SOC, "2" = ISCO, "3" = ESCO, etc.
- `assigningEntity`: "1" = Employer, "2" = State Agency, "3" = BLS, etc.
- `socCodeValue`: The actual SOC code (e.g., "15-1252")

## Testing

### Using Pre-request Scripts

Add this to test dynamic data:
```javascript
pm.variables.set("timestamp", Date.now());
pm.variables.set("uuid", pm.variables.replaceIn('{{$randomUUID}}'));
```

### Using Test Scripts

Add this to validate responses:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has job object", function () {
    pm.expect(pm.response.json()).to.have.property('job');
});
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check that `api_token` is set in collection variables
   - Verify token is valid and not expired

2. **404 Not Found**
   - Verify the `base_url` is correct
   - Check that resource IDs exist (e.g., jobId, workerId)

3. **400 Bad Request**
   - Validate JSON body against schema
   - Ensure required fields are present
   - Check data types (strings vs numbers)

4. **Schema Validation Errors**
   - Use `/schemas/:type` endpoints to get current schema
   - Validate against JSON Schema Draft-07

## Additional Resources

- **JEDx Schemas**: `/schemas` directory in the project
- **Skills API Spec**: `skillsapi/openapi.yaml`
- **Sample Data**: `sample-data/` directory
- **IMS Global OB Context**: https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json

## API Versioning

Current version: **v1**

All endpoints are prefixed with `/v1` in the base URL.

## Support

For questions or issues:
1. Check the schema files in `/schemas`
2. Review sample data in `/sample-data`
3. Consult the Skills API OpenAPI spec in `/skillsapi`

---

**Generated**: 2026-02-03
**Format**: Postman Collection v2.1.0
**Compatible**: Postman, Insomnia, and other API clients supporting the format
