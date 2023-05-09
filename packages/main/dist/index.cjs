"use strict";
var electron = require("electron");
var url = require("url");
var require$$1 = require("path");
var require$$0$3 = require("fs");
var require$$0$1 = require("constants");
var require$$0$2 = require("stream");
var require$$2 = require("util");
var require$$5 = require("assert");
var require$$1$1 = require("os");
var require$$0$4 = require("events");
var https = require("https");
var child_process = require("child_process");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  var n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    Object.keys(e).forEach(function(k) {
      if (k !== "default") {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}
var require$$1__default = /* @__PURE__ */ _interopDefaultLegacy(require$$1);
var require$$0__default$2 = /* @__PURE__ */ _interopDefaultLegacy(require$$0$3);
var require$$0__default = /* @__PURE__ */ _interopDefaultLegacy(require$$0$1);
var require$$0__default$1 = /* @__PURE__ */ _interopDefaultLegacy(require$$0$2);
var require$$2__default = /* @__PURE__ */ _interopDefaultLegacy(require$$2);
var require$$5__default = /* @__PURE__ */ _interopDefaultLegacy(require$$5);
var require$$1__default$1 = /* @__PURE__ */ _interopDefaultLegacy(require$$1$1);
var require$$0__default$3 = /* @__PURE__ */ _interopDefaultLegacy(require$$0$4);
var https__default = /* @__PURE__ */ _interopDefaultLegacy(https);
const ALLOWED_ORIGINS_AND_PERMISSIONS = /* @__PURE__ */ new Map(
  [[new url.URL("http://localhost:3000/").origin, /* @__PURE__ */ new Set()]]
);
const ALLOWED_EXTERNAL_ORIGINS = /* @__PURE__ */ new Set([
  "https://github.com",
  "https://www.w3schools.com",
  "https://www.google.com",
  "https://git.nfdi4plants.org"
]);
electron.app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, url$1) => {
    new url.URL(url$1);
  });
  contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    var _a;
    const { origin } = new url.URL(webContents.getURL());
    const permissionGranted = !!((_a = ALLOWED_ORIGINS_AND_PERMISSIONS.get(origin)) == null ? void 0 : _a.has(permission));
    callback(permissionGranted);
    if (!permissionGranted && true) {
      console.warn(`${origin} requested permission for '${permission}', but was blocked.`);
    }
  });
  contents.setWindowOpenHandler(({ url: url$1 }) => {
    const { origin } = new url.URL(url$1);
    if (ALLOWED_EXTERNAL_ORIGINS.has(origin)) {
      electron.shell.openExternal(url$1).catch(console.error);
    } else {
      console.warn("Blocked the opening of an unallowed origin:", origin);
    }
    return { action: "deny" };
  });
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    const { origin } = new url.URL(params.src);
    if (!ALLOWED_EXTERNAL_ORIGINS.has(origin)) {
      {
        console.warn(`A webview tried to attach ${params.src}, but was blocked.`);
      }
      event.preventDefault();
      return;
    }
    delete webPreferences.preload;
    delete webPreferences.preloadURL;
    webPreferences.nodeIntegration = false;
  });
});
async function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    show: false,
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: true,
      preload: require$$1.join(__dirname, "../../preload/dist/index.cjs")
    },
    width: 1280,
    height: 700
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
  });
  const pageUrl = "http://localhost:3000/";
  await mainWindow.loadURL(pageUrl);
  return mainWindow;
}
async function restoreOrCreateWindow() {
  let window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
  const template = [
    {
      label: "Window",
      submenu: [
        { role: "quit" },
        { role: "reload" },
        { role: "forceReload" },
        { type: "separator" },
        { role: "toggleDevTools" }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Tutorials",
          click: async () => {
            electron.shell.openExternal("https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/tutorials/QuickStart_swate.html");
          }
        },
        {
          label: "Helpdesk",
          click: async () => {
            electron.shell.openExternal("https://helpdesk.nfdi4plants.org");
          }
        },
        {
          label: "Knowledge Base",
          click: async () => {
            electron.shell.openExternal("https://nfdi4plants.org/nfdi4plants.knowledgebase/index.html");
          }
        }
      ]
    }
  ];
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
  if (window2 === void 0) {
    window2 = await createWindow();
  }
  if (window2.isMinimized()) {
    window2.restore();
  }
  window2.focus();
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var lib = { exports: {} };
var fs$n = {};
var universalify = {};
universalify.fromCallback = function(fn) {
  return Object.defineProperty(function() {
    if (typeof arguments[arguments.length - 1] === "function")
      fn.apply(this, arguments);
    else {
      return new Promise((resolve, reject) => {
        arguments[arguments.length] = (err, res) => {
          if (err)
            return reject(err);
          resolve(res);
        };
        arguments.length++;
        fn.apply(this, arguments);
      });
    }
  }, "name", { value: fn.name });
};
universalify.fromPromise = function(fn) {
  return Object.defineProperty(function() {
    const cb = arguments[arguments.length - 1];
    if (typeof cb !== "function")
      return fn.apply(this, arguments);
    else
      fn.apply(this, arguments).then((r) => cb(null, r), cb);
  }, "name", { value: fn.name });
};
var constants$5 = require$$0__default["default"];
var origCwd = process.cwd;
var cwd = null;
var platform = {}.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd;
};
try {
  process.cwd();
} catch (er) {
}
if (typeof process.chdir === "function") {
  var chdir = process.chdir;
  process.chdir = function(d) {
    cwd = null;
    chdir.call(process, d);
  };
  if (Object.setPrototypeOf)
    Object.setPrototypeOf(process.chdir, chdir);
}
var polyfills$1 = patch$1;
function patch$1(fs2) {
  if (constants$5.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs2);
  }
  if (!fs2.lutimes) {
    patchLutimes(fs2);
  }
  fs2.chown = chownFix(fs2.chown);
  fs2.fchown = chownFix(fs2.fchown);
  fs2.lchown = chownFix(fs2.lchown);
  fs2.chmod = chmodFix(fs2.chmod);
  fs2.fchmod = chmodFix(fs2.fchmod);
  fs2.lchmod = chmodFix(fs2.lchmod);
  fs2.chownSync = chownFixSync(fs2.chownSync);
  fs2.fchownSync = chownFixSync(fs2.fchownSync);
  fs2.lchownSync = chownFixSync(fs2.lchownSync);
  fs2.chmodSync = chmodFixSync(fs2.chmodSync);
  fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
  fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
  fs2.stat = statFix(fs2.stat);
  fs2.fstat = statFix(fs2.fstat);
  fs2.lstat = statFix(fs2.lstat);
  fs2.statSync = statFixSync(fs2.statSync);
  fs2.fstatSync = statFixSync(fs2.fstatSync);
  fs2.lstatSync = statFixSync(fs2.lstatSync);
  if (fs2.chmod && !fs2.lchmod) {
    fs2.lchmod = function(path2, mode, cb) {
      if (cb)
        process.nextTick(cb);
    };
    fs2.lchmodSync = function() {
    };
  }
  if (fs2.chown && !fs2.lchown) {
    fs2.lchown = function(path2, uid, gid, cb) {
      if (cb)
        process.nextTick(cb);
    };
    fs2.lchownSync = function() {
    };
  }
  if (platform === "win32") {
    fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : function(fs$rename) {
      function rename2(from, to, cb) {
        var start = Date.now();
        var backoff = 0;
        fs$rename(from, to, function CB(er) {
          if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 6e4) {
            setTimeout(function() {
              fs2.stat(to, function(stater, st) {
                if (stater && stater.code === "ENOENT")
                  fs$rename(from, to, CB);
                else
                  cb(er);
              });
            }, backoff);
            if (backoff < 100)
              backoff += 10;
            return;
          }
          if (cb)
            cb(er);
        });
      }
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(rename2, fs$rename);
      return rename2;
    }(fs2.rename);
  }
  fs2.read = typeof fs2.read !== "function" ? fs2.read : function(fs$read) {
    function read(fd, buffer2, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === "function") {
        var eagCounter = 0;
        callback = function(er, _, __) {
          if (er && er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            return fs$read.call(fs2, fd, buffer2, offset, length, position, callback);
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs2, fd, buffer2, offset, length, position, callback);
    }
    if (Object.setPrototypeOf)
      Object.setPrototypeOf(read, fs$read);
    return read;
  }(fs2.read);
  fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : function(fs$readSync) {
    return function(fd, buffer2, offset, length, position) {
      var eagCounter = 0;
      while (true) {
        try {
          return fs$readSync.call(fs2, fd, buffer2, offset, length, position);
        } catch (er) {
          if (er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            continue;
          }
          throw er;
        }
      }
    };
  }(fs2.readSync);
  function patchLchmod(fs3) {
    fs3.lchmod = function(path2, mode, callback) {
      fs3.open(
        path2,
        constants$5.O_WRONLY | constants$5.O_SYMLINK,
        mode,
        function(err, fd) {
          if (err) {
            if (callback)
              callback(err);
            return;
          }
          fs3.fchmod(fd, mode, function(err2) {
            fs3.close(fd, function(err22) {
              if (callback)
                callback(err2 || err22);
            });
          });
        }
      );
    };
    fs3.lchmodSync = function(path2, mode) {
      var fd = fs3.openSync(path2, constants$5.O_WRONLY | constants$5.O_SYMLINK, mode);
      var threw = true;
      var ret;
      try {
        ret = fs3.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs3.closeSync(fd);
          } catch (er) {
          }
        } else {
          fs3.closeSync(fd);
        }
      }
      return ret;
    };
  }
  function patchLutimes(fs3) {
    if (constants$5.hasOwnProperty("O_SYMLINK") && fs3.futimes) {
      fs3.lutimes = function(path2, at, mt, cb) {
        fs3.open(path2, constants$5.O_SYMLINK, function(er, fd) {
          if (er) {
            if (cb)
              cb(er);
            return;
          }
          fs3.futimes(fd, at, mt, function(er2) {
            fs3.close(fd, function(er22) {
              if (cb)
                cb(er2 || er22);
            });
          });
        });
      };
      fs3.lutimesSync = function(path2, at, mt) {
        var fd = fs3.openSync(path2, constants$5.O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs3.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs3.closeSync(fd);
            } catch (er) {
            }
          } else {
            fs3.closeSync(fd);
          }
        }
        return ret;
      };
    } else if (fs3.futimes) {
      fs3.lutimes = function(_a, _b, _c, cb) {
        if (cb)
          process.nextTick(cb);
      };
      fs3.lutimesSync = function() {
      };
    }
  }
  function chmodFix(orig) {
    if (!orig)
      return orig;
    return function(target, mode, cb) {
      return orig.call(fs2, target, mode, function(er) {
        if (chownErOk(er))
          er = null;
        if (cb)
          cb.apply(this, arguments);
      });
    };
  }
  function chmodFixSync(orig) {
    if (!orig)
      return orig;
    return function(target, mode) {
      try {
        return orig.call(fs2, target, mode);
      } catch (er) {
        if (!chownErOk(er))
          throw er;
      }
    };
  }
  function chownFix(orig) {
    if (!orig)
      return orig;
    return function(target, uid, gid, cb) {
      return orig.call(fs2, target, uid, gid, function(er) {
        if (chownErOk(er))
          er = null;
        if (cb)
          cb.apply(this, arguments);
      });
    };
  }
  function chownFixSync(orig) {
    if (!orig)
      return orig;
    return function(target, uid, gid) {
      try {
        return orig.call(fs2, target, uid, gid);
      } catch (er) {
        if (!chownErOk(er))
          throw er;
      }
    };
  }
  function statFix(orig) {
    if (!orig)
      return orig;
    return function(target, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      function callback(er, stats) {
        if (stats) {
          if (stats.uid < 0)
            stats.uid += 4294967296;
          if (stats.gid < 0)
            stats.gid += 4294967296;
        }
        if (cb)
          cb.apply(this, arguments);
      }
      return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
    };
  }
  function statFixSync(orig) {
    if (!orig)
      return orig;
    return function(target, options) {
      var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
      if (stats) {
        if (stats.uid < 0)
          stats.uid += 4294967296;
        if (stats.gid < 0)
          stats.gid += 4294967296;
      }
      return stats;
    };
  }
  function chownErOk(er) {
    if (!er)
      return true;
    if (er.code === "ENOSYS")
      return true;
    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true;
    }
    return false;
  }
}
var Stream = require$$0__default$1["default"].Stream;
var legacyStreams = legacy$1;
function legacy$1(fs2) {
  return {
    ReadStream,
    WriteStream
  };
  function ReadStream(path2, options) {
    if (!(this instanceof ReadStream))
      return new ReadStream(path2, options);
    Stream.call(this);
    var self2 = this;
    this.path = path2;
    this.fd = null;
    this.readable = true;
    this.paused = false;
    this.flags = "r";
    this.mode = 438;
    this.bufferSize = 64 * 1024;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.encoding)
      this.setEncoding(this.encoding);
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.end === void 0) {
        this.end = Infinity;
      } else if ("number" !== typeof this.end) {
        throw TypeError("end must be a Number");
      }
      if (this.start > this.end) {
        throw new Error("start must be <= end");
      }
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        self2._read();
      });
      return;
    }
    fs2.open(this.path, this.flags, this.mode, function(err, fd) {
      if (err) {
        self2.emit("error", err);
        self2.readable = false;
        return;
      }
      self2.fd = fd;
      self2.emit("open", fd);
      self2._read();
    });
  }
  function WriteStream(path2, options) {
    if (!(this instanceof WriteStream))
      return new WriteStream(path2, options);
    Stream.call(this);
    this.path = path2;
    this.fd = null;
    this.writable = true;
    this.flags = "w";
    this.encoding = "binary";
    this.mode = 438;
    this.bytesWritten = 0;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.start < 0) {
        throw new Error("start must be >= zero");
      }
      this.pos = this.start;
    }
    this.busy = false;
    this._queue = [];
    if (this.fd === null) {
      this._open = fs2.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
      this.flush();
    }
  }
}
var clone_1 = clone$1;
var getPrototypeOf = Object.getPrototypeOf || function(obj) {
  return obj.__proto__;
};
function clone$1(obj) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (obj instanceof Object)
    var copy2 = { __proto__: getPrototypeOf(obj) };
  else
    var copy2 = /* @__PURE__ */ Object.create(null);
  Object.getOwnPropertyNames(obj).forEach(function(key) {
    Object.defineProperty(copy2, key, Object.getOwnPropertyDescriptor(obj, key));
  });
  return copy2;
}
var fs$m = require$$0__default$2["default"];
var polyfills = polyfills$1;
var legacy = legacyStreams;
var clone = clone_1;
var util$1 = require$$2__default["default"];
var gracefulQueue;
var previousSymbol;
if (typeof Symbol === "function" && typeof Symbol.for === "function") {
  gracefulQueue = Symbol.for("graceful-fs.queue");
  previousSymbol = Symbol.for("graceful-fs.previous");
} else {
  gracefulQueue = "___graceful-fs.queue";
  previousSymbol = "___graceful-fs.previous";
}
function noop() {
}
function publishQueue(context, queue2) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue2;
    }
  });
}
var debug = noop;
if (util$1.debuglog)
  debug = util$1.debuglog("gfs4");
else if (/\bgfs4\b/i.test({}.NODE_DEBUG || ""))
  debug = function() {
    var m = util$1.format.apply(util$1, arguments);
    m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
    console.error(m);
  };
if (!fs$m[gracefulQueue]) {
  var queue = commonjsGlobal[gracefulQueue] || [];
  publishQueue(fs$m, queue);
  fs$m.close = function(fs$close) {
    function close2(fd, cb) {
      return fs$close.call(fs$m, fd, function(err) {
        if (!err) {
          resetQueue();
        }
        if (typeof cb === "function")
          cb.apply(this, arguments);
      });
    }
    Object.defineProperty(close2, previousSymbol, {
      value: fs$close
    });
    return close2;
  }(fs$m.close);
  fs$m.closeSync = function(fs$closeSync) {
    function closeSync(fd) {
      fs$closeSync.apply(fs$m, arguments);
      resetQueue();
    }
    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync;
  }(fs$m.closeSync);
  if (/\bgfs4\b/i.test({}.NODE_DEBUG || "")) {
    process.on("exit", function() {
      debug(fs$m[gracefulQueue]);
      require$$5__default["default"].equal(fs$m[gracefulQueue].length, 0);
    });
  }
}
if (!commonjsGlobal[gracefulQueue]) {
  publishQueue(commonjsGlobal, fs$m[gracefulQueue]);
}
var gracefulFs = patch(clone(fs$m));
if ({}.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$m.__patched) {
  gracefulFs = patch(fs$m);
  fs$m.__patched = true;
}
function patch(fs2) {
  polyfills(fs2);
  fs2.gracefulify = patch;
  fs2.createReadStream = createReadStream;
  fs2.createWriteStream = createWriteStream;
  var fs$readFile = fs2.readFile;
  fs2.readFile = readFile2;
  function readFile2(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$readFile(path2, options, cb);
    function go$readFile(path3, options2, cb2, startTime) {
      return fs$readFile(path3, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$readFile, [path3, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$writeFile = fs2.writeFile;
  fs2.writeFile = writeFile2;
  function writeFile2(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$writeFile(path2, data, options, cb);
    function go$writeFile(path3, data2, options2, cb2, startTime) {
      return fs$writeFile(path3, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$writeFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$appendFile = fs2.appendFile;
  if (fs$appendFile)
    fs2.appendFile = appendFile;
  function appendFile(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$appendFile(path2, data, options, cb);
    function go$appendFile(path3, data2, options2, cb2, startTime) {
      return fs$appendFile(path3, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$appendFile, [path3, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$copyFile = fs2.copyFile;
  if (fs$copyFile)
    fs2.copyFile = copyFile2;
  function copyFile2(src, dest, flags, cb) {
    if (typeof flags === "function") {
      cb = flags;
      flags = 0;
    }
    return go$copyFile(src, dest, flags, cb);
    function go$copyFile(src2, dest2, flags2, cb2, startTime) {
      return fs$copyFile(src2, dest2, flags2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$readdir = fs2.readdir;
  fs2.readdir = readdir2;
  var noReaddirOptionVersions = /^v[0-5]\./;
  function readdir2(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path3, options2, cb2, startTime) {
      return fs$readdir(path3, fs$readdirCallback(
        path3,
        options2,
        cb2,
        startTime
      ));
    } : function go$readdir2(path3, options2, cb2, startTime) {
      return fs$readdir(path3, options2, fs$readdirCallback(
        path3,
        options2,
        cb2,
        startTime
      ));
    };
    return go$readdir(path2, options, cb);
    function fs$readdirCallback(path3, options2, cb2, startTime) {
      return function(err, files) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([
            go$readdir,
            [path3, options2, cb2],
            err,
            startTime || Date.now(),
            Date.now()
          ]);
        else {
          if (files && files.sort)
            files.sort();
          if (typeof cb2 === "function")
            cb2.call(this, err, files);
        }
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var legStreams = legacy(fs2);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }
  var fs$ReadStream = fs2.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }
  var fs$WriteStream = fs2.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }
  Object.defineProperty(fs2, "ReadStream", {
    get: function() {
      return ReadStream;
    },
    set: function(val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs2, "WriteStream", {
    get: function() {
      return WriteStream;
    },
    set: function(val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileReadStream = ReadStream;
  Object.defineProperty(fs2, "FileReadStream", {
    get: function() {
      return FileReadStream;
    },
    set: function(val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs2, "FileWriteStream", {
    get: function() {
      return FileWriteStream;
    },
    set: function(val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  function ReadStream(path2, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this;
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
  }
  function ReadStream$open() {
    var that = this;
    open2(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
        that.read();
      }
    });
  }
  function WriteStream(path2, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this;
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
  }
  function WriteStream$open() {
    var that = this;
    open2(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
      }
    });
  }
  function createReadStream(path2, options) {
    return new fs2.ReadStream(path2, options);
  }
  function createWriteStream(path2, options) {
    return new fs2.WriteStream(path2, options);
  }
  var fs$open = fs2.open;
  fs2.open = open2;
  function open2(path2, flags, mode, cb) {
    if (typeof mode === "function")
      cb = mode, mode = null;
    return go$open(path2, flags, mode, cb);
    function go$open(path3, flags2, mode2, cb2, startTime) {
      return fs$open(path3, flags2, mode2, function(err, fd) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$open, [path3, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  return fs2;
}
function enqueue(elem) {
  debug("ENQUEUE", elem[0].name, elem[1]);
  fs$m[gracefulQueue].push(elem);
  retry();
}
var retryTimer;
function resetQueue() {
  var now = Date.now();
  for (var i = 0; i < fs$m[gracefulQueue].length; ++i) {
    if (fs$m[gracefulQueue][i].length > 2) {
      fs$m[gracefulQueue][i][3] = now;
      fs$m[gracefulQueue][i][4] = now;
    }
  }
  retry();
}
function retry() {
  clearTimeout(retryTimer);
  retryTimer = void 0;
  if (fs$m[gracefulQueue].length === 0)
    return;
  var elem = fs$m[gracefulQueue].shift();
  var fn = elem[0];
  var args = elem[1];
  var err = elem[2];
  var startTime = elem[3];
  var lastTime = elem[4];
  if (startTime === void 0) {
    debug("RETRY", fn.name, args);
    fn.apply(null, args);
  } else if (Date.now() - startTime >= 6e4) {
    debug("TIMEOUT", fn.name, args);
    var cb = args.pop();
    if (typeof cb === "function")
      cb.call(null, err);
  } else {
    var sinceAttempt = Date.now() - lastTime;
    var sinceStart = Math.max(lastTime - startTime, 1);
    var desiredDelay = Math.min(sinceStart * 1.2, 100);
    if (sinceAttempt >= desiredDelay) {
      debug("RETRY", fn.name, args);
      fn.apply(null, args.concat([startTime]));
    } else {
      fs$m[gracefulQueue].push(elem);
    }
  }
  if (retryTimer === void 0) {
    retryTimer = setTimeout(retry, 0);
  }
}
(function(exports) {
  const u2 = universalify.fromCallback;
  const fs2 = gracefulFs;
  const api = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchown",
    "lchmod",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "readFile",
    "readdir",
    "readlink",
    "realpath",
    "rename",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((key) => {
    return typeof fs2[key] === "function";
  });
  Object.keys(fs2).forEach((key) => {
    if (key === "promises") {
      return;
    }
    exports[key] = fs2[key];
  });
  api.forEach((method) => {
    exports[method] = u2(fs2[method]);
  });
  exports.exists = function(filename, callback) {
    if (typeof callback === "function") {
      return fs2.exists(filename, callback);
    }
    return new Promise((resolve) => {
      return fs2.exists(filename, resolve);
    });
  };
  exports.read = function(fd, buffer2, offset, length, position, callback) {
    if (typeof callback === "function") {
      return fs2.read(fd, buffer2, offset, length, position, callback);
    }
    return new Promise((resolve, reject) => {
      fs2.read(fd, buffer2, offset, length, position, (err, bytesRead, buffer3) => {
        if (err)
          return reject(err);
        resolve({ bytesRead, buffer: buffer3 });
      });
    });
  };
  exports.write = function(fd, buffer2, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.write(fd, buffer2, ...args);
    }
    return new Promise((resolve, reject) => {
      fs2.write(fd, buffer2, ...args, (err, bytesWritten, buffer3) => {
        if (err)
          return reject(err);
        resolve({ bytesWritten, buffer: buffer3 });
      });
    });
  };
  if (typeof fs2.realpath.native === "function") {
    exports.realpath.native = u2(fs2.realpath.native);
  }
})(fs$n);
const path$k = require$$1__default["default"];
function getRootPath(p) {
  p = path$k.normalize(path$k.resolve(p)).split(path$k.sep);
  if (p.length > 0)
    return p[0];
  return null;
}
const INVALID_PATH_CHARS = /[<>:"|?*]/;
function invalidWin32Path$2(p) {
  const rp = getRootPath(p);
  p = p.replace(rp, "");
  return INVALID_PATH_CHARS.test(p);
}
var win32 = {
  getRootPath,
  invalidWin32Path: invalidWin32Path$2
};
const fs$l = gracefulFs;
const path$j = require$$1__default["default"];
const invalidWin32Path$1 = win32.invalidWin32Path;
const o777$1 = parseInt("0777", 8);
function mkdirs$2(p, opts, callback, made) {
  if (typeof opts === "function") {
    callback = opts;
    opts = {};
  } else if (!opts || typeof opts !== "object") {
    opts = { mode: opts };
  }
  if (process.platform === "win32" && invalidWin32Path$1(p)) {
    const errInval = new Error(p + " contains invalid WIN32 path characters.");
    errInval.code = "EINVAL";
    return callback(errInval);
  }
  let mode = opts.mode;
  const xfs = opts.fs || fs$l;
  if (mode === void 0) {
    mode = o777$1 & ~process.umask();
  }
  if (!made)
    made = null;
  callback = callback || function() {
  };
  p = path$j.resolve(p);
  xfs.mkdir(p, mode, (er) => {
    if (!er) {
      made = made || p;
      return callback(null, made);
    }
    switch (er.code) {
      case "ENOENT":
        if (path$j.dirname(p) === p)
          return callback(er);
        mkdirs$2(path$j.dirname(p), opts, (er2, made2) => {
          if (er2)
            callback(er2, made2);
          else
            mkdirs$2(p, opts, callback, made2);
        });
        break;
      default:
        xfs.stat(p, (er2, stat2) => {
          if (er2 || !stat2.isDirectory())
            callback(er, made);
          else
            callback(null, made);
        });
        break;
    }
  });
}
var mkdirs_1$1 = mkdirs$2;
const fs$k = gracefulFs;
const path$i = require$$1__default["default"];
const invalidWin32Path = win32.invalidWin32Path;
const o777 = parseInt("0777", 8);
function mkdirsSync$2(p, opts, made) {
  if (!opts || typeof opts !== "object") {
    opts = { mode: opts };
  }
  let mode = opts.mode;
  const xfs = opts.fs || fs$k;
  if (process.platform === "win32" && invalidWin32Path(p)) {
    const errInval = new Error(p + " contains invalid WIN32 path characters.");
    errInval.code = "EINVAL";
    throw errInval;
  }
  if (mode === void 0) {
    mode = o777 & ~process.umask();
  }
  if (!made)
    made = null;
  p = path$i.resolve(p);
  try {
    xfs.mkdirSync(p, mode);
    made = made || p;
  } catch (err0) {
    if (err0.code === "ENOENT") {
      if (path$i.dirname(p) === p)
        throw err0;
      made = mkdirsSync$2(path$i.dirname(p), opts, made);
      mkdirsSync$2(p, opts, made);
    } else {
      let stat2;
      try {
        stat2 = xfs.statSync(p);
      } catch (err1) {
        throw err0;
      }
      if (!stat2.isDirectory())
        throw err0;
    }
  }
  return made;
}
var mkdirsSync_1 = mkdirsSync$2;
const u$b = universalify.fromCallback;
const mkdirs$1 = u$b(mkdirs_1$1);
const mkdirsSync$1 = mkdirsSync_1;
var mkdirs_1 = {
  mkdirs: mkdirs$1,
  mkdirsSync: mkdirsSync$1,
  mkdirp: mkdirs$1,
  mkdirpSync: mkdirsSync$1,
  ensureDir: mkdirs$1,
  ensureDirSync: mkdirsSync$1
};
const fs$j = gracefulFs;
const os = require$$1__default$1["default"];
const path$h = require$$1__default["default"];
function hasMillisResSync() {
  let tmpfile = path$h.join("millis-test-sync" + Date.now().toString() + Math.random().toString().slice(2));
  tmpfile = path$h.join(os.tmpdir(), tmpfile);
  const d = new Date(1435410243862);
  fs$j.writeFileSync(tmpfile, "https://github.com/jprichardson/node-fs-extra/pull/141");
  const fd = fs$j.openSync(tmpfile, "r+");
  fs$j.futimesSync(fd, d, d);
  fs$j.closeSync(fd);
  return fs$j.statSync(tmpfile).mtime > 1435410243e3;
}
function hasMillisRes(callback) {
  let tmpfile = path$h.join("millis-test" + Date.now().toString() + Math.random().toString().slice(2));
  tmpfile = path$h.join(os.tmpdir(), tmpfile);
  const d = new Date(1435410243862);
  fs$j.writeFile(tmpfile, "https://github.com/jprichardson/node-fs-extra/pull/141", (err) => {
    if (err)
      return callback(err);
    fs$j.open(tmpfile, "r+", (err2, fd) => {
      if (err2)
        return callback(err2);
      fs$j.futimes(fd, d, d, (err3) => {
        if (err3)
          return callback(err3);
        fs$j.close(fd, (err4) => {
          if (err4)
            return callback(err4);
          fs$j.stat(tmpfile, (err5, stats) => {
            if (err5)
              return callback(err5);
            callback(null, stats.mtime > 1435410243e3);
          });
        });
      });
    });
  });
}
function timeRemoveMillis(timestamp) {
  if (typeof timestamp === "number") {
    return Math.floor(timestamp / 1e3) * 1e3;
  } else if (timestamp instanceof Date) {
    return new Date(Math.floor(timestamp.getTime() / 1e3) * 1e3);
  } else {
    throw new Error("fs-extra: timeRemoveMillis() unknown parameter type");
  }
}
function utimesMillis(path2, atime, mtime, callback) {
  fs$j.open(path2, "r+", (err, fd) => {
    if (err)
      return callback(err);
    fs$j.futimes(fd, atime, mtime, (futimesErr) => {
      fs$j.close(fd, (closeErr) => {
        if (callback)
          callback(futimesErr || closeErr);
      });
    });
  });
}
function utimesMillisSync(path2, atime, mtime) {
  const fd = fs$j.openSync(path2, "r+");
  fs$j.futimesSync(fd, atime, mtime);
  return fs$j.closeSync(fd);
}
var utimes$1 = {
  hasMillisRes,
  hasMillisResSync,
  timeRemoveMillis,
  utimesMillis,
  utimesMillisSync
};
const fs$i = gracefulFs;
const path$g = require$$1__default["default"];
const NODE_VERSION_MAJOR_WITH_BIGINT = 10;
const NODE_VERSION_MINOR_WITH_BIGINT = 5;
const NODE_VERSION_PATCH_WITH_BIGINT = 0;
const nodeVersion = process.versions.node.split(".");
const nodeVersionMajor = Number.parseInt(nodeVersion[0], 10);
const nodeVersionMinor = Number.parseInt(nodeVersion[1], 10);
const nodeVersionPatch = Number.parseInt(nodeVersion[2], 10);
function nodeSupportsBigInt() {
  if (nodeVersionMajor > NODE_VERSION_MAJOR_WITH_BIGINT) {
    return true;
  } else if (nodeVersionMajor === NODE_VERSION_MAJOR_WITH_BIGINT) {
    if (nodeVersionMinor > NODE_VERSION_MINOR_WITH_BIGINT) {
      return true;
    } else if (nodeVersionMinor === NODE_VERSION_MINOR_WITH_BIGINT) {
      if (nodeVersionPatch >= NODE_VERSION_PATCH_WITH_BIGINT) {
        return true;
      }
    }
  }
  return false;
}
function getStats$2(src, dest, cb) {
  if (nodeSupportsBigInt()) {
    fs$i.stat(src, { bigint: true }, (err, srcStat) => {
      if (err)
        return cb(err);
      fs$i.stat(dest, { bigint: true }, (err2, destStat) => {
        if (err2) {
          if (err2.code === "ENOENT")
            return cb(null, { srcStat, destStat: null });
          return cb(err2);
        }
        return cb(null, { srcStat, destStat });
      });
    });
  } else {
    fs$i.stat(src, (err, srcStat) => {
      if (err)
        return cb(err);
      fs$i.stat(dest, (err2, destStat) => {
        if (err2) {
          if (err2.code === "ENOENT")
            return cb(null, { srcStat, destStat: null });
          return cb(err2);
        }
        return cb(null, { srcStat, destStat });
      });
    });
  }
}
function getStatsSync(src, dest) {
  let srcStat, destStat;
  if (nodeSupportsBigInt()) {
    srcStat = fs$i.statSync(src, { bigint: true });
  } else {
    srcStat = fs$i.statSync(src);
  }
  try {
    if (nodeSupportsBigInt()) {
      destStat = fs$i.statSync(dest, { bigint: true });
    } else {
      destStat = fs$i.statSync(dest);
    }
  } catch (err) {
    if (err.code === "ENOENT")
      return { srcStat, destStat: null };
    throw err;
  }
  return { srcStat, destStat };
}
function checkPaths(src, dest, funcName, cb) {
  getStats$2(src, dest, (err, stats) => {
    if (err)
      return cb(err);
    const { srcStat, destStat } = stats;
    if (destStat && destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
      return cb(new Error("Source and destination must not be the same."));
    }
    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      return cb(new Error(errMsg(src, dest, funcName)));
    }
    return cb(null, { srcStat, destStat });
  });
}
function checkPathsSync(src, dest, funcName) {
  const { srcStat, destStat } = getStatsSync(src, dest);
  if (destStat && destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
    throw new Error("Source and destination must not be the same.");
  }
  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return { srcStat, destStat };
}
function checkParentPaths(src, srcStat, dest, funcName, cb) {
  const srcParent = path$g.resolve(path$g.dirname(src));
  const destParent = path$g.resolve(path$g.dirname(dest));
  if (destParent === srcParent || destParent === path$g.parse(destParent).root)
    return cb();
  if (nodeSupportsBigInt()) {
    fs$i.stat(destParent, { bigint: true }, (err, destStat) => {
      if (err) {
        if (err.code === "ENOENT")
          return cb();
        return cb(err);
      }
      if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
        return cb(new Error(errMsg(src, dest, funcName)));
      }
      return checkParentPaths(src, srcStat, destParent, funcName, cb);
    });
  } else {
    fs$i.stat(destParent, (err, destStat) => {
      if (err) {
        if (err.code === "ENOENT")
          return cb();
        return cb(err);
      }
      if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
        return cb(new Error(errMsg(src, dest, funcName)));
      }
      return checkParentPaths(src, srcStat, destParent, funcName, cb);
    });
  }
}
function checkParentPathsSync(src, srcStat, dest, funcName) {
  const srcParent = path$g.resolve(path$g.dirname(src));
  const destParent = path$g.resolve(path$g.dirname(dest));
  if (destParent === srcParent || destParent === path$g.parse(destParent).root)
    return;
  let destStat;
  try {
    if (nodeSupportsBigInt()) {
      destStat = fs$i.statSync(destParent, { bigint: true });
    } else {
      destStat = fs$i.statSync(destParent);
    }
  } catch (err) {
    if (err.code === "ENOENT")
      return;
    throw err;
  }
  if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return checkParentPathsSync(src, srcStat, destParent, funcName);
}
function isSrcSubdir(src, dest) {
  const srcArr = path$g.resolve(src).split(path$g.sep).filter((i) => i);
  const destArr = path$g.resolve(dest).split(path$g.sep).filter((i) => i);
  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
}
function errMsg(src, dest, funcName) {
  return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
}
var stat$8 = {
  checkPaths,
  checkPathsSync,
  checkParentPaths,
  checkParentPathsSync,
  isSrcSubdir
};
var buffer = function(size) {
  if (typeof Buffer.allocUnsafe === "function") {
    try {
      return Buffer.allocUnsafe(size);
    } catch (e) {
      return new Buffer(size);
    }
  }
  return new Buffer(size);
};
const fs$h = gracefulFs;
const path$f = require$$1__default["default"];
const mkdirpSync$1 = mkdirs_1.mkdirsSync;
const utimesSync = utimes$1.utimesMillisSync;
const stat$7 = stat$8;
function copySync$2(src, dest, opts) {
  if (typeof opts === "function") {
    opts = { filter: opts };
  }
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }
  const { srcStat, destStat } = stat$7.checkPathsSync(src, dest, "copy");
  stat$7.checkParentPathsSync(src, srcStat, dest, "copy");
  return handleFilterAndCopy(destStat, src, dest, opts);
}
function handleFilterAndCopy(destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest))
    return;
  const destParent = path$f.dirname(dest);
  if (!fs$h.existsSync(destParent))
    mkdirpSync$1(destParent);
  return startCopy$1(destStat, src, dest, opts);
}
function startCopy$1(destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest))
    return;
  return getStats$1(destStat, src, dest, opts);
}
function getStats$1(destStat, src, dest, opts) {
  const statSync = opts.dereference ? fs$h.statSync : fs$h.lstatSync;
  const srcStat = statSync(src);
  if (srcStat.isDirectory())
    return onDir$1(srcStat, destStat, src, dest, opts);
  else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
    return onFile$1(srcStat, destStat, src, dest, opts);
  else if (srcStat.isSymbolicLink())
    return onLink$1(destStat, src, dest, opts);
}
function onFile$1(srcStat, destStat, src, dest, opts) {
  if (!destStat)
    return copyFile$1(srcStat, src, dest, opts);
  return mayCopyFile$1(srcStat, src, dest, opts);
}
function mayCopyFile$1(srcStat, src, dest, opts) {
  if (opts.overwrite) {
    fs$h.unlinkSync(dest);
    return copyFile$1(srcStat, src, dest, opts);
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}
function copyFile$1(srcStat, src, dest, opts) {
  if (typeof fs$h.copyFileSync === "function") {
    fs$h.copyFileSync(src, dest);
    fs$h.chmodSync(dest, srcStat.mode);
    if (opts.preserveTimestamps) {
      return utimesSync(dest, srcStat.atime, srcStat.mtime);
    }
    return;
  }
  return copyFileFallback$1(srcStat, src, dest, opts);
}
function copyFileFallback$1(srcStat, src, dest, opts) {
  const BUF_LENGTH = 64 * 1024;
  const _buff = buffer(BUF_LENGTH);
  const fdr = fs$h.openSync(src, "r");
  const fdw = fs$h.openSync(dest, "w", srcStat.mode);
  let pos = 0;
  while (pos < srcStat.size) {
    const bytesRead = fs$h.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
    fs$h.writeSync(fdw, _buff, 0, bytesRead);
    pos += bytesRead;
  }
  if (opts.preserveTimestamps)
    fs$h.futimesSync(fdw, srcStat.atime, srcStat.mtime);
  fs$h.closeSync(fdr);
  fs$h.closeSync(fdw);
}
function onDir$1(srcStat, destStat, src, dest, opts) {
  if (!destStat)
    return mkDirAndCopy$1(srcStat, src, dest, opts);
  if (destStat && !destStat.isDirectory()) {
    throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
  }
  return copyDir$1(src, dest, opts);
}
function mkDirAndCopy$1(srcStat, src, dest, opts) {
  fs$h.mkdirSync(dest);
  copyDir$1(src, dest, opts);
  return fs$h.chmodSync(dest, srcStat.mode);
}
function copyDir$1(src, dest, opts) {
  fs$h.readdirSync(src).forEach((item) => copyDirItem$1(item, src, dest, opts));
}
function copyDirItem$1(item, src, dest, opts) {
  const srcItem = path$f.join(src, item);
  const destItem = path$f.join(dest, item);
  const { destStat } = stat$7.checkPathsSync(srcItem, destItem, "copy");
  return startCopy$1(destStat, srcItem, destItem, opts);
}
function onLink$1(destStat, src, dest, opts) {
  let resolvedSrc = fs$h.readlinkSync(src);
  if (opts.dereference) {
    resolvedSrc = path$f.resolve(process.cwd(), resolvedSrc);
  }
  if (!destStat) {
    return fs$h.symlinkSync(resolvedSrc, dest);
  } else {
    let resolvedDest;
    try {
      resolvedDest = fs$h.readlinkSync(dest);
    } catch (err) {
      if (err.code === "EINVAL" || err.code === "UNKNOWN")
        return fs$h.symlinkSync(resolvedSrc, dest);
      throw err;
    }
    if (opts.dereference) {
      resolvedDest = path$f.resolve(process.cwd(), resolvedDest);
    }
    if (stat$7.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
    }
    if (fs$h.statSync(dest).isDirectory() && stat$7.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
    }
    return copyLink$1(resolvedSrc, dest);
  }
}
function copyLink$1(resolvedSrc, dest) {
  fs$h.unlinkSync(dest);
  return fs$h.symlinkSync(resolvedSrc, dest);
}
var copySync_1 = copySync$2;
var copySync$1 = {
  copySync: copySync_1
};
const u$a = universalify.fromPromise;
const fs$g = fs$n;
function pathExists$8(path2) {
  return fs$g.access(path2).then(() => true).catch(() => false);
}
var pathExists_1 = {
  pathExists: u$a(pathExists$8),
  pathExistsSync: fs$g.existsSync
};
const fs$f = gracefulFs;
const path$e = require$$1__default["default"];
const mkdirp$1 = mkdirs_1.mkdirs;
const pathExists$7 = pathExists_1.pathExists;
const utimes = utimes$1.utimesMillis;
const stat$6 = stat$8;
function copy$2(src, dest, opts, cb) {
  if (typeof opts === "function" && !cb) {
    cb = opts;
    opts = {};
  } else if (typeof opts === "function") {
    opts = { filter: opts };
  }
  cb = cb || function() {
  };
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }
  stat$6.checkPaths(src, dest, "copy", (err, stats) => {
    if (err)
      return cb(err);
    const { srcStat, destStat } = stats;
    stat$6.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
      if (err2)
        return cb(err2);
      if (opts.filter)
        return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
      return checkParentDir(destStat, src, dest, opts, cb);
    });
  });
}
function checkParentDir(destStat, src, dest, opts, cb) {
  const destParent = path$e.dirname(dest);
  pathExists$7(destParent, (err, dirExists) => {
    if (err)
      return cb(err);
    if (dirExists)
      return startCopy(destStat, src, dest, opts, cb);
    mkdirp$1(destParent, (err2) => {
      if (err2)
        return cb(err2);
      return startCopy(destStat, src, dest, opts, cb);
    });
  });
}
function handleFilter(onInclude, destStat, src, dest, opts, cb) {
  Promise.resolve(opts.filter(src, dest)).then((include) => {
    if (include)
      return onInclude(destStat, src, dest, opts, cb);
    return cb();
  }, (error) => cb(error));
}
function startCopy(destStat, src, dest, opts, cb) {
  if (opts.filter)
    return handleFilter(getStats, destStat, src, dest, opts, cb);
  return getStats(destStat, src, dest, opts, cb);
}
function getStats(destStat, src, dest, opts, cb) {
  const stat2 = opts.dereference ? fs$f.stat : fs$f.lstat;
  stat2(src, (err, srcStat) => {
    if (err)
      return cb(err);
    if (srcStat.isDirectory())
      return onDir(srcStat, destStat, src, dest, opts, cb);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
      return onFile(srcStat, destStat, src, dest, opts, cb);
    else if (srcStat.isSymbolicLink())
      return onLink(destStat, src, dest, opts, cb);
  });
}
function onFile(srcStat, destStat, src, dest, opts, cb) {
  if (!destStat)
    return copyFile(srcStat, src, dest, opts, cb);
  return mayCopyFile(srcStat, src, dest, opts, cb);
}
function mayCopyFile(srcStat, src, dest, opts, cb) {
  if (opts.overwrite) {
    fs$f.unlink(dest, (err) => {
      if (err)
        return cb(err);
      return copyFile(srcStat, src, dest, opts, cb);
    });
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`));
  } else
    return cb();
}
function copyFile(srcStat, src, dest, opts, cb) {
  if (typeof fs$f.copyFile === "function") {
    return fs$f.copyFile(src, dest, (err) => {
      if (err)
        return cb(err);
      return setDestModeAndTimestamps(srcStat, dest, opts, cb);
    });
  }
  return copyFileFallback(srcStat, src, dest, opts, cb);
}
function copyFileFallback(srcStat, src, dest, opts, cb) {
  const rs = fs$f.createReadStream(src);
  rs.on("error", (err) => cb(err)).once("open", () => {
    const ws = fs$f.createWriteStream(dest, { mode: srcStat.mode });
    ws.on("error", (err) => cb(err)).on("open", () => rs.pipe(ws)).once("close", () => setDestModeAndTimestamps(srcStat, dest, opts, cb));
  });
}
function setDestModeAndTimestamps(srcStat, dest, opts, cb) {
  fs$f.chmod(dest, srcStat.mode, (err) => {
    if (err)
      return cb(err);
    if (opts.preserveTimestamps) {
      return utimes(dest, srcStat.atime, srcStat.mtime, cb);
    }
    return cb();
  });
}
function onDir(srcStat, destStat, src, dest, opts, cb) {
  if (!destStat)
    return mkDirAndCopy(srcStat, src, dest, opts, cb);
  if (destStat && !destStat.isDirectory()) {
    return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
  }
  return copyDir(src, dest, opts, cb);
}
function mkDirAndCopy(srcStat, src, dest, opts, cb) {
  fs$f.mkdir(dest, (err) => {
    if (err)
      return cb(err);
    copyDir(src, dest, opts, (err2) => {
      if (err2)
        return cb(err2);
      return fs$f.chmod(dest, srcStat.mode, cb);
    });
  });
}
function copyDir(src, dest, opts, cb) {
  fs$f.readdir(src, (err, items) => {
    if (err)
      return cb(err);
    return copyDirItems(items, src, dest, opts, cb);
  });
}
function copyDirItems(items, src, dest, opts, cb) {
  const item = items.pop();
  if (!item)
    return cb();
  return copyDirItem(items, item, src, dest, opts, cb);
}
function copyDirItem(items, item, src, dest, opts, cb) {
  const srcItem = path$e.join(src, item);
  const destItem = path$e.join(dest, item);
  stat$6.checkPaths(srcItem, destItem, "copy", (err, stats) => {
    if (err)
      return cb(err);
    const { destStat } = stats;
    startCopy(destStat, srcItem, destItem, opts, (err2) => {
      if (err2)
        return cb(err2);
      return copyDirItems(items, src, dest, opts, cb);
    });
  });
}
function onLink(destStat, src, dest, opts, cb) {
  fs$f.readlink(src, (err, resolvedSrc) => {
    if (err)
      return cb(err);
    if (opts.dereference) {
      resolvedSrc = path$e.resolve(process.cwd(), resolvedSrc);
    }
    if (!destStat) {
      return fs$f.symlink(resolvedSrc, dest, cb);
    } else {
      fs$f.readlink(dest, (err2, resolvedDest) => {
        if (err2) {
          if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
            return fs$f.symlink(resolvedSrc, dest, cb);
          return cb(err2);
        }
        if (opts.dereference) {
          resolvedDest = path$e.resolve(process.cwd(), resolvedDest);
        }
        if (stat$6.isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
        }
        if (destStat.isDirectory() && stat$6.isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
        }
        return copyLink(resolvedSrc, dest, cb);
      });
    }
  });
}
function copyLink(resolvedSrc, dest, cb) {
  fs$f.unlink(dest, (err) => {
    if (err)
      return cb(err);
    return fs$f.symlink(resolvedSrc, dest, cb);
  });
}
var copy_1 = copy$2;
const u$9 = universalify.fromCallback;
var copy$1 = {
  copy: u$9(copy_1)
};
const fs$e = gracefulFs;
const path$d = require$$1__default["default"];
const assert = require$$5__default["default"];
const isWindows$2 = process.platform === "win32";
function defaults(options) {
  const methods = [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ];
  methods.forEach((m) => {
    options[m] = options[m] || fs$e[m];
    m = m + "Sync";
    options[m] = options[m] || fs$e[m];
  });
  options.maxBusyTries = options.maxBusyTries || 3;
}
function rimraf$1(p, options, cb) {
  let busyTries = 0;
  if (typeof options === "function") {
    cb = options;
    options = {};
  }
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
  assert(options, "rimraf: invalid options argument provided");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  defaults(options);
  rimraf_(p, options, function CB(er) {
    if (er) {
      if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
        busyTries++;
        const time = busyTries * 100;
        return setTimeout(() => rimraf_(p, options, CB), time);
      }
      if (er.code === "ENOENT")
        er = null;
    }
    cb(er);
  });
}
function rimraf_(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.lstat(p, (er, st) => {
    if (er && er.code === "ENOENT") {
      return cb(null);
    }
    if (er && er.code === "EPERM" && isWindows$2) {
      return fixWinEPERM(p, options, er, cb);
    }
    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb);
    }
    options.unlink(p, (er2) => {
      if (er2) {
        if (er2.code === "ENOENT") {
          return cb(null);
        }
        if (er2.code === "EPERM") {
          return isWindows$2 ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
        }
        if (er2.code === "EISDIR") {
          return rmdir(p, options, er2, cb);
        }
      }
      return cb(er2);
    });
  });
}
function fixWinEPERM(p, options, er, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  if (er) {
    assert(er instanceof Error);
  }
  options.chmod(p, 438, (er2) => {
    if (er2) {
      cb(er2.code === "ENOENT" ? null : er);
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === "ENOENT" ? null : er);
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb);
        } else {
          options.unlink(p, cb);
        }
      });
    }
  });
}
function fixWinEPERMSync(p, options, er) {
  let stats;
  assert(p);
  assert(options);
  if (er) {
    assert(er instanceof Error);
  }
  try {
    options.chmodSync(p, 438);
  } catch (er2) {
    if (er2.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  try {
    stats = options.statSync(p);
  } catch (er3) {
    if (er3.code === "ENOENT") {
      return;
    } else {
      throw er;
    }
  }
  if (stats.isDirectory()) {
    rmdirSync(p, options, er);
  } else {
    options.unlinkSync(p);
  }
}
function rmdir(p, options, originalEr, cb) {
  assert(p);
  assert(options);
  if (originalEr) {
    assert(originalEr instanceof Error);
  }
  assert(typeof cb === "function");
  options.rmdir(p, (er) => {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
      rmkids(p, options, cb);
    } else if (er && er.code === "ENOTDIR") {
      cb(originalEr);
    } else {
      cb(er);
    }
  });
}
function rmkids(p, options, cb) {
  assert(p);
  assert(options);
  assert(typeof cb === "function");
  options.readdir(p, (er, files) => {
    if (er)
      return cb(er);
    let n = files.length;
    let errState;
    if (n === 0)
      return options.rmdir(p, cb);
    files.forEach((f) => {
      rimraf$1(path$d.join(p, f), options, (er2) => {
        if (errState) {
          return;
        }
        if (er2)
          return cb(errState = er2);
        if (--n === 0) {
          options.rmdir(p, cb);
        }
      });
    });
  });
}
function rimrafSync(p, options) {
  let st;
  options = options || {};
  defaults(options);
  assert(p, "rimraf: missing path");
  assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
  assert(options, "rimraf: missing options");
  assert.strictEqual(typeof options, "object", "rimraf: options should be object");
  try {
    st = options.lstatSync(p);
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    }
    if (er.code === "EPERM" && isWindows$2) {
      fixWinEPERMSync(p, options, er);
    }
  }
  try {
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null);
    } else {
      options.unlinkSync(p);
    }
  } catch (er) {
    if (er.code === "ENOENT") {
      return;
    } else if (er.code === "EPERM") {
      return isWindows$2 ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
    } else if (er.code !== "EISDIR") {
      throw er;
    }
    rmdirSync(p, options, er);
  }
}
function rmdirSync(p, options, originalEr) {
  assert(p);
  assert(options);
  if (originalEr) {
    assert(originalEr instanceof Error);
  }
  try {
    options.rmdirSync(p);
  } catch (er) {
    if (er.code === "ENOTDIR") {
      throw originalEr;
    } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
      rmkidsSync(p, options);
    } else if (er.code !== "ENOENT") {
      throw er;
    }
  }
}
function rmkidsSync(p, options) {
  assert(p);
  assert(options);
  options.readdirSync(p).forEach((f) => rimrafSync(path$d.join(p, f), options));
  if (isWindows$2) {
    const startTime = Date.now();
    do {
      try {
        const ret = options.rmdirSync(p, options);
        return ret;
      } catch (er) {
      }
    } while (Date.now() - startTime < 500);
  } else {
    const ret = options.rmdirSync(p, options);
    return ret;
  }
}
var rimraf_1 = rimraf$1;
rimraf$1.sync = rimrafSync;
const u$8 = universalify.fromCallback;
const rimraf = rimraf_1;
var remove$2 = {
  remove: u$8(rimraf),
  removeSync: rimraf.sync
};
const u$7 = universalify.fromCallback;
const fs$d = gracefulFs;
const path$c = require$$1__default["default"];
const mkdir$5 = mkdirs_1;
const remove$1 = remove$2;
const emptyDir = u$7(function emptyDir2(dir, callback) {
  callback = callback || function() {
  };
  fs$d.readdir(dir, (err, items) => {
    if (err)
      return mkdir$5.mkdirs(dir, callback);
    items = items.map((item) => path$c.join(dir, item));
    deleteItem();
    function deleteItem() {
      const item = items.pop();
      if (!item)
        return callback();
      remove$1.remove(item, (err2) => {
        if (err2)
          return callback(err2);
        deleteItem();
      });
    }
  });
});
function emptyDirSync(dir) {
  let items;
  try {
    items = fs$d.readdirSync(dir);
  } catch (err) {
    return mkdir$5.mkdirsSync(dir);
  }
  items.forEach((item) => {
    item = path$c.join(dir, item);
    remove$1.removeSync(item);
  });
}
var empty = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};
const u$6 = universalify.fromCallback;
const path$b = require$$1__default["default"];
const fs$c = gracefulFs;
const mkdir$4 = mkdirs_1;
const pathExists$6 = pathExists_1.pathExists;
function createFile(file2, callback) {
  function makeFile() {
    fs$c.writeFile(file2, "", (err) => {
      if (err)
        return callback(err);
      callback();
    });
  }
  fs$c.stat(file2, (err, stats) => {
    if (!err && stats.isFile())
      return callback();
    const dir = path$b.dirname(file2);
    pathExists$6(dir, (err2, dirExists) => {
      if (err2)
        return callback(err2);
      if (dirExists)
        return makeFile();
      mkdir$4.mkdirs(dir, (err3) => {
        if (err3)
          return callback(err3);
        makeFile();
      });
    });
  });
}
function createFileSync(file2) {
  let stats;
  try {
    stats = fs$c.statSync(file2);
  } catch (e) {
  }
  if (stats && stats.isFile())
    return;
  const dir = path$b.dirname(file2);
  if (!fs$c.existsSync(dir)) {
    mkdir$4.mkdirsSync(dir);
  }
  fs$c.writeFileSync(file2, "");
}
var file$1 = {
  createFile: u$6(createFile),
  createFileSync
};
const u$5 = universalify.fromCallback;
const path$a = require$$1__default["default"];
const fs$b = gracefulFs;
const mkdir$3 = mkdirs_1;
const pathExists$5 = pathExists_1.pathExists;
function createLink(srcpath, dstpath, callback) {
  function makeLink(srcpath2, dstpath2) {
    fs$b.link(srcpath2, dstpath2, (err) => {
      if (err)
        return callback(err);
      callback(null);
    });
  }
  pathExists$5(dstpath, (err, destinationExists) => {
    if (err)
      return callback(err);
    if (destinationExists)
      return callback(null);
    fs$b.lstat(srcpath, (err2) => {
      if (err2) {
        err2.message = err2.message.replace("lstat", "ensureLink");
        return callback(err2);
      }
      const dir = path$a.dirname(dstpath);
      pathExists$5(dir, (err3, dirExists) => {
        if (err3)
          return callback(err3);
        if (dirExists)
          return makeLink(srcpath, dstpath);
        mkdir$3.mkdirs(dir, (err4) => {
          if (err4)
            return callback(err4);
          makeLink(srcpath, dstpath);
        });
      });
    });
  });
}
function createLinkSync(srcpath, dstpath) {
  const destinationExists = fs$b.existsSync(dstpath);
  if (destinationExists)
    return void 0;
  try {
    fs$b.lstatSync(srcpath);
  } catch (err) {
    err.message = err.message.replace("lstat", "ensureLink");
    throw err;
  }
  const dir = path$a.dirname(dstpath);
  const dirExists = fs$b.existsSync(dir);
  if (dirExists)
    return fs$b.linkSync(srcpath, dstpath);
  mkdir$3.mkdirsSync(dir);
  return fs$b.linkSync(srcpath, dstpath);
}
var link$1 = {
  createLink: u$5(createLink),
  createLinkSync
};
const path$9 = require$$1__default["default"];
const fs$a = gracefulFs;
const pathExists$4 = pathExists_1.pathExists;
function symlinkPaths$1(srcpath, dstpath, callback) {
  if (path$9.isAbsolute(srcpath)) {
    return fs$a.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace("lstat", "ensureSymlink");
        return callback(err);
      }
      return callback(null, {
        "toCwd": srcpath,
        "toDst": srcpath
      });
    });
  } else {
    const dstdir = path$9.dirname(dstpath);
    const relativeToDst = path$9.join(dstdir, srcpath);
    return pathExists$4(relativeToDst, (err, exists) => {
      if (err)
        return callback(err);
      if (exists) {
        return callback(null, {
          "toCwd": relativeToDst,
          "toDst": srcpath
        });
      } else {
        return fs$a.lstat(srcpath, (err2) => {
          if (err2) {
            err2.message = err2.message.replace("lstat", "ensureSymlink");
            return callback(err2);
          }
          return callback(null, {
            "toCwd": srcpath,
            "toDst": path$9.relative(dstdir, srcpath)
          });
        });
      }
    });
  }
}
function symlinkPathsSync$1(srcpath, dstpath) {
  let exists;
  if (path$9.isAbsolute(srcpath)) {
    exists = fs$a.existsSync(srcpath);
    if (!exists)
      throw new Error("absolute srcpath does not exist");
    return {
      "toCwd": srcpath,
      "toDst": srcpath
    };
  } else {
    const dstdir = path$9.dirname(dstpath);
    const relativeToDst = path$9.join(dstdir, srcpath);
    exists = fs$a.existsSync(relativeToDst);
    if (exists) {
      return {
        "toCwd": relativeToDst,
        "toDst": srcpath
      };
    } else {
      exists = fs$a.existsSync(srcpath);
      if (!exists)
        throw new Error("relative srcpath does not exist");
      return {
        "toCwd": srcpath,
        "toDst": path$9.relative(dstdir, srcpath)
      };
    }
  }
}
var symlinkPaths_1 = {
  symlinkPaths: symlinkPaths$1,
  symlinkPathsSync: symlinkPathsSync$1
};
const fs$9 = gracefulFs;
function symlinkType$1(srcpath, type, callback) {
  callback = typeof type === "function" ? type : callback;
  type = typeof type === "function" ? false : type;
  if (type)
    return callback(null, type);
  fs$9.lstat(srcpath, (err, stats) => {
    if (err)
      return callback(null, "file");
    type = stats && stats.isDirectory() ? "dir" : "file";
    callback(null, type);
  });
}
function symlinkTypeSync$1(srcpath, type) {
  let stats;
  if (type)
    return type;
  try {
    stats = fs$9.lstatSync(srcpath);
  } catch (e) {
    return "file";
  }
  return stats && stats.isDirectory() ? "dir" : "file";
}
var symlinkType_1 = {
  symlinkType: symlinkType$1,
  symlinkTypeSync: symlinkTypeSync$1
};
const u$4 = universalify.fromCallback;
const path$8 = require$$1__default["default"];
const fs$8 = gracefulFs;
const _mkdirs = mkdirs_1;
const mkdirs = _mkdirs.mkdirs;
const mkdirsSync = _mkdirs.mkdirsSync;
const _symlinkPaths = symlinkPaths_1;
const symlinkPaths = _symlinkPaths.symlinkPaths;
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
const _symlinkType = symlinkType_1;
const symlinkType = _symlinkType.symlinkType;
const symlinkTypeSync = _symlinkType.symlinkTypeSync;
const pathExists$3 = pathExists_1.pathExists;
function createSymlink(srcpath, dstpath, type, callback) {
  callback = typeof type === "function" ? type : callback;
  type = typeof type === "function" ? false : type;
  pathExists$3(dstpath, (err, destinationExists) => {
    if (err)
      return callback(err);
    if (destinationExists)
      return callback(null);
    symlinkPaths(srcpath, dstpath, (err2, relative) => {
      if (err2)
        return callback(err2);
      srcpath = relative.toDst;
      symlinkType(relative.toCwd, type, (err3, type2) => {
        if (err3)
          return callback(err3);
        const dir = path$8.dirname(dstpath);
        pathExists$3(dir, (err4, dirExists) => {
          if (err4)
            return callback(err4);
          if (dirExists)
            return fs$8.symlink(srcpath, dstpath, type2, callback);
          mkdirs(dir, (err5) => {
            if (err5)
              return callback(err5);
            fs$8.symlink(srcpath, dstpath, type2, callback);
          });
        });
      });
    });
  });
}
function createSymlinkSync(srcpath, dstpath, type) {
  const destinationExists = fs$8.existsSync(dstpath);
  if (destinationExists)
    return void 0;
  const relative = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative.toDst;
  type = symlinkTypeSync(relative.toCwd, type);
  const dir = path$8.dirname(dstpath);
  const exists = fs$8.existsSync(dir);
  if (exists)
    return fs$8.symlinkSync(srcpath, dstpath, type);
  mkdirsSync(dir);
  return fs$8.symlinkSync(srcpath, dstpath, type);
}
var symlink$1 = {
  createSymlink: u$4(createSymlink),
  createSymlinkSync
};
const file = file$1;
const link = link$1;
const symlink = symlink$1;
var ensure = {
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
};
var _fs;
try {
  _fs = require("graceful-fs");
} catch (_) {
  _fs = require$$0__default$2["default"];
}
function readFile(file2, options, callback) {
  if (callback == null) {
    callback = options;
    options = {};
  }
  if (typeof options === "string") {
    options = { encoding: options };
  }
  options = options || {};
  var fs2 = options.fs || _fs;
  var shouldThrow = true;
  if ("throws" in options) {
    shouldThrow = options.throws;
  }
  fs2.readFile(file2, options, function(err, data) {
    if (err)
      return callback(err);
    data = stripBom(data);
    var obj;
    try {
      obj = JSON.parse(data, options ? options.reviver : null);
    } catch (err2) {
      if (shouldThrow) {
        err2.message = file2 + ": " + err2.message;
        return callback(err2);
      } else {
        return callback(null, null);
      }
    }
    callback(null, obj);
  });
}
function readFileSync(file2, options) {
  options = options || {};
  if (typeof options === "string") {
    options = { encoding: options };
  }
  var fs2 = options.fs || _fs;
  var shouldThrow = true;
  if ("throws" in options) {
    shouldThrow = options.throws;
  }
  try {
    var content = fs2.readFileSync(file2, options);
    content = stripBom(content);
    return JSON.parse(content, options.reviver);
  } catch (err) {
    if (shouldThrow) {
      err.message = file2 + ": " + err.message;
      throw err;
    } else {
      return null;
    }
  }
}
function stringify$6(obj, options) {
  var spaces;
  var EOL = "\n";
  if (typeof options === "object" && options !== null) {
    if (options.spaces) {
      spaces = options.spaces;
    }
    if (options.EOL) {
      EOL = options.EOL;
    }
  }
  var str = JSON.stringify(obj, options ? options.replacer : null, spaces);
  return str.replace(/\n/g, EOL) + EOL;
}
function writeFile(file2, obj, options, callback) {
  if (callback == null) {
    callback = options;
    options = {};
  }
  options = options || {};
  var fs2 = options.fs || _fs;
  var str = "";
  try {
    str = stringify$6(obj, options);
  } catch (err) {
    if (callback)
      callback(err, null);
    return;
  }
  fs2.writeFile(file2, str, options, callback);
}
function writeFileSync(file2, obj, options) {
  options = options || {};
  var fs2 = options.fs || _fs;
  var str = stringify$6(obj, options);
  return fs2.writeFileSync(file2, str, options);
}
function stripBom(content) {
  if (Buffer.isBuffer(content))
    content = content.toString("utf8");
  content = content.replace(/^\uFEFF/, "");
  return content;
}
var jsonfile$1 = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync
};
var jsonfile_1 = jsonfile$1;
const u$3 = universalify.fromCallback;
const jsonFile$3 = jsonfile_1;
var jsonfile = {
  readJson: u$3(jsonFile$3.readFile),
  readJsonSync: jsonFile$3.readFileSync,
  writeJson: u$3(jsonFile$3.writeFile),
  writeJsonSync: jsonFile$3.writeFileSync
};
const path$7 = require$$1__default["default"];
const mkdir$2 = mkdirs_1;
const pathExists$2 = pathExists_1.pathExists;
const jsonFile$2 = jsonfile;
function outputJson(file2, data, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  const dir = path$7.dirname(file2);
  pathExists$2(dir, (err, itDoes) => {
    if (err)
      return callback(err);
    if (itDoes)
      return jsonFile$2.writeJson(file2, data, options, callback);
    mkdir$2.mkdirs(dir, (err2) => {
      if (err2)
        return callback(err2);
      jsonFile$2.writeJson(file2, data, options, callback);
    });
  });
}
var outputJson_1 = outputJson;
const fs$7 = gracefulFs;
const path$6 = require$$1__default["default"];
const mkdir$1 = mkdirs_1;
const jsonFile$1 = jsonfile;
function outputJsonSync(file2, data, options) {
  const dir = path$6.dirname(file2);
  if (!fs$7.existsSync(dir)) {
    mkdir$1.mkdirsSync(dir);
  }
  jsonFile$1.writeJsonSync(file2, data, options);
}
var outputJsonSync_1 = outputJsonSync;
const u$2 = universalify.fromCallback;
const jsonFile = jsonfile;
jsonFile.outputJson = u$2(outputJson_1);
jsonFile.outputJsonSync = outputJsonSync_1;
jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;
var json = jsonFile;
const fs$6 = gracefulFs;
const path$5 = require$$1__default["default"];
const copySync = copySync$1.copySync;
const removeSync = remove$2.removeSync;
const mkdirpSync = mkdirs_1.mkdirpSync;
const stat$5 = stat$8;
function moveSync$1(src, dest, opts) {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  const { srcStat } = stat$5.checkPathsSync(src, dest, "move");
  stat$5.checkParentPathsSync(src, srcStat, dest, "move");
  mkdirpSync(path$5.dirname(dest));
  return doRename$1(src, dest, overwrite);
}
function doRename$1(src, dest, overwrite) {
  if (overwrite) {
    removeSync(dest);
    return rename$1(src, dest, overwrite);
  }
  if (fs$6.existsSync(dest))
    throw new Error("dest already exists.");
  return rename$1(src, dest, overwrite);
}
function rename$1(src, dest, overwrite) {
  try {
    fs$6.renameSync(src, dest);
  } catch (err) {
    if (err.code !== "EXDEV")
      throw err;
    return moveAcrossDevice$1(src, dest, overwrite);
  }
}
function moveAcrossDevice$1(src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copySync(src, dest, opts);
  return removeSync(src);
}
var moveSync_1 = moveSync$1;
var moveSync = {
  moveSync: moveSync_1
};
const fs$5 = gracefulFs;
const path$4 = require$$1__default["default"];
const copy = copy$1.copy;
const remove = remove$2.remove;
const mkdirp = mkdirs_1.mkdirp;
const pathExists$1 = pathExists_1.pathExists;
const stat$4 = stat$8;
function move$1(src, dest, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }
  const overwrite = opts.overwrite || opts.clobber || false;
  stat$4.checkPaths(src, dest, "move", (err, stats) => {
    if (err)
      return cb(err);
    const { srcStat } = stats;
    stat$4.checkParentPaths(src, srcStat, dest, "move", (err2) => {
      if (err2)
        return cb(err2);
      mkdirp(path$4.dirname(dest), (err3) => {
        if (err3)
          return cb(err3);
        return doRename(src, dest, overwrite, cb);
      });
    });
  });
}
function doRename(src, dest, overwrite, cb) {
  if (overwrite) {
    return remove(dest, (err) => {
      if (err)
        return cb(err);
      return rename(src, dest, overwrite, cb);
    });
  }
  pathExists$1(dest, (err, destExists) => {
    if (err)
      return cb(err);
    if (destExists)
      return cb(new Error("dest already exists."));
    return rename(src, dest, overwrite, cb);
  });
}
function rename(src, dest, overwrite, cb) {
  fs$5.rename(src, dest, (err) => {
    if (!err)
      return cb();
    if (err.code !== "EXDEV")
      return cb(err);
    return moveAcrossDevice(src, dest, overwrite, cb);
  });
}
function moveAcrossDevice(src, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  };
  copy(src, dest, opts, (err) => {
    if (err)
      return cb(err);
    return remove(src, cb);
  });
}
var move_1 = move$1;
const u$1 = universalify.fromCallback;
var move = {
  move: u$1(move_1)
};
const u = universalify.fromCallback;
const fs$4 = gracefulFs;
const path$3 = require$$1__default["default"];
const mkdir = mkdirs_1;
const pathExists = pathExists_1.pathExists;
function outputFile(file2, data, encoding, callback) {
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = "utf8";
  }
  const dir = path$3.dirname(file2);
  pathExists(dir, (err, itDoes) => {
    if (err)
      return callback(err);
    if (itDoes)
      return fs$4.writeFile(file2, data, encoding, callback);
    mkdir.mkdirs(dir, (err2) => {
      if (err2)
        return callback(err2);
      fs$4.writeFile(file2, data, encoding, callback);
    });
  });
}
function outputFileSync(file2, ...args) {
  const dir = path$3.dirname(file2);
  if (fs$4.existsSync(dir)) {
    return fs$4.writeFileSync(file2, ...args);
  }
  mkdir.mkdirsSync(dir);
  fs$4.writeFileSync(file2, ...args);
}
var output = {
  outputFile: u(outputFile),
  outputFileSync
};
(function(module) {
  module.exports = Object.assign(
    {},
    fs$n,
    copySync$1,
    copy$1,
    empty,
    ensure,
    json,
    mkdirs_1,
    moveSync,
    move,
    output,
    pathExists_1,
    remove$2
  );
  const fs2 = require$$0__default$2["default"];
  if (Object.getOwnPropertyDescriptor(fs2, "promises")) {
    Object.defineProperty(module.exports, "promises", {
      get() {
        return fs2.promises;
      }
    });
  }
})(lib);
var FSE = lib.exports;
var chokidar = {};
var utils$7 = {};
const path$2 = require$$1__default["default"];
const WIN_SLASH = "\\\\/";
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
const DOT_LITERAL = "\\.";
const PLUS_LITERAL = "\\+";
const QMARK_LITERAL = "\\?";
const SLASH_LITERAL = "\\/";
const ONE_CHAR = "(?=.)";
const QMARK = "[^/]";
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR$1 = `${QMARK}*?`;
const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR: STAR$1,
  START_ANCHOR
};
const WINDOWS_CHARS = {
  ...POSIX_CHARS,
  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};
const POSIX_REGEX_SOURCE$1 = {
  alnum: "a-zA-Z0-9",
  alpha: "a-zA-Z",
  ascii: "\\x00-\\x7F",
  blank: " \\t",
  cntrl: "\\x00-\\x1F\\x7F",
  digit: "0-9",
  graph: "\\x21-\\x7E",
  lower: "a-z",
  print: "\\x20-\\x7E ",
  punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
  space: " \\t\\r\\n\\v\\f",
  upper: "A-Z",
  word: "A-Za-z0-9_",
  xdigit: "A-Fa-f0-9"
};
var constants$4 = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$1,
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
  REPLACEMENTS: {
    "***": "*",
    "**/**": "**",
    "**/**/**": "**"
  },
  CHAR_0: 48,
  CHAR_9: 57,
  CHAR_UPPERCASE_A: 65,
  CHAR_LOWERCASE_A: 97,
  CHAR_UPPERCASE_Z: 90,
  CHAR_LOWERCASE_Z: 122,
  CHAR_LEFT_PARENTHESES: 40,
  CHAR_RIGHT_PARENTHESES: 41,
  CHAR_ASTERISK: 42,
  CHAR_AMPERSAND: 38,
  CHAR_AT: 64,
  CHAR_BACKWARD_SLASH: 92,
  CHAR_CARRIAGE_RETURN: 13,
  CHAR_CIRCUMFLEX_ACCENT: 94,
  CHAR_COLON: 58,
  CHAR_COMMA: 44,
  CHAR_DOT: 46,
  CHAR_DOUBLE_QUOTE: 34,
  CHAR_EQUAL: 61,
  CHAR_EXCLAMATION_MARK: 33,
  CHAR_FORM_FEED: 12,
  CHAR_FORWARD_SLASH: 47,
  CHAR_GRAVE_ACCENT: 96,
  CHAR_HASH: 35,
  CHAR_HYPHEN_MINUS: 45,
  CHAR_LEFT_ANGLE_BRACKET: 60,
  CHAR_LEFT_CURLY_BRACE: 123,
  CHAR_LEFT_SQUARE_BRACKET: 91,
  CHAR_LINE_FEED: 10,
  CHAR_NO_BREAK_SPACE: 160,
  CHAR_PERCENT: 37,
  CHAR_PLUS: 43,
  CHAR_QUESTION_MARK: 63,
  CHAR_RIGHT_ANGLE_BRACKET: 62,
  CHAR_RIGHT_CURLY_BRACE: 125,
  CHAR_RIGHT_SQUARE_BRACKET: 93,
  CHAR_SEMICOLON: 59,
  CHAR_SINGLE_QUOTE: 39,
  CHAR_SPACE: 32,
  CHAR_TAB: 9,
  CHAR_UNDERSCORE: 95,
  CHAR_VERTICAL_LINE: 124,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
  SEP: path$2.sep,
  extglobChars(chars2) {
    return {
      "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars2.STAR})` },
      "?": { type: "qmark", open: "(?:", close: ")?" },
      "+": { type: "plus", open: "(?:", close: ")+" },
      "*": { type: "star", open: "(?:", close: ")*" },
      "@": { type: "at", open: "(?:", close: ")" }
    };
  },
  globChars(win322) {
    return win322 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};
(function(exports) {
  const path2 = require$$1__default["default"];
  const win322 = process.platform === "win32";
  const {
    REGEX_BACKSLASH,
    REGEX_REMOVE_BACKSLASH,
    REGEX_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_GLOBAL
  } = constants$4;
  exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
  exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
  exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
  exports.removeBackslashes = (str) => {
    return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
      return match === "\\" ? "" : match;
    });
  };
  exports.supportsLookbehinds = () => {
    const segs = process.version.slice(1).split(".").map(Number);
    if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
      return true;
    }
    return false;
  };
  exports.isWindows = (options) => {
    if (options && typeof options.windows === "boolean") {
      return options.windows;
    }
    return win322 === true || path2.sep === "\\";
  };
  exports.escapeLast = (input, char, lastIdx) => {
    const idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1)
      return input;
    if (input[idx - 1] === "\\")
      return exports.escapeLast(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
  };
  exports.removePrefix = (input, state = {}) => {
    let output2 = input;
    if (output2.startsWith("./")) {
      output2 = output2.slice(2);
      state.prefix = "./";
    }
    return output2;
  };
  exports.wrapOutput = (input, state = {}, options = {}) => {
    const prepend = options.contains ? "" : "^";
    const append2 = options.contains ? "" : "$";
    let output2 = `${prepend}(?:${input})${append2}`;
    if (state.negated === true) {
      output2 = `(?:^(?!${output2}).*$)`;
    }
    return output2;
  };
})(utils$7);
const utils$6 = utils$7;
const {
  CHAR_ASTERISK,
  CHAR_AT,
  CHAR_BACKWARD_SLASH,
  CHAR_COMMA: CHAR_COMMA$1,
  CHAR_DOT: CHAR_DOT$1,
  CHAR_EXCLAMATION_MARK,
  CHAR_FORWARD_SLASH,
  CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE$1,
  CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES$1,
  CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET$1,
  CHAR_PLUS,
  CHAR_QUESTION_MARK,
  CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE$1,
  CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES$1,
  CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET$1
} = constants$4;
const isPathSeparator = (code) => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};
const depth = (token2) => {
  if (token2.isPrefix !== true) {
    token2.depth = token2.isGlobstar ? Infinity : 1;
  }
};
const scan$1 = (input, options) => {
  const opts = options || {};
  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];
  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob3 = false;
  let isExtglob3 = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let negatedExtglob = false;
  let finished = false;
  let braces2 = 0;
  let prev;
  let code;
  let token2 = { value: "", depth: 0, isGlob: false };
  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };
  while (index < length) {
    code = advance();
    let next;
    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token2.backslashes = true;
      code = advance();
      if (code === CHAR_LEFT_CURLY_BRACE$1) {
        braceEscaped = true;
      }
      continue;
    }
    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE$1) {
      braces2++;
      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token2.backslashes = true;
          advance();
          continue;
        }
        if (code === CHAR_LEFT_CURLY_BRACE$1) {
          braces2++;
          continue;
        }
        if (braceEscaped !== true && code === CHAR_DOT$1 && (code = advance()) === CHAR_DOT$1) {
          isBrace = token2.isBrace = true;
          isGlob3 = token2.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (braceEscaped !== true && code === CHAR_COMMA$1) {
          isBrace = token2.isBrace = true;
          isGlob3 = token2.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_RIGHT_CURLY_BRACE$1) {
          braces2--;
          if (braces2 === 0) {
            braceEscaped = false;
            isBrace = token2.isBrace = true;
            finished = true;
            break;
          }
        }
      }
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token2);
      token2 = { value: "", depth: 0, isGlob: false };
      if (finished === true)
        continue;
      if (prev === CHAR_DOT$1 && index === start + 1) {
        start += 2;
        continue;
      }
      lastIndex = index + 1;
      continue;
    }
    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES$1) {
        isGlob3 = token2.isGlob = true;
        isExtglob3 = token2.isExtglob = true;
        finished = true;
        if (code === CHAR_EXCLAMATION_MARK && index === start) {
          negatedExtglob = true;
        }
        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token2.backslashes = true;
              code = advance();
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES$1) {
              isGlob3 = token2.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }
    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK)
        isGlobstar = token2.isGlobstar = true;
      isGlob3 = token2.isGlob = true;
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_QUESTION_MARK) {
      isGlob3 = token2.isGlob = true;
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_LEFT_SQUARE_BRACKET$1) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token2.backslashes = true;
          advance();
          continue;
        }
        if (next === CHAR_RIGHT_SQUARE_BRACKET$1) {
          isBracket = token2.isBracket = true;
          isGlob3 = token2.isGlob = true;
          finished = true;
          break;
        }
      }
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token2.negated = true;
      start++;
      continue;
    }
    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES$1) {
      isGlob3 = token2.isGlob = true;
      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES$1) {
            backslashes = token2.backslashes = true;
            code = advance();
            continue;
          }
          if (code === CHAR_RIGHT_PARENTHESES$1) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }
    if (isGlob3 === true) {
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
  }
  if (opts.noext === true) {
    isExtglob3 = false;
    isGlob3 = false;
  }
  let base = str;
  let prefix = "";
  let glob = "";
  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }
  if (base && isGlob3 === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob3 === true) {
    base = "";
    glob = str;
  } else {
    base = str;
  }
  if (base && base !== "" && base !== "/" && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }
  if (opts.unescape === true) {
    if (glob)
      glob = utils$6.removeBackslashes(glob);
    if (base && backslashes === true) {
      base = utils$6.removeBackslashes(base);
    }
  }
  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob: isGlob3,
    isExtglob: isExtglob3,
    isGlobstar,
    negated,
    negatedExtglob
  };
  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token2);
    }
    state.tokens = tokens;
  }
  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;
    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== "") {
        parts.push(value);
      }
      prevIndex = i;
    }
    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);
      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }
    state.slashes = slashes;
    state.parts = parts;
  }
  return state;
};
var scan_1 = scan$1;
const constants$3 = constants$4;
const utils$5 = utils$7;
const {
  MAX_LENGTH: MAX_LENGTH$1,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants$3;
const expandRange = (args, options) => {
  if (typeof options.expandRange === "function") {
    return options.expandRange(...args, options);
  }
  args.sort();
  const value = `[${args.join("-")}]`;
  try {
    new RegExp(value);
  } catch (ex) {
    return args.map((v) => utils$5.escapeRegex(v)).join("..");
  }
  return value;
};
const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};
const parse$4 = (input, options) => {
  if (typeof input !== "string") {
    throw new TypeError("Expected a string");
  }
  input = REPLACEMENTS[input] || input;
  const opts = { ...options };
  const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }
  const bos = { type: "bos", value: "", output: opts.prepend || "" };
  const tokens = [bos];
  const capture = opts.capture ? "" : "?:";
  const win322 = utils$5.isWindows(options);
  const PLATFORM_CHARS = constants$3.globChars(win322);
  const EXTGLOB_CHARS = constants$3.extglobChars(PLATFORM_CHARS);
  const {
    DOT_LITERAL: DOT_LITERAL2,
    PLUS_LITERAL: PLUS_LITERAL2,
    SLASH_LITERAL: SLASH_LITERAL2,
    ONE_CHAR: ONE_CHAR2,
    DOTS_SLASH: DOTS_SLASH2,
    NO_DOT: NO_DOT2,
    NO_DOT_SLASH: NO_DOT_SLASH2,
    NO_DOTS_SLASH: NO_DOTS_SLASH2,
    QMARK: QMARK2,
    QMARK_NO_DOT: QMARK_NO_DOT2,
    STAR: STAR2,
    START_ANCHOR: START_ANCHOR2
  } = PLATFORM_CHARS;
  const globstar = (opts2) => {
    return `(${capture}(?:(?!${START_ANCHOR2}${opts2.dot ? DOTS_SLASH2 : DOT_LITERAL2}).)*?)`;
  };
  const nodot = opts.dot ? "" : NO_DOT2;
  const qmarkNoDot = opts.dot ? QMARK2 : QMARK_NO_DOT2;
  let star = opts.bash === true ? globstar(opts) : STAR2;
  if (opts.capture) {
    star = `(${star})`;
  }
  if (typeof opts.noext === "boolean") {
    opts.noextglob = opts.noext;
  }
  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: "",
    output: "",
    prefix: "",
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };
  input = utils$5.removePrefix(input, state);
  len = input.length;
  const extglobs = [];
  const braces2 = [];
  const stack = [];
  let prev = bos;
  let value;
  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index] || "";
  const remaining = () => input.slice(state.index + 1);
  const consume = (value2 = "", num = 0) => {
    state.consumed += value2;
    state.index += num;
  };
  const append2 = (token2) => {
    state.output += token2.output != null ? token2.output : token2.value;
    consume(token2.value);
  };
  const negate = () => {
    let count = 1;
    while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
      advance();
      state.start++;
      count++;
    }
    if (count % 2 === 0) {
      return false;
    }
    state.negated = true;
    state.start++;
    return true;
  };
  const increment = (type) => {
    state[type]++;
    stack.push(type);
  };
  const decrement = (type) => {
    state[type]--;
    stack.pop();
  };
  const push = (tok) => {
    if (prev.type === "globstar") {
      const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
      const isExtglob3 = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
      if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob3) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = "star";
        prev.value = "*";
        prev.output = star;
        state.output += prev.output;
      }
    }
    if (extglobs.length && tok.type !== "paren") {
      extglobs[extglobs.length - 1].inner += tok.value;
    }
    if (tok.value || tok.output)
      append2(tok);
    if (prev && prev.type === "text" && tok.type === "text") {
      prev.value += tok.value;
      prev.output = (prev.output || "") + tok.value;
      return;
    }
    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };
  const extglobOpen = (type, value2) => {
    const token2 = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
    token2.prev = prev;
    token2.parens = state.parens;
    token2.output = state.output;
    const output2 = (opts.capture ? "(" : "") + token2.open;
    increment("parens");
    push({ type, value: value2, output: state.output ? "" : ONE_CHAR2 });
    push({ type: "paren", extglob: true, value: advance(), output: output2 });
    extglobs.push(token2);
  };
  const extglobClose = (token2) => {
    let output2 = token2.close + (opts.capture ? ")" : "");
    let rest;
    if (token2.type === "negate") {
      let extglobStar = star;
      if (token2.inner && token2.inner.length > 1 && token2.inner.includes("/")) {
        extglobStar = globstar(opts);
      }
      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output2 = token2.close = `)$))${extglobStar}`;
      }
      if (token2.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
        const expression = parse$4(rest, { ...options, fastpaths: false }).output;
        output2 = token2.close = `)${expression})${extglobStar})`;
      }
      if (token2.prev.type === "bos") {
        state.negatedExtglob = true;
      }
    }
    push({ type: "paren", extglob: true, value, output: output2 });
    decrement("parens");
  };
  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;
    let output2 = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars2, first, rest, index) => {
      if (first === "\\") {
        backslashes = true;
        return m;
      }
      if (first === "?") {
        if (esc) {
          return esc + first + (rest ? QMARK2.repeat(rest.length) : "");
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK2.repeat(rest.length) : "");
        }
        return QMARK2.repeat(chars2.length);
      }
      if (first === ".") {
        return DOT_LITERAL2.repeat(chars2.length);
      }
      if (first === "*") {
        if (esc) {
          return esc + first + (rest ? star : "");
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });
    if (backslashes === true) {
      if (opts.unescape === true) {
        output2 = output2.replace(/\\/g, "");
      } else {
        output2 = output2.replace(/\\+/g, (m) => {
          return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
        });
      }
    }
    if (output2 === input && opts.contains === true) {
      state.output = input;
      return state;
    }
    state.output = utils$5.wrapOutput(output2, state, options);
    return state;
  }
  while (!eos()) {
    value = advance();
    if (value === "\0") {
      continue;
    }
    if (value === "\\") {
      const next = peek();
      if (next === "/" && opts.bash !== true) {
        continue;
      }
      if (next === "." || next === ";") {
        continue;
      }
      if (!next) {
        value += "\\";
        push({ type: "text", value });
        continue;
      }
      const match = /^\\+/.exec(remaining());
      let slashes = 0;
      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += "\\";
        }
      }
      if (opts.unescape === true) {
        value = advance();
      } else {
        value += advance();
      }
      if (state.brackets === 0) {
        push({ type: "text", value });
        continue;
      }
    }
    if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
      if (opts.posix !== false && value === ":") {
        const inner = prev.value.slice(1);
        if (inner.includes("[")) {
          prev.posix = true;
          if (inner.includes(":")) {
            const idx = prev.value.lastIndexOf("[");
            const pre = prev.value.slice(0, idx);
            const rest2 = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest2];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();
              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR2;
              }
              continue;
            }
          }
        }
      }
      if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
        value = `\\${value}`;
      }
      if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
        value = `\\${value}`;
      }
      if (opts.posix === true && value === "!" && prev.value === "[") {
        value = "^";
      }
      prev.value += value;
      append2({ value });
      continue;
    }
    if (state.quotes === 1 && value !== '"') {
      value = utils$5.escapeRegex(value);
      prev.value += value;
      append2({ value });
      continue;
    }
    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: "text", value });
      }
      continue;
    }
    if (value === "(") {
      increment("parens");
      push({ type: "paren", value });
      continue;
    }
    if (value === ")") {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError("opening", "("));
      }
      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }
      push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
      decrement("parens");
      continue;
    }
    if (value === "[") {
      if (opts.nobracket === true || !remaining().includes("]")) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("closing", "]"));
        }
        value = `\\${value}`;
      } else {
        increment("brackets");
      }
      push({ type: "bracket", value });
      continue;
    }
    if (value === "]") {
      if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
        push({ type: "text", value, output: `\\${value}` });
        continue;
      }
      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("opening", "["));
        }
        push({ type: "text", value, output: `\\${value}` });
        continue;
      }
      decrement("brackets");
      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
        value = `/${value}`;
      }
      prev.value += value;
      append2({ value });
      if (opts.literalBrackets === false || utils$5.hasRegexChars(prevValue)) {
        continue;
      }
      const escaped2 = utils$5.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);
      if (opts.literalBrackets === true) {
        state.output += escaped2;
        prev.value = escaped2;
        continue;
      }
      prev.value = `(${capture}${escaped2}|${prev.value})`;
      state.output += prev.value;
      continue;
    }
    if (value === "{" && opts.nobrace !== true) {
      increment("braces");
      const open2 = {
        type: "brace",
        value,
        output: "(",
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };
      braces2.push(open2);
      push(open2);
      continue;
    }
    if (value === "}") {
      const brace = braces2[braces2.length - 1];
      if (opts.nobrace === true || !brace) {
        push({ type: "text", value, output: value });
        continue;
      }
      let output2 = ")";
      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];
        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === "brace") {
            break;
          }
          if (arr[i].type !== "dots") {
            range.unshift(arr[i].value);
          }
        }
        output2 = expandRange(range, opts);
        state.backtrack = true;
      }
      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = "\\{";
        value = output2 = "\\}";
        state.output = out;
        for (const t of toks) {
          state.output += t.output || t.value;
        }
      }
      push({ type: "brace", value, output: output2 });
      decrement("braces");
      braces2.pop();
      continue;
    }
    if (value === "|") {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: "text", value });
      continue;
    }
    if (value === ",") {
      let output2 = value;
      const brace = braces2[braces2.length - 1];
      if (brace && stack[stack.length - 1] === "braces") {
        brace.comma = true;
        output2 = "|";
      }
      push({ type: "comma", value, output: output2 });
      continue;
    }
    if (value === "/") {
      if (prev.type === "dot" && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = "";
        state.output = "";
        tokens.pop();
        prev = bos;
        continue;
      }
      push({ type: "slash", value, output: SLASH_LITERAL2 });
      continue;
    }
    if (value === ".") {
      if (state.braces > 0 && prev.type === "dot") {
        if (prev.value === ".")
          prev.output = DOT_LITERAL2;
        const brace = braces2[braces2.length - 1];
        prev.type = "dots";
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }
      if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
        push({ type: "text", value, output: DOT_LITERAL2 });
        continue;
      }
      push({ type: "dot", value, output: DOT_LITERAL2 });
      continue;
    }
    if (value === "?") {
      const isGroup = prev && prev.value === "(";
      if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
        extglobOpen("qmark", value);
        continue;
      }
      if (prev && prev.type === "paren") {
        const next = peek();
        let output2 = value;
        if (next === "<" && !utils$5.supportsLookbehinds()) {
          throw new Error("Node.js v10 or higher is required for regex lookbehinds");
        }
        if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
          output2 = `\\${value}`;
        }
        push({ type: "text", value, output: output2 });
        continue;
      }
      if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
        push({ type: "qmark", value, output: QMARK_NO_DOT2 });
        continue;
      }
      push({ type: "qmark", value, output: QMARK2 });
      continue;
    }
    if (value === "!") {
      if (opts.noextglob !== true && peek() === "(") {
        if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
          extglobOpen("negate", value);
          continue;
        }
      }
      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }
    if (value === "+") {
      if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
        extglobOpen("plus", value);
        continue;
      }
      if (prev && prev.value === "(" || opts.regex === false) {
        push({ type: "plus", value, output: PLUS_LITERAL2 });
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
        push({ type: "plus", value });
        continue;
      }
      push({ type: "plus", value: PLUS_LITERAL2 });
      continue;
    }
    if (value === "@") {
      if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
        push({ type: "at", extglob: true, value, output: "" });
        continue;
      }
      push({ type: "text", value });
      continue;
    }
    if (value !== "*") {
      if (value === "$" || value === "^") {
        value = `\\${value}`;
      }
      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }
      push({ type: "text", value });
      continue;
    }
    if (prev && (prev.type === "globstar" || prev.star === true)) {
      prev.type = "star";
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }
    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen("star", value);
      continue;
    }
    if (prev.type === "star") {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }
      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === "slash" || prior.type === "bos";
      const afterStar = before && (before.type === "star" || before.type === "globstar");
      if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
        push({ type: "star", value, output: "" });
        continue;
      }
      const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
      const isExtglob3 = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
      if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob3) {
        push({ type: "star", value, output: "" });
        continue;
      }
      while (rest.slice(0, 3) === "/**") {
        const after = input[state.index + 4];
        if (after && after !== "/") {
          break;
        }
        rest = rest.slice(3);
        consume("/**", 3);
      }
      if (prior.type === "bos" && eos()) {
        prev.type = "globstar";
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }
      if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;
        prev.type = "globstar";
        prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }
      if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
        const end = rest[1] !== void 0 ? "|$" : "";
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;
        prev.type = "globstar";
        prev.output = `${globstar(opts)}${SLASH_LITERAL2}|${SLASH_LITERAL2}${end})`;
        prev.value += value;
        state.output += prior.output + prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: "slash", value: "/", output: "" });
        continue;
      }
      if (prior.type === "bos" && rest[0] === "/") {
        prev.type = "globstar";
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL2}|${globstar(opts)}${SLASH_LITERAL2})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: "slash", value: "/", output: "" });
        continue;
      }
      state.output = state.output.slice(0, -prev.output.length);
      prev.type = "globstar";
      prev.output = globstar(opts);
      prev.value += value;
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }
    const token2 = { type: "star", value, output: star };
    if (opts.bash === true) {
      token2.output = ".*?";
      if (prev.type === "bos" || prev.type === "slash") {
        token2.output = nodot + token2.output;
      }
      push(token2);
      continue;
    }
    if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
      token2.output = value;
      push(token2);
      continue;
    }
    if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
      if (prev.type === "dot") {
        state.output += NO_DOT_SLASH2;
        prev.output += NO_DOT_SLASH2;
      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH2;
        prev.output += NO_DOTS_SLASH2;
      } else {
        state.output += nodot;
        prev.output += nodot;
      }
      if (peek() !== "*") {
        state.output += ONE_CHAR2;
        prev.output += ONE_CHAR2;
      }
    }
    push(token2);
  }
  while (state.brackets > 0) {
    if (opts.strictBrackets === true)
      throw new SyntaxError(syntaxError("closing", "]"));
    state.output = utils$5.escapeLast(state.output, "[");
    decrement("brackets");
  }
  while (state.parens > 0) {
    if (opts.strictBrackets === true)
      throw new SyntaxError(syntaxError("closing", ")"));
    state.output = utils$5.escapeLast(state.output, "(");
    decrement("parens");
  }
  while (state.braces > 0) {
    if (opts.strictBrackets === true)
      throw new SyntaxError(syntaxError("closing", "}"));
    state.output = utils$5.escapeLast(state.output, "{");
    decrement("braces");
  }
  if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
    push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL2}?` });
  }
  if (state.backtrack === true) {
    state.output = "";
    for (const token2 of state.tokens) {
      state.output += token2.output != null ? token2.output : token2.value;
      if (token2.suffix) {
        state.output += token2.suffix;
      }
    }
  }
  return state;
};
parse$4.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }
  input = REPLACEMENTS[input] || input;
  const win322 = utils$5.isWindows(options);
  const {
    DOT_LITERAL: DOT_LITERAL2,
    SLASH_LITERAL: SLASH_LITERAL2,
    ONE_CHAR: ONE_CHAR2,
    DOTS_SLASH: DOTS_SLASH2,
    NO_DOT: NO_DOT2,
    NO_DOTS: NO_DOTS2,
    NO_DOTS_SLASH: NO_DOTS_SLASH2,
    STAR: STAR2,
    START_ANCHOR: START_ANCHOR2
  } = constants$3.globChars(win322);
  const nodot = opts.dot ? NO_DOTS2 : NO_DOT2;
  const slashDot = opts.dot ? NO_DOTS_SLASH2 : NO_DOT2;
  const capture = opts.capture ? "" : "?:";
  const state = { negated: false, prefix: "" };
  let star = opts.bash === true ? ".*?" : STAR2;
  if (opts.capture) {
    star = `(${star})`;
  }
  const globstar = (opts2) => {
    if (opts2.noglobstar === true)
      return star;
    return `(${capture}(?:(?!${START_ANCHOR2}${opts2.dot ? DOTS_SLASH2 : DOT_LITERAL2}).)*?)`;
  };
  const create = (str) => {
    switch (str) {
      case "*":
        return `${nodot}${ONE_CHAR2}${star}`;
      case ".*":
        return `${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      case "*.*":
        return `${nodot}${star}${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      case "*/*":
        return `${nodot}${star}${SLASH_LITERAL2}${ONE_CHAR2}${slashDot}${star}`;
      case "**":
        return nodot + globstar(opts);
      case "**/*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL2})?${slashDot}${ONE_CHAR2}${star}`;
      case "**/*.*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL2})?${slashDot}${star}${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      case "**/.*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL2})?${DOT_LITERAL2}${ONE_CHAR2}${star}`;
      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match)
          return;
        const source2 = create(match[1]);
        if (!source2)
          return;
        return source2 + DOT_LITERAL2 + match[2];
      }
    }
  };
  const output2 = utils$5.removePrefix(input, state);
  let source = create(output2);
  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL2}?`;
  }
  return source;
};
var parse_1$1 = parse$4;
const path$1 = require$$1__default["default"];
const scan = scan_1;
const parse$3 = parse_1$1;
const utils$4 = utils$7;
const constants$2 = constants$4;
const isObject$1 = (val) => val && typeof val === "object" && !Array.isArray(val);
const picomatch$3 = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map((input) => picomatch$3(input, options, returnState));
    const arrayMatcher = (str) => {
      for (const isMatch of fns) {
        const state2 = isMatch(str);
        if (state2)
          return state2;
      }
      return false;
    };
    return arrayMatcher;
  }
  const isState = isObject$1(glob) && glob.tokens && glob.input;
  if (glob === "" || typeof glob !== "string" && !isState) {
    throw new TypeError("Expected pattern to be a non-empty string");
  }
  const opts = options || {};
  const posix = utils$4.isWindows(options);
  const regex = isState ? picomatch$3.compileRe(glob, options) : picomatch$3.makeRe(glob, options, false, true);
  const state = regex.state;
  delete regex.state;
  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch$3(opts.ignore, ignoreOpts, returnState);
  }
  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output: output2 } = picomatch$3.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output: output2, match, isMatch };
    if (typeof opts.onResult === "function") {
      opts.onResult(result);
    }
    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }
    if (isIgnored(input)) {
      if (typeof opts.onIgnore === "function") {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }
    if (typeof opts.onMatch === "function") {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };
  if (returnState) {
    matcher.state = state;
  }
  return matcher;
};
picomatch$3.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== "string") {
    throw new TypeError("Expected input to be a string");
  }
  if (input === "") {
    return { isMatch: false, output: "" };
  }
  const opts = options || {};
  const format = opts.format || (posix ? utils$4.toPosixSlashes : null);
  let match = input === glob;
  let output2 = match && format ? format(input) : input;
  if (match === false) {
    output2 = format ? format(input) : input;
    match = output2 === glob;
  }
  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch$3.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output2);
    }
  }
  return { isMatch: Boolean(match), match, output: output2 };
};
picomatch$3.matchBase = (input, glob, options, posix = utils$4.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch$3.makeRe(glob, options);
  return regex.test(path$1.basename(input));
};
picomatch$3.isMatch = (str, patterns, options) => picomatch$3(patterns, options)(str);
picomatch$3.parse = (pattern, options) => {
  if (Array.isArray(pattern))
    return pattern.map((p) => picomatch$3.parse(p, options));
  return parse$3(pattern, { ...options, fastpaths: false });
};
picomatch$3.scan = (input, options) => scan(input, options);
picomatch$3.compileRe = (state, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return state.output;
  }
  const opts = options || {};
  const prepend = opts.contains ? "" : "^";
  const append2 = opts.contains ? "" : "$";
  let source = `${prepend}(?:${state.output})${append2}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }
  const regex = picomatch$3.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }
  return regex;
};
picomatch$3.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== "string") {
    throw new TypeError("Expected a non-empty string");
  }
  let parsed = { negated: false, fastpaths: true };
  if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
    parsed.output = parse$3.fastpaths(input, options);
  }
  if (!parsed.output) {
    parsed = parse$3(input, options);
  }
  return picomatch$3.compileRe(parsed, options, returnOutput, returnState);
};
picomatch$3.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
  } catch (err) {
    if (options && options.debug === true)
      throw err;
    return /$^/;
  }
};
picomatch$3.constants = constants$2;
var picomatch_1 = picomatch$3;
var picomatch$2 = picomatch_1;
const fs$3 = require$$0__default$2["default"];
const { Readable } = require$$0__default$1["default"];
const sysPath$3 = require$$1__default["default"];
const { promisify: promisify$3 } = require$$2__default["default"];
const picomatch$1 = picomatch$2;
const readdir$1 = promisify$3(fs$3.readdir);
const stat$3 = promisify$3(fs$3.stat);
const lstat$2 = promisify$3(fs$3.lstat);
const realpath$1 = promisify$3(fs$3.realpath);
const BANG$2 = "!";
const NORMAL_FLOW_ERRORS = /* @__PURE__ */ new Set(["ENOENT", "EPERM", "EACCES", "ELOOP"]);
const FILE_TYPE = "files";
const DIR_TYPE = "directories";
const FILE_DIR_TYPE = "files_directories";
const EVERYTHING_TYPE = "all";
const ALL_TYPES = [FILE_TYPE, DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE];
const isNormalFlowError = (error) => NORMAL_FLOW_ERRORS.has(error.code);
const normalizeFilter = (filter) => {
  if (filter === void 0)
    return;
  if (typeof filter === "function")
    return filter;
  if (typeof filter === "string") {
    const glob = picomatch$1(filter.trim());
    return (entry) => glob(entry.basename);
  }
  if (Array.isArray(filter)) {
    const positive = [];
    const negative = [];
    for (const item of filter) {
      const trimmed = item.trim();
      if (trimmed.charAt(0) === BANG$2) {
        negative.push(picomatch$1(trimmed.slice(1)));
      } else {
        positive.push(picomatch$1(trimmed));
      }
    }
    if (negative.length > 0) {
      if (positive.length > 0) {
        return (entry) => positive.some((f) => f(entry.basename)) && !negative.some((f) => f(entry.basename));
      }
      return (entry) => !negative.some((f) => f(entry.basename));
    }
    return (entry) => positive.some((f) => f(entry.basename));
  }
};
class ReaddirpStream extends Readable {
  static get defaultOptions() {
    return {
      root: ".",
      fileFilter: (path2) => true,
      directoryFilter: (path2) => true,
      type: FILE_TYPE,
      lstat: false,
      depth: 2147483648,
      alwaysStat: false
    };
  }
  constructor(options = {}) {
    super({
      objectMode: true,
      autoDestroy: true,
      highWaterMark: options.highWaterMark || 4096
    });
    const opts = { ...ReaddirpStream.defaultOptions, ...options };
    const { root, type } = opts;
    this._fileFilter = normalizeFilter(opts.fileFilter);
    this._directoryFilter = normalizeFilter(opts.directoryFilter);
    const statMethod = opts.lstat ? lstat$2 : stat$3;
    if (process.platform === "win32" && stat$3.length === 3) {
      this._stat = (path2) => statMethod(path2, { bigint: true });
    } else {
      this._stat = statMethod;
    }
    this._maxDepth = opts.depth;
    this._wantsDir = [DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE].includes(type);
    this._wantsFile = [FILE_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE].includes(type);
    this._wantsEverything = type === EVERYTHING_TYPE;
    this._root = sysPath$3.resolve(root);
    this._isDirent = "Dirent" in fs$3 && !opts.alwaysStat;
    this._statsProp = this._isDirent ? "dirent" : "stats";
    this._rdOptions = { encoding: "utf8", withFileTypes: this._isDirent };
    this.parents = [this._exploreDir(root, 1)];
    this.reading = false;
    this.parent = void 0;
  }
  async _read(batch) {
    if (this.reading)
      return;
    this.reading = true;
    try {
      while (!this.destroyed && batch > 0) {
        const { path: path2, depth: depth2, files = [] } = this.parent || {};
        if (files.length > 0) {
          const slice = files.splice(0, batch).map((dirent) => this._formatEntry(dirent, path2));
          for (const entry of await Promise.all(slice)) {
            if (this.destroyed)
              return;
            const entryType = await this._getEntryType(entry);
            if (entryType === "directory" && this._directoryFilter(entry)) {
              if (depth2 <= this._maxDepth) {
                this.parents.push(this._exploreDir(entry.fullPath, depth2 + 1));
              }
              if (this._wantsDir) {
                this.push(entry);
                batch--;
              }
            } else if ((entryType === "file" || this._includeAsFile(entry)) && this._fileFilter(entry)) {
              if (this._wantsFile) {
                this.push(entry);
                batch--;
              }
            }
          }
        } else {
          const parent = this.parents.pop();
          if (!parent) {
            this.push(null);
            break;
          }
          this.parent = await parent;
          if (this.destroyed)
            return;
        }
      }
    } catch (error) {
      this.destroy(error);
    } finally {
      this.reading = false;
    }
  }
  async _exploreDir(path2, depth2) {
    let files;
    try {
      files = await readdir$1(path2, this._rdOptions);
    } catch (error) {
      this._onError(error);
    }
    return { files, depth: depth2, path: path2 };
  }
  async _formatEntry(dirent, path2) {
    let entry;
    try {
      const basename = this._isDirent ? dirent.name : dirent;
      const fullPath = sysPath$3.resolve(sysPath$3.join(path2, basename));
      entry = { path: sysPath$3.relative(this._root, fullPath), fullPath, basename };
      entry[this._statsProp] = this._isDirent ? dirent : await this._stat(fullPath);
    } catch (err) {
      this._onError(err);
    }
    return entry;
  }
  _onError(err) {
    if (isNormalFlowError(err) && !this.destroyed) {
      this.emit("warn", err);
    } else {
      this.destroy(err);
    }
  }
  async _getEntryType(entry) {
    const stats = entry && entry[this._statsProp];
    if (!stats) {
      return;
    }
    if (stats.isFile()) {
      return "file";
    }
    if (stats.isDirectory()) {
      return "directory";
    }
    if (stats && stats.isSymbolicLink()) {
      const full = entry.fullPath;
      try {
        const entryRealPath = await realpath$1(full);
        const entryRealPathStats = await lstat$2(entryRealPath);
        if (entryRealPathStats.isFile()) {
          return "file";
        }
        if (entryRealPathStats.isDirectory()) {
          const len = entryRealPath.length;
          if (full.startsWith(entryRealPath) && full.substr(len, 1) === sysPath$3.sep) {
            return this._onError(new Error(
              `Circular symlink detected: "${full}" points to "${entryRealPath}"`
            ));
          }
          return "directory";
        }
      } catch (error) {
        this._onError(error);
      }
    }
  }
  _includeAsFile(entry) {
    const stats = entry && entry[this._statsProp];
    return stats && this._wantsEverything && !stats.isDirectory();
  }
}
const readdirp$1 = (root, options = {}) => {
  let type = options.entryType || options.type;
  if (type === "both")
    type = FILE_DIR_TYPE;
  if (type)
    options.type = type;
  if (!root) {
    throw new Error("readdirp: root argument is required. Usage: readdirp(root, options)");
  } else if (typeof root !== "string") {
    throw new TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
  } else if (type && !ALL_TYPES.includes(type)) {
    throw new Error(`readdirp: Invalid type passed. Use one of ${ALL_TYPES.join(", ")}`);
  }
  options.root = root;
  return new ReaddirpStream(options);
};
const readdirpPromise = (root, options = {}) => {
  return new Promise((resolve, reject) => {
    const files = [];
    readdirp$1(root, options).on("data", (entry) => files.push(entry)).on("end", () => resolve(files)).on("error", (error) => reject(error));
  });
};
readdirp$1.promise = readdirpPromise;
readdirp$1.ReaddirpStream = ReaddirpStream;
readdirp$1.default = readdirp$1;
var readdirp_1 = readdirp$1;
var anymatch$2 = { exports: {} };
/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */
var normalizePath$2 = function(path2, stripTrailing) {
  if (typeof path2 !== "string") {
    throw new TypeError("expected path to be a string");
  }
  if (path2 === "\\" || path2 === "/")
    return "/";
  var len = path2.length;
  if (len <= 1)
    return path2;
  var prefix = "";
  if (len > 4 && path2[3] === "\\") {
    var ch = path2[2];
    if ((ch === "?" || ch === ".") && path2.slice(0, 2) === "\\\\") {
      path2 = path2.slice(2);
      prefix = "//";
    }
  }
  var segs = path2.split(/[/\\]+/);
  if (stripTrailing !== false && segs[segs.length - 1] === "") {
    segs.pop();
  }
  return prefix + segs.join("/");
};
Object.defineProperty(anymatch$2.exports, "__esModule", { value: true });
const picomatch = picomatch$2;
const normalizePath$1 = normalizePath$2;
const BANG$1 = "!";
const DEFAULT_OPTIONS = { returnIndex: false };
const arrify$1 = (item) => Array.isArray(item) ? item : [item];
const createPattern = (matcher, options) => {
  if (typeof matcher === "function") {
    return matcher;
  }
  if (typeof matcher === "string") {
    const glob = picomatch(matcher, options);
    return (string) => matcher === string || glob(string);
  }
  if (matcher instanceof RegExp) {
    return (string) => matcher.test(string);
  }
  return (string) => false;
};
const matchPatterns = (patterns, negPatterns, args, returnIndex) => {
  const isList = Array.isArray(args);
  const _path = isList ? args[0] : args;
  if (!isList && typeof _path !== "string") {
    throw new TypeError("anymatch: second argument must be a string: got " + Object.prototype.toString.call(_path));
  }
  const path2 = normalizePath$1(_path);
  for (let index = 0; index < negPatterns.length; index++) {
    const nglob = negPatterns[index];
    if (nglob(path2)) {
      return returnIndex ? -1 : false;
    }
  }
  const applied = isList && [path2].concat(args.slice(1));
  for (let index = 0; index < patterns.length; index++) {
    const pattern = patterns[index];
    if (isList ? pattern(...applied) : pattern(path2)) {
      return returnIndex ? index : true;
    }
  }
  return returnIndex ? -1 : false;
};
const anymatch$1 = (matchers, testString, options = DEFAULT_OPTIONS) => {
  if (matchers == null) {
    throw new TypeError("anymatch: specify first argument");
  }
  const opts = typeof options === "boolean" ? { returnIndex: options } : options;
  const returnIndex = opts.returnIndex || false;
  const mtchers = arrify$1(matchers);
  const negatedGlobs = mtchers.filter((item) => typeof item === "string" && item.charAt(0) === BANG$1).map((item) => item.slice(1)).map((item) => picomatch(item, opts));
  const patterns = mtchers.filter((item) => typeof item !== "string" || typeof item === "string" && item.charAt(0) !== BANG$1).map((matcher) => createPattern(matcher, opts));
  if (testString == null) {
    return (testString2, ri = false) => {
      const returnIndex2 = typeof ri === "boolean" ? ri : false;
      return matchPatterns(patterns, negatedGlobs, testString2, returnIndex2);
    };
  }
  return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
};
anymatch$1.default = anymatch$1;
anymatch$2.exports = anymatch$1;
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var isExtglob$1 = function isExtglob2(str) {
  if (typeof str !== "string" || str === "") {
    return false;
  }
  var match;
  while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
    if (match[2])
      return true;
    str = str.slice(match.index + match[0].length);
  }
  return false;
};
/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
var isExtglob = isExtglob$1;
var chars = { "{": "}", "(": ")", "[": "]" };
var strictCheck = function(str) {
  if (str[0] === "!") {
    return true;
  }
  var index = 0;
  var pipeIndex = -2;
  var closeSquareIndex = -2;
  var closeCurlyIndex = -2;
  var closeParenIndex = -2;
  var backSlashIndex = -2;
  while (index < str.length) {
    if (str[index] === "*") {
      return true;
    }
    if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) {
      return true;
    }
    if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
      if (closeSquareIndex < index) {
        closeSquareIndex = str.indexOf("]", index);
      }
      if (closeSquareIndex > index) {
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
        backSlashIndex = str.indexOf("\\", index);
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
      }
    }
    if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
      closeCurlyIndex = str.indexOf("}", index);
      if (closeCurlyIndex > index) {
        backSlashIndex = str.indexOf("\\", index);
        if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
          return true;
        }
      }
    }
    if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
      closeParenIndex = str.indexOf(")", index);
      if (closeParenIndex > index) {
        backSlashIndex = str.indexOf("\\", index);
        if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
          return true;
        }
      }
    }
    if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
      if (pipeIndex < index) {
        pipeIndex = str.indexOf("|", index);
      }
      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
        closeParenIndex = str.indexOf(")", pipeIndex);
        if (closeParenIndex > pipeIndex) {
          backSlashIndex = str.indexOf("\\", pipeIndex);
          if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
            return true;
          }
        }
      }
    }
    if (str[index] === "\\") {
      var open2 = str[index + 1];
      index += 2;
      var close2 = chars[open2];
      if (close2) {
        var n = str.indexOf(close2, index);
        if (n !== -1) {
          index = n + 1;
        }
      }
      if (str[index] === "!") {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};
var relaxedCheck = function(str) {
  if (str[0] === "!") {
    return true;
  }
  var index = 0;
  while (index < str.length) {
    if (/[*?{}()[\]]/.test(str[index])) {
      return true;
    }
    if (str[index] === "\\") {
      var open2 = str[index + 1];
      index += 2;
      var close2 = chars[open2];
      if (close2) {
        var n = str.indexOf(close2, index);
        if (n !== -1) {
          index = n + 1;
        }
      }
      if (str[index] === "!") {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};
var isGlob$2 = function isGlob2(str, options) {
  if (typeof str !== "string" || str === "") {
    return false;
  }
  if (isExtglob(str)) {
    return true;
  }
  var check = strictCheck;
  if (options && options.strict === false) {
    check = relaxedCheck;
  }
  return check(str);
};
var isGlob$1 = isGlob$2;
var pathPosixDirname = require$$1__default["default"].posix.dirname;
var isWin32 = require$$1__default$1["default"].platform() === "win32";
var slash = "/";
var backslash = /\\/g;
var enclosure = /[\{\[].*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
var globParent$1 = function globParent2(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }
  if (enclosure.test(str)) {
    str += slash;
  }
  str += "a";
  do {
    str = pathPosixDirname(str);
  } while (isGlob$1(str) || globby.test(str));
  return str.replace(escaped, "$1");
};
var utils$3 = {};
(function(exports) {
  exports.isInteger = (num) => {
    if (typeof num === "number") {
      return Number.isInteger(num);
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isInteger(Number(num));
    }
    return false;
  };
  exports.find = (node, type) => node.nodes.find((node2) => node2.type === type);
  exports.exceedsLimit = (min, max, step = 1, limit) => {
    if (limit === false)
      return false;
    if (!exports.isInteger(min) || !exports.isInteger(max))
      return false;
    return (Number(max) - Number(min)) / Number(step) >= limit;
  };
  exports.escapeNode = (block, n = 0, type) => {
    let node = block.nodes[n];
    if (!node)
      return;
    if (type && node.type === type || node.type === "open" || node.type === "close") {
      if (node.escaped !== true) {
        node.value = "\\" + node.value;
        node.escaped = true;
      }
    }
  };
  exports.encloseBrace = (node) => {
    if (node.type !== "brace")
      return false;
    if (node.commas >> 0 + node.ranges >> 0 === 0) {
      node.invalid = true;
      return true;
    }
    return false;
  };
  exports.isInvalidBrace = (block) => {
    if (block.type !== "brace")
      return false;
    if (block.invalid === true || block.dollar)
      return true;
    if (block.commas >> 0 + block.ranges >> 0 === 0) {
      block.invalid = true;
      return true;
    }
    if (block.open !== true || block.close !== true) {
      block.invalid = true;
      return true;
    }
    return false;
  };
  exports.isOpenOrClose = (node) => {
    if (node.type === "open" || node.type === "close") {
      return true;
    }
    return node.open === true || node.close === true;
  };
  exports.reduce = (nodes) => nodes.reduce((acc, node) => {
    if (node.type === "text")
      acc.push(node.value);
    if (node.type === "range")
      node.type = "text";
    return acc;
  }, []);
  exports.flatten = (...args) => {
    const result = [];
    const flat = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i];
        Array.isArray(ele) ? flat(ele) : ele !== void 0 && result.push(ele);
      }
      return result;
    };
    flat(args);
    return result;
  };
})(utils$3);
const utils$2 = utils$3;
var stringify$5 = (ast, options = {}) => {
  let stringify2 = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils$2.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output2 = "";
    if (node.value) {
      if ((invalidBlock || invalidNode) && utils$2.isOpenOrClose(node)) {
        return "\\" + node.value;
      }
      return node.value;
    }
    if (node.value) {
      return node.value;
    }
    if (node.nodes) {
      for (let child of node.nodes) {
        output2 += stringify2(child);
      }
    }
    return output2;
  };
  return stringify2(ast);
};
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
var isNumber$2 = function(num) {
  if (typeof num === "number") {
    return num - num === 0;
  }
  if (typeof num === "string" && num.trim() !== "") {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const isNumber$1 = isNumber$2;
const toRegexRange$1 = (min, max, options) => {
  if (isNumber$1(min) === false) {
    throw new TypeError("toRegexRange: expected the first argument to be a number");
  }
  if (max === void 0 || min === max) {
    return String(min);
  }
  if (isNumber$1(max) === false) {
    throw new TypeError("toRegexRange: expected the second argument to be a number.");
  }
  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === "boolean") {
    opts.relaxZeros = opts.strictZeros === false;
  }
  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
  if (toRegexRange$1.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange$1.cache[cacheKey].result;
  }
  let a = Math.min(min, max);
  let b = Math.max(min, max);
  if (Math.abs(a - b) === 1) {
    let result = min + "|" + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }
  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];
  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }
  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }
  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }
  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives);
  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
    state.result = `(?:${state.result})`;
  }
  toRegexRange$1.cache[cacheKey] = state;
  return state.result;
};
function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, "-", false) || [];
  let onlyPositive = filterPatterns(pos, neg, "", false) || [];
  let intersected = filterPatterns(neg, pos, "-?", true) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join("|");
}
function splitToRanges(min, max) {
  let nines = 1;
  let zeros2 = 1;
  let stop = countNines(min, nines);
  let stops = /* @__PURE__ */ new Set([max]);
  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }
  stop = countZeros(max + 1, zeros2) - 1;
  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros2 += 1;
    stop = countZeros(max + 1, zeros2) - 1;
  }
  stops = [...stops];
  stops.sort(compare);
  return stops;
}
function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }
  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = "";
  let count = 0;
  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];
    if (startDigit === stopDigit) {
      pattern += startDigit;
    } else if (startDigit !== "0" || stopDigit !== "9") {
      pattern += toCharacterClass(startDigit, stopDigit);
    } else {
      count++;
    }
  }
  if (count) {
    pattern += options.shorthand === true ? "\\d" : "[0-9]";
  }
  return { pattern, count: [count], digits };
}
function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;
  for (let i = 0; i < ranges.length; i++) {
    let max2 = ranges[i];
    let obj = rangeToPattern(String(start), String(max2), options);
    let zeros2 = "";
    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }
      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max2 + 1;
      continue;
    }
    if (tok.isPadded) {
      zeros2 = padZeros(max2, tok, options);
    }
    obj.string = zeros2 + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max2 + 1;
    prev = obj;
  }
  return tokens;
}
function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];
  for (let ele of arr) {
    let { string } = ele;
    if (!intersection && !contains(comparison, "string", string)) {
      result.push(prefix + string);
    }
    if (intersection && contains(comparison, "string", string)) {
      result.push(prefix + string);
    }
  }
  return result;
}
function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++)
    arr.push([a[i], b[i]]);
  return arr;
}
function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}
function contains(arr, key, val) {
  return arr.some((ele) => ele[key] === val);
}
function countNines(min, len) {
  return Number(String(min).slice(0, -len) + "9".repeat(len));
}
function countZeros(integer, zeros2) {
  return integer - integer % Math.pow(10, zeros2);
}
function toQuantifier(digits) {
  let [start = 0, stop = ""] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? "," + stop : "")}}`;
  }
  return "";
}
function toCharacterClass(a, b, options) {
  return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
}
function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}
function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }
  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;
  switch (diff) {
    case 0:
      return "";
    case 1:
      return relax ? "0?" : "0";
    case 2:
      return relax ? "0{0,2}" : "00";
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}
toRegexRange$1.cache = {};
toRegexRange$1.clearCache = () => toRegexRange$1.cache = {};
var toRegexRange_1 = toRegexRange$1;
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */
const util = require$$2__default["default"];
const toRegexRange = toRegexRange_1;
const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
const transform = (toNumber) => {
  return (value) => toNumber === true ? Number(value) : String(value);
};
const isValidValue = (value) => {
  return typeof value === "number" || typeof value === "string" && value !== "";
};
const isNumber = (num) => Number.isInteger(+num);
const zeros = (input) => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === "-")
    value = value.slice(1);
  if (value === "0")
    return false;
  while (value[++index] === "0")
    ;
  return index > 0;
};
const stringify$4 = (start, end, options) => {
  if (typeof start === "string" || typeof end === "string") {
    return true;
  }
  return options.stringify === true;
};
const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === "-" ? "-" : "";
    if (dash)
      input = input.slice(1);
    input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};
const toMaxLen = (input, maxLength) => {
  let negative = input[0] === "-" ? "-" : "";
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength)
    input = "0" + input;
  return negative ? "-" + input : input;
};
const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  let prefix = options.capture ? "" : "?:";
  let positives = "";
  let negatives = "";
  let result;
  if (parts.positives.length) {
    positives = parts.positives.join("|");
  }
  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join("|")})`;
  }
  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }
  if (options.wrap) {
    return `(${prefix}${result})`;
  }
  return result;
};
const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }
  let start = String.fromCharCode(a);
  if (a === b)
    return start;
  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};
const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? "" : "?:";
    return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
  }
  return toRegexRange(start, end, options);
};
const rangeError = (...args) => {
  return new RangeError("Invalid range arguments: " + util.inspect(...args));
};
const invalidRange = (start, end, options) => {
  if (options.strictRanges === true)
    throw rangeError([start, end]);
  return [];
};
const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};
const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true)
      throw rangeError([start, end]);
    return [];
  }
  if (a === 0)
    a = 0;
  if (b === 0)
    b = 0;
  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);
  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify$4(start, end, options) === false;
  let format = options.transform || transform(toNumber);
  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }
  let parts = { negatives: [], positives: [] };
  let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
  let range = [];
  let index = 0;
  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }
  if (options.toRegex === true) {
    return step > 1 ? toSequence(parts, options) : toRegex(range, null, { wrap: false, ...options });
  }
  return range;
};
const fillLetters = (start, end, step = 1, options = {}) => {
  if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
    return invalidRange(start, end, options);
  }
  let format = options.transform || ((val) => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);
  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }
  let range = [];
  let index = 0;
  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }
  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }
  return range;
};
const fill$2 = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }
  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }
  if (typeof step === "function") {
    return fill$2(start, end, 1, { transform: step });
  }
  if (isObject(step)) {
    return fill$2(start, end, 0, step);
  }
  let opts = { ...options };
  if (opts.capture === true)
    opts.wrap = true;
  step = step || opts.step || 1;
  if (!isNumber(step)) {
    if (step != null && !isObject(step))
      return invalidStep(step, opts);
    return fill$2(start, end, 1, step);
  }
  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }
  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};
var fillRange = fill$2;
const fill$1 = fillRange;
const utils$1 = utils$3;
const compile$1 = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils$1.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? "\\" : "";
    let output2 = "";
    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }
    if (node.type === "open") {
      return invalid ? prefix + node.value : "(";
    }
    if (node.type === "close") {
      return invalid ? prefix + node.value : ")";
    }
    if (node.type === "comma") {
      return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
    }
    if (node.value) {
      return node.value;
    }
    if (node.nodes && node.ranges > 0) {
      let args = utils$1.reduce(node.nodes);
      let range = fill$1(...args, { ...options, wrap: false, toRegex: true });
      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }
    if (node.nodes) {
      for (let child of node.nodes) {
        output2 += walk(child, node);
      }
    }
    return output2;
  };
  return walk(ast);
};
var compile_1 = compile$1;
const fill = fillRange;
const stringify$3 = stringify$5;
const utils = utils$3;
const append = (queue2 = "", stash = "", enclose = false) => {
  let result = [];
  queue2 = [].concat(queue2);
  stash = [].concat(stash);
  if (!stash.length)
    return queue2;
  if (!queue2.length) {
    return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
  }
  for (let item of queue2) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === "string")
          ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
      }
    }
  }
  return utils.flatten(result);
};
const expand$1 = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
  let walk = (node, parent = {}) => {
    node.queue = [];
    let p = parent;
    let q = parent.queue;
    while (p.type !== "brace" && p.type !== "root" && p.parent) {
      p = p.parent;
      q = p.queue;
    }
    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify$3(node, options)));
      return;
    }
    if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ["{}"]));
      return;
    }
    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);
      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
      }
      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify$3(node, options);
      }
      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }
    let enclose = utils.encloseBrace(node);
    let queue2 = node.queue;
    let block = node;
    while (block.type !== "brace" && block.type !== "root" && block.parent) {
      block = block.parent;
      queue2 = block.queue;
    }
    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];
      if (child.type === "comma" && node.type === "brace") {
        if (i === 1)
          queue2.push("");
        queue2.push("");
        continue;
      }
      if (child.type === "close") {
        q.push(append(q.pop(), queue2, enclose));
        continue;
      }
      if (child.value && child.type !== "open") {
        queue2.push(append(queue2.pop(), child.value));
        continue;
      }
      if (child.nodes) {
        walk(child, node);
      }
    }
    return queue2;
  };
  return utils.flatten(walk(ast));
};
var expand_1 = expand$1;
var constants$1 = {
  MAX_LENGTH: 1024 * 64,
  CHAR_0: "0",
  CHAR_9: "9",
  CHAR_UPPERCASE_A: "A",
  CHAR_LOWERCASE_A: "a",
  CHAR_UPPERCASE_Z: "Z",
  CHAR_LOWERCASE_Z: "z",
  CHAR_LEFT_PARENTHESES: "(",
  CHAR_RIGHT_PARENTHESES: ")",
  CHAR_ASTERISK: "*",
  CHAR_AMPERSAND: "&",
  CHAR_AT: "@",
  CHAR_BACKSLASH: "\\",
  CHAR_BACKTICK: "`",
  CHAR_CARRIAGE_RETURN: "\r",
  CHAR_CIRCUMFLEX_ACCENT: "^",
  CHAR_COLON: ":",
  CHAR_COMMA: ",",
  CHAR_DOLLAR: "$",
  CHAR_DOT: ".",
  CHAR_DOUBLE_QUOTE: '"',
  CHAR_EQUAL: "=",
  CHAR_EXCLAMATION_MARK: "!",
  CHAR_FORM_FEED: "\f",
  CHAR_FORWARD_SLASH: "/",
  CHAR_HASH: "#",
  CHAR_HYPHEN_MINUS: "-",
  CHAR_LEFT_ANGLE_BRACKET: "<",
  CHAR_LEFT_CURLY_BRACE: "{",
  CHAR_LEFT_SQUARE_BRACKET: "[",
  CHAR_LINE_FEED: "\n",
  CHAR_NO_BREAK_SPACE: "\xA0",
  CHAR_PERCENT: "%",
  CHAR_PLUS: "+",
  CHAR_QUESTION_MARK: "?",
  CHAR_RIGHT_ANGLE_BRACKET: ">",
  CHAR_RIGHT_CURLY_BRACE: "}",
  CHAR_RIGHT_SQUARE_BRACKET: "]",
  CHAR_SEMICOLON: ";",
  CHAR_SINGLE_QUOTE: "'",
  CHAR_SPACE: " ",
  CHAR_TAB: "	",
  CHAR_UNDERSCORE: "_",
  CHAR_VERTICAL_LINE: "|",
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
};
const stringify$2 = stringify$5;
const {
  MAX_LENGTH,
  CHAR_BACKSLASH,
  CHAR_BACKTICK,
  CHAR_COMMA,
  CHAR_DOT,
  CHAR_LEFT_PARENTHESES,
  CHAR_RIGHT_PARENTHESES,
  CHAR_LEFT_CURLY_BRACE,
  CHAR_RIGHT_CURLY_BRACE,
  CHAR_LEFT_SQUARE_BRACKET,
  CHAR_RIGHT_SQUARE_BRACKET,
  CHAR_DOUBLE_QUOTE,
  CHAR_SINGLE_QUOTE,
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = constants$1;
const parse$2 = (input, options = {}) => {
  if (typeof input !== "string") {
    throw new TypeError("Expected a string");
  }
  let opts = options || {};
  let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }
  let ast = { type: "root", input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth2 = 0;
  let value;
  const advance = () => input[index++];
  const push = (node) => {
    if (node.type === "text" && prev.type === "dot") {
      prev.type = "text";
    }
    if (prev && prev.type === "text" && node.type === "text") {
      prev.value += node.value;
      return;
    }
    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };
  push({ type: "bos" });
  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();
    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }
    if (value === CHAR_BACKSLASH) {
      push({ type: "text", value: (options.keepEscaping ? value : "") + advance() });
      continue;
    }
    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: "text", value: "\\" + value });
      continue;
    }
    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;
      let next;
      while (index < length && (next = advance())) {
        value += next;
        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }
        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }
        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;
          if (brackets === 0) {
            break;
          }
        }
      }
      push({ type: "text", value });
      continue;
    }
    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: "paren", nodes: [] });
      stack.push(block);
      push({ type: "text", value });
      continue;
    }
    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== "paren") {
        push({ type: "text", value });
        continue;
      }
      block = stack.pop();
      push({ type: "text", value });
      block = stack[stack.length - 1];
      continue;
    }
    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open2 = value;
      let next;
      if (options.keepQuotes !== true) {
        value = "";
      }
      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }
        if (next === open2) {
          if (options.keepQuotes === true)
            value += next;
          break;
        }
        value += next;
      }
      push({ type: "text", value });
      continue;
    }
    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth2++;
      let dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
      let brace = {
        type: "brace",
        open: true,
        close: false,
        dollar,
        depth: depth2,
        commas: 0,
        ranges: 0,
        nodes: []
      };
      block = push(brace);
      stack.push(block);
      push({ type: "open", value });
      continue;
    }
    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== "brace") {
        push({ type: "text", value });
        continue;
      }
      let type = "close";
      block = stack.pop();
      block.close = true;
      push({ type, value });
      depth2--;
      block = stack[stack.length - 1];
      continue;
    }
    if (value === CHAR_COMMA && depth2 > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open2 = block.nodes.shift();
        block.nodes = [open2, { type: "text", value: stringify$2(block) }];
      }
      push({ type: "comma", value });
      block.commas++;
      continue;
    }
    if (value === CHAR_DOT && depth2 > 0 && block.commas === 0) {
      let siblings = block.nodes;
      if (depth2 === 0 || siblings.length === 0) {
        push({ type: "text", value });
        continue;
      }
      if (prev.type === "dot") {
        block.range = [];
        prev.value += value;
        prev.type = "range";
        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = "text";
          continue;
        }
        block.ranges++;
        block.args = [];
        continue;
      }
      if (prev.type === "range") {
        siblings.pop();
        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }
      push({ type: "dot", value });
      continue;
    }
    push({ type: "text", value });
  }
  do {
    block = stack.pop();
    if (block.type !== "root") {
      block.nodes.forEach((node) => {
        if (!node.nodes) {
          if (node.type === "open")
            node.isOpen = true;
          if (node.type === "close")
            node.isClose = true;
          if (!node.nodes)
            node.type = "text";
          node.invalid = true;
        }
      });
      let parent = stack[stack.length - 1];
      let index2 = parent.nodes.indexOf(block);
      parent.nodes.splice(index2, 1, ...block.nodes);
    }
  } while (stack.length > 0);
  push({ type: "eos" });
  return ast;
};
var parse_1 = parse$2;
const stringify$1 = stringify$5;
const compile = compile_1;
const expand = expand_1;
const parse$1 = parse_1;
const braces$1 = (input, options = {}) => {
  let output2 = [];
  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces$1.create(pattern, options);
      if (Array.isArray(result)) {
        output2.push(...result);
      } else {
        output2.push(result);
      }
    }
  } else {
    output2 = [].concat(braces$1.create(input, options));
  }
  if (options && options.expand === true && options.nodupes === true) {
    output2 = [...new Set(output2)];
  }
  return output2;
};
braces$1.parse = (input, options = {}) => parse$1(input, options);
braces$1.stringify = (input, options = {}) => {
  if (typeof input === "string") {
    return stringify$1(braces$1.parse(input, options), options);
  }
  return stringify$1(input, options);
};
braces$1.compile = (input, options = {}) => {
  if (typeof input === "string") {
    input = braces$1.parse(input, options);
  }
  return compile(input, options);
};
braces$1.expand = (input, options = {}) => {
  if (typeof input === "string") {
    input = braces$1.parse(input, options);
  }
  let result = expand(input, options);
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }
  return result;
};
braces$1.create = (input, options = {}) => {
  if (input === "" || input.length < 3) {
    return [input];
  }
  return options.expand !== true ? braces$1.compile(input, options) : braces$1.expand(input, options);
};
var braces_1 = braces$1;
var require$$0 = [
  "3dm",
  "3ds",
  "3g2",
  "3gp",
  "7z",
  "a",
  "aac",
  "adp",
  "ai",
  "aif",
  "aiff",
  "alz",
  "ape",
  "apk",
  "appimage",
  "ar",
  "arj",
  "asf",
  "au",
  "avi",
  "bak",
  "baml",
  "bh",
  "bin",
  "bk",
  "bmp",
  "btif",
  "bz2",
  "bzip2",
  "cab",
  "caf",
  "cgm",
  "class",
  "cmx",
  "cpio",
  "cr2",
  "cur",
  "dat",
  "dcm",
  "deb",
  "dex",
  "djvu",
  "dll",
  "dmg",
  "dng",
  "doc",
  "docm",
  "docx",
  "dot",
  "dotm",
  "dra",
  "DS_Store",
  "dsk",
  "dts",
  "dtshd",
  "dvb",
  "dwg",
  "dxf",
  "ecelp4800",
  "ecelp7470",
  "ecelp9600",
  "egg",
  "eol",
  "eot",
  "epub",
  "exe",
  "f4v",
  "fbs",
  "fh",
  "fla",
  "flac",
  "flatpak",
  "fli",
  "flv",
  "fpx",
  "fst",
  "fvt",
  "g3",
  "gh",
  "gif",
  "graffle",
  "gz",
  "gzip",
  "h261",
  "h263",
  "h264",
  "icns",
  "ico",
  "ief",
  "img",
  "ipa",
  "iso",
  "jar",
  "jpeg",
  "jpg",
  "jpgv",
  "jpm",
  "jxr",
  "key",
  "ktx",
  "lha",
  "lib",
  "lvp",
  "lz",
  "lzh",
  "lzma",
  "lzo",
  "m3u",
  "m4a",
  "m4v",
  "mar",
  "mdi",
  "mht",
  "mid",
  "midi",
  "mj2",
  "mka",
  "mkv",
  "mmr",
  "mng",
  "mobi",
  "mov",
  "movie",
  "mp3",
  "mp4",
  "mp4a",
  "mpeg",
  "mpg",
  "mpga",
  "mxu",
  "nef",
  "npx",
  "numbers",
  "nupkg",
  "o",
  "odp",
  "ods",
  "odt",
  "oga",
  "ogg",
  "ogv",
  "otf",
  "ott",
  "pages",
  "pbm",
  "pcx",
  "pdb",
  "pdf",
  "pea",
  "pgm",
  "pic",
  "png",
  "pnm",
  "pot",
  "potm",
  "potx",
  "ppa",
  "ppam",
  "ppm",
  "pps",
  "ppsm",
  "ppsx",
  "ppt",
  "pptm",
  "pptx",
  "psd",
  "pya",
  "pyc",
  "pyo",
  "pyv",
  "qt",
  "rar",
  "ras",
  "raw",
  "resources",
  "rgb",
  "rip",
  "rlc",
  "rmf",
  "rmvb",
  "rpm",
  "rtf",
  "rz",
  "s3m",
  "s7z",
  "scpt",
  "sgi",
  "shar",
  "snap",
  "sil",
  "sketch",
  "slk",
  "smv",
  "snk",
  "so",
  "stl",
  "suo",
  "sub",
  "swf",
  "tar",
  "tbz",
  "tbz2",
  "tga",
  "tgz",
  "thmx",
  "tif",
  "tiff",
  "tlz",
  "ttc",
  "ttf",
  "txz",
  "udf",
  "uvh",
  "uvi",
  "uvm",
  "uvp",
  "uvs",
  "uvu",
  "viv",
  "vob",
  "war",
  "wav",
  "wax",
  "wbmp",
  "wdp",
  "weba",
  "webm",
  "webp",
  "whl",
  "wim",
  "wm",
  "wma",
  "wmv",
  "wmx",
  "woff",
  "woff2",
  "wrm",
  "wvx",
  "xbm",
  "xif",
  "xla",
  "xlam",
  "xls",
  "xlsb",
  "xlsm",
  "xlsx",
  "xlt",
  "xltm",
  "xltx",
  "xm",
  "xmind",
  "xpi",
  "xpm",
  "xwd",
  "xz",
  "z",
  "zip",
  "zipx"
];
var binaryExtensions$1 = require$$0;
const path = require$$1__default["default"];
const binaryExtensions = binaryExtensions$1;
const extensions = new Set(binaryExtensions);
var isBinaryPath$1 = (filePath) => extensions.has(path.extname(filePath).slice(1).toLowerCase());
var constants = {};
(function(exports) {
  const { sep } = require$$1__default["default"];
  const { platform: platform2 } = process;
  exports.EV_ALL = "all";
  exports.EV_READY = "ready";
  exports.EV_ADD = "add";
  exports.EV_CHANGE = "change";
  exports.EV_ADD_DIR = "addDir";
  exports.EV_UNLINK = "unlink";
  exports.EV_UNLINK_DIR = "unlinkDir";
  exports.EV_RAW = "raw";
  exports.EV_ERROR = "error";
  exports.STR_DATA = "data";
  exports.STR_END = "end";
  exports.STR_CLOSE = "close";
  exports.FSEVENT_CREATED = "created";
  exports.FSEVENT_MODIFIED = "modified";
  exports.FSEVENT_DELETED = "deleted";
  exports.FSEVENT_MOVED = "moved";
  exports.FSEVENT_CLONED = "cloned";
  exports.FSEVENT_UNKNOWN = "unknown";
  exports.FSEVENT_TYPE_FILE = "file";
  exports.FSEVENT_TYPE_DIRECTORY = "directory";
  exports.FSEVENT_TYPE_SYMLINK = "symlink";
  exports.KEY_LISTENERS = "listeners";
  exports.KEY_ERR = "errHandlers";
  exports.KEY_RAW = "rawEmitters";
  exports.HANDLER_KEYS = [exports.KEY_LISTENERS, exports.KEY_ERR, exports.KEY_RAW];
  exports.DOT_SLASH = `.${sep}`;
  exports.BACK_SLASH_RE = /\\/g;
  exports.DOUBLE_SLASH_RE = /\/\//;
  exports.SLASH_OR_BACK_SLASH_RE = /[/\\]/;
  exports.DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/;
  exports.REPLACER_RE = /^\.[/\\]/;
  exports.SLASH = "/";
  exports.SLASH_SLASH = "//";
  exports.BRACE_START = "{";
  exports.BANG = "!";
  exports.ONE_DOT = ".";
  exports.TWO_DOTS = "..";
  exports.STAR = "*";
  exports.GLOBSTAR = "**";
  exports.ROOT_GLOBSTAR = "/**/*";
  exports.SLASH_GLOBSTAR = "/**";
  exports.DIR_SUFFIX = "Dir";
  exports.ANYMATCH_OPTS = { dot: true };
  exports.STRING_TYPE = "string";
  exports.FUNCTION_TYPE = "function";
  exports.EMPTY_STR = "";
  exports.EMPTY_FN = () => {
  };
  exports.IDENTITY_FN = (val) => val;
  exports.isWindows = platform2 === "win32";
  exports.isMacos = platform2 === "darwin";
  exports.isLinux = platform2 === "linux";
})(constants);
const fs$2 = require$$0__default$2["default"];
const sysPath$2 = require$$1__default["default"];
const { promisify: promisify$2 } = require$$2__default["default"];
const isBinaryPath = isBinaryPath$1;
const {
  isWindows: isWindows$1,
  isLinux,
  EMPTY_FN: EMPTY_FN$2,
  EMPTY_STR: EMPTY_STR$1,
  KEY_LISTENERS,
  KEY_ERR,
  KEY_RAW,
  HANDLER_KEYS,
  EV_CHANGE: EV_CHANGE$2,
  EV_ADD: EV_ADD$2,
  EV_ADD_DIR: EV_ADD_DIR$2,
  EV_ERROR: EV_ERROR$2,
  STR_DATA: STR_DATA$1,
  STR_END: STR_END$2,
  BRACE_START: BRACE_START$1,
  STAR
} = constants;
const THROTTLE_MODE_WATCH = "watch";
const open = promisify$2(fs$2.open);
const stat$2 = promisify$2(fs$2.stat);
const lstat$1 = promisify$2(fs$2.lstat);
const close = promisify$2(fs$2.close);
const fsrealpath = promisify$2(fs$2.realpath);
const statMethods$1 = { lstat: lstat$1, stat: stat$2 };
const foreach = (val, fn) => {
  if (val instanceof Set) {
    val.forEach(fn);
  } else {
    fn(val);
  }
};
const addAndConvert = (main, prop, item) => {
  let container = main[prop];
  if (!(container instanceof Set)) {
    main[prop] = container = /* @__PURE__ */ new Set([container]);
  }
  container.add(item);
};
const clearItem = (cont) => (key) => {
  const set = cont[key];
  if (set instanceof Set) {
    set.clear();
  } else {
    delete cont[key];
  }
};
const delFromSet = (main, prop, item) => {
  const container = main[prop];
  if (container instanceof Set) {
    container.delete(item);
  } else if (container === item) {
    delete main[prop];
  }
};
const isEmptySet = (val) => val instanceof Set ? val.size === 0 : !val;
const FsWatchInstances = /* @__PURE__ */ new Map();
function createFsWatchInstance(path2, options, listener, errHandler, emitRaw) {
  const handleEvent = (rawEvent, evPath) => {
    listener(path2);
    emitRaw(rawEvent, evPath, { watchedPath: path2 });
    if (evPath && path2 !== evPath) {
      fsWatchBroadcast(
        sysPath$2.resolve(path2, evPath),
        KEY_LISTENERS,
        sysPath$2.join(path2, evPath)
      );
    }
  };
  try {
    return fs$2.watch(path2, options, handleEvent);
  } catch (error) {
    errHandler(error);
  }
}
const fsWatchBroadcast = (fullPath, type, val1, val2, val3) => {
  const cont = FsWatchInstances.get(fullPath);
  if (!cont)
    return;
  foreach(cont[type], (listener) => {
    listener(val1, val2, val3);
  });
};
const setFsWatchListener = (path2, fullPath, options, handlers) => {
  const { listener, errHandler, rawEmitter } = handlers;
  let cont = FsWatchInstances.get(fullPath);
  let watcher;
  if (!options.persistent) {
    watcher = createFsWatchInstance(
      path2,
      options,
      listener,
      errHandler,
      rawEmitter
    );
    return watcher.close.bind(watcher);
  }
  if (cont) {
    addAndConvert(cont, KEY_LISTENERS, listener);
    addAndConvert(cont, KEY_ERR, errHandler);
    addAndConvert(cont, KEY_RAW, rawEmitter);
  } else {
    watcher = createFsWatchInstance(
      path2,
      options,
      fsWatchBroadcast.bind(null, fullPath, KEY_LISTENERS),
      errHandler,
      fsWatchBroadcast.bind(null, fullPath, KEY_RAW)
    );
    if (!watcher)
      return;
    watcher.on(EV_ERROR$2, async (error) => {
      const broadcastErr = fsWatchBroadcast.bind(null, fullPath, KEY_ERR);
      cont.watcherUnusable = true;
      if (isWindows$1 && error.code === "EPERM") {
        try {
          const fd = await open(path2, "r");
          await close(fd);
          broadcastErr(error);
        } catch (err) {
        }
      } else {
        broadcastErr(error);
      }
    });
    cont = {
      listeners: listener,
      errHandlers: errHandler,
      rawEmitters: rawEmitter,
      watcher
    };
    FsWatchInstances.set(fullPath, cont);
  }
  return () => {
    delFromSet(cont, KEY_LISTENERS, listener);
    delFromSet(cont, KEY_ERR, errHandler);
    delFromSet(cont, KEY_RAW, rawEmitter);
    if (isEmptySet(cont.listeners)) {
      cont.watcher.close();
      FsWatchInstances.delete(fullPath);
      HANDLER_KEYS.forEach(clearItem(cont));
      cont.watcher = void 0;
      Object.freeze(cont);
    }
  };
};
const FsWatchFileInstances = /* @__PURE__ */ new Map();
const setFsWatchFileListener = (path2, fullPath, options, handlers) => {
  const { listener, rawEmitter } = handlers;
  let cont = FsWatchFileInstances.get(fullPath);
  const copts = cont && cont.options;
  if (copts && (copts.persistent < options.persistent || copts.interval > options.interval)) {
    cont.listeners;
    cont.rawEmitters;
    fs$2.unwatchFile(fullPath);
    cont = void 0;
  }
  if (cont) {
    addAndConvert(cont, KEY_LISTENERS, listener);
    addAndConvert(cont, KEY_RAW, rawEmitter);
  } else {
    cont = {
      listeners: listener,
      rawEmitters: rawEmitter,
      options,
      watcher: fs$2.watchFile(fullPath, options, (curr, prev) => {
        foreach(cont.rawEmitters, (rawEmitter2) => {
          rawEmitter2(EV_CHANGE$2, fullPath, { curr, prev });
        });
        const currmtime = curr.mtimeMs;
        if (curr.size !== prev.size || currmtime > prev.mtimeMs || currmtime === 0) {
          foreach(cont.listeners, (listener2) => listener2(path2, curr));
        }
      })
    };
    FsWatchFileInstances.set(fullPath, cont);
  }
  return () => {
    delFromSet(cont, KEY_LISTENERS, listener);
    delFromSet(cont, KEY_RAW, rawEmitter);
    if (isEmptySet(cont.listeners)) {
      FsWatchFileInstances.delete(fullPath);
      fs$2.unwatchFile(fullPath);
      cont.options = cont.watcher = void 0;
      Object.freeze(cont);
    }
  };
};
class NodeFsHandler$1 {
  constructor(fsW) {
    this.fsw = fsW;
    this._boundHandleError = (error) => fsW._handleError(error);
  }
  _watchWithNodeFs(path2, listener) {
    const opts = this.fsw.options;
    const directory = sysPath$2.dirname(path2);
    const basename = sysPath$2.basename(path2);
    const parent = this.fsw._getWatchedDir(directory);
    parent.add(basename);
    const absolutePath = sysPath$2.resolve(path2);
    const options = { persistent: opts.persistent };
    if (!listener)
      listener = EMPTY_FN$2;
    let closer;
    if (opts.usePolling) {
      options.interval = opts.enableBinaryInterval && isBinaryPath(basename) ? opts.binaryInterval : opts.interval;
      closer = setFsWatchFileListener(path2, absolutePath, options, {
        listener,
        rawEmitter: this.fsw._emitRaw
      });
    } else {
      closer = setFsWatchListener(path2, absolutePath, options, {
        listener,
        errHandler: this._boundHandleError,
        rawEmitter: this.fsw._emitRaw
      });
    }
    return closer;
  }
  _handleFile(file2, stats, initialAdd) {
    if (this.fsw.closed) {
      return;
    }
    const dirname = sysPath$2.dirname(file2);
    const basename = sysPath$2.basename(file2);
    const parent = this.fsw._getWatchedDir(dirname);
    let prevStats = stats;
    if (parent.has(basename))
      return;
    const listener = async (path2, newStats) => {
      if (!this.fsw._throttle(THROTTLE_MODE_WATCH, file2, 5))
        return;
      if (!newStats || newStats.mtimeMs === 0) {
        try {
          const newStats2 = await stat$2(file2);
          if (this.fsw.closed)
            return;
          const at = newStats2.atimeMs;
          const mt = newStats2.mtimeMs;
          if (!at || at <= mt || mt !== prevStats.mtimeMs) {
            this.fsw._emit(EV_CHANGE$2, file2, newStats2);
          }
          if (isLinux && prevStats.ino !== newStats2.ino) {
            this.fsw._closeFile(path2);
            prevStats = newStats2;
            this.fsw._addPathCloser(path2, this._watchWithNodeFs(file2, listener));
          } else {
            prevStats = newStats2;
          }
        } catch (error) {
          this.fsw._remove(dirname, basename);
        }
      } else if (parent.has(basename)) {
        const at = newStats.atimeMs;
        const mt = newStats.mtimeMs;
        if (!at || at <= mt || mt !== prevStats.mtimeMs) {
          this.fsw._emit(EV_CHANGE$2, file2, newStats);
        }
        prevStats = newStats;
      }
    };
    const closer = this._watchWithNodeFs(file2, listener);
    if (!(initialAdd && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file2)) {
      if (!this.fsw._throttle(EV_ADD$2, file2, 0))
        return;
      this.fsw._emit(EV_ADD$2, file2, stats);
    }
    return closer;
  }
  async _handleSymlink(entry, directory, path2, item) {
    if (this.fsw.closed) {
      return;
    }
    const full = entry.fullPath;
    const dir = this.fsw._getWatchedDir(directory);
    if (!this.fsw.options.followSymlinks) {
      this.fsw._incrReadyCount();
      const linkPath = await fsrealpath(path2);
      if (this.fsw.closed)
        return;
      if (dir.has(item)) {
        if (this.fsw._symlinkPaths.get(full) !== linkPath) {
          this.fsw._symlinkPaths.set(full, linkPath);
          this.fsw._emit(EV_CHANGE$2, path2, entry.stats);
        }
      } else {
        dir.add(item);
        this.fsw._symlinkPaths.set(full, linkPath);
        this.fsw._emit(EV_ADD$2, path2, entry.stats);
      }
      this.fsw._emitReady();
      return true;
    }
    if (this.fsw._symlinkPaths.has(full)) {
      return true;
    }
    this.fsw._symlinkPaths.set(full, true);
  }
  _handleRead(directory, initialAdd, wh, target, dir, depth2, throttler) {
    directory = sysPath$2.join(directory, EMPTY_STR$1);
    if (!wh.hasGlob) {
      throttler = this.fsw._throttle("readdir", directory, 1e3);
      if (!throttler)
        return;
    }
    const previous = this.fsw._getWatchedDir(wh.path);
    const current = /* @__PURE__ */ new Set();
    let stream = this.fsw._readdirp(directory, {
      fileFilter: (entry) => wh.filterPath(entry),
      directoryFilter: (entry) => wh.filterDir(entry),
      depth: 0
    }).on(STR_DATA$1, async (entry) => {
      if (this.fsw.closed) {
        stream = void 0;
        return;
      }
      const item = entry.path;
      let path2 = sysPath$2.join(directory, item);
      current.add(item);
      if (entry.stats.isSymbolicLink() && await this._handleSymlink(entry, directory, path2, item)) {
        return;
      }
      if (this.fsw.closed) {
        stream = void 0;
        return;
      }
      if (item === target || !target && !previous.has(item)) {
        this.fsw._incrReadyCount();
        path2 = sysPath$2.join(dir, sysPath$2.relative(dir, path2));
        this._addToNodeFs(path2, initialAdd, wh, depth2 + 1);
      }
    }).on(EV_ERROR$2, this._boundHandleError);
    return new Promise(
      (resolve) => stream.once(STR_END$2, () => {
        if (this.fsw.closed) {
          stream = void 0;
          return;
        }
        const wasThrottled = throttler ? throttler.clear() : false;
        resolve();
        previous.getChildren().filter((item) => {
          return item !== directory && !current.has(item) && (!wh.hasGlob || wh.filterPath({
            fullPath: sysPath$2.resolve(directory, item)
          }));
        }).forEach((item) => {
          this.fsw._remove(directory, item);
        });
        stream = void 0;
        if (wasThrottled)
          this._handleRead(directory, false, wh, target, dir, depth2, throttler);
      })
    );
  }
  async _handleDir(dir, stats, initialAdd, depth2, target, wh, realpath2) {
    const parentDir = this.fsw._getWatchedDir(sysPath$2.dirname(dir));
    const tracked = parentDir.has(sysPath$2.basename(dir));
    if (!(initialAdd && this.fsw.options.ignoreInitial) && !target && !tracked) {
      if (!wh.hasGlob || wh.globFilter(dir))
        this.fsw._emit(EV_ADD_DIR$2, dir, stats);
    }
    parentDir.add(sysPath$2.basename(dir));
    this.fsw._getWatchedDir(dir);
    let throttler;
    let closer;
    const oDepth = this.fsw.options.depth;
    if ((oDepth == null || depth2 <= oDepth) && !this.fsw._symlinkPaths.has(realpath2)) {
      if (!target) {
        await this._handleRead(dir, initialAdd, wh, target, dir, depth2, throttler);
        if (this.fsw.closed)
          return;
      }
      closer = this._watchWithNodeFs(dir, (dirPath, stats2) => {
        if (stats2 && stats2.mtimeMs === 0)
          return;
        this._handleRead(dirPath, false, wh, target, dir, depth2, throttler);
      });
    }
    return closer;
  }
  async _addToNodeFs(path2, initialAdd, priorWh, depth2, target) {
    const ready = this.fsw._emitReady;
    if (this.fsw._isIgnored(path2) || this.fsw.closed) {
      ready();
      return false;
    }
    const wh = this.fsw._getWatchHelpers(path2, depth2);
    if (!wh.hasGlob && priorWh) {
      wh.hasGlob = priorWh.hasGlob;
      wh.globFilter = priorWh.globFilter;
      wh.filterPath = (entry) => priorWh.filterPath(entry);
      wh.filterDir = (entry) => priorWh.filterDir(entry);
    }
    try {
      const stats = await statMethods$1[wh.statMethod](wh.watchPath);
      if (this.fsw.closed)
        return;
      if (this.fsw._isIgnored(wh.watchPath, stats)) {
        ready();
        return false;
      }
      const follow = this.fsw.options.followSymlinks && !path2.includes(STAR) && !path2.includes(BRACE_START$1);
      let closer;
      if (stats.isDirectory()) {
        const absPath = sysPath$2.resolve(path2);
        const targetPath = follow ? await fsrealpath(path2) : path2;
        if (this.fsw.closed)
          return;
        closer = await this._handleDir(wh.watchPath, stats, initialAdd, depth2, target, wh, targetPath);
        if (this.fsw.closed)
          return;
        if (absPath !== targetPath && targetPath !== void 0) {
          this.fsw._symlinkPaths.set(absPath, targetPath);
        }
      } else if (stats.isSymbolicLink()) {
        const targetPath = follow ? await fsrealpath(path2) : path2;
        if (this.fsw.closed)
          return;
        const parent = sysPath$2.dirname(wh.watchPath);
        this.fsw._getWatchedDir(parent).add(wh.watchPath);
        this.fsw._emit(EV_ADD$2, wh.watchPath, stats);
        closer = await this._handleDir(parent, stats, initialAdd, depth2, path2, wh, targetPath);
        if (this.fsw.closed)
          return;
        if (targetPath !== void 0) {
          this.fsw._symlinkPaths.set(sysPath$2.resolve(path2), targetPath);
        }
      } else {
        closer = this._handleFile(wh.watchPath, stats, initialAdd);
      }
      ready();
      this.fsw._addPathCloser(path2, closer);
      return false;
    } catch (error) {
      if (this.fsw._handleError(error)) {
        ready();
        return path2;
      }
    }
  }
}
var nodefsHandler = NodeFsHandler$1;
var fseventsHandler = { exports: {} };
const fs$1 = require$$0__default$2["default"];
const sysPath$1 = require$$1__default["default"];
const { promisify: promisify$1 } = require$$2__default["default"];
let fsevents;
try {
  fsevents = require("fsevents");
} catch (error) {
  if ({}.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR)
    console.error(error);
}
if (fsevents) {
  const mtch = process.version.match(/v(\d+)\.(\d+)/);
  if (mtch && mtch[1] && mtch[2]) {
    const maj = Number.parseInt(mtch[1], 10);
    const min = Number.parseInt(mtch[2], 10);
    if (maj === 8 && min < 16) {
      fsevents = void 0;
    }
  }
}
const {
  EV_ADD: EV_ADD$1,
  EV_CHANGE: EV_CHANGE$1,
  EV_ADD_DIR: EV_ADD_DIR$1,
  EV_UNLINK: EV_UNLINK$1,
  EV_ERROR: EV_ERROR$1,
  STR_DATA,
  STR_END: STR_END$1,
  FSEVENT_CREATED,
  FSEVENT_MODIFIED,
  FSEVENT_DELETED,
  FSEVENT_MOVED,
  FSEVENT_UNKNOWN,
  FSEVENT_TYPE_FILE,
  FSEVENT_TYPE_DIRECTORY,
  FSEVENT_TYPE_SYMLINK,
  ROOT_GLOBSTAR,
  DIR_SUFFIX,
  DOT_SLASH,
  FUNCTION_TYPE: FUNCTION_TYPE$1,
  EMPTY_FN: EMPTY_FN$1,
  IDENTITY_FN
} = constants;
const Depth = (value) => isNaN(value) ? {} : { depth: value };
const stat$1 = promisify$1(fs$1.stat);
const lstat = promisify$1(fs$1.lstat);
const realpath = promisify$1(fs$1.realpath);
const statMethods = { stat: stat$1, lstat };
const FSEventsWatchers = /* @__PURE__ */ new Map();
const consolidateThreshhold = 10;
const wrongEventFlags = /* @__PURE__ */ new Set([
  69888,
  70400,
  71424,
  72704,
  73472,
  131328,
  131840,
  262912
]);
const createFSEventsInstance = (path2, callback) => {
  const stop = fsevents.watch(path2, callback);
  return { stop };
};
function setFSEventsListener(path2, realPath, listener, rawEmitter) {
  let watchPath = sysPath$1.extname(path2) ? sysPath$1.dirname(path2) : path2;
  const parentPath = sysPath$1.dirname(watchPath);
  let cont = FSEventsWatchers.get(watchPath);
  if (couldConsolidate(parentPath)) {
    watchPath = parentPath;
  }
  const resolvedPath = sysPath$1.resolve(path2);
  const hasSymlink = resolvedPath !== realPath;
  const filteredListener = (fullPath, flags, info) => {
    if (hasSymlink)
      fullPath = fullPath.replace(realPath, resolvedPath);
    if (fullPath === resolvedPath || !fullPath.indexOf(resolvedPath + sysPath$1.sep))
      listener(fullPath, flags, info);
  };
  let watchedParent = false;
  for (const watchedPath of FSEventsWatchers.keys()) {
    if (realPath.indexOf(sysPath$1.resolve(watchedPath) + sysPath$1.sep) === 0) {
      watchPath = watchedPath;
      cont = FSEventsWatchers.get(watchPath);
      watchedParent = true;
      break;
    }
  }
  if (cont || watchedParent) {
    cont.listeners.add(filteredListener);
  } else {
    cont = {
      listeners: /* @__PURE__ */ new Set([filteredListener]),
      rawEmitter,
      watcher: createFSEventsInstance(watchPath, (fullPath, flags) => {
        if (!cont.listeners.size)
          return;
        const info = fsevents.getInfo(fullPath, flags);
        cont.listeners.forEach((list) => {
          list(fullPath, flags, info);
        });
        cont.rawEmitter(info.event, fullPath, info);
      })
    };
    FSEventsWatchers.set(watchPath, cont);
  }
  return () => {
    const lst = cont.listeners;
    lst.delete(filteredListener);
    if (!lst.size) {
      FSEventsWatchers.delete(watchPath);
      if (cont.watcher)
        return cont.watcher.stop().then(() => {
          cont.rawEmitter = cont.watcher = void 0;
          Object.freeze(cont);
        });
    }
  };
}
const couldConsolidate = (path2) => {
  let count = 0;
  for (const watchPath of FSEventsWatchers.keys()) {
    if (watchPath.indexOf(path2) === 0) {
      count++;
      if (count >= consolidateThreshhold) {
        return true;
      }
    }
  }
  return false;
};
const canUse = () => fsevents && FSEventsWatchers.size < 128;
const calcDepth = (path2, root) => {
  let i = 0;
  while (!path2.indexOf(root) && (path2 = sysPath$1.dirname(path2)) !== root)
    i++;
  return i;
};
const sameTypes = (info, stats) => info.type === FSEVENT_TYPE_DIRECTORY && stats.isDirectory() || info.type === FSEVENT_TYPE_SYMLINK && stats.isSymbolicLink() || info.type === FSEVENT_TYPE_FILE && stats.isFile();
class FsEventsHandler$1 {
  constructor(fsw) {
    this.fsw = fsw;
  }
  checkIgnored(path2, stats) {
    const ipaths = this.fsw._ignoredPaths;
    if (this.fsw._isIgnored(path2, stats)) {
      ipaths.add(path2);
      if (stats && stats.isDirectory()) {
        ipaths.add(path2 + ROOT_GLOBSTAR);
      }
      return true;
    }
    ipaths.delete(path2);
    ipaths.delete(path2 + ROOT_GLOBSTAR);
  }
  addOrChange(path2, fullPath, realPath, parent, watchedDir, item, info, opts) {
    const event = watchedDir.has(item) ? EV_CHANGE$1 : EV_ADD$1;
    this.handleEvent(event, path2, fullPath, realPath, parent, watchedDir, item, info, opts);
  }
  async checkExists(path2, fullPath, realPath, parent, watchedDir, item, info, opts) {
    try {
      const stats = await stat$1(path2);
      if (this.fsw.closed)
        return;
      if (sameTypes(info, stats)) {
        this.addOrChange(path2, fullPath, realPath, parent, watchedDir, item, info, opts);
      } else {
        this.handleEvent(EV_UNLINK$1, path2, fullPath, realPath, parent, watchedDir, item, info, opts);
      }
    } catch (error) {
      if (error.code === "EACCES") {
        this.addOrChange(path2, fullPath, realPath, parent, watchedDir, item, info, opts);
      } else {
        this.handleEvent(EV_UNLINK$1, path2, fullPath, realPath, parent, watchedDir, item, info, opts);
      }
    }
  }
  handleEvent(event, path2, fullPath, realPath, parent, watchedDir, item, info, opts) {
    if (this.fsw.closed || this.checkIgnored(path2))
      return;
    if (event === EV_UNLINK$1) {
      const isDirectory = info.type === FSEVENT_TYPE_DIRECTORY;
      if (isDirectory || watchedDir.has(item)) {
        this.fsw._remove(parent, item, isDirectory);
      }
    } else {
      if (event === EV_ADD$1) {
        if (info.type === FSEVENT_TYPE_DIRECTORY)
          this.fsw._getWatchedDir(path2);
        if (info.type === FSEVENT_TYPE_SYMLINK && opts.followSymlinks) {
          const curDepth = opts.depth === void 0 ? void 0 : calcDepth(fullPath, realPath) + 1;
          return this._addToFsEvents(path2, false, true, curDepth);
        }
        this.fsw._getWatchedDir(parent).add(item);
      }
      const eventName = info.type === FSEVENT_TYPE_DIRECTORY ? event + DIR_SUFFIX : event;
      this.fsw._emit(eventName, path2);
      if (eventName === EV_ADD_DIR$1)
        this._addToFsEvents(path2, false, true);
    }
  }
  _watchWithFsEvents(watchPath, realPath, transform2, globFilter) {
    if (this.fsw.closed || this.fsw._isIgnored(watchPath))
      return;
    const opts = this.fsw.options;
    const watchCallback = async (fullPath, flags, info) => {
      if (this.fsw.closed)
        return;
      if (opts.depth !== void 0 && calcDepth(fullPath, realPath) > opts.depth)
        return;
      const path2 = transform2(sysPath$1.join(
        watchPath,
        sysPath$1.relative(watchPath, fullPath)
      ));
      if (globFilter && !globFilter(path2))
        return;
      const parent = sysPath$1.dirname(path2);
      const item = sysPath$1.basename(path2);
      const watchedDir = this.fsw._getWatchedDir(
        info.type === FSEVENT_TYPE_DIRECTORY ? path2 : parent
      );
      if (wrongEventFlags.has(flags) || info.event === FSEVENT_UNKNOWN) {
        if (typeof opts.ignored === FUNCTION_TYPE$1) {
          let stats;
          try {
            stats = await stat$1(path2);
          } catch (error) {
          }
          if (this.fsw.closed)
            return;
          if (this.checkIgnored(path2, stats))
            return;
          if (sameTypes(info, stats)) {
            this.addOrChange(path2, fullPath, realPath, parent, watchedDir, item, info, opts);
          } else {
            this.handleEvent(EV_UNLINK$1, path2, fullPath, realPath, parent, watchedDir, item, info, opts);
          }
        } else {
          this.checkExists(path2, fullPath, realPath, parent, watchedDir, item, info, opts);
        }
      } else {
        switch (info.event) {
          case FSEVENT_CREATED:
          case FSEVENT_MODIFIED:
            return this.addOrChange(path2, fullPath, realPath, parent, watchedDir, item, info, opts);
          case FSEVENT_DELETED:
          case FSEVENT_MOVED:
            return this.checkExists(path2, fullPath, realPath, parent, watchedDir, item, info, opts);
        }
      }
    };
    const closer = setFSEventsListener(
      watchPath,
      realPath,
      watchCallback,
      this.fsw._emitRaw
    );
    this.fsw._emitReady();
    return closer;
  }
  async _handleFsEventsSymlink(linkPath, fullPath, transform2, curDepth) {
    if (this.fsw.closed || this.fsw._symlinkPaths.has(fullPath))
      return;
    this.fsw._symlinkPaths.set(fullPath, true);
    this.fsw._incrReadyCount();
    try {
      const linkTarget = await realpath(linkPath);
      if (this.fsw.closed)
        return;
      if (this.fsw._isIgnored(linkTarget)) {
        return this.fsw._emitReady();
      }
      this.fsw._incrReadyCount();
      this._addToFsEvents(linkTarget || linkPath, (path2) => {
        let aliasedPath = linkPath;
        if (linkTarget && linkTarget !== DOT_SLASH) {
          aliasedPath = path2.replace(linkTarget, linkPath);
        } else if (path2 !== DOT_SLASH) {
          aliasedPath = sysPath$1.join(linkPath, path2);
        }
        return transform2(aliasedPath);
      }, false, curDepth);
    } catch (error) {
      if (this.fsw._handleError(error)) {
        return this.fsw._emitReady();
      }
    }
  }
  emitAdd(newPath, stats, processPath, opts, forceAdd) {
    const pp = processPath(newPath);
    const isDir = stats.isDirectory();
    const dirObj = this.fsw._getWatchedDir(sysPath$1.dirname(pp));
    const base = sysPath$1.basename(pp);
    if (isDir)
      this.fsw._getWatchedDir(pp);
    if (dirObj.has(base))
      return;
    dirObj.add(base);
    if (!opts.ignoreInitial || forceAdd === true) {
      this.fsw._emit(isDir ? EV_ADD_DIR$1 : EV_ADD$1, pp, stats);
    }
  }
  initWatch(realPath, path2, wh, processPath) {
    if (this.fsw.closed)
      return;
    const closer = this._watchWithFsEvents(
      wh.watchPath,
      sysPath$1.resolve(realPath || wh.watchPath),
      processPath,
      wh.globFilter
    );
    this.fsw._addPathCloser(path2, closer);
  }
  async _addToFsEvents(path2, transform2, forceAdd, priorDepth) {
    if (this.fsw.closed) {
      return;
    }
    const opts = this.fsw.options;
    const processPath = typeof transform2 === FUNCTION_TYPE$1 ? transform2 : IDENTITY_FN;
    const wh = this.fsw._getWatchHelpers(path2);
    try {
      const stats = await statMethods[wh.statMethod](wh.watchPath);
      if (this.fsw.closed)
        return;
      if (this.fsw._isIgnored(wh.watchPath, stats)) {
        throw null;
      }
      if (stats.isDirectory()) {
        if (!wh.globFilter)
          this.emitAdd(processPath(path2), stats, processPath, opts, forceAdd);
        if (priorDepth && priorDepth > opts.depth)
          return;
        this.fsw._readdirp(wh.watchPath, {
          fileFilter: (entry) => wh.filterPath(entry),
          directoryFilter: (entry) => wh.filterDir(entry),
          ...Depth(opts.depth - (priorDepth || 0))
        }).on(STR_DATA, (entry) => {
          if (this.fsw.closed) {
            return;
          }
          if (entry.stats.isDirectory() && !wh.filterPath(entry))
            return;
          const joinedPath = sysPath$1.join(wh.watchPath, entry.path);
          const { fullPath } = entry;
          if (wh.followSymlinks && entry.stats.isSymbolicLink()) {
            const curDepth = opts.depth === void 0 ? void 0 : calcDepth(joinedPath, sysPath$1.resolve(wh.watchPath)) + 1;
            this._handleFsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
          } else {
            this.emitAdd(joinedPath, entry.stats, processPath, opts, forceAdd);
          }
        }).on(EV_ERROR$1, EMPTY_FN$1).on(STR_END$1, () => {
          this.fsw._emitReady();
        });
      } else {
        this.emitAdd(wh.watchPath, stats, processPath, opts, forceAdd);
        this.fsw._emitReady();
      }
    } catch (error) {
      if (!error || this.fsw._handleError(error)) {
        this.fsw._emitReady();
        this.fsw._emitReady();
      }
    }
    if (opts.persistent && forceAdd !== true) {
      if (typeof transform2 === FUNCTION_TYPE$1) {
        this.initWatch(void 0, path2, wh, processPath);
      } else {
        let realPath;
        try {
          realPath = await realpath(wh.watchPath);
        } catch (e) {
        }
        this.initWatch(realPath, path2, wh, processPath);
      }
    }
  }
}
fseventsHandler.exports = FsEventsHandler$1;
fseventsHandler.exports.canUse = canUse;
const { EventEmitter } = require$$0__default$3["default"];
const fs = require$$0__default$2["default"];
const sysPath = require$$1__default["default"];
const { promisify } = require$$2__default["default"];
const readdirp = readdirp_1;
const anymatch = anymatch$2.exports.default;
const globParent = globParent$1;
const isGlob = isGlob$2;
const braces = braces_1;
const normalizePath = normalizePath$2;
const NodeFsHandler = nodefsHandler;
const FsEventsHandler = fseventsHandler.exports;
const {
  EV_ALL,
  EV_READY,
  EV_ADD,
  EV_CHANGE,
  EV_UNLINK,
  EV_ADD_DIR,
  EV_UNLINK_DIR,
  EV_RAW,
  EV_ERROR,
  STR_CLOSE,
  STR_END,
  BACK_SLASH_RE,
  DOUBLE_SLASH_RE,
  SLASH_OR_BACK_SLASH_RE,
  DOT_RE,
  REPLACER_RE,
  SLASH,
  SLASH_SLASH,
  BRACE_START,
  BANG,
  ONE_DOT,
  TWO_DOTS,
  GLOBSTAR,
  SLASH_GLOBSTAR,
  ANYMATCH_OPTS,
  STRING_TYPE,
  FUNCTION_TYPE,
  EMPTY_STR,
  EMPTY_FN,
  isWindows,
  isMacos
} = constants;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const arrify = (value = []) => Array.isArray(value) ? value : [value];
const flatten = (list, result = []) => {
  list.forEach((item) => {
    if (Array.isArray(item)) {
      flatten(item, result);
    } else {
      result.push(item);
    }
  });
  return result;
};
const unifyPaths = (paths_) => {
  const paths = flatten(arrify(paths_));
  if (!paths.every((p) => typeof p === STRING_TYPE)) {
    throw new TypeError(`Non-string provided as watch path: ${paths}`);
  }
  return paths.map(normalizePathToUnix);
};
const toUnix = (string) => {
  let str = string.replace(BACK_SLASH_RE, SLASH);
  let prepend = false;
  if (str.startsWith(SLASH_SLASH)) {
    prepend = true;
  }
  while (str.match(DOUBLE_SLASH_RE)) {
    str = str.replace(DOUBLE_SLASH_RE, SLASH);
  }
  if (prepend) {
    str = SLASH + str;
  }
  return str;
};
const normalizePathToUnix = (path2) => toUnix(sysPath.normalize(toUnix(path2)));
const normalizeIgnored = (cwd2 = EMPTY_STR) => (path2) => {
  if (typeof path2 !== STRING_TYPE)
    return path2;
  return normalizePathToUnix(sysPath.isAbsolute(path2) ? path2 : sysPath.join(cwd2, path2));
};
const getAbsolutePath = (path2, cwd2) => {
  if (sysPath.isAbsolute(path2)) {
    return path2;
  }
  if (path2.startsWith(BANG)) {
    return BANG + sysPath.join(cwd2, path2.slice(1));
  }
  return sysPath.join(cwd2, path2);
};
const undef = (opts, key) => opts[key] === void 0;
class DirEntry {
  constructor(dir, removeWatcher) {
    this.path = dir;
    this._removeWatcher = removeWatcher;
    this.items = /* @__PURE__ */ new Set();
  }
  add(item) {
    const { items } = this;
    if (!items)
      return;
    if (item !== ONE_DOT && item !== TWO_DOTS)
      items.add(item);
  }
  async remove(item) {
    const { items } = this;
    if (!items)
      return;
    items.delete(item);
    if (items.size > 0)
      return;
    const dir = this.path;
    try {
      await readdir(dir);
    } catch (err) {
      if (this._removeWatcher) {
        this._removeWatcher(sysPath.dirname(dir), sysPath.basename(dir));
      }
    }
  }
  has(item) {
    const { items } = this;
    if (!items)
      return;
    return items.has(item);
  }
  getChildren() {
    const { items } = this;
    if (!items)
      return;
    return [...items.values()];
  }
  dispose() {
    this.items.clear();
    delete this.path;
    delete this._removeWatcher;
    delete this.items;
    Object.freeze(this);
  }
}
const STAT_METHOD_F = "stat";
const STAT_METHOD_L = "lstat";
class WatchHelper {
  constructor(path2, watchPath, follow, fsw) {
    this.fsw = fsw;
    this.path = path2 = path2.replace(REPLACER_RE, EMPTY_STR);
    this.watchPath = watchPath;
    this.fullWatchPath = sysPath.resolve(watchPath);
    this.hasGlob = watchPath !== path2;
    if (path2 === EMPTY_STR)
      this.hasGlob = false;
    this.globSymlink = this.hasGlob && follow ? void 0 : false;
    this.globFilter = this.hasGlob ? anymatch(path2, void 0, ANYMATCH_OPTS) : false;
    this.dirParts = this.getDirParts(path2);
    this.dirParts.forEach((parts) => {
      if (parts.length > 1)
        parts.pop();
    });
    this.followSymlinks = follow;
    this.statMethod = follow ? STAT_METHOD_F : STAT_METHOD_L;
  }
  checkGlobSymlink(entry) {
    if (this.globSymlink === void 0) {
      this.globSymlink = entry.fullParentDir === this.fullWatchPath ? false : { realPath: entry.fullParentDir, linkPath: this.fullWatchPath };
    }
    if (this.globSymlink) {
      return entry.fullPath.replace(this.globSymlink.realPath, this.globSymlink.linkPath);
    }
    return entry.fullPath;
  }
  entryPath(entry) {
    return sysPath.join(
      this.watchPath,
      sysPath.relative(this.watchPath, this.checkGlobSymlink(entry))
    );
  }
  filterPath(entry) {
    const { stats } = entry;
    if (stats && stats.isSymbolicLink())
      return this.filterDir(entry);
    const resolvedPath = this.entryPath(entry);
    const matchesGlob = this.hasGlob && typeof this.globFilter === FUNCTION_TYPE ? this.globFilter(resolvedPath) : true;
    return matchesGlob && this.fsw._isntIgnored(resolvedPath, stats) && this.fsw._hasReadPermissions(stats);
  }
  getDirParts(path2) {
    if (!this.hasGlob)
      return [];
    const parts = [];
    const expandedPath = path2.includes(BRACE_START) ? braces.expand(path2) : [path2];
    expandedPath.forEach((path3) => {
      parts.push(sysPath.relative(this.watchPath, path3).split(SLASH_OR_BACK_SLASH_RE));
    });
    return parts;
  }
  filterDir(entry) {
    if (this.hasGlob) {
      const entryParts = this.getDirParts(this.checkGlobSymlink(entry));
      let globstar = false;
      this.unmatchedGlob = !this.dirParts.some((parts) => {
        return parts.every((part, i) => {
          if (part === GLOBSTAR)
            globstar = true;
          return globstar || !entryParts[0][i] || anymatch(part, entryParts[0][i], ANYMATCH_OPTS);
        });
      });
    }
    return !this.unmatchedGlob && this.fsw._isntIgnored(this.entryPath(entry), entry.stats);
  }
}
class FSWatcher extends EventEmitter {
  constructor(_opts) {
    super();
    const opts = {};
    if (_opts)
      Object.assign(opts, _opts);
    this._watched = /* @__PURE__ */ new Map();
    this._closers = /* @__PURE__ */ new Map();
    this._ignoredPaths = /* @__PURE__ */ new Set();
    this._throttled = /* @__PURE__ */ new Map();
    this._symlinkPaths = /* @__PURE__ */ new Map();
    this._streams = /* @__PURE__ */ new Set();
    this.closed = false;
    if (undef(opts, "persistent"))
      opts.persistent = true;
    if (undef(opts, "ignoreInitial"))
      opts.ignoreInitial = false;
    if (undef(opts, "ignorePermissionErrors"))
      opts.ignorePermissionErrors = false;
    if (undef(opts, "interval"))
      opts.interval = 100;
    if (undef(opts, "binaryInterval"))
      opts.binaryInterval = 300;
    if (undef(opts, "disableGlobbing"))
      opts.disableGlobbing = false;
    opts.enableBinaryInterval = opts.binaryInterval !== opts.interval;
    if (undef(opts, "useFsEvents"))
      opts.useFsEvents = !opts.usePolling;
    const canUseFsEvents = FsEventsHandler.canUse();
    if (!canUseFsEvents)
      opts.useFsEvents = false;
    if (undef(opts, "usePolling") && !opts.useFsEvents) {
      opts.usePolling = isMacos;
    }
    const envPoll = {}.CHOKIDAR_USEPOLLING;
    if (envPoll !== void 0) {
      const envLower = envPoll.toLowerCase();
      if (envLower === "false" || envLower === "0") {
        opts.usePolling = false;
      } else if (envLower === "true" || envLower === "1") {
        opts.usePolling = true;
      } else {
        opts.usePolling = !!envLower;
      }
    }
    const envInterval = {}.CHOKIDAR_INTERVAL;
    if (envInterval) {
      opts.interval = Number.parseInt(envInterval, 10);
    }
    if (undef(opts, "atomic"))
      opts.atomic = !opts.usePolling && !opts.useFsEvents;
    if (opts.atomic)
      this._pendingUnlinks = /* @__PURE__ */ new Map();
    if (undef(opts, "followSymlinks"))
      opts.followSymlinks = true;
    if (undef(opts, "awaitWriteFinish"))
      opts.awaitWriteFinish = false;
    if (opts.awaitWriteFinish === true)
      opts.awaitWriteFinish = {};
    const awf = opts.awaitWriteFinish;
    if (awf) {
      if (!awf.stabilityThreshold)
        awf.stabilityThreshold = 2e3;
      if (!awf.pollInterval)
        awf.pollInterval = 100;
      this._pendingWrites = /* @__PURE__ */ new Map();
    }
    if (opts.ignored)
      opts.ignored = arrify(opts.ignored);
    let readyCalls = 0;
    this._emitReady = () => {
      readyCalls++;
      if (readyCalls >= this._readyCount) {
        this._emitReady = EMPTY_FN;
        this._readyEmitted = true;
        process.nextTick(() => this.emit(EV_READY));
      }
    };
    this._emitRaw = (...args) => this.emit(EV_RAW, ...args);
    this._readyEmitted = false;
    this.options = opts;
    if (opts.useFsEvents) {
      this._fsEventsHandler = new FsEventsHandler(this);
    } else {
      this._nodeFsHandler = new NodeFsHandler(this);
    }
    Object.freeze(opts);
  }
  add(paths_, _origAdd, _internal) {
    const { cwd: cwd2, disableGlobbing } = this.options;
    this.closed = false;
    let paths = unifyPaths(paths_);
    if (cwd2) {
      paths = paths.map((path2) => {
        const absPath = getAbsolutePath(path2, cwd2);
        if (disableGlobbing || !isGlob(path2)) {
          return absPath;
        }
        return normalizePath(absPath);
      });
    }
    paths = paths.filter((path2) => {
      if (path2.startsWith(BANG)) {
        this._ignoredPaths.add(path2.slice(1));
        return false;
      }
      this._ignoredPaths.delete(path2);
      this._ignoredPaths.delete(path2 + SLASH_GLOBSTAR);
      this._userIgnored = void 0;
      return true;
    });
    if (this.options.useFsEvents && this._fsEventsHandler) {
      if (!this._readyCount)
        this._readyCount = paths.length;
      if (this.options.persistent)
        this._readyCount *= 2;
      paths.forEach((path2) => this._fsEventsHandler._addToFsEvents(path2));
    } else {
      if (!this._readyCount)
        this._readyCount = 0;
      this._readyCount += paths.length;
      Promise.all(
        paths.map(async (path2) => {
          const res = await this._nodeFsHandler._addToNodeFs(path2, !_internal, 0, 0, _origAdd);
          if (res)
            this._emitReady();
          return res;
        })
      ).then((results) => {
        if (this.closed)
          return;
        results.filter((item) => item).forEach((item) => {
          this.add(sysPath.dirname(item), sysPath.basename(_origAdd || item));
        });
      });
    }
    return this;
  }
  unwatch(paths_) {
    if (this.closed)
      return this;
    const paths = unifyPaths(paths_);
    const { cwd: cwd2 } = this.options;
    paths.forEach((path2) => {
      if (!sysPath.isAbsolute(path2) && !this._closers.has(path2)) {
        if (cwd2)
          path2 = sysPath.join(cwd2, path2);
        path2 = sysPath.resolve(path2);
      }
      this._closePath(path2);
      this._ignoredPaths.add(path2);
      if (this._watched.has(path2)) {
        this._ignoredPaths.add(path2 + SLASH_GLOBSTAR);
      }
      this._userIgnored = void 0;
    });
    return this;
  }
  close() {
    if (this.closed)
      return this._closePromise;
    this.closed = true;
    this.removeAllListeners();
    const closers = [];
    this._closers.forEach((closerList) => closerList.forEach((closer) => {
      const promise = closer();
      if (promise instanceof Promise)
        closers.push(promise);
    }));
    this._streams.forEach((stream) => stream.destroy());
    this._userIgnored = void 0;
    this._readyCount = 0;
    this._readyEmitted = false;
    this._watched.forEach((dirent) => dirent.dispose());
    ["closers", "watched", "streams", "symlinkPaths", "throttled"].forEach((key) => {
      this[`_${key}`].clear();
    });
    this._closePromise = closers.length ? Promise.all(closers).then(() => void 0) : Promise.resolve();
    return this._closePromise;
  }
  getWatched() {
    const watchList = {};
    this._watched.forEach((entry, dir) => {
      const key = this.options.cwd ? sysPath.relative(this.options.cwd, dir) : dir;
      watchList[key || ONE_DOT] = entry.getChildren().sort();
    });
    return watchList;
  }
  emitWithAll(event, args) {
    this.emit(...args);
    if (event !== EV_ERROR)
      this.emit(EV_ALL, ...args);
  }
  async _emit(event, path2, val1, val2, val3) {
    if (this.closed)
      return;
    const opts = this.options;
    if (isWindows)
      path2 = sysPath.normalize(path2);
    if (opts.cwd)
      path2 = sysPath.relative(opts.cwd, path2);
    const args = [event, path2];
    if (val3 !== void 0)
      args.push(val1, val2, val3);
    else if (val2 !== void 0)
      args.push(val1, val2);
    else if (val1 !== void 0)
      args.push(val1);
    const awf = opts.awaitWriteFinish;
    let pw;
    if (awf && (pw = this._pendingWrites.get(path2))) {
      pw.lastChange = new Date();
      return this;
    }
    if (opts.atomic) {
      if (event === EV_UNLINK) {
        this._pendingUnlinks.set(path2, args);
        setTimeout(() => {
          this._pendingUnlinks.forEach((entry, path3) => {
            this.emit(...entry);
            this.emit(EV_ALL, ...entry);
            this._pendingUnlinks.delete(path3);
          });
        }, typeof opts.atomic === "number" ? opts.atomic : 100);
        return this;
      }
      if (event === EV_ADD && this._pendingUnlinks.has(path2)) {
        event = args[0] = EV_CHANGE;
        this._pendingUnlinks.delete(path2);
      }
    }
    if (awf && (event === EV_ADD || event === EV_CHANGE) && this._readyEmitted) {
      const awfEmit = (err, stats) => {
        if (err) {
          event = args[0] = EV_ERROR;
          args[1] = err;
          this.emitWithAll(event, args);
        } else if (stats) {
          if (args.length > 2) {
            args[2] = stats;
          } else {
            args.push(stats);
          }
          this.emitWithAll(event, args);
        }
      };
      this._awaitWriteFinish(path2, awf.stabilityThreshold, event, awfEmit);
      return this;
    }
    if (event === EV_CHANGE) {
      const isThrottled = !this._throttle(EV_CHANGE, path2, 50);
      if (isThrottled)
        return this;
    }
    if (opts.alwaysStat && val1 === void 0 && (event === EV_ADD || event === EV_ADD_DIR || event === EV_CHANGE)) {
      const fullPath = opts.cwd ? sysPath.join(opts.cwd, path2) : path2;
      let stats;
      try {
        stats = await stat(fullPath);
      } catch (err) {
      }
      if (!stats || this.closed)
        return;
      args.push(stats);
    }
    this.emitWithAll(event, args);
    return this;
  }
  _handleError(error) {
    const code = error && error.code;
    if (error && code !== "ENOENT" && code !== "ENOTDIR" && (!this.options.ignorePermissionErrors || code !== "EPERM" && code !== "EACCES")) {
      this.emit(EV_ERROR, error);
    }
    return error || this.closed;
  }
  _throttle(actionType, path2, timeout) {
    if (!this._throttled.has(actionType)) {
      this._throttled.set(actionType, /* @__PURE__ */ new Map());
    }
    const action = this._throttled.get(actionType);
    const actionPath = action.get(path2);
    if (actionPath) {
      actionPath.count++;
      return false;
    }
    let timeoutObject;
    const clear = () => {
      const item = action.get(path2);
      const count = item ? item.count : 0;
      action.delete(path2);
      clearTimeout(timeoutObject);
      if (item)
        clearTimeout(item.timeoutObject);
      return count;
    };
    timeoutObject = setTimeout(clear, timeout);
    const thr = { timeoutObject, clear, count: 0 };
    action.set(path2, thr);
    return thr;
  }
  _incrReadyCount() {
    return this._readyCount++;
  }
  _awaitWriteFinish(path2, threshold, event, awfEmit) {
    let timeoutHandler;
    let fullPath = path2;
    if (this.options.cwd && !sysPath.isAbsolute(path2)) {
      fullPath = sysPath.join(this.options.cwd, path2);
    }
    const now = new Date();
    const awaitWriteFinish = (prevStat) => {
      fs.stat(fullPath, (err, curStat) => {
        if (err || !this._pendingWrites.has(path2)) {
          if (err && err.code !== "ENOENT")
            awfEmit(err);
          return;
        }
        const now2 = Number(new Date());
        if (prevStat && curStat.size !== prevStat.size) {
          this._pendingWrites.get(path2).lastChange = now2;
        }
        const pw = this._pendingWrites.get(path2);
        const df = now2 - pw.lastChange;
        if (df >= threshold) {
          this._pendingWrites.delete(path2);
          awfEmit(void 0, curStat);
        } else {
          timeoutHandler = setTimeout(
            awaitWriteFinish,
            this.options.awaitWriteFinish.pollInterval,
            curStat
          );
        }
      });
    };
    if (!this._pendingWrites.has(path2)) {
      this._pendingWrites.set(path2, {
        lastChange: now,
        cancelWait: () => {
          this._pendingWrites.delete(path2);
          clearTimeout(timeoutHandler);
          return event;
        }
      });
      timeoutHandler = setTimeout(
        awaitWriteFinish,
        this.options.awaitWriteFinish.pollInterval
      );
    }
  }
  _getGlobIgnored() {
    return [...this._ignoredPaths.values()];
  }
  _isIgnored(path2, stats) {
    if (this.options.atomic && DOT_RE.test(path2))
      return true;
    if (!this._userIgnored) {
      const { cwd: cwd2 } = this.options;
      const ign = this.options.ignored;
      const ignored = ign && ign.map(normalizeIgnored(cwd2));
      const paths = arrify(ignored).filter((path3) => typeof path3 === STRING_TYPE && !isGlob(path3)).map((path3) => path3 + SLASH_GLOBSTAR);
      const list = this._getGlobIgnored().map(normalizeIgnored(cwd2)).concat(ignored, paths);
      this._userIgnored = anymatch(list, void 0, ANYMATCH_OPTS);
    }
    return this._userIgnored([path2, stats]);
  }
  _isntIgnored(path2, stat2) {
    return !this._isIgnored(path2, stat2);
  }
  _getWatchHelpers(path2, depth2) {
    const watchPath = depth2 || this.options.disableGlobbing || !isGlob(path2) ? path2 : globParent(path2);
    const follow = this.options.followSymlinks;
    return new WatchHelper(path2, watchPath, follow, this);
  }
  _getWatchedDir(directory) {
    if (!this._boundRemove)
      this._boundRemove = this._remove.bind(this);
    const dir = sysPath.resolve(directory);
    if (!this._watched.has(dir))
      this._watched.set(dir, new DirEntry(dir, this._boundRemove));
    return this._watched.get(dir);
  }
  _hasReadPermissions(stats) {
    if (this.options.ignorePermissionErrors)
      return true;
    const md = stats && Number.parseInt(stats.mode, 10);
    const st = md & 511;
    const it = Number.parseInt(st.toString(8)[0], 10);
    return Boolean(4 & it);
  }
  _remove(directory, item, isDirectory) {
    const path2 = sysPath.join(directory, item);
    const fullPath = sysPath.resolve(path2);
    isDirectory = isDirectory != null ? isDirectory : this._watched.has(path2) || this._watched.has(fullPath);
    if (!this._throttle("remove", path2, 100))
      return;
    if (!isDirectory && !this.options.useFsEvents && this._watched.size === 1) {
      this.add(directory, item, true);
    }
    const wp = this._getWatchedDir(path2);
    const nestedDirectoryChildren = wp.getChildren();
    nestedDirectoryChildren.forEach((nested) => this._remove(path2, nested));
    const parent = this._getWatchedDir(directory);
    const wasTracked = parent.has(item);
    parent.remove(item);
    if (this._symlinkPaths.has(fullPath)) {
      this._symlinkPaths.delete(fullPath);
    }
    let relPath = path2;
    if (this.options.cwd)
      relPath = sysPath.relative(this.options.cwd, path2);
    if (this.options.awaitWriteFinish && this._pendingWrites.has(relPath)) {
      const event = this._pendingWrites.get(relPath).cancelWait();
      if (event === EV_ADD)
        return;
    }
    this._watched.delete(path2);
    this._watched.delete(fullPath);
    const eventName = isDirectory ? EV_UNLINK_DIR : EV_UNLINK;
    if (wasTracked && !this._isIgnored(path2))
      this._emit(eventName, path2);
    if (!this.options.useFsEvents) {
      this._closePath(path2);
    }
  }
  _closePath(path2) {
    this._closeFile(path2);
    const dir = sysPath.dirname(path2);
    this._getWatchedDir(dir).remove(sysPath.basename(path2));
  }
  _closeFile(path2) {
    const closers = this._closers.get(path2);
    if (!closers)
      return;
    closers.forEach((closer) => closer());
    this._closers.delete(path2);
  }
  _addPathCloser(path2, closer) {
    if (!closer)
      return;
    let list = this._closers.get(path2);
    if (!list) {
      list = [];
      this._closers.set(path2, list);
    }
    list.push(closer);
  }
  _readdirp(root, opts) {
    if (this.closed)
      return;
    const options = { type: EV_ALL, alwaysStat: true, lstat: true, ...opts };
    let stream = readdirp(root, options);
    this._streams.add(stream);
    stream.once(STR_CLOSE, () => {
      stream = void 0;
    });
    stream.once(STR_END, () => {
      if (stream) {
        this._streams.delete(stream);
        stream = void 0;
      }
    });
    return stream;
  }
}
chokidar.FSWatcher = FSWatcher;
const watch = (paths, options) => {
  const watcher = new FSWatcher(options);
  watcher.add(paths);
  return watcher;
};
chokidar.watch = watch;
const changeListeners = {};
const LocalFileSystemService = {
  readDir: (e, path2) => {
    const children = [];
    const labels = require$$0__default$2["default"].readdirSync(path2);
    for (const l of labels) {
      const stat2 = require$$0__default$2["default"].lstatSync(require$$1__default["default"].join(path2, l));
      if (l.startsWith("isa.") || l.startsWith(".git") || l.startsWith(".arc"))
        continue;
      stat2.id = path2 + "/" + l;
      stat2.isDirectory = stat2.isDirectory();
      children.push(stat2);
    }
    return children;
  },
  selectDir: async () => {
    const window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    const result = await electron.dialog.showOpenDialog(window2, {
      properties: ["openDirectory"]
    });
    return result.filePaths[0];
  },
  selectAny: async () => {
    const window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    const result = await electron.dialog.showOpenDialog(window2, {
      properties: ["openFile", "multiSelections"]
    });
    return result.filePaths;
  },
  saveFile: async () => {
    const window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    const result = await electron.dialog.showSaveDialog(window2);
    return result.filePath;
  },
  readFile: (e, path2) => {
    return require$$0__default$2["default"].readFileSync(path2, { encoding: "UTF-8" });
  },
  copy: async (e, [src, dst]) => {
    const name = src.split("/").pop();
    try {
      FSE.copySync(src, dst + "/" + name, { overwrite: true });
      return 1;
    } catch (err) {
      console.error(err);
      return 0;
    }
  },
  registerChangeListener: async (e, path2) => {
    changeListeners[path2] = chokidar.watch(path2, { ignoreInitial: true });
    const updatePath = (path22) => {
      const window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
      window2.webContents.send("LocalFileSystemService.updatePath", path22);
    };
    const updateParentPath = (path22) => {
      updatePath(path22.split("/").slice(0, -1).join("/"));
    };
    changeListeners[path2].on("add", updateParentPath).on("unlink", updateParentPath).on("addDir", updateParentPath).on("unlinkDir", updateParentPath);
    return;
  },
  unregisterChangeListener: async (e, path2) => {
    const watcher = changeListeners[path2];
    if (!watcher)
      return;
    await watcher.unwatch();
    delete changeListeners[path2];
    return;
  },
  createEmptyFile: async (e, path2) => {
    const fpath = path2.slice(-3) === ".md" || path2.slice(-4) === ".txt" ? path2 : path2 + ".md";
    require$$0__default$2["default"].writeFileSync(fpath, "");
    return fpath;
  },
  writeFile: async (e, [path2, data]) => {
    return require$$0__default$2["default"].writeFileSync(path2, data, { encoding: "UTF-8" });
  },
  init: async () => {
    process.on("unhandledRejection", (reason, p) => {
      console.error(`Unhandled Rejection at: ${require$$2__default["default"].inspect(p)} reason: ${reason}`);
    });
    electron.ipcMain.handle("LocalFileSystemService.readDir", LocalFileSystemService.readDir);
    electron.ipcMain.handle("LocalFileSystemService.readFile", LocalFileSystemService.readFile);
    electron.ipcMain.handle("LocalFileSystemService.writeFile", LocalFileSystemService.writeFile);
    electron.ipcMain.handle("LocalFileSystemService.selectDir", LocalFileSystemService.selectDir);
    electron.ipcMain.handle("LocalFileSystemService.selectAny", LocalFileSystemService.selectAny);
    electron.ipcMain.handle("LocalFileSystemService.saveFile", LocalFileSystemService.saveFile);
    electron.ipcMain.handle("LocalFileSystemService.copy", LocalFileSystemService.copy);
    electron.ipcMain.handle("LocalFileSystemService.createEmptyFile", LocalFileSystemService.createEmptyFile);
    electron.ipcMain.handle("LocalFileSystemService.registerChangeListener", LocalFileSystemService.registerChangeListener);
    electron.ipcMain.handle("LocalFileSystemService.unregisterChangeListener", LocalFileSystemService.unregisterChangeListener);
  }
};
const token = "%[a-f0-9]{2}";
const singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
const multiMatcher = new RegExp("(" + token + ")+", "gi");
function decodeComponents(components, split) {
  try {
    return [decodeURIComponent(components.join(""))];
  } catch {
  }
  if (components.length === 1) {
    return components;
  }
  split = split || 1;
  const left = components.slice(0, split);
  const right = components.slice(split);
  return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}
function decode$1(input) {
  try {
    return decodeURIComponent(input);
  } catch {
    let tokens = input.match(singleMatcher) || [];
    for (let i = 1; i < tokens.length; i++) {
      input = decodeComponents(tokens, i).join("");
      tokens = input.match(singleMatcher) || [];
    }
    return input;
  }
}
function customDecodeURIComponent(input) {
  const replaceMap = {
    "%FE%FF": "\uFFFD\uFFFD",
    "%FF%FE": "\uFFFD\uFFFD"
  };
  let match = multiMatcher.exec(input);
  while (match) {
    try {
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch {
      const result = decode$1(match[0]);
      if (result !== match[0]) {
        replaceMap[match[0]] = result;
      }
    }
    match = multiMatcher.exec(input);
  }
  replaceMap["%C2"] = "\uFFFD";
  const entries = Object.keys(replaceMap);
  for (const key of entries) {
    input = input.replace(new RegExp(key, "g"), replaceMap[key]);
  }
  return input;
}
function decodeUriComponent(encodedURI) {
  if (typeof encodedURI !== "string") {
    throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
  }
  try {
    return decodeURIComponent(encodedURI);
  } catch {
    return customDecodeURIComponent(encodedURI);
  }
}
function splitOnFirst(string, separator) {
  if (!(typeof string === "string" && typeof separator === "string")) {
    throw new TypeError("Expected the arguments to be of type `string`");
  }
  if (string === "" || separator === "") {
    return [];
  }
  const separatorIndex = string.indexOf(separator);
  if (separatorIndex === -1) {
    return [];
  }
  return [
    string.slice(0, separatorIndex),
    string.slice(separatorIndex + separator.length)
  ];
}
function includeKeys(object, predicate) {
  const result = {};
  if (Array.isArray(predicate)) {
    for (const key of predicate) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor == null ? void 0 : descriptor.enumerable) {
        Object.defineProperty(result, key, descriptor);
      }
    }
  } else {
    for (const key of Reflect.ownKeys(object)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor.enumerable) {
        const value = object[key];
        if (predicate(key, value, object)) {
          Object.defineProperty(result, key, descriptor);
        }
      }
    }
  }
  return result;
}
const isNullOrUndefined = (value) => value === null || value === void 0;
const strictUriEncode = (string) => encodeURIComponent(string).replace(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
const encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
function encoderForArrayFormat(options) {
  switch (options.arrayFormat) {
    case "index": {
      return (key) => (result, value) => {
        const index = result.length;
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), "[", index, "]"].join("")
          ];
        }
        return [
          ...result,
          [encode(key, options), "[", encode(index, options), "]=", encode(value, options)].join("")
        ];
      };
    }
    case "bracket": {
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), "[]"].join("")
          ];
        }
        return [
          ...result,
          [encode(key, options), "[]=", encode(value, options)].join("")
        ];
      };
    }
    case "colon-list-separator": {
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), ":list="].join("")
          ];
        }
        return [
          ...result,
          [encode(key, options), ":list=", encode(value, options)].join("")
        ];
      };
    }
    case "comma":
    case "separator":
    case "bracket-separator": {
      const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        value = value === null ? "" : value;
        if (result.length === 0) {
          return [[encode(key, options), keyValueSep, encode(value, options)].join("")];
        }
        return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
      };
    }
    default: {
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            encode(key, options)
          ];
        }
        return [
          ...result,
          [encode(key, options), "=", encode(value, options)].join("")
        ];
      };
    }
  }
}
function parserForArrayFormat(options) {
  let result;
  switch (options.arrayFormat) {
    case "index": {
      return (key, value, accumulator) => {
        result = /\[(\d*)]$/.exec(key);
        key = key.replace(/\[\d*]$/, "");
        if (!result) {
          accumulator[key] = value;
          return;
        }
        if (accumulator[key] === void 0) {
          accumulator[key] = {};
        }
        accumulator[key][result[1]] = value;
      };
    }
    case "bracket": {
      return (key, value, accumulator) => {
        result = /(\[])$/.exec(key);
        key = key.replace(/\[]$/, "");
        if (!result) {
          accumulator[key] = value;
          return;
        }
        if (accumulator[key] === void 0) {
          accumulator[key] = [value];
          return;
        }
        accumulator[key] = [...accumulator[key], value];
      };
    }
    case "colon-list-separator": {
      return (key, value, accumulator) => {
        result = /(:list)$/.exec(key);
        key = key.replace(/:list$/, "");
        if (!result) {
          accumulator[key] = value;
          return;
        }
        if (accumulator[key] === void 0) {
          accumulator[key] = [value];
          return;
        }
        accumulator[key] = [...accumulator[key], value];
      };
    }
    case "comma":
    case "separator": {
      return (key, value, accumulator) => {
        const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
        const isEncodedArray = typeof value === "string" && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
        value = isEncodedArray ? decode(value, options) : value;
        const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
        accumulator[key] = newValue;
      };
    }
    case "bracket-separator": {
      return (key, value, accumulator) => {
        const isArray = /(\[])$/.test(key);
        key = key.replace(/\[]$/, "");
        if (!isArray) {
          accumulator[key] = value ? decode(value, options) : value;
          return;
        }
        const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode(item, options));
        if (accumulator[key] === void 0) {
          accumulator[key] = arrayValue;
          return;
        }
        accumulator[key] = [...accumulator[key], ...arrayValue];
      };
    }
    default: {
      return (key, value, accumulator) => {
        if (accumulator[key] === void 0) {
          accumulator[key] = value;
          return;
        }
        accumulator[key] = [...[accumulator[key]].flat(), value];
      };
    }
  }
}
function validateArrayFormatSeparator(value) {
  if (typeof value !== "string" || value.length !== 1) {
    throw new TypeError("arrayFormatSeparator must be single character string");
  }
}
function encode(value, options) {
  if (options.encode) {
    return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
  }
  return value;
}
function decode(value, options) {
  if (options.decode) {
    return decodeUriComponent(value);
  }
  return value;
}
function keysSorter(input) {
  if (Array.isArray(input)) {
    return input.sort();
  }
  if (typeof input === "object") {
    return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
  }
  return input;
}
function removeHash(input) {
  const hashStart = input.indexOf("#");
  if (hashStart !== -1) {
    input = input.slice(0, hashStart);
  }
  return input;
}
function getHash(url2) {
  let hash = "";
  const hashStart = url2.indexOf("#");
  if (hashStart !== -1) {
    hash = url2.slice(hashStart);
  }
  return hash;
}
function parseValue(value, options) {
  if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
    value = Number(value);
  } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
    value = value.toLowerCase() === "true";
  }
  return value;
}
function extract(input) {
  input = removeHash(input);
  const queryStart = input.indexOf("?");
  if (queryStart === -1) {
    return "";
  }
  return input.slice(queryStart + 1);
}
function parse(query, options) {
  options = {
    decode: true,
    sort: true,
    arrayFormat: "none",
    arrayFormatSeparator: ",",
    parseNumbers: false,
    parseBooleans: false,
    ...options
  };
  validateArrayFormatSeparator(options.arrayFormatSeparator);
  const formatter = parserForArrayFormat(options);
  const returnValue = /* @__PURE__ */ Object.create(null);
  if (typeof query !== "string") {
    return returnValue;
  }
  query = query.trim().replace(/^[?#&]/, "");
  if (!query) {
    return returnValue;
  }
  for (const parameter of query.split("&")) {
    if (parameter === "") {
      continue;
    }
    const parameter_ = options.decode ? parameter.replace(/\+/g, " ") : parameter;
    let [key, value] = splitOnFirst(parameter_, "=");
    if (key === void 0) {
      key = parameter_;
    }
    value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode(value, options);
    formatter(decode(key, options), value, returnValue);
  }
  for (const [key, value] of Object.entries(returnValue)) {
    if (typeof value === "object" && value !== null) {
      for (const [key2, value2] of Object.entries(value)) {
        value[key2] = parseValue(value2, options);
      }
    } else {
      returnValue[key] = parseValue(value, options);
    }
  }
  if (options.sort === false) {
    return returnValue;
  }
  return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
    const value = returnValue[key];
    if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
      result[key] = keysSorter(value);
    } else {
      result[key] = value;
    }
    return result;
  }, /* @__PURE__ */ Object.create(null));
}
function stringify(object, options) {
  if (!object) {
    return "";
  }
  options = {
    encode: true,
    strict: true,
    arrayFormat: "none",
    arrayFormatSeparator: ",",
    ...options
  };
  validateArrayFormatSeparator(options.arrayFormatSeparator);
  const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
  const formatter = encoderForArrayFormat(options);
  const objectCopy = {};
  for (const [key, value] of Object.entries(object)) {
    if (!shouldFilter(key)) {
      objectCopy[key] = value;
    }
  }
  const keys = Object.keys(objectCopy);
  if (options.sort !== false) {
    keys.sort(options.sort);
  }
  return keys.map((key) => {
    const value = object[key];
    if (value === void 0) {
      return "";
    }
    if (value === null) {
      return encode(key, options);
    }
    if (Array.isArray(value)) {
      if (value.length === 0 && options.arrayFormat === "bracket-separator") {
        return encode(key, options) + "[]";
      }
      return value.reduce(formatter(key), []).join("&");
    }
    return encode(key, options) + "=" + encode(value, options);
  }).filter((x) => x.length > 0).join("&");
}
function parseUrl(url2, options) {
  var _a;
  options = {
    decode: true,
    ...options
  };
  let [url_, hash] = splitOnFirst(url2, "#");
  if (url_ === void 0) {
    url_ = url2;
  }
  return {
    url: ((_a = url_ == null ? void 0 : url_.split("?")) == null ? void 0 : _a[0]) ?? "",
    query: parse(extract(url2), options),
    ...options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {}
  };
}
function stringifyUrl(object, options) {
  options = {
    encode: true,
    strict: true,
    [encodeFragmentIdentifier]: true,
    ...options
  };
  const url2 = removeHash(object.url).split("?")[0] || "";
  const queryFromUrl = extract(object.url);
  const query = {
    ...parse(queryFromUrl, { sort: false }),
    ...object.query
  };
  let queryString2 = stringify(query, options);
  if (queryString2) {
    queryString2 = `?${queryString2}`;
  }
  let hash = getHash(object.url);
  if (object.fragmentIdentifier) {
    const urlObjectForFragmentEncode = new URL(url2);
    urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
    hash = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
  }
  return `${url2}${queryString2}${hash}`;
}
function pick(input, filter, options) {
  options = {
    parseFragmentIdentifier: true,
    [encodeFragmentIdentifier]: false,
    ...options
  };
  const { url: url2, query, fragmentIdentifier } = parseUrl(input, options);
  return stringifyUrl({
    url: url2,
    query: includeKeys(query, filter),
    fragmentIdentifier
  }, options);
}
function exclude(input, filter, options) {
  const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
  return pick(input, exclusionFilter, options);
}
var queryString = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extract,
  parse,
  stringify,
  parseUrl,
  stringifyUrl,
  pick,
  exclude
}, Symbol.toStringTag, { value: "Module" }));
const express = require("express");
let authApp = null;
const authPort = 7890;
const DataHubService = {
  getWebPageAsJson: (e, options) => {
    return new Promise(
      (resolve, reject) => {
        const req2 = https__default["default"].request(options, (res) => {
          let output2 = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            output2 += chunk;
          });
          res.on("end", () => {
            console.log(output2);
            resolve(JSON.parse(output2));
          });
        });
        req2.on("error", (err) => {
          console.error(err);
          reject(err);
        });
        req2.end();
      }
    );
  },
  selectImportDestination: async () => {
    const window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    const result = await electron.dialog.showOpenDialog(window2, {
      title: "Select Destination of ARC Import",
      message: "Select Destination of ARC Import",
      properties: ["openDirectory"]
    });
    return result.filePaths[0];
  },
  getArcs: async (e) => {
    return await DataHubService.getWebPageAsJson(
      null,
      {
        host: "git.nfdi4plants.org",
        path: "/api/v4/projects/",
        port: 443,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-agent": "node.js"
        }
      }
    );
  },
  inspectArc: async (e, url2) => {
    electron.shell.openExternal(url2);
    return;
  },
  authenticate: async (e, code) => {
    const url_params = {
      response_type: "code",
      redirect_uri: "http://localhost:7890",
      client_id: "80f4fbff13c3a27713860b6e71755fb3cba7adf644cf71a7cfcc9c1f67ac3680",
      scope: `openid read_api email profile read_repository write_repository`
    };
    const auth_url = "https://git.nfdi4plants.org/oauth/authorize?" + queryString.stringify(url_params);
    electron.shell.openExternal(auth_url);
  },
  init: async () => {
    electron.ipcMain.handle("DataHubService.getArcs", DataHubService.getArcs);
    electron.ipcMain.handle("DataHubService.inspectArc", DataHubService.inspectArc);
    electron.ipcMain.handle("DataHubService.selectImportDestination", DataHubService.selectImportDestination);
    electron.ipcMain.handle("DataHubService.authenticate", DataHubService.authenticate);
    authApp = express();
    authApp.get("/", async (req2, res) => {
      console.log(req2.url);
      if (!req2.url || !req2.url.startsWith("/?code=")) {
        return res.send("Invalid Request.");
      }
      const code = req2.url.split("/?code=")[1];
      const params = queryString.stringify({
        client_id: "80f4fbff13c3a27713860b6e71755fb3cba7adf644cf71a7cfcc9c1f67ac3680",
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:7890",
        code
      });
      const token_data = await DataHubService.getWebPageAsJson(
        null,
        {
          host: "git.nfdi4plants.org",
          path: `/oauth/token?` + params,
          port: 443,
          method: "POST",
          headers: {
            "user-agent": "node.js",
            "Content-Type": "application/json"
          }
        }
      );
      const user_data = await DataHubService.getWebPageAsJson(
        null,
        {
          host: "git.nfdi4plants.org",
          path: `/api/v4/user/?access_token=${token_data.access_token}`,
          port: 443,
          method: "GET",
          headers: {
            "user-agent": "node.js",
            "Content-Type": "application/json"
          }
        }
      );
      user_data.token = token_data;
      res.send("<h1>Login and Authorization Complete. You can now return to ARCitect.</h1>");
      let window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
      window2.webContents.send("DataHubService.authentificationData", user_data);
    });
    authApp.listen(authPort, () => {
      console.log(`Authentification service listening on port ${authPort}`);
    });
  }
};
const ArcCommanderService = {
  run: (e, options) => {
    return new Promise((resolve, reject) => {
      const args = typeof options === "string" ? [options] : options.args;
      const o = typeof options === "string" ? {} : options;
      let window2 = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
      const p = child_process.spawn("arc", args, o);
      let error = false;
      let output2 = "";
      p.stdout.on("data", (data) => {
        const dataAsString = data.toString();
        output2 += dataAsString;
        if (dataAsString.toLowerCase().includes("error"))
          error = true;
        window2.webContents.send("ArcCommanderService.MSG", dataAsString);
      });
      p.stderr.on("data", (data) => {
        error = true;
        const dataAsString = data.toString();
        output2 += dataAsString;
        console.error("e", dataAsString);
        window2.webContents.send("ArcCommanderService.MSG", dataAsString);
      });
      p.on("error", (err) => {
        console.error(err.toString());
        resolve([false, err.toString()]);
      });
      p.on("exit", (code) => {
        resolve([code === 0 && !error, output2]);
      });
    });
  },
  init: async () => {
    electron.ipcMain.handle("ArcCommanderService.run", ArcCommanderService.run);
  }
};
let req = null;
const InternetService = {
  callSwateAPI: (event, data) => {
    return new Promise(
      (resolve, reject) => {
        const options = {
          host: "swate.nfdi4plants.org",
          port: 443,
          path: `/api/IOntologyAPIv2/${data.method}`,
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            "user-agent": "node.js"
          }
        };
        if (req)
          req.destroy();
        req = https__default["default"].request(options, (res) => {
          let output2 = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            output2 += chunk;
          });
          res.on("end", () => {
            resolve(JSON.parse(output2));
          });
        });
        req.on("error", (err) => {
          resolve(err);
        });
        req.write(data.payload);
        req.end();
      }
    );
  },
  openExternalURL: async (e, url2) => {
    electron.shell.openExternal(url2);
    return;
  },
  init: async () => {
    electron.ipcMain.handle("InternetService.openExternalURL", InternetService.openExternalURL);
    electron.ipcMain.handle("InternetService.callSwateAPI", InternetService.callSwateAPI);
  }
};
const isSingleInstance = electron.app.requestSingleInstanceLock();
if (!isSingleInstance) {
  electron.app.quit();
  process.exit(0);
}
electron.app.on("second-instance", restoreOrCreateWindow);
electron.app.disableHardwareAcceleration();
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", restoreOrCreateWindow);
electron.app.whenReady().then(DataHubService.init).then(LocalFileSystemService.init).then(ArcCommanderService.init).then(InternetService.init).then(restoreOrCreateWindow).catch((e) => console.error("Failed create window:", e));
{
  electron.app.whenReady().then(() => Promise.resolve().then(function() {
    return /* @__PURE__ */ _interopNamespace(require("electron-devtools-installer"));
  })).then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })).catch((e) => console.error("Failed install extension:", e));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvc2VjdXJpdHktcmVzdHJpY3Rpb25zLnRzIiwiLi4vc3JjL21haW5XaW5kb3cudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdW5pdmVyc2FsaWZ5L2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2dyYWNlZnVsLWZzL3BvbHlmaWxscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9sZWdhY3ktc3RyZWFtcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9jbG9uZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9ncmFjZWZ1bC1mcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZnMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21rZGlycy93aW4zMi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvbWtkaXJzL21rZGlycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvbWtkaXJzL21rZGlycy1zeW5jLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9ta2RpcnMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3V0aWwvdXRpbWVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi91dGlsL3N0YXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3V0aWwvYnVmZmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9jb3B5LXN5bmMvY29weS1zeW5jLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9jb3B5LXN5bmMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3BhdGgtZXhpc3RzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9jb3B5L2NvcHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2NvcHkvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3JlbW92ZS9yaW1yYWYuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL3JlbW92ZS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW1wdHkvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2Vuc3VyZS9maWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvbGluay5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvZW5zdXJlL3N5bWxpbmstcGF0aHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2Vuc3VyZS9zeW1saW5rLXR5cGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2Vuc3VyZS9zeW1saW5rLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9lbnN1cmUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvanNvbmZpbGUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2pzb24vanNvbmZpbGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2pzb24vb3V0cHV0LWpzb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL2pzb24vb3V0cHV0LWpzb24tc3luYy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvanNvbi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvbW92ZS1zeW5jL21vdmUtc3luYy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvbW92ZS1zeW5jL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZzLWV4dHJhL2xpYi9tb3ZlL21vdmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL21vdmUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZnMtZXh0cmEvbGliL291dHB1dC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mcy1leHRyYS9saWIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi91dGlscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3NjYW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9wYXJzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3BpY29tYXRjaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhZGRpcnAvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXBhdGgvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYW55bWF0Y2gvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvaXMtZXh0Z2xvYi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pcy1nbG9iL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nob2tpZGFyL25vZGVfbW9kdWxlcy9nbG9iLXBhcmVudC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL3V0aWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvc3RyaW5naWZ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzLW51bWJlci9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy90by1yZWdleC1yYW5nZS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9maWxsLXJhbmdlL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvY29tcGlsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2V4cGFuZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2NvbnN0YW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL3BhcnNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9iaW5hcnktZXh0ZW5zaW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pcy1iaW5hcnktcGF0aC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jaG9raWRhci9saWIvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nob2tpZGFyL2xpYi9ub2RlZnMtaGFuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jaG9raWRhci9saWIvZnNldmVudHMtaGFuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jaG9raWRhci9pbmRleC5qcyIsIi4uL3NyYy9Mb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RlY29kZS11cmktY29tcG9uZW50L2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3NwbGl0LW9uLWZpcnN0L2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZpbHRlci1vYmovaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2Jhc2UuanMiLCIuLi9zcmMvRGF0YUh1YlNlcnZpY2UudHMiLCIuLi9zcmMvQXJjQ29tbWFuZGVyU2VydmljZS50cyIsIi4uL3NyYy9JbnRlcm5ldFNlcnZpY2UudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHAsIHNoZWxsfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQge1VSTH0gZnJvbSAndXJsJztcblxuLyoqXG4gKiBMaXN0IG9mIG9yaWdpbnMgdGhhdCB5b3UgYWxsb3cgb3BlbiBJTlNJREUgdGhlIGFwcGxpY2F0aW9uIGFuZCBwZXJtaXNzaW9ucyBmb3IgZWFjaCBvZiB0aGVtLlxuICpcbiAqIEluIGRldmVsb3BtZW50IG1vZGUgeW91IG5lZWQgYWxsb3cgb3BlbiBgVklURV9ERVZfU0VSVkVSX1VSTGBcbiAqL1xuY29uc3QgQUxMT1dFRF9PUklHSU5TX0FORF9QRVJNSVNTSU9OUyA9IG5ldyBNYXA8c3RyaW5nLCBTZXQ8J2NsaXBib2FyZC1yZWFkJyB8ICdtZWRpYScgfCAnZGlzcGxheS1jYXB0dXJlJyB8ICdtZWRpYUtleVN5c3RlbScgfCAnZ2VvbG9jYXRpb24nIHwgJ25vdGlmaWNhdGlvbnMnIHwgJ21pZGknIHwgJ21pZGlTeXNleCcgfCAncG9pbnRlckxvY2snIHwgJ2Z1bGxzY3JlZW4nIHwgJ29wZW5FeHRlcm5hbCcgfCAndW5rbm93bic+PihcbiAgaW1wb3J0Lm1ldGEuZW52LkRFViAmJiBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTFxuICAgID8gW1tuZXcgVVJMKGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMKS5vcmlnaW4sIG5ldyBTZXRdXVxuICAgIDogW10sXG4pO1xuXG4vKipcbiAqIExpc3Qgb2Ygb3JpZ2lucyB0aGF0IHlvdSBhbGxvdyBvcGVuIElOIEJST1dTRVIuXG4gKiBOYXZpZ2F0aW9uIHRvIG9yaWdpbnMgYmVsb3cgaXMgcG9zc2libGUgb25seSBpZiB0aGUgbGluayBvcGVucyBpbiBhIG5ldyB3aW5kb3dcbiAqXG4gKiBAZXhhbXBsZVxuICogPGFcbiAqICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAqICAgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9cIlxuICogPlxuICovXG5jb25zdCBBTExPV0VEX0VYVEVSTkFMX09SSUdJTlMgPSBuZXcgU2V0PGBodHRwczovLyR7c3RyaW5nfWA+KFtcbiAgJ2h0dHBzOi8vZ2l0aHViLmNvbScsXG4gICdodHRwczovL3d3dy53M3NjaG9vbHMuY29tJyxcbiAgJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20nLFxuICAnaHR0cHM6Ly9naXQubmZkaTRwbGFudHMub3JnJyxcbl0pO1xuXG5cbmFwcC5vbignd2ViLWNvbnRlbnRzLWNyZWF0ZWQnLCAoXywgY29udGVudHMpID0+IHtcblxuICAvKipcbiAgICogQmxvY2sgbmF2aWdhdGlvbiB0byBvcmlnaW5zIG5vdCBvbiB0aGUgYWxsb3dsaXN0LlxuICAgKlxuICAgKiBOYXZpZ2F0aW9uIGlzIGEgY29tbW9uIGF0dGFjayB2ZWN0b3IuIElmIGFuIGF0dGFja2VyIGNhbiBjb252aW5jZSB0aGUgYXBwIHRvIG5hdmlnYXRlIGF3YXlcbiAgICogZnJvbSBpdHMgY3VycmVudCBwYWdlLCB0aGV5IGNhbiBwb3NzaWJseSBmb3JjZSB0aGUgYXBwIHRvIG9wZW4gd2ViIHNpdGVzIG9uIHRoZSBJbnRlcm5ldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxMy1kaXNhYmxlLW9yLWxpbWl0LW5hdmlnYXRpb25cbiAgICovXG4gIGNvbnRlbnRzLm9uKCd3aWxsLW5hdmlnYXRlJywgKGV2ZW50LCB1cmwpID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwodXJsKTtcbiAgICAvLyBpZiAoQUxMT1dFRF9PUklHSU5TX0FORF9QRVJNSVNTSU9OUy5oYXMob3JpZ2luKSkge1xuICAgIC8vICAgcmV0dXJuO1xuICAgIC8vIH1cblxuICAgIC8vIC8vIFByZXZlbnQgbmF2aWdhdGlvblxuICAgIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgIC8vICAgY29uc29sZS53YXJuKCdCbG9ja2VkIG5hdmlnYXRpbmcgdG8gYW4gdW5hbGxvd2VkIG9yaWdpbjonLCBvcmlnaW4pO1xuICAgIC8vIH1cbiAgfSk7XG5cblxuICAvKipcbiAgICogQmxvY2sgcmVxdWVzdGVkIHVuYWxsb3dlZCBwZXJtaXNzaW9ucy5cbiAgICogQnkgZGVmYXVsdCwgRWxlY3Ryb24gd2lsbCBhdXRvbWF0aWNhbGx5IGFwcHJvdmUgYWxsIHBlcm1pc3Npb24gcmVxdWVzdHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvdHV0b3JpYWwvc2VjdXJpdHkjNS1oYW5kbGUtc2Vzc2lvbi1wZXJtaXNzaW9uLXJlcXVlc3RzLWZyb20tcmVtb3RlLWNvbnRlbnRcbiAgICovXG4gIGNvbnRlbnRzLnNlc3Npb24uc2V0UGVybWlzc2lvblJlcXVlc3RIYW5kbGVyKCh3ZWJDb250ZW50cywgcGVybWlzc2lvbiwgY2FsbGJhY2spID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwod2ViQ29udGVudHMuZ2V0VVJMKCkpO1xuXG4gICAgY29uc3QgcGVybWlzc2lvbkdyYW50ZWQgPSAhIUFMTE9XRURfT1JJR0lOU19BTkRfUEVSTUlTU0lPTlMuZ2V0KG9yaWdpbik/LmhhcyhwZXJtaXNzaW9uKTtcbiAgICBjYWxsYmFjayhwZXJtaXNzaW9uR3JhbnRlZCk7XG5cbiAgICBpZiAoIXBlcm1pc3Npb25HcmFudGVkICYmIGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgICAgIGNvbnNvbGUud2FybihgJHtvcmlnaW59IHJlcXVlc3RlZCBwZXJtaXNzaW9uIGZvciAnJHtwZXJtaXNzaW9ufScsIGJ1dCB3YXMgYmxvY2tlZC5gKTtcbiAgICB9XG4gIH0pO1xuXG5cbiAgLyoqXG4gICAqIEh5cGVybGlua3MgdG8gYWxsb3dlZCBzaXRlcyBvcGVuIGluIHRoZSBkZWZhdWx0IGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBjcmVhdGlvbiBvZiBuZXcgYHdlYkNvbnRlbnRzYCBpcyBhIGNvbW1vbiBhdHRhY2sgdmVjdG9yLiBBdHRhY2tlcnMgYXR0ZW1wdCB0byBjb252aW5jZSB0aGUgYXBwIHRvIGNyZWF0ZSBuZXcgd2luZG93cyxcbiAgICogZnJhbWVzLCBvciBvdGhlciByZW5kZXJlciBwcm9jZXNzZXMgd2l0aCBtb3JlIHByaXZpbGVnZXMgdGhhbiB0aGV5IGhhZCBiZWZvcmU7IG9yIHdpdGggcGFnZXMgb3BlbmVkIHRoYXQgdGhleSBjb3VsZG4ndCBvcGVuIGJlZm9yZS5cbiAgICogWW91IHNob3VsZCBkZW55IGFueSB1bmV4cGVjdGVkIHdpbmRvdyBjcmVhdGlvbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxNC1kaXNhYmxlLW9yLWxpbWl0LWNyZWF0aW9uLW9mLW5ldy13aW5kb3dzXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvdHV0b3JpYWwvc2VjdXJpdHkjMTUtZG8tbm90LXVzZS1vcGVuZXh0ZXJuYWwtd2l0aC11bnRydXN0ZWQtY29udGVudFxuICAgKi9cbiAgY29udGVudHMuc2V0V2luZG93T3BlbkhhbmRsZXIoKHt1cmx9KSA9PiB7XG4gICAgY29uc3Qge29yaWdpbn0gPSBuZXcgVVJMKHVybCk7XG5cbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFR5cGUgY2hlY2tpbmcgaXMgcGVyZm9ybWVkIGluIHJ1bnRpbWVcbiAgICBpZiAoQUxMT1dFRF9FWFRFUk5BTF9PUklHSU5TLmhhcyhvcmlnaW4pKSB7XG4gICAgICAvLyBPcGVuIGRlZmF1bHQgYnJvd3NlclxuICAgICAgc2hlbGwub3BlbkV4dGVybmFsKHVybCkuY2F0Y2goY29uc29sZS5lcnJvcik7XG5cbiAgICB9IGVsc2UgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgICAgIGNvbnNvbGUud2FybignQmxvY2tlZCB0aGUgb3BlbmluZyBvZiBhbiB1bmFsbG93ZWQgb3JpZ2luOicsIG9yaWdpbik7XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCBjcmVhdGluZyBuZXcgd2luZG93IGluIGFwcGxpY2F0aW9uXG4gICAgcmV0dXJuIHthY3Rpb246ICdkZW55J307XG4gIH0pO1xuXG5cbiAgLyoqXG4gICAqIFZlcmlmeSB3ZWJ2aWV3IG9wdGlvbnMgYmVmb3JlIGNyZWF0aW9uXG4gICAqXG4gICAqIFN0cmlwIGF3YXkgcHJlbG9hZCBzY3JpcHRzLCBkaXNhYmxlIE5vZGUuanMgaW50ZWdyYXRpb24sIGFuZCBlbnN1cmUgb3JpZ2lucyBhcmUgb24gdGhlIGFsbG93bGlzdC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxMi12ZXJpZnktd2Vidmlldy1vcHRpb25zLWJlZm9yZS1jcmVhdGlvblxuICAgKi9cbiAgY29udGVudHMub24oJ3dpbGwtYXR0YWNoLXdlYnZpZXcnLCAoZXZlbnQsIHdlYlByZWZlcmVuY2VzLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwocGFyYW1zLnNyYyk7XG4gICAgaWYgKCFBTExPV0VEX0VYVEVSTkFMX09SSUdJTlMuaGFzKG9yaWdpbikpIHtcblxuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBBIHdlYnZpZXcgdHJpZWQgdG8gYXR0YWNoICR7cGFyYW1zLnNyY30sIGJ1dCB3YXMgYmxvY2tlZC5gKTtcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTdHJpcCBhd2F5IHByZWxvYWQgc2NyaXB0cyBpZiB1bnVzZWQgb3IgdmVyaWZ5IHRoZWlyIGxvY2F0aW9uIGlzIGxlZ2l0aW1hdGVcbiAgICBkZWxldGUgd2ViUHJlZmVyZW5jZXMucHJlbG9hZDtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGBwcmVsb2FkVVJMYCBleGlzdHMgLSBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3dlYi1jb250ZW50cyNldmVudC13aWxsLWF0dGFjaC13ZWJ2aWV3XG4gICAgZGVsZXRlIHdlYlByZWZlcmVuY2VzLnByZWxvYWRVUkw7XG5cbiAgICAvLyBEaXNhYmxlIE5vZGUuanMgaW50ZWdyYXRpb25cbiAgICB3ZWJQcmVmZXJlbmNlcy5ub2RlSW50ZWdyYXRpb24gPSBmYWxzZTtcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IEJyb3dzZXJXaW5kb3csTWVudSxzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVVJMIH0gZnJvbSAndXJsJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xuICBjb25zdCBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHNob3c6IGZhbHNlLCAvLyBVc2UgJ3JlYWR5LXRvLXNob3cnIGV2ZW50IHRvIHNob3cgd2luZG93XG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIG5hdGl2ZVdpbmRvd09wZW46IHRydWUsXG4gICAgICB3ZWJ2aWV3VGFnOiB0cnVlLCAvLyBUaGUgd2VidmlldyB0YWcgaXMgbm90IHJlY29tbWVuZGVkLiBDb25zaWRlciBhbHRlcm5hdGl2ZXMgbGlrZSBpZnJhbWUgb3IgRWxlY3Ryb24ncyBCcm93c2VyVmlldy4gaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3dlYnZpZXctdGFnI3dhcm5pbmdcbiAgICAgIHByZWxvYWQ6IGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vcHJlbG9hZC9kaXN0L2luZGV4LmNqcycpLFxuICAgIH0sXG4gICAgd2lkdGg6MTI4MCxcbiAgICBoZWlnaHQ6NzAwLFxuICB9KTtcblxuICAvKipcbiAgKiBJZiB5b3UgaW5zdGFsbCBgc2hvdzogdHJ1ZWAgdGhlbiBpdCBjYW4gY2F1c2UgaXNzdWVzIHdoZW4gdHJ5aW5nIHRvIGNsb3NlIHRoZSB3aW5kb3cuXG4gICogVXNlIGBzaG93OiBmYWxzZWAgYW5kIGxpc3RlbmVyIGV2ZW50cyBgcmVhZHktdG8tc2hvd2AgdG8gZml4IHRoZXNlIGlzc3Vlcy5cbiAgKlxuICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8yNTAxMlxuICAqL1xuICBtYWluV2luZG93Lm9uKCdyZWFkeS10by1zaG93JywgKCkgPT4ge1xuICAgIG1haW5XaW5kb3c/LnNob3coKTtcblxuICAgIC8vIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gICAgLy8gICBtYWluV2luZG93Py53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgICAvLyB9XG4gIH0pO1xuXG4gIC8qKlxuICAqIFVSTCBmb3IgbWFpbiB3aW5kb3cuXG4gICogVml0ZSBkZXYgc2VydmVyIGZvciBkZXZlbG9wbWVudC5cbiAgKiBgZmlsZTovLy4uL3JlbmRlcmVyL2luZGV4Lmh0bWxgIGZvciBwcm9kdWN0aW9uIGFuZCB0ZXN0XG4gICovXG4gIGNvbnN0IHBhZ2VVcmwgPSBpbXBvcnQubWV0YS5lbnYuREVWICYmIGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMICE9PSB1bmRlZmluZWRcbiAgICA/IGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMXG4gICAgOiBuZXcgVVJMKCcuLi9yZW5kZXJlci9kaXN0L2luZGV4Lmh0bWwnLCAnZmlsZTovLycgKyBfX2Rpcm5hbWUpLnRvU3RyaW5nKCk7XG5cblxuICBhd2FpdCBtYWluV2luZG93LmxvYWRVUkwocGFnZVVybCk7XG4gIC8vIG1haW5XaW5kb3cud2ViQ29udGVudHMubG9hZFVSTChcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb21cIik7XG5cbiAgcmV0dXJuIG1haW5XaW5kb3c7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4qIFJlc3RvcmUgZXhpc3RpbmcgQnJvd3NlcldpbmRvdyBvciBDcmVhdGUgbmV3IEJyb3dzZXJXaW5kb3dcbiovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzdG9yZU9yQ3JlYXRlV2luZG93KCkge1xuICBsZXQgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpO1xuXG4gIGNvbnN0IHRlbXBsYXRlID0gW1xuICAgIHtcbiAgICAgIGxhYmVsOiAnV2luZG93JyxcbiAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgeyByb2xlOiAncXVpdCcgfSxcbiAgICAgICAgeyByb2xlOiAncmVsb2FkJyB9LFxuICAgICAgICB7IHJvbGU6ICdmb3JjZVJlbG9hZCcgfSxcbiAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICB7IHJvbGU6ICd0b2dnbGVEZXZUb29scycgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIHJvbGU6ICdoZWxwJyxcbiAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnVHV0b3JpYWxzJyxcbiAgICAgICAgICBjbGljazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL25mZGk0cGxhbnRzLm9yZy9uZmRpNHBsYW50cy5rbm93bGVkZ2ViYXNlL2RvY3MvdHV0b3JpYWxzL1F1aWNrU3RhcnRfc3dhdGUuaHRtbCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnSGVscGRlc2snLFxuICAgICAgICAgIGNsaWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vaGVscGRlc2submZkaTRwbGFudHMub3JnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdLbm93bGVkZ2UgQmFzZScsXG4gICAgICAgICAgY2xpY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9uZmRpNHBsYW50cy5vcmcvbmZkaTRwbGFudHMua25vd2xlZGdlYmFzZS9pbmRleC5odG1sJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH1cbiAgXTtcbiAgY29uc3QgbWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUodGVtcGxhdGUpO1xuICBNZW51LnNldEFwcGxpY2F0aW9uTWVudShtZW51KTtcblxuICBpZiAod2luZG93ID09PSB1bmRlZmluZWQpIHtcbiAgICB3aW5kb3cgPSBhd2FpdCBjcmVhdGVXaW5kb3coKTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuaXNNaW5pbWl6ZWQoKSkge1xuICAgIHdpbmRvdy5yZXN0b3JlKCk7XG4gIH1cblxuICB3aW5kb3cuZm9jdXMoKTtcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmZyb21DYWxsYmFjayA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoXSA9IChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgIHJlc29sdmUocmVzKVxuICAgICAgICB9XG4gICAgICAgIGFyZ3VtZW50cy5sZW5ndGgrK1xuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cbiAgfSwgJ25hbWUnLCB7IHZhbHVlOiBmbi5uYW1lIH0pXG59XG5cbmV4cG9ydHMuZnJvbVByb21pc2UgPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2IgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdXG4gICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICBlbHNlIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykudGhlbihyID0+IGNiKG51bGwsIHIpLCBjYilcbiAgfSwgJ25hbWUnLCB7IHZhbHVlOiBmbi5uYW1lIH0pXG59XG4iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnY29uc3RhbnRzJylcblxudmFyIG9yaWdDd2QgPSBwcm9jZXNzLmN3ZFxudmFyIGN3ZCA9IG51bGxcblxudmFyIHBsYXRmb3JtID0gcHJvY2Vzcy5lbnYuR1JBQ0VGVUxfRlNfUExBVEZPUk0gfHwgcHJvY2Vzcy5wbGF0Zm9ybVxuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIWN3ZClcbiAgICBjd2QgPSBvcmlnQ3dkLmNhbGwocHJvY2VzcylcbiAgcmV0dXJuIGN3ZFxufVxudHJ5IHtcbiAgcHJvY2Vzcy5jd2QoKVxufSBjYXRjaCAoZXIpIHt9XG5cbi8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIHVudGlsIG5vZGUuanMgMTIgaXMgcmVxdWlyZWRcbmlmICh0eXBlb2YgcHJvY2Vzcy5jaGRpciA9PT0gJ2Z1bmN0aW9uJykge1xuICB2YXIgY2hkaXIgPSBwcm9jZXNzLmNoZGlyXG4gIHByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZCkge1xuICAgIGN3ZCA9IG51bGxcbiAgICBjaGRpci5jYWxsKHByb2Nlc3MsIGQpXG4gIH1cbiAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikgT2JqZWN0LnNldFByb3RvdHlwZU9mKHByb2Nlc3MuY2hkaXIsIGNoZGlyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoXG5cbmZ1bmN0aW9uIHBhdGNoIChmcykge1xuICAvLyAocmUtKWltcGxlbWVudCBzb21lIHRoaW5ncyB0aGF0IGFyZSBrbm93biBidXN0ZWQgb3IgbWlzc2luZy5cblxuICAvLyBsY2htb2QsIGJyb2tlbiBwcmlvciB0byAwLjYuMlxuICAvLyBiYWNrLXBvcnQgdGhlIGZpeCBoZXJlLlxuICBpZiAoY29uc3RhbnRzLmhhc093blByb3BlcnR5KCdPX1NZTUxJTksnKSAmJlxuICAgICAgcHJvY2Vzcy52ZXJzaW9uLm1hdGNoKC9edjBcXC42XFwuWzAtMl18XnYwXFwuNVxcLi8pKSB7XG4gICAgcGF0Y2hMY2htb2QoZnMpXG4gIH1cblxuICAvLyBsdXRpbWVzIGltcGxlbWVudGF0aW9uLCBvciBuby1vcFxuICBpZiAoIWZzLmx1dGltZXMpIHtcbiAgICBwYXRjaEx1dGltZXMoZnMpXG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vaXNhYWNzL25vZGUtZ3JhY2VmdWwtZnMvaXNzdWVzLzRcbiAgLy8gQ2hvd24gc2hvdWxkIG5vdCBmYWlsIG9uIGVpbnZhbCBvciBlcGVybSBpZiBub24tcm9vdC5cbiAgLy8gSXQgc2hvdWxkIG5vdCBmYWlsIG9uIGVub3N5cyBldmVyLCBhcyB0aGlzIGp1c3QgaW5kaWNhdGVzXG4gIC8vIHRoYXQgYSBmcyBkb2Vzbid0IHN1cHBvcnQgdGhlIGludGVuZGVkIG9wZXJhdGlvbi5cblxuICBmcy5jaG93biA9IGNob3duRml4KGZzLmNob3duKVxuICBmcy5mY2hvd24gPSBjaG93bkZpeChmcy5mY2hvd24pXG4gIGZzLmxjaG93biA9IGNob3duRml4KGZzLmxjaG93bilcblxuICBmcy5jaG1vZCA9IGNobW9kRml4KGZzLmNobW9kKVxuICBmcy5mY2htb2QgPSBjaG1vZEZpeChmcy5mY2htb2QpXG4gIGZzLmxjaG1vZCA9IGNobW9kRml4KGZzLmxjaG1vZClcblxuICBmcy5jaG93blN5bmMgPSBjaG93bkZpeFN5bmMoZnMuY2hvd25TeW5jKVxuICBmcy5mY2hvd25TeW5jID0gY2hvd25GaXhTeW5jKGZzLmZjaG93blN5bmMpXG4gIGZzLmxjaG93blN5bmMgPSBjaG93bkZpeFN5bmMoZnMubGNob3duU3luYylcblxuICBmcy5jaG1vZFN5bmMgPSBjaG1vZEZpeFN5bmMoZnMuY2htb2RTeW5jKVxuICBmcy5mY2htb2RTeW5jID0gY2htb2RGaXhTeW5jKGZzLmZjaG1vZFN5bmMpXG4gIGZzLmxjaG1vZFN5bmMgPSBjaG1vZEZpeFN5bmMoZnMubGNobW9kU3luYylcblxuICBmcy5zdGF0ID0gc3RhdEZpeChmcy5zdGF0KVxuICBmcy5mc3RhdCA9IHN0YXRGaXgoZnMuZnN0YXQpXG4gIGZzLmxzdGF0ID0gc3RhdEZpeChmcy5sc3RhdClcblxuICBmcy5zdGF0U3luYyA9IHN0YXRGaXhTeW5jKGZzLnN0YXRTeW5jKVxuICBmcy5mc3RhdFN5bmMgPSBzdGF0Rml4U3luYyhmcy5mc3RhdFN5bmMpXG4gIGZzLmxzdGF0U3luYyA9IHN0YXRGaXhTeW5jKGZzLmxzdGF0U3luYylcblxuICAvLyBpZiBsY2htb2QvbGNob3duIGRvIG5vdCBleGlzdCwgdGhlbiBtYWtlIHRoZW0gbm8tb3BzXG4gIGlmIChmcy5jaG1vZCAmJiAhZnMubGNobW9kKSB7XG4gICAgZnMubGNobW9kID0gZnVuY3Rpb24gKHBhdGgsIG1vZGUsIGNiKSB7XG4gICAgICBpZiAoY2IpIHByb2Nlc3MubmV4dFRpY2soY2IpXG4gICAgfVxuICAgIGZzLmxjaG1vZFN5bmMgPSBmdW5jdGlvbiAoKSB7fVxuICB9XG4gIGlmIChmcy5jaG93biAmJiAhZnMubGNob3duKSB7XG4gICAgZnMubGNob3duID0gZnVuY3Rpb24gKHBhdGgsIHVpZCwgZ2lkLCBjYikge1xuICAgICAgaWYgKGNiKSBwcm9jZXNzLm5leHRUaWNrKGNiKVxuICAgIH1cbiAgICBmcy5sY2hvd25TeW5jID0gZnVuY3Rpb24gKCkge31cbiAgfVxuXG4gIC8vIG9uIFdpbmRvd3MsIEEvViBzb2Z0d2FyZSBjYW4gbG9jayB0aGUgZGlyZWN0b3J5LCBjYXVzaW5nIHRoaXNcbiAgLy8gdG8gZmFpbCB3aXRoIGFuIEVBQ0NFUyBvciBFUEVSTSBpZiB0aGUgZGlyZWN0b3J5IGNvbnRhaW5zIG5ld2x5XG4gIC8vIGNyZWF0ZWQgZmlsZXMuICBUcnkgYWdhaW4gb24gZmFpbHVyZSwgZm9yIHVwIHRvIDYwIHNlY29uZHMuXG5cbiAgLy8gU2V0IHRoZSB0aW1lb3V0IHRoaXMgbG9uZyBiZWNhdXNlIHNvbWUgV2luZG93cyBBbnRpLVZpcnVzLCBzdWNoIGFzIFBhcml0eVxuICAvLyBiaXQ5LCBtYXkgbG9jayBmaWxlcyBmb3IgdXAgdG8gYSBtaW51dGUsIGNhdXNpbmcgbnBtIHBhY2thZ2UgaW5zdGFsbFxuICAvLyBmYWlsdXJlcy4gQWxzbywgdGFrZSBjYXJlIHRvIHlpZWxkIHRoZSBzY2hlZHVsZXIuIFdpbmRvd3Mgc2NoZWR1bGluZyBnaXZlc1xuICAvLyBDUFUgdG8gYSBidXN5IGxvb3BpbmcgcHJvY2Vzcywgd2hpY2ggY2FuIGNhdXNlIHRoZSBwcm9ncmFtIGNhdXNpbmcgdGhlIGxvY2tcbiAgLy8gY29udGVudGlvbiB0byBiZSBzdGFydmVkIG9mIENQVSBieSBub2RlLCBzbyB0aGUgY29udGVudGlvbiBkb2Vzbid0IHJlc29sdmUuXG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKSB7XG4gICAgZnMucmVuYW1lID0gdHlwZW9mIGZzLnJlbmFtZSAhPT0gJ2Z1bmN0aW9uJyA/IGZzLnJlbmFtZVxuICAgIDogKGZ1bmN0aW9uIChmcyRyZW5hbWUpIHtcbiAgICAgIGZ1bmN0aW9uIHJlbmFtZSAoZnJvbSwgdG8sIGNiKSB7XG4gICAgICAgIHZhciBzdGFydCA9IERhdGUubm93KClcbiAgICAgICAgdmFyIGJhY2tvZmYgPSAwO1xuICAgICAgICBmcyRyZW5hbWUoZnJvbSwgdG8sIGZ1bmN0aW9uIENCIChlcikge1xuICAgICAgICAgIGlmIChlclxuICAgICAgICAgICAgICAmJiAoZXIuY29kZSA9PT0gXCJFQUNDRVNcIiB8fCBlci5jb2RlID09PSBcIkVQRVJNXCIpXG4gICAgICAgICAgICAgICYmIERhdGUubm93KCkgLSBzdGFydCA8IDYwMDAwKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBmcy5zdGF0KHRvLCBmdW5jdGlvbiAoc3RhdGVyLCBzdCkge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZXIgJiYgc3RhdGVyLmNvZGUgPT09IFwiRU5PRU5UXCIpXG4gICAgICAgICAgICAgICAgICBmcyRyZW5hbWUoZnJvbSwgdG8sIENCKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBjYihlcilcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sIGJhY2tvZmYpXG4gICAgICAgICAgICBpZiAoYmFja29mZiA8IDEwMClcbiAgICAgICAgICAgICAgYmFja29mZiArPSAxMDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNiKSBjYihlcilcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIE9iamVjdC5zZXRQcm90b3R5cGVPZihyZW5hbWUsIGZzJHJlbmFtZSlcbiAgICAgIHJldHVybiByZW5hbWVcbiAgICB9KShmcy5yZW5hbWUpXG4gIH1cblxuICAvLyBpZiByZWFkKCkgcmV0dXJucyBFQUdBSU4sIHRoZW4ganVzdCB0cnkgaXQgYWdhaW4uXG4gIGZzLnJlYWQgPSB0eXBlb2YgZnMucmVhZCAhPT0gJ2Z1bmN0aW9uJyA/IGZzLnJlYWRcbiAgOiAoZnVuY3Rpb24gKGZzJHJlYWQpIHtcbiAgICBmdW5jdGlvbiByZWFkIChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrXykge1xuICAgICAgdmFyIGNhbGxiYWNrXG4gICAgICBpZiAoY2FsbGJhY2tfICYmIHR5cGVvZiBjYWxsYmFja18gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIGVhZ0NvdW50ZXIgPSAwXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKGVyLCBfLCBfXykge1xuICAgICAgICAgIGlmIChlciAmJiBlci5jb2RlID09PSAnRUFHQUlOJyAmJiBlYWdDb3VudGVyIDwgMTApIHtcbiAgICAgICAgICAgIGVhZ0NvdW50ZXIgKytcbiAgICAgICAgICAgIHJldHVybiBmcyRyZWFkLmNhbGwoZnMsIGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgY2FsbGJhY2spXG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrXy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmcyRyZWFkLmNhbGwoZnMsIGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbiwgY2FsbGJhY2spXG4gICAgfVxuXG4gICAgLy8gVGhpcyBlbnN1cmVzIGB1dGlsLnByb21pc2lmeWAgd29ya3MgYXMgaXQgZG9lcyBmb3IgbmF0aXZlIGBmcy5yZWFkYC5cbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSBPYmplY3Quc2V0UHJvdG90eXBlT2YocmVhZCwgZnMkcmVhZClcbiAgICByZXR1cm4gcmVhZFxuICB9KShmcy5yZWFkKVxuXG4gIGZzLnJlYWRTeW5jID0gdHlwZW9mIGZzLnJlYWRTeW5jICE9PSAnZnVuY3Rpb24nID8gZnMucmVhZFN5bmNcbiAgOiAoZnVuY3Rpb24gKGZzJHJlYWRTeW5jKSB7IHJldHVybiBmdW5jdGlvbiAoZmQsIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvc2l0aW9uKSB7XG4gICAgdmFyIGVhZ0NvdW50ZXIgPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmcyRyZWFkU3luYy5jYWxsKGZzLCBmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24pXG4gICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICBpZiAoZXIuY29kZSA9PT0gJ0VBR0FJTicgJiYgZWFnQ291bnRlciA8IDEwKSB7XG4gICAgICAgICAgZWFnQ291bnRlciArK1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJcbiAgICAgIH1cbiAgICB9XG4gIH19KShmcy5yZWFkU3luYylcblxuICBmdW5jdGlvbiBwYXRjaExjaG1vZCAoZnMpIHtcbiAgICBmcy5sY2htb2QgPSBmdW5jdGlvbiAocGF0aCwgbW9kZSwgY2FsbGJhY2spIHtcbiAgICAgIGZzLm9wZW4oIHBhdGhcbiAgICAgICAgICAgICAsIGNvbnN0YW50cy5PX1dST05MWSB8IGNvbnN0YW50cy5PX1NZTUxJTktcbiAgICAgICAgICAgICAsIG1vZGVcbiAgICAgICAgICAgICAsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKGVycilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAvLyBwcmVmZXIgdG8gcmV0dXJuIHRoZSBjaG1vZCBlcnJvciwgaWYgb25lIG9jY3VycyxcbiAgICAgICAgLy8gYnV0IHN0aWxsIHRyeSB0byBjbG9zZSwgYW5kIHJlcG9ydCBjbG9zaW5nIGVycm9ycyBpZiB0aGV5IG9jY3VyLlxuICAgICAgICBmcy5mY2htb2QoZmQsIG1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBmcy5jbG9zZShmZCwgZnVuY3Rpb24oZXJyMikge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhlcnIgfHwgZXJyMilcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmcy5sY2htb2RTeW5jID0gZnVuY3Rpb24gKHBhdGgsIG1vZGUpIHtcbiAgICAgIHZhciBmZCA9IGZzLm9wZW5TeW5jKHBhdGgsIGNvbnN0YW50cy5PX1dST05MWSB8IGNvbnN0YW50cy5PX1NZTUxJTkssIG1vZGUpXG5cbiAgICAgIC8vIHByZWZlciB0byByZXR1cm4gdGhlIGNobW9kIGVycm9yLCBpZiBvbmUgb2NjdXJzLFxuICAgICAgLy8gYnV0IHN0aWxsIHRyeSB0byBjbG9zZSwgYW5kIHJlcG9ydCBjbG9zaW5nIGVycm9ycyBpZiB0aGV5IG9jY3VyLlxuICAgICAgdmFyIHRocmV3ID0gdHJ1ZVxuICAgICAgdmFyIHJldFxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0ID0gZnMuZmNobW9kU3luYyhmZCwgbW9kZSlcbiAgICAgICAgdGhyZXcgPSBmYWxzZVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKHRocmV3KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZzLmNsb3NlU3luYyhmZClcbiAgICAgICAgICB9IGNhdGNoIChlcikge31cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5jbG9zZVN5bmMoZmQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXRcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXRjaEx1dGltZXMgKGZzKSB7XG4gICAgaWYgKGNvbnN0YW50cy5oYXNPd25Qcm9wZXJ0eShcIk9fU1lNTElOS1wiKSAmJiBmcy5mdXRpbWVzKSB7XG4gICAgICBmcy5sdXRpbWVzID0gZnVuY3Rpb24gKHBhdGgsIGF0LCBtdCwgY2IpIHtcbiAgICAgICAgZnMub3BlbihwYXRoLCBjb25zdGFudHMuT19TWU1MSU5LLCBmdW5jdGlvbiAoZXIsIGZkKSB7XG4gICAgICAgICAgaWYgKGVyKSB7XG4gICAgICAgICAgICBpZiAoY2IpIGNiKGVyKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGZzLmZ1dGltZXMoZmQsIGF0LCBtdCwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICAgICAgICBmcy5jbG9zZShmZCwgZnVuY3Rpb24gKGVyMikge1xuICAgICAgICAgICAgICBpZiAoY2IpIGNiKGVyIHx8IGVyMilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgZnMubHV0aW1lc1N5bmMgPSBmdW5jdGlvbiAocGF0aCwgYXQsIG10KSB7XG4gICAgICAgIHZhciBmZCA9IGZzLm9wZW5TeW5jKHBhdGgsIGNvbnN0YW50cy5PX1NZTUxJTkspXG4gICAgICAgIHZhciByZXRcbiAgICAgICAgdmFyIHRocmV3ID0gdHJ1ZVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldCA9IGZzLmZ1dGltZXNTeW5jKGZkLCBhdCwgbXQpXG4gICAgICAgICAgdGhyZXcgPSBmYWxzZVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmICh0aHJldykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgZnMuY2xvc2VTeW5jKGZkKVxuICAgICAgICAgICAgfSBjYXRjaCAoZXIpIHt9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZzLmNsb3NlU3luYyhmZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFxuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChmcy5mdXRpbWVzKSB7XG4gICAgICBmcy5sdXRpbWVzID0gZnVuY3Rpb24gKF9hLCBfYiwgX2MsIGNiKSB7IGlmIChjYikgcHJvY2Vzcy5uZXh0VGljayhjYikgfVxuICAgICAgZnMubHV0aW1lc1N5bmMgPSBmdW5jdGlvbiAoKSB7fVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNobW9kRml4IChvcmlnKSB7XG4gICAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBtb2RlLCBjYikge1xuICAgICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCBtb2RlLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgICAgaWYgKGNob3duRXJPayhlcikpIGVyID0gbnVsbFxuICAgICAgICBpZiAoY2IpIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2htb2RGaXhTeW5jIChvcmlnKSB7XG4gICAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBtb2RlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIG1vZGUpXG4gICAgICB9IGNhdGNoIChlcikge1xuICAgICAgICBpZiAoIWNob3duRXJPayhlcikpIHRocm93IGVyXG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBmdW5jdGlvbiBjaG93bkZpeCAob3JpZykge1xuICAgIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgdWlkLCBnaWQsIGNiKSB7XG4gICAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIHVpZCwgZ2lkLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgICAgaWYgKGNob3duRXJPayhlcikpIGVyID0gbnVsbFxuICAgICAgICBpZiAoY2IpIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hvd25GaXhTeW5jIChvcmlnKSB7XG4gICAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCB1aWQsIGdpZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCB1aWQsIGdpZClcbiAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgIGlmICghY2hvd25Fck9rKGVyKSkgdGhyb3cgZXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdGF0Rml4IChvcmlnKSB7XG4gICAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICAgIC8vIE9sZGVyIHZlcnNpb25zIG9mIE5vZGUgZXJyb25lb3VzbHkgcmV0dXJuZWQgc2lnbmVkIGludGVnZXJzIGZvclxuICAgIC8vIHVpZCArIGdpZC5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgb3B0aW9ucywgY2IpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYiA9IG9wdGlvbnNcbiAgICAgICAgb3B0aW9ucyA9IG51bGxcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGNhbGxiYWNrIChlciwgc3RhdHMpIHtcbiAgICAgICAgaWYgKHN0YXRzKSB7XG4gICAgICAgICAgaWYgKHN0YXRzLnVpZCA8IDApIHN0YXRzLnVpZCArPSAweDEwMDAwMDAwMFxuICAgICAgICAgIGlmIChzdGF0cy5naWQgPCAwKSBzdGF0cy5naWQgKz0gMHgxMDAwMDAwMDBcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2IpIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHRpb25zID8gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgICA6IG9yaWcuY2FsbChmcywgdGFyZ2V0LCBjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdGF0Rml4U3luYyAob3JpZykge1xuICAgIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgICAvLyBPbGRlciB2ZXJzaW9ucyBvZiBOb2RlIGVycm9uZW91c2x5IHJldHVybmVkIHNpZ25lZCBpbnRlZ2VycyBmb3JcbiAgICAvLyB1aWQgKyBnaWQuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzdGF0cyA9IG9wdGlvbnMgPyBvcmlnLmNhbGwoZnMsIHRhcmdldCwgb3B0aW9ucylcbiAgICAgICAgOiBvcmlnLmNhbGwoZnMsIHRhcmdldClcbiAgICAgIGlmIChzdGF0cykge1xuICAgICAgICBpZiAoc3RhdHMudWlkIDwgMCkgc3RhdHMudWlkICs9IDB4MTAwMDAwMDAwXG4gICAgICAgIGlmIChzdGF0cy5naWQgPCAwKSBzdGF0cy5naWQgKz0gMHgxMDAwMDAwMDBcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0cztcbiAgICB9XG4gIH1cblxuICAvLyBFTk9TWVMgbWVhbnMgdGhhdCB0aGUgZnMgZG9lc24ndCBzdXBwb3J0IHRoZSBvcC4gSnVzdCBpZ25vcmVcbiAgLy8gdGhhdCwgYmVjYXVzZSBpdCBkb2Vzbid0IG1hdHRlci5cbiAgLy9cbiAgLy8gaWYgdGhlcmUncyBubyBnZXR1aWQsIG9yIGlmIGdldHVpZCgpIGlzIHNvbWV0aGluZyBvdGhlclxuICAvLyB0aGFuIDAsIGFuZCB0aGUgZXJyb3IgaXMgRUlOVkFMIG9yIEVQRVJNLCB0aGVuIGp1c3QgaWdub3JlXG4gIC8vIGl0LlxuICAvL1xuICAvLyBUaGlzIHNwZWNpZmljIGNhc2UgaXMgYSBzaWxlbnQgZmFpbHVyZSBpbiBjcCwgaW5zdGFsbCwgdGFyLFxuICAvLyBhbmQgbW9zdCBvdGhlciB1bml4IHRvb2xzIHRoYXQgbWFuYWdlIHBlcm1pc3Npb25zLlxuICAvL1xuICAvLyBXaGVuIHJ1bm5pbmcgYXMgcm9vdCwgb3IgaWYgb3RoZXIgdHlwZXMgb2YgZXJyb3JzIGFyZVxuICAvLyBlbmNvdW50ZXJlZCwgdGhlbiBpdCdzIHN0cmljdC5cbiAgZnVuY3Rpb24gY2hvd25Fck9rIChlcikge1xuICAgIGlmICghZXIpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgaWYgKGVyLmNvZGUgPT09IFwiRU5PU1lTXCIpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgdmFyIG5vbnJvb3QgPSAhcHJvY2Vzcy5nZXR1aWQgfHwgcHJvY2Vzcy5nZXR1aWQoKSAhPT0gMFxuICAgIGlmIChub25yb290KSB7XG4gICAgICBpZiAoZXIuY29kZSA9PT0gXCJFSU5WQUxcIiB8fCBlci5jb2RlID09PSBcIkVQRVJNXCIpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiIsInZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW1cblxubW9kdWxlLmV4cG9ydHMgPSBsZWdhY3lcblxuZnVuY3Rpb24gbGVnYWN5IChmcykge1xuICByZXR1cm4ge1xuICAgIFJlYWRTdHJlYW06IFJlYWRTdHJlYW0sXG4gICAgV3JpdGVTdHJlYW06IFdyaXRlU3RyZWFtXG4gIH1cblxuICBmdW5jdGlvbiBSZWFkU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRTdHJlYW0pKSByZXR1cm4gbmV3IFJlYWRTdHJlYW0ocGF0aCwgb3B0aW9ucyk7XG5cbiAgICBTdHJlYW0uY2FsbCh0aGlzKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5mZCA9IG51bGw7XG4gICAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuZmxhZ3MgPSAncic7XG4gICAgdGhpcy5tb2RlID0gNDM4OyAvKj0wNjY2Ki9cbiAgICB0aGlzLmJ1ZmZlclNpemUgPSA2NCAqIDEwMjQ7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIE1peGluIG9wdGlvbnMgaW50byB0aGlzXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuY29kaW5nKSB0aGlzLnNldEVuY29kaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgaWYgKHRoaXMuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5zdGFydCkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ3N0YXJ0IG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZW5kID0gSW5maW5pdHk7XG4gICAgICB9IGVsc2UgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5lbmQpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdlbmQgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGFydCA+IHRoaXMuZW5kKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc3RhcnQgbXVzdCBiZSA8PSBlbmQnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb3MgPSB0aGlzLnN0YXJ0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZkICE9PSBudWxsKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLl9yZWFkKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmcy5vcGVuKHRoaXMucGF0aCwgdGhpcy5mbGFncywgdGhpcy5tb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgc2VsZi5yZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuZmQgPSBmZDtcbiAgICAgIHNlbGYuZW1pdCgnb3BlbicsIGZkKTtcbiAgICAgIHNlbGYuX3JlYWQoKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gV3JpdGVTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgV3JpdGVTdHJlYW0pKSByZXR1cm4gbmV3IFdyaXRlU3RyZWFtKHBhdGgsIG9wdGlvbnMpO1xuXG4gICAgU3RyZWFtLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMuZmQgPSBudWxsO1xuICAgIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuXG4gICAgdGhpcy5mbGFncyA9ICd3JztcbiAgICB0aGlzLmVuY29kaW5nID0gJ2JpbmFyeSc7XG4gICAgdGhpcy5tb2RlID0gNDM4OyAvKj0wNjY2Ki9cbiAgICB0aGlzLmJ5dGVzV3JpdHRlbiA9IDA7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIE1peGluIG9wdGlvbnMgaW50byB0aGlzXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICgnbnVtYmVyJyAhPT0gdHlwZW9mIHRoaXMuc3RhcnQpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzdGFydCBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGFydCA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBtdXN0IGJlID49IHplcm8nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb3MgPSB0aGlzLnN0YXJ0O1xuICAgIH1cblxuICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuICAgIHRoaXMuX3F1ZXVlID0gW107XG5cbiAgICBpZiAodGhpcy5mZCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fb3BlbiA9IGZzLm9wZW47XG4gICAgICB0aGlzLl9xdWV1ZS5wdXNoKFt0aGlzLl9vcGVuLCB0aGlzLnBhdGgsIHRoaXMuZmxhZ3MsIHRoaXMubW9kZSwgdW5kZWZpbmVkXSk7XG4gICAgICB0aGlzLmZsdXNoKCk7XG4gICAgfVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVxuXG52YXIgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqLl9fcHJvdG9fX1xufVxuXG5mdW5jdGlvbiBjbG9uZSAob2JqKSB7XG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIG9ialxuXG4gIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgdmFyIGNvcHkgPSB7IF9fcHJvdG9fXzogZ2V0UHJvdG90eXBlT2Yob2JqKSB9XG4gIGVsc2VcbiAgICB2YXIgY29weSA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb3B5LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpKVxuICB9KVxuXG4gIHJldHVybiBjb3B5XG59XG4iLCJ2YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgcG9seWZpbGxzID0gcmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKVxudmFyIGxlZ2FjeSA9IHJlcXVpcmUoJy4vbGVnYWN5LXN0cmVhbXMuanMnKVxudmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZS5qcycpXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IC0gbm9kZSAwLnggcG9seWZpbGwgKi9cbnZhciBncmFjZWZ1bFF1ZXVlXG52YXIgcHJldmlvdXNTeW1ib2xcblxuLyogaXN0YW5idWwgaWdub3JlIGVsc2UgLSBub2RlIDAueCBwb2x5ZmlsbCAqL1xuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbC5mb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgZ3JhY2VmdWxRdWV1ZSA9IFN5bWJvbC5mb3IoJ2dyYWNlZnVsLWZzLnF1ZXVlJylcbiAgLy8gVGhpcyBpcyB1c2VkIGluIHRlc3RpbmcgYnkgZnV0dXJlIHZlcnNpb25zXG4gIHByZXZpb3VzU3ltYm9sID0gU3ltYm9sLmZvcignZ3JhY2VmdWwtZnMucHJldmlvdXMnKVxufSBlbHNlIHtcbiAgZ3JhY2VmdWxRdWV1ZSA9ICdfX19ncmFjZWZ1bC1mcy5xdWV1ZSdcbiAgcHJldmlvdXNTeW1ib2wgPSAnX19fZ3JhY2VmdWwtZnMucHJldmlvdXMnXG59XG5cbmZ1bmN0aW9uIG5vb3AgKCkge31cblxuZnVuY3Rpb24gcHVibGlzaFF1ZXVlKGNvbnRleHQsIHF1ZXVlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb250ZXh0LCBncmFjZWZ1bFF1ZXVlLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBxdWV1ZVxuICAgIH1cbiAgfSlcbn1cblxudmFyIGRlYnVnID0gbm9vcFxuaWYgKHV0aWwuZGVidWdsb2cpXG4gIGRlYnVnID0gdXRpbC5kZWJ1Z2xvZygnZ2ZzNCcpXG5lbHNlIGlmICgvXFxiZ2ZzNFxcYi9pLnRlc3QocHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJykpXG4gIGRlYnVnID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG0gPSB1dGlsLmZvcm1hdC5hcHBseSh1dGlsLCBhcmd1bWVudHMpXG4gICAgbSA9ICdHRlM0OiAnICsgbS5zcGxpdCgvXFxuLykuam9pbignXFxuR0ZTNDogJylcbiAgICBjb25zb2xlLmVycm9yKG0pXG4gIH1cblxuLy8gT25jZSB0aW1lIGluaXRpYWxpemF0aW9uXG5pZiAoIWZzW2dyYWNlZnVsUXVldWVdKSB7XG4gIC8vIFRoaXMgcXVldWUgY2FuIGJlIHNoYXJlZCBieSBtdWx0aXBsZSBsb2FkZWQgaW5zdGFuY2VzXG4gIHZhciBxdWV1ZSA9IGdsb2JhbFtncmFjZWZ1bFF1ZXVlXSB8fCBbXVxuICBwdWJsaXNoUXVldWUoZnMsIHF1ZXVlKVxuXG4gIC8vIFBhdGNoIGZzLmNsb3NlL2Nsb3NlU3luYyB0byBzaGFyZWQgcXVldWUgdmVyc2lvbiwgYmVjYXVzZSB3ZSBuZWVkXG4gIC8vIHRvIHJldHJ5KCkgd2hlbmV2ZXIgYSBjbG9zZSBoYXBwZW5zICphbnl3aGVyZSogaW4gdGhlIHByb2dyYW0uXG4gIC8vIFRoaXMgaXMgZXNzZW50aWFsIHdoZW4gbXVsdGlwbGUgZ3JhY2VmdWwtZnMgaW5zdGFuY2VzIGFyZVxuICAvLyBpbiBwbGF5IGF0IHRoZSBzYW1lIHRpbWUuXG4gIGZzLmNsb3NlID0gKGZ1bmN0aW9uIChmcyRjbG9zZSkge1xuICAgIGZ1bmN0aW9uIGNsb3NlIChmZCwgY2IpIHtcbiAgICAgIHJldHVybiBmcyRjbG9zZS5jYWxsKGZzLCBmZCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAvLyBUaGlzIGZ1bmN0aW9uIHVzZXMgdGhlIGdyYWNlZnVsLWZzIHNoYXJlZCBxdWV1ZVxuICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgIHJlc2V0UXVldWUoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbG9zZSwgcHJldmlvdXNTeW1ib2wsIHtcbiAgICAgIHZhbHVlOiBmcyRjbG9zZVxuICAgIH0pXG4gICAgcmV0dXJuIGNsb3NlXG4gIH0pKGZzLmNsb3NlKVxuXG4gIGZzLmNsb3NlU3luYyA9IChmdW5jdGlvbiAoZnMkY2xvc2VTeW5jKSB7XG4gICAgZnVuY3Rpb24gY2xvc2VTeW5jIChmZCkge1xuICAgICAgLy8gVGhpcyBmdW5jdGlvbiB1c2VzIHRoZSBncmFjZWZ1bC1mcyBzaGFyZWQgcXVldWVcbiAgICAgIGZzJGNsb3NlU3luYy5hcHBseShmcywgYXJndW1lbnRzKVxuICAgICAgcmVzZXRRdWV1ZSgpXG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNsb3NlU3luYywgcHJldmlvdXNTeW1ib2wsIHtcbiAgICAgIHZhbHVlOiBmcyRjbG9zZVN5bmNcbiAgICB9KVxuICAgIHJldHVybiBjbG9zZVN5bmNcbiAgfSkoZnMuY2xvc2VTeW5jKVxuXG4gIGlmICgvXFxiZ2ZzNFxcYi9pLnRlc3QocHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJykpIHtcbiAgICBwcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24oKSB7XG4gICAgICBkZWJ1Zyhmc1tncmFjZWZ1bFF1ZXVlXSlcbiAgICAgIHJlcXVpcmUoJ2Fzc2VydCcpLmVxdWFsKGZzW2dyYWNlZnVsUXVldWVdLmxlbmd0aCwgMClcbiAgICB9KVxuICB9XG59XG5cbmlmICghZ2xvYmFsW2dyYWNlZnVsUXVldWVdKSB7XG4gIHB1Ymxpc2hRdWV1ZShnbG9iYWwsIGZzW2dyYWNlZnVsUXVldWVdKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXRjaChjbG9uZShmcykpXG5pZiAocHJvY2Vzcy5lbnYuVEVTVF9HUkFDRUZVTF9GU19HTE9CQUxfUEFUQ0ggJiYgIWZzLl9fcGF0Y2hlZCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gcGF0Y2goZnMpXG4gICAgZnMuX19wYXRjaGVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcGF0Y2ggKGZzKSB7XG4gIC8vIEV2ZXJ5dGhpbmcgdGhhdCByZWZlcmVuY2VzIHRoZSBvcGVuKCkgZnVuY3Rpb24gbmVlZHMgdG8gYmUgaW4gaGVyZVxuICBwb2x5ZmlsbHMoZnMpXG4gIGZzLmdyYWNlZnVsaWZ5ID0gcGF0Y2hcblxuICBmcy5jcmVhdGVSZWFkU3RyZWFtID0gY3JlYXRlUmVhZFN0cmVhbVxuICBmcy5jcmVhdGVXcml0ZVN0cmVhbSA9IGNyZWF0ZVdyaXRlU3RyZWFtXG4gIHZhciBmcyRyZWFkRmlsZSA9IGZzLnJlYWRGaWxlXG4gIGZzLnJlYWRGaWxlID0gcmVhZEZpbGVcbiAgZnVuY3Rpb24gcmVhZEZpbGUgKHBhdGgsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBvcHRpb25zLCBvcHRpb25zID0gbnVsbFxuXG4gICAgcmV0dXJuIGdvJHJlYWRGaWxlKHBhdGgsIG9wdGlvbnMsIGNiKVxuXG4gICAgZnVuY3Rpb24gZ28kcmVhZEZpbGUgKHBhdGgsIG9wdGlvbnMsIGNiLCBzdGFydFRpbWUpIHtcbiAgICAgIHJldHVybiBmcyRyZWFkRmlsZShwYXRoLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJHJlYWRGaWxlLCBbcGF0aCwgb3B0aW9ucywgY2JdLCBlcnIsIHN0YXJ0VGltZSB8fCBEYXRlLm5vdygpLCBEYXRlLm5vdygpXSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkd3JpdGVGaWxlID0gZnMud3JpdGVGaWxlXG4gIGZzLndyaXRlRmlsZSA9IHdyaXRlRmlsZVxuICBmdW5jdGlvbiB3cml0ZUZpbGUgKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBvcHRpb25zLCBvcHRpb25zID0gbnVsbFxuXG4gICAgcmV0dXJuIGdvJHdyaXRlRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJHdyaXRlRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IsIHN0YXJ0VGltZSkge1xuICAgICAgcmV0dXJuIGZzJHdyaXRlRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJHdyaXRlRmlsZSwgW3BhdGgsIGRhdGEsIG9wdGlvbnMsIGNiXSwgZXJyLCBzdGFydFRpbWUgfHwgRGF0ZS5ub3coKSwgRGF0ZS5ub3coKV0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdmFyIGZzJGFwcGVuZEZpbGUgPSBmcy5hcHBlbmRGaWxlXG4gIGlmIChmcyRhcHBlbmRGaWxlKVxuICAgIGZzLmFwcGVuZEZpbGUgPSBhcHBlbmRGaWxlXG4gIGZ1bmN0aW9uIGFwcGVuZEZpbGUgKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBvcHRpb25zLCBvcHRpb25zID0gbnVsbFxuXG4gICAgcmV0dXJuIGdvJGFwcGVuZEZpbGUocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpXG5cbiAgICBmdW5jdGlvbiBnbyRhcHBlbmRGaWxlIChwYXRoLCBkYXRhLCBvcHRpb25zLCBjYiwgc3RhcnRUaW1lKSB7XG4gICAgICByZXR1cm4gZnMkYXBwZW5kRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJGFwcGVuZEZpbGUsIFtwYXRoLCBkYXRhLCBvcHRpb25zLCBjYl0sIGVyciwgc3RhcnRUaW1lIHx8IERhdGUubm93KCksIERhdGUubm93KCldKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBmcyRjb3B5RmlsZSA9IGZzLmNvcHlGaWxlXG4gIGlmIChmcyRjb3B5RmlsZSlcbiAgICBmcy5jb3B5RmlsZSA9IGNvcHlGaWxlXG4gIGZ1bmN0aW9uIGNvcHlGaWxlIChzcmMsIGRlc3QsIGZsYWdzLCBjYikge1xuICAgIGlmICh0eXBlb2YgZmxhZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNiID0gZmxhZ3NcbiAgICAgIGZsYWdzID0gMFxuICAgIH1cbiAgICByZXR1cm4gZ28kY29weUZpbGUoc3JjLCBkZXN0LCBmbGFncywgY2IpXG5cbiAgICBmdW5jdGlvbiBnbyRjb3B5RmlsZSAoc3JjLCBkZXN0LCBmbGFncywgY2IsIHN0YXJ0VGltZSkge1xuICAgICAgcmV0dXJuIGZzJGNvcHlGaWxlKHNyYywgZGVzdCwgZmxhZ3MsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09ICdFTUZJTEUnIHx8IGVyci5jb2RlID09PSAnRU5GSUxFJykpXG4gICAgICAgICAgZW5xdWV1ZShbZ28kY29weUZpbGUsIFtzcmMsIGRlc3QsIGZsYWdzLCBjYl0sIGVyciwgc3RhcnRUaW1lIHx8IERhdGUubm93KCksIERhdGUubm93KCldKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBmcyRyZWFkZGlyID0gZnMucmVhZGRpclxuICBmcy5yZWFkZGlyID0gcmVhZGRpclxuICB2YXIgbm9SZWFkZGlyT3B0aW9uVmVyc2lvbnMgPSAvXnZbMC01XVxcLi9cbiAgZnVuY3Rpb24gcmVhZGRpciAocGF0aCwgb3B0aW9ucywgY2IpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpXG4gICAgICBjYiA9IG9wdGlvbnMsIG9wdGlvbnMgPSBudWxsXG5cbiAgICB2YXIgZ28kcmVhZGRpciA9IG5vUmVhZGRpck9wdGlvblZlcnNpb25zLnRlc3QocHJvY2Vzcy52ZXJzaW9uKVxuICAgICAgPyBmdW5jdGlvbiBnbyRyZWFkZGlyIChwYXRoLCBvcHRpb25zLCBjYiwgc3RhcnRUaW1lKSB7XG4gICAgICAgIHJldHVybiBmcyRyZWFkZGlyKHBhdGgsIGZzJHJlYWRkaXJDYWxsYmFjayhcbiAgICAgICAgICBwYXRoLCBvcHRpb25zLCBjYiwgc3RhcnRUaW1lXG4gICAgICAgICkpXG4gICAgICB9XG4gICAgICA6IGZ1bmN0aW9uIGdvJHJlYWRkaXIgKHBhdGgsIG9wdGlvbnMsIGNiLCBzdGFydFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZzJHJlYWRkaXIocGF0aCwgb3B0aW9ucywgZnMkcmVhZGRpckNhbGxiYWNrKFxuICAgICAgICAgIHBhdGgsIG9wdGlvbnMsIGNiLCBzdGFydFRpbWVcbiAgICAgICAgKSlcbiAgICAgIH1cblxuICAgIHJldHVybiBnbyRyZWFkZGlyKHBhdGgsIG9wdGlvbnMsIGNiKVxuXG4gICAgZnVuY3Rpb24gZnMkcmVhZGRpckNhbGxiYWNrIChwYXRoLCBvcHRpb25zLCBjYiwgc3RhcnRUaW1lKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGVyciwgZmlsZXMpIHtcbiAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09ICdFTUZJTEUnIHx8IGVyci5jb2RlID09PSAnRU5GSUxFJykpXG4gICAgICAgICAgZW5xdWV1ZShbXG4gICAgICAgICAgICBnbyRyZWFkZGlyLFxuICAgICAgICAgICAgW3BhdGgsIG9wdGlvbnMsIGNiXSxcbiAgICAgICAgICAgIGVycixcbiAgICAgICAgICAgIHN0YXJ0VGltZSB8fCBEYXRlLm5vdygpLFxuICAgICAgICAgICAgRGF0ZS5ub3coKVxuICAgICAgICAgIF0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5zb3J0KVxuICAgICAgICAgICAgZmlsZXMuc29ydCgpXG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuY2FsbCh0aGlzLCBlcnIsIGZpbGVzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHByb2Nlc3MudmVyc2lvbi5zdWJzdHIoMCwgNCkgPT09ICd2MC44Jykge1xuICAgIHZhciBsZWdTdHJlYW1zID0gbGVnYWN5KGZzKVxuICAgIFJlYWRTdHJlYW0gPSBsZWdTdHJlYW1zLlJlYWRTdHJlYW1cbiAgICBXcml0ZVN0cmVhbSA9IGxlZ1N0cmVhbXMuV3JpdGVTdHJlYW1cbiAgfVxuXG4gIHZhciBmcyRSZWFkU3RyZWFtID0gZnMuUmVhZFN0cmVhbVxuICBpZiAoZnMkUmVhZFN0cmVhbSkge1xuICAgIFJlYWRTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShmcyRSZWFkU3RyZWFtLnByb3RvdHlwZSlcbiAgICBSZWFkU3RyZWFtLnByb3RvdHlwZS5vcGVuID0gUmVhZFN0cmVhbSRvcGVuXG4gIH1cblxuICB2YXIgZnMkV3JpdGVTdHJlYW0gPSBmcy5Xcml0ZVN0cmVhbVxuICBpZiAoZnMkV3JpdGVTdHJlYW0pIHtcbiAgICBXcml0ZVN0cmVhbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGZzJFdyaXRlU3RyZWFtLnByb3RvdHlwZSlcbiAgICBXcml0ZVN0cmVhbS5wcm90b3R5cGUub3BlbiA9IFdyaXRlU3RyZWFtJG9wZW5cbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmcywgJ1JlYWRTdHJlYW0nLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gUmVhZFN0cmVhbVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICBSZWFkU3RyZWFtID0gdmFsXG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnMsICdXcml0ZVN0cmVhbScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBXcml0ZVN0cmVhbVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICBXcml0ZVN0cmVhbSA9IHZhbFxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcblxuICAvLyBsZWdhY3kgbmFtZXNcbiAgdmFyIEZpbGVSZWFkU3RyZWFtID0gUmVhZFN0cmVhbVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnMsICdGaWxlUmVhZFN0cmVhbScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBGaWxlUmVhZFN0cmVhbVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICBGaWxlUmVhZFN0cmVhbSA9IHZhbFxuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbiAgdmFyIEZpbGVXcml0ZVN0cmVhbSA9IFdyaXRlU3RyZWFtXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmcywgJ0ZpbGVXcml0ZVN0cmVhbScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBGaWxlV3JpdGVTdHJlYW1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgRmlsZVdyaXRlU3RyZWFtID0gdmFsXG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxuXG4gIGZ1bmN0aW9uIFJlYWRTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFJlYWRTdHJlYW0pXG4gICAgICByZXR1cm4gZnMkUmVhZFN0cmVhbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0aGlzXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFJlYWRTdHJlYW0uYXBwbHkoT2JqZWN0LmNyZWF0ZShSZWFkU3RyZWFtLnByb3RvdHlwZSksIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlYWRTdHJlYW0kb3BlbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgb3Blbih0aGF0LnBhdGgsIHRoYXQuZmxhZ3MsIHRoYXQubW9kZSwgZnVuY3Rpb24gKGVyciwgZmQpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKHRoYXQuYXV0b0Nsb3NlKVxuICAgICAgICAgIHRoYXQuZGVzdHJveSgpXG5cbiAgICAgICAgdGhhdC5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQuZmQgPSBmZFxuICAgICAgICB0aGF0LmVtaXQoJ29wZW4nLCBmZClcbiAgICAgICAgdGhhdC5yZWFkKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gV3JpdGVTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFdyaXRlU3RyZWFtKVxuICAgICAgcmV0dXJuIGZzJFdyaXRlU3RyZWFtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRoaXNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gV3JpdGVTdHJlYW0uYXBwbHkoT2JqZWN0LmNyZWF0ZShXcml0ZVN0cmVhbS5wcm90b3R5cGUpLCBhcmd1bWVudHMpXG4gIH1cblxuICBmdW5jdGlvbiBXcml0ZVN0cmVhbSRvcGVuICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBvcGVuKHRoYXQucGF0aCwgdGhhdC5mbGFncywgdGhhdC5tb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGF0LmRlc3Ryb3koKVxuICAgICAgICB0aGF0LmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5mZCA9IGZkXG4gICAgICAgIHRoYXQuZW1pdCgnb3BlbicsIGZkKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVSZWFkU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBmcy5SZWFkU3RyZWFtKHBhdGgsIG9wdGlvbnMpXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVXcml0ZVN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgZnMuV3JpdGVTdHJlYW0ocGF0aCwgb3B0aW9ucylcbiAgfVxuXG4gIHZhciBmcyRvcGVuID0gZnMub3BlblxuICBmcy5vcGVuID0gb3BlblxuICBmdW5jdGlvbiBvcGVuIChwYXRoLCBmbGFncywgbW9kZSwgY2IpIHtcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdmdW5jdGlvbicpXG4gICAgICBjYiA9IG1vZGUsIG1vZGUgPSBudWxsXG5cbiAgICByZXR1cm4gZ28kb3BlbihwYXRoLCBmbGFncywgbW9kZSwgY2IpXG5cbiAgICBmdW5jdGlvbiBnbyRvcGVuIChwYXRoLCBmbGFncywgbW9kZSwgY2IsIHN0YXJ0VGltZSkge1xuICAgICAgcmV0dXJuIGZzJG9wZW4ocGF0aCwgZmxhZ3MsIG1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJG9wZW4sIFtwYXRoLCBmbGFncywgbW9kZSwgY2JdLCBlcnIsIHN0YXJ0VGltZSB8fCBEYXRlLm5vdygpLCBEYXRlLm5vdygpXSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnNcbn1cblxuZnVuY3Rpb24gZW5xdWV1ZSAoZWxlbSkge1xuICBkZWJ1ZygnRU5RVUVVRScsIGVsZW1bMF0ubmFtZSwgZWxlbVsxXSlcbiAgZnNbZ3JhY2VmdWxRdWV1ZV0ucHVzaChlbGVtKVxuICByZXRyeSgpXG59XG5cbi8vIGtlZXAgdHJhY2sgb2YgdGhlIHRpbWVvdXQgYmV0d2VlbiByZXRyeSgpIGNhbGxzXG52YXIgcmV0cnlUaW1lclxuXG4vLyByZXNldCB0aGUgc3RhcnRUaW1lIGFuZCBsYXN0VGltZSB0byBub3dcbi8vIHRoaXMgcmVzZXRzIHRoZSBzdGFydCBvZiB0aGUgNjAgc2Vjb25kIG92ZXJhbGwgdGltZW91dCBhcyB3ZWxsIGFzIHRoZVxuLy8gZGVsYXkgYmV0d2VlbiBhdHRlbXB0cyBzbyB0aGF0IHdlJ2xsIHJldHJ5IHRoZXNlIGpvYnMgc29vbmVyXG5mdW5jdGlvbiByZXNldFF1ZXVlICgpIHtcbiAgdmFyIG5vdyA9IERhdGUubm93KClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmc1tncmFjZWZ1bFF1ZXVlXS5sZW5ndGg7ICsraSkge1xuICAgIC8vIGVudHJpZXMgdGhhdCBhcmUgb25seSBhIGxlbmd0aCBvZiAyIGFyZSBmcm9tIGFuIG9sZGVyIHZlcnNpb24sIGRvbid0XG4gICAgLy8gYm90aGVyIG1vZGlmeWluZyB0aG9zZSBzaW5jZSB0aGV5J2xsIGJlIHJldHJpZWQgYW55d2F5LlxuICAgIGlmIChmc1tncmFjZWZ1bFF1ZXVlXVtpXS5sZW5ndGggPiAyKSB7XG4gICAgICBmc1tncmFjZWZ1bFF1ZXVlXVtpXVszXSA9IG5vdyAvLyBzdGFydFRpbWVcbiAgICAgIGZzW2dyYWNlZnVsUXVldWVdW2ldWzRdID0gbm93IC8vIGxhc3RUaW1lXG4gICAgfVxuICB9XG4gIC8vIGNhbGwgcmV0cnkgdG8gbWFrZSBzdXJlIHdlJ3JlIGFjdGl2ZWx5IHByb2Nlc3NpbmcgdGhlIHF1ZXVlXG4gIHJldHJ5KClcbn1cblxuZnVuY3Rpb24gcmV0cnkgKCkge1xuICAvLyBjbGVhciB0aGUgdGltZXIgYW5kIHJlbW92ZSBpdCB0byBoZWxwIHByZXZlbnQgdW5pbnRlbmRlZCBjb25jdXJyZW5jeVxuICBjbGVhclRpbWVvdXQocmV0cnlUaW1lcilcbiAgcmV0cnlUaW1lciA9IHVuZGVmaW5lZFxuXG4gIGlmIChmc1tncmFjZWZ1bFF1ZXVlXS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgdmFyIGVsZW0gPSBmc1tncmFjZWZ1bFF1ZXVlXS5zaGlmdCgpXG4gIHZhciBmbiA9IGVsZW1bMF1cbiAgdmFyIGFyZ3MgPSBlbGVtWzFdXG4gIC8vIHRoZXNlIGl0ZW1zIG1heSBiZSB1bnNldCBpZiB0aGV5IHdlcmUgYWRkZWQgYnkgYW4gb2xkZXIgZ3JhY2VmdWwtZnNcbiAgdmFyIGVyciA9IGVsZW1bMl1cbiAgdmFyIHN0YXJ0VGltZSA9IGVsZW1bM11cbiAgdmFyIGxhc3RUaW1lID0gZWxlbVs0XVxuXG4gIC8vIGlmIHdlIGRvbid0IGhhdmUgYSBzdGFydFRpbWUgd2UgaGF2ZSBubyB3YXkgb2Yga25vd2luZyBpZiB3ZSd2ZSB3YWl0ZWRcbiAgLy8gbG9uZyBlbm91Z2gsIHNvIGdvIGFoZWFkIGFuZCByZXRyeSB0aGlzIGl0ZW0gbm93XG4gIGlmIChzdGFydFRpbWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGRlYnVnKCdSRVRSWScsIGZuLm5hbWUsIGFyZ3MpXG4gICAgZm4uYXBwbHkobnVsbCwgYXJncylcbiAgfSBlbHNlIGlmIChEYXRlLm5vdygpIC0gc3RhcnRUaW1lID49IDYwMDAwKSB7XG4gICAgLy8gaXQncyBiZWVuIG1vcmUgdGhhbiA2MCBzZWNvbmRzIHRvdGFsLCBiYWlsIG5vd1xuICAgIGRlYnVnKCdUSU1FT1VUJywgZm4ubmFtZSwgYXJncylcbiAgICB2YXIgY2IgPSBhcmdzLnBvcCgpXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiLmNhbGwobnVsbCwgZXJyKVxuICB9IGVsc2Uge1xuICAgIC8vIHRoZSBhbW91bnQgb2YgdGltZSBiZXR3ZWVuIHRoZSBsYXN0IGF0dGVtcHQgYW5kIHJpZ2h0IG5vd1xuICAgIHZhciBzaW5jZUF0dGVtcHQgPSBEYXRlLm5vdygpIC0gbGFzdFRpbWVcbiAgICAvLyB0aGUgYW1vdW50IG9mIHRpbWUgYmV0d2VlbiB3aGVuIHdlIGZpcnN0IHRyaWVkLCBhbmQgd2hlbiB3ZSBsYXN0IHRyaWVkXG4gICAgLy8gcm91bmRlZCB1cCB0byBhdCBsZWFzdCAxXG4gICAgdmFyIHNpbmNlU3RhcnQgPSBNYXRoLm1heChsYXN0VGltZSAtIHN0YXJ0VGltZSwgMSlcbiAgICAvLyBiYWNrb2ZmLiB3YWl0IGxvbmdlciB0aGFuIHRoZSB0b3RhbCB0aW1lIHdlJ3ZlIGJlZW4gcmV0cnlpbmcsIGJ1dCBvbmx5XG4gICAgLy8gdXAgdG8gYSBtYXhpbXVtIG9mIDEwMG1zXG4gICAgdmFyIGRlc2lyZWREZWxheSA9IE1hdGgubWluKHNpbmNlU3RhcnQgKiAxLjIsIDEwMClcbiAgICAvLyBpdCdzIGJlZW4gbG9uZyBlbm91Z2ggc2luY2UgdGhlIGxhc3QgcmV0cnksIGRvIGl0IGFnYWluXG4gICAgaWYgKHNpbmNlQXR0ZW1wdCA+PSBkZXNpcmVkRGVsYXkpIHtcbiAgICAgIGRlYnVnKCdSRVRSWScsIGZuLm5hbWUsIGFyZ3MpXG4gICAgICBmbi5hcHBseShudWxsLCBhcmdzLmNvbmNhdChbc3RhcnRUaW1lXSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIHdlIGNhbid0IGRvIHRoaXMgam9iIHlldCwgcHVzaCBpdCB0byB0aGUgZW5kIG9mIHRoZSBxdWV1ZVxuICAgICAgLy8gYW5kIGxldCB0aGUgbmV4dCBpdGVyYXRpb24gY2hlY2sgYWdhaW5cbiAgICAgIGZzW2dyYWNlZnVsUXVldWVdLnB1c2goZWxlbSlcbiAgICB9XG4gIH1cblxuICAvLyBzY2hlZHVsZSBvdXIgbmV4dCBydW4gaWYgb25lIGlzbid0IGFscmVhZHkgc2NoZWR1bGVkXG4gIGlmIChyZXRyeVRpbWVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXRyeVRpbWVyID0gc2V0VGltZW91dChyZXRyeSwgMClcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG4vLyBUaGlzIGlzIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9ybWFsaXplL216XG4vLyBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNiBKb25hdGhhbiBPbmcgbWVAam9uZ2xlYmVycnkuY29tIGFuZCBDb250cmlidXRvcnNcbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuXG5jb25zdCBhcGkgPSBbXG4gICdhY2Nlc3MnLFxuICAnYXBwZW5kRmlsZScsXG4gICdjaG1vZCcsXG4gICdjaG93bicsXG4gICdjbG9zZScsXG4gICdjb3B5RmlsZScsXG4gICdmY2htb2QnLFxuICAnZmNob3duJyxcbiAgJ2ZkYXRhc3luYycsXG4gICdmc3RhdCcsXG4gICdmc3luYycsXG4gICdmdHJ1bmNhdGUnLFxuICAnZnV0aW1lcycsXG4gICdsY2hvd24nLFxuICAnbGNobW9kJyxcbiAgJ2xpbmsnLFxuICAnbHN0YXQnLFxuICAnbWtkaXInLFxuICAnbWtkdGVtcCcsXG4gICdvcGVuJyxcbiAgJ3JlYWRGaWxlJyxcbiAgJ3JlYWRkaXInLFxuICAncmVhZGxpbmsnLFxuICAncmVhbHBhdGgnLFxuICAncmVuYW1lJyxcbiAgJ3JtZGlyJyxcbiAgJ3N0YXQnLFxuICAnc3ltbGluaycsXG4gICd0cnVuY2F0ZScsXG4gICd1bmxpbmsnLFxuICAndXRpbWVzJyxcbiAgJ3dyaXRlRmlsZSdcbl0uZmlsdGVyKGtleSA9PiB7XG4gIC8vIFNvbWUgY29tbWFuZHMgYXJlIG5vdCBhdmFpbGFibGUgb24gc29tZSBzeXN0ZW1zLiBFeDpcbiAgLy8gZnMuY29weUZpbGUgd2FzIGFkZGVkIGluIE5vZGUuanMgdjguNS4wXG4gIC8vIGZzLm1rZHRlbXAgd2FzIGFkZGVkIGluIE5vZGUuanMgdjUuMTAuMFxuICAvLyBmcy5sY2hvd24gaXMgbm90IGF2YWlsYWJsZSBvbiBhdCBsZWFzdCBzb21lIExpbnV4XG4gIHJldHVybiB0eXBlb2YgZnNba2V5XSA9PT0gJ2Z1bmN0aW9uJ1xufSlcblxuLy8gRXhwb3J0IGFsbCBrZXlzOlxuT2JqZWN0LmtleXMoZnMpLmZvckVhY2goa2V5ID0+IHtcbiAgaWYgKGtleSA9PT0gJ3Byb21pc2VzJykge1xuICAgIC8vIGZzLnByb21pc2VzIGlzIGEgZ2V0dGVyIHByb3BlcnR5IHRoYXQgdHJpZ2dlcnMgRXhwZXJpbWVudGFsV2FybmluZ1xuICAgIC8vIERvbid0IHJlLWV4cG9ydCBpdCBoZXJlLCB0aGUgZ2V0dGVyIGlzIGRlZmluZWQgaW4gXCJsaWIvaW5kZXguanNcIlxuICAgIHJldHVyblxuICB9XG4gIGV4cG9ydHNba2V5XSA9IGZzW2tleV1cbn0pXG5cbi8vIFVuaXZlcnNhbGlmeSBhc3luYyBtZXRob2RzOlxuYXBpLmZvckVhY2gobWV0aG9kID0+IHtcbiAgZXhwb3J0c1ttZXRob2RdID0gdShmc1ttZXRob2RdKVxufSlcblxuLy8gV2UgZGlmZmVyIGZyb20gbXovZnMgaW4gdGhhdCB3ZSBzdGlsbCBzaGlwIHRoZSBvbGQsIGJyb2tlbiwgZnMuZXhpc3RzKClcbi8vIHNpbmNlIHdlIGFyZSBhIGRyb3AtaW4gcmVwbGFjZW1lbnQgZm9yIHRoZSBuYXRpdmUgbW9kdWxlXG5leHBvcnRzLmV4aXN0cyA9IGZ1bmN0aW9uIChmaWxlbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmcy5leGlzdHMoZmlsZW5hbWUsIGNhbGxiYWNrKVxuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICByZXR1cm4gZnMuZXhpc3RzKGZpbGVuYW1lLCByZXNvbHZlKVxuICB9KVxufVxuXG4vLyBmcy5yZWFkKCkgJiBmcy53cml0ZSBuZWVkIHNwZWNpYWwgdHJlYXRtZW50IGR1ZSB0byBtdWx0aXBsZSBjYWxsYmFjayBhcmdzXG5cbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZnMucmVhZChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZnMucmVhZChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIChlcnIsIGJ5dGVzUmVhZCwgYnVmZmVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIHJlc29sdmUoeyBieXRlc1JlYWQsIGJ1ZmZlciB9KVxuICAgIH0pXG4gIH0pXG59XG5cbi8vIEZ1bmN0aW9uIHNpZ25hdHVyZSBjYW4gYmVcbi8vIGZzLndyaXRlKGZkLCBidWZmZXJbLCBvZmZzZXRbLCBsZW5ndGhbLCBwb3NpdGlvbl1dXSwgY2FsbGJhY2spXG4vLyBPUlxuLy8gZnMud3JpdGUoZmQsIHN0cmluZ1ssIHBvc2l0aW9uWywgZW5jb2RpbmddXSwgY2FsbGJhY2spXG4vLyBXZSBuZWVkIHRvIGhhbmRsZSBib3RoIGNhc2VzLCBzbyB3ZSB1c2UgLi4uYXJnc1xuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChmZCwgYnVmZmVyLCAuLi5hcmdzKSB7XG4gIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZzLndyaXRlKGZkLCBidWZmZXIsIC4uLmFyZ3MpXG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZzLndyaXRlKGZkLCBidWZmZXIsIC4uLmFyZ3MsIChlcnIsIGJ5dGVzV3JpdHRlbiwgYnVmZmVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIHJlc29sdmUoeyBieXRlc1dyaXR0ZW4sIGJ1ZmZlciB9KVxuICAgIH0pXG4gIH0pXG59XG5cbi8vIGZzLnJlYWxwYXRoLm5hdGl2ZSBvbmx5IGF2YWlsYWJsZSBpbiBOb2RlIHY5LjIrXG5pZiAodHlwZW9mIGZzLnJlYWxwYXRoLm5hdGl2ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBleHBvcnRzLnJlYWxwYXRoLm5hdGl2ZSA9IHUoZnMucmVhbHBhdGgubmF0aXZlKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuLy8gZ2V0IGRyaXZlIG9uIHdpbmRvd3NcbmZ1bmN0aW9uIGdldFJvb3RQYXRoIChwKSB7XG4gIHAgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLnJlc29sdmUocCkpLnNwbGl0KHBhdGguc2VwKVxuICBpZiAocC5sZW5ndGggPiAwKSByZXR1cm4gcFswXVxuICByZXR1cm4gbnVsbFxufVxuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82Mjg4OC8xMDMzMyBjb250YWlucyBtb3JlIGFjY3VyYXRlXG4vLyBUT0RPOiBleHBhbmQgdG8gaW5jbHVkZSB0aGUgcmVzdFxuY29uc3QgSU5WQUxJRF9QQVRIX0NIQVJTID0gL1s8PjpcInw/Kl0vXG5cbmZ1bmN0aW9uIGludmFsaWRXaW4zMlBhdGggKHApIHtcbiAgY29uc3QgcnAgPSBnZXRSb290UGF0aChwKVxuICBwID0gcC5yZXBsYWNlKHJwLCAnJylcbiAgcmV0dXJuIElOVkFMSURfUEFUSF9DSEFSUy50ZXN0KHApXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRSb290UGF0aCxcbiAgaW52YWxpZFdpbjMyUGF0aFxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgaW52YWxpZFdpbjMyUGF0aCA9IHJlcXVpcmUoJy4vd2luMzInKS5pbnZhbGlkV2luMzJQYXRoXG5cbmNvbnN0IG83NzcgPSBwYXJzZUludCgnMDc3NycsIDgpXG5cbmZ1bmN0aW9uIG1rZGlycyAocCwgb3B0cywgY2FsbGJhY2ssIG1hZGUpIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRzXG4gICAgb3B0cyA9IHt9XG4gIH0gZWxzZSBpZiAoIW9wdHMgfHwgdHlwZW9mIG9wdHMgIT09ICdvYmplY3QnKSB7XG4gICAgb3B0cyA9IHsgbW9kZTogb3B0cyB9XG4gIH1cblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyAmJiBpbnZhbGlkV2luMzJQYXRoKHApKSB7XG4gICAgY29uc3QgZXJySW52YWwgPSBuZXcgRXJyb3IocCArICcgY29udGFpbnMgaW52YWxpZCBXSU4zMiBwYXRoIGNoYXJhY3RlcnMuJylcbiAgICBlcnJJbnZhbC5jb2RlID0gJ0VJTlZBTCdcbiAgICByZXR1cm4gY2FsbGJhY2soZXJySW52YWwpXG4gIH1cblxuICBsZXQgbW9kZSA9IG9wdHMubW9kZVxuICBjb25zdCB4ZnMgPSBvcHRzLmZzIHx8IGZzXG5cbiAgaWYgKG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgIG1vZGUgPSBvNzc3ICYgKH5wcm9jZXNzLnVtYXNrKCkpXG4gIH1cbiAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbFxuXG4gIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge31cbiAgcCA9IHBhdGgucmVzb2x2ZShwKVxuXG4gIHhmcy5ta2RpcihwLCBtb2RlLCBlciA9PiB7XG4gICAgaWYgKCFlcikge1xuICAgICAgbWFkZSA9IG1hZGUgfHwgcFxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIG1hZGUpXG4gICAgfVxuICAgIHN3aXRjaCAoZXIuY29kZSkge1xuICAgICAgY2FzZSAnRU5PRU5UJzpcbiAgICAgICAgaWYgKHBhdGguZGlybmFtZShwKSA9PT0gcCkgcmV0dXJuIGNhbGxiYWNrKGVyKVxuICAgICAgICBta2RpcnMocGF0aC5kaXJuYW1lKHApLCBvcHRzLCAoZXIsIG1hZGUpID0+IHtcbiAgICAgICAgICBpZiAoZXIpIGNhbGxiYWNrKGVyLCBtYWRlKVxuICAgICAgICAgIGVsc2UgbWtkaXJzKHAsIG9wdHMsIGNhbGxiYWNrLCBtYWRlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXJcbiAgICAgIC8vIHRoZXJlIGFscmVhZHkuICBJZiBzbywgdGhlbiBob29yYXkhICBJZiBub3QsIHRoZW4gc29tZXRoaW5nXG4gICAgICAvLyBpcyBib3JrZWQuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB4ZnMuc3RhdChwLCAoZXIyLCBzdGF0KSA9PiB7XG4gICAgICAgICAgLy8gaWYgdGhlIHN0YXQgZmFpbHMsIHRoZW4gdGhhdCdzIHN1cGVyIHdlaXJkLlxuICAgICAgICAgIC8vIGxldCB0aGUgb3JpZ2luYWwgZXJyb3IgYmUgdGhlIGZhaWx1cmUgcmVhc29uLlxuICAgICAgICAgIGlmIChlcjIgfHwgIXN0YXQuaXNEaXJlY3RvcnkoKSkgY2FsbGJhY2soZXIsIG1hZGUpXG4gICAgICAgICAgZWxzZSBjYWxsYmFjayhudWxsLCBtYWRlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBta2RpcnNcbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGludmFsaWRXaW4zMlBhdGggPSByZXF1aXJlKCcuL3dpbjMyJykuaW52YWxpZFdpbjMyUGF0aFxuXG5jb25zdCBvNzc3ID0gcGFyc2VJbnQoJzA3NzcnLCA4KVxuXG5mdW5jdGlvbiBta2RpcnNTeW5jIChwLCBvcHRzLCBtYWRlKSB7XG4gIGlmICghb3B0cyB8fCB0eXBlb2Ygb3B0cyAhPT0gJ29iamVjdCcpIHtcbiAgICBvcHRzID0geyBtb2RlOiBvcHRzIH1cbiAgfVxuXG4gIGxldCBtb2RlID0gb3B0cy5tb2RlXG4gIGNvbnN0IHhmcyA9IG9wdHMuZnMgfHwgZnNcblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyAmJiBpbnZhbGlkV2luMzJQYXRoKHApKSB7XG4gICAgY29uc3QgZXJySW52YWwgPSBuZXcgRXJyb3IocCArICcgY29udGFpbnMgaW52YWxpZCBXSU4zMiBwYXRoIGNoYXJhY3RlcnMuJylcbiAgICBlcnJJbnZhbC5jb2RlID0gJ0VJTlZBTCdcbiAgICB0aHJvdyBlcnJJbnZhbFxuICB9XG5cbiAgaWYgKG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgIG1vZGUgPSBvNzc3ICYgKH5wcm9jZXNzLnVtYXNrKCkpXG4gIH1cbiAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbFxuXG4gIHAgPSBwYXRoLnJlc29sdmUocClcblxuICB0cnkge1xuICAgIHhmcy5ta2RpclN5bmMocCwgbW9kZSlcbiAgICBtYWRlID0gbWFkZSB8fCBwXG4gIH0gY2F0Y2ggKGVycjApIHtcbiAgICBpZiAoZXJyMC5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgaWYgKHBhdGguZGlybmFtZShwKSA9PT0gcCkgdGhyb3cgZXJyMFxuICAgICAgbWFkZSA9IG1rZGlyc1N5bmMocGF0aC5kaXJuYW1lKHApLCBvcHRzLCBtYWRlKVxuICAgICAgbWtkaXJzU3luYyhwLCBvcHRzLCBtYWRlKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXIgdGhlcmVcbiAgICAgIC8vIGFscmVhZHkuIElmIHNvLCB0aGVuIGhvb3JheSEgIElmIG5vdCwgdGhlbiBzb21ldGhpbmcgaXMgYm9ya2VkLlxuICAgICAgbGV0IHN0YXRcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXQgPSB4ZnMuc3RhdFN5bmMocClcbiAgICAgIH0gY2F0Y2ggKGVycjEpIHtcbiAgICAgICAgdGhyb3cgZXJyMFxuICAgICAgfVxuICAgICAgaWYgKCFzdGF0LmlzRGlyZWN0b3J5KCkpIHRocm93IGVycjBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWFkZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1rZGlyc1N5bmNcbiIsIid1c2Ugc3RyaWN0J1xuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgbWtkaXJzID0gdShyZXF1aXJlKCcuL21rZGlycycpKVxuY29uc3QgbWtkaXJzU3luYyA9IHJlcXVpcmUoJy4vbWtkaXJzLXN5bmMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWtkaXJzLFxuICBta2RpcnNTeW5jLFxuICAvLyBhbGlhc1xuICBta2RpcnA6IG1rZGlycyxcbiAgbWtkaXJwU3luYzogbWtkaXJzU3luYyxcbiAgZW5zdXJlRGlyOiBta2RpcnMsXG4gIGVuc3VyZURpclN5bmM6IG1rZGlyc1N5bmNcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG4vLyBIRlMsIGV4dHsyLDN9LCBGQVQgZG8gbm90LCBOb2RlLmpzIHYwLjEwIGRvZXMgbm90XG5mdW5jdGlvbiBoYXNNaWxsaXNSZXNTeW5jICgpIHtcbiAgbGV0IHRtcGZpbGUgPSBwYXRoLmpvaW4oJ21pbGxpcy10ZXN0LXN5bmMnICsgRGF0ZS5ub3coKS50b1N0cmluZygpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnNsaWNlKDIpKVxuICB0bXBmaWxlID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLCB0bXBmaWxlKVxuXG4gIC8vIDU1MCBtaWxsaXMgcGFzdCBVTklYIGVwb2NoXG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSgxNDM1NDEwMjQzODYyKVxuICBmcy53cml0ZUZpbGVTeW5jKHRtcGZpbGUsICdodHRwczovL2dpdGh1Yi5jb20vanByaWNoYXJkc29uL25vZGUtZnMtZXh0cmEvcHVsbC8xNDEnKVxuICBjb25zdCBmZCA9IGZzLm9wZW5TeW5jKHRtcGZpbGUsICdyKycpXG4gIGZzLmZ1dGltZXNTeW5jKGZkLCBkLCBkKVxuICBmcy5jbG9zZVN5bmMoZmQpXG4gIHJldHVybiBmcy5zdGF0U3luYyh0bXBmaWxlKS5tdGltZSA+IDE0MzU0MTAyNDMwMDBcbn1cblxuZnVuY3Rpb24gaGFzTWlsbGlzUmVzIChjYWxsYmFjaykge1xuICBsZXQgdG1wZmlsZSA9IHBhdGguam9pbignbWlsbGlzLXRlc3QnICsgRGF0ZS5ub3coKS50b1N0cmluZygpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygpLnNsaWNlKDIpKVxuICB0bXBmaWxlID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLCB0bXBmaWxlKVxuXG4gIC8vIDU1MCBtaWxsaXMgcGFzdCBVTklYIGVwb2NoXG4gIGNvbnN0IGQgPSBuZXcgRGF0ZSgxNDM1NDEwMjQzODYyKVxuICBmcy53cml0ZUZpbGUodG1wZmlsZSwgJ2h0dHBzOi8vZ2l0aHViLmNvbS9qcHJpY2hhcmRzb24vbm9kZS1mcy1leHRyYS9wdWxsLzE0MScsIGVyciA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICBmcy5vcGVuKHRtcGZpbGUsICdyKycsIChlcnIsIGZkKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgZnMuZnV0aW1lcyhmZCwgZCwgZCwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgZnMuY2xvc2UoZmQsIGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgICBmcy5zdGF0KHRtcGZpbGUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgc3RhdHMubXRpbWUgPiAxNDM1NDEwMjQzMDAwKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHRpbWVSZW1vdmVNaWxsaXMgKHRpbWVzdGFtcCkge1xuICBpZiAodHlwZW9mIHRpbWVzdGFtcCA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aW1lc3RhbXAgLyAxMDAwKSAqIDEwMDBcbiAgfSBlbHNlIGlmICh0aW1lc3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKE1hdGguZmxvb3IodGltZXN0YW1wLmdldFRpbWUoKSAvIDEwMDApICogMTAwMClcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZzLWV4dHJhOiB0aW1lUmVtb3ZlTWlsbGlzKCkgdW5rbm93biBwYXJhbWV0ZXIgdHlwZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRpbWVzTWlsbGlzIChwYXRoLCBhdGltZSwgbXRpbWUsIGNhbGxiYWNrKSB7XG4gIC8vIGlmICghSEFTX01JTExJU19SRVMpIHJldHVybiBmcy51dGltZXMocGF0aCwgYXRpbWUsIG10aW1lLCBjYWxsYmFjaylcbiAgZnMub3BlbihwYXRoLCAncisnLCAoZXJyLCBmZCkgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgZnMuZnV0aW1lcyhmZCwgYXRpbWUsIG10aW1lLCBmdXRpbWVzRXJyID0+IHtcbiAgICAgIGZzLmNsb3NlKGZkLCBjbG9zZUVyciA9PiB7XG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZnV0aW1lc0VyciB8fCBjbG9zZUVycilcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gdXRpbWVzTWlsbGlzU3luYyAocGF0aCwgYXRpbWUsIG10aW1lKSB7XG4gIGNvbnN0IGZkID0gZnMub3BlblN5bmMocGF0aCwgJ3IrJylcbiAgZnMuZnV0aW1lc1N5bmMoZmQsIGF0aW1lLCBtdGltZSlcbiAgcmV0dXJuIGZzLmNsb3NlU3luYyhmZClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhhc01pbGxpc1JlcyxcbiAgaGFzTWlsbGlzUmVzU3luYyxcbiAgdGltZVJlbW92ZU1pbGxpcyxcbiAgdXRpbWVzTWlsbGlzLFxuICB1dGltZXNNaWxsaXNTeW5jXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbmNvbnN0IE5PREVfVkVSU0lPTl9NQUpPUl9XSVRIX0JJR0lOVCA9IDEwXG5jb25zdCBOT0RFX1ZFUlNJT05fTUlOT1JfV0lUSF9CSUdJTlQgPSA1XG5jb25zdCBOT0RFX1ZFUlNJT05fUEFUQ0hfV0lUSF9CSUdJTlQgPSAwXG5jb25zdCBub2RlVmVyc2lvbiA9IHByb2Nlc3MudmVyc2lvbnMubm9kZS5zcGxpdCgnLicpXG5jb25zdCBub2RlVmVyc2lvbk1ham9yID0gTnVtYmVyLnBhcnNlSW50KG5vZGVWZXJzaW9uWzBdLCAxMClcbmNvbnN0IG5vZGVWZXJzaW9uTWlub3IgPSBOdW1iZXIucGFyc2VJbnQobm9kZVZlcnNpb25bMV0sIDEwKVxuY29uc3Qgbm9kZVZlcnNpb25QYXRjaCA9IE51bWJlci5wYXJzZUludChub2RlVmVyc2lvblsyXSwgMTApXG5cbmZ1bmN0aW9uIG5vZGVTdXBwb3J0c0JpZ0ludCAoKSB7XG4gIGlmIChub2RlVmVyc2lvbk1ham9yID4gTk9ERV9WRVJTSU9OX01BSk9SX1dJVEhfQklHSU5UKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIGlmIChub2RlVmVyc2lvbk1ham9yID09PSBOT0RFX1ZFUlNJT05fTUFKT1JfV0lUSF9CSUdJTlQpIHtcbiAgICBpZiAobm9kZVZlcnNpb25NaW5vciA+IE5PREVfVkVSU0lPTl9NSU5PUl9XSVRIX0JJR0lOVCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2UgaWYgKG5vZGVWZXJzaW9uTWlub3IgPT09IE5PREVfVkVSU0lPTl9NSU5PUl9XSVRIX0JJR0lOVCkge1xuICAgICAgaWYgKG5vZGVWZXJzaW9uUGF0Y2ggPj0gTk9ERV9WRVJTSU9OX1BBVENIX1dJVEhfQklHSU5UKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBnZXRTdGF0cyAoc3JjLCBkZXN0LCBjYikge1xuICBpZiAobm9kZVN1cHBvcnRzQmlnSW50KCkpIHtcbiAgICBmcy5zdGF0KHNyYywgeyBiaWdpbnQ6IHRydWUgfSwgKGVyciwgc3JjU3RhdCkgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICAgIGZzLnN0YXQoZGVzdCwgeyBiaWdpbnQ6IHRydWUgfSwgKGVyciwgZGVzdFN0YXQpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHJldHVybiBjYihudWxsLCB7IHNyY1N0YXQsIGRlc3RTdGF0OiBudWxsIH0pXG4gICAgICAgICAgcmV0dXJuIGNiKGVycilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2IobnVsbCwgeyBzcmNTdGF0LCBkZXN0U3RhdCB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGZzLnN0YXQoc3JjLCAoZXJyLCBzcmNTdGF0KSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgZnMuc3RhdChkZXN0LCAoZXJyLCBkZXN0U3RhdCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuIGNiKG51bGwsIHsgc3JjU3RhdCwgZGVzdFN0YXQ6IG51bGwgfSlcbiAgICAgICAgICByZXR1cm4gY2IoZXJyKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYihudWxsLCB7IHNyY1N0YXQsIGRlc3RTdGF0IH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U3RhdHNTeW5jIChzcmMsIGRlc3QpIHtcbiAgbGV0IHNyY1N0YXQsIGRlc3RTdGF0XG4gIGlmIChub2RlU3VwcG9ydHNCaWdJbnQoKSkge1xuICAgIHNyY1N0YXQgPSBmcy5zdGF0U3luYyhzcmMsIHsgYmlnaW50OiB0cnVlIH0pXG4gIH0gZWxzZSB7XG4gICAgc3JjU3RhdCA9IGZzLnN0YXRTeW5jKHNyYylcbiAgfVxuICB0cnkge1xuICAgIGlmIChub2RlU3VwcG9ydHNCaWdJbnQoKSkge1xuICAgICAgZGVzdFN0YXQgPSBmcy5zdGF0U3luYyhkZXN0LCB7IGJpZ2ludDogdHJ1ZSB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0U3RhdCA9IGZzLnN0YXRTeW5jKGRlc3QpXG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSByZXR1cm4geyBzcmNTdGF0LCBkZXN0U3RhdDogbnVsbCB9XG4gICAgdGhyb3cgZXJyXG4gIH1cbiAgcmV0dXJuIHsgc3JjU3RhdCwgZGVzdFN0YXQgfVxufVxuXG5mdW5jdGlvbiBjaGVja1BhdGhzIChzcmMsIGRlc3QsIGZ1bmNOYW1lLCBjYikge1xuICBnZXRTdGF0cyhzcmMsIGRlc3QsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICBjb25zdCB7IHNyY1N0YXQsIGRlc3RTdGF0IH0gPSBzdGF0c1xuICAgIGlmIChkZXN0U3RhdCAmJiBkZXN0U3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ICYmIGRlc3RTdGF0LmlubyA9PT0gc3JjU3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ID09PSBzcmNTdGF0LmRldikge1xuICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignU291cmNlIGFuZCBkZXN0aW5hdGlvbiBtdXN0IG5vdCBiZSB0aGUgc2FtZS4nKSlcbiAgICB9XG4gICAgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkoKSAmJiBpc1NyY1N1YmRpcihzcmMsIGRlc3QpKSB7XG4gICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZyhzcmMsIGRlc3QsIGZ1bmNOYW1lKSkpXG4gICAgfVxuICAgIHJldHVybiBjYihudWxsLCB7IHNyY1N0YXQsIGRlc3RTdGF0IH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNoZWNrUGF0aHNTeW5jIChzcmMsIGRlc3QsIGZ1bmNOYW1lKSB7XG4gIGNvbnN0IHsgc3JjU3RhdCwgZGVzdFN0YXQgfSA9IGdldFN0YXRzU3luYyhzcmMsIGRlc3QpXG4gIGlmIChkZXN0U3RhdCAmJiBkZXN0U3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ICYmIGRlc3RTdGF0LmlubyA9PT0gc3JjU3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ID09PSBzcmNTdGF0LmRldikge1xuICAgIHRocm93IG5ldyBFcnJvcignU291cmNlIGFuZCBkZXN0aW5hdGlvbiBtdXN0IG5vdCBiZSB0aGUgc2FtZS4nKVxuICB9XG4gIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5KCkgJiYgaXNTcmNTdWJkaXIoc3JjLCBkZXN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2coc3JjLCBkZXN0LCBmdW5jTmFtZSkpXG4gIH1cbiAgcmV0dXJuIHsgc3JjU3RhdCwgZGVzdFN0YXQgfVxufVxuXG4vLyByZWN1cnNpdmVseSBjaGVjayBpZiBkZXN0IHBhcmVudCBpcyBhIHN1YmRpcmVjdG9yeSBvZiBzcmMuXG4vLyBJdCB3b3JrcyBmb3IgYWxsIGZpbGUgdHlwZXMgaW5jbHVkaW5nIHN5bWxpbmtzIHNpbmNlIGl0XG4vLyBjaGVja3MgdGhlIHNyYyBhbmQgZGVzdCBpbm9kZXMuIEl0IHN0YXJ0cyBmcm9tIHRoZSBkZWVwZXN0XG4vLyBwYXJlbnQgYW5kIHN0b3BzIG9uY2UgaXQgcmVhY2hlcyB0aGUgc3JjIHBhcmVudCBvciB0aGUgcm9vdCBwYXRoLlxuZnVuY3Rpb24gY2hlY2tQYXJlbnRQYXRocyAoc3JjLCBzcmNTdGF0LCBkZXN0LCBmdW5jTmFtZSwgY2IpIHtcbiAgY29uc3Qgc3JjUGFyZW50ID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShzcmMpKVxuICBjb25zdCBkZXN0UGFyZW50ID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShkZXN0KSlcbiAgaWYgKGRlc3RQYXJlbnQgPT09IHNyY1BhcmVudCB8fCBkZXN0UGFyZW50ID09PSBwYXRoLnBhcnNlKGRlc3RQYXJlbnQpLnJvb3QpIHJldHVybiBjYigpXG4gIGlmIChub2RlU3VwcG9ydHNCaWdJbnQoKSkge1xuICAgIGZzLnN0YXQoZGVzdFBhcmVudCwgeyBiaWdpbnQ6IHRydWUgfSwgKGVyciwgZGVzdFN0YXQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuIGNiKClcbiAgICAgICAgcmV0dXJuIGNiKGVycilcbiAgICAgIH1cbiAgICAgIGlmIChkZXN0U3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ICYmIGRlc3RTdGF0LmlubyA9PT0gc3JjU3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ID09PSBzcmNTdGF0LmRldikge1xuICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZyhzcmMsIGRlc3QsIGZ1bmNOYW1lKSkpXG4gICAgICB9XG4gICAgICByZXR1cm4gY2hlY2tQYXJlbnRQYXRocyhzcmMsIHNyY1N0YXQsIGRlc3RQYXJlbnQsIGZ1bmNOYW1lLCBjYilcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGZzLnN0YXQoZGVzdFBhcmVudCwgKGVyciwgZGVzdFN0YXQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykgcmV0dXJuIGNiKClcbiAgICAgICAgcmV0dXJuIGNiKGVycilcbiAgICAgIH1cbiAgICAgIGlmIChkZXN0U3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ICYmIGRlc3RTdGF0LmlubyA9PT0gc3JjU3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ID09PSBzcmNTdGF0LmRldikge1xuICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGVyck1zZyhzcmMsIGRlc3QsIGZ1bmNOYW1lKSkpXG4gICAgICB9XG4gICAgICByZXR1cm4gY2hlY2tQYXJlbnRQYXRocyhzcmMsIHNyY1N0YXQsIGRlc3RQYXJlbnQsIGZ1bmNOYW1lLCBjYilcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUGFyZW50UGF0aHNTeW5jIChzcmMsIHNyY1N0YXQsIGRlc3QsIGZ1bmNOYW1lKSB7XG4gIGNvbnN0IHNyY1BhcmVudCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoc3JjKSlcbiAgY29uc3QgZGVzdFBhcmVudCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoZGVzdCkpXG4gIGlmIChkZXN0UGFyZW50ID09PSBzcmNQYXJlbnQgfHwgZGVzdFBhcmVudCA9PT0gcGF0aC5wYXJzZShkZXN0UGFyZW50KS5yb290KSByZXR1cm5cbiAgbGV0IGRlc3RTdGF0XG4gIHRyeSB7XG4gICAgaWYgKG5vZGVTdXBwb3J0c0JpZ0ludCgpKSB7XG4gICAgICBkZXN0U3RhdCA9IGZzLnN0YXRTeW5jKGRlc3RQYXJlbnQsIHsgYmlnaW50OiB0cnVlIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3RTdGF0ID0gZnMuc3RhdFN5bmMoZGVzdFBhcmVudClcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHJldHVyblxuICAgIHRocm93IGVyclxuICB9XG4gIGlmIChkZXN0U3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ICYmIGRlc3RTdGF0LmlubyA9PT0gc3JjU3RhdC5pbm8gJiYgZGVzdFN0YXQuZGV2ID09PSBzcmNTdGF0LmRldikge1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2coc3JjLCBkZXN0LCBmdW5jTmFtZSkpXG4gIH1cbiAgcmV0dXJuIGNoZWNrUGFyZW50UGF0aHNTeW5jKHNyYywgc3JjU3RhdCwgZGVzdFBhcmVudCwgZnVuY05hbWUpXG59XG5cbi8vIHJldHVybiB0cnVlIGlmIGRlc3QgaXMgYSBzdWJkaXIgb2Ygc3JjLCBvdGhlcndpc2UgZmFsc2UuXG4vLyBJdCBvbmx5IGNoZWNrcyB0aGUgcGF0aCBzdHJpbmdzLlxuZnVuY3Rpb24gaXNTcmNTdWJkaXIgKHNyYywgZGVzdCkge1xuICBjb25zdCBzcmNBcnIgPSBwYXRoLnJlc29sdmUoc3JjKS5zcGxpdChwYXRoLnNlcCkuZmlsdGVyKGkgPT4gaSlcbiAgY29uc3QgZGVzdEFyciA9IHBhdGgucmVzb2x2ZShkZXN0KS5zcGxpdChwYXRoLnNlcCkuZmlsdGVyKGkgPT4gaSlcbiAgcmV0dXJuIHNyY0Fyci5yZWR1Y2UoKGFjYywgY3VyLCBpKSA9PiBhY2MgJiYgZGVzdEFycltpXSA9PT0gY3VyLCB0cnVlKVxufVxuXG5mdW5jdGlvbiBlcnJNc2cgKHNyYywgZGVzdCwgZnVuY05hbWUpIHtcbiAgcmV0dXJuIGBDYW5ub3QgJHtmdW5jTmFtZX0gJyR7c3JjfScgdG8gYSBzdWJkaXJlY3Rvcnkgb2YgaXRzZWxmLCAnJHtkZXN0fScuYFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tQYXRocyxcbiAgY2hlY2tQYXRoc1N5bmMsXG4gIGNoZWNrUGFyZW50UGF0aHMsXG4gIGNoZWNrUGFyZW50UGF0aHNTeW5jLFxuICBpc1NyY1N1YmRpclxufVxuIiwiJ3VzZSBzdHJpY3QnXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIGlmICh0eXBlb2YgQnVmZmVyLmFsbG9jVW5zYWZlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBCdWZmZXIuYWxsb2NVbnNhZmUoc2l6ZSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbmV3IEJ1ZmZlcihzaXplKVxuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEJ1ZmZlcihzaXplKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgbWtkaXJwU3luYyA9IHJlcXVpcmUoJy4uL21rZGlycycpLm1rZGlyc1N5bmNcbmNvbnN0IHV0aW1lc1N5bmMgPSByZXF1aXJlKCcuLi91dGlsL3V0aW1lcy5qcycpLnV0aW1lc01pbGxpc1N5bmNcbmNvbnN0IHN0YXQgPSByZXF1aXJlKCcuLi91dGlsL3N0YXQnKVxuXG5mdW5jdGlvbiBjb3B5U3luYyAoc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdHMgPSB7IGZpbHRlcjogb3B0cyB9XG4gIH1cblxuICBvcHRzID0gb3B0cyB8fCB7fVxuICBvcHRzLmNsb2JiZXIgPSAnY2xvYmJlcicgaW4gb3B0cyA/ICEhb3B0cy5jbG9iYmVyIDogdHJ1ZSAvLyBkZWZhdWx0IHRvIHRydWUgZm9yIG5vd1xuICBvcHRzLm92ZXJ3cml0ZSA9ICdvdmVyd3JpdGUnIGluIG9wdHMgPyAhIW9wdHMub3ZlcndyaXRlIDogb3B0cy5jbG9iYmVyIC8vIG92ZXJ3cml0ZSBmYWxscyBiYWNrIHRvIGNsb2JiZXJcblxuICAvLyBXYXJuIGFib3V0IHVzaW5nIHByZXNlcnZlVGltZXN0YW1wcyBvbiAzMi1iaXQgbm9kZVxuICBpZiAob3B0cy5wcmVzZXJ2ZVRpbWVzdGFtcHMgJiYgcHJvY2Vzcy5hcmNoID09PSAnaWEzMicpIHtcbiAgICBjb25zb2xlLndhcm4oYGZzLWV4dHJhOiBVc2luZyB0aGUgcHJlc2VydmVUaW1lc3RhbXBzIG9wdGlvbiBpbiAzMi1iaXQgbm9kZSBpcyBub3QgcmVjb21tZW5kZWQ7XFxuXG4gICAgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qcHJpY2hhcmRzb24vbm9kZS1mcy1leHRyYS9pc3N1ZXMvMjY5YClcbiAgfVxuXG4gIGNvbnN0IHsgc3JjU3RhdCwgZGVzdFN0YXQgfSA9IHN0YXQuY2hlY2tQYXRoc1N5bmMoc3JjLCBkZXN0LCAnY29weScpXG4gIHN0YXQuY2hlY2tQYXJlbnRQYXRoc1N5bmMoc3JjLCBzcmNTdGF0LCBkZXN0LCAnY29weScpXG4gIHJldHVybiBoYW5kbGVGaWx0ZXJBbmRDb3B5KGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZpbHRlckFuZENvcHkgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgaWYgKG9wdHMuZmlsdGVyICYmICFvcHRzLmZpbHRlcihzcmMsIGRlc3QpKSByZXR1cm5cbiAgY29uc3QgZGVzdFBhcmVudCA9IHBhdGguZGlybmFtZShkZXN0KVxuICBpZiAoIWZzLmV4aXN0c1N5bmMoZGVzdFBhcmVudCkpIG1rZGlycFN5bmMoZGVzdFBhcmVudClcbiAgcmV0dXJuIHN0YXJ0Q29weShkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxufVxuXG5mdW5jdGlvbiBzdGFydENvcHkgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgaWYgKG9wdHMuZmlsdGVyICYmICFvcHRzLmZpbHRlcihzcmMsIGRlc3QpKSByZXR1cm5cbiAgcmV0dXJuIGdldFN0YXRzKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG59XG5cbmZ1bmN0aW9uIGdldFN0YXRzIChkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGNvbnN0IHN0YXRTeW5jID0gb3B0cy5kZXJlZmVyZW5jZSA/IGZzLnN0YXRTeW5jIDogZnMubHN0YXRTeW5jXG4gIGNvbnN0IHNyY1N0YXQgPSBzdGF0U3luYyhzcmMpXG5cbiAgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkoKSkgcmV0dXJuIG9uRGlyKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG4gIGVsc2UgaWYgKHNyY1N0YXQuaXNGaWxlKCkgfHxcbiAgICAgICAgICAgc3JjU3RhdC5pc0NoYXJhY3RlckRldmljZSgpIHx8XG4gICAgICAgICAgIHNyY1N0YXQuaXNCbG9ja0RldmljZSgpKSByZXR1cm4gb25GaWxlKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpXG4gIGVsc2UgaWYgKHNyY1N0YXQuaXNTeW1ib2xpY0xpbmsoKSkgcmV0dXJuIG9uTGluayhkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxufVxuXG5mdW5jdGlvbiBvbkZpbGUgKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgaWYgKCFkZXN0U3RhdCkgcmV0dXJuIGNvcHlGaWxlKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cylcbiAgcmV0dXJuIG1heUNvcHlGaWxlKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cylcbn1cblxuZnVuY3Rpb24gbWF5Q29weUZpbGUgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cykge1xuICBpZiAob3B0cy5vdmVyd3JpdGUpIHtcbiAgICBmcy51bmxpbmtTeW5jKGRlc3QpXG4gICAgcmV0dXJuIGNvcHlGaWxlKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cylcbiAgfSBlbHNlIGlmIChvcHRzLmVycm9yT25FeGlzdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJyR7ZGVzdH0nIGFscmVhZHkgZXhpc3RzYClcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5RmlsZSAoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGlmICh0eXBlb2YgZnMuY29weUZpbGVTeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZnMuY29weUZpbGVTeW5jKHNyYywgZGVzdClcbiAgICBmcy5jaG1vZFN5bmMoZGVzdCwgc3JjU3RhdC5tb2RlKVxuICAgIGlmIChvcHRzLnByZXNlcnZlVGltZXN0YW1wcykge1xuICAgICAgcmV0dXJuIHV0aW1lc1N5bmMoZGVzdCwgc3JjU3RhdC5hdGltZSwgc3JjU3RhdC5tdGltZSlcbiAgICB9XG4gICAgcmV0dXJuXG4gIH1cbiAgcmV0dXJuIGNvcHlGaWxlRmFsbGJhY2soc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxufVxuXG5mdW5jdGlvbiBjb3B5RmlsZUZhbGxiYWNrIChzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgY29uc3QgQlVGX0xFTkdUSCA9IDY0ICogMTAyNFxuICBjb25zdCBfYnVmZiA9IHJlcXVpcmUoJy4uL3V0aWwvYnVmZmVyJykoQlVGX0xFTkdUSClcblxuICBjb25zdCBmZHIgPSBmcy5vcGVuU3luYyhzcmMsICdyJylcbiAgY29uc3QgZmR3ID0gZnMub3BlblN5bmMoZGVzdCwgJ3cnLCBzcmNTdGF0Lm1vZGUpXG4gIGxldCBwb3MgPSAwXG5cbiAgd2hpbGUgKHBvcyA8IHNyY1N0YXQuc2l6ZSkge1xuICAgIGNvbnN0IGJ5dGVzUmVhZCA9IGZzLnJlYWRTeW5jKGZkciwgX2J1ZmYsIDAsIEJVRl9MRU5HVEgsIHBvcylcbiAgICBmcy53cml0ZVN5bmMoZmR3LCBfYnVmZiwgMCwgYnl0ZXNSZWFkKVxuICAgIHBvcyArPSBieXRlc1JlYWRcbiAgfVxuXG4gIGlmIChvcHRzLnByZXNlcnZlVGltZXN0YW1wcykgZnMuZnV0aW1lc1N5bmMoZmR3LCBzcmNTdGF0LmF0aW1lLCBzcmNTdGF0Lm10aW1lKVxuXG4gIGZzLmNsb3NlU3luYyhmZHIpXG4gIGZzLmNsb3NlU3luYyhmZHcpXG59XG5cbmZ1bmN0aW9uIG9uRGlyIChzcmNTdGF0LCBkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBta0RpckFuZENvcHkoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKVxuICBpZiAoZGVzdFN0YXQgJiYgIWRlc3RTdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgbm9uLWRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBkaXJlY3RvcnkgJyR7c3JjfScuYClcbiAgfVxuICByZXR1cm4gY29weURpcihzcmMsIGRlc3QsIG9wdHMpXG59XG5cbmZ1bmN0aW9uIG1rRGlyQW5kQ29weSAoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGZzLm1rZGlyU3luYyhkZXN0KVxuICBjb3B5RGlyKHNyYywgZGVzdCwgb3B0cylcbiAgcmV0dXJuIGZzLmNobW9kU3luYyhkZXN0LCBzcmNTdGF0Lm1vZGUpXG59XG5cbmZ1bmN0aW9uIGNvcHlEaXIgKHNyYywgZGVzdCwgb3B0cykge1xuICBmcy5yZWFkZGlyU3luYyhzcmMpLmZvckVhY2goaXRlbSA9PiBjb3B5RGlySXRlbShpdGVtLCBzcmMsIGRlc3QsIG9wdHMpKVxufVxuXG5mdW5jdGlvbiBjb3B5RGlySXRlbSAoaXRlbSwgc3JjLCBkZXN0LCBvcHRzKSB7XG4gIGNvbnN0IHNyY0l0ZW0gPSBwYXRoLmpvaW4oc3JjLCBpdGVtKVxuICBjb25zdCBkZXN0SXRlbSA9IHBhdGguam9pbihkZXN0LCBpdGVtKVxuICBjb25zdCB7IGRlc3RTdGF0IH0gPSBzdGF0LmNoZWNrUGF0aHNTeW5jKHNyY0l0ZW0sIGRlc3RJdGVtLCAnY29weScpXG4gIHJldHVybiBzdGFydENvcHkoZGVzdFN0YXQsIHNyY0l0ZW0sIGRlc3RJdGVtLCBvcHRzKVxufVxuXG5mdW5jdGlvbiBvbkxpbmsgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMpIHtcbiAgbGV0IHJlc29sdmVkU3JjID0gZnMucmVhZGxpbmtTeW5jKHNyYylcbiAgaWYgKG9wdHMuZGVyZWZlcmVuY2UpIHtcbiAgICByZXNvbHZlZFNyYyA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCByZXNvbHZlZFNyYylcbiAgfVxuXG4gIGlmICghZGVzdFN0YXQpIHtcbiAgICByZXR1cm4gZnMuc3ltbGlua1N5bmMocmVzb2x2ZWRTcmMsIGRlc3QpXG4gIH0gZWxzZSB7XG4gICAgbGV0IHJlc29sdmVkRGVzdFxuICAgIHRyeSB7XG4gICAgICByZXNvbHZlZERlc3QgPSBmcy5yZWFkbGlua1N5bmMoZGVzdClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIGRlc3QgZXhpc3RzIGFuZCBpcyBhIHJlZ3VsYXIgZmlsZSBvciBkaXJlY3RvcnksXG4gICAgICAvLyBXaW5kb3dzIG1heSB0aHJvdyBVTktOT1dOIGVycm9yLiBJZiBkZXN0IGFscmVhZHkgZXhpc3RzLFxuICAgICAgLy8gZnMgdGhyb3dzIGVycm9yIGFueXdheSwgc28gbm8gbmVlZCB0byBndWFyZCBhZ2FpbnN0IGl0IGhlcmUuXG4gICAgICBpZiAoZXJyLmNvZGUgPT09ICdFSU5WQUwnIHx8IGVyci5jb2RlID09PSAnVU5LTk9XTicpIHJldHVybiBmcy5zeW1saW5rU3luYyhyZXNvbHZlZFNyYywgZGVzdClcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgICBpZiAob3B0cy5kZXJlZmVyZW5jZSkge1xuICAgICAgcmVzb2x2ZWREZXN0ID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHJlc29sdmVkRGVzdClcbiAgICB9XG4gICAgaWYgKHN0YXQuaXNTcmNTdWJkaXIocmVzb2x2ZWRTcmMsIHJlc29sdmVkRGVzdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNvcHkgJyR7cmVzb2x2ZWRTcmN9JyB0byBhIHN1YmRpcmVjdG9yeSBvZiBpdHNlbGYsICcke3Jlc29sdmVkRGVzdH0nLmApXG4gICAgfVxuXG4gICAgLy8gcHJldmVudCBjb3B5IGlmIHNyYyBpcyBhIHN1YmRpciBvZiBkZXN0IHNpbmNlIHVubGlua2luZ1xuICAgIC8vIGRlc3QgaW4gdGhpcyBjYXNlIHdvdWxkIHJlc3VsdCBpbiByZW1vdmluZyBzcmMgY29udGVudHNcbiAgICAvLyBhbmQgdGhlcmVmb3JlIGEgYnJva2VuIHN5bWxpbmsgd291bGQgYmUgY3JlYXRlZC5cbiAgICBpZiAoZnMuc3RhdFN5bmMoZGVzdCkuaXNEaXJlY3RvcnkoKSAmJiBzdGF0LmlzU3JjU3ViZGlyKHJlc29sdmVkRGVzdCwgcmVzb2x2ZWRTcmMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgJyR7cmVzb2x2ZWREZXN0fScgd2l0aCAnJHtyZXNvbHZlZFNyY30nLmApXG4gICAgfVxuICAgIHJldHVybiBjb3B5TGluayhyZXNvbHZlZFNyYywgZGVzdClcbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5TGluayAocmVzb2x2ZWRTcmMsIGRlc3QpIHtcbiAgZnMudW5saW5rU3luYyhkZXN0KVxuICByZXR1cm4gZnMuc3ltbGlua1N5bmMocmVzb2x2ZWRTcmMsIGRlc3QpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bmNcbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29weVN5bmM6IHJlcXVpcmUoJy4vY29weS1zeW5jJylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21Qcm9taXNlXG5jb25zdCBmcyA9IHJlcXVpcmUoJy4uL2ZzJylcblxuZnVuY3Rpb24gcGF0aEV4aXN0cyAocGF0aCkge1xuICByZXR1cm4gZnMuYWNjZXNzKHBhdGgpLnRoZW4oKCkgPT4gdHJ1ZSkuY2F0Y2goKCkgPT4gZmFsc2UpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXRoRXhpc3RzOiB1KHBhdGhFeGlzdHMpLFxuICBwYXRoRXhpc3RzU3luYzogZnMuZXhpc3RzU3luY1xufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgbWtkaXJwID0gcmVxdWlyZSgnLi4vbWtkaXJzJykubWtkaXJzXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5jb25zdCB1dGltZXMgPSByZXF1aXJlKCcuLi91dGlsL3V0aW1lcycpLnV0aW1lc01pbGxpc1xuY29uc3Qgc3RhdCA9IHJlcXVpcmUoJy4uL3V0aWwvc3RhdCcpXG5cbmZ1bmN0aW9uIGNvcHkgKHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nICYmICFjYikge1xuICAgIGNiID0gb3B0c1xuICAgIG9wdHMgPSB7fVxuICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0cyA9IHsgZmlsdGVyOiBvcHRzIH1cbiAgfVxuXG4gIGNiID0gY2IgfHwgZnVuY3Rpb24gKCkge31cbiAgb3B0cyA9IG9wdHMgfHwge31cblxuICBvcHRzLmNsb2JiZXIgPSAnY2xvYmJlcicgaW4gb3B0cyA/ICEhb3B0cy5jbG9iYmVyIDogdHJ1ZSAvLyBkZWZhdWx0IHRvIHRydWUgZm9yIG5vd1xuICBvcHRzLm92ZXJ3cml0ZSA9ICdvdmVyd3JpdGUnIGluIG9wdHMgPyAhIW9wdHMub3ZlcndyaXRlIDogb3B0cy5jbG9iYmVyIC8vIG92ZXJ3cml0ZSBmYWxscyBiYWNrIHRvIGNsb2JiZXJcblxuICAvLyBXYXJuIGFib3V0IHVzaW5nIHByZXNlcnZlVGltZXN0YW1wcyBvbiAzMi1iaXQgbm9kZVxuICBpZiAob3B0cy5wcmVzZXJ2ZVRpbWVzdGFtcHMgJiYgcHJvY2Vzcy5hcmNoID09PSAnaWEzMicpIHtcbiAgICBjb25zb2xlLndhcm4oYGZzLWV4dHJhOiBVc2luZyB0aGUgcHJlc2VydmVUaW1lc3RhbXBzIG9wdGlvbiBpbiAzMi1iaXQgbm9kZSBpcyBub3QgcmVjb21tZW5kZWQ7XFxuXG4gICAgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qcHJpY2hhcmRzb24vbm9kZS1mcy1leHRyYS9pc3N1ZXMvMjY5YClcbiAgfVxuXG4gIHN0YXQuY2hlY2tQYXRocyhzcmMsIGRlc3QsICdjb3B5JywgKGVyciwgc3RhdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGNvbnN0IHsgc3JjU3RhdCwgZGVzdFN0YXQgfSA9IHN0YXRzXG4gICAgc3RhdC5jaGVja1BhcmVudFBhdGhzKHNyYywgc3JjU3RhdCwgZGVzdCwgJ2NvcHknLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICAgIGlmIChvcHRzLmZpbHRlcikgcmV0dXJuIGhhbmRsZUZpbHRlcihjaGVja1BhcmVudERpciwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgICByZXR1cm4gY2hlY2tQYXJlbnREaXIoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gY2hlY2tQYXJlbnREaXIgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IGRlc3RQYXJlbnQgPSBwYXRoLmRpcm5hbWUoZGVzdClcbiAgcGF0aEV4aXN0cyhkZXN0UGFyZW50LCAoZXJyLCBkaXJFeGlzdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGlmIChkaXJFeGlzdHMpIHJldHVybiBzdGFydENvcHkoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgbWtkaXJwKGRlc3RQYXJlbnQsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIHN0YXJ0Q29weShkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGaWx0ZXIgKG9uSW5jbHVkZSwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgUHJvbWlzZS5yZXNvbHZlKG9wdHMuZmlsdGVyKHNyYywgZGVzdCkpLnRoZW4oaW5jbHVkZSA9PiB7XG4gICAgaWYgKGluY2x1ZGUpIHJldHVybiBvbkluY2x1ZGUoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgcmV0dXJuIGNiKClcbiAgfSwgZXJyb3IgPT4gY2IoZXJyb3IpKVxufVxuXG5mdW5jdGlvbiBzdGFydENvcHkgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGlmIChvcHRzLmZpbHRlcikgcmV0dXJuIGhhbmRsZUZpbHRlcihnZXRTdGF0cywgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gIHJldHVybiBnZXRTdGF0cyhkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbn1cblxuZnVuY3Rpb24gZ2V0U3RhdHMgKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IHN0YXQgPSBvcHRzLmRlcmVmZXJlbmNlID8gZnMuc3RhdCA6IGZzLmxzdGF0XG4gIHN0YXQoc3JjLCAoZXJyLCBzcmNTdGF0KSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5KCkpIHJldHVybiBvbkRpcihzcmNTdGF0LCBkZXN0U3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbiAgICBlbHNlIGlmIChzcmNTdGF0LmlzRmlsZSgpIHx8XG4gICAgICAgICAgICAgc3JjU3RhdC5pc0NoYXJhY3RlckRldmljZSgpIHx8XG4gICAgICAgICAgICAgc3JjU3RhdC5pc0Jsb2NrRGV2aWNlKCkpIHJldHVybiBvbkZpbGUoc3JjU3RhdCwgZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgZWxzZSBpZiAoc3JjU3RhdC5pc1N5bWJvbGljTGluaygpKSByZXR1cm4gb25MaW5rKGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICB9KVxufVxuXG5mdW5jdGlvbiBvbkZpbGUgKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBjb3B5RmlsZShzcmNTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICByZXR1cm4gbWF5Q29weUZpbGUoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbn1cblxuZnVuY3Rpb24gbWF5Q29weUZpbGUgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgaWYgKG9wdHMub3ZlcndyaXRlKSB7XG4gICAgZnMudW5saW5rKGRlc3QsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIGNvcHlGaWxlKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG4gICAgfSlcbiAgfSBlbHNlIGlmIChvcHRzLmVycm9yT25FeGlzdCkge1xuICAgIHJldHVybiBjYihuZXcgRXJyb3IoYCcke2Rlc3R9JyBhbHJlYWR5IGV4aXN0c2ApKVxuICB9IGVsc2UgcmV0dXJuIGNiKClcbn1cblxuZnVuY3Rpb24gY29weUZpbGUgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgaWYgKHR5cGVvZiBmcy5jb3B5RmlsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmcy5jb3B5RmlsZShzcmMsIGRlc3QsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIHNldERlc3RNb2RlQW5kVGltZXN0YW1wcyhzcmNTdGF0LCBkZXN0LCBvcHRzLCBjYilcbiAgICB9KVxuICB9XG4gIHJldHVybiBjb3B5RmlsZUZhbGxiYWNrKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpXG59XG5cbmZ1bmN0aW9uIGNvcHlGaWxlRmFsbGJhY2sgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgY29uc3QgcnMgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKHNyYylcbiAgcnMub24oJ2Vycm9yJywgZXJyID0+IGNiKGVycikpLm9uY2UoJ29wZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgd3MgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShkZXN0LCB7IG1vZGU6IHNyY1N0YXQubW9kZSB9KVxuICAgIHdzLm9uKCdlcnJvcicsIGVyciA9PiBjYihlcnIpKVxuICAgICAgLm9uKCdvcGVuJywgKCkgPT4gcnMucGlwZSh3cykpXG4gICAgICAub25jZSgnY2xvc2UnLCAoKSA9PiBzZXREZXN0TW9kZUFuZFRpbWVzdGFtcHMoc3JjU3RhdCwgZGVzdCwgb3B0cywgY2IpKVxuICB9KVxufVxuXG5mdW5jdGlvbiBzZXREZXN0TW9kZUFuZFRpbWVzdGFtcHMgKHNyY1N0YXQsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGZzLmNobW9kKGRlc3QsIHNyY1N0YXQubW9kZSwgZXJyID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGlmIChvcHRzLnByZXNlcnZlVGltZXN0YW1wcykge1xuICAgICAgcmV0dXJuIHV0aW1lcyhkZXN0LCBzcmNTdGF0LmF0aW1lLCBzcmNTdGF0Lm10aW1lLCBjYilcbiAgICB9XG4gICAgcmV0dXJuIGNiKClcbiAgfSlcbn1cblxuZnVuY3Rpb24gb25EaXIgKHNyY1N0YXQsIGRlc3RTdGF0LCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGlmICghZGVzdFN0YXQpIHJldHVybiBta0RpckFuZENvcHkoc3JjU3RhdCwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbiAgaWYgKGRlc3RTdGF0ICYmICFkZXN0U3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgcmV0dXJuIGNiKG5ldyBFcnJvcihgQ2Fubm90IG92ZXJ3cml0ZSBub24tZGlyZWN0b3J5ICcke2Rlc3R9JyB3aXRoIGRpcmVjdG9yeSAnJHtzcmN9Jy5gKSlcbiAgfVxuICByZXR1cm4gY29weURpcihzcmMsIGRlc3QsIG9wdHMsIGNiKVxufVxuXG5mdW5jdGlvbiBta0RpckFuZENvcHkgKHNyY1N0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgZnMubWtkaXIoZGVzdCwgZXJyID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGNvcHlEaXIoc3JjLCBkZXN0LCBvcHRzLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICAgIHJldHVybiBmcy5jaG1vZChkZXN0LCBzcmNTdGF0Lm1vZGUsIGNiKVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNvcHlEaXIgKHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgZnMucmVhZGRpcihzcmMsIChlcnIsIGl0ZW1zKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcbiAgICByZXR1cm4gY29weURpckl0ZW1zKGl0ZW1zLCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICB9KVxufVxuXG5mdW5jdGlvbiBjb3B5RGlySXRlbXMgKGl0ZW1zLCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IGl0ZW0gPSBpdGVtcy5wb3AoKVxuICBpZiAoIWl0ZW0pIHJldHVybiBjYigpXG4gIHJldHVybiBjb3B5RGlySXRlbShpdGVtcywgaXRlbSwgc3JjLCBkZXN0LCBvcHRzLCBjYilcbn1cblxuZnVuY3Rpb24gY29weURpckl0ZW0gKGl0ZW1zLCBpdGVtLCBzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGNvbnN0IHNyY0l0ZW0gPSBwYXRoLmpvaW4oc3JjLCBpdGVtKVxuICBjb25zdCBkZXN0SXRlbSA9IHBhdGguam9pbihkZXN0LCBpdGVtKVxuICBzdGF0LmNoZWNrUGF0aHMoc3JjSXRlbSwgZGVzdEl0ZW0sICdjb3B5JywgKGVyciwgc3RhdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGNvbnN0IHsgZGVzdFN0YXQgfSA9IHN0YXRzXG4gICAgc3RhcnRDb3B5KGRlc3RTdGF0LCBzcmNJdGVtLCBkZXN0SXRlbSwgb3B0cywgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgICByZXR1cm4gY29weURpckl0ZW1zKGl0ZW1zLCBzcmMsIGRlc3QsIG9wdHMsIGNiKVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG9uTGluayAoZGVzdFN0YXQsIHNyYywgZGVzdCwgb3B0cywgY2IpIHtcbiAgZnMucmVhZGxpbmsoc3JjLCAoZXJyLCByZXNvbHZlZFNyYykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgaWYgKG9wdHMuZGVyZWZlcmVuY2UpIHtcbiAgICAgIHJlc29sdmVkU3JjID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIHJlc29sdmVkU3JjKVxuICAgIH1cblxuICAgIGlmICghZGVzdFN0YXQpIHtcbiAgICAgIHJldHVybiBmcy5zeW1saW5rKHJlc29sdmVkU3JjLCBkZXN0LCBjYilcbiAgICB9IGVsc2Uge1xuICAgICAgZnMucmVhZGxpbmsoZGVzdCwgKGVyciwgcmVzb2x2ZWREZXN0KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBkZXN0IGV4aXN0cyBhbmQgaXMgYSByZWd1bGFyIGZpbGUgb3IgZGlyZWN0b3J5LFxuICAgICAgICAgIC8vIFdpbmRvd3MgbWF5IHRocm93IFVOS05PV04gZXJyb3IuIElmIGRlc3QgYWxyZWFkeSBleGlzdHMsXG4gICAgICAgICAgLy8gZnMgdGhyb3dzIGVycm9yIGFueXdheSwgc28gbm8gbmVlZCB0byBndWFyZCBhZ2FpbnN0IGl0IGhlcmUuXG4gICAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRUlOVkFMJyB8fCBlcnIuY29kZSA9PT0gJ1VOS05PV04nKSByZXR1cm4gZnMuc3ltbGluayhyZXNvbHZlZFNyYywgZGVzdCwgY2IpXG4gICAgICAgICAgcmV0dXJuIGNiKGVycilcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5kZXJlZmVyZW5jZSkge1xuICAgICAgICAgIHJlc29sdmVkRGVzdCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCByZXNvbHZlZERlc3QpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXQuaXNTcmNTdWJkaXIocmVzb2x2ZWRTcmMsIHJlc29sdmVkRGVzdCkpIHtcbiAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGBDYW5ub3QgY29weSAnJHtyZXNvbHZlZFNyY30nIHRvIGEgc3ViZGlyZWN0b3J5IG9mIGl0c2VsZiwgJyR7cmVzb2x2ZWREZXN0fScuYCkpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBkbyBub3QgY29weSBpZiBzcmMgaXMgYSBzdWJkaXIgb2YgZGVzdCBzaW5jZSB1bmxpbmtpbmdcbiAgICAgICAgLy8gZGVzdCBpbiB0aGlzIGNhc2Ugd291bGQgcmVzdWx0IGluIHJlbW92aW5nIHNyYyBjb250ZW50c1xuICAgICAgICAvLyBhbmQgdGhlcmVmb3JlIGEgYnJva2VuIHN5bWxpbmsgd291bGQgYmUgY3JlYXRlZC5cbiAgICAgICAgaWYgKGRlc3RTdGF0LmlzRGlyZWN0b3J5KCkgJiYgc3RhdC5pc1NyY1N1YmRpcihyZXNvbHZlZERlc3QsIHJlc29sdmVkU3JjKSkge1xuICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoYENhbm5vdCBvdmVyd3JpdGUgJyR7cmVzb2x2ZWREZXN0fScgd2l0aCAnJHtyZXNvbHZlZFNyY30nLmApKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5TGluayhyZXNvbHZlZFNyYywgZGVzdCwgY2IpXG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gY29weUxpbmsgKHJlc29sdmVkU3JjLCBkZXN0LCBjYikge1xuICBmcy51bmxpbmsoZGVzdCwgZXJyID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIHJldHVybiBmcy5zeW1saW5rKHJlc29sdmVkU3JjLCBkZXN0LCBjYilcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvcHk6IHUocmVxdWlyZSgnLi9jb3B5JykpXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKVxuXG5jb25zdCBpc1dpbmRvd3MgPSAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJylcblxuZnVuY3Rpb24gZGVmYXVsdHMgKG9wdGlvbnMpIHtcbiAgY29uc3QgbWV0aG9kcyA9IFtcbiAgICAndW5saW5rJyxcbiAgICAnY2htb2QnLFxuICAgICdzdGF0JyxcbiAgICAnbHN0YXQnLFxuICAgICdybWRpcicsXG4gICAgJ3JlYWRkaXInXG4gIF1cbiAgbWV0aG9kcy5mb3JFYWNoKG0gPT4ge1xuICAgIG9wdGlvbnNbbV0gPSBvcHRpb25zW21dIHx8IGZzW21dXG4gICAgbSA9IG0gKyAnU3luYydcbiAgICBvcHRpb25zW21dID0gb3B0aW9uc1ttXSB8fCBmc1ttXVxuICB9KVxuXG4gIG9wdGlvbnMubWF4QnVzeVRyaWVzID0gb3B0aW9ucy5tYXhCdXN5VHJpZXMgfHwgM1xufVxuXG5mdW5jdGlvbiByaW1yYWYgKHAsIG9wdGlvbnMsIGNiKSB7XG4gIGxldCBidXN5VHJpZXMgPSAwXG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBvcHRpb25zXG4gICAgb3B0aW9ucyA9IHt9XG4gIH1cblxuICBhc3NlcnQocCwgJ3JpbXJhZjogbWlzc2luZyBwYXRoJylcbiAgYXNzZXJ0LnN0cmljdEVxdWFsKHR5cGVvZiBwLCAnc3RyaW5nJywgJ3JpbXJhZjogcGF0aCBzaG91bGQgYmUgYSBzdHJpbmcnKVxuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIGNiLCAnZnVuY3Rpb24nLCAncmltcmFmOiBjYWxsYmFjayBmdW5jdGlvbiByZXF1aXJlZCcpXG4gIGFzc2VydChvcHRpb25zLCAncmltcmFmOiBpbnZhbGlkIG9wdGlvbnMgYXJndW1lbnQgcHJvdmlkZWQnKVxuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIG9wdGlvbnMsICdvYmplY3QnLCAncmltcmFmOiBvcHRpb25zIHNob3VsZCBiZSBvYmplY3QnKVxuXG4gIGRlZmF1bHRzKG9wdGlvbnMpXG5cbiAgcmltcmFmXyhwLCBvcHRpb25zLCBmdW5jdGlvbiBDQiAoZXIpIHtcbiAgICBpZiAoZXIpIHtcbiAgICAgIGlmICgoZXIuY29kZSA9PT0gJ0VCVVNZJyB8fCBlci5jb2RlID09PSAnRU5PVEVNUFRZJyB8fCBlci5jb2RlID09PSAnRVBFUk0nKSAmJlxuICAgICAgICAgIGJ1c3lUcmllcyA8IG9wdGlvbnMubWF4QnVzeVRyaWVzKSB7XG4gICAgICAgIGJ1c3lUcmllcysrXG4gICAgICAgIGNvbnN0IHRpbWUgPSBidXN5VHJpZXMgKiAxMDBcbiAgICAgICAgLy8gdHJ5IGFnYWluLCB3aXRoIHRoZSBzYW1lIGV4YWN0IGNhbGxiYWNrIGFzIHRoaXMgb25lLlxuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiByaW1yYWZfKHAsIG9wdGlvbnMsIENCKSwgdGltZSlcbiAgICAgIH1cblxuICAgICAgLy8gYWxyZWFkeSBnb25lXG4gICAgICBpZiAoZXIuY29kZSA9PT0gJ0VOT0VOVCcpIGVyID0gbnVsbFxuICAgIH1cblxuICAgIGNiKGVyKVxuICB9KVxufVxuXG4vLyBUd28gcG9zc2libGUgc3RyYXRlZ2llcy5cbi8vIDEuIEFzc3VtZSBpdCdzIGEgZmlsZS4gIHVubGluayBpdCwgdGhlbiBkbyB0aGUgZGlyIHN0dWZmIG9uIEVQRVJNIG9yIEVJU0RJUlxuLy8gMi4gQXNzdW1lIGl0J3MgYSBkaXJlY3RvcnkuICByZWFkZGlyLCB0aGVuIGRvIHRoZSBmaWxlIHN0dWZmIG9uIEVOT1RESVJcbi8vXG4vLyBCb3RoIHJlc3VsdCBpbiBhbiBleHRyYSBzeXNjYWxsIHdoZW4geW91IGd1ZXNzIHdyb25nLiAgSG93ZXZlciwgdGhlcmVcbi8vIGFyZSBsaWtlbHkgZmFyIG1vcmUgbm9ybWFsIGZpbGVzIGluIHRoZSB3b3JsZCB0aGFuIGRpcmVjdG9yaWVzLiAgVGhpc1xuLy8gaXMgYmFzZWQgb24gdGhlIGFzc3VtcHRpb24gdGhhdCBhIHRoZSBhdmVyYWdlIG51bWJlciBvZiBmaWxlcyBwZXJcbi8vIGRpcmVjdG9yeSBpcyA+PSAxLlxuLy9cbi8vIElmIGFueW9uZSBldmVyIGNvbXBsYWlucyBhYm91dCB0aGlzLCB0aGVuIEkgZ3Vlc3MgdGhlIHN0cmF0ZWd5IGNvdWxkXG4vLyBiZSBtYWRlIGNvbmZpZ3VyYWJsZSBzb21laG93LiAgQnV0IHVudGlsIHRoZW4sIFlBR05JLlxuZnVuY3Rpb24gcmltcmFmXyAocCwgb3B0aW9ucywgY2IpIHtcbiAgYXNzZXJ0KHApXG4gIGFzc2VydChvcHRpb25zKVxuICBhc3NlcnQodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuXG4gIC8vIHN1bm9zIGxldHMgdGhlIHJvb3QgdXNlciB1bmxpbmsgZGlyZWN0b3JpZXMsIHdoaWNoIGlzLi4uIHdlaXJkLlxuICAvLyBzbyB3ZSBoYXZlIHRvIGxzdGF0IGhlcmUgYW5kIG1ha2Ugc3VyZSBpdCdzIG5vdCBhIGRpci5cbiAgb3B0aW9ucy5sc3RhdChwLCAoZXIsIHN0KSA9PiB7XG4gICAgaWYgKGVyICYmIGVyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm4gY2IobnVsbClcbiAgICB9XG5cbiAgICAvLyBXaW5kb3dzIGNhbiBFUEVSTSBvbiBzdGF0LiAgTGlmZSBpcyBzdWZmZXJpbmcuXG4gICAgaWYgKGVyICYmIGVyLmNvZGUgPT09ICdFUEVSTScgJiYgaXNXaW5kb3dzKSB7XG4gICAgICByZXR1cm4gZml4V2luRVBFUk0ocCwgb3B0aW9ucywgZXIsIGNiKVxuICAgIH1cblxuICAgIGlmIChzdCAmJiBzdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICByZXR1cm4gcm1kaXIocCwgb3B0aW9ucywgZXIsIGNiKVxuICAgIH1cblxuICAgIG9wdGlvbnMudW5saW5rKHAsIGVyID0+IHtcbiAgICAgIGlmIChlcikge1xuICAgICAgICBpZiAoZXIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICByZXR1cm4gY2IobnVsbClcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXIuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgICAgIHJldHVybiAoaXNXaW5kb3dzKVxuICAgICAgICAgICAgPyBmaXhXaW5FUEVSTShwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgICAgICAgICA6IHJtZGlyKHAsIG9wdGlvbnMsIGVyLCBjYilcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXIuY29kZSA9PT0gJ0VJU0RJUicpIHtcbiAgICAgICAgICByZXR1cm4gcm1kaXIocCwgb3B0aW9ucywgZXIsIGNiKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY2IoZXIpXG4gICAgfSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gZml4V2luRVBFUk0gKHAsIG9wdGlvbnMsIGVyLCBjYikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gIGlmIChlcikge1xuICAgIGFzc2VydChlciBpbnN0YW5jZW9mIEVycm9yKVxuICB9XG5cbiAgb3B0aW9ucy5jaG1vZChwLCAwbzY2NiwgZXIyID0+IHtcbiAgICBpZiAoZXIyKSB7XG4gICAgICBjYihlcjIuY29kZSA9PT0gJ0VOT0VOVCcgPyBudWxsIDogZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMuc3RhdChwLCAoZXIzLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXIzKSB7XG4gICAgICAgICAgY2IoZXIzLmNvZGUgPT09ICdFTk9FTlQnID8gbnVsbCA6IGVyKVxuICAgICAgICB9IGVsc2UgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBybWRpcihwLCBvcHRpb25zLCBlciwgY2IpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9ucy51bmxpbmsocCwgY2IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBmaXhXaW5FUEVSTVN5bmMgKHAsIG9wdGlvbnMsIGVyKSB7XG4gIGxldCBzdGF0c1xuXG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgaWYgKGVyKSB7XG4gICAgYXNzZXJ0KGVyIGluc3RhbmNlb2YgRXJyb3IpXG4gIH1cblxuICB0cnkge1xuICAgIG9wdGlvbnMuY2htb2RTeW5jKHAsIDBvNjY2KVxuICB9IGNhdGNoIChlcjIpIHtcbiAgICBpZiAoZXIyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIHN0YXRzID0gb3B0aW9ucy5zdGF0U3luYyhwKVxuICB9IGNhdGNoIChlcjMpIHtcbiAgICBpZiAoZXIzLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgIHJtZGlyU3luYyhwLCBvcHRpb25zLCBlcilcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25zLnVubGlua1N5bmMocClcbiAgfVxufVxuXG5mdW5jdGlvbiBybWRpciAocCwgb3B0aW9ucywgb3JpZ2luYWxFciwgY2IpIHtcbiAgYXNzZXJ0KHApXG4gIGFzc2VydChvcHRpb25zKVxuICBpZiAob3JpZ2luYWxFcikge1xuICAgIGFzc2VydChvcmlnaW5hbEVyIGluc3RhbmNlb2YgRXJyb3IpXG4gIH1cbiAgYXNzZXJ0KHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcblxuICAvLyB0cnkgdG8gcm1kaXIgZmlyc3QsIGFuZCBvbmx5IHJlYWRkaXIgb24gRU5PVEVNUFRZIG9yIEVFWElTVCAoU3VuT1MpXG4gIC8vIGlmIHdlIGd1ZXNzZWQgd3JvbmcsIGFuZCBpdCdzIG5vdCBhIGRpcmVjdG9yeSwgdGhlblxuICAvLyByYWlzZSB0aGUgb3JpZ2luYWwgZXJyb3IuXG4gIG9wdGlvbnMucm1kaXIocCwgZXIgPT4ge1xuICAgIGlmIChlciAmJiAoZXIuY29kZSA9PT0gJ0VOT1RFTVBUWScgfHwgZXIuY29kZSA9PT0gJ0VFWElTVCcgfHwgZXIuY29kZSA9PT0gJ0VQRVJNJykpIHtcbiAgICAgIHJta2lkcyhwLCBvcHRpb25zLCBjYilcbiAgICB9IGVsc2UgaWYgKGVyICYmIGVyLmNvZGUgPT09ICdFTk9URElSJykge1xuICAgICAgY2Iob3JpZ2luYWxFcilcbiAgICB9IGVsc2Uge1xuICAgICAgY2IoZXIpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBybWtpZHMgKHAsIG9wdGlvbnMsIGNiKSB7XG4gIGFzc2VydChwKVxuICBhc3NlcnQob3B0aW9ucylcbiAgYXNzZXJ0KHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcblxuICBvcHRpb25zLnJlYWRkaXIocCwgKGVyLCBmaWxlcykgPT4ge1xuICAgIGlmIChlcikgcmV0dXJuIGNiKGVyKVxuXG4gICAgbGV0IG4gPSBmaWxlcy5sZW5ndGhcbiAgICBsZXQgZXJyU3RhdGVcblxuICAgIGlmIChuID09PSAwKSByZXR1cm4gb3B0aW9ucy5ybWRpcihwLCBjYilcblxuICAgIGZpbGVzLmZvckVhY2goZiA9PiB7XG4gICAgICByaW1yYWYocGF0aC5qb2luKHAsIGYpLCBvcHRpb25zLCBlciA9PiB7XG4gICAgICAgIGlmIChlcnJTdGF0ZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChlcikgcmV0dXJuIGNiKGVyclN0YXRlID0gZXIpXG4gICAgICAgIGlmICgtLW4gPT09IDApIHtcbiAgICAgICAgICBvcHRpb25zLnJtZGlyKHAsIGNiKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbi8vIHRoaXMgbG9va3Mgc2ltcGxlciwgYW5kIGlzIHN0cmljdGx5ICpmYXN0ZXIqLCBidXQgd2lsbFxuLy8gdGllIHVwIHRoZSBKYXZhU2NyaXB0IHRocmVhZCBhbmQgZmFpbCBvbiBleGNlc3NpdmVseVxuLy8gZGVlcCBkaXJlY3RvcnkgdHJlZXMuXG5mdW5jdGlvbiByaW1yYWZTeW5jIChwLCBvcHRpb25zKSB7XG4gIGxldCBzdFxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIGRlZmF1bHRzKG9wdGlvbnMpXG5cbiAgYXNzZXJ0KHAsICdyaW1yYWY6IG1pc3NpbmcgcGF0aCcpXG4gIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2YgcCwgJ3N0cmluZycsICdyaW1yYWY6IHBhdGggc2hvdWxkIGJlIGEgc3RyaW5nJylcbiAgYXNzZXJ0KG9wdGlvbnMsICdyaW1yYWY6IG1pc3Npbmcgb3B0aW9ucycpXG4gIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2Ygb3B0aW9ucywgJ29iamVjdCcsICdyaW1yYWY6IG9wdGlvbnMgc2hvdWxkIGJlIG9iamVjdCcpXG5cbiAgdHJ5IHtcbiAgICBzdCA9IG9wdGlvbnMubHN0YXRTeW5jKHApXG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgaWYgKGVyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBXaW5kb3dzIGNhbiBFUEVSTSBvbiBzdGF0LiAgTGlmZSBpcyBzdWZmZXJpbmcuXG4gICAgaWYgKGVyLmNvZGUgPT09ICdFUEVSTScgJiYgaXNXaW5kb3dzKSB7XG4gICAgICBmaXhXaW5FUEVSTVN5bmMocCwgb3B0aW9ucywgZXIpXG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBzdW5vcyBsZXRzIHRoZSByb290IHVzZXIgdW5saW5rIGRpcmVjdG9yaWVzLCB3aGljaCBpcy4uLiB3ZWlyZC5cbiAgICBpZiAoc3QgJiYgc3QuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgcm1kaXJTeW5jKHAsIG9wdGlvbnMsIG51bGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMudW5saW5rU3luYyhwKVxuICAgIH1cbiAgfSBjYXRjaCAoZXIpIHtcbiAgICBpZiAoZXIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSBpZiAoZXIuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgcmV0dXJuIGlzV2luZG93cyA/IGZpeFdpbkVQRVJNU3luYyhwLCBvcHRpb25zLCBlcikgOiBybWRpclN5bmMocCwgb3B0aW9ucywgZXIpXG4gICAgfSBlbHNlIGlmIChlci5jb2RlICE9PSAnRUlTRElSJykge1xuICAgICAgdGhyb3cgZXJcbiAgICB9XG4gICAgcm1kaXJTeW5jKHAsIG9wdGlvbnMsIGVyKVxuICB9XG59XG5cbmZ1bmN0aW9uIHJtZGlyU3luYyAocCwgb3B0aW9ucywgb3JpZ2luYWxFcikge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIGlmIChvcmlnaW5hbEVyKSB7XG4gICAgYXNzZXJ0KG9yaWdpbmFsRXIgaW5zdGFuY2VvZiBFcnJvcilcbiAgfVxuXG4gIHRyeSB7XG4gICAgb3B0aW9ucy5ybWRpclN5bmMocClcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICBpZiAoZXIuY29kZSA9PT0gJ0VOT1RESVInKSB7XG4gICAgICB0aHJvdyBvcmlnaW5hbEVyXG4gICAgfSBlbHNlIGlmIChlci5jb2RlID09PSAnRU5PVEVNUFRZJyB8fCBlci5jb2RlID09PSAnRUVYSVNUJyB8fCBlci5jb2RlID09PSAnRVBFUk0nKSB7XG4gICAgICBybWtpZHNTeW5jKHAsIG9wdGlvbnMpXG4gICAgfSBlbHNlIGlmIChlci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgdGhyb3cgZXJcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcm1raWRzU3luYyAocCwgb3B0aW9ucykge1xuICBhc3NlcnQocClcbiAgYXNzZXJ0KG9wdGlvbnMpXG4gIG9wdGlvbnMucmVhZGRpclN5bmMocCkuZm9yRWFjaChmID0+IHJpbXJhZlN5bmMocGF0aC5qb2luKHAsIGYpLCBvcHRpb25zKSlcblxuICBpZiAoaXNXaW5kb3dzKSB7XG4gICAgLy8gV2Ugb25seSBlbmQgdXAgaGVyZSBvbmNlIHdlIGdvdCBFTk9URU1QVFkgYXQgbGVhc3Qgb25jZSwgYW5kXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgd2UgYXJlIGd1YXJhbnRlZWQgdG8gaGF2ZSByZW1vdmVkIGFsbCB0aGUga2lkcy5cbiAgICAvLyBTbywgd2Uga25vdyB0aGF0IGl0IHdvbid0IGJlIEVOT0VOVCBvciBFTk9URElSIG9yIGFueXRoaW5nIGVsc2UuXG4gICAgLy8gdHJ5IHJlYWxseSBoYXJkIHRvIGRlbGV0ZSBzdHVmZiBvbiB3aW5kb3dzLCBiZWNhdXNlIGl0IGhhcyBhXG4gICAgLy8gUFJPRk9VTkRMWSBhbm5veWluZyBoYWJpdCBvZiBub3QgY2xvc2luZyBoYW5kbGVzIHByb21wdGx5IHdoZW5cbiAgICAvLyBmaWxlcyBhcmUgZGVsZXRlZCwgcmVzdWx0aW5nIGluIHNwdXJpb3VzIEVOT1RFTVBUWSBlcnJvcnMuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIGRvIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG9wdGlvbnMucm1kaXJTeW5jKHAsIG9wdGlvbnMpXG4gICAgICAgIHJldHVybiByZXRcbiAgICAgIH0gY2F0Y2ggKGVyKSB7IH1cbiAgICB9IHdoaWxlIChEYXRlLm5vdygpIC0gc3RhcnRUaW1lIDwgNTAwKSAvLyBnaXZlIHVwIGFmdGVyIDUwMG1zXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmV0ID0gb3B0aW9ucy5ybWRpclN5bmMocCwgb3B0aW9ucylcbiAgICByZXR1cm4gcmV0XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByaW1yYWZcbnJpbXJhZi5zeW5jID0gcmltcmFmU3luY1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcbmNvbnN0IHJpbXJhZiA9IHJlcXVpcmUoJy4vcmltcmFmJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlbW92ZTogdShyaW1yYWYpLFxuICByZW1vdmVTeW5jOiByaW1yYWYuc3luY1xufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgbWtkaXIgPSByZXF1aXJlKCcuLi9ta2RpcnMnKVxuY29uc3QgcmVtb3ZlID0gcmVxdWlyZSgnLi4vcmVtb3ZlJylcblxuY29uc3QgZW1wdHlEaXIgPSB1KGZ1bmN0aW9uIGVtcHR5RGlyIChkaXIsIGNhbGxiYWNrKSB7XG4gIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge31cbiAgZnMucmVhZGRpcihkaXIsIChlcnIsIGl0ZW1zKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIG1rZGlyLm1rZGlycyhkaXIsIGNhbGxiYWNrKVxuXG4gICAgaXRlbXMgPSBpdGVtcy5tYXAoaXRlbSA9PiBwYXRoLmpvaW4oZGlyLCBpdGVtKSlcblxuICAgIGRlbGV0ZUl0ZW0oKVxuXG4gICAgZnVuY3Rpb24gZGVsZXRlSXRlbSAoKSB7XG4gICAgICBjb25zdCBpdGVtID0gaXRlbXMucG9wKClcbiAgICAgIGlmICghaXRlbSkgcmV0dXJuIGNhbGxiYWNrKClcbiAgICAgIHJlbW92ZS5yZW1vdmUoaXRlbSwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgZGVsZXRlSXRlbSgpXG4gICAgICB9KVxuICAgIH1cbiAgfSlcbn0pXG5cbmZ1bmN0aW9uIGVtcHR5RGlyU3luYyAoZGlyKSB7XG4gIGxldCBpdGVtc1xuICB0cnkge1xuICAgIGl0ZW1zID0gZnMucmVhZGRpclN5bmMoZGlyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gbWtkaXIubWtkaXJzU3luYyhkaXIpXG4gIH1cblxuICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGl0ZW0gPSBwYXRoLmpvaW4oZGlyLCBpdGVtKVxuICAgIHJlbW92ZS5yZW1vdmVTeW5jKGl0ZW0pXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbXB0eURpclN5bmMsXG4gIGVtcHR5ZGlyU3luYzogZW1wdHlEaXJTeW5jLFxuICBlbXB0eURpcixcbiAgZW1wdHlkaXI6IGVtcHR5RGlyXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5cbmZ1bmN0aW9uIGNyZWF0ZUZpbGUgKGZpbGUsIGNhbGxiYWNrKSB7XG4gIGZ1bmN0aW9uIG1ha2VGaWxlICgpIHtcbiAgICBmcy53cml0ZUZpbGUoZmlsZSwgJycsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH0pXG4gIH1cblxuICBmcy5zdGF0KGZpbGUsIChlcnIsIHN0YXRzKSA9PiB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaGFuZGxlLWNhbGxiYWNrLWVyclxuICAgIGlmICghZXJyICYmIHN0YXRzLmlzRmlsZSgpKSByZXR1cm4gY2FsbGJhY2soKVxuICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlKVxuICAgIHBhdGhFeGlzdHMoZGlyLCAoZXJyLCBkaXJFeGlzdHMpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICBpZiAoZGlyRXhpc3RzKSByZXR1cm4gbWFrZUZpbGUoKVxuICAgICAgbWtkaXIubWtkaXJzKGRpciwgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgbWFrZUZpbGUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGaWxlU3luYyAoZmlsZSkge1xuICBsZXQgc3RhdHNcbiAgdHJ5IHtcbiAgICBzdGF0cyA9IGZzLnN0YXRTeW5jKGZpbGUpXG4gIH0gY2F0Y2ggKGUpIHt9XG4gIGlmIChzdGF0cyAmJiBzdGF0cy5pc0ZpbGUoKSkgcmV0dXJuXG5cbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG4gIGlmICghZnMuZXhpc3RzU3luYyhkaXIpKSB7XG4gICAgbWtkaXIubWtkaXJzU3luYyhkaXIpXG4gIH1cblxuICBmcy53cml0ZUZpbGVTeW5jKGZpbGUsICcnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlRmlsZTogdShjcmVhdGVGaWxlKSxcbiAgY3JlYXRlRmlsZVN5bmNcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB1ID0gcmVxdWlyZSgndW5pdmVyc2FsaWZ5JykuZnJvbUNhbGxiYWNrXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IHBhdGhFeGlzdHMgPSByZXF1aXJlKCcuLi9wYXRoLWV4aXN0cycpLnBhdGhFeGlzdHNcblxuZnVuY3Rpb24gY3JlYXRlTGluayAoc3JjcGF0aCwgZHN0cGF0aCwgY2FsbGJhY2spIHtcbiAgZnVuY3Rpb24gbWFrZUxpbmsgKHNyY3BhdGgsIGRzdHBhdGgpIHtcbiAgICBmcy5saW5rKHNyY3BhdGgsIGRzdHBhdGgsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgY2FsbGJhY2sobnVsbClcbiAgICB9KVxuICB9XG5cbiAgcGF0aEV4aXN0cyhkc3RwYXRoLCAoZXJyLCBkZXN0aW5hdGlvbkV4aXN0cykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgaWYgKGRlc3RpbmF0aW9uRXhpc3RzKSByZXR1cm4gY2FsbGJhY2sobnVsbClcbiAgICBmcy5sc3RhdChzcmNwYXRoLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGVyci5tZXNzYWdlID0gZXJyLm1lc3NhZ2UucmVwbGFjZSgnbHN0YXQnLCAnZW5zdXJlTGluaycpXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShkc3RwYXRoKVxuICAgICAgcGF0aEV4aXN0cyhkaXIsIChlcnIsIGRpckV4aXN0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICBpZiAoZGlyRXhpc3RzKSByZXR1cm4gbWFrZUxpbmsoc3JjcGF0aCwgZHN0cGF0aClcbiAgICAgICAgbWtkaXIubWtkaXJzKGRpciwgZXJyID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgIG1ha2VMaW5rKHNyY3BhdGgsIGRzdHBhdGgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtTeW5jIChzcmNwYXRoLCBkc3RwYXRoKSB7XG4gIGNvbnN0IGRlc3RpbmF0aW9uRXhpc3RzID0gZnMuZXhpc3RzU3luYyhkc3RwYXRoKVxuICBpZiAoZGVzdGluYXRpb25FeGlzdHMpIHJldHVybiB1bmRlZmluZWRcblxuICB0cnkge1xuICAgIGZzLmxzdGF0U3luYyhzcmNwYXRoKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlLnJlcGxhY2UoJ2xzdGF0JywgJ2Vuc3VyZUxpbmsnKVxuICAgIHRocm93IGVyclxuICB9XG5cbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGRzdHBhdGgpXG4gIGNvbnN0IGRpckV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZGlyKVxuICBpZiAoZGlyRXhpc3RzKSByZXR1cm4gZnMubGlua1N5bmMoc3JjcGF0aCwgZHN0cGF0aClcbiAgbWtkaXIubWtkaXJzU3luYyhkaXIpXG5cbiAgcmV0dXJuIGZzLmxpbmtTeW5jKHNyY3BhdGgsIGRzdHBhdGgpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVMaW5rOiB1KGNyZWF0ZUxpbmspLFxuICBjcmVhdGVMaW5rU3luY1xufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aEV4aXN0cyA9IHJlcXVpcmUoJy4uL3BhdGgtZXhpc3RzJykucGF0aEV4aXN0c1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0d28gdHlwZXMgb2YgcGF0aHMsIG9uZSByZWxhdGl2ZSB0byBzeW1saW5rLCBhbmQgb25lXG4gKiByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gQ2hlY2tzIGlmIHBhdGggaXMgYWJzb2x1dGUgb3JcbiAqIHJlbGF0aXZlLiBJZiB0aGUgcGF0aCBpcyByZWxhdGl2ZSwgdGhpcyBmdW5jdGlvbiBjaGVja3MgaWYgdGhlIHBhdGggaXNcbiAqIHJlbGF0aXZlIHRvIHN5bWxpbmsgb3IgcmVsYXRpdmUgdG8gY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gVGhpcyBpcyBhblxuICogaW5pdGlhdGl2ZSB0byBmaW5kIGEgc21hcnRlciBgc3JjcGF0aGAgdG8gc3VwcGx5IHdoZW4gYnVpbGRpbmcgc3ltbGlua3MuXG4gKiBUaGlzIGFsbG93cyB5b3UgdG8gZGV0ZXJtaW5lIHdoaWNoIHBhdGggdG8gdXNlIG91dCBvZiBvbmUgb2YgdGhyZWUgcG9zc2libGVcbiAqIHR5cGVzIG9mIHNvdXJjZSBwYXRocy4gVGhlIGZpcnN0IGlzIGFuIGFic29sdXRlIHBhdGguIFRoaXMgaXMgZGV0ZWN0ZWQgYnlcbiAqIGBwYXRoLmlzQWJzb2x1dGUoKWAuIFdoZW4gYW4gYWJzb2x1dGUgcGF0aCBpcyBwcm92aWRlZCwgaXQgaXMgY2hlY2tlZCB0b1xuICogc2VlIGlmIGl0IGV4aXN0cy4gSWYgaXQgZG9lcyBpdCdzIHVzZWQsIGlmIG5vdCBhbiBlcnJvciBpcyByZXR1cm5lZFxuICogKGNhbGxiYWNrKS8gdGhyb3duIChzeW5jKS4gVGhlIG90aGVyIHR3byBvcHRpb25zIGZvciBgc3JjcGF0aGAgYXJlIGFcbiAqIHJlbGF0aXZlIHVybC4gQnkgZGVmYXVsdCBOb2RlJ3MgYGZzLnN5bWxpbmtgIHdvcmtzIGJ5IGNyZWF0aW5nIGEgc3ltbGlua1xuICogdXNpbmcgYGRzdHBhdGhgIGFuZCBleHBlY3RzIHRoZSBgc3JjcGF0aGAgdG8gYmUgcmVsYXRpdmUgdG8gdGhlIG5ld2x5XG4gKiBjcmVhdGVkIHN5bWxpbmsuIElmIHlvdSBwcm92aWRlIGEgYHNyY3BhdGhgIHRoYXQgZG9lcyBub3QgZXhpc3Qgb24gdGhlIGZpbGVcbiAqIHN5c3RlbSBpdCByZXN1bHRzIGluIGEgYnJva2VuIHN5bWxpbmsuIFRvIG1pbmltaXplIHRoaXMsIHRoZSBmdW5jdGlvblxuICogY2hlY2tzIHRvIHNlZSBpZiB0aGUgJ3JlbGF0aXZlIHRvIHN5bWxpbmsnIHNvdXJjZSBmaWxlIGV4aXN0cywgYW5kIGlmIGl0XG4gKiBkb2VzIGl0IHdpbGwgdXNlIGl0LiBJZiBpdCBkb2VzIG5vdCwgaXQgY2hlY2tzIGlmIHRoZXJlJ3MgYSBmaWxlIHRoYXRcbiAqIGV4aXN0cyB0aGF0IGlzIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LCBpZiBkb2VzIGl0cyB1c2VkLlxuICogVGhpcyBwcmVzZXJ2ZXMgdGhlIGV4cGVjdGF0aW9ucyBvZiB0aGUgb3JpZ2luYWwgZnMuc3ltbGluayBzcGVjIGFuZCBhZGRzXG4gKiB0aGUgYWJpbGl0eSB0byBwYXNzIGluIGByZWxhdGl2ZSB0byBjdXJyZW50IHdvcmtpbmcgZGlyZWNvdHJ5YCBwYXRocy5cbiAqL1xuXG5mdW5jdGlvbiBzeW1saW5rUGF0aHMgKHNyY3BhdGgsIGRzdHBhdGgsIGNhbGxiYWNrKSB7XG4gIGlmIChwYXRoLmlzQWJzb2x1dGUoc3JjcGF0aCkpIHtcbiAgICByZXR1cm4gZnMubHN0YXQoc3JjcGF0aCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBlcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlLnJlcGxhY2UoJ2xzdGF0JywgJ2Vuc3VyZVN5bWxpbmsnKVxuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgJ3RvQ3dkJzogc3JjcGF0aCxcbiAgICAgICAgJ3RvRHN0Jzogc3JjcGF0aFxuICAgICAgfSlcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGRzdGRpciA9IHBhdGguZGlybmFtZShkc3RwYXRoKVxuICAgIGNvbnN0IHJlbGF0aXZlVG9Ec3QgPSBwYXRoLmpvaW4oZHN0ZGlyLCBzcmNwYXRoKVxuICAgIHJldHVybiBwYXRoRXhpc3RzKHJlbGF0aXZlVG9Ec3QsIChlcnIsIGV4aXN0cykgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAndG9Dd2QnOiByZWxhdGl2ZVRvRHN0LFxuICAgICAgICAgICd0b0RzdCc6IHNyY3BhdGhcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmcy5sc3RhdChzcmNwYXRoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZS5yZXBsYWNlKCdsc3RhdCcsICdlbnN1cmVTeW1saW5rJylcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAndG9Dd2QnOiBzcmNwYXRoLFxuICAgICAgICAgICAgJ3RvRHN0JzogcGF0aC5yZWxhdGl2ZShkc3RkaXIsIHNyY3BhdGgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIHN5bWxpbmtQYXRoc1N5bmMgKHNyY3BhdGgsIGRzdHBhdGgpIHtcbiAgbGV0IGV4aXN0c1xuICBpZiAocGF0aC5pc0Fic29sdXRlKHNyY3BhdGgpKSB7XG4gICAgZXhpc3RzID0gZnMuZXhpc3RzU3luYyhzcmNwYXRoKVxuICAgIGlmICghZXhpc3RzKSB0aHJvdyBuZXcgRXJyb3IoJ2Fic29sdXRlIHNyY3BhdGggZG9lcyBub3QgZXhpc3QnKVxuICAgIHJldHVybiB7XG4gICAgICAndG9Dd2QnOiBzcmNwYXRoLFxuICAgICAgJ3RvRHN0Jzogc3JjcGF0aFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBkc3RkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgICBjb25zdCByZWxhdGl2ZVRvRHN0ID0gcGF0aC5qb2luKGRzdGRpciwgc3JjcGF0aClcbiAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKHJlbGF0aXZlVG9Ec3QpXG4gICAgaWYgKGV4aXN0cykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3RvQ3dkJzogcmVsYXRpdmVUb0RzdCxcbiAgICAgICAgJ3RvRHN0Jzogc3JjcGF0aFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKHNyY3BhdGgpXG4gICAgICBpZiAoIWV4aXN0cykgdGhyb3cgbmV3IEVycm9yKCdyZWxhdGl2ZSBzcmNwYXRoIGRvZXMgbm90IGV4aXN0JylcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd0b0N3ZCc6IHNyY3BhdGgsXG4gICAgICAgICd0b0RzdCc6IHBhdGgucmVsYXRpdmUoZHN0ZGlyLCBzcmNwYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3ltbGlua1BhdGhzLFxuICBzeW1saW5rUGF0aHNTeW5jXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5cbmZ1bmN0aW9uIHN5bWxpbmtUeXBlIChzcmNwYXRoLCB0eXBlLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyB0eXBlIDogY2FsbGJhY2tcbiAgdHlwZSA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyBmYWxzZSA6IHR5cGVcbiAgaWYgKHR5cGUpIHJldHVybiBjYWxsYmFjayhudWxsLCB0eXBlKVxuICBmcy5sc3RhdChzcmNwYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhudWxsLCAnZmlsZScpXG4gICAgdHlwZSA9IChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSA/ICdkaXInIDogJ2ZpbGUnXG4gICAgY2FsbGJhY2sobnVsbCwgdHlwZSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gc3ltbGlua1R5cGVTeW5jIChzcmNwYXRoLCB0eXBlKSB7XG4gIGxldCBzdGF0c1xuXG4gIGlmICh0eXBlKSByZXR1cm4gdHlwZVxuICB0cnkge1xuICAgIHN0YXRzID0gZnMubHN0YXRTeW5jKHNyY3BhdGgpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ2ZpbGUnXG4gIH1cbiAgcmV0dXJuIChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSA/ICdkaXInIDogJ2ZpbGUnXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzeW1saW5rVHlwZSxcbiAgc3ltbGlua1R5cGVTeW5jXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBfbWtkaXJzID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IG1rZGlycyA9IF9ta2RpcnMubWtkaXJzXG5jb25zdCBta2RpcnNTeW5jID0gX21rZGlycy5ta2RpcnNTeW5jXG5cbmNvbnN0IF9zeW1saW5rUGF0aHMgPSByZXF1aXJlKCcuL3N5bWxpbmstcGF0aHMnKVxuY29uc3Qgc3ltbGlua1BhdGhzID0gX3N5bWxpbmtQYXRocy5zeW1saW5rUGF0aHNcbmNvbnN0IHN5bWxpbmtQYXRoc1N5bmMgPSBfc3ltbGlua1BhdGhzLnN5bWxpbmtQYXRoc1N5bmNcblxuY29uc3QgX3N5bWxpbmtUeXBlID0gcmVxdWlyZSgnLi9zeW1saW5rLXR5cGUnKVxuY29uc3Qgc3ltbGlua1R5cGUgPSBfc3ltbGlua1R5cGUuc3ltbGlua1R5cGVcbmNvbnN0IHN5bWxpbmtUeXBlU3luYyA9IF9zeW1saW5rVHlwZS5zeW1saW5rVHlwZVN5bmNcblxuY29uc3QgcGF0aEV4aXN0cyA9IHJlcXVpcmUoJy4uL3BhdGgtZXhpc3RzJykucGF0aEV4aXN0c1xuXG5mdW5jdGlvbiBjcmVhdGVTeW1saW5rIChzcmNwYXRoLCBkc3RwYXRoLCB0eXBlLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyB0eXBlIDogY2FsbGJhY2tcbiAgdHlwZSA9ICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykgPyBmYWxzZSA6IHR5cGVcblxuICBwYXRoRXhpc3RzKGRzdHBhdGgsIChlcnIsIGRlc3RpbmF0aW9uRXhpc3RzKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICBpZiAoZGVzdGluYXRpb25FeGlzdHMpIHJldHVybiBjYWxsYmFjayhudWxsKVxuICAgIHN5bWxpbmtQYXRocyhzcmNwYXRoLCBkc3RwYXRoLCAoZXJyLCByZWxhdGl2ZSkgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgIHNyY3BhdGggPSByZWxhdGl2ZS50b0RzdFxuICAgICAgc3ltbGlua1R5cGUocmVsYXRpdmUudG9Dd2QsIHR5cGUsIChlcnIsIHR5cGUpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcbiAgICAgICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGRzdHBhdGgpXG4gICAgICAgIHBhdGhFeGlzdHMoZGlyLCAoZXJyLCBkaXJFeGlzdHMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgIGlmIChkaXJFeGlzdHMpIHJldHVybiBmcy5zeW1saW5rKHNyY3BhdGgsIGRzdHBhdGgsIHR5cGUsIGNhbGxiYWNrKVxuICAgICAgICAgIG1rZGlycyhkaXIsIGVyciA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAgICAgICAgZnMuc3ltbGluayhzcmNwYXRoLCBkc3RwYXRoLCB0eXBlLCBjYWxsYmFjaylcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTeW1saW5rU3luYyAoc3JjcGF0aCwgZHN0cGF0aCwgdHlwZSkge1xuICBjb25zdCBkZXN0aW5hdGlvbkV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZHN0cGF0aClcbiAgaWYgKGRlc3RpbmF0aW9uRXhpc3RzKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgY29uc3QgcmVsYXRpdmUgPSBzeW1saW5rUGF0aHNTeW5jKHNyY3BhdGgsIGRzdHBhdGgpXG4gIHNyY3BhdGggPSByZWxhdGl2ZS50b0RzdFxuICB0eXBlID0gc3ltbGlua1R5cGVTeW5jKHJlbGF0aXZlLnRvQ3dkLCB0eXBlKVxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZHN0cGF0aClcbiAgY29uc3QgZXhpc3RzID0gZnMuZXhpc3RzU3luYyhkaXIpXG4gIGlmIChleGlzdHMpIHJldHVybiBmcy5zeW1saW5rU3luYyhzcmNwYXRoLCBkc3RwYXRoLCB0eXBlKVxuICBta2RpcnNTeW5jKGRpcilcbiAgcmV0dXJuIGZzLnN5bWxpbmtTeW5jKHNyY3BhdGgsIGRzdHBhdGgsIHR5cGUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVTeW1saW5rOiB1KGNyZWF0ZVN5bWxpbmspLFxuICBjcmVhdGVTeW1saW5rU3luY1xufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZpbGUgPSByZXF1aXJlKCcuL2ZpbGUnKVxuY29uc3QgbGluayA9IHJlcXVpcmUoJy4vbGluaycpXG5jb25zdCBzeW1saW5rID0gcmVxdWlyZSgnLi9zeW1saW5rJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGZpbGVcbiAgY3JlYXRlRmlsZTogZmlsZS5jcmVhdGVGaWxlLFxuICBjcmVhdGVGaWxlU3luYzogZmlsZS5jcmVhdGVGaWxlU3luYyxcbiAgZW5zdXJlRmlsZTogZmlsZS5jcmVhdGVGaWxlLFxuICBlbnN1cmVGaWxlU3luYzogZmlsZS5jcmVhdGVGaWxlU3luYyxcbiAgLy8gbGlua1xuICBjcmVhdGVMaW5rOiBsaW5rLmNyZWF0ZUxpbmssXG4gIGNyZWF0ZUxpbmtTeW5jOiBsaW5rLmNyZWF0ZUxpbmtTeW5jLFxuICBlbnN1cmVMaW5rOiBsaW5rLmNyZWF0ZUxpbmssXG4gIGVuc3VyZUxpbmtTeW5jOiBsaW5rLmNyZWF0ZUxpbmtTeW5jLFxuICAvLyBzeW1saW5rXG4gIGNyZWF0ZVN5bWxpbms6IHN5bWxpbmsuY3JlYXRlU3ltbGluayxcbiAgY3JlYXRlU3ltbGlua1N5bmM6IHN5bWxpbmsuY3JlYXRlU3ltbGlua1N5bmMsXG4gIGVuc3VyZVN5bWxpbms6IHN5bWxpbmsuY3JlYXRlU3ltbGluayxcbiAgZW5zdXJlU3ltbGlua1N5bmM6IHN5bWxpbmsuY3JlYXRlU3ltbGlua1N5bmNcbn1cbiIsInZhciBfZnNcbnRyeSB7XG4gIF9mcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbn0gY2F0Y2ggKF8pIHtcbiAgX2ZzID0gcmVxdWlyZSgnZnMnKVxufVxuXG5mdW5jdGlvbiByZWFkRmlsZSAoZmlsZSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0ge2VuY29kaW5nOiBvcHRpb25zfVxuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGZzID0gb3B0aW9ucy5mcyB8fCBfZnNcblxuICB2YXIgc2hvdWxkVGhyb3cgPSB0cnVlXG4gIGlmICgndGhyb3dzJyBpbiBvcHRpb25zKSB7XG4gICAgc2hvdWxkVGhyb3cgPSBvcHRpb25zLnRocm93c1xuICB9XG5cbiAgZnMucmVhZEZpbGUoZmlsZSwgb3B0aW9ucywgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG5cbiAgICBkYXRhID0gc3RyaXBCb20oZGF0YSlcblxuICAgIHZhciBvYmpcbiAgICB0cnkge1xuICAgICAgb2JqID0gSlNPTi5wYXJzZShkYXRhLCBvcHRpb25zID8gb3B0aW9ucy5yZXZpdmVyIDogbnVsbClcbiAgICB9IGNhdGNoIChlcnIyKSB7XG4gICAgICBpZiAoc2hvdWxkVGhyb3cpIHtcbiAgICAgICAgZXJyMi5tZXNzYWdlID0gZmlsZSArICc6ICcgKyBlcnIyLm1lc3NhZ2VcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycjIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbnVsbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxsYmFjayhudWxsLCBvYmopXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRGaWxlU3luYyAoZmlsZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0aW9ucyA9IHtlbmNvZGluZzogb3B0aW9uc31cbiAgfVxuXG4gIHZhciBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgdmFyIHNob3VsZFRocm93ID0gdHJ1ZVxuICBpZiAoJ3Rocm93cycgaW4gb3B0aW9ucykge1xuICAgIHNob3VsZFRocm93ID0gb3B0aW9ucy50aHJvd3NcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgb3B0aW9ucylcbiAgICBjb250ZW50ID0gc3RyaXBCb20oY29udGVudClcbiAgICByZXR1cm4gSlNPTi5wYXJzZShjb250ZW50LCBvcHRpb25zLnJldml2ZXIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgZXJyLm1lc3NhZ2UgPSBmaWxlICsgJzogJyArIGVyci5tZXNzYWdlXG4gICAgICB0aHJvdyBlcnJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5IChvYmosIG9wdGlvbnMpIHtcbiAgdmFyIHNwYWNlc1xuICB2YXIgRU9MID0gJ1xcbidcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgaWYgKG9wdGlvbnMuc3BhY2VzKSB7XG4gICAgICBzcGFjZXMgPSBvcHRpb25zLnNwYWNlc1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5FT0wpIHtcbiAgICAgIEVPTCA9IG9wdGlvbnMuRU9MXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ciA9IEpTT04uc3RyaW5naWZ5KG9iaiwgb3B0aW9ucyA/IG9wdGlvbnMucmVwbGFjZXIgOiBudWxsLCBzcGFjZXMpXG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXG4vZywgRU9MKSArIEVPTFxufVxuXG5mdW5jdGlvbiB3cml0ZUZpbGUgKGZpbGUsIG9iaiwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgICBvcHRpb25zID0ge31cbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgZnMgPSBvcHRpb25zLmZzIHx8IF9mc1xuXG4gIHZhciBzdHIgPSAnJ1xuICB0cnkge1xuICAgIHN0ciA9IHN0cmluZ2lmeShvYmosIG9wdGlvbnMpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIE5lZWQgdG8gcmV0dXJuIHdoZXRoZXIgYSBjYWxsYmFjayB3YXMgcGFzc2VkIG9yIG5vdFxuICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyLCBudWxsKVxuICAgIHJldHVyblxuICB9XG5cbiAgZnMud3JpdGVGaWxlKGZpbGUsIHN0ciwgb3B0aW9ucywgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmlsZVN5bmMgKGZpbGUsIG9iaiwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgZnMgPSBvcHRpb25zLmZzIHx8IF9mc1xuXG4gIHZhciBzdHIgPSBzdHJpbmdpZnkob2JqLCBvcHRpb25zKVxuICAvLyBub3Qgc3VyZSBpZiBmcy53cml0ZUZpbGVTeW5jIHJldHVybnMgYW55dGhpbmcsIGJ1dCBqdXN0IGluIGNhc2VcbiAgcmV0dXJuIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgc3RyLCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzdHJpcEJvbSAoY29udGVudCkge1xuICAvLyB3ZSBkbyB0aGlzIGJlY2F1c2UgSlNPTi5wYXJzZSB3b3VsZCBjb252ZXJ0IGl0IHRvIGEgdXRmOCBzdHJpbmcgaWYgZW5jb2Rpbmcgd2Fzbid0IHNwZWNpZmllZFxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNvbnRlbnQpKSBjb250ZW50ID0gY29udGVudC50b1N0cmluZygndXRmOCcpXG4gIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoL15cXHVGRUZGLywgJycpXG4gIHJldHVybiBjb250ZW50XG59XG5cbnZhciBqc29uZmlsZSA9IHtcbiAgcmVhZEZpbGU6IHJlYWRGaWxlLFxuICByZWFkRmlsZVN5bmM6IHJlYWRGaWxlU3luYyxcbiAgd3JpdGVGaWxlOiB3cml0ZUZpbGUsXG4gIHdyaXRlRmlsZVN5bmM6IHdyaXRlRmlsZVN5bmNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBqc29uZmlsZVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcbmNvbnN0IGpzb25GaWxlID0gcmVxdWlyZSgnanNvbmZpbGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8ganNvbmZpbGUgZXhwb3J0c1xuICByZWFkSnNvbjogdShqc29uRmlsZS5yZWFkRmlsZSksXG4gIHJlYWRKc29uU3luYzoganNvbkZpbGUucmVhZEZpbGVTeW5jLFxuICB3cml0ZUpzb246IHUoanNvbkZpbGUud3JpdGVGaWxlKSxcbiAgd3JpdGVKc29uU3luYzoganNvbkZpbGUud3JpdGVGaWxlU3luY1xufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IG1rZGlyID0gcmVxdWlyZSgnLi4vbWtkaXJzJylcbmNvbnN0IHBhdGhFeGlzdHMgPSByZXF1aXJlKCcuLi9wYXRoLWV4aXN0cycpLnBhdGhFeGlzdHNcbmNvbnN0IGpzb25GaWxlID0gcmVxdWlyZSgnLi9qc29uZmlsZScpXG5cbmZ1bmN0aW9uIG91dHB1dEpzb24gKGZpbGUsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG5cbiAgcGF0aEV4aXN0cyhkaXIsIChlcnIsIGl0RG9lcykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgaWYgKGl0RG9lcykgcmV0dXJuIGpzb25GaWxlLndyaXRlSnNvbihmaWxlLCBkYXRhLCBvcHRpb25zLCBjYWxsYmFjaylcblxuICAgIG1rZGlyLm1rZGlycyhkaXIsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKVxuICAgICAganNvbkZpbGUud3JpdGVKc29uKGZpbGUsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgIH0pXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3V0cHV0SnNvblxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgbWtkaXIgPSByZXF1aXJlKCcuLi9ta2RpcnMnKVxuY29uc3QganNvbkZpbGUgPSByZXF1aXJlKCcuL2pzb25maWxlJylcblxuZnVuY3Rpb24gb3V0cHV0SnNvblN5bmMgKGZpbGUsIGRhdGEsIG9wdGlvbnMpIHtcbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGUpXG5cbiAgaWYgKCFmcy5leGlzdHNTeW5jKGRpcikpIHtcbiAgICBta2Rpci5ta2RpcnNTeW5jKGRpcilcbiAgfVxuXG4gIGpzb25GaWxlLndyaXRlSnNvblN5bmMoZmlsZSwgZGF0YSwgb3B0aW9ucylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdXRwdXRKc29uU3luY1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHUgPSByZXF1aXJlKCd1bml2ZXJzYWxpZnknKS5mcm9tQ2FsbGJhY2tcbmNvbnN0IGpzb25GaWxlID0gcmVxdWlyZSgnLi9qc29uZmlsZScpXG5cbmpzb25GaWxlLm91dHB1dEpzb24gPSB1KHJlcXVpcmUoJy4vb3V0cHV0LWpzb24nKSlcbmpzb25GaWxlLm91dHB1dEpzb25TeW5jID0gcmVxdWlyZSgnLi9vdXRwdXQtanNvbi1zeW5jJylcbi8vIGFsaWFzZXNcbmpzb25GaWxlLm91dHB1dEpTT04gPSBqc29uRmlsZS5vdXRwdXRKc29uXG5qc29uRmlsZS5vdXRwdXRKU09OU3luYyA9IGpzb25GaWxlLm91dHB1dEpzb25TeW5jXG5qc29uRmlsZS53cml0ZUpTT04gPSBqc29uRmlsZS53cml0ZUpzb25cbmpzb25GaWxlLndyaXRlSlNPTlN5bmMgPSBqc29uRmlsZS53cml0ZUpzb25TeW5jXG5qc29uRmlsZS5yZWFkSlNPTiA9IGpzb25GaWxlLnJlYWRKc29uXG5qc29uRmlsZS5yZWFkSlNPTlN5bmMgPSBqc29uRmlsZS5yZWFkSnNvblN5bmNcblxubW9kdWxlLmV4cG9ydHMgPSBqc29uRmlsZVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZ3JhY2VmdWwtZnMnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgY29weVN5bmMgPSByZXF1aXJlKCcuLi9jb3B5LXN5bmMnKS5jb3B5U3luY1xuY29uc3QgcmVtb3ZlU3luYyA9IHJlcXVpcmUoJy4uL3JlbW92ZScpLnJlbW92ZVN5bmNcbmNvbnN0IG1rZGlycFN5bmMgPSByZXF1aXJlKCcuLi9ta2RpcnMnKS5ta2RpcnBTeW5jXG5jb25zdCBzdGF0ID0gcmVxdWlyZSgnLi4vdXRpbC9zdGF0JylcblxuZnVuY3Rpb24gbW92ZVN5bmMgKHNyYywgZGVzdCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuICBjb25zdCBvdmVyd3JpdGUgPSBvcHRzLm92ZXJ3cml0ZSB8fCBvcHRzLmNsb2JiZXIgfHwgZmFsc2VcblxuICBjb25zdCB7IHNyY1N0YXQgfSA9IHN0YXQuY2hlY2tQYXRoc1N5bmMoc3JjLCBkZXN0LCAnbW92ZScpXG4gIHN0YXQuY2hlY2tQYXJlbnRQYXRoc1N5bmMoc3JjLCBzcmNTdGF0LCBkZXN0LCAnbW92ZScpXG4gIG1rZGlycFN5bmMocGF0aC5kaXJuYW1lKGRlc3QpKVxuICByZXR1cm4gZG9SZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG59XG5cbmZ1bmN0aW9uIGRvUmVuYW1lIChzcmMsIGRlc3QsIG92ZXJ3cml0ZSkge1xuICBpZiAob3ZlcndyaXRlKSB7XG4gICAgcmVtb3ZlU3luYyhkZXN0KVxuICAgIHJldHVybiByZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG4gIH1cbiAgaWYgKGZzLmV4aXN0c1N5bmMoZGVzdCkpIHRocm93IG5ldyBFcnJvcignZGVzdCBhbHJlYWR5IGV4aXN0cy4nKVxuICByZXR1cm4gcmVuYW1lKHNyYywgZGVzdCwgb3ZlcndyaXRlKVxufVxuXG5mdW5jdGlvbiByZW5hbWUgKHNyYywgZGVzdCwgb3ZlcndyaXRlKSB7XG4gIHRyeSB7XG4gICAgZnMucmVuYW1lU3luYyhzcmMsIGRlc3QpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIuY29kZSAhPT0gJ0VYREVWJykgdGhyb3cgZXJyXG4gICAgcmV0dXJuIG1vdmVBY3Jvc3NEZXZpY2Uoc3JjLCBkZXN0LCBvdmVyd3JpdGUpXG4gIH1cbn1cblxuZnVuY3Rpb24gbW92ZUFjcm9zc0RldmljZSAoc3JjLCBkZXN0LCBvdmVyd3JpdGUpIHtcbiAgY29uc3Qgb3B0cyA9IHtcbiAgICBvdmVyd3JpdGUsXG4gICAgZXJyb3JPbkV4aXN0OiB0cnVlXG4gIH1cbiAgY29weVN5bmMoc3JjLCBkZXN0LCBvcHRzKVxuICByZXR1cm4gcmVtb3ZlU3luYyhzcmMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW92ZVN5bmNcbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbW92ZVN5bmM6IHJlcXVpcmUoJy4vbW92ZS1zeW5jJylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGNvcHkgPSByZXF1aXJlKCcuLi9jb3B5JykuY29weVxuY29uc3QgcmVtb3ZlID0gcmVxdWlyZSgnLi4vcmVtb3ZlJykucmVtb3ZlXG5jb25zdCBta2RpcnAgPSByZXF1aXJlKCcuLi9ta2RpcnMnKS5ta2RpcnBcbmNvbnN0IHBhdGhFeGlzdHMgPSByZXF1aXJlKCcuLi9wYXRoLWV4aXN0cycpLnBhdGhFeGlzdHNcbmNvbnN0IHN0YXQgPSByZXF1aXJlKCcuLi91dGlsL3N0YXQnKVxuXG5mdW5jdGlvbiBtb3ZlIChzcmMsIGRlc3QsIG9wdHMsIGNiKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gb3B0c1xuICAgIG9wdHMgPSB7fVxuICB9XG5cbiAgY29uc3Qgb3ZlcndyaXRlID0gb3B0cy5vdmVyd3JpdGUgfHwgb3B0cy5jbG9iYmVyIHx8IGZhbHNlXG5cbiAgc3RhdC5jaGVja1BhdGhzKHNyYywgZGVzdCwgJ21vdmUnLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgY29uc3QgeyBzcmNTdGF0IH0gPSBzdGF0c1xuICAgIHN0YXQuY2hlY2tQYXJlbnRQYXRocyhzcmMsIHNyY1N0YXQsIGRlc3QsICdtb3ZlJywgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG4gICAgICBta2RpcnAocGF0aC5kaXJuYW1lKGRlc3QpLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgICByZXR1cm4gZG9SZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUsIGNiKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBkb1JlbmFtZSAoc3JjLCBkZXN0LCBvdmVyd3JpdGUsIGNiKSB7XG4gIGlmIChvdmVyd3JpdGUpIHtcbiAgICByZXR1cm4gcmVtb3ZlKGRlc3QsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgICAgcmV0dXJuIHJlbmFtZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSwgY2IpXG4gICAgfSlcbiAgfVxuICBwYXRoRXhpc3RzKGRlc3QsIChlcnIsIGRlc3RFeGlzdHMpID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIGlmIChkZXN0RXhpc3RzKSByZXR1cm4gY2IobmV3IEVycm9yKCdkZXN0IGFscmVhZHkgZXhpc3RzLicpKVxuICAgIHJldHVybiByZW5hbWUoc3JjLCBkZXN0LCBvdmVyd3JpdGUsIGNiKVxuICB9KVxufVxuXG5mdW5jdGlvbiByZW5hbWUgKHNyYywgZGVzdCwgb3ZlcndyaXRlLCBjYikge1xuICBmcy5yZW5hbWUoc3JjLCBkZXN0LCBlcnIgPT4ge1xuICAgIGlmICghZXJyKSByZXR1cm4gY2IoKVxuICAgIGlmIChlcnIuY29kZSAhPT0gJ0VYREVWJykgcmV0dXJuIGNiKGVycilcbiAgICByZXR1cm4gbW92ZUFjcm9zc0RldmljZShzcmMsIGRlc3QsIG92ZXJ3cml0ZSwgY2IpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG1vdmVBY3Jvc3NEZXZpY2UgKHNyYywgZGVzdCwgb3ZlcndyaXRlLCBjYikge1xuICBjb25zdCBvcHRzID0ge1xuICAgIG92ZXJ3cml0ZSxcbiAgICBlcnJvck9uRXhpc3Q6IHRydWVcbiAgfVxuICBjb3B5KHNyYywgZGVzdCwgb3B0cywgZXJyID0+IHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuICAgIHJldHVybiByZW1vdmUoc3JjLCBjYilcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtb3ZlXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1vdmU6IHUocmVxdWlyZSgnLi9tb3ZlJykpXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgdSA9IHJlcXVpcmUoJ3VuaXZlcnNhbGlmeScpLmZyb21DYWxsYmFja1xuY29uc3QgZnMgPSByZXF1aXJlKCdncmFjZWZ1bC1mcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBta2RpciA9IHJlcXVpcmUoJy4uL21rZGlycycpXG5jb25zdCBwYXRoRXhpc3RzID0gcmVxdWlyZSgnLi4vcGF0aC1leGlzdHMnKS5wYXRoRXhpc3RzXG5cbmZ1bmN0aW9uIG91dHB1dEZpbGUgKGZpbGUsIGRhdGEsIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSlcbiAgcGF0aEV4aXN0cyhkaXIsIChlcnIsIGl0RG9lcykgPT4ge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgaWYgKGl0RG9lcykgcmV0dXJuIGZzLndyaXRlRmlsZShmaWxlLCBkYXRhLCBlbmNvZGluZywgY2FsbGJhY2spXG5cbiAgICBta2Rpci5ta2RpcnMoZGlyLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycilcblxuICAgICAgZnMud3JpdGVGaWxlKGZpbGUsIGRhdGEsIGVuY29kaW5nLCBjYWxsYmFjaylcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBvdXRwdXRGaWxlU3luYyAoZmlsZSwgLi4uYXJncykge1xuICBjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZSlcbiAgaWYgKGZzLmV4aXN0c1N5bmMoZGlyKSkge1xuICAgIHJldHVybiBmcy53cml0ZUZpbGVTeW5jKGZpbGUsIC4uLmFyZ3MpXG4gIH1cbiAgbWtkaXIubWtkaXJzU3luYyhkaXIpXG4gIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgLi4uYXJncylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG91dHB1dEZpbGU6IHUob3V0cHV0RmlsZSksXG4gIG91dHB1dEZpbGVTeW5jXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKFxuICB7fSxcbiAgLy8gRXhwb3J0IHByb21pc2VpZmllZCBncmFjZWZ1bC1mczpcbiAgcmVxdWlyZSgnLi9mcycpLFxuICAvLyBFeHBvcnQgZXh0cmEgbWV0aG9kczpcbiAgcmVxdWlyZSgnLi9jb3B5LXN5bmMnKSxcbiAgcmVxdWlyZSgnLi9jb3B5JyksXG4gIHJlcXVpcmUoJy4vZW1wdHknKSxcbiAgcmVxdWlyZSgnLi9lbnN1cmUnKSxcbiAgcmVxdWlyZSgnLi9qc29uJyksXG4gIHJlcXVpcmUoJy4vbWtkaXJzJyksXG4gIHJlcXVpcmUoJy4vbW92ZS1zeW5jJyksXG4gIHJlcXVpcmUoJy4vbW92ZScpLFxuICByZXF1aXJlKCcuL291dHB1dCcpLFxuICByZXF1aXJlKCcuL3BhdGgtZXhpc3RzJyksXG4gIHJlcXVpcmUoJy4vcmVtb3ZlJylcbilcblxuLy8gRXhwb3J0IGZzLnByb21pc2VzIGFzIGEgZ2V0dGVyIHByb3BlcnR5IHNvIHRoYXQgd2UgZG9uJ3QgdHJpZ2dlclxuLy8gRXhwZXJpbWVudGFsV2FybmluZyBiZWZvcmUgZnMucHJvbWlzZXMgaXMgYWN0dWFsbHkgYWNjZXNzZWQuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbmlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZzLCAncHJvbWlzZXMnKSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLmV4cG9ydHMsICdwcm9taXNlcycsIHtcbiAgICBnZXQgKCkgeyByZXR1cm4gZnMucHJvbWlzZXMgfVxuICB9KVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgV0lOX1NMQVNIID0gJ1xcXFxcXFxcLyc7XG5jb25zdCBXSU5fTk9fU0xBU0ggPSBgW14ke1dJTl9TTEFTSH1dYDtcblxuLyoqXG4gKiBQb3NpeCBnbG9iIHJlZ2V4XG4gKi9cblxuY29uc3QgRE9UX0xJVEVSQUwgPSAnXFxcXC4nO1xuY29uc3QgUExVU19MSVRFUkFMID0gJ1xcXFwrJztcbmNvbnN0IFFNQVJLX0xJVEVSQUwgPSAnXFxcXD8nO1xuY29uc3QgU0xBU0hfTElURVJBTCA9ICdcXFxcLyc7XG5jb25zdCBPTkVfQ0hBUiA9ICcoPz0uKSc7XG5jb25zdCBRTUFSSyA9ICdbXi9dJztcbmNvbnN0IEVORF9BTkNIT1IgPSBgKD86JHtTTEFTSF9MSVRFUkFMfXwkKWA7XG5jb25zdCBTVEFSVF9BTkNIT1IgPSBgKD86Xnwke1NMQVNIX0xJVEVSQUx9KWA7XG5jb25zdCBET1RTX1NMQVNIID0gYCR7RE9UX0xJVEVSQUx9ezEsMn0ke0VORF9BTkNIT1J9YDtcbmNvbnN0IE5PX0RPVCA9IGAoPyEke0RPVF9MSVRFUkFMfSlgO1xuY29uc3QgTk9fRE9UUyA9IGAoPyEke1NUQVJUX0FOQ0hPUn0ke0RPVFNfU0xBU0h9KWA7XG5jb25zdCBOT19ET1RfU0xBU0ggPSBgKD8hJHtET1RfTElURVJBTH17MCwxfSR7RU5EX0FOQ0hPUn0pYDtcbmNvbnN0IE5PX0RPVFNfU0xBU0ggPSBgKD8hJHtET1RTX1NMQVNIfSlgO1xuY29uc3QgUU1BUktfTk9fRE9UID0gYFteLiR7U0xBU0hfTElURVJBTH1dYDtcbmNvbnN0IFNUQVIgPSBgJHtRTUFSS30qP2A7XG5cbmNvbnN0IFBPU0lYX0NIQVJTID0ge1xuICBET1RfTElURVJBTCxcbiAgUExVU19MSVRFUkFMLFxuICBRTUFSS19MSVRFUkFMLFxuICBTTEFTSF9MSVRFUkFMLFxuICBPTkVfQ0hBUixcbiAgUU1BUkssXG4gIEVORF9BTkNIT1IsXG4gIERPVFNfU0xBU0gsXG4gIE5PX0RPVCxcbiAgTk9fRE9UUyxcbiAgTk9fRE9UX1NMQVNILFxuICBOT19ET1RTX1NMQVNILFxuICBRTUFSS19OT19ET1QsXG4gIFNUQVIsXG4gIFNUQVJUX0FOQ0hPUlxufTtcblxuLyoqXG4gKiBXaW5kb3dzIGdsb2IgcmVnZXhcbiAqL1xuXG5jb25zdCBXSU5ET1dTX0NIQVJTID0ge1xuICAuLi5QT1NJWF9DSEFSUyxcblxuICBTTEFTSF9MSVRFUkFMOiBgWyR7V0lOX1NMQVNIfV1gLFxuICBRTUFSSzogV0lOX05PX1NMQVNILFxuICBTVEFSOiBgJHtXSU5fTk9fU0xBU0h9Kj9gLFxuICBET1RTX1NMQVNIOiBgJHtET1RfTElURVJBTH17MSwyfSg/Olske1dJTl9TTEFTSH1dfCQpYCxcbiAgTk9fRE9UOiBgKD8hJHtET1RfTElURVJBTH0pYCxcbiAgTk9fRE9UUzogYCg/ISg/Ol58WyR7V0lOX1NMQVNIfV0pJHtET1RfTElURVJBTH17MSwyfSg/Olske1dJTl9TTEFTSH1dfCQpKWAsXG4gIE5PX0RPVF9TTEFTSDogYCg/ISR7RE9UX0xJVEVSQUx9ezAsMX0oPzpbJHtXSU5fU0xBU0h9XXwkKSlgLFxuICBOT19ET1RTX1NMQVNIOiBgKD8hJHtET1RfTElURVJBTH17MSwyfSg/Olske1dJTl9TTEFTSH1dfCQpKWAsXG4gIFFNQVJLX05PX0RPVDogYFteLiR7V0lOX1NMQVNIfV1gLFxuICBTVEFSVF9BTkNIT1I6IGAoPzpefFske1dJTl9TTEFTSH1dKWAsXG4gIEVORF9BTkNIT1I6IGAoPzpbJHtXSU5fU0xBU0h9XXwkKWBcbn07XG5cbi8qKlxuICogUE9TSVggQnJhY2tldCBSZWdleFxuICovXG5cbmNvbnN0IFBPU0lYX1JFR0VYX1NPVVJDRSA9IHtcbiAgYWxudW06ICdhLXpBLVowLTknLFxuICBhbHBoYTogJ2EtekEtWicsXG4gIGFzY2lpOiAnXFxcXHgwMC1cXFxceDdGJyxcbiAgYmxhbms6ICcgXFxcXHQnLFxuICBjbnRybDogJ1xcXFx4MDAtXFxcXHgxRlxcXFx4N0YnLFxuICBkaWdpdDogJzAtOScsXG4gIGdyYXBoOiAnXFxcXHgyMS1cXFxceDdFJyxcbiAgbG93ZXI6ICdhLXonLFxuICBwcmludDogJ1xcXFx4MjAtXFxcXHg3RSAnLFxuICBwdW5jdDogJ1xcXFwtIVwiIyQlJlxcJygpXFxcXCorLC4vOjs8PT4/QFtcXFxcXV5fYHt8fX4nLFxuICBzcGFjZTogJyBcXFxcdFxcXFxyXFxcXG5cXFxcdlxcXFxmJyxcbiAgdXBwZXI6ICdBLVonLFxuICB3b3JkOiAnQS1aYS16MC05XycsXG4gIHhkaWdpdDogJ0EtRmEtZjAtOSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNQVhfTEVOR1RIOiAxMDI0ICogNjQsXG4gIFBPU0lYX1JFR0VYX1NPVVJDRSxcblxuICAvLyByZWd1bGFyIGV4cHJlc3Npb25zXG4gIFJFR0VYX0JBQ0tTTEFTSDogL1xcXFwoPyFbKis/XiR7fSh8KVtcXF1dKS9nLFxuICBSRUdFWF9OT05fU1BFQ0lBTF9DSEFSUzogL15bXkAhW1xcXS4sJCorP157fSgpfFxcXFwvXSsvLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTOiAvWy0qKz8uXiR7fSh8KVtcXF1dLyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19CQUNLUkVGOiAvKFxcXFw/KSgoXFxXKShcXDMqKSkvZyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19HTE9CQUw6IC8oWy0qKz8uXiR7fSh8KVtcXF1dKS9nLFxuICBSRUdFWF9SRU1PVkVfQkFDS1NMQVNIOiAvKD86XFxbLio/W15cXFxcXVxcXXxcXFxcKD89LikpL2csXG5cbiAgLy8gUmVwbGFjZSBnbG9icyB3aXRoIGVxdWl2YWxlbnQgcGF0dGVybnMgdG8gcmVkdWNlIHBhcnNpbmcgdGltZS5cbiAgUkVQTEFDRU1FTlRTOiB7XG4gICAgJyoqKic6ICcqJyxcbiAgICAnKiovKionOiAnKionLFxuICAgICcqKi8qKi8qKic6ICcqKidcbiAgfSxcblxuICAvLyBEaWdpdHNcbiAgQ0hBUl8wOiA0OCwgLyogMCAqL1xuICBDSEFSXzk6IDU3LCAvKiA5ICovXG5cbiAgLy8gQWxwaGFiZXQgY2hhcnMuXG4gIENIQVJfVVBQRVJDQVNFX0E6IDY1LCAvKiBBICovXG4gIENIQVJfTE9XRVJDQVNFX0E6IDk3LCAvKiBhICovXG4gIENIQVJfVVBQRVJDQVNFX1o6IDkwLCAvKiBaICovXG4gIENIQVJfTE9XRVJDQVNFX1o6IDEyMiwgLyogeiAqL1xuXG4gIENIQVJfTEVGVF9QQVJFTlRIRVNFUzogNDAsIC8qICggKi9cbiAgQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUzogNDEsIC8qICkgKi9cblxuICBDSEFSX0FTVEVSSVNLOiA0MiwgLyogKiAqL1xuXG4gIC8vIE5vbi1hbHBoYWJldGljIGNoYXJzLlxuICBDSEFSX0FNUEVSU0FORDogMzgsIC8qICYgKi9cbiAgQ0hBUl9BVDogNjQsIC8qIEAgKi9cbiAgQ0hBUl9CQUNLV0FSRF9TTEFTSDogOTIsIC8qIFxcICovXG4gIENIQVJfQ0FSUklBR0VfUkVUVVJOOiAxMywgLyogXFxyICovXG4gIENIQVJfQ0lSQ1VNRkxFWF9BQ0NFTlQ6IDk0LCAvKiBeICovXG4gIENIQVJfQ09MT046IDU4LCAvKiA6ICovXG4gIENIQVJfQ09NTUE6IDQ0LCAvKiAsICovXG4gIENIQVJfRE9UOiA0NiwgLyogLiAqL1xuICBDSEFSX0RPVUJMRV9RVU9URTogMzQsIC8qIFwiICovXG4gIENIQVJfRVFVQUw6IDYxLCAvKiA9ICovXG4gIENIQVJfRVhDTEFNQVRJT05fTUFSSzogMzMsIC8qICEgKi9cbiAgQ0hBUl9GT1JNX0ZFRUQ6IDEyLCAvKiBcXGYgKi9cbiAgQ0hBUl9GT1JXQVJEX1NMQVNIOiA0NywgLyogLyAqL1xuICBDSEFSX0dSQVZFX0FDQ0VOVDogOTYsIC8qIGAgKi9cbiAgQ0hBUl9IQVNIOiAzNSwgLyogIyAqL1xuICBDSEFSX0hZUEhFTl9NSU5VUzogNDUsIC8qIC0gKi9cbiAgQ0hBUl9MRUZUX0FOR0xFX0JSQUNLRVQ6IDYwLCAvKiA8ICovXG4gIENIQVJfTEVGVF9DVVJMWV9CUkFDRTogMTIzLCAvKiB7ICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVDogOTEsIC8qIFsgKi9cbiAgQ0hBUl9MSU5FX0ZFRUQ6IDEwLCAvKiBcXG4gKi9cbiAgQ0hBUl9OT19CUkVBS19TUEFDRTogMTYwLCAvKiBcXHUwMEEwICovXG4gIENIQVJfUEVSQ0VOVDogMzcsIC8qICUgKi9cbiAgQ0hBUl9QTFVTOiA0MywgLyogKyAqL1xuICBDSEFSX1FVRVNUSU9OX01BUks6IDYzLCAvKiA/ICovXG4gIENIQVJfUklHSFRfQU5HTEVfQlJBQ0tFVDogNjIsIC8qID4gKi9cbiAgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRTogMTI1LCAvKiB9ICovXG4gIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQ6IDkzLCAvKiBdICovXG4gIENIQVJfU0VNSUNPTE9OOiA1OSwgLyogOyAqL1xuICBDSEFSX1NJTkdMRV9RVU9URTogMzksIC8qICcgKi9cbiAgQ0hBUl9TUEFDRTogMzIsIC8qICAgKi9cbiAgQ0hBUl9UQUI6IDksIC8qIFxcdCAqL1xuICBDSEFSX1VOREVSU0NPUkU6IDk1LCAvKiBfICovXG4gIENIQVJfVkVSVElDQUxfTElORTogMTI0LCAvKiB8ICovXG4gIENIQVJfWkVST19XSURUSF9OT0JSRUFLX1NQQUNFOiA2NTI3OSwgLyogXFx1RkVGRiAqL1xuXG4gIFNFUDogcGF0aC5zZXAsXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBFWFRHTE9CX0NIQVJTXG4gICAqL1xuXG4gIGV4dGdsb2JDaGFycyhjaGFycykge1xuICAgIHJldHVybiB7XG4gICAgICAnISc6IHsgdHlwZTogJ25lZ2F0ZScsIG9wZW46ICcoPzooPyEoPzonLCBjbG9zZTogYCkpJHtjaGFycy5TVEFSfSlgIH0sXG4gICAgICAnPyc6IHsgdHlwZTogJ3FtYXJrJywgb3BlbjogJyg/OicsIGNsb3NlOiAnKT8nIH0sXG4gICAgICAnKyc6IHsgdHlwZTogJ3BsdXMnLCBvcGVuOiAnKD86JywgY2xvc2U6ICcpKycgfSxcbiAgICAgICcqJzogeyB0eXBlOiAnc3RhcicsIG9wZW46ICcoPzonLCBjbG9zZTogJykqJyB9LFxuICAgICAgJ0AnOiB7IHR5cGU6ICdhdCcsIG9wZW46ICcoPzonLCBjbG9zZTogJyknIH1cbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgR0xPQl9DSEFSU1xuICAgKi9cblxuICBnbG9iQ2hhcnMod2luMzIpIHtcbiAgICByZXR1cm4gd2luMzIgPT09IHRydWUgPyBXSU5ET1dTX0NIQVJTIDogUE9TSVhfQ0hBUlM7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB3aW4zMiA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG5jb25zdCB7XG4gIFJFR0VYX0JBQ0tTTEFTSCxcbiAgUkVHRVhfUkVNT1ZFX0JBQ0tTTEFTSCxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSUyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19HTE9CQUxcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5leHBvcnRzLmlzT2JqZWN0ID0gdmFsID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuZXhwb3J0cy5oYXNSZWdleENoYXJzID0gc3RyID0+IFJFR0VYX1NQRUNJQUxfQ0hBUlMudGVzdChzdHIpO1xuZXhwb3J0cy5pc1JlZ2V4Q2hhciA9IHN0ciA9PiBzdHIubGVuZ3RoID09PSAxICYmIGV4cG9ydHMuaGFzUmVnZXhDaGFycyhzdHIpO1xuZXhwb3J0cy5lc2NhcGVSZWdleCA9IHN0ciA9PiBzdHIucmVwbGFjZShSRUdFWF9TUEVDSUFMX0NIQVJTX0dMT0JBTCwgJ1xcXFwkMScpO1xuZXhwb3J0cy50b1Bvc2l4U2xhc2hlcyA9IHN0ciA9PiBzdHIucmVwbGFjZShSRUdFWF9CQUNLU0xBU0gsICcvJyk7XG5cbmV4cG9ydHMucmVtb3ZlQmFja3NsYXNoZXMgPSBzdHIgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoUkVHRVhfUkVNT1ZFX0JBQ0tTTEFTSCwgbWF0Y2ggPT4ge1xuICAgIHJldHVybiBtYXRjaCA9PT0gJ1xcXFwnID8gJycgOiBtYXRjaDtcbiAgfSk7XG59O1xuXG5leHBvcnRzLnN1cHBvcnRzTG9va2JlaGluZHMgPSAoKSA9PiB7XG4gIGNvbnN0IHNlZ3MgPSBwcm9jZXNzLnZlcnNpb24uc2xpY2UoMSkuc3BsaXQoJy4nKS5tYXAoTnVtYmVyKTtcbiAgaWYgKHNlZ3MubGVuZ3RoID09PSAzICYmIHNlZ3NbMF0gPj0gOSB8fCAoc2Vnc1swXSA9PT0gOCAmJiBzZWdzWzFdID49IDEwKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydHMuaXNXaW5kb3dzID0gb3B0aW9ucyA9PiB7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLndpbmRvd3MgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBvcHRpb25zLndpbmRvd3M7XG4gIH1cbiAgcmV0dXJuIHdpbjMyID09PSB0cnVlIHx8IHBhdGguc2VwID09PSAnXFxcXCc7XG59O1xuXG5leHBvcnRzLmVzY2FwZUxhc3QgPSAoaW5wdXQsIGNoYXIsIGxhc3RJZHgpID0+IHtcbiAgY29uc3QgaWR4ID0gaW5wdXQubGFzdEluZGV4T2YoY2hhciwgbGFzdElkeCk7XG4gIGlmIChpZHggPT09IC0xKSByZXR1cm4gaW5wdXQ7XG4gIGlmIChpbnB1dFtpZHggLSAxXSA9PT0gJ1xcXFwnKSByZXR1cm4gZXhwb3J0cy5lc2NhcGVMYXN0KGlucHV0LCBjaGFyLCBpZHggLSAxKTtcbiAgcmV0dXJuIGAke2lucHV0LnNsaWNlKDAsIGlkeCl9XFxcXCR7aW5wdXQuc2xpY2UoaWR4KX1gO1xufTtcblxuZXhwb3J0cy5yZW1vdmVQcmVmaXggPSAoaW5wdXQsIHN0YXRlID0ge30pID0+IHtcbiAgbGV0IG91dHB1dCA9IGlucHV0O1xuICBpZiAob3V0cHV0LnN0YXJ0c1dpdGgoJy4vJykpIHtcbiAgICBvdXRwdXQgPSBvdXRwdXQuc2xpY2UoMik7XG4gICAgc3RhdGUucHJlZml4ID0gJy4vJztcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufTtcblxuZXhwb3J0cy53cmFwT3V0cHV0ID0gKGlucHV0LCBzdGF0ZSA9IHt9LCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgcHJlcGVuZCA9IG9wdGlvbnMuY29udGFpbnMgPyAnJyA6ICdeJztcbiAgY29uc3QgYXBwZW5kID0gb3B0aW9ucy5jb250YWlucyA/ICcnIDogJyQnO1xuXG4gIGxldCBvdXRwdXQgPSBgJHtwcmVwZW5kfSg/OiR7aW5wdXR9KSR7YXBwZW5kfWA7XG4gIGlmIChzdGF0ZS5uZWdhdGVkID09PSB0cnVlKSB7XG4gICAgb3V0cHV0ID0gYCg/Ol4oPyEke291dHB1dH0pLiokKWA7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3Qge1xuICBDSEFSX0FTVEVSSVNLLCAgICAgICAgICAgICAvKiAqICovXG4gIENIQVJfQVQsICAgICAgICAgICAgICAgICAgIC8qIEAgKi9cbiAgQ0hBUl9CQUNLV0FSRF9TTEFTSCwgICAgICAgLyogXFwgKi9cbiAgQ0hBUl9DT01NQSwgICAgICAgICAgICAgICAgLyogLCAqL1xuICBDSEFSX0RPVCwgICAgICAgICAgICAgICAgICAvKiAuICovXG4gIENIQVJfRVhDTEFNQVRJT05fTUFSSywgICAgIC8qICEgKi9cbiAgQ0hBUl9GT1JXQVJEX1NMQVNILCAgICAgICAgLyogLyAqL1xuICBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UsICAgICAvKiB7ICovXG4gIENIQVJfTEVGVF9QQVJFTlRIRVNFUywgICAgIC8qICggKi9cbiAgQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VULCAgLyogWyAqL1xuICBDSEFSX1BMVVMsICAgICAgICAgICAgICAgICAvKiArICovXG4gIENIQVJfUVVFU1RJT05fTUFSSywgICAgICAgIC8qID8gKi9cbiAgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRSwgICAgLyogfSAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTLCAgICAvKiApICovXG4gIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQgIC8qIF0gKi9cbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5jb25zdCBpc1BhdGhTZXBhcmF0b3IgPSBjb2RlID0+IHtcbiAgcmV0dXJuIGNvZGUgPT09IENIQVJfRk9SV0FSRF9TTEFTSCB8fCBjb2RlID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIO1xufTtcblxuY29uc3QgZGVwdGggPSB0b2tlbiA9PiB7XG4gIGlmICh0b2tlbi5pc1ByZWZpeCAhPT0gdHJ1ZSkge1xuICAgIHRva2VuLmRlcHRoID0gdG9rZW4uaXNHbG9ic3RhciA/IEluZmluaXR5IDogMTtcbiAgfVxufTtcblxuLyoqXG4gKiBRdWlja2x5IHNjYW5zIGEgZ2xvYiBwYXR0ZXJuIGFuZCByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgaGFuZGZ1bCBvZlxuICogdXNlZnVsIHByb3BlcnRpZXMsIGxpa2UgYGlzR2xvYmAsIGBwYXRoYCAodGhlIGxlYWRpbmcgbm9uLWdsb2IsIGlmIGl0IGV4aXN0cyksXG4gKiBgZ2xvYmAgKHRoZSBhY3R1YWwgcGF0dGVybiksIGBuZWdhdGVkYCAodHJ1ZSBpZiB0aGUgcGF0aCBzdGFydHMgd2l0aCBgIWAgYnV0IG5vdFxuICogd2l0aCBgIShgKSBhbmQgYG5lZ2F0ZWRFeHRnbG9iYCAodHJ1ZSBpZiB0aGUgcGF0aCBzdGFydHMgd2l0aCBgIShgKS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcG0gPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIGNvbnNvbGUubG9nKHBtLnNjYW4oJ2Zvby9iYXIvKi5qcycpKTtcbiAqIHsgaXNHbG9iOiB0cnVlLCBpbnB1dDogJ2Zvby9iYXIvKi5qcycsIGJhc2U6ICdmb28vYmFyJywgZ2xvYjogJyouanMnIH1cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBzdHJgXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggdG9rZW5zIGFuZCByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBzY2FuID0gKGlucHV0LCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGNvbnN0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aCAtIDE7XG4gIGNvbnN0IHNjYW5Ub0VuZCA9IG9wdHMucGFydHMgPT09IHRydWUgfHwgb3B0cy5zY2FuVG9FbmQgPT09IHRydWU7XG4gIGNvbnN0IHNsYXNoZXMgPSBbXTtcbiAgY29uc3QgdG9rZW5zID0gW107XG4gIGNvbnN0IHBhcnRzID0gW107XG5cbiAgbGV0IHN0ciA9IGlucHV0O1xuICBsZXQgaW5kZXggPSAtMTtcbiAgbGV0IHN0YXJ0ID0gMDtcbiAgbGV0IGxhc3RJbmRleCA9IDA7XG4gIGxldCBpc0JyYWNlID0gZmFsc2U7XG4gIGxldCBpc0JyYWNrZXQgPSBmYWxzZTtcbiAgbGV0IGlzR2xvYiA9IGZhbHNlO1xuICBsZXQgaXNFeHRnbG9iID0gZmFsc2U7XG4gIGxldCBpc0dsb2JzdGFyID0gZmFsc2U7XG4gIGxldCBicmFjZUVzY2FwZWQgPSBmYWxzZTtcbiAgbGV0IGJhY2tzbGFzaGVzID0gZmFsc2U7XG4gIGxldCBuZWdhdGVkID0gZmFsc2U7XG4gIGxldCBuZWdhdGVkRXh0Z2xvYiA9IGZhbHNlO1xuICBsZXQgZmluaXNoZWQgPSBmYWxzZTtcbiAgbGV0IGJyYWNlcyA9IDA7XG4gIGxldCBwcmV2O1xuICBsZXQgY29kZTtcbiAgbGV0IHRva2VuID0geyB2YWx1ZTogJycsIGRlcHRoOiAwLCBpc0dsb2I6IGZhbHNlIH07XG5cbiAgY29uc3QgZW9zID0gKCkgPT4gaW5kZXggPj0gbGVuZ3RoO1xuICBjb25zdCBwZWVrID0gKCkgPT4gc3RyLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgY29uc3QgYWR2YW5jZSA9ICgpID0+IHtcbiAgICBwcmV2ID0gY29kZTtcbiAgICByZXR1cm4gc3RyLmNoYXJDb2RlQXQoKytpbmRleCk7XG4gIH07XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgY29kZSA9IGFkdmFuY2UoKTtcbiAgICBsZXQgbmV4dDtcblxuICAgIGlmIChjb2RlID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgIGNvZGUgPSBhZHZhbmNlKCk7XG5cbiAgICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgICAgYnJhY2VFc2NhcGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChicmFjZUVzY2FwZWQgPT09IHRydWUgfHwgY29kZSA9PT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNFKSB7XG4gICAgICBicmFjZXMrKztcblxuICAgICAgd2hpbGUgKGVvcygpICE9PSB0cnVlICYmIChjb2RlID0gYWR2YW5jZSgpKSkge1xuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgICAgIGJhY2tzbGFzaGVzID0gdG9rZW4uYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICAgIGFkdmFuY2UoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgICAgICBicmFjZXMrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChicmFjZUVzY2FwZWQgIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9ET1QgJiYgKGNvZGUgPSBhZHZhbmNlKCkpID09PSBDSEFSX0RPVCkge1xuICAgICAgICAgIGlzQnJhY2UgPSB0b2tlbi5pc0JyYWNlID0gdHJ1ZTtcbiAgICAgICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJyYWNlRXNjYXBlZCAhPT0gdHJ1ZSAmJiBjb2RlID09PSBDSEFSX0NPTU1BKSB7XG4gICAgICAgICAgaXNCcmFjZSA9IHRva2VuLmlzQnJhY2UgPSB0cnVlO1xuICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRSkge1xuICAgICAgICAgIGJyYWNlcy0tO1xuXG4gICAgICAgICAgaWYgKGJyYWNlcyA9PT0gMCkge1xuICAgICAgICAgICAgYnJhY2VFc2NhcGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpc0JyYWNlID0gdG9rZW4uaXNCcmFjZSA9IHRydWU7XG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IENIQVJfRk9SV0FSRF9TTEFTSCkge1xuICAgICAgc2xhc2hlcy5wdXNoKGluZGV4KTtcbiAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgIHRva2VuID0geyB2YWx1ZTogJycsIGRlcHRoOiAwLCBpc0dsb2I6IGZhbHNlIH07XG5cbiAgICAgIGlmIChmaW5pc2hlZCA9PT0gdHJ1ZSkgY29udGludWU7XG4gICAgICBpZiAocHJldiA9PT0gQ0hBUl9ET1QgJiYgaW5kZXggPT09IChzdGFydCArIDEpKSB7XG4gICAgICAgIHN0YXJ0ICs9IDI7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsYXN0SW5kZXggPSBpbmRleCArIDE7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5ub2V4dCAhPT0gdHJ1ZSkge1xuICAgICAgY29uc3QgaXNFeHRnbG9iQ2hhciA9IGNvZGUgPT09IENIQVJfUExVU1xuICAgICAgICB8fCBjb2RlID09PSBDSEFSX0FUXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfQVNURVJJU0tcbiAgICAgICAgfHwgY29kZSA9PT0gQ0hBUl9RVUVTVElPTl9NQVJLXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfRVhDTEFNQVRJT05fTUFSSztcblxuICAgICAgaWYgKGlzRXh0Z2xvYkNoYXIgPT09IHRydWUgJiYgcGVlaygpID09PSBDSEFSX0xFRlRfUEFSRU5USEVTRVMpIHtcbiAgICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgICAgaXNFeHRnbG9iID0gdG9rZW4uaXNFeHRnbG9iID0gdHJ1ZTtcbiAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9FWENMQU1BVElPTl9NQVJLICYmIGluZGV4ID09PSBzdGFydCkge1xuICAgICAgICAgIG5lZ2F0ZWRFeHRnbG9iID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKGNvZGUgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgY29kZSA9IGFkdmFuY2UoKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb2RlID09PSBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX0FTVEVSSVNLKSB7XG4gICAgICBpZiAocHJldiA9PT0gQ0hBUl9BU1RFUklTSykgaXNHbG9ic3RhciA9IHRva2VuLmlzR2xvYnN0YXIgPSB0cnVlO1xuICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX1FVRVNUSU9OX01BUkspIHtcbiAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICBmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKG5leHQgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICAgICAgYmFja3NsYXNoZXMgPSB0b2tlbi5iYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICAgICAgYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgICAgICBpc0JyYWNrZXQgPSB0b2tlbi5pc0JyYWNrZXQgPSB0cnVlO1xuICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChvcHRzLm5vbmVnYXRlICE9PSB0cnVlICYmIGNvZGUgPT09IENIQVJfRVhDTEFNQVRJT05fTUFSSyAmJiBpbmRleCA9PT0gc3RhcnQpIHtcbiAgICAgIG5lZ2F0ZWQgPSB0b2tlbi5uZWdhdGVkID0gdHJ1ZTtcbiAgICAgIHN0YXJ0Kys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5ub3BhcmVuICE9PSB0cnVlICYmIGNvZGUgPT09IENIQVJfTEVGVF9QQVJFTlRIRVNFUykge1xuICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKGNvZGUgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfTEVGVF9QQVJFTlRIRVNFUykge1xuICAgICAgICAgICAgYmFja3NsYXNoZXMgPSB0b2tlbi5iYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICAgICAgICBjb2RlID0gYWR2YW5jZSgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfUklHSFRfUEFSRU5USEVTRVMpIHtcbiAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChpc0dsb2IgPT09IHRydWUpIHtcbiAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdHMubm9leHQgPT09IHRydWUpIHtcbiAgICBpc0V4dGdsb2IgPSBmYWxzZTtcbiAgICBpc0dsb2IgPSBmYWxzZTtcbiAgfVxuXG4gIGxldCBiYXNlID0gc3RyO1xuICBsZXQgcHJlZml4ID0gJyc7XG4gIGxldCBnbG9iID0gJyc7XG5cbiAgaWYgKHN0YXJ0ID4gMCkge1xuICAgIHByZWZpeCA9IHN0ci5zbGljZSgwLCBzdGFydCk7XG4gICAgc3RyID0gc3RyLnNsaWNlKHN0YXJ0KTtcbiAgICBsYXN0SW5kZXggLT0gc3RhcnQ7XG4gIH1cblxuICBpZiAoYmFzZSAmJiBpc0dsb2IgPT09IHRydWUgJiYgbGFzdEluZGV4ID4gMCkge1xuICAgIGJhc2UgPSBzdHIuc2xpY2UoMCwgbGFzdEluZGV4KTtcbiAgICBnbG9iID0gc3RyLnNsaWNlKGxhc3RJbmRleCk7XG4gIH0gZWxzZSBpZiAoaXNHbG9iID09PSB0cnVlKSB7XG4gICAgYmFzZSA9ICcnO1xuICAgIGdsb2IgPSBzdHI7XG4gIH0gZWxzZSB7XG4gICAgYmFzZSA9IHN0cjtcbiAgfVxuXG4gIGlmIChiYXNlICYmIGJhc2UgIT09ICcnICYmIGJhc2UgIT09ICcvJyAmJiBiYXNlICE9PSBzdHIpIHtcbiAgICBpZiAoaXNQYXRoU2VwYXJhdG9yKGJhc2UuY2hhckNvZGVBdChiYXNlLmxlbmd0aCAtIDEpKSkge1xuICAgICAgYmFzZSA9IGJhc2Uuc2xpY2UoMCwgLTEpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRzLnVuZXNjYXBlID09PSB0cnVlKSB7XG4gICAgaWYgKGdsb2IpIGdsb2IgPSB1dGlscy5yZW1vdmVCYWNrc2xhc2hlcyhnbG9iKTtcblxuICAgIGlmIChiYXNlICYmIGJhY2tzbGFzaGVzID09PSB0cnVlKSB7XG4gICAgICBiYXNlID0gdXRpbHMucmVtb3ZlQmFja3NsYXNoZXMoYmFzZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgcHJlZml4LFxuICAgIGlucHV0LFxuICAgIHN0YXJ0LFxuICAgIGJhc2UsXG4gICAgZ2xvYixcbiAgICBpc0JyYWNlLFxuICAgIGlzQnJhY2tldCxcbiAgICBpc0dsb2IsXG4gICAgaXNFeHRnbG9iLFxuICAgIGlzR2xvYnN0YXIsXG4gICAgbmVnYXRlZCxcbiAgICBuZWdhdGVkRXh0Z2xvYlxuICB9O1xuXG4gIGlmIChvcHRzLnRva2VucyA9PT0gdHJ1ZSkge1xuICAgIHN0YXRlLm1heERlcHRoID0gMDtcbiAgICBpZiAoIWlzUGF0aFNlcGFyYXRvcihjb2RlKSkge1xuICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgIH1cbiAgICBzdGF0ZS50b2tlbnMgPSB0b2tlbnM7XG4gIH1cblxuICBpZiAob3B0cy5wYXJ0cyA9PT0gdHJ1ZSB8fCBvcHRzLnRva2VucyA9PT0gdHJ1ZSkge1xuICAgIGxldCBwcmV2SW5kZXg7XG5cbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBzbGFzaGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGNvbnN0IG4gPSBwcmV2SW5kZXggPyBwcmV2SW5kZXggKyAxIDogc3RhcnQ7XG4gICAgICBjb25zdCBpID0gc2xhc2hlc1tpZHhdO1xuICAgICAgY29uc3QgdmFsdWUgPSBpbnB1dC5zbGljZShuLCBpKTtcbiAgICAgIGlmIChvcHRzLnRva2Vucykge1xuICAgICAgICBpZiAoaWR4ID09PSAwICYmIHN0YXJ0ICE9PSAwKSB7XG4gICAgICAgICAgdG9rZW5zW2lkeF0uaXNQcmVmaXggPSB0cnVlO1xuICAgICAgICAgIHRva2Vuc1tpZHhdLnZhbHVlID0gcHJlZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRva2Vuc1tpZHhdLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGVwdGgodG9rZW5zW2lkeF0pO1xuICAgICAgICBzdGF0ZS5tYXhEZXB0aCArPSB0b2tlbnNbaWR4XS5kZXB0aDtcbiAgICAgIH1cbiAgICAgIGlmIChpZHggIT09IDAgfHwgdmFsdWUgIT09ICcnKSB7XG4gICAgICAgIHBhcnRzLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgICAgcHJldkluZGV4ID0gaTtcbiAgICB9XG5cbiAgICBpZiAocHJldkluZGV4ICYmIHByZXZJbmRleCArIDEgPCBpbnB1dC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXQuc2xpY2UocHJldkluZGV4ICsgMSk7XG4gICAgICBwYXJ0cy5wdXNoKHZhbHVlKTtcblxuICAgICAgaWYgKG9wdHMudG9rZW5zKSB7XG4gICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgZGVwdGgodG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXSk7XG4gICAgICAgIHN0YXRlLm1heERlcHRoICs9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0uZGVwdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGUuc2xhc2hlcyA9IHNsYXNoZXM7XG4gICAgc3RhdGUucGFydHMgPSBwYXJ0cztcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2NhbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIENvbnN0YW50c1xuICovXG5cbmNvbnN0IHtcbiAgTUFYX0xFTkdUSCxcbiAgUE9TSVhfUkVHRVhfU09VUkNFLFxuICBSRUdFWF9OT05fU1BFQ0lBTF9DSEFSUyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSU19CQUNLUkVGLFxuICBSRVBMQUNFTUVOVFNcbn0gPSBjb25zdGFudHM7XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5cbmNvbnN0IGV4cGFuZFJhbmdlID0gKGFyZ3MsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmV4cGFuZFJhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuZXhwYW5kUmFuZ2UoLi4uYXJncywgb3B0aW9ucyk7XG4gIH1cblxuICBhcmdzLnNvcnQoKTtcbiAgY29uc3QgdmFsdWUgPSBgWyR7YXJncy5qb2luKCctJyl9XWA7XG5cbiAgdHJ5IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3ICovXG4gICAgbmV3IFJlZ0V4cCh2YWx1ZSk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0dXJuIGFyZ3MubWFwKHYgPT4gdXRpbHMuZXNjYXBlUmVnZXgodikpLmpvaW4oJy4uJyk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbWVzc2FnZSBmb3IgYSBzeW50YXggZXJyb3JcbiAqL1xuXG5jb25zdCBzeW50YXhFcnJvciA9ICh0eXBlLCBjaGFyKSA9PiB7XG4gIHJldHVybiBgTWlzc2luZyAke3R5cGV9OiBcIiR7Y2hhcn1cIiAtIHVzZSBcIlxcXFxcXFxcJHtjaGFyfVwiIHRvIG1hdGNoIGxpdGVyYWwgY2hhcmFjdGVyc2A7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBpbnB1dCBzdHJpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuY29uc3QgcGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuICB9XG5cbiAgaW5wdXQgPSBSRVBMQUNFTUVOVFNbaW5wdXRdIHx8IGlucHV0O1xuXG4gIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgY29uc3QgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG5cbiAgbGV0IGxlbiA9IGlucHV0Lmxlbmd0aDtcbiAgaWYgKGxlbiA+IG1heCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW5wdXQgbGVuZ3RoOiAke2xlbn0sIGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIGxlbmd0aDogJHttYXh9YCk7XG4gIH1cblxuICBjb25zdCBib3MgPSB7IHR5cGU6ICdib3MnLCB2YWx1ZTogJycsIG91dHB1dDogb3B0cy5wcmVwZW5kIHx8ICcnIH07XG4gIGNvbnN0IHRva2VucyA9IFtib3NdO1xuXG4gIGNvbnN0IGNhcHR1cmUgPSBvcHRzLmNhcHR1cmUgPyAnJyA6ICc/Oic7XG4gIGNvbnN0IHdpbjMyID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuXG4gIC8vIGNyZWF0ZSBjb25zdGFudHMgYmFzZWQgb24gcGxhdGZvcm0sIGZvciB3aW5kb3dzIG9yIHBvc2l4XG4gIGNvbnN0IFBMQVRGT1JNX0NIQVJTID0gY29uc3RhbnRzLmdsb2JDaGFycyh3aW4zMik7XG4gIGNvbnN0IEVYVEdMT0JfQ0hBUlMgPSBjb25zdGFudHMuZXh0Z2xvYkNoYXJzKFBMQVRGT1JNX0NIQVJTKTtcblxuICBjb25zdCB7XG4gICAgRE9UX0xJVEVSQUwsXG4gICAgUExVU19MSVRFUkFMLFxuICAgIFNMQVNIX0xJVEVSQUwsXG4gICAgT05FX0NIQVIsXG4gICAgRE9UU19TTEFTSCxcbiAgICBOT19ET1QsXG4gICAgTk9fRE9UX1NMQVNILFxuICAgIE5PX0RPVFNfU0xBU0gsXG4gICAgUU1BUkssXG4gICAgUU1BUktfTk9fRE9ULFxuICAgIFNUQVIsXG4gICAgU1RBUlRfQU5DSE9SXG4gIH0gPSBQTEFURk9STV9DSEFSUztcblxuICBjb25zdCBnbG9ic3RhciA9IG9wdHMgPT4ge1xuICAgIHJldHVybiBgKCR7Y2FwdHVyZX0oPzooPyEke1NUQVJUX0FOQ0hPUn0ke29wdHMuZG90ID8gRE9UU19TTEFTSCA6IERPVF9MSVRFUkFMfSkuKSo/KWA7XG4gIH07XG5cbiAgY29uc3Qgbm9kb3QgPSBvcHRzLmRvdCA/ICcnIDogTk9fRE9UO1xuICBjb25zdCBxbWFya05vRG90ID0gb3B0cy5kb3QgPyBRTUFSSyA6IFFNQVJLX05PX0RPVDtcbiAgbGV0IHN0YXIgPSBvcHRzLmJhc2ggPT09IHRydWUgPyBnbG9ic3RhcihvcHRzKSA6IFNUQVI7XG5cbiAgaWYgKG9wdHMuY2FwdHVyZSkge1xuICAgIHN0YXIgPSBgKCR7c3Rhcn0pYDtcbiAgfVxuXG4gIC8vIG1pbmltYXRjaCBvcHRpb25zIHN1cHBvcnRcbiAgaWYgKHR5cGVvZiBvcHRzLm5vZXh0ID09PSAnYm9vbGVhbicpIHtcbiAgICBvcHRzLm5vZXh0Z2xvYiA9IG9wdHMubm9leHQ7XG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBpbnB1dCxcbiAgICBpbmRleDogLTEsXG4gICAgc3RhcnQ6IDAsXG4gICAgZG90OiBvcHRzLmRvdCA9PT0gdHJ1ZSxcbiAgICBjb25zdW1lZDogJycsXG4gICAgb3V0cHV0OiAnJyxcbiAgICBwcmVmaXg6ICcnLFxuICAgIGJhY2t0cmFjazogZmFsc2UsXG4gICAgbmVnYXRlZDogZmFsc2UsXG4gICAgYnJhY2tldHM6IDAsXG4gICAgYnJhY2VzOiAwLFxuICAgIHBhcmVuczogMCxcbiAgICBxdW90ZXM6IDAsXG4gICAgZ2xvYnN0YXI6IGZhbHNlLFxuICAgIHRva2Vuc1xuICB9O1xuXG4gIGlucHV0ID0gdXRpbHMucmVtb3ZlUHJlZml4KGlucHV0LCBzdGF0ZSk7XG4gIGxlbiA9IGlucHV0Lmxlbmd0aDtcblxuICBjb25zdCBleHRnbG9icyA9IFtdO1xuICBjb25zdCBicmFjZXMgPSBbXTtcbiAgY29uc3Qgc3RhY2sgPSBbXTtcbiAgbGV0IHByZXYgPSBib3M7XG4gIGxldCB2YWx1ZTtcblxuICAvKipcbiAgICogVG9rZW5pemluZyBoZWxwZXJzXG4gICAqL1xuXG4gIGNvbnN0IGVvcyA9ICgpID0+IHN0YXRlLmluZGV4ID09PSBsZW4gLSAxO1xuICBjb25zdCBwZWVrID0gc3RhdGUucGVlayA9IChuID0gMSkgPT4gaW5wdXRbc3RhdGUuaW5kZXggKyBuXTtcbiAgY29uc3QgYWR2YW5jZSA9IHN0YXRlLmFkdmFuY2UgPSAoKSA9PiBpbnB1dFsrK3N0YXRlLmluZGV4XSB8fCAnJztcbiAgY29uc3QgcmVtYWluaW5nID0gKCkgPT4gaW5wdXQuc2xpY2Uoc3RhdGUuaW5kZXggKyAxKTtcbiAgY29uc3QgY29uc3VtZSA9ICh2YWx1ZSA9ICcnLCBudW0gPSAwKSA9PiB7XG4gICAgc3RhdGUuY29uc3VtZWQgKz0gdmFsdWU7XG4gICAgc3RhdGUuaW5kZXggKz0gbnVtO1xuICB9O1xuXG4gIGNvbnN0IGFwcGVuZCA9IHRva2VuID0+IHtcbiAgICBzdGF0ZS5vdXRwdXQgKz0gdG9rZW4ub3V0cHV0ICE9IG51bGwgPyB0b2tlbi5vdXRwdXQgOiB0b2tlbi52YWx1ZTtcbiAgICBjb25zdW1lKHRva2VuLnZhbHVlKTtcbiAgfTtcblxuICBjb25zdCBuZWdhdGUgPSAoKSA9PiB7XG4gICAgbGV0IGNvdW50ID0gMTtcblxuICAgIHdoaWxlIChwZWVrKCkgPT09ICchJyAmJiAocGVlaygyKSAhPT0gJygnIHx8IHBlZWsoMykgPT09ICc/JykpIHtcbiAgICAgIGFkdmFuY2UoKTtcbiAgICAgIHN0YXRlLnN0YXJ0Kys7XG4gICAgICBjb3VudCsrO1xuICAgIH1cblxuICAgIGlmIChjb3VudCAlIDIgPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0ZS5uZWdhdGVkID0gdHJ1ZTtcbiAgICBzdGF0ZS5zdGFydCsrO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGluY3JlbWVudCA9IHR5cGUgPT4ge1xuICAgIHN0YXRlW3R5cGVdKys7XG4gICAgc3RhY2sucHVzaCh0eXBlKTtcbiAgfTtcblxuICBjb25zdCBkZWNyZW1lbnQgPSB0eXBlID0+IHtcbiAgICBzdGF0ZVt0eXBlXS0tO1xuICAgIHN0YWNrLnBvcCgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQdXNoIHRva2VucyBvbnRvIHRoZSB0b2tlbnMgYXJyYXkuIFRoaXMgaGVscGVyIHNwZWVkcyB1cFxuICAgKiB0b2tlbml6aW5nIGJ5IDEpIGhlbHBpbmcgdXMgYXZvaWQgYmFja3RyYWNraW5nIGFzIG11Y2ggYXMgcG9zc2libGUsXG4gICAqIGFuZCAyKSBoZWxwaW5nIHVzIGF2b2lkIGNyZWF0aW5nIGV4dHJhIHRva2VucyB3aGVuIGNvbnNlY3V0aXZlXG4gICAqIGNoYXJhY3RlcnMgYXJlIHBsYWluIHRleHQuIFRoaXMgaW1wcm92ZXMgcGVyZm9ybWFuY2UgYW5kIHNpbXBsaWZpZXNcbiAgICogbG9va2JlaGluZHMuXG4gICAqL1xuXG4gIGNvbnN0IHB1c2ggPSB0b2sgPT4ge1xuICAgIGlmIChwcmV2LnR5cGUgPT09ICdnbG9ic3RhcicpIHtcbiAgICAgIGNvbnN0IGlzQnJhY2UgPSBzdGF0ZS5icmFjZXMgPiAwICYmICh0b2sudHlwZSA9PT0gJ2NvbW1hJyB8fCB0b2sudHlwZSA9PT0gJ2JyYWNlJyk7XG4gICAgICBjb25zdCBpc0V4dGdsb2IgPSB0b2suZXh0Z2xvYiA9PT0gdHJ1ZSB8fCAoZXh0Z2xvYnMubGVuZ3RoICYmICh0b2sudHlwZSA9PT0gJ3BpcGUnIHx8IHRvay50eXBlID09PSAncGFyZW4nKSk7XG5cbiAgICAgIGlmICh0b2sudHlwZSAhPT0gJ3NsYXNoJyAmJiB0b2sudHlwZSAhPT0gJ3BhcmVuJyAmJiAhaXNCcmFjZSAmJiAhaXNFeHRnbG9iKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtcHJldi5vdXRwdXQubGVuZ3RoKTtcbiAgICAgICAgcHJldi50eXBlID0gJ3N0YXInO1xuICAgICAgICBwcmV2LnZhbHVlID0gJyonO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IHN0YXI7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2Lm91dHB1dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXh0Z2xvYnMubGVuZ3RoICYmIHRvay50eXBlICE9PSAncGFyZW4nKSB7XG4gICAgICBleHRnbG9ic1tleHRnbG9icy5sZW5ndGggLSAxXS5pbm5lciArPSB0b2sudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKHRvay52YWx1ZSB8fCB0b2sub3V0cHV0KSBhcHBlbmQodG9rKTtcbiAgICBpZiAocHJldiAmJiBwcmV2LnR5cGUgPT09ICd0ZXh0JyAmJiB0b2sudHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICBwcmV2LnZhbHVlICs9IHRvay52YWx1ZTtcbiAgICAgIHByZXYub3V0cHV0ID0gKHByZXYub3V0cHV0IHx8ICcnKSArIHRvay52YWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2sucHJldiA9IHByZXY7XG4gICAgdG9rZW5zLnB1c2godG9rKTtcbiAgICBwcmV2ID0gdG9rO1xuICB9O1xuXG4gIGNvbnN0IGV4dGdsb2JPcGVuID0gKHR5cGUsIHZhbHVlKSA9PiB7XG4gICAgY29uc3QgdG9rZW4gPSB7IC4uLkVYVEdMT0JfQ0hBUlNbdmFsdWVdLCBjb25kaXRpb25zOiAxLCBpbm5lcjogJycgfTtcblxuICAgIHRva2VuLnByZXYgPSBwcmV2O1xuICAgIHRva2VuLnBhcmVucyA9IHN0YXRlLnBhcmVucztcbiAgICB0b2tlbi5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQ7XG4gICAgY29uc3Qgb3V0cHV0ID0gKG9wdHMuY2FwdHVyZSA/ICcoJyA6ICcnKSArIHRva2VuLm9wZW47XG5cbiAgICBpbmNyZW1lbnQoJ3BhcmVucycpO1xuICAgIHB1c2goeyB0eXBlLCB2YWx1ZSwgb3V0cHV0OiBzdGF0ZS5vdXRwdXQgPyAnJyA6IE9ORV9DSEFSIH0pO1xuICAgIHB1c2goeyB0eXBlOiAncGFyZW4nLCBleHRnbG9iOiB0cnVlLCB2YWx1ZTogYWR2YW5jZSgpLCBvdXRwdXQgfSk7XG4gICAgZXh0Z2xvYnMucHVzaCh0b2tlbik7XG4gIH07XG5cbiAgY29uc3QgZXh0Z2xvYkNsb3NlID0gdG9rZW4gPT4ge1xuICAgIGxldCBvdXRwdXQgPSB0b2tlbi5jbG9zZSArIChvcHRzLmNhcHR1cmUgPyAnKScgOiAnJyk7XG4gICAgbGV0IHJlc3Q7XG5cbiAgICBpZiAodG9rZW4udHlwZSA9PT0gJ25lZ2F0ZScpIHtcbiAgICAgIGxldCBleHRnbG9iU3RhciA9IHN0YXI7XG5cbiAgICAgIGlmICh0b2tlbi5pbm5lciAmJiB0b2tlbi5pbm5lci5sZW5ndGggPiAxICYmIHRva2VuLmlubmVyLmluY2x1ZGVzKCcvJykpIHtcbiAgICAgICAgZXh0Z2xvYlN0YXIgPSBnbG9ic3RhcihvcHRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV4dGdsb2JTdGFyICE9PSBzdGFyIHx8IGVvcygpIHx8IC9eXFwpKyQvLnRlc3QocmVtYWluaW5nKCkpKSB7XG4gICAgICAgIG91dHB1dCA9IHRva2VuLmNsb3NlID0gYCkkKSkke2V4dGdsb2JTdGFyfWA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2tlbi5pbm5lci5pbmNsdWRlcygnKicpICYmIChyZXN0ID0gcmVtYWluaW5nKCkpICYmIC9eXFwuW15cXFxcLy5dKyQvLnRlc3QocmVzdCkpIHtcbiAgICAgICAgLy8gQW55IG5vbi1tYWdpY2FsIHN0cmluZyAoYC50c2ApIG9yIGV2ZW4gbmVzdGVkIGV4cHJlc3Npb24gKGAue3RzLHRzeH1gKSBjYW4gZm9sbG93IGFmdGVyIHRoZSBjbG9zaW5nIHBhcmVudGhlc2lzLlxuICAgICAgICAvLyBJbiB0aGlzIGNhc2UsIHdlIG5lZWQgdG8gcGFyc2UgdGhlIHN0cmluZyBhbmQgdXNlIGl0IGluIHRoZSBvdXRwdXQgb2YgdGhlIG9yaWdpbmFsIHBhdHRlcm4uXG4gICAgICAgIC8vIFN1aXRhYmxlIHBhdHRlcm5zOiBgLyEoKi5kKS50c2AsIGAvISgqLmQpLnt0cyx0c3h9YCwgYCoqLyEoKi1kYmcpLkAoanMpYC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gRGlzYWJsaW5nIHRoZSBgZmFzdHBhdGhzYCBvcHRpb24gZHVlIHRvIGEgcHJvYmxlbSB3aXRoIHBhcnNpbmcgc3RyaW5ncyBhcyBgLnRzYCBpbiB0aGUgcGF0dGVybiBsaWtlIGAqKi8hKCouZCkudHNgLlxuICAgICAgICBjb25zdCBleHByZXNzaW9uID0gcGFyc2UocmVzdCwgeyAuLi5vcHRpb25zLCBmYXN0cGF0aHM6IGZhbHNlIH0pLm91dHB1dDtcblxuICAgICAgICBvdXRwdXQgPSB0b2tlbi5jbG9zZSA9IGApJHtleHByZXNzaW9ufSkke2V4dGdsb2JTdGFyfSlgO1xuICAgICAgfVxuXG4gICAgICBpZiAodG9rZW4ucHJldi50eXBlID09PSAnYm9zJykge1xuICAgICAgICBzdGF0ZS5uZWdhdGVkRXh0Z2xvYiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIGV4dGdsb2I6IHRydWUsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgZGVjcmVtZW50KCdwYXJlbnMnKTtcbiAgfTtcblxuICAvKipcbiAgICogRmFzdCBwYXRoc1xuICAgKi9cblxuICBpZiAob3B0cy5mYXN0cGF0aHMgIT09IGZhbHNlICYmICEvKF5bKiFdfFsvKClbXFxde31cIl0pLy50ZXN0KGlucHV0KSkge1xuICAgIGxldCBiYWNrc2xhc2hlcyA9IGZhbHNlO1xuXG4gICAgbGV0IG91dHB1dCA9IGlucHV0LnJlcGxhY2UoUkVHRVhfU1BFQ0lBTF9DSEFSU19CQUNLUkVGLCAobSwgZXNjLCBjaGFycywgZmlyc3QsIHJlc3QsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoZmlyc3QgPT09ICdcXFxcJykge1xuICAgICAgICBiYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICAgIHJldHVybiBtO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlyc3QgPT09ICc/Jykge1xuICAgICAgICBpZiAoZXNjKSB7XG4gICAgICAgICAgcmV0dXJuIGVzYyArIGZpcnN0ICsgKHJlc3QgPyBRTUFSSy5yZXBlYXQocmVzdC5sZW5ndGgpIDogJycpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBxbWFya05vRG90ICsgKHJlc3QgPyBRTUFSSy5yZXBlYXQocmVzdC5sZW5ndGgpIDogJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBRTUFSSy5yZXBlYXQoY2hhcnMubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0ID09PSAnLicpIHtcbiAgICAgICAgcmV0dXJuIERPVF9MSVRFUkFMLnJlcGVhdChjaGFycy5sZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlyc3QgPT09ICcqJykge1xuICAgICAgICBpZiAoZXNjKSB7XG4gICAgICAgICAgcmV0dXJuIGVzYyArIGZpcnN0ICsgKHJlc3QgPyBzdGFyIDogJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGFyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVzYyA/IG0gOiBgXFxcXCR7bX1gO1xuICAgIH0pO1xuXG4gICAgaWYgKGJhY2tzbGFzaGVzID09PSB0cnVlKSB7XG4gICAgICBpZiAob3B0cy51bmVzY2FwZSA9PT0gdHJ1ZSkge1xuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvXFxcXCsvZywgbSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG0ubGVuZ3RoICUgMiA9PT0gMCA/ICdcXFxcXFxcXCcgOiAobSA/ICdcXFxcJyA6ICcnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG91dHB1dCA9PT0gaW5wdXQgJiYgb3B0cy5jb250YWlucyA9PT0gdHJ1ZSkge1xuICAgICAgc3RhdGUub3V0cHV0ID0gaW5wdXQ7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgc3RhdGUub3V0cHV0ID0gdXRpbHMud3JhcE91dHB1dChvdXRwdXQsIHN0YXRlLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVG9rZW5pemUgaW5wdXQgdW50aWwgd2UgcmVhY2ggZW5kLW9mLXN0cmluZ1xuICAgKi9cblxuICB3aGlsZSAoIWVvcygpKSB7XG4gICAgdmFsdWUgPSBhZHZhbmNlKCk7XG5cbiAgICBpZiAodmFsdWUgPT09ICdcXHUwMDAwJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXNjYXBlZCBjaGFyYWN0ZXJzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICdcXFxcJykge1xuICAgICAgY29uc3QgbmV4dCA9IHBlZWsoKTtcblxuICAgICAgaWYgKG5leHQgPT09ICcvJyAmJiBvcHRzLmJhc2ggIT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0ID09PSAnLicgfHwgbmV4dCA9PT0gJzsnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgdmFsdWUgKz0gJ1xcXFwnO1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbGxhcHNlIHNsYXNoZXMgdG8gcmVkdWNlIHBvdGVudGlhbCBmb3IgZXhwbG9pdHNcbiAgICAgIGNvbnN0IG1hdGNoID0gL15cXFxcKy8uZXhlYyhyZW1haW5pbmcoKSk7XG4gICAgICBsZXQgc2xhc2hlcyA9IDA7XG5cbiAgICAgIGlmIChtYXRjaCAmJiBtYXRjaFswXS5sZW5ndGggPiAyKSB7XG4gICAgICAgIHNsYXNoZXMgPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgIHN0YXRlLmluZGV4ICs9IHNsYXNoZXM7XG4gICAgICAgIGlmIChzbGFzaGVzICUgMiAhPT0gMCkge1xuICAgICAgICAgIHZhbHVlICs9ICdcXFxcJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy51bmVzY2FwZSA9PT0gdHJ1ZSkge1xuICAgICAgICB2YWx1ZSA9IGFkdmFuY2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlICs9IGFkdmFuY2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLmJyYWNrZXRzID09PSAwKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB3ZSdyZSBpbnNpZGUgYSByZWdleCBjaGFyYWN0ZXIgY2xhc3MsIGNvbnRpbnVlXG4gICAgICogdW50aWwgd2UgcmVhY2ggdGhlIGNsb3NpbmcgYnJhY2tldC5cbiAgICAgKi9cblxuICAgIGlmIChzdGF0ZS5icmFja2V0cyA+IDAgJiYgKHZhbHVlICE9PSAnXScgfHwgcHJldi52YWx1ZSA9PT0gJ1snIHx8IHByZXYudmFsdWUgPT09ICdbXicpKSB7XG4gICAgICBpZiAob3B0cy5wb3NpeCAhPT0gZmFsc2UgJiYgdmFsdWUgPT09ICc6Jykge1xuICAgICAgICBjb25zdCBpbm5lciA9IHByZXYudmFsdWUuc2xpY2UoMSk7XG4gICAgICAgIGlmIChpbm5lci5pbmNsdWRlcygnWycpKSB7XG4gICAgICAgICAgcHJldi5wb3NpeCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAoaW5uZXIuaW5jbHVkZXMoJzonKSkge1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gcHJldi52YWx1ZS5sYXN0SW5kZXhPZignWycpO1xuICAgICAgICAgICAgY29uc3QgcHJlID0gcHJldi52YWx1ZS5zbGljZSgwLCBpZHgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdCA9IHByZXYudmFsdWUuc2xpY2UoaWR4ICsgMik7XG4gICAgICAgICAgICBjb25zdCBwb3NpeCA9IFBPU0lYX1JFR0VYX1NPVVJDRVtyZXN0XTtcbiAgICAgICAgICAgIGlmIChwb3NpeCkge1xuICAgICAgICAgICAgICBwcmV2LnZhbHVlID0gcHJlICsgcG9zaXg7XG4gICAgICAgICAgICAgIHN0YXRlLmJhY2t0cmFjayA9IHRydWU7XG4gICAgICAgICAgICAgIGFkdmFuY2UoKTtcblxuICAgICAgICAgICAgICBpZiAoIWJvcy5vdXRwdXQgJiYgdG9rZW5zLmluZGV4T2YocHJldikgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBib3Mub3V0cHV0ID0gT05FX0NIQVI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgodmFsdWUgPT09ICdbJyAmJiBwZWVrKCkgIT09ICc6JykgfHwgKHZhbHVlID09PSAnLScgJiYgcGVlaygpID09PSAnXScpKSB7XG4gICAgICAgIHZhbHVlID0gYFxcXFwke3ZhbHVlfWA7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ10nICYmIChwcmV2LnZhbHVlID09PSAnWycgfHwgcHJldi52YWx1ZSA9PT0gJ1teJykpIHtcbiAgICAgICAgdmFsdWUgPSBgXFxcXCR7dmFsdWV9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMucG9zaXggPT09IHRydWUgJiYgdmFsdWUgPT09ICchJyAmJiBwcmV2LnZhbHVlID09PSAnWycpIHtcbiAgICAgICAgdmFsdWUgPSAnXic7XG4gICAgICB9XG5cbiAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICBhcHBlbmQoeyB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHdlJ3JlIGluc2lkZSBhIHF1b3RlZCBzdHJpbmcsIGNvbnRpbnVlXG4gICAgICogdW50aWwgd2UgcmVhY2ggdGhlIGNsb3NpbmcgZG91YmxlIHF1b3RlLlxuICAgICAqL1xuXG4gICAgaWYgKHN0YXRlLnF1b3RlcyA9PT0gMSAmJiB2YWx1ZSAhPT0gJ1wiJykge1xuICAgICAgdmFsdWUgPSB1dGlscy5lc2NhcGVSZWdleCh2YWx1ZSk7XG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgYXBwZW5kKHsgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3VibGUgcXVvdGVzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICdcIicpIHtcbiAgICAgIHN0YXRlLnF1b3RlcyA9IHN0YXRlLnF1b3RlcyA9PT0gMSA/IDAgOiAxO1xuICAgICAgaWYgKG9wdHMua2VlcFF1b3RlcyA9PT0gdHJ1ZSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcmVudGhlc2VzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICcoJykge1xuICAgICAgaW5jcmVtZW50KCdwYXJlbnMnKTtcbiAgICAgIHB1c2goeyB0eXBlOiAncGFyZW4nLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gJyknKSB7XG4gICAgICBpZiAoc3RhdGUucGFyZW5zID09PSAwICYmIG9wdHMuc3RyaWN0QnJhY2tldHMgPT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdvcGVuaW5nJywgJygnKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV4dGdsb2IgPSBleHRnbG9ic1tleHRnbG9icy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChleHRnbG9iICYmIHN0YXRlLnBhcmVucyA9PT0gZXh0Z2xvYi5wYXJlbnMgKyAxKSB7XG4gICAgICAgIGV4dGdsb2JDbG9zZShleHRnbG9icy5wb3AoKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3BhcmVuJywgdmFsdWUsIG91dHB1dDogc3RhdGUucGFyZW5zID8gJyknIDogJ1xcXFwpJyB9KTtcbiAgICAgIGRlY3JlbWVudCgncGFyZW5zJyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcXVhcmUgYnJhY2tldHNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ1snKSB7XG4gICAgICBpZiAob3B0cy5ub2JyYWNrZXQgPT09IHRydWUgfHwgIXJlbWFpbmluZygpLmluY2x1ZGVzKCddJykpIHtcbiAgICAgICAgaWYgKG9wdHMubm9icmFja2V0ICE9PSB0cnVlICYmIG9wdHMuc3RyaWN0QnJhY2tldHMgPT09IHRydWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnXScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gYFxcXFwke3ZhbHVlfWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmNyZW1lbnQoJ2JyYWNrZXRzJyk7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnYnJhY2tldCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSAnXScpIHtcbiAgICAgIGlmIChvcHRzLm5vYnJhY2tldCA9PT0gdHJ1ZSB8fCAocHJldiAmJiBwcmV2LnR5cGUgPT09ICdicmFja2V0JyAmJiBwcmV2LnZhbHVlLmxlbmd0aCA9PT0gMSkpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dDogYFxcXFwke3ZhbHVlfWAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUuYnJhY2tldHMgPT09IDApIHtcbiAgICAgICAgaWYgKG9wdHMuc3RyaWN0QnJhY2tldHMgPT09IHRydWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ29wZW5pbmcnLCAnWycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlLCBvdXRwdXQ6IGBcXFxcJHt2YWx1ZX1gIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZGVjcmVtZW50KCdicmFja2V0cycpO1xuXG4gICAgICBjb25zdCBwcmV2VmFsdWUgPSBwcmV2LnZhbHVlLnNsaWNlKDEpO1xuICAgICAgaWYgKHByZXYucG9zaXggIT09IHRydWUgJiYgcHJldlZhbHVlWzBdID09PSAnXicgJiYgIXByZXZWYWx1ZS5pbmNsdWRlcygnLycpKSB7XG4gICAgICAgIHZhbHVlID0gYC8ke3ZhbHVlfWA7XG4gICAgICB9XG5cbiAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICBhcHBlbmQoeyB2YWx1ZSB9KTtcblxuICAgICAgLy8gd2hlbiBsaXRlcmFsIGJyYWNrZXRzIGFyZSBleHBsaWNpdGx5IGRpc2FibGVkXG4gICAgICAvLyBhc3N1bWUgd2Ugc2hvdWxkIG1hdGNoIHdpdGggYSByZWdleCBjaGFyYWN0ZXIgY2xhc3NcbiAgICAgIGlmIChvcHRzLmxpdGVyYWxCcmFja2V0cyA9PT0gZmFsc2UgfHwgdXRpbHMuaGFzUmVnZXhDaGFycyhwcmV2VmFsdWUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlc2NhcGVkID0gdXRpbHMuZXNjYXBlUmVnZXgocHJldi52YWx1ZSk7XG4gICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLXByZXYudmFsdWUubGVuZ3RoKTtcblxuICAgICAgLy8gd2hlbiBsaXRlcmFsIGJyYWNrZXRzIGFyZSBleHBsaWNpdGx5IGVuYWJsZWRcbiAgICAgIC8vIGFzc3VtZSB3ZSBzaG91bGQgZXNjYXBlIHRoZSBicmFja2V0cyB0byBtYXRjaCBsaXRlcmFsIGNoYXJhY3RlcnNcbiAgICAgIGlmIChvcHRzLmxpdGVyYWxCcmFja2V0cyA9PT0gdHJ1ZSkge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gZXNjYXBlZDtcbiAgICAgICAgcHJldi52YWx1ZSA9IGVzY2FwZWQ7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyB3aGVuIHRoZSB1c2VyIHNwZWNpZmllcyBub3RoaW5nLCB0cnkgdG8gbWF0Y2ggYm90aFxuICAgICAgcHJldi52YWx1ZSA9IGAoJHtjYXB0dXJlfSR7ZXNjYXBlZH18JHtwcmV2LnZhbHVlfSlgO1xuICAgICAgc3RhdGUub3V0cHV0ICs9IHByZXYudmFsdWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmFjZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ3snICYmIG9wdHMubm9icmFjZSAhPT0gdHJ1ZSkge1xuICAgICAgaW5jcmVtZW50KCdicmFjZXMnKTtcblxuICAgICAgY29uc3Qgb3BlbiA9IHtcbiAgICAgICAgdHlwZTogJ2JyYWNlJyxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIG91dHB1dDogJygnLFxuICAgICAgICBvdXRwdXRJbmRleDogc3RhdGUub3V0cHV0Lmxlbmd0aCxcbiAgICAgICAgdG9rZW5zSW5kZXg6IHN0YXRlLnRva2Vucy5sZW5ndGhcbiAgICAgIH07XG5cbiAgICAgIGJyYWNlcy5wdXNoKG9wZW4pO1xuICAgICAgcHVzaChvcGVuKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gJ30nKSB7XG4gICAgICBjb25zdCBicmFjZSA9IGJyYWNlc1ticmFjZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmIChvcHRzLm5vYnJhY2UgPT09IHRydWUgfHwgIWJyYWNlKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlLCBvdXRwdXQ6IHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IG91dHB1dCA9ICcpJztcblxuICAgICAgaWYgKGJyYWNlLmRvdHMgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgYXJyID0gdG9rZW5zLnNsaWNlKCk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IGFyci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRva2Vucy5wb3AoKTtcbiAgICAgICAgICBpZiAoYXJyW2ldLnR5cGUgPT09ICdicmFjZScpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJyW2ldLnR5cGUgIT09ICdkb3RzJykge1xuICAgICAgICAgICAgcmFuZ2UudW5zaGlmdChhcnJbaV0udmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG91dHB1dCA9IGV4cGFuZFJhbmdlKHJhbmdlLCBvcHRzKTtcbiAgICAgICAgc3RhdGUuYmFja3RyYWNrID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJyYWNlLmNvbW1hICE9PSB0cnVlICYmIGJyYWNlLmRvdHMgIT09IHRydWUpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIGJyYWNlLm91dHB1dEluZGV4KTtcbiAgICAgICAgY29uc3QgdG9rcyA9IHN0YXRlLnRva2Vucy5zbGljZShicmFjZS50b2tlbnNJbmRleCk7XG4gICAgICAgIGJyYWNlLnZhbHVlID0gYnJhY2Uub3V0cHV0ID0gJ1xcXFx7JztcbiAgICAgICAgdmFsdWUgPSBvdXRwdXQgPSAnXFxcXH0nO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBvdXQ7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0b2tzKSB7XG4gICAgICAgICAgc3RhdGUub3V0cHV0ICs9ICh0Lm91dHB1dCB8fCB0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2JyYWNlJywgdmFsdWUsIG91dHB1dCB9KTtcbiAgICAgIGRlY3JlbWVudCgnYnJhY2VzJyk7XG4gICAgICBicmFjZXMucG9wKCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaXBlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnfCcpIHtcbiAgICAgIGlmIChleHRnbG9icy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGV4dGdsb2JzW2V4dGdsb2JzLmxlbmd0aCAtIDFdLmNvbmRpdGlvbnMrKztcbiAgICAgIH1cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tbWFzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICcsJykge1xuICAgICAgbGV0IG91dHB1dCA9IHZhbHVlO1xuXG4gICAgICBjb25zdCBicmFjZSA9IGJyYWNlc1ticmFjZXMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoYnJhY2UgJiYgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0gPT09ICdicmFjZXMnKSB7XG4gICAgICAgIGJyYWNlLmNvbW1hID0gdHJ1ZTtcbiAgICAgICAgb3V0cHV0ID0gJ3wnO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2NvbW1hJywgdmFsdWUsIG91dHB1dCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNsYXNoZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJy8nKSB7XG4gICAgICAvLyBpZiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBnbG9iIGlzIFwiLi9cIiwgYWR2YW5jZSB0aGUgc3RhcnRcbiAgICAgIC8vIHRvIHRoZSBjdXJyZW50IGluZGV4LCBhbmQgZG9uJ3QgYWRkIHRoZSBcIi4vXCIgY2hhcmFjdGVyc1xuICAgICAgLy8gdG8gdGhlIHN0YXRlLiBUaGlzIGdyZWF0bHkgc2ltcGxpZmllcyBsb29rYmVoaW5kcyB3aGVuXG4gICAgICAvLyBjaGVja2luZyBmb3IgQk9TIGNoYXJhY3RlcnMgbGlrZSBcIiFcIiBhbmQgXCIuXCIgKG5vdCBcIi4vXCIpXG4gICAgICBpZiAocHJldi50eXBlID09PSAnZG90JyAmJiBzdGF0ZS5pbmRleCA9PT0gc3RhdGUuc3RhcnQgKyAxKSB7XG4gICAgICAgIHN0YXRlLnN0YXJ0ID0gc3RhdGUuaW5kZXggKyAxO1xuICAgICAgICBzdGF0ZS5jb25zdW1lZCA9ICcnO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSAnJztcbiAgICAgICAgdG9rZW5zLnBvcCgpO1xuICAgICAgICBwcmV2ID0gYm9zOyAvLyByZXNldCBcInByZXZcIiB0byB0aGUgZmlyc3QgdG9rZW5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnc2xhc2gnLCB2YWx1ZSwgb3V0cHV0OiBTTEFTSF9MSVRFUkFMIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG90c1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnLicpIHtcbiAgICAgIGlmIChzdGF0ZS5icmFjZXMgPiAwICYmIHByZXYudHlwZSA9PT0gJ2RvdCcpIHtcbiAgICAgICAgaWYgKHByZXYudmFsdWUgPT09ICcuJykgcHJldi5vdXRwdXQgPSBET1RfTElURVJBTDtcbiAgICAgICAgY29uc3QgYnJhY2UgPSBicmFjZXNbYnJhY2VzLmxlbmd0aCAtIDFdO1xuICAgICAgICBwcmV2LnR5cGUgPSAnZG90cyc7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IHZhbHVlO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBicmFjZS5kb3RzID0gdHJ1ZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICgoc3RhdGUuYnJhY2VzICsgc3RhdGUucGFyZW5zKSA9PT0gMCAmJiBwcmV2LnR5cGUgIT09ICdib3MnICYmIHByZXYudHlwZSAhPT0gJ3NsYXNoJykge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiBET1RfTElURVJBTCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnZG90JywgdmFsdWUsIG91dHB1dDogRE9UX0xJVEVSQUwgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWVzdGlvbiBtYXJrc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnPycpIHtcbiAgICAgIGNvbnN0IGlzR3JvdXAgPSBwcmV2ICYmIHByZXYudmFsdWUgPT09ICcoJztcbiAgICAgIGlmICghaXNHcm91cCAmJiBvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJyAmJiBwZWVrKDIpICE9PSAnPycpIHtcbiAgICAgICAgZXh0Z2xvYk9wZW4oJ3FtYXJrJywgdmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYgJiYgcHJldi50eXBlID09PSAncGFyZW4nKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBwZWVrKCk7XG4gICAgICAgIGxldCBvdXRwdXQgPSB2YWx1ZTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gJzwnICYmICF1dGlscy5zdXBwb3J0c0xvb2tiZWhpbmRzKCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuanMgdjEwIG9yIGhpZ2hlciBpcyByZXF1aXJlZCBmb3IgcmVnZXggbG9va2JlaGluZHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgocHJldi52YWx1ZSA9PT0gJygnICYmICEvWyE9PDpdLy50ZXN0KG5leHQpKSB8fCAobmV4dCA9PT0gJzwnICYmICEvPChbIT1dfFxcdys+KS8udGVzdChyZW1haW5pbmcoKSkpKSB7XG4gICAgICAgICAgb3V0cHV0ID0gYFxcXFwke3ZhbHVlfWA7XG4gICAgICAgIH1cblxuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0IH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMuZG90ICE9PSB0cnVlICYmIChwcmV2LnR5cGUgPT09ICdzbGFzaCcgfHwgcHJldi50eXBlID09PSAnYm9zJykpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdxbWFyaycsIHZhbHVlLCBvdXRwdXQ6IFFNQVJLX05PX0RPVCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAncW1hcmsnLCB2YWx1ZSwgb3V0cHV0OiBRTUFSSyB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4Y2xhbWF0aW9uXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICchJykge1xuICAgICAgaWYgKG9wdHMubm9leHRnbG9iICE9PSB0cnVlICYmIHBlZWsoKSA9PT0gJygnKSB7XG4gICAgICAgIGlmIChwZWVrKDIpICE9PSAnPycgfHwgIS9bIT08Ol0vLnRlc3QocGVlaygzKSkpIHtcbiAgICAgICAgICBleHRnbG9iT3BlbignbmVnYXRlJywgdmFsdWUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLm5vbmVnYXRlICE9PSB0cnVlICYmIHN0YXRlLmluZGV4ID09PSAwKSB7XG4gICAgICAgIG5lZ2F0ZSgpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbHVzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICcrJykge1xuICAgICAgaWYgKG9wdHMubm9leHRnbG9iICE9PSB0cnVlICYmIHBlZWsoKSA9PT0gJygnICYmIHBlZWsoMikgIT09ICc/Jykge1xuICAgICAgICBleHRnbG9iT3BlbigncGx1cycsIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICgocHJldiAmJiBwcmV2LnZhbHVlID09PSAnKCcpIHx8IG9wdHMucmVnZXggPT09IGZhbHNlKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAncGx1cycsIHZhbHVlLCBvdXRwdXQ6IFBMVVNfTElURVJBTCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICgocHJldiAmJiAocHJldi50eXBlID09PSAnYnJhY2tldCcgfHwgcHJldi50eXBlID09PSAncGFyZW4nIHx8IHByZXYudHlwZSA9PT0gJ2JyYWNlJykpIHx8IHN0YXRlLnBhcmVucyA+IDApIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdwbHVzJywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3BsdXMnLCB2YWx1ZTogUExVU19MSVRFUkFMIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxhaW4gdGV4dFxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnQCcpIHtcbiAgICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJyAmJiBwZWVrKDIpICE9PSAnPycpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdhdCcsIGV4dGdsb2I6IHRydWUsIHZhbHVlLCBvdXRwdXQ6ICcnIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGFpbiB0ZXh0XG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgIT09ICcqJykge1xuICAgICAgaWYgKHZhbHVlID09PSAnJCcgfHwgdmFsdWUgPT09ICdeJykge1xuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXRjaCA9IFJFR0VYX05PTl9TUEVDSUFMX0NIQVJTLmV4ZWMocmVtYWluaW5nKCkpO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHZhbHVlICs9IG1hdGNoWzBdO1xuICAgICAgICBzdGF0ZS5pbmRleCArPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnNcbiAgICAgKi9cblxuICAgIGlmIChwcmV2ICYmIChwcmV2LnR5cGUgPT09ICdnbG9ic3RhcicgfHwgcHJldi5zdGFyID09PSB0cnVlKSkge1xuICAgICAgcHJldi50eXBlID0gJ3N0YXInO1xuICAgICAgcHJldi5zdGFyID0gdHJ1ZTtcbiAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICBwcmV2Lm91dHB1dCA9IHN0YXI7XG4gICAgICBzdGF0ZS5iYWNrdHJhY2sgPSB0cnVlO1xuICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgY29uc3VtZSh2YWx1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdCA9IHJlbWFpbmluZygpO1xuICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiAvXlxcKFteP10vLnRlc3QocmVzdCkpIHtcbiAgICAgIGV4dGdsb2JPcGVuKCdzdGFyJywgdmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHByZXYudHlwZSA9PT0gJ3N0YXInKSB7XG4gICAgICBpZiAob3B0cy5ub2dsb2JzdGFyID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJpb3IgPSBwcmV2LnByZXY7XG4gICAgICBjb25zdCBiZWZvcmUgPSBwcmlvci5wcmV2O1xuICAgICAgY29uc3QgaXNTdGFydCA9IHByaW9yLnR5cGUgPT09ICdzbGFzaCcgfHwgcHJpb3IudHlwZSA9PT0gJ2Jvcyc7XG4gICAgICBjb25zdCBhZnRlclN0YXIgPSBiZWZvcmUgJiYgKGJlZm9yZS50eXBlID09PSAnc3RhcicgfHwgYmVmb3JlLnR5cGUgPT09ICdnbG9ic3RhcicpO1xuXG4gICAgICBpZiAob3B0cy5iYXNoID09PSB0cnVlICYmICghaXNTdGFydCB8fCAocmVzdFswXSAmJiByZXN0WzBdICE9PSAnLycpKSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3N0YXInLCB2YWx1ZSwgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzQnJhY2UgPSBzdGF0ZS5icmFjZXMgPiAwICYmIChwcmlvci50eXBlID09PSAnY29tbWEnIHx8IHByaW9yLnR5cGUgPT09ICdicmFjZScpO1xuICAgICAgY29uc3QgaXNFeHRnbG9iID0gZXh0Z2xvYnMubGVuZ3RoICYmIChwcmlvci50eXBlID09PSAncGlwZScgfHwgcHJpb3IudHlwZSA9PT0gJ3BhcmVuJyk7XG4gICAgICBpZiAoIWlzU3RhcnQgJiYgcHJpb3IudHlwZSAhPT0gJ3BhcmVuJyAmJiAhaXNCcmFjZSAmJiAhaXNFeHRnbG9iKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAnc3RhcicsIHZhbHVlLCBvdXRwdXQ6ICcnIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gc3RyaXAgY29uc2VjdXRpdmUgYC8qKi9gXG4gICAgICB3aGlsZSAocmVzdC5zbGljZSgwLCAzKSA9PT0gJy8qKicpIHtcbiAgICAgICAgY29uc3QgYWZ0ZXIgPSBpbnB1dFtzdGF0ZS5pbmRleCArIDRdO1xuICAgICAgICBpZiAoYWZ0ZXIgJiYgYWZ0ZXIgIT09ICcvJykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3QgPSByZXN0LnNsaWNlKDMpO1xuICAgICAgICBjb25zdW1lKCcvKionLCAzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByaW9yLnR5cGUgPT09ICdib3MnICYmIGVvcygpKSB7XG4gICAgICAgIHByZXYudHlwZSA9ICdnbG9ic3Rhcic7XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIHByZXYub3V0cHV0ID0gZ2xvYnN0YXIob3B0cyk7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9IHByZXYub3V0cHV0O1xuICAgICAgICBzdGF0ZS5nbG9ic3RhciA9IHRydWU7XG4gICAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByaW9yLnR5cGUgPT09ICdzbGFzaCcgJiYgcHJpb3IucHJldi50eXBlICE9PSAnYm9zJyAmJiAhYWZ0ZXJTdGFyICYmIGVvcygpKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtKHByaW9yLm91dHB1dCArIHByZXYub3V0cHV0KS5sZW5ndGgpO1xuICAgICAgICBwcmlvci5vdXRwdXQgPSBgKD86JHtwcmlvci5vdXRwdXR9YDtcblxuICAgICAgICBwcmV2LnR5cGUgPSAnZ2xvYnN0YXInO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IGdsb2JzdGFyKG9wdHMpICsgKG9wdHMuc3RyaWN0U2xhc2hlcyA/ICcpJyA6ICd8JCknKTtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gcHJpb3Iub3V0cHV0ICsgcHJldi5vdXRwdXQ7XG4gICAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByaW9yLnR5cGUgPT09ICdzbGFzaCcgJiYgcHJpb3IucHJldi50eXBlICE9PSAnYm9zJyAmJiByZXN0WzBdID09PSAnLycpIHtcbiAgICAgICAgY29uc3QgZW5kID0gcmVzdFsxXSAhPT0gdm9pZCAwID8gJ3wkJyA6ICcnO1xuXG4gICAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtKHByaW9yLm91dHB1dCArIHByZXYub3V0cHV0KS5sZW5ndGgpO1xuICAgICAgICBwcmlvci5vdXRwdXQgPSBgKD86JHtwcmlvci5vdXRwdXR9YDtcblxuICAgICAgICBwcmV2LnR5cGUgPSAnZ2xvYnN0YXInO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IGAke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH18JHtTTEFTSF9MSVRFUkFMfSR7ZW5kfSlgO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuXG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dDtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN1bWUodmFsdWUgKyBhZHZhbmNlKCkpO1xuXG4gICAgICAgIHB1c2goeyB0eXBlOiAnc2xhc2gnLCB2YWx1ZTogJy8nLCBvdXRwdXQ6ICcnIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByaW9yLnR5cGUgPT09ICdib3MnICYmIHJlc3RbMF0gPT09ICcvJykge1xuICAgICAgICBwcmV2LnR5cGUgPSAnZ2xvYnN0YXInO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IGAoPzpefCR7U0xBU0hfTElURVJBTH18JHtnbG9ic3RhcihvcHRzKX0ke1NMQVNIX0xJVEVSQUx9KWA7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9IHByZXYub3V0cHV0O1xuICAgICAgICBzdGF0ZS5nbG9ic3RhciA9IHRydWU7XG4gICAgICAgIGNvbnN1bWUodmFsdWUgKyBhZHZhbmNlKCkpO1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3NsYXNoJywgdmFsdWU6ICcvJywgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSBzaW5nbGUgc3RhciBmcm9tIG91dHB1dFxuICAgICAgc3RhdGUub3V0cHV0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIC1wcmV2Lm91dHB1dC5sZW5ndGgpO1xuXG4gICAgICAvLyByZXNldCBwcmV2aW91cyB0b2tlbiB0byBnbG9ic3RhclxuICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgIHByZXYub3V0cHV0ID0gZ2xvYnN0YXIob3B0cyk7XG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuXG4gICAgICAvLyByZXNldCBvdXRwdXQgd2l0aCBnbG9ic3RhclxuICAgICAgc3RhdGUub3V0cHV0ICs9IHByZXYub3V0cHV0O1xuICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgY29uc3VtZSh2YWx1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IHsgdHlwZTogJ3N0YXInLCB2YWx1ZSwgb3V0cHV0OiBzdGFyIH07XG5cbiAgICBpZiAob3B0cy5iYXNoID09PSB0cnVlKSB7XG4gICAgICB0b2tlbi5vdXRwdXQgPSAnLio/JztcbiAgICAgIGlmIChwcmV2LnR5cGUgPT09ICdib3MnIHx8IHByZXYudHlwZSA9PT0gJ3NsYXNoJykge1xuICAgICAgICB0b2tlbi5vdXRwdXQgPSBub2RvdCArIHRva2VuLm91dHB1dDtcbiAgICAgIH1cbiAgICAgIHB1c2godG9rZW4pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHByZXYgJiYgKHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnIHx8IHByZXYudHlwZSA9PT0gJ3BhcmVuJykgJiYgb3B0cy5yZWdleCA9PT0gdHJ1ZSkge1xuICAgICAgdG9rZW4ub3V0cHV0ID0gdmFsdWU7XG4gICAgICBwdXNoKHRva2VuKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5pbmRleCA9PT0gc3RhdGUuc3RhcnQgfHwgcHJldi50eXBlID09PSAnc2xhc2gnIHx8IHByZXYudHlwZSA9PT0gJ2RvdCcpIHtcbiAgICAgIGlmIChwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBOT19ET1RfU0xBU0g7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IE5PX0RPVF9TTEFTSDtcblxuICAgICAgfSBlbHNlIGlmIChvcHRzLmRvdCA9PT0gdHJ1ZSkge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gTk9fRE9UU19TTEFTSDtcbiAgICAgICAgcHJldi5vdXRwdXQgKz0gTk9fRE9UU19TTEFTSDtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IG5vZG90O1xuICAgICAgICBwcmV2Lm91dHB1dCArPSBub2RvdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHBlZWsoKSAhPT0gJyonKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBPTkVfQ0hBUjtcbiAgICAgICAgcHJldi5vdXRwdXQgKz0gT05FX0NIQVI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVzaCh0b2tlbik7XG4gIH1cblxuICB3aGlsZSAoc3RhdGUuYnJhY2tldHMgPiAwKSB7XG4gICAgaWYgKG9wdHMuc3RyaWN0QnJhY2tldHMgPT09IHRydWUpIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignY2xvc2luZycsICddJykpO1xuICAgIHN0YXRlLm91dHB1dCA9IHV0aWxzLmVzY2FwZUxhc3Qoc3RhdGUub3V0cHV0LCAnWycpO1xuICAgIGRlY3JlbWVudCgnYnJhY2tldHMnKTtcbiAgfVxuXG4gIHdoaWxlIChzdGF0ZS5wYXJlbnMgPiAwKSB7XG4gICAgaWYgKG9wdHMuc3RyaWN0QnJhY2tldHMgPT09IHRydWUpIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignY2xvc2luZycsICcpJykpO1xuICAgIHN0YXRlLm91dHB1dCA9IHV0aWxzLmVzY2FwZUxhc3Qoc3RhdGUub3V0cHV0LCAnKCcpO1xuICAgIGRlY3JlbWVudCgncGFyZW5zJyk7XG4gIH1cblxuICB3aGlsZSAoc3RhdGUuYnJhY2VzID4gMCkge1xuICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnfScpKTtcbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy5lc2NhcGVMYXN0KHN0YXRlLm91dHB1dCwgJ3snKTtcbiAgICBkZWNyZW1lbnQoJ2JyYWNlcycpO1xuICB9XG5cbiAgaWYgKG9wdHMuc3RyaWN0U2xhc2hlcyAhPT0gdHJ1ZSAmJiAocHJldi50eXBlID09PSAnc3RhcicgfHwgcHJldi50eXBlID09PSAnYnJhY2tldCcpKSB7XG4gICAgcHVzaCh7IHR5cGU6ICdtYXliZV9zbGFzaCcsIHZhbHVlOiAnJywgb3V0cHV0OiBgJHtTTEFTSF9MSVRFUkFMfT9gIH0pO1xuICB9XG5cbiAgLy8gcmVidWlsZCB0aGUgb3V0cHV0IGlmIHdlIGhhZCB0byBiYWNrdHJhY2sgYXQgYW55IHBvaW50XG4gIGlmIChzdGF0ZS5iYWNrdHJhY2sgPT09IHRydWUpIHtcbiAgICBzdGF0ZS5vdXRwdXQgPSAnJztcblxuICAgIGZvciAoY29uc3QgdG9rZW4gb2Ygc3RhdGUudG9rZW5zKSB7XG4gICAgICBzdGF0ZS5vdXRwdXQgKz0gdG9rZW4ub3V0cHV0ICE9IG51bGwgPyB0b2tlbi5vdXRwdXQgOiB0b2tlbi52YWx1ZTtcblxuICAgICAgaWYgKHRva2VuLnN1ZmZpeCkge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gdG9rZW4uc3VmZml4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbi8qKlxuICogRmFzdCBwYXRocyBmb3IgY3JlYXRpbmcgcmVndWxhciBleHByZXNzaW9ucyBmb3IgY29tbW9uIGdsb2IgcGF0dGVybnMuXG4gKiBUaGlzIGNhbiBzaWduaWZpY2FudGx5IHNwZWVkIHVwIHByb2Nlc3NpbmcgYW5kIGhhcyB2ZXJ5IGxpdHRsZSBkb3duc2lkZVxuICogaW1wYWN0IHdoZW4gbm9uZSBvZiB0aGUgZmFzdCBwYXRocyBtYXRjaC5cbiAqL1xuXG5wYXJzZS5mYXN0cGF0aHMgPSAoaW5wdXQsIG9wdGlvbnMpID0+IHtcbiAgY29uc3Qgb3B0cyA9IHsgLi4ub3B0aW9ucyB9O1xuICBjb25zdCBtYXggPSB0eXBlb2Ygb3B0cy5tYXhMZW5ndGggPT09ICdudW1iZXInID8gTWF0aC5taW4oTUFYX0xFTkdUSCwgb3B0cy5tYXhMZW5ndGgpIDogTUFYX0xFTkdUSDtcbiAgY29uc3QgbGVuID0gaW5wdXQubGVuZ3RoO1xuICBpZiAobGVuID4gbWF4KSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBJbnB1dCBsZW5ndGg6ICR7bGVufSwgZXhjZWVkcyBtYXhpbXVtIGFsbG93ZWQgbGVuZ3RoOiAke21heH1gKTtcbiAgfVxuXG4gIGlucHV0ID0gUkVQTEFDRU1FTlRTW2lucHV0XSB8fCBpbnB1dDtcbiAgY29uc3Qgd2luMzIgPSB1dGlscy5pc1dpbmRvd3Mob3B0aW9ucyk7XG5cbiAgLy8gY3JlYXRlIGNvbnN0YW50cyBiYXNlZCBvbiBwbGF0Zm9ybSwgZm9yIHdpbmRvd3Mgb3IgcG9zaXhcbiAgY29uc3Qge1xuICAgIERPVF9MSVRFUkFMLFxuICAgIFNMQVNIX0xJVEVSQUwsXG4gICAgT05FX0NIQVIsXG4gICAgRE9UU19TTEFTSCxcbiAgICBOT19ET1QsXG4gICAgTk9fRE9UUyxcbiAgICBOT19ET1RTX1NMQVNILFxuICAgIFNUQVIsXG4gICAgU1RBUlRfQU5DSE9SXG4gIH0gPSBjb25zdGFudHMuZ2xvYkNoYXJzKHdpbjMyKTtcblxuICBjb25zdCBub2RvdCA9IG9wdHMuZG90ID8gTk9fRE9UUyA6IE5PX0RPVDtcbiAgY29uc3Qgc2xhc2hEb3QgPSBvcHRzLmRvdCA/IE5PX0RPVFNfU0xBU0ggOiBOT19ET1Q7XG4gIGNvbnN0IGNhcHR1cmUgPSBvcHRzLmNhcHR1cmUgPyAnJyA6ICc/Oic7XG4gIGNvbnN0IHN0YXRlID0geyBuZWdhdGVkOiBmYWxzZSwgcHJlZml4OiAnJyB9O1xuICBsZXQgc3RhciA9IG9wdHMuYmFzaCA9PT0gdHJ1ZSA/ICcuKj8nIDogU1RBUjtcblxuICBpZiAob3B0cy5jYXB0dXJlKSB7XG4gICAgc3RhciA9IGAoJHtzdGFyfSlgO1xuICB9XG5cbiAgY29uc3QgZ2xvYnN0YXIgPSBvcHRzID0+IHtcbiAgICBpZiAob3B0cy5ub2dsb2JzdGFyID09PSB0cnVlKSByZXR1cm4gc3RhcjtcbiAgICByZXR1cm4gYCgke2NhcHR1cmV9KD86KD8hJHtTVEFSVF9BTkNIT1J9JHtvcHRzLmRvdCA/IERPVFNfU0xBU0ggOiBET1RfTElURVJBTH0pLikqPylgO1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZSA9IHN0ciA9PiB7XG4gICAgc3dpdGNoIChzdHIpIHtcbiAgICAgIGNhc2UgJyonOlxuICAgICAgICByZXR1cm4gYCR7bm9kb3R9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnLionOlxuICAgICAgICByZXR1cm4gYCR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKi4qJzpcbiAgICAgICAgcmV0dXJuIGAke25vZG90fSR7c3Rhcn0ke0RPVF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJyovKic6XG4gICAgICAgIHJldHVybiBgJHtub2RvdH0ke3N0YXJ9JHtTTEFTSF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzbGFzaERvdH0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKionOlxuICAgICAgICByZXR1cm4gbm9kb3QgKyBnbG9ic3RhcihvcHRzKTtcblxuICAgICAgY2FzZSAnKiovKic6XG4gICAgICAgIHJldHVybiBgKD86JHtub2RvdH0ke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pPyR7c2xhc2hEb3R9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKiovKi4qJzpcbiAgICAgICAgcmV0dXJuIGAoPzoke25vZG90fSR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSk/JHtzbGFzaERvdH0ke3N0YXJ9JHtET1RfTElURVJBTH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcqKi8uKic6XG4gICAgICAgIHJldHVybiBgKD86JHtub2RvdH0ke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pPyR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBtYXRjaCA9IC9eKC4qPylcXC4oXFx3KykkLy5leGVjKHN0cik7XG4gICAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzb3VyY2UgPSBjcmVhdGUobWF0Y2hbMV0pO1xuICAgICAgICBpZiAoIXNvdXJjZSkgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBzb3VyY2UgKyBET1RfTElURVJBTCArIG1hdGNoWzJdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBvdXRwdXQgPSB1dGlscy5yZW1vdmVQcmVmaXgoaW5wdXQsIHN0YXRlKTtcbiAgbGV0IHNvdXJjZSA9IGNyZWF0ZShvdXRwdXQpO1xuXG4gIGlmIChzb3VyY2UgJiYgb3B0cy5zdHJpY3RTbGFzaGVzICE9PSB0cnVlKSB7XG4gICAgc291cmNlICs9IGAke1NMQVNIX0xJVEVSQUx9P2A7XG4gIH1cblxuICByZXR1cm4gc291cmNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHNjYW4gPSByZXF1aXJlKCcuL3NjYW4nKTtcbmNvbnN0IHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuY29uc3QgaXNPYmplY3QgPSB2YWwgPT4gdmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbCk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdGNoZXIgZnVuY3Rpb24gZnJvbSBvbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zLiBUaGVcbiAqIHJldHVybmVkIGZ1bmN0aW9uIHRha2VzIGEgc3RyaW5nIHRvIG1hdGNoIGFzIGl0cyBmaXJzdCBhcmd1bWVudCxcbiAqIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIHN0cmluZyBpcyBhIG1hdGNoLiBUaGUgcmV0dXJuZWQgbWF0Y2hlclxuICogZnVuY3Rpb24gYWxzbyB0YWtlcyBhIGJvb2xlYW4gYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0aGF0LCB3aGVuIHRydWUsXG4gKiByZXR1cm5zIGFuIG9iamVjdCB3aXRoIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogLy8gcGljb21hdGNoKGdsb2JbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc3QgaXNNYXRjaCA9IHBpY29tYXRjaCgnKi4hKCphKScpO1xuICogY29uc29sZS5sb2coaXNNYXRjaCgnYS5hJykpOyAvLz0+IGZhbHNlXG4gKiBjb25zb2xlLmxvZyhpc01hdGNoKCdhLmInKSk7IC8vPT4gdHJ1ZVxuICogYGBgXG4gKiBAbmFtZSBwaWNvbWF0Y2hcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBgZ2xvYnNgIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMuXG4gKiBAcGFyYW0ge09iamVjdD19IGBvcHRpb25zYFxuICogQHJldHVybiB7RnVuY3Rpb249fSBSZXR1cm5zIGEgbWF0Y2hlciBmdW5jdGlvbi5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY29uc3QgcGljb21hdGNoID0gKGdsb2IsIG9wdGlvbnMsIHJldHVyblN0YXRlID0gZmFsc2UpID0+IHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZ2xvYikpIHtcbiAgICBjb25zdCBmbnMgPSBnbG9iLm1hcChpbnB1dCA9PiBwaWNvbWF0Y2goaW5wdXQsIG9wdGlvbnMsIHJldHVyblN0YXRlKSk7XG4gICAgY29uc3QgYXJyYXlNYXRjaGVyID0gc3RyID0+IHtcbiAgICAgIGZvciAoY29uc3QgaXNNYXRjaCBvZiBmbnMpIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBpc01hdGNoKHN0cik7XG4gICAgICAgIGlmIChzdGF0ZSkgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgcmV0dXJuIGFycmF5TWF0Y2hlcjtcbiAgfVxuXG4gIGNvbnN0IGlzU3RhdGUgPSBpc09iamVjdChnbG9iKSAmJiBnbG9iLnRva2VucyAmJiBnbG9iLmlucHV0O1xuXG4gIGlmIChnbG9iID09PSAnJyB8fCAodHlwZW9mIGdsb2IgIT09ICdzdHJpbmcnICYmICFpc1N0YXRlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHBhdHRlcm4gdG8gYmUgYSBub24tZW1wdHkgc3RyaW5nJyk7XG4gIH1cblxuICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgY29uc3QgcG9zaXggPSB1dGlscy5pc1dpbmRvd3Mob3B0aW9ucyk7XG4gIGNvbnN0IHJlZ2V4ID0gaXNTdGF0ZVxuICAgID8gcGljb21hdGNoLmNvbXBpbGVSZShnbG9iLCBvcHRpb25zKVxuICAgIDogcGljb21hdGNoLm1ha2VSZShnbG9iLCBvcHRpb25zLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgY29uc3Qgc3RhdGUgPSByZWdleC5zdGF0ZTtcbiAgZGVsZXRlIHJlZ2V4LnN0YXRlO1xuXG4gIGxldCBpc0lnbm9yZWQgPSAoKSA9PiBmYWxzZTtcbiAgaWYgKG9wdHMuaWdub3JlKSB7XG4gICAgY29uc3QgaWdub3JlT3B0cyA9IHsgLi4ub3B0aW9ucywgaWdub3JlOiBudWxsLCBvbk1hdGNoOiBudWxsLCBvblJlc3VsdDogbnVsbCB9O1xuICAgIGlzSWdub3JlZCA9IHBpY29tYXRjaChvcHRzLmlnbm9yZSwgaWdub3JlT3B0cywgcmV0dXJuU3RhdGUpO1xuICB9XG5cbiAgY29uc3QgbWF0Y2hlciA9IChpbnB1dCwgcmV0dXJuT2JqZWN0ID0gZmFsc2UpID0+IHtcbiAgICBjb25zdCB7IGlzTWF0Y2gsIG1hdGNoLCBvdXRwdXQgfSA9IHBpY29tYXRjaC50ZXN0KGlucHV0LCByZWdleCwgb3B0aW9ucywgeyBnbG9iLCBwb3NpeCB9KTtcbiAgICBjb25zdCByZXN1bHQgPSB7IGdsb2IsIHN0YXRlLCByZWdleCwgcG9zaXgsIGlucHV0LCBvdXRwdXQsIG1hdGNoLCBpc01hdGNoIH07XG5cbiAgICBpZiAodHlwZW9mIG9wdHMub25SZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9wdHMub25SZXN1bHQocmVzdWx0KTtcbiAgICB9XG5cbiAgICBpZiAoaXNNYXRjaCA9PT0gZmFsc2UpIHtcbiAgICAgIHJlc3VsdC5pc01hdGNoID0gZmFsc2U7XG4gICAgICByZXR1cm4gcmV0dXJuT2JqZWN0ID8gcmVzdWx0IDogZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzSWdub3JlZChpbnB1dCkpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0cy5vbklnbm9yZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvcHRzLm9uSWdub3JlKHJlc3VsdCk7XG4gICAgICB9XG4gICAgICByZXN1bHQuaXNNYXRjaCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHJldHVybk9iamVjdCA/IHJlc3VsdCA6IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0cy5vbk1hdGNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRzLm9uTWF0Y2gocmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJldHVybk9iamVjdCA/IHJlc3VsdCA6IHRydWU7XG4gIH07XG5cbiAgaWYgKHJldHVyblN0YXRlKSB7XG4gICAgbWF0Y2hlci5zdGF0ZSA9IHN0YXRlO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXI7XG59O1xuXG4vKipcbiAqIFRlc3QgYGlucHV0YCB3aXRoIHRoZSBnaXZlbiBgcmVnZXhgLiBUaGlzIGlzIHVzZWQgYnkgdGhlIG1haW5cbiAqIGBwaWNvbWF0Y2goKWAgZnVuY3Rpb24gdG8gdGVzdCB0aGUgaW5wdXQgc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC50ZXN0KGlucHV0LCByZWdleFssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2gudGVzdCgnZm9vL2JhcicsIC9eKD86KFteL10qPylcXC8oW14vXSo/KSkkLykpO1xuICogLy8geyBpc01hdGNoOiB0cnVlLCBtYXRjaDogWyAnZm9vLycsICdmb28nLCAnYmFyJyBdLCBvdXRwdXQ6ICdmb28vYmFyJyB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgaW5wdXRgIFN0cmluZyB0byB0ZXN0LlxuICogQHBhcmFtIHtSZWdFeHB9IGByZWdleGBcbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBtYXRjaGluZyBpbmZvLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2gudGVzdCA9IChpbnB1dCwgcmVnZXgsIG9wdGlvbnMsIHsgZ2xvYiwgcG9zaXggfSA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgaW5wdXQgdG8gYmUgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIGlmIChpbnB1dCA9PT0gJycpIHtcbiAgICByZXR1cm4geyBpc01hdGNoOiBmYWxzZSwgb3V0cHV0OiAnJyB9O1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IGZvcm1hdCA9IG9wdHMuZm9ybWF0IHx8IChwb3NpeCA/IHV0aWxzLnRvUG9zaXhTbGFzaGVzIDogbnVsbCk7XG4gIGxldCBtYXRjaCA9IGlucHV0ID09PSBnbG9iO1xuICBsZXQgb3V0cHV0ID0gKG1hdGNoICYmIGZvcm1hdCkgPyBmb3JtYXQoaW5wdXQpIDogaW5wdXQ7XG5cbiAgaWYgKG1hdGNoID09PSBmYWxzZSkge1xuICAgIG91dHB1dCA9IGZvcm1hdCA/IGZvcm1hdChpbnB1dCkgOiBpbnB1dDtcbiAgICBtYXRjaCA9IG91dHB1dCA9PT0gZ2xvYjtcbiAgfVxuXG4gIGlmIChtYXRjaCA9PT0gZmFsc2UgfHwgb3B0cy5jYXB0dXJlID09PSB0cnVlKSB7XG4gICAgaWYgKG9wdHMubWF0Y2hCYXNlID09PSB0cnVlIHx8IG9wdHMuYmFzZW5hbWUgPT09IHRydWUpIHtcbiAgICAgIG1hdGNoID0gcGljb21hdGNoLm1hdGNoQmFzZShpbnB1dCwgcmVnZXgsIG9wdGlvbnMsIHBvc2l4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0Y2ggPSByZWdleC5leGVjKG91dHB1dCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgaXNNYXRjaDogQm9vbGVhbihtYXRjaCksIG1hdGNoLCBvdXRwdXQgfTtcbn07XG5cbi8qKlxuICogTWF0Y2ggdGhlIGJhc2VuYW1lIG9mIGEgZmlsZXBhdGguXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogLy8gcGljb21hdGNoLm1hdGNoQmFzZShpbnB1dCwgZ2xvYlssIG9wdGlvbnNdKTtcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5tYXRjaEJhc2UoJ2Zvby9iYXIuanMnLCAnKi5qcycpOyAvLyB0cnVlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgaW5wdXRgIFN0cmluZyB0byB0ZXN0LlxuICogQHBhcmFtIHtSZWdFeHB8U3RyaW5nfSBgZ2xvYmAgR2xvYiBwYXR0ZXJuIG9yIHJlZ2V4IGNyZWF0ZWQgYnkgWy5tYWtlUmVdKCNtYWtlUmUpLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLm1hdGNoQmFzZSA9IChpbnB1dCwgZ2xvYiwgb3B0aW9ucywgcG9zaXggPSB1dGlscy5pc1dpbmRvd3Mob3B0aW9ucykpID0+IHtcbiAgY29uc3QgcmVnZXggPSBnbG9iIGluc3RhbmNlb2YgUmVnRXhwID8gZ2xvYiA6IHBpY29tYXRjaC5tYWtlUmUoZ2xvYiwgb3B0aW9ucyk7XG4gIHJldHVybiByZWdleC50ZXN0KHBhdGguYmFzZW5hbWUoaW5wdXQpKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmICoqYW55Kiogb2YgdGhlIGdpdmVuIGdsb2IgYHBhdHRlcm5zYCBtYXRjaCB0aGUgc3BlY2lmaWVkIGBzdHJpbmdgLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC5pc01hdGNoKHN0cmluZywgcGF0dGVybnNbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cocGljb21hdGNoLmlzTWF0Y2goJ2EuYScsIFsnYi4qJywgJyouYSddKSk7IC8vPT4gdHJ1ZVxuICogY29uc29sZS5sb2cocGljb21hdGNoLmlzTWF0Y2goJ2EuYScsICdiLionKSk7IC8vPT4gZmFsc2VcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHN0ciBUaGUgc3RyaW5nIHRvIHRlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcGF0dGVybnMgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucyB0byB1c2UgZm9yIG1hdGNoaW5nLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBTZWUgYXZhaWxhYmxlIFtvcHRpb25zXSgjb3B0aW9ucykuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgYW55IHBhdHRlcm5zIG1hdGNoIGBzdHJgXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5pc01hdGNoID0gKHN0ciwgcGF0dGVybnMsIG9wdGlvbnMpID0+IHBpY29tYXRjaChwYXR0ZXJucywgb3B0aW9ucykoc3RyKTtcblxuLyoqXG4gKiBQYXJzZSBhIGdsb2IgcGF0dGVybiB0byBjcmVhdGUgdGhlIHNvdXJjZSBzdHJpbmcgZm9yIGEgcmVndWxhclxuICogZXhwcmVzc2lvbi5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiBjb25zdCByZXN1bHQgPSBwaWNvbWF0Y2gucGFyc2UocGF0dGVyblssIG9wdGlvbnNdKTtcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBwYXR0ZXJuYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHVzZWZ1bCBwcm9wZXJ0aWVzIGFuZCBvdXRwdXQgdG8gYmUgdXNlZCBhcyBhIHJlZ2V4IHNvdXJjZSBzdHJpbmcuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5wYXJzZSA9IChwYXR0ZXJuLCBvcHRpb25zKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KHBhdHRlcm4pKSByZXR1cm4gcGF0dGVybi5tYXAocCA9PiBwaWNvbWF0Y2gucGFyc2UocCwgb3B0aW9ucykpO1xuICByZXR1cm4gcGFyc2UocGF0dGVybiwgeyAuLi5vcHRpb25zLCBmYXN0cGF0aHM6IGZhbHNlIH0pO1xufTtcblxuLyoqXG4gKiBTY2FuIGEgZ2xvYiBwYXR0ZXJuIHRvIHNlcGFyYXRlIHRoZSBwYXR0ZXJuIGludG8gc2VnbWVudHMuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogLy8gcGljb21hdGNoLnNjYW4oaW5wdXRbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc3QgcmVzdWx0ID0gcGljb21hdGNoLnNjYW4oJyEuL2Zvby8qLmpzJyk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICogeyBwcmVmaXg6ICchLi8nLFxuICogICBpbnB1dDogJyEuL2Zvby8qLmpzJyxcbiAqICAgc3RhcnQ6IDMsXG4gKiAgIGJhc2U6ICdmb28nLFxuICogICBnbG9iOiAnKi5qcycsXG4gKiAgIGlzQnJhY2U6IGZhbHNlLFxuICogICBpc0JyYWNrZXQ6IGZhbHNlLFxuICogICBpc0dsb2I6IHRydWUsXG4gKiAgIGlzRXh0Z2xvYjogZmFsc2UsXG4gKiAgIGlzR2xvYnN0YXI6IGZhbHNlLFxuICogICBuZWdhdGVkOiB0cnVlIH1cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBpbnB1dGAgR2xvYiBwYXR0ZXJuIHRvIHNjYW4uXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGhcbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLnNjYW4gPSAoaW5wdXQsIG9wdGlvbnMpID0+IHNjYW4oaW5wdXQsIG9wdGlvbnMpO1xuXG4vKipcbiAqIENvbXBpbGUgYSByZWd1bGFyIGV4cHJlc3Npb24gZnJvbSB0aGUgYHN0YXRlYCBvYmplY3QgcmV0dXJuZWQgYnkgdGhlXG4gKiBbcGFyc2UoKV0oI3BhcnNlKSBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGBzdGF0ZWBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYHJldHVybk91dHB1dGAgSW50ZW5kZWQgZm9yIGltcGxlbWVudG9ycywgdGhpcyBhcmd1bWVudCBhbGxvd3MgeW91IHRvIHJldHVybiB0aGUgcmF3IG91dHB1dCBmcm9tIHRoZSBwYXJzZXIuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGByZXR1cm5TdGF0ZWAgQWRkcyB0aGUgc3RhdGUgdG8gYSBgc3RhdGVgIHByb3BlcnR5IG9uIHRoZSByZXR1cm5lZCByZWdleC4gVXNlZnVsIGZvciBpbXBsZW1lbnRvcnMgYW5kIGRlYnVnZ2luZy5cbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLmNvbXBpbGVSZSA9IChzdGF0ZSwgb3B0aW9ucywgcmV0dXJuT3V0cHV0ID0gZmFsc2UsIHJldHVyblN0YXRlID0gZmFsc2UpID0+IHtcbiAgaWYgKHJldHVybk91dHB1dCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBzdGF0ZS5vdXRwdXQ7XG4gIH1cblxuICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgY29uc3QgcHJlcGVuZCA9IG9wdHMuY29udGFpbnMgPyAnJyA6ICdeJztcbiAgY29uc3QgYXBwZW5kID0gb3B0cy5jb250YWlucyA/ICcnIDogJyQnO1xuXG4gIGxldCBzb3VyY2UgPSBgJHtwcmVwZW5kfSg/OiR7c3RhdGUub3V0cHV0fSkke2FwcGVuZH1gO1xuICBpZiAoc3RhdGUgJiYgc3RhdGUubmVnYXRlZCA9PT0gdHJ1ZSkge1xuICAgIHNvdXJjZSA9IGBeKD8hJHtzb3VyY2V9KS4qJGA7XG4gIH1cblxuICBjb25zdCByZWdleCA9IHBpY29tYXRjaC50b1JlZ2V4KHNvdXJjZSwgb3B0aW9ucyk7XG4gIGlmIChyZXR1cm5TdGF0ZSA9PT0gdHJ1ZSkge1xuICAgIHJlZ2V4LnN0YXRlID0gc3RhdGU7XG4gIH1cblxuICByZXR1cm4gcmVnZXg7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmcm9tIGEgcGFyc2VkIGdsb2IgcGF0dGVybi5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiBjb25zdCBzdGF0ZSA9IHBpY29tYXRjaC5wYXJzZSgnKi5qcycpO1xuICogLy8gcGljb21hdGNoLmNvbXBpbGVSZShzdGF0ZVssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2guY29tcGlsZVJlKHN0YXRlKSk7XG4gKiAvLz0+IC9eKD86KD8hXFwuKSg/PS4pW14vXSo/XFwuanMpJC9cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBzdGF0ZWAgVGhlIG9iamVjdCByZXR1cm5lZCBmcm9tIHRoZSBgLnBhcnNlYCBtZXRob2QuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGByZXR1cm5PdXRwdXRgIEltcGxlbWVudG9ycyBtYXkgdXNlIHRoaXMgYXJndW1lbnQgdG8gcmV0dXJuIHRoZSBjb21waWxlZCBvdXRwdXQsIGluc3RlYWQgb2YgYSByZWd1bGFyIGV4cHJlc3Npb24uIFRoaXMgaXMgbm90IGV4cG9zZWQgb24gdGhlIG9wdGlvbnMgdG8gcHJldmVudCBlbmQtdXNlcnMgZnJvbSBtdXRhdGluZyB0aGUgcmVzdWx0LlxuICogQHBhcmFtIHtCb29sZWFufSBgcmV0dXJuU3RhdGVgIEltcGxlbWVudG9ycyBtYXkgdXNlIHRoaXMgYXJndW1lbnQgdG8gcmV0dXJuIHRoZSBzdGF0ZSBmcm9tIHRoZSBwYXJzZWQgZ2xvYiB3aXRoIHRoZSByZXR1cm5lZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gKiBAcmV0dXJuIHtSZWdFeHB9IFJldHVybnMgYSByZWdleCBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIHBhdHRlcm4uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5tYWtlUmUgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSwgcmV0dXJuT3V0cHV0ID0gZmFsc2UsIHJldHVyblN0YXRlID0gZmFsc2UpID0+IHtcbiAgaWYgKCFpbnB1dCB8fCB0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBub24tZW1wdHkgc3RyaW5nJyk7XG4gIH1cblxuICBsZXQgcGFyc2VkID0geyBuZWdhdGVkOiBmYWxzZSwgZmFzdHBhdGhzOiB0cnVlIH07XG5cbiAgaWYgKG9wdGlvbnMuZmFzdHBhdGhzICE9PSBmYWxzZSAmJiAoaW5wdXRbMF0gPT09ICcuJyB8fCBpbnB1dFswXSA9PT0gJyonKSkge1xuICAgIHBhcnNlZC5vdXRwdXQgPSBwYXJzZS5mYXN0cGF0aHMoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgaWYgKCFwYXJzZWQub3V0cHV0KSB7XG4gICAgcGFyc2VkID0gcGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIHBpY29tYXRjaC5jb21waWxlUmUocGFyc2VkLCBvcHRpb25zLCByZXR1cm5PdXRwdXQsIHJldHVyblN0YXRlKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIGZyb20gdGhlIGdpdmVuIHJlZ2V4IHNvdXJjZSBzdHJpbmcuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogLy8gcGljb21hdGNoLnRvUmVnZXgoc291cmNlWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnN0IHsgb3V0cHV0IH0gPSBwaWNvbWF0Y2gucGFyc2UoJyouanMnKTtcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC50b1JlZ2V4KG91dHB1dCkpO1xuICogLy89PiAvXig/Oig/IVxcLikoPz0uKVteL10qP1xcLmpzKSQvXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc291cmNlYCBSZWd1bGFyIGV4cHJlc3Npb24gc291cmNlIHN0cmluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLnRvUmVnZXggPSAoc291cmNlLCBvcHRpb25zKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoc291cmNlLCBvcHRzLmZsYWdzIHx8IChvcHRzLm5vY2FzZSA/ICdpJyA6ICcnKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVidWcgPT09IHRydWUpIHRocm93IGVycjtcbiAgICByZXR1cm4gLyReLztcbiAgfVxufTtcblxuLyoqXG4gKiBQaWNvbWF0Y2ggY29uc3RhbnRzLlxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbnBpY29tYXRjaC5jb25zdGFudHMgPSBjb25zdGFudHM7XG5cbi8qKlxuICogRXhwb3NlIFwicGljb21hdGNoXCJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBpY29tYXRjaDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9waWNvbWF0Y2gnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgeyBSZWFkYWJsZSB9ID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5jb25zdCBzeXNQYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgeyBwcm9taXNpZnkgfSA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuXG5jb25zdCByZWFkZGlyID0gcHJvbWlzaWZ5KGZzLnJlYWRkaXIpO1xuY29uc3Qgc3RhdCA9IHByb21pc2lmeShmcy5zdGF0KTtcbmNvbnN0IGxzdGF0ID0gcHJvbWlzaWZ5KGZzLmxzdGF0KTtcbmNvbnN0IHJlYWxwYXRoID0gcHJvbWlzaWZ5KGZzLnJlYWxwYXRoKTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBFbnRyeUluZm9cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwYXRoXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZnVsbFBhdGhcbiAqIEBwcm9wZXJ0eSB7ZnMuU3RhdHM9fSBzdGF0c1xuICogQHByb3BlcnR5IHtmcy5EaXJlbnQ9fSBkaXJlbnRcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBiYXNlbmFtZVxuICovXG5cbmNvbnN0IEJBTkcgPSAnISc7XG5jb25zdCBOT1JNQUxfRkxPV19FUlJPUlMgPSBuZXcgU2V0KFsnRU5PRU5UJywgJ0VQRVJNJywgJ0VBQ0NFUycsICdFTE9PUCddKTtcbmNvbnN0IEZJTEVfVFlQRSA9ICdmaWxlcyc7XG5jb25zdCBESVJfVFlQRSA9ICdkaXJlY3Rvcmllcyc7XG5jb25zdCBGSUxFX0RJUl9UWVBFID0gJ2ZpbGVzX2RpcmVjdG9yaWVzJztcbmNvbnN0IEVWRVJZVEhJTkdfVFlQRSA9ICdhbGwnO1xuY29uc3QgQUxMX1RZUEVTID0gW0ZJTEVfVFlQRSwgRElSX1RZUEUsIEZJTEVfRElSX1RZUEUsIEVWRVJZVEhJTkdfVFlQRV07XG5cbmNvbnN0IGlzTm9ybWFsRmxvd0Vycm9yID0gZXJyb3IgPT4gTk9STUFMX0ZMT1dfRVJST1JTLmhhcyhlcnJvci5jb2RlKTtcblxuY29uc3Qgbm9ybWFsaXplRmlsdGVyID0gZmlsdGVyID0+IHtcbiAgaWYgKGZpbHRlciA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gIGlmICh0eXBlb2YgZmlsdGVyID09PSAnZnVuY3Rpb24nKSByZXR1cm4gZmlsdGVyO1xuXG4gIGlmICh0eXBlb2YgZmlsdGVyID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGdsb2IgPSBwaWNvbWF0Y2goZmlsdGVyLnRyaW0oKSk7XG4gICAgcmV0dXJuIGVudHJ5ID0+IGdsb2IoZW50cnkuYmFzZW5hbWUpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZmlsdGVyKSkge1xuICAgIGNvbnN0IHBvc2l0aXZlID0gW107XG4gICAgY29uc3QgbmVnYXRpdmUgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmlsdGVyKSB7XG4gICAgICBjb25zdCB0cmltbWVkID0gaXRlbS50cmltKCk7XG4gICAgICBpZiAodHJpbW1lZC5jaGFyQXQoMCkgPT09IEJBTkcpIHtcbiAgICAgICAgbmVnYXRpdmUucHVzaChwaWNvbWF0Y2godHJpbW1lZC5zbGljZSgxKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zaXRpdmUucHVzaChwaWNvbWF0Y2godHJpbW1lZCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZWdhdGl2ZS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAocG9zaXRpdmUubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gZW50cnkgPT5cbiAgICAgICAgICBwb3NpdGl2ZS5zb21lKGYgPT4gZihlbnRyeS5iYXNlbmFtZSkpICYmICFuZWdhdGl2ZS5zb21lKGYgPT4gZihlbnRyeS5iYXNlbmFtZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVudHJ5ID0+ICFuZWdhdGl2ZS5zb21lKGYgPT4gZihlbnRyeS5iYXNlbmFtZSkpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnkgPT4gcG9zaXRpdmUuc29tZShmID0+IGYoZW50cnkuYmFzZW5hbWUpKTtcbiAgfVxufTtcblxuY2xhc3MgUmVhZGRpcnBTdHJlYW0gZXh0ZW5kcyBSZWFkYWJsZSB7XG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6ICcuJyxcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICBmaWxlRmlsdGVyOiAocGF0aCkgPT4gdHJ1ZSxcbiAgICAgIGRpcmVjdG9yeUZpbHRlcjogKHBhdGgpID0+IHRydWUsXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICB0eXBlOiBGSUxFX1RZUEUsXG4gICAgICBsc3RhdDogZmFsc2UsXG4gICAgICBkZXB0aDogMjE0NzQ4MzY0OCxcbiAgICAgIGFsd2F5c1N0YXQ6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHtcbiAgICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgICBhdXRvRGVzdHJveTogdHJ1ZSxcbiAgICAgIGhpZ2hXYXRlck1hcms6IG9wdGlvbnMuaGlnaFdhdGVyTWFyayB8fCA0MDk2XG4gICAgfSk7XG4gICAgY29uc3Qgb3B0cyA9IHsgLi4uUmVhZGRpcnBTdHJlYW0uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcbiAgICBjb25zdCB7IHJvb3QsIHR5cGUgfSA9IG9wdHM7XG5cbiAgICB0aGlzLl9maWxlRmlsdGVyID0gbm9ybWFsaXplRmlsdGVyKG9wdHMuZmlsZUZpbHRlcik7XG4gICAgdGhpcy5fZGlyZWN0b3J5RmlsdGVyID0gbm9ybWFsaXplRmlsdGVyKG9wdHMuZGlyZWN0b3J5RmlsdGVyKTtcblxuICAgIGNvbnN0IHN0YXRNZXRob2QgPSBvcHRzLmxzdGF0ID8gbHN0YXQgOiBzdGF0O1xuICAgIC8vIFVzZSBiaWdpbnQgc3RhdHMgaWYgaXQncyB3aW5kb3dzIGFuZCBzdGF0KCkgc3VwcG9ydHMgb3B0aW9ucyAobm9kZSAxMCspLlxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInICYmIHN0YXQubGVuZ3RoID09PSAzKSB7XG4gICAgICB0aGlzLl9zdGF0ID0gcGF0aCA9PiBzdGF0TWV0aG9kKHBhdGgsIHsgYmlnaW50OiB0cnVlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdGF0ID0gc3RhdE1ldGhvZDtcbiAgICB9XG5cbiAgICB0aGlzLl9tYXhEZXB0aCA9IG9wdHMuZGVwdGg7XG4gICAgdGhpcy5fd2FudHNEaXIgPSBbRElSX1RZUEUsIEZJTEVfRElSX1RZUEUsIEVWRVJZVEhJTkdfVFlQRV0uaW5jbHVkZXModHlwZSk7XG4gICAgdGhpcy5fd2FudHNGaWxlID0gW0ZJTEVfVFlQRSwgRklMRV9ESVJfVFlQRSwgRVZFUllUSElOR19UWVBFXS5pbmNsdWRlcyh0eXBlKTtcbiAgICB0aGlzLl93YW50c0V2ZXJ5dGhpbmcgPSB0eXBlID09PSBFVkVSWVRISU5HX1RZUEU7XG4gICAgdGhpcy5fcm9vdCA9IHN5c1BhdGgucmVzb2x2ZShyb290KTtcbiAgICB0aGlzLl9pc0RpcmVudCA9ICgnRGlyZW50JyBpbiBmcykgJiYgIW9wdHMuYWx3YXlzU3RhdDtcbiAgICB0aGlzLl9zdGF0c1Byb3AgPSB0aGlzLl9pc0RpcmVudCA/ICdkaXJlbnQnIDogJ3N0YXRzJztcbiAgICB0aGlzLl9yZE9wdGlvbnMgPSB7IGVuY29kaW5nOiAndXRmOCcsIHdpdGhGaWxlVHlwZXM6IHRoaXMuX2lzRGlyZW50IH07XG5cbiAgICAvLyBMYXVuY2ggc3RyZWFtIHdpdGggb25lIHBhcmVudCwgdGhlIHJvb3QgZGlyLlxuICAgIHRoaXMucGFyZW50cyA9IFt0aGlzLl9leHBsb3JlRGlyKHJvb3QsIDEpXTtcbiAgICB0aGlzLnJlYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGFzeW5jIF9yZWFkKGJhdGNoKSB7XG4gICAgaWYgKHRoaXMucmVhZGluZykgcmV0dXJuO1xuICAgIHRoaXMucmVhZGluZyA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgd2hpbGUgKCF0aGlzLmRlc3Ryb3llZCAmJiBiYXRjaCA+IDApIHtcbiAgICAgICAgY29uc3QgeyBwYXRoLCBkZXB0aCwgZmlsZXMgPSBbXSB9ID0gdGhpcy5wYXJlbnQgfHwge307XG5cbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBzbGljZSA9IGZpbGVzLnNwbGljZSgwLCBiYXRjaCkubWFwKGRpcmVudCA9PiB0aGlzLl9mb3JtYXRFbnRyeShkaXJlbnQsIHBhdGgpKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGF3YWl0IFByb21pc2UuYWxsKHNsaWNlKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IGVudHJ5VHlwZSA9IGF3YWl0IHRoaXMuX2dldEVudHJ5VHlwZShlbnRyeSk7XG4gICAgICAgICAgICBpZiAoZW50cnlUeXBlID09PSAnZGlyZWN0b3J5JyAmJiB0aGlzLl9kaXJlY3RvcnlGaWx0ZXIoZW50cnkpKSB7XG4gICAgICAgICAgICAgIGlmIChkZXB0aCA8PSB0aGlzLl9tYXhEZXB0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50cy5wdXNoKHRoaXMuX2V4cGxvcmVEaXIoZW50cnkuZnVsbFBhdGgsIGRlcHRoICsgMSkpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX3dhbnRzRGlyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICBiYXRjaC0tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChlbnRyeVR5cGUgPT09ICdmaWxlJyB8fCB0aGlzLl9pbmNsdWRlQXNGaWxlKGVudHJ5KSkgJiYgdGhpcy5fZmlsZUZpbHRlcihlbnRyeSkpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuX3dhbnRzRmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaChlbnRyeSk7XG4gICAgICAgICAgICAgICAgYmF0Y2gtLTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudHMucG9wKCk7XG4gICAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaChudWxsKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnBhcmVudCA9IGF3YWl0IHBhcmVudDtcbiAgICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmRlc3Ryb3koZXJyb3IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnJlYWRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBfZXhwbG9yZURpcihwYXRoLCBkZXB0aCkge1xuICAgIGxldCBmaWxlcztcbiAgICB0cnkge1xuICAgICAgZmlsZXMgPSBhd2FpdCByZWFkZGlyKHBhdGgsIHRoaXMuX3JkT3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4ge2ZpbGVzLCBkZXB0aCwgcGF0aH07XG4gIH1cblxuICBhc3luYyBfZm9ybWF0RW50cnkoZGlyZW50LCBwYXRoKSB7XG4gICAgbGV0IGVudHJ5O1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBiYXNlbmFtZSA9IHRoaXMuX2lzRGlyZW50ID8gZGlyZW50Lm5hbWUgOiBkaXJlbnQ7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHN5c1BhdGgucmVzb2x2ZShzeXNQYXRoLmpvaW4ocGF0aCwgYmFzZW5hbWUpKTtcbiAgICAgIGVudHJ5ID0ge3BhdGg6IHN5c1BhdGgucmVsYXRpdmUodGhpcy5fcm9vdCwgZnVsbFBhdGgpLCBmdWxsUGF0aCwgYmFzZW5hbWV9O1xuICAgICAgZW50cnlbdGhpcy5fc3RhdHNQcm9wXSA9IHRoaXMuX2lzRGlyZW50ID8gZGlyZW50IDogYXdhaXQgdGhpcy5fc3RhdChmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLl9vbkVycm9yKGVycik7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeTtcbiAgfVxuXG4gIF9vbkVycm9yKGVycikge1xuICAgIGlmIChpc05vcm1hbEZsb3dFcnJvcihlcnIpICYmICF0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgdGhpcy5lbWl0KCd3YXJuJywgZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXN0cm95KGVycik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX2dldEVudHJ5VHlwZShlbnRyeSkge1xuICAgIC8vIGVudHJ5IG1heSBiZSB1bmRlZmluZWQsIGJlY2F1c2UgYSB3YXJuaW5nIG9yIGFuIGVycm9yIHdlcmUgZW1pdHRlZFxuICAgIC8vIGFuZCB0aGUgc3RhdHNQcm9wIGlzIHVuZGVmaW5lZFxuICAgIGNvbnN0IHN0YXRzID0gZW50cnkgJiYgZW50cnlbdGhpcy5fc3RhdHNQcm9wXTtcbiAgICBpZiAoIXN0YXRzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzdGF0cy5pc0ZpbGUoKSkge1xuICAgICAgcmV0dXJuICdmaWxlJztcbiAgICB9XG4gICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIHJldHVybiAnZGlyZWN0b3J5JztcbiAgICB9XG4gICAgaWYgKHN0YXRzICYmIHN0YXRzLmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgIGNvbnN0IGZ1bGwgPSBlbnRyeS5mdWxsUGF0aDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGVudHJ5UmVhbFBhdGggPSBhd2FpdCByZWFscGF0aChmdWxsKTtcbiAgICAgICAgY29uc3QgZW50cnlSZWFsUGF0aFN0YXRzID0gYXdhaXQgbHN0YXQoZW50cnlSZWFsUGF0aCk7XG4gICAgICAgIGlmIChlbnRyeVJlYWxQYXRoU3RhdHMuaXNGaWxlKCkpIHtcbiAgICAgICAgICByZXR1cm4gJ2ZpbGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeVJlYWxQYXRoU3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgIGNvbnN0IGxlbiA9IGVudHJ5UmVhbFBhdGgubGVuZ3RoO1xuICAgICAgICAgIGlmIChmdWxsLnN0YXJ0c1dpdGgoZW50cnlSZWFsUGF0aCkgJiYgZnVsbC5zdWJzdHIobGVuLCAxKSA9PT0gc3lzUGF0aC5zZXApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkVycm9yKG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYENpcmN1bGFyIHN5bWxpbmsgZGV0ZWN0ZWQ6IFwiJHtmdWxsfVwiIHBvaW50cyB0byBcIiR7ZW50cnlSZWFsUGF0aH1cImBcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ2RpcmVjdG9yeSc7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuX29uRXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9pbmNsdWRlQXNGaWxlKGVudHJ5KSB7XG4gICAgY29uc3Qgc3RhdHMgPSBlbnRyeSAmJiBlbnRyeVt0aGlzLl9zdGF0c1Byb3BdO1xuXG4gICAgcmV0dXJuIHN0YXRzICYmIHRoaXMuX3dhbnRzRXZlcnl0aGluZyAmJiAhc3RhdHMuaXNEaXJlY3RvcnkoKTtcbiAgfVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFJlYWRkaXJwQXJndW1lbnRzXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9uPX0gZmlsZUZpbHRlclxuICogQHByb3BlcnR5IHtGdW5jdGlvbj19IGRpcmVjdG9yeUZpbHRlclxuICogQHByb3BlcnR5IHtTdHJpbmc9fSB0eXBlXG4gKiBAcHJvcGVydHkge051bWJlcj19IGRlcHRoXG4gKiBAcHJvcGVydHkge1N0cmluZz19IHJvb3RcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbj19IGxzdGF0XG4gKiBAcHJvcGVydHkge0Jvb2xlYW49fSBiaWdpbnRcbiAqL1xuXG4vKipcbiAqIE1haW4gZnVuY3Rpb24gd2hpY2ggZW5kcyB1cCBjYWxsaW5nIHJlYWRkaXJSZWMgYW5kIHJlYWRzIGFsbCBmaWxlcyBhbmQgZGlyZWN0b3JpZXMgaW4gZ2l2ZW4gcm9vdCByZWN1cnNpdmVseS5cbiAqIEBwYXJhbSB7U3RyaW5nfSByb290IFJvb3QgZGlyZWN0b3J5XG4gKiBAcGFyYW0ge1JlYWRkaXJwQXJndW1lbnRzPX0gb3B0aW9ucyBPcHRpb25zIHRvIHNwZWNpZnkgcm9vdCAoc3RhcnQgZGlyZWN0b3J5KSwgZmlsdGVycyBhbmQgcmVjdXJzaW9uIGRlcHRoXG4gKi9cbmNvbnN0IHJlYWRkaXJwID0gKHJvb3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgdHlwZSA9IG9wdGlvbnMuZW50cnlUeXBlIHx8IG9wdGlvbnMudHlwZTtcbiAgaWYgKHR5cGUgPT09ICdib3RoJykgdHlwZSA9IEZJTEVfRElSX1RZUEU7IC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5XG4gIGlmICh0eXBlKSBvcHRpb25zLnR5cGUgPSB0eXBlO1xuICBpZiAoIXJvb3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlYWRkaXJwOiByb290IGFyZ3VtZW50IGlzIHJlcXVpcmVkLiBVc2FnZTogcmVhZGRpcnAocm9vdCwgb3B0aW9ucyknKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygcm9vdCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWFkZGlycDogcm9vdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLiBVc2FnZTogcmVhZGRpcnAocm9vdCwgb3B0aW9ucyknKTtcbiAgfSBlbHNlIGlmICh0eXBlICYmICFBTExfVFlQRVMuaW5jbHVkZXModHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHJlYWRkaXJwOiBJbnZhbGlkIHR5cGUgcGFzc2VkLiBVc2Ugb25lIG9mICR7QUxMX1RZUEVTLmpvaW4oJywgJyl9YCk7XG4gIH1cblxuICBvcHRpb25zLnJvb3QgPSByb290O1xuICByZXR1cm4gbmV3IFJlYWRkaXJwU3RyZWFtKG9wdGlvbnMpO1xufTtcblxuY29uc3QgcmVhZGRpcnBQcm9taXNlID0gKHJvb3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGZpbGVzID0gW107XG4gICAgcmVhZGRpcnAocm9vdCwgb3B0aW9ucylcbiAgICAgIC5vbignZGF0YScsIGVudHJ5ID0+IGZpbGVzLnB1c2goZW50cnkpKVxuICAgICAgLm9uKCdlbmQnLCAoKSA9PiByZXNvbHZlKGZpbGVzKSlcbiAgICAgIC5vbignZXJyb3InLCBlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcbiAgfSk7XG59O1xuXG5yZWFkZGlycC5wcm9taXNlID0gcmVhZGRpcnBQcm9taXNlO1xucmVhZGRpcnAuUmVhZGRpcnBTdHJlYW0gPSBSZWFkZGlycFN0cmVhbTtcbnJlYWRkaXJwLmRlZmF1bHQgPSByZWFkZGlycDtcblxubW9kdWxlLmV4cG9ydHMgPSByZWFkZGlycDtcbiIsIi8qIVxuICogbm9ybWFsaXplLXBhdGggPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L25vcm1hbGl6ZS1wYXRoPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE4LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBhdGgsIHN0cmlwVHJhaWxpbmcpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkIHBhdGggdG8gYmUgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIGlmIChwYXRoID09PSAnXFxcXCcgfHwgcGF0aCA9PT0gJy8nKSByZXR1cm4gJy8nO1xuXG4gIHZhciBsZW4gPSBwYXRoLmxlbmd0aDtcbiAgaWYgKGxlbiA8PSAxKSByZXR1cm4gcGF0aDtcblxuICAvLyBlbnN1cmUgdGhhdCB3aW4zMiBuYW1lc3BhY2VzIGhhcyB0d28gbGVhZGluZyBzbGFzaGVzLCBzbyB0aGF0IHRoZSBwYXRoIGlzXG4gIC8vIGhhbmRsZWQgcHJvcGVybHkgYnkgdGhlIHdpbjMyIHZlcnNpb24gb2YgcGF0aC5wYXJzZSgpIGFmdGVyIGJlaW5nIG5vcm1hbGl6ZWRcbiAgLy8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vbGlicmFyeS93aW5kb3dzL2Rlc2t0b3AvYWEzNjUyNDcodj12cy44NSkuYXNweCNuYW1lc3BhY2VzXG4gIHZhciBwcmVmaXggPSAnJztcbiAgaWYgKGxlbiA+IDQgJiYgcGF0aFszXSA9PT0gJ1xcXFwnKSB7XG4gICAgdmFyIGNoID0gcGF0aFsyXTtcbiAgICBpZiAoKGNoID09PSAnPycgfHwgY2ggPT09ICcuJykgJiYgcGF0aC5zbGljZSgwLCAyKSA9PT0gJ1xcXFxcXFxcJykge1xuICAgICAgcGF0aCA9IHBhdGguc2xpY2UoMik7XG4gICAgICBwcmVmaXggPSAnLy8nO1xuICAgIH1cbiAgfVxuXG4gIHZhciBzZWdzID0gcGF0aC5zcGxpdCgvWy9cXFxcXSsvKTtcbiAgaWYgKHN0cmlwVHJhaWxpbmcgIT09IGZhbHNlICYmIHNlZ3Nbc2Vncy5sZW5ndGggLSAxXSA9PT0gJycpIHtcbiAgICBzZWdzLnBvcCgpO1xuICB9XG4gIHJldHVybiBwcmVmaXggKyBzZWdzLmpvaW4oJy8nKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG5jb25zdCBub3JtYWxpemVQYXRoID0gcmVxdWlyZSgnbm9ybWFsaXplLXBhdGgnKTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7KHRlc3RTdHJpbmc6IHN0cmluZykgPT4gYm9vbGVhbn0gQW55bWF0Y2hGblxuICogQHR5cGVkZWYge3N0cmluZ3xSZWdFeHB8QW55bWF0Y2hGbn0gQW55bWF0Y2hQYXR0ZXJuXG4gKiBAdHlwZWRlZiB7QW55bWF0Y2hQYXR0ZXJufEFueW1hdGNoUGF0dGVybltdfSBBbnltYXRjaE1hdGNoZXJcbiAqL1xuY29uc3QgQkFORyA9ICchJztcbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtyZXR1cm5JbmRleDogZmFsc2V9O1xuY29uc3QgYXJyaWZ5ID0gKGl0ZW0pID0+IEFycmF5LmlzQXJyYXkoaXRlbSkgPyBpdGVtIDogW2l0ZW1dO1xuXG4vKipcbiAqIEBwYXJhbSB7QW55bWF0Y2hQYXR0ZXJufSBtYXRjaGVyXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHJldHVybnMge0FueW1hdGNoRm59XG4gKi9cbmNvbnN0IGNyZWF0ZVBhdHRlcm4gPSAobWF0Y2hlciwgb3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIG1hdGNoZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbWF0Y2hlcjtcbiAgfVxuICBpZiAodHlwZW9mIG1hdGNoZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgZ2xvYiA9IHBpY29tYXRjaChtYXRjaGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKHN0cmluZykgPT4gbWF0Y2hlciA9PT0gc3RyaW5nIHx8IGdsb2Ioc3RyaW5nKTtcbiAgfVxuICBpZiAobWF0Y2hlciBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiAoc3RyaW5nKSA9PiBtYXRjaGVyLnRlc3Qoc3RyaW5nKTtcbiAgfVxuICByZXR1cm4gKHN0cmluZykgPT4gZmFsc2U7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fSBwYXR0ZXJuc1xuICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj59IG5lZ1BhdHRlcm5zXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYXJnc1xuICogQHBhcmFtIHtCb29sZWFufSByZXR1cm5JbmRleFxuICogQHJldHVybnMge2Jvb2xlYW58bnVtYmVyfVxuICovXG5jb25zdCBtYXRjaFBhdHRlcm5zID0gKHBhdHRlcm5zLCBuZWdQYXR0ZXJucywgYXJncywgcmV0dXJuSW5kZXgpID0+IHtcbiAgY29uc3QgaXNMaXN0ID0gQXJyYXkuaXNBcnJheShhcmdzKTtcbiAgY29uc3QgX3BhdGggPSBpc0xpc3QgPyBhcmdzWzBdIDogYXJncztcbiAgaWYgKCFpc0xpc3QgJiYgdHlwZW9mIF9wYXRoICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FueW1hdGNoOiBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZzogZ290ICcgK1xuICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKF9wYXRoKSlcbiAgfVxuICBjb25zdCBwYXRoID0gbm9ybWFsaXplUGF0aChfcGF0aCk7XG5cbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG5lZ1BhdHRlcm5zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNvbnN0IG5nbG9iID0gbmVnUGF0dGVybnNbaW5kZXhdO1xuICAgIGlmIChuZ2xvYihwYXRoKSkge1xuICAgICAgcmV0dXJuIHJldHVybkluZGV4ID8gLTEgOiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhcHBsaWVkID0gaXNMaXN0ICYmIFtwYXRoXS5jb25jYXQoYXJncy5zbGljZSgxKSk7XG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBwYXR0ZXJucy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gcGF0dGVybnNbaW5kZXhdO1xuICAgIGlmIChpc0xpc3QgPyBwYXR0ZXJuKC4uLmFwcGxpZWQpIDogcGF0dGVybihwYXRoKSkge1xuICAgICAgcmV0dXJuIHJldHVybkluZGV4ID8gaW5kZXggOiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXR1cm5JbmRleCA/IC0xIDogZmFsc2U7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7QW55bWF0Y2hNYXRjaGVyfSBtYXRjaGVyc1xuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHRlc3RTdHJpbmdcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJucyB7Ym9vbGVhbnxudW1iZXJ8RnVuY3Rpb259XG4gKi9cbmNvbnN0IGFueW1hdGNoID0gKG1hdGNoZXJzLCB0ZXN0U3RyaW5nLCBvcHRpb25zID0gREVGQVVMVF9PUFRJT05TKSA9PiB7XG4gIGlmIChtYXRjaGVycyA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYW55bWF0Y2g6IHNwZWNpZnkgZmlyc3QgYXJndW1lbnQnKTtcbiAgfVxuICBjb25zdCBvcHRzID0gdHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJyA/IHtyZXR1cm5JbmRleDogb3B0aW9uc30gOiBvcHRpb25zO1xuICBjb25zdCByZXR1cm5JbmRleCA9IG9wdHMucmV0dXJuSW5kZXggfHwgZmFsc2U7XG5cbiAgLy8gRWFybHkgY2FjaGUgZm9yIG1hdGNoZXJzLlxuICBjb25zdCBtdGNoZXJzID0gYXJyaWZ5KG1hdGNoZXJzKTtcbiAgY29uc3QgbmVnYXRlZEdsb2JzID0gbXRjaGVyc1xuICAgIC5maWx0ZXIoaXRlbSA9PiB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgJiYgaXRlbS5jaGFyQXQoMCkgPT09IEJBTkcpXG4gICAgLm1hcChpdGVtID0+IGl0ZW0uc2xpY2UoMSkpXG4gICAgLm1hcChpdGVtID0+IHBpY29tYXRjaChpdGVtLCBvcHRzKSk7XG4gIGNvbnN0IHBhdHRlcm5zID0gbXRjaGVyc1xuICAgIC5maWx0ZXIoaXRlbSA9PiB0eXBlb2YgaXRlbSAhPT0gJ3N0cmluZycgfHwgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBpdGVtLmNoYXJBdCgwKSAhPT0gQkFORykpXG4gICAgLm1hcChtYXRjaGVyID0+IGNyZWF0ZVBhdHRlcm4obWF0Y2hlciwgb3B0cykpO1xuXG4gIGlmICh0ZXN0U3RyaW5nID09IG51bGwpIHtcbiAgICByZXR1cm4gKHRlc3RTdHJpbmcsIHJpID0gZmFsc2UpID0+IHtcbiAgICAgIGNvbnN0IHJldHVybkluZGV4ID0gdHlwZW9mIHJpID09PSAnYm9vbGVhbicgPyByaSA6IGZhbHNlO1xuICAgICAgcmV0dXJuIG1hdGNoUGF0dGVybnMocGF0dGVybnMsIG5lZ2F0ZWRHbG9icywgdGVzdFN0cmluZywgcmV0dXJuSW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXRjaFBhdHRlcm5zKHBhdHRlcm5zLCBuZWdhdGVkR2xvYnMsIHRlc3RTdHJpbmcsIHJldHVybkluZGV4KTtcbn07XG5cbmFueW1hdGNoLmRlZmF1bHQgPSBhbnltYXRjaDtcbm1vZHVsZS5leHBvcnRzID0gYW55bWF0Y2g7XG4iLCIvKiFcbiAqIGlzLWV4dGdsb2IgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLWV4dGdsb2I+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTYsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNFeHRnbG9iKHN0cikge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycgfHwgc3RyID09PSAnJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBtYXRjaDtcbiAgd2hpbGUgKChtYXRjaCA9IC8oXFxcXCkufChbQD8hKypdXFwoLipcXCkpL2cuZXhlYyhzdHIpKSkge1xuICAgIGlmIChtYXRjaFsyXSkgcmV0dXJuIHRydWU7XG4gICAgc3RyID0gc3RyLnNsaWNlKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCIvKiFcbiAqIGlzLWdsb2IgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLWdsb2I+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTcsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbnZhciBpc0V4dGdsb2IgPSByZXF1aXJlKCdpcy1leHRnbG9iJyk7XG52YXIgY2hhcnMgPSB7ICd7JzogJ30nLCAnKCc6ICcpJywgJ1snOiAnXSd9O1xudmFyIHN0cmljdENoZWNrID0gZnVuY3Rpb24oc3RyKSB7XG4gIGlmIChzdHJbMF0gPT09ICchJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBwaXBlSW5kZXggPSAtMjtcbiAgdmFyIGNsb3NlU3F1YXJlSW5kZXggPSAtMjtcbiAgdmFyIGNsb3NlQ3VybHlJbmRleCA9IC0yO1xuICB2YXIgY2xvc2VQYXJlbkluZGV4ID0gLTI7XG4gIHZhciBiYWNrU2xhc2hJbmRleCA9IC0yO1xuICB3aGlsZSAoaW5kZXggPCBzdHIubGVuZ3RoKSB7XG4gICAgaWYgKHN0cltpbmRleF0gPT09ICcqJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHN0cltpbmRleCArIDFdID09PSAnPycgJiYgL1tcXF0uKyldLy50ZXN0KHN0cltpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2xvc2VTcXVhcmVJbmRleCAhPT0gLTEgJiYgc3RyW2luZGV4XSA9PT0gJ1snICYmIHN0cltpbmRleCArIDFdICE9PSAnXScpIHtcbiAgICAgIGlmIChjbG9zZVNxdWFyZUluZGV4IDwgaW5kZXgpIHtcbiAgICAgICAgY2xvc2VTcXVhcmVJbmRleCA9IHN0ci5pbmRleE9mKCddJywgaW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKGNsb3NlU3F1YXJlSW5kZXggPiBpbmRleCkge1xuICAgICAgICBpZiAoYmFja1NsYXNoSW5kZXggPT09IC0xIHx8IGJhY2tTbGFzaEluZGV4ID4gY2xvc2VTcXVhcmVJbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJhY2tTbGFzaEluZGV4ID0gc3RyLmluZGV4T2YoJ1xcXFwnLCBpbmRleCk7XG4gICAgICAgIGlmIChiYWNrU2xhc2hJbmRleCA9PT0gLTEgfHwgYmFja1NsYXNoSW5kZXggPiBjbG9zZVNxdWFyZUluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2xvc2VDdXJseUluZGV4ICE9PSAtMSAmJiBzdHJbaW5kZXhdID09PSAneycgJiYgc3RyW2luZGV4ICsgMV0gIT09ICd9Jykge1xuICAgICAgY2xvc2VDdXJseUluZGV4ID0gc3RyLmluZGV4T2YoJ30nLCBpbmRleCk7XG4gICAgICBpZiAoY2xvc2VDdXJseUluZGV4ID4gaW5kZXgpIHtcbiAgICAgICAgYmFja1NsYXNoSW5kZXggPSBzdHIuaW5kZXhPZignXFxcXCcsIGluZGV4KTtcbiAgICAgICAgaWYgKGJhY2tTbGFzaEluZGV4ID09PSAtMSB8fCBiYWNrU2xhc2hJbmRleCA+IGNsb3NlQ3VybHlJbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNsb3NlUGFyZW5JbmRleCAhPT0gLTEgJiYgc3RyW2luZGV4XSA9PT0gJygnICYmIHN0cltpbmRleCArIDFdID09PSAnPycgJiYgL1s6IT1dLy50ZXN0KHN0cltpbmRleCArIDJdKSAmJiBzdHJbaW5kZXggKyAzXSAhPT0gJyknKSB7XG4gICAgICBjbG9zZVBhcmVuSW5kZXggPSBzdHIuaW5kZXhPZignKScsIGluZGV4KTtcbiAgICAgIGlmIChjbG9zZVBhcmVuSW5kZXggPiBpbmRleCkge1xuICAgICAgICBiYWNrU2xhc2hJbmRleCA9IHN0ci5pbmRleE9mKCdcXFxcJywgaW5kZXgpO1xuICAgICAgICBpZiAoYmFja1NsYXNoSW5kZXggPT09IC0xIHx8IGJhY2tTbGFzaEluZGV4ID4gY2xvc2VQYXJlbkluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocGlwZUluZGV4ICE9PSAtMSAmJiBzdHJbaW5kZXhdID09PSAnKCcgJiYgc3RyW2luZGV4ICsgMV0gIT09ICd8Jykge1xuICAgICAgaWYgKHBpcGVJbmRleCA8IGluZGV4KSB7XG4gICAgICAgIHBpcGVJbmRleCA9IHN0ci5pbmRleE9mKCd8JywgaW5kZXgpO1xuICAgICAgfVxuICAgICAgaWYgKHBpcGVJbmRleCAhPT0gLTEgJiYgc3RyW3BpcGVJbmRleCArIDFdICE9PSAnKScpIHtcbiAgICAgICAgY2xvc2VQYXJlbkluZGV4ID0gc3RyLmluZGV4T2YoJyknLCBwaXBlSW5kZXgpO1xuICAgICAgICBpZiAoY2xvc2VQYXJlbkluZGV4ID4gcGlwZUluZGV4KSB7XG4gICAgICAgICAgYmFja1NsYXNoSW5kZXggPSBzdHIuaW5kZXhPZignXFxcXCcsIHBpcGVJbmRleCk7XG4gICAgICAgICAgaWYgKGJhY2tTbGFzaEluZGV4ID09PSAtMSB8fCBiYWNrU2xhc2hJbmRleCA+IGNsb3NlUGFyZW5JbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0cltpbmRleF0gPT09ICdcXFxcJykge1xuICAgICAgdmFyIG9wZW4gPSBzdHJbaW5kZXggKyAxXTtcbiAgICAgIGluZGV4ICs9IDI7XG4gICAgICB2YXIgY2xvc2UgPSBjaGFyc1tvcGVuXTtcblxuICAgICAgaWYgKGNsb3NlKSB7XG4gICAgICAgIHZhciBuID0gc3RyLmluZGV4T2YoY2xvc2UsIGluZGV4KTtcbiAgICAgICAgaWYgKG4gIT09IC0xKSB7XG4gICAgICAgICAgaW5kZXggPSBuICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RyW2luZGV4XSA9PT0gJyEnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG52YXIgcmVsYXhlZENoZWNrID0gZnVuY3Rpb24oc3RyKSB7XG4gIGlmIChzdHJbMF0gPT09ICchJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBpbmRleCA9IDA7XG4gIHdoaWxlIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcbiAgICBpZiAoL1sqP3t9KClbXFxdXS8udGVzdChzdHJbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHN0cltpbmRleF0gPT09ICdcXFxcJykge1xuICAgICAgdmFyIG9wZW4gPSBzdHJbaW5kZXggKyAxXTtcbiAgICAgIGluZGV4ICs9IDI7XG4gICAgICB2YXIgY2xvc2UgPSBjaGFyc1tvcGVuXTtcblxuICAgICAgaWYgKGNsb3NlKSB7XG4gICAgICAgIHZhciBuID0gc3RyLmluZGV4T2YoY2xvc2UsIGluZGV4KTtcbiAgICAgICAgaWYgKG4gIT09IC0xKSB7XG4gICAgICAgICAgaW5kZXggPSBuICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RyW2luZGV4XSA9PT0gJyEnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzR2xvYihzdHIsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnIHx8IHN0ciA9PT0gJycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNFeHRnbG9iKHN0cikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBjaGVjayA9IHN0cmljdENoZWNrO1xuXG4gIC8vIG9wdGlvbmFsbHkgcmVsYXggY2hlY2tcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zdHJpY3QgPT09IGZhbHNlKSB7XG4gICAgY2hlY2sgPSByZWxheGVkQ2hlY2s7XG4gIH1cblxuICByZXR1cm4gY2hlY2soc3RyKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0dsb2IgPSByZXF1aXJlKCdpcy1nbG9iJyk7XG52YXIgcGF0aFBvc2l4RGlybmFtZSA9IHJlcXVpcmUoJ3BhdGgnKS5wb3NpeC5kaXJuYW1lO1xudmFyIGlzV2luMzIgPSByZXF1aXJlKCdvcycpLnBsYXRmb3JtKCkgPT09ICd3aW4zMic7XG5cbnZhciBzbGFzaCA9ICcvJztcbnZhciBiYWNrc2xhc2ggPSAvXFxcXC9nO1xudmFyIGVuY2xvc3VyZSA9IC9bXFx7XFxbXS4qW1xcfVxcXV0kLztcbnZhciBnbG9iYnkgPSAvKF58W15cXFxcXSkoW1xce1xcW118XFwoW15cXCldKyQpLztcbnZhciBlc2NhcGVkID0gL1xcXFwoW1xcIVxcKlxcP1xcfFxcW1xcXVxcKFxcKVxce1xcfV0pL2c7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuZmxpcEJhY2tzbGFzaGVzPXRydWVdXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdsb2JQYXJlbnQoc3RyLCBvcHRzKSB7XG4gIHZhciBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGZsaXBCYWNrc2xhc2hlczogdHJ1ZSB9LCBvcHRzKTtcblxuICAvLyBmbGlwIHdpbmRvd3MgcGF0aCBzZXBhcmF0b3JzXG4gIGlmIChvcHRpb25zLmZsaXBCYWNrc2xhc2hlcyAmJiBpc1dpbjMyICYmIHN0ci5pbmRleE9mKHNsYXNoKSA8IDApIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShiYWNrc2xhc2gsIHNsYXNoKTtcbiAgfVxuXG4gIC8vIHNwZWNpYWwgY2FzZSBmb3Igc3RyaW5ncyBlbmRpbmcgaW4gZW5jbG9zdXJlIGNvbnRhaW5pbmcgcGF0aCBzZXBhcmF0b3JcbiAgaWYgKGVuY2xvc3VyZS50ZXN0KHN0cikpIHtcbiAgICBzdHIgKz0gc2xhc2g7XG4gIH1cblxuICAvLyBwcmVzZXJ2ZXMgZnVsbCBwYXRoIGluIGNhc2Ugb2YgdHJhaWxpbmcgcGF0aCBzZXBhcmF0b3JcbiAgc3RyICs9ICdhJztcblxuICAvLyByZW1vdmUgcGF0aCBwYXJ0cyB0aGF0IGFyZSBnbG9iYnlcbiAgZG8ge1xuICAgIHN0ciA9IHBhdGhQb3NpeERpcm5hbWUoc3RyKTtcbiAgfSB3aGlsZSAoaXNHbG9iKHN0cikgfHwgZ2xvYmJ5LnRlc3Qoc3RyKSk7XG5cbiAgLy8gcmVtb3ZlIGVzY2FwZSBjaGFycyBhbmQgcmV0dXJuIHJlc3VsdFxuICByZXR1cm4gc3RyLnJlcGxhY2UoZXNjYXBlZCwgJyQxJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmlzSW50ZWdlciA9IG51bSA9PiB7XG4gIGlmICh0eXBlb2YgbnVtID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG51bSk7XG4gIH1cbiAgaWYgKHR5cGVvZiBudW0gPT09ICdzdHJpbmcnICYmIG51bS50cmltKCkgIT09ICcnKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoTnVtYmVyKG51bSkpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogRmluZCBhIG5vZGUgb2YgdGhlIGdpdmVuIHR5cGVcbiAqL1xuXG5leHBvcnRzLmZpbmQgPSAobm9kZSwgdHlwZSkgPT4gbm9kZS5ub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS50eXBlID09PSB0eXBlKTtcblxuLyoqXG4gKiBGaW5kIGEgbm9kZSBvZiB0aGUgZ2l2ZW4gdHlwZVxuICovXG5cbmV4cG9ydHMuZXhjZWVkc0xpbWl0ID0gKG1pbiwgbWF4LCBzdGVwID0gMSwgbGltaXQpID0+IHtcbiAgaWYgKGxpbWl0ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoIWV4cG9ydHMuaXNJbnRlZ2VyKG1pbikgfHwgIWV4cG9ydHMuaXNJbnRlZ2VyKG1heCkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuICgoTnVtYmVyKG1heCkgLSBOdW1iZXIobWluKSkgLyBOdW1iZXIoc3RlcCkpID49IGxpbWl0O1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIG5vZGUgd2l0aCAnXFxcXCcgYmVmb3JlIG5vZGUudmFsdWVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZU5vZGUgPSAoYmxvY2ssIG4gPSAwLCB0eXBlKSA9PiB7XG4gIGxldCBub2RlID0gYmxvY2subm9kZXNbbl07XG4gIGlmICghbm9kZSkgcmV0dXJuO1xuXG4gIGlmICgodHlwZSAmJiBub2RlLnR5cGUgPT09IHR5cGUpIHx8IG5vZGUudHlwZSA9PT0gJ29wZW4nIHx8IG5vZGUudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgIGlmIChub2RlLmVzY2FwZWQgIT09IHRydWUpIHtcbiAgICAgIG5vZGUudmFsdWUgPSAnXFxcXCcgKyBub2RlLnZhbHVlO1xuICAgICAgbm9kZS5lc2NhcGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBicmFjZSBub2RlIHNob3VsZCBiZSBlbmNsb3NlZCBpbiBsaXRlcmFsIGJyYWNlc1xuICovXG5cbmV4cG9ydHMuZW5jbG9zZUJyYWNlID0gbm9kZSA9PiB7XG4gIGlmIChub2RlLnR5cGUgIT09ICdicmFjZScpIHJldHVybiBmYWxzZTtcbiAgaWYgKChub2RlLmNvbW1hcyA+PiAwICsgbm9kZS5yYW5nZXMgPj4gMCkgPT09IDApIHtcbiAgICBub2RlLmludmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgYnJhY2Ugbm9kZSBpcyBpbnZhbGlkLlxuICovXG5cbmV4cG9ydHMuaXNJbnZhbGlkQnJhY2UgPSBibG9jayA9PiB7XG4gIGlmIChibG9jay50eXBlICE9PSAnYnJhY2UnKSByZXR1cm4gZmFsc2U7XG4gIGlmIChibG9jay5pbnZhbGlkID09PSB0cnVlIHx8IGJsb2NrLmRvbGxhcikgcmV0dXJuIHRydWU7XG4gIGlmICgoYmxvY2suY29tbWFzID4+IDAgKyBibG9jay5yYW5nZXMgPj4gMCkgPT09IDApIHtcbiAgICBibG9jay5pbnZhbGlkID0gdHJ1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYmxvY2sub3BlbiAhPT0gdHJ1ZSB8fCBibG9jay5jbG9zZSAhPT0gdHJ1ZSkge1xuICAgIGJsb2NrLmludmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgbm9kZSBpcyBhbiBvcGVuIG9yIGNsb3NlIG5vZGVcbiAqL1xuXG5leHBvcnRzLmlzT3Blbk9yQ2xvc2UgPSBub2RlID0+IHtcbiAgaWYgKG5vZGUudHlwZSA9PT0gJ29wZW4nIHx8IG5vZGUudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBub2RlLm9wZW4gPT09IHRydWUgfHwgbm9kZS5jbG9zZSA9PT0gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVkdWNlIGFuIGFycmF5IG9mIHRleHQgbm9kZXMuXG4gKi9cblxuZXhwb3J0cy5yZWR1Y2UgPSBub2RlcyA9PiBub2Rlcy5yZWR1Y2UoKGFjYywgbm9kZSkgPT4ge1xuICBpZiAobm9kZS50eXBlID09PSAndGV4dCcpIGFjYy5wdXNoKG5vZGUudmFsdWUpO1xuICBpZiAobm9kZS50eXBlID09PSAncmFuZ2UnKSBub2RlLnR5cGUgPSAndGV4dCc7XG4gIHJldHVybiBhY2M7XG59LCBbXSk7XG5cbi8qKlxuICogRmxhdHRlbiBhbiBhcnJheVxuICovXG5cbmV4cG9ydHMuZmxhdHRlbiA9ICguLi5hcmdzKSA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBjb25zdCBmbGF0ID0gYXJyID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVsZSA9IGFycltpXTtcbiAgICAgIEFycmF5LmlzQXJyYXkoZWxlKSA/IGZsYXQoZWxlLCByZXN1bHQpIDogZWxlICE9PSB2b2lkIDAgJiYgcmVzdWx0LnB1c2goZWxlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgZmxhdChhcmdzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhc3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgc3RyaW5naWZ5ID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbGV0IGludmFsaWRCbG9jayA9IG9wdGlvbnMuZXNjYXBlSW52YWxpZCAmJiB1dGlscy5pc0ludmFsaWRCcmFjZShwYXJlbnQpO1xuICAgIGxldCBpbnZhbGlkTm9kZSA9IG5vZGUuaW52YWxpZCA9PT0gdHJ1ZSAmJiBvcHRpb25zLmVzY2FwZUludmFsaWQgPT09IHRydWU7XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIGlmICgoaW52YWxpZEJsb2NrIHx8IGludmFsaWROb2RlKSAmJiB1dGlscy5pc09wZW5PckNsb3NlKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiAnXFxcXCcgKyBub2RlLnZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIHJldHVybiBub2RlLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzKSB7XG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBub2RlLm5vZGVzKSB7XG4gICAgICAgIG91dHB1dCArPSBzdHJpbmdpZnkoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJldHVybiBzdHJpbmdpZnkoYXN0KTtcbn07XG5cbiIsIi8qIVxuICogaXMtbnVtYmVyIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1udW1iZXI+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihudW0pIHtcbiAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG51bSAtIG51bSA9PT0gMDtcbiAgfVxuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycgJiYgbnVtLnRyaW0oKSAhPT0gJycpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzRmluaXRlID8gTnVtYmVyLmlzRmluaXRlKCtudW0pIDogaXNGaW5pdGUoK251bSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIi8qIVxuICogdG8tcmVnZXgtcmFuZ2UgPGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb21hdGNoL3RvLXJlZ2V4LXJhbmdlPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IGlzTnVtYmVyID0gcmVxdWlyZSgnaXMtbnVtYmVyJyk7XG5cbmNvbnN0IHRvUmVnZXhSYW5nZSA9IChtaW4sIG1heCwgb3B0aW9ucykgPT4ge1xuICBpZiAoaXNOdW1iZXIobWluKSA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0b1JlZ2V4UmFuZ2U6IGV4cGVjdGVkIHRoZSBmaXJzdCBhcmd1bWVudCB0byBiZSBhIG51bWJlcicpO1xuICB9XG5cbiAgaWYgKG1heCA9PT0gdm9pZCAwIHx8IG1pbiA9PT0gbWF4KSB7XG4gICAgcmV0dXJuIFN0cmluZyhtaW4pO1xuICB9XG5cbiAgaWYgKGlzTnVtYmVyKG1heCkgPT09IGZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndG9SZWdleFJhbmdlOiBleHBlY3RlZCB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIGJlIGEgbnVtYmVyLicpO1xuICB9XG5cbiAgbGV0IG9wdHMgPSB7IHJlbGF4WmVyb3M6IHRydWUsIC4uLm9wdGlvbnMgfTtcbiAgaWYgKHR5cGVvZiBvcHRzLnN0cmljdFplcm9zID09PSAnYm9vbGVhbicpIHtcbiAgICBvcHRzLnJlbGF4WmVyb3MgPSBvcHRzLnN0cmljdFplcm9zID09PSBmYWxzZTtcbiAgfVxuXG4gIGxldCByZWxheCA9IFN0cmluZyhvcHRzLnJlbGF4WmVyb3MpO1xuICBsZXQgc2hvcnRoYW5kID0gU3RyaW5nKG9wdHMuc2hvcnRoYW5kKTtcbiAgbGV0IGNhcHR1cmUgPSBTdHJpbmcob3B0cy5jYXB0dXJlKTtcbiAgbGV0IHdyYXAgPSBTdHJpbmcob3B0cy53cmFwKTtcbiAgbGV0IGNhY2hlS2V5ID0gbWluICsgJzonICsgbWF4ICsgJz0nICsgcmVsYXggKyBzaG9ydGhhbmQgKyBjYXB0dXJlICsgd3JhcDtcblxuICBpZiAodG9SZWdleFJhbmdlLmNhY2hlLmhhc093blByb3BlcnR5KGNhY2hlS2V5KSkge1xuICAgIHJldHVybiB0b1JlZ2V4UmFuZ2UuY2FjaGVbY2FjaGVLZXldLnJlc3VsdDtcbiAgfVxuXG4gIGxldCBhID0gTWF0aC5taW4obWluLCBtYXgpO1xuICBsZXQgYiA9IE1hdGgubWF4KG1pbiwgbWF4KTtcblxuICBpZiAoTWF0aC5hYnMoYSAtIGIpID09PSAxKSB7XG4gICAgbGV0IHJlc3VsdCA9IG1pbiArICd8JyArIG1heDtcbiAgICBpZiAob3B0cy5jYXB0dXJlKSB7XG4gICAgICByZXR1cm4gYCgke3Jlc3VsdH0pYDtcbiAgICB9XG4gICAgaWYgKG9wdHMud3JhcCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiBgKD86JHtyZXN1bHR9KWA7XG4gIH1cblxuICBsZXQgaXNQYWRkZWQgPSBoYXNQYWRkaW5nKG1pbikgfHwgaGFzUGFkZGluZyhtYXgpO1xuICBsZXQgc3RhdGUgPSB7IG1pbiwgbWF4LCBhLCBiIH07XG4gIGxldCBwb3NpdGl2ZXMgPSBbXTtcbiAgbGV0IG5lZ2F0aXZlcyA9IFtdO1xuXG4gIGlmIChpc1BhZGRlZCkge1xuICAgIHN0YXRlLmlzUGFkZGVkID0gaXNQYWRkZWQ7XG4gICAgc3RhdGUubWF4TGVuID0gU3RyaW5nKHN0YXRlLm1heCkubGVuZ3RoO1xuICB9XG5cbiAgaWYgKGEgPCAwKSB7XG4gICAgbGV0IG5ld01pbiA9IGIgPCAwID8gTWF0aC5hYnMoYikgOiAxO1xuICAgIG5lZ2F0aXZlcyA9IHNwbGl0VG9QYXR0ZXJucyhuZXdNaW4sIE1hdGguYWJzKGEpLCBzdGF0ZSwgb3B0cyk7XG4gICAgYSA9IHN0YXRlLmEgPSAwO1xuICB9XG5cbiAgaWYgKGIgPj0gMCkge1xuICAgIHBvc2l0aXZlcyA9IHNwbGl0VG9QYXR0ZXJucyhhLCBiLCBzdGF0ZSwgb3B0cyk7XG4gIH1cblxuICBzdGF0ZS5uZWdhdGl2ZXMgPSBuZWdhdGl2ZXM7XG4gIHN0YXRlLnBvc2l0aXZlcyA9IHBvc2l0aXZlcztcbiAgc3RhdGUucmVzdWx0ID0gY29sbGF0ZVBhdHRlcm5zKG5lZ2F0aXZlcywgcG9zaXRpdmVzLCBvcHRzKTtcblxuICBpZiAob3B0cy5jYXB0dXJlID09PSB0cnVlKSB7XG4gICAgc3RhdGUucmVzdWx0ID0gYCgke3N0YXRlLnJlc3VsdH0pYDtcbiAgfSBlbHNlIGlmIChvcHRzLndyYXAgIT09IGZhbHNlICYmIChwb3NpdGl2ZXMubGVuZ3RoICsgbmVnYXRpdmVzLmxlbmd0aCkgPiAxKSB7XG4gICAgc3RhdGUucmVzdWx0ID0gYCg/OiR7c3RhdGUucmVzdWx0fSlgO1xuICB9XG5cbiAgdG9SZWdleFJhbmdlLmNhY2hlW2NhY2hlS2V5XSA9IHN0YXRlO1xuICByZXR1cm4gc3RhdGUucmVzdWx0O1xufTtcblxuZnVuY3Rpb24gY29sbGF0ZVBhdHRlcm5zKG5lZywgcG9zLCBvcHRpb25zKSB7XG4gIGxldCBvbmx5TmVnYXRpdmUgPSBmaWx0ZXJQYXR0ZXJucyhuZWcsIHBvcywgJy0nLCBmYWxzZSwgb3B0aW9ucykgfHwgW107XG4gIGxldCBvbmx5UG9zaXRpdmUgPSBmaWx0ZXJQYXR0ZXJucyhwb3MsIG5lZywgJycsIGZhbHNlLCBvcHRpb25zKSB8fCBbXTtcbiAgbGV0IGludGVyc2VjdGVkID0gZmlsdGVyUGF0dGVybnMobmVnLCBwb3MsICctPycsIHRydWUsIG9wdGlvbnMpIHx8IFtdO1xuICBsZXQgc3VicGF0dGVybnMgPSBvbmx5TmVnYXRpdmUuY29uY2F0KGludGVyc2VjdGVkKS5jb25jYXQob25seVBvc2l0aXZlKTtcbiAgcmV0dXJuIHN1YnBhdHRlcm5zLmpvaW4oJ3wnKTtcbn1cblxuZnVuY3Rpb24gc3BsaXRUb1JhbmdlcyhtaW4sIG1heCkge1xuICBsZXQgbmluZXMgPSAxO1xuICBsZXQgemVyb3MgPSAxO1xuXG4gIGxldCBzdG9wID0gY291bnROaW5lcyhtaW4sIG5pbmVzKTtcbiAgbGV0IHN0b3BzID0gbmV3IFNldChbbWF4XSk7XG5cbiAgd2hpbGUgKG1pbiA8PSBzdG9wICYmIHN0b3AgPD0gbWF4KSB7XG4gICAgc3RvcHMuYWRkKHN0b3ApO1xuICAgIG5pbmVzICs9IDE7XG4gICAgc3RvcCA9IGNvdW50TmluZXMobWluLCBuaW5lcyk7XG4gIH1cblxuICBzdG9wID0gY291bnRaZXJvcyhtYXggKyAxLCB6ZXJvcykgLSAxO1xuXG4gIHdoaWxlIChtaW4gPCBzdG9wICYmIHN0b3AgPD0gbWF4KSB7XG4gICAgc3RvcHMuYWRkKHN0b3ApO1xuICAgIHplcm9zICs9IDE7XG4gICAgc3RvcCA9IGNvdW50WmVyb3MobWF4ICsgMSwgemVyb3MpIC0gMTtcbiAgfVxuXG4gIHN0b3BzID0gWy4uLnN0b3BzXTtcbiAgc3RvcHMuc29ydChjb21wYXJlKTtcbiAgcmV0dXJuIHN0b3BzO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSByYW5nZSB0byBhIHJlZ2V4IHBhdHRlcm5cbiAqIEBwYXJhbSB7TnVtYmVyfSBgc3RhcnRgXG4gKiBAcGFyYW0ge051bWJlcn0gYHN0b3BgXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gcmFuZ2VUb1BhdHRlcm4oc3RhcnQsIHN0b3AsIG9wdGlvbnMpIHtcbiAgaWYgKHN0YXJ0ID09PSBzdG9wKSB7XG4gICAgcmV0dXJuIHsgcGF0dGVybjogc3RhcnQsIGNvdW50OiBbXSwgZGlnaXRzOiAwIH07XG4gIH1cblxuICBsZXQgemlwcGVkID0gemlwKHN0YXJ0LCBzdG9wKTtcbiAgbGV0IGRpZ2l0cyA9IHppcHBlZC5sZW5ndGg7XG4gIGxldCBwYXR0ZXJuID0gJyc7XG4gIGxldCBjb3VudCA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWdpdHM7IGkrKykge1xuICAgIGxldCBbc3RhcnREaWdpdCwgc3RvcERpZ2l0XSA9IHppcHBlZFtpXTtcblxuICAgIGlmIChzdGFydERpZ2l0ID09PSBzdG9wRGlnaXQpIHtcbiAgICAgIHBhdHRlcm4gKz0gc3RhcnREaWdpdDtcblxuICAgIH0gZWxzZSBpZiAoc3RhcnREaWdpdCAhPT0gJzAnIHx8IHN0b3BEaWdpdCAhPT0gJzknKSB7XG4gICAgICBwYXR0ZXJuICs9IHRvQ2hhcmFjdGVyQ2xhc3Moc3RhcnREaWdpdCwgc3RvcERpZ2l0LCBvcHRpb25zKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjb3VudCkge1xuICAgIHBhdHRlcm4gKz0gb3B0aW9ucy5zaG9ydGhhbmQgPT09IHRydWUgPyAnXFxcXGQnIDogJ1swLTldJztcbiAgfVxuXG4gIHJldHVybiB7IHBhdHRlcm4sIGNvdW50OiBbY291bnRdLCBkaWdpdHMgfTtcbn1cblxuZnVuY3Rpb24gc3BsaXRUb1BhdHRlcm5zKG1pbiwgbWF4LCB0b2ssIG9wdGlvbnMpIHtcbiAgbGV0IHJhbmdlcyA9IHNwbGl0VG9SYW5nZXMobWluLCBtYXgpO1xuICBsZXQgdG9rZW5zID0gW107XG4gIGxldCBzdGFydCA9IG1pbjtcbiAgbGV0IHByZXY7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgbWF4ID0gcmFuZ2VzW2ldO1xuICAgIGxldCBvYmogPSByYW5nZVRvUGF0dGVybihTdHJpbmcoc3RhcnQpLCBTdHJpbmcobWF4KSwgb3B0aW9ucyk7XG4gICAgbGV0IHplcm9zID0gJyc7XG5cbiAgICBpZiAoIXRvay5pc1BhZGRlZCAmJiBwcmV2ICYmIHByZXYucGF0dGVybiA9PT0gb2JqLnBhdHRlcm4pIHtcbiAgICAgIGlmIChwcmV2LmNvdW50Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcHJldi5jb3VudC5wb3AoKTtcbiAgICAgIH1cblxuICAgICAgcHJldi5jb3VudC5wdXNoKG9iai5jb3VudFswXSk7XG4gICAgICBwcmV2LnN0cmluZyA9IHByZXYucGF0dGVybiArIHRvUXVhbnRpZmllcihwcmV2LmNvdW50KTtcbiAgICAgIHN0YXJ0ID0gbWF4ICsgMTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh0b2suaXNQYWRkZWQpIHtcbiAgICAgIHplcm9zID0gcGFkWmVyb3MobWF4LCB0b2ssIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIG9iai5zdHJpbmcgPSB6ZXJvcyArIG9iai5wYXR0ZXJuICsgdG9RdWFudGlmaWVyKG9iai5jb3VudCk7XG4gICAgdG9rZW5zLnB1c2gob2JqKTtcbiAgICBzdGFydCA9IG1heCArIDE7XG4gICAgcHJldiA9IG9iajtcbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG5cbmZ1bmN0aW9uIGZpbHRlclBhdHRlcm5zKGFyciwgY29tcGFyaXNvbiwgcHJlZml4LCBpbnRlcnNlY3Rpb24sIG9wdGlvbnMpIHtcbiAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gIGZvciAobGV0IGVsZSBvZiBhcnIpIHtcbiAgICBsZXQgeyBzdHJpbmcgfSA9IGVsZTtcblxuICAgIC8vIG9ubHkgcHVzaCBpZiBfYm90aF8gYXJlIG5lZ2F0aXZlLi4uXG4gICAgaWYgKCFpbnRlcnNlY3Rpb24gJiYgIWNvbnRhaW5zKGNvbXBhcmlzb24sICdzdHJpbmcnLCBzdHJpbmcpKSB7XG4gICAgICByZXN1bHQucHVzaChwcmVmaXggKyBzdHJpbmcpO1xuICAgIH1cblxuICAgIC8vIG9yIF9ib3RoXyBhcmUgcG9zaXRpdmVcbiAgICBpZiAoaW50ZXJzZWN0aW9uICYmIGNvbnRhaW5zKGNvbXBhcmlzb24sICdzdHJpbmcnLCBzdHJpbmcpKSB7XG4gICAgICByZXN1bHQucHVzaChwcmVmaXggKyBzdHJpbmcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFppcCBzdHJpbmdzXG4gKi9cblxuZnVuY3Rpb24gemlwKGEsIGIpIHtcbiAgbGV0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIGFyci5wdXNoKFthW2ldLCBiW2ldXSk7XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICByZXR1cm4gYSA+IGIgPyAxIDogYiA+IGEgPyAtMSA6IDA7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zKGFyciwga2V5LCB2YWwpIHtcbiAgcmV0dXJuIGFyci5zb21lKGVsZSA9PiBlbGVba2V5XSA9PT0gdmFsKTtcbn1cblxuZnVuY3Rpb24gY291bnROaW5lcyhtaW4sIGxlbikge1xuICByZXR1cm4gTnVtYmVyKFN0cmluZyhtaW4pLnNsaWNlKDAsIC1sZW4pICsgJzknLnJlcGVhdChsZW4pKTtcbn1cblxuZnVuY3Rpb24gY291bnRaZXJvcyhpbnRlZ2VyLCB6ZXJvcykge1xuICByZXR1cm4gaW50ZWdlciAtIChpbnRlZ2VyICUgTWF0aC5wb3coMTAsIHplcm9zKSk7XG59XG5cbmZ1bmN0aW9uIHRvUXVhbnRpZmllcihkaWdpdHMpIHtcbiAgbGV0IFtzdGFydCA9IDAsIHN0b3AgPSAnJ10gPSBkaWdpdHM7XG4gIGlmIChzdG9wIHx8IHN0YXJ0ID4gMSkge1xuICAgIHJldHVybiBgeyR7c3RhcnQgKyAoc3RvcCA/ICcsJyArIHN0b3AgOiAnJyl9fWA7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiB0b0NoYXJhY3RlckNsYXNzKGEsIGIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGBbJHthfSR7KGIgLSBhID09PSAxKSA/ICcnIDogJy0nfSR7Yn1dYDtcbn1cblxuZnVuY3Rpb24gaGFzUGFkZGluZyhzdHIpIHtcbiAgcmV0dXJuIC9eLT8oMCspXFxkLy50ZXN0KHN0cik7XG59XG5cbmZ1bmN0aW9uIHBhZFplcm9zKHZhbHVlLCB0b2ssIG9wdGlvbnMpIHtcbiAgaWYgKCF0b2suaXNQYWRkZWQpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBsZXQgZGlmZiA9IE1hdGguYWJzKHRvay5tYXhMZW4gLSBTdHJpbmcodmFsdWUpLmxlbmd0aCk7XG4gIGxldCByZWxheCA9IG9wdGlvbnMucmVsYXhaZXJvcyAhPT0gZmFsc2U7XG5cbiAgc3dpdGNoIChkaWZmKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuICcnO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiByZWxheCA/ICcwPycgOiAnMCc7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIHJlbGF4ID8gJzB7MCwyfScgOiAnMDAnO1xuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiByZWxheCA/IGAwezAsJHtkaWZmfX1gIDogYDB7JHtkaWZmfX1gO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENhY2hlXG4gKi9cblxudG9SZWdleFJhbmdlLmNhY2hlID0ge307XG50b1JlZ2V4UmFuZ2UuY2xlYXJDYWNoZSA9ICgpID0+ICh0b1JlZ2V4UmFuZ2UuY2FjaGUgPSB7fSk7XG5cbi8qKlxuICogRXhwb3NlIGB0b1JlZ2V4UmFuZ2VgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b1JlZ2V4UmFuZ2U7XG4iLCIvKiFcbiAqIGZpbGwtcmFuZ2UgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2ZpbGwtcmFuZ2U+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IHRvUmVnZXhSYW5nZSA9IHJlcXVpcmUoJ3RvLXJlZ2V4LXJhbmdlJyk7XG5cbmNvbnN0IGlzT2JqZWN0ID0gdmFsID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuXG5jb25zdCB0cmFuc2Zvcm0gPSB0b051bWJlciA9PiB7XG4gIHJldHVybiB2YWx1ZSA9PiB0b051bWJlciA9PT0gdHJ1ZSA/IE51bWJlcih2YWx1ZSkgOiBTdHJpbmcodmFsdWUpO1xufTtcblxuY29uc3QgaXNWYWxpZFZhbHVlID0gdmFsdWUgPT4ge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gJycpO1xufTtcblxuY29uc3QgaXNOdW1iZXIgPSBudW0gPT4gTnVtYmVyLmlzSW50ZWdlcigrbnVtKTtcblxuY29uc3QgemVyb3MgPSBpbnB1dCA9PiB7XG4gIGxldCB2YWx1ZSA9IGAke2lucHV0fWA7XG4gIGxldCBpbmRleCA9IC0xO1xuICBpZiAodmFsdWVbMF0gPT09ICctJykgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgaWYgKHZhbHVlID09PSAnMCcpIHJldHVybiBmYWxzZTtcbiAgd2hpbGUgKHZhbHVlWysraW5kZXhdID09PSAnMCcpO1xuICByZXR1cm4gaW5kZXggPiAwO1xufTtcblxuY29uc3Qgc3RyaW5naWZ5ID0gKHN0YXJ0LCBlbmQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucy5zdHJpbmdpZnkgPT09IHRydWU7XG59O1xuXG5jb25zdCBwYWQgPSAoaW5wdXQsIG1heExlbmd0aCwgdG9OdW1iZXIpID0+IHtcbiAgaWYgKG1heExlbmd0aCA+IDApIHtcbiAgICBsZXQgZGFzaCA9IGlucHV0WzBdID09PSAnLScgPyAnLScgOiAnJztcbiAgICBpZiAoZGFzaCkgaW5wdXQgPSBpbnB1dC5zbGljZSgxKTtcbiAgICBpbnB1dCA9IChkYXNoICsgaW5wdXQucGFkU3RhcnQoZGFzaCA/IG1heExlbmd0aCAtIDEgOiBtYXhMZW5ndGgsICcwJykpO1xuICB9XG4gIGlmICh0b051bWJlciA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gU3RyaW5nKGlucHV0KTtcbiAgfVxuICByZXR1cm4gaW5wdXQ7XG59O1xuXG5jb25zdCB0b01heExlbiA9IChpbnB1dCwgbWF4TGVuZ3RoKSA9PiB7XG4gIGxldCBuZWdhdGl2ZSA9IGlucHV0WzBdID09PSAnLScgPyAnLScgOiAnJztcbiAgaWYgKG5lZ2F0aXZlKSB7XG4gICAgaW5wdXQgPSBpbnB1dC5zbGljZSgxKTtcbiAgICBtYXhMZW5ndGgtLTtcbiAgfVxuICB3aGlsZSAoaW5wdXQubGVuZ3RoIDwgbWF4TGVuZ3RoKSBpbnB1dCA9ICcwJyArIGlucHV0O1xuICByZXR1cm4gbmVnYXRpdmUgPyAoJy0nICsgaW5wdXQpIDogaW5wdXQ7XG59O1xuXG5jb25zdCB0b1NlcXVlbmNlID0gKHBhcnRzLCBvcHRpb25zKSA9PiB7XG4gIHBhcnRzLm5lZ2F0aXZlcy5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMCk7XG4gIHBhcnRzLnBvc2l0aXZlcy5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMCk7XG5cbiAgbGV0IHByZWZpeCA9IG9wdGlvbnMuY2FwdHVyZSA/ICcnIDogJz86JztcbiAgbGV0IHBvc2l0aXZlcyA9ICcnO1xuICBsZXQgbmVnYXRpdmVzID0gJyc7XG4gIGxldCByZXN1bHQ7XG5cbiAgaWYgKHBhcnRzLnBvc2l0aXZlcy5sZW5ndGgpIHtcbiAgICBwb3NpdGl2ZXMgPSBwYXJ0cy5wb3NpdGl2ZXMuam9pbignfCcpO1xuICB9XG5cbiAgaWYgKHBhcnRzLm5lZ2F0aXZlcy5sZW5ndGgpIHtcbiAgICBuZWdhdGl2ZXMgPSBgLSgke3ByZWZpeH0ke3BhcnRzLm5lZ2F0aXZlcy5qb2luKCd8Jyl9KWA7XG4gIH1cblxuICBpZiAocG9zaXRpdmVzICYmIG5lZ2F0aXZlcykge1xuICAgIHJlc3VsdCA9IGAke3Bvc2l0aXZlc318JHtuZWdhdGl2ZXN9YDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBwb3NpdGl2ZXMgfHwgbmVnYXRpdmVzO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMud3JhcCkge1xuICAgIHJldHVybiBgKCR7cHJlZml4fSR7cmVzdWx0fSlgO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IHRvUmFuZ2UgPSAoYSwgYiwgaXNOdW1iZXJzLCBvcHRpb25zKSA9PiB7XG4gIGlmIChpc051bWJlcnMpIHtcbiAgICByZXR1cm4gdG9SZWdleFJhbmdlKGEsIGIsIHsgd3JhcDogZmFsc2UsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICBsZXQgc3RhcnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGEpO1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHN0YXJ0O1xuXG4gIGxldCBzdG9wID0gU3RyaW5nLmZyb21DaGFyQ29kZShiKTtcbiAgcmV0dXJuIGBbJHtzdGFydH0tJHtzdG9wfV1gO1xufTtcblxuY29uc3QgdG9SZWdleCA9IChzdGFydCwgZW5kLCBvcHRpb25zKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KHN0YXJ0KSkge1xuICAgIGxldCB3cmFwID0gb3B0aW9ucy53cmFwID09PSB0cnVlO1xuICAgIGxldCBwcmVmaXggPSBvcHRpb25zLmNhcHR1cmUgPyAnJyA6ICc/Oic7XG4gICAgcmV0dXJuIHdyYXAgPyBgKCR7cHJlZml4fSR7c3RhcnQuam9pbignfCcpfSlgIDogc3RhcnQuam9pbignfCcpO1xuICB9XG4gIHJldHVybiB0b1JlZ2V4UmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG59O1xuXG5jb25zdCByYW5nZUVycm9yID0gKC4uLmFyZ3MpID0+IHtcbiAgcmV0dXJuIG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHJhbmdlIGFyZ3VtZW50czogJyArIHV0aWwuaW5zcGVjdCguLi5hcmdzKSk7XG59O1xuXG5jb25zdCBpbnZhbGlkUmFuZ2UgPSAoc3RhcnQsIGVuZCwgb3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHRocm93IHJhbmdlRXJyb3IoW3N0YXJ0LCBlbmRdKTtcbiAgcmV0dXJuIFtdO1xufTtcblxuY29uc3QgaW52YWxpZFN0ZXAgPSAoc3RlcCwgb3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCBzdGVwIFwiJHtzdGVwfVwiIHRvIGJlIGEgbnVtYmVyYCk7XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuY29uc3QgZmlsbE51bWJlcnMgPSAoc3RhcnQsIGVuZCwgc3RlcCA9IDEsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgYSA9IE51bWJlcihzdGFydCk7XG4gIGxldCBiID0gTnVtYmVyKGVuZCk7XG5cbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGEpIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGIpKSB7XG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0UmFuZ2VzID09PSB0cnVlKSB0aHJvdyByYW5nZUVycm9yKFtzdGFydCwgZW5kXSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gZml4IG5lZ2F0aXZlIHplcm9cbiAgaWYgKGEgPT09IDApIGEgPSAwO1xuICBpZiAoYiA9PT0gMCkgYiA9IDA7XG5cbiAgbGV0IGRlc2NlbmRpbmcgPSBhID4gYjtcbiAgbGV0IHN0YXJ0U3RyaW5nID0gU3RyaW5nKHN0YXJ0KTtcbiAgbGV0IGVuZFN0cmluZyA9IFN0cmluZyhlbmQpO1xuICBsZXQgc3RlcFN0cmluZyA9IFN0cmluZyhzdGVwKTtcbiAgc3RlcCA9IE1hdGgubWF4KE1hdGguYWJzKHN0ZXApLCAxKTtcblxuICBsZXQgcGFkZGVkID0gemVyb3Moc3RhcnRTdHJpbmcpIHx8IHplcm9zKGVuZFN0cmluZykgfHwgemVyb3Moc3RlcFN0cmluZyk7XG4gIGxldCBtYXhMZW4gPSBwYWRkZWQgPyBNYXRoLm1heChzdGFydFN0cmluZy5sZW5ndGgsIGVuZFN0cmluZy5sZW5ndGgsIHN0ZXBTdHJpbmcubGVuZ3RoKSA6IDA7XG4gIGxldCB0b051bWJlciA9IHBhZGRlZCA9PT0gZmFsc2UgJiYgc3RyaW5naWZ5KHN0YXJ0LCBlbmQsIG9wdGlvbnMpID09PSBmYWxzZTtcbiAgbGV0IGZvcm1hdCA9IG9wdGlvbnMudHJhbnNmb3JtIHx8IHRyYW5zZm9ybSh0b051bWJlcik7XG5cbiAgaWYgKG9wdGlvbnMudG9SZWdleCAmJiBzdGVwID09PSAxKSB7XG4gICAgcmV0dXJuIHRvUmFuZ2UodG9NYXhMZW4oc3RhcnQsIG1heExlbiksIHRvTWF4TGVuKGVuZCwgbWF4TGVuKSwgdHJ1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBsZXQgcGFydHMgPSB7IG5lZ2F0aXZlczogW10sIHBvc2l0aXZlczogW10gfTtcbiAgbGV0IHB1c2ggPSBudW0gPT4gcGFydHNbbnVtIDwgMCA/ICduZWdhdGl2ZXMnIDogJ3Bvc2l0aXZlcyddLnB1c2goTWF0aC5hYnMobnVtKSk7XG4gIGxldCByYW5nZSA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuXG4gIHdoaWxlIChkZXNjZW5kaW5nID8gYSA+PSBiIDogYSA8PSBiKSB7XG4gICAgaWYgKG9wdGlvbnMudG9SZWdleCA9PT0gdHJ1ZSAmJiBzdGVwID4gMSkge1xuICAgICAgcHVzaChhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFuZ2UucHVzaChwYWQoZm9ybWF0KGEsIGluZGV4KSwgbWF4TGVuLCB0b051bWJlcikpO1xuICAgIH1cbiAgICBhID0gZGVzY2VuZGluZyA/IGEgLSBzdGVwIDogYSArIHN0ZXA7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggPT09IHRydWUpIHtcbiAgICByZXR1cm4gc3RlcCA+IDFcbiAgICAgID8gdG9TZXF1ZW5jZShwYXJ0cywgb3B0aW9ucylcbiAgICAgIDogdG9SZWdleChyYW5nZSwgbnVsbCwgeyB3cmFwOiBmYWxzZSwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbmNvbnN0IGZpbGxMZXR0ZXJzID0gKHN0YXJ0LCBlbmQsIHN0ZXAgPSAxLCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKCghaXNOdW1iZXIoc3RhcnQpICYmIHN0YXJ0Lmxlbmd0aCA+IDEpIHx8ICghaXNOdW1iZXIoZW5kKSAmJiBlbmQubGVuZ3RoID4gMSkpIHtcbiAgICByZXR1cm4gaW52YWxpZFJhbmdlKHN0YXJ0LCBlbmQsIG9wdGlvbnMpO1xuICB9XG5cblxuICBsZXQgZm9ybWF0ID0gb3B0aW9ucy50cmFuc2Zvcm0gfHwgKHZhbCA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKHZhbCkpO1xuICBsZXQgYSA9IGAke3N0YXJ0fWAuY2hhckNvZGVBdCgwKTtcbiAgbGV0IGIgPSBgJHtlbmR9YC5jaGFyQ29kZUF0KDApO1xuXG4gIGxldCBkZXNjZW5kaW5nID0gYSA+IGI7XG4gIGxldCBtaW4gPSBNYXRoLm1pbihhLCBiKTtcbiAgbGV0IG1heCA9IE1hdGgubWF4KGEsIGIpO1xuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggJiYgc3RlcCA9PT0gMSkge1xuICAgIHJldHVybiB0b1JhbmdlKG1pbiwgbWF4LCBmYWxzZSwgb3B0aW9ucyk7XG4gIH1cblxuICBsZXQgcmFuZ2UgPSBbXTtcbiAgbGV0IGluZGV4ID0gMDtcblxuICB3aGlsZSAoZGVzY2VuZGluZyA/IGEgPj0gYiA6IGEgPD0gYikge1xuICAgIHJhbmdlLnB1c2goZm9ybWF0KGEsIGluZGV4KSk7XG4gICAgYSA9IGRlc2NlbmRpbmcgPyBhIC0gc3RlcCA6IGEgKyBzdGVwO1xuICAgIGluZGV4Kys7XG4gIH1cblxuICBpZiAob3B0aW9ucy50b1JlZ2V4ID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRvUmVnZXgocmFuZ2UsIG51bGwsIHsgd3JhcDogZmFsc2UsIG9wdGlvbnMgfSk7XG4gIH1cblxuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5jb25zdCBmaWxsID0gKHN0YXJ0LCBlbmQsIHN0ZXAsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAoZW5kID09IG51bGwgJiYgaXNWYWxpZFZhbHVlKHN0YXJ0KSkge1xuICAgIHJldHVybiBbc3RhcnRdO1xuICB9XG5cbiAgaWYgKCFpc1ZhbGlkVmFsdWUoc3RhcnQpIHx8ICFpc1ZhbGlkVmFsdWUoZW5kKSkge1xuICAgIHJldHVybiBpbnZhbGlkUmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAodHlwZW9mIHN0ZXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmlsbChzdGFydCwgZW5kLCAxLCB7IHRyYW5zZm9ybTogc3RlcCB9KTtcbiAgfVxuXG4gIGlmIChpc09iamVjdChzdGVwKSkge1xuICAgIHJldHVybiBmaWxsKHN0YXJ0LCBlbmQsIDAsIHN0ZXApO1xuICB9XG5cbiAgbGV0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgaWYgKG9wdHMuY2FwdHVyZSA9PT0gdHJ1ZSkgb3B0cy53cmFwID0gdHJ1ZTtcbiAgc3RlcCA9IHN0ZXAgfHwgb3B0cy5zdGVwIHx8IDE7XG5cbiAgaWYgKCFpc051bWJlcihzdGVwKSkge1xuICAgIGlmIChzdGVwICE9IG51bGwgJiYgIWlzT2JqZWN0KHN0ZXApKSByZXR1cm4gaW52YWxpZFN0ZXAoc3RlcCwgb3B0cyk7XG4gICAgcmV0dXJuIGZpbGwoc3RhcnQsIGVuZCwgMSwgc3RlcCk7XG4gIH1cblxuICBpZiAoaXNOdW1iZXIoc3RhcnQpICYmIGlzTnVtYmVyKGVuZCkpIHtcbiAgICByZXR1cm4gZmlsbE51bWJlcnMoc3RhcnQsIGVuZCwgc3RlcCwgb3B0cyk7XG4gIH1cblxuICByZXR1cm4gZmlsbExldHRlcnMoc3RhcnQsIGVuZCwgTWF0aC5tYXgoTWF0aC5hYnMoc3RlcCksIDEpLCBvcHRzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsbDtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZmlsbCA9IHJlcXVpcmUoJ2ZpbGwtcmFuZ2UnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5jb25zdCBjb21waWxlID0gKGFzdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCB3YWxrID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbGV0IGludmFsaWRCbG9jayA9IHV0aWxzLmlzSW52YWxpZEJyYWNlKHBhcmVudCk7XG4gICAgbGV0IGludmFsaWROb2RlID0gbm9kZS5pbnZhbGlkID09PSB0cnVlICYmIG9wdGlvbnMuZXNjYXBlSW52YWxpZCA9PT0gdHJ1ZTtcbiAgICBsZXQgaW52YWxpZCA9IGludmFsaWRCbG9jayA9PT0gdHJ1ZSB8fCBpbnZhbGlkTm9kZSA9PT0gdHJ1ZTtcbiAgICBsZXQgcHJlZml4ID0gb3B0aW9ucy5lc2NhcGVJbnZhbGlkID09PSB0cnVlID8gJ1xcXFwnIDogJyc7XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgaWYgKG5vZGUuaXNPcGVuID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgbm9kZS52YWx1ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUuaXNDbG9zZSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ29wZW4nKSB7XG4gICAgICByZXR1cm4gaW52YWxpZCA/IChwcmVmaXggKyBub2RlLnZhbHVlKSA6ICcoJztcbiAgICB9XG5cbiAgICBpZiAobm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgICByZXR1cm4gaW52YWxpZCA/IChwcmVmaXggKyBub2RlLnZhbHVlKSA6ICcpJztcbiAgICB9XG5cbiAgICBpZiAobm9kZS50eXBlID09PSAnY29tbWEnKSB7XG4gICAgICByZXR1cm4gbm9kZS5wcmV2LnR5cGUgPT09ICdjb21tYScgPyAnJyA6IChpbnZhbGlkID8gbm9kZS52YWx1ZSA6ICd8Jyk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICAgIHJldHVybiBub2RlLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzICYmIG5vZGUucmFuZ2VzID4gMCkge1xuICAgICAgbGV0IGFyZ3MgPSB1dGlscy5yZWR1Y2Uobm9kZS5ub2Rlcyk7XG4gICAgICBsZXQgcmFuZ2UgPSBmaWxsKC4uLmFyZ3MsIHsgLi4ub3B0aW9ucywgd3JhcDogZmFsc2UsIHRvUmVnZXg6IHRydWUgfSk7XG5cbiAgICAgIGlmIChyYW5nZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgcmV0dXJuIGFyZ3MubGVuZ3RoID4gMSAmJiByYW5nZS5sZW5ndGggPiAxID8gYCgke3JhbmdlfSlgIDogcmFuZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZXMpIHtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIG5vZGUubm9kZXMpIHtcbiAgICAgICAgb3V0cHV0ICs9IHdhbGsoY2hpbGQsIG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIHJldHVybiB3YWxrKGFzdCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGZpbGwgPSByZXF1aXJlKCdmaWxsLXJhbmdlJyk7XG5jb25zdCBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL3N0cmluZ2lmeScpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmNvbnN0IGFwcGVuZCA9IChxdWV1ZSA9ICcnLCBzdGFzaCA9ICcnLCBlbmNsb3NlID0gZmFsc2UpID0+IHtcbiAgbGV0IHJlc3VsdCA9IFtdO1xuXG4gIHF1ZXVlID0gW10uY29uY2F0KHF1ZXVlKTtcbiAgc3Rhc2ggPSBbXS5jb25jYXQoc3Rhc2gpO1xuXG4gIGlmICghc3Rhc2gubGVuZ3RoKSByZXR1cm4gcXVldWU7XG4gIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGVuY2xvc2UgPyB1dGlscy5mbGF0dGVuKHN0YXNoKS5tYXAoZWxlID0+IGB7JHtlbGV9fWApIDogc3Rhc2g7XG4gIH1cblxuICBmb3IgKGxldCBpdGVtIG9mIHF1ZXVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGZvciAobGV0IHZhbHVlIG9mIGl0ZW0pIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYXBwZW5kKHZhbHVlLCBzdGFzaCwgZW5jbG9zZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBlbGUgb2Ygc3Rhc2gpIHtcbiAgICAgICAgaWYgKGVuY2xvc2UgPT09IHRydWUgJiYgdHlwZW9mIGVsZSA9PT0gJ3N0cmluZycpIGVsZSA9IGB7JHtlbGV9fWA7XG4gICAgICAgIHJlc3VsdC5wdXNoKEFycmF5LmlzQXJyYXkoZWxlKSA/IGFwcGVuZChpdGVtLCBlbGUsIGVuY2xvc2UpIDogKGl0ZW0gKyBlbGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHV0aWxzLmZsYXR0ZW4ocmVzdWx0KTtcbn07XG5cbmNvbnN0IGV4cGFuZCA9IChhc3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgcmFuZ2VMaW1pdCA9IG9wdGlvbnMucmFuZ2VMaW1pdCA9PT0gdm9pZCAwID8gMTAwMCA6IG9wdGlvbnMucmFuZ2VMaW1pdDtcblxuICBsZXQgd2FsayA9IChub2RlLCBwYXJlbnQgPSB7fSkgPT4ge1xuICAgIG5vZGUucXVldWUgPSBbXTtcblxuICAgIGxldCBwID0gcGFyZW50O1xuICAgIGxldCBxID0gcGFyZW50LnF1ZXVlO1xuXG4gICAgd2hpbGUgKHAudHlwZSAhPT0gJ2JyYWNlJyAmJiBwLnR5cGUgIT09ICdyb290JyAmJiBwLnBhcmVudCkge1xuICAgICAgcCA9IHAucGFyZW50O1xuICAgICAgcSA9IHAucXVldWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuaW52YWxpZCB8fCBub2RlLmRvbGxhcikge1xuICAgICAgcS5wdXNoKGFwcGVuZChxLnBvcCgpLCBzdHJpbmdpZnkobm9kZSwgb3B0aW9ucykpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobm9kZS50eXBlID09PSAnYnJhY2UnICYmIG5vZGUuaW52YWxpZCAhPT0gdHJ1ZSAmJiBub2RlLm5vZGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcS5wdXNoKGFwcGVuZChxLnBvcCgpLCBbJ3t9J10pKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5ub2RlcyAmJiBub2RlLnJhbmdlcyA+IDApIHtcbiAgICAgIGxldCBhcmdzID0gdXRpbHMucmVkdWNlKG5vZGUubm9kZXMpO1xuXG4gICAgICBpZiAodXRpbHMuZXhjZWVkc0xpbWl0KC4uLmFyZ3MsIG9wdGlvbnMuc3RlcCwgcmFuZ2VMaW1pdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2V4cGFuZGVkIGFycmF5IGxlbmd0aCBleGNlZWRzIHJhbmdlIGxpbWl0LiBVc2Ugb3B0aW9ucy5yYW5nZUxpbWl0IHRvIGluY3JlYXNlIG9yIGRpc2FibGUgdGhlIGxpbWl0LicpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmFuZ2UgPSBmaWxsKC4uLmFyZ3MsIG9wdGlvbnMpO1xuICAgICAgaWYgKHJhbmdlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByYW5nZSA9IHN0cmluZ2lmeShub2RlLCBvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcS5wdXNoKGFwcGVuZChxLnBvcCgpLCByYW5nZSkpO1xuICAgICAgbm9kZS5ub2RlcyA9IFtdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBlbmNsb3NlID0gdXRpbHMuZW5jbG9zZUJyYWNlKG5vZGUpO1xuICAgIGxldCBxdWV1ZSA9IG5vZGUucXVldWU7XG4gICAgbGV0IGJsb2NrID0gbm9kZTtcblxuICAgIHdoaWxlIChibG9jay50eXBlICE9PSAnYnJhY2UnICYmIGJsb2NrLnR5cGUgIT09ICdyb290JyAmJiBibG9jay5wYXJlbnQpIHtcbiAgICAgIGJsb2NrID0gYmxvY2sucGFyZW50O1xuICAgICAgcXVldWUgPSBibG9jay5xdWV1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUubm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjaGlsZCA9IG5vZGUubm9kZXNbaV07XG5cbiAgICAgIGlmIChjaGlsZC50eXBlID09PSAnY29tbWEnICYmIG5vZGUudHlwZSA9PT0gJ2JyYWNlJykge1xuICAgICAgICBpZiAoaSA9PT0gMSkgcXVldWUucHVzaCgnJyk7XG4gICAgICAgIHF1ZXVlLnB1c2goJycpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdjbG9zZScpIHtcbiAgICAgICAgcS5wdXNoKGFwcGVuZChxLnBvcCgpLCBxdWV1ZSwgZW5jbG9zZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLnZhbHVlICYmIGNoaWxkLnR5cGUgIT09ICdvcGVuJykge1xuICAgICAgICBxdWV1ZS5wdXNoKGFwcGVuZChxdWV1ZS5wb3AoKSwgY2hpbGQudmFsdWUpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGlsZC5ub2Rlcykge1xuICAgICAgICB3YWxrKGNoaWxkLCBub2RlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcXVldWU7XG4gIH07XG5cbiAgcmV0dXJuIHV0aWxzLmZsYXR0ZW4od2Fsayhhc3QpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwYW5kO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTUFYX0xFTkdUSDogMTAyNCAqIDY0LFxuXG4gIC8vIERpZ2l0c1xuICBDSEFSXzA6ICcwJywgLyogMCAqL1xuICBDSEFSXzk6ICc5JywgLyogOSAqL1xuXG4gIC8vIEFscGhhYmV0IGNoYXJzLlxuICBDSEFSX1VQUEVSQ0FTRV9BOiAnQScsIC8qIEEgKi9cbiAgQ0hBUl9MT1dFUkNBU0VfQTogJ2EnLCAvKiBhICovXG4gIENIQVJfVVBQRVJDQVNFX1o6ICdaJywgLyogWiAqL1xuICBDSEFSX0xPV0VSQ0FTRV9aOiAneicsIC8qIHogKi9cblxuICBDSEFSX0xFRlRfUEFSRU5USEVTRVM6ICcoJywgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTOiAnKScsIC8qICkgKi9cblxuICBDSEFSX0FTVEVSSVNLOiAnKicsIC8qICogKi9cblxuICAvLyBOb24tYWxwaGFiZXRpYyBjaGFycy5cbiAgQ0hBUl9BTVBFUlNBTkQ6ICcmJywgLyogJiAqL1xuICBDSEFSX0FUOiAnQCcsIC8qIEAgKi9cbiAgQ0hBUl9CQUNLU0xBU0g6ICdcXFxcJywgLyogXFwgKi9cbiAgQ0hBUl9CQUNLVElDSzogJ2AnLCAvKiBgICovXG4gIENIQVJfQ0FSUklBR0VfUkVUVVJOOiAnXFxyJywgLyogXFxyICovXG4gIENIQVJfQ0lSQ1VNRkxFWF9BQ0NFTlQ6ICdeJywgLyogXiAqL1xuICBDSEFSX0NPTE9OOiAnOicsIC8qIDogKi9cbiAgQ0hBUl9DT01NQTogJywnLCAvKiAsICovXG4gIENIQVJfRE9MTEFSOiAnJCcsIC8qIC4gKi9cbiAgQ0hBUl9ET1Q6ICcuJywgLyogLiAqL1xuICBDSEFSX0RPVUJMRV9RVU9URTogJ1wiJywgLyogXCIgKi9cbiAgQ0hBUl9FUVVBTDogJz0nLCAvKiA9ICovXG4gIENIQVJfRVhDTEFNQVRJT05fTUFSSzogJyEnLCAvKiAhICovXG4gIENIQVJfRk9STV9GRUVEOiAnXFxmJywgLyogXFxmICovXG4gIENIQVJfRk9SV0FSRF9TTEFTSDogJy8nLCAvKiAvICovXG4gIENIQVJfSEFTSDogJyMnLCAvKiAjICovXG4gIENIQVJfSFlQSEVOX01JTlVTOiAnLScsIC8qIC0gKi9cbiAgQ0hBUl9MRUZUX0FOR0xFX0JSQUNLRVQ6ICc8JywgLyogPCAqL1xuICBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0U6ICd7JywgLyogeyAqL1xuICBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQ6ICdbJywgLyogWyAqL1xuICBDSEFSX0xJTkVfRkVFRDogJ1xcbicsIC8qIFxcbiAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFOiAnXFx1MDBBMCcsIC8qIFxcdTAwQTAgKi9cbiAgQ0hBUl9QRVJDRU5UOiAnJScsIC8qICUgKi9cbiAgQ0hBUl9QTFVTOiAnKycsIC8qICsgKi9cbiAgQ0hBUl9RVUVTVElPTl9NQVJLOiAnPycsIC8qID8gKi9cbiAgQ0hBUl9SSUdIVF9BTkdMRV9CUkFDS0VUOiAnPicsIC8qID4gKi9cbiAgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRTogJ30nLCAvKiB9ICovXG4gIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQ6ICddJywgLyogXSAqL1xuICBDSEFSX1NFTUlDT0xPTjogJzsnLCAvKiA7ICovXG4gIENIQVJfU0lOR0xFX1FVT1RFOiAnXFwnJywgLyogJyAqL1xuICBDSEFSX1NQQUNFOiAnICcsIC8qICAgKi9cbiAgQ0hBUl9UQUI6ICdcXHQnLCAvKiBcXHQgKi9cbiAgQ0hBUl9VTkRFUlNDT1JFOiAnXycsIC8qIF8gKi9cbiAgQ0hBUl9WRVJUSUNBTF9MSU5FOiAnfCcsIC8qIHwgKi9cbiAgQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0U6ICdcXHVGRUZGJyAvKiBcXHVGRUZGICovXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL3N0cmluZ2lmeScpO1xuXG4vKipcbiAqIENvbnN0YW50c1xuICovXG5cbmNvbnN0IHtcbiAgTUFYX0xFTkdUSCxcbiAgQ0hBUl9CQUNLU0xBU0gsIC8qIFxcICovXG4gIENIQVJfQkFDS1RJQ0ssIC8qIGAgKi9cbiAgQ0hBUl9DT01NQSwgLyogLCAqL1xuICBDSEFSX0RPVCwgLyogLiAqL1xuICBDSEFSX0xFRlRfUEFSRU5USEVTRVMsIC8qICggKi9cbiAgQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUywgLyogKSAqL1xuICBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UsIC8qIHsgKi9cbiAgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRSwgLyogfSAqL1xuICBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQsIC8qIFsgKi9cbiAgQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVCwgLyogXSAqL1xuICBDSEFSX0RPVUJMRV9RVU9URSwgLyogXCIgKi9cbiAgQ0hBUl9TSU5HTEVfUVVPVEUsIC8qICcgKi9cbiAgQ0hBUl9OT19CUkVBS19TUEFDRSxcbiAgQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0Vcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG4vKipcbiAqIHBhcnNlXG4gKi9cblxuY29uc3QgcGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG4gIH1cblxuICBsZXQgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGxldCBtYXggPSB0eXBlb2Ygb3B0cy5tYXhMZW5ndGggPT09ICdudW1iZXInID8gTWF0aC5taW4oTUFYX0xFTkdUSCwgb3B0cy5tYXhMZW5ndGgpIDogTUFYX0xFTkdUSDtcbiAgaWYgKGlucHV0Lmxlbmd0aCA+IG1heCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW5wdXQgbGVuZ3RoICgke2lucHV0Lmxlbmd0aH0pLCBleGNlZWRzIG1heCBjaGFyYWN0ZXJzICgke21heH0pYCk7XG4gIH1cblxuICBsZXQgYXN0ID0geyB0eXBlOiAncm9vdCcsIGlucHV0LCBub2RlczogW10gfTtcbiAgbGV0IHN0YWNrID0gW2FzdF07XG4gIGxldCBibG9jayA9IGFzdDtcbiAgbGV0IHByZXYgPSBhc3Q7XG4gIGxldCBicmFja2V0cyA9IDA7XG4gIGxldCBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBkZXB0aCA9IDA7XG4gIGxldCB2YWx1ZTtcbiAgbGV0IG1lbW8gPSB7fTtcblxuICAvKipcbiAgICogSGVscGVyc1xuICAgKi9cblxuICBjb25zdCBhZHZhbmNlID0gKCkgPT4gaW5wdXRbaW5kZXgrK107XG4gIGNvbnN0IHB1c2ggPSBub2RlID0+IHtcbiAgICBpZiAobm9kZS50eXBlID09PSAndGV4dCcgJiYgcHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgcHJldi50eXBlID0gJ3RleHQnO1xuICAgIH1cblxuICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ3RleHQnICYmIG5vZGUudHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICBwcmV2LnZhbHVlICs9IG5vZGUudmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYmxvY2subm9kZXMucHVzaChub2RlKTtcbiAgICBub2RlLnBhcmVudCA9IGJsb2NrO1xuICAgIG5vZGUucHJldiA9IHByZXY7XG4gICAgcHJldiA9IG5vZGU7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH07XG5cbiAgcHVzaCh7IHR5cGU6ICdib3MnIH0pO1xuXG4gIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgIGJsb2NrID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgdmFsdWUgPSBhZHZhbmNlKCk7XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkIGNoYXJzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfWkVST19XSURUSF9OT0JSRUFLX1NQQUNFIHx8IHZhbHVlID09PSBDSEFSX05PX0JSRUFLX1NQQUNFKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFc2NhcGVkIGNoYXJzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfQkFDS1NMQVNIKSB7XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZTogKG9wdGlvbnMua2VlcEVzY2FwaW5nID8gdmFsdWUgOiAnJykgKyBhZHZhbmNlKCkgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSaWdodCBzcXVhcmUgYnJhY2tldCAobGl0ZXJhbCk6ICddJ1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZTogJ1xcXFwnICsgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMZWZ0IHNxdWFyZSBicmFja2V0OiAnWydcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICBicmFja2V0cysrO1xuXG4gICAgICBsZXQgY2xvc2VkID0gdHJ1ZTtcbiAgICAgIGxldCBuZXh0O1xuXG4gICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGggJiYgKG5leHQgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgIHZhbHVlICs9IG5leHQ7XG5cbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgICAgIGJyYWNrZXRzKys7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9CQUNLU0xBU0gpIHtcbiAgICAgICAgICB2YWx1ZSArPSBhZHZhbmNlKCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgICAgIGJyYWNrZXRzLS07XG5cbiAgICAgICAgICBpZiAoYnJhY2tldHMgPT09IDApIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcmVudGhlc2VzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfTEVGVF9QQVJFTlRIRVNFUykge1xuICAgICAgYmxvY2sgPSBwdXNoKHsgdHlwZTogJ3BhcmVuJywgbm9kZXM6IFtdIH0pO1xuICAgICAgc3RhY2sucHVzaChibG9jayk7XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUykge1xuICAgICAgaWYgKGJsb2NrLnR5cGUgIT09ICdwYXJlbicpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYmxvY2sgPSBzdGFjay5wb3AoKTtcbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgYmxvY2sgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFF1b3RlczogJ3xcInxgXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfRE9VQkxFX1FVT1RFIHx8IHZhbHVlID09PSBDSEFSX1NJTkdMRV9RVU9URSB8fCB2YWx1ZSA9PT0gQ0hBUl9CQUNLVElDSykge1xuICAgICAgbGV0IG9wZW4gPSB2YWx1ZTtcbiAgICAgIGxldCBuZXh0O1xuXG4gICAgICBpZiAob3B0aW9ucy5rZWVwUXVvdGVzICE9PSB0cnVlKSB7XG4gICAgICAgIHZhbHVlID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCAmJiAobmV4dCA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfQkFDS1NMQVNIKSB7XG4gICAgICAgICAgdmFsdWUgKz0gbmV4dCArIGFkdmFuY2UoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0ID09PSBvcGVuKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMua2VlcFF1b3RlcyA9PT0gdHJ1ZSkgdmFsdWUgKz0gbmV4dDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlICs9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGVmdCBjdXJseSBicmFjZTogJ3snXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfTEVGVF9DVVJMWV9CUkFDRSkge1xuICAgICAgZGVwdGgrKztcblxuICAgICAgbGV0IGRvbGxhciA9IHByZXYudmFsdWUgJiYgcHJldi52YWx1ZS5zbGljZSgtMSkgPT09ICckJyB8fCBibG9jay5kb2xsYXIgPT09IHRydWU7XG4gICAgICBsZXQgYnJhY2UgPSB7XG4gICAgICAgIHR5cGU6ICdicmFjZScsXG4gICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgIGNsb3NlOiBmYWxzZSxcbiAgICAgICAgZG9sbGFyLFxuICAgICAgICBkZXB0aCxcbiAgICAgICAgY29tbWFzOiAwLFxuICAgICAgICByYW5nZXM6IDAsXG4gICAgICAgIG5vZGVzOiBbXVxuICAgICAgfTtcblxuICAgICAgYmxvY2sgPSBwdXNoKGJyYWNlKTtcbiAgICAgIHN0YWNrLnB1c2goYmxvY2spO1xuICAgICAgcHVzaCh7IHR5cGU6ICdvcGVuJywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSaWdodCBjdXJseSBicmFjZTogJ30nXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfUklHSFRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgIGlmIChibG9jay50eXBlICE9PSAnYnJhY2UnKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHR5cGUgPSAnY2xvc2UnO1xuICAgICAgYmxvY2sgPSBzdGFjay5wb3AoKTtcbiAgICAgIGJsb2NrLmNsb3NlID0gdHJ1ZTtcblxuICAgICAgcHVzaCh7IHR5cGUsIHZhbHVlIH0pO1xuICAgICAgZGVwdGgtLTtcblxuICAgICAgYmxvY2sgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbW1hOiAnLCdcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9DT01NQSAmJiBkZXB0aCA+IDApIHtcbiAgICAgIGlmIChibG9jay5yYW5nZXMgPiAwKSB7XG4gICAgICAgIGJsb2NrLnJhbmdlcyA9IDA7XG4gICAgICAgIGxldCBvcGVuID0gYmxvY2subm9kZXMuc2hpZnQoKTtcbiAgICAgICAgYmxvY2subm9kZXMgPSBbb3BlbiwgeyB0eXBlOiAndGV4dCcsIHZhbHVlOiBzdHJpbmdpZnkoYmxvY2spIH1dO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2NvbW1hJywgdmFsdWUgfSk7XG4gICAgICBibG9jay5jb21tYXMrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvdDogJy4nXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfRE9UICYmIGRlcHRoID4gMCAmJiBibG9jay5jb21tYXMgPT09IDApIHtcbiAgICAgIGxldCBzaWJsaW5ncyA9IGJsb2NrLm5vZGVzO1xuXG4gICAgICBpZiAoZGVwdGggPT09IDAgfHwgc2libGluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ2RvdCcpIHtcbiAgICAgICAgYmxvY2sucmFuZ2UgPSBbXTtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgcHJldi50eXBlID0gJ3JhbmdlJztcblxuICAgICAgICBpZiAoYmxvY2subm9kZXMubGVuZ3RoICE9PSAzICYmIGJsb2NrLm5vZGVzLmxlbmd0aCAhPT0gNSkge1xuICAgICAgICAgIGJsb2NrLmludmFsaWQgPSB0cnVlO1xuICAgICAgICAgIGJsb2NrLnJhbmdlcyA9IDA7XG4gICAgICAgICAgcHJldi50eXBlID0gJ3RleHQnO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYmxvY2sucmFuZ2VzKys7XG4gICAgICAgIGJsb2NrLmFyZ3MgPSBbXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2LnR5cGUgPT09ICdyYW5nZScpIHtcbiAgICAgICAgc2libGluZ3MucG9wKCk7XG5cbiAgICAgICAgbGV0IGJlZm9yZSA9IHNpYmxpbmdzW3NpYmxpbmdzLmxlbmd0aCAtIDFdO1xuICAgICAgICBiZWZvcmUudmFsdWUgKz0gcHJldi52YWx1ZSArIHZhbHVlO1xuICAgICAgICBwcmV2ID0gYmVmb3JlO1xuICAgICAgICBibG9jay5yYW5nZXMtLTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnZG90JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXh0XG4gICAgICovXG5cbiAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgfVxuXG4gIC8vIE1hcmsgaW1iYWxhbmNlZCBicmFjZXMgYW5kIGJyYWNrZXRzIGFzIGludmFsaWRcbiAgZG8ge1xuICAgIGJsb2NrID0gc3RhY2sucG9wKCk7XG5cbiAgICBpZiAoYmxvY2sudHlwZSAhPT0gJ3Jvb3QnKSB7XG4gICAgICBibG9jay5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBpZiAoIW5vZGUubm9kZXMpIHtcbiAgICAgICAgICBpZiAobm9kZS50eXBlID09PSAnb3BlbicpIG5vZGUuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgICBpZiAobm9kZS50eXBlID09PSAnY2xvc2UnKSBub2RlLmlzQ2xvc2UgPSB0cnVlO1xuICAgICAgICAgIGlmICghbm9kZS5ub2Rlcykgbm9kZS50eXBlID0gJ3RleHQnO1xuICAgICAgICAgIG5vZGUuaW52YWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBnZXQgdGhlIGxvY2F0aW9uIG9mIHRoZSBibG9jayBvbiBwYXJlbnQubm9kZXMgKGJsb2NrJ3Mgc2libGluZ3MpXG4gICAgICBsZXQgcGFyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICBsZXQgaW5kZXggPSBwYXJlbnQubm9kZXMuaW5kZXhPZihibG9jayk7XG4gICAgICAvLyByZXBsYWNlIHRoZSAoaW52YWxpZCkgYmxvY2sgd2l0aCBpdCdzIG5vZGVzXG4gICAgICBwYXJlbnQubm9kZXMuc3BsaWNlKGluZGV4LCAxLCAuLi5ibG9jay5ub2Rlcyk7XG4gICAgfVxuICB9IHdoaWxlIChzdGFjay5sZW5ndGggPiAwKTtcblxuICBwdXNoKHsgdHlwZTogJ2VvcycgfSk7XG4gIHJldHVybiBhc3Q7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL2xpYi9zdHJpbmdpZnknKTtcbmNvbnN0IGNvbXBpbGUgPSByZXF1aXJlKCcuL2xpYi9jb21waWxlJyk7XG5jb25zdCBleHBhbmQgPSByZXF1aXJlKCcuL2xpYi9leHBhbmQnKTtcbmNvbnN0IHBhcnNlID0gcmVxdWlyZSgnLi9saWIvcGFyc2UnKTtcblxuLyoqXG4gKiBFeHBhbmQgdGhlIGdpdmVuIHBhdHRlcm4gb3IgY3JlYXRlIGEgcmVnZXgtY29tcGF0aWJsZSBzdHJpbmcuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzKCd7YSxiLGN9JywgeyBjb21waWxlOiB0cnVlIH0pKTsgLy89PiBbJyhhfGJ8YyknXVxuICogY29uc29sZS5sb2coYnJhY2VzKCd7YSxiLGN9JykpOyAvLz0+IFsnYScsICdiJywgJ2MnXVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHN0cmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY29uc3QgYnJhY2VzID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IG91dHB1dCA9IFtdO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGlucHV0KSkge1xuICAgIGZvciAobGV0IHBhdHRlcm4gb2YgaW5wdXQpIHtcbiAgICAgIGxldCByZXN1bHQgPSBicmFjZXMuY3JlYXRlKHBhdHRlcm4sIG9wdGlvbnMpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgICBvdXRwdXQucHVzaCguLi5yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2gocmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0gW10uY29uY2F0KGJyYWNlcy5jcmVhdGUoaW5wdXQsIG9wdGlvbnMpKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZXhwYW5kID09PSB0cnVlICYmIG9wdGlvbnMubm9kdXBlcyA9PT0gdHJ1ZSkge1xuICAgIG91dHB1dCA9IFsuLi5uZXcgU2V0KG91dHB1dCldO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCB3aXRoIHRoZSBnaXZlbiBgb3B0aW9uc2AuXG4gKlxuICogYGBganNcbiAqIC8vIGJyYWNlcy5wYXJzZShwYXR0ZXJuLCBbLCBvcHRpb25zXSk7XG4gKiBjb25zdCBhc3QgPSBicmFjZXMucGFyc2UoJ2Eve2IsY30vZCcpO1xuICogY29uc29sZS5sb2coYXN0KTtcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IHBhdHRlcm4gQnJhY2UgcGF0dGVybiB0byBwYXJzZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBBU1RcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLnBhcnNlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHBhcnNlKGlucHV0LCBvcHRpb25zKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYnJhY2VzIHN0cmluZyBmcm9tIGFuIEFTVCwgb3IgYW4gQVNUIG5vZGUuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogbGV0IGFzdCA9IGJyYWNlcy5wYXJzZSgnZm9vL3thLGJ9L2JhcicpO1xuICogY29uc29sZS5sb2coc3RyaW5naWZ5KGFzdC5ub2Rlc1syXSkpOyAvLz0+ICd7YSxifSdcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBpbnB1dGAgQnJhY2UgcGF0dGVybiBvciBBU1QuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBleHBhbmRlZCB2YWx1ZXMuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmJyYWNlcy5zdHJpbmdpZnkgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzdHJpbmdpZnkoYnJhY2VzLnBhcnNlKGlucHV0LCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIHN0cmluZ2lmeShpbnB1dCwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIENvbXBpbGVzIGEgYnJhY2UgcGF0dGVybiBpbnRvIGEgcmVnZXgtY29tcGF0aWJsZSwgb3B0aW1pemVkIHN0cmluZy5cbiAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgbWFpbiBbYnJhY2VzXSgjYnJhY2VzKSBmdW5jdGlvbiBieSBkZWZhdWx0LlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBicmFjZXMgPSByZXF1aXJlKCdicmFjZXMnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcy5jb21waWxlKCdhL3tiLGN9L2QnKSk7XG4gKiAvLz0+IFsnYS8oYnxjKS9kJ11cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBpbnB1dGAgQnJhY2UgcGF0dGVybiBvciBBU1QuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBleHBhbmRlZCB2YWx1ZXMuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmJyYWNlcy5jb21waWxlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICBpbnB1dCA9IGJyYWNlcy5wYXJzZShpbnB1dCwgb3B0aW9ucyk7XG4gIH1cbiAgcmV0dXJuIGNvbXBpbGUoaW5wdXQsIG9wdGlvbnMpO1xufTtcblxuLyoqXG4gKiBFeHBhbmRzIGEgYnJhY2UgcGF0dGVybiBpbnRvIGFuIGFycmF5LiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlXG4gKiBtYWluIFticmFjZXNdKCNicmFjZXMpIGZ1bmN0aW9uIHdoZW4gYG9wdGlvbnMuZXhwYW5kYCBpcyB0cnVlLiBCZWZvcmVcbiAqIHVzaW5nIHRoaXMgbWV0aG9kIGl0J3MgcmVjb21tZW5kZWQgdGhhdCB5b3UgcmVhZCB0aGUgW3BlcmZvcm1hbmNlIG5vdGVzXSgjcGVyZm9ybWFuY2UpKVxuICogYW5kIGFkdmFudGFnZXMgb2YgdXNpbmcgWy5jb21waWxlXSgjY29tcGlsZSkgaW5zdGVhZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBjb25zb2xlLmxvZyhicmFjZXMuZXhwYW5kKCdhL3tiLGN9L2QnKSk7XG4gKiAvLz0+IFsnYS9iL2QnLCAnYS9jL2QnXTtcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBwYXR0ZXJuYCBCcmFjZSBwYXR0ZXJuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBleHBhbmRlZCB2YWx1ZXMuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmJyYWNlcy5leHBhbmQgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgIGlucHV0ID0gYnJhY2VzLnBhcnNlKGlucHV0LCBvcHRpb25zKTtcbiAgfVxuXG4gIGxldCByZXN1bHQgPSBleHBhbmQoaW5wdXQsIG9wdGlvbnMpO1xuXG4gIC8vIGZpbHRlciBvdXQgZW1wdHkgc3RyaW5ncyBpZiBzcGVjaWZpZWRcbiAgaWYgKG9wdGlvbnMubm9lbXB0eSA9PT0gdHJ1ZSkge1xuICAgIHJlc3VsdCA9IHJlc3VsdC5maWx0ZXIoQm9vbGVhbik7XG4gIH1cblxuICAvLyBmaWx0ZXIgb3V0IGR1cGxpY2F0ZXMgaWYgc3BlY2lmaWVkXG4gIGlmIChvcHRpb25zLm5vZHVwZXMgPT09IHRydWUpIHtcbiAgICByZXN1bHQgPSBbLi4ubmV3IFNldChyZXN1bHQpXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFByb2Nlc3NlcyBhIGJyYWNlIHBhdHRlcm4gYW5kIHJldHVybnMgZWl0aGVyIGFuIGV4cGFuZGVkIGFycmF5XG4gKiAoaWYgYG9wdGlvbnMuZXhwYW5kYCBpcyB0cnVlKSwgYSBoaWdobHkgb3B0aW1pemVkIHJlZ2V4LWNvbXBhdGlibGUgc3RyaW5nLlxuICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBtYWluIFticmFjZXNdKCNicmFjZXMpIGZ1bmN0aW9uLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBicmFjZXMgPSByZXF1aXJlKCdicmFjZXMnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcy5jcmVhdGUoJ3VzZXItezIwMC4uMzAwfS9wcm9qZWN0LXthLGIsY30tezEuLjEwfScpKVxuICogLy89PiAndXNlci0oMjBbMC05XXwyWzEtOV1bMC05XXwzMDApL3Byb2plY3QtKGF8YnxjKS0oWzEtOV18MTApJ1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gIEJyYWNlIHBhdHRlcm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmNyZWF0ZSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmIChpbnB1dCA9PT0gJycgfHwgaW5wdXQubGVuZ3RoIDwgMykge1xuICAgIHJldHVybiBbaW5wdXRdO1xuICB9XG5cbiByZXR1cm4gb3B0aW9ucy5leHBhbmQgIT09IHRydWVcbiAgICA/IGJyYWNlcy5jb21waWxlKGlucHV0LCBvcHRpb25zKVxuICAgIDogYnJhY2VzLmV4cGFuZChpbnB1dCwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBcImJyYWNlc1wiXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBicmFjZXM7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYmluYXJ5LWV4dGVuc2lvbnMuanNvbicpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGJpbmFyeUV4dGVuc2lvbnMgPSByZXF1aXJlKCdiaW5hcnktZXh0ZW5zaW9ucycpO1xuXG5jb25zdCBleHRlbnNpb25zID0gbmV3IFNldChiaW5hcnlFeHRlbnNpb25zKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlUGF0aCA9PiBleHRlbnNpb25zLmhhcyhwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7c2VwfSA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHtwbGF0Zm9ybX0gPSBwcm9jZXNzO1xuXG5leHBvcnRzLkVWX0FMTCA9ICdhbGwnO1xuZXhwb3J0cy5FVl9SRUFEWSA9ICdyZWFkeSc7XG5leHBvcnRzLkVWX0FERCA9ICdhZGQnO1xuZXhwb3J0cy5FVl9DSEFOR0UgPSAnY2hhbmdlJztcbmV4cG9ydHMuRVZfQUREX0RJUiA9ICdhZGREaXInO1xuZXhwb3J0cy5FVl9VTkxJTksgPSAndW5saW5rJztcbmV4cG9ydHMuRVZfVU5MSU5LX0RJUiA9ICd1bmxpbmtEaXInO1xuZXhwb3J0cy5FVl9SQVcgPSAncmF3JztcbmV4cG9ydHMuRVZfRVJST1IgPSAnZXJyb3InO1xuXG5leHBvcnRzLlNUUl9EQVRBID0gJ2RhdGEnO1xuZXhwb3J0cy5TVFJfRU5EID0gJ2VuZCc7XG5leHBvcnRzLlNUUl9DTE9TRSA9ICdjbG9zZSc7XG5cbmV4cG9ydHMuRlNFVkVOVF9DUkVBVEVEID0gJ2NyZWF0ZWQnO1xuZXhwb3J0cy5GU0VWRU5UX01PRElGSUVEID0gJ21vZGlmaWVkJztcbmV4cG9ydHMuRlNFVkVOVF9ERUxFVEVEID0gJ2RlbGV0ZWQnO1xuZXhwb3J0cy5GU0VWRU5UX01PVkVEID0gJ21vdmVkJztcbmV4cG9ydHMuRlNFVkVOVF9DTE9ORUQgPSAnY2xvbmVkJztcbmV4cG9ydHMuRlNFVkVOVF9VTktOT1dOID0gJ3Vua25vd24nO1xuZXhwb3J0cy5GU0VWRU5UX1RZUEVfRklMRSA9ICdmaWxlJztcbmV4cG9ydHMuRlNFVkVOVF9UWVBFX0RJUkVDVE9SWSA9ICdkaXJlY3RvcnknO1xuZXhwb3J0cy5GU0VWRU5UX1RZUEVfU1lNTElOSyA9ICdzeW1saW5rJztcblxuZXhwb3J0cy5LRVlfTElTVEVORVJTID0gJ2xpc3RlbmVycyc7XG5leHBvcnRzLktFWV9FUlIgPSAnZXJySGFuZGxlcnMnO1xuZXhwb3J0cy5LRVlfUkFXID0gJ3Jhd0VtaXR0ZXJzJztcbmV4cG9ydHMuSEFORExFUl9LRVlTID0gW2V4cG9ydHMuS0VZX0xJU1RFTkVSUywgZXhwb3J0cy5LRVlfRVJSLCBleHBvcnRzLktFWV9SQVddO1xuXG5leHBvcnRzLkRPVF9TTEFTSCA9IGAuJHtzZXB9YDtcblxuZXhwb3J0cy5CQUNLX1NMQVNIX1JFID0gL1xcXFwvZztcbmV4cG9ydHMuRE9VQkxFX1NMQVNIX1JFID0gL1xcL1xcLy87XG5leHBvcnRzLlNMQVNIX09SX0JBQ0tfU0xBU0hfUkUgPSAvWy9cXFxcXS87XG5leHBvcnRzLkRPVF9SRSA9IC9cXC4uKlxcLihzd1tweF0pJHx+JHxcXC5zdWJsLipcXC50bXAvO1xuZXhwb3J0cy5SRVBMQUNFUl9SRSA9IC9eXFwuWy9cXFxcXS87XG5cbmV4cG9ydHMuU0xBU0ggPSAnLyc7XG5leHBvcnRzLlNMQVNIX1NMQVNIID0gJy8vJztcbmV4cG9ydHMuQlJBQ0VfU1RBUlQgPSAneyc7XG5leHBvcnRzLkJBTkcgPSAnISc7XG5leHBvcnRzLk9ORV9ET1QgPSAnLic7XG5leHBvcnRzLlRXT19ET1RTID0gJy4uJztcbmV4cG9ydHMuU1RBUiA9ICcqJztcbmV4cG9ydHMuR0xPQlNUQVIgPSAnKionO1xuZXhwb3J0cy5ST09UX0dMT0JTVEFSID0gJy8qKi8qJztcbmV4cG9ydHMuU0xBU0hfR0xPQlNUQVIgPSAnLyoqJztcbmV4cG9ydHMuRElSX1NVRkZJWCA9ICdEaXInO1xuZXhwb3J0cy5BTllNQVRDSF9PUFRTID0ge2RvdDogdHJ1ZX07XG5leHBvcnRzLlNUUklOR19UWVBFID0gJ3N0cmluZyc7XG5leHBvcnRzLkZVTkNUSU9OX1RZUEUgPSAnZnVuY3Rpb24nO1xuZXhwb3J0cy5FTVBUWV9TVFIgPSAnJztcbmV4cG9ydHMuRU1QVFlfRk4gPSAoKSA9PiB7fTtcbmV4cG9ydHMuSURFTlRJVFlfRk4gPSB2YWwgPT4gdmFsO1xuXG5leHBvcnRzLmlzV2luZG93cyA9IHBsYXRmb3JtID09PSAnd2luMzInO1xuZXhwb3J0cy5pc01hY29zID0gcGxhdGZvcm0gPT09ICdkYXJ3aW4nO1xuZXhwb3J0cy5pc0xpbnV4ID0gcGxhdGZvcm0gPT09ICdsaW51eCc7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHN5c1BhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB7IHByb21pc2lmeSB9ID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgaXNCaW5hcnlQYXRoID0gcmVxdWlyZSgnaXMtYmluYXJ5LXBhdGgnKTtcbmNvbnN0IHtcbiAgaXNXaW5kb3dzLFxuICBpc0xpbnV4LFxuICBFTVBUWV9GTixcbiAgRU1QVFlfU1RSLFxuICBLRVlfTElTVEVORVJTLFxuICBLRVlfRVJSLFxuICBLRVlfUkFXLFxuICBIQU5ETEVSX0tFWVMsXG4gIEVWX0NIQU5HRSxcbiAgRVZfQURELFxuICBFVl9BRERfRElSLFxuICBFVl9FUlJPUixcbiAgU1RSX0RBVEEsXG4gIFNUUl9FTkQsXG4gIEJSQUNFX1NUQVJULFxuICBTVEFSXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3QgVEhST1RUTEVfTU9ERV9XQVRDSCA9ICd3YXRjaCc7XG5cbmNvbnN0IG9wZW4gPSBwcm9taXNpZnkoZnMub3Blbik7XG5jb25zdCBzdGF0ID0gcHJvbWlzaWZ5KGZzLnN0YXQpO1xuY29uc3QgbHN0YXQgPSBwcm9taXNpZnkoZnMubHN0YXQpO1xuY29uc3QgY2xvc2UgPSBwcm9taXNpZnkoZnMuY2xvc2UpO1xuY29uc3QgZnNyZWFscGF0aCA9IHByb21pc2lmeShmcy5yZWFscGF0aCk7XG5cbmNvbnN0IHN0YXRNZXRob2RzID0geyBsc3RhdCwgc3RhdCB9O1xuXG4vLyBUT0RPOiBlbWl0IGVycm9ycyBwcm9wZXJseS4gRXhhbXBsZTogRU1GSUxFIG9uIE1hY29zLlxuY29uc3QgZm9yZWFjaCA9ICh2YWwsIGZuKSA9PiB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICB2YWwuZm9yRWFjaChmbik7XG4gIH0gZWxzZSB7XG4gICAgZm4odmFsKTtcbiAgfVxufTtcblxuY29uc3QgYWRkQW5kQ29udmVydCA9IChtYWluLCBwcm9wLCBpdGVtKSA9PiB7XG4gIGxldCBjb250YWluZXIgPSBtYWluW3Byb3BdO1xuICBpZiAoIShjb250YWluZXIgaW5zdGFuY2VvZiBTZXQpKSB7XG4gICAgbWFpbltwcm9wXSA9IGNvbnRhaW5lciA9IG5ldyBTZXQoW2NvbnRhaW5lcl0pO1xuICB9XG4gIGNvbnRhaW5lci5hZGQoaXRlbSk7XG59O1xuXG5jb25zdCBjbGVhckl0ZW0gPSBjb250ID0+IGtleSA9PiB7XG4gIGNvbnN0IHNldCA9IGNvbnRba2V5XTtcbiAgaWYgKHNldCBpbnN0YW5jZW9mIFNldCkge1xuICAgIHNldC5jbGVhcigpO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBjb250W2tleV07XG4gIH1cbn07XG5cbmNvbnN0IGRlbEZyb21TZXQgPSAobWFpbiwgcHJvcCwgaXRlbSkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBtYWluW3Byb3BdO1xuICBpZiAoY29udGFpbmVyIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgY29udGFpbmVyLmRlbGV0ZShpdGVtKTtcbiAgfSBlbHNlIGlmIChjb250YWluZXIgPT09IGl0ZW0pIHtcbiAgICBkZWxldGUgbWFpbltwcm9wXTtcbiAgfVxufTtcblxuY29uc3QgaXNFbXB0eVNldCA9ICh2YWwpID0+IHZhbCBpbnN0YW5jZW9mIFNldCA/IHZhbC5zaXplID09PSAwIDogIXZhbDtcblxuLyoqXG4gKiBAdHlwZWRlZiB7U3RyaW5nfSBQYXRoXG4gKi9cblxuLy8gZnNfd2F0Y2ggaGVscGVyc1xuXG4vLyBvYmplY3QgdG8gaG9sZCBwZXItcHJvY2VzcyBmc193YXRjaCBpbnN0YW5jZXNcbi8vIChtYXkgYmUgc2hhcmVkIGFjcm9zcyBjaG9raWRhciBGU1dhdGNoZXIgaW5zdGFuY2VzKVxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEZzV2F0Y2hDb250YWluZXJcbiAqIEBwcm9wZXJ0eSB7U2V0fSBsaXN0ZW5lcnNcbiAqIEBwcm9wZXJ0eSB7U2V0fSBlcnJIYW5kbGVyc1xuICogQHByb3BlcnR5IHtTZXR9IHJhd0VtaXR0ZXJzXG4gKiBAcHJvcGVydHkge2ZzLkZTV2F0Y2hlcj19IHdhdGNoZXJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbj19IHdhdGNoZXJVbnVzYWJsZVxuICovXG5cbi8qKlxuICogQHR5cGUge01hcDxTdHJpbmcsRnNXYXRjaENvbnRhaW5lcj59XG4gKi9cbmNvbnN0IEZzV2F0Y2hJbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHRoZSBmc193YXRjaCBpbnRlcmZhY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIHRvIGJlIHdhdGNoZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHRvIGJlIHBhc3NlZCB0byBmc193YXRjaFxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgbWFpbiBldmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcnJIYW5kbGVyIGVtaXRzIGluZm8gYWJvdXQgZXJyb3JzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbWl0UmF3IGVtaXRzIHJhdyBldmVudCBkYXRhXG4gKiBAcmV0dXJucyB7ZnMuRlNXYXRjaGVyfSBuZXcgZnNldmVudHMgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRnNXYXRjaEluc3RhbmNlKHBhdGgsIG9wdGlvbnMsIGxpc3RlbmVyLCBlcnJIYW5kbGVyLCBlbWl0UmF3KSB7XG4gIGNvbnN0IGhhbmRsZUV2ZW50ID0gKHJhd0V2ZW50LCBldlBhdGgpID0+IHtcbiAgICBsaXN0ZW5lcihwYXRoKTtcbiAgICBlbWl0UmF3KHJhd0V2ZW50LCBldlBhdGgsIHt3YXRjaGVkUGF0aDogcGF0aH0pO1xuXG4gICAgLy8gZW1pdCBiYXNlZCBvbiBldmVudHMgb2NjdXJyaW5nIGZvciBmaWxlcyBmcm9tIGEgZGlyZWN0b3J5J3Mgd2F0Y2hlciBpblxuICAgIC8vIGNhc2UgdGhlIGZpbGUncyB3YXRjaGVyIG1pc3NlcyBpdCAoYW5kIHJlbHkgb24gdGhyb3R0bGluZyB0byBkZS1kdXBlKVxuICAgIGlmIChldlBhdGggJiYgcGF0aCAhPT0gZXZQYXRoKSB7XG4gICAgICBmc1dhdGNoQnJvYWRjYXN0KFxuICAgICAgICBzeXNQYXRoLnJlc29sdmUocGF0aCwgZXZQYXRoKSwgS0VZX0xJU1RFTkVSUywgc3lzUGF0aC5qb2luKHBhdGgsIGV2UGF0aClcbiAgICAgICk7XG4gICAgfVxuICB9O1xuICB0cnkge1xuICAgIHJldHVybiBmcy53YXRjaChwYXRoLCBvcHRpb25zLCBoYW5kbGVFdmVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJySGFuZGxlcihlcnJvcik7XG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgZm9yIHBhc3NpbmcgZnNfd2F0Y2ggZXZlbnQgZGF0YSB0byBhIGNvbGxlY3Rpb24gb2YgbGlzdGVuZXJzXG4gKiBAcGFyYW0ge1BhdGh9IGZ1bGxQYXRoIGFic29sdXRlIHBhdGggYm91bmQgdG8gZnNfd2F0Y2ggaW5zdGFuY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIGxpc3RlbmVyIHR5cGVcbiAqIEBwYXJhbSB7Kj19IHZhbDEgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBsaXN0ZW5lcnNcbiAqIEBwYXJhbSB7Kj19IHZhbDJcbiAqIEBwYXJhbSB7Kj19IHZhbDNcbiAqL1xuY29uc3QgZnNXYXRjaEJyb2FkY2FzdCA9IChmdWxsUGF0aCwgdHlwZSwgdmFsMSwgdmFsMiwgdmFsMykgPT4ge1xuICBjb25zdCBjb250ID0gRnNXYXRjaEluc3RhbmNlcy5nZXQoZnVsbFBhdGgpO1xuICBpZiAoIWNvbnQpIHJldHVybjtcbiAgZm9yZWFjaChjb250W3R5cGVdLCAobGlzdGVuZXIpID0+IHtcbiAgICBsaXN0ZW5lcih2YWwxLCB2YWwyLCB2YWwzKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEluc3RhbnRpYXRlcyB0aGUgZnNfd2F0Y2ggaW50ZXJmYWNlIG9yIGJpbmRzIGxpc3RlbmVyc1xuICogdG8gYW4gZXhpc3Rpbmcgb25lIGNvdmVyaW5nIHRoZSBzYW1lIGZpbGUgc3lzdGVtIGVudHJ5XG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtTdHJpbmd9IGZ1bGxQYXRoIGFic29sdXRlIHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHRvIGJlIHBhc3NlZCB0byBmc193YXRjaFxuICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzIGNvbnRhaW5lciBmb3IgZXZlbnQgbGlzdGVuZXIgZnVuY3Rpb25zXG4gKi9cbmNvbnN0IHNldEZzV2F0Y2hMaXN0ZW5lciA9IChwYXRoLCBmdWxsUGF0aCwgb3B0aW9ucywgaGFuZGxlcnMpID0+IHtcbiAgY29uc3Qge2xpc3RlbmVyLCBlcnJIYW5kbGVyLCByYXdFbWl0dGVyfSA9IGhhbmRsZXJzO1xuICBsZXQgY29udCA9IEZzV2F0Y2hJbnN0YW5jZXMuZ2V0KGZ1bGxQYXRoKTtcblxuICAvKiogQHR5cGUge2ZzLkZTV2F0Y2hlcj19ICovXG4gIGxldCB3YXRjaGVyO1xuICBpZiAoIW9wdGlvbnMucGVyc2lzdGVudCkge1xuICAgIHdhdGNoZXIgPSBjcmVhdGVGc1dhdGNoSW5zdGFuY2UoXG4gICAgICBwYXRoLCBvcHRpb25zLCBsaXN0ZW5lciwgZXJySGFuZGxlciwgcmF3RW1pdHRlclxuICAgICk7XG4gICAgcmV0dXJuIHdhdGNoZXIuY2xvc2UuYmluZCh3YXRjaGVyKTtcbiAgfVxuICBpZiAoY29udCkge1xuICAgIGFkZEFuZENvbnZlcnQoY29udCwgS0VZX0xJU1RFTkVSUywgbGlzdGVuZXIpO1xuICAgIGFkZEFuZENvbnZlcnQoY29udCwgS0VZX0VSUiwgZXJySGFuZGxlcik7XG4gICAgYWRkQW5kQ29udmVydChjb250LCBLRVlfUkFXLCByYXdFbWl0dGVyKTtcbiAgfSBlbHNlIHtcbiAgICB3YXRjaGVyID0gY3JlYXRlRnNXYXRjaEluc3RhbmNlKFxuICAgICAgcGF0aCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBmc1dhdGNoQnJvYWRjYXN0LmJpbmQobnVsbCwgZnVsbFBhdGgsIEtFWV9MSVNURU5FUlMpLFxuICAgICAgZXJySGFuZGxlciwgLy8gbm8gbmVlZCB0byB1c2UgYnJvYWRjYXN0IGhlcmVcbiAgICAgIGZzV2F0Y2hCcm9hZGNhc3QuYmluZChudWxsLCBmdWxsUGF0aCwgS0VZX1JBVylcbiAgICApO1xuICAgIGlmICghd2F0Y2hlcikgcmV0dXJuO1xuICAgIHdhdGNoZXIub24oRVZfRVJST1IsIGFzeW5jIChlcnJvcikgPT4ge1xuICAgICAgY29uc3QgYnJvYWRjYXN0RXJyID0gZnNXYXRjaEJyb2FkY2FzdC5iaW5kKG51bGwsIGZ1bGxQYXRoLCBLRVlfRVJSKTtcbiAgICAgIGNvbnQud2F0Y2hlclVudXNhYmxlID0gdHJ1ZTsgLy8gZG9jdW1lbnRlZCBzaW5jZSBOb2RlIDEwLjQuMVxuICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy80MzM3XG4gICAgICBpZiAoaXNXaW5kb3dzICYmIGVycm9yLmNvZGUgPT09ICdFUEVSTScpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBmZCA9IGF3YWl0IG9wZW4ocGF0aCwgJ3InKTtcbiAgICAgICAgICBhd2FpdCBjbG9zZShmZCk7XG4gICAgICAgICAgYnJvYWRjYXN0RXJyKGVycm9yKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJvYWRjYXN0RXJyKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb250ID0ge1xuICAgICAgbGlzdGVuZXJzOiBsaXN0ZW5lcixcbiAgICAgIGVyckhhbmRsZXJzOiBlcnJIYW5kbGVyLFxuICAgICAgcmF3RW1pdHRlcnM6IHJhd0VtaXR0ZXIsXG4gICAgICB3YXRjaGVyXG4gICAgfTtcbiAgICBGc1dhdGNoSW5zdGFuY2VzLnNldChmdWxsUGF0aCwgY29udCk7XG4gIH1cbiAgLy8gY29uc3QgaW5kZXggPSBjb250Lmxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcblxuICAvLyByZW1vdmVzIHRoaXMgaW5zdGFuY2UncyBsaXN0ZW5lcnMgYW5kIGNsb3NlcyB0aGUgdW5kZXJseWluZyBmc193YXRjaFxuICAvLyBpbnN0YW5jZSBpZiB0aGVyZSBhcmUgbm8gbW9yZSBsaXN0ZW5lcnMgbGVmdFxuICByZXR1cm4gKCkgPT4ge1xuICAgIGRlbEZyb21TZXQoY29udCwgS0VZX0xJU1RFTkVSUywgbGlzdGVuZXIpO1xuICAgIGRlbEZyb21TZXQoY29udCwgS0VZX0VSUiwgZXJySGFuZGxlcik7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfUkFXLCByYXdFbWl0dGVyKTtcbiAgICBpZiAoaXNFbXB0eVNldChjb250Lmxpc3RlbmVycykpIHtcbiAgICAgIC8vIENoZWNrIHRvIHByb3RlY3QgYWdhaW5zdCBpc3N1ZSBnaC03MzAuXG4gICAgICAvLyBpZiAoY29udC53YXRjaGVyVW51c2FibGUpIHtcbiAgICAgIGNvbnQud2F0Y2hlci5jbG9zZSgpO1xuICAgICAgLy8gfVxuICAgICAgRnNXYXRjaEluc3RhbmNlcy5kZWxldGUoZnVsbFBhdGgpO1xuICAgICAgSEFORExFUl9LRVlTLmZvckVhY2goY2xlYXJJdGVtKGNvbnQpKTtcbiAgICAgIGNvbnQud2F0Y2hlciA9IHVuZGVmaW5lZDtcbiAgICAgIE9iamVjdC5mcmVlemUoY29udCk7XG4gICAgfVxuICB9O1xufTtcblxuLy8gZnNfd2F0Y2hGaWxlIGhlbHBlcnNcblxuLy8gb2JqZWN0IHRvIGhvbGQgcGVyLXByb2Nlc3MgZnNfd2F0Y2hGaWxlIGluc3RhbmNlc1xuLy8gKG1heSBiZSBzaGFyZWQgYWNyb3NzIGNob2tpZGFyIEZTV2F0Y2hlciBpbnN0YW5jZXMpXG5jb25zdCBGc1dhdGNoRmlsZUluc3RhbmNlcyA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgdGhlIGZzX3dhdGNoRmlsZSBpbnRlcmZhY2Ugb3IgYmluZHMgbGlzdGVuZXJzXG4gKiB0byBhbiBleGlzdGluZyBvbmUgY292ZXJpbmcgdGhlIHNhbWUgZmlsZSBzeXN0ZW0gZW50cnlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIHRvIGJlIHdhdGNoZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBmdWxsUGF0aCBhYnNvbHV0ZSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBvcHRpb25zIHRvIGJlIHBhc3NlZCB0byBmc193YXRjaEZpbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyBjb250YWluZXIgZm9yIGV2ZW50IGxpc3RlbmVyIGZ1bmN0aW9uc1xuICogQHJldHVybnMge0Z1bmN0aW9ufSBjbG9zZXJcbiAqL1xuY29uc3Qgc2V0RnNXYXRjaEZpbGVMaXN0ZW5lciA9IChwYXRoLCBmdWxsUGF0aCwgb3B0aW9ucywgaGFuZGxlcnMpID0+IHtcbiAgY29uc3Qge2xpc3RlbmVyLCByYXdFbWl0dGVyfSA9IGhhbmRsZXJzO1xuICBsZXQgY29udCA9IEZzV2F0Y2hGaWxlSW5zdGFuY2VzLmdldChmdWxsUGF0aCk7XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMsIHByZWZlci1kZXN0cnVjdHVyaW5nICovXG4gIGxldCBsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gIGxldCByYXdFbWl0dGVycyA9IG5ldyBTZXQoKTtcblxuICBjb25zdCBjb3B0cyA9IGNvbnQgJiYgY29udC5vcHRpb25zO1xuICBpZiAoY29wdHMgJiYgKGNvcHRzLnBlcnNpc3RlbnQgPCBvcHRpb25zLnBlcnNpc3RlbnQgfHwgY29wdHMuaW50ZXJ2YWwgPiBvcHRpb25zLmludGVydmFsKSkge1xuICAgIC8vIFwiVXBncmFkZVwiIHRoZSB3YXRjaGVyIHRvIHBlcnNpc3RlbmNlIG9yIGEgcXVpY2tlciBpbnRlcnZhbC5cbiAgICAvLyBUaGlzIGNyZWF0ZXMgc29tZSB1bmxpa2VseSBlZGdlIGNhc2UgaXNzdWVzIGlmIHRoZSB1c2VyIG1peGVzXG4gICAgLy8gc2V0dGluZ3MgaW4gYSB2ZXJ5IHdlaXJkIHdheSwgYnV0IHNvbHZpbmcgZm9yIHRob3NlIGNhc2VzXG4gICAgLy8gZG9lc24ndCBzZWVtIHdvcnRod2hpbGUgZm9yIHRoZSBhZGRlZCBjb21wbGV4aXR5LlxuICAgIGxpc3RlbmVycyA9IGNvbnQubGlzdGVuZXJzO1xuICAgIHJhd0VtaXR0ZXJzID0gY29udC5yYXdFbWl0dGVycztcbiAgICBmcy51bndhdGNoRmlsZShmdWxsUGF0aCk7XG4gICAgY29udCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMsIHByZWZlci1kZXN0cnVjdHVyaW5nICovXG5cbiAgaWYgKGNvbnQpIHtcbiAgICBhZGRBbmRDb252ZXJ0KGNvbnQsIEtFWV9MSVNURU5FUlMsIGxpc3RlbmVyKTtcbiAgICBhZGRBbmRDb252ZXJ0KGNvbnQsIEtFWV9SQVcsIHJhd0VtaXR0ZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIFRPRE9cbiAgICAvLyBsaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICAvLyByYXdFbWl0dGVycy5hZGQocmF3RW1pdHRlcik7XG4gICAgY29udCA9IHtcbiAgICAgIGxpc3RlbmVyczogbGlzdGVuZXIsXG4gICAgICByYXdFbWl0dGVyczogcmF3RW1pdHRlcixcbiAgICAgIG9wdGlvbnMsXG4gICAgICB3YXRjaGVyOiBmcy53YXRjaEZpbGUoZnVsbFBhdGgsIG9wdGlvbnMsIChjdXJyLCBwcmV2KSA9PiB7XG4gICAgICAgIGZvcmVhY2goY29udC5yYXdFbWl0dGVycywgKHJhd0VtaXR0ZXIpID0+IHtcbiAgICAgICAgICByYXdFbWl0dGVyKEVWX0NIQU5HRSwgZnVsbFBhdGgsIHtjdXJyLCBwcmV2fSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjdXJybXRpbWUgPSBjdXJyLm10aW1lTXM7XG4gICAgICAgIGlmIChjdXJyLnNpemUgIT09IHByZXYuc2l6ZSB8fCBjdXJybXRpbWUgPiBwcmV2Lm10aW1lTXMgfHwgY3Vycm10aW1lID09PSAwKSB7XG4gICAgICAgICAgZm9yZWFjaChjb250Lmxpc3RlbmVycywgKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcihwYXRoLCBjdXJyKSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfTtcbiAgICBGc1dhdGNoRmlsZUluc3RhbmNlcy5zZXQoZnVsbFBhdGgsIGNvbnQpO1xuICB9XG4gIC8vIGNvbnN0IGluZGV4ID0gY29udC5saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG5cbiAgLy8gUmVtb3ZlcyB0aGlzIGluc3RhbmNlJ3MgbGlzdGVuZXJzIGFuZCBjbG9zZXMgdGhlIHVuZGVybHlpbmcgZnNfd2F0Y2hGaWxlXG4gIC8vIGluc3RhbmNlIGlmIHRoZXJlIGFyZSBubyBtb3JlIGxpc3RlbmVycyBsZWZ0LlxuICByZXR1cm4gKCkgPT4ge1xuICAgIGRlbEZyb21TZXQoY29udCwgS0VZX0xJU1RFTkVSUywgbGlzdGVuZXIpO1xuICAgIGRlbEZyb21TZXQoY29udCwgS0VZX1JBVywgcmF3RW1pdHRlcik7XG4gICAgaWYgKGlzRW1wdHlTZXQoY29udC5saXN0ZW5lcnMpKSB7XG4gICAgICBGc1dhdGNoRmlsZUluc3RhbmNlcy5kZWxldGUoZnVsbFBhdGgpO1xuICAgICAgZnMudW53YXRjaEZpbGUoZnVsbFBhdGgpO1xuICAgICAgY29udC5vcHRpb25zID0gY29udC53YXRjaGVyID0gdW5kZWZpbmVkO1xuICAgICAgT2JqZWN0LmZyZWV6ZShjb250KTtcbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIEBtaXhpblxuICovXG5jbGFzcyBOb2RlRnNIYW5kbGVyIHtcblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydChcIi4uL2luZGV4XCIpLkZTV2F0Y2hlcn0gZnNXXG4gKi9cbmNvbnN0cnVjdG9yKGZzVykge1xuICB0aGlzLmZzdyA9IGZzVztcbiAgdGhpcy5fYm91bmRIYW5kbGVFcnJvciA9IChlcnJvcikgPT4gZnNXLl9oYW5kbGVFcnJvcihlcnJvcik7XG59XG5cbi8qKlxuICogV2F0Y2ggZmlsZSBmb3IgY2hhbmdlcyB3aXRoIGZzX3dhdGNoRmlsZSBvciBmc193YXRjaC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIHRvIGZpbGUgb3IgZGlyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBvbiBmcyBjaGFuZ2VcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gY2xvc2VyIGZvciB0aGUgd2F0Y2hlciBpbnN0YW5jZVxuICovXG5fd2F0Y2hXaXRoTm9kZUZzKHBhdGgsIGxpc3RlbmVyKSB7XG4gIGNvbnN0IG9wdHMgPSB0aGlzLmZzdy5vcHRpb25zO1xuICBjb25zdCBkaXJlY3RvcnkgPSBzeXNQYXRoLmRpcm5hbWUocGF0aCk7XG4gIGNvbnN0IGJhc2VuYW1lID0gc3lzUGF0aC5iYXNlbmFtZShwYXRoKTtcbiAgY29uc3QgcGFyZW50ID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoZGlyZWN0b3J5KTtcbiAgcGFyZW50LmFkZChiYXNlbmFtZSk7XG4gIGNvbnN0IGFic29sdXRlUGF0aCA9IHN5c1BhdGgucmVzb2x2ZShwYXRoKTtcbiAgY29uc3Qgb3B0aW9ucyA9IHtwZXJzaXN0ZW50OiBvcHRzLnBlcnNpc3RlbnR9O1xuICBpZiAoIWxpc3RlbmVyKSBsaXN0ZW5lciA9IEVNUFRZX0ZOO1xuXG4gIGxldCBjbG9zZXI7XG4gIGlmIChvcHRzLnVzZVBvbGxpbmcpIHtcbiAgICBvcHRpb25zLmludGVydmFsID0gb3B0cy5lbmFibGVCaW5hcnlJbnRlcnZhbCAmJiBpc0JpbmFyeVBhdGgoYmFzZW5hbWUpID9cbiAgICAgIG9wdHMuYmluYXJ5SW50ZXJ2YWwgOiBvcHRzLmludGVydmFsO1xuICAgIGNsb3NlciA9IHNldEZzV2F0Y2hGaWxlTGlzdGVuZXIocGF0aCwgYWJzb2x1dGVQYXRoLCBvcHRpb25zLCB7XG4gICAgICBsaXN0ZW5lcixcbiAgICAgIHJhd0VtaXR0ZXI6IHRoaXMuZnN3Ll9lbWl0UmF3XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2xvc2VyID0gc2V0RnNXYXRjaExpc3RlbmVyKHBhdGgsIGFic29sdXRlUGF0aCwgb3B0aW9ucywge1xuICAgICAgbGlzdGVuZXIsXG4gICAgICBlcnJIYW5kbGVyOiB0aGlzLl9ib3VuZEhhbmRsZUVycm9yLFxuICAgICAgcmF3RW1pdHRlcjogdGhpcy5mc3cuX2VtaXRSYXdcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY2xvc2VyO1xufVxuXG4vKipcbiAqIFdhdGNoIGEgZmlsZSBhbmQgZW1pdCBhZGQgZXZlbnQgaWYgd2FycmFudGVkLlxuICogQHBhcmFtIHtQYXRofSBmaWxlIFBhdGhcbiAqIEBwYXJhbSB7ZnMuU3RhdHN9IHN0YXRzIHJlc3VsdCBvZiBmc19zdGF0XG4gKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWxBZGQgd2FzIHRoZSBmaWxlIGFkZGVkIGF0IHdhdGNoIGluc3RhbnRpYXRpb24/XG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGNsb3NlciBmb3IgdGhlIHdhdGNoZXIgaW5zdGFuY2VcbiAqL1xuX2hhbmRsZUZpbGUoZmlsZSwgc3RhdHMsIGluaXRpYWxBZGQpIHtcbiAgaWYgKHRoaXMuZnN3LmNsb3NlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkaXJuYW1lID0gc3lzUGF0aC5kaXJuYW1lKGZpbGUpO1xuICBjb25zdCBiYXNlbmFtZSA9IHN5c1BhdGguYmFzZW5hbWUoZmlsZSk7XG4gIGNvbnN0IHBhcmVudCA9IHRoaXMuZnN3Ll9nZXRXYXRjaGVkRGlyKGRpcm5hbWUpO1xuICAvLyBzdGF0cyBpcyBhbHdheXMgcHJlc2VudFxuICBsZXQgcHJldlN0YXRzID0gc3RhdHM7XG5cbiAgLy8gaWYgdGhlIGZpbGUgaXMgYWxyZWFkeSBiZWluZyB3YXRjaGVkLCBkbyBub3RoaW5nXG4gIGlmIChwYXJlbnQuaGFzKGJhc2VuYW1lKSkgcmV0dXJuO1xuXG4gIGNvbnN0IGxpc3RlbmVyID0gYXN5bmMgKHBhdGgsIG5ld1N0YXRzKSA9PiB7XG4gICAgaWYgKCF0aGlzLmZzdy5fdGhyb3R0bGUoVEhST1RUTEVfTU9ERV9XQVRDSCwgZmlsZSwgNSkpIHJldHVybjtcbiAgICBpZiAoIW5ld1N0YXRzIHx8IG5ld1N0YXRzLm10aW1lTXMgPT09IDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5ld1N0YXRzID0gYXdhaXQgc3RhdChmaWxlKTtcbiAgICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgICAgICAvLyBDaGVjayB0aGF0IGNoYW5nZSBldmVudCB3YXMgbm90IGZpcmVkIGJlY2F1c2Ugb2YgY2hhbmdlZCBvbmx5IGFjY2Vzc1RpbWUuXG4gICAgICAgIGNvbnN0IGF0ID0gbmV3U3RhdHMuYXRpbWVNcztcbiAgICAgICAgY29uc3QgbXQgPSBuZXdTdGF0cy5tdGltZU1zO1xuICAgICAgICBpZiAoIWF0IHx8IGF0IDw9IG10IHx8IG10ICE9PSBwcmV2U3RhdHMubXRpbWVNcykge1xuICAgICAgICAgIHRoaXMuZnN3Ll9lbWl0KEVWX0NIQU5HRSwgZmlsZSwgbmV3U3RhdHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0xpbnV4ICYmIHByZXZTdGF0cy5pbm8gIT09IG5ld1N0YXRzLmlubykge1xuICAgICAgICAgIHRoaXMuZnN3Ll9jbG9zZUZpbGUocGF0aClcbiAgICAgICAgICBwcmV2U3RhdHMgPSBuZXdTdGF0cztcbiAgICAgICAgICB0aGlzLmZzdy5fYWRkUGF0aENsb3NlcihwYXRoLCB0aGlzLl93YXRjaFdpdGhOb2RlRnMoZmlsZSwgbGlzdGVuZXIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmV2U3RhdHMgPSBuZXdTdGF0cztcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gRml4IGlzc3VlcyB3aGVyZSBtdGltZSBpcyBudWxsIGJ1dCBmaWxlIGlzIHN0aWxsIHByZXNlbnRcbiAgICAgICAgdGhpcy5mc3cuX3JlbW92ZShkaXJuYW1lLCBiYXNlbmFtZSk7XG4gICAgICB9XG4gICAgICAvLyBhZGQgaXMgYWJvdXQgdG8gYmUgZW1pdHRlZCBpZiBmaWxlIG5vdCBhbHJlYWR5IHRyYWNrZWQgaW4gcGFyZW50XG4gICAgfSBlbHNlIGlmIChwYXJlbnQuaGFzKGJhc2VuYW1lKSkge1xuICAgICAgLy8gQ2hlY2sgdGhhdCBjaGFuZ2UgZXZlbnQgd2FzIG5vdCBmaXJlZCBiZWNhdXNlIG9mIGNoYW5nZWQgb25seSBhY2Nlc3NUaW1lLlxuICAgICAgY29uc3QgYXQgPSBuZXdTdGF0cy5hdGltZU1zO1xuICAgICAgY29uc3QgbXQgPSBuZXdTdGF0cy5tdGltZU1zO1xuICAgICAgaWYgKCFhdCB8fCBhdCA8PSBtdCB8fCBtdCAhPT0gcHJldlN0YXRzLm10aW1lTXMpIHtcbiAgICAgICAgdGhpcy5mc3cuX2VtaXQoRVZfQ0hBTkdFLCBmaWxlLCBuZXdTdGF0cyk7XG4gICAgICB9XG4gICAgICBwcmV2U3RhdHMgPSBuZXdTdGF0cztcbiAgICB9XG4gIH1cbiAgLy8ga2ljayBvZmYgdGhlIHdhdGNoZXJcbiAgY29uc3QgY2xvc2VyID0gdGhpcy5fd2F0Y2hXaXRoTm9kZUZzKGZpbGUsIGxpc3RlbmVyKTtcblxuICAvLyBlbWl0IGFuIGFkZCBldmVudCBpZiB3ZSdyZSBzdXBwb3NlZCB0b1xuICBpZiAoIShpbml0aWFsQWRkICYmIHRoaXMuZnN3Lm9wdGlvbnMuaWdub3JlSW5pdGlhbCkgJiYgdGhpcy5mc3cuX2lzbnRJZ25vcmVkKGZpbGUpKSB7XG4gICAgaWYgKCF0aGlzLmZzdy5fdGhyb3R0bGUoRVZfQURELCBmaWxlLCAwKSkgcmV0dXJuO1xuICAgIHRoaXMuZnN3Ll9lbWl0KEVWX0FERCwgZmlsZSwgc3RhdHMpO1xuICB9XG5cbiAgcmV0dXJuIGNsb3Nlcjtcbn1cblxuLyoqXG4gKiBIYW5kbGUgc3ltbGlua3MgZW5jb3VudGVyZWQgd2hpbGUgcmVhZGluZyBhIGRpci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSByZXR1cm5lZCBieSByZWFkZGlycFxuICogQHBhcmFtIHtTdHJpbmd9IGRpcmVjdG9yeSBwYXRoIG9mIGRpciBiZWluZyByZWFkXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBvZiB0aGlzIGl0ZW1cbiAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIGJhc2VuYW1lIG9mIHRoaXMgaXRlbVxuICogQHJldHVybnMge1Byb21pc2U8Qm9vbGVhbj59IHRydWUgaWYgbm8gbW9yZSBwcm9jZXNzaW5nIGlzIG5lZWRlZCBmb3IgdGhpcyBlbnRyeS5cbiAqL1xuYXN5bmMgX2hhbmRsZVN5bWxpbmsoZW50cnksIGRpcmVjdG9yeSwgcGF0aCwgaXRlbSkge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGZ1bGwgPSBlbnRyeS5mdWxsUGF0aDtcbiAgY29uc3QgZGlyID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoZGlyZWN0b3J5KTtcblxuICBpZiAoIXRoaXMuZnN3Lm9wdGlvbnMuZm9sbG93U3ltbGlua3MpIHtcbiAgICAvLyB3YXRjaCBzeW1saW5rIGRpcmVjdGx5IChkb24ndCBmb2xsb3cpIGFuZCBkZXRlY3QgY2hhbmdlc1xuICAgIHRoaXMuZnN3Ll9pbmNyUmVhZHlDb3VudCgpO1xuICAgIGNvbnN0IGxpbmtQYXRoID0gYXdhaXQgZnNyZWFscGF0aChwYXRoKTtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKGRpci5oYXMoaXRlbSkpIHtcbiAgICAgIGlmICh0aGlzLmZzdy5fc3ltbGlua1BhdGhzLmdldChmdWxsKSAhPT0gbGlua1BhdGgpIHtcbiAgICAgICAgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5zZXQoZnVsbCwgbGlua1BhdGgpO1xuICAgICAgICB0aGlzLmZzdy5fZW1pdChFVl9DSEFOR0UsIHBhdGgsIGVudHJ5LnN0YXRzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGlyLmFkZChpdGVtKTtcbiAgICAgIHRoaXMuZnN3Ll9zeW1saW5rUGF0aHMuc2V0KGZ1bGwsIGxpbmtQYXRoKTtcbiAgICAgIHRoaXMuZnN3Ll9lbWl0KEVWX0FERCwgcGF0aCwgZW50cnkuc3RhdHMpO1xuICAgIH1cbiAgICB0aGlzLmZzdy5fZW1pdFJlYWR5KCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBkb24ndCBmb2xsb3cgdGhlIHNhbWUgc3ltbGluayBtb3JlIHRoYW4gb25jZVxuICBpZiAodGhpcy5mc3cuX3N5bWxpbmtQYXRocy5oYXMoZnVsbCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHRoaXMuZnN3Ll9zeW1saW5rUGF0aHMuc2V0KGZ1bGwsIHRydWUpO1xufVxuXG5faGFuZGxlUmVhZChkaXJlY3RvcnksIGluaXRpYWxBZGQsIHdoLCB0YXJnZXQsIGRpciwgZGVwdGgsIHRocm90dGxlcikge1xuICAvLyBOb3JtYWxpemUgdGhlIGRpcmVjdG9yeSBuYW1lIG9uIFdpbmRvd3NcbiAgZGlyZWN0b3J5ID0gc3lzUGF0aC5qb2luKGRpcmVjdG9yeSwgRU1QVFlfU1RSKTtcblxuICBpZiAoIXdoLmhhc0dsb2IpIHtcbiAgICB0aHJvdHRsZXIgPSB0aGlzLmZzdy5fdGhyb3R0bGUoJ3JlYWRkaXInLCBkaXJlY3RvcnksIDEwMDApO1xuICAgIGlmICghdGhyb3R0bGVyKSByZXR1cm47XG4gIH1cblxuICBjb25zdCBwcmV2aW91cyA9IHRoaXMuZnN3Ll9nZXRXYXRjaGVkRGlyKHdoLnBhdGgpO1xuICBjb25zdCBjdXJyZW50ID0gbmV3IFNldCgpO1xuXG4gIGxldCBzdHJlYW0gPSB0aGlzLmZzdy5fcmVhZGRpcnAoZGlyZWN0b3J5LCB7XG4gICAgZmlsZUZpbHRlcjogZW50cnkgPT4gd2guZmlsdGVyUGF0aChlbnRyeSksXG4gICAgZGlyZWN0b3J5RmlsdGVyOiBlbnRyeSA9PiB3aC5maWx0ZXJEaXIoZW50cnkpLFxuICAgIGRlcHRoOiAwXG4gIH0pLm9uKFNUUl9EQVRBLCBhc3luYyAoZW50cnkpID0+IHtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgICBzdHJlYW0gPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGl0ZW0gPSBlbnRyeS5wYXRoO1xuICAgIGxldCBwYXRoID0gc3lzUGF0aC5qb2luKGRpcmVjdG9yeSwgaXRlbSk7XG4gICAgY3VycmVudC5hZGQoaXRlbSk7XG5cbiAgICBpZiAoZW50cnkuc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSAmJiBhd2FpdCB0aGlzLl9oYW5kbGVTeW1saW5rKGVudHJ5LCBkaXJlY3RvcnksIHBhdGgsIGl0ZW0pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkge1xuICAgICAgc3RyZWFtID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBGaWxlcyB0aGF0IHByZXNlbnQgaW4gY3VycmVudCBkaXJlY3Rvcnkgc25hcHNob3RcbiAgICAvLyBidXQgYWJzZW50IGluIHByZXZpb3VzIGFyZSBhZGRlZCB0byB3YXRjaCBsaXN0IGFuZFxuICAgIC8vIGVtaXQgYGFkZGAgZXZlbnQuXG4gICAgaWYgKGl0ZW0gPT09IHRhcmdldCB8fCAhdGFyZ2V0ICYmICFwcmV2aW91cy5oYXMoaXRlbSkpIHtcbiAgICAgIHRoaXMuZnN3Ll9pbmNyUmVhZHlDb3VudCgpO1xuXG4gICAgICAvLyBlbnN1cmUgcmVsYXRpdmVuZXNzIG9mIHBhdGggaXMgcHJlc2VydmVkIGluIGNhc2Ugb2Ygd2F0Y2hlciByZXVzZVxuICAgICAgcGF0aCA9IHN5c1BhdGguam9pbihkaXIsIHN5c1BhdGgucmVsYXRpdmUoZGlyLCBwYXRoKSk7XG5cbiAgICAgIHRoaXMuX2FkZFRvTm9kZUZzKHBhdGgsIGluaXRpYWxBZGQsIHdoLCBkZXB0aCArIDEpO1xuICAgIH1cbiAgfSkub24oRVZfRVJST1IsIHRoaXMuX2JvdW5kSGFuZGxlRXJyb3IpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+XG4gICAgc3RyZWFtLm9uY2UoU1RSX0VORCwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkge1xuICAgICAgICBzdHJlYW0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHdhc1Rocm90dGxlZCA9IHRocm90dGxlciA/IHRocm90dGxlci5jbGVhcigpIDogZmFsc2U7XG5cbiAgICAgIHJlc29sdmUoKTtcblxuICAgICAgLy8gRmlsZXMgdGhhdCBhYnNlbnQgaW4gY3VycmVudCBkaXJlY3Rvcnkgc25hcHNob3RcbiAgICAgIC8vIGJ1dCBwcmVzZW50IGluIHByZXZpb3VzIGVtaXQgYHJlbW92ZWAgZXZlbnRcbiAgICAgIC8vIGFuZCBhcmUgcmVtb3ZlZCBmcm9tIEB3YXRjaGVkW2RpcmVjdG9yeV0uXG4gICAgICBwcmV2aW91cy5nZXRDaGlsZHJlbigpLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbSAhPT0gZGlyZWN0b3J5ICYmXG4gICAgICAgICAgIWN1cnJlbnQuaGFzKGl0ZW0pICYmXG4gICAgICAgICAgLy8gaW4gY2FzZSBvZiBpbnRlcnNlY3RpbmcgZ2xvYnM7XG4gICAgICAgICAgLy8gYSBwYXRoIG1heSBoYXZlIGJlZW4gZmlsdGVyZWQgb3V0IG9mIHRoaXMgcmVhZGRpciwgYnV0XG4gICAgICAgICAgLy8gc2hvdWxkbid0IGJlIHJlbW92ZWQgYmVjYXVzZSBpdCBtYXRjaGVzIGEgZGlmZmVyZW50IGdsb2JcbiAgICAgICAgICAoIXdoLmhhc0dsb2IgfHwgd2guZmlsdGVyUGF0aCh7XG4gICAgICAgICAgICBmdWxsUGF0aDogc3lzUGF0aC5yZXNvbHZlKGRpcmVjdG9yeSwgaXRlbSlcbiAgICAgICAgICB9KSk7XG4gICAgICB9KS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIHRoaXMuZnN3Ll9yZW1vdmUoZGlyZWN0b3J5LCBpdGVtKTtcbiAgICAgIH0pO1xuXG4gICAgICBzdHJlYW0gPSB1bmRlZmluZWQ7XG5cbiAgICAgIC8vIG9uZSBtb3JlIHRpbWUgZm9yIGFueSBtaXNzZWQgaW4gY2FzZSBjaGFuZ2VzIGNhbWUgaW4gZXh0cmVtZWx5IHF1aWNrbHlcbiAgICAgIGlmICh3YXNUaHJvdHRsZWQpIHRoaXMuX2hhbmRsZVJlYWQoZGlyZWN0b3J5LCBmYWxzZSwgd2gsIHRhcmdldCwgZGlyLCBkZXB0aCwgdGhyb3R0bGVyKTtcbiAgICB9KVxuICApO1xufVxuXG4vKipcbiAqIFJlYWQgZGlyZWN0b3J5IHRvIGFkZCAvIHJlbW92ZSBmaWxlcyBmcm9tIGBAd2F0Y2hlZGAgbGlzdCBhbmQgcmUtcmVhZCBpdCBvbiBjaGFuZ2UuXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlyIGZzIHBhdGhcbiAqIEBwYXJhbSB7ZnMuU3RhdHN9IHN0YXRzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWxBZGRcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZXB0aCByZWxhdGl2ZSB0byB1c2VyLXN1cHBsaWVkIHBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXQgY2hpbGQgcGF0aCB0YXJnZXRlZCBmb3Igd2F0Y2hcbiAqIEBwYXJhbSB7T2JqZWN0fSB3aCBDb21tb24gd2F0Y2ggaGVscGVycyBmb3IgdGhpcyBwYXRoXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVhbHBhdGhcbiAqIEByZXR1cm5zIHtQcm9taXNlPEZ1bmN0aW9uPn0gY2xvc2VyIGZvciB0aGUgd2F0Y2hlciBpbnN0YW5jZS5cbiAqL1xuYXN5bmMgX2hhbmRsZURpcihkaXIsIHN0YXRzLCBpbml0aWFsQWRkLCBkZXB0aCwgdGFyZ2V0LCB3aCwgcmVhbHBhdGgpIHtcbiAgY29uc3QgcGFyZW50RGlyID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoc3lzUGF0aC5kaXJuYW1lKGRpcikpO1xuICBjb25zdCB0cmFja2VkID0gcGFyZW50RGlyLmhhcyhzeXNQYXRoLmJhc2VuYW1lKGRpcikpO1xuICBpZiAoIShpbml0aWFsQWRkICYmIHRoaXMuZnN3Lm9wdGlvbnMuaWdub3JlSW5pdGlhbCkgJiYgIXRhcmdldCAmJiAhdHJhY2tlZCkge1xuICAgIGlmICghd2guaGFzR2xvYiB8fCB3aC5nbG9iRmlsdGVyKGRpcikpIHRoaXMuZnN3Ll9lbWl0KEVWX0FERF9ESVIsIGRpciwgc3RhdHMpO1xuICB9XG5cbiAgLy8gZW5zdXJlIGRpciBpcyB0cmFja2VkIChoYXJtbGVzcyBpZiByZWR1bmRhbnQpXG4gIHBhcmVudERpci5hZGQoc3lzUGF0aC5iYXNlbmFtZShkaXIpKTtcbiAgdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoZGlyKTtcbiAgbGV0IHRocm90dGxlcjtcbiAgbGV0IGNsb3NlcjtcblxuICBjb25zdCBvRGVwdGggPSB0aGlzLmZzdy5vcHRpb25zLmRlcHRoO1xuICBpZiAoKG9EZXB0aCA9PSBudWxsIHx8IGRlcHRoIDw9IG9EZXB0aCkgJiYgIXRoaXMuZnN3Ll9zeW1saW5rUGF0aHMuaGFzKHJlYWxwYXRoKSkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICBhd2FpdCB0aGlzLl9oYW5kbGVSZWFkKGRpciwgaW5pdGlhbEFkZCwgd2gsIHRhcmdldCwgZGlyLCBkZXB0aCwgdGhyb3R0bGVyKTtcbiAgICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICB9XG5cbiAgICBjbG9zZXIgPSB0aGlzLl93YXRjaFdpdGhOb2RlRnMoZGlyLCAoZGlyUGF0aCwgc3RhdHMpID0+IHtcbiAgICAgIC8vIGlmIGN1cnJlbnQgZGlyZWN0b3J5IGlzIHJlbW92ZWQsIGRvIG5vdGhpbmdcbiAgICAgIGlmIChzdGF0cyAmJiBzdGF0cy5tdGltZU1zID09PSAwKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX2hhbmRsZVJlYWQoZGlyUGF0aCwgZmFsc2UsIHdoLCB0YXJnZXQsIGRpciwgZGVwdGgsIHRocm90dGxlcik7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGNsb3Nlcjtcbn1cblxuLyoqXG4gKiBIYW5kbGUgYWRkZWQgZmlsZSwgZGlyZWN0b3J5LCBvciBnbG9iIHBhdHRlcm4uXG4gKiBEZWxlZ2F0ZXMgY2FsbCB0byBfaGFuZGxlRmlsZSAvIF9oYW5kbGVEaXIgYWZ0ZXIgY2hlY2tzLlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggdG8gZmlsZSBvciBpclxuICogQHBhcmFtIHtCb29sZWFufSBpbml0aWFsQWRkIHdhcyB0aGUgZmlsZSBhZGRlZCBhdCB3YXRjaCBpbnN0YW50aWF0aW9uP1xuICogQHBhcmFtIHtPYmplY3R9IHByaW9yV2ggZGVwdGggcmVsYXRpdmUgdG8gdXNlci1zdXBwbGllZCBwYXRoXG4gKiBAcGFyYW0ge051bWJlcn0gZGVwdGggQ2hpbGQgcGF0aCBhY3R1YWxseSB0YXJnZXRlZCBmb3Igd2F0Y2hcbiAqIEBwYXJhbSB7U3RyaW5nPX0gdGFyZ2V0IENoaWxkIHBhdGggYWN0dWFsbHkgdGFyZ2V0ZWQgZm9yIHdhdGNoXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuYXN5bmMgX2FkZFRvTm9kZUZzKHBhdGgsIGluaXRpYWxBZGQsIHByaW9yV2gsIGRlcHRoLCB0YXJnZXQpIHtcbiAgY29uc3QgcmVhZHkgPSB0aGlzLmZzdy5fZW1pdFJlYWR5O1xuICBpZiAodGhpcy5mc3cuX2lzSWdub3JlZChwYXRoKSB8fCB0aGlzLmZzdy5jbG9zZWQpIHtcbiAgICByZWFkeSgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHdoID0gdGhpcy5mc3cuX2dldFdhdGNoSGVscGVycyhwYXRoLCBkZXB0aCk7XG4gIGlmICghd2guaGFzR2xvYiAmJiBwcmlvcldoKSB7XG4gICAgd2guaGFzR2xvYiA9IHByaW9yV2guaGFzR2xvYjtcbiAgICB3aC5nbG9iRmlsdGVyID0gcHJpb3JXaC5nbG9iRmlsdGVyO1xuICAgIHdoLmZpbHRlclBhdGggPSBlbnRyeSA9PiBwcmlvcldoLmZpbHRlclBhdGgoZW50cnkpO1xuICAgIHdoLmZpbHRlckRpciA9IGVudHJ5ID0+IHByaW9yV2guZmlsdGVyRGlyKGVudHJ5KTtcbiAgfVxuXG4gIC8vIGV2YWx1YXRlIHdoYXQgaXMgYXQgdGhlIHBhdGggd2UncmUgYmVpbmcgYXNrZWQgdG8gd2F0Y2hcbiAgdHJ5IHtcbiAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHN0YXRNZXRob2RzW3doLnN0YXRNZXRob2RdKHdoLndhdGNoUGF0aCk7XG4gICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZzdy5faXNJZ25vcmVkKHdoLndhdGNoUGF0aCwgc3RhdHMpKSB7XG4gICAgICByZWFkeSgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGZvbGxvdyA9IHRoaXMuZnN3Lm9wdGlvbnMuZm9sbG93U3ltbGlua3MgJiYgIXBhdGguaW5jbHVkZXMoU1RBUikgJiYgIXBhdGguaW5jbHVkZXMoQlJBQ0VfU1RBUlQpO1xuICAgIGxldCBjbG9zZXI7XG4gICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIGNvbnN0IGFic1BhdGggPSBzeXNQYXRoLnJlc29sdmUocGF0aCk7XG4gICAgICBjb25zdCB0YXJnZXRQYXRoID0gZm9sbG93ID8gYXdhaXQgZnNyZWFscGF0aChwYXRoKSA6IHBhdGg7XG4gICAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgICBjbG9zZXIgPSBhd2FpdCB0aGlzLl9oYW5kbGVEaXIod2gud2F0Y2hQYXRoLCBzdGF0cywgaW5pdGlhbEFkZCwgZGVwdGgsIHRhcmdldCwgd2gsIHRhcmdldFBhdGgpO1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgICAgLy8gcHJlc2VydmUgdGhpcyBzeW1saW5rJ3MgdGFyZ2V0IHBhdGhcbiAgICAgIGlmIChhYnNQYXRoICE9PSB0YXJnZXRQYXRoICYmIHRhcmdldFBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLnNldChhYnNQYXRoLCB0YXJnZXRQYXRoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN0YXRzLmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgIGNvbnN0IHRhcmdldFBhdGggPSBmb2xsb3cgPyBhd2FpdCBmc3JlYWxwYXRoKHBhdGgpIDogcGF0aDtcbiAgICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICAgIGNvbnN0IHBhcmVudCA9IHN5c1BhdGguZGlybmFtZSh3aC53YXRjaFBhdGgpO1xuICAgICAgdGhpcy5mc3cuX2dldFdhdGNoZWREaXIocGFyZW50KS5hZGQod2gud2F0Y2hQYXRoKTtcbiAgICAgIHRoaXMuZnN3Ll9lbWl0KEVWX0FERCwgd2gud2F0Y2hQYXRoLCBzdGF0cyk7XG4gICAgICBjbG9zZXIgPSBhd2FpdCB0aGlzLl9oYW5kbGVEaXIocGFyZW50LCBzdGF0cywgaW5pdGlhbEFkZCwgZGVwdGgsIHBhdGgsIHdoLCB0YXJnZXRQYXRoKTtcbiAgICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcblxuICAgICAgLy8gcHJlc2VydmUgdGhpcyBzeW1saW5rJ3MgdGFyZ2V0IHBhdGhcbiAgICAgIGlmICh0YXJnZXRQYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5zZXQoc3lzUGF0aC5yZXNvbHZlKHBhdGgpLCB0YXJnZXRQYXRoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2xvc2VyID0gdGhpcy5faGFuZGxlRmlsZSh3aC53YXRjaFBhdGgsIHN0YXRzLCBpbml0aWFsQWRkKTtcbiAgICB9XG4gICAgcmVhZHkoKTtcblxuICAgIHRoaXMuZnN3Ll9hZGRQYXRoQ2xvc2VyKHBhdGgsIGNsb3Nlcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKHRoaXMuZnN3Ll9oYW5kbGVFcnJvcihlcnJvcikpIHtcbiAgICAgIHJlYWR5KCk7XG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG4gIH1cbn1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGVGc0hhbmRsZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHN5c1BhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB7IHByb21pc2lmeSB9ID0gcmVxdWlyZSgndXRpbCcpO1xuXG5sZXQgZnNldmVudHM7XG50cnkge1xuICBmc2V2ZW50cyA9IHJlcXVpcmUoJ2ZzZXZlbnRzJyk7XG59IGNhdGNoIChlcnJvcikge1xuICBpZiAocHJvY2Vzcy5lbnYuQ0hPS0lEQVJfUFJJTlRfRlNFVkVOVFNfUkVRVUlSRV9FUlJPUikgY29uc29sZS5lcnJvcihlcnJvcik7XG59XG5cbmlmIChmc2V2ZW50cykge1xuICAvLyBUT0RPOiByZWFsIGNoZWNrXG4gIGNvbnN0IG10Y2ggPSBwcm9jZXNzLnZlcnNpb24ubWF0Y2goL3YoXFxkKylcXC4oXFxkKykvKTtcbiAgaWYgKG10Y2ggJiYgbXRjaFsxXSAmJiBtdGNoWzJdKSB7XG4gICAgY29uc3QgbWFqID0gTnVtYmVyLnBhcnNlSW50KG10Y2hbMV0sIDEwKTtcbiAgICBjb25zdCBtaW4gPSBOdW1iZXIucGFyc2VJbnQobXRjaFsyXSwgMTApO1xuICAgIGlmIChtYWogPT09IDggJiYgbWluIDwgMTYpIHtcbiAgICAgIGZzZXZlbnRzID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCB7XG4gIEVWX0FERCxcbiAgRVZfQ0hBTkdFLFxuICBFVl9BRERfRElSLFxuICBFVl9VTkxJTkssXG4gIEVWX0VSUk9SLFxuICBTVFJfREFUQSxcbiAgU1RSX0VORCxcbiAgRlNFVkVOVF9DUkVBVEVELFxuICBGU0VWRU5UX01PRElGSUVELFxuICBGU0VWRU5UX0RFTEVURUQsXG4gIEZTRVZFTlRfTU9WRUQsXG4gIC8vIEZTRVZFTlRfQ0xPTkVELFxuICBGU0VWRU5UX1VOS05PV04sXG4gIEZTRVZFTlRfVFlQRV9GSUxFLFxuICBGU0VWRU5UX1RZUEVfRElSRUNUT1JZLFxuICBGU0VWRU5UX1RZUEVfU1lNTElOSyxcblxuICBST09UX0dMT0JTVEFSLFxuICBESVJfU1VGRklYLFxuICBET1RfU0xBU0gsXG4gIEZVTkNUSU9OX1RZUEUsXG4gIEVNUFRZX0ZOLFxuICBJREVOVElUWV9GTlxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbmNvbnN0IERlcHRoID0gKHZhbHVlKSA9PiBpc05hTih2YWx1ZSkgPyB7fSA6IHtkZXB0aDogdmFsdWV9O1xuXG5jb25zdCBzdGF0ID0gcHJvbWlzaWZ5KGZzLnN0YXQpO1xuY29uc3QgbHN0YXQgPSBwcm9taXNpZnkoZnMubHN0YXQpO1xuY29uc3QgcmVhbHBhdGggPSBwcm9taXNpZnkoZnMucmVhbHBhdGgpO1xuXG5jb25zdCBzdGF0TWV0aG9kcyA9IHsgc3RhdCwgbHN0YXQgfTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7U3RyaW5nfSBQYXRoXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBGc0V2ZW50c1dhdGNoQ29udGFpbmVyXG4gKiBAcHJvcGVydHkge1NldDxGdW5jdGlvbj59IGxpc3RlbmVyc1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gcmF3RW1pdHRlclxuICogQHByb3BlcnR5IHt7c3RvcDogRnVuY3Rpb259fSB3YXRjaGVyXG4gKi9cblxuLy8gZnNldmVudHMgaW5zdGFuY2UgaGVscGVyIGZ1bmN0aW9uc1xuLyoqXG4gKiBPYmplY3QgdG8gaG9sZCBwZXItcHJvY2VzcyBmc2V2ZW50cyBpbnN0YW5jZXMgKG1heSBiZSBzaGFyZWQgYWNyb3NzIGNob2tpZGFyIEZTV2F0Y2hlciBpbnN0YW5jZXMpXG4gKiBAdHlwZSB7TWFwPFBhdGgsRnNFdmVudHNXYXRjaENvbnRhaW5lcj59XG4gKi9cbmNvbnN0IEZTRXZlbnRzV2F0Y2hlcnMgPSBuZXcgTWFwKCk7XG5cbi8vIFRocmVzaG9sZCBvZiBkdXBsaWNhdGUgcGF0aCBwcmVmaXhlcyBhdCB3aGljaCB0byBzdGFydFxuLy8gY29uc29saWRhdGluZyBnb2luZyBmb3J3YXJkXG5jb25zdCBjb25zb2xpZGF0ZVRocmVzaGhvbGQgPSAxMDtcblxuY29uc3Qgd3JvbmdFdmVudEZsYWdzID0gbmV3IFNldChbXG4gIDY5ODg4LCA3MDQwMCwgNzE0MjQsIDcyNzA0LCA3MzQ3MiwgMTMxMzI4LCAxMzE4NDAsIDI2MjkxMlxuXSk7XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHRoZSBmc2V2ZW50cyBpbnRlcmZhY2VcbiAqIEBwYXJhbSB7UGF0aH0gcGF0aCBwYXRoIHRvIGJlIHdhdGNoZWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGNhbGxlZCB3aGVuIGZzZXZlbnRzIGlzIGJvdW5kIGFuZCByZWFkeVxuICogQHJldHVybnMge3tzdG9wOiBGdW5jdGlvbn19IG5ldyBmc2V2ZW50cyBpbnN0YW5jZVxuICovXG5jb25zdCBjcmVhdGVGU0V2ZW50c0luc3RhbmNlID0gKHBhdGgsIGNhbGxiYWNrKSA9PiB7XG4gIGNvbnN0IHN0b3AgPSBmc2V2ZW50cy53YXRjaChwYXRoLCBjYWxsYmFjayk7XG4gIHJldHVybiB7c3RvcH07XG59O1xuXG4vKipcbiAqIEluc3RhbnRpYXRlcyB0aGUgZnNldmVudHMgaW50ZXJmYWNlIG9yIGJpbmRzIGxpc3RlbmVycyB0byBhbiBleGlzdGluZyBvbmUgY292ZXJpbmdcbiAqIHRoZSBzYW1lIGZpbGUgdHJlZS5cbiAqIEBwYXJhbSB7UGF0aH0gcGF0aCAgICAgICAgICAgLSB0byBiZSB3YXRjaGVkXG4gKiBAcGFyYW0ge1BhdGh9IHJlYWxQYXRoICAgICAgIC0gcmVhbCBwYXRoIGZvciBzeW1saW5rc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgICAtIGNhbGxlZCB3aGVuIGZzZXZlbnRzIGVtaXRzIGV2ZW50c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gcmF3RW1pdHRlciAtIHBhc3NlcyBkYXRhIHRvIGxpc3RlbmVycyBvZiB0aGUgJ3JhdycgZXZlbnRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gY2xvc2VyXG4gKi9cbmZ1bmN0aW9uIHNldEZTRXZlbnRzTGlzdGVuZXIocGF0aCwgcmVhbFBhdGgsIGxpc3RlbmVyLCByYXdFbWl0dGVyKSB7XG4gIGxldCB3YXRjaFBhdGggPSBzeXNQYXRoLmV4dG5hbWUocGF0aCkgPyBzeXNQYXRoLmRpcm5hbWUocGF0aCkgOiBwYXRoO1xuICBjb25zdCBwYXJlbnRQYXRoID0gc3lzUGF0aC5kaXJuYW1lKHdhdGNoUGF0aCk7XG4gIGxldCBjb250ID0gRlNFdmVudHNXYXRjaGVycy5nZXQod2F0Y2hQYXRoKTtcblxuICAvLyBJZiB3ZSd2ZSBhY2N1bXVsYXRlZCBhIHN1YnN0YW50aWFsIG51bWJlciBvZiBwYXRocyB0aGF0XG4gIC8vIGNvdWxkIGhhdmUgYmVlbiBjb25zb2xpZGF0ZWQgYnkgd2F0Y2hpbmcgb25lIGRpcmVjdG9yeVxuICAvLyBhYm92ZSB0aGUgY3VycmVudCBvbmUsIGNyZWF0ZSBhIHdhdGNoZXIgb24gdGhlIHBhcmVudFxuICAvLyBwYXRoIGluc3RlYWQsIHNvIHRoYXQgd2UgZG8gY29uc29saWRhdGUgZ29pbmcgZm9yd2FyZC5cbiAgaWYgKGNvdWxkQ29uc29saWRhdGUocGFyZW50UGF0aCkpIHtcbiAgICB3YXRjaFBhdGggPSBwYXJlbnRQYXRoO1xuICB9XG5cbiAgY29uc3QgcmVzb2x2ZWRQYXRoID0gc3lzUGF0aC5yZXNvbHZlKHBhdGgpO1xuICBjb25zdCBoYXNTeW1saW5rID0gcmVzb2x2ZWRQYXRoICE9PSByZWFsUGF0aDtcblxuICBjb25zdCBmaWx0ZXJlZExpc3RlbmVyID0gKGZ1bGxQYXRoLCBmbGFncywgaW5mbykgPT4ge1xuICAgIGlmIChoYXNTeW1saW5rKSBmdWxsUGF0aCA9IGZ1bGxQYXRoLnJlcGxhY2UocmVhbFBhdGgsIHJlc29sdmVkUGF0aCk7XG4gICAgaWYgKFxuICAgICAgZnVsbFBhdGggPT09IHJlc29sdmVkUGF0aCB8fFxuICAgICAgIWZ1bGxQYXRoLmluZGV4T2YocmVzb2x2ZWRQYXRoICsgc3lzUGF0aC5zZXApXG4gICAgKSBsaXN0ZW5lcihmdWxsUGF0aCwgZmxhZ3MsIGluZm8pO1xuICB9O1xuXG4gIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGFscmVhZHkgYSB3YXRjaGVyIG9uIGEgcGFyZW50IHBhdGhcbiAgLy8gbW9kaWZpZXMgYHdhdGNoUGF0aGAgdG8gdGhlIHBhcmVudCBwYXRoIHdoZW4gaXQgZmluZHMgYSBtYXRjaFxuICBsZXQgd2F0Y2hlZFBhcmVudCA9IGZhbHNlO1xuICBmb3IgKGNvbnN0IHdhdGNoZWRQYXRoIG9mIEZTRXZlbnRzV2F0Y2hlcnMua2V5cygpKSB7XG4gICAgaWYgKHJlYWxQYXRoLmluZGV4T2Yoc3lzUGF0aC5yZXNvbHZlKHdhdGNoZWRQYXRoKSArIHN5c1BhdGguc2VwKSA9PT0gMCkge1xuICAgICAgd2F0Y2hQYXRoID0gd2F0Y2hlZFBhdGg7XG4gICAgICBjb250ID0gRlNFdmVudHNXYXRjaGVycy5nZXQod2F0Y2hQYXRoKTtcbiAgICAgIHdhdGNoZWRQYXJlbnQgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbnQgfHwgd2F0Y2hlZFBhcmVudCkge1xuICAgIGNvbnQubGlzdGVuZXJzLmFkZChmaWx0ZXJlZExpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICBjb250ID0ge1xuICAgICAgbGlzdGVuZXJzOiBuZXcgU2V0KFtmaWx0ZXJlZExpc3RlbmVyXSksXG4gICAgICByYXdFbWl0dGVyLFxuICAgICAgd2F0Y2hlcjogY3JlYXRlRlNFdmVudHNJbnN0YW5jZSh3YXRjaFBhdGgsIChmdWxsUGF0aCwgZmxhZ3MpID0+IHtcbiAgICAgICAgaWYgKCFjb250Lmxpc3RlbmVycy5zaXplKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGluZm8gPSBmc2V2ZW50cy5nZXRJbmZvKGZ1bGxQYXRoLCBmbGFncyk7XG4gICAgICAgIGNvbnQubGlzdGVuZXJzLmZvckVhY2gobGlzdCA9PiB7XG4gICAgICAgICAgbGlzdChmdWxsUGF0aCwgZmxhZ3MsIGluZm8pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb250LnJhd0VtaXR0ZXIoaW5mby5ldmVudCwgZnVsbFBhdGgsIGluZm8pO1xuICAgICAgfSlcbiAgICB9O1xuICAgIEZTRXZlbnRzV2F0Y2hlcnMuc2V0KHdhdGNoUGF0aCwgY29udCk7XG4gIH1cblxuICAvLyByZW1vdmVzIHRoaXMgaW5zdGFuY2UncyBsaXN0ZW5lcnMgYW5kIGNsb3NlcyB0aGUgdW5kZXJseWluZyBmc2V2ZW50c1xuICAvLyBpbnN0YW5jZSBpZiB0aGVyZSBhcmUgbm8gbW9yZSBsaXN0ZW5lcnMgbGVmdFxuICByZXR1cm4gKCkgPT4ge1xuICAgIGNvbnN0IGxzdCA9IGNvbnQubGlzdGVuZXJzO1xuXG4gICAgbHN0LmRlbGV0ZShmaWx0ZXJlZExpc3RlbmVyKTtcbiAgICBpZiAoIWxzdC5zaXplKSB7XG4gICAgICBGU0V2ZW50c1dhdGNoZXJzLmRlbGV0ZSh3YXRjaFBhdGgpO1xuICAgICAgaWYgKGNvbnQud2F0Y2hlcikgcmV0dXJuIGNvbnQud2F0Y2hlci5zdG9wKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnQucmF3RW1pdHRlciA9IGNvbnQud2F0Y2hlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShjb250KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gRGVjaWRlIHdoZXRoZXIgb3Igbm90IHdlIHNob3VsZCBzdGFydCBhIG5ldyBoaWdoZXItbGV2ZWxcbi8vIHBhcmVudCB3YXRjaGVyXG5jb25zdCBjb3VsZENvbnNvbGlkYXRlID0gKHBhdGgpID0+IHtcbiAgbGV0IGNvdW50ID0gMDtcbiAgZm9yIChjb25zdCB3YXRjaFBhdGggb2YgRlNFdmVudHNXYXRjaGVycy5rZXlzKCkpIHtcbiAgICBpZiAod2F0Y2hQYXRoLmluZGV4T2YocGF0aCkgPT09IDApIHtcbiAgICAgIGNvdW50Kys7XG4gICAgICBpZiAoY291bnQgPj0gY29uc29saWRhdGVUaHJlc2hob2xkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8vIHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgZnNldmVudHMgY2FuIGJlIHVzZWRcbmNvbnN0IGNhblVzZSA9ICgpID0+IGZzZXZlbnRzICYmIEZTRXZlbnRzV2F0Y2hlcnMuc2l6ZSA8IDEyODtcblxuLy8gZGV0ZXJtaW5lcyBzdWJkaXJlY3RvcnkgdHJhdmVyc2FsIGxldmVscyBmcm9tIHJvb3QgdG8gcGF0aFxuY29uc3QgY2FsY0RlcHRoID0gKHBhdGgsIHJvb3QpID0+IHtcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoIXBhdGguaW5kZXhPZihyb290KSAmJiAocGF0aCA9IHN5c1BhdGguZGlybmFtZShwYXRoKSkgIT09IHJvb3QpIGkrKztcbiAgcmV0dXJuIGk7XG59O1xuXG4vLyByZXR1cm5zIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBmc2V2ZW50cycgZXZlbnQgaW5mbyBoYXMgdGhlIHNhbWUgdHlwZVxuLy8gYXMgdGhlIG9uZSByZXR1cm5lZCBieSBmcy5zdGF0XG5jb25zdCBzYW1lVHlwZXMgPSAoaW5mbywgc3RhdHMpID0+IChcbiAgaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfRElSRUNUT1JZICYmIHN0YXRzLmlzRGlyZWN0b3J5KCkgfHxcbiAgaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfU1lNTElOSyAmJiBzdGF0cy5pc1N5bWJvbGljTGluaygpIHx8XG4gIGluZm8udHlwZSA9PT0gRlNFVkVOVF9UWVBFX0ZJTEUgJiYgc3RhdHMuaXNGaWxlKClcbilcblxuLyoqXG4gKiBAbWl4aW5cbiAqL1xuY2xhc3MgRnNFdmVudHNIYW5kbGVyIHtcblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi4vaW5kZXgnKS5GU1dhdGNoZXJ9IGZzd1xuICovXG5jb25zdHJ1Y3Rvcihmc3cpIHtcbiAgdGhpcy5mc3cgPSBmc3c7XG59XG5jaGVja0lnbm9yZWQocGF0aCwgc3RhdHMpIHtcbiAgY29uc3QgaXBhdGhzID0gdGhpcy5mc3cuX2lnbm9yZWRQYXRocztcbiAgaWYgKHRoaXMuZnN3Ll9pc0lnbm9yZWQocGF0aCwgc3RhdHMpKSB7XG4gICAgaXBhdGhzLmFkZChwYXRoKTtcbiAgICBpZiAoc3RhdHMgJiYgc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgaXBhdGhzLmFkZChwYXRoICsgUk9PVF9HTE9CU1RBUik7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXBhdGhzLmRlbGV0ZShwYXRoKTtcbiAgaXBhdGhzLmRlbGV0ZShwYXRoICsgUk9PVF9HTE9CU1RBUik7XG59XG5cbmFkZE9yQ2hhbmdlKHBhdGgsIGZ1bGxQYXRoLCByZWFsUGF0aCwgcGFyZW50LCB3YXRjaGVkRGlyLCBpdGVtLCBpbmZvLCBvcHRzKSB7XG4gIGNvbnN0IGV2ZW50ID0gd2F0Y2hlZERpci5oYXMoaXRlbSkgPyBFVl9DSEFOR0UgOiBFVl9BREQ7XG4gIHRoaXMuaGFuZGxlRXZlbnQoZXZlbnQsIHBhdGgsIGZ1bGxQYXRoLCByZWFsUGF0aCwgcGFyZW50LCB3YXRjaGVkRGlyLCBpdGVtLCBpbmZvLCBvcHRzKTtcbn1cblxuYXN5bmMgY2hlY2tFeGlzdHMocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHN0YXQocGF0aClcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHNhbWVUeXBlcyhpbmZvLCBzdGF0cykpIHtcbiAgICAgIHRoaXMuYWRkT3JDaGFuZ2UocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZUV2ZW50KEVWX1VOTElOSywgcGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VBQ0NFUycpIHtcbiAgICAgIHRoaXMuYWRkT3JDaGFuZ2UocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZUV2ZW50KEVWX1VOTElOSywgcGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xuICAgIH1cbiAgfVxufVxuXG5oYW5kbGVFdmVudChldmVudCwgcGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpIHtcbiAgaWYgKHRoaXMuZnN3LmNsb3NlZCB8fCB0aGlzLmNoZWNrSWdub3JlZChwYXRoKSkgcmV0dXJuO1xuXG4gIGlmIChldmVudCA9PT0gRVZfVU5MSU5LKSB7XG4gICAgY29uc3QgaXNEaXJlY3RvcnkgPSBpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9ESVJFQ1RPUllcbiAgICAvLyBzdXBwcmVzcyB1bmxpbmsgZXZlbnRzIG9uIG5ldmVyIGJlZm9yZSBzZWVuIGZpbGVzXG4gICAgaWYgKGlzRGlyZWN0b3J5IHx8IHdhdGNoZWREaXIuaGFzKGl0ZW0pKSB7XG4gICAgICB0aGlzLmZzdy5fcmVtb3ZlKHBhcmVudCwgaXRlbSwgaXNEaXJlY3RvcnkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZXZlbnQgPT09IEVWX0FERCkge1xuICAgICAgLy8gdHJhY2sgbmV3IGRpcmVjdG9yaWVzXG4gICAgICBpZiAoaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfRElSRUNUT1JZKSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihwYXRoKTtcblxuICAgICAgaWYgKGluZm8udHlwZSA9PT0gRlNFVkVOVF9UWVBFX1NZTUxJTksgJiYgb3B0cy5mb2xsb3dTeW1saW5rcykge1xuICAgICAgICAvLyBwdXNoIHN5bWxpbmtzIGJhY2sgdG8gdGhlIHRvcCBvZiB0aGUgc3RhY2sgdG8gZ2V0IGhhbmRsZWRcbiAgICAgICAgY29uc3QgY3VyRGVwdGggPSBvcHRzLmRlcHRoID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgIHVuZGVmaW5lZCA6IGNhbGNEZXB0aChmdWxsUGF0aCwgcmVhbFBhdGgpICsgMTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZFRvRnNFdmVudHMocGF0aCwgZmFsc2UsIHRydWUsIGN1ckRlcHRoKTtcbiAgICAgIH1cblxuICAgICAgLy8gdHJhY2sgbmV3IHBhdGhzXG4gICAgICAvLyAob3RoZXIgdGhhbiBzeW1saW5rcyBiZWluZyBmb2xsb3dlZCwgd2hpY2ggd2lsbCBiZSB0cmFja2VkIHNvb24pXG4gICAgICB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihwYXJlbnQpLmFkZChpdGVtKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHR5cGUgeydhZGQnfCdhZGREaXInfCd1bmxpbmsnfCd1bmxpbmtEaXInfVxuICAgICAqL1xuICAgIGNvbnN0IGV2ZW50TmFtZSA9IGluZm8udHlwZSA9PT0gRlNFVkVOVF9UWVBFX0RJUkVDVE9SWSA/IGV2ZW50ICsgRElSX1NVRkZJWCA6IGV2ZW50O1xuICAgIHRoaXMuZnN3Ll9lbWl0KGV2ZW50TmFtZSwgcGF0aCk7XG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gRVZfQUREX0RJUikgdGhpcy5fYWRkVG9Gc0V2ZW50cyhwYXRoLCBmYWxzZSwgdHJ1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBIYW5kbGUgc3ltbGlua3MgZW5jb3VudGVyZWQgZHVyaW5nIGRpcmVjdG9yeSBzY2FuXG4gKiBAcGFyYW0ge1N0cmluZ30gd2F0Y2hQYXRoICAtIGZpbGUvZGlyIHBhdGggdG8gYmUgd2F0Y2hlZCB3aXRoIGZzZXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVhbFBhdGggICAtIHJlYWwgcGF0aCAoaW4gY2FzZSBvZiBzeW1saW5rcylcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSAgLSBwYXRoIHRyYW5zZm9ybWVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnbG9iRmlsdGVyIC0gcGF0aCBmaWx0ZXIgaW4gY2FzZSBhIGdsb2IgcGF0dGVybiB3YXMgcHJvdmlkZWRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gY2xvc2VyIGZvciB0aGUgd2F0Y2hlciBpbnN0YW5jZVxuKi9cbl93YXRjaFdpdGhGc0V2ZW50cyh3YXRjaFBhdGgsIHJlYWxQYXRoLCB0cmFuc2Zvcm0sIGdsb2JGaWx0ZXIpIHtcbiAgaWYgKHRoaXMuZnN3LmNsb3NlZCB8fCB0aGlzLmZzdy5faXNJZ25vcmVkKHdhdGNoUGF0aCkpIHJldHVybjtcbiAgY29uc3Qgb3B0cyA9IHRoaXMuZnN3Lm9wdGlvbnM7XG4gIGNvbnN0IHdhdGNoQ2FsbGJhY2sgPSBhc3luYyAoZnVsbFBhdGgsIGZsYWdzLCBpbmZvKSA9PiB7XG4gICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmIChcbiAgICAgIG9wdHMuZGVwdGggIT09IHVuZGVmaW5lZCAmJlxuICAgICAgY2FsY0RlcHRoKGZ1bGxQYXRoLCByZWFsUGF0aCkgPiBvcHRzLmRlcHRoXG4gICAgKSByZXR1cm47XG4gICAgY29uc3QgcGF0aCA9IHRyYW5zZm9ybShzeXNQYXRoLmpvaW4oXG4gICAgICB3YXRjaFBhdGgsIHN5c1BhdGgucmVsYXRpdmUod2F0Y2hQYXRoLCBmdWxsUGF0aClcbiAgICApKTtcbiAgICBpZiAoZ2xvYkZpbHRlciAmJiAhZ2xvYkZpbHRlcihwYXRoKSkgcmV0dXJuO1xuICAgIC8vIGVuc3VyZSBkaXJlY3RvcmllcyBhcmUgdHJhY2tlZFxuICAgIGNvbnN0IHBhcmVudCA9IHN5c1BhdGguZGlybmFtZShwYXRoKTtcbiAgICBjb25zdCBpdGVtID0gc3lzUGF0aC5iYXNlbmFtZShwYXRoKTtcbiAgICBjb25zdCB3YXRjaGVkRGlyID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoXG4gICAgICBpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9ESVJFQ1RPUlkgPyBwYXRoIDogcGFyZW50XG4gICAgKTtcblxuICAgIC8vIGNvcnJlY3QgZm9yIHdyb25nIGV2ZW50cyBlbWl0dGVkXG4gICAgaWYgKHdyb25nRXZlbnRGbGFncy5oYXMoZmxhZ3MpIHx8IGluZm8uZXZlbnQgPT09IEZTRVZFTlRfVU5LTk9XTikge1xuICAgICAgaWYgKHR5cGVvZiBvcHRzLmlnbm9yZWQgPT09IEZVTkNUSU9OX1RZUEUpIHtcbiAgICAgICAgbGV0IHN0YXRzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN0YXRzID0gYXdhaXQgc3RhdChwYXRoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gICAgICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tJZ25vcmVkKHBhdGgsIHN0YXRzKSkgcmV0dXJuO1xuICAgICAgICBpZiAoc2FtZVR5cGVzKGluZm8sIHN0YXRzKSkge1xuICAgICAgICAgIHRoaXMuYWRkT3JDaGFuZ2UocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnQoRVZfVU5MSU5LLCBwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2hlY2tFeGlzdHMocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2ggKGluZm8uZXZlbnQpIHtcbiAgICAgIGNhc2UgRlNFVkVOVF9DUkVBVEVEOlxuICAgICAgY2FzZSBGU0VWRU5UX01PRElGSUVEOlxuICAgICAgICByZXR1cm4gdGhpcy5hZGRPckNoYW5nZShwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICBjYXNlIEZTRVZFTlRfREVMRVRFRDpcbiAgICAgIGNhc2UgRlNFVkVOVF9NT1ZFRDpcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tFeGlzdHMocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBjbG9zZXIgPSBzZXRGU0V2ZW50c0xpc3RlbmVyKFxuICAgIHdhdGNoUGF0aCxcbiAgICByZWFsUGF0aCxcbiAgICB3YXRjaENhbGxiYWNrLFxuICAgIHRoaXMuZnN3Ll9lbWl0UmF3XG4gICk7XG5cbiAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICByZXR1cm4gY2xvc2VyO1xufVxuXG4vKipcbiAqIEhhbmRsZSBzeW1saW5rcyBlbmNvdW50ZXJlZCBkdXJpbmcgZGlyZWN0b3J5IHNjYW5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5rUGF0aCBwYXRoIHRvIHN5bWxpbmtcbiAqIEBwYXJhbSB7U3RyaW5nfSBmdWxsUGF0aCBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBzeW1saW5rXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gcHJlLWV4aXN0aW5nIHBhdGggdHJhbnNmb3JtZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBjdXJEZXB0aCBsZXZlbCBvZiBzdWJkaXJlY3RvcmllcyB0cmF2ZXJzZWQgdG8gd2hlcmUgc3ltbGluayBpc1xuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gKi9cbmFzeW5jIF9oYW5kbGVGc0V2ZW50c1N5bWxpbmsobGlua1BhdGgsIGZ1bGxQYXRoLCB0cmFuc2Zvcm0sIGN1ckRlcHRoKSB7XG4gIC8vIGRvbid0IGZvbGxvdyB0aGUgc2FtZSBzeW1saW5rIG1vcmUgdGhhbiBvbmNlXG4gIGlmICh0aGlzLmZzdy5jbG9zZWQgfHwgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5oYXMoZnVsbFBhdGgpKSByZXR1cm47XG5cbiAgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5zZXQoZnVsbFBhdGgsIHRydWUpO1xuICB0aGlzLmZzdy5faW5jclJlYWR5Q291bnQoKTtcblxuICB0cnkge1xuICAgIGNvbnN0IGxpbmtUYXJnZXQgPSBhd2FpdCByZWFscGF0aChsaW5rUGF0aCk7XG4gICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZzdy5faXNJZ25vcmVkKGxpbmtUYXJnZXQpKSB7XG4gICAgICByZXR1cm4gdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgIH1cblxuICAgIHRoaXMuZnN3Ll9pbmNyUmVhZHlDb3VudCgpO1xuXG4gICAgLy8gYWRkIHRoZSBsaW5rVGFyZ2V0IGZvciB3YXRjaGluZyB3aXRoIGEgd3JhcHBlciBmb3IgdHJhbnNmb3JtXG4gICAgLy8gdGhhdCBjYXVzZXMgZW1pdHRlZCBwYXRocyB0byBpbmNvcnBvcmF0ZSB0aGUgbGluaydzIHBhdGhcbiAgICB0aGlzLl9hZGRUb0ZzRXZlbnRzKGxpbmtUYXJnZXQgfHwgbGlua1BhdGgsIChwYXRoKSA9PiB7XG4gICAgICBsZXQgYWxpYXNlZFBhdGggPSBsaW5rUGF0aDtcbiAgICAgIGlmIChsaW5rVGFyZ2V0ICYmIGxpbmtUYXJnZXQgIT09IERPVF9TTEFTSCkge1xuICAgICAgICBhbGlhc2VkUGF0aCA9IHBhdGgucmVwbGFjZShsaW5rVGFyZ2V0LCBsaW5rUGF0aCk7XG4gICAgICB9IGVsc2UgaWYgKHBhdGggIT09IERPVF9TTEFTSCkge1xuICAgICAgICBhbGlhc2VkUGF0aCA9IHN5c1BhdGguam9pbihsaW5rUGF0aCwgcGF0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhbnNmb3JtKGFsaWFzZWRQYXRoKTtcbiAgICB9LCBmYWxzZSwgY3VyRGVwdGgpO1xuICB9IGNhdGNoKGVycm9yKSB7XG4gICAgaWYgKHRoaXMuZnN3Ll9oYW5kbGVFcnJvcihlcnJvcikpIHtcbiAgICAgIHJldHVybiB0aGlzLmZzdy5fZW1pdFJlYWR5KCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7UGF0aH0gbmV3UGF0aFxuICogQHBhcmFtIHtmcy5TdGF0c30gc3RhdHNcbiAqL1xuZW1pdEFkZChuZXdQYXRoLCBzdGF0cywgcHJvY2Vzc1BhdGgsIG9wdHMsIGZvcmNlQWRkKSB7XG4gIGNvbnN0IHBwID0gcHJvY2Vzc1BhdGgobmV3UGF0aCk7XG4gIGNvbnN0IGlzRGlyID0gc3RhdHMuaXNEaXJlY3RvcnkoKTtcbiAgY29uc3QgZGlyT2JqID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoc3lzUGF0aC5kaXJuYW1lKHBwKSk7XG4gIGNvbnN0IGJhc2UgPSBzeXNQYXRoLmJhc2VuYW1lKHBwKTtcblxuICAvLyBlbnN1cmUgZW1wdHkgZGlycyBnZXQgdHJhY2tlZFxuICBpZiAoaXNEaXIpIHRoaXMuZnN3Ll9nZXRXYXRjaGVkRGlyKHBwKTtcbiAgaWYgKGRpck9iai5oYXMoYmFzZSkpIHJldHVybjtcbiAgZGlyT2JqLmFkZChiYXNlKTtcblxuICBpZiAoIW9wdHMuaWdub3JlSW5pdGlhbCB8fCBmb3JjZUFkZCA9PT0gdHJ1ZSkge1xuICAgIHRoaXMuZnN3Ll9lbWl0KGlzRGlyID8gRVZfQUREX0RJUiA6IEVWX0FERCwgcHAsIHN0YXRzKTtcbiAgfVxufVxuXG5pbml0V2F0Y2gocmVhbFBhdGgsIHBhdGgsIHdoLCBwcm9jZXNzUGF0aCkge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gIGNvbnN0IGNsb3NlciA9IHRoaXMuX3dhdGNoV2l0aEZzRXZlbnRzKFxuICAgIHdoLndhdGNoUGF0aCxcbiAgICBzeXNQYXRoLnJlc29sdmUocmVhbFBhdGggfHwgd2gud2F0Y2hQYXRoKSxcbiAgICBwcm9jZXNzUGF0aCxcbiAgICB3aC5nbG9iRmlsdGVyXG4gICk7XG4gIHRoaXMuZnN3Ll9hZGRQYXRoQ2xvc2VyKHBhdGgsIGNsb3Nlcik7XG59XG5cbi8qKlxuICogSGFuZGxlIGFkZGVkIHBhdGggd2l0aCBmc2V2ZW50c1xuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggZmlsZS9kaXIgcGF0aCBvciBnbG9iIHBhdHRlcm5cbiAqIEBwYXJhbSB7RnVuY3Rpb258Qm9vbGVhbj19IHRyYW5zZm9ybSBjb252ZXJ0cyB3b3JraW5nIHBhdGggdG8gd2hhdCB0aGUgdXNlciBleHBlY3RzXG4gKiBAcGFyYW0ge0Jvb2xlYW49fSBmb3JjZUFkZCBlbnN1cmUgYWRkIGlzIGVtaXR0ZWRcbiAqIEBwYXJhbSB7TnVtYmVyPX0gcHJpb3JEZXB0aCBMZXZlbCBvZiBzdWJkaXJlY3RvcmllcyBhbHJlYWR5IHRyYXZlcnNlZC5cbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICovXG5hc3luYyBfYWRkVG9Gc0V2ZW50cyhwYXRoLCB0cmFuc2Zvcm0sIGZvcmNlQWRkLCBwcmlvckRlcHRoKSB7XG4gIGlmICh0aGlzLmZzdy5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgb3B0cyA9IHRoaXMuZnN3Lm9wdGlvbnM7XG4gIGNvbnN0IHByb2Nlc3NQYXRoID0gdHlwZW9mIHRyYW5zZm9ybSA9PT0gRlVOQ1RJT05fVFlQRSA/IHRyYW5zZm9ybSA6IElERU5USVRZX0ZOO1xuXG4gIGNvbnN0IHdoID0gdGhpcy5mc3cuX2dldFdhdGNoSGVscGVycyhwYXRoKTtcblxuICAvLyBldmFsdWF0ZSB3aGF0IGlzIGF0IHRoZSBwYXRoIHdlJ3JlIGJlaW5nIGFza2VkIHRvIHdhdGNoXG4gIHRyeSB7XG4gICAgY29uc3Qgc3RhdHMgPSBhd2FpdCBzdGF0TWV0aG9kc1t3aC5zdGF0TWV0aG9kXSh3aC53YXRjaFBhdGgpO1xuICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAodGhpcy5mc3cuX2lzSWdub3JlZCh3aC53YXRjaFBhdGgsIHN0YXRzKSkge1xuICAgICAgdGhyb3cgbnVsbDtcbiAgICB9XG4gICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIC8vIGVtaXQgYWRkRGlyIHVubGVzcyB0aGlzIGlzIGEgZ2xvYiBwYXJlbnRcbiAgICAgIGlmICghd2guZ2xvYkZpbHRlcikgdGhpcy5lbWl0QWRkKHByb2Nlc3NQYXRoKHBhdGgpLCBzdGF0cywgcHJvY2Vzc1BhdGgsIG9wdHMsIGZvcmNlQWRkKTtcblxuICAgICAgLy8gZG9uJ3QgcmVjdXJzZSBmdXJ0aGVyIGlmIGl0IHdvdWxkIGV4Y2VlZCBkZXB0aCBzZXR0aW5nXG4gICAgICBpZiAocHJpb3JEZXB0aCAmJiBwcmlvckRlcHRoID4gb3B0cy5kZXB0aCkgcmV0dXJuO1xuXG4gICAgICAvLyBzY2FuIHRoZSBjb250ZW50cyBvZiB0aGUgZGlyXG4gICAgICB0aGlzLmZzdy5fcmVhZGRpcnAod2gud2F0Y2hQYXRoLCB7XG4gICAgICAgIGZpbGVGaWx0ZXI6IGVudHJ5ID0+IHdoLmZpbHRlclBhdGgoZW50cnkpLFxuICAgICAgICBkaXJlY3RvcnlGaWx0ZXI6IGVudHJ5ID0+IHdoLmZpbHRlckRpcihlbnRyeSksXG4gICAgICAgIC4uLkRlcHRoKG9wdHMuZGVwdGggLSAocHJpb3JEZXB0aCB8fCAwKSlcbiAgICAgIH0pLm9uKFNUUl9EQVRBLCAoZW50cnkpID0+IHtcbiAgICAgICAgLy8gbmVlZCB0byBjaGVjayBmaWx0ZXJQYXRoIG9uIGRpcnMgYi9jIGZpbHRlckRpciBpcyBsZXNzIHJlc3RyaWN0aXZlXG4gICAgICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVudHJ5LnN0YXRzLmlzRGlyZWN0b3J5KCkgJiYgIXdoLmZpbHRlclBhdGgoZW50cnkpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgam9pbmVkUGF0aCA9IHN5c1BhdGguam9pbih3aC53YXRjaFBhdGgsIGVudHJ5LnBhdGgpO1xuICAgICAgICBjb25zdCB7ZnVsbFBhdGh9ID0gZW50cnk7XG5cbiAgICAgICAgaWYgKHdoLmZvbGxvd1N5bWxpbmtzICYmIGVudHJ5LnN0YXRzLmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgICAgICAvLyBwcmVzZXJ2ZSB0aGUgY3VycmVudCBkZXB0aCBoZXJlIHNpbmNlIGl0IGNhbid0IGJlIGRlcml2ZWQgZnJvbVxuICAgICAgICAgIC8vIHJlYWwgcGF0aHMgcGFzdCB0aGUgc3ltbGlua1xuICAgICAgICAgIGNvbnN0IGN1ckRlcHRoID0gb3B0cy5kZXB0aCA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgICAgIHVuZGVmaW5lZCA6IGNhbGNEZXB0aChqb2luZWRQYXRoLCBzeXNQYXRoLnJlc29sdmUod2gud2F0Y2hQYXRoKSkgKyAxO1xuXG4gICAgICAgICAgdGhpcy5faGFuZGxlRnNFdmVudHNTeW1saW5rKGpvaW5lZFBhdGgsIGZ1bGxQYXRoLCBwcm9jZXNzUGF0aCwgY3VyRGVwdGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZW1pdEFkZChqb2luZWRQYXRoLCBlbnRyeS5zdGF0cywgcHJvY2Vzc1BhdGgsIG9wdHMsIGZvcmNlQWRkKTtcbiAgICAgICAgfVxuICAgICAgfSkub24oRVZfRVJST1IsIEVNUFRZX0ZOKS5vbihTVFJfRU5ELCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXRBZGQod2gud2F0Y2hQYXRoLCBzdGF0cywgcHJvY2Vzc1BhdGgsIG9wdHMsIGZvcmNlQWRkKTtcbiAgICAgIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKCFlcnJvciB8fCB0aGlzLmZzdy5faGFuZGxlRXJyb3IoZXJyb3IpKSB7XG4gICAgICAvLyBUT0RPOiBTdHJhbmdlIHRoaW5nOiBcInNob3VsZCBub3QgY2hva2Ugb24gYW4gaWdub3JlZCB3YXRjaCBwYXRoXCIgd2lsbCBiZSBmYWlsZWQgd2l0aG91dCAyIHJlYWR5IGNhbGxzIC1fXy1cbiAgICAgIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICAgIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy5wZXJzaXN0ZW50ICYmIGZvcmNlQWRkICE9PSB0cnVlKSB7XG4gICAgaWYgKHR5cGVvZiB0cmFuc2Zvcm0gPT09IEZVTkNUSU9OX1RZUEUpIHtcbiAgICAgIC8vIHJlYWxwYXRoIGhhcyBhbHJlYWR5IGJlZW4gcmVzb2x2ZWRcbiAgICAgIHRoaXMuaW5pdFdhdGNoKHVuZGVmaW5lZCwgcGF0aCwgd2gsIHByb2Nlc3NQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHJlYWxQYXRoO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVhbFBhdGggPSBhd2FpdCByZWFscGF0aCh3aC53YXRjaFBhdGgpO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIHRoaXMuaW5pdFdhdGNoKHJlYWxQYXRoLCBwYXRoLCB3aCwgcHJvY2Vzc1BhdGgpO1xuICAgIH1cbiAgfVxufVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnNFdmVudHNIYW5kbGVyO1xubW9kdWxlLmV4cG9ydHMuY2FuVXNlID0gY2FuVXNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7IEV2ZW50RW1pdHRlciB9ID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBzeXNQYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgeyBwcm9taXNpZnkgfSA9IHJlcXVpcmUoJ3V0aWwnKTtcbmNvbnN0IHJlYWRkaXJwID0gcmVxdWlyZSgncmVhZGRpcnAnKTtcbmNvbnN0IGFueW1hdGNoID0gcmVxdWlyZSgnYW55bWF0Y2gnKS5kZWZhdWx0O1xuY29uc3QgZ2xvYlBhcmVudCA9IHJlcXVpcmUoJ2dsb2ItcGFyZW50Jyk7XG5jb25zdCBpc0dsb2IgPSByZXF1aXJlKCdpcy1nbG9iJyk7XG5jb25zdCBicmFjZXMgPSByZXF1aXJlKCdicmFjZXMnKTtcbmNvbnN0IG5vcm1hbGl6ZVBhdGggPSByZXF1aXJlKCdub3JtYWxpemUtcGF0aCcpO1xuXG5jb25zdCBOb2RlRnNIYW5kbGVyID0gcmVxdWlyZSgnLi9saWIvbm9kZWZzLWhhbmRsZXInKTtcbmNvbnN0IEZzRXZlbnRzSGFuZGxlciA9IHJlcXVpcmUoJy4vbGliL2ZzZXZlbnRzLWhhbmRsZXInKTtcbmNvbnN0IHtcbiAgRVZfQUxMLFxuICBFVl9SRUFEWSxcbiAgRVZfQURELFxuICBFVl9DSEFOR0UsXG4gIEVWX1VOTElOSyxcbiAgRVZfQUREX0RJUixcbiAgRVZfVU5MSU5LX0RJUixcbiAgRVZfUkFXLFxuICBFVl9FUlJPUixcblxuICBTVFJfQ0xPU0UsXG4gIFNUUl9FTkQsXG5cbiAgQkFDS19TTEFTSF9SRSxcbiAgRE9VQkxFX1NMQVNIX1JFLFxuICBTTEFTSF9PUl9CQUNLX1NMQVNIX1JFLFxuICBET1RfUkUsXG4gIFJFUExBQ0VSX1JFLFxuXG4gIFNMQVNILFxuICBTTEFTSF9TTEFTSCxcbiAgQlJBQ0VfU1RBUlQsXG4gIEJBTkcsXG4gIE9ORV9ET1QsXG4gIFRXT19ET1RTLFxuICBHTE9CU1RBUixcbiAgU0xBU0hfR0xPQlNUQVIsXG4gIEFOWU1BVENIX09QVFMsXG4gIFNUUklOR19UWVBFLFxuICBGVU5DVElPTl9UWVBFLFxuICBFTVBUWV9TVFIsXG4gIEVNUFRZX0ZOLFxuXG4gIGlzV2luZG93cyxcbiAgaXNNYWNvc1xufSA9IHJlcXVpcmUoJy4vbGliL2NvbnN0YW50cycpO1xuXG5jb25zdCBzdGF0ID0gcHJvbWlzaWZ5KGZzLnN0YXQpO1xuY29uc3QgcmVhZGRpciA9IHByb21pc2lmeShmcy5yZWFkZGlyKTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7U3RyaW5nfSBQYXRoXG4gKiBAdHlwZWRlZiB7J2FsbCd8J2FkZCd8J2FkZERpcid8J2NoYW5nZSd8J3VubGluayd8J3VubGlua0Rpcid8J3Jhdyd8J2Vycm9yJ3wncmVhZHknfSBFdmVudE5hbWVcbiAqIEB0eXBlZGVmIHsncmVhZGRpcid8J3dhdGNoJ3wnYWRkJ3wncmVtb3ZlJ3wnY2hhbmdlJ30gVGhyb3R0bGVUeXBlXG4gKi9cblxuLyoqXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gV2F0Y2hIZWxwZXJzXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGZvbGxvd1N5bWxpbmtzXG4gKiBAcHJvcGVydHkgeydzdGF0J3wnbHN0YXQnfSBzdGF0TWV0aG9kXG4gKiBAcHJvcGVydHkge1BhdGh9IHBhdGhcbiAqIEBwcm9wZXJ0eSB7UGF0aH0gd2F0Y2hQYXRoXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBlbnRyeVBhdGhcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaGFzR2xvYlxuICogQHByb3BlcnR5IHtPYmplY3R9IGdsb2JGaWx0ZXJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGZpbHRlclBhdGhcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGZpbHRlckRpclxuICovXG5cbmNvbnN0IGFycmlmeSA9ICh2YWx1ZSA9IFtdKSA9PiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXTtcbmNvbnN0IGZsYXR0ZW4gPSAobGlzdCwgcmVzdWx0ID0gW10pID0+IHtcbiAgbGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBmbGF0dGVuKGl0ZW0sIHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5jb25zdCB1bmlmeVBhdGhzID0gKHBhdGhzXykgPT4ge1xuICAvKipcbiAgICogQHR5cGUge0FycmF5PFN0cmluZz59XG4gICAqL1xuICBjb25zdCBwYXRocyA9IGZsYXR0ZW4oYXJyaWZ5KHBhdGhzXykpO1xuICBpZiAoIXBhdGhzLmV2ZXJ5KHAgPT4gdHlwZW9mIHAgPT09IFNUUklOR19UWVBFKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYE5vbi1zdHJpbmcgcHJvdmlkZWQgYXMgd2F0Y2ggcGF0aDogJHtwYXRoc31gKTtcbiAgfVxuICByZXR1cm4gcGF0aHMubWFwKG5vcm1hbGl6ZVBhdGhUb1VuaXgpO1xufTtcblxuLy8gSWYgU0xBU0hfU0xBU0ggb2NjdXJzIGF0IHRoZSBiZWdpbm5pbmcgb2YgcGF0aCwgaXQgaXMgbm90IHJlcGxhY2VkXG4vLyAgICAgYmVjYXVzZSBcIi8vU3RvcmFnZVBDL0RyaXZlUG9vbC9Nb3ZpZXNcIiBpcyBhIHZhbGlkIG5ldHdvcmsgcGF0aFxuY29uc3QgdG9Vbml4ID0gKHN0cmluZykgPT4ge1xuICBsZXQgc3RyID0gc3RyaW5nLnJlcGxhY2UoQkFDS19TTEFTSF9SRSwgU0xBU0gpO1xuICBsZXQgcHJlcGVuZCA9IGZhbHNlO1xuICBpZiAoc3RyLnN0YXJ0c1dpdGgoU0xBU0hfU0xBU0gpKSB7XG4gICAgcHJlcGVuZCA9IHRydWU7XG4gIH1cbiAgd2hpbGUgKHN0ci5tYXRjaChET1VCTEVfU0xBU0hfUkUpKSB7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoRE9VQkxFX1NMQVNIX1JFLCBTTEFTSCk7XG4gIH1cbiAgaWYgKHByZXBlbmQpIHtcbiAgICBzdHIgPSBTTEFTSCArIHN0cjtcbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuLy8gT3VyIHZlcnNpb24gb2YgdXBhdGgubm9ybWFsaXplXG4vLyBUT0RPOiB0aGlzIGlzIG5vdCBlcXVhbCB0byBwYXRoLW5vcm1hbGl6ZSBtb2R1bGUgLSBpbnZlc3RpZ2F0ZSB3aHlcbmNvbnN0IG5vcm1hbGl6ZVBhdGhUb1VuaXggPSAocGF0aCkgPT4gdG9Vbml4KHN5c1BhdGgubm9ybWFsaXplKHRvVW5peChwYXRoKSkpO1xuXG5jb25zdCBub3JtYWxpemVJZ25vcmVkID0gKGN3ZCA9IEVNUFRZX1NUUikgPT4gKHBhdGgpID0+IHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSBTVFJJTkdfVFlQRSkgcmV0dXJuIHBhdGg7XG4gIHJldHVybiBub3JtYWxpemVQYXRoVG9Vbml4KHN5c1BhdGguaXNBYnNvbHV0ZShwYXRoKSA/IHBhdGggOiBzeXNQYXRoLmpvaW4oY3dkLCBwYXRoKSk7XG59O1xuXG5jb25zdCBnZXRBYnNvbHV0ZVBhdGggPSAocGF0aCwgY3dkKSA9PiB7XG4gIGlmIChzeXNQYXRoLmlzQWJzb2x1dGUocGF0aCkpIHtcbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuICBpZiAocGF0aC5zdGFydHNXaXRoKEJBTkcpKSB7XG4gICAgcmV0dXJuIEJBTkcgKyBzeXNQYXRoLmpvaW4oY3dkLCBwYXRoLnNsaWNlKDEpKTtcbiAgfVxuICByZXR1cm4gc3lzUGF0aC5qb2luKGN3ZCwgcGF0aCk7XG59O1xuXG5jb25zdCB1bmRlZiA9IChvcHRzLCBrZXkpID0+IG9wdHNba2V5XSA9PT0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIERpcmVjdG9yeSBlbnRyeS5cbiAqIEBwcm9wZXJ0eSB7UGF0aH0gcGF0aFxuICogQHByb3BlcnR5IHtTZXQ8UGF0aD59IGl0ZW1zXG4gKi9cbmNsYXNzIERpckVudHJ5IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7UGF0aH0gZGlyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlbW92ZVdhdGNoZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRpciwgcmVtb3ZlV2F0Y2hlcikge1xuICAgIHRoaXMucGF0aCA9IGRpcjtcbiAgICB0aGlzLl9yZW1vdmVXYXRjaGVyID0gcmVtb3ZlV2F0Y2hlcjtcbiAgICAvKiogQHR5cGUge1NldDxQYXRoPn0gKi9cbiAgICB0aGlzLml0ZW1zID0gbmV3IFNldCgpO1xuICB9XG5cbiAgYWRkKGl0ZW0pIHtcbiAgICBjb25zdCB7aXRlbXN9ID0gdGhpcztcbiAgICBpZiAoIWl0ZW1zKSByZXR1cm47XG4gICAgaWYgKGl0ZW0gIT09IE9ORV9ET1QgJiYgaXRlbSAhPT0gVFdPX0RPVFMpIGl0ZW1zLmFkZChpdGVtKTtcbiAgfVxuXG4gIGFzeW5jIHJlbW92ZShpdGVtKSB7XG4gICAgY29uc3Qge2l0ZW1zfSA9IHRoaXM7XG4gICAgaWYgKCFpdGVtcykgcmV0dXJuO1xuICAgIGl0ZW1zLmRlbGV0ZShpdGVtKTtcbiAgICBpZiAoaXRlbXMuc2l6ZSA+IDApIHJldHVybjtcblxuICAgIGNvbnN0IGRpciA9IHRoaXMucGF0aDtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcmVhZGRpcihkaXIpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHRoaXMuX3JlbW92ZVdhdGNoZXIpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlV2F0Y2hlcihzeXNQYXRoLmRpcm5hbWUoZGlyKSwgc3lzUGF0aC5iYXNlbmFtZShkaXIpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYXMoaXRlbSkge1xuICAgIGNvbnN0IHtpdGVtc30gPSB0aGlzO1xuICAgIGlmICghaXRlbXMpIHJldHVybjtcbiAgICByZXR1cm4gaXRlbXMuaGFzKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fVxuICAgKi9cbiAgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgY29uc3Qge2l0ZW1zfSA9IHRoaXM7XG4gICAgaWYgKCFpdGVtcykgcmV0dXJuO1xuICAgIHJldHVybiBbLi4uaXRlbXMudmFsdWVzKCldO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLml0ZW1zLmNsZWFyKCk7XG4gICAgZGVsZXRlIHRoaXMucGF0aDtcbiAgICBkZWxldGUgdGhpcy5fcmVtb3ZlV2F0Y2hlcjtcbiAgICBkZWxldGUgdGhpcy5pdGVtcztcbiAgICBPYmplY3QuZnJlZXplKHRoaXMpO1xuICB9XG59XG5cbmNvbnN0IFNUQVRfTUVUSE9EX0YgPSAnc3RhdCc7XG5jb25zdCBTVEFUX01FVEhPRF9MID0gJ2xzdGF0JztcbmNsYXNzIFdhdGNoSGVscGVyIHtcbiAgY29uc3RydWN0b3IocGF0aCwgd2F0Y2hQYXRoLCBmb2xsb3csIGZzdykge1xuICAgIHRoaXMuZnN3ID0gZnN3O1xuICAgIHRoaXMucGF0aCA9IHBhdGggPSBwYXRoLnJlcGxhY2UoUkVQTEFDRVJfUkUsIEVNUFRZX1NUUik7XG4gICAgdGhpcy53YXRjaFBhdGggPSB3YXRjaFBhdGg7XG4gICAgdGhpcy5mdWxsV2F0Y2hQYXRoID0gc3lzUGF0aC5yZXNvbHZlKHdhdGNoUGF0aCk7XG4gICAgdGhpcy5oYXNHbG9iID0gd2F0Y2hQYXRoICE9PSBwYXRoO1xuICAgIC8qKiBAdHlwZSB7b2JqZWN0fGJvb2xlYW59ICovXG4gICAgaWYgKHBhdGggPT09IEVNUFRZX1NUUikgdGhpcy5oYXNHbG9iID0gZmFsc2U7XG4gICAgdGhpcy5nbG9iU3ltbGluayA9IHRoaXMuaGFzR2xvYiAmJiBmb2xsb3cgPyB1bmRlZmluZWQgOiBmYWxzZTtcbiAgICB0aGlzLmdsb2JGaWx0ZXIgPSB0aGlzLmhhc0dsb2IgPyBhbnltYXRjaChwYXRoLCB1bmRlZmluZWQsIEFOWU1BVENIX09QVFMpIDogZmFsc2U7XG4gICAgdGhpcy5kaXJQYXJ0cyA9IHRoaXMuZ2V0RGlyUGFydHMocGF0aCk7XG4gICAgdGhpcy5kaXJQYXJ0cy5mb3JFYWNoKChwYXJ0cykgPT4ge1xuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHBhcnRzLnBvcCgpO1xuICAgIH0pO1xuICAgIHRoaXMuZm9sbG93U3ltbGlua3MgPSBmb2xsb3c7XG4gICAgdGhpcy5zdGF0TWV0aG9kID0gZm9sbG93ID8gU1RBVF9NRVRIT0RfRiA6IFNUQVRfTUVUSE9EX0w7XG4gIH1cblxuICBjaGVja0dsb2JTeW1saW5rKGVudHJ5KSB7XG4gICAgLy8gb25seSBuZWVkIHRvIHJlc29sdmUgb25jZVxuICAgIC8vIGZpcnN0IGVudHJ5IHNob3VsZCBhbHdheXMgaGF2ZSBlbnRyeS5wYXJlbnREaXIgPT09IEVNUFRZX1NUUlxuICAgIGlmICh0aGlzLmdsb2JTeW1saW5rID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZ2xvYlN5bWxpbmsgPSBlbnRyeS5mdWxsUGFyZW50RGlyID09PSB0aGlzLmZ1bGxXYXRjaFBhdGggP1xuICAgICAgICBmYWxzZSA6IHtyZWFsUGF0aDogZW50cnkuZnVsbFBhcmVudERpciwgbGlua1BhdGg6IHRoaXMuZnVsbFdhdGNoUGF0aH07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2xvYlN5bWxpbmspIHtcbiAgICAgIHJldHVybiBlbnRyeS5mdWxsUGF0aC5yZXBsYWNlKHRoaXMuZ2xvYlN5bWxpbmsucmVhbFBhdGgsIHRoaXMuZ2xvYlN5bWxpbmsubGlua1BhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiBlbnRyeS5mdWxsUGF0aDtcbiAgfVxuXG4gIGVudHJ5UGF0aChlbnRyeSkge1xuICAgIHJldHVybiBzeXNQYXRoLmpvaW4odGhpcy53YXRjaFBhdGgsXG4gICAgICBzeXNQYXRoLnJlbGF0aXZlKHRoaXMud2F0Y2hQYXRoLCB0aGlzLmNoZWNrR2xvYlN5bWxpbmsoZW50cnkpKVxuICAgICk7XG4gIH1cblxuICBmaWx0ZXJQYXRoKGVudHJ5KSB7XG4gICAgY29uc3Qge3N0YXRzfSA9IGVudHJ5O1xuICAgIGlmIChzdGF0cyAmJiBzdGF0cy5pc1N5bWJvbGljTGluaygpKSByZXR1cm4gdGhpcy5maWx0ZXJEaXIoZW50cnkpO1xuICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IHRoaXMuZW50cnlQYXRoKGVudHJ5KTtcbiAgICBjb25zdCBtYXRjaGVzR2xvYiA9IHRoaXMuaGFzR2xvYiAmJiB0eXBlb2YgdGhpcy5nbG9iRmlsdGVyID09PSBGVU5DVElPTl9UWVBFID9cbiAgICAgIHRoaXMuZ2xvYkZpbHRlcihyZXNvbHZlZFBhdGgpIDogdHJ1ZTtcbiAgICByZXR1cm4gbWF0Y2hlc0dsb2IgJiZcbiAgICAgIHRoaXMuZnN3Ll9pc250SWdub3JlZChyZXNvbHZlZFBhdGgsIHN0YXRzKSAmJlxuICAgICAgdGhpcy5mc3cuX2hhc1JlYWRQZXJtaXNzaW9ucyhzdGF0cyk7XG4gIH1cblxuICBnZXREaXJQYXJ0cyhwYXRoKSB7XG4gICAgaWYgKCF0aGlzLmhhc0dsb2IpIHJldHVybiBbXTtcbiAgICBjb25zdCBwYXJ0cyA9IFtdO1xuICAgIGNvbnN0IGV4cGFuZGVkUGF0aCA9IHBhdGguaW5jbHVkZXMoQlJBQ0VfU1RBUlQpID8gYnJhY2VzLmV4cGFuZChwYXRoKSA6IFtwYXRoXTtcbiAgICBleHBhbmRlZFBhdGguZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgcGFydHMucHVzaChzeXNQYXRoLnJlbGF0aXZlKHRoaXMud2F0Y2hQYXRoLCBwYXRoKS5zcGxpdChTTEFTSF9PUl9CQUNLX1NMQVNIX1JFKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHBhcnRzO1xuICB9XG5cbiAgZmlsdGVyRGlyKGVudHJ5KSB7XG4gICAgaWYgKHRoaXMuaGFzR2xvYikge1xuICAgICAgY29uc3QgZW50cnlQYXJ0cyA9IHRoaXMuZ2V0RGlyUGFydHModGhpcy5jaGVja0dsb2JTeW1saW5rKGVudHJ5KSk7XG4gICAgICBsZXQgZ2xvYnN0YXIgPSBmYWxzZTtcbiAgICAgIHRoaXMudW5tYXRjaGVkR2xvYiA9ICF0aGlzLmRpclBhcnRzLnNvbWUoKHBhcnRzKSA9PiB7XG4gICAgICAgIHJldHVybiBwYXJ0cy5ldmVyeSgocGFydCwgaSkgPT4ge1xuICAgICAgICAgIGlmIChwYXJ0ID09PSBHTE9CU1RBUikgZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBnbG9ic3RhciB8fCAhZW50cnlQYXJ0c1swXVtpXSB8fCBhbnltYXRjaChwYXJ0LCBlbnRyeVBhcnRzWzBdW2ldLCBBTllNQVRDSF9PUFRTKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLnVubWF0Y2hlZEdsb2IgJiYgdGhpcy5mc3cuX2lzbnRJZ25vcmVkKHRoaXMuZW50cnlQYXRoKGVudHJ5KSwgZW50cnkuc3RhdHMpO1xuICB9XG59XG5cbi8qKlxuICogV2F0Y2hlcyBmaWxlcyAmIGRpcmVjdG9yaWVzIGZvciBjaGFuZ2VzLiBFbWl0dGVkIGV2ZW50czpcbiAqIGBhZGRgLCBgYWRkRGlyYCwgYGNoYW5nZWAsIGB1bmxpbmtgLCBgdW5saW5rRGlyYCwgYGFsbGAsIGBlcnJvcmBcbiAqXG4gKiAgICAgbmV3IEZTV2F0Y2hlcigpXG4gKiAgICAgICAuYWRkKGRpcmVjdG9yaWVzKVxuICogICAgICAgLm9uKCdhZGQnLCBwYXRoID0+IGxvZygnRmlsZScsIHBhdGgsICd3YXMgYWRkZWQnKSlcbiAqL1xuY2xhc3MgRlNXYXRjaGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbi8vIE5vdCBpbmRlbnRpbmcgbWV0aG9kcyBmb3IgaGlzdG9yeSBzYWtlOyBmb3Igbm93LlxuY29uc3RydWN0b3IoX29wdHMpIHtcbiAgc3VwZXIoKTtcblxuICBjb25zdCBvcHRzID0ge307XG4gIGlmIChfb3B0cykgT2JqZWN0LmFzc2lnbihvcHRzLCBfb3B0cyk7IC8vIGZvciBmcm96ZW4gb2JqZWN0c1xuXG4gIC8qKiBAdHlwZSB7TWFwPFN0cmluZywgRGlyRW50cnk+fSAqL1xuICB0aGlzLl93YXRjaGVkID0gbmV3IE1hcCgpO1xuICAvKiogQHR5cGUge01hcDxTdHJpbmcsIEFycmF5Pn0gKi9cbiAgdGhpcy5fY2xvc2VycyA9IG5ldyBNYXAoKTtcbiAgLyoqIEB0eXBlIHtTZXQ8U3RyaW5nPn0gKi9cbiAgdGhpcy5faWdub3JlZFBhdGhzID0gbmV3IFNldCgpO1xuXG4gIC8qKiBAdHlwZSB7TWFwPFRocm90dGxlVHlwZSwgTWFwPn0gKi9cbiAgdGhpcy5fdGhyb3R0bGVkID0gbmV3IE1hcCgpO1xuXG4gIC8qKiBAdHlwZSB7TWFwPFBhdGgsIFN0cmluZ3xCb29sZWFuPn0gKi9cbiAgdGhpcy5fc3ltbGlua1BhdGhzID0gbmV3IE1hcCgpO1xuXG4gIHRoaXMuX3N0cmVhbXMgPSBuZXcgU2V0KCk7XG4gIHRoaXMuY2xvc2VkID0gZmFsc2U7XG5cbiAgLy8gU2V0IHVwIGRlZmF1bHQgb3B0aW9ucy5cbiAgaWYgKHVuZGVmKG9wdHMsICdwZXJzaXN0ZW50JykpIG9wdHMucGVyc2lzdGVudCA9IHRydWU7XG4gIGlmICh1bmRlZihvcHRzLCAnaWdub3JlSW5pdGlhbCcpKSBvcHRzLmlnbm9yZUluaXRpYWwgPSBmYWxzZTtcbiAgaWYgKHVuZGVmKG9wdHMsICdpZ25vcmVQZXJtaXNzaW9uRXJyb3JzJykpIG9wdHMuaWdub3JlUGVybWlzc2lvbkVycm9ycyA9IGZhbHNlO1xuICBpZiAodW5kZWYob3B0cywgJ2ludGVydmFsJykpIG9wdHMuaW50ZXJ2YWwgPSAxMDA7XG4gIGlmICh1bmRlZihvcHRzLCAnYmluYXJ5SW50ZXJ2YWwnKSkgb3B0cy5iaW5hcnlJbnRlcnZhbCA9IDMwMDtcbiAgaWYgKHVuZGVmKG9wdHMsICdkaXNhYmxlR2xvYmJpbmcnKSkgb3B0cy5kaXNhYmxlR2xvYmJpbmcgPSBmYWxzZTtcbiAgb3B0cy5lbmFibGVCaW5hcnlJbnRlcnZhbCA9IG9wdHMuYmluYXJ5SW50ZXJ2YWwgIT09IG9wdHMuaW50ZXJ2YWw7XG5cbiAgLy8gRW5hYmxlIGZzZXZlbnRzIG9uIE9TIFggd2hlbiBwb2xsaW5nIGlzbid0IGV4cGxpY2l0bHkgZW5hYmxlZC5cbiAgaWYgKHVuZGVmKG9wdHMsICd1c2VGc0V2ZW50cycpKSBvcHRzLnVzZUZzRXZlbnRzID0gIW9wdHMudXNlUG9sbGluZztcblxuICAvLyBJZiB3ZSBjYW4ndCB1c2UgZnNldmVudHMsIGVuc3VyZSB0aGUgb3B0aW9ucyByZWZsZWN0IGl0J3MgZGlzYWJsZWQuXG4gIGNvbnN0IGNhblVzZUZzRXZlbnRzID0gRnNFdmVudHNIYW5kbGVyLmNhblVzZSgpO1xuICBpZiAoIWNhblVzZUZzRXZlbnRzKSBvcHRzLnVzZUZzRXZlbnRzID0gZmFsc2U7XG5cbiAgLy8gVXNlIHBvbGxpbmcgb24gTWFjIGlmIG5vdCB1c2luZyBmc2V2ZW50cy5cbiAgLy8gT3RoZXIgcGxhdGZvcm1zIHVzZSBub24tcG9sbGluZyBmc193YXRjaC5cbiAgaWYgKHVuZGVmKG9wdHMsICd1c2VQb2xsaW5nJykgJiYgIW9wdHMudXNlRnNFdmVudHMpIHtcbiAgICBvcHRzLnVzZVBvbGxpbmcgPSBpc01hY29zO1xuICB9XG5cbiAgLy8gR2xvYmFsIG92ZXJyaWRlICh1c2VmdWwgZm9yIGVuZC1kZXZlbG9wZXJzIHRoYXQgbmVlZCB0byBmb3JjZSBwb2xsaW5nIGZvciBhbGxcbiAgLy8gaW5zdGFuY2VzIG9mIGNob2tpZGFyLCByZWdhcmRsZXNzIG9mIHVzYWdlL2RlcGVuZGVuY3kgZGVwdGgpXG4gIGNvbnN0IGVudlBvbGwgPSBwcm9jZXNzLmVudi5DSE9LSURBUl9VU0VQT0xMSU5HO1xuICBpZiAoZW52UG9sbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgZW52TG93ZXIgPSBlbnZQb2xsLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpZiAoZW52TG93ZXIgPT09ICdmYWxzZScgfHwgZW52TG93ZXIgPT09ICcwJykge1xuICAgICAgb3B0cy51c2VQb2xsaW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChlbnZMb3dlciA9PT0gJ3RydWUnIHx8IGVudkxvd2VyID09PSAnMScpIHtcbiAgICAgIG9wdHMudXNlUG9sbGluZyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdHMudXNlUG9sbGluZyA9ICEhZW52TG93ZXI7XG4gICAgfVxuICB9XG4gIGNvbnN0IGVudkludGVydmFsID0gcHJvY2Vzcy5lbnYuQ0hPS0lEQVJfSU5URVJWQUw7XG4gIGlmIChlbnZJbnRlcnZhbCkge1xuICAgIG9wdHMuaW50ZXJ2YWwgPSBOdW1iZXIucGFyc2VJbnQoZW52SW50ZXJ2YWwsIDEwKTtcbiAgfVxuXG4gIC8vIEVkaXRvciBhdG9taWMgd3JpdGUgbm9ybWFsaXphdGlvbiBlbmFibGVkIGJ5IGRlZmF1bHQgd2l0aCBmcy53YXRjaFxuICBpZiAodW5kZWYob3B0cywgJ2F0b21pYycpKSBvcHRzLmF0b21pYyA9ICFvcHRzLnVzZVBvbGxpbmcgJiYgIW9wdHMudXNlRnNFdmVudHM7XG4gIGlmIChvcHRzLmF0b21pYykgdGhpcy5fcGVuZGluZ1VubGlua3MgPSBuZXcgTWFwKCk7XG5cbiAgaWYgKHVuZGVmKG9wdHMsICdmb2xsb3dTeW1saW5rcycpKSBvcHRzLmZvbGxvd1N5bWxpbmtzID0gdHJ1ZTtcblxuICBpZiAodW5kZWYob3B0cywgJ2F3YWl0V3JpdGVGaW5pc2gnKSkgb3B0cy5hd2FpdFdyaXRlRmluaXNoID0gZmFsc2U7XG4gIGlmIChvcHRzLmF3YWl0V3JpdGVGaW5pc2ggPT09IHRydWUpIG9wdHMuYXdhaXRXcml0ZUZpbmlzaCA9IHt9O1xuICBjb25zdCBhd2YgPSBvcHRzLmF3YWl0V3JpdGVGaW5pc2g7XG4gIGlmIChhd2YpIHtcbiAgICBpZiAoIWF3Zi5zdGFiaWxpdHlUaHJlc2hvbGQpIGF3Zi5zdGFiaWxpdHlUaHJlc2hvbGQgPSAyMDAwO1xuICAgIGlmICghYXdmLnBvbGxJbnRlcnZhbCkgYXdmLnBvbGxJbnRlcnZhbCA9IDEwMDtcbiAgICB0aGlzLl9wZW5kaW5nV3JpdGVzID0gbmV3IE1hcCgpO1xuICB9XG4gIGlmIChvcHRzLmlnbm9yZWQpIG9wdHMuaWdub3JlZCA9IGFycmlmeShvcHRzLmlnbm9yZWQpO1xuXG4gIGxldCByZWFkeUNhbGxzID0gMDtcbiAgdGhpcy5fZW1pdFJlYWR5ID0gKCkgPT4ge1xuICAgIHJlYWR5Q2FsbHMrKztcbiAgICBpZiAocmVhZHlDYWxscyA+PSB0aGlzLl9yZWFkeUNvdW50KSB7XG4gICAgICB0aGlzLl9lbWl0UmVhZHkgPSBFTVBUWV9GTjtcbiAgICAgIHRoaXMuX3JlYWR5RW1pdHRlZCA9IHRydWU7XG4gICAgICAvLyB1c2UgcHJvY2Vzcy5uZXh0VGljayB0byBhbGxvdyB0aW1lIGZvciBsaXN0ZW5lciB0byBiZSBib3VuZFxuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB0aGlzLmVtaXQoRVZfUkVBRFkpKTtcbiAgICB9XG4gIH07XG4gIHRoaXMuX2VtaXRSYXcgPSAoLi4uYXJncykgPT4gdGhpcy5lbWl0KEVWX1JBVywgLi4uYXJncyk7XG4gIHRoaXMuX3JlYWR5RW1pdHRlZCA9IGZhbHNlO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRzO1xuXG4gIC8vIEluaXRpYWxpemUgd2l0aCBwcm9wZXIgd2F0Y2hlci5cbiAgaWYgKG9wdHMudXNlRnNFdmVudHMpIHtcbiAgICB0aGlzLl9mc0V2ZW50c0hhbmRsZXIgPSBuZXcgRnNFdmVudHNIYW5kbGVyKHRoaXMpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX25vZGVGc0hhbmRsZXIgPSBuZXcgTm9kZUZzSGFuZGxlcih0aGlzKTtcbiAgfVxuXG4gIC8vIFlvdeKAmXJlIGZyb3plbiB3aGVuIHlvdXIgaGVhcnTigJlzIG5vdCBvcGVuLlxuICBPYmplY3QuZnJlZXplKG9wdHMpO1xufVxuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG4vKipcbiAqIEFkZHMgcGF0aHMgdG8gYmUgd2F0Y2hlZCBvbiBhbiBleGlzdGluZyBGU1dhdGNoZXIgaW5zdGFuY2VcbiAqIEBwYXJhbSB7UGF0aHxBcnJheTxQYXRoPn0gcGF0aHNfXG4gKiBAcGFyYW0ge1N0cmluZz19IF9vcmlnQWRkIHByaXZhdGU7IGZvciBoYW5kbGluZyBub24tZXhpc3RlbnQgcGF0aHMgdG8gYmUgd2F0Y2hlZFxuICogQHBhcmFtIHtCb29sZWFuPX0gX2ludGVybmFsIHByaXZhdGU7IGluZGljYXRlcyBhIG5vbi11c2VyIGFkZFxuICogQHJldHVybnMge0ZTV2F0Y2hlcn0gZm9yIGNoYWluaW5nXG4gKi9cbmFkZChwYXRoc18sIF9vcmlnQWRkLCBfaW50ZXJuYWwpIHtcbiAgY29uc3Qge2N3ZCwgZGlzYWJsZUdsb2JiaW5nfSA9IHRoaXMub3B0aW9ucztcbiAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgbGV0IHBhdGhzID0gdW5pZnlQYXRocyhwYXRoc18pO1xuICBpZiAoY3dkKSB7XG4gICAgcGF0aHMgPSBwYXRocy5tYXAoKHBhdGgpID0+IHtcbiAgICAgIGNvbnN0IGFic1BhdGggPSBnZXRBYnNvbHV0ZVBhdGgocGF0aCwgY3dkKTtcblxuICAgICAgLy8gQ2hlY2sgYHBhdGhgIGluc3RlYWQgb2YgYGFic1BhdGhgIGJlY2F1c2UgdGhlIGN3ZCBwb3J0aW9uIGNhbid0IGJlIGEgZ2xvYlxuICAgICAgaWYgKGRpc2FibGVHbG9iYmluZyB8fCAhaXNHbG9iKHBhdGgpKSB7XG4gICAgICAgIHJldHVybiBhYnNQYXRoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vcm1hbGl6ZVBhdGgoYWJzUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBzZXQgYXNpZGUgbmVnYXRlZCBnbG9iIHN0cmluZ3NcbiAgcGF0aHMgPSBwYXRocy5maWx0ZXIoKHBhdGgpID0+IHtcbiAgICBpZiAocGF0aC5zdGFydHNXaXRoKEJBTkcpKSB7XG4gICAgICB0aGlzLl9pZ25vcmVkUGF0aHMuYWRkKHBhdGguc2xpY2UoMSkpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGlmIGEgcGF0aCBpcyBiZWluZyBhZGRlZCB0aGF0IHdhcyBwcmV2aW91c2x5IGlnbm9yZWQsIHN0b3AgaWdub3JpbmcgaXRcbiAgICB0aGlzLl9pZ25vcmVkUGF0aHMuZGVsZXRlKHBhdGgpO1xuICAgIHRoaXMuX2lnbm9yZWRQYXRocy5kZWxldGUocGF0aCArIFNMQVNIX0dMT0JTVEFSKTtcblxuICAgIC8vIHJlc2V0IHRoZSBjYWNoZWQgdXNlcklnbm9yZWQgYW55bWF0Y2ggZm5cbiAgICAvLyB0byBtYWtlIGlnbm9yZWRQYXRocyBjaGFuZ2VzIGVmZmVjdGl2ZVxuICAgIHRoaXMuX3VzZXJJZ25vcmVkID0gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMudXNlRnNFdmVudHMgJiYgdGhpcy5fZnNFdmVudHNIYW5kbGVyKSB7XG4gICAgaWYgKCF0aGlzLl9yZWFkeUNvdW50KSB0aGlzLl9yZWFkeUNvdW50ID0gcGF0aHMubGVuZ3RoO1xuICAgIGlmICh0aGlzLm9wdGlvbnMucGVyc2lzdGVudCkgdGhpcy5fcmVhZHlDb3VudCAqPSAyO1xuICAgIHBhdGhzLmZvckVhY2goKHBhdGgpID0+IHRoaXMuX2ZzRXZlbnRzSGFuZGxlci5fYWRkVG9Gc0V2ZW50cyhwYXRoKSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCF0aGlzLl9yZWFkeUNvdW50KSB0aGlzLl9yZWFkeUNvdW50ID0gMDtcbiAgICB0aGlzLl9yZWFkeUNvdW50ICs9IHBhdGhzLmxlbmd0aDtcbiAgICBQcm9taXNlLmFsbChcbiAgICAgIHBhdGhzLm1hcChhc3luYyBwYXRoID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5fbm9kZUZzSGFuZGxlci5fYWRkVG9Ob2RlRnMocGF0aCwgIV9pbnRlcm5hbCwgMCwgMCwgX29yaWdBZGQpO1xuICAgICAgICBpZiAocmVzKSB0aGlzLl9lbWl0UmVhZHkoKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pXG4gICAgKS50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgICByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0pLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIHRoaXMuYWRkKHN5c1BhdGguZGlybmFtZShpdGVtKSwgc3lzUGF0aC5iYXNlbmFtZShfb3JpZ0FkZCB8fCBpdGVtKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENsb3NlIHdhdGNoZXJzIG9yIHN0YXJ0IGlnbm9yaW5nIGV2ZW50cyBmcm9tIHNwZWNpZmllZCBwYXRocy5cbiAqIEBwYXJhbSB7UGF0aHxBcnJheTxQYXRoPn0gcGF0aHNfIC0gc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MsIGZpbGUvZGlyZWN0b3J5IHBhdGhzIGFuZC9vciBnbG9ic1xuICogQHJldHVybnMge0ZTV2F0Y2hlcn0gZm9yIGNoYWluaW5nXG4qL1xudW53YXRjaChwYXRoc18pIHtcbiAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm4gdGhpcztcbiAgY29uc3QgcGF0aHMgPSB1bmlmeVBhdGhzKHBhdGhzXyk7XG4gIGNvbnN0IHtjd2R9ID0gdGhpcy5vcHRpb25zO1xuXG4gIHBhdGhzLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAvLyBjb252ZXJ0IHRvIGFic29sdXRlIHBhdGggdW5sZXNzIHJlbGF0aXZlIHBhdGggYWxyZWFkeSBtYXRjaGVzXG4gICAgaWYgKCFzeXNQYXRoLmlzQWJzb2x1dGUocGF0aCkgJiYgIXRoaXMuX2Nsb3NlcnMuaGFzKHBhdGgpKSB7XG4gICAgICBpZiAoY3dkKSBwYXRoID0gc3lzUGF0aC5qb2luKGN3ZCwgcGF0aCk7XG4gICAgICBwYXRoID0gc3lzUGF0aC5yZXNvbHZlKHBhdGgpO1xuICAgIH1cblxuICAgIHRoaXMuX2Nsb3NlUGF0aChwYXRoKTtcblxuICAgIHRoaXMuX2lnbm9yZWRQYXRocy5hZGQocGF0aCk7XG4gICAgaWYgKHRoaXMuX3dhdGNoZWQuaGFzKHBhdGgpKSB7XG4gICAgICB0aGlzLl9pZ25vcmVkUGF0aHMuYWRkKHBhdGggKyBTTEFTSF9HTE9CU1RBUik7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgdGhlIGNhY2hlZCB1c2VySWdub3JlZCBhbnltYXRjaCBmblxuICAgIC8vIHRvIG1ha2UgaWdub3JlZFBhdGhzIGNoYW5nZXMgZWZmZWN0aXZlXG4gICAgdGhpcy5fdXNlcklnbm9yZWQgPSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENsb3NlIHdhdGNoZXJzIGFuZCByZW1vdmUgYWxsIGxpc3RlbmVycyBmcm9tIHdhdGNoZWQgcGF0aHMuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0uXG4qL1xuY2xvc2UoKSB7XG4gIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuIHRoaXMuX2Nsb3NlUHJvbWlzZTtcbiAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuXG4gIC8vIE1lbW9yeSBtYW5hZ2VtZW50LlxuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICBjb25zdCBjbG9zZXJzID0gW107XG4gIHRoaXMuX2Nsb3NlcnMuZm9yRWFjaChjbG9zZXJMaXN0ID0+IGNsb3Nlckxpc3QuZm9yRWFjaChjbG9zZXIgPT4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBjbG9zZXIoKTtcbiAgICBpZiAocHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIGNsb3NlcnMucHVzaChwcm9taXNlKTtcbiAgfSkpO1xuICB0aGlzLl9zdHJlYW1zLmZvckVhY2goc3RyZWFtID0+IHN0cmVhbS5kZXN0cm95KCkpO1xuICB0aGlzLl91c2VySWdub3JlZCA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fcmVhZHlDb3VudCA9IDA7XG4gIHRoaXMuX3JlYWR5RW1pdHRlZCA9IGZhbHNlO1xuICB0aGlzLl93YXRjaGVkLmZvckVhY2goZGlyZW50ID0+IGRpcmVudC5kaXNwb3NlKCkpO1xuICBbJ2Nsb3NlcnMnLCAnd2F0Y2hlZCcsICdzdHJlYW1zJywgJ3N5bWxpbmtQYXRocycsICd0aHJvdHRsZWQnXS5mb3JFYWNoKGtleSA9PiB7XG4gICAgdGhpc1tgXyR7a2V5fWBdLmNsZWFyKCk7XG4gIH0pO1xuXG4gIHRoaXMuX2Nsb3NlUHJvbWlzZSA9IGNsb3NlcnMubGVuZ3RoID8gUHJvbWlzZS5hbGwoY2xvc2VycykudGhlbigoKSA9PiB1bmRlZmluZWQpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gIHJldHVybiB0aGlzLl9jbG9zZVByb21pc2U7XG59XG5cbi8qKlxuICogRXhwb3NlIGxpc3Qgb2Ygd2F0Y2hlZCBwYXRoc1xuICogQHJldHVybnMge09iamVjdH0gZm9yIGNoYWluaW5nXG4qL1xuZ2V0V2F0Y2hlZCgpIHtcbiAgY29uc3Qgd2F0Y2hMaXN0ID0ge307XG4gIHRoaXMuX3dhdGNoZWQuZm9yRWFjaCgoZW50cnksIGRpcikgPT4ge1xuICAgIGNvbnN0IGtleSA9IHRoaXMub3B0aW9ucy5jd2QgPyBzeXNQYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jd2QsIGRpcikgOiBkaXI7XG4gICAgd2F0Y2hMaXN0W2tleSB8fCBPTkVfRE9UXSA9IGVudHJ5LmdldENoaWxkcmVuKCkuc29ydCgpO1xuICB9KTtcbiAgcmV0dXJuIHdhdGNoTGlzdDtcbn1cblxuZW1pdFdpdGhBbGwoZXZlbnQsIGFyZ3MpIHtcbiAgdGhpcy5lbWl0KC4uLmFyZ3MpO1xuICBpZiAoZXZlbnQgIT09IEVWX0VSUk9SKSB0aGlzLmVtaXQoRVZfQUxMLCAuLi5hcmdzKTtcbn1cblxuLy8gQ29tbW9uIGhlbHBlcnNcbi8vIC0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogTm9ybWFsaXplIGFuZCBlbWl0IGV2ZW50cy5cbiAqIENhbGxpbmcgX2VtaXQgRE9FUyBOT1QgTUVBTiBlbWl0KCkgd291bGQgYmUgY2FsbGVkIVxuICogQHBhcmFtIHtFdmVudE5hbWV9IGV2ZW50IFR5cGUgb2YgZXZlbnRcbiAqIEBwYXJhbSB7UGF0aH0gcGF0aCBGaWxlIG9yIGRpcmVjdG9yeSBwYXRoXG4gKiBAcGFyYW0geyo9fSB2YWwxIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgd2l0aCBldmVudFxuICogQHBhcmFtIHsqPX0gdmFsMlxuICogQHBhcmFtIHsqPX0gdmFsM1xuICogQHJldHVybnMgdGhlIGVycm9yIGlmIGRlZmluZWQsIG90aGVyd2lzZSB0aGUgdmFsdWUgb2YgdGhlIEZTV2F0Y2hlciBpbnN0YW5jZSdzIGBjbG9zZWRgIGZsYWdcbiAqL1xuYXN5bmMgX2VtaXQoZXZlbnQsIHBhdGgsIHZhbDEsIHZhbDIsIHZhbDMpIHtcbiAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG5cbiAgY29uc3Qgb3B0cyA9IHRoaXMub3B0aW9ucztcbiAgaWYgKGlzV2luZG93cykgcGF0aCA9IHN5c1BhdGgubm9ybWFsaXplKHBhdGgpO1xuICBpZiAob3B0cy5jd2QpIHBhdGggPSBzeXNQYXRoLnJlbGF0aXZlKG9wdHMuY3dkLCBwYXRoKTtcbiAgLyoqIEB0eXBlIEFycmF5PGFueT4gKi9cbiAgY29uc3QgYXJncyA9IFtldmVudCwgcGF0aF07XG4gIGlmICh2YWwzICE9PSB1bmRlZmluZWQpIGFyZ3MucHVzaCh2YWwxLCB2YWwyLCB2YWwzKTtcbiAgZWxzZSBpZiAodmFsMiAhPT0gdW5kZWZpbmVkKSBhcmdzLnB1c2godmFsMSwgdmFsMik7XG4gIGVsc2UgaWYgKHZhbDEgIT09IHVuZGVmaW5lZCkgYXJncy5wdXNoKHZhbDEpO1xuXG4gIGNvbnN0IGF3ZiA9IG9wdHMuYXdhaXRXcml0ZUZpbmlzaDtcbiAgbGV0IHB3O1xuICBpZiAoYXdmICYmIChwdyA9IHRoaXMuX3BlbmRpbmdXcml0ZXMuZ2V0KHBhdGgpKSkge1xuICAgIHB3Lmxhc3RDaGFuZ2UgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaWYgKG9wdHMuYXRvbWljKSB7XG4gICAgaWYgKGV2ZW50ID09PSBFVl9VTkxJTkspIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdVbmxpbmtzLnNldChwYXRoLCBhcmdzKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl9wZW5kaW5nVW5saW5rcy5mb3JFYWNoKChlbnRyeSwgcGF0aCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCguLi5lbnRyeSk7XG4gICAgICAgICAgdGhpcy5lbWl0KEVWX0FMTCwgLi4uZW50cnkpO1xuICAgICAgICAgIHRoaXMuX3BlbmRpbmdVbmxpbmtzLmRlbGV0ZShwYXRoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCB0eXBlb2Ygb3B0cy5hdG9taWMgPT09ICdudW1iZXInID8gb3B0cy5hdG9taWMgOiAxMDApO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmIChldmVudCA9PT0gRVZfQUREICYmIHRoaXMuX3BlbmRpbmdVbmxpbmtzLmhhcyhwYXRoKSkge1xuICAgICAgZXZlbnQgPSBhcmdzWzBdID0gRVZfQ0hBTkdFO1xuICAgICAgdGhpcy5fcGVuZGluZ1VubGlua3MuZGVsZXRlKHBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhd2YgJiYgKGV2ZW50ID09PSBFVl9BREQgfHwgZXZlbnQgPT09IEVWX0NIQU5HRSkgJiYgdGhpcy5fcmVhZHlFbWl0dGVkKSB7XG4gICAgY29uc3QgYXdmRW1pdCA9IChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGV2ZW50ID0gYXJnc1swXSA9IEVWX0VSUk9SO1xuICAgICAgICBhcmdzWzFdID0gZXJyO1xuICAgICAgICB0aGlzLmVtaXRXaXRoQWxsKGV2ZW50LCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHMpIHtcbiAgICAgICAgLy8gaWYgc3RhdHMgZG9lc24ndCBleGlzdCB0aGUgZmlsZSBtdXN0IGhhdmUgYmVlbiBkZWxldGVkXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICBhcmdzWzJdID0gc3RhdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKHN0YXRzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXRXaXRoQWxsKGV2ZW50LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5fYXdhaXRXcml0ZUZpbmlzaChwYXRoLCBhd2Yuc3RhYmlsaXR5VGhyZXNob2xkLCBldmVudCwgYXdmRW1pdCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpZiAoZXZlbnQgPT09IEVWX0NIQU5HRSkge1xuICAgIGNvbnN0IGlzVGhyb3R0bGVkID0gIXRoaXMuX3Rocm90dGxlKEVWX0NIQU5HRSwgcGF0aCwgNTApO1xuICAgIGlmIChpc1Rocm90dGxlZCkgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpZiAob3B0cy5hbHdheXNTdGF0ICYmIHZhbDEgPT09IHVuZGVmaW5lZCAmJlxuICAgIChldmVudCA9PT0gRVZfQUREIHx8IGV2ZW50ID09PSBFVl9BRERfRElSIHx8IGV2ZW50ID09PSBFVl9DSEFOR0UpXG4gICkge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gb3B0cy5jd2QgPyBzeXNQYXRoLmpvaW4ob3B0cy5jd2QsIHBhdGgpIDogcGF0aDtcbiAgICBsZXQgc3RhdHM7XG4gICAgdHJ5IHtcbiAgICAgIHN0YXRzID0gYXdhaXQgc3RhdChmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgIC8vIFN1cHByZXNzIGV2ZW50IHdoZW4gZnNfc3RhdCBmYWlscywgdG8gYXZvaWQgc2VuZGluZyB1bmRlZmluZWQgJ3N0YXQnXG4gICAgaWYgKCFzdGF0cyB8fCB0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICAgIGFyZ3MucHVzaChzdGF0cyk7XG4gIH1cbiAgdGhpcy5lbWl0V2l0aEFsbChldmVudCwgYXJncyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ29tbW9uIGhhbmRsZXIgZm9yIGVycm9yc1xuICogQHBhcmFtIHtFcnJvcn0gZXJyb3JcbiAqIEByZXR1cm5zIHtFcnJvcnxCb29sZWFufSBUaGUgZXJyb3IgaWYgZGVmaW5lZCwgb3RoZXJ3aXNlIHRoZSB2YWx1ZSBvZiB0aGUgRlNXYXRjaGVyIGluc3RhbmNlJ3MgYGNsb3NlZGAgZmxhZ1xuICovXG5faGFuZGxlRXJyb3IoZXJyb3IpIHtcbiAgY29uc3QgY29kZSA9IGVycm9yICYmIGVycm9yLmNvZGU7XG4gIGlmIChlcnJvciAmJiBjb2RlICE9PSAnRU5PRU5UJyAmJiBjb2RlICE9PSAnRU5PVERJUicgJiZcbiAgICAoIXRoaXMub3B0aW9ucy5pZ25vcmVQZXJtaXNzaW9uRXJyb3JzIHx8IChjb2RlICE9PSAnRVBFUk0nICYmIGNvZGUgIT09ICdFQUNDRVMnKSlcbiAgKSB7XG4gICAgdGhpcy5lbWl0KEVWX0VSUk9SLCBlcnJvcik7XG4gIH1cbiAgcmV0dXJuIGVycm9yIHx8IHRoaXMuY2xvc2VkO1xufVxuXG4vKipcbiAqIEhlbHBlciB1dGlsaXR5IGZvciB0aHJvdHRsaW5nXG4gKiBAcGFyYW0ge1Rocm90dGxlVHlwZX0gYWN0aW9uVHlwZSB0eXBlIGJlaW5nIHRocm90dGxlZFxuICogQHBhcmFtIHtQYXRofSBwYXRoIGJlaW5nIGFjdGVkIHVwb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IGR1cmF0aW9uIG9mIHRpbWUgdG8gc3VwcHJlc3MgZHVwbGljYXRlIGFjdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R8ZmFsc2V9IHRyYWNraW5nIG9iamVjdCBvciBmYWxzZSBpZiBhY3Rpb24gc2hvdWxkIGJlIHN1cHByZXNzZWRcbiAqL1xuX3Rocm90dGxlKGFjdGlvblR5cGUsIHBhdGgsIHRpbWVvdXQpIHtcbiAgaWYgKCF0aGlzLl90aHJvdHRsZWQuaGFzKGFjdGlvblR5cGUpKSB7XG4gICAgdGhpcy5fdGhyb3R0bGVkLnNldChhY3Rpb25UeXBlLCBuZXcgTWFwKCkpO1xuICB9XG5cbiAgLyoqIEB0eXBlIHtNYXA8UGF0aCwgT2JqZWN0Pn0gKi9cbiAgY29uc3QgYWN0aW9uID0gdGhpcy5fdGhyb3R0bGVkLmdldChhY3Rpb25UeXBlKTtcbiAgLyoqIEB0eXBlIHtPYmplY3R9ICovXG4gIGNvbnN0IGFjdGlvblBhdGggPSBhY3Rpb24uZ2V0KHBhdGgpO1xuXG4gIGlmIChhY3Rpb25QYXRoKSB7XG4gICAgYWN0aW9uUGF0aC5jb3VudCsrO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCB0aW1lb3V0T2JqZWN0O1xuICBjb25zdCBjbGVhciA9ICgpID0+IHtcbiAgICBjb25zdCBpdGVtID0gYWN0aW9uLmdldChwYXRoKTtcbiAgICBjb25zdCBjb3VudCA9IGl0ZW0gPyBpdGVtLmNvdW50IDogMDtcbiAgICBhY3Rpb24uZGVsZXRlKHBhdGgpO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0T2JqZWN0KTtcbiAgICBpZiAoaXRlbSkgY2xlYXJUaW1lb3V0KGl0ZW0udGltZW91dE9iamVjdCk7XG4gICAgcmV0dXJuIGNvdW50O1xuICB9O1xuICB0aW1lb3V0T2JqZWN0ID0gc2V0VGltZW91dChjbGVhciwgdGltZW91dCk7XG4gIGNvbnN0IHRociA9IHt0aW1lb3V0T2JqZWN0LCBjbGVhciwgY291bnQ6IDB9O1xuICBhY3Rpb24uc2V0KHBhdGgsIHRocik7XG4gIHJldHVybiB0aHI7XG59XG5cbl9pbmNyUmVhZHlDb3VudCgpIHtcbiAgcmV0dXJuIHRoaXMuX3JlYWR5Q291bnQrKztcbn1cblxuLyoqXG4gKiBBd2FpdHMgd3JpdGUgb3BlcmF0aW9uIHRvIGZpbmlzaC5cbiAqIFBvbGxzIGEgbmV3bHkgY3JlYXRlZCBmaWxlIGZvciBzaXplIHZhcmlhdGlvbnMuIFdoZW4gZmlsZXMgc2l6ZSBkb2VzIG5vdCBjaGFuZ2UgZm9yICd0aHJlc2hvbGQnIG1pbGxpc2Vjb25kcyBjYWxscyBjYWxsYmFjay5cbiAqIEBwYXJhbSB7UGF0aH0gcGF0aCBiZWluZyBhY3RlZCB1cG9uXG4gKiBAcGFyYW0ge051bWJlcn0gdGhyZXNob2xkIFRpbWUgaW4gbWlsbGlzZWNvbmRzIGEgZmlsZSBzaXplIG11c3QgYmUgZml4ZWQgYmVmb3JlIGFja25vd2xlZGdpbmcgd3JpdGUgT1AgaXMgZmluaXNoZWRcbiAqIEBwYXJhbSB7RXZlbnROYW1lfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gYXdmRW1pdCBDYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiByZWFkeSBmb3IgZXZlbnQgdG8gYmUgZW1pdHRlZC5cbiAqL1xuX2F3YWl0V3JpdGVGaW5pc2gocGF0aCwgdGhyZXNob2xkLCBldmVudCwgYXdmRW1pdCkge1xuICBsZXQgdGltZW91dEhhbmRsZXI7XG5cbiAgbGV0IGZ1bGxQYXRoID0gcGF0aDtcbiAgaWYgKHRoaXMub3B0aW9ucy5jd2QgJiYgIXN5c1BhdGguaXNBYnNvbHV0ZShwYXRoKSkge1xuICAgIGZ1bGxQYXRoID0gc3lzUGF0aC5qb2luKHRoaXMub3B0aW9ucy5jd2QsIHBhdGgpO1xuICB9XG5cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcblxuICBjb25zdCBhd2FpdFdyaXRlRmluaXNoID0gKHByZXZTdGF0KSA9PiB7XG4gICAgZnMuc3RhdChmdWxsUGF0aCwgKGVyciwgY3VyU3RhdCkgPT4ge1xuICAgICAgaWYgKGVyciB8fCAhdGhpcy5fcGVuZGluZ1dyaXRlcy5oYXMocGF0aCkpIHtcbiAgICAgICAgaWYgKGVyciAmJiBlcnIuY29kZSAhPT0gJ0VOT0VOVCcpIGF3ZkVtaXQoZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub3cgPSBOdW1iZXIobmV3IERhdGUoKSk7XG5cbiAgICAgIGlmIChwcmV2U3RhdCAmJiBjdXJTdGF0LnNpemUgIT09IHByZXZTdGF0LnNpemUpIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1dyaXRlcy5nZXQocGF0aCkubGFzdENoYW5nZSA9IG5vdztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHB3ID0gdGhpcy5fcGVuZGluZ1dyaXRlcy5nZXQocGF0aCk7XG4gICAgICBjb25zdCBkZiA9IG5vdyAtIHB3Lmxhc3RDaGFuZ2U7XG5cbiAgICAgIGlmIChkZiA+PSB0aHJlc2hvbGQpIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1dyaXRlcy5kZWxldGUocGF0aCk7XG4gICAgICAgIGF3ZkVtaXQodW5kZWZpbmVkLCBjdXJTdGF0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXRIYW5kbGVyID0gc2V0VGltZW91dChcbiAgICAgICAgICBhd2FpdFdyaXRlRmluaXNoLFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5hd2FpdFdyaXRlRmluaXNoLnBvbGxJbnRlcnZhbCxcbiAgICAgICAgICBjdXJTdGF0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKCF0aGlzLl9wZW5kaW5nV3JpdGVzLmhhcyhwYXRoKSkge1xuICAgIHRoaXMuX3BlbmRpbmdXcml0ZXMuc2V0KHBhdGgsIHtcbiAgICAgIGxhc3RDaGFuZ2U6IG5vdyxcbiAgICAgIGNhbmNlbFdhaXQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1dyaXRlcy5kZWxldGUocGF0aCk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlcik7XG4gICAgICAgIHJldHVybiBldmVudDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aW1lb3V0SGFuZGxlciA9IHNldFRpbWVvdXQoXG4gICAgICBhd2FpdFdyaXRlRmluaXNoLFxuICAgICAgdGhpcy5vcHRpb25zLmF3YWl0V3JpdGVGaW5pc2gucG9sbEludGVydmFsXG4gICAgKTtcbiAgfVxufVxuXG5fZ2V0R2xvYklnbm9yZWQoKSB7XG4gIHJldHVybiBbLi4udGhpcy5faWdub3JlZFBhdGhzLnZhbHVlcygpXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdXNlciBoYXMgYXNrZWQgdG8gaWdub3JlIHRoaXMgcGF0aC5cbiAqIEBwYXJhbSB7UGF0aH0gcGF0aCBmaWxlcGF0aCBvciBkaXJcbiAqIEBwYXJhbSB7ZnMuU3RhdHM9fSBzdGF0cyByZXN1bHQgb2YgZnMuc3RhdFxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbl9pc0lnbm9yZWQocGF0aCwgc3RhdHMpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5hdG9taWMgJiYgRE9UX1JFLnRlc3QocGF0aCkpIHJldHVybiB0cnVlO1xuICBpZiAoIXRoaXMuX3VzZXJJZ25vcmVkKSB7XG4gICAgY29uc3Qge2N3ZH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3QgaWduID0gdGhpcy5vcHRpb25zLmlnbm9yZWQ7XG5cbiAgICBjb25zdCBpZ25vcmVkID0gaWduICYmIGlnbi5tYXAobm9ybWFsaXplSWdub3JlZChjd2QpKTtcbiAgICBjb25zdCBwYXRocyA9IGFycmlmeShpZ25vcmVkKVxuICAgICAgLmZpbHRlcigocGF0aCkgPT4gdHlwZW9mIHBhdGggPT09IFNUUklOR19UWVBFICYmICFpc0dsb2IocGF0aCkpXG4gICAgICAubWFwKChwYXRoKSA9PiBwYXRoICsgU0xBU0hfR0xPQlNUQVIpO1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLl9nZXRHbG9iSWdub3JlZCgpLm1hcChub3JtYWxpemVJZ25vcmVkKGN3ZCkpLmNvbmNhdChpZ25vcmVkLCBwYXRocyk7XG4gICAgdGhpcy5fdXNlcklnbm9yZWQgPSBhbnltYXRjaChsaXN0LCB1bmRlZmluZWQsIEFOWU1BVENIX09QVFMpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX3VzZXJJZ25vcmVkKFtwYXRoLCBzdGF0c10pO1xufVxuXG5faXNudElnbm9yZWQocGF0aCwgc3RhdCkge1xuICByZXR1cm4gIXRoaXMuX2lzSWdub3JlZChwYXRoLCBzdGF0KTtcbn1cblxuLyoqXG4gKiBQcm92aWRlcyBhIHNldCBvZiBjb21tb24gaGVscGVycyBhbmQgcHJvcGVydGllcyByZWxhdGluZyB0byBzeW1saW5rIGFuZCBnbG9iIGhhbmRsaW5nLlxuICogQHBhcmFtIHtQYXRofSBwYXRoIGZpbGUsIGRpcmVjdG9yeSwgb3IgZ2xvYiBwYXR0ZXJuIGJlaW5nIHdhdGNoZWRcbiAqIEBwYXJhbSB7TnVtYmVyPX0gZGVwdGggYXQgYW55IGRlcHRoID4gMCwgdGhpcyBpc24ndCBhIGdsb2JcbiAqIEByZXR1cm5zIHtXYXRjaEhlbHBlcn0gb2JqZWN0IGNvbnRhaW5pbmcgaGVscGVycyBmb3IgdGhpcyBwYXRoXG4gKi9cbl9nZXRXYXRjaEhlbHBlcnMocGF0aCwgZGVwdGgpIHtcbiAgY29uc3Qgd2F0Y2hQYXRoID0gZGVwdGggfHwgdGhpcy5vcHRpb25zLmRpc2FibGVHbG9iYmluZyB8fCAhaXNHbG9iKHBhdGgpID8gcGF0aCA6IGdsb2JQYXJlbnQocGF0aCk7XG4gIGNvbnN0IGZvbGxvdyA9IHRoaXMub3B0aW9ucy5mb2xsb3dTeW1saW5rcztcblxuICByZXR1cm4gbmV3IFdhdGNoSGVscGVyKHBhdGgsIHdhdGNoUGF0aCwgZm9sbG93LCB0aGlzKTtcbn1cblxuLy8gRGlyZWN0b3J5IGhlbHBlcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogUHJvdmlkZXMgZGlyZWN0b3J5IHRyYWNraW5nIG9iamVjdHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBkaXJlY3RvcnkgcGF0aCBvZiB0aGUgZGlyZWN0b3J5XG4gKiBAcmV0dXJucyB7RGlyRW50cnl9IHRoZSBkaXJlY3RvcnkncyB0cmFja2luZyBvYmplY3RcbiAqL1xuX2dldFdhdGNoZWREaXIoZGlyZWN0b3J5KSB7XG4gIGlmICghdGhpcy5fYm91bmRSZW1vdmUpIHRoaXMuX2JvdW5kUmVtb3ZlID0gdGhpcy5fcmVtb3ZlLmJpbmQodGhpcyk7XG4gIGNvbnN0IGRpciA9IHN5c1BhdGgucmVzb2x2ZShkaXJlY3RvcnkpO1xuICBpZiAoIXRoaXMuX3dhdGNoZWQuaGFzKGRpcikpIHRoaXMuX3dhdGNoZWQuc2V0KGRpciwgbmV3IERpckVudHJ5KGRpciwgdGhpcy5fYm91bmRSZW1vdmUpKTtcbiAgcmV0dXJuIHRoaXMuX3dhdGNoZWQuZ2V0KGRpcik7XG59XG5cbi8vIEZpbGUgaGVscGVyc1xuLy8gLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ2hlY2sgZm9yIHJlYWQgcGVybWlzc2lvbnMuXG4gKiBCYXNlZCBvbiB0aGlzIGFuc3dlciBvbiBTTzogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExNzgxNDA0LzEzNTg0MDVcbiAqIEBwYXJhbSB7ZnMuU3RhdHN9IHN0YXRzIC0gb2JqZWN0LCByZXN1bHQgb2YgZnNfc3RhdFxuICogQHJldHVybnMge0Jvb2xlYW59IGluZGljYXRlcyB3aGV0aGVyIHRoZSBmaWxlIGNhbiBiZSByZWFkXG4qL1xuX2hhc1JlYWRQZXJtaXNzaW9ucyhzdGF0cykge1xuICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZVBlcm1pc3Npb25FcnJvcnMpIHJldHVybiB0cnVlO1xuXG4gIC8vIHN0YXRzLm1vZGUgbWF5IGJlIGJpZ2ludFxuICBjb25zdCBtZCA9IHN0YXRzICYmIE51bWJlci5wYXJzZUludChzdGF0cy5tb2RlLCAxMCk7XG4gIGNvbnN0IHN0ID0gbWQgJiAwbzc3NztcbiAgY29uc3QgaXQgPSBOdW1iZXIucGFyc2VJbnQoc3QudG9TdHJpbmcoOClbMF0sIDEwKTtcbiAgcmV0dXJuIEJvb2xlYW4oNCAmIGl0KTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIGVtaXR0aW5nIHVubGluayBldmVudHMgZm9yXG4gKiBmaWxlcyBhbmQgZGlyZWN0b3JpZXMsIGFuZCB2aWEgcmVjdXJzaW9uLCBmb3JcbiAqIGZpbGVzIGFuZCBkaXJlY3RvcmllcyB3aXRoaW4gZGlyZWN0b3JpZXMgdGhhdCBhcmUgdW5saW5rZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBkaXJlY3Rvcnkgd2l0aGluIHdoaWNoIHRoZSBmb2xsb3dpbmcgaXRlbSBpcyBsb2NhdGVkXG4gKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAgICAgIGJhc2UgcGF0aCBvZiBpdGVtL2RpcmVjdG9yeVxuICogQHJldHVybnMge3ZvaWR9XG4qL1xuX3JlbW92ZShkaXJlY3RvcnksIGl0ZW0sIGlzRGlyZWN0b3J5KSB7XG4gIC8vIGlmIHdoYXQgaXMgYmVpbmcgZGVsZXRlZCBpcyBhIGRpcmVjdG9yeSwgZ2V0IHRoYXQgZGlyZWN0b3J5J3MgcGF0aHNcbiAgLy8gZm9yIHJlY3Vyc2l2ZSBkZWxldGluZyBhbmQgY2xlYW5pbmcgb2Ygd2F0Y2hlZCBvYmplY3RcbiAgLy8gaWYgaXQgaXMgbm90IGEgZGlyZWN0b3J5LCBuZXN0ZWREaXJlY3RvcnlDaGlsZHJlbiB3aWxsIGJlIGVtcHR5IGFycmF5XG4gIGNvbnN0IHBhdGggPSBzeXNQYXRoLmpvaW4oZGlyZWN0b3J5LCBpdGVtKTtcbiAgY29uc3QgZnVsbFBhdGggPSBzeXNQYXRoLnJlc29sdmUocGF0aCk7XG4gIGlzRGlyZWN0b3J5ID0gaXNEaXJlY3RvcnkgIT0gbnVsbFxuICAgID8gaXNEaXJlY3RvcnlcbiAgICA6IHRoaXMuX3dhdGNoZWQuaGFzKHBhdGgpIHx8IHRoaXMuX3dhdGNoZWQuaGFzKGZ1bGxQYXRoKTtcblxuICAvLyBwcmV2ZW50IGR1cGxpY2F0ZSBoYW5kbGluZyBpbiBjYXNlIG9mIGFycml2aW5nIGhlcmUgbmVhcmx5IHNpbXVsdGFuZW91c2x5XG4gIC8vIHZpYSBtdWx0aXBsZSBwYXRocyAoc3VjaCBhcyBfaGFuZGxlRmlsZSBhbmQgX2hhbmRsZURpcilcbiAgaWYgKCF0aGlzLl90aHJvdHRsZSgncmVtb3ZlJywgcGF0aCwgMTAwKSkgcmV0dXJuO1xuXG4gIC8vIGlmIHRoZSBvbmx5IHdhdGNoZWQgZmlsZSBpcyByZW1vdmVkLCB3YXRjaCBmb3IgaXRzIHJldHVyblxuICBpZiAoIWlzRGlyZWN0b3J5ICYmICF0aGlzLm9wdGlvbnMudXNlRnNFdmVudHMgJiYgdGhpcy5fd2F0Y2hlZC5zaXplID09PSAxKSB7XG4gICAgdGhpcy5hZGQoZGlyZWN0b3J5LCBpdGVtLCB0cnVlKTtcbiAgfVxuXG4gIC8vIFRoaXMgd2lsbCBjcmVhdGUgYSBuZXcgZW50cnkgaW4gdGhlIHdhdGNoZWQgb2JqZWN0IGluIGVpdGhlciBjYXNlXG4gIC8vIHNvIHdlIGdvdCB0byBkbyB0aGUgZGlyZWN0b3J5IGNoZWNrIGJlZm9yZWhhbmRcbiAgY29uc3Qgd3AgPSB0aGlzLl9nZXRXYXRjaGVkRGlyKHBhdGgpO1xuICBjb25zdCBuZXN0ZWREaXJlY3RvcnlDaGlsZHJlbiA9IHdwLmdldENoaWxkcmVuKCk7XG5cbiAgLy8gUmVjdXJzaXZlbHkgcmVtb3ZlIGNoaWxkcmVuIGRpcmVjdG9yaWVzIC8gZmlsZXMuXG4gIG5lc3RlZERpcmVjdG9yeUNoaWxkcmVuLmZvckVhY2gobmVzdGVkID0+IHRoaXMuX3JlbW92ZShwYXRoLCBuZXN0ZWQpKTtcblxuICAvLyBDaGVjayBpZiBpdGVtIHdhcyBvbiB0aGUgd2F0Y2hlZCBsaXN0IGFuZCByZW1vdmUgaXRcbiAgY29uc3QgcGFyZW50ID0gdGhpcy5fZ2V0V2F0Y2hlZERpcihkaXJlY3RvcnkpO1xuICBjb25zdCB3YXNUcmFja2VkID0gcGFyZW50LmhhcyhpdGVtKTtcbiAgcGFyZW50LnJlbW92ZShpdGVtKTtcblxuICAvLyBGaXhlcyBpc3N1ZSAjMTA0MiAtPiBSZWxhdGl2ZSBwYXRocyB3ZXJlIGRldGVjdGVkIGFuZCBhZGRlZCBhcyBzeW1saW5rc1xuICAvLyAoaHR0cHM6Ly9naXRodWIuY29tL3BhdWxtaWxsci9jaG9raWRhci9ibG9iL2UxNzUzZGRiYzk1NzFiZGMzM2I0YTRhZjE3MmQ1MmNiNmU2MTFjMTAvbGliL25vZGVmcy1oYW5kbGVyLmpzI0w2MTIpLFxuICAvLyBidXQgbmV2ZXIgcmVtb3ZlZCBmcm9tIHRoZSBtYXAgaW4gY2FzZSB0aGUgcGF0aCB3YXMgZGVsZXRlZC5cbiAgLy8gVGhpcyBsZWFkcyB0byBhbiBpbmNvcnJlY3Qgc3RhdGUgaWYgdGhlIHBhdGggd2FzIHJlY3JlYXRlZDpcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BhdWxtaWxsci9jaG9raWRhci9ibG9iL2UxNzUzZGRiYzk1NzFiZGMzM2I0YTRhZjE3MmQ1MmNiNmU2MTFjMTAvbGliL25vZGVmcy1oYW5kbGVyLmpzI0w1NTNcbiAgaWYgKHRoaXMuX3N5bWxpbmtQYXRocy5oYXMoZnVsbFBhdGgpKSB7XG4gICAgdGhpcy5fc3ltbGlua1BhdGhzLmRlbGV0ZShmdWxsUGF0aCk7XG4gIH1cblxuICAvLyBJZiB3ZSB3YWl0IGZvciB0aGlzIGZpbGUgdG8gYmUgZnVsbHkgd3JpdHRlbiwgY2FuY2VsIHRoZSB3YWl0LlxuICBsZXQgcmVsUGF0aCA9IHBhdGg7XG4gIGlmICh0aGlzLm9wdGlvbnMuY3dkKSByZWxQYXRoID0gc3lzUGF0aC5yZWxhdGl2ZSh0aGlzLm9wdGlvbnMuY3dkLCBwYXRoKTtcbiAgaWYgKHRoaXMub3B0aW9ucy5hd2FpdFdyaXRlRmluaXNoICYmIHRoaXMuX3BlbmRpbmdXcml0ZXMuaGFzKHJlbFBhdGgpKSB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLl9wZW5kaW5nV3JpdGVzLmdldChyZWxQYXRoKS5jYW5jZWxXYWl0KCk7XG4gICAgaWYgKGV2ZW50ID09PSBFVl9BREQpIHJldHVybjtcbiAgfVxuXG4gIC8vIFRoZSBFbnRyeSB3aWxsIGVpdGhlciBiZSBhIGRpcmVjdG9yeSB0aGF0IGp1c3QgZ290IHJlbW92ZWRcbiAgLy8gb3IgYSBib2d1cyBlbnRyeSB0byBhIGZpbGUsIGluIGVpdGhlciBjYXNlIHdlIGhhdmUgdG8gcmVtb3ZlIGl0XG4gIHRoaXMuX3dhdGNoZWQuZGVsZXRlKHBhdGgpO1xuICB0aGlzLl93YXRjaGVkLmRlbGV0ZShmdWxsUGF0aCk7XG4gIGNvbnN0IGV2ZW50TmFtZSA9IGlzRGlyZWN0b3J5ID8gRVZfVU5MSU5LX0RJUiA6IEVWX1VOTElOSztcbiAgaWYgKHdhc1RyYWNrZWQgJiYgIXRoaXMuX2lzSWdub3JlZChwYXRoKSkgdGhpcy5fZW1pdChldmVudE5hbWUsIHBhdGgpO1xuXG4gIC8vIEF2b2lkIGNvbmZsaWN0cyBpZiB3ZSBsYXRlciBjcmVhdGUgYW5vdGhlciBmaWxlIHdpdGggdGhlIHNhbWUgbmFtZVxuICBpZiAoIXRoaXMub3B0aW9ucy51c2VGc0V2ZW50cykge1xuICAgIHRoaXMuX2Nsb3NlUGF0aChwYXRoKTtcbiAgfVxufVxuXG4vKipcbiAqIENsb3NlcyBhbGwgd2F0Y2hlcnMgZm9yIGEgcGF0aFxuICogQHBhcmFtIHtQYXRofSBwYXRoXG4gKi9cbl9jbG9zZVBhdGgocGF0aCkge1xuICB0aGlzLl9jbG9zZUZpbGUocGF0aClcbiAgY29uc3QgZGlyID0gc3lzUGF0aC5kaXJuYW1lKHBhdGgpO1xuICB0aGlzLl9nZXRXYXRjaGVkRGlyKGRpcikucmVtb3ZlKHN5c1BhdGguYmFzZW5hbWUocGF0aCkpO1xufVxuXG4vKipcbiAqIENsb3NlcyBvbmx5IGZpbGUtc3BlY2lmaWMgd2F0Y2hlcnNcbiAqIEBwYXJhbSB7UGF0aH0gcGF0aFxuICovXG5fY2xvc2VGaWxlKHBhdGgpIHtcbiAgY29uc3QgY2xvc2VycyA9IHRoaXMuX2Nsb3NlcnMuZ2V0KHBhdGgpO1xuICBpZiAoIWNsb3NlcnMpIHJldHVybjtcbiAgY2xvc2Vycy5mb3JFYWNoKGNsb3NlciA9PiBjbG9zZXIoKSk7XG4gIHRoaXMuX2Nsb3NlcnMuZGVsZXRlKHBhdGgpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1BhdGh9IHBhdGhcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb3NlclxuICovXG5fYWRkUGF0aENsb3NlcihwYXRoLCBjbG9zZXIpIHtcbiAgaWYgKCFjbG9zZXIpIHJldHVybjtcbiAgbGV0IGxpc3QgPSB0aGlzLl9jbG9zZXJzLmdldChwYXRoKTtcbiAgaWYgKCFsaXN0KSB7XG4gICAgbGlzdCA9IFtdO1xuICAgIHRoaXMuX2Nsb3NlcnMuc2V0KHBhdGgsIGxpc3QpO1xuICB9XG4gIGxpc3QucHVzaChjbG9zZXIpO1xufVxuXG5fcmVhZGRpcnAocm9vdCwgb3B0cykge1xuICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgY29uc3Qgb3B0aW9ucyA9IHt0eXBlOiBFVl9BTEwsIGFsd2F5c1N0YXQ6IHRydWUsIGxzdGF0OiB0cnVlLCAuLi5vcHRzfTtcbiAgbGV0IHN0cmVhbSA9IHJlYWRkaXJwKHJvb3QsIG9wdGlvbnMpO1xuICB0aGlzLl9zdHJlYW1zLmFkZChzdHJlYW0pO1xuICBzdHJlYW0ub25jZShTVFJfQ0xPU0UsICgpID0+IHtcbiAgICBzdHJlYW0gPSB1bmRlZmluZWQ7XG4gIH0pO1xuICBzdHJlYW0ub25jZShTVFJfRU5ELCAoKSA9PiB7XG4gICAgaWYgKHN0cmVhbSkge1xuICAgICAgdGhpcy5fc3RyZWFtcy5kZWxldGUoc3RyZWFtKTtcbiAgICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3RyZWFtO1xufVxuXG59XG5cbi8vIEV4cG9ydCBGU1dhdGNoZXIgY2xhc3NcbmV4cG9ydHMuRlNXYXRjaGVyID0gRlNXYXRjaGVyO1xuXG4vKipcbiAqIEluc3RhbnRpYXRlcyB3YXRjaGVyIHdpdGggcGF0aHMgdG8gYmUgdHJhY2tlZC5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5PFN0cmluZz59IHBhdGhzIGZpbGUvZGlyZWN0b3J5IHBhdGhzIGFuZC9vciBnbG9ic1xuICogQHBhcmFtIHtPYmplY3Q9fSBvcHRpb25zIGNob2tpZGFyIG9wdHNcbiAqIEByZXR1cm5zIGFuIGluc3RhbmNlIG9mIEZTV2F0Y2hlciBmb3IgY2hhaW5pbmcuXG4gKi9cbmNvbnN0IHdhdGNoID0gKHBhdGhzLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHdhdGNoZXIgPSBuZXcgRlNXYXRjaGVyKG9wdGlvbnMpO1xuICB3YXRjaGVyLmFkZChwYXRocyk7XG4gIHJldHVybiB3YXRjaGVyO1xufTtcblxuZXhwb3J0cy53YXRjaCA9IHdhdGNoO1xuIiwiaW1wb3J0IHsgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgZGlhbG9nIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IFBBVEggZnJvbSAncGF0aCc7XG5pbXBvcnQgRlMgZnJvbSAnZnMnO1xuaW1wb3J0IEZTRSBmcm9tICdmcy1leHRyYSdcbmltcG9ydCBjaG9raWRhciBmcm9tICdjaG9raWRhcic7XG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJztcblxuY29uc3QgY2hhbmdlTGlzdGVuZXJzID0ge307XG5cbmV4cG9ydCBjb25zdCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlID0ge1xuXG4gIHJlYWREaXI6IChlLHBhdGgpID0+IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuXG4gICAgY29uc3QgbGFiZWxzID0gRlMucmVhZGRpclN5bmMocGF0aCk7XG4gICAgZm9yKGNvbnN0IGwgb2YgbGFiZWxzKXtcbiAgICAgIGNvbnN0IHN0YXQgPSBGUy5sc3RhdFN5bmMoUEFUSC5qb2luKHBhdGgsbCkpO1xuICAgICAgaWYobC5zdGFydHNXaXRoKCdpc2EuJykgfHwgbC5zdGFydHNXaXRoKCcuZ2l0JykgfHwgbC5zdGFydHNXaXRoKCcuYXJjJykpXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBzdGF0LmlkID0gcGF0aCsnLycrbDtcbiAgICAgIHN0YXQuaXNEaXJlY3RvcnkgPSBzdGF0LmlzRGlyZWN0b3J5KCk7XG4gICAgICBjaGlsZHJlbi5wdXNoKHN0YXQpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfSxcblxuICBzZWxlY3REaXI6IGFzeW5jICgpPT57XG4gICAgY29uc3Qgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGlhbG9nLnNob3dPcGVuRGlhbG9nKHdpbmRvdywge1xuICAgICAgcHJvcGVydGllczogWydvcGVuRGlyZWN0b3J5J11cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmZpbGVQYXRoc1swXTtcbiAgfSxcblxuICBzZWxlY3RBbnk6IGFzeW5jICgpPT57XG4gICAgY29uc3Qgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGlhbG9nLnNob3dPcGVuRGlhbG9nKHdpbmRvdywge1xuICAgICAgcHJvcGVydGllczogWydvcGVuRmlsZScsJ211bHRpU2VsZWN0aW9ucyddXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5maWxlUGF0aHM7XG4gIH0sXG5cbiAgc2F2ZUZpbGU6IGFzeW5jICgpPT57XG4gICAgY29uc3Qgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHdpbmRvdyk7XG4gICAgcmV0dXJuIHJlc3VsdC5maWxlUGF0aDtcbiAgfSxcblxuICByZWFkRmlsZTogKGUscGF0aCk9PntcbiAgICByZXR1cm4gRlMucmVhZEZpbGVTeW5jKHBhdGgse2VuY29kaW5nOidVVEYtOCd9KTtcbiAgfSxcblxuICBjb3B5OiBhc3luYyAoZSxbc3JjLGRzdF0pPT57XG4gICAgY29uc3QgbmFtZSA9IHNyYy5zcGxpdCgnLycpLnBvcCgpO1xuICAgIHRyeSB7XG4gICAgICBGU0UuY29weVN5bmMoc3JjLCBkc3QrJy8nK25hbWUsIHsgb3ZlcndyaXRlOiB0cnVlIH0pXG4gICAgICByZXR1cm4gMTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfSxcblxuICByZWdpc3RlckNoYW5nZUxpc3RlbmVyOiBhc3luYyAoZSxwYXRoKT0+e1xuICAgIC8vIGNvbnNvbGUubG9nKCdybCcscGF0aClcbiAgICBjaGFuZ2VMaXN0ZW5lcnNbcGF0aF0gPSBjaG9raWRhci53YXRjaChwYXRoLHtpZ25vcmVJbml0aWFsOnRydWV9KTtcblxuICAgIGNvbnN0IHVwZGF0ZVBhdGggPSBwYXRoID0+IHtcbiAgICAgIGNvbnN0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcbiAgICAgIHdpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnVwZGF0ZVBhdGgnLCBwYXRoKTtcbiAgICB9O1xuICAgIGNvbnN0IHVwZGF0ZVBhcmVudFBhdGggPSBwYXRoID0+IHtcbiAgICAgIHVwZGF0ZVBhdGgoIHBhdGguc3BsaXQoJy8nKS5zbGljZSgwLC0xKS5qb2luKCcvJykgKTtcbiAgICB9O1xuXG4gICAgY2hhbmdlTGlzdGVuZXJzW3BhdGhdXG4gICAgICAvLyAub24oJ2FsbCcsIChldmVudCwgcGF0aCkgPT4ge1xuICAgICAgLy8gICAvLyBjb25zb2xlLmxvZyhldmVudCxwYXRoKTtcbiAgICAgIC8vIH0pXG4gICAgICAub24oJ2FkZCcsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ3VubGluaycsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ2FkZERpcicsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ3VubGlua0RpcicsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgO1xuXG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIHVucmVnaXN0ZXJDaGFuZ2VMaXN0ZW5lcjogYXN5bmMgKGUscGF0aCk9PntcbiAgICAvLyBjb25zb2xlLmxvZygndWwnLHBhdGgpXG4gICAgY29uc3Qgd2F0Y2hlciA9IGNoYW5nZUxpc3RlbmVyc1twYXRoXTtcbiAgICBpZighd2F0Y2hlcilcbiAgICAgIHJldHVybjtcblxuICAgIGF3YWl0IHdhdGNoZXIudW53YXRjaCgpO1xuICAgIGRlbGV0ZSBjaGFuZ2VMaXN0ZW5lcnNbcGF0aF07XG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIGNyZWF0ZUVtcHR5RmlsZTogYXN5bmMgKGUscGF0aCk9PntcbiAgICBjb25zdCBmcGF0aCA9IChwYXRoLnNsaWNlKC0zKT09PScubWQnIHx8IHBhdGguc2xpY2UoLTQpPT09Jy50eHQnKSA/IHBhdGggOiBwYXRoICsnLm1kJztcbiAgICBGUy53cml0ZUZpbGVTeW5jKGZwYXRoLFwiXCIpO1xuICAgIHJldHVybiBmcGF0aDtcbiAgfSxcblxuICB3cml0ZUZpbGU6IGFzeW5jIChlLFtwYXRoLGRhdGFdKT0+e1xuICAgIHJldHVybiBGUy53cml0ZUZpbGVTeW5jKHBhdGgsZGF0YSx7ZW5jb2Rpbmc6J1VURi04J30pO1xuICB9LFxuXG4gIGluaXQ6IGFzeW5jICgpID0+IHtcbiAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGBVbmhhbmRsZWQgUmVqZWN0aW9uIGF0OiAke3V0aWwuaW5zcGVjdChwKX0gcmVhc29uOiAke3JlYXNvbn1gKTtcbiAgICB9KTtcblxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWREaXInLCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWREaXIpXG4gICAgaXBjTWFpbi5oYW5kbGUoJ0xvY2FsRmlsZVN5c3RlbVNlcnZpY2UucmVhZEZpbGUnLCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWRGaWxlKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLndyaXRlRmlsZScsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2Uud3JpdGVGaWxlKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnNlbGVjdERpcicsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2Uuc2VsZWN0RGlyKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnNlbGVjdEFueScsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2Uuc2VsZWN0QW55KVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnNhdmVGaWxlJywgTG9jYWxGaWxlU3lzdGVtU2VydmljZS5zYXZlRmlsZSlcbiAgICBpcGNNYWluLmhhbmRsZSgnTG9jYWxGaWxlU3lzdGVtU2VydmljZS5jb3B5JywgTG9jYWxGaWxlU3lzdGVtU2VydmljZS5jb3B5KVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLmNyZWF0ZUVtcHR5RmlsZScsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2UuY3JlYXRlRW1wdHlGaWxlKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlZ2lzdGVyQ2hhbmdlTGlzdGVuZXInLCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlZ2lzdGVyQ2hhbmdlTGlzdGVuZXIpXG4gICAgaXBjTWFpbi5oYW5kbGUoJ0xvY2FsRmlsZVN5c3RlbVNlcnZpY2UudW5yZWdpc3RlckNoYW5nZUxpc3RlbmVyJywgTG9jYWxGaWxlU3lzdGVtU2VydmljZS51bnJlZ2lzdGVyQ2hhbmdlTGlzdGVuZXIpXG4gIH1cbn1cbiIsImNvbnN0IHRva2VuID0gJyVbYS1mMC05XXsyfSc7XG5jb25zdCBzaW5nbGVNYXRjaGVyID0gbmV3IFJlZ0V4cCgnKCcgKyB0b2tlbiArICcpfChbXiVdKz8pJywgJ2dpJyk7XG5jb25zdCBtdWx0aU1hdGNoZXIgPSBuZXcgUmVnRXhwKCcoJyArIHRva2VuICsgJykrJywgJ2dpJyk7XG5cbmZ1bmN0aW9uIGRlY29kZUNvbXBvbmVudHMoY29tcG9uZW50cywgc3BsaXQpIHtcblx0dHJ5IHtcblx0XHQvLyBUcnkgdG8gZGVjb2RlIHRoZSBlbnRpcmUgc3RyaW5nIGZpcnN0XG5cdFx0cmV0dXJuIFtkZWNvZGVVUklDb21wb25lbnQoY29tcG9uZW50cy5qb2luKCcnKSldO1xuXHR9IGNhdGNoIHtcblx0XHQvLyBEbyBub3RoaW5nXG5cdH1cblxuXHRpZiAoY29tcG9uZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fVxuXG5cdHNwbGl0ID0gc3BsaXQgfHwgMTtcblxuXHQvLyBTcGxpdCB0aGUgYXJyYXkgaW4gMiBwYXJ0c1xuXHRjb25zdCBsZWZ0ID0gY29tcG9uZW50cy5zbGljZSgwLCBzcGxpdCk7XG5cdGNvbnN0IHJpZ2h0ID0gY29tcG9uZW50cy5zbGljZShzcGxpdCk7XG5cblx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuY2FsbChbXSwgZGVjb2RlQ29tcG9uZW50cyhsZWZ0KSwgZGVjb2RlQ29tcG9uZW50cyhyaWdodCkpO1xufVxuXG5mdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGlucHV0KTtcblx0fSBjYXRjaCB7XG5cdFx0bGV0IHRva2VucyA9IGlucHV0Lm1hdGNoKHNpbmdsZU1hdGNoZXIpIHx8IFtdO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlucHV0ID0gZGVjb2RlQ29tcG9uZW50cyh0b2tlbnMsIGkpLmpvaW4oJycpO1xuXG5cdFx0XHR0b2tlbnMgPSBpbnB1dC5tYXRjaChzaW5nbGVNYXRjaGVyKSB8fCBbXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5wdXQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3VzdG9tRGVjb2RlVVJJQ29tcG9uZW50KGlucHV0KSB7XG5cdC8vIEtlZXAgdHJhY2sgb2YgYWxsIHRoZSByZXBsYWNlbWVudHMgYW5kIHByZWZpbGwgdGhlIG1hcCB3aXRoIHRoZSBgQk9NYFxuXHRjb25zdCByZXBsYWNlTWFwID0ge1xuXHRcdCclRkUlRkYnOiAnXFx1RkZGRFxcdUZGRkQnLFxuXHRcdCclRkYlRkUnOiAnXFx1RkZGRFxcdUZGRkQnLFxuXHR9O1xuXG5cdGxldCBtYXRjaCA9IG11bHRpTWF0Y2hlci5leGVjKGlucHV0KTtcblx0d2hpbGUgKG1hdGNoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIERlY29kZSBhcyBiaWcgY2h1bmtzIGFzIHBvc3NpYmxlXG5cdFx0XHRyZXBsYWNlTWFwW21hdGNoWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFswXSk7XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBkZWNvZGUobWF0Y2hbMF0pO1xuXG5cdFx0XHRpZiAocmVzdWx0ICE9PSBtYXRjaFswXSkge1xuXHRcdFx0XHRyZXBsYWNlTWFwW21hdGNoWzBdXSA9IHJlc3VsdDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRtYXRjaCA9IG11bHRpTWF0Y2hlci5leGVjKGlucHV0KTtcblx0fVxuXG5cdC8vIEFkZCBgJUMyYCBhdCB0aGUgZW5kIG9mIHRoZSBtYXAgdG8gbWFrZSBzdXJlIGl0IGRvZXMgbm90IHJlcGxhY2UgdGhlIGNvbWJpbmF0b3IgYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZVxuXHRyZXBsYWNlTWFwWyclQzInXSA9ICdcXHVGRkZEJztcblxuXHRjb25zdCBlbnRyaWVzID0gT2JqZWN0LmtleXMocmVwbGFjZU1hcCk7XG5cblx0Zm9yIChjb25zdCBrZXkgb2YgZW50cmllcykge1xuXHRcdC8vIFJlcGxhY2UgYWxsIGRlY29kZWQgY29tcG9uZW50c1xuXHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShuZXcgUmVnRXhwKGtleSwgJ2cnKSwgcmVwbGFjZU1hcFtrZXldKTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVjb2RlVXJpQ29tcG9uZW50KGVuY29kZWRVUkkpIHtcblx0aWYgKHR5cGVvZiBlbmNvZGVkVVJJICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGBlbmNvZGVkVVJJYCB0byBiZSBvZiB0eXBlIGBzdHJpbmdgLCBnb3QgYCcgKyB0eXBlb2YgZW5jb2RlZFVSSSArICdgJyk7XG5cdH1cblxuXHR0cnkge1xuXHRcdC8vIFRyeSB0aGUgYnVpbHQgaW4gZGVjb2RlciBmaXJzdFxuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZW5jb2RlZFVSSSk7XG5cdH0gY2F0Y2gge1xuXHRcdC8vIEZhbGxiYWNrIHRvIGEgbW9yZSBhZHZhbmNlZCBkZWNvZGVyXG5cdFx0cmV0dXJuIGN1c3RvbURlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJKTtcblx0fVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3BsaXRPbkZpcnN0KHN0cmluZywgc2VwYXJhdG9yKSB7XG5cdGlmICghKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBzZXBhcmF0b3IgPT09ICdzdHJpbmcnKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBhcmd1bWVudHMgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCcpO1xuXHR9XG5cblx0aWYgKHN0cmluZyA9PT0gJycgfHwgc2VwYXJhdG9yID09PSAnJykge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdGNvbnN0IHNlcGFyYXRvckluZGV4ID0gc3RyaW5nLmluZGV4T2Yoc2VwYXJhdG9yKTtcblxuXHRpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0cmV0dXJuIFtcblx0XHRzdHJpbmcuc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpLFxuXHRcdHN0cmluZy5zbGljZShzZXBhcmF0b3JJbmRleCArIHNlcGFyYXRvci5sZW5ndGgpXG5cdF07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaW5jbHVkZUtleXMob2JqZWN0LCBwcmVkaWNhdGUpIHtcblx0Y29uc3QgcmVzdWx0ID0ge307XG5cblx0aWYgKEFycmF5LmlzQXJyYXkocHJlZGljYXRlKSkge1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIHByZWRpY2F0ZSkge1xuXHRcdFx0Y29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuXHRcdFx0aWYgKGRlc2NyaXB0b3I/LmVudW1lcmFibGUpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjcmlwdG9yKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gYFJlZmxlY3Qub3duS2V5cygpYCBpcyByZXF1aXJlZCB0byByZXRyaWV2ZSBzeW1ib2wgcHJvcGVydGllc1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhvYmplY3QpKSB7XG5cdFx0XHRjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG5cdFx0XHRpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG5cdFx0XHRcdGlmIChwcmVkaWNhdGUoa2V5LCB2YWx1ZSwgb2JqZWN0KSkge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzY3JpcHRvcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhjbHVkZUtleXMob2JqZWN0LCBwcmVkaWNhdGUpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkocHJlZGljYXRlKSkge1xuXHRcdGNvbnN0IHNldCA9IG5ldyBTZXQocHJlZGljYXRlKTtcblx0XHRyZXR1cm4gaW5jbHVkZUtleXMob2JqZWN0LCBrZXkgPT4gIXNldC5oYXMoa2V5KSk7XG5cdH1cblxuXHRyZXR1cm4gaW5jbHVkZUtleXMob2JqZWN0LCAoa2V5LCB2YWx1ZSwgb2JqZWN0KSA9PiAhcHJlZGljYXRlKGtleSwgdmFsdWUsIG9iamVjdCkpO1xufVxuIiwiaW1wb3J0IGRlY29kZUNvbXBvbmVudCBmcm9tICdkZWNvZGUtdXJpLWNvbXBvbmVudCc7XG5pbXBvcnQgc3BsaXRPbkZpcnN0IGZyb20gJ3NwbGl0LW9uLWZpcnN0JztcbmltcG9ydCB7aW5jbHVkZUtleXN9IGZyb20gJ2ZpbHRlci1vYmonO1xuXG5jb25zdCBpc051bGxPclVuZGVmaW5lZCA9IHZhbHVlID0+IHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL3ByZWZlci1jb2RlLXBvaW50XG5jb25zdCBzdHJpY3RVcmlFbmNvZGUgPSBzdHJpbmcgPT4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZykucmVwbGFjZSgvWyEnKCkqXS9nLCB4ID0+IGAlJHt4LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCl9YCk7XG5cbmNvbnN0IGVuY29kZUZyYWdtZW50SWRlbnRpZmllciA9IFN5bWJvbCgnZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyJyk7XG5cbmZ1bmN0aW9uIGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKSB7XG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzoge1xuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHJlc3VsdC5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHRcdC4uLnJlc3VsdCwgW2VuY29kZShrZXksIG9wdGlvbnMpLCAnWycsIGluZGV4LCAnXSddLmpvaW4oJycpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbJywgZW5jb2RlKGluZGV4LCBvcHRpb25zKSwgJ109JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2JyYWNrZXQnOiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXSddLmpvaW4oJycpLFxuXHRcdFx0XHRcdF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXT0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKSxcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29sb24tbGlzdC1zZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICc6bGlzdD0nXS5qb2luKCcnKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnOmxpc3Q9JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyksXG5cdFx0XHRcdF07XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2NvbW1hJzpcblx0XHRjYXNlICdzZXBhcmF0b3InOlxuXHRcdGNhc2UgJ2JyYWNrZXQtc2VwYXJhdG9yJzoge1xuXHRcdFx0Y29uc3Qga2V5VmFsdWVTZXAgPSBvcHRpb25zLmFycmF5Rm9ybWF0ID09PSAnYnJhY2tldC1zZXBhcmF0b3InXG5cdFx0XHRcdD8gJ1tdPSdcblx0XHRcdFx0OiAnPSc7XG5cblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHZhbHVlID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR8fCAob3B0aW9ucy5za2lwRW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhbnNsYXRlIG51bGwgdG8gYW4gZW1wdHkgc3RyaW5nIHNvIHRoYXQgaXQgZG9lc24ndCBzZXJpYWxpemUgYXMgJ251bGwnXG5cdFx0XHRcdHZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xuXG5cdFx0XHRcdGlmIChyZXN1bHQubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFtbZW5jb2RlKGtleSwgb3B0aW9ucyksIGtleVZhbHVlU2VwLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1tyZXN1bHQsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4ob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcildO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OiB7XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR2YWx1ZSA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJylcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRpb25zKSxcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQuLi5yZXN1bHQsXG5cdFx0XHRcdFx0W2VuY29kZShrZXksIG9wdGlvbnMpLCAnPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpLFxuXHRcdFx0XHRdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucykge1xuXHRsZXQgcmVzdWx0O1xuXG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvXFxbKFxcZCopXSQvLmV4ZWMoa2V5KTtcblxuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXFxkKl0kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0ge307XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldW3Jlc3VsdFsxXV0gPSB2YWx1ZTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnYnJhY2tldCc6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0cmVzdWx0ID0gLyhcXFtdKSQvLmV4ZWMoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW10kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIHZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29sb24tbGlzdC1zZXBhcmF0b3InOiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdHJlc3VsdCA9IC8oOmxpc3QpJC8uZXhlYyhrZXkpO1xuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvOmxpc3QkLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIHZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29tbWEnOlxuXHRcdGNhc2UgJ3NlcGFyYXRvcic6IHtcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0Y29uc3QgaXNBcnJheSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuaW5jbHVkZXMob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cdFx0XHRcdGNvbnN0IGlzRW5jb2RlZEFycmF5ID0gKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIWlzQXJyYXkgJiYgZGVjb2RlKHZhbHVlLCBvcHRpb25zKS5pbmNsdWRlcyhvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKSk7XG5cdFx0XHRcdHZhbHVlID0gaXNFbmNvZGVkQXJyYXkgPyBkZWNvZGUodmFsdWUsIG9wdGlvbnMpIDogdmFsdWU7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gaXNBcnJheSB8fCBpc0VuY29kZWRBcnJheSA/IHZhbHVlLnNwbGl0KG9wdGlvbnMuYXJyYXlGb3JtYXRTZXBhcmF0b3IpLm1hcChpdGVtID0+IGRlY29kZShpdGVtLCBvcHRpb25zKSkgOiAodmFsdWUgPT09IG51bGwgPyB2YWx1ZSA6IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykpO1xuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gbmV3VmFsdWU7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNhc2UgJ2JyYWNrZXQtc2VwYXJhdG9yJzoge1xuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRjb25zdCBpc0FycmF5ID0gLyhcXFtdKSQvLnRlc3Qoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW10kLywgJycpO1xuXG5cdFx0XHRcdGlmICghaXNBcnJheSkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZSA/IGRlY29kZSh2YWx1ZSwgb3B0aW9ucykgOiB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBhcnJheVZhbHVlID0gdmFsdWUgPT09IG51bGxcblx0XHRcdFx0XHQ/IFtdXG5cdFx0XHRcdFx0OiB2YWx1ZS5zcGxpdChvcHRpb25zLmFycmF5Rm9ybWF0U2VwYXJhdG9yKS5tYXAoaXRlbSA9PiBkZWNvZGUoaXRlbSwgb3B0aW9ucykpO1xuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gYXJyYXlWYWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gWy4uLmFjY3VtdWxhdG9yW2tleV0sIC4uLmFycmF5VmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRkZWZhdWx0OiB7XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFsuLi5bYWNjdW11bGF0b3Jba2V5XV0uZmxhdCgpLCB2YWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUFycmF5Rm9ybWF0U2VwYXJhdG9yKHZhbHVlKSB7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnIHx8IHZhbHVlLmxlbmd0aCAhPT0gMSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2FycmF5Rm9ybWF0U2VwYXJhdG9yIG11c3QgYmUgc2luZ2xlIGNoYXJhY3RlciBzdHJpbmcnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBlbmNvZGUodmFsdWUsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuZW5jb2RlKSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuc3RyaWN0ID8gc3RyaWN0VXJpRW5jb2RlKHZhbHVlKSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRlY29kZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5kZWNvZGUpIHtcblx0XHRyZXR1cm4gZGVjb2RlQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24ga2V5c1NvcnRlcihpbnB1dCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcblx0XHRyZXR1cm4gaW5wdXQuc29ydCgpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4ga2V5c1NvcnRlcihPYmplY3Qua2V5cyhpbnB1dCkpXG5cdFx0XHQuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEpIC0gTnVtYmVyKGIpKVxuXHRcdFx0Lm1hcChrZXkgPT4gaW5wdXRba2V5XSk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhhc2goaW5wdXQpIHtcblx0Y29uc3QgaGFzaFN0YXJ0ID0gaW5wdXQuaW5kZXhPZignIycpO1xuXHRpZiAoaGFzaFN0YXJ0ICE9PSAtMSkge1xuXHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgaGFzaFN0YXJ0KTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gZ2V0SGFzaCh1cmwpIHtcblx0bGV0IGhhc2ggPSAnJztcblx0Y29uc3QgaGFzaFN0YXJ0ID0gdXJsLmluZGV4T2YoJyMnKTtcblx0aWYgKGhhc2hTdGFydCAhPT0gLTEpIHtcblx0XHRoYXNoID0gdXJsLnNsaWNlKGhhc2hTdGFydCk7XG5cdH1cblxuXHRyZXR1cm4gaGFzaDtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5wYXJzZU51bWJlcnMgJiYgIU51bWJlci5pc05hTihOdW1iZXIodmFsdWUpKSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgIT09ICcnKSkge1xuXHRcdHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLnBhcnNlQm9vbGVhbnMgJiYgdmFsdWUgIT09IG51bGwgJiYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJyB8fCB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAnZmFsc2UnKSkge1xuXHRcdHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdChpbnB1dCkge1xuXHRpbnB1dCA9IHJlbW92ZUhhc2goaW5wdXQpO1xuXHRjb25zdCBxdWVyeVN0YXJ0ID0gaW5wdXQuaW5kZXhPZignPycpO1xuXHRpZiAocXVlcnlTdGFydCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQuc2xpY2UocXVlcnlTdGFydCArIDEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2UocXVlcnksIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IHtcblx0XHRkZWNvZGU6IHRydWUsXG5cdFx0c29ydDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnLFxuXHRcdGFycmF5Rm9ybWF0U2VwYXJhdG9yOiAnLCcsXG5cdFx0cGFyc2VOdW1iZXJzOiBmYWxzZSxcblx0XHRwYXJzZUJvb2xlYW5zOiBmYWxzZSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdHZhbGlkYXRlQXJyYXlGb3JtYXRTZXBhcmF0b3Iob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cblx0Y29uc3QgZm9ybWF0dGVyID0gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucyk7XG5cblx0Ly8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIG5vIHByb3RvdHlwZVxuXHRjb25zdCByZXR1cm5WYWx1ZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0aWYgKHR5cGVvZiBxdWVyeSAhPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gcmV0dXJuVmFsdWU7XG5cdH1cblxuXHRxdWVyeSA9IHF1ZXJ5LnRyaW0oKS5yZXBsYWNlKC9eWz8jJl0vLCAnJyk7XG5cblx0aWYgKCFxdWVyeSkge1xuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fVxuXG5cdGZvciAoY29uc3QgcGFyYW1ldGVyIG9mIHF1ZXJ5LnNwbGl0KCcmJykpIHtcblx0XHRpZiAocGFyYW1ldGVyID09PSAnJykge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGFyYW1ldGVyXyA9IG9wdGlvbnMuZGVjb2RlID8gcGFyYW1ldGVyLnJlcGxhY2UoL1xcKy9nLCAnICcpIDogcGFyYW1ldGVyO1xuXG5cdFx0bGV0IFtrZXksIHZhbHVlXSA9IHNwbGl0T25GaXJzdChwYXJhbWV0ZXJfLCAnPScpO1xuXG5cdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRrZXkgPSBwYXJhbWV0ZXJfO1xuXHRcdH1cblxuXHRcdC8vIE1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiAoWydjb21tYScsICdzZXBhcmF0b3InLCAnYnJhY2tldC1zZXBhcmF0b3InXS5pbmNsdWRlcyhvcHRpb25zLmFycmF5Rm9ybWF0KSA/IHZhbHVlIDogZGVjb2RlKHZhbHVlLCBvcHRpb25zKSk7XG5cdFx0Zm9ybWF0dGVyKGRlY29kZShrZXksIG9wdGlvbnMpLCB2YWx1ZSwgcmV0dXJuVmFsdWUpO1xuXHR9XG5cblx0Zm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocmV0dXJuVmFsdWUpKSB7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcblx0XHRcdGZvciAoY29uc3QgW2tleTIsIHZhbHVlMl0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG5cdFx0XHRcdHZhbHVlW2tleTJdID0gcGFyc2VWYWx1ZSh2YWx1ZTIsIG9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm5WYWx1ZVtrZXldID0gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc29ydCA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gcmV0dXJuVmFsdWU7XG5cdH1cblxuXHQvLyBUT0RPOiBSZW1vdmUgdGhlIHVzZSBvZiBgcmVkdWNlYC5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVuaWNvcm4vbm8tYXJyYXktcmVkdWNlXG5cdHJldHVybiAob3B0aW9ucy5zb3J0ID09PSB0cnVlID8gT2JqZWN0LmtleXMocmV0dXJuVmFsdWUpLnNvcnQoKSA6IE9iamVjdC5rZXlzKHJldHVyblZhbHVlKS5zb3J0KG9wdGlvbnMuc29ydCkpLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IHJldHVyblZhbHVlW2tleV07XG5cdFx0aWYgKEJvb2xlYW4odmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHQvLyBTb3J0IG9iamVjdCBrZXlzLCBub3QgdmFsdWVzXG5cdFx0XHRyZXN1bHRba2V5XSA9IGtleXNTb3J0ZXIodmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHRba2V5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5KG9iamVjdCwgb3B0aW9ucykge1xuXHRpZiAoIW9iamVjdCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdG9wdGlvbnMgPSB7ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnLFxuXHRcdGFycmF5Rm9ybWF0U2VwYXJhdG9yOiAnLCcsIC4uLm9wdGlvbnN9O1xuXG5cdHZhbGlkYXRlQXJyYXlGb3JtYXRTZXBhcmF0b3Iob3B0aW9ucy5hcnJheUZvcm1hdFNlcGFyYXRvcik7XG5cblx0Y29uc3Qgc2hvdWxkRmlsdGVyID0ga2V5ID0+IChcblx0XHQob3B0aW9ucy5za2lwTnVsbCAmJiBpc051bGxPclVuZGVmaW5lZChvYmplY3Rba2V5XSkpXG5cdFx0fHwgKG9wdGlvbnMuc2tpcEVtcHR5U3RyaW5nICYmIG9iamVjdFtrZXldID09PSAnJylcblx0KTtcblxuXHRjb25zdCBmb3JtYXR0ZXIgPSBlbmNvZGVyRm9yQXJyYXlGb3JtYXQob3B0aW9ucyk7XG5cblx0Y29uc3Qgb2JqZWN0Q29weSA9IHt9O1xuXG5cdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcblx0XHRpZiAoIXNob3VsZEZpbHRlcihrZXkpKSB7XG5cdFx0XHRvYmplY3RDb3B5W2tleV0gPSB2YWx1ZTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0Q29weSk7XG5cblx0aWYgKG9wdGlvbnMuc29ydCAhPT0gZmFsc2UpIHtcblx0XHRrZXlzLnNvcnQob3B0aW9ucy5zb3J0KTtcblx0fVxuXG5cdHJldHVybiBrZXlzLm1hcChrZXkgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG5cblx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0aWYgKHZhbHVlLmxlbmd0aCA9PT0gMCAmJiBvcHRpb25zLmFycmF5Rm9ybWF0ID09PSAnYnJhY2tldC1zZXBhcmF0b3InKSB7XG5cdFx0XHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRpb25zKSArICdbXSc7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YWx1ZVxuXHRcdFx0XHQucmVkdWNlKGZvcm1hdHRlcihrZXkpLCBbXSlcblx0XHRcdFx0LmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucykgKyAnPScgKyBlbmNvZGUodmFsdWUsIG9wdGlvbnMpO1xuXHR9KS5maWx0ZXIoeCA9PiB4Lmxlbmd0aCA+IDApLmpvaW4oJyYnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVXJsKHVybCwgb3B0aW9ucykge1xuXHRvcHRpb25zID0ge1xuXHRcdGRlY29kZTogdHJ1ZSxcblx0XHQuLi5vcHRpb25zLFxuXHR9O1xuXG5cdGxldCBbdXJsXywgaGFzaF0gPSBzcGxpdE9uRmlyc3QodXJsLCAnIycpO1xuXG5cdGlmICh1cmxfID09PSB1bmRlZmluZWQpIHtcblx0XHR1cmxfID0gdXJsO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR1cmw6IHVybF8/LnNwbGl0KCc/Jyk/LlswXSA/PyAnJyxcblx0XHRxdWVyeTogcGFyc2UoZXh0cmFjdCh1cmwpLCBvcHRpb25zKSxcblx0XHQuLi4ob3B0aW9ucyAmJiBvcHRpb25zLnBhcnNlRnJhZ21lbnRJZGVudGlmaWVyICYmIGhhc2ggPyB7ZnJhZ21lbnRJZGVudGlmaWVyOiBkZWNvZGUoaGFzaCwgb3B0aW9ucyl9IDoge30pLFxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5VXJsKG9iamVjdCwgb3B0aW9ucykge1xuXHRvcHRpb25zID0ge1xuXHRcdGVuY29kZTogdHJ1ZSxcblx0XHRzdHJpY3Q6IHRydWUsXG5cdFx0W2VuY29kZUZyYWdtZW50SWRlbnRpZmllcl06IHRydWUsXG5cdFx0Li4ub3B0aW9ucyxcblx0fTtcblxuXHRjb25zdCB1cmwgPSByZW1vdmVIYXNoKG9iamVjdC51cmwpLnNwbGl0KCc/JylbMF0gfHwgJyc7XG5cdGNvbnN0IHF1ZXJ5RnJvbVVybCA9IGV4dHJhY3Qob2JqZWN0LnVybCk7XG5cblx0Y29uc3QgcXVlcnkgPSB7XG5cdFx0Li4ucGFyc2UocXVlcnlGcm9tVXJsLCB7c29ydDogZmFsc2V9KSxcblx0XHQuLi5vYmplY3QucXVlcnksXG5cdH07XG5cblx0bGV0IHF1ZXJ5U3RyaW5nID0gc3RyaW5naWZ5KHF1ZXJ5LCBvcHRpb25zKTtcblx0aWYgKHF1ZXJ5U3RyaW5nKSB7XG5cdFx0cXVlcnlTdHJpbmcgPSBgPyR7cXVlcnlTdHJpbmd9YDtcblx0fVxuXG5cdGxldCBoYXNoID0gZ2V0SGFzaChvYmplY3QudXJsKTtcblx0aWYgKG9iamVjdC5mcmFnbWVudElkZW50aWZpZXIpIHtcblx0XHRjb25zdCB1cmxPYmplY3RGb3JGcmFnbWVudEVuY29kZSA9IG5ldyBVUkwodXJsKTtcblx0XHR1cmxPYmplY3RGb3JGcmFnbWVudEVuY29kZS5oYXNoID0gb2JqZWN0LmZyYWdtZW50SWRlbnRpZmllcjtcblx0XHRoYXNoID0gb3B0aW9uc1tlbmNvZGVGcmFnbWVudElkZW50aWZpZXJdID8gdXJsT2JqZWN0Rm9yRnJhZ21lbnRFbmNvZGUuaGFzaCA6IGAjJHtvYmplY3QuZnJhZ21lbnRJZGVudGlmaWVyfWA7XG5cdH1cblxuXHRyZXR1cm4gYCR7dXJsfSR7cXVlcnlTdHJpbmd9JHtoYXNofWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwaWNrKGlucHV0LCBmaWx0ZXIsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IHtcblx0XHRwYXJzZUZyYWdtZW50SWRlbnRpZmllcjogdHJ1ZSxcblx0XHRbZW5jb2RlRnJhZ21lbnRJZGVudGlmaWVyXTogZmFsc2UsXG5cdFx0Li4ub3B0aW9ucyxcblx0fTtcblxuXHRjb25zdCB7dXJsLCBxdWVyeSwgZnJhZ21lbnRJZGVudGlmaWVyfSA9IHBhcnNlVXJsKGlucHV0LCBvcHRpb25zKTtcblxuXHRyZXR1cm4gc3RyaW5naWZ5VXJsKHtcblx0XHR1cmwsXG5cdFx0cXVlcnk6IGluY2x1ZGVLZXlzKHF1ZXJ5LCBmaWx0ZXIpLFxuXHRcdGZyYWdtZW50SWRlbnRpZmllcixcblx0fSwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlKGlucHV0LCBmaWx0ZXIsIG9wdGlvbnMpIHtcblx0Y29uc3QgZXhjbHVzaW9uRmlsdGVyID0gQXJyYXkuaXNBcnJheShmaWx0ZXIpID8ga2V5ID0+ICFmaWx0ZXIuaW5jbHVkZXMoa2V5KSA6IChrZXksIHZhbHVlKSA9PiAhZmlsdGVyKGtleSwgdmFsdWUpO1xuXG5cdHJldHVybiBwaWNrKGlucHV0LCBleGNsdXNpb25GaWx0ZXIsIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IHtcbiAgaXBjTWFpbixcbiAgQnJvd3NlcldpbmRvdyxcbiAgZGlhbG9nLFxuICBzaGVsbFxufSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSAncXVlcnktc3RyaW5nJztcbi8vIGltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbmxldCBhdXRoQXBwID0gbnVsbDtcbmNvbnN0IGF1dGhQb3J0ID0gNzg5MDtcbmxldCBsYXRlc3RfdXNlcl9kYXRhID0gbnVsbDtcblxuZXhwb3J0IGNvbnN0IERhdGFIdWJTZXJ2aWNlID0ge1xuXG4gIGdldFdlYlBhZ2VBc0pzb246IChlLG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgY29uc3QgcmVxID0gaHR0cHMucmVxdWVzdChvcHRpb25zLCByZXMgPT4ge1xuICAgICAgICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAgICAgICByZXMuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgICAgICByZXMub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gY2h1bms7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvdXRwdXQpO1xuICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKG91dHB1dCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxLmVuZCgpO1xuICAgICAgfVxuICAgICk7XG4gIH0sXG5cbiAgc2VsZWN0SW1wb3J0RGVzdGluYXRpb246IGFzeW5jICgpPT57XG4gICAgY29uc3Qgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRpYWxvZy5zaG93T3BlbkRpYWxvZyh3aW5kb3csIHtcbiAgICAgIHRpdGxlOiAnU2VsZWN0IERlc3RpbmF0aW9uIG9mIEFSQyBJbXBvcnQnLFxuICAgICAgbWVzc2FnZTogJ1NlbGVjdCBEZXN0aW5hdGlvbiBvZiBBUkMgSW1wb3J0JyxcbiAgICAgIHByb3BlcnRpZXM6IFsnb3BlbkRpcmVjdG9yeSddXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5maWxlUGF0aHNbMF07XG4gIH0sXG5cbiAgZ2V0QXJjczogYXN5bmMgZT0+e1xuICAgIHJldHVybiBhd2FpdCBEYXRhSHViU2VydmljZS5nZXRXZWJQYWdlQXNKc29uKFxuICAgICAgbnVsbCxcbiAgICAgIHtcbiAgICAgICAgaG9zdDogJ2dpdC5uZmRpNHBsYW50cy5vcmcnLFxuICAgICAgICBwYXRoOiAnL2FwaS92NC9wcm9qZWN0cy8nLFxuICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICd1c2VyLWFnZW50JzogJ25vZGUuanMnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LFxuXG4gIGluc3BlY3RBcmM6IGFzeW5jIChlLHVybCk9PntcbiAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJsKTtcbiAgICAvLyB0cnkge1xuICAgIC8vICAgb3Blbih1cmwpO1xuICAgIC8vIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm47XG4gIH0sXG5cbiAgYXV0aGVudGljYXRlOiBhc3luYyAoZSxjb2RlKT0+e1xuICAgIGNvbnN0IHVybF9wYXJhbXMgPSB7XG4gICAgICByZXNwb25zZV90eXBlOiAnY29kZScsXG4gICAgICByZWRpcmVjdF91cmk6ICdodHRwOi8vbG9jYWxob3N0Ojc4OTAnLFxuICAgICAgY2xpZW50X2lkOiAnODBmNGZiZmYxM2MzYTI3NzEzODYwYjZlNzE3NTVmYjNjYmE3YWRmNjQ0Y2Y3MWE3Y2ZjYzljMWY2N2FjMzY4MCcsXG4gICAgICBzY29wZTogYG9wZW5pZCByZWFkX2FwaSBlbWFpbCBwcm9maWxlIHJlYWRfcmVwb3NpdG9yeSB3cml0ZV9yZXBvc2l0b3J5YFxuICAgIH07XG4gICAgY29uc3QgYXV0aF91cmwgPVxuICAgICAgLy8gJ2h0dHBzOi8vYXV0aC5uZmRpNHBsYW50cy5vcmcvcmVhbG1zL2RhdGFwbGFudC9wcm90b2NvbC9vcGVuaWQtY29ubmVjdC9hdXRoJ1xuICAgICAgJ2h0dHBzOi8vZ2l0Lm5mZGk0cGxhbnRzLm9yZy9vYXV0aC9hdXRob3JpemUnXG4gICAgICArJz8nXG4gICAgICArcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHVybF9wYXJhbXMpXG4gICAgO1xuICAgIHNoZWxsLm9wZW5FeHRlcm5hbChhdXRoX3VybCk7XG5cbiAgfSxcblxuICBpbml0OiBhc3luYyAoKSA9PiB7XG4gICAgaXBjTWFpbi5oYW5kbGUoJ0RhdGFIdWJTZXJ2aWNlLmdldEFyY3MnLCBEYXRhSHViU2VydmljZS5nZXRBcmNzICk7XG4gICAgaXBjTWFpbi5oYW5kbGUoJ0RhdGFIdWJTZXJ2aWNlLmluc3BlY3RBcmMnLCBEYXRhSHViU2VydmljZS5pbnNwZWN0QXJjICk7XG4gICAgaXBjTWFpbi5oYW5kbGUoJ0RhdGFIdWJTZXJ2aWNlLnNlbGVjdEltcG9ydERlc3RpbmF0aW9uJywgRGF0YUh1YlNlcnZpY2Uuc2VsZWN0SW1wb3J0RGVzdGluYXRpb24gKTtcbiAgICBpcGNNYWluLmhhbmRsZSgnRGF0YUh1YlNlcnZpY2UuYXV0aGVudGljYXRlJywgRGF0YUh1YlNlcnZpY2UuYXV0aGVudGljYXRlICk7XG5cbiAgICBhdXRoQXBwID0gZXhwcmVzcygpXG4gICAgYXV0aEFwcC5nZXQoJy8nLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHJlcS51cmwpO1xuICAgICAgaWYoIXJlcS51cmwgfHwgIXJlcS51cmwuc3RhcnRzV2l0aCgnLz9jb2RlPScpKXtcbiAgICAgICAgcmV0dXJuIHJlcy5zZW5kKCdJbnZhbGlkIFJlcXVlc3QuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvZGUgPSByZXEudXJsLnNwbGl0KCcvP2NvZGU9JylbMV07XG4gICAgICBjb25zdCBwYXJhbXMgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkoe1xuICAgICAgICBjbGllbnRfaWQ6ICc4MGY0ZmJmZjEzYzNhMjc3MTM4NjBiNmU3MTc1NWZiM2NiYTdhZGY2NDRjZjcxYTdjZmNjOWMxZjY3YWMzNjgwJyxcbiAgICAgICAgZ3JhbnRfdHlwZTogJ2F1dGhvcml6YXRpb25fY29kZScsXG4gICAgICAgIHJlZGlyZWN0X3VyaTogJ2h0dHA6Ly9sb2NhbGhvc3Q6Nzg5MCcsXG4gICAgICAgIGNvZGU6IGNvZGVcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdG9rZW5fZGF0YSA9IGF3YWl0IERhdGFIdWJTZXJ2aWNlLmdldFdlYlBhZ2VBc0pzb24oXG4gICAgICAgIG51bGwsXG4gICAgICAgIHtcbiAgICAgICAgICBob3N0OiAnZ2l0Lm5mZGk0cGxhbnRzLm9yZycsXG4gICAgICAgICAgcGF0aDogYC9vYXV0aC90b2tlbj9gICsgcGFyYW1zLFxuICAgICAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAndXNlci1hZ2VudCc6ICdub2RlLmpzJyxcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHVzZXJfZGF0YSA9IGF3YWl0IERhdGFIdWJTZXJ2aWNlLmdldFdlYlBhZ2VBc0pzb24oXG4gICAgICAgIG51bGwsXG4gICAgICAgIHtcbiAgICAgICAgICBob3N0OiAnZ2l0Lm5mZGk0cGxhbnRzLm9yZycsXG4gICAgICAgICAgcGF0aDogYC9hcGkvdjQvdXNlci8/YWNjZXNzX3Rva2VuPSR7dG9rZW5fZGF0YS5hY2Nlc3NfdG9rZW59YCxcbiAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAndXNlci1hZ2VudCc6ICdub2RlLmpzJyxcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICB1c2VyX2RhdGEudG9rZW4gPSB0b2tlbl9kYXRhO1xuICAgICAgbGF0ZXN0X3VzZXJfZGF0YSA9IHVzZXJfZGF0YTtcblxuICAgICAgcmVzLnNlbmQoJzxoMT5Mb2dpbiBhbmQgQXV0aG9yaXphdGlvbiBDb21wbGV0ZS4gWW91IGNhbiBub3cgcmV0dXJuIHRvIEFSQ2l0ZWN0LjwvaDE+Jyk7XG4gICAgICBsZXQgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpO1xuICAgICAgd2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ0RhdGFIdWJTZXJ2aWNlLmF1dGhlbnRpZmljYXRpb25EYXRhJywgdXNlcl9kYXRhKTtcbiAgICB9KTtcbiAgICBhdXRoQXBwLmxpc3RlbihhdXRoUG9ydCwgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coYEF1dGhlbnRpZmljYXRpb24gc2VydmljZSBsaXN0ZW5pbmcgb24gcG9ydCAke2F1dGhQb3J0fWApO1xuICAgIH0pO1xuICB9XG5cbn07XG4iLCJpbXBvcnQge1xuICBpcGNNYWluLFxuICBCcm93c2VyV2luZG93XG59IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB7XG4gIHNwYXduXG59IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5leHBvcnQgY29uc3QgQXJjQ29tbWFuZGVyU2VydmljZSA9IHtcblxuICBydW46IChlLG9wdGlvbnMpID0+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgYXJncyA9IHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyA/IFtvcHRpb25zXSA6IG9wdGlvbnMuYXJncztcbiAgICAgIGNvbnN0IG8gPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgPyB7fSA6IG9wdGlvbnM7XG5cbiAgICAgIGxldCB3aW5kb3cgPSBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5maW5kKHcgPT4gIXcuaXNEZXN0cm95ZWQoKSk7XG4gICAgICBjb25zdCBwID0gc3Bhd24oJ2FyYycsIGFyZ3MsIG8pO1xuICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgICBwLnN0ZG91dC5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICBjb25zdCBkYXRhQXNTdHJpbmcgPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgIG91dHB1dCArPSBkYXRhQXNTdHJpbmc7XG4gICAgICAgIGlmKGRhdGFBc1N0cmluZy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdlcnJvcicpKVxuICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgd2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ0FyY0NvbW1hbmRlclNlcnZpY2UuTVNHJywgZGF0YUFzU3RyaW5nKTtcbiAgICAgIH0pO1xuXG4gICAgICBwLnN0ZGVyci5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgIGNvbnN0IGRhdGFBc1N0cmluZyA9IGRhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgb3V0cHV0ICs9IGRhdGFBc1N0cmluZztcbiAgICAgICAgY29uc29sZS5lcnJvcignZScsZGF0YUFzU3RyaW5nKTtcbiAgICAgICAgd2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ0FyY0NvbW1hbmRlclNlcnZpY2UuTVNHJywgZGF0YUFzU3RyaW5nKTtcbiAgICAgIH0pO1xuXG4gICAgICBwLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICByZXNvbHZlKFtmYWxzZSxlcnIudG9TdHJpbmcoKV0pO1xuICAgICAgfSk7XG5cbiAgICAgIHAub24oJ2V4aXQnLCBjb2RlID0+IHtcbiAgICAgICAgcmVzb2x2ZShbY29kZT09PTAgJiYgIWVycm9yLG91dHB1dF0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gY29uc29sZS5sb2coY21kLG8pO1xuICAgIC8vIHRyeSB7XG4gICAgLy8gICBjb25zdCB0ZXN0ID0gZXhlY1N5bmMoYGFyYyAke2NtZH1gLCBvKS50b1N0cmluZygpO1xuICAgIC8vICAgcmV0dXJuIFt0cnVlLHRlc3RdO1xuICAgIC8vIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgLy8gICByZXR1cm4gW2ZhbHNlLGVdO1xuICAgIC8vIH1cbiAgfSxcblxuICAvLyBpc1JlYWR5OiBhc3luYyAoKT0+e1xuICAvLyAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IEFyY0NvbW1hbmRlclNlcnZpY2UucnVuKCctLXZlcnNpb24nKTtcbiAgLy8gICByZXR1cm4gc3RhdHVzWzBdO1xuICAvLyB9LFxuXG4gIC8vIGdldEFyYzogYXN5bmMgZGF0YT0+e1xuICAvLyAgIC8vIGNvbnN0IHN0YXR1cyA9IGF3YWl0IEFyY0NvbW1hbmRlclNlcnZpY2UucnVuKCctLXZlcnNpb24nKTtcbiAgLy8gICAvLyByZXR1cm4gc3RhdHVzWzBdO1xuICAvLyB9LFxuXG4gIGluaXQ6IGFzeW5jICgpID0+IHtcbiAgICAvLyBpcGNNYWluLmhhbmRsZSgnQXJjQ29tbWFuZGVyU2VydmljZS5pc1JlYWR5JywgQXJjQ29tbWFuZGVyU2VydmljZS5pc1JlYWR5ICk7XG4gICAgaXBjTWFpbi5oYW5kbGUoJ0FyY0NvbW1hbmRlclNlcnZpY2UucnVuJywgQXJjQ29tbWFuZGVyU2VydmljZS5ydW4gKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIGlwY01haW4sXG4gIHNoZWxsXG59IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcblxubGV0IHJlcSA9IG51bGw7XG5cbmV4cG9ydCBjb25zdCBJbnRlcm5ldFNlcnZpY2UgPSB7XG5cbiAgY2FsbFN3YXRlQVBJOiAoZXZlbnQsIGRhdGEpPT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgaG9zdDogJ3N3YXRlLm5mZGk0cGxhbnRzLm9yZycsXG4gICAgICAgICAgcG9ydDogNDQzLFxuICAgICAgICAgIHBhdGg6IGAvYXBpL0lPbnRvbG9neUFQSXYyLyR7ZGF0YS5tZXRob2R9YCxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnYWNjZXB0JzogICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICd1c2VyLWFnZW50JzogICAnbm9kZS5qcydcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYocmVxKVxuICAgICAgICAgIHJlcS5kZXN0cm95KCk7XG5cbiAgICAgICAgcmVxID0gaHR0cHMucmVxdWVzdChvcHRpb25zLCByZXMgPT4ge1xuICAgICAgICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAgICAgICByZXMuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgICAgICByZXMub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gY2h1bms7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2Uob3V0cHV0KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICByZXNvbHZlKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEud3JpdGUoZGF0YS5wYXlsb2FkKTtcbiAgICAgICAgcmVxLmVuZCgpO1xuICAgICAgfVxuICAgICk7XG4gIH0sXG5cbiAgb3BlbkV4dGVybmFsVVJMOiBhc3luYyAoZSx1cmwpPT57XG4gICAgc2hlbGwub3BlbkV4dGVybmFsKHVybCk7XG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIGluaXQ6IGFzeW5jICgpID0+IHtcbiAgICBpcGNNYWluLmhhbmRsZSgnSW50ZXJuZXRTZXJ2aWNlLm9wZW5FeHRlcm5hbFVSTCcsIEludGVybmV0U2VydmljZS5vcGVuRXh0ZXJuYWxVUkwgKTtcbiAgICBpcGNNYWluLmhhbmRsZSgnSW50ZXJuZXRTZXJ2aWNlLmNhbGxTd2F0ZUFQSScsIEludGVybmV0U2VydmljZS5jYWxsU3dhdGVBUEkgKTtcbiAgfVxuXG59O1xuIiwiaW1wb3J0IHthcHB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCAnLi9zZWN1cml0eS1yZXN0cmljdGlvbnMnO1xuaW1wb3J0IHtyZXN0b3JlT3JDcmVhdGVXaW5kb3d9IGZyb20gJy9AL21haW5XaW5kb3cnO1xuaW1wb3J0IHtMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlfSBmcm9tICcvQC9Mb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlJztcbmltcG9ydCB7RGF0YUh1YlNlcnZpY2V9IGZyb20gJy9AL0RhdGFIdWJTZXJ2aWNlJztcbmltcG9ydCB7QXJjQ29tbWFuZGVyU2VydmljZX0gZnJvbSAnL0AvQXJjQ29tbWFuZGVyU2VydmljZSc7XG5pbXBvcnQge0ludGVybmV0U2VydmljZX0gZnJvbSAnL0AvSW50ZXJuZXRTZXJ2aWNlJztcblxuLyoqXG4gKiBQcmV2ZW50IG11bHRpcGxlIGluc3RhbmNlc1xuICovXG5jb25zdCBpc1NpbmdsZUluc3RhbmNlID0gYXBwLnJlcXVlc3RTaW5nbGVJbnN0YW5jZUxvY2soKTtcbmlmICghaXNTaW5nbGVJbnN0YW5jZSkge1xuICBhcHAucXVpdCgpO1xuICBwcm9jZXNzLmV4aXQoMCk7XG59XG5hcHAub24oJ3NlY29uZC1pbnN0YW5jZScsIHJlc3RvcmVPckNyZWF0ZVdpbmRvdyk7XG5cblxuLyoqXG4gKiBEaXNhYmxlIEhhcmR3YXJlIEFjY2VsZXJhdGlvbiBmb3IgbW9yZSBwb3dlci1zYXZlXG4gKi9cbmFwcC5kaXNhYmxlSGFyZHdhcmVBY2NlbGVyYXRpb24oKTtcblxuLyoqXG4gKiBTaG91dCBkb3duIGJhY2tncm91bmQgcHJvY2VzcyBpZiBhbGwgd2luZG93cyB3YXMgY2xvc2VkXG4gKi9cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn0pO1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy92MTQteC15L2FwaS9hcHAjZXZlbnQtYWN0aXZhdGUtbWFjb3MgRXZlbnQ6ICdhY3RpdmF0ZSdcbiAqL1xuYXBwLm9uKCdhY3RpdmF0ZScsIHJlc3RvcmVPckNyZWF0ZVdpbmRvdyk7XG5cblxuLyoqXG4gKiBDcmVhdGUgYXBwIHdpbmRvdyB3aGVuIGJhY2tncm91bmQgcHJvY2VzcyB3aWxsIGJlIHJlYWR5XG4gKi9cbmFwcC53aGVuUmVhZHkoKVxuICAudGhlbihEYXRhSHViU2VydmljZS5pbml0KVxuICAudGhlbihMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLmluaXQpXG4gIC50aGVuKEFyY0NvbW1hbmRlclNlcnZpY2UuaW5pdClcbiAgLnRoZW4oSW50ZXJuZXRTZXJ2aWNlLmluaXQpXG4gIC50aGVuKHJlc3RvcmVPckNyZWF0ZVdpbmRvdylcbiAgLmNhdGNoKChlKSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgY3JlYXRlIHdpbmRvdzonLCBlKSk7XG5cblxuLyoqXG4gKiBJbnN0YWxsIFZ1ZS5qcyBvciBzb21lIG90aGVyIGRldnRvb2xzIGluIGRldmVsb3BtZW50IG1vZGUgb25seVxuICovXG5pZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICBhcHAud2hlblJlYWR5KClcbiAgICAudGhlbigoKSA9PiBpbXBvcnQoJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcicpKVxuICAgIC50aGVuKCh7ZGVmYXVsdDogaW5zdGFsbEV4dGVuc2lvbiwgVlVFSlMzX0RFVlRPT0xTfSkgPT4gaW5zdGFsbEV4dGVuc2lvbihWVUVKUzNfREVWVE9PTFMsIHtcbiAgICAgIGxvYWRFeHRlbnNpb25PcHRpb25zOiB7XG4gICAgICAgIGFsbG93RmlsZUFjY2VzczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSkpXG4gICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcignRmFpbGVkIGluc3RhbGwgZXh0ZW5zaW9uOicsIGUpKTtcbn1cbiJdLCJuYW1lcyI6WyJVUkwiLCJhcHAiLCJ1cmwiLCJzaGVsbCIsIkJyb3dzZXJXaW5kb3ciLCJqb2luIiwid2luZG93IiwiTWVudSIsImNvbnN0YW50cyIsInJlcXVpcmUkJDAiLCJwb2x5ZmlsbHMiLCJwYXRjaCIsImZzIiwicGF0aCIsInJlbmFtZSIsImJ1ZmZlciIsImVyciIsImVycjIiLCJlciIsImVyMiIsImxlZ2FjeSIsInNlbGYiLCJjbG9uZSIsImNvcHkiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJ1dGlsIiwicmVxdWlyZSQkNCIsInF1ZXVlIiwiZ2xvYmFsIiwiY2xvc2UiLCJyZXF1aXJlJCQ1IiwicmVhZEZpbGUiLCJvcHRpb25zIiwiY2IiLCJ3cml0ZUZpbGUiLCJkYXRhIiwiY29weUZpbGUiLCJzcmMiLCJkZXN0IiwiZmxhZ3MiLCJyZWFkZGlyIiwiZ28kcmVhZGRpciIsIm9wZW4iLCJtb2RlIiwidSIsImludmFsaWRXaW4zMlBhdGgiLCJvNzc3IiwibWtkaXJzIiwibWFkZSIsInN0YXQiLCJta2RpcnNfMSIsIm1rZGlyc1N5bmMiLCJ1dGltZXMiLCJnZXRTdGF0cyIsIm1rZGlycFN5bmMiLCJjb3B5U3luYyIsInN0YXJ0Q29weSIsIm9uRGlyIiwib25GaWxlIiwib25MaW5rIiwibWF5Q29weUZpbGUiLCJjb3B5RmlsZUZhbGxiYWNrIiwibWtEaXJBbmRDb3B5IiwiY29weURpciIsImNvcHlEaXJJdGVtIiwiY29weUxpbmsiLCJwYXRoRXhpc3RzIiwibWtkaXJwIiwiaXNXaW5kb3dzIiwicmltcmFmIiwicmVtb3ZlIiwibWtkaXIiLCJlbXB0eURpciIsImZpbGUiLCJzcmNwYXRoIiwiZHN0cGF0aCIsImxpbmsiLCJzeW1saW5rUGF0aHMiLCJzeW1saW5rUGF0aHNTeW5jIiwic3ltbGlua1R5cGUiLCJzeW1saW5rVHlwZVN5bmMiLCJyZXF1aXJlJCQ2IiwidHlwZSIsInN5bWxpbmsiLCJzdHJpbmdpZnkiLCJqc29uZmlsZSIsImpzb25GaWxlIiwibW92ZVN5bmMiLCJkb1JlbmFtZSIsIm1vdmVBY3Jvc3NEZXZpY2UiLCJtb3ZlIiwicmVxdWlyZSQkNyIsInJlcXVpcmUkJDgiLCJyZXF1aXJlJCQ5IiwicmVxdWlyZSQkMTAiLCJyZXF1aXJlJCQxMSIsInJlcXVpcmUkJDEyIiwiU1RBUiIsIlBPU0lYX1JFR0VYX1NPVVJDRSIsImNoYXJzIiwid2luMzIiLCJvdXRwdXQiLCJhcHBlbmQiLCJ1dGlscyIsIkNIQVJfQ09NTUEiLCJDSEFSX0RPVCIsIkNIQVJfTEVGVF9DVVJMWV9CUkFDRSIsIkNIQVJfTEVGVF9QQVJFTlRIRVNFUyIsIkNIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCIsIkNIQVJfUklHSFRfQ1VSTFlfQlJBQ0UiLCJDSEFSX1JJR0hUX1BBUkVOVEhFU0VTIiwiQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVCIsInRva2VuIiwic2NhbiIsImlzR2xvYiIsImlzRXh0Z2xvYiIsImJyYWNlcyIsIk1BWF9MRU5HVEgiLCJwYXJzZSIsIkRPVF9MSVRFUkFMIiwiUExVU19MSVRFUkFMIiwiU0xBU0hfTElURVJBTCIsIk9ORV9DSEFSIiwiRE9UU19TTEFTSCIsIk5PX0RPVCIsIk5PX0RPVF9TTEFTSCIsIk5PX0RPVFNfU0xBU0giLCJRTUFSSyIsIlFNQVJLX05PX0RPVCIsIlNUQVJUX0FOQ0hPUiIsIm9wdHMiLCJ2YWx1ZSIsInJlc3QiLCJlc2NhcGVkIiwiTk9fRE9UUyIsInNvdXJjZSIsInBhcnNlXzEiLCJpc09iamVjdCIsInBpY29tYXRjaCIsInN0YXRlIiwic3lzUGF0aCIsInByb21pc2lmeSIsImxzdGF0IiwicmVhbHBhdGgiLCJCQU5HIiwiZGVwdGgiLCJyZWFkZGlycCIsIm5vcm1hbGl6ZVBhdGgiLCJhbnltYXRjaF8xIiwiYXJyaWZ5IiwiYW55bWF0Y2giLCJ0ZXN0U3RyaW5nIiwicmV0dXJuSW5kZXgiLCJhbnltYXRjaE1vZHVsZSIsImdsb2JQYXJlbnQiLCJub2RlIiwiaXNOdW1iZXIiLCJ0b1JlZ2V4UmFuZ2UiLCJ6ZXJvcyIsIm1heCIsImZpbGwiLCJjb21waWxlIiwiZXhwYW5kIiwiaW5kZXgiLCJiaW5hcnlFeHRlbnNpb25zIiwiaXNCaW5hcnlQYXRoIiwicGxhdGZvcm0iLCJFTVBUWV9GTiIsIkVNUFRZX1NUUiIsIkVWX0NIQU5HRSIsIkVWX0FERCIsIkVWX0FERF9ESVIiLCJFVl9FUlJPUiIsIlNUUl9EQVRBIiwiU1RSX0VORCIsIkJSQUNFX1NUQVJUIiwic3RhdE1ldGhvZHMiLCJyYXdFbWl0dGVyIiwibGlzdGVuZXIiLCJOb2RlRnNIYW5kbGVyIiwibmV3U3RhdHMiLCJzdGF0cyIsIkVWX1VOTElOSyIsIkZVTkNUSU9OX1RZUEUiLCJGc0V2ZW50c0hhbmRsZXIiLCJ0cmFuc2Zvcm0iLCJmc2V2ZW50c0hhbmRsZXJNb2R1bGUiLCJmc2V2ZW50c0hhbmRsZXIiLCJjd2QiLCJub3ciLCJGUyIsIlBBVEgiLCJkaWFsb2ciLCJpcGNNYWluIiwiZGVjb2RlIiwiZGVjb2RlQ29tcG9uZW50IiwicXVlcnlTdHJpbmciLCJyZXEiLCJodHRwcyIsInF1ZXJ5c3RyaW5nIiwic3Bhd24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLE1BQU0sa0NBQWtDLG9CQUFJO0FBQUEsRUFFdEMsQ0FBQyxDQUFDLElBQUlBLElBQUFBLElBQUksd0JBQW1DLEVBQUUsNEJBQVksSUFBRyxDQUFBLENBQUM7QUFFckU7QUFZQSxNQUFNLCtDQUErQixJQUF5QjtBQUFBLEVBQzVEO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsQ0FBQztBQUdEQyxTQUFBLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxHQUFHLGFBQWE7QUFVOUMsV0FBUyxHQUFHLGlCQUFpQixDQUFDLE9BQU9DLFVBQVE7QUFDMUIsUUFBSUYsSUFBQUEsSUFBSUUsS0FBRztBQUFBLEVBQUEsQ0FXN0I7QUFTRCxXQUFTLFFBQVEsNEJBQTRCLENBQUMsYUFBYSxZQUFZLGFBQWE7O0FBQ2xGLFVBQU0sRUFBQyxPQUFNLElBQUksSUFBSUYsSUFBSSxJQUFBLFlBQVksUUFBUTtBQUV2QyxVQUFBLG9CQUFvQixDQUFDLEdBQUMscUNBQWdDLElBQUksTUFBTSxNQUExQyxtQkFBNkMsSUFBSTtBQUM3RSxhQUFTLGlCQUFpQjtBQUUxQixRQUFJLENBQUMscUJBQXFCLE1BQXFCO0FBQ3JDLGNBQUEsS0FBSyxHQUFHLG9DQUFvQywrQkFBK0I7QUFBQSxJQUNyRjtBQUFBLEVBQUEsQ0FDRDtBQWFELFdBQVMscUJBQXFCLENBQUMsRUFBQ0UsS0FBQUEsWUFBUztBQUN2QyxVQUFNLEVBQUMsT0FBVSxJQUFBLElBQUlGLFFBQUlFLEtBQUc7QUFHeEIsUUFBQSx5QkFBeUIsSUFBSSxNQUFNLEdBQUc7QUFFeENDLGVBQUEsTUFBTSxhQUFhRCxLQUFHLEVBQUUsTUFBTSxRQUFRLEtBQUs7QUFBQSxJQUFBLE9BRWI7QUFDdEIsY0FBQSxLQUFLLCtDQUErQyxNQUFNO0FBQUEsSUFDcEU7QUFHTyxXQUFBLEVBQUMsUUFBUTtFQUFNLENBQ3ZCO0FBVUQsV0FBUyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sZ0JBQWdCLFdBQVc7QUFDcEUsVUFBTSxFQUFDLE9BQU0sSUFBSSxJQUFJRixJQUFBLElBQUksT0FBTyxHQUFHO0FBQ25DLFFBQUksQ0FBQyx5QkFBeUIsSUFBSSxNQUFNLEdBQUc7QUFFaEI7QUFDZixnQkFBQSxLQUFLLDZCQUE2QixPQUFPLHVCQUF1QjtBQUFBLE1BQzFFO0FBRUEsWUFBTSxlQUFlO0FBQ3JCO0FBQUEsSUFDRjtBQUdBLFdBQU8sZUFBZTtBQUV0QixXQUFPLGVBQWU7QUFHdEIsbUJBQWUsa0JBQWtCO0FBQUEsRUFBQSxDQUNsQztBQUNILENBQUM7QUM1SEQsZUFBZSxlQUFlO0FBQ3RCLFFBQUEsYUFBYSxJQUFJSSx1QkFBYztBQUFBLElBQ25DLE1BQU07QUFBQSxJQUNOLGdCQUFnQjtBQUFBLE1BQ2Qsa0JBQWtCO0FBQUEsTUFDbEIsWUFBWTtBQUFBLE1BQ1osU0FBU0MsV0FBQUEsS0FBSyxXQUFXLDhCQUE4QjtBQUFBLElBQ3pEO0FBQUEsSUFDQSxPQUFNO0FBQUEsSUFDTixRQUFPO0FBQUEsRUFBQSxDQUNSO0FBUVUsYUFBQSxHQUFHLGlCQUFpQixNQUFNO0FBQ25DLDZDQUFZO0FBQUEsRUFBSyxDQUtsQjtBQU9ELFFBQU0sVUFDRjtBQUlFLFFBQUEsV0FBVyxRQUFRLE9BQU87QUFHekIsU0FBQTtBQUNUO0FBT0EsZUFBc0Isd0JBQXdCO0FBQ3hDLE1BQUFDLFVBQVNGLHVCQUFjLGdCQUFnQixLQUFLLENBQUssTUFBQSxDQUFDLEVBQUUsWUFBQSxDQUFhO0FBRXJFLFFBQU0sV0FBVztBQUFBLElBQ2Y7QUFBQSxNQUNFLE9BQU87QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLEVBQUUsTUFBTSxPQUFPO0FBQUEsUUFDZixFQUFFLE1BQU0sU0FBUztBQUFBLFFBQ2pCLEVBQUUsTUFBTSxjQUFjO0FBQUEsUUFDdEIsRUFBRSxNQUFNLFlBQVk7QUFBQSxRQUNwQixFQUFFLE1BQU0saUJBQWlCO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLE9BQU8sWUFBWTtBQUNqQkQsMkJBQU0sYUFBYSx3RkFBd0Y7QUFBQSxVQUM3RztBQUFBLFFBQ0Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxPQUFPLFlBQVk7QUFDakJBLDJCQUFNLGFBQWEsa0NBQWtDO0FBQUEsVUFDdkQ7QUFBQSxRQUNGO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTztBQUFBLFVBQ1AsT0FBTyxZQUFZO0FBQ2pCQSwyQkFBTSxhQUFhLDhEQUE4RDtBQUFBLFVBQ25GO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFBQTtBQUVJLFFBQUEsT0FBT0ksU0FBQUEsS0FBSyxrQkFBa0IsUUFBUTtBQUM1Q0EsZ0JBQUssbUJBQW1CLElBQUk7QUFFNUIsTUFBSUQsWUFBVyxRQUFXO0FBQ3hCLElBQUFBLFVBQVMsTUFBTTtFQUNqQjtBQUVJLE1BQUFBLFFBQU8sZUFBZTtBQUN4QixJQUFBQSxRQUFPLFFBQVE7QUFBQSxFQUNqQjtBQUVBLEVBQUFBLFFBQU8sTUFBTTtBQUNmOzs7OztBQ3BHb0IsYUFBQSxlQUFHLFNBQVUsSUFBSTtBQUNuQyxTQUFPLE9BQU8sZUFBZSxXQUFZO0FBQ3ZDLFFBQUksT0FBTyxVQUFVLFVBQVUsU0FBUyxPQUFPO0FBQVksU0FBRyxNQUFNLE1BQU0sU0FBUztBQUFBLFNBQzlFO0FBQ0gsYUFBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDdEMsa0JBQVUsVUFBVSxVQUFVLENBQUMsS0FBSyxRQUFRO0FBQzFDLGNBQUk7QUFBSyxtQkFBTyxPQUFPLEdBQUc7QUFDMUIsa0JBQVEsR0FBRztBQUFBLFFBQ1o7QUFDRCxrQkFBVTtBQUNWLFdBQUcsTUFBTSxNQUFNLFNBQVM7QUFBQSxNQUNoQyxDQUFPO0FBQUEsSUFDRjtBQUFBLEVBQ0YsR0FBRSxRQUFRLEVBQUUsT0FBTyxHQUFHLEtBQUksQ0FBRTtBQUMvQjtBQUVtQixhQUFBLGNBQUcsU0FBVSxJQUFJO0FBQ2xDLFNBQU8sT0FBTyxlQUFlLFdBQVk7QUFDdkMsVUFBTSxLQUFLLFVBQVUsVUFBVSxTQUFTO0FBQ3hDLFFBQUksT0FBTyxPQUFPO0FBQVksYUFBTyxHQUFHLE1BQU0sTUFBTSxTQUFTO0FBQUE7QUFDeEQsU0FBRyxNQUFNLE1BQU0sU0FBUyxFQUFFLEtBQUssT0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUU7QUFBQSxFQUN6RCxHQUFFLFFBQVEsRUFBRSxPQUFPLEdBQUcsS0FBSSxDQUFFO0FBQy9CO0FDeEJBLElBQUlFLGNBQVlDLG9CQUFvQjtBQUVwQyxJQUFJLFVBQVUsUUFBUTtBQUN0QixJQUFJLE1BQU07QUFFVixJQUFJLFdBQVcsQ0FBQSxFQUFZLHdCQUF3QixRQUFRO0FBRTNELFFBQVEsTUFBTSxXQUFXO0FBQ3ZCLE1BQUksQ0FBQztBQUNILFVBQU0sUUFBUSxLQUFLLE9BQU87QUFDNUIsU0FBTztBQUNUO0FBQ0EsSUFBSTtBQUNGLFVBQVEsSUFBSztBQUNmLFNBQVMsSUFBUDtBQUFhO0FBR2YsSUFBSSxPQUFPLFFBQVEsVUFBVSxZQUFZO0FBQ3ZDLE1BQUksUUFBUSxRQUFRO0FBQ3BCLFVBQVEsUUFBUSxTQUFVLEdBQUc7QUFDM0IsVUFBTTtBQUNOLFVBQU0sS0FBSyxTQUFTLENBQUM7QUFBQSxFQUN0QjtBQUNELE1BQUksT0FBTztBQUFnQixXQUFPLGVBQWUsUUFBUSxPQUFPLEtBQUs7QUFDdkU7QUFFQSxJQUFBQyxjQUFpQkM7QUFFakIsU0FBU0EsUUFBT0MsS0FBSTtBQUtsQixNQUFJSixZQUFVLGVBQWUsV0FBVyxLQUNwQyxRQUFRLFFBQVEsTUFBTSx3QkFBd0IsR0FBRztBQUNuRCxnQkFBWUksR0FBRTtBQUFBLEVBQ2Y7QUFHRCxNQUFJLENBQUNBLElBQUcsU0FBUztBQUNmLGlCQUFhQSxHQUFFO0FBQUEsRUFDaEI7QUFPRCxFQUFBQSxJQUFHLFFBQVEsU0FBU0EsSUFBRyxLQUFLO0FBQzVCLEVBQUFBLElBQUcsU0FBUyxTQUFTQSxJQUFHLE1BQU07QUFDOUIsRUFBQUEsSUFBRyxTQUFTLFNBQVNBLElBQUcsTUFBTTtBQUU5QixFQUFBQSxJQUFHLFFBQVEsU0FBU0EsSUFBRyxLQUFLO0FBQzVCLEVBQUFBLElBQUcsU0FBUyxTQUFTQSxJQUFHLE1BQU07QUFDOUIsRUFBQUEsSUFBRyxTQUFTLFNBQVNBLElBQUcsTUFBTTtBQUU5QixFQUFBQSxJQUFHLFlBQVksYUFBYUEsSUFBRyxTQUFTO0FBQ3hDLEVBQUFBLElBQUcsYUFBYSxhQUFhQSxJQUFHLFVBQVU7QUFDMUMsRUFBQUEsSUFBRyxhQUFhLGFBQWFBLElBQUcsVUFBVTtBQUUxQyxFQUFBQSxJQUFHLFlBQVksYUFBYUEsSUFBRyxTQUFTO0FBQ3hDLEVBQUFBLElBQUcsYUFBYSxhQUFhQSxJQUFHLFVBQVU7QUFDMUMsRUFBQUEsSUFBRyxhQUFhLGFBQWFBLElBQUcsVUFBVTtBQUUxQyxFQUFBQSxJQUFHLE9BQU8sUUFBUUEsSUFBRyxJQUFJO0FBQ3pCLEVBQUFBLElBQUcsUUFBUSxRQUFRQSxJQUFHLEtBQUs7QUFDM0IsRUFBQUEsSUFBRyxRQUFRLFFBQVFBLElBQUcsS0FBSztBQUUzQixFQUFBQSxJQUFHLFdBQVcsWUFBWUEsSUFBRyxRQUFRO0FBQ3JDLEVBQUFBLElBQUcsWUFBWSxZQUFZQSxJQUFHLFNBQVM7QUFDdkMsRUFBQUEsSUFBRyxZQUFZLFlBQVlBLElBQUcsU0FBUztBQUd2QyxNQUFJQSxJQUFHLFNBQVMsQ0FBQ0EsSUFBRyxRQUFRO0FBQzFCLElBQUFBLElBQUcsU0FBUyxTQUFVQyxPQUFNLE1BQU0sSUFBSTtBQUNwQyxVQUFJO0FBQUksZ0JBQVEsU0FBUyxFQUFFO0FBQUEsSUFDNUI7QUFDRCxJQUFBRCxJQUFHLGFBQWEsV0FBWTtBQUFBLElBQUU7QUFBQSxFQUMvQjtBQUNELE1BQUlBLElBQUcsU0FBUyxDQUFDQSxJQUFHLFFBQVE7QUFDMUIsSUFBQUEsSUFBRyxTQUFTLFNBQVVDLE9BQU0sS0FBSyxLQUFLLElBQUk7QUFDeEMsVUFBSTtBQUFJLGdCQUFRLFNBQVMsRUFBRTtBQUFBLElBQzVCO0FBQ0QsSUFBQUQsSUFBRyxhQUFhLFdBQVk7QUFBQSxJQUFFO0FBQUEsRUFDL0I7QUFXRCxNQUFJLGFBQWEsU0FBUztBQUN4QixJQUFBQSxJQUFHLFNBQVMsT0FBT0EsSUFBRyxXQUFXLGFBQWFBLElBQUcsU0FDOUMsU0FBVSxXQUFXO0FBQ3RCLGVBQVNFLFFBQVEsTUFBTSxJQUFJLElBQUk7QUFDN0IsWUFBSSxRQUFRLEtBQUssSUFBSztBQUN0QixZQUFJLFVBQVU7QUFDZCxrQkFBVSxNQUFNLElBQUksU0FBUyxHQUFJLElBQUk7QUFDbkMsY0FBSSxPQUNJLEdBQUcsU0FBUyxZQUFZLEdBQUcsU0FBUyxZQUNyQyxLQUFLLElBQUcsSUFBSyxRQUFRLEtBQU87QUFDakMsdUJBQVcsV0FBVztBQUNwQixjQUFBRixJQUFHLEtBQUssSUFBSSxTQUFVLFFBQVEsSUFBSTtBQUNoQyxvQkFBSSxVQUFVLE9BQU8sU0FBUztBQUM1Qiw0QkFBVSxNQUFNLElBQUksRUFBRTtBQUFBO0FBRXRCLHFCQUFHLEVBQUU7QUFBQSxjQUN2QixDQUFlO0FBQUEsWUFDRixHQUFFLE9BQU87QUFDVixnQkFBSSxVQUFVO0FBQ1oseUJBQVc7QUFDYjtBQUFBLFVBQ0Q7QUFDRCxjQUFJO0FBQUksZUFBRyxFQUFFO0FBQUEsUUFDdkIsQ0FBUztBQUFBLE1BQ0Y7QUFDRCxVQUFJLE9BQU87QUFBZ0IsZUFBTyxlQUFlRSxTQUFRLFNBQVM7QUFDbEUsYUFBT0E7QUFBQSxJQUNiLEVBQU9GLElBQUcsTUFBTTtBQUFBLEVBQ2I7QUFHRCxFQUFBQSxJQUFHLE9BQU8sT0FBT0EsSUFBRyxTQUFTLGFBQWFBLElBQUcsT0FDMUMsU0FBVSxTQUFTO0FBQ3BCLGFBQVMsS0FBTSxJQUFJRyxTQUFRLFFBQVEsUUFBUSxVQUFVLFdBQVc7QUFDOUQsVUFBSTtBQUNKLFVBQUksYUFBYSxPQUFPLGNBQWMsWUFBWTtBQUNoRCxZQUFJLGFBQWE7QUFDakIsbUJBQVcsU0FBVSxJQUFJLEdBQUcsSUFBSTtBQUM5QixjQUFJLE1BQU0sR0FBRyxTQUFTLFlBQVksYUFBYSxJQUFJO0FBQ2pEO0FBQ0EsbUJBQU8sUUFBUSxLQUFLSCxLQUFJLElBQUlHLFNBQVEsUUFBUSxRQUFRLFVBQVUsUUFBUTtBQUFBLFVBQ3ZFO0FBQ0Qsb0JBQVUsTUFBTSxNQUFNLFNBQVM7QUFBQSxRQUNoQztBQUFBLE1BQ0Y7QUFDRCxhQUFPLFFBQVEsS0FBS0gsS0FBSSxJQUFJRyxTQUFRLFFBQVEsUUFBUSxVQUFVLFFBQVE7QUFBQSxJQUN2RTtBQUdELFFBQUksT0FBTztBQUFnQixhQUFPLGVBQWUsTUFBTSxPQUFPO0FBQzlELFdBQU87QUFBQSxFQUNYLEVBQUtILElBQUcsSUFBSTtBQUVWLEVBQUFBLElBQUcsV0FBVyxPQUFPQSxJQUFHLGFBQWEsYUFBYUEsSUFBRyxXQUNsRCxTQUFVLGFBQWE7QUFBRSxXQUFPLFNBQVUsSUFBSUcsU0FBUSxRQUFRLFFBQVEsVUFBVTtBQUNqRixVQUFJLGFBQWE7QUFDakIsYUFBTyxNQUFNO0FBQ1gsWUFBSTtBQUNGLGlCQUFPLFlBQVksS0FBS0gsS0FBSSxJQUFJRyxTQUFRLFFBQVEsUUFBUSxRQUFRO0FBQUEsUUFDakUsU0FBUSxJQUFQO0FBQ0EsY0FBSSxHQUFHLFNBQVMsWUFBWSxhQUFhLElBQUk7QUFDM0M7QUFDQTtBQUFBLFVBQ0Q7QUFDRCxnQkFBTTtBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDTDtBQUFBLEVBQUcsRUFBR0gsSUFBRyxRQUFRO0FBRWYsV0FBUyxZQUFhQSxLQUFJO0FBQ3hCLElBQUFBLElBQUcsU0FBUyxTQUFVQyxPQUFNLE1BQU0sVUFBVTtBQUMxQyxNQUFBRCxJQUFHO0FBQUEsUUFBTUM7QUFBQSxRQUNBTCxZQUFVLFdBQVdBLFlBQVU7QUFBQSxRQUMvQjtBQUFBLFFBQ0EsU0FBVSxLQUFLLElBQUk7QUFDMUIsY0FBSSxLQUFLO0FBQ1AsZ0JBQUk7QUFBVSx1QkFBUyxHQUFHO0FBQzFCO0FBQUEsVUFDRDtBQUdELFVBQUFJLElBQUcsT0FBTyxJQUFJLE1BQU0sU0FBVUksTUFBSztBQUNqQyxZQUFBSixJQUFHLE1BQU0sSUFBSSxTQUFTSyxPQUFNO0FBQzFCLGtCQUFJO0FBQVUseUJBQVNELFFBQU9DLEtBQUk7QUFBQSxZQUM5QyxDQUFXO0FBQUEsVUFDWCxDQUFTO0FBQUEsUUFDVDtBQUFBLE1BQU87QUFBQSxJQUNGO0FBRUQsSUFBQUwsSUFBRyxhQUFhLFNBQVVDLE9BQU0sTUFBTTtBQUNwQyxVQUFJLEtBQUtELElBQUcsU0FBU0MsT0FBTUwsWUFBVSxXQUFXQSxZQUFVLFdBQVcsSUFBSTtBQUl6RSxVQUFJLFFBQVE7QUFDWixVQUFJO0FBQ0osVUFBSTtBQUNGLGNBQU1JLElBQUcsV0FBVyxJQUFJLElBQUk7QUFDNUIsZ0JBQVE7QUFBQSxNQUNoQixVQUFnQjtBQUNSLFlBQUksT0FBTztBQUNULGNBQUk7QUFDRixZQUFBQSxJQUFHLFVBQVUsRUFBRTtBQUFBLFVBQzNCLFNBQW1CLElBQVA7QUFBQSxVQUFhO0FBQUEsUUFDekIsT0FBZTtBQUNMLFVBQUFBLElBQUcsVUFBVSxFQUFFO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQ0QsYUFBTztBQUFBLElBQ1I7QUFBQSxFQUNGO0FBRUQsV0FBUyxhQUFjQSxLQUFJO0FBQ3pCLFFBQUlKLFlBQVUsZUFBZSxXQUFXLEtBQUtJLElBQUcsU0FBUztBQUN2RCxNQUFBQSxJQUFHLFVBQVUsU0FBVUMsT0FBTSxJQUFJLElBQUksSUFBSTtBQUN2QyxRQUFBRCxJQUFHLEtBQUtDLE9BQU1MLFlBQVUsV0FBVyxTQUFVLElBQUksSUFBSTtBQUNuRCxjQUFJLElBQUk7QUFDTixnQkFBSTtBQUFJLGlCQUFHLEVBQUU7QUFDYjtBQUFBLFVBQ0Q7QUFDRCxVQUFBSSxJQUFHLFFBQVEsSUFBSSxJQUFJLElBQUksU0FBVU0sS0FBSTtBQUNuQyxZQUFBTixJQUFHLE1BQU0sSUFBSSxTQUFVTyxNQUFLO0FBQzFCLGtCQUFJO0FBQUksbUJBQUdELE9BQU1DLElBQUc7QUFBQSxZQUNsQyxDQUFhO0FBQUEsVUFDYixDQUFXO0FBQUEsUUFDWCxDQUFTO0FBQUEsTUFDRjtBQUVELE1BQUFQLElBQUcsY0FBYyxTQUFVQyxPQUFNLElBQUksSUFBSTtBQUN2QyxZQUFJLEtBQUtELElBQUcsU0FBU0MsT0FBTUwsWUFBVSxTQUFTO0FBQzlDLFlBQUk7QUFDSixZQUFJLFFBQVE7QUFDWixZQUFJO0FBQ0YsZ0JBQU1JLElBQUcsWUFBWSxJQUFJLElBQUksRUFBRTtBQUMvQixrQkFBUTtBQUFBLFFBQ2xCLFVBQWtCO0FBQ1IsY0FBSSxPQUFPO0FBQ1QsZ0JBQUk7QUFDRixjQUFBQSxJQUFHLFVBQVUsRUFBRTtBQUFBLFlBQzdCLFNBQXFCLElBQVA7QUFBQSxZQUFhO0FBQUEsVUFDM0IsT0FBaUI7QUFDTCxZQUFBQSxJQUFHLFVBQVUsRUFBRTtBQUFBLFVBQ2hCO0FBQUEsUUFDRjtBQUNELGVBQU87QUFBQSxNQUNSO0FBQUEsSUFFUCxXQUFlQSxJQUFHLFNBQVM7QUFDckIsTUFBQUEsSUFBRyxVQUFVLFNBQVUsSUFBSSxJQUFJLElBQUksSUFBSTtBQUFFLFlBQUk7QUFBSSxrQkFBUSxTQUFTLEVBQUU7QUFBQSxNQUFHO0FBQ3ZFLE1BQUFBLElBQUcsY0FBYyxXQUFZO0FBQUEsTUFBRTtBQUFBLElBQ2hDO0FBQUEsRUFDRjtBQUVELFdBQVMsU0FBVSxNQUFNO0FBQ3ZCLFFBQUksQ0FBQztBQUFNLGFBQU87QUFDbEIsV0FBTyxTQUFVLFFBQVEsTUFBTSxJQUFJO0FBQ2pDLGFBQU8sS0FBSyxLQUFLQSxLQUFJLFFBQVEsTUFBTSxTQUFVLElBQUk7QUFDL0MsWUFBSSxVQUFVLEVBQUU7QUFBRyxlQUFLO0FBQ3hCLFlBQUk7QUFBSSxhQUFHLE1BQU0sTUFBTSxTQUFTO0FBQUEsTUFDeEMsQ0FBTztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUQsV0FBUyxhQUFjLE1BQU07QUFDM0IsUUFBSSxDQUFDO0FBQU0sYUFBTztBQUNsQixXQUFPLFNBQVUsUUFBUSxNQUFNO0FBQzdCLFVBQUk7QUFDRixlQUFPLEtBQUssS0FBS0EsS0FBSSxRQUFRLElBQUk7QUFBQSxNQUNsQyxTQUFRLElBQVA7QUFDQSxZQUFJLENBQUMsVUFBVSxFQUFFO0FBQUcsZ0JBQU07QUFBQSxNQUMzQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBR0QsV0FBUyxTQUFVLE1BQU07QUFDdkIsUUFBSSxDQUFDO0FBQU0sYUFBTztBQUNsQixXQUFPLFNBQVUsUUFBUSxLQUFLLEtBQUssSUFBSTtBQUNyQyxhQUFPLEtBQUssS0FBS0EsS0FBSSxRQUFRLEtBQUssS0FBSyxTQUFVLElBQUk7QUFDbkQsWUFBSSxVQUFVLEVBQUU7QUFBRyxlQUFLO0FBQ3hCLFlBQUk7QUFBSSxhQUFHLE1BQU0sTUFBTSxTQUFTO0FBQUEsTUFDeEMsQ0FBTztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUQsV0FBUyxhQUFjLE1BQU07QUFDM0IsUUFBSSxDQUFDO0FBQU0sYUFBTztBQUNsQixXQUFPLFNBQVUsUUFBUSxLQUFLLEtBQUs7QUFDakMsVUFBSTtBQUNGLGVBQU8sS0FBSyxLQUFLQSxLQUFJLFFBQVEsS0FBSyxHQUFHO0FBQUEsTUFDdEMsU0FBUSxJQUFQO0FBQ0EsWUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFHLGdCQUFNO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVELFdBQVMsUUFBUyxNQUFNO0FBQ3RCLFFBQUksQ0FBQztBQUFNLGFBQU87QUFHbEIsV0FBTyxTQUFVLFFBQVEsU0FBUyxJQUFJO0FBQ3BDLFVBQUksT0FBTyxZQUFZLFlBQVk7QUFDakMsYUFBSztBQUNMLGtCQUFVO0FBQUEsTUFDWDtBQUNELGVBQVMsU0FBVSxJQUFJLE9BQU87QUFDNUIsWUFBSSxPQUFPO0FBQ1QsY0FBSSxNQUFNLE1BQU07QUFBRyxrQkFBTSxPQUFPO0FBQ2hDLGNBQUksTUFBTSxNQUFNO0FBQUcsa0JBQU0sT0FBTztBQUFBLFFBQ2pDO0FBQ0QsWUFBSTtBQUFJLGFBQUcsTUFBTSxNQUFNLFNBQVM7QUFBQSxNQUNqQztBQUNELGFBQU8sVUFBVSxLQUFLLEtBQUtBLEtBQUksUUFBUSxTQUFTLFFBQVEsSUFDcEQsS0FBSyxLQUFLQSxLQUFJLFFBQVEsUUFBUTtBQUFBLElBQ25DO0FBQUEsRUFDRjtBQUVELFdBQVMsWUFBYSxNQUFNO0FBQzFCLFFBQUksQ0FBQztBQUFNLGFBQU87QUFHbEIsV0FBTyxTQUFVLFFBQVEsU0FBUztBQUNoQyxVQUFJLFFBQVEsVUFBVSxLQUFLLEtBQUtBLEtBQUksUUFBUSxPQUFPLElBQy9DLEtBQUssS0FBS0EsS0FBSSxNQUFNO0FBQ3hCLFVBQUksT0FBTztBQUNULFlBQUksTUFBTSxNQUFNO0FBQUcsZ0JBQU0sT0FBTztBQUNoQyxZQUFJLE1BQU0sTUFBTTtBQUFHLGdCQUFNLE9BQU87QUFBQSxNQUNqQztBQUNELGFBQU87QUFBQSxJQUNSO0FBQUEsRUFDRjtBQWNELFdBQVMsVUFBVyxJQUFJO0FBQ3RCLFFBQUksQ0FBQztBQUNILGFBQU87QUFFVCxRQUFJLEdBQUcsU0FBUztBQUNkLGFBQU87QUFFVCxRQUFJLFVBQVUsQ0FBQyxRQUFRLFVBQVUsUUFBUSxPQUFNLE1BQU87QUFDdEQsUUFBSSxTQUFTO0FBQ1gsVUFBSSxHQUFHLFNBQVMsWUFBWSxHQUFHLFNBQVM7QUFDdEMsZUFBTztBQUFBLElBQ1Y7QUFFRCxXQUFPO0FBQUEsRUFDUjtBQUNIO0FDbFdBLElBQUksU0FBU0gsc0JBQWlCLFdBQUM7QUFFL0IsSUFBQSxnQkFBaUJXO0FBRWpCLFNBQVNBLFNBQVFSLEtBQUk7QUFDbkIsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUVELFdBQVMsV0FBWUMsT0FBTSxTQUFTO0FBQ2xDLFFBQUksRUFBRSxnQkFBZ0I7QUFBYSxhQUFPLElBQUksV0FBV0EsT0FBTSxPQUFPO0FBRXRFLFdBQU8sS0FBSyxJQUFJO0FBRWhCLFFBQUlRLFFBQU87QUFFWCxTQUFLLE9BQU9SO0FBQ1osU0FBSyxLQUFLO0FBQ1YsU0FBSyxXQUFXO0FBQ2hCLFNBQUssU0FBUztBQUVkLFNBQUssUUFBUTtBQUNiLFNBQUssT0FBTztBQUNaLFNBQUssYUFBYSxLQUFLO0FBRXZCLGNBQVUsV0FBVztBQUdyQixRQUFJLE9BQU8sT0FBTyxLQUFLLE9BQU87QUFDOUIsYUFBUyxRQUFRLEdBQUcsU0FBUyxLQUFLLFFBQVEsUUFBUSxRQUFRLFNBQVM7QUFDakUsVUFBSSxNQUFNLEtBQUs7QUFDZixXQUFLLE9BQU8sUUFBUTtBQUFBLElBQ3JCO0FBRUQsUUFBSSxLQUFLO0FBQVUsV0FBSyxZQUFZLEtBQUssUUFBUTtBQUVqRCxRQUFJLEtBQUssVUFBVSxRQUFXO0FBQzVCLFVBQUksYUFBYSxPQUFPLEtBQUssT0FBTztBQUNsQyxjQUFNLFVBQVUsd0JBQXdCO0FBQUEsTUFDekM7QUFDRCxVQUFJLEtBQUssUUFBUSxRQUFXO0FBQzFCLGFBQUssTUFBTTtBQUFBLE1BQ1osV0FBVSxhQUFhLE9BQU8sS0FBSyxLQUFLO0FBQ3ZDLGNBQU0sVUFBVSxzQkFBc0I7QUFBQSxNQUN2QztBQUVELFVBQUksS0FBSyxRQUFRLEtBQUssS0FBSztBQUN6QixjQUFNLElBQUksTUFBTSxzQkFBc0I7QUFBQSxNQUN2QztBQUVELFdBQUssTUFBTSxLQUFLO0FBQUEsSUFDakI7QUFFRCxRQUFJLEtBQUssT0FBTyxNQUFNO0FBQ3BCLGNBQVEsU0FBUyxXQUFXO0FBQzFCLFFBQUFRLE1BQUssTUFBSztBQUFBLE1BQ2xCLENBQU87QUFDRDtBQUFBLElBQ0Q7QUFFRCxJQUFBVCxJQUFHLEtBQUssS0FBSyxNQUFNLEtBQUssT0FBTyxLQUFLLE1BQU0sU0FBVSxLQUFLLElBQUk7QUFDM0QsVUFBSSxLQUFLO0FBQ1AsUUFBQVMsTUFBSyxLQUFLLFNBQVMsR0FBRztBQUN0QixRQUFBQSxNQUFLLFdBQVc7QUFDaEI7QUFBQSxNQUNEO0FBRUQsTUFBQUEsTUFBSyxLQUFLO0FBQ1YsTUFBQUEsTUFBSyxLQUFLLFFBQVEsRUFBRTtBQUNwQixNQUFBQSxNQUFLLE1BQUs7QUFBQSxJQUNoQixDQUFLO0FBQUEsRUFDRjtBQUVELFdBQVMsWUFBYVIsT0FBTSxTQUFTO0FBQ25DLFFBQUksRUFBRSxnQkFBZ0I7QUFBYyxhQUFPLElBQUksWUFBWUEsT0FBTSxPQUFPO0FBRXhFLFdBQU8sS0FBSyxJQUFJO0FBRWhCLFNBQUssT0FBT0E7QUFDWixTQUFLLEtBQUs7QUFDVixTQUFLLFdBQVc7QUFFaEIsU0FBSyxRQUFRO0FBQ2IsU0FBSyxXQUFXO0FBQ2hCLFNBQUssT0FBTztBQUNaLFNBQUssZUFBZTtBQUVwQixjQUFVLFdBQVc7QUFHckIsUUFBSSxPQUFPLE9BQU8sS0FBSyxPQUFPO0FBQzlCLGFBQVMsUUFBUSxHQUFHLFNBQVMsS0FBSyxRQUFRLFFBQVEsUUFBUSxTQUFTO0FBQ2pFLFVBQUksTUFBTSxLQUFLO0FBQ2YsV0FBSyxPQUFPLFFBQVE7QUFBQSxJQUNyQjtBQUVELFFBQUksS0FBSyxVQUFVLFFBQVc7QUFDNUIsVUFBSSxhQUFhLE9BQU8sS0FBSyxPQUFPO0FBQ2xDLGNBQU0sVUFBVSx3QkFBd0I7QUFBQSxNQUN6QztBQUNELFVBQUksS0FBSyxRQUFRLEdBQUc7QUFDbEIsY0FBTSxJQUFJLE1BQU0sdUJBQXVCO0FBQUEsTUFDeEM7QUFFRCxXQUFLLE1BQU0sS0FBSztBQUFBLElBQ2pCO0FBRUQsU0FBSyxPQUFPO0FBQ1osU0FBSyxTQUFTO0FBRWQsUUFBSSxLQUFLLE9BQU8sTUFBTTtBQUNwQixXQUFLLFFBQVFELElBQUc7QUFDaEIsV0FBSyxPQUFPLEtBQUssQ0FBQyxLQUFLLE9BQU8sS0FBSyxNQUFNLEtBQUssT0FBTyxLQUFLLE1BQU0sTUFBUyxDQUFDO0FBQzFFLFdBQUssTUFBSztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQ0g7QUNuSEEsSUFBQSxVQUFpQlU7QUFFakIsSUFBSSxpQkFBaUIsT0FBTyxrQkFBa0IsU0FBVSxLQUFLO0FBQzNELFNBQU8sSUFBSTtBQUNiO0FBRUEsU0FBU0EsUUFBTyxLQUFLO0FBQ25CLE1BQUksUUFBUSxRQUFRLE9BQU8sUUFBUTtBQUNqQyxXQUFPO0FBRVQsTUFBSSxlQUFlO0FBQ2pCLFFBQUlDLFFBQU8sRUFBRSxXQUFXLGVBQWUsR0FBRyxFQUFHO0FBQUE7QUFFN0MsUUFBSUEsUUFBTyx1QkFBTyxPQUFPLElBQUk7QUFFL0IsU0FBTyxvQkFBb0IsR0FBRyxFQUFFLFFBQVEsU0FBVSxLQUFLO0FBQ3JELFdBQU8sZUFBZUEsT0FBTSxLQUFLLE9BQU8seUJBQXlCLEtBQUssR0FBRyxDQUFDO0FBQUEsRUFDOUUsQ0FBRztBQUVELFNBQU9BO0FBQ1Q7QUN0QkEsSUFBSVgsT0FBS0gsc0JBQWE7QUFDdEIsSUFBSSxZQUFZZTtBQUNoQixJQUFJLFNBQVNDO0FBQ2IsSUFBSSxRQUFRQztBQUVaLElBQUlDLFNBQU9DLG9CQUFlO0FBRzFCLElBQUk7QUFDSixJQUFJO0FBR0osSUFBSSxPQUFPLFdBQVcsY0FBYyxPQUFPLE9BQU8sUUFBUSxZQUFZO0FBQ3BFLGtCQUFnQixPQUFPLElBQUksbUJBQW1CO0FBRTlDLG1CQUFpQixPQUFPLElBQUksc0JBQXNCO0FBQ3BELE9BQU87QUFDTCxrQkFBZ0I7QUFDaEIsbUJBQWlCO0FBQ25CO0FBRUEsU0FBUyxPQUFRO0FBQUU7QUFFbkIsU0FBUyxhQUFhLFNBQVNDLFFBQU87QUFDcEMsU0FBTyxlQUFlLFNBQVMsZUFBZTtBQUFBLElBQzVDLEtBQUssV0FBVztBQUNkLGFBQU9BO0FBQUEsSUFDUjtBQUFBLEVBQ0wsQ0FBRztBQUNIO0FBRUEsSUFBSSxRQUFRO0FBQ1osSUFBSUYsT0FBSztBQUNQLFVBQVFBLE9BQUssU0FBUyxNQUFNO0FBQUEsU0FDckIsWUFBWSxLQUFpQixDQUFBLEVBQUEsY0FBYyxFQUFFO0FBQ3BELFVBQVEsV0FBVztBQUNqQixRQUFJLElBQUlBLE9BQUssT0FBTyxNQUFNQSxRQUFNLFNBQVM7QUFDekMsUUFBSSxXQUFXLEVBQUUsTUFBTSxJQUFJLEVBQUUsS0FBSyxVQUFVO0FBQzVDLFlBQVEsTUFBTSxDQUFDO0FBQUEsRUFDaEI7QUFHSCxJQUFJLENBQUNmLEtBQUcsZ0JBQWdCO0FBRXRCLE1BQUksUUFBUWtCLGVBQU8sa0JBQWtCLENBQUU7QUFDdkMsZUFBYWxCLE1BQUksS0FBSztBQU10QkEsT0FBRyxRQUFTLFNBQVUsVUFBVTtBQUM5QixhQUFTbUIsT0FBTyxJQUFJLElBQUk7QUFDdEIsYUFBTyxTQUFTLEtBQUtuQixNQUFJLElBQUksU0FBVSxLQUFLO0FBRTFDLFlBQUksQ0FBQyxLQUFLO0FBQ1IscUJBQVk7QUFBQSxRQUNiO0FBRUQsWUFBSSxPQUFPLE9BQU87QUFDaEIsYUFBRyxNQUFNLE1BQU0sU0FBUztBQUFBLE1BQ2xDLENBQU87QUFBQSxJQUNGO0FBRUQsV0FBTyxlQUFlbUIsUUFBTyxnQkFBZ0I7QUFBQSxNQUMzQyxPQUFPO0FBQUEsSUFDYixDQUFLO0FBQ0QsV0FBT0E7QUFBQSxFQUNYLEVBQUtuQixLQUFHLEtBQUs7QUFFWEEsT0FBRyxZQUFhLFNBQVUsY0FBYztBQUN0QyxhQUFTLFVBQVcsSUFBSTtBQUV0QixtQkFBYSxNQUFNQSxNQUFJLFNBQVM7QUFDaEMsaUJBQVk7QUFBQSxJQUNiO0FBRUQsV0FBTyxlQUFlLFdBQVcsZ0JBQWdCO0FBQUEsTUFDL0MsT0FBTztBQUFBLElBQ2IsQ0FBSztBQUNELFdBQU87QUFBQSxFQUNYLEVBQUtBLEtBQUcsU0FBUztBQUVmLE1BQUksWUFBWSxLQUFLLENBQUEsRUFBWSxjQUFjLEVBQUUsR0FBRztBQUNsRCxZQUFRLEdBQUcsUUFBUSxXQUFXO0FBQzVCLFlBQU1BLEtBQUcsY0FBYztBQUN2Qm9CLDBCQUFpQixXQUFDLE1BQU1wQixLQUFHLGVBQWUsUUFBUSxDQUFDO0FBQUEsSUFDekQsQ0FBSztBQUFBLEVBQ0Y7QUFDSDtBQUVBLElBQUksQ0FBQ2tCLGVBQU8sZ0JBQWdCO0FBQzFCLGVBQWFBLGdCQUFRbEIsS0FBRyxjQUFjO0FBQ3hDO0FBRUEsSUFBQSxhQUFpQixNQUFNLE1BQU1BLElBQUUsQ0FBQztBQUNoQyxJQUFnQixHQUFBLGlDQUFpQyxDQUFDQSxLQUFHLFdBQVc7QUFDNUQsZUFBaUIsTUFBTUEsSUFBRTtBQUN6QkEsT0FBRyxZQUFZO0FBQ25CO0FBRUEsU0FBUyxNQUFPQSxLQUFJO0FBRWxCLFlBQVVBLEdBQUU7QUFDWixFQUFBQSxJQUFHLGNBQWM7QUFFakIsRUFBQUEsSUFBRyxtQkFBbUI7QUFDdEIsRUFBQUEsSUFBRyxvQkFBb0I7QUFDdkIsTUFBSSxjQUFjQSxJQUFHO0FBQ3JCLEVBQUFBLElBQUcsV0FBV3FCO0FBQ2QsV0FBU0EsVUFBVXBCLE9BQU0sU0FBUyxJQUFJO0FBQ3BDLFFBQUksT0FBTyxZQUFZO0FBQ3JCLFdBQUssU0FBUyxVQUFVO0FBRTFCLFdBQU8sWUFBWUEsT0FBTSxTQUFTLEVBQUU7QUFFcEMsYUFBUyxZQUFhQSxPQUFNcUIsVUFBU0MsS0FBSSxXQUFXO0FBQ2xELGFBQU8sWUFBWXRCLE9BQU1xQixVQUFTLFNBQVUsS0FBSztBQUMvQyxZQUFJLFFBQVEsSUFBSSxTQUFTLFlBQVksSUFBSSxTQUFTO0FBQ2hELGtCQUFRLENBQUMsYUFBYSxDQUFDckIsT0FBTXFCLFVBQVNDLEdBQUUsR0FBRyxLQUFLLGFBQWEsS0FBSyxJQUFHLEdBQUksS0FBSyxJQUFLLENBQUEsQ0FBQztBQUFBLGFBQ2pGO0FBQ0gsY0FBSSxPQUFPQSxRQUFPO0FBQ2hCLFlBQUFBLElBQUcsTUFBTSxNQUFNLFNBQVM7QUFBQSxRQUMzQjtBQUFBLE1BQ1QsQ0FBTztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUQsTUFBSSxlQUFldkIsSUFBRztBQUN0QixFQUFBQSxJQUFHLFlBQVl3QjtBQUNmLFdBQVNBLFdBQVd2QixPQUFNLE1BQU0sU0FBUyxJQUFJO0FBQzNDLFFBQUksT0FBTyxZQUFZO0FBQ3JCLFdBQUssU0FBUyxVQUFVO0FBRTFCLFdBQU8sYUFBYUEsT0FBTSxNQUFNLFNBQVMsRUFBRTtBQUUzQyxhQUFTLGFBQWNBLE9BQU13QixPQUFNSCxVQUFTQyxLQUFJLFdBQVc7QUFDekQsYUFBTyxhQUFhdEIsT0FBTXdCLE9BQU1ILFVBQVMsU0FBVSxLQUFLO0FBQ3RELFlBQUksUUFBUSxJQUFJLFNBQVMsWUFBWSxJQUFJLFNBQVM7QUFDaEQsa0JBQVEsQ0FBQyxjQUFjLENBQUNyQixPQUFNd0IsT0FBTUgsVUFBU0MsR0FBRSxHQUFHLEtBQUssYUFBYSxLQUFLLElBQUssR0FBRSxLQUFLLElBQUcsQ0FBRSxDQUFDO0FBQUEsYUFDeEY7QUFDSCxjQUFJLE9BQU9BLFFBQU87QUFDaEIsWUFBQUEsSUFBRyxNQUFNLE1BQU0sU0FBUztBQUFBLFFBQzNCO0FBQUEsTUFDVCxDQUFPO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFRCxNQUFJLGdCQUFnQnZCLElBQUc7QUFDdkIsTUFBSTtBQUNGLElBQUFBLElBQUcsYUFBYTtBQUNsQixXQUFTLFdBQVlDLE9BQU0sTUFBTSxTQUFTLElBQUk7QUFDNUMsUUFBSSxPQUFPLFlBQVk7QUFDckIsV0FBSyxTQUFTLFVBQVU7QUFFMUIsV0FBTyxjQUFjQSxPQUFNLE1BQU0sU0FBUyxFQUFFO0FBRTVDLGFBQVMsY0FBZUEsT0FBTXdCLE9BQU1ILFVBQVNDLEtBQUksV0FBVztBQUMxRCxhQUFPLGNBQWN0QixPQUFNd0IsT0FBTUgsVUFBUyxTQUFVLEtBQUs7QUFDdkQsWUFBSSxRQUFRLElBQUksU0FBUyxZQUFZLElBQUksU0FBUztBQUNoRCxrQkFBUSxDQUFDLGVBQWUsQ0FBQ3JCLE9BQU13QixPQUFNSCxVQUFTQyxHQUFFLEdBQUcsS0FBSyxhQUFhLEtBQUssSUFBSyxHQUFFLEtBQUssSUFBRyxDQUFFLENBQUM7QUFBQSxhQUN6RjtBQUNILGNBQUksT0FBT0EsUUFBTztBQUNoQixZQUFBQSxJQUFHLE1BQU0sTUFBTSxTQUFTO0FBQUEsUUFDM0I7QUFBQSxNQUNULENBQU87QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVELE1BQUksY0FBY3ZCLElBQUc7QUFDckIsTUFBSTtBQUNGLElBQUFBLElBQUcsV0FBVzBCO0FBQ2hCLFdBQVNBLFVBQVUsS0FBSyxNQUFNLE9BQU8sSUFBSTtBQUN2QyxRQUFJLE9BQU8sVUFBVSxZQUFZO0FBQy9CLFdBQUs7QUFDTCxjQUFRO0FBQUEsSUFDVDtBQUNELFdBQU8sWUFBWSxLQUFLLE1BQU0sT0FBTyxFQUFFO0FBRXZDLGFBQVMsWUFBYUMsTUFBS0MsT0FBTUMsUUFBT04sS0FBSSxXQUFXO0FBQ3JELGFBQU8sWUFBWUksTUFBS0MsT0FBTUMsUUFBTyxTQUFVLEtBQUs7QUFDbEQsWUFBSSxRQUFRLElBQUksU0FBUyxZQUFZLElBQUksU0FBUztBQUNoRCxrQkFBUSxDQUFDLGFBQWEsQ0FBQ0YsTUFBS0MsT0FBTUMsUUFBT04sR0FBRSxHQUFHLEtBQUssYUFBYSxLQUFLLElBQUssR0FBRSxLQUFLLElBQUcsQ0FBRSxDQUFDO0FBQUEsYUFDcEY7QUFDSCxjQUFJLE9BQU9BLFFBQU87QUFDaEIsWUFBQUEsSUFBRyxNQUFNLE1BQU0sU0FBUztBQUFBLFFBQzNCO0FBQUEsTUFDVCxDQUFPO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFRCxNQUFJLGFBQWF2QixJQUFHO0FBQ3BCLEVBQUFBLElBQUcsVUFBVThCO0FBQ2IsTUFBSSwwQkFBMEI7QUFDOUIsV0FBU0EsU0FBUzdCLE9BQU0sU0FBUyxJQUFJO0FBQ25DLFFBQUksT0FBTyxZQUFZO0FBQ3JCLFdBQUssU0FBUyxVQUFVO0FBRTFCLFFBQUksYUFBYSx3QkFBd0IsS0FBSyxRQUFRLE9BQU8sSUFDekQsU0FBUzhCLFlBQVk5QixPQUFNcUIsVUFBU0MsS0FBSSxXQUFXO0FBQ25ELGFBQU8sV0FBV3RCLE9BQU07QUFBQSxRQUN0QkE7QUFBQSxRQUFNcUI7QUFBQSxRQUFTQztBQUFBLFFBQUk7QUFBQSxNQUM3QixDQUFTO0FBQUEsSUFDRixJQUNDLFNBQVNRLFlBQVk5QixPQUFNcUIsVUFBU0MsS0FBSSxXQUFXO0FBQ25ELGFBQU8sV0FBV3RCLE9BQU1xQixVQUFTO0FBQUEsUUFDL0JyQjtBQUFBLFFBQU1xQjtBQUFBLFFBQVNDO0FBQUEsUUFBSTtBQUFBLE1BQzdCLENBQVM7QUFBQSxJQUNGO0FBRUgsV0FBTyxXQUFXdEIsT0FBTSxTQUFTLEVBQUU7QUFFbkMsYUFBUyxtQkFBb0JBLE9BQU1xQixVQUFTQyxLQUFJLFdBQVc7QUFDekQsYUFBTyxTQUFVLEtBQUssT0FBTztBQUMzQixZQUFJLFFBQVEsSUFBSSxTQUFTLFlBQVksSUFBSSxTQUFTO0FBQ2hELGtCQUFRO0FBQUEsWUFDTjtBQUFBLFlBQ0EsQ0FBQ3RCLE9BQU1xQixVQUFTQyxHQUFFO0FBQUEsWUFDbEI7QUFBQSxZQUNBLGFBQWEsS0FBSyxJQUFLO0FBQUEsWUFDdkIsS0FBSyxJQUFLO0FBQUEsVUFDdEIsQ0FBVztBQUFBLGFBQ0U7QUFDSCxjQUFJLFNBQVMsTUFBTTtBQUNqQixrQkFBTSxLQUFNO0FBRWQsY0FBSSxPQUFPQSxRQUFPO0FBQ2hCLFlBQUFBLElBQUcsS0FBSyxNQUFNLEtBQUssS0FBSztBQUFBLFFBQzNCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUQsTUFBSSxRQUFRLFFBQVEsT0FBTyxHQUFHLENBQUMsTUFBTSxRQUFRO0FBQzNDLFFBQUksYUFBYSxPQUFPdkIsR0FBRTtBQUMxQixpQkFBYSxXQUFXO0FBQ3hCLGtCQUFjLFdBQVc7QUFBQSxFQUMxQjtBQUVELE1BQUksZ0JBQWdCQSxJQUFHO0FBQ3ZCLE1BQUksZUFBZTtBQUNqQixlQUFXLFlBQVksT0FBTyxPQUFPLGNBQWMsU0FBUztBQUM1RCxlQUFXLFVBQVUsT0FBTztBQUFBLEVBQzdCO0FBRUQsTUFBSSxpQkFBaUJBLElBQUc7QUFDeEIsTUFBSSxnQkFBZ0I7QUFDbEIsZ0JBQVksWUFBWSxPQUFPLE9BQU8sZUFBZSxTQUFTO0FBQzlELGdCQUFZLFVBQVUsT0FBTztBQUFBLEVBQzlCO0FBRUQsU0FBTyxlQUFlQSxLQUFJLGNBQWM7QUFBQSxJQUN0QyxLQUFLLFdBQVk7QUFDZixhQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0QsS0FBSyxTQUFVLEtBQUs7QUFDbEIsbUJBQWE7QUFBQSxJQUNkO0FBQUEsSUFDRCxZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsRUFDbEIsQ0FBRztBQUNELFNBQU8sZUFBZUEsS0FBSSxlQUFlO0FBQUEsSUFDdkMsS0FBSyxXQUFZO0FBQ2YsYUFBTztBQUFBLElBQ1I7QUFBQSxJQUNELEtBQUssU0FBVSxLQUFLO0FBQ2xCLG9CQUFjO0FBQUEsSUFDZjtBQUFBLElBQ0QsWUFBWTtBQUFBLElBQ1osY0FBYztBQUFBLEVBQ2xCLENBQUc7QUFHRCxNQUFJLGlCQUFpQjtBQUNyQixTQUFPLGVBQWVBLEtBQUksa0JBQWtCO0FBQUEsSUFDMUMsS0FBSyxXQUFZO0FBQ2YsYUFBTztBQUFBLElBQ1I7QUFBQSxJQUNELEtBQUssU0FBVSxLQUFLO0FBQ2xCLHVCQUFpQjtBQUFBLElBQ2xCO0FBQUEsSUFDRCxZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsRUFDbEIsQ0FBRztBQUNELE1BQUksa0JBQWtCO0FBQ3RCLFNBQU8sZUFBZUEsS0FBSSxtQkFBbUI7QUFBQSxJQUMzQyxLQUFLLFdBQVk7QUFDZixhQUFPO0FBQUEsSUFDUjtBQUFBLElBQ0QsS0FBSyxTQUFVLEtBQUs7QUFDbEIsd0JBQWtCO0FBQUEsSUFDbkI7QUFBQSxJQUNELFlBQVk7QUFBQSxJQUNaLGNBQWM7QUFBQSxFQUNsQixDQUFHO0FBRUQsV0FBUyxXQUFZQyxPQUFNLFNBQVM7QUFDbEMsUUFBSSxnQkFBZ0I7QUFDbEIsYUFBTyxjQUFjLE1BQU0sTUFBTSxTQUFTLEdBQUc7QUFBQTtBQUU3QyxhQUFPLFdBQVcsTUFBTSxPQUFPLE9BQU8sV0FBVyxTQUFTLEdBQUcsU0FBUztBQUFBLEVBQ3pFO0FBRUQsV0FBUyxrQkFBbUI7QUFDMUIsUUFBSSxPQUFPO0FBQ1gsSUFBQStCLE1BQUssS0FBSyxNQUFNLEtBQUssT0FBTyxLQUFLLE1BQU0sU0FBVSxLQUFLLElBQUk7QUFDeEQsVUFBSSxLQUFLO0FBQ1AsWUFBSSxLQUFLO0FBQ1AsZUFBSyxRQUFTO0FBRWhCLGFBQUssS0FBSyxTQUFTLEdBQUc7QUFBQSxNQUM5QixPQUFhO0FBQ0wsYUFBSyxLQUFLO0FBQ1YsYUFBSyxLQUFLLFFBQVEsRUFBRTtBQUNwQixhQUFLLEtBQU07QUFBQSxNQUNaO0FBQUEsSUFDUCxDQUFLO0FBQUEsRUFDRjtBQUVELFdBQVMsWUFBYS9CLE9BQU0sU0FBUztBQUNuQyxRQUFJLGdCQUFnQjtBQUNsQixhQUFPLGVBQWUsTUFBTSxNQUFNLFNBQVMsR0FBRztBQUFBO0FBRTlDLGFBQU8sWUFBWSxNQUFNLE9BQU8sT0FBTyxZQUFZLFNBQVMsR0FBRyxTQUFTO0FBQUEsRUFDM0U7QUFFRCxXQUFTLG1CQUFvQjtBQUMzQixRQUFJLE9BQU87QUFDWCxJQUFBK0IsTUFBSyxLQUFLLE1BQU0sS0FBSyxPQUFPLEtBQUssTUFBTSxTQUFVLEtBQUssSUFBSTtBQUN4RCxVQUFJLEtBQUs7QUFDUCxhQUFLLFFBQVM7QUFDZCxhQUFLLEtBQUssU0FBUyxHQUFHO0FBQUEsTUFDOUIsT0FBYTtBQUNMLGFBQUssS0FBSztBQUNWLGFBQUssS0FBSyxRQUFRLEVBQUU7QUFBQSxNQUNyQjtBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0Y7QUFFRCxXQUFTLGlCQUFrQi9CLE9BQU0sU0FBUztBQUN4QyxXQUFPLElBQUlELElBQUcsV0FBV0MsT0FBTSxPQUFPO0FBQUEsRUFDdkM7QUFFRCxXQUFTLGtCQUFtQkEsT0FBTSxTQUFTO0FBQ3pDLFdBQU8sSUFBSUQsSUFBRyxZQUFZQyxPQUFNLE9BQU87QUFBQSxFQUN4QztBQUVELE1BQUksVUFBVUQsSUFBRztBQUNqQixFQUFBQSxJQUFHLE9BQU9nQztBQUNWLFdBQVNBLE1BQU0vQixPQUFNLE9BQU8sTUFBTSxJQUFJO0FBQ3BDLFFBQUksT0FBTyxTQUFTO0FBQ2xCLFdBQUssTUFBTSxPQUFPO0FBRXBCLFdBQU8sUUFBUUEsT0FBTSxPQUFPLE1BQU0sRUFBRTtBQUVwQyxhQUFTLFFBQVNBLE9BQU00QixRQUFPSSxPQUFNVixLQUFJLFdBQVc7QUFDbEQsYUFBTyxRQUFRdEIsT0FBTTRCLFFBQU9JLE9BQU0sU0FBVSxLQUFLLElBQUk7QUFDbkQsWUFBSSxRQUFRLElBQUksU0FBUyxZQUFZLElBQUksU0FBUztBQUNoRCxrQkFBUSxDQUFDLFNBQVMsQ0FBQ2hDLE9BQU00QixRQUFPSSxPQUFNVixHQUFFLEdBQUcsS0FBSyxhQUFhLEtBQUssSUFBSyxHQUFFLEtBQUssSUFBRyxDQUFFLENBQUM7QUFBQSxhQUNqRjtBQUNILGNBQUksT0FBT0EsUUFBTztBQUNoQixZQUFBQSxJQUFHLE1BQU0sTUFBTSxTQUFTO0FBQUEsUUFDM0I7QUFBQSxNQUNULENBQU87QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVELFNBQU92QjtBQUNUO0FBRUEsU0FBUyxRQUFTLE1BQU07QUFDdEIsUUFBTSxXQUFXLEtBQUssR0FBRyxNQUFNLEtBQUssRUFBRTtBQUN0Q0EsT0FBRyxlQUFlLEtBQUssSUFBSTtBQUMzQixRQUFPO0FBQ1Q7QUFHQSxJQUFJO0FBS0osU0FBUyxhQUFjO0FBQ3JCLE1BQUksTUFBTSxLQUFLLElBQUs7QUFDcEIsV0FBUyxJQUFJLEdBQUcsSUFBSUEsS0FBRyxlQUFlLFFBQVEsRUFBRSxHQUFHO0FBR2pELFFBQUlBLEtBQUcsZUFBZSxHQUFHLFNBQVMsR0FBRztBQUNuQ0EsV0FBRyxlQUFlLEdBQUcsS0FBSztBQUMxQkEsV0FBRyxlQUFlLEdBQUcsS0FBSztBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUVELFFBQU87QUFDVDtBQUVBLFNBQVMsUUFBUztBQUVoQixlQUFhLFVBQVU7QUFDdkIsZUFBYTtBQUViLE1BQUlBLEtBQUcsZUFBZSxXQUFXO0FBQy9CO0FBRUYsTUFBSSxPQUFPQSxLQUFHLGVBQWUsTUFBTztBQUNwQyxNQUFJLEtBQUssS0FBSztBQUNkLE1BQUksT0FBTyxLQUFLO0FBRWhCLE1BQUksTUFBTSxLQUFLO0FBQ2YsTUFBSSxZQUFZLEtBQUs7QUFDckIsTUFBSSxXQUFXLEtBQUs7QUFJcEIsTUFBSSxjQUFjLFFBQVc7QUFDM0IsVUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJO0FBQzVCLE9BQUcsTUFBTSxNQUFNLElBQUk7QUFBQSxFQUNwQixXQUFVLEtBQUssUUFBUSxhQUFhLEtBQU87QUFFMUMsVUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJO0FBQzlCLFFBQUksS0FBSyxLQUFLLElBQUs7QUFDbkIsUUFBSSxPQUFPLE9BQU87QUFDaEIsU0FBRyxLQUFLLE1BQU0sR0FBRztBQUFBLEVBQ3ZCLE9BQVM7QUFFTCxRQUFJLGVBQWUsS0FBSyxJQUFHLElBQUs7QUFHaEMsUUFBSSxhQUFhLEtBQUssSUFBSSxXQUFXLFdBQVcsQ0FBQztBQUdqRCxRQUFJLGVBQWUsS0FBSyxJQUFJLGFBQWEsS0FBSyxHQUFHO0FBRWpELFFBQUksZ0JBQWdCLGNBQWM7QUFDaEMsWUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJO0FBQzVCLFNBQUcsTUFBTSxNQUFNLEtBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQUEsSUFDN0MsT0FBVztBQUdMQSxXQUFHLGVBQWUsS0FBSyxJQUFJO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBR0QsTUFBSSxlQUFlLFFBQVc7QUFDNUIsaUJBQWEsV0FBVyxPQUFPLENBQUM7QUFBQSxFQUNqQztBQUNIO0FBQUE7QUM1YkEsUUFBTWtDLEtBQUlyQyxhQUF3QjtBQUNsQyxRQUFNRyxNQUFLWTtBQUVYLFFBQU0sTUFBTTtBQUFBLElBQ1Y7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixFQUFFLE9BQU8sU0FBTztBQUtkLFdBQU8sT0FBT1osSUFBRyxTQUFTO0FBQUEsRUFDNUIsQ0FBQztBQUdELFNBQU8sS0FBS0EsR0FBRSxFQUFFLFFBQVEsU0FBTztBQUM3QixRQUFJLFFBQVEsWUFBWTtBQUd0QjtBQUFBLElBQ0Q7QUFDRCxZQUFRLE9BQU9BLElBQUc7QUFBQSxFQUNwQixDQUFDO0FBR0QsTUFBSSxRQUFRLFlBQVU7QUFDcEIsWUFBUSxVQUFVa0MsR0FBRWxDLElBQUcsT0FBTztBQUFBLEVBQ2hDLENBQUM7QUFJRCxVQUFBLFNBQWlCLFNBQVUsVUFBVSxVQUFVO0FBQzdDLFFBQUksT0FBTyxhQUFhLFlBQVk7QUFDbEMsYUFBT0EsSUFBRyxPQUFPLFVBQVUsUUFBUTtBQUFBLElBQ3BDO0FBQ0QsV0FBTyxJQUFJLFFBQVEsYUFBVztBQUM1QixhQUFPQSxJQUFHLE9BQU8sVUFBVSxPQUFPO0FBQUEsSUFDdEMsQ0FBRztBQUFBLEVBQ0g7QUFJQSxVQUFBLE9BQWUsU0FBVSxJQUFJRyxTQUFRLFFBQVEsUUFBUSxVQUFVLFVBQVU7QUFDdkUsUUFBSSxPQUFPLGFBQWEsWUFBWTtBQUNsQyxhQUFPSCxJQUFHLEtBQUssSUFBSUcsU0FBUSxRQUFRLFFBQVEsVUFBVSxRQUFRO0FBQUEsSUFDOUQ7QUFDRCxXQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUN0QyxNQUFBSCxJQUFHLEtBQUssSUFBSUcsU0FBUSxRQUFRLFFBQVEsVUFBVSxDQUFDLEtBQUssV0FBV0EsWUFBVztBQUN4RSxZQUFJO0FBQUssaUJBQU8sT0FBTyxHQUFHO0FBQzFCLGdCQUFRLEVBQUUsV0FBVyxRQUFBQSxTQUFRO0FBQUEsTUFDbkMsQ0FBSztBQUFBLElBQ0wsQ0FBRztBQUFBLEVBQ0g7QUFPQSxVQUFBLFFBQWdCLFNBQVUsSUFBSUEsWUFBVyxNQUFNO0FBQzdDLFFBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxPQUFPLFlBQVk7QUFDL0MsYUFBT0gsSUFBRyxNQUFNLElBQUlHLFNBQVEsR0FBRyxJQUFJO0FBQUEsSUFDcEM7QUFFRCxXQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUN0QyxNQUFBSCxJQUFHLE1BQU0sSUFBSUcsU0FBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLGNBQWNBLFlBQVc7QUFDM0QsWUFBSTtBQUFLLGlCQUFPLE9BQU8sR0FBRztBQUMxQixnQkFBUSxFQUFFLGNBQWMsUUFBQUEsU0FBUTtBQUFBLE1BQ3RDLENBQUs7QUFBQSxJQUNMLENBQUc7QUFBQSxFQUNIO0FBR0EsTUFBSSxPQUFPSCxJQUFHLFNBQVMsV0FBVyxZQUFZO0FBQzVDLFlBQVEsU0FBUyxTQUFTa0MsR0FBRWxDLElBQUcsU0FBUyxNQUFNO0FBQUEsRUFDaEQ7O0FDMUdBLE1BQU1DLFNBQU9KLG9CQUFlO0FBRzVCLFNBQVMsWUFBYSxHQUFHO0FBQ3ZCLE1BQUlJLE9BQUssVUFBVUEsT0FBSyxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU1BLE9BQUssR0FBRztBQUNsRCxNQUFJLEVBQUUsU0FBUztBQUFHLFdBQU8sRUFBRTtBQUMzQixTQUFPO0FBQ1Q7QUFJQSxNQUFNLHFCQUFxQjtBQUUzQixTQUFTa0MsbUJBQWtCLEdBQUc7QUFDNUIsUUFBTSxLQUFLLFlBQVksQ0FBQztBQUN4QixNQUFJLEVBQUUsUUFBUSxJQUFJLEVBQUU7QUFDcEIsU0FBTyxtQkFBbUIsS0FBSyxDQUFDO0FBQ2xDO0FBRUEsSUFBQSxRQUFpQjtBQUFBLEVBQ2Y7QUFBQSxFQUNGLGtCQUFFQTtBQUNGO0FDdEJBLE1BQU1uQyxPQUFLSDtBQUNYLE1BQU1JLFNBQU9XLG9CQUFlO0FBQzVCLE1BQU11QixxQkFBbUJ0QixNQUFtQjtBQUU1QyxNQUFNdUIsU0FBTyxTQUFTLFFBQVEsQ0FBQztBQUUvQixTQUFTQyxTQUFRLEdBQUcsTUFBTSxVQUFVLE1BQU07QUFDeEMsTUFBSSxPQUFPLFNBQVMsWUFBWTtBQUM5QixlQUFXO0FBQ1gsV0FBTyxDQUFFO0FBQUEsRUFDVixXQUFVLENBQUMsUUFBUSxPQUFPLFNBQVMsVUFBVTtBQUM1QyxXQUFPLEVBQUUsTUFBTSxLQUFNO0FBQUEsRUFDdEI7QUFFRCxNQUFJLFFBQVEsYUFBYSxXQUFXRixtQkFBaUIsQ0FBQyxHQUFHO0FBQ3ZELFVBQU0sV0FBVyxJQUFJLE1BQU0sSUFBSSwwQ0FBMEM7QUFDekUsYUFBUyxPQUFPO0FBQ2hCLFdBQU8sU0FBUyxRQUFRO0FBQUEsRUFDekI7QUFFRCxNQUFJLE9BQU8sS0FBSztBQUNoQixRQUFNLE1BQU0sS0FBSyxNQUFNbkM7QUFFdkIsTUFBSSxTQUFTLFFBQVc7QUFDdEIsV0FBT29DLFNBQVEsQ0FBQyxRQUFRLE1BQUs7QUFBQSxFQUM5QjtBQUNELE1BQUksQ0FBQztBQUFNLFdBQU87QUFFbEIsYUFBVyxZQUFZLFdBQVk7QUFBQSxFQUFFO0FBQ3JDLE1BQUluQyxPQUFLLFFBQVEsQ0FBQztBQUVsQixNQUFJLE1BQU0sR0FBRyxNQUFNLFFBQU07QUFDdkIsUUFBSSxDQUFDLElBQUk7QUFDUCxhQUFPLFFBQVE7QUFDZixhQUFPLFNBQVMsTUFBTSxJQUFJO0FBQUEsSUFDM0I7QUFDRCxZQUFRLEdBQUc7QUFBQSxXQUNKO0FBQ0gsWUFBSUEsT0FBSyxRQUFRLENBQUMsTUFBTTtBQUFHLGlCQUFPLFNBQVMsRUFBRTtBQUM3Q29DLGlCQUFPcEMsT0FBSyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUNLLEtBQUlnQyxVQUFTO0FBQzFDLGNBQUloQztBQUFJLHFCQUFTQSxLQUFJZ0MsS0FBSTtBQUFBO0FBQ3BCRCxxQkFBTyxHQUFHLE1BQU0sVUFBVUMsS0FBSTtBQUFBLFFBQzdDLENBQVM7QUFDRDtBQUFBO0FBTUEsWUFBSSxLQUFLLEdBQUcsQ0FBQyxLQUFLQyxVQUFTO0FBR3pCLGNBQUksT0FBTyxDQUFDQSxNQUFLLFlBQWE7QUFBRSxxQkFBUyxJQUFJLElBQUk7QUFBQTtBQUM1QyxxQkFBUyxNQUFNLElBQUk7QUFBQSxRQUNsQyxDQUFTO0FBQ0Q7QUFBQTtBQUFBLEVBRVIsQ0FBRztBQUNIO0FBRUEsSUFBQUMsYUFBaUJIO0FDNURqQixNQUFNckMsT0FBS0g7QUFDWCxNQUFNSSxTQUFPVyxvQkFBZTtBQUM1QixNQUFNLG1CQUFtQkMsTUFBbUI7QUFFNUMsTUFBTSxPQUFPLFNBQVMsUUFBUSxDQUFDO0FBRS9CLFNBQVM0QixhQUFZLEdBQUcsTUFBTSxNQUFNO0FBQ2xDLE1BQUksQ0FBQyxRQUFRLE9BQU8sU0FBUyxVQUFVO0FBQ3JDLFdBQU8sRUFBRSxNQUFNLEtBQU07QUFBQSxFQUN0QjtBQUVELE1BQUksT0FBTyxLQUFLO0FBQ2hCLFFBQU0sTUFBTSxLQUFLLE1BQU16QztBQUV2QixNQUFJLFFBQVEsYUFBYSxXQUFXLGlCQUFpQixDQUFDLEdBQUc7QUFDdkQsVUFBTSxXQUFXLElBQUksTUFBTSxJQUFJLDBDQUEwQztBQUN6RSxhQUFTLE9BQU87QUFDaEIsVUFBTTtBQUFBLEVBQ1A7QUFFRCxNQUFJLFNBQVMsUUFBVztBQUN0QixXQUFPLE9BQVEsQ0FBQyxRQUFRLE1BQUs7QUFBQSxFQUM5QjtBQUNELE1BQUksQ0FBQztBQUFNLFdBQU87QUFFbEIsTUFBSUMsT0FBSyxRQUFRLENBQUM7QUFFbEIsTUFBSTtBQUNGLFFBQUksVUFBVSxHQUFHLElBQUk7QUFDckIsV0FBTyxRQUFRO0FBQUEsRUFDaEIsU0FBUSxNQUFQO0FBQ0EsUUFBSSxLQUFLLFNBQVMsVUFBVTtBQUMxQixVQUFJQSxPQUFLLFFBQVEsQ0FBQyxNQUFNO0FBQUcsY0FBTTtBQUNqQyxhQUFPd0MsYUFBV3hDLE9BQUssUUFBUSxDQUFDLEdBQUcsTUFBTSxJQUFJO0FBQzdDd0MsbUJBQVcsR0FBRyxNQUFNLElBQUk7QUFBQSxJQUM5QixPQUFXO0FBR0wsVUFBSUY7QUFDSixVQUFJO0FBQ0YsUUFBQUEsUUFBTyxJQUFJLFNBQVMsQ0FBQztBQUFBLE1BQ3RCLFNBQVEsTUFBUDtBQUNBLGNBQU07QUFBQSxNQUNQO0FBQ0QsVUFBSSxDQUFDQSxNQUFLLFlBQWE7QUFBRSxjQUFNO0FBQUEsSUFDaEM7QUFBQSxFQUNGO0FBRUQsU0FBTztBQUNUO0FBRUEsSUFBQSxlQUFpQkU7QUNwRGpCLE1BQU1QLE1BQUlyQyxhQUF3QjtBQUNsQyxNQUFNd0MsV0FBU0gsSUFBRXRCLFVBQW1CO0FBQ3BDLE1BQU02QixlQUFhNUI7QUFFbkIsSUFBQSxXQUFpQjtBQUFBLEVBQ2pCLFFBQUV3QjtBQUFBQSxFQUNGLFlBQUVJO0FBQUFBLEVBRUEsUUFBUUo7QUFBQUEsRUFDUixZQUFZSTtBQUFBQSxFQUNaLFdBQVdKO0FBQUFBLEVBQ1gsZUFBZUk7QUFDakI7QUNYQSxNQUFNekMsT0FBS0g7QUFDWCxNQUFNLEtBQUtlLHNCQUFhO0FBQ3hCLE1BQU1YLFNBQU9ZLG9CQUFlO0FBRzVCLFNBQVMsbUJBQW9CO0FBQzNCLE1BQUksVUFBVVosT0FBSyxLQUFLLHFCQUFxQixLQUFLLElBQUssRUFBQyxTQUFRLElBQUssS0FBSyxPQUFRLEVBQUMsU0FBUSxFQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ3RHLFlBQVVBLE9BQUssS0FBSyxHQUFHLE9BQU0sR0FBSSxPQUFPO0FBR3hDLFFBQU0sSUFBSSxJQUFJLEtBQUssYUFBYTtBQUNoQ0QsT0FBRyxjQUFjLFNBQVMsd0RBQXdEO0FBQ2xGLFFBQU0sS0FBS0EsS0FBRyxTQUFTLFNBQVMsSUFBSTtBQUNwQ0EsT0FBRyxZQUFZLElBQUksR0FBRyxDQUFDO0FBQ3ZCQSxPQUFHLFVBQVUsRUFBRTtBQUNmLFNBQU9BLEtBQUcsU0FBUyxPQUFPLEVBQUUsUUFBUTtBQUN0QztBQUVBLFNBQVMsYUFBYyxVQUFVO0FBQy9CLE1BQUksVUFBVUMsT0FBSyxLQUFLLGdCQUFnQixLQUFLLElBQUssRUFBQyxTQUFRLElBQUssS0FBSyxPQUFRLEVBQUMsU0FBUSxFQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ2pHLFlBQVVBLE9BQUssS0FBSyxHQUFHLE9BQU0sR0FBSSxPQUFPO0FBR3hDLFFBQU0sSUFBSSxJQUFJLEtBQUssYUFBYTtBQUNoQ0QsT0FBRyxVQUFVLFNBQVMsMERBQTBELFNBQU87QUFDckYsUUFBSTtBQUFLLGFBQU8sU0FBUyxHQUFHO0FBQzVCQSxTQUFHLEtBQUssU0FBUyxNQUFNLENBQUNJLE1BQUssT0FBTztBQUNsQyxVQUFJQTtBQUFLLGVBQU8sU0FBU0EsSUFBRztBQUM1QkosV0FBRyxRQUFRLElBQUksR0FBRyxHQUFHLENBQUFJLFNBQU87QUFDMUIsWUFBSUE7QUFBSyxpQkFBTyxTQUFTQSxJQUFHO0FBQzVCSixhQUFHLE1BQU0sSUFBSSxDQUFBSSxTQUFPO0FBQ2xCLGNBQUlBO0FBQUssbUJBQU8sU0FBU0EsSUFBRztBQUM1QkosZUFBRyxLQUFLLFNBQVMsQ0FBQ0ksTUFBSyxVQUFVO0FBQy9CLGdCQUFJQTtBQUFLLHFCQUFPLFNBQVNBLElBQUc7QUFDNUIscUJBQVMsTUFBTSxNQUFNLFFBQVEsWUFBYTtBQUFBLFVBQ3RELENBQVc7QUFBQSxRQUNYLENBQVM7QUFBQSxNQUNULENBQU87QUFBQSxJQUNQLENBQUs7QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLFNBQVMsaUJBQWtCLFdBQVc7QUFDcEMsTUFBSSxPQUFPLGNBQWMsVUFBVTtBQUNqQyxXQUFPLEtBQUssTUFBTSxZQUFZLEdBQUksSUFBSTtBQUFBLEVBQzFDLFdBQWEscUJBQXFCLE1BQU07QUFDcEMsV0FBTyxJQUFJLEtBQUssS0FBSyxNQUFNLFVBQVUsUUFBUyxJQUFHLEdBQUksSUFBSSxHQUFJO0FBQUEsRUFDakUsT0FBUztBQUNMLFVBQU0sSUFBSSxNQUFNLHFEQUFxRDtBQUFBLEVBQ3RFO0FBQ0g7QUFFQSxTQUFTLGFBQWNILE9BQU0sT0FBTyxPQUFPLFVBQVU7QUFFbkRELE9BQUcsS0FBS0MsT0FBTSxNQUFNLENBQUMsS0FBSyxPQUFPO0FBQy9CLFFBQUk7QUFBSyxhQUFPLFNBQVMsR0FBRztBQUM1QkQsU0FBRyxRQUFRLElBQUksT0FBTyxPQUFPLGdCQUFjO0FBQ3pDQSxXQUFHLE1BQU0sSUFBSSxjQUFZO0FBQ3ZCLFlBQUk7QUFBVSxtQkFBUyxjQUFjLFFBQVE7QUFBQSxNQUNyRCxDQUFPO0FBQUEsSUFDUCxDQUFLO0FBQUEsRUFDTCxDQUFHO0FBQ0g7QUFFQSxTQUFTLGlCQUFrQkMsT0FBTSxPQUFPLE9BQU87QUFDN0MsUUFBTSxLQUFLRCxLQUFHLFNBQVNDLE9BQU0sSUFBSTtBQUNqQ0QsT0FBRyxZQUFZLElBQUksT0FBTyxLQUFLO0FBQy9CLFNBQU9BLEtBQUcsVUFBVSxFQUFFO0FBQ3hCO0FBRUEsSUFBQTBDLFdBQWlCO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQzVFQSxNQUFNMUMsT0FBS0g7QUFDWCxNQUFNSSxTQUFPVyxvQkFBZTtBQUU1QixNQUFNLGlDQUFpQztBQUN2QyxNQUFNLGlDQUFpQztBQUN2QyxNQUFNLGlDQUFpQztBQUN2QyxNQUFNLGNBQWMsUUFBUSxTQUFTLEtBQUssTUFBTSxHQUFHO0FBQ25ELE1BQU0sbUJBQW1CLE9BQU8sU0FBUyxZQUFZLElBQUksRUFBRTtBQUMzRCxNQUFNLG1CQUFtQixPQUFPLFNBQVMsWUFBWSxJQUFJLEVBQUU7QUFDM0QsTUFBTSxtQkFBbUIsT0FBTyxTQUFTLFlBQVksSUFBSSxFQUFFO0FBRTNELFNBQVMscUJBQXNCO0FBQzdCLE1BQUksbUJBQW1CLGdDQUFnQztBQUNyRCxXQUFPO0FBQUEsRUFDWCxXQUFhLHFCQUFxQixnQ0FBZ0M7QUFDOUQsUUFBSSxtQkFBbUIsZ0NBQWdDO0FBQ3JELGFBQU87QUFBQSxJQUNiLFdBQWUscUJBQXFCLGdDQUFnQztBQUM5RCxVQUFJLG9CQUFvQixnQ0FBZ0M7QUFDdEQsZUFBTztBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNELFNBQU87QUFDVDtBQUVBLFNBQVMrQixXQUFVLEtBQUssTUFBTSxJQUFJO0FBQ2hDLE1BQUksbUJBQWtCLEdBQUk7QUFDeEIzQyxTQUFHLEtBQUssS0FBSyxFQUFFLFFBQVEsUUFBUSxDQUFDLEtBQUssWUFBWTtBQUMvQyxVQUFJO0FBQUssZUFBTyxHQUFHLEdBQUc7QUFDdEJBLFdBQUcsS0FBSyxNQUFNLEVBQUUsUUFBUSxRQUFRLENBQUNJLE1BQUssYUFBYTtBQUNqRCxZQUFJQSxNQUFLO0FBQ1AsY0FBSUEsS0FBSSxTQUFTO0FBQVUsbUJBQU8sR0FBRyxNQUFNLEVBQUUsU0FBUyxVQUFVLE1BQU07QUFDdEUsaUJBQU8sR0FBR0EsSUFBRztBQUFBLFFBQ2Q7QUFDRCxlQUFPLEdBQUcsTUFBTSxFQUFFLFNBQVMsU0FBUSxDQUFFO0FBQUEsTUFDN0MsQ0FBTztBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0wsT0FBUztBQUNMSixTQUFHLEtBQUssS0FBSyxDQUFDLEtBQUssWUFBWTtBQUM3QixVQUFJO0FBQUssZUFBTyxHQUFHLEdBQUc7QUFDdEJBLFdBQUcsS0FBSyxNQUFNLENBQUNJLE1BQUssYUFBYTtBQUMvQixZQUFJQSxNQUFLO0FBQ1AsY0FBSUEsS0FBSSxTQUFTO0FBQVUsbUJBQU8sR0FBRyxNQUFNLEVBQUUsU0FBUyxVQUFVLE1BQU07QUFDdEUsaUJBQU8sR0FBR0EsSUFBRztBQUFBLFFBQ2Q7QUFDRCxlQUFPLEdBQUcsTUFBTSxFQUFFLFNBQVMsU0FBUSxDQUFFO0FBQUEsTUFDN0MsQ0FBTztBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0Y7QUFDSDtBQUVBLFNBQVMsYUFBYyxLQUFLLE1BQU07QUFDaEMsTUFBSSxTQUFTO0FBQ2IsTUFBSSxtQkFBa0IsR0FBSTtBQUN4QixjQUFVSixLQUFHLFNBQVMsS0FBSyxFQUFFLFFBQVEsTUFBTTtBQUFBLEVBQy9DLE9BQVM7QUFDTCxjQUFVQSxLQUFHLFNBQVMsR0FBRztBQUFBLEVBQzFCO0FBQ0QsTUFBSTtBQUNGLFFBQUksbUJBQWtCLEdBQUk7QUFDeEIsaUJBQVdBLEtBQUcsU0FBUyxNQUFNLEVBQUUsUUFBUSxNQUFNO0FBQUEsSUFDbkQsT0FBVztBQUNMLGlCQUFXQSxLQUFHLFNBQVMsSUFBSTtBQUFBLElBQzVCO0FBQUEsRUFDRixTQUFRLEtBQVA7QUFDQSxRQUFJLElBQUksU0FBUztBQUFVLGFBQU8sRUFBRSxTQUFTLFVBQVUsS0FBTTtBQUM3RCxVQUFNO0FBQUEsRUFDUDtBQUNELFNBQU8sRUFBRSxTQUFTLFNBQVU7QUFDOUI7QUFFQSxTQUFTLFdBQVksS0FBSyxNQUFNLFVBQVUsSUFBSTtBQUM1QzJDLGFBQVMsS0FBSyxNQUFNLENBQUMsS0FBSyxVQUFVO0FBQ2xDLFFBQUk7QUFBSyxhQUFPLEdBQUcsR0FBRztBQUN0QixVQUFNLEVBQUUsU0FBUyxTQUFRLElBQUs7QUFDOUIsUUFBSSxZQUFZLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FBUyxRQUFRLFFBQVEsT0FBTyxTQUFTLFFBQVEsUUFBUSxLQUFLO0FBQzVHLGFBQU8sR0FBRyxJQUFJLE1BQU0sOENBQThDLENBQUM7QUFBQSxJQUNwRTtBQUNELFFBQUksUUFBUSxZQUFhLEtBQUksWUFBWSxLQUFLLElBQUksR0FBRztBQUNuRCxhQUFPLEdBQUcsSUFBSSxNQUFNLE9BQU8sS0FBSyxNQUFNLFFBQVEsQ0FBQyxDQUFDO0FBQUEsSUFDakQ7QUFDRCxXQUFPLEdBQUcsTUFBTSxFQUFFLFNBQVMsU0FBUSxDQUFFO0FBQUEsRUFDekMsQ0FBRztBQUNIO0FBRUEsU0FBUyxlQUFnQixLQUFLLE1BQU0sVUFBVTtBQUM1QyxRQUFNLEVBQUUsU0FBUyxTQUFRLElBQUssYUFBYSxLQUFLLElBQUk7QUFDcEQsTUFBSSxZQUFZLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FBUyxRQUFRLFFBQVEsT0FBTyxTQUFTLFFBQVEsUUFBUSxLQUFLO0FBQzVHLFVBQU0sSUFBSSxNQUFNLDhDQUE4QztBQUFBLEVBQy9EO0FBQ0QsTUFBSSxRQUFRLFlBQWEsS0FBSSxZQUFZLEtBQUssSUFBSSxHQUFHO0FBQ25ELFVBQU0sSUFBSSxNQUFNLE9BQU8sS0FBSyxNQUFNLFFBQVEsQ0FBQztBQUFBLEVBQzVDO0FBQ0QsU0FBTyxFQUFFLFNBQVMsU0FBVTtBQUM5QjtBQU1BLFNBQVMsaUJBQWtCLEtBQUssU0FBUyxNQUFNLFVBQVUsSUFBSTtBQUMzRCxRQUFNLFlBQVkxQyxPQUFLLFFBQVFBLE9BQUssUUFBUSxHQUFHLENBQUM7QUFDaEQsUUFBTSxhQUFhQSxPQUFLLFFBQVFBLE9BQUssUUFBUSxJQUFJLENBQUM7QUFDbEQsTUFBSSxlQUFlLGFBQWEsZUFBZUEsT0FBSyxNQUFNLFVBQVUsRUFBRTtBQUFNLFdBQU8sR0FBSTtBQUN2RixNQUFJLG1CQUFrQixHQUFJO0FBQ3hCRCxTQUFHLEtBQUssWUFBWSxFQUFFLFFBQVEsUUFBUSxDQUFDLEtBQUssYUFBYTtBQUN2RCxVQUFJLEtBQUs7QUFDUCxZQUFJLElBQUksU0FBUztBQUFVLGlCQUFPLEdBQUk7QUFDdEMsZUFBTyxHQUFHLEdBQUc7QUFBQSxNQUNkO0FBQ0QsVUFBSSxTQUFTLE9BQU8sU0FBUyxPQUFPLFNBQVMsUUFBUSxRQUFRLE9BQU8sU0FBUyxRQUFRLFFBQVEsS0FBSztBQUNoRyxlQUFPLEdBQUcsSUFBSSxNQUFNLE9BQU8sS0FBSyxNQUFNLFFBQVEsQ0FBQyxDQUFDO0FBQUEsTUFDakQ7QUFDRCxhQUFPLGlCQUFpQixLQUFLLFNBQVMsWUFBWSxVQUFVLEVBQUU7QUFBQSxJQUNwRSxDQUFLO0FBQUEsRUFDTCxPQUFTO0FBQ0xBLFNBQUcsS0FBSyxZQUFZLENBQUMsS0FBSyxhQUFhO0FBQ3JDLFVBQUksS0FBSztBQUNQLFlBQUksSUFBSSxTQUFTO0FBQVUsaUJBQU8sR0FBSTtBQUN0QyxlQUFPLEdBQUcsR0FBRztBQUFBLE1BQ2Q7QUFDRCxVQUFJLFNBQVMsT0FBTyxTQUFTLE9BQU8sU0FBUyxRQUFRLFFBQVEsT0FBTyxTQUFTLFFBQVEsUUFBUSxLQUFLO0FBQ2hHLGVBQU8sR0FBRyxJQUFJLE1BQU0sT0FBTyxLQUFLLE1BQU0sUUFBUSxDQUFDLENBQUM7QUFBQSxNQUNqRDtBQUNELGFBQU8saUJBQWlCLEtBQUssU0FBUyxZQUFZLFVBQVUsRUFBRTtBQUFBLElBQ3BFLENBQUs7QUFBQSxFQUNGO0FBQ0g7QUFFQSxTQUFTLHFCQUFzQixLQUFLLFNBQVMsTUFBTSxVQUFVO0FBQzNELFFBQU0sWUFBWUMsT0FBSyxRQUFRQSxPQUFLLFFBQVEsR0FBRyxDQUFDO0FBQ2hELFFBQU0sYUFBYUEsT0FBSyxRQUFRQSxPQUFLLFFBQVEsSUFBSSxDQUFDO0FBQ2xELE1BQUksZUFBZSxhQUFhLGVBQWVBLE9BQUssTUFBTSxVQUFVLEVBQUU7QUFBTTtBQUM1RSxNQUFJO0FBQ0osTUFBSTtBQUNGLFFBQUksbUJBQWtCLEdBQUk7QUFDeEIsaUJBQVdELEtBQUcsU0FBUyxZQUFZLEVBQUUsUUFBUSxNQUFNO0FBQUEsSUFDekQsT0FBVztBQUNMLGlCQUFXQSxLQUFHLFNBQVMsVUFBVTtBQUFBLElBQ2xDO0FBQUEsRUFDRixTQUFRLEtBQVA7QUFDQSxRQUFJLElBQUksU0FBUztBQUFVO0FBQzNCLFVBQU07QUFBQSxFQUNQO0FBQ0QsTUFBSSxTQUFTLE9BQU8sU0FBUyxPQUFPLFNBQVMsUUFBUSxRQUFRLE9BQU8sU0FBUyxRQUFRLFFBQVEsS0FBSztBQUNoRyxVQUFNLElBQUksTUFBTSxPQUFPLEtBQUssTUFBTSxRQUFRLENBQUM7QUFBQSxFQUM1QztBQUNELFNBQU8scUJBQXFCLEtBQUssU0FBUyxZQUFZLFFBQVE7QUFDaEU7QUFJQSxTQUFTLFlBQWEsS0FBSyxNQUFNO0FBQy9CLFFBQU0sU0FBU0MsT0FBSyxRQUFRLEdBQUcsRUFBRSxNQUFNQSxPQUFLLEdBQUcsRUFBRSxPQUFPLE9BQUssQ0FBQztBQUM5RCxRQUFNLFVBQVVBLE9BQUssUUFBUSxJQUFJLEVBQUUsTUFBTUEsT0FBSyxHQUFHLEVBQUUsT0FBTyxPQUFLLENBQUM7QUFDaEUsU0FBTyxPQUFPLE9BQU8sQ0FBQyxLQUFLLEtBQUssTUFBTSxPQUFPLFFBQVEsT0FBTyxLQUFLLElBQUk7QUFDdkU7QUFFQSxTQUFTLE9BQVEsS0FBSyxNQUFNLFVBQVU7QUFDcEMsU0FBTyxVQUFVLGFBQWEsc0NBQXNDO0FBQ3RFO0FBRUEsSUFBQXNDLFNBQWlCO0FBQUEsRUFDZjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtJQ3pLQSxTQUFpQixTQUFVLE1BQU07QUFDL0IsTUFBSSxPQUFPLE9BQU8sZ0JBQWdCLFlBQVk7QUFDNUMsUUFBSTtBQUNGLGFBQU8sT0FBTyxZQUFZLElBQUk7QUFBQSxJQUMvQixTQUFRLEdBQVA7QUFDQSxhQUFPLElBQUksT0FBTyxJQUFJO0FBQUEsSUFDdkI7QUFBQSxFQUNGO0FBQ0QsU0FBTyxJQUFJLE9BQU8sSUFBSTtBQUN4QjtBQ1RBLE1BQU12QyxPQUFLSDtBQUNYLE1BQU1JLFNBQU9XLG9CQUFlO0FBQzVCLE1BQU1nQyxlQUFhL0IsU0FBcUI7QUFDeEMsTUFBTSxhQUFhQyxTQUE2QjtBQUNoRCxNQUFNeUIsU0FBT3ZCO0FBRWIsU0FBUzZCLFdBQVUsS0FBSyxNQUFNLE1BQU07QUFDbEMsTUFBSSxPQUFPLFNBQVMsWUFBWTtBQUM5QixXQUFPLEVBQUUsUUFBUSxLQUFNO0FBQUEsRUFDeEI7QUFFRCxTQUFPLFFBQVEsQ0FBRTtBQUNqQixPQUFLLFVBQVUsYUFBYSxPQUFPLENBQUMsQ0FBQyxLQUFLLFVBQVU7QUFDcEQsT0FBSyxZQUFZLGVBQWUsT0FBTyxDQUFDLENBQUMsS0FBSyxZQUFZLEtBQUs7QUFHL0QsTUFBSSxLQUFLLHNCQUFzQixRQUFRLFNBQVMsUUFBUTtBQUN0RCxZQUFRLEtBQUs7QUFBQTtBQUFBLGlFQUNnRDtBQUFBLEVBQzlEO0FBRUQsUUFBTSxFQUFFLFNBQVMsYUFBYU4sT0FBSyxlQUFlLEtBQUssTUFBTSxNQUFNO0FBQ25FQSxTQUFLLHFCQUFxQixLQUFLLFNBQVMsTUFBTSxNQUFNO0FBQ3BELFNBQU8sb0JBQW9CLFVBQVUsS0FBSyxNQUFNLElBQUk7QUFDdEQ7QUFFQSxTQUFTLG9CQUFxQixVQUFVLEtBQUssTUFBTSxNQUFNO0FBQ3ZELE1BQUksS0FBSyxVQUFVLENBQUMsS0FBSyxPQUFPLEtBQUssSUFBSTtBQUFHO0FBQzVDLFFBQU0sYUFBYXRDLE9BQUssUUFBUSxJQUFJO0FBQ3BDLE1BQUksQ0FBQ0QsS0FBRyxXQUFXLFVBQVU7QUFBRzRDLGlCQUFXLFVBQVU7QUFDckQsU0FBT0UsWUFBVSxVQUFVLEtBQUssTUFBTSxJQUFJO0FBQzVDO0FBRUEsU0FBU0EsWUFBVyxVQUFVLEtBQUssTUFBTSxNQUFNO0FBQzdDLE1BQUksS0FBSyxVQUFVLENBQUMsS0FBSyxPQUFPLEtBQUssSUFBSTtBQUFHO0FBQzVDLFNBQU9ILFdBQVMsVUFBVSxLQUFLLE1BQU0sSUFBSTtBQUMzQztBQUVBLFNBQVNBLFdBQVUsVUFBVSxLQUFLLE1BQU0sTUFBTTtBQUM1QyxRQUFNLFdBQVcsS0FBSyxjQUFjM0MsS0FBRyxXQUFXQSxLQUFHO0FBQ3JELFFBQU0sVUFBVSxTQUFTLEdBQUc7QUFFNUIsTUFBSSxRQUFRLFlBQWE7QUFBRSxXQUFPK0MsUUFBTSxTQUFTLFVBQVUsS0FBSyxNQUFNLElBQUk7QUFBQSxXQUNqRSxRQUFRLE9BQVEsS0FDaEIsUUFBUSxrQkFBbUIsS0FDM0IsUUFBUSxjQUFlO0FBQUUsV0FBT0MsU0FBTyxTQUFTLFVBQVUsS0FBSyxNQUFNLElBQUk7QUFBQSxXQUN6RSxRQUFRLGVBQWM7QUFBSSxXQUFPQyxTQUFPLFVBQVUsS0FBSyxNQUFNLElBQUk7QUFDNUU7QUFFQSxTQUFTRCxTQUFRLFNBQVMsVUFBVSxLQUFLLE1BQU0sTUFBTTtBQUNuRCxNQUFJLENBQUM7QUFBVSxXQUFPdEIsV0FBUyxTQUFTLEtBQUssTUFBTSxJQUFJO0FBQ3ZELFNBQU93QixjQUFZLFNBQVMsS0FBSyxNQUFNLElBQUk7QUFDN0M7QUFFQSxTQUFTQSxjQUFhLFNBQVMsS0FBSyxNQUFNLE1BQU07QUFDOUMsTUFBSSxLQUFLLFdBQVc7QUFDbEJsRCxTQUFHLFdBQVcsSUFBSTtBQUNsQixXQUFPMEIsV0FBUyxTQUFTLEtBQUssTUFBTSxJQUFJO0FBQUEsRUFDNUMsV0FBYSxLQUFLLGNBQWM7QUFDNUIsVUFBTSxJQUFJLE1BQU0sSUFBSSxzQkFBc0I7QUFBQSxFQUMzQztBQUNIO0FBRUEsU0FBU0EsV0FBVSxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQzNDLE1BQUksT0FBTzFCLEtBQUcsaUJBQWlCLFlBQVk7QUFDekNBLFNBQUcsYUFBYSxLQUFLLElBQUk7QUFDekJBLFNBQUcsVUFBVSxNQUFNLFFBQVEsSUFBSTtBQUMvQixRQUFJLEtBQUssb0JBQW9CO0FBQzNCLGFBQU8sV0FBVyxNQUFNLFFBQVEsT0FBTyxRQUFRLEtBQUs7QUFBQSxJQUNyRDtBQUNEO0FBQUEsRUFDRDtBQUNELFNBQU9tRCxtQkFBaUIsU0FBUyxLQUFLLE1BQU0sSUFBSTtBQUNsRDtBQUVBLFNBQVNBLG1CQUFrQixTQUFTLEtBQUssTUFBTSxNQUFNO0FBQ25ELFFBQU0sYUFBYSxLQUFLO0FBQ3hCLFFBQU0sUUFBUS9CLE9BQTBCLFVBQVU7QUFFbEQsUUFBTSxNQUFNcEIsS0FBRyxTQUFTLEtBQUssR0FBRztBQUNoQyxRQUFNLE1BQU1BLEtBQUcsU0FBUyxNQUFNLEtBQUssUUFBUSxJQUFJO0FBQy9DLE1BQUksTUFBTTtBQUVWLFNBQU8sTUFBTSxRQUFRLE1BQU07QUFDekIsVUFBTSxZQUFZQSxLQUFHLFNBQVMsS0FBSyxPQUFPLEdBQUcsWUFBWSxHQUFHO0FBQzVEQSxTQUFHLFVBQVUsS0FBSyxPQUFPLEdBQUcsU0FBUztBQUNyQyxXQUFPO0FBQUEsRUFDUjtBQUVELE1BQUksS0FBSztBQUFvQkEsU0FBRyxZQUFZLEtBQUssUUFBUSxPQUFPLFFBQVEsS0FBSztBQUU3RUEsT0FBRyxVQUFVLEdBQUc7QUFDaEJBLE9BQUcsVUFBVSxHQUFHO0FBQ2xCO0FBRUEsU0FBUytDLFFBQU8sU0FBUyxVQUFVLEtBQUssTUFBTSxNQUFNO0FBQ2xELE1BQUksQ0FBQztBQUFVLFdBQU9LLGVBQWEsU0FBUyxLQUFLLE1BQU0sSUFBSTtBQUMzRCxNQUFJLFlBQVksQ0FBQyxTQUFTLGVBQWU7QUFDdkMsVUFBTSxJQUFJLE1BQU0sbUNBQW1DLHlCQUF5QixPQUFPO0FBQUEsRUFDcEY7QUFDRCxTQUFPQyxVQUFRLEtBQUssTUFBTSxJQUFJO0FBQ2hDO0FBRUEsU0FBU0QsZUFBYyxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQy9DcEQsT0FBRyxVQUFVLElBQUk7QUFDakJxRCxZQUFRLEtBQUssTUFBTSxJQUFJO0FBQ3ZCLFNBQU9yRCxLQUFHLFVBQVUsTUFBTSxRQUFRLElBQUk7QUFDeEM7QUFFQSxTQUFTcUQsVUFBUyxLQUFLLE1BQU0sTUFBTTtBQUNqQ3JELE9BQUcsWUFBWSxHQUFHLEVBQUUsUUFBUSxVQUFRc0QsY0FBWSxNQUFNLEtBQUssTUFBTSxJQUFJLENBQUM7QUFDeEU7QUFFQSxTQUFTQSxjQUFhLE1BQU0sS0FBSyxNQUFNLE1BQU07QUFDM0MsUUFBTSxVQUFVckQsT0FBSyxLQUFLLEtBQUssSUFBSTtBQUNuQyxRQUFNLFdBQVdBLE9BQUssS0FBSyxNQUFNLElBQUk7QUFDckMsUUFBTSxFQUFFLFNBQVEsSUFBS3NDLE9BQUssZUFBZSxTQUFTLFVBQVUsTUFBTTtBQUNsRSxTQUFPTyxZQUFVLFVBQVUsU0FBUyxVQUFVLElBQUk7QUFDcEQ7QUFFQSxTQUFTRyxTQUFRLFVBQVUsS0FBSyxNQUFNLE1BQU07QUFDMUMsTUFBSSxjQUFjakQsS0FBRyxhQUFhLEdBQUc7QUFDckMsTUFBSSxLQUFLLGFBQWE7QUFDcEIsa0JBQWNDLE9BQUssUUFBUSxRQUFRLElBQUcsR0FBSSxXQUFXO0FBQUEsRUFDdEQ7QUFFRCxNQUFJLENBQUMsVUFBVTtBQUNiLFdBQU9ELEtBQUcsWUFBWSxhQUFhLElBQUk7QUFBQSxFQUMzQyxPQUFTO0FBQ0wsUUFBSTtBQUNKLFFBQUk7QUFDRixxQkFBZUEsS0FBRyxhQUFhLElBQUk7QUFBQSxJQUNwQyxTQUFRLEtBQVA7QUFJQSxVQUFJLElBQUksU0FBUyxZQUFZLElBQUksU0FBUztBQUFXLGVBQU9BLEtBQUcsWUFBWSxhQUFhLElBQUk7QUFDNUYsWUFBTTtBQUFBLElBQ1A7QUFDRCxRQUFJLEtBQUssYUFBYTtBQUNwQixxQkFBZUMsT0FBSyxRQUFRLFFBQVEsSUFBRyxHQUFJLFlBQVk7QUFBQSxJQUN4RDtBQUNELFFBQUlzQyxPQUFLLFlBQVksYUFBYSxZQUFZLEdBQUc7QUFDL0MsWUFBTSxJQUFJLE1BQU0sZ0JBQWdCLDhDQUE4QyxnQkFBZ0I7QUFBQSxJQUMvRjtBQUtELFFBQUl2QyxLQUFHLFNBQVMsSUFBSSxFQUFFLGlCQUFpQnVDLE9BQUssWUFBWSxjQUFjLFdBQVcsR0FBRztBQUNsRixZQUFNLElBQUksTUFBTSxxQkFBcUIsdUJBQXVCLGVBQWU7QUFBQSxJQUM1RTtBQUNELFdBQU9nQixXQUFTLGFBQWEsSUFBSTtBQUFBLEVBQ2xDO0FBQ0g7QUFFQSxTQUFTQSxXQUFVLGFBQWEsTUFBTTtBQUNwQ3ZELE9BQUcsV0FBVyxJQUFJO0FBQ2xCLFNBQU9BLEtBQUcsWUFBWSxhQUFhLElBQUk7QUFDekM7QUFFQSxJQUFBLGFBQWlCNkM7QUNqS2pCLElBQUFBLGFBQWlCO0FBQUEsRUFDZixVQUFVaEQ7QUFDWjtBQ0hBLE1BQU1xQyxNQUFJckMsYUFBd0I7QUFDbEMsTUFBTUcsT0FBS1k7QUFFWCxTQUFTNEMsYUFBWXZELE9BQU07QUFDekIsU0FBT0QsS0FBRyxPQUFPQyxLQUFJLEVBQUUsS0FBSyxNQUFNLElBQUksRUFBRSxNQUFNLE1BQU0sS0FBSztBQUMzRDtBQUVBLElBQUEsZUFBaUI7QUFBQSxFQUNmLFlBQVlpQyxJQUFFc0IsWUFBVTtBQUFBLEVBQ3hCLGdCQUFnQnhELEtBQUc7QUFDckI7QUNUQSxNQUFNQSxPQUFLSDtBQUNYLE1BQU1JLFNBQU9XLG9CQUFlO0FBQzVCLE1BQU02QyxXQUFTNUMsU0FBcUI7QUFDcEMsTUFBTTJDLGVBQWExQyxhQUEwQjtBQUM3QyxNQUFNLFNBQVNFLFNBQTBCO0FBQ3pDLE1BQU11QixTQUFPbkI7QUFFYixTQUFTVCxPQUFNLEtBQUssTUFBTSxNQUFNLElBQUk7QUFDbEMsTUFBSSxPQUFPLFNBQVMsY0FBYyxDQUFDLElBQUk7QUFDckMsU0FBSztBQUNMLFdBQU8sQ0FBRTtBQUFBLEVBQ2IsV0FBYSxPQUFPLFNBQVMsWUFBWTtBQUNyQyxXQUFPLEVBQUUsUUFBUSxLQUFNO0FBQUEsRUFDeEI7QUFFRCxPQUFLLE1BQU0sV0FBWTtBQUFBLEVBQUU7QUFDekIsU0FBTyxRQUFRLENBQUU7QUFFakIsT0FBSyxVQUFVLGFBQWEsT0FBTyxDQUFDLENBQUMsS0FBSyxVQUFVO0FBQ3BELE9BQUssWUFBWSxlQUFlLE9BQU8sQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLO0FBRy9ELE1BQUksS0FBSyxzQkFBc0IsUUFBUSxTQUFTLFFBQVE7QUFDdEQsWUFBUSxLQUFLO0FBQUE7QUFBQSxpRUFDZ0Q7QUFBQSxFQUM5RDtBQUVENEIsU0FBSyxXQUFXLEtBQUssTUFBTSxRQUFRLENBQUMsS0FBSyxVQUFVO0FBQ2pELFFBQUk7QUFBSyxhQUFPLEdBQUcsR0FBRztBQUN0QixVQUFNLEVBQUUsU0FBUyxTQUFRLElBQUs7QUFDOUJBLFdBQUssaUJBQWlCLEtBQUssU0FBUyxNQUFNLFFBQVEsQ0FBQW5DLFNBQU87QUFDdkQsVUFBSUE7QUFBSyxlQUFPLEdBQUdBLElBQUc7QUFDdEIsVUFBSSxLQUFLO0FBQVEsZUFBTyxhQUFhLGdCQUFnQixVQUFVLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFDbEYsYUFBTyxlQUFlLFVBQVUsS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUFBLElBQ3pELENBQUs7QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLFNBQVMsZUFBZ0IsVUFBVSxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ3RELFFBQU0sYUFBYUgsT0FBSyxRQUFRLElBQUk7QUFDcEN1RCxlQUFXLFlBQVksQ0FBQyxLQUFLLGNBQWM7QUFDekMsUUFBSTtBQUFLLGFBQU8sR0FBRyxHQUFHO0FBQ3RCLFFBQUk7QUFBVyxhQUFPLFVBQVUsVUFBVSxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQzdEQyxhQUFPLFlBQVksQ0FBQXJELFNBQU87QUFDeEIsVUFBSUE7QUFBSyxlQUFPLEdBQUdBLElBQUc7QUFDdEIsYUFBTyxVQUFVLFVBQVUsS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUFBLElBQ3BELENBQUs7QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLFNBQVMsYUFBYyxXQUFXLFVBQVUsS0FBSyxNQUFNLE1BQU0sSUFBSTtBQUMvRCxVQUFRLFFBQVEsS0FBSyxPQUFPLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxhQUFXO0FBQ3RELFFBQUk7QUFBUyxhQUFPLFVBQVUsVUFBVSxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQzNELFdBQU8sR0FBSTtBQUFBLEVBQ2YsR0FBSyxXQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCO0FBRUEsU0FBUyxVQUFXLFVBQVUsS0FBSyxNQUFNLE1BQU0sSUFBSTtBQUNqRCxNQUFJLEtBQUs7QUFBUSxXQUFPLGFBQWEsVUFBVSxVQUFVLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFDNUUsU0FBTyxTQUFTLFVBQVUsS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUMvQztBQUVBLFNBQVMsU0FBVSxVQUFVLEtBQUssTUFBTSxNQUFNLElBQUk7QUFDaEQsUUFBTW1DLFFBQU8sS0FBSyxjQUFjdkMsS0FBRyxPQUFPQSxLQUFHO0FBQzdDLEVBQUF1QyxNQUFLLEtBQUssQ0FBQyxLQUFLLFlBQVk7QUFDMUIsUUFBSTtBQUFLLGFBQU8sR0FBRyxHQUFHO0FBRXRCLFFBQUksUUFBUTtBQUFlLGFBQU8sTUFBTSxTQUFTLFVBQVUsS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUFBLGFBQ3JFLFFBQVEsT0FBUSxLQUNoQixRQUFRLGtCQUFtQixLQUMzQixRQUFRO0FBQWlCLGFBQU8sT0FBTyxTQUFTLFVBQVUsS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUFBLGFBQzdFLFFBQVEsZUFBZ0I7QUFBRSxhQUFPLE9BQU8sVUFBVSxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQUEsRUFDbEYsQ0FBRztBQUNIO0FBRUEsU0FBUyxPQUFRLFNBQVMsVUFBVSxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ3ZELE1BQUksQ0FBQztBQUFVLFdBQU8sU0FBUyxTQUFTLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFDM0QsU0FBTyxZQUFZLFNBQVMsS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUNqRDtBQUVBLFNBQVMsWUFBYSxTQUFTLEtBQUssTUFBTSxNQUFNLElBQUk7QUFDbEQsTUFBSSxLQUFLLFdBQVc7QUFDbEJ2QyxTQUFHLE9BQU8sTUFBTSxTQUFPO0FBQ3JCLFVBQUk7QUFBSyxlQUFPLEdBQUcsR0FBRztBQUN0QixhQUFPLFNBQVMsU0FBUyxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQUEsSUFDbEQsQ0FBSztBQUFBLEVBQ0wsV0FBYSxLQUFLLGNBQWM7QUFDNUIsV0FBTyxHQUFHLElBQUksTUFBTSxJQUFJLHNCQUFzQixDQUFDO0FBQUEsRUFDaEQ7QUFBTSxXQUFPLEdBQUk7QUFDcEI7QUFFQSxTQUFTLFNBQVUsU0FBUyxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQy9DLE1BQUksT0FBT0EsS0FBRyxhQUFhLFlBQVk7QUFDckMsV0FBT0EsS0FBRyxTQUFTLEtBQUssTUFBTSxTQUFPO0FBQ25DLFVBQUk7QUFBSyxlQUFPLEdBQUcsR0FBRztBQUN0QixhQUFPLHlCQUF5QixTQUFTLE1BQU0sTUFBTSxFQUFFO0FBQUEsSUFDN0QsQ0FBSztBQUFBLEVBQ0Y7QUFDRCxTQUFPLGlCQUFpQixTQUFTLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFDdEQ7QUFFQSxTQUFTLGlCQUFrQixTQUFTLEtBQUssTUFBTSxNQUFNLElBQUk7QUFDdkQsUUFBTSxLQUFLQSxLQUFHLGlCQUFpQixHQUFHO0FBQ2xDLEtBQUcsR0FBRyxTQUFTLFNBQU8sR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLFFBQVEsTUFBTTtBQUNoRCxVQUFNLEtBQUtBLEtBQUcsa0JBQWtCLE1BQU0sRUFBRSxNQUFNLFFBQVEsTUFBTTtBQUM1RCxPQUFHLEdBQUcsU0FBUyxTQUFPLEdBQUcsR0FBRyxDQUFDLEVBQzFCLEdBQUcsUUFBUSxNQUFNLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFDNUIsS0FBSyxTQUFTLE1BQU0seUJBQXlCLFNBQVMsTUFBTSxNQUFNLEVBQUUsQ0FBQztBQUFBLEVBQzVFLENBQUc7QUFDSDtBQUVBLFNBQVMseUJBQTBCLFNBQVMsTUFBTSxNQUFNLElBQUk7QUFDMURBLE9BQUcsTUFBTSxNQUFNLFFBQVEsTUFBTSxTQUFPO0FBQ2xDLFFBQUk7QUFBSyxhQUFPLEdBQUcsR0FBRztBQUN0QixRQUFJLEtBQUssb0JBQW9CO0FBQzNCLGFBQU8sT0FBTyxNQUFNLFFBQVEsT0FBTyxRQUFRLE9BQU8sRUFBRTtBQUFBLElBQ3JEO0FBQ0QsV0FBTyxHQUFJO0FBQUEsRUFDZixDQUFHO0FBQ0g7QUFFQSxTQUFTLE1BQU8sU0FBUyxVQUFVLEtBQUssTUFBTSxNQUFNLElBQUk7QUFDdEQsTUFBSSxDQUFDO0FBQVUsV0FBTyxhQUFhLFNBQVMsS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUMvRCxNQUFJLFlBQVksQ0FBQyxTQUFTLGVBQWU7QUFDdkMsV0FBTyxHQUFHLElBQUksTUFBTSxtQ0FBbUMseUJBQXlCLE9BQU8sQ0FBQztBQUFBLEVBQ3pGO0FBQ0QsU0FBTyxRQUFRLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFDcEM7QUFFQSxTQUFTLGFBQWMsU0FBUyxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ25EQSxPQUFHLE1BQU0sTUFBTSxTQUFPO0FBQ3BCLFFBQUk7QUFBSyxhQUFPLEdBQUcsR0FBRztBQUN0QixZQUFRLEtBQUssTUFBTSxNQUFNLENBQUFJLFNBQU87QUFDOUIsVUFBSUE7QUFBSyxlQUFPLEdBQUdBLElBQUc7QUFDdEIsYUFBT0osS0FBRyxNQUFNLE1BQU0sUUFBUSxNQUFNLEVBQUU7QUFBQSxJQUM1QyxDQUFLO0FBQUEsRUFDTCxDQUFHO0FBQ0g7QUFFQSxTQUFTLFFBQVMsS0FBSyxNQUFNLE1BQU0sSUFBSTtBQUNyQ0EsT0FBRyxRQUFRLEtBQUssQ0FBQyxLQUFLLFVBQVU7QUFDOUIsUUFBSTtBQUFLLGFBQU8sR0FBRyxHQUFHO0FBQ3RCLFdBQU8sYUFBYSxPQUFPLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFBQSxFQUNsRCxDQUFHO0FBQ0g7QUFFQSxTQUFTLGFBQWMsT0FBTyxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ2pELFFBQU0sT0FBTyxNQUFNLElBQUs7QUFDeEIsTUFBSSxDQUFDO0FBQU0sV0FBTyxHQUFJO0FBQ3RCLFNBQU8sWUFBWSxPQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU0sRUFBRTtBQUNyRDtBQUVBLFNBQVMsWUFBYSxPQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU0sSUFBSTtBQUN0RCxRQUFNLFVBQVVDLE9BQUssS0FBSyxLQUFLLElBQUk7QUFDbkMsUUFBTSxXQUFXQSxPQUFLLEtBQUssTUFBTSxJQUFJO0FBQ3JDc0MsU0FBSyxXQUFXLFNBQVMsVUFBVSxRQUFRLENBQUMsS0FBSyxVQUFVO0FBQ3pELFFBQUk7QUFBSyxhQUFPLEdBQUcsR0FBRztBQUN0QixVQUFNLEVBQUUsU0FBUSxJQUFLO0FBQ3JCLGNBQVUsVUFBVSxTQUFTLFVBQVUsTUFBTSxDQUFBbkMsU0FBTztBQUNsRCxVQUFJQTtBQUFLLGVBQU8sR0FBR0EsSUFBRztBQUN0QixhQUFPLGFBQWEsT0FBTyxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQUEsSUFDcEQsQ0FBSztBQUFBLEVBQ0wsQ0FBRztBQUNIO0FBRUEsU0FBUyxPQUFRLFVBQVUsS0FBSyxNQUFNLE1BQU0sSUFBSTtBQUM5Q0osT0FBRyxTQUFTLEtBQUssQ0FBQyxLQUFLLGdCQUFnQjtBQUNyQyxRQUFJO0FBQUssYUFBTyxHQUFHLEdBQUc7QUFDdEIsUUFBSSxLQUFLLGFBQWE7QUFDcEIsb0JBQWNDLE9BQUssUUFBUSxRQUFRLElBQUcsR0FBSSxXQUFXO0FBQUEsSUFDdEQ7QUFFRCxRQUFJLENBQUMsVUFBVTtBQUNiLGFBQU9ELEtBQUcsUUFBUSxhQUFhLE1BQU0sRUFBRTtBQUFBLElBQzdDLE9BQVc7QUFDTEEsV0FBRyxTQUFTLE1BQU0sQ0FBQ0ksTUFBSyxpQkFBaUI7QUFDdkMsWUFBSUEsTUFBSztBQUlQLGNBQUlBLEtBQUksU0FBUyxZQUFZQSxLQUFJLFNBQVM7QUFBVyxtQkFBT0osS0FBRyxRQUFRLGFBQWEsTUFBTSxFQUFFO0FBQzVGLGlCQUFPLEdBQUdJLElBQUc7QUFBQSxRQUNkO0FBQ0QsWUFBSSxLQUFLLGFBQWE7QUFDcEIseUJBQWVILE9BQUssUUFBUSxRQUFRLElBQUcsR0FBSSxZQUFZO0FBQUEsUUFDeEQ7QUFDRCxZQUFJc0MsT0FBSyxZQUFZLGFBQWEsWUFBWSxHQUFHO0FBQy9DLGlCQUFPLEdBQUcsSUFBSSxNQUFNLGdCQUFnQiw4Q0FBOEMsZ0JBQWdCLENBQUM7QUFBQSxRQUNwRztBQUtELFlBQUksU0FBUyxpQkFBaUJBLE9BQUssWUFBWSxjQUFjLFdBQVcsR0FBRztBQUN6RSxpQkFBTyxHQUFHLElBQUksTUFBTSxxQkFBcUIsdUJBQXVCLGVBQWUsQ0FBQztBQUFBLFFBQ2pGO0FBQ0QsZUFBTyxTQUFTLGFBQWEsTUFBTSxFQUFFO0FBQUEsTUFDN0MsQ0FBTztBQUFBLElBQ0Y7QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLFNBQVMsU0FBVSxhQUFhLE1BQU0sSUFBSTtBQUN4Q3ZDLE9BQUcsT0FBTyxNQUFNLFNBQU87QUFDckIsUUFBSTtBQUFLLGFBQU8sR0FBRyxHQUFHO0FBQ3RCLFdBQU9BLEtBQUcsUUFBUSxhQUFhLE1BQU0sRUFBRTtBQUFBLEVBQzNDLENBQUc7QUFDSDtBQUVBLElBQUEsU0FBaUJXO0FDak5qQixNQUFNdUIsTUFBSXJDLGFBQXdCO0FBQ2xDLElBQUFjLFNBQWlCO0FBQUEsRUFDZixNQUFNdUIsSUFBRXRCLE1BQWlCO0FBQzNCO0FDSEEsTUFBTVosT0FBS0g7QUFDWCxNQUFNSSxTQUFPVyxvQkFBZTtBQUM1QixNQUFNLFNBQVNDLG9CQUFpQjtBQUVoQyxNQUFNNkMsY0FBYSxRQUFRLGFBQWE7QUFFeEMsU0FBUyxTQUFVLFNBQVM7QUFDMUIsUUFBTSxVQUFVO0FBQUEsSUFDZDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUNELFVBQVEsUUFBUSxPQUFLO0FBQ25CLFlBQVEsS0FBSyxRQUFRLE1BQU0xRCxLQUFHO0FBQzlCLFFBQUksSUFBSTtBQUNSLFlBQVEsS0FBSyxRQUFRLE1BQU1BLEtBQUc7QUFBQSxFQUNsQyxDQUFHO0FBRUQsVUFBUSxlQUFlLFFBQVEsZ0JBQWdCO0FBQ2pEO0FBRUEsU0FBUzJELFNBQVEsR0FBRyxTQUFTLElBQUk7QUFDL0IsTUFBSSxZQUFZO0FBRWhCLE1BQUksT0FBTyxZQUFZLFlBQVk7QUFDakMsU0FBSztBQUNMLGNBQVUsQ0FBRTtBQUFBLEVBQ2I7QUFFRCxTQUFPLEdBQUcsc0JBQXNCO0FBQ2hDLFNBQU8sWUFBWSxPQUFPLEdBQUcsVUFBVSxpQ0FBaUM7QUFDeEUsU0FBTyxZQUFZLE9BQU8sSUFBSSxZQUFZLG9DQUFvQztBQUM5RSxTQUFPLFNBQVMsMkNBQTJDO0FBQzNELFNBQU8sWUFBWSxPQUFPLFNBQVMsVUFBVSxrQ0FBa0M7QUFFL0UsV0FBUyxPQUFPO0FBRWhCLFVBQVEsR0FBRyxTQUFTLFNBQVMsR0FBSSxJQUFJO0FBQ25DLFFBQUksSUFBSTtBQUNOLFdBQUssR0FBRyxTQUFTLFdBQVcsR0FBRyxTQUFTLGVBQWUsR0FBRyxTQUFTLFlBQy9ELFlBQVksUUFBUSxjQUFjO0FBQ3BDO0FBQ0EsY0FBTSxPQUFPLFlBQVk7QUFFekIsZUFBTyxXQUFXLE1BQU0sUUFBUSxHQUFHLFNBQVMsRUFBRSxHQUFHLElBQUk7QUFBQSxNQUN0RDtBQUdELFVBQUksR0FBRyxTQUFTO0FBQVUsYUFBSztBQUFBLElBQ2hDO0FBRUQsT0FBRyxFQUFFO0FBQUEsRUFDVCxDQUFHO0FBQ0g7QUFhQSxTQUFTLFFBQVMsR0FBRyxTQUFTLElBQUk7QUFDaEMsU0FBTyxDQUFDO0FBQ1IsU0FBTyxPQUFPO0FBQ2QsU0FBTyxPQUFPLE9BQU8sVUFBVTtBQUkvQixVQUFRLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTztBQUMzQixRQUFJLE1BQU0sR0FBRyxTQUFTLFVBQVU7QUFDOUIsYUFBTyxHQUFHLElBQUk7QUFBQSxJQUNmO0FBR0QsUUFBSSxNQUFNLEdBQUcsU0FBUyxXQUFXRCxhQUFXO0FBQzFDLGFBQU8sWUFBWSxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQUEsSUFDdEM7QUFFRCxRQUFJLE1BQU0sR0FBRyxlQUFlO0FBQzFCLGFBQU8sTUFBTSxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQUEsSUFDaEM7QUFFRCxZQUFRLE9BQU8sR0FBRyxDQUFBcEQsUUFBTTtBQUN0QixVQUFJQSxLQUFJO0FBQ04sWUFBSUEsSUFBRyxTQUFTLFVBQVU7QUFDeEIsaUJBQU8sR0FBRyxJQUFJO0FBQUEsUUFDZjtBQUNELFlBQUlBLElBQUcsU0FBUyxTQUFTO0FBQ3ZCLGlCQUFRb0QsY0FDSixZQUFZLEdBQUcsU0FBU3BELEtBQUksRUFBRSxJQUM5QixNQUFNLEdBQUcsU0FBU0EsS0FBSSxFQUFFO0FBQUEsUUFDN0I7QUFDRCxZQUFJQSxJQUFHLFNBQVMsVUFBVTtBQUN4QixpQkFBTyxNQUFNLEdBQUcsU0FBU0EsS0FBSSxFQUFFO0FBQUEsUUFDaEM7QUFBQSxNQUNGO0FBQ0QsYUFBTyxHQUFHQSxHQUFFO0FBQUEsSUFDbEIsQ0FBSztBQUFBLEVBQ0wsQ0FBRztBQUNIO0FBRUEsU0FBUyxZQUFhLEdBQUcsU0FBUyxJQUFJLElBQUk7QUFDeEMsU0FBTyxDQUFDO0FBQ1IsU0FBTyxPQUFPO0FBQ2QsU0FBTyxPQUFPLE9BQU8sVUFBVTtBQUMvQixNQUFJLElBQUk7QUFDTixXQUFPLGNBQWMsS0FBSztBQUFBLEVBQzNCO0FBRUQsVUFBUSxNQUFNLEdBQUcsS0FBTyxTQUFPO0FBQzdCLFFBQUksS0FBSztBQUNQLFNBQUcsSUFBSSxTQUFTLFdBQVcsT0FBTyxFQUFFO0FBQUEsSUFDMUMsT0FBVztBQUNMLGNBQVEsS0FBSyxHQUFHLENBQUMsS0FBSyxVQUFVO0FBQzlCLFlBQUksS0FBSztBQUNQLGFBQUcsSUFBSSxTQUFTLFdBQVcsT0FBTyxFQUFFO0FBQUEsUUFDOUMsV0FBbUIsTUFBTSxlQUFlO0FBQzlCLGdCQUFNLEdBQUcsU0FBUyxJQUFJLEVBQUU7QUFBQSxRQUNsQyxPQUFlO0FBQ0wsa0JBQVEsT0FBTyxHQUFHLEVBQUU7QUFBQSxRQUNyQjtBQUFBLE1BQ1QsQ0FBTztBQUFBLElBQ0Y7QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLFNBQVMsZ0JBQWlCLEdBQUcsU0FBUyxJQUFJO0FBQ3hDLE1BQUk7QUFFSixTQUFPLENBQUM7QUFDUixTQUFPLE9BQU87QUFDZCxNQUFJLElBQUk7QUFDTixXQUFPLGNBQWMsS0FBSztBQUFBLEVBQzNCO0FBRUQsTUFBSTtBQUNGLFlBQVEsVUFBVSxHQUFHLEdBQUs7QUFBQSxFQUMzQixTQUFRLEtBQVA7QUFDQSxRQUFJLElBQUksU0FBUyxVQUFVO0FBQ3pCO0FBQUEsSUFDTixPQUFXO0FBQ0wsWUFBTTtBQUFBLElBQ1A7QUFBQSxFQUNGO0FBRUQsTUFBSTtBQUNGLFlBQVEsUUFBUSxTQUFTLENBQUM7QUFBQSxFQUMzQixTQUFRLEtBQVA7QUFDQSxRQUFJLElBQUksU0FBUyxVQUFVO0FBQ3pCO0FBQUEsSUFDTixPQUFXO0FBQ0wsWUFBTTtBQUFBLElBQ1A7QUFBQSxFQUNGO0FBRUQsTUFBSSxNQUFNLGVBQWU7QUFDdkIsY0FBVSxHQUFHLFNBQVMsRUFBRTtBQUFBLEVBQzVCLE9BQVM7QUFDTCxZQUFRLFdBQVcsQ0FBQztBQUFBLEVBQ3JCO0FBQ0g7QUFFQSxTQUFTLE1BQU8sR0FBRyxTQUFTLFlBQVksSUFBSTtBQUMxQyxTQUFPLENBQUM7QUFDUixTQUFPLE9BQU87QUFDZCxNQUFJLFlBQVk7QUFDZCxXQUFPLHNCQUFzQixLQUFLO0FBQUEsRUFDbkM7QUFDRCxTQUFPLE9BQU8sT0FBTyxVQUFVO0FBSy9CLFVBQVEsTUFBTSxHQUFHLFFBQU07QUFDckIsUUFBSSxPQUFPLEdBQUcsU0FBUyxlQUFlLEdBQUcsU0FBUyxZQUFZLEdBQUcsU0FBUyxVQUFVO0FBQ2xGLGFBQU8sR0FBRyxTQUFTLEVBQUU7QUFBQSxJQUN0QixXQUFVLE1BQU0sR0FBRyxTQUFTLFdBQVc7QUFDdEMsU0FBRyxVQUFVO0FBQUEsSUFDbkIsT0FBVztBQUNMLFNBQUcsRUFBRTtBQUFBLElBQ047QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLFNBQVMsT0FBUSxHQUFHLFNBQVMsSUFBSTtBQUMvQixTQUFPLENBQUM7QUFDUixTQUFPLE9BQU87QUFDZCxTQUFPLE9BQU8sT0FBTyxVQUFVO0FBRS9CLFVBQVEsUUFBUSxHQUFHLENBQUMsSUFBSSxVQUFVO0FBQ2hDLFFBQUk7QUFBSSxhQUFPLEdBQUcsRUFBRTtBQUVwQixRQUFJLElBQUksTUFBTTtBQUNkLFFBQUk7QUFFSixRQUFJLE1BQU07QUFBRyxhQUFPLFFBQVEsTUFBTSxHQUFHLEVBQUU7QUFFdkMsVUFBTSxRQUFRLE9BQUs7QUFDakJxRCxlQUFPMUQsT0FBSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQUssUUFBTTtBQUNyQyxZQUFJLFVBQVU7QUFDWjtBQUFBLFFBQ0Q7QUFDRCxZQUFJQTtBQUFJLGlCQUFPLEdBQUcsV0FBV0EsR0FBRTtBQUMvQixZQUFJLEVBQUUsTUFBTSxHQUFHO0FBQ2Isa0JBQVEsTUFBTSxHQUFHLEVBQUU7QUFBQSxRQUNwQjtBQUFBLE1BQ1QsQ0FBTztBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0wsQ0FBRztBQUNIO0FBS0EsU0FBUyxXQUFZLEdBQUcsU0FBUztBQUMvQixNQUFJO0FBRUosWUFBVSxXQUFXLENBQUU7QUFDdkIsV0FBUyxPQUFPO0FBRWhCLFNBQU8sR0FBRyxzQkFBc0I7QUFDaEMsU0FBTyxZQUFZLE9BQU8sR0FBRyxVQUFVLGlDQUFpQztBQUN4RSxTQUFPLFNBQVMseUJBQXlCO0FBQ3pDLFNBQU8sWUFBWSxPQUFPLFNBQVMsVUFBVSxrQ0FBa0M7QUFFL0UsTUFBSTtBQUNGLFNBQUssUUFBUSxVQUFVLENBQUM7QUFBQSxFQUN6QixTQUFRLElBQVA7QUFDQSxRQUFJLEdBQUcsU0FBUyxVQUFVO0FBQ3hCO0FBQUEsSUFDRDtBQUdELFFBQUksR0FBRyxTQUFTLFdBQVdvRCxhQUFXO0FBQ3BDLHNCQUFnQixHQUFHLFNBQVMsRUFBRTtBQUFBLElBQy9CO0FBQUEsRUFDRjtBQUVELE1BQUk7QUFFRixRQUFJLE1BQU0sR0FBRyxlQUFlO0FBQzFCLGdCQUFVLEdBQUcsU0FBUyxJQUFJO0FBQUEsSUFDaEMsT0FBVztBQUNMLGNBQVEsV0FBVyxDQUFDO0FBQUEsSUFDckI7QUFBQSxFQUNGLFNBQVEsSUFBUDtBQUNBLFFBQUksR0FBRyxTQUFTLFVBQVU7QUFDeEI7QUFBQSxJQUNOLFdBQWUsR0FBRyxTQUFTLFNBQVM7QUFDOUIsYUFBT0EsY0FBWSxnQkFBZ0IsR0FBRyxTQUFTLEVBQUUsSUFBSSxVQUFVLEdBQUcsU0FBUyxFQUFFO0FBQUEsSUFDbkYsV0FBZSxHQUFHLFNBQVMsVUFBVTtBQUMvQixZQUFNO0FBQUEsSUFDUDtBQUNELGNBQVUsR0FBRyxTQUFTLEVBQUU7QUFBQSxFQUN6QjtBQUNIO0FBRUEsU0FBUyxVQUFXLEdBQUcsU0FBUyxZQUFZO0FBQzFDLFNBQU8sQ0FBQztBQUNSLFNBQU8sT0FBTztBQUNkLE1BQUksWUFBWTtBQUNkLFdBQU8sc0JBQXNCLEtBQUs7QUFBQSxFQUNuQztBQUVELE1BQUk7QUFDRixZQUFRLFVBQVUsQ0FBQztBQUFBLEVBQ3BCLFNBQVEsSUFBUDtBQUNBLFFBQUksR0FBRyxTQUFTLFdBQVc7QUFDekIsWUFBTTtBQUFBLElBQ1osV0FBZSxHQUFHLFNBQVMsZUFBZSxHQUFHLFNBQVMsWUFBWSxHQUFHLFNBQVMsU0FBUztBQUNqRixpQkFBVyxHQUFHLE9BQU87QUFBQSxJQUMzQixXQUFlLEdBQUcsU0FBUyxVQUFVO0FBQy9CLFlBQU07QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUNIO0FBRUEsU0FBUyxXQUFZLEdBQUcsU0FBUztBQUMvQixTQUFPLENBQUM7QUFDUixTQUFPLE9BQU87QUFDZCxVQUFRLFlBQVksQ0FBQyxFQUFFLFFBQVEsT0FBSyxXQUFXekQsT0FBSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUV4RSxNQUFJeUQsYUFBVztBQU9iLFVBQU0sWUFBWSxLQUFLLElBQUs7QUFDNUIsT0FBRztBQUNELFVBQUk7QUFDRixjQUFNLE1BQU0sUUFBUSxVQUFVLEdBQUcsT0FBTztBQUN4QyxlQUFPO0FBQUEsTUFDZixTQUFlLElBQVA7QUFBQSxNQUFjO0FBQUEsSUFDakIsU0FBUSxLQUFLLFFBQVEsWUFBWTtBQUFBLEVBQ3RDLE9BQVM7QUFDTCxVQUFNLE1BQU0sUUFBUSxVQUFVLEdBQUcsT0FBTztBQUN4QyxXQUFPO0FBQUEsRUFDUjtBQUNIO0FBRUEsSUFBQSxXQUFpQkM7QUFDakJBLFNBQU8sT0FBTztBQ3ZUZCxNQUFNekIsTUFBSXJDLGFBQXdCO0FBQ2xDLE1BQU0sU0FBU2U7QUFFZixJQUFBZ0QsV0FBaUI7QUFBQSxFQUNmLFFBQVExQixJQUFFLE1BQU07QUFBQSxFQUNoQixZQUFZLE9BQU87QUFDckI7QUNOQSxNQUFNQSxNQUFJckMsYUFBd0I7QUFDbEMsTUFBTUcsT0FBS1k7QUFDWCxNQUFNWCxTQUFPWSxvQkFBZTtBQUM1QixNQUFNZ0QsVUFBUS9DO0FBQ2QsTUFBTThDLFdBQVM1QztBQUVmLE1BQU0sV0FBV2tCLElBQUUsU0FBUzRCLFVBQVUsS0FBSyxVQUFVO0FBQ25ELGFBQVcsWUFBWSxXQUFZO0FBQUEsRUFBRTtBQUNyQzlELE9BQUcsUUFBUSxLQUFLLENBQUMsS0FBSyxVQUFVO0FBQzlCLFFBQUk7QUFBSyxhQUFPNkQsUUFBTSxPQUFPLEtBQUssUUFBUTtBQUUxQyxZQUFRLE1BQU0sSUFBSSxVQUFRNUQsT0FBSyxLQUFLLEtBQUssSUFBSSxDQUFDO0FBRTlDLGVBQVk7QUFFWixhQUFTLGFBQWM7QUFDckIsWUFBTSxPQUFPLE1BQU0sSUFBSztBQUN4QixVQUFJLENBQUM7QUFBTSxlQUFPLFNBQVU7QUFDNUIyRCxlQUFPLE9BQU8sTUFBTSxDQUFBeEQsU0FBTztBQUN6QixZQUFJQTtBQUFLLGlCQUFPLFNBQVNBLElBQUc7QUFDNUIsbUJBQVk7QUFBQSxNQUNwQixDQUFPO0FBQUEsSUFDRjtBQUFBLEVBQ0wsQ0FBRztBQUNILENBQUM7QUFFRCxTQUFTLGFBQWMsS0FBSztBQUMxQixNQUFJO0FBQ0osTUFBSTtBQUNGLFlBQVFKLEtBQUcsWUFBWSxHQUFHO0FBQUEsRUFDM0IsU0FBUSxLQUFQO0FBQ0EsV0FBTzZELFFBQU0sV0FBVyxHQUFHO0FBQUEsRUFDNUI7QUFFRCxRQUFNLFFBQVEsVUFBUTtBQUNwQixXQUFPNUQsT0FBSyxLQUFLLEtBQUssSUFBSTtBQUMxQjJELGFBQU8sV0FBVyxJQUFJO0FBQUEsRUFDMUIsQ0FBRztBQUNIO0FBRUEsSUFBQSxRQUFpQjtBQUFBLEVBQ2Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxFQUNkO0FBQUEsRUFDQSxVQUFVO0FBQ1o7QUM3Q0EsTUFBTTFCLE1BQUlyQyxhQUF3QjtBQUNsQyxNQUFNSSxTQUFPVyxvQkFBZTtBQUM1QixNQUFNWixPQUFLYTtBQUNYLE1BQU1nRCxVQUFRL0M7QUFDZCxNQUFNMEMsZUFBYXhDLGFBQTBCO0FBRTdDLFNBQVMsV0FBWStDLE9BQU0sVUFBVTtBQUNuQyxXQUFTLFdBQVk7QUFDbkIvRCxTQUFHLFVBQVUrRCxPQUFNLElBQUksU0FBTztBQUM1QixVQUFJO0FBQUssZUFBTyxTQUFTLEdBQUc7QUFDNUIsZUFBVTtBQUFBLElBQ2hCLENBQUs7QUFBQSxFQUNGO0FBRUQvRCxPQUFHLEtBQUsrRCxPQUFNLENBQUMsS0FBSyxVQUFVO0FBQzVCLFFBQUksQ0FBQyxPQUFPLE1BQU0sT0FBUTtBQUFFLGFBQU8sU0FBVTtBQUM3QyxVQUFNLE1BQU05RCxPQUFLLFFBQVE4RCxLQUFJO0FBQzdCUCxpQkFBVyxLQUFLLENBQUNwRCxNQUFLLGNBQWM7QUFDbEMsVUFBSUE7QUFBSyxlQUFPLFNBQVNBLElBQUc7QUFDNUIsVUFBSTtBQUFXLGVBQU8sU0FBVTtBQUNoQ3lELGNBQU0sT0FBTyxLQUFLLENBQUF6RCxTQUFPO0FBQ3ZCLFlBQUlBO0FBQUssaUJBQU8sU0FBU0EsSUFBRztBQUM1QixpQkFBVTtBQUFBLE1BQ2xCLENBQU87QUFBQSxJQUNQLENBQUs7QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLFNBQVMsZUFBZ0IyRCxPQUFNO0FBQzdCLE1BQUk7QUFDSixNQUFJO0FBQ0YsWUFBUS9ELEtBQUcsU0FBUytELEtBQUk7QUFBQSxFQUM1QixTQUFXLEdBQVA7QUFBQSxFQUFZO0FBQ2QsTUFBSSxTQUFTLE1BQU0sT0FBTTtBQUFJO0FBRTdCLFFBQU0sTUFBTTlELE9BQUssUUFBUThELEtBQUk7QUFDN0IsTUFBSSxDQUFDL0QsS0FBRyxXQUFXLEdBQUcsR0FBRztBQUN2QjZELFlBQU0sV0FBVyxHQUFHO0FBQUEsRUFDckI7QUFFRDdELE9BQUcsY0FBYytELE9BQU0sRUFBRTtBQUMzQjtBQUVBLElBQUFBLFNBQWlCO0FBQUEsRUFDZixZQUFZN0IsSUFBRSxVQUFVO0FBQUEsRUFDeEI7QUFDRjtBQzlDQSxNQUFNQSxNQUFJckMsYUFBd0I7QUFDbEMsTUFBTUksU0FBT1csb0JBQWU7QUFDNUIsTUFBTVosT0FBS2E7QUFDWCxNQUFNZ0QsVUFBUS9DO0FBQ2QsTUFBTTBDLGVBQWF4QyxhQUEwQjtBQUU3QyxTQUFTLFdBQVksU0FBUyxTQUFTLFVBQVU7QUFDL0MsV0FBUyxTQUFVZ0QsVUFBU0MsVUFBUztBQUNuQ2pFLFNBQUcsS0FBS2dFLFVBQVNDLFVBQVMsU0FBTztBQUMvQixVQUFJO0FBQUssZUFBTyxTQUFTLEdBQUc7QUFDNUIsZUFBUyxJQUFJO0FBQUEsSUFDbkIsQ0FBSztBQUFBLEVBQ0Y7QUFFRFQsZUFBVyxTQUFTLENBQUMsS0FBSyxzQkFBc0I7QUFDOUMsUUFBSTtBQUFLLGFBQU8sU0FBUyxHQUFHO0FBQzVCLFFBQUk7QUFBbUIsYUFBTyxTQUFTLElBQUk7QUFDM0N4RCxTQUFHLE1BQU0sU0FBUyxDQUFDSSxTQUFRO0FBQ3pCLFVBQUlBLE1BQUs7QUFDUCxRQUFBQSxLQUFJLFVBQVVBLEtBQUksUUFBUSxRQUFRLFNBQVMsWUFBWTtBQUN2RCxlQUFPLFNBQVNBLElBQUc7QUFBQSxNQUNwQjtBQUVELFlBQU0sTUFBTUgsT0FBSyxRQUFRLE9BQU87QUFDaEN1RCxtQkFBVyxLQUFLLENBQUNwRCxNQUFLLGNBQWM7QUFDbEMsWUFBSUE7QUFBSyxpQkFBTyxTQUFTQSxJQUFHO0FBQzVCLFlBQUk7QUFBVyxpQkFBTyxTQUFTLFNBQVMsT0FBTztBQUMvQ3lELGdCQUFNLE9BQU8sS0FBSyxDQUFBekQsU0FBTztBQUN2QixjQUFJQTtBQUFLLG1CQUFPLFNBQVNBLElBQUc7QUFDNUIsbUJBQVMsU0FBUyxPQUFPO0FBQUEsUUFDbkMsQ0FBUztBQUFBLE1BQ1QsQ0FBTztBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0wsQ0FBRztBQUNIO0FBRUEsU0FBUyxlQUFnQixTQUFTLFNBQVM7QUFDekMsUUFBTSxvQkFBb0JKLEtBQUcsV0FBVyxPQUFPO0FBQy9DLE1BQUk7QUFBbUIsV0FBTztBQUU5QixNQUFJO0FBQ0ZBLFNBQUcsVUFBVSxPQUFPO0FBQUEsRUFDckIsU0FBUSxLQUFQO0FBQ0EsUUFBSSxVQUFVLElBQUksUUFBUSxRQUFRLFNBQVMsWUFBWTtBQUN2RCxVQUFNO0FBQUEsRUFDUDtBQUVELFFBQU0sTUFBTUMsT0FBSyxRQUFRLE9BQU87QUFDaEMsUUFBTSxZQUFZRCxLQUFHLFdBQVcsR0FBRztBQUNuQyxNQUFJO0FBQVcsV0FBT0EsS0FBRyxTQUFTLFNBQVMsT0FBTztBQUNsRDZELFVBQU0sV0FBVyxHQUFHO0FBRXBCLFNBQU83RCxLQUFHLFNBQVMsU0FBUyxPQUFPO0FBQ3JDO0FBRUEsSUFBQWtFLFNBQWlCO0FBQUEsRUFDZixZQUFZaEMsSUFBRSxVQUFVO0FBQUEsRUFDeEI7QUFDRjtBQzFEQSxNQUFNakMsU0FBT0osb0JBQWU7QUFDNUIsTUFBTUcsT0FBS1k7QUFDWCxNQUFNNEMsZUFBYTNDLGFBQTBCO0FBd0I3QyxTQUFTc0QsZUFBYyxTQUFTLFNBQVMsVUFBVTtBQUNqRCxNQUFJbEUsT0FBSyxXQUFXLE9BQU8sR0FBRztBQUM1QixXQUFPRCxLQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVE7QUFDaEMsVUFBSSxLQUFLO0FBQ1AsWUFBSSxVQUFVLElBQUksUUFBUSxRQUFRLFNBQVMsZUFBZTtBQUMxRCxlQUFPLFNBQVMsR0FBRztBQUFBLE1BQ3BCO0FBQ0QsYUFBTyxTQUFTLE1BQU07QUFBQSxRQUNwQixTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDakIsQ0FBTztBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0wsT0FBUztBQUNMLFVBQU0sU0FBU0MsT0FBSyxRQUFRLE9BQU87QUFDbkMsVUFBTSxnQkFBZ0JBLE9BQUssS0FBSyxRQUFRLE9BQU87QUFDL0MsV0FBT3VELGFBQVcsZUFBZSxDQUFDLEtBQUssV0FBVztBQUNoRCxVQUFJO0FBQUssZUFBTyxTQUFTLEdBQUc7QUFDNUIsVUFBSSxRQUFRO0FBQ1YsZUFBTyxTQUFTLE1BQU07QUFBQSxVQUNwQixTQUFTO0FBQUEsVUFDVCxTQUFTO0FBQUEsUUFDbkIsQ0FBUztBQUFBLE1BQ1QsT0FBYTtBQUNMLGVBQU94RCxLQUFHLE1BQU0sU0FBUyxDQUFDSSxTQUFRO0FBQ2hDLGNBQUlBLE1BQUs7QUFDUCxZQUFBQSxLQUFJLFVBQVVBLEtBQUksUUFBUSxRQUFRLFNBQVMsZUFBZTtBQUMxRCxtQkFBTyxTQUFTQSxJQUFHO0FBQUEsVUFDcEI7QUFDRCxpQkFBTyxTQUFTLE1BQU07QUFBQSxZQUNwQixTQUFTO0FBQUEsWUFDVCxTQUFTSCxPQUFLLFNBQVMsUUFBUSxPQUFPO0FBQUEsVUFDbEQsQ0FBVztBQUFBLFFBQ1gsQ0FBUztBQUFBLE1BQ0Y7QUFBQSxJQUNQLENBQUs7QUFBQSxFQUNGO0FBQ0g7QUFFQSxTQUFTbUUsbUJBQWtCLFNBQVMsU0FBUztBQUMzQyxNQUFJO0FBQ0osTUFBSW5FLE9BQUssV0FBVyxPQUFPLEdBQUc7QUFDNUIsYUFBU0QsS0FBRyxXQUFXLE9BQU87QUFDOUIsUUFBSSxDQUFDO0FBQVEsWUFBTSxJQUFJLE1BQU0saUNBQWlDO0FBQzlELFdBQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxJQUNWO0FBQUEsRUFDTCxPQUFTO0FBQ0wsVUFBTSxTQUFTQyxPQUFLLFFBQVEsT0FBTztBQUNuQyxVQUFNLGdCQUFnQkEsT0FBSyxLQUFLLFFBQVEsT0FBTztBQUMvQyxhQUFTRCxLQUFHLFdBQVcsYUFBYTtBQUNwQyxRQUFJLFFBQVE7QUFDVixhQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDVjtBQUFBLElBQ1AsT0FBVztBQUNMLGVBQVNBLEtBQUcsV0FBVyxPQUFPO0FBQzlCLFVBQUksQ0FBQztBQUFRLGNBQU0sSUFBSSxNQUFNLGlDQUFpQztBQUM5RCxhQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxTQUFTQyxPQUFLLFNBQVMsUUFBUSxPQUFPO0FBQUEsTUFDdkM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNIO0FBRUEsSUFBQSxpQkFBaUI7QUFBQSxFQUNqQixjQUFFa0U7QUFBQUEsRUFDRixrQkFBRUM7QUFDRjtBQ2hHQSxNQUFNcEUsT0FBS0g7QUFFWCxTQUFTd0UsY0FBYSxTQUFTLE1BQU0sVUFBVTtBQUM3QyxhQUFZLE9BQU8sU0FBUyxhQUFjLE9BQU87QUFDakQsU0FBUSxPQUFPLFNBQVMsYUFBYyxRQUFRO0FBQzlDLE1BQUk7QUFBTSxXQUFPLFNBQVMsTUFBTSxJQUFJO0FBQ3BDckUsT0FBRyxNQUFNLFNBQVMsQ0FBQyxLQUFLLFVBQVU7QUFDaEMsUUFBSTtBQUFLLGFBQU8sU0FBUyxNQUFNLE1BQU07QUFDckMsV0FBUSxTQUFTLE1BQU0sWUFBYSxJQUFJLFFBQVE7QUFDaEQsYUFBUyxNQUFNLElBQUk7QUFBQSxFQUN2QixDQUFHO0FBQ0g7QUFFQSxTQUFTc0Usa0JBQWlCLFNBQVMsTUFBTTtBQUN2QyxNQUFJO0FBRUosTUFBSTtBQUFNLFdBQU87QUFDakIsTUFBSTtBQUNGLFlBQVF0RSxLQUFHLFVBQVUsT0FBTztBQUFBLEVBQzdCLFNBQVEsR0FBUDtBQUNBLFdBQU87QUFBQSxFQUNSO0FBQ0QsU0FBUSxTQUFTLE1BQU0sWUFBYSxJQUFJLFFBQVE7QUFDbEQ7QUFFQSxJQUFBLGdCQUFpQjtBQUFBLEVBQ2pCLGFBQUVxRTtBQUFBQSxFQUNGLGlCQUFFQztBQUNGO0FDNUJBLE1BQU1wQyxNQUFJckMsYUFBd0I7QUFDbEMsTUFBTUksU0FBT1csb0JBQWU7QUFDNUIsTUFBTVosT0FBS2E7QUFDWCxNQUFNLFVBQVVDO0FBQ2hCLE1BQU0sU0FBUyxRQUFRO0FBQ3ZCLE1BQU0sYUFBYSxRQUFRO0FBRTNCLE1BQU0sZ0JBQWdCRTtBQUN0QixNQUFNLGVBQWUsY0FBYztBQUNuQyxNQUFNLG1CQUFtQixjQUFjO0FBRXZDLE1BQU0sZUFBZUk7QUFDckIsTUFBTSxjQUFjLGFBQWE7QUFDakMsTUFBTSxrQkFBa0IsYUFBYTtBQUVyQyxNQUFNb0MsZUFBYWUsYUFBMEI7QUFFN0MsU0FBUyxjQUFlLFNBQVMsU0FBUyxNQUFNLFVBQVU7QUFDeEQsYUFBWSxPQUFPLFNBQVMsYUFBYyxPQUFPO0FBQ2pELFNBQVEsT0FBTyxTQUFTLGFBQWMsUUFBUTtBQUU5Q2YsZUFBVyxTQUFTLENBQUMsS0FBSyxzQkFBc0I7QUFDOUMsUUFBSTtBQUFLLGFBQU8sU0FBUyxHQUFHO0FBQzVCLFFBQUk7QUFBbUIsYUFBTyxTQUFTLElBQUk7QUFDM0MsaUJBQWEsU0FBUyxTQUFTLENBQUNwRCxNQUFLLGFBQWE7QUFDaEQsVUFBSUE7QUFBSyxlQUFPLFNBQVNBLElBQUc7QUFDNUIsZ0JBQVUsU0FBUztBQUNuQixrQkFBWSxTQUFTLE9BQU8sTUFBTSxDQUFDQSxNQUFLb0UsVUFBUztBQUMvQyxZQUFJcEU7QUFBSyxpQkFBTyxTQUFTQSxJQUFHO0FBQzVCLGNBQU0sTUFBTUgsT0FBSyxRQUFRLE9BQU87QUFDaEN1RCxxQkFBVyxLQUFLLENBQUNwRCxNQUFLLGNBQWM7QUFDbEMsY0FBSUE7QUFBSyxtQkFBTyxTQUFTQSxJQUFHO0FBQzVCLGNBQUk7QUFBVyxtQkFBT0osS0FBRyxRQUFRLFNBQVMsU0FBU3dFLE9BQU0sUUFBUTtBQUNqRSxpQkFBTyxLQUFLLENBQUFwRSxTQUFPO0FBQ2pCLGdCQUFJQTtBQUFLLHFCQUFPLFNBQVNBLElBQUc7QUFDNUJKLGlCQUFHLFFBQVEsU0FBUyxTQUFTd0UsT0FBTSxRQUFRO0FBQUEsVUFDdkQsQ0FBVztBQUFBLFFBQ1gsQ0FBUztBQUFBLE1BQ1QsQ0FBTztBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0wsQ0FBRztBQUNIO0FBRUEsU0FBUyxrQkFBbUIsU0FBUyxTQUFTLE1BQU07QUFDbEQsUUFBTSxvQkFBb0J4RSxLQUFHLFdBQVcsT0FBTztBQUMvQyxNQUFJO0FBQW1CLFdBQU87QUFFOUIsUUFBTSxXQUFXLGlCQUFpQixTQUFTLE9BQU87QUFDbEQsWUFBVSxTQUFTO0FBQ25CLFNBQU8sZ0JBQWdCLFNBQVMsT0FBTyxJQUFJO0FBQzNDLFFBQU0sTUFBTUMsT0FBSyxRQUFRLE9BQU87QUFDaEMsUUFBTSxTQUFTRCxLQUFHLFdBQVcsR0FBRztBQUNoQyxNQUFJO0FBQVEsV0FBT0EsS0FBRyxZQUFZLFNBQVMsU0FBUyxJQUFJO0FBQ3hELGFBQVcsR0FBRztBQUNkLFNBQU9BLEtBQUcsWUFBWSxTQUFTLFNBQVMsSUFBSTtBQUM5QztBQUVBLElBQUF5RSxZQUFpQjtBQUFBLEVBQ2YsZUFBZXZDLElBQUUsYUFBYTtBQUFBLEVBQzlCO0FBQ0Y7QUM1REEsTUFBTSxPQUFPckM7QUFDYixNQUFNLE9BQU9lO0FBQ2IsTUFBTSxVQUFVQztBQUVoQixJQUFBLFNBQWlCO0FBQUEsRUFFZixZQUFZLEtBQUs7QUFBQSxFQUNqQixnQkFBZ0IsS0FBSztBQUFBLEVBQ3JCLFlBQVksS0FBSztBQUFBLEVBQ2pCLGdCQUFnQixLQUFLO0FBQUEsRUFFckIsWUFBWSxLQUFLO0FBQUEsRUFDakIsZ0JBQWdCLEtBQUs7QUFBQSxFQUNyQixZQUFZLEtBQUs7QUFBQSxFQUNqQixnQkFBZ0IsS0FBSztBQUFBLEVBRXJCLGVBQWUsUUFBUTtBQUFBLEVBQ3ZCLG1CQUFtQixRQUFRO0FBQUEsRUFDM0IsZUFBZSxRQUFRO0FBQUEsRUFDdkIsbUJBQW1CLFFBQVE7QUFDN0I7QUN0QkEsSUFBSTtBQUNKLElBQUk7QUFDRixRQUFNLFFBQVEsYUFBYTtBQUM3QixTQUFTLEdBQVA7QUFDQSxRQUFNaEIsc0JBQWE7QUFDckI7QUFFQSxTQUFTLFNBQVVrRSxPQUFNLFNBQVMsVUFBVTtBQUMxQyxNQUFJLFlBQVksTUFBTTtBQUNwQixlQUFXO0FBQ1gsY0FBVSxDQUFFO0FBQUEsRUFDYjtBQUVELE1BQUksT0FBTyxZQUFZLFVBQVU7QUFDL0IsY0FBVSxFQUFDLFVBQVUsUUFBTztBQUFBLEVBQzdCO0FBRUQsWUFBVSxXQUFXLENBQUU7QUFDdkIsTUFBSS9ELE1BQUssUUFBUSxNQUFNO0FBRXZCLE1BQUksY0FBYztBQUNsQixNQUFJLFlBQVksU0FBUztBQUN2QixrQkFBYyxRQUFRO0FBQUEsRUFDdkI7QUFFRCxFQUFBQSxJQUFHLFNBQVMrRCxPQUFNLFNBQVMsU0FBVSxLQUFLLE1BQU07QUFDOUMsUUFBSTtBQUFLLGFBQU8sU0FBUyxHQUFHO0FBRTVCLFdBQU8sU0FBUyxJQUFJO0FBRXBCLFFBQUk7QUFDSixRQUFJO0FBQ0YsWUFBTSxLQUFLLE1BQU0sTUFBTSxVQUFVLFFBQVEsVUFBVSxJQUFJO0FBQUEsSUFDeEQsU0FBUSxNQUFQO0FBQ0EsVUFBSSxhQUFhO0FBQ2YsYUFBSyxVQUFVQSxRQUFPLE9BQU8sS0FBSztBQUNsQyxlQUFPLFNBQVMsSUFBSTtBQUFBLE1BQzVCLE9BQWE7QUFDTCxlQUFPLFNBQVMsTUFBTSxJQUFJO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBRUQsYUFBUyxNQUFNLEdBQUc7QUFBQSxFQUN0QixDQUFHO0FBQ0g7QUFFQSxTQUFTLGFBQWNBLE9BQU0sU0FBUztBQUNwQyxZQUFVLFdBQVcsQ0FBRTtBQUN2QixNQUFJLE9BQU8sWUFBWSxVQUFVO0FBQy9CLGNBQVUsRUFBQyxVQUFVLFFBQU87QUFBQSxFQUM3QjtBQUVELE1BQUkvRCxNQUFLLFFBQVEsTUFBTTtBQUV2QixNQUFJLGNBQWM7QUFDbEIsTUFBSSxZQUFZLFNBQVM7QUFDdkIsa0JBQWMsUUFBUTtBQUFBLEVBQ3ZCO0FBRUQsTUFBSTtBQUNGLFFBQUksVUFBVUEsSUFBRyxhQUFhK0QsT0FBTSxPQUFPO0FBQzNDLGNBQVUsU0FBUyxPQUFPO0FBQzFCLFdBQU8sS0FBSyxNQUFNLFNBQVMsUUFBUSxPQUFPO0FBQUEsRUFDM0MsU0FBUSxLQUFQO0FBQ0EsUUFBSSxhQUFhO0FBQ2YsVUFBSSxVQUFVQSxRQUFPLE9BQU8sSUFBSTtBQUNoQyxZQUFNO0FBQUEsSUFDWixPQUFXO0FBQ0wsYUFBTztBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQ0g7QUFFQSxTQUFTVyxZQUFXLEtBQUssU0FBUztBQUNoQyxNQUFJO0FBQ0osTUFBSSxNQUFNO0FBQ1YsTUFBSSxPQUFPLFlBQVksWUFBWSxZQUFZLE1BQU07QUFDbkQsUUFBSSxRQUFRLFFBQVE7QUFDbEIsZUFBUyxRQUFRO0FBQUEsSUFDbEI7QUFDRCxRQUFJLFFBQVEsS0FBSztBQUNmLFlBQU0sUUFBUTtBQUFBLElBQ2Y7QUFBQSxFQUNGO0FBRUQsTUFBSSxNQUFNLEtBQUssVUFBVSxLQUFLLFVBQVUsUUFBUSxXQUFXLE1BQU0sTUFBTTtBQUV2RSxTQUFPLElBQUksUUFBUSxPQUFPLEdBQUcsSUFBSTtBQUNuQztBQUVBLFNBQVMsVUFBV1gsT0FBTSxLQUFLLFNBQVMsVUFBVTtBQUNoRCxNQUFJLFlBQVksTUFBTTtBQUNwQixlQUFXO0FBQ1gsY0FBVSxDQUFFO0FBQUEsRUFDYjtBQUNELFlBQVUsV0FBVyxDQUFFO0FBQ3ZCLE1BQUkvRCxNQUFLLFFBQVEsTUFBTTtBQUV2QixNQUFJLE1BQU07QUFDVixNQUFJO0FBQ0YsVUFBTTBFLFlBQVUsS0FBSyxPQUFPO0FBQUEsRUFDN0IsU0FBUSxLQUFQO0FBRUEsUUFBSTtBQUFVLGVBQVMsS0FBSyxJQUFJO0FBQ2hDO0FBQUEsRUFDRDtBQUVELEVBQUExRSxJQUFHLFVBQVUrRCxPQUFNLEtBQUssU0FBUyxRQUFRO0FBQzNDO0FBRUEsU0FBUyxjQUFlQSxPQUFNLEtBQUssU0FBUztBQUMxQyxZQUFVLFdBQVcsQ0FBRTtBQUN2QixNQUFJL0QsTUFBSyxRQUFRLE1BQU07QUFFdkIsTUFBSSxNQUFNMEUsWUFBVSxLQUFLLE9BQU87QUFFaEMsU0FBTzFFLElBQUcsY0FBYytELE9BQU0sS0FBSyxPQUFPO0FBQzVDO0FBRUEsU0FBUyxTQUFVLFNBQVM7QUFFMUIsTUFBSSxPQUFPLFNBQVMsT0FBTztBQUFHLGNBQVUsUUFBUSxTQUFTLE1BQU07QUFDL0QsWUFBVSxRQUFRLFFBQVEsV0FBVyxFQUFFO0FBQ3ZDLFNBQU87QUFDVDtBQUVBLElBQUlZLGFBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFFQSxJQUFBLGFBQWlCQTtBQ25JakIsTUFBTXpDLE1BQUlyQyxhQUF3QjtBQUNsQyxNQUFNK0UsYUFBV2hFO0FBRWpCLElBQUEsV0FBaUI7QUFBQSxFQUVmLFVBQVVzQixJQUFFMEMsV0FBUyxRQUFRO0FBQUEsRUFDN0IsY0FBY0EsV0FBUztBQUFBLEVBQ3ZCLFdBQVcxQyxJQUFFMEMsV0FBUyxTQUFTO0FBQUEsRUFDL0IsZUFBZUEsV0FBUztBQUMxQjtBQ1RBLE1BQU0zRSxTQUFPSixvQkFBZTtBQUM1QixNQUFNZ0UsVUFBUWpEO0FBQ2QsTUFBTTRDLGVBQWEzQyxhQUEwQjtBQUM3QyxNQUFNK0QsYUFBVzlEO0FBRWpCLFNBQVMsV0FBWWlELE9BQU0sTUFBTSxTQUFTLFVBQVU7QUFDbEQsTUFBSSxPQUFPLFlBQVksWUFBWTtBQUNqQyxlQUFXO0FBQ1gsY0FBVSxDQUFFO0FBQUEsRUFDYjtBQUVELFFBQU0sTUFBTTlELE9BQUssUUFBUThELEtBQUk7QUFFN0JQLGVBQVcsS0FBSyxDQUFDLEtBQUssV0FBVztBQUMvQixRQUFJO0FBQUssYUFBTyxTQUFTLEdBQUc7QUFDNUIsUUFBSTtBQUFRLGFBQU9vQixXQUFTLFVBQVViLE9BQU0sTUFBTSxTQUFTLFFBQVE7QUFFbkVGLFlBQU0sT0FBTyxLQUFLLENBQUF6RCxTQUFPO0FBQ3ZCLFVBQUlBO0FBQUssZUFBTyxTQUFTQSxJQUFHO0FBQzVCd0UsaUJBQVMsVUFBVWIsT0FBTSxNQUFNLFNBQVMsUUFBUTtBQUFBLElBQ3RELENBQUs7QUFBQSxFQUNMLENBQUc7QUFDSDtBQUVBLElBQUEsZUFBaUI7QUN4QmpCLE1BQU0vRCxPQUFLSDtBQUNYLE1BQU1JLFNBQU9XLG9CQUFlO0FBQzVCLE1BQU1pRCxVQUFRaEQ7QUFDZCxNQUFNK0QsYUFBVzlEO0FBRWpCLFNBQVMsZUFBZ0JpRCxPQUFNLE1BQU0sU0FBUztBQUM1QyxRQUFNLE1BQU05RCxPQUFLLFFBQVE4RCxLQUFJO0FBRTdCLE1BQUksQ0FBQy9ELEtBQUcsV0FBVyxHQUFHLEdBQUc7QUFDdkI2RCxZQUFNLFdBQVcsR0FBRztBQUFBLEVBQ3JCO0FBRURlLGFBQVMsY0FBY2IsT0FBTSxNQUFNLE9BQU87QUFDNUM7QUFFQSxJQUFBLG1CQUFpQjtBQ2ZqQixNQUFNN0IsTUFBSXJDLGFBQXdCO0FBQ2xDLE1BQU0sV0FBV2U7QUFFakIsU0FBUyxhQUFhc0IsSUFBRXJCLFlBQXdCO0FBQ2hELFNBQVMsaUJBQWlCQztBQUUxQixTQUFTLGFBQWEsU0FBUztBQUMvQixTQUFTLGlCQUFpQixTQUFTO0FBQ25DLFNBQVMsWUFBWSxTQUFTO0FBQzlCLFNBQVMsZ0JBQWdCLFNBQVM7QUFDbEMsU0FBUyxXQUFXLFNBQVM7QUFDN0IsU0FBUyxlQUFlLFNBQVM7QUFFakMsSUFBQSxPQUFpQjtBQ2JqQixNQUFNZCxPQUFLSDtBQUNYLE1BQU1JLFNBQU9XLG9CQUFlO0FBQzVCLE1BQU0sV0FBV0MsV0FBd0I7QUFDekMsTUFBTSxhQUFhQyxTQUFxQjtBQUN4QyxNQUFNLGFBQWFFLFNBQXFCO0FBQ3hDLE1BQU11QixTQUFPbkI7QUFFYixTQUFTeUQsV0FBVSxLQUFLLE1BQU0sTUFBTTtBQUNsQyxTQUFPLFFBQVEsQ0FBRTtBQUNqQixRQUFNLFlBQVksS0FBSyxhQUFhLEtBQUssV0FBVztBQUVwRCxRQUFNLEVBQUUsUUFBTyxJQUFLdEMsT0FBSyxlQUFlLEtBQUssTUFBTSxNQUFNO0FBQ3pEQSxTQUFLLHFCQUFxQixLQUFLLFNBQVMsTUFBTSxNQUFNO0FBQ3BELGFBQVd0QyxPQUFLLFFBQVEsSUFBSSxDQUFDO0FBQzdCLFNBQU82RSxXQUFTLEtBQUssTUFBTSxTQUFTO0FBQ3RDO0FBRUEsU0FBU0EsV0FBVSxLQUFLLE1BQU0sV0FBVztBQUN2QyxNQUFJLFdBQVc7QUFDYixlQUFXLElBQUk7QUFDZixXQUFPNUUsU0FBTyxLQUFLLE1BQU0sU0FBUztBQUFBLEVBQ25DO0FBQ0QsTUFBSUYsS0FBRyxXQUFXLElBQUk7QUFBRyxVQUFNLElBQUksTUFBTSxzQkFBc0I7QUFDL0QsU0FBT0UsU0FBTyxLQUFLLE1BQU0sU0FBUztBQUNwQztBQUVBLFNBQVNBLFNBQVEsS0FBSyxNQUFNLFdBQVc7QUFDckMsTUFBSTtBQUNGRixTQUFHLFdBQVcsS0FBSyxJQUFJO0FBQUEsRUFDeEIsU0FBUSxLQUFQO0FBQ0EsUUFBSSxJQUFJLFNBQVM7QUFBUyxZQUFNO0FBQ2hDLFdBQU8rRSxtQkFBaUIsS0FBSyxNQUFNLFNBQVM7QUFBQSxFQUM3QztBQUNIO0FBRUEsU0FBU0EsbUJBQWtCLEtBQUssTUFBTSxXQUFXO0FBQy9DLFFBQU0sT0FBTztBQUFBLElBQ1g7QUFBQSxJQUNBLGNBQWM7QUFBQSxFQUNmO0FBQ0QsV0FBUyxLQUFLLE1BQU0sSUFBSTtBQUN4QixTQUFPLFdBQVcsR0FBRztBQUN2QjtBQUVBLElBQUEsYUFBaUJGO0FDNUNqQixJQUFBLFdBQWlCO0FBQUEsRUFDZixVQUFVaEY7QUFDWjtBQ0ZBLE1BQU1HLE9BQUtIO0FBQ1gsTUFBTUksU0FBT1csb0JBQWU7QUFDNUIsTUFBTSxPQUFPQyxPQUFtQjtBQUNoQyxNQUFNLFNBQVNDLFNBQXFCO0FBQ3BDLE1BQU0sU0FBU0UsU0FBcUI7QUFDcEMsTUFBTXdDLGVBQWFwQyxhQUEwQjtBQUM3QyxNQUFNbUIsU0FBT2dDO0FBRWIsU0FBU1MsT0FBTSxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ2xDLE1BQUksT0FBTyxTQUFTLFlBQVk7QUFDOUIsU0FBSztBQUNMLFdBQU8sQ0FBRTtBQUFBLEVBQ1Y7QUFFRCxRQUFNLFlBQVksS0FBSyxhQUFhLEtBQUssV0FBVztBQUVwRHpDLFNBQUssV0FBVyxLQUFLLE1BQU0sUUFBUSxDQUFDLEtBQUssVUFBVTtBQUNqRCxRQUFJO0FBQUssYUFBTyxHQUFHLEdBQUc7QUFDdEIsVUFBTSxFQUFFLFFBQU8sSUFBSztBQUNwQkEsV0FBSyxpQkFBaUIsS0FBSyxTQUFTLE1BQU0sUUFBUSxDQUFBbkMsU0FBTztBQUN2RCxVQUFJQTtBQUFLLGVBQU8sR0FBR0EsSUFBRztBQUN0QixhQUFPSCxPQUFLLFFBQVEsSUFBSSxHQUFHLENBQUFHLFNBQU87QUFDaEMsWUFBSUE7QUFBSyxpQkFBTyxHQUFHQSxJQUFHO0FBQ3RCLGVBQU8sU0FBUyxLQUFLLE1BQU0sV0FBVyxFQUFFO0FBQUEsTUFDaEQsQ0FBTztBQUFBLElBQ1AsQ0FBSztBQUFBLEVBQ0wsQ0FBRztBQUNIO0FBRUEsU0FBUyxTQUFVLEtBQUssTUFBTSxXQUFXLElBQUk7QUFDM0MsTUFBSSxXQUFXO0FBQ2IsV0FBTyxPQUFPLE1BQU0sU0FBTztBQUN6QixVQUFJO0FBQUssZUFBTyxHQUFHLEdBQUc7QUFDdEIsYUFBTyxPQUFPLEtBQUssTUFBTSxXQUFXLEVBQUU7QUFBQSxJQUM1QyxDQUFLO0FBQUEsRUFDRjtBQUNEb0QsZUFBVyxNQUFNLENBQUMsS0FBSyxlQUFlO0FBQ3BDLFFBQUk7QUFBSyxhQUFPLEdBQUcsR0FBRztBQUN0QixRQUFJO0FBQVksYUFBTyxHQUFHLElBQUksTUFBTSxzQkFBc0IsQ0FBQztBQUMzRCxXQUFPLE9BQU8sS0FBSyxNQUFNLFdBQVcsRUFBRTtBQUFBLEVBQzFDLENBQUc7QUFDSDtBQUVBLFNBQVMsT0FBUSxLQUFLLE1BQU0sV0FBVyxJQUFJO0FBQ3pDeEQsT0FBRyxPQUFPLEtBQUssTUFBTSxTQUFPO0FBQzFCLFFBQUksQ0FBQztBQUFLLGFBQU8sR0FBSTtBQUNyQixRQUFJLElBQUksU0FBUztBQUFTLGFBQU8sR0FBRyxHQUFHO0FBQ3ZDLFdBQU8saUJBQWlCLEtBQUssTUFBTSxXQUFXLEVBQUU7QUFBQSxFQUNwRCxDQUFHO0FBQ0g7QUFFQSxTQUFTLGlCQUFrQixLQUFLLE1BQU0sV0FBVyxJQUFJO0FBQ25ELFFBQU0sT0FBTztBQUFBLElBQ1g7QUFBQSxJQUNBLGNBQWM7QUFBQSxFQUNmO0FBQ0QsT0FBSyxLQUFLLE1BQU0sTUFBTSxTQUFPO0FBQzNCLFFBQUk7QUFBSyxhQUFPLEdBQUcsR0FBRztBQUN0QixXQUFPLE9BQU8sS0FBSyxFQUFFO0FBQUEsRUFDekIsQ0FBRztBQUNIO0FBRUEsSUFBQSxTQUFpQmdGO0FDOURqQixNQUFNOUMsTUFBSXJDLGFBQXdCO0FBQ2xDLElBQUEsT0FBaUI7QUFBQSxFQUNmLE1BQU1xQyxJQUFFdEIsTUFBaUI7QUFDM0I7QUNIQSxNQUFNLElBQUlmLGFBQXdCO0FBQ2xDLE1BQU1HLE9BQUtZO0FBQ1gsTUFBTVgsU0FBT1ksb0JBQWU7QUFDNUIsTUFBTSxRQUFRQztBQUNkLE1BQU0sYUFBYUUsYUFBMEI7QUFFN0MsU0FBUyxXQUFZK0MsT0FBTSxNQUFNLFVBQVUsVUFBVTtBQUNuRCxNQUFJLE9BQU8sYUFBYSxZQUFZO0FBQ2xDLGVBQVc7QUFDWCxlQUFXO0FBQUEsRUFDWjtBQUVELFFBQU0sTUFBTTlELE9BQUssUUFBUThELEtBQUk7QUFDN0IsYUFBVyxLQUFLLENBQUMsS0FBSyxXQUFXO0FBQy9CLFFBQUk7QUFBSyxhQUFPLFNBQVMsR0FBRztBQUM1QixRQUFJO0FBQVEsYUFBTy9ELEtBQUcsVUFBVStELE9BQU0sTUFBTSxVQUFVLFFBQVE7QUFFOUQsVUFBTSxPQUFPLEtBQUssQ0FBQTNELFNBQU87QUFDdkIsVUFBSUE7QUFBSyxlQUFPLFNBQVNBLElBQUc7QUFFNUJKLFdBQUcsVUFBVStELE9BQU0sTUFBTSxVQUFVLFFBQVE7QUFBQSxJQUNqRCxDQUFLO0FBQUEsRUFDTCxDQUFHO0FBQ0g7QUFFQSxTQUFTLGVBQWdCQSxVQUFTLE1BQU07QUFDdEMsUUFBTSxNQUFNOUQsT0FBSyxRQUFROEQsS0FBSTtBQUM3QixNQUFJL0QsS0FBRyxXQUFXLEdBQUcsR0FBRztBQUN0QixXQUFPQSxLQUFHLGNBQWMrRCxPQUFNLEdBQUcsSUFBSTtBQUFBLEVBQ3RDO0FBQ0QsUUFBTSxXQUFXLEdBQUc7QUFDcEIvRCxPQUFHLGNBQWMrRCxPQUFNLEdBQUcsSUFBSTtBQUNoQztBQUVBLElBQUEsU0FBaUI7QUFBQSxFQUNmLFlBQVksRUFBRSxVQUFVO0FBQUEsRUFDeEI7QUFDRjtBQUFBO0FDckNBLFNBQWlCLFVBQUEsT0FBTztBQUFBLElBQ3RCLENBQUU7QUFBQSxJQUVGbEU7QUFBQUEsSUFFQWU7QUFBQUEsSUFDQUM7QUFBQUEsSUFDQUM7QUFBQUEsSUFDQUU7QUFBQUEsSUFDQUk7QUFBQUEsSUFDQW1EO0FBQUFBLElBQ0FVO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLEVBQ0Y7QUFJQSxRQUFNckYsTUFBS3NGLHNCQUFhO0FBQ3hCLE1BQUksT0FBTyx5QkFBeUJ0RixLQUFJLFVBQVUsR0FBRztBQUNuRCxXQUFPLGVBQWUsT0FBTyxTQUFTLFlBQVk7QUFBQSxNQUNoRCxNQUFPO0FBQUUsZUFBT0EsSUFBRztBQUFBLE1BQVU7QUFBQSxJQUNqQyxDQUFHO0FBQUEsRUFDSDs7Ozs7QUN6QkEsTUFBTUMsU0FBT0osb0JBQUFBO0FBQ2IsTUFBTSxZQUFZO0FBQ2xCLE1BQU0sZUFBZSxLQUFLO0FBTTFCLE1BQU0sY0FBYztBQUNwQixNQUFNLGVBQWU7QUFDckIsTUFBTSxnQkFBZ0I7QUFDdEIsTUFBTSxnQkFBZ0I7QUFDdEIsTUFBTSxXQUFXO0FBQ2pCLE1BQU0sUUFBUTtBQUNkLE1BQU0sYUFBYSxNQUFNO0FBQ3pCLE1BQU0sZUFBZSxRQUFRO0FBQzdCLE1BQU0sYUFBYSxHQUFHLG1CQUFtQjtBQUN6QyxNQUFNLFNBQVMsTUFBTTtBQUNyQixNQUFNLFVBQVUsTUFBTSxlQUFlO0FBQ3JDLE1BQU0sZUFBZSxNQUFNLG1CQUFtQjtBQUM5QyxNQUFNLGdCQUFnQixNQUFNO0FBQzVCLE1BQU0sZUFBZSxNQUFNO0FBQzNCLE1BQU0wRixTQUFPLEdBQUc7QUFFaEIsTUFBTSxjQUFjO0FBQUEsRUFDbEI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNGLE1BQUVBO0FBQUFBLEVBQ0E7QUFDRjtBQU1BLE1BQU0sZ0JBQWdCO0FBQUEsRUFDcEIsR0FBRztBQUFBLEVBRUgsZUFBZSxJQUFJO0FBQUEsRUFDbkIsT0FBTztBQUFBLEVBQ1AsTUFBTSxHQUFHO0FBQUEsRUFDVCxZQUFZLEdBQUcsdUJBQXVCO0FBQUEsRUFDdEMsUUFBUSxNQUFNO0FBQUEsRUFDZCxTQUFTLFlBQVksY0FBYyx1QkFBdUI7QUFBQSxFQUMxRCxjQUFjLE1BQU0sdUJBQXVCO0FBQUEsRUFDM0MsZUFBZSxNQUFNLHVCQUF1QjtBQUFBLEVBQzVDLGNBQWMsTUFBTTtBQUFBLEVBQ3BCLGNBQWMsU0FBUztBQUFBLEVBQ3ZCLFlBQVksT0FBTztBQUNyQjtBQU1BLE1BQU1DLHVCQUFxQjtBQUFBLEVBQ3pCLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFDVjtBQUVBLElBQUE1RixjQUFpQjtBQUFBLEVBQ2YsWUFBWSxPQUFPO0FBQUEsRUFDckIsb0JBQUU0RjtBQUFBQSxFQUdBLGlCQUFpQjtBQUFBLEVBQ2pCLHlCQUF5QjtBQUFBLEVBQ3pCLHFCQUFxQjtBQUFBLEVBQ3JCLDZCQUE2QjtBQUFBLEVBQzdCLDRCQUE0QjtBQUFBLEVBQzVCLHdCQUF3QjtBQUFBLEVBR3hCLGNBQWM7QUFBQSxJQUNaLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUNULFlBQVk7QUFBQSxFQUNiO0FBQUEsRUFHRCxRQUFRO0FBQUEsRUFDUixRQUFRO0FBQUEsRUFHUixrQkFBa0I7QUFBQSxFQUNsQixrQkFBa0I7QUFBQSxFQUNsQixrQkFBa0I7QUFBQSxFQUNsQixrQkFBa0I7QUFBQSxFQUVsQix1QkFBdUI7QUFBQSxFQUN2Qix3QkFBd0I7QUFBQSxFQUV4QixlQUFlO0FBQUEsRUFHZixnQkFBZ0I7QUFBQSxFQUNoQixTQUFTO0FBQUEsRUFDVCxxQkFBcUI7QUFBQSxFQUNyQixzQkFBc0I7QUFBQSxFQUN0Qix3QkFBd0I7QUFBQSxFQUN4QixZQUFZO0FBQUEsRUFDWixZQUFZO0FBQUEsRUFDWixVQUFVO0FBQUEsRUFDVixtQkFBbUI7QUFBQSxFQUNuQixZQUFZO0FBQUEsRUFDWix1QkFBdUI7QUFBQSxFQUN2QixnQkFBZ0I7QUFBQSxFQUNoQixvQkFBb0I7QUFBQSxFQUNwQixtQkFBbUI7QUFBQSxFQUNuQixXQUFXO0FBQUEsRUFDWCxtQkFBbUI7QUFBQSxFQUNuQix5QkFBeUI7QUFBQSxFQUN6Qix1QkFBdUI7QUFBQSxFQUN2QiwwQkFBMEI7QUFBQSxFQUMxQixnQkFBZ0I7QUFBQSxFQUNoQixxQkFBcUI7QUFBQSxFQUNyQixjQUFjO0FBQUEsRUFDZCxXQUFXO0FBQUEsRUFDWCxvQkFBb0I7QUFBQSxFQUNwQiwwQkFBMEI7QUFBQSxFQUMxQix3QkFBd0I7QUFBQSxFQUN4QiwyQkFBMkI7QUFBQSxFQUMzQixnQkFBZ0I7QUFBQSxFQUNoQixtQkFBbUI7QUFBQSxFQUNuQixZQUFZO0FBQUEsRUFDWixVQUFVO0FBQUEsRUFDVixpQkFBaUI7QUFBQSxFQUNqQixvQkFBb0I7QUFBQSxFQUNwQiwrQkFBK0I7QUFBQSxFQUUvQixLQUFLdkYsT0FBSztBQUFBLEVBTVYsYUFBYXdGLFFBQU87QUFDbEIsV0FBTztBQUFBLE1BQ0wsS0FBSyxFQUFFLE1BQU0sVUFBVSxNQUFNLGFBQWEsT0FBTyxLQUFLQSxPQUFNLFFBQVM7QUFBQSxNQUNyRSxLQUFLLEVBQUUsTUFBTSxTQUFTLE1BQU0sT0FBTyxPQUFPLEtBQU07QUFBQSxNQUNoRCxLQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU0sT0FBTyxPQUFPLEtBQU07QUFBQSxNQUMvQyxLQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU0sT0FBTyxPQUFPLEtBQU07QUFBQSxNQUMvQyxLQUFLLEVBQUUsTUFBTSxNQUFNLE1BQU0sT0FBTyxPQUFPLElBQUs7QUFBQSxJQUNsRDtBQUFBLEVBQ0c7QUFBQSxFQU1ELFVBQVVDLFFBQU87QUFDZixXQUFPQSxXQUFVLE9BQU8sZ0JBQWdCO0FBQUEsRUFDekM7QUFDSDtBQUFBO0FDaExBLFFBQU16RixRQUFPSixvQkFBQUE7QUFDYixRQUFNNkYsU0FBUSxRQUFRLGFBQWE7QUFDbkMsUUFBTTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGLElBQUk5RTtBQUVKLFVBQUEsV0FBbUIsU0FBTyxRQUFRLFFBQVEsT0FBTyxRQUFRLFlBQVksQ0FBQyxNQUFNLFFBQVEsR0FBRztBQUN2RixVQUF3QixnQkFBQSxTQUFPLG9CQUFvQixLQUFLLEdBQUc7QUFDM0QsVUFBQSxjQUFzQixTQUFPLElBQUksV0FBVyxLQUFLLFFBQVEsY0FBYyxHQUFHO0FBQzFFLFVBQXNCLGNBQUEsU0FBTyxJQUFJLFFBQVEsNEJBQTRCLE1BQU07QUFDM0UsVUFBeUIsaUJBQUEsU0FBTyxJQUFJLFFBQVEsaUJBQWlCLEdBQUc7QUFFaEUsVUFBQSxvQkFBNEIsU0FBTztBQUNqQyxXQUFPLElBQUksUUFBUSx3QkFBd0IsV0FBUztBQUNsRCxhQUFPLFVBQVUsT0FBTyxLQUFLO0FBQUEsSUFDakMsQ0FBRztBQUFBLEVBQ0g7QUFFQSxVQUFBLHNCQUE4QixNQUFNO0FBQ2xDLFVBQU0sT0FBTyxRQUFRLFFBQVEsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsSUFBSSxNQUFNO0FBQzNELFFBQUksS0FBSyxXQUFXLEtBQUssS0FBSyxNQUFNLEtBQU0sS0FBSyxPQUFPLEtBQUssS0FBSyxNQUFNLElBQUs7QUFDekUsYUFBTztBQUFBLElBQ1I7QUFDRCxXQUFPO0FBQUEsRUFDVDtBQUVBLFVBQUEsWUFBb0IsYUFBVztBQUM3QixRQUFJLFdBQVcsT0FBTyxRQUFRLFlBQVksV0FBVztBQUNuRCxhQUFPLFFBQVE7QUFBQSxJQUNoQjtBQUNELFdBQU84RSxXQUFVLFFBQVF6RixNQUFLLFFBQVE7QUFBQSxFQUN4QztBQUVBLFVBQUEsYUFBcUIsQ0FBQyxPQUFPLE1BQU0sWUFBWTtBQUM3QyxVQUFNLE1BQU0sTUFBTSxZQUFZLE1BQU0sT0FBTztBQUMzQyxRQUFJLFFBQVE7QUFBSSxhQUFPO0FBQ3ZCLFFBQUksTUFBTSxNQUFNLE9BQU87QUFBTSxhQUFPLFFBQVEsV0FBVyxPQUFPLE1BQU0sTUFBTSxDQUFDO0FBQzNFLFdBQU8sR0FBRyxNQUFNLE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxNQUFNLEdBQUc7QUFBQSxFQUNuRDtBQUVBLFVBQUEsZUFBdUIsQ0FBQyxPQUFPLFFBQVEsQ0FBQSxNQUFPO0FBQzVDLFFBQUkwRixVQUFTO0FBQ2IsUUFBSUEsUUFBTyxXQUFXLElBQUksR0FBRztBQUMzQixNQUFBQSxVQUFTQSxRQUFPLE1BQU0sQ0FBQztBQUN2QixZQUFNLFNBQVM7QUFBQSxJQUNoQjtBQUNELFdBQU9BO0FBQUEsRUFDVDtBQUVBLFVBQXFCLGFBQUEsQ0FBQyxPQUFPLFFBQVEsQ0FBRSxHQUFFLFVBQVUsT0FBTztBQUN4RCxVQUFNLFVBQVUsUUFBUSxXQUFXLEtBQUs7QUFDeEMsVUFBTUMsVUFBUyxRQUFRLFdBQVcsS0FBSztBQUV2QyxRQUFJRCxVQUFTLEdBQUcsYUFBYSxTQUFTQztBQUN0QyxRQUFJLE1BQU0sWUFBWSxNQUFNO0FBQzFCLE1BQUFELFVBQVMsVUFBVUE7QUFBQSxJQUNwQjtBQUNELFdBQU9BO0FBQUEsRUFDVDs7QUM3REEsTUFBTUUsVUFBUWhHO0FBQ2QsTUFBTTtBQUFBLEVBQ0o7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0YsWUFBRWlHO0FBQUFBLEVBQ0YsVUFBRUM7QUFBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNGLHVCQUFFQztBQUFBQSxFQUNGLHVCQUFFQztBQUFBQSxFQUNGLDBCQUFFQztBQUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0Ysd0JBQUVDO0FBQUFBLEVBQ0Ysd0JBQUVDO0FBQUFBLEVBQ0YsMkJBQUVDO0FBQ0YsSUFBSXpGO0FBRUosTUFBTSxrQkFBa0IsVUFBUTtBQUM5QixTQUFPLFNBQVMsc0JBQXNCLFNBQVM7QUFDakQ7QUFFQSxNQUFNLFFBQVEsQ0FBQTBGLFdBQVM7QUFDckIsTUFBSUEsT0FBTSxhQUFhLE1BQU07QUFDM0IsSUFBQUEsT0FBTSxRQUFRQSxPQUFNLGFBQWEsV0FBVztBQUFBLEVBQzdDO0FBQ0g7QUFtQkEsTUFBTUMsU0FBTyxDQUFDLE9BQU8sWUFBWTtBQUMvQixRQUFNLE9BQU8sV0FBVztBQUV4QixRQUFNLFNBQVMsTUFBTSxTQUFTO0FBQzlCLFFBQU0sWUFBWSxLQUFLLFVBQVUsUUFBUSxLQUFLLGNBQWM7QUFDNUQsUUFBTSxVQUFVLENBQUE7QUFDaEIsUUFBTSxTQUFTLENBQUE7QUFDZixRQUFNLFFBQVEsQ0FBQTtBQUVkLE1BQUksTUFBTTtBQUNWLE1BQUksUUFBUTtBQUNaLE1BQUksUUFBUTtBQUNaLE1BQUksWUFBWTtBQUNoQixNQUFJLFVBQVU7QUFDZCxNQUFJLFlBQVk7QUFDaEIsTUFBSUMsVUFBUztBQUNiLE1BQUlDLGFBQVk7QUFDaEIsTUFBSSxhQUFhO0FBQ2pCLE1BQUksZUFBZTtBQUNuQixNQUFJLGNBQWM7QUFDbEIsTUFBSSxVQUFVO0FBQ2QsTUFBSSxpQkFBaUI7QUFDckIsTUFBSSxXQUFXO0FBQ2YsTUFBSUMsVUFBUztBQUNiLE1BQUk7QUFDSixNQUFJO0FBQ0osTUFBSUosU0FBUSxFQUFFLE9BQU8sSUFBSSxPQUFPLEdBQUcsUUFBUTtBQUUzQyxRQUFNLE1BQU0sTUFBTSxTQUFTO0FBQzNCLFFBQU0sT0FBTyxNQUFNLElBQUksV0FBVyxRQUFRLENBQUM7QUFDM0MsUUFBTSxVQUFVLE1BQU07QUFDcEIsV0FBTztBQUNQLFdBQU8sSUFBSSxXQUFXLEVBQUUsS0FBSztBQUFBLEVBQ2pDO0FBRUUsU0FBTyxRQUFRLFFBQVE7QUFDckIsV0FBTyxRQUFPO0FBQ2QsUUFBSTtBQUVKLFFBQUksU0FBUyxxQkFBcUI7QUFDaEMsb0JBQWNBLE9BQU0sY0FBYztBQUNsQyxhQUFPLFFBQU87QUFFZCxVQUFJLFNBQVNOLHlCQUF1QjtBQUNsQyx1QkFBZTtBQUFBLE1BQ2hCO0FBQ0Q7QUFBQSxJQUNEO0FBRUQsUUFBSSxpQkFBaUIsUUFBUSxTQUFTQSx5QkFBdUI7QUFDM0QsTUFBQVU7QUFFQSxhQUFPLElBQUcsTUFBTyxTQUFTLE9BQU8sUUFBUyxJQUFHO0FBQzNDLFlBQUksU0FBUyxxQkFBcUI7QUFDaEMsd0JBQWNKLE9BQU0sY0FBYztBQUNsQztBQUNBO0FBQUEsUUFDRDtBQUVELFlBQUksU0FBU04seUJBQXVCO0FBQ2xDLFVBQUFVO0FBQ0E7QUFBQSxRQUNEO0FBRUQsWUFBSSxpQkFBaUIsUUFBUSxTQUFTWCxlQUFhLE9BQU8sUUFBUyxPQUFNQSxZQUFVO0FBQ2pGLG9CQUFVTyxPQUFNLFVBQVU7QUFDMUIsVUFBQUUsVUFBU0YsT0FBTSxTQUFTO0FBQ3hCLHFCQUFXO0FBRVgsY0FBSSxjQUFjLE1BQU07QUFDdEI7QUFBQSxVQUNEO0FBRUQ7QUFBQSxRQUNEO0FBRUQsWUFBSSxpQkFBaUIsUUFBUSxTQUFTUixjQUFZO0FBQ2hELG9CQUFVUSxPQUFNLFVBQVU7QUFDMUIsVUFBQUUsVUFBU0YsT0FBTSxTQUFTO0FBQ3hCLHFCQUFXO0FBRVgsY0FBSSxjQUFjLE1BQU07QUFDdEI7QUFBQSxVQUNEO0FBRUQ7QUFBQSxRQUNEO0FBRUQsWUFBSSxTQUFTSCwwQkFBd0I7QUFDbkMsVUFBQU87QUFFQSxjQUFJQSxZQUFXLEdBQUc7QUFDaEIsMkJBQWU7QUFDZixzQkFBVUosT0FBTSxVQUFVO0FBQzFCLHVCQUFXO0FBQ1g7QUFBQSxVQUNEO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFFRCxVQUFJLGNBQWMsTUFBTTtBQUN0QjtBQUFBLE1BQ0Q7QUFFRDtBQUFBLElBQ0Q7QUFFRCxRQUFJLFNBQVMsb0JBQW9CO0FBQy9CLGNBQVEsS0FBSyxLQUFLO0FBQ2xCLGFBQU8sS0FBS0EsTUFBSztBQUNqQixNQUFBQSxTQUFRLEVBQUUsT0FBTyxJQUFJLE9BQU8sR0FBRyxRQUFRO0FBRXZDLFVBQUksYUFBYTtBQUFNO0FBQ3ZCLFVBQUksU0FBU1AsY0FBWSxVQUFXLFFBQVEsR0FBSTtBQUM5QyxpQkFBUztBQUNUO0FBQUEsTUFDRDtBQUVELGtCQUFZLFFBQVE7QUFDcEI7QUFBQSxJQUNEO0FBRUQsUUFBSSxLQUFLLFVBQVUsTUFBTTtBQUN2QixZQUFNLGdCQUFnQixTQUFTLGFBQzFCLFNBQVMsV0FDVCxTQUFTLGlCQUNULFNBQVMsc0JBQ1QsU0FBUztBQUVkLFVBQUksa0JBQWtCLFFBQVEsS0FBSSxNQUFPRSx5QkFBdUI7QUFDOUQsUUFBQU8sVUFBU0YsT0FBTSxTQUFTO0FBQ3hCLFFBQUFHLGFBQVlILE9BQU0sWUFBWTtBQUM5QixtQkFBVztBQUNYLFlBQUksU0FBUyx5QkFBeUIsVUFBVSxPQUFPO0FBQ3JELDJCQUFpQjtBQUFBLFFBQ2xCO0FBRUQsWUFBSSxjQUFjLE1BQU07QUFDdEIsaUJBQU8sSUFBRyxNQUFPLFNBQVMsT0FBTyxRQUFTLElBQUc7QUFDM0MsZ0JBQUksU0FBUyxxQkFBcUI7QUFDaEMsNEJBQWNBLE9BQU0sY0FBYztBQUNsQyxxQkFBTyxRQUFPO0FBQ2Q7QUFBQSxZQUNEO0FBRUQsZ0JBQUksU0FBU0YsMEJBQXdCO0FBQ25DLGNBQUFJLFVBQVNGLE9BQU0sU0FBUztBQUN4Qix5QkFBVztBQUNYO0FBQUEsWUFDRDtBQUFBLFVBQ0Y7QUFDRDtBQUFBLFFBQ0Q7QUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNGO0FBRUQsUUFBSSxTQUFTLGVBQWU7QUFDMUIsVUFBSSxTQUFTO0FBQWUscUJBQWFBLE9BQU0sYUFBYTtBQUM1RCxNQUFBRSxVQUFTRixPQUFNLFNBQVM7QUFDeEIsaUJBQVc7QUFFWCxVQUFJLGNBQWMsTUFBTTtBQUN0QjtBQUFBLE1BQ0Q7QUFDRDtBQUFBLElBQ0Q7QUFFRCxRQUFJLFNBQVMsb0JBQW9CO0FBQy9CLE1BQUFFLFVBQVNGLE9BQU0sU0FBUztBQUN4QixpQkFBVztBQUVYLFVBQUksY0FBYyxNQUFNO0FBQ3RCO0FBQUEsTUFDRDtBQUNEO0FBQUEsSUFDRDtBQUVELFFBQUksU0FBU0osNEJBQTBCO0FBQ3JDLGFBQU8sSUFBRyxNQUFPLFNBQVMsT0FBTyxRQUFTLElBQUc7QUFDM0MsWUFBSSxTQUFTLHFCQUFxQjtBQUNoQyx3QkFBY0ksT0FBTSxjQUFjO0FBQ2xDO0FBQ0E7QUFBQSxRQUNEO0FBRUQsWUFBSSxTQUFTRCw2QkFBMkI7QUFDdEMsc0JBQVlDLE9BQU0sWUFBWTtBQUM5QixVQUFBRSxVQUFTRixPQUFNLFNBQVM7QUFDeEIscUJBQVc7QUFDWDtBQUFBLFFBQ0Q7QUFBQSxNQUNGO0FBRUQsVUFBSSxjQUFjLE1BQU07QUFDdEI7QUFBQSxNQUNEO0FBRUQ7QUFBQSxJQUNEO0FBRUQsUUFBSSxLQUFLLGFBQWEsUUFBUSxTQUFTLHlCQUF5QixVQUFVLE9BQU87QUFDL0UsZ0JBQVVBLE9BQU0sVUFBVTtBQUMxQjtBQUNBO0FBQUEsSUFDRDtBQUVELFFBQUksS0FBSyxZQUFZLFFBQVEsU0FBU0wseUJBQXVCO0FBQzNELE1BQUFPLFVBQVNGLE9BQU0sU0FBUztBQUV4QixVQUFJLGNBQWMsTUFBTTtBQUN0QixlQUFPLElBQUcsTUFBTyxTQUFTLE9BQU8sUUFBUyxJQUFHO0FBQzNDLGNBQUksU0FBU0wseUJBQXVCO0FBQ2xDLDBCQUFjSyxPQUFNLGNBQWM7QUFDbEMsbUJBQU8sUUFBTztBQUNkO0FBQUEsVUFDRDtBQUVELGNBQUksU0FBU0YsMEJBQXdCO0FBQ25DLHVCQUFXO0FBQ1g7QUFBQSxVQUNEO0FBQUEsUUFDRjtBQUNEO0FBQUEsTUFDRDtBQUNEO0FBQUEsSUFDRDtBQUVELFFBQUlJLFlBQVcsTUFBTTtBQUNuQixpQkFBVztBQUVYLFVBQUksY0FBYyxNQUFNO0FBQ3RCO0FBQUEsTUFDRDtBQUVEO0FBQUEsSUFDRDtBQUFBLEVBQ0Y7QUFFRCxNQUFJLEtBQUssVUFBVSxNQUFNO0FBQ3ZCLElBQUFDLGFBQVk7QUFDWixJQUFBRCxVQUFTO0FBQUEsRUFDVjtBQUVELE1BQUksT0FBTztBQUNYLE1BQUksU0FBUztBQUNiLE1BQUksT0FBTztBQUVYLE1BQUksUUFBUSxHQUFHO0FBQ2IsYUFBUyxJQUFJLE1BQU0sR0FBRyxLQUFLO0FBQzNCLFVBQU0sSUFBSSxNQUFNLEtBQUs7QUFDckIsaUJBQWE7QUFBQSxFQUNkO0FBRUQsTUFBSSxRQUFRQSxZQUFXLFFBQVEsWUFBWSxHQUFHO0FBQzVDLFdBQU8sSUFBSSxNQUFNLEdBQUcsU0FBUztBQUM3QixXQUFPLElBQUksTUFBTSxTQUFTO0FBQUEsRUFDOUIsV0FBYUEsWUFBVyxNQUFNO0FBQzFCLFdBQU87QUFDUCxXQUFPO0FBQUEsRUFDWCxPQUFTO0FBQ0wsV0FBTztBQUFBLEVBQ1I7QUFFRCxNQUFJLFFBQVEsU0FBUyxNQUFNLFNBQVMsT0FBTyxTQUFTLEtBQUs7QUFDdkQsUUFBSSxnQkFBZ0IsS0FBSyxXQUFXLEtBQUssU0FBUyxDQUFDLENBQUMsR0FBRztBQUNyRCxhQUFPLEtBQUssTUFBTSxHQUFHLEVBQUU7QUFBQSxJQUN4QjtBQUFBLEVBQ0Y7QUFFRCxNQUFJLEtBQUssYUFBYSxNQUFNO0FBQzFCLFFBQUk7QUFBTSxhQUFPWCxRQUFNLGtCQUFrQixJQUFJO0FBRTdDLFFBQUksUUFBUSxnQkFBZ0IsTUFBTTtBQUNoQyxhQUFPQSxRQUFNLGtCQUFrQixJQUFJO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBRUQsUUFBTSxRQUFRO0FBQUEsSUFDWjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsUUFBQVc7QUFBQSxJQUNBLFdBQUFDO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSjtBQUVFLE1BQUksS0FBSyxXQUFXLE1BQU07QUFDeEIsVUFBTSxXQUFXO0FBQ2pCLFFBQUksQ0FBQyxnQkFBZ0IsSUFBSSxHQUFHO0FBQzFCLGFBQU8sS0FBS0gsTUFBSztBQUFBLElBQ2xCO0FBQ0QsVUFBTSxTQUFTO0FBQUEsRUFDaEI7QUFFRCxNQUFJLEtBQUssVUFBVSxRQUFRLEtBQUssV0FBVyxNQUFNO0FBQy9DLFFBQUk7QUFFSixhQUFTLE1BQU0sR0FBRyxNQUFNLFFBQVEsUUFBUSxPQUFPO0FBQzdDLFlBQU0sSUFBSSxZQUFZLFlBQVksSUFBSTtBQUN0QyxZQUFNLElBQUksUUFBUTtBQUNsQixZQUFNLFFBQVEsTUFBTSxNQUFNLEdBQUcsQ0FBQztBQUM5QixVQUFJLEtBQUssUUFBUTtBQUNmLFlBQUksUUFBUSxLQUFLLFVBQVUsR0FBRztBQUM1QixpQkFBTyxLQUFLLFdBQVc7QUFDdkIsaUJBQU8sS0FBSyxRQUFRO0FBQUEsUUFDOUIsT0FBZTtBQUNMLGlCQUFPLEtBQUssUUFBUTtBQUFBLFFBQ3JCO0FBQ0QsY0FBTSxPQUFPLElBQUk7QUFDakIsY0FBTSxZQUFZLE9BQU8sS0FBSztBQUFBLE1BQy9CO0FBQ0QsVUFBSSxRQUFRLEtBQUssVUFBVSxJQUFJO0FBQzdCLGNBQU0sS0FBSyxLQUFLO0FBQUEsTUFDakI7QUFDRCxrQkFBWTtBQUFBLElBQ2I7QUFFRCxRQUFJLGFBQWEsWUFBWSxJQUFJLE1BQU0sUUFBUTtBQUM3QyxZQUFNLFFBQVEsTUFBTSxNQUFNLFlBQVksQ0FBQztBQUN2QyxZQUFNLEtBQUssS0FBSztBQUVoQixVQUFJLEtBQUssUUFBUTtBQUNmLGVBQU8sT0FBTyxTQUFTLEdBQUcsUUFBUTtBQUNsQyxjQUFNLE9BQU8sT0FBTyxTQUFTLEVBQUU7QUFDL0IsY0FBTSxZQUFZLE9BQU8sT0FBTyxTQUFTLEdBQUc7QUFBQSxNQUM3QztBQUFBLElBQ0Y7QUFFRCxVQUFNLFVBQVU7QUFDaEIsVUFBTSxRQUFRO0FBQUEsRUFDZjtBQUVELFNBQU87QUFDVDtBQUVBLElBQUEsU0FBaUJDO0FDcFlqQixNQUFNM0csY0FBWUM7QUFDbEIsTUFBTWdHLFVBQVFqRjtBQU1kLE1BQU07QUFBQSxFQUNOLFlBQUUrRjtBQUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsSUFBSS9HO0FBTUosTUFBTSxjQUFjLENBQUMsTUFBTSxZQUFZO0FBQ3JDLE1BQUksT0FBTyxRQUFRLGdCQUFnQixZQUFZO0FBQzdDLFdBQU8sUUFBUSxZQUFZLEdBQUcsTUFBTSxPQUFPO0FBQUEsRUFDNUM7QUFFRCxPQUFLLEtBQUk7QUFDVCxRQUFNLFFBQVEsSUFBSSxLQUFLLEtBQUssR0FBRztBQUUvQixNQUFJO0FBRUYsUUFBSSxPQUFPLEtBQUs7QUFBQSxFQUNqQixTQUFRLElBQVA7QUFDQSxXQUFPLEtBQUssSUFBSSxPQUFLaUcsUUFBTSxZQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSTtBQUFBLEVBQ3JEO0FBRUQsU0FBTztBQUNUO0FBTUEsTUFBTSxjQUFjLENBQUMsTUFBTSxTQUFTO0FBQ2xDLFNBQU8sV0FBVyxVQUFVLG9CQUFvQjtBQUNsRDtBQVNBLE1BQU1lLFVBQVEsQ0FBQyxPQUFPLFlBQVk7QUFDaEMsTUFBSSxPQUFPLFVBQVUsVUFBVTtBQUM3QixVQUFNLElBQUksVUFBVSxtQkFBbUI7QUFBQSxFQUN4QztBQUVELFVBQVEsYUFBYSxVQUFVO0FBRS9CLFFBQU0sT0FBTyxFQUFFLEdBQUc7QUFDbEIsUUFBTSxNQUFNLE9BQU8sS0FBSyxjQUFjLFdBQVcsS0FBSyxJQUFJRCxjQUFZLEtBQUssU0FBUyxJQUFJQTtBQUV4RixNQUFJLE1BQU0sTUFBTTtBQUNoQixNQUFJLE1BQU0sS0FBSztBQUNiLFVBQU0sSUFBSSxZQUFZLGlCQUFpQix3Q0FBd0MsS0FBSztBQUFBLEVBQ3JGO0FBRUQsUUFBTSxNQUFNLEVBQUUsTUFBTSxPQUFPLE9BQU8sSUFBSSxRQUFRLEtBQUssV0FBVztBQUM5RCxRQUFNLFNBQVMsQ0FBQyxHQUFHO0FBRW5CLFFBQU0sVUFBVSxLQUFLLFVBQVUsS0FBSztBQUNwQyxRQUFNakIsU0FBUUcsUUFBTSxVQUFVLE9BQU87QUFHckMsUUFBTSxpQkFBaUJqRyxZQUFVLFVBQVU4RixNQUFLO0FBQ2hELFFBQU0sZ0JBQWdCOUYsWUFBVSxhQUFhLGNBQWM7QUFFM0QsUUFBTTtBQUFBLElBQ0osYUFBQWlIO0FBQUEsSUFDQSxjQUFBQztBQUFBLElBQ0EsZUFBQUM7QUFBQSxJQUNBLFVBQUFDO0FBQUEsSUFDQSxZQUFBQztBQUFBLElBQ0EsUUFBQUM7QUFBQSxJQUNBLGNBQUFDO0FBQUEsSUFDQSxlQUFBQztBQUFBLElBQ0EsT0FBQUM7QUFBQSxJQUNBLGNBQUFDO0FBQUEsSUFDQSxNQUFBL0I7QUFBQSxJQUNBLGNBQUFnQztBQUFBLEVBQ0QsSUFBRztBQUVKLFFBQU0sV0FBVyxDQUFBQyxVQUFRO0FBQ3ZCLFdBQU8sSUFBSSxnQkFBZ0JELGdCQUFlQyxNQUFLLE1BQU1QLGNBQWFKO0FBQUEsRUFDdEU7QUFFRSxRQUFNLFFBQVEsS0FBSyxNQUFNLEtBQUtLO0FBQzlCLFFBQU0sYUFBYSxLQUFLLE1BQU1HLFNBQVFDO0FBQ3RDLE1BQUksT0FBTyxLQUFLLFNBQVMsT0FBTyxTQUFTLElBQUksSUFBSS9CO0FBRWpELE1BQUksS0FBSyxTQUFTO0FBQ2hCLFdBQU8sSUFBSTtBQUFBLEVBQ1o7QUFHRCxNQUFJLE9BQU8sS0FBSyxVQUFVLFdBQVc7QUFDbkMsU0FBSyxZQUFZLEtBQUs7QUFBQSxFQUN2QjtBQUVELFFBQU0sUUFBUTtBQUFBLElBQ1o7QUFBQSxJQUNBLE9BQU87QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLEtBQUssS0FBSyxRQUFRO0FBQUEsSUFDbEIsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsVUFBVTtBQUFBLElBQ1Y7QUFBQSxFQUNKO0FBRUUsVUFBUU0sUUFBTSxhQUFhLE9BQU8sS0FBSztBQUN2QyxRQUFNLE1BQU07QUFFWixRQUFNLFdBQVcsQ0FBQTtBQUNqQixRQUFNYSxVQUFTLENBQUE7QUFDZixRQUFNLFFBQVEsQ0FBQTtBQUNkLE1BQUksT0FBTztBQUNYLE1BQUk7QUFNSixRQUFNLE1BQU0sTUFBTSxNQUFNLFVBQVUsTUFBTTtBQUN4QyxRQUFNLE9BQU8sTUFBTSxPQUFPLENBQUMsSUFBSSxNQUFNLE1BQU0sTUFBTSxRQUFRO0FBQ3pELFFBQU0sVUFBVSxNQUFNLFVBQVUsTUFBTSxNQUFNLEVBQUUsTUFBTSxVQUFVO0FBQzlELFFBQU0sWUFBWSxNQUFNLE1BQU0sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNuRCxRQUFNLFVBQVUsQ0FBQ2UsU0FBUSxJQUFJLE1BQU0sTUFBTTtBQUN2QyxVQUFNLFlBQVlBO0FBQ2xCLFVBQU0sU0FBUztBQUFBLEVBQ25CO0FBRUUsUUFBTTdCLFVBQVMsQ0FBQVUsV0FBUztBQUN0QixVQUFNLFVBQVVBLE9BQU0sVUFBVSxPQUFPQSxPQUFNLFNBQVNBLE9BQU07QUFDNUQsWUFBUUEsT0FBTSxLQUFLO0FBQUEsRUFDdkI7QUFFRSxRQUFNLFNBQVMsTUFBTTtBQUNuQixRQUFJLFFBQVE7QUFFWixXQUFPLEtBQU0sTUFBSyxRQUFRLEtBQUssQ0FBQyxNQUFNLE9BQU8sS0FBSyxDQUFDLE1BQU0sTUFBTTtBQUM3RDtBQUNBLFlBQU07QUFDTjtBQUFBLElBQ0Q7QUFFRCxRQUFJLFFBQVEsTUFBTSxHQUFHO0FBQ25CLGFBQU87QUFBQSxJQUNSO0FBRUQsVUFBTSxVQUFVO0FBQ2hCLFVBQU07QUFDTixXQUFPO0FBQUEsRUFDWDtBQUVFLFFBQU0sWUFBWSxVQUFRO0FBQ3hCLFVBQU07QUFDTixVQUFNLEtBQUssSUFBSTtBQUFBLEVBQ25CO0FBRUUsUUFBTSxZQUFZLFVBQVE7QUFDeEIsVUFBTTtBQUNOLFVBQU0sSUFBRztBQUFBLEVBQ2I7QUFVRSxRQUFNLE9BQU8sU0FBTztBQUNsQixRQUFJLEtBQUssU0FBUyxZQUFZO0FBQzVCLFlBQU0sVUFBVSxNQUFNLFNBQVMsTUFBTSxJQUFJLFNBQVMsV0FBVyxJQUFJLFNBQVM7QUFDMUUsWUFBTUcsYUFBWSxJQUFJLFlBQVksUUFBUyxTQUFTLFdBQVcsSUFBSSxTQUFTLFVBQVUsSUFBSSxTQUFTO0FBRW5HLFVBQUksSUFBSSxTQUFTLFdBQVcsSUFBSSxTQUFTLFdBQVcsQ0FBQyxXQUFXLENBQUNBLFlBQVc7QUFDMUUsY0FBTSxTQUFTLE1BQU0sT0FBTyxNQUFNLEdBQUcsQ0FBQyxLQUFLLE9BQU8sTUFBTTtBQUN4RCxhQUFLLE9BQU87QUFDWixhQUFLLFFBQVE7QUFDYixhQUFLLFNBQVM7QUFDZCxjQUFNLFVBQVUsS0FBSztBQUFBLE1BQ3RCO0FBQUEsSUFDRjtBQUVELFFBQUksU0FBUyxVQUFVLElBQUksU0FBUyxTQUFTO0FBQzNDLGVBQVMsU0FBUyxTQUFTLEdBQUcsU0FBUyxJQUFJO0FBQUEsSUFDNUM7QUFFRCxRQUFJLElBQUksU0FBUyxJQUFJO0FBQVEsTUFBQWIsUUFBTyxHQUFHO0FBQ3ZDLFFBQUksUUFBUSxLQUFLLFNBQVMsVUFBVSxJQUFJLFNBQVMsUUFBUTtBQUN2RCxXQUFLLFNBQVMsSUFBSTtBQUNsQixXQUFLLFVBQVUsS0FBSyxVQUFVLE1BQU0sSUFBSTtBQUN4QztBQUFBLElBQ0Q7QUFFRCxRQUFJLE9BQU87QUFDWCxXQUFPLEtBQUssR0FBRztBQUNmLFdBQU87QUFBQSxFQUNYO0FBRUUsUUFBTSxjQUFjLENBQUMsTUFBTTZCLFdBQVU7QUFDbkMsVUFBTW5CLFNBQVEsRUFBRSxHQUFHLGNBQWNtQixTQUFRLFlBQVksR0FBRyxPQUFPO0FBRS9ELElBQUFuQixPQUFNLE9BQU87QUFDYixJQUFBQSxPQUFNLFNBQVMsTUFBTTtBQUNyQixJQUFBQSxPQUFNLFNBQVMsTUFBTTtBQUNyQixVQUFNWCxXQUFVLEtBQUssVUFBVSxNQUFNLE1BQU1XLE9BQU07QUFFakQsY0FBVSxRQUFRO0FBQ2xCLFNBQUssRUFBRSxNQUFNLE9BQUFtQixRQUFPLFFBQVEsTUFBTSxTQUFTLEtBQUtULFVBQVEsQ0FBRTtBQUMxRCxTQUFLLEVBQUUsTUFBTSxTQUFTLFNBQVMsTUFBTSxPQUFPLFFBQU8sR0FBSSxRQUFBckIsUUFBTSxDQUFFO0FBQy9ELGFBQVMsS0FBS1csTUFBSztBQUFBLEVBQ3ZCO0FBRUUsUUFBTSxlQUFlLENBQUFBLFdBQVM7QUFDNUIsUUFBSVgsVUFBU1csT0FBTSxTQUFTLEtBQUssVUFBVSxNQUFNO0FBQ2pELFFBQUk7QUFFSixRQUFJQSxPQUFNLFNBQVMsVUFBVTtBQUMzQixVQUFJLGNBQWM7QUFFbEIsVUFBSUEsT0FBTSxTQUFTQSxPQUFNLE1BQU0sU0FBUyxLQUFLQSxPQUFNLE1BQU0sU0FBUyxHQUFHLEdBQUc7QUFDdEUsc0JBQWMsU0FBUyxJQUFJO0FBQUEsTUFDNUI7QUFFRCxVQUFJLGdCQUFnQixRQUFRLElBQUcsS0FBTSxRQUFRLEtBQUssVUFBUyxDQUFFLEdBQUc7QUFDOUQsUUFBQVgsVUFBU1csT0FBTSxRQUFRLE9BQU87QUFBQSxNQUMvQjtBQUVELFVBQUlBLE9BQU0sTUFBTSxTQUFTLEdBQUcsTUFBTSxPQUFPLFVBQVMsTUFBTyxlQUFlLEtBQUssSUFBSSxHQUFHO0FBTWxGLGNBQU0sYUFBYU0sUUFBTSxNQUFNLEVBQUUsR0FBRyxTQUFTLFdBQVcsT0FBTyxFQUFFO0FBRWpFLFFBQUFqQixVQUFTVyxPQUFNLFFBQVEsSUFBSSxjQUFjO0FBQUEsTUFDMUM7QUFFRCxVQUFJQSxPQUFNLEtBQUssU0FBUyxPQUFPO0FBQzdCLGNBQU0saUJBQWlCO0FBQUEsTUFDeEI7QUFBQSxJQUNGO0FBRUQsU0FBSyxFQUFFLE1BQU0sU0FBUyxTQUFTLE1BQU0sT0FBTyxRQUFBWCxRQUFNLENBQUU7QUFDcEQsY0FBVSxRQUFRO0FBQUEsRUFDdEI7QUFNRSxNQUFJLEtBQUssY0FBYyxTQUFTLENBQUMsc0JBQXNCLEtBQUssS0FBSyxHQUFHO0FBQ2xFLFFBQUksY0FBYztBQUVsQixRQUFJQSxVQUFTLE1BQU0sUUFBUSw2QkFBNkIsQ0FBQyxHQUFHLEtBQUtGLFFBQU8sT0FBTyxNQUFNLFVBQVU7QUFDN0YsVUFBSSxVQUFVLE1BQU07QUFDbEIsc0JBQWM7QUFDZCxlQUFPO0FBQUEsTUFDUjtBQUVELFVBQUksVUFBVSxLQUFLO0FBQ2pCLFlBQUksS0FBSztBQUNQLGlCQUFPLE1BQU0sU0FBUyxPQUFPNEIsT0FBTSxPQUFPLEtBQUssTUFBTSxJQUFJO0FBQUEsUUFDMUQ7QUFDRCxZQUFJLFVBQVUsR0FBRztBQUNmLGlCQUFPLGNBQWMsT0FBT0EsT0FBTSxPQUFPLEtBQUssTUFBTSxJQUFJO0FBQUEsUUFDekQ7QUFDRCxlQUFPQSxPQUFNLE9BQU81QixPQUFNLE1BQU07QUFBQSxNQUNqQztBQUVELFVBQUksVUFBVSxLQUFLO0FBQ2pCLGVBQU9vQixhQUFZLE9BQU9wQixPQUFNLE1BQU07QUFBQSxNQUN2QztBQUVELFVBQUksVUFBVSxLQUFLO0FBQ2pCLFlBQUksS0FBSztBQUNQLGlCQUFPLE1BQU0sU0FBUyxPQUFPLE9BQU87QUFBQSxRQUNyQztBQUNELGVBQU87QUFBQSxNQUNSO0FBQ0QsYUFBTyxNQUFNLElBQUksS0FBSztBQUFBLElBQzVCLENBQUs7QUFFRCxRQUFJLGdCQUFnQixNQUFNO0FBQ3hCLFVBQUksS0FBSyxhQUFhLE1BQU07QUFDMUIsUUFBQUUsVUFBU0EsUUFBTyxRQUFRLE9BQU8sRUFBRTtBQUFBLE1BQ3pDLE9BQWE7QUFDTCxRQUFBQSxVQUFTQSxRQUFPLFFBQVEsUUFBUSxPQUFLO0FBQ25DLGlCQUFPLEVBQUUsU0FBUyxNQUFNLElBQUksU0FBVSxJQUFJLE9BQU87QUFBQSxRQUMzRCxDQUFTO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFRCxRQUFJQSxZQUFXLFNBQVMsS0FBSyxhQUFhLE1BQU07QUFDOUMsWUFBTSxTQUFTO0FBQ2YsYUFBTztBQUFBLElBQ1I7QUFFRCxVQUFNLFNBQVNFLFFBQU0sV0FBV0YsU0FBUSxPQUFPLE9BQU87QUFDdEQsV0FBTztBQUFBLEVBQ1I7QUFNRCxTQUFPLENBQUMsSUFBRyxHQUFJO0FBQ2IsWUFBUSxRQUFPO0FBRWYsUUFBSSxVQUFVLE1BQVU7QUFDdEI7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLE1BQU07QUFDbEIsWUFBTSxPQUFPO0FBRWIsVUFBSSxTQUFTLE9BQU8sS0FBSyxTQUFTLE1BQU07QUFDdEM7QUFBQSxNQUNEO0FBRUQsVUFBSSxTQUFTLE9BQU8sU0FBUyxLQUFLO0FBQ2hDO0FBQUEsTUFDRDtBQUVELFVBQUksQ0FBQyxNQUFNO0FBQ1QsaUJBQVM7QUFDVCxhQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU8sQ0FBQTtBQUM1QjtBQUFBLE1BQ0Q7QUFHRCxZQUFNLFFBQVEsT0FBTyxLQUFLLFVBQVcsQ0FBQTtBQUNyQyxVQUFJLFVBQVU7QUFFZCxVQUFJLFNBQVMsTUFBTSxHQUFHLFNBQVMsR0FBRztBQUNoQyxrQkFBVSxNQUFNLEdBQUc7QUFDbkIsY0FBTSxTQUFTO0FBQ2YsWUFBSSxVQUFVLE1BQU0sR0FBRztBQUNyQixtQkFBUztBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBRUQsVUFBSSxLQUFLLGFBQWEsTUFBTTtBQUMxQixnQkFBUSxRQUFPO0FBQUEsTUFDdkIsT0FBYTtBQUNMLGlCQUFTLFFBQU87QUFBQSxNQUNqQjtBQUVELFVBQUksTUFBTSxhQUFhLEdBQUc7QUFDeEIsYUFBSyxFQUFFLE1BQU0sUUFBUSxNQUFPLENBQUE7QUFDNUI7QUFBQSxNQUNEO0FBQUEsSUFDRjtBQU9ELFFBQUksTUFBTSxXQUFXLE1BQU0sVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPO0FBQ3RGLFVBQUksS0FBSyxVQUFVLFNBQVMsVUFBVSxLQUFLO0FBQ3pDLGNBQU0sUUFBUSxLQUFLLE1BQU0sTUFBTSxDQUFDO0FBQ2hDLFlBQUksTUFBTSxTQUFTLEdBQUcsR0FBRztBQUN2QixlQUFLLFFBQVE7QUFFYixjQUFJLE1BQU0sU0FBUyxHQUFHLEdBQUc7QUFDdkIsa0JBQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxHQUFHO0FBQ3RDLGtCQUFNLE1BQU0sS0FBSyxNQUFNLE1BQU0sR0FBRyxHQUFHO0FBQ25DLGtCQUFNK0IsUUFBTyxLQUFLLE1BQU0sTUFBTSxNQUFNLENBQUM7QUFDckMsa0JBQU0sUUFBUSxtQkFBbUJBO0FBQ2pDLGdCQUFJLE9BQU87QUFDVCxtQkFBSyxRQUFRLE1BQU07QUFDbkIsb0JBQU0sWUFBWTtBQUNsQjtBQUVBLGtCQUFJLENBQUMsSUFBSSxVQUFVLE9BQU8sUUFBUSxJQUFJLE1BQU0sR0FBRztBQUM3QyxvQkFBSSxTQUFTVjtBQUFBLGNBQ2Q7QUFDRDtBQUFBLFlBQ0Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFFRCxVQUFLLFVBQVUsT0FBTyxXQUFXLE9BQVMsVUFBVSxPQUFPLFdBQVcsS0FBTTtBQUMxRSxnQkFBUSxLQUFLO0FBQUEsTUFDZDtBQUVELFVBQUksVUFBVSxRQUFRLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPO0FBQ2hFLGdCQUFRLEtBQUs7QUFBQSxNQUNkO0FBRUQsVUFBSSxLQUFLLFVBQVUsUUFBUSxVQUFVLE9BQU8sS0FBSyxVQUFVLEtBQUs7QUFDOUQsZ0JBQVE7QUFBQSxNQUNUO0FBRUQsV0FBSyxTQUFTO0FBQ2QsTUFBQXBCLFFBQU8sRUFBRSxNQUFLLENBQUU7QUFDaEI7QUFBQSxJQUNEO0FBT0QsUUFBSSxNQUFNLFdBQVcsS0FBSyxVQUFVLEtBQUs7QUFDdkMsY0FBUUMsUUFBTSxZQUFZLEtBQUs7QUFDL0IsV0FBSyxTQUFTO0FBQ2QsTUFBQUQsUUFBTyxFQUFFLE1BQUssQ0FBRTtBQUNoQjtBQUFBLElBQ0Q7QUFNRCxRQUFJLFVBQVUsS0FBSztBQUNqQixZQUFNLFNBQVMsTUFBTSxXQUFXLElBQUksSUFBSTtBQUN4QyxVQUFJLEtBQUssZUFBZSxNQUFNO0FBQzVCLGFBQUssRUFBRSxNQUFNLFFBQVEsTUFBTyxDQUFBO0FBQUEsTUFDN0I7QUFDRDtBQUFBLElBQ0Q7QUFNRCxRQUFJLFVBQVUsS0FBSztBQUNqQixnQkFBVSxRQUFRO0FBQ2xCLFdBQUssRUFBRSxNQUFNLFNBQVMsTUFBTyxDQUFBO0FBQzdCO0FBQUEsSUFDRDtBQUVELFFBQUksVUFBVSxLQUFLO0FBQ2pCLFVBQUksTUFBTSxXQUFXLEtBQUssS0FBSyxtQkFBbUIsTUFBTTtBQUN0RCxjQUFNLElBQUksWUFBWSxZQUFZLFdBQVcsR0FBRyxDQUFDO0FBQUEsTUFDbEQ7QUFFRCxZQUFNLFVBQVUsU0FBUyxTQUFTLFNBQVM7QUFDM0MsVUFBSSxXQUFXLE1BQU0sV0FBVyxRQUFRLFNBQVMsR0FBRztBQUNsRCxxQkFBYSxTQUFTLElBQUcsQ0FBRTtBQUMzQjtBQUFBLE1BQ0Q7QUFFRCxXQUFLLEVBQUUsTUFBTSxTQUFTLE9BQU8sUUFBUSxNQUFNLFNBQVMsTUFBTSxNQUFLLENBQUU7QUFDakUsZ0JBQVUsUUFBUTtBQUNsQjtBQUFBLElBQ0Q7QUFNRCxRQUFJLFVBQVUsS0FBSztBQUNqQixVQUFJLEtBQUssY0FBYyxRQUFRLENBQUMsWUFBWSxTQUFTLEdBQUcsR0FBRztBQUN6RCxZQUFJLEtBQUssY0FBYyxRQUFRLEtBQUssbUJBQW1CLE1BQU07QUFDM0QsZ0JBQU0sSUFBSSxZQUFZLFlBQVksV0FBVyxHQUFHLENBQUM7QUFBQSxRQUNsRDtBQUVELGdCQUFRLEtBQUs7QUFBQSxNQUNyQixPQUFhO0FBQ0wsa0JBQVUsVUFBVTtBQUFBLE1BQ3JCO0FBRUQsV0FBSyxFQUFFLE1BQU0sV0FBVyxNQUFPLENBQUE7QUFDL0I7QUFBQSxJQUNEO0FBRUQsUUFBSSxVQUFVLEtBQUs7QUFDakIsVUFBSSxLQUFLLGNBQWMsUUFBUyxRQUFRLEtBQUssU0FBUyxhQUFhLEtBQUssTUFBTSxXQUFXLEdBQUk7QUFDM0YsYUFBSyxFQUFFLE1BQU0sUUFBUSxPQUFPLFFBQVEsS0FBSyxRQUFPLENBQUU7QUFDbEQ7QUFBQSxNQUNEO0FBRUQsVUFBSSxNQUFNLGFBQWEsR0FBRztBQUN4QixZQUFJLEtBQUssbUJBQW1CLE1BQU07QUFDaEMsZ0JBQU0sSUFBSSxZQUFZLFlBQVksV0FBVyxHQUFHLENBQUM7QUFBQSxRQUNsRDtBQUVELGFBQUssRUFBRSxNQUFNLFFBQVEsT0FBTyxRQUFRLEtBQUssUUFBTyxDQUFFO0FBQ2xEO0FBQUEsTUFDRDtBQUVELGdCQUFVLFVBQVU7QUFFcEIsWUFBTSxZQUFZLEtBQUssTUFBTSxNQUFNLENBQUM7QUFDcEMsVUFBSSxLQUFLLFVBQVUsUUFBUSxVQUFVLE9BQU8sT0FBTyxDQUFDLFVBQVUsU0FBUyxHQUFHLEdBQUc7QUFDM0UsZ0JBQVEsSUFBSTtBQUFBLE1BQ2I7QUFFRCxXQUFLLFNBQVM7QUFDZCxNQUFBQSxRQUFPLEVBQUUsTUFBSyxDQUFFO0FBSWhCLFVBQUksS0FBSyxvQkFBb0IsU0FBU0MsUUFBTSxjQUFjLFNBQVMsR0FBRztBQUNwRTtBQUFBLE1BQ0Q7QUFFRCxZQUFNOEIsV0FBVTlCLFFBQU0sWUFBWSxLQUFLLEtBQUs7QUFDNUMsWUFBTSxTQUFTLE1BQU0sT0FBTyxNQUFNLEdBQUcsQ0FBQyxLQUFLLE1BQU0sTUFBTTtBQUl2RCxVQUFJLEtBQUssb0JBQW9CLE1BQU07QUFDakMsY0FBTSxVQUFVOEI7QUFDaEIsYUFBSyxRQUFRQTtBQUNiO0FBQUEsTUFDRDtBQUdELFdBQUssUUFBUSxJQUFJLFVBQVVBLFlBQVcsS0FBSztBQUMzQyxZQUFNLFVBQVUsS0FBSztBQUNyQjtBQUFBLElBQ0Q7QUFNRCxRQUFJLFVBQVUsT0FBTyxLQUFLLFlBQVksTUFBTTtBQUMxQyxnQkFBVSxRQUFRO0FBRWxCLFlBQU0zRixRQUFPO0FBQUEsUUFDWCxNQUFNO0FBQUEsUUFDTjtBQUFBLFFBQ0EsUUFBUTtBQUFBLFFBQ1IsYUFBYSxNQUFNLE9BQU87QUFBQSxRQUMxQixhQUFhLE1BQU0sT0FBTztBQUFBLE1BQ2xDO0FBRU0sTUFBQTBFLFFBQU8sS0FBSzFFLEtBQUk7QUFDaEIsV0FBS0EsS0FBSTtBQUNUO0FBQUEsSUFDRDtBQUVELFFBQUksVUFBVSxLQUFLO0FBQ2pCLFlBQU0sUUFBUTBFLFFBQU9BLFFBQU8sU0FBUztBQUVyQyxVQUFJLEtBQUssWUFBWSxRQUFRLENBQUMsT0FBTztBQUNuQyxhQUFLLEVBQUUsTUFBTSxRQUFRLE9BQU8sUUFBUSxNQUFLLENBQUU7QUFDM0M7QUFBQSxNQUNEO0FBRUQsVUFBSWYsVUFBUztBQUViLFVBQUksTUFBTSxTQUFTLE1BQU07QUFDdkIsY0FBTSxNQUFNLE9BQU87QUFDbkIsY0FBTSxRQUFRLENBQUE7QUFFZCxpQkFBUyxJQUFJLElBQUksU0FBUyxHQUFHLEtBQUssR0FBRyxLQUFLO0FBQ3hDLGlCQUFPLElBQUc7QUFDVixjQUFJLElBQUksR0FBRyxTQUFTLFNBQVM7QUFDM0I7QUFBQSxVQUNEO0FBQ0QsY0FBSSxJQUFJLEdBQUcsU0FBUyxRQUFRO0FBQzFCLGtCQUFNLFFBQVEsSUFBSSxHQUFHLEtBQUs7QUFBQSxVQUMzQjtBQUFBLFFBQ0Y7QUFFRCxRQUFBQSxVQUFTLFlBQVksT0FBTyxJQUFJO0FBQ2hDLGNBQU0sWUFBWTtBQUFBLE1BQ25CO0FBRUQsVUFBSSxNQUFNLFVBQVUsUUFBUSxNQUFNLFNBQVMsTUFBTTtBQUMvQyxjQUFNLE1BQU0sTUFBTSxPQUFPLE1BQU0sR0FBRyxNQUFNLFdBQVc7QUFDbkQsY0FBTSxPQUFPLE1BQU0sT0FBTyxNQUFNLE1BQU0sV0FBVztBQUNqRCxjQUFNLFFBQVEsTUFBTSxTQUFTO0FBQzdCLGdCQUFRQSxVQUFTO0FBQ2pCLGNBQU0sU0FBUztBQUNmLG1CQUFXLEtBQUssTUFBTTtBQUNwQixnQkFBTSxVQUFXLEVBQUUsVUFBVSxFQUFFO0FBQUEsUUFDaEM7QUFBQSxNQUNGO0FBRUQsV0FBSyxFQUFFLE1BQU0sU0FBUyxPQUFPLFFBQUFBLFFBQVEsQ0FBQTtBQUNyQyxnQkFBVSxRQUFRO0FBQ2xCLE1BQUFlLFFBQU8sSUFBRztBQUNWO0FBQUEsSUFDRDtBQU1ELFFBQUksVUFBVSxLQUFLO0FBQ2pCLFVBQUksU0FBUyxTQUFTLEdBQUc7QUFDdkIsaUJBQVMsU0FBUyxTQUFTLEdBQUc7QUFBQSxNQUMvQjtBQUNELFdBQUssRUFBRSxNQUFNLFFBQVEsTUFBTyxDQUFBO0FBQzVCO0FBQUEsSUFDRDtBQU1ELFFBQUksVUFBVSxLQUFLO0FBQ2pCLFVBQUlmLFVBQVM7QUFFYixZQUFNLFFBQVFlLFFBQU9BLFFBQU8sU0FBUztBQUNyQyxVQUFJLFNBQVMsTUFBTSxNQUFNLFNBQVMsT0FBTyxVQUFVO0FBQ2pELGNBQU0sUUFBUTtBQUNkLFFBQUFmLFVBQVM7QUFBQSxNQUNWO0FBRUQsV0FBSyxFQUFFLE1BQU0sU0FBUyxPQUFPLFFBQUFBLFFBQVEsQ0FBQTtBQUNyQztBQUFBLElBQ0Q7QUFNRCxRQUFJLFVBQVUsS0FBSztBQUtqQixVQUFJLEtBQUssU0FBUyxTQUFTLE1BQU0sVUFBVSxNQUFNLFFBQVEsR0FBRztBQUMxRCxjQUFNLFFBQVEsTUFBTSxRQUFRO0FBQzVCLGNBQU0sV0FBVztBQUNqQixjQUFNLFNBQVM7QUFDZixlQUFPLElBQUc7QUFDVixlQUFPO0FBQ1A7QUFBQSxNQUNEO0FBRUQsV0FBSyxFQUFFLE1BQU0sU0FBUyxPQUFPLFFBQVFvQixlQUFhLENBQUU7QUFDcEQ7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLEtBQUs7QUFDakIsVUFBSSxNQUFNLFNBQVMsS0FBSyxLQUFLLFNBQVMsT0FBTztBQUMzQyxZQUFJLEtBQUssVUFBVTtBQUFLLGVBQUssU0FBU0Y7QUFDdEMsY0FBTSxRQUFRSCxRQUFPQSxRQUFPLFNBQVM7QUFDckMsYUFBSyxPQUFPO0FBQ1osYUFBSyxVQUFVO0FBQ2YsYUFBSyxTQUFTO0FBQ2QsY0FBTSxPQUFPO0FBQ2I7QUFBQSxNQUNEO0FBRUQsVUFBSyxNQUFNLFNBQVMsTUFBTSxXQUFZLEtBQUssS0FBSyxTQUFTLFNBQVMsS0FBSyxTQUFTLFNBQVM7QUFDdkYsYUFBSyxFQUFFLE1BQU0sUUFBUSxPQUFPLFFBQVFHLGFBQVcsQ0FBRTtBQUNqRDtBQUFBLE1BQ0Q7QUFFRCxXQUFLLEVBQUUsTUFBTSxPQUFPLE9BQU8sUUFBUUEsYUFBVyxDQUFFO0FBQ2hEO0FBQUEsSUFDRDtBQU1ELFFBQUksVUFBVSxLQUFLO0FBQ2pCLFlBQU0sVUFBVSxRQUFRLEtBQUssVUFBVTtBQUN2QyxVQUFJLENBQUMsV0FBVyxLQUFLLGNBQWMsUUFBUSxLQUFNLE1BQUssT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLO0FBQzVFLG9CQUFZLFNBQVMsS0FBSztBQUMxQjtBQUFBLE1BQ0Q7QUFFRCxVQUFJLFFBQVEsS0FBSyxTQUFTLFNBQVM7QUFDakMsY0FBTSxPQUFPO0FBQ2IsWUFBSWxCLFVBQVM7QUFFYixZQUFJLFNBQVMsT0FBTyxDQUFDRSxRQUFNLG9CQUFtQixHQUFJO0FBQ2hELGdCQUFNLElBQUksTUFBTSx5REFBeUQ7QUFBQSxRQUMxRTtBQUVELFlBQUssS0FBSyxVQUFVLE9BQU8sQ0FBQyxTQUFTLEtBQUssSUFBSSxLQUFPLFNBQVMsT0FBTyxDQUFDLGVBQWUsS0FBSyxVQUFXLENBQUEsR0FBSTtBQUN2RyxVQUFBRixVQUFTLEtBQUs7QUFBQSxRQUNmO0FBRUQsYUFBSyxFQUFFLE1BQU0sUUFBUSxPQUFPLFFBQUFBLFFBQVEsQ0FBQTtBQUNwQztBQUFBLE1BQ0Q7QUFFRCxVQUFJLEtBQUssUUFBUSxTQUFTLEtBQUssU0FBUyxXQUFXLEtBQUssU0FBUyxRQUFRO0FBQ3ZFLGFBQUssRUFBRSxNQUFNLFNBQVMsT0FBTyxRQUFRMkIsY0FBWSxDQUFFO0FBQ25EO0FBQUEsTUFDRDtBQUVELFdBQUssRUFBRSxNQUFNLFNBQVMsT0FBTyxRQUFRRCxPQUFLLENBQUU7QUFDNUM7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLEtBQUs7QUFDakIsVUFBSSxLQUFLLGNBQWMsUUFBUSxLQUFJLE1BQU8sS0FBSztBQUM3QyxZQUFJLEtBQUssQ0FBQyxNQUFNLE9BQU8sQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUMsR0FBRztBQUM5QyxzQkFBWSxVQUFVLEtBQUs7QUFDM0I7QUFBQSxRQUNEO0FBQUEsTUFDRjtBQUVELFVBQUksS0FBSyxhQUFhLFFBQVEsTUFBTSxVQUFVLEdBQUc7QUFDL0M7QUFDQTtBQUFBLE1BQ0Q7QUFBQSxJQUNGO0FBTUQsUUFBSSxVQUFVLEtBQUs7QUFDakIsVUFBSSxLQUFLLGNBQWMsUUFBUSxLQUFJLE1BQU8sT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLO0FBQ2hFLG9CQUFZLFFBQVEsS0FBSztBQUN6QjtBQUFBLE1BQ0Q7QUFFRCxVQUFLLFFBQVEsS0FBSyxVQUFVLE9BQVEsS0FBSyxVQUFVLE9BQU87QUFDeEQsYUFBSyxFQUFFLE1BQU0sUUFBUSxPQUFPLFFBQVFQLGNBQVksQ0FBRTtBQUNsRDtBQUFBLE1BQ0Q7QUFFRCxVQUFLLFNBQVMsS0FBSyxTQUFTLGFBQWEsS0FBSyxTQUFTLFdBQVcsS0FBSyxTQUFTLFlBQWEsTUFBTSxTQUFTLEdBQUc7QUFDN0csYUFBSyxFQUFFLE1BQU0sUUFBUSxNQUFPLENBQUE7QUFDNUI7QUFBQSxNQUNEO0FBRUQsV0FBSyxFQUFFLE1BQU0sUUFBUSxPQUFPQSxjQUFjLENBQUE7QUFDMUM7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLEtBQUs7QUFDakIsVUFBSSxLQUFLLGNBQWMsUUFBUSxLQUFJLE1BQU8sT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLO0FBQ2hFLGFBQUssRUFBRSxNQUFNLE1BQU0sU0FBUyxNQUFNLE9BQU8sUUFBUSxHQUFFLENBQUU7QUFDckQ7QUFBQSxNQUNEO0FBRUQsV0FBSyxFQUFFLE1BQU0sUUFBUSxNQUFPLENBQUE7QUFDNUI7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLEtBQUs7QUFDakIsVUFBSSxVQUFVLE9BQU8sVUFBVSxLQUFLO0FBQ2xDLGdCQUFRLEtBQUs7QUFBQSxNQUNkO0FBRUQsWUFBTSxRQUFRLHdCQUF3QixLQUFLLFVBQVcsQ0FBQTtBQUN0RCxVQUFJLE9BQU87QUFDVCxpQkFBUyxNQUFNO0FBQ2YsY0FBTSxTQUFTLE1BQU0sR0FBRztBQUFBLE1BQ3pCO0FBRUQsV0FBSyxFQUFFLE1BQU0sUUFBUSxNQUFPLENBQUE7QUFDNUI7QUFBQSxJQUNEO0FBTUQsUUFBSSxTQUFTLEtBQUssU0FBUyxjQUFjLEtBQUssU0FBUyxPQUFPO0FBQzVELFdBQUssT0FBTztBQUNaLFdBQUssT0FBTztBQUNaLFdBQUssU0FBUztBQUNkLFdBQUssU0FBUztBQUNkLFlBQU0sWUFBWTtBQUNsQixZQUFNLFdBQVc7QUFDakIsY0FBUSxLQUFLO0FBQ2I7QUFBQSxJQUNEO0FBRUQsUUFBSSxPQUFPO0FBQ1gsUUFBSSxLQUFLLGNBQWMsUUFBUSxVQUFVLEtBQUssSUFBSSxHQUFHO0FBQ25ELGtCQUFZLFFBQVEsS0FBSztBQUN6QjtBQUFBLElBQ0Q7QUFFRCxRQUFJLEtBQUssU0FBUyxRQUFRO0FBQ3hCLFVBQUksS0FBSyxlQUFlLE1BQU07QUFDNUIsZ0JBQVEsS0FBSztBQUNiO0FBQUEsTUFDRDtBQUVELFlBQU0sUUFBUSxLQUFLO0FBQ25CLFlBQU0sU0FBUyxNQUFNO0FBQ3JCLFlBQU0sVUFBVSxNQUFNLFNBQVMsV0FBVyxNQUFNLFNBQVM7QUFDekQsWUFBTSxZQUFZLFdBQVcsT0FBTyxTQUFTLFVBQVUsT0FBTyxTQUFTO0FBRXZFLFVBQUksS0FBSyxTQUFTLFNBQVMsQ0FBQyxXQUFZLEtBQUssTUFBTSxLQUFLLE9BQU8sTUFBTztBQUNwRSxhQUFLLEVBQUUsTUFBTSxRQUFRLE9BQU8sUUFBUSxHQUFFLENBQUU7QUFDeEM7QUFBQSxNQUNEO0FBRUQsWUFBTSxVQUFVLE1BQU0sU0FBUyxNQUFNLE1BQU0sU0FBUyxXQUFXLE1BQU0sU0FBUztBQUM5RSxZQUFNTCxhQUFZLFNBQVMsV0FBVyxNQUFNLFNBQVMsVUFBVSxNQUFNLFNBQVM7QUFDOUUsVUFBSSxDQUFDLFdBQVcsTUFBTSxTQUFTLFdBQVcsQ0FBQyxXQUFXLENBQUNBLFlBQVc7QUFDaEUsYUFBSyxFQUFFLE1BQU0sUUFBUSxPQUFPLFFBQVEsR0FBRSxDQUFFO0FBQ3hDO0FBQUEsTUFDRDtBQUdELGFBQU8sS0FBSyxNQUFNLEdBQUcsQ0FBQyxNQUFNLE9BQU87QUFDakMsY0FBTSxRQUFRLE1BQU0sTUFBTSxRQUFRO0FBQ2xDLFlBQUksU0FBUyxVQUFVLEtBQUs7QUFDMUI7QUFBQSxRQUNEO0FBQ0QsZUFBTyxLQUFLLE1BQU0sQ0FBQztBQUNuQixnQkFBUSxPQUFPLENBQUM7QUFBQSxNQUNqQjtBQUVELFVBQUksTUFBTSxTQUFTLFNBQVMsSUFBRyxHQUFJO0FBQ2pDLGFBQUssT0FBTztBQUNaLGFBQUssU0FBUztBQUNkLGFBQUssU0FBUyxTQUFTLElBQUk7QUFDM0IsY0FBTSxTQUFTLEtBQUs7QUFDcEIsY0FBTSxXQUFXO0FBQ2pCLGdCQUFRLEtBQUs7QUFDYjtBQUFBLE1BQ0Q7QUFFRCxVQUFJLE1BQU0sU0FBUyxXQUFXLE1BQU0sS0FBSyxTQUFTLFNBQVMsQ0FBQyxhQUFhLE9BQU87QUFDOUUsY0FBTSxTQUFTLE1BQU0sT0FBTyxNQUFNLEdBQUcsRUFBRSxNQUFNLFNBQVMsS0FBSyxRQUFRLE1BQU07QUFDekUsY0FBTSxTQUFTLE1BQU0sTUFBTTtBQUUzQixhQUFLLE9BQU87QUFDWixhQUFLLFNBQVMsU0FBUyxJQUFJLEtBQUssS0FBSyxnQkFBZ0IsTUFBTTtBQUMzRCxhQUFLLFNBQVM7QUFDZCxjQUFNLFdBQVc7QUFDakIsY0FBTSxVQUFVLE1BQU0sU0FBUyxLQUFLO0FBQ3BDLGdCQUFRLEtBQUs7QUFDYjtBQUFBLE1BQ0Q7QUFFRCxVQUFJLE1BQU0sU0FBUyxXQUFXLE1BQU0sS0FBSyxTQUFTLFNBQVMsS0FBSyxPQUFPLEtBQUs7QUFDMUUsY0FBTSxNQUFNLEtBQUssT0FBTyxTQUFTLE9BQU87QUFFeEMsY0FBTSxTQUFTLE1BQU0sT0FBTyxNQUFNLEdBQUcsRUFBRSxNQUFNLFNBQVMsS0FBSyxRQUFRLE1BQU07QUFDekUsY0FBTSxTQUFTLE1BQU0sTUFBTTtBQUUzQixhQUFLLE9BQU87QUFDWixhQUFLLFNBQVMsR0FBRyxTQUFTLElBQUksSUFBSU0sa0JBQWlCQSxpQkFBZ0I7QUFDbkUsYUFBSyxTQUFTO0FBRWQsY0FBTSxVQUFVLE1BQU0sU0FBUyxLQUFLO0FBQ3BDLGNBQU0sV0FBVztBQUVqQixnQkFBUSxRQUFRLFFBQU8sQ0FBRTtBQUV6QixhQUFLLEVBQUUsTUFBTSxTQUFTLE9BQU8sS0FBSyxRQUFRLEdBQUUsQ0FBRTtBQUM5QztBQUFBLE1BQ0Q7QUFFRCxVQUFJLE1BQU0sU0FBUyxTQUFTLEtBQUssT0FBTyxLQUFLO0FBQzNDLGFBQUssT0FBTztBQUNaLGFBQUssU0FBUztBQUNkLGFBQUssU0FBUyxRQUFRQSxrQkFBaUIsU0FBUyxJQUFJLElBQUlBO0FBQ3hELGNBQU0sU0FBUyxLQUFLO0FBQ3BCLGNBQU0sV0FBVztBQUNqQixnQkFBUSxRQUFRLFFBQU8sQ0FBRTtBQUN6QixhQUFLLEVBQUUsTUFBTSxTQUFTLE9BQU8sS0FBSyxRQUFRLEdBQUUsQ0FBRTtBQUM5QztBQUFBLE1BQ0Q7QUFHRCxZQUFNLFNBQVMsTUFBTSxPQUFPLE1BQU0sR0FBRyxDQUFDLEtBQUssT0FBTyxNQUFNO0FBR3hELFdBQUssT0FBTztBQUNaLFdBQUssU0FBUyxTQUFTLElBQUk7QUFDM0IsV0FBSyxTQUFTO0FBR2QsWUFBTSxVQUFVLEtBQUs7QUFDckIsWUFBTSxXQUFXO0FBQ2pCLGNBQVEsS0FBSztBQUNiO0FBQUEsSUFDRDtBQUVELFVBQU1ULFNBQVEsRUFBRSxNQUFNLFFBQVEsT0FBTyxRQUFRO0FBRTdDLFFBQUksS0FBSyxTQUFTLE1BQU07QUFDdEIsTUFBQUEsT0FBTSxTQUFTO0FBQ2YsVUFBSSxLQUFLLFNBQVMsU0FBUyxLQUFLLFNBQVMsU0FBUztBQUNoRCxRQUFBQSxPQUFNLFNBQVMsUUFBUUEsT0FBTTtBQUFBLE1BQzlCO0FBQ0QsV0FBS0EsTUFBSztBQUNWO0FBQUEsSUFDRDtBQUVELFFBQUksU0FBUyxLQUFLLFNBQVMsYUFBYSxLQUFLLFNBQVMsWUFBWSxLQUFLLFVBQVUsTUFBTTtBQUNyRixNQUFBQSxPQUFNLFNBQVM7QUFDZixXQUFLQSxNQUFLO0FBQ1Y7QUFBQSxJQUNEO0FBRUQsUUFBSSxNQUFNLFVBQVUsTUFBTSxTQUFTLEtBQUssU0FBUyxXQUFXLEtBQUssU0FBUyxPQUFPO0FBQy9FLFVBQUksS0FBSyxTQUFTLE9BQU87QUFDdkIsY0FBTSxVQUFVYTtBQUNoQixhQUFLLFVBQVVBO0FBQUEsTUFFdkIsV0FBaUIsS0FBSyxRQUFRLE1BQU07QUFDNUIsY0FBTSxVQUFVQztBQUNoQixhQUFLLFVBQVVBO0FBQUEsTUFFdkIsT0FBYTtBQUNMLGNBQU0sVUFBVTtBQUNoQixhQUFLLFVBQVU7QUFBQSxNQUNoQjtBQUVELFVBQUksS0FBTSxNQUFLLEtBQUs7QUFDbEIsY0FBTSxVQUFVSjtBQUNoQixhQUFLLFVBQVVBO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBRUQsU0FBS1YsTUFBSztBQUFBLEVBQ1g7QUFFRCxTQUFPLE1BQU0sV0FBVyxHQUFHO0FBQ3pCLFFBQUksS0FBSyxtQkFBbUI7QUFBTSxZQUFNLElBQUksWUFBWSxZQUFZLFdBQVcsR0FBRyxDQUFDO0FBQ25GLFVBQU0sU0FBU1QsUUFBTSxXQUFXLE1BQU0sUUFBUSxHQUFHO0FBQ2pELGNBQVUsVUFBVTtBQUFBLEVBQ3JCO0FBRUQsU0FBTyxNQUFNLFNBQVMsR0FBRztBQUN2QixRQUFJLEtBQUssbUJBQW1CO0FBQU0sWUFBTSxJQUFJLFlBQVksWUFBWSxXQUFXLEdBQUcsQ0FBQztBQUNuRixVQUFNLFNBQVNBLFFBQU0sV0FBVyxNQUFNLFFBQVEsR0FBRztBQUNqRCxjQUFVLFFBQVE7QUFBQSxFQUNuQjtBQUVELFNBQU8sTUFBTSxTQUFTLEdBQUc7QUFDdkIsUUFBSSxLQUFLLG1CQUFtQjtBQUFNLFlBQU0sSUFBSSxZQUFZLFlBQVksV0FBVyxHQUFHLENBQUM7QUFDbkYsVUFBTSxTQUFTQSxRQUFNLFdBQVcsTUFBTSxRQUFRLEdBQUc7QUFDakQsY0FBVSxRQUFRO0FBQUEsRUFDbkI7QUFFRCxNQUFJLEtBQUssa0JBQWtCLFNBQVMsS0FBSyxTQUFTLFVBQVUsS0FBSyxTQUFTLFlBQVk7QUFDcEYsU0FBSyxFQUFFLE1BQU0sZUFBZSxPQUFPLElBQUksUUFBUSxHQUFHa0Isa0JBQWtCLENBQUE7QUFBQSxFQUNyRTtBQUdELE1BQUksTUFBTSxjQUFjLE1BQU07QUFDNUIsVUFBTSxTQUFTO0FBRWYsZUFBV1QsVUFBUyxNQUFNLFFBQVE7QUFDaEMsWUFBTSxVQUFVQSxPQUFNLFVBQVUsT0FBT0EsT0FBTSxTQUFTQSxPQUFNO0FBRTVELFVBQUlBLE9BQU0sUUFBUTtBQUNoQixjQUFNLFVBQVVBLE9BQU07QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUQsU0FBTztBQUNUO0FBUUFNLFFBQU0sWUFBWSxDQUFDLE9BQU8sWUFBWTtBQUNwQyxRQUFNLE9BQU8sRUFBRSxHQUFHO0FBQ2xCLFFBQU0sTUFBTSxPQUFPLEtBQUssY0FBYyxXQUFXLEtBQUssSUFBSUQsY0FBWSxLQUFLLFNBQVMsSUFBSUE7QUFDeEYsUUFBTSxNQUFNLE1BQU07QUFDbEIsTUFBSSxNQUFNLEtBQUs7QUFDYixVQUFNLElBQUksWUFBWSxpQkFBaUIsd0NBQXdDLEtBQUs7QUFBQSxFQUNyRjtBQUVELFVBQVEsYUFBYSxVQUFVO0FBQy9CLFFBQU1qQixTQUFRRyxRQUFNLFVBQVUsT0FBTztBQUdyQyxRQUFNO0FBQUEsSUFDSixhQUFBZ0I7QUFBQSxJQUNBLGVBQUFFO0FBQUEsSUFDQSxVQUFBQztBQUFBLElBQ0EsWUFBQUM7QUFBQSxJQUNBLFFBQUFDO0FBQUEsSUFDQSxTQUFBVTtBQUFBLElBQ0EsZUFBQVI7QUFBQSxJQUNBLE1BQUE3QjtBQUFBLElBQ0EsY0FBQWdDO0FBQUEsRUFDSixJQUFNM0gsWUFBVSxVQUFVOEYsTUFBSztBQUU3QixRQUFNLFFBQVEsS0FBSyxNQUFNa0MsV0FBVVY7QUFDbkMsUUFBTSxXQUFXLEtBQUssTUFBTUUsaUJBQWdCRjtBQUM1QyxRQUFNLFVBQVUsS0FBSyxVQUFVLEtBQUs7QUFDcEMsUUFBTSxRQUFRLEVBQUUsU0FBUyxPQUFPLFFBQVEsR0FBRTtBQUMxQyxNQUFJLE9BQU8sS0FBSyxTQUFTLE9BQU8sUUFBUTNCO0FBRXhDLE1BQUksS0FBSyxTQUFTO0FBQ2hCLFdBQU8sSUFBSTtBQUFBLEVBQ1o7QUFFRCxRQUFNLFdBQVcsQ0FBQWlDLFVBQVE7QUFDdkIsUUFBSUEsTUFBSyxlQUFlO0FBQU0sYUFBTztBQUNyQyxXQUFPLElBQUksZ0JBQWdCRCxnQkFBZUMsTUFBSyxNQUFNUCxjQUFhSjtBQUFBLEVBQ3RFO0FBRUUsUUFBTSxTQUFTLFNBQU87QUFDcEIsWUFBUTtBQUFBLFdBQ0Q7QUFDSCxlQUFPLEdBQUcsUUFBUUcsWUFBVztBQUFBLFdBRTFCO0FBQ0gsZUFBTyxHQUFHSCxlQUFjRyxZQUFXO0FBQUEsV0FFaEM7QUFDSCxlQUFPLEdBQUcsUUFBUSxPQUFPSCxlQUFjRyxZQUFXO0FBQUEsV0FFL0M7QUFDSCxlQUFPLEdBQUcsUUFBUSxPQUFPRCxpQkFBZ0JDLFlBQVcsV0FBVztBQUFBLFdBRTVEO0FBQ0gsZUFBTyxRQUFRLFNBQVMsSUFBSTtBQUFBLFdBRXpCO0FBQ0gsZUFBTyxNQUFNLFFBQVEsU0FBUyxJQUFJLElBQUlELG1CQUFrQixXQUFXQyxZQUFXO0FBQUEsV0FFM0U7QUFDSCxlQUFPLE1BQU0sUUFBUSxTQUFTLElBQUksSUFBSUQsbUJBQWtCLFdBQVcsT0FBT0YsZUFBY0csWUFBVztBQUFBLFdBRWhHO0FBQ0gsZUFBTyxNQUFNLFFBQVEsU0FBUyxJQUFJLElBQUlELG1CQUFrQkYsZUFBY0csWUFBVztBQUFBLGVBRTFFO0FBQ1AsY0FBTSxRQUFRLGlCQUFpQixLQUFLLEdBQUc7QUFDdkMsWUFBSSxDQUFDO0FBQU87QUFFWixjQUFNYSxVQUFTLE9BQU8sTUFBTSxFQUFFO0FBQzlCLFlBQUksQ0FBQ0E7QUFBUTtBQUViLGVBQU9BLFVBQVNoQixlQUFjLE1BQU07QUFBQSxNQUNyQztBQUFBO0FBQUEsRUFFUDtBQUVFLFFBQU1sQixVQUFTRSxRQUFNLGFBQWEsT0FBTyxLQUFLO0FBQzlDLE1BQUksU0FBUyxPQUFPRixPQUFNO0FBRTFCLE1BQUksVUFBVSxLQUFLLGtCQUFrQixNQUFNO0FBQ3pDLGNBQVUsR0FBR29CO0FBQUEsRUFDZDtBQUVELFNBQU87QUFDVDtBQUVBLElBQUFlLFlBQWlCbEI7QUNoa0NqQixNQUFNM0csU0FBT0osb0JBQUFBO0FBQ2IsTUFBTSxPQUFPZTtBQUNiLE1BQU1nRyxVQUFRL0Y7QUFDZCxNQUFNZ0YsVUFBUS9FO0FBQ2QsTUFBTWxCLGNBQVlvQjtBQUNsQixNQUFNK0csYUFBVyxTQUFPLE9BQU8sT0FBTyxRQUFRLFlBQVksQ0FBQyxNQUFNLFFBQVEsR0FBRztBQXdCNUUsTUFBTUMsY0FBWSxDQUFDLE1BQU0sU0FBUyxjQUFjLFVBQVU7QUFDeEQsTUFBSSxNQUFNLFFBQVEsSUFBSSxHQUFHO0FBQ3ZCLFVBQU0sTUFBTSxLQUFLLElBQUksV0FBU0EsWUFBVSxPQUFPLFNBQVMsV0FBVyxDQUFDO0FBQ3BFLFVBQU0sZUFBZSxTQUFPO0FBQzFCLGlCQUFXLFdBQVcsS0FBSztBQUN6QixjQUFNQyxTQUFRLFFBQVEsR0FBRztBQUN6QixZQUFJQTtBQUFPLGlCQUFPQTtBQUFBLE1BQ25CO0FBQ0QsYUFBTztBQUFBLElBQ2I7QUFDSSxXQUFPO0FBQUEsRUFDUjtBQUVELFFBQU0sVUFBVUYsV0FBUyxJQUFJLEtBQUssS0FBSyxVQUFVLEtBQUs7QUFFdEQsTUFBSSxTQUFTLE1BQU8sT0FBTyxTQUFTLFlBQVksQ0FBQyxTQUFVO0FBQ3pELFVBQU0sSUFBSSxVQUFVLDJDQUEyQztBQUFBLEVBQ2hFO0FBRUQsUUFBTSxPQUFPLFdBQVc7QUFDeEIsUUFBTSxRQUFRbEMsUUFBTSxVQUFVLE9BQU87QUFDckMsUUFBTSxRQUFRLFVBQ1ZtQyxZQUFVLFVBQVUsTUFBTSxPQUFPLElBQ2pDQSxZQUFVLE9BQU8sTUFBTSxTQUFTLE9BQU8sSUFBSTtBQUUvQyxRQUFNLFFBQVEsTUFBTTtBQUNwQixTQUFPLE1BQU07QUFFYixNQUFJLFlBQVksTUFBTTtBQUN0QixNQUFJLEtBQUssUUFBUTtBQUNmLFVBQU0sYUFBYSxFQUFFLEdBQUcsU0FBUyxRQUFRLE1BQU0sU0FBUyxNQUFNLFVBQVU7QUFDeEUsZ0JBQVlBLFlBQVUsS0FBSyxRQUFRLFlBQVksV0FBVztBQUFBLEVBQzNEO0FBRUQsUUFBTSxVQUFVLENBQUMsT0FBTyxlQUFlLFVBQVU7QUFDL0MsVUFBTSxFQUFFLFNBQVMsT0FBTyxRQUFBckMsUUFBTSxJQUFLcUMsWUFBVSxLQUFLLE9BQU8sT0FBTyxTQUFTLEVBQUUsTUFBTSxNQUFPLENBQUE7QUFDeEYsVUFBTSxTQUFTLEVBQUUsTUFBTSxPQUFPLE9BQU8sT0FBTyxPQUFPLFFBQUFyQyxTQUFRLE9BQU87QUFFbEUsUUFBSSxPQUFPLEtBQUssYUFBYSxZQUFZO0FBQ3ZDLFdBQUssU0FBUyxNQUFNO0FBQUEsSUFDckI7QUFFRCxRQUFJLFlBQVksT0FBTztBQUNyQixhQUFPLFVBQVU7QUFDakIsYUFBTyxlQUFlLFNBQVM7QUFBQSxJQUNoQztBQUVELFFBQUksVUFBVSxLQUFLLEdBQUc7QUFDcEIsVUFBSSxPQUFPLEtBQUssYUFBYSxZQUFZO0FBQ3ZDLGFBQUssU0FBUyxNQUFNO0FBQUEsTUFDckI7QUFDRCxhQUFPLFVBQVU7QUFDakIsYUFBTyxlQUFlLFNBQVM7QUFBQSxJQUNoQztBQUVELFFBQUksT0FBTyxLQUFLLFlBQVksWUFBWTtBQUN0QyxXQUFLLFFBQVEsTUFBTTtBQUFBLElBQ3BCO0FBQ0QsV0FBTyxlQUFlLFNBQVM7QUFBQSxFQUNuQztBQUVFLE1BQUksYUFBYTtBQUNmLFlBQVEsUUFBUTtBQUFBLEVBQ2pCO0FBRUQsU0FBTztBQUNUO0FBbUJBcUMsWUFBVSxPQUFPLENBQUMsT0FBTyxPQUFPLFNBQVMsRUFBRSxNQUFNLE1BQU8sSUFBRyxPQUFPO0FBQ2hFLE1BQUksT0FBTyxVQUFVLFVBQVU7QUFDN0IsVUFBTSxJQUFJLFVBQVUsK0JBQStCO0FBQUEsRUFDcEQ7QUFFRCxNQUFJLFVBQVUsSUFBSTtBQUNoQixXQUFPLEVBQUUsU0FBUyxPQUFPLFFBQVEsR0FBRTtBQUFBLEVBQ3BDO0FBRUQsUUFBTSxPQUFPLFdBQVc7QUFDeEIsUUFBTSxTQUFTLEtBQUssV0FBVyxRQUFRbkMsUUFBTSxpQkFBaUI7QUFDOUQsTUFBSSxRQUFRLFVBQVU7QUFDdEIsTUFBSUYsVUFBVSxTQUFTLFNBQVUsT0FBTyxLQUFLLElBQUk7QUFFakQsTUFBSSxVQUFVLE9BQU87QUFDbkIsSUFBQUEsVUFBUyxTQUFTLE9BQU8sS0FBSyxJQUFJO0FBQ2xDLFlBQVFBLFlBQVc7QUFBQSxFQUNwQjtBQUVELE1BQUksVUFBVSxTQUFTLEtBQUssWUFBWSxNQUFNO0FBQzVDLFFBQUksS0FBSyxjQUFjLFFBQVEsS0FBSyxhQUFhLE1BQU07QUFDckQsY0FBUXFDLFlBQVUsVUFBVSxPQUFPLE9BQU8sU0FBUyxLQUFLO0FBQUEsSUFDOUQsT0FBVztBQUNMLGNBQVEsTUFBTSxLQUFLckMsT0FBTTtBQUFBLElBQzFCO0FBQUEsRUFDRjtBQUVELFNBQU8sRUFBRSxTQUFTLFFBQVEsS0FBSyxHQUFHLE9BQU8sUUFBQUE7QUFDM0M7QUFnQkFxQyxZQUFVLFlBQVksQ0FBQyxPQUFPLE1BQU0sU0FBUyxRQUFRbkMsUUFBTSxVQUFVLE9BQU8sTUFBTTtBQUNoRixRQUFNLFFBQVEsZ0JBQWdCLFNBQVMsT0FBT21DLFlBQVUsT0FBTyxNQUFNLE9BQU87QUFDNUUsU0FBTyxNQUFNLEtBQUsvSCxPQUFLLFNBQVMsS0FBSyxDQUFDO0FBQ3hDO0FBbUJBK0gsWUFBVSxVQUFVLENBQUMsS0FBSyxVQUFVLFlBQVlBLFlBQVUsVUFBVSxPQUFPLEVBQUUsR0FBRztBQWdCaEZBLFlBQVUsUUFBUSxDQUFDLFNBQVMsWUFBWTtBQUN0QyxNQUFJLE1BQU0sUUFBUSxPQUFPO0FBQUcsV0FBTyxRQUFRLElBQUksT0FBS0EsWUFBVSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBQy9FLFNBQU9wQixRQUFNLFNBQVMsRUFBRSxHQUFHLFNBQVMsV0FBVyxNQUFLLENBQUU7QUFDeEQ7QUE2QkFvQixZQUFVLE9BQU8sQ0FBQyxPQUFPLFlBQVksS0FBSyxPQUFPLE9BQU87QUFjeERBLFlBQVUsWUFBWSxDQUFDLE9BQU8sU0FBUyxlQUFlLE9BQU8sY0FBYyxVQUFVO0FBQ25GLE1BQUksaUJBQWlCLE1BQU07QUFDekIsV0FBTyxNQUFNO0FBQUEsRUFDZDtBQUVELFFBQU0sT0FBTyxXQUFXO0FBQ3hCLFFBQU0sVUFBVSxLQUFLLFdBQVcsS0FBSztBQUNyQyxRQUFNcEMsVUFBUyxLQUFLLFdBQVcsS0FBSztBQUVwQyxNQUFJLFNBQVMsR0FBRyxhQUFhLE1BQU0sVUFBVUE7QUFDN0MsTUFBSSxTQUFTLE1BQU0sWUFBWSxNQUFNO0FBQ25DLGFBQVMsT0FBTztBQUFBLEVBQ2pCO0FBRUQsUUFBTSxRQUFRb0MsWUFBVSxRQUFRLFFBQVEsT0FBTztBQUMvQyxNQUFJLGdCQUFnQixNQUFNO0FBQ3hCLFVBQU0sUUFBUTtBQUFBLEVBQ2Y7QUFFRCxTQUFPO0FBQ1Q7QUFxQkFBLFlBQVUsU0FBUyxDQUFDLE9BQU8sVUFBVSxDQUFFLEdBQUUsZUFBZSxPQUFPLGNBQWMsVUFBVTtBQUNyRixNQUFJLENBQUMsU0FBUyxPQUFPLFVBQVUsVUFBVTtBQUN2QyxVQUFNLElBQUksVUFBVSw2QkFBNkI7QUFBQSxFQUNsRDtBQUVELE1BQUksU0FBUyxFQUFFLFNBQVMsT0FBTyxXQUFXLEtBQUk7QUFFOUMsTUFBSSxRQUFRLGNBQWMsVUFBVSxNQUFNLE9BQU8sT0FBTyxNQUFNLE9BQU8sTUFBTTtBQUN6RSxXQUFPLFNBQVNwQixRQUFNLFVBQVUsT0FBTyxPQUFPO0FBQUEsRUFDL0M7QUFFRCxNQUFJLENBQUMsT0FBTyxRQUFRO0FBQ2xCLGFBQVNBLFFBQU0sT0FBTyxPQUFPO0FBQUEsRUFDOUI7QUFFRCxTQUFPb0IsWUFBVSxVQUFVLFFBQVEsU0FBUyxjQUFjLFdBQVc7QUFDdkU7QUFtQkFBLFlBQVUsVUFBVSxDQUFDLFFBQVEsWUFBWTtBQUN2QyxNQUFJO0FBQ0YsVUFBTSxPQUFPLFdBQVc7QUFDeEIsV0FBTyxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsS0FBSyxTQUFTLE1BQU0sR0FBRztBQUFBLEVBQ2pFLFNBQVEsS0FBUDtBQUNBLFFBQUksV0FBVyxRQUFRLFVBQVU7QUFBTSxZQUFNO0FBQzdDLFdBQU87QUFBQSxFQUNSO0FBQ0g7QUFPQUEsWUFBVSxZQUFZcEk7QUFNdEIsSUFBQSxjQUFpQm9JO0FDblZqQixJQUFBQSxjQUFpQm5JO0FDQWpCLE1BQU1HLE9BQUtILHNCQUFBQTtBQUNYLE1BQU0sRUFBRSxTQUFVLElBQUdlO0FBQ3JCLE1BQU1zSCxZQUFVckgsb0JBQUFBO0FBQ2hCLE1BQU0sRUFBRXNILFdBQUFBLFlBQVcsSUFBR3JIO0FBQ3RCLE1BQU1rSCxjQUFZaEg7QUFFbEIsTUFBTWMsWUFBVXFHLFlBQVVuSSxLQUFHLE9BQU87QUFDcEMsTUFBTXVDLFNBQU80RixZQUFVbkksS0FBRyxJQUFJO0FBQzlCLE1BQU1vSSxVQUFRRCxZQUFVbkksS0FBRyxLQUFLO0FBQ2hDLE1BQU1xSSxhQUFXRixZQUFVbkksS0FBRyxRQUFRO0FBV3RDLE1BQU1zSSxTQUFPO0FBQ2IsTUFBTSxxQkFBcUIsb0JBQUksSUFBSSxDQUFDLFVBQVUsU0FBUyxVQUFVLE9BQU8sQ0FBQztBQUN6RSxNQUFNLFlBQVk7QUFDbEIsTUFBTSxXQUFXO0FBQ2pCLE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sa0JBQWtCO0FBQ3hCLE1BQU0sWUFBWSxDQUFDLFdBQVcsVUFBVSxlQUFlLGVBQWU7QUFFdEUsTUFBTSxvQkFBb0IsV0FBUyxtQkFBbUIsSUFBSSxNQUFNLElBQUk7QUFFcEUsTUFBTSxrQkFBa0IsWUFBVTtBQUNoQyxNQUFJLFdBQVc7QUFBVztBQUMxQixNQUFJLE9BQU8sV0FBVztBQUFZLFdBQU87QUFFekMsTUFBSSxPQUFPLFdBQVcsVUFBVTtBQUM5QixVQUFNLE9BQU9OLFlBQVUsT0FBTyxLQUFNLENBQUE7QUFDcEMsV0FBTyxXQUFTLEtBQUssTUFBTSxRQUFRO0FBQUEsRUFDcEM7QUFFRCxNQUFJLE1BQU0sUUFBUSxNQUFNLEdBQUc7QUFDekIsVUFBTSxXQUFXLENBQUE7QUFDakIsVUFBTSxXQUFXLENBQUE7QUFDakIsZUFBVyxRQUFRLFFBQVE7QUFDekIsWUFBTSxVQUFVLEtBQUs7QUFDckIsVUFBSSxRQUFRLE9BQU8sQ0FBQyxNQUFNTSxRQUFNO0FBQzlCLGlCQUFTLEtBQUtOLFlBQVUsUUFBUSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQUEsTUFDakQsT0FBYTtBQUNMLGlCQUFTLEtBQUtBLFlBQVUsT0FBTyxDQUFDO0FBQUEsTUFDakM7QUFBQSxJQUNGO0FBRUQsUUFBSSxTQUFTLFNBQVMsR0FBRztBQUN2QixVQUFJLFNBQVMsU0FBUyxHQUFHO0FBQ3ZCLGVBQU8sV0FDTCxTQUFTLEtBQUssT0FBSyxFQUFFLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssT0FBSyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQUEsTUFDakY7QUFDRCxhQUFPLFdBQVMsQ0FBQyxTQUFTLEtBQUssT0FBSyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQUEsSUFDdEQ7QUFDRCxXQUFPLFdBQVMsU0FBUyxLQUFLLE9BQUssRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUFBLEVBQ3JEO0FBQ0g7QUFFQSxNQUFNLHVCQUF1QixTQUFTO0FBQUEsRUFDcEMsV0FBVyxpQkFBaUI7QUFDMUIsV0FBTztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BRU4sWUFBWSxDQUFDL0gsVUFBUztBQUFBLE1BQ3RCLGlCQUFpQixDQUFDQSxVQUFTO0FBQUEsTUFFM0IsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLElBQ2xCO0FBQUEsRUFDRztBQUFBLEVBRUQsWUFBWSxVQUFVLElBQUk7QUFDeEIsVUFBTTtBQUFBLE1BQ0osWUFBWTtBQUFBLE1BQ1osYUFBYTtBQUFBLE1BQ2IsZUFBZSxRQUFRLGlCQUFpQjtBQUFBLElBQzlDLENBQUs7QUFDRCxVQUFNLE9BQU8sRUFBRSxHQUFHLGVBQWUsZ0JBQWdCLEdBQUcsUUFBTztBQUMzRCxVQUFNLEVBQUUsTUFBTSxLQUFNLElBQUc7QUFFdkIsU0FBSyxjQUFjLGdCQUFnQixLQUFLLFVBQVU7QUFDbEQsU0FBSyxtQkFBbUIsZ0JBQWdCLEtBQUssZUFBZTtBQUU1RCxVQUFNLGFBQWEsS0FBSyxRQUFRbUksVUFBUTdGO0FBRXhDLFFBQUksUUFBUSxhQUFhLFdBQVdBLE9BQUssV0FBVyxHQUFHO0FBQ3JELFdBQUssUUFBUSxDQUFBdEMsVUFBUSxXQUFXQSxPQUFNLEVBQUUsUUFBUSxLQUFJLENBQUU7QUFBQSxJQUM1RCxPQUFXO0FBQ0wsV0FBSyxRQUFRO0FBQUEsSUFDZDtBQUVELFNBQUssWUFBWSxLQUFLO0FBQ3RCLFNBQUssWUFBWSxDQUFDLFVBQVUsZUFBZSxlQUFlLEVBQUUsU0FBUyxJQUFJO0FBQ3pFLFNBQUssYUFBYSxDQUFDLFdBQVcsZUFBZSxlQUFlLEVBQUUsU0FBUyxJQUFJO0FBQzNFLFNBQUssbUJBQW1CLFNBQVM7QUFDakMsU0FBSyxRQUFRaUksVUFBUSxRQUFRLElBQUk7QUFDakMsU0FBSyxZQUFhLFlBQVlsSSxRQUFPLENBQUMsS0FBSztBQUMzQyxTQUFLLGFBQWEsS0FBSyxZQUFZLFdBQVc7QUFDOUMsU0FBSyxhQUFhLEVBQUUsVUFBVSxRQUFRLGVBQWUsS0FBSztBQUcxRCxTQUFLLFVBQVUsQ0FBQyxLQUFLLFlBQVksTUFBTSxDQUFDLENBQUM7QUFDekMsU0FBSyxVQUFVO0FBQ2YsU0FBSyxTQUFTO0FBQUEsRUFDZjtBQUFBLEVBRUQsTUFBTSxNQUFNLE9BQU87QUFDakIsUUFBSSxLQUFLO0FBQVM7QUFDbEIsU0FBSyxVQUFVO0FBRWYsUUFBSTtBQUNGLGFBQU8sQ0FBQyxLQUFLLGFBQWEsUUFBUSxHQUFHO0FBQ25DLGNBQU0sRUFBRSxNQUFBQyxPQUFNLE9BQUFzSSxRQUFPLFFBQVEsQ0FBRSxFQUFBLElBQUssS0FBSyxVQUFVO0FBRW5ELFlBQUksTUFBTSxTQUFTLEdBQUc7QUFDcEIsZ0JBQU0sUUFBUSxNQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsSUFBSSxZQUFVLEtBQUssYUFBYSxRQUFRdEksS0FBSSxDQUFDO0FBQ2xGLHFCQUFXLFNBQVMsTUFBTSxRQUFRLElBQUksS0FBSyxHQUFHO0FBQzVDLGdCQUFJLEtBQUs7QUFBVztBQUVwQixrQkFBTSxZQUFZLE1BQU0sS0FBSyxjQUFjLEtBQUs7QUFDaEQsZ0JBQUksY0FBYyxlQUFlLEtBQUssaUJBQWlCLEtBQUssR0FBRztBQUM3RCxrQkFBSXNJLFVBQVMsS0FBSyxXQUFXO0FBQzNCLHFCQUFLLFFBQVEsS0FBSyxLQUFLLFlBQVksTUFBTSxVQUFVQSxTQUFRLENBQUMsQ0FBQztBQUFBLGNBQzlEO0FBRUQsa0JBQUksS0FBSyxXQUFXO0FBQ2xCLHFCQUFLLEtBQUssS0FBSztBQUNmO0FBQUEsY0FDRDtBQUFBLFlBQ0YsWUFBVyxjQUFjLFVBQVUsS0FBSyxlQUFlLEtBQUssTUFBTSxLQUFLLFlBQVksS0FBSyxHQUFHO0FBQzFGLGtCQUFJLEtBQUssWUFBWTtBQUNuQixxQkFBSyxLQUFLLEtBQUs7QUFDZjtBQUFBLGNBQ0Q7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ1gsT0FBZTtBQUNMLGdCQUFNLFNBQVMsS0FBSyxRQUFRLElBQUc7QUFDL0IsY0FBSSxDQUFDLFFBQVE7QUFDWCxpQkFBSyxLQUFLLElBQUk7QUFDZDtBQUFBLFVBQ0Q7QUFDRCxlQUFLLFNBQVMsTUFBTTtBQUNwQixjQUFJLEtBQUs7QUFBVztBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0YsU0FBUSxPQUFQO0FBQ0EsV0FBSyxRQUFRLEtBQUs7QUFBQSxJQUN4QixVQUFjO0FBQ1IsV0FBSyxVQUFVO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQUEsRUFFRCxNQUFNLFlBQVl0SSxPQUFNc0ksUUFBTztBQUM3QixRQUFJO0FBQ0osUUFBSTtBQUNGLGNBQVEsTUFBTXpHLFVBQVE3QixPQUFNLEtBQUssVUFBVTtBQUFBLElBQzVDLFNBQVEsT0FBUDtBQUNBLFdBQUssU0FBUyxLQUFLO0FBQUEsSUFDcEI7QUFDRCxXQUFPLEVBQUMsT0FBTyxPQUFBc0ksUUFBTyxNQUFBdEksTUFBSTtBQUFBLEVBQzNCO0FBQUEsRUFFRCxNQUFNLGFBQWEsUUFBUUEsT0FBTTtBQUMvQixRQUFJO0FBQ0osUUFBSTtBQUNGLFlBQU0sV0FBVyxLQUFLLFlBQVksT0FBTyxPQUFPO0FBQ2hELFlBQU0sV0FBV2lJLFVBQVEsUUFBUUEsVUFBUSxLQUFLakksT0FBTSxRQUFRLENBQUM7QUFDN0QsY0FBUSxFQUFDLE1BQU1pSSxVQUFRLFNBQVMsS0FBSyxPQUFPLFFBQVEsR0FBRyxVQUFVLFNBQVE7QUFDekUsWUFBTSxLQUFLLGNBQWMsS0FBSyxZQUFZLFNBQVMsTUFBTSxLQUFLLE1BQU0sUUFBUTtBQUFBLElBQzdFLFNBQVEsS0FBUDtBQUNBLFdBQUssU0FBUyxHQUFHO0FBQUEsSUFDbEI7QUFDRCxXQUFPO0FBQUEsRUFDUjtBQUFBLEVBRUQsU0FBUyxLQUFLO0FBQ1osUUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsS0FBSyxXQUFXO0FBQzdDLFdBQUssS0FBSyxRQUFRLEdBQUc7QUFBQSxJQUMzQixPQUFXO0FBQ0wsV0FBSyxRQUFRLEdBQUc7QUFBQSxJQUNqQjtBQUFBLEVBQ0Y7QUFBQSxFQUVELE1BQU0sY0FBYyxPQUFPO0FBR3pCLFVBQU0sUUFBUSxTQUFTLE1BQU0sS0FBSztBQUNsQyxRQUFJLENBQUMsT0FBTztBQUNWO0FBQUEsSUFDRDtBQUNELFFBQUksTUFBTSxVQUFVO0FBQ2xCLGFBQU87QUFBQSxJQUNSO0FBQ0QsUUFBSSxNQUFNLGVBQWU7QUFDdkIsYUFBTztBQUFBLElBQ1I7QUFDRCxRQUFJLFNBQVMsTUFBTSxrQkFBa0I7QUFDbkMsWUFBTSxPQUFPLE1BQU07QUFDbkIsVUFBSTtBQUNGLGNBQU0sZ0JBQWdCLE1BQU1HLFdBQVMsSUFBSTtBQUN6QyxjQUFNLHFCQUFxQixNQUFNRCxRQUFNLGFBQWE7QUFDcEQsWUFBSSxtQkFBbUIsVUFBVTtBQUMvQixpQkFBTztBQUFBLFFBQ1I7QUFDRCxZQUFJLG1CQUFtQixlQUFlO0FBQ3BDLGdCQUFNLE1BQU0sY0FBYztBQUMxQixjQUFJLEtBQUssV0FBVyxhQUFhLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxNQUFNRixVQUFRLEtBQUs7QUFDekUsbUJBQU8sS0FBSyxTQUFTLElBQUk7QUFBQSxjQUN2QiwrQkFBK0Isb0JBQW9CO0FBQUEsWUFDakUsQ0FBYTtBQUFBLFVBQ0Y7QUFDRCxpQkFBTztBQUFBLFFBQ1I7QUFBQSxNQUNGLFNBQVEsT0FBUDtBQUNBLGFBQUssU0FBUyxLQUFLO0FBQUEsTUFDcEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUQsZUFBZSxPQUFPO0FBQ3BCLFVBQU0sUUFBUSxTQUFTLE1BQU0sS0FBSztBQUVsQyxXQUFPLFNBQVMsS0FBSyxvQkFBb0IsQ0FBQyxNQUFNLFlBQVc7QUFBQSxFQUM1RDtBQUNIO0FBa0JBLE1BQU1NLGFBQVcsQ0FBQyxNQUFNLFVBQVUsT0FBTztBQUN2QyxNQUFJLE9BQU8sUUFBUSxhQUFhLFFBQVE7QUFDeEMsTUFBSSxTQUFTO0FBQVEsV0FBTztBQUM1QixNQUFJO0FBQU0sWUFBUSxPQUFPO0FBQ3pCLE1BQUksQ0FBQyxNQUFNO0FBQ1QsVUFBTSxJQUFJLE1BQU0scUVBQXFFO0FBQUEsRUFDekYsV0FBYSxPQUFPLFNBQVMsVUFBVTtBQUNuQyxVQUFNLElBQUksVUFBVSwwRUFBMEU7QUFBQSxFQUMvRixXQUFVLFFBQVEsQ0FBQyxVQUFVLFNBQVMsSUFBSSxHQUFHO0FBQzVDLFVBQU0sSUFBSSxNQUFNLDZDQUE2QyxVQUFVLEtBQUssSUFBSSxHQUFHO0FBQUEsRUFDcEY7QUFFRCxVQUFRLE9BQU87QUFDZixTQUFPLElBQUksZUFBZSxPQUFPO0FBQ25DO0FBRUEsTUFBTSxrQkFBa0IsQ0FBQyxNQUFNLFVBQVUsT0FBTztBQUM5QyxTQUFPLElBQUksUUFBUSxDQUFDLFNBQVMsV0FBVztBQUN0QyxVQUFNLFFBQVEsQ0FBQTtBQUNkQSxlQUFTLE1BQU0sT0FBTyxFQUNuQixHQUFHLFFBQVEsV0FBUyxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQ3JDLEdBQUcsT0FBTyxNQUFNLFFBQVEsS0FBSyxDQUFDLEVBQzlCLEdBQUcsU0FBUyxXQUFTLE9BQU8sS0FBSyxDQUFDO0FBQUEsRUFDekMsQ0FBRztBQUNIO0FBRUFBLFdBQVMsVUFBVTtBQUNuQkEsV0FBUyxpQkFBaUI7QUFDMUJBLFdBQVMsVUFBVUE7QUFFbkIsSUFBQSxhQUFpQkE7Ozs7Ozs7O0FDbFJqQixJQUFBQyxrQkFBaUIsU0FBU3hJLE9BQU0sZUFBZTtBQUM3QyxNQUFJLE9BQU9BLFVBQVMsVUFBVTtBQUM1QixVQUFNLElBQUksVUFBVSw4QkFBOEI7QUFBQSxFQUNuRDtBQUVELE1BQUlBLFVBQVMsUUFBUUEsVUFBUztBQUFLLFdBQU87QUFFMUMsTUFBSSxNQUFNQSxNQUFLO0FBQ2YsTUFBSSxPQUFPO0FBQUcsV0FBT0E7QUFLckIsTUFBSSxTQUFTO0FBQ2IsTUFBSSxNQUFNLEtBQUtBLE1BQUssT0FBTyxNQUFNO0FBQy9CLFFBQUksS0FBS0EsTUFBSztBQUNkLFNBQUssT0FBTyxPQUFPLE9BQU8sUUFBUUEsTUFBSyxNQUFNLEdBQUcsQ0FBQyxNQUFNLFFBQVE7QUFDN0QsTUFBQUEsUUFBT0EsTUFBSyxNQUFNLENBQUM7QUFDbkIsZUFBUztBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBRUQsTUFBSSxPQUFPQSxNQUFLLE1BQU0sUUFBUTtBQUM5QixNQUFJLGtCQUFrQixTQUFTLEtBQUssS0FBSyxTQUFTLE9BQU8sSUFBSTtBQUMzRCxTQUFLLElBQUc7QUFBQSxFQUNUO0FBQ0QsU0FBTyxTQUFTLEtBQUssS0FBSyxHQUFHO0FBQy9CO0FDaENBLE9BQU8sZUFBZXlJLFdBQUFBLFNBQVMsY0FBYyxFQUFFLE9BQU8sS0FBSSxDQUFFO0FBRTVELE1BQU0sWUFBWTdJO0FBQ2xCLE1BQU00SSxrQkFBZ0I3SDtBQU90QixNQUFNMEgsU0FBTztBQUNiLE1BQU0sa0JBQWtCLEVBQUMsYUFBYSxNQUFLO0FBQzNDLE1BQU1LLFdBQVMsQ0FBQyxTQUFTLE1BQU0sUUFBUSxJQUFJLElBQUksT0FBTyxDQUFDLElBQUk7QUFPM0QsTUFBTSxnQkFBZ0IsQ0FBQyxTQUFTLFlBQVk7QUFDMUMsTUFBSSxPQUFPLFlBQVksWUFBWTtBQUNqQyxXQUFPO0FBQUEsRUFDUjtBQUNELE1BQUksT0FBTyxZQUFZLFVBQVU7QUFDL0IsVUFBTSxPQUFPLFVBQVUsU0FBUyxPQUFPO0FBQ3ZDLFdBQU8sQ0FBQyxXQUFXLFlBQVksVUFBVSxLQUFLLE1BQU07QUFBQSxFQUNyRDtBQUNELE1BQUksbUJBQW1CLFFBQVE7QUFDN0IsV0FBTyxDQUFDLFdBQVcsUUFBUSxLQUFLLE1BQU07QUFBQSxFQUN2QztBQUNELFNBQU8sQ0FBQyxXQUFXO0FBQ3JCO0FBU0EsTUFBTSxnQkFBZ0IsQ0FBQyxVQUFVLGFBQWEsTUFBTSxnQkFBZ0I7QUFDbEUsUUFBTSxTQUFTLE1BQU0sUUFBUSxJQUFJO0FBQ2pDLFFBQU0sUUFBUSxTQUFTLEtBQUssS0FBSztBQUNqQyxNQUFJLENBQUMsVUFBVSxPQUFPLFVBQVUsVUFBVTtBQUN4QyxVQUFNLElBQUksVUFBVSxxREFDbEIsT0FBTyxVQUFVLFNBQVMsS0FBSyxLQUFLLENBQUM7QUFBQSxFQUN4QztBQUNELFFBQU0xSSxRQUFPd0ksZ0JBQWMsS0FBSztBQUVoQyxXQUFTLFFBQVEsR0FBRyxRQUFRLFlBQVksUUFBUSxTQUFTO0FBQ3ZELFVBQU0sUUFBUSxZQUFZO0FBQzFCLFFBQUksTUFBTXhJLEtBQUksR0FBRztBQUNmLGFBQU8sY0FBYyxLQUFLO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBRUQsUUFBTSxVQUFVLFVBQVUsQ0FBQ0EsS0FBSSxFQUFFLE9BQU8sS0FBSyxNQUFNLENBQUMsQ0FBQztBQUNyRCxXQUFTLFFBQVEsR0FBRyxRQUFRLFNBQVMsUUFBUSxTQUFTO0FBQ3BELFVBQU0sVUFBVSxTQUFTO0FBQ3pCLFFBQUksU0FBUyxRQUFRLEdBQUcsT0FBTyxJQUFJLFFBQVFBLEtBQUksR0FBRztBQUNoRCxhQUFPLGNBQWMsUUFBUTtBQUFBLElBQzlCO0FBQUEsRUFDRjtBQUVELFNBQU8sY0FBYyxLQUFLO0FBQzVCO0FBUUEsTUFBTTJJLGFBQVcsQ0FBQyxVQUFVLFlBQVksVUFBVSxvQkFBb0I7QUFDcEUsTUFBSSxZQUFZLE1BQU07QUFDcEIsVUFBTSxJQUFJLFVBQVUsa0NBQWtDO0FBQUEsRUFDdkQ7QUFDRCxRQUFNLE9BQU8sT0FBTyxZQUFZLFlBQVksRUFBQyxhQUFhLFFBQU8sSUFBSTtBQUNyRSxRQUFNLGNBQWMsS0FBSyxlQUFlO0FBR3hDLFFBQU0sVUFBVUQsU0FBTyxRQUFRO0FBQy9CLFFBQU0sZUFBZSxRQUNsQixPQUFPLFVBQVEsT0FBTyxTQUFTLFlBQVksS0FBSyxPQUFPLENBQUMsTUFBTUwsTUFBSSxFQUNsRSxJQUFJLFVBQVEsS0FBSyxNQUFNLENBQUMsQ0FBQyxFQUN6QixJQUFJLFVBQVEsVUFBVSxNQUFNLElBQUksQ0FBQztBQUNwQyxRQUFNLFdBQVcsUUFDZCxPQUFPLFVBQVEsT0FBTyxTQUFTLFlBQWEsT0FBTyxTQUFTLFlBQVksS0FBSyxPQUFPLENBQUMsTUFBTUEsTUFBSyxFQUNoRyxJQUFJLGFBQVcsY0FBYyxTQUFTLElBQUksQ0FBQztBQUU5QyxNQUFJLGNBQWMsTUFBTTtBQUN0QixXQUFPLENBQUNPLGFBQVksS0FBSyxVQUFVO0FBQ2pDLFlBQU1DLGVBQWMsT0FBTyxPQUFPLFlBQVksS0FBSztBQUNuRCxhQUFPLGNBQWMsVUFBVSxjQUFjRCxhQUFZQyxZQUFXO0FBQUEsSUFDckU7QUFBQSxFQUNGO0FBRUQsU0FBTyxjQUFjLFVBQVUsY0FBYyxZQUFZLFdBQVc7QUFDdEU7QUFFQUYsV0FBUyxVQUFVQTtBQUNuQkcsV0FBQSxVQUFpQkg7Ozs7Ozs7QUNoR2pCLElBQUFuQyxjQUFpQixTQUFTQSxXQUFVLEtBQUs7QUFDdkMsTUFBSSxPQUFPLFFBQVEsWUFBWSxRQUFRLElBQUk7QUFDekMsV0FBTztBQUFBLEVBQ1I7QUFFRCxNQUFJO0FBQ0osU0FBUSxRQUFRLHlCQUF5QixLQUFLLEdBQUcsR0FBSTtBQUNuRCxRQUFJLE1BQU07QUFBSSxhQUFPO0FBQ3JCLFVBQU0sSUFBSSxNQUFNLE1BQU0sUUFBUSxNQUFNLEdBQUcsTUFBTTtBQUFBLEVBQzlDO0FBRUQsU0FBTztBQUNUOzs7Ozs7O0FDWkEsSUFBSSxZQUFZNUc7QUFDaEIsSUFBSSxRQUFRLEVBQUUsS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLElBQUc7QUFDMUMsSUFBSSxjQUFjLFNBQVMsS0FBSztBQUM5QixNQUFJLElBQUksT0FBTyxLQUFLO0FBQ2xCLFdBQU87QUFBQSxFQUNSO0FBQ0QsTUFBSSxRQUFRO0FBQ1osTUFBSSxZQUFZO0FBQ2hCLE1BQUksbUJBQW1CO0FBQ3ZCLE1BQUksa0JBQWtCO0FBQ3RCLE1BQUksa0JBQWtCO0FBQ3RCLE1BQUksaUJBQWlCO0FBQ3JCLFNBQU8sUUFBUSxJQUFJLFFBQVE7QUFDekIsUUFBSSxJQUFJLFdBQVcsS0FBSztBQUN0QixhQUFPO0FBQUEsSUFDUjtBQUVELFFBQUksSUFBSSxRQUFRLE9BQU8sT0FBTyxVQUFVLEtBQUssSUFBSSxNQUFNLEdBQUc7QUFDeEQsYUFBTztBQUFBLElBQ1I7QUFFRCxRQUFJLHFCQUFxQixNQUFNLElBQUksV0FBVyxPQUFPLElBQUksUUFBUSxPQUFPLEtBQUs7QUFDM0UsVUFBSSxtQkFBbUIsT0FBTztBQUM1QiwyQkFBbUIsSUFBSSxRQUFRLEtBQUssS0FBSztBQUFBLE1BQzFDO0FBQ0QsVUFBSSxtQkFBbUIsT0FBTztBQUM1QixZQUFJLG1CQUFtQixNQUFNLGlCQUFpQixrQkFBa0I7QUFDOUQsaUJBQU87QUFBQSxRQUNSO0FBQ0QseUJBQWlCLElBQUksUUFBUSxNQUFNLEtBQUs7QUFDeEMsWUFBSSxtQkFBbUIsTUFBTSxpQkFBaUIsa0JBQWtCO0FBQzlELGlCQUFPO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUQsUUFBSSxvQkFBb0IsTUFBTSxJQUFJLFdBQVcsT0FBTyxJQUFJLFFBQVEsT0FBTyxLQUFLO0FBQzFFLHdCQUFrQixJQUFJLFFBQVEsS0FBSyxLQUFLO0FBQ3hDLFVBQUksa0JBQWtCLE9BQU87QUFDM0IseUJBQWlCLElBQUksUUFBUSxNQUFNLEtBQUs7QUFDeEMsWUFBSSxtQkFBbUIsTUFBTSxpQkFBaUIsaUJBQWlCO0FBQzdELGlCQUFPO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUQsUUFBSSxvQkFBb0IsTUFBTSxJQUFJLFdBQVcsT0FBTyxJQUFJLFFBQVEsT0FBTyxPQUFPLFFBQVEsS0FBSyxJQUFJLFFBQVEsRUFBRSxLQUFLLElBQUksUUFBUSxPQUFPLEtBQUs7QUFDcEksd0JBQWtCLElBQUksUUFBUSxLQUFLLEtBQUs7QUFDeEMsVUFBSSxrQkFBa0IsT0FBTztBQUMzQix5QkFBaUIsSUFBSSxRQUFRLE1BQU0sS0FBSztBQUN4QyxZQUFJLG1CQUFtQixNQUFNLGlCQUFpQixpQkFBaUI7QUFDN0QsaUJBQU87QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFRCxRQUFJLGNBQWMsTUFBTSxJQUFJLFdBQVcsT0FBTyxJQUFJLFFBQVEsT0FBTyxLQUFLO0FBQ3BFLFVBQUksWUFBWSxPQUFPO0FBQ3JCLG9CQUFZLElBQUksUUFBUSxLQUFLLEtBQUs7QUFBQSxNQUNuQztBQUNELFVBQUksY0FBYyxNQUFNLElBQUksWUFBWSxPQUFPLEtBQUs7QUFDbEQsMEJBQWtCLElBQUksUUFBUSxLQUFLLFNBQVM7QUFDNUMsWUFBSSxrQkFBa0IsV0FBVztBQUMvQiwyQkFBaUIsSUFBSSxRQUFRLE1BQU0sU0FBUztBQUM1QyxjQUFJLG1CQUFtQixNQUFNLGlCQUFpQixpQkFBaUI7QUFDN0QsbUJBQU87QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUQsUUFBSSxJQUFJLFdBQVcsTUFBTTtBQUN2QixVQUFJbUMsUUFBTyxJQUFJLFFBQVE7QUFDdkIsZUFBUztBQUNULFVBQUliLFNBQVEsTUFBTWE7QUFFbEIsVUFBSWIsUUFBTztBQUNULFlBQUksSUFBSSxJQUFJLFFBQVFBLFFBQU8sS0FBSztBQUNoQyxZQUFJLE1BQU0sSUFBSTtBQUNaLGtCQUFRLElBQUk7QUFBQSxRQUNiO0FBQUEsTUFDRjtBQUVELFVBQUksSUFBSSxXQUFXLEtBQUs7QUFDdEIsZUFBTztBQUFBLE1BQ1I7QUFBQSxJQUNQLE9BQVc7QUFDTDtBQUFBLElBQ0Q7QUFBQSxFQUNGO0FBQ0QsU0FBTztBQUNUO0FBRUEsSUFBSSxlQUFlLFNBQVMsS0FBSztBQUMvQixNQUFJLElBQUksT0FBTyxLQUFLO0FBQ2xCLFdBQU87QUFBQSxFQUNSO0FBQ0QsTUFBSSxRQUFRO0FBQ1osU0FBTyxRQUFRLElBQUksUUFBUTtBQUN6QixRQUFJLGNBQWMsS0FBSyxJQUFJLE1BQU0sR0FBRztBQUNsQyxhQUFPO0FBQUEsSUFDUjtBQUVELFFBQUksSUFBSSxXQUFXLE1BQU07QUFDdkIsVUFBSWEsUUFBTyxJQUFJLFFBQVE7QUFDdkIsZUFBUztBQUNULFVBQUliLFNBQVEsTUFBTWE7QUFFbEIsVUFBSWIsUUFBTztBQUNULFlBQUksSUFBSSxJQUFJLFFBQVFBLFFBQU8sS0FBSztBQUNoQyxZQUFJLE1BQU0sSUFBSTtBQUNaLGtCQUFRLElBQUk7QUFBQSxRQUNiO0FBQUEsTUFDRjtBQUVELFVBQUksSUFBSSxXQUFXLEtBQUs7QUFDdEIsZUFBTztBQUFBLE1BQ1I7QUFBQSxJQUNQLE9BQVc7QUFDTDtBQUFBLElBQ0Q7QUFBQSxFQUNGO0FBQ0QsU0FBTztBQUNUO0FBRUEsSUFBQXFGLFdBQWlCLFNBQVNBLFFBQU8sS0FBSyxTQUFTO0FBQzdDLE1BQUksT0FBTyxRQUFRLFlBQVksUUFBUSxJQUFJO0FBQ3pDLFdBQU87QUFBQSxFQUNSO0FBRUQsTUFBSSxVQUFVLEdBQUcsR0FBRztBQUNsQixXQUFPO0FBQUEsRUFDUjtBQUVELE1BQUksUUFBUTtBQUdaLE1BQUksV0FBVyxRQUFRLFdBQVcsT0FBTztBQUN2QyxZQUFRO0FBQUEsRUFDVDtBQUVELFNBQU8sTUFBTSxHQUFHO0FBQ2xCO0FDbkpBLElBQUlBLFdBQVMzRztBQUNiLElBQUksbUJBQW1CZSxvQkFBQUEsV0FBZ0IsTUFBTTtBQUM3QyxJQUFJLFVBQVVDLHNCQUFhLFdBQUMsU0FBVSxNQUFLO0FBRTNDLElBQUksUUFBUTtBQUNaLElBQUksWUFBWTtBQUNoQixJQUFJLFlBQVk7QUFDaEIsSUFBSSxTQUFTO0FBQ2IsSUFBSSxVQUFVO0FBUWQsSUFBQW1JLGVBQWlCLFNBQVNBLFlBQVcsS0FBSyxNQUFNO0FBQzlDLE1BQUksVUFBVSxPQUFPLE9BQU8sRUFBRSxpQkFBaUIsS0FBSSxHQUFJLElBQUk7QUFHM0QsTUFBSSxRQUFRLG1CQUFtQixXQUFXLElBQUksUUFBUSxLQUFLLElBQUksR0FBRztBQUNoRSxVQUFNLElBQUksUUFBUSxXQUFXLEtBQUs7QUFBQSxFQUNuQztBQUdELE1BQUksVUFBVSxLQUFLLEdBQUcsR0FBRztBQUN2QixXQUFPO0FBQUEsRUFDUjtBQUdELFNBQU87QUFHUCxLQUFHO0FBQ0QsVUFBTSxpQkFBaUIsR0FBRztBQUFBLEVBQzlCLFNBQVd4QyxTQUFPLEdBQUcsS0FBSyxPQUFPLEtBQUssR0FBRztBQUd2QyxTQUFPLElBQUksUUFBUSxTQUFTLElBQUk7QUFDbEM7OztBQ3ZDQSxVQUFBLFlBQW9CLFNBQU87QUFDekIsUUFBSSxPQUFPLFFBQVEsVUFBVTtBQUMzQixhQUFPLE9BQU8sVUFBVSxHQUFHO0FBQUEsSUFDNUI7QUFDRCxRQUFJLE9BQU8sUUFBUSxZQUFZLElBQUksS0FBSSxNQUFPLElBQUk7QUFDaEQsYUFBTyxPQUFPLFVBQVUsT0FBTyxHQUFHLENBQUM7QUFBQSxJQUNwQztBQUNELFdBQU87QUFBQSxFQUNUO0FBTUEsVUFBQSxPQUFlLENBQUMsTUFBTSxTQUFTLEtBQUssTUFBTSxLQUFLLENBQUF5QyxVQUFRQSxNQUFLLFNBQVMsSUFBSTtBQU16RSxVQUF1QixlQUFBLENBQUMsS0FBSyxLQUFLLE9BQU8sR0FBRyxVQUFVO0FBQ3BELFFBQUksVUFBVTtBQUFPLGFBQU87QUFDNUIsUUFBSSxDQUFDLFFBQVEsVUFBVSxHQUFHLEtBQUssQ0FBQyxRQUFRLFVBQVUsR0FBRztBQUFHLGFBQU87QUFDL0QsWUFBUyxPQUFPLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxPQUFPLElBQUksS0FBTTtBQUFBLEVBQ3pEO0FBTUEsVUFBcUIsYUFBQSxDQUFDLE9BQU8sSUFBSSxHQUFHLFNBQVM7QUFDM0MsUUFBSSxPQUFPLE1BQU0sTUFBTTtBQUN2QixRQUFJLENBQUM7QUFBTTtBQUVYLFFBQUssUUFBUSxLQUFLLFNBQVMsUUFBUyxLQUFLLFNBQVMsVUFBVSxLQUFLLFNBQVMsU0FBUztBQUNqRixVQUFJLEtBQUssWUFBWSxNQUFNO0FBQ3pCLGFBQUssUUFBUSxPQUFPLEtBQUs7QUFDekIsYUFBSyxVQUFVO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDSDtBQU1BLFVBQUEsZUFBdUIsVUFBUTtBQUM3QixRQUFJLEtBQUssU0FBUztBQUFTLGFBQU87QUFDbEMsUUFBSyxLQUFLLFVBQVUsSUFBSSxLQUFLLFVBQVUsTUFBTyxHQUFHO0FBQy9DLFdBQUssVUFBVTtBQUNmLGFBQU87QUFBQSxJQUNSO0FBQ0QsV0FBTztBQUFBLEVBQ1Q7QUFNQSxVQUFBLGlCQUF5QixXQUFTO0FBQ2hDLFFBQUksTUFBTSxTQUFTO0FBQVMsYUFBTztBQUNuQyxRQUFJLE1BQU0sWUFBWSxRQUFRLE1BQU07QUFBUSxhQUFPO0FBQ25ELFFBQUssTUFBTSxVQUFVLElBQUksTUFBTSxVQUFVLE1BQU8sR0FBRztBQUNqRCxZQUFNLFVBQVU7QUFDaEIsYUFBTztBQUFBLElBQ1I7QUFDRCxRQUFJLE1BQU0sU0FBUyxRQUFRLE1BQU0sVUFBVSxNQUFNO0FBQy9DLFlBQU0sVUFBVTtBQUNoQixhQUFPO0FBQUEsSUFDUjtBQUNELFdBQU87QUFBQSxFQUNUO0FBTUEsVUFBQSxnQkFBd0IsVUFBUTtBQUM5QixRQUFJLEtBQUssU0FBUyxVQUFVLEtBQUssU0FBUyxTQUFTO0FBQ2pELGFBQU87QUFBQSxJQUNSO0FBQ0QsV0FBTyxLQUFLLFNBQVMsUUFBUSxLQUFLLFVBQVU7QUFBQSxFQUM5QztBQU1BLFVBQWlCLFNBQUEsV0FBUyxNQUFNLE9BQU8sQ0FBQyxLQUFLLFNBQVM7QUFDcEQsUUFBSSxLQUFLLFNBQVM7QUFBUSxVQUFJLEtBQUssS0FBSyxLQUFLO0FBQzdDLFFBQUksS0FBSyxTQUFTO0FBQVMsV0FBSyxPQUFPO0FBQ3ZDLFdBQU87QUFBQSxFQUNULEdBQUcsQ0FBRSxDQUFBO0FBTUwsVUFBa0IsVUFBQSxJQUFJLFNBQVM7QUFDN0IsVUFBTSxTQUFTLENBQUE7QUFDZixVQUFNLE9BQU8sU0FBTztBQUNsQixlQUFTLElBQUksR0FBRyxJQUFJLElBQUksUUFBUSxLQUFLO0FBQ25DLFlBQUksTUFBTSxJQUFJO0FBQ2QsY0FBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLEdBQVcsSUFBSSxRQUFRLFVBQVUsT0FBTyxLQUFLLEdBQUc7QUFBQSxNQUMzRTtBQUNELGFBQU87QUFBQSxJQUNYO0FBQ0UsU0FBSyxJQUFJO0FBQ1QsV0FBTztBQUFBLEVBQ1Q7O0FDN0dBLE1BQU1wRCxVQUFRaEc7QUFFZCxJQUFBNkUsY0FBaUIsQ0FBQyxLQUFLLFVBQVUsT0FBTztBQUN0QyxNQUFJQSxhQUFZLENBQUMsTUFBTSxTQUFTLENBQUEsTUFBTztBQUNyQyxRQUFJLGVBQWUsUUFBUSxpQkFBaUJtQixRQUFNLGVBQWUsTUFBTTtBQUN2RSxRQUFJLGNBQWMsS0FBSyxZQUFZLFFBQVEsUUFBUSxrQkFBa0I7QUFDckUsUUFBSUYsVUFBUztBQUViLFFBQUksS0FBSyxPQUFPO0FBQ2QsV0FBSyxnQkFBZ0IsZ0JBQWdCRSxRQUFNLGNBQWMsSUFBSSxHQUFHO0FBQzlELGVBQU8sT0FBTyxLQUFLO0FBQUEsTUFDcEI7QUFDRCxhQUFPLEtBQUs7QUFBQSxJQUNiO0FBRUQsUUFBSSxLQUFLLE9BQU87QUFDZCxhQUFPLEtBQUs7QUFBQSxJQUNiO0FBRUQsUUFBSSxLQUFLLE9BQU87QUFDZCxlQUFTLFNBQVMsS0FBSyxPQUFPO0FBQzVCLFFBQUFGLFdBQVVqQixXQUFVLEtBQUs7QUFBQSxNQUMxQjtBQUFBLElBQ0Y7QUFDRCxXQUFPaUI7QUFBQSxFQUNYO0FBRUUsU0FBT2pCLFdBQVUsR0FBRztBQUN0Qjs7Ozs7OztJQ3JCQXdFLGFBQWlCLFNBQVMsS0FBSztBQUM3QixNQUFJLE9BQU8sUUFBUSxVQUFVO0FBQzNCLFdBQU8sTUFBTSxRQUFRO0FBQUEsRUFDdEI7QUFDRCxNQUFJLE9BQU8sUUFBUSxZQUFZLElBQUksS0FBSSxNQUFPLElBQUk7QUFDaEQsV0FBTyxPQUFPLFdBQVcsT0FBTyxTQUFTLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHO0FBQUEsRUFDL0Q7QUFDRCxTQUFPO0FBQ1Q7Ozs7Ozs7QUNSQSxNQUFNQSxhQUFXcko7QUFFakIsTUFBTXNKLGlCQUFlLENBQUMsS0FBSyxLQUFLLFlBQVk7QUFDMUMsTUFBSUQsV0FBUyxHQUFHLE1BQU0sT0FBTztBQUMzQixVQUFNLElBQUksVUFBVSwwREFBMEQ7QUFBQSxFQUMvRTtBQUVELE1BQUksUUFBUSxVQUFVLFFBQVEsS0FBSztBQUNqQyxXQUFPLE9BQU8sR0FBRztBQUFBLEVBQ2xCO0FBRUQsTUFBSUEsV0FBUyxHQUFHLE1BQU0sT0FBTztBQUMzQixVQUFNLElBQUksVUFBVSw0REFBNEQ7QUFBQSxFQUNqRjtBQUVELE1BQUksT0FBTyxFQUFFLFlBQVksTUFBTSxHQUFHLFFBQU87QUFDekMsTUFBSSxPQUFPLEtBQUssZ0JBQWdCLFdBQVc7QUFDekMsU0FBSyxhQUFhLEtBQUssZ0JBQWdCO0FBQUEsRUFDeEM7QUFFRCxNQUFJLFFBQVEsT0FBTyxLQUFLLFVBQVU7QUFDbEMsTUFBSSxZQUFZLE9BQU8sS0FBSyxTQUFTO0FBQ3JDLE1BQUksVUFBVSxPQUFPLEtBQUssT0FBTztBQUNqQyxNQUFJLE9BQU8sT0FBTyxLQUFLLElBQUk7QUFDM0IsTUFBSSxXQUFXLE1BQU0sTUFBTSxNQUFNLE1BQU0sUUFBUSxZQUFZLFVBQVU7QUFFckUsTUFBSUMsZUFBYSxNQUFNLGVBQWUsUUFBUSxHQUFHO0FBQy9DLFdBQU9BLGVBQWEsTUFBTSxVQUFVO0FBQUEsRUFDckM7QUFFRCxNQUFJLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRztBQUN6QixNQUFJLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRztBQUV6QixNQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHO0FBQ3pCLFFBQUksU0FBUyxNQUFNLE1BQU07QUFDekIsUUFBSSxLQUFLLFNBQVM7QUFDaEIsYUFBTyxJQUFJO0FBQUEsSUFDWjtBQUNELFFBQUksS0FBSyxTQUFTLE9BQU87QUFDdkIsYUFBTztBQUFBLElBQ1I7QUFDRCxXQUFPLE1BQU07QUFBQSxFQUNkO0FBRUQsTUFBSSxXQUFXLFdBQVcsR0FBRyxLQUFLLFdBQVcsR0FBRztBQUNoRCxNQUFJLFFBQVEsRUFBRSxLQUFLLEtBQUssR0FBRyxFQUFDO0FBQzVCLE1BQUksWUFBWSxDQUFBO0FBQ2hCLE1BQUksWUFBWSxDQUFBO0FBRWhCLE1BQUksVUFBVTtBQUNaLFVBQU0sV0FBVztBQUNqQixVQUFNLFNBQVMsT0FBTyxNQUFNLEdBQUcsRUFBRTtBQUFBLEVBQ2xDO0FBRUQsTUFBSSxJQUFJLEdBQUc7QUFDVCxRQUFJLFNBQVMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUk7QUFDbkMsZ0JBQVksZ0JBQWdCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxPQUFPLElBQUk7QUFDNUQsUUFBSSxNQUFNLElBQUk7QUFBQSxFQUNmO0FBRUQsTUFBSSxLQUFLLEdBQUc7QUFDVixnQkFBWSxnQkFBZ0IsR0FBRyxHQUFHLE9BQU8sSUFBSTtBQUFBLEVBQzlDO0FBRUQsUUFBTSxZQUFZO0FBQ2xCLFFBQU0sWUFBWTtBQUNsQixRQUFNLFNBQVMsZ0JBQWdCLFdBQVcsU0FBZTtBQUV6RCxNQUFJLEtBQUssWUFBWSxNQUFNO0FBQ3pCLFVBQU0sU0FBUyxJQUFJLE1BQU07QUFBQSxFQUM3QixXQUFhLEtBQUssU0FBUyxTQUFVLFVBQVUsU0FBUyxVQUFVLFNBQVUsR0FBRztBQUMzRSxVQUFNLFNBQVMsTUFBTSxNQUFNO0FBQUEsRUFDNUI7QUFFREEsaUJBQWEsTUFBTSxZQUFZO0FBQy9CLFNBQU8sTUFBTTtBQUNmO0FBRUEsU0FBUyxnQkFBZ0IsS0FBSyxLQUFLLFNBQVM7QUFDMUMsTUFBSSxlQUFlLGVBQWUsS0FBSyxLQUFLLEtBQUssS0FBYyxLQUFLO0FBQ3BFLE1BQUksZUFBZSxlQUFlLEtBQUssS0FBSyxJQUFJLEtBQWMsS0FBSztBQUNuRSxNQUFJLGNBQWMsZUFBZSxLQUFLLEtBQUssTUFBTSxJQUFhLEtBQUs7QUFDbkUsTUFBSSxjQUFjLGFBQWEsT0FBTyxXQUFXLEVBQUUsT0FBTyxZQUFZO0FBQ3RFLFNBQU8sWUFBWSxLQUFLLEdBQUc7QUFDN0I7QUFFQSxTQUFTLGNBQWMsS0FBSyxLQUFLO0FBQy9CLE1BQUksUUFBUTtBQUNaLE1BQUlDLFNBQVE7QUFFWixNQUFJLE9BQU8sV0FBVyxLQUFLLEtBQUs7QUFDaEMsTUFBSSxRQUFRLG9CQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7QUFFekIsU0FBTyxPQUFPLFFBQVEsUUFBUSxLQUFLO0FBQ2pDLFVBQU0sSUFBSSxJQUFJO0FBQ2QsYUFBUztBQUNULFdBQU8sV0FBVyxLQUFLLEtBQUs7QUFBQSxFQUM3QjtBQUVELFNBQU8sV0FBVyxNQUFNLEdBQUdBLE1BQUssSUFBSTtBQUVwQyxTQUFPLE1BQU0sUUFBUSxRQUFRLEtBQUs7QUFDaEMsVUFBTSxJQUFJLElBQUk7QUFDZCxJQUFBQSxVQUFTO0FBQ1QsV0FBTyxXQUFXLE1BQU0sR0FBR0EsTUFBSyxJQUFJO0FBQUEsRUFDckM7QUFFRCxVQUFRLENBQUMsR0FBRyxLQUFLO0FBQ2pCLFFBQU0sS0FBSyxPQUFPO0FBQ2xCLFNBQU87QUFDVDtBQVNBLFNBQVMsZUFBZSxPQUFPLE1BQU0sU0FBUztBQUM1QyxNQUFJLFVBQVUsTUFBTTtBQUNsQixXQUFPLEVBQUUsU0FBUyxPQUFPLE9BQU8sQ0FBQSxHQUFJLFFBQVE7RUFDN0M7QUFFRCxNQUFJLFNBQVMsSUFBSSxPQUFPLElBQUk7QUFDNUIsTUFBSSxTQUFTLE9BQU87QUFDcEIsTUFBSSxVQUFVO0FBQ2QsTUFBSSxRQUFRO0FBRVosV0FBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLEtBQUs7QUFDL0IsUUFBSSxDQUFDLFlBQVksU0FBUyxJQUFJLE9BQU87QUFFckMsUUFBSSxlQUFlLFdBQVc7QUFDNUIsaUJBQVc7QUFBQSxJQUVaLFdBQVUsZUFBZSxPQUFPLGNBQWMsS0FBSztBQUNsRCxpQkFBVyxpQkFBaUIsWUFBWSxTQUFrQjtBQUFBLElBRWhFLE9BQVc7QUFDTDtBQUFBLElBQ0Q7QUFBQSxFQUNGO0FBRUQsTUFBSSxPQUFPO0FBQ1QsZUFBVyxRQUFRLGNBQWMsT0FBTyxRQUFRO0FBQUEsRUFDakQ7QUFFRCxTQUFPLEVBQUUsU0FBUyxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU07QUFDMUM7QUFFQSxTQUFTLGdCQUFnQixLQUFLLEtBQUssS0FBSyxTQUFTO0FBQy9DLE1BQUksU0FBUyxjQUFjLEtBQUssR0FBRztBQUNuQyxNQUFJLFNBQVMsQ0FBQTtBQUNiLE1BQUksUUFBUTtBQUNaLE1BQUk7QUFFSixXQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLO0FBQ3RDLFFBQUlDLE9BQU0sT0FBTztBQUNqQixRQUFJLE1BQU0sZUFBZSxPQUFPLEtBQUssR0FBRyxPQUFPQSxJQUFHLEdBQUcsT0FBTztBQUM1RCxRQUFJRCxTQUFRO0FBRVosUUFBSSxDQUFDLElBQUksWUFBWSxRQUFRLEtBQUssWUFBWSxJQUFJLFNBQVM7QUFDekQsVUFBSSxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQ3pCLGFBQUssTUFBTTtNQUNaO0FBRUQsV0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDNUIsV0FBSyxTQUFTLEtBQUssVUFBVSxhQUFhLEtBQUssS0FBSztBQUNwRCxjQUFRQyxPQUFNO0FBQ2Q7QUFBQSxJQUNEO0FBRUQsUUFBSSxJQUFJLFVBQVU7QUFDaEIsTUFBQUQsU0FBUSxTQUFTQyxNQUFLLEtBQUssT0FBTztBQUFBLElBQ25DO0FBRUQsUUFBSSxTQUFTRCxTQUFRLElBQUksVUFBVSxhQUFhLElBQUksS0FBSztBQUN6RCxXQUFPLEtBQUssR0FBRztBQUNmLFlBQVFDLE9BQU07QUFDZCxXQUFPO0FBQUEsRUFDUjtBQUVELFNBQU87QUFDVDtBQUVBLFNBQVMsZUFBZSxLQUFLLFlBQVksUUFBUSxjQUFjLFNBQVM7QUFDdEUsTUFBSSxTQUFTLENBQUE7QUFFYixXQUFTLE9BQU8sS0FBSztBQUNuQixRQUFJLEVBQUUsT0FBUSxJQUFHO0FBR2pCLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLFlBQVksVUFBVSxNQUFNLEdBQUc7QUFDNUQsYUFBTyxLQUFLLFNBQVMsTUFBTTtBQUFBLElBQzVCO0FBR0QsUUFBSSxnQkFBZ0IsU0FBUyxZQUFZLFVBQVUsTUFBTSxHQUFHO0FBQzFELGFBQU8sS0FBSyxTQUFTLE1BQU07QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFDRCxTQUFPO0FBQ1Q7QUFNQSxTQUFTLElBQUksR0FBRyxHQUFHO0FBQ2pCLE1BQUksTUFBTSxDQUFBO0FBQ1YsV0FBUyxJQUFJLEdBQUcsSUFBSSxFQUFFLFFBQVE7QUFBSyxRQUFJLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7QUFDeEQsU0FBTztBQUNUO0FBRUEsU0FBUyxRQUFRLEdBQUcsR0FBRztBQUNyQixTQUFPLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLO0FBQ2xDO0FBRUEsU0FBUyxTQUFTLEtBQUssS0FBSyxLQUFLO0FBQy9CLFNBQU8sSUFBSSxLQUFLLFNBQU8sSUFBSSxTQUFTLEdBQUc7QUFDekM7QUFFQSxTQUFTLFdBQVcsS0FBSyxLQUFLO0FBQzVCLFNBQU8sT0FBTyxPQUFPLEdBQUcsRUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxPQUFPLEdBQUcsQ0FBQztBQUM1RDtBQUVBLFNBQVMsV0FBVyxTQUFTRCxRQUFPO0FBQ2xDLFNBQU8sVUFBVyxVQUFVLEtBQUssSUFBSSxJQUFJQSxNQUFLO0FBQ2hEO0FBRUEsU0FBUyxhQUFhLFFBQVE7QUFDNUIsTUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLEVBQUUsSUFBSTtBQUM3QixNQUFJLFFBQVEsUUFBUSxHQUFHO0FBQ3JCLFdBQU8sSUFBSSxTQUFTLE9BQU8sTUFBTSxPQUFPO0FBQUEsRUFDekM7QUFDRCxTQUFPO0FBQ1Q7QUFFQSxTQUFTLGlCQUFpQixHQUFHLEdBQUcsU0FBUztBQUN2QyxTQUFPLElBQUksSUFBSyxJQUFJLE1BQU0sSUFBSyxLQUFLLE1BQU07QUFDNUM7QUFFQSxTQUFTLFdBQVcsS0FBSztBQUN2QixTQUFPLFlBQVksS0FBSyxHQUFHO0FBQzdCO0FBRUEsU0FBUyxTQUFTLE9BQU8sS0FBSyxTQUFTO0FBQ3JDLE1BQUksQ0FBQyxJQUFJLFVBQVU7QUFDakIsV0FBTztBQUFBLEVBQ1I7QUFFRCxNQUFJLE9BQU8sS0FBSyxJQUFJLElBQUksU0FBUyxPQUFPLEtBQUssRUFBRSxNQUFNO0FBQ3JELE1BQUksUUFBUSxRQUFRLGVBQWU7QUFFbkMsVUFBUTtBQUFBLFNBQ0Q7QUFDSCxhQUFPO0FBQUEsU0FDSjtBQUNILGFBQU8sUUFBUSxPQUFPO0FBQUEsU0FDbkI7QUFDSCxhQUFPLFFBQVEsV0FBVztBQUFBLGFBQ25CO0FBQ1AsYUFBTyxRQUFRLE9BQU8sVUFBVSxLQUFLO0FBQUEsSUFDdEM7QUFBQTtBQUVMO0FBTUFELGVBQWEsUUFBUSxDQUFBO0FBQ3JCQSxlQUFhLGFBQWEsTUFBT0EsZUFBYSxRQUFRLENBQUU7QUFNeEQsSUFBQSxpQkFBaUJBOzs7Ozs7O0FDdFJqQixNQUFNLE9BQU90SixvQkFBQUE7QUFDYixNQUFNLGVBQWVlO0FBRXJCLE1BQU0sV0FBVyxTQUFPLFFBQVEsUUFBUSxPQUFPLFFBQVEsWUFBWSxDQUFDLE1BQU0sUUFBUSxHQUFHO0FBRXJGLE1BQU0sWUFBWSxjQUFZO0FBQzVCLFNBQU8sV0FBUyxhQUFhLE9BQU8sT0FBTyxLQUFLLElBQUksT0FBTyxLQUFLO0FBQ2xFO0FBRUEsTUFBTSxlQUFlLFdBQVM7QUFDNUIsU0FBTyxPQUFPLFVBQVUsWUFBYSxPQUFPLFVBQVUsWUFBWSxVQUFVO0FBQzlFO0FBRUEsTUFBTSxXQUFXLFNBQU8sT0FBTyxVQUFVLENBQUMsR0FBRztBQUU3QyxNQUFNLFFBQVEsV0FBUztBQUNyQixNQUFJLFFBQVEsR0FBRztBQUNmLE1BQUksUUFBUTtBQUNaLE1BQUksTUFBTSxPQUFPO0FBQUssWUFBUSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxNQUFJLFVBQVU7QUFBSyxXQUFPO0FBQzFCLFNBQU8sTUFBTSxFQUFFLFdBQVc7QUFBSTtBQUM5QixTQUFPLFFBQVE7QUFDakI7QUFFQSxNQUFNOEQsY0FBWSxDQUFDLE9BQU8sS0FBSyxZQUFZO0FBQ3pDLE1BQUksT0FBTyxVQUFVLFlBQVksT0FBTyxRQUFRLFVBQVU7QUFDeEQsV0FBTztBQUFBLEVBQ1I7QUFDRCxTQUFPLFFBQVEsY0FBYztBQUMvQjtBQUVBLE1BQU0sTUFBTSxDQUFDLE9BQU8sV0FBVyxhQUFhO0FBQzFDLE1BQUksWUFBWSxHQUFHO0FBQ2pCLFFBQUksT0FBTyxNQUFNLE9BQU8sTUFBTSxNQUFNO0FBQ3BDLFFBQUk7QUFBTSxjQUFRLE1BQU0sTUFBTSxDQUFDO0FBQy9CLFlBQVMsT0FBTyxNQUFNLFNBQVMsT0FBTyxZQUFZLElBQUksV0FBVyxHQUFHO0FBQUEsRUFDckU7QUFDRCxNQUFJLGFBQWEsT0FBTztBQUN0QixXQUFPLE9BQU8sS0FBSztBQUFBLEVBQ3BCO0FBQ0QsU0FBTztBQUNUO0FBRUEsTUFBTSxXQUFXLENBQUMsT0FBTyxjQUFjO0FBQ3JDLE1BQUksV0FBVyxNQUFNLE9BQU8sTUFBTSxNQUFNO0FBQ3hDLE1BQUksVUFBVTtBQUNaLFlBQVEsTUFBTSxNQUFNLENBQUM7QUFDckI7QUFBQSxFQUNEO0FBQ0QsU0FBTyxNQUFNLFNBQVM7QUFBVyxZQUFRLE1BQU07QUFDL0MsU0FBTyxXQUFZLE1BQU0sUUFBUztBQUNwQztBQUVBLE1BQU0sYUFBYSxDQUFDLE9BQU8sWUFBWTtBQUNyQyxRQUFNLFVBQVUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ3pELFFBQU0sVUFBVSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUM7QUFFekQsTUFBSSxTQUFTLFFBQVEsVUFBVSxLQUFLO0FBQ3BDLE1BQUksWUFBWTtBQUNoQixNQUFJLFlBQVk7QUFDaEIsTUFBSTtBQUVKLE1BQUksTUFBTSxVQUFVLFFBQVE7QUFDMUIsZ0JBQVksTUFBTSxVQUFVLEtBQUssR0FBRztBQUFBLEVBQ3JDO0FBRUQsTUFBSSxNQUFNLFVBQVUsUUFBUTtBQUMxQixnQkFBWSxLQUFLLFNBQVMsTUFBTSxVQUFVLEtBQUssR0FBRztBQUFBLEVBQ25EO0FBRUQsTUFBSSxhQUFhLFdBQVc7QUFDMUIsYUFBUyxHQUFHLGFBQWE7QUFBQSxFQUM3QixPQUFTO0FBQ0wsYUFBUyxhQUFhO0FBQUEsRUFDdkI7QUFFRCxNQUFJLFFBQVEsTUFBTTtBQUNoQixXQUFPLElBQUksU0FBUztBQUFBLEVBQ3JCO0FBRUQsU0FBTztBQUNUO0FBRUEsTUFBTSxVQUFVLENBQUMsR0FBRyxHQUFHLFdBQVcsWUFBWTtBQUM1QyxNQUFJLFdBQVc7QUFDYixXQUFPLGFBQWEsR0FBRyxHQUFHLEVBQUUsTUFBTSxPQUFPLEdBQUcsUUFBTyxDQUFFO0FBQUEsRUFDdEQ7QUFFRCxNQUFJLFFBQVEsT0FBTyxhQUFhLENBQUM7QUFDakMsTUFBSSxNQUFNO0FBQUcsV0FBTztBQUVwQixNQUFJLE9BQU8sT0FBTyxhQUFhLENBQUM7QUFDaEMsU0FBTyxJQUFJLFNBQVM7QUFDdEI7QUFFQSxNQUFNLFVBQVUsQ0FBQyxPQUFPLEtBQUssWUFBWTtBQUN2QyxNQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFDeEIsUUFBSSxPQUFPLFFBQVEsU0FBUztBQUM1QixRQUFJLFNBQVMsUUFBUSxVQUFVLEtBQUs7QUFDcEMsV0FBTyxPQUFPLElBQUksU0FBUyxNQUFNLEtBQUssR0FBRyxPQUFPLE1BQU0sS0FBSyxHQUFHO0FBQUEsRUFDL0Q7QUFDRCxTQUFPLGFBQWEsT0FBTyxLQUFLLE9BQU87QUFDekM7QUFFQSxNQUFNLGFBQWEsSUFBSSxTQUFTO0FBQzlCLFNBQU8sSUFBSSxXQUFXLDhCQUE4QixLQUFLLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDM0U7QUFFQSxNQUFNLGVBQWUsQ0FBQyxPQUFPLEtBQUssWUFBWTtBQUM1QyxNQUFJLFFBQVEsaUJBQWlCO0FBQU0sVUFBTSxXQUFXLENBQUMsT0FBTyxHQUFHLENBQUM7QUFDaEUsU0FBTztBQUNUO0FBRUEsTUFBTSxjQUFjLENBQUMsTUFBTSxZQUFZO0FBQ3JDLE1BQUksUUFBUSxpQkFBaUIsTUFBTTtBQUNqQyxVQUFNLElBQUksVUFBVSxrQkFBa0Isc0JBQXNCO0FBQUEsRUFDN0Q7QUFDRCxTQUFPO0FBQ1Q7QUFFQSxNQUFNLGNBQWMsQ0FBQyxPQUFPLEtBQUssT0FBTyxHQUFHLFVBQVUsT0FBTztBQUMxRCxNQUFJLElBQUksT0FBTyxLQUFLO0FBQ3BCLE1BQUksSUFBSSxPQUFPLEdBQUc7QUFFbEIsTUFBSSxDQUFDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLFVBQVUsQ0FBQyxHQUFHO0FBQ2hELFFBQUksUUFBUSxpQkFBaUI7QUFBTSxZQUFNLFdBQVcsQ0FBQyxPQUFPLEdBQUcsQ0FBQztBQUNoRSxXQUFPO0VBQ1I7QUFHRCxNQUFJLE1BQU07QUFBRyxRQUFJO0FBQ2pCLE1BQUksTUFBTTtBQUFHLFFBQUk7QUFFakIsTUFBSSxhQUFhLElBQUk7QUFDckIsTUFBSSxjQUFjLE9BQU8sS0FBSztBQUM5QixNQUFJLFlBQVksT0FBTyxHQUFHO0FBQzFCLE1BQUksYUFBYSxPQUFPLElBQUk7QUFDNUIsU0FBTyxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDO0FBRWpDLE1BQUksU0FBUyxNQUFNLFdBQVcsS0FBSyxNQUFNLFNBQVMsS0FBSyxNQUFNLFVBQVU7QUFDdkUsTUFBSSxTQUFTLFNBQVMsS0FBSyxJQUFJLFlBQVksUUFBUSxVQUFVLFFBQVEsV0FBVyxNQUFNLElBQUk7QUFDMUYsTUFBSSxXQUFXLFdBQVcsU0FBU0EsWUFBVSxPQUFPLEtBQUssT0FBTyxNQUFNO0FBQ3RFLE1BQUksU0FBUyxRQUFRLGFBQWEsVUFBVSxRQUFRO0FBRXBELE1BQUksUUFBUSxXQUFXLFNBQVMsR0FBRztBQUNqQyxXQUFPLFFBQVEsU0FBUyxPQUFPLE1BQU0sR0FBRyxTQUFTLEtBQUssTUFBTSxHQUFHLE1BQU0sT0FBTztBQUFBLEVBQzdFO0FBRUQsTUFBSSxRQUFRLEVBQUUsV0FBVyxDQUFFLEdBQUUsV0FBVyxDQUFFLEVBQUE7QUFDMUMsTUFBSSxPQUFPLFNBQU8sTUFBTSxNQUFNLElBQUksY0FBYyxhQUFhLEtBQUssS0FBSyxJQUFJLEdBQUcsQ0FBQztBQUMvRSxNQUFJLFFBQVEsQ0FBQTtBQUNaLE1BQUksUUFBUTtBQUVaLFNBQU8sYUFBYSxLQUFLLElBQUksS0FBSyxHQUFHO0FBQ25DLFFBQUksUUFBUSxZQUFZLFFBQVEsT0FBTyxHQUFHO0FBQ3hDLFdBQUssQ0FBQztBQUFBLElBQ1osT0FBVztBQUNMLFlBQU0sS0FBSyxJQUFJLE9BQU8sR0FBRyxLQUFLLEdBQUcsUUFBUSxRQUFRLENBQUM7QUFBQSxJQUNuRDtBQUNELFFBQUksYUFBYSxJQUFJLE9BQU8sSUFBSTtBQUNoQztBQUFBLEVBQ0Q7QUFFRCxNQUFJLFFBQVEsWUFBWSxNQUFNO0FBQzVCLFdBQU8sT0FBTyxJQUNWLFdBQVcsT0FBTyxPQUFPLElBQ3pCLFFBQVEsT0FBTyxNQUFNLEVBQUUsTUFBTSxPQUFPLEdBQUcsUUFBTyxDQUFFO0FBQUEsRUFDckQ7QUFFRCxTQUFPO0FBQ1Q7QUFFQSxNQUFNLGNBQWMsQ0FBQyxPQUFPLEtBQUssT0FBTyxHQUFHLFVBQVUsT0FBTztBQUMxRCxNQUFLLENBQUMsU0FBUyxLQUFLLEtBQUssTUFBTSxTQUFTLEtBQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLFNBQVMsR0FBSTtBQUNoRixXQUFPLGFBQWEsT0FBTyxLQUFLLE9BQU87QUFBQSxFQUN4QztBQUdELE1BQUksU0FBUyxRQUFRLGNBQWMsU0FBTyxPQUFPLGFBQWEsR0FBRztBQUNqRSxNQUFJLElBQUksR0FBRyxRQUFRLFdBQVcsQ0FBQztBQUMvQixNQUFJLElBQUksR0FBRyxNQUFNLFdBQVcsQ0FBQztBQUU3QixNQUFJLGFBQWEsSUFBSTtBQUNyQixNQUFJLE1BQU0sS0FBSyxJQUFJLEdBQUcsQ0FBQztBQUN2QixNQUFJLE1BQU0sS0FBSyxJQUFJLEdBQUcsQ0FBQztBQUV2QixNQUFJLFFBQVEsV0FBVyxTQUFTLEdBQUc7QUFDakMsV0FBTyxRQUFRLEtBQUssS0FBSyxPQUFPLE9BQU87QUFBQSxFQUN4QztBQUVELE1BQUksUUFBUSxDQUFBO0FBQ1osTUFBSSxRQUFRO0FBRVosU0FBTyxhQUFhLEtBQUssSUFBSSxLQUFLLEdBQUc7QUFDbkMsVUFBTSxLQUFLLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDM0IsUUFBSSxhQUFhLElBQUksT0FBTyxJQUFJO0FBQ2hDO0FBQUEsRUFDRDtBQUVELE1BQUksUUFBUSxZQUFZLE1BQU07QUFDNUIsV0FBTyxRQUFRLE9BQU8sTUFBTSxFQUFFLE1BQU0sT0FBTyxRQUFPLENBQUU7QUFBQSxFQUNyRDtBQUVELFNBQU87QUFDVDtBQUVBLE1BQU00RSxTQUFPLENBQUMsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBLE1BQU87QUFDL0MsTUFBSSxPQUFPLFFBQVEsYUFBYSxLQUFLLEdBQUc7QUFDdEMsV0FBTyxDQUFDLEtBQUs7QUFBQSxFQUNkO0FBRUQsTUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUMsYUFBYSxHQUFHLEdBQUc7QUFDOUMsV0FBTyxhQUFhLE9BQU8sS0FBSyxPQUFPO0FBQUEsRUFDeEM7QUFFRCxNQUFJLE9BQU8sU0FBUyxZQUFZO0FBQzlCLFdBQU9BLE9BQUssT0FBTyxLQUFLLEdBQUcsRUFBRSxXQUFXLEtBQUksQ0FBRTtBQUFBLEVBQy9DO0FBRUQsTUFBSSxTQUFTLElBQUksR0FBRztBQUNsQixXQUFPQSxPQUFLLE9BQU8sS0FBSyxHQUFHLElBQUk7QUFBQSxFQUNoQztBQUVELE1BQUksT0FBTyxFQUFFLEdBQUc7QUFDaEIsTUFBSSxLQUFLLFlBQVk7QUFBTSxTQUFLLE9BQU87QUFDdkMsU0FBTyxRQUFRLEtBQUssUUFBUTtBQUU1QixNQUFJLENBQUMsU0FBUyxJQUFJLEdBQUc7QUFDbkIsUUFBSSxRQUFRLFFBQVEsQ0FBQyxTQUFTLElBQUk7QUFBRyxhQUFPLFlBQVksTUFBTSxJQUFJO0FBQ2xFLFdBQU9BLE9BQUssT0FBTyxLQUFLLEdBQUcsSUFBSTtBQUFBLEVBQ2hDO0FBRUQsTUFBSSxTQUFTLEtBQUssS0FBSyxTQUFTLEdBQUcsR0FBRztBQUNwQyxXQUFPLFlBQVksT0FBTyxLQUFLLE1BQU0sSUFBSTtBQUFBLEVBQzFDO0FBRUQsU0FBTyxZQUFZLE9BQU8sS0FBSyxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSTtBQUNsRTtBQUVBLElBQUEsWUFBaUJBO0FDdFBqQixNQUFNQSxTQUFPeko7QUFDYixNQUFNZ0csVUFBUWpGO0FBRWQsTUFBTTJJLFlBQVUsQ0FBQyxLQUFLLFVBQVUsT0FBTztBQUNyQyxNQUFJLE9BQU8sQ0FBQyxNQUFNLFNBQVMsQ0FBQSxNQUFPO0FBQ2hDLFFBQUksZUFBZTFELFFBQU0sZUFBZSxNQUFNO0FBQzlDLFFBQUksY0FBYyxLQUFLLFlBQVksUUFBUSxRQUFRLGtCQUFrQjtBQUNyRSxRQUFJLFVBQVUsaUJBQWlCLFFBQVEsZ0JBQWdCO0FBQ3ZELFFBQUksU0FBUyxRQUFRLGtCQUFrQixPQUFPLE9BQU87QUFDckQsUUFBSUYsVUFBUztBQUViLFFBQUksS0FBSyxXQUFXLE1BQU07QUFDeEIsYUFBTyxTQUFTLEtBQUs7QUFBQSxJQUN0QjtBQUNELFFBQUksS0FBSyxZQUFZLE1BQU07QUFDekIsYUFBTyxTQUFTLEtBQUs7QUFBQSxJQUN0QjtBQUVELFFBQUksS0FBSyxTQUFTLFFBQVE7QUFDeEIsYUFBTyxVQUFXLFNBQVMsS0FBSyxRQUFTO0FBQUEsSUFDMUM7QUFFRCxRQUFJLEtBQUssU0FBUyxTQUFTO0FBQ3pCLGFBQU8sVUFBVyxTQUFTLEtBQUssUUFBUztBQUFBLElBQzFDO0FBRUQsUUFBSSxLQUFLLFNBQVMsU0FBUztBQUN6QixhQUFPLEtBQUssS0FBSyxTQUFTLFVBQVUsS0FBTSxVQUFVLEtBQUssUUFBUTtBQUFBLElBQ2xFO0FBRUQsUUFBSSxLQUFLLE9BQU87QUFDZCxhQUFPLEtBQUs7QUFBQSxJQUNiO0FBRUQsUUFBSSxLQUFLLFNBQVMsS0FBSyxTQUFTLEdBQUc7QUFDakMsVUFBSSxPQUFPRSxRQUFNLE9BQU8sS0FBSyxLQUFLO0FBQ2xDLFVBQUksUUFBUXlELE9BQUssR0FBRyxNQUFNLEVBQUUsR0FBRyxTQUFTLE1BQU0sT0FBTyxTQUFTLEtBQU0sQ0FBQTtBQUVwRSxVQUFJLE1BQU0sV0FBVyxHQUFHO0FBQ3RCLGVBQU8sS0FBSyxTQUFTLEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxXQUFXO0FBQUEsTUFDN0Q7QUFBQSxJQUNGO0FBRUQsUUFBSSxLQUFLLE9BQU87QUFDZCxlQUFTLFNBQVMsS0FBSyxPQUFPO0FBQzVCLFFBQUEzRCxXQUFVLEtBQUssT0FBTyxJQUFJO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBQ0QsV0FBT0E7QUFBQSxFQUNYO0FBRUUsU0FBTyxLQUFLLEdBQUc7QUFDakI7QUFFQSxJQUFBLFlBQWlCNEQ7QUN0RGpCLE1BQU0sT0FBTzFKO0FBQ2IsTUFBTTZFLGNBQVk5RDtBQUNsQixNQUFNLFFBQVFDO0FBRWQsTUFBTSxTQUFTLENBQUNJLFNBQVEsSUFBSSxRQUFRLElBQUksVUFBVSxVQUFVO0FBQzFELE1BQUksU0FBUyxDQUFBO0FBRWIsRUFBQUEsU0FBUSxDQUFFLEVBQUMsT0FBT0EsTUFBSztBQUN2QixVQUFRLENBQUUsRUFBQyxPQUFPLEtBQUs7QUFFdkIsTUFBSSxDQUFDLE1BQU07QUFBUSxXQUFPQTtBQUMxQixNQUFJLENBQUNBLE9BQU0sUUFBUTtBQUNqQixXQUFPLFVBQVUsTUFBTSxRQUFRLEtBQUssRUFBRSxJQUFJLFNBQU8sSUFBSSxNQUFNLElBQUk7QUFBQSxFQUNoRTtBQUVELFdBQVMsUUFBUUEsUUFBTztBQUN0QixRQUFJLE1BQU0sUUFBUSxJQUFJLEdBQUc7QUFDdkIsZUFBUyxTQUFTLE1BQU07QUFDdEIsZUFBTyxLQUFLLE9BQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQztBQUFBLE1BQzFDO0FBQUEsSUFDUCxPQUFXO0FBQ0wsZUFBUyxPQUFPLE9BQU87QUFDckIsWUFBSSxZQUFZLFFBQVEsT0FBTyxRQUFRO0FBQVUsZ0JBQU0sSUFBSTtBQUMzRCxlQUFPLEtBQUssTUFBTSxRQUFRLEdBQUcsSUFBSSxPQUFPLE1BQU0sS0FBSyxPQUFPLElBQUssT0FBTyxHQUFJO0FBQUEsTUFDM0U7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNELFNBQU8sTUFBTSxRQUFRLE1BQU07QUFDN0I7QUFFQSxNQUFNdUksV0FBUyxDQUFDLEtBQUssVUFBVSxPQUFPO0FBQ3BDLE1BQUksYUFBYSxRQUFRLGVBQWUsU0FBUyxNQUFPLFFBQVE7QUFFaEUsTUFBSSxPQUFPLENBQUMsTUFBTSxTQUFTLENBQUEsTUFBTztBQUNoQyxTQUFLLFFBQVE7QUFFYixRQUFJLElBQUk7QUFDUixRQUFJLElBQUksT0FBTztBQUVmLFdBQU8sRUFBRSxTQUFTLFdBQVcsRUFBRSxTQUFTLFVBQVUsRUFBRSxRQUFRO0FBQzFELFVBQUksRUFBRTtBQUNOLFVBQUksRUFBRTtBQUFBLElBQ1A7QUFFRCxRQUFJLEtBQUssV0FBVyxLQUFLLFFBQVE7QUFDL0IsUUFBRSxLQUFLLE9BQU8sRUFBRSxPQUFPOUUsWUFBVSxNQUFNLE9BQU8sQ0FBQyxDQUFDO0FBQ2hEO0FBQUEsSUFDRDtBQUVELFFBQUksS0FBSyxTQUFTLFdBQVcsS0FBSyxZQUFZLFFBQVEsS0FBSyxNQUFNLFdBQVcsR0FBRztBQUM3RSxRQUFFLEtBQUssT0FBTyxFQUFFLElBQUcsR0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCO0FBQUEsSUFDRDtBQUVELFFBQUksS0FBSyxTQUFTLEtBQUssU0FBUyxHQUFHO0FBQ2pDLFVBQUksT0FBTyxNQUFNLE9BQU8sS0FBSyxLQUFLO0FBRWxDLFVBQUksTUFBTSxhQUFhLEdBQUcsTUFBTSxRQUFRLE1BQU0sVUFBVSxHQUFHO0FBQ3pELGNBQU0sSUFBSSxXQUFXLHFHQUFxRztBQUFBLE1BQzNIO0FBRUQsVUFBSSxRQUFRLEtBQUssR0FBRyxNQUFNLE9BQU87QUFDakMsVUFBSSxNQUFNLFdBQVcsR0FBRztBQUN0QixnQkFBUUEsWUFBVSxNQUFNLE9BQU87QUFBQSxNQUNoQztBQUVELFFBQUUsS0FBSyxPQUFPLEVBQUUsSUFBSyxHQUFFLEtBQUssQ0FBQztBQUM3QixXQUFLLFFBQVE7QUFDYjtBQUFBLElBQ0Q7QUFFRCxRQUFJLFVBQVUsTUFBTSxhQUFhLElBQUk7QUFDckMsUUFBSXpELFNBQVEsS0FBSztBQUNqQixRQUFJLFFBQVE7QUFFWixXQUFPLE1BQU0sU0FBUyxXQUFXLE1BQU0sU0FBUyxVQUFVLE1BQU0sUUFBUTtBQUN0RSxjQUFRLE1BQU07QUFDZCxNQUFBQSxTQUFRLE1BQU07QUFBQSxJQUNmO0FBRUQsYUFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLE1BQU0sUUFBUSxLQUFLO0FBQzFDLFVBQUksUUFBUSxLQUFLLE1BQU07QUFFdkIsVUFBSSxNQUFNLFNBQVMsV0FBVyxLQUFLLFNBQVMsU0FBUztBQUNuRCxZQUFJLE1BQU07QUFBRyxVQUFBQSxPQUFNLEtBQUssRUFBRTtBQUMxQixRQUFBQSxPQUFNLEtBQUssRUFBRTtBQUNiO0FBQUEsTUFDRDtBQUVELFVBQUksTUFBTSxTQUFTLFNBQVM7QUFDMUIsVUFBRSxLQUFLLE9BQU8sRUFBRSxJQUFHLEdBQUlBLFFBQU8sT0FBTyxDQUFDO0FBQ3RDO0FBQUEsTUFDRDtBQUVELFVBQUksTUFBTSxTQUFTLE1BQU0sU0FBUyxRQUFRO0FBQ3hDLFFBQUFBLE9BQU0sS0FBSyxPQUFPQSxPQUFNLElBQUcsR0FBSSxNQUFNLEtBQUssQ0FBQztBQUMzQztBQUFBLE1BQ0Q7QUFFRCxVQUFJLE1BQU0sT0FBTztBQUNmLGFBQUssT0FBTyxJQUFJO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBRUQsV0FBT0E7QUFBQSxFQUNYO0FBRUUsU0FBTyxNQUFNLFFBQVEsS0FBSyxHQUFHLENBQUM7QUFDaEM7QUFFQSxJQUFBLFdBQWlCdUk7QUM5R2pCLElBQUE1SixjQUFpQjtBQUFBLEVBQ2YsWUFBWSxPQUFPO0FBQUEsRUFHbkIsUUFBUTtBQUFBLEVBQ1IsUUFBUTtBQUFBLEVBR1Isa0JBQWtCO0FBQUEsRUFDbEIsa0JBQWtCO0FBQUEsRUFDbEIsa0JBQWtCO0FBQUEsRUFDbEIsa0JBQWtCO0FBQUEsRUFFbEIsdUJBQXVCO0FBQUEsRUFDdkIsd0JBQXdCO0FBQUEsRUFFeEIsZUFBZTtBQUFBLEVBR2YsZ0JBQWdCO0FBQUEsRUFDaEIsU0FBUztBQUFBLEVBQ1QsZ0JBQWdCO0FBQUEsRUFDaEIsZUFBZTtBQUFBLEVBQ2Ysc0JBQXNCO0FBQUEsRUFDdEIsd0JBQXdCO0FBQUEsRUFDeEIsWUFBWTtBQUFBLEVBQ1osWUFBWTtBQUFBLEVBQ1osYUFBYTtBQUFBLEVBQ2IsVUFBVTtBQUFBLEVBQ1YsbUJBQW1CO0FBQUEsRUFDbkIsWUFBWTtBQUFBLEVBQ1osdUJBQXVCO0FBQUEsRUFDdkIsZ0JBQWdCO0FBQUEsRUFDaEIsb0JBQW9CO0FBQUEsRUFDcEIsV0FBVztBQUFBLEVBQ1gsbUJBQW1CO0FBQUEsRUFDbkIseUJBQXlCO0FBQUEsRUFDekIsdUJBQXVCO0FBQUEsRUFDdkIsMEJBQTBCO0FBQUEsRUFDMUIsZ0JBQWdCO0FBQUEsRUFDaEIscUJBQXFCO0FBQUEsRUFDckIsY0FBYztBQUFBLEVBQ2QsV0FBVztBQUFBLEVBQ1gsb0JBQW9CO0FBQUEsRUFDcEIsMEJBQTBCO0FBQUEsRUFDMUIsd0JBQXdCO0FBQUEsRUFDeEIsMkJBQTJCO0FBQUEsRUFDM0IsZ0JBQWdCO0FBQUEsRUFDaEIsbUJBQW1CO0FBQUEsRUFDbkIsWUFBWTtBQUFBLEVBQ1osVUFBVTtBQUFBLEVBQ1YsaUJBQWlCO0FBQUEsRUFDakIsb0JBQW9CO0FBQUEsRUFDcEIsK0JBQStCO0FBQ2pDO0FDdERBLE1BQU04RSxjQUFZN0U7QUFNbEIsTUFBTTtBQUFBLEVBQ0o7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLElBQUllO0FBTUosTUFBTWdHLFVBQVEsQ0FBQyxPQUFPLFVBQVUsT0FBTztBQUNyQyxNQUFJLE9BQU8sVUFBVSxVQUFVO0FBQzdCLFVBQU0sSUFBSSxVQUFVLG1CQUFtQjtBQUFBLEVBQ3hDO0FBRUQsTUFBSSxPQUFPLFdBQVc7QUFDdEIsTUFBSSxNQUFNLE9BQU8sS0FBSyxjQUFjLFdBQVcsS0FBSyxJQUFJLFlBQVksS0FBSyxTQUFTLElBQUk7QUFDdEYsTUFBSSxNQUFNLFNBQVMsS0FBSztBQUN0QixVQUFNLElBQUksWUFBWSxpQkFBaUIsTUFBTSxvQ0FBb0MsTUFBTTtBQUFBLEVBQ3hGO0FBRUQsTUFBSSxNQUFNLEVBQUUsTUFBTSxRQUFRLE9BQU8sT0FBTyxDQUFBO0FBQ3hDLE1BQUksUUFBUSxDQUFDLEdBQUc7QUFDaEIsTUFBSSxRQUFRO0FBQ1osTUFBSSxPQUFPO0FBQ1gsTUFBSSxXQUFXO0FBQ2YsTUFBSSxTQUFTLE1BQU07QUFDbkIsTUFBSSxRQUFRO0FBQ1osTUFBSTJCLFNBQVE7QUFDWixNQUFJO0FBT0osUUFBTSxVQUFVLE1BQU0sTUFBTTtBQUM1QixRQUFNLE9BQU8sVUFBUTtBQUNuQixRQUFJLEtBQUssU0FBUyxVQUFVLEtBQUssU0FBUyxPQUFPO0FBQy9DLFdBQUssT0FBTztBQUFBLElBQ2I7QUFFRCxRQUFJLFFBQVEsS0FBSyxTQUFTLFVBQVUsS0FBSyxTQUFTLFFBQVE7QUFDeEQsV0FBSyxTQUFTLEtBQUs7QUFDbkI7QUFBQSxJQUNEO0FBRUQsVUFBTSxNQUFNLEtBQUssSUFBSTtBQUNyQixTQUFLLFNBQVM7QUFDZCxTQUFLLE9BQU87QUFDWixXQUFPO0FBQ1AsV0FBTztBQUFBLEVBQ1g7QUFFRSxPQUFLLEVBQUUsTUFBTSxNQUFLLENBQUU7QUFFcEIsU0FBTyxRQUFRLFFBQVE7QUFDckIsWUFBUSxNQUFNLE1BQU0sU0FBUztBQUM3QixZQUFRLFFBQU87QUFNZixRQUFJLFVBQVUsaUNBQWlDLFVBQVUscUJBQXFCO0FBQzVFO0FBQUEsSUFDRDtBQU1ELFFBQUksVUFBVSxnQkFBZ0I7QUFDNUIsV0FBSyxFQUFFLE1BQU0sUUFBUSxRQUFRLFFBQVEsZUFBZSxRQUFRLE1BQU0sUUFBTyxFQUFJLENBQUE7QUFDN0U7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLDJCQUEyQjtBQUN2QyxXQUFLLEVBQUUsTUFBTSxRQUFRLE9BQU8sT0FBTyxNQUFLLENBQUU7QUFDMUM7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLDBCQUEwQjtBQUN0QztBQUdBLFVBQUk7QUFFSixhQUFPLFFBQVEsV0FBVyxPQUFPLFFBQVMsSUFBRztBQUMzQyxpQkFBUztBQUVULFlBQUksU0FBUywwQkFBMEI7QUFDckM7QUFDQTtBQUFBLFFBQ0Q7QUFFRCxZQUFJLFNBQVMsZ0JBQWdCO0FBQzNCLG1CQUFTLFFBQU87QUFDaEI7QUFBQSxRQUNEO0FBRUQsWUFBSSxTQUFTLDJCQUEyQjtBQUN0QztBQUVBLGNBQUksYUFBYSxHQUFHO0FBQ2xCO0FBQUEsVUFDRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBRUQsV0FBSyxFQUFFLE1BQU0sUUFBUSxNQUFPLENBQUE7QUFDNUI7QUFBQSxJQUNEO0FBTUQsUUFBSSxVQUFVLHVCQUF1QjtBQUNuQyxjQUFRLEtBQUssRUFBRSxNQUFNLFNBQVMsT0FBTyxDQUFFLEVBQUEsQ0FBRTtBQUN6QyxZQUFNLEtBQUssS0FBSztBQUNoQixXQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU8sQ0FBQTtBQUM1QjtBQUFBLElBQ0Q7QUFFRCxRQUFJLFVBQVUsd0JBQXdCO0FBQ3BDLFVBQUksTUFBTSxTQUFTLFNBQVM7QUFDMUIsYUFBSyxFQUFFLE1BQU0sUUFBUSxNQUFPLENBQUE7QUFDNUI7QUFBQSxNQUNEO0FBQ0QsY0FBUSxNQUFNO0FBQ2QsV0FBSyxFQUFFLE1BQU0sUUFBUSxNQUFPLENBQUE7QUFDNUIsY0FBUSxNQUFNLE1BQU0sU0FBUztBQUM3QjtBQUFBLElBQ0Q7QUFNRCxRQUFJLFVBQVUscUJBQXFCLFVBQVUscUJBQXFCLFVBQVUsZUFBZTtBQUN6RixVQUFJdkcsUUFBTztBQUNYLFVBQUk7QUFFSixVQUFJLFFBQVEsZUFBZSxNQUFNO0FBQy9CLGdCQUFRO0FBQUEsTUFDVDtBQUVELGFBQU8sUUFBUSxXQUFXLE9BQU8sUUFBUyxJQUFHO0FBQzNDLFlBQUksU0FBUyxnQkFBZ0I7QUFDM0IsbUJBQVMsT0FBTztBQUNoQjtBQUFBLFFBQ0Q7QUFFRCxZQUFJLFNBQVNBLE9BQU07QUFDakIsY0FBSSxRQUFRLGVBQWU7QUFBTSxxQkFBUztBQUMxQztBQUFBLFFBQ0Q7QUFFRCxpQkFBUztBQUFBLE1BQ1Y7QUFFRCxXQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU8sQ0FBQTtBQUM1QjtBQUFBLElBQ0Q7QUFNRCxRQUFJLFVBQVUsdUJBQXVCO0FBQ25DLE1BQUF1RztBQUVBLFVBQUksU0FBUyxLQUFLLFNBQVMsS0FBSyxNQUFNLE1BQU0sRUFBRSxNQUFNLE9BQU8sTUFBTSxXQUFXO0FBQzVFLFVBQUksUUFBUTtBQUFBLFFBQ1YsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFFBQ1A7QUFBQSxRQUNBLE9BQUFBO0FBQUEsUUFDQSxRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsUUFDUixPQUFPLENBQUU7QUFBQSxNQUNqQjtBQUVNLGNBQVEsS0FBSyxLQUFLO0FBQ2xCLFlBQU0sS0FBSyxLQUFLO0FBQ2hCLFdBQUssRUFBRSxNQUFNLFFBQVEsTUFBTyxDQUFBO0FBQzVCO0FBQUEsSUFDRDtBQU1ELFFBQUksVUFBVSx3QkFBd0I7QUFDcEMsVUFBSSxNQUFNLFNBQVMsU0FBUztBQUMxQixhQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU8sQ0FBQTtBQUM1QjtBQUFBLE1BQ0Q7QUFFRCxVQUFJLE9BQU87QUFDWCxjQUFRLE1BQU07QUFDZCxZQUFNLFFBQVE7QUFFZCxXQUFLLEVBQUUsTUFBTSxNQUFLLENBQUU7QUFDcEIsTUFBQUE7QUFFQSxjQUFRLE1BQU0sTUFBTSxTQUFTO0FBQzdCO0FBQUEsSUFDRDtBQU1ELFFBQUksVUFBVSxjQUFjQSxTQUFRLEdBQUc7QUFDckMsVUFBSSxNQUFNLFNBQVMsR0FBRztBQUNwQixjQUFNLFNBQVM7QUFDZixZQUFJdkcsUUFBTyxNQUFNLE1BQU0sTUFBSztBQUM1QixjQUFNLFFBQVEsQ0FBQ0EsT0FBTSxFQUFFLE1BQU0sUUFBUSxPQUFPMEMsWUFBVSxLQUFLLEVBQUMsQ0FBRTtBQUFBLE1BQy9EO0FBRUQsV0FBSyxFQUFFLE1BQU0sU0FBUyxNQUFPLENBQUE7QUFDN0IsWUFBTTtBQUNOO0FBQUEsSUFDRDtBQU1ELFFBQUksVUFBVSxZQUFZNkQsU0FBUSxLQUFLLE1BQU0sV0FBVyxHQUFHO0FBQ3pELFVBQUksV0FBVyxNQUFNO0FBRXJCLFVBQUlBLFdBQVUsS0FBSyxTQUFTLFdBQVcsR0FBRztBQUN4QyxhQUFLLEVBQUUsTUFBTSxRQUFRLE1BQU8sQ0FBQTtBQUM1QjtBQUFBLE1BQ0Q7QUFFRCxVQUFJLEtBQUssU0FBUyxPQUFPO0FBQ3ZCLGNBQU0sUUFBUTtBQUNkLGFBQUssU0FBUztBQUNkLGFBQUssT0FBTztBQUVaLFlBQUksTUFBTSxNQUFNLFdBQVcsS0FBSyxNQUFNLE1BQU0sV0FBVyxHQUFHO0FBQ3hELGdCQUFNLFVBQVU7QUFDaEIsZ0JBQU0sU0FBUztBQUNmLGVBQUssT0FBTztBQUNaO0FBQUEsUUFDRDtBQUVELGNBQU07QUFDTixjQUFNLE9BQU87QUFDYjtBQUFBLE1BQ0Q7QUFFRCxVQUFJLEtBQUssU0FBUyxTQUFTO0FBQ3pCLGlCQUFTLElBQUc7QUFFWixZQUFJLFNBQVMsU0FBUyxTQUFTLFNBQVM7QUFDeEMsZUFBTyxTQUFTLEtBQUssUUFBUTtBQUM3QixlQUFPO0FBQ1AsY0FBTTtBQUNOO0FBQUEsTUFDRDtBQUVELFdBQUssRUFBRSxNQUFNLE9BQU8sTUFBTyxDQUFBO0FBQzNCO0FBQUEsSUFDRDtBQU1ELFNBQUssRUFBRSxNQUFNLFFBQVEsTUFBTyxDQUFBO0FBQUEsRUFDN0I7QUFHRCxLQUFHO0FBQ0QsWUFBUSxNQUFNO0FBRWQsUUFBSSxNQUFNLFNBQVMsUUFBUTtBQUN6QixZQUFNLE1BQU0sUUFBUSxVQUFRO0FBQzFCLFlBQUksQ0FBQyxLQUFLLE9BQU87QUFDZixjQUFJLEtBQUssU0FBUztBQUFRLGlCQUFLLFNBQVM7QUFDeEMsY0FBSSxLQUFLLFNBQVM7QUFBUyxpQkFBSyxVQUFVO0FBQzFDLGNBQUksQ0FBQyxLQUFLO0FBQU8saUJBQUssT0FBTztBQUM3QixlQUFLLFVBQVU7QUFBQSxRQUNoQjtBQUFBLE1BQ1QsQ0FBTztBQUdELFVBQUksU0FBUyxNQUFNLE1BQU0sU0FBUztBQUNsQyxVQUFJa0IsU0FBUSxPQUFPLE1BQU0sUUFBUSxLQUFLO0FBRXRDLGFBQU8sTUFBTSxPQUFPQSxRQUFPLEdBQUcsR0FBRyxNQUFNLEtBQUs7QUFBQSxJQUM3QztBQUFBLEVBQ0wsU0FBVyxNQUFNLFNBQVM7QUFFeEIsT0FBSyxFQUFFLE1BQU0sTUFBSyxDQUFFO0FBQ3BCLFNBQU87QUFDVDtBQUVBLElBQUEsVUFBaUI3QztBQzFVakIsTUFBTWxDLGNBQVk3RTtBQUNsQixNQUFNLFVBQVVlO0FBQ2hCLE1BQU0sU0FBU0M7QUFDZixNQUFNK0YsVUFBUTlGO0FBZ0JkLE1BQU00RixXQUFTLENBQUMsT0FBTyxVQUFVLE9BQU87QUFDdEMsTUFBSWYsVUFBUyxDQUFBO0FBRWIsTUFBSSxNQUFNLFFBQVEsS0FBSyxHQUFHO0FBQ3hCLGFBQVMsV0FBVyxPQUFPO0FBQ3pCLFVBQUksU0FBU2UsU0FBTyxPQUFPLFNBQVMsT0FBTztBQUMzQyxVQUFJLE1BQU0sUUFBUSxNQUFNLEdBQUc7QUFDekIsUUFBQWYsUUFBTyxLQUFLLEdBQUcsTUFBTTtBQUFBLE1BQzdCLE9BQWE7QUFDTCxRQUFBQSxRQUFPLEtBQUssTUFBTTtBQUFBLE1BQ25CO0FBQUEsSUFDRjtBQUFBLEVBQ0wsT0FBUztBQUNMLElBQUFBLFVBQVMsQ0FBRSxFQUFDLE9BQU9lLFNBQU8sT0FBTyxPQUFPLE9BQU8sQ0FBQztBQUFBLEVBQ2pEO0FBRUQsTUFBSSxXQUFXLFFBQVEsV0FBVyxRQUFRLFFBQVEsWUFBWSxNQUFNO0FBQ2xFLElBQUFmLFVBQVMsQ0FBQyxHQUFHLElBQUksSUFBSUEsT0FBTSxDQUFDO0FBQUEsRUFDN0I7QUFDRCxTQUFPQTtBQUNUO0FBZ0JBZSxTQUFPLFFBQVEsQ0FBQyxPQUFPLFVBQVUsQ0FBRSxNQUFLRSxRQUFNLE9BQU8sT0FBTztBQWdCNURGLFNBQU8sWUFBWSxDQUFDLE9BQU8sVUFBVSxDQUFBLE1BQU87QUFDMUMsTUFBSSxPQUFPLFVBQVUsVUFBVTtBQUM3QixXQUFPaEMsWUFBVWdDLFNBQU8sTUFBTSxPQUFPLE9BQU8sR0FBRyxPQUFPO0FBQUEsRUFDdkQ7QUFDRCxTQUFPaEMsWUFBVSxPQUFPLE9BQU87QUFDakM7QUFpQkFnQyxTQUFPLFVBQVUsQ0FBQyxPQUFPLFVBQVUsQ0FBQSxNQUFPO0FBQ3hDLE1BQUksT0FBTyxVQUFVLFVBQVU7QUFDN0IsWUFBUUEsU0FBTyxNQUFNLE9BQU8sT0FBTztBQUFBLEVBQ3BDO0FBQ0QsU0FBTyxRQUFRLE9BQU8sT0FBTztBQUMvQjtBQW1CQUEsU0FBTyxTQUFTLENBQUMsT0FBTyxVQUFVLENBQUEsTUFBTztBQUN2QyxNQUFJLE9BQU8sVUFBVSxVQUFVO0FBQzdCLFlBQVFBLFNBQU8sTUFBTSxPQUFPLE9BQU87QUFBQSxFQUNwQztBQUVELE1BQUksU0FBUyxPQUFPLE9BQU8sT0FBTztBQUdsQyxNQUFJLFFBQVEsWUFBWSxNQUFNO0FBQzVCLGFBQVMsT0FBTyxPQUFPLE9BQU87QUFBQSxFQUMvQjtBQUdELE1BQUksUUFBUSxZQUFZLE1BQU07QUFDNUIsYUFBUyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQztBQUFBLEVBQzdCO0FBRUQsU0FBTztBQUNUO0FBa0JBQSxTQUFPLFNBQVMsQ0FBQyxPQUFPLFVBQVUsQ0FBQSxNQUFPO0FBQ3ZDLE1BQUksVUFBVSxNQUFNLE1BQU0sU0FBUyxHQUFHO0FBQ3BDLFdBQU8sQ0FBQyxLQUFLO0FBQUEsRUFDZDtBQUVGLFNBQU8sUUFBUSxXQUFXLE9BQ3JCQSxTQUFPLFFBQVEsT0FBTyxPQUFPLElBQzdCQSxTQUFPLE9BQU8sT0FBTyxPQUFPO0FBQ2xDO0FBTUEsSUFBQSxXQUFpQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pLakIsSUFBQWdELHFCQUFpQjtBQ0NqQixNQUFNLE9BQU83SixvQkFBQUE7QUFDYixNQUFNLG1CQUFtQmU7QUFFekIsTUFBTSxhQUFhLElBQUksSUFBSSxnQkFBZ0I7SUFFM0MrSSxpQkFBaUIsY0FBWSxXQUFXLElBQUksS0FBSyxRQUFRLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxZQUFXLENBQUU7OztBQ0p6RixRQUFNLEVBQUMsSUFBRyxJQUFJOUo7QUFDZCxRQUFNLEVBQUMsVUFBQStKLFVBQVEsSUFBSTtBQUVuQixVQUFBLFNBQWlCO0FBQ2pCLFVBQUEsV0FBbUI7QUFDbkIsVUFBQSxTQUFpQjtBQUNqQixVQUFBLFlBQW9CO0FBQ3BCLFVBQUEsYUFBcUI7QUFDckIsVUFBQSxZQUFvQjtBQUNwQixVQUFBLGdCQUF3QjtBQUN4QixVQUFBLFNBQWlCO0FBQ2pCLFVBQUEsV0FBbUI7QUFFbkIsVUFBQSxXQUFtQjtBQUNuQixVQUFBLFVBQWtCO0FBQ2xCLFVBQUEsWUFBb0I7QUFFcEIsVUFBQSxrQkFBMEI7QUFDMUIsVUFBQSxtQkFBMkI7QUFDM0IsVUFBQSxrQkFBMEI7QUFDMUIsVUFBQSxnQkFBd0I7QUFDeEIsVUFBQSxpQkFBeUI7QUFDekIsVUFBQSxrQkFBMEI7QUFDMUIsVUFBQSxvQkFBNEI7QUFDNUIsVUFBQSx5QkFBaUM7QUFDakMsVUFBQSx1QkFBK0I7QUFFL0IsVUFBQSxnQkFBd0I7QUFDeEIsVUFBQSxVQUFrQjtBQUNsQixVQUFBLFVBQWtCO0FBQ2xCLFVBQUEsZUFBdUIsQ0FBQyxRQUFRLGVBQWUsUUFBUSxTQUFTLFFBQVEsT0FBTztBQUUvRSxVQUFBLFlBQW9CLElBQUk7QUFFeEIsVUFBQSxnQkFBd0I7QUFDeEIsVUFBQSxrQkFBMEI7QUFDMUIsVUFBQSx5QkFBaUM7QUFDakMsVUFBQSxTQUFpQjtBQUNqQixVQUFBLGNBQXNCO0FBRXRCLFVBQUEsUUFBZ0I7QUFDaEIsVUFBQSxjQUFzQjtBQUN0QixVQUFBLGNBQXNCO0FBQ3RCLFVBQUEsT0FBZTtBQUNmLFVBQUEsVUFBa0I7QUFDbEIsVUFBQSxXQUFtQjtBQUNuQixVQUFBLE9BQWU7QUFDZixVQUFBLFdBQW1CO0FBQ25CLFVBQUEsZ0JBQXdCO0FBQ3hCLFVBQUEsaUJBQXlCO0FBQ3pCLFVBQUEsYUFBcUI7QUFDckIsVUFBQSxnQkFBd0IsRUFBQyxLQUFLLEtBQUk7QUFDbEMsVUFBQSxjQUFzQjtBQUN0QixVQUFBLGdCQUF3QjtBQUN4QixVQUFBLFlBQW9CO0FBQ3BCLFVBQW1CLFdBQUEsTUFBTTtBQUFBO0FBQ3pCLFVBQXNCLGNBQUEsU0FBTztBQUU3QixVQUFvQixZQUFBQSxjQUFhO0FBQ2pDLFVBQWtCLFVBQUFBLGNBQWE7QUFDL0IsVUFBa0IsVUFBQUEsY0FBYTs7QUM1RC9CLE1BQU01SixPQUFLSCxzQkFBQUE7QUFDWCxNQUFNcUksWUFBVXRILG9CQUFBQTtBQUNoQixNQUFNLEVBQUV1SCxXQUFBQSxZQUFXLElBQUd0SDtBQUN0QixNQUFNLGVBQWVDO0FBQ3JCLE1BQU07QUFBQSxFQUNOLFdBQUU0QztBQUFBQSxFQUNBO0FBQUEsRUFDRixVQUFFbUc7QUFBQUEsRUFDRixXQUFFQztBQUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDRixXQUFFQztBQUFBQSxFQUNGLFFBQUVDO0FBQUFBLEVBQ0YsWUFBRUM7QUFBQUEsRUFDRixVQUFFQztBQUFBQSxFQUNGLFVBQUVDO0FBQUFBLEVBQ0YsU0FBRUM7QUFBQUEsRUFDRixhQUFFQztBQUFBQSxFQUNBO0FBQ0YsSUFBSXJKO0FBRUosTUFBTSxzQkFBc0I7QUFFNUIsTUFBTSxPQUFPbUgsWUFBVW5JLEtBQUcsSUFBSTtBQUM5QixNQUFNdUMsU0FBTzRGLFlBQVVuSSxLQUFHLElBQUk7QUFDOUIsTUFBTW9JLFVBQVFELFlBQVVuSSxLQUFHLEtBQUs7QUFDaEMsTUFBTSxRQUFRbUksWUFBVW5JLEtBQUcsS0FBSztBQUNoQyxNQUFNLGFBQWFtSSxZQUFVbkksS0FBRyxRQUFRO0FBRXhDLE1BQU1zSyxnQkFBYyxFQUFBLE9BQUVsQyxTQUFPN0YsTUFBQUE7QUFHN0IsTUFBTSxVQUFVLENBQUMsS0FBSyxPQUFPO0FBQzNCLE1BQUksZUFBZSxLQUFLO0FBQ3RCLFFBQUksUUFBUSxFQUFFO0FBQUEsRUFDbEIsT0FBUztBQUNMLE9BQUcsR0FBRztBQUFBLEVBQ1A7QUFDSDtBQUVBLE1BQU0sZ0JBQWdCLENBQUMsTUFBTSxNQUFNLFNBQVM7QUFDMUMsTUFBSSxZQUFZLEtBQUs7QUFDckIsTUFBSSxFQUFFLHFCQUFxQixNQUFNO0FBQy9CLFNBQUssUUFBUSxZQUFZLG9CQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7QUFBQSxFQUM3QztBQUNELFlBQVUsSUFBSSxJQUFJO0FBQ3BCO0FBRUEsTUFBTSxZQUFZLFVBQVEsU0FBTztBQUMvQixRQUFNLE1BQU0sS0FBSztBQUNqQixNQUFJLGVBQWUsS0FBSztBQUN0QixRQUFJLE1BQUs7QUFBQSxFQUNiLE9BQVM7QUFDTCxXQUFPLEtBQUs7QUFBQSxFQUNiO0FBQ0g7QUFFQSxNQUFNLGFBQWEsQ0FBQyxNQUFNLE1BQU0sU0FBUztBQUN2QyxRQUFNLFlBQVksS0FBSztBQUN2QixNQUFJLHFCQUFxQixLQUFLO0FBQzVCLGNBQVUsT0FBTyxJQUFJO0FBQUEsRUFDekIsV0FBYSxjQUFjLE1BQU07QUFDN0IsV0FBTyxLQUFLO0FBQUEsRUFDYjtBQUNIO0FBRUEsTUFBTSxhQUFhLENBQUMsUUFBUSxlQUFlLE1BQU0sSUFBSSxTQUFTLElBQUksQ0FBQztBQXVCbkUsTUFBTSxtQkFBbUIsb0JBQUk7QUFXN0IsU0FBUyxzQkFBc0J0QyxPQUFNLFNBQVMsVUFBVSxZQUFZLFNBQVM7QUFDM0UsUUFBTSxjQUFjLENBQUMsVUFBVSxXQUFXO0FBQ3hDLGFBQVNBLEtBQUk7QUFDYixZQUFRLFVBQVUsUUFBUSxFQUFDLGFBQWFBLE1BQUksQ0FBQztBQUk3QyxRQUFJLFVBQVVBLFVBQVMsUUFBUTtBQUM3QjtBQUFBLFFBQ0VpSSxVQUFRLFFBQVFqSSxPQUFNLE1BQU07QUFBQSxRQUFHO0FBQUEsUUFBZWlJLFVBQVEsS0FBS2pJLE9BQU0sTUFBTTtBQUFBLE1BQy9FO0FBQUEsSUFDSztBQUFBLEVBQ0w7QUFDRSxNQUFJO0FBQ0YsV0FBT0QsS0FBRyxNQUFNQyxPQUFNLFNBQVMsV0FBVztBQUFBLEVBQzNDLFNBQVEsT0FBUDtBQUNBLGVBQVcsS0FBSztBQUFBLEVBQ2pCO0FBQ0g7QUFVQSxNQUFNLG1CQUFtQixDQUFDLFVBQVUsTUFBTSxNQUFNLE1BQU0sU0FBUztBQUM3RCxRQUFNLE9BQU8saUJBQWlCLElBQUksUUFBUTtBQUMxQyxNQUFJLENBQUM7QUFBTTtBQUNYLFVBQVEsS0FBSyxPQUFPLENBQUMsYUFBYTtBQUNoQyxhQUFTLE1BQU0sTUFBTSxJQUFJO0FBQUEsRUFDN0IsQ0FBRztBQUNIO0FBVUEsTUFBTSxxQkFBcUIsQ0FBQ0EsT0FBTSxVQUFVLFNBQVMsYUFBYTtBQUNoRSxRQUFNLEVBQUMsVUFBVSxZQUFZLFdBQVUsSUFBSTtBQUMzQyxNQUFJLE9BQU8saUJBQWlCLElBQUksUUFBUTtBQUd4QyxNQUFJO0FBQ0osTUFBSSxDQUFDLFFBQVEsWUFBWTtBQUN2QixjQUFVO0FBQUEsTUFDUkE7QUFBQSxNQUFNO0FBQUEsTUFBUztBQUFBLE1BQVU7QUFBQSxNQUFZO0FBQUEsSUFDM0M7QUFDSSxXQUFPLFFBQVEsTUFBTSxLQUFLLE9BQU87QUFBQSxFQUNsQztBQUNELE1BQUksTUFBTTtBQUNSLGtCQUFjLE1BQU0sZUFBZSxRQUFRO0FBQzNDLGtCQUFjLE1BQU0sU0FBUyxVQUFVO0FBQ3ZDLGtCQUFjLE1BQU0sU0FBUyxVQUFVO0FBQUEsRUFDM0MsT0FBUztBQUNMLGNBQVU7QUFBQSxNQUNSQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLGlCQUFpQixLQUFLLE1BQU0sVUFBVSxhQUFhO0FBQUEsTUFDbkQ7QUFBQSxNQUNBLGlCQUFpQixLQUFLLE1BQU0sVUFBVSxPQUFPO0FBQUEsSUFDbkQ7QUFDSSxRQUFJLENBQUM7QUFBUztBQUNkLFlBQVEsR0FBR2lLLFlBQVUsT0FBTyxVQUFVO0FBQ3BDLFlBQU0sZUFBZSxpQkFBaUIsS0FBSyxNQUFNLFVBQVUsT0FBTztBQUNsRSxXQUFLLGtCQUFrQjtBQUV2QixVQUFJeEcsZUFBYSxNQUFNLFNBQVMsU0FBUztBQUN2QyxZQUFJO0FBQ0YsZ0JBQU0sS0FBSyxNQUFNLEtBQUt6RCxPQUFNLEdBQUc7QUFDL0IsZ0JBQU0sTUFBTSxFQUFFO0FBQ2QsdUJBQWEsS0FBSztBQUFBLFFBQzVCLFNBQWlCLEtBQVA7QUFBQSxRQUFjO0FBQUEsTUFDeEIsT0FBYTtBQUNMLHFCQUFhLEtBQUs7QUFBQSxNQUNuQjtBQUFBLElBQ1AsQ0FBSztBQUNELFdBQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxNQUNYLGFBQWE7QUFBQSxNQUNiLGFBQWE7QUFBQSxNQUNiO0FBQUEsSUFDTjtBQUNJLHFCQUFpQixJQUFJLFVBQVUsSUFBSTtBQUFBLEVBQ3BDO0FBS0QsU0FBTyxNQUFNO0FBQ1gsZUFBVyxNQUFNLGVBQWUsUUFBUTtBQUN4QyxlQUFXLE1BQU0sU0FBUyxVQUFVO0FBQ3BDLGVBQVcsTUFBTSxTQUFTLFVBQVU7QUFDcEMsUUFBSSxXQUFXLEtBQUssU0FBUyxHQUFHO0FBRzlCLFdBQUssUUFBUTtBQUViLHVCQUFpQixPQUFPLFFBQVE7QUFDaEMsbUJBQWEsUUFBUSxVQUFVLElBQUksQ0FBQztBQUNwQyxXQUFLLFVBQVU7QUFDZixhQUFPLE9BQU8sSUFBSTtBQUFBLElBQ25CO0FBQUEsRUFDTDtBQUNBO0FBTUEsTUFBTSx1QkFBdUIsb0JBQUk7QUFXakMsTUFBTSx5QkFBeUIsQ0FBQ0EsT0FBTSxVQUFVLFNBQVMsYUFBYTtBQUNwRSxRQUFNLEVBQUMsVUFBVSxXQUFVLElBQUk7QUFDL0IsTUFBSSxPQUFPLHFCQUFxQixJQUFJLFFBQVE7QUFNNUMsUUFBTSxRQUFRLFFBQVEsS0FBSztBQUMzQixNQUFJLFVBQVUsTUFBTSxhQUFhLFFBQVEsY0FBYyxNQUFNLFdBQVcsUUFBUSxXQUFXO0FBSzdFLFNBQUs7QUFDSCxTQUFLO0FBQ25CRCxTQUFHLFlBQVksUUFBUTtBQUN2QixXQUFPO0FBQUEsRUFDUjtBQUlELE1BQUksTUFBTTtBQUNSLGtCQUFjLE1BQU0sZUFBZSxRQUFRO0FBQzNDLGtCQUFjLE1BQU0sU0FBUyxVQUFVO0FBQUEsRUFDM0MsT0FBUztBQUlMLFdBQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxNQUNYLGFBQWE7QUFBQSxNQUNiO0FBQUEsTUFDQSxTQUFTQSxLQUFHLFVBQVUsVUFBVSxTQUFTLENBQUMsTUFBTSxTQUFTO0FBQ3ZELGdCQUFRLEtBQUssYUFBYSxDQUFDdUssZ0JBQWU7QUFDeEMsVUFBQUEsWUFBV1IsYUFBVyxVQUFVLEVBQUMsTUFBTSxLQUFJLENBQUM7QUFBQSxRQUN0RCxDQUFTO0FBQ0QsY0FBTSxZQUFZLEtBQUs7QUFDdkIsWUFBSSxLQUFLLFNBQVMsS0FBSyxRQUFRLFlBQVksS0FBSyxXQUFXLGNBQWMsR0FBRztBQUMxRSxrQkFBUSxLQUFLLFdBQVcsQ0FBQ1MsY0FBYUEsVUFBU3ZLLE9BQU0sSUFBSSxDQUFDO0FBQUEsUUFDM0Q7QUFBQSxNQUNULENBQU87QUFBQSxJQUNQO0FBQ0kseUJBQXFCLElBQUksVUFBVSxJQUFJO0FBQUEsRUFDeEM7QUFLRCxTQUFPLE1BQU07QUFDWCxlQUFXLE1BQU0sZUFBZSxRQUFRO0FBQ3hDLGVBQVcsTUFBTSxTQUFTLFVBQVU7QUFDcEMsUUFBSSxXQUFXLEtBQUssU0FBUyxHQUFHO0FBQzlCLDJCQUFxQixPQUFPLFFBQVE7QUFDcENELFdBQUcsWUFBWSxRQUFRO0FBQ3ZCLFdBQUssVUFBVSxLQUFLLFVBQVU7QUFDOUIsYUFBTyxPQUFPLElBQUk7QUFBQSxJQUNuQjtBQUFBLEVBQ0w7QUFDQTtBQUtBLE1BQU15SyxnQkFBYztBQUFBLEVBS3BCLFlBQVksS0FBSztBQUNmLFNBQUssTUFBTTtBQUNYLFNBQUssb0JBQW9CLENBQUMsVUFBVSxJQUFJLGFBQWEsS0FBSztBQUFBLEVBQzVEO0FBQUEsRUFRQSxpQkFBaUJ4SyxPQUFNLFVBQVU7QUFDL0IsVUFBTSxPQUFPLEtBQUssSUFBSTtBQUN0QixVQUFNLFlBQVlpSSxVQUFRLFFBQVFqSSxLQUFJO0FBQ3RDLFVBQU0sV0FBV2lJLFVBQVEsU0FBU2pJLEtBQUk7QUFDdEMsVUFBTSxTQUFTLEtBQUssSUFBSSxlQUFlLFNBQVM7QUFDaEQsV0FBTyxJQUFJLFFBQVE7QUFDbkIsVUFBTSxlQUFlaUksVUFBUSxRQUFRakksS0FBSTtBQUN6QyxVQUFNLFVBQVUsRUFBQyxZQUFZLEtBQUssV0FBVTtBQUM1QyxRQUFJLENBQUM7QUFBVSxpQkFBVzRKO0FBRTFCLFFBQUk7QUFDSixRQUFJLEtBQUssWUFBWTtBQUNuQixjQUFRLFdBQVcsS0FBSyx3QkFBd0IsYUFBYSxRQUFRLElBQ25FLEtBQUssaUJBQWlCLEtBQUs7QUFDN0IsZUFBUyx1QkFBdUI1SixPQUFNLGNBQWMsU0FBUztBQUFBLFFBQzNEO0FBQUEsUUFDQSxZQUFZLEtBQUssSUFBSTtBQUFBLE1BQzNCLENBQUs7QUFBQSxJQUNMLE9BQVM7QUFDTCxlQUFTLG1CQUFtQkEsT0FBTSxjQUFjLFNBQVM7QUFBQSxRQUN2RDtBQUFBLFFBQ0EsWUFBWSxLQUFLO0FBQUEsUUFDakIsWUFBWSxLQUFLLElBQUk7QUFBQSxNQUMzQixDQUFLO0FBQUEsSUFDRjtBQUNELFdBQU87QUFBQSxFQUNUO0FBQUEsRUFTQSxZQUFZOEQsT0FBTSxPQUFPLFlBQVk7QUFDbkMsUUFBSSxLQUFLLElBQUksUUFBUTtBQUNuQjtBQUFBLElBQ0Q7QUFDRCxVQUFNLFVBQVVtRSxVQUFRLFFBQVFuRSxLQUFJO0FBQ3BDLFVBQU0sV0FBV21FLFVBQVEsU0FBU25FLEtBQUk7QUFDdEMsVUFBTSxTQUFTLEtBQUssSUFBSSxlQUFlLE9BQU87QUFFOUMsUUFBSSxZQUFZO0FBR2hCLFFBQUksT0FBTyxJQUFJLFFBQVE7QUFBRztBQUUxQixVQUFNLFdBQVcsT0FBTzlELE9BQU0sYUFBYTtBQUN6QyxVQUFJLENBQUMsS0FBSyxJQUFJLFVBQVUscUJBQXFCOEQsT0FBTSxDQUFDO0FBQUc7QUFDdkQsVUFBSSxDQUFDLFlBQVksU0FBUyxZQUFZLEdBQUc7QUFDdkMsWUFBSTtBQUNGLGdCQUFNMkcsWUFBVyxNQUFNbkksT0FBS3dCLEtBQUk7QUFDaEMsY0FBSSxLQUFLLElBQUk7QUFBUTtBQUVyQixnQkFBTSxLQUFLMkcsVUFBUztBQUNwQixnQkFBTSxLQUFLQSxVQUFTO0FBQ3BCLGNBQUksQ0FBQyxNQUFNLE1BQU0sTUFBTSxPQUFPLFVBQVUsU0FBUztBQUMvQyxpQkFBSyxJQUFJLE1BQU1YLGFBQVdoRyxPQUFNMkcsU0FBUTtBQUFBLFVBQ3pDO0FBQ0QsY0FBSSxXQUFXLFVBQVUsUUFBUUEsVUFBUyxLQUFLO0FBQzdDLGlCQUFLLElBQUksV0FBV3pLLEtBQUk7QUFDeEIsd0JBQVl5SztBQUNaLGlCQUFLLElBQUksZUFBZXpLLE9BQU0sS0FBSyxpQkFBaUI4RCxPQUFNLFFBQVEsQ0FBQztBQUFBLFVBQzdFLE9BQWU7QUFDTCx3QkFBWTJHO0FBQUEsVUFDYjtBQUFBLFFBQ0YsU0FBUSxPQUFQO0FBRUEsZUFBSyxJQUFJLFFBQVEsU0FBUyxRQUFRO0FBQUEsUUFDbkM7QUFBQSxNQUVGLFdBQVUsT0FBTyxJQUFJLFFBQVEsR0FBRztBQUUvQixjQUFNLEtBQUssU0FBUztBQUNwQixjQUFNLEtBQUssU0FBUztBQUNwQixZQUFJLENBQUMsTUFBTSxNQUFNLE1BQU0sT0FBTyxVQUFVLFNBQVM7QUFDL0MsZUFBSyxJQUFJLE1BQU1YLGFBQVdoRyxPQUFNLFFBQVE7QUFBQSxRQUN6QztBQUNELG9CQUFZO0FBQUEsTUFDYjtBQUFBLElBQ0Y7QUFFRCxVQUFNLFNBQVMsS0FBSyxpQkFBaUJBLE9BQU0sUUFBUTtBQUduRCxRQUFJLEVBQUUsY0FBYyxLQUFLLElBQUksUUFBUSxrQkFBa0IsS0FBSyxJQUFJLGFBQWFBLEtBQUksR0FBRztBQUNsRixVQUFJLENBQUMsS0FBSyxJQUFJLFVBQVVpRyxVQUFRakcsT0FBTSxDQUFDO0FBQUc7QUFDMUMsV0FBSyxJQUFJLE1BQU1pRyxVQUFRakcsT0FBTSxLQUFLO0FBQUEsSUFDbkM7QUFFRCxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBVUEsTUFBTSxlQUFlLE9BQU8sV0FBVzlELE9BQU0sTUFBTTtBQUNqRCxRQUFJLEtBQUssSUFBSSxRQUFRO0FBQ25CO0FBQUEsSUFDRDtBQUNELFVBQU0sT0FBTyxNQUFNO0FBQ25CLFVBQU0sTUFBTSxLQUFLLElBQUksZUFBZSxTQUFTO0FBRTdDLFFBQUksQ0FBQyxLQUFLLElBQUksUUFBUSxnQkFBZ0I7QUFFcEMsV0FBSyxJQUFJO0FBQ1QsWUFBTSxXQUFXLE1BQU0sV0FBV0EsS0FBSTtBQUN0QyxVQUFJLEtBQUssSUFBSTtBQUFRO0FBQ3JCLFVBQUksSUFBSSxJQUFJLElBQUksR0FBRztBQUNqQixZQUFJLEtBQUssSUFBSSxjQUFjLElBQUksSUFBSSxNQUFNLFVBQVU7QUFDakQsZUFBSyxJQUFJLGNBQWMsSUFBSSxNQUFNLFFBQVE7QUFDekMsZUFBSyxJQUFJLE1BQU04SixhQUFXOUosT0FBTSxNQUFNLEtBQUs7QUFBQSxRQUM1QztBQUFBLE1BQ1AsT0FBVztBQUNMLFlBQUksSUFBSSxJQUFJO0FBQ1osYUFBSyxJQUFJLGNBQWMsSUFBSSxNQUFNLFFBQVE7QUFDekMsYUFBSyxJQUFJLE1BQU0rSixVQUFRL0osT0FBTSxNQUFNLEtBQUs7QUFBQSxNQUN6QztBQUNELFdBQUssSUFBSTtBQUNULGFBQU87QUFBQSxJQUNSO0FBR0QsUUFBSSxLQUFLLElBQUksY0FBYyxJQUFJLElBQUksR0FBRztBQUNwQyxhQUFPO0FBQUEsSUFDUjtBQUVELFNBQUssSUFBSSxjQUFjLElBQUksTUFBTSxJQUFJO0FBQUEsRUFDdkM7QUFBQSxFQUVBLFlBQVksV0FBVyxZQUFZLElBQUksUUFBUSxLQUFLc0ksUUFBTyxXQUFXO0FBRXBFLGdCQUFZTCxVQUFRLEtBQUssV0FBVzRCLFdBQVM7QUFFN0MsUUFBSSxDQUFDLEdBQUcsU0FBUztBQUNmLGtCQUFZLEtBQUssSUFBSSxVQUFVLFdBQVcsV0FBVyxHQUFJO0FBQ3pELFVBQUksQ0FBQztBQUFXO0FBQUEsSUFDakI7QUFFRCxVQUFNLFdBQVcsS0FBSyxJQUFJLGVBQWUsR0FBRyxJQUFJO0FBQ2hELFVBQU0sVUFBVSxvQkFBSTtBQUVwQixRQUFJLFNBQVMsS0FBSyxJQUFJLFVBQVUsV0FBVztBQUFBLE1BQ3pDLFlBQVksV0FBUyxHQUFHLFdBQVcsS0FBSztBQUFBLE1BQ3hDLGlCQUFpQixXQUFTLEdBQUcsVUFBVSxLQUFLO0FBQUEsTUFDNUMsT0FBTztBQUFBLElBQ1IsQ0FBQSxFQUFFLEdBQUdLLFlBQVUsT0FBTyxVQUFVO0FBQy9CLFVBQUksS0FBSyxJQUFJLFFBQVE7QUFDbkIsaUJBQVM7QUFDVDtBQUFBLE1BQ0Q7QUFDRCxZQUFNLE9BQU8sTUFBTTtBQUNuQixVQUFJbEssUUFBT2lJLFVBQVEsS0FBSyxXQUFXLElBQUk7QUFDdkMsY0FBUSxJQUFJLElBQUk7QUFFaEIsVUFBSSxNQUFNLE1BQU0sZUFBYyxLQUFNLE1BQU0sS0FBSyxlQUFlLE9BQU8sV0FBV2pJLE9BQU0sSUFBSSxHQUFHO0FBQzNGO0FBQUEsTUFDRDtBQUVELFVBQUksS0FBSyxJQUFJLFFBQVE7QUFDbkIsaUJBQVM7QUFDVDtBQUFBLE1BQ0Q7QUFJRCxVQUFJLFNBQVMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksSUFBSSxHQUFHO0FBQ3JELGFBQUssSUFBSTtBQUdULFFBQUFBLFFBQU9pSSxVQUFRLEtBQUssS0FBS0EsVUFBUSxTQUFTLEtBQUtqSSxLQUFJLENBQUM7QUFFcEQsYUFBSyxhQUFhQSxPQUFNLFlBQVksSUFBSXNJLFNBQVEsQ0FBQztBQUFBLE1BQ2xEO0FBQUEsSUFDRixDQUFBLEVBQUUsR0FBRzJCLFlBQVUsS0FBSyxpQkFBaUI7QUFFdEMsV0FBTyxJQUFJO0FBQUEsTUFBUSxhQUNqQixPQUFPLEtBQUtFLFdBQVMsTUFBTTtBQUN6QixZQUFJLEtBQUssSUFBSSxRQUFRO0FBQ25CLG1CQUFTO0FBQ1Q7QUFBQSxRQUNEO0FBQ0QsY0FBTSxlQUFlLFlBQVksVUFBVSxNQUFLLElBQUs7QUFFckQ7QUFLQSxpQkFBUyxZQUFXLEVBQUcsT0FBTyxDQUFDLFNBQVM7QUFDdEMsaUJBQU8sU0FBUyxhQUNkLENBQUMsUUFBUSxJQUFJLElBQUksTUFJaEIsQ0FBQyxHQUFHLFdBQVcsR0FBRyxXQUFXO0FBQUEsWUFDNUIsVUFBVWxDLFVBQVEsUUFBUSxXQUFXLElBQUk7QUFBQSxVQUMxQyxDQUFBO0FBQUEsUUFDWCxDQUFPLEVBQUUsUUFBUSxDQUFDLFNBQVM7QUFDbkIsZUFBSyxJQUFJLFFBQVEsV0FBVyxJQUFJO0FBQUEsUUFDeEMsQ0FBTztBQUVELGlCQUFTO0FBR1QsWUFBSTtBQUFjLGVBQUssWUFBWSxXQUFXLE9BQU8sSUFBSSxRQUFRLEtBQUtLLFFBQU8sU0FBUztBQUFBLE1BQzVGLENBQUs7QUFBQSxJQUNMO0FBQUEsRUFDQTtBQUFBLEVBYUEsTUFBTSxXQUFXLEtBQUssT0FBTyxZQUFZQSxRQUFPLFFBQVEsSUFBSUYsV0FBVTtBQUNwRSxVQUFNLFlBQVksS0FBSyxJQUFJLGVBQWVILFVBQVEsUUFBUSxHQUFHLENBQUM7QUFDOUQsVUFBTSxVQUFVLFVBQVUsSUFBSUEsVUFBUSxTQUFTLEdBQUcsQ0FBQztBQUNuRCxRQUFJLEVBQUUsY0FBYyxLQUFLLElBQUksUUFBUSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsU0FBUztBQUMxRSxVQUFJLENBQUMsR0FBRyxXQUFXLEdBQUcsV0FBVyxHQUFHO0FBQUcsYUFBSyxJQUFJLE1BQU0rQixjQUFZLEtBQUssS0FBSztBQUFBLElBQzdFO0FBR0QsY0FBVSxJQUFJL0IsVUFBUSxTQUFTLEdBQUcsQ0FBQztBQUNuQyxTQUFLLElBQUksZUFBZSxHQUFHO0FBQzNCLFFBQUk7QUFDSixRQUFJO0FBRUosVUFBTSxTQUFTLEtBQUssSUFBSSxRQUFRO0FBQ2hDLFNBQUssVUFBVSxRQUFRSyxVQUFTLFdBQVcsQ0FBQyxLQUFLLElBQUksY0FBYyxJQUFJRixTQUFRLEdBQUc7QUFDaEYsVUFBSSxDQUFDLFFBQVE7QUFDWCxjQUFNLEtBQUssWUFBWSxLQUFLLFlBQVksSUFBSSxRQUFRLEtBQUtFLFFBQU8sU0FBUztBQUN6RSxZQUFJLEtBQUssSUFBSTtBQUFRO0FBQUEsTUFDdEI7QUFFRCxlQUFTLEtBQUssaUJBQWlCLEtBQUssQ0FBQyxTQUFTb0MsV0FBVTtBQUV0RCxZQUFJQSxVQUFTQSxPQUFNLFlBQVk7QUFBRztBQUVsQyxhQUFLLFlBQVksU0FBUyxPQUFPLElBQUksUUFBUSxLQUFLcEMsUUFBTyxTQUFTO0FBQUEsTUFDeEUsQ0FBSztBQUFBLElBQ0Y7QUFDRCxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBWUEsTUFBTSxhQUFhdEksT0FBTSxZQUFZLFNBQVNzSSxRQUFPLFFBQVE7QUFDM0QsVUFBTSxRQUFRLEtBQUssSUFBSTtBQUN2QixRQUFJLEtBQUssSUFBSSxXQUFXdEksS0FBSSxLQUFLLEtBQUssSUFBSSxRQUFRO0FBQ2hEO0FBQ0EsYUFBTztBQUFBLElBQ1I7QUFFRCxVQUFNLEtBQUssS0FBSyxJQUFJLGlCQUFpQkEsT0FBTXNJLE1BQUs7QUFDaEQsUUFBSSxDQUFDLEdBQUcsV0FBVyxTQUFTO0FBQzFCLFNBQUcsVUFBVSxRQUFRO0FBQ3JCLFNBQUcsYUFBYSxRQUFRO0FBQ3hCLFNBQUcsYUFBYSxXQUFTLFFBQVEsV0FBVyxLQUFLO0FBQ2pELFNBQUcsWUFBWSxXQUFTLFFBQVEsVUFBVSxLQUFLO0FBQUEsSUFDaEQ7QUFHRCxRQUFJO0FBQ0YsWUFBTSxRQUFRLE1BQU0rQixjQUFZLEdBQUcsWUFBWSxHQUFHLFNBQVM7QUFDM0QsVUFBSSxLQUFLLElBQUk7QUFBUTtBQUNyQixVQUFJLEtBQUssSUFBSSxXQUFXLEdBQUcsV0FBVyxLQUFLLEdBQUc7QUFDNUM7QUFDQSxlQUFPO0FBQUEsTUFDUjtBQUVELFlBQU0sU0FBUyxLQUFLLElBQUksUUFBUSxrQkFBa0IsQ0FBQ3JLLE1BQUssU0FBUyxJQUFJLEtBQUssQ0FBQ0EsTUFBSyxTQUFTb0ssYUFBVztBQUNwRyxVQUFJO0FBQ0osVUFBSSxNQUFNLGVBQWU7QUFDdkIsY0FBTSxVQUFVbkMsVUFBUSxRQUFRakksS0FBSTtBQUNwQyxjQUFNLGFBQWEsU0FBUyxNQUFNLFdBQVdBLEtBQUksSUFBSUE7QUFDckQsWUFBSSxLQUFLLElBQUk7QUFBUTtBQUNyQixpQkFBUyxNQUFNLEtBQUssV0FBVyxHQUFHLFdBQVcsT0FBTyxZQUFZc0ksUUFBTyxRQUFRLElBQUksVUFBVTtBQUM3RixZQUFJLEtBQUssSUFBSTtBQUFRO0FBRXJCLFlBQUksWUFBWSxjQUFjLGVBQWUsUUFBVztBQUN0RCxlQUFLLElBQUksY0FBYyxJQUFJLFNBQVMsVUFBVTtBQUFBLFFBQy9DO0FBQUEsTUFDUCxXQUFlLE1BQU0sa0JBQWtCO0FBQ2pDLGNBQU0sYUFBYSxTQUFTLE1BQU0sV0FBV3RJLEtBQUksSUFBSUE7QUFDckQsWUFBSSxLQUFLLElBQUk7QUFBUTtBQUNyQixjQUFNLFNBQVNpSSxVQUFRLFFBQVEsR0FBRyxTQUFTO0FBQzNDLGFBQUssSUFBSSxlQUFlLE1BQU0sRUFBRSxJQUFJLEdBQUcsU0FBUztBQUNoRCxhQUFLLElBQUksTUFBTThCLFVBQVEsR0FBRyxXQUFXLEtBQUs7QUFDMUMsaUJBQVMsTUFBTSxLQUFLLFdBQVcsUUFBUSxPQUFPLFlBQVl6QixRQUFPdEksT0FBTSxJQUFJLFVBQVU7QUFDckYsWUFBSSxLQUFLLElBQUk7QUFBUTtBQUdyQixZQUFJLGVBQWUsUUFBVztBQUM1QixlQUFLLElBQUksY0FBYyxJQUFJaUksVUFBUSxRQUFRakksS0FBSSxHQUFHLFVBQVU7QUFBQSxRQUM3RDtBQUFBLE1BQ1AsT0FBVztBQUNMLGlCQUFTLEtBQUssWUFBWSxHQUFHLFdBQVcsT0FBTyxVQUFVO0FBQUEsTUFDMUQ7QUFDRDtBQUVBLFdBQUssSUFBSSxlQUFlQSxPQUFNLE1BQU07QUFDcEMsYUFBTztBQUFBLElBRVIsU0FBUSxPQUFQO0FBQ0EsVUFBSSxLQUFLLElBQUksYUFBYSxLQUFLLEdBQUc7QUFDaEM7QUFDQSxlQUFPQTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDSDtBQUVBO0FBRUEsSUFBQSxnQkFBaUJ3Szs7QUNub0JqQixNQUFNekssT0FBS0gsc0JBQUFBO0FBQ1gsTUFBTXFJLFlBQVV0SCxvQkFBQUE7QUFDaEIsTUFBTSxFQUFFdUgsV0FBQUEsWUFBVyxJQUFHdEg7QUFFdEIsSUFBSTtBQUNKLElBQUk7QUFDRixhQUFXLFFBQVEsVUFBVTtBQUMvQixTQUFTLE9BQVA7QUFDQSxNQUFJLENBQUEsRUFBWTtBQUF1QyxZQUFRLE1BQU0sS0FBSztBQUM1RTtBQUVBLElBQUksVUFBVTtBQUVaLFFBQU0sT0FBTyxRQUFRLFFBQVEsTUFBTSxlQUFlO0FBQ2xELE1BQUksUUFBUSxLQUFLLE1BQU0sS0FBSyxJQUFJO0FBQzlCLFVBQU0sTUFBTSxPQUFPLFNBQVMsS0FBSyxJQUFJLEVBQUU7QUFDdkMsVUFBTSxNQUFNLE9BQU8sU0FBUyxLQUFLLElBQUksRUFBRTtBQUN2QyxRQUFJLFFBQVEsS0FBSyxNQUFNLElBQUk7QUFDekIsaUJBQVc7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNIO0FBRUEsTUFBTTtBQUFBLEVBQ04sUUFBRW1KO0FBQUFBLEVBQ0YsV0FBRUQ7QUFBQUEsRUFDRixZQUFFRTtBQUFBQSxFQUNGLFdBQUVXO0FBQUFBLEVBQ0YsVUFBRVY7QUFBQUEsRUFDQTtBQUFBLEVBQ0YsU0FBRUU7QUFBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNGLGVBQUVTO0FBQUFBLEVBQ0YsVUFBRWhCO0FBQUFBLEVBQ0E7QUFDRixJQUFJL0k7QUFFSixNQUFNLFFBQVEsQ0FBQyxVQUFVLE1BQU0sS0FBSyxJQUFJLEtBQUssRUFBQyxPQUFPLE1BQUs7QUFFMUQsTUFBTXlCLFNBQU80RixZQUFVbkksS0FBRyxJQUFJO0FBQzlCLE1BQU0sUUFBUW1JLFlBQVVuSSxLQUFHLEtBQUs7QUFDaEMsTUFBTSxXQUFXbUksWUFBVW5JLEtBQUcsUUFBUTtBQUV0QyxNQUFNLGNBQWMsRUFBQSxNQUFFdUMsUUFBTTtBQWtCNUIsTUFBTSxtQkFBbUIsb0JBQUk7QUFJN0IsTUFBTSx3QkFBd0I7QUFFOUIsTUFBTSxrQkFBa0Isb0JBQUksSUFBSTtBQUFBLEVBQzlCO0FBQUEsRUFBTztBQUFBLEVBQU87QUFBQSxFQUFPO0FBQUEsRUFBTztBQUFBLEVBQU87QUFBQSxFQUFRO0FBQUEsRUFBUTtBQUNyRCxDQUFDO0FBUUQsTUFBTSx5QkFBeUIsQ0FBQ3RDLE9BQU0sYUFBYTtBQUNqRCxRQUFNLE9BQU8sU0FBUyxNQUFNQSxPQUFNLFFBQVE7QUFDMUMsU0FBTyxFQUFDLEtBQUk7QUFDZDtBQVdBLFNBQVMsb0JBQW9CQSxPQUFNLFVBQVUsVUFBVSxZQUFZO0FBQ2pFLE1BQUksWUFBWWlJLFVBQVEsUUFBUWpJLEtBQUksSUFBSWlJLFVBQVEsUUFBUWpJLEtBQUksSUFBSUE7QUFDaEUsUUFBTSxhQUFhaUksVUFBUSxRQUFRLFNBQVM7QUFDNUMsTUFBSSxPQUFPLGlCQUFpQixJQUFJLFNBQVM7QUFNekMsTUFBSSxpQkFBaUIsVUFBVSxHQUFHO0FBQ2hDLGdCQUFZO0FBQUEsRUFDYjtBQUVELFFBQU0sZUFBZUEsVUFBUSxRQUFRakksS0FBSTtBQUN6QyxRQUFNLGFBQWEsaUJBQWlCO0FBRXBDLFFBQU0sbUJBQW1CLENBQUMsVUFBVSxPQUFPLFNBQVM7QUFDbEQsUUFBSTtBQUFZLGlCQUFXLFNBQVMsUUFBUSxVQUFVLFlBQVk7QUFDbEUsUUFDRSxhQUFhLGdCQUNiLENBQUMsU0FBUyxRQUFRLGVBQWVpSSxVQUFRLEdBQUc7QUFDNUMsZUFBUyxVQUFVLE9BQU8sSUFBSTtBQUFBLEVBQ3BDO0FBSUUsTUFBSSxnQkFBZ0I7QUFDcEIsYUFBVyxlQUFlLGlCQUFpQixRQUFRO0FBQ2pELFFBQUksU0FBUyxRQUFRQSxVQUFRLFFBQVEsV0FBVyxJQUFJQSxVQUFRLEdBQUcsTUFBTSxHQUFHO0FBQ3RFLGtCQUFZO0FBQ1osYUFBTyxpQkFBaUIsSUFBSSxTQUFTO0FBQ3JDLHNCQUFnQjtBQUNoQjtBQUFBLElBQ0Q7QUFBQSxFQUNGO0FBRUQsTUFBSSxRQUFRLGVBQWU7QUFDekIsU0FBSyxVQUFVLElBQUksZ0JBQWdCO0FBQUEsRUFDdkMsT0FBUztBQUNMLFdBQU87QUFBQSxNQUNMLFdBQVcsb0JBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDO0FBQUEsTUFDckM7QUFBQSxNQUNBLFNBQVMsdUJBQXVCLFdBQVcsQ0FBQyxVQUFVLFVBQVU7QUFDOUQsWUFBSSxDQUFDLEtBQUssVUFBVTtBQUFNO0FBQzFCLGNBQU0sT0FBTyxTQUFTLFFBQVEsVUFBVSxLQUFLO0FBQzdDLGFBQUssVUFBVSxRQUFRLFVBQVE7QUFDN0IsZUFBSyxVQUFVLE9BQU8sSUFBSTtBQUFBLFFBQ3BDLENBQVM7QUFFRCxhQUFLLFdBQVcsS0FBSyxPQUFPLFVBQVUsSUFBSTtBQUFBLE1BQ2xELENBQU87QUFBQSxJQUNQO0FBQ0kscUJBQWlCLElBQUksV0FBVyxJQUFJO0FBQUEsRUFDckM7QUFJRCxTQUFPLE1BQU07QUFDWCxVQUFNLE1BQU0sS0FBSztBQUVqQixRQUFJLE9BQU8sZ0JBQWdCO0FBQzNCLFFBQUksQ0FBQyxJQUFJLE1BQU07QUFDYix1QkFBaUIsT0FBTyxTQUFTO0FBQ2pDLFVBQUksS0FBSztBQUFTLGVBQU8sS0FBSyxRQUFRLEtBQUksRUFBRyxLQUFLLE1BQU07QUFDdEQsZUFBSyxhQUFhLEtBQUssVUFBVTtBQUNqQyxpQkFBTyxPQUFPLElBQUk7QUFBQSxRQUMxQixDQUFPO0FBQUEsSUFDRjtBQUFBLEVBQ0w7QUFDQTtBQUlBLE1BQU0sbUJBQW1CLENBQUNqSSxVQUFTO0FBQ2pDLE1BQUksUUFBUTtBQUNaLGFBQVcsYUFBYSxpQkFBaUIsUUFBUTtBQUMvQyxRQUFJLFVBQVUsUUFBUUEsS0FBSSxNQUFNLEdBQUc7QUFDakM7QUFDQSxVQUFJLFNBQVMsdUJBQXVCO0FBQ2xDLGVBQU87QUFBQSxNQUNSO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFRCxTQUFPO0FBQ1Q7QUFHQSxNQUFNLFNBQVMsTUFBTSxZQUFZLGlCQUFpQixPQUFPO0FBR3pELE1BQU0sWUFBWSxDQUFDQSxPQUFNLFNBQVM7QUFDaEMsTUFBSSxJQUFJO0FBQ1IsU0FBTyxDQUFDQSxNQUFLLFFBQVEsSUFBSSxNQUFNQSxRQUFPaUksVUFBUSxRQUFRakksS0FBSSxPQUFPO0FBQU07QUFDdkUsU0FBTztBQUNUO0FBSUEsTUFBTSxZQUFZLENBQUMsTUFBTSxVQUN2QixLQUFLLFNBQVMsMEJBQTBCLE1BQU0sWUFBYSxLQUMzRCxLQUFLLFNBQVMsd0JBQXdCLE1BQU0sZUFBZ0IsS0FDNUQsS0FBSyxTQUFTLHFCQUFxQixNQUFNLE9BQVE7QUFNbkQsTUFBTTZLLGtCQUFnQjtBQUFBLEVBS3RCLFlBQVksS0FBSztBQUNmLFNBQUssTUFBTTtBQUFBLEVBQ2I7QUFBQSxFQUNBLGFBQWE3SyxPQUFNLE9BQU87QUFDeEIsVUFBTSxTQUFTLEtBQUssSUFBSTtBQUN4QixRQUFJLEtBQUssSUFBSSxXQUFXQSxPQUFNLEtBQUssR0FBRztBQUNwQyxhQUFPLElBQUlBLEtBQUk7QUFDZixVQUFJLFNBQVMsTUFBTSxlQUFlO0FBQ2hDLGVBQU8sSUFBSUEsUUFBTyxhQUFhO0FBQUEsTUFDaEM7QUFDRCxhQUFPO0FBQUEsSUFDUjtBQUVELFdBQU8sT0FBT0EsS0FBSTtBQUNsQixXQUFPLE9BQU9BLFFBQU8sYUFBYTtBQUFBLEVBQ3BDO0FBQUEsRUFFQSxZQUFZQSxPQUFNLFVBQVUsVUFBVSxRQUFRLFlBQVksTUFBTSxNQUFNLE1BQU07QUFDMUUsVUFBTSxRQUFRLFdBQVcsSUFBSSxJQUFJLElBQUk4SixjQUFZQztBQUNqRCxTQUFLLFlBQVksT0FBTy9KLE9BQU0sVUFBVSxVQUFVLFFBQVEsWUFBWSxNQUFNLE1BQU0sSUFBSTtBQUFBLEVBQ3hGO0FBQUEsRUFFQSxNQUFNLFlBQVlBLE9BQU0sVUFBVSxVQUFVLFFBQVEsWUFBWSxNQUFNLE1BQU0sTUFBTTtBQUNoRixRQUFJO0FBQ0YsWUFBTSxRQUFRLE1BQU1zQyxPQUFLdEMsS0FBSTtBQUM3QixVQUFJLEtBQUssSUFBSTtBQUFRO0FBQ3JCLFVBQUksVUFBVSxNQUFNLEtBQUssR0FBRztBQUMxQixhQUFLLFlBQVlBLE9BQU0sVUFBVSxVQUFVLFFBQVEsWUFBWSxNQUFNLE1BQU0sSUFBSTtBQUFBLE1BQ3JGLE9BQVc7QUFDTCxhQUFLLFlBQVkySyxhQUFXM0ssT0FBTSxVQUFVLFVBQVUsUUFBUSxZQUFZLE1BQU0sTUFBTSxJQUFJO0FBQUEsTUFDM0Y7QUFBQSxJQUNGLFNBQVEsT0FBUDtBQUNBLFVBQUksTUFBTSxTQUFTLFVBQVU7QUFDM0IsYUFBSyxZQUFZQSxPQUFNLFVBQVUsVUFBVSxRQUFRLFlBQVksTUFBTSxNQUFNLElBQUk7QUFBQSxNQUNyRixPQUFXO0FBQ0wsYUFBSyxZQUFZMkssYUFBVzNLLE9BQU0sVUFBVSxVQUFVLFFBQVEsWUFBWSxNQUFNLE1BQU0sSUFBSTtBQUFBLE1BQzNGO0FBQUEsSUFDRjtBQUFBLEVBQ0g7QUFBQSxFQUVBLFlBQVksT0FBT0EsT0FBTSxVQUFVLFVBQVUsUUFBUSxZQUFZLE1BQU0sTUFBTSxNQUFNO0FBQ2pGLFFBQUksS0FBSyxJQUFJLFVBQVUsS0FBSyxhQUFhQSxLQUFJO0FBQUc7QUFFaEQsUUFBSSxVQUFVMkssYUFBVztBQUN2QixZQUFNLGNBQWMsS0FBSyxTQUFTO0FBRWxDLFVBQUksZUFBZSxXQUFXLElBQUksSUFBSSxHQUFHO0FBQ3ZDLGFBQUssSUFBSSxRQUFRLFFBQVEsTUFBTSxXQUFXO0FBQUEsTUFDM0M7QUFBQSxJQUNMLE9BQVM7QUFDTCxVQUFJLFVBQVVaLFVBQVE7QUFFcEIsWUFBSSxLQUFLLFNBQVM7QUFBd0IsZUFBSyxJQUFJLGVBQWUvSixLQUFJO0FBRXRFLFlBQUksS0FBSyxTQUFTLHdCQUF3QixLQUFLLGdCQUFnQjtBQUU3RCxnQkFBTSxXQUFXLEtBQUssVUFBVSxTQUM5QixTQUFZLFVBQVUsVUFBVSxRQUFRLElBQUk7QUFDOUMsaUJBQU8sS0FBSyxlQUFlQSxPQUFNLE9BQU8sTUFBTSxRQUFRO0FBQUEsUUFDdkQ7QUFJRCxhQUFLLElBQUksZUFBZSxNQUFNLEVBQUUsSUFBSSxJQUFJO0FBQUEsTUFDekM7QUFJRCxZQUFNLFlBQVksS0FBSyxTQUFTLHlCQUF5QixRQUFRLGFBQWE7QUFDOUUsV0FBSyxJQUFJLE1BQU0sV0FBV0EsS0FBSTtBQUM5QixVQUFJLGNBQWNnSztBQUFZLGFBQUssZUFBZWhLLE9BQU0sT0FBTyxJQUFJO0FBQUEsSUFDcEU7QUFBQSxFQUNIO0FBQUEsRUFVQSxtQkFBbUIsV0FBVyxVQUFVOEssWUFBVyxZQUFZO0FBQzdELFFBQUksS0FBSyxJQUFJLFVBQVUsS0FBSyxJQUFJLFdBQVcsU0FBUztBQUFHO0FBQ3ZELFVBQU0sT0FBTyxLQUFLLElBQUk7QUFDdEIsVUFBTSxnQkFBZ0IsT0FBTyxVQUFVLE9BQU8sU0FBUztBQUNyRCxVQUFJLEtBQUssSUFBSTtBQUFRO0FBQ3JCLFVBQ0UsS0FBSyxVQUFVLFVBQ2YsVUFBVSxVQUFVLFFBQVEsSUFBSSxLQUFLO0FBQ3JDO0FBQ0YsWUFBTTlLLFFBQU84SyxXQUFVN0MsVUFBUTtBQUFBLFFBQzdCO0FBQUEsUUFBV0EsVUFBUSxTQUFTLFdBQVcsUUFBUTtBQUFBLE1BQ3JELENBQUs7QUFDRCxVQUFJLGNBQWMsQ0FBQyxXQUFXakksS0FBSTtBQUFHO0FBRXJDLFlBQU0sU0FBU2lJLFVBQVEsUUFBUWpJLEtBQUk7QUFDbkMsWUFBTSxPQUFPaUksVUFBUSxTQUFTakksS0FBSTtBQUNsQyxZQUFNLGFBQWEsS0FBSyxJQUFJO0FBQUEsUUFDMUIsS0FBSyxTQUFTLHlCQUF5QkEsUUFBTztBQUFBLE1BQ3BEO0FBR0ksVUFBSSxnQkFBZ0IsSUFBSSxLQUFLLEtBQUssS0FBSyxVQUFVLGlCQUFpQjtBQUNoRSxZQUFJLE9BQU8sS0FBSyxZQUFZNEssaUJBQWU7QUFDekMsY0FBSTtBQUNKLGNBQUk7QUFDRixvQkFBUSxNQUFNdEksT0FBS3RDLEtBQUk7QUFBQSxVQUNqQyxTQUFpQixPQUFQO0FBQUEsVUFBZ0I7QUFDbEIsY0FBSSxLQUFLLElBQUk7QUFBUTtBQUNyQixjQUFJLEtBQUssYUFBYUEsT0FBTSxLQUFLO0FBQUc7QUFDcEMsY0FBSSxVQUFVLE1BQU0sS0FBSyxHQUFHO0FBQzFCLGlCQUFLLFlBQVlBLE9BQU0sVUFBVSxVQUFVLFFBQVEsWUFBWSxNQUFNLE1BQU0sSUFBSTtBQUFBLFVBQ3pGLE9BQWU7QUFDTCxpQkFBSyxZQUFZMkssYUFBVzNLLE9BQU0sVUFBVSxVQUFVLFFBQVEsWUFBWSxNQUFNLE1BQU0sSUFBSTtBQUFBLFVBQzNGO0FBQUEsUUFDVCxPQUFhO0FBQ0wsZUFBSyxZQUFZQSxPQUFNLFVBQVUsVUFBVSxRQUFRLFlBQVksTUFBTSxNQUFNLElBQUk7QUFBQSxRQUNoRjtBQUFBLE1BQ1AsT0FBVztBQUNMLGdCQUFRLEtBQUs7QUFBQSxlQUNSO0FBQUEsZUFDQTtBQUNILG1CQUFPLEtBQUssWUFBWUEsT0FBTSxVQUFVLFVBQVUsUUFBUSxZQUFZLE1BQU0sTUFBTSxJQUFJO0FBQUEsZUFDbkY7QUFBQSxlQUNBO0FBQ0gsbUJBQU8sS0FBSyxZQUFZQSxPQUFNLFVBQVUsVUFBVSxRQUFRLFlBQVksTUFBTSxNQUFNLElBQUk7QUFBQTtBQUFBLE1BRXpGO0FBQUEsSUFDTDtBQUVFLFVBQU0sU0FBUztBQUFBLE1BQ2I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0EsS0FBSyxJQUFJO0FBQUEsSUFDYjtBQUVFLFNBQUssSUFBSTtBQUNULFdBQU87QUFBQSxFQUNUO0FBQUEsRUFVQSxNQUFNLHVCQUF1QixVQUFVLFVBQVU4SyxZQUFXLFVBQVU7QUFFcEUsUUFBSSxLQUFLLElBQUksVUFBVSxLQUFLLElBQUksY0FBYyxJQUFJLFFBQVE7QUFBRztBQUU3RCxTQUFLLElBQUksY0FBYyxJQUFJLFVBQVUsSUFBSTtBQUN6QyxTQUFLLElBQUk7QUFFVCxRQUFJO0FBQ0YsWUFBTSxhQUFhLE1BQU0sU0FBUyxRQUFRO0FBQzFDLFVBQUksS0FBSyxJQUFJO0FBQVE7QUFDckIsVUFBSSxLQUFLLElBQUksV0FBVyxVQUFVLEdBQUc7QUFDbkMsZUFBTyxLQUFLLElBQUk7TUFDakI7QUFFRCxXQUFLLElBQUk7QUFJVCxXQUFLLGVBQWUsY0FBYyxVQUFVLENBQUM5SyxVQUFTO0FBQ3BELFlBQUksY0FBYztBQUNsQixZQUFJLGNBQWMsZUFBZSxXQUFXO0FBQzFDLHdCQUFjQSxNQUFLLFFBQVEsWUFBWSxRQUFRO0FBQUEsUUFDdkQsV0FBaUJBLFVBQVMsV0FBVztBQUM3Qix3QkFBY2lJLFVBQVEsS0FBSyxVQUFVakksS0FBSTtBQUFBLFFBQzFDO0FBQ0QsZUFBTzhLLFdBQVUsV0FBVztBQUFBLE1BQ2xDLEdBQU8sT0FBTyxRQUFRO0FBQUEsSUFDbkIsU0FBTyxPQUFOO0FBQ0EsVUFBSSxLQUFLLElBQUksYUFBYSxLQUFLLEdBQUc7QUFDaEMsZUFBTyxLQUFLLElBQUk7TUFDakI7QUFBQSxJQUNGO0FBQUEsRUFDSDtBQUFBLEVBT0EsUUFBUSxTQUFTLE9BQU8sYUFBYSxNQUFNLFVBQVU7QUFDbkQsVUFBTSxLQUFLLFlBQVksT0FBTztBQUM5QixVQUFNLFFBQVEsTUFBTTtBQUNwQixVQUFNLFNBQVMsS0FBSyxJQUFJLGVBQWU3QyxVQUFRLFFBQVEsRUFBRSxDQUFDO0FBQzFELFVBQU0sT0FBT0EsVUFBUSxTQUFTLEVBQUU7QUFHaEMsUUFBSTtBQUFPLFdBQUssSUFBSSxlQUFlLEVBQUU7QUFDckMsUUFBSSxPQUFPLElBQUksSUFBSTtBQUFHO0FBQ3RCLFdBQU8sSUFBSSxJQUFJO0FBRWYsUUFBSSxDQUFDLEtBQUssaUJBQWlCLGFBQWEsTUFBTTtBQUM1QyxXQUFLLElBQUksTUFBTSxRQUFRK0IsZUFBYUQsVUFBUSxJQUFJLEtBQUs7QUFBQSxJQUN0RDtBQUFBLEVBQ0g7QUFBQSxFQUVBLFVBQVUsVUFBVS9KLE9BQU0sSUFBSSxhQUFhO0FBQ3pDLFFBQUksS0FBSyxJQUFJO0FBQVE7QUFDckIsVUFBTSxTQUFTLEtBQUs7QUFBQSxNQUNsQixHQUFHO0FBQUEsTUFDSGlJLFVBQVEsUUFBUSxZQUFZLEdBQUcsU0FBUztBQUFBLE1BQ3hDO0FBQUEsTUFDQSxHQUFHO0FBQUEsSUFDUDtBQUNFLFNBQUssSUFBSSxlQUFlakksT0FBTSxNQUFNO0FBQUEsRUFDdEM7QUFBQSxFQVVBLE1BQU0sZUFBZUEsT0FBTThLLFlBQVcsVUFBVSxZQUFZO0FBQzFELFFBQUksS0FBSyxJQUFJLFFBQVE7QUFDbkI7QUFBQSxJQUNEO0FBQ0QsVUFBTSxPQUFPLEtBQUssSUFBSTtBQUN0QixVQUFNLGNBQWMsT0FBT0EsZUFBY0Ysa0JBQWdCRSxhQUFZO0FBRXJFLFVBQU0sS0FBSyxLQUFLLElBQUksaUJBQWlCOUssS0FBSTtBQUd6QyxRQUFJO0FBQ0YsWUFBTSxRQUFRLE1BQU0sWUFBWSxHQUFHLFlBQVksR0FBRyxTQUFTO0FBQzNELFVBQUksS0FBSyxJQUFJO0FBQVE7QUFDckIsVUFBSSxLQUFLLElBQUksV0FBVyxHQUFHLFdBQVcsS0FBSyxHQUFHO0FBQzVDLGNBQU07QUFBQSxNQUNQO0FBQ0QsVUFBSSxNQUFNLGVBQWU7QUFFdkIsWUFBSSxDQUFDLEdBQUc7QUFBWSxlQUFLLFFBQVEsWUFBWUEsS0FBSSxHQUFHLE9BQU8sYUFBYSxNQUFNLFFBQVE7QUFHdEYsWUFBSSxjQUFjLGFBQWEsS0FBSztBQUFPO0FBRzNDLGFBQUssSUFBSSxVQUFVLEdBQUcsV0FBVztBQUFBLFVBQy9CLFlBQVksV0FBUyxHQUFHLFdBQVcsS0FBSztBQUFBLFVBQ3hDLGlCQUFpQixXQUFTLEdBQUcsVUFBVSxLQUFLO0FBQUEsVUFDNUMsR0FBRyxNQUFNLEtBQUssU0FBUyxjQUFjLEVBQUU7QUFBQSxRQUN4QyxDQUFBLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVTtBQUV6QixjQUFJLEtBQUssSUFBSSxRQUFRO0FBQ25CO0FBQUEsVUFDRDtBQUNELGNBQUksTUFBTSxNQUFNLFlBQWEsS0FBSSxDQUFDLEdBQUcsV0FBVyxLQUFLO0FBQUc7QUFFeEQsZ0JBQU0sYUFBYWlJLFVBQVEsS0FBSyxHQUFHLFdBQVcsTUFBTSxJQUFJO0FBQ3hELGdCQUFNLEVBQUMsU0FBUSxJQUFJO0FBRW5CLGNBQUksR0FBRyxrQkFBa0IsTUFBTSxNQUFNLGVBQWMsR0FBSTtBQUdyRCxrQkFBTSxXQUFXLEtBQUssVUFBVSxTQUM5QixTQUFZLFVBQVUsWUFBWUEsVUFBUSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUk7QUFFckUsaUJBQUssdUJBQXVCLFlBQVksVUFBVSxhQUFhLFFBQVE7QUFBQSxVQUNqRixPQUFlO0FBQ0wsaUJBQUssUUFBUSxZQUFZLE1BQU0sT0FBTyxhQUFhLE1BQU0sUUFBUTtBQUFBLFVBQ2xFO0FBQUEsUUFDVCxDQUFPLEVBQUUsR0FBR2dDLFlBQVVMLFVBQVEsRUFBRSxHQUFHTyxXQUFTLE1BQU07QUFDMUMsZUFBSyxJQUFJO1FBQ2pCLENBQU87QUFBQSxNQUNQLE9BQVc7QUFDTCxhQUFLLFFBQVEsR0FBRyxXQUFXLE9BQU8sYUFBYSxNQUFNLFFBQVE7QUFDN0QsYUFBSyxJQUFJO01BQ1Y7QUFBQSxJQUNGLFNBQVEsT0FBUDtBQUNBLFVBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxhQUFhLEtBQUssR0FBRztBQUUxQyxhQUFLLElBQUk7QUFDVCxhQUFLLElBQUk7TUFDVjtBQUFBLElBQ0Y7QUFFRCxRQUFJLEtBQUssY0FBYyxhQUFhLE1BQU07QUFDeEMsVUFBSSxPQUFPVyxlQUFjRixpQkFBZTtBQUV0QyxhQUFLLFVBQVUsUUFBVzVLLE9BQU0sSUFBSSxXQUFXO0FBQUEsTUFDckQsT0FBVztBQUNMLFlBQUk7QUFDSixZQUFJO0FBQ0YscUJBQVcsTUFBTSxTQUFTLEdBQUcsU0FBUztBQUFBLFFBQzlDLFNBQWUsR0FBUDtBQUFBLFFBQVk7QUFDZCxhQUFLLFVBQVUsVUFBVUEsT0FBTSxJQUFJLFdBQVc7QUFBQSxNQUMvQztBQUFBLElBQ0Y7QUFBQSxFQUNIO0FBRUE7QUFFQStLLGdCQUFjLFVBQUdGO0FBQ2pCRyxnQkFBQSxRQUFBLFNBQXdCO0FDeGdCeEIsTUFBTSxFQUFFLGFBQWMsSUFBR3BMO0FBQ3pCLE1BQU0sS0FBS2Usc0JBQUFBO0FBQ1gsTUFBTSxVQUFVQyxvQkFBQUE7QUFDaEIsTUFBTSxFQUFFLFVBQVcsSUFBR0M7QUFDdEIsTUFBTSxXQUFXRTtBQUNqQixNQUFNLFdBQVdJLFdBQW1CLFFBQUM7QUFDckMsTUFBTSxhQUFhbUQ7QUFDbkIsTUFBTSxTQUFTVTtBQUNmLE1BQU0sU0FBU0M7QUFDZixNQUFNLGdCQUFnQkM7QUFFdEIsTUFBTSxnQkFBZ0JDO0FBQ3RCLE1BQU0sa0JBQWtCQyxnQkFBQUE7QUFDeEIsTUFBTTtBQUFBLEVBQ0o7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFFQTtBQUFBLEVBQ0E7QUFDRixJQUFJQztBQUVKLE1BQU0sT0FBTyxVQUFVLEdBQUcsSUFBSTtBQUM5QixNQUFNLFVBQVUsVUFBVSxHQUFHLE9BQU87QUFzQnBDLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQSxNQUFPLE1BQU0sUUFBUSxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUs7QUFDcEUsTUFBTSxVQUFVLENBQUMsTUFBTSxTQUFTLE9BQU87QUFDckMsT0FBSyxRQUFRLFVBQVE7QUFDbkIsUUFBSSxNQUFNLFFBQVEsSUFBSSxHQUFHO0FBQ3ZCLGNBQVEsTUFBTSxNQUFNO0FBQUEsSUFDMUIsT0FBVztBQUNMLGFBQU8sS0FBSyxJQUFJO0FBQUEsSUFDakI7QUFBQSxFQUNMLENBQUc7QUFDRCxTQUFPO0FBQ1Q7QUFFQSxNQUFNLGFBQWEsQ0FBQyxXQUFXO0FBSTdCLFFBQU0sUUFBUSxRQUFRLE9BQU8sTUFBTSxDQUFDO0FBQ3BDLE1BQUksQ0FBQyxNQUFNLE1BQU0sT0FBSyxPQUFPLE1BQU0sV0FBVyxHQUFHO0FBQy9DLFVBQU0sSUFBSSxVQUFVLHNDQUFzQyxPQUFPO0FBQUEsRUFDbEU7QUFDRCxTQUFPLE1BQU0sSUFBSSxtQkFBbUI7QUFDdEM7QUFJQSxNQUFNLFNBQVMsQ0FBQyxXQUFXO0FBQ3pCLE1BQUksTUFBTSxPQUFPLFFBQVEsZUFBZSxLQUFLO0FBQzdDLE1BQUksVUFBVTtBQUNkLE1BQUksSUFBSSxXQUFXLFdBQVcsR0FBRztBQUMvQixjQUFVO0FBQUEsRUFDWDtBQUNELFNBQU8sSUFBSSxNQUFNLGVBQWUsR0FBRztBQUNqQyxVQUFNLElBQUksUUFBUSxpQkFBaUIsS0FBSztBQUFBLEVBQ3pDO0FBQ0QsTUFBSSxTQUFTO0FBQ1gsVUFBTSxRQUFRO0FBQUEsRUFDZjtBQUNELFNBQU87QUFDVDtBQUlBLE1BQU0sc0JBQXNCLENBQUNyRixVQUFTLE9BQU8sUUFBUSxVQUFVLE9BQU9BLEtBQUksQ0FBQyxDQUFDO0FBRTVFLE1BQU0sbUJBQW1CLENBQUNpTCxPQUFNLGNBQWMsQ0FBQ2pMLFVBQVM7QUFDdEQsTUFBSSxPQUFPQSxVQUFTO0FBQWEsV0FBT0E7QUFDeEMsU0FBTyxvQkFBb0IsUUFBUSxXQUFXQSxLQUFJLElBQUlBLFFBQU8sUUFBUSxLQUFLaUwsTUFBS2pMLEtBQUksQ0FBQztBQUN0RjtBQUVBLE1BQU0sa0JBQWtCLENBQUNBLE9BQU1pTCxTQUFRO0FBQ3JDLE1BQUksUUFBUSxXQUFXakwsS0FBSSxHQUFHO0FBQzVCLFdBQU9BO0FBQUEsRUFDUjtBQUNELE1BQUlBLE1BQUssV0FBVyxJQUFJLEdBQUc7QUFDekIsV0FBTyxPQUFPLFFBQVEsS0FBS2lMLE1BQUtqTCxNQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQUEsRUFDOUM7QUFDRCxTQUFPLFFBQVEsS0FBS2lMLE1BQUtqTCxLQUFJO0FBQy9CO0FBRUEsTUFBTSxRQUFRLENBQUMsTUFBTSxRQUFRLEtBQUssU0FBUztBQU8zQyxNQUFNLFNBQVM7QUFBQSxFQUtiLFlBQVksS0FBSyxlQUFlO0FBQzlCLFNBQUssT0FBTztBQUNaLFNBQUssaUJBQWlCO0FBRXRCLFNBQUssUUFBUSxvQkFBSTtFQUNsQjtBQUFBLEVBRUQsSUFBSSxNQUFNO0FBQ1IsVUFBTSxFQUFDLE1BQUssSUFBSTtBQUNoQixRQUFJLENBQUM7QUFBTztBQUNaLFFBQUksU0FBUyxXQUFXLFNBQVM7QUFBVSxZQUFNLElBQUksSUFBSTtBQUFBLEVBQzFEO0FBQUEsRUFFRCxNQUFNLE9BQU8sTUFBTTtBQUNqQixVQUFNLEVBQUMsTUFBSyxJQUFJO0FBQ2hCLFFBQUksQ0FBQztBQUFPO0FBQ1osVUFBTSxPQUFPLElBQUk7QUFDakIsUUFBSSxNQUFNLE9BQU87QUFBRztBQUVwQixVQUFNLE1BQU0sS0FBSztBQUNqQixRQUFJO0FBQ0YsWUFBTSxRQUFRLEdBQUc7QUFBQSxJQUNsQixTQUFRLEtBQVA7QUFDQSxVQUFJLEtBQUssZ0JBQWdCO0FBQ3ZCLGFBQUssZUFBZSxRQUFRLFFBQVEsR0FBRyxHQUFHLFFBQVEsU0FBUyxHQUFHLENBQUM7QUFBQSxNQUNoRTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFRCxJQUFJLE1BQU07QUFDUixVQUFNLEVBQUMsTUFBSyxJQUFJO0FBQ2hCLFFBQUksQ0FBQztBQUFPO0FBQ1osV0FBTyxNQUFNLElBQUksSUFBSTtBQUFBLEVBQ3RCO0FBQUEsRUFLRCxjQUFjO0FBQ1osVUFBTSxFQUFDLE1BQUssSUFBSTtBQUNoQixRQUFJLENBQUM7QUFBTztBQUNaLFdBQU8sQ0FBQyxHQUFHLE1BQU0sT0FBTSxDQUFFO0FBQUEsRUFDMUI7QUFBQSxFQUVELFVBQVU7QUFDUixTQUFLLE1BQU07QUFDWCxXQUFPLEtBQUs7QUFDWixXQUFPLEtBQUs7QUFDWixXQUFPLEtBQUs7QUFDWixXQUFPLE9BQU8sSUFBSTtBQUFBLEVBQ25CO0FBQ0g7QUFFQSxNQUFNLGdCQUFnQjtBQUN0QixNQUFNLGdCQUFnQjtBQUN0QixNQUFNLFlBQVk7QUFBQSxFQUNoQixZQUFZQSxPQUFNLFdBQVcsUUFBUSxLQUFLO0FBQ3hDLFNBQUssTUFBTTtBQUNYLFNBQUssT0FBT0EsUUFBT0EsTUFBSyxRQUFRLGFBQWEsU0FBUztBQUN0RCxTQUFLLFlBQVk7QUFDakIsU0FBSyxnQkFBZ0IsUUFBUSxRQUFRLFNBQVM7QUFDOUMsU0FBSyxVQUFVLGNBQWNBO0FBRTdCLFFBQUlBLFVBQVM7QUFBVyxXQUFLLFVBQVU7QUFDdkMsU0FBSyxjQUFjLEtBQUssV0FBVyxTQUFTLFNBQVk7QUFDeEQsU0FBSyxhQUFhLEtBQUssVUFBVSxTQUFTQSxPQUFNLFFBQVcsYUFBYSxJQUFJO0FBQzVFLFNBQUssV0FBVyxLQUFLLFlBQVlBLEtBQUk7QUFDckMsU0FBSyxTQUFTLFFBQVEsQ0FBQyxVQUFVO0FBQy9CLFVBQUksTUFBTSxTQUFTO0FBQUcsY0FBTSxJQUFHO0FBQUEsSUFDckMsQ0FBSztBQUNELFNBQUssaUJBQWlCO0FBQ3RCLFNBQUssYUFBYSxTQUFTLGdCQUFnQjtBQUFBLEVBQzVDO0FBQUEsRUFFRCxpQkFBaUIsT0FBTztBQUd0QixRQUFJLEtBQUssZ0JBQWdCLFFBQVc7QUFDbEMsV0FBSyxjQUFjLE1BQU0sa0JBQWtCLEtBQUssZ0JBQzlDLFFBQVEsRUFBQyxVQUFVLE1BQU0sZUFBZSxVQUFVLEtBQUssY0FBYTtBQUFBLElBQ3ZFO0FBRUQsUUFBSSxLQUFLLGFBQWE7QUFDcEIsYUFBTyxNQUFNLFNBQVMsUUFBUSxLQUFLLFlBQVksVUFBVSxLQUFLLFlBQVksUUFBUTtBQUFBLElBQ25GO0FBRUQsV0FBTyxNQUFNO0FBQUEsRUFDZDtBQUFBLEVBRUQsVUFBVSxPQUFPO0FBQ2YsV0FBTyxRQUFRO0FBQUEsTUFBSyxLQUFLO0FBQUEsTUFDdkIsUUFBUSxTQUFTLEtBQUssV0FBVyxLQUFLLGlCQUFpQixLQUFLLENBQUM7QUFBQSxJQUNuRTtBQUFBLEVBQ0c7QUFBQSxFQUVELFdBQVcsT0FBTztBQUNoQixVQUFNLEVBQUMsTUFBSyxJQUFJO0FBQ2hCLFFBQUksU0FBUyxNQUFNLGVBQWM7QUFBSSxhQUFPLEtBQUssVUFBVSxLQUFLO0FBQ2hFLFVBQU0sZUFBZSxLQUFLLFVBQVUsS0FBSztBQUN6QyxVQUFNLGNBQWMsS0FBSyxXQUFXLE9BQU8sS0FBSyxlQUFlLGdCQUM3RCxLQUFLLFdBQVcsWUFBWSxJQUFJO0FBQ2xDLFdBQU8sZUFDTCxLQUFLLElBQUksYUFBYSxjQUFjLEtBQUssS0FDekMsS0FBSyxJQUFJLG9CQUFvQixLQUFLO0FBQUEsRUFDckM7QUFBQSxFQUVELFlBQVlBLE9BQU07QUFDaEIsUUFBSSxDQUFDLEtBQUs7QUFBUyxhQUFPO0FBQzFCLFVBQU0sUUFBUSxDQUFBO0FBQ2QsVUFBTSxlQUFlQSxNQUFLLFNBQVMsV0FBVyxJQUFJLE9BQU8sT0FBT0EsS0FBSSxJQUFJLENBQUNBLEtBQUk7QUFDN0UsaUJBQWEsUUFBUSxDQUFDQSxVQUFTO0FBQzdCLFlBQU0sS0FBSyxRQUFRLFNBQVMsS0FBSyxXQUFXQSxLQUFJLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUFBLElBQ3JGLENBQUs7QUFDRCxXQUFPO0FBQUEsRUFDUjtBQUFBLEVBRUQsVUFBVSxPQUFPO0FBQ2YsUUFBSSxLQUFLLFNBQVM7QUFDaEIsWUFBTSxhQUFhLEtBQUssWUFBWSxLQUFLLGlCQUFpQixLQUFLLENBQUM7QUFDaEUsVUFBSSxXQUFXO0FBQ2YsV0FBSyxnQkFBZ0IsQ0FBQyxLQUFLLFNBQVMsS0FBSyxDQUFDLFVBQVU7QUFDbEQsZUFBTyxNQUFNLE1BQU0sQ0FBQyxNQUFNLE1BQU07QUFDOUIsY0FBSSxTQUFTO0FBQVUsdUJBQVc7QUFDbEMsaUJBQU8sWUFBWSxDQUFDLFdBQVcsR0FBRyxNQUFNLFNBQVMsTUFBTSxXQUFXLEdBQUcsSUFBSSxhQUFhO0FBQUEsUUFDaEcsQ0FBUztBQUFBLE1BQ1QsQ0FBTztBQUFBLElBQ0Y7QUFDRCxXQUFPLENBQUMsS0FBSyxpQkFBaUIsS0FBSyxJQUFJLGFBQWEsS0FBSyxVQUFVLEtBQUssR0FBRyxNQUFNLEtBQUs7QUFBQSxFQUN2RjtBQUNIO0FBVUEsTUFBTSxrQkFBa0IsYUFBYTtBQUFBLEVBRXJDLFlBQVksT0FBTztBQUNqQjtBQUVBLFVBQU0sT0FBTyxDQUFBO0FBQ2IsUUFBSTtBQUFPLGFBQU8sT0FBTyxNQUFNLEtBQUs7QUFHcEMsU0FBSyxXQUFXLG9CQUFJO0FBRXBCLFNBQUssV0FBVyxvQkFBSTtBQUVwQixTQUFLLGdCQUFnQixvQkFBSTtBQUd6QixTQUFLLGFBQWEsb0JBQUk7QUFHdEIsU0FBSyxnQkFBZ0Isb0JBQUk7QUFFekIsU0FBSyxXQUFXLG9CQUFJO0FBQ3BCLFNBQUssU0FBUztBQUdkLFFBQUksTUFBTSxNQUFNLFlBQVk7QUFBRyxXQUFLLGFBQWE7QUFDakQsUUFBSSxNQUFNLE1BQU0sZUFBZTtBQUFHLFdBQUssZ0JBQWdCO0FBQ3ZELFFBQUksTUFBTSxNQUFNLHdCQUF3QjtBQUFHLFdBQUsseUJBQXlCO0FBQ3pFLFFBQUksTUFBTSxNQUFNLFVBQVU7QUFBRyxXQUFLLFdBQVc7QUFDN0MsUUFBSSxNQUFNLE1BQU0sZ0JBQWdCO0FBQUcsV0FBSyxpQkFBaUI7QUFDekQsUUFBSSxNQUFNLE1BQU0saUJBQWlCO0FBQUcsV0FBSyxrQkFBa0I7QUFDM0QsU0FBSyx1QkFBdUIsS0FBSyxtQkFBbUIsS0FBSztBQUd6RCxRQUFJLE1BQU0sTUFBTSxhQUFhO0FBQUcsV0FBSyxjQUFjLENBQUMsS0FBSztBQUd6RCxVQUFNLGlCQUFpQixnQkFBZ0I7QUFDdkMsUUFBSSxDQUFDO0FBQWdCLFdBQUssY0FBYztBQUl4QyxRQUFJLE1BQU0sTUFBTSxZQUFZLEtBQUssQ0FBQyxLQUFLLGFBQWE7QUFDbEQsV0FBSyxhQUFhO0FBQUEsSUFDbkI7QUFJRCxVQUFNLFVBQVUsQ0FBQSxFQUFZO0FBQzVCLFFBQUksWUFBWSxRQUFXO0FBQ3pCLFlBQU0sV0FBVyxRQUFRO0FBRXpCLFVBQUksYUFBYSxXQUFXLGFBQWEsS0FBSztBQUM1QyxhQUFLLGFBQWE7QUFBQSxNQUNuQixXQUFVLGFBQWEsVUFBVSxhQUFhLEtBQUs7QUFDbEQsYUFBSyxhQUFhO0FBQUEsTUFDeEIsT0FBVztBQUNMLGFBQUssYUFBYSxDQUFDLENBQUM7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFDRCxVQUFNLGlCQUEwQjtBQUNoQyxRQUFJLGFBQWE7QUFDZixXQUFLLFdBQVcsT0FBTyxTQUFTLGFBQWEsRUFBRTtBQUFBLElBQ2hEO0FBR0QsUUFBSSxNQUFNLE1BQU0sUUFBUTtBQUFHLFdBQUssU0FBUyxDQUFDLEtBQUssY0FBYyxDQUFDLEtBQUs7QUFDbkUsUUFBSSxLQUFLO0FBQVEsV0FBSyxrQkFBa0Isb0JBQUksSUFBRztBQUUvQyxRQUFJLE1BQU0sTUFBTSxnQkFBZ0I7QUFBRyxXQUFLLGlCQUFpQjtBQUV6RCxRQUFJLE1BQU0sTUFBTSxrQkFBa0I7QUFBRyxXQUFLLG1CQUFtQjtBQUM3RCxRQUFJLEtBQUsscUJBQXFCO0FBQU0sV0FBSyxtQkFBbUIsQ0FBQTtBQUM1RCxVQUFNLE1BQU0sS0FBSztBQUNqQixRQUFJLEtBQUs7QUFDUCxVQUFJLENBQUMsSUFBSTtBQUFvQixZQUFJLHFCQUFxQjtBQUN0RCxVQUFJLENBQUMsSUFBSTtBQUFjLFlBQUksZUFBZTtBQUMxQyxXQUFLLGlCQUFpQixvQkFBSTtJQUMzQjtBQUNELFFBQUksS0FBSztBQUFTLFdBQUssVUFBVSxPQUFPLEtBQUssT0FBTztBQUVwRCxRQUFJLGFBQWE7QUFDakIsU0FBSyxhQUFhLE1BQU07QUFDdEI7QUFDQSxVQUFJLGNBQWMsS0FBSyxhQUFhO0FBQ2xDLGFBQUssYUFBYTtBQUNsQixhQUFLLGdCQUFnQjtBQUVyQixnQkFBUSxTQUFTLE1BQU0sS0FBSyxLQUFLLFFBQVEsQ0FBQztBQUFBLE1BQzNDO0FBQUEsSUFDTDtBQUNFLFNBQUssV0FBVyxJQUFJLFNBQVMsS0FBSyxLQUFLLFFBQVEsR0FBRyxJQUFJO0FBQ3RELFNBQUssZ0JBQWdCO0FBQ3JCLFNBQUssVUFBVTtBQUdmLFFBQUksS0FBSyxhQUFhO0FBQ3BCLFdBQUssbUJBQW1CLElBQUksZ0JBQWdCLElBQUk7QUFBQSxJQUNwRCxPQUFTO0FBQ0wsV0FBSyxpQkFBaUIsSUFBSSxjQUFjLElBQUk7QUFBQSxJQUM3QztBQUdELFdBQU8sT0FBTyxJQUFJO0FBQUEsRUFDcEI7QUFBQSxFQVdBLElBQUksUUFBUSxVQUFVLFdBQVc7QUFDL0IsVUFBTSxFQUFDLEtBQUFpTCxNQUFLLGdCQUFlLElBQUksS0FBSztBQUNwQyxTQUFLLFNBQVM7QUFDZCxRQUFJLFFBQVEsV0FBVyxNQUFNO0FBQzdCLFFBQUlBLE1BQUs7QUFDUCxjQUFRLE1BQU0sSUFBSSxDQUFDakwsVUFBUztBQUMxQixjQUFNLFVBQVUsZ0JBQWdCQSxPQUFNaUwsSUFBRztBQUd6QyxZQUFJLG1CQUFtQixDQUFDLE9BQU9qTCxLQUFJLEdBQUc7QUFDcEMsaUJBQU87QUFBQSxRQUNSO0FBQ0QsZUFBTyxjQUFjLE9BQU87QUFBQSxNQUNsQyxDQUFLO0FBQUEsSUFDRjtBQUdELFlBQVEsTUFBTSxPQUFPLENBQUNBLFVBQVM7QUFDN0IsVUFBSUEsTUFBSyxXQUFXLElBQUksR0FBRztBQUN6QixhQUFLLGNBQWMsSUFBSUEsTUFBSyxNQUFNLENBQUMsQ0FBQztBQUNwQyxlQUFPO0FBQUEsTUFDUjtBQUdELFdBQUssY0FBYyxPQUFPQSxLQUFJO0FBQzlCLFdBQUssY0FBYyxPQUFPQSxRQUFPLGNBQWM7QUFJL0MsV0FBSyxlQUFlO0FBRXBCLGFBQU87QUFBQSxJQUNYLENBQUc7QUFFRCxRQUFJLEtBQUssUUFBUSxlQUFlLEtBQUssa0JBQWtCO0FBQ3JELFVBQUksQ0FBQyxLQUFLO0FBQWEsYUFBSyxjQUFjLE1BQU07QUFDaEQsVUFBSSxLQUFLLFFBQVE7QUFBWSxhQUFLLGVBQWU7QUFDakQsWUFBTSxRQUFRLENBQUNBLFVBQVMsS0FBSyxpQkFBaUIsZUFBZUEsS0FBSSxDQUFDO0FBQUEsSUFDdEUsT0FBUztBQUNMLFVBQUksQ0FBQyxLQUFLO0FBQWEsYUFBSyxjQUFjO0FBQzFDLFdBQUssZUFBZSxNQUFNO0FBQzFCLGNBQVE7QUFBQSxRQUNOLE1BQU0sSUFBSSxPQUFNQSxVQUFRO0FBQ3RCLGdCQUFNLE1BQU0sTUFBTSxLQUFLLGVBQWUsYUFBYUEsT0FBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLFFBQVE7QUFDbkYsY0FBSTtBQUFLLGlCQUFLO0FBQ2QsaUJBQU87QUFBQSxRQUNmLENBQU87QUFBQSxNQUNQLEVBQU0sS0FBSyxhQUFXO0FBQ2hCLFlBQUksS0FBSztBQUFRO0FBQ2pCLGdCQUFRLE9BQU8sVUFBUSxJQUFJLEVBQUUsUUFBUSxVQUFRO0FBQzNDLGVBQUssSUFBSSxRQUFRLFFBQVEsSUFBSSxHQUFHLFFBQVEsU0FBUyxZQUFZLElBQUksQ0FBQztBQUFBLFFBQzFFLENBQU87QUFBQSxNQUNQLENBQUs7QUFBQSxJQUNGO0FBRUQsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQU9BLFFBQVEsUUFBUTtBQUNkLFFBQUksS0FBSztBQUFRLGFBQU87QUFDeEIsVUFBTSxRQUFRLFdBQVcsTUFBTTtBQUMvQixVQUFNLEVBQUMsS0FBQWlMLEtBQUcsSUFBSSxLQUFLO0FBRW5CLFVBQU0sUUFBUSxDQUFDakwsVUFBUztBQUV0QixVQUFJLENBQUMsUUFBUSxXQUFXQSxLQUFJLEtBQUssQ0FBQyxLQUFLLFNBQVMsSUFBSUEsS0FBSSxHQUFHO0FBQ3pELFlBQUlpTDtBQUFLLFVBQUFqTCxRQUFPLFFBQVEsS0FBS2lMLE1BQUtqTCxLQUFJO0FBQ3RDLFFBQUFBLFFBQU8sUUFBUSxRQUFRQSxLQUFJO0FBQUEsTUFDNUI7QUFFRCxXQUFLLFdBQVdBLEtBQUk7QUFFcEIsV0FBSyxjQUFjLElBQUlBLEtBQUk7QUFDM0IsVUFBSSxLQUFLLFNBQVMsSUFBSUEsS0FBSSxHQUFHO0FBQzNCLGFBQUssY0FBYyxJQUFJQSxRQUFPLGNBQWM7QUFBQSxNQUM3QztBQUlELFdBQUssZUFBZTtBQUFBLElBQ3hCLENBQUc7QUFFRCxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBTUEsUUFBUTtBQUNOLFFBQUksS0FBSztBQUFRLGFBQU8sS0FBSztBQUM3QixTQUFLLFNBQVM7QUFHZCxTQUFLLG1CQUFrQjtBQUN2QixVQUFNLFVBQVUsQ0FBQTtBQUNoQixTQUFLLFNBQVMsUUFBUSxnQkFBYyxXQUFXLFFBQVEsWUFBVTtBQUMvRCxZQUFNLFVBQVU7QUFDaEIsVUFBSSxtQkFBbUI7QUFBUyxnQkFBUSxLQUFLLE9BQU87QUFBQSxJQUNyRCxDQUFBLENBQUM7QUFDRixTQUFLLFNBQVMsUUFBUSxZQUFVLE9BQU8sUUFBTyxDQUFFO0FBQ2hELFNBQUssZUFBZTtBQUNwQixTQUFLLGNBQWM7QUFDbkIsU0FBSyxnQkFBZ0I7QUFDckIsU0FBSyxTQUFTLFFBQVEsWUFBVSxPQUFPLFFBQU8sQ0FBRTtBQUNoRCxLQUFDLFdBQVcsV0FBVyxXQUFXLGdCQUFnQixXQUFXLEVBQUUsUUFBUSxTQUFPO0FBQzVFLFdBQUssSUFBSSxPQUFPLE1BQUs7QUFBQSxJQUN6QixDQUFHO0FBRUQsU0FBSyxnQkFBZ0IsUUFBUSxTQUFTLFFBQVEsSUFBSSxPQUFPLEVBQUUsS0FBSyxNQUFNLE1BQVMsSUFBSSxRQUFRLFFBQU87QUFDbEcsV0FBTyxLQUFLO0FBQUEsRUFDZDtBQUFBLEVBTUEsYUFBYTtBQUNYLFVBQU0sWUFBWSxDQUFBO0FBQ2xCLFNBQUssU0FBUyxRQUFRLENBQUMsT0FBTyxRQUFRO0FBQ3BDLFlBQU0sTUFBTSxLQUFLLFFBQVEsTUFBTSxRQUFRLFNBQVMsS0FBSyxRQUFRLEtBQUssR0FBRyxJQUFJO0FBQ3pFLGdCQUFVLE9BQU8sV0FBVyxNQUFNLFlBQVcsRUFBRztJQUNwRCxDQUFHO0FBQ0QsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLFlBQVksT0FBTyxNQUFNO0FBQ3ZCLFNBQUssS0FBSyxHQUFHLElBQUk7QUFDakIsUUFBSSxVQUFVO0FBQVUsV0FBSyxLQUFLLFFBQVEsR0FBRyxJQUFJO0FBQUEsRUFDbkQ7QUFBQSxFQWVBLE1BQU0sTUFBTSxPQUFPQSxPQUFNLE1BQU0sTUFBTSxNQUFNO0FBQ3pDLFFBQUksS0FBSztBQUFRO0FBRWpCLFVBQU0sT0FBTyxLQUFLO0FBQ2xCLFFBQUk7QUFBVyxNQUFBQSxRQUFPLFFBQVEsVUFBVUEsS0FBSTtBQUM1QyxRQUFJLEtBQUs7QUFBSyxNQUFBQSxRQUFPLFFBQVEsU0FBUyxLQUFLLEtBQUtBLEtBQUk7QUFFcEQsVUFBTSxPQUFPLENBQUMsT0FBT0EsS0FBSTtBQUN6QixRQUFJLFNBQVM7QUFBVyxXQUFLLEtBQUssTUFBTSxNQUFNLElBQUk7QUFBQSxhQUN6QyxTQUFTO0FBQVcsV0FBSyxLQUFLLE1BQU0sSUFBSTtBQUFBLGFBQ3hDLFNBQVM7QUFBVyxXQUFLLEtBQUssSUFBSTtBQUUzQyxVQUFNLE1BQU0sS0FBSztBQUNqQixRQUFJO0FBQ0osUUFBSSxRQUFRLEtBQUssS0FBSyxlQUFlLElBQUlBLEtBQUksSUFBSTtBQUMvQyxTQUFHLGFBQWEsSUFBSTtBQUNwQixhQUFPO0FBQUEsSUFDUjtBQUVELFFBQUksS0FBSyxRQUFRO0FBQ2YsVUFBSSxVQUFVLFdBQVc7QUFDdkIsYUFBSyxnQkFBZ0IsSUFBSUEsT0FBTSxJQUFJO0FBQ25DLG1CQUFXLE1BQU07QUFDZixlQUFLLGdCQUFnQixRQUFRLENBQUMsT0FBT0EsVUFBUztBQUM1QyxpQkFBSyxLQUFLLEdBQUcsS0FBSztBQUNsQixpQkFBSyxLQUFLLFFBQVEsR0FBRyxLQUFLO0FBQzFCLGlCQUFLLGdCQUFnQixPQUFPQSxLQUFJO0FBQUEsVUFDMUMsQ0FBUztBQUFBLFFBQ1QsR0FBUyxPQUFPLEtBQUssV0FBVyxXQUFXLEtBQUssU0FBUyxHQUFHO0FBQ3RELGVBQU87QUFBQSxNQUNSO0FBQ0QsVUFBSSxVQUFVLFVBQVUsS0FBSyxnQkFBZ0IsSUFBSUEsS0FBSSxHQUFHO0FBQ3RELGdCQUFRLEtBQUssS0FBSztBQUNsQixhQUFLLGdCQUFnQixPQUFPQSxLQUFJO0FBQUEsTUFDakM7QUFBQSxJQUNGO0FBRUQsUUFBSSxRQUFRLFVBQVUsVUFBVSxVQUFVLGNBQWMsS0FBSyxlQUFlO0FBQzFFLFlBQU0sVUFBVSxDQUFDLEtBQUssVUFBVTtBQUM5QixZQUFJLEtBQUs7QUFDUCxrQkFBUSxLQUFLLEtBQUs7QUFDbEIsZUFBSyxLQUFLO0FBQ1YsZUFBSyxZQUFZLE9BQU8sSUFBSTtBQUFBLFFBQzdCLFdBQVUsT0FBTztBQUVoQixjQUFJLEtBQUssU0FBUyxHQUFHO0FBQ25CLGlCQUFLLEtBQUs7QUFBQSxVQUNwQixPQUFlO0FBQ0wsaUJBQUssS0FBSyxLQUFLO0FBQUEsVUFDaEI7QUFDRCxlQUFLLFlBQVksT0FBTyxJQUFJO0FBQUEsUUFDN0I7QUFBQSxNQUNQO0FBRUksV0FBSyxrQkFBa0JBLE9BQU0sSUFBSSxvQkFBb0IsT0FBTyxPQUFPO0FBQ25FLGFBQU87QUFBQSxJQUNSO0FBRUQsUUFBSSxVQUFVLFdBQVc7QUFDdkIsWUFBTSxjQUFjLENBQUMsS0FBSyxVQUFVLFdBQVdBLE9BQU0sRUFBRTtBQUN2RCxVQUFJO0FBQWEsZUFBTztBQUFBLElBQ3pCO0FBRUQsUUFBSSxLQUFLLGNBQWMsU0FBUyxXQUM3QixVQUFVLFVBQVUsVUFBVSxjQUFjLFVBQVUsWUFDdkQ7QUFDQSxZQUFNLFdBQVcsS0FBSyxNQUFNLFFBQVEsS0FBSyxLQUFLLEtBQUtBLEtBQUksSUFBSUE7QUFDM0QsVUFBSTtBQUNKLFVBQUk7QUFDRixnQkFBUSxNQUFNLEtBQUssUUFBUTtBQUFBLE1BQ2pDLFNBQWEsS0FBUDtBQUFBLE1BQWM7QUFFaEIsVUFBSSxDQUFDLFNBQVMsS0FBSztBQUFRO0FBQzNCLFdBQUssS0FBSyxLQUFLO0FBQUEsSUFDaEI7QUFDRCxTQUFLLFlBQVksT0FBTyxJQUFJO0FBRTVCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFPQSxhQUFhLE9BQU87QUFDbEIsVUFBTSxPQUFPLFNBQVMsTUFBTTtBQUM1QixRQUFJLFNBQVMsU0FBUyxZQUFZLFNBQVMsY0FDeEMsQ0FBQyxLQUFLLFFBQVEsMEJBQTJCLFNBQVMsV0FBVyxTQUFTLFdBQ3ZFO0FBQ0EsV0FBSyxLQUFLLFVBQVUsS0FBSztBQUFBLElBQzFCO0FBQ0QsV0FBTyxTQUFTLEtBQUs7QUFBQSxFQUN2QjtBQUFBLEVBU0EsVUFBVSxZQUFZQSxPQUFNLFNBQVM7QUFDbkMsUUFBSSxDQUFDLEtBQUssV0FBVyxJQUFJLFVBQVUsR0FBRztBQUNwQyxXQUFLLFdBQVcsSUFBSSxZQUFZLG9CQUFJLElBQUssQ0FBQTtBQUFBLElBQzFDO0FBR0QsVUFBTSxTQUFTLEtBQUssV0FBVyxJQUFJLFVBQVU7QUFFN0MsVUFBTSxhQUFhLE9BQU8sSUFBSUEsS0FBSTtBQUVsQyxRQUFJLFlBQVk7QUFDZCxpQkFBVztBQUNYLGFBQU87QUFBQSxJQUNSO0FBRUQsUUFBSTtBQUNKLFVBQU0sUUFBUSxNQUFNO0FBQ2xCLFlBQU0sT0FBTyxPQUFPLElBQUlBLEtBQUk7QUFDNUIsWUFBTSxRQUFRLE9BQU8sS0FBSyxRQUFRO0FBQ2xDLGFBQU8sT0FBT0EsS0FBSTtBQUNsQixtQkFBYSxhQUFhO0FBQzFCLFVBQUk7QUFBTSxxQkFBYSxLQUFLLGFBQWE7QUFDekMsYUFBTztBQUFBLElBQ1g7QUFDRSxvQkFBZ0IsV0FBVyxPQUFPLE9BQU87QUFDekMsVUFBTSxNQUFNLEVBQUMsZUFBZSxPQUFPLE9BQU8sRUFBQztBQUMzQyxXQUFPLElBQUlBLE9BQU0sR0FBRztBQUNwQixXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsa0JBQWtCO0FBQ2hCLFdBQU8sS0FBSztBQUFBLEVBQ2Q7QUFBQSxFQVVBLGtCQUFrQkEsT0FBTSxXQUFXLE9BQU8sU0FBUztBQUNqRCxRQUFJO0FBRUosUUFBSSxXQUFXQTtBQUNmLFFBQUksS0FBSyxRQUFRLE9BQU8sQ0FBQyxRQUFRLFdBQVdBLEtBQUksR0FBRztBQUNqRCxpQkFBVyxRQUFRLEtBQUssS0FBSyxRQUFRLEtBQUtBLEtBQUk7QUFBQSxJQUMvQztBQUVELFVBQU0sTUFBTSxJQUFJO0FBRWhCLFVBQU0sbUJBQW1CLENBQUMsYUFBYTtBQUNyQyxTQUFHLEtBQUssVUFBVSxDQUFDLEtBQUssWUFBWTtBQUNsQyxZQUFJLE9BQU8sQ0FBQyxLQUFLLGVBQWUsSUFBSUEsS0FBSSxHQUFHO0FBQ3pDLGNBQUksT0FBTyxJQUFJLFNBQVM7QUFBVSxvQkFBUSxHQUFHO0FBQzdDO0FBQUEsUUFDRDtBQUVELGNBQU1rTCxPQUFNLE9BQU8sSUFBSSxLQUFNLENBQUE7QUFFN0IsWUFBSSxZQUFZLFFBQVEsU0FBUyxTQUFTLE1BQU07QUFDOUMsZUFBSyxlQUFlLElBQUlsTCxLQUFJLEVBQUUsYUFBYWtMO0FBQUEsUUFDNUM7QUFDRCxjQUFNLEtBQUssS0FBSyxlQUFlLElBQUlsTCxLQUFJO0FBQ3ZDLGNBQU0sS0FBS2tMLE9BQU0sR0FBRztBQUVwQixZQUFJLE1BQU0sV0FBVztBQUNuQixlQUFLLGVBQWUsT0FBT2xMLEtBQUk7QUFDL0Isa0JBQVEsUUFBVyxPQUFPO0FBQUEsUUFDbEMsT0FBYTtBQUNMLDJCQUFpQjtBQUFBLFlBQ2Y7QUFBQSxZQUNBLEtBQUssUUFBUSxpQkFBaUI7QUFBQSxZQUM5QjtBQUFBLFVBQ1Y7QUFBQSxRQUNPO0FBQUEsTUFDUCxDQUFLO0FBQUEsSUFDTDtBQUVFLFFBQUksQ0FBQyxLQUFLLGVBQWUsSUFBSUEsS0FBSSxHQUFHO0FBQ2xDLFdBQUssZUFBZSxJQUFJQSxPQUFNO0FBQUEsUUFDNUIsWUFBWTtBQUFBLFFBQ1osWUFBWSxNQUFNO0FBQ2hCLGVBQUssZUFBZSxPQUFPQSxLQUFJO0FBQy9CLHVCQUFhLGNBQWM7QUFDM0IsaUJBQU87QUFBQSxRQUNSO0FBQUEsTUFDUCxDQUFLO0FBQ0QsdUJBQWlCO0FBQUEsUUFDZjtBQUFBLFFBQ0EsS0FBSyxRQUFRLGlCQUFpQjtBQUFBLE1BQ3BDO0FBQUEsSUFDRztBQUFBLEVBQ0g7QUFBQSxFQUVBLGtCQUFrQjtBQUNoQixXQUFPLENBQUMsR0FBRyxLQUFLLGNBQWMsT0FBUSxDQUFBO0FBQUEsRUFDeEM7QUFBQSxFQVFBLFdBQVdBLE9BQU0sT0FBTztBQUN0QixRQUFJLEtBQUssUUFBUSxVQUFVLE9BQU8sS0FBS0EsS0FBSTtBQUFHLGFBQU87QUFDckQsUUFBSSxDQUFDLEtBQUssY0FBYztBQUN0QixZQUFNLEVBQUMsS0FBQWlMLEtBQUcsSUFBSSxLQUFLO0FBQ25CLFlBQU0sTUFBTSxLQUFLLFFBQVE7QUFFekIsWUFBTSxVQUFVLE9BQU8sSUFBSSxJQUFJLGlCQUFpQkEsSUFBRyxDQUFDO0FBQ3BELFlBQU0sUUFBUSxPQUFPLE9BQU8sRUFDekIsT0FBTyxDQUFDakwsVUFBUyxPQUFPQSxVQUFTLGVBQWUsQ0FBQyxPQUFPQSxLQUFJLENBQUMsRUFDN0QsSUFBSSxDQUFDQSxVQUFTQSxRQUFPLGNBQWM7QUFDdEMsWUFBTSxPQUFPLEtBQUssZ0JBQWUsRUFBRyxJQUFJLGlCQUFpQmlMLElBQUcsQ0FBQyxFQUFFLE9BQU8sU0FBUyxLQUFLO0FBQ3BGLFdBQUssZUFBZSxTQUFTLE1BQU0sUUFBVyxhQUFhO0FBQUEsSUFDNUQ7QUFFRCxXQUFPLEtBQUssYUFBYSxDQUFDakwsT0FBTSxLQUFLLENBQUM7QUFBQSxFQUN4QztBQUFBLEVBRUEsYUFBYUEsT0FBTXNDLE9BQU07QUFDdkIsV0FBTyxDQUFDLEtBQUssV0FBV3RDLE9BQU1zQyxLQUFJO0FBQUEsRUFDcEM7QUFBQSxFQVFBLGlCQUFpQnRDLE9BQU1zSSxRQUFPO0FBQzVCLFVBQU0sWUFBWUEsVUFBUyxLQUFLLFFBQVEsbUJBQW1CLENBQUMsT0FBT3RJLEtBQUksSUFBSUEsUUFBTyxXQUFXQSxLQUFJO0FBQ2pHLFVBQU0sU0FBUyxLQUFLLFFBQVE7QUFFNUIsV0FBTyxJQUFJLFlBQVlBLE9BQU0sV0FBVyxRQUFRLElBQUk7QUFBQSxFQUN0RDtBQUFBLEVBVUEsZUFBZSxXQUFXO0FBQ3hCLFFBQUksQ0FBQyxLQUFLO0FBQWMsV0FBSyxlQUFlLEtBQUssUUFBUSxLQUFLLElBQUk7QUFDbEUsVUFBTSxNQUFNLFFBQVEsUUFBUSxTQUFTO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxHQUFHO0FBQUcsV0FBSyxTQUFTLElBQUksS0FBSyxJQUFJLFNBQVMsS0FBSyxLQUFLLFlBQVksQ0FBQztBQUN4RixXQUFPLEtBQUssU0FBUyxJQUFJLEdBQUc7QUFBQSxFQUM5QjtBQUFBLEVBV0Esb0JBQW9CLE9BQU87QUFDekIsUUFBSSxLQUFLLFFBQVE7QUFBd0IsYUFBTztBQUdoRCxVQUFNLEtBQUssU0FBUyxPQUFPLFNBQVMsTUFBTSxNQUFNLEVBQUU7QUFDbEQsVUFBTSxLQUFLLEtBQUs7QUFDaEIsVUFBTSxLQUFLLE9BQU8sU0FBUyxHQUFHLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRTtBQUNoRCxXQUFPLFFBQVEsSUFBSSxFQUFFO0FBQUEsRUFDdkI7QUFBQSxFQVVBLFFBQVEsV0FBVyxNQUFNLGFBQWE7QUFJcEMsVUFBTUEsUUFBTyxRQUFRLEtBQUssV0FBVyxJQUFJO0FBQ3pDLFVBQU0sV0FBVyxRQUFRLFFBQVFBLEtBQUk7QUFDckMsa0JBQWMsZUFBZSxPQUN6QixjQUNBLEtBQUssU0FBUyxJQUFJQSxLQUFJLEtBQUssS0FBSyxTQUFTLElBQUksUUFBUTtBQUl6RCxRQUFJLENBQUMsS0FBSyxVQUFVLFVBQVVBLE9BQU0sR0FBRztBQUFHO0FBRzFDLFFBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxRQUFRLGVBQWUsS0FBSyxTQUFTLFNBQVMsR0FBRztBQUN6RSxXQUFLLElBQUksV0FBVyxNQUFNLElBQUk7QUFBQSxJQUMvQjtBQUlELFVBQU0sS0FBSyxLQUFLLGVBQWVBLEtBQUk7QUFDbkMsVUFBTSwwQkFBMEIsR0FBRztBQUduQyw0QkFBd0IsUUFBUSxZQUFVLEtBQUssUUFBUUEsT0FBTSxNQUFNLENBQUM7QUFHcEUsVUFBTSxTQUFTLEtBQUssZUFBZSxTQUFTO0FBQzVDLFVBQU0sYUFBYSxPQUFPLElBQUksSUFBSTtBQUNsQyxXQUFPLE9BQU8sSUFBSTtBQU9sQixRQUFJLEtBQUssY0FBYyxJQUFJLFFBQVEsR0FBRztBQUNwQyxXQUFLLGNBQWMsT0FBTyxRQUFRO0FBQUEsSUFDbkM7QUFHRCxRQUFJLFVBQVVBO0FBQ2QsUUFBSSxLQUFLLFFBQVE7QUFBSyxnQkFBVSxRQUFRLFNBQVMsS0FBSyxRQUFRLEtBQUtBLEtBQUk7QUFDdkUsUUFBSSxLQUFLLFFBQVEsb0JBQW9CLEtBQUssZUFBZSxJQUFJLE9BQU8sR0FBRztBQUNyRSxZQUFNLFFBQVEsS0FBSyxlQUFlLElBQUksT0FBTyxFQUFFO0FBQy9DLFVBQUksVUFBVTtBQUFRO0FBQUEsSUFDdkI7QUFJRCxTQUFLLFNBQVMsT0FBT0EsS0FBSTtBQUN6QixTQUFLLFNBQVMsT0FBTyxRQUFRO0FBQzdCLFVBQU0sWUFBWSxjQUFjLGdCQUFnQjtBQUNoRCxRQUFJLGNBQWMsQ0FBQyxLQUFLLFdBQVdBLEtBQUk7QUFBRyxXQUFLLE1BQU0sV0FBV0EsS0FBSTtBQUdwRSxRQUFJLENBQUMsS0FBSyxRQUFRLGFBQWE7QUFDN0IsV0FBSyxXQUFXQSxLQUFJO0FBQUEsSUFDckI7QUFBQSxFQUNIO0FBQUEsRUFNQSxXQUFXQSxPQUFNO0FBQ2YsU0FBSyxXQUFXQSxLQUFJO0FBQ3BCLFVBQU0sTUFBTSxRQUFRLFFBQVFBLEtBQUk7QUFDaEMsU0FBSyxlQUFlLEdBQUcsRUFBRSxPQUFPLFFBQVEsU0FBU0EsS0FBSSxDQUFDO0FBQUEsRUFDeEQ7QUFBQSxFQU1BLFdBQVdBLE9BQU07QUFDZixVQUFNLFVBQVUsS0FBSyxTQUFTLElBQUlBLEtBQUk7QUFDdEMsUUFBSSxDQUFDO0FBQVM7QUFDZCxZQUFRLFFBQVEsWUFBVSxPQUFRLENBQUE7QUFDbEMsU0FBSyxTQUFTLE9BQU9BLEtBQUk7QUFBQSxFQUMzQjtBQUFBLEVBT0EsZUFBZUEsT0FBTSxRQUFRO0FBQzNCLFFBQUksQ0FBQztBQUFRO0FBQ2IsUUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJQSxLQUFJO0FBQ2pDLFFBQUksQ0FBQyxNQUFNO0FBQ1QsYUFBTyxDQUFBO0FBQ1AsV0FBSyxTQUFTLElBQUlBLE9BQU0sSUFBSTtBQUFBLElBQzdCO0FBQ0QsU0FBSyxLQUFLLE1BQU07QUFBQSxFQUNsQjtBQUFBLEVBRUEsVUFBVSxNQUFNLE1BQU07QUFDcEIsUUFBSSxLQUFLO0FBQVE7QUFDakIsVUFBTSxVQUFVLEVBQUMsTUFBTSxRQUFRLFlBQVksTUFBTSxPQUFPLE1BQU0sR0FBRyxLQUFJO0FBQ3JFLFFBQUksU0FBUyxTQUFTLE1BQU0sT0FBTztBQUNuQyxTQUFLLFNBQVMsSUFBSSxNQUFNO0FBQ3hCLFdBQU8sS0FBSyxXQUFXLE1BQU07QUFDM0IsZUFBUztBQUFBLElBQ2IsQ0FBRztBQUNELFdBQU8sS0FBSyxTQUFTLE1BQU07QUFDekIsVUFBSSxRQUFRO0FBQ1YsYUFBSyxTQUFTLE9BQU8sTUFBTTtBQUMzQixpQkFBUztBQUFBLE1BQ1Y7QUFBQSxJQUNMLENBQUc7QUFDRCxXQUFPO0FBQUEsRUFDVDtBQUVBO0FBR2lCLFNBQUEsWUFBRztBQVFwQixNQUFNLFFBQVEsQ0FBQyxPQUFPLFlBQVk7QUFDaEMsUUFBTSxVQUFVLElBQUksVUFBVSxPQUFPO0FBQ3JDLFVBQVEsSUFBSSxLQUFLO0FBQ2pCLFNBQU87QUFDVDtBQUVBLFNBQUEsUUFBZ0I7QUMvN0JoQixNQUFNLGtCQUFrQixDQUFBO0FBRWpCLE1BQU0seUJBQXlCO0FBQUEsRUFFcEMsU0FBUyxDQUFDLEdBQUVBLFVBQVM7QUFDbkIsVUFBTSxXQUFXLENBQUE7QUFFWCxVQUFBLFNBQVNtTCxzQkFBQUEsV0FBRyxZQUFZbkwsS0FBSTtBQUNsQyxlQUFVLEtBQUssUUFBTztBQUNwQixZQUFNc0MsUUFBTzZJLHNCQUFHLFdBQUEsVUFBVUMsb0JBQUFBLFdBQUssS0FBS3BMLE9BQUssQ0FBQyxDQUFDO0FBQ3hDLFVBQUEsRUFBRSxXQUFXLE1BQU0sS0FBSyxFQUFFLFdBQVcsTUFBTSxLQUFLLEVBQUUsV0FBVyxNQUFNO0FBQ3BFO0FBRUcsTUFBQXNDLE1BQUEsS0FBS3RDLFFBQUssTUFBSTtBQUNkLE1BQUFzQyxNQUFBLGNBQWNBLE1BQUs7QUFDeEIsZUFBUyxLQUFLQSxLQUFJO0FBQUEsSUFDcEI7QUFFTyxXQUFBO0FBQUEsRUFDVDtBQUFBLEVBRUEsV0FBVyxZQUFVO0FBQ2IsVUFBQTdDLFVBQVNGLHVCQUFjLGdCQUFnQixLQUFLLENBQUssTUFBQSxDQUFDLEVBQUUsWUFBQSxDQUFhO0FBQ3ZFLFVBQU0sU0FBUyxNQUFNOEwsZ0JBQU8sZUFBZTVMLFNBQVE7QUFBQSxNQUNqRCxZQUFZLENBQUMsZUFBZTtBQUFBLElBQUEsQ0FDN0I7QUFDRCxXQUFPLE9BQU8sVUFBVTtBQUFBLEVBQzFCO0FBQUEsRUFFQSxXQUFXLFlBQVU7QUFDYixVQUFBQSxVQUFTRix1QkFBYyxnQkFBZ0IsS0FBSyxDQUFLLE1BQUEsQ0FBQyxFQUFFLFlBQUEsQ0FBYTtBQUN2RSxVQUFNLFNBQVMsTUFBTThMLGdCQUFPLGVBQWU1TCxTQUFRO0FBQUEsTUFDakQsWUFBWSxDQUFDLFlBQVcsaUJBQWlCO0FBQUEsSUFBQSxDQUMxQztBQUNELFdBQU8sT0FBTztBQUFBLEVBQ2hCO0FBQUEsRUFFQSxVQUFVLFlBQVU7QUFDWixVQUFBQSxVQUFTRix1QkFBYyxnQkFBZ0IsS0FBSyxDQUFLLE1BQUEsQ0FBQyxFQUFFLFlBQUEsQ0FBYTtBQUN2RSxVQUFNLFNBQVMsTUFBTThMLFNBQUFBLE9BQU8sZUFBZTVMLE9BQU07QUFDakQsV0FBTyxPQUFPO0FBQUEsRUFDaEI7QUFBQSxFQUVBLFVBQVUsQ0FBQyxHQUFFTyxVQUFPO0FBQ2xCLFdBQU9tTCxzQkFBQUEsV0FBRyxhQUFhbkwsT0FBSyxFQUFDLFVBQVMsU0FBUTtBQUFBLEVBQ2hEO0FBQUEsRUFFQSxNQUFNLE9BQU8sR0FBRSxDQUFDLEtBQUksR0FBRyxNQUFJO0FBQ3pCLFVBQU0sT0FBTyxJQUFJLE1BQU0sR0FBRyxFQUFFLElBQUk7QUFDNUIsUUFBQTtBQUNFLFVBQUEsU0FBUyxLQUFLLE1BQUksTUFBSSxNQUFNLEVBQUUsV0FBVyxNQUFNO0FBQzVDLGFBQUE7QUFBQSxhQUNBO0FBQ1AsY0FBUSxNQUFNLEdBQUc7QUFDVixhQUFBO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFBQSxFQUVBLHdCQUF3QixPQUFPLEdBQUVBLFVBQU87QUFFdEMsb0JBQWdCQSxTQUFRLFNBQVMsTUFBTUEsT0FBSyxFQUFDLGVBQWMsTUFBSztBQUUxRCxVQUFBLGFBQWEsQ0FBQUEsV0FBUTtBQUNuQixZQUFBUCxVQUFTRix1QkFBYyxnQkFBZ0IsS0FBSyxDQUFLLE1BQUEsQ0FBQyxFQUFFLFlBQUEsQ0FBYTtBQUNoRSxNQUFBRSxRQUFBLFlBQVksS0FBSyxxQ0FBcUNPLE1BQUk7QUFBQSxJQUFBO0FBRTdELFVBQUEsbUJBQW1CLENBQUFBLFdBQVE7QUFDbkJBLGlCQUFBQSxPQUFLLE1BQU0sR0FBRyxFQUFFLE1BQU0sR0FBRSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUU7QUFBQSxJQUFBO0FBR3BELG9CQUFnQkEsT0FJYixHQUFHLE9BQU8sZ0JBQWdCLEVBQzFCLEdBQUcsVUFBVSxnQkFBZ0IsRUFDN0IsR0FBRyxVQUFVLGdCQUFnQixFQUM3QixHQUFHLGFBQWEsZ0JBQWdCO0FBR25DO0FBQUEsRUFDRjtBQUFBLEVBRUEsMEJBQTBCLE9BQU8sR0FBRUEsVUFBTztBQUV4QyxVQUFNLFVBQVUsZ0JBQWdCQTtBQUNoQyxRQUFHLENBQUM7QUFDRjtBQUVGLFVBQU0sUUFBUTtBQUNkLFdBQU8sZ0JBQWdCQTtBQUN2QjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLGlCQUFpQixPQUFPLEdBQUVBLFVBQU87QUFDL0IsVUFBTSxRQUFTQSxNQUFLLE1BQU0sRUFBRSxNQUFJLFNBQVNBLE1BQUssTUFBTSxFQUFFLE1BQUksU0FBVUEsUUFBT0EsUUFBTTtBQUM5RW1MLDBCQUFBQSxXQUFBLGNBQWMsT0FBTSxFQUFFO0FBQ2xCLFdBQUE7QUFBQSxFQUNUO0FBQUEsRUFFQSxXQUFXLE9BQU8sR0FBRSxDQUFDbkwsT0FBSyxJQUFJLE1BQUk7QUFDaEMsV0FBT21MLHNCQUFBQSxXQUFHLGNBQWNuTCxPQUFLLE1BQUssRUFBQyxVQUFTLFNBQVE7QUFBQSxFQUN0RDtBQUFBLEVBRUEsTUFBTSxZQUFZO0FBQ2hCLFlBQVEsR0FBRyxzQkFBc0IsQ0FBQyxRQUFRLE1BQU07QUFDOUMsY0FBUSxNQUFNLDJCQUEyQmMsK0JBQUssUUFBUSxDQUFDLGFBQWEsUUFBUTtBQUFBLElBQUEsQ0FDN0U7QUFFT3dLLGFBQUFBLFFBQUEsT0FBTyxrQ0FBa0MsdUJBQXVCLE9BQU87QUFDdkVBLGFBQUFBLFFBQUEsT0FBTyxtQ0FBbUMsdUJBQXVCLFFBQVE7QUFDekVBLGFBQUFBLFFBQUEsT0FBTyxvQ0FBb0MsdUJBQXVCLFNBQVM7QUFDM0VBLGFBQUFBLFFBQUEsT0FBTyxvQ0FBb0MsdUJBQXVCLFNBQVM7QUFDM0VBLGFBQUFBLFFBQUEsT0FBTyxvQ0FBb0MsdUJBQXVCLFNBQVM7QUFDM0VBLGFBQUFBLFFBQUEsT0FBTyxtQ0FBbUMsdUJBQXVCLFFBQVE7QUFDekVBLGFBQUFBLFFBQUEsT0FBTywrQkFBK0IsdUJBQXVCLElBQUk7QUFDakVBLGFBQUFBLFFBQUEsT0FBTywwQ0FBMEMsdUJBQXVCLGVBQWU7QUFDdkZBLGFBQUFBLFFBQUEsT0FBTyxpREFBaUQsdUJBQXVCLHNCQUFzQjtBQUNyR0EsYUFBQUEsUUFBQSxPQUFPLG1EQUFtRCx1QkFBdUIsd0JBQXdCO0FBQUEsRUFDbkg7QUFDRjtBQy9IQSxNQUFNLFFBQVE7QUFDZCxNQUFNLGdCQUFnQixJQUFJLE9BQU8sTUFBTSxRQUFRLGNBQWMsSUFBSTtBQUNqRSxNQUFNLGVBQWUsSUFBSSxPQUFPLE1BQU0sUUFBUSxNQUFNLElBQUk7QUFFeEQsU0FBUyxpQkFBaUIsWUFBWSxPQUFPO0FBQzVDLE1BQUk7QUFFSCxXQUFPLENBQUMsbUJBQW1CLFdBQVcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUFBLEVBQ2pELFFBQUc7QUFBQSxFQUVEO0FBRUQsTUFBSSxXQUFXLFdBQVcsR0FBRztBQUM1QixXQUFPO0FBQUEsRUFDUDtBQUVELFVBQVEsU0FBUztBQUdqQixRQUFNLE9BQU8sV0FBVyxNQUFNLEdBQUcsS0FBSztBQUN0QyxRQUFNLFFBQVEsV0FBVyxNQUFNLEtBQUs7QUFFcEMsU0FBTyxNQUFNLFVBQVUsT0FBTyxLQUFLLENBQUEsR0FBSSxpQkFBaUIsSUFBSSxHQUFHLGlCQUFpQixLQUFLLENBQUM7QUFDdkY7QUFFQSxTQUFTQyxTQUFPLE9BQU87QUFDdEIsTUFBSTtBQUNILFdBQU8sbUJBQW1CLEtBQUs7QUFBQSxFQUNqQyxRQUFHO0FBQ0QsUUFBSSxTQUFTLE1BQU0sTUFBTSxhQUFhLEtBQUssQ0FBQTtBQUUzQyxhQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLO0FBQ3ZDLGNBQVEsaUJBQWlCLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUUzQyxlQUFTLE1BQU0sTUFBTSxhQUFhLEtBQUssQ0FBQTtBQUFBLElBQ3ZDO0FBRUQsV0FBTztBQUFBLEVBQ1A7QUFDRjtBQUVBLFNBQVMseUJBQXlCLE9BQU87QUFFeEMsUUFBTSxhQUFhO0FBQUEsSUFDbEIsVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLEVBQ1o7QUFFQyxNQUFJLFFBQVEsYUFBYSxLQUFLLEtBQUs7QUFDbkMsU0FBTyxPQUFPO0FBQ2IsUUFBSTtBQUVILGlCQUFXLE1BQU0sTUFBTSxtQkFBbUIsTUFBTSxFQUFFO0FBQUEsSUFDckQsUUFBSTtBQUNELFlBQU0sU0FBU0EsU0FBTyxNQUFNLEVBQUU7QUFFOUIsVUFBSSxXQUFXLE1BQU0sSUFBSTtBQUN4QixtQkFBVyxNQUFNLE1BQU07QUFBQSxNQUN2QjtBQUFBLElBQ0Q7QUFFRCxZQUFRLGFBQWEsS0FBSyxLQUFLO0FBQUEsRUFDL0I7QUFHRCxhQUFXLFNBQVM7QUFFcEIsUUFBTSxVQUFVLE9BQU8sS0FBSyxVQUFVO0FBRXRDLGFBQVcsT0FBTyxTQUFTO0FBRTFCLFlBQVEsTUFBTSxRQUFRLElBQUksT0FBTyxLQUFLLEdBQUcsR0FBRyxXQUFXLElBQUk7QUFBQSxFQUMzRDtBQUVELFNBQU87QUFDUjtBQUVlLFNBQVMsbUJBQW1CLFlBQVk7QUFDdEQsTUFBSSxPQUFPLGVBQWUsVUFBVTtBQUNuQyxVQUFNLElBQUksVUFBVSx3REFBd0QsT0FBTyxhQUFhLEdBQUc7QUFBQSxFQUNuRztBQUVELE1BQUk7QUFFSCxXQUFPLG1CQUFtQixVQUFVO0FBQUEsRUFDdEMsUUFBRztBQUVELFdBQU8seUJBQXlCLFVBQVU7QUFBQSxFQUMxQztBQUNGO0FDekZlLFNBQVMsYUFBYSxRQUFRLFdBQVc7QUFDdkQsTUFBSSxFQUFFLE9BQU8sV0FBVyxZQUFZLE9BQU8sY0FBYyxXQUFXO0FBQ25FLFVBQU0sSUFBSSxVQUFVLCtDQUErQztBQUFBLEVBQ25FO0FBRUQsTUFBSSxXQUFXLE1BQU0sY0FBYyxJQUFJO0FBQ3RDLFdBQU87RUFDUDtBQUVELFFBQU0saUJBQWlCLE9BQU8sUUFBUSxTQUFTO0FBRS9DLE1BQUksbUJBQW1CLElBQUk7QUFDMUIsV0FBTztFQUNQO0FBRUQsU0FBTztBQUFBLElBQ04sT0FBTyxNQUFNLEdBQUcsY0FBYztBQUFBLElBQzlCLE9BQU8sTUFBTSxpQkFBaUIsVUFBVSxNQUFNO0FBQUEsRUFDaEQ7QUFDQTtBQ25CTyxTQUFTLFlBQVksUUFBUSxXQUFXO0FBQzlDLFFBQU0sU0FBUyxDQUFBO0FBRWYsTUFBSSxNQUFNLFFBQVEsU0FBUyxHQUFHO0FBQzdCLGVBQVcsT0FBTyxXQUFXO0FBQzVCLFlBQU0sYUFBYSxPQUFPLHlCQUF5QixRQUFRLEdBQUc7QUFDOUQsVUFBSSx5Q0FBWSxZQUFZO0FBQzNCLGVBQU8sZUFBZSxRQUFRLEtBQUssVUFBVTtBQUFBLE1BQzdDO0FBQUEsSUFDRDtBQUFBLEVBQ0gsT0FBUTtBQUVOLGVBQVcsT0FBTyxRQUFRLFFBQVEsTUFBTSxHQUFHO0FBQzFDLFlBQU0sYUFBYSxPQUFPLHlCQUF5QixRQUFRLEdBQUc7QUFDOUQsVUFBSSxXQUFXLFlBQVk7QUFDMUIsY0FBTSxRQUFRLE9BQU87QUFDckIsWUFBSSxVQUFVLEtBQUssT0FBTyxNQUFNLEdBQUc7QUFDbEMsaUJBQU8sZUFBZSxRQUFRLEtBQUssVUFBVTtBQUFBLFFBQzdDO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBRUQsU0FBTztBQUNSO0FDcEJBLE1BQU0sb0JBQW9CLFdBQVMsVUFBVSxRQUFRLFVBQVU7QUFHL0QsTUFBTSxrQkFBa0IsWUFBVSxtQkFBbUIsTUFBTSxFQUFFLFFBQVEsWUFBWSxPQUFLLElBQUksRUFBRSxXQUFXLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxZQUFXLEdBQUk7QUFFdEksTUFBTSwyQkFBMkIsT0FBTywwQkFBMEI7QUFFbEUsU0FBUyxzQkFBc0IsU0FBUztBQUN2QyxVQUFRLFFBQVE7QUFBQSxTQUNWLFNBQVM7QUFDYixhQUFPLFNBQU8sQ0FBQyxRQUFRLFVBQVU7QUFDaEMsY0FBTSxRQUFRLE9BQU87QUFFckIsWUFDQyxVQUFVLFVBQ04sUUFBUSxZQUFZLFVBQVUsUUFDOUIsUUFBUSxtQkFBbUIsVUFBVSxJQUN4QztBQUNELGlCQUFPO0FBQUEsUUFDUDtBQUVELFlBQUksVUFBVSxNQUFNO0FBQ25CLGlCQUFPO0FBQUEsWUFDTixHQUFHO0FBQUEsWUFBUSxDQUFDLE9BQU8sS0FBSyxPQUFPLEdBQUcsS0FBSyxPQUFPLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFBQSxVQUNoRTtBQUFBLFFBQ0s7QUFFRCxlQUFPO0FBQUEsVUFDTixHQUFHO0FBQUEsVUFDSCxDQUFDLE9BQU8sS0FBSyxPQUFPLEdBQUcsS0FBSyxPQUFPLE9BQU8sT0FBTyxHQUFHLE1BQU0sT0FBTyxPQUFPLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUFBLFFBQzlGO0FBQUEsTUFDQTtBQUFBLElBQ0c7QUFBQSxTQUVJLFdBQVc7QUFDZixhQUFPLFNBQU8sQ0FBQyxRQUFRLFVBQVU7QUFDaEMsWUFDQyxVQUFVLFVBQ04sUUFBUSxZQUFZLFVBQVUsUUFDOUIsUUFBUSxtQkFBbUIsVUFBVSxJQUN4QztBQUNELGlCQUFPO0FBQUEsUUFDUDtBQUVELFlBQUksVUFBVSxNQUFNO0FBQ25CLGlCQUFPO0FBQUEsWUFDTixHQUFHO0FBQUEsWUFDSCxDQUFDLE9BQU8sS0FBSyxPQUFPLEdBQUcsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUFBLFVBQzFDO0FBQUEsUUFDSztBQUVELGVBQU87QUFBQSxVQUNOLEdBQUc7QUFBQSxVQUNILENBQUMsT0FBTyxLQUFLLE9BQU8sR0FBRyxPQUFPLE9BQU8sT0FBTyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFBQSxRQUNsRTtBQUFBLE1BQ0E7QUFBQSxJQUNHO0FBQUEsU0FFSSx3QkFBd0I7QUFDNUIsYUFBTyxTQUFPLENBQUMsUUFBUSxVQUFVO0FBQ2hDLFlBQ0MsVUFBVSxVQUNOLFFBQVEsWUFBWSxVQUFVLFFBQzlCLFFBQVEsbUJBQW1CLFVBQVUsSUFDeEM7QUFDRCxpQkFBTztBQUFBLFFBQ1A7QUFFRCxZQUFJLFVBQVUsTUFBTTtBQUNuQixpQkFBTztBQUFBLFlBQ04sR0FBRztBQUFBLFlBQ0gsQ0FBQyxPQUFPLEtBQUssT0FBTyxHQUFHLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFBQSxVQUM5QztBQUFBLFFBQ0s7QUFFRCxlQUFPO0FBQUEsVUFDTixHQUFHO0FBQUEsVUFDSCxDQUFDLE9BQU8sS0FBSyxPQUFPLEdBQUcsVUFBVSxPQUFPLE9BQU8sT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQUEsUUFDckU7QUFBQSxNQUNBO0FBQUEsSUFDRztBQUFBLFNBRUk7QUFBQSxTQUNBO0FBQUEsU0FDQSxxQkFBcUI7QUFDekIsWUFBTSxjQUFjLFFBQVEsZ0JBQWdCLHNCQUN6QyxRQUNBO0FBRUgsYUFBTyxTQUFPLENBQUMsUUFBUSxVQUFVO0FBQ2hDLFlBQ0MsVUFBVSxVQUNOLFFBQVEsWUFBWSxVQUFVLFFBQzlCLFFBQVEsbUJBQW1CLFVBQVUsSUFDeEM7QUFDRCxpQkFBTztBQUFBLFFBQ1A7QUFHRCxnQkFBUSxVQUFVLE9BQU8sS0FBSztBQUU5QixZQUFJLE9BQU8sV0FBVyxHQUFHO0FBQ3hCLGlCQUFPLENBQUMsQ0FBQyxPQUFPLEtBQUssT0FBTyxHQUFHLGFBQWEsT0FBTyxPQUFPLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQUEsUUFDNUU7QUFFRCxlQUFPLENBQUMsQ0FBQyxRQUFRLE9BQU8sT0FBTyxPQUFPLENBQUMsRUFBRSxLQUFLLFFBQVEsb0JBQW9CLENBQUM7QUFBQSxNQUMvRTtBQUFBLElBQ0c7QUFBQSxhQUVRO0FBQ1IsYUFBTyxTQUFPLENBQUMsUUFBUSxVQUFVO0FBQ2hDLFlBQ0MsVUFBVSxVQUNOLFFBQVEsWUFBWSxVQUFVLFFBQzlCLFFBQVEsbUJBQW1CLFVBQVUsSUFDeEM7QUFDRCxpQkFBTztBQUFBLFFBQ1A7QUFFRCxZQUFJLFVBQVUsTUFBTTtBQUNuQixpQkFBTztBQUFBLFlBQ04sR0FBRztBQUFBLFlBQ0gsT0FBTyxLQUFLLE9BQU87QUFBQSxVQUN6QjtBQUFBLFFBQ0s7QUFFRCxlQUFPO0FBQUEsVUFDTixHQUFHO0FBQUEsVUFDSCxDQUFDLE9BQU8sS0FBSyxPQUFPLEdBQUcsS0FBSyxPQUFPLE9BQU8sT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQUEsUUFDaEU7QUFBQSxNQUNBO0FBQUEsSUFDRztBQUFBO0FBRUg7QUFFQSxTQUFTLHFCQUFxQixTQUFTO0FBQ3RDLE1BQUk7QUFFSixVQUFRLFFBQVE7QUFBQSxTQUNWLFNBQVM7QUFDYixhQUFPLENBQUMsS0FBSyxPQUFPLGdCQUFnQjtBQUNuQyxpQkFBUyxZQUFZLEtBQUssR0FBRztBQUU3QixjQUFNLElBQUksUUFBUSxXQUFXLEVBQUU7QUFFL0IsWUFBSSxDQUFDLFFBQVE7QUFDWixzQkFBWSxPQUFPO0FBQ25CO0FBQUEsUUFDQTtBQUVELFlBQUksWUFBWSxTQUFTLFFBQVc7QUFDbkMsc0JBQVksT0FBTztRQUNuQjtBQUVELG9CQUFZLEtBQUssT0FBTyxNQUFNO0FBQUEsTUFDbEM7QUFBQSxJQUNHO0FBQUEsU0FFSSxXQUFXO0FBQ2YsYUFBTyxDQUFDLEtBQUssT0FBTyxnQkFBZ0I7QUFDbkMsaUJBQVMsU0FBUyxLQUFLLEdBQUc7QUFDMUIsY0FBTSxJQUFJLFFBQVEsUUFBUSxFQUFFO0FBRTVCLFlBQUksQ0FBQyxRQUFRO0FBQ1osc0JBQVksT0FBTztBQUNuQjtBQUFBLFFBQ0E7QUFFRCxZQUFJLFlBQVksU0FBUyxRQUFXO0FBQ25DLHNCQUFZLE9BQU8sQ0FBQyxLQUFLO0FBQ3pCO0FBQUEsUUFDQTtBQUVELG9CQUFZLE9BQU8sQ0FBQyxHQUFHLFlBQVksTUFBTSxLQUFLO0FBQUEsTUFDbEQ7QUFBQSxJQUNHO0FBQUEsU0FFSSx3QkFBd0I7QUFDNUIsYUFBTyxDQUFDLEtBQUssT0FBTyxnQkFBZ0I7QUFDbkMsaUJBQVMsV0FBVyxLQUFLLEdBQUc7QUFDNUIsY0FBTSxJQUFJLFFBQVEsVUFBVSxFQUFFO0FBRTlCLFlBQUksQ0FBQyxRQUFRO0FBQ1osc0JBQVksT0FBTztBQUNuQjtBQUFBLFFBQ0E7QUFFRCxZQUFJLFlBQVksU0FBUyxRQUFXO0FBQ25DLHNCQUFZLE9BQU8sQ0FBQyxLQUFLO0FBQ3pCO0FBQUEsUUFDQTtBQUVELG9CQUFZLE9BQU8sQ0FBQyxHQUFHLFlBQVksTUFBTSxLQUFLO0FBQUEsTUFDbEQ7QUFBQSxJQUNHO0FBQUEsU0FFSTtBQUFBLFNBQ0EsYUFBYTtBQUNqQixhQUFPLENBQUMsS0FBSyxPQUFPLGdCQUFnQjtBQUNuQyxjQUFNLFVBQVUsT0FBTyxVQUFVLFlBQVksTUFBTSxTQUFTLFFBQVEsb0JBQW9CO0FBQ3hGLGNBQU0saUJBQWtCLE9BQU8sVUFBVSxZQUFZLENBQUMsV0FBVyxPQUFPLE9BQU8sT0FBTyxFQUFFLFNBQVMsUUFBUSxvQkFBb0I7QUFDN0gsZ0JBQVEsaUJBQWlCLE9BQU8sT0FBTyxPQUFPLElBQUk7QUFDbEQsY0FBTSxXQUFXLFdBQVcsaUJBQWlCLE1BQU0sTUFBTSxRQUFRLG9CQUFvQixFQUFFLElBQUksVUFBUSxPQUFPLE1BQU0sT0FBTyxDQUFDLElBQUssVUFBVSxPQUFPLFFBQVEsT0FBTyxPQUFPLE9BQU87QUFDM0ssb0JBQVksT0FBTztBQUFBLE1BQ3ZCO0FBQUEsSUFDRztBQUFBLFNBRUkscUJBQXFCO0FBQ3pCLGFBQU8sQ0FBQyxLQUFLLE9BQU8sZ0JBQWdCO0FBQ25DLGNBQU0sVUFBVSxTQUFTLEtBQUssR0FBRztBQUNqQyxjQUFNLElBQUksUUFBUSxRQUFRLEVBQUU7QUFFNUIsWUFBSSxDQUFDLFNBQVM7QUFDYixzQkFBWSxPQUFPLFFBQVEsT0FBTyxPQUFPLE9BQU8sSUFBSTtBQUNwRDtBQUFBLFFBQ0E7QUFFRCxjQUFNLGFBQWEsVUFBVSxPQUMxQixDQUFFLElBQ0YsTUFBTSxNQUFNLFFBQVEsb0JBQW9CLEVBQUUsSUFBSSxVQUFRLE9BQU8sTUFBTSxPQUFPLENBQUM7QUFFOUUsWUFBSSxZQUFZLFNBQVMsUUFBVztBQUNuQyxzQkFBWSxPQUFPO0FBQ25CO0FBQUEsUUFDQTtBQUVELG9CQUFZLE9BQU8sQ0FBQyxHQUFHLFlBQVksTUFBTSxHQUFHLFVBQVU7QUFBQSxNQUMxRDtBQUFBLElBQ0c7QUFBQSxhQUVRO0FBQ1IsYUFBTyxDQUFDLEtBQUssT0FBTyxnQkFBZ0I7QUFDbkMsWUFBSSxZQUFZLFNBQVMsUUFBVztBQUNuQyxzQkFBWSxPQUFPO0FBQ25CO0FBQUEsUUFDQTtBQUVELG9CQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLEVBQUUsUUFBUSxLQUFLO0FBQUEsTUFDM0Q7QUFBQSxJQUNHO0FBQUE7QUFFSDtBQUVBLFNBQVMsNkJBQTZCLE9BQU87QUFDNUMsTUFBSSxPQUFPLFVBQVUsWUFBWSxNQUFNLFdBQVcsR0FBRztBQUNwRCxVQUFNLElBQUksVUFBVSxzREFBc0Q7QUFBQSxFQUMxRTtBQUNGO0FBRUEsU0FBUyxPQUFPLE9BQU8sU0FBUztBQUMvQixNQUFJLFFBQVEsUUFBUTtBQUNuQixXQUFPLFFBQVEsU0FBUyxnQkFBZ0IsS0FBSyxJQUFJLG1CQUFtQixLQUFLO0FBQUEsRUFDekU7QUFFRCxTQUFPO0FBQ1I7QUFFQSxTQUFTLE9BQU8sT0FBTyxTQUFTO0FBQy9CLE1BQUksUUFBUSxRQUFRO0FBQ25CLFdBQU9DLG1CQUFnQixLQUFLO0FBQUEsRUFDNUI7QUFFRCxTQUFPO0FBQ1I7QUFFQSxTQUFTLFdBQVcsT0FBTztBQUMxQixNQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFDekIsV0FBTyxNQUFNO0VBQ2I7QUFFRCxNQUFJLE9BQU8sVUFBVSxVQUFVO0FBQzlCLFdBQU8sV0FBVyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQ2xDLEtBQUssQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsRUFDcEMsSUFBSSxTQUFPLE1BQU0sSUFBSTtBQUFBLEVBQ3ZCO0FBRUQsU0FBTztBQUNSO0FBRUEsU0FBUyxXQUFXLE9BQU87QUFDMUIsUUFBTSxZQUFZLE1BQU0sUUFBUSxHQUFHO0FBQ25DLE1BQUksY0FBYyxJQUFJO0FBQ3JCLFlBQVEsTUFBTSxNQUFNLEdBQUcsU0FBUztBQUFBLEVBQ2hDO0FBRUQsU0FBTztBQUNSO0FBRUEsU0FBUyxRQUFRbk0sTUFBSztBQUNyQixNQUFJLE9BQU87QUFDWCxRQUFNLFlBQVlBLEtBQUksUUFBUSxHQUFHO0FBQ2pDLE1BQUksY0FBYyxJQUFJO0FBQ3JCLFdBQU9BLEtBQUksTUFBTSxTQUFTO0FBQUEsRUFDMUI7QUFFRCxTQUFPO0FBQ1I7QUFFQSxTQUFTLFdBQVcsT0FBTyxTQUFTO0FBQ25DLE1BQUksUUFBUSxnQkFBZ0IsQ0FBQyxPQUFPLE1BQU0sT0FBTyxLQUFLLENBQUMsTUFBTSxPQUFPLFVBQVUsWUFBWSxNQUFNLEtBQU0sTUFBSyxLQUFLO0FBQy9HLFlBQVEsT0FBTyxLQUFLO0FBQUEsRUFDcEIsV0FBVSxRQUFRLGlCQUFpQixVQUFVLFNBQVMsTUFBTSxZQUFhLE1BQUssVUFBVSxNQUFNLFlBQWEsTUFBSyxVQUFVO0FBQzFILFlBQVEsTUFBTSxZQUFhLE1BQUs7QUFBQSxFQUNoQztBQUVELFNBQU87QUFDUjtBQUVPLFNBQVMsUUFBUSxPQUFPO0FBQzlCLFVBQVEsV0FBVyxLQUFLO0FBQ3hCLFFBQU0sYUFBYSxNQUFNLFFBQVEsR0FBRztBQUNwQyxNQUFJLGVBQWUsSUFBSTtBQUN0QixXQUFPO0FBQUEsRUFDUDtBQUVELFNBQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQztBQUNsQztBQUVPLFNBQVMsTUFBTSxPQUFPLFNBQVM7QUFDckMsWUFBVTtBQUFBLElBQ1QsUUFBUTtBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sYUFBYTtBQUFBLElBQ2Isc0JBQXNCO0FBQUEsSUFDdEIsY0FBYztBQUFBLElBQ2QsZUFBZTtBQUFBLElBQ2YsR0FBRztBQUFBLEVBQ0w7QUFFQywrQkFBNkIsUUFBUSxvQkFBb0I7QUFFekQsUUFBTSxZQUFZLHFCQUFxQixPQUFPO0FBRzlDLFFBQU0sY0FBYyx1QkFBTyxPQUFPLElBQUk7QUFFdEMsTUFBSSxPQUFPLFVBQVUsVUFBVTtBQUM5QixXQUFPO0FBQUEsRUFDUDtBQUVELFVBQVEsTUFBTSxLQUFJLEVBQUcsUUFBUSxVQUFVLEVBQUU7QUFFekMsTUFBSSxDQUFDLE9BQU87QUFDWCxXQUFPO0FBQUEsRUFDUDtBQUVELGFBQVcsYUFBYSxNQUFNLE1BQU0sR0FBRyxHQUFHO0FBQ3pDLFFBQUksY0FBYyxJQUFJO0FBQ3JCO0FBQUEsSUFDQTtBQUVELFVBQU0sYUFBYSxRQUFRLFNBQVMsVUFBVSxRQUFRLE9BQU8sR0FBRyxJQUFJO0FBRXBFLFFBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxhQUFhLFlBQVksR0FBRztBQUUvQyxRQUFJLFFBQVEsUUFBVztBQUN0QixZQUFNO0FBQUEsSUFDTjtBQUlELFlBQVEsVUFBVSxTQUFZLE9BQVEsQ0FBQyxTQUFTLGFBQWEsbUJBQW1CLEVBQUUsU0FBUyxRQUFRLFdBQVcsSUFBSSxRQUFRLE9BQU8sT0FBTyxPQUFPO0FBQy9JLGNBQVUsT0FBTyxLQUFLLE9BQU8sR0FBRyxPQUFPLFdBQVc7QUFBQSxFQUNsRDtBQUVELGFBQVcsQ0FBQyxLQUFLLEtBQUssS0FBSyxPQUFPLFFBQVEsV0FBVyxHQUFHO0FBQ3ZELFFBQUksT0FBTyxVQUFVLFlBQVksVUFBVSxNQUFNO0FBQ2hELGlCQUFXLENBQUMsTUFBTSxNQUFNLEtBQUssT0FBTyxRQUFRLEtBQUssR0FBRztBQUNuRCxjQUFNLFFBQVEsV0FBVyxRQUFRLE9BQU87QUFBQSxNQUN4QztBQUFBLElBQ0osT0FBUztBQUNOLGtCQUFZLE9BQU8sV0FBVyxPQUFPLE9BQU87QUFBQSxJQUM1QztBQUFBLEVBQ0Q7QUFFRCxNQUFJLFFBQVEsU0FBUyxPQUFPO0FBQzNCLFdBQU87QUFBQSxFQUNQO0FBSUQsVUFBUSxRQUFRLFNBQVMsT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFLFNBQVMsT0FBTyxLQUFLLFdBQVcsRUFBRSxLQUFLLFFBQVEsSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLFFBQVE7QUFDdEksVUFBTSxRQUFRLFlBQVk7QUFDMUIsUUFBSSxRQUFRLEtBQUssS0FBSyxPQUFPLFVBQVUsWUFBWSxDQUFDLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFFekUsYUFBTyxPQUFPLFdBQVcsS0FBSztBQUFBLElBQ2pDLE9BQVM7QUFDTixhQUFPLE9BQU87QUFBQSxJQUNkO0FBRUQsV0FBTztBQUFBLEVBQ1AsR0FBRSx1QkFBTyxPQUFPLElBQUksQ0FBQztBQUN2QjtBQUVPLFNBQVMsVUFBVSxRQUFRLFNBQVM7QUFDMUMsTUFBSSxDQUFDLFFBQVE7QUFDWixXQUFPO0FBQUEsRUFDUDtBQUVELFlBQVU7QUFBQSxJQUFDLFFBQVE7QUFBQSxJQUNsQixRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixzQkFBc0I7QUFBQSxJQUFLLEdBQUc7QUFBQSxFQUFPO0FBRXRDLCtCQUE2QixRQUFRLG9CQUFvQjtBQUV6RCxRQUFNLGVBQWUsU0FDbkIsUUFBUSxZQUFZLGtCQUFrQixPQUFPLElBQUksS0FDOUMsUUFBUSxtQkFBbUIsT0FBTyxTQUFTO0FBR2hELFFBQU0sWUFBWSxzQkFBc0IsT0FBTztBQUUvQyxRQUFNLGFBQWEsQ0FBQTtBQUVuQixhQUFXLENBQUMsS0FBSyxLQUFLLEtBQUssT0FBTyxRQUFRLE1BQU0sR0FBRztBQUNsRCxRQUFJLENBQUMsYUFBYSxHQUFHLEdBQUc7QUFDdkIsaUJBQVcsT0FBTztBQUFBLElBQ2xCO0FBQUEsRUFDRDtBQUVELFFBQU0sT0FBTyxPQUFPLEtBQUssVUFBVTtBQUVuQyxNQUFJLFFBQVEsU0FBUyxPQUFPO0FBQzNCLFNBQUssS0FBSyxRQUFRLElBQUk7QUFBQSxFQUN0QjtBQUVELFNBQU8sS0FBSyxJQUFJLFNBQU87QUFDdEIsVUFBTSxRQUFRLE9BQU87QUFFckIsUUFBSSxVQUFVLFFBQVc7QUFDeEIsYUFBTztBQUFBLElBQ1A7QUFFRCxRQUFJLFVBQVUsTUFBTTtBQUNuQixhQUFPLE9BQU8sS0FBSyxPQUFPO0FBQUEsSUFDMUI7QUFFRCxRQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUc7QUFDekIsVUFBSSxNQUFNLFdBQVcsS0FBSyxRQUFRLGdCQUFnQixxQkFBcUI7QUFDdEUsZUFBTyxPQUFPLEtBQUssT0FBTyxJQUFJO0FBQUEsTUFDOUI7QUFFRCxhQUFPLE1BQ0wsT0FBTyxVQUFVLEdBQUcsR0FBRyxFQUFFLEVBQ3pCLEtBQUssR0FBRztBQUFBLElBQ1Y7QUFFRCxXQUFPLE9BQU8sS0FBSyxPQUFPLElBQUksTUFBTSxPQUFPLE9BQU8sT0FBTztBQUFBLEVBQzNELENBQUUsRUFBRSxPQUFPLE9BQUssRUFBRSxTQUFTLENBQUMsRUFBRSxLQUFLLEdBQUc7QUFDdEM7QUFFTyxTQUFTLFNBQVNBLE1BQUssU0FBUzs7QUFDdEMsWUFBVTtBQUFBLElBQ1QsUUFBUTtBQUFBLElBQ1IsR0FBRztBQUFBLEVBQ0w7QUFFQyxNQUFJLENBQUMsTUFBTSxJQUFJLElBQUksYUFBYUEsTUFBSyxHQUFHO0FBRXhDLE1BQUksU0FBUyxRQUFXO0FBQ3ZCLFdBQU9BO0FBQUEsRUFDUDtBQUVELFNBQU87QUFBQSxJQUNOLE9BQUssa0NBQU0sTUFBTSxTQUFaLG1CQUFtQixPQUFNO0FBQUEsSUFDOUIsT0FBTyxNQUFNLFFBQVFBLElBQUcsR0FBRyxPQUFPO0FBQUEsSUFDbEMsR0FBSSxXQUFXLFFBQVEsMkJBQTJCLE9BQU8sRUFBQyxvQkFBb0IsT0FBTyxNQUFNLE9BQU8sRUFBQyxJQUFJLENBQUE7QUFBQSxFQUN6RztBQUNBO0FBRU8sU0FBUyxhQUFhLFFBQVEsU0FBUztBQUM3QyxZQUFVO0FBQUEsSUFDVCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixDQUFDLDJCQUEyQjtBQUFBLElBQzVCLEdBQUc7QUFBQSxFQUNMO0FBRUMsUUFBTUEsT0FBTSxXQUFXLE9BQU8sR0FBRyxFQUFFLE1BQU0sR0FBRyxFQUFFLE1BQU07QUFDcEQsUUFBTSxlQUFlLFFBQVEsT0FBTyxHQUFHO0FBRXZDLFFBQU0sUUFBUTtBQUFBLElBQ2IsR0FBRyxNQUFNLGNBQWMsRUFBQyxNQUFNLE1BQUssQ0FBQztBQUFBLElBQ3BDLEdBQUcsT0FBTztBQUFBLEVBQ1o7QUFFQyxNQUFJb00sZUFBYyxVQUFVLE9BQU8sT0FBTztBQUMxQyxNQUFJQSxjQUFhO0FBQ2hCLElBQUFBLGVBQWMsSUFBSUE7QUFBQSxFQUNsQjtBQUVELE1BQUksT0FBTyxRQUFRLE9BQU8sR0FBRztBQUM3QixNQUFJLE9BQU8sb0JBQW9CO0FBQzlCLFVBQU0sNkJBQTZCLElBQUksSUFBSXBNLElBQUc7QUFDOUMsK0JBQTJCLE9BQU8sT0FBTztBQUN6QyxXQUFPLFFBQVEsNEJBQTRCLDJCQUEyQixPQUFPLElBQUksT0FBTztBQUFBLEVBQ3hGO0FBRUQsU0FBTyxHQUFHQSxPQUFNb00sZUFBYztBQUMvQjtBQUVPLFNBQVMsS0FBSyxPQUFPLFFBQVEsU0FBUztBQUM1QyxZQUFVO0FBQUEsSUFDVCx5QkFBeUI7QUFBQSxJQUN6QixDQUFDLDJCQUEyQjtBQUFBLElBQzVCLEdBQUc7QUFBQSxFQUNMO0FBRUMsUUFBTSxFQUFDLEtBQUFwTSxNQUFLLE9BQU8sbUJBQWtCLElBQUksU0FBUyxPQUFPLE9BQU87QUFFaEUsU0FBTyxhQUFhO0FBQUEsSUFDbkIsS0FBQUE7QUFBQSxJQUNBLE9BQU8sWUFBWSxPQUFPLE1BQU07QUFBQSxJQUNoQztBQUFBLEVBQ0EsR0FBRSxPQUFPO0FBQ1g7QUFFTyxTQUFTLFFBQVEsT0FBTyxRQUFRLFNBQVM7QUFDL0MsUUFBTSxrQkFBa0IsTUFBTSxRQUFRLE1BQU0sSUFBSSxTQUFPLENBQUMsT0FBTyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssVUFBVSxDQUFDLE9BQU8sS0FBSyxLQUFLO0FBRWpILFNBQU8sS0FBSyxPQUFPLGlCQUFpQixPQUFPO0FBQzVDOzs7Ozs7Ozs7OztBQ3BnQkEsTUFBTSxVQUFVLFFBQVEsU0FBUztBQUNqQyxJQUFJLFVBQVU7QUFDZCxNQUFNLFdBQVc7QUFHVixNQUFNLGlCQUFpQjtBQUFBLEVBRTVCLGtCQUFrQixDQUFDLEdBQUUsWUFBWTtBQUMvQixXQUFPLElBQUk7QUFBQSxNQUNULENBQUMsU0FBUyxXQUFXO0FBRW5CLGNBQU1xTSxPQUFNQyxlQUFBLFdBQU0sUUFBUSxTQUFTLENBQU8sUUFBQTtBQUN4QyxjQUFJakcsVUFBUztBQUNiLGNBQUksWUFBWSxNQUFNO0FBQ2xCLGNBQUEsR0FBRyxRQUFRLENBQVMsVUFBQTtBQUNaLFlBQUFBLFdBQUE7QUFBQSxVQUFBLENBQ1g7QUFDRyxjQUFBLEdBQUcsT0FBTyxNQUFNO0FBQ2xCLG9CQUFRLElBQUlBLE9BQU07QUFDVixvQkFBQSxLQUFLLE1BQU1BLE9BQU0sQ0FBQztBQUFBLFVBQUEsQ0FDM0I7QUFBQSxRQUFBLENBQ0Y7QUFDRyxRQUFBZ0csS0FBQSxHQUFHLFNBQVMsQ0FBTyxRQUFBO0FBQ3JCLGtCQUFRLE1BQU0sR0FBRztBQUNqQixpQkFBTyxHQUFHO0FBQUEsUUFBQSxDQUNYO0FBQ0QsUUFBQUEsS0FBSSxJQUFJO0FBQUEsTUFDVjtBQUFBLElBQUE7QUFBQSxFQUVKO0FBQUEsRUFFQSx5QkFBeUIsWUFBVTtBQUMzQixVQUFBak0sVUFBU0YsdUJBQWMsZ0JBQWdCLEtBQUssQ0FBSyxNQUFBLENBQUMsRUFBRSxZQUFBLENBQWE7QUFDdkUsVUFBTSxTQUFTLE1BQU04TCxnQkFBTyxlQUFlNUwsU0FBUTtBQUFBLE1BQ2pELE9BQU87QUFBQSxNQUNQLFNBQVM7QUFBQSxNQUNULFlBQVksQ0FBQyxlQUFlO0FBQUEsSUFBQSxDQUM3QjtBQUNELFdBQU8sT0FBTyxVQUFVO0FBQUEsRUFDMUI7QUFBQSxFQUVBLFNBQVMsT0FBTSxNQUFHO0FBQ2hCLFdBQU8sTUFBTSxlQUFlO0FBQUEsTUFDMUI7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixTQUFTO0FBQUEsVUFDUCxnQkFBZ0I7QUFBQSxVQUNoQixjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFBQTtBQUFBLEVBRUo7QUFBQSxFQUVBLFlBQVksT0FBTyxHQUFFSixTQUFNO0FBQ3pCQyxtQkFBTSxhQUFhRCxJQUFHO0FBSXRCO0FBQUEsRUFDRjtBQUFBLEVBRUEsY0FBYyxPQUFPLEdBQUUsU0FBTztBQUM1QixVQUFNLGFBQWE7QUFBQSxNQUNqQixlQUFlO0FBQUEsTUFDZixjQUFjO0FBQUEsTUFDZCxXQUFXO0FBQUEsTUFDWCxPQUFPO0FBQUEsSUFBQTtBQUVULFVBQU0sV0FFSixpREFFQ3VNLFlBQVksVUFBVSxVQUFVO0FBRW5DdE0sbUJBQU0sYUFBYSxRQUFRO0FBQUEsRUFFN0I7QUFBQSxFQUVBLE1BQU0sWUFBWTtBQUNSZ00sYUFBQUEsUUFBQSxPQUFPLDBCQUEwQixlQUFlLE9BQVE7QUFDeERBLGFBQUFBLFFBQUEsT0FBTyw2QkFBNkIsZUFBZSxVQUFXO0FBQzlEQSxhQUFBQSxRQUFBLE9BQU8sMENBQTBDLGVBQWUsdUJBQXdCO0FBQ3hGQSxhQUFBQSxRQUFBLE9BQU8sK0JBQStCLGVBQWUsWUFBYTtBQUUxRSxjQUFVLFFBQVE7QUFDbEIsWUFBUSxJQUFJLEtBQUssT0FBT0ksTUFBSyxRQUFRO0FBQzNCLGNBQUEsSUFBSUEsS0FBSSxHQUFHO0FBQ2hCLFVBQUEsQ0FBQ0EsS0FBSSxPQUFPLENBQUNBLEtBQUksSUFBSSxXQUFXLFNBQVMsR0FBRTtBQUNyQyxlQUFBLElBQUksS0FBSyxrQkFBa0I7QUFBQSxNQUNwQztBQUVBLFlBQU0sT0FBT0EsS0FBSSxJQUFJLE1BQU0sU0FBUyxFQUFFO0FBQ2hDLFlBQUEsU0FBU0UsWUFBWSxVQUFVO0FBQUEsUUFDbkMsV0FBVztBQUFBLFFBQ1gsWUFBWTtBQUFBLFFBQ1osY0FBYztBQUFBLFFBQ2Q7QUFBQSxNQUFBLENBQ0Q7QUFDSyxZQUFBLGFBQWEsTUFBTSxlQUFlO0FBQUEsUUFDdEM7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLGtCQUFrQjtBQUFBLFVBQ3hCLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLFNBQVM7QUFBQSxZQUNQLGNBQWM7QUFBQSxZQUNkLGdCQUFnQjtBQUFBLFVBQ2xCO0FBQUEsUUFDRjtBQUFBLE1BQUE7QUFHSSxZQUFBLFlBQVksTUFBTSxlQUFlO0FBQUEsUUFDckM7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLDhCQUE4QixXQUFXO0FBQUEsVUFDL0MsTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsU0FBUztBQUFBLFlBQ1AsY0FBYztBQUFBLFlBQ2QsZ0JBQWdCO0FBQUEsVUFDbEI7QUFBQSxRQUNGO0FBQUEsTUFBQTtBQUVGLGdCQUFVLFFBQVE7QUFHbEIsVUFBSSxLQUFLLDRFQUE0RTtBQUNqRixVQUFBbk0sVUFBU0YsdUJBQWMsZ0JBQWdCLEtBQUssQ0FBSyxNQUFBLENBQUMsRUFBRSxZQUFBLENBQWE7QUFDOUQsTUFBQUUsUUFBQSxZQUFZLEtBQUssdUNBQXVDLFNBQVM7QUFBQSxJQUFBLENBQ3pFO0FBQ08sWUFBQSxPQUFPLFVBQVUsTUFBTTtBQUNyQixjQUFBLElBQUksOENBQThDLFVBQVU7QUFBQSxJQUFBLENBQ3JFO0FBQUEsRUFDSDtBQUVGO0FDL0lPLE1BQU0sc0JBQXNCO0FBQUEsRUFFakMsS0FBSyxDQUFDLEdBQUUsWUFBWTtBQUVsQixXQUFPLElBQUksUUFBUyxDQUFDLFNBQVMsV0FBVztBQUN2QyxZQUFNLE9BQU8sT0FBTyxZQUFZLFdBQVcsQ0FBQyxPQUFPLElBQUksUUFBUTtBQUMvRCxZQUFNLElBQUksT0FBTyxZQUFZLFdBQVcsQ0FBQSxJQUFLO0FBRXpDLFVBQUFBLFVBQVNGLHVCQUFjLGdCQUFnQixLQUFLLENBQUssTUFBQSxDQUFDLEVBQUUsWUFBQSxDQUFhO0FBQ3JFLFlBQU0sSUFBSXNNLGNBQUEsTUFBTSxPQUFPLE1BQU0sQ0FBQztBQUM5QixVQUFJLFFBQVE7QUFDWixVQUFJbkcsVUFBUztBQUNYLFFBQUEsT0FBTyxHQUFHLFFBQVEsQ0FBUSxTQUFBO0FBQ3BCLGNBQUEsZUFBZSxLQUFLO0FBQ2hCLFFBQUFBLFdBQUE7QUFDVixZQUFHLGFBQWEsY0FBYyxTQUFTLE9BQU87QUFDcEMsa0JBQUE7QUFDSCxRQUFBakcsUUFBQSxZQUFZLEtBQUssMkJBQTJCLFlBQVk7QUFBQSxNQUFBLENBQ2hFO0FBRUMsUUFBQSxPQUFPLEdBQUcsUUFBUSxDQUFRLFNBQUE7QUFDbEIsZ0JBQUE7QUFDRixjQUFBLGVBQWUsS0FBSztBQUNoQixRQUFBaUcsV0FBQTtBQUNGLGdCQUFBLE1BQU0sS0FBSSxZQUFZO0FBQ3ZCLFFBQUFqRyxRQUFBLFlBQVksS0FBSywyQkFBMkIsWUFBWTtBQUFBLE1BQUEsQ0FDaEU7QUFFQyxRQUFBLEdBQUcsU0FBUyxDQUFPLFFBQUE7QUFDWCxnQkFBQSxNQUFNLElBQUksU0FBVSxDQUFBO0FBQzVCLGdCQUFRLENBQUMsT0FBTSxJQUFJLFNBQUEsQ0FBVSxDQUFDO0FBQUEsTUFBQSxDQUMvQjtBQUVDLFFBQUEsR0FBRyxRQUFRLENBQVEsU0FBQTtBQUNuQixnQkFBUSxDQUFDLFNBQU8sS0FBSyxDQUFDLE9BQU1pRyxPQUFNLENBQUM7QUFBQSxNQUFBLENBQ3BDO0FBQUEsSUFBQSxDQUNGO0FBQUEsRUFTSDtBQUFBLEVBWUEsTUFBTSxZQUFZO0FBRVI0RixhQUFBQSxRQUFBLE9BQU8sMkJBQTJCLG9CQUFvQixHQUFJO0FBQUEsRUFDcEU7QUFDRjtBQzlEQSxJQUFJLE1BQU07QUFFSCxNQUFNLGtCQUFrQjtBQUFBLEVBRTdCLGNBQWMsQ0FBQyxPQUFPLFNBQU87QUFDM0IsV0FBTyxJQUFJO0FBQUEsTUFDVCxDQUFDLFNBQVMsV0FBVztBQUVuQixjQUFNLFVBQVU7QUFBQSxVQUNkLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLE1BQU0sdUJBQXVCLEtBQUs7QUFBQSxVQUNsQyxRQUFRO0FBQUEsVUFDUixTQUFTO0FBQUEsWUFDUCxVQUFnQjtBQUFBLFlBQ2hCLGdCQUFnQjtBQUFBLFlBQ2hCLGNBQWdCO0FBQUEsVUFDbEI7QUFBQSxRQUFBO0FBR0MsWUFBQTtBQUNELGNBQUksUUFBUTtBQUVSLGNBQUFLLGVBQUFBLFdBQU0sUUFBUSxTQUFTLENBQU8sUUFBQTtBQUNsQyxjQUFJakcsVUFBUztBQUNiLGNBQUksWUFBWSxNQUFNO0FBQ2xCLGNBQUEsR0FBRyxRQUFRLENBQVMsVUFBQTtBQUNaLFlBQUFBLFdBQUE7QUFBQSxVQUFBLENBQ1g7QUFDRyxjQUFBLEdBQUcsT0FBTyxNQUFNO0FBQ1Ysb0JBQUEsS0FBSyxNQUFNQSxPQUFNLENBQUM7QUFBQSxVQUFBLENBQzNCO0FBQUEsUUFBQSxDQUNGO0FBQ0csWUFBQSxHQUFHLFNBQVMsQ0FBTyxRQUFBO0FBQ3JCLGtCQUFRLEdBQUc7QUFBQSxRQUFBLENBQ1o7QUFDRyxZQUFBLE1BQU0sS0FBSyxPQUFPO0FBQ3RCLFlBQUksSUFBSTtBQUFBLE1BQ1Y7QUFBQSxJQUFBO0FBQUEsRUFFSjtBQUFBLEVBRUEsaUJBQWlCLE9BQU8sR0FBRXJHLFNBQU07QUFDOUJDLG1CQUFNLGFBQWFELElBQUc7QUFDdEI7QUFBQSxFQUNGO0FBQUEsRUFFQSxNQUFNLFlBQVk7QUFDUmlNLGFBQUFBLFFBQUEsT0FBTyxtQ0FBbUMsZ0JBQWdCLGVBQWdCO0FBQzFFQSxhQUFBQSxRQUFBLE9BQU8sZ0NBQWdDLGdCQUFnQixZQUFhO0FBQUEsRUFDOUU7QUFFRjtBQ2hEQSxNQUFNLG1CQUFtQmxNLFNBQUFBLElBQUk7QUFDN0IsSUFBSSxDQUFDLGtCQUFrQjtBQUNyQkEsV0FBQSxJQUFJLEtBQUs7QUFDVCxVQUFRLEtBQUssQ0FBQztBQUNoQjtBQUNBQSxTQUFBQSxJQUFJLEdBQUcsbUJBQW1CLHFCQUFxQjtBQU0vQ0EsU0FBQSxJQUFJLDRCQUE0QjtBQUtoQ0EsU0FBQUEsSUFBSSxHQUFHLHFCQUFxQixNQUFNO0FBQzVCLE1BQUEsUUFBUSxhQUFhLFVBQVU7QUFDakNBLGFBQUEsSUFBSSxLQUFLO0FBQUEsRUFDWDtBQUNGLENBQUM7QUFLREEsU0FBQUEsSUFBSSxHQUFHLFlBQVkscUJBQXFCO0FBTXhDQSxTQUFBLElBQUksVUFBVSxFQUNYLEtBQUssZUFBZSxJQUFJLEVBQ3hCLEtBQUssdUJBQXVCLElBQUksRUFDaEMsS0FBSyxvQkFBb0IsSUFBSSxFQUM3QixLQUFLLGdCQUFnQixJQUFJLEVBQ3pCLEtBQUsscUJBQXFCLEVBQzFCLE1BQU0sQ0FBQyxNQUFNLFFBQVEsTUFBTSx5QkFBeUIsQ0FBQyxDQUFDO0FBTWhDO0FBQ3ZCQSxXQUFBQSxJQUFJLFVBQVUsRUFDWCxLQUFLLE1BQU0sUUFBQSxRQUFBLEVBQUEsS0FBQSxXQUFBO0FBQUEsV0FBQSxrQ0FBQSxRQUFPLDZCQUE4QixDQUFBO0FBQUEsRUFBQSxDQUFBLENBQUEsRUFDaEQsS0FBSyxDQUFDLEVBQUMsU0FBUyxrQkFBa0IsZ0JBQWUsTUFBTSxpQkFBaUIsaUJBQWlCO0FBQUEsSUFDeEYsc0JBQXNCO0FBQUEsTUFDcEIsaUJBQWlCO0FBQUEsSUFDbkI7QUFBQSxFQUFBLENBQ0QsQ0FBQyxFQUNELE1BQU0sT0FBSyxRQUFRLE1BQU0sNkJBQTZCLENBQUMsQ0FBQztBQUM3RDsifQ==
