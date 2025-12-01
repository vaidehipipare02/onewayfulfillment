import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-get-a-quote',
  standalone: true,
  templateUrl: './get-a-quote.component.html',
  styleUrls: ['./get-a-quote.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class GetAQuoteComponent {
  step = 1;
  maxStep = 5;
  submitted = false;
  reference = '';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      company: this.fb.group({
        companyName: ['', Validators.required],
        industry: [''],
        website: [''],
      }),
      contact: this.fb.group({
        yourName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
      }),
      services: this.fb.group({
        dtc: [false],
        b2b: [false],
        amazon: [false],
        returns: [false],
        kitting: [false],
        freight: [false],
        monthlyVolume: [''],
        avgWeight: [''],
      }),
      storage: this.fb.group({
        storageType: [''],
        skus: [''],
        avgSkuSize: [''],
        palletRequired: [false],
      }),
      tech: this.fb.group({
        platform: [''],
        apiAccess: [false],
        syncOptions: [''],
      }),
      timeline: this.fb.group({
        startDate: [''],
        monthlyBudget: [''],
        urgency: ['normal'],
      }),
    });
  }

  next(): void {
    if (this.step < this.maxStep) {
      this.step++;
    }
  }

  previous(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  submit(): void {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      this.submitted = true;
      this.reference = 'OWF-' + Math.floor(100000 + Math.random() * 900000);
      const formValue = this.form.value;
      // Prepare EmailJS params
      const templateParams = {
        reference: this.reference,
        companyName: formValue.company.companyName,
        industry: formValue.company.industry,
        website: formValue.company.website,
        yourName: formValue.contact.yourName,
        email: formValue.contact.email,
        phone: formValue.contact.phone,
        services: JSON.stringify(formValue.services),
        storage: JSON.stringify(formValue.storage),
        tech: JSON.stringify(formValue.tech),
        timeline: JSON.stringify(formValue.timeline)
      };
      // Send email using EmailJS
      emailjs.send(
        'service_vaidehi', // Your EmailJS service ID
        'template_vaidehi', // Your EmailJS template ID
        templateParams,
        '02JfGRfCYO5T09nS7' // Your EmailJS public key
      ).then(
        (response) => {
          console.log('Email sent successfully!', response);
          alert('Quote request sent successfully!');
        },
        (error) => {
          console.error('Email sending failed:', error);
          alert('Failed to send quote request. Please try again later.');
        }
      );
      console.log('Form submitted:', this.form.value);
  }

  downloadPdf(): void {
    const doc = new jsPDF();
    const formValue = this.form.value;
    let y = 10;
    doc.setFontSize(14);
    doc.text('Get A Quote Submission', 10, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Reference: ${this.reference}`, 10, y);
    y += 10;
    doc.text(`Company Name: ${formValue.company.companyName}`, 10, y);
    y += 7;
    doc.text(`Industry: ${formValue.company.industry}`, 10, y);
    y += 7;
    doc.text(`Website: ${formValue.company.website}`, 10, y);
    y += 7;
    doc.text(`Your Name: ${formValue.contact.yourName}`, 10, y);
    y += 7;
    doc.text(`Email: ${formValue.contact.email}`, 10, y);
    y += 7;
    doc.text(`Phone: ${formValue.contact.phone}`, 10, y);
    y += 7;
    doc.text(`Services: ${JSON.stringify(formValue.services)}`, 10, y);
    y += 7;
    doc.text(`Storage: ${JSON.stringify(formValue.storage)}`, 10, y);
    y += 7;
    doc.text(`Tech: ${JSON.stringify(formValue.tech)}`, 10, y);
    y += 7;
    doc.text(`Timeline: ${JSON.stringify(formValue.timeline)}`, 10, y);
    doc.save(`quote-${this.reference}.pdf`);
  }
}