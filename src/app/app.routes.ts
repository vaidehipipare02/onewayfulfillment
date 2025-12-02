import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { GetAQuoteComponent } from './pages/get-a-quote/get-a-quote.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { GuaranteeComponent } from './pages/guarantee/guarantee.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'get-a-quote', component: GetAQuoteComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'guarantee', component: GuaranteeComponent },
  { path: '**', redirectTo: '' }
];
