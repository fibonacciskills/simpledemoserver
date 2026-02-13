# Interactive Features Guide

This demo server now includes fully interactive web pages for exploring the HR Open Skills and JEDx APIs.

## 🎯 What's New

### 1. **Fixed "Explore API" Button**
- Now correctly links to `/api/v1/skills/docs`
- Previously returned a 400 error due to missing query parameters

### 2. **Live Status Indicator**
- Real-time server connection status at the top of the page
- Shows number of loaded skills, assertions, and credentials
- Visual pulse animation when connected

### 3. **Interactive Schema Explorer**
- **Four Tab Types**: Person Skills, Job Requirements, Learning Programs, Assessments
- **Live Data Fetching**: Click "🔄 Fetch Live Data" on any tab to load real sample data from the API
- **Real-time Display**: See actual JSON responses from the running server

### 4. **Live Skills Browser**
- Browse all skills currently loaded in the API
- View detailed skill information in interactive modals
- Load and explore proficiency scales with visual level breakdowns
- Click any skill card to see the full JSON structure

### 5. **Sample Data Browser** (`/samples.html`)
- **New dedicated page** for browsing all 118+ sample data files
- Features:
  - Searchable file list
  - Organized by directory/category
  - Live file loading with syntax-highlighted JSON
  - **Copy to Clipboard** - One-click JSON copying
  - **Download Files** - Download any sample file locally
  - **Grouped Navigation** - Files organized by type (skillsapi, JEDx, etc.)

## 🚀 How to Use

### Main Interactive Guide (`/`)

1. **Check Server Status**
   - Look at the top status bar to ensure the server is connected
   - Should show: "✓ Server Connected" with a green pulsing dot

2. **Explore Sample Data Interactively**
   - Scroll to "Interactive Schema Explorer"
   - Click tabs to switch between Person/Job/Course/Assessment views
   - Click "🔄 Fetch Live Data" to load real data from the API
   - Watch as the JSON updates with actual server responses

3. **Browse Live Skills**
   - Scroll to "Live Skills Browser"
   - Click "🔍 Load Skills from API" to see all available skills
   - Click any skill card to view detailed information in a modal
   - Click "📊 Load Proficiency Scales" to see scale definitions

### Sample Data Browser (`/samples.html`)

1. **Browse Files**
   - Files are grouped by directory (skillsapi, jedx, etc.)
   - Click any file to view its contents

2. **Search Files**
   - Use the search box to filter files by name or path
   - Results update in real-time

3. **Copy & Download**
   - View any file's JSON content
   - Click "📋 Copy JSON" to copy to clipboard
   - Click "⬇️ Download" to save the file locally

## 🎨 Interactive Elements

### Hover Effects
- Skill cards lift and shadow on hover
- Use case cards highlight on hover
- File items slide right on hover

### Loading States
- All API calls show loading spinners
- Error states display helpful messages
- Success states auto-scroll to top of content

### Visual Feedback
- Copy button changes to "✓ Copied!" on success
- Active file/tab indicators
- Pulsing status dot when connected

## 📡 API Endpoints Used

The interactive pages use these endpoints:

- `GET /api/v1/skills/docs` - API documentation and stats
- `GET /api/v1/skills/skills` - List all skills
- `GET /api/v1/skills/proficiency-scales` - Proficiency scale definitions
- `GET /api/v1/sample-data` - List all sample files
- `GET /api/v1/sample-data/{path}` - Fetch specific sample file

## 🛠️ Technical Details

### Technologies Used
- **Tailwind CSS** - For responsive, modern styling
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - For async data loading
- **JSON.stringify** - For pretty-printing JSON

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses ES6+ features (async/await, arrow functions)

## 🎯 Next Steps

To extend the interactive features:

1. Add more API endpoint examples
2. Create interactive API testing tool (like Swagger UI)
3. Add data visualization charts for skills analytics
4. Implement real-time skill matching demos
5. Add POST/PUT examples with form inputs

## 📝 Notes

- All data is fetched from the live API server
- No data is modified (read-only operations)
- Sample files remain unchanged
- Perfect for demos, testing, and exploration
