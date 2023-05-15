export enum ProviderType {
  Google = 'Google',
  LinkedIn = 'LinkedIn',
}

export type ResolvedResult = {
  user?: Record<string, string | number | object>;
  data: object;
};

export type SDKConfig = google.accounts.oauth2.TokenClientConfig;

export interface ProviderOption {
  fetchProfile?: boolean;
  onResolved(result: ResolvedResult): void;
  onRejected(error: Error): void;
}

export interface AbstractProvider {
  /**
   * SDK configuration, based on the provider SDK, please refer to their documentation.
   */
  sdkConfig: SDKConfig;

  /**
   * Client side configuration
   */
  option: ProviderOption;

  /**
   * Load SDK with pre-configured configuration and initialize the provider
   */
  initialize(config: SDKConfig, option: ProviderOption): void;
  setSDKConfig(config: SDKConfig): void;
  onSuccess(...args: unknown[]): void;
  onError(error: Error): void;
}

export interface SocialProvider extends AbstractProvider {
  /**
   * Name of the social provider.
   */
  name: ProviderType;

  /**
   * SDK script provided by the provider.
   */
  sdkSrc: string;

  /**
   * API endpoint of the provider where the profile will be fetched.
   */
  profileUrl: string;

  /**
   * Handle after successful loading of the social provider SDK script.
   */
  onScriptLoaded(event: Event): void;
}

export type SocialClient = google.accounts.oauth2.TokenClient;
