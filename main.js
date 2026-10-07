/**
 * KRAFT / ROAST — Specialty Coffee Roastery
 * Script: main.js
 * Vanilla JavaScript (ES6+) with zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Navigation & Mobile Drawer
     ========================================================================== */
  const initNavigation = () => {
    const burgerBtn = document.querySelector('.burger-btn');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

    if (!burgerBtn || !mobileDrawer || !mobileOverlay) return;

    const openDrawer = () => {
      burgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('is-active');
      mobileOverlay.classList.add('is-active');
      document.body.classList.add('no-scroll');
    };

    const closeDrawer = () => {
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('is-active');
      mobileOverlay.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    };

    burgerBtn.addEventListener('click', () => {
      const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    mobileOverlay.addEventListener('click', closeDrawer);

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });

    // Close drawer on clicking link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Highlight current page in navigation
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const highlightActive = (links) => {
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const targetPage = href.split('/').pop();
        if (targetPage === currentPath || (currentPath === '' && targetPage === 'index.html')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    };

    highlightActive(desktopLinks);
    highlightActive(mobileLinks);
  };

  /* ==========================================================================
     2. Coffee Catalog Live Filtering (beans.html)
     ========================================================================== */
  const initCatalogFilter = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const beanCards = document.querySelectorAll('.beans-grid .bean-card');
    const countDisplay = document.querySelector('#catalog-count');
    const emptyState = document.querySelector('#catalog-empty');

    if (!filterButtons.length || !beanCards.length) return;

    const updateFilter = (filterKey) => {
      let visibleCount = 0;

      beanCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
        const matches = filterKey === 'all' || categories.includes(filterKey.toLowerCase());

        if (matches) {
          card.classList.remove('is-hidden');
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
          card.style.display = 'none';
        }
      });

      // Update counter
      if (countDisplay) {
        const noun = getUkrainianPluralNoun(visibleCount, 'сорт', 'сорти', 'сортів');
        countDisplay.textContent = `Показано: ${visibleCount} ${noun}`;
      }

      // Show or hide empty state
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.classList.add('is-visible');
        } else {
          emptyState.classList.remove('is-visible');
        }
      }
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const filterKey = btn.getAttribute('data-filter') || 'all';
        updateFilter(filterKey);
      });
    });

    // Initial count
    updateFilter('all');
  };

  // Helper for Ukrainian pluralization
  const getUkrainianPluralNoun = (number, one, few, many) => {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod100 >= 11 && mod100 <= 19) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
  };

  /* ==========================================================================
     3. Interactive Brew Ratio Calculator (brew-guide.html)
     ========================================================================== */
  const initBrewCalculator = () => {
    const deviceRadios = document.querySelectorAll('input[name="brew-device"]');
    const coffeeInput = document.querySelector('#calc-coffee');
    const coffeeSlider = document.querySelector('#calc-coffee-slider');
    const waterInput = document.querySelector('#calc-water');
    const modeCoffeeBtn = document.querySelector('#mode-coffee');
    const modeWaterBtn = document.querySelector('#mode-water');
    const coffeeRow = document.querySelector('#group-coffee');
    const waterRow = document.querySelector('#group-water');

    // Display elements
    const displayWater = document.querySelector('#display-water');
    const displayCoffee = document.querySelector('#display-coffee');
    const displayRatio = document.querySelector('#display-ratio');
    const displayGrind = document.querySelector('#display-grind');
    const displayTemp = document.querySelector('#display-temp');
    const displayTime = document.querySelector('#display-time');
    const displayMethodDesc = document.querySelector('#display-method-desc');

    // Pour schedule items
    const scheduleBloom = document.querySelector('#schedule-bloom');
    const schedulePour1 = document.querySelector('#schedule-pour1');
    const schedulePour2 = document.querySelector('#schedule-pour2');
    const scheduleTitleBloom = document.querySelector('#schedule-title-bloom');
    const scheduleTitlePour1 = document.querySelector('#schedule-title-pour1');
    const scheduleTitlePour2 = document.querySelector('#schedule-title-pour2');

    if (!deviceRadios.length || !coffeeInput || !displayWater) return;

    // Preset configurations for specialty devices
    const devicePresets = {
      v60: {
        name: 'Hario V60',
        ratio: 16.0,
        grind: 'Середній (як морська сіль)',
        temp: '92–94 °C',
        time: '2:45–3:00 хв',
        bloomMult: 3.0,
        desc: 'Ідеально розкриває квіткові та фруктові дескриптори, висока яскравість і прозорість.'
      },
      aeropress: {
        name: 'AeroPress',
        ratio: 12.0,
        grind: 'Середньо-дрібний (Fine-Medium)',
        temp: '86–88 °C',
        time: '1:45–2:00 хв',
        bloomMult: 2.5,
        desc: 'Концентрована чашка з високою солодкістю, оксамитовим тілом та округлою текстурою.'
      },
      chemex: {
        name: 'Chemex',
        ratio: 16.6,
        grind: 'Середньо-крупний (Medium-Coarse)',
        temp: '93–95 °C',
        time: '3:45–4:15 хв',
        bloomMult: 3.0,
        desc: 'Завдяки щільному паперовому фільтру дає максимально чистий, чайний профіль смаку.'
      },
      frenchpress: {
        name: 'French Press',
        ratio: 15.0,
        grind: 'Крупний (Coarse)',
        temp: '94–96 °C',
        time: '4:00–4:30 хв',
        bloomMult: 0, // Immersion
        desc: 'Повне занурення: максимальне тіло напою, глибокі шоколадні та горіхові тони.'
      }
    };

    let activeDevice = 'v60';
    let currentCalculationMode = 'coffee'; // 'coffee' | 'water'

    const getSelectedDevice = () => {
      const checked = document.querySelector('input[name="brew-device"]:checked');
      return checked ? checked.value : 'v60';
    };

    const updateDeviceCardSelection = () => {
      const labels = document.querySelectorAll('.device-radio-label');
      labels.forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        if (input && input.checked) {
          label.classList.add('is-selected');
        } else {
          label.classList.remove('is-selected');
        }
      });
    };

    const calculate = () => {
      activeDevice = getSelectedDevice();
      const preset = devicePresets[activeDevice] || devicePresets.v60;
      const ratio = preset.ratio;

      let coffeeGrams = parseFloat(coffeeInput.value) || 0;
      let waterMl = parseFloat(waterInput.value) || 0;

      if (currentCalculationMode === 'coffee') {
        if (coffeeGrams < 5) coffeeGrams = 5;
        if (coffeeGrams > 100) coffeeGrams = 100;
        waterMl = Math.round(coffeeGrams * ratio);
        waterInput.value = waterMl;
        if (coffeeSlider) coffeeSlider.value = coffeeGrams;
      } else {
        if (waterMl < 80) waterMl = 80;
        if (waterMl > 1500) waterMl = 1500;
        coffeeGrams = Math.round((waterMl / ratio) * 10) / 10;
        coffeeInput.value = coffeeGrams;
        if (coffeeSlider) coffeeSlider.value = coffeeGrams;
      }

      // Update primary display cards
      displayWater.innerHTML = `${Math.round(waterMl)} <small>мл</small>`;
      displayCoffee.innerHTML = `${coffeeGrams} <small>г</small>`;
      displayRatio.textContent = `1 : ${ratio.toFixed(1).replace('.0', '')}`;
      displayGrind.textContent = preset.grind;
      displayTemp.textContent = preset.temp;
      displayTime.textContent = preset.time;
      if (displayMethodDesc) displayMethodDesc.textContent = preset.desc;

      // Update Pouring Schedule
      if (activeDevice === 'frenchpress') {
        if (scheduleTitleBloom) scheduleTitleBloom.textContent = '0:00 — Заливання';
        if (scheduleBloom) scheduleBloom.textContent = `${Math.round(waterMl)} мл води`;
        if (scheduleTitlePour1) scheduleTitlePour1.textContent = '4:00 — Перемішування';
        if (schedulePour1) schedulePour1.textContent = 'Зняти пінку ложкою';
        if (scheduleTitlePour2) scheduleTitlePour2.textContent = '4:30 — Пресування';
        if (schedulePour2) schedulePour2.textContent = 'Опустити плунжер';
      } else if (activeDevice === 'aeropress') {
        const bloom = Math.round(coffeeGrams * 2.5);
        const mainPour = Math.round(waterMl - bloom);
        if (scheduleTitleBloom) scheduleTitleBloom.textContent = '0:00 — Блумінг';
        if (scheduleBloom) scheduleBloom.textContent = `${bloom} мл (30 сек)`;
        if (scheduleTitlePour1) scheduleTitlePour1.textContent = '0:30 — Долив';
        if (schedulePour1) schedulePour1.textContent = `${mainPour} мл (до ${Math.round(waterMl)} мл)`;
        if (scheduleTitlePour2) scheduleTitlePour2.textContent = '1:20 — Продавлювання';
        if (schedulePour2) schedulePour2.textContent = 'Плавно 30–40 сек';
      } else {
        // V60 and Chemex
        const bloom = Math.round(coffeeGrams * 3.0);
        const remaining = waterMl - bloom;
        const pour1 = Math.round(remaining * 0.5);
        const pour2 = Math.round(remaining - pour1);

        if (scheduleTitleBloom) scheduleTitleBloom.textContent = '0:00 — Блумінг';
        if (scheduleBloom) scheduleBloom.textContent = `${bloom} мл (45 сек)`;
        if (scheduleTitlePour1) scheduleTitlePour1.textContent = '0:45 — 1-й пролив';
        if (schedulePour1) schedulePour1.textContent = `+${pour1} мл (до ${bloom + pour1} мл)`;
        if (scheduleTitlePour2) scheduleTitlePour2.textContent = '1:45 — 2-й пролив';
        if (schedulePour2) schedulePour2.textContent = `+${pour2} мл (до ${Math.round(waterMl)} мл)`;
      }
    };

    // Mode Toggle Buttons (By Coffee vs By Water)
    if (modeCoffeeBtn && modeWaterBtn) {
      modeCoffeeBtn.addEventListener('click', () => {
        currentCalculationMode = 'coffee';
        modeCoffeeBtn.classList.add('active');
        modeCoffeeBtn.setAttribute('aria-pressed', 'true');
        modeWaterBtn.classList.remove('active');
        modeWaterBtn.setAttribute('aria-pressed', 'false');
        if (coffeeRow) coffeeRow.style.opacity = '1';
        if (waterRow) waterRow.style.opacity = '0.7';
        calculate();
      });

      modeWaterBtn.addEventListener('click', () => {
        currentCalculationMode = 'water';
        modeWaterBtn.classList.add('active');
        modeWaterBtn.setAttribute('aria-pressed', 'true');
        modeCoffeeBtn.classList.remove('active');
        modeCoffeeBtn.setAttribute('aria-pressed', 'false');
        if (coffeeRow) coffeeRow.style.opacity = '0.7';
        if (waterRow) waterRow.style.opacity = '1';
        calculate();
      });
    }

    // Input events
    coffeeInput.addEventListener('input', () => {
      currentCalculationMode = 'coffee';
      if (modeCoffeeBtn && modeWaterBtn) {
        modeCoffeeBtn.classList.add('active');
        modeCoffeeBtn.setAttribute('aria-pressed', 'true');
        modeWaterBtn.classList.remove('active');
        modeWaterBtn.setAttribute('aria-pressed', 'false');
      }
      calculate();
    });

    if (coffeeSlider) {
      coffeeSlider.addEventListener('input', (e) => {
        coffeeInput.value = e.target.value;
        currentCalculationMode = 'coffee';
        if (modeCoffeeBtn && modeWaterBtn) {
          modeCoffeeBtn.classList.add('active');
          modeCoffeeBtn.setAttribute('aria-pressed', 'true');
          modeWaterBtn.classList.remove('active');
          modeWaterBtn.setAttribute('aria-pressed', 'false');
        }
        calculate();
      });
    }

    waterInput.addEventListener('input', () => {
      currentCalculationMode = 'water';
      if (modeCoffeeBtn && modeWaterBtn) {
        modeWaterBtn.classList.add('active');
        modeWaterBtn.setAttribute('aria-pressed', 'true');
        modeCoffeeBtn.classList.remove('active');
        modeCoffeeBtn.setAttribute('aria-pressed', 'false');
      }
      calculate();
    });

    deviceRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        updateDeviceCardSelection();
        calculate();
      });
    });

    // Initial setup
    updateDeviceCardSelection();
    calculate();
  };

  /* ==========================================================================
     4. Interactive Notification Toast ("Замовити" Feedback)
     ========================================================================== */
  const initOrderFeedback = () => {
    const orderButtons = document.querySelectorAll('.btn-order');

    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const showToast = (message) => {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.innerHTML = `<span class="toast-icon">✓</span><span>${message}</span>`;
      toastContainer.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        toast.classList.add('is-show');
      });

      // Auto-remove
      setTimeout(() => {
        toast.classList.remove('is-show');
        setTimeout(() => {
          if (toastContainer.contains(toast)) {
            toastContainer.removeChild(toast);
          }
        }, 300);
      }, 3200);
    };

    orderButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.bean-card');
        const beanName = card ? (card.querySelector('.bean-name')?.textContent || 'Сорт кави') : 'Сорт кави';
        showToast(`Додано у кошик: ${beanName.trim()}`);
      });
    });
  };

  /* ==========================================================================
     Boot All Modules
     ========================================================================== */
  initNavigation();
  initCatalogFilter();
  initBrewCalculator();
  initOrderFeedback();
});
