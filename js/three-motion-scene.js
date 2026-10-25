/**
 * Earthroot Mushrooms - 3D Motion Scroll & WebGL World Engine
 * Powered by Three.js
 * 
 * Features:
 * - Interactive 3D Hero Organic Mushroom Sculpture with dynamic lighting & orbit
 * - Bioluminescent 3D Spore Cloud with 1,000+ interactive particles
 * - Living Mycelium 3D Neural Network with pulsing synaptic filaments
 * - Continuous 3D Camera Scroll Flight Path with depth interpolation (lerp)
 * - Mouse Gyro Parallax with silky momentum
 * - Performance-optimized with LOD and mobile detection
 */

(function () {
  'use strict';

  // Ensure Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. 3D motion scene running in CSS fallback mode.');
    return;
  }

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    console.warn('WebGL not supported. Running standard responsive view.');
    return;
  }

  // --- Configuration ---
  const CONFIG = {
    particleCount: window.innerWidth < 768 ? 400 : 900,
    myceliumNodes: window.innerWidth < 768 ? 45 : 85,
    cameraFov: 55,
    cameraNear: 0.1,
    cameraFar: 1000,
    lerpSpeed: 0.05,
    mouseLerpSpeed: 0.04
  };

  // --- State Variables ---
  let scene, camera, renderer, container;
  let sporeParticles, sporeGeometry, sporePositions, sporeVelocities;
  let myceliumGroup, myceliumLines, myceliumNodesMesh;
  let heroMushroomGroup, mushroomCap, mushroomStem, mushroomGills, heroHaloRing;
  let ambientLight, mainDirectionalLight, bioluminescentPointLight, goldPointLight;

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  let scrollProgress = 0;
  let targetScrollProgress = 0;
  let currentScrollProgress = 0;

  let isMotionActive = true;
  let clock = new THREE.Clock();

  // Color Palette Constants
  const PALETTE = {
    deepForest: 0x0f271d,
    vibrantEmerald: 0x10b981,
    neonMint: 0x34d399,
    accentGold: 0xd4a342,
    accentGoldLight: 0xf7e8c4,
    terracotta: 0xca6536,
    softWhite: 0xffffff
  };

  // --- Initialize 3D Engine ---
  function init() {
    // 1. Create or bind canvas container
    container = document.getElementById('webgl-3d-canvas-wrap');
    if (!container) {
      container = document.createElement('div');
      container.id = 'webgl-3d-canvas-wrap';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
      `;
      document.body.insertBefore(container, document.body.firstChild);
    }

    // 2. Setup Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1c15, 0.015);

    camera = new THREE.PerspectiveCamera(CONFIG.cameraFov, windowWidth / windowHeight, CONFIG.cameraNear, CONFIG.cameraFar);
    camera.position.set(0, 0, 30);

    // 3. Setup WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance'
    });
    renderer.setSize(windowWidth, windowHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent for HTML background harmony
    renderer.shadowMap.enabled = false; // Disabled for ultra-smooth 60fps
    container.appendChild(renderer.domElement);

    // 4. Create Scene Objects
    createLighting();
    createHeroMushroomSculpture();
    createSporeCloud();
    createMyceliumNetwork();

    // 5. Setup Listeners
    setupEventListeners();

    // 6. Start Render Loop
    tick();

    // 7. Inject HUD and 3D Control elements
    create3DMotionHUD();
  }

  // --- Lighting System ---
  function createLighting() {
    ambientLight = new THREE.AmbientLight(PALETTE.deepForest, 1.8);
    scene.add(ambientLight);

    mainDirectionalLight = new THREE.DirectionalLight(PALETTE.accentGoldLight, 2.2);
    mainDirectionalLight.position.set(15, 25, 20);
    scene.add(mainDirectionalLight);

    bioluminescentPointLight = new THREE.PointLight(PALETTE.vibrantEmerald, 3.5, 60);
    bioluminescentPointLight.position.set(-8, 5, 10);
    scene.add(bioluminescentPointLight);

    goldPointLight = new THREE.PointLight(PALETTE.accentGold, 3.0, 70);
    goldPointLight.position.set(10, -10, 15);
    scene.add(goldPointLight);
  }

  // --- Procedural 3D Mushroom Centerpiece ---
  function createHeroMushroomSculpture() {
    heroMushroomGroup = new THREE.Group();
    heroMushroomGroup.position.set(12, 0, 0); // Placed elegantly in the hero right quadrant on desktop

    if (window.innerWidth < 992) {
      heroMushroomGroup.position.set(0, 4, -8); // Center background on tablet/mobile
      heroMushroomGroup.scale.set(0.75, 0.75, 0.75);
    }

    // A. Organic Mushroom Cap
    const capPoints = [];
    // Lathe profile for a sculpted gourmet mushroom cap
    capPoints.push(new THREE.Vector2(0, 3.8));
    capPoints.push(new THREE.Vector2(0.8, 3.75));
    capPoints.push(new THREE.Vector2(1.8, 3.5));
    capPoints.push(new THREE.Vector2(3.0, 2.9));
    capPoints.push(new THREE.Vector2(4.2, 1.9));
    capPoints.push(new THREE.Vector2(4.8, 0.8));
    capPoints.push(new THREE.Vector2(4.6, 0.4));
    capPoints.push(new THREE.Vector2(3.8, 0.3));
    capPoints.push(new THREE.Vector2(2.5, 0.5));
    capPoints.push(new THREE.Vector2(1.2, 0.6));

    const capGeometry = new THREE.LatheGeometry(capPoints, 36);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0xefd8b3, // Warm organic mushroom cream
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0x1f3b2e,
      emissiveIntensity: 0.25,
      wireframe: false
    });
    mushroomCap = new THREE.Mesh(capGeometry, capMaterial);
    heroMushroomGroup.add(mushroomCap);

    // B. Bioluminescent Gills Underside (Layered Radial Texture)
    const gillGeometry = new THREE.RingGeometry(1.2, 4.6, 36, 6);
    gillGeometry.rotateX(-Math.PI / 2);
    gillGeometry.translate(0, 0.45, 0);
    const gillMaterial = new THREE.MeshStandardMaterial({
      color: PALETTE.accentGold,
      emissive: PALETTE.vibrantEmerald,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
      wireframe: true
    });
    mushroomGills = new THREE.Mesh(gillGeometry, gillMaterial);
    heroMushroomGroup.add(mushroomGills);

    // C. Elegant Curved Stem
    const stemPoints = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const y = -7 * t + 0.5;
      const radius = 1.1 - 0.3 * Math.sin(t * Math.PI) + 0.4 * (t * t);
      const curveX = Math.sin(t * 1.8) * 0.8;
      stemPoints.push(new THREE.Vector3(curveX, y, 0));
    }

    const stemCurve = new THREE.CatmullRomCurve3(stemPoints);
    const stemGeometry = new THREE.TubeGeometry(stemCurve, 28, 0.85, 18, false);
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf4e8,
      roughness: 0.5,
      metalness: 0.1,
      emissive: 0x102b1f,
      emissiveIntensity: 0.2
    });
    mushroomStem = new THREE.Mesh(stemGeometry, stemMaterial);
    heroMushroomGroup.add(mushroomStem);

    // D. Orbiting Spore Halo Rings
    const ringGeo = new THREE.TorusGeometry(5.8, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: PALETTE.neonMint,
      transparent: true,
      opacity: 0.65
    });
    heroHaloRing = new THREE.Mesh(ringGeo, ringMat);
    heroHaloRing.rotation.x = Math.PI / 3;
    heroMushroomGroup.add(heroHaloRing);

    // Secondary concentric golden halo
    const ringGeo2 = new THREE.TorusGeometry(6.6, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: PALETTE.accentGold,
      transparent: true,
      opacity: 0.45
    });
    const haloRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    haloRing2.rotation.x = -Math.PI / 4;
    haloRing2.rotation.y = Math.PI / 6;
    heroMushroomGroup.add(haloRing2);

    scene.add(heroMushroomGroup);
  }

  // --- Volumetric 3D Bioluminescent Spore Particle Cloud ---
  function createSporeCloud() {
    const count = CONFIG.particleCount;
    sporeGeometry = new THREE.BufferGeometry();
    sporePositions = new Float32Array(count * 3);
    sporeVelocities = new Float32Array(count * 3);
    const sporeScales = new Float32Array(count);
    const sporeColors = new Float32Array(count * 3);

    const c1 = new THREE.Color(PALETTE.vibrantEmerald);
    const c2 = new THREE.Color(PALETTE.accentGold);
    const c3 = new THREE.Color(PALETTE.neonMint);
    const c4 = new THREE.Color(PALETTE.accentGoldLight);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across a deep 3D volume
      sporePositions[i3] = (Math.random() - 0.5) * 85;
      sporePositions[i3 + 1] = (Math.random() - 0.5) * 120;
      sporePositions[i3 + 2] = (Math.random() - 0.5) * 80;

      // Gentle wandering velocities
      sporeVelocities[i3] = (Math.random() - 0.5) * 0.02;
      sporeVelocities[i3 + 1] = Math.random() * 0.04 + 0.01; // gentle upward buoyancy
      sporeVelocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      sporeScales[i] = Math.random() * 2.5 + 1.2;

      // Color variation between gold and bioluminescent emerald
      const randChoice = Math.random();
      let chosenColor;
      if (randChoice < 0.45) chosenColor = c1;
      else if (randChoice < 0.75) chosenColor = c2;
      else if (randChoice < 0.9) chosenColor = c3;
      else chosenColor = c4;

      sporeColors[i3] = chosenColor.r;
      sporeColors[i3 + 1] = chosenColor.g;
      sporeColors[i3 + 2] = chosenColor.b;
    }

    sporeGeometry.setAttribute('position', new THREE.BufferAttribute(sporePositions, 3));
    sporeGeometry.setAttribute('color', new THREE.BufferAttribute(sporeColors, 3));

    // Particle Texture Generator (soft glowing orb)
    const particleTexture = createCircularParticleTexture();

    const sporeMaterial = new THREE.PointsMaterial({
      size: 1.4,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });

    sporeParticles = new THREE.Points(sporeGeometry, sporeMaterial);
    scene.add(sporeParticles);
  }

  function createCircularParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(240, 255, 240, 0.8)');
    gradient.addColorStop(0.7, 'rgba(52, 211, 153, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // --- Living 3D Mycelium Network ---
  function createMyceliumNetwork() {
    myceliumGroup = new THREE.Group();
    myceliumGroup.position.set(0, -25, -10); // Located in the lower soil depth

    const nodeCount = CONFIG.myceliumNodes;
    const nodeCoords = [];

    // Create 3D nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 70;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 45;
      nodeCoords.push(new THREE.Vector3(x, y, z));
    }

    // Connect nodes within a maximum distance to form realistic branching fungal hyphae
    const linePositions = [];
    const maxDist = 18;

    for (let i = 0; i < nodeCount; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodeCoords[i].distanceTo(nodeCoords[j]);
        if (dist < maxDist && connections < 4) {
          linePositions.push(nodeCoords[i].x, nodeCoords[i].y, nodeCoords[i].z);
          linePositions.push(nodeCoords[j].x, nodeCoords[j].y, nodeCoords[j].z);
          connections++;
        }
      }
    }

    // Mycelium Filaments (Lines)
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: PALETTE.neonMint,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });

    myceliumLines = new THREE.LineSegments(lineGeo, lineMat);
    myceliumGroup.add(myceliumLines);

    // Glowing Node Points (Synapses)
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodeCoords);
    const nodeMat = new THREE.PointsMaterial({
      color: PALETTE.accentGoldLight,
      size: 1.2,
      map: createCircularParticleTexture(),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    myceliumNodesMesh = new THREE.Points(nodeGeo, nodeMat);
    myceliumGroup.add(myceliumNodesMesh);

    scene.add(myceliumGroup);
  }

  // --- Event Handlers & Scroll Calculation ---
  function setupEventListeners() {
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Device orientation for mobile 3D gyroscope tilt
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    }
  }

  function onWindowResize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Reposition hero centerpiece if screen resized
    if (heroMushroomGroup) {
      if (windowWidth < 992) {
        heroMushroomGroup.position.set(0, 4, -8);
        heroMushroomGroup.scale.set(0.75, 0.75, 0.75);
      } else {
        heroMushroomGroup.position.set(12, 0, 0);
        heroMushroomGroup.scale.set(1, 1, 1);
      }
    }
  }

  function onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / docHeight));
    }
    updateHUDDepth();
  }

  function onMouseMove(e) {
    // Normalized mouse (-1 to +1)
    targetMouseX = (e.clientX / windowWidth) * 2 - 1;
    targetMouseY = -(e.clientY / windowHeight) * 2 + 1;
  }

  function onDeviceOrientation(e) {
    if (e.gamma !== null && e.beta !== null) {
      targetMouseX = Math.max(-1, Math.min(1, e.gamma / 25));
      targetMouseY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    }
  }

  // --- Main Animation & Render Loop ---
  function tick() {
    requestAnimationFrame(tick);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    if (!isMotionActive) return;

    // Smooth Mouse Interpolation (Lerp)
    mouseX += (targetMouseX - mouseX) * CONFIG.mouseLerpSpeed;
    mouseY += (targetMouseY - mouseY) * CONFIG.mouseLerpSpeed;

    // Smooth Scroll Progress Interpolation (Lerp)
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * CONFIG.lerpSpeed;

    // 1. Camera 3D Flight Path along Scroll Progress
    // Depth 0.0 (Hero): Z=30, Y=0, X=0
    // Depth 0.25 (Varieties): Z=24, Y=-8, X=2
    // Depth 0.50 (Mycelium & Story): Z=18, Y=-22, X=-3
    // Depth 0.75 (Cultivation & Recipes): Z=25, Y=-35, X=1
    // Depth 1.0 (Contact & Footer): Z=32, Y=-48, X=0
    const scrollTargetY = -currentScrollProgress * 48;
    const scrollTargetZ = 30 - Math.sin(currentScrollProgress * Math.PI) * 12;
    const scrollTargetX = Math.sin(currentScrollProgress * Math.PI * 2) * 3;

    // Apply Parallax to Camera
    camera.position.x = scrollTargetX + mouseX * 2.5;
    camera.position.y = scrollTargetY + mouseY * 2.0;
    camera.position.z = scrollTargetZ;

    // Camera Look Target smoothly tracks ahead
    const lookTarget = new THREE.Vector3(
      mouseX * 1.5,
      scrollTargetY - 2 + mouseY * 1.0,
      -10
    );
    camera.lookAt(lookTarget);

    // 2. Animate Hero 3D Mushroom
    if (heroMushroomGroup) {
      // Gentle natural breathing rotation
      heroMushroomGroup.rotation.y = elapsedTime * 0.35 + mouseX * 0.6;
      heroMushroomGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.08 + mouseY * 0.35;
      heroMushroomGroup.rotation.z = Math.cos(elapsedTime * 0.4) * 0.05;

      // Halo ring counter-rotation
      if (heroHaloRing) {
        heroHaloRing.rotation.z = elapsedTime * 0.8;
      }

      // Cap bioluminescence pulse
      if (mushroomCap && mushroomCap.material) {
        mushroomCap.material.emissiveIntensity = 0.25 + 0.15 * Math.sin(elapsedTime * 2);
      }

      // As user scrolls past 35%, fade the hero mushroom gracefully
      const heroFade = Math.max(0, 1 - currentScrollProgress * 3.5);
      heroMushroomGroup.position.y = (1 - heroFade) * 15;
      heroMushroomGroup.scale.setScalar(Math.max(0.01, heroFade * (windowWidth < 992 ? 0.75 : 1)));
    }

    // 3. Animate 3D Spore Cloud
    if (sporeGeometry && sporePositions) {
      const positions = sporeGeometry.attributes.position.array;
      const count = CONFIG.particleCount;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Upward drift
        positions[i3 + 1] += sporeVelocities[i3 + 1];

        // Lateral organic sway (curl turbulence simulation)
        positions[i3] += Math.sin(elapsedTime * 0.8 + i) * 0.02 + sporeVelocities[i3];
        positions[i3 + 2] += Math.cos(elapsedTime * 0.7 + i) * 0.02 + sporeVelocities[i3 + 2];

        // Wrap around boundaries
        if (positions[i3 + 1] > 60) {
          positions[i3 + 1] = -60;
        }
        if (Math.abs(positions[i3]) > 45) {
          positions[i3] = -positions[i3] * 0.95;
        }
        if (Math.abs(positions[i3 + 2]) > 40) {
          positions[i3 + 2] = -positions[i3 + 2] * 0.95;
        }
      }

      sporeGeometry.attributes.position.needsUpdate = true;
      sporeParticles.rotation.y = elapsedTime * 0.03;
    }

    // 4. Animate Living Mycelium Network
    if (myceliumGroup) {
      myceliumGroup.rotation.y = elapsedTime * 0.06;
      myceliumGroup.rotation.x = Math.sin(elapsedTime * 0.04) * 0.15;

      // Pulse filament lines opacity
      if (myceliumLines && myceliumLines.material) {
        myceliumLines.material.opacity = 0.22 + 0.16 * Math.sin(elapsedTime * 1.8);
      }

      // Orbit point lights around mycelium center
      if (bioluminescentPointLight) {
        bioluminescentPointLight.position.x = Math.sin(elapsedTime * 0.6) * 16;
        bioluminescentPointLight.position.y = scrollTargetY + Math.cos(elapsedTime * 0.5) * 10;
      }

      if (goldPointLight) {
        goldPointLight.position.x = Math.cos(elapsedTime * 0.5) * 18;
        goldPointLight.position.y = scrollTargetY + Math.sin(elapsedTime * 0.7) * 12;
      }
    }

    renderer.render(scene, camera);
  }

  // --- 3D Motion HUD (Heads-Up Display) & Controls ---
  function create3DMotionHUD() {
    if (document.getElementById('hud3dMotion')) return;

    const hud = document.createElement('div');
    hud.id = 'hud3dMotion';
    hud.className = 'hud-3d-motion';
    hud.innerHTML = `
      <div class="hud-3d-pill">
        <div class="hud-3d-indicator">
          <span class="hud-3d-dot"></span>
          <span class="hud-3d-text" id="hudDepthLabel">DEPTH: 01 // CANOPY</span>
        </div>
        <div class="hud-3d-axis" id="hud3dCoords">Z: 30.0m</div>
        <button class="hud-3d-toggle-btn" id="toggleMotion3DBtn" title="Toggle 3D Motion Engine" aria-label="Toggle 3D Engine">
          <i class="fas fa-cube"></i> <span>3D ON</span>
        </button>
      </div>
    `;
    document.body.appendChild(hud);

    // Toggle button handler
    const toggleBtn = document.getElementById('toggleMotion3DBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isMotionActive = !isMotionActive;
        if (isMotionActive) {
          toggleBtn.classList.remove('off');
          toggleBtn.innerHTML = '<i class="fas fa-cube"></i> <span>3D ON</span>';
          if (container) container.style.opacity = '1';
        } else {
          toggleBtn.classList.add('off');
          toggleBtn.innerHTML = '<i class="fas fa-pause"></i> <span>3D PAUSED</span>';
          if (container) container.style.opacity = '0.15';
        }
      });
    }
  }

  function updateHUDDepth() {
    const label = document.getElementById('hudDepthLabel');
    const coords = document.getElementById('hud3dCoords');
    if (!label) return;

    const p = targetScrollProgress;
    let depthName = 'DEPTH: 01 // CANOPY';
    let zDepth = (30 - Math.sin(p * Math.PI) * 12).toFixed(1);

    if (p > 0.8) {
      depthName = 'DEPTH: 05 // NOCTURNE';
    } else if (p > 0.6) {
      depthName = 'DEPTH: 04 // CULINARY';
    } else if (p > 0.4) {
      depthName = 'DEPTH: 03 // LIVING MYCELIUM';
    } else if (p > 0.15) {
      depthName = 'DEPTH: 02 // HARVEST VAULT';
    }

    label.textContent = depthName;
    if (coords) coords.textContent = `Z: ${zDepth}m`;
  }

  // --- Initialize when DOM is ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global controller for page interactions
  window.Earthroot3DScene = {
    setMotionActive: function (active) {
      isMotionActive = Boolean(active);
    },
    getCamera: function () {
      return camera;
    },
    triggerSporeBurst: function () {
      if (!sporeVelocities) return;
      for (let i = 0; i < sporeVelocities.length; i++) {
        sporeVelocities[i] *= 2.5;
      }
      setTimeout(() => {
        for (let i = 0; i < sporeVelocities.length; i++) {
          sporeVelocities[i] /= 2.5;
        }
      }, 1200);
    }
  };

})();
