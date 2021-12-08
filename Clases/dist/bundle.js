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
exports.AST = void 0;
class AST {
    constructor(instrucciones) {
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }
}
exports.AST = AST;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo = void 0;
class Nodo {
    constructor(t, l) {
        this.k = 0;
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

},{}],6:[function(require,module,exports){
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
    graficar_ts(controlador, ts) {
        var cuerpohtml = "<thead><tr><th>Rol</th><th>Nombre</th><th>Tipo</th><th>Ambito</th><th>Valor</th><th>Parametros</th></tr></thead>";
        while (ts != null) {
            for (let sim of ts.tabla.values()) {
                cuerpohtml += "<tr ><th >" + this.getRol(sim) + "</th><td>" + sim.identificador +
                    "</td><td>" + this.getTipo(sim) + "</td>" +
                    "</td><td>" + this.getAmbito() +
                    "</td><td>" + this.getValor(sim) +
                    "</td><td>" + this.parametros(sim) + "</td>" + "</tr>";
            }
            ts = ts.ant;
        }
        cuerpohtml = '<table class=\"ui selectable inverted table\">' + cuerpohtml + '</table>';
        return cuerpohtml;
    }
    graficar_tErrores() {
        var cuerpohtml = "<thead><tr><th>Tipo</th><th>Descripcion</th><th>Linea</th><th>Columna</th></thead>";
        for (let error of this.errores) {
            cuerpohtml += "<tr ><th >" + error.tipo + "</th><td>" + error.descripcion +
                "</td><td>" + error.linea + "</td>" +
                "</td><td>" + error.column +
                "</td> </tr>";
        }
        cuerpohtml = '<table class=\"ui selectable inverted table\">' + cuerpohtml + '</table>';
        return cuerpohtml;
    }
    getValor(sim) {
        if (sim.valor != null) {
            return sim.valor.toString();
        }
        else {
            return '...';
        }
    }
    getTipo(sim) {
        return sim.tipo.stype.toLowerCase();
    }
    getRol(sim) {
        let rol = '';
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
    getAmbito() {
        return 'global';
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

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
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
                        return valor_expre1.toString() + valor_expre2;
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
                        }
                    }
                    else {
                        if (typeof valor_expre2 === "number") {
                            return valor_expre1 + valor_expre2.toString();
                        }
                    }
                } // ;D
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
                        }
                    }
                }
                break;
            case Operaciones_1.Operador.MULT:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 * valor_expre2;
                    }
                }
                break;
            case Operaciones_1.Operador.DIV:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 / valor_expre2;
                    }
                }
                break;
            case Operaciones_1.Operador.MODULO:
                if (typeof valor_expre1 === "number") {
                    if (typeof valor_expre2 === "number") {
                        return valor_expre1 % valor_expre2;
                    }
                }
                break;
            case Operaciones_1.Operador.UNARIO:
                if (typeof valor_U === "number") {
                    return -valor_U;
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Aritmetica", "");
        if (this.expreU) {
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
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

},{"../../AST/Nodo":5,"../../TablaSimbolos/Tipo":16,"./Operaciones":9}],8:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("Logica", "");
        if (this.expreU) {
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
}
exports.Logicas = Logicas;

},{"../../AST/Nodo":5,"../../TablaSimbolos/Tipo":16,"./Operaciones":9}],9:[function(require,module,exports){
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
        else if (op == '^') {
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
        return Operador.SUMA;
    }
    getTipo(controlador, ts, ts_u) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador, ts, ts_u) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Operaciones", "");
        if (this.expreU) {
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
}
exports.Operacion = Operacion;

},{"../../AST/Nodo":5}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacionales = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operaciones_1 = require("./Operaciones");
class Relacionales extends Operaciones_1.Operacion {
    constructor(expre1, expre2, expreU, op, linea, columna) {
        super(expre1, expre2, expreU, op, linea, columna);
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
            case Operaciones_1.Operador.MENORQUE:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 < valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.MAYORQUE:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 > valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.MENORIGUAL:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 <= valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.MAYORIGUAL:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 >= valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.IGUALIGUAL:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 == valor_exp2;
                    }
                }
                break;
            case Operaciones_1.Operador.DIFERENCIACION:
                if (typeof valor_exp1 == 'number') { // Primer numero ENTERO, DOUBLE
                    if (typeof valor_exp2 == 'number') { // Segundo numero ENTERO, DOUBLE
                        return valor_exp1 != valor_exp2;
                    }
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Relacionales", "");
        if (this.expreU) {
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre1.recorrer());
        }
        else {
            padre.addHijo(this.expre1.recorrer());
            padre.addHijo(new Nodo_1.Nodo(this.op_string, ""));
            padre.addHijo(this.expre2.recorrer());
        }
        return padre;
    }
}
exports.Relacionales = Relacionales;

},{"../../AST/Nodo":5,"../../TablaSimbolos/Tipo":16,"./Operaciones":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Primitivo {
    constructor(primitivo, linea, columna) {
        this.columna = columna;
        this.linea = linea;
        this.primitvo = primitivo;
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
        return this.primitvo;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Primitivo", "");
        padre.addHijo(new Nodo_1.Nodo(this.primitvo.toString(), ""));
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
}
exports.Primitivo = Primitivo;

},{"../AST/Nodo":5,"../TablaSimbolos/Tipo":16}],12:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,6],$V2=[1,7],$V3=[1,8],$V4=[1,9],$V5=[1,10],$V6=[5,7,22,23,24,25,26],$V7=[8,20],$V8=[1,17],$V9=[1,25],$Va=[1,34],$Vb=[1,44],$Vc=[1,36],$Vd=[1,37],$Ve=[1,47],$Vf=[1,46],$Vg=[1,49],$Vh=[1,48],$Vi=[1,52],$Vj=[1,53],$Vk=[1,50],$Vl=[1,51],$Vm=[1,54],$Vn=[1,55],$Vo=[1,56],$Vp=[1,57],$Vq=[1,58],$Vr=[1,59],$Vs=[1,60],$Vt=[16,18],$Vu=[8,12,15,22,23,24,25,26,32,34,41,44,51,63,64,65,68,69,70,71,72,73,74,75,76],$Vv=[41,50,51,52,53,54,55,56,57,58,59,60,61,62,64,65],$Vw=[2,76],$Vx=[1,80],$Vy=[1,81],$Vz=[1,82],$VA=[1,83],$VB=[1,84],$VC=[1,85],$VD=[1,86],$VE=[1,87],$VF=[1,88],$VG=[1,89],$VH=[1,90],$VI=[1,91],$VJ=[1,92],$VK=[1,93],$VL=[1,94],$VM=[16,18,21,29,41,50,51,52,53,54,55,56,57,58,59,60,61,62,64,65,67],$VN=[1,98],$VO=[1,113],$VP=[18,29],$VQ=[2,85],$VR=[1,118],$VS=[1,119],$VT=[1,120],$VU=[1,121],$VV=[1,138],$VW=[16,18,21,29,50,51,52,53,54,55,56,57,58,59,60,61,62,67],$VX=[16,18,21,29,50,51,55,56,57,58,59,60,61,62,67],$VY=[2,38],$VZ=[1,153],$V_=[1,154],$V$=[16,18,21,29,55,56,57,58,61,62,67],$V01=[16,18,21,29,55,56,57,58,59,60,61,62,67],$V11=[1,164];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"INICIO":3,"CONTENIDO":4,"EOF":5,"FUNCION_BLOQUE":6,"void":7,"id":8,"PARAMETROS_SENTENCIA":9,"llaveizq":10,"INSTRUCCIONES":11,"llavedec":12,"TIPO":13,"main":14,"parizq":15,"pardec":16,"LISTPARAMETROS":17,"coma":18,"PARAMETRO":19,"corizq":20,"cordec":21,"string":22,"int":23,"double":24,"char":25,"boolean":26,"INSTRUCCION":27,"DECLARACIONVARIABLE":28,"ptcoma":29,"ASIGNACION_BLOQUE":30,"PRINT_BLOQUE":31,"print":32,"EXPRESION":33,"println":34,"ARITMETICA":35,"RELACIONAL":36,"LOGICA":37,"TERNARIO":38,"TOINT_STATEMENT":39,"UNARIA":40,"punto":41,"length":42,"PRIMITIVO":43,"ID":44,"PARIZQ":45,"LISTEXPRESIONES":46,"touppercase":47,"tolowercase":48,"tostring":49,"mas":50,"menos":51,"multiplicacion":52,"division":53,"modulo":54,"menor":55,"mayor":56,"menorigual":57,"mayorigual":58,"igualigual":59,"diferente":60,"or":61,"and":62,"negacion":63,"incremento":64,"decremento":65,"ternario":66,"dspuntos":67,"toint":68,"todouble":69,"entero":70,"decimal":71,"caracter":72,"cadena":73,"true":74,"false":75,"null":76,"LISTAIDS":77,"igual":78,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"void",8:"id",10:"llaveizq",12:"llavedec",14:"main",15:"parizq",16:"pardec",18:"coma",20:"corizq",21:"cordec",22:"string",23:"int",24:"double",25:"char",26:"boolean",29:"ptcoma",32:"print",34:"println",41:"punto",42:"length",44:"ID",45:"PARIZQ",47:"touppercase",48:"tolowercase",49:"tostring",50:"mas",51:"menos",52:"multiplicacion",53:"division",54:"modulo",55:"menor",56:"mayor",57:"menorigual",58:"mayorigual",59:"igualigual",60:"diferente",61:"or",62:"and",63:"negacion",64:"incremento",65:"decremento",66:"ternario",67:"dspuntos",68:"toint",69:"todouble",70:"entero",71:"decimal",72:"caracter",73:"cadena",74:"true",75:"false",76:"null",78:"igual"},
productions_: [0,[3,2],[4,2],[4,1],[6,6],[6,6],[6,7],[9,3],[9,2],[17,3],[17,1],[19,2],[19,4],[19,2],[19,4],[13,1],[13,1],[13,1],[13,1],[13,1],[11,2],[11,1],[27,2],[27,2],[27,2],[31,4],[31,4],[33,1],[33,1],[33,1],[33,1],[33,1],[33,1],[33,3],[33,5],[33,1],[33,3],[33,4],[33,3],[33,5],[33,6],[33,5],[33,5],[33,6],[33,4],[33,2],[33,5],[33,5],[46,3],[46,1],[35,3],[35,3],[35,3],[35,3],[35,3],[36,3],[36,3],[36,3],[36,3],[36,3],[36,3],[37,3],[37,3],[37,2],[37,2],[40,2],[40,2],[40,2],[40,2],[38,7],[39,4],[39,4],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[28,2],[28,4],[28,4],[28,2],[77,3],[77,1],[30,3],[30,5]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return this.$; 
break;
case 2: case 20:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1];  
break;
case 3: case 27: case 28: case 29: case 30: case 31: case 32: case 35: case 85:
 this.$ = $$[$0]; 
break;
case 4: case 5: case 6: case 7: case 22: case 23: case 24: case 33: case 45:
 this.$ = $$[$0-1]; 
break;
case 8:
 this.$ = []; 
break;
case 9: case 48:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 10: case 49:
 this.$ = []; this.$.push($$[$0]); 
break;
case 11: case 13:
 this.$ = $$[$0-1]; console.log("Parametro"); 
break;
case 12: case 14:
 this.$ = $$[$0-3]; console.log("Parametro"); 
break;
case 15: case 16: case 17: case 18: case 19:
 this.$ = $$[$0]; console.log("Tipo"); 
break;
case 21:
 this.$ = [$$[$0]]; 
break;
case 25:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 26:
 this.$ = new Println($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 34: case 39: case 41: case 42: case 46: case 47:
 this.$ = $$[$0-4]; 
break;
case 36: case 38:
 this.$ = $$[$0-2]; 
break;
case 37: case 44:
 this.$ = $$[$0-3]; 
break;
case 40: case 43:
 this.$ = $$[$0-5]; 
break;
case 50:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'+', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 51:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'-', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 52:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'*', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 53:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'/', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 54:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'%', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 55:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 56:
this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 57:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 58:
this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 59:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'==', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 60:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'!=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 61:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'||', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 62:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'&&', _$[$0-2].first_line, _$[$0-2].last_column);
break;
case 63:
 this.$ = new Logicas($$[$0], null, true , '!',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 64:
 this.$ = new Aritmetica($$[$0], null, true , 'UNARIO',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 65: case 66: case 67: case 68:
 this.$ = $$[$0-1]; console.log("unaria"); 
break;
case 69:
 this.$ = $$[$0-6]; console.log("ternario"); 
break;
case 70:
 this.$ = $$[$0-3]; console.log("toInt"); 
break;
case 71:
 this.$ = $$[$0-3]; console.log("toDouble"); 
break;
case 72: case 73:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 74: case 75:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 76:
this.$ = $$[$0]; console.log("id");
break;
case 77:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 78:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 79:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); 
break;
case 80:
 this.$ = []; console.log("lista ids") 
break;
case 81:
 this.$ = []; console.log("declaracion con valor"); 
break;
case 82:
 this.$ = []; console.log("declaracion con valor de una instancia"); 
break;
case 83:
 this.$ = []; console.log("lista ids de una instancia"); 
break;
case 84:
 this.$ =$$[$0-2]; 
break;
case 86:
this.$ = []; console.log("asignacion valor") 
break;
case 87:
this.$ = []; console.log("asignacion valor de instancia"); 
break;
}
},
table: [{3:1,4:2,6:3,7:$V0,13:5,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5},{1:[3]},{5:[1,11],6:12,7:$V0,13:5,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5},o($V6,[2,3]),{8:[1,13],14:[1,14]},{8:[1,15]},o($V7,[2,15]),o($V7,[2,16]),o($V7,[2,17]),o($V7,[2,18]),o($V7,[2,19]),{1:[2,1]},o($V6,[2,2]),{9:16,15:$V8},{15:[1,18]},{9:19,15:$V8},{10:[1,20]},{8:$V9,13:24,16:[1,22],17:21,19:23,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5},{16:[1,26]},{10:[1,27]},{8:$Va,11:28,13:33,15:$Vb,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5,27:29,28:30,30:31,31:32,32:$Vc,33:35,34:$Vd,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{16:[1,61],18:[1,62]},{10:[2,8]},o($Vt,[2,10]),{8:[1,63],20:[1,64]},{8:[1,65],20:[1,66]},{10:[1,67]},{8:$Va,11:68,13:33,15:$Vb,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5,27:29,28:30,30:31,31:32,32:$Vc,33:35,34:$Vd,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$Va,12:[1,69],13:33,15:$Vb,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5,27:70,28:30,30:31,31:32,32:$Vc,33:35,34:$Vd,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($Vu,[2,21]),{29:[1,71]},{29:[1,72]},{29:[1,73]},{8:[1,75],77:74},o($Vv,$Vw,{77:77,8:[1,76],78:[1,78]}),{41:[1,79],50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},{15:[1,95]},{15:[1,96]},o($VM,[2,27]),o($VM,[2,28]),o($VM,[2,29]),o($VM,[2,30]),o($VM,[2,31]),o($VM,[2,32]),{8:$VN,15:$Vb,33:97,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($VM,[2,35]),{20:[1,100],45:[1,99]},{8:[1,101]},{8:$VN,15:$Vb,33:102,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:103,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{15:[1,104]},{15:[1,105]},{8:$VN,15:$Vb,33:106,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:107,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($VM,[2,72]),o($VM,[2,73]),o($VM,[2,74]),o($VM,[2,75]),o($VM,[2,77]),o($VM,[2,78]),o($VM,[2,79]),{10:[2,7]},{8:$V9,13:24,19:108,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5},o($Vt,[2,11]),{21:[1,109]},o($Vt,[2,13]),{21:[1,110]},{8:$Va,11:111,13:33,15:$Vb,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5,27:29,28:30,30:31,31:32,32:$Vc,33:35,34:$Vd,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$Va,12:[1,112],13:33,15:$Vb,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5,27:70,28:30,30:31,31:32,32:$Vc,33:35,34:$Vd,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($V6,[2,4]),o($Vu,[2,20]),o($Vu,[2,22]),o($Vu,[2,23]),o($Vu,[2,24]),{18:$VO,29:[2,80]},o($VP,$VQ,{78:[1,114]}),o($VP,$VQ,{78:[1,115]}),{18:$VO,29:[2,83]},{8:$VN,15:$Vb,33:116,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:[1,117],42:$VR,47:$VS,48:$VT,49:$VU},{8:$VN,15:$Vb,33:122,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:123,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:124,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:125,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:126,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:127,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:128,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:129,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:130,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:131,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:132,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:133,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:134,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($VM,[2,67]),o($VM,[2,68]),{8:$VN,15:$Vb,33:135,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:136,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{16:[1,137],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},o($VM,$Vw),{8:$VN,15:$Vb,16:[1,139],33:141,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,46:140,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:142,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($VM,[2,45],{20:[1,143]}),o($VW,[2,63],{41:$VV,64:$VK,65:$VL}),o($VX,[2,64],{41:$VV,52:$Vz,53:$VA,54:$VB,64:$VK,65:$VL}),{8:$VN,15:$Vb,33:144,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:145,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($VW,[2,65],{41:$VV,64:$VK,65:$VL}),o([16,18,21,29,50,51,52,53,54,55,56,57,58,59,60,61,62,64,67],[2,66],{41:$VV,65:$VL}),o($Vt,[2,9]),{8:[1,146]},{8:[1,147]},{8:$Va,12:[1,148],13:33,15:$Vb,22:$V1,23:$V2,24:$V3,25:$V4,26:$V5,27:70,28:30,30:31,31:32,32:$Vc,33:35,34:$Vd,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($V6,[2,5]),{8:[1,149]},{8:$VN,15:$Vb,33:150,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:151,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{29:[2,86],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},o($Vv,$VY,{15:$VZ,20:$V_,78:[1,152]}),{15:[1,155]},{15:[1,156]},{15:[1,157]},{15:[1,158]},o($VX,[2,50],{41:$VV,52:$Vz,53:$VA,54:$VB,64:$VK,65:$VL}),o($VX,[2,51],{41:$VV,52:$Vz,53:$VA,54:$VB,64:$VK,65:$VL}),o($VW,[2,52],{41:$VV,64:$VK,65:$VL}),o($VW,[2,53],{41:$VV,64:$VK,65:$VL}),o($VW,[2,54],{41:$VV,64:$VK,65:$VL}),o($V$,[2,55],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,59:$VG,60:$VH,64:$VK,65:$VL}),o($V$,[2,56],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,59:$VG,60:$VH,64:$VK,65:$VL}),o($V$,[2,57],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,59:$VG,60:$VH,64:$VK,65:$VL}),o($V$,[2,58],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,59:$VG,60:$VH,64:$VK,65:$VL}),o($V01,[2,59],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,64:$VK,65:$VL}),o($V01,[2,60],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,64:$VK,65:$VL}),o([16,18,21,29,61,67],[2,61],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,62:$VJ,64:$VK,65:$VL}),o([16,18,21,29,61,62,67],[2,62],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,64:$VK,65:$VL}),{16:[1,159],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},{16:[1,160],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},o($VM,[2,33],{66:[1,161]}),{8:[1,162],42:$VR,47:$VS,48:$VT,49:$VU},o($VM,[2,36]),{16:[1,163],18:$V11},o($Vt,[2,49],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL}),{21:[1,165],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},{8:$VN,15:$Vb,33:166,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{16:[1,167],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},{16:[1,168],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},o($Vt,[2,12]),o($Vt,[2,14]),o($V6,[2,6]),o($VP,[2,84]),{29:[2,81],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},{29:[2,82],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},{8:$VN,15:$Vb,33:169,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,16:[1,170],33:141,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,46:171,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{8:$VN,15:$Vb,33:172,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},{16:[1,173]},{16:[1,174]},{16:[1,175]},{16:[1,176]},{29:[2,25]},{29:[2,26]},{8:$VN,15:$Vb,33:177,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($VM,$VY,{15:$VZ,20:$V_}),o($VM,[2,37]),{8:$VN,15:$Vb,33:178,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o($VM,[2,44]),{21:[1,179],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},o($VM,[2,70]),o($VM,[2,71]),{29:[2,87],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},o($VM,[2,39]),{16:[1,180],18:$V11},{21:[1,181],41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL},o($VM,[2,34]),o($VM,[2,41]),o($VM,[2,42]),o($VM,[2,47]),{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL,67:[1,182]},o($Vt,[2,48],{41:$VV,50:$Vx,51:$Vy,52:$Vz,53:$VA,54:$VB,55:$VC,56:$VD,57:$VE,58:$VF,59:$VG,60:$VH,61:$VI,62:$VJ,64:$VK,65:$VL}),o($VM,[2,46]),o($VM,[2,40]),o($VM,[2,43]),{8:$VN,15:$Vb,33:183,35:38,36:39,37:40,38:41,39:42,40:43,41:$Ve,43:45,44:$Vf,51:$Vg,63:$Vh,64:$Vi,65:$Vj,68:$Vk,69:$Vl,70:$Vm,71:$Vn,72:$Vo,73:$Vp,74:$Vq,75:$Vr,76:$Vs},o([16,18,21,29,50,51,52,53,54,55,56,57,58,59,60,61,62,64,65,67],[2,69],{41:$VV})],
defaultActions: {11:[2,1],22:[2,8],61:[2,7],159:[2,25],160:[2,26]},
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
    const {Relacionales} = require("../Expresiones/Operaciones/Relacionales");
    const {Logicas} = require("../Expresiones/Operaciones/Logicas");
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
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
break;
case 1:
break;
case 2:
break;
case 3:return 71       // NUMERICO
break;
case 4:return 70
break;
case 5:return 61        //RELACIONAL
break;
case 6:return 62
break;
case 7:return 64
break;
case 8:return 65
break;
case 9:return 'concat'
break;
case 10:return 'repit'
break;
case 11:return 50           //ARITEMETICO
break;
case 12:return 51
break;
case 13:return 52
break;
case 14:return 53
break;
case 15:return 54
break;
case 16:return 57   // LOGICO
break;
case 17:return 58
break;
case 18:return 60
break;
case 19:return 59
break;
case 20:return 56
break;
case 21:return 55
break;
case 22:return 63
break;
case 23:return 66   //TERNARIO
break;
case 24:return 67
break;
case 25:return 41
break;
case 26:return 10   //GRAMATICO
break;
case 27:return 12
break;
case 28:return 15
break;
case 29:return 16
break;
case 30:return 20
break;
case 31:return 21
break;
case 32:return 29
break;
case 33:return 18
break;
case 34:return 78
break;
case 35: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 72; 
break;
case 36: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 73; 
break;
case 37:return 23      //TIPOS
break;
case 38:return 24
break;
case 39:return 25
break;
case 40:return 26
break;
case 41:return 22
break;
case 42:return 74
break;
case 43:return 75
break;
case 44:return 'pow'     //NATIVAS
break;
case 45:return 'sin'
break;
case 46:return 'cos'
break;
case 47:return 'tan'
break;
case 48:return 'sqrt'
break;
case 49:return 'log'
break;
case 50:return 32
break;
case 51:return 34
break;
case 52:return 'parse'
break;
case 53:return 68
break;
case 54:return 69
break;
case 55:return 'typeof'
break;
case 56:return 'if'
break;
case 57:return 'else'
break;
case 58:return 'switch'
break;
case 59:return 'case'
break;
case 60:return 'default'
break;
case 61:return 'break'
break;
case 62:return 'continue'
break;
case 63:return 'while'
break;
case 64:return 'do'
break;
case 65:return 'for'
break;
case 66:return 'in'
break;
case 67:return 42
break;
case 68:return 'substring'
break;
case 69:return 'caracterposition'
break;
case 70:return 7
break;
case 71:return 'return'
break;
case 72:return 14
break;
case 73:return 76
break;
case 74:return 'struct'
break;
case 75:return 47
break;
case 76:return 48
break;
case 77:return 49
break;
case 78:return 8
break;
case 79:return 5
break;
case 80: console.log("error lexico"); 
break;
}
},
rules: [/^(?:[ \r\t\n]+)/i,/^(?:\/\/.([^\n])*)/i,/^(?:\/\*(.?\n?)*\*\/)/i,/^(?:[0-9]+(\.[0-9]+))/i,/^(?:[0-9]+)/i,/^(?:\|\|)/i,/^(?:&&)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:&)/i,/^(?:\^)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:!=)/i,/^(?:==)/i,/^(?:>)/i,/^(?:<)/i,/^(?:!)/i,/^(?:\?)/i,/^(?::)/i,/^(?:\.)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:;)/i,/^(?:,)/i,/^(?:=)/i,/^(?:[\'\‘\’].[\'\’\‘])/i,/^(?:[\"\“\”](([^\"\“\”\\])*([\\].)*)*[\"\“\”])/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:char\b)/i,/^(?:boolean\b)/i,/^(?:String\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:pow\b)/i,/^(?:sin\b)/i,/^(?:cos\b)/i,/^(?:tan\b)/i,/^(?:sqrt\b)/i,/^(?:log10\b)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:parse\b)/i,/^(?:toInt\b)/i,/^(?:toDouble\b)/i,/^(?:typeof\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:while\b)/i,/^(?:do\b)/i,/^(?:for\b)/i,/^(?:in\b)/i,/^(?:length\b)/i,/^(?:subString\b)/i,/^(?:caracterOfPosition\b)/i,/^(?:void\b)/i,/^(?:return\b)/i,/^(?:main\b)/i,/^(?:null\b)/i,/^(?:struct\b)/i,/^(?:toUpperCase\b)/i,/^(?:toLowerCase\b)/i,/^(?:toString\b)/i,/^(?:[A-Za-z_\ñ\Ñ][A-Za-z_0-9\ñ\Ñ]*)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80],"inclusive":true}}
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
},{"../Expresiones/Operaciones/Aritmetica":7,"../Expresiones/Operaciones/Logicas":8,"../Expresiones/Operaciones/Relacionales":10,"../Expresiones/Primitivo":11,"../Instrucciones/Print":13,"../Instrucciones/Println":14,"_process":3,"fs":1,"path":2}],13:[function(require,module,exports){
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
        padre.addHijo(new Nodo_1.Nodo("pint", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.addHijo(this.expresion.recorrer());
        padre.addHijo(hijo);
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Print = Print;

},{"../AST/Nodo":5}],14:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("Print", "");
        padre.addHijo(new Nodo_1.Nodo("pint", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.addHijo(this.expresion.recorrer());
        padre.addHijo(hijo);
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Println = Println;

},{"../AST/Nodo":5}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSim = void 0;
class TablaSim {
    constructor(ant) {
        this.ant = ant;
        this.tabla = new Map();
    }
    agregar(id, simbolo) {
        this.tabla.set(id.toLowerCase(), simbolo); //convertimos a minuscula ya que nuestro lenguaje es caseinsitive ej. prueba = PRUeba
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

},{}],16:[function(require,module,exports){
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
        return tipo.CADENA;
    }
    getStype() {
        return this.stype;
    }
}
exports.Tipo = Tipo;

},{}],17:[function(require,module,exports){
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
//--------------------------------------- Analizar -------------------------------------------
function analizar(){
  document.getElementById(`textOutput-${TabActual.tab}`).value = ejecutarCodigo(TabActual.editor.getValue());
}
// -------------------------------------- reporteria -----------------------------------------
function showModal(){

}


document.getElementById("prueba").onclick = function() {ej()};


function ej(){
  document.getElementById(`textOutput-Blank`).value = ejecutarCodigo(TabActual.editor.getValue());
}

const Ast_1 = require("./AST/Ast");
const TablaSim_1 = require("./TablaSimbolos/TablaSim");
const Controller_1 = require("./Controller");
const gramatica = require("./Gramar/gramar");
//import * as gramatica from "../Gramar/gramar";
function ejecutarCodigo(entrada) {
    //traigo todas las raices
    const instrucciones = gramatica.parse(entrada);
    let controlador = new Controller_1.Controller();
    const entornoGlobal = new TablaSim_1.TablaSim(null);
    let entornoU = new TablaSim_1.TablaSim(null);
    const ast = new Ast_1.AST(instrucciones);
    //recorro todas las raices  RECURSIVA
    /*
      for (let element of instrucciones) {
        element.ejecutar(controlador, entornoGlobal, entornoU);
      }*/
    // console.log(instrucciones);
      
    instrucciones.forEach((element) => {
        element.ejecutar(controlador, entornoGlobal, entornoU);
    });
    return controlador.consola;
}

},{"./AST/Ast":4,"./Controller":6,"./Gramar/gramar":12,"./TablaSimbolos/TablaSim":15}]},{},[17]);
