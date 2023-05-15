import {
  ProviderType,
  SocialProvider,
  SocialProviderFactory,
} from '@social-oauth2/core';

// TODO: Handle your own custom providers
export class TwitterProviderFactory
  extends SocialProviderFactory
  implements SocialProvider
{
  name: ProviderType;
  sdkSrc: string;
  profileUrl: string;
  onScriptLoaded(event: Event): void {
    throw new Error('Method not implemented.');
  }
  public factoryProvider(): SocialProvider {
    throw new Error('Method not implemented.');
  }
  public getAccessToken(): void {
    throw new Error('Method not implemented.');
  }
}
