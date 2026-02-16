# Swagger API Documentation

The `/docs` endpoints have been enhanced with **Swagger UI** for interactive API documentation using the OpenAPI 3.0 specification.

## 📚 Access Documentation

### Skills API Documentation
- **Swagger UI**: http://localhost:3000/api/v1/skills/docs
- **OpenAPI JSON**: http://localhost:3000/api/v1/skills/openapi.json
- **Legacy JSON**: http://localhost:3000/api/v1/skills/docs-legacy

### JEDx API Documentation
- **Swagger UI**: http://localhost:3000/api/v1/jedx/docs
- **OpenAPI JSON**: http://localhost:3000/api/v1/jedx/openapi.json
- **Legacy JSON**: http://localhost:3000/api/v1/jedx/docs-legacy

## ✨ Features

### Interactive Swagger UI
- **Try It Out**: Test API endpoints directly from the browser
- **Request/Response Examples**: See example payloads and responses
- **Schema Validation**: Understand data structures and requirements
- **Authentication Support**: Test protected endpoints (when implemented)
- **Export Options**: Download OpenAPI specs for code generation

### Comprehensive Documentation
- **Standards Compliance**: OpenAPI 3.0 specification
- **Detailed Descriptions**: Each endpoint includes usage notes and examples
- **Schema Definitions**: Full data model documentation
- **Integration Guides**: See how Skills API and JEDx work together

## 🎯 Skills API Highlights

The Skills API documentation includes:
- **Skills Management**: CRUD operations for skills taxonomy
- **Skill Assertions**: Create and query skill proficiency assertions
- **Proficiency Scales**: Standard proficiency level definitions
- **Assessments**: Map assessment scores to proficiency levels
- **Analytics**: Workforce skills inventory and gap analysis
- **JEDx Integration**: Job skill requirements endpoints
- **Credentials**: Digital badge issuance
- **Taxonomies**: Skills taxonomy mappings (ESCO, O*NET, etc.)

## 💼 JEDx API Highlights

The JEDx API documentation includes:
- **Jobs**: Job posting management and skill requirements
- **Workers**: Worker profile management
- **Organizations**: Organization data management
- **Reports**: Compensation and hours reporting
- **Schemas**: JSON Schema definitions for data structures

## 🚀 Getting Started

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Open Swagger UI**:
   - Skills API: http://localhost:3000/api/v1/skills/docs
   - JEDx API: http://localhost:3000/api/v1/jedx/docs

3. **Try the APIs**:
   - Click on any endpoint to expand it
   - Click "Try it out" to test the endpoint
   - Fill in parameters and click "Execute"
   - View the response below

## 📋 OpenAPI Spec Files

The OpenAPI specifications are located at:
- `server/config/swagger-skills.js` - Skills API spec
- `server/config/swagger-jedx.js` - JEDx API spec

These files can be used with:
- **Code Generators**: Generate client SDKs in multiple languages
- **API Testing Tools**: Import into Postman, Insomnia, etc.
- **Documentation Generators**: Create custom documentation
- **API Gateways**: Configure Kong, AWS API Gateway, etc.

## 🔧 Customization

### Swagger UI Options
Edit `server/server.js` to customize Swagger UI appearance:

```javascript
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'HR Open Standards API Documentation',
};
```

### Adding New Endpoints
1. Add the endpoint to the route file (e.g., `routes/skills.js`)
2. Document it in the appropriate Swagger config (e.g., `config/swagger-skills.js`)
3. Restart the server to see changes

## 🌐 Integration

### Import into Postman
1. Get the OpenAPI JSON: http://localhost:3000/api/v1/skills/openapi.json
2. In Postman: Import → Link → Paste URL
3. All endpoints will be available as a collection

### Generate Client SDKs
Use OpenAPI Generator to create client libraries:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate Python client
openapi-generator-cli generate \
  -i http://localhost:3000/api/v1/skills/openapi.json \
  -g python \
  -o ./python-client

# Generate TypeScript/Axios client
openapi-generator-cli generate \
  -i http://localhost:3000/api/v1/skills/openapi.json \
  -g typescript-axios \
  -o ./ts-client
```

## 📦 Dependencies

The following packages were added:
- `swagger-ui-express@^5.0.0` - Serves Swagger UI
- `swagger-jsdoc@^6.2.8` - Generates OpenAPI specs from JSDoc comments (not currently used but available)

## 🔗 Related Links

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [HR Open Standards](https://www.hropenstandards.org/)
- [Skills API Announcement](https://www.hropenstandards.org/news/hr-open-standards-announces-pre-release-of-the-first-ever-skills-proficiency-data-api-schema)
- [Trusted Career Profile (TCP)](https://www.hropenstandards.org/news/hr-open-standards-announces-official-release-of-the-trusted-career-profile-tcp)
