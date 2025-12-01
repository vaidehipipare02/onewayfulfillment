import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit {
  
  services = [
    {
      id: 1,
      icon: '📦',
      title: 'Order Fulfillment',
      description: 'Expert order fulfillment with guaranteed accuracy. We handle the complete process so you can focus on growing your business.',
      details: 'Automated order picking, packing, and shipping with real-time tracking'
    },
    {
      id: 2,
      icon: '🚚',
      title: 'Fast Shipping',
      description: 'Same-day and 2-day shipping options across the United States. Deliver an "Amazon Prime" experience.',
      details: 'Multiple carrier options with competitive rates and tracking'
    },
    {
      id: 3,
      icon: '📊',
      title: 'Inventory Management',
      description: 'Real-time tracking and management with 99.9% accuracy guarantee. Never worry about stock discrepancies.',
      details: 'Real-time dashboard, automated alerts, and reconciliation'
    },
    {
      id: 4,
      icon: '↩️',
      title: 'Returns Processing',
      description: 'Streamlined returns processing that maintains customer satisfaction. Fast turnaround to get products back in stock.',
      details: 'Automated RMA, inspection, restocking, and refund processing'
    },
    {
      id: 5,
      icon: '🔗',
      title: 'Platform Integration',
      description: 'Connect seamlessly with Shopify, WooCommerce, Amazon, and all major e-commerce platforms.',
      details: 'Real-time API integration, webhooks, and custom solutions'
    },
    {
      id: 6,
      icon: '🤝',
      title: 'B2B & D2C Solutions',
      description: 'Flexible solutions for both direct-to-consumer and business-to-business orders. One fulfillment partner for all.',
      details: 'Scalable operations for both small batches and bulk orders'
    }
  ];

  activeService: number | null = null;
  hoveredService: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    setTimeout(() => {
      this.initAnimations();
    }, 300);
  }

  onServiceHover(id: number): void {
    this.hoveredService = id;
  }

  onServiceLeave(): void {
    this.hoveredService = null;
  }

  selectService(id: number): void {
    this.activeService = this.activeService === id ? null : id;
    
    // Trigger animation for detail reveal
    if (this.activeService === id) {
      gsap.fromTo(
        `.service-detail-${id}`,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  }

  private initAnimations(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ========================================
    // ANIMATION 1: Section Title - Gradient Reveal
    // ========================================
    gsap.fromTo(
      '.services-title',
      { backgroundPosition: '200% 0%' },
      {
        backgroundPosition: '0% 0%',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 80%',
          once: true
        }
      }
    );

    // ========================================
    // ANIMATION 2: Floating Background Shapes (Parallax)
    // ========================================
    const floatingShapes = document.querySelectorAll('.floating-shape');
    floatingShapes.forEach((shape: Element, index: number) => {
      const shapeElement = shape as HTMLElement;
      
      gsap.to(shapeElement, {
        y: -30 + index * 10,
        rotation: 360 + index * 45,
        duration: 15 + index * 2,
        repeat: -1,
        ease: 'sine.inOut',
        yoyo: true
      });

      // Mouse parallax effect
      document.addEventListener('mousemove', (e: MouseEvent) => {
        const moveX = (e.clientX / window.innerWidth) * 50 - 25;
        const moveY = (e.clientY / window.innerHeight) * 50 - 25;
        gsap.to(shapeElement, {
          x: moveX * (index + 1) * 0.5,
          y: moveY * (index + 1) * 0.5,
          duration: 0.5,
          overwrite: 'auto'
        });
      });
    });

    // ========================================
    // ANIMATION 3: Service Cards - Staggered Entrance with Rotation
    // ========================================
    gsap.fromTo(
      '.service-card',
      { opacity: 0, y: 50, rotation: -5, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.7,
        stagger: {
          amount: 0.6,
          from: 'random'
        },
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 75%',
          once: true
        }
      }
    );

    // ========================================
    // ANIMATION 4: Service Cards - Hover 3D Tilt Effect
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card: Element) => {
      const cardElement = card as HTMLElement;
      const cardContent = cardElement.querySelector('.card-content') as HTMLElement;

      cardElement.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = cardElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(cardElement, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          overwrite: 'auto'
        });

        if (cardContent) {
          gsap.to(cardContent, {
            z: 50,
            duration: 0.3,
            overwrite: 'auto'
          });
        }
      });

      cardElement.addEventListener('mouseleave', () => {
        gsap.to(cardElement, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });

        if (cardContent) {
          gsap.to(cardContent, {
            z: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });
    });

    // ========================================
    // ANIMATION 5: Icon Scale & Bounce on Hover
    // ========================================
    serviceCards.forEach((card: Element) => {
      const cardElement = card as HTMLElement;
      const icon = cardElement.querySelector('.service-icon') as HTMLElement;
      
      if (icon) {
        cardElement.addEventListener('mouseenter', () => {
          gsap.to(icon, {
            scale: 1.3,
            duration: 0.3,
            ease: 'back.out(2)'
          });

          // Bounce effect
          gsap.to(icon, {
            y: -10,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut'
          });
        });

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.5)'
          });
        });
      }
    });

    // ========================================
    // ANIMATION 6: Border Glow Animation (on hover)
    // ========================================
    serviceCards.forEach((card: Element) => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('mouseenter', () => {
        gsap.to(cardElement, {
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.6), inset 0 0 30px rgba(0, 212, 255, 0.1)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      cardElement.addEventListener('mouseleave', () => {
        gsap.to(cardElement, {
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2), inset 0 0 0px rgba(0, 212, 255, 0)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });

    // ========================================
    // ANIMATION 7: Gradient Text Animation
    // ========================================
    const gradientText = document.querySelector('.services-title') as HTMLElement;
    if (gradientText) {
      gsap.to(gradientText, {
        backgroundPosition: '100% 0%',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // ========================================
    // ANIMATION 8: Service Details - Slide In & Color Shift
    // ========================================
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target as HTMLElement;
          const detailsBox = card.querySelector('.service-details') as HTMLElement;
          
          if (detailsBox) {
            gsap.fromTo(
              detailsBox,
              { x: -30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 }
            );
          }
          observer.unobserve(card);
        }
      });
    }, observerOptions);

    serviceCards.forEach((card) => observer.observe(card));

    // ========================================
    // ANIMATION 9: Background Gradient Shift on Scroll
    // ========================================
    const servicesSection = document.querySelector('.services-section') as HTMLElement;
    if (servicesSection) {
      gsap.to(servicesSection, {
        backgroundPosition: '100% 100%',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });
    }

    // ========================================
    // ANIMATION 10: Cards Parallax on Scroll
    // ========================================
    const cardElements = document.querySelectorAll('.service-card');
    cardElements.forEach((cardElement: Element, index: number) => {
      const card = cardElement as HTMLElement;
      gsap.to(card, {
        y: index % 2 === 0 ? 30 : -30,
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          markers: false
        }
      });
    });
  }
}
