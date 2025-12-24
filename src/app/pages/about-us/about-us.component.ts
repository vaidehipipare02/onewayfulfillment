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
      quote: 'Partnering with One Way Fulfillment has taken a huge weight off our shoulders. They manage all of our inventory and order shipping with precision, and their in-house freight team has saved us real money on inbound deliveries. Everything arrives organized, packed clean, and out the door fast. Thanks One way!!',
      author: 'Vigilante Team',
      // role: 'Founder, Trendy Threads'
    },
    {
      author: 'John Marquez',
      quote: 'Can’t say enough great things about One Way Fulfillment. They’ve been a huge asset to our operations at Bridger Design + Build. They not only handle our freight and logistics efficiently, but they also store materials for us and receive packages for our build team daily. This has streamlined our job site logistics and has saved us countless hours. Highly recommend their services to any construction company looking to stay organized and operate more efficiently.',
      // author: 'John Marquez',
      // role: 'Bridger Design + Build'
    },
    {
      quote: 'One Way Fulfillment has been a game changer for Honey Golf. Their communication is fast, their systems are organized, and they’ve handled every order with care and accuracy. Inventory is always updated, orders go out on time, and they’ve made scaling a lot less stressful for us. Highly recommend to any growing brand looking for a reliable fulfillment partner',
      author: 'Patrick Warren',
      // role: 'Honey Golf'
    }
  ];

  ngAfterViewInit(): void {
    this.initAboutAnimations();
  }

  private initAboutAnimations(): void {

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
  }
}
