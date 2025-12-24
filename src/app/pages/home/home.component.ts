import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

declare const gsap: any;
declare const ScrollTrigger: any;
declare const Typed: any;
declare const THREE: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // THREE.js
  private scene: any = null;
  private camera: any = null;
  private renderer: any = null;

  // pools + resources
  private boxGeometry: any;
  private tapeGeometry: any;
  private labelGeometry: any;
  private barcodeGeometry: any;
  private edgesGeometry: any;

  private boxMaterials: any[] = [];
  private tapeMaterial: any;
  private labelMaterial: any;
  private barcodeMaterial: any;
  private edgesMaterial: any;

  private boxPool: any[] = [];         // pooled (inactive) boxes
  public fallingBoxes: any[] = [];     // active boxes in scene

  private initialPoolSize = 60;        // create once at init (tune)
  private maxActiveBoxes = 40;         // cap active boxes (tune)
  private spawnIntervalId: any = null;

  private animationFrameId: any = null;
  private isAnimating = false;

  // Legacy arrays kept for compatibility
  private boxes: any[] = [];           // older code used this; we'll keep in sync

  // Carousel
  private carouselCards: HTMLElement[] = [];
  private currentIndex = 0;
  private carouselAutoRotate: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // nothing for now
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.initAll(), 200);
     requestAnimationFrame(() => {
    // small safety timeout to allow webfonts/images to settle on slower devices
    setTimeout(() => this.initAll(), 50);
  });
  }
  

  scrollToServices(): void {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  }

  private initAll(): void {
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    this.initHeroAnimations();
    this.initTypedText();
    this.initFloatingBoxes();
    this.initStatsAnimation();

    // THREE init
    this.initFallingBoxes();

    this.initCarousel();
    this.initServicesTrigger();
    this.initSmoothScroll();
    this.initMobileMenu();
    this.initQuoteInteractions();
  }

  private initHeroAnimations(): void {
    if (typeof gsap === 'undefined') return;
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    const heroButtons = document.querySelector('.hero-buttons');

    if (heroTitle) {
      gsap.to(heroTitle, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
    }
    if (heroText) {
      gsap.to(heroText, { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' });
    }
    if (heroButtons) {
      gsap.to(heroButtons, { opacity: 1, y: 0, duration: 1, delay: 1.1, ease: 'power3.out' });
    }
  }

  private initTypedText(): void {
    if (typeof Typed === 'undefined') return;

    const typedTextEl = document.querySelector('#typed-text');
    const typedSubEl = document.querySelector('#typed-subheading');

    if (typedTextEl) {
      new Typed(typedTextEl, {
        strings: [
          'Fulfillment Excellence',
          
          'Logistics Manage all Over US'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }

    if (typedSubEl) {
      new Typed(typedSubEl, {
        strings: [
          'Fewer mistakes, happier customers, guaranteed. We provide an "Amazon Prime" like experience with flexible and agile solutions that let you focus on what matters most.'
        ],
        typeSpeed: 20,
        showCursor: false
      });
    }
  }

  private initFloatingBoxes(): void {
    if (typeof gsap === 'undefined') return;
    const boxes = document.querySelectorAll('.floating-box');
    boxes.forEach((box: any, i: number) => {
      gsap.to(box, {
        y: -50,
        x: i === 0 ? -30 : i === 1 ? 30 : -15,
        rotation: 360,
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  private initStatsAnimation(): void {
    if (typeof gsap === 'undefined') return;
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((el: any) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target,
        duration: 2.5,
        ease: 'power2.out',
        snap: { innerText: target > 100 ? 1 : 0.1 },
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        onUpdate: () => {
          const value = parseFloat(el.innerText);
          el.innerText = target > 100 ? Math.round(value) : value.toFixed(1);
        }
      });
    });
  }

  // ---------------------------
  // THREE.JS: Falling Boxes - Pooling + Controlled Spawn
  // ---------------------------
  private initFallingBoxes(): void {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not available');
      return;
    }

    const container = document.getElementById('canvas-container');
    if (!container) {
      console.warn('canvas-container not found');
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(3, 5, 2);
    this.scene.add(directional);

    // Create shared resources and pool
    this.initBoxResourcesAndPool();

    // Start animation loop (guarded)
    this.startAnimation();

    // Start spawning (rate-limited)
    this.startSpawning();

    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  // create shared geometries/materials and pre-populate pool
  private initBoxResourcesAndPool(): void {
    // Shared geometries
    this.boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    this.tapeGeometry = new THREE.BoxGeometry(0.82, 0.05, 0.05);
    this.labelGeometry = new THREE.PlaneGeometry(0.4, 0.25);
    this.barcodeGeometry = new THREE.PlaneGeometry(0.3, 0.08);
    this.edgesGeometry = new THREE.EdgesGeometry(this.boxGeometry);

    // Shared materials (use Standard for nicer lighting)
    this.boxMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x9b7653 }),
      new THREE.MeshStandardMaterial({ color: 0x7a5c3f }),
      new THREE.MeshStandardMaterial({ color: 0xa68058 }),
      new THREE.MeshStandardMaterial({ color: 0x6b4d32 }),
      new THREE.MeshStandardMaterial({ color: 0x8b6f47 }),
      new THREE.MeshStandardMaterial({ color: 0x7d6341 })
    ];

    this.tapeMaterial = new THREE.MeshStandardMaterial({ color: 0xd4a574 });
    this.labelMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this.barcodeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    this.edgesMaterial = new THREE.LineBasicMaterial({ color: 0x5a4a3a });

    // Pre-populate pool
    for (let i = 0; i < this.initialPoolSize; i++) {
      const box = this._createBoxFromSharedResources();
      box.visible = false;
      this.boxPool.push(box);
    }
  }

  // Create a new box group using shared resources (used for pool and legacy createRealisticBox)
  private _createBoxFromSharedResources(): any {
    const boxGroup = new THREE.Group();

    // box - use shared geometry and shared materials (face material array is supported)
    const box = new THREE.Mesh(this.boxGeometry, this.boxMaterials);
    box.castShadow = true;
    box.receiveShadow = true;
    boxGroup.add(box);

    // tape pieces
    const tape1 = new THREE.Mesh(this.tapeGeometry, this.tapeMaterial);
    tape1.rotation.z = Math.PI / 2;
    tape1.position.y = 0.02;
    tape1.position.z = 0.41;
    boxGroup.add(tape1);

    const tape2 = new THREE.Mesh(this.tapeGeometry, this.tapeMaterial);
    tape2.position.z = -0.41;
    boxGroup.add(tape2);

    // edges (reuse edgesGeometry & material)
    const edges = new THREE.LineSegments(this.edgesGeometry, this.edgesMaterial);
    boxGroup.add(edges);

    // label + barcode
    const label = new THREE.Mesh(this.labelGeometry, this.labelMaterial);
    label.position.z = 0.41;
    boxGroup.add(label);

    const barcode = new THREE.Mesh(this.barcodeGeometry, this.barcodeMaterial);
    barcode.position.z = 0.42;
    barcode.position.y = -0.05;
    boxGroup.add(barcode);

    // default userData
    boxGroup.userData = {
      fallSpeed: Math.random() * 0.01 + 0.002,
      accel: 0.00002,
      rotationSpeedX: (Math.random() - 0.5) * 0.02,
      rotationSpeedY: (Math.random() - 0.5) * 0.02,
      rotationSpeedZ: (Math.random() - 0.5) * 0.01,
      swingSpeed: Math.random() * 0.02 + 0.005,
      swingAmplitude: Math.random() * 0.7,
      swingOffset: Math.random() * Math.PI * 2
    };

    return boxGroup;
  }

  // Legacy name kept for compatibility — returns a fresh box using shared resources
  private createRealisticBox(): any {
    // Return a freshly created group (not popped from pool)
    return this._createBoxFromSharedResources();
  }

  // spawn a single box using pool (preferred)
  private spawnBoxAtRandom(): void {
    // guard limit
    if (this.fallingBoxes.length >= this.maxActiveBoxes) return;

    let box: any | undefined = this.boxPool.pop();

    if (!box) {
      // fallback — create a new one (should be rare)
      box = this._createBoxFromSharedResources();
    }

    // set random transform and userData
    box.visible = true;
    box.position.y = Math.random() * 10 + 10;
    box.position.x = (Math.random() - 0.5) * 20;
    box.position.z = (Math.random() - 0.5) * 20;
    box.rotation.x = Math.random() * Math.PI;
    box.rotation.y = Math.random() * Math.PI;
    box.rotation.z = Math.random() * Math.PI;

    box.userData.fallSpeed = Math.random() * 0.008 + 0.005;
    box.userData.accel = Math.random() * 0.00003 + 0.00001;
    box.userData.rotationSpeedX = (Math.random() - 0.5) * 0.025;
    box.userData.rotationSpeedY = (Math.random() - 0.5) * 0.025;
    box.userData.rotationSpeedZ = (Math.random() - 0.5) * 0.015;
    box.userData.swingSpeed = Math.random() * 0.02 + 0.004;
    box.userData.swingAmplitude = Math.random() * 0.7;
    box.userData.swingOffset = Math.random() * Math.PI * 2;

    // add to scene & active lists
    this.scene.add(box);
    this.fallingBoxes.push(box);

    // keep boxes[] in sync (for legacy code that expects it)
    this.boxes.push(box);
  }

  // Start spawn interval (rate-limited)
  private startSpawning(): void {
    if (this.spawnIntervalId) return;

    // spawn small batches at controlled cadence
    this.spawnIntervalId = setInterval(() => {
      const toSpawn = Math.min(2, this.maxActiveBoxes - this.fallingBoxes.length);
      for (let i = 0; i < toSpawn; i++) this.spawnBoxAtRandom();
    }, 350); // 350 ms between spawn checks (tune as needed)
  }

  private stopSpawning(): void {
    if (this.spawnIntervalId) {
      clearInterval(this.spawnIntervalId);
      this.spawnIntervalId = null;
    }
  }

  // animation loop with recycling
  private animate = (): void => {
    if (!this.isAnimating) return;
    this.animationFrameId = requestAnimationFrame(this.animate);
    const time = Date.now() * 0.001;

    // iterate backwards to allow safe removal
    for (let i = this.fallingBoxes.length - 1; i >= 0; i--) {
      const box = this.fallingBoxes[i];
      const data = box.userData || {};

      box.position.y -= data.fallSpeed;
      // gentle gravity
      data.fallSpeed += data.accel ?? 0.00003;

      box.rotation.x += data.rotationSpeedX ?? 0;
      box.rotation.y += data.rotationSpeedY ?? 0;
      box.rotation.z += data.rotationSpeedZ ?? 0;

      box.position.x += Math.sin(time * (data.swingSpeed ?? 0.01) + (data.swingOffset ?? 0)) * (data.swingAmplitude ?? 0.5) * 0.01;
      box.position.z += Math.cos(time * (data.swingSpeed ?? 0.01) * 0.7 + (data.swingOffset ?? 0)) * 0.005;

      // Recycle when out of view
      if (box.position.y < -10) {
        // remove from scene and return to pool
        try { this.scene.remove(box); } catch (e) { /* ignore */ }

        box.visible = false;
        // reset transforms
        box.position.set(0, 0, 0);
        box.rotation.set(0, 0, 0);

        // keep legacy boxes[] in sync
        const boxesIndex = this.boxes.indexOf(box);
        if (boxesIndex !== -1) this.boxes.splice(boxesIndex, 1);

        // push back to pool
        this.boxPool.push(box);
        this.fallingBoxes.splice(i, 1);
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
  }

  private stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private onWindowResize(container: HTMLElement): void {
    if (!this.camera || !this.renderer) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private initCarousel(): void {
    const cardsNodeList = document.querySelectorAll('.service-card');
    if (!cardsNodeList.length) return;

    const cards = Array.from(cardsNodeList) as HTMLElement[];
    const totalCards = cards.length;
    const indicators = document.getElementById('indicators');
    if (!indicators) return;

    indicators.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => this.goToSlide(i));
      indicators.appendChild(indicator);
    }

    this.carouselCards = cards;
    this.updateCarousel();

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    nextBtn?.addEventListener('click', () => this.nextSlide());
    prevBtn?.addEventListener('click', () => this.prevSlide());

    this.carouselAutoRotate = setInterval(() => this.nextSlide(), 2500);

    const container = document.querySelector('.carousel-container');
    container?.addEventListener('mouseenter', () => {
      if (this.carouselAutoRotate) clearInterval(this.carouselAutoRotate);
    });
    container?.addEventListener('mouseleave', () => {
      this.carouselAutoRotate = setInterval(() => this.nextSlide(), 2500);
    });
  }

  private updateCarousel(): void {
    const cards = this.carouselCards;
    const totalCards = cards.length;
    if (!totalCards) return;

    cards.forEach((card, index) => {
      const diff = index - this.currentIndex;
      const absIndex = ((index - this.currentIndex) + totalCards) % totalCards;

      card.classList.remove('active');

      let translateX = 0;
      let translateZ = -300;
      let rotateY = 0;
      let opacity = 0.3;
      let scale = 0.7;

      if (absIndex === 0) {
        translateX = 0;
        translateZ = 0;
        rotateY = 0;
        opacity = 1;
        scale = 1;
        card.classList.add('active');
      } else if (absIndex === 1) {
        translateX = 450;
        translateZ = -200;
        rotateY = -45;
        opacity = 0.6;
        scale = 0.85;
      } else if (absIndex === totalCards - 1) {
        translateX = -450;
        translateZ = -200;
        rotateY = 45;
        opacity = 0.6;
        scale = 0.85;
      } else {
        translateX = diff > 0 ? 800 : -800;
        translateZ = -400;
        rotateY = diff > 0 ? -60 : 60;
        opacity = 0;
        scale = 0.5;
      }

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = absIndex === 0 ? '10' : String(5 - absIndex);
    });

    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((ind, index) => {
      ind.classList.toggle('active', index === this.currentIndex);
    });
  }

  private nextSlide(): void {
    const count = this.carouselCards.length;
    if (!count) return;
    this.currentIndex = (this.currentIndex + 1) % count;
    this.updateCarousel();
  }

  private prevSlide(): void {
    const count = this.carouselCards.length;
    if (!count) return;
    this.currentIndex = (this.currentIndex - 1 + count) % count;
    this.updateCarousel();
  }

  private goToSlide(index: number): void {
    const count = this.carouselCards.length;
    if (!count) return;
    this.currentIndex = index;
    this.updateCarousel();
  }

  private initServicesTrigger(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;

    ScrollTrigger.create({
    trigger: '.services-preview',
    start: 'top 70%',
    onEnter: () => {
      cards.forEach((c: Element) => c.classList.add('visible'));
      // ensure carousel positions are recalculated when visible
      this.updateCarousel();
    },
    onLeaveBack: () => {
      cards.forEach((c: Element) => c.classList.remove('visible'));
    }
    });
    
  }


  private initSmoothScroll(): void {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e: Event) => {
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  private initMobileMenu(): void {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!menuToggle || !navLinks) return;
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  private initQuoteInteractions(): void {
    const quoteTrigger = document.getElementById('quote-trigger');
    const quotePage = document.getElementById('quote-page');
    const quoteForm = document.getElementById('quoteForm') as HTMLFormElement | null;

    if (quotePage && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to('.quote-page', {
        opacity: 1,
        scrollTrigger: {
          trigger: '.quote-page',
          start: 'top 70%'
        }
      });
    }

    if (quoteTrigger) {
      quoteTrigger.addEventListener('click', (e: Event) => {
        e.preventDefault();
        quotePage?.scrollIntoView({ behavior: 'smooth' });

        if (this.scene && typeof THREE !== 'undefined') {
          // create a small burst - do not use spawn logic for one-off burst,
          // instead create temporary boxes and remove them after timeout
          for (let i = 0; i < 15; i++) {
            const box = this.createRealisticBox();
            box.position.x = (Math.random() - 0.5) * 15;
            box.position.y = 15 + Math.random() * 10;
            box.position.z = (Math.random() - 0.5) * 15;
            box.rotation.x = Math.random() * Math.PI;
            box.rotation.y = Math.random() * Math.PI;
            box.userData.fallSpeed = Math.random() * 0.01 + 0.008;
            box.userData.rotationSpeedX = (Math.random() - 0.5) * 0.015;
            box.userData.rotationSpeedY = (Math.random() - 0.5) * 0.015;
            box.userData.rotationSpeedZ = (Math.random() - 0.5) * 0.012;
            box.userData.swingAmplitude = Math.random() * 0.8 + 0.5;
            box.userData.swingSpeed = Math.random() * 0.03 + 0.02;
            box.userData.swingOffset = Math.random() * Math.PI * 2;

            this.scene.add(box);
            // add to active arrays so animate loop handles them
            this.fallingBoxes.push(box);
            this.boxes.push(box);

            // remove them after 5s (temporary)
            setTimeout(() => {
              try { this.scene.remove(box); } catch (e) {}
              const fbIndex = this.fallingBoxes.indexOf(box);
              if (fbIndex !== -1) this.fallingBoxes.splice(fbIndex, 1);
              const bIndex = this.boxes.indexOf(box);
              if (bIndex !== -1) this.boxes.splice(bIndex, 1);
              // dispose created parts? we used shared resources, so just reuse by pushing to pool
              box.visible = false;
              box.position.set(0, 0, 0);
              box.rotation.set(0, 0, 0);
              this.boxPool.push(box);
            }, 5000);
          }
        }
      });
    }

    if (quoteForm) {
      quoteForm.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        const fullName = (document.getElementById('fullName') as HTMLInputElement | null)?.value || '';
        const email = (document.getElementById('emailAddress') as HTMLInputElement | null)?.value || '';
        const phone = (document.getElementById('phoneNumber') as HTMLInputElement | null)?.value || '';
        const company = (document.getElementById('company') as HTMLInputElement | null)?.value || '';
        const numProducts = (document.getElementById('numProducts') as HTMLInputElement | null)?.value || '';
        const message = (document.getElementById('message') as HTMLTextAreaElement | null)?.value || '';
        console.log('Quote form submitted:', { fullName, email, phone, company, numProducts, message });
        alert('Thank you for your quote request! Our team will contact you within 24 hours.');
        quoteForm.reset();
      });
    }
  }

  private cleanup(): void {
    // stop animation + spawn
    this.stopSpawning();
    this.stopAnimation();

    if (this.carouselAutoRotate) {
      clearInterval(this.carouselAutoRotate);
      this.carouselAutoRotate = null;
    }

    // remove renderer DOM
    if (this.renderer) {
      try {
        if (this.renderer.domElement?.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
      } catch (e) {
        // ignore
      }
    }

    // clear lists from scene
    if (this.scene) {
      // remove active boxes
      this.fallingBoxes.forEach((b: any) => {
        try { this.scene.remove(b); } catch (e) {}
      });
      this.fallingBoxes = [];
      this.boxes = [];

      // remove pooled boxes (they weren't in scene but safe to attempt)
      this.boxPool.forEach((b: any) => {
        try { this.scene.remove(b); } catch (e) {}
      });
      this.boxPool = [];
    }

    // dispose shared geometries & materials
    try {
      if (this.boxGeometry) this.boxGeometry.dispose();
      if (this.tapeGeometry) this.tapeGeometry.dispose();
      if (this.labelGeometry) this.labelGeometry.dispose();
      if (this.barcodeGeometry) this.barcodeGeometry.dispose();
      if (this.edgesGeometry) this.edgesGeometry.dispose();

      this.boxMaterials.forEach(m => { try { m.dispose(); } catch (e) {} });
      if (this.tapeMaterial) try { this.tapeMaterial.dispose(); } catch (e) {}
      if (this.labelMaterial) try { this.labelMaterial.dispose(); } catch (e) {}
      if (this.barcodeMaterial) try { this.barcodeMaterial.dispose(); } catch (e) {}
      if (this.edgesMaterial) try { this.edgesMaterial.dispose(); } catch (e) {}
    } catch (e) {
      // ignore dispose errors
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.isAnimating = false;
    this.animationFrameId = null;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
