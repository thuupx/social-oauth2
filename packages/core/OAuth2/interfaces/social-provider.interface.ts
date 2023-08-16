import { IAbstractProvider } from './abstract-provider.interface';

import { ProviderType } from '../enums/provider-type.enum';

export interface ISocialProvider extends IAbstractProvider {
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
