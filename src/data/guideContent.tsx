import type { GuideContentSection } from '@/components/guide/GuideContent';

// Getting Started Content
export const gettingStartedContent: Record<string, GuideContentSection> = {
  'getting-started-intro': {
    id: 'getting-started-intro',
    title: 'Introduction to SmartDine Platform',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Welcome to <strong>SmartDine</strong> - a comprehensive SaaS platform for smart restaurant management.
          We offer an integrated solution that combines digital QR menus, AI assistant,
          Augmented Reality (AR) dish display, and comprehensive dashboards to manage all aspects of your restaurant.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Key Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Digital QR Menus:</strong> Interactive contactless menus accessible by scanning a QR code</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Smart AI Assistant:</strong> Personalized recommendations and dish selection assistance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>3D AR Display:</strong> Preview dishes in augmented reality before ordering</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Comprehensive Management:</strong> Dashboards for restaurant, kitchen, delivery, and admin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Advanced Analytics:</strong> Detailed reports and statistics to improve performance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span><strong>Multi-language Support:</strong> Interface in Arabic and English</span>
            </li>
          </ul>
        </div>

        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Who Benefits from SmartDine?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Restaurant Owners</h4>
              <p className="text-sm text-muted-foreground">
                Complete management of menu, staff, orders, and analytics from one place
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Customers</h4>
              <p className="text-sm text-muted-foreground">
                Seamless ordering experience with smart recommendations and AR dish preview
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Kitchen Staff</h4>
              <p className="text-sm text-muted-foreground">
                Receive orders instantly and update their status easily
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Delivery Personnel</h4>
              <p className="text-sm text-muted-foreground">
                Manage deliveries with interactive maps and real-time tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  'getting-started-registration': {
    id: 'getting-started-registration',
    title: 'How to Register on the Platform',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Registration on SmartDine is quick and easy. Follow these steps to get started:
        </p>
      </div>
    ),
    steps: [
      {
        title: 'Visit Registration Page',
        description: 'Go to the homepage and click the "Register" button at the top of the page.',
      },
      {
        title: 'Enter Basic Information',
        description: 'Enter your full name, email, and phone number. Make sure to use a valid email for verification.',
      },
      {
        title: 'Choose a Strong Password',
        description: 'Create a strong password containing uppercase and lowercase letters, numbers, and special characters. Must be at least 8 characters.',
      },
      {
        title: 'Select Account Type',
        description: 'Choose your account type: Restaurant Owner, Kitchen Staff, Delivery Personnel, or Platform Admin.',
      },
      {
        title: 'Verify Email',
        description: 'You will receive a verification email. Click the link to verify your account.',
      },
      {
        title: 'Complete Profile',
        description: 'After verification, complete your profile information and start using the platform.',
      },
    ],
  },

  'getting-started-subscription': {
    id: 'getting-started-subscription',
    title: 'Choose the Right Subscription Plan',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          We offer three subscription plans designed to suit your restaurant's needs:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">Basic</h3>
              <div className="text-3xl font-bold text-primary mt-2">$29<span className="text-lg text-muted-foreground">/month</span></div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Digital QR menu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Up to 50 dishes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Basic dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Email support</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">Perfect for small restaurants and cafes</p>
          </div>

          <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>
            <div>
              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="text-3xl font-bold text-primary mt-2">$79<span className="text-lg text-muted-foreground">/month</span></div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>All Basic features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Unlimited dishes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>AI Assistant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>AR dish display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">For medium and large restaurants</p>
          </div>

          <div className="border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <div className="text-3xl font-bold text-primary mt-2">Custom</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>All Pro features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Multiple restaurants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Custom API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>24/7 support</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">For chains and large enterprises</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">💡 Tip</h3>
          <p className="text-sm">
            All plans come with a <strong>14-day free trial</strong> with no credit card required.
            You can upgrade or downgrade at any time.
          </p>
        </div>
      </div>
    ),
  },

  'getting-started-setup': {
    id: 'getting-started-setup',
    title: 'Setting Up Your First Account',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          After registration and choosing a plan, it's time to set up your account and start using the platform:
        </p>
      </div>
    ),
    steps: [
      {
        title: 'Set Up Restaurant Information',
        description: 'Enter restaurant name, address, phone number, and operating hours. This information will be displayed to customers.',
      },
      {
        title: 'Upload Restaurant Logo',
        description: 'Upload your restaurant logo in high quality. Preferably use a PNG image with transparent background, 512x512 pixels.',
      },
      {
        title: 'Create Basic Categories',
        description: 'Create main menu categories such as: Appetizers, Main Courses, Desserts, Beverages.',
      },
      {
        title: 'Add First Dishes',
        description: 'Start by adding 5-10 popular dishes with images, prices, and descriptions.',
      },
      {
        title: 'Generate QR Codes',
        description: 'Create QR codes for tables. You can print them and place them on tables.',
      },
      {
        title: 'Add Staff Members',
        description: 'Add kitchen and delivery staff and set their permissions.',
      },
      {
        title: 'Test the System',
        description: 'Try scanning a QR code and placing a test order to ensure everything works correctly.',
      },
    ],
  },
};

// Customer Journey Content
export const customerJourneyContent: Record<string, GuideContentSection> = {};

// Restaurant Owner Content  
export const restaurantOwnerContent: Record<string, GuideContentSection> = {};
