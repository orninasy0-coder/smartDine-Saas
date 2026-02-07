/**
 * Icon Reference Component
 *
 * Quick reference card showing icon usage examples.
 * Can be used in documentation or developer tools.
 */

import React from 'react';
import { Icon } from './Icon';
import { Home, User, Settings } from './icons';

export const IconReference: React.FC = () => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Icon Usage Examples</h3>

      <div className="space-y-2">
        <div className="text-sm font-medium">Method 1: Icon Component</div>
        <code className="block bg-muted p-2 rounded text-xs">
          {`import { Icon, Home } from '@/components/common';
<Icon icon={Home} size="md" />`}
        </code>
        <div className="flex items-center gap-2">
          <Icon icon={Home} size="xs" />
          <Icon icon={Home} size="sm" />
          <Icon icon={Home} size="md" />
          <Icon icon={Home} size="lg" />
          <Icon icon={Home} size="xl" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Method 2: Direct Import</div>
        <code className="block bg-muted p-2 rounded text-xs">
          {`import { User } from '@/components/common/icons';
<User className="h-5 w-5" />`}
        </code>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <Settings className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">With Colors</div>
        <div className="flex items-center gap-2">
          <Icon icon={Home} className="text-primary" />
          <Icon icon={User} className="text-secondary" />
          <Icon icon={Settings} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
