import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const mount = document.getElementById("interactive-logo");
if (mount && window.WebGLRenderingContext && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  start3D().catch((error) => console.warn("3D logo unavailable; using original image.", error));
}

async function start3D() {
  const image = new Image();
  image.src = "./logo.png";
  await image.decode();
  const width = mount.clientWidth || 520;
  const height = mount.clientHeight || 340;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 0.15, 12.7);
  const ambient = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(-3, 5, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffb334, 2);
  rim.position.set(4, 1, -5);
  scene.add(rim);

  const rig = new THREE.Group();
  scene.add(rig);
  const logo = new THREE.Group();
  rig.add(logo);

  // Keep the exact official logo as the front texture, while constructing
  // real 3D thickness from its transparency silhouette.
  const iw = image.naturalWidth, ih = image.naturalHeight;
  const planeW = 8.3, planeH = planeW * ih / iw;
  const canvas = document.createElement("canvas");
  canvas.width = 150;
  canvas.height = Math.max(40, Math.round(150 * ih / iw));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const sideMaterial = new THREE.MeshStandardMaterial({ color: 0x171b28, roughness: 0.45, metalness: 0.24 });
  const thickness = 0.09;
  const cellW = planeW / canvas.width;
  const cellH = planeH / canvas.height;
  // Merge opaque cells horizontally into strips to avoid thousands of meshes.
  const strips = [];
  for (let y = 0; y < canvas.height; y++) {
    let start = -1;
    for (let x = 0; x <= canvas.width; x++) {
      const opaque = x < canvas.width && pixels[(y * canvas.width + x) * 4 + 3] > 100;
      if (opaque && start === -1) start = x;
      if (!opaque && start !== -1) {
        strips.push({ start, end: x, y });
        start = -1;
      }
    }
  }
  const baseGeo = new THREE.BoxGeometry(1, 1, 1);
  const sides = new THREE.InstancedMesh(baseGeo, sideMaterial, strips.length);
  const matrix = new THREE.Matrix4();
  strips.forEach((s, i) => {
    matrix.compose(
      new THREE.Vector3(((s.start + s.end) / 2 / canvas.width - .5) * planeW, (.5 - (s.y + .5) / canvas.height) * planeH, -thickness / 2),
      new THREE.Quaternion(),
      new THREE.Vector3((s.end - s.start) * cellW, cellH * 1.02, thickness)
    );
    sides.setMatrixAt(i, matrix);
  });
  sides.instanceMatrix.needsUpdate = true;
  logo.add(sides);

  const texture = new THREE.Texture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const faceMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH), faceMat);
  front.position.z = .015;
  logo.add(front);

  let dragging = false, lastX = 0, lastY = 0, targetX = 0, targetY = 0;
  renderer.domElement.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    renderer.domElement.setPointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    targetY += (event.clientX - lastX) * .008;
    targetX += (event.clientY - lastY) * .006;
    targetX = THREE.MathUtils.clamp(targetX, -.55, .55);
    targetY = THREE.MathUtils.clamp(targetY, -.65, .65);
    lastX = event.clientX;
    lastY = event.clientY;
  });
  const stop = () => { dragging = false; };
  renderer.domElement.addEventListener("pointerup", stop);
  renderer.domElement.addEventListener("pointercancel", stop);
  const fallback = mount.querySelector(".interactive-logo-fallback");
  mount.appendChild(renderer.domElement);
  fallback.hidden = true;
  const clock = new THREE.Clock();
  let frame;
  function animate() {
    frame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    rig.rotation.x += (targetX - rig.rotation.x) * .09;
    rig.rotation.y += (targetY - rig.rotation.y) * .09;
    renderer.render(scene, camera);
  }
  const observer = new ResizeObserver(() => {
    const w = mount.clientWidth, h = mount.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.position.z = w < 430 ? 15.3 : 12.7;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  observer.observe(mount);
  animate();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else animate();
  });
}
