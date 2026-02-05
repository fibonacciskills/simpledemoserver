const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import routes
const jedxRoutes = require('./routes/jedx');
const skillsRoutes = require('./routes/skills');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// API Info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'JEDx & Skills API Demo Server',
    version: '1.0.0',
    description: 'Demo implementation of HR Open JEDx and Skills Data APIs',
    endpoints: {
      jedx: {
        base: '/api/v1/jedx',
        resources: ['jobs', 'workers', 'organizations', 'reports']
      },
      skills: {
        base: '/api/v1/skills',
        resources: ['skills', 'assertions', 'proficiency-scales', 'analytics']
      }
    },
    documentation: {
      jedx: '/api/v1/jedx/docs',
      skills: '/api/v1/skills/docs'
    },
    sampleData: '/api/v1/sample-data',
    health: '/health'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount routes
app.use('/api/v1/jedx', jedxRoutes);
app.use('/api/v1/skills', skillsRoutes);

// Sample data listing (recursively lists all JSON files)
app.get('/api/v1/sample-data', (req, res) => {
  const sampleDataDir = path.join(__dirname, '..', 'sample-data');

  function getAllJsonFiles(dir, baseDir = dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        getAllJsonFiles(filePath, baseDir, fileList);
      } else if (file.endsWith('.json')) {
        const relativePath = path.relative(baseDir, filePath);
        const urlPath = relativePath.replace(/\\/g, '/').replace('.json', '');
        fileList.push({
          name: relativePath.replace(/\\/g, '/'),
          path: urlPath,
          url: `/api/v1/sample-data/${urlPath}`
        });
      }
    });

    return fileList;
  }

  try {
    const files = getAllJsonFiles(sampleDataDir);
    res.json({
      total: files.length,
      files
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not read sample data directory' });
  }
});

// Serve sample data files (supports subdirectories)
app.get('/api/v1/sample-data/*', (req, res) => {
  const requestedPath = req.params[0]; // Everything after /api/v1/sample-data/
  const filepath = path.join(__dirname, '..', 'sample-data', requestedPath + '.json');

  if (fs.existsSync(filepath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error reading file' });
    }
  } else {
    res.status(404).json({
      error: 'Sample file not found',
      requested: requestedPath
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/v1/jedx/*',
      'GET /api/v1/skills/*',
      'GET /api/v1/sample-data'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   JEDx & Skills API Demo Server                          ║
║   Version: 1.0.0                                          ║
╟───────────────────────────────────────────────────────────╢
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                    ║
╟───────────────────────────────────────────────────────────╢
║   Available APIs:                                         ║
║   • JEDx API:   http://localhost:${PORT}/api/v1/jedx       ║
║   • Skills API: http://localhost:${PORT}/api/v1/skills     ║
║   • Sample Data: http://localhost:${PORT}/api/v1/sample-data ║
╟───────────────────────────────────────────────────────────╢
║   Documentation:                                          ║
║   • API Info: http://localhost:${PORT}/                    ║
║   • Health:   http://localhost:${PORT}/health              ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
