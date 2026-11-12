import * as THREE from 'three';
import { createViewport } from './viewport.js';
import { instantiate, stepExplode, setHighlight, disposeInstance, PART_COLOR } from './instance.js';
import { catalog } from './products/index.js';
import { icon } from './icons.js';
import { cachedThumb, requestThumb, cachedObjectThumb, requestObjectThumb } from './thumbs.js';
import { portrait, linkNames } from './people.js';
import { registerPWA, canInstall, onInstallChange, promptInstall } from './pwa.js';

registerPWA();
onInstallChange(() => renderLibrary());

const STORE_KEY = 'inventions.scene';
const SLOT_SPACING = 10; // objects sit side by side along X so none hides another

const canvas = document.getElementById('view');
const markersEl = document.getElementById('markers');
const libraryEl = document.getElementById('library');
const detailEl = document.getElementById('detail');
// Drawer: a fixed handle (touch layouts) above a scrolling body, so the handle never scrolls away
detailEl.innerHTML = `<button class="drawer-handle" data-drawer aria-expanded="false" aria-label="Expand panel"><span></span></button><div class="detail-body"></div>`;
const bodyEl = detailEl.querySelector('.detail-body');
const DRAWER_MS = 420; // keep in step with the .detail transition in style.css
const libToggle = document.getElementById('lib-toggle');
const vp = createViewport(canvas);

// drawer: 'min' (handle only) · 'mid' (default) · 'max' (expanded) — touch layouts only
const state = { instances: [], active: null, selected: null, invention: 0, hover: null, exploded: false, drawer: 'mid' };
let pickables = [];

const pad = (n) => String(n).padStart(2, '0');
const countInventions = (product) => product.parts.reduce((n, p) => n + p.inventions.length, 0);

document.querySelectorAll('[data-icon]').forEach((b) => b.insertAdjacentHTML('afterbegin', icon(b.dataset.icon)));

/* ---------- Scene management ---------- */

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state.instances.map((i) => i.product.id)));
  } catch {}
}

function addProduct(id, { focus = true } = {}) {
  const product = catalog.find((p) => p.id === id);
  if (!product || state.instances.some((i) => i.product.id === id)) return;

  const instance = instantiate(product);
  const used = new Set(state.instances.map((i) => i.slot));
  instance.slot = 0;
  while (used.has(instance.slot)) instance.slot++;
  instance.root.position.set(instance.slot * SLOT_SPACING, 0, 0);
  instance.explodeTarget = state.exploded ? 1 : 0;
  vp.scene.add(instance.root);
  instance.root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(instance.root);
  instance.tagPos = new THREE.Vector3((box.min.x + box.max.x) / 2, 0, box.max.z + 0.4);

  for (const part of instance.parts) {
    const el = document.createElement('button');
    el.className = 'marker';
    el.style.setProperty('--c', part.color);
    el.setAttribute('aria-label', `${part.def.name}: ${part.def.inventions.map((i) => i.name).join(', ')}`);
    el.innerHTML = `<span class="tip">${part.def.name}</span>`;
    el.addEventListener('click', () => select(part));
    el.addEventListener('pointerenter', () => setHover(part));
    el.addEventListener('pointerleave', () => setHover(null));
    markersEl.append(el);
    part.el = el;
    pickables.push(...part.meshes);
  }

  instance.tag = document.createElement('button');
  instance.tag.className = 'tag';
  instance.tag.textContent = product.name;
  instance.tag.addEventListener('click', () => setActive(instance));
  markersEl.append(instance.tag);

  state.instances.push(instance);
  vp.invalidate(true);
  save();
  if (focus) setActive(instance);
  else renderLibrary();
}

function removeInstance(instance) {
  if (state.selected?.instance === instance) state.selected = null;
  if (state.hover?.instance === instance) state.hover = null;
  vp.scene.remove(instance.root);
  for (const part of instance.parts) part.el.remove();
  instance.tag.remove();
  disposeInstance(instance);
  state.instances = state.instances.filter((i) => i !== instance);
  pickables = pickables.filter((m) => m.userData.part.instance !== instance);
  vp.invalidate(true);
  save();
  if (state.active === instance) {
    state.active = null;
    if (state.instances[0]) return setActive(state.instances[0]);
  }
  render();
}

function frameActive(dir = vp.HOME_DIR, ms) {
  if (!state.active) return;
  const s = state.active.bounds(state.exploded);
  vp.frame(s.center, s.radius, dir, ms);
}

function setActive(instance, { frame = true } = {}) {
  state.active = instance;
  if (state.selected && state.selected.instance !== instance) state.selected = null;
  render();
  vp.focusLight(instance.bounds(false).center);
  if (frame) frameActive();
}

function select(part) {
  if (part && part.instance !== state.active) setActive(part.instance, { frame: false });
  if (part !== state.selected) state.invention = 0;
  state.selected = part;
  render();
  bodyEl.scrollTop = 0;
}

function setHover(part) {
  if (state.hover === part) return;
  state.hover = part;
  canvas.style.cursor = part ? 'pointer' : '';
  refreshHighlights();
}

function setExploded(on) {
  state.exploded = on;
  vp.invalidate();
  for (const i of state.instances) i.explodeTarget = on ? 1 : 0;
  document.querySelectorAll('[data-act="explode"]').forEach((b) => b.setAttribute('aria-pressed', String(on)));
  frameActive(null);
}

function step(delta) {
  const parts = state.active?.parts;
  if (!parts) return;
  const i = state.selected ? state.selected.index + delta : delta > 0 ? 0 : parts.length - 1;
  select(parts[(i + parts.length) % parts.length]);
}

/* ---------- UI rendering ---------- */

function refreshHighlights() {
  for (const inst of state.instances) {
    inst.tag.classList.toggle('is-active', inst === state.active);
    for (const part of inst.parts) {
      const level = part === state.selected ? 2 : part === state.hover ? 1 : 0;
      setHighlight(part, level);
      part.el.classList.toggle('is-selected', level === 2);
      part.el.classList.toggle('is-hover', level === 1);
      part.el.classList.toggle('is-dim', inst !== state.active);
    }
  }
  detailEl.querySelectorAll('[data-part]').forEach((row) => {
    row.classList.toggle('is-hover', state.hover?.instance === state.active && +row.dataset.part === state.hover.index);
  });
  vp.invalidate();
}

function renderLibrary() {
  const inScene = state.instances;
  const available = catalog.filter((p) => !inScene.some((i) => i.product.id === p.id));
  libToggle.innerHTML = `${icon('box')}<span>Objects · ${inScene.length}</span>`;
  libraryEl.innerHTML = `
    <section>
      <p class="eyebrow">${icon('box', 13)} In the scene</p>
      ${
        inScene.length
          ? `<ul class="rows">${inScene
              .map(
                (i) => `<li class="row-wrap">
                  <button class="row ${i === state.active ? 'is-active' : ''}" data-focus="${i.product.id}">
                    ${objectThumbHtml(i.product)}
                    <span class="grow">${i.product.name}<span class="sub">${countInventions(i.product)} inventions</span></span>
                  </button>
                  <button class="icon-btn" data-remove="${i.product.id}" aria-label="Remove ${i.product.name}" title="Remove from scene">${icon('x', 14)}</button>
                </li>`
              )
              .join('')}</ul>`
          : `<p class="empty">Nothing here yet. Add an object below.</p>`
      }
    </section>
    <section>
      <p class="eyebrow">${icon('plus', 13)} Add an object</p>
      ${
        available.length
          ? `<ul class="rows">${available
              .map(
                (p) => `<li><button class="row" data-add="${p.id}" aria-label="Add ${p.name}">
                  ${objectThumbHtml(p)}
                  <span class="grow">${p.name}<span class="sub">${countInventions(p)} inventions</span></span>
                  <span class="add">${icon('plus', 14)}</span>
                </button></li>`
              )
              .join('')}</ul>`
          : `<p class="empty">Every object in the library is on the grid.</p>`
      }
    </section>
    ${
      canInstall()
        ? `<section><button class="install" data-install>${icon('download', 15)}<span>Install as an app</span></button></section>`
        : ''
    }`;
  libraryEl.querySelectorAll('img[data-object]:not([src])').forEach((img) => {
    const product = catalog.find((p) => p.id === img.dataset.object);
    requestObjectThumb(product).then((url) => {
      if (img.isConnected) img.src = url;
    });
  });
}

function objectThumbHtml(product) {
  const url = cachedObjectThumb(product);
  return `<img class="thumb sm" alt="" data-object="${product.id}" ${url ? `src="${url}"` : ''} />`;
}

const timelineHtml = (items) =>
  `<ol class="timeline">${items.map(([year, text]) => `<li><span class="when">${year}</span><span class="what">${linkNames(text)}</span></li>`).join('')}</ol>`;

const heading = (name, text) => `<h4 class="section-title">${icon(name, 14)}<span>${text}</span></h4>`;

// p.wiki: the person's own article (also the source of their portrait).
// p.link: a page about their work, for people with no article, and so no portrait, of their own.
function personHtml(p) {
  return `<article class="person">
    ${p.wiki ? `<div class="avatar" data-wiki="${p.wiki}" data-name="${p.name}"></div>` : ''}
    <div class="who">
      <h5>${
        p.wiki || p.link
          ? `<a href="https://en.wikipedia.org/wiki/${encodeURIComponent(p.wiki || p.link)}" target="_blank" rel="noopener" title="Open ${p.name} on Wikipedia in a new tab">${p.name}${icon('link', 13)}</a>`
          : p.name
      }</h5>
      <p class="life">${p.life}</p>
      <p class="role">${p.role}</p>
    </div>
  </article>`;
}

function thumbHtml(product, def, size = '') {
  const url = cachedThumb(product, def);
  return `<img class="thumb ${size}" alt="" data-thumb="${def.id}" ${url ? `src="${url}"` : ''} />`;
}

// Fill in part images as they finish rendering in idle time
function hydrateThumbs() {
  const product = state.active?.product;
  if (!product) return;
  detailEl.querySelectorAll('img[data-thumb]:not([src])').forEach((img) => {
    const def = product.parts.find((p) => p.id === img.dataset.thumb);
    requestThumb(product, def).then((url) => {
      if (img.isConnected) img.src = url;
    });
  });
}

function hydratePortraits() {
  detailEl.querySelectorAll('.avatar[data-wiki]').forEach((el) => {
    if (!el.dataset.wiki) return;
    portrait(el.dataset.wiki).then((url) => {
      if (!url || !el.isConnected) return;
      const img = new Image();
      img.alt = `Portrait of ${el.dataset.name}`;
      img.onload = () => {
        el.append(img);
        el.classList.add('has-photo');
      };
      img.src = url;
    });
  });
}

const DRAWER_ORDER = ['min', 'mid', 'max'];
const DRAWER_CLASS = { min: 'is-min', mid: '', max: 'is-expanded' };

// Minimise / restore / expand the drawer. The camera re-frames over the same duration
// as the drawer animates, so the object glides to its new place instead of jumping after.
function setDrawer(next) {
  if (state.drawer === next) return;
  const prev = state.drawer;
  state.drawer = next;
  const apply = (name) => {
    detailEl.classList.remove('is-min', 'is-expanded');
    if (DRAWER_CLASS[name]) detailEl.classList.add(DRAWER_CLASS[name]);
  };

  // Measure where the drawer will end up, without painting the in-between state
  const transition = detailEl.style.transition;
  detailEl.style.transition = 'none';
  apply(next);
  const target = detailEl.getBoundingClientRect();
  apply(prev);
  void detailEl.offsetHeight;
  detailEl.style.transition = transition;
  apply(next);

  const h = detailEl.querySelector('[data-drawer]');
  h.setAttribute('aria-expanded', String(next !== 'min'));
  h.setAttribute('aria-label', next === 'min' ? 'Show panel' : next === 'max' ? 'Shrink panel' : 'Expand panel');

  const ms = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : DRAWER_MS;
  measureInsets(target, ms);
  frameActive(null, ms);
}

const stepDrawer = (delta) =>
  setDrawer(DRAWER_ORDER[Math.max(0, Math.min(2, DRAWER_ORDER.indexOf(state.drawer) + delta))]);

function renderDetail() {
  const inst = state.active;
  if (!inst) {
    detailEl.style.removeProperty('--c');
    bodyEl.innerHTML = `<section><p class="eyebrow">Empty scene</p><h2>Pick something to take apart</h2><p>Add an object from the library to see the inventions inside it.</p></section>`;
    return;
  }
  const { product } = inst;
  const part = state.selected;

  if (!part) {
    detailEl.style.setProperty('--c', PART_COLOR);
    bodyEl.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Object</p>
        <h2>${product.name}</h2>
        <p>${product.blurb}</p>
        <div class="stats">
          <div><b>${product.parts.length}</b><span>parts</span></div>
          <div><b>${countInventions(product)}</b><span>inventions</span></div>
          <div><b>${product.timeline[0][0]}</b><span>since</span></div>
        </div>
      </section>
      <section>
        ${heading('spark', 'Inventions inside')}
        <ul class="rows parts">${inst.parts
          .map(
            (p) => `<li><button class="row part-row" data-part="${p.index}" style="--c:${p.color}">
              ${thumbHtml(product, p.def)}
              <span class="grow">
                <span class="part-name"><span class="idx">${pad(p.index + 1)}</span>${p.def.name}</span>
                ${p.def.inventions.map((v) => `<span class="sub"><b>${v.year}</b> ${v.name}</span>`).join('')}
              </span>
              ${icon('next', 14)}
            </button></li>`
          )
          .join('')}</ul>
      </section>
      <section>
        ${heading('clock', `How the ${product.name.toLowerCase()} evolved`)}
        ${timelineHtml(product.timeline)}
      </section>`;
    return;
  }

  const list = part.def.inventions;
  const v = list[Math.min(state.invention, list.length - 1)];
  detailEl.style.setProperty('--c', part.color);
  bodyEl.innerHTML = `
    <section class="part-head">
      <button class="back" data-back>${icon('back', 13)} ${product.name}</button>
      <div class="part-title">
        ${thumbHtml(product, part.def, 'lg')}
        <div>
          <p class="eyebrow">Part ${pad(part.index + 1)} / ${pad(product.parts.length)}</p>
          <h2>${part.def.name}</h2>
        </div>
      </div>
      ${
        list.length > 1
          ? `<div class="tabs" role="tablist">${list
              .map(
                (x, i) => `<button role="tab" aria-selected="${x === v}" data-inv="${i}"><b>${x.year}</b>${x.name}</button>`
              )
              .join('')}</div>`
          : ''
      }
    </section>
    <section class="invention">
      <div class="year">${v.year}</div>
      <h3>${v.name}</h3>
      <p>${v.what}</p>
      <div class="callout">
        ${heading('wrench', `In this ${product.name.toLowerCase()}`)}
        <p>${v.here}</p>
      </div>
    </section>
    <section>
      ${heading('user', v.people.length > 1 ? 'The inventors' : 'The inventor')}
      <div class="people">${v.people.map(personHtml).join('')}</div>
    </section>
    <section>
      ${heading('grid', 'Also used in')}
      <ul class="chips">${v.uses.map((u) => `<li>${u}</li>`).join('')}</ul>
    </section>
    <section>
      ${heading('clock', 'Through time')}
      ${timelineHtml(v.timeline)}
    </section>
    <section class="pager">
      <button data-step="-1">${icon('prev', 14)} Previous part</button>
      <button data-step="1">Next part ${icon('next', 14)}</button>
    </section>`;
  hydratePortraits();
}

function render() {
  renderLibrary();
  renderDetail();
  hydrateThumbs();
  refreshHighlights();
}

/* ---------- UI events ---------- */

function setLibraryOpen(open) {
  libraryEl.classList.toggle('is-open', open);
  libToggle.setAttribute('aria-expanded', String(open));
}
libToggle.addEventListener('click', () => setLibraryOpen(!libraryEl.classList.contains('is-open')));
canvas.addEventListener('pointerdown', () => setLibraryOpen(false));

libraryEl.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if ('install' in b.dataset) return promptInstall();
  if (!b.dataset.remove) setLibraryOpen(false);
  const byId = (id) => state.instances.find((i) => i.product.id === id);
  if (b.dataset.add) addProduct(b.dataset.add);
  else if (b.dataset.focus) setActive(byId(b.dataset.focus));
  else if (b.dataset.remove) removeInstance(byId(b.dataset.remove));
});

detailEl.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if ('drawer' in b.dataset) {
    // Tap: minimised -> default -> expanded -> default
    if (!dragMoved) setDrawer(state.drawer === 'mid' ? 'max' : 'mid');
    return;
  }
  if (b.dataset.part) select(state.active.parts[+b.dataset.part]);
  else if ('back' in b.dataset) select(null);
  else if (b.dataset.step) step(+b.dataset.step);
  else if (b.dataset.inv) {
    state.invention = +b.dataset.inv;
    renderDetail();
    hydrateThumbs();
  }
});
detailEl.addEventListener('pointerover', (e) => {
  const row = e.target.closest('[data-part]');
  setHover(row ? state.active.parts[+row.dataset.part] : null);
});
detailEl.addEventListener('pointerleave', () => setHover(null));

// Toolbar (desktop) and the round quick buttons (touch layouts) share these actions
document.getElementById('app').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-mode], button[data-act]');
  if (!b) return;
  if (b.dataset.mode) {
    vp.setMode(b.dataset.mode);
    document.querySelectorAll('[data-mode]').forEach((m) => m.setAttribute('aria-pressed', String(m === b)));
  }
  const act = b.dataset.act;
  if (act === 'zoom-in') vp.zoomBy(0.75);
  if (act === 'zoom-out') vp.zoomBy(1 / 0.75);
  if (act === 'explode') setExploded(!state.exploded);
  if (act === 'reset') frameActive();
});

window.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 'r') frameActive();
  else if (k === 'f') frameActive(null);
  else if (k === 'e') setExploded(!state.exploded);
  else if (k === 'escape') select(null);
  else if (k === '1') vp.setView('front');
  else if (k === '3') vp.setView('right');
  else if (k === '7') vp.setView('top');
  else if (k === 'arrowright') step(1);
  else if (k === 'arrowleft') step(-1);
});

/* ---------- Picking ---------- */

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

function pick(e) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, vp.camera);
  raycaster.far = Infinity;
  raycaster.firstHitOnly = true;
  return raycaster.intersectObjects(pickables, false)[0]?.object.userData.part ?? null;
}

let down = null;
canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }));
canvas.addEventListener('pointerup', (e) => {
  if (!down || e.button !== 0) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  down = null;
  if (moved > 5) return;
  if (vp.gizmoClick(e)) return;
  select(pick(e));
});
let hoverEvent = null;
canvas.addEventListener('pointermove', (e) => {
  if (e.buttons !== 0 || e.pointerType !== 'mouse') return;
  // At most one hit-test per displayed frame
  if (!hoverEvent) requestAnimationFrame(() => {
    setHover(pick(hoverEvent));
    hoverEvent = null;
  });
  hoverEvent = e;
});
canvas.addEventListener('pointerleave', () => setHover(null));

/* ---------- Per-frame: explode animation + marker placement ---------- */

const world = new THREE.Vector3();
const dir = new THREE.Vector3();
let tick = 0;

// Explode animation: reports whether any object is still moving
vp.onAnimate((dt) => {
  let busy = false;
  for (const inst of state.instances) {
    stepExplode(inst, dt);
    if (inst.explodeT !== inst.explodeTarget) busy = true;
  }
  return busy;
});

// Runs only on frames that are actually drawn
vp.onFrame((dt, moving) => {
  const checkOcclusion = !moving || tick++ % 3 === 0;
  raycaster.firstHitOnly = false;
  for (const inst of state.instances) {
    for (const part of inst.parts) {
      part.anchor.getWorldPosition(world);
      const p = vp.project(world);
      part.el.style.display = p.visible ? '' : 'none';
      part.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
      if (checkOcclusion && p.visible) {
        dir.copy(world).sub(vp.camera.position);
        const dist = dir.length();
        raycaster.set(vp.camera.position, dir.normalize());
        raycaster.far = dist - 0.03;
        const hidden = raycaster
          .intersectObjects(pickables, false)
          .some((h) => h.object.userData.part !== part && !h.object.userData.part.def.seeThrough);
        part.el.classList.toggle('is-occluded', hidden);
      }
    }
    const t = vp.project(inst.tagPos);
    inst.tag.style.display = t.visible ? '' : 'none';
    inst.tag.style.transform = `translate(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px)`;
  }
});

/* ---------- Keep the model centred in the space the panels leave free ---------- */

function measureInsets(det = detailEl.getBoundingClientRect(), ms = 0) {
  const w = window.innerWidth, h = window.innerHeight;
  const lib = libraryEl.getBoundingClientRect();
  const compact = w <= 1100; // touch layouts: library is a dropdown, panel is a drawer
  if (!compact) vp.setInsets({ l: lib.right, r: w - det.left }, ms); // desktop: between the two panels
  else if (det.width > w * 0.7) {
    // Phone: frame above the sheet. Fully expanded, the sheet covers everything, so leave the framing alone.
    if (state.drawer !== 'max') vp.setInsets({ t: 56, b: h - det.top }, ms);
  } else if (state.drawer === 'max') vp.setInsets({ t: 56, r: w - det.left + 8 }, ms); // unfolded, full height: left centre
  else if (state.drawer === 'min') vp.setInsets({ t: 56, b: 56, fit: 1.1 }, ms); // unfolded, minimised: centre of the screen
  // unfolded, default: top-left, in the space above the drawer, so the drawer never covers it
  // (fit < 1: the bounding sphere is generous for long, flat objects, so frame a little tighter)
  else vp.setInsets({ t: 56, b: h - det.top + 16, r: w * 0.3, fit: 0.78 }, ms);
  vp.setGizmoCorner(compact);
}

// Drag the handle: up grows the drawer one step, down shrinks it one step
let dragStart = null, dragMoved = false;
detailEl.addEventListener('pointerdown', (e) => {
  if (!e.target.closest('[data-drawer]')) return;
  dragStart = e.clientY;
  dragMoved = false;
});
window.addEventListener('pointermove', (e) => {
  if (dragStart === null) return;
  const dy = e.clientY - dragStart;
  if (Math.abs(dy) < 24 || dragMoved) return;
  dragMoved = true; // one step per drag
  stepDrawer(dy < 0 ? 1 : -1);
});
window.addEventListener('pointerup', () => {
  dragStart = null;
  setTimeout(() => (dragMoved = false), 0);
});
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    measureInsets();
    frameActive(null);
  }, 150);
});

/* ---------- Boot ---------- */

let saved = null;
try {
  saved = JSON.parse(localStorage.getItem(STORE_KEY));
} catch {}
const initial = Array.isArray(saved) ? saved.filter((id) => catalog.some((p) => p.id === id)) : ['flashlight'];
initial.forEach((id) => addProduct(id, { focus: false }));
render();
measureInsets();
if (state.instances[0]) setActive(state.instances[0]);
