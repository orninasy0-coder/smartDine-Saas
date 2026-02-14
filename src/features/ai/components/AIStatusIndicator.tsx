/**
 * AIStatusIndicator Component
 * Shows AI availability status
 */

import React from 'react';
import { Bot, AlertCircle, CheckCircle } from 'lucide-react';
import { aiConfig } from '../config';

export const AIStatusIndicator: React.FC = () => {
  const status = aiConfig.getStatus();
  const validation = aiConfig.validate();

  if (!status.isEnabled) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Bot className="w-4 h-4" />
      {validation.valid ? (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>AI متاح</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-amber-600">
          <AlertCircle className="w-4 h-4" />
          <span>AI غير متاح</span>
        </div>
      )}
    </div>
  );
};
