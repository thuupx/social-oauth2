import { SocialProviderFactory } from '../../SocialProviderFactory';
import {
  ProviderType,
  SocialClient,
  SocialProvider
} from '../../interfaces';

export class GoogleProviderFactory
  extends SocialProviderFactory
  implements SocialProvider
{
  name = ProviderType.Google;
  sdkSrc = 'https://accounts.google.com/gsi/client';
  profileUrl = 'https://www.googleapis.com/oauth2/v3/userinfo?alt=json';
  client?: SocialClient;

  constructor() {
    super();
    this.onScriptLoaded = this.onScriptLoaded.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  //#region  Abstract methods implementation
  public factoryProvider() {
    return this;
  }

  public getAccessToken() {
    this.assertClient();
    this.client!.requestAccessToken();
  }

  //#endregion

  public onScriptLoaded() {
    console.log('SDK Loaded');
    const client = window.google.accounts.oauth2.initTokenClient({
      ...this.sdkConfig,
      callback: this.onSuccess,
      error_callback: this.onError,
    });
    this.client = client;
  }

  //#region  private methods
  /**
   * Ensure that the client is initialized
   */
  private assertClient() {
    if (!this.client) {
      throw new Error(`Cannot initialize SDK client`);
    }
  }

  //#endregion
}
