// Project documents. Drop each PDF into the pdfs/ folder using the file name below.
const PROJECTS = [
  {
    slug: 'ai-calorie-tracker',
    ref: 'PART A-01',
    title: 'AI Calorie Tracker',
    summary: 'Mobile app that turns a meal photo into per-item calories and macros using Google Gemini vision.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL', 'Gemini API', 'Jest'],
  },
  {
    slug: 'betterdays',
    ref: 'PART A-02',
    title: 'BetterDays',
    summary: 'Five-tab student well-being app with 39 guided activities.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Reanimated'],
  },
  {
    slug: 'se-project-hub',
    ref: 'PART A-03',
    title: 'SE Project Hub',
    summary: 'Full-stack platform for capstone and competition project submissions, advisor reviews and rubric-based grading.',
    tags: ['React', 'TypeScript', 'Express.js', 'Firebase', 'Supabase', 'Tailwind CSS'],
  },
];

const $ = id => document.getElementById(id);
$('year').textContent = new Date().getFullYear();

const slug = new URLSearchParams(location.search).get('p');
const index = Math.max(0, PROJECTS.findIndex(p => p.slug === slug));
const project = PROJECTS[index];
const pdf = `pdfs/${project.slug}.pdf`;
const sheet = `03-${String(index + 1).padStart(2, '0')}`;

document.title = `${project.title} · Paing Soe Khant`;
$('docRef').textContent = `SHEET ${sheet} · ${project.ref}`;
$('docTitle').textContent = project.title;
$('docSummary').textContent = project.summary;
$('docTags').innerHTML = project.tags.map(t => `<li>${t}</li>`).join('');
$('docFile').textContent = pdf.toUpperCase();
$('docCaption').textContent = `FIG. 3 · ${project.title.toUpperCase()} · DOCUMENT`;
$('tbProject').textContent = project.title;
$('tbSheet').textContent = sheet;

// Prev / next project (wraps around)
const link = (el, p) => { el.href = `project.html?p=${p.slug}`; el.title = p.title; };
link($('prevLink'), PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]);
link($('nextLink'), PROJECTS[(index + 1) % PROJECTS.length]);

function showPdf() {
  $('openBtn').href = pdf;
  $('downloadBtn').href = pdf;
  if (!window.pdfjsLib) return showInFrame();
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  pdfjsLib.getDocument(pdf).promise
    .then(doc => {
      $('pdfPages').hidden = false;
      $('docStatus').textContent = `${doc.numPages} PAGES`;
      renderPages(doc);
      let timer;
      window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => renderPages(doc), 250);
      });
    })
    .catch(showInFrame);
}

// Draw every page as a canvas sized to the viewer width (sharp on high-DPI screens)
async function renderPages(doc) {
  const container = $('pdfPages');
  const width = container.clientWidth - 6;
  const dpr = window.devicePixelRatio || 1;
  const canvases = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: (width / page.getViewport({ scale: 1 }).width) * dpr });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.setAttribute('aria-label', `Page ${n}`);
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    canvases.push(canvas);
  }
  container.replaceChildren(...canvases);
}

// Fallback: let the browser's built-in viewer show it
function showInFrame() {
  $('pdfFrame').src = pdf;
  $('pdfFrame').hidden = false;
  $('docStatus').textContent = 'ATTACHED';
}

function showEmpty() {
  $('emptyState').hidden = false;
  $('docStatus').textContent = 'PENDING';
  for (const id of ['openBtn', 'downloadBtn']) $(id).classList.add('disabled');
}

// Check the PDF exists before embedding it. When opened straight from disk (file://)
// fetch isn't allowed, so just try to embed it.
fetch(pdf, { method: 'HEAD' })
  .then(res => (res.ok ? showPdf() : showEmpty()))
  .catch(() => (location.protocol === 'file:' ? showPdf() : showEmpty()));
