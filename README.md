# OAuth2 authorization with extendable, customizable social providers for modern web applications

## How to use?

### ReactJS/NextJS

Prebuilt social login buttons are available in `@social-oauth2/react` package

Usage:

```tsx
import { ResolvedResult } from '@social-oauth2/core';
import { GoogleLoginButton } from '@social-oauth2/ui';

export function LoginComponent() {
  const handleResolved = (result: ResolvedResult) => {
    const { data, user } = result;
    console.log('Data: ', data);
    console.log('User: ', user);
  };

  const handleRejected = (error: Error) => {
    console.error('Error: ', error);
  };

  return (
    <GoogleLoginButton
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      scope="email profile"
      onResolved={handleResolved}
      onRejected={handleRejected}
      btnProps={{ width: '50px', height: '100px' }}
    />
  );
}

```

### Other Framework/Vanilla JS application/Custom Authorization server/service

Coming in the future, very welcome to contribute to the project

## How to add new your own provider?

- Write a class that extends `SocialProviderFactory` abstract class and
  implements `SocialProvider`
- Adding your own logic for your provider

Example:

```tsx
import {
  ProviderType,
  SocialProvider,
  SocialProviderFactory,
} from '@social-oauth2/core';

// TODO: Handle your own custom providers
export class CustomProviderFactory
  extends SocialProviderFactory
  implements SocialProvider
{
  name: ProviderType;
  sdkSrc: string;
  profileUrl: string;

  constructor() {
    super();
    // Need to bind these functions to corresponding caller
    // in this case, `this` is `CustomProviderFactory`
    this.onScriptLoaded = this.onScriptLoaded.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  onScriptLoaded(event: Event): void {
    // Handle after loading the provider SDK script.
  }
  public factoryProvider(): SocialProvider {
    return this;
  }
  public getAccessToken(): void {
    // Handle get access token based on your auth server/service
  }
}

```

Then, register above provider to the registry factory by calling `registry` from `@social-oauth2/core` package.

```ts
import { registry } from '@social-oauth2/core';
import { CustomProviderFactory } from 'path/to/CustomProviderFactory';

registry.registerFactory(
  ProviderType.CustomProvider,
  CustomProviderFactory.getInstance(),
);

```

Write your components

```tsx
import {
  ProviderType,
  SocialLoginButtonProps,
  registry,
} from '@social-oauth2/core';

const factory = registry.getFactory(ProviderType.CustomProvider);

export function CustomLoginButton({
  buttonProps = {},
  ...restProps
}: SocialLoginButtonProps) {
  const onResolved = restProps.onResolved;
  const onRejected = restProps.onRejected;

  factory.factoryProvider().initialize(
    {
      client_id: restProps.clientId,
      scope: restProps.scope,
      ...other_sdk_config
    },
    { onResolved, onRejected },
  );

  return (
    <button {...buttonProps} onClick={factory.getAccessToken}>
      {buttonProps.children ? <>{buttonProps.children}</> : 'Login with Custom Provider'}
    </button>
  );
}
```

### Demo

Please refer to the `apps/web` app for more information about how to use
