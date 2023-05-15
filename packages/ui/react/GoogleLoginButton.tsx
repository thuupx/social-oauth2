'use client';
import {
  ProviderType,
  SocialLoginButtonProps,
  registry,
} from '@social-oauth2/core';

const factory = registry.getFactory(ProviderType.Google);

export function GoogleLoginButton({
  buttonProps = {},
  ...restProps
}: SocialLoginButtonProps) {
  const onResolved = restProps.onResolved;
  const onRejected = restProps.onRejected;

  factory.factoryProvider().initialize(
    {
      client_id: restProps.clientId,
      scope: restProps.scope,
    },
    { onResolved, onRejected },
  );

  return (
    <button {...buttonProps} onClick={factory.getAccessToken}>
      {buttonProps.children ? <>{buttonProps.children}</> : 'Login with Google'}
    </button>
  );
}
