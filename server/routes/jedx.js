const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// In-memory storage (initialized from sample data)
let jobs = [];
let workers = [];
let organizations = [];

// Load sample data on startup
function loadSampleData() {
  const sampleDataDir = path.join(__dirname, '..', '..', 'sample-data');

  // Load JEDx job files
  try {
    const jobFiles = ['job-swe-001.json'];
    jobFiles.forEach(filename => {
      const jobPath = path.join(sampleDataDir, filename);
      if (fs.existsSync(jobPath)) {
        const data = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
        if (data.job) {
          jobs.push(data.job);
        }
      }
    });

    // Also check skillsapi directory for job-skills-architecture
    const skillsApiJob = path.join(sampleDataDir, 'skillsapi', 'job-skills-architecture.json');
    if (fs.existsSync(skillsApiJob)) {
      const data = JSON.parse(fs.readFileSync(skillsApiJob, 'utf8'));
      if (data.job) {
        jobs.push(data.job);
      }
    }

    console.log(`✓ Loaded ${jobs.length} job(s)`);
  } catch (error) {
    console.error('Error loading jobs:', error.message);
  }

  // Load sample workers from stateAgencyArkansas
  try {
    const arkansasDir = path.join(sampleDataDir, 'stateAgencyArkansas_4034');
    if (fs.existsSync(arkansasDir)) {
      const files = fs.readdirSync(arkansasDir).filter(f => f.startsWith('worker') && !f.includes('report'));
      files.forEach(file => {
        const data = JSON.parse(fs.readFileSync(path.join(arkansasDir, file), 'utf8'));
        if (data.worker) {
          workers.push(data.worker);
        }
      });
      console.log(`✓ Loaded ${workers.length} workers`);
    }
  } catch (error) {
    console.error('Error loading workers:', error.message);
  }

  // Load sample organizations
  try {
    const arkansasDir = path.join(sampleDataDir, 'stateAgencyArkansas_4034');
    const orgPath = path.join(arkansasDir, 'organization.json');
    if (fs.existsSync(orgPath)) {
      const data = JSON.parse(fs.readFileSync(orgPath, 'utf8'));
      if (data.organization) {
        organizations.push(data.organization);
      }
      console.log('✓ Loaded organization data');
    }
  } catch (error) {
    console.error('Error loading organization:', error.message);
  }
}

// Initialize data
loadSampleData();

// ==================== JOBS ====================

// Get all jobs
router.get('/jobs', (req, res) => {
  const { organizationId, department, limit = 50, offset = 0 } = req.query;

  let filtered = jobs;

  if (organizationId) {
    filtered = filtered.filter(j => j.organizationId === organizationId);
  }

  if (department) {
    filtered = filtered.filter(j => j.department === department);
  }

  const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    data: paginated,
    pagination: {
      total: filtered.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

// Get job by ID
router.get('/jobs/:jobId', (req, res) => {
  const job = jobs.find(j => j.jobId === req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Load and attach skills data if available
  const skillsFile = path.join(__dirname, '..', '..', 'sample-data', 'skillsapi', `job-${req.params.jobId.toLowerCase()}-skills.json`);

  if (fs.existsSync(skillsFile)) {
    const skillsData = JSON.parse(fs.readFileSync(skillsFile, 'utf8'));
    // Embed skills in the job object
    return res.json({ job: { ...job, skills: skillsData } });
  }

  // If skills already embedded in job object, return as-is
  if (job.skills) {
    return res.json({ job });
  }

  // Return job without skills
  res.json({ job });
});

// Create job
router.post('/jobs', (req, res) => {
  const { job } = req.body;

  if (!job || !job.organizationId || !job.jobId) {
    return res.status(400).json({
      error: 'Missing required fields: organizationId, jobId'
    });
  }

  // Add metadata
  job.RefId = job.RefId || uuidv4();
  job.senderId = job.senderId || 'demo-system-01';
  job.receiverId = job.receiverId || '';

  jobs.push(job);

  res.status(201).json({ job });
});

// Update job
router.put('/jobs/:jobId', (req, res) => {
  const index = jobs.findIndex(j => j.jobId === req.params.jobId);

  if (index === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  jobs[index] = { ...jobs[index], ...req.body.job };

  res.json({ job: jobs[index] });
});

// Delete job
router.delete('/jobs/:jobId', (req, res) => {
  const index = jobs.findIndex(j => j.jobId === req.params.jobId);

  if (index === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  jobs.splice(index, 1);

  res.status(204).send();
});

// Get job skills (integrates with Skills API)
router.get('/jobs/:jobId/skills', (req, res) => {
  const job = jobs.find(j => j.jobId === req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Load skills data from skillsapi directory
  const fs = require('fs');
  const path = require('path');
  const skillsFile = path.join(__dirname, '..', '..', 'sample-data', 'skillsapi', `job-${req.params.jobId.toLowerCase()}-skills.json`);

  if (fs.existsSync(skillsFile)) {
    const skillsData = JSON.parse(fs.readFileSync(skillsFile, 'utf8'));
    return res.json(skillsData);
  }

  // If embedded skills exist in job object (legacy format)
  if (job.skills) {
    return res.json(job.skills);
  }

  // Return empty skills in OpenAPI format
  res.json({
    identifier: `https://api.jedx.example.com/jobs/${req.params.jobId}`,
    targetType: "Job",
    assertions: []
  });
});

// ==================== WORKERS ====================

// Get all workers
router.get('/workers', (req, res) => {
  const { organizationId, limit = 50, offset = 0 } = req.query;

  let filtered = workers;

  if (organizationId) {
    filtered = filtered.filter(w => w.organizationRefId === organizationId);
  }

  const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    data: paginated,
    pagination: {
      total: filtered.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

// Get worker by ID
router.get('/workers/:workerId', (req, res) => {
  const worker = workers.find(w =>
    w.workerId?.value === req.params.workerId ||
    w.RefId === req.params.workerId
  );

  if (!worker) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  res.json({ worker });
});

// Create worker
router.post('/workers', (req, res) => {
  const { worker } = req.body;

  if (!worker || !worker.workerId || !worker.ssn || !worker.name) {
    return res.status(400).json({
      error: 'Missing required fields: workerId, ssn, name'
    });
  }

  worker.RefId = worker.RefId || uuidv4();
  worker.senderId = worker.senderId || 'demo-system-01';

  workers.push(worker);

  res.status(201).json({ worker });
});

// Update worker
router.put('/workers/:workerId', (req, res) => {
  const index = workers.findIndex(w =>
    w.workerId?.value === req.params.workerId ||
    w.RefId === req.params.workerId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  workers[index] = { ...workers[index], ...req.body.worker };

  res.json({ worker: workers[index] });
});

// Delete worker
router.delete('/workers/:workerId', (req, res) => {
  const index = workers.findIndex(w =>
    w.workerId?.value === req.params.workerId ||
    w.RefId === req.params.workerId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  workers.splice(index, 1);

  res.status(204).send();
});

// ==================== ORGANIZATIONS ====================

// Get all organizations
router.get('/organizations', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  const paginated = organizations.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    data: paginated,
    pagination: {
      total: organizations.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

// Get organization by ID
router.get('/organizations/:orgId', (req, res) => {
  const org = organizations.find(o =>
    o.organizationId?.value === req.params.orgId ||
    o.RefId === req.params.orgId
  );

  if (!org) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  res.json({ organization: org });
});

// Create organization
router.post('/organizations', (req, res) => {
  const { organization } = req.body;

  if (!organization || !organization.organizationId) {
    return res.status(400).json({
      error: 'Missing required field: organizationId'
    });
  }

  organization.RefId = organization.RefId || uuidv4();
  organization.senderId = organization.senderId || 'demo-system-01';

  organizations.push(organization);

  res.status(201).json({ organization });
});

// Update organization
router.put('/organizations/:orgId', (req, res) => {
  const index = organizations.findIndex(o =>
    o.organizationId?.value === req.params.orgId ||
    o.RefId === req.params.orgId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  organizations[index] = { ...organizations[index], ...req.body.organization };

  res.json({ organization: organizations[index] });
});

// Delete organization
router.delete('/organizations/:orgId', (req, res) => {
  const index = organizations.findIndex(o =>
    o.organizationId?.value === req.params.orgId ||
    o.RefId === req.params.orgId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  organizations.splice(index, 1);

  res.status(204).send();
});

// ==================== REPORTS ====================

// In-memory storage for reports
let compensationReports = [];
let hoursReports = [];

// Get worker compensation reports
router.get('/reports/compensation', (req, res) => {
  const { workerId, organizationId, startDate, endDate, limit = 50, offset = 0 } = req.query;

  let filtered = compensationReports;

  if (workerId) {
    filtered = filtered.filter(r =>
      r.workerId?.value === workerId ||
      r.workerRefId === workerId
    );
  }

  if (organizationId) {
    filtered = filtered.filter(r => r.organizationId === organizationId);
  }

  if (startDate) {
    filtered = filtered.filter(r => r.reportingPeriod?.startDate >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(r => r.reportingPeriod?.endDate <= endDate);
  }

  const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    data: paginated,
    pagination: {
      total: filtered.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

// Create compensation report
router.post('/reports/compensation', (req, res) => {
  const { worker_compensation_report } = req.body;

  if (!worker_compensation_report || !worker_compensation_report.workerRefId || !worker_compensation_report.reportingPeriod) {
    return res.status(400).json({
      error: 'Missing required fields: workerRefId, reportingPeriod'
    });
  }

  worker_compensation_report.RefId = worker_compensation_report.RefId || uuidv4();
  worker_compensation_report.senderId = worker_compensation_report.senderId || 'demo-system-01';

  compensationReports.push(worker_compensation_report);

  res.status(201).json({ worker_compensation_report });
});

// Get worker paid hours reports
router.get('/reports/hours', (req, res) => {
  const { workerId, organizationId, startDate, endDate, limit = 50, offset = 0 } = req.query;

  let filtered = hoursReports;

  if (workerId) {
    filtered = filtered.filter(r =>
      r.workerId?.value === workerId ||
      r.workerRefId === workerId
    );
  }

  if (organizationId) {
    filtered = filtered.filter(r => r.organizationId === organizationId);
  }

  if (startDate) {
    filtered = filtered.filter(r => r.reportingPeriod?.startDate >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(r => r.reportingPeriod?.endDate <= endDate);
  }

  const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    data: paginated,
    pagination: {
      total: filtered.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

// Create paid hours report
router.post('/reports/hours', (req, res) => {
  const { worker_paid_hours_report } = req.body;

  if (!worker_paid_hours_report || !worker_paid_hours_report.workerRefId || !worker_paid_hours_report.reportingPeriod) {
    return res.status(400).json({
      error: 'Missing required fields: workerRefId, reportingPeriod'
    });
  }

  worker_paid_hours_report.RefId = worker_paid_hours_report.RefId || uuidv4();
  worker_paid_hours_report.senderId = worker_paid_hours_report.senderId || 'demo-system-01';

  hoursReports.push(worker_paid_hours_report);

  res.status(201).json({ worker_paid_hours_report });
});

// ==================== SCHEMAS ====================

// Get all schemas
router.get('/schemas', (req, res) => {
  res.json({
    schemas: [
      {
        name: 'job',
        description: 'Job Exchange Data schema for job roles and positions',
        url: '/api/v1/jedx/schemas/job'
      },
      {
        name: 'worker',
        description: 'Worker (employee) data schema',
        url: '/api/v1/jedx/schemas/worker'
      },
      {
        name: 'organization',
        description: 'Organization (employer) data schema',
        url: '/api/v1/jedx/schemas/organization'
      },
      {
        name: 'worker_compensation_report',
        description: 'Worker compensation reporting schema',
        url: '/api/v1/jedx/schemas/compensation-report'
      },
      {
        name: 'worker_paid_hours_report',
        description: 'Worker paid hours reporting schema',
        url: '/api/v1/jedx/schemas/hours-report'
      }
    ]
  });
});

// Get job schema
router.get('/schemas/job', (req, res) => {
  res.json({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Job',
    description: 'JEDx Job schema',
    type: 'object',
    properties: {
      RefId: { type: 'string', format: 'uuid' },
      senderId: { type: 'string' },
      receiverId: { type: 'string' },
      organizationRefId: { type: 'string', format: 'uuid' },
      organizationId: { type: 'string' },
      jobId: { type: 'string' },
      title: { type: 'string' },
      jobDuties: { type: 'string' },
      department: { type: 'string' },
      subDepartment: { type: 'string' },
      socInfo: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            classificationSys: { type: 'string' },
            assigningEntity: { type: 'string' },
            socCodeValue: { type: 'string' }
          }
        }
      }
    },
    required: ['organizationId', 'jobId', 'title'],
    additionalProperties: false
  });
});

// Get worker schema
router.get('/schemas/worker', (req, res) => {
  res.json({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Worker',
    description: 'JEDx Worker schema',
    type: 'object',
    properties: {
      RefId: { type: 'string', format: 'uuid' },
      senderId: { type: 'string' },
      organizationRefId: { type: 'string', format: 'uuid' },
      workerId: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          schemeId: { type: 'string' },
          schemeVersionId: { type: 'string' }
        }
      },
      ssn: {
        type: 'object',
        properties: {
          value: { type: 'string' }
        }
      },
      name: {
        type: 'object',
        properties: {
          languageCode: { type: 'string' },
          firstName: { type: 'string' },
          middleName: { type: 'string' },
          family: { type: 'string' }
        }
      },
      birthDate: { type: 'string', format: 'date' }
    },
    required: ['workerId', 'ssn', 'name'],
    additionalProperties: true
  });
});

// Get organization schema
router.get('/schemas/organization', (req, res) => {
  res.json({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Organization',
    description: 'JEDx Organization schema',
    type: 'object',
    properties: {
      RefId: { type: 'string', format: 'uuid' },
      senderId: { type: 'string' },
      organizationId: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          issuingAuthority: { type: 'string' }
        }
      },
      taxIds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: { type: 'string' },
            schemeId: { type: 'string' },
            description: { type: 'string' }
          }
        }
      },
      name: { type: 'string' },
      'isMulti-state': { type: 'boolean' }
    },
    required: ['organizationId', 'name'],
    additionalProperties: true
  });
});

// ==================== DOCUMENTATION ====================

router.get('/docs', (req, res) => {
  res.json({
    name: 'JEDx API',
    version: '1.0.0',
    description: 'Job Exchange Data API for workforce data exchange',
    baseUrl: '/api/v1/jedx',
    resources: {
      jobs: {
        endpoints: [
          'GET /jobs',
          'GET /jobs/:jobId',
          'POST /jobs',
          'PUT /jobs/:jobId',
          'DELETE /jobs/:jobId',
          'GET /jobs/:jobId/skills (Skills API integration)'
        ]
      },
      workers: {
        endpoints: [
          'GET /workers',
          'GET /workers/:workerId',
          'POST /workers'
        ]
      },
      organizations: {
        endpoints: [
          'GET /organizations',
          'GET /organizations/:orgId',
          'POST /organizations'
        ]
      }
    },
    currentData: {
      jobs: jobs.length,
      workers: workers.length,
      organizations: organizations.length
    }
  });
});

module.exports = router;
