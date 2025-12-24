import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-guarantee',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './guarantee.component.html',
  styleUrls: ['./guarantee.component.scss']
})
export class GuaranteeComponent implements OnInit, AfterViewInit {
  @ViewChild('detailRight') detailRight!: ElementRef;

  scrollToTop(): void {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  selectedGuarantee: number = 0;

  guarantees = [
    {
      id: 1,
      icon: '✓',
      title: 'Zero Shrinkage Guarantee',
      description:
        'Your inventory is precious. We guarantee 100% accountability for every item.',
      details:
        'If any product is lost, damaged, or unaccounted for, we reimburse you immediately. No debates. No delays. Your investment is protected.',
      badge: '$50 per incident',
      color: '#00d4ff',
      benefits: ['Full reimbursement', 'Immediate processing', 'No deductibles']
    },
    {
      id: 2,
      icon: '⚡',
      title: 'On-Time Shipping Guarantee',
      description:
        'Fast shipping that actually happens on schedule, every single time.',
      details:
        'We commit to shipping 100% of orders according to your service level agreement. Every late shipment costs us $50 to you.',
      badge: '$50 per late order',
      color: '#ff00ff',
      benefits: ['Same-day available', 'Real-time tracking', 'Consistent delivery']
    },
    {
      id: 3,
      icon: '🎯',
      title: 'Perfect Order Accuracy',
      description:
        'Orders fulfilled exactly as requested—no exceptions, no excuses.',
      details:
        'Wrong items or quantities result in $50 compensation plus we cover all shipping costs. We pick it right the first time.',
      badge: '$50 + shipping',
      color: '#ffff00',
      benefits: [
        '99.9% accuracy rate',
        'Real-time QC checks',
        'Customer satisfaction guaranteed'
      ]
    },
    {
      id: 4,
      icon: '📦',
      title: 'Fast Receiving Guarantee',
      description: 'Your inventory ready to sell within 48 hours of arrival.',
      details:
        'All new inventory received and processed within 2 business days. Never lose a sale because stock is sitting unprocessed.',
      badge: '48-hour processing',
      color: '#00ff88',
      benefits: ['Quick processing', 'Ready to ship', 'Real-time visibility']
    },
    {
      id: 5,
      icon: '🔄',
      title: 'Hassle-Free Returns Guarantee',
      description:
        'Returns management that actually improves customer satisfaction.',
      details:
        'We handle 100% of the returns process for you. Customers are happier, your refund cycles are faster, and your time is freed up.',
      badge: 'Full RMA service',
      color: '#ff9900',
      benefits: ['Automated RMA', '24-48 hour processing', 'Resale-ready items']
    },
    {
      id: 6,
      icon: '🤝',
      title: 'Dedicated Partnership Guarantee',
      description:
        'You get a dedicated account manager who knows your business inside and out.',
      details:
        'One single point of contact. Not a rotating cast of support reps. Your account manager is personally invested in your success and available whenever you need them.',
      badge: 'Dedicated support',
      color: '#ff1493',
      benefits: [
        'Personal account manager',
        'Priority support access',
        'Proactive optimization'
      ]
    }
  ];

  comparisons = [
    {
      feature: 'Accountability for Shrinkage',
      us: true,
      others: false
    },
    {
      feature: 'Financial Penalties for Late Shipments',
      us: true,
      others: false
    },
    {
      feature: 'No Setup or Hidden Fees',
      us: true,
      others: false
    },
    {
      feature: 'Dedicated Account Manager',
      us: true,
      others: false
    },
    {
      feature: '24/7 Customer Support',
      us: true,
      others: false
    },
    {
      feature: 'Custom Pricing & Flexible Terms',
      us: true,
      others: false
    },
    {
      feature: 'Real-Time Inventory Tracking',
      us: true,
      others: false
    },
    {
      feature: 'Return Automation',
      us: true,
      others: false
    }
  ];

  faqs = [
    {
      question: 'What happens if you fail to meet a guarantee?',
      answer:
        'We immediately process a refund or credit to your account. No paperwork, no excuses. Our system automatically flags these incidents and we handle resolution within 24 hours.'
    },
    {
      question: 'Can I customize these guarantees for my business?',
      answer:
        'Absolutely. These are our baseline guarantees. We can adjust timelines, add specific terms, and create custom solutions based on your unique needs.'
    },
    {
      question: 'How do you ensure these guarantees are met?',
      answer:
        'We use real-time monitoring, automated quality checks, dedicated staff, and continuous improvement processes. Our systems flag any potential issues before they happen.'
    },
    {
      question: 'Is there a limit to how many times I can claim a guarantee?',
      answer:
        'No. These are standing guarantees. However, if patterns emerge, we\'ll work with you to identify root causes and implement solutions.'
    },
    {
      question: "What's your average performance against these guarantees?",
      answer:
        "We achieve 99.9% accuracy on orders, ship 100% on-time, and maintain zero-shrinkage records. We're confident in our commitments."
    },
    {
      question: 'How does this compare to other 3PLs?',
      answer:
        'Most 3PLs treat shrinkage as a "cost of doing business." We guarantee accountability. Most don\'t offer financial penalties for late shipments. We do. Most importantly, we assign you a dedicated account manager who truly cares about your success.'
    }
  ];

  expandedFaq: number | null = null;

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

  selectGuarantee(index: number): void {
    this.selectedGuarantee = index;

    // animate detail card
    gsap.fromTo(
      '.guarantee-detail',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.3 }
    );

    // scroll only the right section into view (no full-page scroll)
    if (this.detailRight?.nativeElement) {
      this.detailRight.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  toggleFaq(index: number): void {
    this.expandedFaq = this.expandedFaq === index ? null : index;
  }

  private initAnimations(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero fade-in
    gsap.fromTo(
      '.guarantee-hero h1',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
    );

    // Guarantee cards stagger animation
    gsap.fromTo(
      '.guarantee-card',
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.guarantee-grid',
          start: 'top 80%',
          once: true
        }
      }
    );

    // Comparison table animation
    gsap.fromTo(
      '.comparison-row',
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.comparison-section',
          start: 'top 80%',
          once: true
        }
      }
    );

    // FAQ animation
    gsap.fromTo(
      '.faq-item',
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.faq-section',
          start: 'top 80%',
          once: true
        }
      }
    );

    // CTA button animation
    gsap.fromTo(
      '.cta-section h2',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 85%',
          once: true
        }
      }
    );
  }
}
