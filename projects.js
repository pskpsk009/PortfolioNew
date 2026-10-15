// Shared project data for the document viewer (project.html) and screenshot gallery (screens.html).
// PDFs live in pdfs/<slug>.pdf. Screenshots live in screens/<slug>/01.jpg, 02.jpg, ... in the
// order their captions are listed below.
const PROJECTS = [
  {
    slug: 'ai-calorie-tracker',
    ref: 'PART A-01',
    title: 'AI Calorie Tracker',
    summary: 'Mobile app that turns a meal photo into per-item calories and macros using Google Gemini vision.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL', 'Gemini API', 'Jest'],
    device: 'phone',
    screens: [
      ['Logging a Meal', [
        'Home: today’s totals',
        'Add meal: camera or gallery',
        'Photo ready to analyze',
        'AI analysis: per-item breakdown',
        'Saved meal on Home',
      ]],
      ['Progress & Profile', [
        'Progress: today',
        'Weekly dashboard',
        'BMI and weight history',
        'Day-by-day history',
        'Profile and time zone',
        'Sign in',
      ]],
    ],
  },
  {
    slug: 'betterdays',
    ref: 'PART A-02',
    title: 'BetterDays',
    summary: 'Five-tab student well-being app with 39 guided activities.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Reanimated'],
    device: 'phone',
    screens: [
      ['Home & Navigation', [
        'Home: interactive body figure',
        'Mind tab: branch list',
        'Inside a branch: Self-Acceptance',
        'An activity: Letter to My Past Self',
      ]],
      ['Mind: Mental & Emotional Wellness', [
        'Mental Wellness overview',
        'A Mental Wellness branch',
        'Emotional Wellness overview',
        'An Emotional Wellness branch',
      ]],
      ['Body Functions', [
        'Hydration Check-in',
        'Build a Balanced Plate',
        'Daily Stretch',
        'Sleep Schedule Guidance',
      ]],
      ['Movement Trail', [
        'Outdoor GPS trail',
        'Indoor 2D drawing',
        'View Trails gallery',
      ]],
    ],
  },
  {
    slug: 'se-project-hub',
    ref: 'PART A-03',
    title: 'SE Project Hub',
    summary: 'Full-stack platform for capstone and competition project submissions, advisor reviews and rubric-based grading.',
    tags: ['React', 'TypeScript', 'Express.js', 'Firebase', 'Supabase', 'Tailwind CSS'],
    device: 'desktop',
    screens: [
      ['Signing In', [
        'Login: credentials checked by Firebase Authentication',
        'Choose dashboard: for users who are both Advisor and Coordinator',
      ]],
      ['Coordinator', [
        'User Management: add, import, edit, export, delete',
        'Course Management: courses, semester, advisors',
        'Roster Upload: enrol students from a CSV',
        'Reports and Analytics: project statistics',
      ]],
      ['Advisor', [
        'All Projects: search and open submissions',
        'Advisor Courses: assigned courses and students',
        'Rubric Management: criteria linked to PLOs',
      ]],
      ['Student', [
        'Submit Project (1): name, course, type, team',
        'Submit Project (2): links, files, submit',
        'My Projects: status and feedback',
        'Student Rubrics: how projects are assessed',
      ]],
      ['Every User', [
        'Project Archive: search past projects',
        'Account Details: profile information',
      ]],
    ],
  },
];

// The project named by ?p=<slug> (defaults to the first), plus its position and sheet number
function currentProject() {
  const slug = new URLSearchParams(location.search).get('p');
  const index = Math.max(0, PROJECTS.findIndex(p => p.slug === slug));
  return { project: PROJECTS[index], index, sheet: `03-${String(index + 1).padStart(2, '0')}` };
}

// Prev / next project links (wrap around)
function linkNeighbours(page, index, prevEl, nextEl) {
  const link = (el, p) => { el.href = `${page}?p=${p.slug}`; el.title = p.title; };
  link(prevEl, PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]);
  link(nextEl, PROJECTS[(index + 1) % PROJECTS.length]);
}
