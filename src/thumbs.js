import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Renders each part on its own to a small image, used in the parts list.
const SIZE = 144;
const cache = new Map();
let renderer, scene, camera, stage;

function setup() {
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(SIZE, SIZE);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1c2126);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(3, 6, 5);
  scene.add(key);
  camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  stage = new THREE.Group();
  scene.add(stage);
}

const pending = new Map();
const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 30));

// Cached image if there is one; otherwise null (ask for it with requestThumb)
export const cachedThumb = (product, def) => cache.get(`${product.id}/${def.id}`) ?? null;

// Renders in idle time so opening the page or a panel never waits on it
export function requestThumb(product, def) {
  const key = `${product.id}/${def.id}`;
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (!pending.has(key)) pending.set(key, new Promise((resolve) => idle(() => resolve(render(product, def)))));
  return pending.get(key);
}

function render(product, def) {
  const key = `${product.id}/${def.id}`;
  if (cache.has(key)) return cache.get(key);
  if (!renderer) setup();

  if (product.rotation) stage.rotation.fromArray(product.rotation);
  else stage.rotation.set(0, 0, 0);
  const obj = def.make();
  stage.add(obj);
  stage.updateMatrixWorld(true);

  const s = new THREE.Box3().setFromObject(stage).getBoundingSphere(new THREE.Sphere());
  const dist = (s.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.02;
  camera.position.copy(s.center).addScaledVector(new THREE.Vector3(0.55, 0.5, 1).normalize(), dist);
  camera.lookAt(s.center);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');

  stage.remove(obj);
  obj.traverse((m) => {
    if (m.isMesh) {
      m.geometry.dispose();
      m.material.dispose();
    }
  });
  cache.set(key, url);
  return url;
}
