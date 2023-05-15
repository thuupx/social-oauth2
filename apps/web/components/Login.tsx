'use client';

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
    />
  );
}
