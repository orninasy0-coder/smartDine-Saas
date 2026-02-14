import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Terms Version Information
 */
export interface TermsVersion {
  version: string;
  effectiveDate: string;
  title: string;
  summary: string;
}

/**
 * Terms Acceptance Record
 */
export interface TermsAcceptance {
  version: string;
  acceptedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Terms State
 */
interface TermsState {
  currentVersion: string;
  acceptedVersions: TermsAcceptance[];
  hasAcceptedCurrent: boolean;
  lastPromptedAt: string | null;
}

/**
 * Terms Actions
 */
interface TermsActions {
  acceptTerms: (version: string, metadata?: Partial<TermsAcceptance>) => void;
  hasAcceptedVersion: (version: string) => boolean;
  getLatestAcceptance: () => TermsAcceptance | null;
  needsAcceptance: () => boolean;
  resetAcceptance: () => void;
  setCurrentVersion: (version: string) => void;
  updateLastPrompted: () => void;
}

type TermsStore = TermsState & TermsActions;

/**
 * Current Terms Version
 * Update this when terms are updated
 */
const CURRENT_TERMS_VERSION = '1.0.0';

/**
 * Terms Version Store
 *
 * Manages terms of service acceptance tracking with version history
 */
export const useTermsStore = create<TermsStore>()(
  persist(
    (set, get) => ({
      // State
      currentVersion: CURRENT_TERMS_VERSION,
      acceptedVersions: [],
      hasAcceptedCurrent: false,
      lastPromptedAt: null,

      // Actions
      acceptTerms: (version, metadata = {}) => {
        const acceptance: TermsAcceptance = {
          version,
          acceptedAt: new Date().toISOString(),
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent || navigator.userAgent,
        };

        set((state) => ({
          acceptedVersions: [...state.acceptedVersions, acceptance],
          hasAcceptedCurrent: version === state.currentVersion,
          lastPromptedAt: new Date().toISOString(),
        }));
      },

      hasAcceptedVersion: (version) => {
        const { acceptedVersions } = get();
        return acceptedVersions.some((a) => a.version === version);
      },

      getLatestAcceptance: () => {
        const { acceptedVersions } = get();
        if (acceptedVersions.length === 0) return null;
        return acceptedVersions[acceptedVersions.length - 1];
      },

      needsAcceptance: () => {
        const { currentVersion, hasAcceptedCurrent } = get();
        return !hasAcceptedCurrent;
      },

      resetAcceptance: () =>
        set({
          acceptedVersions: [],
          hasAcceptedCurrent: false,
          lastPromptedAt: null,
        }),

      setCurrentVersion: (version) =>
        set((state) => ({
          currentVersion: version,
          hasAcceptedCurrent: state.acceptedVersions.some(
            (a) => a.version === version
          ),
        })),

      updateLastPrompted: () =>
        set({
          lastPromptedAt: new Date().toISOString(),
        }),
    }),
    {
      name: 'terms-acceptance-storage',
    }
  )
);

/**
 * Terms Version History
 * Maintain a history of all terms versions
 */
export const TERMS_VERSION_HISTORY: TermsVersion[] = [
  {
    version: '1.0.0',
    effectiveDate: '2024-01-01',
    title: 'Initial Terms of Service',
    summary: 'Initial release of SmartDine Terms of Service covering platform usage, data handling, and user responsibilities.',
  },
];

/**
 * Get terms version by version number
 */
export const getTermsVersion = (version: string): TermsVersion | undefined => {
  return TERMS_VERSION_HISTORY.find((v) => v.version === version);
};

/**
 * Get all terms versions sorted by date (newest first)
 */
export const getAllTermsVersions = (): TermsVersion[] => {
  return [...TERMS_VERSION_HISTORY].sort(
    (a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
  );
};
