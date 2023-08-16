import {
  IAbstractProvider,
  IProviderOption,
  ISocialProvider,
  SDKConfig,
} from './interfaces';

import { loadScript } from '../helper';

export abstract class SocialProviderFactory implements IAbstractProvider {
  /**
   * Factory for creating a new social provider
   */
  public abstract factoryProvider(): ISocialProvider;

  /**
   * Get the social provider access token
   */
  public abstract getAccessToken(): void;
  sdkConfig: SDKConfig = {
    client_id: '',
    scope: '',
    callback: this.onSuccess,
    error_callback: this.onError,
  };
  option: IProviderOption = {
    fetchProfile: false,
    onResolved: () => {},
    onRejected: () => {},
  };

  private static instance: SocialProviderFactory;

  public static getInstance<T extends SocialProviderFactory>(
    this: new () => T,
  ): T {
    if (!SocialProviderFactory.instance) {
      SocialProviderFactory.instance = new this();
    }
    return SocialProviderFactory.instance as T;
  }

  public loadProviderSDK() {
    const provider = this.factoryProvider();
    return loadScript({
      src: provider.sdkSrc,
      onLoad: provider.onScriptLoaded,
    });
  }

  public async getCurrentUser(
    accessToken: string,
  ): Promise<Record<string, string | number | object>> {
    const provider = this.factoryProvider();
    if (provider.profileUrl) {
      try {
        const response = await fetch(provider.profileUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.status === 200) {
          const user = await response.json();
          return user;
        }
      } catch (error) {
        console.error(`Cannot get current user`, error);
        provider.onError(error as Error);
      }
    }
    return {};
  }

  public initialize(config: SDKConfig, option: IProviderOption) {
    console.log('Initializing provider with configuration:', {
      config,
      option,
    });
    this.setSDKConfig(config)
      .assertSDKConfig()
      .setProviderOption(option)
      .loadProviderSDK();
  }

  public setSDKConfig(config: SDKConfig) {
    this.sdkConfig = {
      ...this.sdkConfig,
      ...config,
    };
    return this;
  }

  public setProviderOption(option: IProviderOption) {
    this.option = {
      ...this.option,
      ...option,
    };
    return this;
  }

  async onSuccess(tokenResponse: google.accounts.oauth2.TokenResponse) {
    if (this.option.fetchProfile) {
      const user = await this.getCurrentUser(tokenResponse.access_token);
      this.option.onResolved({
        data: tokenResponse,
        user,
      });
    } else {
      this.option.onResolved({ data: tokenResponse });
    }
    return;
  }

  onError(error: google.accounts.oauth2.ClientConfigError) {
    this.option.onRejected(error);
    return;
  }

  // PRIVATE HELPER FUNCTIONS
  private assertSDKConfig() {
    const REQUIRED_FIELDS: Array<keyof SDKConfig> = [
      'client_id',
      'error_callback',
      'callback',
      'scope',
    ];
    for (let i = 0; i < REQUIRED_FIELDS.length; i++) {
      if (!this.sdkConfig[REQUIRED_FIELDS[i]]) {
        throw new Error(`${REQUIRED_FIELDS[i]} is required but not provided`);
      }
    }
    return this;
  }
}
