import { ProviderType } from '../enums';
import { SocialProviderFactory } from '../social-provider.factory';
import { GoogleProviderFactory } from './google/google-provider.factory';

export class SocialProviderFactoryRegistry {
  private static instance: SocialProviderFactoryRegistry;
  private factories: Map<ProviderType, SocialProviderFactory> = new Map();

  static getInstance(): SocialProviderFactoryRegistry {
    if (!SocialProviderFactoryRegistry.instance) {
      SocialProviderFactoryRegistry.instance =
        new SocialProviderFactoryRegistry();
    }
    return SocialProviderFactoryRegistry.instance;
  }

  registerFactory(type: ProviderType, factory: SocialProviderFactory): void {
    if (this.factories.has(type)) {
      throw new Error(`Factory for type ${type} already registered`);
    }
    this.factories.set(type, factory);
  }

  getFactory<T extends SocialProviderFactory>(type: ProviderType): T {
    const factory = this.factories.get(type);
    if (!factory) {
      throw new Error(`No factory registered for type ${type}`);
    }
    return factory as T;
  }
}

export const socialProviderFactoryRegistry =
  SocialProviderFactoryRegistry.getInstance();

socialProviderFactoryRegistry.registerFactory(
  ProviderType.Google,
  GoogleProviderFactory.getInstance(),
);
