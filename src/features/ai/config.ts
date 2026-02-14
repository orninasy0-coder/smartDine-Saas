/**
 * AI Configuration
 * Centralized configuration for AI features
 */

export const aiConfig = {
  // OpenAI API Configuration
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4',
  maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '500'),
  temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7'),

  // Feature Flags
  isEnabled: import.meta.env.VITE_FEATURE_AI_ASSISTANT === 'true',

  // Validation
  isConfigured(): boolean {
    return Boolean(
      this.apiKey && 
      this.apiKey !== 'sk-dev-placeholder' &&
      this.apiKey.startsWith('sk-')
    );
  },

  // Get configuration status
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      isConfigured: this.isConfigured(),
      model: this.model,
      maxTokens: this.maxTokens,
      temperature: this.temperature,
    };
  },

  // Validate configuration
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isEnabled) {
      errors.push('AI Assistant feature is disabled');
    }

    if (!this.apiKey) {
      errors.push('OpenAI API key is not set');
    } else if (this.apiKey === 'sk-dev-placeholder') {
      errors.push('OpenAI API key is using placeholder value');
    } else if (!this.apiKey.startsWith('sk-')) {
      errors.push('OpenAI API key format is invalid');
    }

    if (!this.model) {
      errors.push('AI model is not configured');
    }

    if (this.maxTokens <= 0) {
      errors.push('Max tokens must be greater than 0');
    }

    if (this.temperature < 0 || this.temperature > 2) {
      errors.push('Temperature must be between 0 and 2');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

// Log configuration status in development
if (import.meta.env.DEV) {
  const status = aiConfig.getStatus();
  console.log('🤖 AI Configuration:', status);

  const validation = aiConfig.validate();
  if (!validation.valid) {
    console.warn('⚠️ AI Configuration Issues:', validation.errors);
  }
}
