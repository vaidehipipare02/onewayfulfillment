import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

declare const gsap: any;
declare const ScrollTrigger: any;

interface ThreePLService {
  id: number;
  icon: string;
  title: string;
  description: string;
  category?: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit {
  
  // All 3PL Services grouped by category
  services: ThreePLService[] = [
    // Core Fulfillment
    {
      id: 1,
      icon: '📦',
      title: 'Order Fulfillment',
      description: 'We receive, store, pick, pack, and ship your orders with guaranteed accuracy.',
      category: 'Core'
    },
    {
      id: 2,
      icon: '🌐',
      title: 'Omnichannel Fulfillment',
      description: 'We fulfill orders from every sales channel all in one place.',
      category: 'Core'
    },
    {
      id: 3,
      icon: '📦',
      title: 'Big, Heavy & Bulky Fulfillment',
      description: 'We specialize in large and heavy items other 3PLs struggle to handle.',
      category: 'Core'
    },

    // Amazon & E-commerce
    {
      id: 4,
      icon: '🛒',
      title: 'Amazon Fulfillment',
      description: 'We handle all your Amazon fulfillment needs, including FBA prep, FBM, and Seller Fulfilled Prime.',
      category: 'Amazon'
    },
    {
      id: 5,
      icon: '📋',
      title: 'FBA Prep',
      description: 'We prepare your products for shipment to Amazon\'s fulfillment centers.',
      category: 'Amazon'
    },
    {
      id: 6,
      icon: '✨',
      title: 'Seller Fulfilled Prime',
      description: 'We enable Prime shipping on oversized items without using Amazon\'s warehouses.',
      category: 'Amazon'
    },
    {
      id: 7,
      icon: '🏪',
      title: 'Shopify Fulfillment',
      description: 'We integrate with your Shopify store to ensure accurate, timely delivery of all your online orders.',
      category: 'E-commerce'
    },
    {
      id: 8,
      icon: '🎬',
      title: 'TikTok Shop Fulfillment',
      description: 'We handle the fulfillment demands of viral TikTok success with scalable solutions for sudden order spikes.',
      category: 'E-commerce'
    },
    {
      id: 9,
      icon: '🚀',
      title: 'Kickstarter Fulfillment',
      description: 'We simplify backer reward logistics, helping you deliver on your campaign promises on time.',
      category: 'E-commerce'
    },

    // Specialized Services
    {
      id: 10,
      icon: '🚚',
      title: 'DTC Fulfillment',
      description: 'We ship individual parcels directly to consumers.',
      category: 'Specialized'
    },
    {
      id: 11,
      icon: '🤝',
      title: 'B2B Fulfillment',
      description: 'We handle your wholesale, retail replenishment, and large-volume orders with precision.',
      category: 'Specialized'
    },

    // Planning & Management
    {
      id: 12,
      icon: '📊',
      title: 'Inventory Planning',
      description: 'We help you stock the right amounts to reduce carrying costs and prevent stockouts.',
      category: 'Planning'
    },
    {
      id: 13,
      icon: '🚛',
      title: 'Freight Management',
      description: 'We move your products from port → our warehouses → your B2B customers.',
      category: 'Planning'
    },

    // Value-Added Services
    {
      id: 14,
      icon: '↩️',
      title: 'Returns Management',
      description: 'We process, inspect, and properly handle returned items according to your guidelines.',
      category: 'Value-Added'
    },
    {
      id: 15,
      icon: '⚙️',
      title: 'Pick and Pack',
      description: 'We guarantee accuracy when picking and packing your products.',
      category: 'Value-Added'
    },
    {
      id: 16,
      icon: '🔗',
      title: 'Kitting & Assembly',
      description: 'We combine multiple products into ready-to-ship packages.',
      category: 'Value-Added'
    },
    {
      id: 17,
      icon: '📦',
      title: 'LTL Shipping',
      description: 'We provide cost-effective freight shipping for your large B2B orders.',
      category: 'Value-Added'
    }
  ];

  activeService: number | null = null;
  hoveredService: number | null = null;
  selectedCategory: string = 'all';

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
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    setTimeout(() => {
      this.initCardAnimations();
    }, 100);
  }

  get filteredServices(): ThreePLService[] {
    if (this.selectedCategory === 'all') {
      return this.services;
    }
    return this.services.filter(service => service.category === this.selectedCategory);
  }

  get uniqueCategories(): string[] {
    const categories = this.services.map(s => s.category || '');
    return ['all', ...Array.from(new Set(categories))].filter(c => c);
  }

  private initAnimations(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Title Animation
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

    // Floating shapes
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

    this.initCardAnimations();
    this.initCardHoverEffects();
  }

  private initCardAnimations(): void {
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
  }

  private initCardHoverEffects(): void {
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

      // Icon hover effect
      const icon = cardElement.querySelector('.service-icon') as HTMLElement;
      if (icon) {
        cardElement.addEventListener('mouseenter', () => {
          gsap.to(icon, {
            scale: 1.3,
            duration: 0.3,
            ease: 'back.out(2)'
          });

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

      // Glow effect
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
  }
}
