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
exports.Controller = void 0;
class Controller {
    constructor() {
        this.errores = new Array();
        this.consola = "";
    }
    append(aux) {
        this.consola += aux;
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

},{}],9:[function(require,module,exports){
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
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
}
exports.AccesoArreglo = AccesoArreglo;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Tipo":46}],10:[function(require,module,exports){
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
}
exports.AccesoStruct = AccesoStruct;

},{"../AST/Nodo":7}],11:[function(require,module,exports){
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
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.Arreglo = Arreglo;

},{"../AST/Nodo":7,"../TablaSimbolos/Tipo":46}],12:[function(require,module,exports){
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
}
exports.Identificador = Identificador;

},{"../AST/Nodo":7}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
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
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.Aritmetica = Aritmetica;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":46,"./Operaciones":18}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cadenas = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
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
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.Cadenas = Cadenas;

},{"../../AST/Errores":6,"../../AST/Nodo":7}],15:[function(require,module,exports){
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
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
    isChar(n) {
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
    twoDecimal(numberInt) {
        return Number.parseFloat(numberInt.toFixed(4));
    }
}
exports.Conversion = Conversion;

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":46}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logicas = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
class Logicas extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, operador, linea, column) {
        super(expre1, expre2, expreU, operador, linea, column);
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == 'number') {
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == 'string') {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == 'boolean') {
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
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 && valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.OR:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        return valor_exp1 || valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.NOT:
                if (typeof valor_expU == 'boolean') {
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
}
exports.Logicas = Logicas;

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":46,"./Operaciones":18}],17:[function(require,module,exports){
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
        return n.length === 1 && n.match(/[a-zA-Z]/i);
    }
}
exports.Nativa = Nativa;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":46,"./Operaciones":18}],18:[function(require,module,exports){
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
}
exports.Operacion = Operacion;

},{"../../AST/Nodo":7}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacionales = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
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
    codigoAscii(cadena) {
        let aux = 0;
        for (let index = 0; index < cadena.length; index++) {
            aux += cadena.charCodeAt(index);
        }
        return aux;
    }
}
exports.Relacionales = Relacionales;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":46,"./Operaciones":18}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Primitivo {
    constructor(primitivo, linea, columna) {
        this.columna = columna;
        this.linea = linea;
        this.primitivo = primitivo;
    }
    getTipo(controlador, ts, ts_u) {
        let valor = this.getValor(controlador, ts, ts_u);
        if (typeof valor == 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.tipo.ENTERO;
            }
            return Tipo_1.tipo.DOUBLE;
        }
        else if (typeof valor == 'string') {
            return Tipo_1.tipo.CADENA;
        }
        else if (typeof valor == 'boolean') {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (valor === null) {
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
}
exports.Primitivo = Primitivo;

},{"../AST/Nodo":7,"../TablaSimbolos/Tipo":46}],21:[function(require,module,exports){
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
}
exports.Struct = Struct;

},{"../AST/Nodo":7,"../TablaSimbolos/Simbolos":44}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
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
}
exports.Ternario = Ternario;

},{"../AST/Errores":6,"../AST/Nodo":7}],23:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,6],$V1=[1,9],$V2=[1,8],$V3=[1,10],$V4=[1,11],$V5=[1,12],$V6=[1,13],$V7=[1,14],$V8=[1,15],$V9=[2,5,10,11,20,28,29,30,31,32],$Va=[1,21],$Vb=[11,26,62],$Vc=[8,23],$Vd=[2,121],$Ve=[1,29],$Vf=[1,27],$Vg=[1,31],$Vh=[1,69],$Vi=[1,47],$Vj=[1,52],$Vk=[1,55],$Vl=[1,63],$Vm=[1,64],$Vn=[1,65],$Vo=[1,66],$Vp=[1,56],$Vq=[1,57],$Vr=[1,58],$Vs=[1,59],$Vt=[1,60],$Vu=[1,61],$Vv=[1,54],$Vw=[1,67],$Vx=[1,68],$Vy=[1,70],$Vz=[1,71],$VA=[1,72],$VB=[1,73],$VC=[1,74],$VD=[1,75],$VE=[1,76],$VF=[1,82],$VG=[1,106],$VH=[1,104],$VI=[1,89],$VJ=[1,90],$VK=[1,91],$VL=[1,92],$VM=[1,93],$VN=[1,94],$VO=[1,95],$VP=[1,96],$VQ=[1,97],$VR=[1,98],$VS=[1,99],$VT=[1,100],$VU=[1,101],$VV=[1,102],$VW=[1,103],$VX=[1,105],$VY=[8,13,19,23,26,27,62,63,66,67,68,69,70,71,72,89,90,91,92,93,94,95,96,100],$VZ=[1,127],$V_=[1,125],$V$=[1,126],$V01=[1,143],$V11=[1,145],$V21=[1,146],$V31=[1,147],$V41=[1,148],$V51=[1,149],$V61=[1,153],$V71=[1,150],$V81=[1,151],$V91=[1,152],$Va1=[1,154],$Vb1=[1,156],$Vc1=[15,19,23],$Vd1=[1,193],$Ve1=[19,23,27],$Vf1=[8,13,19,23,27,63,66,67,68,69,70,89,90,91,92,93,94,95,96,100],$Vg1=[8,13,19,23,27,63,66,67,89,90,91,92,93,94,95,96,100],$Vh1=[2,11,15,28,29,30,31,32,46,48,98,99,110,112,116,117,118,119,121,122,124],$Vi1=[1,218],$Vj1=[1,221],$Vk1=[1,220],$Vl1=[1,219],$Vm1=[8,13,19,23,27,63,66,67,68,69,70,71,72,89,90,91,92,93,94,95,96,100],$Vn1=[8,13,19,23,27,63,89,90,91,92,95,96,100],$Vo1=[8,13,19,23,27,63,89,90,91,92,93,94,95,96,100],$Vp1=[19,23],$Vq1=[1,331],$Vr1=[15,116,117];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"INICIO":3,"CONTENIDO":4,"EOF":5,"BLOQUE_GB":6,"DECLARACIONVARIABLE":7,"ptcoma":8,"FUNCION_BLOQUE":9,"void":10,"id":11,"PARAMETROS_SENTENCIA":12,"llaveizq":13,"INSTRUCCIONES":14,"llavedec":15,"TIPO":16,"main":17,"parizq":18,"pardec":19,"struct":20,"LISTPARAMETROS":21,"LISTA_STRUCT":22,"coma":23,"DECLA_STRUCT":24,"PARAMETRO":25,"corizq":26,"cordec":27,"string":28,"int":29,"double":30,"char":31,"boolean":32,"INSTRUCCION":33,"ASIGNACION_BLOQUE":34,"PRINT_BLOQUE":35,"SENTENCIA_IF":36,"SENTENCIA_SWITCH":37,"SENTENCIA_FOR":38,"SENTENCIA_FOR_ESP":39,"SENTENCIA_WHILE":40,"SENTENCIA_DOWHILE":41,"SENTENCIA_BREAK":42,"UNARIA":43,"SENTENCIA_RETURN":44,"LLAMADA":45,"print":46,"EXPRESION":47,"println":48,"ARITMETICA":49,"CADENAS":50,"RELACIONAL":51,"LOGICA":52,"TERNARIO":53,"NATIVAS":54,"NAT_CAD":55,"NAT_FUN":56,"PRIMITIVO":57,"SENTENCIA_TERNARIO":58,"ACCESO_STRUCT":59,"LISTAARRAY":60,"ACCESO_ARREGLO":61,"punto":62,"dspuntos":63,"end":64,"begin":65,"mas":66,"menos":67,"multiplicacion":68,"division":69,"modulo":70,"concat":71,"repit":72,"caracterposition":73,"substring":74,"length":75,"touppercase":76,"tolowercase":77,"parse":78,"toint":79,"todouble":80,"typeof":81,"tostring":82,"pow":83,"sin":84,"cos":85,"tan":86,"sqrt":87,"log":88,"menor":89,"mayor":90,"menorigual":91,"mayorigual":92,"igualigual":93,"diferente":94,"or":95,"and":96,"negacion":97,"incremento":98,"decremento":99,"ternario":100,"entero":101,"decimal":102,"caracter":103,"cadena":104,"true":105,"false":106,"null":107,"LISTAIDS":108,"igual":109,"if":110,"else":111,"switch":112,"LISTACASE":113,"SENTENCIA_DEFAULT":114,"SENTENCIA_CASE":115,"case":116,"default":117,"break":118,"for":119,"in":120,"while":121,"do":122,"LISTAEXPRESIONES":123,"return":124,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"ptcoma",10:"void",11:"id",13:"llaveizq",15:"llavedec",17:"main",18:"parizq",19:"pardec",20:"struct",23:"coma",26:"corizq",27:"cordec",28:"string",29:"int",30:"double",31:"char",32:"boolean",46:"print",48:"println",62:"punto",63:"dspuntos",64:"end",65:"begin",66:"mas",67:"menos",68:"multiplicacion",69:"division",70:"modulo",71:"concat",72:"repit",73:"caracterposition",74:"substring",75:"length",76:"touppercase",77:"tolowercase",78:"parse",79:"toint",80:"todouble",81:"typeof",82:"tostring",83:"pow",84:"sin",85:"cos",86:"tan",87:"sqrt",88:"log",89:"menor",90:"mayor",91:"menorigual",92:"mayorigual",93:"igualigual",94:"diferente",95:"or",96:"and",97:"negacion",98:"incremento",99:"decremento",100:"ternario",101:"entero",102:"decimal",103:"caracter",104:"cadena",105:"true",106:"false",107:"null",109:"igual",110:"if",111:"else",112:"switch",116:"case",117:"default",118:"break",119:"for",120:"in",121:"while",122:"do",124:"return"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,1],[6,1],[9,6],[9,6],[9,6],[9,7],[9,5],[22,3],[22,1],[24,2],[12,3],[12,2],[21,3],[21,1],[25,2],[25,4],[25,2],[25,4],[16,1],[16,1],[16,1],[16,1],[16,1],[14,2],[14,1],[33,2],[33,2],[33,2],[33,1],[33,1],[33,1],[33,1],[33,1],[33,1],[33,2],[33,2],[33,2],[33,2],[33,1],[35,4],[35,4],[47,1],[47,1],[47,1],[47,1],[47,1],[47,1],[47,1],[47,1],[47,1],[47,3],[47,1],[47,1],[47,1],[47,1],[47,3],[47,1],[59,3],[61,4],[61,6],[61,6],[61,6],[61,6],[49,3],[49,3],[49,3],[49,3],[49,3],[50,3],[50,3],[55,6],[55,8],[55,5],[55,5],[55,5],[56,6],[56,4],[56,4],[56,4],[56,4],[54,6],[54,4],[54,4],[54,4],[54,4],[54,4],[51,3],[51,3],[51,3],[51,3],[51,3],[51,3],[52,3],[52,3],[52,2],[52,2],[43,2],[43,2],[43,2],[43,2],[53,7],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[57,1],[7,2],[7,4],[7,8],[7,7],[60,3],[60,1],[108,3],[108,1],[34,3],[34,5],[34,6],[36,7],[36,11],[36,9],[37,8],[37,7],[113,2],[113,1],[115,4],[114,3],[42,1],[58,5],[38,11],[38,11],[39,7],[40,5],[41,9],[45,3],[45,4],[123,3],[123,1],[44,2],[44,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return { arbol:this.$, errores: listaErrores}; 
break;
case 2: case 28:
 if($$[$0]!=null){$$[$0-1].push($$[$0]);} this.$ = $$[$0-1]; 
break;
case 3: case 29:
 if(this.$!=null){this.$ = [$$[$0]];} 
break;
case 4: case 9: case 15: case 30: case 31: case 32: case 39: case 40: case 41: case 42: case 55:
 this.$ = $$[$0-1]; 
break;
case 5: case 33: case 34: case 35: case 36: case 37: case 38: case 46: case 47: case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 56: case 57: case 58: case 59: case 61:
 this.$ = $$[$0]; 
break;
case 6:
 this.$ = null; listaErrores.push(new Errores('Sintactico', `El caracter no portenece al lenguaje ${yytext}`, this._$.first_line, this._$.first_column));
break;
case 7:
 this.$= new Funcion(3, new Tipo('VOID'), $$[$0-4], $$[$0-3], true, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 8:
 this.$= new Funcion(3, $$[$0-5], $$[$0-4], $$[$0-3], false, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 10:
 this.$= new Funcion(3, new Tipo('VOID'), $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 11:
 this.$= new Struct(3, new Tipo('STRUCT'), $$[$0-3], $$[$0-1], true, [], _$[$0-4].first_line, _$[$0-4].last_column);
break;
case 12:
 this.$ = $$[$0-2]; this.$.push($$[$0]);
break;
case 13:
 this.$ = []; this.$.push($$[$0]);
break;
case 14:
this.$ = new Declaracion($$[$0-1], [new Simbolos(1,null, $$[$0], null)], _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 16:
 this.$ = []; 
break;
case 17: case 143:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 18: case 144:
 this.$ = []; this.$.push($$[$0]); 
break;
case 19:
 this.$ = new Simbolos(6,$$[$0-1], $$[$0], null); 
break;
case 20: case 22:
 this.$ = $$[$0-3]; console.log("Parametro"); 
break;
case 21:
 this.$ = $$[$0-1]; console.log("Parametro"); 
break;
case 23:
 this.$ = new Tipo('STRING'); 
break;
case 24:
 this.$ = new Tipo('ENTERO'); 
break;
case 25:
 this.$ = new Tipo('DECIMAL');
break;
case 26:
 this.$ = new Tipo('CHAR'); 
break;
case 27:
 this.$ = new Tipo('BOOLEAN'); 
break;
case 43:
 this.$=null; listaErrores.push(new Errores('Sintactico', `No se esperaba el token ${yytext}`, this._$.first_line, this._$.first_column)); 
break;
case 44:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 45:
 this.$ = new Println($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 60:
 this.$ = new Arreglo($$[$0-1]); 
break;
case 62:
 this.$ = new AccesoStruct($$[$0-2],new Identificador($$[$0], _$[$0-2].first_line, _$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 63:
this.$= new AccesoArreglo($$[$0-3],$$[$0-1],null,false,null,null,_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 64:
this.$= new AccesoArreglo($$[$0-5],$$[$0-3],$$[$0-1],true,null,null,_$[$0-5].first_line,_$[$0-5].last_column); 
break;
case 65:
this.$= new AccesoArreglo($$[$0-5],$$[$0-3],null,true,null,$$[$0-1],_$[$0-5].first_line,_$[$0-5].last_column); 
break;
case 66:
this.$= new AccesoArreglo($$[$0-5],null,$$[$0-1],true,$$[$0-3],null,_$[$0-5].first_line,_$[$0-5].last_column); 
break;
case 67:
this.$= new AccesoArreglo($$[$0-5],null,null,true,$$[$0-3],$$[$0-1],_$[$0-5].first_line,_$[$0-5].last_column); 
break;
case 68:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'+', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 69:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'-', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 70:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'*', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 71:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'/', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 72:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'%', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 73:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'&', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 74:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'^', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 75:
 this.$ = new Cadenas($$[$0-5], $$[$0-1], null ,'caracterposition', _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 76:
 this.$ = new Cadenas($$[$0-7], $$[$0-3], $$[$0-1] ,'substring', _$[$0-7].first_line,_$[$0-7].last_column);
break;
case 77:
 this.$ = new Cadenas($$[$0-4], null, null ,'length', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 78:
 this.$ = new Cadenas($$[$0-4], null, null ,'touppercase', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 79:
 this.$ = new Cadenas($$[$0-4], null, null ,'tolowercase', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 80:
 this.$ = new Conversion($$[$0-5], $$[$0-1],'parse', _$[$0-5].first_line,_$[$0-5].last_column); 
break;
case 81:
 this.$ = new Conversion(null, $$[$0-1],'toint', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 82:
 this.$ = new Conversion(null, $$[$0-1],'todouble', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 83:
 this.$ = new Conversion(null, $$[$0-1],'typeof', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 84:
 this.$ = new Conversion(null, $$[$0-1],'tostring', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 85:
 this.$ = new Nativa($$[$0-3], $$[$0-1], false ,'pow', _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 86:
 this.$ = new Nativa($$[$0-1], null, true , 'sin',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 87:
 this.$ = new Nativa($$[$0-1], null, true , 'cos',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 88:
 this.$ = new Nativa($$[$0-1], null, true , 'tan',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 89:
 this.$ = new Nativa($$[$0-1], null, true , 'sqrt',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 90:
 this.$ = new Nativa($$[$0-1], null, true , 'log',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 91:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 92:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 93:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 94:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 95:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'==', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 96:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'!=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 97:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'||', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 98:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'&&', _$[$0-2].first_line, _$[$0-2].last_column);
break;
case 99:
 this.$ = new Logicas($$[$0], null, true , '!',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 100:
 this.$ = new Aritmetica($$[$0], null, true , 'UNARIO',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 101:
 this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 102:
 this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 103:
 this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 104:
 this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 105:
 this.$ = $$[$0-6]; console.log("ternario"); 
break;
case 106: case 107:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 108: case 109:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 110:
this.$ = new Identificador($$[$0], _$[$0].first_line, _$[$0].last_column);
break;
case 111:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 112:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 113:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); 
break;
case 114:
 this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column);  
break;
case 115:
 this.$ = new Declaracion($$[$0-3], [new Simbolos(1,null, $$[$0-2], $$[$0])], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 116:
 this.$ = new Declaracion($$[$0-7], [new Simbolos(1,null, $$[$0-4], new Arreglo($$[$0-1]))],_$[$0-7].first_line,_$[$0-7].first_column);
break;
case 117:
 this.$ = new DeclaracionStruct($$[$0-6],$$[$0-5],$$[$0-3],$$[$0-1],_$[$0-6].first_line,_$[$0-6].first_column);
break;
case 118:
  this.$ = $$[$0-2]; this.$.push($$[$0]);
break;
case 119:
  this.$ = []; this.$.push($$[$0]);
break;
case 120:
$$[$0-2].push(new Simbolos(1,null, $$[$0], null)); this.$ = $$[$0-2]; 
break;
case 121:
 this.$ = [new Simbolos(1,null, $$[$0], null)]; 
break;
case 122:
this.$ = new Asignacion($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].last_column);  
break;
case 123:
this.$ = new AsignacionStruct(new Identificador($$[$0-4], _$[$0-4].first_line, _$[$0-4].last_column), new Identificador($$[$0-2], _$[$0-4].first_line, _$[$0-4].last_column),$$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 124:
 this.$ = []; this.$.push(new AsignacionArray($$[$0-5],$$[$0-3],$$[$0],_$[$0-5].first_line,_$[$0-5].first_column)); 
break;
case 125:
 this.$ = new If( $$[$0-4], $$[$0-1], [], _$[$0-6].first_line, _$[$0-6].last_column ); 
break;
case 126:
 this.$ = new If( $$[$0-8], $$[$0-5], $$[$0-1], _$[$0-10].first_line, _$[$0-10].last_column ); 
break;
case 127:
 this.$ = new If( $$[$0-6], $$[$0-3], [$$[$0]], _$[$0-8].first_line, _$[$0-8].last_column ); 
break;
case 128:
 this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 129:
 this.$ = new Switch($$[$0-4],$$[$0-1],null,_$[$0-6].first_line,_$[$0-6].last_column); 
break;
case 130:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 131:
 this.$ = [$$[$0]]; 
break;
case 132:
this.$ = new Case($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 133:
 this.$ =new Default($$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 134:
 this.$ = new Break(); 
break;
case 135:
 this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 136: case 137:
 this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line, _$[$0-10].last_column); 
break;
case 138:
 this.$ = new ForEsp(new Simbolos(1,null, $$[$0-5], null),$$[$0-3],$$[$0-1],_$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 139:
 this.$ = new While( $$[$0-3], $$[$0-1], _$[$0-4].first_line, _$[$0-4].last_column);  
break;
case 140:
 this.$ = new DoWhile($$[$0-2],$$[$0-6],_$[$0-8].first_line,_$[$0-8].first_column); 
break;
case 141:
 this.$ = new Llamada($$[$0-2], [], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 142:
 this.$ = new Llamada($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 145:
 this.$ = new Return($$[$0]);
break;
case 146:
 this.$ = new Return(null);
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,9:5,10:$V1,11:$V2,16:7,20:$V3,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},{1:[3]},{2:$V0,5:[1,16],6:17,7:4,9:5,10:$V1,11:$V2,16:7,20:$V3,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},o($V9,[2,3]),{8:[1,18]},o($V9,[2,5]),o($V9,[2,6]),{11:[1,20],26:$Va,108:19},{11:[1,22]},{11:[1,23],17:[1,24]},{11:[1,25]},o($Vb,[2,23]),o($Vb,[2,24]),o($Vb,[2,25]),o($Vb,[2,26]),o($Vb,[2,27]),{1:[2,1]},o($V9,[2,2]),o($V9,[2,4]),{8:[2,114],23:[1,26]},o($Vc,$Vd,{12:28,18:$Ve,109:$Vf}),{27:[1,30]},{12:32,18:$Ve,109:$Vg},{12:33,18:$Ve},{18:[1,34]},{13:[1,35]},{11:[1,36]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:37,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{13:[1,77]},{11:$VF,16:81,19:[1,79],21:78,25:80,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},{11:[1,83]},{11:[1,84]},{13:[1,85]},{13:[1,86]},{19:[1,87]},{11:$VF,16:81,21:88,25:80,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},o($Vc,[2,120]),{8:[2,115],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},o($VY,[2,46]),o($VY,[2,47]),o($VY,[2,48]),o($VY,[2,49]),o($VY,[2,50]),o($VY,[2,51]),o($VY,[2,52]),o($VY,[2,53]),o($VY,[2,54]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:107,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,56]),o($VY,[2,57]),o($VY,[2,58]),o($VY,[2,59]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:109,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,60:108,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,61]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:110,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:111,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{18:[1,112]},{18:[1,113]},{18:[1,114]},{18:[1,115]},{18:[1,116]},{18:[1,117]},{62:[1,118]},{18:[1,119]},{18:[1,120]},{18:[1,121]},{18:[1,122]},{11:[1,123]},{11:[1,124]},o($VY,[2,110],{18:$VZ,98:$V_,99:$V$}),o($VY,[2,106]),o($VY,[2,107]),o($VY,[2,108]),o($VY,[2,109]),o($VY,[2,111]),o($VY,[2,112]),o($VY,[2,113]),{2:$V01,7:130,11:$V11,14:128,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{19:[1,155],23:$Vb1},{13:[2,16]},o($Vc1,[2,18]),{11:[1,157],26:[1,158]},{11:[1,159],26:[1,160]},{109:[1,161]},{18:[1,162]},{2:$V01,7:130,11:$V11,14:163,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,14:164,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{13:[1,165]},{15:[1,166],23:$Vb1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:167,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:168,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:169,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:170,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:171,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:172,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:173,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:174,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:175,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:176,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:177,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:178,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:179,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:180,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:181,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:[1,187],73:[1,182],74:[1,183],75:[1,184],76:[1,185],77:[1,186]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:188,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:189,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,65:[1,190],67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{19:[1,191],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{23:$Vd1,27:[1,192]},o($Ve1,[2,119],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX}),o($Vf1,[2,99],{26:$VG,62:$VH,71:$VN,72:$VO}),o($Vg1,[2,100],{26:$VG,62:$VH,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO}),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:194,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:195,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:196,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:197,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:198,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:199,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{78:[1,200]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:201,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:202,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:203,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:204,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,101]),o($VY,[2,102]),o($VY,[2,103]),o($VY,[2,104]),{11:$Vh,16:62,18:$Vi,19:[1,205],26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:207,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE,123:206},{2:$V01,7:130,11:$V11,15:[1,208],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($Vh1,[2,29]),{8:[1,210]},{8:[1,211]},{8:[1,212]},o($Vh1,[2,33]),o($Vh1,[2,34]),o($Vh1,[2,35]),o($Vh1,[2,36]),o($Vh1,[2,37]),o($Vh1,[2,38]),{8:[1,213]},{8:[1,214]},{8:[1,215]},{8:[1,216]},o($Vh1,[2,43]),{11:[1,217],26:$Va,108:19},{11:$Vi1,18:$VZ,26:$Vj1,62:$Vk1,98:$V_,99:$V$,109:$Vl1},{18:[1,222]},{18:[1,223]},{18:[1,224]},{18:[1,225]},{11:[1,227],18:[1,226]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:228,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{13:[1,229]},{8:[2,134]},{8:[2,146],11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:230,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{13:[2,15]},{11:$VF,16:81,25:231,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8},o($Vc1,[2,19]),{27:[1,232]},o($Vc1,[2,21]),{27:[1,233]},{26:[1,234]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:109,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,60:235,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{2:$V01,7:130,11:$V11,15:[1,236],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,15:[1,237],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,14:238,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($V9,[2,11]),o($Vg1,[2,68],{26:$VG,62:$VH,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO}),o($Vg1,[2,69],{26:$VG,62:$VH,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO}),o($Vf1,[2,70],{26:$VG,62:$VH,71:$VN,72:$VO}),o($Vf1,[2,71],{26:$VG,62:$VH,71:$VN,72:$VO}),o($Vf1,[2,72],{26:$VG,62:$VH,71:$VN,72:$VO}),o([8,13,19,23,27,63,66,67,68,69,70,71,89,90,91,92,93,94,95,96,100],[2,73],{26:$VG,62:$VH,72:$VO}),o($Vm1,[2,74],{26:$VG,62:$VH}),o($Vn1,[2,91],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,93:$VT,94:$VU}),o($Vn1,[2,92],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,93:$VT,94:$VU}),o($Vn1,[2,93],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,93:$VT,94:$VU}),o($Vn1,[2,94],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,93:$VT,94:$VU}),o($Vo1,[2,95],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO}),o($Vo1,[2,96],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO}),o([8,13,19,23,27,63,95,100],[2,97],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,96:$VW}),o([8,13,19,23,27,63,95,96,100],[2,98],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU}),{18:[1,239]},{18:[1,240]},{18:[1,241]},{18:[1,242]},{18:[1,243]},o($VY,[2,62]),{26:$VG,62:$VH,63:[1,244],66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{26:$VG,27:[1,245],62:$VH,63:[1,246],66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{63:[1,247]},o($VY,[2,55]),o($VY,[2,60]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:249,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{23:[1,250],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,251],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,252],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,253],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,254],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,255],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{18:[1,256]},{19:[1,257],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,258],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,259],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,260],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},o($VY,[2,141]),{19:[1,261],23:[1,262]},o($Vp1,[2,144],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX}),o($V9,[2,8]),o($Vh1,[2,28]),o($Vh1,[2,30]),o($Vh1,[2,31]),o($Vh1,[2,32]),o($Vh1,[2,39]),o($Vh1,[2,40]),o($Vh1,[2,41]),o($Vh1,[2,42]),o($Vc,$Vd,{109:$Vf}),{109:$Vg},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:263,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:[1,264]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:265,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:266,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:267,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:268,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:269,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{7:270,11:[1,272],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,34:271},{120:[1,273]},{13:[1,274],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{2:$V01,7:130,11:$V11,14:275,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{8:[2,145],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},o($Vc1,[2,17]),{11:[1,276]},{11:[1,277]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:109,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,60:278,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{19:[1,279],23:$Vd1},o($V9,[2,9]),o($V9,[2,7]),{2:$V01,7:130,11:$V11,15:[1,280],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:281,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:282,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{19:[1,283]},{19:[1,284]},{19:[1,285]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:286,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,63]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:287,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,64:[1,288],67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:289,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,64:[1,290],67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:291,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($Ve1,[2,118],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX}),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:292,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,86]),o($VY,[2,87]),o($VY,[2,88]),o($VY,[2,89]),o($VY,[2,90]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:293,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,81]),o($VY,[2,82]),o($VY,[2,83]),o($VY,[2,84]),o($VY,[2,142]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:294,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{8:[2,122],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{109:[1,295]},{26:$VG,27:[1,296],62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,297],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,298],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,299],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,300],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{8:[1,301]},{8:[1,302]},{11:$Vi1,26:$Vj1,62:$Vk1,109:$Vl1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:303,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{2:$V01,7:130,11:$V11,14:304,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,15:[1,305],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($Vc1,[2,20]),o($Vc1,[2,22]),{23:$Vd1,27:[1,306]},{8:[2,117]},o($V9,[2,10]),{19:[1,307],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{23:[1,308],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},o($VY,[2,77]),o($VY,[2,78]),o($VY,[2,79]),o([8,13,19,23,27,63],[2,135],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX}),{26:$VG,27:[1,309],62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{27:[1,310]},{26:$VG,27:[1,311],62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{27:[1,312]},{26:$VG,62:$VH,63:[1,313],66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,314],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,315],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},o($Vp1,[2,143],{26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX}),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:316,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{109:[1,317]},{8:[2,44]},{8:[2,45]},{13:[1,318]},{13:[1,319]},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:320,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:321,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{13:[1,322],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{2:$V01,7:130,11:$V11,15:[1,323],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{121:[1,324]},{8:[2,116]},o($VY,[2,75]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:325,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,64]),o($VY,[2,65]),o($VY,[2,66]),o($VY,[2,67]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:326,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,85]),o($VY,[2,80]),{8:[2,123],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:327,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{2:$V01,7:130,11:$V11,14:328,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{113:329,115:330,116:$Vq1},{8:[1,332],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{8:[1,333],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{2:$V01,7:130,11:$V11,14:334,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($Vh1,[2,139]),{18:[1,335]},{19:[1,336],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},o($Vm1,[2,105],{26:$VG,62:$VH}),{8:[2,124],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{2:$V01,7:130,11:$V11,15:[1,337],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{15:[1,339],114:338,115:340,116:$Vq1,117:[1,341]},o($Vr1,[2,131]),{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:342,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:343,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:344,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},{2:$V01,7:130,11:$V11,15:[1,345],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{11:$Vh,16:62,18:$Vi,26:$Vj,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,43:46,45:50,47:346,49:38,50:39,51:40,52:41,53:42,54:43,55:44,56:45,57:48,58:49,59:51,61:53,67:$Vk,79:$Vl,80:$Vm,81:$Vn,82:$Vo,83:$Vp,84:$Vq,85:$Vr,86:$Vs,87:$Vt,88:$Vu,97:$Vv,98:$Vw,99:$Vx,101:$Vy,102:$Vz,103:$VA,104:$VB,105:$VC,106:$VD,107:$VE},o($VY,[2,76]),o($Vh1,[2,125],{111:[1,347]}),{15:[1,348]},o($Vh1,[2,129]),o($Vr1,[2,130]),{63:[1,349]},{26:$VG,62:$VH,63:[1,350],66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,351],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{19:[1,352],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},o($Vh1,[2,138]),{19:[1,353],26:$VG,62:$VH,66:$VI,67:$VJ,68:$VK,69:$VL,70:$VM,71:$VN,72:$VO,89:$VP,90:$VQ,91:$VR,92:$VS,93:$VT,94:$VU,95:$VV,96:$VW,100:$VX},{13:[1,354],36:355,110:$V41},o($Vh1,[2,128]),{2:$V01,7:130,11:$V11,14:356,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,14:357,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{13:[1,358]},{13:[1,359]},{8:[1,360]},{2:$V01,7:130,11:$V11,14:361,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($Vh1,[2,127]),{2:$V01,7:130,11:$V11,15:[2,133],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($Vr1,[2,132],{7:130,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,16:144,33:209,2:$V01,11:$V11,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1}),{2:$V01,7:130,11:$V11,14:362,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,14:363,16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:129,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($Vh1,[2,140]),{2:$V01,7:130,11:$V11,15:[1,364],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,15:[1,365],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},{2:$V01,7:130,11:$V11,15:[1,366],16:144,28:$V4,29:$V5,30:$V6,31:$V7,32:$V8,33:209,34:131,35:132,36:133,37:134,38:135,39:136,40:137,41:138,42:139,43:140,44:141,45:142,46:$V21,48:$V31,98:$Vw,99:$Vx,110:$V41,112:$V51,118:$V61,119:$V71,121:$V81,122:$V91,124:$Va1},o($Vh1,[2,126]),o($Vh1,[2,136]),o($Vh1,[2,137])],
defaultActions: {16:[2,1],79:[2,16],153:[2,134],155:[2,15],279:[2,117],297:[2,44],298:[2,45],306:[2,116]},
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

    const {Primitivo} = require("../Expresiones/Primitivo");
    const {Print} = require("../Instrucciones/Print");
    const {Println} = require("../Instrucciones/Println");
    const {Aritmetica} = require("../Expresiones/Operaciones/Aritmetica");
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
    const {Ternario} = require("../Expresiones/Ternario");
    const {For} = require("../Instrucciones/Ciclica/For");
    const {ForEsp} = require("../Instrucciones/Ciclica/ForEsp");
    const {While} = require("../Instrucciones/Ciclica/While");
    const {DoWhile} = require("../Instrucciones/Ciclica/DoWhile");
    const {Funcion} = require("../Instrucciones/Funcion");
    const {Llamada} = require("../Instrucciones/Llamada");
    const {Return} = require("../Instrucciones/Transferencia/Return");
    const {AsignacionArray} = require("../Instrucciones/AsignacionArray");
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
case 3:return 102       // NUMERICO
break;
case 4:return 101
break;
case 5:return 95        //RELACIONAL
break;
case 6:return 96
break;
case 7:return 98
break;
case 8:return 99
break;
case 9:return 71
break;
case 10:return 72
break;
case 11:return 66           //ARITEMETICO
break;
case 12:return 67
break;
case 13:return 68
break;
case 14:return 69
break;
case 15:return 70
break;
case 16:return 91   // LOGICO
break;
case 17:return 92
break;
case 18:return 94
break;
case 19:return 93
break;
case 20:return 90
break;
case 21:return 89
break;
case 22:return 97
break;
case 23:return 100   //TERNARIO
break;
case 24:return 63
break;
case 25:return 62
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
case 34:return 109
break;
case 35: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 103; 
break;
case 36: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 104; 
break;
case 37:return 82
break;
case 38:return 29      //TIPOS
break;
case 39:return 30
break;
case 40:return 31
break;
case 41:return 32
break;
case 42:return 28
break;
case 43:return 105
break;
case 44:return 106
break;
case 45:return 83     //NATIVAS
break;
case 46:return 84
break;
case 47:return 85
break;
case 48:return 86
break;
case 49:return 87
break;
case 50:return 88
break;
case 51:return 46
break;
case 52:return 48
break;
case 53:return 78
break;
case 54:return 79
break;
case 55:return 80
break;
case 56:return 81
break;
case 57:return 110
break;
case 58:return 111
break;
case 59:return 112
break;
case 60:return 116
break;
case 61:return 117
break;
case 62:return 118
break;
case 63:return 'continue'
break;
case 64:return 65
break;
case 65:return 64
break;
case 66:return 121
break;
case 67:return 122
break;
case 68:return 119
break;
case 69:return 120
break;
case 70:return 75
break;
case 71:return 74
break;
case 72:return 73
break;
case 73:return 10
break;
case 74:return 124
break;
case 75:return 17
break;
case 76:return 107
break;
case 77:return 20
break;
case 78:return 76
break;
case 79:return 77
break;
case 80:return 11
break;
case 81:return 5
break;
case 82: listaErrores.push( new Errores('Lexico', `El caracter no portenece al lenguaje ${yy_.yytext}`,  yy_.yylloc.first_line, yy_.yylloc.first_column)); 
break;
}
},
rules: [/^(?:[ \r\t\n]+)/,/^(?:\/\/.([^\n])*)/,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/,/^(?:[0-9]+(\.[0-9]+))/,/^(?:[0-9]+)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:\+\+)/,/^(?:--)/,/^(?:&)/,/^(?:\^)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:<=)/,/^(?:>=)/,/^(?:!=)/,/^(?:==)/,/^(?:>)/,/^(?:<)/,/^(?:!)/,/^(?:\?)/,/^(?::)/,/^(?:\.)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?:,)/,/^(?:=)/,/^(?:[\'\‘\’].[\'\’\‘])/,/^(?:[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”])/,/^(?:string\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:boolean\b)/,/^(?:String\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:pow\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:sqrt\b)/,/^(?:log10\b)/,/^(?:print\b)/,/^(?:println\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:typeof\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:in\b)/,/^(?:length\b)/,/^(?:subString\b)/,/^(?:caracterOfPosition\b)/,/^(?:void\b)/,/^(?:return\b)/,/^(?:main\b)/,/^(?:null\b)/,/^(?:struct\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82],"inclusive":true}}
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
},{"../AST/Errores":6,"../Expresiones/AccesoArreglo":9,"../Expresiones/AccesoStruct":10,"../Expresiones/Arreglo":11,"../Expresiones/Identificador":12,"../Expresiones/Operaciones/Aritmetica":13,"../Expresiones/Operaciones/Cadenas":14,"../Expresiones/Operaciones/Conversion":15,"../Expresiones/Operaciones/Logicas":16,"../Expresiones/Operaciones/Nativa":17,"../Expresiones/Operaciones/Relacionales":19,"../Expresiones/Primitivo":20,"../Expresiones/Struct":21,"../Expresiones/Ternario":22,"../Instrucciones/Asignacion":24,"../Instrucciones/AsignacionArray":25,"../Instrucciones/AsignacionStruct":26,"../Instrucciones/Ciclica/DoWhile":27,"../Instrucciones/Ciclica/For":28,"../Instrucciones/Ciclica/ForEsp":29,"../Instrucciones/Ciclica/While":30,"../Instrucciones/Control/Case":31,"../Instrucciones/Control/Default":32,"../Instrucciones/Control/If":33,"../Instrucciones/Control/Switch":34,"../Instrucciones/Declaracion":35,"../Instrucciones/DeclaracionStruct":36,"../Instrucciones/Funcion":37,"../Instrucciones/Llamada":38,"../Instrucciones/Print":39,"../Instrucciones/Println":40,"../Instrucciones/Transferencia/Break":41,"../Instrucciones/Transferencia/Return":43,"../TablaSimbolos/Simbolos":44,"../TablaSimbolos/Tipo":46,"_process":3,"fs":1,"path":2}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
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
            let error = new Errores_1.Errores('Semantico', `La variable ${this.valor.getValor(controlador, ts, ts_u)}, no existe en el entorno`, this.linea, this.column);
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
}
exports.Asignacion = Asignacion;

},{"../AST/Errores":6,"../AST/Nodo":7}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArray = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AsignacionArray {
    constructor(identificador, accesos, valor, linea, column) {
        this.identificador = identificador;
        this.niveles = accesos;
        this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts, ts_u) {
        var _a;
        if (ts.existe(this.identificador)) {
            let simbolo = ts.getSimbolo(this.identificador);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.getTipo().tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
                controlador.append(`La variable ${this.identificador}, no es un Array nn la linea ${this.linea}, y columna ${this.column}`);
            }
            else {
                let dimension = this.niveles.getValor(controlador, ts, ts_u);
                let valor = this.valor.getValor(controlador, ts, ts_u);
                let array = simbolo.getValor();
                // array.valores = array.setValor(dimension, array.valores, valor, this.linea, this.column);
                simbolo.valor = array;
                (_a = ts.getSimbolo(this.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(simbolo);
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Asignacion", "");
        return padre;
    }
}
exports.AsignacionArray = AsignacionArray;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Tipo":46}],26:[function(require,module,exports){
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
            entornos.forEach(entorno => {
                var _a;
                if (entorno.nombre == this.identificador1.identificador) {
                    // let valor = entorno.getSimbolo(this.identificador2);
                    let valor = this.valor.getValor(controlador, ts, ts_u);
                    // let valor = vara.getValor();
                    (_a = entorno.getSimbolo(this.identificador2.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
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
}
exports.AsignacionStruct = AsignacionStruct;

},{"../AST/Nodo":7}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
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
}
exports.DoWhile = DoWhile;

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":45,"../Transferencia/Break":41,"../Transferencia/Continue":42,"../Transferencia/Return":43}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Nodo_1 = require("../../AST/Nodo");
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
}
exports.For = For;

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":45,"../Transferencia/Break":41,"../Transferencia/Continue":42,"../Transferencia/Return":43}],29:[function(require,module,exports){
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
class ForEsp {
    constructor(asi, acuta, list, linea, col) {
        this.asig_decla = asi;
        this.actualizacion = acuta;
        this.lista_ins = list;
        this.linea = linea;
        this.columna = col;
    }
    ejecutar(controlador, ts, ts_u) {
        var _a;
        let variable = this.asig_decla;
        let valor_condi = this.actualizacion.getValor(controlador, ts, ts_u);
        variable.tipo = this.actualizacion.getTipo(controlador, ts, ts_u);
        // Se mete a la tabla de simbolos la variable
        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, variable.tipo, variable.identificador, null);
        ts.agregar(variable.identificador, nuevo_sim);
        ts_u.agregar(variable.identificador, nuevo_sim);
        if (typeof valor_condi == "string") {
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
}
exports.ForEsp = ForEsp;

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Simbolos":44,"../../TablaSimbolos/TablaSim":45,"../Transferencia/Break":41,"../Transferencia/Continue":42,"../Transferencia/Return":43}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Continue_1 = require("../Transferencia/Continue");
const Return_1 = require("../Transferencia/Return");
class While {
    constructor(condicion, lista_ins, linea, columna) {
        this.condicion = condicion;
        this.lista_ins = lista_ins;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (typeof valor_condi == 'boolean') {
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
}
exports.While = While;

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":45,"../Transferencia/Break":41,"../Transferencia/Continue":42,"../Transferencia/Return":43}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const Nodo_1 = require("../../AST/Nodo");
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
}
exports.Case = Case;

},{"../../AST/Nodo":7,"../Transferencia/Break":41,"../Transferencia/Return":43}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const Nodo_1 = require("../../AST/Nodo");
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
}
exports.Default = Default;

},{"../../AST/Nodo":7,"../Transferencia/Break":41,"../Transferencia/Return":43}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Nodo_1 = require("../../AST/Nodo");
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
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts, "If");
        ts.setSiguiente(ts_local);
        let valor_condi = this.condicion.getValor(controlador, ts, ts_u);
        if (this.condicion.getTipo(controlador, ts, ts_u) == Tipo_1.tipo.BOOLEAN) {
            if (valor_condi) {
                for (let ins of this.lista_ifs) {
                    let res = ins.ejecutar(controlador, ts_local, ts_u);
                    if (ins instanceof Break_1.Break || res instanceof Break_1.Break || ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
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
                    if (ins instanceof Break_1.Break || res instanceof Break_1.Break || ins instanceof Continue_1.Continue || res instanceof Continue_1.Continue) {
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
}
exports.If = If;

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":45,"../../TablaSimbolos/Tipo":46,"../Transferencia/Break":41,"../Transferencia/Continue":42,"../Transferencia/Return":43}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSim_1 = require("../../TablaSimbolos/TablaSim");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
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
            if (this.valor.getValor(controlador, ts, ts_u) ==
                caso.expresion.getValor(controlador, ts, ts_u)) {
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
}
exports.Switch = Switch;

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":45,"../Transferencia/Break":41,"../Transferencia/Return":43}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Arreglo_1 = require("../Expresiones/Arreglo");
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
                let error = new Errores_1.Errores('Semantico', `La variable ${variable.identificador}, ya se declaro anteriormente`, this.linea, this.columna);
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
                        let error = new Errores_1.Errores('Semantico', `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                        controlador.errores.push(error);
                    }
                }
                else {
                    let valor = variable.valor.getValor(controlador, ts, ts_u);
                    let tipo_valor = variable.valor.getTipo(controlador, ts, ts_u);
                    if (tipo_valor == this.tipo.tipo || ((tipo_valor == Tipo_1.tipo.DOUBLE || tipo_valor == Tipo_1.tipo.ENTERO) && (this.tipo.tipo == Tipo_1.tipo.ENTERO || this.tipo.tipo == Tipo_1.tipo.DOUBLE)) || (tipo_valor == Tipo_1.tipo.CADENA && this.tipo.tipo == Tipo_1.tipo.CARACTER)) {
                        let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                        ts.agregar(variable.identificador, nuevo_sim);
                        ts_u.agregar(variable.identificador, nuevo_sim);
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
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
}
exports.Declaracion = Declaracion;

},{"../AST/Errores":6,"../AST/Nodo":7,"../Expresiones/Arreglo":11,"../TablaSimbolos/Simbolos":44,"../TablaSimbolos/Tipo":46}],36:[function(require,module,exports){
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
}
exports.DeclaracionStruct = DeclaracionStruct;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":44,"../TablaSimbolos/TablaSim":45,"../TablaSimbolos/Tipo":46}],37:[function(require,module,exports){
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
        this.lista_ints.forEach(element => {
            padre.addHijo(element.recorrer());
        });
        return padre;
    }
}
exports.Funcion = Funcion;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":44,"../TablaSimbolos/TablaSim":45,"./Transferencia/Break":41,"./Transferencia/Continue":42,"./Transferencia/Return":43}],38:[function(require,module,exports){
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
            let error = new Errores_1.Errores("Semantico", `Las variables  no son del mismo tipo`, this.linea, this.column);
            controlador.errores.push(error);
            controlador.append(`Las variablesno son del mismo tipo, En la linea ${this.linea}, y columna ${this.column}`);
        }
        return false;
    }
}
exports.Llamada = Llamada;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":44,"../TablaSimbolos/TablaSim":45,"../TablaSimbolos/Tipo":46}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../AST/Nodo");
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
}
exports.Print = Print;

},{"../AST/Nodo":7}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Println = void 0;
const Nodo_1 = require("../AST/Nodo");
class Println {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts, ts_u) {
        let valor = this.expresion.getValor(controlador, ts, ts_u);
        controlador.append(valor + '\n');
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
}
exports.Println = Println;

},{"../AST/Nodo":7}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Break {
    constructor() {
    }
    ejecutar(controlador, ts, ts_u) {
        return this;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
}
exports.Break = Break;

},{"../../AST/Nodo":7}],42:[function(require,module,exports){
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
}
exports.Continue = Continue;

},{"../../AST/Nodo":7}],43:[function(require,module,exports){
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
}
exports.Return = Return;

},{"../../AST/Nodo":7}],44:[function(require,module,exports){
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
    setValor(valor) {
        this.valor = valor;
    }
    getValor() {
        return this.valor;
    }
}
exports.Simbolos = Simbolos;

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSim = void 0;
class TablaSim {
    constructor(ant, nombre) {
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
}
exports.TablaSim = TablaSim;

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = exports.tipo = void 0;
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
})(tipo = exports.tipo || (exports.tipo = {}));
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

},{}],47:[function(require,module,exports){
// ------------------- global ---------------------------------------
var TabId = 0;
var ListaTab= [];
var TabActual = null;
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


function ej(){
  let ejecucion = ejecutarCodigo(TabActual.editor.getValue());
  document.getElementById(`textOutput-Blank`).value = ejecucion.salida;
  document.getElementById(`tabla_e-Blank`).innerHTML = ejecucion.tabla_e;
  document.getElementById(`tabla_s-Blank`).innerHTML = ejecucion.tabla_s;
  graficando_ast_d(ejecucion.ast);
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
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
  //traigo todas las raices
  const salida = gramatica.parse(entrada);
  const instrucciones = salida.arbol;
  let listaErrores = salida.errores;
  let controlador = new Controller_1.Controller();
  const entornoGlobal = new TablaSim_1.TablaSim(null, "Global");
  let entornoU = new TablaSim_1.TablaSim(null, "Global");
  controlador.errores = listaErrores.slice();
  const ast = new Ast_1.AST(instrucciones);
  instrucciones.forEach((ins) => {
      if (ins instanceof Funcion_1.Funcion) {
          let funcion = ins;
          funcion.agregarSimboloFunc(controlador, entornoGlobal, entornoU);
      }
    if (ins instanceof Struct_1.Struct) {
      let funcion = ins;
      funcion.agregarSimboloStruct(controlador, entornoGlobal, entornoU);
     // funcion.ejecutar(controlador, entornoGlobal, entornoU);
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
  console.log(entornoGlobal);
  return { salida: controlador.consola, tabla_e: controlador.graficar_tErrores(), tabla_s: controlador.recursivo_tablita(entornoGlobal, "", 0), ast: res };
}
},{"./AST/Arbol":4,"./AST/Ast":5,"./AST/Nodo":7,"./Controller":8,"./Expresiones/Struct":21,"./Gramar/gramar":23,"./Instrucciones/Asignacion":24,"./Instrucciones/Declaracion":35,"./Instrucciones/Funcion":37,"./TablaSimbolos/TablaSim":45}]},{},[47]);
