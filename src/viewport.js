import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ViewHelper } from 'three/addons/helpers/ViewHelper.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const BG = 0x0a0c0e;
const HOME_DIR = new THREE.Vector3(0.62, 0.5, 1).normalize();

export function createViewport(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  // Full resolution when still, reduced while the camera or parts are moving
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const movingRatio = Math.min(window.devicePixelRatio, 1.25);
  renderer.setPixelRatio(pixelRatio);
  renderer.transmissionResolutionScale = 0.5;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.Fog(BG, 22, 80);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.6;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 400);
  camera.position.copy(HOME_DIR).multiplyScalar(12);

  /* ---------- Studio lighting: warm key with soft shadows, cool rim, low fill ---------- */
  const key = new THREE.DirectionalLight(0xfff2e0, 2.7);
  key.position.set(7, 13, 9);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.autoUpdate = false; // redrawn only when something that casts a shadow moves
  key.shadow.needsUpdate = true;
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 5;
  key.shadow.blurSamples = 16;

  const rim = new THREE.DirectionalLight(0x7fb0ff, 1.6);
  rim.position.set(-9, 6, -10);
  const fill = new THREE.DirectionalLight(0xffd9b0, 0.5);
  fill.position.set(-6, 3, 9);
  scene.add(key, key.target, rim, fill, new THREE.HemisphereLight(0xcfe0ff, 0x0a0b0d, 0.35));

  /* ---------- Floor: lit surface so shadows and light pools read, plus the grid ---------- */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.82, metalness: 0.1, envMapIntensity: 0.25 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.003;
  ground.receiveShadow = true;
  scene.add(ground);

  const minor = new THREE.GridHelper(200, 200, 0x262a32, 0x262a32);
  const major = new THREE.GridHelper(200, 40, 0x3b414c, 0x3b414c);
  major.position.y = 0.001;
  for (const g of [minor, major]) {
    g.material.transparent = true;
    g.material.opacity = 0.75;
    g.material.depthWrite = false;
  }
  scene.add(minor, major);

  const axis = (a, b, color) => {
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color }));
    l.position.y = 0.002;
    return l;
  };
  scene.add(
    axis(new THREE.Vector3(-100, 0, 0), new THREE.Vector3(100, 0, 0), 0xa23c4a),
    axis(new THREE.Vector3(0, 0, -100), new THREE.Vector3(0, 0, 100), 0x57903f)
  );

  /* ---------- Post-processing: HDR buffer, bloom on glowing parts, filmic output ---------- */
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(pixelRatio);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.22, 0.6, 1.4);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ---------- Controls: left = orbit, shift+left / right = pan, wheel = zoom ---------- */
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.minDistance = 1.2;
  controls.maxDistance = 70;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.zoomToCursor = true;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.ROTATE, RIGHT: THREE.MOUSE.PAN };

  const gizmo = new ViewHelper(camera, canvas);
  gizmo.setLabels('X', 'Y', 'Z');
  gizmo.location.right = 12;
  gizmo.location.bottom = 12;

  // Screen space the UI covers. The model is centred in what is left; fit > 1 frames it smaller.
  const insets = { l: 0, r: 0, t: 0, b: 0, fit: 1 };
  let insetTween = null; // eases the framing offset alongside a panel animation
  let dirty = true, shadowDirty = true, lowRes = false, lastMotion = 0;
  const invalidate = (shadows = false) => {
    dirty = true;
    if (shadows) shadowDirty = true;
  };

  // Camera tween (target lerps, offset interpolates on a sphere)
  let tween = null;
  const sph = new THREE.Spherical();
  function flyTo(position, lookAt, ms = 650) {
    const o0 = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    const o1 = new THREE.Spherical().setFromVector3(position.clone().sub(lookAt));
    let dTheta = o1.theta - o0.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    tween = { o0, o1, dTheta, t0: controls.target.clone(), t1: lookAt.clone(), start: performance.now(), ms };
  }
  controls.addEventListener('start', () => (tween = null));

  function stepTween(now) {
    if (!tween) return;
    const raw = Math.min(1, (now - tween.start) / tween.ms);
    const k = 1 - Math.pow(1 - raw, 3);
    controls.target.lerpVectors(tween.t0, tween.t1, k);
    sph.radius = THREE.MathUtils.lerp(tween.o0.radius, tween.o1.radius, k);
    sph.phi = THREE.MathUtils.lerp(tween.o0.phi, tween.o1.phi, k);
    sph.theta = tween.o0.theta + tween.dTheta * k;
    sph.makeSafe();
    camera.position.setFromSpherical(sph).add(controls.target);
    if (raw >= 1) tween = null;
  }

  // Frame a bounding sphere inside the area the UI leaves free. dir = null keeps the current direction.
  function frame(center, radius, dir = HOME_DIR, ms = 650) {
    const goal = insetTween ? insetTween.to : insets; // fit to where the panels are heading
    const d = dir ? dir.clone() : camera.position.clone().sub(controls.target).normalize();
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const freeW = Math.max(120, w - goal.l - goal.r);
    const freeH = Math.max(120, h - goal.t - goal.b);
    const dist = (radius / Math.sin(fov / 2)) * Math.max(h / freeH, h / freeW) * 0.94 * goal.fit;
    flyTo(center.clone().addScaledVector(d, dist), center, ms);
  }

  function zoomBy(factor) {
    const off = camera.position.clone().sub(controls.target);
    const len = THREE.MathUtils.clamp(off.length() * factor, controls.minDistance, controls.maxDistance);
    flyTo(controls.target.clone().add(off.setLength(len)), controls.target.clone(), 260);
  }

  const VIEWS = {
    front: new THREE.Vector3(0, 0.0001, 1),
    right: new THREE.Vector3(1, 0.0001, 0),
    top: new THREE.Vector3(0, 1, 0.0001),
  };
  function setView(name) {
    const dist = camera.position.distanceTo(controls.target);
    flyTo(controls.target.clone().addScaledVector(VIEWS[name].clone().normalize(), dist), controls.target.clone(), 450);
  }

  function setMode(mode) {
    controls.mouseButtons.LEFT =
      mode === 'pan' ? THREE.MOUSE.PAN : mode === 'zoom' ? THREE.MOUSE.DOLLY : THREE.MOUSE.ROTATE;
    controls.touches.ONE = mode === 'pan' ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
  }

  // World -> CSS pixel position
  const v = new THREE.Vector3();
  function project(world) {
    v.copy(world).project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * canvas.clientWidth,
      y: (-v.y * 0.5 + 0.5) * canvas.clientHeight,
      visible: v.z > -1 && v.z < 1,
    };
  }

  // Keep the shadow-casting key light centred on whatever is in focus
  const KEY_OFFSET = new THREE.Vector3(7, 13, 9);
  function focusLight(center) {
    key.target.position.set(center.x, 0, center.z);
    key.position.copy(key.target.position).add(KEY_OFFSET);
    shadowDirty = true;
    dirty = true;
  }

  function setInsets(next, ms = 0) {
    const to = { l: 0, r: 0, t: 0, b: 0, fit: 1, ...next };
    if (ms > 0) insetTween = { from: { ...insets }, to, start: performance.now(), ms };
    else {
      insetTween = null;
      Object.assign(insets, to);
      resize();
    }
  }

  function stepInsets(now) {
    if (!insetTween) return false;
    const raw = Math.min(1, (now - insetTween.start) / insetTween.ms);
    const k = 1 - Math.pow(1 - raw, 3);
    for (const key of ['l', 'r', 't', 'b', 'fit']) insets[key] = THREE.MathUtils.lerp(insetTween.from[key], insetTween.to[key], k);
    applyOffset();
    if (raw >= 1) insetTween = null;
    return true;
  }

  function applyOffset() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    camera.setViewOffset(w, h, (insets.r - insets.l) / 2, (insets.b - insets.t) / 2, w, h);
    dirty = true;
  }

  // Corner gizmo sits bottom-right, or top-right when a bottom sheet covers that corner
  function setGizmoCorner(top) {
    gizmo.location.top = top ? 52 : null;
    gizmo.location.bottom = top ? 0 : 12;
    gizmo.location.right = top ? 0 : 12;
  }

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    // Shift the optical centre into the area not covered by UI panels
    applyOffset();
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();

  const frameCallbacks = []; // run just before a frame is drawn
  const animators = []; // return true while they still have motion to play
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;

    let moving = !!tween;
    stepTween(now);
    if (stepInsets(now)) moving = true;
    if (gizmo.animating) {
      gizmo.update(dt);
      moving = true;
    } else if (controls.update()) moving = true;
    gizmo.center.copy(controls.target);

    let animating = false;
    for (const cb of animators) if (cb(dt)) animating = true;
    if (animating) shadowDirty = true;
    if (moving || animating) lastMotion = now;

    // Drop resolution while things move; restore it (and redraw once) when they settle
    const wantLow = movingRatio < pixelRatio && now - lastMotion < 180;
    if (wantLow !== lowRes) {
      lowRes = wantLow;
      composer.setPixelRatio(lowRes ? movingRatio : pixelRatio);
      dirty = true;
    }

    // Nothing changed: skip the frame entirely
    if (!moving && !animating && !dirty) return;
    dirty = false;
    if (shadowDirty) {
      key.shadow.needsUpdate = true;
      shadowDirty = false;
    }
    for (const cb of frameCallbacks) cb(dt, moving || animating);
    composer.render(dt);
    gizmo.render(renderer);
  }
  requestAnimationFrame(loop);

  return {
    scene, camera, renderer, controls, canvas,
    flyTo, frame, focusLight, setInsets, setGizmoCorner, zoomBy, setView, setMode, project,
    gizmoClick: (e) => gizmo.handleClick(e),
    onFrame: (cb) => frameCallbacks.push(cb),
    onAnimate: (cb) => animators.push(cb),
    invalidate,
    HOME_DIR,
  };
}
