'use client';
import { useEffect, useRef } from 'react';
import {
  LoadCache,
  ScriptProps,
  loadLazyScript,
  loadScript,
} from '@social-oauth2/core';

export default function Script(props: ScriptProps): JSX.Element | null {
  const {
    id,
    src = '',
    onLoad = () => {},
    onReady = null,
    strategy = 'afterInteractive',
    onError,
    ...restProps
  } = props;
  const hasOnReadyEffectCalled = useRef(false);

  useEffect(() => {
    const cacheKey = id || src;
    if (!hasOnReadyEffectCalled.current) {
      // Run onReady if script has loaded before but component is re-mounted
      if (onReady && cacheKey && LoadCache.has(cacheKey)) {
        onReady();
      }

      hasOnReadyEffectCalled.current = true;
    }
  }, [onReady, id, src]);

  const hasLoadScriptEffectCalled = useRef(false);

  useEffect(() => {
    if (!hasLoadScriptEffectCalled.current) {
      if (strategy === 'afterInteractive') {
        loadScript(props);
      } else if (strategy === 'lazyOnload') {
        loadLazyScript(props);
      }

      hasLoadScriptEffectCalled.current = true;
    }
  }, [props, strategy]);

  return null;
}
