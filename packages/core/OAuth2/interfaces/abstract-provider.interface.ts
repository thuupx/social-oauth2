import { IProviderOption } from './provider-option.interface';

export type SDKConfig = google.accounts.oauth2.TokenClientConfig;

export type SocialClient = google.accounts.oauth2.TokenClient;

export interface IAbstractProvider {
  /**
   * SDK configuration, based on the provider SDK, please refer to their documentation.
   */
  sdkConfig: SDKConfig;

  /**
   * Client side configuration
   */
  option: IProviderOption;

  /**
   * Load SDK with pre-configured configuration and initialize the provider
   */
  initialize(config: SDKConfig, option: IProviderOption): void;
  setSDKConfig(config: SDKConfig): void;
  onSuccess(...args: unknown[]): void;
  onError(error: Error): void;
}
