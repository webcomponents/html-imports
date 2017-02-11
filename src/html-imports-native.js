/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(scope => {
  'use strict';

  const importSelector = 'link[rel=import]';
  const loaded = Symbol('loaded');

  const whenImportsReady = callback => {
    let imports = document.querySelectorAll(importSelector);
    let pending = imports.length;
    if (!pending) {
      callback();
    } else {
      imports.forEach(imp => whenImportReady(imp, () => {
        if (--pending === 0) {
          callback();
        }
      }));
    }
  };

  const whenImportReady = (imp, callback) => {
    if (imp[loaded]) {
      callback();
    } else {
      const onLoadingDone = () => {
        imp.removeEventListener('load', onLoadingDone);
        imp.removeEventListener('error', onLoadingDone);
        imp[loaded] = true;
        callback();
      };
      imp.addEventListener('load', onLoadingDone);
      imp.addEventListener('error', onLoadingDone);
    }
  };

  const whenReady = callback => {
    if (document.readyState !== 'loading') {
      whenImportsReady(callback);
    } else {
      const stateChanged = () => {
        if (document.readyState !== 'loading') {
          document.removeEventListener('readystatechange', stateChanged);
          whenImportsReady(callback);
        }
      }
      document.addEventListener('readystatechange', stateChanged);
    }
  };

  const importForElement = el => {
    return el.ownerDocument === document ? null : el.ownerDocument;
  };

  // Check for imports that might already be done loading by the time this
  // script is actually executed. Native imports are blocking, so the ones
  // available in the document by this time should already have failed
  // or have .import defined.
  document.querySelectorAll(importSelector).forEach(imp =>
    (imp[loaded] = (!imp.import || imp.import.readyState !== 'loading')));

  // Listen for load/error events to capture dynamically added scripts.
  const onLoadingDone = event => {
    const imp = event.target;
    if (imp.matches(importSelector)) {
      imp[loaded] = true;
    }
  };
  document.addEventListener('load', onLoadingDone, true);
  document.addEventListener('error', onLoadingDone, true);

  // Support 'HTMLImportsLoaded' firing when all imports are ready, so that the
  // same code can be used under both the polyfill and native implementation.
  whenReady(() => document.dispatchEvent(new CustomEvent('HTMLImportsLoaded', {
    cancelable: true,
    bubbles: true
  })));

  // export
  scope.useNative = true;
  scope.whenReady = whenReady;
  scope.importForElement = importForElement;
})(window.HTMLImports = (window.HTMLImports || {}));
