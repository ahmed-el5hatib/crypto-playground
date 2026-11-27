/* Hero 3D scene: rotating lattice crystal + particle field (Three.js) */
import * as THREE from "three";

const container = document.getElementById("hero-3d");
if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 0, 26);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // --- Lattice crystal: 5x5x5 grid of nodes connected by lines ---
  const N = 5, SPACING = 4.4;
  const nodeGeo = new THREE.SphereGeometry(0.13, 12, 12);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.9 });
  const violetMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.9 });
  const offset = ((N - 1) * SPACING) / 2;

  const linePts = [];
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const px = x * SPACING - offset, py = y * SPACING - offset, pz = z * SPACING - offset;
    const m = new THREE.Mesh(nodeGeo, (x + y + z) % 3 === 0 ? violetMat : nodeMat);
    m.position.set(px, py, pz);
    m.userData.phase = Math.random() * Math.PI * 2;
    group.add(m);
    if (x < N - 1) linePts.push(px, py, pz, px + SPACING, py, pz);
    if (y < N - 1) linePts.push(px, py, pz, px, py + SPACING, pz);
    if (z < N - 1) linePts.push(px, py, pz, px, py, pz + SPACING);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
  const lines = new THREE.LineSegments(lineGeo,
    new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.16 }));
  group.add(lines);

  // --- Outer wireframe icosahedron ---
  const ico = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(15.5, 1)),
    new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.1 })
  );
  scene.add(ico);

  // --- Particle field ---
  const P = 700;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(P * 3);
  for (let i = 0; i < P; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 90;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo,
    new THREE.PointsMaterial({ color: 0x67e8f9, size: 0.09, transparent: true, opacity: 0.55 }));
  scene.add(particles);

  // Mouse parallax
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("pointermove", e => {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mx += (tx - mx) * 0.04;
    my += (ty - my) * 0.04;

    group.rotation.y = t * 0.12 + mx * 0.35;
    group.rotation.x = Math.sin(t * 0.18) * 0.16 + my * 0.25;
    ico.rotation.y = -t * 0.05;
    ico.rotation.z = t * 0.03;
    particles.rotation.y = t * 0.02;

    // breathing nodes
    group.children.forEach(c => {
      if (c.userData.phase !== undefined) {
        const s = 1 + Math.sin(t * 1.6 + c.userData.phase) * 0.35;
        c.scale.setScalar(s);
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
