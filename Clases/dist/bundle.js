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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("ID", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador, ""));
        return padre;
    }
}
exports.Identificador = Identificador;

},{"../AST/Nodo":6}],9:[function(require,module,exports){
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

},{"../../AST/Errores":5,"../../AST/Nodo":6,"../../TablaSimbolos/Tipo":38,"./Operaciones":14}],10:[function(require,module,exports){
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
    getTipo(controlador, ts, ts_u) {
    }
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
            case 'caracterposition':
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            return valor_expre1.charAt(valor_expre2);
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
            case 'substring':
                if (typeof valor_expre1 === "string") {
                    if (typeof valor_expre2 === "number") {
                        if (this.isInt(Number(valor_expre2))) {
                            if (typeof valor_expre3 === "number") {
                                if (this.isInt(Number(valor_expre3))) {
                                    return valor_expre1.substring(valor_expre2, valor_expre3);
                                }
                                else {
                                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre3}, tipo de dato incorrecto`, this.linea, this.column);
                                    controlador.errores.push(error);
                                }
                            }
                            else {
                                let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre3}, tipo de dato incorrecto`, this.linea, this.column);
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
            case 'length':
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.length;
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case 'touppercase':
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toUpperCase();
                }
                else {
                    let error = new Errores_1.Errores('Semantico', `El valor ${valor_expre1}, tipo de dato incorrecto`, this.linea, this.column);
                    controlador.errores.push(error);
                }
                break;
            case 'tolowercase':
                if (typeof valor_expre1 === "string") {
                    return valor_expre1.toLowerCase();
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
        let padre = new Nodo_1.Nodo("Aritmetica", "");
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

},{"../../AST/Errores":5,"../../AST/Nodo":6}],11:[function(require,module,exports){
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
    getTipo(controlador, ts, ts_u) {
    }
    getValor(controlador, ts, ts_u) {
        let valor_expre2;
        valor_expre2 = this.expre2.getValor(controlador, ts, ts_u);
        switch (this.operador) {
            case 'parse':
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
            case 'toint':
                if (typeof valor_expre2 === "number") {
                    if (!(this.isInt(Number(valor_expre2)))) {
                        return Math.ceil(valor_expre2);
                    }
                }
                break;
            case 'todouble':
                if (typeof valor_expre2 === "number") {
                    return this.twoDecimal(valor_expre2);
                }
                break;
            case 'typeof':
                return typeof (valor_expre2);
                break;
            case 'tostring':
                if (!(typeof valor_expre2 === null)) {
                    return String(valor_expre2);
                }
                break;
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Aritmetica", "");
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

},{"../../AST/Nodo":6,"../../TablaSimbolos/Tipo":38}],12:[function(require,module,exports){
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

},{"../../AST/Nodo":6,"../../TablaSimbolos/Tipo":38,"./Operaciones":14}],13:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("Aritmetica", "");
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

},{"../../AST/Errores":5,"../../AST/Nodo":6,"../../TablaSimbolos/Tipo":38,"./Operaciones":14}],14:[function(require,module,exports){
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

},{"../../AST/Nodo":6}],15:[function(require,module,exports){
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
    codigoAscii(cadena) {
        let aux = 0;
        for (let index = 0; index < cadena.length; index++) {
            aux += cadena.charCodeAt(index);
        }
        return aux;
    }
}
exports.Relacionales = Relacionales;

},{"../../AST/Errores":5,"../../AST/Nodo":6,"../../TablaSimbolos/Tipo":38,"./Operaciones":14}],16:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("Primitivo", "");
        padre.addHijo(new Nodo_1.Nodo(this.primitivo.toString(), ""));
        return padre;
    }
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }
}
exports.Primitivo = Primitivo;

},{"../AST/Nodo":6,"../TablaSimbolos/Tipo":38}],17:[function(require,module,exports){
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

},{"../AST/Errores":5,"../AST/Nodo":6}],18:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,6],$V2=[1,8],$V3=[1,9],$V4=[1,10],$V5=[1,11],$V6=[1,12],$V7=[5,7,8,24,25,26,27,28],$V8=[8,22,54],$V9=[1,22],$Va=[18,20],$Vb=[2,105],$Vc=[1,25],$Vd=[1,33],$Ve=[1,66],$Vf=[1,46],$Vg=[1,48],$Vh=[1,52],$Vi=[1,60],$Vj=[1,61],$Vk=[1,62],$Vl=[1,63],$Vm=[1,53],$Vn=[1,54],$Vo=[1,55],$Vp=[1,56],$Vq=[1,57],$Vr=[1,58],$Vs=[1,51],$Vt=[1,64],$Vu=[1,65],$Vv=[1,67],$Vw=[1,68],$Vx=[1,69],$Vy=[1,70],$Vz=[1,71],$VA=[1,72],$VB=[1,73],$VC=[1,92],$VD=[1,94],$VE=[1,95],$VF=[1,96],$VG=[1,97],$VH=[1,101],$VI=[1,98],$VJ=[1,99],$VK=[1,100],$VL=[1,102],$VM=[16,20],$VN=[1,126],$VO=[1,111],$VP=[1,112],$VQ=[1,113],$VR=[1,114],$VS=[1,115],$VT=[1,116],$VU=[1,117],$VV=[1,118],$VW=[1,119],$VX=[1,120],$VY=[1,121],$VZ=[1,122],$V_=[1,123],$V$=[1,124],$V01=[1,125],$V11=[1,127],$V21=[10,16,18,20,23,54,57,58,59,60,61,62,63,80,81,82,83,84,85,86,87,91,92],$V31=[2,47],$V41=[2,53],$V51=[1,138],$V61=[2,98],$V71=[1,147],$V81=[1,145],$V91=[1,146],$Va1=[8,12,15,24,25,26,27,28,42,44,54,58,70,71,72,73,74,75,76,77,78,79,88,89,90,93,94,95,96,97,98,99,102,104,108,109,110,111,113,114,116],$Vb1=[54,57,58,59,60,61,62,63,80,81,82,83,84,85,86,87,91],$Vc1=[1,158],$Vd1=[1,190],$Ve1=[1,191],$Vf1=[1,192],$Vg1=[1,193],$Vh1=[1,194],$Vi1=[10,16,18,20,23,57,58,59,60,61,80,81,82,83,84,85,86,87,91,92],$Vj1=[10,16,18,20,23,57,58,80,81,82,83,84,85,86,87,91,92],$Vk1=[10,16,18,20,23,57,58,59,60,61,62,63,80,81,82,83,84,85,86,87,91,92],$Vl1=[10,16,18,20,23,80,81,82,83,86,87,91,92],$Vm1=[10,16,18,20,23,80,81,82,83,84,85,86,87,91,92],$Vn1=[1,283],$Vo1=[12,108,109];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"INICIO":3,"CONTENIDO":4,"EOF":5,"FUNCION_BLOQUE":6,"void":7,"id":8,"PARAMETROS_SENTENCIA":9,"llaveizq":10,"INSTRUCCIONES":11,"llavedec":12,"TIPO":13,"main":14,"parizq":15,"pardec":16,"DECLARACIONVARIABLE":17,"ptcoma":18,"LISTPARAMETROS":19,"coma":20,"PARAMETRO":21,"corizq":22,"cordec":23,"string":24,"int":25,"double":26,"char":27,"boolean":28,"INSTRUCCION":29,"ASIGNACION_BLOQUE":30,"PRINT_BLOQUE":31,"SENTENCIA_IF":32,"SENTENCIA_SWITCH":33,"SENTENCIA_FOR":34,"SENTENCIA_FOR_ESP":35,"SENTENCIA_WHILE":36,"SENTENCIA_DOWHILE":37,"SENTENCIA_BREAK":38,"UNARIA":39,"SENTENCIA_RETURN":40,"LLAMADA":41,"print":42,"EXPRESION":43,"println":44,"ARITMETICA":45,"CADENAS":46,"RELACIONAL":47,"LOGICA":48,"TERNARIO":49,"NATIVAS":50,"NAT_CAD":51,"NAT_FUN":52,"PRIMITIVO":53,"punto":54,"SENTENCIA_TERNARIO":55,"LISTEXPRESIONES":56,"mas":57,"menos":58,"multiplicacion":59,"division":60,"modulo":61,"concat":62,"repit":63,"caracterposition":64,"substring":65,"length":66,"touppercase":67,"tolowercase":68,"parse":69,"toint":70,"todouble":71,"typeof":72,"tostring":73,"pow":74,"sin":75,"cos":76,"tan":77,"sqrt":78,"log":79,"menor":80,"mayor":81,"menorigual":82,"mayorigual":83,"igualigual":84,"diferente":85,"or":86,"and":87,"negacion":88,"incremento":89,"decremento":90,"ternario":91,"dspuntos":92,"entero":93,"decimal":94,"caracter":95,"cadena":96,"true":97,"false":98,"null":99,"LISTAIDS":100,"igual":101,"if":102,"else":103,"switch":104,"LISTACASE":105,"SENTENCIA_DEFAULT":106,"SENTENCIA_CASE":107,"case":108,"default":109,"break":110,"for":111,"in":112,"while":113,"do":114,"LISTAEXPRESIONES":115,"return":116,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"void",8:"id",10:"llaveizq",12:"llavedec",14:"main",15:"parizq",16:"pardec",18:"ptcoma",20:"coma",22:"corizq",23:"cordec",24:"string",25:"int",26:"double",27:"char",28:"boolean",42:"print",44:"println",54:"punto",57:"mas",58:"menos",59:"multiplicacion",60:"division",61:"modulo",62:"concat",63:"repit",64:"caracterposition",65:"substring",66:"length",67:"touppercase",68:"tolowercase",69:"parse",70:"toint",71:"todouble",72:"typeof",73:"tostring",74:"pow",75:"sin",76:"cos",77:"tan",78:"sqrt",79:"log",80:"menor",81:"mayor",82:"menorigual",83:"mayorigual",84:"igualigual",85:"diferente",86:"or",87:"and",88:"negacion",89:"incremento",90:"decremento",91:"ternario",92:"dspuntos",93:"entero",94:"decimal",95:"caracter",96:"cadena",97:"true",98:"false",99:"null",101:"igual",102:"if",103:"else",104:"switch",108:"case",109:"default",110:"break",111:"for",112:"in",113:"while",114:"do",116:"return"},
productions_: [0,[3,2],[4,2],[4,1],[6,6],[6,6],[6,6],[6,7],[6,2],[9,3],[9,2],[19,3],[19,1],[21,2],[21,4],[21,2],[21,4],[13,1],[13,1],[13,1],[13,1],[13,1],[11,2],[11,1],[29,2],[29,2],[29,2],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,2],[29,2],[29,2],[29,2],[31,4],[31,4],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[43,3],[43,1],[43,2],[43,5],[43,1],[43,1],[56,3],[56,1],[45,3],[45,3],[45,3],[45,3],[45,3],[46,3],[46,3],[51,6],[51,8],[51,5],[51,5],[51,5],[52,6],[52,4],[52,4],[52,4],[52,4],[50,6],[50,4],[50,4],[50,4],[50,4],[50,4],[47,3],[47,3],[47,3],[47,3],[47,3],[47,3],[48,3],[48,3],[48,2],[48,2],[39,2],[39,2],[39,2],[39,2],[49,7],[53,1],[53,1],[53,1],[53,1],[53,1],[53,1],[53,1],[53,1],[17,2],[17,4],[100,3],[100,1],[30,3],[30,5],[32,7],[32,11],[32,9],[33,8],[33,7],[105,2],[105,1],[107,4],[106,3],[38,1],[55,5],[34,11],[35,7],[36,5],[37,9],[41,3],[41,4],[115,3],[115,1],[40,2],[40,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return this.$; 
break;
case 2: case 22: case 113:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 3: case 27: case 28: case 29: case 30: case 31: case 32: case 39: case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 49: case 52: case 53:
 this.$ = $$[$0]; 
break;
case 4:
 this.$= new Funcion(3, new Tipo('VOID'), $$[$0-4], $$[$0-3], true, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 5:
 this.$= new Funcion(3, $$[$0-5], $$[$0-4], $$[$0-3], false, $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 6: case 7: case 9: case 24: case 25: case 26: case 33: case 34: case 35: case 36: case 48: case 50:
 this.$ = $$[$0-1]; 
break;
case 8:
 this.$ = [$$[$0-1]]; 
break;
case 10:
 this.$ = []; 
break;
case 11: case 54: case 125:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 12: case 55: case 126:
 this.$ = []; this.$.push($$[$0]); 
break;
case 13:
 this.$ = new Simbolos(6,$$[$0-1], $$[$0], null); 
break;
case 14: case 16:
 this.$ = $$[$0-3]; console.log("Parametro"); 
break;
case 15:
 this.$ = $$[$0-1]; console.log("Parametro"); 
break;
case 17:
 this.$ = new Tipo('STRING'); 
break;
case 18:
 this.$ = new Tipo('ENTERO'); 
break;
case 19:
 this.$ = new Tipo('DECIMAL');
break;
case 20:
 this.$ = new Tipo('CHAR'); 
break;
case 21:
 this.$ = new Tipo('BOOLEAN'); 
break;
case 23: case 114:
 this.$ = [$$[$0]]; 
break;
case 37:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 38:
 this.$ = new Println($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column ); 
break;
case 51:
 this.$ = $$[$0-4]; 
break;
case 56:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'+', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 57:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'-', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 58:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'*', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 59:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'/', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 60:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'%', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 61:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'&', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 62:
 this.$ = new Aritmetica($$[$0-2], $$[$0], false ,'^', _$[$0-2].first_line,_$[$0-2].last_column);
break;
case 63:
 this.$ = new Cadenas($$[$0-5], $$[$0-1], null ,'caracterposition', _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 64:
 this.$ = new Cadenas($$[$0-7], $$[$0-3], $$[$0-1] ,'substring', _$[$0-7].first_line,_$[$0-7].last_column);
break;
case 65:
 this.$ = new Cadenas($$[$0-4], null, null ,'length', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 66:
 this.$ = new Cadenas($$[$0-4], null, null ,'touppercase', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 67:
 this.$ = new Cadenas($$[$0-4], null, null ,'tolowercase', _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 68:
 this.$ = new Conversion($$[$0-5], $$[$0-1],'parse', _$[$0-5].first_line,_$[$0-5].last_column); 
break;
case 69:
 this.$ = new Conversion(null, $$[$0-1],'toint', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 70:
 this.$ = new Conversion(null, $$[$0-1],'todouble', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 71:
 this.$ = new Conversion(null, $$[$0-1],'typeof', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 72:
 this.$ = new Conversion(null, $$[$0-1],'tostring', _$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 73:
 this.$ = new Nativa($$[$0-3], $$[$0-1], false ,'pow', _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 74:
 this.$ = new Nativa($$[$0-1], null, true , 'sin',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 75:
 this.$ = new Nativa($$[$0-1], null, true , 'cos',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 76:
 this.$ = new Nativa($$[$0-1], null, true , 'tan',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 77:
 this.$ = new Nativa($$[$0-1], null, true , 'sqrt',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 78:
 this.$ = new Nativa($$[$0-1], null, true , 'log',_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 79:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 80:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 81:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'<=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 82:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'>=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 83:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'==', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 84:
 this.$ = new Relacionales($$[$0-2], $$[$0], false ,'!=', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 85:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'||', _$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 86:
 this.$ = new Logicas($$[$0-2], $$[$0], false ,'&&', _$[$0-2].first_line, _$[$0-2].last_column);
break;
case 87:
 this.$ = new Logicas($$[$0], null, true , '!',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 88:
 this.$ = new Aritmetica($$[$0], null, true , 'UNARIO',_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 89:
 this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 90:
 this.$ = new Asignacion($$[$0], new Aritmetica(new Identificador($$[$0], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 91:
 this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '+',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 92:
 this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column),new Primitivo(1, _$[$0-1].first_line, _$[$0-1].last_column),false, '-',  _$[$0-1].first_line, _$[$0-1].last_column),_$[$0-1].first_line, _$[$0-1].last_column);
break;
case 93:
 this.$ = $$[$0-6]; console.log("ternario"); 
break;
case 94: case 95:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 96: case 97:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 98:
this.$ = new Identificador($$[$0], _$[$0].first_line, _$[$0].last_column);
break;
case 99:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 100:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 101:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column); 
break;
case 102:
 this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column);  
break;
case 103:
 this.$ = new Declaracion($$[$0-3], [new Simbolos(1,null, $$[$0-2], $$[$0])], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 104:
$$[$0-2].push(new Simbolos(1,null, $$[$0], null)); this.$ = $$[$0-2]; 
break;
case 105:
 this.$ = [new Simbolos(1,null, $$[$0], null)]; 
break;
case 106:
this.$ = new Asignacion($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].last_column);  
break;
case 107:
this.$ = []; console.log("asignacion valor de instancia"); 
break;
case 108:
 this.$ = new If( $$[$0-4], $$[$0-1], [], _$[$0-6].first_line, _$[$0-6].last_column ); 
break;
case 109:
 this.$ = new If( $$[$0-8], $$[$0-5], $$[$0-1], _$[$0-10].first_line, _$[$0-10].last_column ); 
break;
case 110:
 this.$ = new If( $$[$0-6], $$[$0-3], [$$[$0]], _$[$0-8].first_line, _$[$0-8].last_column ); 
break;
case 111:
 this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 112:
 this.$ = new Switch($$[$0-4],$$[$0-1],null,_$[$0-6].first_line,_$[$0-6].last_column); 
break;
case 115:
this.$ = new Case($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 116:
 this.$ =new Default($$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 117:
 this.$ = new Break(); 
break;
case 118:
 this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 119:
 this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line, _$[$0-10].last_column); 
break;
case 120:
 this.$ = new ForEsp(new Simbolos(1,null, $$[$0-5], null),$$[$0-3],$$[$0-1],_$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 121:
 this.$ = new While( $$[$0-3], $$[$0-1], _$[$0-4].first_line, _$[$0-4].last_column);  
break;
case 122:
 this.$ = new DoWhile($$[$0-2],$$[$0-6],_$[$0-8].first_line,_$[$0-8].first_column); 
break;
case 123:
 this.$ = new Llamada($$[$0-2], [], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 124:
 this.$ = new Llamada($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 127:
 this.$ = new Return($$[$0]);
break;
case 128:
 this.$ = new Return(null);
break;
}
},
table: [{3:1,4:2,6:3,7:$V0,8:$V1,13:5,17:7,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6},{1:[3]},{5:[1,13],6:14,7:$V0,8:$V1,13:5,17:7,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6},o($V7,[2,3]),{8:[1,15],14:[1,16]},{8:[1,17],100:18},{8:[1,19]},{18:[1,20]},o($V8,[2,17]),o($V8,[2,18]),o($V8,[2,19]),o($V8,[2,20]),o($V8,[2,21]),{1:[2,1]},o($V7,[2,2]),{9:21,15:$V9},{15:[1,23]},o($Va,$Vb,{9:24,15:$V9,101:$Vc}),{18:[2,102],20:[1,26]},{9:27,15:$V9},o($V7,[2,8]),{10:[1,28]},{8:$Vd,13:32,16:[1,30],19:29,21:31,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6},{16:[1,34]},{10:[1,35]},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:36,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:[1,74]},{10:[1,75]},{8:$VC,11:76,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{16:[1,103],20:[1,104]},{10:[2,10]},o($VM,[2,12]),{8:[1,105],22:[1,106]},{8:[1,107],22:[1,108]},{10:[1,109]},{8:$VC,11:110,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{18:[2,103],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($V21,[2,39]),o($V21,[2,40]),o($V21,[2,41]),o($V21,[2,42]),o($V21,[2,43]),o($V21,[2,44]),o($V21,[2,45]),o($V21,[2,46]),o($V21,$V31),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:128,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},o($V21,[2,49]),{8:[1,129]},o($V21,[2,52]),o($V21,$V41),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:130,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:131,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{15:[1,132]},{15:[1,133]},{15:[1,134]},{15:[1,135]},{15:[1,136]},{15:[1,137]},{54:$V51},{15:[1,139]},{15:[1,140]},{15:[1,141]},{15:[1,142]},{8:[1,143]},{8:[1,144]},o($V21,$V61,{15:$V71,89:$V81,90:$V91}),o($V21,[2,94]),o($V21,[2,95]),o($V21,[2,96]),o($V21,[2,97]),o($V21,[2,99]),o($V21,[2,100]),o($V21,[2,101]),o($Va,[2,104]),{8:$VC,11:148,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{8:$VC,12:[1,149],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($Va1,[2,23]),{18:[1,151]},{18:[1,152]},{18:[1,153]},o($Va1,[2,27]),o($Va1,[2,28]),o($Va1,[2,29]),o($Va1,[2,30]),o($Va1,[2,31]),o($Va1,[2,32]),{18:[1,154]},o($Vb1,$V31,{18:[1,155]}),{18:[1,156]},o($Vb1,$V41,{18:[1,157]}),{8:$Vc1,54:$V51,100:18},o($Vb1,$V61,{15:$V71,89:$V81,90:$V91,101:[1,159]}),{54:[1,160],57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{15:[1,161]},{15:[1,162]},{15:[1,163]},{15:[1,164]},{8:[1,166],15:[1,165]},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:167,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{10:[1,168]},{18:[2,117]},{8:$Ve,13:59,15:$Vf,18:[2,128],24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:169,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{10:[2,9]},{8:$Vd,13:32,21:170,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6},o($VM,[2,13]),{23:[1,171]},o($VM,[2,15]),{23:[1,172]},{8:$VC,11:173,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{8:$VC,12:[1,174],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:175,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:176,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:177,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:178,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:179,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:180,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:181,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:182,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:183,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:184,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:185,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:186,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:187,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:188,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:189,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{64:$Vd1,65:$Ve1,66:$Vf1,67:$Vg1,68:$Vh1},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:195,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{16:[1,196],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($V21,[2,50],{22:[1,197]}),o($Vi1,[2,87],{54:$VN,62:$VT,63:$VU}),o($Vj1,[2,88],{54:$VN,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU}),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:198,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:199,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:200,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:201,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:202,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:203,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{69:[1,204]},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:205,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:206,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:207,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:208,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},o($V21,[2,89]),o($V21,[2,90]),o($V21,[2,91]),o($V21,[2,92]),{8:$Ve,13:59,15:$Vf,16:[1,209],24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:211,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,115:210},{8:$VC,12:[1,212],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($V7,[2,4]),o($Va1,[2,22]),o($Va1,[2,24]),o($Va1,[2,25]),o($Va1,[2,26]),o($Va1,[2,33]),o($Va1,[2,34]),o($Va1,[2,35]),o($Va1,[2,36]),o($Va,$Vb,{101:$Vc}),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:213,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:[1,214],64:$Vd1,65:$Ve1,66:$Vf1,67:$Vg1,68:$Vh1},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:215,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:216,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:217,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:218,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{13:220,17:219,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6},{112:[1,221]},{10:[1,222],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{8:$VC,11:223,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{18:[2,127],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($VM,[2,11]),{8:[1,224]},{8:[1,225]},{8:$VC,12:[1,226],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($V7,[2,5]),o($Vj1,[2,56],{54:$VN,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU}),o($Vj1,[2,57],{54:$VN,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU}),o($Vi1,[2,58],{54:$VN,62:$VT,63:$VU}),o($Vi1,[2,59],{54:$VN,62:$VT,63:$VU}),o($Vi1,[2,60],{54:$VN,62:$VT,63:$VU}),o([10,16,18,20,23,57,58,59,60,61,62,80,81,82,83,84,85,86,87,91,92],[2,61],{54:$VN,63:$VU}),o($Vk1,[2,62],{54:$VN}),o($Vl1,[2,79],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,84:$VZ,85:$V_}),o($Vl1,[2,80],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,84:$VZ,85:$V_}),o($Vl1,[2,81],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,84:$VZ,85:$V_}),o($Vl1,[2,82],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,84:$VZ,85:$V_}),o($Vm1,[2,83],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU}),o($Vm1,[2,84],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU}),o([10,16,18,20,23,86,91,92],[2,85],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,87:$V01}),o([10,16,18,20,23,86,87,91,92],[2,86],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_}),{15:[1,227]},{15:[1,228]},{15:[1,229]},{15:[1,230]},{15:[1,231]},{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11,92:[1,232]},o($V21,[2,48]),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:234,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{20:[1,235],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,236],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,237],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,238],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,239],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,240],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{15:[1,241]},{16:[1,242],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,243],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,244],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,245],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($V21,[2,123]),{16:[1,246],20:[1,247]},o($VM,[2,126],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11}),o($V7,[2,6]),{18:[2,106],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{101:[1,248]},{16:[1,249],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,250],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,251],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,252],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{18:[1,253]},{8:$Vc1,100:18},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:254,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$VC,11:255,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{8:$VC,12:[1,256],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($VM,[2,14]),o($VM,[2,16]),o($V7,[2,7]),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:257,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:258,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{16:[1,259]},{16:[1,260]},{16:[1,261]},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:262,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:263,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{23:[1,264],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:265,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},o($V21,[2,74]),o($V21,[2,75]),o($V21,[2,76]),o($V21,[2,77]),o($V21,[2,78]),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:266,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},o($V21,[2,69]),o($V21,[2,70]),o($V21,[2,71]),o($V21,[2,72]),o($V21,[2,124]),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:267,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:268,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{18:[2,37]},{18:[2,38]},{10:[1,269]},{10:[1,270]},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:271,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{10:[1,272],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{8:$VC,12:[1,273],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{113:[1,274]},{16:[1,275],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{20:[1,276],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($V21,[2,65]),o($V21,[2,66]),o($V21,[2,67]),o([10,16,18,20,23,92],[2,118],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11}),{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11,92:[1,277]},o($V21,[2,51]),{16:[1,278],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{16:[1,279],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($VM,[2,125],{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11}),{18:[2,107],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{8:$VC,11:280,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{105:281,107:282,108:$Vn1},{18:[1,284],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},{8:$VC,11:285,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($Va1,[2,121]),{15:[1,286]},o($V21,[2,63]),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:287,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:288,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},o($V21,[2,73]),o($V21,[2,68]),{8:$VC,12:[1,289],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{12:[1,291],106:290,107:292,108:$Vn1,109:[1,293]},o($Vo1,[2,114]),{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:294,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:295,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{8:$VC,12:[1,296],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{8:$Ve,13:59,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,39:45,41:50,43:297,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB},{16:[1,298],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($Vk1,[2,93],{54:$VN}),o($Va1,[2,108],{103:[1,299]}),{12:[1,300]},o($Va1,[2,112]),o($Vo1,[2,113]),{92:[1,301]},{54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11,92:[1,302]},{16:[1,303],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($Va1,[2,120]),{16:[1,304],54:$VN,57:$VO,58:$VP,59:$VQ,60:$VR,61:$VS,62:$VT,63:$VU,80:$VV,81:$VW,82:$VX,83:$VY,84:$VZ,85:$V_,86:$V$,87:$V01,91:$V11},o($V21,[2,64]),{10:[1,305],32:306,102:$VF},o($Va1,[2,111]),{8:$VC,11:307,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{8:$VC,11:308,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{10:[1,309]},{18:[1,310]},{8:$VC,11:311,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($Va1,[2,110]),{8:$VC,12:[2,116],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($Vo1,[2,115],{45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,55:49,17:78,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,13:91,43:93,29:150,8:$VC,15:$Vf,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,42:$VD,44:$VE,54:$Vg,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL}),{8:$VC,11:312,13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:77,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($Va1,[2,122]),{8:$VC,12:[1,313],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},{8:$VC,12:[1,314],13:91,15:$Vf,17:78,24:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:150,30:79,31:80,32:81,33:82,34:83,35:84,36:85,37:86,38:87,39:88,40:89,41:90,42:$VD,43:93,44:$VE,45:37,46:38,47:39,48:40,49:41,50:42,51:43,52:44,53:47,54:$Vg,55:49,58:$Vh,70:$Vi,71:$Vj,72:$Vk,73:$Vl,74:$Vm,75:$Vn,76:$Vo,77:$Vp,78:$Vq,79:$Vr,88:$Vs,89:$Vt,90:$Vu,93:$Vv,94:$Vw,95:$Vx,96:$Vy,97:$Vz,98:$VA,99:$VB,102:$VF,104:$VG,110:$VH,111:$VI,113:$VJ,114:$VK,116:$VL},o($Va1,[2,109]),o($Va1,[2,119])],
defaultActions: {13:[2,1],30:[2,10],101:[2,117],103:[2,9],249:[2,37],250:[2,38]},
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
case 3:return 94       // NUMERICO
break;
case 4:return 93
break;
case 5:return 86        //RELACIONAL
break;
case 6:return 87
break;
case 7:return 89
break;
case 8:return 90
break;
case 9:return 62
break;
case 10:return 63
break;
case 11:return 57           //ARITEMETICO
break;
case 12:return 58
break;
case 13:return 59
break;
case 14:return 60
break;
case 15:return 61
break;
case 16:return 82   // LOGICO
break;
case 17:return 83
break;
case 18:return 85
break;
case 19:return 84
break;
case 20:return 81
break;
case 21:return 80
break;
case 22:return 88
break;
case 23:return 91   //TERNARIO
break;
case 24:return 92
break;
case 25:return 54
break;
case 26:return 10   //GRAMATICO
break;
case 27:return 12
break;
case 28:return 15
break;
case 29:return 16
break;
case 30:return 22
break;
case 31:return 23
break;
case 32:return 18
break;
case 33:return 20
break;
case 34:return 101
break;
case 35: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 95; 
break;
case 36: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 96; 
break;
case 37:return 73
break;
case 38:return 25      //TIPOS
break;
case 39:return 26
break;
case 40:return 27
break;
case 41:return 28
break;
case 42:return 24
break;
case 43:return 97
break;
case 44:return 98
break;
case 45:return 74     //NATIVAS
break;
case 46:return 75
break;
case 47:return 76
break;
case 48:return 77
break;
case 49:return 78
break;
case 50:return 79
break;
case 51:return 42
break;
case 52:return 44
break;
case 53:return 69
break;
case 54:return 70
break;
case 55:return 71
break;
case 56:return 72
break;
case 57:return 102
break;
case 58:return 103
break;
case 59:return 104
break;
case 60:return 108
break;
case 61:return 109
break;
case 62:return 110
break;
case 63:return 'continue'
break;
case 64:return 'begin'
break;
case 65:return 'end'
break;
case 66:return 113
break;
case 67:return 114
break;
case 68:return 111
break;
case 69:return 112
break;
case 70:return 66
break;
case 71:return 65
break;
case 72:return 64
break;
case 73:return 7
break;
case 74:return 116
break;
case 75:return 14
break;
case 76:return 99
break;
case 77:return 'struct'
break;
case 78:return 67
break;
case 79:return 68
break;
case 80:return 8
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
},{"../Expresiones/Identificador":8,"../Expresiones/Operaciones/Aritmetica":9,"../Expresiones/Operaciones/Cadenas":10,"../Expresiones/Operaciones/Conversion":11,"../Expresiones/Operaciones/Logicas":12,"../Expresiones/Operaciones/Nativa":13,"../Expresiones/Operaciones/Relacionales":15,"../Expresiones/Primitivo":16,"../Expresiones/Ternario":17,"../Instrucciones/Asignacion":19,"../Instrucciones/Ciclica/DoWhile":20,"../Instrucciones/Ciclica/For":21,"../Instrucciones/Ciclica/ForEsp":22,"../Instrucciones/Ciclica/While":23,"../Instrucciones/Control/Case":24,"../Instrucciones/Control/Default":25,"../Instrucciones/Control/If":26,"../Instrucciones/Control/Switch":27,"../Instrucciones/Declaracion":28,"../Instrucciones/Funcion":29,"../Instrucciones/Llamada":30,"../Instrucciones/Print":31,"../Instrucciones/Println":32,"../Instrucciones/Transferencia/Break":33,"../Instrucciones/Transferencia/Return":35,"../TablaSimbolos/Simbolos":36,"../TablaSimbolos/Tipo":38,"_process":3,"fs":1,"path":2}],19:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("Asignacion", "");
        padre.addHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.addHijo(new Nodo_1.Nodo("=", ""));
        padre.addHijo(this.valor.recorrer());
        return padre;
    }
}
exports.Asignacion = Asignacion;

},{"../AST/Errores":5,"../AST/Nodo":6}],20:[function(require,module,exports){
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
            let ts_local = new TablaSim_1.TablaSim(ts);
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
        let padre = new Nodo_1.Nodo("DoWhile", "");
        padre.addHijo(new Nodo_1.Nodo("Do", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_ins = new Nodo_1.Nodo("Intrucciones", "");
        for (let ins of this.lista_ins) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        padre.addHijo(new Nodo_1.Nodo("While", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.DoWhile = DoWhile;

},{"../../AST/Nodo":6,"../../TablaSimbolos/TablaSim":37,"../Transferencia/Break":33,"../Transferencia/Continue":34,"../Transferencia/Return":35}],21:[function(require,module,exports){
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
                let ts_local = new TablaSim_1.TablaSim(ts);
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
        padre.addHijo(new Nodo_1.Nodo("for", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.asig_decla.recorrer());
        padre.addHijo(new Nodo_1.Nodo(";", ""));
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(";", ""));
        padre.addHijo(this.actualizacion.recorrer());
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_ins = new Nodo_1.Nodo("Intrucciones", "");
        for (let ins of this.lista_ins) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_ins);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.For = For;

},{"../../AST/Nodo":6,"../../TablaSimbolos/TablaSim":37,"../Transferencia/Break":33,"../Transferencia/Continue":34,"../Transferencia/Return":35}],22:[function(require,module,exports){
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
                let ts_local = new TablaSim_1.TablaSim(ts);
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
        let padre = new Nodo_1.Nodo("For", "");
        padre.addHijo(new Nodo_1.Nodo("for", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        //padre.addHijo(this.asig_decla.recorrer());
        padre.addHijo(new Nodo_1.Nodo(";", ""));
        //padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(";", ""));
        padre.addHijo(this.actualizacion.recorrer());
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_ins = new Nodo_1.Nodo("Intrucciones", "");
        for (let ins of this.lista_ins) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_ins);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.ForEsp = ForEsp;

},{"../../AST/Errores":5,"../../AST/Nodo":6,"../../TablaSimbolos/Simbolos":36,"../../TablaSimbolos/TablaSim":37,"../Transferencia/Break":33,"../Transferencia/Continue":34,"../Transferencia/Return":35}],23:[function(require,module,exports){
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
                let ts_local = new TablaSim_1.TablaSim(ts);
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
        padre.addHijo(new Nodo_1.Nodo("while", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_inst = new Nodo_1.Nodo("Instrucciones", "");
        for (let ins of this.lista_ins) {
            hijo_inst.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_inst);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.While = While;

},{"../../AST/Nodo":6,"../../TablaSimbolos/TablaSim":37,"../Transferencia/Break":33,"../Transferencia/Continue":34,"../Transferencia/Return":35}],24:[function(require,module,exports){
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
        padre.addHijo(new Nodo_1.Nodo("case", ""));
        padre.addHijo(this.expresion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(":", ""));
        let hijo_ins = new Nodo_1.Nodo("Instrucciones", "");
        for (let ins of this.list_inst) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_ins);
        return padre;
    }
}
exports.Case = Case;

},{"../../AST/Nodo":6,"../Transferencia/Break":33,"../Transferencia/Return":35}],25:[function(require,module,exports){
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
        padre.addHijo(new Nodo_1.Nodo("default", ""));
        padre.addHijo(new Nodo_1.Nodo(":", ""));
        let hijo_ins = new Nodo_1.Nodo("Instrucciones", "");
        for (let ins of this.list_ins) {
            hijo_ins.addHijo(ins.recorrer());
        }
        padre.addHijo(hijo_ins);
        return padre;
    }
}
exports.Default = Default;

},{"../../AST/Nodo":6,"../Transferencia/Break":33,"../Transferencia/Return":35}],26:[function(require,module,exports){
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
        let ts_local = new TablaSim_1.TablaSim(ts);
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
        padre.addHijo(new Nodo_1.Nodo("if", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.condicion.recorrer());
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_ifs = new Nodo_1.Nodo("IntruccionesIf", "");
        for (let inst of this.lista_ifs) {
            hijo_ifs.addHijo(inst.recorrer());
        }
        padre.addHijo(hijo_ifs);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        padre.addHijo(new Nodo_1.Nodo("else", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_elses = new Nodo_1.Nodo("IntruccionElse", "");
        for (let inst of this.lista_elses) {
            hijo_elses.addHijo(inst.recorrer());
        }
        padre.addHijo(hijo_elses);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.If = If;

},{"../../AST/Nodo":6,"../../TablaSimbolos/TablaSim":37,"../../TablaSimbolos/Tipo":38,"../Transferencia/Break":33,"../Transferencia/Continue":34,"../Transferencia/Return":35}],27:[function(require,module,exports){
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
        let ts_local = new TablaSim_1.TablaSim(ts);
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
        padre.addHijo(new Nodo_1.Nodo("switch", ""));
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        padre.addHijo(this.valor.recorrer());
        padre.addHijo(new Nodo_1.Nodo(")", ""));
        padre.addHijo(new Nodo_1.Nodo("{", ""));
        let hijo_cases = new Nodo_1.Nodo("Casos", "");
        for (let casito of this.list_cases) {
            let hijito = new Nodo_1.Nodo("Case", "");
            hijito.addHijo(casito.recorrer());
            hijo_cases.addHijo(hijito);
        }
        padre.addHijo(hijo_cases);
        padre.addHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.Switch = Switch;

},{"../../AST/Nodo":6,"../../TablaSimbolos/TablaSim":37,"../Transferencia/Break":33,"../Transferencia/Return":35}],28:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("Declaracion", "");
        let hijo_sim = new Nodo_1.Nodo("Simbolos", "");
        padre.addHijo(new Nodo_1.Nodo(this.tipo.stype, ""));
        for (let simb of this.lista_simbolos) {
            let varia = simb;
            if (varia.valor != null) {
                hijo_sim.addHijo(new Nodo_1.Nodo(simb.identificador, ""));
                hijo_sim.addHijo(new Nodo_1.Nodo("=", ""));
                let aux = simb.valor;
                hijo_sim.addHijo(aux.recorrer());
            }
            else {
                hijo_sim.addHijo(new Nodo_1.Nodo(";", ""));
            }
        }
        padre.addHijo(hijo_sim);
        return padre;
    }
}
exports.Declaracion = Declaracion;

},{"../AST/Errores":5,"../AST/Nodo":6,"../TablaSimbolos/Simbolos":36,"../TablaSimbolos/Tipo":38}],29:[function(require,module,exports){
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
        if (!(ts.existe(this.identificador))) {
            ts.agregar(this.identificador, this);
            ts_u.agregar(this.identificador, this);
        }
        else {
            //Erro Semantico
        }
    }
    ejecutar(controlador, ts, ts_u) {
        let ts_local = new TablaSim_1.TablaSim(ts);
        let valor_type = this.tipo.stype;
        let tipo_aux = "";
        if (valor_type == "ENTERO" || valor_type == "DECIMAL") {
            tipo_aux = 'number';
        }
        else if (valor_type == "STRING" || valor_type == "CHAR") {
            tipo_aux = 'string';
        }
        else if (valor_type == "BOOLEAN") {
            tipo_aux = 'boolean';
        }
        for (let ins of this.lista_ints) {
            let result = ins.ejecutar(controlador, ts_local, ts_u);
            if (result != null) {
                if (ins instanceof Break_1.Break || result instanceof Break_1.Break) {
                    continue;
                }
                if (ins instanceof Return_1.Return) {
                    return result;
                    console.log("BUEAN");
                }
                if (tipo_aux == 'VOID') {
                    return;
                }
                else {
                    if (typeof result == tipo_aux) {
                        return result;
                    }
                    else {
                        let error = new Errores_1.Errores('Semantico', ` La variable no concuerda con el tipo`, this.linea, this.column);
                        controlador.errores.push(error);
                        controlador.append(`La variable no concuerda con el tipo, En la linea ${this.linea}, y columna ${this.column}`);
                    }
                }
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Funcion", "");
        return padre;
    }
}
exports.Funcion = Funcion;

},{"../AST/Errores":5,"../AST/Nodo":6,"../TablaSimbolos/Simbolos":36,"../TablaSimbolos/TablaSim":37,"./Transferencia/Break":33,"./Transferencia/Return":35}],30:[function(require,module,exports){
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
            let ts_local = new TablaSim_1.TablaSim(ts);
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
        padre.addHijo(new Nodo_1.Nodo("(", ""));
        let hijo_para = new Nodo_1.Nodo("Parametros", "");
        if (this.parametros != null) {
            for (let para of this.parametros) {
                let hijo_para2 = new Nodo_1.Nodo("Parametro", "");
                hijo_para2.addHijo(para.recorrer());
                hijo_para.addHijo(hijo_para2);
            }
        }
        padre.addHijo(hijo_para);
        padre.addHijo(new Nodo_1.Nodo(")", ""));
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

},{"../AST/Errores":5,"../AST/Nodo":6,"../TablaSimbolos/Simbolos":36,"../TablaSimbolos/TablaSim":37,"../TablaSimbolos/Tipo":38}],31:[function(require,module,exports){
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

},{"../AST/Nodo":6}],32:[function(require,module,exports){
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

},{"../AST/Nodo":6}],33:[function(require,module,exports){
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

},{"../../AST/Nodo":6}],34:[function(require,module,exports){
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

},{"../../AST/Nodo":6}],35:[function(require,module,exports){
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
            let hijo = new Nodo_1.Nodo("Valor", "");
            hijo.addHijo(this.valor_retur.recorrer());
            padre.addHijo(hijo);
        }
        return padre;
    }
}
exports.Return = Return;

},{"../../AST/Nodo":6}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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
  let ejecucion = ejecutarCodigo(TabActual.editor.getValue());
  document.getElementById(`textOutput-Blank`).value = ejecucion.salida;
  document.getElementById(`tabla_e-Blank`).innerHTML = ejecucion.tabla_e;
}

const Ast_1 = require("./AST/Ast");
const TablaSim_1 = require("./TablaSimbolos/TablaSim");
const Controller_1 = require("./Controller");
const gramatica = require("./Gramar/gramar");
const Funcion_1 = require("./Instrucciones/Funcion");
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
    instrucciones.forEach((ins) => {
        if (ins instanceof Funcion_1.Funcion) {
            let funcion = ins;
            funcion.agregarSimboloFunc(controlador, entornoGlobal, entornoU);
        }
    });
    instrucciones.forEach((element) => {
        element.ejecutar(controlador, entornoGlobal, entornoU);
    });
    return {salida:controlador.consola,tabla_e:controlador.graficar_tErrores()};
}

},{"./AST/Ast":4,"./Controller":7,"./Gramar/gramar":18,"./Instrucciones/Funcion":29,"./TablaSimbolos/TablaSim":37}]},{},[39]);
