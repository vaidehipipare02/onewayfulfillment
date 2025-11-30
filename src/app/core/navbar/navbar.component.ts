import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Get Quote', path: '/get-a-quote' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Additional navbar initialization if needed
  }
  isMenuOpen = false;

toggleMenu(): void {
  this.isMenuOpen = !this.isMenuOpen;
}

closeMenu(): void {
  this.isMenuOpen = false;
}
}
