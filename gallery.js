const $ = id => document.getElementById(id);
$('year').textContent = new Date().getFullYear();

const { project, index, sheet } = currentProject();

document.title = `${project.title} · Screens · Paing Soe Khant`;
$('docRef').textContent = `SHEET ${sheet} · ${project.ref} · SCREENS`;
$('docTitle').textContent = project.title;
$('docSummary').textContent = project.summary;
$('docTags').innerHTML = project.tags.map(t => `<li>${t}</li>`).join('');
$('docBtn').href = `project.html?p=${project.slug}`;
$('tbProject').textContent = project.title;
$('tbSheet').textContent = sheet;
linkNeighbours('screens.html', index, $('prevLink'), $('nextLink'));

// Flatten the sections into one numbered list of shots
const shots = [];
for (const [section, captions] of project.screens) {
  for (const caption of captions) {
    const n = String(shots.length + 1).padStart(2, '0');
    shots.push({ section, caption, n, src: `screens/${project.slug}/${n}.jpg` });
  }
}

// Gallery, grouped by section
const gallery = $('gallery');
for (const [section] of project.screens) {
  const group = document.createElement('section');
  group.className = 'shots-group';
  group.innerHTML = `<h3 class="shots-head">${section}</h3>`;
  const grid = document.createElement('div');
  grid.className = `shots shots-${project.device}`;
  shots.forEach((shot, i) => {
    if (shot.section !== section) return;
    const fig = document.createElement('figure');
    fig.className = 'shot';
    fig.innerHTML = `
      <button type="button" aria-label="View ${shot.caption}">
        <img src="${shot.src}" alt="${shot.caption}" loading="lazy" />
      </button>
      <figcaption><span>FIG. ${shot.n}</span>${shot.caption}</figcaption>`;
    fig.querySelector('button').addEventListener('click', () => openShot(i));
    grid.append(fig);
  });
  group.append(grid);
  gallery.append(group);
}

// Lightbox
let current = 0;
const lightbox = $('lightbox');

function openShot(i) {
  current = (i + shots.length) % shots.length;
  const shot = shots[current];
  $('lbImg').src = shot.src;
  $('lbImg').alt = shot.caption;
  $('lbCaption').textContent = shot.caption;
  $('lbCount').textContent = `FIG. ${shot.n} / ${String(shots.length).padStart(2, '0')} · ${shot.section.toUpperCase()}`;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeShot() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

$('lbClose').addEventListener('click', closeShot);
$('lbPrev').addEventListener('click', () => openShot(current - 1));
$('lbNext').addEventListener('click', () => openShot(current + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeShot(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeShot();
  if (e.key === 'ArrowLeft') openShot(current - 1);
  if (e.key === 'ArrowRight') openShot(current + 1);
});
