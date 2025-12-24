import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import * as emailjs from '@emailjs/browser';
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

  private EMAILJS_SERVICE_ID = 'service_soham';
  private EMAILJS_TEMPLATE_ID = 'template_soham';
  private EMAILJS_PUBLIC_KEY = 'Vh01Ag6el60JdXgRr';

  constructor(private fb: FormBuilder) {
    emailjs.init(this.EMAILJS_PUBLIC_KEY);

    this.form = this.fb.group({
      company: this.fb.group({
        companyName: ['', Validators.required],
        industry: [''],
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
      }),
      tech: this.fb.group({
        platform: [''],
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
    if (this.step < this.maxStep) this.step++;
  }

  previous(): void {
    if (this.step > 1) this.step--;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Generate a reference ID
    this.reference = 'OWF-' + Math.floor(100000 + Math.random() * 900000);
    const v = this.form.value;

    const servicesSummary = [
      `DTC Fulfillment: ${v.services.dtc ? 'Yes' : 'No'}`,
      `B2B & Wholesale: ${v.services.b2b ? 'Yes' : 'No'}`,
      `Amazon FBM: ${v.services.amazon ? 'Yes' : 'No'}`,
      `Returns Processing: ${v.services.returns ? 'Yes' : 'No'}`,
      `Custom Kitting: ${v.services.kitting ? 'Yes' : 'No'}`,
      `Shipping & Freight: ${v.services.freight ? 'Yes' : 'No'}`,
      v.services.monthlyVolume ? `Monthly Volume: ${v.services.monthlyVolume}` : null,
      v.services.avgWeight ? `Average Weight: ${v.services.avgWeight}` : null,
    ]
      .filter(Boolean)
      .join('<br>');

    const storageSummary = [
      v.storage.storageType ? `Storage Type: ${v.storage.storageType}` : null,
      v.storage.skus ? `Total SKUs: ${v.storage.skus}` : null,
      v.storage.avgSkuSize ? `Average SKU Size: ${v.storage.avgSkuSize}` : null,
    ]
      .filter(Boolean)
      .join('<br>');

    const techSummary = [
      v.tech.platform ? `Platform: ${v.tech.platform}` : null,
      v.tech.syncOptions ? `Sync Options: ${v.tech.syncOptions}` : null,
    ]
      .filter(Boolean)
      .join('<br>');

    const timelineSummary = [
      v.timeline.startDate ? `Start Date: ${v.timeline.startDate}` : null,
      v.timeline.monthlyBudget ? `Monthly Budget: ${v.timeline.monthlyBudget}` : null,
      v.timeline.urgency ? `Urgency: ${v.timeline.urgency}` : null,
    ]
      .filter(Boolean)
      .join('<br>');

    const templateParams: any = {
      reference: this.reference,
      companyName: v.company.companyName || '',
      industry: v.company.industry || '',
      yourName: v.contact.yourName || '',
      email: v.contact.email || '',
      phone: v.contact.phone || '',

      services: servicesSummary,
      storage: storageSummary,
      tech: techSummary,
      timeline: timelineSummary,

      services_dtc: v.services.dtc ? 'Yes' : 'No',
      services_b2b: v.services.b2b ? 'Yes' : 'No',
      services_amazon: v.services.amazon ? 'Yes' : 'No',
      services_returns: v.services.returns ? 'Yes' : 'No',
      services_kitting: v.services.kitting ? 'Yes' : 'No',
      services_freight: v.services.freight ? 'Yes' : 'No',
      services_monthlyVolume: v.services.monthlyVolume || '',
      services_avgWeight: v.services.avgWeight || '',

      storage_type: v.storage.storageType || '',
      storage_skus: v.storage.skus || '',
      storage_avgSkuSize: v.storage.avgSkuSize || '',

      tech_platform: v.tech.platform || '',
      tech_syncOptions: v.tech.syncOptions || '',

      timeline_startDate: v.timeline.startDate || '',
      timeline_monthlyBudget: v.timeline.monthlyBudget || '',
      timeline_urgency: v.timeline.urgency || '',

      company_name: v.company.companyName || '',
      contact_name: v.contact.yourName || '',
      contact_email: v.contact.email || '',
      contact_phone: v.contact.phone || '',
      services_raw: JSON.stringify(v.services),
      storage_raw: JSON.stringify(v.storage),
      tech_raw: JSON.stringify(v.tech),
      timeline_raw: JSON.stringify(v.timeline),
    };

    console.log('EmailJS templateParams:', templateParams);

    emailjs
      .send(this.EMAILJS_SERVICE_ID, this.EMAILJS_TEMPLATE_ID, templateParams)
      .then(
        (response: any) => {
          console.log('EmailJS success response:', response);
          this.submitted = true; // show success screen
          // removed alert('Quote request sent successfully!');
        },
        (err: any) => {
          console.error('EmailJS send failed:', err);
          // removed alert on error as well
        }
      );
  }

  downloadPdf(): void {
    const doc = new (jsPDF as any)();
    const formValue = this.form.value;
    let y = 10;

    doc.setFontSize(14);
    doc.text('Get A Quote Submission', 10, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Reference: ${this.reference}`, 10, y);
    y += 7;

    doc.text(`Company Name: ${formValue.company.companyName || ''}`, 10, y);
    y += 7;
    doc.text(`Industry: ${formValue.company.industry || ''}`, 10, y);
    y += 7;

    doc.text(`Your Name: ${formValue.contact.yourName || ''}`, 10, y);
    y += 7;
    doc.text(`Email: ${formValue.contact.email || ''}`, 10, y);
    y += 7;
    doc.text(`Phone: ${formValue.contact.phone || ''}`, 10, y);
    y += 10;

    const servicesSummary =
      `DTC: ${formValue.services.dtc ? 'Yes' : 'No'}, ` +
      `B2B: ${formValue.services.b2b ? 'Yes' : 'No'}, ` +
      `Amazon: ${formValue.services.amazon ? 'Yes' : 'No'}, ` +
      `Returns: ${formValue.services.returns ? 'Yes' : 'No'}, ` +
      `Kitting: ${formValue.services.kitting ? 'Yes' : 'No'}, ` +
      `Freight: ${formValue.services.freight ? 'Yes' : 'No'}` +
      (formValue.services.monthlyVolume
        ? `, Monthly Volume: ${formValue.services.monthlyVolume}`
        : '') +
      (formValue.services.avgWeight
        ? `, Avg Weight: ${formValue.services.avgWeight}`
        : '');

    doc.text(`Services: ${servicesSummary}`, 10, y);
    y += 10;

    const storageSummary = [
      formValue.storage.storageType ? `Type: ${formValue.storage.storageType}` : null,
      formValue.storage.skus ? `SKUs: ${formValue.storage.skus}` : null,
      formValue.storage.avgSkuSize ? `Avg SKU Size: ${formValue.storage.avgSkuSize}` : null,
    ]
      .filter(Boolean)
      .join(', ');
    doc.text(`Storage: ${storageSummary}`, 10, y);
    y += 8;

    const techSummary = [
      formValue.tech.platform ? `Platform: ${formValue.tech.platform}` : null,
      formValue.tech.syncOptions ? `Sync: ${formValue.tech.syncOptions}` : null,
    ]
      .filter(Boolean)
      .join(', ');
    doc.text(`Tech: ${techSummary}`, 10, y);
    y += 8;

    const timelineSummary = [
      formValue.timeline.startDate ? `Start: ${formValue.timeline.startDate}` : null,
      formValue.timeline.monthlyBudget ? `Budget: ${formValue.timeline.monthlyBudget}` : null,
      formValue.timeline.urgency ? `Urgency: ${formValue.timeline.urgency}` : null,
    ]
      .filter(Boolean)
      .join(', ');
    doc.text(`Timeline: ${timelineSummary}`, 10, y);

    doc.save(`quote-${this.reference}.pdf`);
  }
}
