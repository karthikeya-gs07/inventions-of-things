import * as THREE from 'three';

/* ---------- Materials ---------- */

export const mat = (color, opts = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, metalness: 0, ...opts });

export const metal = (color, opts = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 1, ...opts });

// Real refractive glass. depthWrite is off so things inside stay visible.
export const glass = (opts = {}) =>
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transmission: 1, thickness: 0.04, ior: 1.5, roughness: 0.03, metalness: 0,
    side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.4, ...opts,
  });

// Cheap see-through material for glass that sits *inside* other glass.
export const clear = (opacity = 0.35, color = 0xdcecff) =>
  new THREE.MeshPhysicalMaterial({
    color, transparent: true, opacity, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false,
  });

/* ---------- Procedural textures ---------- */

function canvasTexture(w, h, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let knurlBase;
// Diamond knurling as a bump map (the machined grip pattern on metal tools).
export function knurl(repeatU, repeatV) {
  knurlBase ??= canvasTexture(64, 64, (g) => {
    g.fillStyle = '#9a9a9a';
    g.fillRect(0, 0, 64, 64);
    g.strokeStyle = '#1c1c1c';
    g.lineWidth = 7;
    g.lineCap = 'square';
    for (const o of [-64, 0, 64]) {
      g.beginPath();
      g.moveTo(o, 0); g.lineTo(o + 64, 64);
      g.moveTo(o + 64, 0); g.lineTo(o, 64);
      g.stroke();
    }
  }, false);
  const t = knurlBase.clone();
  t.repeat.set(repeatU, repeatV);
  t.needsUpdate = true;
  return t;
}

let batteryTex;
export function batteryLabel() {
  return (batteryTex ??= canvasTexture(1024, 512, (g, w, h) => {
    g.fillStyle = '#131418';
    g.fillRect(0, 0, w, h);
    const band = g.createLinearGradient(0, 0, 0, 120);
    band.addColorStop(0, '#d9904a');
    band.addColorStop(1, '#a8632a');
    g.fillStyle = band;
    g.fillRect(0, 0, w, 118);
    g.fillStyle = '#e9c08f';
    g.fillRect(0, 118, w, 5);
    for (const x of [256, 768]) {
      g.save();
      g.translate(x, h / 2 + 60);
      g.rotate(-Math.PI / 2);
      g.textAlign = 'center';
      g.fillStyle = '#e8e9ec';
      g.font = '700 74px Helvetica, Arial, sans-serif';
      g.fillText('ALKALINE', 0, 0);
      g.fillStyle = '#d9904a';
      g.font = '600 36px Helvetica, Arial, sans-serif';
      g.fillText('AA  ·  LR6  ·  1.5 V', 0, 56);
      g.restore();
      g.fillStyle = '#131418';
      g.font = '700 70px Helvetica, Arial, sans-serif';
      g.textAlign = 'center';
      g.fillText('+', x + 250, 84);
    }
  }));
}

let woodTex;
export function wood() {
  return (woodTex ??= canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = '#d7b07c';
    g.fillRect(0, 0, w, h);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 90; i++) {
      const x = rnd() * w;
      g.strokeStyle = `rgba(${rnd() > 0.5 ? '120,78,38' : '240,214,170'},${0.1 + rnd() * 0.25})`;
      g.lineWidth = 1 + rnd() * 3;
      g.beginPath();
      g.moveTo(x, 0);
      g.bezierCurveTo(x + rnd() * 10 - 5, h * 0.3, x + rnd() * 10 - 5, h * 0.6, x + rnd() * 8 - 4, h);
      g.stroke();
    }
  }));
}

let pencilTex;
// Lacquered hex barrel with a foil stamp on one face.
export function pencilPaint() {
  return (pencilTex ??= canvasTexture(384, 1024, (g, w, h) => {
    g.fillStyle = '#e6a91f';
    g.fillRect(0, 0, w, h);
    g.save();
    g.translate(352, h * 0.62);
    g.rotate(-Math.PI / 2);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#2a2110';
    g.font = '700 30px Georgia, serif';
    g.fillText('GRAPHITE  ·  No. 2  ·  HB', 0, 0);
    g.restore();
  }));
}

/* ---------- Geometry ---------- */

export function cyl(rTop, rBottom, h, y, material, seg = 64, open = false) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg, 1, open), material);
  m.position.y = y;
  return m;
}

// Revolve a list of [radius, y] points around the Y axis.
export function lathe(points, material, seg = 64) {
  return new THREE.Mesh(
    new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), seg),
    material
  );
}

export function ring(r, tube, y, material) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, 64), material);
  m.rotation.x = Math.PI / 2;
  m.position.y = y;
  return m;
}

// Flat washer facing +Y.
export function annulus(rIn, rOut, y, material) {
  const m = new THREE.Mesh(new THREE.RingGeometry(rIn, rOut, 64), material);
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  return m;
}

class Helix extends THREE.Curve {
  constructor(radius, length, turns) {
    super();
    Object.assign(this, { radius, length, turns });
  }
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * this.turns * Math.PI * 2;
    return target.set(Math.cos(a) * this.radius, t * this.length, Math.sin(a) * this.radius);
  }
}

// Coil rising along +Y from y = 0.
export function helix(radius, length, turns, tube, material) {
  return new THREE.Mesh(
    new THREE.TubeGeometry(new Helix(radius, length, turns), Math.ceil(turns * 26), tube, 8),
    material
  );
}

export function wire(points, tube, material) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 32, tube, 8), material);
}

export function group(...children) {
  const g = new THREE.Group();
  g.add(...children);
  return g;
}
