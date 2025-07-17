/**
 * Environment Configuration
 * Validates and provides type-safe access to environment variables
 */

import { AppConfig } from '@/types';

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

function validateEnvVar(name: string, value: string | undefined, required = true): string {
  if (!value) {
    if (required) {
      throw new ConfigError(`Missing required environment variable: ${name}`);
    }
    return '';
  }
  return value;
}

function validateUrl(name: string, value: string | undefined, required = true): string {
  const url = validateEnvVar(name, value, required);
  if (url && url !== 'your_supabase_url' && !url.startsWith('http')) {
    throw new ConfigError(`Invalid URL format for ${name}: ${url}`);
  }
  return url;
}

function validateNodeEnv(value: string | undefined): 'development' | 'production' | 'test' {
  const nodeEnv = value || 'development';
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    throw new ConfigError(`Invalid NODE_ENV: ${nodeEnv}`);
  }
  return nodeEnv as 'development' | 'production' | 'test';
}

export const config: AppConfig = {
  API_BASE_URL: validateUrl('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL, false) || 'http://localhost:8000',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  RETELL_API_KEY: process.env.RETELL_API_KEY || '',
  NODE_ENV: validateNodeEnv(process.env.NODE_ENV),
};

// Debug logging
console.log('🔍 Debug - Environment variables:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Final API_BASE_URL:', config.API_BASE_URL);

// Runtime validation
export function validateConfig(): void {
  console.log('🔧 Validating configuration...');
  
  const errors: string[] = [];
  
  // Check critical configuration
  if (!config.API_BASE_URL) {
    errors.push('API_BASE_URL is required');
  }
  
  // In production, require more strict validation
  if (config.NODE_ENV === 'production') {
    if (!config.SUPABASE_URL || config.SUPABASE_URL === 'your_supabase_url') {
      errors.push('SUPABASE_URL is required in production');
    }
    if (!config.SUPABASE_ANON_KEY || config.SUPABASE_ANON_KEY === 'your_supabase_anon_key') {
      errors.push('SUPABASE_ANON_KEY is required in production');
    }
  }
  
  if (errors.length > 0) {
    throw new ConfigError(`Configuration validation failed:\n${errors.join('\n')}`);
  }
  
  console.log('✅ Configuration validated successfully');
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`🌐 API Base URL: ${config.API_BASE_URL}`);
  console.log(`🗄️  Supabase: ${config.SUPABASE_URL && config.SUPABASE_URL !== 'your_supabase_url' ? 'Configured' : 'Not configured'}`);
  console.log(`📞 Retell: ${config.RETELL_API_KEY ? 'Configured' : 'Not configured'}`);
}

// Helper functions for common configuration patterns
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';

export const getApiUrl = (path: string): string => {
  const baseUrl = config.API_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const features = {
  enableDevtools: isDevelopment,
  enableAnalytics: isProduction,
  enableLogging: isDevelopment || isProduction,
  enableRetellIntegration: !!config.RETELL_API_KEY,
  enableSupabaseIntegration: !!(config.SUPABASE_URL && config.SUPABASE_URL !== 'your_supabase_url' && config.SUPABASE_ANON_KEY),
};

// Initialize and validate on import
try {
  validateConfig();
} catch (error) {
  console.error('❌ Configuration Error:', error.message);
  if (isProduction) {
    throw error;
  }
}