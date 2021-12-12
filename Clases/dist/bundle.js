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
                            <td>Global</td>
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
    constructor(identificador, accesos, linea, column) {
        this.identificador = identificador;
        this.niveles = accesos;
        //  this.valor = valor;
        this.linea = linea;
        this.column = column;
    }
    getTipo(controlador, ts, ts_u) {
        /*if(ts.existe(this.identificador)){
            let simbolo = ts.getSimbolo(this.identificador);
            if(simbolo?.getTipo()==)

        }*/
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            return id_exists.tipo.tipo;
        }
    }
    getValor(controlador, ts, ts_u) {
        let id_exists = ts.getSimbolo(this.identificador);
        if (id_exists != null) {
            if ((id_exists === null || id_exists === void 0 ? void 0 : id_exists.tipo.tipo) != Tipo_1.tipo.ARRAY) {
                let error = new Errores_1.Errores('Semantico', `La variable ${this.identificador}, no es un Array`, this.linea, this.column);
                controlador.errores.push(error);
                controlador.append(`La variable ${this.identificador}, no es un Array nn la linea ${this.linea}, y columna ${this.column}`);
            }
            else {
                let dimension = this.niveles.getValor(controlador, ts, ts_u);
                let array = id_exists.getValor();
                // return array.getValor(dimension, array.valores, this.linea, this.column); 
            }
        }
        else {
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
}
exports.AccesoArreglo = AccesoArreglo;

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Tipo":42}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
const Nodo_1 = require("../AST/Nodo");
class Arreglo {
    // public niveles: Array<Expresion>;
    // public linea: number;
    // public column: number;
    constructor(tipoo, tipoObjeto, valores) {
        this.tipoo = tipoo;
        this.tipoObjeto = tipoObjeto;
        this.valores = valores;
    }
    getTipo(controlador, ts, ts_u) {
    }
    getValor(controlador, ts, ts_u) {
        /*
        let nivel = posicion;
        if (nivel > niveles.length - 1) {
          //Error posicion inexistente
          return niveles
        } else {
          return niveles[nivel];
        }*/
    }
    setValor(posicion, niveles, value, linea, columna) {
        let nivel = posicion;
        if (nivel > niveles.length - 1) {
            //Error
            return niveles;
        }
        else {
            niveles[nivel] = value;
            return niveles;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ID", "");
        return padre;
    }
}
exports.Arreglo = Arreglo;

},{"../AST/Nodo":7}],11:[function(require,module,exports){
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

},{"../AST/Nodo":7}],12:[function(require,module,exports){
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

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":42,"./Operaciones":17}],13:[function(require,module,exports){
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

},{"../../AST/Errores":6,"../../AST/Nodo":7}],14:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":42}],15:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":42,"./Operaciones":17}],16:[function(require,module,exports){
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

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":42,"./Operaciones":17}],17:[function(require,module,exports){
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

},{"../../AST/Nodo":7}],18:[function(require,module,exports){
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
                            return `**Error Sematnico ->No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
                        }
                    }
                    else if (typeof valor_exp2 == "boolean") {
                        //Segundo BOOLEAN
                        let error = new Errores_1.Errores("Semantico", `No se puede realizar la operacion ${valor_exp1} ^ ${valor_exp2}`, this.linea, this.column);
                        controlador.errores.push(error);
                        return `**Error Sematnico -> No se puede realizar la operacion ${valor_exp1} < ${valor_exp2} En la linea ${this.linea}, y columna ${this.column} **`;
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

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":42,"./Operaciones":17}],19:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo(this.primitivo.toString(), "");
        //padre.addHijo(new Nodo(this.primitivo.toString(),""));
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
}
exports.Primitivo = Primitivo;

},{"../AST/Nodo":7,"../TablaSimbolos/Tipo":42}],20:[function(require,module,exports){
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

},{"../AST/Errores":6,"../AST/Nodo":7}],21:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,7],$V1=[1,8],$V2=[1,9],$V3=[1,10],$V4=[1,11],$V5=[1,12],$V6=[1,13],$V7=[5,10,11,25,26,27,28,29],$V8=[1,19],$V9=[11,23,55],$Va=[8,21],$Vb=[2,109],$Vc=[1,26],$Vd=[1,24],$Ve=[1,63],$Vf=[1,42],$Vg=[1,44],$Vh=[1,47],$Vi=[1,49],$Vj=[1,57],$Vk=[1,58],$Vl=[1,59],$Vm=[1,60],$Vn=[1,50],$Vo=[1,51],$Vp=[1,52],$Vq=[1,53],$Vr=[1,54],$Vs=[1,55],$Vt=[1,48],$Vu=[1,61],$Vv=[1,62],$Vw=[1,64],$Vx=[1,65],$Vy=[1,66],$Vz=[1,67],$VA=[1,68],$VB=[1,69],$VC=[1,70],$VD=[1,76],$VE=[1,96],$VF=[1,81],$VG=[1,82],$VH=[1,83],$VI=[1,84],$VJ=[1,85],$VK=[1,86],$VL=[1,87],$VM=[1,88],$VN=[1,89],$VO=[1,90],$VP=[1,91],$VQ=[1,92],$VR=[1,93],$VS=[1,94],$VT=[1,95],$VU=[1,97],$VV=[8,13,19,21,24,55,59,60,61,62,63,64,65,82,83,84,85,86,87,88,89,93,94],$VW=[2,48],$VX=[2,54],$VY=[1,109],$VZ=[2,100],$V_=[1,118],$V$=[1,116],$V01=[1,117],$V11=[1,135],$V21=[1,137],$V31=[1,138],$V41=[1,139],$V51=[1,140],$V61=[1,144],$V71=[1,141],$V81=[1,142],$V91=[1,143],$Va1=[1,145],$Vb1=[19,21],$Vc1=[1,171],$Vd1=[1,172],$Ve1=[1,173],$Vf1=[1,174],$Vg1=[1,175],$Vh1=[8,13,19,21,24,59,60,61,62,63,82,83,84,85,86,87,88,89,93,94],$Vi1=[8,13,19,21,24,59,60,82,83,84,85,86,87,88,89,93,94],$Vj1=[11,15,18,25,26,27,28,29,43,45,55,57,60,72,73,74,75,76,77,78,79,80,81,90,91,92,95,96,97,98,99,100,101,104,106,110,111,112,113,115,116,118],$Vk1=[55,59,60,61,62,63,64,65,82,83,84,85,86,87,88,89,93],$Vl1=[1,203],$Vm1=[8,13,19,21,24,59,60,61,62,63,64,65,82,83,84,85,86,87,88,89,93,94],$Vn1=[8,13,19,21,24,82,83,84,85,88,89,93,94],$Vo1=[8,13,19,21,24,82,83,84,85,86,87,88,89,93,94],$Vp1=[1,300],$Vq1=[15,110,111];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"INICIO":3,"CONTENIDO":4,"EOF":5,"BLOQUE_GB":6,"DECLARACIONVARIABLE":7,"ptcoma":8,"FUNCION_BLOQUE":9,"void":10,"id":11,"PARAMETROS_SENTENCIA":12,"llaveizq":13,"INSTRUCCIONES":14,"llavedec":15,"TIPO":16,"main":17,"parizq":18,"pardec":19,"LISTPARAMETROS":20,"coma":21,"PARAMETRO":22,"corizq":23,"cordec":24,"string":25,"int":26,"double":27,"char":28,"boolean":29,"INSTRUCCION":30,"ASIGNACION_BLOQUE":31,"PRINT_BLOQUE":32,"SENTENCIA_IF":33,"SENTENCIA_SWITCH":34,"SENTENCIA_FOR":35,"SENTENCIA_FOR_ESP":36,"SENTENCIA_WHILE":37,"SENTENCIA_DOWHILE":38,"SENTENCIA_BREAK":39,"UNARIA":40,"SENTENCIA_RETURN":41,"LLAMADA":42,"print":43,"EXPRESION":44,"println":45,"ARITMETICA":46,"CADENAS":47,"RELACIONAL":48,"LOGICA":49,"TERNARIO":50,"NATIVAS":51,"NAT_CAD":52,"NAT_FUN":53,"PRIMITIVO":54,"punto":55,"SENTENCIA_TERNARIO":56,"ID":57,"LISTEXPRESIONES":58,"mas":59,"menos":60,"multiplicacion":61,"division":62,"modulo":63,"concat":64,"repit":65,"caracterposition":66,"substring":67,"length":68,"touppercase":69,"tolowercase":70,"parse":71,"toint":72,"todouble":73,"typeof":74,"tostring":75,"pow":76,"sin":77,"cos":78,"tan":79,"sqrt":80,"log":81,"menor":82,"mayor":83,"menorigual":84,"mayorigual":85,"igualigual":86,"diferente":87,"or":88,"and":89,"negacion":90,"incremento":91,"decremento":92,"ternario":93,"dspuntos":94,"entero":95,"decimal":96,"caracter":97,"cadena":98,"true":99,"false":100,"null":101,"LISTAIDS":102,"igual":103,"if":104,"else":105,"switch":106,"LISTACASE":107,"SENTENCIA_DEFAULT":108,"SENTENCIA_CASE":109,"case":110,"default":111,"break":112,"for":113,"in":114,"while":115,"do":116,"LISTAEXPRESIONES":117,"return":118,"SENTENCIA_ARREGLO":119,"new":120,"LISTADIMENSIONES":121,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"ptcoma",10:"void",11:"id",13:"llaveizq",15:"llavedec",17:"main",18:"parizq",19:"pardec",21:"coma",23:"corizq",24:"cordec",25:"string",26:"int",27:"double",28:"char",29:"boolean",43:"print",45:"println",55:"punto",57:"ID",59:"mas",60:"menos",61:"multiplicacion",62:"division",63:"modulo",64:"concat",65:"repit",66:"caracterposition",67:"substring",68:"length",69:"touppercase",70:"tolowercase",71:"parse",72:"toint",73:"todouble",74:"typeof",75:"tostring",76:"pow",77:"sin",78:"cos",79:"tan",80:"sqrt",81:"log",82:"menor",83:"mayor",84:"menorigual",85:"mayorigual",86:"igualigual",87:"diferente",88:"or",89:"and",90:"negacion",91:"incremento",92:"decremento",93:"ternario",94:"dspuntos",95:"entero",96:"decimal",97:"caracter",98:"cadena",99:"true",100:"false",101:"null",103:"igual",104:"if",105:"else",106:"switch",110:"case",111:"default",112:"break",113:"for",114:"in",115:"while",116:"do",118:"return",120:"new"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,1],[9,6],[9,6],[9,6],[9,7],[12,3],[12,2],[20,3],[20,1],[22,2],[22,4],[22,2],[22,4],[16,1],[16,1],[16,1],[16,1],[16,1],[14,2],[14,1],[30,2],[30,2],[30,2],[30,1],[30,1],[30,1],[30,1],[30,1],[30,1],[30,2],[30,2],[30,2],[30,2],[32,4],[32,4],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,1],[44,3],[44,1],[44,2],[44,5],[44,1],[44,1],[44,4],[58,3],[58,1],[46,3],[46,3],[46,3],[46,3],[46,3],[47,3],[47,3],[52,6],[52,8],[52,5],[52,5],[52,5],[53,6],[53,4],[53,4],[53,4],[53,4],[51,6],[51,4],[51,4],[51,4],[51,4],[51,4],[48,3],[48,3],[48,3],[48,3],[48,3],[48,3],[49,3],[49,3],[49,2],[49,2],[40,2],[40,2],[40,2],[40,2],[50,7],[54,1],[54,1],[54,1],[54,1],[54,1],[54,1],[54,1],[54,1],[7,2],[7,4],[7,4],[7,6],[102,3],[102,1],[31,3],[31,5],[31,6],[33,7],[33,11],[33,9],[34,8],[34,7],[107,2],[107,1],[109,4],[108,3],[39,1],[56,5],[35,11],[36,7],[37,5],[38,9],[42,3],[42,4],[117,3],[117,1],[41,2],[41,1],[119,3],[119,3],[121,4],[121,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return this.$; 
break;
case 2: case 23: case 118:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 3: case 24: case 119:
 this.$ = [$$[$0]]; 
break;
case 4: case 8: case 10: case 25: case 26: case 27: case 34: case 35: case 36: case 37: case 49: case 51:
 this.$ = $$[$0-1]; 
break;
case 5: case 28: case 29: case 30: case 31: case 32: case 33: case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 48: case 50: case 53: case 54:
 this.$ = $$[$0]; 
break;
case 6:
 this.$= new Funcion(3, new Tipo('VOID'), $$[$0-4], $$[$0-3], true, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 7:
 this.$= new Funcion(3, $$[$0-5], $$[$0-4], $$[$0-3], false, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 9:
  this.$= new Funcion(3, new Tipo('VOID'), $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 11:
 this.$ = []; 
break;
case 12: case 56: case 130:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 13: case 57: case 131:
 this.$ = []; this.$.push($$[$0]); 
break;
case 14:
 this.$ = new Simbolos(6,$$[$0-1], $$[$0], null); 
break;
case 15: case 17:
 this.$ = $$[$0-3]; console.log("Parametro"); 
break;
case 16:
 this.$ = $$[$0-1]; console.log("Parametro"); 
break;
case 18:
 this.$ = new Tipo('STRING'); 
break;
case 19:
 this.$ = new Tipo('ENTERO'); 
break;
case 20:
 this.$ = new Tipo('DECIMAL');
break;
case 21:
 this.$ = new Tipo('CHAR'); 
break;
case 22:
 this.$ = new Tipo('BOOLEAN'); 
break;
case 38:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 39:
 this.$ = new Println($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 52:
 this.$ = $$[$0-4]; 
break;
case 55:
 this.$ = new AccesoArreglo($$[$0-3],$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column); 
break;
case 58:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'+', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 59:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'-', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 60:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'*', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 61:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'/', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 62:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'%', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 63:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'&', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 64:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'^', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 65:
 this.$ = new Cadenas($$[$0-5], $$[$0-1], null ,'caracterposition', _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 66:
 this.$ = new Cadenas($$[$0-7], $$[$0-3], $$[$0-1] ,'substring', _$[$0-7].first_line,_$[$0-7].last_column);
break;
case 67:
 this.$ = new Cadenas($$[$0-4], null, null ,'length', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 68:
 this.$ = new Cadenas($$[$0-4], null, null ,'touppercase', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 69:
 this.$ = new Cadenas($$[$0-4], null, null ,'tolowercase', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 70:
 this.$ = new Conversion($$[$0-5], $$[$0-1],'parse', _$[$0-5].first_line,_$[$0-5].last_column); 
break;
case 71:
 this.$ = new Conversion(null, $$[$0-1],'toint', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 72:
 this.$ = new Conversion(null, $$[$0-1],'todouble', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 73:
 this.$ = new Conversion(null, $$[$0-1],'typeof', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 74:
 this.$ = new Conversion(null, $$[$0-1],'tostring', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 75:
 this.$ = new Nativa($$[$0-3], $$[$0-1], false ,'pow', _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 76:
 this.$ = new Nativa($$[$0-1], null, true , 'sin',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 77:
 this.$ = new Nativa($$[$0-1], null, true , 'cos',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 78:
 this.$ = new Nativa($$[$0-1], null, true , 'tan',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 79:
 this.$ = new Nativa($$[$0-1], null, true , 'sqrt',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 80:
 this.$ = new Nativa($$[$0-1], null, true , 'log',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 81:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 82:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 83:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 84:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 85:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'==', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 86:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'!=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 87:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'||', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 88:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'&&', _$[$0-2].first_line, _$[$0-2].last_column);
break;
case 89:
 this.$ = new Logicas($$[$0], null, true , '!',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 90:
 this.$ = new Aritmetica($$[$0], null, true , 'UNARIO',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 91:
 this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 92:
 this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 93:
 this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 94:
 this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 95:
 this.$ = $$[$0-6]; console.log("ternario"); 
break;
case 96: case 97:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 98: case 99:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 100:
this.$ = new Identificador($$[$0], _$[$0].first_line, _$[$0].last_column);
break;
case 101:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 102:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 103:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); 
break;
case 104:
 this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column);  
break;
case 105:
 this.$ = new Declaracion($$[$0-3], [new Simbolos(1,null, $$[$0-2], $$[$0])], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 106:
 this.$ = new Declaracion($$[$0-3], [new Simbolos(1,null, $$[$0],new Arreglo($$[$0-3],$$[$0-3],null))],_$[$0-3].first_line,_$[$0-3].first_column); 
break;
case 107:
 this.$ = new Declaracion($$[$0-5], [new Simbolos(1,null, $$[$0-2], new Arreglo($$[$0-5],$$[$0-5],$$[$0]))],_$[$0-5].first_line,_$[$0-5].first_column); 
break;
case 108:
$$[$0-2].push(new Simbolos(1,null, $$[$0], null)); this.$ = $$[$0-2]; 
break;
case 109:
 this.$ = [new Simbolos(1,null, $$[$0], null)]; 
break;
case 110:
this.$ = new Asignacion($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].last_column);  
break;
case 111:
this.$ = []; console.log("asignacion valor de instancia"); 
break;
case 112:
 this.$ = []; this.$.push(new AsignacionArray($$[$0-5],$$[$0-3],$$[$0],_$[$0-5].first_line,_$[$0-5].first_column)); 
break;
case 113:
 this.$ = new If( $$[$0-4], $$[$0-1], [], _$[$0-6].first_line, _$[$0-6].last_column ); 
break;
case 114:
 this.$ = new If( $$[$0-8], $$[$0-5], $$[$0-1], _$[$0-10].first_line, _$[$0-10].last_column ); 
break;
case 115:
 this.$ = new If( $$[$0-6], $$[$0-3], [$$[$0]], _$[$0-8].first_line, _$[$0-8].last_column ); 
break;
case 116:
 this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 117:
 this.$ = new Switch($$[$0-4],$$[$0-1],null,_$[$0-6].first_line,_$[$0-6].last_column); 
break;
case 120:
this.$ = new Case($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 121:
 this.$ =new Default($$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 122:
 this.$ = new Break(); 
break;
case 123:
 this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 124:
 this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line, _$[$0-10].last_column); 
break;
case 125:
 this.$ = new ForEsp(new Simbolos(1,null, $$[$0-5], null),$$[$0-3],$$[$0-1],_$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 126:
 this.$ = new While( $$[$0-3], $$[$0-1], _$[$0-4].first_line, _$[$0-4].last_column);  
break;
case 127:
 this.$ = new DoWhile($$[$0-2],$$[$0-6],_$[$0-8].first_line,_$[$0-8].first_column); 
break;
case 128:
 this.$ = new Llamada($$[$0-2], [], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 129:
 this.$ = new Llamada($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 132:
 this.$ = new Return($$[$0]);
break;
case 133:
 this.$ = new Return(null);
break;
case 134:
 this.$ = new crearArreglo($$[$0-1].tipo,$$[$0-1].valor,$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 135:
 this.$ = new crearArreglo(Tipo.ID,$$[$0-1],$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 136:
 this.$ = $$[$0-3]; this.$.push($$[$0-1]); 
break;
case 137:
 this.$ = []; this.$.push($$[$0-1]); 
break;
}
},
table: [{3:1,4:2,6:3,7:4,9:5,10:$V0,11:$V1,16:6,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6},{1:[3]},{5:[1,14],6:15,7:4,9:5,10:$V0,11:$V1,16:6,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6},o($V7,[2,3]),{8:[1,16]},o($V7,[2,5]),{11:[1,18],23:$V8,102:17},{11:[1,20],17:[1,21]},{11:[1,22]},o($V9,[2,18]),o($V9,[2,19]),o($V9,[2,20]),o($V9,[2,21]),o($V9,[2,22]),{1:[2,1]},o($V7,[2,2]),o($V7,[2,4]),{8:[2,104],21:[1,23]},o($Va,$Vb,{12:25,18:$Vc,103:$Vd}),{24:[1,27]},{12:28,18:$Vc},{18:[1,29]},{12:30,18:$Vc},{11:[1,31]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:32,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{13:[1,71]},{11:$VD,16:75,19:[1,73],20:72,22:74,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6},{11:[1,77]},{13:[1,78]},{19:[1,79]},{13:[1,80]},o($Va,[2,108]),{8:[2,105],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($VV,[2,40]),o($VV,[2,41]),o($VV,[2,42]),o($VV,[2,43]),o($VV,[2,44]),o($VV,[2,45]),o($VV,[2,46]),o($VV,[2,47]),o($VV,$VW),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:98,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},o($VV,[2,50]),{11:[1,99]},o($VV,[2,53]),o($VV,$VX),{23:[1,100]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:101,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:102,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{18:[1,103]},{18:[1,104]},{18:[1,105]},{18:[1,106]},{18:[1,107]},{18:[1,108]},{55:$VY},{18:[1,110]},{18:[1,111]},{18:[1,112]},{18:[1,113]},{11:[1,114]},{11:[1,115]},o($VV,$VZ,{18:$V_,91:$V$,92:$V01}),o($VV,[2,96]),o($VV,[2,97]),o($VV,[2,98]),o($VV,[2,99]),o($VV,[2,101]),o($VV,[2,102]),o($VV,[2,103]),{7:121,11:$V11,14:119,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{19:[1,146],21:[1,147]},{13:[2,11]},o($Vb1,[2,13]),{11:[1,148],23:[1,149]},{11:[1,150],23:[1,151]},{8:[2,106],103:[1,152]},{7:121,11:$V11,14:153,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{13:[1,154]},{7:121,11:$V11,14:155,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:156,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:157,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:158,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:159,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:160,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:161,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:162,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:163,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:164,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:165,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:166,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:167,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:168,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:169,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:170,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{66:$Vc1,67:$Vd1,68:$Ve1,69:$Vf1,70:$Vg1},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:176,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{19:[1,177],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($VV,[2,51],{23:[1,178]}),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:179,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},o($Vh1,[2,89],{55:$VE,64:$VK,65:$VL}),o($Vi1,[2,90],{55:$VE,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL}),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:180,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:181,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:182,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:183,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:184,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:185,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{71:[1,186]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:187,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:188,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:189,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:190,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},o($VV,[2,91]),o($VV,[2,92]),o($VV,[2,93]),o($VV,[2,94]),{11:$Ve,16:56,18:$Vf,19:[1,191],25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:193,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,117:192},{7:121,11:$V11,15:[1,194],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vj1,[2,24]),{8:[1,196]},{8:[1,197]},{8:[1,198]},o($Vj1,[2,28]),o($Vj1,[2,29]),o($Vj1,[2,30]),o($Vj1,[2,31]),o($Vj1,[2,32]),o($Vj1,[2,33]),{8:[1,199]},o($Vk1,$VW,{8:[1,200]}),{8:[1,201]},o($Vk1,$VX,{8:[1,202]}),{11:$Vl1,23:$V8,55:$VY,102:17},o($Vk1,$VZ,{18:$V_,23:[1,205],91:$V$,92:$V01,103:[1,204]}),{55:[1,206],59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{18:[1,207]},{18:[1,208]},{18:[1,209]},{18:[1,210]},{11:[1,212],18:[1,211]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:213,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{13:[1,214]},{8:[2,122]},{8:[2,133],11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:215,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{13:[2,10]},{11:$VD,16:75,22:216,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6},o($Vb1,[2,14]),{24:[1,217]},o($Vb1,[2,16]),{24:[1,218]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:219,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{7:121,11:$V11,15:[1,220],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{7:121,11:$V11,14:221,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{7:121,11:$V11,15:[1,222],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vi1,[2,58],{55:$VE,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL}),o($Vi1,[2,59],{55:$VE,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL}),o($Vh1,[2,60],{55:$VE,64:$VK,65:$VL}),o($Vh1,[2,61],{55:$VE,64:$VK,65:$VL}),o($Vh1,[2,62],{55:$VE,64:$VK,65:$VL}),o([8,13,19,21,24,59,60,61,62,63,64,82,83,84,85,86,87,88,89,93,94],[2,63],{55:$VE,65:$VL}),o($Vm1,[2,64],{55:$VE}),o($Vn1,[2,81],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,86:$VQ,87:$VR}),o($Vn1,[2,82],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,86:$VQ,87:$VR}),o($Vn1,[2,83],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,86:$VQ,87:$VR}),o($Vn1,[2,84],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,86:$VQ,87:$VR}),o($Vo1,[2,85],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL}),o($Vo1,[2,86],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL}),o([8,13,19,21,24,88,93,94],[2,87],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,89:$VT}),o([8,13,19,21,24,88,89,93,94],[2,88],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR}),{18:[1,223]},{18:[1,224]},{18:[1,225]},{18:[1,226]},{18:[1,227]},{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU,94:[1,228]},o($VV,[2,49]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:230,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{24:[1,231],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{21:[1,232],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,233],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,234],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,235],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,236],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,237],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{18:[1,238]},{19:[1,239],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,240],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,241],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,242],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($VV,[2,128]),{19:[1,243],21:[1,244]},o($Vb1,[2,131],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU}),o($V7,[2,7]),o($Vj1,[2,23]),o($Vj1,[2,25]),o($Vj1,[2,26]),o($Vj1,[2,27]),o($Vj1,[2,34]),o($Vj1,[2,35]),o($Vj1,[2,36]),o($Vj1,[2,37]),o($Va,$Vb,{103:$Vd}),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:245,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:246,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:[1,247],66:$Vc1,67:$Vd1,68:$Ve1,69:$Vf1,70:$Vg1},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:248,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:249,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:250,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:251,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{7:252,16:253,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6},{114:[1,254]},{13:[1,255],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{7:121,11:$V11,14:256,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{8:[2,132],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($Vb1,[2,12]),{11:[1,257]},{11:[1,258]},{8:[2,107],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($V7,[2,6]),{7:121,11:$V11,15:[1,259],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($V7,[2,8]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:260,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:261,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{19:[1,262]},{19:[1,263]},{19:[1,264]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:265,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:266,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{24:[1,267],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($VV,[2,55]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:268,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},o($VV,[2,76]),o($VV,[2,77]),o($VV,[2,78]),o($VV,[2,79]),o($VV,[2,80]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:269,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},o($VV,[2,71]),o($VV,[2,72]),o($VV,[2,73]),o($VV,[2,74]),o($VV,[2,129]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:270,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{8:[2,110],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{24:[1,271],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{103:[1,272]},{19:[1,273],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,274],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,275],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,276],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{8:[1,277]},{11:$Vl1,23:$V8,102:17},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:278,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{7:121,11:$V11,14:279,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{7:121,11:$V11,15:[1,280],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vb1,[2,15]),o($Vb1,[2,17]),o($V7,[2,9]),{19:[1,281],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{21:[1,282],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($VV,[2,67]),o($VV,[2,68]),o($VV,[2,69]),o([8,13,19,21,24,94],[2,123],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU}),{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU,94:[1,283]},o($VV,[2,52]),{19:[1,284],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{19:[1,285],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($Vb1,[2,130],{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU}),{103:[1,286]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:287,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{8:[2,38]},{8:[2,39]},{13:[1,288]},{13:[1,289]},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:290,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{13:[1,291],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{7:121,11:$V11,15:[1,292],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{115:[1,293]},o($VV,[2,65]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:294,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:295,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},o($VV,[2,75]),o($VV,[2,70]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:296,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{8:[2,111],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{7:121,11:$V11,14:297,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{107:298,109:299,110:$Vp1},{8:[1,301],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{7:121,11:$V11,14:302,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vj1,[2,126]),{18:[1,303]},{19:[1,304],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($Vm1,[2,95],{55:$VE}),{8:[2,112],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{7:121,11:$V11,15:[1,305],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{15:[1,307],108:306,109:308,110:$Vp1,111:[1,309]},o($Vq1,[2,119]),{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:310,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:311,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},{7:121,11:$V11,15:[1,312],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{11:$Ve,16:56,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,40:41,42:46,44:313,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC},o($VV,[2,66]),o($Vj1,[2,113],{105:[1,314]}),{15:[1,315]},o($Vj1,[2,117]),o($Vq1,[2,118]),{94:[1,316]},{55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU,94:[1,317]},{19:[1,318],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},o($Vj1,[2,125]),{19:[1,319],55:$VE,59:$VF,60:$VG,61:$VH,62:$VI,63:$VJ,64:$VK,65:$VL,82:$VM,83:$VN,84:$VO,85:$VP,86:$VQ,87:$VR,88:$VS,89:$VT,93:$VU},{13:[1,320],33:321,104:$V41},o($Vj1,[2,116]),{7:121,11:$V11,14:322,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{7:121,11:$V11,14:323,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{13:[1,324]},{8:[1,325]},{7:121,11:$V11,14:326,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vj1,[2,115]),{7:121,11:$V11,15:[2,121],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vq1,[2,120],{46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,56:45,7:121,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,16:134,44:136,30:195,11:$V11,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,43:$V21,45:$V31,55:$Vg,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1}),{7:121,11:$V11,14:327,16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:120,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vj1,[2,127]),{7:121,11:$V11,15:[1,328],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},{7:121,11:$V11,15:[1,329],16:134,18:$Vf,25:$V2,26:$V3,27:$V4,28:$V5,29:$V6,30:195,31:122,32:123,33:124,34:125,35:126,36:127,37:128,38:129,39:130,40:131,41:132,42:133,43:$V21,44:136,45:$V31,46:33,47:34,48:35,49:36,50:37,51:38,52:39,53:40,54:43,55:$Vg,56:45,57:$Vh,60:$Vi,72:$Vj,73:$Vk,74:$Vl,75:$Vm,76:$Vn,77:$Vo,78:$Vp,79:$Vq,80:$Vr,81:$Vs,90:$Vt,91:$Vu,92:$Vv,95:$Vw,96:$Vx,97:$Vy,98:$Vz,99:$VA,100:$VB,101:$VC,104:$V41,106:$V51,112:$V61,113:$V71,115:$V81,116:$V91,118:$Va1},o($Vj1,[2,114]),o($Vj1,[2,124])],
defaultActions: {14:[2,1],73:[2,11],144:[2,122],146:[2,10],273:[2,38],274:[2,39]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
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
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

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
    const {Arreglo} = require("../Expresiones/Arreglo");
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
case 3:return 96       // NUMERICO
break;
case 4:return 95
break;
case 5:return 88        //RELACIONAL
break;
case 6:return 89
break;
case 7:return 91
break;
case 8:return 92
break;
case 9:return 64
break;
case 10:return 65
break;
case 11:return 59           //ARITEMETICO
break;
case 12:return 60
break;
case 13:return 61
break;
case 14:return 62
break;
case 15:return 63
break;
case 16:return 84   // LOGICO
break;
case 17:return 85
break;
case 18:return 87
break;
case 19:return 86
break;
case 20:return 83
break;
case 21:return 82
break;
case 22:return 90
break;
case 23:return 93   //TERNARIO
break;
case 24:return 94
break;
case 25:return 55
break;
case 26:return 13   //GRAMATICO
break;
case 27:return 15
break;
case 28:return 18
break;
case 29:return 19
break;
case 30:return 23
break;
case 31:return 24
break;
case 32:return 8
break;
case 33:return 21
break;
case 34:return 103
break;
case 35: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 97; 
break;
case 36: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 98; 
break;
case 37:return 75
break;
case 38:return 26      //TIPOS
break;
case 39:return 27
break;
case 40:return 28
break;
case 41:return 29
break;
case 42:return 25
break;
case 43:return 99
break;
case 44:return 100
break;
case 45:return 76     //NATIVAS
break;
case 46:return 77
break;
case 47:return 78
break;
case 48:return 79
break;
case 49:return 80
break;
case 50:return 81
break;
case 51:return 43
break;
case 52:return 45
break;
case 53:return 71
break;
case 54:return 72
break;
case 55:return 73
break;
case 56:return 74
break;
case 57:return 104
break;
case 58:return 105
break;
case 59:return 106
break;
case 60:return 110
break;
case 61:return 111
break;
case 62:return 112
break;
case 63:return 'continue'
break;
case 64:return 'begin'
break;
case 65:return 'end'
break;
case 66:return 115
break;
case 67:return 116
break;
case 68:return 113
break;
case 69:return 114
break;
case 70:return 68
break;
case 71:return 67
break;
case 72:return 66
break;
case 73:return 10
break;
case 74:return 118
break;
case 75:return 17
break;
case 76:return 101
break;
case 77:return 'struct'
break;
case 78:return 69
break;
case 79:return 70
break;
case 80:return 11
break;
case 81:return 5
break;
case 82: console.log("error lexico"); 
break;
}
},
rules: [/^(?:[ \r\t\n]+)/,/^(?:\/\/.([^\n])*)/,/^(?:\/\*(.?\n?)*\*\/)/,/^(?:[0-9]+(\.[0-9]+))/,/^(?:[0-9]+)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:\+\+)/,/^(?:--)/,/^(?:&)/,/^(?:\^)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:<=)/,/^(?:>=)/,/^(?:!=)/,/^(?:==)/,/^(?:>)/,/^(?:<)/,/^(?:!)/,/^(?:\?)/,/^(?::)/,/^(?:\.)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?:,)/,/^(?:=)/,/^(?:[\'\‘\’].[\'\’\‘])/,/^(?:[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”])/,/^(?:string\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:boolean\b)/,/^(?:String\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:pow\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:sqrt\b)/,/^(?:log10\b)/,/^(?:print\b)/,/^(?:println\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:typeof\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:in\b)/,/^(?:length\b)/,/^(?:subString\b)/,/^(?:caracterOfPosition\b)/,/^(?:void\b)/,/^(?:return\b)/,/^(?:main\b)/,/^(?:null\b)/,/^(?:struct\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*)/,/^(?:$)/,/^(?:.)/],
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
},{"../Expresiones/AccesoArreglo":9,"../Expresiones/Arreglo":10,"../Expresiones/Identificador":11,"../Expresiones/Operaciones/Aritmetica":12,"../Expresiones/Operaciones/Cadenas":13,"../Expresiones/Operaciones/Conversion":14,"../Expresiones/Operaciones/Logicas":15,"../Expresiones/Operaciones/Nativa":16,"../Expresiones/Operaciones/Relacionales":18,"../Expresiones/Primitivo":19,"../Expresiones/Ternario":20,"../Instrucciones/Asignacion":22,"../Instrucciones/AsignacionArray":23,"../Instrucciones/Ciclica/DoWhile":24,"../Instrucciones/Ciclica/For":25,"../Instrucciones/Ciclica/ForEsp":26,"../Instrucciones/Ciclica/While":27,"../Instrucciones/Control/Case":28,"../Instrucciones/Control/Default":29,"../Instrucciones/Control/If":30,"../Instrucciones/Control/Switch":31,"../Instrucciones/Declaracion":32,"../Instrucciones/Funcion":33,"../Instrucciones/Llamada":34,"../Instrucciones/Print":35,"../Instrucciones/Println":36,"../Instrucciones/Transferencia/Break":37,"../Instrucciones/Transferencia/Return":39,"../TablaSimbolos/Simbolos":40,"../TablaSimbolos/Tipo":42,"_process":3,"fs":1,"path":2}],22:[function(require,module,exports){
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
            controlador.append(`La variable ${this.valor.getValor(controlador, ts, ts_u)}, no existe en el entorno nn la linea ${this.linea}, y columna ${this.column}`);
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

},{"../AST/Errores":6,"../AST/Nodo":7}],23:[function(require,module,exports){
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
                array.valores = array.setValor(dimension, array.valores, valor, this.linea, this.column);
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

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Tipo":42}],24:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":41,"../Transferencia/Break":37,"../Transferencia/Continue":38,"../Transferencia/Return":39}],25:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":41,"../Transferencia/Break":37,"../Transferencia/Continue":38,"../Transferencia/Return":39}],26:[function(require,module,exports){
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

},{"../../AST/Errores":6,"../../AST/Nodo":7,"../../TablaSimbolos/Simbolos":40,"../../TablaSimbolos/TablaSim":41,"../Transferencia/Break":37,"../Transferencia/Continue":38,"../Transferencia/Return":39}],27:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":41,"../Transferencia/Break":37,"../Transferencia/Continue":38,"../Transferencia/Return":39}],28:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../Transferencia/Break":37,"../Transferencia/Return":39}],29:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../Transferencia/Break":37,"../Transferencia/Return":39}],30:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":41,"../../TablaSimbolos/Tipo":42,"../Transferencia/Break":37,"../Transferencia/Continue":38,"../Transferencia/Return":39}],31:[function(require,module,exports){
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

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSim":41,"../Transferencia/Break":37,"../Transferencia/Return":39}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
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
                controlador.append(`**Error Sematnico -> La variable ${variable.identificador},  ya se declaro anteriormente en la linea ${this.linea}, y columna ${this.columna} **`);
                continue;
            }
            if (variable.valor != null) {
                let valor = variable.valor.getValor(controlador, ts, ts_u);
                let tipo_valor = variable.valor.getTipo(controlador, ts, ts_u);
                if (tipo_valor == this.tipo.tipo || (tipo_valor == Tipo_1.tipo.DOUBLE && this.tipo.tipo == Tipo_1.tipo.ENTERO) || (tipo_valor == Tipo_1.tipo.CADENA && this.tipo.tipo == Tipo_1.tipo.CARACTER)) {
                    let nuevo_sim = new Simbolos_1.Simbolos(variable.simbolo, this.tipo, variable.identificador, valor);
                    ts.agregar(variable.identificador, nuevo_sim);
                    ts_u.agregar(variable.identificador, nuevo_sim);
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`**Error Sematnico -> Las variables ${tipo_valor} y ${this.tipo.tipo} no son del mismo tipo, en la linea ${this.linea}, y columna ${this.columna} **`);
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

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":40,"../TablaSimbolos/Tipo":42}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolos_1 = require("../TablaSimbolos/Simbolos");
const TablaSim_1 = require("../TablaSimbolos/TablaSim");
const Break_1 = require("./Transferencia/Break");
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
                if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                    continue;
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
                        let error = new Errores_1.Errores("Semantico", ` La variable no concuerda con el tipo`, this.linea, this.column);
                        controlador.errores.push(error);
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

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":40,"../TablaSimbolos/TablaSim":41,"./Transferencia/Break":37,"./Transferencia/Return":39}],34:[function(require,module,exports){
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

},{"../AST/Errores":6,"../AST/Nodo":7,"../TablaSimbolos/Simbolos":40,"../TablaSimbolos/TablaSim":41,"../TablaSimbolos/Tipo":42}],35:[function(require,module,exports){
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

},{"../AST/Nodo":7}],36:[function(require,module,exports){
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

},{"../AST/Nodo":7}],37:[function(require,module,exports){
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

},{"../../AST/Nodo":7}],38:[function(require,module,exports){
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

},{"../../AST/Nodo":7}],39:[function(require,module,exports){
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

},{"../../AST/Nodo":7}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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
        this.tabla.set(id.toLowerCase(), simbolo); //convertimos a minuscula ya que nuestro lenguaje es caseinsitive ej. prueba = PRUeba
    }
    setSiguiente(tablita) {
        this.sig.push(tablita);
    }
    existe(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            // let existe = ts.tabla.get(id);
            if (existe != null) {
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    existeEnActual(id) {
        let ts = this;
        let existe = ts.tabla.get(id.toLowerCase());
        if (existe != null) {
            return true;
        }
        return false;
    }
    getSimbolo(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            if (existe != null) {
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }
}
exports.TablaSim = TablaSim;

},{}],42:[function(require,module,exports){
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
        return tipo.CADENA;
    }
    getStype() {
        return this.stype;
    }
}
exports.Tipo = Tipo;

},{}],43:[function(require,module,exports){
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
       console.log(dataDOT);

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
const Nodo_1 = require("./AST/Nodo");
const Arbol_1 = require("./AST/Arbol");
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
    //traigo todas las raices
    const instrucciones = gramatica.parse(entrada);
    let controlador = new Controller_1.Controller();
    const entornoGlobal = new TablaSim_1.TablaSim(null, "Global");
    let entornoU = new TablaSim_1.TablaSim(null, "Global");
    const ast = new Ast_1.AST(instrucciones);
    //recorro todas las raices  RECURSIVA
    /*
    for (let element of instrucciones) {
      element.ejecutar(controlador, entornoGlobal, entornoU);
    }*/
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

    return { salida: controlador.consola, tabla_e: controlador.graficar_tErrores(), tabla_s: controlador.recursivo_tablita(entornoGlobal, "", 0), ast: res };
}

},{"./AST/Arbol":4,"./AST/Ast":5,"./AST/Nodo":7,"./Controller":8,"./Gramar/gramar":21,"./Instrucciones/Asignacion":22,"./Instrucciones/Declaracion":32,"./Instrucciones/Funcion":33,"./TablaSimbolos/TablaSim":41}]},{},[43]);
