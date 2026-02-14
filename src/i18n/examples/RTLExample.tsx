import { ChevronRight, Search, Home, ArrowLeft } from 'lucide-react';
import { RTLIcon } from '@/components/common/RTLIcon';
import { useTranslation } from '@/i18n';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * RTL Example Component
 * 
 * Demonstrates proper RTL support implementation including:
 * - Logical properties (start/end instead of left/right)
 * - RTL-aware icons
 * - Proper text alignment
 * - Form input handling
 */
export function RTLExample() {
  const { t, language, changeLanguage, isRTL } = useTranslation();

  return (
    <div className="space-y-8 p-8">
      {/* Language Switcher */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          {t('common.language')}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => changeLanguage('en')}
            variant={language === 'en' ? 'default' : 'outline'}
          >
            English
          </Button>
          <Button
            onClick={() => changeLanguage('ar')}
            variant={language === 'ar' ? 'default' : 'outline'}
          >
            العربية
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-start">
          Current direction: {isRTL ? 'RTL' : 'LTR'}
        </p>
      </Card>

      {/* Logical Properties Example */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          Logical Properties
        </h2>
        <div className="space-y-4">
          {/* Using ms (margin-inline-start) */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded" />
            <div className="ms-4 text-start">
              <p className="font-medium">Using ms-4 (margin-inline-start)</p>
              <p className="text-sm text-muted-foreground">
                Automatically adapts to text direction
              </p>
            </div>
          </div>

          {/* Using ps (padding-inline-start) */}
          <div className="ps-4 border-s-4 border-primary">
            <p className="font-medium text-start">Using ps-4 and border-s-4</p>
            <p className="text-sm text-muted-foreground text-start">
              Padding and border on the start side
            </p>
          </div>

          {/* Using text-start */}
          <div>
            <p className="text-start font-medium">text-start alignment</p>
            <p className="text-end font-medium">text-end alignment</p>
          </div>
        </div>
      </Card>

      {/* RTL Icons Example */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          RTL-Aware Icons
        </h2>
        <div className="space-y-4">
          {/* Directional icons that mirror */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <RTLIcon icon={ChevronRight} className="w-5 h-5" />
              <span>ChevronRight (mirrors)</span>
            </div>
            <div className="flex items-center gap-2">
              <RTLIcon icon={ArrowLeft} className="w-5 h-5" />
              <span>ArrowLeft (mirrors)</span>
            </div>
          </div>

          {/* Non-directional icons that don't mirror */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <RTLIcon icon={Search} className="w-5 h-5" />
              <span>Search (no mirror)</span>
            </div>
            <div className="flex items-center gap-2">
              <RTLIcon icon={Home} className="w-5 h-5" />
              <span>Home (no mirror)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Example */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          Navigation Menu
        </h2>
        <nav className="space-y-2">
          {['Home', 'Products', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center justify-between p-3 rounded hover:bg-accent"
            >
              <span className="text-start">{item}</span>
              <RTLIcon icon={ChevronRight} className="w-4 h-4" />
            </a>
          ))}
        </nav>
      </Card>

      {/* Form Example */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          Form Inputs
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-start">
              {t('common.name')}
            </label>
            <Input placeholder={t('common.enterName')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-start">
              {t('common.email')}
            </label>
            <Input type="email" placeholder={t('common.enterEmail')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-start">
              {t('common.search')}
            </label>
            <div className="relative">
              <Input
                placeholder={t('common.searchPlaceholder')}
                className="ps-10"
              />
              <div className="absolute start-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Breadcrumbs Example */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          Breadcrumbs
        </h2>
        <nav className="flex items-center gap-2 text-sm">
          <a href="#" className="hover:underline">
            Home
          </a>
          <RTLIcon icon={ChevronRight} className="w-4 h-4 text-muted-foreground" />
          <a href="#" className="hover:underline">
            Products
          </a>
          <RTLIcon icon={ChevronRight} className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Current Page</span>
        </nav>
      </Card>

      {/* Layout Example */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          Sidebar Layout
        </h2>
        <div className="flex gap-4 border rounded p-4">
          {/* Sidebar - automatically goes to right in RTL */}
          <aside className="w-48 border-e pe-4">
            <h3 className="font-medium mb-2 text-start">Sidebar</h3>
            <ul className="space-y-1 text-sm">
              <li className="text-start">Item 1</li>
              <li className="text-start">Item 2</li>
              <li className="text-start">Item 3</li>
            </ul>
          </aside>

          {/* Main content */}
          <main className="flex-1 ps-4">
            <h3 className="font-medium mb-2 text-start">Main Content</h3>
            <p className="text-sm text-muted-foreground text-start">
              This layout automatically adapts to RTL. The sidebar moves to the
              right side in RTL mode.
            </p>
          </main>
        </div>
      </Card>

      {/* Card Grid Example */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-start">
          Card Grid
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <Card key={num} className="p-4">
              <h3 className="font-medium mb-2 text-start">Card {num}</h3>
              <p className="text-sm text-muted-foreground text-start mb-4">
                Card description goes here
              </p>
              <Button variant="outline" className="w-full">
                <span>Learn More</span>
                <RTLIcon icon={ChevronRight} className="w-4 h-4 ms-2" />
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
