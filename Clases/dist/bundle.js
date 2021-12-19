(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbol = void 0;
class Arbol {
    constructor() {
        this.id_n = 1;
    }
    tour(node) {
        var concat = '';
        if (node.id == 0) {
            node.id = this.id_n;
            this.id_n++;
        }
        if (node.token.includes('"')) {
            var aux = node.lexema.replace(/"/gi, '');
            concat += node.id + '[label="' + aux + '" fillcolor="#ad85e4" shape="box"];\n';
        }
        else {
            concat += node.id + '[label="' + node.token + '" fillcolor="#ad85e4" shape="box"];\n';
        }
        node.hijos.forEach(element => {
            concat += node.id + '->' + this.id_n + ';\n';
            concat += this.tour(element);
        });
        return concat;
    }
}
exports.Arbol = Arbol;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = void 0;
class AST {
    constructor(instrucciones) {
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }
}
exports.AST = AST;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errores = void 0;
class Errores {
    constructor(tipo, descripcion, linea, column) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.column = column;
    }
}
exports.Errores = Errores;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo = void 0;
class Nodo {
    constructor(t, l) {
        this.id = 0;
        this.id = 0;
        this.token = t;
        this.lexema = l;
        this.hijos = new Array();
    }
    addHijo(nodito) {
        this.hijos.push(nodito);
    }
    getToken() {
        return this.token;
    }
}
exports.Nodo = Nodo;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Temporales = exports.Resultado3D = exports.Temporal = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Temporal {
    constructor(nombre) {
        this.nombre = nombre;
        this.utilizado = false;
    }
    obtener() {
        return this.nombre;
    }
    utilizar() {
        this.utilizado = true;
        return this.nombre;
    }
}
exports.Temporal = Temporal;
class Resultado3D {
    constructor() {
        this.etiquetasV = [];
        this.etiquetasF = [];
        this.saltos = [];
        this.breaks = [];
        this.codigo3D = "";
        this.temporal = null;
        this.tipo = Tipo_1.tipo.NULO;
    }
}
exports.Resultado3D = Resultado3D;
class Temporales {
    constructor() {
        this.lista_temporales = [];
        this.contador_temporales = -1;
        this.contador_parametro = -1;
        this.contador_etiquetas = -1;
        this.etiquetaV = "";
        this.etiquetaF = "";
        this.etiquetasV = [];
        this.etiquetasF = [];
        this.pointersG = 0;
    }
    nuevoTemporal() {
        let temp = new Temporal(this.temporal());
        this.lista_temporales.push(temp);
        return temp;
    }
    temporal() {
        this.contador_temporales = this.contador_temporales + 1;
        return "t" + this.contador_temporales;
    }
    parametro() {
        this.contador_parametro = this.contador_parametro + 1;
        return "a" + this.contador_parametro;
    }
    etiqueta() {
        this.contador_etiquetas = this.contador_etiquetas + 1;
        return "L" + this.contador_etiquetas;
    }
    escribirEtiquetas(etiquetas) {
        let res = "";
        etiquetas.forEach((element) => {
            res += element + ":";
        });
        return res + "\n";
    }
    ultimaEtiqueta() {
        return "L" + this.contador_etiquetas;
    }
    saltoCondicional(condicion, etiqueta) {
        return "if " + condicion + " goto " + etiqueta + ";\n";
    }
    saltoIncondicional(etiqueta) {
        return "goto " + etiqueta + ";\n";
    }
    ultimoTemporal() {
        return "t" + this.contador_temporales;
    }
}
exports.Temporales = Temporales;

},{"../TablaSimbolos/Tipo":49}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
class Controller {
    constructor() {
        this.errores = new Array();
        this.consola = "";
        this.texto = "";
    }
    append(aux) {
        this.consola += aux;
    }
    appendT(aux) {
        this.texto += aux;
    }
    recursivo_tablita(entornito, cuerpotabla, contador) {
        let auxS = cuerpotabla;
        let auxC = contador;
        for (let sim of entornito.tabla.values()) {
            auxC += 1;
            auxS += `<tr>
                                <th scope="row">${auxC}</th>
                                <td>${this.getRol(sim)}</td>
                                <td>${this.getNombre(sim)}</td>
                                <td>${this.getTipo(sim)}</td>
                                <td>${entornito.nombre}</td>
                                <td>${this.getValor(sim)}</td>
                                <td>${this.parametros(sim)}</td>
                            </tr>`;
        }
        if (entornito.sig.length > 0) {
            entornito.sig.forEach((element) => {
                auxS = this.recursivo_tablita(element, auxS, auxC);
            });
        }
        return auxS;
    }
    graficar_tErrores() {
        var cuerpotabla = "";
        var contador = 0;
        for (let error of this.errores) {
            contador += 1;
            cuerpotabla += `<tr>
                            <th scope="row">${contador}</th>
                            <td>${error.tipo}</td>
                            <td>${error.linea}</td>
                            <td>${error.column}</td>
                            <td>${error.descripcion}</td>
                           </tr>`;
        }
        return cuerpotabla;
    }
    getValor(sim) {
        if (sim.valor != null) {
            return sim.valor.toString();
        }
        else {
            return "...";
        }
    }
    getTipo(sim) {
        return sim.tipo.stype.toLowerCase();
    }
    getRol(sim) {
        let rol = "";
        switch (sim.simbolo) {
            case 1:
                rol = "variable";
                break;
            case 2:
                rol = "funcion";
                break;
            case 3:
                rol = "metodo";
                break;
            case 4:
                rol = "vector";
                break;
            case 5:
                rol = "lista";
                break;
            case 6:
                rol = "parametro";
                break;
        }
        return rol;
    }
    getNombre(sim) {
        return sim.getIdentificador().toLowerCase();
    }
    getAmbito() {
        return "global";
    }
    parametros(sim) {
        if (sim.lista_params != undefined) {
            return sim.lista_params.length;
        }
        else {
            return "...";
        }
    }
}
exports.Controller = Controller;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArreglo = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AccesoArreglo {
    constructor(identificador, posicion1, posicion2, tipo, esp, esp2, linea, column) {
        this.identificador = identificador;
        this.posicion1 = posicion1;
        this.posicion2 = posicion2;
        this.tipo = tipo;
        this.especial = esp;
        this.especial2 = esp2;
        this.linea = linea;
        this.column = column;
    }
    getTipo(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            if ((id_exists === null || id_exists === void 0 ? void 0 : id_exists.tipo.tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
            }
            else {
                if (this.tipo == false) {
                    let posi = this.posicion1.getValor(controlador, ts, ts_u);
                    if (typeof posi == "number") {
                        if (this.isInt(Number(posi))) {
                            return id_exists.getValor()[posi];
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    if (this.especial != null && this.especial2 != null) {
                        return id_exists.getValor();
                    }
                    else if (this.especial != null && this.especial2 == null) {
                        let posi = this.posicion2.getValor(controlador, ts, ts_u);
                        if (typeof posi == "number") {
                            if (this.isInt(Number(posi))) {
                                if (posi <= id_exists.getValor().lenth) {
                                    let lista_valores = [];
                                    for (let index = 0; index < posi + 1; index++) {
                                        lista_valores.push(id_exists.getValor()[index]);
                                    }
                                    return lista_valores;
                                }
                                else {
                                    let error = new Errores_1.Errores('Semantico', `El valor ${posi}, sobre pasa el limite del arreglo`, this.linea, this.column);
                                    controlador.errores.push(error);
                                }
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else if (this.especial == null && this.especial2 != null) {
                        let posi = this.posicion1.getValor(controlador, ts, ts_u);
                        if (typeof posi == "number") {
                            if (this.isInt(Number(posi))) {
                                let lista_valores = [];
                                for (let index = posi; index < id_exists.getValor().length; index++) {
                                    lista_valores.push(id_exists.getValor()[index]);
                                }
                                return lista_valores;
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let posi = this.posicion1.getValor(controlador, ts, ts_u);
                        let posi2 = this.posicion2.getValor(controlador, ts, ts_u);
                        if (typeof posi == "number") {
                            if (this.isInt(Number(posi))) {
                                if (typeof posi2 == "number") {
                                    if (this.isInt(Number(posi2))) {
                                        if (posi2 <= id_exists.getValor().length) {
                                            let lista_valores = [];
                                            for (let index = posi; index < posi2 + 1; index++) {
                                                lista_valores.push(id_exists.getValor()[index]);
                                            }
                                            return lista_valores;
                                        }
                                        else {
                                            let error = new Errores_1.Errores('Semantico', `El valor ${posi2}, sobre pasa el limite del arreglo`, this.linea, this.column);
                                            controlador.errores.push(error);
                                        }
                                    }
                                    else {
                                        let error = new Errores_1.Errores('Semantico', `El valor ${posi2}, tipo de dato incorrecto`, this.linea, this.column);
                                        controlador.errores.push(error);
                                    }
                                }
                                else {
                                    let error = new Errores_1.Errores('Semantico', `El valor ${posi2}, tipo de dato incorrecto`, this.linea, this.column);
                                    controlador.errores.push(error);
                                }
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                }
            }
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador.identificador}, no se encuentra definida`, this.linea, this.column);
            controlador.errores.push(error);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
}
exports.AccesoArreglo = AccesoArreglo;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Tipo":49}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Nodo_1 = require("../AST/Nodo");
class AccesoStruct {
    constructor(acceso1, acceso2, linea, columna) {
        this.acceso1 = acceso1;
        this.acceso2 = acceso2;
        this.linea = linea;
        this.column = columna;
    }
    getTipo(controlador, ts, ts_u) {
        // let valor = this.getValor(controlador,ts,ts_u);
        let id_exists = ts.getSimbolo(this.acceso1.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        //busco en global
        let entornos = ts.sig;
        let res;
        if (entornos instanceof Array) {
            entornos.forEach(entorno => {
                if (entorno.nombre == this.acceso1.identificador) {
                    let valor = entorno.getSimbolo(this.acceso2.identificador);
                    if (valor != null) {
                        console.log("es: " + valor.valor);
                        res = valor.valor;
                    }
                    return valor;
                }
                return null;
            });
        }
        return res;
    }
    getValorRecursivo(obj, accesos, controlador, ts, ts_u) {
        let temporales = accesos.slice();
        let acceso = temporales[0];
        temporales.shift();
        /*  if(obj.entorno.tabla.size == 0){
                obj.ejecutar(controlador, ts, ts_u);
            }*/
        /*
            if(!obj.entorno.existeEnActual(acceso)){
                let error = new Errores(
                    "Semantico",
                    ` No existe dentro del struct`,
                    this.linea,
                    this.column
                );
                controlador.errores.push(error);
                return
            }
    
            let simbolo = obj.entorno.getSimbolo(acceso);
            if(temporales.length > 0 && simbolo != null){
                if(simbolo.valor instanceof Struct){
                    let struct = simbolo.valor;
                    this.getValorRecursivo(simbolo.valor, temporales,controlador, ts,ts_u );
                }else{
                    let error = new Errores(
                        "Semantico",
                        ` No existe dentro del struct`,
                        this.linea,
                        this.column
                    );
                    controlador.errores.push(error);
                    return
                }
            }else{
                return simbolo?.valor;
            }*/
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("accesoStruct", "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.AccesoStruct = AccesoStruct;

},{"../AST/Nodo":7}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Arreglo {
    // public niveles: Array<Expresion>;
    // public linea: number;
    // public column: number;
    constructor(valores) {
        this.valores = valores;
    }
    getValor(controlador, ts, ts_u) {
        let lista_valores = [];
        this.valores.forEach(element => {
            let valor_condicional = element.getValor(controlador, ts, ts_u);
            lista_valores.push(valor_condicional);
        });
        return lista_valores;
    }
    getTipo(controlador, ts, ts_u) {
    }
    getTipoArreglo(controlador, ts, ts_u, tipoo) {
        let flag = false;
        for (let element of this.valores) {
            let valor_condicional = element.getValor(controlador, ts, ts_u);
            if (typeof valor_condicional == "number") {
                if (this.isInt(Number(valor_condicional))) {
                    if (tipoo.tipo != Tipo_1.tipo.ENTERO) {
                        flag = true;
                        break;
                    }
                }
                else {
                    if (tipoo.tipo != Tipo_1.tipo.DOUBLE) {
                        flag = true;
                        break;
                    }
                }
            }
            else if (typeof valor_condicional == "string") {
                if (this.isChar(String(valor_condicional))) {
                    if (tipoo.tipo != Tipo_1.tipo.CARACTER) {
                        flag = true;
                        break;
                    }
                }
                else {
                    if (tipoo.tipo != Tipo_1.tipo.CADENA) {
                        flag = true;
                        break;
                    }
                }
            }
            else if (typeof valor_condicional == "boolean") {
                if (tipoo.tipo != Tipo_1.tipo.BOOLEAN) {
                    flag = true;
                    break;
                }
            }
            else if (valor_condicional === null) {
                if (tipoo.tipo != Tipo_1.tipo.NULO) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag == false) {
            return tipoo.tipo;
        }
        else {
            return -1;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
}
exports.Arreglo = Arreglo;

},{"../AST/Nodo":7,"../TablaSimbolos/Tipo":49}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Nodo_1 = require("../AST/Nodo");
class Identificador {
    constructor(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.valor;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.identificador, "");
        // padre.addHijo(new Nodo(this.identificador, ""))
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists;
        }
    }
}
exports.Identificador = Identificador;

},{"../AST/Nodo":7}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AritArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class AritArreglo {
    constructor(identificador, posicion1, posicion2, operador, linea, column) {
        this.identificador = identificador;
        this.posicion1 = posicion1;
        this.posicion2 = posicion2;
        this.operador = operador;
        this.linea = linea;
        this.column = column;
    }
    getTipo(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre1;
        let valor_U;
        let id_exists = ts.getSimbolo(this.identificador.identificador);
        if (id_exists != null) {
            if ((id_exists === null || id_exists === void 0 ? void 0 : id_exists.tipo.tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
            }
            else {
                valor_U = id_exists.getValor();
            }
        }
        if (this.posicion2 === false) {
            valor_expre1 = this.posicion1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case '+':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1);
                        }
                        return lista_valores;
                    }
                    else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] + valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) + valor_expre1);
                            }
                            return lista_valores;
                        }
                        else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) + valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '-':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] - valor_expre1);
                        }
                        return lista_valores;
                    }
                    else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] - valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) - valor_expre1);
                            }
                            return lista_valores;
                        }
                        else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) - valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '*':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] * valor_expre1);
                        }
                        return lista_valores;
                    }
                    else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] * valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) * valor_expre1);
                            }
                            return lista_valores;
                        }
                        else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) * valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '/':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] / valor_expre1);
                        }
                        return lista_valores;
                    }
                    else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] / valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) / valor_expre1);
                            }
                            return lista_valores;
                        }
                        else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) / valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '%':
                if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "number") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] % valor_expre1);
                        }
                        return lista_valores;
                    }
                    else if (typeof valor_expre1 === "string") {
                        if (this.isChar(String(valor_expre1))) {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index] % valor_expre1.charCodeAt(0));
                            }
                            return lista_valores;
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_U[0] === "string") {
                    if (this.isChar(String(valor_U[0]))) {
                        if (typeof valor_expre1 === "number") {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                lista_valores.push(valor_U[index].charCodeAt(0) % valor_expre1);
                            }
                            return lista_valores;
                        }
                        else if (typeof valor_expre1 === "string") {
                            if (this.isChar(String(valor_expre1))) {
                                let lista_valores = [];
                                for (let index = 0; index < valor_U.length; index++) {
                                    lista_valores.push(valor_U[index].charCodeAt(0) % valor_expre1.charCodeAt(0));
                                }
                                return lista_valores;
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case 'oparr':
                let lista_valores = [];
                return lista_valores = valor_U.slice();
                break;
            case '&':
                if (typeof valor_U[0] === "string") {
                    if (typeof valor_expre1 === "string") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1);
                        }
                        return lista_valores;
                    }
                    else if (typeof valor_expre1 === "number") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1.toString());
                        }
                        return lista_valores;
                    }
                    else if (typeof valor_expre1 === "boolean") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index] + valor_expre1.toString());
                        }
                        return lista_valores;
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_U[0] === "number") {
                    if (typeof valor_expre1 === "string") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index].toString() + valor_expre1);
                        }
                        return lista_valores;
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_U[0] === "boolean") {
                    if (typeof valor_expre1 === "string") {
                        let lista_valores = [];
                        for (let index = 0; index < valor_U.length; index++) {
                            lista_valores.push(valor_U[index].toString() + valor_expre1);
                        }
                        return lista_valores;
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case '^':
                if (typeof valor_U[0] === "string") {
                    if (typeof valor_expre1 === "number") {
                        if (this.isInt(Number(valor_expre1))) {
                            let lista_valores = [];
                            for (let index = 0; index < valor_U.length; index++) {
                                var sum_concat = "";
                                for (var _i = 0; _i < valor_expre1; _i++) {
                                    sum_concat = sum_concat + valor_U[index];
                                }
                                lista_valores.push(sum_concat);
                            }
                            return lista_valores;
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_U}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador, "");
        if (this.posicion2) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.identificador.recorrer());
        }
        else {
            padre.addHijo(this.identificador.recorrer());
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.posicion1.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
}
exports.AritArreglo = AritArreglo;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":49}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
const Temporales_1 = require("../../AST/Temporales");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
class Aritmetica extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        super(expre1, expre2, expreU, operador, linea, column);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            if (this.isInt(Number(valor))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            if (this.isChar(String(valor))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (valor === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre1;
        let valor_expre2;
        let valor_U;
        if (this.expreU === false) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_U = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.SUMA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 + valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 + valor_expre2.charCodeAt(0);
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) + valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) + valor_expre2.charCodeAt(0);
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.RESTA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 - valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 - valor_expre2.charCodeAt(0);
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) - valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) - valor_expre2.charCodeAt(0);
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.MULT:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 * valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 * valor_expre2.charCodeAt(0);
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) * valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) * valor_expre2.charCodeAt(0);
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.DIV:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 / valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 / valor_expre2.charCodeAt(0);
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) / valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) / valor_expre2.charCodeAt(0);
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.MODULO:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 % valor_expre2;
                    }
                    else if (typeof valor_expre2 === "string") {
                        if (this.isChar(String(valor_expre2))) {
                            return valor_expre1 % valor_expre2.charCodeAt(0);
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "string") {
                    if (this.isChar(String(valor_expre1))) {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1.charCodeAt(0) % valor_expre2;
                        }
                        else if (typeof valor_expre2 === "string") {
                            if (this.isChar(String(valor_expre2))) {
                                return valor_expre1.charCodeAt(0) % valor_expre2.charCodeAt(0);
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.UNARIO:
                if (typeof valor_U === "number") {
                    return -valor_U;
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.CONCATENAR:
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "string") {
                        return valor_expre1 + valor_expre2;
                    }
                    else if (typeof valor_expre2 === "number") {
                        return valor_expre1 + valor_expre2.toString();
                    }
                    else if (typeof valor_expre2 === "boolean") {
                        return valor_expre1 + valor_expre2.toString();
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "string") {
                        return valor_expre1.toString() + valor_expre2;
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else if (typeof valor_expre1 === "boolean") {
                    if (typeof valor_expre2 === "string") {
                        return valor_expre1.toString() + valor_expre2;
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.REPETIR:
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            var sum_concat = "";
                            for (var _i = 0; _i < valor_expre2; _i++) {
                                sum_concat = sum_concat + valor_expre1;
                            }
                            return sum_concat;
                        }
                        else {
                            let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            default:
                break;
        }
    }
    validarLados(recursivo, controlador, ts, ts_u) {
        if (recursivo == 0 && this.expre1.getTipo(controlador, ts, ts_u) == Tipo_1.tipo.ENTERO) {
            return true;
        }
        return false;
    }
    generarOperacionBinario(Temp, controlador, ts, ts_u, signo, recursivo) {
        let valor1;
        let valor2;
        let valor_U;
        if (this.expreU === false) {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        }
        else {
            valor1 = new Temporales_1.Resultado3D();
            valor1.codigo3D = "";
            valor1.temporal = new Temporales_1.Temporal("0");
            valor1.tipo = Tipo_1.tipo.ENTERO;
            valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
        }
        if (valor1 == (null || undefined) || valor2 == (null || undefined))
            return null;
        let resultado = valor1.codigo3D;
        if (resultado != "" && valor2.codigo3D) {
            resultado = resultado + "\n" + valor2.codigo3D;
        }
        else {
            resultado += valor2.codigo3D;
        }
        if (valor1 instanceof Simbolos_1.Simbolos || valor2 instanceof Simbolos_1.Simbolos) {
            resultado = "";
        }
        if (resultado != "") {
            resultado = resultado + "\n";
        }
        let result = new Temporales_1.Resultado3D();
        result.tipo = Tipo_1.tipo.DOUBLE;
        /*if(recursivo==0){
          let temporal = new Temporal(valor1.temporal.utilizar() + " "+ signo+ " "+valor2.temporal.utilizar());
          result.codigo3D = resultado;
          result.temporal = temporal;
          return result;
        }*/
        let temporal = Temp.nuevoTemporal();
        let op = "";
        if (signo == "%") {
            op = temporal.obtener() + '= fmod(' + valor1.temporal.utilizar() + "," + valor2.temporal.utilizar() + ");";
        }
        else {
            if (valor1 instanceof Simbolos_1.Simbolos && valor2 instanceof Simbolos_1.Simbolos == false) {
                let res = this.operacionSimbolosIzq(valor1, valor2, op, temporal, result, signo, Temp, ts);
                op += res.op;
                temporal = res.temporal;
                result.tipo = Tipo_1.tipo.ID;
            }
            else if (valor2 instanceof Simbolos_1.Simbolos && valor1 instanceof Simbolos_1.Simbolos == false) {
                let res = this.operacionSimbolosDer(valor1, valor2, op, temporal, result, signo, Temp, ts);
                op += res.op;
                temporal = res.temporal;
                result.tipo = Tipo_1.tipo.ID;
            }
            else if (valor2 instanceof Simbolos_1.Simbolos && valor1 instanceof Simbolos_1.Simbolos) {
                let res = this.operacionSimbolos(valor1, valor2, op, temporal, result, signo, Temp, ts);
                op += res.op;
                temporal = res.temporal;
            }
            else {
                op = temporal.obtener() + '=' + valor1.temporal.utilizar() + " " + signo + " " + valor2.temporal.utilizar() + ";";
            }
        }
        resultado += op;
        result.codigo3D = resultado;
        result.temporal = temporal;
        return result;
    }
    traducir(Temp, controlador, ts, ts_u) {
        if (this.operador == Operaciones_1.Operador.SUMA) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "+", 0);
        }
        else if (this.operador == Operaciones_1.Operador.RESTA) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "-", 0);
        }
        else if (this.operador == Operaciones_1.Operador.MULT) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "*", 0);
        }
        else if (this.operador == Operaciones_1.Operador.DIV) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "/", 0);
        }
        else if (this.operador == Operaciones_1.Operador.MODULO) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "%", 0);
        }
        else if (this.operador == Operaciones_1.Operador.UNARIO) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "-", 0);
        }
        //modulo unario concatenar0  repetir
        return "Holiwis";
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.op_string, "");
        if (this.expreU) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    operacionSimbolosIzq(valor1, valor2, op, temporal, result, signo, Temp, ts) {
        if (valor1 != null) {
            let ultimoT;
            if (valor2.codigo3D == "") {
                ultimoT = valor2.temporal.nombre;
            }
            else {
                ultimoT = Temp.ultimoTemporal();
            }
            if (!(valor2.tipo == Tipo_1.tipo.BOOLEAN)) {
                op += valor2.codigo3D + "\n";
            }
            else {
                if (valor1.valor == true) {
                    ultimoT = "1";
                }
                else {
                    ultimoT = "0";
                }
            }
            if (ts.nombre != "Global" && valor1 != null) {
                if (ts.entorno == 0) {
                    ts.entorno = ts.entorno + ts.ant.entorno;
                }
                //
                //console.log(valor1);
                op += temporal.obtener() + " = P + " + valor1.posicion + "; \n";
                let val = Temp.temporal();
                op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
                let nuevo = Temp.temporal();
                op += valor2.codigo3D;
                op += nuevo + '=' + val + " " + signo + " " + valor2.temporal.nombre + "; \n";
                temporal.nombre = nuevo;
                //  op += "stack[(int)" + temporal.obtener() + "]  = " + nuevo + "; \n"
                // result.tipo = tipo.ID;
                // valor1.posicion = ts.entorno;
                // ts.entorno++;
            }
            else if (ts.nombre == "Global" && valor1 != null) {
                let val = Temp.temporal();
                op += val + " = stack[(int)" + ts.entorno + "] ;\n";
                let nuevo = Temp.temporal();
                op += nuevo + '=' + val + " " + signo + " " + valor2.temporal.nombre + "; \n";
                temporal.nombre = nuevo;
                //  op += "stack[(int)" + ts.entorno + "]  = " + nuevo + "; \n"
                // result.tipo = tipo.ID;
                // valor1.posicion = ts.entorno;
                //ts.entorno++;
            }
        }
        return { op, temporal };
    }
    operacionSimbolosDer(valor1, valor2, op, temporal, result, signo, Temp, ts) {
        if (valor2 != null) {
            if (ts.nombre != "Global" && valor1 != null) {
                if (ts.entorno == 0) {
                    ts.entorno = ts.entorno + ts.ant.entorno;
                }
                op += temporal.obtener() + " = P + " + valor2.posicion + "; \n";
                let val = Temp.temporal();
                op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
                let nuevo = Temp.temporal();
                op += valor1.codigo3D;
                op += nuevo + '=' + valor1.temporal.nombre + " " + signo + " " + val + "; \n";
                temporal.nombre = nuevo;
            }
            else if (ts.nombre == "Global" && valor2 != null) {
                let val = Temp.temporal();
                op += val + " = stack[(int)" + ts.entorno + "] ;\n";
                let nuevo = Temp.temporal();
                op += nuevo + '=' + valor1.temporal.nombre + " " + signo + " " + val + "; \n";
                temporal.nombre = nuevo;
            }
        }
        return { op, temporal };
    }
    operacionSimbolos(valor1, valor2, op, temporal, result, signo, Temp, ts) {
        if (valor2 != null && valor1 != null) {
            if (ts.nombre != "Global" && valor1 != null) {
                if (ts.entorno == 0) {
                    ts.entorno = ts.entorno + ts.ant.entorno;
                }
                op += temporal.obtener() + " = P + " + valor1.posicion + "; \n";
                let val = Temp.temporal();
                op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
                let temp2 = Temp.temporal();
                op += temp2 + " = P + " + valor2.posicion + "; \n";
                let val2 = Temp.temporal();
                op += val2 + " = stack[(int)" + temp2 + "] ;\n";
                //---------
                let nuevo = Temp.temporal();
                op += nuevo + '=' + val + " " + signo + " " + val2 + "; \n";
                temporal.nombre = nuevo;
            }
            else if (ts.nombre == "Global" && valor2 != null) {
                let val = Temp.temporal();
                op += val + " = stack[(int)" + valor1.posicion + "] ;\n";
                let val2 = Temp.temporal();
                op += val2 + " = stack[(int)" + valor2.posicion + "] ;\n";
                //---------
                let nuevo = Temp.temporal();
                op += nuevo + '=' + val + " " + signo + " " + val2 + "; \n";
                temporal.nombre = nuevo;
            }
        }
        return { op, temporal };
    }
}
exports.Aritmetica = Aritmetica;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/Simbolos":47,"../../TablaSimbolos/Tipo":49,"./Operaciones":20}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cadenas = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Cadenas {
    constructor(expre1, expre2, expre3, operador, linea, column) {
        this.expre1 = expre1;
        this.expre2 = expre2;
        this.expre3 = expre3;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }
    getTipo(controlador, ts, ts_u) { }
    getValor(controlador, ts, ts_u) {
        let valor_expre1;
        let valor_expre2;
        let valor_expre3;
        if (this.expre2 === null) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        }
        else {
            if (this.expre3 === null) {
                valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
                valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
            }
            else {
                valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
                valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
                valor_expre3 = this.expre3.getValor(controlador, ts, ts_u);
            }
        }
        switch (this.operador) {
            case "caracterposition":
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            return valor_expre1.charAt(valor_expre2);
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "substring":
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            if (typeof valor_expre3 === "number") {
                                if (this.isInt(Number(valor_expre3))) {
                                    return valor_expre1.substring(valor_expre2, valor_expre3);
                                }
                                else {
                                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre3}, tipo de dato incorrecto`, this.linea, this.column);
                                    controlador.errores.push(error);
                                }
                            }
                            else {
                                let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre3}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "length":
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.length;
                }
                else if (typeof valor_expre1 === "object") {
                    return valor_expre1.length;
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "touppercase":
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toUpperCase();
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case "tolowercase":
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toLowerCase();
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador, "");
        if (this.operador == "caracterposition") {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(this.expre2.recorrer());
        }
        else if (this.operador == "substring") {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(this.expre2.recorrer());
            padre.addHijo(this.expre3.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    getTipoArray(lista) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista[0] == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista[0] === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getTipoDato(dato) {
        if (typeof dato == "number") {
            if (this.isInt(Number(dato))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof dato == "string") {
            if (this.isChar(String(dato))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof dato == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (dato === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Cadenas = Cadenas;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":49}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversion = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Conversion {
    constructor(tipo, expre2, operador, linea, column) {
        this.tipo = tipo;
        this.expre2 = expre2;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }
    getTipo(controlador, ts, ts_u) { }
    getValor(controlador, ts, ts_u) {
        let valor_expre2;
        valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        switch (this.operador) {
            case "parse":
                if (this.tipo.tipo == Tipo_1.tipo.DOUBLE || this.tipo.tipo == Tipo_1.tipo.ENTERO) {
                    if (typeof valor_expre2 === "string") {
                        return Number(valor_expre2);
                    }
                }
                else if (this.tipo.tipo == Tipo_1.tipo.BOOLEAN) {
                    if (typeof valor_expre2 === "string") {
                        if (valor_expre2.toLowerCase() == "true") {
                            return true;
                        }
                        return false;
                    }
                }
                break;
            case "toint":
                if (typeof valor_expre2 === "number") {
                    if (!this.isInt(Number(valor_expre2))) {
                        return Math.ceil(valor_expre2);
                    }
                }
                break;
            case "todouble":
                if (typeof valor_expre2 === "number") {
                    return this.twoDecimal(valor_expre2);
                }
                break;
            case "typeof":
                return typeof valor_expre2;
                break;
            case "tostring":
                if (!(typeof valor_expre2 === null)) {
                    return String(valor_expre2);
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador, "");
        padre.addHijo(this.expre2.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    twoDecimal(numberInt) {
        return Number.parseFloat(numberInt.toFixed(4));
    }
}
exports.Conversion = Conversion;

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":49}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logicas = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
const Temporales_1 = require("../../AST/Temporales");
class Logicas extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        super(expre1, expre2, expreU, operador, linea, column);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expreU == false) {
            valor_exp1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_exp2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_expU = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.AND:
                if (typeof valor_exp1 == "boolean") {
                    if (typeof valor_exp2 == "boolean") {
                        return valor_exp1 && valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.OR:
                if (typeof valor_exp1 == "boolean") {
                    if (typeof valor_exp2 == "boolean") {
                        return valor_exp1 || valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.NOT:
                if (typeof valor_expU == "boolean") {
                    return !valor_expU;
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.op_string, "");
        if (this.expreU) {
            //  padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
    generarOperacionBinario(Temp, controlador, ts, ts_u, signo, recursivo) {
        let valor1;
        let valor2;
        if (this.expreU === false) {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        }
        else {
            valor1 = new Temporales_1.Resultado3D();
            valor1.codigo3D = "";
            valor1.temporal = new Temporales_1.Temporal("0");
            valor1.tipo = Tipo_1.tipo.ENTERO;
            valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
        }
        if (valor1 == (null || undefined) || valor2 == (null || undefined))
            return null;
        //-------
        //let resultado = "";
        let result = new Temporales_1.Resultado3D();
        result.tipo = Tipo_1.tipo.BOOLEAN;
        if (this.operador == Operaciones_1.Operador.OR) {
            result.codigo3D += valor1.codigo3D;
            //
            valor1 = this.arreglarBoolean(valor1, result, Temp);
            //
            result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasF);
            result.codigo3D += valor2.codigo3D;
            valor2 = this.arreglarBoolean(valor2, result, Temp);
            result.etiquetasV = valor1.etiquetasV;
            result.etiquetasV = result.etiquetasV.concat(valor2.etiquetasV);
            result.etiquetasF = valor2.etiquetasF;
            //result.codigo3D = resultado;
            if (this.getValor(controlador, ts, ts_u) === true) {
                result.temporal = new Temporales_1.Temporal("true");
            }
            else {
                result.temporal = new Temporales_1.Temporal("false");
            }
            return result;
        }
        else if (this.operador == Operaciones_1.Operador.AND) {
            result.codigo3D += valor1.codigo3D;
            //
            valor1 = this.arreglarBoolean(valor1, result, Temp);
            //
            result.codigo3D += Temp.escribirEtiquetas(valor1.etiquetasV);
            result.codigo3D += valor2.codigo3D;
            valor2 = this.arreglarBoolean(valor2, result, Temp);
            result.etiquetasV = valor2.etiquetasV;
            result.etiquetasF = valor1.etiquetasF;
            result.etiquetasF = result.etiquetasF.concat(valor2.etiquetasF);
            //result.codigo3D = resultado;
            if (this.getValor(controlador, ts, ts_u) === true) {
                result.temporal = new Temporales_1.Temporal("true");
            }
            else {
                result.temporal = new Temporales_1.Temporal("false");
            }
            return result;
        }
        else {
            result.codigo3D += valor2.codigo3D;
            valor2 = this.arreglarBoolean(valor2, result, Temp);
            let v = valor2.etiquetasV;
            let f = valor2.etiquetasF;
            result.etiquetasF = v;
            result.etiquetasV = f;
            return result;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
        if (this.operador == Operaciones_1.Operador.AND) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "&&", 0);
        }
        else if (this.operador == Operaciones_1.Operador.OR) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "||", 0);
        }
        else if (this.operador == Operaciones_1.Operador.NOT) {
            return this.generarOperacionBinario(Temp, controlador, ts, ts_u, "!", 0);
        }
        //modulo unario concatenar repetir
        return "Holiwis";
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
}
exports.Logicas = Logicas;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/Tipo":49,"./Operaciones":20}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nativa = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
class Nativa extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        super(expre1, expre2, expreU, operador, linea, column);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            if (this.isInt(Number(valor))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            if (this.isChar(String(valor))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (valor === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre1;
        let valor_expre2;
        if (this.expreU === false) {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_expre1 = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.POTENCIA:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return Math.pow(valor_expre1, valor_expre2);
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.SENO:
                if (typeof valor_expre1 === "number") {
                    return Math.sin(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.COSENO:
                if (typeof valor_expre1 === "number") {
                    return Math.cos(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.TANGENTE:
                if (typeof valor_expre1 === "number") {
                    return Math.tan(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.RAIZ:
                if (typeof valor_expre1 === "number") {
                    return Math.sqrt(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case Operaciones_1.Operador.LOGARITMO:
                if (typeof valor_expre1 === "number") {
                    return Math.log10(valor_expre1);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            default:
                break;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.operador.toString(), "");
        if (this.operador == Operaciones_1.Operador.POTENCIA) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(this.expre2.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
}
exports.Nativa = Nativa;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":49,"./Operaciones":20}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operacion = exports.Operador = void 0;
const Nodo_1 = require("../../AST/Nodo");
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULT"] = 2] = "MULT";
    Operador[Operador["DIV"] = 3] = "DIV";
    Operador[Operador["POTENCIA"] = 4] = "POTENCIA";
    Operador[Operador["MODULO"] = 5] = "MODULO";
    Operador[Operador["MENORQUE"] = 6] = "MENORQUE";
    Operador[Operador["MAYORQUE"] = 7] = "MAYORQUE";
    Operador[Operador["AND"] = 8] = "AND";
    Operador[Operador["NOT"] = 9] = "NOT";
    Operador[Operador["UNARIO"] = 10] = "UNARIO";
    Operador[Operador["OR"] = 11] = "OR";
    Operador[Operador["MAYORIGUAL"] = 12] = "MAYORIGUAL";
    Operador[Operador["MENORIGUAL"] = 13] = "MENORIGUAL";
    Operador[Operador["IGUALIGUAL"] = 14] = "IGUALIGUAL";
    Operador[Operador["DIFERENCIACION"] = 15] = "DIFERENCIACION";
    Operador[Operador["COSENO"] = 16] = "COSENO";
    Operador[Operador["SENO"] = 17] = "SENO";
    Operador[Operador["TANGENTE"] = 18] = "TANGENTE";
    Operador[Operador["LOGARITMO"] = 19] = "LOGARITMO";
    Operador[Operador["RAIZ"] = 20] = "RAIZ";
    Operador[Operador["CONCATENAR"] = 21] = "CONCATENAR";
    Operador[Operador["REPETIR"] = 22] = "REPETIR";
})(Operador = exports.Operador || (exports.Operador = {}));
class Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        this.expre1 = expre1;
        this.expre2 = expre2;
        this.expreU = expreU;
        this.linea = linea;
        this.column = column;
        this.op_string = operador;
        this.operador = this.getOperador(operador);
    }
    getOperador(op) {
        if (op === '+') {
            return Operador.SUMA;
        }
        else if (op == '-') {
            return Operador.RESTA;
        }
        else if (op == '<') {
            return Operador.MENORQUE;
        }
        else if (op == '>') {
            return Operador.MAYORQUE;
        }
        else if (op == '&&') {
            return Operador.AND;
        }
        else if (op == '!') {
            return Operador.NOT;
        }
        else if (op == '||') {
            return Operador.OR;
        }
        else if (op == 'pow') {
            return Operador.POTENCIA;
        }
        else if (op == 'UNARIO') {
            return Operador.UNARIO;
        }
        else if (op == '*') {
            return Operador.MULT;
        }
        else if (op == '/') {
            return Operador.DIV;
        }
        else if (op == '%') {
            return Operador.MODULO;
        }
        else if (op == '<=') {
            return Operador.MENORIGUAL;
        }
        else if (op == '>=') {
            return Operador.MAYORIGUAL;
        }
        else if (op == '==') {
            return Operador.IGUALIGUAL;
        }
        else if (op == '!=') {
            return Operador.DIFERENCIACION;
        }
        else if (op == '&') {
            return Operador.CONCATENAR;
        }
        else if (op == '^') {
            return Operador.REPETIR;
        }
        else if (op == 'sin') {
            return Operador.SENO;
        }
        else if (op == 'cos') {
            return Operador.COSENO;
        }
        else if (op == 'tan') {
            return Operador.TANGENTE;
        }
        else if (op == 'sqrt') {
            return Operador.RAIZ;
        }
        else if (op == 'log') {
            return Operador.LOGARITMO;
        }
        return Operador.SUMA;
    }
    getTipo(controlador, ts, ts_u) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador, ts, ts_u) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.op_string, "");
        if (this.expreU) {
            //  padre.addHijo(new Nodo(this.op_string,""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            // padre.addHijo(new Nodo(this.op_string,""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Operacion = Operacion;

},{"../../AST/Nodo":7}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacionales = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
const Temporales_1 = require("../../AST/Temporales");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
class Relacionales extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, op, linea, columna) {
        super(expre1, expre2, expreU, op, linea, columna);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expreU == false) {
            valor_exp1 = this.expre1.getValor(controlador, ts, ts_u);
            valor_exp2 = this.expre2.getValor(controlador, ts, ts_u);
        }
        else {
            valor_expU = this.expre1.getValor(controlador, ts, ts_u);
        }
        switch (this.operador) {
            case Operaciones_1.Operador.MENORQUE:
                if (typeof valor_exp1 == "number") {
                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 < valor_exp2;
                    }
                    else if (typeof valor_exp2 == "string") {
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let num_char = valor_exp2.charCodeAt(0);
                            return valor_exp1 < num_char;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            //  return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        //Segundo BOOLEAN
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        // return `**Error Sematnico -> No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                }
                else if (typeof valor_exp1 == "string") {
                    if (valor_exp1.length == 1) {
                        // Primero CHAR
                        let num_char = valor_exp1.charCodeAt(0);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_char < valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let num_char2 = valor_exp2.charCodeAt(0);
                                return num_char < num_char2;
                            }
                            else {
                                //Segundo STRING
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else {
                        //Primero String
                        let num_ascii = this.codigoAscii(valor_exp1);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_ascii < valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            // Segundo numero String, Char
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                            else {
                                // Segundo Numero String
                                let num_ascii2 = this.codigoAscii(valor_exp2);
                                return num_ascii < num_ascii2;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                }
                else if (typeof valor_exp1 == "boolean") {
                    // Primer Numero BOOLEAN
                    let num_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_exp1 = 0;
                    }
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                    else if (typeof valor_exp2 == "string") {
                        // Segundo numero String, Char
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        // Segundo BOOLEAN
                        let num = 1;
                        if (valor_exp2 === false) {
                            num = 0;
                        }
                        return num_exp1 < num;
                    }
                }
                break;
            case Operaciones_1.Operador.MAYORQUE:
                if (typeof valor_exp1 == "number") {
                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 > valor_exp2;
                    }
                    else if (typeof valor_exp2 == "string") {
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let num_char = valor_exp2.charCodeAt(0);
                            return valor_exp1 > num_char;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        //Segundo BOOLEAN
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                }
                else if (typeof valor_exp1 == "string") {
                    if (valor_exp1.length == 1) {
                        // Primero CHAR
                        let num_char = valor_exp1.charCodeAt(0);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_char > valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let num_char2 = valor_exp2.charCodeAt(0);
                                return num_char > num_char2;
                            }
                            else {
                                //Segundo STRING
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else {
                        //Primero String
                        let num_ascii = this.codigoAscii(valor_exp1);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_ascii > valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            // Segundo numero String, Char
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                            else {
                                // Segundo Numero String
                                let num_ascii2 = this.codigoAscii(valor_exp2);
                                return num_ascii > num_ascii2;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                }
                else if (typeof valor_exp1 == "boolean") {
                    // Primer Numero BOOLEAN
                    let num_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_exp1 = 0;
                    }
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                    else if (typeof valor_exp2 == "string") {
                        // Segundo numero String, Char
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} > ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        // Segundo BOOLEAN
                        let num = 1;
                        if (valor_exp2 === false) {
                            num = 0;
                        }
                        return num_exp1 > num;
                    }
                }
                break;
            case Operaciones_1.Operador.MENORIGUAL:
                if (typeof valor_exp1 == "number") {
                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 <= valor_exp2;
                    }
                    else if (typeof valor_exp2 == "string") {
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let num_char = valor_exp2.charCodeAt(0);
                            return valor_exp1 <= num_char;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        //Segundo BOOLEAN
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                }
                else if (typeof valor_exp1 == "string") {
                    if (valor_exp1.length == 1) {
                        // Primero CHAR
                        let num_char = valor_exp1.charCodeAt(0);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_char <= valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let num_char2 = valor_exp2.charCodeAt(0);
                                return num_char <= num_char2;
                            }
                            else {
                                //Segundo STRING
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else {
                        //Primero String
                        let num_ascii = this.codigoAscii(valor_exp1);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_ascii <= valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            // Segundo numero String, Char
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                            else {
                                // Segundo Numero String
                                let num_ascii2 = this.codigoAscii(valor_exp2);
                                return num_ascii <= num_ascii2;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                }
                else if (typeof valor_exp1 == "boolean") {
                    // Primer Numero BOOLEAN
                    let num_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_exp1 = 0;
                    }
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                    else if (typeof valor_exp2 == "string") {
                        // Segundo numero String, Char
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} <= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        // Segundo BOOLEAN
                        let num = 1;
                        if (valor_exp2 === false) {
                            num = 0;
                        }
                        return num_exp1 <= num;
                    }
                }
                break;
            case Operaciones_1.Operador.MAYORIGUAL:
                if (typeof valor_exp1 == "number") {
                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 >= valor_exp2;
                    }
                    else if (typeof valor_exp2 == "string") {
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let num_char = valor_exp2.charCodeAt(0);
                            return valor_exp1 >= num_char;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        //Segundo BOOLEAN
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                }
                else if (typeof valor_exp1 == "string") {
                    if (valor_exp1.length == 1) {
                        // Primero CHAR
                        let num_char = valor_exp1.charCodeAt(0);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_char >= valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let num_char2 = valor_exp2.charCodeAt(0);
                                return num_char >= num_char2;
                            }
                            else {
                                //Segundo STRING
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else {
                        //Primero String
                        let num_ascii = this.codigoAscii(valor_exp1);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_ascii >= valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            // Segundo numero String, Char
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                            else {
                                // Segundo Numero String
                                let num_ascii2 = this.codigoAscii(valor_exp2);
                                return num_ascii >= num_ascii2;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                }
                else if (typeof valor_exp1 == "boolean") {
                    // Primer Numero BOOLEAN
                    let num_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_exp1 = 0;
                    }
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                    else if (typeof valor_exp2 == "string") {
                        // Segundo numero String, Char
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} >= ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        // Segundo BOOLEAN
                        let num = 1;
                        if (valor_exp2 === false) {
                            num = 0;
                        }
                        return num_exp1 >= num;
                    }
                }
                break;
            case Operaciones_1.Operador.IGUALIGUAL:
                if (typeof valor_exp1 == "number") {
                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 == valor_exp2;
                    }
                    else if (typeof valor_exp2 == "string") {
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let num_char = valor_exp2.charCodeAt(0);
                            return valor_exp1 == num_char;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        //Segundo BOOLEAN
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                }
                else if (typeof valor_exp1 == "string") {
                    if (valor_exp1.length == 1) {
                        // Primero CHAR
                        let num_char = valor_exp1.charCodeAt(0);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_char == valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let num_char2 = valor_exp2.charCodeAt(0);
                                return num_char == num_char2;
                            }
                            else {
                                //Segundo STRING
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else {
                        //Primero String
                        let num_ascii = this.codigoAscii(valor_exp1);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_ascii == valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            // Segundo numero String, Char
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                            else {
                                // Segundo Numero String
                                let num_ascii2 = this.codigoAscii(valor_exp2);
                                return num_ascii == num_ascii2;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                }
                else if (typeof valor_exp1 == "boolean") {
                    // Primer Numero BOOLEAN
                    let num_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_exp1 = 0;
                    }
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                    else if (typeof valor_exp2 == "string") {
                        // Segundo numero String, Char
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} == ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        // Segundo BOOLEAN
                        let num = 1;
                        if (valor_exp2 === false) {
                            num = 0;
                        }
                        return num_exp1 == num;
                    }
                }
                break;
            case Operaciones_1.Operador.DIFERENCIACION:
                if (typeof valor_exp1 == "number") {
                    // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 != valor_exp2;
                    }
                    else if (typeof valor_exp2 == "string") {
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let num_char = valor_exp2.charCodeAt(0);
                            return valor_exp1 != num_char;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        //Segundo BOOLEAN
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                }
                else if (typeof valor_exp1 == "string") {
                    if (valor_exp1.length == 1) {
                        // Primero CHAR
                        let num_char = valor_exp1.charCodeAt(0);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_char != valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let num_char2 = valor_exp2.charCodeAt(0);
                                return num_char != num_char2;
                            }
                            else {
                                //Segundo STRING
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else {
                        //Primero String
                        let num_ascii = this.codigoAscii(valor_exp1);
                        if (typeof valor_exp2 == "number") {
                            // Segundo numero ENTERO, DOUBLE
                            return num_ascii != valor_exp2;
                        }
                        else if (typeof valor_exp2 == "string") {
                            // Segundo numero String, Char
                            if (valor_exp2.length == 1) {
                                //Segundo Numero Char
                                let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                                controlador.errores.push(error);
                                return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                            }
                            else {
                                // Segundo Numero String
                                let num_ascii2 = this.codigoAscii(valor_exp2);
                                return num_ascii != num_ascii2;
                            }
                        }
                        else if (typeof valor_exp2 == "boolean") {
                            // Segundo BOOLEAN
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                }
                else if (typeof valor_exp1 == "boolean") {
                    // Primer Numero BOOLEAN
                    let num_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_exp1 = 0;
                    }
                    if (typeof valor_exp2 == "number") {
                        // Segundo numero ENTERO, DOUBLE
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                    }
                    else if (typeof valor_exp2 == "string") {
                        // Segundo numero String, Char
                        if (valor_exp2.length == 1) {
                            //Segundo Numero Char
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                        else {
                            // Segundo Numero String
                            let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                            controlador.errores.push(error);
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} != ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        // Segundo BOOLEAN
                        let num = 1;
                        if (valor_exp2 === false) {
                            num = 0;
                        }
                        return num_exp1 != num;
                    }
                }
                break;
            default:
                break;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
        let valor1;
        let valor2;
        if (this.expreU === false) {
            valor1 = this.expre1.traducir(Temp, controlador, ts, ts_u);
            valor2 = this.expre2.traducir(Temp, controlador, ts, ts_u);
        }
        else {
            valor1 = new Temporales_1.Resultado3D();
            valor1.codigo3D = "";
            valor1.temporal = new Temporales_1.Temporal("0");
            valor1.tipo = Tipo_1.tipo.ENTERO;
            valor2 = this.expre1.traducir(Temp, controlador, ts, ts_u);
        }
        if (valor1 == (null || undefined) || valor2 == (null || undefined))
            return null;
        let result = new Temporales_1.Resultado3D();
        result.tipo = Tipo_1.tipo.BOOLEAN;
        if (valor1.tipo != Tipo_1.tipo.BOOLEAN && valor1 instanceof Simbolos_1.Simbolos == false)
            result.codigo3D += valor1.codigo3D;
        if (valor2.tipo != Tipo_1.tipo.BOOLEAN && valor2 instanceof Simbolos_1.Simbolos == false)
            result.codigo3D += valor2.codigo3D;
        switch (this.operador) {
            case Operaciones_1.Operador.MAYORQUE:
                return this.comparacion(result, valor1, valor2, ">", Temp, controlador, ts, ts_u);
            case Operaciones_1.Operador.MENORQUE:
                return this.comparacion(result, valor1, valor2, "<", Temp, controlador, ts, ts_u);
            case Operaciones_1.Operador.MENORIGUAL:
                return this.comparacion(result, valor1, valor2, "<=", Temp, controlador, ts, ts_u);
            case Operaciones_1.Operador.MAYORIGUAL:
                return this.comparacion(result, valor1, valor2, ">=", Temp, controlador, ts, ts_u);
            case Operaciones_1.Operador.DIFERENCIACION:
                return this.comparacion(result, valor1, valor2, "!=", Temp, controlador, ts, ts_u);
            case Operaciones_1.Operador.IGUALIGUAL:
                return this.comparacion(result, valor1, valor2, "==", Temp, controlador, ts, ts_u);
            default:
                return;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.op_string, "");
        if (this.expreU) {
            // padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            //  padre.addHijo(new Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
    comparacion(nodo, nodoIzq, nodoDer, signo, Temp, controlador, ts, ts_u) {
        nodo.tipo = Tipo_1.tipo.BOOLEAN;
        let v = Temp.etiqueta();
        let f = Temp.etiqueta();
        if (nodoIzq instanceof Simbolos_1.Simbolos && nodoDer instanceof Simbolos_1.Simbolos == false) {
            let temporal = Temp.nuevoTemporal();
            let res = this.relacionalIdAccess(nodoIzq, nodo.codigo3D, temporal, Temp, ts);
            nodo.codigo3D = res.op;
            nodo.codigo3D +=
                "if (" +
                    res.val +
                    " " +
                    signo +
                    " " +
                    nodoDer.temporal.nombre +
                    ") goto " +
                    v +
                    "; // Si es verdadero salta a " + v + "\n";
        }
        else if (nodoDer instanceof Simbolos_1.Simbolos && nodoIzq instanceof Simbolos_1.Simbolos == false) {
            let temporal = Temp.nuevoTemporal();
            let res = this.relacionalIdAccess(nodoDer, nodo.codigo3D, temporal, Temp, ts);
            nodo.codigo3D = res.op;
            nodo.codigo3D +=
                "if (" +
                    nodoIzq.temporal.nombre +
                    " " +
                    signo +
                    " " +
                    res.val +
                    ") goto " +
                    v +
                    "; // Si es verdadero salta a " + v + "\n";
        }
        else if (nodoDer instanceof Simbolos_1.Simbolos && nodoIzq instanceof Simbolos_1.Simbolos) {
            let temporal = Temp.nuevoTemporal();
            let res = this.relacionalIdAccess(nodoIzq, nodo.codigo3D, temporal, Temp, ts);
            nodo.codigo3D = res.op;
            let temporal2 = Temp.nuevoTemporal();
            let res2 = this.relacionalIdAccess(nodoDer, nodo.codigo3D, temporal2, Temp, ts);
            nodo.codigo3D = res2.op;
            nodo.codigo3D +=
                "if (" +
                    res.val +
                    " " +
                    signo +
                    " " +
                    res2.val +
                    ") goto " +
                    v +
                    "; // Si es verdadero salta a " + v + "\n";
        }
        else {
            nodo.codigo3D +=
                "if (" +
                    nodoIzq.temporal.nombre +
                    " " +
                    signo +
                    " " +
                    nodoDer.temporal.nombre +
                    ") goto " +
                    v +
                    "; // Si es verdadero salta a " + v + "\n";
        }
        nodo.codigo3D += "goto " + f + "; //si no se cumple salta a: " + f + "\n";
        nodo.etiquetasV = [];
        nodo.etiquetasV.push(v);
        nodo.etiquetasF = [];
        nodo.etiquetasF.push(f);
        return nodo;
    }
    relacionalIdAccess(nodo, op, temporal, Temp, ts) {
        let val = Temp.temporal();
        if (ts.nombre != "Global" && nodo != null) {
            if (ts.entorno == 0) {
                ts.entorno = ts.entorno + ts.ant.entorno;
            }
            op += temporal.obtener() + " = P + " + nodo.posicion + "; \n";
            op += val + " = stack[(int)" + temporal.obtener() + "] ;\n";
        }
        else if (ts.nombre == "Global" && nodo != null) {
            op += val + " = stack[(int)" + nodo.posicion + "] ;\n";
        }
        return { op, val };
    }
    codigoAscii(cadena) {
        let aux = 0;
        for (let index = 0; index < cadena.length; index++) {
            aux += cadena.charCodeAt(index);
        }
        return aux;
    }
}
exports.Relacionales = Relacionales;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/Simbolos":47,"../../TablaSimbolos/Tipo":49,"./Operaciones":20}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Temporales_1 = require("../AST/Temporales");
class Primitivo {
    constructor(primitivo, linea, columna) {
        this.columna = columna;
        this.linea = linea;
        this.primitivo = primitivo;
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == "number") {
            if (this.isInt(Number(valor))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == "string") {
            if (this.isChar(String(this.primitivo))) {
                return Tipo_1.tipo.CARACTER;
            }
            else {
                return Tipo_1.tipo.CADENA;
            }
        }
        else if (typeof valor == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (valor === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getTipoTraduc() {
        if (typeof this.primitivo == "number") {
            if (this.isInt(Number(this.primitivo))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof this.primitivo == "string") {
            if (this.isChar(String(this.primitivo))) {
                return Tipo_1.tipo.CARACTER;
            }
            else {
                return Tipo_1.tipo.CADENA;
            }
        }
        else if (typeof this.primitivo == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (this.primitivo === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getValor(controlador, ts, ts_u) {
        return this.primitivo;
    }
    recorrer() {
        let padre;
        if (this.primitivo == null) {
            padre = new Nodo_1.Nodo("Null", "");
        }
        else {
            padre = new Nodo_1.Nodo(this.primitivo.toString(), "");
            //padre.addHijo(new Nodo(this.primitivo.toString(),""));
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    traducir(Temp, controlador, ts, ts_u) {
        let resultado3D = new Temporales_1.Resultado3D();
        resultado3D.codigo3D = "";
        if (typeof this.primitivo == "number") {
            if (this.isInt(Number(this.primitivo))) {
                resultado3D.tipo = Tipo_1.tipo.ENTERO;
            }
            resultado3D.tipo = Tipo_1.tipo.DOUBLE;
        }
        else if (typeof this.primitivo == "string") {
            if (this.isChar(String(this.primitivo))) {
                resultado3D.tipo = Tipo_1.tipo.CARACTER;
            }
            else {
                resultado3D.tipo = Tipo_1.tipo.CADENA;
            }
        }
        else if (typeof this.primitivo == "boolean") {
            resultado3D.tipo = Tipo_1.tipo.BOOLEAN;
        }
        else if (this.primitivo === null) {
            resultado3D.tipo = Tipo_1.tipo.NULO;
        }
        //-------------------
        if (this.primitivo == true && typeof this.primitivo == "boolean") {
            resultado3D.temporal = new Temporales_1.Temporal("1");
        }
        else if (this.primitivo == false && typeof this.primitivo == "boolean") {
            resultado3D.temporal = new Temporales_1.Temporal("0");
        }
        else if (typeof this.primitivo == "string") {
            if (this.isChar(String(this.primitivo))) {
                let ascii = this.primitivo.toString().charCodeAt(0);
                let nodo = new Temporales_1.Resultado3D();
                nodo.tipo = Tipo_1.tipo.CARACTER;
                nodo.temporal = new Temporales_1.Temporal(ascii.toString());
                resultado3D = nodo;
            }
            else {
                resultado3D = this.setCadena(this.primitivo.toString(), Temp);
            }
        }
        else {
            resultado3D.temporal = new Temporales_1.Temporal(this.primitivo.toString());
        }
        return resultado3D;
    }
    setCadena(cadena, Temp) {
        let nodo = new Temporales_1.Resultado3D();
        nodo.tipo = Tipo_1.tipo.CADENA;
        let cadenatemp = cadena;
        cadena = cadena.replace("\\n", "\n");
        cadena = cadena.replace("\\t", "\t");
        cadena = cadena.replace('\\"', '"');
        cadena = cadena.replace("\\'", "'");
        nodo.codigo3D +=
            "//%%%%%%%%%%%%%%%%%%% GUARDAR CADENA " + cadenatemp + "%%%%%%%%%%%%%%%%%%%% \n";
        let temporal = Temp.temporal();
        nodo.codigo3D += temporal + " = H; \n ";
        for (let i = 0; i < cadena.length; i++) {
            nodo.codigo3D += "heap[(int) H] = " + cadena.charCodeAt(i) + ";  //Guardamos en el Heap el caracter: " + cadena.charAt(i) + "\n";
            nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
            if (i === 0) {
                nodo.temporal = new Temporales_1.Temporal(temporal);
            }
        }
        nodo.codigo3D += "heap[(int) H] = 0; //Fin de la cadena \n";
        nodo.codigo3D += "H = H + 1; // Aumentamos el Heap \n";
        return nodo;
    }
}
exports.Primitivo = Primitivo;

},{"../AST/Nodo":7,"../AST/Temporales":8,"../TablaSimbolos/Tipo":49}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
class Struct extends Simbolos_1.Simbolos {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_ints, linea, columna) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_ints = lista_ints;
        this.linea = linea;
        this.column = columna;
    }
    agregarSimboloStruct(controlador, ts, ts_u) {
        if (!ts.existe(this.identificador)) {
            ts.agregar(this.identificador, this);
            ts_u.agregar(this.identificador, this);
        }
        else {
            //Erro Semantico
        }
    }
    ejecutar(controlador, ts, ts_u) {
        //this.entorno = new TablaSim(ts, this.identificador);
        // ts.setSiguiente(this.entorno);  
        /*
        this.declaraciones.forEach((ins) => {
            ins.ejecutar(controlador, this.entorno, ts_u);
        });*/
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.identificador, "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Struct = Struct;

},{"../AST/Nodo":7,"../TablaSimbolos/Simbolos":47}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Ternario {
    constructor(condicion, verdadero, falso, linea, columna) {
        this.verdadero = verdadero;
        this.condicion = condicion;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == 'boolean') {
            return valor_condi ? this.verdadero.getTipo(controlador, ts, ts_u) : this.falso.getTipo(controlador, ts, ts_u);
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`);
        }
    }
    getValor(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == 'boolean') {
            return valor_condi ? this.verdadero.getValor(controlador, ts, ts_u) : this.falso.getValor(controlador, ts, ts_u);
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${valor_condi}, no se puede operar`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`La variable ${valor_condi}, no se puede operar ${this.linea}, y columna ${this.columna}`);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("TERNARIO", "");
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo("=", ""));
        padre.addHijo(this.verdadero.recorrer());
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo("?", ""));
        padre.addHijo(this.falso.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let izq = this.verdadero.traducir(Temp, controlador, ts, ts_u);
        let der = this.falso.traducir(Temp, controlador, ts, ts_u);
        let salida = new Temporales_1.Resultado3D();
        salida.temporal = new Temporales_1.Temporal("");
        let temporal = Temp.temporal();
        let s = Temp.etiqueta();
        salida.temporal.nombre = temporal;
        salida.tipo = izq.tipo;
        salida.codigo3D += nodoCondicion.codigo3D;
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  TERNARIO %%%%%%%%%%%%%%%%%%%%% \n";
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%% CONDI VERDADERA %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        salida.codigo3D += izq.codigo3D;
        if (izq.tipo === Tipo_1.tipo.BOOLEAN)
            izq = this.arreglarBooleanA(izq, salida, Temp);
        salida.codigo3D += temporal + " = " + izq.temporal.nombre + "; // Si es verdadero esto es su retorno \n";
        salida.codigo3D += Temp.saltoIncondicional(s);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%% CONDI FALSA %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += der.codigo3D;
        if (der.tipo === Tipo_1.tipo.BOOLEAN)
            der = this.arreglarBooleanA(der, salida, Temp);
        salida.codigo3D += temporal + " = " + der.temporal.nombre + "; // Si es falsa aqui se retorna \n";
        salida.codigo3D += s + ": \n";
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
    arreglarBooleanA(nodo, salida, Temp) {
        if (nodo.etiquetasV != null) {
            let temporal = Temp.temporal();
            let salto = Temp.etiqueta();
            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
            salida.codigo3D += temporal + " = 1 //Verdadero \n";
            salida.codigo3D += Temp.saltoIncondicional(salto);
            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
            salida.codigo3D += temporal + " = 0 //Falsa \n";
            salida.codigo3D += salto + ":";
            nodo.temporal.nombre = temporal;
            nodo.etiquetasV = [];
            nodo.etiquetasF = [];
        }
        return nodo;
    }
}
exports.Ternario = Ternario;

},{"../AST/Errores":6,"../AST/Nodo":7,"../AST/Temporales":8,"../TablaSimbolos/Tipo":49}],25:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramar = (function(){
    var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,6],$V1=[1,9],$V2=[1,8],$V3=[1,10],$V4=[1,11],$V5=[1,12],$V6=[1,13],$V7=[1,14],$V8=[1,15],$V9=[2,5,10,11,20,28,29,30,31,32],$Va=[1,21],$Vb=[11,26,64],$Vc=[8,23],$Vd=[2,131],$Ve=[1,29],$Vf=[1,27],$Vg=[1,31],$Vh=[1,69],$Vi=[1,46],$Vj=[1,51],$Vk=[1,77],$Vl=[1,55],$Vm=[1,63],$Vn=[1,64],$Vo=[1,65],$Vp=[1,66],$Vq=[1,56],$Vr=[1,57],$Vs=[1,58],$Vt=[1,59],$Vu=[1,60],$Vv=[1,61],$Vw=[1,54],$Vx=[1,67],$Vy=[1,68],$Vz=[1,70],$VA=[1,71],$VB=[1,72],$VC=[1,73],$VD=[1,74],$VE=[1,75],$VF=[1,76],$VG=[1,83],$VH=[1,107],$VI=[1,105],$VJ=[1,108],$VK=[1,90],$VL=[1,91],$VM=[1,92],$VN=[1,93],$VO=[1,94],$VP=[1,95],$VQ=[1,96],$VR=[1,97],$VS=[1,98],$VT=[1,99],$VU=[1,100],$VV=[1,101],$VW=[1,102],$VX=[1,103],$VY=[1,104],$VZ=[1,106],$V_=[8,13,19,23,26,27,64,65,68,69,70,71,72,73,74,75,94,95,96,97,98,99,100,101,124],$V$=[1,129],$V01=[1,127],$V11=[1,128],$V21=[1,148],$V31=[1,150],$V41=[1,151],$V51=[1,152],$V61=[1,153],$V71=[1,154],$V81=[1,158],$V91=[1,160],$Va1=[1,155],$Vb1=[1,156],$Vc1=[1,157],$Vd1=[1,159],$Ve1=[1,162],$Vf1=[15,19,23],$Vg1=[1,205],$Vh1=[19,23,27],$Vi1=[8,13,19,23,27,65,69,70,71,72,73,94,95,96,97,98,99,100,101,124],$Vj1=[8,13,19,23,27,65,69,70,94,95,96,97,98,99,100,101,124],$Vk1=[8,13,19,23,27,65,68,69,70,71,72,73,74,75,94,95,96,97,98,99,100,101,124],$Vl1=[2,11,15,28,29,30,31,32,48,50,103,104,114,116,120,121,122,123,125,127,128,130],$Vm1=[1,232],$Vn1=[1,235],$Vo1=[1,233],$Vp1=[8,13,19,23,27,65,94,95,96,97,100,101,124],$Vq1=[8,13,19,23,27,65,94,95,96,97,98,99,100,101,124],$Vr1=[19,23],$Vs1=[1,283],$Vt1=[1,352],$Vu1=[15,120,121];
    var parser = {trace: function trace () { },
    yy: {},
    symbols_: {"error":2,"INICIO":3,"CONTENIDO":4,"EOF":5,"BLOQUE_GB":6,"DECLARACIONVARIABLE":7,"ptcoma":8,"FUNCION_BLOQUE":9,"void":10,"id":11,"PARAMETROS_SENTENCIA":12,"llaveizq":13,"INSTRUCCIONES":14,"llavedec":15,"TIPO":16,"main":17,"parizq":18,"pardec":19,"struct":20,"LISTPARAMETROS":21,"LISTA_STRUCT":22,"coma":23,"DECLA_STRUCT":24,"PARAMETRO":25,"corizq":26,"cordec":27,"string":28,"int":29,"double":30,"char":31,"boolean":32,"INSTRUCCION":33,"ASIGNACION_BLOQUE":34,"PRINT_BLOQUE":35,"SENTENCIA_IF":36,"SENTENCIA_SWITCH":37,"SENTENCIA_FOR":38,"SENTENCIA_FOR_ESP":39,"SENTENCIA_WHILE":40,"SENTENCIA_DOWHILE":41,"SENTENCIA_BREAK":42,"UNARIA":43,"SENTENCIA_RETURN":44,"SENTENCIA_CONTINUE":45,"LLAMADA":46,"NAT_ARREGLO":47,"print":48,"EXPRESION":49,"println":50,"ARITMETICA":51,"CADENAS":52,"RELACIONAL":53,"LOGICA":54,"NATIVAS":55,"NAT_CAD":56,"NAT_FUN":57,"PRIMITIVO":58,"SENTENCIA_TERNARIO":59,"ACCESO_STRUCT":60,"LISTAARRAY":61,"ACCESO_ARREGLO":62,"ARITMETICA_ARREGLO":63,"punto":64,"dspuntos":65,"end":66,"begin":67,"oparr":68,"mas":69,"menos":70,"multiplicacion":71,"division":72,"modulo":73,"concat":74,"repit":75,"caracterposition":76,"substring":77,"length":78,"touppercase":79,"tolowercase":80,"push":81,"pop":82,"parse":83,"toint":84,"todouble":85,"typeof":86,"tostring":87,"pow":88,"sin":89,"cos":90,"tan":91,"sqrt":92,"log":93,"menor":94,"mayor":95,"menorigual":96,"mayorigual":97,"igualigual":98,"diferente":99,"or":100,"and":101,"negacion":102,"incremento":103,"decremento":104,"entero":105,"decimal":106,"caracter":107,"cadena":108,"true":109,"false":110,"null":111,"LISTAIDS":112,"igual":113,"if":114,"else":115,"switch":116,"LISTACASE":117,"SENTENCIA_DEFAULT":118,"SENTENCIA_CASE":119,"case":120,"default":121,"break":122,"continue":123,"ternario":124,"for":125,"in":126,"while":127,"do":128,"LISTAEXPRESIONES":129,"return":130,"$accept":0,"$end":1},
    terminals_: {2:"error",5:"EOF",8:"ptcoma",10:"void",11:"id",13:"llaveizq",15:"llavedec",17:"main",18:"parizq",19:"pardec",20:"struct",23:"coma",26:"corizq",27:"cordec",28:"string",29:"int",30:"double",31:"char",32:"boolean",48:"print",50:"println",64:"punto",65:"dspuntos",66:"end",67:"begin",68:"oparr",69:"mas",70:"menos",71:"multiplicacion",72:"division",73:"modulo",74:"concat",75:"repit",76:"caracterposition",77:"substring",78:"length",79:"touppercase",80:"tolowercase",81:"push",82:"pop",83:"parse",84:"toint",85:"todouble",86:"typeof",87:"tostring",88:"pow",89:"sin",90:"cos",91:"tan",92:"sqrt",93:"log",94:"menor",95:"mayor",96:"menorigual",97:"mayorigual",98:"igualigual",99:"diferente",100:"or",101:"and",102:"negacion",103:"incremento",104:"decremento",105:"entero",106:"decimal",107:"caracter",108:"cadena",109:"true",110:"false",111:"null",113:"igual",114:"if",115:"else",116:"switch",120:"case",121:"default",122:"break",123:"continue",124:"ternario",125:"for",126:"in",127:"while",128:"do",130:"return"},
    productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,1],[6,1],[9,6],[9,6],[9,6],[9,7],[9,5],[22,3],[22,1],[24,2],[12,3],[12,2],[21,3],[21,1],[25,2],[25,4],[25,2],[16,1],[16,1],[16,1],[16,1],[16,1],[14,2],[14,1],[33,2],[33,2],[33,2],[33,1],[33,1],[33,1],[33,1],[33,1],[33,1],[33,2],[33,2],[33,2],[33,2],[33,2],[33,2],[33,1],[35,4],[35,4],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,1],[49,3],[49,1],[49,1],[49,1],[49,1],[49,3],[49,1],[49,1],[60,3],[62,4],[62,6],[62,6],[62,6],[62,6],[63,2],[63,4],[63,4],[63,4],[63,4],[63,4],[63,4],[63,4],[51,3],[51,3],[51,3],[51,3],[51,3],[52,3],[52,3],[56,6],[56,8],[56,5],[56,5],[56,5],[47,6],[47,5],[57,6],[57,4],[57,4],[57,4],[57,4],[55,6],[55,4],[55,4],[55,4],[55,4],[55,4],[53,3],[53,3],[53,3],[53,3],[53,3],[53,3],[54,3],[54,3],[54,2],[54,2],[43,2],[43,2],[43,2],[43,2],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[7,2],[7,4],[7,6],[7,7],[61,3],[61,1],[112,3],[112,1],[34,3],[34,5],[34,6],[36,7],[36,11],[36,9],[37,8],[37,7],[117,2],[117,1],[119,4],[118,3],[42,1],[45,1],[59,5],[38,11],[38,11],[39,7],[40,5],[41,9],[46,3],[46,4],[129,3],[129,1],[44,2],[44,1]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
    /* this == yyval */
    
    var $0 = $$.length - 1;
    switch (yystate) {
    case 1:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INICIO -> CONTENIDO','g':'INICIO.val = CONTENIDO.val'}); return { arbol:this.$, errores: listaErrores, reportg: listaRGramar}; 
    break;
    case 2:
     if($$[$0]!=null){$$[$0-1].push($$[$0]);} this.$ = $$[$0-1]; listaRGramar.push({'p':'CONTENIDO -> CONTENIDO BLOQUE_GB','g':'CONTENIDO.val = CONTENIDO.add(BLOQUE_GB.val)'}); 
    break;
    case 3:
     if(this.$!=null){this.$ = [$$[$0]];} listaRGramar.push({'p':'CONTENIDO -> BLOQUE_GB','g':'CONTENIDO.val = BLOQUE_GB.val'}); 
    break;
    case 4:
     this.$ = $$[$0-1];  listaRGramar.push({'p':'BLOQUE_GB -> DECLARACIONVARIABLE ptcoma','g':'BLOQUE_GB.val = DECLARACIONVARIABLE.val'}); 
    break;
    case 5:
     this.$ = $$[$0]; listaRGramar.push({'p':'BLOQUE_GB -> FUNCION_BLOQUE','g':'BLOQUE_GB.val = FUNCION_BLOQUE.val'});
    break;
    case 6:
     this.$ = null; listaErrores.push(new Errores('Sintactico', `El caracter no portenece al lenguaje ${yytext}`, this._$.first_line, this._$.first_column)); listaRGramar.push({'p':'BLOQUE_GB -> error','g':'error'});
    break;
    case 7:
     this.$= new Funcion(3, new Tipo('VOID'), $$[$0-4], $$[$0-3], true, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> void id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,PARAMETROS_SENTENCIA.val,INSTRUCCIONES.val)'});
    break;
    case 8:
     this.$= new Funcion(3, $$[$0-5], $$[$0-4], $$[$0-3], false, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> TIPO id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,PARAMETROS_SENTENCIA.val,INSTRUCCIONES.val)'});
    break;
    case 9:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'FUNCION_BLOQUE -> id id PARAMETROS_SENTENCIA llaveizq INSTRUCCIONES llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,PARAMETROS_SENTENCIA.val,INSTRUCCIONES.val)'});
    break;
    case 10:
     this.$= new Funcion(3, new Tipo('VOID'), $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> void main parizq pardec llaveizq INSTRUCCIONES llavedec ','g':'FUNCION_BLOQUE.val = array(main.lexval,INSTRUCCIONES.val)'});
    break;
    case 11:
     this.$= new Struct(3, new Tipo('STRUCT'), $$[$0-3], $$[$0-1], true, [], _$[$0-4].first_line, _$[$0-4].last_column); listaRGramar.push({'p':'FUNCION_BLOQUE -> struct id llaveizq LISTPARAMETROS llavedec','g':'FUNCION_BLOQUE.val = array(id.lexval,LISTPARAMETROS.val)'});
    break;
    case 12:
     this.$ = $$[$0-2]; this.$.push($$[$0]); listaRGramar.push({'p':'LISTA_STRUCT -> LISTA_STRUCT coma DECLA_STRUCT','g':'LISTA_STRUCT.val = LISTA_STRUCT.add(DECLA_STRUCT.val)'});
    break;
    case 13:
     this.$ = []; this.$.push($$[$0]); listaRGramar.push({'p':'LISTA_STRUCT -> DECLA_STRUCT','g':'LISTA_STRUCT.val = DECLA_STRUCT.val'});
    break;
    case 14:
     this.$ = new Declaracion($$[$0-1], [new Simbolos(1,null, $$[$0], null)], _$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'DECLA_STRUCT -> TIPO id','g':'DECLA_STRUCT.val = array(TIPO.val,id.lexval)'});
    break;
    case 15:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'PARAMETROS_SENTENCIA -> parizq LISTPARAMETROS pardec','g':'PARAMETROS_SENTENCIA.val = LISTPARAMETROS.val'});
    break;
    case 16:
     this.$ = []; listaRGramar.push({'p':'PARAMETROS_SENTENCIA -> parizq pardec','g':'PARAMETROS_SENTENCIA.val = array(null)'});
    break;
    case 17:
     this.$ = $$[$0-2]; this.$.push($$[$0]); listaRGramar.push({'p':'LISTPARAMETROS -> LISTPARAMETROS coma PARAMETRO','g':'LISTPARAMETROS.val = LISTPARAMETROS.add(PARAMETRO.val)'});
    break;
    case 18:
     this.$ = []; this.$.push($$[$0]); listaRGramar.push({'p':'LISTPARAMETROS -> PARAMETRO','g':'LISTPARAMETROS.val = PARAMETRO.val'});
    break;
    case 19:
     this.$ = new Simbolos(6,$$[$0-1], $$[$0], null);  listaRGramar.push({'p':'PARAMETRO -> TIPO id','g':'PARAMETRO.val = array(TIPO.val,id.lexval)'});
    break;
    case 20:
     this.$ = new Simbolos(6,new Tipo("ARRAY"), $$[$0], null);  listaRGramar.push({'p':'PARAMETRO -> TIPO corizq cordec id','g':'PARAMETRO.val = array(TIPO.val,id.lexval)'});
    break;
    case 21:
     this.$ = new Simbolos(6,new Tipo($$[$0-1]), $$[$0], null); listaRGramar.push({'p':'PARAMETRO -> id id','g':'PARAMETRO.val = array(id.lexval,id.lexval)'});
    break;
    case 22:
     this.$ = new Tipo('STRING'); listaRGramar.push({'p':'TIPO -> string','g':'TIPO.val = string.lexval'});
    break;
    case 23:
     this.$ = new Tipo('ENTERO'); listaRGramar.push({'p':'TIPO -> int','g':'TIPO.val = int.lexval'});
    break;
    case 24:
     this.$ = new Tipo('DECIMAL'); listaRGramar.push({'p':'TIPO -> double','g':'TIPO.val = double.lexval'});
    break;
    case 25:
     this.$ = new Tipo('CHAR'); listaRGramar.push({'p':'TIPO -> char','g':'TIPO.val = char.lexval'});
    break;
    case 26:
     this.$ = new Tipo('BOOLEAN'); listaRGramar.push({'p':'TIPO -> boolean','g':'TIPO.val = boolean.lexval'});
    break;
    case 27:
     if($$[$0]!=null){$$[$0-1].push($$[$0]);} this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCIONES -> INSTRUCCIONES INSTRUCCION','g':'INSTRUCCIONES.val = LISTPARAMETROS.add(INSTRUCCION.val)'});
    break;
    case 28:
     if(this.$!=null){this.$ = [$$[$0]];} listaRGramar.push({'p':'INSTRUCCIONES -> INSTRUCCION','g':'INSTRUCCIONES.val = INSTRUCCION.val'});
    break;
    case 29:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> DECLARACIONVARIABLE ptcoma','g':'INSTRUCCIONES.val = DECLARACIONVARIABLE.val'});
    break;
    case 30:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> ASIGNACION_BLOQUE ptcoma','g':'INSTRUCCIONES.val = ASIGNACION_BLOQUE.val'});
    break;
    case 31:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> PRINT_BLOQUE ptcoma','g':'INSTRUCCIONES.val = PRINT_BLOQUE.val'});
    break;
    case 32:
     this.$ = $$[$0]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_IF ','g':'INSTRUCCIONES.val = SENTENCIA_IF.val'});
    break;
    case 33:
     this.$ = $$[$0]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_SWITCH ','g':'INSTRUCCIONES.val = SENTENCIA_SWITCH.val'});
    break;
    case 34:
     this.$ = $$[$0]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_FOR ','g':'INSTRUCCIONES.val = SENTENCIA_FOR.val'});
    break;
    case 35:
     this.$ = $$[$0]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_FOR_ESP ','g':'INSTRUCCIONES.val = SENTENCIA_FOR_ESP.val'});
    break;
    case 36:
     this.$ = $$[$0]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_WHILE ','g':'INSTRUCCIONES.val = SENTENCIA_WHILE.val'});
    break;
    case 37:
     this.$ = $$[$0]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_DOWHILE ','g':'INSTRUCCIONES.val = SENTENCIA_DOWHILE.val'});
    break;
    case 38:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_BREAK ptcoma','g':'INSTRUCCIONES.val = SENTENCIA_BREAK.val'});
    break;
    case 39:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> UNARIA ptcoma','g':'INSTRUCCIONES.val = UNARIA.val'});
    break;
    case 40:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_RETURN ptcoma','g':'INSTRUCCIONES.val = SENTENCIA_RETURN.val'});
    break;
    case 41:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> SENTENCIA_CONTINUE ptcoma','g':'INSTRUCCIONES.val = SENTENCIA_CONTINUE.val'});
    break;
    case 42:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> LLAMADA ptcoma','g':'INSTRUCCIONES.val = LLAMADA.val'});
    break;
    case 43:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'INSTRUCCION -> NAT_ARREGLO ptcoma','g':'INSTRUCCIONES.val = NAT_ARREGLO.val'});
    break;
    case 44:
     this.$=null; listaErrores.push(new Errores('Sintactico', `No se esperaba el token ${yytext}`, this._$.first_line, this._$.first_column)); listaRGramar.push({'p':'INSTRUCCION -> error','g':'error'});
    break;
    case 45:
     this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); listaRGramar.push({'p':'PRINT_BLOQUE -> print parizq EXPRESION pardec  ','g':'PRINT_BLOQUE.val = array(EXPRESION.val)'});
    break;
    case 46:
     this.$ = new Println($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); listaRGramar.push({'p':'PRINT_BLOQUE -> println parizq EXPRESION pardec  ','g':'PRINT_BLOQUE.val = array(EXPRESION.val)'});
    break;
    case 47:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> ARITMETICA','g':'EXPRESION.val = ARITMETICA.val'});
    break;
    case 48:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> CADENAS','g':'EXPRESION.val = CADENAS.val'});
    break;
    case 49:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> RELACIONAL','g':'EXPRESION.val = RELACIONAL.val'});
    break;
    case 50:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> LOGICA','g':'EXPRESION.val = LOGICA.val'});
    break;
    case 51:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> NATIVAS','g':'EXPRESION.val = NATIVAS.val'});
    break;
    case 52:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> NAT_CAD','g':'EXPRESION.val = NAT_CAD.val'});
    break;
    case 53:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> NAT_FUN','g':'EXPRESION.val = NAT_FUN.val'});
    break;
    case 54:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> UNARIA','g':'EXPRESION.val = UNARIA.val'});
    break;
    case 55:
     this.$ = $$[$0-1]; listaRGramar.push({'p':'EXPRESION -> parizq EXPRESION pardec ','g':'EXPRESION.val = EXPRESION.val'});
    break;
    case 56:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> PRIMITIVO','g':'EXPRESION.val = PRIMITIVO.val'});
    break;
    case 57:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> SENTENCIA_TERNARIO','g':'EXPRESION.val = SENTENCIA_TERNARIO.val'});
    break;
    case 58:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> LLAMADA','g':'EXPRESION.val = LLAMADA.val'});
    break;
    case 59:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> ACCESO_STRUCT','g':'EXPRESION.val = ACCESO_STRUCT.val'});
    break;
    case 60:
     this.$ = new Arreglo($$[$0-1]); listaRGramar.push({'p':'EXPRESION -> corizq LISTAARRAY cordec','g':'EXPRESION.val = LISTAARRAY.val'});
    break;
    case 61:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> ACCESO_ARREGLO','g':'EXPRESION.val = ACCESO_ARREGLO.val'});
    break;
    case 62:
     this.$ = $$[$0]; listaRGramar.push({'p':'EXPRESION -> ARITMETICA_ARREGLO','g':'EXPRESION.val = ARITMETICA_ARREGLO.val'});
    break;
    case 63:
     this.$ = new AccesoStruct($$[$0-2],new Identificador($$[$0], _$[$0-2].first_line, _$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'ACCESO_STRUCT -> EXPRESION punto id ','g':'ACCESO_STRUCT.val = array(EXPRESION.val, id.lexval)'});
    break;
    case 64:
    this.$= new AccesoArreglo($$[$0-3],$$[$0-1],null,false,null,null,_$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq EXPRESION cordec ','g':'ACCESO_ARREGLO.val = array(EXPRESION.val, EXPRESION.val)'});
    break;
    case 65:
    this.$= new AccesoArreglo($$[$0-5],$$[$0-3],$$[$0-1],true,null,null,_$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq EXPRESION dspuntos EXPRESION cordec ','g':'ACCESO_ARREGLO.val = array(EXPRESION.val, EXPRESION.val)'});
    break;
    case 66:
    this.$= new AccesoArreglo($$[$0-5],$$[$0-3],null,true,null,$$[$0-1],_$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq EXPRESION dspuntos end cordec ','g':'ACCESO_ARREGLO.val = array(EXPRESION.val, end.lexval)'});
    break;
    case 67:
    this.$= new AccesoArreglo($$[$0-5],null,$$[$0-1],true,$$[$0-3],null,_$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq begin dspuntos EXPRESION cordec ','g':'ACCESO_ARREGLO.val = array(begin.lexval, EXPRESION.val)'});
    break;
    case 68:
    this.$= new AccesoArreglo($$[$0-5],null,null,true,$$[$0-3],$$[$0-1],_$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'ACCESO_ARREGLO -> EXPRESION corizq begin dspuntos end cordec ','g':'ACCESO_ARREGLO.val = array(begin.lexval, end.lexval)'});
    break;
    case 69:
     this.$ = new AritArreglo($$[$0], null, true ,'oparr', _$[$0-1].first_line,_$[$0-1].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> oparr EXPRESION  ','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val)'});
    break;
    case 70:
     this.$ = new AritArreglo($$[$0-3], $$[$0], false ,'+', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr mas EXPRESION   ','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 71:
     this.$ = new AritArreglo($$[$0-3], $$[$0], false ,'-', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr menos EXPRESION ','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 72:
     this.$ = new AritArreglo($$[$0-3], $$[$0], false ,'*', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr multiplicacion EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 73:
     this.$ = new AritArreglo($$[$0-3], $$[$0], false ,'/', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr division EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 74:
     this.$ = new AritArreglo($$[$0-3], $$[$0], false ,'%', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr modulo EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 75:
     this.$ = new AritArreglo($$[$0-3], $$[$0], false ,'&', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr concat EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 76:
     this.$ = new AritArreglo($$[$0-3], $$[$0], false ,'^', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'ARITMETICA_ARREGLO -> EXPRESION oparr repit EXPRESION','g':'ARITMETICA_ARREGLO.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 77:
     this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'+', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION mas EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 78:
     this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'-', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION menos EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 79:
     this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'*', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION multiplicacion EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 80:
     this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'/', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION division EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 81:
     this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'%', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'ARITMETICA -> EXPRESION modulo EXPRESION','g':'ARITMETICA.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 82:
     this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'&', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'CADENAS -> EXPRESION concat EXPRESION','g':'CADENAS.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 83:
     this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'^', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'CADENAS -> EXPRESION repit EXPRESION','g':'CADENAS.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 84:
     this.$ = new Cadenas($$[$0-5], $$[$0-1], null ,'caracterposition', _$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto caracterposition parizq EXPRESION pardec','g':'NAT_CAD.val = array(EXPRESION.val,EXPRESION.val)'});
    break;
    case 85:
     this.$ = new Cadenas($$[$0-7], $$[$0-3], $$[$0-1] ,'substring', _$[$0-7].first_line,_$[$0-7].last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto substring parizq EXPRESION coma EXPRESION pardec','g':'NAT_CAD.val = array(EXPRESION.val,EXPRESION.val,EXPRESION.val)'});
    break;
    case 86:
     this.$ = new Cadenas($$[$0-4], null, null ,'length', _$[$0-4].first_line,_$[$0-4].last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto length parizq pardec','g':'NAT_CAD.val = array(EXPRESION.val)'});
    break;
    case 87:
     this.$ = new Cadenas($$[$0-4], null, null ,'touppercase', _$[$0-4].first_line,_$[$0-4].last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto touppercase parizq pardec','g':'NAT_CAD.val = array(EXPRESION.val)'});
    break;
    case 88:
     this.$ = new Cadenas($$[$0-4], null, null ,'tolowercase', _$[$0-4].first_line,_$[$0-4].last_column); listaRGramar.push({'p':'NAT_CAD -> EXPRESION punto tolowercase parizq pardec','g':'NAT_CAD.val = array(EXPRESION.val)'});
    break;
    case 89:
     this.$ = new ManejoArray($$[$0-5], $$[$0-1],'push', _$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'NAT_ARREGLO -> id punto push parizq EXPRESION pardec','g':'NAT_ARREGLO.val = array(id.lexval,EXPRESION.val)'});
    break;
    case 90:
     this.$ = new ManejoArray($$[$0-4], null,'pop', _$[$0-4].first_line,_$[$0-4].last_column); listaRGramar.push({'p':'NAT_ARREGLO -> id punto pop parizq pardec','g':'NAT_ARREGLO.val = array(id.lexval)'});
    break;
    case 91:
     this.$ = new Conversion($$[$0-5], $$[$0-1],'parse', _$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'NAT_FUN -> TIPO punto parse parizq EXPRESION pardec','g':'NAT_FUN.val = array(TIPO.val,Expresion.val)'});
    break;
    case 92:
     this.$ = new Conversion(null, $$[$0-1],'toint', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'NAT_FUN -> toint parizq EXPRESION pardec','g':'NAT_FUN.val = array(toint.lexval,Expresion.val)'});
    break;
    case 93:
     this.$ = new Conversion(null, $$[$0-1],'todouble', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'NAT_FUN -> todouble parizq EXPRESION pardec','g':'NAT_FUN.val = array(todouble.lexval,Expresion.val)'});
    break;
    case 94:
     this.$ = new Conversion(null, $$[$0-1],'typeof', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'NAT_FUN -> typeof parizq EXPRESION pardec','g':'NAT_FUN.val = array(typeof.lexval,Expresion.val)'});
    break;
    case 95:
     this.$ = new Conversion(null, $$[$0-1],'tostring', _$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'NAT_FUN -> tostring parizq EXPRESION pardec','g':'NAT_FUN.val = array(tostring.lexval,Expresion.val)'});
    break;
    case 96:
     this.$ = new Nativa($$[$0-3], $$[$0-1], false ,'pow', _$[$0-5].first_line,_$[$0-5].last_column); listaRGramar.push({'p':'NATIVAS -> pow parizq EXPRESION coma EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val,Expresion.val)'});
    break;
    case 97:
     this.$ = new Nativa($$[$0-1], null, true , 'sin',_$[$0-3].first_line, _$[$0-3].last_column); listaRGramar.push({'p':'NATIVAS -> sin parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});
    break;
    case 98:
     this.$ = new Nativa($$[$0-1], null, true , 'cos',_$[$0-3].first_line, _$[$0-3].last_column); listaRGramar.push({'p':'NATIVAS -> cos parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});
    break;
    case 99:
     this.$ = new Nativa($$[$0-1], null, true , 'tan',_$[$0-3].first_line, _$[$0-3].last_column); listaRGramar.push({'p':'NATIVAS -> tan parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});
    break;
    case 100:
     this.$ = new Nativa($$[$0-1], null, true , 'sqrt',_$[$0-3].first_line, _$[$0-3].last_column); listaRGramar.push({'p':'NATIVAS -> sqrt parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});
    break;
    case 101:
     this.$ = new Nativa($$[$0-1], null, true , 'log',_$[$0-3].first_line, _$[$0-3].last_column); listaRGramar.push({'p':'NATIVAS -> log parizq EXPRESION pardec','g':'NATIVAS.val = array(Expresion.val)'});
    break;
    case 102:
     this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION menor EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});
    break;
    case 103:
     this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION mayor EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});
    break;
    case 104:
     this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<=', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION menorigual EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});
    break;
    case 105:
     this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>=', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION mayorigual EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});
    break;
    case 106:
     this.$ = new Relacionales($$[$0-2], $$[$0], false ,'==', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION igualigual EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});
    break;
    case 107:
     this.$ = new Relacionales($$[$0-2], $$[$0], false ,'!=', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'RELACIONAL -> EXPRESION diferente EXPRESION ','g':'RELACIONAL.val = array(Expresion.val,Expresion.val)'});
    break;
    case 108:
     this.$ = new Logicas($$[$0-2], $$[$0], false ,'||', _$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'LOGICA -> EXPRESION or EXPRESION ','g':'LOGICA.val = array(Expresion.val,Expresion.val)'});
    break;
    case 109:
     this.$ = new Logicas($$[$0-2], $$[$0], false ,'&&', _$[$0-2].first_line, _$[$0-2].last_column); listaRGramar.push({'p':'LOGICA -> EXPRESION and EXPRESION ','g':'LOGICA.val = array(Expresion.val,Expresion.val)'});
    break;
    case 110:
     this.$ = new Logicas($$[$0], null, true , '!',_$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'LOGICA -> negacion EXPRESION ','g':'LOGICA.val = array(Expresion.val)'});
    break;
    case 111:
     this.$ = new Aritmetica($$[$0], null, true , 'UNARIO',_$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'LOGICA -> menos EXPRESION ','g':'LOGICA.val = array(Expresion.val)'});
    break;
    case 112:
     this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'UNARIA -> incremento id  ','g':'UNARIA.val = array(id.lexval)'});
    break;
    case 113:
     this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'UNARIA -> decremento id  ','g':'UNARIA.val = array(id.lexval)'});
    break;
    case 114:
     this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'UNARIA -> id incremento ','g':'UNARIA.val = array(id.lexval)'});
    break;
    case 115:
     this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'UNARIA -> id decremento ','g':'UNARIA.val = array(id.lexval)'});
    break;
    case 116:
    this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column); listaRGramar.push({'p':'PRIMITIVO -> entero','g':'PRIMITIVO.val = entero.lexval'});
    break;
    case 117:
    this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column); listaRGramar.push({'p':'PRIMITIVO -> decimal','g':'PRIMITIVO.val = decimal.lexval'});
    break;
    case 118:
    this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column); listaRGramar.push({'p':'PRIMITIVO -> caracter','g':'PRIMITIVO.val = caracter.lexval'});
    break;
    case 119:
    this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column); listaRGramar.push({'p':'PRIMITIVO -> cadena','g':'PRIMITIVO.val = cadena.lexval'});
    break;
    case 120:
    this.$ = new Identificador($$[$0], _$[$0].first_line, _$[$0].last_column); listaRGramar.push({'p':'PRIMITIVO -> id','g':'PRIMITIVO.val = id.lexval'});
    break;
    case 121:
    this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column); listaRGramar.push({'p':'PRIMITIVO -> true','g':'PRIMITIVO.val = true.lexval'});
    break;
    case 122:
    this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column); listaRGramar.push({'p':'PRIMITIVO -> false','g':'PRIMITIVO.val = false.lexval'});
    break;
    case 123:
    this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); listaRGramar.push({'p':'PRIMITIVO -> null','g':'PRIMITIVO.val = null.lexval'});
    break;
    case 124:
     this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> TIPO LISTAIDS','g':'DECLARACIONVARIABLE.val = array(TIPO.val, LISTAIDS.val)'});
    break;
    case 125:
     this.$ = new Declaracion($$[$0-3], [new Simbolos(1,null, $$[$0-2], $$[$0])], _$[$0-3].first_line, _$[$0-3].last_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> TIPO id igual EXPRESION','g':'DECLARACIONVARIABLE.val = array(TIPO.val, id.lexval, EXPRESION.val)'});
    break;
    case 126:
     this.$ = new Declaracion($$[$0-5], [new Simbolos(1,null, $$[$0-2], $$[$0])],_$[$0-5].first_line,_$[$0-5].first_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> TIPO corizq cordec id igual EXPRESION ','g':'DECLARACIONVARIABLE.val = array(TIPO.val, id.lexval, EXPRESION.val)'});
    break;
    case 127:
     this.$ = new DeclaracionStruct($$[$0-6],$$[$0-5],$$[$0-3],$$[$0-1],_$[$0-6].first_line,_$[$0-6].first_column); listaRGramar.push({'p':'DECLARACIONVARIABLE -> id id igual id parizq LISTAARRAY pardec','g':'DECLARACIONVARIABLE.val = array(id.lexval, id.lexval, id.lexval, LISTAARRAY.val)'});
    break;
    case 128:
      this.$ = $$[$0-2]; this.$.push($$[$0]); listaRGramar.push({'p':'LISTAARRAY -> LISTAARRAY coma EXPRESION','g':'LISTAARRAY.val = LISTAARRAY.add(EXPRESION.val)'});
    break;
    case 129:
      this.$ = []; this.$.push($$[$0]); listaRGramar.push({'p':'LISTAARRAY -> EXPRESION','g':'LISTAARRAY.val = EXPRESION.val'});
    break;
    case 130:
     $$[$0-2].push(new Simbolos(1,null, $$[$0], null)); this.$ = $$[$0-2]; listaRGramar.push({'p':'LISTAIDS -> LISTAIDS coma id','g':'LISTAIDS.val = LISTAARRAY.add(id.lexval)'});
    break;
    case 131:
     this.$ = [new Simbolos(1,null, $$[$0], null)]; listaRGramar.push({'p':'LISTAIDS -> id','g':'LISTAIDS.val = id.lexval'});
    break;
    case 132:
     this.$ = new Asignacion($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].last_column); listaRGramar.push({'p':'ASIGNACION_BLOQUE -> id igual EXPRESION','g':'ASIGNACION_BLOQUE.val = array(id.lexval, EXPRESION.val)'});
    break;
    case 133:
     this.$ = new AsignacionStruct(new Identificador($$[$0-4], _$[$0-4].first_line, _$[$0-4].last_column), new Identificador($$[$0-2], _$[$0-4].first_line, _$[$0-4].last_column),$$[$0], _$[$0-4].first_line, _$[$0-4].last_column); listaRGramar.push({'p':'ASIGNACION_BLOQUE -> id punto id igual EXPRESION ','g':'ASIGNACION_BLOQUE.val = array(id.lexval, id.lexval, EXPRESION.val)'});
    break;
    case 134:
     this.$ = new AsignacionArray($$[$0-5],$$[$0-3],$$[$0],_$[$0-5].first_line,_$[$0-5].first_column); listaRGramar.push({'p':'ASIGNACION_BLOQUE -> id corizq EXPRESION cordec igual EXPRESION','g':'ASIGNACION_BLOQUE.val = array(id.lexval, EXPRESION.val, EXPRESION.val)'});
    break;
    case 135:
     this.$ = new If( $$[$0-4], $$[$0-1], [], _$[$0-6].first_line, _$[$0-6].last_column ); listaRGramar.push({'p':'SENTENCIA_IF -> if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_IF.val = array(EXPRESION.val, INSTRUCCIONES.val)'});
    break;
    case 136:
     this.$ = new If( $$[$0-8], $$[$0-5], $$[$0-1], _$[$0-10].first_line, _$[$0-10].last_column ); listaRGramar.push({'p':'SENTENCIA_IF -> if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_IF.val = array(EXPRESION.val, INSTRUCCIONES.val, INSTRUCCIONES.val)'});
    break;
    case 137:
     this.$ = new If( $$[$0-6], $$[$0-3], [$$[$0]], _$[$0-8].first_line, _$[$0-8].last_column ); listaRGramar.push({'p':'SENTENCIA_IF -> if parizq EXPRESION pardec llaveizq INSTRUCCIONES llavedec else SENTENCIA_IF','g':'SENTENCIA_IF.val = array(EXPRESION.val, INSTRUCCIONES.val, SENTENCIA_IF.val)'});
    break;
    case 138:
     this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column); listaRGramar.push({'p':'SENTENCIA_SWITCH -> switch parizq EXPRESION pardec llaveizq LISTACASE SENTENCIA_DEFAULT llavedec','g':'SENTENCIA_SWITCH.val = array(LISTACASE.val, SENTENCIA_DEFAULT.val)'});
    break;
    case 139:
     this.$ = new Switch($$[$0-4],$$[$0-1],null,_$[$0-6].first_line,_$[$0-6].last_column); listaRGramar.push({'p':'SENTENCIA_SWITCH -> switch parizq EXPRESION pardec llaveizq LISTACASE llavedec','g':'SENTENCIA_SWITCH.val = array(LISTACASE.val)'});
    break;
    case 140:
     $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; listaRGramar.push({'p':'LISTACASE -> LISTACASE SENTENCIA_CASE','g':'LISTACASE.val = LISTACASE.add(SENTENCIA_CASE.val)'});
    break;
    case 141:
     this.$ = [$$[$0]]; listaRGramar.push({'p':'LISTACASE -> SENTENCIA_CASE','g':'LISTACASE.val = SENTENCIA_CASE.val'});
    break;
    case 142:
     this.$ = new Case($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column); listaRGramar.push({'p':'SENTENCIA_CASE -> case EXPRESION dspuntos INSTRUCCIONES','g':'SENTENCIA_CASE.val = array(EXPRESION.val,INSTRUCCIONES.val)'});
    break;
    case 143:
     this.$ =new Default($$[$0],_$[$0-2].first_line,_$[$0-2].last_column); listaRGramar.push({'p':'SENTENCIA_DEFAULT -> default dspuntos INSTRUCCIONES','g':'SENTENCIA_DEFAULT.val = array(INSTRUCCIONES.val)'});
    break;
    case 144:
     this.$ = new Break(); listaRGramar.push({'p':'SENTENCIA_BREAK -> break','g':'SENTENCIA_BREAK.val = array(break.lexval)'});
    break;
    case 145:
     this.$ = new Continue(); listaRGramar.push({'p':'SENTENCIA_CONTINUE -> continue','g':'SENTENCIA_CONTINUE.val = array(continue.lexval)'});
    break;
    case 146:
     this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].last_column); listaRGramar.push({'p':'SENTENCIA_TERNARIO -> EXPRESION ternario EXPRESION dspuntos EXPRESION','g':'SENTENCIA_TERNARIO.val = array(EXPRESION.val, EXPRESION.val, EXPRESION.val)'});
    break;
    case 147:
     this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line, _$[$0-10].last_column); listaRGramar.push({'p':'SENTENCIA_FOR -> for parizq DECLARACIONVARIABLE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_FOR.val = array(DECLARACIONVARIABLE.val,EXPRESION.val,EXPRESION.val,INSTRUCCIONES.val)'});
    break;
    case 148:
     this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line, _$[$0-10].last_column); listaRGramar.push({'p':'SENTENCIA_FOR -> for parizq ASIGNACION_BLOQUE ptcoma EXPRESION ptcoma EXPRESION pardec llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_FOR.val = array(ASIGNACION_BLOQUE.val,EXPRESION.val,EXPRESION.val,INSTRUCCIONES.val)'});
    break;
    case 149:
     this.$ = new ForEsp(new Simbolos(1,null, $$[$0-5], null),$$[$0-3],$$[$0-1],_$[$0-6].first_line, _$[$0-6].last_column); listaRGramar.push({'p':'SENTENCIA_FOR_ESP -> for id in EXPRESION llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_FOR_ESP.val = array(id.lexval,EXPRESION.val,INSTRUCCIONES.val)'});
    break;
    case 150:
     this.$ = new While( $$[$0-3], $$[$0-1], _$[$0-4].first_line, _$[$0-4].last_column); listaRGramar.push({'p':'SENTENCIA_WHILE -> while EXPRESION llaveizq INSTRUCCIONES llavedec','g':'SENTENCIA_WHILE.val = array(EXPRESION.val,INSTRUCCIONES.val)'});
    break;
    case 151:
     this.$ = new DoWhile($$[$0-2],$$[$0-6],_$[$0-8].first_line,_$[$0-8].first_column); listaRGramar.push({'p':'SENTENCIA_DOWHILE -> do llaveizq INSTRUCCIONES llavedec while parizq EXPRESION pardec ptcoma','g':'SENTENCIA_DOWHILE.val = array(INSTRUCCIONES.val, EXPRESION.val)'});
    break;
    case 152:
     this.$ = new Llamada($$[$0-2], [], _$[$0-2].first_line, _$[$0-2].last_column); listaRGramar.push({'p':'LLAMADA -> id parizq pardec','g':'LLAMADA.val = array(id.lexval)'});
    break;
    case 153:
     this.$ = new Llamada($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); listaRGramar.push({'p':'LLAMADA -> id parizq LISTAEXPRESIONES pardec','g':'LLAMADA.val = array(id.lexval, LISTAEXPRESIONES.val)'});
    break;
    case 154:
     this.$ = $$[$0-2]; this.$.push($$[$0]); listaRGramar.push({'p':'LISTAEXPRESIONES -> LISTAEXPRESIONES coma EXPRESION','g':'LISTAEXPRESIONES.val = LISTAEXPRESIONES.add(EXPRESION.val)'});
    break;
    case 155:
     this.$ = []; this.$.push($$[$0]); listaRGramar.push({'p':'LISTAEXPRESIONES -> EXPRESION','g':'LISTAEXPRESIONES.val = EXPRESION.val'});
    break;
    case 156:
     this.$ = new Return($$[$0]); listaRGramar.push({'p':'SENTENCIA_RETURN -> return EXPRESION ','g':'SENTENCIA_RETURN.val = array(EXPRESION.val)'});
    break;
    case 157:
     this.$ = new Return(null); listaRGramar.push({'p':'SENTENCIA_RETURN -> return ','g':'SENTENCIA_RETURN.val = array(null)'});
    break;
    }
    },
    table: [{2:$V0,3:1,4:2,6:3,7:4,9:5,10:$V1,11:$V2,16:7,20:$V3,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},{1:[3]},{2:$V0,5:[1,16],6:17,7:4,9:5,10:$V1,11:$V2,16:7,20:$V3,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},o($V9,[2,3]),{8:[1,18]},o($V9,[2,5]),o($V9,[2,6]),{11:[1,20],26:$Va,112:19},{11:[1,22]},{11:[1,23],17:[1,24]},{11:[1,25]},o($Vb,[2,22]),o($Vb,[2,23]),o($Vb,[2,24]),o($Vb,[2,25]),o($Vb,[2,26]),{1:[2,1]},o($V9,[2,2]),o($V9,[2,4]),{8:[2,124],23:[1,26]},o($Vc,$Vd,{12:28,18:$Ve,113:$Vf}),{27:[1,30]},{12:32,18:$Ve,113:$Vg},{12:33,18:$Ve},{18:[1,34]},{13:[1,35]},{11:[1,36]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:37,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{13:[1,78]},{11:$VG,16:82,19:[1,80],21:79,25:81,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},{11:[1,84]},{11:[1,85]},{13:[1,86]},{13:[1,87]},{19:[1,88]},{11:$VG,16:82,21:89,25:81,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},o($Vc,[2,130]),{8:[2,125],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},o($V_,[2,47]),o($V_,[2,48]),o($V_,[2,49]),o($V_,[2,50]),o($V_,[2,51]),o($V_,[2,52]),o($V_,[2,53]),o($V_,[2,54]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:109,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,56]),o($V_,[2,57]),o($V_,[2,58]),o($V_,[2,59]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:111,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,61:110,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,61]),o($V_,[2,62]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:112,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:113,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{18:[1,114]},{18:[1,115]},{18:[1,116]},{18:[1,117]},{18:[1,118]},{18:[1,119]},{64:[1,120]},{18:[1,121]},{18:[1,122]},{18:[1,123]},{18:[1,124]},{11:[1,125]},{11:[1,126]},o($V_,[2,120],{18:$V$,103:$V01,104:$V11}),o($V_,[2,116]),o($V_,[2,117]),o($V_,[2,118]),o($V_,[2,119]),o($V_,[2,121]),o($V_,[2,122]),o($V_,[2,123]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:130,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{2:$V21,7:133,11:$V31,14:131,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{19:[1,161],23:$Ve1},{13:[2,16]},o($Vf1,[2,18]),{11:[1,163],26:[1,164]},{11:[1,165]},{113:[1,166]},{18:[1,167]},{2:$V21,7:133,11:$V31,14:168,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,14:169,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{13:[1,170]},{15:[1,171],23:$Ve1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:172,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:173,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:174,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:175,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:176,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:177,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:178,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:179,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:180,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:181,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:182,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:183,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:184,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:185,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:186,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:[1,192],76:[1,187],77:[1,188],78:[1,189],79:[1,190],80:[1,191]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:193,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:194,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,67:[1,195],68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{69:[1,196],70:[1,197],71:[1,198],72:[1,199],73:[1,200],74:[1,201],75:[1,202]},{19:[1,203],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{23:$Vg1,27:[1,204]},o($Vh1,[2,129],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ}),o($Vi1,[2,110],{26:$VH,64:$VI,68:$VJ,74:$VP,75:$VQ}),o($Vj1,[2,111],{26:$VH,64:$VI,68:$VJ,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ}),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:206,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:207,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:208,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:209,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:210,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:211,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{83:[1,212]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:213,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:214,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:215,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:216,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,112]),o($V_,[2,113]),o($V_,[2,114]),o($V_,[2,115]),{11:$Vh,16:62,18:$Vi,19:[1,217],26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:219,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF,129:218},o($Vk1,[2,69],{26:$VH,64:$VI}),{2:$V21,7:133,11:$V31,15:[1,220],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($Vl1,[2,28]),{8:[1,222]},{8:[1,223]},{8:[1,224]},o($Vl1,[2,32]),o($Vl1,[2,33]),o($Vl1,[2,34]),o($Vl1,[2,35]),o($Vl1,[2,36]),o($Vl1,[2,37]),{8:[1,225]},{8:[1,226]},{8:[1,227]},{8:[1,228]},{8:[1,229]},{8:[1,230]},o($Vl1,[2,44]),{11:[1,231],26:$Va,112:19},{11:$Vm1,18:$V$,26:$Vn1,64:[1,234],103:$V01,104:$V11,113:$Vo1},{18:[1,236]},{18:[1,237]},{18:[1,238]},{18:[1,239]},{11:[1,241],18:[1,240]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:242,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{13:[1,243]},{8:[2,144]},{8:[2,157],11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:244,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{8:[2,145]},{13:[2,15]},{11:$VG,16:82,25:245,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},o($Vf1,[2,19]),{27:[1,246]},o($Vf1,[2,21]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:247,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:111,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,61:248,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{2:$V21,7:133,11:$V31,15:[1,249],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,15:[1,250],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,14:251,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($V9,[2,11]),o($Vj1,[2,77],{26:$VH,64:$VI,68:$VJ,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ}),o($Vj1,[2,78],{26:$VH,64:$VI,68:$VJ,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ}),o($Vi1,[2,79],{26:$VH,64:$VI,68:$VJ,74:$VP,75:$VQ}),o($Vi1,[2,80],{26:$VH,64:$VI,68:$VJ,74:$VP,75:$VQ}),o($Vi1,[2,81],{26:$VH,64:$VI,68:$VJ,74:$VP,75:$VQ}),o([8,13,19,23,27,65,69,70,71,72,73,74,94,95,96,97,98,99,100,101,124],[2,82],{26:$VH,64:$VI,68:$VJ,75:$VQ}),o([8,13,19,23,27,65,69,70,71,72,73,74,75,94,95,96,97,98,99,100,101,124],[2,83],{26:$VH,64:$VI,68:$VJ}),o($Vp1,[2,102],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,98:$VV,99:$VW}),o($Vp1,[2,103],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,98:$VV,99:$VW}),o($Vp1,[2,104],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,98:$VV,99:$VW}),o($Vp1,[2,105],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,98:$VV,99:$VW}),o($Vq1,[2,106],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ}),o($Vq1,[2,107],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ}),o([8,13,19,23,27,65,100,124],[2,108],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,101:$VY}),o([8,13,19,23,27,65,100,101,124],[2,109],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW}),{18:[1,252]},{18:[1,253]},{18:[1,254]},{18:[1,255]},{18:[1,256]},o($V_,[2,63]),{26:$VH,64:$VI,65:[1,257],68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{26:$VH,27:[1,258],64:$VI,65:[1,259],68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{65:[1,260]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:261,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:262,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:263,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:264,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:265,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:266,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:267,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,55]),o($V_,[2,60]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:268,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{23:[1,269],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,270],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,271],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,272],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,273],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,274],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{18:[1,275]},{19:[1,276],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,277],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,278],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,279],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},o($V_,[2,152]),{19:[1,280],23:[1,281]},o($Vr1,[2,155],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ}),o($V9,[2,8]),o($Vl1,[2,27]),o($Vl1,[2,29]),o($Vl1,[2,30]),o($Vl1,[2,31]),o($Vl1,[2,38]),o($Vl1,[2,39]),o($Vl1,[2,40]),o($Vl1,[2,41]),o($Vl1,[2,42]),o($Vl1,[2,43]),o($Vc,$Vd,{113:$Vf}),{113:$Vg},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:282,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vs1,81:[1,284],82:[1,285]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:286,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:287,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:288,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:289,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:290,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{7:291,11:[1,293],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,34:292},{126:[1,294]},{13:[1,295],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{2:$V21,7:133,11:$V31,14:296,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{8:[2,156],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},o($Vf1,[2,17]),{11:[1,297]},{8:[2,126],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,298],23:$Vg1},o($V9,[2,9]),o($V9,[2,7]),{2:$V21,7:133,11:$V31,15:[1,299],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:300,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:301,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{19:[1,302]},{19:[1,303]},{19:[1,304]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:305,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,64]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:306,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,66:[1,307],68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:308,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,66:[1,309],68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($Vk1,[2,70],{26:$VH,64:$VI}),o($Vk1,[2,71],{26:$VH,64:$VI}),o($Vk1,[2,72],{26:$VH,64:$VI}),o($Vk1,[2,73],{26:$VH,64:$VI}),o($Vk1,[2,74],{26:$VH,64:$VI}),o($Vk1,[2,75],{26:$VH,64:$VI}),o($Vk1,[2,76],{26:$VH,64:$VI}),o($Vh1,[2,128],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ}),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:310,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,97]),o($V_,[2,98]),o($V_,[2,99]),o($V_,[2,100]),o($V_,[2,101]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:311,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,92]),o($V_,[2,93]),o($V_,[2,94]),o($V_,[2,95]),o($V_,[2,153]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:312,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{8:[2,132],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{113:[1,313]},{18:[1,314]},{18:[1,315]},{26:$VH,27:[1,316],64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,317],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,318],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,319],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,320],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{8:[1,321]},{8:[1,322]},{11:$Vm1,26:$Vn1,64:[1,323],113:$Vo1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:324,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{2:$V21,7:133,11:$V31,14:325,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,15:[1,326],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($Vf1,[2,20]),{8:[2,127]},o($V9,[2,10]),{19:[1,327],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{23:[1,328],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},o($V_,[2,86]),o($V_,[2,87]),o($V_,[2,88]),o([8,13,19,23,27,65],[2,146],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ}),{26:$VH,27:[1,329],64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{27:[1,330]},{26:$VH,27:[1,331],64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{27:[1,332]},{19:[1,333],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,334],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},o($Vr1,[2,154],{26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ}),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:335,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:336,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{19:[1,337]},{113:[1,338]},{8:[2,45]},{8:[2,46]},{13:[1,339]},{13:[1,340]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:341,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:342,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vs1},{13:[1,343],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{2:$V21,7:133,11:$V31,15:[1,344],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{127:[1,345]},o($V_,[2,84]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:346,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,65]),o($V_,[2,66]),o($V_,[2,67]),o($V_,[2,68]),o($V_,[2,96]),o($V_,[2,91]),{8:[2,133],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,347],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{8:[2,90]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:348,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{2:$V21,7:133,11:$V31,14:349,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{117:350,119:351,120:$Vt1},{8:[1,353],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{8:[1,354],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{2:$V21,7:133,11:$V31,14:355,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($Vl1,[2,150]),{18:[1,356]},{19:[1,357],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{8:[2,89]},{8:[2,134],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{2:$V21,7:133,11:$V31,15:[1,358],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{15:[1,360],118:359,119:361,120:$Vt1,121:[1,362]},o($Vu1,[2,141]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:363,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:364,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:365,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},{2:$V21,7:133,11:$V31,15:[1,366],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:45,46:49,49:367,51:38,52:39,53:40,54:41,55:42,56:43,57:44,58:47,59:48,60:50,62:52,63:53,68:$Vk,70:$Vl,84:$Vm,85:$Vn,86:$Vo,87:$Vp,88:$Vq,89:$Vr,90:$Vs,91:$Vt,92:$Vu,93:$Vv,102:$Vw,103:$Vx,104:$Vy,105:$Vz,106:$VA,107:$VB,108:$VC,109:$VD,110:$VE,111:$VF},o($V_,[2,85]),o($Vl1,[2,135],{115:[1,368]}),{15:[1,369]},o($Vl1,[2,139]),o($Vu1,[2,140]),{65:[1,370]},{26:$VH,64:$VI,65:[1,371],68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,372],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{19:[1,373],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},o($Vl1,[2,149]),{19:[1,374],26:$VH,64:$VI,68:$VJ,69:$VK,70:$VL,71:$VM,72:$VN,73:$VO,74:$VP,75:$VQ,94:$VR,95:$VS,96:$VT,97:$VU,98:$VV,99:$VW,100:$VX,101:$VY,124:$VZ},{13:[1,375],36:376,114:$V61},o($Vl1,[2,138]),{2:$V21,7:133,11:$V31,14:377,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,14:378,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{13:[1,379]},{13:[1,380]},{8:[1,381]},{2:$V21,7:133,11:$V31,14:382,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($Vl1,[2,137]),{2:$V21,7:133,11:$V31,15:[2,143],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($Vu1,[2,142],{7:133,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,16:149,33:221,2:$V21,11:$V31,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1}),{2:$V21,7:133,11:$V31,14:383,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,14:384,16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:132,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($Vl1,[2,151]),{2:$V21,7:133,11:$V31,15:[1,385],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,15:[1,386],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},{2:$V21,7:133,11:$V31,15:[1,387],16:149,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:221,34:134,35:135,36:136,37:137,38:138,39:139,40:140,41:141,42:142,43:143,44:144,45:145,46:146,47:147,48:$V41,50:$V51,103:$Vx,104:$Vy,114:$V61,116:$V71,122:$V81,123:$V91,125:$Va1,127:$Vb1,128:$Vc1,130:$Vd1},o($Vl1,[2,136]),o($Vl1,[2,147]),o($Vl1,[2,148])],
    defaultActions: {16:[2,1],80:[2,16],158:[2,144],160:[2,145],161:[2,15],298:[2,127],317:[2,45],318:[2,46],337:[2,90],347:[2,89]},
    parseError: function parseError (str, hash) {
        if (hash.recoverable) {
            this.trace(str);
        } else {
            var error = new Error(str);
            error.hash = hash;
            throw error;
        }
    },
    parse: function parse (input) {
        var self = this,
            stack = [0],
            tstack = [], // token stack
            vstack = [null], // semantic value stack
            lstack = [], // location stack
            table = this.table,
            yytext = '',
            yylineno = 0,
            yyleng = 0,
            recovering = 0,
            TERROR = 2,
            EOF = 1;
    
        var args = lstack.slice.call(arguments, 1);
    
        //this.reductionCount = this.shiftCount = 0;
    
        var lexer = Object.create(this.lexer);
        var sharedState = { yy: {} };
        // copy state
        for (var k in this.yy) {
          if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
          }
        }
    
        lexer.setInput(input, sharedState.yy);
        sharedState.yy.lexer = lexer;
        sharedState.yy.parser = this;
        if (typeof lexer.yylloc == 'undefined') {
            lexer.yylloc = {};
        }
        var yyloc = lexer.yylloc;
        lstack.push(yyloc);
    
        var ranges = lexer.options && lexer.options.ranges;
    
        if (typeof sharedState.yy.parseError === 'function') {
            this.parseError = sharedState.yy.parseError;
        } else {
            this.parseError = Object.getPrototypeOf(this).parseError;
        }
    
        function popStack (n) {
            stack.length = stack.length - 2 * n;
            vstack.length = vstack.length - n;
            lstack.length = lstack.length - n;
        }
    
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            // if token isn't its numeric value, convert
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    
        var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
        while (true) {
            // retreive state number from top of stack
            state = stack[stack.length - 1];
    
            // use default actions if available
            if (this.defaultActions[state]) {
                action = this.defaultActions[state];
            } else {
                if (symbol === null || typeof symbol == 'undefined') {
                    symbol = lex();
                }
                // read action for current state and first input
                action = table[state] && table[state][symbol];
            }
    
    _handle_error:
            // handle parse error
            if (typeof action === 'undefined' || !action.length || !action[0]) {
                var error_rule_depth;
                var errStr = '';
    
                // Return the rule stack depth where the nearest error rule can be found.
                // Return FALSE when no error recovery rule was found.
                function locateNearestErrorRecoveryRule(state) {
                    var stack_probe = stack.length - 1;
                    var depth = 0;
    
                    // try to recover from error
                    for(;;) {
                        // check for error recovery rule in this state
                        if ((TERROR.toString()) in table[state]) {
                            return depth;
                        }
                        if (state === 0 || stack_probe < 2) {
                            return false; // No suitable error recovery rule available.
                        }
                        stack_probe -= 2; // popStack(1): [symbol, action]
                        state = stack[stack_probe];
                        ++depth;
                    }
                }
    
                if (!recovering) {
                    // first see if there's any chance at hitting an error recovery rule:
                    error_rule_depth = locateNearestErrorRecoveryRule(state);
    
                    // Report error
                    expected = [];
                    for (p in table[state]) {
                        if (this.terminals_[p] && p > TERROR) {
                            expected.push("'"+this.terminals_[p]+"'");
                        }
                    }
                    if (lexer.showPosition) {
                        errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                    } else {
                        errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                      (symbol == EOF ? "end of input" :
                                                  ("'"+(this.terminals_[symbol] || symbol)+"'"));
                    }
                    this.parseError(errStr, {
                        text: lexer.match,
                        token: this.terminals_[symbol] || symbol,
                        line: lexer.yylineno,
                        loc: yyloc,
                        expected: expected,
                        recoverable: (error_rule_depth !== false)
                    });
                } else if (preErrorSymbol !== EOF) {
                    error_rule_depth = locateNearestErrorRecoveryRule(state);
                }
    
                // just recovered from another error
                if (recovering == 3) {
                    if (symbol === EOF || preErrorSymbol === EOF) {
                        throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                    }
    
                    // discard current lookahead and grab another
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    symbol = lex();
                }
    
                // try to recover from error
                if (error_rule_depth === false) {
                    throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
                }
                popStack(error_rule_depth);
    
                preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
                symbol = TERROR;         // insert generic error symbol as new lookahead
                state = stack[stack.length-1];
                action = table[state] && table[state][TERROR];
                recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
            }
    
            // this shouldn't happen, unless resolve defaults are off
            if (action[0] instanceof Array && action.length > 1) {
                throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
            }
    
            switch (action[0]) {
                case 1: // shift
                    //this.shiftCount++;
    
                    stack.push(symbol);
                    vstack.push(lexer.yytext);
                    lstack.push(lexer.yylloc);
                    stack.push(action[1]); // push state
                    symbol = null;
                    if (!preErrorSymbol) { // normal execution/no error
                        yyleng = lexer.yyleng;
                        yytext = lexer.yytext;
                        yylineno = lexer.yylineno;
                        yyloc = lexer.yylloc;
                        if (recovering > 0) {
                            recovering--;
                        }
                    } else {
                        // error just occurred, resume old lookahead f/ before error
                        symbol = preErrorSymbol;
                        preErrorSymbol = null;
                    }
                    break;
    
                case 2:
                    // reduce
                    //this.reductionCount++;
    
                    len = this.productions_[action[1]][1];
    
                    // perform semantic action
                    yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                    // default location, uses first token for firsts, last for lasts
                    yyval._$ = {
                        first_line: lstack[lstack.length-(len||1)].first_line,
                        last_line: lstack[lstack.length-1].last_line,
                        first_column: lstack[lstack.length-(len||1)].first_column,
                        last_column: lstack[lstack.length-1].last_column
                    };
                    if (ranges) {
                      yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                    }
                    r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
    
                    if (typeof r !== 'undefined') {
                        return r;
                    }
    
                    // pop off stack
                    if (len) {
                        stack = stack.slice(0,-1*len*2);
                        vstack = vstack.slice(0, -1*len);
                        lstack = lstack.slice(0, -1*len);
                    }
    
                    stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                    vstack.push(yyval.$);
                    lstack.push(yyval._$);
                    // goto new state = table[STATE][NONTERMINAL]
                    newState = table[stack[stack.length-2]][stack[stack.length-1]];
                    stack.push(newState);
                    break;
    
                case 3:
                    // accept
                    return true;
            }
    
        }
    
        return true;
    }};
    
        let listaErrores =[];
        let listaRGramar =[];
    
        const {Primitivo} = require("../Expresiones/Primitivo");
        const {Print} = require("../Instrucciones/Print");
        const {Println} = require("../Instrucciones/Println");
        const {Aritmetica} = require("../Expresiones/Operaciones/Aritmetica");
        const {AritArreglo} = require("../Expresiones/Operaciones/AritArreglo");
        const {Nativa} = require("../Expresiones/Operaciones/Nativa");
        const {Conversion} = require("../Expresiones/Operaciones/Conversion");
        const {Cadenas} = require("../Expresiones/Operaciones/Cadenas");
        const {Relacionales} = require("../Expresiones/Operaciones/Relacionales");
        const {Logicas} = require("../Expresiones/Operaciones/Logicas");
        const {Declaracion} = require("../Instrucciones/Declaracion");
        const {Asignacion} = require("../Instrucciones/Asignacion");
        const {Simbolos} = require("../TablaSimbolos/Simbolos");
        const {Tipo} = require("../TablaSimbolos/Tipo");
        const {Identificador} = require("../Expresiones/Identificador");
        const {If} = require("../Instrucciones/Control/If");
        const {Switch} = require("../Instrucciones/Control/Switch");
        const {Case} = require("../Instrucciones/Control/Case");
        const {Default} = require("../Instrucciones/Control/Default");
        const {Break} = require("../Instrucciones/Transferencia/Break");
        const {Continue} = require("../Instrucciones/Transferencia/Continue");
        const {Ternario} = require("../Expresiones/Ternario");
        const {For} = require("../Instrucciones/Ciclica/For");
        const {ForEsp} = require("../Instrucciones/Ciclica/ForEsp");
        const {While} = require("../Instrucciones/Ciclica/While");
        const {DoWhile} = require("../Instrucciones/Ciclica/DoWhile");
        const {Funcion} = require("../Instrucciones/Funcion");
        const {Llamada} = require("../Instrucciones/Llamada");
        const {Return} = require("../Instrucciones/Transferencia/Return");
        const {AsignacionArray} = require("../Instrucciones/AsignacionArray");
        const {ManejoArray} = require("../Instrucciones/ManejoArray");
        const {AsignacionStruct} = require("../Instrucciones/AsignacionStruct");
        const {Arreglo} = require("../Expresiones/Arreglo");
        const {Errores} = require("../AST/Errores");
        const {Struct} = require("../Expresiones/Struct");
        const {DeclaracionStruct} = require("../Instrucciones/DeclaracionStruct");
        const {AccesoStruct} = require("../Expresiones/AccesoStruct");
        const {AccesoArreglo} = require("../Expresiones/AccesoArreglo");
    /* generated by jison-lex 0.3.4 */
    var lexer = (function(){
    var lexer = ({
    
    EOF:1,
    
    parseError:function parseError(str, hash) {
            if (this.yy.parser) {
                this.yy.parser.parseError(str, hash);
            } else {
                throw new Error(str);
            }
        },
    
    // resets the lexer, sets new input
    setInput:function (input, yy) {
            this.yy = yy || this.yy || {};
            this._input = input;
            this._more = this._backtrack = this.done = false;
            this.yylineno = this.yyleng = 0;
            this.yytext = this.matched = this.match = '';
            this.conditionStack = ['INITIAL'];
            this.yylloc = {
                first_line: 1,
                first_column: 0,
                last_line: 1,
                last_column: 0
            };
            if (this.options.ranges) {
                this.yylloc.range = [0,0];
            }
            this.offset = 0;
            return this;
        },
    
    // consumes and returns one char from the input
    input:function () {
            var ch = this._input[0];
            this.yytext += ch;
            this.yyleng++;
            this.offset++;
            this.match += ch;
            this.matched += ch;
            var lines = ch.match(/(?:\r\n?|\n).*/g);
            if (lines) {
                this.yylineno++;
                this.yylloc.last_line++;
            } else {
                this.yylloc.last_column++;
            }
            if (this.options.ranges) {
                this.yylloc.range[1]++;
            }
    
            this._input = this._input.slice(1);
            return ch;
        },
    
    // unshifts one char (or a string) into the input
    unput:function (ch) {
            var len = ch.length;
            var lines = ch.split(/(?:\r\n?|\n)/g);
    
            this._input = ch + this._input;
            this.yytext = this.yytext.substr(0, this.yytext.length - len);
            //this.yyleng -= len;
            this.offset -= len;
            var oldLines = this.match.split(/(?:\r\n?|\n)/g);
            this.match = this.match.substr(0, this.match.length - 1);
            this.matched = this.matched.substr(0, this.matched.length - 1);
    
            if (lines.length - 1) {
                this.yylineno -= lines.length - 1;
            }
            var r = this.yylloc.range;
    
            this.yylloc = {
                first_line: this.yylloc.first_line,
                last_line: this.yylineno + 1,
                first_column: this.yylloc.first_column,
                last_column: lines ?
                    (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                     + oldLines[oldLines.length - lines.length].length - lines[0].length :
                  this.yylloc.first_column - len
            };
    
            if (this.options.ranges) {
                this.yylloc.range = [r[0], r[0] + this.yyleng - len];
            }
            this.yyleng = this.yytext.length;
            return this;
        },
    
    // When called from action, caches matched text and appends it on next action
    more:function () {
            this._more = true;
            return this;
        },
    
    // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
    reject:function () {
            if (this.options.backtrack_lexer) {
                this._backtrack = true;
            } else {
                return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                    text: "",
                    token: null,
                    line: this.yylineno
                });
    
            }
            return this;
        },
    
    // retain first n characters of the match
    less:function (n) {
            this.unput(this.match.slice(n));
        },
    
    // displays already matched input, i.e. for error messages
    pastInput:function () {
            var past = this.matched.substr(0, this.matched.length - this.match.length);
            return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
        },
    
    // displays upcoming input, i.e. for error messages
    upcomingInput:function () {
            var next = this.match;
            if (next.length < 20) {
                next += this._input.substr(0, 20-next.length);
            }
            return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
        },
    
    // displays the character position where the lexing error occurred, i.e. for error messages
    showPosition:function () {
            var pre = this.pastInput();
            var c = new Array(pre.length + 1).join("-");
            return pre + this.upcomingInput() + "\n" + c + "^";
        },
    
    // test the lexed token: return FALSE when not a match, otherwise return token
    test_match:function(match, indexed_rule) {
            var token,
                lines,
                backup;
    
            if (this.options.backtrack_lexer) {
                // save context
                backup = {
                    yylineno: this.yylineno,
                    yylloc: {
                        first_line: this.yylloc.first_line,
                        last_line: this.last_line,
                        first_column: this.yylloc.first_column,
                        last_column: this.yylloc.last_column
                    },
                    yytext: this.yytext,
                    match: this.match,
                    matches: this.matches,
                    matched: this.matched,
                    yyleng: this.yyleng,
                    offset: this.offset,
                    _more: this._more,
                    _input: this._input,
                    yy: this.yy,
                    conditionStack: this.conditionStack.slice(0),
                    done: this.done
                };
                if (this.options.ranges) {
                    backup.yylloc.range = this.yylloc.range.slice(0);
                }
            }
    
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) {
                this.yylineno += lines.length;
            }
            this.yylloc = {
                first_line: this.yylloc.last_line,
                last_line: this.yylineno + 1,
                first_column: this.yylloc.last_column,
                last_column: lines ?
                             lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                             this.yylloc.last_column + match[0].length
            };
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._backtrack = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
            if (this.done && this._input) {
                this.done = false;
            }
            if (token) {
                return token;
            } else if (this._backtrack) {
                // recover context
                for (var k in backup) {
                    this[k] = backup[k];
                }
                return false; // rule action called reject() implying the next rule should be tested instead.
            }
            return false;
        },
    
    // return next match in input
    next:function () {
            if (this.done) {
                return this.EOF;
            }
            if (!this._input) {
                this.done = true;
            }
    
            var token,
                match,
                tempMatch,
                index;
            if (!this._more) {
                this.yytext = '';
                this.match = '';
            }
            var rules = this._currentRules();
            for (var i = 0; i < rules.length; i++) {
                tempMatch = this._input.match(this.rules[rules[i]]);
                if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                    match = tempMatch;
                    index = i;
                    if (this.options.backtrack_lexer) {
                        token = this.test_match(tempMatch, rules[i]);
                        if (token !== false) {
                            return token;
                        } else if (this._backtrack) {
                            match = false;
                            continue; // rule action called reject() implying a rule MISmatch.
                        } else {
                            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                            return false;
                        }
                    } else if (!this.options.flex) {
                        break;
                    }
                }
            }
            if (match) {
                token = this.test_match(match, rules[index]);
                if (token !== false) {
                    return token;
                }
                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                return false;
            }
            if (this._input === "") {
                return this.EOF;
            } else {
                return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                    text: "",
                    token: null,
                    line: this.yylineno
                });
            }
        },
    
    // return next match that has a token
    lex:function lex () {
            var r = this.next();
            if (r) {
                return r;
            } else {
                return this.lex();
            }
        },
    
    // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
    begin:function begin (condition) {
            this.conditionStack.push(condition);
        },
    
    // pop the previously active lexer condition state off the condition stack
    popState:function popState () {
            var n = this.conditionStack.length - 1;
            if (n > 0) {
                return this.conditionStack.pop();
            } else {
                return this.conditionStack[0];
            }
        },
    
    // produce the lexer rule set which is active for the currently active lexer condition state
    _currentRules:function _currentRules () {
            if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
            } else {
                return this.conditions["INITIAL"].rules;
            }
        },
    
    // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
    topState:function topState (n) {
            n = this.conditionStack.length - 1 - Math.abs(n || 0);
            if (n >= 0) {
                return this.conditionStack[n];
            } else {
                return "INITIAL";
            }
        },
    
    // alias for begin(condition)
    pushState:function pushState (condition) {
            this.begin(condition);
        },
    
    // return the number of states currently on the stack
    stateStackSize:function stateStackSize() {
            return this.conditionStack.length;
        },
    options: {"case-sensitive":true},
    performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
    var YYSTATE=YY_START;
    switch($avoiding_name_collisions) {
    case 0:
    break;
    case 1:
    break;
    case 2:
    break;
    case 3:return 106       // NUMERICO
    break;
    case 4:return 105
    break;
    case 5:return 100        //RELACIONAL
    break;
    case 6:return 101
    break;
    case 7:return 103
    break;
    case 8:return 104
    break;
    case 9:return 74
    break;
    case 10:return 75
    break;
    case 11:return 69           //ARITEMETICO
    break;
    case 12:return 70
    break;
    case 13:return 71
    break;
    case 14:return 72
    break;
    case 15:return 73
    break;
    case 16:return 96   // LOGICO
    break;
    case 17:return 97
    break;
    case 18:return 99
    break;
    case 19:return 98
    break;
    case 20:return 95
    break;
    case 21:return 94
    break;
    case 22:return 102
    break;
    case 23:return 124   //TERNARIO
    break;
    case 24:return 65
    break;
    case 25:return 64
    break;
    case 26:return 13   //GRAMATICO
    break;
    case 27:return 15
    break;
    case 28:return 18
    break;
    case 29:return 19
    break;
    case 30:return 26
    break;
    case 31:return 27
    break;
    case 32:return 8
    break;
    case 33:return 23
    break;
    case 34:return 113
    break;
    case 35:return 68
    break;
    case 36: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 107; 
    break;
    case 37: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 108; 
    break;
    case 38:return 87
    break;
    case 39:return 29      //TIPOS
    break;
    case 40:return 30
    break;
    case 41:return 31
    break;
    case 42:return 32
    break;
    case 43:return 28
    break;
    case 44:return 109
    break;
    case 45:return 110
    break;
    case 46:return 88     //NATIVAS
    break;
    case 47:return 89
    break;
    case 48:return 90
    break;
    case 49:return 91
    break;
    case 50:return 92
    break;
    case 51:return 93
    break;
    case 52:return 48
    break;
    case 53:return 50
    break;
    case 54:return 83
    break;
    case 55:return 84
    break;
    case 56:return 85
    break;
    case 57:return 86
    break;
    case 58:return 114
    break;
    case 59:return 115
    break;
    case 60:return 116
    break;
    case 61:return 120
    break;
    case 62:return 121
    break;
    case 63:return 122
    break;
    case 64:return 123
    break;
    case 65:return 67
    break;
    case 66:return 66
    break;
    case 67:return 127
    break;
    case 68:return 128
    break;
    case 69:return 125
    break;
    case 70:return 126
    break;
    case 71:return 81
    break;
    case 72:return 82
    break;
    case 73:return 78
    break;
    case 74:return 77
    break;
    case 75:return 76
    break;
    case 76:return 10
    break;
    case 77:return 130
    break;
    case 78:return 17
    break;
    case 79:return 111
    break;
    case 80:return 20
    break;
    case 81:return 79
    break;
    case 82:return 80
    break;
    case 83:return 11
    break;
    case 84:return 5
    break;
    case 85: listaErrores.push( new Errores('Lexico', `El caracter no portenece al lenguaje ${yy_.yytext}`,  yy_.yylloc.first_line, yy_.yylloc.first_column)); 
    break;
    }
    },
    rules: [/^(?:[ \r\t\n]+)/,/^(?:\/\/.([^\n])*)/,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/,/^(?:[0-9]+(\.[0-9]+))/,/^(?:[0-9]+)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:\+\+)/,/^(?:--)/,/^(?:&)/,/^(?:\^)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:<=)/,/^(?:>=)/,/^(?:!=)/,/^(?:==)/,/^(?:>)/,/^(?:<)/,/^(?:!)/,/^(?:\?)/,/^(?::)/,/^(?:\.)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?:,)/,/^(?:=)/,/^(?:#)/,/^(?:[\'\‘\’].[\'\’\‘])/,/^(?:[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”])/,/^(?:string\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:boolean\b)/,/^(?:String\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:pow\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:sqrt\b)/,/^(?:log10\b)/,/^(?:print\b)/,/^(?:println\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:typeof\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:in\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:length\b)/,/^(?:subString\b)/,/^(?:caracterOfPosition\b)/,/^(?:void\b)/,/^(?:return\b)/,/^(?:main\b)/,/^(?:null\b)/,/^(?:struct\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*)/,/^(?:$)/,/^(?:.)/],
    conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85],"inclusive":true}}
    });
    return lexer;
    })();
    parser.lexer = lexer;
    function Parser () {
      this.yy = {};
    }
    Parser.prototype = parser;parser.Parser = Parser;
    return new Parser;
    })();
    
    
    if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = gramar;
    exports.Parser = gramar.Parser;
    exports.parse = function () { return gramar.parse.apply(gramar, arguments); };
    exports.main = function commonjsMain (args) {
        if (!args[1]) {
            console.log('Usage: '+args[0]+' FILE');
            process.exit(1);
        }
        var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
        return exports.parser.parse(source);
    };
    if (typeof module !== 'undefined' && require.main === module) {
      exports.main(process.argv.slice(1));
    }
    }
}).call(this)}).call(this,require('_process'))
},{"../AST/Errores":6,"../Expresiones/AccesoArreglo":10,"../Expresiones/AccesoStruct":11,"../Expresiones/Arreglo":12,"../Expresiones/Identificador":13,"../Expresiones/Operaciones/AritArreglo":14,"../Expresiones/Operaciones/Aritmetica":15,"../Expresiones/Operaciones/Cadenas":16,"../Expresiones/Operaciones/Conversion":17,"../Expresiones/Operaciones/Logicas":18,"../Expresiones/Operaciones/Nativa":19,"../Expresiones/Operaciones/Relacionales":21,"../Expresiones/Primitivo":22,"../Expresiones/Struct":23,"../Expresiones/Ternario":24,"../Instrucciones/Asignacion":26,"../Instrucciones/AsignacionArray":27,"../Instrucciones/AsignacionStruct":28,"../Instrucciones/Ciclica/DoWhile":29,"../Instrucciones/Ciclica/For":30,"../Instrucciones/Ciclica/ForEsp":31,"../Instrucciones/Ciclica/While":32,"../Instrucciones/Control/Case":33,"../Instrucciones/Control/Default":34,"../Instrucciones/Control/If":35,"../Instrucciones/Control/Switch":36,"../Instrucciones/Declaracion":37,"../Instrucciones/DeclaracionStruct":38,"../Instrucciones/Funcion":39,"../Instrucciones/Llamada":40,"../Instrucciones/ManejoArray":41,"../Instrucciones/Print":42,"../Instrucciones/Println":43,"../Instrucciones/Transferencia/Break":44,"../Instrucciones/Transferencia/Continue":45,"../Instrucciones/Transferencia/Return":46,"../TablaSimbolos/Simbolos":47,"../TablaSimbolos/Tipo":49,"_process":3,"fs":1,"path":2}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Asignacion {
    constructor(identificador, valor, linea, column) {
        this.identificador = identificador;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        var _a;
        if (ts.existe(this.identificador)) {
            let valor = this.valor.getValor(controlador, ts, ts_u);
            (_a = ts.getSimbolo(this.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La variable ${this.valor.getValor(controlador, ts, ts_u)}, no existe en el entorno`, this.linea, this.column);
            controlador.errores.push(error);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador, ""));
        //padre.addHijo(new Nodo("=", ""))
        padre.addHijo(this.valor.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        //let valor = this.valor.traducir(Temp, controlador, ts, ts_u);
        let simbolo = ts.getSimbolo(this.identificador);
        if (simbolo != null) {
            let nodo = this.valor.traducir(Temp, controlador, ts, ts_u);
            let ultimoT;
            if (nodo.codigo3D == "") {
                ultimoT = nodo.temporal.nombre;
            }
            else {
                ultimoT = Temp.ultimoTemporal();
            }
            if (!(nodo.tipo == Tipo_1.tipo.BOOLEAN)) {
                salida.codigo3D += nodo.codigo3D + "\n";
            }
            else {
                if (simbolo.valor == true) {
                    ultimoT = "1";
                }
                else {
                    ultimoT = "0";
                }
            }
            if (ts.nombre != "Global" && simbolo != null) {
                if (ts.entorno == 0) {
                    ts.entorno = ts.entorno + ts.ant.entorno;
                }
                let temp = Temp.temporal();
                salida.codigo3D += temp + " = P + " + simbolo.posicion + "; \n";
                salida.codigo3D += "stack[(int)" + temp + "]  = " + ultimoT + "; \n";
                //simbolo.posicion = ts.entorno;
                //ts.entorno++;
            }
            else if (ts.nombre == "Global" && simbolo != null) {
                // ts.entorno++;
                salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                //simbolo.posicion = ts.entorno;
                //ts.entorno++;
            }
        }
        return salida;
    }
}
exports.Asignacion = Asignacion;

},{"../AST/Errores":6,"../AST/Nodo":7,"../AST/Temporales":8,"../TablaSimbolos/Tipo":49}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArray = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AsignacionArray {
    constructor(identificador, posicion, valor, linea, column) {
        this.identificador = identificador;
        this.posicion = posicion;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.getTipo().tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
            }
            else {
                let posi = this.posicion.getValor(controlador, ts, ts_u);
                let valor = this.valor.getValor(controlador, ts, ts_u);
                let valor_U = simbolo.getValor();
                if (typeof posi == "number") {
                    if (this.isInt(Number(posi))) {
                        if (this.getTipoArray(valor_U) == this.getTipo(valor)) {
                            valor_U[posi] = valor;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor}, es un tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `El valor ${posi}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
            }
        }
    }
    getTipoArray(lista) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista[0] == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista[0] === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getTipo(dato) {
        if (typeof dato == "number") {
            if (this.isInt(Number(dato))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof dato == "string") {
            if (this.isChar(String(dato))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof dato == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (dato === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    traducir(Temp, controlador, ts, ts_u) { }
    recorrer() {
        let padre = new Nodo_1.Nodo("Asignacion", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
}
exports.AsignacionArray = AsignacionArray;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Tipo":49}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionStruct = void 0;
const Nodo_1 = require("../AST/Nodo");
class AsignacionStruct {
    constructor(identificador1, identificador2, valor, linea, column) {
        this.identificador1 = identificador1;
        this.identificador2 = identificador2;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        let entornos = ts.sig;
        if (entornos instanceof Array) {
            entornos.forEach((entorno) => {
                var _a;
                if (entorno.nombre == this.identificador1.identificador) {
                    // let valor = entorno.getSimbolo(this.identificador2);
                    let valor = this.valor.getValor(controlador, ts, ts_u);
                    // let valor = vara.getValor();
                    (_a = entorno
                        .getSimbolo(this.identificador2.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
                }
            });
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador1.identificador, ""));
        //padre.addHijo(new Nodo("=", ""))
        padre.addHijo(this.valor.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) { }
}
exports.AsignacionStruct = AsignacionStruct;

},{"../AST/Nodo":7}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
const Temporales_1 = require("../../AST/Temporales");
class DoWhile {
    constructor(condicion, lista_ins, linea, columna) {
        this.condicion = condicion;
        this.lista_ins = lista_ins;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor_condicion = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condicion == 'boolean') {
            let ts_local = new TablaSim_1.TablaSim(ts, "DoWhile");
            ts.setSiguiente(ts_local);
            for (let ins of this.lista_ins) {
                let res = ins.ejecutar(controlador, ts_local, ts_u);
                if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                    return res;
                }
                if (ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
                }
                if (ins instanceof Return_1.Return || res != null) {
                    return res;
                }
            }
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                for (let ins of this.lista_ins) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                        return res;
                    }
                    if (ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return || res != null) {
                        return res;
                    }
                    if (res != null) {
                        return res;
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Do", "");
        //padre.addHijo(new Nodo("Do", ""))
        // padre.addHijo(new Nodo("{", ""))
        // let hijo_ins = new Nodo("Intrucciones", "")
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        // padre.addHijo(new Nodo("}", ""))
        padre.addHijo(new Nodo_1.Nodo("While", ""));
        // padre.addHijo(new Nodo("(", ""))
        padre.addHijo(this.condicion.recorrer());
        //padre.addHijo(new Nodo(")", ""))
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let ciclo = Temp.etiqueta();
        salida.codigo3D += ciclo + ": //Etiqueta para controlar el ciclado \n";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%% Verdadera %%%%%%%%%%%%%%%%% \n";
        //salida.etiquetasF = salida.etiquetasF.concat(nodoCondicion.etiquetasF)
        this.lista_ins.forEach((element) => {
            let nodo = element.traducir(Temp, controlador, ts, ts_u);
            salida.codigo3D += nodo.codigo3D;
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            // salida.continue = salida.continue.concat(nodo.continue);
            // salida.returns = salida.returns.concat(nodo.returns);
            /*if (nodo.retornos.length > 0) {
                 salida.tipo = nodo.tipo;
                 salida.valor = nodo.valor;
               }*/
        });
        salida.codigo3D += "//###########################  SALTOS | CICLO | VERDADERA ###################### \n";
        //salida.codigo3D += Temp.escribirEtiquetas(salida.continues);
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        salida.codigo3D += nodoCondicion.codigo3D;
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        salida.codigo3D += Temp.saltoIncondicional(ciclo);
        salida.codigo3D += "//%%%%%%%%%% FALSAS t BREAKS %%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
        salida.breaks = [];
        salida.saltos = [];
        // salida.continue = [];
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
}
exports.DoWhile = DoWhile;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/TablaSim":48,"../Transferencia/Break":44,"../Transferencia/Continue":45,"../Transferencia/Return":46}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class For {
    constructor(asi, condi, acuta, list, linea, col) {
        this.asig_decla = asi;
        this.condicion = condi;
        this.actualizacion = acuta;
        this.lista_ins = list;
        this.linea = linea;
        this.columna = col;
    }
    ejecutar(controlador, ts, ts_u) {
        this.asig_decla.ejecutar(controlador, ts, ts_u);
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == "boolean") {
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                let ts_local = new TablaSim_1.TablaSim(ts, "For");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    let result = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                        return result;
                    }
                    if (ins instanceof Continue_1.Continue || result instanceof Continue_1.Continue) {
                        this.actualizacion.ejecutar(controlador, ts, ts_u);
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (result != null) {
                        return result;
                    }
                }
                this.actualizacion.ejecutar(controlador, ts, ts_u);
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("For", "");
        //  padre.addHijo(new Nodo("for", ""));
        // padre.addHijo(new Nodo("(", ""));
        padre.addHijo(this.asig_decla.recorrer());
        // padre.addHijo(new Nodo(";", ""));
        padre.addHijo(this.condicion.recorrer());
        //  padre.addHijo(new Nodo(";", ""));
        padre.addHijo(this.actualizacion.recorrer());
        //  padre.addHijo(new Nodo("{", ""));
        // let hijo_ins = new Nodo("Intrucciones", "");
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        //padre.addHijo(hijo_ins);
        //padre.addHijo(new Nodo("}", ""));
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  FOR  %%%%%%%%%%%%%%%%%%%%%%";
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";
        let nodoDeclaracion = this.asig_decla.traducir(Temp, controlador, ts, ts_u);
        salida.codigo3D += nodoDeclaracion.codigo3D;
        let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let salto = Temp.etiqueta();
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%%  CONDICION %%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += salto + ": // Ciclicidad \n";
        salida.codigo3D += nodoCondicion.codigo3D;
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        let nodoAsignacion = this.actualizacion.traducir(Temp, controlador, ts, ts_u);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%% VERDADERO FOR %%%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        this.lista_ins.forEach(element => {
            let nodo = element.traducir(Temp, controlador, ts, ts_u);
            salida.codigo3D += nodo.codigo3D;
            salida.breaks = salida.breaks.concat(nodo.breaks);
            salida.saltos = salida.saltos.concat(nodo.saltos);
            //salida.continues = salida.continues.concat(nodo.continues);
            //salida.returns = salida.returns.concat(nodo.returns);
            /*if(nodo.retornos.length > 0){
                      salida.tipo = nodo.tipo;
                      salida.valor = nodo.valor;
                  }*/
        });
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%%% Saltos %%%%%%%%%%%%%%%%%%%%%%%%  \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        // salida.codigo3D += Temp.escribirEtiquetas(salida.continue);
        salida.codigo3D += nodoAsignacion.codigo3D;
        salida.codigo3D += Temp.saltoIncondicional(salto);
        salida.codigo3D += "//%%%%%%%%%% FALSAS t BREAKS %%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
        salida.saltos = [];
        salida.breaks = [];
        //  salida.continue = [];
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
}
exports.For = For;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/TablaSim":48,"../Transferencia/Break":44,"../Transferencia/Continue":45,"../Transferencia/Return":46}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForEsp = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Errores_1 = require("../../AST/Errores");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Simbolos_1 = require("../../TablaSimbolos/Simbolos");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ForEsp {
    constructor(asi, acuta, list, linea, col) {
        this.asig_decla = asi;
        this.actualizacion = acuta;
        this.lista_ins = list;
        this.linea = linea;
        this.columna = col;
    }
    ejecutar(controlador, ts, ts_u) {
        var _a, _b;
        let variable = this.asig_decla;
        let valor_condi = this.actualizacion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == "string") {
            variable.tipo = this.actualizacion.getTipo(controlador, ts, ts_u);
            // Se mete a la tabla de simbolos la variable
            let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, variable.tipo, variable.identificador, null);
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
            let tamno = valor_condi.length;
            let contador = 0;
            siguiente: while (contador < tamno) {
                let ts_local = new TablaSim_1.TablaSim(ts, "ForIn");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    if (ts.existe(variable.identificador)) {
                        let valor = valor_condi.charAt(contador);
                        (_a = ts.getSimbolo(variable.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `La variable ${variable.identificador}, no existe en el entorno`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                    let result = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                        return result;
                    }
                    if (ins instanceof Continue_1.Continue || result instanceof Continue_1.Continue) {
                        contador += 1;
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (result != null) {
                        return result;
                    }
                }
                contador += 1;
            }
        }
        else if (typeof valor_condi == "object") {
            variable.tipo = this.getTipoArray(valor_condi);
            // Se mete a la tabla de simbolos la variable
            let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, variable.tipo, variable.identificador, null);
            ts.agregar(variable.identificador, nuevo_sim);
            ts_u.agregar(variable.identificador, nuevo_sim);
            let tamno = valor_condi.length;
            let contador = 0;
            siguiente: while (contador < tamno) {
                let ts_local = new TablaSim_1.TablaSim(ts, "ForIn");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    if (ts.existe(variable.identificador)) {
                        let valor = valor_condi[contador];
                        (_b = ts.getSimbolo(variable.identificador)) === null || _b === void 0 ? void 0 : _b.setValor(valor);
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `La variable ${variable.identificador}, no existe en el entorno`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                    let result = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                        return result;
                    }
                    if (ins instanceof Continue_1.Continue || result instanceof Continue_1.Continue) {
                        contador += 1;
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (result != null) {
                        return result;
                    }
                }
                contador += 1;
            }
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La variable ${this.actualizacion.getValor(controlador, ts, ts_u)}, no se permite este tipo de dato`, this.linea, this.columna);
            controlador.errores.push(error);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ForIn", "");
        padre.addHijo(this.actualizacion.recorrer());
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        return padre;
    }
    getTipoArray(lista) {
        let tipito;
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                tipito = new Tipo_1.Tipo("ENTERO");
                return tipito;
            }
            tipito = new Tipo_1.Tipo("DOUBLE");
            return tipito;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                tipito = new Tipo_1.Tipo("CARACTER");
                return tipito;
            }
            tipito = new Tipo_1.Tipo("CADENA");
            return tipito;
        }
        else if (typeof lista[0] == "boolean") {
            tipito = new Tipo_1.Tipo("BOOLEAN");
            return tipito;
        }
        else if (lista[0] === null) {
            tipito = new Tipo_1.Tipo("NULO");
            return tipito;
        }
        else {
            tipito = new Tipo_1.Tipo("NULO");
            return tipito;
        }
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.ForEsp = ForEsp;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Simbolos":47,"../../TablaSimbolos/TablaSim":48,"../../TablaSimbolos/Tipo":49,"../Transferencia/Break":44,"../Transferencia/Continue":45,"../Transferencia/Return":46}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
const Temporales_1 = require("../../AST/Temporales");
class While {
    constructor(condicion, lista_ins, linea, columna) {
        this.condicion = condicion;
        this.lista_ins = lista_ins;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == "boolean") {
            siguiente: while (this.condicion.getValor(controlador, ts, ts_u)) {
                let ts_local = new TablaSim_1.TablaSim(ts, "While");
                ts.setSiguiente(ts_local);
                for (let ins of this.lista_ins) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                        return res;
                    }
                    if (ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                    if (ins instanceof Return_1.Return || res != null) {
                        return res;
                    }
                    if (res != null) {
                        return res;
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("While", "");
        padre.addHijo(this.condicion.recorrer());
        for (let ins of this.lista_ins) {
            padre.addHijo(ins.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        let nodoCondicion = this.condicion.traducir(Temp, controlador, ts, ts_u);
        let ciclo = Temp.etiqueta();
        salida.codigo3D += ciclo + ": //Etiqueta para controlar el ciclado";
        salida.codigo3D += nodoCondicion.codigo3D;
        //salida.etiquetasF = salida.etiquetasF.concat(nodoCondicion.etiquetasF)
        nodoCondicion = this.arreglarBoolean(nodoCondicion, salida, Temp);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%% Verdadera %%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasV);
        this.lista_ins.forEach((element) => {
            let nodo = element.traducir(Temp, controlador, ts, ts_u);
            salida.codigo3D += nodo.codigo3D;
            salida.saltos = salida.saltos.concat(nodo.saltos);
            salida.breaks = salida.breaks.concat(nodo.breaks);
            // salida.continue = salida.continue.concat(nodo.continue);
            // salida.returns = salida.returns.concat(nodo.returns);
            /*if (nodo.retornos.length > 0) {
                 salida.tipo = nodo.tipo;
                 salida.valor = nodo.valor;
               }*/
        });
        salida.codigo3D += "//%%%%%%%%%% SALTOS y CICLO %%%%%%%%%%%%%%%%%%%% \n";
        //salida.codigo3D += Temp.escribirEtiquetas(salida.continue);
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        salida.codigo3D += Temp.saltoIncondicional(ciclo);
        salida.codigo3D += "//%%%%%%%%%% FALSas t BREAKS %%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(nodoCondicion.etiquetasF);
        salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
        salida.breaks = [];
        salida.saltos = [];
        // salida.continue = [];
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
}
exports.While = While;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/TablaSim":48,"../Transferencia/Break":44,"../Transferencia/Continue":45,"../Transferencia/Return":46}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
class Case {
    constructor(e, l, li, c) {
        this.expresion = e;
        this.list_inst = l;
        this.linea = li;
        this.columna = c;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let ins of this.list_inst) {
            let res = ins.ejecutar(controlador, ts, ts_u);
            if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                return res;
            }
            if (ins instanceof Return_1.Return) {
                return res;
            }
            if (res != null) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CASE", "");
        padre.addHijo(this.expresion.recorrer());
        for (let ins of this.list_inst) {
            padre.addHijo(ins.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        // let v: Array<string> = [];
        // let f: Array<string> = [];
        //let nodo: Resultado3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
        //salida.codigo3D += nodo.codigo3D;
        this.list_inst.forEach((element) => {
            let temp = element.traducir(Temp, controlador, ts, ts_u);
            // console.log(temp);
            salida.codigo3D += temp.codigo3D;
            salida.saltos = salida.saltos.concat(temp.saltos);
            salida.breaks = salida.breaks.concat(temp.breaks);
            // salida.codigo3D += temp.continue;
            // salida.codigo3D += temp.retornos;
            /*
             if (temp.retornos.length > 0) {
               salida.tipo = temp.tipo;
               salida.valor = temp.valor;
             }*/
        });
        return salida;
    }
}
exports.Case = Case;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../Transferencia/Break":44,"../Transferencia/Return":46}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
class Default {
    constructor(li, l, c) {
        this.list_ins = li;
        this.linea = l;
        this.columna = c;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let ins of this.list_ins) {
            let res = ins.ejecutar(controlador, ts, ts_u);
            if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                return res;
            }
            if (ins instanceof Return_1.Return) {
                return res;
            }
            if (res != null) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DEFAULT", "");
        for (let ins of this.list_ins) {
            padre.addHijo(ins.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        // let v: Array<string> = [];
        // let f: Array<string> = [];
        //let nodo: Resultado3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
        //salida.codigo3D += nodo.codigo3D;
        this.list_ins.forEach((element) => {
            let temp = element.traducir(Temp, controlador, ts, ts_u);
            // console.log(temp);
            salida.codigo3D += temp.codigo3D;
            salida.saltos = salida.saltos.concat(temp.saltos);
            salida.breaks = salida.breaks.concat(temp.breaks);
            // salida.codigo3D += temp.continue;
            // salida.codigo3D += temp.retornos;
            /*
             if (temp.retornos.length > 0) {
               salida.tipo = temp.tipo;
               salida.valor = temp.valor;
             }*/
        });
        return salida;
    }
}
exports.Default = Default;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../Transferencia/Break":44,"../Transferencia/Return":46}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class If {
    constructor(condicion, lista_ifs, lista_elses, linea, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.linea = linea;
        this.columna = columna;
        this.entornoTrad = new TablaSim_1.TablaSim(null, "");
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts, "If");
        ts.setSiguiente(ts_local);
        this.entornoTrad = ts_local;
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (this.condicion.getTipo(controlador, ts, ts_u) == Tipo_1.tipo.BOOLEAN) {
            if (valor_condi) {
                for (let ins of this.lista_ifs) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break ||
                        res instanceof Break_1.Break ||
                        ins instanceof Continue_1.Continue ||
                        res instanceof Continue_1.Continue) {
                        return res;
                    }
                    if (ins instanceof Break_1.Break || res != null) {
                        return res;
                    }
                }
            }
            else {
                for (let ins of this.lista_elses) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break ||
                        res instanceof Break_1.Break ||
                        ins instanceof Continue_1.Continue ||
                        res instanceof Continue_1.Continue) {
                        return res;
                    }
                    if (ins instanceof Break_1.Break || res != null) {
                        return res;
                    }
                    if (ins instanceof Return_1.Return || res != null) {
                        return res;
                    }
                }
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("IF", "");
        padre.addHijo(this.condicion.recorrer());
        let ifs = new Nodo_1.Nodo("IFS", "");
        for (let inst of this.lista_ifs) {
            ifs.addHijo(inst.recorrer());
        }
        padre.addHijo(ifs);
        let elses = new Nodo_1.Nodo("ELSES", "");
        for (let inst of this.lista_elses) {
            elses.addHijo(inst.recorrer());
        }
        padre.addHijo(elses);
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        let v = [];
        let f = [];
        let nodo = this.condicion.traducir(Temp, controlador, this.entornoTrad, ts_u);
        salida.codigo3D += nodo.codigo3D + "\n";
        nodo = this.arreglarBoolean(nodo, salida, Temp);
        v = nodo.etiquetasV;
        f = nodo.etiquetasF;
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%5Verdaderas%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(v);
        console.log(this.lista_ifs);
        this.lista_ifs.forEach((element) => {
            let temp = element.traducir(Temp, controlador, this.entornoTrad, ts_u);
            salida.codigo3D += temp.codigo3D;
            salida.saltos = salida.saltos.concat(temp.saltos);
            salida.breaks = salida.breaks.concat(temp.breaks);
            // salida.codigo3D += temp.continue;
            // salida.codigo3D += temp.retornos;
            /*
             if (temp.retornos.length > 0) {
               salida.tipo = temp.tipo;
               salida.valor = temp.valor;
             }*/
        });
        let salto = Temp.etiqueta();
        salida.codigo3D += Temp.saltoIncondicional(salto);
        salida.saltos.push(salto);
        salida.codigo3D += "//%%%%%%%%%%%%%%%%Falssa%%%%%%%%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(f);
        //Ejecucion del resto de else ifs ------------------
        this.lista_elses.forEach((element) => {
            let nodo = element.traducir(Temp, controlador, this.entornoTrad, ts_u);
            salida.codigo3D += nodo.codigo3D;
            salida.codigo3D += nodo.saltos;
            // salida.codigo3D += temp.breaks;
            // salida.codigo3D += temp.continue;
            // salida.codigo3D += temp.retornos;
            /*
             if (temp.retornos.length > 0) {
               salida.tipo = temp.tipo;
               salida.valor = temp.valor;
             }*/
        });
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%%%%%%Saltos de Salida############## \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        salida.saltos = [];
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            //console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
}
exports.If = If;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/TablaSim":48,"../../TablaSimbolos/Tipo":49,"../Transferencia/Break":44,"../Transferencia/Continue":45,"../Transferencia/Return":46}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
const Temporales_1 = require("../../AST/Temporales");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Switch {
    constructor(v, l, d, lin, c) {
        this.valor = v;
        this.list_cases = l;
        this.defaulteo = d;
        this.linea = lin;
        this.columna = c;
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts, "Switch");
        ts.setSiguiente(ts_local);
        let aux = false;
        for (let ins of this.list_cases) {
            let caso = ins;
            if (this.valor.getValor(controlador, ts, ts_u) == caso.expresion.getValor(controlador, ts, ts_u)) {
                let res = ins.ejecutar(controlador, ts_local, ts_u);
                if (ins instanceof Break_1.Break || res instanceof Break_1.Break) {
                    aux = true;
                    return res;
                }
                if (ins instanceof Return_1.Return) {
                    return res;
                }
                if (res != null) {
                    return res;
                }
            }
        }
        if (!aux && this.defaulteo != null) {
            let res = this.defaulteo.ejecutar(controlador, ts, ts_u);
            if (res instanceof Break_1.Break) {
                aux = true;
                return res;
            }
            if (res instanceof Return_1.Return) {
                return res;
            }
            if (res != null) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SWITCH", "");
        padre.addHijo(this.valor.recorrer());
        for (let casito of this.list_cases) {
            padre.addHijo(casito.recorrer());
        }
        if (this.defaulteo != null) {
            padre.addHijo(this.defaulteo.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        let v = [];
        let f = [];
        let nodo = this.valor.traducir(Temp, controlador, ts, ts_u);
        salida.codigo3D += nodo.codigo3D + "\n";
        //
        this.list_cases.forEach((element) => {
            let caso = element;
            let der = caso.expresion.traducir(Temp, controlador, ts, ts_u);
            let comp = this.comparacion(salida, nodo, der, "==", Temp, controlador, ts, ts_u);
            comp = this.arreglarBoolean(comp, salida, Temp);
            v = comp.etiquetasV;
            f = comp.etiquetasF;
            salida.codigo3D += "//%%%%%%%%%%%%%%%%Verdaderas%%%%%%%%%%%%%%%% \n";
            salida.codigo3D += Temp.escribirEtiquetas(v);
            //console.log(this.lista_ifs);
            caso.list_inst.forEach((element) => {
                let temp = element.traducir(Temp, controlador, ts, ts_u);
                salida.codigo3D += temp.codigo3D;
                salida.saltos = salida.saltos.concat(temp.saltos);
                salida.breaks = salida.breaks.concat(temp.breaks);
                // salida.codigo3D += temp.continue;
                // salida.codigo3D += temp.retornos;
                /*
               if (temp.retornos.length > 0) {
                 salida.tipo = temp.tipo;
                 salida.valor = temp.valor;
               }*/
            });
            let salto = Temp.etiqueta();
            salida.codigo3D += Temp.saltoIncondicional(salto);
            salida.saltos.push(salto);
            salida.codigo3D += "//%%%%%%%%%%Falssa%%%%%%%%%%%%%%%%% \n";
            salida.codigo3D += Temp.escribirEtiquetas(f);
        });
        //--------------------Default
        let temp = this.defaulteo.traducir(Temp, controlador, ts, ts_u);
        salida.codigo3D += temp.codigo3D;
        salida.saltos = salida.saltos.concat(temp.saltos);
        salida.breaks = salida.breaks.concat(temp.breaks);
        // salida.codigo3D += temp.continue;
        // salida.codigo3D += temp.retornos;
        /*
           if (temp.retornos.length > 0) {
             salida.tipo = temp.tipo;
             salida.valor = temp.valor;
           }*/
        //----------------
        salida.codigo3D += "//%%%%%%%%%%%%%%%%% Saltos de Salida%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.saltos);
        salida.saltos = [];
        salida.codigo3D += "//%%%%%%%%%%%%%%%%%% BREAKS %%%%%%%%%%%%%%%% \n";
        salida.codigo3D += Temp.escribirEtiquetas(salida.breaks);
        salida.breaks = [];
        return salida;
    }
    arreglarBoolean(nodo, salida, Temp) {
        if (nodo.etiquetasV.length == 0) {
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D += Temp.saltoCondicional("(" + nodo.temporal.nombre + "== 1 )", v);
            salida.codigo3D += Temp.saltoIncondicional(f);
            //console.log("2" + salida);
            nodo.etiquetasV = [v];
            nodo.etiquetasF = [f];
        }
        return nodo;
    }
    comparacion(nodo, nodoIzq, nodoDer, signo, Temp, controlador, ts, ts_u) {
        nodo.tipo = Tipo_1.tipo.BOOLEAN;
        let v = Temp.etiqueta();
        let f = Temp.etiqueta();
        nodo.codigo3D += "if (" +
            nodoIzq.temporal.nombre +
            " " +
            signo +
            " " +
            nodoDer.temporal.nombre +
            ") goto " +
            v +
            "; //Si es verdadero salta a " + v + "\n";
        nodo.codigo3D += "goto " + f + "; //si no se cumple salta a: " + f + "\n";
        nodo.etiquetasV = [];
        nodo.etiquetasV.push(v);
        nodo.etiquetasF = [];
        nodo.etiquetasF.push(f);
        return nodo;
    }
}
exports.Switch = Switch;

},{"../../AST/Nodo":7,"../../AST/Temporales":8,"../../TablaSimbolos/TablaSim":48,"../../TablaSimbolos/Tipo":49,"../Transferencia/Break":44,"../Transferencia/Return":46}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Arreglo_1 = require("../Expresiones/Arreglo");
const AritArreglo_1 = require("../Expresiones/Operaciones/AritArreglo");
const Temporales_1 = require("../AST/Temporales");
class Declaracion {
    constructor(tipo, lista_simbolos, linea, columna) {
        this.tipo = tipo;
        this.lista_simbolos = lista_simbolos;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        for (let simbolo of this.lista_simbolos) {
            let variable = simbolo;
            // Se verifica que la varaible no exista en la tabla de simbolos actual
            if (ts.existeEnActual(variable.identificador)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${variable.identificador}, ya se declaro anteriormente`, this.linea, this.columna);
                controlador.errores.push(error);
                continue;
            }
            if (variable.valor != null) {
                if (variable.valor instanceof Arreglo_1.Arreglo) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_valor = variable.valor.getTipoArreglo(controlador, ts, ts_u, this.tipo);
                    if (tipo_valor == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, new Tipo_1.Tipo("ARRAY"), variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else if (variable.valor instanceof AritArreglo_1.AritArreglo) {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    if (this.getTipo(valor) == this.tipo.tipo) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, new Tipo_1.Tipo("ARRAY"), variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${this.getTipo(valor)} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_valor = variable.valor.getTipo(controlador, ts, ts_u);
                    if (tipo_valor == this.tipo.tipo ||
                        ((tipo_valor == Tipo_1.tipo.DOUBLE || tipo_valor == Tipo_1.tipo.ENTERO) &&
                            (this.tipo.tipo == Tipo_1.tipo.ENTERO || this.tipo.tipo == Tipo_1.tipo.DOUBLE)) ||
                        (tipo_valor == Tipo_1.tipo.CADENA && this.tipo.tipo == Tipo_1.tipo.CARACTER)) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
            }
            else {
                let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, null);
                ts.agregar(variable.identificador, nuevo_sim);
                ts_u.agregar(variable.identificador, nuevo_sim);
            }
        }
    }
    getTipo(lista) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista[0] == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista[0] === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        // let hijo_sim = new Nodo("Simbolos", "")
        padre.addHijo(new Nodo_1.Nodo(this.tipo.stype, ""));
        for (let simb of this.lista_simbolos) {
            let varia = simb;
            if (varia.valor != null) {
                padre.addHijo(new Nodo_1.Nodo(simb.identificador, ""));
                // padre.addHijo(new Nodo("=", ""))
                let aux = simb.valor;
                padre.addHijo(aux.recorrer());
            }
        }
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        for (let simbolo of this.lista_simbolos) {
            let variable = simbolo;
            let existe = ts.getSimbolo(variable.identificador);
            if (variable.valor != null) {
                let nodo = variable.valor.traducir(Temp, controlador, ts, ts_u);
                let ultimoT;
                if (nodo.codigo3D == "") {
                    ultimoT = nodo.temporal.nombre;
                }
                else {
                    if (nodo.tipo == Tipo_1.tipo.BOOLEAN) {
                        if (nodo instanceof Simbolos_1.Simbolos == false) {
                            salida.codigo3D += nodo.codigo3D + "\n";
                        }
                        salida.etiquetasV = salida.etiquetasV.concat(nodo.etiquetasV);
                        salida.etiquetasF = salida.etiquetasF.concat(nodo.etiquetasF);
                        if (ts.nombre != "Global" && existe != null) {
                            if (ts.entorno == 0) {
                                ts.entorno = ts.entorno + ts.ant.entorno;
                            }
                            let a = Temp.etiqueta();
                            let temp = Temp.temporal();
                            salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
                            salida.codigo3D += "stack[(int)" + temp + "] = 1; \n";
                            salida.codigo3D += "goto " + a + ";\n";
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
                            salida.codigo3D += "stack[(int)" + temp + "] = 0; \n";
                            salida.codigo3D += a + ": \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                            return salida;
                        }
                        else if (ts.nombre == "Global" && existe != null) {
                            let a = Temp.etiqueta();
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasV);
                            salida.codigo3D += "stack[(int)" + ts.entorno + "] = 1; \n";
                            salida.codigo3D += "goto " + a + ";\n";
                            salida.codigo3D += Temp.escribirEtiquetas(nodo.etiquetasF);
                            salida.codigo3D += "stack[(int)" + ts.entorno + "] = 0; \n";
                            salida.codigo3D += a + ": \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                            return salida;
                        }
                        //ultimoT = nodo.temporal.nombre
                    }
                    else if (nodo.tipo == Tipo_1.tipo.ID) { // EL tipo es ID pero lo usacom como referencia del incremneto o decremento
                        if (ts.nombre != "Global" && existe != null) {
                            if (ts.entorno == 0) {
                                ts.entorno = ts.entorno + ts.ant.entorno;
                            }
                            salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                        }
                        else if (ts.nombre == "Global" && existe != null) {
                            // ts.entorno++;
                            salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                            existe.posicion = ts.entorno;
                            ts.entorno++;
                        }
                    }
                    else {
                        ultimoT = Temp.ultimoTemporal();
                    }
                }
                if (nodo instanceof Simbolos_1.Simbolos == false) {
                    salida.codigo3D += nodo.codigo3D + "\n";
                }
                if (ts.nombre != "Global" && existe != null) {
                    if (ts.entorno == 0) {
                        ts.entorno = ts.entorno + ts.ant.entorno;
                    }
                    let temp = Temp.temporal();
                    salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
                    salida.codigo3D += "stack[(int)" + temp + "]  = " + ultimoT + "; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
                else if (ts.nombre == "Global" && existe != null) {
                    // ts.entorno++;
                    salida.codigo3D += "stack[(int)" + ts.entorno + "]  = " + ultimoT + "; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
            }
            else {
                if (ts.nombre != "Global" && existe != null) {
                    if (ts.entorno == 0) {
                        ts.entorno = ts.entorno + ts.ant.entorno;
                    }
                    let temp = Temp.temporal();
                    salida.codigo3D += temp + " = P + " + ts.entorno + "; \n";
                    salida.codigo3D += "stack[(int)" + temp + "]  = 0; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
                else if (ts.nombre == "Global" && existe != null) {
                    // ts.entorno++;
                    salida.codigo3D += "stack[(int)" + ts.entorno + "]  = 0; \n";
                    existe.posicion = ts.entorno;
                    ts.entorno++;
                }
            }
        }
        return salida;
    }
}
exports.Declaracion = Declaracion;

},{"../AST/Errores":6,"../AST/Nodo":7,"../AST/Temporales":8,"../Expresiones/Arreglo":12,"../Expresiones/Operaciones/AritArreglo":14,"../TablaSimbolos/Simbolos":47,"../TablaSimbolos/Tipo":49}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionStruct = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class DeclaracionStruct {
    constructor(id1, id2, id3, lista_valores, linea, columna) {
        this.id1 = id1;
        this.id2 = id2;
        this.id3 = id3;
        this.lista_valores = lista_valores;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.id3) && !ts.existeEnActual(this.id2)) {
            let ts_local = new TablaSim_1.TablaSim(ts, this.id2);
            ts.setSiguiente(ts_local);
            let sim_struct = ts_local.getSimbolo(this.id1);
            //console.log(sim_struct.lista_param);
            if (this.verificarParams(this.lista_valores, sim_struct.lista_params, controlador, ts, ts_local, ts_u)) {
                let r = sim_struct === null || sim_struct === void 0 ? void 0 : sim_struct.ejecutar(controlador, ts_local, ts_u);
                /*  let nuevo_sim = new Simbolos(1, new Tipo("STRUCT"), this.id2, r);
                        ts_local.agregar(this.id2, nuevo_sim);
                        ts_u.agregar(this.id2, nuevo_sim);*/
                if (r != null) {
                    return r;
                }
            }
        }
    }
    verificarParams(para_llama, para_func, controlador, ts, ts_local, ts_u) {
        if (para_llama.length == (para_func === null || para_func === void 0 ? void 0 : para_func.length)) {
            let aux;
            let id_aux;
            let tipo_axu;
            let exp_aux;
            let tipo_valor;
            let valor_aux;
            for (let i = 0; i < para_llama.length; i++) {
                aux = para_func[i];
                id_aux = aux.identificador;
                tipo_axu = aux.tipo.tipo;
                exp_aux = para_llama[i];
                tipo_valor = exp_aux.getTipo(controlador, ts, ts_u);
                valor_aux = exp_aux.getValor(controlador, ts, ts_u);
                if (tipo_axu == tipo_valor ||
                    (tipo_axu == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOUBLE) ||
                    (tipo_valor == Tipo_1.tipo.CADENA && tipo_axu == Tipo_1.tipo.CARACTER)) {
                    let simbolo = new Simbolos_1.Simbolos(aux.simbolo, aux.tipo, id_aux, valor_aux);
                    ts_local.agregar(id_aux, simbolo);
                    ts_u.agregar(id_aux, simbolo);
                }
            }
            return true;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `Las variables  no son del mismo tipo`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`Las variablesno son del mismo tipo, En la linea ${this.linea}, y columna ${this.columna}`);
        }
        return false;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("=", "");
        // let hijo_sim = new Nodo("Simbolos", "")
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.DeclaracionStruct = DeclaracionStruct;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":47,"../TablaSimbolos/TablaSim":48,"../TablaSimbolos/Tipo":49}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Break_1 = require("./Transferencia/Break");
const Continue_1 = require("./Transferencia/Continue");
const Return_1 = require("./Transferencia/Return");
class Funcion extends Simbolos_1.Simbolos {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_ints, linea, columna) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_ints = lista_ints;
        this.linea = linea;
        this.column = columna;
        this.etiqueta = "";
        this.entornoTrad = new TablaSim_1.TablaSim(null, "");
    }
    agregarSimboloFunc(controlador, ts, ts_u) {
        if (!ts.existe(this.identificador)) {
            ts.agregar(this.identificador, this);
            ts_u.agregar(this.identificador, this);
        }
        else {
            //Erro Semantico
        }
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts, this.identificador);
        ts.setSiguiente(ts_local);
        this.entornoTrad = ts_local;
        let valor_type = this.tipo.stype;
        let tipo_aux = "";
        if (valor_type == "ENTERO" || valor_type == "DECIMAL") {
            tipo_aux = "number";
        }
        else if (valor_type == "STRING" || valor_type == "CHAR") {
            tipo_aux = "string";
        }
        else if (valor_type == "BOOLEAN") {
            tipo_aux = "boolean";
        }
        for (let ins of this.lista_ints) {
            let result = ins.ejecutar(controlador, ts_local, ts_u);
            if (result != null) {
                if (result instanceof Errores_1.Errores) {
                    return result;
                }
                else {
                    if (ins instanceof Break_1.Break || result instanceof Continue_1.Continue) {
                        let error = new Errores_1.Errores("Semantico", ` No se acepta el tipo en el entorno`, this.linea, this.column);
                        controlador.errores.push(error);
                    }
                    if (ins instanceof Return_1.Return) {
                        return result;
                    }
                    if (tipo_aux == "VOID") {
                        return;
                    }
                    else {
                        if (typeof result == tipo_aux) {
                            return result;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", ` La funcion no concuerda con el tipo`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo(this.identificador, "");
        this.lista_ints.forEach((element) => {
            padre.addHijo(element.recorrer());
        });
        return padre;
    }
    inicializar() { }
    traducir(Temp, controlador, ts, ts_u) {
        // controlador.appendT("\n"+ this.etiqueta + ":"+"#"+this.identificador);
        for (let ins of this.lista_ints) {
            let a = ins.traducir(Temp, controlador, this.entornoTrad, ts_u);
            if (a != undefined) {
                controlador.appendT("\n" + a.codigo3D);
            }
        }
    }
}
exports.Funcion = Funcion;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":47,"../TablaSimbolos/TablaSim":48,"./Transferencia/Break":44,"./Transferencia/Continue":45,"./Transferencia/Return":46}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Llamada {
    constructor(identificador, para, linea, column) {
        this.identificador = identificador;
        this.parametros = para;
        this.linea = linea;
        this.column = column;
    }
    getTipo(controlador, ts) {
        if (ts.existe(this.identificador)) {
            let sim_func = ts.getSimbolo(this.identificador);
            return sim_func.tipo.tipo;
        }
        else {
            //TODO error
        }
    }
    getValor(controlador, ts, ts_u) {
        return this.ejecutar(controlador, ts, ts_u);
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.identificador)) {
            let ts_local = new TablaSim_1.TablaSim(ts, this.identificador);
            ts.setSiguiente(ts_local);
            let sim_func = ts.getSimbolo(this.identificador);
            if (this.verificarParams(this.parametros, sim_func.lista_params, controlador, ts, ts_local, ts_u)) {
                let r = sim_func === null || sim_func === void 0 ? void 0 : sim_func.ejecutar(controlador, ts_local, ts_u);
                if (r != null) {
                    return r;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La funcion ${this.identificador}, no existe`, this.linea, this.column);
            controlador.errores.push(error);
            controlador.append(`La funcion ${this.identificador}, no existe En la linea ${this.linea}, y columna ${this.column}`);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Llamada", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador, ""));
        //padre.addHijo(new Nodo("(", ""));
        //let hijo_para = new Nodo("Parametros", "");
        if (this.parametros != null) {
            for (let para of this.parametros) {
                // let hijo_para2 = new Nodo("Parametro", "");
                padre.addHijo(para.recorrer());
                // hijo_para.addHijo(hijo_para2);
            }
        }
        //  padre.addHijo(hijo_para);
        //  padre.addHijo(new Nodo(")", ""));
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    verificarParams(para_llama, para_func, controlador, ts, ts_local, ts_u) {
        if (para_llama.length == (para_func === null || para_func === void 0 ? void 0 : para_func.length)) {
            let aux;
            let id_aux;
            let tipo_axu;
            let exp_aux;
            let tipo_valor;
            let valor_aux;
            for (let i = 0; i < para_llama.length; i++) {
                console.log(para_func[i]);
                console.log(para_llama[i]);
                aux = para_func[i];
                id_aux = aux.identificador;
                tipo_axu = aux.tipo.tipo;
                exp_aux = para_llama[i];
                tipo_valor = exp_aux.getTipo(controlador, ts, ts_u);
                valor_aux = exp_aux.getValor(controlador, ts, ts_u);
                if (tipo_axu == tipo_valor ||
                    (tipo_axu == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOUBLE) ||
                    (tipo_valor == Tipo_1.tipo.CADENA && tipo_axu == Tipo_1.tipo.CARACTER)) {
                    let simbolo = new Simbolos_1.Simbolos(aux.simbolo, aux.tipo, id_aux, valor_aux);
                    ts_local.agregar(id_aux, simbolo);
                    ts_u.agregar(id_aux, simbolo);
                }
            }
            return true;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `Las variables  no son del mismo tipo`, this.linea, this.column);
            controlador.errores.push(error);
            controlador.append(`Las variablesno son del mismo tipo, En la linea ${this.linea}, y columna ${this.column}`);
        }
        return false;
    }
}
exports.Llamada = Llamada;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":47,"../TablaSimbolos/TablaSim":48,"../TablaSimbolos/Tipo":49}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManejoArray = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class ManejoArray {
    constructor(identificador, expre2, operador, linea, column) {
        this.identificador = identificador;
        this.expre2 = expre2;
        this.linea = linea;
        this.column = column;
        this.operador = operador;
    }
    ejecutar(controlador, ts, ts_u) {
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.getTipo().tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
            }
            else {
                let valor_expre1;
                let valor_expre2;
                if (this.expre2 === null) {
                    valor_expre1 = simbolo.getValor();
                }
                else {
                    valor_expre1 = simbolo.getValor();
                    valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
                }
                switch (this.operador) {
                    case "push":
                        if (typeof valor_expre1 === "object") {
                            if (this.getTipoArray(valor_expre1) == this.getTipo(valor_expre2)) {
                                valor_expre1.push(valor_expre2);
                            }
                            else {
                                let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre2}, tipo de dato incorrecto`, this.linea, this.column);
                                controlador.errores.push(error);
                            }
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                        break;
                    case "pop":
                        if (typeof valor_expre1 === "object") {
                            valor_expre1.pop();
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                            controlador.errores.push(error);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    getTipoArray(lista) {
        if (typeof lista[0] == "number") {
            if (this.isInt(Number(lista[0]))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof lista[0] == "string") {
            if (this.isChar(String(lista[0]))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof lista[0] == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (lista[0] === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    getTipo(dato) {
        if (typeof dato == "number") {
            if (this.isInt(Number(dato))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof dato == "string") {
            if (this.isChar(String(dato))) {
                return Tipo_1.tipo.CARACTER;
            }
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof dato == "boolean") {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (dato === null) {
            return Tipo_1.tipo.NULO;
        }
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Asignacion", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/./i);
    }
}
exports.ManejoArray = ManejoArray;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Tipo":49}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
class Print {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor = this.expresion.getValor(controlador, ts, ts_u);
        controlador.append(valor);
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        padre.addHijo(this.expresion.recorrer());
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        // cadena = cadena.temporal.utilizar();
        //cadena = cadena[1:-1];
        let exp_3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
        console.log(exp_3D);
        //IDENTIFICADOR------------------------------------------------------------------------------------------
        if (exp_3D instanceof Simbolos_1.Simbolos) {
            if (exp_3D.tipo.stype == "ENTERO") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    salida.codigo3D += "\n" + 'printf("%d", (int)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "DECIMAL") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    salida.codigo3D += "\n" + 'printf("%f", (double)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%f", (double)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "CHAR") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "STRING") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    //----------------
                    // salida.codigo3D += "\n" + exp_3D.codigo3D;
                    let posicion = Temp.temporal();
                    let valor = Temp.temporal();
                    let v = Temp.etiqueta();
                    let f = Temp.etiqueta();
                    salida.codigo3D +=
                        posicion + " = " + temp2 + "; //Posicion de inicio de la cadena\n";
                    salida.codigo3D += f + ":";
                    salida.codigo3D +=
                        valor + " = heap[(int)" + posicion + "];\n";
                    salida.codigo3D += Temp.saltoCondicional("(" + valor + " == 0 )", v) + "// Si esta vacio no imprimimos nada\n";
                    salida.codigo3D +=
                        posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
                    salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
                    salida.codigo3D += Temp.saltoIncondicional(f);
                    salida.codigo3D += v + ":";
                    //------------
                    //salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "BOOLEAN") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    //---
                    let verdadera = Temp.etiqueta();
                    let salto = Temp.etiqueta();
                    if (exp_3D.valor == true) {
                        salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 1)", verdadera);
                    }
                    else {
                        salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 0)", verdadera);
                    }
                    salida.codigo3D +=
                        'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                    salida.codigo3D += Temp.saltoIncondicional(salto);
                    salida.codigo3D += verdadera + ":";
                    salida.codigo3D +=
                        'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                    salida.codigo3D += salto + ":";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
                }
            }
            return salida;
        }
        // EXPRESIOMES--------------------------------------------------------------------------------------
        //
        if (exp_3D.tipo == Tipo_1.tipo.ENTERO) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            salida.codigo3D += "\n" + 'printf("%d", (int)' + exp_3D.temporal.nombre + ");";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.DOUBLE) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            salida.codigo3D += "\n" + 'printf("%f", (double)' + exp_3D.temporal.nombre + ");";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.CARACTER) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            salida.codigo3D += "\n" + 'printf("%c", (char)' + exp_3D.temporal.nombre + "); // Se imprime char";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.CADENA) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            let posicion = Temp.temporal();
            let valor = Temp.temporal();
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D +=
                posicion + " = " + exp_3D.temporal.nombre + "; //Posicion de inicio de la cadena\n";
            salida.codigo3D += f + ":";
            salida.codigo3D +=
                valor + " = heap[(int)" + posicion + "];\n";
            salida.codigo3D += Temp.saltoCondicional("(" + valor + " == 0 )", v) + "// Si esta vacio no imprimimos nada\n";
            salida.codigo3D +=
                posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
            salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
            salida.codigo3D += Temp.saltoIncondicional(f);
            salida.codigo3D += v + ":";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.BOOLEAN) {
            controlador.appendT("\n" + exp_3D.codigo3D);
            if (exp_3D.etiquetasV.length == 0) {
                let verdadera = Temp.etiqueta();
                let salto = Temp.etiqueta();
                salida.codigo3D += Temp.saltoCondicional("(" + exp_3D.temporal.nombre + " == 0)", verdadera);
                salida.codigo3D +=
                    'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                salida.codigo3D += Temp.saltoIncondicional(salto);
                salida.codigo3D += verdadera + ":";
                salida.codigo3D +=
                    'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                salida.codigo3D += salto + ":";
            }
            else {
                let salto = Temp.etiqueta();
                salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasV);
                salida.codigo3D +=
                    'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                salida.codigo3D += Temp.saltoIncondicional(salto);
                salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasF);
                salida.codigo3D +=
                    'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                salida.codigo3D += salto + ":";
            }
        }
        return salida;
    }
}
exports.Print = Print;

},{"../AST/Nodo":7,"../AST/Temporales":8,"../TablaSimbolos/Simbolos":47,"../TablaSimbolos/Tipo":49}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Println = void 0;
const Nodo_1 = require("../AST/Nodo");
const Temporales_1 = require("../AST/Temporales");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
class Println {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor = this.expresion.getValor(controlador, ts, ts_u);
        controlador.append(valor + "\n");
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("PrintLn", "");
        // padre.addHijo(new Nodo("int",""));
        // padre.addHijo(new Nodo("(",""));
        //let hijo =  new Nodo("exp","");
        padre.addHijo(this.expresion.recorrer());
        // padre.addHijo(hijo);
        //padre.addHijo(new Nodo(")",""));
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let salida = new Temporales_1.Resultado3D();
        // cadena = cadena.temporal.utilizar();
        //cadena = cadena[1:-1];
        let exp_3D = this.expresion.traducir(Temp, controlador, ts, ts_u);
        //IDENTIFICADOR------------------------------------------------------------------------------------------
        if (exp_3D instanceof Simbolos_1.Simbolos) {
            if (exp_3D.tipo.stype == "ENTERO") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    salida.codigo3D += "\n" + 'printf("%d", (int)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "DECIMAL") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    salida.codigo3D += "\n" + 'printf("%f", (double)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%f", (double)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "CHAR") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "STRING") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    //----------------
                    // salida.codigo3D += "\n" + exp_3D.codigo3D;
                    let posicion = Temp.temporal();
                    let valor = Temp.temporal();
                    let v = Temp.etiqueta();
                    let f = Temp.etiqueta();
                    salida.codigo3D +=
                        posicion + " = " + temp2 + "; //Posicion de inicio de la cadena\n";
                    salida.codigo3D += f + ":";
                    salida.codigo3D +=
                        valor + " = heap[(int)" + posicion + "];\n";
                    salida.codigo3D += Temp.saltoCondicional("(" + valor + " == 0 )", v) + "// Si esta vacio no imprimimos nada\n";
                    salida.codigo3D +=
                        posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
                    salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
                    salida.codigo3D += Temp.saltoIncondicional(f);
                    salida.codigo3D += v + ":";
                    //------------
                    //salida.codigo3D += "\n" + 'printf("%c", (char)' + temp2 + ");";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%c", (char)' + temp + ");";
                }
            }
            else if (exp_3D.tipo.stype == "BOOLEAN") {
                if (ts.nombre != "Global") {
                    let temp = Temp.temporal();
                    let temp2 = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + " = P + " + exp_3D.posicion + "; \n";
                    salida.codigo3D += temp2 + "= stack[(int)" + temp + "]; \n";
                    //---
                    let verdadera = Temp.etiqueta();
                    let salto = Temp.etiqueta();
                    if (exp_3D.valor == true) {
                        salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 1)", verdadera);
                    }
                    else {
                        salida.codigo3D += Temp.saltoCondicional("(" + temp2 + " == 0)", verdadera);
                    }
                    salida.codigo3D +=
                        'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                    salida.codigo3D += Temp.saltoIncondicional(salto);
                    salida.codigo3D += verdadera + ":";
                    salida.codigo3D +=
                        'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                    salida.codigo3D += salto + ":";
                    // salida.codigo3D += this.estructura(temp2, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                }
                else {
                    let temp = Temp.temporal();
                    salida.tipo = Tipo_1.tipo.ID;
                    salida.codigo3D += temp + "= stack[(int)" + exp_3D.posicion + "]; \n";
                    // salida.codigo3D += this.estructura(temp, this.getTipoID(exp_3D.valor), salida, Temp, controlador, ts, ts_u);
                    salida.codigo3D += "\n" + 'printf("%d", (int)' + temp + ");";
                }
            }
            salida.codigo3D += '\n printf("%c", (char)10); \n';
            return salida;
        }
        // EXPRESIOMES--------------------------------------------------------------------------------------
        //
        if (exp_3D.tipo == Tipo_1.tipo.ENTERO) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            salida.codigo3D += "\n" + 'printf("%d", (int)' + exp_3D.temporal.nombre + ");";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.DOUBLE) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            salida.codigo3D += "\n" + 'printf("%f", (double)' + exp_3D.temporal.nombre + ");";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.CARACTER) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            salida.codigo3D += "\n" + 'printf("%c", (char)' + exp_3D.temporal.nombre + "); // Se imprime char";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.CADENA) {
            salida.codigo3D += "\n" + exp_3D.codigo3D;
            let posicion = Temp.temporal();
            let valor = Temp.temporal();
            let v = Temp.etiqueta();
            let f = Temp.etiqueta();
            salida.codigo3D +=
                posicion + " = " + exp_3D.temporal.nombre + "; //Posicion de inicio de la cadena\n";
            salida.codigo3D += f + ":";
            salida.codigo3D +=
                valor + " = heap[(int)" + posicion + "];\n";
            salida.codigo3D += Temp.saltoCondicional("(" + valor + " == 0 )", v) + "// Si esta vacio no imprimimos nada\n";
            salida.codigo3D +=
                posicion + " = " + posicion + " + 1; //Aumento de la posicion\n";
            salida.codigo3D += 'printf( "%c", (char)' + valor + "); //Se imprime el caracter\n";
            salida.codigo3D += Temp.saltoIncondicional(f);
            salida.codigo3D += v + ":";
        }
        else if (exp_3D.tipo == Tipo_1.tipo.BOOLEAN) {
            controlador.appendT("\n" + exp_3D.codigo3D);
            if (exp_3D.etiquetasV.length == 0) {
                let verdadera = Temp.etiqueta();
                let salto = Temp.etiqueta();
                salida.codigo3D += Temp.saltoCondicional("(" + exp_3D.temporal.nombre + " == 0)", verdadera);
                salida.codigo3D +=
                    'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                salida.codigo3D += Temp.saltoIncondicional(salto);
                salida.codigo3D += verdadera + ":";
                salida.codigo3D +=
                    'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                salida.codigo3D += salto + ":";
            }
            else {
                let salto = Temp.etiqueta();
                salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasV);
                salida.codigo3D +=
                    'printf("%c", (char)116); \n printf("%c", (char)114); \n printf("%c", (char)117); \n printf("%c", (char)101); \n'; // true
                salida.codigo3D += Temp.saltoIncondicional(salto);
                salida.codigo3D += Temp.escribirEtiquetas(exp_3D.etiquetasF);
                salida.codigo3D +=
                    'printf("%c", (char)102); \n printf("%c", (char)97); \n printf("%c", (char)108); \n printf("%c", (char)115); \n printf("%c", (char)101); \n'; //false
                salida.codigo3D += salto + ":";
            }
        }
        salida.codigo3D += '\n printf("%c", (char)10); \n';
        return salida;
    }
}
exports.Println = Println;

},{"../AST/Nodo":7,"../AST/Temporales":8,"../TablaSimbolos/Simbolos":47,"../TablaSimbolos/Tipo":49}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Temporales_1 = require("../../AST/Temporales");
class Break {
    constructor() { }
    ejecutar(controlador, ts, ts_u) {
        return this;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
        let nodo = new Temporales_1.Resultado3D();
        let salto = Temp.etiqueta();
        nodo.codigo3D += Temp.saltoIncondicional(salto);
        nodo.breaks.push(salto);
        return nodo;
    }
}
exports.Break = Break;

},{"../../AST/Nodo":7,"../../AST/Temporales":8}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continue = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Continue {
    constructor() {
    }
    ejecutar(controlador, ts, ts_u) {
        return this;
    }
    recorrer() {
        let pader = new Nodo_1.Nodo("Continue", "");
        return pader;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Continue = Continue;

},{"../../AST/Nodo":7}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Return {
    constructor(v) {
        this.valor_retur = v;
    }
    ejecutar(controlador, ts, ts_u) {
        if (this.valor_retur != null) {
            return this.valor_retur.getValor(controlador, ts, ts_u);
        }
        else {
            return this;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Retornar", "");
        if (this.valor_retur != null) {
            padre.addHijo(this.valor_retur.recorrer());
        }
        return padre;
    }
    traducir(Temp, controlador, ts, ts_u) {
    }
}
exports.Return = Return;

},{"../../AST/Nodo":7}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolos = void 0;
class Simbolos {
    constructor(simbolo, tipo, identificador, valor, lista_params, metodo) {
        this.simbolo = simbolo;
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.lista_params = lista_params;
        this.metodo = metodo;
        this.posicion = 0;
    }
    setSimbolo(simbolo) {
        this.simbolo = simbolo;
    }
    getSimbolo() {
        return this.simbolo;
    }
    setIdentificador(identificador) {
        this.identificador = identificador;
    }
    getIdentificador() {
        return this.identificador;
    }
    setTipo(tipo) {
        this.tipo = tipo;
    }
    getTipo() {
        return this.tipo;
    }
    getTipoArreglo() {
        return this.tipo.tipo;
    }
    setValor(valor) {
        this.valor = valor;
    }
    getValor() {
        return this.valor;
    }
}
exports.Simbolos = Simbolos;

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSim = void 0;
class TablaSim {
    constructor(ant, nombre) {
        this.entorno = 0;
        this.ant = ant;
        this.sig = [];
        this.tabla = new Map();
        this.nombre = nombre;
    }
    agregar(id, simbolo) {
        this.tabla.set(id, simbolo); //convertimos a minuscula ya que nuestro lenguaje es caseinsitive ej. prueba = PRUeba
        //   this.tabla.set(id.toLowerCase(), simbolo);
    }
    setSiguiente(tablita) {
        this.sig.push(tablita);
    }
    existe(id) {
        let ts = this;
        while (ts != null) {
            // let existe = ts.tabla.get(id.toLowerCase());
            let existe = ts.tabla.get(id);
            if (existe != null) {
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    existeEnActual(id) {
        let ts = this;
        //let existe = ts.tabla.get(id.toLowerCase());
        let existe = ts.tabla.get(id);
        if (existe != null) {
            return true;
        }
        return false;
    }
    getSimbolo(id) {
        let ts = this;
        while (ts != null) {
            //let existe = ts.tabla.get(id.toLowerCase());
            let existe = ts.tabla.get(id);
            if (existe != null) {
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }
    getEntornoStack() {
        let ts = this;
        let i = 0;
        while (ts != null) {
            ts.tabla.forEach(element => {
                if (element.simbolo == 1 || element.simbolo == 4) {
                    i++;
                }
            });
            ts = ts.ant;
        }
        return i;
    }
}
exports.TablaSim = TablaSim;

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = exports.Ubicacion = exports.tipo = void 0;
var tipo;
(function (tipo) {
    tipo[tipo["ENTERO"] = 0] = "ENTERO";
    tipo[tipo["DOUBLE"] = 1] = "DOUBLE";
    tipo[tipo["BOOLEAN"] = 2] = "BOOLEAN";
    tipo[tipo["CARACTER"] = 3] = "CARACTER";
    tipo[tipo["CADENA"] = 4] = "CADENA";
    tipo[tipo["NULO"] = 5] = "NULO";
    tipo[tipo["VOID"] = 6] = "VOID";
    tipo[tipo["ARRAY"] = 7] = "ARRAY";
    tipo[tipo["MAIN"] = 8] = "MAIN";
    tipo[tipo["STRUCT"] = 9] = "STRUCT";
    tipo[tipo["ID"] = 10] = "ID";
})(tipo = exports.tipo || (exports.tipo = {}));
var Ubicacion;
(function (Ubicacion) {
    Ubicacion[Ubicacion["HEAP"] = 0] = "HEAP";
    Ubicacion[Ubicacion["STACK"] = 1] = "STACK";
})(Ubicacion = exports.Ubicacion || (exports.Ubicacion = {}));
class Tipo {
    constructor(stype) {
        this.stype = stype;
        this.tipo = this.getTipo(stype);
    }
    getTipo(stype) {
        if (stype == "DECIMAL") {
            return tipo.DOUBLE;
        }
        else if (stype == "ENTERO") {
            return tipo.ENTERO;
        }
        else if (stype == "STRING") {
            return tipo.CADENA;
        }
        else if (stype == "BOOLEAN") {
            return tipo.BOOLEAN;
        }
        else if (stype == "CHAR") {
            return tipo.CARACTER;
        }
        else if (stype == "VOID") {
            return tipo.VOID;
        }
        else if (stype == "ARRAY") {
            return tipo.ARRAY;
        }
        else if (stype == "STRUCT") {
            return tipo.STRUCT;
        }
        return tipo.CADENA;
    }
    getStype() {
        return this.stype;
    }
}
exports.Tipo = Tipo;

},{}],50:[function(require,module,exports){
// ------------------- global ---------------------------------------
var TabId = 0;
var ListaTab= [];
var TabActual = null;
var ejecucion = null;
var TablaGramar = [];
var controlador =null;
var entornoGlobal = null;
var entornoU = null;
var Temp = null;
var instrucciones = null;
// ------------------- reload ----------------------------------------
function loadPage(){
  let cm = new CodeMirror.fromTextArea(document.getElementById(`textInput-Blank`), {
    lineNumbers: true,
    mode: "javascript",
    theme: "dracula",
    lineWrapping: false,
    matchBrackets: true
  });
  cm.refresh;
  let tab_completo = { editor: cm, tab:`Blank`, pos:-1 };
  ListaTab.push(tab_completo);
  TabActual=tab_completo;
}
document.getElementById("body").onload = function() {loadPage()};
// ------------------- open document ---------------------------------
function openDoc(e){
    let file = document.getElementById("fileDoc");
    if (file) file.click();
}

function changeTabs(info){
  TabActual = ListaTab.find(function (element) {
      return element.tab === info;
  });
  TabActual.editor.refresh;
}

function handleFileDoc(){
    let file = document.getElementById("fileDoc").files[0];
    let fullPath = document.getElementById("fileDoc").value;
    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    var filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
    }
    filename = filename.substring(0,filename.indexOf('\.'));
    let fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        let text = fileLoadedEvent.target.result;
        addTab(filename);
        addContentTab(text,filename);
        TabId++;
    };
    fileReader.readAsText(file, "UTF-8");
}

function addTab(filename){
    let tab = document.getElementById('myTab').innerHTML;
    let aux = tab.replace("active","");
    aux = aux.replace("true","false");
    document.getElementById('myTab').innerHTML= aux +
    `<li class="nav-item" role="presentation">
    <button class="nav-link active" id="${filename}-${TabId}-tab" data-bs-toggle="tab" data-bs-target="#${filename}-${TabId}" type="button" role="tab" aria-controls="${filename}-${TabId}" aria-selected="true" onClick="changeTabs('${filename}-${TabId}')">${filename}-${TabId}</button>
    </li>`
}

function addContentTab(text,filename){
    let tab = document.getElementById('myTabContent').innerHTML;
    let aux = tab.replace("tab-pane fade show active","tab-pane fade");
    document.getElementById('myTabContent').innerHTML= aux +
        `<div class="tab-pane fade show active" id="${filename}-${TabId}" role="tabpanel" aria-labelledby="${filename}-${TabId}-tab">
        <!-- **CONSOLES** -->
        <div class="container">
            <div class="row">
                <div class="col">
                    <div style="margin-top: 20px; margin-left: 0px; margin-right: 0px;">
                        <div class="card">
                            <div class="card-body text-dark bg-light">
                                <!--  **INPUT CONSOLE**  -->
                                <label for="textInput-${filename}-${TabId}" class="form-label">Input:</label>
                                <textarea class="form-control" id="textInput-${filename}-${TabId}" rows="10"></textarea>
                                <!-- **OUTPUT CONSOLE** -->
                                <label for="textOutput-${filename}-${TabId}" class="form-label" style="margin-top: 10px;">Output:</label>
                                <textarea class="form-control" id="textOutput-${filename}-${TabId}" rows="5"></textarea>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="col">
                    <div style="margin-top: 20px; margin-left: 0px; margin-right: 0px;">
                        <div class="card">
                            <div class="card-body text-dark bg-light">
                                <label for="textInput" class="form-label">Errors:</label>
                                <table class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Handle</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">3</th>
                                        <td colspan="2">Larry the Bird</td>
                                        <td>@twitter</td>
                                      </tr>
                                    </tbody>
                                </table>
                                <label for="textInput" class="form-label">Symbols:</label>
                                <table class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Handle</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                      </tr>
                                      <tr>
                                        <th scope="row">3</th>
                                        <td colspan="2">Larry the Bird</td>
                                        <td>@twitter</td>
                                      </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="card-footer">
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" class="btn btn-primary">AST</button>
                                    <button type="button" class="btn btn-primary">CST</button>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
            </div>
        </div>
      </div>`
    let cm = new CodeMirror.fromTextArea(document.getElementById(`textInput-${filename}-${TabId}`), {
      lineNumbers: true,
      mode: "javascript",
      theme: "dracula",
      lineWrapping: false
    });
    cm.getDoc().setValue(text);
    cm.refresh;
    let tab_completo = { editor: cm, tab:`${filename}-${TabId}`, pos:TabId };
    ListaTab.push(tab_completo);
    TabActual=tab_completo;
}
// -------------------------------------- reporteria -----------------------------------------
function graficando_ast_d(contenido){
  var DOTstring = obtener_arbol_ast_(contenido);
  
  var container = document.getElementById('arbol_ast');
  var parsedData = vis.network.convertDot(DOTstring);
  
  var dataDOT = {
       nodes: parsedData.nodes,
       edges: parsedData.edges
       }
       // OPTIONs
   var options = {
   autoResize: true,
   physics:{
   stabilization:false
   },
   layout: {
           hierarchical:{
               levelSeparation: 150,
               nodeSpacing: 150,
               parentCentralization: true,
               direction: 'UD',
               sortMethod: 'directed' 
           },
       }
   };

   var network = new vis.Network(container, dataDOT, options);
  
}


function obtener_arbol_ast_(contenido){
  var grafo = `digraph {
      node [shape=box, fontsize=15]
      edge [length=150, color=#ad85e4, fontcolor=black]
      `+contenido+`}`;
  return grafo;
}


document.getElementById("prueba").onclick = function() {ej()};
document.getElementById("codigo3d").onclick = function() {ej2()};
document.getElementById("rpgramatica").onclick = function() {obtener_gramar()};

function obtener_gramar(){
  let contiene = "";
  var contador = 0;
    for (let produc of TablaGramar) {
      contador += 1;
      contiene += `<tr>
                            <th scope="row">${contador}</th>
                            <td>${produc.p}</td>
                            <td>${produc.g}</td>
                           </tr>`;
    }
    document.getElementById(`tabla_g-Blank`).innerHTML = contiene;
}

function ej(){
  ejecucion = ejecutarCodigo(TabActual.editor.getValue());
  document.getElementById(`textOutput-Blank`).value = ejecucion.salida;
  document.getElementById(`tabla_e-Blank`).innerHTML = ejecucion.tabla_e;
  document.getElementById(`tabla_s-Blank`).innerHTML = ejecucion.tabla_s;
  TablaGramar = ejecucion.gramar.slice().reverse();
  graficando_ast_d(ejecucion.ast);
}

function ej2(){
  document.getElementById(`textOutputTrans-Blank`).value = ejecutarCodigo3d();
}


Object.defineProperty(exports, "__esModule", { value: true });
const Ast_1 = require("./AST/Ast");
const TablaSim_1 = require("./TablaSimbolos/TablaSim");
const Controller_1 = require("./Controller");
const Funcion_1 = require("./Instrucciones/Funcion");
const Declaracion_1 = require("./Instrucciones/Declaracion");
const Asignacion_1 = require("./Instrucciones/Asignacion");
const Struct_1 = require("./Expresiones/Struct");
const Nodo_1 = require("./AST/Nodo");
const Arbol_1 = require("./AST/Arbol");
const Temporales_1 = require("./AST/Temporales");
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
  //traigo todas las raices
  const salida = gramatica.parse(entrada);
  instrucciones = salida.arbol;
  let listaErrores = salida.errores;
  let reportGramar = salida.reportg;
  controlador = new Controller_1.Controller();
  entornoGlobal = new TablaSim_1.TablaSim(null, "Global");
  entornoU = new TablaSim_1.TablaSim(null, "Global");
  controlador.errores = listaErrores.slice();
  Temp = new Temporales_1.Temporales();
  const ast = new Ast_1.AST(instrucciones);
  instrucciones.forEach((ins) => {
      if (ins instanceof Funcion_1.Funcion) {
          let funcion = ins;
          funcion.agregarSimboloFunc(controlador, entornoGlobal, entornoU);
      }
      if (ins instanceof Declaracion_1.Declaracion || ins instanceof Asignacion_1.Asignacion) {
          ins.ejecutar(controlador, entornoGlobal, entornoU);
      }
  });
  instrucciones.forEach((element) => {
      if (element instanceof Funcion_1.Funcion) {
          let funcion = element;
          if (funcion.getIdentificador() == "main") {
              element.ejecutar(controlador, entornoGlobal, entornoU);
          }
      }
  });
  let raiz = new Nodo_1.Nodo("Inicio", "");
  instrucciones.forEach((element) => {
      raiz.addHijo(element.recorrer());
  });
  let grafo = new Arbol_1.Arbol();
  let res = grafo.tour(raiz);
  return { salida: controlador.consola, tabla_e: controlador.graficar_tErrores(), tabla_s: controlador.recursivo_tablita(entornoGlobal, "", 0), ast: res, gramar: reportGramar };
}

function ejecutarCodigo3d() {
  instrucciones.forEach((ins) => {
      if (ins instanceof Declaracion_1.Declaracion || ins instanceof Asignacion_1.Asignacion) {
          let a = ins.traducir(Temp, controlador, entornoGlobal, entornoU);
          controlador.appendT("\n" + a.codigo3D);
      }
  });
  instrucciones.forEach((element) => {
      if (element instanceof Funcion_1.Funcion) {
          let funcion = element;
          if (funcion.getIdentificador() == "main") {
              element.traducir(Temp, controlador, entornoGlobal, entornoU);
          }
      }
  });

  return controlador.texto;
}
},{"./AST/Arbol":4,"./AST/Ast":5,"./AST/Nodo":7,"./AST/Temporales":8,"./Controller":9,"./Expresiones/Struct":23,"./Gramar/gramar":25,"./Instrucciones/Asignacion":26,"./Instrucciones/Declaracion":37,"./Instrucciones/Funcion":39,"./TablaSimbolos/TablaSim":48}]},{},[50]);
