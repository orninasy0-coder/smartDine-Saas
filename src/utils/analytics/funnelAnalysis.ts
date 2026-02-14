/**
 * Funnel Analysis Utilities
 * Analyze conversion funnels and identify drop-off points
 */

export interface FunnelStageData {
  name: string;
  label: string;
  count: number;
  timestamp?: number;
}

export interface DropOffPoint {
  fromStage: string;
  toStage: string;
  fromStageLabel: string;
  toStageLabel: string;
  dropOffCount: number;
  dropOffRate: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestions: string[];
}

export interface FunnelAnalysisResult {
  stages: Array<{
    name: string;
    label: string;
    count: number;
    percentage: number;
    dropOffRate?: number;
    conversionRate: number;
  }>;
  dropOffPoints: DropOffPoint[];
  overallConversionRate: number;
  totalUsers: number;
  criticalDropOffs: DropOffPoint[];
}

/**
 * Analyze funnel data and identify drop-off points
 */
export function analyzeFunnel(stages: FunnelStageData[]): FunnelAnalysisResult {
  if (stages.length === 0) {
    return {
      stages: [],
      dropOffPoints: [],
      overallConversionRate: 0,
      totalUsers: 0,
      criticalDropOffs: [],
    };
  }

  const totalUsers = stages[0].count;
  const completedUsers = stages[stages.length - 1].count;
  const overallConversionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;

  // Calculate stage metrics
  const analyzedStages = stages.map((stage, index) => {
    const percentage = totalUsers > 0 ? (stage.count / totalUsers) * 100 : 0;
    const conversionRate = totalUsers > 0 ? (stage.count / totalUsers) * 100 : 0;

    let dropOffRate: number | undefined;
    if (index > 0) {
      const previousCount = stages[index - 1].count;
      dropOffRate = previousCount > 0 ? ((previousCount - stage.count) / previousCount) * 100 : 0;
    }

    return {
      name: stage.name,
      label: stage.label,
      count: stage.count,
      percentage,
      dropOffRate,
      conversionRate,
    };
  });

  // Identify drop-off points
  const dropOffPoints: DropOffPoint[] = [];
  for (let i = 0; i < stages.length - 1; i++) {
    const currentStage = stages[i];
    const nextStage = stages[i + 1];
    const dropOffCount = currentStage.count - nextStage.count;
    const dropOffRate = currentStage.count > 0 ? (dropOffCount / currentStage.count) * 100 : 0;

    if (dropOffRate > 0) {
      const severity = getDropOffSeverity(dropOffRate);
      const suggestions = getDropOffSuggestions(currentStage.name, nextStage.name, dropOffRate);

      dropOffPoints.push({
        fromStage: currentStage.name,
        toStage: nextStage.name,
        fromStageLabel: currentStage.label,
        toStageLabel: nextStage.label,
        dropOffCount,
        dropOffRate,
        severity,
        suggestions,
      });
    }
  }

  // Filter critical drop-offs (>30% drop-off rate)
  const criticalDropOffs = dropOffPoints.filter((point) => point.severity === 'critical');

  return {
    stages: analyzedStages,
    dropOffPoints,
    overallConversionRate,
    totalUsers,
    criticalDropOffs,
  };
}

/**
 * Determine severity of drop-off rate
 */
function getDropOffSeverity(dropOffRate: number): 'critical' | 'high' | 'medium' | 'low' {
  if (dropOffRate >= 50) return 'critical';
  if (dropOffRate >= 30) return 'high';
  if (dropOffRate >= 15) return 'medium';
  return 'low';
}

/**
 * Get suggestions for improving drop-off points
 */
function getDropOffSuggestions(fromStage: string, toStage: string, dropOffRate: number): string[] {
  const suggestions: string[] = [];

  // Generic suggestions based on drop-off rate
  if (dropOffRate >= 50) {
    suggestions.push('Critical drop-off detected. Immediate investigation required.');
    suggestions.push('Consider A/B testing different approaches to this transition.');
  } else if (dropOffRate >= 30) {
    suggestions.push('High drop-off rate. Review user experience at this stage.');
  }

  // Stage-specific suggestions
  const stageTransition = `${fromStage}_to_${toStage}`;

  switch (stageTransition) {
    case 'qr_scan_to_menu_view':
      suggestions.push('Ensure QR code redirects quickly to menu.');
      suggestions.push('Check for loading performance issues.');
      break;

    case 'menu_view_to_dish_view':
      suggestions.push('Improve dish card visual appeal and information.');
      suggestions.push('Add more prominent call-to-action buttons.');
      break;

    case 'dish_view_to_add_to_cart':
      suggestions.push('Simplify the add-to-cart process.');
      suggestions.push('Make pricing and availability more clear.');
      suggestions.push('Consider adding social proof (ratings, reviews).');
      break;

    case 'add_to_cart_to_cart_view':
      suggestions.push('Make cart icon more visible.');
      suggestions.push('Add confirmation feedback when items are added.');
      break;

    case 'cart_view_to_order_confirm':
      suggestions.push('Reduce friction in checkout process.');
      suggestions.push('Clarify delivery/pickup options.');
      suggestions.push('Display total cost clearly upfront.');
      break;

    case 'order_confirm_to_order_complete':
      suggestions.push('Investigate payment gateway issues.');
      suggestions.push('Simplify payment form fields.');
      suggestions.push('Add trust signals (security badges, reviews).');
      break;

    case 'landing_view_to_pricing_view':
      suggestions.push('Make pricing information more accessible.');
      suggestions.push('Add clear value proposition on landing page.');
      break;

    case 'pricing_view_to_signup_start':
      suggestions.push('Simplify pricing tiers and make benefits clearer.');
      suggestions.push('Add social proof and testimonials.');
      suggestions.push('Offer free trial or demo.');
      break;

    case 'signup_start_to_signup_complete':
      suggestions.push('Reduce number of required form fields.');
      suggestions.push('Add progress indicator for multi-step signup.');
      suggestions.push('Provide clear error messages and validation.');
      break;

    case 'widget_view_to_chat_start':
      suggestions.push('Make AI assistant more inviting and accessible.');
      suggestions.push('Add example prompts or suggestions.');
      break;

    case 'recommendation_view_to_recommendation_accept':
      suggestions.push('Improve recommendation relevance and personalization.');
      suggestions.push('Add more context about why items are recommended.');
      break;

    case 'ar_button_view_to_ar_open':
      suggestions.push('Make AR button more prominent and appealing.');
      suggestions.push('Add preview or explanation of AR feature.');
      break;

    case 'model_load_to_interaction':
      suggestions.push('Optimize 3D model loading time.');
      suggestions.push('Add loading progress indicator.');
      suggestions.push('Provide fallback for slow connections.');
      break;

    default:
      suggestions.push('Review user feedback and session recordings for this transition.');
      suggestions.push('Consider adding help text or tooltips.');
  }

  return suggestions;
}

/**
 * Compare two funnel analyses to identify trends
 */
export function compareFunnels(
  current: FunnelAnalysisResult,
  previous: FunnelAnalysisResult
): {
  conversionRateChange: number;
  improvingStages: string[];
  decliningStages: string[];
  newCriticalDropOffs: DropOffPoint[];
} {
  const conversionRateChange = current.overallConversionRate - previous.overallConversionRate;

  const improvingStages: string[] = [];
  const decliningStages: string[] = [];

  current.stages.forEach((currentStage) => {
    const previousStage = previous.stages.find((s) => s.name === currentStage.name);
    if (previousStage) {
      const conversionChange = currentStage.conversionRate - previousStage.conversionRate;
      if (conversionChange > 5) {
        improvingStages.push(currentStage.label);
      } else if (conversionChange < -5) {
        decliningStages.push(currentStage.label);
      }
    }
  });

  // Find new critical drop-offs
  const previousCriticalStages = new Set(
    previous.criticalDropOffs.map((d) => `${d.fromStage}_${d.toStage}`)
  );
  const newCriticalDropOffs = current.criticalDropOffs.filter(
    (d) => !previousCriticalStages.has(`${d.fromStage}_${d.toStage}`)
  );

  return {
    conversionRateChange,
    improvingStages,
    decliningStages,
    newCriticalDropOffs,
  };
}

/**
 * Calculate time-based funnel metrics
 */
export function calculateFunnelTiming(stages: FunnelStageData[]): {
  averageTimeToComplete: number;
  stageTimings: Array<{
    fromStage: string;
    toStage: string;
    averageTime: number;
  }>;
} {
  const stageTimings: Array<{
    fromStage: string;
    toStage: string;
    averageTime: number;
  }> = [];

  for (let i = 0; i < stages.length - 1; i++) {
    const currentStage = stages[i];
    const nextStage = stages[i + 1];

    if (currentStage.timestamp !== undefined && nextStage.timestamp !== undefined) {
      const averageTime = nextStage.timestamp - currentStage.timestamp;
      stageTimings.push({
        fromStage: currentStage.name,
        toStage: nextStage.name,
        averageTime,
      });
    }
  }

  const totalTime = stageTimings.reduce((sum, timing) => sum + timing.averageTime, 0);
  const averageTimeToComplete = stageTimings.length > 0 ? totalTime / stageTimings.length : 0;

  return {
    averageTimeToComplete,
    stageTimings,
  };
}
