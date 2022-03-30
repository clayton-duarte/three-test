import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

function createRender(window: Window, canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  return renderer;
}

function createCamera(window: Window) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.setZ(50);

  return camera;
}

function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  return scene;
}

function addParticles(scene: THREE.Scene) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 2000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const material = new THREE.PointsMaterial({ color: 0xffffff });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return points;
}

function addCube(scene: THREE.Scene) {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: 0x333333,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  return cube;
}

function addLights(scene: THREE.Scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff);
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(10, 10, 10);

  scene.add(ambientLight, pointLight);

  return pointLight;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = createRender(window, canvasRef.current);
    const camera = createCamera(window);
    const scene = createScene();

    const cube = addCube(scene);
    addParticles(scene);
    addLights(scene);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.rotation.z += 0.01;

      controls.update();

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <main>
      <canvas id="bg" ref={canvasRef} />
      <article id="content">text</article>
      <style jsx>{`
        canvas#bg {
          position: fixed;
          left: 0;
          top: 0;
        }

        article#content {
          position: absolute;
          color: #fff;
          left: 0;
          top: 0;
        }
      `}</style>
    </main>
  );
}
