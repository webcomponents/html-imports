# HTMLImports

HTMLImports <b>v0</b> implementation, copied from https://github.com/webcomponents/webcomponentsjs/tree/v0


HTML Imports: a way to include and reuse HTML documents via other HTML documents ([spec](https://w3c.github.io/webcomponents/spec/imports/)).

In native HTML Imports, document.currentScript.ownerDocument references the import document itself. In the polyfill use document._currentScript.ownerDocument (note the underscore).
