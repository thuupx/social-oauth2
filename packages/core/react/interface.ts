import { ButtonHTMLAttributes, ScriptHTMLAttributes } from 'react';
import { ResolvedResult } from '../OAuth2';

export interface ScriptProps extends ScriptHTMLAttributes<HTMLScriptElement> {
  strategy?: 'afterInteractive' | 'lazyOnload';
  id?: string;
  onLoad?: (e: any) => void;
  onReady?: () => void | null;
  onError?: (e: any) => void;
  children?: React.ReactNode;
}

export interface SocialProps {
  clientId: string;
  scope: string;
}

export type SocialButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type SocialLoginButtonProps = SocialProps & {
  buttonProps?: SocialButtonProps;
  onResolved: (data: ResolvedResult) => void;
  onRejected: (error: Error) => void;
};
