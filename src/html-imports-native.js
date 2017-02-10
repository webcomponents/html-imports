(scope => {
  'use strict';

  const importForElement = el => {
    return el.ownerDocument === document ? null : el.ownerDocument;
  };
  const whenReady = callback => {
    // When native imports boot, the are "ready" the first rAF after
    // the document becomes interactive, so wait for the correct state change.
    if (document.readyState !== 'interactive') {
      const once = () => {
        document.removeEventListener('readystatechange', once);
        window.HTMLImports.whenReady(callback);
      }
      document.addEventListener('readystatechange', once);
    } else {
      // TODO(sorvell): Ideally `whenReady` should return synchronously
      // when imports are not pending but this would require a more
      // robust implementation that should probably be a small complementary
      // library available via the html-imports polyfill.
      requestAnimationFrame(callback);
    }
  };

  whenReady(() => document.dispatchEvent(new CustomEvent('HTMLImportsLoaded', {
    cancelable: true,
    bubbles: true
  })));

  // export
  scope.useNative = true;
  scope.whenReady = whenReady;
  scope.importForElement = importForElement;
})(window.HTMLImports = (window.HTMLImports || {}));
