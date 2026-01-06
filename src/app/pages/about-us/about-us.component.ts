import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements AfterViewInit {

  whyChooseUs = [
    {
      icon: '🎯',
      title: 'Young Team',
      description: 'Small, energetic team focused on speed and flexibility.'
    },
    {
      icon: '🚀',
      title: 'Cutting-Edge Technology',
      description: 'Modern warehouse systems and automation.'
    },
    {
      icon: '📊',
      title: 'Real-Time Tracking',
      description: 'Live inventory and order tracking.'
    },
    {
      icon: '🛡️',
      title: 'Reliability',
      description: '99.9% accuracy with 24/7 monitoring.'
    },
    {
      icon: '💰',
      title: 'Cost Effective',
      description: 'Optimized operations to reduce fulfillment costs.'
    },
     {
      icon: '🌍',
      title: 'Scalable Solutions',
      description: 'Grow with confidence - our systems scale with your business needs.'
    }
  ];

  testimonials = [
    {
      fullQuote: 'Partnering with One Way Fulfillment has taken a huge weight off our shoulders. They manage our inventory and order shipping with real precision, and their in-house freight team has saved us serious money on inbound deliveries. Everything arrives organized, packed clean, and out the door fast, which lets our team focus on growth instead of logistics headaches. Their inventory tools give us clear visibility into stock and order status at any time, and support is always quick and professional when we have questions. It feels like having an experienced internal logistics team without the overhead. Thanks One Way Fulfillment for being such a dependable partner.',
      author: 'Vigilante Team',
      // role: 'E-commerce Brand',
      expanded: false
    },
    {
      fullQuote: 'Can\'t say enough great things about One Way Fulfillment. They\'ve been a major asset to our operations at Bridger Design + Build. They handle freight and logistics efficiently, store our materials, and receive packages for our build team every single day. This has streamlined job site logistics and saved us countless hours of coordination and follow-up. Their team communicates clearly, solves issues quickly, and understands the pace of construction work. We always know where our materials are and when they will be ready. For any construction company that wants to stay organized and operate more efficiently, their service is a huge win.',
      author: 'John Marquez',
      role: 'Bridger Design + Build',
      expanded: false
    },
    {
      fullQuote: 'One Way Fulfillment has been a game changer for Honey Golf. Their communication is fast, their systems are well organized, and they handle every order with real care and accuracy. Our inventory stays updated, orders go out on time, and returns are processed smoothly, which has made scaling much less stressful for our team. The visibility we get into stock and shipment status helps us plan launches with confidence. Their warehouse team pays attention to details, from packing quality to labeling, which our customers notice. For any growing brand that needs a reliable fulfillment partner, they are easy to recommend.',
      author: 'Patrick Warren',
      role: 'Honey Golf',
      expanded: false
    }
  ];

  ngAfterViewInit(): void {
    this.initAboutAnimations();
  }

  toggleExpand(index: number): void {
    this.testimonials[index].expanded = !this.testimonials[index].expanded;
  }

  getDisplayText(fullQuote: string, expanded: boolean): string {
    if (expanded) {
      return fullQuote;
    }
    return fullQuote.length > 150 ? fullQuote.substring(0, 150) + '...' : fullQuote;
  }

  private initAboutAnimations(): void {

    // Why Cards Animation
    const cards = document.querySelectorAll('.why-card');
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: index * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Team Cards Animation
    const teamCards = document.querySelectorAll('.team-card');
    if (teamCards.length > 0) {
      teamCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true
            }
          }
        );
      });
    }
  }
}
