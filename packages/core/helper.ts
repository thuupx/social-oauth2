import { ScriptProps } from './react/interface';

export const ScriptCache = new Map();
export const LoadCache = new Set();

const ignoreProps = [
  'onLoad',
  'onReady',
  'dangerouslySetInnerHTML',
  'children',
  'onError',
  'strategy',
];

export const loadScript = (props: ScriptProps): void => {
  const {
    src,
    id,
    onLoad = () => {},
    onReady = null,
    dangerouslySetInnerHTML,
    children = '',
    strategy = 'afterInteractive',
    onError,
  } = props;

  const cacheKey = id || src;

  // Script has already loaded
  if (cacheKey && LoadCache.has(cacheKey)) {
    return;
  }

  // Contents of this script are already loading/loaded
  if (ScriptCache.has(src)) {
    LoadCache.add(cacheKey);
    ScriptCache.get(src).then(onLoad, onError);
    return;
  }

  /** Execute after the script first loaded */
  const afterLoad = () => {
    // Run onReady for the first time after load event
    if (onReady) {
      onReady();
    }
    // add cacheKey to LoadCache when load successfully
    LoadCache.add(cacheKey);
  };
  if (typeof document === 'undefined') return;
  const el = document.createElement('script');

  const loadPromise = new Promise<void>((resolve, reject) => {
    el.addEventListener('load', function (e) {
      resolve();
      if (onLoad) {
        onLoad.call(this, e);
      }
      afterLoad();
    });
    el.addEventListener('error', function (e) {
      reject(e);
    });
  }).catch(function (e) {
    if (onError) {
      onError(e);
    }
  });

  if (dangerouslySetInnerHTML) {
    el.innerHTML = (dangerouslySetInnerHTML.__html as string) || '';

    afterLoad();
  } else if (children) {
    el.textContent =
      typeof children === 'string'
        ? children
        : Array.isArray(children)
        ? children.join('')
        : '';

    afterLoad();
  } else if (src) {
    el.src = src;

    ScriptCache.set(src, loadPromise);
  }

  for (const [k, value] of Object.entries(props)) {
    if (value === undefined || ignoreProps.includes(k)) {
      continue;
    }

    const attr = k.toLowerCase();
    el.setAttribute(attr, value);
  }

  el.setAttribute('data-strategy', strategy);

  document.body.appendChild(el);
};

export function loadLazyScript(props: ScriptProps) {
  if (document.readyState === 'complete') {
    requestIdleCallback(() => loadScript(props));
  } else {
    window.addEventListener('load', () => {
      requestIdleCallback(() => loadScript(props));
    });
  }
}

export function handleClientScriptLoad(props: ScriptProps) {
  const { strategy = 'afterInteractive' } = props;
  if (strategy === 'lazyOnload') {
    window.addEventListener('load', () => {
      requestIdleCallback(() => loadScript(props));
    });
  } else {
    loadScript(props);
  }
}
