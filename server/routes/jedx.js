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

  // Load job-skills-architecture
  try {
    const jobSkillsPath = path.join(sampleDataDir, 'job-skills-architecture.json');
    if (fs.existsSync(jobSkillsPath)) {
      const data = JSON.parse(fs.readFileSync(jobSkillsPath, 'utf8'));
      jobs.push(data.job);
      console.log('✓ Loaded job-skills-architecture.json');
    }
  } catch (error) {
    console.error('Error loading job-skills-architecture:', error.message);
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

  if (job.skills) {
    res.json(job.skills);
  } else {
    res.json({
      "@context": [
        "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
        "https://schema.org"
      ],
      "@type": "SkillAssertionCollection",
      "targetType": "https://schema.org/JobPosting",
      "targetId": `https://api.jedx.example.com/jobs/${req.params.jobId}`,
      "assertions": [],
      "assertionStatus": "none-declared"
    });
  }
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
