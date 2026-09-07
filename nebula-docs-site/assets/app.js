const pages = [...document.querySelectorAll('.doc-page')];
const links = [...document.querySelectorAll('.nav-link')];
const menuButton = document.querySelector('[data-menu]');
const search = document.querySelector('[data-search]');

function pageId() {
  const requested = location.hash.replace('#', '').trim();
  return pages.some((page) => page.id === requested) ? requested : 'overview';
}

function showPage(id, updateHash = false) {
  const target = pages.some((page) => page.id === id) ? id : 'overview';
  pages.forEach((page) => page.classList.toggle('active', page.id === target));
  links.forEach((link) => {
    const active = link.getAttribute('href') === `#${target}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (updateHash) history.pushState(null, '', `#${target}`);
  document.body.classList.remove('nav-open');
  window.scrollTo({ top: 0, behavior: 'auto' });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  if (!pages.some((page) => page.id === id)) return;
  event.preventDefault();
  showPage(id, true);
});

window.addEventListener('hashchange', () => showPage(pageId()));
menuButton.addEventListener('click', () => document.body.classList.toggle('nav-open'));

search.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase();
  links.forEach((link) => {
    const searchable = `${link.textContent} ${link.dataset.keywords || ''}`.toLocaleLowerCase();
    link.hidden = Boolean(query) && !searchable.includes(query);
  });
  document.querySelectorAll('.nav-group').forEach((group) => {
    const visibleLinks = [...group.querySelectorAll('.nav-link')].some((link) => !link.hidden);
    group.hidden = !visibleLinks;
  });
});

search.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  const first = links.find((link) => !link.hidden);
  if (first) first.click();
});

showPage(pageId());
