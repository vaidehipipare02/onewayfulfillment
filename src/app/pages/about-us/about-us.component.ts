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
      description: 'We\'re a small, high-energy team, and we focus on fast communication, flexibility, and making operations easier for the companies we partner with.'
    },
    {
      icon: '🚀',
      title: 'Cutting-Edge Technology',
      description: 'We use the latest warehouse management systems and automation technology.'
    },
    {
      icon: '📊',
      title: 'Real-Time Tracking',
      description: 'Track your inventory and orders in real-time with our advanced system.'
    },
    {
      icon: '🛡️',
      title: 'Reliability',
      description: '99.9% accuracy guarantee with 24/7 customer support and monitoring.'
    },
    {
      icon: '💰',
      title: 'Cost Effective',
      description: 'Competitive pricing with no hidden fees. Flexible plans to fit any budget.'
    },
    {
      icon: '🌍',
      title: 'Scalable Solutions',
      description: 'Grow with confidence - our systems scale with your business needs.'
    }
  ];

  teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Industry veteran with 20+ years of fulfillment experience.'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Operations Officer',
      bio: 'Expert in warehouse automation and logistics optimization.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Technology',
      bio: 'Tech innovator focused on building scalable fulfillment solutions.'
    },
    {
      name: 'David Williams',
      role: 'Customer Success Director',
      bio: 'Dedicated to ensuring every client achieves their business goals.'
    }
  ];

  constructor() {}

  ngAfterViewInit(): void {
    this.initAboutAnimations();
  }

  /**
   * Animate about page elements on scroll
   */
  private initAboutAnimations(): void {
    // Animate why choose us cards
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
          },
          ease: 'back.out'
        }
      );
    });

    // Animate team members
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach((card, index) => {
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
          },
          ease: 'elastic.out(1, 0.5)'
        }
      );
    });
  }
}
