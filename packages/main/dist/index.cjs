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
  const path2 = normalizePath$1(_path, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwic291cmNlcyI6WyIuLi9zcmMvc2VjdXJpdHktcmVzdHJpY3Rpb25zLnRzIiwiLi4vc3JjL21haW5XaW5kb3cudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi91dGlscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3NjYW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcGljb21hdGNoL2xpYi9wYXJzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvbGliL3BpY29tYXRjaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9waWNvbWF0Y2gvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhZGRpcnAvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXBhdGgvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYW55bWF0Y2gvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvaXMtZXh0Z2xvYi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9pcy1nbG9iL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2dsb2ItcGFyZW50L2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvdXRpbHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJhY2VzL2xpYi9zdHJpbmdpZnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvaXMtbnVtYmVyL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RvLXJlZ2V4LXJhbmdlL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2ZpbGwtcmFuZ2UvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJhY2VzL2xpYi9jb21waWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvZXhwYW5kLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JyYWNlcy9saWIvcGFyc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJhY2VzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JpbmFyeS1leHRlbnNpb25zL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2lzLWJpbmFyeS1wYXRoL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nob2tpZGFyL2xpYi9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY2hva2lkYXIvbGliL25vZGVmcy1oYW5kbGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nob2tpZGFyL2xpYi9mc2V2ZW50cy1oYW5kbGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nob2tpZGFyL2luZGV4LmpzIiwiLi4vc3JjL0xvY2FsRmlsZVN5c3RlbVNlcnZpY2UudHMiLCIuLi9zcmMvRGF0YUh1YlNlcnZpY2UudHMiLCIuLi9zcmMvQXJjQ29tbWFuZGVyU2VydmljZS50cyIsIi4uL3NyYy9JbnRlcm5ldFNlcnZpY2UudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHAsIHNoZWxsfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQge1VSTH0gZnJvbSAndXJsJztcblxuLyoqXG4gKiBMaXN0IG9mIG9yaWdpbnMgdGhhdCB5b3UgYWxsb3cgb3BlbiBJTlNJREUgdGhlIGFwcGxpY2F0aW9uIGFuZCBwZXJtaXNzaW9ucyBmb3IgZWFjaCBvZiB0aGVtLlxuICpcbiAqIEluIGRldmVsb3BtZW50IG1vZGUgeW91IG5lZWQgYWxsb3cgb3BlbiBgVklURV9ERVZfU0VSVkVSX1VSTGBcbiAqL1xuY29uc3QgQUxMT1dFRF9PUklHSU5TX0FORF9QRVJNSVNTSU9OUyA9IG5ldyBNYXA8c3RyaW5nLCBTZXQ8J2NsaXBib2FyZC1yZWFkJyB8ICdtZWRpYScgfCAnZGlzcGxheS1jYXB0dXJlJyB8ICdtZWRpYUtleVN5c3RlbScgfCAnZ2VvbG9jYXRpb24nIHwgJ25vdGlmaWNhdGlvbnMnIHwgJ21pZGknIHwgJ21pZGlTeXNleCcgfCAncG9pbnRlckxvY2snIHwgJ2Z1bGxzY3JlZW4nIHwgJ29wZW5FeHRlcm5hbCcgfCAndW5rbm93bic+PihcbiAgaW1wb3J0Lm1ldGEuZW52LkRFViAmJiBpbXBvcnQubWV0YS5lbnYuVklURV9ERVZfU0VSVkVSX1VSTFxuICAgID8gW1tuZXcgVVJMKGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMKS5vcmlnaW4sIG5ldyBTZXRdXVxuICAgIDogW10sXG4pO1xuXG4vKipcbiAqIExpc3Qgb2Ygb3JpZ2lucyB0aGF0IHlvdSBhbGxvdyBvcGVuIElOIEJST1dTRVIuXG4gKiBOYXZpZ2F0aW9uIHRvIG9yaWdpbnMgYmVsb3cgaXMgcG9zc2libGUgb25seSBpZiB0aGUgbGluayBvcGVucyBpbiBhIG5ldyB3aW5kb3dcbiAqXG4gKiBAZXhhbXBsZVxuICogPGFcbiAqICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAqICAgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9cIlxuICogPlxuICovXG5jb25zdCBBTExPV0VEX0VYVEVSTkFMX09SSUdJTlMgPSBuZXcgU2V0PGBodHRwczovLyR7c3RyaW5nfWA+KFtcbiAgJ2h0dHBzOi8vZ2l0aHViLmNvbScsXG4gICdodHRwczovL3d3dy53M3NjaG9vbHMuY29tJyxcbiAgJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20nLFxuXSk7XG5cblxuYXBwLm9uKCd3ZWItY29udGVudHMtY3JlYXRlZCcsIChfLCBjb250ZW50cykgPT4ge1xuXG4gIC8qKlxuICAgKiBCbG9jayBuYXZpZ2F0aW9uIHRvIG9yaWdpbnMgbm90IG9uIHRoZSBhbGxvd2xpc3QuXG4gICAqXG4gICAqIE5hdmlnYXRpb24gaXMgYSBjb21tb24gYXR0YWNrIHZlY3Rvci4gSWYgYW4gYXR0YWNrZXIgY2FuIGNvbnZpbmNlIHRoZSBhcHAgdG8gbmF2aWdhdGUgYXdheVxuICAgKiBmcm9tIGl0cyBjdXJyZW50IHBhZ2UsIHRoZXkgY2FuIHBvc3NpYmx5IGZvcmNlIHRoZSBhcHAgdG8gb3BlbiB3ZWIgc2l0ZXMgb24gdGhlIEludGVybmV0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L3R1dG9yaWFsL3NlY3VyaXR5IzEzLWRpc2FibGUtb3ItbGltaXQtbmF2aWdhdGlvblxuICAgKi9cbiAgY29udGVudHMub24oJ3dpbGwtbmF2aWdhdGUnLCAoZXZlbnQsIHVybCkgPT4ge1xuICAgIGNvbnN0IHtvcmlnaW59ID0gbmV3IFVSTCh1cmwpO1xuICAgIC8vIGlmIChBTExPV0VEX09SSUdJTlNfQU5EX1BFUk1JU1NJT05TLmhhcyhvcmlnaW4pKSB7XG4gICAgLy8gICByZXR1cm47XG4gICAgLy8gfVxuXG4gICAgLy8gLy8gUHJldmVudCBuYXZpZ2F0aW9uXG4gICAgLy8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gICAgLy8gICBjb25zb2xlLndhcm4oJ0Jsb2NrZWQgbmF2aWdhdGluZyB0byBhbiB1bmFsbG93ZWQgb3JpZ2luOicsIG9yaWdpbik7XG4gICAgLy8gfVxuICB9KTtcblxuXG4gIC8qKlxuICAgKiBCbG9jayByZXF1ZXN0ZWQgdW5hbGxvd2VkIHBlcm1pc3Npb25zLlxuICAgKiBCeSBkZWZhdWx0LCBFbGVjdHJvbiB3aWxsIGF1dG9tYXRpY2FsbHkgYXBwcm92ZSBhbGwgcGVybWlzc2lvbiByZXF1ZXN0cy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSM1LWhhbmRsZS1zZXNzaW9uLXBlcm1pc3Npb24tcmVxdWVzdHMtZnJvbS1yZW1vdGUtY29udGVudFxuICAgKi9cbiAgY29udGVudHMuc2Vzc2lvbi5zZXRQZXJtaXNzaW9uUmVxdWVzdEhhbmRsZXIoKHdlYkNvbnRlbnRzLCBwZXJtaXNzaW9uLCBjYWxsYmFjaykgPT4ge1xuICAgIGNvbnN0IHtvcmlnaW59ID0gbmV3IFVSTCh3ZWJDb250ZW50cy5nZXRVUkwoKSk7XG5cbiAgICBjb25zdCBwZXJtaXNzaW9uR3JhbnRlZCA9ICEhQUxMT1dFRF9PUklHSU5TX0FORF9QRVJNSVNTSU9OUy5nZXQob3JpZ2luKT8uaGFzKHBlcm1pc3Npb24pO1xuICAgIGNhbGxiYWNrKHBlcm1pc3Npb25HcmFudGVkKTtcblxuICAgIGlmICghcGVybWlzc2lvbkdyYW50ZWQgJiYgaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgICAgY29uc29sZS53YXJuKGAke29yaWdpbn0gcmVxdWVzdGVkIHBlcm1pc3Npb24gZm9yICcke3Blcm1pc3Npb259JywgYnV0IHdhcyBibG9ja2VkLmApO1xuICAgIH1cbiAgfSk7XG5cblxuICAvKipcbiAgICogSHlwZXJsaW5rcyB0byBhbGxvd2VkIHNpdGVzIG9wZW4gaW4gdGhlIGRlZmF1bHQgYnJvd3Nlci5cbiAgICpcbiAgICogVGhlIGNyZWF0aW9uIG9mIG5ldyBgd2ViQ29udGVudHNgIGlzIGEgY29tbW9uIGF0dGFjayB2ZWN0b3IuIEF0dGFja2VycyBhdHRlbXB0IHRvIGNvbnZpbmNlIHRoZSBhcHAgdG8gY3JlYXRlIG5ldyB3aW5kb3dzLFxuICAgKiBmcmFtZXMsIG9yIG90aGVyIHJlbmRlcmVyIHByb2Nlc3NlcyB3aXRoIG1vcmUgcHJpdmlsZWdlcyB0aGFuIHRoZXkgaGFkIGJlZm9yZTsgb3Igd2l0aCBwYWdlcyBvcGVuZWQgdGhhdCB0aGV5IGNvdWxkbid0IG9wZW4gYmVmb3JlLlxuICAgKiBZb3Ugc2hvdWxkIGRlbnkgYW55IHVuZXhwZWN0ZWQgd2luZG93IGNyZWF0aW9uLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L3R1dG9yaWFsL3NlY3VyaXR5IzE0LWRpc2FibGUtb3ItbGltaXQtY3JlYXRpb24tb2YtbmV3LXdpbmRvd3NcbiAgICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL2xhdGVzdC90dXRvcmlhbC9zZWN1cml0eSMxNS1kby1ub3QtdXNlLW9wZW5leHRlcm5hbC13aXRoLXVudHJ1c3RlZC1jb250ZW50XG4gICAqL1xuICBjb250ZW50cy5zZXRXaW5kb3dPcGVuSGFuZGxlcigoe3VybH0pID0+IHtcbiAgICBjb25zdCB7b3JpZ2lufSA9IG5ldyBVUkwodXJsKTtcblxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVHlwZSBjaGVja2luZyBpcyBwZXJmb3JtZWQgaW4gcnVudGltZVxuICAgIGlmIChBTExPV0VEX0VYVEVSTkFMX09SSUdJTlMuaGFzKG9yaWdpbikpIHtcbiAgICAgIC8vIE9wZW4gZGVmYXVsdCBicm93c2VyXG4gICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJsKS5jYXRjaChjb25zb2xlLmVycm9yKTtcblxuICAgIH0gZWxzZSBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFVikge1xuICAgICAgY29uc29sZS53YXJuKCdCbG9ja2VkIHRoZSBvcGVuaW5nIG9mIGFuIHVuYWxsb3dlZCBvcmlnaW46Jywgb3JpZ2luKTtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IGNyZWF0aW5nIG5ldyB3aW5kb3cgaW4gYXBwbGljYXRpb25cbiAgICByZXR1cm4ge2FjdGlvbjogJ2RlbnknfTtcbiAgfSk7XG5cblxuICAvKipcbiAgICogVmVyaWZ5IHdlYnZpZXcgb3B0aW9ucyBiZWZvcmUgY3JlYXRpb25cbiAgICpcbiAgICogU3RyaXAgYXdheSBwcmVsb2FkIHNjcmlwdHMsIGRpc2FibGUgTm9kZS5qcyBpbnRlZ3JhdGlvbiwgYW5kIGVuc3VyZSBvcmlnaW5zIGFyZSBvbiB0aGUgYWxsb3dsaXN0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vd3d3LmVsZWN0cm9uanMub3JnL2RvY3MvbGF0ZXN0L3R1dG9yaWFsL3NlY3VyaXR5IzEyLXZlcmlmeS13ZWJ2aWV3LW9wdGlvbnMtYmVmb3JlLWNyZWF0aW9uXG4gICAqL1xuICBjb250ZW50cy5vbignd2lsbC1hdHRhY2gtd2VidmlldycsIChldmVudCwgd2ViUHJlZmVyZW5jZXMsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHtvcmlnaW59ID0gbmV3IFVSTChwYXJhbXMuc3JjKTtcbiAgICBpZiAoIUFMTE9XRURfT1JJR0lOU19BTkRfUEVSTUlTU0lPTlMuaGFzKG9yaWdpbikpIHtcblxuICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBBIHdlYnZpZXcgdHJpZWQgdG8gYXR0YWNoICR7cGFyYW1zLnNyY30sIGJ1dCB3YXMgYmxvY2tlZC5gKTtcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTdHJpcCBhd2F5IHByZWxvYWQgc2NyaXB0cyBpZiB1bnVzZWQgb3IgdmVyaWZ5IHRoZWlyIGxvY2F0aW9uIGlzIGxlZ2l0aW1hdGVcbiAgICBkZWxldGUgd2ViUHJlZmVyZW5jZXMucHJlbG9hZDtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGBwcmVsb2FkVVJMYCBleGlzdHMgLSBzZWUgaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3dlYi1jb250ZW50cyNldmVudC13aWxsLWF0dGFjaC13ZWJ2aWV3XG4gICAgZGVsZXRlIHdlYlByZWZlcmVuY2VzLnByZWxvYWRVUkw7XG5cbiAgICAvLyBEaXNhYmxlIE5vZGUuanMgaW50ZWdyYXRpb25cbiAgICB3ZWJQcmVmZXJlbmNlcy5ub2RlSW50ZWdyYXRpb24gPSBmYWxzZTtcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IEJyb3dzZXJXaW5kb3csTWVudSxzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVVJMIH0gZnJvbSAndXJsJztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xuICBjb25zdCBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHNob3c6IGZhbHNlLCAvLyBVc2UgJ3JlYWR5LXRvLXNob3cnIGV2ZW50IHRvIHNob3cgd2luZG93XG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIG5hdGl2ZVdpbmRvd09wZW46IHRydWUsXG4gICAgICB3ZWJ2aWV3VGFnOiB0cnVlLCAvLyBUaGUgd2VidmlldyB0YWcgaXMgbm90IHJlY29tbWVuZGVkLiBDb25zaWRlciBhbHRlcm5hdGl2ZXMgbGlrZSBpZnJhbWUgb3IgRWxlY3Ryb24ncyBCcm93c2VyVmlldy4gaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3dlYnZpZXctdGFnI3dhcm5pbmdcbiAgICAgIHByZWxvYWQ6IGpvaW4oX19kaXJuYW1lLCAnLi4vLi4vcHJlbG9hZC9kaXN0L2luZGV4LmNqcycpLFxuICAgIH0sXG4gICAgd2lkdGg6MTI4MCxcbiAgICBoZWlnaHQ6NzAwLFxuICB9KTtcblxuICAvKipcbiAgKiBJZiB5b3UgaW5zdGFsbCBgc2hvdzogdHJ1ZWAgdGhlbiBpdCBjYW4gY2F1c2UgaXNzdWVzIHdoZW4gdHJ5aW5nIHRvIGNsb3NlIHRoZSB3aW5kb3cuXG4gICogVXNlIGBzaG93OiBmYWxzZWAgYW5kIGxpc3RlbmVyIGV2ZW50cyBgcmVhZHktdG8tc2hvd2AgdG8gZml4IHRoZXNlIGlzc3Vlcy5cbiAgKlxuICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8yNTAxMlxuICAqL1xuICBtYWluV2luZG93Lm9uKCdyZWFkeS10by1zaG93JywgKCkgPT4ge1xuICAgIG1haW5XaW5kb3c/LnNob3coKTtcblxuICAgIC8vIGlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gICAgLy8gICBtYWluV2luZG93Py53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgICAvLyB9XG4gIH0pO1xuXG4gIC8qKlxuICAqIFVSTCBmb3IgbWFpbiB3aW5kb3cuXG4gICogVml0ZSBkZXYgc2VydmVyIGZvciBkZXZlbG9wbWVudC5cbiAgKiBgZmlsZTovLy4uL3JlbmRlcmVyL2luZGV4Lmh0bWxgIGZvciBwcm9kdWN0aW9uIGFuZCB0ZXN0XG4gICovXG4gIGNvbnN0IHBhZ2VVcmwgPSBpbXBvcnQubWV0YS5lbnYuREVWICYmIGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMICE9PSB1bmRlZmluZWRcbiAgICA/IGltcG9ydC5tZXRhLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMXG4gICAgOiBuZXcgVVJMKCcuLi9yZW5kZXJlci9kaXN0L2luZGV4Lmh0bWwnLCAnZmlsZTovLycgKyBfX2Rpcm5hbWUpLnRvU3RyaW5nKCk7XG5cblxuICBhd2FpdCBtYWluV2luZG93LmxvYWRVUkwocGFnZVVybCk7XG4gIC8vIG1haW5XaW5kb3cud2ViQ29udGVudHMubG9hZFVSTChcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb21cIik7XG5cbiAgcmV0dXJuIG1haW5XaW5kb3c7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4qIFJlc3RvcmUgZXhpc3RpbmcgQnJvd3NlcldpbmRvdyBvciBDcmVhdGUgbmV3IEJyb3dzZXJXaW5kb3dcbiovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzdG9yZU9yQ3JlYXRlV2luZG93KCkge1xuICBsZXQgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpO1xuXG4gIGNvbnN0IHRlbXBsYXRlID0gW1xuICAgIHtcbiAgICAgIGxhYmVsOiAnV2luZG93JyxcbiAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgeyByb2xlOiAncXVpdCcgfSxcbiAgICAgICAgeyByb2xlOiAncmVsb2FkJyB9LFxuICAgICAgICB7IHJvbGU6ICdmb3JjZVJlbG9hZCcgfSxcbiAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICB7IHJvbGU6ICd0b2dnbGVEZXZUb29scycgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIHJvbGU6ICdoZWxwJyxcbiAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnVHV0b3JpYWxzJyxcbiAgICAgICAgICBjbGljazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL25mZGk0cGxhbnRzLm9yZy9uZmRpNHBsYW50cy5rbm93bGVkZ2ViYXNlL2RvY3MvdHV0b3JpYWxzL1F1aWNrU3RhcnRfc3dhdGUuaHRtbCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnSGVscGRlc2snLFxuICAgICAgICAgIGNsaWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vaGVscGRlc2submZkaTRwbGFudHMub3JnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdLbm93bGVkZ2UgQmFzZScsXG4gICAgICAgICAgY2xpY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9uZmRpNHBsYW50cy5vcmcvbmZkaTRwbGFudHMua25vd2xlZGdlYmFzZS9pbmRleC5odG1sJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgXVxuICAgIH1cbiAgXTtcbiAgY29uc3QgbWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUodGVtcGxhdGUpO1xuICBNZW51LnNldEFwcGxpY2F0aW9uTWVudShtZW51KTtcblxuICBpZiAod2luZG93ID09PSB1bmRlZmluZWQpIHtcbiAgICB3aW5kb3cgPSBhd2FpdCBjcmVhdGVXaW5kb3coKTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuaXNNaW5pbWl6ZWQoKSkge1xuICAgIHdpbmRvdy5yZXN0b3JlKCk7XG4gIH1cblxuICB3aW5kb3cuZm9jdXMoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IFdJTl9TTEFTSCA9ICdcXFxcXFxcXC8nO1xuY29uc3QgV0lOX05PX1NMQVNIID0gYFteJHtXSU5fU0xBU0h9XWA7XG5cbi8qKlxuICogUG9zaXggZ2xvYiByZWdleFxuICovXG5cbmNvbnN0IERPVF9MSVRFUkFMID0gJ1xcXFwuJztcbmNvbnN0IFBMVVNfTElURVJBTCA9ICdcXFxcKyc7XG5jb25zdCBRTUFSS19MSVRFUkFMID0gJ1xcXFw/JztcbmNvbnN0IFNMQVNIX0xJVEVSQUwgPSAnXFxcXC8nO1xuY29uc3QgT05FX0NIQVIgPSAnKD89LiknO1xuY29uc3QgUU1BUksgPSAnW14vXSc7XG5jb25zdCBFTkRfQU5DSE9SID0gYCg/OiR7U0xBU0hfTElURVJBTH18JClgO1xuY29uc3QgU1RBUlRfQU5DSE9SID0gYCg/Ol58JHtTTEFTSF9MSVRFUkFMfSlgO1xuY29uc3QgRE9UU19TTEFTSCA9IGAke0RPVF9MSVRFUkFMfXsxLDJ9JHtFTkRfQU5DSE9SfWA7XG5jb25zdCBOT19ET1QgPSBgKD8hJHtET1RfTElURVJBTH0pYDtcbmNvbnN0IE5PX0RPVFMgPSBgKD8hJHtTVEFSVF9BTkNIT1J9JHtET1RTX1NMQVNIfSlgO1xuY29uc3QgTk9fRE9UX1NMQVNIID0gYCg/ISR7RE9UX0xJVEVSQUx9ezAsMX0ke0VORF9BTkNIT1J9KWA7XG5jb25zdCBOT19ET1RTX1NMQVNIID0gYCg/ISR7RE9UU19TTEFTSH0pYDtcbmNvbnN0IFFNQVJLX05PX0RPVCA9IGBbXi4ke1NMQVNIX0xJVEVSQUx9XWA7XG5jb25zdCBTVEFSID0gYCR7UU1BUkt9Kj9gO1xuXG5jb25zdCBQT1NJWF9DSEFSUyA9IHtcbiAgRE9UX0xJVEVSQUwsXG4gIFBMVVNfTElURVJBTCxcbiAgUU1BUktfTElURVJBTCxcbiAgU0xBU0hfTElURVJBTCxcbiAgT05FX0NIQVIsXG4gIFFNQVJLLFxuICBFTkRfQU5DSE9SLFxuICBET1RTX1NMQVNILFxuICBOT19ET1QsXG4gIE5PX0RPVFMsXG4gIE5PX0RPVF9TTEFTSCxcbiAgTk9fRE9UU19TTEFTSCxcbiAgUU1BUktfTk9fRE9ULFxuICBTVEFSLFxuICBTVEFSVF9BTkNIT1Jcbn07XG5cbi8qKlxuICogV2luZG93cyBnbG9iIHJlZ2V4XG4gKi9cblxuY29uc3QgV0lORE9XU19DSEFSUyA9IHtcbiAgLi4uUE9TSVhfQ0hBUlMsXG5cbiAgU0xBU0hfTElURVJBTDogYFske1dJTl9TTEFTSH1dYCxcbiAgUU1BUks6IFdJTl9OT19TTEFTSCxcbiAgU1RBUjogYCR7V0lOX05PX1NMQVNIfSo/YCxcbiAgRE9UU19TTEFTSDogYCR7RE9UX0xJVEVSQUx9ezEsMn0oPzpbJHtXSU5fU0xBU0h9XXwkKWAsXG4gIE5PX0RPVDogYCg/ISR7RE9UX0xJVEVSQUx9KWAsXG4gIE5PX0RPVFM6IGAoPyEoPzpefFske1dJTl9TTEFTSH1dKSR7RE9UX0xJVEVSQUx9ezEsMn0oPzpbJHtXSU5fU0xBU0h9XXwkKSlgLFxuICBOT19ET1RfU0xBU0g6IGAoPyEke0RPVF9MSVRFUkFMfXswLDF9KD86WyR7V0lOX1NMQVNIfV18JCkpYCxcbiAgTk9fRE9UU19TTEFTSDogYCg/ISR7RE9UX0xJVEVSQUx9ezEsMn0oPzpbJHtXSU5fU0xBU0h9XXwkKSlgLFxuICBRTUFSS19OT19ET1Q6IGBbXi4ke1dJTl9TTEFTSH1dYCxcbiAgU1RBUlRfQU5DSE9SOiBgKD86XnxbJHtXSU5fU0xBU0h9XSlgLFxuICBFTkRfQU5DSE9SOiBgKD86WyR7V0lOX1NMQVNIfV18JClgXG59O1xuXG4vKipcbiAqIFBPU0lYIEJyYWNrZXQgUmVnZXhcbiAqL1xuXG5jb25zdCBQT1NJWF9SRUdFWF9TT1VSQ0UgPSB7XG4gIGFsbnVtOiAnYS16QS1aMC05JyxcbiAgYWxwaGE6ICdhLXpBLVonLFxuICBhc2NpaTogJ1xcXFx4MDAtXFxcXHg3RicsXG4gIGJsYW5rOiAnIFxcXFx0JyxcbiAgY250cmw6ICdcXFxceDAwLVxcXFx4MUZcXFxceDdGJyxcbiAgZGlnaXQ6ICcwLTknLFxuICBncmFwaDogJ1xcXFx4MjEtXFxcXHg3RScsXG4gIGxvd2VyOiAnYS16JyxcbiAgcHJpbnQ6ICdcXFxceDIwLVxcXFx4N0UgJyxcbiAgcHVuY3Q6ICdcXFxcLSFcIiMkJSZcXCcoKVxcXFwqKywuLzo7PD0+P0BbXFxcXF1eX2B7fH1+JyxcbiAgc3BhY2U6ICcgXFxcXHRcXFxcclxcXFxuXFxcXHZcXFxcZicsXG4gIHVwcGVyOiAnQS1aJyxcbiAgd29yZDogJ0EtWmEtejAtOV8nLFxuICB4ZGlnaXQ6ICdBLUZhLWYwLTknXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTUFYX0xFTkdUSDogMTAyNCAqIDY0LFxuICBQT1NJWF9SRUdFWF9TT1VSQ0UsXG5cbiAgLy8gcmVndWxhciBleHByZXNzaW9uc1xuICBSRUdFWF9CQUNLU0xBU0g6IC9cXFxcKD8hWyorP14ke30ofClbXFxdXSkvZyxcbiAgUkVHRVhfTk9OX1NQRUNJQUxfQ0hBUlM6IC9eW15AIVtcXF0uLCQqKz9ee30oKXxcXFxcL10rLyxcbiAgUkVHRVhfU1BFQ0lBTF9DSEFSUzogL1stKis/Ll4ke30ofClbXFxdXS8sXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlNfQkFDS1JFRjogLyhcXFxcPykoKFxcVykoXFwzKikpL2csXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlNfR0xPQkFMOiAvKFstKis/Ll4ke30ofClbXFxdXSkvZyxcbiAgUkVHRVhfUkVNT1ZFX0JBQ0tTTEFTSDogLyg/OlxcWy4qP1teXFxcXF1cXF18XFxcXCg/PS4pKS9nLFxuXG4gIC8vIFJlcGxhY2UgZ2xvYnMgd2l0aCBlcXVpdmFsZW50IHBhdHRlcm5zIHRvIHJlZHVjZSBwYXJzaW5nIHRpbWUuXG4gIFJFUExBQ0VNRU5UUzoge1xuICAgICcqKionOiAnKicsXG4gICAgJyoqLyoqJzogJyoqJyxcbiAgICAnKiovKiovKionOiAnKionXG4gIH0sXG5cbiAgLy8gRGlnaXRzXG4gIENIQVJfMDogNDgsIC8qIDAgKi9cbiAgQ0hBUl85OiA1NywgLyogOSAqL1xuXG4gIC8vIEFscGhhYmV0IGNoYXJzLlxuICBDSEFSX1VQUEVSQ0FTRV9BOiA2NSwgLyogQSAqL1xuICBDSEFSX0xPV0VSQ0FTRV9BOiA5NywgLyogYSAqL1xuICBDSEFSX1VQUEVSQ0FTRV9aOiA5MCwgLyogWiAqL1xuICBDSEFSX0xPV0VSQ0FTRV9aOiAxMjIsIC8qIHogKi9cblxuICBDSEFSX0xFRlRfUEFSRU5USEVTRVM6IDQwLCAvKiAoICovXG4gIENIQVJfUklHSFRfUEFSRU5USEVTRVM6IDQxLCAvKiApICovXG5cbiAgQ0hBUl9BU1RFUklTSzogNDIsIC8qICogKi9cblxuICAvLyBOb24tYWxwaGFiZXRpYyBjaGFycy5cbiAgQ0hBUl9BTVBFUlNBTkQ6IDM4LCAvKiAmICovXG4gIENIQVJfQVQ6IDY0LCAvKiBAICovXG4gIENIQVJfQkFDS1dBUkRfU0xBU0g6IDkyLCAvKiBcXCAqL1xuICBDSEFSX0NBUlJJQUdFX1JFVFVSTjogMTMsIC8qIFxcciAqL1xuICBDSEFSX0NJUkNVTUZMRVhfQUNDRU5UOiA5NCwgLyogXiAqL1xuICBDSEFSX0NPTE9OOiA1OCwgLyogOiAqL1xuICBDSEFSX0NPTU1BOiA0NCwgLyogLCAqL1xuICBDSEFSX0RPVDogNDYsIC8qIC4gKi9cbiAgQ0hBUl9ET1VCTEVfUVVPVEU6IDM0LCAvKiBcIiAqL1xuICBDSEFSX0VRVUFMOiA2MSwgLyogPSAqL1xuICBDSEFSX0VYQ0xBTUFUSU9OX01BUks6IDMzLCAvKiAhICovXG4gIENIQVJfRk9STV9GRUVEOiAxMiwgLyogXFxmICovXG4gIENIQVJfRk9SV0FSRF9TTEFTSDogNDcsIC8qIC8gKi9cbiAgQ0hBUl9HUkFWRV9BQ0NFTlQ6IDk2LCAvKiBgICovXG4gIENIQVJfSEFTSDogMzUsIC8qICMgKi9cbiAgQ0hBUl9IWVBIRU5fTUlOVVM6IDQ1LCAvKiAtICovXG4gIENIQVJfTEVGVF9BTkdMRV9CUkFDS0VUOiA2MCwgLyogPCAqL1xuICBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0U6IDEyMywgLyogeyAqL1xuICBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQ6IDkxLCAvKiBbICovXG4gIENIQVJfTElORV9GRUVEOiAxMCwgLyogXFxuICovXG4gIENIQVJfTk9fQlJFQUtfU1BBQ0U6IDE2MCwgLyogXFx1MDBBMCAqL1xuICBDSEFSX1BFUkNFTlQ6IDM3LCAvKiAlICovXG4gIENIQVJfUExVUzogNDMsIC8qICsgKi9cbiAgQ0hBUl9RVUVTVElPTl9NQVJLOiA2MywgLyogPyAqL1xuICBDSEFSX1JJR0hUX0FOR0xFX0JSQUNLRVQ6IDYyLCAvKiA+ICovXG4gIENIQVJfUklHSFRfQ1VSTFlfQlJBQ0U6IDEyNSwgLyogfSAqL1xuICBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUOiA5MywgLyogXSAqL1xuICBDSEFSX1NFTUlDT0xPTjogNTksIC8qIDsgKi9cbiAgQ0hBUl9TSU5HTEVfUVVPVEU6IDM5LCAvKiAnICovXG4gIENIQVJfU1BBQ0U6IDMyLCAvKiAgICovXG4gIENIQVJfVEFCOiA5LCAvKiBcXHQgKi9cbiAgQ0hBUl9VTkRFUlNDT1JFOiA5NSwgLyogXyAqL1xuICBDSEFSX1ZFUlRJQ0FMX0xJTkU6IDEyNCwgLyogfCAqL1xuICBDSEFSX1pFUk9fV0lEVEhfTk9CUkVBS19TUEFDRTogNjUyNzksIC8qIFxcdUZFRkYgKi9cblxuICBTRVA6IHBhdGguc2VwLFxuXG4gIC8qKlxuICAgKiBDcmVhdGUgRVhUR0xPQl9DSEFSU1xuICAgKi9cblxuICBleHRnbG9iQ2hhcnMoY2hhcnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJyEnOiB7IHR5cGU6ICduZWdhdGUnLCBvcGVuOiAnKD86KD8hKD86JywgY2xvc2U6IGApKSR7Y2hhcnMuU1RBUn0pYCB9LFxuICAgICAgJz8nOiB7IHR5cGU6ICdxbWFyaycsIG9wZW46ICcoPzonLCBjbG9zZTogJyk/JyB9LFxuICAgICAgJysnOiB7IHR5cGU6ICdwbHVzJywgb3BlbjogJyg/OicsIGNsb3NlOiAnKSsnIH0sXG4gICAgICAnKic6IHsgdHlwZTogJ3N0YXInLCBvcGVuOiAnKD86JywgY2xvc2U6ICcpKicgfSxcbiAgICAgICdAJzogeyB0eXBlOiAnYXQnLCBvcGVuOiAnKD86JywgY2xvc2U6ICcpJyB9XG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogQ3JlYXRlIEdMT0JfQ0hBUlNcbiAgICovXG5cbiAgZ2xvYkNoYXJzKHdpbjMyKSB7XG4gICAgcmV0dXJuIHdpbjMyID09PSB0cnVlID8gV0lORE9XU19DSEFSUyA6IFBPU0lYX0NIQVJTO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qgd2luMzIgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInO1xuY29uc3Qge1xuICBSRUdFWF9CQUNLU0xBU0gsXG4gIFJFR0VYX1JFTU9WRV9CQUNLU0xBU0gsXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlMsXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlNfR0xPQkFMXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuZXhwb3J0cy5pc09iamVjdCA9IHZhbCA9PiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsKTtcbmV4cG9ydHMuaGFzUmVnZXhDaGFycyA9IHN0ciA9PiBSRUdFWF9TUEVDSUFMX0NIQVJTLnRlc3Qoc3RyKTtcbmV4cG9ydHMuaXNSZWdleENoYXIgPSBzdHIgPT4gc3RyLmxlbmd0aCA9PT0gMSAmJiBleHBvcnRzLmhhc1JlZ2V4Q2hhcnMoc3RyKTtcbmV4cG9ydHMuZXNjYXBlUmVnZXggPSBzdHIgPT4gc3RyLnJlcGxhY2UoUkVHRVhfU1BFQ0lBTF9DSEFSU19HTE9CQUwsICdcXFxcJDEnKTtcbmV4cG9ydHMudG9Qb3NpeFNsYXNoZXMgPSBzdHIgPT4gc3RyLnJlcGxhY2UoUkVHRVhfQkFDS1NMQVNILCAnLycpO1xuXG5leHBvcnRzLnJlbW92ZUJhY2tzbGFzaGVzID0gc3RyID0+IHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFJFR0VYX1JFTU9WRV9CQUNLU0xBU0gsIG1hdGNoID0+IHtcbiAgICByZXR1cm4gbWF0Y2ggPT09ICdcXFxcJyA/ICcnIDogbWF0Y2g7XG4gIH0pO1xufTtcblxuZXhwb3J0cy5zdXBwb3J0c0xvb2tiZWhpbmRzID0gKCkgPT4ge1xuICBjb25zdCBzZWdzID0gcHJvY2Vzcy52ZXJzaW9uLnNsaWNlKDEpLnNwbGl0KCcuJykubWFwKE51bWJlcik7XG4gIGlmIChzZWdzLmxlbmd0aCA9PT0gMyAmJiBzZWdzWzBdID49IDkgfHwgKHNlZ3NbMF0gPT09IDggJiYgc2Vnc1sxXSA+PSAxMCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnRzLmlzV2luZG93cyA9IG9wdGlvbnMgPT4ge1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy53aW5kb3dzID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gb3B0aW9ucy53aW5kb3dzO1xuICB9XG4gIHJldHVybiB3aW4zMiA9PT0gdHJ1ZSB8fCBwYXRoLnNlcCA9PT0gJ1xcXFwnO1xufTtcblxuZXhwb3J0cy5lc2NhcGVMYXN0ID0gKGlucHV0LCBjaGFyLCBsYXN0SWR4KSA9PiB7XG4gIGNvbnN0IGlkeCA9IGlucHV0Lmxhc3RJbmRleE9mKGNoYXIsIGxhc3RJZHgpO1xuICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuIGlucHV0O1xuICBpZiAoaW5wdXRbaWR4IC0gMV0gPT09ICdcXFxcJykgcmV0dXJuIGV4cG9ydHMuZXNjYXBlTGFzdChpbnB1dCwgY2hhciwgaWR4IC0gMSk7XG4gIHJldHVybiBgJHtpbnB1dC5zbGljZSgwLCBpZHgpfVxcXFwke2lucHV0LnNsaWNlKGlkeCl9YDtcbn07XG5cbmV4cG9ydHMucmVtb3ZlUHJlZml4ID0gKGlucHV0LCBzdGF0ZSA9IHt9KSA9PiB7XG4gIGxldCBvdXRwdXQgPSBpbnB1dDtcbiAgaWYgKG91dHB1dC5zdGFydHNXaXRoKCcuLycpKSB7XG4gICAgb3V0cHV0ID0gb3V0cHV0LnNsaWNlKDIpO1xuICAgIHN0YXRlLnByZWZpeCA9ICcuLyc7XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmV4cG9ydHMud3JhcE91dHB1dCA9IChpbnB1dCwgc3RhdGUgPSB7fSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHByZXBlbmQgPSBvcHRpb25zLmNvbnRhaW5zID8gJycgOiAnXic7XG4gIGNvbnN0IGFwcGVuZCA9IG9wdGlvbnMuY29udGFpbnMgPyAnJyA6ICckJztcblxuICBsZXQgb3V0cHV0ID0gYCR7cHJlcGVuZH0oPzoke2lucHV0fSkke2FwcGVuZH1gO1xuICBpZiAoc3RhdGUubmVnYXRlZCA9PT0gdHJ1ZSkge1xuICAgIG91dHB1dCA9IGAoPzpeKD8hJHtvdXRwdXR9KS4qJClgO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IHtcbiAgQ0hBUl9BU1RFUklTSywgICAgICAgICAgICAgLyogKiAqL1xuICBDSEFSX0FULCAgICAgICAgICAgICAgICAgICAvKiBAICovXG4gIENIQVJfQkFDS1dBUkRfU0xBU0gsICAgICAgIC8qIFxcICovXG4gIENIQVJfQ09NTUEsICAgICAgICAgICAgICAgIC8qICwgKi9cbiAgQ0hBUl9ET1QsICAgICAgICAgICAgICAgICAgLyogLiAqL1xuICBDSEFSX0VYQ0xBTUFUSU9OX01BUkssICAgICAvKiAhICovXG4gIENIQVJfRk9SV0FSRF9TTEFTSCwgICAgICAgIC8qIC8gKi9cbiAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNFLCAgICAgLyogeyAqL1xuICBDSEFSX0xFRlRfUEFSRU5USEVTRVMsICAgICAvKiAoICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCwgIC8qIFsgKi9cbiAgQ0hBUl9QTFVTLCAgICAgICAgICAgICAgICAgLyogKyAqL1xuICBDSEFSX1FVRVNUSU9OX01BUkssICAgICAgICAvKiA/ICovXG4gIENIQVJfUklHSFRfQ1VSTFlfQlJBQ0UsICAgIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUywgICAgLyogKSAqL1xuICBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUICAvKiBdICovXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3QgaXNQYXRoU2VwYXJhdG9yID0gY29kZSA9PiB7XG4gIHJldHVybiBjb2RlID09PSBDSEFSX0ZPUldBUkRfU0xBU0ggfHwgY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSDtcbn07XG5cbmNvbnN0IGRlcHRoID0gdG9rZW4gPT4ge1xuICBpZiAodG9rZW4uaXNQcmVmaXggIT09IHRydWUpIHtcbiAgICB0b2tlbi5kZXB0aCA9IHRva2VuLmlzR2xvYnN0YXIgPyBJbmZpbml0eSA6IDE7XG4gIH1cbn07XG5cbi8qKlxuICogUXVpY2tseSBzY2FucyBhIGdsb2IgcGF0dGVybiBhbmQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIGhhbmRmdWwgb2ZcbiAqIHVzZWZ1bCBwcm9wZXJ0aWVzLCBsaWtlIGBpc0dsb2JgLCBgcGF0aGAgKHRoZSBsZWFkaW5nIG5vbi1nbG9iLCBpZiBpdCBleGlzdHMpLFxuICogYGdsb2JgICh0aGUgYWN0dWFsIHBhdHRlcm4pLCBgbmVnYXRlZGAgKHRydWUgaWYgdGhlIHBhdGggc3RhcnRzIHdpdGggYCFgIGJ1dCBub3RcbiAqIHdpdGggYCEoYCkgYW5kIGBuZWdhdGVkRXh0Z2xvYmAgKHRydWUgaWYgdGhlIHBhdGggc3RhcnRzIHdpdGggYCEoYCkuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBtID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiBjb25zb2xlLmxvZyhwbS5zY2FuKCdmb28vYmFyLyouanMnKSk7XG4gKiB7IGlzR2xvYjogdHJ1ZSwgaW5wdXQ6ICdmb28vYmFyLyouanMnLCBiYXNlOiAnZm9vL2JhcicsIGdsb2I6ICcqLmpzJyB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRva2VucyBhbmQgcmVnZXggc291cmNlIHN0cmluZy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuY29uc3Qgc2NhbiA9IChpbnB1dCwgb3B0aW9ucykgPT4ge1xuICBjb25zdCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcblxuICBjb25zdCBsZW5ndGggPSBpbnB1dC5sZW5ndGggLSAxO1xuICBjb25zdCBzY2FuVG9FbmQgPSBvcHRzLnBhcnRzID09PSB0cnVlIHx8IG9wdHMuc2NhblRvRW5kID09PSB0cnVlO1xuICBjb25zdCBzbGFzaGVzID0gW107XG4gIGNvbnN0IHRva2VucyA9IFtdO1xuICBjb25zdCBwYXJ0cyA9IFtdO1xuXG4gIGxldCBzdHIgPSBpbnB1dDtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGxldCBzdGFydCA9IDA7XG4gIGxldCBsYXN0SW5kZXggPSAwO1xuICBsZXQgaXNCcmFjZSA9IGZhbHNlO1xuICBsZXQgaXNCcmFja2V0ID0gZmFsc2U7XG4gIGxldCBpc0dsb2IgPSBmYWxzZTtcbiAgbGV0IGlzRXh0Z2xvYiA9IGZhbHNlO1xuICBsZXQgaXNHbG9ic3RhciA9IGZhbHNlO1xuICBsZXQgYnJhY2VFc2NhcGVkID0gZmFsc2U7XG4gIGxldCBiYWNrc2xhc2hlcyA9IGZhbHNlO1xuICBsZXQgbmVnYXRlZCA9IGZhbHNlO1xuICBsZXQgbmVnYXRlZEV4dGdsb2IgPSBmYWxzZTtcbiAgbGV0IGZpbmlzaGVkID0gZmFsc2U7XG4gIGxldCBicmFjZXMgPSAwO1xuICBsZXQgcHJldjtcbiAgbGV0IGNvZGU7XG4gIGxldCB0b2tlbiA9IHsgdmFsdWU6ICcnLCBkZXB0aDogMCwgaXNHbG9iOiBmYWxzZSB9O1xuXG4gIGNvbnN0IGVvcyA9ICgpID0+IGluZGV4ID49IGxlbmd0aDtcbiAgY29uc3QgcGVlayA9ICgpID0+IHN0ci5jaGFyQ29kZUF0KGluZGV4ICsgMSk7XG4gIGNvbnN0IGFkdmFuY2UgPSAoKSA9PiB7XG4gICAgcHJldiA9IGNvZGU7XG4gICAgcmV0dXJuIHN0ci5jaGFyQ29kZUF0KCsraW5kZXgpO1xuICB9O1xuXG4gIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgIGNvZGUgPSBhZHZhbmNlKCk7XG4gICAgbGV0IG5leHQ7XG5cbiAgICBpZiAoY29kZSA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgYmFja3NsYXNoZXMgPSB0b2tlbi5iYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICBjb2RlID0gYWR2YW5jZSgpO1xuXG4gICAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNFKSB7XG4gICAgICAgIGJyYWNlRXNjYXBlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoYnJhY2VFc2NhcGVkID09PSB0cnVlIHx8IGNvZGUgPT09IENIQVJfTEVGVF9DVVJMWV9CUkFDRSkge1xuICAgICAgYnJhY2VzKys7XG5cbiAgICAgIHdoaWxlIChlb3MoKSAhPT0gdHJ1ZSAmJiAoY29kZSA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfQkFDS1dBUkRfU0xBU0gpIHtcbiAgICAgICAgICBiYWNrc2xhc2hlcyA9IHRva2VuLmJhY2tzbGFzaGVzID0gdHJ1ZTtcbiAgICAgICAgICBhZHZhbmNlKCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNFKSB7XG4gICAgICAgICAgYnJhY2VzKys7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYnJhY2VFc2NhcGVkICE9PSB0cnVlICYmIGNvZGUgPT09IENIQVJfRE9UICYmIChjb2RlID0gYWR2YW5jZSgpKSA9PT0gQ0hBUl9ET1QpIHtcbiAgICAgICAgICBpc0JyYWNlID0gdG9rZW4uaXNCcmFjZSA9IHRydWU7XG4gICAgICAgICAgaXNHbG9iID0gdG9rZW4uaXNHbG9iID0gdHJ1ZTtcbiAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChicmFjZUVzY2FwZWQgIT09IHRydWUgJiYgY29kZSA9PT0gQ0hBUl9DT01NQSkge1xuICAgICAgICAgIGlzQnJhY2UgPSB0b2tlbi5pc0JyYWNlID0gdHJ1ZTtcbiAgICAgICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfUklHSFRfQ1VSTFlfQlJBQ0UpIHtcbiAgICAgICAgICBicmFjZXMtLTtcblxuICAgICAgICAgIGlmIChicmFjZXMgPT09IDApIHtcbiAgICAgICAgICAgIGJyYWNlRXNjYXBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaXNCcmFjZSA9IHRva2VuLmlzQnJhY2UgPSB0cnVlO1xuICAgICAgICAgICAgZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChjb2RlID09PSBDSEFSX0ZPUldBUkRfU0xBU0gpIHtcbiAgICAgIHNsYXNoZXMucHVzaChpbmRleCk7XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICB0b2tlbiA9IHsgdmFsdWU6ICcnLCBkZXB0aDogMCwgaXNHbG9iOiBmYWxzZSB9O1xuXG4gICAgICBpZiAoZmluaXNoZWQgPT09IHRydWUpIGNvbnRpbnVlO1xuICAgICAgaWYgKHByZXYgPT09IENIQVJfRE9UICYmIGluZGV4ID09PSAoc3RhcnQgKyAxKSkge1xuICAgICAgICBzdGFydCArPSAyO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGFzdEluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMubm9leHQgIT09IHRydWUpIHtcbiAgICAgIGNvbnN0IGlzRXh0Z2xvYkNoYXIgPSBjb2RlID09PSBDSEFSX1BMVVNcbiAgICAgICAgfHwgY29kZSA9PT0gQ0hBUl9BVFxuICAgICAgICB8fCBjb2RlID09PSBDSEFSX0FTVEVSSVNLXG4gICAgICAgIHx8IGNvZGUgPT09IENIQVJfUVVFU1RJT05fTUFSS1xuICAgICAgICB8fCBjb2RlID09PSBDSEFSX0VYQ0xBTUFUSU9OX01BUks7XG5cbiAgICAgIGlmIChpc0V4dGdsb2JDaGFyID09PSB0cnVlICYmIHBlZWsoKSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICAgIGlzRXh0Z2xvYiA9IHRva2VuLmlzRXh0Z2xvYiA9IHRydWU7XG4gICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfRVhDTEFNQVRJT05fTUFSSyAmJiBpbmRleCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICBuZWdhdGVkRXh0Z2xvYiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgd2hpbGUgKGVvcygpICE9PSB0cnVlICYmIChjb2RlID0gYWR2YW5jZSgpKSkge1xuICAgICAgICAgICAgaWYgKGNvZGUgPT09IENIQVJfQkFDS1dBUkRfU0xBU0gpIHtcbiAgICAgICAgICAgICAgYmFja3NsYXNoZXMgPSB0b2tlbi5iYWNrc2xhc2hlcyA9IHRydWU7XG4gICAgICAgICAgICAgIGNvZGUgPSBhZHZhbmNlKCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUykge1xuICAgICAgICAgICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gQ0hBUl9BU1RFUklTSykge1xuICAgICAgaWYgKHByZXYgPT09IENIQVJfQVNURVJJU0spIGlzR2xvYnN0YXIgPSB0b2tlbi5pc0dsb2JzdGFyID0gdHJ1ZTtcbiAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG4gICAgICBmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gQ0hBUl9RVUVTVElPTl9NQVJLKSB7XG4gICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgZmluaXNoZWQgPSB0cnVlO1xuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCkge1xuICAgICAgd2hpbGUgKGVvcygpICE9PSB0cnVlICYmIChuZXh0ID0gYWR2YW5jZSgpKSkge1xuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9CQUNLV0FSRF9TTEFTSCkge1xuICAgICAgICAgIGJhY2tzbGFzaGVzID0gdG9rZW4uYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICAgIGFkdmFuY2UoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICAgICAgaXNCcmFja2V0ID0gdG9rZW4uaXNCcmFja2V0ID0gdHJ1ZTtcbiAgICAgICAgICBpc0dsb2IgPSB0b2tlbi5pc0dsb2IgPSB0cnVlO1xuICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2NhblRvRW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAob3B0cy5ub25lZ2F0ZSAhPT0gdHJ1ZSAmJiBjb2RlID09PSBDSEFSX0VYQ0xBTUFUSU9OX01BUksgJiYgaW5kZXggPT09IHN0YXJ0KSB7XG4gICAgICBuZWdhdGVkID0gdG9rZW4ubmVnYXRlZCA9IHRydWU7XG4gICAgICBzdGFydCsrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMubm9wYXJlbiAhPT0gdHJ1ZSAmJiBjb2RlID09PSBDSEFSX0xFRlRfUEFSRU5USEVTRVMpIHtcbiAgICAgIGlzR2xvYiA9IHRva2VuLmlzR2xvYiA9IHRydWU7XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgd2hpbGUgKGVvcygpICE9PSB0cnVlICYmIChjb2RlID0gYWR2YW5jZSgpKSkge1xuICAgICAgICAgIGlmIChjb2RlID09PSBDSEFSX0xFRlRfUEFSRU5USEVTRVMpIHtcbiAgICAgICAgICAgIGJhY2tzbGFzaGVzID0gdG9rZW4uYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgY29kZSA9IGFkdmFuY2UoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb2RlID09PSBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTKSB7XG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoaXNHbG9iID09PSB0cnVlKSB7XG4gICAgICBmaW5pc2hlZCA9IHRydWU7XG5cbiAgICAgIGlmIChzY2FuVG9FbmQgPT09IHRydWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRzLm5vZXh0ID09PSB0cnVlKSB7XG4gICAgaXNFeHRnbG9iID0gZmFsc2U7XG4gICAgaXNHbG9iID0gZmFsc2U7XG4gIH1cblxuICBsZXQgYmFzZSA9IHN0cjtcbiAgbGV0IHByZWZpeCA9ICcnO1xuICBsZXQgZ2xvYiA9ICcnO1xuXG4gIGlmIChzdGFydCA+IDApIHtcbiAgICBwcmVmaXggPSBzdHIuc2xpY2UoMCwgc3RhcnQpO1xuICAgIHN0ciA9IHN0ci5zbGljZShzdGFydCk7XG4gICAgbGFzdEluZGV4IC09IHN0YXJ0O1xuICB9XG5cbiAgaWYgKGJhc2UgJiYgaXNHbG9iID09PSB0cnVlICYmIGxhc3RJbmRleCA+IDApIHtcbiAgICBiYXNlID0gc3RyLnNsaWNlKDAsIGxhc3RJbmRleCk7XG4gICAgZ2xvYiA9IHN0ci5zbGljZShsYXN0SW5kZXgpO1xuICB9IGVsc2UgaWYgKGlzR2xvYiA9PT0gdHJ1ZSkge1xuICAgIGJhc2UgPSAnJztcbiAgICBnbG9iID0gc3RyO1xuICB9IGVsc2Uge1xuICAgIGJhc2UgPSBzdHI7XG4gIH1cblxuICBpZiAoYmFzZSAmJiBiYXNlICE9PSAnJyAmJiBiYXNlICE9PSAnLycgJiYgYmFzZSAhPT0gc3RyKSB7XG4gICAgaWYgKGlzUGF0aFNlcGFyYXRvcihiYXNlLmNoYXJDb2RlQXQoYmFzZS5sZW5ndGggLSAxKSkpIHtcbiAgICAgIGJhc2UgPSBiYXNlLnNsaWNlKDAsIC0xKTtcbiAgICB9XG4gIH1cblxuICBpZiAob3B0cy51bmVzY2FwZSA9PT0gdHJ1ZSkge1xuICAgIGlmIChnbG9iKSBnbG9iID0gdXRpbHMucmVtb3ZlQmFja3NsYXNoZXMoZ2xvYik7XG5cbiAgICBpZiAoYmFzZSAmJiBiYWNrc2xhc2hlcyA9PT0gdHJ1ZSkge1xuICAgICAgYmFzZSA9IHV0aWxzLnJlbW92ZUJhY2tzbGFzaGVzKGJhc2UpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIHByZWZpeCxcbiAgICBpbnB1dCxcbiAgICBzdGFydCxcbiAgICBiYXNlLFxuICAgIGdsb2IsXG4gICAgaXNCcmFjZSxcbiAgICBpc0JyYWNrZXQsXG4gICAgaXNHbG9iLFxuICAgIGlzRXh0Z2xvYixcbiAgICBpc0dsb2JzdGFyLFxuICAgIG5lZ2F0ZWQsXG4gICAgbmVnYXRlZEV4dGdsb2JcbiAgfTtcblxuICBpZiAob3B0cy50b2tlbnMgPT09IHRydWUpIHtcbiAgICBzdGF0ZS5tYXhEZXB0aCA9IDA7XG4gICAgaWYgKCFpc1BhdGhTZXBhcmF0b3IoY29kZSkpIHtcbiAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICB9XG4gICAgc3RhdGUudG9rZW5zID0gdG9rZW5zO1xuICB9XG5cbiAgaWYgKG9wdHMucGFydHMgPT09IHRydWUgfHwgb3B0cy50b2tlbnMgPT09IHRydWUpIHtcbiAgICBsZXQgcHJldkluZGV4O1xuXG4gICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgc2xhc2hlcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBjb25zdCBuID0gcHJldkluZGV4ID8gcHJldkluZGV4ICsgMSA6IHN0YXJ0O1xuICAgICAgY29uc3QgaSA9IHNsYXNoZXNbaWR4XTtcbiAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXQuc2xpY2UobiwgaSk7XG4gICAgICBpZiAob3B0cy50b2tlbnMpIHtcbiAgICAgICAgaWYgKGlkeCA9PT0gMCAmJiBzdGFydCAhPT0gMCkge1xuICAgICAgICAgIHRva2Vuc1tpZHhdLmlzUHJlZml4ID0gdHJ1ZTtcbiAgICAgICAgICB0b2tlbnNbaWR4XS52YWx1ZSA9IHByZWZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2tlbnNbaWR4XS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGRlcHRoKHRva2Vuc1tpZHhdKTtcbiAgICAgICAgc3RhdGUubWF4RGVwdGggKz0gdG9rZW5zW2lkeF0uZGVwdGg7XG4gICAgICB9XG4gICAgICBpZiAoaWR4ICE9PSAwIHx8IHZhbHVlICE9PSAnJykge1xuICAgICAgICBwYXJ0cy5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHByZXZJbmRleCA9IGk7XG4gICAgfVxuXG4gICAgaWYgKHByZXZJbmRleCAmJiBwcmV2SW5kZXggKyAxIDwgaW5wdXQubGVuZ3RoKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGlucHV0LnNsaWNlKHByZXZJbmRleCArIDEpO1xuICAgICAgcGFydHMucHVzaCh2YWx1ZSk7XG5cbiAgICAgIGlmIChvcHRzLnRva2Vucykge1xuICAgICAgICB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGRlcHRoKHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0pO1xuICAgICAgICBzdGF0ZS5tYXhEZXB0aCArPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdLmRlcHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRlLnNsYXNoZXMgPSBzbGFzaGVzO1xuICAgIHN0YXRlLnBhcnRzID0gcGFydHM7XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNjYW47XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLyoqXG4gKiBDb25zdGFudHNcbiAqL1xuXG5jb25zdCB7XG4gIE1BWF9MRU5HVEgsXG4gIFBPU0lYX1JFR0VYX1NPVVJDRSxcbiAgUkVHRVhfTk9OX1NQRUNJQUxfQ0hBUlMsXG4gIFJFR0VYX1NQRUNJQUxfQ0hBUlNfQkFDS1JFRixcbiAgUkVQTEFDRU1FTlRTXG59ID0gY29uc3RhbnRzO1xuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuXG5jb25zdCBleHBhbmRSYW5nZSA9IChhcmdzLCBvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5leHBhbmRSYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBvcHRpb25zLmV4cGFuZFJhbmdlKC4uLmFyZ3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgYXJncy5zb3J0KCk7XG4gIGNvbnN0IHZhbHVlID0gYFske2FyZ3Muam9pbignLScpfV1gO1xuXG4gIHRyeSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldyAqL1xuICAgIG5ldyBSZWdFeHAodmFsdWUpO1xuICB9IGNhdGNoIChleCkge1xuICAgIHJldHVybiBhcmdzLm1hcCh2ID0+IHV0aWxzLmVzY2FwZVJlZ2V4KHYpKS5qb2luKCcuLicpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIG1lc3NhZ2UgZm9yIGEgc3ludGF4IGVycm9yXG4gKi9cblxuY29uc3Qgc3ludGF4RXJyb3IgPSAodHlwZSwgY2hhcikgPT4ge1xuICByZXR1cm4gYE1pc3NpbmcgJHt0eXBlfTogXCIke2NoYXJ9XCIgLSB1c2UgXCJcXFxcXFxcXCR7Y2hhcn1cIiB0byBtYXRjaCBsaXRlcmFsIGNoYXJhY3RlcnNgO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gaW5wdXQgc3RyaW5nLlxuICogQHBhcmFtIHtTdHJpbmd9IGlucHV0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmNvbnN0IHBhcnNlID0gKGlucHV0LCBvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIGlucHV0ID0gUkVQTEFDRU1FTlRTW2lucHV0XSB8fCBpbnB1dDtcblxuICBjb25zdCBvcHRzID0geyAuLi5vcHRpb25zIH07XG4gIGNvbnN0IG1heCA9IHR5cGVvZiBvcHRzLm1heExlbmd0aCA9PT0gJ251bWJlcicgPyBNYXRoLm1pbihNQVhfTEVOR1RILCBvcHRzLm1heExlbmd0aCkgOiBNQVhfTEVOR1RIO1xuXG4gIGxldCBsZW4gPSBpbnB1dC5sZW5ndGg7XG4gIGlmIChsZW4gPiBtYXgpIHtcbiAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYElucHV0IGxlbmd0aDogJHtsZW59LCBleGNlZWRzIG1heGltdW0gYWxsb3dlZCBsZW5ndGg6ICR7bWF4fWApO1xuICB9XG5cbiAgY29uc3QgYm9zID0geyB0eXBlOiAnYm9zJywgdmFsdWU6ICcnLCBvdXRwdXQ6IG9wdHMucHJlcGVuZCB8fCAnJyB9O1xuICBjb25zdCB0b2tlbnMgPSBbYm9zXTtcblxuICBjb25zdCBjYXB0dXJlID0gb3B0cy5jYXB0dXJlID8gJycgOiAnPzonO1xuICBjb25zdCB3aW4zMiA9IHV0aWxzLmlzV2luZG93cyhvcHRpb25zKTtcblxuICAvLyBjcmVhdGUgY29uc3RhbnRzIGJhc2VkIG9uIHBsYXRmb3JtLCBmb3Igd2luZG93cyBvciBwb3NpeFxuICBjb25zdCBQTEFURk9STV9DSEFSUyA9IGNvbnN0YW50cy5nbG9iQ2hhcnMod2luMzIpO1xuICBjb25zdCBFWFRHTE9CX0NIQVJTID0gY29uc3RhbnRzLmV4dGdsb2JDaGFycyhQTEFURk9STV9DSEFSUyk7XG5cbiAgY29uc3Qge1xuICAgIERPVF9MSVRFUkFMLFxuICAgIFBMVVNfTElURVJBTCxcbiAgICBTTEFTSF9MSVRFUkFMLFxuICAgIE9ORV9DSEFSLFxuICAgIERPVFNfU0xBU0gsXG4gICAgTk9fRE9ULFxuICAgIE5PX0RPVF9TTEFTSCxcbiAgICBOT19ET1RTX1NMQVNILFxuICAgIFFNQVJLLFxuICAgIFFNQVJLX05PX0RPVCxcbiAgICBTVEFSLFxuICAgIFNUQVJUX0FOQ0hPUlxuICB9ID0gUExBVEZPUk1fQ0hBUlM7XG5cbiAgY29uc3QgZ2xvYnN0YXIgPSBvcHRzID0+IHtcbiAgICByZXR1cm4gYCgke2NhcHR1cmV9KD86KD8hJHtTVEFSVF9BTkNIT1J9JHtvcHRzLmRvdCA/IERPVFNfU0xBU0ggOiBET1RfTElURVJBTH0pLikqPylgO1xuICB9O1xuXG4gIGNvbnN0IG5vZG90ID0gb3B0cy5kb3QgPyAnJyA6IE5PX0RPVDtcbiAgY29uc3QgcW1hcmtOb0RvdCA9IG9wdHMuZG90ID8gUU1BUksgOiBRTUFSS19OT19ET1Q7XG4gIGxldCBzdGFyID0gb3B0cy5iYXNoID09PSB0cnVlID8gZ2xvYnN0YXIob3B0cykgOiBTVEFSO1xuXG4gIGlmIChvcHRzLmNhcHR1cmUpIHtcbiAgICBzdGFyID0gYCgke3N0YXJ9KWA7XG4gIH1cblxuICAvLyBtaW5pbWF0Y2ggb3B0aW9ucyBzdXBwb3J0XG4gIGlmICh0eXBlb2Ygb3B0cy5ub2V4dCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0cy5ub2V4dGdsb2IgPSBvcHRzLm5vZXh0O1xuICB9XG5cbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgaW5wdXQsXG4gICAgaW5kZXg6IC0xLFxuICAgIHN0YXJ0OiAwLFxuICAgIGRvdDogb3B0cy5kb3QgPT09IHRydWUsXG4gICAgY29uc3VtZWQ6ICcnLFxuICAgIG91dHB1dDogJycsXG4gICAgcHJlZml4OiAnJyxcbiAgICBiYWNrdHJhY2s6IGZhbHNlLFxuICAgIG5lZ2F0ZWQ6IGZhbHNlLFxuICAgIGJyYWNrZXRzOiAwLFxuICAgIGJyYWNlczogMCxcbiAgICBwYXJlbnM6IDAsXG4gICAgcXVvdGVzOiAwLFxuICAgIGdsb2JzdGFyOiBmYWxzZSxcbiAgICB0b2tlbnNcbiAgfTtcblxuICBpbnB1dCA9IHV0aWxzLnJlbW92ZVByZWZpeChpbnB1dCwgc3RhdGUpO1xuICBsZW4gPSBpbnB1dC5sZW5ndGg7XG5cbiAgY29uc3QgZXh0Z2xvYnMgPSBbXTtcbiAgY29uc3QgYnJhY2VzID0gW107XG4gIGNvbnN0IHN0YWNrID0gW107XG4gIGxldCBwcmV2ID0gYm9zO1xuICBsZXQgdmFsdWU7XG5cbiAgLyoqXG4gICAqIFRva2VuaXppbmcgaGVscGVyc1xuICAgKi9cblxuICBjb25zdCBlb3MgPSAoKSA9PiBzdGF0ZS5pbmRleCA9PT0gbGVuIC0gMTtcbiAgY29uc3QgcGVlayA9IHN0YXRlLnBlZWsgPSAobiA9IDEpID0+IGlucHV0W3N0YXRlLmluZGV4ICsgbl07XG4gIGNvbnN0IGFkdmFuY2UgPSBzdGF0ZS5hZHZhbmNlID0gKCkgPT4gaW5wdXRbKytzdGF0ZS5pbmRleF0gfHwgJyc7XG4gIGNvbnN0IHJlbWFpbmluZyA9ICgpID0+IGlucHV0LnNsaWNlKHN0YXRlLmluZGV4ICsgMSk7XG4gIGNvbnN0IGNvbnN1bWUgPSAodmFsdWUgPSAnJywgbnVtID0gMCkgPT4ge1xuICAgIHN0YXRlLmNvbnN1bWVkICs9IHZhbHVlO1xuICAgIHN0YXRlLmluZGV4ICs9IG51bTtcbiAgfTtcblxuICBjb25zdCBhcHBlbmQgPSB0b2tlbiA9PiB7XG4gICAgc3RhdGUub3V0cHV0ICs9IHRva2VuLm91dHB1dCAhPSBudWxsID8gdG9rZW4ub3V0cHV0IDogdG9rZW4udmFsdWU7XG4gICAgY29uc3VtZSh0b2tlbi52YWx1ZSk7XG4gIH07XG5cbiAgY29uc3QgbmVnYXRlID0gKCkgPT4ge1xuICAgIGxldCBjb3VudCA9IDE7XG5cbiAgICB3aGlsZSAocGVlaygpID09PSAnIScgJiYgKHBlZWsoMikgIT09ICcoJyB8fCBwZWVrKDMpID09PSAnPycpKSB7XG4gICAgICBhZHZhbmNlKCk7XG4gICAgICBzdGF0ZS5zdGFydCsrO1xuICAgICAgY291bnQrKztcbiAgICB9XG5cbiAgICBpZiAoY291bnQgJSAyID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGUubmVnYXRlZCA9IHRydWU7XG4gICAgc3RhdGUuc3RhcnQrKztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBpbmNyZW1lbnQgPSB0eXBlID0+IHtcbiAgICBzdGF0ZVt0eXBlXSsrO1xuICAgIHN0YWNrLnB1c2godHlwZSk7XG4gIH07XG5cbiAgY29uc3QgZGVjcmVtZW50ID0gdHlwZSA9PiB7XG4gICAgc3RhdGVbdHlwZV0tLTtcbiAgICBzdGFjay5wb3AoKTtcbiAgfTtcblxuICAvKipcbiAgICogUHVzaCB0b2tlbnMgb250byB0aGUgdG9rZW5zIGFycmF5LiBUaGlzIGhlbHBlciBzcGVlZHMgdXBcbiAgICogdG9rZW5pemluZyBieSAxKSBoZWxwaW5nIHVzIGF2b2lkIGJhY2t0cmFja2luZyBhcyBtdWNoIGFzIHBvc3NpYmxlLFxuICAgKiBhbmQgMikgaGVscGluZyB1cyBhdm9pZCBjcmVhdGluZyBleHRyYSB0b2tlbnMgd2hlbiBjb25zZWN1dGl2ZVxuICAgKiBjaGFyYWN0ZXJzIGFyZSBwbGFpbiB0ZXh0LiBUaGlzIGltcHJvdmVzIHBlcmZvcm1hbmNlIGFuZCBzaW1wbGlmaWVzXG4gICAqIGxvb2tiZWhpbmRzLlxuICAgKi9cblxuICBjb25zdCBwdXNoID0gdG9rID0+IHtcbiAgICBpZiAocHJldi50eXBlID09PSAnZ2xvYnN0YXInKSB7XG4gICAgICBjb25zdCBpc0JyYWNlID0gc3RhdGUuYnJhY2VzID4gMCAmJiAodG9rLnR5cGUgPT09ICdjb21tYScgfHwgdG9rLnR5cGUgPT09ICdicmFjZScpO1xuICAgICAgY29uc3QgaXNFeHRnbG9iID0gdG9rLmV4dGdsb2IgPT09IHRydWUgfHwgKGV4dGdsb2JzLmxlbmd0aCAmJiAodG9rLnR5cGUgPT09ICdwaXBlJyB8fCB0b2sudHlwZSA9PT0gJ3BhcmVuJykpO1xuXG4gICAgICBpZiAodG9rLnR5cGUgIT09ICdzbGFzaCcgJiYgdG9rLnR5cGUgIT09ICdwYXJlbicgJiYgIWlzQnJhY2UgJiYgIWlzRXh0Z2xvYikge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLXByZXYub3V0cHV0Lmxlbmd0aCk7XG4gICAgICAgIHByZXYudHlwZSA9ICdzdGFyJztcbiAgICAgICAgcHJldi52YWx1ZSA9ICcqJztcbiAgICAgICAgcHJldi5vdXRwdXQgPSBzdGFyO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gcHJldi5vdXRwdXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGV4dGdsb2JzLmxlbmd0aCAmJiB0b2sudHlwZSAhPT0gJ3BhcmVuJykge1xuICAgICAgZXh0Z2xvYnNbZXh0Z2xvYnMubGVuZ3RoIC0gMV0uaW5uZXIgKz0gdG9rLnZhbHVlO1xuICAgIH1cblxuICAgIGlmICh0b2sudmFsdWUgfHwgdG9rLm91dHB1dCkgYXBwZW5kKHRvayk7XG4gICAgaWYgKHByZXYgJiYgcHJldi50eXBlID09PSAndGV4dCcgJiYgdG9rLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgcHJldi52YWx1ZSArPSB0b2sudmFsdWU7XG4gICAgICBwcmV2Lm91dHB1dCA9IChwcmV2Lm91dHB1dCB8fCAnJykgKyB0b2sudmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rLnByZXYgPSBwcmV2O1xuICAgIHRva2Vucy5wdXNoKHRvayk7XG4gICAgcHJldiA9IHRvaztcbiAgfTtcblxuICBjb25zdCBleHRnbG9iT3BlbiA9ICh0eXBlLCB2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IHRva2VuID0geyAuLi5FWFRHTE9CX0NIQVJTW3ZhbHVlXSwgY29uZGl0aW9uczogMSwgaW5uZXI6ICcnIH07XG5cbiAgICB0b2tlbi5wcmV2ID0gcHJldjtcbiAgICB0b2tlbi5wYXJlbnMgPSBzdGF0ZS5wYXJlbnM7XG4gICAgdG9rZW4ub3V0cHV0ID0gc3RhdGUub3V0cHV0O1xuICAgIGNvbnN0IG91dHB1dCA9IChvcHRzLmNhcHR1cmUgPyAnKCcgOiAnJykgKyB0b2tlbi5vcGVuO1xuXG4gICAgaW5jcmVtZW50KCdwYXJlbnMnKTtcbiAgICBwdXNoKHsgdHlwZSwgdmFsdWUsIG91dHB1dDogc3RhdGUub3V0cHV0ID8gJycgOiBPTkVfQ0hBUiB9KTtcbiAgICBwdXNoKHsgdHlwZTogJ3BhcmVuJywgZXh0Z2xvYjogdHJ1ZSwgdmFsdWU6IGFkdmFuY2UoKSwgb3V0cHV0IH0pO1xuICAgIGV4dGdsb2JzLnB1c2godG9rZW4pO1xuICB9O1xuXG4gIGNvbnN0IGV4dGdsb2JDbG9zZSA9IHRva2VuID0+IHtcbiAgICBsZXQgb3V0cHV0ID0gdG9rZW4uY2xvc2UgKyAob3B0cy5jYXB0dXJlID8gJyknIDogJycpO1xuICAgIGxldCByZXN0O1xuXG4gICAgaWYgKHRva2VuLnR5cGUgPT09ICduZWdhdGUnKSB7XG4gICAgICBsZXQgZXh0Z2xvYlN0YXIgPSBzdGFyO1xuXG4gICAgICBpZiAodG9rZW4uaW5uZXIgJiYgdG9rZW4uaW5uZXIubGVuZ3RoID4gMSAmJiB0b2tlbi5pbm5lci5pbmNsdWRlcygnLycpKSB7XG4gICAgICAgIGV4dGdsb2JTdGFyID0gZ2xvYnN0YXIob3B0cyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChleHRnbG9iU3RhciAhPT0gc3RhciB8fCBlb3MoKSB8fCAvXlxcKSskLy50ZXN0KHJlbWFpbmluZygpKSkge1xuICAgICAgICBvdXRwdXQgPSB0b2tlbi5jbG9zZSA9IGApJCkpJHtleHRnbG9iU3Rhcn1gO1xuICAgICAgfVxuXG4gICAgICBpZiAodG9rZW4uaW5uZXIuaW5jbHVkZXMoJyonKSAmJiAocmVzdCA9IHJlbWFpbmluZygpKSAmJiAvXlxcLlteXFxcXC8uXSskLy50ZXN0KHJlc3QpKSB7XG4gICAgICAgIC8vIEFueSBub24tbWFnaWNhbCBzdHJpbmcgKGAudHNgKSBvciBldmVuIG5lc3RlZCBleHByZXNzaW9uIChgLnt0cyx0c3h9YCkgY2FuIGZvbGxvdyBhZnRlciB0aGUgY2xvc2luZyBwYXJlbnRoZXNpcy5cbiAgICAgICAgLy8gSW4gdGhpcyBjYXNlLCB3ZSBuZWVkIHRvIHBhcnNlIHRoZSBzdHJpbmcgYW5kIHVzZSBpdCBpbiB0aGUgb3V0cHV0IG9mIHRoZSBvcmlnaW5hbCBwYXR0ZXJuLlxuICAgICAgICAvLyBTdWl0YWJsZSBwYXR0ZXJuczogYC8hKCouZCkudHNgLCBgLyEoKi5kKS57dHMsdHN4fWAsIGAqKi8hKCotZGJnKS5AKGpzKWAuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIERpc2FibGluZyB0aGUgYGZhc3RwYXRoc2Agb3B0aW9uIGR1ZSB0byBhIHByb2JsZW0gd2l0aCBwYXJzaW5nIHN0cmluZ3MgYXMgYC50c2AgaW4gdGhlIHBhdHRlcm4gbGlrZSBgKiovISgqLmQpLnRzYC5cbiAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHBhcnNlKHJlc3QsIHsgLi4ub3B0aW9ucywgZmFzdHBhdGhzOiBmYWxzZSB9KS5vdXRwdXQ7XG5cbiAgICAgICAgb3V0cHV0ID0gdG9rZW4uY2xvc2UgPSBgKSR7ZXhwcmVzc2lvbn0pJHtleHRnbG9iU3Rhcn0pYDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRva2VuLnByZXYudHlwZSA9PT0gJ2JvcycpIHtcbiAgICAgICAgc3RhdGUubmVnYXRlZEV4dGdsb2IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1c2goeyB0eXBlOiAncGFyZW4nLCBleHRnbG9iOiB0cnVlLCB2YWx1ZSwgb3V0cHV0IH0pO1xuICAgIGRlY3JlbWVudCgncGFyZW5zJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZhc3QgcGF0aHNcbiAgICovXG5cbiAgaWYgKG9wdHMuZmFzdHBhdGhzICE9PSBmYWxzZSAmJiAhLyheWyohXXxbLygpW1xcXXt9XCJdKS8udGVzdChpbnB1dCkpIHtcbiAgICBsZXQgYmFja3NsYXNoZXMgPSBmYWxzZTtcblxuICAgIGxldCBvdXRwdXQgPSBpbnB1dC5yZXBsYWNlKFJFR0VYX1NQRUNJQUxfQ0hBUlNfQkFDS1JFRiwgKG0sIGVzYywgY2hhcnMsIGZpcnN0LCByZXN0LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGZpcnN0ID09PSAnXFxcXCcpIHtcbiAgICAgICAgYmFja3NsYXNoZXMgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0ID09PSAnPycpIHtcbiAgICAgICAgaWYgKGVzYykge1xuICAgICAgICAgIHJldHVybiBlc2MgKyBmaXJzdCArIChyZXN0ID8gUU1BUksucmVwZWF0KHJlc3QubGVuZ3RoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gcW1hcmtOb0RvdCArIChyZXN0ID8gUU1BUksucmVwZWF0KHJlc3QubGVuZ3RoKSA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUU1BUksucmVwZWF0KGNoYXJzLmxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmaXJzdCA9PT0gJy4nKSB7XG4gICAgICAgIHJldHVybiBET1RfTElURVJBTC5yZXBlYXQoY2hhcnMubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcnN0ID09PSAnKicpIHtcbiAgICAgICAgaWYgKGVzYykge1xuICAgICAgICAgIHJldHVybiBlc2MgKyBmaXJzdCArIChyZXN0ID8gc3RhciA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlc2MgPyBtIDogYFxcXFwke219YDtcbiAgICB9KTtcblxuICAgIGlmIChiYWNrc2xhc2hlcyA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1xcXFwrL2csIG0gPT4ge1xuICAgICAgICAgIHJldHVybiBtLmxlbmd0aCAlIDIgPT09IDAgPyAnXFxcXFxcXFwnIDogKG0gPyAnXFxcXCcgOiAnJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvdXRwdXQgPT09IGlucHV0ICYmIG9wdHMuY29udGFpbnMgPT09IHRydWUpIHtcbiAgICAgIHN0YXRlLm91dHB1dCA9IGlucHV0O1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHN0YXRlLm91dHB1dCA9IHV0aWxzLndyYXBPdXRwdXQob3V0cHV0LCBzdGF0ZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRva2VuaXplIGlucHV0IHVudGlsIHdlIHJlYWNoIGVuZC1vZi1zdHJpbmdcbiAgICovXG5cbiAgd2hpbGUgKCFlb3MoKSkge1xuICAgIHZhbHVlID0gYWR2YW5jZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSAnXFx1MDAwMCcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVzY2FwZWQgY2hhcmFjdGVyc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnXFxcXCcpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBwZWVrKCk7XG5cbiAgICAgIGlmIChuZXh0ID09PSAnLycgJiYgb3B0cy5iYXNoICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmV4dCA9PT0gJy4nIHx8IG5leHQgPT09ICc7Jykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFuZXh0KSB7XG4gICAgICAgIHZhbHVlICs9ICdcXFxcJztcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBjb2xsYXBzZSBzbGFzaGVzIHRvIHJlZHVjZSBwb3RlbnRpYWwgZm9yIGV4cGxvaXRzXG4gICAgICBjb25zdCBtYXRjaCA9IC9eXFxcXCsvLmV4ZWMocmVtYWluaW5nKCkpO1xuICAgICAgbGV0IHNsYXNoZXMgPSAwO1xuXG4gICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMF0ubGVuZ3RoID4gMikge1xuICAgICAgICBzbGFzaGVzID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICBzdGF0ZS5pbmRleCArPSBzbGFzaGVzO1xuICAgICAgICBpZiAoc2xhc2hlcyAlIDIgIT09IDApIHtcbiAgICAgICAgICB2YWx1ZSArPSAnXFxcXCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdHMudW5lc2NhcGUgPT09IHRydWUpIHtcbiAgICAgICAgdmFsdWUgPSBhZHZhbmNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSArPSBhZHZhbmNlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZS5icmFja2V0cyA9PT0gMCkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgd2UncmUgaW5zaWRlIGEgcmVnZXggY2hhcmFjdGVyIGNsYXNzLCBjb250aW51ZVxuICAgICAqIHVudGlsIHdlIHJlYWNoIHRoZSBjbG9zaW5nIGJyYWNrZXQuXG4gICAgICovXG5cbiAgICBpZiAoc3RhdGUuYnJhY2tldHMgPiAwICYmICh2YWx1ZSAhPT0gJ10nIHx8IHByZXYudmFsdWUgPT09ICdbJyB8fCBwcmV2LnZhbHVlID09PSAnW14nKSkge1xuICAgICAgaWYgKG9wdHMucG9zaXggIT09IGZhbHNlICYmIHZhbHVlID09PSAnOicpIHtcbiAgICAgICAgY29uc3QgaW5uZXIgPSBwcmV2LnZhbHVlLnNsaWNlKDEpO1xuICAgICAgICBpZiAoaW5uZXIuaW5jbHVkZXMoJ1snKSkge1xuICAgICAgICAgIHByZXYucG9zaXggPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKGlubmVyLmluY2x1ZGVzKCc6JykpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHByZXYudmFsdWUubGFzdEluZGV4T2YoJ1snKTtcbiAgICAgICAgICAgIGNvbnN0IHByZSA9IHByZXYudmFsdWUuc2xpY2UoMCwgaWR4KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3QgPSBwcmV2LnZhbHVlLnNsaWNlKGlkeCArIDIpO1xuICAgICAgICAgICAgY29uc3QgcG9zaXggPSBQT1NJWF9SRUdFWF9TT1VSQ0VbcmVzdF07XG4gICAgICAgICAgICBpZiAocG9zaXgpIHtcbiAgICAgICAgICAgICAgcHJldi52YWx1ZSA9IHByZSArIHBvc2l4O1xuICAgICAgICAgICAgICBzdGF0ZS5iYWNrdHJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICBhZHZhbmNlKCk7XG5cbiAgICAgICAgICAgICAgaWYgKCFib3Mub3V0cHV0ICYmIHRva2Vucy5pbmRleE9mKHByZXYpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgYm9zLm91dHB1dCA9IE9ORV9DSEFSO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoKHZhbHVlID09PSAnWycgJiYgcGVlaygpICE9PSAnOicpIHx8ICh2YWx1ZSA9PT0gJy0nICYmIHBlZWsoKSA9PT0gJ10nKSkge1xuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09ICddJyAmJiAocHJldi52YWx1ZSA9PT0gJ1snIHx8IHByZXYudmFsdWUgPT09ICdbXicpKSB7XG4gICAgICAgIHZhbHVlID0gYFxcXFwke3ZhbHVlfWA7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLnBvc2l4ID09PSB0cnVlICYmIHZhbHVlID09PSAnIScgJiYgcHJldi52YWx1ZSA9PT0gJ1snKSB7XG4gICAgICAgIHZhbHVlID0gJ14nO1xuICAgICAgfVxuXG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgYXBwZW5kKHsgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB3ZSdyZSBpbnNpZGUgYSBxdW90ZWQgc3RyaW5nLCBjb250aW51ZVxuICAgICAqIHVudGlsIHdlIHJlYWNoIHRoZSBjbG9zaW5nIGRvdWJsZSBxdW90ZS5cbiAgICAgKi9cblxuICAgIGlmIChzdGF0ZS5xdW90ZXMgPT09IDEgJiYgdmFsdWUgIT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdXRpbHMuZXNjYXBlUmVnZXgodmFsdWUpO1xuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgIGFwcGVuZCh7IHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG91YmxlIHF1b3Rlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnXCInKSB7XG4gICAgICBzdGF0ZS5xdW90ZXMgPSBzdGF0ZS5xdW90ZXMgPT09IDEgPyAwIDogMTtcbiAgICAgIGlmIChvcHRzLmtlZXBRdW90ZXMgPT09IHRydWUpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJlbnRoZXNlc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnKCcpIHtcbiAgICAgIGluY3JlbWVudCgncGFyZW5zJyk7XG4gICAgICBwdXNoKHsgdHlwZTogJ3BhcmVuJywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICcpJykge1xuICAgICAgaWYgKHN0YXRlLnBhcmVucyA9PT0gMCAmJiBvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzeW50YXhFcnJvcignb3BlbmluZycsICcoJykpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHRnbG9iID0gZXh0Z2xvYnNbZXh0Z2xvYnMubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoZXh0Z2xvYiAmJiBzdGF0ZS5wYXJlbnMgPT09IGV4dGdsb2IucGFyZW5zICsgMSkge1xuICAgICAgICBleHRnbG9iQ2xvc2UoZXh0Z2xvYnMucG9wKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdwYXJlbicsIHZhbHVlLCBvdXRwdXQ6IHN0YXRlLnBhcmVucyA/ICcpJyA6ICdcXFxcKScgfSk7XG4gICAgICBkZWNyZW1lbnQoJ3BhcmVucycpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3F1YXJlIGJyYWNrZXRzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICdbJykge1xuICAgICAgaWYgKG9wdHMubm9icmFja2V0ID09PSB0cnVlIHx8ICFyZW1haW5pbmcoKS5pbmNsdWRlcygnXScpKSB7XG4gICAgICAgIGlmIChvcHRzLm5vYnJhY2tldCAhPT0gdHJ1ZSAmJiBvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJ10nKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5jcmVtZW50KCdicmFja2V0cycpO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2JyYWNrZXQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gJ10nKSB7XG4gICAgICBpZiAob3B0cy5ub2JyYWNrZXQgPT09IHRydWUgfHwgKHByZXYgJiYgcHJldi50eXBlID09PSAnYnJhY2tldCcgJiYgcHJldi52YWx1ZS5sZW5ndGggPT09IDEpKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlLCBvdXRwdXQ6IGBcXFxcJHt2YWx1ZX1gIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLmJyYWNrZXRzID09PSAwKSB7XG4gICAgICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdvcGVuaW5nJywgJ1snKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiBgXFxcXCR7dmFsdWV9YCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGRlY3JlbWVudCgnYnJhY2tldHMnKTtcblxuICAgICAgY29uc3QgcHJldlZhbHVlID0gcHJldi52YWx1ZS5zbGljZSgxKTtcbiAgICAgIGlmIChwcmV2LnBvc2l4ICE9PSB0cnVlICYmIHByZXZWYWx1ZVswXSA9PT0gJ14nICYmICFwcmV2VmFsdWUuaW5jbHVkZXMoJy8nKSkge1xuICAgICAgICB2YWx1ZSA9IGAvJHt2YWx1ZX1gO1xuICAgICAgfVxuXG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgYXBwZW5kKHsgdmFsdWUgfSk7XG5cbiAgICAgIC8vIHdoZW4gbGl0ZXJhbCBicmFja2V0cyBhcmUgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgICAgLy8gYXNzdW1lIHdlIHNob3VsZCBtYXRjaCB3aXRoIGEgcmVnZXggY2hhcmFjdGVyIGNsYXNzXG4gICAgICBpZiAob3B0cy5saXRlcmFsQnJhY2tldHMgPT09IGZhbHNlIHx8IHV0aWxzLmhhc1JlZ2V4Q2hhcnMocHJldlZhbHVlKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXNjYXBlZCA9IHV0aWxzLmVzY2FwZVJlZ2V4KHByZXYudmFsdWUpO1xuICAgICAgc3RhdGUub3V0cHV0ID0gc3RhdGUub3V0cHV0LnNsaWNlKDAsIC1wcmV2LnZhbHVlLmxlbmd0aCk7XG5cbiAgICAgIC8vIHdoZW4gbGl0ZXJhbCBicmFja2V0cyBhcmUgZXhwbGljaXRseSBlbmFibGVkXG4gICAgICAvLyBhc3N1bWUgd2Ugc2hvdWxkIGVzY2FwZSB0aGUgYnJhY2tldHMgdG8gbWF0Y2ggbGl0ZXJhbCBjaGFyYWN0ZXJzXG4gICAgICBpZiAob3B0cy5saXRlcmFsQnJhY2tldHMgPT09IHRydWUpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IGVzY2FwZWQ7XG4gICAgICAgIHByZXYudmFsdWUgPSBlc2NhcGVkO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gd2hlbiB0aGUgdXNlciBzcGVjaWZpZXMgbm90aGluZywgdHJ5IHRvIG1hdGNoIGJvdGhcbiAgICAgIHByZXYudmFsdWUgPSBgKCR7Y2FwdHVyZX0ke2VzY2FwZWR9fCR7cHJldi52YWx1ZX0pYDtcbiAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2LnZhbHVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnJhY2VzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICd7JyAmJiBvcHRzLm5vYnJhY2UgIT09IHRydWUpIHtcbiAgICAgIGluY3JlbWVudCgnYnJhY2VzJyk7XG5cbiAgICAgIGNvbnN0IG9wZW4gPSB7XG4gICAgICAgIHR5cGU6ICdicmFjZScsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBvdXRwdXQ6ICcoJyxcbiAgICAgICAgb3V0cHV0SW5kZXg6IHN0YXRlLm91dHB1dC5sZW5ndGgsXG4gICAgICAgIHRva2Vuc0luZGV4OiBzdGF0ZS50b2tlbnMubGVuZ3RoXG4gICAgICB9O1xuXG4gICAgICBicmFjZXMucHVzaChvcGVuKTtcbiAgICAgIHB1c2gob3Blbik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICd9Jykge1xuICAgICAgY29uc3QgYnJhY2UgPSBicmFjZXNbYnJhY2VzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAob3B0cy5ub2JyYWNlID09PSB0cnVlIHx8ICFicmFjZSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSwgb3V0cHV0OiB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRwdXQgPSAnKSc7XG5cbiAgICAgIGlmIChicmFjZS5kb3RzID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IHRva2Vucy5zbGljZSgpO1xuICAgICAgICBjb25zdCByYW5nZSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB0b2tlbnMucG9wKCk7XG4gICAgICAgICAgaWYgKGFycltpXS50eXBlID09PSAnYnJhY2UnKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFycltpXS50eXBlICE9PSAnZG90cycpIHtcbiAgICAgICAgICAgIHJhbmdlLnVuc2hpZnQoYXJyW2ldLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBleHBhbmRSYW5nZShyYW5nZSwgb3B0cyk7XG4gICAgICAgIHN0YXRlLmJhY2t0cmFjayA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChicmFjZS5jb21tYSAhPT0gdHJ1ZSAmJiBicmFjZS5kb3RzICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IG91dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCBicmFjZS5vdXRwdXRJbmRleCk7XG4gICAgICAgIGNvbnN0IHRva3MgPSBzdGF0ZS50b2tlbnMuc2xpY2UoYnJhY2UudG9rZW5zSW5kZXgpO1xuICAgICAgICBicmFjZS52YWx1ZSA9IGJyYWNlLm91dHB1dCA9ICdcXFxceyc7XG4gICAgICAgIHZhbHVlID0gb3V0cHV0ID0gJ1xcXFx9JztcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gb3V0O1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdG9rcykge1xuICAgICAgICAgIHN0YXRlLm91dHB1dCArPSAodC5vdXRwdXQgfHwgdC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdicmFjZScsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgICBkZWNyZW1lbnQoJ2JyYWNlcycpO1xuICAgICAgYnJhY2VzLnBvcCgpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlwZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ3wnKSB7XG4gICAgICBpZiAoZXh0Z2xvYnMubGVuZ3RoID4gMCkge1xuICAgICAgICBleHRnbG9ic1tleHRnbG9icy5sZW5ndGggLSAxXS5jb25kaXRpb25zKys7XG4gICAgICB9XG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbW1hc1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnLCcpIHtcbiAgICAgIGxldCBvdXRwdXQgPSB2YWx1ZTtcblxuICAgICAgY29uc3QgYnJhY2UgPSBicmFjZXNbYnJhY2VzLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGJyYWNlICYmIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdID09PSAnYnJhY2VzJykge1xuICAgICAgICBicmFjZS5jb21tYSA9IHRydWU7XG4gICAgICAgIG91dHB1dCA9ICd8JztcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdjb21tYScsIHZhbHVlLCBvdXRwdXQgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbGFzaGVzXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09ICcvJykge1xuICAgICAgLy8gaWYgdGhlIGJlZ2lubmluZyBvZiB0aGUgZ2xvYiBpcyBcIi4vXCIsIGFkdmFuY2UgdGhlIHN0YXJ0XG4gICAgICAvLyB0byB0aGUgY3VycmVudCBpbmRleCwgYW5kIGRvbid0IGFkZCB0aGUgXCIuL1wiIGNoYXJhY3RlcnNcbiAgICAgIC8vIHRvIHRoZSBzdGF0ZS4gVGhpcyBncmVhdGx5IHNpbXBsaWZpZXMgbG9va2JlaGluZHMgd2hlblxuICAgICAgLy8gY2hlY2tpbmcgZm9yIEJPUyBjaGFyYWN0ZXJzIGxpa2UgXCIhXCIgYW5kIFwiLlwiIChub3QgXCIuL1wiKVxuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ2RvdCcgJiYgc3RhdGUuaW5kZXggPT09IHN0YXRlLnN0YXJ0ICsgMSkge1xuICAgICAgICBzdGF0ZS5zdGFydCA9IHN0YXRlLmluZGV4ICsgMTtcbiAgICAgICAgc3RhdGUuY29uc3VtZWQgPSAnJztcbiAgICAgICAgc3RhdGUub3V0cHV0ID0gJyc7XG4gICAgICAgIHRva2Vucy5wb3AoKTtcbiAgICAgICAgcHJldiA9IGJvczsgLy8gcmVzZXQgXCJwcmV2XCIgdG8gdGhlIGZpcnN0IHRva2VuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3NsYXNoJywgdmFsdWUsIG91dHB1dDogU0xBU0hfTElURVJBTCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvdHNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJy4nKSB7XG4gICAgICBpZiAoc3RhdGUuYnJhY2VzID4gMCAmJiBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICAgIGlmIChwcmV2LnZhbHVlID09PSAnLicpIHByZXYub3V0cHV0ID0gRE9UX0xJVEVSQUw7XG4gICAgICAgIGNvbnN0IGJyYWNlID0gYnJhY2VzW2JyYWNlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgcHJldi50eXBlID0gJ2RvdHMnO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSB2YWx1ZTtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgYnJhY2UuZG90cyA9IHRydWU7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHN0YXRlLmJyYWNlcyArIHN0YXRlLnBhcmVucykgPT09IDAgJiYgcHJldi50eXBlICE9PSAnYm9zJyAmJiBwcmV2LnR5cGUgIT09ICdzbGFzaCcpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dDogRE9UX0xJVEVSQUwgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ2RvdCcsIHZhbHVlLCBvdXRwdXQ6IERPVF9MSVRFUkFMIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVlc3Rpb24gbWFya3NcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJz8nKSB7XG4gICAgICBjb25zdCBpc0dyb3VwID0gcHJldiAmJiBwcmV2LnZhbHVlID09PSAnKCc7XG4gICAgICBpZiAoIWlzR3JvdXAgJiYgb3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcgJiYgcGVlaygyKSAhPT0gJz8nKSB7XG4gICAgICAgIGV4dGdsb2JPcGVuKCdxbWFyaycsIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2ICYmIHByZXYudHlwZSA9PT0gJ3BhcmVuJykge1xuICAgICAgICBjb25zdCBuZXh0ID0gcGVlaygpO1xuICAgICAgICBsZXQgb3V0cHV0ID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKG5leHQgPT09ICc8JyAmJiAhdXRpbHMuc3VwcG9ydHNMb29rYmVoaW5kcygpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmpzIHYxMCBvciBoaWdoZXIgaXMgcmVxdWlyZWQgZm9yIHJlZ2V4IGxvb2tiZWhpbmRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHByZXYudmFsdWUgPT09ICcoJyAmJiAhL1shPTw6XS8udGVzdChuZXh0KSkgfHwgKG5leHQgPT09ICc8JyAmJiAhLzwoWyE9XXxcXHcrPikvLnRlc3QocmVtYWluaW5nKCkpKSkge1xuICAgICAgICAgIG91dHB1dCA9IGBcXFxcJHt2YWx1ZX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUsIG91dHB1dCB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRzLmRvdCAhPT0gdHJ1ZSAmJiAocHJldi50eXBlID09PSAnc2xhc2gnIHx8IHByZXYudHlwZSA9PT0gJ2JvcycpKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAncW1hcmsnLCB2YWx1ZSwgb3V0cHV0OiBRTUFSS19OT19ET1QgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3FtYXJrJywgdmFsdWUsIG91dHB1dDogUU1BUksgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGNsYW1hdGlvblxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnIScpIHtcbiAgICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJykge1xuICAgICAgICBpZiAocGVlaygyKSAhPT0gJz8nIHx8ICEvWyE9PDpdLy50ZXN0KHBlZWsoMykpKSB7XG4gICAgICAgICAgZXh0Z2xvYk9wZW4oJ25lZ2F0ZScsIHZhbHVlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5ub25lZ2F0ZSAhPT0gdHJ1ZSAmJiBzdGF0ZS5pbmRleCA9PT0gMCkge1xuICAgICAgICBuZWdhdGUoKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGx1c1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSAnKycpIHtcbiAgICAgIGlmIChvcHRzLm5vZXh0Z2xvYiAhPT0gdHJ1ZSAmJiBwZWVrKCkgPT09ICcoJyAmJiBwZWVrKDIpICE9PSAnPycpIHtcbiAgICAgICAgZXh0Z2xvYk9wZW4oJ3BsdXMnLCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHByZXYgJiYgcHJldi52YWx1ZSA9PT0gJygnKSB8fCBvcHRzLnJlZ2V4ID09PSBmYWxzZSkge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3BsdXMnLCB2YWx1ZSwgb3V0cHV0OiBQTFVTX0xJVEVSQUwgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKHByZXYgJiYgKHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnIHx8IHByZXYudHlwZSA9PT0gJ3BhcmVuJyB8fCBwcmV2LnR5cGUgPT09ICdicmFjZScpKSB8fCBzdGF0ZS5wYXJlbnMgPiAwKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAncGx1cycsIHZhbHVlIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdwbHVzJywgdmFsdWU6IFBMVVNfTElURVJBTCB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYWluIHRleHRcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gJ0AnKSB7XG4gICAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgcGVlaygpID09PSAnKCcgJiYgcGVlaygyKSAhPT0gJz8nKSB7XG4gICAgICAgIHB1c2goeyB0eXBlOiAnYXQnLCBleHRnbG9iOiB0cnVlLCB2YWx1ZSwgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxhaW4gdGV4dFxuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlICE9PSAnKicpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gJyQnIHx8IHZhbHVlID09PSAnXicpIHtcbiAgICAgICAgdmFsdWUgPSBgXFxcXCR7dmFsdWV9YDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2ggPSBSRUdFWF9OT05fU1BFQ0lBTF9DSEFSUy5leGVjKHJlbWFpbmluZygpKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICB2YWx1ZSArPSBtYXRjaFswXTtcbiAgICAgICAgc3RhdGUuaW5kZXggKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJzXG4gICAgICovXG5cbiAgICBpZiAocHJldiAmJiAocHJldi50eXBlID09PSAnZ2xvYnN0YXInIHx8IHByZXYuc3RhciA9PT0gdHJ1ZSkpIHtcbiAgICAgIHByZXYudHlwZSA9ICdzdGFyJztcbiAgICAgIHByZXYuc3RhciA9IHRydWU7XG4gICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgcHJldi5vdXRwdXQgPSBzdGFyO1xuICAgICAgc3RhdGUuYmFja3RyYWNrID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IHJlc3QgPSByZW1haW5pbmcoKTtcbiAgICBpZiAob3B0cy5ub2V4dGdsb2IgIT09IHRydWUgJiYgL15cXChbXj9dLy50ZXN0KHJlc3QpKSB7XG4gICAgICBleHRnbG9iT3Blbignc3RhcicsIHZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwcmV2LnR5cGUgPT09ICdzdGFyJykge1xuICAgICAgaWYgKG9wdHMubm9nbG9ic3RhciA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByaW9yID0gcHJldi5wcmV2O1xuICAgICAgY29uc3QgYmVmb3JlID0gcHJpb3IucHJldjtcbiAgICAgIGNvbnN0IGlzU3RhcnQgPSBwcmlvci50eXBlID09PSAnc2xhc2gnIHx8IHByaW9yLnR5cGUgPT09ICdib3MnO1xuICAgICAgY29uc3QgYWZ0ZXJTdGFyID0gYmVmb3JlICYmIChiZWZvcmUudHlwZSA9PT0gJ3N0YXInIHx8IGJlZm9yZS50eXBlID09PSAnZ2xvYnN0YXInKTtcblxuICAgICAgaWYgKG9wdHMuYmFzaCA9PT0gdHJ1ZSAmJiAoIWlzU3RhcnQgfHwgKHJlc3RbMF0gJiYgcmVzdFswXSAhPT0gJy8nKSkpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzdGFyJywgdmFsdWUsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0JyYWNlID0gc3RhdGUuYnJhY2VzID4gMCAmJiAocHJpb3IudHlwZSA9PT0gJ2NvbW1hJyB8fCBwcmlvci50eXBlID09PSAnYnJhY2UnKTtcbiAgICAgIGNvbnN0IGlzRXh0Z2xvYiA9IGV4dGdsb2JzLmxlbmd0aCAmJiAocHJpb3IudHlwZSA9PT0gJ3BpcGUnIHx8IHByaW9yLnR5cGUgPT09ICdwYXJlbicpO1xuICAgICAgaWYgKCFpc1N0YXJ0ICYmIHByaW9yLnR5cGUgIT09ICdwYXJlbicgJiYgIWlzQnJhY2UgJiYgIWlzRXh0Z2xvYikge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3N0YXInLCB2YWx1ZSwgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIHN0cmlwIGNvbnNlY3V0aXZlIGAvKiovYFxuICAgICAgd2hpbGUgKHJlc3Quc2xpY2UoMCwgMykgPT09ICcvKionKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyID0gaW5wdXRbc3RhdGUuaW5kZXggKyA0XTtcbiAgICAgICAgaWYgKGFmdGVyICYmIGFmdGVyICE9PSAnLycpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN0ID0gcmVzdC5zbGljZSgzKTtcbiAgICAgICAgY29uc3VtZSgnLyoqJywgMyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnYm9zJyAmJiBlb3MoKSkge1xuICAgICAgICBwcmV2LnR5cGUgPSAnZ2xvYnN0YXInO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBwcmV2Lm91dHB1dCA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBwcmV2Lm91dHB1dDtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnc2xhc2gnICYmIHByaW9yLnByZXYudHlwZSAhPT0gJ2JvcycgJiYgIWFmdGVyU3RhciAmJiBlb3MoKSkge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLShwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dCkubGVuZ3RoKTtcbiAgICAgICAgcHJpb3Iub3V0cHV0ID0gYCg/OiR7cHJpb3Iub3V0cHV0fWA7XG5cbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi5vdXRwdXQgPSBnbG9ic3RhcihvcHRzKSArIChvcHRzLnN0cmljdFNsYXNoZXMgPyAnKScgOiAnfCQpJyk7XG4gICAgICAgIHByZXYudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHByaW9yLm91dHB1dCArIHByZXYub3V0cHV0O1xuICAgICAgICBjb25zdW1lKHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnc2xhc2gnICYmIHByaW9yLnByZXYudHlwZSAhPT0gJ2JvcycgJiYgcmVzdFswXSA9PT0gJy8nKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IHJlc3RbMV0gIT09IHZvaWQgMCA/ICd8JCcgOiAnJztcblxuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBzdGF0ZS5vdXRwdXQuc2xpY2UoMCwgLShwcmlvci5vdXRwdXQgKyBwcmV2Lm91dHB1dCkubGVuZ3RoKTtcbiAgICAgICAgcHJpb3Iub3V0cHV0ID0gYCg/OiR7cHJpb3Iub3V0cHV0fWA7XG5cbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi5vdXRwdXQgPSBgJHtnbG9ic3RhcihvcHRzKX0ke1NMQVNIX0xJVEVSQUx9fCR7U0xBU0hfTElURVJBTH0ke2VuZH0pYDtcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcblxuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gcHJpb3Iub3V0cHV0ICsgcHJldi5vdXRwdXQ7XG4gICAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcblxuICAgICAgICBjb25zdW1lKHZhbHVlICsgYWR2YW5jZSgpKTtcblxuICAgICAgICBwdXNoKHsgdHlwZTogJ3NsYXNoJywgdmFsdWU6ICcvJywgb3V0cHV0OiAnJyB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmlvci50eXBlID09PSAnYm9zJyAmJiByZXN0WzBdID09PSAnLycpIHtcbiAgICAgICAgcHJldi50eXBlID0gJ2dsb2JzdGFyJztcbiAgICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgcHJldi5vdXRwdXQgPSBgKD86Xnwke1NMQVNIX0xJVEVSQUx9fCR7Z2xvYnN0YXIob3B0cyl9JHtTTEFTSF9MSVRFUkFMfSlgO1xuICAgICAgICBzdGF0ZS5vdXRwdXQgPSBwcmV2Lm91dHB1dDtcbiAgICAgICAgc3RhdGUuZ2xvYnN0YXIgPSB0cnVlO1xuICAgICAgICBjb25zdW1lKHZhbHVlICsgYWR2YW5jZSgpKTtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICdzbGFzaCcsIHZhbHVlOiAnLycsIG91dHB1dDogJycgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgc2luZ2xlIHN0YXIgZnJvbSBvdXRwdXRcbiAgICAgIHN0YXRlLm91dHB1dCA9IHN0YXRlLm91dHB1dC5zbGljZSgwLCAtcHJldi5vdXRwdXQubGVuZ3RoKTtcblxuICAgICAgLy8gcmVzZXQgcHJldmlvdXMgdG9rZW4gdG8gZ2xvYnN0YXJcbiAgICAgIHByZXYudHlwZSA9ICdnbG9ic3Rhcic7XG4gICAgICBwcmV2Lm91dHB1dCA9IGdsb2JzdGFyKG9wdHMpO1xuICAgICAgcHJldi52YWx1ZSArPSB2YWx1ZTtcblxuICAgICAgLy8gcmVzZXQgb3V0cHV0IHdpdGggZ2xvYnN0YXJcbiAgICAgIHN0YXRlLm91dHB1dCArPSBwcmV2Lm91dHB1dDtcbiAgICAgIHN0YXRlLmdsb2JzdGFyID0gdHJ1ZTtcbiAgICAgIGNvbnN1bWUodmFsdWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSB7IHR5cGU6ICdzdGFyJywgdmFsdWUsIG91dHB1dDogc3RhciB9O1xuXG4gICAgaWYgKG9wdHMuYmFzaCA9PT0gdHJ1ZSkge1xuICAgICAgdG9rZW4ub3V0cHV0ID0gJy4qPyc7XG4gICAgICBpZiAocHJldi50eXBlID09PSAnYm9zJyB8fCBwcmV2LnR5cGUgPT09ICdzbGFzaCcpIHtcbiAgICAgICAgdG9rZW4ub3V0cHV0ID0gbm9kb3QgKyB0b2tlbi5vdXRwdXQ7XG4gICAgICB9XG4gICAgICBwdXNoKHRva2VuKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwcmV2ICYmIChwcmV2LnR5cGUgPT09ICdicmFja2V0JyB8fCBwcmV2LnR5cGUgPT09ICdwYXJlbicpICYmIG9wdHMucmVnZXggPT09IHRydWUpIHtcbiAgICAgIHRva2VuLm91dHB1dCA9IHZhbHVlO1xuICAgICAgcHVzaCh0b2tlbik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuaW5kZXggPT09IHN0YXRlLnN0YXJ0IHx8IHByZXYudHlwZSA9PT0gJ3NsYXNoJyB8fCBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICBpZiAocHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gTk9fRE9UX1NMQVNIO1xuICAgICAgICBwcmV2Lm91dHB1dCArPSBOT19ET1RfU0xBU0g7XG5cbiAgICAgIH0gZWxzZSBpZiAob3B0cy5kb3QgPT09IHRydWUpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IE5PX0RPVFNfU0xBU0g7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IE5PX0RPVFNfU0xBU0g7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLm91dHB1dCArPSBub2RvdDtcbiAgICAgICAgcHJldi5vdXRwdXQgKz0gbm9kb3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZWVrKCkgIT09ICcqJykge1xuICAgICAgICBzdGF0ZS5vdXRwdXQgKz0gT05FX0NIQVI7XG4gICAgICAgIHByZXYub3V0cHV0ICs9IE9ORV9DSEFSO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1c2godG9rZW4pO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLmJyYWNrZXRzID4gMCkge1xuICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnXScpKTtcbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy5lc2NhcGVMYXN0KHN0YXRlLm91dHB1dCwgJ1snKTtcbiAgICBkZWNyZW1lbnQoJ2JyYWNrZXRzJyk7XG4gIH1cblxuICB3aGlsZSAoc3RhdGUucGFyZW5zID4gMCkge1xuICAgIGlmIChvcHRzLnN0cmljdEJyYWNrZXRzID09PSB0cnVlKSB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc3ludGF4RXJyb3IoJ2Nsb3NpbmcnLCAnKScpKTtcbiAgICBzdGF0ZS5vdXRwdXQgPSB1dGlscy5lc2NhcGVMYXN0KHN0YXRlLm91dHB1dCwgJygnKTtcbiAgICBkZWNyZW1lbnQoJ3BhcmVucycpO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLmJyYWNlcyA+IDApIHtcbiAgICBpZiAob3B0cy5zdHJpY3RCcmFja2V0cyA9PT0gdHJ1ZSkgdGhyb3cgbmV3IFN5bnRheEVycm9yKHN5bnRheEVycm9yKCdjbG9zaW5nJywgJ30nKSk7XG4gICAgc3RhdGUub3V0cHV0ID0gdXRpbHMuZXNjYXBlTGFzdChzdGF0ZS5vdXRwdXQsICd7Jyk7XG4gICAgZGVjcmVtZW50KCdicmFjZXMnKTtcbiAgfVxuXG4gIGlmIChvcHRzLnN0cmljdFNsYXNoZXMgIT09IHRydWUgJiYgKHByZXYudHlwZSA9PT0gJ3N0YXInIHx8IHByZXYudHlwZSA9PT0gJ2JyYWNrZXQnKSkge1xuICAgIHB1c2goeyB0eXBlOiAnbWF5YmVfc2xhc2gnLCB2YWx1ZTogJycsIG91dHB1dDogYCR7U0xBU0hfTElURVJBTH0/YCB9KTtcbiAgfVxuXG4gIC8vIHJlYnVpbGQgdGhlIG91dHB1dCBpZiB3ZSBoYWQgdG8gYmFja3RyYWNrIGF0IGFueSBwb2ludFxuICBpZiAoc3RhdGUuYmFja3RyYWNrID09PSB0cnVlKSB7XG4gICAgc3RhdGUub3V0cHV0ID0gJyc7XG5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHN0YXRlLnRva2Vucykge1xuICAgICAgc3RhdGUub3V0cHV0ICs9IHRva2VuLm91dHB1dCAhPSBudWxsID8gdG9rZW4ub3V0cHV0IDogdG9rZW4udmFsdWU7XG5cbiAgICAgIGlmICh0b2tlbi5zdWZmaXgpIHtcbiAgICAgICAgc3RhdGUub3V0cHV0ICs9IHRva2VuLnN1ZmZpeDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59O1xuXG4vKipcbiAqIEZhc3QgcGF0aHMgZm9yIGNyZWF0aW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIGNvbW1vbiBnbG9iIHBhdHRlcm5zLlxuICogVGhpcyBjYW4gc2lnbmlmaWNhbnRseSBzcGVlZCB1cCBwcm9jZXNzaW5nIGFuZCBoYXMgdmVyeSBsaXR0bGUgZG93bnNpZGVcbiAqIGltcGFjdCB3aGVuIG5vbmUgb2YgdGhlIGZhc3QgcGF0aHMgbWF0Y2guXG4gKi9cblxucGFyc2UuZmFzdHBhdGhzID0gKGlucHV0LCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcbiAgY29uc3QgbWF4ID0gdHlwZW9mIG9wdHMubWF4TGVuZ3RoID09PSAnbnVtYmVyJyA/IE1hdGgubWluKE1BWF9MRU5HVEgsIG9wdHMubWF4TGVuZ3RoKSA6IE1BWF9MRU5HVEg7XG4gIGNvbnN0IGxlbiA9IGlucHV0Lmxlbmd0aDtcbiAgaWYgKGxlbiA+IG1heCkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW5wdXQgbGVuZ3RoOiAke2xlbn0sIGV4Y2VlZHMgbWF4aW11bSBhbGxvd2VkIGxlbmd0aDogJHttYXh9YCk7XG4gIH1cblxuICBpbnB1dCA9IFJFUExBQ0VNRU5UU1tpbnB1dF0gfHwgaW5wdXQ7XG4gIGNvbnN0IHdpbjMyID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuXG4gIC8vIGNyZWF0ZSBjb25zdGFudHMgYmFzZWQgb24gcGxhdGZvcm0sIGZvciB3aW5kb3dzIG9yIHBvc2l4XG4gIGNvbnN0IHtcbiAgICBET1RfTElURVJBTCxcbiAgICBTTEFTSF9MSVRFUkFMLFxuICAgIE9ORV9DSEFSLFxuICAgIERPVFNfU0xBU0gsXG4gICAgTk9fRE9ULFxuICAgIE5PX0RPVFMsXG4gICAgTk9fRE9UU19TTEFTSCxcbiAgICBTVEFSLFxuICAgIFNUQVJUX0FOQ0hPUlxuICB9ID0gY29uc3RhbnRzLmdsb2JDaGFycyh3aW4zMik7XG5cbiAgY29uc3Qgbm9kb3QgPSBvcHRzLmRvdCA/IE5PX0RPVFMgOiBOT19ET1Q7XG4gIGNvbnN0IHNsYXNoRG90ID0gb3B0cy5kb3QgPyBOT19ET1RTX1NMQVNIIDogTk9fRE9UO1xuICBjb25zdCBjYXB0dXJlID0gb3B0cy5jYXB0dXJlID8gJycgOiAnPzonO1xuICBjb25zdCBzdGF0ZSA9IHsgbmVnYXRlZDogZmFsc2UsIHByZWZpeDogJycgfTtcbiAgbGV0IHN0YXIgPSBvcHRzLmJhc2ggPT09IHRydWUgPyAnLio/JyA6IFNUQVI7XG5cbiAgaWYgKG9wdHMuY2FwdHVyZSkge1xuICAgIHN0YXIgPSBgKCR7c3Rhcn0pYDtcbiAgfVxuXG4gIGNvbnN0IGdsb2JzdGFyID0gb3B0cyA9PiB7XG4gICAgaWYgKG9wdHMubm9nbG9ic3RhciA9PT0gdHJ1ZSkgcmV0dXJuIHN0YXI7XG4gICAgcmV0dXJuIGAoJHtjYXB0dXJlfSg/Oig/ISR7U1RBUlRfQU5DSE9SfSR7b3B0cy5kb3QgPyBET1RTX1NMQVNIIDogRE9UX0xJVEVSQUx9KS4pKj8pYDtcbiAgfTtcblxuICBjb25zdCBjcmVhdGUgPSBzdHIgPT4ge1xuICAgIHN3aXRjaCAoc3RyKSB7XG4gICAgICBjYXNlICcqJzpcbiAgICAgICAgcmV0dXJuIGAke25vZG90fSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJy4qJzpcbiAgICAgICAgcmV0dXJuIGAke0RPVF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJyouKic6XG4gICAgICAgIHJldHVybiBgJHtub2RvdH0ke3N0YXJ9JHtET1RfTElURVJBTH0ke09ORV9DSEFSfSR7c3Rhcn1gO1xuXG4gICAgICBjYXNlICcqLyonOlxuICAgICAgICByZXR1cm4gYCR7bm9kb3R9JHtzdGFyfSR7U0xBU0hfTElURVJBTH0ke09ORV9DSEFSfSR7c2xhc2hEb3R9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJyoqJzpcbiAgICAgICAgcmV0dXJuIG5vZG90ICsgZ2xvYnN0YXIob3B0cyk7XG5cbiAgICAgIGNhc2UgJyoqLyonOlxuICAgICAgICByZXR1cm4gYCg/OiR7bm9kb3R9JHtnbG9ic3RhcihvcHRzKX0ke1NMQVNIX0xJVEVSQUx9KT8ke3NsYXNoRG90fSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGNhc2UgJyoqLyouKic6XG4gICAgICAgIHJldHVybiBgKD86JHtub2RvdH0ke2dsb2JzdGFyKG9wdHMpfSR7U0xBU0hfTElURVJBTH0pPyR7c2xhc2hEb3R9JHtzdGFyfSR7RE9UX0xJVEVSQUx9JHtPTkVfQ0hBUn0ke3N0YXJ9YDtcblxuICAgICAgY2FzZSAnKiovLionOlxuICAgICAgICByZXR1cm4gYCg/OiR7bm9kb3R9JHtnbG9ic3RhcihvcHRzKX0ke1NMQVNIX0xJVEVSQUx9KT8ke0RPVF9MSVRFUkFMfSR7T05FX0NIQVJ9JHtzdGFyfWA7XG5cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSAvXiguKj8pXFwuKFxcdyspJC8uZXhlYyhzdHIpO1xuICAgICAgICBpZiAoIW1hdGNoKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc291cmNlID0gY3JlYXRlKG1hdGNoWzFdKTtcbiAgICAgICAgaWYgKCFzb3VyY2UpIHJldHVybjtcblxuICAgICAgICByZXR1cm4gc291cmNlICsgRE9UX0xJVEVSQUwgKyBtYXRjaFsyXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb3V0cHV0ID0gdXRpbHMucmVtb3ZlUHJlZml4KGlucHV0LCBzdGF0ZSk7XG4gIGxldCBzb3VyY2UgPSBjcmVhdGUob3V0cHV0KTtcblxuICBpZiAoc291cmNlICYmIG9wdHMuc3RyaWN0U2xhc2hlcyAhPT0gdHJ1ZSkge1xuICAgIHNvdXJjZSArPSBgJHtTTEFTSF9MSVRFUkFMfT9gO1xuICB9XG5cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBzY2FuID0gcmVxdWlyZSgnLi9zY2FuJyk7XG5jb25zdCBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbmNvbnN0IGlzT2JqZWN0ID0gdmFsID0+IHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWwpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRjaGVyIGZ1bmN0aW9uIGZyb20gb25lIG9yIG1vcmUgZ2xvYiBwYXR0ZXJucy4gVGhlXG4gKiByZXR1cm5lZCBmdW5jdGlvbiB0YWtlcyBhIHN0cmluZyB0byBtYXRjaCBhcyBpdHMgZmlyc3QgYXJndW1lbnQsXG4gKiBhbmQgcmV0dXJucyB0cnVlIGlmIHRoZSBzdHJpbmcgaXMgYSBtYXRjaC4gVGhlIHJldHVybmVkIG1hdGNoZXJcbiAqIGZ1bmN0aW9uIGFsc28gdGFrZXMgYSBib29sZWFuIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdGhhdCwgd2hlbiB0cnVlLFxuICogcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaChnbG9iWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnN0IGlzTWF0Y2ggPSBwaWNvbWF0Y2goJyouISgqYSknKTtcbiAqIGNvbnNvbGUubG9nKGlzTWF0Y2goJ2EuYScpKTsgLy89PiBmYWxzZVxuICogY29uc29sZS5sb2coaXNNYXRjaCgnYS5iJykpOyAvLz0+IHRydWVcbiAqIGBgYFxuICogQG5hbWUgcGljb21hdGNoXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gYGdsb2JzYCBPbmUgb3IgbW9yZSBnbG9iIHBhdHRlcm5zLlxuICogQHBhcmFtIHtPYmplY3Q9fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0Z1bmN0aW9uPX0gUmV0dXJucyBhIG1hdGNoZXIgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmNvbnN0IHBpY29tYXRjaCA9IChnbG9iLCBvcHRpb25zLCByZXR1cm5TdGF0ZSA9IGZhbHNlKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KGdsb2IpKSB7XG4gICAgY29uc3QgZm5zID0gZ2xvYi5tYXAoaW5wdXQgPT4gcGljb21hdGNoKGlucHV0LCBvcHRpb25zLCByZXR1cm5TdGF0ZSkpO1xuICAgIGNvbnN0IGFycmF5TWF0Y2hlciA9IHN0ciA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGlzTWF0Y2ggb2YgZm5zKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gaXNNYXRjaChzdHIpO1xuICAgICAgICBpZiAoc3RhdGUpIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHJldHVybiBhcnJheU1hdGNoZXI7XG4gIH1cblxuICBjb25zdCBpc1N0YXRlID0gaXNPYmplY3QoZ2xvYikgJiYgZ2xvYi50b2tlbnMgJiYgZ2xvYi5pbnB1dDtcblxuICBpZiAoZ2xvYiA9PT0gJycgfHwgKHR5cGVvZiBnbG9iICE9PSAnc3RyaW5nJyAmJiAhaXNTdGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBwYXR0ZXJuIHRvIGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHBvc2l4ID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpO1xuICBjb25zdCByZWdleCA9IGlzU3RhdGVcbiAgICA/IHBpY29tYXRjaC5jb21waWxlUmUoZ2xvYiwgb3B0aW9ucylcbiAgICA6IHBpY29tYXRjaC5tYWtlUmUoZ2xvYiwgb3B0aW9ucywgZmFsc2UsIHRydWUpO1xuXG4gIGNvbnN0IHN0YXRlID0gcmVnZXguc3RhdGU7XG4gIGRlbGV0ZSByZWdleC5zdGF0ZTtcblxuICBsZXQgaXNJZ25vcmVkID0gKCkgPT4gZmFsc2U7XG4gIGlmIChvcHRzLmlnbm9yZSkge1xuICAgIGNvbnN0IGlnbm9yZU9wdHMgPSB7IC4uLm9wdGlvbnMsIGlnbm9yZTogbnVsbCwgb25NYXRjaDogbnVsbCwgb25SZXN1bHQ6IG51bGwgfTtcbiAgICBpc0lnbm9yZWQgPSBwaWNvbWF0Y2gob3B0cy5pZ25vcmUsIGlnbm9yZU9wdHMsIHJldHVyblN0YXRlKTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoZXIgPSAoaW5wdXQsIHJldHVybk9iamVjdCA9IGZhbHNlKSA9PiB7XG4gICAgY29uc3QgeyBpc01hdGNoLCBtYXRjaCwgb3V0cHV0IH0gPSBwaWNvbWF0Y2gudGVzdChpbnB1dCwgcmVnZXgsIG9wdGlvbnMsIHsgZ2xvYiwgcG9zaXggfSk7XG4gICAgY29uc3QgcmVzdWx0ID0geyBnbG9iLCBzdGF0ZSwgcmVnZXgsIHBvc2l4LCBpbnB1dCwgb3V0cHV0LCBtYXRjaCwgaXNNYXRjaCB9O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRzLm9uUmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRzLm9uUmVzdWx0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgaWYgKGlzTWF0Y2ggPT09IGZhbHNlKSB7XG4gICAgICByZXN1bHQuaXNNYXRjaCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHJldHVybk9iamVjdCA/IHJlc3VsdCA6IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc0lnbm9yZWQoaW5wdXQpKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdHMub25JZ25vcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3B0cy5vbklnbm9yZShyZXN1bHQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmlzTWF0Y2ggPSBmYWxzZTtcbiAgICAgIHJldHVybiByZXR1cm5PYmplY3QgPyByZXN1bHQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMub25NYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3B0cy5vbk1hdGNoKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXR1cm5PYmplY3QgPyByZXN1bHQgOiB0cnVlO1xuICB9O1xuXG4gIGlmIChyZXR1cm5TdGF0ZSkge1xuICAgIG1hdGNoZXIuc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcblxuLyoqXG4gKiBUZXN0IGBpbnB1dGAgd2l0aCB0aGUgZ2l2ZW4gYHJlZ2V4YC4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBtYWluXG4gKiBgcGljb21hdGNoKClgIGZ1bmN0aW9uIHRvIHRlc3QgdGhlIGlucHV0IHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2gudGVzdChpbnB1dCwgcmVnZXhbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cocGljb21hdGNoLnRlc3QoJ2Zvby9iYXInLCAvXig/OihbXi9dKj8pXFwvKFteL10qPykpJC8pKTtcbiAqIC8vIHsgaXNNYXRjaDogdHJ1ZSwgbWF0Y2g6IFsgJ2Zvby8nLCAnZm9vJywgJ2JhcicgXSwgb3V0cHV0OiAnZm9vL2JhcicgfVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gdGVzdC5cbiAqIEBwYXJhbSB7UmVnRXhwfSBgcmVnZXhgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGggbWF0Y2hpbmcgaW5mby5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucGljb21hdGNoLnRlc3QgPSAoaW5wdXQsIHJlZ2V4LCBvcHRpb25zLCB7IGdsb2IsIHBvc2l4IH0gPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGlucHV0IHRvIGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBpZiAoaW5wdXQgPT09ICcnKSB7XG4gICAgcmV0dXJuIHsgaXNNYXRjaDogZmFsc2UsIG91dHB1dDogJycgfTtcbiAgfVxuXG4gIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBmb3JtYXQgPSBvcHRzLmZvcm1hdCB8fCAocG9zaXggPyB1dGlscy50b1Bvc2l4U2xhc2hlcyA6IG51bGwpO1xuICBsZXQgbWF0Y2ggPSBpbnB1dCA9PT0gZ2xvYjtcbiAgbGV0IG91dHB1dCA9IChtYXRjaCAmJiBmb3JtYXQpID8gZm9ybWF0KGlucHV0KSA6IGlucHV0O1xuXG4gIGlmIChtYXRjaCA9PT0gZmFsc2UpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXQgPyBmb3JtYXQoaW5wdXQpIDogaW5wdXQ7XG4gICAgbWF0Y2ggPSBvdXRwdXQgPT09IGdsb2I7XG4gIH1cblxuICBpZiAobWF0Y2ggPT09IGZhbHNlIHx8IG9wdHMuY2FwdHVyZSA9PT0gdHJ1ZSkge1xuICAgIGlmIChvcHRzLm1hdGNoQmFzZSA9PT0gdHJ1ZSB8fCBvcHRzLmJhc2VuYW1lID09PSB0cnVlKSB7XG4gICAgICBtYXRjaCA9IHBpY29tYXRjaC5tYXRjaEJhc2UoaW5wdXQsIHJlZ2V4LCBvcHRpb25zLCBwb3NpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGlzTWF0Y2g6IEJvb2xlYW4obWF0Y2gpLCBtYXRjaCwgb3V0cHV0IH07XG59O1xuXG4vKipcbiAqIE1hdGNoIHRoZSBiYXNlbmFtZSBvZiBhIGZpbGVwYXRoLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC5tYXRjaEJhc2UoaW5wdXQsIGdsb2JbLCBvcHRpb25zXSk7XG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2gubWF0Y2hCYXNlKCdmb28vYmFyLmpzJywgJyouanMnKTsgLy8gdHJ1ZVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBTdHJpbmcgdG8gdGVzdC5cbiAqIEBwYXJhbSB7UmVnRXhwfFN0cmluZ30gYGdsb2JgIEdsb2IgcGF0dGVybiBvciByZWdleCBjcmVhdGVkIGJ5IFsubWFrZVJlXSgjbWFrZVJlKS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5tYXRjaEJhc2UgPSAoaW5wdXQsIGdsb2IsIG9wdGlvbnMsIHBvc2l4ID0gdXRpbHMuaXNXaW5kb3dzKG9wdGlvbnMpKSA9PiB7XG4gIGNvbnN0IHJlZ2V4ID0gZ2xvYiBpbnN0YW5jZW9mIFJlZ0V4cCA/IGdsb2IgOiBwaWNvbWF0Y2gubWFrZVJlKGdsb2IsIG9wdGlvbnMpO1xuICByZXR1cm4gcmVnZXgudGVzdChwYXRoLmJhc2VuYW1lKGlucHV0KSk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiAqKmFueSoqIG9mIHRoZSBnaXZlbiBnbG9iIGBwYXR0ZXJuc2AgbWF0Y2ggdGhlIHNwZWNpZmllZCBgc3RyaW5nYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcGljb21hdGNoID0gcmVxdWlyZSgncGljb21hdGNoJyk7XG4gKiAvLyBwaWNvbWF0Y2guaXNNYXRjaChzdHJpbmcsIHBhdHRlcm5zWywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5pc01hdGNoKCdhLmEnLCBbJ2IuKicsICcqLmEnXSkpOyAvLz0+IHRydWVcbiAqIGNvbnNvbGUubG9nKHBpY29tYXRjaC5pc01hdGNoKCdhLmEnLCAnYi4qJykpOyAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBzdHIgVGhlIHN0cmluZyB0byB0ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHBhdHRlcm5zIE9uZSBvciBtb3JlIGdsb2IgcGF0dGVybnMgdG8gdXNlIGZvciBtYXRjaGluZy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gU2VlIGF2YWlsYWJsZSBbb3B0aW9uc10oI29wdGlvbnMpLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFueSBwYXR0ZXJucyBtYXRjaCBgc3RyYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2guaXNNYXRjaCA9IChzdHIsIHBhdHRlcm5zLCBvcHRpb25zKSA9PiBwaWNvbWF0Y2gocGF0dGVybnMsIG9wdGlvbnMpKHN0cik7XG5cbi8qKlxuICogUGFyc2UgYSBnbG9iIHBhdHRlcm4gdG8gY3JlYXRlIHRoZSBzb3VyY2Ugc3RyaW5nIGZvciBhIHJlZ3VsYXJcbiAqIGV4cHJlc3Npb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogY29uc3QgcmVzdWx0ID0gcGljb21hdGNoLnBhcnNlKHBhdHRlcm5bLCBvcHRpb25zXSk7XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB1c2VmdWwgcHJvcGVydGllcyBhbmQgb3V0cHV0IHRvIGJlIHVzZWQgYXMgYSByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2gucGFyc2UgPSAocGF0dGVybiwgb3B0aW9ucykgPT4ge1xuICBpZiAoQXJyYXkuaXNBcnJheShwYXR0ZXJuKSkgcmV0dXJuIHBhdHRlcm4ubWFwKHAgPT4gcGljb21hdGNoLnBhcnNlKHAsIG9wdGlvbnMpKTtcbiAgcmV0dXJuIHBhcnNlKHBhdHRlcm4sIHsgLi4ub3B0aW9ucywgZmFzdHBhdGhzOiBmYWxzZSB9KTtcbn07XG5cbi8qKlxuICogU2NhbiBhIGdsb2IgcGF0dGVybiB0byBzZXBhcmF0ZSB0aGUgcGF0dGVybiBpbnRvIHNlZ21lbnRzLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC5zY2FuKGlucHV0Wywgb3B0aW9uc10pO1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IHBpY29tYXRjaC5zY2FuKCchLi9mb28vKi5qcycpO1xuICogY29uc29sZS5sb2cocmVzdWx0KTtcbiAqIHsgcHJlZml4OiAnIS4vJyxcbiAqICAgaW5wdXQ6ICchLi9mb28vKi5qcycsXG4gKiAgIHN0YXJ0OiAzLFxuICogICBiYXNlOiAnZm9vJyxcbiAqICAgZ2xvYjogJyouanMnLFxuICogICBpc0JyYWNlOiBmYWxzZSxcbiAqICAgaXNCcmFja2V0OiBmYWxzZSxcbiAqICAgaXNHbG9iOiB0cnVlLFxuICogICBpc0V4dGdsb2I6IGZhbHNlLFxuICogICBpc0dsb2JzdGFyOiBmYWxzZSxcbiAqICAgbmVnYXRlZDogdHJ1ZSB9XG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgaW5wdXRgIEdsb2IgcGF0dGVybiB0byBzY2FuLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRoXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5zY2FuID0gKGlucHV0LCBvcHRpb25zKSA9PiBzY2FuKGlucHV0LCBvcHRpb25zKTtcblxuLyoqXG4gKiBDb21waWxlIGEgcmVndWxhciBleHByZXNzaW9uIGZyb20gdGhlIGBzdGF0ZWAgb2JqZWN0IHJldHVybmVkIGJ5IHRoZVxuICogW3BhcnNlKCldKCNwYXJzZSkgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBgc3RhdGVgXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGByZXR1cm5PdXRwdXRgIEludGVuZGVkIGZvciBpbXBsZW1lbnRvcnMsIHRoaXMgYXJndW1lbnQgYWxsb3dzIHlvdSB0byByZXR1cm4gdGhlIHJhdyBvdXRwdXQgZnJvbSB0aGUgcGFyc2VyLlxuICogQHBhcmFtIHtCb29sZWFufSBgcmV0dXJuU3RhdGVgIEFkZHMgdGhlIHN0YXRlIHRvIGEgYHN0YXRlYCBwcm9wZXJ0eSBvbiB0aGUgcmV0dXJuZWQgcmVnZXguIFVzZWZ1bCBmb3IgaW1wbGVtZW50b3JzIGFuZCBkZWJ1Z2dpbmcuXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC5jb21waWxlUmUgPSAoc3RhdGUsIG9wdGlvbnMsIHJldHVybk91dHB1dCA9IGZhbHNlLCByZXR1cm5TdGF0ZSA9IGZhbHNlKSA9PiB7XG4gIGlmIChyZXR1cm5PdXRwdXQgPT09IHRydWUpIHtcbiAgICByZXR1cm4gc3RhdGUub3V0cHV0O1xuICB9XG5cbiAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHByZXBlbmQgPSBvcHRzLmNvbnRhaW5zID8gJycgOiAnXic7XG4gIGNvbnN0IGFwcGVuZCA9IG9wdHMuY29udGFpbnMgPyAnJyA6ICckJztcblxuICBsZXQgc291cmNlID0gYCR7cHJlcGVuZH0oPzoke3N0YXRlLm91dHB1dH0pJHthcHBlbmR9YDtcbiAgaWYgKHN0YXRlICYmIHN0YXRlLm5lZ2F0ZWQgPT09IHRydWUpIHtcbiAgICBzb3VyY2UgPSBgXig/ISR7c291cmNlfSkuKiRgO1xuICB9XG5cbiAgY29uc3QgcmVnZXggPSBwaWNvbWF0Y2gudG9SZWdleChzb3VyY2UsIG9wdGlvbnMpO1xuICBpZiAocmV0dXJuU3RhdGUgPT09IHRydWUpIHtcbiAgICByZWdleC5zdGF0ZSA9IHN0YXRlO1xuICB9XG5cbiAgcmV0dXJuIHJlZ2V4O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gZnJvbSBhIHBhcnNlZCBnbG9iIHBhdHRlcm4uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuICogY29uc3Qgc3RhdGUgPSBwaWNvbWF0Y2gucGFyc2UoJyouanMnKTtcbiAqIC8vIHBpY29tYXRjaC5jb21waWxlUmUoc3RhdGVbLCBvcHRpb25zXSk7XG4gKlxuICogY29uc29sZS5sb2cocGljb21hdGNoLmNvbXBpbGVSZShzdGF0ZSkpO1xuICogLy89PiAvXig/Oig/IVxcLikoPz0uKVteL10qP1xcLmpzKSQvXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RhdGVgIFRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSB0aGUgYC5wYXJzZWAgbWV0aG9kLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHBhcmFtIHtCb29sZWFufSBgcmV0dXJuT3V0cHV0YCBJbXBsZW1lbnRvcnMgbWF5IHVzZSB0aGlzIGFyZ3VtZW50IHRvIHJldHVybiB0aGUgY29tcGlsZWQgb3V0cHV0LCBpbnN0ZWFkIG9mIGEgcmVndWxhciBleHByZXNzaW9uLiBUaGlzIGlzIG5vdCBleHBvc2VkIG9uIHRoZSBvcHRpb25zIHRvIHByZXZlbnQgZW5kLXVzZXJzIGZyb20gbXV0YXRpbmcgdGhlIHJlc3VsdC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYHJldHVyblN0YXRlYCBJbXBsZW1lbnRvcnMgbWF5IHVzZSB0aGlzIGFyZ3VtZW50IHRvIHJldHVybiB0aGUgc3RhdGUgZnJvbSB0aGUgcGFyc2VkIGdsb2Igd2l0aCB0aGUgcmV0dXJuZWQgcmVndWxhciBleHByZXNzaW9uLlxuICogQHJldHVybiB7UmVnRXhwfSBSZXR1cm5zIGEgcmVnZXggY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBwYXR0ZXJuLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5waWNvbWF0Y2gubWFrZVJlID0gKGlucHV0LCBvcHRpb25zID0ge30sIHJldHVybk91dHB1dCA9IGZhbHNlLCByZXR1cm5TdGF0ZSA9IGZhbHNlKSA9PiB7XG4gIGlmICghaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICB9XG5cbiAgbGV0IHBhcnNlZCA9IHsgbmVnYXRlZDogZmFsc2UsIGZhc3RwYXRoczogdHJ1ZSB9O1xuXG4gIGlmIChvcHRpb25zLmZhc3RwYXRocyAhPT0gZmFsc2UgJiYgKGlucHV0WzBdID09PSAnLicgfHwgaW5wdXRbMF0gPT09ICcqJykpIHtcbiAgICBwYXJzZWQub3V0cHV0ID0gcGFyc2UuZmFzdHBhdGhzKGlucHV0LCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmICghcGFyc2VkLm91dHB1dCkge1xuICAgIHBhcnNlZCA9IHBhcnNlKGlucHV0LCBvcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiBwaWNvbWF0Y2guY29tcGlsZVJlKHBhcnNlZCwgb3B0aW9ucywgcmV0dXJuT3V0cHV0LCByZXR1cm5TdGF0ZSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmcm9tIHRoZSBnaXZlbiByZWdleCBzb3VyY2Ugc3RyaW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcbiAqIC8vIHBpY29tYXRjaC50b1JlZ2V4KHNvdXJjZVssIG9wdGlvbnNdKTtcbiAqXG4gKiBjb25zdCB7IG91dHB1dCB9ID0gcGljb21hdGNoLnBhcnNlKCcqLmpzJyk7XG4gKiBjb25zb2xlLmxvZyhwaWNvbWF0Y2gudG9SZWdleChvdXRwdXQpKTtcbiAqIC8vPT4gL14oPzooPyFcXC4pKD89LilbXi9dKj9cXC5qcykkL1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHNvdXJjZWAgUmVndWxhciBleHByZXNzaW9uIHNvdXJjZSBzdHJpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnBpY29tYXRjaC50b1JlZ2V4ID0gKHNvdXJjZSwgb3B0aW9ucykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHNvdXJjZSwgb3B0cy5mbGFncyB8fCAob3B0cy5ub2Nhc2UgPyAnaScgOiAnJykpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnID09PSB0cnVlKSB0aHJvdyBlcnI7XG4gICAgcmV0dXJuIC8kXi87XG4gIH1cbn07XG5cbi8qKlxuICogUGljb21hdGNoIGNvbnN0YW50cy5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5waWNvbWF0Y2guY29uc3RhbnRzID0gY29uc3RhbnRzO1xuXG4vKipcbiAqIEV4cG9zZSBcInBpY29tYXRjaFwiXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBwaWNvbWF0Y2g7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvcGljb21hdGNoJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHsgUmVhZGFibGUgfSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuY29uc3Qgc3lzUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHsgcHJvbWlzaWZ5IH0gPSByZXF1aXJlKCd1dGlsJyk7XG5jb25zdCBwaWNvbWF0Y2ggPSByZXF1aXJlKCdwaWNvbWF0Y2gnKTtcblxuY29uc3QgcmVhZGRpciA9IHByb21pc2lmeShmcy5yZWFkZGlyKTtcbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5jb25zdCBsc3RhdCA9IHByb21pc2lmeShmcy5sc3RhdCk7XG5jb25zdCByZWFscGF0aCA9IHByb21pc2lmeShmcy5yZWFscGF0aCk7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gRW50cnlJbmZvXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcGF0aFxuICogQHByb3BlcnR5IHtTdHJpbmd9IGZ1bGxQYXRoXG4gKiBAcHJvcGVydHkge2ZzLlN0YXRzPX0gc3RhdHNcbiAqIEBwcm9wZXJ0eSB7ZnMuRGlyZW50PX0gZGlyZW50XG4gKiBAcHJvcGVydHkge1N0cmluZ30gYmFzZW5hbWVcbiAqL1xuXG5jb25zdCBCQU5HID0gJyEnO1xuY29uc3QgTk9STUFMX0ZMT1dfRVJST1JTID0gbmV3IFNldChbJ0VOT0VOVCcsICdFUEVSTScsICdFQUNDRVMnLCAnRUxPT1AnXSk7XG5jb25zdCBGSUxFX1RZUEUgPSAnZmlsZXMnO1xuY29uc3QgRElSX1RZUEUgPSAnZGlyZWN0b3JpZXMnO1xuY29uc3QgRklMRV9ESVJfVFlQRSA9ICdmaWxlc19kaXJlY3Rvcmllcyc7XG5jb25zdCBFVkVSWVRISU5HX1RZUEUgPSAnYWxsJztcbmNvbnN0IEFMTF9UWVBFUyA9IFtGSUxFX1RZUEUsIERJUl9UWVBFLCBGSUxFX0RJUl9UWVBFLCBFVkVSWVRISU5HX1RZUEVdO1xuXG5jb25zdCBpc05vcm1hbEZsb3dFcnJvciA9IGVycm9yID0+IE5PUk1BTF9GTE9XX0VSUk9SUy5oYXMoZXJyb3IuY29kZSk7XG5cbmNvbnN0IG5vcm1hbGl6ZUZpbHRlciA9IGZpbHRlciA9PiB7XG4gIGlmIChmaWx0ZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZpbHRlcjtcblxuICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBnbG9iID0gcGljb21hdGNoKGZpbHRlci50cmltKCkpO1xuICAgIHJldHVybiBlbnRyeSA9PiBnbG9iKGVudHJ5LmJhc2VuYW1lKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KGZpbHRlcikpIHtcbiAgICBjb25zdCBwb3NpdGl2ZSA9IFtdO1xuICAgIGNvbnN0IG5lZ2F0aXZlID0gW107XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGZpbHRlcikge1xuICAgICAgY29uc3QgdHJpbW1lZCA9IGl0ZW0udHJpbSgpO1xuICAgICAgaWYgKHRyaW1tZWQuY2hhckF0KDApID09PSBCQU5HKSB7XG4gICAgICAgIG5lZ2F0aXZlLnB1c2gocGljb21hdGNoKHRyaW1tZWQuc2xpY2UoMSkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvc2l0aXZlLnB1c2gocGljb21hdGNoKHRyaW1tZWQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmVnYXRpdmUubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHBvc2l0aXZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGVudHJ5ID0+XG4gICAgICAgICAgcG9zaXRpdmUuc29tZShmID0+IGYoZW50cnkuYmFzZW5hbWUpKSAmJiAhbmVnYXRpdmUuc29tZShmID0+IGYoZW50cnkuYmFzZW5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbnRyeSA9PiAhbmVnYXRpdmUuc29tZShmID0+IGYoZW50cnkuYmFzZW5hbWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5ID0+IHBvc2l0aXZlLnNvbWUoZiA9PiBmKGVudHJ5LmJhc2VuYW1lKSk7XG4gIH1cbn07XG5cbmNsYXNzIFJlYWRkaXJwU3RyZWFtIGV4dGVuZHMgUmVhZGFibGUge1xuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiAnLicsXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgICAgZmlsZUZpbHRlcjogKHBhdGgpID0+IHRydWUsXG4gICAgICBkaXJlY3RvcnlGaWx0ZXI6IChwYXRoKSA9PiB0cnVlLFxuICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgICAgdHlwZTogRklMRV9UWVBFLFxuICAgICAgbHN0YXQ6IGZhbHNlLFxuICAgICAgZGVwdGg6IDIxNDc0ODM2NDgsXG4gICAgICBhbHdheXNTdGF0OiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih7XG4gICAgICBvYmplY3RNb2RlOiB0cnVlLFxuICAgICAgYXV0b0Rlc3Ryb3k6IHRydWUsXG4gICAgICBoaWdoV2F0ZXJNYXJrOiBvcHRpb25zLmhpZ2hXYXRlck1hcmsgfHwgNDA5NlxuICAgIH0pO1xuICAgIGNvbnN0IG9wdHMgPSB7IC4uLlJlYWRkaXJwU3RyZWFtLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG4gICAgY29uc3QgeyByb290LCB0eXBlIH0gPSBvcHRzO1xuXG4gICAgdGhpcy5fZmlsZUZpbHRlciA9IG5vcm1hbGl6ZUZpbHRlcihvcHRzLmZpbGVGaWx0ZXIpO1xuICAgIHRoaXMuX2RpcmVjdG9yeUZpbHRlciA9IG5vcm1hbGl6ZUZpbHRlcihvcHRzLmRpcmVjdG9yeUZpbHRlcik7XG5cbiAgICBjb25zdCBzdGF0TWV0aG9kID0gb3B0cy5sc3RhdCA/IGxzdGF0IDogc3RhdDtcbiAgICAvLyBVc2UgYmlnaW50IHN0YXRzIGlmIGl0J3Mgd2luZG93cyBhbmQgc3RhdCgpIHN1cHBvcnRzIG9wdGlvbnMgKG5vZGUgMTArKS5cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyAmJiBzdGF0Lmxlbmd0aCA9PT0gMykge1xuICAgICAgdGhpcy5fc3RhdCA9IHBhdGggPT4gc3RhdE1ldGhvZChwYXRoLCB7IGJpZ2ludDogdHJ1ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc3RhdCA9IHN0YXRNZXRob2Q7XG4gICAgfVxuXG4gICAgdGhpcy5fbWF4RGVwdGggPSBvcHRzLmRlcHRoO1xuICAgIHRoaXMuX3dhbnRzRGlyID0gW0RJUl9UWVBFLCBGSUxFX0RJUl9UWVBFLCBFVkVSWVRISU5HX1RZUEVdLmluY2x1ZGVzKHR5cGUpO1xuICAgIHRoaXMuX3dhbnRzRmlsZSA9IFtGSUxFX1RZUEUsIEZJTEVfRElSX1RZUEUsIEVWRVJZVEhJTkdfVFlQRV0uaW5jbHVkZXModHlwZSk7XG4gICAgdGhpcy5fd2FudHNFdmVyeXRoaW5nID0gdHlwZSA9PT0gRVZFUllUSElOR19UWVBFO1xuICAgIHRoaXMuX3Jvb3QgPSBzeXNQYXRoLnJlc29sdmUocm9vdCk7XG4gICAgdGhpcy5faXNEaXJlbnQgPSAoJ0RpcmVudCcgaW4gZnMpICYmICFvcHRzLmFsd2F5c1N0YXQ7XG4gICAgdGhpcy5fc3RhdHNQcm9wID0gdGhpcy5faXNEaXJlbnQgPyAnZGlyZW50JyA6ICdzdGF0cyc7XG4gICAgdGhpcy5fcmRPcHRpb25zID0geyBlbmNvZGluZzogJ3V0ZjgnLCB3aXRoRmlsZVR5cGVzOiB0aGlzLl9pc0RpcmVudCB9O1xuXG4gICAgLy8gTGF1bmNoIHN0cmVhbSB3aXRoIG9uZSBwYXJlbnQsIHRoZSByb290IGRpci5cbiAgICB0aGlzLnBhcmVudHMgPSBbdGhpcy5fZXhwbG9yZURpcihyb290LCAxKV07XG4gICAgdGhpcy5yZWFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBhc3luYyBfcmVhZChiYXRjaCkge1xuICAgIGlmICh0aGlzLnJlYWRpbmcpIHJldHVybjtcbiAgICB0aGlzLnJlYWRpbmcgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHdoaWxlICghdGhpcy5kZXN0cm95ZWQgJiYgYmF0Y2ggPiAwKSB7XG4gICAgICAgIGNvbnN0IHsgcGF0aCwgZGVwdGgsIGZpbGVzID0gW10gfSA9IHRoaXMucGFyZW50IHx8IHt9O1xuXG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3Qgc2xpY2UgPSBmaWxlcy5zcGxpY2UoMCwgYmF0Y2gpLm1hcChkaXJlbnQgPT4gdGhpcy5fZm9ybWF0RW50cnkoZGlyZW50LCBwYXRoKSk7XG4gICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBhd2FpdCBQcm9taXNlLmFsbChzbGljZSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBlbnRyeVR5cGUgPSBhd2FpdCB0aGlzLl9nZXRFbnRyeVR5cGUoZW50cnkpO1xuICAgICAgICAgICAgaWYgKGVudHJ5VHlwZSA9PT0gJ2RpcmVjdG9yeScgJiYgdGhpcy5fZGlyZWN0b3J5RmlsdGVyKGVudHJ5KSkge1xuICAgICAgICAgICAgICBpZiAoZGVwdGggPD0gdGhpcy5fbWF4RGVwdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudHMucHVzaCh0aGlzLl9leHBsb3JlRGlyKGVudHJ5LmZ1bGxQYXRoLCBkZXB0aCArIDEpKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl93YW50c0Rpcikge1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaChlbnRyeSk7XG4gICAgICAgICAgICAgICAgYmF0Y2gtLTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgoZW50cnlUeXBlID09PSAnZmlsZScgfHwgdGhpcy5faW5jbHVkZUFzRmlsZShlbnRyeSkpICYmIHRoaXMuX2ZpbGVGaWx0ZXIoZW50cnkpKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLl93YW50c0ZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgIGJhdGNoLS07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnRzLnBvcCgpO1xuICAgICAgICAgIGlmICghcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnB1c2gobnVsbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5wYXJlbnQgPSBhd2FpdCBwYXJlbnQ7XG4gICAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5kZXN0cm95KGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5yZWFkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX2V4cGxvcmVEaXIocGF0aCwgZGVwdGgpIHtcbiAgICBsZXQgZmlsZXM7XG4gICAgdHJ5IHtcbiAgICAgIGZpbGVzID0gYXdhaXQgcmVhZGRpcihwYXRoLCB0aGlzLl9yZE9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9vbkVycm9yKGVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHtmaWxlcywgZGVwdGgsIHBhdGh9O1xuICB9XG5cbiAgYXN5bmMgX2Zvcm1hdEVudHJ5KGRpcmVudCwgcGF0aCkge1xuICAgIGxldCBlbnRyeTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmFzZW5hbWUgPSB0aGlzLl9pc0RpcmVudCA/IGRpcmVudC5uYW1lIDogZGlyZW50O1xuICAgICAgY29uc3QgZnVsbFBhdGggPSBzeXNQYXRoLnJlc29sdmUoc3lzUGF0aC5qb2luKHBhdGgsIGJhc2VuYW1lKSk7XG4gICAgICBlbnRyeSA9IHtwYXRoOiBzeXNQYXRoLnJlbGF0aXZlKHRoaXMuX3Jvb3QsIGZ1bGxQYXRoKSwgZnVsbFBhdGgsIGJhc2VuYW1lfTtcbiAgICAgIGVudHJ5W3RoaXMuX3N0YXRzUHJvcF0gPSB0aGlzLl9pc0RpcmVudCA/IGRpcmVudCA6IGF3YWl0IHRoaXMuX3N0YXQoZnVsbFBhdGgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5fb25FcnJvcihlcnIpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICBfb25FcnJvcihlcnIpIHtcbiAgICBpZiAoaXNOb3JtYWxGbG93RXJyb3IoZXJyKSAmJiAhdGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMuZW1pdCgnd2FybicsIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdHJveShlcnIpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9nZXRFbnRyeVR5cGUoZW50cnkpIHtcbiAgICAvLyBlbnRyeSBtYXkgYmUgdW5kZWZpbmVkLCBiZWNhdXNlIGEgd2FybmluZyBvciBhbiBlcnJvciB3ZXJlIGVtaXR0ZWRcbiAgICAvLyBhbmQgdGhlIHN0YXRzUHJvcCBpcyB1bmRlZmluZWRcbiAgICBjb25zdCBzdGF0cyA9IGVudHJ5ICYmIGVudHJ5W3RoaXMuX3N0YXRzUHJvcF07XG4gICAgaWYgKCFzdGF0cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc3RhdHMuaXNGaWxlKCkpIHtcbiAgICAgIHJldHVybiAnZmlsZSc7XG4gICAgfVxuICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICByZXR1cm4gJ2RpcmVjdG9yeSc7XG4gICAgfVxuICAgIGlmIChzdGF0cyAmJiBzdGF0cy5pc1N5bWJvbGljTGluaygpKSB7XG4gICAgICBjb25zdCBmdWxsID0gZW50cnkuZnVsbFBhdGg7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBlbnRyeVJlYWxQYXRoID0gYXdhaXQgcmVhbHBhdGgoZnVsbCk7XG4gICAgICAgIGNvbnN0IGVudHJ5UmVhbFBhdGhTdGF0cyA9IGF3YWl0IGxzdGF0KGVudHJ5UmVhbFBhdGgpO1xuICAgICAgICBpZiAoZW50cnlSZWFsUGF0aFN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICAgICAgcmV0dXJuICdmaWxlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW50cnlSZWFsUGF0aFN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICBjb25zdCBsZW4gPSBlbnRyeVJlYWxQYXRoLmxlbmd0aDtcbiAgICAgICAgICBpZiAoZnVsbC5zdGFydHNXaXRoKGVudHJ5UmVhbFBhdGgpICYmIGZ1bGwuc3Vic3RyKGxlbiwgMSkgPT09IHN5c1BhdGguc2VwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25FcnJvcihuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBDaXJjdWxhciBzeW1saW5rIGRldGVjdGVkOiBcIiR7ZnVsbH1cIiBwb2ludHMgdG8gXCIke2VudHJ5UmVhbFBhdGh9XCJgXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdkaXJlY3RvcnknO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aGlzLl9vbkVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaW5jbHVkZUFzRmlsZShlbnRyeSkge1xuICAgIGNvbnN0IHN0YXRzID0gZW50cnkgJiYgZW50cnlbdGhpcy5fc3RhdHNQcm9wXTtcblxuICAgIHJldHVybiBzdGF0cyAmJiB0aGlzLl93YW50c0V2ZXJ5dGhpbmcgJiYgIXN0YXRzLmlzRGlyZWN0b3J5KCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBSZWFkZGlycEFyZ3VtZW50c1xuICogQHByb3BlcnR5IHtGdW5jdGlvbj19IGZpbGVGaWx0ZXJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb249fSBkaXJlY3RvcnlGaWx0ZXJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nPX0gdHlwZVxuICogQHByb3BlcnR5IHtOdW1iZXI9fSBkZXB0aFxuICogQHByb3BlcnR5IHtTdHJpbmc9fSByb290XG4gKiBAcHJvcGVydHkge0Jvb2xlYW49fSBsc3RhdFxuICogQHByb3BlcnR5IHtCb29sZWFuPX0gYmlnaW50XG4gKi9cblxuLyoqXG4gKiBNYWluIGZ1bmN0aW9uIHdoaWNoIGVuZHMgdXAgY2FsbGluZyByZWFkZGlyUmVjIGFuZCByZWFkcyBhbGwgZmlsZXMgYW5kIGRpcmVjdG9yaWVzIGluIGdpdmVuIHJvb3QgcmVjdXJzaXZlbHkuXG4gKiBAcGFyYW0ge1N0cmluZ30gcm9vdCBSb290IGRpcmVjdG9yeVxuICogQHBhcmFtIHtSZWFkZGlycEFyZ3VtZW50cz19IG9wdGlvbnMgT3B0aW9ucyB0byBzcGVjaWZ5IHJvb3QgKHN0YXJ0IGRpcmVjdG9yeSksIGZpbHRlcnMgYW5kIHJlY3Vyc2lvbiBkZXB0aFxuICovXG5jb25zdCByZWFkZGlycCA9IChyb290LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IHR5cGUgPSBvcHRpb25zLmVudHJ5VHlwZSB8fCBvcHRpb25zLnR5cGU7XG4gIGlmICh0eXBlID09PSAnYm90aCcpIHR5cGUgPSBGSUxFX0RJUl9UWVBFOyAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eVxuICBpZiAodHlwZSkgb3B0aW9ucy50eXBlID0gdHlwZTtcbiAgaWYgKCFyb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZWFkZGlycDogcm9vdCBhcmd1bWVudCBpcyByZXF1aXJlZC4gVXNhZ2U6IHJlYWRkaXJwKHJvb3QsIG9wdGlvbnMpJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHJvb3QgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVhZGRpcnA6IHJvb3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZy4gVXNhZ2U6IHJlYWRkaXJwKHJvb3QsIG9wdGlvbnMpJyk7XG4gIH0gZWxzZSBpZiAodHlwZSAmJiAhQUxMX1RZUEVTLmluY2x1ZGVzKHR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGByZWFkZGlycDogSW52YWxpZCB0eXBlIHBhc3NlZC4gVXNlIG9uZSBvZiAke0FMTF9UWVBFUy5qb2luKCcsICcpfWApO1xuICB9XG5cbiAgb3B0aW9ucy5yb290ID0gcm9vdDtcbiAgcmV0dXJuIG5ldyBSZWFkZGlycFN0cmVhbShvcHRpb25zKTtcbn07XG5cbmNvbnN0IHJlYWRkaXJwUHJvbWlzZSA9IChyb290LCBvcHRpb25zID0ge30pID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBmaWxlcyA9IFtdO1xuICAgIHJlYWRkaXJwKHJvb3QsIG9wdGlvbnMpXG4gICAgICAub24oJ2RhdGEnLCBlbnRyeSA9PiBmaWxlcy5wdXNoKGVudHJ5KSlcbiAgICAgIC5vbignZW5kJywgKCkgPT4gcmVzb2x2ZShmaWxlcykpXG4gICAgICAub24oJ2Vycm9yJywgZXJyb3IgPT4gcmVqZWN0KGVycm9yKSk7XG4gIH0pO1xufTtcblxucmVhZGRpcnAucHJvbWlzZSA9IHJlYWRkaXJwUHJvbWlzZTtcbnJlYWRkaXJwLlJlYWRkaXJwU3RyZWFtID0gUmVhZGRpcnBTdHJlYW07XG5yZWFkZGlycC5kZWZhdWx0ID0gcmVhZGRpcnA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVhZGRpcnA7XG4iLCIvKiFcbiAqIG5vcm1hbGl6ZS1wYXRoIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9ub3JtYWxpemUtcGF0aD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxOCwgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXRoLCBzdHJpcFRyYWlsaW5nKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCBwYXRoIHRvIGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBpZiAocGF0aCA9PT0gJ1xcXFwnIHx8IHBhdGggPT09ICcvJykgcmV0dXJuICcvJztcblxuICB2YXIgbGVuID0gcGF0aC5sZW5ndGg7XG4gIGlmIChsZW4gPD0gMSkgcmV0dXJuIHBhdGg7XG5cbiAgLy8gZW5zdXJlIHRoYXQgd2luMzIgbmFtZXNwYWNlcyBoYXMgdHdvIGxlYWRpbmcgc2xhc2hlcywgc28gdGhhdCB0aGUgcGF0aCBpc1xuICAvLyBoYW5kbGVkIHByb3Blcmx5IGJ5IHRoZSB3aW4zMiB2ZXJzaW9uIG9mIHBhdGgucGFyc2UoKSBhZnRlciBiZWluZyBub3JtYWxpemVkXG4gIC8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2xpYnJhcnkvd2luZG93cy9kZXNrdG9wL2FhMzY1MjQ3KHY9dnMuODUpLmFzcHgjbmFtZXNwYWNlc1xuICB2YXIgcHJlZml4ID0gJyc7XG4gIGlmIChsZW4gPiA0ICYmIHBhdGhbM10gPT09ICdcXFxcJykge1xuICAgIHZhciBjaCA9IHBhdGhbMl07XG4gICAgaWYgKChjaCA9PT0gJz8nIHx8IGNoID09PSAnLicpICYmIHBhdGguc2xpY2UoMCwgMikgPT09ICdcXFxcXFxcXCcpIHtcbiAgICAgIHBhdGggPSBwYXRoLnNsaWNlKDIpO1xuICAgICAgcHJlZml4ID0gJy8vJztcbiAgICB9XG4gIH1cblxuICB2YXIgc2VncyA9IHBhdGguc3BsaXQoL1svXFxcXF0rLyk7XG4gIGlmIChzdHJpcFRyYWlsaW5nICE9PSBmYWxzZSAmJiBzZWdzW3NlZ3MubGVuZ3RoIC0gMV0gPT09ICcnKSB7XG4gICAgc2Vncy5wb3AoKTtcbiAgfVxuICByZXR1cm4gcHJlZml4ICsgc2Vncy5qb2luKCcvJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5cbmNvbnN0IHBpY29tYXRjaCA9IHJlcXVpcmUoJ3BpY29tYXRjaCcpO1xuY29uc3Qgbm9ybWFsaXplUGF0aCA9IHJlcXVpcmUoJ25vcm1hbGl6ZS1wYXRoJyk7XG5cbi8qKlxuICogQHR5cGVkZWYgeyh0ZXN0U3RyaW5nOiBzdHJpbmcpID0+IGJvb2xlYW59IEFueW1hdGNoRm5cbiAqIEB0eXBlZGVmIHtzdHJpbmd8UmVnRXhwfEFueW1hdGNoRm59IEFueW1hdGNoUGF0dGVyblxuICogQHR5cGVkZWYge0FueW1hdGNoUGF0dGVybnxBbnltYXRjaFBhdHRlcm5bXX0gQW55bWF0Y2hNYXRjaGVyXG4gKi9cbmNvbnN0IEJBTkcgPSAnISc7XG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7cmV0dXJuSW5kZXg6IGZhbHNlfTtcbmNvbnN0IGFycmlmeSA9IChpdGVtKSA9PiBBcnJheS5pc0FycmF5KGl0ZW0pID8gaXRlbSA6IFtpdGVtXTtcblxuLyoqXG4gKiBAcGFyYW0ge0FueW1hdGNoUGF0dGVybn0gbWF0Y2hlclxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm5zIHtBbnltYXRjaEZufVxuICovXG5jb25zdCBjcmVhdGVQYXR0ZXJuID0gKG1hdGNoZXIsIG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBtYXRjaGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1hdGNoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiBtYXRjaGVyID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGdsb2IgPSBwaWNvbWF0Y2gobWF0Y2hlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIChzdHJpbmcpID0+IG1hdGNoZXIgPT09IHN0cmluZyB8fCBnbG9iKHN0cmluZyk7XG4gIH1cbiAgaWYgKG1hdGNoZXIgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gKHN0cmluZykgPT4gbWF0Y2hlci50ZXN0KHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIChzdHJpbmcpID0+IGZhbHNlO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPn0gcGF0dGVybnNcbiAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fSBuZWdQYXR0ZXJuc1xuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGFyZ3NcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmV0dXJuSW5kZXhcbiAqIEByZXR1cm5zIHtib29sZWFufG51bWJlcn1cbiAqL1xuY29uc3QgbWF0Y2hQYXR0ZXJucyA9IChwYXR0ZXJucywgbmVnUGF0dGVybnMsIGFyZ3MsIHJldHVybkluZGV4KSA9PiB7XG4gIGNvbnN0IGlzTGlzdCA9IEFycmF5LmlzQXJyYXkoYXJncyk7XG4gIGNvbnN0IF9wYXRoID0gaXNMaXN0ID8gYXJnc1swXSA6IGFyZ3M7XG4gIGlmICghaXNMaXN0ICYmIHR5cGVvZiBfcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhbnltYXRjaDogc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmc6IGdvdCAnICtcbiAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChfcGF0aCkpXG4gIH1cbiAgY29uc3QgcGF0aCA9IG5vcm1hbGl6ZVBhdGgoX3BhdGgsIGZhbHNlKTtcblxuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbmVnUGF0dGVybnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgY29uc3Qgbmdsb2IgPSBuZWdQYXR0ZXJuc1tpbmRleF07XG4gICAgaWYgKG5nbG9iKHBhdGgpKSB7XG4gICAgICByZXR1cm4gcmV0dXJuSW5kZXggPyAtMSA6IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFwcGxpZWQgPSBpc0xpc3QgJiYgW3BhdGhdLmNvbmNhdChhcmdzLnNsaWNlKDEpKTtcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHBhdHRlcm5zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBwYXR0ZXJuc1tpbmRleF07XG4gICAgaWYgKGlzTGlzdCA/IHBhdHRlcm4oLi4uYXBwbGllZCkgOiBwYXR0ZXJuKHBhdGgpKSB7XG4gICAgICByZXR1cm4gcmV0dXJuSW5kZXggPyBpbmRleCA6IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldHVybkluZGV4ID8gLTEgOiBmYWxzZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtBbnltYXRjaE1hdGNoZXJ9IG1hdGNoZXJzXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gdGVzdFN0cmluZ1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm5zIHtib29sZWFufG51bWJlcnxGdW5jdGlvbn1cbiAqL1xuY29uc3QgYW55bWF0Y2ggPSAobWF0Y2hlcnMsIHRlc3RTdHJpbmcsIG9wdGlvbnMgPSBERUZBVUxUX09QVElPTlMpID0+IHtcbiAgaWYgKG1hdGNoZXJzID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhbnltYXRjaDogc3BlY2lmeSBmaXJzdCBhcmd1bWVudCcpO1xuICB9XG4gIGNvbnN0IG9wdHMgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nID8ge3JldHVybkluZGV4OiBvcHRpb25zfSA6IG9wdGlvbnM7XG4gIGNvbnN0IHJldHVybkluZGV4ID0gb3B0cy5yZXR1cm5JbmRleCB8fCBmYWxzZTtcblxuICAvLyBFYXJseSBjYWNoZSBmb3IgbWF0Y2hlcnMuXG4gIGNvbnN0IG10Y2hlcnMgPSBhcnJpZnkobWF0Y2hlcnMpO1xuICBjb25zdCBuZWdhdGVkR2xvYnMgPSBtdGNoZXJzXG4gICAgLmZpbHRlcihpdGVtID0+IHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBpdGVtLmNoYXJBdCgwKSA9PT0gQkFORylcbiAgICAubWFwKGl0ZW0gPT4gaXRlbS5zbGljZSgxKSlcbiAgICAubWFwKGl0ZW0gPT4gcGljb21hdGNoKGl0ZW0sIG9wdHMpKTtcbiAgY29uc3QgcGF0dGVybnMgPSBtdGNoZXJzXG4gICAgLmZpbHRlcihpdGVtID0+IHR5cGVvZiBpdGVtICE9PSAnc3RyaW5nJyB8fCAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICYmIGl0ZW0uY2hhckF0KDApICE9PSBCQU5HKSlcbiAgICAubWFwKG1hdGNoZXIgPT4gY3JlYXRlUGF0dGVybihtYXRjaGVyLCBvcHRzKSk7XG5cbiAgaWYgKHRlc3RTdHJpbmcgPT0gbnVsbCkge1xuICAgIHJldHVybiAodGVzdFN0cmluZywgcmkgPSBmYWxzZSkgPT4ge1xuICAgICAgY29uc3QgcmV0dXJuSW5kZXggPSB0eXBlb2YgcmkgPT09ICdib29sZWFuJyA/IHJpIDogZmFsc2U7XG4gICAgICByZXR1cm4gbWF0Y2hQYXR0ZXJucyhwYXR0ZXJucywgbmVnYXRlZEdsb2JzLCB0ZXN0U3RyaW5nLCByZXR1cm5JbmRleCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoUGF0dGVybnMocGF0dGVybnMsIG5lZ2F0ZWRHbG9icywgdGVzdFN0cmluZywgcmV0dXJuSW5kZXgpO1xufTtcblxuYW55bWF0Y2guZGVmYXVsdCA9IGFueW1hdGNoO1xubW9kdWxlLmV4cG9ydHMgPSBhbnltYXRjaDtcbiIsIi8qIVxuICogaXMtZXh0Z2xvYiA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtZXh0Z2xvYj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNiwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0V4dGdsb2Ioc3RyKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJyB8fCBzdHIgPT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIG1hdGNoO1xuICB3aGlsZSAoKG1hdGNoID0gLyhcXFxcKS58KFtAPyErKl1cXCguKlxcKSkvZy5leGVjKHN0cikpKSB7XG4gICAgaWYgKG1hdGNoWzJdKSByZXR1cm4gdHJ1ZTtcbiAgICBzdHIgPSBzdHIuc2xpY2UobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIi8qIVxuICogaXMtZ2xvYiA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtZ2xvYj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNywgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxudmFyIGlzRXh0Z2xvYiA9IHJlcXVpcmUoJ2lzLWV4dGdsb2InKTtcbnZhciBjaGFycyA9IHsgJ3snOiAnfScsICcoJzogJyknLCAnWyc6ICddJ307XG52YXIgc3RyaWN0Q2hlY2sgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHN0clswXSA9PT0gJyEnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIHBpcGVJbmRleCA9IC0yO1xuICB2YXIgY2xvc2VTcXVhcmVJbmRleCA9IC0yO1xuICB2YXIgY2xvc2VDdXJseUluZGV4ID0gLTI7XG4gIHZhciBjbG9zZVBhcmVuSW5kZXggPSAtMjtcbiAgdmFyIGJhY2tTbGFzaEluZGV4ID0gLTI7XG4gIHdoaWxlIChpbmRleCA8IHN0ci5sZW5ndGgpIHtcbiAgICBpZiAoc3RyW2luZGV4XSA9PT0gJyonKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RyW2luZGV4ICsgMV0gPT09ICc/JyAmJiAvW1xcXS4rKV0vLnRlc3Qoc3RyW2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjbG9zZVNxdWFyZUluZGV4ICE9PSAtMSAmJiBzdHJbaW5kZXhdID09PSAnWycgJiYgc3RyW2luZGV4ICsgMV0gIT09ICddJykge1xuICAgICAgaWYgKGNsb3NlU3F1YXJlSW5kZXggPCBpbmRleCkge1xuICAgICAgICBjbG9zZVNxdWFyZUluZGV4ID0gc3RyLmluZGV4T2YoJ10nLCBpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoY2xvc2VTcXVhcmVJbmRleCA+IGluZGV4KSB7XG4gICAgICAgIGlmIChiYWNrU2xhc2hJbmRleCA9PT0gLTEgfHwgYmFja1NsYXNoSW5kZXggPiBjbG9zZVNxdWFyZUluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYmFja1NsYXNoSW5kZXggPSBzdHIuaW5kZXhPZignXFxcXCcsIGluZGV4KTtcbiAgICAgICAgaWYgKGJhY2tTbGFzaEluZGV4ID09PSAtMSB8fCBiYWNrU2xhc2hJbmRleCA+IGNsb3NlU3F1YXJlSW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjbG9zZUN1cmx5SW5kZXggIT09IC0xICYmIHN0cltpbmRleF0gPT09ICd7JyAmJiBzdHJbaW5kZXggKyAxXSAhPT0gJ30nKSB7XG4gICAgICBjbG9zZUN1cmx5SW5kZXggPSBzdHIuaW5kZXhPZignfScsIGluZGV4KTtcbiAgICAgIGlmIChjbG9zZUN1cmx5SW5kZXggPiBpbmRleCkge1xuICAgICAgICBiYWNrU2xhc2hJbmRleCA9IHN0ci5pbmRleE9mKCdcXFxcJywgaW5kZXgpO1xuICAgICAgICBpZiAoYmFja1NsYXNoSW5kZXggPT09IC0xIHx8IGJhY2tTbGFzaEluZGV4ID4gY2xvc2VDdXJseUluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2xvc2VQYXJlbkluZGV4ICE9PSAtMSAmJiBzdHJbaW5kZXhdID09PSAnKCcgJiYgc3RyW2luZGV4ICsgMV0gPT09ICc/JyAmJiAvWzohPV0vLnRlc3Qoc3RyW2luZGV4ICsgMl0pICYmIHN0cltpbmRleCArIDNdICE9PSAnKScpIHtcbiAgICAgIGNsb3NlUGFyZW5JbmRleCA9IHN0ci5pbmRleE9mKCcpJywgaW5kZXgpO1xuICAgICAgaWYgKGNsb3NlUGFyZW5JbmRleCA+IGluZGV4KSB7XG4gICAgICAgIGJhY2tTbGFzaEluZGV4ID0gc3RyLmluZGV4T2YoJ1xcXFwnLCBpbmRleCk7XG4gICAgICAgIGlmIChiYWNrU2xhc2hJbmRleCA9PT0gLTEgfHwgYmFja1NsYXNoSW5kZXggPiBjbG9zZVBhcmVuSW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwaXBlSW5kZXggIT09IC0xICYmIHN0cltpbmRleF0gPT09ICcoJyAmJiBzdHJbaW5kZXggKyAxXSAhPT0gJ3wnKSB7XG4gICAgICBpZiAocGlwZUluZGV4IDwgaW5kZXgpIHtcbiAgICAgICAgcGlwZUluZGV4ID0gc3RyLmluZGV4T2YoJ3wnLCBpbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAocGlwZUluZGV4ICE9PSAtMSAmJiBzdHJbcGlwZUluZGV4ICsgMV0gIT09ICcpJykge1xuICAgICAgICBjbG9zZVBhcmVuSW5kZXggPSBzdHIuaW5kZXhPZignKScsIHBpcGVJbmRleCk7XG4gICAgICAgIGlmIChjbG9zZVBhcmVuSW5kZXggPiBwaXBlSW5kZXgpIHtcbiAgICAgICAgICBiYWNrU2xhc2hJbmRleCA9IHN0ci5pbmRleE9mKCdcXFxcJywgcGlwZUluZGV4KTtcbiAgICAgICAgICBpZiAoYmFja1NsYXNoSW5kZXggPT09IC0xIHx8IGJhY2tTbGFzaEluZGV4ID4gY2xvc2VQYXJlbkluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RyW2luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICB2YXIgb3BlbiA9IHN0cltpbmRleCArIDFdO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICAgIHZhciBjbG9zZSA9IGNoYXJzW29wZW5dO1xuXG4gICAgICBpZiAoY2xvc2UpIHtcbiAgICAgICAgdmFyIG4gPSBzdHIuaW5kZXhPZihjbG9zZSwgaW5kZXgpO1xuICAgICAgICBpZiAobiAhPT0gLTEpIHtcbiAgICAgICAgICBpbmRleCA9IG4gKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHJbaW5kZXhdID09PSAnIScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnZhciByZWxheGVkQ2hlY2sgPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKHN0clswXSA9PT0gJyEnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIGluZGV4ID0gMDtcbiAgd2hpbGUgKGluZGV4IDwgc3RyLmxlbmd0aCkge1xuICAgIGlmICgvWyo/e30oKVtcXF1dLy50ZXN0KHN0cltpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RyW2luZGV4XSA9PT0gJ1xcXFwnKSB7XG4gICAgICB2YXIgb3BlbiA9IHN0cltpbmRleCArIDFdO1xuICAgICAgaW5kZXggKz0gMjtcbiAgICAgIHZhciBjbG9zZSA9IGNoYXJzW29wZW5dO1xuXG4gICAgICBpZiAoY2xvc2UpIHtcbiAgICAgICAgdmFyIG4gPSBzdHIuaW5kZXhPZihjbG9zZSwgaW5kZXgpO1xuICAgICAgICBpZiAobiAhPT0gLTEpIHtcbiAgICAgICAgICBpbmRleCA9IG4gKyAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHJbaW5kZXhdID09PSAnIScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNHbG9iKHN0ciwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycgfHwgc3RyID09PSAnJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc0V4dGdsb2Ioc3RyKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGNoZWNrID0gc3RyaWN0Q2hlY2s7XG5cbiAgLy8gb3B0aW9uYWxseSByZWxheCBjaGVja1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN0cmljdCA9PT0gZmFsc2UpIHtcbiAgICBjaGVjayA9IHJlbGF4ZWRDaGVjaztcbiAgfVxuXG4gIHJldHVybiBjaGVjayhzdHIpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzR2xvYiA9IHJlcXVpcmUoJ2lzLWdsb2InKTtcbnZhciBwYXRoUG9zaXhEaXJuYW1lID0gcmVxdWlyZSgncGF0aCcpLnBvc2l4LmRpcm5hbWU7XG52YXIgaXNXaW4zMiA9IHJlcXVpcmUoJ29zJykucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJztcblxudmFyIHNsYXNoID0gJy8nO1xudmFyIGJhY2tzbGFzaCA9IC9cXFxcL2c7XG52YXIgZW5jbG9zdXJlID0gL1tcXHtcXFtdLipbXFx9XFxdXSQvO1xudmFyIGdsb2JieSA9IC8oXnxbXlxcXFxdKShbXFx7XFxbXXxcXChbXlxcKV0rJCkvO1xudmFyIGVzY2FwZWQgPSAvXFxcXChbXFwhXFwqXFw/XFx8XFxbXFxdXFwoXFwpXFx7XFx9XSkvZztcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5mbGlwQmFja3NsYXNoZXM9dHJ1ZV1cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2xvYlBhcmVudChzdHIsIG9wdHMpIHtcbiAgdmFyIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZmxpcEJhY2tzbGFzaGVzOiB0cnVlIH0sIG9wdHMpO1xuXG4gIC8vIGZsaXAgd2luZG93cyBwYXRoIHNlcGFyYXRvcnNcbiAgaWYgKG9wdGlvbnMuZmxpcEJhY2tzbGFzaGVzICYmIGlzV2luMzIgJiYgc3RyLmluZGV4T2Yoc2xhc2gpIDwgMCkge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKGJhY2tzbGFzaCwgc2xhc2gpO1xuICB9XG5cbiAgLy8gc3BlY2lhbCBjYXNlIGZvciBzdHJpbmdzIGVuZGluZyBpbiBlbmNsb3N1cmUgY29udGFpbmluZyBwYXRoIHNlcGFyYXRvclxuICBpZiAoZW5jbG9zdXJlLnRlc3Qoc3RyKSkge1xuICAgIHN0ciArPSBzbGFzaDtcbiAgfVxuXG4gIC8vIHByZXNlcnZlcyBmdWxsIHBhdGggaW4gY2FzZSBvZiB0cmFpbGluZyBwYXRoIHNlcGFyYXRvclxuICBzdHIgKz0gJ2EnO1xuXG4gIC8vIHJlbW92ZSBwYXRoIHBhcnRzIHRoYXQgYXJlIGdsb2JieVxuICBkbyB7XG4gICAgc3RyID0gcGF0aFBvc2l4RGlybmFtZShzdHIpO1xuICB9IHdoaWxlIChpc0dsb2Ioc3RyKSB8fCBnbG9iYnkudGVzdChzdHIpKTtcblxuICAvLyByZW1vdmUgZXNjYXBlIGNoYXJzIGFuZCByZXR1cm4gcmVzdWx0XG4gIHJldHVybiBzdHIucmVwbGFjZShlc2NhcGVkLCAnJDEnKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuaXNJbnRlZ2VyID0gbnVtID0+IHtcbiAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobnVtKTtcbiAgfVxuICBpZiAodHlwZW9mIG51bSA9PT0gJ3N0cmluZycgJiYgbnVtLnRyaW0oKSAhPT0gJycpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihOdW1iZXIobnVtKSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBGaW5kIGEgbm9kZSBvZiB0aGUgZ2l2ZW4gdHlwZVxuICovXG5cbmV4cG9ydHMuZmluZCA9IChub2RlLCB0eXBlKSA9PiBub2RlLm5vZGVzLmZpbmQobm9kZSA9PiBub2RlLnR5cGUgPT09IHR5cGUpO1xuXG4vKipcbiAqIEZpbmQgYSBub2RlIG9mIHRoZSBnaXZlbiB0eXBlXG4gKi9cblxuZXhwb3J0cy5leGNlZWRzTGltaXQgPSAobWluLCBtYXgsIHN0ZXAgPSAxLCBsaW1pdCkgPT4ge1xuICBpZiAobGltaXQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gIGlmICghZXhwb3J0cy5pc0ludGVnZXIobWluKSB8fCAhZXhwb3J0cy5pc0ludGVnZXIobWF4KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKChOdW1iZXIobWF4KSAtIE51bWJlcihtaW4pKSAvIE51bWJlcihzdGVwKSkgPj0gbGltaXQ7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gbm9kZSB3aXRoICdcXFxcJyBiZWZvcmUgbm9kZS52YWx1ZVxuICovXG5cbmV4cG9ydHMuZXNjYXBlTm9kZSA9IChibG9jaywgbiA9IDAsIHR5cGUpID0+IHtcbiAgbGV0IG5vZGUgPSBibG9jay5ub2Rlc1tuXTtcbiAgaWYgKCFub2RlKSByZXR1cm47XG5cbiAgaWYgKCh0eXBlICYmIG5vZGUudHlwZSA9PT0gdHlwZSkgfHwgbm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgaWYgKG5vZGUuZXNjYXBlZCAhPT0gdHJ1ZSkge1xuICAgICAgbm9kZS52YWx1ZSA9ICdcXFxcJyArIG5vZGUudmFsdWU7XG4gICAgICBub2RlLmVzY2FwZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGJyYWNlIG5vZGUgc2hvdWxkIGJlIGVuY2xvc2VkIGluIGxpdGVyYWwgYnJhY2VzXG4gKi9cblxuZXhwb3J0cy5lbmNsb3NlQnJhY2UgPSBub2RlID0+IHtcbiAgaWYgKG5vZGUudHlwZSAhPT0gJ2JyYWNlJykgcmV0dXJuIGZhbHNlO1xuICBpZiAoKG5vZGUuY29tbWFzID4+IDAgKyBub2RlLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIG5vZGUuaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBicmFjZSBub2RlIGlzIGludmFsaWQuXG4gKi9cblxuZXhwb3J0cy5pc0ludmFsaWRCcmFjZSA9IGJsb2NrID0+IHtcbiAgaWYgKGJsb2NrLnR5cGUgIT09ICdicmFjZScpIHJldHVybiBmYWxzZTtcbiAgaWYgKGJsb2NrLmludmFsaWQgPT09IHRydWUgfHwgYmxvY2suZG9sbGFyKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKChibG9jay5jb21tYXMgPj4gMCArIGJsb2NrLnJhbmdlcyA+PiAwKSA9PT0gMCkge1xuICAgIGJsb2NrLmludmFsaWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChibG9jay5vcGVuICE9PSB0cnVlIHx8IGJsb2NrLmNsb3NlICE9PSB0cnVlKSB7XG4gICAgYmxvY2suaW52YWxpZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBub2RlIGlzIGFuIG9wZW4gb3IgY2xvc2Ugbm9kZVxuICovXG5cbmV4cG9ydHMuaXNPcGVuT3JDbG9zZSA9IG5vZGUgPT4ge1xuICBpZiAobm9kZS50eXBlID09PSAnb3BlbicgfHwgbm9kZS50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIG5vZGUub3BlbiA9PT0gdHJ1ZSB8fCBub2RlLmNsb3NlID09PSB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWR1Y2UgYW4gYXJyYXkgb2YgdGV4dCBub2Rlcy5cbiAqL1xuXG5leHBvcnRzLnJlZHVjZSA9IG5vZGVzID0+IG5vZGVzLnJlZHVjZSgoYWNjLCBub2RlKSA9PiB7XG4gIGlmIChub2RlLnR5cGUgPT09ICd0ZXh0JykgYWNjLnB1c2gobm9kZS52YWx1ZSk7XG4gIGlmIChub2RlLnR5cGUgPT09ICdyYW5nZScpIG5vZGUudHlwZSA9ICd0ZXh0JztcbiAgcmV0dXJuIGFjYztcbn0sIFtdKTtcblxuLyoqXG4gKiBGbGF0dGVuIGFuIGFycmF5XG4gKi9cblxuZXhwb3J0cy5mbGF0dGVuID0gKC4uLmFyZ3MpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGNvbnN0IGZsYXQgPSBhcnIgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZWxlID0gYXJyW2ldO1xuICAgICAgQXJyYXkuaXNBcnJheShlbGUpID8gZmxhdChlbGUsIHJlc3VsdCkgOiBlbGUgIT09IHZvaWQgMCAmJiByZXN1bHQucHVzaChlbGUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBmbGF0KGFyZ3MpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGFzdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCBzdHJpbmdpZnkgPSAobm9kZSwgcGFyZW50ID0ge30pID0+IHtcbiAgICBsZXQgaW52YWxpZEJsb2NrID0gb3B0aW9ucy5lc2NhcGVJbnZhbGlkICYmIHV0aWxzLmlzSW52YWxpZEJyYWNlKHBhcmVudCk7XG4gICAgbGV0IGludmFsaWROb2RlID0gbm9kZS5pbnZhbGlkID09PSB0cnVlICYmIG9wdGlvbnMuZXNjYXBlSW52YWxpZCA9PT0gdHJ1ZTtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICBpZiAobm9kZS52YWx1ZSkge1xuICAgICAgaWYgKChpbnZhbGlkQmxvY2sgfHwgaW52YWxpZE5vZGUpICYmIHV0aWxzLmlzT3Blbk9yQ2xvc2Uobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuICdcXFxcJyArIG5vZGUudmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZS52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS52YWx1ZSkge1xuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZXMpIHtcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIG5vZGUubm9kZXMpIHtcbiAgICAgICAgb3V0cHV0ICs9IHN0cmluZ2lmeShjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShhc3QpO1xufTtcblxuIiwiLyohXG4gKiBpcy1udW1iZXIgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLW51bWJlcj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgSm9uIFNjaGxpbmtlcnQuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG51bSkge1xuICBpZiAodHlwZW9mIG51bSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbnVtIC0gbnVtID09PSAwO1xuICB9XG4gIGlmICh0eXBlb2YgbnVtID09PSAnc3RyaW5nJyAmJiBudW0udHJpbSgpICE9PSAnJykge1xuICAgIHJldHVybiBOdW1iZXIuaXNGaW5pdGUgPyBOdW1iZXIuaXNGaW5pdGUoK251bSkgOiBpc0Zpbml0ZSgrbnVtKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLyohXG4gKiB0by1yZWdleC1yYW5nZSA8aHR0cHM6Ly9naXRodWIuY29tL21pY3JvbWF0Y2gvdG8tcmVnZXgtcmFuZ2U+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEpvbiBTY2hsaW5rZXJ0LlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNOdW1iZXIgPSByZXF1aXJlKCdpcy1udW1iZXInKTtcblxuY29uc3QgdG9SZWdleFJhbmdlID0gKG1pbiwgbWF4LCBvcHRpb25zKSA9PiB7XG4gIGlmIChpc051bWJlcihtaW4pID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RvUmVnZXhSYW5nZTogZXhwZWN0ZWQgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICBpZiAobWF4ID09PSB2b2lkIDAgfHwgbWluID09PSBtYXgpIHtcbiAgICByZXR1cm4gU3RyaW5nKG1pbik7XG4gIH1cblxuICBpZiAoaXNOdW1iZXIobWF4KSA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0b1JlZ2V4UmFuZ2U6IGV4cGVjdGVkIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSBudW1iZXIuJyk7XG4gIH1cblxuICBsZXQgb3B0cyA9IHsgcmVsYXhaZXJvczogdHJ1ZSwgLi4ub3B0aW9ucyB9O1xuICBpZiAodHlwZW9mIG9wdHMuc3RyaWN0WmVyb3MgPT09ICdib29sZWFuJykge1xuICAgIG9wdHMucmVsYXhaZXJvcyA9IG9wdHMuc3RyaWN0WmVyb3MgPT09IGZhbHNlO1xuICB9XG5cbiAgbGV0IHJlbGF4ID0gU3RyaW5nKG9wdHMucmVsYXhaZXJvcyk7XG4gIGxldCBzaG9ydGhhbmQgPSBTdHJpbmcob3B0cy5zaG9ydGhhbmQpO1xuICBsZXQgY2FwdHVyZSA9IFN0cmluZyhvcHRzLmNhcHR1cmUpO1xuICBsZXQgd3JhcCA9IFN0cmluZyhvcHRzLndyYXApO1xuICBsZXQgY2FjaGVLZXkgPSBtaW4gKyAnOicgKyBtYXggKyAnPScgKyByZWxheCArIHNob3J0aGFuZCArIGNhcHR1cmUgKyB3cmFwO1xuXG4gIGlmICh0b1JlZ2V4UmFuZ2UuY2FjaGUuaGFzT3duUHJvcGVydHkoY2FjaGVLZXkpKSB7XG4gICAgcmV0dXJuIHRvUmVnZXhSYW5nZS5jYWNoZVtjYWNoZUtleV0ucmVzdWx0O1xuICB9XG5cbiAgbGV0IGEgPSBNYXRoLm1pbihtaW4sIG1heCk7XG4gIGxldCBiID0gTWF0aC5tYXgobWluLCBtYXgpO1xuXG4gIGlmIChNYXRoLmFicyhhIC0gYikgPT09IDEpIHtcbiAgICBsZXQgcmVzdWx0ID0gbWluICsgJ3wnICsgbWF4O1xuICAgIGlmIChvcHRzLmNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBgKCR7cmVzdWx0fSlgO1xuICAgIH1cbiAgICBpZiAob3B0cy53cmFwID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIGAoPzoke3Jlc3VsdH0pYDtcbiAgfVxuXG4gIGxldCBpc1BhZGRlZCA9IGhhc1BhZGRpbmcobWluKSB8fCBoYXNQYWRkaW5nKG1heCk7XG4gIGxldCBzdGF0ZSA9IHsgbWluLCBtYXgsIGEsIGIgfTtcbiAgbGV0IHBvc2l0aXZlcyA9IFtdO1xuICBsZXQgbmVnYXRpdmVzID0gW107XG5cbiAgaWYgKGlzUGFkZGVkKSB7XG4gICAgc3RhdGUuaXNQYWRkZWQgPSBpc1BhZGRlZDtcbiAgICBzdGF0ZS5tYXhMZW4gPSBTdHJpbmcoc3RhdGUubWF4KS5sZW5ndGg7XG4gIH1cblxuICBpZiAoYSA8IDApIHtcbiAgICBsZXQgbmV3TWluID0gYiA8IDAgPyBNYXRoLmFicyhiKSA6IDE7XG4gICAgbmVnYXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKG5ld01pbiwgTWF0aC5hYnMoYSksIHN0YXRlLCBvcHRzKTtcbiAgICBhID0gc3RhdGUuYSA9IDA7XG4gIH1cblxuICBpZiAoYiA+PSAwKSB7XG4gICAgcG9zaXRpdmVzID0gc3BsaXRUb1BhdHRlcm5zKGEsIGIsIHN0YXRlLCBvcHRzKTtcbiAgfVxuXG4gIHN0YXRlLm5lZ2F0aXZlcyA9IG5lZ2F0aXZlcztcbiAgc3RhdGUucG9zaXRpdmVzID0gcG9zaXRpdmVzO1xuICBzdGF0ZS5yZXN1bHQgPSBjb2xsYXRlUGF0dGVybnMobmVnYXRpdmVzLCBwb3NpdGl2ZXMsIG9wdHMpO1xuXG4gIGlmIChvcHRzLmNhcHR1cmUgPT09IHRydWUpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKCR7c3RhdGUucmVzdWx0fSlgO1xuICB9IGVsc2UgaWYgKG9wdHMud3JhcCAhPT0gZmFsc2UgJiYgKHBvc2l0aXZlcy5sZW5ndGggKyBuZWdhdGl2ZXMubGVuZ3RoKSA+IDEpIHtcbiAgICBzdGF0ZS5yZXN1bHQgPSBgKD86JHtzdGF0ZS5yZXN1bHR9KWA7XG4gIH1cblxuICB0b1JlZ2V4UmFuZ2UuY2FjaGVbY2FjaGVLZXldID0gc3RhdGU7XG4gIHJldHVybiBzdGF0ZS5yZXN1bHQ7XG59O1xuXG5mdW5jdGlvbiBjb2xsYXRlUGF0dGVybnMobmVnLCBwb3MsIG9wdGlvbnMpIHtcbiAgbGV0IG9ubHlOZWdhdGl2ZSA9IGZpbHRlclBhdHRlcm5zKG5lZywgcG9zLCAnLScsIGZhbHNlLCBvcHRpb25zKSB8fCBbXTtcbiAgbGV0IG9ubHlQb3NpdGl2ZSA9IGZpbHRlclBhdHRlcm5zKHBvcywgbmVnLCAnJywgZmFsc2UsIG9wdGlvbnMpIHx8IFtdO1xuICBsZXQgaW50ZXJzZWN0ZWQgPSBmaWx0ZXJQYXR0ZXJucyhuZWcsIHBvcywgJy0/JywgdHJ1ZSwgb3B0aW9ucykgfHwgW107XG4gIGxldCBzdWJwYXR0ZXJucyA9IG9ubHlOZWdhdGl2ZS5jb25jYXQoaW50ZXJzZWN0ZWQpLmNvbmNhdChvbmx5UG9zaXRpdmUpO1xuICByZXR1cm4gc3VicGF0dGVybnMuam9pbignfCcpO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUmFuZ2VzKG1pbiwgbWF4KSB7XG4gIGxldCBuaW5lcyA9IDE7XG4gIGxldCB6ZXJvcyA9IDE7XG5cbiAgbGV0IHN0b3AgPSBjb3VudE5pbmVzKG1pbiwgbmluZXMpO1xuICBsZXQgc3RvcHMgPSBuZXcgU2V0KFttYXhdKTtcblxuICB3aGlsZSAobWluIDw9IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgbmluZXMgKz0gMTtcbiAgICBzdG9wID0gY291bnROaW5lcyhtaW4sIG5pbmVzKTtcbiAgfVxuXG4gIHN0b3AgPSBjb3VudFplcm9zKG1heCArIDEsIHplcm9zKSAtIDE7XG5cbiAgd2hpbGUgKG1pbiA8IHN0b3AgJiYgc3RvcCA8PSBtYXgpIHtcbiAgICBzdG9wcy5hZGQoc3RvcCk7XG4gICAgemVyb3MgKz0gMTtcbiAgICBzdG9wID0gY291bnRaZXJvcyhtYXggKyAxLCB6ZXJvcykgLSAxO1xuICB9XG5cbiAgc3RvcHMgPSBbLi4uc3RvcHNdO1xuICBzdG9wcy5zb3J0KGNvbXBhcmUpO1xuICByZXR1cm4gc3RvcHM7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHJhbmdlIHRvIGEgcmVnZXggcGF0dGVyblxuICogQHBhcmFtIHtOdW1iZXJ9IGBzdGFydGBcbiAqIEBwYXJhbSB7TnVtYmVyfSBgc3RvcGBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByYW5nZVRvUGF0dGVybihzdGFydCwgc3RvcCwgb3B0aW9ucykge1xuICBpZiAoc3RhcnQgPT09IHN0b3ApIHtcbiAgICByZXR1cm4geyBwYXR0ZXJuOiBzdGFydCwgY291bnQ6IFtdLCBkaWdpdHM6IDAgfTtcbiAgfVxuXG4gIGxldCB6aXBwZWQgPSB6aXAoc3RhcnQsIHN0b3ApO1xuICBsZXQgZGlnaXRzID0gemlwcGVkLmxlbmd0aDtcbiAgbGV0IHBhdHRlcm4gPSAnJztcbiAgbGV0IGNvdW50ID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZ2l0czsgaSsrKSB7XG4gICAgbGV0IFtzdGFydERpZ2l0LCBzdG9wRGlnaXRdID0gemlwcGVkW2ldO1xuXG4gICAgaWYgKHN0YXJ0RGlnaXQgPT09IHN0b3BEaWdpdCkge1xuICAgICAgcGF0dGVybiArPSBzdGFydERpZ2l0O1xuXG4gICAgfSBlbHNlIGlmIChzdGFydERpZ2l0ICE9PSAnMCcgfHwgc3RvcERpZ2l0ICE9PSAnOScpIHtcbiAgICAgIHBhdHRlcm4gKz0gdG9DaGFyYWN0ZXJDbGFzcyhzdGFydERpZ2l0LCBzdG9wRGlnaXQsIG9wdGlvbnMpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvdW50KSB7XG4gICAgcGF0dGVybiArPSBvcHRpb25zLnNob3J0aGFuZCA9PT0gdHJ1ZSA/ICdcXFxcZCcgOiAnWzAtOV0nO1xuICB9XG5cbiAgcmV0dXJuIHsgcGF0dGVybiwgY291bnQ6IFtjb3VudF0sIGRpZ2l0cyB9O1xufVxuXG5mdW5jdGlvbiBzcGxpdFRvUGF0dGVybnMobWluLCBtYXgsIHRvaywgb3B0aW9ucykge1xuICBsZXQgcmFuZ2VzID0gc3BsaXRUb1JhbmdlcyhtaW4sIG1heCk7XG4gIGxldCB0b2tlbnMgPSBbXTtcbiAgbGV0IHN0YXJ0ID0gbWluO1xuICBsZXQgcHJldjtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBtYXggPSByYW5nZXNbaV07XG4gICAgbGV0IG9iaiA9IHJhbmdlVG9QYXR0ZXJuKFN0cmluZyhzdGFydCksIFN0cmluZyhtYXgpLCBvcHRpb25zKTtcbiAgICBsZXQgemVyb3MgPSAnJztcblxuICAgIGlmICghdG9rLmlzUGFkZGVkICYmIHByZXYgJiYgcHJldi5wYXR0ZXJuID09PSBvYmoucGF0dGVybikge1xuICAgICAgaWYgKHByZXYuY291bnQubGVuZ3RoID4gMSkge1xuICAgICAgICBwcmV2LmNvdW50LnBvcCgpO1xuICAgICAgfVxuXG4gICAgICBwcmV2LmNvdW50LnB1c2gob2JqLmNvdW50WzBdKTtcbiAgICAgIHByZXYuc3RyaW5nID0gcHJldi5wYXR0ZXJuICsgdG9RdWFudGlmaWVyKHByZXYuY291bnQpO1xuICAgICAgc3RhcnQgPSBtYXggKyAxO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHRvay5pc1BhZGRlZCkge1xuICAgICAgemVyb3MgPSBwYWRaZXJvcyhtYXgsIHRvaywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgb2JqLnN0cmluZyA9IHplcm9zICsgb2JqLnBhdHRlcm4gKyB0b1F1YW50aWZpZXIob2JqLmNvdW50KTtcbiAgICB0b2tlbnMucHVzaChvYmopO1xuICAgIHN0YXJ0ID0gbWF4ICsgMTtcbiAgICBwcmV2ID0gb2JqO1xuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn1cblxuZnVuY3Rpb24gZmlsdGVyUGF0dGVybnMoYXJyLCBjb21wYXJpc29uLCBwcmVmaXgsIGludGVyc2VjdGlvbiwgb3B0aW9ucykge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgZm9yIChsZXQgZWxlIG9mIGFycikge1xuICAgIGxldCB7IHN0cmluZyB9ID0gZWxlO1xuXG4gICAgLy8gb25seSBwdXNoIGlmIF9ib3RoXyBhcmUgbmVnYXRpdmUuLi5cbiAgICBpZiAoIWludGVyc2VjdGlvbiAmJiAhY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuXG4gICAgLy8gb3IgX2JvdGhfIGFyZSBwb3NpdGl2ZVxuICAgIGlmIChpbnRlcnNlY3Rpb24gJiYgY29udGFpbnMoY29tcGFyaXNvbiwgJ3N0cmluZycsIHN0cmluZykpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHByZWZpeCArIHN0cmluZyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogWmlwIHN0cmluZ3NcbiAqL1xuXG5mdW5jdGlvbiB6aXAoYSwgYikge1xuICBsZXQgYXJyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykgYXJyLnB1c2goW2FbaV0sIGJbaV1dKTtcbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIHJldHVybiBhID4gYiA/IDEgOiBiID4gYSA/IC0xIDogMDtcbn1cblxuZnVuY3Rpb24gY29udGFpbnMoYXJyLCBrZXksIHZhbCkge1xuICByZXR1cm4gYXJyLnNvbWUoZWxlID0+IGVsZVtrZXldID09PSB2YWwpO1xufVxuXG5mdW5jdGlvbiBjb3VudE5pbmVzKG1pbiwgbGVuKSB7XG4gIHJldHVybiBOdW1iZXIoU3RyaW5nKG1pbikuc2xpY2UoMCwgLWxlbikgKyAnOScucmVwZWF0KGxlbikpO1xufVxuXG5mdW5jdGlvbiBjb3VudFplcm9zKGludGVnZXIsIHplcm9zKSB7XG4gIHJldHVybiBpbnRlZ2VyIC0gKGludGVnZXIgJSBNYXRoLnBvdygxMCwgemVyb3MpKTtcbn1cblxuZnVuY3Rpb24gdG9RdWFudGlmaWVyKGRpZ2l0cykge1xuICBsZXQgW3N0YXJ0ID0gMCwgc3RvcCA9ICcnXSA9IGRpZ2l0cztcbiAgaWYgKHN0b3AgfHwgc3RhcnQgPiAxKSB7XG4gICAgcmV0dXJuIGB7JHtzdGFydCArIChzdG9wID8gJywnICsgc3RvcCA6ICcnKX19YDtcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIHRvQ2hhcmFjdGVyQ2xhc3MoYSwgYiwgb3B0aW9ucykge1xuICByZXR1cm4gYFske2F9JHsoYiAtIGEgPT09IDEpID8gJycgOiAnLSd9JHtifV1gO1xufVxuXG5mdW5jdGlvbiBoYXNQYWRkaW5nKHN0cikge1xuICByZXR1cm4gL14tPygwKylcXGQvLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gcGFkWmVyb3ModmFsdWUsIHRvaywgb3B0aW9ucykge1xuICBpZiAoIXRvay5pc1BhZGRlZCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGxldCBkaWZmID0gTWF0aC5hYnModG9rLm1heExlbiAtIFN0cmluZyh2YWx1ZSkubGVuZ3RoKTtcbiAgbGV0IHJlbGF4ID0gb3B0aW9ucy5yZWxheFplcm9zICE9PSBmYWxzZTtcblxuICBzd2l0Y2ggKGRpZmYpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gJyc7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHJlbGF4ID8gJzA/JyA6ICcwJztcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gcmVsYXggPyAnMHswLDJ9JyA6ICcwMCc7XG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuIHJlbGF4ID8gYDB7MCwke2RpZmZ9fWAgOiBgMHske2RpZmZ9fWA7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2FjaGVcbiAqL1xuXG50b1JlZ2V4UmFuZ2UuY2FjaGUgPSB7fTtcbnRvUmVnZXhSYW5nZS5jbGVhckNhY2hlID0gKCkgPT4gKHRvUmVnZXhSYW5nZS5jYWNoZSA9IHt9KTtcblxuLyoqXG4gKiBFeHBvc2UgYHRvUmVnZXhSYW5nZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvUmVnZXhSYW5nZTtcbiIsIi8qIVxuICogZmlsbC1yYW5nZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvZmlsbC1yYW5nZT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgdG9SZWdleFJhbmdlID0gcmVxdWlyZSgndG8tcmVnZXgtcmFuZ2UnKTtcblxuY29uc3QgaXNPYmplY3QgPSB2YWwgPT4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbCk7XG5cbmNvbnN0IHRyYW5zZm9ybSA9IHRvTnVtYmVyID0+IHtcbiAgcmV0dXJuIHZhbHVlID0+IHRvTnVtYmVyID09PSB0cnVlID8gTnVtYmVyKHZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG59O1xuXG5jb25zdCBpc1ZhbGlkVmFsdWUgPSB2YWx1ZSA9PiB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8ICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlICE9PSAnJyk7XG59O1xuXG5jb25zdCBpc051bWJlciA9IG51bSA9PiBOdW1iZXIuaXNJbnRlZ2VyKCtudW0pO1xuXG5jb25zdCB6ZXJvcyA9IGlucHV0ID0+IHtcbiAgbGV0IHZhbHVlID0gYCR7aW5wdXR9YDtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGlmICh2YWx1ZVswXSA9PT0gJy0nKSB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEpO1xuICBpZiAodmFsdWUgPT09ICcwJykgcmV0dXJuIGZhbHNlO1xuICB3aGlsZSAodmFsdWVbKytpbmRleF0gPT09ICcwJyk7XG4gIHJldHVybiBpbmRleCA+IDA7XG59O1xuXG5jb25zdCBzdHJpbmdpZnkgPSAoc3RhcnQsIGVuZCwgb3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBvcHRpb25zLnN0cmluZ2lmeSA9PT0gdHJ1ZTtcbn07XG5cbmNvbnN0IHBhZCA9IChpbnB1dCwgbWF4TGVuZ3RoLCB0b051bWJlcikgPT4ge1xuICBpZiAobWF4TGVuZ3RoID4gMCkge1xuICAgIGxldCBkYXNoID0gaW5wdXRbMF0gPT09ICctJyA/ICctJyA6ICcnO1xuICAgIGlmIChkYXNoKSBpbnB1dCA9IGlucHV0LnNsaWNlKDEpO1xuICAgIGlucHV0ID0gKGRhc2ggKyBpbnB1dC5wYWRTdGFydChkYXNoID8gbWF4TGVuZ3RoIC0gMSA6IG1heExlbmd0aCwgJzAnKSk7XG4gIH1cbiAgaWYgKHRvTnVtYmVyID09PSBmYWxzZSkge1xuICAgIHJldHVybiBTdHJpbmcoaW5wdXQpO1xuICB9XG4gIHJldHVybiBpbnB1dDtcbn07XG5cbmNvbnN0IHRvTWF4TGVuID0gKGlucHV0LCBtYXhMZW5ndGgpID0+IHtcbiAgbGV0IG5lZ2F0aXZlID0gaW5wdXRbMF0gPT09ICctJyA/ICctJyA6ICcnO1xuICBpZiAobmVnYXRpdmUpIHtcbiAgICBpbnB1dCA9IGlucHV0LnNsaWNlKDEpO1xuICAgIG1heExlbmd0aC0tO1xuICB9XG4gIHdoaWxlIChpbnB1dC5sZW5ndGggPCBtYXhMZW5ndGgpIGlucHV0ID0gJzAnICsgaW5wdXQ7XG4gIHJldHVybiBuZWdhdGl2ZSA/ICgnLScgKyBpbnB1dCkgOiBpbnB1dDtcbn07XG5cbmNvbnN0IHRvU2VxdWVuY2UgPSAocGFydHMsIG9wdGlvbnMpID0+IHtcbiAgcGFydHMubmVnYXRpdmVzLnNvcnQoKGEsIGIpID0+IGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwKTtcbiAgcGFydHMucG9zaXRpdmVzLnNvcnQoKGEsIGIpID0+IGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwKTtcblxuICBsZXQgcHJlZml4ID0gb3B0aW9ucy5jYXB0dXJlID8gJycgOiAnPzonO1xuICBsZXQgcG9zaXRpdmVzID0gJyc7XG4gIGxldCBuZWdhdGl2ZXMgPSAnJztcbiAgbGV0IHJlc3VsdDtcblxuICBpZiAocGFydHMucG9zaXRpdmVzLmxlbmd0aCkge1xuICAgIHBvc2l0aXZlcyA9IHBhcnRzLnBvc2l0aXZlcy5qb2luKCd8Jyk7XG4gIH1cblxuICBpZiAocGFydHMubmVnYXRpdmVzLmxlbmd0aCkge1xuICAgIG5lZ2F0aXZlcyA9IGAtKCR7cHJlZml4fSR7cGFydHMubmVnYXRpdmVzLmpvaW4oJ3wnKX0pYDtcbiAgfVxuXG4gIGlmIChwb3NpdGl2ZXMgJiYgbmVnYXRpdmVzKSB7XG4gICAgcmVzdWx0ID0gYCR7cG9zaXRpdmVzfXwke25lZ2F0aXZlc31gO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHBvc2l0aXZlcyB8fCBuZWdhdGl2ZXM7XG4gIH1cblxuICBpZiAob3B0aW9ucy53cmFwKSB7XG4gICAgcmV0dXJuIGAoJHtwcmVmaXh9JHtyZXN1bHR9KWA7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuY29uc3QgdG9SYW5nZSA9IChhLCBiLCBpc051bWJlcnMsIG9wdGlvbnMpID0+IHtcbiAgaWYgKGlzTnVtYmVycykge1xuICAgIHJldHVybiB0b1JlZ2V4UmFuZ2UoYSwgYiwgeyB3cmFwOiBmYWxzZSwgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIGxldCBzdGFydCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYSk7XG4gIGlmIChhID09PSBiKSByZXR1cm4gc3RhcnQ7XG5cbiAgbGV0IHN0b3AgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGIpO1xuICByZXR1cm4gYFske3N0YXJ0fS0ke3N0b3B9XWA7XG59O1xuXG5jb25zdCB0b1JlZ2V4ID0gKHN0YXJ0LCBlbmQsIG9wdGlvbnMpID0+IHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RhcnQpKSB7XG4gICAgbGV0IHdyYXAgPSBvcHRpb25zLndyYXAgPT09IHRydWU7XG4gICAgbGV0IHByZWZpeCA9IG9wdGlvbnMuY2FwdHVyZSA/ICcnIDogJz86JztcbiAgICByZXR1cm4gd3JhcCA/IGAoJHtwcmVmaXh9JHtzdGFydC5qb2luKCd8Jyl9KWAgOiBzdGFydC5qb2luKCd8Jyk7XG4gIH1cbiAgcmV0dXJuIHRvUmVnZXhSYW5nZShzdGFydCwgZW5kLCBvcHRpb25zKTtcbn07XG5cbmNvbnN0IHJhbmdlRXJyb3IgPSAoLi4uYXJncykgPT4ge1xuICByZXR1cm4gbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgcmFuZ2UgYXJndW1lbnRzOiAnICsgdXRpbC5pbnNwZWN0KC4uLmFyZ3MpKTtcbn07XG5cbmNvbnN0IGludmFsaWRSYW5nZSA9IChzdGFydCwgZW5kLCBvcHRpb25zKSA9PiB7XG4gIGlmIChvcHRpb25zLnN0cmljdFJhbmdlcyA9PT0gdHJ1ZSkgdGhyb3cgcmFuZ2VFcnJvcihbc3RhcnQsIGVuZF0pO1xuICByZXR1cm4gW107XG59O1xuXG5jb25zdCBpbnZhbGlkU3RlcCA9IChzdGVwLCBvcHRpb25zKSA9PiB7XG4gIGlmIChvcHRpb25zLnN0cmljdFJhbmdlcyA9PT0gdHJ1ZSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIHN0ZXAgXCIke3N0ZXB9XCIgdG8gYmUgYSBudW1iZXJgKTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5jb25zdCBmaWxsTnVtYmVycyA9IChzdGFydCwgZW5kLCBzdGVwID0gMSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCBhID0gTnVtYmVyKHN0YXJ0KTtcbiAgbGV0IGIgPSBOdW1iZXIoZW5kKTtcblxuICBpZiAoIU51bWJlci5pc0ludGVnZXIoYSkgfHwgIU51bWJlci5pc0ludGVnZXIoYikpIHtcbiAgICBpZiAob3B0aW9ucy5zdHJpY3RSYW5nZXMgPT09IHRydWUpIHRocm93IHJhbmdlRXJyb3IoW3N0YXJ0LCBlbmRdKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBmaXggbmVnYXRpdmUgemVyb1xuICBpZiAoYSA9PT0gMCkgYSA9IDA7XG4gIGlmIChiID09PSAwKSBiID0gMDtcblxuICBsZXQgZGVzY2VuZGluZyA9IGEgPiBiO1xuICBsZXQgc3RhcnRTdHJpbmcgPSBTdHJpbmcoc3RhcnQpO1xuICBsZXQgZW5kU3RyaW5nID0gU3RyaW5nKGVuZCk7XG4gIGxldCBzdGVwU3RyaW5nID0gU3RyaW5nKHN0ZXApO1xuICBzdGVwID0gTWF0aC5tYXgoTWF0aC5hYnMoc3RlcCksIDEpO1xuXG4gIGxldCBwYWRkZWQgPSB6ZXJvcyhzdGFydFN0cmluZykgfHwgemVyb3MoZW5kU3RyaW5nKSB8fCB6ZXJvcyhzdGVwU3RyaW5nKTtcbiAgbGV0IG1heExlbiA9IHBhZGRlZCA/IE1hdGgubWF4KHN0YXJ0U3RyaW5nLmxlbmd0aCwgZW5kU3RyaW5nLmxlbmd0aCwgc3RlcFN0cmluZy5sZW5ndGgpIDogMDtcbiAgbGV0IHRvTnVtYmVyID0gcGFkZGVkID09PSBmYWxzZSAmJiBzdHJpbmdpZnkoc3RhcnQsIGVuZCwgb3B0aW9ucykgPT09IGZhbHNlO1xuICBsZXQgZm9ybWF0ID0gb3B0aW9ucy50cmFuc2Zvcm0gfHwgdHJhbnNmb3JtKHRvTnVtYmVyKTtcblxuICBpZiAob3B0aW9ucy50b1JlZ2V4ICYmIHN0ZXAgPT09IDEpIHtcbiAgICByZXR1cm4gdG9SYW5nZSh0b01heExlbihzdGFydCwgbWF4TGVuKSwgdG9NYXhMZW4oZW5kLCBtYXhMZW4pLCB0cnVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGxldCBwYXJ0cyA9IHsgbmVnYXRpdmVzOiBbXSwgcG9zaXRpdmVzOiBbXSB9O1xuICBsZXQgcHVzaCA9IG51bSA9PiBwYXJ0c1tudW0gPCAwID8gJ25lZ2F0aXZlcycgOiAncG9zaXRpdmVzJ10ucHVzaChNYXRoLmFicyhudW0pKTtcbiAgbGV0IHJhbmdlID0gW107XG4gIGxldCBpbmRleCA9IDA7XG5cbiAgd2hpbGUgKGRlc2NlbmRpbmcgPyBhID49IGIgOiBhIDw9IGIpIHtcbiAgICBpZiAob3B0aW9ucy50b1JlZ2V4ID09PSB0cnVlICYmIHN0ZXAgPiAxKSB7XG4gICAgICBwdXNoKGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZS5wdXNoKHBhZChmb3JtYXQoYSwgaW5kZXgpLCBtYXhMZW4sIHRvTnVtYmVyKSk7XG4gICAgfVxuICAgIGEgPSBkZXNjZW5kaW5nID8gYSAtIHN0ZXAgOiBhICsgc3RlcDtcbiAgICBpbmRleCsrO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMudG9SZWdleCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBzdGVwID4gMVxuICAgICAgPyB0b1NlcXVlbmNlKHBhcnRzLCBvcHRpb25zKVxuICAgICAgOiB0b1JlZ2V4KHJhbmdlLCBudWxsLCB7IHdyYXA6IGZhbHNlLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJhbmdlO1xufTtcblxuY29uc3QgZmlsbExldHRlcnMgPSAoc3RhcnQsIGVuZCwgc3RlcCA9IDEsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAoKCFpc051bWJlcihzdGFydCkgJiYgc3RhcnQubGVuZ3RoID4gMSkgfHwgKCFpc051bWJlcihlbmQpICYmIGVuZC5sZW5ndGggPiAxKSkge1xuICAgIHJldHVybiBpbnZhbGlkUmFuZ2Uoc3RhcnQsIGVuZCwgb3B0aW9ucyk7XG4gIH1cblxuXG4gIGxldCBmb3JtYXQgPSBvcHRpb25zLnRyYW5zZm9ybSB8fCAodmFsID0+IFN0cmluZy5mcm9tQ2hhckNvZGUodmFsKSk7XG4gIGxldCBhID0gYCR7c3RhcnR9YC5jaGFyQ29kZUF0KDApO1xuICBsZXQgYiA9IGAke2VuZH1gLmNoYXJDb2RlQXQoMCk7XG5cbiAgbGV0IGRlc2NlbmRpbmcgPSBhID4gYjtcbiAgbGV0IG1pbiA9IE1hdGgubWluKGEsIGIpO1xuICBsZXQgbWF4ID0gTWF0aC5tYXgoYSwgYik7XG5cbiAgaWYgKG9wdGlvbnMudG9SZWdleCAmJiBzdGVwID09PSAxKSB7XG4gICAgcmV0dXJuIHRvUmFuZ2UobWluLCBtYXgsIGZhbHNlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGxldCByYW5nZSA9IFtdO1xuICBsZXQgaW5kZXggPSAwO1xuXG4gIHdoaWxlIChkZXNjZW5kaW5nID8gYSA+PSBiIDogYSA8PSBiKSB7XG4gICAgcmFuZ2UucHVzaChmb3JtYXQoYSwgaW5kZXgpKTtcbiAgICBhID0gZGVzY2VuZGluZyA/IGEgLSBzdGVwIDogYSArIHN0ZXA7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIGlmIChvcHRpb25zLnRvUmVnZXggPT09IHRydWUpIHtcbiAgICByZXR1cm4gdG9SZWdleChyYW5nZSwgbnVsbCwgeyB3cmFwOiBmYWxzZSwgb3B0aW9ucyB9KTtcbiAgfVxuXG4gIHJldHVybiByYW5nZTtcbn07XG5cbmNvbnN0IGZpbGwgPSAoc3RhcnQsIGVuZCwgc3RlcCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmIChlbmQgPT0gbnVsbCAmJiBpc1ZhbGlkVmFsdWUoc3RhcnQpKSB7XG4gICAgcmV0dXJuIFtzdGFydF07XG4gIH1cblxuICBpZiAoIWlzVmFsaWRWYWx1ZShzdGFydCkgfHwgIWlzVmFsaWRWYWx1ZShlbmQpKSB7XG4gICAgcmV0dXJuIGludmFsaWRSYW5nZShzdGFydCwgZW5kLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc3RlcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmaWxsKHN0YXJ0LCBlbmQsIDEsIHsgdHJhbnNmb3JtOiBzdGVwIH0pO1xuICB9XG5cbiAgaWYgKGlzT2JqZWN0KHN0ZXApKSB7XG4gICAgcmV0dXJuIGZpbGwoc3RhcnQsIGVuZCwgMCwgc3RlcCk7XG4gIH1cblxuICBsZXQgb3B0cyA9IHsgLi4ub3B0aW9ucyB9O1xuICBpZiAob3B0cy5jYXB0dXJlID09PSB0cnVlKSBvcHRzLndyYXAgPSB0cnVlO1xuICBzdGVwID0gc3RlcCB8fCBvcHRzLnN0ZXAgfHwgMTtcblxuICBpZiAoIWlzTnVtYmVyKHN0ZXApKSB7XG4gICAgaWYgKHN0ZXAgIT0gbnVsbCAmJiAhaXNPYmplY3Qoc3RlcCkpIHJldHVybiBpbnZhbGlkU3RlcChzdGVwLCBvcHRzKTtcbiAgICByZXR1cm4gZmlsbChzdGFydCwgZW5kLCAxLCBzdGVwKTtcbiAgfVxuXG4gIGlmIChpc051bWJlcihzdGFydCkgJiYgaXNOdW1iZXIoZW5kKSkge1xuICAgIHJldHVybiBmaWxsTnVtYmVycyhzdGFydCwgZW5kLCBzdGVwLCBvcHRzKTtcbiAgfVxuXG4gIHJldHVybiBmaWxsTGV0dGVycyhzdGFydCwgZW5kLCBNYXRoLm1heChNYXRoLmFicyhzdGVwKSwgMSksIG9wdHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBmaWxsID0gcmVxdWlyZSgnZmlsbC1yYW5nZScpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmNvbnN0IGNvbXBpbGUgPSAoYXN0LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IHdhbGsgPSAobm9kZSwgcGFyZW50ID0ge30pID0+IHtcbiAgICBsZXQgaW52YWxpZEJsb2NrID0gdXRpbHMuaXNJbnZhbGlkQnJhY2UocGFyZW50KTtcbiAgICBsZXQgaW52YWxpZE5vZGUgPSBub2RlLmludmFsaWQgPT09IHRydWUgJiYgb3B0aW9ucy5lc2NhcGVJbnZhbGlkID09PSB0cnVlO1xuICAgIGxldCBpbnZhbGlkID0gaW52YWxpZEJsb2NrID09PSB0cnVlIHx8IGludmFsaWROb2RlID09PSB0cnVlO1xuICAgIGxldCBwcmVmaXggPSBvcHRpb25zLmVzY2FwZUludmFsaWQgPT09IHRydWUgPyAnXFxcXCcgOiAnJztcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG5cbiAgICBpZiAobm9kZS5pc09wZW4gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyBub2RlLnZhbHVlO1xuICAgIH1cbiAgICBpZiAobm9kZS5pc0Nsb3NlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgbm9kZS52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS50eXBlID09PSAnb3BlbicpIHtcbiAgICAgIHJldHVybiBpbnZhbGlkID8gKHByZWZpeCArIG5vZGUudmFsdWUpIDogJygnO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdjbG9zZScpIHtcbiAgICAgIHJldHVybiBpbnZhbGlkID8gKHByZWZpeCArIG5vZGUudmFsdWUpIDogJyknO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdjb21tYScpIHtcbiAgICAgIHJldHVybiBub2RlLnByZXYudHlwZSA9PT0gJ2NvbW1hJyA/ICcnIDogKGludmFsaWQgPyBub2RlLnZhbHVlIDogJ3wnKTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS52YWx1ZSkge1xuICAgICAgcmV0dXJuIG5vZGUudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZXMgJiYgbm9kZS5yYW5nZXMgPiAwKSB7XG4gICAgICBsZXQgYXJncyA9IHV0aWxzLnJlZHVjZShub2RlLm5vZGVzKTtcbiAgICAgIGxldCByYW5nZSA9IGZpbGwoLi4uYXJncywgeyAuLi5vcHRpb25zLCB3cmFwOiBmYWxzZSwgdG9SZWdleDogdHJ1ZSB9KTtcblxuICAgICAgaWYgKHJhbmdlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICByZXR1cm4gYXJncy5sZW5ndGggPiAxICYmIHJhbmdlLmxlbmd0aCA+IDEgPyBgKCR7cmFuZ2V9KWAgOiByYW5nZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZS5ub2Rlcykge1xuICAgICAgZm9yIChsZXQgY2hpbGQgb2Ygbm9kZS5ub2Rlcykge1xuICAgICAgICBvdXRwdXQgKz0gd2FsayhjaGlsZCwgbm9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmV0dXJuIHdhbGsoYXN0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZmlsbCA9IHJlcXVpcmUoJ2ZpbGwtcmFuZ2UnKTtcbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuY29uc3QgYXBwZW5kID0gKHF1ZXVlID0gJycsIHN0YXNoID0gJycsIGVuY2xvc2UgPSBmYWxzZSkgPT4ge1xuICBsZXQgcmVzdWx0ID0gW107XG5cbiAgcXVldWUgPSBbXS5jb25jYXQocXVldWUpO1xuICBzdGFzaCA9IFtdLmNvbmNhdChzdGFzaCk7XG5cbiAgaWYgKCFzdGFzaC5sZW5ndGgpIHJldHVybiBxdWV1ZTtcbiAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZW5jbG9zZSA/IHV0aWxzLmZsYXR0ZW4oc3Rhc2gpLm1hcChlbGUgPT4gYHske2VsZX19YCkgOiBzdGFzaDtcbiAgfVxuXG4gIGZvciAobGV0IGl0ZW0gb2YgcXVldWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChhcHBlbmQodmFsdWUsIHN0YXNoLCBlbmNsb3NlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGVsZSBvZiBzdGFzaCkge1xuICAgICAgICBpZiAoZW5jbG9zZSA9PT0gdHJ1ZSAmJiB0eXBlb2YgZWxlID09PSAnc3RyaW5nJykgZWxlID0gYHske2VsZX19YDtcbiAgICAgICAgcmVzdWx0LnB1c2goQXJyYXkuaXNBcnJheShlbGUpID8gYXBwZW5kKGl0ZW0sIGVsZSwgZW5jbG9zZSkgOiAoaXRlbSArIGVsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdXRpbHMuZmxhdHRlbihyZXN1bHQpO1xufTtcblxuY29uc3QgZXhwYW5kID0gKGFzdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCByYW5nZUxpbWl0ID0gb3B0aW9ucy5yYW5nZUxpbWl0ID09PSB2b2lkIDAgPyAxMDAwIDogb3B0aW9ucy5yYW5nZUxpbWl0O1xuXG4gIGxldCB3YWxrID0gKG5vZGUsIHBhcmVudCA9IHt9KSA9PiB7XG4gICAgbm9kZS5xdWV1ZSA9IFtdO1xuXG4gICAgbGV0IHAgPSBwYXJlbnQ7XG4gICAgbGV0IHEgPSBwYXJlbnQucXVldWU7XG5cbiAgICB3aGlsZSAocC50eXBlICE9PSAnYnJhY2UnICYmIHAudHlwZSAhPT0gJ3Jvb3QnICYmIHAucGFyZW50KSB7XG4gICAgICBwID0gcC5wYXJlbnQ7XG4gICAgICBxID0gcC5xdWV1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5pbnZhbGlkIHx8IG5vZGUuZG9sbGFyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHN0cmluZ2lmeShub2RlLCBvcHRpb25zKSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLnR5cGUgPT09ICdicmFjZScgJiYgbm9kZS5pbnZhbGlkICE9PSB0cnVlICYmIG5vZGUubm9kZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIFsne30nXSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGVzICYmIG5vZGUucmFuZ2VzID4gMCkge1xuICAgICAgbGV0IGFyZ3MgPSB1dGlscy5yZWR1Y2Uobm9kZS5ub2Rlcyk7XG5cbiAgICAgIGlmICh1dGlscy5leGNlZWRzTGltaXQoLi4uYXJncywgb3B0aW9ucy5zdGVwLCByYW5nZUxpbWl0KSkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZXhwYW5kZWQgYXJyYXkgbGVuZ3RoIGV4Y2VlZHMgcmFuZ2UgbGltaXQuIFVzZSBvcHRpb25zLnJhbmdlTGltaXQgdG8gaW5jcmVhc2Ugb3IgZGlzYWJsZSB0aGUgbGltaXQuJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCByYW5nZSA9IGZpbGwoLi4uYXJncywgb3B0aW9ucyk7XG4gICAgICBpZiAocmFuZ2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJhbmdlID0gc3RyaW5naWZ5KG5vZGUsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHJhbmdlKSk7XG4gICAgICBub2RlLm5vZGVzID0gW107XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVuY2xvc2UgPSB1dGlscy5lbmNsb3NlQnJhY2Uobm9kZSk7XG4gICAgbGV0IHF1ZXVlID0gbm9kZS5xdWV1ZTtcbiAgICBsZXQgYmxvY2sgPSBub2RlO1xuXG4gICAgd2hpbGUgKGJsb2NrLnR5cGUgIT09ICdicmFjZScgJiYgYmxvY2sudHlwZSAhPT0gJ3Jvb3QnICYmIGJsb2NrLnBhcmVudCkge1xuICAgICAgYmxvY2sgPSBibG9jay5wYXJlbnQ7XG4gICAgICBxdWV1ZSA9IGJsb2NrLnF1ZXVlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNoaWxkID0gbm9kZS5ub2Rlc1tpXTtcblxuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdjb21tYScgJiYgbm9kZS50eXBlID09PSAnYnJhY2UnKSB7XG4gICAgICAgIGlmIChpID09PSAxKSBxdWV1ZS5wdXNoKCcnKTtcbiAgICAgICAgcXVldWUucHVzaCgnJyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgICBxLnB1c2goYXBwZW5kKHEucG9wKCksIHF1ZXVlLCBlbmNsb3NlKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQudmFsdWUgJiYgY2hpbGQudHlwZSAhPT0gJ29wZW4nKSB7XG4gICAgICAgIHF1ZXVlLnB1c2goYXBwZW5kKHF1ZXVlLnBvcCgpLCBjaGlsZC52YWx1ZSkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLm5vZGVzKSB7XG4gICAgICAgIHdhbGsoY2hpbGQsIG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBxdWV1ZTtcbiAgfTtcblxuICByZXR1cm4gdXRpbHMuZmxhdHRlbih3YWxrKGFzdCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBhbmQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNQVhfTEVOR1RIOiAxMDI0ICogNjQsXG5cbiAgLy8gRGlnaXRzXG4gIENIQVJfMDogJzAnLCAvKiAwICovXG4gIENIQVJfOTogJzknLCAvKiA5ICovXG5cbiAgLy8gQWxwaGFiZXQgY2hhcnMuXG4gIENIQVJfVVBQRVJDQVNFX0E6ICdBJywgLyogQSAqL1xuICBDSEFSX0xPV0VSQ0FTRV9BOiAnYScsIC8qIGEgKi9cbiAgQ0hBUl9VUFBFUkNBU0VfWjogJ1onLCAvKiBaICovXG4gIENIQVJfTE9XRVJDQVNFX1o6ICd6JywgLyogeiAqL1xuXG4gIENIQVJfTEVGVF9QQVJFTlRIRVNFUzogJygnLCAvKiAoICovXG4gIENIQVJfUklHSFRfUEFSRU5USEVTRVM6ICcpJywgLyogKSAqL1xuXG4gIENIQVJfQVNURVJJU0s6ICcqJywgLyogKiAqL1xuXG4gIC8vIE5vbi1hbHBoYWJldGljIGNoYXJzLlxuICBDSEFSX0FNUEVSU0FORDogJyYnLCAvKiAmICovXG4gIENIQVJfQVQ6ICdAJywgLyogQCAqL1xuICBDSEFSX0JBQ0tTTEFTSDogJ1xcXFwnLCAvKiBcXCAqL1xuICBDSEFSX0JBQ0tUSUNLOiAnYCcsIC8qIGAgKi9cbiAgQ0hBUl9DQVJSSUFHRV9SRVRVUk46ICdcXHInLCAvKiBcXHIgKi9cbiAgQ0hBUl9DSVJDVU1GTEVYX0FDQ0VOVDogJ14nLCAvKiBeICovXG4gIENIQVJfQ09MT046ICc6JywgLyogOiAqL1xuICBDSEFSX0NPTU1BOiAnLCcsIC8qICwgKi9cbiAgQ0hBUl9ET0xMQVI6ICckJywgLyogLiAqL1xuICBDSEFSX0RPVDogJy4nLCAvKiAuICovXG4gIENIQVJfRE9VQkxFX1FVT1RFOiAnXCInLCAvKiBcIiAqL1xuICBDSEFSX0VRVUFMOiAnPScsIC8qID0gKi9cbiAgQ0hBUl9FWENMQU1BVElPTl9NQVJLOiAnIScsIC8qICEgKi9cbiAgQ0hBUl9GT1JNX0ZFRUQ6ICdcXGYnLCAvKiBcXGYgKi9cbiAgQ0hBUl9GT1JXQVJEX1NMQVNIOiAnLycsIC8qIC8gKi9cbiAgQ0hBUl9IQVNIOiAnIycsIC8qICMgKi9cbiAgQ0hBUl9IWVBIRU5fTUlOVVM6ICctJywgLyogLSAqL1xuICBDSEFSX0xFRlRfQU5HTEVfQlJBQ0tFVDogJzwnLCAvKiA8ICovXG4gIENIQVJfTEVGVF9DVVJMWV9CUkFDRTogJ3snLCAvKiB7ICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVDogJ1snLCAvKiBbICovXG4gIENIQVJfTElORV9GRUVEOiAnXFxuJywgLyogXFxuICovXG4gIENIQVJfTk9fQlJFQUtfU1BBQ0U6ICdcXHUwMEEwJywgLyogXFx1MDBBMCAqL1xuICBDSEFSX1BFUkNFTlQ6ICclJywgLyogJSAqL1xuICBDSEFSX1BMVVM6ICcrJywgLyogKyAqL1xuICBDSEFSX1FVRVNUSU9OX01BUks6ICc/JywgLyogPyAqL1xuICBDSEFSX1JJR0hUX0FOR0xFX0JSQUNLRVQ6ICc+JywgLyogPiAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFOiAnfScsIC8qIH0gKi9cbiAgQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVDogJ10nLCAvKiBdICovXG4gIENIQVJfU0VNSUNPTE9OOiAnOycsIC8qIDsgKi9cbiAgQ0hBUl9TSU5HTEVfUVVPVEU6ICdcXCcnLCAvKiAnICovXG4gIENIQVJfU1BBQ0U6ICcgJywgLyogICAqL1xuICBDSEFSX1RBQjogJ1xcdCcsIC8qIFxcdCAqL1xuICBDSEFSX1VOREVSU0NPUkU6ICdfJywgLyogXyAqL1xuICBDSEFSX1ZFUlRJQ0FMX0xJTkU6ICd8JywgLyogfCAqL1xuICBDSEFSX1pFUk9fV0lEVEhfTk9CUkVBS19TUEFDRTogJ1xcdUZFRkYnIC8qIFxcdUZFRkYgKi9cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5Jyk7XG5cbi8qKlxuICogQ29uc3RhbnRzXG4gKi9cblxuY29uc3Qge1xuICBNQVhfTEVOR1RILFxuICBDSEFSX0JBQ0tTTEFTSCwgLyogXFwgKi9cbiAgQ0hBUl9CQUNLVElDSywgLyogYCAqL1xuICBDSEFSX0NPTU1BLCAvKiAsICovXG4gIENIQVJfRE9ULCAvKiAuICovXG4gIENIQVJfTEVGVF9QQVJFTlRIRVNFUywgLyogKCAqL1xuICBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTLCAvKiApICovXG4gIENIQVJfTEVGVF9DVVJMWV9CUkFDRSwgLyogeyAqL1xuICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNFLCAvKiB9ICovXG4gIENIQVJfTEVGVF9TUVVBUkVfQlJBQ0tFVCwgLyogWyAqL1xuICBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VULCAvKiBdICovXG4gIENIQVJfRE9VQkxFX1FVT1RFLCAvKiBcIiAqL1xuICBDSEFSX1NJTkdMRV9RVU9URSwgLyogJyAqL1xuICBDSEFSX05PX0JSRUFLX1NQQUNFLFxuICBDSEFSX1pFUk9fV0lEVEhfTk9CUkVBS19TUEFDRVxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbi8qKlxuICogcGFyc2VcbiAqL1xuXG5jb25zdCBwYXJzZSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgbGV0IG1heCA9IHR5cGVvZiBvcHRzLm1heExlbmd0aCA9PT0gJ251bWJlcicgPyBNYXRoLm1pbihNQVhfTEVOR1RILCBvcHRzLm1heExlbmd0aCkgOiBNQVhfTEVOR1RIO1xuICBpZiAoaW5wdXQubGVuZ3RoID4gbWF4KSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBJbnB1dCBsZW5ndGggKCR7aW5wdXQubGVuZ3RofSksIGV4Y2VlZHMgbWF4IGNoYXJhY3RlcnMgKCR7bWF4fSlgKTtcbiAgfVxuXG4gIGxldCBhc3QgPSB7IHR5cGU6ICdyb290JywgaW5wdXQsIG5vZGVzOiBbXSB9O1xuICBsZXQgc3RhY2sgPSBbYXN0XTtcbiAgbGV0IGJsb2NrID0gYXN0O1xuICBsZXQgcHJldiA9IGFzdDtcbiAgbGV0IGJyYWNrZXRzID0gMDtcbiAgbGV0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IGRlcHRoID0gMDtcbiAgbGV0IHZhbHVlO1xuICBsZXQgbWVtbyA9IHt9O1xuXG4gIC8qKlxuICAgKiBIZWxwZXJzXG4gICAqL1xuXG4gIGNvbnN0IGFkdmFuY2UgPSAoKSA9PiBpbnB1dFtpbmRleCsrXTtcbiAgY29uc3QgcHVzaCA9IG5vZGUgPT4ge1xuICAgIGlmIChub2RlLnR5cGUgPT09ICd0ZXh0JyAmJiBwcmV2LnR5cGUgPT09ICdkb3QnKSB7XG4gICAgICBwcmV2LnR5cGUgPSAndGV4dCc7XG4gICAgfVxuXG4gICAgaWYgKHByZXYgJiYgcHJldi50eXBlID09PSAndGV4dCcgJiYgbm9kZS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIHByZXYudmFsdWUgKz0gbm9kZS52YWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBibG9jay5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIG5vZGUucGFyZW50ID0gYmxvY2s7XG4gICAgbm9kZS5wcmV2ID0gcHJldjtcbiAgICBwcmV2ID0gbm9kZTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcblxuICBwdXNoKHsgdHlwZTogJ2JvcycgfSk7XG5cbiAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgYmxvY2sgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICB2YWx1ZSA9IGFkdmFuY2UoKTtcblxuICAgIC8qKlxuICAgICAqIEludmFsaWQgY2hhcnNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9aRVJPX1dJRFRIX05PQlJFQUtfU1BBQ0UgfHwgdmFsdWUgPT09IENIQVJfTk9fQlJFQUtfU1BBQ0UpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVzY2FwZWQgY2hhcnNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9CQUNLU0xBU0gpIHtcbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlOiAob3B0aW9ucy5rZWVwRXNjYXBpbmcgPyB2YWx1ZSA6ICcnKSArIGFkdmFuY2UoKSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJpZ2h0IHNxdWFyZSBicmFja2V0IChsaXRlcmFsKTogJ10nXG4gICAgICovXG5cbiAgICBpZiAodmFsdWUgPT09IENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlOiAnXFxcXCcgKyB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExlZnQgc3F1YXJlIGJyYWNrZXQ6ICdbJ1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQpIHtcbiAgICAgIGJyYWNrZXRzKys7XG5cbiAgICAgIGxldCBjbG9zZWQgPSB0cnVlO1xuICAgICAgbGV0IG5leHQ7XG5cbiAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCAmJiAobmV4dCA9IGFkdmFuY2UoKSkpIHtcbiAgICAgICAgdmFsdWUgKz0gbmV4dDtcblxuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICAgICAgYnJhY2tldHMrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX0JBQ0tTTEFTSCkge1xuICAgICAgICAgIHZhbHVlICs9IGFkdmFuY2UoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0ID09PSBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUKSB7XG4gICAgICAgICAgYnJhY2tldHMtLTtcblxuICAgICAgICAgIGlmIChicmFja2V0cyA9PT0gMCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyZW50aGVzZXNcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9MRUZUX1BBUkVOVEhFU0VTKSB7XG4gICAgICBibG9jayA9IHB1c2goeyB0eXBlOiAncGFyZW4nLCBub2RlczogW10gfSk7XG4gICAgICBzdGFjay5wdXNoKGJsb2NrKTtcbiAgICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX1JJR0hUX1BBUkVOVEhFU0VTKSB7XG4gICAgICBpZiAoYmxvY2sudHlwZSAhPT0gJ3BhcmVuJykge1xuICAgICAgICBwdXNoKHsgdHlwZTogJ3RleHQnLCB2YWx1ZSB9KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBibG9jayA9IHN0YWNrLnBvcCgpO1xuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBibG9jayA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVvdGVzOiAnfFwifGBcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9ET1VCTEVfUVVPVEUgfHwgdmFsdWUgPT09IENIQVJfU0lOR0xFX1FVT1RFIHx8IHZhbHVlID09PSBDSEFSX0JBQ0tUSUNLKSB7XG4gICAgICBsZXQgb3BlbiA9IHZhbHVlO1xuICAgICAgbGV0IG5leHQ7XG5cbiAgICAgIGlmIChvcHRpb25zLmtlZXBRdW90ZXMgIT09IHRydWUpIHtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoICYmIChuZXh0ID0gYWR2YW5jZSgpKSkge1xuICAgICAgICBpZiAobmV4dCA9PT0gQ0hBUl9CQUNLU0xBU0gpIHtcbiAgICAgICAgICB2YWx1ZSArPSBuZXh0ICsgYWR2YW5jZSgpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IG9wZW4pIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5rZWVwUXVvdGVzID09PSB0cnVlKSB2YWx1ZSArPSBuZXh0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgKz0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMZWZ0IGN1cmx5IGJyYWNlOiAneydcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9MRUZUX0NVUkxZX0JSQUNFKSB7XG4gICAgICBkZXB0aCsrO1xuXG4gICAgICBsZXQgZG9sbGFyID0gcHJldi52YWx1ZSAmJiBwcmV2LnZhbHVlLnNsaWNlKC0xKSA9PT0gJyQnIHx8IGJsb2NrLmRvbGxhciA9PT0gdHJ1ZTtcbiAgICAgIGxldCBicmFjZSA9IHtcbiAgICAgICAgdHlwZTogJ2JyYWNlJyxcbiAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgY2xvc2U6IGZhbHNlLFxuICAgICAgICBkb2xsYXIsXG4gICAgICAgIGRlcHRoLFxuICAgICAgICBjb21tYXM6IDAsXG4gICAgICAgIHJhbmdlczogMCxcbiAgICAgICAgbm9kZXM6IFtdXG4gICAgICB9O1xuXG4gICAgICBibG9jayA9IHB1c2goYnJhY2UpO1xuICAgICAgc3RhY2sucHVzaChibG9jayk7XG4gICAgICBwdXNoKHsgdHlwZTogJ29wZW4nLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJpZ2h0IGN1cmx5IGJyYWNlOiAnfSdcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9SSUdIVF9DVVJMWV9CUkFDRSkge1xuICAgICAgaWYgKGJsb2NrLnR5cGUgIT09ICdicmFjZScpIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdHlwZSA9ICdjbG9zZSc7XG4gICAgICBibG9jayA9IHN0YWNrLnBvcCgpO1xuICAgICAgYmxvY2suY2xvc2UgPSB0cnVlO1xuXG4gICAgICBwdXNoKHsgdHlwZSwgdmFsdWUgfSk7XG4gICAgICBkZXB0aC0tO1xuXG4gICAgICBibG9jayA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tbWE6ICcsJ1xuICAgICAqL1xuXG4gICAgaWYgKHZhbHVlID09PSBDSEFSX0NPTU1BICYmIGRlcHRoID4gMCkge1xuICAgICAgaWYgKGJsb2NrLnJhbmdlcyA+IDApIHtcbiAgICAgICAgYmxvY2sucmFuZ2VzID0gMDtcbiAgICAgICAgbGV0IG9wZW4gPSBibG9jay5ub2Rlcy5zaGlmdCgpO1xuICAgICAgICBibG9jay5ub2RlcyA9IFtvcGVuLCB7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IHN0cmluZ2lmeShibG9jaykgfV07XG4gICAgICB9XG5cbiAgICAgIHB1c2goeyB0eXBlOiAnY29tbWEnLCB2YWx1ZSB9KTtcbiAgICAgIGJsb2NrLmNvbW1hcysrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG90OiAnLidcbiAgICAgKi9cblxuICAgIGlmICh2YWx1ZSA9PT0gQ0hBUl9ET1QgJiYgZGVwdGggPiAwICYmIGJsb2NrLmNvbW1hcyA9PT0gMCkge1xuICAgICAgbGV0IHNpYmxpbmdzID0gYmxvY2subm9kZXM7XG5cbiAgICAgIGlmIChkZXB0aCA9PT0gMCB8fCBzaWJsaW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWUgfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldi50eXBlID09PSAnZG90Jykge1xuICAgICAgICBibG9jay5yYW5nZSA9IFtdO1xuICAgICAgICBwcmV2LnZhbHVlICs9IHZhbHVlO1xuICAgICAgICBwcmV2LnR5cGUgPSAncmFuZ2UnO1xuXG4gICAgICAgIGlmIChibG9jay5ub2Rlcy5sZW5ndGggIT09IDMgJiYgYmxvY2subm9kZXMubGVuZ3RoICE9PSA1KSB7XG4gICAgICAgICAgYmxvY2suaW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYmxvY2sucmFuZ2VzID0gMDtcbiAgICAgICAgICBwcmV2LnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBibG9jay5yYW5nZXMrKztcbiAgICAgICAgYmxvY2suYXJncyA9IFtdO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYudHlwZSA9PT0gJ3JhbmdlJykge1xuICAgICAgICBzaWJsaW5ncy5wb3AoKTtcblxuICAgICAgICBsZXQgYmVmb3JlID0gc2libGluZ3Nbc2libGluZ3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGJlZm9yZS52YWx1ZSArPSBwcmV2LnZhbHVlICsgdmFsdWU7XG4gICAgICAgIHByZXYgPSBiZWZvcmU7XG4gICAgICAgIGJsb2NrLnJhbmdlcy0tO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcHVzaCh7IHR5cGU6ICdkb3QnLCB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRleHRcbiAgICAgKi9cblxuICAgIHB1c2goeyB0eXBlOiAndGV4dCcsIHZhbHVlIH0pO1xuICB9XG5cbiAgLy8gTWFyayBpbWJhbGFuY2VkIGJyYWNlcyBhbmQgYnJhY2tldHMgYXMgaW52YWxpZFxuICBkbyB7XG4gICAgYmxvY2sgPSBzdGFjay5wb3AoKTtcblxuICAgIGlmIChibG9jay50eXBlICE9PSAncm9vdCcpIHtcbiAgICAgIGJsb2NrLm5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIGlmICghbm9kZS5ub2Rlcykge1xuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdvcGVuJykgbm9kZS5pc09wZW4gPSB0cnVlO1xuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdjbG9zZScpIG5vZGUuaXNDbG9zZSA9IHRydWU7XG4gICAgICAgICAgaWYgKCFub2RlLm5vZGVzKSBub2RlLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgbm9kZS5pbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdldCB0aGUgbG9jYXRpb24gb2YgdGhlIGJsb2NrIG9uIHBhcmVudC5ub2RlcyAoYmxvY2sncyBzaWJsaW5ncylcbiAgICAgIGxldCBwYXJlbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgIGxldCBpbmRleCA9IHBhcmVudC5ub2Rlcy5pbmRleE9mKGJsb2NrKTtcbiAgICAgIC8vIHJlcGxhY2UgdGhlIChpbnZhbGlkKSBibG9jayB3aXRoIGl0J3Mgbm9kZXNcbiAgICAgIHBhcmVudC5ub2Rlcy5zcGxpY2UoaW5kZXgsIDEsIC4uLmJsb2NrLm5vZGVzKTtcbiAgICB9XG4gIH0gd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApO1xuXG4gIHB1c2goeyB0eXBlOiAnZW9zJyB9KTtcbiAgcmV0dXJuIGFzdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vbGliL3N0cmluZ2lmeScpO1xuY29uc3QgY29tcGlsZSA9IHJlcXVpcmUoJy4vbGliL2NvbXBpbGUnKTtcbmNvbnN0IGV4cGFuZCA9IHJlcXVpcmUoJy4vbGliL2V4cGFuZCcpO1xuY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuL2xpYi9wYXJzZScpO1xuXG4vKipcbiAqIEV4cGFuZCB0aGUgZ2l2ZW4gcGF0dGVybiBvciBjcmVhdGUgYSByZWdleC1jb21wYXRpYmxlIHN0cmluZy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nLCB7IGNvbXBpbGU6IHRydWUgfSkpOyAvLz0+IFsnKGF8YnxjKSddXG4gKiBjb25zb2xlLmxvZyhicmFjZXMoJ3thLGIsY30nKSk7IC8vPT4gWydhJywgJ2InLCAnYyddXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYFxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5jb25zdCBicmFjZXMgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgb3V0cHV0ID0gW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgZm9yIChsZXQgcGF0dGVybiBvZiBpbnB1dCkge1xuICAgICAgbGV0IHJlc3VsdCA9IGJyYWNlcy5jcmVhdGUocGF0dGVybiwgb3B0aW9ucyk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKC4uLnJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaChyZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBbXS5jb25jYXQoYnJhY2VzLmNyZWF0ZShpbnB1dCwgb3B0aW9ucykpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5leHBhbmQgPT09IHRydWUgJiYgb3B0aW9ucy5ub2R1cGVzID09PSB0cnVlKSB7XG4gICAgb3V0cHV0ID0gWy4uLm5ldyBTZXQob3V0cHV0KV07XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAqXG4gKiBgYGBqc1xuICogLy8gYnJhY2VzLnBhcnNlKHBhdHRlcm4sIFssIG9wdGlvbnNdKTtcbiAqIGNvbnN0IGFzdCA9IGJyYWNlcy5wYXJzZSgnYS97YixjfS9kJyk7XG4gKiBjb25zb2xlLmxvZyhhc3QpO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0dGVybiBCcmFjZSBwYXR0ZXJuIHRvIHBhcnNlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIEFTVFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMucGFyc2UgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4gcGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBicmFjZXMgc3RyaW5nIGZyb20gYW4gQVNULCBvciBhbiBBU1Qgbm9kZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYnJhY2VzID0gcmVxdWlyZSgnYnJhY2VzJyk7XG4gKiBsZXQgYXN0ID0gYnJhY2VzLnBhcnNlKCdmb28ve2EsYn0vYmFyJyk7XG4gKiBjb25zb2xlLmxvZyhzdHJpbmdpZnkoYXN0Lm5vZGVzWzJdKSk7IC8vPT4gJ3thLGJ9J1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLnN0cmluZ2lmeSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeShicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpLCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gc3RyaW5naWZ5KGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogQ29tcGlsZXMgYSBicmFjZSBwYXR0ZXJuIGludG8gYSByZWdleC1jb21wYXRpYmxlLCBvcHRpbWl6ZWQgc3RyaW5nLlxuICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBtYWluIFticmFjZXNdKCNicmFjZXMpIGZ1bmN0aW9uIGJ5IGRlZmF1bHQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNvbXBpbGUoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhLyhifGMpL2QnXVxuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYGlucHV0YCBCcmFjZSBwYXR0ZXJuIG9yIEFTVC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmNvbXBpbGUgPSAoaW5wdXQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgIGlucHV0ID0gYnJhY2VzLnBhcnNlKGlucHV0LCBvcHRpb25zKTtcbiAgfVxuICByZXR1cm4gY29tcGlsZShpbnB1dCwgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEV4cGFuZHMgYSBicmFjZSBwYXR0ZXJuIGludG8gYW4gYXJyYXkuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGVcbiAqIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24gd2hlbiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUuIEJlZm9yZVxuICogdXNpbmcgdGhpcyBtZXRob2QgaXQncyByZWNvbW1lbmRlZCB0aGF0IHlvdSByZWFkIHRoZSBbcGVyZm9ybWFuY2Ugbm90ZXNdKCNwZXJmb3JtYW5jZSkpXG4gKiBhbmQgYWR2YW50YWdlcyBvZiB1c2luZyBbLmNvbXBpbGVdKCNjb21waWxlKSBpbnN0ZWFkLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBicmFjZXMgPSByZXF1aXJlKCdicmFjZXMnKTtcbiAqIGNvbnNvbGUubG9nKGJyYWNlcy5leHBhbmQoJ2Eve2IsY30vZCcpKTtcbiAqIC8vPT4gWydhL2IvZCcsICdhL2MvZCddO1xuICogYGBgXG4gKiBAcGFyYW0ge1N0cmluZ30gYHBhdHRlcm5gIEJyYWNlIHBhdHRlcm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cGFuZGVkIHZhbHVlcy5cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuYnJhY2VzLmV4cGFuZCA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgaW5wdXQgPSBicmFjZXMucGFyc2UoaW5wdXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgbGV0IHJlc3VsdCA9IGV4cGFuZChpbnB1dCwgb3B0aW9ucyk7XG5cbiAgLy8gZmlsdGVyIG91dCBlbXB0eSBzdHJpbmdzIGlmIHNwZWNpZmllZFxuICBpZiAob3B0aW9ucy5ub2VtcHR5ID09PSB0cnVlKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihCb29sZWFuKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgZHVwbGljYXRlcyBpZiBzcGVjaWZpZWRcbiAgaWYgKG9wdGlvbnMubm9kdXBlcyA9PT0gdHJ1ZSkge1xuICAgIHJlc3VsdCA9IFsuLi5uZXcgU2V0KHJlc3VsdCldO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUHJvY2Vzc2VzIGEgYnJhY2UgcGF0dGVybiBhbmQgcmV0dXJucyBlaXRoZXIgYW4gZXhwYW5kZWQgYXJyYXlcbiAqIChpZiBgb3B0aW9ucy5leHBhbmRgIGlzIHRydWUpLCBhIGhpZ2hseSBvcHRpbWl6ZWQgcmVnZXgtY29tcGF0aWJsZSBzdHJpbmcuXG4gKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIG1haW4gW2JyYWNlc10oI2JyYWNlcykgZnVuY3Rpb24uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuICogY29uc29sZS5sb2coYnJhY2VzLmNyZWF0ZSgndXNlci17MjAwLi4zMDB9L3Byb2plY3Qte2EsYixjfS17MS4uMTB9JykpXG4gKiAvLz0+ICd1c2VyLSgyMFswLTldfDJbMS05XVswLTldfDMwMCkvcHJvamVjdC0oYXxifGMpLShbMS05XXwxMCknXG4gKiBgYGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcGF0dGVybmAgQnJhY2UgcGF0dGVyblxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgZXhwYW5kZWQgdmFsdWVzLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5icmFjZXMuY3JlYXRlID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgaWYgKGlucHV0ID09PSAnJyB8fCBpbnB1dC5sZW5ndGggPCAzKSB7XG4gICAgcmV0dXJuIFtpbnB1dF07XG4gIH1cblxuIHJldHVybiBvcHRpb25zLmV4cGFuZCAhPT0gdHJ1ZVxuICAgID8gYnJhY2VzLmNvbXBpbGUoaW5wdXQsIG9wdGlvbnMpXG4gICAgOiBicmFjZXMuZXhwYW5kKGlucHV0LCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogRXhwb3NlIFwiYnJhY2VzXCJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJyYWNlcztcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9iaW5hcnktZXh0ZW5zaW9ucy5qc29uJyk7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgYmluYXJ5RXh0ZW5zaW9ucyA9IHJlcXVpcmUoJ2JpbmFyeS1leHRlbnNpb25zJyk7XG5cbmNvbnN0IGV4dGVuc2lvbnMgPSBuZXcgU2V0KGJpbmFyeUV4dGVuc2lvbnMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVQYXRoID0+IGV4dGVuc2lvbnMuaGFzKHBhdGguZXh0bmFtZShmaWxlUGF0aCkuc2xpY2UoMSkudG9Mb3dlckNhc2UoKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHtzZXB9ID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qge3BsYXRmb3JtfSA9IHByb2Nlc3M7XG5cbmV4cG9ydHMuRVZfQUxMID0gJ2FsbCc7XG5leHBvcnRzLkVWX1JFQURZID0gJ3JlYWR5JztcbmV4cG9ydHMuRVZfQUREID0gJ2FkZCc7XG5leHBvcnRzLkVWX0NIQU5HRSA9ICdjaGFuZ2UnO1xuZXhwb3J0cy5FVl9BRERfRElSID0gJ2FkZERpcic7XG5leHBvcnRzLkVWX1VOTElOSyA9ICd1bmxpbmsnO1xuZXhwb3J0cy5FVl9VTkxJTktfRElSID0gJ3VubGlua0Rpcic7XG5leHBvcnRzLkVWX1JBVyA9ICdyYXcnO1xuZXhwb3J0cy5FVl9FUlJPUiA9ICdlcnJvcic7XG5cbmV4cG9ydHMuU1RSX0RBVEEgPSAnZGF0YSc7XG5leHBvcnRzLlNUUl9FTkQgPSAnZW5kJztcbmV4cG9ydHMuU1RSX0NMT1NFID0gJ2Nsb3NlJztcblxuZXhwb3J0cy5GU0VWRU5UX0NSRUFURUQgPSAnY3JlYXRlZCc7XG5leHBvcnRzLkZTRVZFTlRfTU9ESUZJRUQgPSAnbW9kaWZpZWQnO1xuZXhwb3J0cy5GU0VWRU5UX0RFTEVURUQgPSAnZGVsZXRlZCc7XG5leHBvcnRzLkZTRVZFTlRfTU9WRUQgPSAnbW92ZWQnO1xuZXhwb3J0cy5GU0VWRU5UX0NMT05FRCA9ICdjbG9uZWQnO1xuZXhwb3J0cy5GU0VWRU5UX1VOS05PV04gPSAndW5rbm93bic7XG5leHBvcnRzLkZTRVZFTlRfVFlQRV9GSUxFID0gJ2ZpbGUnO1xuZXhwb3J0cy5GU0VWRU5UX1RZUEVfRElSRUNUT1JZID0gJ2RpcmVjdG9yeSc7XG5leHBvcnRzLkZTRVZFTlRfVFlQRV9TWU1MSU5LID0gJ3N5bWxpbmsnO1xuXG5leHBvcnRzLktFWV9MSVNURU5FUlMgPSAnbGlzdGVuZXJzJztcbmV4cG9ydHMuS0VZX0VSUiA9ICdlcnJIYW5kbGVycyc7XG5leHBvcnRzLktFWV9SQVcgPSAncmF3RW1pdHRlcnMnO1xuZXhwb3J0cy5IQU5ETEVSX0tFWVMgPSBbZXhwb3J0cy5LRVlfTElTVEVORVJTLCBleHBvcnRzLktFWV9FUlIsIGV4cG9ydHMuS0VZX1JBV107XG5cbmV4cG9ydHMuRE9UX1NMQVNIID0gYC4ke3NlcH1gO1xuXG5leHBvcnRzLkJBQ0tfU0xBU0hfUkUgPSAvXFxcXC9nO1xuZXhwb3J0cy5ET1VCTEVfU0xBU0hfUkUgPSAvXFwvXFwvLztcbmV4cG9ydHMuU0xBU0hfT1JfQkFDS19TTEFTSF9SRSA9IC9bL1xcXFxdLztcbmV4cG9ydHMuRE9UX1JFID0gL1xcLi4qXFwuKHN3W3B4XSkkfH4kfFxcLnN1YmwuKlxcLnRtcC87XG5leHBvcnRzLlJFUExBQ0VSX1JFID0gL15cXC5bL1xcXFxdLztcblxuZXhwb3J0cy5TTEFTSCA9ICcvJztcbmV4cG9ydHMuU0xBU0hfU0xBU0ggPSAnLy8nO1xuZXhwb3J0cy5CUkFDRV9TVEFSVCA9ICd7JztcbmV4cG9ydHMuQkFORyA9ICchJztcbmV4cG9ydHMuT05FX0RPVCA9ICcuJztcbmV4cG9ydHMuVFdPX0RPVFMgPSAnLi4nO1xuZXhwb3J0cy5TVEFSID0gJyonO1xuZXhwb3J0cy5HTE9CU1RBUiA9ICcqKic7XG5leHBvcnRzLlJPT1RfR0xPQlNUQVIgPSAnLyoqLyonO1xuZXhwb3J0cy5TTEFTSF9HTE9CU1RBUiA9ICcvKionO1xuZXhwb3J0cy5ESVJfU1VGRklYID0gJ0Rpcic7XG5leHBvcnRzLkFOWU1BVENIX09QVFMgPSB7ZG90OiB0cnVlfTtcbmV4cG9ydHMuU1RSSU5HX1RZUEUgPSAnc3RyaW5nJztcbmV4cG9ydHMuRlVOQ1RJT05fVFlQRSA9ICdmdW5jdGlvbic7XG5leHBvcnRzLkVNUFRZX1NUUiA9ICcnO1xuZXhwb3J0cy5FTVBUWV9GTiA9ICgpID0+IHt9O1xuZXhwb3J0cy5JREVOVElUWV9GTiA9IHZhbCA9PiB2YWw7XG5cbmV4cG9ydHMuaXNXaW5kb3dzID0gcGxhdGZvcm0gPT09ICd3aW4zMic7XG5leHBvcnRzLmlzTWFjb3MgPSBwbGF0Zm9ybSA9PT0gJ2Rhcndpbic7XG5leHBvcnRzLmlzTGludXggPSBwbGF0Zm9ybSA9PT0gJ2xpbnV4JztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3Qgc3lzUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHsgcHJvbWlzaWZ5IH0gPSByZXF1aXJlKCd1dGlsJyk7XG5jb25zdCBpc0JpbmFyeVBhdGggPSByZXF1aXJlKCdpcy1iaW5hcnktcGF0aCcpO1xuY29uc3Qge1xuICBpc1dpbmRvd3MsXG4gIGlzTGludXgsXG4gIEVNUFRZX0ZOLFxuICBFTVBUWV9TVFIsXG4gIEtFWV9MSVNURU5FUlMsXG4gIEtFWV9FUlIsXG4gIEtFWV9SQVcsXG4gIEhBTkRMRVJfS0VZUyxcbiAgRVZfQ0hBTkdFLFxuICBFVl9BREQsXG4gIEVWX0FERF9ESVIsXG4gIEVWX0VSUk9SLFxuICBTVFJfREFUQSxcbiAgU1RSX0VORCxcbiAgQlJBQ0VfU1RBUlQsXG4gIFNUQVJcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5jb25zdCBUSFJPVFRMRV9NT0RFX1dBVENIID0gJ3dhdGNoJztcblxuY29uc3Qgb3BlbiA9IHByb21pc2lmeShmcy5vcGVuKTtcbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5jb25zdCBsc3RhdCA9IHByb21pc2lmeShmcy5sc3RhdCk7XG5jb25zdCBjbG9zZSA9IHByb21pc2lmeShmcy5jbG9zZSk7XG5jb25zdCBmc3JlYWxwYXRoID0gcHJvbWlzaWZ5KGZzLnJlYWxwYXRoKTtcblxuY29uc3Qgc3RhdE1ldGhvZHMgPSB7IGxzdGF0LCBzdGF0IH07XG5cbi8vIFRPRE86IGVtaXQgZXJyb3JzIHByb3Blcmx5LiBFeGFtcGxlOiBFTUZJTEUgb24gTWFjb3MuXG5jb25zdCBmb3JlYWNoID0gKHZhbCwgZm4pID0+IHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIFNldCkge1xuICAgIHZhbC5mb3JFYWNoKGZuKTtcbiAgfSBlbHNlIHtcbiAgICBmbih2YWwpO1xuICB9XG59O1xuXG5jb25zdCBhZGRBbmRDb252ZXJ0ID0gKG1haW4sIHByb3AsIGl0ZW0pID0+IHtcbiAgbGV0IGNvbnRhaW5lciA9IG1haW5bcHJvcF07XG4gIGlmICghKGNvbnRhaW5lciBpbnN0YW5jZW9mIFNldCkpIHtcbiAgICBtYWluW3Byb3BdID0gY29udGFpbmVyID0gbmV3IFNldChbY29udGFpbmVyXSk7XG4gIH1cbiAgY29udGFpbmVyLmFkZChpdGVtKTtcbn07XG5cbmNvbnN0IGNsZWFySXRlbSA9IGNvbnQgPT4ga2V5ID0+IHtcbiAgY29uc3Qgc2V0ID0gY29udFtrZXldO1xuICBpZiAoc2V0IGluc3RhbmNlb2YgU2V0KSB7XG4gICAgc2V0LmNsZWFyKCk7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGNvbnRba2V5XTtcbiAgfVxufTtcblxuY29uc3QgZGVsRnJvbVNldCA9IChtYWluLCBwcm9wLCBpdGVtKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IG1haW5bcHJvcF07XG4gIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICBjb250YWluZXIuZGVsZXRlKGl0ZW0pO1xuICB9IGVsc2UgaWYgKGNvbnRhaW5lciA9PT0gaXRlbSkge1xuICAgIGRlbGV0ZSBtYWluW3Byb3BdO1xuICB9XG59O1xuXG5jb25zdCBpc0VtcHR5U2V0ID0gKHZhbCkgPT4gdmFsIGluc3RhbmNlb2YgU2V0ID8gdmFsLnNpemUgPT09IDAgOiAhdmFsO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtTdHJpbmd9IFBhdGhcbiAqL1xuXG4vLyBmc193YXRjaCBoZWxwZXJzXG5cbi8vIG9iamVjdCB0byBob2xkIHBlci1wcm9jZXNzIGZzX3dhdGNoIGluc3RhbmNlc1xuLy8gKG1heSBiZSBzaGFyZWQgYWNyb3NzIGNob2tpZGFyIEZTV2F0Y2hlciBpbnN0YW5jZXMpXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gRnNXYXRjaENvbnRhaW5lclxuICogQHByb3BlcnR5IHtTZXR9IGxpc3RlbmVyc1xuICogQHByb3BlcnR5IHtTZXR9IGVyckhhbmRsZXJzXG4gKiBAcHJvcGVydHkge1NldH0gcmF3RW1pdHRlcnNcbiAqIEBwcm9wZXJ0eSB7ZnMuRlNXYXRjaGVyPX0gd2F0Y2hlclxuICogQHByb3BlcnR5IHtCb29sZWFuPX0gd2F0Y2hlclVudXNhYmxlXG4gKi9cblxuLyoqXG4gKiBAdHlwZSB7TWFwPFN0cmluZyxGc1dhdGNoQ29udGFpbmVyPn1cbiAqL1xuY29uc3QgRnNXYXRjaEluc3RhbmNlcyA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgdGhlIGZzX3dhdGNoIGludGVyZmFjZVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggdG8gYmUgd2F0Y2hlZFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIGZzX3dhdGNoXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBtYWluIGV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVyckhhbmRsZXIgZW1pdHMgaW5mbyBhYm91dCBlcnJvcnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVtaXRSYXcgZW1pdHMgcmF3IGV2ZW50IGRhdGFcbiAqIEByZXR1cm5zIHtmcy5GU1dhdGNoZXJ9IG5ldyBmc2V2ZW50cyBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBjcmVhdGVGc1dhdGNoSW5zdGFuY2UocGF0aCwgb3B0aW9ucywgbGlzdGVuZXIsIGVyckhhbmRsZXIsIGVtaXRSYXcpIHtcbiAgY29uc3QgaGFuZGxlRXZlbnQgPSAocmF3RXZlbnQsIGV2UGF0aCkgPT4ge1xuICAgIGxpc3RlbmVyKHBhdGgpO1xuICAgIGVtaXRSYXcocmF3RXZlbnQsIGV2UGF0aCwge3dhdGNoZWRQYXRoOiBwYXRofSk7XG5cbiAgICAvLyBlbWl0IGJhc2VkIG9uIGV2ZW50cyBvY2N1cnJpbmcgZm9yIGZpbGVzIGZyb20gYSBkaXJlY3RvcnkncyB3YXRjaGVyIGluXG4gICAgLy8gY2FzZSB0aGUgZmlsZSdzIHdhdGNoZXIgbWlzc2VzIGl0IChhbmQgcmVseSBvbiB0aHJvdHRsaW5nIHRvIGRlLWR1cGUpXG4gICAgaWYgKGV2UGF0aCAmJiBwYXRoICE9PSBldlBhdGgpIHtcbiAgICAgIGZzV2F0Y2hCcm9hZGNhc3QoXG4gICAgICAgIHN5c1BhdGgucmVzb2x2ZShwYXRoLCBldlBhdGgpLCBLRVlfTElTVEVORVJTLCBzeXNQYXRoLmpvaW4ocGF0aCwgZXZQYXRoKVxuICAgICAgKTtcbiAgICB9XG4gIH07XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZzLndhdGNoKHBhdGgsIG9wdGlvbnMsIGhhbmRsZUV2ZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJIYW5kbGVyKGVycm9yKTtcbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciBmb3IgcGFzc2luZyBmc193YXRjaCBldmVudCBkYXRhIHRvIGEgY29sbGVjdGlvbiBvZiBsaXN0ZW5lcnNcbiAqIEBwYXJhbSB7UGF0aH0gZnVsbFBhdGggYWJzb2x1dGUgcGF0aCBib3VuZCB0byBmc193YXRjaCBpbnN0YW5jZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgbGlzdGVuZXIgdHlwZVxuICogQHBhcmFtIHsqPX0gdmFsMSBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGxpc3RlbmVyc1xuICogQHBhcmFtIHsqPX0gdmFsMlxuICogQHBhcmFtIHsqPX0gdmFsM1xuICovXG5jb25zdCBmc1dhdGNoQnJvYWRjYXN0ID0gKGZ1bGxQYXRoLCB0eXBlLCB2YWwxLCB2YWwyLCB2YWwzKSA9PiB7XG4gIGNvbnN0IGNvbnQgPSBGc1dhdGNoSW5zdGFuY2VzLmdldChmdWxsUGF0aCk7XG4gIGlmICghY29udCkgcmV0dXJuO1xuICBmb3JlYWNoKGNvbnRbdHlwZV0sIChsaXN0ZW5lcikgPT4ge1xuICAgIGxpc3RlbmVyKHZhbDEsIHZhbDIsIHZhbDMpO1xuICB9KTtcbn07XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHRoZSBmc193YXRjaCBpbnRlcmZhY2Ugb3IgYmluZHMgbGlzdGVuZXJzXG4gKiB0byBhbiBleGlzdGluZyBvbmUgY292ZXJpbmcgdGhlIHNhbWUgZmlsZSBzeXN0ZW0gZW50cnlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge1N0cmluZ30gZnVsbFBhdGggYWJzb2x1dGUgcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIGZzX3dhdGNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgY29udGFpbmVyIGZvciBldmVudCBsaXN0ZW5lciBmdW5jdGlvbnNcbiAqL1xuY29uc3Qgc2V0RnNXYXRjaExpc3RlbmVyID0gKHBhdGgsIGZ1bGxQYXRoLCBvcHRpb25zLCBoYW5kbGVycykgPT4ge1xuICBjb25zdCB7bGlzdGVuZXIsIGVyckhhbmRsZXIsIHJhd0VtaXR0ZXJ9ID0gaGFuZGxlcnM7XG4gIGxldCBjb250ID0gRnNXYXRjaEluc3RhbmNlcy5nZXQoZnVsbFBhdGgpO1xuXG4gIC8qKiBAdHlwZSB7ZnMuRlNXYXRjaGVyPX0gKi9cbiAgbGV0IHdhdGNoZXI7XG4gIGlmICghb3B0aW9ucy5wZXJzaXN0ZW50KSB7XG4gICAgd2F0Y2hlciA9IGNyZWF0ZUZzV2F0Y2hJbnN0YW5jZShcbiAgICAgIHBhdGgsIG9wdGlvbnMsIGxpc3RlbmVyLCBlcnJIYW5kbGVyLCByYXdFbWl0dGVyXG4gICAgKTtcbiAgICByZXR1cm4gd2F0Y2hlci5jbG9zZS5iaW5kKHdhdGNoZXIpO1xuICB9XG4gIGlmIChjb250KSB7XG4gICAgYWRkQW5kQ29udmVydChjb250LCBLRVlfTElTVEVORVJTLCBsaXN0ZW5lcik7XG4gICAgYWRkQW5kQ29udmVydChjb250LCBLRVlfRVJSLCBlcnJIYW5kbGVyKTtcbiAgICBhZGRBbmRDb252ZXJ0KGNvbnQsIEtFWV9SQVcsIHJhd0VtaXR0ZXIpO1xuICB9IGVsc2Uge1xuICAgIHdhdGNoZXIgPSBjcmVhdGVGc1dhdGNoSW5zdGFuY2UoXG4gICAgICBwYXRoLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIGZzV2F0Y2hCcm9hZGNhc3QuYmluZChudWxsLCBmdWxsUGF0aCwgS0VZX0xJU1RFTkVSUyksXG4gICAgICBlcnJIYW5kbGVyLCAvLyBubyBuZWVkIHRvIHVzZSBicm9hZGNhc3QgaGVyZVxuICAgICAgZnNXYXRjaEJyb2FkY2FzdC5iaW5kKG51bGwsIGZ1bGxQYXRoLCBLRVlfUkFXKVxuICAgICk7XG4gICAgaWYgKCF3YXRjaGVyKSByZXR1cm47XG4gICAgd2F0Y2hlci5vbihFVl9FUlJPUiwgYXN5bmMgKGVycm9yKSA9PiB7XG4gICAgICBjb25zdCBicm9hZGNhc3RFcnIgPSBmc1dhdGNoQnJvYWRjYXN0LmJpbmQobnVsbCwgZnVsbFBhdGgsIEtFWV9FUlIpO1xuICAgICAgY29udC53YXRjaGVyVW51c2FibGUgPSB0cnVlOyAvLyBkb2N1bWVudGVkIHNpbmNlIE5vZGUgMTAuNC4xXG4gICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzQzMzdcbiAgICAgIGlmIChpc1dpbmRvd3MgJiYgZXJyb3IuY29kZSA9PT0gJ0VQRVJNJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGZkID0gYXdhaXQgb3BlbihwYXRoLCAncicpO1xuICAgICAgICAgIGF3YWl0IGNsb3NlKGZkKTtcbiAgICAgICAgICBicm9hZGNhc3RFcnIoZXJyb3IpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicm9hZGNhc3RFcnIoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnQgPSB7XG4gICAgICBsaXN0ZW5lcnM6IGxpc3RlbmVyLFxuICAgICAgZXJySGFuZGxlcnM6IGVyckhhbmRsZXIsXG4gICAgICByYXdFbWl0dGVyczogcmF3RW1pdHRlcixcbiAgICAgIHdhdGNoZXJcbiAgICB9O1xuICAgIEZzV2F0Y2hJbnN0YW5jZXMuc2V0KGZ1bGxQYXRoLCBjb250KTtcbiAgfVxuICAvLyBjb25zdCBpbmRleCA9IGNvbnQubGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuXG4gIC8vIHJlbW92ZXMgdGhpcyBpbnN0YW5jZSdzIGxpc3RlbmVycyBhbmQgY2xvc2VzIHRoZSB1bmRlcmx5aW5nIGZzX3dhdGNoXG4gIC8vIGluc3RhbmNlIGlmIHRoZXJlIGFyZSBubyBtb3JlIGxpc3RlbmVycyBsZWZ0XG4gIHJldHVybiAoKSA9PiB7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfTElTVEVORVJTLCBsaXN0ZW5lcik7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfRVJSLCBlcnJIYW5kbGVyKTtcbiAgICBkZWxGcm9tU2V0KGNvbnQsIEtFWV9SQVcsIHJhd0VtaXR0ZXIpO1xuICAgIGlmIChpc0VtcHR5U2V0KGNvbnQubGlzdGVuZXJzKSkge1xuICAgICAgLy8gQ2hlY2sgdG8gcHJvdGVjdCBhZ2FpbnN0IGlzc3VlIGdoLTczMC5cbiAgICAgIC8vIGlmIChjb250LndhdGNoZXJVbnVzYWJsZSkge1xuICAgICAgY29udC53YXRjaGVyLmNsb3NlKCk7XG4gICAgICAvLyB9XG4gICAgICBGc1dhdGNoSW5zdGFuY2VzLmRlbGV0ZShmdWxsUGF0aCk7XG4gICAgICBIQU5ETEVSX0tFWVMuZm9yRWFjaChjbGVhckl0ZW0oY29udCkpO1xuICAgICAgY29udC53YXRjaGVyID0gdW5kZWZpbmVkO1xuICAgICAgT2JqZWN0LmZyZWV6ZShjb250KTtcbiAgICB9XG4gIH07XG59O1xuXG4vLyBmc193YXRjaEZpbGUgaGVscGVyc1xuXG4vLyBvYmplY3QgdG8gaG9sZCBwZXItcHJvY2VzcyBmc193YXRjaEZpbGUgaW5zdGFuY2VzXG4vLyAobWF5IGJlIHNoYXJlZCBhY3Jvc3MgY2hva2lkYXIgRlNXYXRjaGVyIGluc3RhbmNlcylcbmNvbnN0IEZzV2F0Y2hGaWxlSW5zdGFuY2VzID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIEluc3RhbnRpYXRlcyB0aGUgZnNfd2F0Y2hGaWxlIGludGVyZmFjZSBvciBiaW5kcyBsaXN0ZW5lcnNcbiAqIHRvIGFuIGV4aXN0aW5nIG9uZSBjb3ZlcmluZyB0aGUgc2FtZSBmaWxlIHN5c3RlbSBlbnRyeVxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggdG8gYmUgd2F0Y2hlZFxuICogQHBhcmFtIHtTdHJpbmd9IGZ1bGxQYXRoIGFic29sdXRlIHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIGZzX3dhdGNoRmlsZVxuICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzIGNvbnRhaW5lciBmb3IgZXZlbnQgbGlzdGVuZXIgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGNsb3NlclxuICovXG5jb25zdCBzZXRGc1dhdGNoRmlsZUxpc3RlbmVyID0gKHBhdGgsIGZ1bGxQYXRoLCBvcHRpb25zLCBoYW5kbGVycykgPT4ge1xuICBjb25zdCB7bGlzdGVuZXIsIHJhd0VtaXR0ZXJ9ID0gaGFuZGxlcnM7XG4gIGxldCBjb250ID0gRnNXYXRjaEZpbGVJbnN0YW5jZXMuZ2V0KGZ1bGxQYXRoKTtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycywgcHJlZmVyLWRlc3RydWN0dXJpbmcgKi9cbiAgbGV0IGxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgbGV0IHJhd0VtaXR0ZXJzID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IGNvcHRzID0gY29udCAmJiBjb250Lm9wdGlvbnM7XG4gIGlmIChjb3B0cyAmJiAoY29wdHMucGVyc2lzdGVudCA8IG9wdGlvbnMucGVyc2lzdGVudCB8fCBjb3B0cy5pbnRlcnZhbCA+IG9wdGlvbnMuaW50ZXJ2YWwpKSB7XG4gICAgLy8gXCJVcGdyYWRlXCIgdGhlIHdhdGNoZXIgdG8gcGVyc2lzdGVuY2Ugb3IgYSBxdWlja2VyIGludGVydmFsLlxuICAgIC8vIFRoaXMgY3JlYXRlcyBzb21lIHVubGlrZWx5IGVkZ2UgY2FzZSBpc3N1ZXMgaWYgdGhlIHVzZXIgbWl4ZXNcbiAgICAvLyBzZXR0aW5ncyBpbiBhIHZlcnkgd2VpcmQgd2F5LCBidXQgc29sdmluZyBmb3IgdGhvc2UgY2FzZXNcbiAgICAvLyBkb2Vzbid0IHNlZW0gd29ydGh3aGlsZSBmb3IgdGhlIGFkZGVkIGNvbXBsZXhpdHkuXG4gICAgbGlzdGVuZXJzID0gY29udC5saXN0ZW5lcnM7XG4gICAgcmF3RW1pdHRlcnMgPSBjb250LnJhd0VtaXR0ZXJzO1xuICAgIGZzLnVud2F0Y2hGaWxlKGZ1bGxQYXRoKTtcbiAgICBjb250ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycywgcHJlZmVyLWRlc3RydWN0dXJpbmcgKi9cblxuICBpZiAoY29udCkge1xuICAgIGFkZEFuZENvbnZlcnQoY29udCwgS0VZX0xJU1RFTkVSUywgbGlzdGVuZXIpO1xuICAgIGFkZEFuZENvbnZlcnQoY29udCwgS0VZX1JBVywgcmF3RW1pdHRlcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gVE9ET1xuICAgIC8vIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIC8vIHJhd0VtaXR0ZXJzLmFkZChyYXdFbWl0dGVyKTtcbiAgICBjb250ID0ge1xuICAgICAgbGlzdGVuZXJzOiBsaXN0ZW5lcixcbiAgICAgIHJhd0VtaXR0ZXJzOiByYXdFbWl0dGVyLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIHdhdGNoZXI6IGZzLndhdGNoRmlsZShmdWxsUGF0aCwgb3B0aW9ucywgKGN1cnIsIHByZXYpID0+IHtcbiAgICAgICAgZm9yZWFjaChjb250LnJhd0VtaXR0ZXJzLCAocmF3RW1pdHRlcikgPT4ge1xuICAgICAgICAgIHJhd0VtaXR0ZXIoRVZfQ0hBTkdFLCBmdWxsUGF0aCwge2N1cnIsIHByZXZ9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGN1cnJtdGltZSA9IGN1cnIubXRpbWVNcztcbiAgICAgICAgaWYgKGN1cnIuc2l6ZSAhPT0gcHJldi5zaXplIHx8IGN1cnJtdGltZSA+IHByZXYubXRpbWVNcyB8fCBjdXJybXRpbWUgPT09IDApIHtcbiAgICAgICAgICBmb3JlYWNoKGNvbnQubGlzdGVuZXJzLCAobGlzdGVuZXIpID0+IGxpc3RlbmVyKHBhdGgsIGN1cnIpKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9O1xuICAgIEZzV2F0Y2hGaWxlSW5zdGFuY2VzLnNldChmdWxsUGF0aCwgY29udCk7XG4gIH1cbiAgLy8gY29uc3QgaW5kZXggPSBjb250Lmxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcblxuICAvLyBSZW1vdmVzIHRoaXMgaW5zdGFuY2UncyBsaXN0ZW5lcnMgYW5kIGNsb3NlcyB0aGUgdW5kZXJseWluZyBmc193YXRjaEZpbGVcbiAgLy8gaW5zdGFuY2UgaWYgdGhlcmUgYXJlIG5vIG1vcmUgbGlzdGVuZXJzIGxlZnQuXG4gIHJldHVybiAoKSA9PiB7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfTElTVEVORVJTLCBsaXN0ZW5lcik7XG4gICAgZGVsRnJvbVNldChjb250LCBLRVlfUkFXLCByYXdFbWl0dGVyKTtcbiAgICBpZiAoaXNFbXB0eVNldChjb250Lmxpc3RlbmVycykpIHtcbiAgICAgIEZzV2F0Y2hGaWxlSW5zdGFuY2VzLmRlbGV0ZShmdWxsUGF0aCk7XG4gICAgICBmcy51bndhdGNoRmlsZShmdWxsUGF0aCk7XG4gICAgICBjb250Lm9wdGlvbnMgPSBjb250LndhdGNoZXIgPSB1bmRlZmluZWQ7XG4gICAgICBPYmplY3QuZnJlZXplKGNvbnQpO1xuICAgIH1cbiAgfTtcbn07XG5cbi8qKlxuICogQG1peGluXG4gKi9cbmNsYXNzIE5vZGVGc0hhbmRsZXIge1xuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KFwiLi4vaW5kZXhcIikuRlNXYXRjaGVyfSBmc1dcbiAqL1xuY29uc3RydWN0b3IoZnNXKSB7XG4gIHRoaXMuZnN3ID0gZnNXO1xuICB0aGlzLl9ib3VuZEhhbmRsZUVycm9yID0gKGVycm9yKSA9PiBmc1cuX2hhbmRsZUVycm9yKGVycm9yKTtcbn1cblxuLyoqXG4gKiBXYXRjaCBmaWxlIGZvciBjaGFuZ2VzIHdpdGggZnNfd2F0Y2hGaWxlIG9yIGZzX3dhdGNoLlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggdG8gZmlsZSBvciBkaXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIG9uIGZzIGNoYW5nZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSBjbG9zZXIgZm9yIHRoZSB3YXRjaGVyIGluc3RhbmNlXG4gKi9cbl93YXRjaFdpdGhOb2RlRnMocGF0aCwgbGlzdGVuZXIpIHtcbiAgY29uc3Qgb3B0cyA9IHRoaXMuZnN3Lm9wdGlvbnM7XG4gIGNvbnN0IGRpcmVjdG9yeSA9IHN5c1BhdGguZGlybmFtZShwYXRoKTtcbiAgY29uc3QgYmFzZW5hbWUgPSBzeXNQYXRoLmJhc2VuYW1lKHBhdGgpO1xuICBjb25zdCBwYXJlbnQgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihkaXJlY3RvcnkpO1xuICBwYXJlbnQuYWRkKGJhc2VuYW1lKTtcbiAgY29uc3QgYWJzb2x1dGVQYXRoID0gc3lzUGF0aC5yZXNvbHZlKHBhdGgpO1xuICBjb25zdCBvcHRpb25zID0ge3BlcnNpc3RlbnQ6IG9wdHMucGVyc2lzdGVudH07XG4gIGlmICghbGlzdGVuZXIpIGxpc3RlbmVyID0gRU1QVFlfRk47XG5cbiAgbGV0IGNsb3NlcjtcbiAgaWYgKG9wdHMudXNlUG9sbGluZykge1xuICAgIG9wdGlvbnMuaW50ZXJ2YWwgPSBvcHRzLmVuYWJsZUJpbmFyeUludGVydmFsICYmIGlzQmluYXJ5UGF0aChiYXNlbmFtZSkgP1xuICAgICAgb3B0cy5iaW5hcnlJbnRlcnZhbCA6IG9wdHMuaW50ZXJ2YWw7XG4gICAgY2xvc2VyID0gc2V0RnNXYXRjaEZpbGVMaXN0ZW5lcihwYXRoLCBhYnNvbHV0ZVBhdGgsIG9wdGlvbnMsIHtcbiAgICAgIGxpc3RlbmVyLFxuICAgICAgcmF3RW1pdHRlcjogdGhpcy5mc3cuX2VtaXRSYXdcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjbG9zZXIgPSBzZXRGc1dhdGNoTGlzdGVuZXIocGF0aCwgYWJzb2x1dGVQYXRoLCBvcHRpb25zLCB7XG4gICAgICBsaXN0ZW5lcixcbiAgICAgIGVyckhhbmRsZXI6IHRoaXMuX2JvdW5kSGFuZGxlRXJyb3IsXG4gICAgICByYXdFbWl0dGVyOiB0aGlzLmZzdy5fZW1pdFJhd1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBjbG9zZXI7XG59XG5cbi8qKlxuICogV2F0Y2ggYSBmaWxlIGFuZCBlbWl0IGFkZCBldmVudCBpZiB3YXJyYW50ZWQuXG4gKiBAcGFyYW0ge1BhdGh9IGZpbGUgUGF0aFxuICogQHBhcmFtIHtmcy5TdGF0c30gc3RhdHMgcmVzdWx0IG9mIGZzX3N0YXRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdGlhbEFkZCB3YXMgdGhlIGZpbGUgYWRkZWQgYXQgd2F0Y2ggaW5zdGFudGlhdGlvbj9cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gY2xvc2VyIGZvciB0aGUgd2F0Y2hlciBpbnN0YW5jZVxuICovXG5faGFuZGxlRmlsZShmaWxlLCBzdGF0cywgaW5pdGlhbEFkZCkge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRpcm5hbWUgPSBzeXNQYXRoLmRpcm5hbWUoZmlsZSk7XG4gIGNvbnN0IGJhc2VuYW1lID0gc3lzUGF0aC5iYXNlbmFtZShmaWxlKTtcbiAgY29uc3QgcGFyZW50ID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIoZGlybmFtZSk7XG4gIC8vIHN0YXRzIGlzIGFsd2F5cyBwcmVzZW50XG4gIGxldCBwcmV2U3RhdHMgPSBzdGF0cztcblxuICAvLyBpZiB0aGUgZmlsZSBpcyBhbHJlYWR5IGJlaW5nIHdhdGNoZWQsIGRvIG5vdGhpbmdcbiAgaWYgKHBhcmVudC5oYXMoYmFzZW5hbWUpKSByZXR1cm47XG5cbiAgY29uc3QgbGlzdGVuZXIgPSBhc3luYyAocGF0aCwgbmV3U3RhdHMpID0+IHtcbiAgICBpZiAoIXRoaXMuZnN3Ll90aHJvdHRsZShUSFJPVFRMRV9NT0RFX1dBVENILCBmaWxlLCA1KSkgcmV0dXJuO1xuICAgIGlmICghbmV3U3RhdHMgfHwgbmV3U3RhdHMubXRpbWVNcyA9PT0gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbmV3U3RhdHMgPSBhd2FpdCBzdGF0KGZpbGUpO1xuICAgICAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgICAgIC8vIENoZWNrIHRoYXQgY2hhbmdlIGV2ZW50IHdhcyBub3QgZmlyZWQgYmVjYXVzZSBvZiBjaGFuZ2VkIG9ubHkgYWNjZXNzVGltZS5cbiAgICAgICAgY29uc3QgYXQgPSBuZXdTdGF0cy5hdGltZU1zO1xuICAgICAgICBjb25zdCBtdCA9IG5ld1N0YXRzLm10aW1lTXM7XG4gICAgICAgIGlmICghYXQgfHwgYXQgPD0gbXQgfHwgbXQgIT09IHByZXZTdGF0cy5tdGltZU1zKSB7XG4gICAgICAgICAgdGhpcy5mc3cuX2VtaXQoRVZfQ0hBTkdFLCBmaWxlLCBuZXdTdGF0cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTGludXggJiYgcHJldlN0YXRzLmlubyAhPT0gbmV3U3RhdHMuaW5vKSB7XG4gICAgICAgICAgdGhpcy5mc3cuX2Nsb3NlRmlsZShwYXRoKVxuICAgICAgICAgIHByZXZTdGF0cyA9IG5ld1N0YXRzO1xuICAgICAgICAgIHRoaXMuZnN3Ll9hZGRQYXRoQ2xvc2VyKHBhdGgsIHRoaXMuX3dhdGNoV2l0aE5vZGVGcyhmaWxlLCBsaXN0ZW5lcikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByZXZTdGF0cyA9IG5ld1N0YXRzO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBGaXggaXNzdWVzIHdoZXJlIG10aW1lIGlzIG51bGwgYnV0IGZpbGUgaXMgc3RpbGwgcHJlc2VudFxuICAgICAgICB0aGlzLmZzdy5fcmVtb3ZlKGRpcm5hbWUsIGJhc2VuYW1lKTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZCBpcyBhYm91dCB0byBiZSBlbWl0dGVkIGlmIGZpbGUgbm90IGFscmVhZHkgdHJhY2tlZCBpbiBwYXJlbnRcbiAgICB9IGVsc2UgaWYgKHBhcmVudC5oYXMoYmFzZW5hbWUpKSB7XG4gICAgICAvLyBDaGVjayB0aGF0IGNoYW5nZSBldmVudCB3YXMgbm90IGZpcmVkIGJlY2F1c2Ugb2YgY2hhbmdlZCBvbmx5IGFjY2Vzc1RpbWUuXG4gICAgICBjb25zdCBhdCA9IG5ld1N0YXRzLmF0aW1lTXM7XG4gICAgICBjb25zdCBtdCA9IG5ld1N0YXRzLm10aW1lTXM7XG4gICAgICBpZiAoIWF0IHx8IGF0IDw9IG10IHx8IG10ICE9PSBwcmV2U3RhdHMubXRpbWVNcykge1xuICAgICAgICB0aGlzLmZzdy5fZW1pdChFVl9DSEFOR0UsIGZpbGUsIG5ld1N0YXRzKTtcbiAgICAgIH1cbiAgICAgIHByZXZTdGF0cyA9IG5ld1N0YXRzO1xuICAgIH1cbiAgfVxuICAvLyBraWNrIG9mZiB0aGUgd2F0Y2hlclxuICBjb25zdCBjbG9zZXIgPSB0aGlzLl93YXRjaFdpdGhOb2RlRnMoZmlsZSwgbGlzdGVuZXIpO1xuXG4gIC8vIGVtaXQgYW4gYWRkIGV2ZW50IGlmIHdlJ3JlIHN1cHBvc2VkIHRvXG4gIGlmICghKGluaXRpYWxBZGQgJiYgdGhpcy5mc3cub3B0aW9ucy5pZ25vcmVJbml0aWFsKSAmJiB0aGlzLmZzdy5faXNudElnbm9yZWQoZmlsZSkpIHtcbiAgICBpZiAoIXRoaXMuZnN3Ll90aHJvdHRsZShFVl9BREQsIGZpbGUsIDApKSByZXR1cm47XG4gICAgdGhpcy5mc3cuX2VtaXQoRVZfQURELCBmaWxlLCBzdGF0cyk7XG4gIH1cblxuICByZXR1cm4gY2xvc2VyO1xufVxuXG4vKipcbiAqIEhhbmRsZSBzeW1saW5rcyBlbmNvdW50ZXJlZCB3aGlsZSByZWFkaW5nIGEgZGlyLlxuICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IHJldHVybmVkIGJ5IHJlYWRkaXJwXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlyZWN0b3J5IHBhdGggb2YgZGlyIGJlaW5nIHJlYWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIG9mIHRoaXMgaXRlbVxuICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gYmFzZW5hbWUgb2YgdGhpcyBpdGVtXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCb29sZWFuPn0gdHJ1ZSBpZiBubyBtb3JlIHByb2Nlc3NpbmcgaXMgbmVlZGVkIGZvciB0aGlzIGVudHJ5LlxuICovXG5hc3luYyBfaGFuZGxlU3ltbGluayhlbnRyeSwgZGlyZWN0b3J5LCBwYXRoLCBpdGVtKSB7XG4gIGlmICh0aGlzLmZzdy5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZnVsbCA9IGVudHJ5LmZ1bGxQYXRoO1xuICBjb25zdCBkaXIgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihkaXJlY3RvcnkpO1xuXG4gIGlmICghdGhpcy5mc3cub3B0aW9ucy5mb2xsb3dTeW1saW5rcykge1xuICAgIC8vIHdhdGNoIHN5bWxpbmsgZGlyZWN0bHkgKGRvbid0IGZvbGxvdykgYW5kIGRldGVjdCBjaGFuZ2VzXG4gICAgdGhpcy5mc3cuX2luY3JSZWFkeUNvdW50KCk7XG4gICAgY29uc3QgbGlua1BhdGggPSBhd2FpdCBmc3JlYWxwYXRoKHBhdGgpO1xuICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAoZGlyLmhhcyhpdGVtKSkge1xuICAgICAgaWYgKHRoaXMuZnN3Ll9zeW1saW5rUGF0aHMuZ2V0KGZ1bGwpICE9PSBsaW5rUGF0aCkge1xuICAgICAgICB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLnNldChmdWxsLCBsaW5rUGF0aCk7XG4gICAgICAgIHRoaXMuZnN3Ll9lbWl0KEVWX0NIQU5HRSwgcGF0aCwgZW50cnkuc3RhdHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkaXIuYWRkKGl0ZW0pO1xuICAgICAgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5zZXQoZnVsbCwgbGlua1BhdGgpO1xuICAgICAgdGhpcy5mc3cuX2VtaXQoRVZfQURELCBwYXRoLCBlbnRyeS5zdGF0cyk7XG4gICAgfVxuICAgIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGRvbid0IGZvbGxvdyB0aGUgc2FtZSBzeW1saW5rIG1vcmUgdGhhbiBvbmNlXG4gIGlmICh0aGlzLmZzdy5fc3ltbGlua1BhdGhzLmhhcyhmdWxsKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5zZXQoZnVsbCwgdHJ1ZSk7XG59XG5cbl9oYW5kbGVSZWFkKGRpcmVjdG9yeSwgaW5pdGlhbEFkZCwgd2gsIHRhcmdldCwgZGlyLCBkZXB0aCwgdGhyb3R0bGVyKSB7XG4gIC8vIE5vcm1hbGl6ZSB0aGUgZGlyZWN0b3J5IG5hbWUgb24gV2luZG93c1xuICBkaXJlY3RvcnkgPSBzeXNQYXRoLmpvaW4oZGlyZWN0b3J5LCBFTVBUWV9TVFIpO1xuXG4gIGlmICghd2guaGFzR2xvYikge1xuICAgIHRocm90dGxlciA9IHRoaXMuZnN3Ll90aHJvdHRsZSgncmVhZGRpcicsIGRpcmVjdG9yeSwgMTAwMCk7XG4gICAgaWYgKCF0aHJvdHRsZXIpIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHByZXZpb3VzID0gdGhpcy5mc3cuX2dldFdhdGNoZWREaXIod2gucGF0aCk7XG4gIGNvbnN0IGN1cnJlbnQgPSBuZXcgU2V0KCk7XG5cbiAgbGV0IHN0cmVhbSA9IHRoaXMuZnN3Ll9yZWFkZGlycChkaXJlY3RvcnksIHtcbiAgICBmaWxlRmlsdGVyOiBlbnRyeSA9PiB3aC5maWx0ZXJQYXRoKGVudHJ5KSxcbiAgICBkaXJlY3RvcnlGaWx0ZXI6IGVudHJ5ID0+IHdoLmZpbHRlckRpcihlbnRyeSksXG4gICAgZGVwdGg6IDBcbiAgfSkub24oU1RSX0RBVEEsIGFzeW5jIChlbnRyeSkgPT4ge1xuICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHtcbiAgICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXRlbSA9IGVudHJ5LnBhdGg7XG4gICAgbGV0IHBhdGggPSBzeXNQYXRoLmpvaW4oZGlyZWN0b3J5LCBpdGVtKTtcbiAgICBjdXJyZW50LmFkZChpdGVtKTtcblxuICAgIGlmIChlbnRyeS5zdGF0cy5pc1N5bWJvbGljTGluaygpICYmIGF3YWl0IHRoaXMuX2hhbmRsZVN5bWxpbmsoZW50cnksIGRpcmVjdG9yeSwgcGF0aCwgaXRlbSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgICBzdHJlYW0gPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIEZpbGVzIHRoYXQgcHJlc2VudCBpbiBjdXJyZW50IGRpcmVjdG9yeSBzbmFwc2hvdFxuICAgIC8vIGJ1dCBhYnNlbnQgaW4gcHJldmlvdXMgYXJlIGFkZGVkIHRvIHdhdGNoIGxpc3QgYW5kXG4gICAgLy8gZW1pdCBgYWRkYCBldmVudC5cbiAgICBpZiAoaXRlbSA9PT0gdGFyZ2V0IHx8ICF0YXJnZXQgJiYgIXByZXZpb3VzLmhhcyhpdGVtKSkge1xuICAgICAgdGhpcy5mc3cuX2luY3JSZWFkeUNvdW50KCk7XG5cbiAgICAgIC8vIGVuc3VyZSByZWxhdGl2ZW5lc3Mgb2YgcGF0aCBpcyBwcmVzZXJ2ZWQgaW4gY2FzZSBvZiB3YXRjaGVyIHJldXNlXG4gICAgICBwYXRoID0gc3lzUGF0aC5qb2luKGRpciwgc3lzUGF0aC5yZWxhdGl2ZShkaXIsIHBhdGgpKTtcblxuICAgICAgdGhpcy5fYWRkVG9Ob2RlRnMocGF0aCwgaW5pdGlhbEFkZCwgd2gsIGRlcHRoICsgMSk7XG4gICAgfVxuICB9KS5vbihFVl9FUlJPUiwgdGhpcy5fYm91bmRIYW5kbGVFcnJvcik7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICBzdHJlYW0ub25jZShTVFJfRU5ELCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSB7XG4gICAgICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgd2FzVGhyb3R0bGVkID0gdGhyb3R0bGVyID8gdGhyb3R0bGVyLmNsZWFyKCkgOiBmYWxzZTtcblxuICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICAvLyBGaWxlcyB0aGF0IGFic2VudCBpbiBjdXJyZW50IGRpcmVjdG9yeSBzbmFwc2hvdFxuICAgICAgLy8gYnV0IHByZXNlbnQgaW4gcHJldmlvdXMgZW1pdCBgcmVtb3ZlYCBldmVudFxuICAgICAgLy8gYW5kIGFyZSByZW1vdmVkIGZyb20gQHdhdGNoZWRbZGlyZWN0b3J5XS5cbiAgICAgIHByZXZpb3VzLmdldENoaWxkcmVuKCkuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtICE9PSBkaXJlY3RvcnkgJiZcbiAgICAgICAgICAhY3VycmVudC5oYXMoaXRlbSkgJiZcbiAgICAgICAgICAvLyBpbiBjYXNlIG9mIGludGVyc2VjdGluZyBnbG9icztcbiAgICAgICAgICAvLyBhIHBhdGggbWF5IGhhdmUgYmVlbiBmaWx0ZXJlZCBvdXQgb2YgdGhpcyByZWFkZGlyLCBidXRcbiAgICAgICAgICAvLyBzaG91bGRuJ3QgYmUgcmVtb3ZlZCBiZWNhdXNlIGl0IG1hdGNoZXMgYSBkaWZmZXJlbnQgZ2xvYlxuICAgICAgICAgICghd2guaGFzR2xvYiB8fCB3aC5maWx0ZXJQYXRoKHtcbiAgICAgICAgICAgIGZ1bGxQYXRoOiBzeXNQYXRoLnJlc29sdmUoZGlyZWN0b3J5LCBpdGVtKVxuICAgICAgICAgIH0pKTtcbiAgICAgIH0pLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgdGhpcy5mc3cuX3JlbW92ZShkaXJlY3RvcnksIGl0ZW0pO1xuICAgICAgfSk7XG5cbiAgICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcblxuICAgICAgLy8gb25lIG1vcmUgdGltZSBmb3IgYW55IG1pc3NlZCBpbiBjYXNlIGNoYW5nZXMgY2FtZSBpbiBleHRyZW1lbHkgcXVpY2tseVxuICAgICAgaWYgKHdhc1Rocm90dGxlZCkgdGhpcy5faGFuZGxlUmVhZChkaXJlY3RvcnksIGZhbHNlLCB3aCwgdGFyZ2V0LCBkaXIsIGRlcHRoLCB0aHJvdHRsZXIpO1xuICAgIH0pXG4gICk7XG59XG5cbi8qKlxuICogUmVhZCBkaXJlY3RvcnkgdG8gYWRkIC8gcmVtb3ZlIGZpbGVzIGZyb20gYEB3YXRjaGVkYCBsaXN0IGFuZCByZS1yZWFkIGl0IG9uIGNoYW5nZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBkaXIgZnMgcGF0aFxuICogQHBhcmFtIHtmcy5TdGF0c30gc3RhdHNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdGlhbEFkZFxuICogQHBhcmFtIHtOdW1iZXJ9IGRlcHRoIHJlbGF0aXZlIHRvIHVzZXItc3VwcGxpZWQgcGF0aFxuICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldCBjaGlsZCBwYXRoIHRhcmdldGVkIGZvciB3YXRjaFxuICogQHBhcmFtIHtPYmplY3R9IHdoIENvbW1vbiB3YXRjaCBoZWxwZXJzIGZvciB0aGlzIHBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWFscGF0aFxuICogQHJldHVybnMge1Byb21pc2U8RnVuY3Rpb24+fSBjbG9zZXIgZm9yIHRoZSB3YXRjaGVyIGluc3RhbmNlLlxuICovXG5hc3luYyBfaGFuZGxlRGlyKGRpciwgc3RhdHMsIGluaXRpYWxBZGQsIGRlcHRoLCB0YXJnZXQsIHdoLCByZWFscGF0aCkge1xuICBjb25zdCBwYXJlbnREaXIgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihzeXNQYXRoLmRpcm5hbWUoZGlyKSk7XG4gIGNvbnN0IHRyYWNrZWQgPSBwYXJlbnREaXIuaGFzKHN5c1BhdGguYmFzZW5hbWUoZGlyKSk7XG4gIGlmICghKGluaXRpYWxBZGQgJiYgdGhpcy5mc3cub3B0aW9ucy5pZ25vcmVJbml0aWFsKSAmJiAhdGFyZ2V0ICYmICF0cmFja2VkKSB7XG4gICAgaWYgKCF3aC5oYXNHbG9iIHx8IHdoLmdsb2JGaWx0ZXIoZGlyKSkgdGhpcy5mc3cuX2VtaXQoRVZfQUREX0RJUiwgZGlyLCBzdGF0cyk7XG4gIH1cblxuICAvLyBlbnN1cmUgZGlyIGlzIHRyYWNrZWQgKGhhcm1sZXNzIGlmIHJlZHVuZGFudClcbiAgcGFyZW50RGlyLmFkZChzeXNQYXRoLmJhc2VuYW1lKGRpcikpO1xuICB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihkaXIpO1xuICBsZXQgdGhyb3R0bGVyO1xuICBsZXQgY2xvc2VyO1xuXG4gIGNvbnN0IG9EZXB0aCA9IHRoaXMuZnN3Lm9wdGlvbnMuZGVwdGg7XG4gIGlmICgob0RlcHRoID09IG51bGwgfHwgZGVwdGggPD0gb0RlcHRoKSAmJiAhdGhpcy5mc3cuX3N5bWxpbmtQYXRocy5oYXMocmVhbHBhdGgpKSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZVJlYWQoZGlyLCBpbml0aWFsQWRkLCB3aCwgdGFyZ2V0LCBkaXIsIGRlcHRoLCB0aHJvdHRsZXIpO1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgIH1cblxuICAgIGNsb3NlciA9IHRoaXMuX3dhdGNoV2l0aE5vZGVGcyhkaXIsIChkaXJQYXRoLCBzdGF0cykgPT4ge1xuICAgICAgLy8gaWYgY3VycmVudCBkaXJlY3RvcnkgaXMgcmVtb3ZlZCwgZG8gbm90aGluZ1xuICAgICAgaWYgKHN0YXRzICYmIHN0YXRzLm10aW1lTXMgPT09IDApIHJldHVybjtcblxuICAgICAgdGhpcy5faGFuZGxlUmVhZChkaXJQYXRoLCBmYWxzZSwgd2gsIHRhcmdldCwgZGlyLCBkZXB0aCwgdGhyb3R0bGVyKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gY2xvc2VyO1xufVxuXG4vKipcbiAqIEhhbmRsZSBhZGRlZCBmaWxlLCBkaXJlY3RvcnksIG9yIGdsb2IgcGF0dGVybi5cbiAqIERlbGVnYXRlcyBjYWxsIHRvIF9oYW5kbGVGaWxlIC8gX2hhbmRsZURpciBhZnRlciBjaGVja3MuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCB0byBmaWxlIG9yIGlyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWxBZGQgd2FzIHRoZSBmaWxlIGFkZGVkIGF0IHdhdGNoIGluc3RhbnRpYXRpb24/XG4gKiBAcGFyYW0ge09iamVjdH0gcHJpb3JXaCBkZXB0aCByZWxhdGl2ZSB0byB1c2VyLXN1cHBsaWVkIHBhdGhcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZXB0aCBDaGlsZCBwYXRoIGFjdHVhbGx5IHRhcmdldGVkIGZvciB3YXRjaFxuICogQHBhcmFtIHtTdHJpbmc9fSB0YXJnZXQgQ2hpbGQgcGF0aCBhY3R1YWxseSB0YXJnZXRlZCBmb3Igd2F0Y2hcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5hc3luYyBfYWRkVG9Ob2RlRnMocGF0aCwgaW5pdGlhbEFkZCwgcHJpb3JXaCwgZGVwdGgsIHRhcmdldCkge1xuICBjb25zdCByZWFkeSA9IHRoaXMuZnN3Ll9lbWl0UmVhZHk7XG4gIGlmICh0aGlzLmZzdy5faXNJZ25vcmVkKHBhdGgpIHx8IHRoaXMuZnN3LmNsb3NlZCkge1xuICAgIHJlYWR5KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgd2ggPSB0aGlzLmZzdy5fZ2V0V2F0Y2hIZWxwZXJzKHBhdGgsIGRlcHRoKTtcbiAgaWYgKCF3aC5oYXNHbG9iICYmIHByaW9yV2gpIHtcbiAgICB3aC5oYXNHbG9iID0gcHJpb3JXaC5oYXNHbG9iO1xuICAgIHdoLmdsb2JGaWx0ZXIgPSBwcmlvcldoLmdsb2JGaWx0ZXI7XG4gICAgd2guZmlsdGVyUGF0aCA9IGVudHJ5ID0+IHByaW9yV2guZmlsdGVyUGF0aChlbnRyeSk7XG4gICAgd2guZmlsdGVyRGlyID0gZW50cnkgPT4gcHJpb3JXaC5maWx0ZXJEaXIoZW50cnkpO1xuICB9XG5cbiAgLy8gZXZhbHVhdGUgd2hhdCBpcyBhdCB0aGUgcGF0aCB3ZSdyZSBiZWluZyBhc2tlZCB0byB3YXRjaFxuICB0cnkge1xuICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgc3RhdE1ldGhvZHNbd2guc3RhdE1ldGhvZF0od2gud2F0Y2hQYXRoKTtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZnN3Ll9pc0lnbm9yZWQod2gud2F0Y2hQYXRoLCBzdGF0cykpIHtcbiAgICAgIHJlYWR5KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZm9sbG93ID0gdGhpcy5mc3cub3B0aW9ucy5mb2xsb3dTeW1saW5rcyAmJiAhcGF0aC5pbmNsdWRlcyhTVEFSKSAmJiAhcGF0aC5pbmNsdWRlcyhCUkFDRV9TVEFSVCk7XG4gICAgbGV0IGNsb3NlcjtcbiAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgY29uc3QgYWJzUGF0aCA9IHN5c1BhdGgucmVzb2x2ZShwYXRoKTtcbiAgICAgIGNvbnN0IHRhcmdldFBhdGggPSBmb2xsb3cgPyBhd2FpdCBmc3JlYWxwYXRoKHBhdGgpIDogcGF0aDtcbiAgICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICAgIGNsb3NlciA9IGF3YWl0IHRoaXMuX2hhbmRsZURpcih3aC53YXRjaFBhdGgsIHN0YXRzLCBpbml0aWFsQWRkLCBkZXB0aCwgdGFyZ2V0LCB3aCwgdGFyZ2V0UGF0aCk7XG4gICAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgICAvLyBwcmVzZXJ2ZSB0aGlzIHN5bWxpbmsncyB0YXJnZXQgcGF0aFxuICAgICAgaWYgKGFic1BhdGggIT09IHRhcmdldFBhdGggJiYgdGFyZ2V0UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuZnN3Ll9zeW1saW5rUGF0aHMuc2V0KGFic1BhdGgsIHRhcmdldFBhdGgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgY29uc3QgdGFyZ2V0UGF0aCA9IGZvbGxvdyA/IGF3YWl0IGZzcmVhbHBhdGgocGF0aCkgOiBwYXRoO1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgICAgY29uc3QgcGFyZW50ID0gc3lzUGF0aC5kaXJuYW1lKHdoLndhdGNoUGF0aCk7XG4gICAgICB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihwYXJlbnQpLmFkZCh3aC53YXRjaFBhdGgpO1xuICAgICAgdGhpcy5mc3cuX2VtaXQoRVZfQURELCB3aC53YXRjaFBhdGgsIHN0YXRzKTtcbiAgICAgIGNsb3NlciA9IGF3YWl0IHRoaXMuX2hhbmRsZURpcihwYXJlbnQsIHN0YXRzLCBpbml0aWFsQWRkLCBkZXB0aCwgcGF0aCwgd2gsIHRhcmdldFBhdGgpO1xuICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuXG4gICAgICAvLyBwcmVzZXJ2ZSB0aGlzIHN5bWxpbmsncyB0YXJnZXQgcGF0aFxuICAgICAgaWYgKHRhcmdldFBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLnNldChzeXNQYXRoLnJlc29sdmUocGF0aCksIHRhcmdldFBhdGgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZXIgPSB0aGlzLl9oYW5kbGVGaWxlKHdoLndhdGNoUGF0aCwgc3RhdHMsIGluaXRpYWxBZGQpO1xuICAgIH1cbiAgICByZWFkeSgpO1xuXG4gICAgdGhpcy5mc3cuX2FkZFBhdGhDbG9zZXIocGF0aCwgY2xvc2VyKTtcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAodGhpcy5mc3cuX2hhbmRsZUVycm9yKGVycm9yKSkge1xuICAgICAgcmVhZHkoKTtcbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH1cbiAgfVxufVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZUZzSGFuZGxlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3Qgc3lzUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IHsgcHJvbWlzaWZ5IH0gPSByZXF1aXJlKCd1dGlsJyk7XG5cbmxldCBmc2V2ZW50cztcbnRyeSB7XG4gIGZzZXZlbnRzID0gcmVxdWlyZSgnZnNldmVudHMnKTtcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGlmIChwcm9jZXNzLmVudi5DSE9LSURBUl9QUklOVF9GU0VWRU5UU19SRVFVSVJFX0VSUk9SKSBjb25zb2xlLmVycm9yKGVycm9yKTtcbn1cblxuaWYgKGZzZXZlbnRzKSB7XG4gIC8vIFRPRE86IHJlYWwgY2hlY2tcbiAgY29uc3QgbXRjaCA9IHByb2Nlc3MudmVyc2lvbi5tYXRjaCgvdihcXGQrKVxcLihcXGQrKS8pO1xuICBpZiAobXRjaCAmJiBtdGNoWzFdICYmIG10Y2hbMl0pIHtcbiAgICBjb25zdCBtYWogPSBOdW1iZXIucGFyc2VJbnQobXRjaFsxXSwgMTApO1xuICAgIGNvbnN0IG1pbiA9IE51bWJlci5wYXJzZUludChtdGNoWzJdLCAxMCk7XG4gICAgaWYgKG1haiA9PT0gOCAmJiBtaW4gPCAxNikge1xuICAgICAgZnNldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHtcbiAgRVZfQURELFxuICBFVl9DSEFOR0UsXG4gIEVWX0FERF9ESVIsXG4gIEVWX1VOTElOSyxcbiAgRVZfRVJST1IsXG4gIFNUUl9EQVRBLFxuICBTVFJfRU5ELFxuICBGU0VWRU5UX0NSRUFURUQsXG4gIEZTRVZFTlRfTU9ESUZJRUQsXG4gIEZTRVZFTlRfREVMRVRFRCxcbiAgRlNFVkVOVF9NT1ZFRCxcbiAgLy8gRlNFVkVOVF9DTE9ORUQsXG4gIEZTRVZFTlRfVU5LTk9XTixcbiAgRlNFVkVOVF9UWVBFX0ZJTEUsXG4gIEZTRVZFTlRfVFlQRV9ESVJFQ1RPUlksXG4gIEZTRVZFTlRfVFlQRV9TWU1MSU5LLFxuXG4gIFJPT1RfR0xPQlNUQVIsXG4gIERJUl9TVUZGSVgsXG4gIERPVF9TTEFTSCxcbiAgRlVOQ1RJT05fVFlQRSxcbiAgRU1QVFlfRk4sXG4gIElERU5USVRZX0ZOXG59ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3QgRGVwdGggPSAodmFsdWUpID0+IGlzTmFOKHZhbHVlKSA/IHt9IDoge2RlcHRoOiB2YWx1ZX07XG5cbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5jb25zdCBsc3RhdCA9IHByb21pc2lmeShmcy5sc3RhdCk7XG5jb25zdCByZWFscGF0aCA9IHByb21pc2lmeShmcy5yZWFscGF0aCk7XG5cbmNvbnN0IHN0YXRNZXRob2RzID0geyBzdGF0LCBsc3RhdCB9O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtTdHJpbmd9IFBhdGhcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEZzRXZlbnRzV2F0Y2hDb250YWluZXJcbiAqIEBwcm9wZXJ0eSB7U2V0PEZ1bmN0aW9uPn0gbGlzdGVuZXJzXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSByYXdFbWl0dGVyXG4gKiBAcHJvcGVydHkge3tzdG9wOiBGdW5jdGlvbn19IHdhdGNoZXJcbiAqL1xuXG4vLyBmc2V2ZW50cyBpbnN0YW5jZSBoZWxwZXIgZnVuY3Rpb25zXG4vKipcbiAqIE9iamVjdCB0byBob2xkIHBlci1wcm9jZXNzIGZzZXZlbnRzIGluc3RhbmNlcyAobWF5IGJlIHNoYXJlZCBhY3Jvc3MgY2hva2lkYXIgRlNXYXRjaGVyIGluc3RhbmNlcylcbiAqIEB0eXBlIHtNYXA8UGF0aCxGc0V2ZW50c1dhdGNoQ29udGFpbmVyPn1cbiAqL1xuY29uc3QgRlNFdmVudHNXYXRjaGVycyA9IG5ldyBNYXAoKTtcblxuLy8gVGhyZXNob2xkIG9mIGR1cGxpY2F0ZSBwYXRoIHByZWZpeGVzIGF0IHdoaWNoIHRvIHN0YXJ0XG4vLyBjb25zb2xpZGF0aW5nIGdvaW5nIGZvcndhcmRcbmNvbnN0IGNvbnNvbGlkYXRlVGhyZXNoaG9sZCA9IDEwO1xuXG5jb25zdCB3cm9uZ0V2ZW50RmxhZ3MgPSBuZXcgU2V0KFtcbiAgNjk4ODgsIDcwNDAwLCA3MTQyNCwgNzI3MDQsIDczNDcyLCAxMzEzMjgsIDEzMTg0MCwgMjYyOTEyXG5dKTtcblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgdGhlIGZzZXZlbnRzIGludGVyZmFjZVxuICogQHBhcmFtIHtQYXRofSBwYXRoIHBhdGggdG8gYmUgd2F0Y2hlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgY2FsbGVkIHdoZW4gZnNldmVudHMgaXMgYm91bmQgYW5kIHJlYWR5XG4gKiBAcmV0dXJucyB7e3N0b3A6IEZ1bmN0aW9ufX0gbmV3IGZzZXZlbnRzIGluc3RhbmNlXG4gKi9cbmNvbnN0IGNyZWF0ZUZTRXZlbnRzSW5zdGFuY2UgPSAocGF0aCwgY2FsbGJhY2spID0+IHtcbiAgY29uc3Qgc3RvcCA9IGZzZXZlbnRzLndhdGNoKHBhdGgsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHtzdG9wfTtcbn07XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHRoZSBmc2V2ZW50cyBpbnRlcmZhY2Ugb3IgYmluZHMgbGlzdGVuZXJzIHRvIGFuIGV4aXN0aW5nIG9uZSBjb3ZlcmluZ1xuICogdGhlIHNhbWUgZmlsZSB0cmVlLlxuICogQHBhcmFtIHtQYXRofSBwYXRoICAgICAgICAgICAtIHRvIGJlIHdhdGNoZWRcbiAqIEBwYXJhbSB7UGF0aH0gcmVhbFBhdGggICAgICAgLSByZWFsIHBhdGggZm9yIHN5bWxpbmtzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAgIC0gY2FsbGVkIHdoZW4gZnNldmVudHMgZW1pdHMgZXZlbnRzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByYXdFbWl0dGVyIC0gcGFzc2VzIGRhdGEgdG8gbGlzdGVuZXJzIG9mIHRoZSAncmF3JyBldmVudFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBjbG9zZXJcbiAqL1xuZnVuY3Rpb24gc2V0RlNFdmVudHNMaXN0ZW5lcihwYXRoLCByZWFsUGF0aCwgbGlzdGVuZXIsIHJhd0VtaXR0ZXIpIHtcbiAgbGV0IHdhdGNoUGF0aCA9IHN5c1BhdGguZXh0bmFtZShwYXRoKSA/IHN5c1BhdGguZGlybmFtZShwYXRoKSA6IHBhdGg7XG4gIGNvbnN0IHBhcmVudFBhdGggPSBzeXNQYXRoLmRpcm5hbWUod2F0Y2hQYXRoKTtcbiAgbGV0IGNvbnQgPSBGU0V2ZW50c1dhdGNoZXJzLmdldCh3YXRjaFBhdGgpO1xuXG4gIC8vIElmIHdlJ3ZlIGFjY3VtdWxhdGVkIGEgc3Vic3RhbnRpYWwgbnVtYmVyIG9mIHBhdGhzIHRoYXRcbiAgLy8gY291bGQgaGF2ZSBiZWVuIGNvbnNvbGlkYXRlZCBieSB3YXRjaGluZyBvbmUgZGlyZWN0b3J5XG4gIC8vIGFib3ZlIHRoZSBjdXJyZW50IG9uZSwgY3JlYXRlIGEgd2F0Y2hlciBvbiB0aGUgcGFyZW50XG4gIC8vIHBhdGggaW5zdGVhZCwgc28gdGhhdCB3ZSBkbyBjb25zb2xpZGF0ZSBnb2luZyBmb3J3YXJkLlxuICBpZiAoY291bGRDb25zb2xpZGF0ZShwYXJlbnRQYXRoKSkge1xuICAgIHdhdGNoUGF0aCA9IHBhcmVudFBhdGg7XG4gIH1cblxuICBjb25zdCByZXNvbHZlZFBhdGggPSBzeXNQYXRoLnJlc29sdmUocGF0aCk7XG4gIGNvbnN0IGhhc1N5bWxpbmsgPSByZXNvbHZlZFBhdGggIT09IHJlYWxQYXRoO1xuXG4gIGNvbnN0IGZpbHRlcmVkTGlzdGVuZXIgPSAoZnVsbFBhdGgsIGZsYWdzLCBpbmZvKSA9PiB7XG4gICAgaWYgKGhhc1N5bWxpbmspIGZ1bGxQYXRoID0gZnVsbFBhdGgucmVwbGFjZShyZWFsUGF0aCwgcmVzb2x2ZWRQYXRoKTtcbiAgICBpZiAoXG4gICAgICBmdWxsUGF0aCA9PT0gcmVzb2x2ZWRQYXRoIHx8XG4gICAgICAhZnVsbFBhdGguaW5kZXhPZihyZXNvbHZlZFBhdGggKyBzeXNQYXRoLnNlcClcbiAgICApIGxpc3RlbmVyKGZ1bGxQYXRoLCBmbGFncywgaW5mbyk7XG4gIH07XG5cbiAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHdhdGNoZXIgb24gYSBwYXJlbnQgcGF0aFxuICAvLyBtb2RpZmllcyBgd2F0Y2hQYXRoYCB0byB0aGUgcGFyZW50IHBhdGggd2hlbiBpdCBmaW5kcyBhIG1hdGNoXG4gIGxldCB3YXRjaGVkUGFyZW50ID0gZmFsc2U7XG4gIGZvciAoY29uc3Qgd2F0Y2hlZFBhdGggb2YgRlNFdmVudHNXYXRjaGVycy5rZXlzKCkpIHtcbiAgICBpZiAocmVhbFBhdGguaW5kZXhPZihzeXNQYXRoLnJlc29sdmUod2F0Y2hlZFBhdGgpICsgc3lzUGF0aC5zZXApID09PSAwKSB7XG4gICAgICB3YXRjaFBhdGggPSB3YXRjaGVkUGF0aDtcbiAgICAgIGNvbnQgPSBGU0V2ZW50c1dhdGNoZXJzLmdldCh3YXRjaFBhdGgpO1xuICAgICAgd2F0Y2hlZFBhcmVudCA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoY29udCB8fCB3YXRjaGVkUGFyZW50KSB7XG4gICAgY29udC5saXN0ZW5lcnMuYWRkKGZpbHRlcmVkTGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIGNvbnQgPSB7XG4gICAgICBsaXN0ZW5lcnM6IG5ldyBTZXQoW2ZpbHRlcmVkTGlzdGVuZXJdKSxcbiAgICAgIHJhd0VtaXR0ZXIsXG4gICAgICB3YXRjaGVyOiBjcmVhdGVGU0V2ZW50c0luc3RhbmNlKHdhdGNoUGF0aCwgKGZ1bGxQYXRoLCBmbGFncykgPT4ge1xuICAgICAgICBpZiAoIWNvbnQubGlzdGVuZXJzLnNpemUpIHJldHVybjtcbiAgICAgICAgY29uc3QgaW5mbyA9IGZzZXZlbnRzLmdldEluZm8oZnVsbFBhdGgsIGZsYWdzKTtcbiAgICAgICAgY29udC5saXN0ZW5lcnMuZm9yRWFjaChsaXN0ID0+IHtcbiAgICAgICAgICBsaXN0KGZ1bGxQYXRoLCBmbGFncywgaW5mbyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnQucmF3RW1pdHRlcihpbmZvLmV2ZW50LCBmdWxsUGF0aCwgaW5mbyk7XG4gICAgICB9KVxuICAgIH07XG4gICAgRlNFdmVudHNXYXRjaGVycy5zZXQod2F0Y2hQYXRoLCBjb250KTtcbiAgfVxuXG4gIC8vIHJlbW92ZXMgdGhpcyBpbnN0YW5jZSdzIGxpc3RlbmVycyBhbmQgY2xvc2VzIHRoZSB1bmRlcmx5aW5nIGZzZXZlbnRzXG4gIC8vIGluc3RhbmNlIGlmIHRoZXJlIGFyZSBubyBtb3JlIGxpc3RlbmVycyBsZWZ0XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY29uc3QgbHN0ID0gY29udC5saXN0ZW5lcnM7XG5cbiAgICBsc3QuZGVsZXRlKGZpbHRlcmVkTGlzdGVuZXIpO1xuICAgIGlmICghbHN0LnNpemUpIHtcbiAgICAgIEZTRXZlbnRzV2F0Y2hlcnMuZGVsZXRlKHdhdGNoUGF0aCk7XG4gICAgICBpZiAoY29udC53YXRjaGVyKSByZXR1cm4gY29udC53YXRjaGVyLnN0b3AoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29udC5yYXdFbWl0dGVyID0gY29udC53YXRjaGVyID0gdW5kZWZpbmVkO1xuICAgICAgICBPYmplY3QuZnJlZXplKGNvbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBEZWNpZGUgd2hldGhlciBvciBub3Qgd2Ugc2hvdWxkIHN0YXJ0IGEgbmV3IGhpZ2hlci1sZXZlbFxuLy8gcGFyZW50IHdhdGNoZXJcbmNvbnN0IGNvdWxkQ29uc29saWRhdGUgPSAocGF0aCkgPT4ge1xuICBsZXQgY291bnQgPSAwO1xuICBmb3IgKGNvbnN0IHdhdGNoUGF0aCBvZiBGU0V2ZW50c1dhdGNoZXJzLmtleXMoKSkge1xuICAgIGlmICh3YXRjaFBhdGguaW5kZXhPZihwYXRoKSA9PT0gMCkge1xuICAgICAgY291bnQrKztcbiAgICAgIGlmIChjb3VudCA+PSBjb25zb2xpZGF0ZVRocmVzaGhvbGQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciBmc2V2ZW50cyBjYW4gYmUgdXNlZFxuY29uc3QgY2FuVXNlID0gKCkgPT4gZnNldmVudHMgJiYgRlNFdmVudHNXYXRjaGVycy5zaXplIDwgMTI4O1xuXG4vLyBkZXRlcm1pbmVzIHN1YmRpcmVjdG9yeSB0cmF2ZXJzYWwgbGV2ZWxzIGZyb20gcm9vdCB0byBwYXRoXG5jb25zdCBjYWxjRGVwdGggPSAocGF0aCwgcm9vdCkgPT4ge1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlICghcGF0aC5pbmRleE9mKHJvb3QpICYmIChwYXRoID0gc3lzUGF0aC5kaXJuYW1lKHBhdGgpKSAhPT0gcm9vdCkgaSsrO1xuICByZXR1cm4gaTtcbn07XG5cbi8vIHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGZzZXZlbnRzJyBldmVudCBpbmZvIGhhcyB0aGUgc2FtZSB0eXBlXG4vLyBhcyB0aGUgb25lIHJldHVybmVkIGJ5IGZzLnN0YXRcbmNvbnN0IHNhbWVUeXBlcyA9IChpbmZvLCBzdGF0cykgPT4gKFxuICBpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9ESVJFQ1RPUlkgJiYgc3RhdHMuaXNEaXJlY3RvcnkoKSB8fFxuICBpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9TWU1MSU5LICYmIHN0YXRzLmlzU3ltYm9saWNMaW5rKCkgfHxcbiAgaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfRklMRSAmJiBzdGF0cy5pc0ZpbGUoKVxuKVxuXG4vKipcbiAqIEBtaXhpblxuICovXG5jbGFzcyBGc0V2ZW50c0hhbmRsZXIge1xuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9pbmRleCcpLkZTV2F0Y2hlcn0gZnN3XG4gKi9cbmNvbnN0cnVjdG9yKGZzdykge1xuICB0aGlzLmZzdyA9IGZzdztcbn1cbmNoZWNrSWdub3JlZChwYXRoLCBzdGF0cykge1xuICBjb25zdCBpcGF0aHMgPSB0aGlzLmZzdy5faWdub3JlZFBhdGhzO1xuICBpZiAodGhpcy5mc3cuX2lzSWdub3JlZChwYXRoLCBzdGF0cykpIHtcbiAgICBpcGF0aHMuYWRkKHBhdGgpO1xuICAgIGlmIChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBpcGF0aHMuYWRkKHBhdGggKyBST09UX0dMT0JTVEFSKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpcGF0aHMuZGVsZXRlKHBhdGgpO1xuICBpcGF0aHMuZGVsZXRlKHBhdGggKyBST09UX0dMT0JTVEFSKTtcbn1cblxuYWRkT3JDaGFuZ2UocGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpIHtcbiAgY29uc3QgZXZlbnQgPSB3YXRjaGVkRGlyLmhhcyhpdGVtKSA/IEVWX0NIQU5HRSA6IEVWX0FERDtcbiAgdGhpcy5oYW5kbGVFdmVudChldmVudCwgcGF0aCwgZnVsbFBhdGgsIHJlYWxQYXRoLCBwYXJlbnQsIHdhdGNoZWREaXIsIGl0ZW0sIGluZm8sIG9wdHMpO1xufVxuXG5hc3luYyBjaGVja0V4aXN0cyhwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cykge1xuICB0cnkge1xuICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgc3RhdChwYXRoKVxuICAgIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAoc2FtZVR5cGVzKGluZm8sIHN0YXRzKSkge1xuICAgICAgdGhpcy5hZGRPckNoYW5nZShwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlRXZlbnQoRVZfVU5MSU5LLCBwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvci5jb2RlID09PSAnRUFDQ0VTJykge1xuICAgICAgdGhpcy5hZGRPckNoYW5nZShwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlRXZlbnQoRVZfVU5MSU5LLCBwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgfVxuICB9XG59XG5cbmhhbmRsZUV2ZW50KGV2ZW50LCBwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cykge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkIHx8IHRoaXMuY2hlY2tJZ25vcmVkKHBhdGgpKSByZXR1cm47XG5cbiAgaWYgKGV2ZW50ID09PSBFVl9VTkxJTkspIHtcbiAgICBjb25zdCBpc0RpcmVjdG9yeSA9IGluZm8udHlwZSA9PT0gRlNFVkVOVF9UWVBFX0RJUkVDVE9SWVxuICAgIC8vIHN1cHByZXNzIHVubGluayBldmVudHMgb24gbmV2ZXIgYmVmb3JlIHNlZW4gZmlsZXNcbiAgICBpZiAoaXNEaXJlY3RvcnkgfHwgd2F0Y2hlZERpci5oYXMoaXRlbSkpIHtcbiAgICAgIHRoaXMuZnN3Ll9yZW1vdmUocGFyZW50LCBpdGVtLCBpc0RpcmVjdG9yeSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChldmVudCA9PT0gRVZfQUREKSB7XG4gICAgICAvLyB0cmFjayBuZXcgZGlyZWN0b3JpZXNcbiAgICAgIGlmIChpbmZvLnR5cGUgPT09IEZTRVZFTlRfVFlQRV9ESVJFQ1RPUlkpIHRoaXMuZnN3Ll9nZXRXYXRjaGVkRGlyKHBhdGgpO1xuXG4gICAgICBpZiAoaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfU1lNTElOSyAmJiBvcHRzLmZvbGxvd1N5bWxpbmtzKSB7XG4gICAgICAgIC8vIHB1c2ggc3ltbGlua3MgYmFjayB0byB0aGUgdG9wIG9mIHRoZSBzdGFjayB0byBnZXQgaGFuZGxlZFxuICAgICAgICBjb25zdCBjdXJEZXB0aCA9IG9wdHMuZGVwdGggPT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgdW5kZWZpbmVkIDogY2FsY0RlcHRoKGZ1bGxQYXRoLCByZWFsUGF0aCkgKyAxO1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkVG9Gc0V2ZW50cyhwYXRoLCBmYWxzZSwgdHJ1ZSwgY3VyRGVwdGgpO1xuICAgICAgfVxuXG4gICAgICAvLyB0cmFjayBuZXcgcGF0aHNcbiAgICAgIC8vIChvdGhlciB0aGFuIHN5bWxpbmtzIGJlaW5nIGZvbGxvd2VkLCB3aGljaCB3aWxsIGJlIHRyYWNrZWQgc29vbilcbiAgICAgIHRoaXMuZnN3Ll9nZXRXYXRjaGVkRGlyKHBhcmVudCkuYWRkKGl0ZW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7J2FkZCd8J2FkZERpcid8J3VubGluayd8J3VubGlua0Rpcid9XG4gICAgICovXG4gICAgY29uc3QgZXZlbnROYW1lID0gaW5mby50eXBlID09PSBGU0VWRU5UX1RZUEVfRElSRUNUT1JZID8gZXZlbnQgKyBESVJfU1VGRklYIDogZXZlbnQ7XG4gICAgdGhpcy5mc3cuX2VtaXQoZXZlbnROYW1lLCBwYXRoKTtcbiAgICBpZiAoZXZlbnROYW1lID09PSBFVl9BRERfRElSKSB0aGlzLl9hZGRUb0ZzRXZlbnRzKHBhdGgsIGZhbHNlLCB0cnVlKTtcbiAgfVxufVxuXG4vKipcbiAqIEhhbmRsZSBzeW1saW5rcyBlbmNvdW50ZXJlZCBkdXJpbmcgZGlyZWN0b3J5IHNjYW5cbiAqIEBwYXJhbSB7U3RyaW5nfSB3YXRjaFBhdGggIC0gZmlsZS9kaXIgcGF0aCB0byBiZSB3YXRjaGVkIHdpdGggZnNldmVudHNcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWFsUGF0aCAgIC0gcmVhbCBwYXRoIChpbiBjYXNlIG9mIHN5bWxpbmtzKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtICAtIHBhdGggdHJhbnNmb3JtZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdsb2JGaWx0ZXIgLSBwYXRoIGZpbHRlciBpbiBjYXNlIGEgZ2xvYiBwYXR0ZXJuIHdhcyBwcm92aWRlZFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBjbG9zZXIgZm9yIHRoZSB3YXRjaGVyIGluc3RhbmNlXG4qL1xuX3dhdGNoV2l0aEZzRXZlbnRzKHdhdGNoUGF0aCwgcmVhbFBhdGgsIHRyYW5zZm9ybSwgZ2xvYkZpbHRlcikge1xuICBpZiAodGhpcy5mc3cuY2xvc2VkIHx8IHRoaXMuZnN3Ll9pc0lnbm9yZWQod2F0Y2hQYXRoKSkgcmV0dXJuO1xuICBjb25zdCBvcHRzID0gdGhpcy5mc3cub3B0aW9ucztcbiAgY29uc3Qgd2F0Y2hDYWxsYmFjayA9IGFzeW5jIChmdWxsUGF0aCwgZmxhZ3MsIGluZm8pID0+IHtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKFxuICAgICAgb3B0cy5kZXB0aCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBjYWxjRGVwdGgoZnVsbFBhdGgsIHJlYWxQYXRoKSA+IG9wdHMuZGVwdGhcbiAgICApIHJldHVybjtcbiAgICBjb25zdCBwYXRoID0gdHJhbnNmb3JtKHN5c1BhdGguam9pbihcbiAgICAgIHdhdGNoUGF0aCwgc3lzUGF0aC5yZWxhdGl2ZSh3YXRjaFBhdGgsIGZ1bGxQYXRoKVxuICAgICkpO1xuICAgIGlmIChnbG9iRmlsdGVyICYmICFnbG9iRmlsdGVyKHBhdGgpKSByZXR1cm47XG4gICAgLy8gZW5zdXJlIGRpcmVjdG9yaWVzIGFyZSB0cmFja2VkXG4gICAgY29uc3QgcGFyZW50ID0gc3lzUGF0aC5kaXJuYW1lKHBhdGgpO1xuICAgIGNvbnN0IGl0ZW0gPSBzeXNQYXRoLmJhc2VuYW1lKHBhdGgpO1xuICAgIGNvbnN0IHdhdGNoZWREaXIgPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihcbiAgICAgIGluZm8udHlwZSA9PT0gRlNFVkVOVF9UWVBFX0RJUkVDVE9SWSA/IHBhdGggOiBwYXJlbnRcbiAgICApO1xuXG4gICAgLy8gY29ycmVjdCBmb3Igd3JvbmcgZXZlbnRzIGVtaXR0ZWRcbiAgICBpZiAod3JvbmdFdmVudEZsYWdzLmhhcyhmbGFncykgfHwgaW5mby5ldmVudCA9PT0gRlNFVkVOVF9VTktOT1dOKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdHMuaWdub3JlZCA9PT0gRlVOQ1RJT05fVFlQRSkge1xuICAgICAgICBsZXQgc3RhdHM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc3RhdHMgPSBhd2FpdCBzdGF0KHBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5jaGVja0lnbm9yZWQocGF0aCwgc3RhdHMpKSByZXR1cm47XG4gICAgICAgIGlmIChzYW1lVHlwZXMoaW5mbywgc3RhdHMpKSB7XG4gICAgICAgICAgdGhpcy5hZGRPckNoYW5nZShwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVFdmVudChFVl9VTkxJTkssIHBhdGgsIGZ1bGxQYXRoLCByZWFsUGF0aCwgcGFyZW50LCB3YXRjaGVkRGlyLCBpdGVtLCBpbmZvLCBvcHRzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jaGVja0V4aXN0cyhwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoaW5mby5ldmVudCkge1xuICAgICAgY2FzZSBGU0VWRU5UX0NSRUFURUQ6XG4gICAgICBjYXNlIEZTRVZFTlRfTU9ESUZJRUQ6XG4gICAgICAgIHJldHVybiB0aGlzLmFkZE9yQ2hhbmdlKHBhdGgsIGZ1bGxQYXRoLCByZWFsUGF0aCwgcGFyZW50LCB3YXRjaGVkRGlyLCBpdGVtLCBpbmZvLCBvcHRzKTtcbiAgICAgIGNhc2UgRlNFVkVOVF9ERUxFVEVEOlxuICAgICAgY2FzZSBGU0VWRU5UX01PVkVEOlxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja0V4aXN0cyhwYXRoLCBmdWxsUGF0aCwgcmVhbFBhdGgsIHBhcmVudCwgd2F0Y2hlZERpciwgaXRlbSwgaW5mbywgb3B0cyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNsb3NlciA9IHNldEZTRXZlbnRzTGlzdGVuZXIoXG4gICAgd2F0Y2hQYXRoLFxuICAgIHJlYWxQYXRoLFxuICAgIHdhdGNoQ2FsbGJhY2ssXG4gICAgdGhpcy5mc3cuX2VtaXRSYXdcbiAgKTtcblxuICB0aGlzLmZzdy5fZW1pdFJlYWR5KCk7XG4gIHJldHVybiBjbG9zZXI7XG59XG5cbi8qKlxuICogSGFuZGxlIHN5bWxpbmtzIGVuY291bnRlcmVkIGR1cmluZyBkaXJlY3Rvcnkgc2NhblxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmtQYXRoIHBhdGggdG8gc3ltbGlua1xuICogQHBhcmFtIHtTdHJpbmd9IGZ1bGxQYXRoIGFic29sdXRlIHBhdGggdG8gdGhlIHN5bWxpbmtcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBwcmUtZXhpc3RpbmcgcGF0aCB0cmFuc2Zvcm1lclxuICogQHBhcmFtIHtOdW1iZXJ9IGN1ckRlcHRoIGxldmVsIG9mIHN1YmRpcmVjdG9yaWVzIHRyYXZlcnNlZCB0byB3aGVyZSBzeW1saW5rIGlzXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAqL1xuYXN5bmMgX2hhbmRsZUZzRXZlbnRzU3ltbGluayhsaW5rUGF0aCwgZnVsbFBhdGgsIHRyYW5zZm9ybSwgY3VyRGVwdGgpIHtcbiAgLy8gZG9uJ3QgZm9sbG93IHRoZSBzYW1lIHN5bWxpbmsgbW9yZSB0aGFuIG9uY2VcbiAgaWYgKHRoaXMuZnN3LmNsb3NlZCB8fCB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLmhhcyhmdWxsUGF0aCkpIHJldHVybjtcblxuICB0aGlzLmZzdy5fc3ltbGlua1BhdGhzLnNldChmdWxsUGF0aCwgdHJ1ZSk7XG4gIHRoaXMuZnN3Ll9pbmNyUmVhZHlDb3VudCgpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgbGlua1RhcmdldCA9IGF3YWl0IHJlYWxwYXRoKGxpbmtQYXRoKTtcbiAgICBpZiAodGhpcy5mc3cuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZnN3Ll9pc0lnbm9yZWQobGlua1RhcmdldCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmZzdy5fZW1pdFJlYWR5KCk7XG4gICAgfVxuXG4gICAgdGhpcy5mc3cuX2luY3JSZWFkeUNvdW50KCk7XG5cbiAgICAvLyBhZGQgdGhlIGxpbmtUYXJnZXQgZm9yIHdhdGNoaW5nIHdpdGggYSB3cmFwcGVyIGZvciB0cmFuc2Zvcm1cbiAgICAvLyB0aGF0IGNhdXNlcyBlbWl0dGVkIHBhdGhzIHRvIGluY29ycG9yYXRlIHRoZSBsaW5rJ3MgcGF0aFxuICAgIHRoaXMuX2FkZFRvRnNFdmVudHMobGlua1RhcmdldCB8fCBsaW5rUGF0aCwgKHBhdGgpID0+IHtcbiAgICAgIGxldCBhbGlhc2VkUGF0aCA9IGxpbmtQYXRoO1xuICAgICAgaWYgKGxpbmtUYXJnZXQgJiYgbGlua1RhcmdldCAhPT0gRE9UX1NMQVNIKSB7XG4gICAgICAgIGFsaWFzZWRQYXRoID0gcGF0aC5yZXBsYWNlKGxpbmtUYXJnZXQsIGxpbmtQYXRoKTtcbiAgICAgIH0gZWxzZSBpZiAocGF0aCAhPT0gRE9UX1NMQVNIKSB7XG4gICAgICAgIGFsaWFzZWRQYXRoID0gc3lzUGF0aC5qb2luKGxpbmtQYXRoLCBwYXRoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cmFuc2Zvcm0oYWxpYXNlZFBhdGgpO1xuICAgIH0sIGZhbHNlLCBjdXJEZXB0aCk7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBpZiAodGhpcy5mc3cuX2hhbmRsZUVycm9yKGVycm9yKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZnN3Ll9lbWl0UmVhZHkoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtQYXRofSBuZXdQYXRoXG4gKiBAcGFyYW0ge2ZzLlN0YXRzfSBzdGF0c1xuICovXG5lbWl0QWRkKG5ld1BhdGgsIHN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpIHtcbiAgY29uc3QgcHAgPSBwcm9jZXNzUGF0aChuZXdQYXRoKTtcbiAgY29uc3QgaXNEaXIgPSBzdGF0cy5pc0RpcmVjdG9yeSgpO1xuICBjb25zdCBkaXJPYmogPSB0aGlzLmZzdy5fZ2V0V2F0Y2hlZERpcihzeXNQYXRoLmRpcm5hbWUocHApKTtcbiAgY29uc3QgYmFzZSA9IHN5c1BhdGguYmFzZW5hbWUocHApO1xuXG4gIC8vIGVuc3VyZSBlbXB0eSBkaXJzIGdldCB0cmFja2VkXG4gIGlmIChpc0RpcikgdGhpcy5mc3cuX2dldFdhdGNoZWREaXIocHApO1xuICBpZiAoZGlyT2JqLmhhcyhiYXNlKSkgcmV0dXJuO1xuICBkaXJPYmouYWRkKGJhc2UpO1xuXG4gIGlmICghb3B0cy5pZ25vcmVJbml0aWFsIHx8IGZvcmNlQWRkID09PSB0cnVlKSB7XG4gICAgdGhpcy5mc3cuX2VtaXQoaXNEaXIgPyBFVl9BRERfRElSIDogRVZfQURELCBwcCwgc3RhdHMpO1xuICB9XG59XG5cbmluaXRXYXRjaChyZWFsUGF0aCwgcGF0aCwgd2gsIHByb2Nlc3NQYXRoKSB7XG4gIGlmICh0aGlzLmZzdy5jbG9zZWQpIHJldHVybjtcbiAgY29uc3QgY2xvc2VyID0gdGhpcy5fd2F0Y2hXaXRoRnNFdmVudHMoXG4gICAgd2gud2F0Y2hQYXRoLFxuICAgIHN5c1BhdGgucmVzb2x2ZShyZWFsUGF0aCB8fCB3aC53YXRjaFBhdGgpLFxuICAgIHByb2Nlc3NQYXRoLFxuICAgIHdoLmdsb2JGaWx0ZXJcbiAgKTtcbiAgdGhpcy5mc3cuX2FkZFBhdGhDbG9zZXIocGF0aCwgY2xvc2VyKTtcbn1cblxuLyoqXG4gKiBIYW5kbGUgYWRkZWQgcGF0aCB3aXRoIGZzZXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBmaWxlL2RpciBwYXRoIG9yIGdsb2IgcGF0dGVyblxuICogQHBhcmFtIHtGdW5jdGlvbnxCb29sZWFuPX0gdHJhbnNmb3JtIGNvbnZlcnRzIHdvcmtpbmcgcGF0aCB0byB3aGF0IHRoZSB1c2VyIGV4cGVjdHNcbiAqIEBwYXJhbSB7Qm9vbGVhbj19IGZvcmNlQWRkIGVuc3VyZSBhZGQgaXMgZW1pdHRlZFxuICogQHBhcmFtIHtOdW1iZXI9fSBwcmlvckRlcHRoIExldmVsIG9mIHN1YmRpcmVjdG9yaWVzIGFscmVhZHkgdHJhdmVyc2VkLlxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gKi9cbmFzeW5jIF9hZGRUb0ZzRXZlbnRzKHBhdGgsIHRyYW5zZm9ybSwgZm9yY2VBZGQsIHByaW9yRGVwdGgpIHtcbiAgaWYgKHRoaXMuZnN3LmNsb3NlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBvcHRzID0gdGhpcy5mc3cub3B0aW9ucztcbiAgY29uc3QgcHJvY2Vzc1BhdGggPSB0eXBlb2YgdHJhbnNmb3JtID09PSBGVU5DVElPTl9UWVBFID8gdHJhbnNmb3JtIDogSURFTlRJVFlfRk47XG5cbiAgY29uc3Qgd2ggPSB0aGlzLmZzdy5fZ2V0V2F0Y2hIZWxwZXJzKHBhdGgpO1xuXG4gIC8vIGV2YWx1YXRlIHdoYXQgaXMgYXQgdGhlIHBhdGggd2UncmUgYmVpbmcgYXNrZWQgdG8gd2F0Y2hcbiAgdHJ5IHtcbiAgICBjb25zdCBzdGF0cyA9IGF3YWl0IHN0YXRNZXRob2RzW3doLnN0YXRNZXRob2RdKHdoLndhdGNoUGF0aCk7XG4gICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZzdy5faXNJZ25vcmVkKHdoLndhdGNoUGF0aCwgc3RhdHMpKSB7XG4gICAgICB0aHJvdyBudWxsO1xuICAgIH1cbiAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgLy8gZW1pdCBhZGREaXIgdW5sZXNzIHRoaXMgaXMgYSBnbG9iIHBhcmVudFxuICAgICAgaWYgKCF3aC5nbG9iRmlsdGVyKSB0aGlzLmVtaXRBZGQocHJvY2Vzc1BhdGgocGF0aCksIHN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpO1xuXG4gICAgICAvLyBkb24ndCByZWN1cnNlIGZ1cnRoZXIgaWYgaXQgd291bGQgZXhjZWVkIGRlcHRoIHNldHRpbmdcbiAgICAgIGlmIChwcmlvckRlcHRoICYmIHByaW9yRGVwdGggPiBvcHRzLmRlcHRoKSByZXR1cm47XG5cbiAgICAgIC8vIHNjYW4gdGhlIGNvbnRlbnRzIG9mIHRoZSBkaXJcbiAgICAgIHRoaXMuZnN3Ll9yZWFkZGlycCh3aC53YXRjaFBhdGgsIHtcbiAgICAgICAgZmlsZUZpbHRlcjogZW50cnkgPT4gd2guZmlsdGVyUGF0aChlbnRyeSksXG4gICAgICAgIGRpcmVjdG9yeUZpbHRlcjogZW50cnkgPT4gd2guZmlsdGVyRGlyKGVudHJ5KSxcbiAgICAgICAgLi4uRGVwdGgob3B0cy5kZXB0aCAtIChwcmlvckRlcHRoIHx8IDApKVxuICAgICAgfSkub24oU1RSX0RBVEEsIChlbnRyeSkgPT4ge1xuICAgICAgICAvLyBuZWVkIHRvIGNoZWNrIGZpbHRlclBhdGggb24gZGlycyBiL2MgZmlsdGVyRGlyIGlzIGxlc3MgcmVzdHJpY3RpdmVcbiAgICAgICAgaWYgKHRoaXMuZnN3LmNsb3NlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW50cnkuc3RhdHMuaXNEaXJlY3RvcnkoKSAmJiAhd2guZmlsdGVyUGF0aChlbnRyeSkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBqb2luZWRQYXRoID0gc3lzUGF0aC5qb2luKHdoLndhdGNoUGF0aCwgZW50cnkucGF0aCk7XG4gICAgICAgIGNvbnN0IHtmdWxsUGF0aH0gPSBlbnRyeTtcblxuICAgICAgICBpZiAod2guZm9sbG93U3ltbGlua3MgJiYgZW50cnkuc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgICAgIC8vIHByZXNlcnZlIHRoZSBjdXJyZW50IGRlcHRoIGhlcmUgc2luY2UgaXQgY2FuJ3QgYmUgZGVyaXZlZCBmcm9tXG4gICAgICAgICAgLy8gcmVhbCBwYXRocyBwYXN0IHRoZSBzeW1saW5rXG4gICAgICAgICAgY29uc3QgY3VyRGVwdGggPSBvcHRzLmRlcHRoID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgdW5kZWZpbmVkIDogY2FsY0RlcHRoKGpvaW5lZFBhdGgsIHN5c1BhdGgucmVzb2x2ZSh3aC53YXRjaFBhdGgpKSArIDE7XG5cbiAgICAgICAgICB0aGlzLl9oYW5kbGVGc0V2ZW50c1N5bWxpbmsoam9pbmVkUGF0aCwgZnVsbFBhdGgsIHByb2Nlc3NQYXRoLCBjdXJEZXB0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbWl0QWRkKGpvaW5lZFBhdGgsIGVudHJ5LnN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpO1xuICAgICAgICB9XG4gICAgICB9KS5vbihFVl9FUlJPUiwgRU1QVFlfRk4pLm9uKFNUUl9FTkQsICgpID0+IHtcbiAgICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdEFkZCh3aC53YXRjaFBhdGgsIHN0YXRzLCBwcm9jZXNzUGF0aCwgb3B0cywgZm9yY2VBZGQpO1xuICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIWVycm9yIHx8IHRoaXMuZnN3Ll9oYW5kbGVFcnJvcihlcnJvcikpIHtcbiAgICAgIC8vIFRPRE86IFN0cmFuZ2UgdGhpbmc6IFwic2hvdWxkIG5vdCBjaG9rZSBvbiBhbiBpZ25vcmVkIHdhdGNoIHBhdGhcIiB3aWxsIGJlIGZhaWxlZCB3aXRob3V0IDIgcmVhZHkgY2FsbHMgLV9fLVxuICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgICAgdGhpcy5mc3cuX2VtaXRSZWFkeSgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRzLnBlcnNpc3RlbnQgJiYgZm9yY2VBZGQgIT09IHRydWUpIHtcbiAgICBpZiAodHlwZW9mIHRyYW5zZm9ybSA9PT0gRlVOQ1RJT05fVFlQRSkge1xuICAgICAgLy8gcmVhbHBhdGggaGFzIGFscmVhZHkgYmVlbiByZXNvbHZlZFxuICAgICAgdGhpcy5pbml0V2F0Y2godW5kZWZpbmVkLCBwYXRoLCB3aCwgcHJvY2Vzc1BhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcmVhbFBhdGg7XG4gICAgICB0cnkge1xuICAgICAgICByZWFsUGF0aCA9IGF3YWl0IHJlYWxwYXRoKHdoLndhdGNoUGF0aCk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgdGhpcy5pbml0V2F0Y2gocmVhbFBhdGgsIHBhdGgsIHdoLCBwcm9jZXNzUGF0aCk7XG4gICAgfVxuICB9XG59XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGc0V2ZW50c0hhbmRsZXI7XG5tb2R1bGUuZXhwb3J0cy5jYW5Vc2UgPSBjYW5Vc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHN5c1BhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCB7IHByb21pc2lmeSB9ID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgcmVhZGRpcnAgPSByZXF1aXJlKCdyZWFkZGlycCcpO1xuY29uc3QgYW55bWF0Y2ggPSByZXF1aXJlKCdhbnltYXRjaCcpLmRlZmF1bHQ7XG5jb25zdCBnbG9iUGFyZW50ID0gcmVxdWlyZSgnZ2xvYi1wYXJlbnQnKTtcbmNvbnN0IGlzR2xvYiA9IHJlcXVpcmUoJ2lzLWdsb2InKTtcbmNvbnN0IGJyYWNlcyA9IHJlcXVpcmUoJ2JyYWNlcycpO1xuY29uc3Qgbm9ybWFsaXplUGF0aCA9IHJlcXVpcmUoJ25vcm1hbGl6ZS1wYXRoJyk7XG5cbmNvbnN0IE5vZGVGc0hhbmRsZXIgPSByZXF1aXJlKCcuL2xpYi9ub2RlZnMtaGFuZGxlcicpO1xuY29uc3QgRnNFdmVudHNIYW5kbGVyID0gcmVxdWlyZSgnLi9saWIvZnNldmVudHMtaGFuZGxlcicpO1xuY29uc3Qge1xuICBFVl9BTEwsXG4gIEVWX1JFQURZLFxuICBFVl9BREQsXG4gIEVWX0NIQU5HRSxcbiAgRVZfVU5MSU5LLFxuICBFVl9BRERfRElSLFxuICBFVl9VTkxJTktfRElSLFxuICBFVl9SQVcsXG4gIEVWX0VSUk9SLFxuXG4gIFNUUl9DTE9TRSxcbiAgU1RSX0VORCxcblxuICBCQUNLX1NMQVNIX1JFLFxuICBET1VCTEVfU0xBU0hfUkUsXG4gIFNMQVNIX09SX0JBQ0tfU0xBU0hfUkUsXG4gIERPVF9SRSxcbiAgUkVQTEFDRVJfUkUsXG5cbiAgU0xBU0gsXG4gIFNMQVNIX1NMQVNILFxuICBCUkFDRV9TVEFSVCxcbiAgQkFORyxcbiAgT05FX0RPVCxcbiAgVFdPX0RPVFMsXG4gIEdMT0JTVEFSLFxuICBTTEFTSF9HTE9CU1RBUixcbiAgQU5ZTUFUQ0hfT1BUUyxcbiAgU1RSSU5HX1RZUEUsXG4gIEZVTkNUSU9OX1RZUEUsXG4gIEVNUFRZX1NUUixcbiAgRU1QVFlfRk4sXG5cbiAgaXNXaW5kb3dzLFxuICBpc01hY29zXG59ID0gcmVxdWlyZSgnLi9saWIvY29uc3RhbnRzJyk7XG5cbmNvbnN0IHN0YXQgPSBwcm9taXNpZnkoZnMuc3RhdCk7XG5jb25zdCByZWFkZGlyID0gcHJvbWlzaWZ5KGZzLnJlYWRkaXIpO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtTdHJpbmd9IFBhdGhcbiAqIEB0eXBlZGVmIHsnYWxsJ3wnYWRkJ3wnYWRkRGlyJ3wnY2hhbmdlJ3wndW5saW5rJ3wndW5saW5rRGlyJ3wncmF3J3wnZXJyb3InfCdyZWFkeSd9IEV2ZW50TmFtZVxuICogQHR5cGVkZWYgeydyZWFkZGlyJ3wnd2F0Y2gnfCdhZGQnfCdyZW1vdmUnfCdjaGFuZ2UnfSBUaHJvdHRsZVR5cGVcbiAqL1xuXG4vKipcbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBXYXRjaEhlbHBlcnNcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZm9sbG93U3ltbGlua3NcbiAqIEBwcm9wZXJ0eSB7J3N0YXQnfCdsc3RhdCd9IHN0YXRNZXRob2RcbiAqIEBwcm9wZXJ0eSB7UGF0aH0gcGF0aFxuICogQHByb3BlcnR5IHtQYXRofSB3YXRjaFBhdGhcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGVudHJ5UGF0aFxuICogQHByb3BlcnR5IHtCb29sZWFufSBoYXNHbG9iXG4gKiBAcHJvcGVydHkge09iamVjdH0gZ2xvYkZpbHRlclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZmlsdGVyUGF0aFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZmlsdGVyRGlyXG4gKi9cblxuY29uc3QgYXJyaWZ5ID0gKHZhbHVlID0gW10pID0+IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xuY29uc3QgZmxhdHRlbiA9IChsaXN0LCByZXN1bHQgPSBbXSkgPT4ge1xuICBsaXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGZsYXR0ZW4oaXRlbSwgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IHVuaWZ5UGF0aHMgPSAocGF0aHNfKSA9PiB7XG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXk8U3RyaW5nPn1cbiAgICovXG4gIGNvbnN0IHBhdGhzID0gZmxhdHRlbihhcnJpZnkocGF0aHNfKSk7XG4gIGlmICghcGF0aHMuZXZlcnkocCA9PiB0eXBlb2YgcCA9PT0gU1RSSU5HX1RZUEUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgTm9uLXN0cmluZyBwcm92aWRlZCBhcyB3YXRjaCBwYXRoOiAke3BhdGhzfWApO1xuICB9XG4gIHJldHVybiBwYXRocy5tYXAobm9ybWFsaXplUGF0aFRvVW5peCk7XG59O1xuXG4vLyBJZiBTTEFTSF9TTEFTSCBvY2N1cnMgYXQgdGhlIGJlZ2lubmluZyBvZiBwYXRoLCBpdCBpcyBub3QgcmVwbGFjZWRcbi8vICAgICBiZWNhdXNlIFwiLy9TdG9yYWdlUEMvRHJpdmVQb29sL01vdmllc1wiIGlzIGEgdmFsaWQgbmV0d29yayBwYXRoXG5jb25zdCB0b1VuaXggPSAoc3RyaW5nKSA9PiB7XG4gIGxldCBzdHIgPSBzdHJpbmcucmVwbGFjZShCQUNLX1NMQVNIX1JFLCBTTEFTSCk7XG4gIGxldCBwcmVwZW5kID0gZmFsc2U7XG4gIGlmIChzdHIuc3RhcnRzV2l0aChTTEFTSF9TTEFTSCkpIHtcbiAgICBwcmVwZW5kID0gdHJ1ZTtcbiAgfVxuICB3aGlsZSAoc3RyLm1hdGNoKERPVUJMRV9TTEFTSF9SRSkpIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShET1VCTEVfU0xBU0hfUkUsIFNMQVNIKTtcbiAgfVxuICBpZiAocHJlcGVuZCkge1xuICAgIHN0ciA9IFNMQVNIICsgc3RyO1xuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG4vLyBPdXIgdmVyc2lvbiBvZiB1cGF0aC5ub3JtYWxpemVcbi8vIFRPRE86IHRoaXMgaXMgbm90IGVxdWFsIHRvIHBhdGgtbm9ybWFsaXplIG1vZHVsZSAtIGludmVzdGlnYXRlIHdoeVxuY29uc3Qgbm9ybWFsaXplUGF0aFRvVW5peCA9IChwYXRoKSA9PiB0b1VuaXgoc3lzUGF0aC5ub3JtYWxpemUodG9Vbml4KHBhdGgpKSk7XG5cbmNvbnN0IG5vcm1hbGl6ZUlnbm9yZWQgPSAoY3dkID0gRU1QVFlfU1RSKSA9PiAocGF0aCkgPT4ge1xuICBpZiAodHlwZW9mIHBhdGggIT09IFNUUklOR19UWVBFKSByZXR1cm4gcGF0aDtcbiAgcmV0dXJuIG5vcm1hbGl6ZVBhdGhUb1VuaXgoc3lzUGF0aC5pc0Fic29sdXRlKHBhdGgpID8gcGF0aCA6IHN5c1BhdGguam9pbihjd2QsIHBhdGgpKTtcbn07XG5cbmNvbnN0IGdldEFic29sdXRlUGF0aCA9IChwYXRoLCBjd2QpID0+IHtcbiAgaWYgKHN5c1BhdGguaXNBYnNvbHV0ZShwYXRoKSkge1xuICAgIHJldHVybiBwYXRoO1xuICB9XG4gIGlmIChwYXRoLnN0YXJ0c1dpdGgoQkFORykpIHtcbiAgICByZXR1cm4gQkFORyArIHN5c1BhdGguam9pbihjd2QsIHBhdGguc2xpY2UoMSkpO1xuICB9XG4gIHJldHVybiBzeXNQYXRoLmpvaW4oY3dkLCBwYXRoKTtcbn07XG5cbmNvbnN0IHVuZGVmID0gKG9wdHMsIGtleSkgPT4gb3B0c1trZXldID09PSB1bmRlZmluZWQ7XG5cbi8qKlxuICogRGlyZWN0b3J5IGVudHJ5LlxuICogQHByb3BlcnR5IHtQYXRofSBwYXRoXG4gKiBAcHJvcGVydHkge1NldDxQYXRoPn0gaXRlbXNcbiAqL1xuY2xhc3MgRGlyRW50cnkge1xuICAvKipcbiAgICogQHBhcmFtIHtQYXRofSBkaXJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVtb3ZlV2F0Y2hlclxuICAgKi9cbiAgY29uc3RydWN0b3IoZGlyLCByZW1vdmVXYXRjaGVyKSB7XG4gICAgdGhpcy5wYXRoID0gZGlyO1xuICAgIHRoaXMuX3JlbW92ZVdhdGNoZXIgPSByZW1vdmVXYXRjaGVyO1xuICAgIC8qKiBAdHlwZSB7U2V0PFBhdGg+fSAqL1xuICAgIHRoaXMuaXRlbXMgPSBuZXcgU2V0KCk7XG4gIH1cblxuICBhZGQoaXRlbSkge1xuICAgIGNvbnN0IHtpdGVtc30gPSB0aGlzO1xuICAgIGlmICghaXRlbXMpIHJldHVybjtcbiAgICBpZiAoaXRlbSAhPT0gT05FX0RPVCAmJiBpdGVtICE9PSBUV09fRE9UUykgaXRlbXMuYWRkKGl0ZW0pO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlKGl0ZW0pIHtcbiAgICBjb25zdCB7aXRlbXN9ID0gdGhpcztcbiAgICBpZiAoIWl0ZW1zKSByZXR1cm47XG4gICAgaXRlbXMuZGVsZXRlKGl0ZW0pO1xuICAgIGlmIChpdGVtcy5zaXplID4gMCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGlyID0gdGhpcy5wYXRoO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCByZWFkZGlyKGRpcik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAodGhpcy5fcmVtb3ZlV2F0Y2hlcikge1xuICAgICAgICB0aGlzLl9yZW1vdmVXYXRjaGVyKHN5c1BhdGguZGlybmFtZShkaXIpLCBzeXNQYXRoLmJhc2VuYW1lKGRpcikpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhcyhpdGVtKSB7XG4gICAgY29uc3Qge2l0ZW1zfSA9IHRoaXM7XG4gICAgaWYgKCFpdGVtcykgcmV0dXJuO1xuICAgIHJldHVybiBpdGVtcy5oYXMoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge0FycmF5PFN0cmluZz59XG4gICAqL1xuICBnZXRDaGlsZHJlbigpIHtcbiAgICBjb25zdCB7aXRlbXN9ID0gdGhpcztcbiAgICBpZiAoIWl0ZW1zKSByZXR1cm47XG4gICAgcmV0dXJuIFsuLi5pdGVtcy52YWx1ZXMoKV07XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuaXRlbXMuY2xlYXIoKTtcbiAgICBkZWxldGUgdGhpcy5wYXRoO1xuICAgIGRlbGV0ZSB0aGlzLl9yZW1vdmVXYXRjaGVyO1xuICAgIGRlbGV0ZSB0aGlzLml0ZW1zO1xuICAgIE9iamVjdC5mcmVlemUodGhpcyk7XG4gIH1cbn1cblxuY29uc3QgU1RBVF9NRVRIT0RfRiA9ICdzdGF0JztcbmNvbnN0IFNUQVRfTUVUSE9EX0wgPSAnbHN0YXQnO1xuY2xhc3MgV2F0Y2hIZWxwZXIge1xuICBjb25zdHJ1Y3RvcihwYXRoLCB3YXRjaFBhdGgsIGZvbGxvdywgZnN3KSB7XG4gICAgdGhpcy5mc3cgPSBmc3c7XG4gICAgdGhpcy5wYXRoID0gcGF0aCA9IHBhdGgucmVwbGFjZShSRVBMQUNFUl9SRSwgRU1QVFlfU1RSKTtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmZ1bGxXYXRjaFBhdGggPSBzeXNQYXRoLnJlc29sdmUod2F0Y2hQYXRoKTtcbiAgICB0aGlzLmhhc0dsb2IgPSB3YXRjaFBhdGggIT09IHBhdGg7XG4gICAgLyoqIEB0eXBlIHtvYmplY3R8Ym9vbGVhbn0gKi9cbiAgICBpZiAocGF0aCA9PT0gRU1QVFlfU1RSKSB0aGlzLmhhc0dsb2IgPSBmYWxzZTtcbiAgICB0aGlzLmdsb2JTeW1saW5rID0gdGhpcy5oYXNHbG9iICYmIGZvbGxvdyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgIHRoaXMuZ2xvYkZpbHRlciA9IHRoaXMuaGFzR2xvYiA/IGFueW1hdGNoKHBhdGgsIHVuZGVmaW5lZCwgQU5ZTUFUQ0hfT1BUUykgOiBmYWxzZTtcbiAgICB0aGlzLmRpclBhcnRzID0gdGhpcy5nZXREaXJQYXJ0cyhwYXRoKTtcbiAgICB0aGlzLmRpclBhcnRzLmZvckVhY2goKHBhcnRzKSA9PiB7XG4gICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkgcGFydHMucG9wKCk7XG4gICAgfSk7XG4gICAgdGhpcy5mb2xsb3dTeW1saW5rcyA9IGZvbGxvdztcbiAgICB0aGlzLnN0YXRNZXRob2QgPSBmb2xsb3cgPyBTVEFUX01FVEhPRF9GIDogU1RBVF9NRVRIT0RfTDtcbiAgfVxuXG4gIGNoZWNrR2xvYlN5bWxpbmsoZW50cnkpIHtcbiAgICAvLyBvbmx5IG5lZWQgdG8gcmVzb2x2ZSBvbmNlXG4gICAgLy8gZmlyc3QgZW50cnkgc2hvdWxkIGFsd2F5cyBoYXZlIGVudHJ5LnBhcmVudERpciA9PT0gRU1QVFlfU1RSXG4gICAgaWYgKHRoaXMuZ2xvYlN5bWxpbmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5nbG9iU3ltbGluayA9IGVudHJ5LmZ1bGxQYXJlbnREaXIgPT09IHRoaXMuZnVsbFdhdGNoUGF0aCA/XG4gICAgICAgIGZhbHNlIDoge3JlYWxQYXRoOiBlbnRyeS5mdWxsUGFyZW50RGlyLCBsaW5rUGF0aDogdGhpcy5mdWxsV2F0Y2hQYXRofTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nbG9iU3ltbGluaykge1xuICAgICAgcmV0dXJuIGVudHJ5LmZ1bGxQYXRoLnJlcGxhY2UodGhpcy5nbG9iU3ltbGluay5yZWFsUGF0aCwgdGhpcy5nbG9iU3ltbGluay5saW5rUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVudHJ5LmZ1bGxQYXRoO1xuICB9XG5cbiAgZW50cnlQYXRoKGVudHJ5KSB7XG4gICAgcmV0dXJuIHN5c1BhdGguam9pbih0aGlzLndhdGNoUGF0aCxcbiAgICAgIHN5c1BhdGgucmVsYXRpdmUodGhpcy53YXRjaFBhdGgsIHRoaXMuY2hlY2tHbG9iU3ltbGluayhlbnRyeSkpXG4gICAgKTtcbiAgfVxuXG4gIGZpbHRlclBhdGgoZW50cnkpIHtcbiAgICBjb25zdCB7c3RhdHN9ID0gZW50cnk7XG4gICAgaWYgKHN0YXRzICYmIHN0YXRzLmlzU3ltYm9saWNMaW5rKCkpIHJldHVybiB0aGlzLmZpbHRlckRpcihlbnRyeSk7XG4gICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gdGhpcy5lbnRyeVBhdGgoZW50cnkpO1xuICAgIGNvbnN0IG1hdGNoZXNHbG9iID0gdGhpcy5oYXNHbG9iICYmIHR5cGVvZiB0aGlzLmdsb2JGaWx0ZXIgPT09IEZVTkNUSU9OX1RZUEUgP1xuICAgICAgdGhpcy5nbG9iRmlsdGVyKHJlc29sdmVkUGF0aCkgOiB0cnVlO1xuICAgIHJldHVybiBtYXRjaGVzR2xvYiAmJlxuICAgICAgdGhpcy5mc3cuX2lzbnRJZ25vcmVkKHJlc29sdmVkUGF0aCwgc3RhdHMpICYmXG4gICAgICB0aGlzLmZzdy5faGFzUmVhZFBlcm1pc3Npb25zKHN0YXRzKTtcbiAgfVxuXG4gIGdldERpclBhcnRzKHBhdGgpIHtcbiAgICBpZiAoIXRoaXMuaGFzR2xvYikgcmV0dXJuIFtdO1xuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgY29uc3QgZXhwYW5kZWRQYXRoID0gcGF0aC5pbmNsdWRlcyhCUkFDRV9TVEFSVCkgPyBicmFjZXMuZXhwYW5kKHBhdGgpIDogW3BhdGhdO1xuICAgIGV4cGFuZGVkUGF0aC5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICBwYXJ0cy5wdXNoKHN5c1BhdGgucmVsYXRpdmUodGhpcy53YXRjaFBhdGgsIHBhdGgpLnNwbGl0KFNMQVNIX09SX0JBQ0tfU0xBU0hfUkUpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcGFydHM7XG4gIH1cblxuICBmaWx0ZXJEaXIoZW50cnkpIHtcbiAgICBpZiAodGhpcy5oYXNHbG9iKSB7XG4gICAgICBjb25zdCBlbnRyeVBhcnRzID0gdGhpcy5nZXREaXJQYXJ0cyh0aGlzLmNoZWNrR2xvYlN5bWxpbmsoZW50cnkpKTtcbiAgICAgIGxldCBnbG9ic3RhciA9IGZhbHNlO1xuICAgICAgdGhpcy51bm1hdGNoZWRHbG9iID0gIXRoaXMuZGlyUGFydHMuc29tZSgocGFydHMpID0+IHtcbiAgICAgICAgcmV0dXJuIHBhcnRzLmV2ZXJ5KChwYXJ0LCBpKSA9PiB7XG4gICAgICAgICAgaWYgKHBhcnQgPT09IEdMT0JTVEFSKSBnbG9ic3RhciA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGdsb2JzdGFyIHx8ICFlbnRyeVBhcnRzWzBdW2ldIHx8IGFueW1hdGNoKHBhcnQsIGVudHJ5UGFydHNbMF1baV0sIEFOWU1BVENIX09QVFMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gIXRoaXMudW5tYXRjaGVkR2xvYiAmJiB0aGlzLmZzdy5faXNudElnbm9yZWQodGhpcy5lbnRyeVBhdGgoZW50cnkpLCBlbnRyeS5zdGF0cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBXYXRjaGVzIGZpbGVzICYgZGlyZWN0b3JpZXMgZm9yIGNoYW5nZXMuIEVtaXR0ZWQgZXZlbnRzOlxuICogYGFkZGAsIGBhZGREaXJgLCBgY2hhbmdlYCwgYHVubGlua2AsIGB1bmxpbmtEaXJgLCBgYWxsYCwgYGVycm9yYFxuICpcbiAqICAgICBuZXcgRlNXYXRjaGVyKClcbiAqICAgICAgIC5hZGQoZGlyZWN0b3JpZXMpXG4gKiAgICAgICAub24oJ2FkZCcsIHBhdGggPT4gbG9nKCdGaWxlJywgcGF0aCwgJ3dhcyBhZGRlZCcpKVxuICovXG5jbGFzcyBGU1dhdGNoZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuLy8gTm90IGluZGVudGluZyBtZXRob2RzIGZvciBoaXN0b3J5IHNha2U7IGZvciBub3cuXG5jb25zdHJ1Y3Rvcihfb3B0cykge1xuICBzdXBlcigpO1xuXG4gIGNvbnN0IG9wdHMgPSB7fTtcbiAgaWYgKF9vcHRzKSBPYmplY3QuYXNzaWduKG9wdHMsIF9vcHRzKTsgLy8gZm9yIGZyb3plbiBvYmplY3RzXG5cbiAgLyoqIEB0eXBlIHtNYXA8U3RyaW5nLCBEaXJFbnRyeT59ICovXG4gIHRoaXMuX3dhdGNoZWQgPSBuZXcgTWFwKCk7XG4gIC8qKiBAdHlwZSB7TWFwPFN0cmluZywgQXJyYXk+fSAqL1xuICB0aGlzLl9jbG9zZXJzID0gbmV3IE1hcCgpO1xuICAvKiogQHR5cGUge1NldDxTdHJpbmc+fSAqL1xuICB0aGlzLl9pZ25vcmVkUGF0aHMgPSBuZXcgU2V0KCk7XG5cbiAgLyoqIEB0eXBlIHtNYXA8VGhyb3R0bGVUeXBlLCBNYXA+fSAqL1xuICB0aGlzLl90aHJvdHRsZWQgPSBuZXcgTWFwKCk7XG5cbiAgLyoqIEB0eXBlIHtNYXA8UGF0aCwgU3RyaW5nfEJvb2xlYW4+fSAqL1xuICB0aGlzLl9zeW1saW5rUGF0aHMgPSBuZXcgTWFwKCk7XG5cbiAgdGhpcy5fc3RyZWFtcyA9IG5ldyBTZXQoKTtcbiAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcblxuICAvLyBTZXQgdXAgZGVmYXVsdCBvcHRpb25zLlxuICBpZiAodW5kZWYob3B0cywgJ3BlcnNpc3RlbnQnKSkgb3B0cy5wZXJzaXN0ZW50ID0gdHJ1ZTtcbiAgaWYgKHVuZGVmKG9wdHMsICdpZ25vcmVJbml0aWFsJykpIG9wdHMuaWdub3JlSW5pdGlhbCA9IGZhbHNlO1xuICBpZiAodW5kZWYob3B0cywgJ2lnbm9yZVBlcm1pc3Npb25FcnJvcnMnKSkgb3B0cy5pZ25vcmVQZXJtaXNzaW9uRXJyb3JzID0gZmFsc2U7XG4gIGlmICh1bmRlZihvcHRzLCAnaW50ZXJ2YWwnKSkgb3B0cy5pbnRlcnZhbCA9IDEwMDtcbiAgaWYgKHVuZGVmKG9wdHMsICdiaW5hcnlJbnRlcnZhbCcpKSBvcHRzLmJpbmFyeUludGVydmFsID0gMzAwO1xuICBpZiAodW5kZWYob3B0cywgJ2Rpc2FibGVHbG9iYmluZycpKSBvcHRzLmRpc2FibGVHbG9iYmluZyA9IGZhbHNlO1xuICBvcHRzLmVuYWJsZUJpbmFyeUludGVydmFsID0gb3B0cy5iaW5hcnlJbnRlcnZhbCAhPT0gb3B0cy5pbnRlcnZhbDtcblxuICAvLyBFbmFibGUgZnNldmVudHMgb24gT1MgWCB3aGVuIHBvbGxpbmcgaXNuJ3QgZXhwbGljaXRseSBlbmFibGVkLlxuICBpZiAodW5kZWYob3B0cywgJ3VzZUZzRXZlbnRzJykpIG9wdHMudXNlRnNFdmVudHMgPSAhb3B0cy51c2VQb2xsaW5nO1xuXG4gIC8vIElmIHdlIGNhbid0IHVzZSBmc2V2ZW50cywgZW5zdXJlIHRoZSBvcHRpb25zIHJlZmxlY3QgaXQncyBkaXNhYmxlZC5cbiAgY29uc3QgY2FuVXNlRnNFdmVudHMgPSBGc0V2ZW50c0hhbmRsZXIuY2FuVXNlKCk7XG4gIGlmICghY2FuVXNlRnNFdmVudHMpIG9wdHMudXNlRnNFdmVudHMgPSBmYWxzZTtcblxuICAvLyBVc2UgcG9sbGluZyBvbiBNYWMgaWYgbm90IHVzaW5nIGZzZXZlbnRzLlxuICAvLyBPdGhlciBwbGF0Zm9ybXMgdXNlIG5vbi1wb2xsaW5nIGZzX3dhdGNoLlxuICBpZiAodW5kZWYob3B0cywgJ3VzZVBvbGxpbmcnKSAmJiAhb3B0cy51c2VGc0V2ZW50cykge1xuICAgIG9wdHMudXNlUG9sbGluZyA9IGlzTWFjb3M7XG4gIH1cblxuICAvLyBHbG9iYWwgb3ZlcnJpZGUgKHVzZWZ1bCBmb3IgZW5kLWRldmVsb3BlcnMgdGhhdCBuZWVkIHRvIGZvcmNlIHBvbGxpbmcgZm9yIGFsbFxuICAvLyBpbnN0YW5jZXMgb2YgY2hva2lkYXIsIHJlZ2FyZGxlc3Mgb2YgdXNhZ2UvZGVwZW5kZW5jeSBkZXB0aClcbiAgY29uc3QgZW52UG9sbCA9IHByb2Nlc3MuZW52LkNIT0tJREFSX1VTRVBPTExJTkc7XG4gIGlmIChlbnZQb2xsICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBlbnZMb3dlciA9IGVudlBvbGwudG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChlbnZMb3dlciA9PT0gJ2ZhbHNlJyB8fCBlbnZMb3dlciA9PT0gJzAnKSB7XG4gICAgICBvcHRzLnVzZVBvbGxpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGVudkxvd2VyID09PSAndHJ1ZScgfHwgZW52TG93ZXIgPT09ICcxJykge1xuICAgICAgb3B0cy51c2VQb2xsaW5nID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy51c2VQb2xsaW5nID0gISFlbnZMb3dlcjtcbiAgICB9XG4gIH1cbiAgY29uc3QgZW52SW50ZXJ2YWwgPSBwcm9jZXNzLmVudi5DSE9LSURBUl9JTlRFUlZBTDtcbiAgaWYgKGVudkludGVydmFsKSB7XG4gICAgb3B0cy5pbnRlcnZhbCA9IE51bWJlci5wYXJzZUludChlbnZJbnRlcnZhbCwgMTApO1xuICB9XG5cbiAgLy8gRWRpdG9yIGF0b21pYyB3cml0ZSBub3JtYWxpemF0aW9uIGVuYWJsZWQgYnkgZGVmYXVsdCB3aXRoIGZzLndhdGNoXG4gIGlmICh1bmRlZihvcHRzLCAnYXRvbWljJykpIG9wdHMuYXRvbWljID0gIW9wdHMudXNlUG9sbGluZyAmJiAhb3B0cy51c2VGc0V2ZW50cztcbiAgaWYgKG9wdHMuYXRvbWljKSB0aGlzLl9wZW5kaW5nVW5saW5rcyA9IG5ldyBNYXAoKTtcblxuICBpZiAodW5kZWYob3B0cywgJ2ZvbGxvd1N5bWxpbmtzJykpIG9wdHMuZm9sbG93U3ltbGlua3MgPSB0cnVlO1xuXG4gIGlmICh1bmRlZihvcHRzLCAnYXdhaXRXcml0ZUZpbmlzaCcpKSBvcHRzLmF3YWl0V3JpdGVGaW5pc2ggPSBmYWxzZTtcbiAgaWYgKG9wdHMuYXdhaXRXcml0ZUZpbmlzaCA9PT0gdHJ1ZSkgb3B0cy5hd2FpdFdyaXRlRmluaXNoID0ge307XG4gIGNvbnN0IGF3ZiA9IG9wdHMuYXdhaXRXcml0ZUZpbmlzaDtcbiAgaWYgKGF3Zikge1xuICAgIGlmICghYXdmLnN0YWJpbGl0eVRocmVzaG9sZCkgYXdmLnN0YWJpbGl0eVRocmVzaG9sZCA9IDIwMDA7XG4gICAgaWYgKCFhd2YucG9sbEludGVydmFsKSBhd2YucG9sbEludGVydmFsID0gMTAwO1xuICAgIHRoaXMuX3BlbmRpbmdXcml0ZXMgPSBuZXcgTWFwKCk7XG4gIH1cbiAgaWYgKG9wdHMuaWdub3JlZCkgb3B0cy5pZ25vcmVkID0gYXJyaWZ5KG9wdHMuaWdub3JlZCk7XG5cbiAgbGV0IHJlYWR5Q2FsbHMgPSAwO1xuICB0aGlzLl9lbWl0UmVhZHkgPSAoKSA9PiB7XG4gICAgcmVhZHlDYWxscysrO1xuICAgIGlmIChyZWFkeUNhbGxzID49IHRoaXMuX3JlYWR5Q291bnQpIHtcbiAgICAgIHRoaXMuX2VtaXRSZWFkeSA9IEVNUFRZX0ZOO1xuICAgICAgdGhpcy5fcmVhZHlFbWl0dGVkID0gdHJ1ZTtcbiAgICAgIC8vIHVzZSBwcm9jZXNzLm5leHRUaWNrIHRvIGFsbG93IHRpbWUgZm9yIGxpc3RlbmVyIHRvIGJlIGJvdW5kXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHRoaXMuZW1pdChFVl9SRUFEWSkpO1xuICAgIH1cbiAgfTtcbiAgdGhpcy5fZW1pdFJhdyA9ICguLi5hcmdzKSA9PiB0aGlzLmVtaXQoRVZfUkFXLCAuLi5hcmdzKTtcbiAgdGhpcy5fcmVhZHlFbWl0dGVkID0gZmFsc2U7XG4gIHRoaXMub3B0aW9ucyA9IG9wdHM7XG5cbiAgLy8gSW5pdGlhbGl6ZSB3aXRoIHByb3BlciB3YXRjaGVyLlxuICBpZiAob3B0cy51c2VGc0V2ZW50cykge1xuICAgIHRoaXMuX2ZzRXZlbnRzSGFuZGxlciA9IG5ldyBGc0V2ZW50c0hhbmRsZXIodGhpcyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbm9kZUZzSGFuZGxlciA9IG5ldyBOb2RlRnNIYW5kbGVyKHRoaXMpO1xuICB9XG5cbiAgLy8gWW914oCZcmUgZnJvemVuIHdoZW4geW91ciBoZWFydOKAmXMgbm90IG9wZW4uXG4gIE9iamVjdC5mcmVlemUob3B0cyk7XG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbi8qKlxuICogQWRkcyBwYXRocyB0byBiZSB3YXRjaGVkIG9uIGFuIGV4aXN0aW5nIEZTV2F0Y2hlciBpbnN0YW5jZVxuICogQHBhcmFtIHtQYXRofEFycmF5PFBhdGg+fSBwYXRoc19cbiAqIEBwYXJhbSB7U3RyaW5nPX0gX29yaWdBZGQgcHJpdmF0ZTsgZm9yIGhhbmRsaW5nIG5vbi1leGlzdGVudCBwYXRocyB0byBiZSB3YXRjaGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW49fSBfaW50ZXJuYWwgcHJpdmF0ZTsgaW5kaWNhdGVzIGEgbm9uLXVzZXIgYWRkXG4gKiBAcmV0dXJucyB7RlNXYXRjaGVyfSBmb3IgY2hhaW5pbmdcbiAqL1xuYWRkKHBhdGhzXywgX29yaWdBZGQsIF9pbnRlcm5hbCkge1xuICBjb25zdCB7Y3dkLCBkaXNhYmxlR2xvYmJpbmd9ID0gdGhpcy5vcHRpb25zO1xuICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICBsZXQgcGF0aHMgPSB1bmlmeVBhdGhzKHBhdGhzXyk7XG4gIGlmIChjd2QpIHtcbiAgICBwYXRocyA9IHBhdGhzLm1hcCgocGF0aCkgPT4ge1xuICAgICAgY29uc3QgYWJzUGF0aCA9IGdldEFic29sdXRlUGF0aChwYXRoLCBjd2QpO1xuXG4gICAgICAvLyBDaGVjayBgcGF0aGAgaW5zdGVhZCBvZiBgYWJzUGF0aGAgYmVjYXVzZSB0aGUgY3dkIHBvcnRpb24gY2FuJ3QgYmUgYSBnbG9iXG4gICAgICBpZiAoZGlzYWJsZUdsb2JiaW5nIHx8ICFpc0dsb2IocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGFic1BhdGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9ybWFsaXplUGF0aChhYnNQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNldCBhc2lkZSBuZWdhdGVkIGdsb2Igc3RyaW5nc1xuICBwYXRocyA9IHBhdGhzLmZpbHRlcigocGF0aCkgPT4ge1xuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoQkFORykpIHtcbiAgICAgIHRoaXMuX2lnbm9yZWRQYXRocy5hZGQocGF0aC5zbGljZSgxKSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaWYgYSBwYXRoIGlzIGJlaW5nIGFkZGVkIHRoYXQgd2FzIHByZXZpb3VzbHkgaWdub3JlZCwgc3RvcCBpZ25vcmluZyBpdFxuICAgIHRoaXMuX2lnbm9yZWRQYXRocy5kZWxldGUocGF0aCk7XG4gICAgdGhpcy5faWdub3JlZFBhdGhzLmRlbGV0ZShwYXRoICsgU0xBU0hfR0xPQlNUQVIpO1xuXG4gICAgLy8gcmVzZXQgdGhlIGNhY2hlZCB1c2VySWdub3JlZCBhbnltYXRjaCBmblxuICAgIC8vIHRvIG1ha2UgaWdub3JlZFBhdGhzIGNoYW5nZXMgZWZmZWN0aXZlXG4gICAgdGhpcy5fdXNlcklnbm9yZWQgPSB1bmRlZmluZWQ7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG5cbiAgaWYgKHRoaXMub3B0aW9ucy51c2VGc0V2ZW50cyAmJiB0aGlzLl9mc0V2ZW50c0hhbmRsZXIpIHtcbiAgICBpZiAoIXRoaXMuX3JlYWR5Q291bnQpIHRoaXMuX3JlYWR5Q291bnQgPSBwYXRocy5sZW5ndGg7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wZXJzaXN0ZW50KSB0aGlzLl9yZWFkeUNvdW50ICo9IDI7XG4gICAgcGF0aHMuZm9yRWFjaCgocGF0aCkgPT4gdGhpcy5fZnNFdmVudHNIYW5kbGVyLl9hZGRUb0ZzRXZlbnRzKHBhdGgpKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIXRoaXMuX3JlYWR5Q291bnQpIHRoaXMuX3JlYWR5Q291bnQgPSAwO1xuICAgIHRoaXMuX3JlYWR5Q291bnQgKz0gcGF0aHMubGVuZ3RoO1xuICAgIFByb21pc2UuYWxsKFxuICAgICAgcGF0aHMubWFwKGFzeW5jIHBhdGggPT4ge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9ub2RlRnNIYW5kbGVyLl9hZGRUb05vZGVGcyhwYXRoLCAhX2ludGVybmFsLCAwLCAwLCBfb3JpZ0FkZCk7XG4gICAgICAgIGlmIChyZXMpIHRoaXMuX2VtaXRSZWFkeSgpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSlcbiAgICApLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgICAgIHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbSkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgdGhpcy5hZGQoc3lzUGF0aC5kaXJuYW1lKGl0ZW0pLCBzeXNQYXRoLmJhc2VuYW1lKF9vcmlnQWRkIHx8IGl0ZW0pKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2xvc2Ugd2F0Y2hlcnMgb3Igc3RhcnQgaWdub3JpbmcgZXZlbnRzIGZyb20gc3BlY2lmaWVkIHBhdGhzLlxuICogQHBhcmFtIHtQYXRofEFycmF5PFBhdGg+fSBwYXRoc18gLSBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncywgZmlsZS9kaXJlY3RvcnkgcGF0aHMgYW5kL29yIGdsb2JzXG4gKiBAcmV0dXJucyB7RlNXYXRjaGVyfSBmb3IgY2hhaW5pbmdcbiovXG51bndhdGNoKHBhdGhzXykge1xuICBpZiAodGhpcy5jbG9zZWQpIHJldHVybiB0aGlzO1xuICBjb25zdCBwYXRocyA9IHVuaWZ5UGF0aHMocGF0aHNfKTtcbiAgY29uc3Qge2N3ZH0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgcGF0aHMuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgIC8vIGNvbnZlcnQgdG8gYWJzb2x1dGUgcGF0aCB1bmxlc3MgcmVsYXRpdmUgcGF0aCBhbHJlYWR5IG1hdGNoZXNcbiAgICBpZiAoIXN5c1BhdGguaXNBYnNvbHV0ZShwYXRoKSAmJiAhdGhpcy5fY2xvc2Vycy5oYXMocGF0aCkpIHtcbiAgICAgIGlmIChjd2QpIHBhdGggPSBzeXNQYXRoLmpvaW4oY3dkLCBwYXRoKTtcbiAgICAgIHBhdGggPSBzeXNQYXRoLnJlc29sdmUocGF0aCk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2xvc2VQYXRoKHBhdGgpO1xuXG4gICAgdGhpcy5faWdub3JlZFBhdGhzLmFkZChwYXRoKTtcbiAgICBpZiAodGhpcy5fd2F0Y2hlZC5oYXMocGF0aCkpIHtcbiAgICAgIHRoaXMuX2lnbm9yZWRQYXRocy5hZGQocGF0aCArIFNMQVNIX0dMT0JTVEFSKTtcbiAgICB9XG5cbiAgICAvLyByZXNldCB0aGUgY2FjaGVkIHVzZXJJZ25vcmVkIGFueW1hdGNoIGZuXG4gICAgLy8gdG8gbWFrZSBpZ25vcmVkUGF0aHMgY2hhbmdlcyBlZmZlY3RpdmVcbiAgICB0aGlzLl91c2VySWdub3JlZCA9IHVuZGVmaW5lZDtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2xvc2Ugd2F0Y2hlcnMgYW5kIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZyb20gd2F0Y2hlZCBwYXRocy5cbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fS5cbiovXG5jbG9zZSgpIHtcbiAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm4gdGhpcy5fY2xvc2VQcm9taXNlO1xuICB0aGlzLmNsb3NlZCA9IHRydWU7XG5cbiAgLy8gTWVtb3J5IG1hbmFnZW1lbnQuXG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIGNvbnN0IGNsb3NlcnMgPSBbXTtcbiAgdGhpcy5fY2xvc2Vycy5mb3JFYWNoKGNsb3Nlckxpc3QgPT4gY2xvc2VyTGlzdC5mb3JFYWNoKGNsb3NlciA9PiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IGNsb3NlcigpO1xuICAgIGlmIChwcm9taXNlIGluc3RhbmNlb2YgUHJvbWlzZSkgY2xvc2Vycy5wdXNoKHByb21pc2UpO1xuICB9KSk7XG4gIHRoaXMuX3N0cmVhbXMuZm9yRWFjaChzdHJlYW0gPT4gc3RyZWFtLmRlc3Ryb3koKSk7XG4gIHRoaXMuX3VzZXJJZ25vcmVkID0gdW5kZWZpbmVkO1xuICB0aGlzLl9yZWFkeUNvdW50ID0gMDtcbiAgdGhpcy5fcmVhZHlFbWl0dGVkID0gZmFsc2U7XG4gIHRoaXMuX3dhdGNoZWQuZm9yRWFjaChkaXJlbnQgPT4gZGlyZW50LmRpc3Bvc2UoKSk7XG4gIFsnY2xvc2VycycsICd3YXRjaGVkJywgJ3N0cmVhbXMnLCAnc3ltbGlua1BhdGhzJywgJ3Rocm90dGxlZCddLmZvckVhY2goa2V5ID0+IHtcbiAgICB0aGlzW2BfJHtrZXl9YF0uY2xlYXIoKTtcbiAgfSk7XG5cbiAgdGhpcy5fY2xvc2VQcm9taXNlID0gY2xvc2Vycy5sZW5ndGggPyBQcm9taXNlLmFsbChjbG9zZXJzKS50aGVuKCgpID0+IHVuZGVmaW5lZCkgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgcmV0dXJuIHRoaXMuX2Nsb3NlUHJvbWlzZTtcbn1cblxuLyoqXG4gKiBFeHBvc2UgbGlzdCBvZiB3YXRjaGVkIHBhdGhzXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBmb3IgY2hhaW5pbmdcbiovXG5nZXRXYXRjaGVkKCkge1xuICBjb25zdCB3YXRjaExpc3QgPSB7fTtcbiAgdGhpcy5fd2F0Y2hlZC5mb3JFYWNoKChlbnRyeSwgZGlyKSA9PiB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5vcHRpb25zLmN3ZCA/IHN5c1BhdGgucmVsYXRpdmUodGhpcy5vcHRpb25zLmN3ZCwgZGlyKSA6IGRpcjtcbiAgICB3YXRjaExpc3Rba2V5IHx8IE9ORV9ET1RdID0gZW50cnkuZ2V0Q2hpbGRyZW4oKS5zb3J0KCk7XG4gIH0pO1xuICByZXR1cm4gd2F0Y2hMaXN0O1xufVxuXG5lbWl0V2l0aEFsbChldmVudCwgYXJncykge1xuICB0aGlzLmVtaXQoLi4uYXJncyk7XG4gIGlmIChldmVudCAhPT0gRVZfRVJST1IpIHRoaXMuZW1pdChFVl9BTEwsIC4uLmFyZ3MpO1xufVxuXG4vLyBDb21tb24gaGVscGVyc1xuLy8gLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBOb3JtYWxpemUgYW5kIGVtaXQgZXZlbnRzLlxuICogQ2FsbGluZyBfZW1pdCBET0VTIE5PVCBNRUFOIGVtaXQoKSB3b3VsZCBiZSBjYWxsZWQhXG4gKiBAcGFyYW0ge0V2ZW50TmFtZX0gZXZlbnQgVHlwZSBvZiBldmVudFxuICogQHBhcmFtIHtQYXRofSBwYXRoIEZpbGUgb3IgZGlyZWN0b3J5IHBhdGhcbiAqIEBwYXJhbSB7Kj19IHZhbDEgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB3aXRoIGV2ZW50XG4gKiBAcGFyYW0geyo9fSB2YWwyXG4gKiBAcGFyYW0geyo9fSB2YWwzXG4gKiBAcmV0dXJucyB0aGUgZXJyb3IgaWYgZGVmaW5lZCwgb3RoZXJ3aXNlIHRoZSB2YWx1ZSBvZiB0aGUgRlNXYXRjaGVyIGluc3RhbmNlJ3MgYGNsb3NlZGAgZmxhZ1xuICovXG5hc3luYyBfZW1pdChldmVudCwgcGF0aCwgdmFsMSwgdmFsMiwgdmFsMykge1xuICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcblxuICBjb25zdCBvcHRzID0gdGhpcy5vcHRpb25zO1xuICBpZiAoaXNXaW5kb3dzKSBwYXRoID0gc3lzUGF0aC5ub3JtYWxpemUocGF0aCk7XG4gIGlmIChvcHRzLmN3ZCkgcGF0aCA9IHN5c1BhdGgucmVsYXRpdmUob3B0cy5jd2QsIHBhdGgpO1xuICAvKiogQHR5cGUgQXJyYXk8YW55PiAqL1xuICBjb25zdCBhcmdzID0gW2V2ZW50LCBwYXRoXTtcbiAgaWYgKHZhbDMgIT09IHVuZGVmaW5lZCkgYXJncy5wdXNoKHZhbDEsIHZhbDIsIHZhbDMpO1xuICBlbHNlIGlmICh2YWwyICE9PSB1bmRlZmluZWQpIGFyZ3MucHVzaCh2YWwxLCB2YWwyKTtcbiAgZWxzZSBpZiAodmFsMSAhPT0gdW5kZWZpbmVkKSBhcmdzLnB1c2godmFsMSk7XG5cbiAgY29uc3QgYXdmID0gb3B0cy5hd2FpdFdyaXRlRmluaXNoO1xuICBsZXQgcHc7XG4gIGlmIChhd2YgJiYgKHB3ID0gdGhpcy5fcGVuZGluZ1dyaXRlcy5nZXQocGF0aCkpKSB7XG4gICAgcHcubGFzdENoYW5nZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpZiAob3B0cy5hdG9taWMpIHtcbiAgICBpZiAoZXZlbnQgPT09IEVWX1VOTElOSykge1xuICAgICAgdGhpcy5fcGVuZGluZ1VubGlua3Muc2V0KHBhdGgsIGFyZ3MpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdVbmxpbmtzLmZvckVhY2goKGVudHJ5LCBwYXRoKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KC4uLmVudHJ5KTtcbiAgICAgICAgICB0aGlzLmVtaXQoRVZfQUxMLCAuLi5lbnRyeSk7XG4gICAgICAgICAgdGhpcy5fcGVuZGluZ1VubGlua3MuZGVsZXRlKHBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIHR5cGVvZiBvcHRzLmF0b21pYyA9PT0gJ251bWJlcicgPyBvcHRzLmF0b21pYyA6IDEwMCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKGV2ZW50ID09PSBFVl9BREQgJiYgdGhpcy5fcGVuZGluZ1VubGlua3MuaGFzKHBhdGgpKSB7XG4gICAgICBldmVudCA9IGFyZ3NbMF0gPSBFVl9DSEFOR0U7XG4gICAgICB0aGlzLl9wZW5kaW5nVW5saW5rcy5kZWxldGUocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGF3ZiAmJiAoZXZlbnQgPT09IEVWX0FERCB8fCBldmVudCA9PT0gRVZfQ0hBTkdFKSAmJiB0aGlzLl9yZWFkeUVtaXR0ZWQpIHtcbiAgICBjb25zdCBhd2ZFbWl0ID0gKGVyciwgc3RhdHMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZXZlbnQgPSBhcmdzWzBdID0gRVZfRVJST1I7XG4gICAgICAgIGFyZ3NbMV0gPSBlcnI7XG4gICAgICAgIHRoaXMuZW1pdFdpdGhBbGwoZXZlbnQsIGFyZ3MpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0cykge1xuICAgICAgICAvLyBpZiBzdGF0cyBkb2Vzbid0IGV4aXN0IHRoZSBmaWxlIG11c3QgaGF2ZSBiZWVuIGRlbGV0ZWRcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMikge1xuICAgICAgICAgIGFyZ3NbMl0gPSBzdGF0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2goc3RhdHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdFdpdGhBbGwoZXZlbnQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9hd2FpdFdyaXRlRmluaXNoKHBhdGgsIGF3Zi5zdGFiaWxpdHlUaHJlc2hvbGQsIGV2ZW50LCBhd2ZFbWl0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmIChldmVudCA9PT0gRVZfQ0hBTkdFKSB7XG4gICAgY29uc3QgaXNUaHJvdHRsZWQgPSAhdGhpcy5fdGhyb3R0bGUoRVZfQ0hBTkdFLCBwYXRoLCA1MCk7XG4gICAgaWYgKGlzVGhyb3R0bGVkKSByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmIChvcHRzLmFsd2F5c1N0YXQgJiYgdmFsMSA9PT0gdW5kZWZpbmVkICYmXG4gICAgKGV2ZW50ID09PSBFVl9BREQgfHwgZXZlbnQgPT09IEVWX0FERF9ESVIgfHwgZXZlbnQgPT09IEVWX0NIQU5HRSlcbiAgKSB7XG4gICAgY29uc3QgZnVsbFBhdGggPSBvcHRzLmN3ZCA/IHN5c1BhdGguam9pbihvcHRzLmN3ZCwgcGF0aCkgOiBwYXRoO1xuICAgIGxldCBzdGF0cztcbiAgICB0cnkge1xuICAgICAgc3RhdHMgPSBhd2FpdCBzdGF0KGZ1bGxQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgLy8gU3VwcHJlc3MgZXZlbnQgd2hlbiBmc19zdGF0IGZhaWxzLCB0byBhdm9pZCBzZW5kaW5nIHVuZGVmaW5lZCAnc3RhdCdcbiAgICBpZiAoIXN0YXRzIHx8IHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgYXJncy5wdXNoKHN0YXRzKTtcbiAgfVxuICB0aGlzLmVtaXRXaXRoQWxsKGV2ZW50LCBhcmdzKTtcblxuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDb21tb24gaGFuZGxlciBmb3IgZXJyb3JzXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICogQHJldHVybnMge0Vycm9yfEJvb2xlYW59IFRoZSBlcnJvciBpZiBkZWZpbmVkLCBvdGhlcndpc2UgdGhlIHZhbHVlIG9mIHRoZSBGU1dhdGNoZXIgaW5zdGFuY2UncyBgY2xvc2VkYCBmbGFnXG4gKi9cbl9oYW5kbGVFcnJvcihlcnJvcikge1xuICBjb25zdCBjb2RlID0gZXJyb3IgJiYgZXJyb3IuY29kZTtcbiAgaWYgKGVycm9yICYmIGNvZGUgIT09ICdFTk9FTlQnICYmIGNvZGUgIT09ICdFTk9URElSJyAmJlxuICAgICghdGhpcy5vcHRpb25zLmlnbm9yZVBlcm1pc3Npb25FcnJvcnMgfHwgKGNvZGUgIT09ICdFUEVSTScgJiYgY29kZSAhPT0gJ0VBQ0NFUycpKVxuICApIHtcbiAgICB0aGlzLmVtaXQoRVZfRVJST1IsIGVycm9yKTtcbiAgfVxuICByZXR1cm4gZXJyb3IgfHwgdGhpcy5jbG9zZWQ7XG59XG5cbi8qKlxuICogSGVscGVyIHV0aWxpdHkgZm9yIHRocm90dGxpbmdcbiAqIEBwYXJhbSB7VGhyb3R0bGVUeXBlfSBhY3Rpb25UeXBlIHR5cGUgYmVpbmcgdGhyb3R0bGVkXG4gKiBAcGFyYW0ge1BhdGh9IHBhdGggYmVpbmcgYWN0ZWQgdXBvblxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgZHVyYXRpb24gb2YgdGltZSB0byBzdXBwcmVzcyBkdXBsaWNhdGUgYWN0aW9uc1xuICogQHJldHVybnMge09iamVjdHxmYWxzZX0gdHJhY2tpbmcgb2JqZWN0IG9yIGZhbHNlIGlmIGFjdGlvbiBzaG91bGQgYmUgc3VwcHJlc3NlZFxuICovXG5fdGhyb3R0bGUoYWN0aW9uVHlwZSwgcGF0aCwgdGltZW91dCkge1xuICBpZiAoIXRoaXMuX3Rocm90dGxlZC5oYXMoYWN0aW9uVHlwZSkpIHtcbiAgICB0aGlzLl90aHJvdHRsZWQuc2V0KGFjdGlvblR5cGUsIG5ldyBNYXAoKSk7XG4gIH1cblxuICAvKiogQHR5cGUge01hcDxQYXRoLCBPYmplY3Q+fSAqL1xuICBjb25zdCBhY3Rpb24gPSB0aGlzLl90aHJvdHRsZWQuZ2V0KGFjdGlvblR5cGUpO1xuICAvKiogQHR5cGUge09iamVjdH0gKi9cbiAgY29uc3QgYWN0aW9uUGF0aCA9IGFjdGlvbi5nZXQocGF0aCk7XG5cbiAgaWYgKGFjdGlvblBhdGgpIHtcbiAgICBhY3Rpb25QYXRoLmNvdW50Kys7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbGV0IHRpbWVvdXRPYmplY3Q7XG4gIGNvbnN0IGNsZWFyID0gKCkgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBhY3Rpb24uZ2V0KHBhdGgpO1xuICAgIGNvbnN0IGNvdW50ID0gaXRlbSA/IGl0ZW0uY291bnQgOiAwO1xuICAgIGFjdGlvbi5kZWxldGUocGF0aCk7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRPYmplY3QpO1xuICAgIGlmIChpdGVtKSBjbGVhclRpbWVvdXQoaXRlbS50aW1lb3V0T2JqZWN0KTtcbiAgICByZXR1cm4gY291bnQ7XG4gIH07XG4gIHRpbWVvdXRPYmplY3QgPSBzZXRUaW1lb3V0KGNsZWFyLCB0aW1lb3V0KTtcbiAgY29uc3QgdGhyID0ge3RpbWVvdXRPYmplY3QsIGNsZWFyLCBjb3VudDogMH07XG4gIGFjdGlvbi5zZXQocGF0aCwgdGhyKTtcbiAgcmV0dXJuIHRocjtcbn1cblxuX2luY3JSZWFkeUNvdW50KCkge1xuICByZXR1cm4gdGhpcy5fcmVhZHlDb3VudCsrO1xufVxuXG4vKipcbiAqIEF3YWl0cyB3cml0ZSBvcGVyYXRpb24gdG8gZmluaXNoLlxuICogUG9sbHMgYSBuZXdseSBjcmVhdGVkIGZpbGUgZm9yIHNpemUgdmFyaWF0aW9ucy4gV2hlbiBmaWxlcyBzaXplIGRvZXMgbm90IGNoYW5nZSBmb3IgJ3RocmVzaG9sZCcgbWlsbGlzZWNvbmRzIGNhbGxzIGNhbGxiYWNrLlxuICogQHBhcmFtIHtQYXRofSBwYXRoIGJlaW5nIGFjdGVkIHVwb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aHJlc2hvbGQgVGltZSBpbiBtaWxsaXNlY29uZHMgYSBmaWxlIHNpemUgbXVzdCBiZSBmaXhlZCBiZWZvcmUgYWNrbm93bGVkZ2luZyB3cml0ZSBPUCBpcyBmaW5pc2hlZFxuICogQHBhcmFtIHtFdmVudE5hbWV9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhd2ZFbWl0IENhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHJlYWR5IGZvciBldmVudCB0byBiZSBlbWl0dGVkLlxuICovXG5fYXdhaXRXcml0ZUZpbmlzaChwYXRoLCB0aHJlc2hvbGQsIGV2ZW50LCBhd2ZFbWl0KSB7XG4gIGxldCB0aW1lb3V0SGFuZGxlcjtcblxuICBsZXQgZnVsbFBhdGggPSBwYXRoO1xuICBpZiAodGhpcy5vcHRpb25zLmN3ZCAmJiAhc3lzUGF0aC5pc0Fic29sdXRlKHBhdGgpKSB7XG4gICAgZnVsbFBhdGggPSBzeXNQYXRoLmpvaW4odGhpcy5vcHRpb25zLmN3ZCwgcGF0aCk7XG4gIH1cblxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gIGNvbnN0IGF3YWl0V3JpdGVGaW5pc2ggPSAocHJldlN0YXQpID0+IHtcbiAgICBmcy5zdGF0KGZ1bGxQYXRoLCAoZXJyLCBjdXJTdGF0KSA9PiB7XG4gICAgICBpZiAoZXJyIHx8ICF0aGlzLl9wZW5kaW5nV3JpdGVzLmhhcyhwYXRoKSkge1xuICAgICAgICBpZiAoZXJyICYmIGVyci5jb2RlICE9PSAnRU5PRU5UJykgYXdmRW1pdChlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5vdyA9IE51bWJlcihuZXcgRGF0ZSgpKTtcblxuICAgICAgaWYgKHByZXZTdGF0ICYmIGN1clN0YXQuc2l6ZSAhPT0gcHJldlN0YXQuc2l6ZSkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nV3JpdGVzLmdldChwYXRoKS5sYXN0Q2hhbmdlID0gbm93O1xuICAgICAgfVxuICAgICAgY29uc3QgcHcgPSB0aGlzLl9wZW5kaW5nV3JpdGVzLmdldChwYXRoKTtcbiAgICAgIGNvbnN0IGRmID0gbm93IC0gcHcubGFzdENoYW5nZTtcblxuICAgICAgaWYgKGRmID49IHRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nV3JpdGVzLmRlbGV0ZShwYXRoKTtcbiAgICAgICAgYXdmRW1pdCh1bmRlZmluZWQsIGN1clN0YXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dEhhbmRsZXIgPSBzZXRUaW1lb3V0KFxuICAgICAgICAgIGF3YWl0V3JpdGVGaW5pc2gsXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmF3YWl0V3JpdGVGaW5pc2gucG9sbEludGVydmFsLFxuICAgICAgICAgIGN1clN0YXRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBpZiAoIXRoaXMuX3BlbmRpbmdXcml0ZXMuaGFzKHBhdGgpKSB7XG4gICAgdGhpcy5fcGVuZGluZ1dyaXRlcy5zZXQocGF0aCwge1xuICAgICAgbGFzdENoYW5nZTogbm93LFxuICAgICAgY2FuY2VsV2FpdDogKCkgPT4ge1xuICAgICAgICB0aGlzLl9wZW5kaW5nV3JpdGVzLmRlbGV0ZShwYXRoKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRpbWVvdXRIYW5kbGVyID0gc2V0VGltZW91dChcbiAgICAgIGF3YWl0V3JpdGVGaW5pc2gsXG4gICAgICB0aGlzLm9wdGlvbnMuYXdhaXRXcml0ZUZpbmlzaC5wb2xsSW50ZXJ2YWxcbiAgICApO1xuICB9XG59XG5cbl9nZXRHbG9iSWdub3JlZCgpIHtcbiAgcmV0dXJuIFsuLi50aGlzLl9pZ25vcmVkUGF0aHMudmFsdWVzKCldO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB1c2VyIGhhcyBhc2tlZCB0byBpZ25vcmUgdGhpcyBwYXRoLlxuICogQHBhcmFtIHtQYXRofSBwYXRoIGZpbGVwYXRoIG9yIGRpclxuICogQHBhcmFtIHtmcy5TdGF0cz19IHN0YXRzIHJlc3VsdCBvZiBmcy5zdGF0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuX2lzSWdub3JlZChwYXRoLCBzdGF0cykge1xuICBpZiAodGhpcy5vcHRpb25zLmF0b21pYyAmJiBET1RfUkUudGVzdChwYXRoKSkgcmV0dXJuIHRydWU7XG4gIGlmICghdGhpcy5fdXNlcklnbm9yZWQpIHtcbiAgICBjb25zdCB7Y3dkfSA9IHRoaXMub3B0aW9ucztcbiAgICBjb25zdCBpZ24gPSB0aGlzLm9wdGlvbnMuaWdub3JlZDtcblxuICAgIGNvbnN0IGlnbm9yZWQgPSBpZ24gJiYgaWduLm1hcChub3JtYWxpemVJZ25vcmVkKGN3ZCkpO1xuICAgIGNvbnN0IHBhdGhzID0gYXJyaWZ5KGlnbm9yZWQpXG4gICAgICAuZmlsdGVyKChwYXRoKSA9PiB0eXBlb2YgcGF0aCA9PT0gU1RSSU5HX1RZUEUgJiYgIWlzR2xvYihwYXRoKSlcbiAgICAgIC5tYXAoKHBhdGgpID0+IHBhdGggKyBTTEFTSF9HTE9CU1RBUik7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuX2dldEdsb2JJZ25vcmVkKCkubWFwKG5vcm1hbGl6ZUlnbm9yZWQoY3dkKSkuY29uY2F0KGlnbm9yZWQsIHBhdGhzKTtcbiAgICB0aGlzLl91c2VySWdub3JlZCA9IGFueW1hdGNoKGxpc3QsIHVuZGVmaW5lZCwgQU5ZTUFUQ0hfT1BUUyk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fdXNlcklnbm9yZWQoW3BhdGgsIHN0YXRzXSk7XG59XG5cbl9pc250SWdub3JlZChwYXRoLCBzdGF0KSB7XG4gIHJldHVybiAhdGhpcy5faXNJZ25vcmVkKHBhdGgsIHN0YXQpO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGEgc2V0IG9mIGNvbW1vbiBoZWxwZXJzIGFuZCBwcm9wZXJ0aWVzIHJlbGF0aW5nIHRvIHN5bWxpbmsgYW5kIGdsb2IgaGFuZGxpbmcuXG4gKiBAcGFyYW0ge1BhdGh9IHBhdGggZmlsZSwgZGlyZWN0b3J5LCBvciBnbG9iIHBhdHRlcm4gYmVpbmcgd2F0Y2hlZFxuICogQHBhcmFtIHtOdW1iZXI9fSBkZXB0aCBhdCBhbnkgZGVwdGggPiAwLCB0aGlzIGlzbid0IGEgZ2xvYlxuICogQHJldHVybnMge1dhdGNoSGVscGVyfSBvYmplY3QgY29udGFpbmluZyBoZWxwZXJzIGZvciB0aGlzIHBhdGhcbiAqL1xuX2dldFdhdGNoSGVscGVycyhwYXRoLCBkZXB0aCkge1xuICBjb25zdCB3YXRjaFBhdGggPSBkZXB0aCB8fCB0aGlzLm9wdGlvbnMuZGlzYWJsZUdsb2JiaW5nIHx8ICFpc0dsb2IocGF0aCkgPyBwYXRoIDogZ2xvYlBhcmVudChwYXRoKTtcbiAgY29uc3QgZm9sbG93ID0gdGhpcy5vcHRpb25zLmZvbGxvd1N5bWxpbmtzO1xuXG4gIHJldHVybiBuZXcgV2F0Y2hIZWxwZXIocGF0aCwgd2F0Y2hQYXRoLCBmb2xsb3csIHRoaXMpO1xufVxuXG4vLyBEaXJlY3RvcnkgaGVscGVyc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBQcm92aWRlcyBkaXJlY3RvcnkgdHJhY2tpbmcgb2JqZWN0c1xuICogQHBhcmFtIHtTdHJpbmd9IGRpcmVjdG9yeSBwYXRoIG9mIHRoZSBkaXJlY3RvcnlcbiAqIEByZXR1cm5zIHtEaXJFbnRyeX0gdGhlIGRpcmVjdG9yeSdzIHRyYWNraW5nIG9iamVjdFxuICovXG5fZ2V0V2F0Y2hlZERpcihkaXJlY3RvcnkpIHtcbiAgaWYgKCF0aGlzLl9ib3VuZFJlbW92ZSkgdGhpcy5fYm91bmRSZW1vdmUgPSB0aGlzLl9yZW1vdmUuYmluZCh0aGlzKTtcbiAgY29uc3QgZGlyID0gc3lzUGF0aC5yZXNvbHZlKGRpcmVjdG9yeSk7XG4gIGlmICghdGhpcy5fd2F0Y2hlZC5oYXMoZGlyKSkgdGhpcy5fd2F0Y2hlZC5zZXQoZGlyLCBuZXcgRGlyRW50cnkoZGlyLCB0aGlzLl9ib3VuZFJlbW92ZSkpO1xuICByZXR1cm4gdGhpcy5fd2F0Y2hlZC5nZXQoZGlyKTtcbn1cblxuLy8gRmlsZSBoZWxwZXJzXG4vLyAtLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDaGVjayBmb3IgcmVhZCBwZXJtaXNzaW9ucy5cbiAqIEJhc2VkIG9uIHRoaXMgYW5zd2VyIG9uIFNPOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTE3ODE0MDQvMTM1ODQwNVxuICogQHBhcmFtIHtmcy5TdGF0c30gc3RhdHMgLSBvYmplY3QsIHJlc3VsdCBvZiBmc19zdGF0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGZpbGUgY2FuIGJlIHJlYWRcbiovXG5faGFzUmVhZFBlcm1pc3Npb25zKHN0YXRzKSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlUGVybWlzc2lvbkVycm9ycykgcmV0dXJuIHRydWU7XG5cbiAgLy8gc3RhdHMubW9kZSBtYXkgYmUgYmlnaW50XG4gIGNvbnN0IG1kID0gc3RhdHMgJiYgTnVtYmVyLnBhcnNlSW50KHN0YXRzLm1vZGUsIDEwKTtcbiAgY29uc3Qgc3QgPSBtZCAmIDBvNzc3O1xuICBjb25zdCBpdCA9IE51bWJlci5wYXJzZUludChzdC50b1N0cmluZyg4KVswXSwgMTApO1xuICByZXR1cm4gQm9vbGVhbig0ICYgaXQpO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgZW1pdHRpbmcgdW5saW5rIGV2ZW50cyBmb3JcbiAqIGZpbGVzIGFuZCBkaXJlY3RvcmllcywgYW5kIHZpYSByZWN1cnNpb24sIGZvclxuICogZmlsZXMgYW5kIGRpcmVjdG9yaWVzIHdpdGhpbiBkaXJlY3RvcmllcyB0aGF0IGFyZSB1bmxpbmtlZFxuICogQHBhcmFtIHtTdHJpbmd9IGRpcmVjdG9yeSB3aXRoaW4gd2hpY2ggdGhlIGZvbGxvd2luZyBpdGVtIGlzIGxvY2F0ZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtICAgICAgYmFzZSBwYXRoIG9mIGl0ZW0vZGlyZWN0b3J5XG4gKiBAcmV0dXJucyB7dm9pZH1cbiovXG5fcmVtb3ZlKGRpcmVjdG9yeSwgaXRlbSwgaXNEaXJlY3RvcnkpIHtcbiAgLy8gaWYgd2hhdCBpcyBiZWluZyBkZWxldGVkIGlzIGEgZGlyZWN0b3J5LCBnZXQgdGhhdCBkaXJlY3RvcnkncyBwYXRoc1xuICAvLyBmb3IgcmVjdXJzaXZlIGRlbGV0aW5nIGFuZCBjbGVhbmluZyBvZiB3YXRjaGVkIG9iamVjdFxuICAvLyBpZiBpdCBpcyBub3QgYSBkaXJlY3RvcnksIG5lc3RlZERpcmVjdG9yeUNoaWxkcmVuIHdpbGwgYmUgZW1wdHkgYXJyYXlcbiAgY29uc3QgcGF0aCA9IHN5c1BhdGguam9pbihkaXJlY3RvcnksIGl0ZW0pO1xuICBjb25zdCBmdWxsUGF0aCA9IHN5c1BhdGgucmVzb2x2ZShwYXRoKTtcbiAgaXNEaXJlY3RvcnkgPSBpc0RpcmVjdG9yeSAhPSBudWxsXG4gICAgPyBpc0RpcmVjdG9yeVxuICAgIDogdGhpcy5fd2F0Y2hlZC5oYXMocGF0aCkgfHwgdGhpcy5fd2F0Y2hlZC5oYXMoZnVsbFBhdGgpO1xuXG4gIC8vIHByZXZlbnQgZHVwbGljYXRlIGhhbmRsaW5nIGluIGNhc2Ugb2YgYXJyaXZpbmcgaGVyZSBuZWFybHkgc2ltdWx0YW5lb3VzbHlcbiAgLy8gdmlhIG11bHRpcGxlIHBhdGhzIChzdWNoIGFzIF9oYW5kbGVGaWxlIGFuZCBfaGFuZGxlRGlyKVxuICBpZiAoIXRoaXMuX3Rocm90dGxlKCdyZW1vdmUnLCBwYXRoLCAxMDApKSByZXR1cm47XG5cbiAgLy8gaWYgdGhlIG9ubHkgd2F0Y2hlZCBmaWxlIGlzIHJlbW92ZWQsIHdhdGNoIGZvciBpdHMgcmV0dXJuXG4gIGlmICghaXNEaXJlY3RvcnkgJiYgIXRoaXMub3B0aW9ucy51c2VGc0V2ZW50cyAmJiB0aGlzLl93YXRjaGVkLnNpemUgPT09IDEpIHtcbiAgICB0aGlzLmFkZChkaXJlY3RvcnksIGl0ZW0sIHRydWUpO1xuICB9XG5cbiAgLy8gVGhpcyB3aWxsIGNyZWF0ZSBhIG5ldyBlbnRyeSBpbiB0aGUgd2F0Y2hlZCBvYmplY3QgaW4gZWl0aGVyIGNhc2VcbiAgLy8gc28gd2UgZ290IHRvIGRvIHRoZSBkaXJlY3RvcnkgY2hlY2sgYmVmb3JlaGFuZFxuICBjb25zdCB3cCA9IHRoaXMuX2dldFdhdGNoZWREaXIocGF0aCk7XG4gIGNvbnN0IG5lc3RlZERpcmVjdG9yeUNoaWxkcmVuID0gd3AuZ2V0Q2hpbGRyZW4oKTtcblxuICAvLyBSZWN1cnNpdmVseSByZW1vdmUgY2hpbGRyZW4gZGlyZWN0b3JpZXMgLyBmaWxlcy5cbiAgbmVzdGVkRGlyZWN0b3J5Q2hpbGRyZW4uZm9yRWFjaChuZXN0ZWQgPT4gdGhpcy5fcmVtb3ZlKHBhdGgsIG5lc3RlZCkpO1xuXG4gIC8vIENoZWNrIGlmIGl0ZW0gd2FzIG9uIHRoZSB3YXRjaGVkIGxpc3QgYW5kIHJlbW92ZSBpdFxuICBjb25zdCBwYXJlbnQgPSB0aGlzLl9nZXRXYXRjaGVkRGlyKGRpcmVjdG9yeSk7XG4gIGNvbnN0IHdhc1RyYWNrZWQgPSBwYXJlbnQuaGFzKGl0ZW0pO1xuICBwYXJlbnQucmVtb3ZlKGl0ZW0pO1xuXG4gIC8vIEZpeGVzIGlzc3VlICMxMDQyIC0+IFJlbGF0aXZlIHBhdGhzIHdlcmUgZGV0ZWN0ZWQgYW5kIGFkZGVkIGFzIHN5bWxpbmtzXG4gIC8vIChodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2Nob2tpZGFyL2Jsb2IvZTE3NTNkZGJjOTU3MWJkYzMzYjRhNGFmMTcyZDUyY2I2ZTYxMWMxMC9saWIvbm9kZWZzLWhhbmRsZXIuanMjTDYxMiksXG4gIC8vIGJ1dCBuZXZlciByZW1vdmVkIGZyb20gdGhlIG1hcCBpbiBjYXNlIHRoZSBwYXRoIHdhcyBkZWxldGVkLlxuICAvLyBUaGlzIGxlYWRzIHRvIGFuIGluY29ycmVjdCBzdGF0ZSBpZiB0aGUgcGF0aCB3YXMgcmVjcmVhdGVkOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2Nob2tpZGFyL2Jsb2IvZTE3NTNkZGJjOTU3MWJkYzMzYjRhNGFmMTcyZDUyY2I2ZTYxMWMxMC9saWIvbm9kZWZzLWhhbmRsZXIuanMjTDU1M1xuICBpZiAodGhpcy5fc3ltbGlua1BhdGhzLmhhcyhmdWxsUGF0aCkpIHtcbiAgICB0aGlzLl9zeW1saW5rUGF0aHMuZGVsZXRlKGZ1bGxQYXRoKTtcbiAgfVxuXG4gIC8vIElmIHdlIHdhaXQgZm9yIHRoaXMgZmlsZSB0byBiZSBmdWxseSB3cml0dGVuLCBjYW5jZWwgdGhlIHdhaXQuXG4gIGxldCByZWxQYXRoID0gcGF0aDtcbiAgaWYgKHRoaXMub3B0aW9ucy5jd2QpIHJlbFBhdGggPSBzeXNQYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jd2QsIHBhdGgpO1xuICBpZiAodGhpcy5vcHRpb25zLmF3YWl0V3JpdGVGaW5pc2ggJiYgdGhpcy5fcGVuZGluZ1dyaXRlcy5oYXMocmVsUGF0aCkpIHtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuX3BlbmRpbmdXcml0ZXMuZ2V0KHJlbFBhdGgpLmNhbmNlbFdhaXQoKTtcbiAgICBpZiAoZXZlbnQgPT09IEVWX0FERCkgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhlIEVudHJ5IHdpbGwgZWl0aGVyIGJlIGEgZGlyZWN0b3J5IHRoYXQganVzdCBnb3QgcmVtb3ZlZFxuICAvLyBvciBhIGJvZ3VzIGVudHJ5IHRvIGEgZmlsZSwgaW4gZWl0aGVyIGNhc2Ugd2UgaGF2ZSB0byByZW1vdmUgaXRcbiAgdGhpcy5fd2F0Y2hlZC5kZWxldGUocGF0aCk7XG4gIHRoaXMuX3dhdGNoZWQuZGVsZXRlKGZ1bGxQYXRoKTtcbiAgY29uc3QgZXZlbnROYW1lID0gaXNEaXJlY3RvcnkgPyBFVl9VTkxJTktfRElSIDogRVZfVU5MSU5LO1xuICBpZiAod2FzVHJhY2tlZCAmJiAhdGhpcy5faXNJZ25vcmVkKHBhdGgpKSB0aGlzLl9lbWl0KGV2ZW50TmFtZSwgcGF0aCk7XG5cbiAgLy8gQXZvaWQgY29uZmxpY3RzIGlmIHdlIGxhdGVyIGNyZWF0ZSBhbm90aGVyIGZpbGUgd2l0aCB0aGUgc2FtZSBuYW1lXG4gIGlmICghdGhpcy5vcHRpb25zLnVzZUZzRXZlbnRzKSB7XG4gICAgdGhpcy5fY2xvc2VQYXRoKHBhdGgpO1xuICB9XG59XG5cbi8qKlxuICogQ2xvc2VzIGFsbCB3YXRjaGVycyBmb3IgYSBwYXRoXG4gKiBAcGFyYW0ge1BhdGh9IHBhdGhcbiAqL1xuX2Nsb3NlUGF0aChwYXRoKSB7XG4gIHRoaXMuX2Nsb3NlRmlsZShwYXRoKVxuICBjb25zdCBkaXIgPSBzeXNQYXRoLmRpcm5hbWUocGF0aCk7XG4gIHRoaXMuX2dldFdhdGNoZWREaXIoZGlyKS5yZW1vdmUoc3lzUGF0aC5iYXNlbmFtZShwYXRoKSk7XG59XG5cbi8qKlxuICogQ2xvc2VzIG9ubHkgZmlsZS1zcGVjaWZpYyB3YXRjaGVyc1xuICogQHBhcmFtIHtQYXRofSBwYXRoXG4gKi9cbl9jbG9zZUZpbGUocGF0aCkge1xuICBjb25zdCBjbG9zZXJzID0gdGhpcy5fY2xvc2Vycy5nZXQocGF0aCk7XG4gIGlmICghY2xvc2VycykgcmV0dXJuO1xuICBjbG9zZXJzLmZvckVhY2goY2xvc2VyID0+IGNsb3NlcigpKTtcbiAgdGhpcy5fY2xvc2Vycy5kZWxldGUocGF0aCk7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7UGF0aH0gcGF0aFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2xvc2VyXG4gKi9cbl9hZGRQYXRoQ2xvc2VyKHBhdGgsIGNsb3Nlcikge1xuICBpZiAoIWNsb3NlcikgcmV0dXJuO1xuICBsZXQgbGlzdCA9IHRoaXMuX2Nsb3NlcnMuZ2V0KHBhdGgpO1xuICBpZiAoIWxpc3QpIHtcbiAgICBsaXN0ID0gW107XG4gICAgdGhpcy5fY2xvc2Vycy5zZXQocGF0aCwgbGlzdCk7XG4gIH1cbiAgbGlzdC5wdXNoKGNsb3Nlcik7XG59XG5cbl9yZWFkZGlycChyb290LCBvcHRzKSB7XG4gIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICBjb25zdCBvcHRpb25zID0ge3R5cGU6IEVWX0FMTCwgYWx3YXlzU3RhdDogdHJ1ZSwgbHN0YXQ6IHRydWUsIC4uLm9wdHN9O1xuICBsZXQgc3RyZWFtID0gcmVhZGRpcnAocm9vdCwgb3B0aW9ucyk7XG4gIHRoaXMuX3N0cmVhbXMuYWRkKHN0cmVhbSk7XG4gIHN0cmVhbS5vbmNlKFNUUl9DTE9TRSwgKCkgPT4ge1xuICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcbiAgfSk7XG4gIHN0cmVhbS5vbmNlKFNUUl9FTkQsICgpID0+IHtcbiAgICBpZiAoc3RyZWFtKSB7XG4gICAgICB0aGlzLl9zdHJlYW1zLmRlbGV0ZShzdHJlYW0pO1xuICAgICAgc3RyZWFtID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzdHJlYW07XG59XG5cbn1cblxuLy8gRXhwb3J0IEZTV2F0Y2hlciBjbGFzc1xuZXhwb3J0cy5GU1dhdGNoZXIgPSBGU1dhdGNoZXI7XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIHdhdGNoZXIgd2l0aCBwYXRocyB0byBiZSB0cmFja2VkLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXk8U3RyaW5nPn0gcGF0aHMgZmlsZS9kaXJlY3RvcnkgcGF0aHMgYW5kL29yIGdsb2JzXG4gKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnMgY2hva2lkYXIgb3B0c1xuICogQHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgRlNXYXRjaGVyIGZvciBjaGFpbmluZy5cbiAqL1xuY29uc3Qgd2F0Y2ggPSAocGF0aHMsIG9wdGlvbnMpID0+IHtcbiAgY29uc3Qgd2F0Y2hlciA9IG5ldyBGU1dhdGNoZXIob3B0aW9ucyk7XG4gIHdhdGNoZXIuYWRkKHBhdGhzKTtcbiAgcmV0dXJuIHdhdGNoZXI7XG59O1xuXG5leHBvcnRzLndhdGNoID0gd2F0Y2g7XG4iLCJpbXBvcnQgeyBCcm93c2VyV2luZG93LCBpcGNNYWluLCBkaWFsb2cgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgUEFUSCBmcm9tICdwYXRoJztcbmltcG9ydCBGUyBmcm9tICdmcyc7XG5pbXBvcnQgY2hva2lkYXIgZnJvbSAnY2hva2lkYXInO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5cbmNvbnN0IGNoYW5nZUxpc3RlbmVycyA9IHt9O1xuXG5leHBvcnQgY29uc3QgTG9jYWxGaWxlU3lzdGVtU2VydmljZSA9IHtcblxuICByZWFkRGlyOiAoZSxwYXRoKSA9PiB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcblxuICAgIGNvbnN0IGxhYmVscyA9IEZTLnJlYWRkaXJTeW5jKHBhdGgpO1xuICAgIGZvcihjb25zdCBsIG9mIGxhYmVscyl7XG4gICAgICBjb25zdCBzdGF0ID0gRlMubHN0YXRTeW5jKFBBVEguam9pbihwYXRoLGwpKTtcbiAgICAgIGlmKGwuc3RhcnRzV2l0aCgnaXNhLicpIHx8IGwuc3RhcnRzV2l0aCgnLmdpdCcpIHx8IGwuc3RhcnRzV2l0aCgnLmFyYycpKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgc3RhdC5pZCA9IHBhdGgrJy8nK2w7XG4gICAgICBzdGF0LmlzRGlyZWN0b3J5ID0gc3RhdC5pc0RpcmVjdG9yeSgpO1xuICAgICAgY2hpbGRyZW4ucHVzaChzdGF0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH0sXG5cbiAgc2VsZWN0RGlyOiBhc3luYyAoKT0+e1xuICAgIGNvbnN0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRpYWxvZy5zaG93T3BlbkRpYWxvZyh3aW5kb3csIHtcbiAgICAgIHByb3BlcnRpZXM6IFsnb3BlbkRpcmVjdG9yeSddXG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5maWxlUGF0aHNbMF07XG4gIH0sXG5cbiAgc2F2ZUZpbGU6IGFzeW5jICgpPT57XG4gICAgY29uc3Qgd2luZG93ID0gQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZmluZCh3ID0+ICF3LmlzRGVzdHJveWVkKCkpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHdpbmRvdyk7XG4gICAgcmV0dXJuIHJlc3VsdC5maWxlUGF0aDtcbiAgfSxcblxuICByZWFkRmlsZTogKGUscGF0aCk9PntcbiAgICByZXR1cm4gRlMucmVhZEZpbGVTeW5jKHBhdGgse2VuY29kaW5nOidVVEYtOCd9KTtcbiAgfSxcblxuICByZWdpc3RlckNoYW5nZUxpc3RlbmVyOiBhc3luYyAoZSxwYXRoKT0+e1xuICAgIGNvbnNvbGUubG9nKCdybCcscGF0aClcbiAgICBjaGFuZ2VMaXN0ZW5lcnNbcGF0aF0gPSBjaG9raWRhci53YXRjaChwYXRoLHtpZ25vcmVJbml0aWFsOnRydWV9KTtcblxuICAgIGNvbnN0IHVwZGF0ZVBhdGggPSBwYXRoID0+IHtcbiAgICAgIGNvbnN0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcbiAgICAgIHdpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnVwZGF0ZVBhdGgnLCBwYXRoKTtcbiAgICB9O1xuICAgIGNvbnN0IHVwZGF0ZVBhcmVudFBhdGggPSBwYXRoID0+IHtcbiAgICAgIHVwZGF0ZVBhdGgoIHBhdGguc3BsaXQoJy8nKS5zbGljZSgwLC0xKS5qb2luKCcvJykgKTtcbiAgICB9O1xuXG4gICAgY2hhbmdlTGlzdGVuZXJzW3BhdGhdXG4gICAgICAvLyAub24oJ2FsbCcsIChldmVudCwgcGF0aCkgPT4ge1xuICAgICAgLy8gICAvLyBjb25zb2xlLmxvZyhldmVudCxwYXRoKTtcbiAgICAgIC8vIH0pXG4gICAgICAub24oJ2FkZCcsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ3VubGluaycsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ2FkZERpcicsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgICAub24oJ3VubGlua0RpcicsIHVwZGF0ZVBhcmVudFBhdGgpXG4gICAgO1xuXG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIHVucmVnaXN0ZXJDaGFuZ2VMaXN0ZW5lcjogYXN5bmMgKGUscGF0aCk9PntcbiAgICBjb25zb2xlLmxvZygndWwnLHBhdGgpXG4gICAgY29uc3Qgd2F0Y2hlciA9IGNoYW5nZUxpc3RlbmVyc1twYXRoXTtcbiAgICBpZighd2F0Y2hlcilcbiAgICAgIHJldHVybjtcblxuICAgIGF3YWl0IHdhdGNoZXIudW53YXRjaCgpO1xuICAgIGRlbGV0ZSBjaGFuZ2VMaXN0ZW5lcnNbcGF0aF07XG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIGluaXQ6IGFzeW5jICgpID0+IHtcbiAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uLCBwKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGBVbmhhbmRsZWQgUmVqZWN0aW9uIGF0OiAke3V0aWwuaW5zcGVjdChwKX0gcmVhc29uOiAke3JlYXNvbn1gKTtcbiAgICB9KTtcblxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWREaXInLCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWREaXIpXG4gICAgaXBjTWFpbi5oYW5kbGUoJ0xvY2FsRmlsZVN5c3RlbVNlcnZpY2UucmVhZEZpbGUnLCBMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnJlYWRGaWxlKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnNlbGVjdERpcicsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2Uuc2VsZWN0RGlyKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnNhdmVGaWxlJywgTG9jYWxGaWxlU3lzdGVtU2VydmljZS5zYXZlRmlsZSlcbiAgICBpcGNNYWluLmhhbmRsZSgnTG9jYWxGaWxlU3lzdGVtU2VydmljZS5yZWdpc3RlckNoYW5nZUxpc3RlbmVyJywgTG9jYWxGaWxlU3lzdGVtU2VydmljZS5yZWdpc3RlckNoYW5nZUxpc3RlbmVyKVxuICAgIGlwY01haW4uaGFuZGxlKCdMb2NhbEZpbGVTeXN0ZW1TZXJ2aWNlLnVucmVnaXN0ZXJDaGFuZ2VMaXN0ZW5lcicsIExvY2FsRmlsZVN5c3RlbVNlcnZpY2UudW5yZWdpc3RlckNoYW5nZUxpc3RlbmVyKVxuICB9XG59XG4iLCJpbXBvcnQge1xuICBpcGNNYWluLFxuICBCcm93c2VyV2luZG93LFxuICBkaWFsb2csXG4gIHNoZWxsXG59IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJztcblxuY29uc3QgaHR0cHNPcHRpb25zID0ge1xuICBob3N0OiAnZ2l0Lm5mZGk0cGxhbnRzLm9yZycsXG4gIHBvcnQ6IDQ0MyxcbiAgcGF0aDogJycsXG4gIG1ldGhvZDogJ0dFVCcsXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICd1c2VyLWFnZW50JzogJ25vZGUuanMnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBEYXRhSHViU2VydmljZSA9IHtcblxuICBnZXRXZWJQYWdlQXNKc29uOiAoZSx1cmwpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGh0dHBzT3B0aW9ucy5wYXRoID0gdXJsO1xuXG4gICAgICAgIGNvbnN0IHJlcSA9IGh0dHBzLnJlcXVlc3QoaHR0cHNPcHRpb25zLCByZXMgPT4ge1xuICAgICAgICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAgICAgICByZXMuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgICAgICByZXMub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gY2h1bms7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2Uob3V0cHV0KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXEuZW5kKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfSxcblxuICBzZWxlY3RJbXBvcnREZXN0aW5hdGlvbjogYXN5bmMgKCk9PntcbiAgICBjb25zdCB3aW5kb3cgPSBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5maW5kKHcgPT4gIXcuaXNEZXN0cm95ZWQoKSk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGlhbG9nLnNob3dPcGVuRGlhbG9nKHdpbmRvdywge1xuICAgICAgdGl0bGU6ICdTZWxlY3QgRGVzdGluYXRpb24gb2YgQVJDIEltcG9ydCcsXG4gICAgICBtZXNzYWdlOiAnU2VsZWN0IERlc3RpbmF0aW9uIG9mIEFSQyBJbXBvcnQnLFxuICAgICAgcHJvcGVydGllczogWydvcGVuRGlyZWN0b3J5J11cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LmZpbGVQYXRoc1swXTtcbiAgfSxcblxuICBnZXRBcmNzOiBhc3luYyBlPT57XG4gICAgcmV0dXJuIGF3YWl0IERhdGFIdWJTZXJ2aWNlLmdldFdlYlBhZ2VBc0pzb24obnVsbCxcIi9hcGkvdjQvcHJvamVjdHMvXCIpO1xuICB9LFxuXG4gIGluc3BlY3RBcmM6IGFzeW5jIChlLHVybCk9PntcbiAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJsKTtcbiAgICAvLyB0cnkge1xuICAgIC8vICAgb3Blbih1cmwpO1xuICAgIC8vIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm47XG4gIH0sXG5cbiAgaW5pdDogYXN5bmMgKCkgPT4ge1xuICAgIGlwY01haW4uaGFuZGxlKCdEYXRhSHViU2VydmljZS5nZXRBcmNzJywgRGF0YUh1YlNlcnZpY2UuZ2V0QXJjcyApO1xuICAgIGlwY01haW4uaGFuZGxlKCdEYXRhSHViU2VydmljZS5pbnNwZWN0QXJjJywgRGF0YUh1YlNlcnZpY2UuaW5zcGVjdEFyYyApO1xuICAgIGlwY01haW4uaGFuZGxlKCdEYXRhSHViU2VydmljZS5zZWxlY3RJbXBvcnREZXN0aW5hdGlvbicsIERhdGFIdWJTZXJ2aWNlLnNlbGVjdEltcG9ydERlc3RpbmF0aW9uICk7XG4gIH1cblxufTtcbiIsImltcG9ydCB7XG4gIGlwY01haW4sXG4gIEJyb3dzZXJXaW5kb3dcbn0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHtcbiAgc3Bhd25cbn0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmV4cG9ydCBjb25zdCBBcmNDb21tYW5kZXJTZXJ2aWNlID0ge1xuXG4gIHJ1bjogKGUsb3B0aW9ucykgPT4ge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBhcmdzID0gdHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnID8gW29wdGlvbnNdIDogb3B0aW9ucy5hcmdzO1xuICAgICAgY29uc3QgbyA9IHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJyA/IHt9IDogb3B0aW9ucztcblxuICAgICAgbGV0IHdpbmRvdyA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZpbmQodyA9PiAhdy5pc0Rlc3Ryb3llZCgpKTtcbiAgICAgIGNvbnN0IHAgPSBzcGF3bignYXJjJywgYXJncywgbyk7XG4gICAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICAgIGxldCBvdXRwdXQgPSAnJztcbiAgICAgIHAuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGFBc1N0cmluZyA9IGRhdGEudG9TdHJpbmcoKTtcbiAgICAgICAgb3V0cHV0ICs9IGRhdGFBc1N0cmluZztcbiAgICAgICAgaWYoZGF0YUFzU3RyaW5nLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2Vycm9yJykpXG4gICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICB3aW5kb3cud2ViQ29udGVudHMuc2VuZCgnQXJjQ29tbWFuZGVyU2VydmljZS5NU0cnLCBkYXRhQXNTdHJpbmcpO1xuICAgICAgfSk7XG5cbiAgICAgIHAuc3RkZXJyLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgZGF0YUFzU3RyaW5nID0gZGF0YS50b1N0cmluZygpO1xuICAgICAgICBvdXRwdXQgKz0gZGF0YUFzU3RyaW5nO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdlJyxkYXRhQXNTdHJpbmcpO1xuICAgICAgICB3aW5kb3cud2ViQ29udGVudHMuc2VuZCgnQXJjQ29tbWFuZGVyU2VydmljZS5NU0cnLCBkYXRhQXNTdHJpbmcpO1xuICAgICAgfSk7XG5cbiAgICAgIHAub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgIHJlc29sdmUoW2ZhbHNlLGVyci50b1N0cmluZygpXSk7XG4gICAgICB9KTtcblxuICAgICAgcC5vbignZXhpdCcsIGNvZGUgPT4ge1xuICAgICAgICByZXNvbHZlKFtjb2RlPT09MCAmJiAhZXJyb3Isb3V0cHV0XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyBjb25zb2xlLmxvZyhjbWQsbyk7XG4gICAgLy8gdHJ5IHtcbiAgICAvLyAgIGNvbnN0IHRlc3QgPSBleGVjU3luYyhgYXJjICR7Y21kfWAsIG8pLnRvU3RyaW5nKCk7XG4gICAgLy8gICByZXR1cm4gW3RydWUsdGVzdF07XG4gICAgLy8gfSBjYXRjaCAoZSkge1xuICAgIC8vICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAvLyAgIHJldHVybiBbZmFsc2UsZV07XG4gICAgLy8gfVxuICB9LFxuXG4gIC8vIGlzUmVhZHk6IGFzeW5jICgpPT57XG4gIC8vICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgQXJjQ29tbWFuZGVyU2VydmljZS5ydW4oJy0tdmVyc2lvbicpO1xuICAvLyAgIHJldHVybiBzdGF0dXNbMF07XG4gIC8vIH0sXG5cbiAgLy8gZ2V0QXJjOiBhc3luYyBkYXRhPT57XG4gIC8vICAgLy8gY29uc3Qgc3RhdHVzID0gYXdhaXQgQXJjQ29tbWFuZGVyU2VydmljZS5ydW4oJy0tdmVyc2lvbicpO1xuICAvLyAgIC8vIHJldHVybiBzdGF0dXNbMF07XG4gIC8vIH0sXG5cbiAgaW5pdDogYXN5bmMgKCkgPT4ge1xuICAgIC8vIGlwY01haW4uaGFuZGxlKCdBcmNDb21tYW5kZXJTZXJ2aWNlLmlzUmVhZHknLCBBcmNDb21tYW5kZXJTZXJ2aWNlLmlzUmVhZHkgKTtcbiAgICBpcGNNYWluLmhhbmRsZSgnQXJjQ29tbWFuZGVyU2VydmljZS5ydW4nLCBBcmNDb21tYW5kZXJTZXJ2aWNlLnJ1biApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgaXBjTWFpbixcbiAgc2hlbGxcbn0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuXG5sZXQgcmVxID0gbnVsbDtcblxuZXhwb3J0IGNvbnN0IEludGVybmV0U2VydmljZSA9IHtcblxuICBjYWxsU3dhdGVBUEk6IChldmVudCwgZGF0YSk9PntcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBob3N0OiAnc3dhdGUubmZkaTRwbGFudHMub3JnJyxcbiAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgICAgcGF0aDogYC9hcGkvSU9udG9sb2d5QVBJdjIvJHtkYXRhLm1ldGhvZH1gLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdhY2NlcHQnOiAgICAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgJ3VzZXItYWdlbnQnOiAgICdub2RlLmpzJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZihyZXEpXG4gICAgICAgICAgcmVxLmRlc3Ryb3koKTtcblxuICAgICAgICByZXEgPSBodHRwcy5yZXF1ZXN0KG9wdGlvbnMsIHJlcyA9PiB7XG4gICAgICAgICAgbGV0IG91dHB1dCA9ICcnO1xuICAgICAgICAgIHJlcy5zZXRFbmNvZGluZygndXRmOCcpO1xuICAgICAgICAgIHJlcy5vbignZGF0YScsIGNodW5rID0+IHtcbiAgICAgICAgICAgIG91dHB1dCArPSBjaHVuaztcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShvdXRwdXQpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlcS53cml0ZShkYXRhLnBheWxvYWQpO1xuICAgICAgICByZXEuZW5kKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfSxcblxuICBvcGVuRXh0ZXJuYWxVUkw6IGFzeW5jIChlLHVybCk9PntcbiAgICBzaGVsbC5vcGVuRXh0ZXJuYWwodXJsKTtcbiAgICByZXR1cm47XG4gIH0sXG5cbiAgaW5pdDogYXN5bmMgKCkgPT4ge1xuICAgIGlwY01haW4uaGFuZGxlKCdJbnRlcm5ldFNlcnZpY2Uub3BlbkV4dGVybmFsVVJMJywgSW50ZXJuZXRTZXJ2aWNlLm9wZW5FeHRlcm5hbFVSTCApO1xuICAgIGlwY01haW4uaGFuZGxlKCdJbnRlcm5ldFNlcnZpY2UuY2FsbFN3YXRlQVBJJywgSW50ZXJuZXRTZXJ2aWNlLmNhbGxTd2F0ZUFQSSApO1xuICB9XG5cbn07XG4iLCJpbXBvcnQge2FwcH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0ICcuL3NlY3VyaXR5LXJlc3RyaWN0aW9ucyc7XG5pbXBvcnQge3Jlc3RvcmVPckNyZWF0ZVdpbmRvd30gZnJvbSAnL0AvbWFpbldpbmRvdyc7XG5pbXBvcnQge0xvY2FsRmlsZVN5c3RlbVNlcnZpY2V9IGZyb20gJy9AL0xvY2FsRmlsZVN5c3RlbVNlcnZpY2UnO1xuaW1wb3J0IHtEYXRhSHViU2VydmljZX0gZnJvbSAnL0AvRGF0YUh1YlNlcnZpY2UnO1xuaW1wb3J0IHtBcmNDb21tYW5kZXJTZXJ2aWNlfSBmcm9tICcvQC9BcmNDb21tYW5kZXJTZXJ2aWNlJztcbmltcG9ydCB7SW50ZXJuZXRTZXJ2aWNlfSBmcm9tICcvQC9JbnRlcm5ldFNlcnZpY2UnO1xuXG4vKipcbiAqIFByZXZlbnQgbXVsdGlwbGUgaW5zdGFuY2VzXG4gKi9cbmNvbnN0IGlzU2luZ2xlSW5zdGFuY2UgPSBhcHAucmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jaygpO1xuaWYgKCFpc1NpbmdsZUluc3RhbmNlKSB7XG4gIGFwcC5xdWl0KCk7XG4gIHByb2Nlc3MuZXhpdCgwKTtcbn1cbmFwcC5vbignc2Vjb25kLWluc3RhbmNlJywgcmVzdG9yZU9yQ3JlYXRlV2luZG93KTtcblxuXG4vKipcbiAqIERpc2FibGUgSGFyZHdhcmUgQWNjZWxlcmF0aW9uIGZvciBtb3JlIHBvd2VyLXNhdmVcbiAqL1xuYXBwLmRpc2FibGVIYXJkd2FyZUFjY2VsZXJhdGlvbigpO1xuXG4vKipcbiAqIFNob3V0IGRvd24gYmFja2dyb3VuZCBwcm9jZXNzIGlmIGFsbCB3aW5kb3dzIHdhcyBjbG9zZWRcbiAqL1xuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbi8qKlxuICogQHNlZSBodHRwczovL3d3dy5lbGVjdHJvbmpzLm9yZy9kb2NzL3YxNC14LXkvYXBpL2FwcCNldmVudC1hY3RpdmF0ZS1tYWNvcyBFdmVudDogJ2FjdGl2YXRlJ1xuICovXG5hcHAub24oJ2FjdGl2YXRlJywgcmVzdG9yZU9yQ3JlYXRlV2luZG93KTtcblxuXG4vKipcbiAqIENyZWF0ZSBhcHAgd2luZG93IHdoZW4gYmFja2dyb3VuZCBwcm9jZXNzIHdpbGwgYmUgcmVhZHlcbiAqL1xuYXBwLndoZW5SZWFkeSgpXG4gIC50aGVuKERhdGFIdWJTZXJ2aWNlLmluaXQpXG4gIC50aGVuKExvY2FsRmlsZVN5c3RlbVNlcnZpY2UuaW5pdClcbiAgLnRoZW4oQXJjQ29tbWFuZGVyU2VydmljZS5pbml0KVxuICAudGhlbihJbnRlcm5ldFNlcnZpY2UuaW5pdClcbiAgLnRoZW4ocmVzdG9yZU9yQ3JlYXRlV2luZG93KVxuICAuY2F0Y2goKGUpID0+IGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCBjcmVhdGUgd2luZG93OicsIGUpKTtcblxuXG4vKipcbiAqIEluc3RhbGwgVnVlLmpzIG9yIHNvbWUgb3RoZXIgZGV2dG9vbHMgaW4gZGV2ZWxvcG1lbnQgbW9kZSBvbmx5XG4gKi9cbmlmIChpbXBvcnQubWV0YS5lbnYuREVWKSB7XG4gIGFwcC53aGVuUmVhZHkoKVxuICAgIC50aGVuKCgpID0+IGltcG9ydCgnZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyJykpXG4gICAgLnRoZW4oKHtkZWZhdWx0OiBpbnN0YWxsRXh0ZW5zaW9uLCBWVUVKUzNfREVWVE9PTFN9KSA9PiBpbnN0YWxsRXh0ZW5zaW9uKFZVRUpTM19ERVZUT09MUywge1xuICAgICAgbG9hZEV4dGVuc2lvbk9wdGlvbnM6IHtcbiAgICAgICAgYWxsb3dGaWxlQWNjZXNzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSlcbiAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKCdGYWlsZWQgaW5zdGFsbCBleHRlbnNpb246JywgZSkpO1xufVxuIl0sIm5hbWVzIjpbIlVSTCIsImFwcCIsInVybCIsInNoZWxsIiwiQnJvd3NlcldpbmRvdyIsImpvaW4iLCJNZW51IiwicGF0aCIsInJlcXVpcmUkJDAiLCJTVEFSIiwiUE9TSVhfUkVHRVhfU09VUkNFIiwiY29uc3RhbnRzIiwiY2hhcnMiLCJyZXF1aXJlJCQxIiwiYXBwZW5kIiwidXRpbHMiLCJDSEFSX0NPTU1BIiwiQ0hBUl9ET1QiLCJDSEFSX0xFRlRfQ1VSTFlfQlJBQ0UiLCJDSEFSX0xFRlRfUEFSRU5USEVTRVMiLCJDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQiLCJDSEFSX1JJR0hUX0NVUkxZX0JSQUNFIiwiQ0hBUl9SSUdIVF9QQVJFTlRIRVNFUyIsIkNIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQiLCJzY2FuIiwiaXNHbG9iIiwiaXNFeHRnbG9iIiwiYnJhY2VzIiwiTUFYX0xFTkdUSCIsInBhcnNlIiwiRE9UX0xJVEVSQUwiLCJQTFVTX0xJVEVSQUwiLCJTTEFTSF9MSVRFUkFMIiwiT05FX0NIQVIiLCJET1RTX1NMQVNIIiwiTk9fRE9UIiwiTk9fRE9UX1NMQVNIIiwiTk9fRE9UU19TTEFTSCIsIlFNQVJLIiwiUU1BUktfTk9fRE9UIiwiU1RBUlRfQU5DSE9SIiwib3B0cyIsInZhbHVlIiwicmVzdCIsImVzY2FwZWQiLCJvcGVuIiwiTk9fRE9UUyIsInNvdXJjZSIsInBhcnNlXzEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJpc09iamVjdCIsInBpY29tYXRjaCIsInN0YXRlIiwiZnMiLCJzeXNQYXRoIiwicHJvbWlzaWZ5IiwicmVhZGRpciIsInN0YXQiLCJsc3RhdCIsInJlYWxwYXRoIiwiQkFORyIsImRlcHRoIiwicmVhZGRpcnAiLCJub3JtYWxpemVQYXRoIiwiYW55bWF0Y2hfMSIsImFycmlmeSIsImFueW1hdGNoIiwidGVzdFN0cmluZyIsInJldHVybkluZGV4IiwiYW55bWF0Y2hNb2R1bGUiLCJjbG9zZSIsImdsb2JQYXJlbnQiLCJub2RlIiwic3RyaW5naWZ5IiwiaXNOdW1iZXIiLCJ0b1JlZ2V4UmFuZ2UiLCJ6ZXJvcyIsIm1heCIsImZpbGwiLCJjb21waWxlIiwiZXhwYW5kIiwiaW5kZXgiLCJiaW5hcnlFeHRlbnNpb25zIiwiaXNCaW5hcnlQYXRoIiwiaXNXaW5kb3dzIiwiRU1QVFlfRk4iLCJFTVBUWV9TVFIiLCJFVl9DSEFOR0UiLCJFVl9BREQiLCJFVl9BRERfRElSIiwiRVZfRVJST1IiLCJTVFJfREFUQSIsIlNUUl9FTkQiLCJCUkFDRV9TVEFSVCIsInN0YXRNZXRob2RzIiwicmF3RW1pdHRlciIsImxpc3RlbmVyIiwiTm9kZUZzSGFuZGxlciIsIm5ld1N0YXRzIiwic3RhdHMiLCJFVl9VTkxJTksiLCJGVU5DVElPTl9UWVBFIiwiRnNFdmVudHNIYW5kbGVyIiwidHJhbnNmb3JtIiwiZnNldmVudHNIYW5kbGVyTW9kdWxlIiwiZnNldmVudHNIYW5kbGVyIiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwicmVxdWlyZSQkOCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsInJlcXVpcmUkJDExIiwicmVxdWlyZSQkMTIiLCJub3ciLCJGUyIsIlBBVEgiLCJkaWFsb2ciLCJ1dGlsIiwiaXBjTWFpbiIsInJlcSIsImh0dHBzIiwic3Bhd24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsTUFBTSxrQ0FBa0Msb0JBQUk7QUFBQSxFQUV0QyxDQUFDLENBQUMsSUFBSUEsSUFBQUEsSUFBSSx3QkFBbUMsRUFBRSw0QkFBWSxJQUFHLENBQUEsQ0FBQztBQUVyRTtBQVlBLE1BQU0sK0NBQStCLElBQXlCO0FBQUEsRUFDNUQ7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLENBQUM7QUFHREMsU0FBQSxJQUFJLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxhQUFhO0FBVTlDLFdBQVMsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPQyxVQUFRO0FBQzFCLFFBQUlGLElBQUFBLElBQUlFLEtBQUc7QUFBQSxFQUFBLENBVzdCO0FBU0QsV0FBUyxRQUFRLDRC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
