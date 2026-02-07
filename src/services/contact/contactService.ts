/**
 * Contact Service
 * 
 * Handles contact form submission and inquiry management
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  ticketId?: string;
}

/**
 * Submit contact form inquiry
 * 
 * @param data - Contact form data
 * @returns Promise with submission response
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<ContactSubmissionResponse> {
  try {
    // Validate data
    validateContactForm(data);

    // TODO: Replace with actual API endpoint when backend is ready
    // const response = await fetch('/api/v1/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to submit contact form');
    // }

    // const result = await response.json();
    // return result;

    // Simulate API call for now
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock ticket ID
    const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      ticketId,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

/**
 * Validate contact form data
 * 
 * @param data - Contact form data to validate
 * @throws Error if validation fails
 */
function validateContactForm(data: ContactFormData): void {
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  if (data.name.length > 100) {
    throw new Error('Name must not exceed 100 characters');
  }

  // Email validation
  if (!data.email) {
    throw new Error('Email is required');
  }
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email address');
  }

  // Phone validation (optional)
  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new Error('Invalid phone number');
    }
  }

  // Subject validation
  if (!data.subject || data.subject.trim().length < 5) {
    throw new Error('Subject must be at least 5 characters long');
  }
  if (data.subject.length > 200) {
    throw new Error('Subject must not exceed 200 characters');
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    throw new Error('Message must be at least 10 characters long');
  }
  if (data.message.length > 1000) {
    throw new Error('Message must not exceed 1000 characters');
  }
}

/**
 * Sanitize contact form data
 * Removes extra whitespace and potentially harmful content
 * 
 * @param data - Contact form data to sanitize
 * @returns Sanitized contact form data
 */
export function sanitizeContactForm(data: ContactFormData): ContactFormData {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
  };
}
