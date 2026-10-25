/**
 * Earthroot Mushrooms - 3D Interactive Motion & Physics Engine
 * Handles:
 * - 3D Holographic Card Tilts with Dynamic Light Glare
 * - Multi-Plane Parallax Scroll Physics
 * - 3D Variety Inspector Modal with 360-degree Interactive Rotation
 * - Stereoscopic translateZ Pop-Out Layers
 */

(function () {
  'use strict';

  // --- 1. 3D Card Tilt Engine ---
  function init3DCardTilts() {
    // Select all interactive cards
    const tiltSelectors = [
      '.product-card',
      '.trust-card',
      '.process-card',
      '.recipe-card',
      '.poultry-highlight-card',
      '.pincode-banner',
      '.hero-stats'
    ];

    const cards = document.querySelectorAll(tiltSelectors.join(','));

    cards.forEach(card => {
      // Avoid binding twice
      if (card.dataset.tiltInitialized) return;
      card.dataset.tiltInitialized = 'true';

      // Setup 3D transform container styles
      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '1000px';

      // Create dynamic light glare element
      let glare = card.querySelector('.card-3d-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-3d-glare';
        card.appendChild(glare);
      }

      let rafId = null;
      let bounds = null;

      function onMouseEnter(e) {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const percentX = (mouseX - centerX) / centerX;
        const percentY = (mouseY - centerY) / centerY;

        // Max tilt angles (degrees)
        const maxTilt = 12;
        const rotateX = -percentY * maxTilt;
        const rotateY = percentX * maxTilt;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
          
          // Glare reflection calculation
          if (glare) {
            const glareAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) - 90;
            const glareOpacity = Math.min(0.45, Math.hypot(percentX, percentY) * 0.5);
            glare.style.transform = `rotate(${glareAngle}deg) translate(-50%, -50%)`;
            glare.style.opacity = glareOpacity.toFixed(2);
          }
        });
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transition = 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.65s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        if (glare) {
          glare.style.opacity = '0';
        }
        bounds = null;
      }

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  // --- 2. Multi-Plane 3D Parallax Scroll Engine ---
  function initParallaxScroll() {
    const parallaxElements = document.querySelectorAll('[data-parallax-depth]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const windowH = window.innerHeight;

      parallaxElements.forEach(el => {
        const depth = parseFloat(el.getAttribute('data-parallax-depth')) || 0.15;
        const rect = el.getBoundingClientRect();

        // Only compute if within or near viewport
        if (rect.top < windowH + 100 && rect.bottom > -100) {
          const relativeY = (rect.top - windowH / 2) * depth;
          el.style.transform = `translate3d(0, ${relativeY.toFixed(1)}px, 0)`;
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // --- 3. Interactive 3D Variety Inspector Modal ---
  const VARIETY_3D_DATA = {
    'oyster-fresh': {
      title: 'Pearl & Grey Oyster Mushroom',
      scientific: 'Pleurotus ostreatus',
      modelColor: 0x9fa8a3,
      gillsColor: 0xd4a342,
      harvestCycle: 'Daily (Every 24h at 6:00 AM)',
      optimalTemp: '22°C - 26°C with 85% RH',
      bioactives: ['Ergothioneine', 'Beta-glucans', 'Pleuran'],
      culinaryNote: 'Velvety tender caps crisp up wonderfully when pan-seared with garlic and shallots.',
      image: 'assets/oyster.jpg',
      price: '₹180 / 250g'
    },
    'milky-fresh': {
      title: 'Kerala Milky Mushroom',
      scientific: 'Calocybe indica',
      modelColor: 0xf4eee4,
      gillsColor: 0x10b981,
      harvestCycle: 'Daily (Morning & Evening Flush)',
      optimalTemp: '28°C - 34°C (Tropical native)',
      bioactives: ['Polysaccharides', 'Dietary Fibre', 'Antioxidants'],
      culinaryNote: 'Firm meaty texture that holds its form beautifully in spicy Kerala roasts and coconut milk gravy.',
      image: 'assets/milky.jpg',
      price: '₹220 / 250g'
    },
    'button-white': {
      title: 'Fresh White Button Mushroom',
      scientific: 'Agaricus bisporus',
      modelColor: 0xffffff,
      gillsColor: 0xc4b59d,
      harvestCycle: 'Daily (Climate Controlled Vault)',
      optimalTemp: '16°C - 19°C (Precision Chilled)',
      bioactives: ['Selenium', 'Ergosterol (Vitamin D)', 'Copper'],
      culinaryNote: 'Plump and earthy, the king of quick stir fries, morning omelettes, and rich creamy soups.',
      image: 'assets/button.jpg',
      price: '₹150 / 250g'
    },
    'lions-mane': {
      title: "Organic Lion's Mane",
      scientific: 'Hericium erinaceus',
      modelColor: 0xfcf8ee,
      gillsColor: 0x34d399,
      harvestCycle: 'Special Harvest Flush',
      optimalTemp: '18°C - 22°C with high humidity',
      bioactives: ['Hericenones', 'Erinacines', 'Nerve Growth Factors (NGF)'],
      culinaryNote: 'Prized cognitive superfood with a lobster-like sweet tenderness when seared in grass-fed butter.',
      image: 'assets/lions_mane.jpg',
      price: '₹450 / 200g'
    },
    'oyster-bulk': {
      title: 'Wholesale Commercial Oyster Crate',
      scientific: 'Pleurotus ostreatus (Commercial Grade)',
      modelColor: 0x8a9992,
      gillsColor: 0xd4a342,
      harvestCycle: 'Pre-ordered 5kg Commercial Crates',
      optimalTemp: 'Cold Chain Maintained 4°C - 8°C',
      bioactives: ['Bulk Protein', 'Commercial Freshness Guarantee'],
      culinaryNote: 'Supplying top-tier resort kitchens, hotel banquet facilities, and organic stores across Kerala.',
      image: 'assets/oyster.jpg',
      price: '₹2800 / 5kg crate'
    },
    'grow-kit': {
      title: 'Living Mycelium DIY Grow Kit',
      scientific: 'Colonized Organic Hardwood Substrate',
      modelColor: 0xb58957,
      gillsColor: 0x10b981,
      harvestCycle: 'First flush within 10-14 days',
      optimalTemp: 'Room ambient temperature with water misting',
      bioactives: ['Guaranteed Fresh Harvest at Home'],
      culinaryNote: 'Experience the magic of picking gourmet mushrooms directly from your kitchen counter.',
      image: 'assets/hero.jpg',
      price: '₹599 / Complete Kit'
    }
  };

  let modalScene, modalCamera, modalRenderer, modalMeshGroup;
  let isModalRendering = false;
  let modalRafId = null;
  let isDraggingModal = false;
  let previousMousePosition = { x: 0, y: 0 };

  function setup3DInspectorModal() {
    // Check if modal already exists
    if (document.getElementById('variety3DModal')) return;

    const modal = document.createElement('div');
    modal.id = 'variety3DModal';
    modal.className = 'variety-3d-modal';
    modal.innerHTML = `
      <div class="variety-3d-backdrop" id="modal3DBackdrop"></div>
      <div class="variety-3d-dialog">
        <button class="variety-3d-close-btn" id="modal3DCloseBtn" aria-label="Close 3D View">
          <i class="fas fa-times"></i>
        </button>
        <div class="variety-3d-grid">
          <!-- 3D Interactive Canvas Column -->
          <div class="variety-3d-canvas-col">
            <div class="canvas-3d-badge"><i class="fas fa-cube"></i> Interactive 3D Model • Drag to Rotate</div>
            <div id="inspector3DCanvasWrap" class="inspector-canvas-wrap"></div>
            <div class="canvas-3d-hint">
              <span><i class="fas fa-hand-pointer"></i> Rotate 360°</span>
              <span id="variety3DPriceTag" class="model-price-tag">₹180 / 250g</span>
            </div>
          </div>
          <!-- Details & Bioactive Profile Column -->
          <div class="variety-3d-info-col">
            <span class="info-tag-scientific" id="variety3DScientific">Pleurotus ostreatus</span>
            <h3 class="info-title" id="variety3DTitle">Pearl & Grey Oyster Mushroom</h3>
            <p class="info-desc" id="variety3DDesc"></p>

            <div class="spec-grid-3d">
              <div class="spec-card-3d">
                <span class="spec-label-3d"><i class="fas fa-clock"></i> Harvest Cycle</span>
                <span class="spec-value-3d" id="variety3DHarvest">Daily 6:00 AM</span>
              </div>
              <div class="spec-card-3d">
                <span class="spec-label-3d"><i class="fas fa-temperature-low"></i> Optimal Climate</span>
                <span class="spec-value-3d" id="variety3DTemp">22°C - 26°C</span>
              </div>
            </div>

            <div class="bioactive-box-3d">
              <h4><i class="fas fa-seedling"></i> Key Bioactive Nutrients</h4>
              <div class="bioactive-pills" id="variety3DBioactives"></div>
            </div>

            <div class="modal-cta-row">
              <a href="#" id="modalOrderBtn" target="_blank" class="btn btn-whatsapp btn-block">
                <i class="fab fa-whatsapp"></i> Order This Fresh Flush via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners for close
    document.getElementById('modal3DCloseBtn').addEventListener('click', close3DModal);
    document.getElementById('modal3DBackdrop').addEventListener('click', close3DModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close3DModal();
    });
  }

  function initModalThreeJS(container) {
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 420;

    modalScene = new THREE.Scene();
    modalCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    modalCamera.position.set(0, 2, 16);

    modalRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    modalRenderer.setSize(width, height);
    modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    modalRenderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(modalRenderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.4);
    modalScene.add(amb);

    const dir1 = new THREE.DirectionalLight(0xd4a342, 2.0);
    dir1.position.set(10, 15, 10);
    modalScene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x10b981, 1.5);
    dir2.position.set(-10, -5, 10);
    modalScene.add(dir2);

    // Drag to rotate handlers on the canvas
    const dom = modalRenderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      isDraggingModal = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDraggingModal = false;
    });

    dom.addEventListener('mousemove', (e) => {
      if (!isDraggingModal || !modalMeshGroup) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modalMeshGroup.rotation.y += deltaX * 0.015;
      modalMeshGroup.rotation.x += deltaY * 0.015;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDraggingModal = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    dom.addEventListener('touchmove', (e) => {
      if (!isDraggingModal || !modalMeshGroup || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      modalMeshGroup.rotation.y += deltaX * 0.015;
      modalMeshGroup.rotation.x += deltaY * 0.015;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDraggingModal = false;
    });
  }

  function renderModalLoop() {
    if (!isModalRendering) return;

    if (modalMeshGroup && !isDraggingModal) {
      modalMeshGroup.rotation.y += 0.01;
    }

    if (modalRenderer && modalScene && modalCamera) {
      modalRenderer.render(modalScene, modalCamera);
    }

    modalRafId = requestAnimationFrame(renderModalLoop);
  }

  function open3DModal(productId) {
    setup3DInspectorModal();

    const data = VARIETY_3D_DATA[productId] || VARIETY_3D_DATA['oyster-fresh'];
    const modal = document.getElementById('variety3DModal');
    const container = document.getElementById('inspector3DCanvasWrap');

    if (!modal || !container) return;

    // Populate data
    document.getElementById('variety3DTitle').textContent = data.title;
    document.getElementById('variety3DScientific').textContent = data.scientific;
    document.getElementById('variety3DDesc').textContent = data.culinaryNote;
    document.getElementById('variety3DHarvest').textContent = data.harvestCycle;
    document.getElementById('variety3DTemp').textContent = data.optimalTemp;
    document.getElementById('variety3DPriceTag').textContent = data.price;

    const bioContainer = document.getElementById('variety3DBioactives');
    bioContainer.innerHTML = '';
    data.bioactives.forEach(bio => {
      const span = document.createElement('span');
      span.className = 'bioactive-pill';
      span.innerHTML = `<i class="fas fa-check-circle"></i> ${bio}`;
      bioContainer.appendChild(span);
    });

    const orderBtn = document.getElementById('modalOrderBtn');
    orderBtn.href = `https://wa.me/919048622044?text=${encodeURIComponent(`Hi Earthroot Mushrooms! I would like to order fresh ${data.title} (${data.price}). Please share harvest availability!`)}`;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Init 3D renderer if needed
    if (!modalRenderer) {
      initModalThreeJS(container);
    }

    // Build unique 3D mushroom geometry for this variety
    if (modalScene) {
      if (modalMeshGroup) {
        modalScene.remove(modalMeshGroup);
      }

      modalMeshGroup = new THREE.Group();

      // Cap
      const capPoints = [
        new THREE.Vector2(0, 2.5),
        new THREE.Vector2(0.6, 2.45),
        new THREE.Vector2(1.5, 2.2),
        new THREE.Vector2(2.5, 1.6),
        new THREE.Vector2(3.2, 0.8),
        new THREE.Vector2(3.0, 0.4),
        new THREE.Vector2(1.0, 0.5)
      ];
      const capGeo = new THREE.LatheGeometry(capPoints, 32);
      const capMat = new THREE.MeshStandardMaterial({
        color: data.modelColor,
        roughness: 0.35,
        metalness: 0.15
      });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      modalMeshGroup.add(capMesh);

      // Gills
      const gillGeo = new THREE.RingGeometry(0.8, 3.0, 32, 6);
      gillGeo.rotateX(-Math.PI / 2);
      gillGeo.translate(0, 0.45, 0);
      const gillMat = new THREE.MeshStandardMaterial({
        color: data.gillsColor,
        wireframe: true
      });
      const gillMesh = new THREE.Mesh(gillGeo, gillMat);
      modalMeshGroup.add(gillMesh);

      // Stalk
      const stemPoints = [
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(0.2, -1.5, 0),
        new THREE.Vector3(-0.1, -3.5, 0),
        new THREE.Vector3(0, -5.0, 0)
      ];
      const stemCurve = new THREE.CatmullRomCurve3(stemPoints);
      const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.65, 16, false);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0xf5eedb,
        roughness: 0.5
      });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      modalMeshGroup.add(stemMesh);

      // Halo ring
      const ringGeo = new THREE.TorusGeometry(3.8, 0.03, 16, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: data.gillsColor,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      modalMeshGroup.add(ring);

      modalMeshGroup.position.set(0, 0.5, 0);
      modalScene.add(modalMeshGroup);
    }

    isModalRendering = true;
    renderModalLoop();
  }

  function close3DModal() {
    const modal = document.getElementById('variety3DModal');
    if (modal) {
      modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    isModalRendering = false;
    if (modalRafId) {
      cancelAnimationFrame(modalRafId);
      modalRafId = null;
    }
  }

  // --- Attach Quick 3D View Buttons to Catalog Cards ---
  function attach3DViewTriggers() {
    // Whenever products are rendered by app.js, ensure 3D inspect buttons and tilt listeners are active
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    // Observe changes to catalogGrid
    const observer = new MutationObserver(() => {
      init3DCardTilts();
      bindInspectorButtons();
    });

    observer.observe(grid, { childList: true });
    init3DCardTilts();
    bindInspectorButtons();
  }

  function bindInspectorButtons() {
    document.querySelectorAll('.btn-inspect-3d').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-product-id');
        open3DModal(id);
      });
    });
  }

  // --- Initialize when DOM is loaded ---
  function init() {
    init3DCardTilts();
    initParallaxScroll();
    attach3DViewTriggers();

    // Expose open3DModal for any external caller
    window.Earthroot3DModal = {
      open: open3DModal,
      close: close3DModal
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
