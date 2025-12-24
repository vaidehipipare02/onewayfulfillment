import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  services: ThreePLService[] = [
    { id: 1, icon: '📦', title: 'Order Fulfillment', description: 'We receive, store, pick, pack, and ship your orders with guaranteed accuracy.', category: 'Core' },
    { id: 2, icon: '🌐', title: 'Omnichannel Fulfillment', description: 'We fulfill orders from every sales channel all in one place.', category: 'Core' },
    // { id: 3, icon: '📦', title: 'Big, Heavy & Bulky Fulfillment', description: 'We specialize in large and heavy items other 3PLs struggle to handle.', category: 'Core' },

    { id: 4, icon: '🛒', title: 'Amazon Fulfillment', description: 'We handle all your Amazon fulfillment needs including FBA prep, FBM, and SFP.', category: 'Amazon' },
    { id: 5, icon: '📋', title: 'FBA Prep', description: 'We prepare your products for shipment to Amazon fulfillment centers.', category: 'Amazon' },
    { id: 6, icon: '✨', title: 'Seller Fulfilled Prime', description: 'Enable Prime shipping on oversized items without Amazon warehouses.', category: 'Amazon' },

    { id: 7, icon: '🏪', title: 'Shopify Fulfillment', description: 'Integrated fulfillment for Shopify stores.', category: 'E-commerce' },
    { id: 8, icon: '🎬', title: 'TikTok Shop Fulfillment', description: 'Scalable fulfillment for viral TikTok brands.', category: 'E-commerce' },
    { id: 9, icon: '🚀', title: 'Kickstarter Fulfillment', description: 'End-to-end backer reward logistics.', category: 'E-commerce' },

    { id: 10, icon: '🚚', title: 'DTC Fulfillment', description: 'Direct-to-consumer parcel shipping.', category: 'Specialized' },
    { id: 11, icon: '🤝', title: 'B2B Fulfillment', description: 'Wholesale & retail replenishment at scale.', category: 'Specialized' },

    { id: 12, icon: '📊', title: 'Inventory Planning', description: 'Data-driven inventory optimization.', category: 'Planning' },
    { id: 13, icon: '🚛', title: 'Freight Management', description: 'Port to warehouse to customer logistics.', category: 'Planning' },

    { id: 14, icon: '↩️', title: 'Returns Management', description: 'Efficient inspection and returns processing.', category: 'Value-Added' },
    { id: 15, icon: '⚙️', title: 'Pick and Pack', description: 'Accurate and fast order assembly.', category: 'Value-Added' },
    { id: 16, icon: '🔗', title: 'Kitting & Assembly', description: 'Bundled product assembly services.', category: 'Value-Added' },
    { id: 17, icon: '📦', title: 'LTL Shipping', description: 'Cost-effective freight shipping.', category: 'Value-Added' }
  ];

  activeService: number | null = null;
  hoveredService: number | null = null;
  selectedCategory: string = 'all';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // 🔹 Scroll to service from footer
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 300);
      }
    });

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
    setTimeout(() => this.initCardAnimations(), 100);
  }

  get filteredServices(): ThreePLService[] {
    return this.selectedCategory === 'all'
      ? this.services
      : this.services.filter(s => s.category === this.selectedCategory);
  }

  get uniqueCategories(): string[] {
    return ['all', ...Array.from(new Set(this.services.map(s => s.category!)))];
  }

  /* ================= GSAP ANIMATIONS ================= */

  private initAnimations(): void {
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    this.initCardAnimations();
  }

  private initCardAnimations(): void {
    gsap.fromTo(
      '.service-card',
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 75%',
          once: true
        }
      }
    );
  }
}
