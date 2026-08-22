/* ==========================================================================
   Earthroot Mushrooms - Interactive Logic, Scroll Animation Engine & WhatsApp
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Data & State ---
  const initialProducts = [
    {
      id: 'oyster-fresh',
      name: 'Pearl & Grey Oyster Mushrooms',
      category: 'gourmet',
      badge: 'Farm Favorite',
      image: 'assets/oyster.jpg',
      desc: 'Tender, velvety texture with a mild earthy flavor. Rich in protein, fiber and antioxidants. Harvested daily in Kozhikode.',
      pills: ['Rich in B Vitamins', 'Low Calorie', '100% Organic'],
      price: 180,
      unit: 'per 250g pack',
      stock: 20,
      inStock: true
    },
    {
      id: 'milky-fresh',
      name: 'Kerala Milky Mushrooms',
      category: 'gourmet',
      badge: 'High Protein',
      image: 'assets/milky.jpg',
      desc: 'Thick, fleshy gourmet mushrooms with exceptional shelf-life and succulent bite. Ideal for coconut curries & spicy roasts.',
      pills: ['High Fibre', 'Immunity Boost', 'Fresh Harvest'],
      price: 220,
      unit: 'per 250g pack',
      stock: 15,
      inStock: true
    },
    {
      id: 'button-white',
      name: 'Fresh White Button Mushrooms',
      category: 'gourmet',
      badge: 'Classic Choice',
      image: 'assets/button.jpg',
      desc: 'Plump, firm white buttons cultivated under controlled climate conditions. Perfect for daily stir-fries, soups, and pizza toppings.',
      pills: ['Selenium Rich', 'Versatile Cooking', 'Zero Pesticides'],
      price: 150,
      unit: 'per 250g pack',
      stock: 25,
      inStock: true
    },
    {
      id: 'lions-mane',
      name: "Organic Lion's Mane",
      category: 'medicinal',
      badge: 'Brain & Nootropic',
      image: 'assets/lions_mane.jpg',
      desc: 'Premium culinary superfood known for cognitive clarity, memory support, and seafood-like delicate flavor.',
      pills: ['Brain Health', 'Focus & Energy', 'Superfood'],
      price: 450,
      unit: 'per 200g pack',
      stock: 10,
      inStock: true
    },
    {
      id: 'oyster-bulk',
      name: 'Wholesale Oyster Bulk Crate',
      category: 'bulk',
      badge: 'Restaurant Grade',
      image: 'assets/oyster.jpg',
      desc: 'Daily harvested commercial quantity for hotels, caterers, and supermarkets across Kerala.',
      pills: ['5kg Bulk Pack', 'Direct Wholesale', 'Cold Chain Delivery'],
      price: 2800,
      unit: 'per 5kg crate',
      stock: 5,
      inStock: true
    },
    {
      id: 'grow-kit',
      name: 'Mycelium DIY Mushroom Grow Kit',
      category: 'kits',
      badge: 'Fun & Educational',
      image: 'assets/hero.jpg',
      desc: 'Grow your own fresh oyster mushrooms at home on your kitchen counter! Guaranteed fruiting within 10-14 days.',
      pills: ['Beginner Friendly', 'Includes Sprayer', 'Guaranteed Crop'],
      price: 599,
      unit: 'per complete kit',
      stock: 12,
      inStock: true
    }
  ];

  let currentFilter = 'all';
  let revealObserver = null;

  // DOM Elements
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const catalogGrid = document.getElementById('catalogGrid');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const cartIconBtn = document.getElementById('cartIconBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
  const pincodeForm = document.getElementById('pincodeForm');
  const pincodeInput = document.getElementById('pincodeInput');
  const pincodeResult = document.getElementById('pincodeResult');
  const faqItems = document.querySelectorAll('.faq-item');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const mainHeader = document.getElementById('mainHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressRingFill = document.getElementById('progressRingFill');
  const ringCircumference = 2 * Math.PI * 22; // ~138.23px

  // --- Helper Functions ---
  function loadProductsWithStock() {
    try {
      const saved = localStorage.getItem('earthroot_inventory_stock');
      if (saved) {
        const stockMap = JSON.parse(saved);
        return initialProducts.map(p => {
          if (stockMap[p.id] !== undefined) {
            return {
              ...p,
              stock: Number(stockMap[p.id].stock ?? 0),
              inStock: Boolean(stockMap[p.id].inStock && Number(stockMap[p.id].stock) > 0)
            };
          }
          return p;
        });
      }
    } catch (err) {
      console.warn('Error reading stock from storage:', err);
    }
    return initialProducts;
  }

  let products = loadProductsWithStock();

  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('earthroot_harvest_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            const freshProduct = products.find(p => p.id === item.id);
            if (!freshProduct || !freshProduct.inStock || freshProduct.stock <= 0) {
              return null;
            }
            return {
              ...freshProduct,
              qty: Math.min(Number(item.qty) || 1, freshProduct.stock)
            };
          }).filter(Boolean);
        }
      }
    } catch (err) {
      console.warn('Error reading cart from storage:', err);
    }
    return [];
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem('earthroot_harvest_cart', JSON.stringify(cart));
    } catch (err) {
      console.warn('Error saving cart to storage:', err);
    }
  }

  let cart = loadCartFromStorage();

  function saveStockToStorage() {
    const stockMap = {};
    products.forEach(p => {
      stockMap[p.id] = {
        stock: p.stock,
        inStock: p.inStock && p.stock > 0
      };
    });
    localStorage.setItem('earthroot_inventory_stock', JSON.stringify(stockMap));
  }

  function showToast(text) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: #0f271d;
        color: #f7e8c4;
        padding: 0.8rem 1.8rem;
        border-radius: 9999px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        font-weight: 600;
        font-size: 0.9rem;
        border: 1px solid #d4a342;
        transition: all 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = '1';
    
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2800);
  }

  // --- Mobile Nav ---
  function closeMobileNav() {
    if (navMenu) navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (mobileToggle) {
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // --- Cart System ---
  function toggleCart(open = true) {
    if (!cartDrawer || !cartOverlay) return;
    if (open) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    } else {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  }

  if (cartIconBtn) cartIconBtn.addEventListener('click', () => toggleCart(true));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!product.inStock || product.stock <= 0) {
      showToast(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      if (existing.qty >= product.stock) {
        showToast(`Only ${product.stock} pack(s) available in stock for ${product.name}!`);
        return;
      }
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    toggleCart(true);
    showToast(`Added ${product.name} to your harvest order!`);
  }

  function updateCartUI() {
    saveCartToStorage();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) cartBadge.textContent = totalItems;
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `<div class="cart-empty-msg"><i class="fas fa-shopping-basket fa-2x mb-2" style="color:#ca6536"></i><p>Your basket is currently empty.<br>Explore our fresh varieties above!</p></div>`;
      if (cartTotalAmount) cartTotalAmount.textContent = '₹0';
      return;
    }

    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} x ${item.qty} = ₹${itemTotal}</div>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
      `;
      cartItemsList.appendChild(div);
    });

    if (cartTotalAmount) cartTotalAmount.textContent = `₹${total}`;

    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          if (item.qty > 1) {
            item.qty -= 1;
          } else {
            cart = cart.filter(i => i.id !== id);
          }
          updateCartUI();
        }
      });
    });

    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        const product = products.find(p => p.id === id);
        if (item && product) {
          if (item.qty < product.stock) {
            item.qty += 1;
            updateCartUI();
          } else {
            showToast(`Maximum harvest stock reached (${product.stock} packs available).`);
          }
        }
      });
    });
  }

  // --- WhatsApp Order ---
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Please add at least one item to your order before checkout.');
        return;
      }

      let message = `🌱 *NEW ORDER - EARTHROOT MUSHROOMS* 🌱\n\n`;
      let total = 0;

      cart.forEach((item, index) => {
        const linePrice = item.price * item.qty;
        total += linePrice;
        message += `${index + 1}. *${item.name}*\n   Qty: ${item.qty} pack(s) | ₹${linePrice}\n`;

        const product = products.find(p => p.id === item.id);
        if (product) {
          product.stock = Math.max(0, (product.stock || 0) - item.qty);
          if (product.stock === 0) {
            product.inStock = false;
          }
        }
      });

      message += `\n💵 *Total Estimated Value:* ₹${total}\n`;
      message += `\n📍 *Delivery Request:* Fresh Harvest Delivery Kerala\n`;
      message += `\nPlease confirm item availability and dispatch time. Thank you!`;

      saveStockToStorage();
      renderProducts();

      cart = [];
      updateCartUI();
      toggleCart(false);
      showToast('Order sent to WhatsApp! Harvest stock updated.');

      const encodedUrl = `https://wa.me/919048622044?text=${encodeURIComponent(message)}`;
      window.open(encodedUrl, '_blank');
    });
  }

  // --- Scroll Reveal Engine ---
  function observeScrollReveals() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
      return;
    }

    if (revealObserver) {
      revealObserver.disconnect();
    }

    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // --- 3D Card Tilt ---
  function attachCardTiltEffect() {
    const cards = document.querySelectorAll('.product-card, .recipe-card, .heritage-image-frame');
    cards.forEach(card => {
      card.onmousemove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      };

      card.onmouseleave = () => {
        card.style.transform = '';
      };
    });
  }

  // --- Product Catalog Renderer ---
  function renderProducts(filter = currentFilter) {
    currentFilter = filter;
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);

    filtered.forEach((product, index) => {
      const isAvailable = product.inStock && product.stock > 0;
      const card = document.createElement('div');
      card.className = `product-card ${!isAvailable ? 'out-of-stock' : ''}`;
      card.setAttribute('data-reveal', 'fade-up');
      card.setAttribute('data-delay', `${(index % 3 + 1) * 100}`);
      
      card.innerHTML = `
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <span class="product-badge">${product.badge}</span>
          ${!isAvailable ? '<span class="out-of-stock-overlay"><i class="fas fa-ban"></i> Out of Stock</span>' : ''}
        </div>
        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-nutrition-pills">
            ${product.pills.map(pill => `<span class="nutri-pill">${pill}</span>`).join('')}
          </div>
          
          <div class="stock-status-pill ${isAvailable ? 'in-stock' : 'out-of-stock'}">
            <i class="fas ${isAvailable ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            ${isAvailable ? `In Stock (${product.stock} available)` : 'Harvest Sold Out'}
          </div>

          <div class="product-footer">
            <div class="price-tag">
              <span class="price-amount">₹${product.price}</span>
              <span class="price-unit">${product.unit}</span>
            </div>
            ${isAvailable ? `
              <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Add to Order
              </button>
            ` : `
              <button class="btn btn-disabled btn-sm" disabled data-id="${product.id}">
                <i class="fas fa-times-circle"></i> Out of Stock
              </button>
            `}
          </div>
        </div>
      `;
      catalogGrid.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        addToCart(id);
      });
    });

    observeScrollReveals();
    attachCardTiltEffect();
  }

  // Filter tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProducts(filter);
    });
  });

  // --- Pincode Eligibility ---
  const eligiblePincodes = {
    '673602': 'Kodenchery & Nearby Areas',
    '673604': 'Thiruvambady & Pullurampara Farm Area',
    '673580': 'Adivaram & Nearby Foothills Area'
  };

  if (pincodeForm && pincodeInput && pincodeResult) {
    pincodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = pincodeInput.value.trim();
      
      if (eligiblePincodes[code]) {
        pincodeResult.className = 'pincode-result success';
        pincodeResult.innerHTML = `<i class="fas fa-check-circle"></i> Great news! Daily Fresh Delivery is <strong>Available</strong> for Pincode <strong>${code}</strong> (${eligiblePincodes[code]}).`;
      } else if (/^\d{6}$/.test(code)) {
        pincodeResult.className = 'pincode-result error';
        pincodeResult.innerHTML = `<i class="fas fa-times-circle"></i> Delivery is <strong>Not Available</strong> for Pincode <strong>${code}</strong>. Direct daily delivery is currently exclusive to <strong>673602, 673604, and 673580</strong>. For bulk orders outside these areas, please contact us on WhatsApp.`;
      } else {
        pincodeResult.className = 'pincode-result error';
        pincodeResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please enter a valid 6-digit PIN code (e.g. 673602).`;
      }
    });
  }

  // --- FAQ Accordion ---
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Scroll Progress, Sticky Header & Back to Top ---
  function handleScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (mainHeader) {
      mainHeader.classList.toggle('scrolled', scrollTop > 40);
    }

    if (scrollTopBtn && progressRingFill) {
      scrollTopBtn.classList.toggle('visible', scrollTop > 300);
      const offset = ringCircumference - (scrollPercent / 100) * ringCircumference;
      progressRingFill.style.strokeDashoffset = Math.max(0, offset);
    }
  }

  window.addEventListener('scroll', handleScrollProgress, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Scroll Spy ---
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScrollSpy() {
    const scrollPos = (window.scrollY || document.documentElement.scrollTop) + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active-nav');
          } else {
            link.classList.remove('active-nav');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  // --- Number Counters on Scroll ---
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    let countersDone = false;

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersDone) {
          countersDone = true;
          counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1800; // ms
            const startTime = performance.now();

            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeOut * target);

              if (target >= 1000) {
                counter.textContent = `${currentVal.toLocaleString()}${suffix}`;
              } else {
                counter.textContent = `${currentVal}${suffix}`;
              }

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                if (target >= 1000) {
                  counter.textContent = `${target.toLocaleString()}${suffix}`;
                } else {
                  counter.textContent = `${target}${suffix}`;
                }
              }
            }

            requestAnimationFrame(updateCount);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const statsWrap = document.querySelector('.hero-stats');
    if (statsWrap) {
      counterObserver.observe(statsWrap);
    }
  }

  // --- Process Timeline Glow on Scroll ---
  function initProcessTimeline() {
    const stepCards = document.querySelectorAll('.process-card[data-step]');
    if (!stepCards.length) return;

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-step');
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -40px 0px'
    });

    stepCards.forEach(card => stepObserver.observe(card));
  }

  // --- Ambient Spore Particles in Hero ---
  function createSporeParticles() {
    const sporeContainer = document.getElementById('sporeParticles');
    if (!sporeContainer) return;
    sporeContainer.innerHTML = '';

    const sporeCount = 20;
    for (let i = 0; i < sporeCount; i++) {
      const spore = document.createElement('div');
      spore.className = 'spore';
      
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const top = Math.random() * 80 + 20;
      const delay = Math.random() * 8;
      const duration = Math.random() * 8 + 8;

      spore.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        animation-delay: -${delay}s;
        animation-duration: ${duration}s;
      `;
      sporeContainer.appendChild(spore);
    }
  }

  // --- Smooth Anchored Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Real-time Inventory Sync from Admin ---
  window.addEventListener('storage', (e) => {
    if (e.key === 'earthroot_inventory_stock') {
      products = loadProductsWithStock();
      renderProducts(currentFilter);
      cart = loadCartFromStorage();
      updateCartUI();
    }
    if (e.key === 'earthroot_harvest_cart') {
      cart = loadCartFromStorage();
      updateCartUI();
    }
  });

  // --- Initialize All Components ---
  renderProducts('all');
  updateCartUI();
  observeScrollReveals();
  initCounters();
  initProcessTimeline();
  createSporeParticles();
  handleScrollProgress();
  handleScrollSpy();
});
