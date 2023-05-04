"use strict";
var electron = require("electron");
var url = require("url");
var require$$0$1 = require("path");
var require$$0$2 = require("fs");
var require$$0$3 = require("events");
var require$$2 = require("util");
var require$$1 = require("stream");
var require$$2$1 = require("os");
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
var require$$0__default = /* @__PURE__ */ _interopDefaultLegacy(require$$0$1);
var require$$0__default$1 = /* @__PURE__ */ _interopDefaultLegacy(require$$0$2);
var require$$0__default$2 = /* @__PURE__ */ _interopDefaultLegacy(require$$0$3);
var require$$2__default = /* @__PURE__ */ _interopDefaultLegacy(require$$2);
var require$$1__default = /* @__PURE__ */ _interopDefaultLegacy(require$$1);
var require$$2__default$1 = /* @__PURE__ */ _interopDefaultLegacy(require$$2$1);
var https__default = /* @__PURE__ */ _interopDefaultLegacy(https);
const ALLOWED_ORIGINS_AND_PERMISSIONS = /* @__PURE__ */ new Map(
  [[new url.URL("http://localhost:3000/").origin, /* @__PURE__ */ new Set()]]
);
const ALLOWED_EXTERNAL_ORIGINS = /* @__PURE__ */ new Set([
  "https://github.com",
  "https://www.w3schools.com",
  "https://www.google.com"
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
    if (!ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
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
      preload: require$$0$1.join(__dirname, "../../preload/dist/index.cjs")
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
  let window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
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
  if (window === void 0) {
    window = await createWindow();
  }
  if (window.isMinimized()) {
    window.restore();
  }
  window.focus();
}
var chokidar = {};
var utils$7 = {};
const path$2 = require$$0__default["default"];
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
  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};
(function(exports) {
  const path2 = require$$0__default["default"];
  const win32 = process.platform === "win32";
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
    return win32 === true || path2.sep === "\\";
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
    let output = input;
    if (output.startsWith("./")) {
      output = output.slice(2);
      state.prefix = "./";
    }
    return output;
  };
  exports.wrapOutput = (input, state = {}, options = {}) => {
    const prepend = options.contains ? "" : "^";
    const append2 = options.contains ? "" : "$";
    let output = `${prepend}(?:${input})${append2}`;
    if (state.negated === true) {
      output = `(?:^(?!${output}).*$)`;
    }
    return output;
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
const depth = (token) => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
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
  let token = { value: "", depth: 0, isGlob: false };
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
      backslashes = token.backslashes = true;
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
          backslashes = token.backslashes = true;
          advance();
          continue;
        }
        if (code === CHAR_LEFT_CURLY_BRACE$1) {
          braces2++;
          continue;
        }
        if (braceEscaped !== true && code === CHAR_DOT$1 && (code = advance()) === CHAR_DOT$1) {
          isBrace = token.isBrace = true;
          isGlob3 = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (braceEscaped !== true && code === CHAR_COMMA$1) {
          isBrace = token.isBrace = true;
          isGlob3 = token.isGlob = true;
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
            isBrace = token.isBrace = true;
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
      tokens.push(token);
      token = { value: "", depth: 0, isGlob: false };
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
        isGlob3 = token.isGlob = true;
        isExtglob3 = token.isExtglob = true;
        finished = true;
        if (code === CHAR_EXCLAMATION_MARK && index === start) {
          negatedExtglob = true;
        }
        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES$1) {
              isGlob3 = token.isGlob = true;
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
        isGlobstar = token.isGlobstar = true;
      isGlob3 = token.isGlob = true;
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_QUESTION_MARK) {
      isGlob3 = token.isGlob = true;
      finished = true;
      if (scanToEnd === true) {
        continue;
      }
      break;
    }
    if (code === CHAR_LEFT_SQUARE_BRACKET$1) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }
        if (next === CHAR_RIGHT_SQUARE_BRACKET$1) {
          isBracket = token.isBracket = true;
          isGlob3 = token.isGlob = true;
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
      negated = token.negated = true;
      start++;
      continue;
    }
    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES$1) {
      isGlob3 = token.isGlob = true;
      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES$1) {
            backslashes = token.backslashes = true;
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
      tokens.push(token);
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
const parse$3 = (input, options) => {
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
  const win32 = utils$5.isWindows(options);
  const PLATFORM_CHARS = constants$3.globChars(win32);
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
  const append2 = (token) => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
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
    const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? "(" : "") + token.open;
    increment("parens");
    push({ type, value: value2, output: state.output ? "" : ONE_CHAR2 });
    push({ type: "paren", extglob: true, value: advance(), output });
    extglobs.push(token);
  };
  const extglobClose = (token) => {
    let output = token.close + (opts.capture ? ")" : "");
    let rest;
    if (token.type === "negate") {
      let extglobStar = star;
      if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
        extglobStar = globstar(opts);
      }
      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }
      if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
        const expression = parse$3(rest, { ...options, fastpaths: false }).output;
        output = token.close = `)${expression})${extglobStar})`;
      }
      if (token.prev.type === "bos") {
        state.negatedExtglob = true;
      }
    }
    push({ type: "paren", extglob: true, value, output });
    decrement("parens");
  };
  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;
    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars2, first, rest, index) => {
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
        output = output.replace(/\\/g, "");
      } else {
        output = output.replace(/\\+/g, (m) => {
          return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
        });
      }
    }
    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }
    state.output = utils$5.wrapOutput(output, state, options);
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
      let output = ")";
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
        output = expandRange(range, opts);
        state.backtrack = true;
      }
      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = "\\{";
        value = output = "\\}";
        state.output = out;
        for (const t of toks) {
          state.output += t.output || t.value;
        }
      }
      push({ type: "brace", value, output });
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
      let output = value;
      const brace = braces2[braces2.length - 1];
      if (brace && stack[stack.length - 1] === "braces") {
        brace.comma = true;
        output = "|";
      }
      push({ type: "comma", value, output });
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
        let output = value;
        if (next === "<" && !utils$5.supportsLookbehinds()) {
          throw new Error("Node.js v10 or higher is required for regex lookbehinds");
        }
        if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
          output = `\\${value}`;
        }
        push({ type: "text", value, output });
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
    const token = { type: "star", value, output: star };
    if (opts.bash === true) {
      token.output = ".*?";
      if (prev.type === "bos" || prev.type === "slash") {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }
    if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
      token.output = value;
      push(token);
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
    push(token);
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
    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;
      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }
  return state;
};
parse$3.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }
  input = REPLACEMENTS[input] || input;
  const win32 = utils$5.isWindows(options);
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
  } = constants$3.globChars(win32);
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
  const output = utils$5.removePrefix(input, state);
  let source = create(output);
  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL2}?`;
  }
  return source;
};
var parse_1$1 = parse$3;
const path$1 = require$$0__default["default"];
const scan = scan_1;
const parse$2 = parse_1$1;
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
    const { isMatch, match, output } = picomatch$3.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };
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
  let output = match && format ? format(input) : input;
  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }
  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch$3.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }
  return { isMatch: Boolean(match), match, output };
};
picomatch$3.matchBase = (input, glob, options, posix = utils$4.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch$3.makeRe(glob, options);
  return regex.test(path$1.basename(input));
};
picomatch$3.isMatch = (str, patterns, options) => picomatch$3(patterns, options)(str);
picomatch$3.parse = (pattern, options) => {
  if (Array.isArray(pattern))
    return pattern.map((p) => picomatch$3.parse(p, options));
  return parse$2(pattern, { ...options, fastpaths: false });
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
    parsed.output = parse$2.fastpaths(input, options);
  }
  if (!parsed.output) {
    parsed = parse$2(input, options);
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
const fs$3 = require$$0__default$1["default"];
const { Readable } = require$$1__default["default"];
const sysPath$3 = require$$0__default["default"];
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
var pathPosixDirname = require$$0__default["default"].posix.dirname;
var isWin32 = require$$2__default$1["default"].platform() === "win32";
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
var stringify$4 = (ast, options = {}) => {
  let stringify2 = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils$2.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = "";
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
        output += stringify2(child);
      }
    }
    return output;
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
const stringify$3 = (start, end, options) => {
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
  let toNumber = padded === false && stringify$3(start, end, options) === false;
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
    let output = "";
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
        output += walk(child, node);
      }
    }
    return output;
  };
  return walk(ast);
};
var compile_1 = compile$1;
const fill = fillRange;
const stringify$2 = stringify$4;
const utils = utils$3;
const append = (queue = "", stash = "", enclose = false) => {
  let result = [];
  queue = [].concat(queue);
  stash = [].concat(stash);
  if (!stash.length)
    return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
  }
  for (let item of queue) {
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
      q.push(append(q.pop(), stringify$2(node, options)));
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
        range = stringify$2(node, options);
      }
      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }
    let enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;
    while (block.type !== "brace" && block.type !== "root" && block.parent) {
      block = block.parent;
      queue = block.queue;
    }
    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];
      if (child.type === "comma" && node.type === "brace") {
        if (i === 1)
          queue.push("");
        queue.push("");
        continue;
      }
      if (child.type === "close") {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }
      if (child.value && child.type !== "open") {
        queue.push(append(queue.pop(), child.value));
        continue;
      }
      if (child.nodes) {
        walk(child, node);
      }
    }
    return queue;
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
const stringify$1 = stringify$4;
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
const parse$1 = (input, options = {}) => {
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
        block.nodes = [open2, { type: "text", value: stringify$1(block) }];
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
var parse_1 = parse$1;
const stringify = stringify$4;
const compile = compile_1;
const expand = expand_1;
const parse = parse_1;
const braces$1 = (input, options = {}) => {
  let output = [];
  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces$1.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces$1.create(input, options));
  }
  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};
braces$1.parse = (input, options = {}) => parse(input, options);
braces$1.stringify = (input, options = {}) => {
  if (typeof input === "string") {
    return stringify(braces$1.parse(input, options), options);
  }
  return stringify(input, options);
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
const path = require$$0__default["default"];
const binaryExtensions = binaryExtensions$1;
const extensions = new Set(binaryExtensions);
var isBinaryPath$1 = (filePath) => extensions.has(path.extname(filePath).slice(1).toLowerCase());
var constants = {};
(function(exports) {
  const { sep } = require$$0__default["default"];
  const { platform } = process;
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
  exports.isWindows = platform === "win32";
  exports.isMacos = platform === "darwin";
  exports.isLinux = platform === "linux";
})(constants);
const fs$2 = require$$0__default$1["default"];
const sysPath$2 = require$$0__default["default"];
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
  _handleFile(file, stats, initialAdd) {
    if (this.fsw.closed) {
      return;
    }
    const dirname = sysPath$2.dirname(file);
    const basename = sysPath$2.basename(file);
    const parent = this.fsw._getWatchedDir(dirname);
    let prevStats = stats;
    if (parent.has(basename))
      return;
    const listener = async (path2, newStats) => {
      if (!this.fsw._throttle(THROTTLE_MODE_WATCH, file, 5))
        return;
      if (!newStats || newStats.mtimeMs === 0) {
        try {
          const newStats2 = await stat$2(file);
          if (this.fsw.closed)
            return;
          const at = newStats2.atimeMs;
          const mt = newStats2.mtimeMs;
          if (!at || at <= mt || mt !== prevStats.mtimeMs) {
            this.fsw._emit(EV_CHANGE$2, file, newStats2);
          }
          if (isLinux && prevStats.ino !== newStats2.ino) {
            this.fsw._closeFile(path2);
            prevStats = newStats2;
            this.fsw._addPathCloser(path2, this._watchWithNodeFs(file, listener));
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
          this.fsw._emit(EV_CHANGE$2, file, newStats);
        }
        prevStats = newStats;
      }
    };
    const closer = this._watchWithNodeFs(file, listener);
    if (!(initialAdd && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file)) {
      if (!this.fsw._throttle(EV_ADD$2, file, 0))
        return;
      this.fsw._emit(EV_ADD$2, file, stats);
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
const fs$1 = require$$0__default$1["default"];
const sysPath$1 = require$$0__default["default"];
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
const { EventEmitter } = require$$0__default$2["default"];
const fs = require$$0__default$1["default"];
const sysPath = require$$0__default["default"];
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
const normalizeIgnored = (cwd = EMPTY_STR) => (path2) => {
  if (typeof path2 !== STRING_TYPE)
    return path2;
  return normalizePathToUnix(sysPath.isAbsolute(path2) ? path2 : sysPath.join(cwd, path2));
};
const getAbsolutePath = (path2, cwd) => {
  if (sysPath.isAbsolute(path2)) {
    return path2;
  }
  if (path2.startsWith(BANG)) {
    return BANG + sysPath.join(cwd, path2.slice(1));
  }
  return sysPath.join(cwd, path2);
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
    const { cwd, disableGlobbing } = this.options;
    this.closed = false;
    let paths = unifyPaths(paths_);
    if (cwd) {
      paths = paths.map((path2) => {
        const absPath = getAbsolutePath(path2, cwd);
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
    const { cwd } = this.options;
    paths.forEach((path2) => {
      if (!sysPath.isAbsolute(path2) && !this._closers.has(path2)) {
        if (cwd)
          path2 = sysPath.join(cwd, path2);
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
      const { cwd } = this.options;
      const ign = this.options.ignored;
      const ignored = ign && ign.map(normalizeIgnored(cwd));
      const paths = arrify(ignored).filter((path3) => typeof path3 === STRING_TYPE && !isGlob(path3)).map((path3) => path3 + SLASH_GLOBSTAR);
      const list = this._getGlobIgnored().map(normalizeIgnored(cwd)).concat(ignored, paths);
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
    const labels = require$$0__default$1["default"].readdirSync(path2);
    for (const l of labels) {
      const stat2 = require$$0__default$1["default"].lstatSync(require$$0__default["default"].join(path2, l));
      if (l.startsWith("isa.") || l.startsWith(".git") || l.startsWith(".arc"))
        continue;
      stat2.id = path2 + "/" + l;
      stat2.isDirectory = stat2.isDirectory();
      children.push(stat2);
    }
    return children;
  },
  selectDir: async () => {
    const window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    const result = await electron.dialog.showOpenDialog(window, {
      properties: ["openDirectory"]
    });
    return result.filePaths[0];
  },
  saveFile: async () => {
    const window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    const result = await electron.dialog.showSaveDialog(window);
    return result.filePath;
  },
  readFile: (e, path2) => {
    return require$$0__default$1["default"].readFileSync(path2, { encoding: "UTF-8" });
  },
  registerChangeListener: async (e, path2) => {
    console.log("rl", path2);
    changeListeners[path2] = chokidar.watch(path2, { ignoreInitial: true });
    const updatePath = (path22) => {
      const window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
      window.webContents.send("LocalFileSystemService.updatePath", path22);
    };
    const updateParentPath = (path22) => {
      updatePath(path22.split("/").slice(0, -1).join("/"));
    };
    changeListeners[path2].on("add", updateParentPath).on("unlink", updateParentPath).on("addDir", updateParentPath).on("unlinkDir", updateParentPath);
    return;
  },
  unregisterChangeListener: async (e, path2) => {
    console.log("ul", path2);
    const watcher = changeListeners[path2];
    if (!watcher)
      return;
    await watcher.unwatch();
    delete changeListeners[path2];
    return;
  },
  init: async () => {
    process.on("unhandledRejection", (reason, p) => {
      console.error(`Unhandled Rejection at: ${require$$2__default["default"].inspect(p)} reason: ${reason}`);
    });
    electron.ipcMain.handle("LocalFileSystemService.readDir", LocalFileSystemService.readDir);
    electron.ipcMain.handle("LocalFileSystemService.readFile", LocalFileSystemService.readFile);
    electron.ipcMain.handle("LocalFileSystemService.selectDir", LocalFileSystemService.selectDir);
    electron.ipcMain.handle("LocalFileSystemService.saveFile", LocalFileSystemService.saveFile);
    electron.ipcMain.handle("LocalFileSystemService.registerChangeListener", LocalFileSystemService.registerChangeListener);
    electron.ipcMain.handle("LocalFileSystemService.unregisterChangeListener", LocalFileSystemService.unregisterChangeListener);
  }
};
const httpsOptions = {
  host: "git.nfdi4plants.org",
  port: 443,
  path: "",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "user-agent": "node.js"
  }
};
const DataHubService = {
  getWebPageAsJson: (e, url2) => {
    return new Promise(
      (resolve, reject) => {
        httpsOptions.path = url2;
        const req2 = https__default["default"].request(httpsOptions, (res) => {
          let output = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            output += chunk;
          });
          res.on("end", () => {
            resolve(JSON.parse(output));
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
    const window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    const result = await electron.dialog.showOpenDialog(window, {
      title: "Select Destination of ARC Import",
      message: "Select Destination of ARC Import",
      properties: ["openDirectory"]
    });
    return result.filePaths[0];
  },
  getArcs: async (e) => {
    return await DataHubService.getWebPageAsJson(null, "/api/v4/projects/");
  },
  inspectArc: async (e, url2) => {
    electron.shell.openExternal(url2);
    return;
  },
  init: async () => {
    electron.ipcMain.handle("DataHubService.getArcs", DataHubService.getArcs);
    electron.ipcMain.handle("DataHubService.inspectArc", DataHubService.inspectArc);
    electron.ipcMain.handle("DataHubService.selectImportDestination", DataHubService.selectImportDestination);
  }
};
const ArcCommanderService = {
  run: (e, options) => {
    return new Promise((resolve, reject) => {
      const args = typeof options === "string" ? [options] : options.args;
      const o = typeof options === "string" ? {} : options;
      let window = electron.BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
      const p = child_process.spawn("arc", args, o);
      let error = false;
      let output = "";
      p.stdout.on("data", (data) => {
        const dataAsString = data.toString();
        output += dataAsString;
        if (dataAsString.toLowerCase().includes("error"))
          error = true;
        window.webContents.send("ArcCommanderService.MSG", dataAsString);
      });
      p.stderr.on("data", (data) => {
        error = true;
        const dataAsString = data.toString();
        output += dataAsString;
        console.error("e", dataAsString);
        window.webContents.send("ArcCommanderService.MSG", dataAsString);
      });
      p.on("error", (err) => {
        console.error(err.toString());
        resolve([false, err.toString()]);
      });
      p.on("exit", (code) => {
        resolve([code === 0 && !error, output]);
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
          let output = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            output += chunk;
          });
          res.on("end", () => {
            resolve(JSON.parse(output));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvc2VjdXJpdHktcmVzdHJpY3Rpb25zLnRzIiwiLi4vc3JjL21haW5XaW5kb3cudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi91dGlscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3NjYW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9wYXJzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3BpY29tYXRjaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhZGRpcnAvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXBhdGgvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYW55bWF0Y2gvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvaXMtZXh0Z2xvYi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pcy1nbG9iL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nob2tpZGFyL25vZGVfbW9kdWxlcy9nbG9iLXBhcmVudC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL3V0aWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvc3RyaW5naWZ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzLW51bWJlci9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy90by1yZWdleC1yYW5nZS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9maWxsLXJhbmdlL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvY29tcGlsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2V4cGFuZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL2NvbnN0YW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icmFjZXMvbGliL3BhcnNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9iaW5hcnktZXh0ZW5zaW9ucy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pcy1iaW5hcnktcGF0aC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jaG9raWRhci9saWIvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nob2tpZGFyL2xpYi9ub2RlZnMtaGFuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jaG9raWRhci9saWIvZnNldmVudHMtaGFuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jaG9raWRhci9pbmRleC5qcyIsIi4uL3NyYy9Mb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnRzIiwiLi4vc3JjL0RhdGFIdWJTZXJ2aWNlLnRzIiwiLi4vc3JjL0FyY0NvbW1hbmRlclNlcnZpY2UudHMiLCIuLi9zcmMvSW50ZXJuZXRTZXJ2aWNlLnRzIiwiLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwLCBzaGVsbH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHtVUkx9IGZyb20gJ3VybCc7XG5cbi8qKlxuICogTGlzdCBvZiBvcmlnaW5zIHRoYXQgeW91IGFsbG93IG9wZW4gSU5TSURFIHRoZSBhcHBsaWNhdGlvbiBhbmQgcGVybWlzc2lvbnMgZm9yIGVhY2ggb2YgdGhlbS5cbiAqXG4gKiBJbiBkZXZlbG9wbWVudCBtb2RlIHlvdSBuZWVkIGFsbG93IG9wZW4gYFZJVEVfREVWX1NFUlZFUl9VUkxgXG4gKi9cbmNvbnN0IEFMTE9XRURfT1JJR0lOU19BTkRfUEVSTUlTU0lPTlMgPSBuZXcgTWFwPHN0cmluZywgU2V0PCdjbGlwYm9hcmQtcmVhZCcgfCAnbWVkaWEnIHwgJ2Rpc3BsYXktY2FwdHVyZScgfCAnbWVkaWFLZXlTeXN0ZW0nIHwgJ2dlb2xvY2F0aW9uJyB8ICdub3RpZmljYXRpb25zJyB8ICdtaWRpJyB8ICdtaWRpU3lzZXgnIHwgJ3BvaW50ZXJMb2NrJyB8ICdmdWxsc2NyZWVuJyB8ICdvcGVuRXh0ZXJuYWwnIHwgJ3Vua25vd24nPj4oXG4gIGltcG9ydC5tZXRhLmVudi5ERVYgJiYgaW1wb3J0Lm1ldGEuZW52LlZJVEVfREVWX1NFUlZFUl9VUkxcbiAgICA/IFtbbmV3IFVSTChpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCkub3JpZ2luLCBuZXcgU2V0XV1cbiAgICA6IFtdLFxuKTtcblxuLyoqXG4gKiBMaXN0IG9mIG9yaWdpbnMgdGhhdCB5b3UgYWxsb3cgb3BlbiBJTiBCUk9XU0VSLlxuICogTmF2aWdhdGlvbiB0byBvcmlnaW5zIGJlbG93IGlzIHBvc3NpYmxlIG9ubHkgaWYgdGhlIGxpbmsgb3BlbnMgaW4gYSBuZXcgd2luZG93XG4gKlxuICogQGV4YW1wbGVcbiAqIDxhXG4gKiAgIHRhcmdldD1cIl9ibGFua1wiXG4gKiAgIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vXCJcbiAqID5cbiAqL1xuY29uc3QgQUxMT1dFRF9FWFRFUk5BTF9PUklHSU5TID0gbmV3IFNldDxgaHR0cHM6Ly8ke3N0cmluZ31gPihbXG4gICdodHRwczovL2dpdGh1Yi5jb20nLFxuICAnaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbScsXG4gICdodHRwczovL3d3dy5nb29nbGUuY29tJyxcbl0pO1xuXG5cbmFwcC5vbignd2ViLWNvbnRlbnRzLWNyZWF0ZWQnLCAoXywgY29udGVudHMpID0+IHtcblxuICAvKipcbiAgICogQmxvY2sgbmF2aWdhdGlvbiB0byBvcmlnaW5zIG5vdCBvbiB0aGUgYWxsb3dsaXN0LlxuICAgKlxuICAgKiBOYXZpZ2F0aW9uIGlzIGEgY29tbW9uIGF0dGFjayB2ZWN0b3IuIElmIGFuIGF0dGFja2VyIGNhbiBjb252aW5jZSB0aGUgYXBwIHRvIG5hdmlnYXRlIGF3YXlcbiAgICogZnJvbSBpdHMgY3VycmVudCBwYWdlLCB0aGV5IGNhbiBwb3NzaWJseSBmb3JjZSB0aGUgYXBwIHRvIG9wZW4gd2ViIHNpdGVzIG9uIHRoZSBJbnRlcm5ldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxMy1kaXNhYmxlLW9yLWxpbWl0LW5hdmlnYXRpb25cbiAgICovXG4gIGNvbnRlbnRzLm9uKCd3aWxsLW5hdmlnYXRlJywgKGV2ZW50LCB1cmwpID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwodXJsKTtcbiAgICAvLyBpZiAoQUxMT1dFRF9PUklHSU5TX0FORF9QRVJNSVNTSU9OUy5oYXMob3JpZ2luKSkge1xuICAgIC8vICAgcmV0dXJuO1xuICAgIC8vIH1cblxuICAgIC8vIC8vIFByZXZlbnQgbmF2aWdhdGlvblxuICAgIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgIC8vICAgY29uc29sZS53YXJuKCdCbG9ja2VkIG5hdmlnYXRpbmcgdG8gYW4gdW5hbGxvd2VkIG9yaWdpbjonLCBvcmlnaW4pO1xuICAgIC8vIH1cbiAgfSk7XG5cblxuICAvKipcbiAgICogQmxvY2sgcmVxdWVzdGVkIHVuYWxsb3dlZCBwZXJtaXNzaW9ucy5cbiAgICogQnkgZGVmYXVsdCwgRWxlY3Ryb24gd2lsbCBhdXRvbWF0aWNhbGx5IGFwcHJvdmUgYWxsIHBlcm1pc3Npb24gcmVxdWVzdHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvdHV0b3JpYWwvc2VjdXJpdHkjNS1oYW5kbGUtc2Vzc2lvbi1wZXJtaXNzaW9uLXJlcXVlc3RzLWZyb20tcmVtb3RlLWNvbnRlbnRcbiAgICovXG4gIGNvbnRlbnRzLnNlc3Npb24uc2V0UGVybWlzc2lvblJlcXVlc3RIYW5kbGVyKCh3ZWJDb250ZW50cywgcGVybWlzc2lvbiwgY2FsbGJhY2spID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwod2ViQ29udGVudHMuZ2V0VVJMKCkpO1xuXG4gICAgY29uc3QgcGVybWlzc2lvbkdyYW50ZWQgPSAhIUFMTE9XRURfT1JJR0lOU19BTkRfUEVSTUlTU0lPTlMuZ2V0KG9yaWdpbik/LmhhcyhwZXJtaXNzaW9uKTtcbiAgICBjYWxsYmFjayhwZXJtaXNzaW9uR3JhbnRlZCk7XG5cbiAgICBpZiAoIXBlcm1pc3Npb25HcmFudGVkICYmIGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgICAgIGNvbnNvbGUud2FybihgJHtvcmlnaW59IHJlcXVlc3RlZCBwZXJtaXNzaW9uIGZvciAnJHtwZXJtaXNzaW9ufScsIGJ1dCB3YXMgYmxvY2tlZC5gKTtcbiAgICB9XG4gIH0pO1xuXG5cbiAgLyoqXG4gICAqIEh5cGVybGlua3MgdG8gYWxsb3dlZCBzaXRlcyBvcGVuIGluIHRoZSBkZWZhdWx0IGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBjcmVhdGlvbiBvZiBuZXcgYHdlYkNvbnRlbnRzYCBpcyBhIGNvbW1vbiBhdHRhY2sgdmVjdG9yLiBBdHRhY2tlcnMgYXR0ZW1wdCB0byBjb252aW5jZSB0aGUgYXBwIHRvIGNyZWF0ZSBuZXcgd2luZG93cyxcbiAgICogZnJhbWVzLCBvciBvdGhlciByZW5kZXJlciBwcm9jZXNzZXMgd2l0aCBtb3JlIHByaXZpbGVnZXMgdGhhbiB0aGV5IGhhZCBiZWZvcmU7IG9yIHdpdGggcGFnZXMgb3BlbmVkIHRoYXQgdGhleSBjb3VsZG4ndCBvcGVuIGJlZm9yZS5cbiAgICogWW91IHNob3VsZCBkZW55IGFueSB1bmV4cGVjdGVkIHdpbmRvdyBjcmVhdGlvbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxNC1kaXNhYmxlLW9yLWxpbWl0LWNyZWF0aW9uLW9mLW5ldy13aW5kb3dzXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvdHV0b3JpYWwvc2VjdXJpdHkjMTUtZG8tbm90LXVzZS1vcGVuZXh0ZXJuYWwtd2l0aC11bnRydXN0ZWQtY29udGVudFxuICAgKi9cbiAgY29udGVudHMuc2V0V2luZG93T3BlbkhhbmRsZXIoKHt1cmx9KSA9PiB7XG4gICAgY29uc3Qge29yaWdpbn0gPSBuZXcgVVJMKHVybCk7XG5cbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFR5cGUgY2hlY2tpbmcgaXMgcGVyZm9ybWVkIGluIHJ1bnRpbWVcbiAgICBpZiAoQUxMT1dFRF9FWFRFUk5BTF9PUklHSU5TLmhhcyhvcmlnaW4pKSB7XG4gICAgICAvLyBPcGVuIGRlZmF1bHQgYnJvd3NlclxuICAgICAgc2hlbGwub3BlbkV4dGVybmFsKHVybCkuY2F0Y2goY29uc29sZS5lcnJvcik7XG5cbiAgICB9IGVsc2UgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgICAgIGNvbnNvbGUud2FybignQmxvY2tlZCB0aGUgb3BlbmluZyBvZiBhbiB1bmFsbG93ZWQgb3JpZ2luOicsIG9yaWdpbik7XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCBjcmVhdGluZyBuZXcgd2luZG93IGluIGFwcGxpY2F0aW9uXG4gICAgcmV0dXJuIHthY3Rpb246ICdkZW55J307XG4gIH0pO1xuXG5cbiAgLyoqXG4gICAqIFZlcmlmeSB3ZWJ2aWV3IG9wdGlvbnMgYmVmb3JlIGNyZWF0aW9uXG4gICAqXG4gICAqIFN0cmlwIGF3YXkgcHJlbG9hZCBzY3JpcHRzLCBkaXNhYmxlIE5vZGUuanMgaW50ZWdyYXRpb24sIGFuZCBlbnN1cmUgb3JpZ2lucyBhcmUgb24gdGhlIGFsbG93bGlzdC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxMi12ZXJpZnktd2Vidmlldy1vcHRpb25zLWJlZm9yZS1jcmVhdGlvblxuICAgKi9cbiAgY29udGVudHMub24oJ3dpbGwtYXR0YWNoLXdlYnZpZXcnLCAoZXZlbnQsIHdlYlByZWZlcmVuY2VzLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwocGFyYW1zLnNyYyk7XG4gICAgaWYgKCFBTExPV0VEX09SSUdJTlNfQU5EX1BFUk1JU1NJT05TLmhhcyhvcmlnaW4pKSB7XG5cbiAgICAgIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQSB3ZWJ2aWV3IHRyaWVkIHRvIGF0dGFjaCAke3BhcmFtcy5zcmN9LCBidXQgd2FzIGJsb2NrZWQuYCk7XG4gICAgICB9XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU3RyaXAgYXdheSBwcmVsb2FkIHNjcmlwdHMgaWYgdW51c2VkIG9yIHZlcmlmeSB0aGVpciBsb2NhdGlvbiBpcyBsZWdpdGltYXRlXG4gICAgZGVsZXRlIHdlYlByZWZlcmVuY2VzLnByZWxvYWQ7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciBgcHJlbG9hZFVSTGAgZXhpc3RzIC0gc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L2FwaS93ZWItY29udGVudHMjZXZlbnQtd2lsbC1hdHRhY2gtd2Vidmlld1xuICAgIGRlbGV0ZSB3ZWJQcmVmZXJlbmNlcy5wcmVsb2FkVVJMO1xuXG4gICAgLy8gRGlzYWJsZSBOb2RlLmpzIGludGVncmF0aW9uXG4gICAgd2ViUHJlZmVyZW5jZXMubm9kZUludGVncmF0aW9uID0gZmFsc2U7XG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBCcm93c2VyV2luZG93LE1lbnUsc2hlbGwgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IFVSTCB9IGZyb20gJ3VybCc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcbiAgY29uc3QgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICBzaG93OiBmYWxzZSwgLy8gVXNlICdyZWFkeS10by1zaG93JyBldmVudCB0byBzaG93IHdpbmRvd1xuICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICBuYXRpdmVXaW5kb3dPcGVuOiB0cnVlLFxuICAgICAgd2Vidmlld1RhZzogdHJ1ZSwgLy8gVGhlIHdlYnZpZXcgdGFnIGlzIG5vdCByZWNvbW1lbmRlZC4gQ29uc2lkZXIgYWx0ZXJuYXRpdmVzIGxpa2UgaWZyYW1lIG9yIEVsZWN0cm9uJ3MgQnJvd3NlclZpZXcuIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L2FwaS93ZWJ2aWV3LXRhZyN3YXJuaW5nXG4gICAgICBwcmVsb2FkOiBqb2luKF9fZGlybmFtZSwgJy4uLy4uL3ByZWxvYWQvZGlzdC9pbmRleC5janMnKSxcbiAgICB9LFxuICAgIHdpZHRoOjEyODAsXG4gICAgaGVpZ2h0OjcwMCxcbiAgfSk7XG5cbiAgLyoqXG4gICogSWYgeW91IGluc3RhbGwgYHNob3c6IHRydWVgIHRoZW4gaXQgY2FuIGNhdXNlIGlzc3VlcyB3aGVuIHRyeWluZyB0byBjbG9zZSB0aGUgd2luZG93LlxuICAqIFVzZSBgc2hvdzogZmFsc2VgIGFuZCBsaXN0ZW5lciBldmVudHMgYHJlYWR5LXRvLXNob3dgIHRvIGZpeCB0aGVzZSBpc3N1ZXMuXG4gICpcbiAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvMjUwMTJcbiAgKi9cbiAgbWFpbldpbmRvdy5vbigncmVhZHktdG8tc2hvdycsICgpID0+IHtcbiAgICBtYWluV2luZG93Py5zaG93KCk7XG5cbiAgICAvLyBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgIC8vICAgbWFpbldpbmRvdz8ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG4gICAgLy8gfVxuICB9KTtcblxuICAvKipcbiAgKiBVUkwgZm9yIG1haW4gd2luZG93LlxuICAqIFZpdGUgZGV2IHNlcnZlciBmb3IgZGV2ZWxvcG1lbnQuXG4gICogYGZpbGU6Ly8uLi9yZW5kZXJlci9pbmRleC5odG1sYCBmb3IgcHJvZHVjdGlvbiBhbmQgdGVzdFxuICAqL1xuICBjb25zdCBwYWdlVXJsID0gaW1wb3J0Lm1ldGEuZW52LkRFViAmJiBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTCAhPT0gdW5kZWZpbmVkXG4gICAgPyBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTFxuICAgIDogbmV3IFVSTCgnLi4vcmVuZGVyZXIvZGlzdC9pbmRleC5odG1sJywgJ2ZpbGU6Ly8nICsgX19kaXJuYW1lKS50b1N0cmluZygpO1xuXG5cbiAgYXdhaXQgbWFpbldpbmRvdy5sb2FkVVJMKHBhZ2VVcmwpO1xuICAvLyBtYWluV2luZG93LndlYkNvbnRlbnRzLmxvYWRVUkwoXCJodHRwczovL3d3dy5nb29nbGUuY29tXCIpO1xuXG4gIHJldHVybiBtYWluV2luZG93O1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuKiBSZXN0b3JlIGV4aXN0aW5nIEJyb3dzZXJXaW5kb3cgb3IgQ3JlYXRlIG5ldyBCcm93c2VyV2luZG93XG4qL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc3RvcmVPckNyZWF0ZVdpbmRvdygpIHtcbiAgbGV0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcblxuICBjb25zdCB0ZW1wbGF0ZSA9IFtcbiAgICB7XG4gICAgICBsYWJlbDogJ1dpbmRvdycsXG4gICAgICBzdWJtZW51OiBbXG4gICAgICAgIHsgcm9sZTogJ3F1aXQnIH0sXG4gICAgICAgIHsgcm9sZTogJ3JlbG9hZCcgfSxcbiAgICAgICAgeyByb2xlOiAnZm9yY2VSZWxvYWQnIH0sXG4gICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgeyByb2xlOiAndG9nZ2xlRGV2VG9vbHMnIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICByb2xlOiAnaGVscCcsXG4gICAgICBzdWJtZW51OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ1R1dG9yaWFscycsXG4gICAgICAgICAgY2xpY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9uZmRpNHBsYW50cy5vcmcvbmZkaTRwbGFudHMua25vd2xlZGdlYmFzZS9kb2NzL3R1dG9yaWFscy9RdWlja1N0YXJ0X3N3YXRlLmh0bWwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ0hlbHBkZXNrJyxcbiAgICAgICAgICBjbGljazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2hlbHBkZXNrLm5mZGk0cGxhbnRzLm9yZycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnS25vd2xlZGdlIEJhc2UnLFxuICAgICAgICAgIGNsaWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vbmZkaTRwbGFudHMub3JnL25mZGk0cGxhbnRzLmtub3dsZWRnZWJhc2UvaW5kZXguaHRtbCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIF1cbiAgICB9XG4gIF07XG4gIGNvbnN0IG1lbnUgPSBNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKHRlbXBsYXRlKTtcbiAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUobWVudSk7XG5cbiAgaWYgKHdpbmRvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgd2luZG93ID0gYXdhaXQgY3JlYXRlV2luZG93KCk7XG4gIH1cblxuICBpZiAod2luZG93LmlzTWluaW1pemVkKCkpIHtcbiAgICB3aW5kb3cucmVzdG9yZSgpO1xuICB9XG5cbiAgd2luZG93LmZvY3VzKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBXSU5fU0xBU0ggPSAnXFxcXFxcXFwvJztcbmNvbnN0IFdJTl9OT19TTEFTSCA9IGBbXiR7V0lOX1NMQVNIfV1gO1xuXG4vKipcbiAqIFBvc2l4IGdsb2IgcmVnZXhcbiAqL1xuXG5jb25zdCBET1RfTElURVJBTCA9ICdcXFxcLic7XG5jb25zdCBQTFVTX0xJVEVSQUwgPSAnXFxcXCsnO1xuY29uc3QgUU1BUktfTElURVJBTCA9ICdcXFxcPyc7XG5jb25zdCBTTEFTSF9MSVRFUkFMID0gJ1xcXFwvJztcbmNvbnN0IE9ORV9DSEFSID0gJyg/PS4pJztcbmNvbnN0IFFNQVJLID0gJ1teL10nO1xuY29uc3QgRU5EX0FOQ0hPUiA9IGAoPzoke1NMQVNIX0xJVEVSQUx9fCQpYDtcbmNvbnN0IFNUQVJUX0FOQ0hPUiA9IGAoPzpefCR7U0xBU0hfTElURVJBTH0pYDtcbmNvbnN0IERPVFNfU0xBU0ggPSBgJHtET1RfTElURVJBTH17MSwyfSR7RU5EX0FOQ0hPUn1gO1xuY29uc3QgTk9fRE9UID0gYCg/ISR7RE9UX0xJVEVSQUx9KWA7XG5jb25zdCBOT19ET1RTID0gYCg/ISR7U1RBUlRfQU5DSE9SfSR7RE9UU19TTEFTSH0pYDtcbmNvbnN0IE5PX0RPVF9TTEFTSCA9IGAoPyEke0RPVF9MSVRFUkFMfXswLDF9JHtFTkRfQU5DSE9SfSlgO1xuY29uc3QgTk9fRE9UU19TTEFTSCA9IGAoPyEke0RPVFNfU0xBU0h9KWA7XG5jb25zdCBRTUFSS19OT19ET1QgPSBgW14uJHtTTEFTSF9MSVRFUkFMfV1gO1xuY29uc3QgU1RBUiA9IGAke1FNQVJLfSo/YDtcblxuY29uc3QgUE9TSVhfQ0hBUlMgPSB7XG4gIERPVF9MSVRFUkFMLFxuICBQTFVTX0xJVEVSQUwsXG4gIFFNQVJLX0xJVEVSQUwsXG4gIFNMQVNIX0xJVEVSQUwsXG4gIE9ORV9DSEFSLFxuICBRTUFSSyxcbiAgRU5EX0FOQ0hPUixcbiAgRE9UU19TTEFTSCxcbiAgTk9fRE9ULFxuICBOT19ET1RTLFxuICBOT19ET1RfU0xBU0gsXG4gIE5PX0RPVFNfU0xBU0gsXG4gIFFNQVJLX05PX0RPVCxcbiAgU1RBUixcbiAgU1RBUlRfQU5DSE9SXG59O1xuXG4vKipcbiAqIFdpbmRvd3MgZ2xvYiByZWdleFxuICovXG5cbmNvbnN0IFdJTkRPV1NfQ0hBUlMgPSB7XG4gIC4uLlBPU0lYX0NIQVJTLFxuXG4gIFNMQVNIX0xJVEVSQUw6IGBbJHtXSU5fU0xBU0h9XWAsXG4gIFFNQVJLOiBXSU5fTk9fU0xBU0gsXG4gIFNUQVI6IGAke1dJTl9OT19TTEFTSH0qP2AsXG4gIERPVFNfU0xBU0g6IGAke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JClgLFxuICBOT19ET1Q6IGAoPyEke0RPVF9MSVRFUkFMfSlgLFxuICBOT19ET1RTOiBgKD8hKD86XnxbJHtXSU5fU0xBU0h9XSkke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JCkpYCxcbiAgTk9fRE9UX1NMQVNIOiBgKD8hJHtET1RfTElURVJBTH17MCwxfSg/Olske1dJTl9TTEFTSH1dfCQpKWAsXG4gIE5PX0RPVFNfU0xBU0g6IGAoPyEke0RPVF9MSVRFUkFMfXsxLDJ9KD86WyR7V0lOX1NMQVNIfV18JCkpYCxcbiAgUU1BUktfTk9fRE9UOiBgW14uJHtXSU5fU0xBU0h9XWAsXG4gIFNUQVJUX0FOQ0hPUjogYCg/Ol58WyR7V0lOX1NMQVNIfV0pYCxcbiAgRU5EX0FOQ0hPUjogYCg/Olske1dJTl9TTEFTSH1dfCQpYFxufTtcblxuLyoqXG4gKiBQT1NJWCBCcmFja2V0IFJlZ2V4XG4gKi9cblxuY29uc3QgUE9TSVhfUkVHRVhfU09VUkNFID0ge1xuICBhbG51bTogJ2EtekEtWjAtOScsXG4gIGFscGhhOiAnYS16QS1aJyxcbiAgYXNjaWk6ICdcXFxceDAwLVxcXFx4N0YnLFxuICBibGFuazogJyBcXFxcdCcsXG4gIGNudHJsOiAnXFxcXHgwMC1cXFxceDFGXFxcXHg3RicsXG4gIGRpZ2l0OiAnMC05JyxcbiAgZ3JhcGg6ICdcXFxceDIxLVxcXFx4N0UnLFxuICBsb3dlcjogJ2EteicsXG4gIHByaW50OiAnXFxcXHgyMC1cXFxceDdFICcsXG4gIHB1bmN0OiAnXFxcXC0hXCIjJCUmXFwnKClcXFxcKissLi86Ozw9Pj9AW1xcXFxdXl9ge3x9ficsXG4gIHNwYWNlOiAnIFxcXFx0XFxcXHJcXFxcblxcXFx2XFxcXGYnLFxuICB1cHBlcjogJ0EtWicsXG4gIHdvcmQ6ICdBLVphLXowLTlfJyxcbiAgeGRpZ2l0OiAnQS1GYS1mMC05J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1BWF9MRU5HVEg6IDEwMjQgKiA2NCxcbiAgUE9TSVhfUkVHRVhfU09VUkNFLFxuXG4gIC8vIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAgUkVHRVhfQkFDS1NMQVNIOiAvXFxcXCg/IVsqKz9eJHt9KHwpW1xcXV0pL2csXG4gIFJFR0VYX05PTl9TUEVDSUFMX0NIQVJTOiAvXlteQCFbXFxdLiwkKis/Xnt9KCl8XFxcXC9dKy8sXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlM6IC9bLSorPy5eJHt9KHwpW1xcXV0vLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0JBQ0tSRUY6IC8oXFxcXD8pKChcXFcpKFxcMyopKS9nLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0dMT0JBTDogLyhbLSorPy5eJHt9KHwpW1xcXV0pL2csXG4gIFJFR0VYX1JFTU9WRV9CQUNLU0xBU0g6IC8oPzpcXFsuKj9bXlxcXFxdXFxdfFxcXFwoPz0uKSkvZyxcblxuICAvLyBSZXBsYWNlIGdsb2JzIHdpdGggZXF1aXZhbGVudCBwYXR0ZXJucyB0byByZWR1Y2UgcGFyc2luZyB0aW1lLlxuICBSRVBMQUNFTUVOVFM6IHtcbiAgICAnKioqJzogJyonLFxuICAgICcqKi8qKic6ICcqKicsXG4gICAgJyoqLyoqLyoqJzogJyoqJ1xuICB9LFxuXG4gIC8vIERpZ2l0c1xuICBDSEFSXzA6IDQ4LCAvKiAwICovXG4gIENIQVJfOTogNTcsIC8qIDkgKi9cblxuICAvLyBBbHBoYWJldCBjaGFycy5cbiAgQ0hBUl9VUFBFUkNBU0VfQTogNjUsIC8qIEEgKi9cbiAgQ0hBUl9MT1dFUkNBU0VfQTogOTcsIC8qIGEgKi9cbiAgQ0hBUl9VUFBFUkNBU0VfWjogOTAsIC8qIFogKi9cbiAgQ0hBUl9MT1dFUkNBU0VfWjogMTIyLCAvKiB6ICovXG5cbiAgQ0hBUl9MRUZUX1BBUkVOVEhFU0VTOiA0MCwgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTOiA0MSwgLyogKSAqL1xuXG4gIENIQVJfQVNURVJJU0s6IDQyLCAvKiAqICovXG5cbiAgLy8gTm9uLWFscGhhYmV0aWMgY2hhcnMuXG4gIENIQVJfQU1QRVJTQU5EOiAzOCwgLyogJiAqL1xuICBDSEFSX0FUOiA2NCwgLyogQCAqL1xuICBDSEFSX0JBQ0tXQVJEX1NMQVNIOiA5MiwgLyogXFwgKi9cbiAgQ0hBUl9DQVJSSUFHRV9SRVRVUk46IDEzLCAvKiBcXHIgKi9cbiAgQ0hBUl9DSVJDVU1GTEVYX0FDQ0VOVDogOTQsIC8qIF4gKi9cbiAgQ0hBUl9DT0xPTjogNTgsIC8qIDogKi9cbiAgQ0hBUl9DT01NQTogNDQsIC8qICwgKi9cbiAgQ0hBUl9ET1Q6IDQ2LCAvKiAuICovXG4gIENIQVJfRE9VQkxFX1FVT1RFOiAzNCwgLyogXCIgKi9cbiAgQ0hBUl9FUVVBTDogNjEsIC8qID0gKi9cbiAgQ0hBUl9FWENMQU1BVElPTl9NQVJLOiAzMywgLyogISAqL1xuICBDSEFSX0ZPUk1fRkVFRDogMTIsIC8qIFxcZiAqL1xuICBDSEFSX0ZPUldBUkRfU0xBU0g6IDQ3LCAvKiAvICovXG4gIENIQVJfR1JBVkVfQUNDRU5UOiA5NiwgLyogYCAqL1xuICBDSEFSX0hBU0g6IDM1LCAvKiAjICovXG4gIENIQVJfSFlQSEVOX01JTlVTOiA0NSwgLyogLSAqL1xuICBDSEFSX0xFRlRfQU5HTEVfQlJBQ0tFVDogNjAsIC8qIDwgKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFOiAxMjMsIC8qIHsgKi9cbiAgQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUOiA5MSwgLyogWyAqL1xuICBDSEFSX0xJTkVfRkVFRDogMTAsIC8qIFxcbiAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFOiAxNjAsIC8qIFxcdTAwQTAgKi9cbiAgQ0hBUl9QRVJDRU5UOiAzNywgLyogJSAqL1xuICBDSEFSX1BMVVM6IDQzLCAvKiArICovXG4gIENIQVJfUVVFU1RJT05fTUFSSzogNjMsIC8qID8gKi9cbiAgQ0hBUl9SSUdIVF9BTkdMRV9CUkFDS0VUOiA2MiwgLyogPiAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFOiAxMjUsIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVDogOTMsIC8qIF0gKi9cbiAgQ0hBUl9TRU1JQ09MT046IDU5LCAvKiA7ICovXG4gIENIQVJfU0lOR0xFX1FVT1RFOiAzOSwgLyogJyAqL1xuICBDSEFSX1NQQUNFOiAzMiwgLyogICAqL1xuICBDSEFSX1RBQjogOSwgLyogXFx0ICovXG4gIENIQVJfVU5ERVJTQ09SRTogOTUsIC8qIF8gKi9cbiAgQ0hBUl9WRVJUSUNBTF9MSU5FOiAxMjQsIC8qIHwgKi9cbiAgQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0U6IDY1Mjc5LCAvKiBcXHVGRUZGICovXG5cbiAgU0VQOiBwYXRoLnNlcCxcblxuICAvKipcbiAgICogQ3JlYXRlIEVYVEdMT0JfQ0hBUlNcbiAgICovXG5cbiAgZXh0Z2xvYkNoYXJzKGNoYXJzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICchJzogeyB0eXBlOiAnbmVnYXRlJywgb3BlbjogJyg/Oig/ISg/OicsIGNsb3NlOiBgKSkke2NoYXJzLlNUQVJ9KWAgfSxcbiAgICAgICc/JzogeyB0eXBlOiAncW1hcmsnLCBvcGVuOiAnKD86JywgY2xvc2U6ICcpPycgfSxcbiAgICAgICcrJzogeyB0eXBlOiAncGx1cycsIG9wZW46ICcoPzonLCBjbG9zZTogJykrJyB9LFxuICAgICAgJyonOiB7IHR5cGU6ICdzdGFyJywgb3BlbjogJyg/OicsIGNsb3NlOiAnKSonIH0sXG4gICAgICAnQCc6IHsgdHlwZTogJ2F0Jywgb3BlbjogJyg/OicsIGNsb3NlOiAnKScgfVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBHTE9CX0NIQVJTXG4gICAqL1xuXG4gIGdsb2JDaGFycyh3aW4zMikge1xuICAgIHJldHVybiB3aW4zMiA9PT0gdHJ1ZSA/IFdJTkRPV1NfQ0hBUlMgOiBQT1NJWF9DSEFSUztcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHdpbjMyID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJztcbmNvbnN0IHtcbiAgUkVHRVhfQkFDS1NMQVNILFxuICBSRUdFWF9SRU1PVkVfQkFDS1NMQVNILFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0dMT0JBTFxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbmV4cG9ydHMuaXNPYmplY3QgPSB2YWwgPT4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbCk7XG5leHBvcnRzLmhhc1JlZ2V4Q2hhcnMgPSBzdHIgPT4gUkVHRVhfU1BFQ0lBTF9DSEFSUy50ZXN0KHN0cik7XG5leHBvcnRzLmlzUmVnZXhDaGFyID0gc3RyID0+IHN0ci5sZW5ndGggPT09IDEgJiYgZXhwb3J0cy5oYXNSZWdleENoYXJzKHN0cik7XG5leHBvcnRzLmVzY2FwZVJlZ2V4ID0gc3RyID0+IHN0ci5yZXBsYWNlKFJFR0VYX1NQRUNJQUxfQ0hBUlNfR0xPQkFMLCAnXFxcXCQxJyk7XG5leHBvcnRzLnRvUG9zaXhTbGFzaGVzID0gc3RyID0+IHN0ci5yZXBsYWNlKFJFR0VYX0JBQ0tTTEFTSCwgJy8nKTtcblxuZXhwb3J0cy5yZW1vdmVCYWNrc2xhc2hlcyA9IHN0ciA9PiB7XG4gIHJldHVybiBzdHIucmVwbGFjZShSRUdFWF9SRU1PVkVfQkFDS1NMQVNILCBtYXRjaCA9PiB7XG4gICAgcmV0dXJuIG1hdGNoID09PSAnXFxcXCcgPyAnJyA6IG1hdGNoO1xuICB9KTtcbn07XG5cbmV4cG9ydHMuc3VwcG9ydHNMb29rYmVoaW5kcyA9ICgpID0+IHtcbiAgY29uc3Qgc2VncyA9IHByb2Nlc3MudmVyc2lvbi5zbGljZSgxKS5zcGxpdCgnLicpLm1hcChOdW1iZXIpO1xuICBpZiAoc2Vncy5sZW5ndGggPT09IDMgJiYgc2Vnc1swXSA+PSA5IHx8IChzZWdzWzBdID09PSA4ICYmIHNlZ3NbMV0gPj0gMTApKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0cy5pc1dpbmRvd3MgPSBvcHRpb25zID0+IHtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMud2luZG93cyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMud2luZG93cztcbiAgfVxuICByZXR1cm4gd2luMzIgPT09IHRydWUgfHwgcGF0aC5zZXAgPT09ICdcXFxcJztcbn07XG5cbmV4cG9ydHMuZXNjYXBlTGFzdCA9IChpbnB1dCwgY2hhciwgbGFzdElkeCkgPT4ge1xuICBjb25zdCBpZHggPSBpbnB1dC5sYXN0SW5kZXhPZihjaGFyLCBsYXN0SWR4KTtcbiAgaWYgKGlkeCA9PT0gLTEpIHJldHVybiBpbnB1dDtcbiAgaWYgKGlucHV0W2lkeCAtIDFdID09PSAnXFxcXCcpIHJldHVybiBleHBvcnRzLmVzY2FwZUxhc3QoaW5wdXQsIGNoYXIsIGlkeCAtIDEpO1xuICByZXR1cm4gYCR7aW5wdXQuc2xpY2UoMCwgaWR4KX1cXFxcJHtpbnB1dC5zbGljZShpZHgpfWA7XG59O1xuXG5leHBvcnRzLnJlbW92ZVByZWZpeCA9IChpbnB1dCwgc3RhdGUgPSB7fSkgPT4ge1xuICBsZXQgb3V0cHV0ID0gaW5wdXQ7XG4gIGlmIChvdXRwdXQuc3RhcnRzV2l0aCgnLi8nKSkge1xuICAgIG91dHB1dCA9IG91dHB1dC5zbGljZSgyKTtcbiAgICBzdGF0ZS5wcmVmaXggPSAnLi8nO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59O1xuXG5leHBvcnRzLndyYXBPdXRwdXQgPSAoaW5wdXQsIHN0YXRlID0ge30sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCBwcmVwZW5kID0gb3B0aW9ucy5jb250YWlucyA/ICcnIDogJ14nO1xuICBjb25zdCBhcHBlbmQgPSBvcHRpb25zLmNvbnRhaW5zID8gJycgOiAnJCc7XG5cbiAgbGV0IG91dHB1dCA9IGAke3ByZXBlbmR9KD86JHtpbnB1dH0pJHthcHBlbmR9YDtcbiAgaWYgKHN0YXRlLm5lZ2F0ZWQgPT09IHRydWUpIHtcbiAgICBvdXRwdXQgPSBgKD86Xig/ISR7b3V0cHV0fSkuKiQpYDtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCB7XG4gIENIQVJfQVNURVJJU0ssICAgICAgICAgICAgIC8qICogKi9cbiAgQ0hBUl9BVCwgICAgICAgICAgICAgICAgICAgLyogQCAqL1xuICBDSEFSX0JBQ0tXQVJEX1NMQVNILCAgICAgICAvKiBcXCAqL1xuICBDSEFSX0NPTU1BLCAgICAgICAgICAgICAgICAvKiAsICovXG4gIENIQVJfRE9ULCAgICAgICAgICAgICAgICAgIC8qIC4gKi9cbiAgQ0hBUl9FWENMQU1BVElPTl9NQVJLLCAgICAgLyogISAqL1xuICBDSEFSX0ZPUldBUkRfU0xBU0gsICAgICAgICAvKiAvICovXG4gIENIQVJfTEVGVF9DVVJMWV9CUkFDRSwgICAgIC8qIHsgKi9cbiAgQ0hBUl9MRUZUX1BBUkVOVEhFU0VTLCAgICAgLyogKCAqL1xuICBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQsICAvKiBbICovXG4gIENIQVJfUExVUywgICAgICAgICAgICAgICAgIC8qICsgKi9cbiAgQ0hBUl9RVUVTVElPTl9NQVJLLCAgICAgICAgLyogPyAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFLCAgICAvKiB9ICovXG4gIENIQVJfUklHSFRfUEFSRU5USEVTRVMsICAgIC8qICkgKi9cbiAgQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVCAgLyogXSAqL1xufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbmNvbnN0IGlzUGF0aFNlcGFyYXRvciA9IGNvZGUgPT4ge1xuICByZXR1cm4gY29kZSA9PT0gQ0hBUl9GT1JXQVJEX1NMQVNIIHx8IGNvZGUgPT09IENIQVJfQkFDS1dBUkRfU0xBU0g7XG59O1xuXG5jb25zdCBkZXB0aCA9IHRva2VuID0+IHtcbiAgaWYgKHRva2VuLmlzUHJlZml4ICE9PSB0cnVlKSB7XG4gICAgdG9rZW4uZGVwdGggPSB0b2tlbi5pc0dsb2JzdGFyID8gSW5maW5pdHkgOiAxO1xuICB9XG59O1xuXG4vKipcbiAqIFF1aWNrbHkgc2NhbnMgYSBnbG9iIHBhdHRlcm4gYW5kIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYSBoYW5kZnVsIG9mXG4gKiB1c2VmdWwgcHJvcGVydGllcywgbGlrZSBgaXNHbG9iYCwgYHBhdGhgICh0aGUgbGVhZGluZyBub24tZ2xvYiwgaWYgaXQgZXhpc3RzKSxcbiAqIGBnbG9iYCAodGhlIGFjdHVhbCBwYXR0ZXJuKSwgYG5lZ2F0ZWRgICh0cnVlIGlmIHRoZSBwYXRoIHN0YXJ0cyB3aXRoIGAhYCBidXQgbm90XG4gKiB3aXRoIGAhKGApIGFuZCBgbmVnYXRlZEV4dGdsb2JgICh0cnVlIGlmIHRoZSBwYXRoIHN0YXJ0cyB3aXRoIGAhKGApLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwbSA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogY29uc29sZS5sb2cocG0uc2NhbignZm9vL2Jhci8qLmpzJykpO1xuICogeyBpc0dsb2I6IHRydWUsIGlucHV0OiAnZm9vL2Jhci8qLmpzJywgYmFzZTogJ2Zvby9iYXInLCBnbG9iOiAnKi5qcycgfVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHN0cmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0b2tlbnMgYW5kIHJlZ2V4IHNvdXJjZSBzdHJpbmcuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmNvbnN0IHNjYW4gPSAoaW5wdXQsIG9wdGlvbnMpID0+IHtcbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG5cbiAgY29uc3QgbGVuZ3RoID0gaW5wdXQubGVuZ3RoIC0gMTtcbiAgY29uc3Qgc2NhblRvRW5kID0gb3B0cy5wYXJ0cyA9PT0gdHJ1ZSB8fCBvcHRzLnNjYW5Ub0VuZCA9PT0gdHJ1ZTtcbiAgY29uc3Qgc2xhc2hlcyA9IFtdO1xuICBjb25zdCB0b2tlbnMgPSBbXTtcbiAgY29uc3QgcGFydHMgPSBbXTtcblxuICBsZXQgc3RyID0gaW5wdXQ7XG4gIGxldCBpbmRleCA9IC0xO1xuICBsZXQgc3RhcnQgPSAwO1xuICBsZXQgbGFzdEluZGV4ID0gMDtcbiAgbGV0IGlzQnJhY2UgPSBmYWxzZTtcbiAgbGV0IGlzQnJhY2tldCA9IGZhbHNlO1xuICBsZXQgaXNHbG9iID0gZmFsc2U7XG4gIGxldCBpc0V4dGdsb2IgPSBmYWxzZTtcbiAgbGV0IGlzR2xvYnN0YXIgPSBmYWxzZTtcbiAgbGV0IGJyYWNlRXNjYXBlZCA9IGZhbHNlO1xuICBsZXQgYmFja3NsYXNoZXMgPSBmYWxzZTtcbiAgbGV0IG5lZ2F0ZWQgPSBmYWxzZTtcbiAgbGV0IG5lZ2F0ZWRFeHRnbG9iID0gZmFsc2U7XG4gIGxldCBmaW5pc2hlZCA9IGZhbHNlO1xuICBsZXQgYnJhY2VzID0gMDtcbiAgbGV0IHByZXY7XG4gIGxldCBjb2RlO1xuICBsZXQgdG9rZW4gPSB7IHZhbHVlOiAnJywgZGVwdGg6IDAsIGlzR2xvYjogZmFsc2UgfTtcblxuICBjb25zdCBlb3MgPSAoKSA9PiBpbmRleCA+PSBsZW5ndGg7XG4gIGNvbnN0IHBlZWsgPSAoKSA9PiBzdHIuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICBjb25zdCBhZHZhbmNlID0gKCkgPT4ge1xuICAgIHByZXYgPSBjb2RlO1xuICAgIHJldHVybiBzdHIuY2hhckNvZGVBdCgrK2luZGV4KTtcbiAgfTtcblxuICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICBjb2RlID0gYWR2YW5jZSgpO1xuICAgIGxldCBuZXh0O1xuXG4gICAgaWYgKGNvZGUgPT09IENIQVJfQkFDS1dBUkRfU0xBU0gpIHtcbiAgICAgIGJhY2tzbGFzaGVzID0gdG9rZW4uYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgY29kZSA9IGFkdmFuY2UoKTtcblxuICAgICAgaWYgKGNvZGUgPT09IENIQVJfTEVGVF9DVVJMWV9CUkFDRSkge1xuICAgICAgICBicmFjZUVzY2FwZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGJyYWNlRXNjYXBlZCA9PT0gdHJ1ZSB8fCBjb2RlID09PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgIGJyYWNlcysrO1xuXG4gICAgICB3aGlsZSAoZW9zKCkgIT09IHRydWUgJiYgKGNvZGUgPSBhZHZhbmNlKCkpKSB7XG4gICAgICAgIGlmIChjb2RlID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICAgICAgYmFja3NsYXNoZXMgPSB0b2tlbi5iYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICAgICAgYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfTEVGVF9DVVJMWV9CUkFDRSkge1xuICAgICAgICAgIGJyYWNlcysrO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJyYWNlRXNjYXBlZCAhPT0gdHJ1ZSAmJiBjb2RlID09PSBDSEFSX0RPVCAmJiAoY29kZSA9IGFkdmFuY2UoKSkgPT09IENIQVJfRE9UKSB7XG4gICAgICAgICAgaXNCcmFjZSA9IHRva2VuLmlzQnJhY2UgPSB0cnVlO1xuICAgICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYnJhY2VFc2NhcGVkICE9PSB0cnVlICYmIGNvZGUgPT09IENIQVJfQ09NTUEpIHtcbiAgICAgICAgICBpc0JyYWNlID0gdG9rZW4uaXNCcmFjZSA9IHRydWU7XG4gICAgICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2RlID09PSBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFKSB7XG4gICAgICAgICAgYnJhY2VzLS07XG5cbiAgICAgICAgICBpZiAoYnJhY2VzID09PSAwKSB7XG4gICAgICAgICAgICBicmFjZUVzY2FwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlzQnJhY2UgPSB0b2tlbi5pc0JyYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gQ0hBUl9GT1JXQVJEX1NMQVNIKSB7XG4gICAgICBzbGFzaGVzLnB1c2goaW5kZXgpO1xuICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgdG9rZW4gPSB7IHZhbHVlOiAnJywgZGVwdGg6IDAsIGlzR2xvYjogZmFsc2UgfTtcblxuICAgICAgaWYgKGZpbmlzaGVkID09PSB0cnVlKSBjb250aW51ZTtcbiAgICAgIGlmIChwcmV2ID09PSBDSEFSX0RPVCAmJiBpbmRleCA9PT0gKHN0YXJ0ICsgMSkpIHtcbiAgICAgICAgc3RhcnQgKz0gMjtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxhc3RJbmRleCA9IGluZGV4ICsgMTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChvcHRzLm5vZXh0ICE9PSB0cnVlKSB7XG4gICAgICBjb25zdCBpc0V4dGdsb2JDaGFyID0gY29kZSA9PT0gQ0hBUl9QTFVTXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfQVRcbiAgICAgICAgfHwgY29kZSA9PT0gQ0hBUl9BU1RFUklTS1xuICAgICAgICB8fCBjb2RlID09PSBDSEFSX1FVRVNUSU9OX01BUktcbiAgICAgICAgfHwgY29kZSA9PT0gQ0hBUl9FWENMQU1BVElPTl9NQVJLO1xuXG4gICAgICBpZiAoaXNFeHRnbG9iQ2hhciA9PT0gdHJ1ZSAmJiBwZWVrKCkgPT09IENIQVJfTEVGVF9QQVJFTlRIRVNFUykge1xuICAgICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgICBpc0V4dGdsb2IgPSB0b2tlbi5pc0V4dGdsb2IgPSB0cnVlO1xuICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIGlmIChjb2RlID09PSBDSEFSX0VYQ0xBTUFUSU9OX01BUksgJiYgaW5kZXggPT09IHN0YXJ0KSB7XG4gICAgICAgICAgbmVnYXRlZEV4dGdsb2IgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHdoaWxlIChlb3MoKSAhPT0gdHJ1ZSAmJiAoY29kZSA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgICAgIGlmIChjb2RlID09PSBDSEFSX0JBQ0tXQVJEX1NMQVNIKSB7XG4gICAgICAgICAgICAgIGJhY2tzbGFzaGVzID0gdG9rZW4uYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgICBjb2RlID0gYWR2YW5jZSgpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfUklHSFRfUEFSRU5USEVTRVMpIHtcbiAgICAgICAgICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IENIQVJfQVNURVJJU0spIHtcbiAgICAgIGlmIChwcmV2ID09PSBDSEFSX0FTVEVSSVNLKSBpc0dsb2JzdGFyID0gdG9rZW4uaXNHbG9ic3RhciA9IHRydWU7XG4gICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IENIQVJfUVVFU1RJT05fTUFSSykge1xuICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgIHdoaWxlIChlb3MoKSAhPT0gdHJ1ZSAmJiAobmV4dCA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgaWYgKG5leHQgPT09IENIQVJfQkFDS1dBUkRfU0xBU0gpIHtcbiAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICBhZHZhbmNlKCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgICAgIGlzQnJhY2tldCA9IHRva2VuLmlzQnJhY2tldCA9IHRydWU7XG4gICAgICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjYW5Ub0VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMubm9uZWdhdGUgIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9FWENMQU1BVElPTl9NQVJLICYmIGluZGV4ID09PSBzdGFydCkge1xuICAgICAgbmVnYXRlZCA9IHRva2VuLm5lZ2F0ZWQgPSB0cnVlO1xuICAgICAgc3RhcnQrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChvcHRzLm5vcGFyZW4gIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIHdoaWxlIChlb3MoKSAhPT0gdHJ1ZSAmJiAoY29kZSA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvZGUgPSBhZHZhbmNlKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUykge1xuICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGlzR2xvYiA9PT0gdHJ1ZSkge1xuICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy5ub2V4dCA9PT0gdHJ1ZSkge1xuICAgIGlzRXh0Z2xvYiA9IGZhbHNlO1xuICAgIGlzR2xvYiA9IGZhbHNlO1xuICB9XG5cbiAgbGV0IGJhc2UgPSBzdHI7XG4gIGxldCBwcmVmaXggPSAnJztcbiAgbGV0IGdsb2IgPSAnJztcblxuICBpZiAoc3RhcnQgPiAwKSB7XG4gICAgcHJlZml4ID0gc3RyLnNsaWNlKDAsIHN0YXJ0KTtcbiAgICBzdHIgPSBzdHIuc2xpY2Uoc3RhcnQpO1xuICAgIGxhc3RJbmRleCAtPSBzdGFydDtcbiAgfVxuXG4gIGlmIChiYXNlICYmIGlzR2xvYiA9PT0gdHJ1ZSAmJiBsYXN0SW5kZXggPiAwKSB7XG4gICAgYmFzZSA9IHN0ci5zbGljZSgwLCBsYXN0SW5kZXgpO1xuICAgIGdsb2IgPSBzdHIuc2xpY2UobGFzdEluZGV4KTtcbiAgfSBlbHNlIGlmIChpc0dsb2IgPT09IHRydWUpIHtcbiAgICBiYXNlID0gJyc7XG4gICAgZ2xvYiA9IHN0cjtcbiAgfSBlbHNlIHtcbiAgICBiYXNlID0gc3RyO1xuICB9XG5cbiAgaWYgKGJhc2UgJiYgYmFzZSAhPT0gJycgJiYgYmFzZSAhPT0gJy8nICYmIGJhc2UgIT09IHN0cikge1xuICAgIGlmIChpc1BhdGhTZXBhcmF0b3IoYmFzZS5jaGFyQ29kZUF0KGJhc2UubGVuZ3RoIC0gMSkpKSB7XG4gICAgICBiYXNlID0gYmFzZS5zbGljZSgwLCAtMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICBpZiAoZ2xvYikgZ2xvYiA9IHV0aWxzLnJlbW92ZUJhY2tzbGFzaGVzKGdsb2IpO1xuXG4gICAgaWYgKGJhc2UgJiYgYmFja3NsYXNoZXMgPT09IHRydWUpIHtcbiAgICAgIGJhc2UgPSB1dGlscy5yZW1vdmVCYWNrc2xhc2hlcyhiYXNlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBwcmVmaXgsXG4gICAgaW5wdXQsXG4gICAgc3RhcnQsXG4gICAgYmFzZSxcbiAgICBnbG9iLFxuICAgIGlzQnJhY2UsXG4gICAgaXNCcmFja2V0LFxuICAgIGlzR2xvYixcbiAgICBpc0V4dGdsb2IsXG4gICAgaXNHbG9ic3RhcixcbiAgICBuZWdhdGVkLFxuICAgIG5lZ2F0ZWRFeHRnbG9iXG4gIH07XG5cbiAgaWYgKG9wdHMudG9rZW5zID09PSB0cnVlKSB7XG4gICAgc3RhdGUubWF4RGVwdGggPSAwO1xuICAgIGlmICghaXNQYXRoU2VwYXJhdG9yKGNvZGUpKSB7XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgfVxuICAgIHN0YXRlLnRva2VucyA9IHRva2VucztcbiAgfVxuXG4gIGlmIChvcHRzLnBhcnRzID09PSB0cnVlIHx8IG9wdHMudG9rZW5zID09PSB0cnVlKSB7XG4gICAgbGV0IHByZXZJbmRleDtcblxuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHNsYXNoZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgY29uc3QgbiA9IHByZXZJbmRleCA/IHByZXZJbmRleCArIDEgOiBzdGFydDtcbiAgICAgIGNvbnN0IGkgPSBzbGFzaGVzW2lkeF07XG4gICAgICBjb25zdCB2YWx1ZSA9IGlucHV0LnNsaWNlKG4sIGkpO1xuICAgICAgaWYgKG9wdHMudG9rZW5zKSB7XG4gICAgICAgIGlmIChpZHggPT09IDAgJiYgc3RhcnQgIT09IDApIHtcbiAgICAgICAgICB0b2tlbnNbaWR4XS5pc1ByZWZpeCA9IHRydWU7XG4gICAgICAgICAgdG9rZW5zW2lkeF0udmFsdWUgPSBwcmVmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9rZW5zW2lkeF0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBkZXB0aCh0b2tlbnNbaWR4XSk7XG4gICAgICAgIHN0YXRlLm1heERlcHRoICs9IHRva2Vuc1tpZHhdLmRlcHRoO1xuICAgICAgfVxuICAgICAgaWYgKGlkeCAhPT0gMCB8fCB2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgcGFydHMucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBwcmV2SW5kZXggPSBpO1xuICAgIH1cblxuICAgIGlmIChwcmV2SW5kZXggJiYgcHJldkluZGV4ICsgMSA8IGlucHV0Lmxlbmd0aCkge1xuICAgICAgY29uc3QgdmFsdWUgPSBpbnB1dC5zbGljZShwcmV2SW5kZXggKyAxKTtcbiAgICAgIHBhcnRzLnB1c2godmFsdWUpO1xuXG4gICAgICBpZiAob3B0cy50b2tlbnMpIHtcbiAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBkZXB0aCh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgc3RhdGUubWF4RGVwdGggKz0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS5kZXB0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0ZS5zbGFzaGVzID0gc2xhc2hlcztcbiAgICBzdGF0ZS5wYXJ0cyA9IHBhcnRzO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzY2FuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uc3RhbnRzXG4gKi9cblxuY29uc3Qge1xuICBNQVhfTEVOR1RILFxuICBQT1NJWF9SRUdFWF9TT1VSQ0UsXG4gIFJFR0VYX05PTl9TUEVDSUFMX0NIQVJTLFxuICBSRUdFWF9TUEVDSUFMX0NIQVJTX0JBQ0tSRUYsXG4gIFJFUExBQ0VNRU5UU1xufSA9IGNvbnN0YW50cztcblxuLyoqXG4gKiBIZWxwZXJzXG4gKi9cblxuY29uc3QgZXhwYW5kUmFuZ2UgPSAoYXJncywgb3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIG9wdGlvbnMuZXhwYW5kUmFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5leHBhbmRSYW5nZSguLi5hcmdzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFyZ3Muc29ydCgpO1xuICBjb25zdCB2YWx1ZSA9IGBbJHthcmdzLmpvaW4oJy0nKX1dYDtcblxuICB0cnkge1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXcgKi9cbiAgICBuZXcgUmVnRXhwKHZhbHVlKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXR1cm4gYXJncy5tYXAodiA9PiB1dGlscy5lc2NhcGVSZWdleCh2KSkuam9pbignLi4nKTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBtZXNzYWdlIGZvciBhIHN5bnRheCBlcnJvclxuICovXG5cbmNvbnN0IHN5bnRheEVycm9yID0gKHR5cGUsIGNoYXIpID0+IHtcbiAgcmV0dXJuIGBNaXNzaW5nICR7dHlwZX06IFwiJHtjaGFyfVwiIC0gdXNlIFwiXFxcXFxcXFwke2NoYXJ9XCIgdG8gbWF0Y2ggbGl0ZXJhbCBjaGFyYWN0ZXJzYDtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGlucHV0IHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5jb25zdCBwYXJzZSA9IChpbnB1dCwgb3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG4gIH1cblxuICBpbnB1dCA9IFJFUExBQ0VNRU5UU1tpbnB1dF0gfHwgaW5wdXQ7XG5cbiAgY29uc3Qgb3B0cyA9IHsgLi4ub3B0aW9ucyB9O1xuICBjb25zdCBtYXggPSB0eXBlb2Ygb3B0cy5tYXhMZW5ndGggPT09ICdudW1iZXInID8gTWF0aC5taW4oTUFYX0xFTkdUSCwgb3B0cy5tYXhMZW5ndGgpIDogTUFYX0xFTkdUSDtcblxuICBsZXQgbGVuID0gaW5wdXQubGVuZ3RoO1xuICBpZiAobGVuID4gbWF4KSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBJbnB1dCBsZW5ndGg6ICR7bGVufSwgZXhjZWVkcyBtYXhpbXVtIGFsbG93ZWQgbGVuZ3RoOiAke21heH1gKTtcbiAgfVxuXG4gIGNvbnN0IGJvcyA9IHsgdHlwZTogJ2JvcycsIHZhbHVlOiAnJywgb3V0cHV0OiBvcHRzLnByZXBlbmQgfHwgJycgfTtcbiAgY29uc3QgdG9rZW5zID0gW2Jvc107XG5cbiAgY29uc3QgY2FwdHVyZSA9IG9wdHMuY2FwdHVyZSA/ICcnIDogJz86JztcbiAgY29uc3Qgd2luMzIgPSB1dGlscy5pc1dpbmRvd3Mob3B0aW9ucyk7XG5cbiAgLy8gY3JlYXRlIGNvbnN0YW50cyBiYXNlZCBvbiBwbGF0Zm9ybSwgZm9yIHdpbmRvd3Mgb3IgcG9zaXhcbiAgY29uc3QgUExBVEZPUk1fQ0hBUlMgPSBjb25zdGFudHMuZ2xvYkNoYXJzKHdpbjMyKTtcbiAgY29uc3QgRVhUR0xPQl9DSEFSUyA9IGNvbnN0YW50cy5leHRnbG9iQ2hhcnMoUExBVEZPUk1fQ0hBUlMpO1xuXG4gIGNvbnN0IHtcbiAgICBET1RfTElURVJBTCxcbiAgICBQTFVTX0xJVEVSQUwsXG4gICAgU0xBU0hfTElURVJBTCxcbiAgICBPTkVfQ0hBUixcbiAgICBET1RTX1NMQVNILFxuICAgIE5PX0RPVCxcbiAgICBOT19ET1RfU0xBU0gsXG4gICAgTk9fRE9UU19TTEFTSCxcbiAgICBRTUFSSyxcbiAgICBRTUFSS19OT19ET1QsXG4gICAgU1RBUixcbiAgICBTVEFSVF9BTkNIT1JcbiAgfSA9IFBMQVRGT1JNX0NIQVJTO1xuXG4gIGNvbnN0IGdsb2JzdGFyID0gb3B0cyA9PiB7XG4gICAgcmV0dXJuIGAoJHtjYXB0dXJlfSg/Oig/ISR7U1RBUlRfQU5DSE9SfSR7b3B0cy5kb3QgPyBET1RTX1NMQVNIIDogRE9UX0xJVEVSQUx9KS4pKj8pYDtcbiAgfTtcblxuICBjb25zdCBub2RvdCA9IG9wdHMuZG90ID8gJycgOiBOT19ET1Q7XG4gIGNvbnN0IHFtYXJrTm9Eb3QgPSBvcHRzLmRvdCA/IFFNQVJLIDogUU1BUktfTk9fRE9UO1xuICBsZXQgc3RhciA9IG9wdHMuYmFzaCA9PT0gdHJ1ZSA/IGdsb2JzdGFyKG9wdHMpIDogU1RBUjtcblxuICBpZiAob3B0cy5jYXB0dXJlKSB7XG4gICAgc3RhciA9IGAoJHtzdGFyfSlgO1xuICB9XG5cbiAgLy8gbWluaW1hdGNoIG9wdGlvbnMgc3VwcG9ydFxuICBpZiAodHlwZW9mIG9wdHMubm9leHQgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMubm9leHRnbG9iID0gb3B0cy5ub2V4dDtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGlucHV0LFxuICAgIGluZGV4OiAtMSxcbiAgICBzdGFydDogMCxcbiAgICBkb3Q6IG9wdHMuZG90ID09PSB0cnVlLFxuICAgIGNvbnN1bWVkOiAnJyxcbiAgICBvdXRwdXQ6ICcnLFxuICAgIHByZWZpeDogJycsXG4gICAgYmFja3RyYWNrOiBmYWxzZSxcbiAgICBuZWdhdGVkOiBmYWxzZSxcbiAgICBicmFja2V0czogMCxcbiAgICBicmFjZXM6IDAsXG4gICAgcGFyZW5zOiAwLFxuICAgIHF1b3RlczogMCxcbiAgICBnbG9ic3RhcjogZmFsc2UsXG4gICAgdG9rZW5zXG4gIH07XG5cbiAgaW5wdXQgPSB1dGlscy5yZW1vdmVQcmVmaXgoaW5wdXQsIHN0YXRlKTtcbiAgbGVuID0gaW5wdXQubGVuZ3RoO1xuXG4gIGNvbnN0IGV4dGdsb2JzID0gW107XG4gIGNvbnN0IGJyYWNlcyA9IFtdO1xuICBjb25zdCBzdGFjayA9IFtdO1xuICBsZXQgcHJldiA9IGJvcztcbiAgbGV0IHZhbHVlO1xuXG4gIC8qKlxuICAgKiBUb2tlbml6aW5nIGhlbHBlcnNcbiAgICovXG5cbiAgY29uc3QgZW9zID0gKCkgPT4gc3RhdGUuaW5kZXggPT09IGxlbiAtIDE7XG4gIGNvbnN0IHBlZWsgPSBzdGF0ZS5wZWVrID0gKG4gPSAxKSA9PiBpbnB1dFtzdGF0ZS5pbmRleCArIG5dO1xuICBjb25zdCBhZHZhbmNlID0gc3RhdGUuYWR2YW5jZSA9ICgpID0+IGlucHV0Wysrc3RhdGUuaW5kZXhdIHx8ICcnO1xuICBjb25zdCByZW1haW5pbmcgPSAoKSA9PiBpbnB1dC5zbGljZShzdGF0ZS5pbmRleCArIDEpO1xuICBjb25zdCBjb25zdW1lID0gKHZhbHVlID0gJycsIG51bSA9IDApID0+IHtcbiAgICBzdGF0ZS5jb25zdW1lZCArPSB2YWx1ZTtcbiAgICBzdGF0ZS5pbmRleCArPSBudW07XG4gIH07XG5cbiAgY29uc3QgYXBwZW5kID0gdG9rZW4gPT4ge1xuICAgIHN0YXRlLm91dHB1dCArPSB0b2tlbi5vdXRwdXQgIT0gbnVsbCA/IHRva2VuLm91dHB1dCA6IHRva2VuLnZhbHVlO1xuICAgIGNvbnN1bWUodG9rZW4udmFsdWUpO1xuICB9O1xuXG4gIGNvbnN0IG5lZ2F0ZSA9ICgpID0+IHtcbiAgICBsZXQgY291bnQgPSAxO1xuXG4gICAgd2hpbGUgKHBlZWsoKSA9PT0gJyEnICYmIChwZWVrKDIpICE9PSAnKCcgfHwgcGVlaygzKSA9PT0gJz8nKSkge1xuICAgICAgYWR2YW5jZSgpO1xuICAgICAgc3RhdGUuc3RhcnQrKztcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ICUgMiA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRlLm5lZ2F0ZWQgPSB0cnVlO1xuICAgIHN0YXRlLnN0YXJ0Kys7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgaW5jcmVtZW50ID0gdHlwZSA9PiB7XG4gICAgc3RhdGVbdHlwZV0rKztcbiAgICBzdGFjay5wdXNoKHR5cGUpO1xuICB9O1xuXG4gIGNvbnN0IGRlY3JlbWVudCA9IHR5cGUgPT4ge1xuICAgIHN0YXRlW3R5cGVdLS07XG4gICAgc3RhY2sucG9wKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFB1c2ggdG9rZW5zIG9udG8gdGhlIHRva2VucyBhcnJheS4gVGhpcyBoZWxwZXIgc3BlZWRzIHVwXG4gICAqIHRva2VuaXppbmcgYnkgMSkgaGVscGluZyB1cyBhdm9pZCBiYWNrdHJhY2tpbmcgYXMgbXVjaCBhcyBwb3NzaWJsZSxcbiAgICogYW5kIDIpIGhlbHBpbmcgdXMgYXZvaWQgY3JlYXRpbmcgZXh0cmEgdG9rZW5zIHdoZW4gY29uc2VjdXRpdmVcbiAgICogY2hhcmFjdGVycyBhcmUgcGxhaW4gdGV4dC4gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgc2ltcGxpZmllc1xuICAgKiBsb29rYmVoaW5kcy5cbiAgICovXG5cbiAgY29uc3QgcHVzaCA9IHRvayA9PiB7XG4gICAgaWYgKHByZXYudHlwZSA9PT0gJ2dsb2JzdGFyJykge1xuICAgICAgY29uc3QgaXNCcmFjZSA9IHN0YXRlLmJyYWNlcyA+IDAgJiYgKHRvay50eXBlID09PSAnY29tbWEnIHx8IHRvay50eXBlID09PSAnYnJhY2UnKTtcbiAgICAgIGNvbnN0IGlzRXh0Z2xvYiA9IHRvay5leHRnbG9iID09PSB0cnVlIHx8IChleHRnbG9icy5sZW5ndGggJiYgKHRvay50eXBlID09PSAncGlwZScgfHwgdG9rLnR5cGUgPT09ICdwYXJlbicpKTtcblxuICAgICAgaWYgKHRvay50eXBlICE9PSAnc2xhc2gnICYmIHRvay50eXBlICE9PSAncGFyZW4nICYmICFpc0JyYWNlICYmICFpc0V4dGdsb2IpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIC1wcmV2Lm91dHB1dC5sZW5ndGgpO1xuICAgICAgICBwcmV2LnR5cGUgPSAnc3Rhcic7XG4gICAgICAgIHByZXYudmFsdWUgPSAnKic7XG4gICAgICAgIHByZXYub3V0cHV0ID0gc3RhcjtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHByZXYub3V0cHV0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChleHRnbG9icy5sZW5ndGggJiYgdG9rLnR5cGUgIT09ICdwYXJlbicpIHtcbiAgICAgIGV4dGdsb2JzW2V4dGdsb2JzLmxlbmd0aCAtIDFdLmlubmVyICs9IHRvay52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAodG9rLnZhbHVlIHx8IHRvay5vdXRwdXQpIGFwcGVuZCh0b2spO1xuICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ3RleHQnICYmIHRvay50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIHByZXYudmFsdWUgKz0gdG9rLnZhbHVlO1xuICAgICAgcHJldi5vdXRwdXQgPSAocHJldi5vdXRwdXQgfHwgJycpICsgdG9rLnZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRvay5wcmV2ID0gcHJldjtcbiAgICB0b2tlbnMucHVzaCh0b2spO1xuICAgIHByZXYgPSB0b2s7XG4gIH07XG5cbiAgY29uc3QgZXh0Z2xvYk9wZW4gPSAodHlwZSwgdmFsdWUpID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IHsgLi4uRVhUR0xPQl9DSEFSU1t2YWx1ZV0sIGNvbmRpdGlvbnM6IDEsIGlubmVyOiAnJyB9O1xuXG4gICAgdG9rZW4ucHJldiA9IHByZXY7XG4gICAgdG9rZW4ucGFyZW5zID0gc3RhdGUucGFyZW5zO1xuICAgIHRva2VuLm91dHB1dCA9IHN0YXRlLm91dHB1dDtcbiAgICBjb25zdCBvdXRwdXQgPSAob3B0cy5jYXB0dXJlID8gJygnIDogJycpICsgdG9rZW4ub3BlbjtcblxuICAgIGluY3JlbWVudCgncGFyZW5zJyk7XG4gICAgcHVzaCh7IHR5cGUsIHZhbHVlLCBvdXRwdXQ6IHN0YXRlLm91dHB1dCA/ICcnIDogT05FX0NIQVIgfSk7XG4gICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIGV4dGdsb2I6IHRydWUsIHZhbHVlOiBhZHZhbmNlKCksIG91dHB1dCB9KTtcbiAgICBleHRnbG9icy5wdXNoKHRva2VuKTtcbiAgfTtcblxuICBjb25zdCBleHRnbG9iQ2xvc2UgPSB0b2tlbiA9PiB7XG4gICAgbGV0IG91dHB1dCA9IHRva2VuLmNsb3NlICsgKG9wdHMuY2FwdHVyZSA/ICcpJyA6ICcnKTtcbiAgICBsZXQgcmVzdDtcblxuICAgIGlmICh0b2tlbi50eXBlID09PSAnbmVnYXRlJykge1xuICAgICAgbGV0IGV4dGdsb2JTdGFyID0gc3RhcjtcblxuICAgICAgaWYgKHRva2VuLmlubmVyICYmIHRva2VuLmlubmVyLmxlbmd0aCA+IDEgJiYgdG9rZW4uaW5uZXIuaW5jbHVkZXMoJy8nKSkge1xuICAgICAgICBleHRnbG9iU3RhciA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXh0Z2xvYlN0YXIgIT09IHN0YXIgfHwgZW9zKCkgfHwgL15cXCkrJC8udGVzdChyZW1haW5pbmcoKSkpIHtcbiAgICAgICAgb3V0cHV0ID0gdG9rZW4uY2xvc2UgPSBgKSQpKSR7ZXh0Z2xvYlN0YXJ9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRva2VuLmlubmVyLmluY2x1ZGVzKCcqJykgJiYgKHJlc3QgPSByZW1haW5pbmcoKSkgJiYgL15cXC5bXlxcXFwvLl0rJC8udGVzdChyZXN0KSkge1xuICAgICAgICAvLyBBbnkgbm9uLW1hZ2ljYWwgc3RyaW5nIChgLnRzYCkgb3IgZXZlbiBuZXN0ZWQgZXhwcmVzc2lvbiAoYC57dHMsdHN4fWApIGNhbiBmb2xsb3cgYWZ0ZXIgdGhlIGNsb3NpbmcgcGFyZW50aGVzaXMuXG4gICAgICAgIC8vIEluIHRoaXMgY2FzZSwgd2UgbmVlZCB0byBwYXJzZSB0aGUgc3RyaW5nIGFuZCB1c2UgaXQgaW4gdGhlIG91dHB1dCBvZiB0aGUgb3JpZ2luYWwgcGF0dGVybi5cbiAgICAgICAgLy8gU3VpdGFibGUgcGF0dGVybnM6IGAvISgqLmQpLnRzYCwgYC8hKCouZCkue3RzLHRzeH1gLCBgKiovISgqLWRiZykuQChqcylgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBEaXNhYmxpbmcgdGhlIGBmYXN0cGF0aHNgIG9wdGlvbiBkdWUgdG8gYSBwcm9ibGVtIHdpdGggcGFyc2luZyBzdHJpbmdzIGFzIGAudHNgIGluIHRoZSBwYXR0ZXJuIGxpa2UgYCoqLyEoKi5kKS50c2AuXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBwYXJzZShyZXN0LCB7IC4uLm9wdGlvbnMsIGZhc3RwYXRoczogZmFsc2UgfSkub3V0cHV0O1xuXG4gICAgICAgIG91dHB1dCA9IHRva2VuLmNsb3NlID0gYCkke2V4cHJlc3Npb259KSR7ZXh0Z2xvYlN0YXJ9KWA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2tlbi5wcmV2LnR5cGUgPT09ICdib3MnKSB7XG4gICAgICAgIHN0YXRlLm5lZ2F0ZWRFeHRnbG9iID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdXNoKHsgdHlwZTogJ3BhcmVuJywgZXh0Z2xvYjogdHJ1ZSwgdmFsdWUsIG91dHB1dCB9KTtcbiAgICBkZWNyZW1lbnQoJ3BhcmVucycpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGYXN0IHBhdGhzXG4gICAqL1xuXG4gIGlmIChvcHRzLmZhc3RwYXRocyAhPT0gZmFsc2UgJiYgIS8oXlsqIV18Wy8oKVtcXF17fVwiXSkvLnRlc3QoaW5wdXQpKSB7XG4gICAgbGV0IGJhY2tzbGFzaGVzID0gZmFsc2U7XG5cbiAgICBsZXQgb3V0cHV0ID0gaW5wdXQucmVwbGFjZShSRUdFWF9TUEVDSUFMX0NIQVJTX0JBQ0tSRUYsIChtLCBlc2MsIGNoYXJzLCBmaXJzdCwgcmVzdCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChmaXJzdCA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgICB9XG5cbiAgICAgIGlmIChmaXJzdCA9PT0gJz8nKSB7XG4gICAgICAgIGlmIChlc2MpIHtcbiAgICAgICAgICByZXR1cm4gZXNjICsgZmlyc3QgKyAocmVzdCA/IFFNQVJLLnJlcGVhdChyZXN0Lmxlbmd0aCkgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHFtYXJrTm9Eb3QgKyAocmVzdCA/IFFNQVJLLnJlcGVhdChyZXN0Lmxlbmd0aCkgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFFNQVJLLnJlcGVhdChjaGFycy5sZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlyc3QgPT09ICcuJykge1xuICAgICAgICByZXR1cm4gRE9UX0xJVEVSQUwucmVwZWF0KGNoYXJzLmxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaXJzdCA9PT0gJyonKSB7XG4gICAgICAgIGlmIChlc2MpIHtcbiAgICAgICAgICByZXR1cm4gZXNjICsgZmlyc3QgKyAocmVzdCA/IHN0YXIgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXNjID8gbSA6IGBcXFxcJHttfWA7XG4gICAgfSk7XG5cbiAgICBpZiAoYmFja3NsYXNoZXMgPT09IHRydWUpIHtcbiAgICAgIGlmIChvcHRzLnVuZXNjYXBlID09PSB0cnVlKSB7XG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKC9cXFxcKy9nLCBtID0+IHtcbiAgICAgICAgICByZXR1cm4gbS5sZW5ndGggJSAyID09PSAwID8gJ1xcXFxcXFxcJyA6IChtID8gJ1xcXFwnIDogJycpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3V0cHV0ID09PSBpbnB1dCAmJiBvcHRzLmNvbnRhaW5zID09PSB0cnVlKSB7XG4gICAgICBzdGF0ZS5vdXRwdXQgPSBpbnB1dDtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy53cmFwT3V0cHV0KG91dHB1dCwgc3RhdGUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2tlbml6ZSBpbnB1dCB1bnRpbCB3ZSByZWFjaCBlbmQtb2Ytc3RyaW5nXG4gICAqL1xuXG4gIHdoaWxlICghZW9zKCkpIHtcbiAgICB2YWx1ZSA9IGFkdmFuY2UoKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gJ1xcdTAwMDAnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFc2NhcGVkIGNoYXJhY3RlcnNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ1xcXFwnKSB7XG4gICAgICBjb25zdCBuZXh0ID0gcGVlaygpO1xuXG4gICAgICBpZiAobmV4dCA9PT0gJy8nICYmIG9wdHMuYmFzaCAhPT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHQgPT09ICcuJyB8fCBuZXh0ID09PSAnOycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghbmV4dCkge1xuICAgICAgICB2YWx1ZSArPSAnXFxcXCc7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gY29sbGFwc2Ugc2xhc2hlcyB0byByZWR1Y2UgcG90ZW50aWFsIGZvciBleHBsb2l0c1xuICAgICAgY29uc3QgbWF0Y2ggPSAvXlxcXFwrLy5leGVjKHJlbWFpbmluZygpKTtcbiAgICAgIGxldCBzbGFzaGVzID0gMDtcblxuICAgICAgaWYgKG1hdGNoICYmIG1hdGNoWzBdLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgc2xhc2hlcyA9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgc3RhdGUuaW5kZXggKz0gc2xhc2hlcztcbiAgICAgICAgaWYgKHNsYXNoZXMgJSAyICE9PSAwKSB7XG4gICAgICAgICAgdmFsdWUgKz0gJ1xcXFwnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLnVuZXNjYXBlID09PSB0cnVlKSB7XG4gICAgICAgIHZhbHVlID0gYWR2YW5jZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgKz0gYWR2YW5jZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUuYnJhY2tldHMgPT09IDApIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHdlJ3JlIGluc2lkZSBhIHJlZ2V4IGNoYXJhY3RlciBjbGFzcywgY29udGludWVcbiAgICAgKiB1bnRpbCB3ZSByZWFjaCB0aGUgY2xvc2luZyBicmFja2V0LlxuICAgICAqL1xuXG4gICAgaWYgKHN0YXRlLmJyYWNrZXRzID4gMCAmJiAodmFsdWUgIT09ICddJyB8fCBwcmV2LnZhbHVlID09PSAnWycgfHwgcHJldi52YWx1ZSA9PT0gJ1teJykpIHtcbiAgICAgIGlmIChvcHRzLnBvc2l4ICE9PSBmYWxzZSAmJiB2YWx1ZSA9PT0gJzonKSB7XG4gICAgICAgIGNvbnN0IGlubmVyID0gcHJldi52YWx1ZS5zbGljZSgxKTtcbiAgICAgICAgaWYgKGlubmVyLmluY2x1ZGVzKCdbJykpIHtcbiAgICAgICAgICBwcmV2LnBvc2l4ID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChpbm5lci5pbmNsdWRlcygnOicpKSB7XG4gICAgICAgICAgICBjb25zdCBpZHggPSBwcmV2LnZhbHVlLmxhc3RJbmRleE9mKCdbJyk7XG4gICAgICAgICAgICBjb25zdCBwcmUgPSBwcmV2LnZhbHVlLnNsaWNlKDAsIGlkeCk7XG4gICAgICAgICAgICBjb25zdCByZXN0ID0gcHJldi52YWx1ZS5zbGljZShpZHggKyAyKTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l4ID0gUE9TSVhfUkVHRVhfU09VUkNFW3Jlc3RdO1xuICAgICAgICAgICAgaWYgKHBvc2l4KSB7XG4gICAgICAgICAgICAgIHByZXYudmFsdWUgPSBwcmUgKyBwb3NpeDtcbiAgICAgICAgICAgICAgc3RhdGUuYmFja3RyYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYWR2YW5jZSgpO1xuXG4gICAgICAgICAgICAgIGlmICghYm9zLm91dHB1dCAmJiB0b2tlbnMuaW5kZXhPZihwcmV2KSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGJvcy5vdXRwdXQgPSBPTkVfQ0hBUjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCh2YWx1ZSA9PT0gJ1snICYmIHBlZWsoKSAhPT0gJzonKSB8fCAodmFsdWUgPT09ICctJyAmJiBwZWVrKCkgPT09ICddJykpIHtcbiAgICAgICAgdmFsdWUgPSBgXFxcXCR7dmFsdWV9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09PSAnXScgJiYgKHByZXYudmFsdWUgPT09ICdbJyB8fCBwcmV2LnZhbHVlID09PSAnW14nKSkge1xuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5wb3NpeCA9PT0gdHJ1ZSAmJiB2YWx1ZSA9PT0gJyEnICYmIHByZXYudmFsdWUgPT09ICdbJykge1xuICAgICAgICB2YWx1ZSA9ICdeJztcbiAgICAgIH1cblxuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgIGFwcGVuZCh7IHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgd2UncmUgaW5zaWRlIGEgcXVvdGVkIHN0cmluZywgY29udGludWVcbiAgICAgKiB1bnRpbCB3ZSByZWFjaCB0aGUgY2xvc2luZyBkb3VibGUgcXVvdGUuXG4gICAgICovXG5cbiAgICBpZiAoc3RhdGUucXVvdGVzID09PSAxICYmIHZhbHVlICE9PSAnXCInKSB7XG4gICAgICB2YWx1ZSA9IHV0aWxzLmVzY2FwZVJlZ2V4KHZhbHVlKTtcbiAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICBhcHBlbmQoeyB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvdWJsZSBxdW90ZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ1wiJykge1xuICAgICAgc3RhdGUucXVvdGVzID0gc3RhdGUucXVvdGVzID09PSAxID8gMCA6IDE7XG4gICAgICBpZiAob3B0cy5rZWVwUXVvdGVzID09PSB0cnVlKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyZW50aGVzZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJygnKSB7XG4gICAgICBpbmNyZW1lbnQoJ3BhcmVucycpO1xuICAgICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSAnKScpIHtcbiAgICAgIGlmIChzdGF0ZS5wYXJlbnMgPT09IDAgJiYgb3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ29wZW5pbmcnLCAnKCcpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXh0Z2xvYiA9IGV4dGdsb2JzW2V4dGdsb2JzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGV4dGdsb2IgJiYgc3RhdGUucGFyZW5zID09PSBleHRnbG9iLnBhcmVucyArIDEpIHtcbiAgICAgICAgZXh0Z2xvYkNsb3NlKGV4dGdsb2JzLnBvcCgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAncGFyZW4nLCB2YWx1ZSwgb3V0cHV0OiBzdGF0ZS5wYXJlbnMgPyAnKScgOiAnXFxcXCknIH0pO1xuICAgICAgZGVjcmVtZW50KCdwYXJlbnMnKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNxdWFyZSBicmFja2V0c1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnWycpIHtcbiAgICAgIGlmIChvcHRzLm5vYnJhY2tldCA9PT0gdHJ1ZSB8fCAhcmVtYWluaW5nKCkuaW5jbHVkZXMoJ10nKSkge1xuICAgICAgICBpZiAob3B0cy5ub2JyYWNrZXQgIT09IHRydWUgJiYgb3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignY2xvc2luZycsICddJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSBgXFxcXCR7dmFsdWV9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluY3JlbWVudCgnYnJhY2tldHMnKTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdicmFja2V0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICddJykge1xuICAgICAgaWYgKG9wdHMubm9icmFja2V0ID09PSB0cnVlIHx8IChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnICYmIHByZXYudmFsdWUubGVuZ3RoID09PSAxKSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiBgXFxcXCR7dmFsdWV9YCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZS5icmFja2V0cyA9PT0gMCkge1xuICAgICAgICBpZiAob3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignb3BlbmluZycsICdbJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dDogYFxcXFwke3ZhbHVlfWAgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBkZWNyZW1lbnQoJ2JyYWNrZXRzJyk7XG5cbiAgICAgIGNvbnN0IHByZXZWYWx1ZSA9IHByZXYudmFsdWUuc2xpY2UoMSk7XG4gICAgICBpZiAocHJldi5wb3NpeCAhPT0gdHJ1ZSAmJiBwcmV2VmFsdWVbMF0gPT09ICdeJyAmJiAhcHJldlZhbHVlLmluY2x1ZGVzKCcvJykpIHtcbiAgICAgICAgdmFsdWUgPSBgLyR7dmFsdWV9YDtcbiAgICAgIH1cblxuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgIGFwcGVuZCh7IHZhbHVlIH0pO1xuXG4gICAgICAvLyB3aGVuIGxpdGVyYWwgYnJhY2tldHMgYXJlIGV4cGxpY2l0bHkgZGlzYWJsZWRcbiAgICAgIC8vIGFzc3VtZSB3ZSBzaG91bGQgbWF0Y2ggd2l0aCBhIHJlZ2V4IGNoYXJhY3RlciBjbGFzc1xuICAgICAgaWYgKG9wdHMubGl0ZXJhbEJyYWNrZXRzID09PSBmYWxzZSB8fCB1dGlscy5oYXNSZWdleENoYXJzKHByZXZWYWx1ZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVzY2FwZWQgPSB1dGlscy5lc2NhcGVSZWdleChwcmV2LnZhbHVlKTtcbiAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtcHJldi52YWx1ZS5sZW5ndGgpO1xuXG4gICAgICAvLyB3aGVuIGxpdGVyYWwgYnJhY2tldHMgYXJlIGV4cGxpY2l0bHkgZW5hYmxlZFxuICAgICAgLy8gYXNzdW1lIHdlIHNob3VsZCBlc2NhcGUgdGhlIGJyYWNrZXRzIHRvIG1hdGNoIGxpdGVyYWwgY2hhcmFjdGVyc1xuICAgICAgaWYgKG9wdHMubGl0ZXJhbEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBlc2NhcGVkO1xuICAgICAgICBwcmV2LnZhbHVlID0gZXNjYXBlZDtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHdoZW4gdGhlIHVzZXIgc3BlY2lmaWVzIG5vdGhpbmcsIHRyeSB0byBtYXRjaCBib3RoXG4gICAgICBwcmV2LnZhbHVlID0gYCgke2NhcHR1cmV9JHtlc2NhcGVkfXwke3ByZXYudmFsdWV9KWA7XG4gICAgICBzdGF0ZS5vdXRwdXQgKz0gcHJldi52YWx1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJyYWNlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAneycgJiYgb3B0cy5ub2JyYWNlICE9PSB0cnVlKSB7XG4gICAgICBpbmNyZW1lbnQoJ2JyYWNlcycpO1xuXG4gICAgICBjb25zdCBvcGVuID0ge1xuICAgICAgICB0eXBlOiAnYnJhY2UnLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgb3V0cHV0OiAnKCcsXG4gICAgICAgIG91dHB1dEluZGV4OiBzdGF0ZS5vdXRwdXQubGVuZ3RoLFxuICAgICAgICB0b2tlbnNJbmRleDogc3RhdGUudG9rZW5zLmxlbmd0aFxuICAgICAgfTtcblxuICAgICAgYnJhY2VzLnB1c2gob3Blbik7XG4gICAgICBwdXNoKG9wZW4pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSAnfScpIHtcbiAgICAgIGNvbnN0IGJyYWNlID0gYnJhY2VzW2JyYWNlcy5sZW5ndGggLSAxXTtcblxuICAgICAgaWYgKG9wdHMubm9icmFjZSA9PT0gdHJ1ZSB8fCAhYnJhY2UpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dDogdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3V0cHV0ID0gJyknO1xuXG4gICAgICBpZiAoYnJhY2UuZG90cyA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBhcnIgPSB0b2tlbnMuc2xpY2UoKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gYXJyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdG9rZW5zLnBvcCgpO1xuICAgICAgICAgIGlmIChhcnJbaV0udHlwZSA9PT0gJ2JyYWNlJykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcnJbaV0udHlwZSAhPT0gJ2RvdHMnKSB7XG4gICAgICAgICAgICByYW5nZS51bnNoaWZ0KGFycltpXS52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gZXhwYW5kUmFuZ2UocmFuZ2UsIG9wdHMpO1xuICAgICAgICBzdGF0ZS5iYWNrdHJhY2sgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYnJhY2UuY29tbWEgIT09IHRydWUgJiYgYnJhY2UuZG90cyAhPT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBvdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgYnJhY2Uub3V0cHV0SW5kZXgpO1xuICAgICAgICBjb25zdCB0b2tzID0gc3RhdGUudG9rZW5zLnNsaWNlKGJyYWNlLnRva2Vuc0luZGV4KTtcbiAgICAgICAgYnJhY2UudmFsdWUgPSBicmFjZS5vdXRwdXQgPSAnXFxcXHsnO1xuICAgICAgICB2YWx1ZSA9IG91dHB1dCA9ICdcXFxcfSc7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9IG91dDtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHRva3MpIHtcbiAgICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gKHQub3V0cHV0IHx8IHQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnYnJhY2UnLCB2YWx1ZSwgb3V0cHV0IH0pO1xuICAgICAgZGVjcmVtZW50KCdicmFjZXMnKTtcbiAgICAgIGJyYWNlcy5wb3AoKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpcGVzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICd8Jykge1xuICAgICAgaWYgKGV4dGdsb2JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXh0Z2xvYnNbZXh0Z2xvYnMubGVuZ3RoIC0gMV0uY29uZGl0aW9ucysrO1xuICAgICAgfVxuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21tYXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJywnKSB7XG4gICAgICBsZXQgb3V0cHV0ID0gdmFsdWU7XG5cbiAgICAgIGNvbnN0IGJyYWNlID0gYnJhY2VzW2JyYWNlcy5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChicmFjZSAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXSA9PT0gJ2JyYWNlcycpIHtcbiAgICAgICAgYnJhY2UuY29tbWEgPSB0cnVlO1xuICAgICAgICBvdXRwdXQgPSAnfCc7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnY29tbWEnLCB2YWx1ZSwgb3V0cHV0IH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2xhc2hlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnLycpIHtcbiAgICAgIC8vIGlmIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGdsb2IgaXMgXCIuL1wiLCBhZHZhbmNlIHRoZSBzdGFydFxuICAgICAgLy8gdG8gdGhlIGN1cnJlbnQgaW5kZXgsIGFuZCBkb24ndCBhZGQgdGhlIFwiLi9cIiBjaGFyYWN0ZXJzXG4gICAgICAvLyB0byB0aGUgc3RhdGUuIFRoaXMgZ3JlYXRseSBzaW1wbGlmaWVzIGxvb2tiZWhpbmRzIHdoZW5cbiAgICAgIC8vIGNoZWNraW5nIGZvciBCT1MgY2hhcmFjdGVycyBsaWtlIFwiIVwiIGFuZCBcIi5cIiAobm90IFwiLi9cIilcbiAgICAgIGlmIChwcmV2LnR5cGUgPT09ICdkb3QnICYmIHN0YXRlLmluZGV4ID09PSBzdGF0ZS5zdGFydCArIDEpIHtcbiAgICAgICAgc3RhdGUuc3RhcnQgPSBzdGF0ZS5pbmRleCArIDE7XG4gICAgICAgIHN0YXRlLmNvbnN1bWVkID0gJyc7XG4gICAgICAgIHN0YXRlLm91dHB1dCA9ICcnO1xuICAgICAgICB0b2tlbnMucG9wKCk7XG4gICAgICAgIHByZXYgPSBib3M7IC8vIHJlc2V0IFwicHJldlwiIHRvIHRoZSBmaXJzdCB0b2tlblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdzbGFzaCcsIHZhbHVlLCBvdXRwdXQ6IFNMQVNIX0xJVEVSQUwgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3RzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICcuJykge1xuICAgICAgaWYgKHN0YXRlLmJyYWNlcyA+IDAgJiYgcHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgICBpZiAocHJldi52YWx1ZSA9PT0gJy4nKSBwcmV2Lm91dHB1dCA9IERPVF9MSVRFUkFMO1xuICAgICAgICBjb25zdCBicmFjZSA9IGJyYWNlc1ticmFjZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHByZXYudHlwZSA9ICdkb3RzJztcbiAgICAgICAgcHJldi5vdXRwdXQgKz0gdmFsdWU7XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIGJyYWNlLmRvdHMgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKChzdGF0ZS5icmFjZXMgKyBzdGF0ZS5wYXJlbnMpID09PSAwICYmIHByZXYudHlwZSAhPT0gJ2JvcycgJiYgcHJldi50eXBlICE9PSAnc2xhc2gnKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlLCBvdXRwdXQ6IERPVF9MSVRFUkFMIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdkb3QnLCB2YWx1ZSwgb3V0cHV0OiBET1RfTElURVJBTCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFF1ZXN0aW9uIG1hcmtzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICc/Jykge1xuICAgICAgY29uc3QgaXNHcm91cCA9IHByZXYgJiYgcHJldi52YWx1ZSA9PT0gJygnO1xuICAgICAgaWYgKCFpc0dyb3VwICYmIG9wdHMubm9leHRnbG9iICE9PSB0cnVlICYmIHBlZWsoKSA9PT0gJygnICYmIHBlZWsoMikgIT09ICc/Jykge1xuICAgICAgICBleHRnbG9iT3BlbigncW1hcmsnLCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldiAmJiBwcmV2LnR5cGUgPT09ICdwYXJlbicpIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHBlZWsoKTtcbiAgICAgICAgbGV0IG91dHB1dCA9IHZhbHVlO1xuXG4gICAgICAgIGlmIChuZXh0ID09PSAnPCcgJiYgIXV0aWxzLnN1cHBvcnRzTG9va2JlaGluZHMoKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5qcyB2MTAgb3IgaGlnaGVyIGlzIHJlcXVpcmVkIGZvciByZWdleCBsb29rYmVoaW5kcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChwcmV2LnZhbHVlID09PSAnKCcgJiYgIS9bIT08Ol0vLnRlc3QobmV4dCkpIHx8IChuZXh0ID09PSAnPCcgJiYgIS88KFshPV18XFx3Kz4pLy50ZXN0KHJlbWFpbmluZygpKSkpIHtcbiAgICAgICAgICBvdXRwdXQgPSBgXFxcXCR7dmFsdWV9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5kb3QgIT09IHRydWUgJiYgKHByZXYudHlwZSA9PT0gJ3NsYXNoJyB8fCBwcmV2LnR5cGUgPT09ICdib3MnKSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3FtYXJrJywgdmFsdWUsIG91dHB1dDogUU1BUktfTk9fRE9UIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdxbWFyaycsIHZhbHVlLCBvdXRwdXQ6IFFNQVJLIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhjbGFtYXRpb25cbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJyEnKSB7XG4gICAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcpIHtcbiAgICAgICAgaWYgKHBlZWsoMikgIT09ICc/JyB8fCAhL1shPTw6XS8udGVzdChwZWVrKDMpKSkge1xuICAgICAgICAgIGV4dGdsb2JPcGVuKCduZWdhdGUnLCB2YWx1ZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMubm9uZWdhdGUgIT09IHRydWUgJiYgc3RhdGUuaW5kZXggPT09IDApIHtcbiAgICAgICAgbmVnYXRlKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsdXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJysnKSB7XG4gICAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcgJiYgcGVlaygyKSAhPT0gJz8nKSB7XG4gICAgICAgIGV4dGdsb2JPcGVuKCdwbHVzJywgdmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKChwcmV2ICYmIHByZXYudmFsdWUgPT09ICcoJykgfHwgb3B0cy5yZWdleCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdwbHVzJywgdmFsdWUsIG91dHB1dDogUExVU19MSVRFUkFMIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKChwcmV2ICYmIChwcmV2LnR5cGUgPT09ICdicmFja2V0JyB8fCBwcmV2LnR5cGUgPT09ICdwYXJlbicgfHwgcHJldi50eXBlID09PSAnYnJhY2UnKSkgfHwgc3RhdGUucGFyZW5zID4gMCkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3BsdXMnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAncGx1cycsIHZhbHVlOiBQTFVTX0xJVEVSQUwgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGFpbiB0ZXh0XG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICdAJykge1xuICAgICAgaWYgKG9wdHMubm9leHRnbG9iICE9PSB0cnVlICYmIHBlZWsoKSA9PT0gJygnICYmIHBlZWsoMikgIT09ICc/Jykge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ2F0JywgZXh0Z2xvYjogdHJ1ZSwgdmFsdWUsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYWluIHRleHRcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSAhPT0gJyonKSB7XG4gICAgICBpZiAodmFsdWUgPT09ICckJyB8fCB2YWx1ZSA9PT0gJ14nKSB7XG4gICAgICAgIHZhbHVlID0gYFxcXFwke3ZhbHVlfWA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hdGNoID0gUkVHRVhfTk9OX1NQRUNJQUxfQ0hBUlMuZXhlYyhyZW1haW5pbmcoKSk7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgdmFsdWUgKz0gbWF0Y2hbMF07XG4gICAgICAgIHN0YXRlLmluZGV4ICs9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFyc1xuICAgICAqL1xuXG4gICAgaWYgKHByZXYgJiYgKHByZXYudHlwZSA9PT0gJ2dsb2JzdGFyJyB8fCBwcmV2LnN0YXIgPT09IHRydWUpKSB7XG4gICAgICBwcmV2LnR5cGUgPSAnc3Rhcic7XG4gICAgICBwcmV2LnN0YXIgPSB0cnVlO1xuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgIHByZXYub3V0cHV0ID0gc3RhcjtcbiAgICAgIHN0YXRlLmJhY2t0cmFjayA9IHRydWU7XG4gICAgICBzdGF0ZS5nbG9ic3RhciA9IHRydWU7XG4gICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxldCByZXN0ID0gcmVtYWluaW5nKCk7XG4gICAgaWYgKG9wdHMubm9leHRnbG9iICE9PSB0cnVlICYmIC9eXFwoW14/XS8udGVzdChyZXN0KSkge1xuICAgICAgZXh0Z2xvYk9wZW4oJ3N0YXInLCB2YWx1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocHJldi50eXBlID09PSAnc3RhcicpIHtcbiAgICAgIGlmIChvcHRzLm5vZ2xvYnN0YXIgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3VtZSh2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwcmlvciA9IHByZXYucHJldjtcbiAgICAgIGNvbnN0IGJlZm9yZSA9IHByaW9yLnByZXY7XG4gICAgICBjb25zdCBpc1N0YXJ0ID0gcHJpb3IudHlwZSA9PT0gJ3NsYXNoJyB8fCBwcmlvci50eXBlID09PSAnYm9zJztcbiAgICAgIGNvbnN0IGFmdGVyU3RhciA9IGJlZm9yZSAmJiAoYmVmb3JlLnR5cGUgPT09ICdzdGFyJyB8fCBiZWZvcmUudHlwZSA9PT0gJ2dsb2JzdGFyJyk7XG5cbiAgICAgIGlmIChvcHRzLmJhc2ggPT09IHRydWUgJiYgKCFpc1N0YXJ0IHx8IChyZXN0WzBdICYmIHJlc3RbMF0gIT09ICcvJykpKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAnc3RhcicsIHZhbHVlLCBvdXRwdXQ6ICcnIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXNCcmFjZSA9IHN0YXRlLmJyYWNlcyA+IDAgJiYgKHByaW9yLnR5cGUgPT09ICdjb21tYScgfHwgcHJpb3IudHlwZSA9PT0gJ2JyYWNlJyk7XG4gICAgICBjb25zdCBpc0V4dGdsb2IgPSBleHRnbG9icy5sZW5ndGggJiYgKHByaW9yLnR5cGUgPT09ICdwaXBlJyB8fCBwcmlvci50eXBlID09PSAncGFyZW4nKTtcbiAgICAgIGlmICghaXNTdGFydCAmJiBwcmlvci50eXBlICE9PSAncGFyZW4nICYmICFpc0JyYWNlICYmICFpc0V4dGdsb2IpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzdGFyJywgdmFsdWUsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBzdHJpcCBjb25zZWN1dGl2ZSBgLyoqL2BcbiAgICAgIHdoaWxlIChyZXN0LnNsaWNlKDAsIDMpID09PSAnLyoqJykge1xuICAgICAgICBjb25zdCBhZnRlciA9IGlucHV0W3N0YXRlLmluZGV4ICsgNF07XG4gICAgICAgIGlmIChhZnRlciAmJiBhZnRlciAhPT0gJy8nKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoMyk7XG4gICAgICAgIGNvbnN1bWUoJy8qKicsIDMpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJpb3IudHlwZSA9PT0gJ2JvcycgJiYgZW9zKCkpIHtcbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgcHJldi5vdXRwdXQgPSBnbG9ic3RhcihvcHRzKTtcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gcHJldi5vdXRwdXQ7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgICAgY29uc3VtZSh2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJpb3IudHlwZSA9PT0gJ3NsYXNoJyAmJiBwcmlvci5wcmV2LnR5cGUgIT09ICdib3MnICYmICFhZnRlclN0YXIgJiYgZW9zKCkpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIC0ocHJpb3Iub3V0cHV0ICsgcHJldi5vdXRwdXQpLmxlbmd0aCk7XG4gICAgICAgIHByaW9yLm91dHB1dCA9IGAoPzoke3ByaW9yLm91dHB1dH1gO1xuXG4gICAgICAgIHByZXYudHlwZSA9ICdnbG9ic3Rhcic7XG4gICAgICAgIHByZXYub3V0cHV0ID0gZ2xvYnN0YXIob3B0cykgKyAob3B0cy5zdHJpY3RTbGFzaGVzID8gJyknIDogJ3wkKScpO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBzdGF0ZS5nbG9ic3RhciA9IHRydWU7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dDtcbiAgICAgICAgY29uc3VtZSh2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJpb3IudHlwZSA9PT0gJ3NsYXNoJyAmJiBwcmlvci5wcmV2LnR5cGUgIT09ICdib3MnICYmIHJlc3RbMF0gPT09ICcvJykge1xuICAgICAgICBjb25zdCBlbmQgPSByZXN0WzFdICE9PSB2b2lkIDAgPyAnfCQnIDogJyc7XG5cbiAgICAgICAgc3RhdGUub3V0cHV0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIC0ocHJpb3Iub3V0cHV0ICsgcHJldi5vdXRwdXQpLmxlbmd0aCk7XG4gICAgICAgIHByaW9yLm91dHB1dCA9IGAoPzoke3ByaW9yLm91dHB1dH1gO1xuXG4gICAgICAgIHByZXYudHlwZSA9ICdnbG9ic3Rhcic7XG4gICAgICAgIHByZXYub3V0cHV0ID0gYCR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfXwke1NMQVNIX0xJVEVSQUx9JHtlbmR9KWA7XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG5cbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHByaW9yLm91dHB1dCArIHByZXYub3V0cHV0O1xuICAgICAgICBzdGF0ZS5nbG9ic3RhciA9IHRydWU7XG5cbiAgICAgICAgY29uc3VtZSh2YWx1ZSArIGFkdmFuY2UoKSk7XG5cbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzbGFzaCcsIHZhbHVlOiAnLycsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJpb3IudHlwZSA9PT0gJ2JvcycgJiYgcmVzdFswXSA9PT0gJy8nKSB7XG4gICAgICAgIHByZXYudHlwZSA9ICdnbG9ic3Rhcic7XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIHByZXYub3V0cHV0ID0gYCg/Ol58JHtTTEFTSF9MSVRFUkFMfXwke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pYDtcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gcHJldi5vdXRwdXQ7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgICAgY29uc3VtZSh2YWx1ZSArIGFkdmFuY2UoKSk7XG4gICAgICAgIHB1c2goeyB0eXBlOiAnc2xhc2gnLCB2YWx1ZTogJy8nLCBvdXRwdXQ6ICcnIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIHNpbmdsZSBzdGFyIGZyb20gb3V0cHV0XG4gICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLXByZXYub3V0cHV0Lmxlbmd0aCk7XG5cbiAgICAgIC8vIHJlc2V0IHByZXZpb3VzIHRva2VuIHRvIGdsb2JzdGFyXG4gICAgICBwcmV2LnR5cGUgPSAnZ2xvYnN0YXInO1xuICAgICAgcHJldi5vdXRwdXQgPSBnbG9ic3RhcihvcHRzKTtcbiAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG5cbiAgICAgIC8vIHJlc2V0IG91dHB1dCB3aXRoIGdsb2JzdGFyXG4gICAgICBzdGF0ZS5vdXRwdXQgKz0gcHJldi5vdXRwdXQ7XG4gICAgICBzdGF0ZS5nbG9ic3RhciA9IHRydWU7XG4gICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHRva2VuID0geyB0eXBlOiAnc3RhcicsIHZhbHVlLCBvdXRwdXQ6IHN0YXIgfTtcblxuICAgIGlmIChvcHRzLmJhc2ggPT09IHRydWUpIHtcbiAgICAgIHRva2VuLm91dHB1dCA9ICcuKj8nO1xuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ2JvcycgfHwgcHJldi50eXBlID09PSAnc2xhc2gnKSB7XG4gICAgICAgIHRva2VuLm91dHB1dCA9IG5vZG90ICsgdG9rZW4ub3V0cHV0O1xuICAgICAgfVxuICAgICAgcHVzaCh0b2tlbik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocHJldiAmJiAocHJldi50eXBlID09PSAnYnJhY2tldCcgfHwgcHJldi50eXBlID09PSAncGFyZW4nKSAmJiBvcHRzLnJlZ2V4ID09PSB0cnVlKSB7XG4gICAgICB0b2tlbi5vdXRwdXQgPSB2YWx1ZTtcbiAgICAgIHB1c2godG9rZW4pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmluZGV4ID09PSBzdGF0ZS5zdGFydCB8fCBwcmV2LnR5cGUgPT09ICdzbGFzaCcgfHwgcHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ2RvdCcpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IE5PX0RPVF9TTEFTSDtcbiAgICAgICAgcHJldi5vdXRwdXQgKz0gTk9fRE9UX1NMQVNIO1xuXG4gICAgICB9IGVsc2UgaWYgKG9wdHMuZG90ID09PSB0cnVlKSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBOT19ET1RTX1NMQVNIO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSBOT19ET1RTX1NMQVNIO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gbm9kb3Q7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IG5vZG90O1xuICAgICAgfVxuXG4gICAgICBpZiAocGVlaygpICE9PSAnKicpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IE9ORV9DSEFSO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSBPTkVfQ0hBUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdXNoKHRva2VuKTtcbiAgfVxuXG4gIHdoaWxlIChzdGF0ZS5icmFja2V0cyA+IDApIHtcbiAgICBpZiAob3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJ10nKSk7XG4gICAgc3RhdGUub3V0cHV0ID0gdXRpbHMuZXNjYXBlTGFzdChzdGF0ZS5vdXRwdXQsICdbJyk7XG4gICAgZGVjcmVtZW50KCdicmFja2V0cycpO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLnBhcmVucyA+IDApIHtcbiAgICBpZiAob3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJyknKSk7XG4gICAgc3RhdGUub3V0cHV0ID0gdXRpbHMuZXNjYXBlTGFzdChzdGF0ZS5vdXRwdXQsICcoJyk7XG4gICAgZGVjcmVtZW50KCdwYXJlbnMnKTtcbiAgfVxuXG4gIHdoaWxlIChzdGF0ZS5icmFjZXMgPiAwKSB7XG4gICAgaWYgKG9wdHMuc3RyaWN0QnJhY2tldHMgPT09IHRydWUpIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignY2xvc2luZycsICd9JykpO1xuICAgIHN0YXRlLm91dHB1dCA9IHV0aWxzLmVzY2FwZUxhc3Qoc3RhdGUub3V0cHV0LCAneycpO1xuICAgIGRlY3JlbWVudCgnYnJhY2VzJyk7XG4gIH1cblxuICBpZiAob3B0cy5zdHJpY3RTbGFzaGVzICE9PSB0cnVlICYmIChwcmV2LnR5cGUgPT09ICdzdGFyJyB8fCBwcmV2LnR5cGUgPT09ICdicmFja2V0JykpIHtcbiAgICBwdXNoKHsgdHlwZTogJ21heWJlX3NsYXNoJywgdmFsdWU6ICcnLCBvdXRwdXQ6IGAke1NMQVNIX0xJVEVSQUx9P2AgfSk7XG4gIH1cblxuICAvLyByZWJ1aWxkIHRoZSBvdXRwdXQgaWYgd2UgaGFkIHRvIGJhY2t0cmFjayBhdCBhbnkgcG9pbnRcbiAgaWYgKHN0YXRlLmJhY2t0cmFjayA9PT0gdHJ1ZSkge1xuICAgIHN0YXRlLm91dHB1dCA9ICcnO1xuXG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiBzdGF0ZS50b2tlbnMpIHtcbiAgICAgIHN0YXRlLm91dHB1dCArPSB0b2tlbi5vdXRwdXQgIT0gbnVsbCA/IHRva2VuLm91dHB1dCA6IHRva2VuLnZhbHVlO1xuXG4gICAgICBpZiAodG9rZW4uc3VmZml4KSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSB0b2tlbi5zdWZmaXg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufTtcblxuLyoqXG4gKiBGYXN0IHBhdGhzIGZvciBjcmVhdGluZyByZWd1bGFyIGV4cHJlc3Npb25zIGZvciBjb21tb24gZ2xvYiBwYXR0ZXJucy5cbiAqIFRoaXMgY2FuIHNpZ25pZmljYW50bHkgc3BlZWQgdXAgcHJvY2Vzc2luZyBhbmQgaGFzIHZlcnkgbGl0dGxlIGRvd25zaWRlXG4gKiBpbXBhY3Qgd2hlbiBub25lIG9mIHRoZSBmYXN0IHBhdGhzIG1hdGNoLlxuICovXG5cbnBhcnNlLmZhc3RwYXRocyA9IChpbnB1dCwgb3B0aW9ucykgPT4ge1xuICBjb25zdCBvcHRzID0geyAuLi5vcHRpb25zIH07XG4gIGNvbnN0IG1heCA9IHR5cGVvZiBvcHRzLm1heExlbmd0aCA9PT0gJ251bWJlcicgPyBNYXRoLm1pbihNQVhfTEVOR1RILCBvcHRzLm1heExlbmd0aCkgOiBNQVhfTEVOR1RIO1xuICBjb25zdCBsZW4gPSBpbnB1dC5sZW5ndGg7XG4gIGlmIChsZW4gPiBtYXgpIHtcbiAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYElucHV0IGxlbmd0aDogJHtsZW59LCBleGNlZWRzIG1heGltdW0gYWxsb3dlZCBsZW5ndGg6ICR7bWF4fWApO1xuICB9XG5cbiAgaW5wdXQgPSBSRVBMQUNFTUVOVFNbaW5wdXRdIHx8IGlucHV0O1xuICBjb25zdCB3aW4zMiA9IHV0aWxzLmlzV2luZG93cyhvcHRpb25zKTtcblxuICAvLyBjcmVhdGUgY29uc3RhbnRzIGJhc2VkIG9uIHBsYXRmb3JtLCBmb3Igd2luZG93cyBvciBwb3NpeFxuICBjb25zdCB7XG4gICAgRE9UX0xJVEVSQUwsXG4gICAgU0xBU0hfTElURVJBTCxcbiAgICBPTkVfQ0hBUixcbiAgICBET1RTX1NMQVNILFxuICAgIE5PX0RPVCxcbiAgICBOT19ET1RTLFxuICAgIE5PX0RPVFNfU0xBU0gsXG4gICAgU1RBUixcbiAgICBTVEFSVF9BTkNIT1JcbiAgfSA9IGNvbnN0YW50cy5nbG9iQ2hhcnMod2luMzIpO1xuXG4gIGNvbnN0IG5vZG90ID0gb3B0cy5kb3QgPyBOT19ET1RTIDogTk9fRE9UO1xuICBjb25zdCBzbGFzaERvdCA9IG9wdHMuZG90ID8gTk9fRE9UU19TTEFTSCA6IE5PX0RPVDtcbiAgY29uc3QgY2FwdHVyZSA9IG9wdHMuY2FwdHVyZSA/ICcnIDogJz86JztcbiAgY29uc3Qgc3RhdGUgPSB7IG5lZ2F0ZWQ6IGZhbHNlLCBwcmVmaXg6ICcnIH07XG4gIGxldCBzdGFyID0gb3B0cy5iYXNoID09PSB0cnVlID8gJy4qPycgOiBTVEFSO1xuXG4gIGlmIChvcHRzLmNhcHR1cmUpIHtcbiAgICBzdGFyID0gYCgke3N0YXJ9KWA7XG4gIH1cblxuICBjb25zdCBnbG9ic3RhciA9IG9wdHMgPT4ge1xuICAgIGlmIChvcHRzLm5vZ2xvYnN0YXIgPT09IHRydWUpIHJldHVybiBzdGFyO1xuICAgIHJldHVybiBgKCR7Y2FwdHVyZX0oPzooPyEke1NUQVJUX0FOQ0hPUn0ke29wdHMuZG90ID8gRE9UU19TTEFTSCA6IERPVF9MSVRFUkFMfSkuKSo/KWA7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlID0gc3RyID0+IHtcbiAgICBzd2l0Y2ggKHN0cikge1xuICAgICAgY2FzZSAnKic6XG4gICAgICAgIHJldHVybiBgJHtub2RvdH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcuKic6XG4gICAgICAgIHJldHVybiBgJHtET1RfTElURVJBTH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcqLionOlxuICAgICAgICByZXR1cm4gYCR7bm9kb3R9JHtzdGFyfSR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKi8qJzpcbiAgICAgICAgcmV0dXJuIGAke25vZG90fSR7c3Rhcn0ke1NMQVNIX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3NsYXNoRG90fSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcqKic6XG4gICAgICAgIHJldHVybiBub2RvdCArIGdsb2JzdGFyKG9wdHMpO1xuXG4gICAgICBjYXNlICcqKi8qJzpcbiAgICAgICAgcmV0dXJuIGAoPzoke25vZG90fSR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSk/JHtzbGFzaERvdH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcqKi8qLionOlxuICAgICAgICByZXR1cm4gYCg/OiR7bm9kb3R9JHtnbG9ic3RhcihvcHRzKX0ke1NMQVNIX0xJVEVSQUx9KT8ke3NsYXNoRG90fSR7c3Rhcn0ke0RPVF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJyoqLy4qJzpcbiAgICAgICAgcmV0dXJuIGAoPzoke25vZG90fSR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSk/JHtET1RfTElURVJBTH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gL14oLio/KVxcLihcXHcrKSQvLmV4ZWMoc3RyKTtcbiAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGNyZWF0ZShtYXRjaFsxXSk7XG4gICAgICAgIGlmICghc291cmNlKSByZXR1cm47XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZSArIERPVF9MSVRFUkFMICsgbWF0Y2hbMl07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG91dHB1dCA9IHV0aWxzLnJlbW92ZVByZWZpeChpbnB1dCwgc3RhdGUpO1xuICBsZXQgc291cmNlID0gY3JlYXRlKG91dHB1dCk7XG5cbiAgaWYgKHNvdXJjZSAmJiBvcHRzLnN0cmljdFNsYXNoZXMgIT09IHRydWUpIHtcbiAgICBzb3VyY2UgKz0gYCR7U0xBU0hfTElURVJBTH0/YDtcbiAgfVxuXG4gIHJldHVybiBzb3VyY2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qgc2NhbiA9IHJlcXVpcmUoJy4vc2NhbicpO1xuY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5jb25zdCBpc09iamVjdCA9IHZhbCA9PiB2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0Y2hlciBmdW5jdGlvbiBmcm9tIG9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMuIFRoZVxuICogcmV0dXJuZWQgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcgdG8gbWF0Y2ggYXMgaXRzIGZpcnN0IGFyZ3VtZW50LFxuICogYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgc3RyaW5nIGlzIGEgbWF0Y2guIFRoZSByZXR1cm5lZCBtYXRjaGVyXG4gKiBmdW5jdGlvbiBhbHNvIHRha2VzIGEgYm9vbGVhbiBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRoYXQsIHdoZW4gdHJ1ZSxcbiAqIHJldHVybnMgYW4gb2JqZWN0IHdpdGggYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2goZ2xvYlssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCBpc01hdGNoID0gcGljb21hdGNoKCcqLiEoKmEpJyk7XG4gKiBjb25zb2xlLmxvZyhpc01hdGNoKCdhLmEnKSk7IC8vPT4gZmFsc2VcbiAqIGNvbnNvbGUubG9nKGlzTWF0Y2goJ2EuYicpKTsgLy89PiB0cnVlXG4gKiBgYGBcbiAqIEBuYW1lIHBpY29tYXRjaFxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGBnbG9ic2AgT25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucy5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtGdW5jdGlvbj19IFJldHVybnMgYSBtYXRjaGVyIGZ1bmN0aW9uLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBwaWNvbWF0Y2ggPSAoZ2xvYiwgb3B0aW9ucywgcmV0dXJuU3RhdGUgPSBmYWxzZSkgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheShnbG9iKSkge1xuICAgIGNvbnN0IGZucyA9IGdsb2IubWFwKGlucHV0ID0+IHBpY29tYXRjaChpbnB1dCwgb3B0aW9ucywgcmV0dXJuU3RhdGUpKTtcbiAgICBjb25zdCBhcnJheU1hdGNoZXIgPSBzdHIgPT4ge1xuICAgICAgZm9yIChjb25zdCBpc01hdGNoIG9mIGZucykge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGlzTWF0Y2goc3RyKTtcbiAgICAgICAgaWYgKHN0YXRlKSByZXR1cm4gc3RhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gYXJyYXlNYXRjaGVyO1xuICB9XG5cbiAgY29uc3QgaXNTdGF0ZSA9IGlzT2JqZWN0KGdsb2IpICYmIGdsb2IudG9rZW5zICYmIGdsb2IuaW5wdXQ7XG5cbiAgaWYgKGdsb2IgPT09ICcnIHx8ICh0eXBlb2YgZ2xvYiAhPT0gJ3N0cmluZycgJiYgIWlzU3RhdGUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgcGF0dGVybiB0byBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnKTtcbiAgfVxuXG4gIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBwb3NpeCA9IHV0aWxzLmlzV2luZG93cyhvcHRpb25zKTtcbiAgY29uc3QgcmVnZXggPSBpc1N0YXRlXG4gICAgPyBwaWNvbWF0Y2guY29tcGlsZVJlKGdsb2IsIG9wdGlvbnMpXG4gICAgOiBwaWNvbWF0Y2gubWFrZVJlKGdsb2IsIG9wdGlvbnMsIGZhbHNlLCB0cnVlKTtcblxuICBjb25zdCBzdGF0ZSA9IHJlZ2V4LnN0YXRlO1xuICBkZWxldGUgcmVnZXguc3RhdGU7XG5cbiAgbGV0IGlzSWdub3JlZCA9ICgpID0+IGZhbHNlO1xuICBpZiAob3B0cy5pZ25vcmUpIHtcbiAgICBjb25zdCBpZ25vcmVPcHRzID0geyAuLi5vcHRpb25zLCBpZ25vcmU6IG51bGwsIG9uTWF0Y2g6IG51bGwsIG9uUmVzdWx0OiBudWxsIH07XG4gICAgaXNJZ25vcmVkID0gcGljb21hdGNoKG9wdHMuaWdub3JlLCBpZ25vcmVPcHRzLCByZXR1cm5TdGF0ZSk7XG4gIH1cblxuICBjb25zdCBtYXRjaGVyID0gKGlucHV0LCByZXR1cm5PYmplY3QgPSBmYWxzZSkgPT4ge1xuICAgIGNvbnN0IHsgaXNNYXRjaCwgbWF0Y2gsIG91dHB1dCB9ID0gcGljb21hdGNoLnRlc3QoaW5wdXQsIHJlZ2V4LCBvcHRpb25zLCB7IGdsb2IsIHBvc2l4IH0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZ2xvYiwgc3RhdGUsIHJlZ2V4LCBwb3NpeCwgaW5wdXQsIG91dHB1dCwgbWF0Y2gsIGlzTWF0Y2ggfTtcblxuICAgIGlmICh0eXBlb2Ygb3B0cy5vblJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3B0cy5vblJlc3VsdChyZXN1bHQpO1xuICAgIH1cblxuICAgIGlmIChpc01hdGNoID09PSBmYWxzZSkge1xuICAgICAgcmVzdWx0LmlzTWF0Y2ggPSBmYWxzZTtcbiAgICAgIHJldHVybiByZXR1cm5PYmplY3QgPyByZXN1bHQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaXNJZ25vcmVkKGlucHV0KSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRzLm9uSWdub3JlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9wdHMub25JZ25vcmUocmVzdWx0KTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5pc01hdGNoID0gZmFsc2U7XG4gICAgICByZXR1cm4gcmV0dXJuT2JqZWN0ID8gcmVzdWx0IDogZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRzLm9uTWF0Y2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9wdHMub25NYXRjaChyZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuT2JqZWN0ID8gcmVzdWx0IDogdHJ1ZTtcbiAgfTtcblxuICBpZiAocmV0dXJuU3RhdGUpIHtcbiAgICBtYXRjaGVyLnN0YXRlID0gc3RhdGU7XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlcjtcbn07XG5cbi8qKlxuICogVGVzdCBgaW5wdXRgIHdpdGggdGhlIGdpdmVuIGByZWdleGAuIFRoaXMgaXMgdXNlZCBieSB0aGUgbWFpblxuICogYHBpY29tYXRjaCgpYCBmdW5jdGlvbiB0byB0ZXN0IHRoZSBpbnB1dCBzdHJpbmcuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogLy8gcGljb21hdGNoLnRlc3QoaW5wdXQsIHJlZ2V4Wywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC50ZXN0KCdmb28vYmFyJywgL14oPzooW14vXSo/KVxcLyhbXi9dKj8pKSQvKSk7XG4gKiAvLyB7IGlzTWF0Y2g6IHRydWUsIG1hdGNoOiBbICdmb28vJywgJ2ZvbycsICdiYXInIF0sIG91dHB1dDogJ2Zvby9iYXInIH1cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBpbnB1dGAgU3RyaW5nIHRvIHRlc3QuXG4gKiBAcGFyYW0ge1JlZ0V4cH0gYHJlZ2V4YFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIG1hdGNoaW5nIGluZm8uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC50ZXN0ID0gKGlucHV0LCByZWdleCwgb3B0aW9ucywgeyBnbG9iLCBwb3NpeCB9ID0ge30pID0+IHtcbiAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBpbnB1dCB0byBiZSBhIHN0cmluZycpO1xuICB9XG5cbiAgaWYgKGlucHV0ID09PSAnJykge1xuICAgIHJldHVybiB7IGlzTWF0Y2g6IGZhbHNlLCBvdXRwdXQ6ICcnIH07XG4gIH1cblxuICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgY29uc3QgZm9ybWF0ID0gb3B0cy5mb3JtYXQgfHwgKHBvc2l4ID8gdXRpbHMudG9Qb3NpeFNsYXNoZXMgOiBudWxsKTtcbiAgbGV0IG1hdGNoID0gaW5wdXQgPT09IGdsb2I7XG4gIGxldCBvdXRwdXQgPSAobWF0Y2ggJiYgZm9ybWF0KSA/IGZvcm1hdChpbnB1dCkgOiBpbnB1dDtcblxuICBpZiAobWF0Y2ggPT09IGZhbHNlKSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0ID8gZm9ybWF0KGlucHV0KSA6IGlucHV0O1xuICAgIG1hdGNoID0gb3V0cHV0ID09PSBnbG9iO1xuICB9XG5cbiAgaWYgKG1hdGNoID09PSBmYWxzZSB8fCBvcHRzLmNhcHR1cmUgPT09IHRydWUpIHtcbiAgICBpZiAob3B0cy5tYXRjaEJhc2UgPT09IHRydWUgfHwgb3B0cy5iYXNlbmFtZSA9PT0gdHJ1ZSkge1xuICAgICAgbWF0Y2ggPSBwaWNvbWF0Y2gubWF0Y2hCYXNlKGlucHV0LCByZWdleCwgb3B0aW9ucywgcG9zaXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBpc01hdGNoOiBCb29sZWFuKG1hdGNoKSwgbWF0Y2gsIG91dHB1dCB9O1xufTtcblxuLyoqXG4gKiBNYXRjaCB0aGUgYmFzZW5hbWUgb2YgYSBmaWxlcGF0aC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2gubWF0Y2hCYXNlKGlucHV0LCBnbG9iWywgb3B0aW9uc10pO1xuICogY29uc29sZS5sb2cocGljb21hdGNoLm1hdGNoQmFzZSgnZm9vL2Jhci5qcycsICcqLmpzJyk7IC8vIHRydWVcbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBpbnB1dGAgU3RyaW5nIHRvIHRlc3QuXG4gKiBAcGFyYW0ge1JlZ0V4cHxTdHJpbmd9IGBnbG9iYCBHbG9iIHBhdHRlcm4gb3IgcmVnZXggY3JlYXRlZCBieSBbLm1ha2VSZV0oI21ha2VSZSkuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2gubWF0Y2hCYXNlID0gKGlucHV0LCBnbG9iLCBvcHRpb25zLCBwb3NpeCA9IHV0aWxzLmlzV2luZG93cyhvcHRpb25zKSkgPT4ge1xuICBjb25zdCByZWdleCA9IGdsb2IgaW5zdGFuY2VvZiBSZWdFeHAgPyBnbG9iIDogcGljb21hdGNoLm1ha2VSZShnbG9iLCBvcHRpb25zKTtcbiAgcmV0dXJuIHJlZ2V4LnRlc3QocGF0aC5iYXNlbmFtZShpbnB1dCkpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgKiphbnkqKiBvZiB0aGUgZ2l2ZW4gZ2xvYiBgcGF0dGVybnNgIG1hdGNoIHRoZSBzcGVjaWZpZWQgYHN0cmluZ2AuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogLy8gcGljb21hdGNoLmlzTWF0Y2goc3RyaW5nLCBwYXR0ZXJuc1ssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2guaXNNYXRjaCgnYS5hJywgWydiLionLCAnKi5hJ10pKTsgLy89PiB0cnVlXG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2guaXNNYXRjaCgnYS5hJywgJ2IuKicpKTsgLy89PiBmYWxzZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gc3RyIFRoZSBzdHJpbmcgdG8gdGVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwYXR0ZXJucyBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zIHRvIHVzZSBmb3IgbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFNlZSBhdmFpbGFibGUgW29wdGlvbnNdKCNvcHRpb25zKS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbnkgcGF0dGVybnMgbWF0Y2ggYHN0cmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLmlzTWF0Y2ggPSAoc3RyLCBwYXR0ZXJucywgb3B0aW9ucykgPT4gcGljb21hdGNoKHBhdHRlcm5zLCBvcHRpb25zKShzdHIpO1xuXG4vKipcbiAqIFBhcnNlIGEgZ2xvYiBwYXR0ZXJuIHRvIGNyZWF0ZSB0aGUgc291cmNlIHN0cmluZyBmb3IgYSByZWd1bGFyXG4gKiBleHByZXNzaW9uLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIGNvbnN0IHJlc3VsdCA9IHBpY29tYXRjaC5wYXJzZShwYXR0ZXJuWywgb3B0aW9uc10pO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggdXNlZnVsIHByb3BlcnRpZXMgYW5kIG91dHB1dCB0byBiZSB1c2VkIGFzIGEgcmVnZXggc291cmNlIHN0cmluZy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLnBhcnNlID0gKHBhdHRlcm4sIG9wdGlvbnMpID0+IHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocGF0dGVybikpIHJldHVybiBwYXR0ZXJuLm1hcChwID0+IHBpY29tYXRjaC5wYXJzZShwLCBvcHRpb25zKSk7XG4gIHJldHVybiBwYXJzZShwYXR0ZXJuLCB7IC4uLm9wdGlvbnMsIGZhc3RwYXRoczogZmFsc2UgfSk7XG59O1xuXG4vKipcbiAqIFNjYW4gYSBnbG9iIHBhdHRlcm4gdG8gc2VwYXJhdGUgdGhlIHBhdHRlcm4gaW50byBzZWdtZW50cy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2guc2NhbihpbnB1dFssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCByZXN1bHQgPSBwaWNvbWF0Y2guc2NhbignIS4vZm9vLyouanMnKTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gKiB7IHByZWZpeDogJyEuLycsXG4gKiAgIGlucHV0OiAnIS4vZm9vLyouanMnLFxuICogICBzdGFydDogMyxcbiAqICAgYmFzZTogJ2ZvbycsXG4gKiAgIGdsb2I6ICcqLmpzJyxcbiAqICAgaXNCcmFjZTogZmFsc2UsXG4gKiAgIGlzQnJhY2tldDogZmFsc2UsXG4gKiAgIGlzR2xvYjogdHJ1ZSxcbiAqICAgaXNFeHRnbG9iOiBmYWxzZSxcbiAqICAgaXNHbG9ic3RhcjogZmFsc2UsXG4gKiAgIG5lZ2F0ZWQ6IHRydWUgfVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBHbG9iIHBhdHRlcm4gdG8gc2Nhbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2guc2NhbiA9IChpbnB1dCwgb3B0aW9ucykgPT4gc2NhbihpbnB1dCwgb3B0aW9ucyk7XG5cbi8qKlxuICogQ29tcGlsZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmcm9tIHRoZSBgc3RhdGVgIG9iamVjdCByZXR1cm5lZCBieSB0aGVcbiAqIFtwYXJzZSgpXSgjcGFyc2UpIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYHN0YXRlYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHBhcmFtIHtCb29sZWFufSBgcmV0dXJuT3V0cHV0YCBJbnRlbmRlZCBmb3IgaW1wbGVtZW50b3JzLCB0aGlzIGFyZ3VtZW50IGFsbG93cyB5b3UgdG8gcmV0dXJuIHRoZSByYXcgb3V0cHV0IGZyb20gdGhlIHBhcnNlci5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYHJldHVyblN0YXRlYCBBZGRzIHRoZSBzdGF0ZSB0byBhIGBzdGF0ZWAgcHJvcGVydHkgb24gdGhlIHJldHVybmVkIHJlZ2V4LiBVc2VmdWwgZm9yIGltcGxlbWVudG9ycyBhbmQgZGVidWdnaW5nLlxuICogQHJldHVybiB7UmVnRXhwfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2guY29tcGlsZVJlID0gKHN0YXRlLCBvcHRpb25zLCByZXR1cm5PdXRwdXQgPSBmYWxzZSwgcmV0dXJuU3RhdGUgPSBmYWxzZSkgPT4ge1xuICBpZiAocmV0dXJuT3V0cHV0ID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHN0YXRlLm91dHB1dDtcbiAgfVxuXG4gIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBwcmVwZW5kID0gb3B0cy5jb250YWlucyA/ICcnIDogJ14nO1xuICBjb25zdCBhcHBlbmQgPSBvcHRzLmNvbnRhaW5zID8gJycgOiAnJCc7XG5cbiAgbGV0IHNvdXJjZSA9IGAke3ByZXBlbmR9KD86JHtzdGF0ZS5vdXRwdXR9KSR7YXBwZW5kfWA7XG4gIGlmIChzdGF0ZSAmJiBzdGF0ZS5uZWdhdGVkID09PSB0cnVlKSB7XG4gICAgc291cmNlID0gYF4oPyEke3NvdXJjZX0pLiokYDtcbiAgfVxuXG4gIGNvbnN0IHJlZ2V4ID0gcGljb21hdGNoLnRvUmVnZXgoc291cmNlLCBvcHRpb25zKTtcbiAgaWYgKHJldHVyblN0YXRlID09PSB0cnVlKSB7XG4gICAgcmVnZXguc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIHJldHVybiByZWdleDtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIGZyb20gYSBwYXJzZWQgZ2xvYiBwYXR0ZXJuLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIGNvbnN0IHN0YXRlID0gcGljb21hdGNoLnBhcnNlKCcqLmpzJyk7XG4gKiAvLyBwaWNvbWF0Y2guY29tcGlsZVJlKHN0YXRlWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5jb21waWxlUmUoc3RhdGUpKTtcbiAqIC8vPT4gL14oPzooPyFcXC4pKD89LilbXi9dKj9cXC5qcykkL1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHN0YXRlYCBUaGUgb2JqZWN0IHJldHVybmVkIGZyb20gdGhlIGAucGFyc2VgIG1ldGhvZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYHJldHVybk91dHB1dGAgSW1wbGVtZW50b3JzIG1heSB1c2UgdGhpcyBhcmd1bWVudCB0byByZXR1cm4gdGhlIGNvbXBpbGVkIG91dHB1dCwgaW5zdGVhZCBvZiBhIHJlZ3VsYXIgZXhwcmVzc2lvbi4gVGhpcyBpcyBub3QgZXhwb3NlZCBvbiB0aGUgb3B0aW9ucyB0byBwcmV2ZW50IGVuZC11c2VycyBmcm9tIG11dGF0aW5nIHRoZSByZXN1bHQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGByZXR1cm5TdGF0ZWAgSW1wbGVtZW50b3JzIG1heSB1c2UgdGhpcyBhcmd1bWVudCB0byByZXR1cm4gdGhlIHN0YXRlIGZyb20gdGhlIHBhcnNlZCBnbG9iIHdpdGggdGhlIHJldHVybmVkIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqIEByZXR1cm4ge1JlZ0V4cH0gUmV0dXJucyBhIHJlZ2V4IGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gcGF0dGVybi5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLm1ha2VSZSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9LCByZXR1cm5PdXRwdXQgPSBmYWxzZSwgcmV0dXJuU3RhdGUgPSBmYWxzZSkgPT4ge1xuICBpZiAoIWlucHV0IHx8IHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIG5vbi1lbXB0eSBzdHJpbmcnKTtcbiAgfVxuXG4gIGxldCBwYXJzZWQgPSB7IG5lZ2F0ZWQ6IGZhbHNlLCBmYXN0cGF0aHM6IHRydWUgfTtcblxuICBpZiAob3B0aW9ucy5mYXN0cGF0aHMgIT09IGZhbHNlICYmIChpbnB1dFswXSA9PT0gJy4nIHx8IGlucHV0WzBdID09PSAnKicpKSB7XG4gICAgcGFyc2VkLm91dHB1dCA9IHBhcnNlLmZhc3RwYXRocyhpbnB1dCwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoIXBhcnNlZC5vdXRwdXQpIHtcbiAgICBwYXJzZWQgPSBwYXJzZShpbnB1dCwgb3B0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gcGljb21hdGNoLmNvbXBpbGVSZShwYXJzZWQsIG9wdGlvbnMsIHJldHVybk91dHB1dCwgcmV0dXJuU3RhdGUpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gZnJvbSB0aGUgZ2l2ZW4gcmVnZXggc291cmNlIHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2gudG9SZWdleChzb3VyY2VbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc3QgeyBvdXRwdXQgfSA9IHBpY29tYXRjaC5wYXJzZSgnKi5qcycpO1xuICogY29uc29sZS5sb2cocGljb21hdGNoLnRvUmVnZXgob3V0cHV0KSk7XG4gKiAvLz0+IC9eKD86KD8hXFwuKSg/PS4pW14vXSo/XFwuanMpJC9cbiAqIGBgYFxuICogQHBhcmFtIHtTdHJpbmd9IGBzb3VyY2VgIFJlZ3VsYXIgZXhwcmVzc2lvbiBzb3VyY2Ugc3RyaW5nLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7UmVnRXhwfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2gudG9SZWdleCA9IChzb3VyY2UsIG9wdGlvbnMpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChzb3VyY2UsIG9wdHMuZmxhZ3MgfHwgKG9wdHMubm9jYXNlID8gJ2knIDogJycpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kZWJ1ZyA9PT0gdHJ1ZSkgdGhyb3cgZXJyO1xuICAgIHJldHVybiAvJF4vO1xuICB9XG59O1xuXG4vKipcbiAqIFBpY29tYXRjaCBjb25zdGFudHMuXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxucGljb21hdGNoLmNvbnN0YW50cyA9IGNvbnN0YW50cztcblxuLyoqXG4gKiBFeHBvc2UgXCJwaWNvbWF0Y2hcIlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcGljb21hdGNoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL3BpY29tYXRjaCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCB7IFJlYWRhYmxlIH0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbmNvbnN0IHN5c1BhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB7IHByb21pc2lmeSB9ID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG5cbmNvbnN0IHJlYWRkaXIgPSBwcm9taXNpZnkoZnMucmVhZGRpcik7XG5jb25zdCBzdGF0ID0gcHJvbWlzaWZ5KGZzLnN0YXQpO1xuY29uc3QgbHN0YXQgPSBwcm9taXNpZnkoZnMubHN0YXQpO1xuY29uc3QgcmVhbHBhdGggPSBwcm9taXNpZnkoZnMucmVhbHBhdGgpO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEVudHJ5SW5mb1xuICogQHByb3BlcnR5IHtTdHJpbmd9IHBhdGhcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBmdWxsUGF0aFxuICogQHByb3BlcnR5IHtmcy5TdGF0cz19IHN0YXRzXG4gKiBAcHJvcGVydHkge2ZzLkRpcmVudD19IGRpcmVudFxuICogQHByb3BlcnR5IHtTdHJpbmd9IGJhc2VuYW1lXG4gKi9cblxuY29uc3QgQkFORyA9ICchJztcbmNvbnN0IE5PUk1BTF9GTE9XX0VSUk9SUyA9IG5ldyBTZXQoWydFTk9FTlQnLCAnRVBFUk0nLCAnRUFDQ0VTJywgJ0VMT09QJ10pO1xuY29uc3QgRklMRV9UWVBFID0gJ2ZpbGVzJztcbmNvbnN0IERJUl9UWVBFID0gJ2RpcmVjdG9yaWVzJztcbmNvbnN0IEZJTEVfRElSX1RZUEUgPSAnZmlsZXNfZGlyZWN0b3JpZXMnO1xuY29uc3QgRVZFUllUSElOR19UWVBFID0gJ2FsbCc7XG5jb25zdCBBTExfVFlQRVMgPSBbRklMRV9UWVBFLCBESVJfVFlQRSwgRklMRV9ESVJfVFlQRSwgRVZFUllUSElOR19UWVBFXTtcblxuY29uc3QgaXNOb3JtYWxGbG93RXJyb3IgPSBlcnJvciA9PiBOT1JNQUxfRkxPV19FUlJPUlMuaGFzKGVycm9yLmNvZGUpO1xuXG5jb25zdCBub3JtYWxpemVGaWx0ZXIgPSBmaWx0ZXIgPT4ge1xuICBpZiAoZmlsdGVyID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHJldHVybiBmaWx0ZXI7XG5cbiAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgZ2xvYiA9IHBpY29tYXRjaChmaWx0ZXIudHJpbSgpKTtcbiAgICByZXR1cm4gZW50cnkgPT4gZ2xvYihlbnRyeS5iYXNlbmFtZSk7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgY29uc3QgcG9zaXRpdmUgPSBbXTtcbiAgICBjb25zdCBuZWdhdGl2ZSA9IFtdO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBmaWx0ZXIpIHtcbiAgICAgIGNvbnN0IHRyaW1tZWQgPSBpdGVtLnRyaW0oKTtcbiAgICAgIGlmICh0cmltbWVkLmNoYXJBdCgwKSA9PT0gQkFORykge1xuICAgICAgICBuZWdhdGl2ZS5wdXNoKHBpY29tYXRjaCh0cmltbWVkLnNsaWNlKDEpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3NpdGl2ZS5wdXNoKHBpY29tYXRjaCh0cmltbWVkKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5lZ2F0aXZlLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChwb3NpdGl2ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBlbnRyeSA9PlxuICAgICAgICAgIHBvc2l0aXZlLnNvbWUoZiA9PiBmKGVudHJ5LmJhc2VuYW1lKSkgJiYgIW5lZ2F0aXZlLnNvbWUoZiA9PiBmKGVudHJ5LmJhc2VuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW50cnkgPT4gIW5lZ2F0aXZlLnNvbWUoZiA9PiBmKGVudHJ5LmJhc2VuYW1lKSk7XG4gICAgfVxuICAgIHJldHVybiBlbnRyeSA9PiBwb3NpdGl2ZS5zb21lKGYgPT4gZihlbnRyeS5iYXNlbmFtZSkpO1xuICB9XG59O1xuXG5jbGFzcyBSZWFkZGlycFN0cmVhbSBleHRlbmRzIFJlYWRhYmxlIHtcbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogJy4nLFxuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgIGZpbGVGaWx0ZXI6IChwYXRoKSA9PiB0cnVlLFxuICAgICAgZGlyZWN0b3J5RmlsdGVyOiAocGF0aCkgPT4gdHJ1ZSxcbiAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgIHR5cGU6IEZJTEVfVFlQRSxcbiAgICAgIGxzdGF0OiBmYWxzZSxcbiAgICAgIGRlcHRoOiAyMTQ3NDgzNjQ4LFxuICAgICAgYWx3YXlzU3RhdDogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgb2JqZWN0TW9kZTogdHJ1ZSxcbiAgICAgIGF1dG9EZXN0cm95OiB0cnVlLFxuICAgICAgaGlnaFdhdGVyTWFyazogb3B0aW9ucy5oaWdoV2F0ZXJNYXJrIHx8IDQwOTZcbiAgICB9KTtcbiAgICBjb25zdCBvcHRzID0geyAuLi5SZWFkZGlycFN0cmVhbS5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICAgIGNvbnN0IHsgcm9vdCwgdHlwZSB9ID0gb3B0cztcblxuICAgIHRoaXMuX2ZpbGVGaWx0ZXIgPSBub3JtYWxpemVGaWx0ZXIob3B0cy5maWxlRmlsdGVyKTtcbiAgICB0aGlzLl9kaXJlY3RvcnlGaWx0ZXIgPSBub3JtYWxpemVGaWx0ZXIob3B0cy5kaXJlY3RvcnlGaWx0ZXIpO1xuXG4gICAgY29uc3Qgc3RhdE1ldGhvZCA9IG9wdHMubHN0YXQgPyBsc3RhdCA6IHN0YXQ7XG4gICAgLy8gVXNlIGJpZ2ludCBzdGF0cyBpZiBpdCdzIHdpbmRvd3MgYW5kIHN0YXQoKSBzdXBwb3J0cyBvcHRpb25zIChub2RlIDEwKykuXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgJiYgc3RhdC5sZW5ndGggPT09IDMpIHtcbiAgICAgIHRoaXMuX3N0YXQgPSBwYXRoID0+IHN0YXRNZXRob2QocGF0aCwgeyBiaWdpbnQ6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3N0YXQgPSBzdGF0TWV0aG9kO1xuICAgIH1cblxuICAgIHRoaXMuX21heERlcHRoID0gb3B0cy5kZXB0aDtcbiAgICB0aGlzLl93YW50c0RpciA9IFtESVJfVFlQRSwgRklMRV9ESVJfVFlQRSwgRVZFUllUSElOR19UWVBFXS5pbmNsdWRlcyh0eXBlKTtcbiAgICB0aGlzLl93YW50c0ZpbGUgPSBbRklMRV9UWVBFLCBGSUxFX0RJUl9UWVBFLCBFVkVSWVRISU5HX1RZUEVdLmluY2x1ZGVzKHR5cGUpO1xuICAgIHRoaXMuX3dhbnRzRXZlcnl0aGluZyA9IHR5cGUgPT09IEVWRVJZVEhJTkdfVFlQRTtcbiAgICB0aGlzLl9yb290ID0gc3lzUGF0aC5yZXNvbHZlKHJvb3QpO1xuICAgIHRoaXMuX2lzRGlyZW50ID0gKCdEaXJlbnQnIGluIGZzKSAmJiAhb3B0cy5hbHdheXNTdGF0O1xuICAgIHRoaXMuX3N0YXRzUHJvcCA9IHRoaXMuX2lzRGlyZW50ID8gJ2RpcmVudCcgOiAnc3RhdHMnO1xuICAgIHRoaXMuX3JkT3B0aW9ucyA9IHsgZW5jb2Rpbmc6ICd1dGY4Jywgd2l0aEZpbGVUeXBlczogdGhpcy5faXNEaXJlbnQgfTtcblxuICAgIC8vIExhdW5jaCBzdHJlYW0gd2l0aCBvbmUgcGFyZW50LCB0aGUgcm9vdCBkaXIuXG4gICAgdGhpcy5wYXJlbnRzID0gW3RoaXMuX2V4cGxvcmVEaXIocm9vdCwgMSldO1xuICAgIHRoaXMucmVhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgYXN5bmMgX3JlYWQoYmF0Y2gpIHtcbiAgICBpZiAodGhpcy5yZWFkaW5nKSByZXR1cm47XG4gICAgdGhpcy5yZWFkaW5nID0gdHJ1ZTtcblxuICAgIHRyeSB7XG4gICAgICB3aGlsZSAoIXRoaXMuZGVzdHJveWVkICYmIGJhdGNoID4gMCkge1xuICAgICAgICBjb25zdCB7IHBhdGgsIGRlcHRoLCBmaWxlcyA9IFtdIH0gPSB0aGlzLnBhcmVudCB8fCB7fTtcblxuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IHNsaWNlID0gZmlsZXMuc3BsaWNlKDAsIGJhdGNoKS5tYXAoZGlyZW50ID0+IHRoaXMuX2Zvcm1hdEVudHJ5KGRpcmVudCwgcGF0aCkpO1xuICAgICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgYXdhaXQgUHJvbWlzZS5hbGwoc2xpY2UpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgZW50cnlUeXBlID0gYXdhaXQgdGhpcy5fZ2V0RW50cnlUeXBlKGVudHJ5KTtcbiAgICAgICAgICAgIGlmIChlbnRyeVR5cGUgPT09ICdkaXJlY3RvcnknICYmIHRoaXMuX2RpcmVjdG9yeUZpbHRlcihlbnRyeSkpIHtcbiAgICAgICAgICAgICAgaWYgKGRlcHRoIDw9IHRoaXMuX21heERlcHRoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRzLnB1c2godGhpcy5fZXhwbG9yZURpcihlbnRyeS5mdWxsUGF0aCwgZGVwdGggKyAxKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGhpcy5fd2FudHNEaXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgIGJhdGNoLS07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGVudHJ5VHlwZSA9PT0gJ2ZpbGUnIHx8IHRoaXMuX2luY2x1ZGVBc0ZpbGUoZW50cnkpKSAmJiB0aGlzLl9maWxlRmlsdGVyKGVudHJ5KSkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5fd2FudHNGaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICBiYXRjaC0tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50cy5wb3AoKTtcbiAgICAgICAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucGFyZW50ID0gYXdhaXQgcGFyZW50O1xuICAgICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuZGVzdHJveShlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucmVhZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9leHBsb3JlRGlyKHBhdGgsIGRlcHRoKSB7XG4gICAgbGV0IGZpbGVzO1xuICAgIHRyeSB7XG4gICAgICBmaWxlcyA9IGF3YWl0IHJlYWRkaXIocGF0aCwgdGhpcy5fcmRPcHRpb25zKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fb25FcnJvcihlcnJvcik7XG4gICAgfVxuICAgIHJldHVybiB7ZmlsZXMsIGRlcHRoLCBwYXRofTtcbiAgfVxuXG4gIGFzeW5jIF9mb3JtYXRFbnRyeShkaXJlbnQsIHBhdGgpIHtcbiAgICBsZXQgZW50cnk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJhc2VuYW1lID0gdGhpcy5faXNEaXJlbnQgPyBkaXJlbnQubmFtZSA6IGRpcmVudDtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gc3lzUGF0aC5yZXNvbHZlKHN5c1BhdGguam9pbihwYXRoLCBiYXNlbmFtZSkpO1xuICAgICAgZW50cnkgPSB7cGF0aDogc3lzUGF0aC5yZWxhdGl2ZSh0aGlzLl9yb290LCBmdWxsUGF0aCksIGZ1bGxQYXRoLCBiYXNlbmFtZX07XG4gICAgICBlbnRyeVt0aGlzLl9zdGF0c1Byb3BdID0gdGhpcy5faXNEaXJlbnQgPyBkaXJlbnQgOiBhd2FpdCB0aGlzLl9zdGF0KGZ1bGxQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuX29uRXJyb3IoZXJyKTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgX29uRXJyb3IoZXJyKSB7XG4gICAgaWYgKGlzTm9ybWFsRmxvd0Vycm9yKGVycikgJiYgIXRoaXMuZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLmVtaXQoJ3dhcm4nLCBlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3Ryb3koZXJyKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBfZ2V0RW50cnlUeXBlKGVudHJ5KSB7XG4gICAgLy8gZW50cnkgbWF5IGJlIHVuZGVmaW5lZCwgYmVjYXVzZSBhIHdhcm5pbmcgb3IgYW4gZXJyb3Igd2VyZSBlbWl0dGVkXG4gICAgLy8gYW5kIHRoZSBzdGF0c1Byb3AgaXMgdW5kZWZpbmVkXG4gICAgY29uc3Qgc3RhdHMgPSBlbnRyeSAmJiBlbnRyeVt0aGlzLl9zdGF0c1Byb3BdO1xuICAgIGlmICghc3RhdHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICByZXR1cm4gJ2ZpbGUnO1xuICAgIH1cbiAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgcmV0dXJuICdkaXJlY3RvcnknO1xuICAgIH1cbiAgICBpZiAoc3RhdHMgJiYgc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgY29uc3QgZnVsbCA9IGVudHJ5LmZ1bGxQYXRoO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZW50cnlSZWFsUGF0aCA9IGF3YWl0IHJlYWxwYXRoKGZ1bGwpO1xuICAgICAgICBjb25zdCBlbnRyeVJlYWxQYXRoU3RhdHMgPSBhd2FpdCBsc3RhdChlbnRyeVJlYWxQYXRoKTtcbiAgICAgICAgaWYgKGVudHJ5UmVhbFBhdGhTdGF0cy5pc0ZpbGUoKSkge1xuICAgICAgICAgIHJldHVybiAnZmlsZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVudHJ5UmVhbFBhdGhTdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgY29uc3QgbGVuID0gZW50cnlSZWFsUGF0aC5sZW5ndGg7XG4gICAgICAgICAgaWYgKGZ1bGwuc3RhcnRzV2l0aChlbnRyeVJlYWxQYXRoKSAmJiBmdWxsLnN1YnN0cihsZW4sIDEpID09PSBzeXNQYXRoLnNlcCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29uRXJyb3IobmV3IEVycm9yKFxuICAgICAgICAgICAgICBgQ2lyY3VsYXIgc3ltbGluayBkZXRlY3RlZDogXCIke2Z1bGx9XCIgcG9pbnRzIHRvIFwiJHtlbnRyeVJlYWxQYXRofVwiYFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnZGlyZWN0b3J5JztcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5fb25FcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2luY2x1ZGVBc0ZpbGUoZW50cnkpIHtcbiAgICBjb25zdCBzdGF0cyA9IGVudHJ5ICYmIGVudHJ5W3RoaXMuX3N0YXRzUHJvcF07XG5cbiAgICByZXR1cm4gc3RhdHMgJiYgdGhpcy5fd2FudHNFdmVyeXRoaW5nICYmICFzdGF0cy5pc0RpcmVjdG9yeSgpO1xuICB9XG59XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gUmVhZGRpcnBBcmd1bWVudHNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb249fSBmaWxlRmlsdGVyXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9uPX0gZGlyZWN0b3J5RmlsdGVyXG4gKiBAcHJvcGVydHkge1N0cmluZz19IHR5cGVcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyPX0gZGVwdGhcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nPX0gcm9vdFxuICogQHByb3BlcnR5IHtCb29sZWFuPX0gbHN0YXRcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbj19IGJpZ2ludFxuICovXG5cbi8qKlxuICogTWFpbiBmdW5jdGlvbiB3aGljaCBlbmRzIHVwIGNhbGxpbmcgcmVhZGRpclJlYyBhbmQgcmVhZHMgYWxsIGZpbGVzIGFuZCBkaXJlY3RvcmllcyBpbiBnaXZlbiByb290IHJlY3Vyc2l2ZWx5LlxuICogQHBhcmFtIHtTdHJpbmd9IHJvb3QgUm9vdCBkaXJlY3RvcnlcbiAqIEBwYXJhbSB7UmVhZGRpcnBBcmd1bWVudHM9fSBvcHRpb25zIE9wdGlvbnMgdG8gc3BlY2lmeSByb290IChzdGFydCBkaXJlY3RvcnkpLCBmaWx0ZXJzIGFuZCByZWN1cnNpb24gZGVwdGhcbiAqL1xuY29uc3QgcmVhZGRpcnAgPSAocm9vdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCB0eXBlID0gb3B0aW9ucy5lbnRyeVR5cGUgfHwgb3B0aW9ucy50eXBlO1xuICBpZiAodHlwZSA9PT0gJ2JvdGgnKSB0eXBlID0gRklMRV9ESVJfVFlQRTsgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHlcbiAgaWYgKHR5cGUpIG9wdGlvbnMudHlwZSA9IHR5cGU7XG4gIGlmICghcm9vdCkge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVhZGRpcnA6IHJvb3QgYXJndW1lbnQgaXMgcmVxdWlyZWQuIFVzYWdlOiByZWFkZGlycChyb290LCBvcHRpb25zKScpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiByb290ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlYWRkaXJwOiByb290IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcuIFVzYWdlOiByZWFkZGlycChyb290LCBvcHRpb25zKScpO1xuICB9IGVsc2UgaWYgKHR5cGUgJiYgIUFMTF9UWVBFUy5pbmNsdWRlcyh0eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgcmVhZGRpcnA6IEludmFsaWQgdHlwZSBwYXNzZWQuIFVzZSBvbmUgb2YgJHtBTExfVFlQRVMuam9pbignLCAnKX1gKTtcbiAgfVxuXG4gIG9wdGlvbnMucm9vdCA9IHJvb3Q7XG4gIHJldHVybiBuZXcgUmVhZGRpcnBTdHJlYW0ob3B0aW9ucyk7XG59O1xuXG5jb25zdCByZWFkZGlycFByb21pc2UgPSAocm9vdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgZmlsZXMgPSBbXTtcbiAgICByZWFkZGlycChyb290LCBvcHRpb25zKVxuICAgICAgLm9uKCdkYXRhJywgZW50cnkgPT4gZmlsZXMucHVzaChlbnRyeSkpXG4gICAgICAub24oJ2VuZCcsICgpID0+IHJlc29sdmUoZmlsZXMpKVxuICAgICAgLm9uKCdlcnJvcicsIGVycm9yID0+IHJlamVjdChlcnJvcikpO1xuICB9KTtcbn07XG5cbnJlYWRkaXJwLnByb21pc2UgPSByZWFkZGlycFByb21pc2U7XG5yZWFkZGlycC5SZWFkZGlycFN0cmVhbSA9IFJlYWRkaXJwU3RyZWFtO1xucmVhZGRpcnAuZGVmYXVsdCA9IHJlYWRkaXJwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlYWRkaXJwO1xuIiwiLyohXG4gKiBub3JtYWxpemUtcGF0aCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvbm9ybWFsaXplLXBhdGg+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTgsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocGF0aCwgc3RyaXBUcmFpbGluZykge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0ZWQgcGF0aCB0byBiZSBhIHN0cmluZycpO1xuICB9XG5cbiAgaWYgKHBhdGggPT09ICdcXFxcJyB8fCBwYXRoID09PSAnLycpIHJldHVybiAnLyc7XG5cbiAgdmFyIGxlbiA9IHBhdGgubGVuZ3RoO1xuICBpZiAobGVuIDw9IDEpIHJldHVybiBwYXRoO1xuXG4gIC8vIGVuc3VyZSB0aGF0IHdpbjMyIG5hbWVzcGFjZXMgaGFzIHR3byBsZWFkaW5nIHNsYXNoZXMsIHNvIHRoYXQgdGhlIHBhdGggaXNcbiAgLy8gaGFuZGxlZCBwcm9wZXJseSBieSB0aGUgd2luMzIgdmVyc2lvbiBvZiBwYXRoLnBhcnNlKCkgYWZ0ZXIgYmVpbmcgbm9ybWFsaXplZFxuICAvLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9saWJyYXJ5L3dpbmRvd3MvZGVza3RvcC9hYTM2NTI0Nyh2PXZzLjg1KS5hc3B4I25hbWVzcGFjZXNcbiAgdmFyIHByZWZpeCA9ICcnO1xuICBpZiAobGVuID4gNCAmJiBwYXRoWzNdID09PSAnXFxcXCcpIHtcbiAgICB2YXIgY2ggPSBwYXRoWzJdO1xuICAgIGlmICgoY2ggPT09ICc/JyB8fCBjaCA9PT0gJy4nKSAmJiBwYXRoLnNsaWNlKDAsIDIpID09PSAnXFxcXFxcXFwnKSB7XG4gICAgICBwYXRoID0gcGF0aC5zbGljZSgyKTtcbiAgICAgIHByZWZpeCA9ICcvLyc7XG4gICAgfVxuICB9XG5cbiAgdmFyIHNlZ3MgPSBwYXRoLnNwbGl0KC9bL1xcXFxdKy8pO1xuICBpZiAoc3RyaXBUcmFpbGluZyAhPT0gZmFsc2UgJiYgc2Vnc1tzZWdzLmxlbmd0aCAtIDFdID09PSAnJykge1xuICAgIHNlZ3MucG9wKCk7XG4gIH1cbiAgcmV0dXJuIHByZWZpeCArIHNlZ3Muam9pbignLycpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5jb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbmNvbnN0IG5vcm1hbGl6ZVBhdGggPSByZXF1aXJlKCdub3JtYWxpemUtcGF0aCcpO1xuXG4vKipcbiAqIEB0eXBlZGVmIHsodGVzdFN0cmluZzogc3RyaW5nKSA9PiBib29sZWFufSBBbnltYXRjaEZuXG4gKiBAdHlwZWRlZiB7c3RyaW5nfFJlZ0V4cHxBbnltYXRjaEZufSBBbnltYXRjaFBhdHRlcm5cbiAqIEB0eXBlZGVmIHtBbnltYXRjaFBhdHRlcm58QW55bWF0Y2hQYXR0ZXJuW119IEFueW1hdGNoTWF0Y2hlclxuICovXG5jb25zdCBCQU5HID0gJyEnO1xuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge3JldHVybkluZGV4OiBmYWxzZX07XG5jb25zdCBhcnJpZnkgPSAoaXRlbSkgPT4gQXJyYXkuaXNBcnJheShpdGVtKSA/IGl0ZW0gOiBbaXRlbV07XG5cbi8qKlxuICogQHBhcmFtIHtBbnltYXRjaFBhdHRlcm59IG1hdGNoZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJucyB7QW55bWF0Y2hGbn1cbiAqL1xuY29uc3QgY3JlYXRlUGF0dGVybiA9IChtYXRjaGVyLCBvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2YgbWF0Y2hlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtYXRjaGVyO1xuICB9XG4gIGlmICh0eXBlb2YgbWF0Y2hlciA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBnbG9iID0gcGljb21hdGNoKG1hdGNoZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiAoc3RyaW5nKSA9PiBtYXRjaGVyID09PSBzdHJpbmcgfHwgZ2xvYihzdHJpbmcpO1xuICB9XG4gIGlmIChtYXRjaGVyIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuIChzdHJpbmcpID0+IG1hdGNoZXIudGVzdChzdHJpbmcpO1xuICB9XG4gIHJldHVybiAoc3RyaW5nKSA9PiBmYWxzZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj59IHBhdHRlcm5zXG4gKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPn0gbmVnUGF0dGVybnNcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBhcmdzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJldHVybkluZGV4XG4gKiBAcmV0dXJucyB7Ym9vbGVhbnxudW1iZXJ9XG4gKi9cbmNvbnN0IG1hdGNoUGF0dGVybnMgPSAocGF0dGVybnMsIG5lZ1BhdHRlcm5zLCBhcmdzLCByZXR1cm5JbmRleCkgPT4ge1xuICBjb25zdCBpc0xpc3QgPSBBcnJheS5pc0FycmF5KGFyZ3MpO1xuICBjb25zdCBfcGF0aCA9IGlzTGlzdCA/IGFyZ3NbMF0gOiBhcmdzO1xuICBpZiAoIWlzTGlzdCAmJiB0eXBlb2YgX3BhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYW55bWF0Y2g6IHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nOiBnb3QgJyArXG4gICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoX3BhdGgpKVxuICB9XG4gIGNvbnN0IHBhdGggPSBub3JtYWxpemVQYXRoKF9wYXRoKTtcblxuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbmVnUGF0dGVybnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgY29uc3Qgbmdsb2IgPSBuZWdQYXR0ZXJuc1tpbmRleF07XG4gICAgaWYgKG5nbG9iKHBhdGgpKSB7XG4gICAgICByZXR1cm4gcmV0dXJuSW5kZXggPyAtMSA6IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFwcGxpZWQgPSBpc0xpc3QgJiYgW3BhdGhdLmNvbmNhdChhcmdzLnNsaWNlKDEpKTtcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHBhdHRlcm5zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBwYXR0ZXJuc1tpbmRleF07XG4gICAgaWYgKGlzTGlzdCA/IHBhdHRlcm4oLi4uYXBwbGllZCkgOiBwYXR0ZXJuKHBhdGgpKSB7XG4gICAgICByZXR1cm4gcmV0dXJuSW5kZXggPyBpbmRleCA6IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldHVybkluZGV4ID8gLTEgOiBmYWxzZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtBbnltYXRjaE1hdGNoZXJ9IG1hdGNoZXJzXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gdGVzdFN0cmluZ1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm5zIHtib29sZWFufG51bWJlcnxGdW5jdGlvbn1cbiAqL1xuY29uc3QgYW55bWF0Y2ggPSAobWF0Y2hlcnMsIHRlc3RTdHJpbmcsIG9wdGlvbnMgPSBERUZBVUxUX09QVElPTlMpID0+IHtcbiAgaWYgKG1hdGNoZXJzID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhbnltYXRjaDogc3BlY2lmeSBmaXJzdCBhcmd1bWVudCcpO1xuICB9XG4gIGNvbnN0IG9wdHMgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nID8ge3JldHVybkluZGV4OiBvcHRpb25zfSA6IG9wdGlvbnM7XG4gIGNvbnN0IHJldHVybkluZGV4ID0gb3B0cy5yZXR1cm5JbmRleCB8fCBmYWxzZTtcblxuICAvLyBFYXJseSBjYWNoZSBmb3IgbWF0Y2hlcnMuXG4gIGNvbnN0IG10Y2hlcnMgPSBhcnJpZnkobWF0Y2hlcnMpO1xuICBjb25zdCBuZWdhdGVkR2xvYnMgPSBtdGNoZXJzXG4gICAgLmZpbHRlcihpdGVtID0+IHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBpdGVtLmNoYXJBdCgwKSA9PT0gQkFORylcbiAgICAubWFwKGl0ZW0gPT4gaXRlbS5zbGljZSgxKSlcbiAgICAubWFwKGl0ZW0gPT4gcGljb21hdGNoKGl0ZW0sIG9wdHMpKTtcbiAgY29uc3QgcGF0dGVybnMgPSBtdGNoZXJzXG4gICAgLmZpbHRlcihpdGVtID0+IHR5cGVvZiBpdGVtICE9PSAnc3RyaW5nJyB8fCAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICYmIGl0ZW0uY2hhckF0KDApICE9PSBCQU5HKSlcbiAgICAubWFwKG1hdGNoZXIgPT4gY3JlYXRlUGF0dGVybihtYXRjaGVyLCBvcHRzKSk7XG5cbiAgaWYgKHRlc3RTdHJpbmcgPT0gbnVsbCkge1xuICAgIHJldHVybiAodGVzdFN0cmluZywgcmkgPSBmYWxzZSkgPT4ge1xuICAgICAgY29uc3QgcmV0dXJuSW5kZXggPSB0eXBlb2YgcmkgPT09ICdib29sZWFuJyA/IHJpIDogZmFsc2U7XG4gICAgICByZXR1cm4gbWF0Y2hQYXR0ZXJucyhwYXR0ZXJucywgbmVnYXRlZEdsb2JzLCB0ZXN0U3RyaW5nLCByZXR1cm5JbmRleCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoUGF0dGVybnMocGF0dGVybnMsIG5lZ2F0ZWRHbG9icywgdGVzdFN0cmluZywgcmV0dXJuSW5kZXgpO1xufTtcblxuYW55bWF0Y2guZGVmYXVsdCA9IGFueW1hdGNoO1xubW9kdWxlLmV4cG9ydHMgPSBhbnltYXRjaDtcbiIsIi8qIVxuICogaXMtZXh0Z2xvYiA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtZXh0Z2xvYj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNiwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0V4dGdsb2Ioc3RyKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJyB8fCBzdHIgPT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIG1hdGNoO1xuICB3aGlsZSAoKG1hdGNoID0gLyhcXFxcKS58KFtAPyErKl1cXCguKlxcKSkvZy5leGVjKHN0cikpKSB7XG4gICAgaWYgKG1hdGNoWzJdKSByZXR1cm4gdHJ1ZTtcbiAgICBzdHIgPSBzdHIuc2xpY2UobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIi8qIVxuICogaXMtZ2xvYiA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtZ2xvYj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxudmFyIGlzRXh0Z2xvYiA9IHJlcXVpcmUoJ2lzLWV4dGdsb2InKTtcbnZhciBjaGFycyA9IHsgJ3snOiAnfScsICcoJzogJyknLCAnWyc6ICddJ307XG52YXIgc3RyaWN0Q2hlY2sgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHN0clswXSA9PT0gJyEnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIHBpcGVJbmRleCA9IC0yO1xuICB2YXIgY2xvc2VTcXVhcmVJbmRleCA9IC0yO1xuICB2YXIgY2xvc2VDdXJseUluZGV4ID0gLTI7XG4gIHZhciBjbG9zZVBhcmVuSW5kZXggPSAtMjtcbiAgdmFyIGJhY2tTbGFzaEluZGV4ID0gLTI7XG4gIHdoaWxlIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcbiAgICBpZiAoc3RyW2luZGV4XSA9PT0gJyonKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RyW2luZGV4ICsgMV0gPT09ICc/JyAmJiAvW1xcXS4rKV0vLnRlc3Qoc3RyW2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjbG9zZVNxdWFyZUluZGV4ICE9PSAtMSAmJiBzdHJbaW5kZXhdID09PSAnWycgJiYgc3RyW2luZGV4ICsgMV0gIT09ICddJykge1xuICAgICAgaWYgKGNsb3NlU3F1YXJlSW5kZXggPCBpbmRleCkge1xuICAgICAgICBjbG9zZVNxdWFyZUluZGV4ID0gc3RyLmluZGV4T2YoJ10nLCBpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoY2xvc2VTcXVhcmVJbmRleCA+IGluZGV4KSB7XG4gICAgICAgIGlmIChiYWNrU2xhc2hJbmRleCA9PT0gLTEgfHwgYmFja1NsYXNoSW5kZXggPiBjbG9zZVNxdWFyZUluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYmFja1NsYXNoSW5kZXggPSBzdHIuaW5kZXhPZignXFxcXCcsIGluZGV4KTtcbiAgICAgICAgaWYgKGJhY2tTbGFzaEluZGV4ID09PSAtMSB8fCBiYWNrU2xhc2hJbmRleCA+IGNsb3NlU3F1YXJlSW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjbG9zZUN1cmx5SW5kZXggIT09IC0xICYmIHN0cltpbmRleF0gPT09ICd7JyAmJiBzdHJbaW5kZXggKyAxXSAhPT0gJ30nKSB7XG4gICAgICBjbG9zZUN1cmx5SW5kZXggPSBzdHIuaW5kZXhPZignfScsIGluZGV4KTtcbiAgICAgIGlmIChjbG9zZUN1cmx5SW5kZXggPiBpbmRleCkge1xuICAgICAgICBiYWNrU2xhc2hJbmRleCA9IHN0ci5pbmRleE9mKCdcXFxcJywgaW5kZXgpO1xuICAgICAgICBpZiAoYmFja1NsYXNoSW5kZXggPT09IC0xIHx8IGJhY2tTbGFzaEluZGV4ID4gY2xvc2VDdXJseUluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2xvc2VQYXJlbkluZGV4ICE9PSAtMSAmJiBzdHJbaW5kZXhdID09PSAnKCcgJiYgc3RyW2luZGV4ICsgMV0gPT09ICc/JyAmJiAvWzohPV0vLnRlc3Qoc3RyW2luZGV4ICsgMl0pICYmIHN0cltpbmRleCArIDNdICE9PSAnKScpIHtcbiAgICAgIGNsb3NlUGFyZW5JbmRleCA9IHN0ci5pbmRleE9mKCcpJywgaW5kZXgpO1xuICAgICAgaWYgKGNsb3NlUGFyZW5JbmRleCA+IGluZGV4KSB7XG4gICAgICAgIGJhY2tTbGFzaEluZGV4ID0gc3RyLmluZGV4T2YoJ1xcXFwnLCBpbmRleCk7XG4gICAgICAgIGlmIChiYWNrU2xhc2hJbmRleCA9PT0gLTEgfHwgYmFja1NsYXNoSW5kZXggPiBjbG9zZVBhcmVuSW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwaXBlSW5kZXggIT09IC0xICYmIHN0cltpbmRleF0gPT09ICcoJyAmJiBzdHJbaW5kZXggKyAxXSAhPT0gJ3wnKSB7XG4gICAgICBpZiAocGlwZUluZGV4IDwgaW5kZXgpIHtcbiAgICAgICAgcGlwZUluZGV4ID0gc3RyLmluZGV4T2YoJ3wnLCBpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAocGlwZUluZGV4ICE9PSAtMSAmJiBzdHJbcGlwZUluZGV4ICsgMV0gIT09ICcpJykge1xuICAgICAgICBjbG9zZVBhcmVuSW5kZXggPSBzdHIuaW5kZXhPZignKScsIHBpcGVJbmRleCk7XG4gICAgICAgIGlmIChjbG9zZVBhcmVuSW5kZXggPiBwaXBlSW5kZXgpIHtcbiAgICAgICAgICBiYWNrU2xhc2hJbmRleCA9IHN0ci5pbmRleE9mKCdcXFxcJywgcGlwZUluZGV4KTtcbiAgICAgICAgICBpZiAoYmFja1NsYXNoSW5kZXggPT09IC0xIHx8IGJhY2tTbGFzaEluZGV4ID4gY2xvc2VQYXJlbkluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyW2luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICB2YXIgb3BlbiA9IHN0cltpbmRleCArIDFdO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICAgIHZhciBjbG9zZSA9IGNoYXJzW29wZW5dO1xuXG4gICAgICBpZiAoY2xvc2UpIHtcbiAgICAgICAgdmFyIG4gPSBzdHIuaW5kZXhPZihjbG9zZSwgaW5kZXgpO1xuICAgICAgICBpZiAobiAhPT0gLTEpIHtcbiAgICAgICAgICBpbmRleCA9IG4gKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHJbaW5kZXhdID09PSAnIScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZhciByZWxheGVkQ2hlY2sgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHN0clswXSA9PT0gJyEnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIGluZGV4ID0gMDtcbiAgd2hpbGUgKGluZGV4IDwgc3RyLmxlbmd0aCkge1xuICAgIGlmICgvWyo/e30oKVtcXF1dLy50ZXN0KHN0cltpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RyW2luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICB2YXIgb3BlbiA9IHN0cltpbmRleCArIDFdO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICAgIHZhciBjbG9zZSA9IGNoYXJzW29wZW5dO1xuXG4gICAgICBpZiAoY2xvc2UpIHtcbiAgICAgICAgdmFyIG4gPSBzdHIuaW5kZXhPZihjbG9zZSwgaW5kZXgpO1xuICAgICAgICBpZiAobiAhPT0gLTEpIHtcbiAgICAgICAgICBpbmRleCA9IG4gKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHJbaW5kZXhdID09PSAnIScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNHbG9iKHN0ciwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycgfHwgc3RyID09PSAnJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc0V4dGdsb2Ioc3RyKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGNoZWNrID0gc3RyaWN0Q2hlY2s7XG5cbiAgLy8gb3B0aW9uYWxseSByZWxheCBjaGVja1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN0cmljdCA9PT0gZmFsc2UpIHtcbiAgICBjaGVjayA9IHJlbGF4ZWRDaGVjaztcbiAgfVxuXG4gIHJldHVybiBjaGVjayhzdHIpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzR2xvYiA9IHJlcXVpcmUoJ2lzLWdsb2InKTtcbnZhciBwYXRoUG9zaXhEaXJuYW1lID0gcmVxdWlyZSgncGF0aCcpLnBvc2l4LmRpcm5hbWU7XG52YXIgaXNXaW4zMiA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJztcblxudmFyIHNsYXNoID0gJy8nO1xudmFyIGJhY2tzbGFzaCA9IC9cXFxcL2c7XG52YXIgZW5jbG9zdXJlID0gL1tcXHtcXFtdLipbXFx9XFxdXSQvO1xudmFyIGdsb2JieSA9IC8oXnxbXlxcXFxdKShbXFx7XFxbXXxcXChbXlxcKV0rJCkvO1xudmFyIGVzY2FwZWQgPSAvXFxcXChbXFwhXFwqXFw/XFx8XFxbXFxdXFwoXFwpXFx7XFx9XSkvZztcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5mbGlwQmFja3NsYXNoZXM9dHJ1ZV1cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2xvYlBhcmVudChzdHIsIG9wdHMpIHtcbiAgdmFyIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZmxpcEJhY2tzbGFzaGVzOiB0cnVlIH0sIG9wdHMpO1xuXG4gIC8vIGZsaXAgd2luZG93cyBwYXRoIHNlcGFyYXRvcnNcbiAgaWYgKG9wdGlvbnMuZmxpcEJhY2tzbGFzaGVzICYmIGlzV2luMzIgJiYgc3RyLmluZGV4T2Yoc2xhc2gpIDwgMCkge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKGJhY2tzbGFzaCwgc2xhc2gpO1xuICB9XG5cbiAgLy8gc3BlY2lhbCBjYXNlIGZvciBzdHJpbmdzIGVuZGluZyBpbiBlbmNsb3N1cmUgY29udGFpbmluZyBwYXRoIHNlcGFyYXRvclxuICBpZiAoZW5jbG9zdXJlLnRlc3Qoc3RyKSkge1xuICAgIHN0ciArPSBzbGFzaDtcbiAgfVxuXG4gIC8vIHByZXNlcnZlcyBmdWxsIHBhdGggaW4gY2FzZSBvZiB0cmFpbGluZyBwYXRoIHNlcGFyYXRvclxuICBzdHIgKz0gJ2EnO1xuXG4gIC8vIHJlbW92ZSBwYXRoIHBhcnRzIHRoYXQgYXJlIGdsb2JieVxuICBkbyB7XG4gICAgc3RyID0gcGF0aFBvc2l4RGlybmFtZShzdHIpO1xuICB9IHdoaWxlIChpc0dsb2Ioc3RyKSB8fCBnbG9iYnkudGVzdChzdHIpKTtcblxuICAvLyByZW1vdmUgZXNjYXBlIGNoYXJzIGFuZCByZXR1cm4gcmVzdWx0XG4gIHJldHVybiBzdHIucmVwbGFjZShlc2NhcGVkLCAnJDEnKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuaXNJbnRlZ2VyID0gbnVtID0+IHtcbiAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobnVtKTtcbiAgfVxuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycgJiYgbnVtLnRyaW0oKSAhPT0gJycpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihOdW1iZXIobnVtKSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBGaW5kIGEgbm9kZSBvZiB0aGUgZ2l2ZW4gdHlwZVxuICovXG5cbmV4cG9ydHMuZmluZCA9IChub2RlLCB0eXBlKSA9PiBub2RlLm5vZGVzLmZpbmQobm9kZSA9PiBub2RlLnR5cGUgPT09IHR5cGUpO1xuXG4vKipcbiAqIEZpbmQgYSBub2RlIG9mIHRoZSBnaXZlbiB0eXBlXG4gKi9cblxuZXhwb3J0cy5leGNlZWRzTGltaXQgPSAobWluLCBtYXgsIHN0ZXAgPSAxLCBsaW1pdCkgPT4ge1xuICBpZiAobGltaXQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gIGlmICghZXhwb3J0cy5pc0ludGVnZXIobWluKSB8fCAhZXhwb3J0cy5pc0ludGVnZXIobWF4KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKChOdW1iZXIobWF4KSAtIE51bWJlcihtaW4pKSAvIE51bWJlcihzdGVwKSkgPj0gbGltaXQ7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gbm9kZSB3aXRoICdcXFxcJyBiZWZvcmUgbm9kZS52YWx1ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlTm9kZSA9IChibG9jaywgbiA9IDAsIHR5cGUpID0+IHtcbiAgbGV0IG5vZGUgPSBibG9jay5ub2Rlc1tuXTtcbiAgaWYgKCFub2RlKSByZXR1cm47XG5cbiAgaWYgKCh0eXBlICYmIG5vZGUudHlwZSA9PT0gdHlwZSkgfHwgbm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgaWYgKG5vZGUuZXNjYXBlZCAhPT0gdHJ1ZSkge1xuICAgICAgbm9kZS52YWx1ZSA9ICdcXFxcJyArIG5vZGUudmFsdWU7XG4gICAgICBub2RlLmVzY2FwZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGJyYWNlIG5vZGUgc2hvdWxkIGJlIGVuY2xvc2VkIGluIGxpdGVyYWwgYnJhY2VzXG4gKi9cblxuZXhwb3J0cy5lbmNsb3NlQnJhY2UgPSBub2RlID0+IHtcbiAgaWYgKG5vZGUudHlwZSAhPT0gJ2JyYWNlJykgcmV0dXJuIGZhbHNlO1xuICBpZiAoKG5vZGUuY29tbWFzID4+IDAgKyBub2RlLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIG5vZGUuaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBicmFjZSBub2RlIGlzIGludmFsaWQuXG4gKi9cblxuZXhwb3J0cy5pc0ludmFsaWRCcmFjZSA9IGJsb2NrID0+IHtcbiAgaWYgKGJsb2NrLnR5cGUgIT09ICdicmFjZScpIHJldHVybiBmYWxzZTtcbiAgaWYgKGJsb2NrLmludmFsaWQgPT09IHRydWUgfHwgYmxvY2suZG9sbGFyKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKChibG9jay5jb21tYXMgPj4gMCArIGJsb2NrLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIGJsb2NrLmludmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChibG9jay5vcGVuICE9PSB0cnVlIHx8IGJsb2NrLmNsb3NlICE9PSB0cnVlKSB7XG4gICAgYmxvY2suaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBub2RlIGlzIGFuIG9wZW4gb3IgY2xvc2Ugbm9kZVxuICovXG5cbmV4cG9ydHMuaXNPcGVuT3JDbG9zZSA9IG5vZGUgPT4ge1xuICBpZiAobm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIG5vZGUub3BlbiA9PT0gdHJ1ZSB8fCBub2RlLmNsb3NlID09PSB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWR1Y2UgYW4gYXJyYXkgb2YgdGV4dCBub2Rlcy5cbiAqL1xuXG5leHBvcnRzLnJlZHVjZSA9IG5vZGVzID0+IG5vZGVzLnJlZHVjZSgoYWNjLCBub2RlKSA9PiB7XG4gIGlmIChub2RlLnR5cGUgPT09ICd0ZXh0JykgYWNjLnB1c2gobm9kZS52YWx1ZSk7XG4gIGlmIChub2RlLnR5cGUgPT09ICdyYW5nZScpIG5vZGUudHlwZSA9ICd0ZXh0JztcbiAgcmV0dXJuIGFjYztcbn0sIFtdKTtcblxuLyoqXG4gKiBGbGF0dGVuIGFuIGFycmF5XG4gKi9cblxuZXhwb3J0cy5mbGF0dGVuID0gKC4uLmFyZ3MpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGNvbnN0IGZsYXQgPSBhcnIgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZWxlID0gYXJyW2ldO1xuICAgICAgQXJyYXkuaXNBcnJheShlbGUpID8gZmxhdChlbGUsIHJlc3VsdCkgOiBlbGUgIT09IHZvaWQgMCAmJiByZXN1bHQucHVzaChlbGUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBmbGF0KGFyZ3MpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGFzdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCBzdHJpbmdpZnkgPSAobm9kZSwgcGFyZW50ID0ge30pID0+IHtcbiAgICBsZXQgaW52YWxpZEJsb2NrID0gb3B0aW9ucy5lc2NhcGVJbnZhbGlkICYmIHV0aWxzLmlzSW52YWxpZEJyYWNlKHBhcmVudCk7XG4gICAgbGV0IGludmFsaWROb2RlID0gbm9kZS5pbnZhbGlkID09PSB0cnVlICYmIG9wdGlvbnMuZXNjYXBlSW52YWxpZCA9PT0gdHJ1ZTtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICBpZiAobm9kZS52YWx1ZSkge1xuICAgICAgaWYgKChpbnZhbGlkQmxvY2sgfHwgaW52YWxpZE5vZGUpICYmIHV0aWxzLmlzT3Blbk9yQ2xvc2Uobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuICdcXFxcJyArIG5vZGUudmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZS52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS52YWx1ZSkge1xuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZXMpIHtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIG5vZGUubm9kZXMpIHtcbiAgICAgICAgb3V0cHV0ICs9IHN0cmluZ2lmeShjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShhc3QpO1xufTtcblxuIiwiLyohXG4gKiBpcy1udW1iZXIgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLW51bWJlcj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG51bSkge1xuICBpZiAodHlwZW9mIG51bSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbnVtIC0gbnVtID09PSAwO1xuICB9XG4gIGlmICh0eXBlb2YgbnVtID09PSAnc3RyaW5nJyAmJiBudW0udHJpbSgpICE9PSAnJykge1xuICAgIHJldHVybiBOdW1iZXIuaXNGaW5pdGUgPyBOdW1iZXIuaXNGaW5pdGUoK251bSkgOiBpc0Zpbml0ZSgrbnVtKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLyohXG4gKiB0by1yZWdleC1yYW5nZSA8aHR0cHM6Ly9naXRodWIuY29tL21pY3JvbWF0Y2gvdG8tcmVnZXgtcmFuZ2U+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNOdW1iZXIgPSByZXF1aXJlKCdpcy1udW1iZXInKTtcblxuY29uc3QgdG9SZWdleFJhbmdlID0gKG1pbiwgbWF4LCBvcHRpb25zKSA9PiB7XG4gIGlmIChpc051bWJlcihtaW4pID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RvUmVnZXhSYW5nZTogZXhwZWN0ZWQgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICBpZiAobWF4ID09PSB2b2lkIDAgfHwgbWluID09PSBtYXgpIHtcbiAgICByZXR1cm4gU3RyaW5nKG1pbik7XG4gIH1cblxuICBpZiAoaXNOdW1iZXIobWF4KSA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0b1JlZ2V4UmFuZ2U6IGV4cGVjdGVkIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSBudW1iZXIuJyk7XG4gIH1cblxuICBsZXQgb3B0cyA9IHsgcmVsYXhaZXJvczogdHJ1ZSwgLi4ub3B0aW9ucyB9O1xuICBpZiAodHlwZW9mIG9wdHMuc3RyaWN0WmVyb3MgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMucmVsYXhaZXJvcyA9IG9wdHMuc3RyaWN0WmVyb3MgPT09IGZhbHNlO1xuICB9XG5cbiAgbGV0IHJlbGF4ID0gU3RyaW5nKG9wdHMucmVsYXhaZXJvcyk7XG4gIGxldCBzaG9ydGhhbmQgPSBTdHJpbmcob3B0cy5zaG9ydGhhbmQpO1xuICBsZXQgY2FwdHVyZSA9IFN0cmluZyhvcHRzLmNhcHR1cmUpO1xuICBsZXQgd3JhcCA9IFN0cmluZyhvcHRzLndyYXApO1xuICBsZXQgY2FjaGVLZXkgPSBtaW4gKyAnOicgKyBtYXggKyAnPScgKyByZWxheCArIHNob3J0aGFuZCArIGNhcHR1cmUgKyB3cmFwO1xuXG4gIGlmICh0b1JlZ2V4UmFuZ2UuY2FjaGUuaGFzT3duUHJvcGVydHkoY2FjaGVLZXkpKSB7XG4gICAgcmV0dXJuIHRvUmVnZXhSYW5nZS5jYWNoZVtjYWNoZUtleV0ucmVzdWx0O1xuICB9XG5cbiAgbGV0IGEgPSBNYXRoLm1pbihtaW4sIG1heCk7XG4gIGxldCBiID0gTWF0aC5tYXgobWluLCBtYXgpO1xuXG4gIGlmIChNYXRoLmFicyhhIC0gYikgPT09IDEpIHtcbiAgICBsZXQgcmVzdWx0ID0gbWluICsgJ3wnICsgbWF4O1xuICAgIGlmIChvcHRzLmNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBgKCR7cmVzdWx0fSlgO1xuICAgIH1cbiAgICBpZiAob3B0cy53cmFwID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIGAoPzoke3Jlc3VsdH0pYDtcbiAgfVxuXG4gIGxldCBpc1BhZGRlZCA9IGhhc1BhZGRpbmcobWluKSB8fCBoYXNQYWRkaW5nKG1heCk7XG4gIGxldCBzdGF0ZSA9IHsgbWluLCBtYXgsIGEsIGIgfTtcbiAgbGV0IHBvc2l0aXZlcyA9IFtdO1xuICBsZXQgbmVnYXRpdmVzID0gW107XG5cbiAgaWYgKGlzUGFkZGVkKSB7XG4gICAgc3RhdGUuaXNQYWRkZWQgPSBpc1BhZGRlZDtcbiAgICBzdGF0ZS5tYXhMZW4gPSBTdHJpbmcoc3RhdGUubWF4KS5sZW5ndGg7XG4gIH1cblxuICBpZiAoYSA8IDApIHtcbiAgICBsZXQgbmV3TWluID0gYiA8IDAgPyBNYXRoLmFicyhiKSA6IDE7XG4gICAgbmVnYXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKG5ld01pbiwgTWF0aC5hYnMoYSksIHN0YXRlLCBvcHRzKTtcbiAgICBhID0gc3RhdGUuYSA9IDA7XG4gIH1cblxuICBpZiAoYiA+PSAwKSB7XG4gICAgcG9zaXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKGEsIGIsIHN0YXRlLCBvcHRzKTtcbiAgfVxuXG4gIHN0YXRlLm5lZ2F0aXZlcyA9IG5lZ2F0aXZlcztcbiAgc3RhdGUucG9zaXRpdmVzID0gcG9zaXRpdmVzO1xuICBzdGF0ZS5yZXN1bHQgPSBjb2xsYXRlUGF0dGVybnMobmVnYXRpdmVzLCBwb3NpdGl2ZXMsIG9wdHMpO1xuXG4gIGlmIChvcHRzLmNhcHR1cmUgPT09IHRydWUpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKCR7c3RhdGUucmVzdWx0fSlgO1xuICB9IGVsc2UgaWYgKG9wdHMud3JhcCAhPT0gZmFsc2UgJiYgKHBvc2l0aXZlcy5sZW5ndGggKyBuZWdhdGl2ZXMubGVuZ3RoKSA+IDEpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKD86JHtzdGF0ZS5yZXN1bHR9KWA7XG4gIH1cblxuICB0b1JlZ2V4UmFuZ2UuY2FjaGVbY2FjaGVLZXldID0gc3RhdGU7XG4gIHJldHVybiBzdGF0ZS5yZXN1bHQ7XG59O1xuXG5mdW5jdGlvbiBjb2xsYXRlUGF0dGVybnMobmVnLCBwb3MsIG9wdGlvbnMpIHtcbiAgbGV0IG9ubHlOZWdhdGl2ZSA9IGZpbHRlclBhdHRlcm5zKG5lZywgcG9zLCAnLScsIGZhbHNlLCBvcHRpb25zKSB8fCBbXTtcbiAgbGV0IG9ubHlQb3NpdGl2ZSA9IGZpbHRlclBhdHRlcm5zKHBvcywgbmVnLCAnJywgZmFsc2UsIG9wdGlvbnMpIHx8IFtdO1xuICBsZXQgaW50ZXJzZWN0ZWQgPSBmaWx0ZXJQYXR0ZXJucyhuZWcsIHBvcywgJy0/JywgdHJ1ZSwgb3B0aW9ucykgfHwgW107XG4gIGxldCBzdWJwYXR0ZXJucyA9IG9ubHlOZWdhdGl2ZS5jb25jYXQoaW50ZXJzZWN0ZWQpLmNvbmNhdChvbmx5UG9zaXRpdmUpO1xuICByZXR1cm4gc3VicGF0dGVybnMuam9pbignfCcpO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUmFuZ2VzKG1pbiwgbWF4KSB7XG4gIGxldCBuaW5lcyA9IDE7XG4gIGxldCB6ZXJvcyA9IDE7XG5cbiAgbGV0IHN0b3AgPSBjb3VudE5pbmVzKG1pbiwgbmluZXMpO1xuICBsZXQgc3RvcHMgPSBuZXcgU2V0KFttYXhdKTtcblxuICB3aGlsZSAobWluIDw9IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgbmluZXMgKz0gMTtcbiAgICBzdG9wID0gY291bnROaW5lcyhtaW4sIG5pbmVzKTtcbiAgfVxuXG4gIHN0b3AgPSBjb3VudFplcm9zKG1heCArIDEsIHplcm9zKSAtIDE7XG5cbiAgd2hpbGUgKG1pbiA8IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgemVyb3MgKz0gMTtcbiAgICBzdG9wID0gY291bnRaZXJvcyhtYXggKyAxLCB6ZXJvcykgLSAxO1xuICB9XG5cbiAgc3RvcHMgPSBbLi4uc3RvcHNdO1xuICBzdG9wcy5zb3J0KGNvbXBhcmUpO1xuICByZXR1cm4gc3RvcHM7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJhbmdlIHRvIGEgcmVnZXggcGF0dGVyblxuICogQHBhcmFtIHtOdW1iZXJ9IGBzdGFydGBcbiAqIEBwYXJhbSB7TnVtYmVyfSBgc3RvcGBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByYW5nZVRvUGF0dGVybihzdGFydCwgc3RvcCwgb3B0aW9ucykge1xuICBpZiAoc3RhcnQgPT09IHN0b3ApIHtcbiAgICByZXR1cm4geyBwYXR0ZXJuOiBzdGFydCwgY291bnQ6IFtdLCBkaWdpdHM6IDAgfTtcbiAgfVxuXG4gIGxldCB6aXBwZWQgPSB6aXAoc3RhcnQsIHN0b3ApO1xuICBsZXQgZGlnaXRzID0gemlwcGVkLmxlbmd0aDtcbiAgbGV0IHBhdHRlcm4gPSAnJztcbiAgbGV0IGNvdW50ID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZ2l0czsgaSsrKSB7XG4gICAgbGV0IFtzdGFydERpZ2l0LCBzdG9wRGlnaXRdID0gemlwcGVkW2ldO1xuXG4gICAgaWYgKHN0YXJ0RGlnaXQgPT09IHN0b3BEaWdpdCkge1xuICAgICAgcGF0dGVybiArPSBzdGFydERpZ2l0O1xuXG4gICAgfSBlbHNlIGlmIChzdGFydERpZ2l0ICE9PSAnMCcgfHwgc3RvcERpZ2l0ICE9PSAnOScpIHtcbiAgICAgIHBhdHRlcm4gKz0gdG9DaGFyYWN0ZXJDbGFzcyhzdGFydERpZ2l0LCBzdG9wRGlnaXQsIG9wdGlvbnMpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvdW50KSB7XG4gICAgcGF0dGVybiArPSBvcHRpb25zLnNob3J0aGFuZCA9PT0gdHJ1ZSA/ICdcXFxcZCcgOiAnWzAtOV0nO1xuICB9XG5cbiAgcmV0dXJuIHsgcGF0dGVybiwgY291bnQ6IFtjb3VudF0sIGRpZ2l0cyB9O1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUGF0dGVybnMobWluLCBtYXgsIHRvaywgb3B0aW9ucykge1xuICBsZXQgcmFuZ2VzID0gc3BsaXRUb1JhbmdlcyhtaW4sIG1heCk7XG4gIGxldCB0b2tlbnMgPSBbXTtcbiAgbGV0IHN0YXJ0ID0gbWluO1xuICBsZXQgcHJldjtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBtYXggPSByYW5nZXNbaV07XG4gICAgbGV0IG9iaiA9IHJhbmdlVG9QYXR0ZXJuKFN0cmluZyhzdGFydCksIFN0cmluZyhtYXgpLCBvcHRpb25zKTtcbiAgICBsZXQgemVyb3MgPSAnJztcblxuICAgIGlmICghdG9rLmlzUGFkZGVkICYmIHByZXYgJiYgcHJldi5wYXR0ZXJuID09PSBvYmoucGF0dGVybikge1xuICAgICAgaWYgKHByZXYuY291bnQubGVuZ3RoID4gMSkge1xuICAgICAgICBwcmV2LmNvdW50LnBvcCgpO1xuICAgICAgfVxuXG4gICAgICBwcmV2LmNvdW50LnB1c2gob2JqLmNvdW50WzBdKTtcbiAgICAgIHByZXYuc3RyaW5nID0gcHJldi5wYXR0ZXJuICsgdG9RdWFudGlmaWVyKHByZXYuY291bnQpO1xuICAgICAgc3RhcnQgPSBtYXggKyAxO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHRvay5pc1BhZGRlZCkge1xuICAgICAgemVyb3MgPSBwYWRaZXJvcyhtYXgsIHRvaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgb2JqLnN0cmluZyA9IHplcm9zICsgb2JqLnBhdHRlcm4gKyB0b1F1YW50aWZpZXIob2JqLmNvdW50KTtcbiAgICB0b2tlbnMucHVzaChvYmopO1xuICAgIHN0YXJ0ID0gbWF4ICsgMTtcbiAgICBwcmV2ID0gb2JqO1xuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cblxuZnVuY3Rpb24gZmlsdGVyUGF0dGVybnMoYXJyLCBjb21wYXJpc29uLCBwcmVmaXgsIGludGVyc2VjdGlvbiwgb3B0aW9ucykge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgZm9yIChsZXQgZWxlIG9mIGFycikge1xuICAgIGxldCB7IHN0cmluZyB9ID0gZWxlO1xuXG4gICAgLy8gb25seSBwdXNoIGlmIF9ib3RoXyBhcmUgbmVnYXRpdmUuLi5cbiAgICBpZiAoIWludGVyc2VjdGlvbiAmJiAhY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gb3IgX2JvdGhfIGFyZSBwb3NpdGl2ZVxuICAgIGlmIChpbnRlcnNlY3Rpb24gJiYgY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogWmlwIHN0cmluZ3NcbiAqL1xuXG5mdW5jdGlvbiB6aXAoYSwgYikge1xuICBsZXQgYXJyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykgYXJyLnB1c2goW2FbaV0sIGJbaV1dKTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIHJldHVybiBhID4gYiA/IDEgOiBiID4gYSA/IC0xIDogMDtcbn1cblxuZnVuY3Rpb24gY29udGFpbnMoYXJyLCBrZXksIHZhbCkge1xuICByZXR1cm4gYXJyLnNvbWUoZWxlID0+IGVsZVtrZXldID09PSB2YWwpO1xufVxuXG5mdW5jdGlvbiBjb3VudE5pbmVzKG1pbiwgbGVuKSB7XG4gIHJldHVybiBOdW1iZXIoU3RyaW5nKG1pbikuc2xpY2UoMCwgLWxlbikgKyAnOScucmVwZWF0KGxlbikpO1xufVxuXG5mdW5jdGlvbiBjb3VudFplcm9zKGludGVnZXIsIHplcm9zKSB7XG4gIHJldHVybiBpbnRlZ2VyIC0gKGludGVnZXIgJSBNYXRoLnBvdygxMCwgemVyb3MpKTtcbn1cblxuZnVuY3Rpb24gdG9RdWFudGlmaWVyKGRpZ2l0cykge1xuICBsZXQgW3N0YXJ0ID0gMCwgc3RvcCA9ICcnXSA9IGRpZ2l0cztcbiAgaWYgKHN0b3AgfHwgc3RhcnQgPiAxKSB7XG4gICAgcmV0dXJuIGB7JHtzdGFydCArIChzdG9wID8gJywnICsgc3RvcCA6ICcnKX19YDtcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIHRvQ2hhcmFjdGVyQ2xhc3MoYSwgYiwgb3B0aW9ucykge1xuICByZXR1cm4gYFske2F9JHsoYiAtIGEgPT09IDEpID8gJycgOiAnLSd9JHtifV1gO1xufVxuXG5mdW5jdGlvbiBoYXNQYWRkaW5nKHN0cikge1xuICByZXR1cm4gL14tPygwKylcXGQvLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gcGFkWmVyb3ModmFsdWUsIHRvaywgb3B0aW9ucykge1xuICBpZiAoIXRvay5pc1BhZGRlZCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGxldCBkaWZmID0gTWF0aC5hYnModG9rLm1heExlbiAtIFN0cmluZyh2YWx1ZSkubGVuZ3RoKTtcbiAgbGV0IHJlbGF4ID0gb3B0aW9ucy5yZWxheFplcm9zICE9PSBmYWxzZTtcblxuICBzd2l0Y2ggKGRpZmYpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHJlbGF4ID8gJzA/JyA6ICcwJztcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gcmVsYXggPyAnMHswLDJ9JyA6ICcwMCc7XG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuIHJlbGF4ID8gYDB7MCwke2RpZmZ9fWAgOiBgMHske2RpZmZ9fWA7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FjaGVcbiAqL1xuXG50b1JlZ2V4UmFuZ2UuY2FjaGUgPSB7fTtcbnRvUmVnZXhSYW5nZS5jbGVhckNhY2hlID0gKCkgPT4gKHRvUmVnZXhSYW5nZS5jYWNoZSA9IHt9KTtcblxuLyoqXG4gKiBFeHBvc2UgYHRvUmVnZXhSYW5nZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUmVnZXhSYW5nZTtcbiIsIi8qIVxuICogZmlsbC1yYW5nZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvZmlsbC1yYW5nZT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgdG9SZWdleFJhbmdlID0gcmVxdWlyZSgndG8tcmVnZXgtcmFuZ2UnKTtcblxuY29uc3QgaXNPYmplY3QgPSB2YWwgPT4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbCk7XG5cbmNvbnN0IHRyYW5zZm9ybSA9IHRvTnVtYmVyID0+IHtcbiAgcmV0dXJuIHZhbHVlID0+IHRvTnVtYmVyID09PSB0cnVlID8gTnVtYmVyKHZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG59O1xuXG5jb25zdCBpc1ZhbGlkVmFsdWUgPSB2YWx1ZSA9PiB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8ICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlICE9PSAnJyk7XG59O1xuXG5jb25zdCBpc051bWJlciA9IG51bSA9PiBOdW1iZXIuaXNJbnRlZ2VyKCtudW0pO1xuXG5jb25zdCB6ZXJvcyA9IGlucHV0ID0+IHtcbiAgbGV0IHZhbHVlID0gYCR7aW5wdXR9YDtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGlmICh2YWx1ZVswXSA9PT0gJy0nKSB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEpO1xuICBpZiAodmFsdWUgPT09ICcwJykgcmV0dXJuIGZhbHNlO1xuICB3aGlsZSAodmFsdWVbKytpbmRleF0gPT09ICcwJyk7XG4gIHJldHVybiBpbmRleCA+IDA7XG59O1xuXG5jb25zdCBzdHJpbmdpZnkgPSAoc3RhcnQsIGVuZCwgb3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBvcHRpb25zLnN0cmluZ2lmeSA9PT0gdHJ1ZTtcbn07XG5cbmNvbnN0IHBhZCA9IChpbnB1dCwgbWF4TGVuZ3RoLCB0b051bWJlcikgPT4ge1xuICBpZiAobWF4TGVuZ3RoID4gMCkge1xuICAgIGxldCBkYXNoID0gaW5wdXRbMF0gPT09ICctJyA/ICctJyA6ICcnO1xuICAgIGlmIChkYXNoKSBpbnB1dCA9IGlucHV0LnNsaWNlKDEpO1xuICAgIGlucHV0ID0gKGRhc2ggKyBpbnB1dC5wYWRTdGFydChkYXNoID8gbWF4TGVuZ3RoIC0gMSA6IG1heExlbmd0aCwgJzAnKSk7XG4gIH1cbiAgaWYgKHRvTnVtYmVyID09PSBmYWxzZSkge1xuICAgIHJldHVybiBTdHJpbmcoaW5wdXQpO1xuICB9XG4gIHJldHVybiBpbnB1dDtcbn07XG5cbmNvbnN0IHRvTWF4TGVuID0gKGlucHV0LCBtYXhMZW5ndGgpID0+IHtcbiAgbGV0IG5lZ2F0aXZlID0gaW5wdXRbMF0gPT09ICctJyA/ICctJyA6ICcnO1xuICBpZiAobmVnYXRpdmUpIHtcbiAgICBpbnB1dCA9IGlucHV0LnNsaWNlKDEpO1xuICAgIG1heExlbmd0aC0tO1xuICB9XG4gIHdoaWxlIChpbnB1dC5sZW5ndGggPCBtYXhMZW5ndGgpIGlucHV0ID0gJzAnICsgaW5wdXQ7XG4gIHJldHVybiBuZWdhdGl2ZSA/ICgnLScgKyBpbnB1dCkgOiBpbnB1dDtcbn07XG5cbmNvbnN0IHRvU2VxdWVuY2UgPSAocGFydHMsIG9wdGlvbnMpID0+IHtcbiAgcGFydHMubmVnYXRpdmVzLnNvcnQoKGEsIGIpID0+IGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwKTtcbiAgcGFydHMucG9zaXRpdmVzLnNvcnQoKGEsIGIpID0+IGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwKTtcblxuICBsZXQgcHJlZml4ID0gb3B0aW9ucy5jYXB0dXJlID8gJycgOiAnPzonO1xuICBsZXQgcG9zaXRpdmVzID0gJyc7XG4gIGxldCBuZWdhdGl2ZXMgPSAnJztcbiAgbGV0IHJlc3VsdDtcblxuICBpZiAocGFydHMucG9zaXRpdmVzLmxlbmd0aCkge1xuICAgIHBvc2l0aXZlcyA9IHBhcnRzLnBvc2l0aXZlcy5qb2luKCd8Jyk7XG4gIH1cblxuICBpZiAocGFydHMubmVnYXRpdmVzLmxlbmd0aCkge1xuICAgIG5lZ2F0aXZlcyA9IGAtKCR7cHJlZml4fSR7cGFydHMubmVnYXRpdmVzLmpvaW4oJ3wnKX0pYDtcbiAgfVxuXG4gIGlmIChwb3NpdGl2ZXMgJiYgbmVnYXRpdmVzKSB7XG4gICAgcmVzdWx0ID0gYCR7cG9zaXRpdmVzfXwke25lZ2F0aXZlc31gO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHBvc2l0aXZlcyB8fCBuZWdhdGl2ZXM7XG4gIH1cblxuICBpZiAob3B0aW9ucy53cmFwKSB7XG4gICAgcmV0dXJuIGAoJHtwcmVmaXh9JHtyZXN1bHR9KWA7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgdG9SYW5nZSA9IChhLCBiLCBpc051bWJlcnMsIG9wdGlvbnMpID0+IHtcbiAgaWYgKGlzTnVtYmVycykge1xuICAgIHJldHVybiB0b1JlZ2V4UmFuZ2UoYSwgYiwgeyB3cmFwOiBmYWxzZSwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIGxldCBzdGFydCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYSk7XG4gIGlmIChhID09PSBiKSByZXR1cm4gc3RhcnQ7XG5cbiAgbGV0IHN0b3AgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGIpO1xuICByZXR1cm4gYFske3N0YXJ0fS0ke3N0b3B9XWA7XG59O1xuXG5jb25zdCB0b1JlZ2V4ID0gKHN0YXJ0LCBlbmQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RhcnQpKSB7XG4gICAgbGV0IHdyYXAgPSBvcHRpb25zLndyYXAgPT09IHRydWU7XG4gICAgbGV0IHByZWZpeCA9IG9wdGlvbnMuY2FwdHVyZSA/ICcnIDogJz86JztcbiAgICByZXR1cm4gd3JhcCA/IGAoJHtwcmVmaXh9JHtzdGFydC5qb2luKCd8Jyl9KWAgOiBzdGFydC5qb2luKCd8Jyk7XG4gIH1cbiAgcmV0dXJuIHRvUmVnZXhSYW5nZShzdGFydCwgZW5kLCBvcHRpb25zKTtcbn07XG5cbmNvbnN0IHJhbmdlRXJyb3IgPSAoLi4uYXJncykgPT4ge1xuICByZXR1cm4gbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgcmFuZ2UgYXJndW1lbnRzOiAnICsgdXRpbC5pbnNwZWN0KC4uLmFyZ3MpKTtcbn07XG5cbmNvbnN0IGludmFsaWRSYW5nZSA9IChzdGFydCwgZW5kLCBvcHRpb25zKSA9PiB7XG4gIGlmIChvcHRpb25zLnN0cmljdFJhbmdlcyA9PT0gdHJ1ZSkgdGhyb3cgcmFuZ2VFcnJvcihbc3RhcnQsIGVuZF0pO1xuICByZXR1cm4gW107XG59O1xuXG5jb25zdCBpbnZhbGlkU3RlcCA9IChzdGVwLCBvcHRpb25zKSA9PiB7XG4gIGlmIChvcHRpb25zLnN0cmljdFJhbmdlcyA9PT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIHN0ZXAgXCIke3N0ZXB9XCIgdG8gYmUgYSBudW1iZXJgKTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5jb25zdCBmaWxsTnVtYmVycyA9IChzdGFydCwgZW5kLCBzdGVwID0gMSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCBhID0gTnVtYmVyKHN0YXJ0KTtcbiAgbGV0IGIgPSBOdW1iZXIoZW5kKTtcblxuICBpZiAoIU51bWJlci5pc0ludGVnZXIoYSkgfHwgIU51bWJlci5pc0ludGVnZXIoYikpIHtcbiAgICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHRocm93IHJhbmdlRXJyb3IoW3N0YXJ0LCBlbmRdKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBmaXggbmVnYXRpdmUgemVyb1xuICBpZiAoYSA9PT0gMCkgYSA9IDA7XG4gIGlmIChiID09PSAwKSBiID0gMDtcblxuICBsZXQgZGVzY2VuZGluZyA9IGEgPiBiO1xuICBsZXQgc3RhcnRTdHJpbmcgPSBTdHJpbmcoc3RhcnQpO1xuICBsZXQgZW5kU3RyaW5nID0gU3RyaW5nKGVuZCk7XG4gIGxldCBzdGVwU3RyaW5nID0gU3RyaW5nKHN0ZXApO1xuICBzdGVwID0gTWF0aC5tYXgoTWF0aC5hYnMoc3RlcCksIDEpO1xuXG4gIGxldCBwYWRkZWQgPSB6ZXJvcyhzdGFydFN0cmluZykgfHwgemVyb3MoZW5kU3RyaW5nKSB8fCB6ZXJvcyhzdGVwU3RyaW5nKTtcbiAgbGV0IG1heExlbiA9IHBhZGRlZCA/IE1hdGgubWF4KHN0YXJ0U3RyaW5nLmxlbmd0aCwgZW5kU3RyaW5nLmxlbmd0aCwgc3RlcFN0cmluZy5sZW5ndGgpIDogMDtcbiAgbGV0IHRvTnVtYmVyID0gcGFkZGVkID09PSBmYWxzZSAmJiBzdHJpbmdpZnkoc3RhcnQsIGVuZCwgb3B0aW9ucykgPT09IGZhbHNlO1xuICBsZXQgZm9ybWF0ID0gb3B0aW9ucy50cmFuc2Zvcm0gfHwgdHJhbnNmb3JtKHRvTnVtYmVyKTtcblxuICBpZiAob3B0aW9ucy50b1JlZ2V4ICYmIHN0ZXAgPT09IDEpIHtcbiAgICByZXR1cm4gdG9SYW5nZSh0b01heExlbihzdGFydCwgbWF4TGVuKSwgdG9NYXhMZW4oZW5kLCBtYXhMZW4pLCB0cnVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGxldCBwYXJ0cyA9IHsgbmVnYXRpdmVzOiBbXSwgcG9zaXRpdmVzOiBbXSB9O1xuICBsZXQgcHVzaCA9IG51bSA9PiBwYXJ0c1tudW0gPCAwID8gJ25lZ2F0aXZlcycgOiAncG9zaXRpdmVzJ10ucHVzaChNYXRoLmFicyhudW0pKTtcbiAgbGV0IHJhbmdlID0gW107XG4gIGxldCBpbmRleCA9IDA7XG5cbiAgd2hpbGUgKGRlc2NlbmRpbmcgPyBhID49IGIgOiBhIDw9IGIpIHtcbiAgICBpZiAob3B0aW9ucy50b1JlZ2V4ID09PSB0cnVlICYmIHN0ZXAgPiAxKSB7XG4gICAgICBwdXNoKGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZS5wdXNoKHBhZChmb3JtYXQoYSwgaW5kZXgpLCBtYXhMZW4sIHRvTnVtYmVyKSk7XG4gICAgfVxuICAgIGEgPSBkZXNjZW5kaW5nID8gYSAtIHN0ZXAgOiBhICsgc3RlcDtcbiAgICBpbmRleCsrO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMudG9SZWdleCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBzdGVwID4gMVxuICAgICAgPyB0b1NlcXVlbmNlKHBhcnRzLCBvcHRpb25zKVxuICAgICAgOiB0b1JlZ2V4KHJhbmdlLCBudWxsLCB7IHdyYXA6IGZhbHNlLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuY29uc3QgZmlsbExldHRlcnMgPSAoc3RhcnQsIGVuZCwgc3RlcCA9IDEsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAoKCFpc051bWJlcihzdGFydCkgJiYgc3RhcnQubGVuZ3RoID4gMSkgfHwgKCFpc051bWJlcihlbmQpICYmIGVuZC5sZW5ndGggPiAxKSkge1xuICAgIHJldHVybiBpbnZhbGlkUmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG4gIH1cblxuXG4gIGxldCBmb3JtYXQgPSBvcHRpb25zLnRyYW5zZm9ybSB8fCAodmFsID0+IFN0cmluZy5mcm9tQ2hhckNvZGUodmFsKSk7XG4gIGxldCBhID0gYCR7c3RhcnR9YC5jaGFyQ29kZUF0KDApO1xuICBsZXQgYiA9IGAke2VuZH1gLmNoYXJDb2RlQXQoMCk7XG5cbiAgbGV0IGRlc2NlbmRpbmcgPSBhID4gYjtcbiAgbGV0IG1pbiA9IE1hdGgubWluKGEsIGIpO1xuICBsZXQgbWF4ID0gTWF0aC5tYXgoYSwgYik7XG5cbiAgaWYgKG9wdGlvbnMudG9SZWdleCAmJiBzdGVwID09PSAxKSB7XG4gICAgcmV0dXJuIHRvUmFuZ2UobWluLCBtYXgsIGZhbHNlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGxldCByYW5nZSA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuXG4gIHdoaWxlIChkZXNjZW5kaW5nID8gYSA+PSBiIDogYSA8PSBiKSB7XG4gICAgcmFuZ2UucHVzaChmb3JtYXQoYSwgaW5kZXgpKTtcbiAgICBhID0gZGVzY2VuZGluZyA/IGEgLSBzdGVwIDogYSArIHN0ZXA7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggPT09IHRydWUpIHtcbiAgICByZXR1cm4gdG9SZWdleChyYW5nZSwgbnVsbCwgeyB3cmFwOiBmYWxzZSwgb3B0aW9ucyB9KTtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbmNvbnN0IGZpbGwgPSAoc3RhcnQsIGVuZCwgc3RlcCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmIChlbmQgPT0gbnVsbCAmJiBpc1ZhbGlkVmFsdWUoc3RhcnQpKSB7XG4gICAgcmV0dXJuIFtzdGFydF07XG4gIH1cblxuICBpZiAoIWlzVmFsaWRWYWx1ZShzdGFydCkgfHwgIWlzVmFsaWRWYWx1ZShlbmQpKSB7XG4gICAgcmV0dXJuIGludmFsaWRSYW5nZShzdGFydCwgZW5kLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc3RlcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmaWxsKHN0YXJ0LCBlbmQsIDEsIHsgdHJhbnNmb3JtOiBzdGVwIH0pO1xuICB9XG5cbiAgaWYgKGlzT2JqZWN0KHN0ZXApKSB7XG4gICAgcmV0dXJuIGZpbGwoc3RhcnQsIGVuZCwgMCwgc3RlcCk7XG4gIH1cblxuICBsZXQgb3B0cyA9IHsgLi4ub3B0aW9ucyB9O1xuICBpZiAob3B0cy5jYXB0dXJlID09PSB0cnVlKSBvcHRzLndyYXAgPSB0cnVlO1xuICBzdGVwID0gc3RlcCB8fCBvcHRzLnN0ZXAgfHwgMTtcblxuICBpZiAoIWlzTnVtYmVyKHN0ZXApKSB7XG4gICAgaWYgKHN0ZXAgIT0gbnVsbCAmJiAhaXNPYmplY3Qoc3RlcCkpIHJldHVybiBpbnZhbGlkU3RlcChzdGVwLCBvcHRzKTtcbiAgICByZXR1cm4gZmlsbChzdGFydCwgZW5kLCAxLCBzdGVwKTtcbiAgfVxuXG4gIGlmIChpc051bWJlcihzdGFydCkgJiYgaXNOdW1iZXIoZW5kKSkge1xuICAgIHJldHVybiBmaWxsTnVtYmVycyhzdGFydCwgZW5kLCBzdGVwLCBvcHRzKTtcbiAgfVxuXG4gIHJldHVybiBmaWxsTGV0dGVycyhzdGFydCwgZW5kLCBNYXRoLm1heChNYXRoLmFicyhzdGVwKSwgMSksIG9wdHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBmaWxsID0gcmVxdWlyZSgnZmlsbC1yYW5nZScpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmNvbnN0IGNvbXBpbGUgPSAoYXN0LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IHdhbGsgPSAobm9kZSwgcGFyZW50ID0ge30pID0+IHtcbiAgICBsZXQgaW52YWxpZEJsb2NrID0gdXRpbHMuaXNJbnZhbGlkQnJhY2UocGFyZW50KTtcbiAgICBsZXQgaW52YWxpZE5vZGUgPSBub2RlLmludmFsaWQgPT09IHRydWUgJiYgb3B0aW9ucy5lc2NhcGVJbnZhbGlkID09PSB0cnVlO1xuICAgIGxldCBpbnZhbGlkID0gaW52YWxpZEJsb2NrID09PSB0cnVlIHx8IGludmFsaWROb2RlID09PSB0cnVlO1xuICAgIGxldCBwcmVmaXggPSBvcHRpb25zLmVzY2FwZUludmFsaWQgPT09IHRydWUgPyAnXFxcXCcgOiAnJztcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICBpZiAobm9kZS5pc09wZW4gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyBub2RlLnZhbHVlO1xuICAgIH1cbiAgICBpZiAobm9kZS5pc0Nsb3NlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgbm9kZS52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS50eXBlID09PSAnb3BlbicpIHtcbiAgICAgIHJldHVybiBpbnZhbGlkID8gKHByZWZpeCArIG5vZGUudmFsdWUpIDogJygnO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdjbG9zZScpIHtcbiAgICAgIHJldHVybiBpbnZhbGlkID8gKHByZWZpeCArIG5vZGUudmFsdWUpIDogJyknO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdjb21tYScpIHtcbiAgICAgIHJldHVybiBub2RlLnByZXYudHlwZSA9PT0gJ2NvbW1hJyA/ICcnIDogKGludmFsaWQgPyBub2RlLnZhbHVlIDogJ3wnKTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS52YWx1ZSkge1xuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZXMgJiYgbm9kZS5yYW5nZXMgPiAwKSB7XG4gICAgICBsZXQgYXJncyA9IHV0aWxzLnJlZHVjZShub2RlLm5vZGVzKTtcbiAgICAgIGxldCByYW5nZSA9IGZpbGwoLi4uYXJncywgeyAuLi5vcHRpb25zLCB3cmFwOiBmYWxzZSwgdG9SZWdleDogdHJ1ZSB9KTtcblxuICAgICAgaWYgKHJhbmdlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gYXJncy5sZW5ndGggPiAxICYmIHJhbmdlLmxlbmd0aCA+IDEgPyBgKCR7cmFuZ2V9KWAgOiByYW5nZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZS5ub2Rlcykge1xuICAgICAgZm9yIChsZXQgY2hpbGQgb2Ygbm9kZS5ub2Rlcykge1xuICAgICAgICBvdXRwdXQgKz0gd2FsayhjaGlsZCwgbm9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmV0dXJuIHdhbGsoYXN0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZmlsbCA9IHJlcXVpcmUoJ2ZpbGwtcmFuZ2UnKTtcbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3QgYXBwZW5kID0gKHF1ZXVlID0gJycsIHN0YXNoID0gJycsIGVuY2xvc2UgPSBmYWxzZSkgPT4ge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgcXVldWUgPSBbXS5jb25jYXQocXVldWUpO1xuICBzdGFzaCA9IFtdLmNvbmNhdChzdGFzaCk7XG5cbiAgaWYgKCFzdGFzaC5sZW5ndGgpIHJldHVybiBxdWV1ZTtcbiAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZW5jbG9zZSA/IHV0aWxzLmZsYXR0ZW4oc3Rhc2gpLm1hcChlbGUgPT4gYHske2VsZX19YCkgOiBzdGFzaDtcbiAgfVxuXG4gIGZvciAobGV0IGl0ZW0gb2YgcXVldWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChhcHBlbmQodmFsdWUsIHN0YXNoLCBlbmNsb3NlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGVsZSBvZiBzdGFzaCkge1xuICAgICAgICBpZiAoZW5jbG9zZSA9PT0gdHJ1ZSAmJiB0eXBlb2YgZWxlID09PSAnc3RyaW5nJykgZWxlID0gYHske2VsZX19YDtcbiAgICAgICAgcmVzdWx0LnB1c2goQXJyYXkuaXNBcnJheShlbGUpID8gYXBwZW5kKGl0ZW0sIGVsZSwgZW5jbG9zZSkgOiAoaXRlbSArIGVsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdXRpbHMuZmxhdHRlbihyZXN1bHQpO1xufTtcblxuY29uc3QgZXhwYW5kID0gKGFzdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCByYW5nZUxpbWl0ID0gb3B0aW9ucy5yYW5nZUxpbWl0ID09PSB2b2lkIDAgPyAxMDAwIDogb3B0aW9ucy5yYW5nZUxpbWl0O1xuXG4gIGxldCB3YWxrID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbm9kZS5xdWV1ZSA9IFtdO1xuXG4gICAgbGV0IHAgPSBwYXJlbnQ7XG4gICAgbGV0IHEgPSBwYXJlbnQucXVldWU7XG5cbiAgICB3aGlsZSAocC50eXBlICE9PSAnYnJhY2UnICYmIHAudHlwZSAhPT0gJ3Jvb3QnICYmIHAucGFyZW50KSB7XG4gICAgICBwID0gcC5wYXJlbnQ7XG4gICAgICBxID0gcC5xdWV1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5pbnZhbGlkIHx8IG5vZGUuZG9sbGFyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHN0cmluZ2lmeShub2RlLCBvcHRpb25zKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdicmFjZScgJiYgbm9kZS5pbnZhbGlkICE9PSB0cnVlICYmIG5vZGUubm9kZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIFsne30nXSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzICYmIG5vZGUucmFuZ2VzID4gMCkge1xuICAgICAgbGV0IGFyZ3MgPSB1dGlscy5yZWR1Y2Uobm9kZS5ub2Rlcyk7XG5cbiAgICAgIGlmICh1dGlscy5leGNlZWRzTGltaXQoLi4uYXJncywgb3B0aW9ucy5zdGVwLCByYW5nZUxpbWl0KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZXhwYW5kZWQgYXJyYXkgbGVuZ3RoIGV4Y2VlZHMgcmFuZ2UgbGltaXQuIFVzZSBvcHRpb25zLnJhbmdlTGltaXQgdG8gaW5jcmVhc2Ugb3IgZGlzYWJsZSB0aGUgbGltaXQuJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCByYW5nZSA9IGZpbGwoLi4uYXJncywgb3B0aW9ucyk7XG4gICAgICBpZiAocmFuZ2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJhbmdlID0gc3RyaW5naWZ5KG5vZGUsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHJhbmdlKSk7XG4gICAgICBub2RlLm5vZGVzID0gW107XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVuY2xvc2UgPSB1dGlscy5lbmNsb3NlQnJhY2Uobm9kZSk7XG4gICAgbGV0IHF1ZXVlID0gbm9kZS5xdWV1ZTtcbiAgICBsZXQgYmxvY2sgPSBub2RlO1xuXG4gICAgd2hpbGUgKGJsb2NrLnR5cGUgIT09ICdicmFjZScgJiYgYmxvY2sudHlwZSAhPT0gJ3Jvb3QnICYmIGJsb2NrLnBhcmVudCkge1xuICAgICAgYmxvY2sgPSBibG9jay5wYXJlbnQ7XG4gICAgICBxdWV1ZSA9IGJsb2NrLnF1ZXVlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNoaWxkID0gbm9kZS5ub2Rlc1tpXTtcblxuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdjb21tYScgJiYgbm9kZS50eXBlID09PSAnYnJhY2UnKSB7XG4gICAgICAgIGlmIChpID09PSAxKSBxdWV1ZS5wdXNoKCcnKTtcbiAgICAgICAgcXVldWUucHVzaCgnJyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHF1ZXVlLCBlbmNsb3NlKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudmFsdWUgJiYgY2hpbGQudHlwZSAhPT0gJ29wZW4nKSB7XG4gICAgICAgIHF1ZXVlLnB1c2goYXBwZW5kKHF1ZXVlLnBvcCgpLCBjaGlsZC52YWx1ZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLm5vZGVzKSB7XG4gICAgICAgIHdhbGsoY2hpbGQsIG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBxdWV1ZTtcbiAgfTtcblxuICByZXR1cm4gdXRpbHMuZmxhdHRlbih3YWxrKGFzdCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBhbmQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNQVhfTEVOR1RIOiAxMDI0ICogNjQsXG5cbiAgLy8gRGlnaXRzXG4gIENIQVJfMDogJzAnLCAvKiAwICovXG4gIENIQVJfOTogJzknLCAvKiA5ICovXG5cbiAgLy8gQWxwaGFiZXQgY2hhcnMuXG4gIENIQVJfVVBQRVJDQVNFX0E6ICdBJywgLyogQSAqL1xuICBDSEFSX0xPV0VSQ0FTRV9BOiAnYScsIC8qIGEgKi9cbiAgQ0hBUl9VUFBFUkNBU0VfWjogJ1onLCAvKiBaICovXG4gIENIQVJfTE9XRVJDQVNFX1o6ICd6JywgLyogeiAqL1xuXG4gIENIQVJfTEVGVF9QQVJFTlRIRVNFUzogJygnLCAvKiAoICovXG4gIENIQVJfUklHSFRfUEFSRU5USEVTRVM6ICcpJywgLyogKSAqL1xuXG4gIENIQVJfQVNURVJJU0s6ICcqJywgLyogKiAqL1xuXG4gIC8vIE5vbi1hbHBoYWJldGljIGNoYXJzLlxuICBDSEFSX0FNUEVSU0FORDogJyYnLCAvKiAmICovXG4gIENIQVJfQVQ6ICdAJywgLyogQCAqL1xuICBDSEFSX0JBQ0tTTEFTSDogJ1xcXFwnLCAvKiBcXCAqL1xuICBDSEFSX0JBQ0tUSUNLOiAnYCcsIC8qIGAgKi9cbiAgQ0hBUl9DQVJSSUFHRV9SRVRVUk46ICdcXHInLCAvKiBcXHIgKi9cbiAgQ0hBUl9DSVJDVU1GTEVYX0FDQ0VOVDogJ14nLCAvKiBeICovXG4gIENIQVJfQ09MT046ICc6JywgLyogOiAqL1xuICBDSEFSX0NPTU1BOiAnLCcsIC8qICwgKi9cbiAgQ0hBUl9ET0xMQVI6ICckJywgLyogLiAqL1xuICBDSEFSX0RPVDogJy4nLCAvKiAuICovXG4gIENIQVJfRE9VQkxFX1FVT1RFOiAnXCInLCAvKiBcIiAqL1xuICBDSEFSX0VRVUFMOiAnPScsIC8qID0gKi9cbiAgQ0hBUl9FWENMQU1BVElPTl9NQVJLOiAnIScsIC8qICEgKi9cbiAgQ0hBUl9GT1JNX0ZFRUQ6ICdcXGYnLCAvKiBcXGYgKi9cbiAgQ0hBUl9GT1JXQVJEX1NMQVNIOiAnLycsIC8qIC8gKi9cbiAgQ0hBUl9IQVNIOiAnIycsIC8qICMgKi9cbiAgQ0hBUl9IWVBIRU5fTUlOVVM6ICctJywgLyogLSAqL1xuICBDSEFSX0xFRlRfQU5HTEVfQlJBQ0tFVDogJzwnLCAvKiA8ICovXG4gIENIQVJfTEVGVF9DVVJMWV9CUkFDRTogJ3snLCAvKiB7ICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVDogJ1snLCAvKiBbICovXG4gIENIQVJfTElORV9GRUVEOiAnXFxuJywgLyogXFxuICovXG4gIENIQVJfTk9fQlJFQUtfU1BBQ0U6ICdcXHUwMEEwJywgLyogXFx1MDBBMCAqL1xuICBDSEFSX1BFUkNFTlQ6ICclJywgLyogJSAqL1xuICBDSEFSX1BMVVM6ICcrJywgLyogKyAqL1xuICBDSEFSX1FVRVNUSU9OX01BUks6ICc/JywgLyogPyAqL1xuICBDSEFSX1JJR0hUX0FOR0xFX0JSQUNLRVQ6ICc+JywgLyogPiAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFOiAnfScsIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVDogJ10nLCAvKiBdICovXG4gIENIQVJfU0VNSUNPTE9OOiAnOycsIC8qIDsgKi9cbiAgQ0hBUl9TSU5HTEVfUVVPVEU6ICdcXCcnLCAvKiAnICovXG4gIENIQVJfU1BBQ0U6ICcgJywgLyogICAqL1xuICBDSEFSX1RBQjogJ1xcdCcsIC8qIFxcdCAqL1xuICBDSEFSX1VOREVSU0NPUkU6ICdfJywgLyogXyAqL1xuICBDSEFSX1ZFUlRJQ0FMX0xJTkU6ICd8JywgLyogfCAqL1xuICBDSEFSX1pFUk9fV0lEVEhfTk9CUkVBS19TUEFDRTogJ1xcdUZFRkYnIC8qIFxcdUZFRkYgKi9cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5cbi8qKlxuICogQ29uc3RhbnRzXG4gKi9cblxuY29uc3Qge1xuICBNQVhfTEVOR1RILFxuICBDSEFSX0JBQ0tTTEFTSCwgLyogXFwgKi9cbiAgQ0hBUl9CQUNLVElDSywgLyogYCAqL1xuICBDSEFSX0NPTU1BLCAvKiAsICovXG4gIENIQVJfRE9ULCAvKiAuICovXG4gIENIQVJfTEVGVF9QQVJFTlRIRVNFUywgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTLCAvKiApICovXG4gIENIQVJfTEVGVF9DVVJMWV9CUkFDRSwgLyogeyAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFLCAvKiB9ICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCwgLyogWyAqL1xuICBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VULCAvKiBdICovXG4gIENIQVJfRE9VQkxFX1FVT1RFLCAvKiBcIiAqL1xuICBDSEFSX1NJTkdMRV9RVU9URSwgLyogJyAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFLFxuICBDSEFSX1pFUk9fV0lEVEhfTk9CUkVBS19TUEFDRVxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbi8qKlxuICogcGFyc2VcbiAqL1xuXG5jb25zdCBwYXJzZSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgbGV0IG1heCA9IHR5cGVvZiBvcHRzLm1heExlbmd0aCA9PT0gJ251bWJlcicgPyBNYXRoLm1pbihNQVhfTEVOR1RILCBvcHRzLm1heExlbmd0aCkgOiBNQVhfTEVOR1RIO1xuICBpZiAoaW5wdXQubGVuZ3RoID4gbWF4KSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBJbnB1dCBsZW5ndGggKCR7aW5wdXQubGVuZ3RofSksIGV4Y2VlZHMgbWF4IGNoYXJhY3RlcnMgKCR7bWF4fSlgKTtcbiAgfVxuXG4gIGxldCBhc3QgPSB7IHR5cGU6ICdyb290JywgaW5wdXQsIG5vZGVzOiBbXSB9O1xuICBsZXQgc3RhY2sgPSBbYXN0XTtcbiAgbGV0IGJsb2NrID0gYXN0O1xuICBsZXQgcHJldiA9IGFzdDtcbiAgbGV0IGJyYWNrZXRzID0gMDtcbiAgbGV0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGRlcHRoID0gMDtcbiAgbGV0IHZhbHVlO1xuICBsZXQgbWVtbyA9IHt9O1xuXG4gIC8qKlxuICAgKiBIZWxwZXJzXG4gICAqL1xuXG4gIGNvbnN0IGFkdmFuY2UgPSAoKSA9PiBpbnB1dFtpbmRleCsrXTtcbiAgY29uc3QgcHVzaCA9IG5vZGUgPT4ge1xuICAgIGlmIChub2RlLnR5cGUgPT09ICd0ZXh0JyAmJiBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICBwcmV2LnR5cGUgPSAndGV4dCc7XG4gICAgfVxuXG4gICAgaWYgKHByZXYgJiYgcHJldi50eXBlID09PSAndGV4dCcgJiYgbm9kZS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIHByZXYudmFsdWUgKz0gbm9kZS52YWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBibG9jay5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIG5vZGUucGFyZW50ID0gYmxvY2s7XG4gICAgbm9kZS5wcmV2ID0gcHJldjtcbiAgICBwcmV2ID0gbm9kZTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcblxuICBwdXNoKHsgdHlwZTogJ2JvcycgfSk7XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgYmxvY2sgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICB2YWx1ZSA9IGFkdmFuY2UoKTtcblxuICAgIC8qKlxuICAgICAqIEludmFsaWQgY2hhcnNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0UgfHwgdmFsdWUgPT09IENIQVJfTk9fQlJFQUtfU1BBQ0UpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVzY2FwZWQgY2hhcnNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9CQUNLU0xBU0gpIHtcbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlOiAob3B0aW9ucy5rZWVwRXNjYXBpbmcgPyB2YWx1ZSA6ICcnKSArIGFkdmFuY2UoKSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJpZ2h0IHNxdWFyZSBicmFja2V0IChsaXRlcmFsKTogJ10nXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlOiAnXFxcXCcgKyB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExlZnQgc3F1YXJlIGJyYWNrZXQ6ICdbJ1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgIGJyYWNrZXRzKys7XG5cbiAgICAgIGxldCBjbG9zZWQgPSB0cnVlO1xuICAgICAgbGV0IG5leHQ7XG5cbiAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCAmJiAobmV4dCA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgdmFsdWUgKz0gbmV4dDtcblxuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICAgICAgYnJhY2tldHMrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0JBQ0tTTEFTSCkge1xuICAgICAgICAgIHZhbHVlICs9IGFkdmFuY2UoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICAgICAgYnJhY2tldHMtLTtcblxuICAgICAgICAgIGlmIChicmFja2V0cyA9PT0gMCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyZW50aGVzZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICBibG9jayA9IHB1c2goeyB0eXBlOiAncGFyZW4nLCBub2RlczogW10gfSk7XG4gICAgICBzdGFjay5wdXNoKGJsb2NrKTtcbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTKSB7XG4gICAgICBpZiAoYmxvY2sudHlwZSAhPT0gJ3BhcmVuJykge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBibG9jayA9IHN0YWNrLnBvcCgpO1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBibG9jayA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVvdGVzOiAnfFwifGBcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9ET1VCTEVfUVVPVEUgfHwgdmFsdWUgPT09IENIQVJfU0lOR0xFX1FVT1RFIHx8IHZhbHVlID09PSBDSEFSX0JBQ0tUSUNLKSB7XG4gICAgICBsZXQgb3BlbiA9IHZhbHVlO1xuICAgICAgbGV0IG5leHQ7XG5cbiAgICAgIGlmIChvcHRpb25zLmtlZXBRdW90ZXMgIT09IHRydWUpIHtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoICYmIChuZXh0ID0gYWR2YW5jZSgpKSkge1xuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9CQUNLU0xBU0gpIHtcbiAgICAgICAgICB2YWx1ZSArPSBuZXh0ICsgYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IG9wZW4pIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5rZWVwUXVvdGVzID09PSB0cnVlKSB2YWx1ZSArPSBuZXh0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgKz0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMZWZ0IGN1cmx5IGJyYWNlOiAneydcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNFKSB7XG4gICAgICBkZXB0aCsrO1xuXG4gICAgICBsZXQgZG9sbGFyID0gcHJldi52YWx1ZSAmJiBwcmV2LnZhbHVlLnNsaWNlKC0xKSA9PT0gJyQnIHx8IGJsb2NrLmRvbGxhciA9PT0gdHJ1ZTtcbiAgICAgIGxldCBicmFjZSA9IHtcbiAgICAgICAgdHlwZTogJ2JyYWNlJyxcbiAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgY2xvc2U6IGZhbHNlLFxuICAgICAgICBkb2xsYXIsXG4gICAgICAgIGRlcHRoLFxuICAgICAgICBjb21tYXM6IDAsXG4gICAgICAgIHJhbmdlczogMCxcbiAgICAgICAgbm9kZXM6IFtdXG4gICAgICB9O1xuXG4gICAgICBibG9jayA9IHB1c2goYnJhY2UpO1xuICAgICAgc3RhY2sucHVzaChibG9jayk7XG4gICAgICBwdXNoKHsgdHlwZTogJ29wZW4nLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJpZ2h0IGN1cmx5IGJyYWNlOiAnfSdcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRSkge1xuICAgICAgaWYgKGJsb2NrLnR5cGUgIT09ICdicmFjZScpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdHlwZSA9ICdjbG9zZSc7XG4gICAgICBibG9jayA9IHN0YWNrLnBvcCgpO1xuICAgICAgYmxvY2suY2xvc2UgPSB0cnVlO1xuXG4gICAgICBwdXNoKHsgdHlwZSwgdmFsdWUgfSk7XG4gICAgICBkZXB0aC0tO1xuXG4gICAgICBibG9jayA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tbWE6ICcsJ1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0NPTU1BICYmIGRlcHRoID4gMCkge1xuICAgICAgaWYgKGJsb2NrLnJhbmdlcyA+IDApIHtcbiAgICAgICAgYmxvY2sucmFuZ2VzID0gMDtcbiAgICAgICAgbGV0IG9wZW4gPSBibG9jay5ub2Rlcy5zaGlmdCgpO1xuICAgICAgICBibG9jay5ub2RlcyA9IFtvcGVuLCB7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IHN0cmluZ2lmeShibG9jaykgfV07XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnY29tbWEnLCB2YWx1ZSB9KTtcbiAgICAgIGJsb2NrLmNvbW1hcysrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG90OiAnLidcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9ET1QgJiYgZGVwdGggPiAwICYmIGJsb2NrLmNvbW1hcyA9PT0gMCkge1xuICAgICAgbGV0IHNpYmxpbmdzID0gYmxvY2subm9kZXM7XG5cbiAgICAgIGlmIChkZXB0aCA9PT0gMCB8fCBzaWJsaW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgICBibG9jay5yYW5nZSA9IFtdO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBwcmV2LnR5cGUgPSAncmFuZ2UnO1xuXG4gICAgICAgIGlmIChibG9jay5ub2Rlcy5sZW5ndGggIT09IDMgJiYgYmxvY2subm9kZXMubGVuZ3RoICE9PSA1KSB7XG4gICAgICAgICAgYmxvY2suaW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYmxvY2sucmFuZ2VzID0gMDtcbiAgICAgICAgICBwcmV2LnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBibG9jay5yYW5nZXMrKztcbiAgICAgICAgYmxvY2suYXJncyA9IFtdO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ3JhbmdlJykge1xuICAgICAgICBzaWJsaW5ncy5wb3AoKTtcblxuICAgICAgICBsZXQgYmVmb3JlID0gc2libGluZ3Nbc2libGluZ3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGJlZm9yZS52YWx1ZSArPSBwcmV2LnZhbHVlICsgdmFsdWU7XG4gICAgICAgIHByZXYgPSBiZWZvcmU7XG4gICAgICAgIGJsb2NrLnJhbmdlcy0tO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdkb3QnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRleHRcbiAgICAgKi9cblxuICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICB9XG5cbiAgLy8gTWFyayBpbWJhbGFuY2VkIGJyYWNlcyBhbmQgYnJhY2tldHMgYXMgaW52YWxpZFxuICBkbyB7XG4gICAgYmxvY2sgPSBzdGFjay5wb3AoKTtcblxuICAgIGlmIChibG9jay50eXBlICE9PSAncm9vdCcpIHtcbiAgICAgIGJsb2NrLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIGlmICghbm9kZS5ub2Rlcykge1xuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdvcGVuJykgbm9kZS5pc09wZW4gPSB0cnVlO1xuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdjbG9zZScpIG5vZGUuaXNDbG9zZSA9IHRydWU7XG4gICAgICAgICAgaWYgKCFub2RlLm5vZGVzKSBub2RlLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgbm9kZS5pbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdldCB0aGUgbG9jYXRpb24gb2YgdGhlIGJsb2NrIG9uIHBhcmVudC5ub2RlcyAoYmxvY2sncyBzaWJsaW5ncylcbiAgICAgIGxldCBwYXJlbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgIGxldCBpbmRleCA9IHBhcmVudC5ub2Rlcy5pbmRleE9mKGJsb2NrKTtcbiAgICAgIC8vIHJlcGxhY2UgdGhlIChpbnZhbGlkKSBibG9jayB3aXRoIGl0J3Mgbm9kZXNcbiAgICAgIHBhcmVudC5ub2Rlcy5zcGxpY2UoaW5kZXgsIDEsIC4uLmJsb2NrLm5vZGVzKTtcbiAgICB9XG4gIH0gd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApO1xuXG4gIHB1c2goeyB0eXBlOiAnZW9zJyB9KTtcbiAgcmV0dXJuIGFzdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ2lmeScpO1xuY29uc3QgY29tcGlsZSA9IHJlcXVpcmUoJy4vbGliL2NvbXBpbGUnKTtcbmNvbnN0IGV4cGFuZCA9IHJlcXVpcmUoJy4vbGliL2V4cGFuZCcpO1xuY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuL2xpYi9wYXJzZScpO1xuXG4vKipcbiAqIEV4cGFuZCB0aGUgZ2l2ZW4gcGF0dGVybiBvciBjcmVhdGUgYSByZWdleC1jb21wYXRpYmxlIHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nLCB7IGNvbXBpbGU6IHRydWUgfSkpOyAvLz0+IFsnKGF8YnxjKSddXG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nKSk7IC8vPT4gWydhJywgJ2InLCAnYyddXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBicmFjZXMgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgb3V0cHV0ID0gW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgZm9yIChsZXQgcGF0dGVybiBvZiBpbnB1dCkge1xuICAgICAgbGV0IHJlc3VsdCA9IGJyYWNlcy5jcmVhdGUocGF0dGVybiwgb3B0aW9ucyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKC4uLnJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBbXS5jb25jYXQoYnJhY2VzLmNyZWF0ZShpbnB1dCwgb3B0aW9ucykpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5leHBhbmQgPT09IHRydWUgJiYgb3B0aW9ucy5ub2R1cGVzID09PSB0cnVlKSB7XG4gICAgb3V0cHV0ID0gWy4uLm5ldyBTZXQob3V0cHV0KV07XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAqXG4gKiBgYGBqc1xuICogLy8gYnJhY2VzLnBhcnNlKHBhdHRlcm4sIFssIG9wdGlvbnNdKTtcbiAqIGNvbnN0IGFzdCA9IGJyYWNlcy5wYXJzZSgnYS97YixjfS9kJyk7XG4gKiBjb25zb2xlLmxvZyhhc3QpO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0dGVybiBCcmFjZSBwYXR0ZXJuIHRvIHBhcnNlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIEFTVFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMucGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4gcGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBicmFjZXMgc3RyaW5nIGZyb20gYW4gQVNULCBvciBhbiBBU1Qgbm9kZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBsZXQgYXN0ID0gYnJhY2VzLnBhcnNlKCdmb28ve2EsYn0vYmFyJyk7XG4gKiBjb25zb2xlLmxvZyhzdHJpbmdpZnkoYXN0Lm5vZGVzWzJdKSk7IC8vPT4gJ3thLGJ9J1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLnN0cmluZ2lmeSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeShicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpLCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gc3RyaW5naWZ5KGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogQ29tcGlsZXMgYSBicmFjZSBwYXR0ZXJuIGludG8gYSByZWdleC1jb21wYXRpYmxlLCBvcHRpbWl6ZWQgc3RyaW5nLlxuICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBtYWluIFticmFjZXNdKCNicmFjZXMpIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNvbXBpbGUoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhLyhifGMpL2QnXVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmNvbXBpbGUgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgIGlucHV0ID0gYnJhY2VzLnBhcnNlKGlucHV0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gY29tcGlsZShpbnB1dCwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEV4cGFuZHMgYSBicmFjZSBwYXR0ZXJuIGludG8gYW4gYXJyYXkuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGVcbiAqIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24gd2hlbiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUuIEJlZm9yZVxuICogdXNpbmcgdGhpcyBtZXRob2QgaXQncyByZWNvbW1lbmRlZCB0aGF0IHlvdSByZWFkIHRoZSBbcGVyZm9ybWFuY2Ugbm90ZXNdKCNwZXJmb3JtYW5jZSkpXG4gKiBhbmQgYWR2YW50YWdlcyBvZiB1c2luZyBbLmNvbXBpbGVdKCNjb21waWxlKSBpbnN0ZWFkLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBicmFjZXMgPSByZXF1aXJlKCdicmFjZXMnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcy5leHBhbmQoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhL2IvZCcsICdhL2MvZCddO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gIEJyYWNlIHBhdHRlcm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmV4cGFuZCA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgaW5wdXQgPSBicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgbGV0IHJlc3VsdCA9IGV4cGFuZChpbnB1dCwgb3B0aW9ucyk7XG5cbiAgLy8gZmlsdGVyIG91dCBlbXB0eSBzdHJpbmdzIGlmIHNwZWNpZmllZFxuICBpZiAob3B0aW9ucy5ub2VtcHR5ID09PSB0cnVlKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihCb29sZWFuKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgZHVwbGljYXRlcyBpZiBzcGVjaWZpZWRcbiAgaWYgKG9wdGlvbnMubm9kdXBlcyA9PT0gdHJ1ZSkge1xuICAgIHJlc3VsdCA9IFsuLi5uZXcgU2V0KHJlc3VsdCldO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUHJvY2Vzc2VzIGEgYnJhY2UgcGF0dGVybiBhbmQgcmV0dXJucyBlaXRoZXIgYW4gZXhwYW5kZWQgYXJyYXlcbiAqIChpZiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUpLCBhIGhpZ2hseSBvcHRpbWl6ZWQgcmVnZXgtY29tcGF0aWJsZSBzdHJpbmcuXG4gKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNyZWF0ZSgndXNlci17MjAwLi4zMDB9L3Byb2plY3Qte2EsYixjfS17MS4uMTB9JykpXG4gKiAvLz0+ICd1c2VyLSgyMFswLTldfDJbMS05XVswLTldfDMwMCkvcHJvamVjdC0oYXxifGMpLShbMS05XXwxMCknXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmAgQnJhY2UgcGF0dGVyblxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgZXhwYW5kZWQgdmFsdWVzLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMuY3JlYXRlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKGlucHV0ID09PSAnJyB8fCBpbnB1dC5sZW5ndGggPCAzKSB7XG4gICAgcmV0dXJuIFtpbnB1dF07XG4gIH1cblxuIHJldHVybiBvcHRpb25zLmV4cGFuZCAhPT0gdHJ1ZVxuICAgID8gYnJhY2VzLmNvbXBpbGUoaW5wdXQsIG9wdGlvbnMpXG4gICAgOiBicmFjZXMuZXhwYW5kKGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogRXhwb3NlIFwiYnJhY2VzXCJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyYWNlcztcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9iaW5hcnktZXh0ZW5zaW9ucy5qc29uJyk7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgYmluYXJ5RXh0ZW5zaW9ucyA9IHJlcXVpcmUoJ2JpbmFyeS1leHRlbnNpb25zJyk7XG5cbmNvbnN0IGV4dGVuc2lvbnMgPSBuZXcgU2V0KGJpbmFyeUV4dGVuc2lvbnMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVQYXRoID0+IGV4dGVuc2lvbnMuaGFzKHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc2xpY2UoMSkudG9Mb3dlckNhc2UoKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtzZXB9ID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qge3BsYXRmb3JtfSA9IHByb2Nlc3M7XG5cbmV4cG9ydHMuRVZfQUxMID0gJ2FsbCc7XG5leHBvcnRzLkVWX1JFQURZID0gJ3JlYWR5JztcbmV4cG9ydHMuRVZfQUREID0gJ2FkZCc7XG5leHBvcnRzLkVWX0NIQU5HRSA9ICdjaGFuZ2UnO1xuZXhwb3J0cy5FVl9BRERfRElSID0gJ2FkZERpcic7XG5leHBvcnRzLkVWX1VOTElOSyA9ICd1bmxpbmsnO1xuZXhwb3J0cy5FVl9VTkxJTktfRElSID0gJ3VubGlua0Rpcic7XG5leHBvcnRzLkVWX1JBVyA9ICdyYXcnO1xuZXhwb3J0cy5FVl9FUlJPUiA9ICdlcnJvcic7XG5cbmV4cG9ydHMuU1RSX0RBVEEgPSAnZGF0YSc7XG5leHBvcnRzLlNUUl9FTkQgPSAnZW5kJztcbmV4cG9ydHMuU1RSX0NMT1NFID0gJ2Nsb3NlJztcblxuZXhwb3J0cy5GU0VWRU5UX0NSRUFURUQgPSAnY3JlYXRlZCc7XG5leHBvcnRzLkZTRVZFTlRfTU9ESUZJRUQgPSAnbW9kaWZpZWQnO1xuZXhwb3J0cy5GU0VWRU5UX0RFTEVURUQgPSAnZGVsZXRlZCc7XG5leHBvcnRzLkZTRVZFTlRfTU9WRUQgPSAnbW92ZWQnO1xuZXhwb3J0cy5GU0VWRU5UX0NMT05FRCA9ICdjbG9uZWQnO1xuZXhwb3J0cy5GU0VWRU5UX1VOS05PV04gPSAndW5rbm93bic7XG5leHBvcnRzLkZTRVZFTlRfVFlQRV9GSUxFID0gJ2ZpbGUnO1xuZXhwb3J0cy5GU0VWRU5UX1RZUEVfRElSRUNUT1JZID0gJ2RpcmVjdG9yeSc7XG5leHBvcnRzLkZTRVZFTlRfVFlQRV9TWU1MSU5LID0gJ3N5bWxpbmsnO1xuXG5leHBvcnRzLktFWV9MSVNURU5FUlMgPSAnbGlzdGVuZXJzJztcbmV4cG9ydHMuS0VZX0VSUiA9ICdlcnJIYW5kbGVycyc7XG5leHBvcnRzLktFWV9SQVcgPSAncmF3RW1pdHRlcnMnO1xuZXhwb3J0cy5IQU5ETEVSX0tFWVMgPSBbZXhwb3J0cy5LRVlfTElTVEVORVJTLCBleHBvcnRzLktFWV9FUlIsIGV4cG9ydHMuS0VZX1JBV107XG5cbmV4cG9ydHMuRE9UX1NMQVNIID0gYC4ke3NlcH1gO1xuXG5leHBvcnRzLkJBQ0tfU0xBU0hfUkUgPSAvXFxcXC9nO1xuZXhwb3J0cy5ET1VCTEVfU0xBU0hfUkUgPSAvXFwvXFwvLztcbmV4cG9ydHMuU0xBU0hfT1JfQkFDS19TTEFTSF9SRSA9IC9bL1xcXFxdLztcbmV4cG9ydHMuRE9UX1JFID0gL1xcLi4qXFwuKHN3W3B4XSkkfH4kfFxcLnN1YmwuKlxcLnRtcC87XG5leHBvcnRzLlJFUExBQ0VSX1JFID0gL15cXC5bL1xcXFxdLztcblxuZXhwb3J0cy5TTEFTSCA9ICcvJztcbmV4cG9ydHMuU0xBU0hfU0xBU0ggPSAnLy8nO1xuZXhwb3J0cy5CUkFDRV9TVEFSVCA9ICd7JztcbmV4cG9ydHMuQkFORyA9ICchJztcbmV4cG9ydHMuT05FX0RPVCA9ICcuJztcbmV4cG9ydHMuVFdPX0RPVFMgPSAnLi4nO1xuZXhwb3J0cy5TVEFSID0gJyonO1xuZXhwb3J0cy5HTE9CU1RBUiA9ICcqKic7XG5leHBvcnRzLlJPT1RfR0xPQlNUQVIgPSAnLyoqLyonO1xuZXhwb3J0cy5TTEFTSF9HTE9CU1RBUiA9ICcvKionO1xuZXhwb3J0cy5ESVJfU1VGRklYID0gJ0Rpcic7XG5leHBvcnRzLkFOWU1BVENIX09QVFMgPSB7ZG90OiB0cnVlfTtcbmV4cG9ydHMuU1RSSU5HX1RZUEUgPSAnc3RyaW5nJztcbmV4cG9ydHMuRlVOQ1RJT05fVFlQRSA9ICdmdW5jdGlvbic7XG5leHBvcnRzLkVNUFRZX1NUUiA9ICcnO1xuZXhwb3J0cy5FTVBUWV9GTiA9ICgpID0+IHt9O1xuZXhwb3J0cy5JREVOVElUWV9GTiA9IHZhbCA9PiB2YWw7XG5cbmV4cG9ydHMuaXNXaW5kb3dzID0gcGxhdGZvcm0gPT09ICd3aW4zMic7XG5leHBvcnRzLmlzTWFjb3MgPSBwbGF0Zm9ybSA9PT0gJ2Rhcndpbic7XG5leHBvcnRzLmlzTGludXggPSBwbGF0Zm9ybSA9PT0gJ2xpbnV4JztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3Qgc3lzUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHsgcHJvbWlzaWZ5IH0gPSByZXF1aXJlKCd1dGlsJyk7XG5jb25zdCBpc0JpbmFyeVBhdGggPSByZXF1aXJlKCdpcy1iaW5hcnktcGF0aCcpO1xuY29uc3Qge1xuICBpc1dpbmRvd3MsXG4gIGlzTGludXgsXG4gIEVNUFRZX0ZOLFxuICBFTVBUWV9TVFIsXG4gIEtFWV9MSVNURU5FUlMsXG4gIEtFWV9FUlIsXG4gIEtFWV9SQVcsXG4gIEhBTkRMRVJfS0VZUyxcbiAgRVZfQ0hBTkdFLFxuICBFVl9BREQsXG4gIEVWX0FERF9ESVIsXG4gIEVWX0VSUk9SLFxuICBTVFJfREFUQSxcbiAgU1RSX0VORCxcbiAgQlJBQ0VfU1RBUlQsXG4gIFNUQVJcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5jb25zdCBUSFJPVFRMRV9NT0RFX1dBVENIID0gJ3dhdGNoJztcblxuY29uc3Qgb3BlbiA9IHByb21pc2lmeShmcy5vcGVuKTtcbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5jb25zdCBsc3RhdCA9IHByb21pc2lmeShmcy5sc3RhdCk7XG5jb25zdCBjbG9zZSA9IHByb21pc2lmeShmcy5jbG9zZSk7XG5jb25zdCBmc3JlYWxwYXRoID0gcHJvbWlzaWZ5KGZzLnJlYWxwYXRoKTtcblxuY29uc3Qgc3RhdE1ldGhvZHMgPSB7IGxzdGF0LCBzdGF0IH07XG5cbi8vIFRPRE86IGVtaXQgZXJyb3JzIHByb3Blcmx5LiBFeGFtcGxlOiBFTUZJTEUgb24gTWFjb3MuXG5jb25zdCBmb3JlYWNoID0gKHZhbCwgZm4pID0+IHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIFNldCkge1xuICAgIHZhbC5mb3JFYWNoKGZuKTtcbiAgfSBlbHNlIHtcbiAgICBmbih2YWwpO1xuICB9XG59O1xuXG5jb25zdCBhZGRBbmRDb252ZXJ0ID0gKG1haW4sIHByb3AsIGl0ZW0pID0+IHtcbiAgbGV0IGNvbnRhaW5lciA9IG1haW5bcHJvcF07XG4gIGlmICghKGNvbnRhaW5lciBpbnN0YW5jZW9mIFNldCkpIHtcbiAgICBtYWluW3Byb3BdID0gY29udGFpbmVyID0gbmV3IFNldChbY29udGFpbmVyXSk7XG4gIH1cbiAgY29udGFpbmVyLmFkZChpdGVtKTtcbn07XG5cbmNvbnN0IGNsZWFySXRlbSA9IGNvbnQgPT4ga2V5ID0+IHtcbiAgY29uc3Qgc2V0ID0gY29udFtrZXldO1xuICBpZiAoc2V0IGluc3RhbmNlb2YgU2V0KSB7XG4gICAgc2V0LmNsZWFyKCk7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGNvbnRba2V5XTtcbiAgfVxufTtcblxuY29uc3QgZGVsRnJvbVNldCA9IChtYWluLCBwcm9wLCBpdGVtKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IG1haW5bcHJvcF07XG4gIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICBjb250YWluZXIuZGVsZXRlKGl0ZW0pO1xuICB9IGVsc2UgaWYgKGNvbnRhaW5lciA9PT0gaXRlbSkge1xuICAgIGRlbGV0ZSBtYWluW3Byb3BdO1xuICB9XG59O1xuXG5jb25zdCBpc0VtcHR5U2V0ID0gKHZhbCkgPT4gdmFsIGluc3RhbmNlb2YgU2V0ID8gdmFsLnNpemUgPT09IDAgOiAhdmFsO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtTdHJpbmd9IFBhdGhcbiAqL1xuXG4vLyBmc193YXRjaCBoZWxwZXJzXG5cbi8vIG9iamVjdCB0byBob2xkIHBlci1wcm9jZXNzIGZzX3dhdGNoIGluc3RhbmNlc1xuLy8gKG1heSBiZSBzaGFyZWQgYWNyb3NzIGNob2tpZGFyIEZTV2F0Y2hlciBpbnN0YW5jZXMpXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gRnNXYXRjaENvbnRhaW5lclxuICogQHByb3BlcnR5IHtTZXR9IGxpc3RlbmVyc1xuICogQHByb3BlcnR5IHtTZXR9IGVyckhhbmRsZXJzXG4gKiBAcHJvcGVydHkge1NldH0gcmF3RW1pdHRlcnNcbiAqIEBwcm9wZXJ0eSB7ZnMuRlNXYXRjaGVyPX0gd2F0Y2hlclxuICogQHByb3BlcnR5IHtCb29sZWFuPX0gd2F0Y2hlclVudXNhYmxlXG4gKi9cblxuLyoqXG4gKiBAdHlwZSB7TWFwPFN0cmluZyxGc1dhdGNoQ29udGFpbmVyPn1cbiAqL1xuY29uc3QgRnNXYXRjaEluc3RhbmNlcyA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgdGhlIGZzX3dhdGNoIGludGVyZmFjZVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggdG8gYmUgd2F0Y2hlZFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIGZzX3dhdGNoXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBtYWluIGV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVyckhhbmRsZXIgZW1pdHMgaW5mbyBhYm91dCBlcnJvcnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVtaXRSYXcgZW1pdHMgcmF3IGV2ZW50IGRhdGFcbiAqIEByZXR1cm5zIHtmcy5GU1dhdGNoZXJ9IG5ldyBmc2V2ZW50cyBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBjcmVhdGVGc1dhdGNoSW5zdGFuY2UocGF0aCwgb3B0aW9ucywgbGlzdGVuZXIsIGVyckhhbmRsZXIsIGVtaXRSYXcpIHtcbiAgY29uc3QgaGFuZGxlRXZlbnQgPSAocmF3RXZlbnQsIGV2UGF0aCkgPT4ge1xuICAgIGxpc3RlbmVyKHBhdGgpO1xuICAgIGVtaXRSYXcocmF3RXZlbnQsIGV2UGF0aCwge3dhdGNoZWRQYXRoOiBwYXRofSk7XG5cbiAgICAvLyBlbWl0IGJhc2VkIG9uIGV2ZW50cyBvY2N1cnJpbmcgZm9yIGZpbGVzIGZyb20gYSBkaXJlY3RvcnkncyB3YXRjaGVyIGluXG4gICAgLy8gY2FzZSB0aGUgZmlsZSdzIHdhdGNoZXIgbWlzc2VzIGl0IChhbmQgcmVseSBvbiB0aHJvdHRsaW5nIHRvIGRlLWR1cGUpXG4gICAgaWYgKGV2UGF0aCAmJiBwYXRoICE9PSBldlBhdGgpIHtcbiAgICAgIGZzV2F0Y2hCcm9hZGNhc3QoXG4gICAgICAgIHN5c1BhdGgucmVzb2x2ZShwYXRoLCBldlBhdGgpLCBLRVlfTElTVEVORVJTLCBzeXNQYXRoLmpvaW4ocGF0aCwgZXZQYXRoKVxuICAgICAgKTtcbiAgICB9XG4gIH07XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZzLndhdGNoKHBhdGgsIG9wdGlvbnMsIGhhbmRsZUV2ZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJIYW5kbGVyKGVycm9yKTtcbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciBmb3IgcGFzc2luZyBmc193YXRjaCBldmVudCBkYXRhIHRvIGEgY29sbGVjdGlvbiBvZiBsaXN0ZW5lcnNcbiAqIEBwYXJhbSB7UGF0aH0gZnVsbFBhdGggYWJzb2x1dGUgcGF0aCBib3VuZCB0byBmc193YXRjaCBpbnN0YW5jZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgbGlzdGVuZXIgdHlwZVxuICogQHBhcmFtIHsqPX0gdmFsMSBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGxpc3RlbmVyc1xuICogQHBhcmFtIHsqPX0gdmFsMlxuICogQHBhcmFtIHsqPX0gdmFsM1xuICovXG5jb25zdCBmc1dhdGNoQnJvYWRjYXN0ID0gKGZ1bGxQYXRoLCB0eXBlLCB2YWwxLCB2YWwyLCB2YWwzKSA9PiB7XG4gIGNvbnN0IGNvbnQgPSBGc1dhdGNoSW5zdGFuY2VzLmdldChmdWxsUGF0aCk7XG4gIGlmICghY29udCkgcmV0dXJuO1xuICBmb3JlYWNoKGNvbnRbdHlwZV0sIChsaXN0ZW5lcikgPT4ge1xuICAgIGxpc3RlbmVyKHZhbDEsIHZhbDIsIHZhbDMpO1xuICB9KTtcbn07XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHRoZSBmc193YXRjaCBpbnRlcmZhY2Ugb3IgYmluZHMgbGlzdGVuZXJzXG4gKiB0byBhbiBleGlzdGluZyBvbmUgY292ZXJpbmcgdGhlIHNhbWUgZmlsZSBzeXN0ZW0gZW50cnlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge1N0cmluZ30gZnVsbFBhdGggYWJzb2x1dGUgcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIGZzX3dhdGNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgY29udGFpbmVyIGZvciBldmVudCBsaXN0ZW5lciBmdW5jdGlvbnNcbiAqL1xuY29uc3Qgc2V0RnNXYXRjaExpc3RlbmVyID0gKHBhdGgsIGZ1bGxQYXRoLCBvcHRpb25zLCBoYW5kbGVycykgPT4ge1xuICBjb25zdCB7bGlzdGVuZXIsIGVyckhhbmRsZXIsIHJhd0VtaXR0ZXJ9ID0gaGFuZGxlcnM7XG4gIGxldCBjb250ID0gRnNXYXRjaEluc3RhbmNlcy5nZXQoZnVsbFBhdGgpO1xuXG4gIC8qKiBAdHlwZSB7ZnMuRlNXYXRjaGVyPX0gKi9cbiAgbGV0IHdhdGNoZXI7XG4gIGlmICghb3B0aW9ucy5wZXJzaXN0ZW50KSB7XG4gICAgd2F0Y2hlciA9IGNyZWF0ZUZzV2F0Y2hJbnN0YW5jZShcbiAgICAgIHBhdGgsIG9wdGlvbnMsIGxpc3RlbmVyLCBlcnJIYW5kbGVyLCByYXdFbWl0dGVyXG4gICAgKTtcbiAgICByZXR1cm4gd2F0Y2hlci5jbG9zZS5iaW5kKHdhdGNoZXIpO1xuICB9XG4gIGlmIChjb250KSB7XG4gICAgYWRkQW5kQ29udmVydChjb250LCBLRVlfTElTVEVORVJTLCBsaXN0ZW5lcik7XG4gICAgYWRkQW5kQ29udmVydChjb250LCBLRVlfRVJSLCBlcnJIYW5kbGVyKTtcbiAgICBhZGRBbmRDb252ZXJ0KGNvbnQsIEtFWV9SQVcsIHJhd0VtaXR0ZXIpO1xuICB9IGVsc2Uge1xuICAgIHdhdGNoZXIgPSBjcmVhdGVGc1dhdGNoSW5zdGFuY2UoXG4gICAgICBwYXRoLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIGZzV2F0Y2hCcm9hZGNhc3QuYmluZChudWxsLCBmdWxsUGF0aCwgS0VZX0xJU1RFTkVSUyksXG4gICAgICBlcnJIYW5kbGVyLCAvLyBubyBuZWVkIHRvIHVzZSBicm9hZGNhc3QgaGVyZVxuICAgICAgZnNXYXRjaEJyb2FkY2FzdC5iaW5kKG51bGwsIGZ1bGxQYXRoLCBLRVlfUkFXKVxuICAgICk7XG4gICAgaWYgKCF3YXRjaGVyKSByZXR1cm47XG4gICAgd2F0Y2hlci5vbihFVl9FUlJPUiwgYXN5bmMgKGVycm9yKSA9PiB7XG4gICAgICBjb25zdCBicm9hZGNhc3RFcnIgPSBmc1dhdGNoQnJvYWRjYXN0LmJpbmQobnVsbCwgZnVsbFBhdGgsIEtFWV9FUlIpO1xuICAgICAgY29udC53YXRjaGVyVW51c2FibGUgPSB0cnVlOyAvLyBkb2N1bWVudGVkIHNpbmNlIE5vZGUgMTAuNC4xXG4gICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzQzMzdcbiAgICAgIGlmIChpc1dpbmRvd3MgJiYgZXJyb3IuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGZkID0gYXdhaXQgb3BlbihwYXRoLCAncicpO1xuICAgICAgICAgIGF3YWl0IGNsb3NlKGZkKTtcbiAgICAgICAgICBicm9hZGNhc3RFcnIoZXJyb3IpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicm9hZGNhc3RFcnIoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnQgPSB7XG4gICAgICBsaXN0ZW5lcnM6IGxpc3RlbmVyLFxuICAgICAgZXJySGFuZGxlcnM6IGVyckhhbmRsZXIsXG4gICAgICByYXdFbWl0dGVyczogcmF3RW1pdHRlcixcbiAgICAgIHdhdGNoZXJcbiAgICB9O1xuICAgIEZzV2F0Y2hJbnN0YW5jZXMuc2V0KGZ1bGxQYXRoLCBjb250KTtcbiAgfVxuICAvLyBjb25zdCBpbmRleCA9IGNvbnQubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuXG4gIC8vIHJlbW92ZXMgdGhpcyBpbnN0YW5jZSdzIGxpc3RlbmVycyBhbmQgY2xvc2VzIHRoZSB1bmRlcmx5aW5nIGZzX3dhdGNoXG4gIC8vIGluc3RhbmNlIGlmIHRoZXJlIGFyZSBubyBtb3JlIGxpc3RlbmVycyBsZWZ0XG4gIHJldHVybiAoKSA9PiB7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfTElTVEVORVJTLCBsaXN0ZW5lcik7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfRVJSLCBlcnJIYW5kbGVyKTtcbiAgICBkZWxGcm9tU2V0KGNvbnQsIEtFWV9SQVcsIHJhd0VtaXR0ZXIpO1xuICAgIGlmIChpc0VtcHR5U2V0KGNvbnQubGlzdGVuZXJzKSkge1xuICAgICAgLy8gQ2hlY2sgdG8gcHJvdGVjdCBhZ2FpbnN0IGlzc3VlIGdoLTczMC5cbiAgICAgIC8vIGlmIChjb250LndhdGNoZXJVbnVzYWJsZSkge1xuICAgICAgY29udC53YXRjaGVyLmNsb3NlKCk7XG4gICAgICAvLyB9XG4gICAgICBGc1dhdGNoSW5zdGFuY2VzLmRlbGV0ZShmdWxsUGF0aCk7XG4gICAgICBIQU5ETEVSX0tFWVMuZm9yRWFjaChjbGVhckl0ZW0oY29udCkpO1xuICAgICAgY29udC53YXRjaGVyID0gdW5kZWZpbmVkO1xuICAgICAgT2JqZWN0LmZyZWV6ZShjb250KTtcbiAgICB9XG4gIH07XG59O1xuXG4vLyBmc193YXRjaEZpbGUgaGVscGVyc1xuXG4vLyBvYmplY3QgdG8gaG9sZCBwZXItcHJvY2VzcyBmc193YXRjaEZpbGUgaW5zdGFuY2VzXG4vLyAobWF5IGJlIHNoYXJlZCBhY3Jvc3MgY2hva2lkYXIgRlNXYXRjaGVyIGluc3RhbmNlcylcbmNvbnN0IEZzV2F0Y2hGaWxlSW5zdGFuY2VzID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIEluc3RhbnRpYXRlcyB0aGUgZnNfd2F0Y2hGaWxlIGludGVyZmFjZSBvciBiaW5kcyBsaXN0ZW5lcnNcbiAqIHRvIGFuIGV4aXN0aW5nIG9uZSBjb3ZlcmluZyB0aGUgc2FtZSBmaWxlIHN5c3RlbSBlbnRyeVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggdG8gYmUgd2F0Y2hlZFxuICogQHBhcmFtIHtTdHJpbmd9IGZ1bGxQYXRoIGFic29sdXRlIHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIGZzX3dhdGNoRmlsZVxuICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzIGNvbnRhaW5lciBmb3IgZXZlbnQgbGlzdGVuZXIgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGNsb3NlclxuICovXG5jb25zdCBzZXRGc1dhdGNoRmlsZUxpc3RlbmVyID0gKHBhdGgsIGZ1bGxQYXRoLCBvcHRpb25zLCBoYW5kbGVycykgPT4ge1xuICBjb25zdCB7bGlzdGVuZXIsIHJhd0VtaXR0ZXJ9ID0gaGFuZGxlcnM7XG4gIGxldCBjb250ID0gRnNXYXRjaEZpbGVJbnN0YW5jZXMuZ2V0KGZ1bGxQYXRoKTtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycywgcHJlZmVyLWRlc3RydWN0dXJpbmcgKi9cbiAgbGV0IGxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgbGV0IHJhd0VtaXR0ZXJzID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IGNvcHRzID0gY29udCAmJiBjb250Lm9wdGlvbnM7XG4gIGlmIChjb3B0cyAmJiAoY29wdHMucGVyc2lzdGVudCA8IG9wdGlvbnMucGVyc2lzdGVudCB8fCBjb3B0cy5pbnRlcnZhbCA+IG9wdGlvbnMuaW50ZXJ2YWwpKSB7XG4gICAgLy8gXCJVcGdyYWRlXCIgdGhlIHdhdGNoZXIgdG8gcGVyc2lzdGVuY2Ugb3IgYSBxdWlja2VyIGludGVydmFsLlxuICAgIC8vIFRoaXMgY3JlYXRlcyBzb21lIHVubGlrZWx5IGVkZ2UgY2FzZSBpc3N1ZXMgaWYgdGhlIHVzZXIgbWl4ZXNcbiAgICAvLyBzZXR0aW5ncyBpbiBhIHZlcnkgd2VpcmQgd2F5LCBidXQgc29sdmluZyBmb3IgdGhvc2UgY2FzZXNcbiAgICAvLyBkb2Vzbid0IHNlZW0gd29ydGh3aGlsZSBmb3IgdGhlIGFkZGVkIGNvbXBsZXhpdHkuXG4gICAgbGlzdGVuZXJzID0gY29udC5saXN0ZW5lcnM7XG4gICAgcmF3RW1pdHRlcnMgPSBjb250LnJhd0VtaXR0ZXJzO1xuICAgIGZzLnVud2F0Y2hGaWxlKGZ1bGxQYXRoKTtcbiAgICBjb250ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycywgcHJlZmVyLWRlc3RydWN0dXJpbmcgKi9cblxuICBpZiAoY29udCkge1xuICAgIGFkZEFuZENvbnZlcnQoY29udCwgS0VZX0xJU1RFTkVSUywgbGlzdGVuZXIpO1xuICAgIGFkZEFuZENvbnZlcnQoY29udCwgS0VZX1JBVywgcmF3RW1pdHRlcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gVE9ET1xuICAgIC8vIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIC8vIHJhd0VtaXR0ZXJzLmFkZChyYXdFbWl0dGVyKTtcbiAgICBjb250ID0ge1xuICAgICAgbGlzdGVuZXJzOiBsaXN0ZW5lcixcbiAgICAgIHJhd0VtaXR0ZXJzOiByYXdFbWl0dGVyLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHdhdGNoZXI6IGZzLndhdGNoRmlsZShmdWxsUGF0aCwgb3B0aW9ucywgKGN1cnIsIHByZXYpID0+IHtcbiAgICAgICAgZm9yZWFjaChjb250LnJhd0VtaXR0ZXJzLCAocmF3RW1pdHRlcikgPT4ge1xuICAgICAgICAgIHJhd0VtaXR0ZXIoRVZfQ0hBTkdFLCBmdWxsUGF0aCwge2N1cnIsIHByZXZ9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGN1cnJtdGltZSA9IGN1cnIubXRpbWVNcztcbiAgICAgICAgaWYgKGN1cnIuc2l6ZSAhPT0gcHJldi5zaXplIHx8IGN1cnJtdGltZSA+IHByZXYubXRpbWVNcyB8fCBjdXJybXRpbWUgPT09IDApIHtcbiAgICAgICAgICBmb3JlYWNoKGNvbnQubGlzdGVuZXJzLCAobGlzdGVuZXIpID0+IGxpc3RlbmVyKHBhdGgsIGN1cnIpKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9O1xuICAgIEZzV2F0Y2hGaWxlSW5zdGFuY2VzLnNldChmdWxsUGF0aCwgY29udCk7XG4gIH1cbiAgLy8gY29uc3QgaW5kZXggPSBjb250Lmxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcblxuICAvLyBSZW1vdmVzIHRoaXMgaW5zdGFuY2UncyBsaXN0ZW5lcnMgYW5kIGNsb3NlcyB0aGUgdW5kZXJseWluZyBmc193YXRjaEZpbGVcbiAgLy8gaW5zdGFuY2UgaWYgdGhlcmUgYXJlIG5vIG1vcmUgbGlzdGVuZXJzIGxlZnQuXG4gIHJldHVybiAoKSA9PiB7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfTElTVEVORVJTLCBsaXN0ZW5lcik7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfUkFXLCByYXdFbWl0dGVyKTtcbiAgICBpZiAoaXNFbXB0eVNldChjb250Lmxpc3RlbmVycykpIHtcbiAgICAgIEZzV2F0Y2hGaWxlSW5zdGFuY2VzLmRlbGV0ZShmdWxsUGF0aCk7XG4gICAgICBmcy51bndhdGNoRmlsZShmdWxsUGF0aCk7XG4gICAgICBjb250Lm9wdGlvbnMgPSBjb250LndhdGNoZXIgPSB1bmRlZmluZWQ7XG4gICAgICBPYmplY3QuZnJlZXplKGNvbnQpO1xuICAgIH1cbiAgfTtcbn07XG5cbi8qKlxuICogQG1peGluXG4gKi9cbmNsYXNzIE5vZGVGc0hhbmRsZXIge1xuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KFwiLi4vaW5kZXhcIikuRlNXYXRjaGVyfSBmc1dcbiAqL1xuY29uc3RydWN0b3IoZnNXKSB7XG4gIHRoaXMuZnN3ID0gZnNXO1xuICB0aGlzLl9ib3VuZEhhbmRsZUVycm9yID0gKGVycm9yKSA9PiBmc1cuX2hhbmRsZUVycm9yKGVycm9yKTtcbn1cblxuLyoqXG4gKiBXYXRjaCBmaWxlIGZvciBjaGFuZ2VzIHdpdGggZnNfd2F0Y2hGaWxlIG9yIGZzX3dhdGNoLlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggdG8gZmlsZSBvciBkaXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIG9uIGZzIGNoYW5nZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSBjbG9zZXIgZm9yIHRoZSB3YXRjaGVyIGluc3RhbmNlXG4gKi9cbl93YXRjaFdpdGhOb2RlRnMocGF0aCwgbGlzdGVuZXIpIHtcbiAgY29uc3Qgb3B0cyA9IHRoaXMuZnN3Lm9wdGlvbnM7XG4gIGNvbnN0IGRpcmVjdG9yeSA9IHN5c1BhdGguZGlybmFtZShwYXRoKTtcbiAgY29uc3QgYmFzZW5hbWUgPSBzeXNQYXRoLmJhc2VuYW1lKHBhdGgpO1xuICBjb25zdCBwYXJlbnQgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihkaXJlY3RvcnkpO1xuICBwYXJlbnQuYWRkKGJhc2VuYW1lKTtcbiAgY29uc3QgYWJzb2x1dGVQYXRoID0gc3lzUGF0aC5yZXNvbHZlKHBhdGgpO1xuICBjb25zdCBvcHRpb25zID0ge3BlcnNpc3RlbnQ6IG9wdHMucGVyc2lzdGVudH07XG4gIGlmICghbGlzdGVuZXIpIGxpc3RlbmVyID0gRU1QVFlfRk47XG5cbiAgbGV0IGNsb3NlcjtcbiAgaWYgKG9wdHMudXNlUG9sbGluZykge1xuICAgIG9wdGlvbnMuaW50ZXJ2YWwgPSBvcHRzLmVuYWJsZUJpbmFyeUludGVydmFsICYmIGlzQmluYXJ5UGF0aChiYXNlbmFtZSkgP1xuICAgICAgb3B0cy5iaW5hcnlJbnRlcnZhbCA6IG9wdHMuaW50ZXJ2YWw7XG4gICAgY2xvc2VyID0gc2V0RnNXYXRjaEZpbGVMaXN0ZW5lcihwYXRoLCBhYnNvbHV0ZVBhdGgsIG9wdGlvbnMsIHtcbiAgICAgIGxpc3RlbmVyLFxuICAgICAgcmF3RW1pdHRlcjogdGhpcy5mc3cuX2VtaXRSYXdcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjbG9zZXIgPSBzZXRGc1dhdGNoTGlzdGVuZXIocGF0aCwgYWJzb2x1dGVQYXRoLCBvcHRpb25zLCB7XG4gICAgICBsaXN0ZW5lcixcbiAgICAgIGVyckhhbmRsZXI6IHRoaXMuX2JvdW5kSGFuZGxlRXJyb3IsXG4gICAgICByYXdFbWl0dGVyOiB0aGlzLmZzdy5fZW1pdFJhd1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBjbG9zZXI7XG59XG5cbi8qKlxuICogV2F0Y2ggYSBmaWxlIGFuZCBlbWl0IGFkZCBldmVudCBpZiB3YXJyYW50ZWQuXG4gKiBAcGFyYW0ge1BhdGh9IGZpbGUgUGF0aFxuICogQHBhcmFtIHtmcy5TdGF0c30gc3RhdHMgcmVzdWx0IG9mIGZzX3N0YXRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdGlhbEFkZCB3YXMgdGhlIGZpbGUgYWRkZWQgYXQgd2F0Y2ggaW5zdGFudGlhdGlvbj9cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gY2xvc2VyIGZvciB0aGUgd2F0Y2hlciBpbnN0YW5jZVxuICovXG5faGFuZGxlRmlsZShmaWxlLCBzdGF0cywgaW5pdGlhbEFkZCkge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRpcm5hbWUgPSBzeXNQYXRoLmRpcm5hbWUoZmlsZSk7XG4gIGNvbnN0IGJhc2VuYW1lID0gc3lzUGF0aC5iYXNlbmFtZShmaWxlKTtcbiAgY29uc3QgcGFyZW50ID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoZGlybmFtZSk7XG4gIC8vIHN0YXRzIGlzIGFsd2F5cyBwcmVzZW50XG4gIGxldCBwcmV2U3RhdHMgPSBzdGF0cztcblxuICAvLyBpZiB0aGUgZmlsZSBpcyBhbHJlYWR5IGJlaW5nIHdhdGNoZWQsIGRvIG5vdGhpbmdcbiAgaWYgKHBhcmVudC5oYXMoYmFzZW5hbWUpKSByZXR1cm47XG5cbiAgY29uc3QgbGlzdGVuZXIgPSBhc3luYyAocGF0aCwgbmV3U3RhdHMpID0+IHtcbiAgICBpZiAoIXRoaXMuZnN3Ll90aHJvdHRsZShUSFJPVFRMRV9NT0RFX1dBVENILCBmaWxlLCA1KSkgcmV0dXJuO1xuICAgIGlmICghbmV3U3RhdHMgfHwgbmV3U3RhdHMubXRpbWVNcyA9PT0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbmV3U3RhdHMgPSBhd2FpdCBzdGF0KGZpbGUpO1xuICAgICAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgICAgIC8vIENoZWNrIHRoYXQgY2hhbmdlIGV2ZW50IHdhcyBub3QgZmlyZWQgYmVjYXVzZSBvZiBjaGFuZ2VkIG9ubHkgYWNjZXNzVGltZS5cbiAgICAgICAgY29uc3QgYXQgPSBuZXdTdGF0cy5hdGltZU1zO1xuICAgICAgICBjb25zdCBtdCA9IG5ld1N0YXRzLm10aW1lTXM7XG4gICAgICAgIGlmICghYXQgfHwgYXQgPD0gbXQgfHwgbXQgIT09IHByZXZTdGF0cy5tdGltZU1zKSB7XG4gICAgICAgICAgdGhpcy5mc3cuX2VtaXQoRVZfQ0hBTkdFLCBmaWxlLCBuZXdTdGF0cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTGludXggJiYgcHJldlN0YXRzLmlubyAhPT0gbmV3U3RhdHMuaW5vKSB7XG4gICAgICAgICAgdGhpcy5mc3cuX2Nsb3NlRmlsZShwYXRoKVxuICAgICAgICAgIHByZXZTdGF0cyA9IG5ld1N0YXRzO1xuICAgICAgICAgIHRoaXMuZnN3Ll9hZGRQYXRoQ2xvc2VyKHBhdGgsIHRoaXMuX3dhdGNoV2l0aE5vZGVGcyhmaWxlLCBsaXN0ZW5lcikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByZXZTdGF0cyA9IG5ld1N0YXRzO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBGaXggaXNzdWVzIHdoZXJlIG10aW1lIGlzIG51bGwgYnV0IGZpbGUgaXMgc3RpbGwgcHJlc2VudFxuICAgICAgICB0aGlzLmZzdy5fcmVtb3ZlKGRpcm5hbWUsIGJhc2VuYW1lKTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZCBpcyBhYm91dCB0byBiZSBlbWl0dGVkIGlmIGZpbGUgbm90IGFscmVhZHkgdHJhY2tlZCBpbiBwYXJlbnRcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5oYXMoYmFzZW5hbWUpKSB7XG4gICAgICAvLyBDaGVjayB0aGF0IGNoYW5nZSBldmVudCB3YXMgbm90IGZpcmVkIGJlY2F1c2Ugb2YgY2hhbmdlZCBvbmx5IGFjY2Vzc1RpbWUuXG4gICAgICBjb25zdCBhdCA9IG5ld1N0YXRzLmF0aW1lTXM7XG4gICAgICBjb25zdCBtdCA9IG5ld1N0YXRzLm10aW1lTXM7XG4gICAgICBpZiAoIWF0IHx8IGF0IDw9IG10IHx8IG10ICE9PSBwcmV2U3RhdHMubXRpbWVNcykge1xuICAgICAgICB0aGlzLmZzdy5fZW1pdChFVl9DSEFOR0UsIGZpbGUsIG5ld1N0YXRzKTtcbiAgICAgIH1cbiAgICAgIHByZXZTdGF0cyA9IG5ld1N0YXRzO1xuICAgIH1cbiAgfVxuICAvLyBraWNrIG9mZiB0aGUgd2F0Y2hlclxuICBjb25zdCBjbG9zZXIgPSB0aGlzLl93YXRjaFdpdGhOb2RlRnMoZmlsZSwgbGlzdGVuZXIpO1xuXG4gIC8vIGVtaXQgYW4gYWRkIGV2ZW50IGlmIHdlJ3JlIHN1cHBvc2VkIHRvXG4gIGlmICghKGluaXRpYWxBZGQgJiYgdGhpcy5mc3cub3B0aW9ucy5pZ25vcmVJbml0aWFsKSAmJiB0aGlzLmZzdy5faXNudElnbm9yZWQoZmlsZSkpIHtcbiAgICBpZiAoIXRoaXMuZnN3Ll90aHJvdHRsZShFVl9BREQsIGZpbGUsIDApKSByZXR1cm47XG4gICAgdGhpcy5mc3cuX2VtaXQoRVZfQURELCBmaWxlLCBzdGF0cyk7XG4gIH1cblxuICByZXR1cm4gY2xvc2VyO1xufVxuXG4vKipcbiAqIEhhbmRsZSBzeW1saW5rcyBlbmNvdW50ZXJlZCB3aGlsZSByZWFkaW5nIGEgZGlyLlxuICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IHJldHVybmVkIGJ5IHJlYWRkaXJwXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlyZWN0b3J5IHBhdGggb2YgZGlyIGJlaW5nIHJlYWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIG9mIHRoaXMgaXRlbVxuICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gYmFzZW5hbWUgb2YgdGhpcyBpdGVtXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCb29sZWFuPn0gdHJ1ZSBpZiBubyBtb3JlIHByb2Nlc3NpbmcgaXMgbmVlZGVkIGZvciB0aGlzIGVudHJ5LlxuICovXG5hc3luYyBfaGFuZGxlU3ltbGluayhlbnRyeSwgZGlyZWN0b3J5LCBwYXRoLCBpdGVtKSB7XG4gIGlmICh0aGlzLmZzdy5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZnVsbCA9IGVudHJ5LmZ1bGxQYXRoO1xuICBjb25zdCBkaXIgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihkaXJlY3RvcnkpO1xuXG4gIGlmICghdGhpcy5mc3cub3B0aW9ucy5mb2xsb3dTeW1saW5rcykge1xuICAgIC8vIHdhdGNoIHN5bWxpbmsgZGlyZWN0bHkgKGRvbid0IGZvbGxvdykgYW5kIGRldGVjdCBjaGFuZ2VzXG4gICAgdGhpcy5mc3cuX2luY3JSZWFkeUNvdW50KCk7XG4gICAgY29uc3QgbGlua1BhdGggPSBhd2FpdCBmc3JlYWxwYXRoKHBhdGgpO1xuICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAoZGlyLmhhcyhpdGVtKSkge1xuICAgICAgaWYgKHRoaXMuZnN3Ll9zeW1saW5rUGF0aHMuZ2V0KGZ1bGwpICE9PSBsaW5rUGF0aCkge1xuICAgICAgICB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLnNldChmdWxsLCBsaW5rUGF0aCk7XG4gICAgICAgIHRoaXMuZnN3Ll9lbWl0KEVWX0NIQU5HRSwgcGF0aCwgZW50cnkuc3RhdHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkaXIuYWRkKGl0ZW0pO1xuICAgICAgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5zZXQoZnVsbCwgbGlua1BhdGgpO1xuICAgICAgdGhpcy5mc3cuX2VtaXQoRVZfQURELCBwYXRoLCBlbnRyeS5zdGF0cyk7XG4gICAgfVxuICAgIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGRvbid0IGZvbGxvdyB0aGUgc2FtZSBzeW1saW5rIG1vcmUgdGhhbiBvbmNlXG4gIGlmICh0aGlzLmZzdy5fc3ltbGlua1BhdGhzLmhhcyhmdWxsKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5zZXQoZnVsbCwgdHJ1ZSk7XG59XG5cbl9oYW5kbGVSZWFkKGRpcmVjdG9yeSwgaW5pdGlhbEFkZCwgd2gsIHRhcmdldCwgZGlyLCBkZXB0aCwgdGhyb3R0bGVyKSB7XG4gIC8vIE5vcm1hbGl6ZSB0aGUgZGlyZWN0b3J5IG5hbWUgb24gV2luZG93c1xuICBkaXJlY3RvcnkgPSBzeXNQYXRoLmpvaW4oZGlyZWN0b3J5LCBFTVBUWV9TVFIpO1xuXG4gIGlmICghd2guaGFzR2xvYikge1xuICAgIHRocm90dGxlciA9IHRoaXMuZnN3Ll90aHJvdHRsZSgncmVhZGRpcicsIGRpcmVjdG9yeSwgMTAwMCk7XG4gICAgaWYgKCF0aHJvdHRsZXIpIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHByZXZpb3VzID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIod2gucGF0aCk7XG4gIGNvbnN0IGN1cnJlbnQgPSBuZXcgU2V0KCk7XG5cbiAgbGV0IHN0cmVhbSA9IHRoaXMuZnN3Ll9yZWFkZGlycChkaXJlY3RvcnksIHtcbiAgICBmaWxlRmlsdGVyOiBlbnRyeSA9PiB3aC5maWx0ZXJQYXRoKGVudHJ5KSxcbiAgICBkaXJlY3RvcnlGaWx0ZXI6IGVudHJ5ID0+IHdoLmZpbHRlckRpcihlbnRyeSksXG4gICAgZGVwdGg6IDBcbiAgfSkub24oU1RSX0RBVEEsIGFzeW5jIChlbnRyeSkgPT4ge1xuICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHtcbiAgICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXRlbSA9IGVudHJ5LnBhdGg7XG4gICAgbGV0IHBhdGggPSBzeXNQYXRoLmpvaW4oZGlyZWN0b3J5LCBpdGVtKTtcbiAgICBjdXJyZW50LmFkZChpdGVtKTtcblxuICAgIGlmIChlbnRyeS5zdGF0cy5pc1N5bWJvbGljTGluaygpICYmIGF3YWl0IHRoaXMuX2hhbmRsZVN5bWxpbmsoZW50cnksIGRpcmVjdG9yeSwgcGF0aCwgaXRlbSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgICBzdHJlYW0gPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEZpbGVzIHRoYXQgcHJlc2VudCBpbiBjdXJyZW50IGRpcmVjdG9yeSBzbmFwc2hvdFxuICAgIC8vIGJ1dCBhYnNlbnQgaW4gcHJldmlvdXMgYXJlIGFkZGVkIHRvIHdhdGNoIGxpc3QgYW5kXG4gICAgLy8gZW1pdCBgYWRkYCBldmVudC5cbiAgICBpZiAoaXRlbSA9PT0gdGFyZ2V0IHx8ICF0YXJnZXQgJiYgIXByZXZpb3VzLmhhcyhpdGVtKSkge1xuICAgICAgdGhpcy5mc3cuX2luY3JSZWFkeUNvdW50KCk7XG5cbiAgICAgIC8vIGVuc3VyZSByZWxhdGl2ZW5lc3Mgb2YgcGF0aCBpcyBwcmVzZXJ2ZWQgaW4gY2FzZSBvZiB3YXRjaGVyIHJldXNlXG4gICAgICBwYXRoID0gc3lzUGF0aC5qb2luKGRpciwgc3lzUGF0aC5yZWxhdGl2ZShkaXIsIHBhdGgpKTtcblxuICAgICAgdGhpcy5fYWRkVG9Ob2RlRnMocGF0aCwgaW5pdGlhbEFkZCwgd2gsIGRlcHRoICsgMSk7XG4gICAgfVxuICB9KS5vbihFVl9FUlJPUiwgdGhpcy5fYm91bmRIYW5kbGVFcnJvcik7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICBzdHJlYW0ub25jZShTVFJfRU5ELCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgd2FzVGhyb3R0bGVkID0gdGhyb3R0bGVyID8gdGhyb3R0bGVyLmNsZWFyKCkgOiBmYWxzZTtcblxuICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICAvLyBGaWxlcyB0aGF0IGFic2VudCBpbiBjdXJyZW50IGRpcmVjdG9yeSBzbmFwc2hvdFxuICAgICAgLy8gYnV0IHByZXNlbnQgaW4gcHJldmlvdXMgZW1pdCBgcmVtb3ZlYCBldmVudFxuICAgICAgLy8gYW5kIGFyZSByZW1vdmVkIGZyb20gQHdhdGNoZWRbZGlyZWN0b3J5XS5cbiAgICAgIHByZXZpb3VzLmdldENoaWxkcmVuKCkuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtICE9PSBkaXJlY3RvcnkgJiZcbiAgICAgICAgICAhY3VycmVudC5oYXMoaXRlbSkgJiZcbiAgICAgICAgICAvLyBpbiBjYXNlIG9mIGludGVyc2VjdGluZyBnbG9icztcbiAgICAgICAgICAvLyBhIHBhdGggbWF5IGhhdmUgYmVlbiBmaWx0ZXJlZCBvdXQgb2YgdGhpcyByZWFkZGlyLCBidXRcbiAgICAgICAgICAvLyBzaG91bGRuJ3QgYmUgcmVtb3ZlZCBiZWNhdXNlIGl0IG1hdGNoZXMgYSBkaWZmZXJlbnQgZ2xvYlxuICAgICAgICAgICghd2guaGFzR2xvYiB8fCB3aC5maWx0ZXJQYXRoKHtcbiAgICAgICAgICAgIGZ1bGxQYXRoOiBzeXNQYXRoLnJlc29sdmUoZGlyZWN0b3J5LCBpdGVtKVxuICAgICAgICAgIH0pKTtcbiAgICAgIH0pLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgdGhpcy5mc3cuX3JlbW92ZShkaXJlY3RvcnksIGl0ZW0pO1xuICAgICAgfSk7XG5cbiAgICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcblxuICAgICAgLy8gb25lIG1vcmUgdGltZSBmb3IgYW55IG1pc3NlZCBpbiBjYXNlIGNoYW5nZXMgY2FtZSBpbiBleHRyZW1lbHkgcXVpY2tseVxuICAgICAgaWYgKHdhc1Rocm90dGxlZCkgdGhpcy5faGFuZGxlUmVhZChkaXJlY3RvcnksIGZhbHNlLCB3aCwgdGFyZ2V0LCBkaXIsIGRlcHRoLCB0aHJvdHRsZXIpO1xuICAgIH0pXG4gICk7XG59XG5cbi8qKlxuICogUmVhZCBkaXJlY3RvcnkgdG8gYWRkIC8gcmVtb3ZlIGZpbGVzIGZyb20gYEB3YXRjaGVkYCBsaXN0IGFuZCByZS1yZWFkIGl0IG9uIGNoYW5nZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBkaXIgZnMgcGF0aFxuICogQHBhcmFtIHtmcy5TdGF0c30gc3RhdHNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdGlhbEFkZFxuICogQHBhcmFtIHtOdW1iZXJ9IGRlcHRoIHJlbGF0aXZlIHRvIHVzZXItc3VwcGxpZWQgcGF0aFxuICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldCBjaGlsZCBwYXRoIHRhcmdldGVkIGZvciB3YXRjaFxuICogQHBhcmFtIHtPYmplY3R9IHdoIENvbW1vbiB3YXRjaCBoZWxwZXJzIGZvciB0aGlzIHBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWFscGF0aFxuICogQHJldHVybnMge1Byb21pc2U8RnVuY3Rpb24+fSBjbG9zZXIgZm9yIHRoZSB3YXRjaGVyIGluc3RhbmNlLlxuICovXG5hc3luYyBfaGFuZGxlRGlyKGRpciwgc3RhdHMsIGluaXRpYWxBZGQsIGRlcHRoLCB0YXJnZXQsIHdoLCByZWFscGF0aCkge1xuICBjb25zdCBwYXJlbnREaXIgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihzeXNQYXRoLmRpcm5hbWUoZGlyKSk7XG4gIGNvbnN0IHRyYWNrZWQgPSBwYXJlbnREaXIuaGFzKHN5c1BhdGguYmFzZW5hbWUoZGlyKSk7XG4gIGlmICghKGluaXRpYWxBZGQgJiYgdGhpcy5mc3cub3B0aW9ucy5pZ25vcmVJbml0aWFsKSAmJiAhdGFyZ2V0ICYmICF0cmFja2VkKSB7XG4gICAgaWYgKCF3aC5oYXNHbG9iIHx8IHdoLmdsb2JGaWx0ZXIoZGlyKSkgdGhpcy5mc3cuX2VtaXQoRVZfQUREX0RJUiwgZGlyLCBzdGF0cyk7XG4gIH1cblxuICAvLyBlbnN1cmUgZGlyIGlzIHRyYWNrZWQgKGhhcm1sZXNzIGlmIHJlZHVuZGFudClcbiAgcGFyZW50RGlyLmFkZChzeXNQYXRoLmJhc2VuYW1lKGRpcikpO1xuICB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihkaXIpO1xuICBsZXQgdGhyb3R0bGVyO1xuICBsZXQgY2xvc2VyO1xuXG4gIGNvbnN0IG9EZXB0aCA9IHRoaXMuZnN3Lm9wdGlvbnMuZGVwdGg7XG4gIGlmICgob0RlcHRoID09IG51bGwgfHwgZGVwdGggPD0gb0RlcHRoKSAmJiAhdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5oYXMocmVhbHBhdGgpKSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZVJlYWQoZGlyLCBpbml0aWFsQWRkLCB3aCwgdGFyZ2V0LCBkaXIsIGRlcHRoLCB0aHJvdHRsZXIpO1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgIH1cblxuICAgIGNsb3NlciA9IHRoaXMuX3dhdGNoV2l0aE5vZGVGcyhkaXIsIChkaXJQYXRoLCBzdGF0cykgPT4ge1xuICAgICAgLy8gaWYgY3VycmVudCBkaXJlY3RvcnkgaXMgcmVtb3ZlZCwgZG8gbm90aGluZ1xuICAgICAgaWYgKHN0YXRzICYmIHN0YXRzLm10aW1lTXMgPT09IDApIHJldHVybjtcblxuICAgICAgdGhpcy5faGFuZGxlUmVhZChkaXJQYXRoLCBmYWxzZSwgd2gsIHRhcmdldCwgZGlyLCBkZXB0aCwgdGhyb3R0bGVyKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY2xvc2VyO1xufVxuXG4vKipcbiAqIEhhbmRsZSBhZGRlZCBmaWxlLCBkaXJlY3RvcnksIG9yIGdsb2IgcGF0dGVybi5cbiAqIERlbGVnYXRlcyBjYWxsIHRvIF9oYW5kbGVGaWxlIC8gX2hhbmRsZURpciBhZnRlciBjaGVja3MuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCB0byBmaWxlIG9yIGlyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWxBZGQgd2FzIHRoZSBmaWxlIGFkZGVkIGF0IHdhdGNoIGluc3RhbnRpYXRpb24/XG4gKiBAcGFyYW0ge09iamVjdH0gcHJpb3JXaCBkZXB0aCByZWxhdGl2ZSB0byB1c2VyLXN1cHBsaWVkIHBhdGhcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZXB0aCBDaGlsZCBwYXRoIGFjdHVhbGx5IHRhcmdldGVkIGZvciB3YXRjaFxuICogQHBhcmFtIHtTdHJpbmc9fSB0YXJnZXQgQ2hpbGQgcGF0aCBhY3R1YWxseSB0YXJnZXRlZCBmb3Igd2F0Y2hcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5hc3luYyBfYWRkVG9Ob2RlRnMocGF0aCwgaW5pdGlhbEFkZCwgcHJpb3JXaCwgZGVwdGgsIHRhcmdldCkge1xuICBjb25zdCByZWFkeSA9IHRoaXMuZnN3Ll9lbWl0UmVhZHk7XG4gIGlmICh0aGlzLmZzdy5faXNJZ25vcmVkKHBhdGgpIHx8IHRoaXMuZnN3LmNsb3NlZCkge1xuICAgIHJlYWR5KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgd2ggPSB0aGlzLmZzdy5fZ2V0V2F0Y2hIZWxwZXJzKHBhdGgsIGRlcHRoKTtcbiAgaWYgKCF3aC5oYXNHbG9iICYmIHByaW9yV2gpIHtcbiAgICB3aC5oYXNHbG9iID0gcHJpb3JXaC5oYXNHbG9iO1xuICAgIHdoLmdsb2JGaWx0ZXIgPSBwcmlvcldoLmdsb2JGaWx0ZXI7XG4gICAgd2guZmlsdGVyUGF0aCA9IGVudHJ5ID0+IHByaW9yV2guZmlsdGVyUGF0aChlbnRyeSk7XG4gICAgd2guZmlsdGVyRGlyID0gZW50cnkgPT4gcHJpb3JXaC5maWx0ZXJEaXIoZW50cnkpO1xuICB9XG5cbiAgLy8gZXZhbHVhdGUgd2hhdCBpcyBhdCB0aGUgcGF0aCB3ZSdyZSBiZWluZyBhc2tlZCB0byB3YXRjaFxuICB0cnkge1xuICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgc3RhdE1ldGhvZHNbd2guc3RhdE1ldGhvZF0od2gud2F0Y2hQYXRoKTtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZnN3Ll9pc0lnbm9yZWQod2gud2F0Y2hQYXRoLCBzdGF0cykpIHtcbiAgICAgIHJlYWR5KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZm9sbG93ID0gdGhpcy5mc3cub3B0aW9ucy5mb2xsb3dTeW1saW5rcyAmJiAhcGF0aC5pbmNsdWRlcyhTVEFSKSAmJiAhcGF0aC5pbmNsdWRlcyhCUkFDRV9TVEFSVCk7XG4gICAgbGV0IGNsb3NlcjtcbiAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgY29uc3QgYWJzUGF0aCA9IHN5c1BhdGgucmVzb2x2ZShwYXRoKTtcbiAgICAgIGNvbnN0IHRhcmdldFBhdGggPSBmb2xsb3cgPyBhd2FpdCBmc3JlYWxwYXRoKHBhdGgpIDogcGF0aDtcbiAgICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICAgIGNsb3NlciA9IGF3YWl0IHRoaXMuX2hhbmRsZURpcih3aC53YXRjaFBhdGgsIHN0YXRzLCBpbml0aWFsQWRkLCBkZXB0aCwgdGFyZ2V0LCB3aCwgdGFyZ2V0UGF0aCk7XG4gICAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgICAvLyBwcmVzZXJ2ZSB0aGlzIHN5bWxpbmsncyB0YXJnZXQgcGF0aFxuICAgICAgaWYgKGFic1BhdGggIT09IHRhcmdldFBhdGggJiYgdGFyZ2V0UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZnN3Ll9zeW1saW5rUGF0aHMuc2V0KGFic1BhdGgsIHRhcmdldFBhdGgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgY29uc3QgdGFyZ2V0UGF0aCA9IGZvbGxvdyA/IGF3YWl0IGZzcmVhbHBhdGgocGF0aCkgOiBwYXRoO1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgICAgY29uc3QgcGFyZW50ID0gc3lzUGF0aC5kaXJuYW1lKHdoLndhdGNoUGF0aCk7XG4gICAgICB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihwYXJlbnQpLmFkZCh3aC53YXRjaFBhdGgpO1xuICAgICAgdGhpcy5mc3cuX2VtaXQoRVZfQURELCB3aC53YXRjaFBhdGgsIHN0YXRzKTtcbiAgICAgIGNsb3NlciA9IGF3YWl0IHRoaXMuX2hhbmRsZURpcihwYXJlbnQsIHN0YXRzLCBpbml0aWFsQWRkLCBkZXB0aCwgcGF0aCwgd2gsIHRhcmdldFBhdGgpO1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuXG4gICAgICAvLyBwcmVzZXJ2ZSB0aGlzIHN5bWxpbmsncyB0YXJnZXQgcGF0aFxuICAgICAgaWYgKHRhcmdldFBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLnNldChzeXNQYXRoLnJlc29sdmUocGF0aCksIHRhcmdldFBhdGgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZXIgPSB0aGlzLl9oYW5kbGVGaWxlKHdoLndhdGNoUGF0aCwgc3RhdHMsIGluaXRpYWxBZGQpO1xuICAgIH1cbiAgICByZWFkeSgpO1xuXG4gICAgdGhpcy5mc3cuX2FkZFBhdGhDbG9zZXIocGF0aCwgY2xvc2VyKTtcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAodGhpcy5mc3cuX2hhbmRsZUVycm9yKGVycm9yKSkge1xuICAgICAgcmVhZHkoKTtcbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH1cbiAgfVxufVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZUZzSGFuZGxlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3Qgc3lzUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHsgcHJvbWlzaWZ5IH0gPSByZXF1aXJlKCd1dGlsJyk7XG5cbmxldCBmc2V2ZW50cztcbnRyeSB7XG4gIGZzZXZlbnRzID0gcmVxdWlyZSgnZnNldmVudHMnKTtcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGlmIChwcm9jZXNzLmVudi5DSE9LSURBUl9QUklOVF9GU0VWRU5UU19SRVFVSVJFX0VSUk9SKSBjb25zb2xlLmVycm9yKGVycm9yKTtcbn1cblxuaWYgKGZzZXZlbnRzKSB7XG4gIC8vIFRPRE86IHJlYWwgY2hlY2tcbiAgY29uc3QgbXRjaCA9IHByb2Nlc3MudmVyc2lvbi5tYXRjaCgvdihcXGQrKVxcLihcXGQrKS8pO1xuICBpZiAobXRjaCAmJiBtdGNoWzFdICYmIG10Y2hbMl0pIHtcbiAgICBjb25zdCBtYWogPSBOdW1iZXIucGFyc2VJbnQobXRjaFsxXSwgMTApO1xuICAgIGNvbnN0IG1pbiA9IE51bWJlci5wYXJzZUludChtdGNoWzJdLCAxMCk7XG4gICAgaWYgKG1haiA9PT0gOCAmJiBtaW4gPCAxNikge1xuICAgICAgZnNldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHtcbiAgRVZfQURELFxuICBFVl9DSEFOR0UsXG4gIEVWX0FERF9ESVIsXG4gIEVWX1VOTElOSyxcbiAgRVZfRVJST1IsXG4gIFNUUl9EQVRBLFxuICBTVFJfRU5ELFxuICBGU0VWRU5UX0NSRUFURUQsXG4gIEZTRVZFTlRfTU9ESUZJRUQsXG4gIEZTRVZFTlRfREVMRVRFRCxcbiAgRlNFVkVOVF9NT1ZFRCxcbiAgLy8gRlNFVkVOVF9DTE9ORUQsXG4gIEZTRVZFTlRfVU5LTk9XTixcbiAgRlNFVkVOVF9UWVBFX0ZJTEUsXG4gIEZTRVZFTlRfVFlQRV9ESVJFQ1RPUlksXG4gIEZTRVZFTlRfVFlQRV9TWU1MSU5LLFxuXG4gIFJPT1RfR0xPQlNUQVIsXG4gIERJUl9TVUZGSVgsXG4gIERPVF9TTEFTSCxcbiAgRlVOQ1RJT05fVFlQRSxcbiAgRU1QVFlfRk4sXG4gIElERU5USVRZX0ZOXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3QgRGVwdGggPSAodmFsdWUpID0+IGlzTmFOKHZhbHVlKSA/IHt9IDoge2RlcHRoOiB2YWx1ZX07XG5cbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5jb25zdCBsc3RhdCA9IHByb21pc2lmeShmcy5sc3RhdCk7XG5jb25zdCByZWFscGF0aCA9IHByb21pc2lmeShmcy5yZWFscGF0aCk7XG5cbmNvbnN0IHN0YXRNZXRob2RzID0geyBzdGF0LCBsc3RhdCB9O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtTdHJpbmd9IFBhdGhcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEZzRXZlbnRzV2F0Y2hDb250YWluZXJcbiAqIEBwcm9wZXJ0eSB7U2V0PEZ1bmN0aW9uPn0gbGlzdGVuZXJzXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSByYXdFbWl0dGVyXG4gKiBAcHJvcGVydHkge3tzdG9wOiBGdW5jdGlvbn19IHdhdGNoZXJcbiAqL1xuXG4vLyBmc2V2ZW50cyBpbnN0YW5jZSBoZWxwZXIgZnVuY3Rpb25zXG4vKipcbiAqIE9iamVjdCB0byBob2xkIHBlci1wcm9jZXNzIGZzZXZlbnRzIGluc3RhbmNlcyAobWF5IGJlIHNoYXJlZCBhY3Jvc3MgY2hva2lkYXIgRlNXYXRjaGVyIGluc3RhbmNlcylcbiAqIEB0eXBlIHtNYXA8UGF0aCxGc0V2ZW50c1dhdGNoQ29udGFpbmVyPn1cbiAqL1xuY29uc3QgRlNFdmVudHNXYXRjaGVycyA9IG5ldyBNYXAoKTtcblxuLy8gVGhyZXNob2xkIG9mIGR1cGxpY2F0ZSBwYXRoIHByZWZpeGVzIGF0IHdoaWNoIHRvIHN0YXJ0XG4vLyBjb25zb2xpZGF0aW5nIGdvaW5nIGZvcndhcmRcbmNvbnN0IGNvbnNvbGlkYXRlVGhyZXNoaG9sZCA9IDEwO1xuXG5jb25zdCB3cm9uZ0V2ZW50RmxhZ3MgPSBuZXcgU2V0KFtcbiAgNjk4ODgsIDcwNDAwLCA3MTQyNCwgNzI3MDQsIDczNDcyLCAxMzEzMjgsIDEzMTg0MCwgMjYyOTEyXG5dKTtcblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgdGhlIGZzZXZlbnRzIGludGVyZmFjZVxuICogQHBhcmFtIHtQYXRofSBwYXRoIHBhdGggdG8gYmUgd2F0Y2hlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgY2FsbGVkIHdoZW4gZnNldmVudHMgaXMgYm91bmQgYW5kIHJlYWR5XG4gKiBAcmV0dXJucyB7e3N0b3A6IEZ1bmN0aW9ufX0gbmV3IGZzZXZlbnRzIGluc3RhbmNlXG4gKi9cbmNvbnN0IGNyZWF0ZUZTRXZlbnRzSW5zdGFuY2UgPSAocGF0aCwgY2FsbGJhY2spID0+IHtcbiAgY29uc3Qgc3RvcCA9IGZzZXZlbnRzLndhdGNoKHBhdGgsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHtzdG9wfTtcbn07XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHRoZSBmc2V2ZW50cyBpbnRlcmZhY2Ugb3IgYmluZHMgbGlzdGVuZXJzIHRvIGFuIGV4aXN0aW5nIG9uZSBjb3ZlcmluZ1xuICogdGhlIHNhbWUgZmlsZSB0cmVlLlxuICogQHBhcmFtIHtQYXRofSBwYXRoICAgICAgICAgICAtIHRvIGJlIHdhdGNoZWRcbiAqIEBwYXJhbSB7UGF0aH0gcmVhbFBhdGggICAgICAgLSByZWFsIHBhdGggZm9yIHN5bWxpbmtzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAgIC0gY2FsbGVkIHdoZW4gZnNldmVudHMgZW1pdHMgZXZlbnRzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByYXdFbWl0dGVyIC0gcGFzc2VzIGRhdGEgdG8gbGlzdGVuZXJzIG9mIHRoZSAncmF3JyBldmVudFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBjbG9zZXJcbiAqL1xuZnVuY3Rpb24gc2V0RlNFdmVudHNMaXN0ZW5lcihwYXRoLCByZWFsUGF0aCwgbGlzdGVuZXIsIHJhd0VtaXR0ZXIpIHtcbiAgbGV0IHdhdGNoUGF0aCA9IHN5c1BhdGguZXh0bmFtZShwYXRoKSA/IHN5c1BhdGguZGlybmFtZShwYXRoKSA6IHBhdGg7XG4gIGNvbnN0IHBhcmVudFBhdGggPSBzeXNQYXRoLmRpcm5hbWUod2F0Y2hQYXRoKTtcbiAgbGV0IGNvbnQgPSBGU0V2ZW50c1dhdGNoZXJzLmdldCh3YXRjaFBhdGgpO1xuXG4gIC8vIElmIHdlJ3ZlIGFjY3VtdWxhdGVkIGEgc3Vic3RhbnRpYWwgbnVtYmVyIG9mIHBhdGhzIHRoYXRcbiAgLy8gY291bGQgaGF2ZSBiZWVuIGNvbnNvbGlkYXRlZCBieSB3YXRjaGluZyBvbmUgZGlyZWN0b3J5XG4gIC8vIGFib3ZlIHRoZSBjdXJyZW50IG9uZSwgY3JlYXRlIGEgd2F0Y2hlciBvbiB0aGUgcGFyZW50XG4gIC8vIHBhdGggaW5zdGVhZCwgc28gdGhhdCB3ZSBkbyBjb25zb2xpZGF0ZSBnb2luZyBmb3J3YXJkLlxuICBpZiAoY291bGRDb25zb2xpZGF0ZShwYXJlbnRQYXRoKSkge1xuICAgIHdhdGNoUGF0aCA9IHBhcmVudFBhdGg7XG4gIH1cblxuICBjb25zdCByZXNvbHZlZFBhdGggPSBzeXNQYXRoLnJlc29sdmUocGF0aCk7XG4gIGNvbnN0IGhhc1N5bWxpbmsgPSByZXNvbHZlZFBhdGggIT09IHJlYWxQYXRoO1xuXG4gIGNvbnN0IGZpbHRlcmVkTGlzdGVuZXIgPSAoZnVsbFBhdGgsIGZsYWdzLCBpbmZvKSA9PiB7XG4gICAgaWYgKGhhc1N5bWxpbmspIGZ1bGxQYXRoID0gZnVsbFBhdGgucmVwbGFjZShyZWFsUGF0aCwgcmVzb2x2ZWRQYXRoKTtcbiAgICBpZiAoXG4gICAgICBmdWxsUGF0aCA9PT0gcmVzb2x2ZWRQYXRoIHx8XG4gICAgICAhZnVsbFBhdGguaW5kZXhPZihyZXNvbHZlZFBhdGggKyBzeXNQYXRoLnNlcClcbiAgICApIGxpc3RlbmVyKGZ1bGxQYXRoLCBmbGFncywgaW5mbyk7XG4gIH07XG5cbiAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHdhdGNoZXIgb24gYSBwYXJlbnQgcGF0aFxuICAvLyBtb2RpZmllcyBgd2F0Y2hQYXRoYCB0byB0aGUgcGFyZW50IHBhdGggd2hlbiBpdCBmaW5kcyBhIG1hdGNoXG4gIGxldCB3YXRjaGVkUGFyZW50ID0gZmFsc2U7XG4gIGZvciAoY29uc3Qgd2F0Y2hlZFBhdGggb2YgRlNFdmVudHNXYXRjaGVycy5rZXlzKCkpIHtcbiAgICBpZiAocmVhbFBhdGguaW5kZXhPZihzeXNQYXRoLnJlc29sdmUod2F0Y2hlZFBhdGgpICsgc3lzUGF0aC5zZXApID09PSAwKSB7XG4gICAgICB3YXRjaFBhdGggPSB3YXRjaGVkUGF0aDtcbiAgICAgIGNvbnQgPSBGU0V2ZW50c1dhdGNoZXJzLmdldCh3YXRjaFBhdGgpO1xuICAgICAgd2F0Y2hlZFBhcmVudCA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoY29udCB8fCB3YXRjaGVkUGFyZW50KSB7XG4gICAgY29udC5saXN0ZW5lcnMuYWRkKGZpbHRlcmVkTGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIGNvbnQgPSB7XG4gICAgICBsaXN0ZW5lcnM6IG5ldyBTZXQoW2ZpbHRlcmVkTGlzdGVuZXJdKSxcbiAgICAgIHJhd0VtaXR0ZXIsXG4gICAgICB3YXRjaGVyOiBjcmVhdGVGU0V2ZW50c0luc3RhbmNlKHdhdGNoUGF0aCwgKGZ1bGxQYXRoLCBmbGFncykgPT4ge1xuICAgICAgICBpZiAoIWNvbnQubGlzdGVuZXJzLnNpemUpIHJldHVybjtcbiAgICAgICAgY29uc3QgaW5mbyA9IGZzZXZlbnRzLmdldEluZm8oZnVsbFBhdGgsIGZsYWdzKTtcbiAgICAgICAgY29udC5saXN0ZW5lcnMuZm9yRWFjaChsaXN0ID0+IHtcbiAgICAgICAgICBsaXN0KGZ1bGxQYXRoLCBmbGFncywgaW5mbyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnQucmF3RW1pdHRlcihpbmZvLmV2ZW50LCBmdWxsUGF0aCwgaW5mbyk7XG4gICAgICB9KVxuICAgIH07XG4gICAgRlNFdmVudHNXYXRjaGVycy5zZXQod2F0Y2hQYXRoLCBjb250KTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgdGhpcyBpbnN0YW5jZSdzIGxpc3RlbmVycyBhbmQgY2xvc2VzIHRoZSB1bmRlcmx5aW5nIGZzZXZlbnRzXG4gIC8vIGluc3RhbmNlIGlmIHRoZXJlIGFyZSBubyBtb3JlIGxpc3RlbmVycyBsZWZ0XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY29uc3QgbHN0ID0gY29udC5saXN0ZW5lcnM7XG5cbiAgICBsc3QuZGVsZXRlKGZpbHRlcmVkTGlzdGVuZXIpO1xuICAgIGlmICghbHN0LnNpemUpIHtcbiAgICAgIEZTRXZlbnRzV2F0Y2hlcnMuZGVsZXRlKHdhdGNoUGF0aCk7XG4gICAgICBpZiAoY29udC53YXRjaGVyKSByZXR1cm4gY29udC53YXRjaGVyLnN0b3AoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29udC5yYXdFbWl0dGVyID0gY29udC53YXRjaGVyID0gdW5kZWZpbmVkO1xuICAgICAgICBPYmplY3QuZnJlZXplKGNvbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBEZWNpZGUgd2hldGhlciBvciBub3Qgd2Ugc2hvdWxkIHN0YXJ0IGEgbmV3IGhpZ2hlci1sZXZlbFxuLy8gcGFyZW50IHdhdGNoZXJcbmNvbnN0IGNvdWxkQ29uc29saWRhdGUgPSAocGF0aCkgPT4ge1xuICBsZXQgY291bnQgPSAwO1xuICBmb3IgKGNvbnN0IHdhdGNoUGF0aCBvZiBGU0V2ZW50c1dhdGNoZXJzLmtleXMoKSkge1xuICAgIGlmICh3YXRjaFBhdGguaW5kZXhPZihwYXRoKSA9PT0gMCkge1xuICAgICAgY291bnQrKztcbiAgICAgIGlmIChjb3VudCA+PSBjb25zb2xpZGF0ZVRocmVzaGhvbGQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciBmc2V2ZW50cyBjYW4gYmUgdXNlZFxuY29uc3QgY2FuVXNlID0gKCkgPT4gZnNldmVudHMgJiYgRlNFdmVudHNXYXRjaGVycy5zaXplIDwgMTI4O1xuXG4vLyBkZXRlcm1pbmVzIHN1YmRpcmVjdG9yeSB0cmF2ZXJzYWwgbGV2ZWxzIGZyb20gcm9vdCB0byBwYXRoXG5jb25zdCBjYWxjRGVwdGggPSAocGF0aCwgcm9vdCkgPT4ge1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlICghcGF0aC5pbmRleE9mKHJvb3QpICYmIChwYXRoID0gc3lzUGF0aC5kaXJuYW1lKHBhdGgpKSAhPT0gcm9vdCkgaSsrO1xuICByZXR1cm4gaTtcbn07XG5cbi8vIHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGZzZXZlbnRzJyBldmVudCBpbmZvIGhhcyB0aGUgc2FtZSB0eXBlXG4vLyBhcyB0aGUgb25lIHJldHVybmVkIGJ5IGZzLnN0YXRcbmNvbnN0IHNhbWVUeXBlcyA9IChpbmZvLCBzdGF0cykgPT4gKFxuICBpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9ESVJFQ1RPUlkgJiYgc3RhdHMuaXNEaXJlY3RvcnkoKSB8fFxuICBpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9TWU1MSU5LICYmIHN0YXRzLmlzU3ltYm9saWNMaW5rKCkgfHxcbiAgaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfRklMRSAmJiBzdGF0cy5pc0ZpbGUoKVxuKVxuXG4vKipcbiAqIEBtaXhpblxuICovXG5jbGFzcyBGc0V2ZW50c0hhbmRsZXIge1xuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9pbmRleCcpLkZTV2F0Y2hlcn0gZnN3XG4gKi9cbmNvbnN0cnVjdG9yKGZzdykge1xuICB0aGlzLmZzdyA9IGZzdztcbn1cbmNoZWNrSWdub3JlZChwYXRoLCBzdGF0cykge1xuICBjb25zdCBpcGF0aHMgPSB0aGlzLmZzdy5faWdub3JlZFBhdGhzO1xuICBpZiAodGhpcy5mc3cuX2lzSWdub3JlZChwYXRoLCBzdGF0cykpIHtcbiAgICBpcGF0aHMuYWRkKHBhdGgpO1xuICAgIGlmIChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBpcGF0aHMuYWRkKHBhdGggKyBST09UX0dMT0JTVEFSKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpcGF0aHMuZGVsZXRlKHBhdGgpO1xuICBpcGF0aHMuZGVsZXRlKHBhdGggKyBST09UX0dMT0JTVEFSKTtcbn1cblxuYWRkT3JDaGFuZ2UocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpIHtcbiAgY29uc3QgZXZlbnQgPSB3YXRjaGVkRGlyLmhhcyhpdGVtKSA/IEVWX0NIQU5HRSA6IEVWX0FERDtcbiAgdGhpcy5oYW5kbGVFdmVudChldmVudCwgcGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xufVxuXG5hc3luYyBjaGVja0V4aXN0cyhwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cykge1xuICB0cnkge1xuICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgc3RhdChwYXRoKVxuICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAoc2FtZVR5cGVzKGluZm8sIHN0YXRzKSkge1xuICAgICAgdGhpcy5hZGRPckNoYW5nZShwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlRXZlbnQoRVZfVU5MSU5LLCBwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvci5jb2RlID09PSAnRUFDQ0VTJykge1xuICAgICAgdGhpcy5hZGRPckNoYW5nZShwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlRXZlbnQoRVZfVU5MSU5LLCBwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfVxuICB9XG59XG5cbmhhbmRsZUV2ZW50KGV2ZW50LCBwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cykge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkIHx8IHRoaXMuY2hlY2tJZ25vcmVkKHBhdGgpKSByZXR1cm47XG5cbiAgaWYgKGV2ZW50ID09PSBFVl9VTkxJTkspIHtcbiAgICBjb25zdCBpc0RpcmVjdG9yeSA9IGluZm8udHlwZSA9PT0gRlNFVkVOVF9UWVBFX0RJUkVDVE9SWVxuICAgIC8vIHN1cHByZXNzIHVubGluayBldmVudHMgb24gbmV2ZXIgYmVmb3JlIHNlZW4gZmlsZXNcbiAgICBpZiAoaXNEaXJlY3RvcnkgfHwgd2F0Y2hlZERpci5oYXMoaXRlbSkpIHtcbiAgICAgIHRoaXMuZnN3Ll9yZW1vdmUocGFyZW50LCBpdGVtLCBpc0RpcmVjdG9yeSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChldmVudCA9PT0gRVZfQUREKSB7XG4gICAgICAvLyB0cmFjayBuZXcgZGlyZWN0b3JpZXNcbiAgICAgIGlmIChpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9ESVJFQ1RPUlkpIHRoaXMuZnN3Ll9nZXRXYXRjaGVkRGlyKHBhdGgpO1xuXG4gICAgICBpZiAoaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfU1lNTElOSyAmJiBvcHRzLmZvbGxvd1N5bWxpbmtzKSB7XG4gICAgICAgIC8vIHB1c2ggc3ltbGlua3MgYmFjayB0byB0aGUgdG9wIG9mIHRoZSBzdGFjayB0byBnZXQgaGFuZGxlZFxuICAgICAgICBjb25zdCBjdXJEZXB0aCA9IG9wdHMuZGVwdGggPT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgdW5kZWZpbmVkIDogY2FsY0RlcHRoKGZ1bGxQYXRoLCByZWFsUGF0aCkgKyAxO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkVG9Gc0V2ZW50cyhwYXRoLCBmYWxzZSwgdHJ1ZSwgY3VyRGVwdGgpO1xuICAgICAgfVxuXG4gICAgICAvLyB0cmFjayBuZXcgcGF0aHNcbiAgICAgIC8vIChvdGhlciB0aGFuIHN5bWxpbmtzIGJlaW5nIGZvbGxvd2VkLCB3aGljaCB3aWxsIGJlIHRyYWNrZWQgc29vbilcbiAgICAgIHRoaXMuZnN3Ll9nZXRXYXRjaGVkRGlyKHBhcmVudCkuYWRkKGl0ZW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7J2FkZCd8J2FkZERpcid8J3VubGluayd8J3VubGlua0Rpcid9XG4gICAgICovXG4gICAgY29uc3QgZXZlbnROYW1lID0gaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfRElSRUNUT1JZID8gZXZlbnQgKyBESVJfU1VGRklYIDogZXZlbnQ7XG4gICAgdGhpcy5mc3cuX2VtaXQoZXZlbnROYW1lLCBwYXRoKTtcbiAgICBpZiAoZXZlbnROYW1lID09PSBFVl9BRERfRElSKSB0aGlzLl9hZGRUb0ZzRXZlbnRzKHBhdGgsIGZhbHNlLCB0cnVlKTtcbiAgfVxufVxuXG4vKipcbiAqIEhhbmRsZSBzeW1saW5rcyBlbmNvdW50ZXJlZCBkdXJpbmcgZGlyZWN0b3J5IHNjYW5cbiAqIEBwYXJhbSB7U3RyaW5nfSB3YXRjaFBhdGggIC0gZmlsZS9kaXIgcGF0aCB0byBiZSB3YXRjaGVkIHdpdGggZnNldmVudHNcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWFsUGF0aCAgIC0gcmVhbCBwYXRoIChpbiBjYXNlIG9mIHN5bWxpbmtzKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtICAtIHBhdGggdHJhbnNmb3JtZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdsb2JGaWx0ZXIgLSBwYXRoIGZpbHRlciBpbiBjYXNlIGEgZ2xvYiBwYXR0ZXJuIHdhcyBwcm92aWRlZFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBjbG9zZXIgZm9yIHRoZSB3YXRjaGVyIGluc3RhbmNlXG4qL1xuX3dhdGNoV2l0aEZzRXZlbnRzKHdhdGNoUGF0aCwgcmVhbFBhdGgsIHRyYW5zZm9ybSwgZ2xvYkZpbHRlcikge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkIHx8IHRoaXMuZnN3Ll9pc0lnbm9yZWQod2F0Y2hQYXRoKSkgcmV0dXJuO1xuICBjb25zdCBvcHRzID0gdGhpcy5mc3cub3B0aW9ucztcbiAgY29uc3Qgd2F0Y2hDYWxsYmFjayA9IGFzeW5jIChmdWxsUGF0aCwgZmxhZ3MsIGluZm8pID0+IHtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKFxuICAgICAgb3B0cy5kZXB0aCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBjYWxjRGVwdGgoZnVsbFBhdGgsIHJlYWxQYXRoKSA+IG9wdHMuZGVwdGhcbiAgICApIHJldHVybjtcbiAgICBjb25zdCBwYXRoID0gdHJhbnNmb3JtKHN5c1BhdGguam9pbihcbiAgICAgIHdhdGNoUGF0aCwgc3lzUGF0aC5yZWxhdGl2ZSh3YXRjaFBhdGgsIGZ1bGxQYXRoKVxuICAgICkpO1xuICAgIGlmIChnbG9iRmlsdGVyICYmICFnbG9iRmlsdGVyKHBhdGgpKSByZXR1cm47XG4gICAgLy8gZW5zdXJlIGRpcmVjdG9yaWVzIGFyZSB0cmFja2VkXG4gICAgY29uc3QgcGFyZW50ID0gc3lzUGF0aC5kaXJuYW1lKHBhdGgpO1xuICAgIGNvbnN0IGl0ZW0gPSBzeXNQYXRoLmJhc2VuYW1lKHBhdGgpO1xuICAgIGNvbnN0IHdhdGNoZWREaXIgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihcbiAgICAgIGluZm8udHlwZSA9PT0gRlNFVkVOVF9UWVBFX0RJUkVDVE9SWSA/IHBhdGggOiBwYXJlbnRcbiAgICApO1xuXG4gICAgLy8gY29ycmVjdCBmb3Igd3JvbmcgZXZlbnRzIGVtaXR0ZWRcbiAgICBpZiAod3JvbmdFdmVudEZsYWdzLmhhcyhmbGFncykgfHwgaW5mby5ldmVudCA9PT0gRlNFVkVOVF9VTktOT1dOKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdHMuaWdub3JlZCA9PT0gRlVOQ1RJT05fVFlQRSkge1xuICAgICAgICBsZXQgc3RhdHM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc3RhdHMgPSBhd2FpdCBzdGF0KHBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5jaGVja0lnbm9yZWQocGF0aCwgc3RhdHMpKSByZXR1cm47XG4gICAgICAgIGlmIChzYW1lVHlwZXMoaW5mbywgc3RhdHMpKSB7XG4gICAgICAgICAgdGhpcy5hZGRPckNoYW5nZShwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVFdmVudChFVl9VTkxJTkssIHBhdGgsIGZ1bGxQYXRoLCByZWFsUGF0aCwgcGFyZW50LCB3YXRjaGVkRGlyLCBpdGVtLCBpbmZvLCBvcHRzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jaGVja0V4aXN0cyhwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoaW5mby5ldmVudCkge1xuICAgICAgY2FzZSBGU0VWRU5UX0NSRUFURUQ6XG4gICAgICBjYXNlIEZTRVZFTlRfTU9ESUZJRUQ6XG4gICAgICAgIHJldHVybiB0aGlzLmFkZE9yQ2hhbmdlKHBhdGgsIGZ1bGxQYXRoLCByZWFsUGF0aCwgcGFyZW50LCB3YXRjaGVkRGlyLCBpdGVtLCBpbmZvLCBvcHRzKTtcbiAgICAgIGNhc2UgRlNFVkVOVF9ERUxFVEVEOlxuICAgICAgY2FzZSBGU0VWRU5UX01PVkVEOlxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja0V4aXN0cyhwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNsb3NlciA9IHNldEZTRXZlbnRzTGlzdGVuZXIoXG4gICAgd2F0Y2hQYXRoLFxuICAgIHJlYWxQYXRoLFxuICAgIHdhdGNoQ2FsbGJhY2ssXG4gICAgdGhpcy5mc3cuX2VtaXRSYXdcbiAgKTtcblxuICB0aGlzLmZzdy5fZW1pdFJlYWR5KCk7XG4gIHJldHVybiBjbG9zZXI7XG59XG5cbi8qKlxuICogSGFuZGxlIHN5bWxpbmtzIGVuY291bnRlcmVkIGR1cmluZyBkaXJlY3Rvcnkgc2NhblxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmtQYXRoIHBhdGggdG8gc3ltbGlua1xuICogQHBhcmFtIHtTdHJpbmd9IGZ1bGxQYXRoIGFic29sdXRlIHBhdGggdG8gdGhlIHN5bWxpbmtcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBwcmUtZXhpc3RpbmcgcGF0aCB0cmFuc2Zvcm1lclxuICogQHBhcmFtIHtOdW1iZXJ9IGN1ckRlcHRoIGxldmVsIG9mIHN1YmRpcmVjdG9yaWVzIHRyYXZlcnNlZCB0byB3aGVyZSBzeW1saW5rIGlzXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAqL1xuYXN5bmMgX2hhbmRsZUZzRXZlbnRzU3ltbGluayhsaW5rUGF0aCwgZnVsbFBhdGgsIHRyYW5zZm9ybSwgY3VyRGVwdGgpIHtcbiAgLy8gZG9uJ3QgZm9sbG93IHRoZSBzYW1lIHN5bWxpbmsgbW9yZSB0aGFuIG9uY2VcbiAgaWYgKHRoaXMuZnN3LmNsb3NlZCB8fCB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLmhhcyhmdWxsUGF0aCkpIHJldHVybjtcblxuICB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLnNldChmdWxsUGF0aCwgdHJ1ZSk7XG4gIHRoaXMuZnN3Ll9pbmNyUmVhZHlDb3VudCgpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgbGlua1RhcmdldCA9IGF3YWl0IHJlYWxwYXRoKGxpbmtQYXRoKTtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZnN3Ll9pc0lnbm9yZWQobGlua1RhcmdldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmZzdy5fZW1pdFJlYWR5KCk7XG4gICAgfVxuXG4gICAgdGhpcy5mc3cuX2luY3JSZWFkeUNvdW50KCk7XG5cbiAgICAvLyBhZGQgdGhlIGxpbmtUYXJnZXQgZm9yIHdhdGNoaW5nIHdpdGggYSB3cmFwcGVyIGZvciB0cmFuc2Zvcm1cbiAgICAvLyB0aGF0IGNhdXNlcyBlbWl0dGVkIHBhdGhzIHRvIGluY29ycG9yYXRlIHRoZSBsaW5rJ3MgcGF0aFxuICAgIHRoaXMuX2FkZFRvRnNFdmVudHMobGlua1RhcmdldCB8fCBsaW5rUGF0aCwgKHBhdGgpID0+IHtcbiAgICAgIGxldCBhbGlhc2VkUGF0aCA9IGxpbmtQYXRoO1xuICAgICAgaWYgKGxpbmtUYXJnZXQgJiYgbGlua1RhcmdldCAhPT0gRE9UX1NMQVNIKSB7XG4gICAgICAgIGFsaWFzZWRQYXRoID0gcGF0aC5yZXBsYWNlKGxpbmtUYXJnZXQsIGxpbmtQYXRoKTtcbiAgICAgIH0gZWxzZSBpZiAocGF0aCAhPT0gRE9UX1NMQVNIKSB7XG4gICAgICAgIGFsaWFzZWRQYXRoID0gc3lzUGF0aC5qb2luKGxpbmtQYXRoLCBwYXRoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cmFuc2Zvcm0oYWxpYXNlZFBhdGgpO1xuICAgIH0sIGZhbHNlLCBjdXJEZXB0aCk7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBpZiAodGhpcy5mc3cuX2hhbmRsZUVycm9yKGVycm9yKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtQYXRofSBuZXdQYXRoXG4gKiBAcGFyYW0ge2ZzLlN0YXRzfSBzdGF0c1xuICovXG5lbWl0QWRkKG5ld1BhdGgsIHN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpIHtcbiAgY29uc3QgcHAgPSBwcm9jZXNzUGF0aChuZXdQYXRoKTtcbiAgY29uc3QgaXNEaXIgPSBzdGF0cy5pc0RpcmVjdG9yeSgpO1xuICBjb25zdCBkaXJPYmogPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihzeXNQYXRoLmRpcm5hbWUocHApKTtcbiAgY29uc3QgYmFzZSA9IHN5c1BhdGguYmFzZW5hbWUocHApO1xuXG4gIC8vIGVuc3VyZSBlbXB0eSBkaXJzIGdldCB0cmFja2VkXG4gIGlmIChpc0RpcikgdGhpcy5mc3cuX2dldFdhdGNoZWREaXIocHApO1xuICBpZiAoZGlyT2JqLmhhcyhiYXNlKSkgcmV0dXJuO1xuICBkaXJPYmouYWRkKGJhc2UpO1xuXG4gIGlmICghb3B0cy5pZ25vcmVJbml0aWFsIHx8IGZvcmNlQWRkID09PSB0cnVlKSB7XG4gICAgdGhpcy5mc3cuX2VtaXQoaXNEaXIgPyBFVl9BRERfRElSIDogRVZfQURELCBwcCwgc3RhdHMpO1xuICB9XG59XG5cbmluaXRXYXRjaChyZWFsUGF0aCwgcGF0aCwgd2gsIHByb2Nlc3NQYXRoKSB7XG4gIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgY29uc3QgY2xvc2VyID0gdGhpcy5fd2F0Y2hXaXRoRnNFdmVudHMoXG4gICAgd2gud2F0Y2hQYXRoLFxuICAgIHN5c1BhdGgucmVzb2x2ZShyZWFsUGF0aCB8fCB3aC53YXRjaFBhdGgpLFxuICAgIHByb2Nlc3NQYXRoLFxuICAgIHdoLmdsb2JGaWx0ZXJcbiAgKTtcbiAgdGhpcy5mc3cuX2FkZFBhdGhDbG9zZXIocGF0aCwgY2xvc2VyKTtcbn1cblxuLyoqXG4gKiBIYW5kbGUgYWRkZWQgcGF0aCB3aXRoIGZzZXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBmaWxlL2RpciBwYXRoIG9yIGdsb2IgcGF0dGVyblxuICogQHBhcmFtIHtGdW5jdGlvbnxCb29sZWFuPX0gdHJhbnNmb3JtIGNvbnZlcnRzIHdvcmtpbmcgcGF0aCB0byB3aGF0IHRoZSB1c2VyIGV4cGVjdHNcbiAqIEBwYXJhbSB7Qm9vbGVhbj19IGZvcmNlQWRkIGVuc3VyZSBhZGQgaXMgZW1pdHRlZFxuICogQHBhcmFtIHtOdW1iZXI9fSBwcmlvckRlcHRoIExldmVsIG9mIHN1YmRpcmVjdG9yaWVzIGFscmVhZHkgdHJhdmVyc2VkLlxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gKi9cbmFzeW5jIF9hZGRUb0ZzRXZlbnRzKHBhdGgsIHRyYW5zZm9ybSwgZm9yY2VBZGQsIHByaW9yRGVwdGgpIHtcbiAgaWYgKHRoaXMuZnN3LmNsb3NlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBvcHRzID0gdGhpcy5mc3cub3B0aW9ucztcbiAgY29uc3QgcHJvY2Vzc1BhdGggPSB0eXBlb2YgdHJhbnNmb3JtID09PSBGVU5DVElPTl9UWVBFID8gdHJhbnNmb3JtIDogSURFTlRJVFlfRk47XG5cbiAgY29uc3Qgd2ggPSB0aGlzLmZzdy5fZ2V0V2F0Y2hIZWxwZXJzKHBhdGgpO1xuXG4gIC8vIGV2YWx1YXRlIHdoYXQgaXMgYXQgdGhlIHBhdGggd2UncmUgYmVpbmcgYXNrZWQgdG8gd2F0Y2hcbiAgdHJ5IHtcbiAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHN0YXRNZXRob2RzW3doLnN0YXRNZXRob2RdKHdoLndhdGNoUGF0aCk7XG4gICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZzdy5faXNJZ25vcmVkKHdoLndhdGNoUGF0aCwgc3RhdHMpKSB7XG4gICAgICB0aHJvdyBudWxsO1xuICAgIH1cbiAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgLy8gZW1pdCBhZGREaXIgdW5sZXNzIHRoaXMgaXMgYSBnbG9iIHBhcmVudFxuICAgICAgaWYgKCF3aC5nbG9iRmlsdGVyKSB0aGlzLmVtaXRBZGQocHJvY2Vzc1BhdGgocGF0aCksIHN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpO1xuXG4gICAgICAvLyBkb24ndCByZWN1cnNlIGZ1cnRoZXIgaWYgaXQgd291bGQgZXhjZWVkIGRlcHRoIHNldHRpbmdcbiAgICAgIGlmIChwcmlvckRlcHRoICYmIHByaW9yRGVwdGggPiBvcHRzLmRlcHRoKSByZXR1cm47XG5cbiAgICAgIC8vIHNjYW4gdGhlIGNvbnRlbnRzIG9mIHRoZSBkaXJcbiAgICAgIHRoaXMuZnN3Ll9yZWFkZGlycCh3aC53YXRjaFBhdGgsIHtcbiAgICAgICAgZmlsZUZpbHRlcjogZW50cnkgPT4gd2guZmlsdGVyUGF0aChlbnRyeSksXG4gICAgICAgIGRpcmVjdG9yeUZpbHRlcjogZW50cnkgPT4gd2guZmlsdGVyRGlyKGVudHJ5KSxcbiAgICAgICAgLi4uRGVwdGgob3B0cy5kZXB0aCAtIChwcmlvckRlcHRoIHx8IDApKVxuICAgICAgfSkub24oU1RSX0RBVEEsIChlbnRyeSkgPT4ge1xuICAgICAgICAvLyBuZWVkIHRvIGNoZWNrIGZpbHRlclBhdGggb24gZGlycyBiL2MgZmlsdGVyRGlyIGlzIGxlc3MgcmVzdHJpY3RpdmVcbiAgICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW50cnkuc3RhdHMuaXNEaXJlY3RvcnkoKSAmJiAhd2guZmlsdGVyUGF0aChlbnRyeSkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBqb2luZWRQYXRoID0gc3lzUGF0aC5qb2luKHdoLndhdGNoUGF0aCwgZW50cnkucGF0aCk7XG4gICAgICAgIGNvbnN0IHtmdWxsUGF0aH0gPSBlbnRyeTtcblxuICAgICAgICBpZiAod2guZm9sbG93U3ltbGlua3MgJiYgZW50cnkuc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgICAgIC8vIHByZXNlcnZlIHRoZSBjdXJyZW50IGRlcHRoIGhlcmUgc2luY2UgaXQgY2FuJ3QgYmUgZGVyaXZlZCBmcm9tXG4gICAgICAgICAgLy8gcmVhbCBwYXRocyBwYXN0IHRoZSBzeW1saW5rXG4gICAgICAgICAgY29uc3QgY3VyRGVwdGggPSBvcHRzLmRlcHRoID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgdW5kZWZpbmVkIDogY2FsY0RlcHRoKGpvaW5lZFBhdGgsIHN5c1BhdGgucmVzb2x2ZSh3aC53YXRjaFBhdGgpKSArIDE7XG5cbiAgICAgICAgICB0aGlzLl9oYW5kbGVGc0V2ZW50c1N5bWxpbmsoam9pbmVkUGF0aCwgZnVsbFBhdGgsIHByb2Nlc3NQYXRoLCBjdXJEZXB0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbWl0QWRkKGpvaW5lZFBhdGgsIGVudHJ5LnN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpO1xuICAgICAgICB9XG4gICAgICB9KS5vbihFVl9FUlJPUiwgRU1QVFlfRk4pLm9uKFNUUl9FTkQsICgpID0+IHtcbiAgICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdEFkZCh3aC53YXRjaFBhdGgsIHN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpO1xuICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIWVycm9yIHx8IHRoaXMuZnN3Ll9oYW5kbGVFcnJvcihlcnJvcikpIHtcbiAgICAgIC8vIFRPRE86IFN0cmFuZ2UgdGhpbmc6IFwic2hvdWxkIG5vdCBjaG9rZSBvbiBhbiBpZ25vcmVkIHdhdGNoIHBhdGhcIiB3aWxsIGJlIGZhaWxlZCB3aXRob3V0IDIgcmVhZHkgY2FsbHMgLV9fLVxuICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRzLnBlcnNpc3RlbnQgJiYgZm9yY2VBZGQgIT09IHRydWUpIHtcbiAgICBpZiAodHlwZW9mIHRyYW5zZm9ybSA9PT0gRlVOQ1RJT05fVFlQRSkge1xuICAgICAgLy8gcmVhbHBhdGggaGFzIGFscmVhZHkgYmVlbiByZXNvbHZlZFxuICAgICAgdGhpcy5pbml0V2F0Y2godW5kZWZpbmVkLCBwYXRoLCB3aCwgcHJvY2Vzc1BhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcmVhbFBhdGg7XG4gICAgICB0cnkge1xuICAgICAgICByZWFsUGF0aCA9IGF3YWl0IHJlYWxwYXRoKHdoLndhdGNoUGF0aCk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgdGhpcy5pbml0V2F0Y2gocmVhbFBhdGgsIHBhdGgsIHdoLCBwcm9jZXNzUGF0aCk7XG4gICAgfVxuICB9XG59XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGc0V2ZW50c0hhbmRsZXI7XG5tb2R1bGUuZXhwb3J0cy5jYW5Vc2UgPSBjYW5Vc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHN5c1BhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB7IHByb21pc2lmeSB9ID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgcmVhZGRpcnAgPSByZXF1aXJlKCdyZWFkZGlycCcpO1xuY29uc3QgYW55bWF0Y2ggPSByZXF1aXJlKCdhbnltYXRjaCcpLmRlZmF1bHQ7XG5jb25zdCBnbG9iUGFyZW50ID0gcmVxdWlyZSgnZ2xvYi1wYXJlbnQnKTtcbmNvbnN0IGlzR2xvYiA9IHJlcXVpcmUoJ2lzLWdsb2InKTtcbmNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuY29uc3Qgbm9ybWFsaXplUGF0aCA9IHJlcXVpcmUoJ25vcm1hbGl6ZS1wYXRoJyk7XG5cbmNvbnN0IE5vZGVGc0hhbmRsZXIgPSByZXF1aXJlKCcuL2xpYi9ub2RlZnMtaGFuZGxlcicpO1xuY29uc3QgRnNFdmVudHNIYW5kbGVyID0gcmVxdWlyZSgnLi9saWIvZnNldmVudHMtaGFuZGxlcicpO1xuY29uc3Qge1xuICBFVl9BTEwsXG4gIEVWX1JFQURZLFxuICBFVl9BREQsXG4gIEVWX0NIQU5HRSxcbiAgRVZfVU5MSU5LLFxuICBFVl9BRERfRElSLFxuICBFVl9VTkxJTktfRElSLFxuICBFVl9SQVcsXG4gIEVWX0VSUk9SLFxuXG4gIFNUUl9DTE9TRSxcbiAgU1RSX0VORCxcblxuICBCQUNLX1NMQVNIX1JFLFxuICBET1VCTEVfU0xBU0hfUkUsXG4gIFNMQVNIX09SX0JBQ0tfU0xBU0hfUkUsXG4gIERPVF9SRSxcbiAgUkVQTEFDRVJfUkUsXG5cbiAgU0xBU0gsXG4gIFNMQVNIX1NMQVNILFxuICBCUkFDRV9TVEFSVCxcbiAgQkFORyxcbiAgT05FX0RPVCxcbiAgVFdPX0RPVFMsXG4gIEdMT0JTVEFSLFxuICBTTEFTSF9HTE9CU1RBUixcbiAgQU5ZTUFUQ0hfT1BUUyxcbiAgU1RSSU5HX1RZUEUsXG4gIEZVTkNUSU9OX1RZUEUsXG4gIEVNUFRZX1NUUixcbiAgRU1QVFlfRk4sXG5cbiAgaXNXaW5kb3dzLFxuICBpc01hY29zXG59ID0gcmVxdWlyZSgnLi9saWIvY29uc3RhbnRzJyk7XG5cbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5jb25zdCByZWFkZGlyID0gcHJvbWlzaWZ5KGZzLnJlYWRkaXIpO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtTdHJpbmd9IFBhdGhcbiAqIEB0eXBlZGVmIHsnYWxsJ3wnYWRkJ3wnYWRkRGlyJ3wnY2hhbmdlJ3wndW5saW5rJ3wndW5saW5rRGlyJ3wncmF3J3wnZXJyb3InfCdyZWFkeSd9IEV2ZW50TmFtZVxuICogQHR5cGVkZWYgeydyZWFkZGlyJ3wnd2F0Y2gnfCdhZGQnfCdyZW1vdmUnfCdjaGFuZ2UnfSBUaHJvdHRsZVR5cGVcbiAqL1xuXG4vKipcbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBXYXRjaEhlbHBlcnNcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZm9sbG93U3ltbGlua3NcbiAqIEBwcm9wZXJ0eSB7J3N0YXQnfCdsc3RhdCd9IHN0YXRNZXRob2RcbiAqIEBwcm9wZXJ0eSB7UGF0aH0gcGF0aFxuICogQHByb3BlcnR5IHtQYXRofSB3YXRjaFBhdGhcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGVudHJ5UGF0aFxuICogQHByb3BlcnR5IHtCb29sZWFufSBoYXNHbG9iXG4gKiBAcHJvcGVydHkge09iamVjdH0gZ2xvYkZpbHRlclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZmlsdGVyUGF0aFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZmlsdGVyRGlyXG4gKi9cblxuY29uc3QgYXJyaWZ5ID0gKHZhbHVlID0gW10pID0+IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xuY29uc3QgZmxhdHRlbiA9IChsaXN0LCByZXN1bHQgPSBbXSkgPT4ge1xuICBsaXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGZsYXR0ZW4oaXRlbSwgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IHVuaWZ5UGF0aHMgPSAocGF0aHNfKSA9PiB7XG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXk8U3RyaW5nPn1cbiAgICovXG4gIGNvbnN0IHBhdGhzID0gZmxhdHRlbihhcnJpZnkocGF0aHNfKSk7XG4gIGlmICghcGF0aHMuZXZlcnkocCA9PiB0eXBlb2YgcCA9PT0gU1RSSU5HX1RZUEUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgTm9uLXN0cmluZyBwcm92aWRlZCBhcyB3YXRjaCBwYXRoOiAke3BhdGhzfWApO1xuICB9XG4gIHJldHVybiBwYXRocy5tYXAobm9ybWFsaXplUGF0aFRvVW5peCk7XG59O1xuXG4vLyBJZiBTTEFTSF9TTEFTSCBvY2N1cnMgYXQgdGhlIGJlZ2lubmluZyBvZiBwYXRoLCBpdCBpcyBub3QgcmVwbGFjZWRcbi8vICAgICBiZWNhdXNlIFwiLy9TdG9yYWdlUEMvRHJpdmVQb29sL01vdmllc1wiIGlzIGEgdmFsaWQgbmV0d29yayBwYXRoXG5jb25zdCB0b1VuaXggPSAoc3RyaW5nKSA9PiB7XG4gIGxldCBzdHIgPSBzdHJpbmcucmVwbGFjZShCQUNLX1NMQVNIX1JFLCBTTEFTSCk7XG4gIGxldCBwcmVwZW5kID0gZmFsc2U7XG4gIGlmIChzdHIuc3RhcnRzV2l0aChTTEFTSF9TTEFTSCkpIHtcbiAgICBwcmVwZW5kID0gdHJ1ZTtcbiAgfVxuICB3aGlsZSAoc3RyLm1hdGNoKERPVUJMRV9TTEFTSF9SRSkpIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShET1VCTEVfU0xBU0hfUkUsIFNMQVNIKTtcbiAgfVxuICBpZiAocHJlcGVuZCkge1xuICAgIHN0ciA9IFNMQVNIICsgc3RyO1xuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG4vLyBPdXIgdmVyc2lvbiBvZiB1cGF0aC5ub3JtYWxpemVcbi8vIFRPRE86IHRoaXMgaXMgbm90IGVxdWFsIHRvIHBhdGgtbm9ybWFsaXplIG1vZHVsZSAtIGludmVzdGlnYXRlIHdoeVxuY29uc3Qgbm9ybWFsaXplUGF0aFRvVW5peCA9IChwYXRoKSA9PiB0b1VuaXgoc3lzUGF0aC5ub3JtYWxpemUodG9Vbml4KHBhdGgpKSk7XG5cbmNvbnN0IG5vcm1hbGl6ZUlnbm9yZWQgPSAoY3dkID0gRU1QVFlfU1RSKSA9PiAocGF0aCkgPT4ge1xuICBpZiAodHlwZW9mIHBhdGggIT09IFNUUklOR19UWVBFKSByZXR1cm4gcGF0aDtcbiAgcmV0dXJuIG5vcm1hbGl6ZVBhdGhUb1VuaXgoc3lzUGF0aC5pc0Fic29sdXRlKHBhdGgpID8gcGF0aCA6IHN5c1BhdGguam9pbihjd2QsIHBhdGgpKTtcbn07XG5cbmNvbnN0IGdldEFic29sdXRlUGF0aCA9IChwYXRoLCBjd2QpID0+IHtcbiAgaWYgKHN5c1BhdGguaXNBYnNvbHV0ZShwYXRoKSkge1xuICAgIHJldHVybiBwYXRoO1xuICB9XG4gIGlmIChwYXRoLnN0YXJ0c1dpdGgoQkFORykpIHtcbiAgICByZXR1cm4gQkFORyArIHN5c1BhdGguam9pbihjd2QsIHBhdGguc2xpY2UoMSkpO1xuICB9XG4gIHJldHVybiBzeXNQYXRoLmpvaW4oY3dkLCBwYXRoKTtcbn07XG5cbmNvbnN0IHVuZGVmID0gKG9wdHMsIGtleSkgPT4gb3B0c1trZXldID09PSB1bmRlZmluZWQ7XG5cbi8qKlxuICogRGlyZWN0b3J5IGVudHJ5LlxuICogQHByb3BlcnR5IHtQYXRofSBwYXRoXG4gKiBAcHJvcGVydHkge1NldDxQYXRoPn0gaXRlbXNcbiAqL1xuY2xhc3MgRGlyRW50cnkge1xuICAvKipcbiAgICogQHBhcmFtIHtQYXRofSBkaXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVtb3ZlV2F0Y2hlclxuICAgKi9cbiAgY29uc3RydWN0b3IoZGlyLCByZW1vdmVXYXRjaGVyKSB7XG4gICAgdGhpcy5wYXRoID0gZGlyO1xuICAgIHRoaXMuX3JlbW92ZVdhdGNoZXIgPSByZW1vdmVXYXRjaGVyO1xuICAgIC8qKiBAdHlwZSB7U2V0PFBhdGg+fSAqL1xuICAgIHRoaXMuaXRlbXMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBhZGQoaXRlbSkge1xuICAgIGNvbnN0IHtpdGVtc30gPSB0aGlzO1xuICAgIGlmICghaXRlbXMpIHJldHVybjtcbiAgICBpZiAoaXRlbSAhPT0gT05FX0RPVCAmJiBpdGVtICE9PSBUV09fRE9UUykgaXRlbXMuYWRkKGl0ZW0pO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlKGl0ZW0pIHtcbiAgICBjb25zdCB7aXRlbXN9ID0gdGhpcztcbiAgICBpZiAoIWl0ZW1zKSByZXR1cm47XG4gICAgaXRlbXMuZGVsZXRlKGl0ZW0pO1xuICAgIGlmIChpdGVtcy5zaXplID4gMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGlyID0gdGhpcy5wYXRoO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCByZWFkZGlyKGRpcik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy5fcmVtb3ZlV2F0Y2hlcikge1xuICAgICAgICB0aGlzLl9yZW1vdmVXYXRjaGVyKHN5c1BhdGguZGlybmFtZShkaXIpLCBzeXNQYXRoLmJhc2VuYW1lKGRpcikpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhcyhpdGVtKSB7XG4gICAgY29uc3Qge2l0ZW1zfSA9IHRoaXM7XG4gICAgaWYgKCFpdGVtcykgcmV0dXJuO1xuICAgIHJldHVybiBpdGVtcy5oYXMoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge0FycmF5PFN0cmluZz59XG4gICAqL1xuICBnZXRDaGlsZHJlbigpIHtcbiAgICBjb25zdCB7aXRlbXN9ID0gdGhpcztcbiAgICBpZiAoIWl0ZW1zKSByZXR1cm47XG4gICAgcmV0dXJuIFsuLi5pdGVtcy52YWx1ZXMoKV07XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuaXRlbXMuY2xlYXIoKTtcbiAgICBkZWxldGUgdGhpcy5wYXRoO1xuICAgIGRlbGV0ZSB0aGlzLl9yZW1vdmVXYXRjaGVyO1xuICAgIGRlbGV0ZSB0aGlzLml0ZW1zO1xuICAgIE9iamVjdC5mcmVlemUodGhpcyk7XG4gIH1cbn1cblxuY29uc3QgU1RBVF9NRVRIT0RfRiA9ICdzdGF0JztcbmNvbnN0IFNUQVRfTUVUSE9EX0wgPSAnbHN0YXQnO1xuY2xhc3MgV2F0Y2hIZWxwZXIge1xuICBjb25zdHJ1Y3RvcihwYXRoLCB3YXRjaFBhdGgsIGZvbGxvdywgZnN3KSB7XG4gICAgdGhpcy5mc3cgPSBmc3c7XG4gICAgdGhpcy5wYXRoID0gcGF0aCA9IHBhdGgucmVwbGFjZShSRVBMQUNFUl9SRSwgRU1QVFlfU1RSKTtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmZ1bGxXYXRjaFBhdGggPSBzeXNQYXRoLnJlc29sdmUod2F0Y2hQYXRoKTtcbiAgICB0aGlzLmhhc0dsb2IgPSB3YXRjaFBhdGggIT09IHBhdGg7XG4gICAgLyoqIEB0eXBlIHtvYmplY3R8Ym9vbGVhbn0gKi9cbiAgICBpZiAocGF0aCA9PT0gRU1QVFlfU1RSKSB0aGlzLmhhc0dsb2IgPSBmYWxzZTtcbiAgICB0aGlzLmdsb2JTeW1saW5rID0gdGhpcy5oYXNHbG9iICYmIGZvbGxvdyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgIHRoaXMuZ2xvYkZpbHRlciA9IHRoaXMuaGFzR2xvYiA/IGFueW1hdGNoKHBhdGgsIHVuZGVmaW5lZCwgQU5ZTUFUQ0hfT1BUUykgOiBmYWxzZTtcbiAgICB0aGlzLmRpclBhcnRzID0gdGhpcy5nZXREaXJQYXJ0cyhwYXRoKTtcbiAgICB0aGlzLmRpclBhcnRzLmZvckVhY2goKHBhcnRzKSA9PiB7XG4gICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkgcGFydHMucG9wKCk7XG4gICAgfSk7XG4gICAgdGhpcy5mb2xsb3dTeW1saW5rcyA9IGZvbGxvdztcbiAgICB0aGlzLnN0YXRNZXRob2QgPSBmb2xsb3cgPyBTVEFUX01FVEhPRF9GIDogU1RBVF9NRVRIT0RfTDtcbiAgfVxuXG4gIGNoZWNrR2xvYlN5bWxpbmsoZW50cnkpIHtcbiAgICAvLyBvbmx5IG5lZWQgdG8gcmVzb2x2ZSBvbmNlXG4gICAgLy8gZmlyc3QgZW50cnkgc2hvdWxkIGFsd2F5cyBoYXZlIGVudHJ5LnBhcmVudERpciA9PT0gRU1QVFlfU1RSXG4gICAgaWYgKHRoaXMuZ2xvYlN5bWxpbmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5nbG9iU3ltbGluayA9IGVudHJ5LmZ1bGxQYXJlbnREaXIgPT09IHRoaXMuZnVsbFdhdGNoUGF0aCA/XG4gICAgICAgIGZhbHNlIDoge3JlYWxQYXRoOiBlbnRyeS5mdWxsUGFyZW50RGlyLCBsaW5rUGF0aDogdGhpcy5mdWxsV2F0Y2hQYXRofTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nbG9iU3ltbGluaykge1xuICAgICAgcmV0dXJuIGVudHJ5LmZ1bGxQYXRoLnJlcGxhY2UodGhpcy5nbG9iU3ltbGluay5yZWFsUGF0aCwgdGhpcy5nbG9iU3ltbGluay5saW5rUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudHJ5LmZ1bGxQYXRoO1xuICB9XG5cbiAgZW50cnlQYXRoKGVudHJ5KSB7XG4gICAgcmV0dXJuIHN5c1BhdGguam9pbih0aGlzLndhdGNoUGF0aCxcbiAgICAgIHN5c1BhdGgucmVsYXRpdmUodGhpcy53YXRjaFBhdGgsIHRoaXMuY2hlY2tHbG9iU3ltbGluayhlbnRyeSkpXG4gICAgKTtcbiAgfVxuXG4gIGZpbHRlclBhdGgoZW50cnkpIHtcbiAgICBjb25zdCB7c3RhdHN9ID0gZW50cnk7XG4gICAgaWYgKHN0YXRzICYmIHN0YXRzLmlzU3ltYm9saWNMaW5rKCkpIHJldHVybiB0aGlzLmZpbHRlckRpcihlbnRyeSk7XG4gICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gdGhpcy5lbnRyeVBhdGgoZW50cnkpO1xuICAgIGNvbnN0IG1hdGNoZXNHbG9iID0gdGhpcy5oYXNHbG9iICYmIHR5cGVvZiB0aGlzLmdsb2JGaWx0ZXIgPT09IEZVTkNUSU9OX1RZUEUgP1xuICAgICAgdGhpcy5nbG9iRmlsdGVyKHJlc29sdmVkUGF0aCkgOiB0cnVlO1xuICAgIHJldHVybiBtYXRjaGVzR2xvYiAmJlxuICAgICAgdGhpcy5mc3cuX2lzbnRJZ25vcmVkKHJlc29sdmVkUGF0aCwgc3RhdHMpICYmXG4gICAgICB0aGlzLmZzdy5faGFzUmVhZFBlcm1pc3Npb25zKHN0YXRzKTtcbiAgfVxuXG4gIGdldERpclBhcnRzKHBhdGgpIHtcbiAgICBpZiAoIXRoaXMuaGFzR2xvYikgcmV0dXJuIFtdO1xuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgY29uc3QgZXhwYW5kZWRQYXRoID0gcGF0aC5pbmNsdWRlcyhCUkFDRV9TVEFSVCkgPyBicmFjZXMuZXhwYW5kKHBhdGgpIDogW3BhdGhdO1xuICAgIGV4cGFuZGVkUGF0aC5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICBwYXJ0cy5wdXNoKHN5c1BhdGgucmVsYXRpdmUodGhpcy53YXRjaFBhdGgsIHBhdGgpLnNwbGl0KFNMQVNIX09SX0JBQ0tfU0xBU0hfUkUpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcGFydHM7XG4gIH1cblxuICBmaWx0ZXJEaXIoZW50cnkpIHtcbiAgICBpZiAodGhpcy5oYXNHbG9iKSB7XG4gICAgICBjb25zdCBlbnRyeVBhcnRzID0gdGhpcy5nZXREaXJQYXJ0cyh0aGlzLmNoZWNrR2xvYlN5bWxpbmsoZW50cnkpKTtcbiAgICAgIGxldCBnbG9ic3RhciA9IGZhbHNlO1xuICAgICAgdGhpcy51bm1hdGNoZWRHbG9iID0gIXRoaXMuZGlyUGFydHMuc29tZSgocGFydHMpID0+IHtcbiAgICAgICAgcmV0dXJuIHBhcnRzLmV2ZXJ5KChwYXJ0LCBpKSA9PiB7XG4gICAgICAgICAgaWYgKHBhcnQgPT09IEdMT0JTVEFSKSBnbG9ic3RhciA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGdsb2JzdGFyIHx8ICFlbnRyeVBhcnRzWzBdW2ldIHx8IGFueW1hdGNoKHBhcnQsIGVudHJ5UGFydHNbMF1baV0sIEFOWU1BVENIX09QVFMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gIXRoaXMudW5tYXRjaGVkR2xvYiAmJiB0aGlzLmZzdy5faXNudElnbm9yZWQodGhpcy5lbnRyeVBhdGgoZW50cnkpLCBlbnRyeS5zdGF0cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBXYXRjaGVzIGZpbGVzICYgZGlyZWN0b3JpZXMgZm9yIGNoYW5nZXMuIEVtaXR0ZWQgZXZlbnRzOlxuICogYGFkZGAsIGBhZGREaXJgLCBgY2hhbmdlYCwgYHVubGlua2AsIGB1bmxpbmtEaXJgLCBgYWxsYCwgYGVycm9yYFxuICpcbiAqICAgICBuZXcgRlNXYXRjaGVyKClcbiAqICAgICAgIC5hZGQoZGlyZWN0b3JpZXMpXG4gKiAgICAgICAub24oJ2FkZCcsIHBhdGggPT4gbG9nKCdGaWxlJywgcGF0aCwgJ3dhcyBhZGRlZCcpKVxuICovXG5jbGFzcyBGU1dhdGNoZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuLy8gTm90IGluZGVudGluZyBtZXRob2RzIGZvciBoaXN0b3J5IHNha2U7IGZvciBub3cuXG5jb25zdHJ1Y3Rvcihfb3B0cykge1xuICBzdXBlcigpO1xuXG4gIGNvbnN0IG9wdHMgPSB7fTtcbiAgaWYgKF9vcHRzKSBPYmplY3QuYXNzaWduKG9wdHMsIF9vcHRzKTsgLy8gZm9yIGZyb3plbiBvYmplY3RzXG5cbiAgLyoqIEB0eXBlIHtNYXA8U3RyaW5nLCBEaXJFbnRyeT59ICovXG4gIHRoaXMuX3dhdGNoZWQgPSBuZXcgTWFwKCk7XG4gIC8qKiBAdHlwZSB7TWFwPFN0cmluZywgQXJyYXk+fSAqL1xuICB0aGlzLl9jbG9zZXJzID0gbmV3IE1hcCgpO1xuICAvKiogQHR5cGUge1NldDxTdHJpbmc+fSAqL1xuICB0aGlzLl9pZ25vcmVkUGF0aHMgPSBuZXcgU2V0KCk7XG5cbiAgLyoqIEB0eXBlIHtNYXA8VGhyb3R0bGVUeXBlLCBNYXA+fSAqL1xuICB0aGlzLl90aHJvdHRsZWQgPSBuZXcgTWFwKCk7XG5cbiAgLyoqIEB0eXBlIHtNYXA8UGF0aCwgU3RyaW5nfEJvb2xlYW4+fSAqL1xuICB0aGlzLl9zeW1saW5rUGF0aHMgPSBuZXcgTWFwKCk7XG5cbiAgdGhpcy5fc3RyZWFtcyA9IG5ldyBTZXQoKTtcbiAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcblxuICAvLyBTZXQgdXAgZGVmYXVsdCBvcHRpb25zLlxuICBpZiAodW5kZWYob3B0cywgJ3BlcnNpc3RlbnQnKSkgb3B0cy5wZXJzaXN0ZW50ID0gdHJ1ZTtcbiAgaWYgKHVuZGVmKG9wdHMsICdpZ25vcmVJbml0aWFsJykpIG9wdHMuaWdub3JlSW5pdGlhbCA9IGZhbHNlO1xuICBpZiAodW5kZWYob3B0cywgJ2lnbm9yZVBlcm1pc3Npb25FcnJvcnMnKSkgb3B0cy5pZ25vcmVQZXJtaXNzaW9uRXJyb3JzID0gZmFsc2U7XG4gIGlmICh1bmRlZihvcHRzLCAnaW50ZXJ2YWwnKSkgb3B0cy5pbnRlcnZhbCA9IDEwMDtcbiAgaWYgKHVuZGVmKG9wdHMsICdiaW5hcnlJbnRlcnZhbCcpKSBvcHRzLmJpbmFyeUludGVydmFsID0gMzAwO1xuICBpZiAodW5kZWYob3B0cywgJ2Rpc2FibGVHbG9iYmluZycpKSBvcHRzLmRpc2FibGVHbG9iYmluZyA9IGZhbHNlO1xuICBvcHRzLmVuYWJsZUJpbmFyeUludGVydmFsID0gb3B0cy5iaW5hcnlJbnRlcnZhbCAhPT0gb3B0cy5pbnRlcnZhbDtcblxuICAvLyBFbmFibGUgZnNldmVudHMgb24gT1MgWCB3aGVuIHBvbGxpbmcgaXNuJ3QgZXhwbGljaXRseSBlbmFibGVkLlxuICBpZiAodW5kZWYob3B0cywgJ3VzZUZzRXZlbnRzJykpIG9wdHMudXNlRnNFdmVudHMgPSAhb3B0cy51c2VQb2xsaW5nO1xuXG4gIC8vIElmIHdlIGNhbid0IHVzZSBmc2V2ZW50cywgZW5zdXJlIHRoZSBvcHRpb25zIHJlZmxlY3QgaXQncyBkaXNhYmxlZC5cbiAgY29uc3QgY2FuVXNlRnNFdmVudHMgPSBGc0V2ZW50c0hhbmRsZXIuY2FuVXNlKCk7XG4gIGlmICghY2FuVXNlRnNFdmVudHMpIG9wdHMudXNlRnNFdmVudHMgPSBmYWxzZTtcblxuICAvLyBVc2UgcG9sbGluZyBvbiBNYWMgaWYgbm90IHVzaW5nIGZzZXZlbnRzLlxuICAvLyBPdGhlciBwbGF0Zm9ybXMgdXNlIG5vbi1wb2xsaW5nIGZzX3dhdGNoLlxuICBpZiAodW5kZWYob3B0cywgJ3VzZVBvbGxpbmcnKSAmJiAhb3B0cy51c2VGc0V2ZW50cykge1xuICAgIG9wdHMudXNlUG9sbGluZyA9IGlzTWFjb3M7XG4gIH1cblxuICAvLyBHbG9iYWwgb3ZlcnJpZGUgKHVzZWZ1bCBmb3IgZW5kLWRldmVsb3BlcnMgdGhhdCBuZWVkIHRvIGZvcmNlIHBvbGxpbmcgZm9yIGFsbFxuICAvLyBpbnN0YW5jZXMgb2YgY2hva2lkYXIsIHJlZ2FyZGxlc3Mgb2YgdXNhZ2UvZGVwZW5kZW5jeSBkZXB0aClcbiAgY29uc3QgZW52UG9sbCA9IHByb2Nlc3MuZW52LkNIT0tJREFSX1VTRVBPTExJTkc7XG4gIGlmIChlbnZQb2xsICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBlbnZMb3dlciA9IGVudlBvbGwudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChlbnZMb3dlciA9PT0gJ2ZhbHNlJyB8fCBlbnZMb3dlciA9PT0gJzAnKSB7XG4gICAgICBvcHRzLnVzZVBvbGxpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGVudkxvd2VyID09PSAndHJ1ZScgfHwgZW52TG93ZXIgPT09ICcxJykge1xuICAgICAgb3B0cy51c2VQb2xsaW5nID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy51c2VQb2xsaW5nID0gISFlbnZMb3dlcjtcbiAgICB9XG4gIH1cbiAgY29uc3QgZW52SW50ZXJ2YWwgPSBwcm9jZXNzLmVudi5DSE9LSURBUl9JTlRFUlZBTDtcbiAgaWYgKGVudkludGVydmFsKSB7XG4gICAgb3B0cy5pbnRlcnZhbCA9IE51bWJlci5wYXJzZUludChlbnZJbnRlcnZhbCwgMTApO1xuICB9XG5cbiAgLy8gRWRpdG9yIGF0b21pYyB3cml0ZSBub3JtYWxpemF0aW9uIGVuYWJsZWQgYnkgZGVmYXVsdCB3aXRoIGZzLndhdGNoXG4gIGlmICh1bmRlZihvcHRzLCAnYXRvbWljJykpIG9wdHMuYXRvbWljID0gIW9wdHMudXNlUG9sbGluZyAmJiAhb3B0cy51c2VGc0V2ZW50cztcbiAgaWYgKG9wdHMuYXRvbWljKSB0aGlzLl9wZW5kaW5nVW5saW5rcyA9IG5ldyBNYXAoKTtcblxuICBpZiAodW5kZWYob3B0cywgJ2ZvbGxvd1N5bWxpbmtzJykpIG9wdHMuZm9sbG93U3ltbGlua3MgPSB0cnVlO1xuXG4gIGlmICh1bmRlZihvcHRzLCAnYXdhaXRXcml0ZUZpbmlzaCcpKSBvcHRzLmF3YWl0V3JpdGVGaW5pc2ggPSBmYWxzZTtcbiAgaWYgKG9wdHMuYXdhaXRXcml0ZUZpbmlzaCA9PT0gdHJ1ZSkgb3B0cy5hd2FpdFdyaXRlRmluaXNoID0ge307XG4gIGNvbnN0IGF3ZiA9IG9wdHMuYXdhaXRXcml0ZUZpbmlzaDtcbiAgaWYgKGF3Zikge1xuICAgIGlmICghYXdmLnN0YWJpbGl0eVRocmVzaG9sZCkgYXdmLnN0YWJpbGl0eVRocmVzaG9sZCA9IDIwMDA7XG4gICAgaWYgKCFhd2YucG9sbEludGVydmFsKSBhd2YucG9sbEludGVydmFsID0gMTAwO1xuICAgIHRoaXMuX3BlbmRpbmdXcml0ZXMgPSBuZXcgTWFwKCk7XG4gIH1cbiAgaWYgKG9wdHMuaWdub3JlZCkgb3B0cy5pZ25vcmVkID0gYXJyaWZ5KG9wdHMuaWdub3JlZCk7XG5cbiAgbGV0IHJlYWR5Q2FsbHMgPSAwO1xuICB0aGlzLl9lbWl0UmVhZHkgPSAoKSA9PiB7XG4gICAgcmVhZHlDYWxscysrO1xuICAgIGlmIChyZWFkeUNhbGxzID49IHRoaXMuX3JlYWR5Q291bnQpIHtcbiAgICAgIHRoaXMuX2VtaXRSZWFkeSA9IEVNUFRZX0ZOO1xuICAgICAgdGhpcy5fcmVhZHlFbWl0dGVkID0gdHJ1ZTtcbiAgICAgIC8vIHVzZSBwcm9jZXNzLm5leHRUaWNrIHRvIGFsbG93IHRpbWUgZm9yIGxpc3RlbmVyIHRvIGJlIGJvdW5kXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHRoaXMuZW1pdChFVl9SRUFEWSkpO1xuICAgIH1cbiAgfTtcbiAgdGhpcy5fZW1pdFJhdyA9ICguLi5hcmdzKSA9PiB0aGlzLmVtaXQoRVZfUkFXLCAuLi5hcmdzKTtcbiAgdGhpcy5fcmVhZHlFbWl0dGVkID0gZmFsc2U7XG4gIHRoaXMub3B0aW9ucyA9IG9wdHM7XG5cbiAgLy8gSW5pdGlhbGl6ZSB3aXRoIHByb3BlciB3YXRjaGVyLlxuICBpZiAob3B0cy51c2VGc0V2ZW50cykge1xuICAgIHRoaXMuX2ZzRXZlbnRzSGFuZGxlciA9IG5ldyBGc0V2ZW50c0hhbmRsZXIodGhpcyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbm9kZUZzSGFuZGxlciA9IG5ldyBOb2RlRnNIYW5kbGVyKHRoaXMpO1xuICB9XG5cbiAgLy8gWW914oCZcmUgZnJvemVuIHdoZW4geW91ciBoZWFydOKAmXMgbm90IG9wZW4uXG4gIE9iamVjdC5mcmVlemUob3B0cyk7XG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbi8qKlxuICogQWRkcyBwYXRocyB0byBiZSB3YXRjaGVkIG9uIGFuIGV4aXN0aW5nIEZTV2F0Y2hlciBpbnN0YW5jZVxuICogQHBhcmFtIHtQYXRofEFycmF5PFBhdGg+fSBwYXRoc19cbiAqIEBwYXJhbSB7U3RyaW5nPX0gX29yaWdBZGQgcHJpdmF0ZTsgZm9yIGhhbmRsaW5nIG5vbi1leGlzdGVudCBwYXRocyB0byBiZSB3YXRjaGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW49fSBfaW50ZXJuYWwgcHJpdmF0ZTsgaW5kaWNhdGVzIGEgbm9uLXVzZXIgYWRkXG4gKiBAcmV0dXJucyB7RlNXYXRjaGVyfSBmb3IgY2hhaW5pbmdcbiAqL1xuYWRkKHBhdGhzXywgX29yaWdBZGQsIF9pbnRlcm5hbCkge1xuICBjb25zdCB7Y3dkLCBkaXNhYmxlR2xvYmJpbmd9ID0gdGhpcy5vcHRpb25zO1xuICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICBsZXQgcGF0aHMgPSB1bmlmeVBhdGhzKHBhdGhzXyk7XG4gIGlmIChjd2QpIHtcbiAgICBwYXRocyA9IHBhdGhzLm1hcCgocGF0aCkgPT4ge1xuICAgICAgY29uc3QgYWJzUGF0aCA9IGdldEFic29sdXRlUGF0aChwYXRoLCBjd2QpO1xuXG4gICAgICAvLyBDaGVjayBgcGF0aGAgaW5zdGVhZCBvZiBgYWJzUGF0aGAgYmVjYXVzZSB0aGUgY3dkIHBvcnRpb24gY2FuJ3QgYmUgYSBnbG9iXG4gICAgICBpZiAoZGlzYWJsZUdsb2JiaW5nIHx8ICFpc0dsb2IocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGFic1BhdGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9ybWFsaXplUGF0aChhYnNQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNldCBhc2lkZSBuZWdhdGVkIGdsb2Igc3RyaW5nc1xuICBwYXRocyA9IHBhdGhzLmZpbHRlcigocGF0aCkgPT4ge1xuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoQkFORykpIHtcbiAgICAgIHRoaXMuX2lnbm9yZWRQYXRocy5hZGQocGF0aC5zbGljZSgxKSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaWYgYSBwYXRoIGlzIGJlaW5nIGFkZGVkIHRoYXQgd2FzIHByZXZpb3VzbHkgaWdub3JlZCwgc3RvcCBpZ25vcmluZyBpdFxuICAgIHRoaXMuX2lnbm9yZWRQYXRocy5kZWxldGUocGF0aCk7XG4gICAgdGhpcy5faWdub3JlZFBhdGhzLmRlbGV0ZShwYXRoICsgU0xBU0hfR0xPQlNUQVIpO1xuXG4gICAgLy8gcmVzZXQgdGhlIGNhY2hlZCB1c2VySWdub3JlZCBhbnltYXRjaCBmblxuICAgIC8vIHRvIG1ha2UgaWdub3JlZFBhdGhzIGNoYW5nZXMgZWZmZWN0aXZlXG4gICAgdGhpcy5fdXNlcklnbm9yZWQgPSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG5cbiAgaWYgKHRoaXMub3B0aW9ucy51c2VGc0V2ZW50cyAmJiB0aGlzLl9mc0V2ZW50c0hhbmRsZXIpIHtcbiAgICBpZiAoIXRoaXMuX3JlYWR5Q291bnQpIHRoaXMuX3JlYWR5Q291bnQgPSBwYXRocy5sZW5ndGg7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wZXJzaXN0ZW50KSB0aGlzLl9yZWFkeUNvdW50ICo9IDI7XG4gICAgcGF0aHMuZm9yRWFjaCgocGF0aCkgPT4gdGhpcy5fZnNFdmVudHNIYW5kbGVyLl9hZGRUb0ZzRXZlbnRzKHBhdGgpKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXRoaXMuX3JlYWR5Q291bnQpIHRoaXMuX3JlYWR5Q291bnQgPSAwO1xuICAgIHRoaXMuX3JlYWR5Q291bnQgKz0gcGF0aHMubGVuZ3RoO1xuICAgIFByb21pc2UuYWxsKFxuICAgICAgcGF0aHMubWFwKGFzeW5jIHBhdGggPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9ub2RlRnNIYW5kbGVyLl9hZGRUb05vZGVGcyhwYXRoLCAhX2ludGVybmFsLCAwLCAwLCBfb3JpZ0FkZCk7XG4gICAgICAgIGlmIChyZXMpIHRoaXMuX2VtaXRSZWFkeSgpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSlcbiAgICApLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgICAgIHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbSkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgdGhpcy5hZGQoc3lzUGF0aC5kaXJuYW1lKGl0ZW0pLCBzeXNQYXRoLmJhc2VuYW1lKF9vcmlnQWRkIHx8IGl0ZW0pKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2xvc2Ugd2F0Y2hlcnMgb3Igc3RhcnQgaWdub3JpbmcgZXZlbnRzIGZyb20gc3BlY2lmaWVkIHBhdGhzLlxuICogQHBhcmFtIHtQYXRofEFycmF5PFBhdGg+fSBwYXRoc18gLSBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncywgZmlsZS9kaXJlY3RvcnkgcGF0aHMgYW5kL29yIGdsb2JzXG4gKiBAcmV0dXJucyB7RlNXYXRjaGVyfSBmb3IgY2hhaW5pbmdcbiovXG51bndhdGNoKHBhdGhzXykge1xuICBpZiAodGhpcy5jbG9zZWQpIHJldHVybiB0aGlzO1xuICBjb25zdCBwYXRocyA9IHVuaWZ5UGF0aHMocGF0aHNfKTtcbiAgY29uc3Qge2N3ZH0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgcGF0aHMuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgIC8vIGNvbnZlcnQgdG8gYWJzb2x1dGUgcGF0aCB1bmxlc3MgcmVsYXRpdmUgcGF0aCBhbHJlYWR5IG1hdGNoZXNcbiAgICBpZiAoIXN5c1BhdGguaXNBYnNvbHV0ZShwYXRoKSAmJiAhdGhpcy5fY2xvc2Vycy5oYXMocGF0aCkpIHtcbiAgICAgIGlmIChjd2QpIHBhdGggPSBzeXNQYXRoLmpvaW4oY3dkLCBwYXRoKTtcbiAgICAgIHBhdGggPSBzeXNQYXRoLnJlc29sdmUocGF0aCk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2xvc2VQYXRoKHBhdGgpO1xuXG4gICAgdGhpcy5faWdub3JlZFBhdGhzLmFkZChwYXRoKTtcbiAgICBpZiAodGhpcy5fd2F0Y2hlZC5oYXMocGF0aCkpIHtcbiAgICAgIHRoaXMuX2lnbm9yZWRQYXRocy5hZGQocGF0aCArIFNMQVNIX0dMT0JTVEFSKTtcbiAgICB9XG5cbiAgICAvLyByZXNldCB0aGUgY2FjaGVkIHVzZXJJZ25vcmVkIGFueW1hdGNoIGZuXG4gICAgLy8gdG8gbWFrZSBpZ25vcmVkUGF0aHMgY2hhbmdlcyBlZmZlY3RpdmVcbiAgICB0aGlzLl91c2VySWdub3JlZCA9IHVuZGVmaW5lZDtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2xvc2Ugd2F0Y2hlcnMgYW5kIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZyb20gd2F0Y2hlZCBwYXRocy5cbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fS5cbiovXG5jbG9zZSgpIHtcbiAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm4gdGhpcy5fY2xvc2VQcm9taXNlO1xuICB0aGlzLmNsb3NlZCA9IHRydWU7XG5cbiAgLy8gTWVtb3J5IG1hbmFnZW1lbnQuXG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIGNvbnN0IGNsb3NlcnMgPSBbXTtcbiAgdGhpcy5fY2xvc2Vycy5mb3JFYWNoKGNsb3Nlckxpc3QgPT4gY2xvc2VyTGlzdC5mb3JFYWNoKGNsb3NlciA9PiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IGNsb3NlcigpO1xuICAgIGlmIChwcm9taXNlIGluc3RhbmNlb2YgUHJvbWlzZSkgY2xvc2Vycy5wdXNoKHByb21pc2UpO1xuICB9KSk7XG4gIHRoaXMuX3N0cmVhbXMuZm9yRWFjaChzdHJlYW0gPT4gc3RyZWFtLmRlc3Ryb3koKSk7XG4gIHRoaXMuX3VzZXJJZ25vcmVkID0gdW5kZWZpbmVkO1xuICB0aGlzLl9yZWFkeUNvdW50ID0gMDtcbiAgdGhpcy5fcmVhZHlFbWl0dGVkID0gZmFsc2U7XG4gIHRoaXMuX3dhdGNoZWQuZm9yRWFjaChkaXJlbnQgPT4gZGlyZW50LmRpc3Bvc2UoKSk7XG4gIFsnY2xvc2VycycsICd3YXRjaGVkJywgJ3N0cmVhbXMnLCAnc3ltbGlua1BhdGhzJywgJ3Rocm90dGxlZCddLmZvckVhY2goa2V5ID0+IHtcbiAgICB0aGlzW2BfJHtrZXl9YF0uY2xlYXIoKTtcbiAgfSk7XG5cbiAgdGhpcy5fY2xvc2VQcm9taXNlID0gY2xvc2Vycy5sZW5ndGggPyBQcm9taXNlLmFsbChjbG9zZXJzKS50aGVuKCgpID0+IHVuZGVmaW5lZCkgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgcmV0dXJuIHRoaXMuX2Nsb3NlUHJvbWlzZTtcbn1cblxuLyoqXG4gKiBFeHBvc2UgbGlzdCBvZiB3YXRjaGVkIHBhdGhzXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBmb3IgY2hhaW5pbmdcbiovXG5nZXRXYXRjaGVkKCkge1xuICBjb25zdCB3YXRjaExpc3QgPSB7fTtcbiAgdGhpcy5fd2F0Y2hlZC5mb3JFYWNoKChlbnRyeSwgZGlyKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5vcHRpb25zLmN3ZCA/IHN5c1BhdGgucmVsYXRpdmUodGhpcy5vcHRpb25zLmN3ZCwgZGlyKSA6IGRpcjtcbiAgICB3YXRjaExpc3Rba2V5IHx8IE9ORV9ET1RdID0gZW50cnkuZ2V0Q2hpbGRyZW4oKS5zb3J0KCk7XG4gIH0pO1xuICByZXR1cm4gd2F0Y2hMaXN0O1xufVxuXG5lbWl0V2l0aEFsbChldmVudCwgYXJncykge1xuICB0aGlzLmVtaXQoLi4uYXJncyk7XG4gIGlmIChldmVudCAhPT0gRVZfRVJST1IpIHRoaXMuZW1pdChFVl9BTEwsIC4uLmFyZ3MpO1xufVxuXG4vLyBDb21tb24gaGVscGVyc1xuLy8gLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBOb3JtYWxpemUgYW5kIGVtaXQgZXZlbnRzLlxuICogQ2FsbGluZyBfZW1pdCBET0VTIE5PVCBNRUFOIGVtaXQoKSB3b3VsZCBiZSBjYWxsZWQhXG4gKiBAcGFyYW0ge0V2ZW50TmFtZX0gZXZlbnQgVHlwZSBvZiBldmVudFxuICogQHBhcmFtIHtQYXRofSBwYXRoIEZpbGUgb3IgZGlyZWN0b3J5IHBhdGhcbiAqIEBwYXJhbSB7Kj19IHZhbDEgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB3aXRoIGV2ZW50XG4gKiBAcGFyYW0geyo9fSB2YWwyXG4gKiBAcGFyYW0geyo9fSB2YWwzXG4gKiBAcmV0dXJucyB0aGUgZXJyb3IgaWYgZGVmaW5lZCwgb3RoZXJ3aXNlIHRoZSB2YWx1ZSBvZiB0aGUgRlNXYXRjaGVyIGluc3RhbmNlJ3MgYGNsb3NlZGAgZmxhZ1xuICovXG5hc3luYyBfZW1pdChldmVudCwgcGF0aCwgdmFsMSwgdmFsMiwgdmFsMykge1xuICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcblxuICBjb25zdCBvcHRzID0gdGhpcy5vcHRpb25zO1xuICBpZiAoaXNXaW5kb3dzKSBwYXRoID0gc3lzUGF0aC5ub3JtYWxpemUocGF0aCk7XG4gIGlmIChvcHRzLmN3ZCkgcGF0aCA9IHN5c1BhdGgucmVsYXRpdmUob3B0cy5jd2QsIHBhdGgpO1xuICAvKiogQHR5cGUgQXJyYXk8YW55PiAqL1xuICBjb25zdCBhcmdzID0gW2V2ZW50LCBwYXRoXTtcbiAgaWYgKHZhbDMgIT09IHVuZGVmaW5lZCkgYXJncy5wdXNoKHZhbDEsIHZhbDIsIHZhbDMpO1xuICBlbHNlIGlmICh2YWwyICE9PSB1bmRlZmluZWQpIGFyZ3MucHVzaCh2YWwxLCB2YWwyKTtcbiAgZWxzZSBpZiAodmFsMSAhPT0gdW5kZWZpbmVkKSBhcmdzLnB1c2godmFsMSk7XG5cbiAgY29uc3QgYXdmID0gb3B0cy5hd2FpdFdyaXRlRmluaXNoO1xuICBsZXQgcHc7XG4gIGlmIChhd2YgJiYgKHB3ID0gdGhpcy5fcGVuZGluZ1dyaXRlcy5nZXQocGF0aCkpKSB7XG4gICAgcHcubGFzdENoYW5nZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpZiAob3B0cy5hdG9taWMpIHtcbiAgICBpZiAoZXZlbnQgPT09IEVWX1VOTElOSykge1xuICAgICAgdGhpcy5fcGVuZGluZ1VubGlua3Muc2V0KHBhdGgsIGFyZ3MpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdVbmxpbmtzLmZvckVhY2goKGVudHJ5LCBwYXRoKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KC4uLmVudHJ5KTtcbiAgICAgICAgICB0aGlzLmVtaXQoRVZfQUxMLCAuLi5lbnRyeSk7XG4gICAgICAgICAgdGhpcy5fcGVuZGluZ1VubGlua3MuZGVsZXRlKHBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIHR5cGVvZiBvcHRzLmF0b21pYyA9PT0gJ251bWJlcicgPyBvcHRzLmF0b21pYyA6IDEwMCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKGV2ZW50ID09PSBFVl9BREQgJiYgdGhpcy5fcGVuZGluZ1VubGlua3MuaGFzKHBhdGgpKSB7XG4gICAgICBldmVudCA9IGFyZ3NbMF0gPSBFVl9DSEFOR0U7XG4gICAgICB0aGlzLl9wZW5kaW5nVW5saW5rcy5kZWxldGUocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGF3ZiAmJiAoZXZlbnQgPT09IEVWX0FERCB8fCBldmVudCA9PT0gRVZfQ0hBTkdFKSAmJiB0aGlzLl9yZWFkeUVtaXR0ZWQpIHtcbiAgICBjb25zdCBhd2ZFbWl0ID0gKGVyciwgc3RhdHMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZXZlbnQgPSBhcmdzWzBdID0gRVZfRVJST1I7XG4gICAgICAgIGFyZ3NbMV0gPSBlcnI7XG4gICAgICAgIHRoaXMuZW1pdFdpdGhBbGwoZXZlbnQsIGFyZ3MpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0cykge1xuICAgICAgICAvLyBpZiBzdGF0cyBkb2Vzbid0IGV4aXN0IHRoZSBmaWxlIG11c3QgaGF2ZSBiZWVuIGRlbGV0ZWRcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMikge1xuICAgICAgICAgIGFyZ3NbMl0gPSBzdGF0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2goc3RhdHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdFdpdGhBbGwoZXZlbnQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9hd2FpdFdyaXRlRmluaXNoKHBhdGgsIGF3Zi5zdGFiaWxpdHlUaHJlc2hvbGQsIGV2ZW50LCBhd2ZFbWl0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmIChldmVudCA9PT0gRVZfQ0hBTkdFKSB7XG4gICAgY29uc3QgaXNUaHJvdHRsZWQgPSAhdGhpcy5fdGhyb3R0bGUoRVZfQ0hBTkdFLCBwYXRoLCA1MCk7XG4gICAgaWYgKGlzVGhyb3R0bGVkKSByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmIChvcHRzLmFsd2F5c1N0YXQgJiYgdmFsMSA9PT0gdW5kZWZpbmVkICYmXG4gICAgKGV2ZW50ID09PSBFVl9BREQgfHwgZXZlbnQgPT09IEVWX0FERF9ESVIgfHwgZXZlbnQgPT09IEVWX0NIQU5HRSlcbiAgKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBvcHRzLmN3ZCA/IHN5c1BhdGguam9pbihvcHRzLmN3ZCwgcGF0aCkgOiBwYXRoO1xuICAgIGxldCBzdGF0cztcbiAgICB0cnkge1xuICAgICAgc3RhdHMgPSBhd2FpdCBzdGF0KGZ1bGxQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgLy8gU3VwcHJlc3MgZXZlbnQgd2hlbiBmc19zdGF0IGZhaWxzLCB0byBhdm9pZCBzZW5kaW5nIHVuZGVmaW5lZCAnc3RhdCdcbiAgICBpZiAoIXN0YXRzIHx8IHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgYXJncy5wdXNoKHN0YXRzKTtcbiAgfVxuICB0aGlzLmVtaXRXaXRoQWxsKGV2ZW50LCBhcmdzKTtcblxuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDb21tb24gaGFuZGxlciBmb3IgZXJyb3JzXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICogQHJldHVybnMge0Vycm9yfEJvb2xlYW59IFRoZSBlcnJvciBpZiBkZWZpbmVkLCBvdGhlcndpc2UgdGhlIHZhbHVlIG9mIHRoZSBGU1dhdGNoZXIgaW5zdGFuY2UncyBgY2xvc2VkYCBmbGFnXG4gKi9cbl9oYW5kbGVFcnJvcihlcnJvcikge1xuICBjb25zdCBjb2RlID0gZXJyb3IgJiYgZXJyb3IuY29kZTtcbiAgaWYgKGVycm9yICYmIGNvZGUgIT09ICdFTk9FTlQnICYmIGNvZGUgIT09ICdFTk9URElSJyAmJlxuICAgICghdGhpcy5vcHRpb25zLmlnbm9yZVBlcm1pc3Npb25FcnJvcnMgfHwgKGNvZGUgIT09ICdFUEVSTScgJiYgY29kZSAhPT0gJ0VBQ0NFUycpKVxuICApIHtcbiAgICB0aGlzLmVtaXQoRVZfRVJST1IsIGVycm9yKTtcbiAgfVxuICByZXR1cm4gZXJyb3IgfHwgdGhpcy5jbG9zZWQ7XG59XG5cbi8qKlxuICogSGVscGVyIHV0aWxpdHkgZm9yIHRocm90dGxpbmdcbiAqIEBwYXJhbSB7VGhyb3R0bGVUeXBlfSBhY3Rpb25UeXBlIHR5cGUgYmVpbmcgdGhyb3R0bGVkXG4gKiBAcGFyYW0ge1BhdGh9IHBhdGggYmVpbmcgYWN0ZWQgdXBvblxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgZHVyYXRpb24gb2YgdGltZSB0byBzdXBwcmVzcyBkdXBsaWNhdGUgYWN0aW9uc1xuICogQHJldHVybnMge09iamVjdHxmYWxzZX0gdHJhY2tpbmcgb2JqZWN0IG9yIGZhbHNlIGlmIGFjdGlvbiBzaG91bGQgYmUgc3VwcHJlc3NlZFxuICovXG5fdGhyb3R0bGUoYWN0aW9uVHlwZSwgcGF0aCwgdGltZW91dCkge1xuICBpZiAoIXRoaXMuX3Rocm90dGxlZC5oYXMoYWN0aW9uVHlwZSkpIHtcbiAgICB0aGlzLl90aHJvdHRsZWQuc2V0KGFjdGlvblR5cGUsIG5ldyBNYXAoKSk7XG4gIH1cblxuICAvKiogQHR5cGUge01hcDxQYXRoLCBPYmplY3Q+fSAqL1xuICBjb25zdCBhY3Rpb24gPSB0aGlzLl90aHJvdHRsZWQuZ2V0KGFjdGlvblR5cGUpO1xuICAvKiogQHR5cGUge09iamVjdH0gKi9cbiAgY29uc3QgYWN0aW9uUGF0aCA9IGFjdGlvbi5nZXQocGF0aCk7XG5cbiAgaWYgKGFjdGlvblBhdGgpIHtcbiAgICBhY3Rpb25QYXRoLmNvdW50Kys7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbGV0IHRpbWVvdXRPYmplY3Q7XG4gIGNvbnN0IGNsZWFyID0gKCkgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBhY3Rpb24uZ2V0KHBhdGgpO1xuICAgIGNvbnN0IGNvdW50ID0gaXRlbSA/IGl0ZW0uY291bnQgOiAwO1xuICAgIGFjdGlvbi5kZWxldGUocGF0aCk7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRPYmplY3QpO1xuICAgIGlmIChpdGVtKSBjbGVhclRpbWVvdXQoaXRlbS50aW1lb3V0T2JqZWN0KTtcbiAgICByZXR1cm4gY291bnQ7XG4gIH07XG4gIHRpbWVvdXRPYmplY3QgPSBzZXRUaW1lb3V0KGNsZWFyLCB0aW1lb3V0KTtcbiAgY29uc3QgdGhyID0ge3RpbWVvdXRPYmplY3QsIGNsZWFyLCBjb3VudDogMH07XG4gIGFjdGlvbi5zZXQocGF0aCwgdGhyKTtcbiAgcmV0dXJuIHRocjtcbn1cblxuX2luY3JSZWFkeUNvdW50KCkge1xuICByZXR1cm4gdGhpcy5fcmVhZHlDb3VudCsrO1xufVxuXG4vKipcbiAqIEF3YWl0cyB3cml0ZSBvcGVyYXRpb24gdG8gZmluaXNoLlxuICogUG9sbHMgYSBuZXdseSBjcmVhdGVkIGZpbGUgZm9yIHNpemUgdmFyaWF0aW9ucy4gV2hlbiBmaWxlcyBzaXplIGRvZXMgbm90IGNoYW5nZSBmb3IgJ3RocmVzaG9sZCcgbWlsbGlzZWNvbmRzIGNhbGxzIGNhbGxiYWNrLlxuICogQHBhcmFtIHtQYXRofSBwYXRoIGJlaW5nIGFjdGVkIHVwb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aHJlc2hvbGQgVGltZSBpbiBtaWxsaXNlY29uZHMgYSBmaWxlIHNpemUgbXVzdCBiZSBmaXhlZCBiZWZvcmUgYWNrbm93bGVkZ2luZyB3cml0ZSBPUCBpcyBmaW5pc2hlZFxuICogQHBhcmFtIHtFdmVudE5hbWV9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhd2ZFbWl0IENhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHJlYWR5IGZvciBldmVudCB0byBiZSBlbWl0dGVkLlxuICovXG5fYXdhaXRXcml0ZUZpbmlzaChwYXRoLCB0aHJlc2hvbGQsIGV2ZW50LCBhd2ZFbWl0KSB7XG4gIGxldCB0aW1lb3V0SGFuZGxlcjtcblxuICBsZXQgZnVsbFBhdGggPSBwYXRoO1xuICBpZiAodGhpcy5vcHRpb25zLmN3ZCAmJiAhc3lzUGF0aC5pc0Fic29sdXRlKHBhdGgpKSB7XG4gICAgZnVsbFBhdGggPSBzeXNQYXRoLmpvaW4odGhpcy5vcHRpb25zLmN3ZCwgcGF0aCk7XG4gIH1cblxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gIGNvbnN0IGF3YWl0V3JpdGVGaW5pc2ggPSAocHJldlN0YXQpID0+IHtcbiAgICBmcy5zdGF0KGZ1bGxQYXRoLCAoZXJyLCBjdXJTdGF0KSA9PiB7XG4gICAgICBpZiAoZXJyIHx8ICF0aGlzLl9wZW5kaW5nV3JpdGVzLmhhcyhwYXRoKSkge1xuICAgICAgICBpZiAoZXJyICYmIGVyci5jb2RlICE9PSAnRU5PRU5UJykgYXdmRW1pdChlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vdyA9IE51bWJlcihuZXcgRGF0ZSgpKTtcblxuICAgICAgaWYgKHByZXZTdGF0ICYmIGN1clN0YXQuc2l6ZSAhPT0gcHJldlN0YXQuc2l6ZSkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nV3JpdGVzLmdldChwYXRoKS5sYXN0Q2hhbmdlID0gbm93O1xuICAgICAgfVxuICAgICAgY29uc3QgcHcgPSB0aGlzLl9wZW5kaW5nV3JpdGVzLmdldChwYXRoKTtcbiAgICAgIGNvbnN0IGRmID0gbm93IC0gcHcubGFzdENoYW5nZTtcblxuICAgICAgaWYgKGRmID49IHRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nV3JpdGVzLmRlbGV0ZShwYXRoKTtcbiAgICAgICAgYXdmRW1pdCh1bmRlZmluZWQsIGN1clN0YXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dEhhbmRsZXIgPSBzZXRUaW1lb3V0KFxuICAgICAgICAgIGF3YWl0V3JpdGVGaW5pc2gsXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmF3YWl0V3JpdGVGaW5pc2gucG9sbEludGVydmFsLFxuICAgICAgICAgIGN1clN0YXRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBpZiAoIXRoaXMuX3BlbmRpbmdXcml0ZXMuaGFzKHBhdGgpKSB7XG4gICAgdGhpcy5fcGVuZGluZ1dyaXRlcy5zZXQocGF0aCwge1xuICAgICAgbGFzdENoYW5nZTogbm93LFxuICAgICAgY2FuY2VsV2FpdDogKCkgPT4ge1xuICAgICAgICB0aGlzLl9wZW5kaW5nV3JpdGVzLmRlbGV0ZShwYXRoKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRpbWVvdXRIYW5kbGVyID0gc2V0VGltZW91dChcbiAgICAgIGF3YWl0V3JpdGVGaW5pc2gsXG4gICAgICB0aGlzLm9wdGlvbnMuYXdhaXRXcml0ZUZpbmlzaC5wb2xsSW50ZXJ2YWxcbiAgICApO1xuICB9XG59XG5cbl9nZXRHbG9iSWdub3JlZCgpIHtcbiAgcmV0dXJuIFsuLi50aGlzLl9pZ25vcmVkUGF0aHMudmFsdWVzKCldO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB1c2VyIGhhcyBhc2tlZCB0byBpZ25vcmUgdGhpcyBwYXRoLlxuICogQHBhcmFtIHtQYXRofSBwYXRoIGZpbGVwYXRoIG9yIGRpclxuICogQHBhcmFtIHtmcy5TdGF0cz19IHN0YXRzIHJlc3VsdCBvZiBmcy5zdGF0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuX2lzSWdub3JlZChwYXRoLCBzdGF0cykge1xuICBpZiAodGhpcy5vcHRpb25zLmF0b21pYyAmJiBET1RfUkUudGVzdChwYXRoKSkgcmV0dXJuIHRydWU7XG4gIGlmICghdGhpcy5fdXNlcklnbm9yZWQpIHtcbiAgICBjb25zdCB7Y3dkfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBpZ24gPSB0aGlzLm9wdGlvbnMuaWdub3JlZDtcblxuICAgIGNvbnN0IGlnbm9yZWQgPSBpZ24gJiYgaWduLm1hcChub3JtYWxpemVJZ25vcmVkKGN3ZCkpO1xuICAgIGNvbnN0IHBhdGhzID0gYXJyaWZ5KGlnbm9yZWQpXG4gICAgICAuZmlsdGVyKChwYXRoKSA9PiB0eXBlb2YgcGF0aCA9PT0gU1RSSU5HX1RZUEUgJiYgIWlzR2xvYihwYXRoKSlcbiAgICAgIC5tYXAoKHBhdGgpID0+IHBhdGggKyBTTEFTSF9HTE9CU1RBUik7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuX2dldEdsb2JJZ25vcmVkKCkubWFwKG5vcm1hbGl6ZUlnbm9yZWQoY3dkKSkuY29uY2F0KGlnbm9yZWQsIHBhdGhzKTtcbiAgICB0aGlzLl91c2VySWdub3JlZCA9IGFueW1hdGNoKGxpc3QsIHVuZGVmaW5lZCwgQU5ZTUFUQ0hfT1BUUyk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fdXNlcklnbm9yZWQoW3BhdGgsIHN0YXRzXSk7XG59XG5cbl9pc250SWdub3JlZChwYXRoLCBzdGF0KSB7XG4gIHJldHVybiAhdGhpcy5faXNJZ25vcmVkKHBhdGgsIHN0YXQpO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGEgc2V0IG9mIGNvbW1vbiBoZWxwZXJzIGFuZCBwcm9wZXJ0aWVzIHJlbGF0aW5nIHRvIHN5bWxpbmsgYW5kIGdsb2IgaGFuZGxpbmcuXG4gKiBAcGFyYW0ge1BhdGh9IHBhdGggZmlsZSwgZGlyZWN0b3J5LCBvciBnbG9iIHBhdHRlcm4gYmVpbmcgd2F0Y2hlZFxuICogQHBhcmFtIHtOdW1iZXI9fSBkZXB0aCBhdCBhbnkgZGVwdGggPiAwLCB0aGlzIGlzbid0IGEgZ2xvYlxuICogQHJldHVybnMge1dhdGNoSGVscGVyfSBvYmplY3QgY29udGFpbmluZyBoZWxwZXJzIGZvciB0aGlzIHBhdGhcbiAqL1xuX2dldFdhdGNoSGVscGVycyhwYXRoLCBkZXB0aCkge1xuICBjb25zdCB3YXRjaFBhdGggPSBkZXB0aCB8fCB0aGlzLm9wdGlvbnMuZGlzYWJsZUdsb2JiaW5nIHx8ICFpc0dsb2IocGF0aCkgPyBwYXRoIDogZ2xvYlBhcmVudChwYXRoKTtcbiAgY29uc3QgZm9sbG93ID0gdGhpcy5vcHRpb25zLmZvbGxvd1N5bWxpbmtzO1xuXG4gIHJldHVybiBuZXcgV2F0Y2hIZWxwZXIocGF0aCwgd2F0Y2hQYXRoLCBmb2xsb3csIHRoaXMpO1xufVxuXG4vLyBEaXJlY3RvcnkgaGVscGVyc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBQcm92aWRlcyBkaXJlY3RvcnkgdHJhY2tpbmcgb2JqZWN0c1xuICogQHBhcmFtIHtTdHJpbmd9IGRpcmVjdG9yeSBwYXRoIG9mIHRoZSBkaXJlY3RvcnlcbiAqIEByZXR1cm5zIHtEaXJFbnRyeX0gdGhlIGRpcmVjdG9yeSdzIHRyYWNraW5nIG9iamVjdFxuICovXG5fZ2V0V2F0Y2hlZERpcihkaXJlY3RvcnkpIHtcbiAgaWYgKCF0aGlzLl9ib3VuZFJlbW92ZSkgdGhpcy5fYm91bmRSZW1vdmUgPSB0aGlzLl9yZW1vdmUuYmluZCh0aGlzKTtcbiAgY29uc3QgZGlyID0gc3lzUGF0aC5yZXNvbHZlKGRpcmVjdG9yeSk7XG4gIGlmICghdGhpcy5fd2F0Y2hlZC5oYXMoZGlyKSkgdGhpcy5fd2F0Y2hlZC5zZXQoZGlyLCBuZXcgRGlyRW50cnkoZGlyLCB0aGlzLl9ib3VuZFJlbW92ZSkpO1xuICByZXR1cm4gdGhpcy5fd2F0Y2hlZC5nZXQoZGlyKTtcbn1cblxuLy8gRmlsZSBoZWxwZXJzXG4vLyAtLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDaGVjayBmb3IgcmVhZCBwZXJtaXNzaW9ucy5cbiAqIEJhc2VkIG9uIHRoaXMgYW5zd2VyIG9uIFNPOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTE3ODE0MDQvMTM1ODQwNVxuICogQHBhcmFtIHtmcy5TdGF0c30gc3RhdHMgLSBvYmplY3QsIHJlc3VsdCBvZiBmc19zdGF0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGZpbGUgY2FuIGJlIHJlYWRcbiovXG5faGFzUmVhZFBlcm1pc3Npb25zKHN0YXRzKSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlUGVybWlzc2lvbkVycm9ycykgcmV0dXJuIHRydWU7XG5cbiAgLy8gc3RhdHMubW9kZSBtYXkgYmUgYmlnaW50XG4gIGNvbnN0IG1kID0gc3RhdHMgJiYgTnVtYmVyLnBhcnNlSW50KHN0YXRzLm1vZGUsIDEwKTtcbiAgY29uc3Qgc3QgPSBtZCAmIDBvNzc3O1xuICBjb25zdCBpdCA9IE51bWJlci5wYXJzZUludChzdC50b1N0cmluZyg4KVswXSwgMTApO1xuICByZXR1cm4gQm9vbGVhbig0ICYgaXQpO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgZW1pdHRpbmcgdW5saW5rIGV2ZW50cyBmb3JcbiAqIGZpbGVzIGFuZCBkaXJlY3RvcmllcywgYW5kIHZpYSByZWN1cnNpb24sIGZvclxuICogZmlsZXMgYW5kIGRpcmVjdG9yaWVzIHdpdGhpbiBkaXJlY3RvcmllcyB0aGF0IGFyZSB1bmxpbmtlZFxuICogQHBhcmFtIHtTdHJpbmd9IGRpcmVjdG9yeSB3aXRoaW4gd2hpY2ggdGhlIGZvbGxvd2luZyBpdGVtIGlzIGxvY2F0ZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtICAgICAgYmFzZSBwYXRoIG9mIGl0ZW0vZGlyZWN0b3J5XG4gKiBAcmV0dXJucyB7dm9pZH1cbiovXG5fcmVtb3ZlKGRpcmVjdG9yeSwgaXRlbSwgaXNEaXJlY3RvcnkpIHtcbiAgLy8gaWYgd2hhdCBpcyBiZWluZyBkZWxldGVkIGlzIGEgZGlyZWN0b3J5LCBnZXQgdGhhdCBkaXJlY3RvcnkncyBwYXRoc1xuICAvLyBmb3IgcmVjdXJzaXZlIGRlbGV0aW5nIGFuZCBjbGVhbmluZyBvZiB3YXRjaGVkIG9iamVjdFxuICAvLyBpZiBpdCBpcyBub3QgYSBkaXJlY3RvcnksIG5lc3RlZERpcmVjdG9yeUNoaWxkcmVuIHdpbGwgYmUgZW1wdHkgYXJyYXlcbiAgY29uc3QgcGF0aCA9IHN5c1BhdGguam9pbihkaXJlY3RvcnksIGl0ZW0pO1xuICBjb25zdCBmdWxsUGF0aCA9IHN5c1BhdGgucmVzb2x2ZShwYXRoKTtcbiAgaXNEaXJlY3RvcnkgPSBpc0RpcmVjdG9yeSAhPSBudWxsXG4gICAgPyBpc0RpcmVjdG9yeVxuICAgIDogdGhpcy5fd2F0Y2hlZC5oYXMocGF0aCkgfHwgdGhpcy5fd2F0Y2hlZC5oYXMoZnVsbFBhdGgpO1xuXG4gIC8vIHByZXZlbnQgZHVwbGljYXRlIGhhbmRsaW5nIGluIGNhc2Ugb2YgYXJyaXZpbmcgaGVyZSBuZWFybHkgc2ltdWx0YW5lb3VzbHlcbiAgLy8gdmlhIG11bHRpcGxlIHBhdGhzIChzdWNoIGFzIF9oYW5kbGVGaWxlIGFuZCBfaGFuZGxlRGlyKVxuICBpZiAoIXRoaXMuX3Rocm90dGxlKCdyZW1vdmUnLCBwYXRoLCAxMDApKSByZXR1cm47XG5cbiAgLy8gaWYgdGhlIG9ubHkgd2F0Y2hlZCBmaWxlIGlzIHJlbW92ZWQsIHdhdGNoIGZvciBpdHMgcmV0dXJuXG4gIGlmICghaXNEaXJlY3RvcnkgJiYgIXRoaXMub3B0aW9ucy51c2VGc0V2ZW50cyAmJiB0aGlzLl93YXRjaGVkLnNpemUgPT09IDEpIHtcbiAgICB0aGlzLmFkZChkaXJlY3RvcnksIGl0ZW0sIHRydWUpO1xuICB9XG5cbiAgLy8gVGhpcyB3aWxsIGNyZWF0ZSBhIG5ldyBlbnRyeSBpbiB0aGUgd2F0Y2hlZCBvYmplY3QgaW4gZWl0aGVyIGNhc2VcbiAgLy8gc28gd2UgZ290IHRvIGRvIHRoZSBkaXJlY3RvcnkgY2hlY2sgYmVmb3JlaGFuZFxuICBjb25zdCB3cCA9IHRoaXMuX2dldFdhdGNoZWREaXIocGF0aCk7XG4gIGNvbnN0IG5lc3RlZERpcmVjdG9yeUNoaWxkcmVuID0gd3AuZ2V0Q2hpbGRyZW4oKTtcblxuICAvLyBSZWN1cnNpdmVseSByZW1vdmUgY2hpbGRyZW4gZGlyZWN0b3JpZXMgLyBmaWxlcy5cbiAgbmVzdGVkRGlyZWN0b3J5Q2hpbGRyZW4uZm9yRWFjaChuZXN0ZWQgPT4gdGhpcy5fcmVtb3ZlKHBhdGgsIG5lc3RlZCkpO1xuXG4gIC8vIENoZWNrIGlmIGl0ZW0gd2FzIG9uIHRoZSB3YXRjaGVkIGxpc3QgYW5kIHJlbW92ZSBpdFxuICBjb25zdCBwYXJlbnQgPSB0aGlzLl9nZXRXYXRjaGVkRGlyKGRpcmVjdG9yeSk7XG4gIGNvbnN0IHdhc1RyYWNrZWQgPSBwYXJlbnQuaGFzKGl0ZW0pO1xuICBwYXJlbnQucmVtb3ZlKGl0ZW0pO1xuXG4gIC8vIEZpeGVzIGlzc3VlICMxMDQyIC0+IFJlbGF0aXZlIHBhdGhzIHdlcmUgZGV0ZWN0ZWQgYW5kIGFkZGVkIGFzIHN5bWxpbmtzXG4gIC8vIChodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2Nob2tpZGFyL2Jsb2IvZTE3NTNkZGJjOTU3MWJkYzMzYjRhNGFmMTcyZDUyY2I2ZTYxMWMxMC9saWIvbm9kZWZzLWhhbmRsZXIuanMjTDYxMiksXG4gIC8vIGJ1dCBuZXZlciByZW1vdmVkIGZyb20gdGhlIG1hcCBpbiBjYXNlIHRoZSBwYXRoIHdhcyBkZWxldGVkLlxuICAvLyBUaGlzIGxlYWRzIHRvIGFuIGluY29ycmVjdCBzdGF0ZSBpZiB0aGUgcGF0aCB3YXMgcmVjcmVhdGVkOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2Nob2tpZGFyL2Jsb2IvZTE3NTNkZGJjOTU3MWJkYzMzYjRhNGFmMTcyZDUyY2I2ZTYxMWMxMC9saWIvbm9kZWZzLWhhbmRsZXIuanMjTDU1M1xuICBpZiAodGhpcy5fc3ltbGlua1BhdGhzLmhhcyhmdWxsUGF0aCkpIHtcbiAgICB0aGlzLl9zeW1saW5rUGF0aHMuZGVsZXRlKGZ1bGxQYXRoKTtcbiAgfVxuXG4gIC8vIElmIHdlIHdhaXQgZm9yIHRoaXMgZmlsZSB0byBiZSBmdWxseSB3cml0dGVuLCBjYW5jZWwgdGhlIHdhaXQuXG4gIGxldCByZWxQYXRoID0gcGF0aDtcbiAgaWYgKHRoaXMub3B0aW9ucy5jd2QpIHJlbFBhdGggPSBzeXNQYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jd2QsIHBhdGgpO1xuICBpZiAodGhpcy5vcHRpb25zLmF3YWl0V3JpdGVGaW5pc2ggJiYgdGhpcy5fcGVuZGluZ1dyaXRlcy5oYXMocmVsUGF0aCkpIHtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuX3BlbmRpbmdXcml0ZXMuZ2V0KHJlbFBhdGgpLmNhbmNlbFdhaXQoKTtcbiAgICBpZiAoZXZlbnQgPT09IEVWX0FERCkgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhlIEVudHJ5IHdpbGwgZWl0aGVyIGJlIGEgZGlyZWN0b3J5IHRoYXQganVzdCBnb3QgcmVtb3ZlZFxuICAvLyBvciBhIGJvZ3VzIGVudHJ5IHRvIGEgZmlsZSwgaW4gZWl0aGVyIGNhc2Ugd2UgaGF2ZSB0byByZW1vdmUgaXRcbiAgdGhpcy5fd2F0Y2hlZC5kZWxldGUocGF0aCk7XG4gIHRoaXMuX3dhdGNoZWQuZGVsZXRlKGZ1bGxQYXRoKTtcbiAgY29uc3QgZXZlbnROYW1lID0gaXNEaXJlY3RvcnkgPyBFVl9VTkxJTktfRElSIDogRVZfVU5MSU5LO1xuICBpZiAod2FzVHJhY2tlZCAmJiAhdGhpcy5faXNJZ25vcmVkKHBhdGgpKSB0aGlzLl9lbWl0KGV2ZW50TmFtZSwgcGF0aCk7XG5cbiAgLy8gQXZvaWQgY29uZmxpY3RzIGlmIHdlIGxhdGVyIGNyZWF0ZSBhbm90aGVyIGZpbGUgd2l0aCB0aGUgc2FtZSBuYW1lXG4gIGlmICghdGhpcy5vcHRpb25zLnVzZUZzRXZlbnRzKSB7XG4gICAgdGhpcy5fY2xvc2VQYXRoKHBhdGgpO1xuICB9XG59XG5cbi8qKlxuICogQ2xvc2VzIGFsbCB3YXRjaGVycyBmb3IgYSBwYXRoXG4gKiBAcGFyYW0ge1BhdGh9IHBhdGhcbiAqL1xuX2Nsb3NlUGF0aChwYXRoKSB7XG4gIHRoaXMuX2Nsb3NlRmlsZShwYXRoKVxuICBjb25zdCBkaXIgPSBzeXNQYXRoLmRpcm5hbWUocGF0aCk7XG4gIHRoaXMuX2dldFdhdGNoZWREaXIoZGlyKS5yZW1vdmUoc3lzUGF0aC5iYXNlbmFtZShwYXRoKSk7XG59XG5cbi8qKlxuICogQ2xvc2VzIG9ubHkgZmlsZS1zcGVjaWZpYyB3YXRjaGVyc1xuICogQHBhcmFtIHtQYXRofSBwYXRoXG4gKi9cbl9jbG9zZUZpbGUocGF0aCkge1xuICBjb25zdCBjbG9zZXJzID0gdGhpcy5fY2xvc2Vycy5nZXQocGF0aCk7XG4gIGlmICghY2xvc2VycykgcmV0dXJuO1xuICBjbG9zZXJzLmZvckVhY2goY2xvc2VyID0+IGNsb3NlcigpKTtcbiAgdGhpcy5fY2xvc2Vycy5kZWxldGUocGF0aCk7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7UGF0aH0gcGF0aFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvc2VyXG4gKi9cbl9hZGRQYXRoQ2xvc2VyKHBhdGgsIGNsb3Nlcikge1xuICBpZiAoIWNsb3NlcikgcmV0dXJuO1xuICBsZXQgbGlzdCA9IHRoaXMuX2Nsb3NlcnMuZ2V0KHBhdGgpO1xuICBpZiAoIWxpc3QpIHtcbiAgICBsaXN0ID0gW107XG4gICAgdGhpcy5fY2xvc2Vycy5zZXQocGF0aCwgbGlzdCk7XG4gIH1cbiAgbGlzdC5wdXNoKGNsb3Nlcik7XG59XG5cbl9yZWFkZGlycChyb290LCBvcHRzKSB7XG4gIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICBjb25zdCBvcHRpb25zID0ge3R5cGU6IEVWX0FMTCwgYWx3YXlzU3RhdDogdHJ1ZSwgbHN0YXQ6IHRydWUsIC4uLm9wdHN9O1xuICBsZXQgc3RyZWFtID0gcmVhZGRpcnAocm9vdCwgb3B0aW9ucyk7XG4gIHRoaXMuX3N0cmVhbXMuYWRkKHN0cmVhbSk7XG4gIHN0cmVhbS5vbmNlKFNUUl9DTE9TRSwgKCkgPT4ge1xuICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgfSk7XG4gIHN0cmVhbS5vbmNlKFNUUl9FTkQsICgpID0+IHtcbiAgICBpZiAoc3RyZWFtKSB7XG4gICAgICB0aGlzLl9zdHJlYW1zLmRlbGV0ZShzdHJlYW0pO1xuICAgICAgc3RyZWFtID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdHJlYW07XG59XG5cbn1cblxuLy8gRXhwb3J0IEZTV2F0Y2hlciBjbGFzc1xuZXhwb3J0cy5GU1dhdGNoZXIgPSBGU1dhdGNoZXI7XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHdhdGNoZXIgd2l0aCBwYXRocyB0byBiZSB0cmFja2VkLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXk8U3RyaW5nPn0gcGF0aHMgZmlsZS9kaXJlY3RvcnkgcGF0aHMgYW5kL29yIGdsb2JzXG4gKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnMgY2hva2lkYXIgb3B0c1xuICogQHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgRlNXYXRjaGVyIGZvciBjaGFpbmluZy5cbiAqL1xuY29uc3Qgd2F0Y2ggPSAocGF0aHMsIG9wdGlvbnMpID0+IHtcbiAgY29uc3Qgd2F0Y2hlciA9IG5ldyBGU1dhdGNoZXIob3B0aW9ucyk7XG4gIHdhdGNoZXIuYWRkKHBhdGhzKTtcbiAgcmV0dXJuIHdhdGNoZXI7XG59O1xuXG5leHBvcnRzLndhdGNoID0gd2F0Y2g7XG4iLCJpbXBvcnQgeyBCcm93c2VyV2luZG93LCBpcGNNYWluLCBkaWFsb2cgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgUEFUSCBmcm9tICdwYXRoJztcbmltcG9ydCBGUyBmcm9tICdmcyc7XG5pbXBvcnQgY2hva2lkYXIgZnJvbSAnY2hva2lkYXInO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5cbmNvbnN0IGNoYW5nZUxpc3RlbmVycyA9IHt9O1xuXG5leHBvcnQgY29uc3QgTG9jYWxGaWxlU3lzdGVtU2VydmljZSA9IHtcblxuICByZWFkRGlyOiAoZSxwYXRoKSA9PiB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcblxuICAgIGNvbnN0IGxhYmVscyA9IEZTLnJlYWRkaXJTeW5jKHBhdGgpO1xuICAgIGZvcihjb25zdCBsIG9mIGxhYmVscyl7XG4gICAgICBjb25zdCBzdGF0ID0gRlMubHN0YXRTeW5jKFBBVEguam9pbihwYXRoLGwpKTtcbiAgICAgIGlmKGwuc3RhcnRzV2l0aCgnaXNhLicpIHx8IGwuc3RhcnRzV2l0aCgnLmdpdCcpIHx8IGwuc3RhcnRzV2l0aCgnLmFyYycpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgc3RhdC5pZCA9IHBhdGgrJy8nK2w7XG4gICAgICBzdGF0LmlzRGlyZWN0b3J5ID0gc3RhdC5pc0RpcmVjdG9yeSgpO1xuICAgICAgY2hpbGRyZW4ucHVzaChzdGF0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH0sXG5cbiAgc2VsZWN0RGlyOiBhc3luYyAoKT0+e1xuICAgIGNvbnN0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRpYWxvZy5zaG93T3BlbkRpYWxvZyh3aW5kb3csIHtcbiAgICAgIHByb3BlcnRpZXM6IFsnb3BlbkRpcmVjdG9yeSddXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5maWxlUGF0aHNbMF07XG4gIH0sXG5cbiAgc2F2ZUZpbGU6IGFzeW5jICgpPT57XG4gICAgY29uc3Qgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHdpbmRvdyk7XG4gICAgcmV0dXJuIHJlc3VsdC5maWxlUGF0aDtcbiAgfSxcblxuICByZWFkRmlsZTogKGUscGF0aCk9PntcbiAgICByZXR1cm4gRlMucmVhZEZpbGVTeW5jKHBhdGgse2VuY29kaW5nOidVVEYtOCd9KTtcbiAgfSxcblxuICByZWdpc3RlckNoYW5nZUxpc3RlbmVyOiBhc3luYyAoZSxwYXRoKT0+e1xuICAgIGNvbnNvbGUubG9nKCdybCcscGF0aClcbiAgICBjaGFuZ2VMaXN0ZW5lcnNbcGF0aF0gPSBjaG9raWRhci53YXRjaChwYXRoLHtpZ25vcmVJbml0aWFsOnRydWV9KTtcblxuICAgIGNvbnN0IHVwZGF0ZVBhdGggPSBwYXRoID0+IHtcbiAgICAgIGNvbnN0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcbiAgICAgIHdpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnVwZGF0ZVBhdGgnLCBwYXRoKTtcbiAgICB9O1xuICAgIGNvbnN0IHVwZGF0ZVBhcmVudFBhdGggPSBwYXRoID0+IHtcbiAgICAgIHVwZGF0ZVBhdGgoIHBhdGguc3BsaXQoJy8nKS5zbGljZSgwLC0xKS5qb2luKCcvJykgKTtcbiAgICB9O1xuXG4gICAgY2hhbmdlTGlzdGVuZXJzW3BhdGhdXG4gICAgICAvLyAub24oJ2FsbCcsIChldmVudCwgcGF0aCkgPT4ge1xuICAgICAgLy8gICAvLyBjb25zb2xlLmxvZyhldmVudCxwYXRoKTtcbiAgICAgIC8vIH0pXG4gICAgICAub24oJ2FkZCcsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ3VubGluaycsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ2FkZERpcicsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ3VubGlua0RpcicsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgO1xuXG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIHVucmVnaXN0ZXJDaGFuZ2VMaXN0ZW5lcjogYXN5bmMgKGUscGF0aCk9PntcbiAgICBjb25zb2xlLmxvZygndWwnLHBhdGgpXG4gICAgY29uc3Qgd2F0Y2hlciA9IGNoYW5nZUxpc3RlbmVyc1twYXRoXTtcbiAgICBpZighd2F0Y2hlcilcbiAgICAgIHJldHVybjtcblxuICAgIGF3YWl0IHdhdGNoZXIudW53YXRjaCgpO1xuICAgIGRlbGV0ZSBjaGFuZ2VMaXN0ZW5lcnNbcGF0aF07XG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIGluaXQ6IGFzeW5jICgpID0+IHtcbiAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGBVbmhhbmRsZWQgUmVqZWN0aW9uIGF0OiAke3V0aWwuaW5zcGVjdChwKX0gcmVhc29uOiAke3JlYXNvbn1gKTtcbiAgICB9KTtcblxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWREaXInLCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWREaXIpXG4gICAgaXBjTWFpbi5oYW5kbGUoJ0xvY2FsRmlsZVN5c3RlbVNlcnZpY2UucmVhZEZpbGUnLCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWRGaWxlKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnNlbGVjdERpcicsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2Uuc2VsZWN0RGlyKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnNhdmVGaWxlJywgTG9jYWxGaWxlU3lzdGVtU2VydmljZS5zYXZlRmlsZSlcbiAgICBpcGNNYWluLmhhbmRsZSgnTG9jYWxGaWxlU3lzdGVtU2VydmljZS5yZWdpc3RlckNoYW5nZUxpc3RlbmVyJywgTG9jYWxGaWxlU3lzdGVtU2VydmljZS5yZWdpc3RlckNoYW5nZUxpc3RlbmVyKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnVucmVnaXN0ZXJDaGFuZ2VMaXN0ZW5lcicsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2UudW5yZWdpc3RlckNoYW5nZUxpc3RlbmVyKVxuICB9XG59XG4iLCJpbXBvcnQge1xuICBpcGNNYWluLFxuICBCcm93c2VyV2luZG93LFxuICBkaWFsb2csXG4gIHNoZWxsXG59IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcblxuY29uc3QgaHR0cHNPcHRpb25zID0ge1xuICBob3N0OiAnZ2l0Lm5mZGk0cGxhbnRzLm9yZycsXG4gIHBvcnQ6IDQ0MyxcbiAgcGF0aDogJycsXG4gIG1ldGhvZDogJ0dFVCcsXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICd1c2VyLWFnZW50JzogJ25vZGUuanMnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBEYXRhSHViU2VydmljZSA9IHtcblxuICBnZXRXZWJQYWdlQXNKc29uOiAoZSx1cmwpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGh0dHBzT3B0aW9ucy5wYXRoID0gdXJsO1xuXG4gICAgICAgIGNvbnN0IHJlcSA9IGh0dHBzLnJlcXVlc3QoaHR0cHNPcHRpb25zLCByZXMgPT4ge1xuICAgICAgICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAgICAgICByZXMuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgICAgICByZXMub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gY2h1bms7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2Uob3V0cHV0KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEuZW5kKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfSxcblxuICBzZWxlY3RJbXBvcnREZXN0aW5hdGlvbjogYXN5bmMgKCk9PntcbiAgICBjb25zdCB3aW5kb3cgPSBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5maW5kKHcgPT4gIXcuaXNEZXN0cm95ZWQoKSk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGlhbG9nLnNob3dPcGVuRGlhbG9nKHdpbmRvdywge1xuICAgICAgdGl0bGU6ICdTZWxlY3QgRGVzdGluYXRpb24gb2YgQVJDIEltcG9ydCcsXG4gICAgICBtZXNzYWdlOiAnU2VsZWN0IERlc3RpbmF0aW9uIG9mIEFSQyBJbXBvcnQnLFxuICAgICAgcHJvcGVydGllczogWydvcGVuRGlyZWN0b3J5J11cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmZpbGVQYXRoc1swXTtcbiAgfSxcblxuICBnZXRBcmNzOiBhc3luYyBlPT57XG4gICAgcmV0dXJuIGF3YWl0IERhdGFIdWJTZXJ2aWNlLmdldFdlYlBhZ2VBc0pzb24obnVsbCxcIi9hcGkvdjQvcHJvamVjdHMvXCIpO1xuICB9LFxuXG4gIGluc3BlY3RBcmM6IGFzeW5jIChlLHVybCk9PntcbiAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJsKTtcbiAgICAvLyB0cnkge1xuICAgIC8vICAgb3Blbih1cmwpO1xuICAgIC8vIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm47XG4gIH0sXG5cbiAgaW5pdDogYXN5bmMgKCkgPT4ge1xuICAgIGlwY01haW4uaGFuZGxlKCdEYXRhSHViU2VydmljZS5nZXRBcmNzJywgRGF0YUh1YlNlcnZpY2UuZ2V0QXJjcyApO1xuICAgIGlwY01haW4uaGFuZGxlKCdEYXRhSHViU2VydmljZS5pbnNwZWN0QXJjJywgRGF0YUh1YlNlcnZpY2UuaW5zcGVjdEFyYyApO1xuICAgIGlwY01haW4uaGFuZGxlKCdEYXRhSHViU2VydmljZS5zZWxlY3RJbXBvcnREZXN0aW5hdGlvbicsIERhdGFIdWJTZXJ2aWNlLnNlbGVjdEltcG9ydERlc3RpbmF0aW9uICk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7XG4gIGlwY01haW4sXG4gIEJyb3dzZXJXaW5kb3dcbn0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHtcbiAgc3Bhd25cbn0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmV4cG9ydCBjb25zdCBBcmNDb21tYW5kZXJTZXJ2aWNlID0ge1xuXG4gIHJ1bjogKGUsb3B0aW9ucykgPT4ge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBhcmdzID0gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8gW29wdGlvbnNdIDogb3B0aW9ucy5hcmdzO1xuICAgICAgY29uc3QgbyA9IHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyA/IHt9IDogb3B0aW9ucztcblxuICAgICAgbGV0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcbiAgICAgIGNvbnN0IHAgPSBzcGF3bignYXJjJywgYXJncywgbyk7XG4gICAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAgIHAuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGFBc1N0cmluZyA9IGRhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgb3V0cHV0ICs9IGRhdGFBc1N0cmluZztcbiAgICAgICAgaWYoZGF0YUFzU3RyaW5nLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2Vycm9yJykpXG4gICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICB3aW5kb3cud2ViQ29udGVudHMuc2VuZCgnQXJjQ29tbWFuZGVyU2VydmljZS5NU0cnLCBkYXRhQXNTdHJpbmcpO1xuICAgICAgfSk7XG5cbiAgICAgIHAuc3RkZXJyLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgZGF0YUFzU3RyaW5nID0gZGF0YS50b1N0cmluZygpO1xuICAgICAgICBvdXRwdXQgKz0gZGF0YUFzU3RyaW5nO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdlJyxkYXRhQXNTdHJpbmcpO1xuICAgICAgICB3aW5kb3cud2ViQ29udGVudHMuc2VuZCgnQXJjQ29tbWFuZGVyU2VydmljZS5NU0cnLCBkYXRhQXNTdHJpbmcpO1xuICAgICAgfSk7XG5cbiAgICAgIHAub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlc29sdmUoW2ZhbHNlLGVyci50b1N0cmluZygpXSk7XG4gICAgICB9KTtcblxuICAgICAgcC5vbignZXhpdCcsIGNvZGUgPT4ge1xuICAgICAgICByZXNvbHZlKFtjb2RlPT09MCAmJiAhZXJyb3Isb3V0cHV0XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyBjb25zb2xlLmxvZyhjbWQsbyk7XG4gICAgLy8gdHJ5IHtcbiAgICAvLyAgIGNvbnN0IHRlc3QgPSBleGVjU3luYyhgYXJjICR7Y21kfWAsIG8pLnRvU3RyaW5nKCk7XG4gICAgLy8gICByZXR1cm4gW3RydWUsdGVzdF07XG4gICAgLy8gfSBjYXRjaCAoZSkge1xuICAgIC8vICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAvLyAgIHJldHVybiBbZmFsc2UsZV07XG4gICAgLy8gfVxuICB9LFxuXG4gIC8vIGlzUmVhZHk6IGFzeW5jICgpPT57XG4gIC8vICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgQXJjQ29tbWFuZGVyU2VydmljZS5ydW4oJy0tdmVyc2lvbicpO1xuICAvLyAgIHJldHVybiBzdGF0dXNbMF07XG4gIC8vIH0sXG5cbiAgLy8gZ2V0QXJjOiBhc3luYyBkYXRhPT57XG4gIC8vICAgLy8gY29uc3Qgc3RhdHVzID0gYXdhaXQgQXJjQ29tbWFuZGVyU2VydmljZS5ydW4oJy0tdmVyc2lvbicpO1xuICAvLyAgIC8vIHJldHVybiBzdGF0dXNbMF07XG4gIC8vIH0sXG5cbiAgaW5pdDogYXN5bmMgKCkgPT4ge1xuICAgIC8vIGlwY01haW4uaGFuZGxlKCdBcmNDb21tYW5kZXJTZXJ2aWNlLmlzUmVhZHknLCBBcmNDb21tYW5kZXJTZXJ2aWNlLmlzUmVhZHkgKTtcbiAgICBpcGNNYWluLmhhbmRsZSgnQXJjQ29tbWFuZGVyU2VydmljZS5ydW4nLCBBcmNDb21tYW5kZXJTZXJ2aWNlLnJ1biApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgaXBjTWFpbixcbiAgc2hlbGxcbn0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuXG5sZXQgcmVxID0gbnVsbDtcblxuZXhwb3J0IGNvbnN0IEludGVybmV0U2VydmljZSA9IHtcblxuICBjYWxsU3dhdGVBUEk6IChldmVudCwgZGF0YSk9PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBob3N0OiAnc3dhdGUubmZkaTRwbGFudHMub3JnJyxcbiAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgICAgcGF0aDogYC9hcGkvSU9udG9sb2d5QVBJdjIvJHtkYXRhLm1ldGhvZH1gLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdhY2NlcHQnOiAgICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgJ3VzZXItYWdlbnQnOiAgICdub2RlLmpzJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZihyZXEpXG4gICAgICAgICAgcmVxLmRlc3Ryb3koKTtcblxuICAgICAgICByZXEgPSBodHRwcy5yZXF1ZXN0KG9wdGlvbnMsIHJlcyA9PiB7XG4gICAgICAgICAgbGV0IG91dHB1dCA9ICcnO1xuICAgICAgICAgIHJlcy5zZXRFbmNvZGluZygndXRmOCcpO1xuICAgICAgICAgIHJlcy5vbignZGF0YScsIGNodW5rID0+IHtcbiAgICAgICAgICAgIG91dHB1dCArPSBjaHVuaztcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShvdXRwdXQpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcS53cml0ZShkYXRhLnBheWxvYWQpO1xuICAgICAgICByZXEuZW5kKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfSxcblxuICBvcGVuRXh0ZXJuYWxVUkw6IGFzeW5jIChlLHVybCk9PntcbiAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJsKTtcbiAgICByZXR1cm47XG4gIH0sXG5cbiAgaW5pdDogYXN5bmMgKCkgPT4ge1xuICAgIGlwY01haW4uaGFuZGxlKCdJbnRlcm5ldFNlcnZpY2Uub3BlbkV4dGVybmFsVVJMJywgSW50ZXJuZXRTZXJ2aWNlLm9wZW5FeHRlcm5hbFVSTCApO1xuICAgIGlwY01haW4uaGFuZGxlKCdJbnRlcm5ldFNlcnZpY2UuY2FsbFN3YXRlQVBJJywgSW50ZXJuZXRTZXJ2aWNlLmNhbGxTd2F0ZUFQSSApO1xuICB9XG5cbn07XG4iLCJpbXBvcnQge2FwcH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0ICcuL3NlY3VyaXR5LXJlc3RyaWN0aW9ucyc7XG5pbXBvcnQge3Jlc3RvcmVPckNyZWF0ZVdpbmRvd30gZnJvbSAnL0AvbWFpbldpbmRvdyc7XG5pbXBvcnQge0xvY2FsRmlsZVN5c3RlbVNlcnZpY2V9IGZyb20gJy9AL0xvY2FsRmlsZVN5c3RlbVNlcnZpY2UnO1xuaW1wb3J0IHtEYXRhSHViU2VydmljZX0gZnJvbSAnL0AvRGF0YUh1YlNlcnZpY2UnO1xuaW1wb3J0IHtBcmNDb21tYW5kZXJTZXJ2aWNlfSBmcm9tICcvQC9BcmNDb21tYW5kZXJTZXJ2aWNlJztcbmltcG9ydCB7SW50ZXJuZXRTZXJ2aWNlfSBmcm9tICcvQC9JbnRlcm5ldFNlcnZpY2UnO1xuXG4vKipcbiAqIFByZXZlbnQgbXVsdGlwbGUgaW5zdGFuY2VzXG4gKi9cbmNvbnN0IGlzU2luZ2xlSW5zdGFuY2UgPSBhcHAucmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jaygpO1xuaWYgKCFpc1NpbmdsZUluc3RhbmNlKSB7XG4gIGFwcC5xdWl0KCk7XG4gIHByb2Nlc3MuZXhpdCgwKTtcbn1cbmFwcC5vbignc2Vjb25kLWluc3RhbmNlJywgcmVzdG9yZU9yQ3JlYXRlV2luZG93KTtcblxuXG4vKipcbiAqIERpc2FibGUgSGFyZHdhcmUgQWNjZWxlcmF0aW9uIGZvciBtb3JlIHBvd2VyLXNhdmVcbiAqL1xuYXBwLmRpc2FibGVIYXJkd2FyZUFjY2VsZXJhdGlvbigpO1xuXG4vKipcbiAqIFNob3V0IGRvd24gYmFja2dyb3VuZCBwcm9jZXNzIGlmIGFsbCB3aW5kb3dzIHdhcyBjbG9zZWRcbiAqL1xuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL3YxNC14LXkvYXBpL2FwcCNldmVudC1hY3RpdmF0ZS1tYWNvcyBFdmVudDogJ2FjdGl2YXRlJ1xuICovXG5hcHAub24oJ2FjdGl2YXRlJywgcmVzdG9yZU9yQ3JlYXRlV2luZG93KTtcblxuXG4vKipcbiAqIENyZWF0ZSBhcHAgd2luZG93IHdoZW4gYmFja2dyb3VuZCBwcm9jZXNzIHdpbGwgYmUgcmVhZHlcbiAqL1xuYXBwLndoZW5SZWFkeSgpXG4gIC50aGVuKERhdGFIdWJTZXJ2aWNlLmluaXQpXG4gIC50aGVuKExvY2FsRmlsZVN5c3RlbVNlcnZpY2UuaW5pdClcbiAgLnRoZW4oQXJjQ29tbWFuZGVyU2VydmljZS5pbml0KVxuICAudGhlbihJbnRlcm5ldFNlcnZpY2UuaW5pdClcbiAgLnRoZW4ocmVzdG9yZU9yQ3JlYXRlV2luZG93KVxuICAuY2F0Y2goKGUpID0+IGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCBjcmVhdGUgd2luZG93OicsIGUpKTtcblxuXG4vKipcbiAqIEluc3RhbGwgVnVlLmpzIG9yIHNvbWUgb3RoZXIgZGV2dG9vbHMgaW4gZGV2ZWxvcG1lbnQgbW9kZSBvbmx5XG4gKi9cbmlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gIGFwcC53aGVuUmVhZHkoKVxuICAgIC50aGVuKCgpID0+IGltcG9ydCgnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJykpXG4gICAgLnRoZW4oKHtkZWZhdWx0OiBpbnN0YWxsRXh0ZW5zaW9uLCBWVUVKUzNfREVWVE9PTFN9KSA9PiBpbnN0YWxsRXh0ZW5zaW9uKFZVRUpTM19ERVZUT09MUywge1xuICAgICAgbG9hZEV4dGVuc2lvbk9wdGlvbnM6IHtcbiAgICAgICAgYWxsb3dGaWxlQWNjZXNzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSlcbiAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgaW5zdGFsbCBleHRlbnNpb246JywgZSkpO1xufVxuIl0sIm5hbWVzIjpbIlVSTCIsImFwcCIsInVybCIsInNoZWxsIiwiQnJvd3NlcldpbmRvdyIsImpvaW4iLCJNZW51IiwicGF0aCIsInJlcXVpcmUkJDAiLCJTVEFSIiwiUE9TSVhfUkVHRVhfU09VUkNFIiwiY29uc3RhbnRzIiwiY2hhcnMiLCJyZXF1aXJlJCQxIiwiYXBwZW5kIiwidXRpbHMiLCJDSEFSX0NPTU1BIiwiQ0hBUl9ET1QiLCJDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UiLCJDSEFSX0xFRlRfUEFSRU5USEVTRVMiLCJDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQiLCJDSEFSX1JJR0hUX0NVUkxZX0JSQUNFIiwiQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUyIsIkNIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQiLCJzY2FuIiwiaXNHbG9iIiwiaXNFeHRnbG9iIiwiYnJhY2VzIiwiTUFYX0xFTkdUSCIsInBhcnNlIiwiRE9UX0xJVEVSQUwiLCJQTFVTX0xJVEVSQUwiLCJTTEFTSF9MSVRFUkFMIiwiT05FX0NIQVIiLCJET1RTX1NMQVNIIiwiTk9fRE9UIiwiTk9fRE9UX1NMQVNIIiwiTk9fRE9UU19TTEFTSCIsIlFNQVJLIiwiUU1BUktfTk9fRE9UIiwiU1RBUlRfQU5DSE9SIiwib3B0cyIsInZhbHVlIiwicmVzdCIsImVzY2FwZWQiLCJvcGVuIiwiTk9fRE9UUyIsInNvdXJjZSIsInBhcnNlXzEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJpc09iamVjdCIsInBpY29tYXRjaCIsInN0YXRlIiwiZnMiLCJzeXNQYXRoIiwicHJvbWlzaWZ5IiwicmVhZGRpciIsInN0YXQiLCJsc3RhdCIsInJlYWxwYXRoIiwiQkFORyIsImRlcHRoIiwicmVhZGRpcnAiLCJub3JtYWxpemVQYXRoIiwiYW55bWF0Y2hfMSIsImFycmlmeSIsImFueW1hdGNoIiwidGVzdFN0cmluZyIsInJldHVybkluZGV4IiwiYW55bWF0Y2hNb2R1bGUiLCJjbG9zZSIsImdsb2JQYXJlbnQiLCJub2RlIiwic3RyaW5naWZ5IiwiaXNOdW1iZXIiLCJ0b1JlZ2V4UmFuZ2UiLCJ6ZXJvcyIsIm1heCIsImZpbGwiLCJjb21waWxlIiwiZXhwYW5kIiwiaW5kZXgiLCJiaW5hcnlFeHRlbnNpb25zIiwiaXNCaW5hcnlQYXRoIiwiaXNXaW5kb3dzIiwiRU1QVFlfRk4iLCJFTVBUWV9TVFIiLCJFVl9DSEFOR0UiLCJFVl9BREQiLCJFVl9BRERfRElSIiwiRVZfRVJST1IiLCJTVFJfREFUQSIsIlNUUl9FTkQiLCJCUkFDRV9TVEFSVCIsInN0YXRNZXRob2RzIiwicmF3RW1pdHRlciIsImxpc3RlbmVyIiwiTm9kZUZzSGFuZGxlciIsIm5ld1N0YXRzIiwic3RhdHMiLCJFVl9VTkxJTksiLCJGVU5DVElPTl9UWVBFIiwiRnNFdmVudHNIYW5kbGVyIiwidHJhbnNmb3JtIiwiZnNldmVudHNIYW5kbGVyTW9kdWxlIiwiZnNldmVudHNIYW5kbGVyIiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwicmVxdWlyZSQkOCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsInJlcXVpcmUkJDExIiwicmVxdWlyZSQkMTIiLCJub3ciLCJGUyIsIlBBVEgiLCJkaWFsb2ciLCJ1dGlsIiwiaXBjTWFpbiIsInJlcSIsImh0dHBzIiwic3Bhd24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsTUFBTSxrQ0FBa0Msb0JBQUk7QUFBQSxFQUV0QyxDQUFDLENBQUMsSUFBSUEsSUFBQUEsSUFBSSx3QkFBbUMsRUFBRSw0QkFBWSxJQUFHLENBQUEsQ0FBQztBQUVyRTtBQVlBLE1BQU0sK0NBQStCLElBQXlCO0FBQUEsRUFDNUQ7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLENBQUM7QUFHREMsU0FBQSxJQUFJLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxhQUFhO0FBVTlDLFdBQVMsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPQyxVQUFRO0FBQzFCLFFBQUlGLElBQUFBLElBQUlFLEtBQUc7QUFBQSxFQUFBLENBVzdCO0FB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
