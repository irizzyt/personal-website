/**
 * Contact Form Handler
 * Production-Level Form Validation and Submission
 */

(function() {
  'use strict';

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const formFields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
  };

  const formErrors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    message: document.getElementById('message-error')
  };

  const formStatus = document.getElementById('form-status');

  /**
   * Validate form field
   */
  function validateField(fieldName, value) {
    const field = formFields[fieldName];
    const errorEl = formErrors[fieldName];

    // Clear previous error
    errorEl.textContent = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          showError(fieldName, 'Name is required');
          return false;
        }
        if (value.trim().length < 2) {
          showError(fieldName, 'Name must be at least 2 characters');
          return false;
        }
        break;

      case 'email':
        if (!value.trim()) {
          showError(fieldName, 'Email is required');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showError(fieldName, 'Please enter a valid email address');
          return false;
        }
        break;

      case 'message':
        if (!value.trim()) {
          showError(fieldName, 'Message is required');
          return false;
        }
        if (value.trim().length < 10) {
          showError(fieldName, 'Message must be at least 10 characters');
          return false;
        }
        break;
    }

    return true;
  }

  /**
   * Show field error
   */
  function showError(fieldName, message) {
    const errorEl = formErrors[fieldName];
    errorEl.textContent = message;
    formFields[fieldName].setAttribute('aria-invalid', 'true');
    formFields[fieldName].classList.add('error');
  }

  /**
   * Clear field error
   */
  function clearError(fieldName) {
    const errorEl = formErrors[fieldName];
    errorEl.textContent = '';
    formFields[fieldName].removeAttribute('aria-invalid');
    formFields[fieldName].classList.remove('error');
  }

  /**
   * Show form status message
   */
  function showStatus(message, type = 'success') {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.setAttribute('role', 'alert');
    
    // Clear status after 5 seconds
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      formStatus.removeAttribute('role');
    }, 5000);
  }

  /**
   * Validate entire form
   */
  function validateForm() {
    let isValid = true;

    Object.keys(formFields).forEach(fieldName => {
      const field = formFields[fieldName];
      if (!validateField(fieldName, field.value)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Handle form submission
   */
  function handleSubmit(e) {
    e.preventDefault();

    // Clear previous status
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    // Validate form
    if (!validateForm()) {
      showStatus('Please fix the errors above', 'error');
      // Focus first error field
      const firstError = Object.keys(formFields).find(
        fieldName => formErrors[fieldName].textContent
      );
      if (firstError && formFields[firstError]) {
        formFields[firstError].focus();
      }
      return;
    }

    // Get form data
    const formData = {
      name: formFields.name.value.trim(),
      email: formFields.email.value.trim(),
      message: formFields.message.value.trim()
    };

    // Disable submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.setAttribute('aria-busy', 'true');

    // Form submission via Formspree or similar service
    // Replace YOUR_FORM_ID with your actual Formspree form ID
    const formAction = 'https://formspree.io/f/YOUR_FORM_ID';
    
    fetch(formAction, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        showStatus('Thank you! Your message has been sent. I\'ll get back to you soon.', 'success');
        contactForm.reset();
        Object.keys(formFields).forEach(fieldName => {
          clearError(fieldName);
        });
      } else {
        return response.json().then(data => {
          if (data.errors) {
            showStatus('Please check the form for errors and try again.', 'error');
          } else {
            showStatus('Sorry, there was an error sending your message. Please try again later.', 'error');
          }
        });
      }
    })
    .catch((error) => {
      // Handle network errors or API failures
      console.error('Form submission error:', error);
      showStatus('Sorry, there was an error sending your message. Please check your connection and try again, or email me directly at iturfle@guilford.edu', 'error');
    })
    .finally(() => {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.removeAttribute('aria-busy');
      formFields.name.focus();
    });
  }

  /**
   * Real-time validation on blur
   */
  Object.keys(formFields).forEach(fieldName => {
    const field = formFields[fieldName];
    
    field.addEventListener('blur', () => {
      validateField(fieldName, field.value);
    });

    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) {
        clearError(fieldName);
      }
    });
  });

  // Handle form submission
  contactForm.addEventListener('submit', handleSubmit);
})();

