import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-get-a-quote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-a-quote.component.html',
  styleUrls: ['./get-a-quote.component.scss']
})
export class GetAQuoteComponent implements OnInit {
  formData = {
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    company: '',
    numProducts: '',
    message: ''
  };

  submitted = false;
  submitSuccess = false;
  submitError = false;

  constructor() {}

  ngOnInit(): void {
    // Initialization if needed
  }

  /**
   * Handle form submission
   * Validate and submit the form data
   */
  onSubmit(): void {
    // Reset status flags
    this.submitSuccess = false;
    this.submitError = false;

    // Basic validation
    if (!this.validateForm()) {
      this.submitError = true;
      return;
    }

    this.submitted = true;

    // Simulate API call
    console.log('Form submitted:', this.formData);

    // Mock API response - in real app, call a service
    setTimeout(() => {
      this.submitSuccess = true;
      this.submitted = false;

      // Reset form
      setTimeout(() => {
        this.resetForm();
        this.submitSuccess = false;
      }, 3000);
    }, 1000);
  }

  /**
   * Validate form fields
   */
  private validateForm(): boolean {
    if (
      !this.formData.fullName ||
      !this.formData.emailAddress ||
      !this.formData.phoneNumber ||
      !this.formData.company ||
      !this.formData.numProducts
    ) {
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.emailAddress)) {
      return false;
    }

    return true;
  }

  /**
   * Reset form to initial state
   */
  private resetForm(): void {
    this.formData = {
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
      company: '',
      numProducts: '',
      message: ''
    };
  }
}
