import { useState } from 'react';
import { Header, Footer } from '@/components/layout';
import { FloatingShapes } from '@/components/common';
import { GuideSidebar, guideSections } from '@/components/guide/GuideSidebar';
import { GuideContent } from '@/components/guide/GuideContent';
import type { GuideContentSection } from '@/components/guide/GuideContent';
import { GuideSearch } from '@/components/guide/GuideSearch';
import type { SearchResult } from '@/components/guide/GuideSearch';
import { GuideProgress } from '@/components/guide/GuideProgress';
import { GuideBreadcrumbs } from '@/components/guide/GuideBreadcrumbs';
import { GuideFeedback } from '@/components/guide/GuideFeedback';
import { GuideTableOfContents } from '@/components/guide/GuideTableOfContents';
import { GuideShareButtons } from '@/components/guide/GuideShareButtons';
import { GuideFloatingIcons } from '@/components/guide/GuideFloatingIcons';
import { gettingStartedContent, customerJourneyContent, restaurantOwnerContent } from '@/data/guideContent';
import { allGuideContent } from '@/data/guideContentExtended';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * User Guide Page Component
 * 
 * Comprehensive user guide for SmartDine platform with:
 * - Sidebar navigation
 * - Search functionality
 * - Progress tracking
 * - Table of contents
 * - Breadcrumbs
 * - Feedback system
 * - Share functionality
 * - Print-friendly version
 * - Floating shapes background
 */
export default function UserGuide() {
  const [activeSection, setActiveSection] = useState('getting-started-intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showTOC, setShowTOC] = useState(true);

  // Combine all content
  const allContent: Record<string, GuideContentSection> = {
    ...gettingStartedContent,
    ...customerJourneyContent,
    ...restaurantOwnerContent,
    ...allGuideContent,
  };

  // Create searchable content
  const searchableContent: SearchResult[] = Object.values(allContent).map((section) => {
    const parentSection = guideSections.find((s) =>
      section.id.startsWith(s.id)
    );
    return {
      id: section.id,
      title: section.title,
      section: parentSection?.title || '',
      excerpt: typeof section.content === 'string' ? section.content : section.title,
    };
  });

  // Get current section content
  const currentContent = allContent[activeSection] || allContent['getting-started-intro'];

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const parts = activeSection.split('-');
    const parentId = parts.slice(0, 2).join('-');
    const parent = guideSections.find((s) => s.id === parentId);
    
    return [
      { label: 'Home', onClick: () => setShowTOC(true) },
      { label: parent?.title || '', onClick: () => setActiveSection(parentId) },
      { label: currentContent.title },
    ];
  };

  // Get navigation (previous/next)
  const getNavigation = () => {
    const allSectionIds = Object.keys(allContent);
    const currentIndex = allSectionIds.indexOf(activeSection);
    
    return {
      previous: currentIndex > 0 ? allSectionIds[currentIndex - 1] : null,
      next: currentIndex < allSectionIds.length - 1 ? allSectionIds[currentIndex + 1] : null,
    };
  };

  const navigation = getNavigation();

  // Handle section change
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowTOC(false);
    setSidebarOpen(false);
    
    // Mark as completed
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total sections
  const totalSections = Object.keys(allContent).length;

  // Get current section title for breadcrumbs
  const currentSectionTitle = guideSections.find((s) =>
    activeSection.startsWith(s.id)
  )?.title || '';

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating Shapes Background */}
      <FloatingShapes count={8} />
      
      {/* Floating Icons based on current section */}
      {!showTOC && <GuideFloatingIcons sectionId={activeSection} />}

      <Header variant="public" />

      <div className="flex h-[calc(100vh-4rem)] relative z-10">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <GuideSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 bg-card border-l border-border shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                <GuideSidebar
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-5xl p-6 space-y-8">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="gap-2"
              >
                <Menu className="w-4 h-4" />
                Menu
              </Button>
            </div>

            {/* Search Bar */}
            <GuideSearch
              onResultClick={handleSectionChange}
              searchableContent={searchableContent}
            />

            {/* Progress Indicator */}
            <GuideProgress
              totalSections={totalSections}
              completedSections={completedSections}
              currentSection={currentSectionTitle}
            />

            {/* Table of Contents or Content */}
            {showTOC ? (
              <GuideTableOfContents onSectionClick={handleSectionChange} />
            ) : (
              <>
                {/* Breadcrumbs */}
                <GuideBreadcrumbs items={getBreadcrumbs()} />

                {/* Share Buttons */}
                <div className="flex justify-end">
                  <GuideShareButtons sectionTitle={currentContent.title} />
                </div>

                {/* Content */}
                <GuideContent section={currentContent} />

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-border">
                  {navigation.previous ? (
                    <Button
                      variant="outline"
                      onClick={() => handleSectionChange(navigation.previous!)}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}
                  {navigation.next ? (
                    <Button
                      onClick={() => handleSectionChange(navigation.next!)}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Feedback */}
                <GuideFeedback sectionId={activeSection} />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
