const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// In-memory storage
let skills = [];
let assertions = [];
let proficiencyScales = [];
let courses = [];
let badges = [];
let personProfiles = [];

// Load sample data
function loadSampleData() {
  const sampleDataDir = path.join(__dirname, '..', '..', 'sample-data');

  // Load person skills profile
  try {
    const personPath = path.join(sampleDataDir, 'person-skills-profile.json');
    if (fs.existsSync(personPath)) {
      const data = JSON.parse(fs.readFileSync(personPath, 'utf8'));
      personProfiles.push(data);
      // Extract assertions and skills
      if (data.assertions) {
        assertions.push(...data.assertions);
        data.assertions.forEach(a => {
          if (a.skill && !skills.find(s => s['@id'] === a.skill['@id'])) {
            skills.push(a.skill);
          }
        });
      }
      console.log('✓ Loaded person-skills-profile.json');
    }
  } catch (error) {
    console.error('Error loading person profile:', error.message);
  }

  // Load course skills
  try {
    const coursePath = path.join(sampleDataDir, 'course-skills-assertions.json');
    if (fs.existsSync(coursePath)) {
      const data = JSON.parse(fs.readFileSync(coursePath, 'utf8'));
      courses.push(data);
      if (data.assertions) {
        data.assertions.forEach(a => {
          if (a.skill && !skills.find(s => s['@id'] === a.skill['@id'])) {
            skills.push(a.skill);
          }
        });
      }
      console.log('✓ Loaded course-skills-assertions.json');
    }
  } catch (error) {
    console.error('Error loading course:', error.message);
  }

  // Load open badge
  try {
    const badgePath = path.join(sampleDataDir, 'open-badge-credential.json');
    if (fs.existsSync(badgePath)) {
      const data = JSON.parse(fs.readFileSync(badgePath, 'utf8'));
      badges.push(data);
      if (data.credentialSubject?.skillAssertion) {
        data.credentialSubject.skillAssertion.forEach(a => {
          if (a.skill && !skills.find(s => s['@id'] === a.skill['@id'])) {
            skills.push(a.skill);
          }
        });
      }
      console.log('✓ Loaded open-badge-credential.json');
    }
  } catch (error) {
    console.error('Error loading badge:', error.message);
  }

  // Load job skills
  try {
    const jobPath = path.join(sampleDataDir, 'job-skills-architecture.json');
    if (fs.existsSync(jobPath)) {
      const data = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
      if (data.job?.skills?.assertions) {
        data.job.skills.assertions.forEach(a => {
          if (a.skill && !skills.find(s => s['@id'] === a.skill['@id'])) {
            skills.push(a.skill);
          }
        });
      }
      console.log('✓ Loaded skills from job-skills-architecture.json');
    }
  } catch (error) {
    console.error('Error loading job skills:', error.message);
  }

  // Create default proficiency scales
  proficiencyScales.push({
    '@type': 'DefinedTermSet',
    '@id': 'https://api.hropen.org/proficiency-scales/4-level',
    'name': '5-Level Proficiency Scale',
    'description': 'Standard 5-level proficiency scale',
    'hasDefinedTerm': [
      { '@type': 'DefinedTerm', termCode: '1', name: 'Fundamental Awareness', description: 'Basic knowledge' },
      { '@type': 'DefinedTerm', termCode: '2', name: 'Novice', description: 'Working knowledge with guidance' },
      { '@type': 'DefinedTerm', termCode: '3', name: 'Intermediate', description: 'Routine independence' },
      { '@type': 'DefinedTerm', termCode: '4', name: 'Advanced', description: 'Complex contexts' },
      { '@type': 'DefinedTerm', termCode: '5', name: 'Expert', description: 'Recognized authority' }
    ]
  });

  console.log(`✓ Loaded ${skills.length} unique skills`);
  console.log(`✓ Loaded ${assertions.length} skill assertions`);
}

loadSampleData();

// ==================== SKILLS ====================

// Get all skills
router.get('/skills', (req, res) => {
  const { taxonomy, category, search, limit = 50, offset = 0 } = req.query;

  let filtered = skills;

  if (category) {
    filtered = filtered.filter(s => s.skillCategory === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(searchLower) ||
      (s.description && s.description.toLowerCase().includes(searchLower))
    );
  }

  const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': paginated,
    'numberOfItems': filtered.length
  });
});

// Get skill by ID
router.get('/skills/:skillId', (req, res) => {
  const skill = skills.find(s =>
    s['@id']?.includes(req.params.skillId) ||
    s.codedNotation === req.params.skillId
  );

  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  res.json(skill);
});

// Create skill
router.post('/skills', (req, res) => {
  const skill = req.body;

  if (!skill.name) {
    return res.status(400).json({ error: 'Missing required field: name' });
  }

  skill['@context'] = skill['@context'] || 'https://schema.org';
  skill['@type'] = 'Skill';
  skill['@id'] = skill['@id'] || `https://api.hropen.org/skills/${skill.codedNotation || uuidv4()}`;

  skills.push(skill);

  res.status(201).json(skill);
});

// Search skills
router.get('/skills/search', (req, res) => {
  const { q, taxonomy, fuzzy } = req.query;

  let results = skills;

  if (q) {
    const searchLower = q.toLowerCase();
    results = results.filter(s =>
      s.name.toLowerCase().includes(searchLower) ||
      (s.description && s.description.toLowerCase().includes(searchLower)) ||
      (s.codedNotation && s.codedNotation.toLowerCase().includes(searchLower))
    );
  }

  res.json({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': results,
    'numberOfItems': results.length
  });
});

// ==================== SKILL ASSERTIONS ====================

// Get assertions for a person
router.get('/assertions', (req, res) => {
  const { personId, currentOnly, includeEvidence, skillId } = req.query;

  if (!personId) {
    return res.status(400).json({ error: 'Missing required query parameter: personId' });
  }

  let filtered = assertions.filter(a =>
    a.about?.['@id']?.includes(personId) ||
    a['@id']?.includes(personId)
  );

  if (currentOnly === 'true') {
    const now = new Date();
    filtered = filtered.filter(a => {
      const validFrom = new Date(a.validFrom);
      const validUntil = new Date(a.validUntil);
      return validFrom <= now && now <= validUntil;
    });
  }

  if (skillId) {
    filtered = filtered.filter(a => a.skill?.['@id']?.includes(skillId));
  }

  res.json({
    '@context': [
      'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
      'https://schema.org'
    ],
    '@type': 'SkillAssertionCollection',
    'assertions': filtered
  });
});

// Create skill assertion
router.post('/assertions', (req, res) => {
  const assertion = req.body;

  if (!assertion.skill || !assertion.proficiencyLevel) {
    return res.status(400).json({
      error: 'Missing required fields: skill, proficiencyLevel'
    });
  }

  assertion['@type'] = 'SkillAssertion';
  assertion['@id'] = assertion['@id'] || `https://api.hropen.org/assertions/${uuidv4()}`;
  assertion.dateCreated = new Date().toISOString();

  assertions.push(assertion);

  res.status(201).json(assertion);
});

// Get assertion by ID
router.get('/assertions/:assertionId', (req, res) => {
  const assertion = assertions.find(a => a['@id']?.includes(req.params.assertionId));

  if (!assertion) {
    return res.status(404).json({ error: 'Assertion not found' });
  }

  res.json(assertion);
});

// ==================== PROFICIENCY SCALES ====================

// Get all proficiency scales
router.get('/proficiency-scales', (req, res) => {
  res.json({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': proficiencyScales
  });
});

// Get proficiency scale by ID
router.get('/proficiency-scales/:scaleId', (req, res) => {
  const scale = proficiencyScales.find(s => s['@id']?.includes(req.params.scaleId));

  if (!scale) {
    return res.status(404).json({ error: 'Proficiency scale not found' });
  }

  res.json(scale);
});

// ==================== ASSESSMENT INTEGRATION ====================

// Map assessment to proficiency
router.post('/assessments/map-to-proficiency', (req, res) => {
  const { rawScore, scoreScale, proficiencyScaleId } = req.body;

  const scale = proficiencyScales.find(s => s['@id'] === proficiencyScaleId);

  if (!scale) {
    return res.status(400).json({ error: 'Invalid proficiency scale' });
  }

  // Simple mapping logic (can be customized)
  const percentage = (rawScore / scoreScale.maxValue) * 100;
  let proficiencyLevel;

  if (percentage < 50) proficiencyLevel = scale.hasDefinedTerm[0]; // Fundamental
  else if (percentage < 70) proficiencyLevel = scale.hasDefinedTerm[2]; // Intermediate
  else if (percentage < 90) proficiencyLevel = scale.hasDefinedTerm[3]; // Advanced
  else proficiencyLevel = scale.hasDefinedTerm[4]; // Expert

  res.json({
    proficiencyLevel: {
      '@type': 'DefinedTerm',
      '@id': `${proficiencyScaleId}/${proficiencyLevel.termCode}`,
      name: proficiencyLevel.name,
      description: proficiencyLevel.description,
      termCode: proficiencyLevel.termCode,
      inDefinedTermSet: proficiencyScaleId
    },
    mapping: {
      rawScore,
      percentage,
      scoreRange: scoreScale
    }
  });
});

// Create assertion from assessment
router.post('/assessments/create-assertion', (req, res) => {
  const { personId, assessmentResultId, skillId, proficiencyScaleId } = req.body;

  // Create new assertion
  const assertion = {
    '@context': [
      'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
      'https://schema.org'
    ],
    '@type': 'SkillAssertion',
    '@id': `https://api.hropen.org/assertions/${uuidv4()}`,
    skill: { '@type': 'Skill', '@id': skillId },
    about: { '@type': 'Person', '@id': personId },
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 2 years
    evidence: [{ '@type': 'AssessmentResult', '@id': assessmentResultId }],
    source: { '@type': 'Organization', '@id': 'https://api.hropen.org' }
  };

  assertions.push(assertion);

  res.status(201).json(assertion);
});

// ==================== WORKFORCE ANALYTICS ====================

// Skills inventory
router.get('/analytics/skills-inventory', (req, res) => {
  const { department, currentOnly = 'true' } = req.query;

  // Simple aggregation
  const skillCounts = {};

  assertions.forEach(a => {
    const skillId = a.skill?.['@id'];
    if (!skillId) return;

    if (!skillCounts[skillId]) {
      skillCounts[skillId] = {
        skill: a.skill,
        totalPeople: 0,
        proficiencyBreakdown: {}
      };
    }

    skillCounts[skillId].totalPeople++;
    const level = a.proficiencyLevel?.name || 'Unknown';
    skillCounts[skillId].proficiencyBreakdown[level] =
      (skillCounts[skillId].proficiencyBreakdown[level] || 0) + 1;
  });

  res.json({
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: 'Skills Inventory Report',
    dateCreated: new Date().toISOString(),
    skillDistribution: Object.values(skillCounts),
    totalUniqueSkills: Object.keys(skillCounts).length
  });
});

// Gap analysis
router.post('/analytics/gap-analysis', (req, res) => {
  const { targetRole, currentPopulation } = req.body;

  res.json({
    targetRole,
    currentPopulation,
    gaps: [],
    recommendations: [
      'Sample gap analysis - implement based on your requirements'
    ]
  });
});

// Internal mobility candidates
router.post('/analytics/mobility-candidates', (req, res) => {
  const { targetRole, requiredSkillMatch } = req.body;

  res.json({
    targetRole,
    requiredSkillMatch,
    candidates: [],
    message: 'Sample mobility analysis - implement matching logic'
  });
});

// ==================== JEDX INTEGRATION ====================

// Get job required skills
router.get('/jedx/jobs/:jobId/skills', (req, res) => {
  // This would typically query the JEDx API
  res.json({
    '@context': [
      'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
      'https://schema.org'
    ],
    '@type': 'SkillAssertionCollection',
    'targetType': 'https://schema.org/JobPosting',
    'targetId': `https://api.jedx.example.com/jobs/${req.params.jobId}`,
    'assertions': []
  });
});

// Match candidate to job
router.post('/jedx/match', (req, res) => {
  const { candidateId, jobId, includeGapAnalysis } = req.body;

  res.json({
    matchScore: 0.85,
    candidateId,
    jobId,
    matchedSkills: [],
    gaps: [],
    recommendation: 'Strong candidate match (demo data)'
  });
});

// ==================== CREDENTIALS & BADGES ====================

// Issue badge
router.post('/credentials/badges', (req, res) => {
  const badge = req.body;

  badge.id = badge.id || `https://api.hropen.org/credentials/badges/${uuidv4()}`;
  badge.issuanceDate = badge.issuanceDate || new Date().toISOString();

  badges.push(badge);

  res.status(201).json(badge);
});

// Get credentials for person
router.get('/credentials', (req, res) => {
  const { personId, type } = req.query;

  let filtered = badges;

  if (personId) {
    filtered = filtered.filter(b =>
      b.credentialSubject?.id?.includes(personId)
    );
  }

  if (type) {
    filtered = filtered.filter(b => b.type?.includes(type));
  }

  res.json({
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json'
    ],
    credentials: filtered
  });
});

// ==================== TAXONOMIES ====================

// Get taxonomies
router.get('/taxonomies', (req, res) => {
  res.json({
    taxonomies: [
      {
        id: 'ESCO',
        name: 'European Skills/Competences/Qualifications',
        url: 'https://ec.europa.eu/esco'
      },
      {
        id: 'ONET',
        name: 'O*NET Occupational Information Network',
        url: 'https://www.onetonline.org'
      },
      {
        id: 'Lightcast',
        name: 'Lightcast Skills Taxonomy',
        url: 'https://lightcast.io'
      }
    ]
  });
});

// Map skill to taxonomy
router.post('/taxonomies/map', (req, res) => {
  const { skillId, taxonomyMappings } = req.body;

  res.status(201).json({
    skillId,
    mappings: taxonomyMappings,
    message: 'Mappings created successfully'
  });
});

// ==================== DOCUMENTATION ====================

router.get('/docs', (req, res) => {
  res.json({
    name: 'HR Open Skills Data API',
    version: '1.0.0',
    description: 'Skills-based hiring, workforce transformation, and talent optimization',
    baseUrl: '/api/v1/skills',
    standards: [
      'IMS Global Open Badges v3.0',
      'W3C Verifiable Credentials',
      'JSON-LD 1.1',
      'Schema.org'
    ],
    resources: {
      skills: {
        endpoints: ['GET /skills', 'GET /skills/:skillId', 'POST /skills']
      },
      assertions: {
        endpoints: ['GET /assertions', 'POST /assertions', 'GET /assertions/:assertionId']
      },
      proficiencyScales: {
        endpoints: ['GET /proficiency-scales', 'GET /proficiency-scales/:scaleId']
      },
      assessments: {
        endpoints: ['POST /assessments/map-to-proficiency', 'POST /assessments/create-assertion']
      },
      analytics: {
        endpoints: ['GET /analytics/skills-inventory', 'POST /analytics/gap-analysis', 'POST /analytics/mobility-candidates']
      },
      jedx: {
        endpoints: ['GET /jedx/jobs/:jobId/skills', 'POST /jedx/match']
      },
      credentials: {
        endpoints: ['POST /credentials/badges', 'GET /credentials']
      },
      taxonomies: {
        endpoints: ['GET /taxonomies', 'POST /taxonomies/map']
      }
    },
    currentData: {
      skills: skills.length,
      assertions: assertions.length,
      proficiencyScales: proficiencyScales.length,
      credentials: badges.length
    }
  });
});

module.exports = router;
