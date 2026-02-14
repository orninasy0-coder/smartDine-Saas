/**
 * SuggestedActions Component Example
 * Demonstrates usage of the SuggestedActions component
 */

import React, { useState } from 'react';
import { SuggestedActions, type SuggestedAction } from './SuggestedActions';
import { Card } from '@/components/ui/card';
import { Coffee, Pizza, IceCream } from 'lucide-react';

export const SuggestedActionsExample: React.FC = () => {
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Example 1: Default actions
  const handleDefaultAction = (query: string) => {
    setSelectedQuery(query);
    console.log('Selected query:', query);
  };

  // Example 2: Custom actions with icons
  const customActions: SuggestedAction[] = [
    {
      id: 'coffee',
      label: 'قهوة',
      query: 'أريد قهوة ساخنة',
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      id: 'pizza',
      label: 'بيتزا',
      query: 'أريد بيتزا كبيرة',
      icon: <Pizza className="w-4 h-4" />,
    },
    {
      id: 'dessert',
      label: 'حلويات',
      query: 'ما هي الحلويات المتوفرة؟',
      icon: <IceCream className="w-4 h-4" />,
    },
  ];

  const handleCustomAction = (query: string) => {
    setSelectedQuery(query);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">SuggestedActions Component</h1>
        <p className="text-muted-foreground">
          Quick action buttons for common AI assistant queries
        </p>
      </div>

      {/* Example 1: Default Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Example 1: Default Actions</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Using the default set of suggested actions
        </p>
        <SuggestedActions onActionClick={handleDefaultAction} />
        {selectedQuery && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Selected Query:</strong> {selectedQuery}
            </p>
          </div>
        )}
      </Card>

      {/* Example 2: Custom Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Example 2: Custom Actions</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Using custom actions with icons
        </p>
        <SuggestedActions
          onActionClick={handleCustomAction}
          customActions={customActions}
          isLoading={isLoading}
        />
        {selectedQuery && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Selected Query:</strong> {selectedQuery}
            </p>
            {isLoading && (
              <p className="text-sm text-muted-foreground mt-2">Loading...</p>
            )}
          </div>
        )}
      </Card>

      {/* Example 3: Loading State */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Example 3: Loading State</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Actions are disabled when loading
        </p>
        <SuggestedActions
          onActionClick={() => {}}
          isLoading={true}
        />
      </Card>

      {/* Usage Code */}
      <Card className="p-6 bg-muted">
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <pre className="text-sm overflow-x-auto">
          {`import { SuggestedActions } from '@/features/ai/components';

// Basic usage with default actions
<SuggestedActions
  onActionClick={(query) => console.log(query)}
/>

// With custom actions
const customActions = [
  {
    id: 'custom1',
    label: 'Custom Action',
    query: 'Custom query text',
    icon: <Icon className="w-4 h-4" />,
  },
];

<SuggestedActions
  onActionClick={handleAction}
  customActions={customActions}
  isLoading={false}
/>`}
        </pre>
      </Card>
    </div>
  );
};
