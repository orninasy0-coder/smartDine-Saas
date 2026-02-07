import type { GuideContentSection } from '@/components/guide/GuideContent';

// Kitchen Staff, Delivery, Admin, Advanced Features, FAQ, and Troubleshooting Content

export const kitchenStaffContent: Record<string, GuideContentSection> = {
  'kitchen-staff-login': {
    id: 'kitchen-staff-login',
    title: 'Kitchen Staff Login',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Kitchen staff receive a dedicated account to access the order management system.
        </p>
      </div>
    ),
    steps: [
      {
        title: 'Receive Invitation',
        description: 'Staff member receives an email invitation from the restaurant owner.',
      },
      {
        title: 'Create Password',
        description: 'Click the link in the invitation and create a strong password.',
      },
      {
        title: 'Login',
        description: 'Use email and password to log in.',
      },
      {
        title: 'Access Kitchen Dashboard',
        description: 'Automatically redirected to the kitchen control panel.',
      },
    ],
  },

  'kitchen-staff-new-orders': {
    id: 'kitchen-staff-new-orders',
    title: 'View New Orders',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Simple and clear interface to view all new and ongoing orders.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Order Information</h3>
          <ul className="space-y-2">
            <li>• Order number</li>
            <li>• Table number</li>
            <li>• Requested dishes with quantities</li>
            <li>• Special notes</li>
            <li>• Order received time</li>
            <li>• Estimated preparation time</li>
          </ul>
        </div>
      </div>
    ),
  },

  'kitchen-staff-update-status': {
    id: 'kitchen-staff-update-status',
    title: 'Update Order Status',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Real-time order status updates to keep customers informed.
        </p>
      </div>
    ),
    steps: [
      {
        title: 'Accept Order',
        description: 'Staff clicks "Accept" when starting to prepare the order.',
      },
      {
        title: 'Update Progress',
        description: 'Can update the status of each dish individually during preparation.',
      },
      {
        title: 'Mark as "Ready"',
        description: 'When order is complete, click "Ready to Serve".',
      },
      {
        title: 'Automatic Notification',
        description: 'Customer and delivery staff receive instant notification.',
      },
    ],
  },

  'kitchen-staff-notifications': {
    id: 'kitchen-staff-notifications',
    title: 'Handle Notifications',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Instant notification system to ensure no order is missed.
        </p>

        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Notification Types</h3>
          <ul className="space-y-2">
            <li>• New order (sound + vibration)</li>
            <li>• Urgent order (high priority)</li>
            <li>• Modification to existing order</li>
            <li>• Order cancellation</li>
            <li>• Message from restaurant owner</li>
          </ul>
        </div>
      </div>
    ),
  },
};

export const deliveryPersonnelContent: Record<string, GuideContentSection> = {
  'delivery-personnel-ready-orders': {
    id: 'delivery-personnel-ready-orders',
    title: 'View Ready Orders for Delivery',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          List of all ready orders available for delivery.
        </p>
      </div>
    ),
    steps: [
      {
        title: 'Open Delivery Dashboard',
        description: 'Delivery staff logs in and opens their control panel.',
      },
      {
        title: 'View Available Orders',
        description: 'List of ready orders appears with addresses and distances.',
      },
      {
        title: 'Sort Orders',
        description: 'Orders can be sorted by time, distance, or priority.',
      },
    ],
  },

  'delivery-personnel-accept-order': {
    id: 'delivery-personnel-accept-order',
    title: 'Accept Delivery Order',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Simple process to accept order and start delivery.
        </p>
      </div>
    ),
    steps: [
      {
        title: 'Select Order',
        description: 'Staff clicks on order to view full details.',
      },
      {
        title: 'Review Information',
        description: 'Review address, phone number, and special notes.',
      },
      {
        title: 'Accept Order',
        description: 'Click "Accept Order" to start delivery.',
      },
      {
        title: 'Pick Up Order',
        description: 'Pick up order from kitchen and confirm pickup in app.',
      },
    ],
  },

  'delivery-personnel-map': {
    id: 'delivery-personnel-map',
    title: 'Use Map and Navigation',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Interactive map with GPS navigation to easily reach the address.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Map Features</h3>
          <ul className="space-y-2">
            <li>• Display current location</li>
            <li>• Optimal route to destination</li>
            <li>• Estimated arrival time</li>
            <li>• Traffic updates</li>
            <li>• Ability to call customer</li>
          </ul>
        </div>
      </div>
    ),
  },

  'delivery-personnel-delivery-status': {
    id: 'delivery-personnel-delivery-status',
    title: 'Update Delivery Status',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Real-time updates to keep customer informed about order location.
        </p>
      </div>
    ),
    steps: [
      {
        title: 'On the Way',
        description: 'When leaving restaurant, click "On the Way".',
      },
      {
        title: 'Near Arrival',
        description: 'When approaching address, update status to "Near Arrival".',
      },
      {
        title: 'Delivered',
        description: 'After delivering order, click "Delivered".',
      },
      {
        title: 'Confirm Delivery',
        description: 'Can request signature or photo as delivery confirmation.',
      },
    ],
  },
};

export const platformAdminContent: Record<string, GuideContentSection> = {
  'platform-admin-manage-restaurants': {
    id: 'platform-admin-manage-restaurants',
    title: 'Manage Restaurants',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Comprehensive control panel to manage all registered restaurants on the platform.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Admin Permissions</h3>
          <ul className="space-y-2">
            <li>• View list of all restaurants</li>
            <li>• Approve new registrations</li>
            <li>• Suspend or cancel accounts</li>
            <li>• View statistics for each restaurant</li>
            <li>• Send bulk notifications</li>
            <li>• Provide technical support</li>
          </ul>
        </div>
      </div>
    ),
  },

  'platform-admin-manage-subscriptions': {
    id: 'platform-admin-manage-subscriptions',
    title: 'Manage Subscriptions and Billing',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Complete management of restaurant subscriptions and payments.
        </p>
      </div>
    ),
    steps: [
      {
        title: 'View Subscriptions',
        description: 'List of all active and expired subscriptions.',
      },
      {
        title: 'Modify Plans',
        description: 'Ability to upgrade or downgrade any restaurant plan.',
      },
      {
        title: 'Manage Payments',
        description: 'View payment history and invoices.',
      },
      {
        title: 'Process Refunds',
        description: 'Handle refund requests.',
      },
    ],
  },

  'platform-admin-platform-analytics': {
    id: 'platform-admin-platform-analytics',
    title: 'Comprehensive Platform Analytics',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Complete overview of entire platform performance.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Business Metrics</h3>
            <ul className="space-y-2">
              <li>• Total revenue</li>
              <li>• Number of active restaurants</li>
              <li>• Monthly growth rate</li>
              <li>• Customer retention rate</li>
              <li>• Average subscription value</li>
            </ul>
          </div>

          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Usage Metrics</h3>
            <ul className="space-y-2">
              <li>• Total orders</li>
              <li>• Active users</li>
              <li>• AI features usage</li>
              <li>• AR features usage</li>
              <li>• Customer satisfaction rate</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  'platform-admin-system-management': {
    id: 'platform-admin-system-management',
    title: 'System Management and Maintenance',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Advanced tools for platform management and maintenance.
        </p>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">⚠️ Critical Tasks</h3>
          <ul className="space-y-2">
            <li>• Monitor system health</li>
            <li>• Manage backups</li>
            <li>• Security updates</li>
            <li>• Handle critical errors</li>
            <li>• Database management</li>
          </ul>
        </div>
      </div>
    ),
  },
};


export const advancedFeaturesContent: Record<string, GuideContentSection> = {
  'advanced-features-ai-effective': {
    id: 'advanced-features-ai-effective',
    title: 'Using AI Assistant Effectively',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Tips and tricks to get the best results from the AI assistant.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Best Practices</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Be Specific:</strong> "I want a spicy vegetarian dish without onions" is better than "I want food"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Mention Restrictions:</strong> Tell the assistant about allergies or dietary restrictions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Ask for Alternatives:</strong> "What are the cheaper alternatives?"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Inquire About Ingredients:</strong> "Does this dish contain peanuts?"</span>
            </li>
          </ul>
        </div>
      </div>
    ),
  },

  'advanced-features-ar-optimization': {
    id: 'advanced-features-ar-optimization',
    title: 'Optimizing AR Experience',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Tips for getting the best possible AR experience.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm">
              <li>• Use good lighting</li>
              <li>• Choose a flat surface</li>
              <li>• Move phone slowly</li>
              <li>• Ensure stable connection</li>
              <li>• Clean camera lens</li>
            </ul>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">For Restaurant Owners</h3>
            <ul className="space-y-2 text-sm">
              <li>• Use optimized 3D models</li>
              <li>• Compress textures</li>
              <li>• Test models before publishing</li>
              <li>• Use realistic lighting</li>
              <li>• Maintain correct scale</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  'advanced-features-data-analysis': {
    id: 'advanced-features-data-analysis',
    title: 'Advanced Data Analysis',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Use data to make informed decisions and improve performance.
        </p>

        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Key Performance Indicators (KPIs)</h3>
          <ul className="space-y-2">
            <li>• <strong>Conversion Rate:</strong> Percentage of visitors who place orders</li>
            <li>• <strong>Average Order Value:</strong> Average customer spending</li>
            <li>• <strong>Return Rate:</strong> Percentage of returning customers</li>
            <li>• <strong>Preparation Time:</strong> Average order preparation time</li>
            <li>• <strong>Customer Satisfaction:</strong> Average ratings</li>
          </ul>
        </div>
      </div>
    ),
  },

  'advanced-features-integrations': {
    id: 'advanced-features-integrations',
    title: 'Integration with External Systems',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Connect SmartDine with your existing systems for a seamless experience.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Available Integrations</h3>
          <ul className="space-y-2">
            <li>• Point of Sale (POS) systems</li>
            <li>• Accounting systems</li>
            <li>• Inventory management systems</li>
            <li>• External delivery platforms</li>
            <li>• CRM systems</li>
            <li>• Marketing tools</li>
          </ul>
        </div>
      </div>
    ),
  },
};

export const faqContent: Record<string, GuideContentSection> = {
  'faq-general': {
    id: 'faq-general',
    title: 'General Questions',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">What is SmartDine?</h3>
            <p className="text-muted-foreground">
              SmartDine is a comprehensive SaaS platform for restaurant management that combines digital QR menus,
              AI assistant, AR display, and advanced dashboards.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Do I need a special app?</h3>
            <p className="text-muted-foreground">
              No, customers can access the menu directly from their phone browser by scanning a QR code.
              No app download required.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Does the system support Arabic?</h3>
            <p className="text-muted-foreground">
              Yes, the system fully supports both Arabic and English with easy switching.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">How long does setup take?</h3>
            <p className="text-muted-foreground">
              You can set up your restaurant and add a basic menu in less than an hour.
              Full staff training takes 2-3 hours.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  'faq-technical': {
    id: 'faq-technical',
    title: 'Technical Questions',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">What are the technical requirements?</h3>
            <p className="text-muted-foreground">
              You only need a stable internet connection and smart devices (phones or tablets).
              The system works on all modern browsers.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Does AR work on all devices?</h3>
            <p className="text-muted-foreground">
              AR works on most modern phones (iOS 12+ and Android 8+).
              For unsupported devices, an alternative photo gallery is displayed.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Is the data secure?</h3>
            <p className="text-muted-foreground">
              Yes, we use SSL/TLS encryption for all data and follow best security practices.
              Data is protected with daily backups.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">What happens if internet goes down?</h3>
            <p className="text-muted-foreground">
              The system saves data locally and syncs automatically when connection returns.
              Ongoing orders won't be affected.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  'faq-billing': {
    id: 'faq-billing',
    title: 'Billing Questions',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">How does billing work?</h3>
            <p className="text-muted-foreground">
              Billing is monthly or annual based on your choice. Annual payment saves 20%.
              Automatically charged to your registered card.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Can I change my plan?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade anytime. Upgrades are immediate,
              downgrades apply at the start of next billing cycle.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Are there additional fees?</h3>
            <p className="text-muted-foreground">
              No, the advertised price includes all features. No hidden fees or additional costs.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">What is the refund policy?</h3>
            <p className="text-muted-foreground">
              We offer a full refund within 30 days if you're not satisfied with the service.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  'faq-support': {
    id: 'faq-support',
    title: 'Support Questions',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">How do I contact support?</h3>
            <p className="text-muted-foreground">
              You can contact us via email, live chat, or phone.
              Support hours: 9 AM - 9 PM (7 days a week).
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">What is the response time?</h3>
            <p className="text-muted-foreground">
              Basic: within 24 hours | Pro: within 4 hours | Enterprise: within 1 hour
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Is training available?</h3>
            <p className="text-muted-foreground">
              Yes, we provide free online training for all plans.
              Enterprise plan includes on-site training.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Is there a user guide?</h3>
            <p className="text-muted-foreground">
              Yes, this comprehensive guide is always available, plus tutorial videos and detailed articles.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};


export const troubleshootingContent: Record<string, GuideContentSection> = {
  'troubleshooting-login-issues': {
    id: 'troubleshooting-login-issues',
    title: 'Troubleshooting Login Issues',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          If you're having trouble logging in, try these solutions:
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ Forgot Password</h3>
            <ol className="space-y-2 text-sm">
              <li>1. Click "Forgot Password?" on the login page</li>
              <li>2. Enter your email address</li>
              <li>3. Open the reset email in your inbox</li>
              <li>4. Click the link and create a new password</li>
            </ol>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ "Invalid Credentials"</h3>
            <ul className="space-y-2 text-sm">
              <li>• Make sure email is typed correctly</li>
              <li>• Check that Caps Lock is not on</li>
              <li>• Try copying and pasting password</li>
              <li>• Clear browser cache</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ "Account Suspended"</h3>
            <p className="text-sm">
              Your account may be suspended due to non-payment or terms violation.
              Contact support to resolve the issue.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  'troubleshooting-qr-issues': {
    id: 'troubleshooting-qr-issues',
    title: 'Troubleshooting QR Code Issues',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          If the QR code isn't working properly, try these solutions:
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ Camera Won't Read Code</h3>
            <ul className="space-y-2 text-sm">
              <li>• Clean camera lens</li>
              <li>• Ensure adequate lighting</li>
              <li>• Hold phone steady 10-15 cm away</li>
              <li>• Make sure code is not damaged or faded</li>
              <li>• Try a different angle</li>
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ "Invalid QR Code"</h3>
            <p className="text-sm mb-2">
              The code may be old or cancelled. Solutions:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Contact restaurant staff</li>
              <li>• Request a new QR code</li>
              <li>• Make sure you're at the correct restaurant</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ Link Won't Open</h3>
            <ul className="space-y-2 text-sm">
              <li>• Check internet connection</li>
              <li>• Try a different browser</li>
              <li>• Clear cache</li>
              <li>• Restart phone</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  'troubleshooting-ar-issues': {
    id: 'troubleshooting-ar-issues',
    title: 'Troubleshooting AR Issues',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          If AR feature isn't working properly, try these solutions:
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ "AR Not Supported"</h3>
            <p className="text-sm mb-2">
              Your device may not support AR. Requirements:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• iOS 12 or newer (iPhone 6S+)</li>
              <li>• Android 8 or newer with ARCore</li>
              <li>• Modern browser (Chrome, Safari)</li>
              <li>• Camera access permission</li>
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ Model Won't Appear</h3>
            <ul className="space-y-2 text-sm">
              <li>• Make sure camera permission is granted</li>
              <li>• Move phone slowly to scan area</li>
              <li>• Use a flat surface</li>
              <li>• Check internet speed</li>
              <li>• Reload page</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ Model Moves or Disappears</h3>
            <ul className="space-y-2 text-sm">
              <li>• Use better lighting</li>
              <li>• Avoid shiny surfaces</li>
              <li>• Hold phone steady</li>
              <li>• Reposition model</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  'troubleshooting-payment-issues': {
    id: 'troubleshooting-payment-issues',
    title: 'Troubleshooting Payment Issues',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          If you're having payment issues, try these solutions:
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ "Payment Declined"</h3>
            <ul className="space-y-2 text-sm">
              <li>• Check card balance</li>
              <li>• Verify card information is correct</li>
              <li>• Check expiration date</li>
              <li>• Ensure correct CVV code</li>
              <li>• Try another card</li>
              <li>• Contact your bank</li>
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ "Payment Processing Error"</h3>
            <ul className="space-y-2 text-sm">
              <li>• Retry after a few minutes</li>
              <li>• Clear browser cache</li>
              <li>• Try a different browser</li>
              <li>• Check internet connection</li>
              <li>• Contact support</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">❌ "Charged Twice"</h3>
            <p className="text-sm">
              If charged twice, don't worry. One amount will be automatically refunded within 3-5 business days.
              If this doesn't happen, contact support with your order number.
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">✓ Alternative Payment Methods</h3>
            <p className="text-sm">
              If the issue persists, you can use:
            </p>
            <ul className="space-y-2 text-sm mt-2">
              <li>• Cash on delivery</li>
              <li>• PayPal</li>
              <li>• Apple Pay / Google Pay</li>
              <li>• Bank transfer</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
};

// Export all content combined
export const allGuideContent = {
  ...kitchenStaffContent,
  ...deliveryPersonnelContent,
  ...platformAdminContent,
  ...advancedFeaturesContent,
  ...faqContent,
  ...troubleshootingContent,
};
