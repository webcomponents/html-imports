/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
var script = document.querySelector('script[src*="html-imports-loader.js"]');
var newScript = document.createElement('script');
var forcePolyfill = location.search.indexOf('force=true') !== -1;
var useNative = 'import' in document.createElement('link');
if (useNative && !forcePolyfill) {
  newScript.src = script.src.replace('html-imports-loader.js', 'src/html-imports-native.js');
} else {
  newScript.src = script.src.replace('html-imports-loader.js', 'html-imports.min.js');
}
script.parentNode.replaceChild(newScript, script);
