import { SocialProviderFactory } from '../SocialProviderFactory';
import { ProviderType } from '../interfaces';
import { GoogleProviderFactory } from './Google/GoogleProviderFactory';

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
    this.factories.set(type, factory);
  }

  getFactory(type: ProviderType): SocialProviderFactory {
    const factory = this.factories.get(type);
    if (!factory) {
      throw new Error(`No factory registered for type ${type}`);
    }
    return factory;
  }
}

export const registry = SocialProviderFactoryRegistry.getInstance();

registry.registerFactory(
  ProviderType.Google,
  GoogleProviderFactory.getInstance(),
);
