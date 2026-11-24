import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type CameraPreset = 'orbit' | 'closeup' | 'overview';
export type CoreMode = 'overdrive' | 'stealth' | 'pulse';

interface Hero3DCanvasProps {
  cameraPreset: CameraPreset;
  coreMode: CoreMode;
  explodedFactor: number;
  onCoreClick?: () => void;
}

// Module-scope reusable math objects for zero-GC render loop
const _tempObj = new THREE.Object3D();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _mouseRayVec = new THREE.Vector2();

function createCircuitFloorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;

    const grad = ctx.createRadialGradient(cx, cy, 36, cx, cy, size * 0.49);
    grad.addColorStop(0, 'rgba(139, 92, 246, 0.30)');
    grad.addColorStop(0.45, 'rgba(109, 40, 217, 0.16)');
    grad.addColorStop(1, 'rgba(5, 5, 7, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.14)';
    ctx.lineWidth = 1;
    const step = 64;
    for (let i = 0; i <= size; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    const radii = [120, 220, 330, 440];
    radii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle =
        idx % 2 === 0 ? 'rgba(168, 85, 247, 0.52)' : 'rgba(192, 132, 252, 0.35)';
      ctx.lineWidth = idx === 1 ? 2.5 : 1.5;
      if (idx === 2) ctx.setLineDash([14, 10]);
      else ctx.setLineDash([]);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    for (let a = 0; a < 72; a++) {
      const ang = (a / 72) * Math.PI * 2;
      const rIn = a % 6 === 0 ? 416 : 428;
      const rOut = 440;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * rIn, cy + Math.sin(ang) * rIn);
      ctx.lineTo(cx + Math.cos(ang) * rOut, cy + Math.sin(ang) * rOut);
      ctx.strokeStyle =
        a % 6 === 0 ? 'rgba(216, 180, 254, 0.72)' : 'rgba(139, 92, 246, 0.36)';
      ctx.lineWidth = a % 6 === 0 ? 2 : 1;
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      10,
      size / 2,
      size / 2,
      size / 2,
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
    grad.addColorStop(0.55, 'rgba(8, 5, 14, 0.48)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Hero3DCanvas({
  cameraPreset,
  coreMode,
  explodedFactor,
  onCoreClick,
}: Hero3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const stateRef = useRef({
    cameraPreset,
    coreMode,
    explodedFactor,
    onCoreClick,
    transitionActive: false,
    burstEnergy: 0,
  });

  useEffect(() => {
    const prevPreset = stateRef.current.cameraPreset;
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.coreMode = coreMode;
    stateRef.current.explodedFactor = explodedFactor;
    stateRef.current.onCoreClick = onCoreClick;
    if (prevPreset !== cameraPreset) {
      stateRef.current.transitionActive = true;
    }
  }, [cameraPreset, coreMode, explodedFactor, onCoreClick]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x050507, 1);

    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    const handleContextRestored = () => {
      setWebglFailed(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);
    scene.fog = new THREE.FogExp2(0x050507, 0.044);

    // Studio IBL Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTex;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 140);
    const isMobileInit = width < 768;
    camera.position.set(isMobileInit ? 0 : 2.8, isMobileInit ? 3.5 : 3.2, isMobileInit ? 10.6 : 8.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 15.0;
    controls.minPolarAngle = Math.PI * 0.16;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(isMobileInit ? 0 : -1.55, isMobileInit ? 1.55 : 1.35, 0);
    controls.update();

    controls.addEventListener('start', () => {
      stateRef.current.transitionActive = false;
    });

    // Violet & Purple Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xc084fc, 0x07050c, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf5f3ff, 2.0);
    keyLight.position.set(6, 10, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 28;
    const d = 6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Dual orbiting neon purple & deep violet lights + internal crystal glow light
    const neonPurpleLight = new THREE.PointLight(0xa855f7, 11, 22, 1.5);
    neonPurpleLight.position.set(-4.2, 3.8, -3.2);
    scene.add(neonPurpleLight);

    const deepVioletLight = new THREE.PointLight(0x7c3aed, 9.5, 22, 1.5);
    deepVioletLight.position.set(4.5, 2.4, 3.4);
    scene.add(deepVioletLight);

    const crystalCoreGlow = new THREE.PointLight(0xc084fc, 6.5, 9, 1.4);
    crystalCoreGlow.position.set(0, 1.94, 0);
    scene.add(crystalCoreGlow);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    // 1. Tactical Arena Floor & Contact Shadow
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const floorTex = createCircuitFloorTexture(maxAniso);
    textures.push(floorTex);

    const floorGeo = new THREE.CircleGeometry(16, 64);
    geometries.push(floorGeo);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.72,
      metalness: 0.25,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    materials.push(floorMat);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const shadowTex = createContactShadowTexture();
    textures.push(shadowTex);
    const contactGeo = new THREE.PlaneGeometry(5.8, 5.8);
    geometries.push(contactGeo);
    const contactMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.62,
    });
    materials.push(contactMat);
    const contactPlane = new THREE.Mesh(contactGeo, contactMat);
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = 0.02;
    scene.add(contactPlane);

    // 2. Deep Space Violet Starfield
    const starCount = 340;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const scNeonPurple = new THREE.Color(0xa855f7);
    const scSoftViolet = new THREE.Color(0xc084fc);
    const scLilacMist = new THREE.Color(0xede9fe);

    for (let i = 0; i < starCount; i++) {
      const r = 10 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.52;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = 0.8 + r * Math.cos(phi) * 0.65;
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = i % 3 === 0 ? scNeonPurple : i % 3 === 1 ? scSoftViolet : scLilacMist;
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    geometries.push(starGeo);

    const starMat = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      sizeAttenuation: true,
      depthWrite: false,
    });
    materials.push(starMat);
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 3. Composite Multi-Part Procedural Hero Subject: Matte Black Monolith & Violet Crystal
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    const matteBlackMat = new THREE.MeshPhysicalMaterial({
      color: 0x09080f,
      metalness: 0.78,
      roughness: 0.28,
      clearcoat: 0.75,
      clearcoatRoughness: 0.16,
    });
    const brushedCharcoalMat = new THREE.MeshStandardMaterial({
      color: 0x151221,
      metalness: 0.42,
      roughness: 0.64,
    });
    const neonPurpleMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xa855f7,
      emissiveIntensity: 2.6,
      roughness: 0.16,
      metalness: 0.25,
    });
    const deepVioletAccentMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.3,
    });
    const anodizedVioletRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x2e1065,
      metalness: 0.92,
      roughness: 0.18,
      anisotropy: 0.75,
      clearcoat: 0.9,
    });
    const anodizedObsidianRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1338,
      metalness: 0.9,
      roughness: 0.2,
      anisotropy: 0.7,
      clearcoat: 0.85,
    });
    const crystalCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 1.35,
      metalness: 0.1,
      roughness: 0.05,
      ior: 1.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      iridescence: 0.8,
      iridescenceIOR: 1.45,
      transparent: true,
      opacity: isSoftwareGl ? 0.65 : 0.92,
      transmission: isSoftwareGl ? 0 : 0.76,
      thickness: 1.45,
    });

    materials.push(
      matteBlackMat,
      brushedCharcoalMat,
      neonPurpleMat,
      deepVioletAccentMat,
      anodizedVioletRingMat,
      anodizedObsidianRingMat,
      crystalCoreMat,
    );

    // Part 1: Stepped Octagonal Pedestal Base
    const baseLowerGeo = new THREE.CylinderGeometry(2.05, 2.35, 0.26, 8);
    geometries.push(baseLowerGeo);
    const baseLower = new THREE.Mesh(baseLowerGeo, brushedCharcoalMat);
    baseLower.position.y = 0.13;
    baseLower.castShadow = true;
    baseLower.receiveShadow = true;
    heroGroup.add(baseLower);

    // Part 2: Upper Beveled Deck Plate
    const baseUpperGeo = new THREE.CylinderGeometry(1.48, 1.82, 0.22, 8);
    geometries.push(baseUpperGeo);
    const baseUpper = new THREE.Mesh(baseUpperGeo, matteBlackMat);
    baseUpper.position.y = 0.37;
    baseUpper.castShadow = true;
    baseUpper.receiveShadow = true;
    heroGroup.add(baseUpper);

    // Part 3: Recessed Violet Energy Ring on Pedestal
    const deckRingGeo = new THREE.TorusGeometry(1.62, 0.035, 16, 48);
    geometries.push(deckRingGeo);
    const deckRing = new THREE.Mesh(deckRingGeo, deepVioletAccentMat);
    deckRing.rotation.x = Math.PI / 2;
    deckRing.position.y = 0.48;
    heroGroup.add(deckRing);

    // Part 4: Four Corner Tactical Pylons
    const pylonGroup = new THREE.Group();
    heroGroup.add(pylonGroup);
    const pylonBodyGeo = new THREE.BoxGeometry(0.22, 0.85, 0.22);
    const pylonCapGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    geometries.push(pylonBodyGeo, pylonCapGeo);

    const pylonMeshes: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      const pHolder = new THREE.Group();
      const body = new THREE.Mesh(pylonBodyGeo, matteBlackMat);
      body.position.y = 0.425;
      body.castShadow = true;
      const emitter = new THREE.Mesh(
        pylonCapGeo,
        i % 2 === 0 ? neonPurpleMat : deepVioletAccentMat,
      );
      emitter.position.y = 0.92;
      pHolder.add(body, emitter);
      pHolder.position.set(Math.cos(ang) * 1.65, 0.25, Math.sin(ang) * 1.65);
      pHolder.rotation.y = -ang;
      pHolder.userData = { baseRadius: 1.65, angle: ang };
      pylonGroup.add(pHolder);
      pylonMeshes.push(pHolder);
    }

    // Core Assembly Group
    const coreAssembly = new THREE.Group();
    coreAssembly.position.y = 1.94;
    heroGroup.add(coreAssembly);

    // Part 5: Outer Faceted Armor Cage
    const armorCageGeo = new THREE.IcosahedronGeometry(0.98, 0);
    geometries.push(armorCageGeo);
    const armorCageEdges = new THREE.EdgesGeometry(armorCageGeo);
    geometries.push(armorCageEdges);
    const armorLineMat = new THREE.LineBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.72,
    });
    materials.push(armorLineMat);
    const armorCage = new THREE.LineSegments(armorCageEdges, armorLineMat);
    coreAssembly.add(armorCage);

    // Part 6: Primary Violet Glowing Octahedral Crystal + Luminous Lilac Facet Edges
    const crystalGeo = new THREE.OctahedronGeometry(0.7, 0);
    geometries.push(crystalGeo);
    const crystalCore = new THREE.Mesh(crystalGeo, crystalCoreMat);
    crystalCore.castShadow = true;
    crystalCore.layers.enable(1);
    coreAssembly.add(crystalCore);

    const crystalWireGeo = new THREE.EdgesGeometry(crystalGeo);
    geometries.push(crystalWireGeo);
    const crystalWireMat = new THREE.LineBasicMaterial({
      color: 0xe9d5ff,
      transparent: true,
      opacity: 0.85,
    });
    materials.push(crystalWireMat);
    const crystalEdges = new THREE.LineSegments(crystalWireGeo, crystalWireMat);
    crystalCore.add(crystalEdges);

    // Inner luminous violet energy heart
    const heartGeo = new THREE.OctahedronGeometry(0.34, 1);
    geometries.push(heartGeo);
    const heartMesh = new THREE.Mesh(heartGeo, neonPurpleMat);
    coreAssembly.add(heartMesh);

    // Part 7: Primary Tilted Orbital Gimbal Ring
    const gimbalOuterGroup = new THREE.Group();
    const ringOuterGeo = new THREE.TorusGeometry(1.42, 0.055, 20, 72);
    geometries.push(ringOuterGeo);
    const ringOuter = new THREE.Mesh(ringOuterGeo, anodizedVioletRingMat);
    ringOuter.castShadow = true;
    gimbalOuterGroup.add(ringOuter);

    const nodeGeo = new THREE.SphereGeometry(0.085, 16, 16);
    geometries.push(nodeGeo);
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const node = new THREE.Mesh(nodeGeo, neonPurpleMat);
      node.position.set(Math.cos(a) * 1.42, Math.sin(a) * 1.42, 0);
      gimbalOuterGroup.add(node);
    }
    gimbalOuterGroup.rotation.set(0.55, 0.25, 0.15);
    coreAssembly.add(gimbalOuterGroup);

    // Part 8: Secondary Counter-Rotating Gimbal Ring
    const gimbalInnerGroup = new THREE.Group();
    const ringInnerGeo = new THREE.TorusGeometry(1.15, 0.04, 18, 64);
    geometries.push(ringInnerGeo);
    const ringInner = new THREE.Mesh(ringInnerGeo, anodizedObsidianRingMat);
    gimbalInnerGroup.add(ringInner);
    gimbalInnerGroup.rotation.set(-0.65, 0.4, 0.45);
    coreAssembly.add(gimbalInnerGroup);

    // Part 9: Outer Fin-Line Neon Purple Halo Ring
    const haloRingGroup = new THREE.Group();
    const haloRingGeo = new THREE.TorusGeometry(1.74, 0.016, 12, 96);
    geometries.push(haloRingGeo);
    const haloRingMat = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      emissive: 0xa855f7,
      emissiveIntensity: 1.9,
      transparent: true,
      opacity: 0.78,
      roughness: 0.2,
    });
    materials.push(haloRingMat);
    const haloRingMesh = new THREE.Mesh(haloRingGeo, haloRingMat);
    haloRingGroup.add(haloRingMesh);
    haloRingGroup.rotation.set(Math.PI * 0.42, 0.18, 0);
    coreAssembly.add(haloRingGroup);

    // Part 10: Rising Holographic Violet Energy Waves
    const waveRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }[] = [];
    const waveGeo = new THREE.RingGeometry(1.38, 1.43, 64);
    geometries.push(waveGeo);
    for (let i = 0; i < 2; i++) {
      const waveMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xa855f7 : 0xc084fc,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      materials.push(waveMat);
      const waveMesh = new THREE.Mesh(waveGeo, waveMat);
      waveMesh.rotation.x = -Math.PI / 2;
      waveMesh.position.y = 0.52;
      heroGroup.add(waveMesh);
      waveRings.push({ mesh: waveMesh, mat: waveMat, phase: i * 0.5 });
    }

    // 4. InstancedMesh Floating Geometric Violet Shards
    const shardCount = 96;
    const shardGeo = new THREE.OctahedronGeometry(0.065, 0);
    geometries.push(shardGeo);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.75,
      emissive: 0x581c87,
      emissiveIntensity: 0.85,
    });
    materials.push(shardMat);

    const shardInstanced = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
    shardInstanced.frustumCulled = false;

    const shardMeta: {
      radius: number;
      angle: number;
      height: number;
      speed: number;
      scale: number;
      phase: number;
    }[] = [];

    const cDeepViolet = new THREE.Color(0x7c3aed);
    const cNeonPurple = new THREE.Color(0xa855f7);
    const cSoftLilac = new THREE.Color(0xd8b4fe);

    for (let i = 0; i < shardCount; i++) {
      const radius = 2.6 + Math.random() * 6.8;
      const angle = Math.random() * Math.PI * 2;
      const yPos = 0.45 + Math.random() * 4.8;
      const scale = 0.55 + Math.random() * 1.15;
      const speed = (0.14 + Math.random() * 0.28) * (i % 2 === 0 ? 1 : -1);
      const phase = Math.random() * Math.PI * 2;

      shardMeta.push({ radius, angle, height: yPos, speed, scale, phase });

      _tempObj.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
      _tempObj.scale.setScalar(scale);
      _tempObj.updateMatrix();
      shardInstanced.setMatrixAt(i, _tempObj.matrix);

      const pick = i % 3 === 0 ? cDeepViolet : i % 3 === 1 ? cNeonPurple : cSoftLilac;
      shardInstanced.setColorAt(i, pick);
    }
    shardInstanced.instanceMatrix.needsUpdate = true;
    if (shardInstanced.instanceColor) shardInstanced.instanceColor.needsUpdate = true;
    shardInstanced.computeBoundingSphere();
    scene.add(shardInstanced);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    let pointerX = 0;
    let pointerY = 0;
    let isHovered = false;
    let lastRaycast = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const now = performance.now();
      if (now - lastRaycast < 60) return;
      lastRaycast = now;

      _mouseRayVec.set(pointerX, pointerY);
      raycaster.setFromCamera(_mouseRayVec, camera);
      const hits = raycaster.intersectObject(crystalCore, false);
      const hit = hits.length > 0;
      if (hit !== isHovered) {
        isHovered = hit;
        renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouseRayVec.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(_mouseRayVec, camera);
      const hits = raycaster.intersectObject(crystalCore, false);
      if (hits.length > 0) {
        stateRef.current.burstEnergy = 1.0;
        stateRef.current.onCoreClick?.();
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleCanvasClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let smoothExplode = 0;
    let smoothHoverScale = 1;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const {
        cameraPreset: preset,
        coreMode: mode,
        explodedFactor: targetExplode,
      } = stateRef.current;

      const speedMult =
        prefersReducedMotion ? 0.15 : mode === 'overdrive' ? 1.45 : mode === 'stealth' ? 0.45 : 0.95;

      stateRef.current.burstEnergy = THREE.MathUtils.damp(
        stateRef.current.burstEnergy,
        0,
        4.2,
        delta,
      );
      const burst = stateRef.current.burstEnergy;

      smoothExplode = THREE.MathUtils.damp(smoothExplode, targetExplode, 5.5, delta);
      smoothHoverScale = THREE.MathUtils.damp(smoothHoverScale, isHovered ? 1.09 : 1.0, 8, delta);

      const bobY = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.35) * 0.11 + Math.sin(elapsed * 2.7) * 0.025;
      coreAssembly.position.y = 1.94 + bobY + smoothExplode * 0.55;
      crystalCoreGlow.position.y = coreAssembly.position.y;

      crystalCore.rotation.y += delta * (0.62 * speedMult + burst * 4.8);
      crystalCore.rotation.x = Math.sin(elapsed * 0.62) * 0.24;
      crystalCore.rotation.z = Math.cos(elapsed * 0.48) * 0.14;
      crystalCore.scale.setScalar(smoothHoverScale + burst * 0.14);

      heartMesh.rotation.y -= delta * (1.3 * speedMult);
      heartMesh.rotation.x += delta * (0.48 * speedMult);
      const heartScale = 1 + Math.sin(elapsed * 2.5) * 0.1 + burst * 0.4;
      heartMesh.scale.setScalar(heartScale);

      armorCage.rotation.y -= delta * 0.26 * speedMult;
      armorCage.rotation.x = Math.sin(elapsed * 0.42) * 0.16;
      armorCage.scale.setScalar(1 + smoothExplode * 0.42 + (smoothHoverScale - 1) * 0.7);

      gimbalOuterGroup.rotation.z += delta * (0.45 * speedMult + burst * 2.5);
      gimbalOuterGroup.rotation.x = 0.55 + Math.sin(elapsed * 0.58) * 0.16;
      gimbalOuterGroup.scale.setScalar(1 + smoothExplode * 0.28);

      gimbalInnerGroup.rotation.x -= delta * (0.68 * speedMult + burst * 2.5);
      gimbalInnerGroup.rotation.y += delta * 0.38 * speedMult;
      gimbalInnerGroup.scale.setScalar(1 + smoothExplode * 0.18);

      haloRingGroup.rotation.z -= delta * (0.28 * speedMult + burst * 1.8);
      haloRingGroup.rotation.y = 0.18 + Math.sin(elapsed * 0.5) * 0.24;
      haloRingGroup.scale.setScalar(1 + smoothExplode * 0.35 + burst * 0.24);

      if (!prefersReducedMotion) {
        starField.rotation.y += delta * 0.025 * speedMult;
        starField.rotation.x = Math.sin(elapsed * 0.15) * 0.03;
      }

      for (let i = 0; i < waveRings.length; i++) {
        const w = waveRings[i];
        const cycle = prefersReducedMotion ? 0.2 : (elapsed * 0.28 * speedMult + w.phase) % 1;
        w.mesh.position.y = 0.5 + cycle * 2.4;
        const s = 0.95 + cycle * 0.36 + smoothExplode * 0.2;
        w.mesh.scale.setScalar(s);
        w.mat.opacity = Math.sin(cycle * Math.PI) * (0.46 + burst * 0.35);
      }

      if (!prefersReducedMotion) {
        const lightAng = elapsed * 0.35 * speedMult;
        neonPurpleLight.position.x = Math.cos(lightAng + Math.PI) * 4.5;
        neonPurpleLight.position.z = Math.sin(lightAng + Math.PI) * 4.2;
        deepVioletLight.position.x = Math.cos(lightAng) * 4.6;
        deepVioletLight.position.z = Math.sin(lightAng) * 4.2;
      }

      for (let i = 0; i < pylonMeshes.length; i++) {
        const p = pylonMeshes[i];
        const r = p.userData.baseRadius + smoothExplode * 0.65;
        const a = p.userData.angle;
        p.position.x = Math.cos(a) * r;
        p.position.z = Math.sin(a) * r;
      }

      if (mode === 'overdrive') {
        neonPurpleMat.emissive.setHex(0xa855f7);
        neonPurpleMat.emissiveIntensity = 2.8 + burst * 2.2;
        deepVioletAccentMat.emissive.setHex(0x8b5cf6);
        deepVioletAccentMat.emissiveIntensity = 2.4 + burst * 1.6;
        crystalCoreMat.emissiveIntensity = 1.45 + burst * 1.1;
        crystalCoreGlow.intensity = 7.5 + burst * 5;
        neonPurpleLight.intensity = 11.5 + burst * 5;
        deepVioletLight.intensity = 9.5;
      } else if (mode === 'stealth') {
        neonPurpleMat.emissive.setHex(0x6d28d9);
        neonPurpleMat.emissiveIntensity = 1.2 + burst * 2.0;
        deepVioletAccentMat.emissive.setHex(0x4c1d95);
        deepVioletAccentMat.emissiveIntensity = 1.1 + burst * 1.5;
        crystalCoreMat.emissiveIntensity = 0.75 + burst * 1.0;
        crystalCoreGlow.intensity = 3.8 + burst * 4;
        neonPurpleLight.intensity = 5.5 + burst * 4;
        deepVioletLight.intensity = 5.0;
      } else {
        const pulseWave = 0.5 + 0.5 * Math.sin(elapsed * 2.8);
        neonPurpleMat.emissive.setHex(0xc084fc);
        neonPurpleMat.emissiveIntensity = 1.6 + pulseWave * 1.8 + burst * 2.0;
        deepVioletAccentMat.emissive.setHex(0x7c3aed);
        deepVioletAccentMat.emissiveIntensity = 1.4 + (1 - pulseWave) * 1.5 + burst * 1.5;
        crystalCoreMat.emissiveIntensity = 1.0 + pulseWave * 0.9 + burst * 1.0;
        crystalCoreGlow.intensity = 5.5 + pulseWave * 4.5;
        neonPurpleLight.intensity = 7.5 + pulseWave * 4.5;
        deepVioletLight.intensity = 7.0 + (1 - pulseWave) * 3.5;
      }

      for (let i = 0; i < shardCount; i++) {
        const m = shardMeta[i];
        const ang = m.angle + elapsed * m.speed * speedMult * 0.35;
        const yFloat = m.height + Math.sin(elapsed * 1.1 + m.phase) * 0.24;
        _tempObj.position.set(Math.cos(ang) * m.radius, yFloat, Math.sin(ang) * m.radius);
        _tempObj.rotation.set(elapsed * 0.65 + m.phase, ang, 0);
        _tempObj.scale.setScalar(m.scale);
        _tempObj.updateMatrix();
        shardInstanced.setMatrixAt(i, _tempObj.matrix);
      }
      shardInstanced.instanceMatrix.needsUpdate = true;

      const isNarrow = (container?.clientWidth || window.innerWidth) < 768;
      if (stateRef.current.transitionActive) {
        if (preset === 'orbit') {
          _targetCamPos.set(isNarrow ? 0 : 2.8, isNarrow ? 3.5 : 3.2, isNarrow ? 10.6 : 8.4);
          _targetLookAt.set(isNarrow ? 0 : -1.55, isNarrow ? 1.55 : 1.35, 0);
        } else if (preset === 'closeup') {
          _targetCamPos.set(isNarrow ? 0 : 1.2, 2.25, isNarrow ? 5.8 : 4.9);
          _targetLookAt.set(isNarrow ? 0 : -0.65, 1.85, 0);
        } else {
          _targetCamPos.set(0, 6.2, isNarrow ? 11.2 : 9.6);
          _targetLookAt.set(0, 1.1, 0);
        }

        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 4.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 4.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 4.5, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLookAt.x, 4.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLookAt.y, 4.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLookAt.z, 4.5, delta);

        if (camera.position.distanceTo(_targetCamPos) < 0.04) {
          stateRef.current.transitionActive = false;
        }
      }

      if (!prefersReducedMotion) {
        const idleSway = Math.sin(elapsed * 0.45) * 0.06;
        heroGroup.rotation.y = THREE.MathUtils.damp(
          heroGroup.rotation.y,
          pointerX * 0.18 + idleSway,
          3.2,
          delta,
        );
        heroGroup.rotation.x = THREE.MathUtils.damp(
          heroGroup.rotation.x,
          pointerY * 0.05,
          3.2,
          delta,
        );
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTex.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_70%_40%,rgba(124,58,237,0.28),rgba(168,85,247,0.14)_40%,#050507_78%)]">
        <div className="h-64 w-64 rounded-full border border-[#A855F7]/45 bg-[#09080F]/85 shadow-[0_0_90px_rgba(168,85,247,0.35)]" />
      </div>
    );
  }

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
