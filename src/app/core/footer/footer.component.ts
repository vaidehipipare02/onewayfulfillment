import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact', path: '/get-a-quote' }
  ];

 services = [
  { id: 1, label: 'Order Fulfillment' },
  { id: 2, label: 'Omnichannel Fulfillment' },
  { id: 3, label: 'Big, Heavy & Bulky Fulfillment' },
  { id: 4, label: 'Amazon Fulfillment' },
  { id: 6, label: 'Seller Fulfilled Prime' }
];

  company = [
    'About Us',
    'Blog',
    'Careers',
    'Press',
    'Partner Program'
  ];

  // note: 'text' is what displays; 'href' is used for mailto: / tel:
  contact = [
    { icon: '📧', text: 'wgardner@onewayfulfillment.com', href: 'wgardner@onewayfulfillment.com', label: 'Email' },
    { icon: '📞', text: '(410) 736-2327', href: '+14107362327', label: 'Phone' },
    { icon: '📍', text: '1543 Columbia Ave, Franklin TN 37064', href: '', label: 'Address' }
  ];
}
