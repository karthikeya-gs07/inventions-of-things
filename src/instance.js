import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

// Spatial index on every mesh so hover, click and hotspot-visibility tests stay cheap
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export const PART_COLOR = '#4d9fff'; // every invention hotspot shares one colour

// Turns a product definition into a live scene object with selectable parts.
export function instantiate(product) {
  const root = new THREE.Group();
  root.name = product.id;
  const inner = new THREE.Group();
  if (product.rotation) inner.rotation.fromArray(product.rotation);
  if (product.position) inner.position.fromArray(product.position);
  root.add(inner);

  const instance = { product, root, parts: [], explodeT: 0, explodeTarget: 0 };

  product.parts.forEach((def, index) => {
    const holder = new THREE.Group();
    holder.add(def.make());
    const color = PART_COLOR;
    const part = {
      def, index, holder, instance, meshes: [], level: 0, color,
      tint: new THREE.Color(color), explode: new THREE.Vector3(...def.explode),
    };
    holder.traverse((m) => {
      if (!m.isMesh) return;
      m.material = m.material.clone();
      m.geometry.computeBoundsTree();
      const seeThrough = m.material.transparent || m.material.transmission > 0;
      m.castShadow = !seeThrough;
      m.receiveShadow = !seeThrough;
      m.userData.part = part;
      m.userData.baseEmissive = m.material.emissive.clone();
      m.userData.baseIntensity = m.material.emissiveIntensity;
      part.meshes.push(m);
    });
    part.anchor = new THREE.Object3D();
    part.anchor.position.fromArray(def.anchor);
    holder.add(part.anchor);
    inner.add(holder);
    instance.parts.push(part);
  });

  // Bounding sphere at rest or fully exploded
  instance.bounds = (exploded) => {
    const prev = instance.explodeT;
    applyExplode(instance, exploded ? 1 : 0);
    root.updateMatrixWorld(true);
    const sphere = new THREE.Box3().setFromObject(root).getBoundingSphere(new THREE.Sphere());
    applyExplode(instance, prev);
    root.updateMatrixWorld(true);
    return sphere;
  };

  return instance;
}

function applyExplode(instance, t) {
  instance.explodeT = t;
  const k = t * t * (3 - 2 * t);
  for (const p of instance.parts) p.holder.position.copy(p.explode).multiplyScalar(k);
}

export function stepExplode(instance, dt) {
  if (instance.explodeT === instance.explodeTarget) return;
  const dir = Math.sign(instance.explodeTarget - instance.explodeT);
  let t = instance.explodeT + dir * dt * 1.6;
  if ((dir > 0 && t > instance.explodeTarget) || (dir < 0 && t < instance.explodeTarget)) t = instance.explodeTarget;
  applyExplode(instance, t);
}

// level: 0 = none, 1 = hover, 2 = selected
export function setHighlight(part, level) {
  if (part.level === level) return;
  part.level = level;
  for (const m of part.meshes) {
    if (m.userData.noTint) continue;
    if (level === 0) {
      m.material.emissive.copy(m.userData.baseEmissive);
      m.material.emissiveIntensity = m.userData.baseIntensity;
    } else {
      m.material.emissive.copy(part.tint);
      m.material.emissiveIntensity = level === 1 ? 0.14 : 0.32;
    }
  }
}

export function disposeInstance(instance) {
  instance.root.traverse((m) => {
    if (m.isMesh) {
      m.geometry.disposeBoundsTree();
      m.geometry.dispose();
      m.material.dispose();
    }
  });
}
