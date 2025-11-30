// home.component.ts
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
  private boxes: any[] = [];
  private fallingBoxes: any[] = [];
  private animationFrameId: any = null;
  private isAnimating = false;

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
    // small timeout to ensure DOM is ready and third-party scripts loaded
    setTimeout(() => this.initAll(), 200);
  }

  // Scroll helper for CTA button
  scrollToServices(): void {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  }

  // MASTER INIT
  private initAll(): void {
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    this.initHeroAnimations();
    this.initTypedText();
    this.initFloatingBoxes();
    this.initStatsAnimation();

    // THREE canvas
    this.initFallingBoxes();

    // Carousel setup (uses your exact JS logic)
    this.initCarousel();

    // Services cards animation trigger (fires updateCarousel on enter)
    this.initServicesTrigger();

    // Smooth anchors + mobile menu + quote interactions
    this.initSmoothScroll();
    this.initMobileMenu();
    this.initQuoteInteractions();
  }

  // HERO FADE-INS
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

  // TYPED.JS
  private initTypedText(): void {
    if (typeof Typed === 'undefined') return;

    const typedTextEl = document.querySelector('#typed-text');
    const typedSubEl = document.querySelector('#typed-subheading');

    if (typedTextEl) {
      new Typed(typedTextEl, {
        strings: [
          'Fulfillment Excellence',
          'Reliable Warehouse Solutions',
          'Amazon Prime-Like Experience',
          'Growing Your Business'
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

  // FLOATING NEON BOXES (GSAP)
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

  // STATS COUNTER
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
  // THREE.JS: Falling Boxes
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

    // realistic boxes (25)
    for (let i = 0; i < 25; i++) {
      const group = this.createRealisticBox();
      group.position.x = (Math.random() - 0.5) * 20;
      group.position.y = Math.random() * 30 + 10;
      group.position.z = (Math.random() - 0.5) * 20;
      group.rotation.x = Math.random() * Math.PI;
      group.rotation.y = Math.random() * Math.PI;
      group.rotation.z = Math.random() * Math.PI;

      group.userData.fallSpeed = Math.random() * 0.008 + 0.005;
      group.userData.rotationSpeedX = (Math.random() - 0.5) * 0.01;
      group.userData.rotationSpeedY = (Math.random() - 0.5) * 0.01;
      group.userData.rotationSpeedZ = (Math.random() - 0.5) * 0.008;
      group.userData.swingAmplitude = Math.random() * 0.5 + 0.3;
      group.userData.swingSpeed = Math.random() * 0.02 + 0.01;
      group.userData.swingOffset = Math.random() * Math.PI * 2;

      this.scene.add(group);
      this.boxes.push(group);
      this.fallingBoxes.push(group);
    }

    // a few wireframe medium boxes
    const mediumGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    for (let i = 0; i < 2; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d4ff : 0xff00ff,
        wireframe: true
      });
      const box = new THREE.Mesh(mediumGeometry, material);
      box.position.x = (Math.random() - 0.5) * 20;
      box.position.y = (Math.random() - 0.5) * 20;
      box.position.z = (Math.random() - 0.5) * 20;
      box.rotation.x = Math.random() * Math.PI;
      box.rotation.y = Math.random() * Math.PI;
      this.scene.add(box);
      this.boxes.push(box);
    }

    // small wireframe packages
    const smallGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    for (let i = 0; i < 15; i++) {
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
      const smallBox = new THREE.Mesh(smallGeometry, material);
      smallBox.position.x = (Math.random() - 0.5) * 20;
      smallBox.position.y = (Math.random() - 0.5) * 20;
      smallBox.position.z = (Math.random() - 0.5) * 20;
      smallBox.rotation.x = Math.random() * Math.PI;
      smallBox.rotation.y = Math.random() * Math.PI;
      this.scene.add(smallBox);
      this.boxes.push(smallBox);
    }

    this.isAnimating = true;
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private createRealisticBox(): any {
    const boxGroup = new THREE.Group();
    const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x9b7653 }),
      new THREE.MeshBasicMaterial({ color: 0x7a5c3f }),
      new THREE.MeshBasicMaterial({ color: 0xa68058 }),
      new THREE.MeshBasicMaterial({ color: 0x6b4d32 }),
      new THREE.MeshBasicMaterial({ color: 0x8b6f47 }),
      new THREE.MeshBasicMaterial({ color: 0x7d6341 })
    ];
    const box = new THREE.Mesh(boxGeometry, materials);
    boxGroup.add(box);

    const tapeGeometry = new THREE.BoxGeometry(0.82, 0.05, 0.05);
    const tapeMaterial = new THREE.MeshBasicMaterial({ color: 0xd4a574 });
    const tape1 = new THREE.Mesh(tapeGeometry, tapeMaterial);
    tape1.rotation.z = Math.PI / 2;
    boxGroup.add(tape1);
    const tape2 = new THREE.Mesh(tapeGeometry, tapeMaterial);
    boxGroup.add(tape2);

    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x5a4a3a });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    boxGroup.add(edges);

    const labelGeometry = new THREE.PlaneGeometry(0.4, 0.25);
    const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.z = 0.41;
    boxGroup.add(label);

    const barcodeGeometry = new THREE.PlaneGeometry(0.3, 0.08);
    const barcodeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const barcode = new THREE.Mesh(barcodeGeometry, barcodeMaterial);
    barcode.position.z = 0.42;
    barcode.position.y = -0.05;
    boxGroup.add(barcode);

    return boxGroup;
  }

  // animation loop
  private animate = (): void => {
    if (!this.isAnimating) return;
    this.animationFrameId = requestAnimationFrame(this.animate);
    const time = Date.now() * 0.001;

    this.fallingBoxes.forEach((box: any) => {
      const data = box.userData || {};
      box.position.y -= data.fallSpeed;
      data.fallSpeed += 0.0001;

      box.rotation.x += data.rotationSpeedX ?? 0;
      box.rotation.y += data.rotationSpeedY ?? 0;
      box.rotation.z += data.rotationSpeedZ ?? 0;

      box.position.x += Math.sin(time * (data.swingSpeed ?? 0.02) + (data.swingOffset ?? 0)) * (data.swingAmplitude ?? 0.5) * 0.01;
      box.position.z += Math.cos(time * (data.swingSpeed ?? 0.02) * 0.7 + (data.swingOffset ?? 0)) * 0.005;

      if (box.position.y < -10) {
        box.position.y = Math.random() * 10 + 20;
        box.position.x = (Math.random() - 0.5) * 20;
        box.position.z = (Math.random() - 0.5) * 20;

        box.userData.fallSpeed = Math.random() * 0.008 + 0.005;
        box.userData.rotationSpeedX = (Math.random() - 0.5) * 0.025;
        box.userData.rotationSpeedY = (Math.random() - 0.5) * 0.025;
        box.userData.rotationSpeedZ = (Math.random() - 0.5) * 0.015;
      }
    });

    this.boxes.forEach(b => {
      if (!this.fallingBoxes.includes(b)) {
        b.rotation.x += 0.001;
        b.rotation.y += 0.002;
      }
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private onWindowResize(container: HTMLElement): void {
    if (!this.camera || !this.renderer) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ---------------------------
  // Carousel (exact JS behavior you posted)
  // ---------------------------
  private initCarousel(): void {
    const cardsNodeList = document.querySelectorAll('.service-card');
    if (!cardsNodeList.length) return;

    // Use the NodeList reference in the same way the original JS did
    const cards = Array.from(cardsNodeList) as HTMLElement[];
    const totalCards = cards.length;
    const indicators = document.getElementById('indicators');
    if (!indicators) return;

    // create indicators
    indicators.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => this.goToSlide(i));
      indicators.appendChild(indicator);
    }

    // store the cards array for later updates
    this.carouselCards = cards;

    // set initial positions (mirrors updateCarousel logic)
    this.updateCarousel();

    // next/prev buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    nextBtn?.addEventListener('click', () => this.nextSlide());
    prevBtn?.addEventListener('click', () => this.prevSlide());

    // auto-rotate
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

      // Reset classes
      card.classList.remove('active');

      // Position cards in 3D space
      let translateX = 0;
      let translateZ = -300;
      let rotateY = 0;
      let opacity = 0.3;
      let scale = 0.7;

      if (absIndex === 0) {
        // Center card (active)
        translateX = 0;
        translateZ = 0;
        rotateY = 0;
        opacity = 1;
        scale = 1;
        card.classList.add('active');
      } else if (absIndex === 1) {
        // Right card
        translateX = 450;
        translateZ = -200;
        rotateY = -45;
        opacity = 0.6;
        scale = 0.85;
      } else if (absIndex === totalCards - 1) {
        // Left card
        translateX = -450;
        translateZ = -200;
        rotateY = 45;
        opacity = 0.6;
        scale = 0.85;
      } else {
        // Hidden cards
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

    // indicators
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

  // trigger services section animation (calls updateCarousel onEnter)
  private initServicesTrigger(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;

    gsap.to(cards, {
      opacity: 0.3,
      duration: 1,
      scrollTrigger: {
        trigger: '.services-preview',
        start: 'top 70%',
        onEnter: () => this.updateCarousel()
      }
    });
  }

  // Smooth scroll anchors
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

  // Mobile menu toggle (uses .menu-toggle and .nav-links if present)
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

  // Quote interactions (quote-trigger + quote form)
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
            this.boxes.push(box);
            this.fallingBoxes.push(box);

            setTimeout(() => {
              if (this.scene && this.boxes.includes(box)) {
                this.scene.remove(box);
                this.boxes = this.boxes.filter(b => b !== box);
                this.fallingBoxes = this.fallingBoxes.filter(b => b !== box);
              }
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

  // CLEANUP
  private cleanup(): void {
    this.isAnimating = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.carouselAutoRotate) clearInterval(this.carouselAutoRotate);
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
    this.boxes = [];
    this.fallingBoxes = [];
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
