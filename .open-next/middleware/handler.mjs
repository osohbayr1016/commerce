
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.9.14";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__f1390a54._.js
var require_root_of_the_server_f1390a54 = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__f1390a54._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f1390a54._.js", 951615, (e, t, r) => {
      t.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 559858, (e, t, r) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(210977));
      n.catch(() => {
      }), self._ENTRIES.middleware_instrumentation = new Proxy(n, { get(e2, t2) {
        if ("then" === t2) return (t3, r3) => e2.then(t3, r3);
        let r2 = (...r3) => e2.then((e3) => (0, e3[t2])(...r3));
        return r2.then = (r3, n2) => e2.then((e3) => e3[t2]).then(r3, n2), r2;
      } });
    }, 210977, (e) => {
      "use strict";
      var t = e.i(505893), r = e.i(830232), n = e.i(598261), o = e.i(499200);
      async function s() {
        await Promise.resolve().then(() => e.i(925973));
      }
      e.s(["onRequestError", 0, function(e2, s2, i) {
        (0, t.withScope)((t2) => {
          t2.setSDKProcessingMetadata({ normalizedRequest: { headers: (0, r.headersToDict)(s2.headers), method: s2.method } }), t2.setContext("nextjs", { request_path: s2.path, router_kind: i.routerKind, router_path: i.routePath, route_type: i.routeType }), t2.setTransactionName(i.routePath), (0, n.captureException)(e2, { mechanism: { handled: false, type: "auto.function.nextjs.on_request_error" } }), (0, o.waitUntil)((0, o.flushSafelyWithTimeout)());
        });
      }, "register", () => s], 210977);
    }]);
  }
});

// .next/server/edge/chunks/_0727c437._.js
var require_c437 = __commonJS({
  ".next/server/edge/chunks/_0727c437._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/_0727c437._.js", 36766, (e, t, n) => {
      "use strict";
      n._ = function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
    }, 118574, (e, t, n) => {
      "use strict";
      t.exports = ["chrome 111", "edge 111", "firefox 111", "safari 16.4"];
    }, 757703, (e, t, n) => {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: true });
      var r = { UNDERSCORE_GLOBAL_ERROR_ROUTE: function() {
        return o;
      }, UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY: function() {
        return u;
      }, UNDERSCORE_NOT_FOUND_ROUTE: function() {
        return s;
      }, UNDERSCORE_NOT_FOUND_ROUTE_ENTRY: function() {
        return a;
      } };
      for (var i in r) Object.defineProperty(n, i, { enumerable: true, get: r[i] });
      let s = "/_not-found", a = `${s}/page`, o = "/_global-error", u = `${o}/page`;
    }, 995552, (e, t, n) => {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: true });
      var r, i = { APP_CLIENT_INTERNALS: function() {
        return et;
      }, APP_PATHS_MANIFEST: function() {
        return v;
      }, APP_PATH_ROUTES_MANIFEST: function() {
        return T;
      }, AdapterOutputType: function() {
        return l;
      }, BARREL_OPTIMIZATION_PREFIX: function() {
        return z;
      }, BLOCKED_PAGES: function() {
        return G;
      }, BUILD_ID_FILE: function() {
        return F;
      }, BUILD_MANIFEST: function() {
        return y;
      }, CLIENT_PUBLIC_FILES_PATH: function() {
        return j;
      }, CLIENT_REFERENCE_MANIFEST: function() {
        return W;
      }, CLIENT_STATIC_FILES_PATH: function() {
        return V;
      }, CLIENT_STATIC_FILES_RUNTIME_MAIN: function() {
        return Q;
      }, CLIENT_STATIC_FILES_RUNTIME_MAIN_APP: function() {
        return ee;
      }, CLIENT_STATIC_FILES_RUNTIME_POLYFILLS: function() {
        return ei;
      }, CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL: function() {
        return es;
      }, CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH: function() {
        return en;
      }, CLIENT_STATIC_FILES_RUNTIME_WEBPACK: function() {
        return er;
      }, COMPILER_INDEXES: function() {
        return c;
      }, COMPILER_NAMES: function() {
        return u;
      }, CONFIG_FILES: function() {
        return $;
      }, DEFAULT_RUNTIME_WEBPACK: function() {
        return ea;
      }, DEFAULT_SANS_SERIF_FONT: function() {
        return ep;
      }, DEFAULT_SERIF_FONT: function() {
        return el;
      }, DEV_CLIENT_MIDDLEWARE_MANIFEST: function() {
        return x;
      }, DEV_CLIENT_PAGES_MANIFEST: function() {
        return w;
      }, DYNAMIC_CSS_MANIFEST: function() {
        return Z;
      }, EDGE_RUNTIME_WEBPACK: function() {
        return eo;
      }, EDGE_UNSUPPORTED_NODE_APIS: function() {
        return eg;
      }, EXPORT_DETAIL: function() {
        return O;
      }, EXPORT_MARKER: function() {
        return b;
      }, FUNCTIONS_CONFIG_MANIFEST: function() {
        return R;
      }, IMAGES_MANIFEST: function() {
        return L;
      }, INTERCEPTION_ROUTE_REWRITE_MANIFEST: function() {
        return X;
      }, MIDDLEWARE_BUILD_MANIFEST: function() {
        return q;
      }, MIDDLEWARE_MANIFEST: function() {
        return D;
      }, MIDDLEWARE_REACT_LOADABLE_MANIFEST: function() {
        return J;
      }, MODERN_BROWSERSLIST_TARGET: function() {
        return a.default;
      }, NEXT_BUILTIN_DOCUMENT: function() {
        return H;
      }, NEXT_FONT_MANIFEST: function() {
        return I;
      }, PAGES_MANIFEST: function() {
        return E;
      }, PHASE_ANALYZE: function() {
        return d;
      }, PHASE_DEVELOPMENT_SERVER: function() {
        return h;
      }, PHASE_EXPORT: function() {
        return p;
      }, PHASE_INFO: function() {
        return m;
      }, PHASE_PRODUCTION_BUILD: function() {
        return f;
      }, PHASE_PRODUCTION_SERVER: function() {
        return _;
      }, PHASE_TEST: function() {
        return g;
      }, PRERENDER_MANIFEST: function() {
        return C;
      }, REACT_LOADABLE_MANIFEST: function() {
        return B;
      }, ROUTES_MANIFEST: function() {
        return N;
      }, RSC_MODULE_TYPES: function() {
        return eh;
      }, SERVER_DIRECTORY: function() {
        return k;
      }, SERVER_FILES_MANIFEST: function() {
        return P;
      }, SERVER_PROPS_ID: function() {
        return ec;
      }, SERVER_REFERENCE_MANIFEST: function() {
        return K;
      }, STATIC_PROPS_ID: function() {
        return eu;
      }, STATIC_STATUS_PAGES: function() {
        return ed;
      }, STRING_LITERAL_DROP_BUNDLE: function() {
        return Y;
      }, SUBRESOURCE_INTEGRITY_MANIFEST: function() {
        return A;
      }, SYSTEM_ENTRYPOINTS: function() {
        return em;
      }, TRACE_OUTPUT_VERSION: function() {
        return ef;
      }, TURBOPACK_CLIENT_BUILD_MANIFEST: function() {
        return U;
      }, TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST: function() {
        return M;
      }, TURBO_TRACE_DEFAULT_MEMORY_LIMIT: function() {
        return e_;
      }, UNDERSCORE_GLOBAL_ERROR_ROUTE: function() {
        return o.UNDERSCORE_GLOBAL_ERROR_ROUTE;
      }, UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY: function() {
        return o.UNDERSCORE_GLOBAL_ERROR_ROUTE_ENTRY;
      }, UNDERSCORE_NOT_FOUND_ROUTE: function() {
        return o.UNDERSCORE_NOT_FOUND_ROUTE;
      }, UNDERSCORE_NOT_FOUND_ROUTE_ENTRY: function() {
        return o.UNDERSCORE_NOT_FOUND_ROUTE_ENTRY;
      }, WEBPACK_STATS: function() {
        return S;
      } };
      for (var s in i) Object.defineProperty(n, s, { enumerable: true, get: i[s] });
      let a = e.r(36766)._(e.r(118574)), o = e.r(757703), u = { client: "client", server: "server", edgeServer: "edge-server" }, c = { [u.client]: 0, [u.server]: 1, [u.edgeServer]: 2 };
      var l = ((r = {}).PAGES = "PAGES", r.PAGES_API = "PAGES_API", r.APP_PAGE = "APP_PAGE", r.APP_ROUTE = "APP_ROUTE", r.PRERENDER = "PRERENDER", r.STATIC_FILE = "STATIC_FILE", r.MIDDLEWARE = "MIDDLEWARE", r);
      let p = "phase-export", d = "phase-analyze", f = "phase-production-build", _ = "phase-production-server", h = "phase-development-server", g = "phase-test", m = "phase-info", E = "pages-manifest.json", S = "webpack-stats.json", v = "app-paths-manifest.json", T = "app-path-routes-manifest.json", y = "build-manifest.json", R = "functions-config-manifest.json", A = "subresource-integrity-manifest", I = "next-font-manifest", b = "export-marker.json", O = "export-detail.json", C = "prerender-manifest.json", N = "routes-manifest.json", L = "images-manifest.json", P = "required-server-files", w = "_devPagesManifest.json", D = "middleware-manifest.json", M = "_clientMiddlewareManifest.json", U = "client-build-manifest.json", x = "_devMiddlewareManifest.json", B = "react-loadable-manifest.json", k = "server", $ = ["next.config.js", "next.config.mjs", "next.config.ts", ...process?.features?.typescript ? ["next.config.mts"] : []], F = "BUILD_ID", G = ["/_document", "/_app", "/_error"], j = "public", V = "static", Y = "__NEXT_DROP_CLIENT_FILE__", H = "__NEXT_BUILTIN_DOCUMENT__", z = "__barrel_optimize__", W = "client-reference-manifest", K = "server-reference-manifest", q = "middleware-build-manifest", J = "middleware-react-loadable-manifest", X = "interception-route-rewrite-manifest", Z = "dynamic-css-manifest", Q = "main", ee = `${Q}-app`, et = "app-pages-internals", en = "react-refresh", er = "webpack", ei = "polyfills", es = Symbol(ei), ea = "webpack-runtime", eo = "edge-runtime-webpack", eu = "__N_SSG", ec = "__N_SSP", el = { name: "Times New Roman", xAvgCharWidth: 821, azAvgWidth: 854.3953488372093, unitsPerEm: 2048 }, ep = { name: "Arial", xAvgCharWidth: 904, azAvgWidth: 934.5116279069767, unitsPerEm: 2048 }, ed = ["/500"], ef = 1, e_ = 6e3, eh = { client: "client", server: "server" }, eg = ["clearImmediate", "setImmediate", "BroadcastChannel", "ByteLengthQueuingStrategy", "CompressionStream", "CountQueuingStrategy", "DecompressionStream", "DomException", "MessageChannel", "MessageEvent", "MessagePort", "ReadableByteStreamController", "ReadableStreamBYOBRequest", "ReadableStreamDefaultController", "TransformStreamDefaultController", "WritableStreamDefaultController"], em = /* @__PURE__ */ new Set([Q, en, ee]);
      ("function" == typeof n.default || "object" == typeof n.default && null !== n.default) && void 0 === n.default.__esModule && (Object.defineProperty(n.default, "__esModule", { value: true }), Object.assign(n.default, n), t.exports = n.default);
    }, 193597, (e, t, n) => {
      t.exports = e.r(995552);
    }, 925973, (e) => {
      "use strict";
      let t, n, r, i, s;
      function a(e10) {
        return Symbol.for(e10);
      }
      var o, u, c, l, p, d, f, _, h, g, m, E, S, v, T, y, R, A, I, b = new function e10(t10) {
        var n10 = this;
        n10._currentContext = t10 ? new Map(t10) : /* @__PURE__ */ new Map(), n10.getValue = function(e11) {
          return n10._currentContext.get(e11);
        }, n10.setValue = function(t11, r10) {
          var i3 = new e10(n10._currentContext);
          return i3._currentContext.set(t11, r10), i3;
        }, n10.deleteValue = function(t11) {
          var r10 = new e10(n10._currentContext);
          return r10._currentContext.delete(t11), r10;
        };
      }(), O = function(e10, t10) {
        var n10 = "function" == typeof Symbol && e10[Symbol.iterator];
        if (!n10) return e10;
        var r10, i3, s2 = n10.call(e10), a2 = [];
        try {
          for (; (void 0 === t10 || t10-- > 0) && !(r10 = s2.next()).done; ) a2.push(r10.value);
        } catch (e11) {
          i3 = { error: e11 };
        } finally {
          try {
            r10 && !r10.done && (n10 = s2.return) && n10.call(s2);
          } finally {
            if (i3) throw i3.error;
          }
        }
        return a2;
      }, C = function(e10, t10, n10) {
        if (n10 || 2 == arguments.length) for (var r10, i3 = 0, s2 = t10.length; i3 < s2; i3++) !r10 && i3 in t10 || (r10 || (r10 = Array.prototype.slice.call(t10, 0, i3)), r10[i3] = t10[i3]);
        return e10.concat(r10 || Array.prototype.slice.call(t10));
      }, N = function() {
        function e10() {
        }
        return e10.prototype.active = function() {
          return b;
        }, e10.prototype.with = function(e11, t10, n10) {
          for (var r10 = [], i3 = 3; i3 < arguments.length; i3++) r10[i3 - 3] = arguments[i3];
          return t10.call.apply(t10, C([n10], O(r10), false));
        }, e10.prototype.bind = function(e11, t10) {
          return t10;
        }, e10.prototype.enable = function() {
          return this;
        }, e10.prototype.disable = function() {
          return this;
        }, e10;
      }(), L = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : e.g, P = "1.9.0", w = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, D = function(e10) {
        var t10 = /* @__PURE__ */ new Set([e10]), n10 = /* @__PURE__ */ new Set(), r10 = e10.match(w);
        if (!r10) return function() {
          return false;
        };
        var i3 = { major: +r10[1], minor: +r10[2], patch: +r10[3], prerelease: r10[4] };
        if (null != i3.prerelease) return function(t11) {
          return t11 === e10;
        };
        function s2(e11) {
          return n10.add(e11), false;
        }
        return function(e11) {
          if (t10.has(e11)) return true;
          if (n10.has(e11)) return false;
          var r11 = e11.match(w);
          if (!r11) return s2(e11);
          var a2 = { major: +r11[1], minor: +r11[2], patch: +r11[3], prerelease: r11[4] };
          if (null != a2.prerelease || i3.major !== a2.major) return s2(e11);
          if (0 === i3.major) return i3.minor === a2.minor && i3.patch <= a2.patch ? (t10.add(e11), true) : s2(e11);
          return i3.minor <= a2.minor ? (t10.add(e11), true) : s2(e11);
        };
      }(P), M = Symbol.for("opentelemetry.js.api." + P.split(".")[0]);
      function U(e10, t10, n10, r10) {
        void 0 === r10 && (r10 = false);
        var i3, s2 = L[M] = null != (i3 = L[M]) ? i3 : { version: P };
        if (!r10 && s2[e10]) {
          var a2 = Error("@opentelemetry/api: Attempted duplicate registration of API: " + e10);
          return n10.error(a2.stack || a2.message), false;
        }
        if (s2.version !== P) {
          var a2 = Error("@opentelemetry/api: Registration of version v" + s2.version + " for " + e10 + " does not match previously registered API v" + P);
          return n10.error(a2.stack || a2.message), false;
        }
        return s2[e10] = t10, n10.debug("@opentelemetry/api: Registered a global for " + e10 + " v" + P + "."), true;
      }
      function x(e10) {
        var t10, n10, r10 = null == (t10 = L[M]) ? void 0 : t10.version;
        if (r10 && D(r10)) return null == (n10 = L[M]) ? void 0 : n10[e10];
      }
      function B(e10, t10) {
        t10.debug("@opentelemetry/api: Unregistering a global for " + e10 + " v" + P + ".");
        var n10 = L[M];
        n10 && delete n10[e10];
      }
      var k = function(e10, t10) {
        var n10 = "function" == typeof Symbol && e10[Symbol.iterator];
        if (!n10) return e10;
        var r10, i3, s2 = n10.call(e10), a2 = [];
        try {
          for (; (void 0 === t10 || t10-- > 0) && !(r10 = s2.next()).done; ) a2.push(r10.value);
        } catch (e11) {
          i3 = { error: e11 };
        } finally {
          try {
            r10 && !r10.done && (n10 = s2.return) && n10.call(s2);
          } finally {
            if (i3) throw i3.error;
          }
        }
        return a2;
      }, $ = function(e10, t10, n10) {
        if (n10 || 2 == arguments.length) for (var r10, i3 = 0, s2 = t10.length; i3 < s2; i3++) !r10 && i3 in t10 || (r10 || (r10 = Array.prototype.slice.call(t10, 0, i3)), r10[i3] = t10[i3]);
        return e10.concat(r10 || Array.prototype.slice.call(t10));
      }, F = function() {
        function e10(e11) {
          this._namespace = e11.namespace || "DiagComponentLogger";
        }
        return e10.prototype.debug = function() {
          for (var e11 = [], t10 = 0; t10 < arguments.length; t10++) e11[t10] = arguments[t10];
          return G("debug", this._namespace, e11);
        }, e10.prototype.error = function() {
          for (var e11 = [], t10 = 0; t10 < arguments.length; t10++) e11[t10] = arguments[t10];
          return G("error", this._namespace, e11);
        }, e10.prototype.info = function() {
          for (var e11 = [], t10 = 0; t10 < arguments.length; t10++) e11[t10] = arguments[t10];
          return G("info", this._namespace, e11);
        }, e10.prototype.warn = function() {
          for (var e11 = [], t10 = 0; t10 < arguments.length; t10++) e11[t10] = arguments[t10];
          return G("warn", this._namespace, e11);
        }, e10.prototype.verbose = function() {
          for (var e11 = [], t10 = 0; t10 < arguments.length; t10++) e11[t10] = arguments[t10];
          return G("verbose", this._namespace, e11);
        }, e10;
      }();
      function G(e10, t10, n10) {
        var r10 = x("diag");
        if (r10) return n10.unshift(t10), r10[e10].apply(r10, $([], k(n10), false));
      }
      (g = o || (o = {}))[g.NONE = 0] = "NONE", g[g.ERROR = 30] = "ERROR", g[g.WARN = 50] = "WARN", g[g.INFO = 60] = "INFO", g[g.DEBUG = 70] = "DEBUG", g[g.VERBOSE = 80] = "VERBOSE", g[g.ALL = 9999] = "ALL";
      var j = function(e10, t10) {
        var n10 = "function" == typeof Symbol && e10[Symbol.iterator];
        if (!n10) return e10;
        var r10, i3, s2 = n10.call(e10), a2 = [];
        try {
          for (; (void 0 === t10 || t10-- > 0) && !(r10 = s2.next()).done; ) a2.push(r10.value);
        } catch (e11) {
          i3 = { error: e11 };
        } finally {
          try {
            r10 && !r10.done && (n10 = s2.return) && n10.call(s2);
          } finally {
            if (i3) throw i3.error;
          }
        }
        return a2;
      }, V = function(e10, t10, n10) {
        if (n10 || 2 == arguments.length) for (var r10, i3 = 0, s2 = t10.length; i3 < s2; i3++) !r10 && i3 in t10 || (r10 || (r10 = Array.prototype.slice.call(t10, 0, i3)), r10[i3] = t10[i3]);
        return e10.concat(r10 || Array.prototype.slice.call(t10));
      }, Y = function() {
        function e10() {
          function e11(e12) {
            return function() {
              for (var t11 = [], n10 = 0; n10 < arguments.length; n10++) t11[n10] = arguments[n10];
              var r10 = x("diag");
              if (r10) return r10[e12].apply(r10, V([], j(t11), false));
            };
          }
          var t10 = this;
          t10.setLogger = function(e12, n10) {
            if (void 0 === n10 && (n10 = { logLevel: o.INFO }), e12 === t10) {
              var r10, i3, s2, a2 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
              return t10.error(null != (r10 = a2.stack) ? r10 : a2.message), false;
            }
            "number" == typeof n10 && (n10 = { logLevel: n10 });
            var u2 = x("diag"), c2 = function(e13, t11) {
              function n11(n12, r11) {
                var i4 = t11[n12];
                return "function" == typeof i4 && e13 >= r11 ? i4.bind(t11) : function() {
                };
              }
              return e13 < o.NONE ? e13 = o.NONE : e13 > o.ALL && (e13 = o.ALL), t11 = t11 || {}, { error: n11("error", o.ERROR), warn: n11("warn", o.WARN), info: n11("info", o.INFO), debug: n11("debug", o.DEBUG), verbose: n11("verbose", o.VERBOSE) };
            }(null != (i3 = n10.logLevel) ? i3 : o.INFO, e12);
            if (u2 && !n10.suppressOverrideMessage) {
              var l2 = null != (s2 = Error().stack) ? s2 : "<failed to generate stacktrace>";
              u2.warn("Current logger will be overwritten from " + l2), c2.warn("Current logger will overwrite one already registered from " + l2);
            }
            return U("diag", c2, t10, true);
          }, t10.disable = function() {
            B("diag", t10);
          }, t10.createComponentLogger = function(e12) {
            return new F(e12);
          }, t10.verbose = e11("verbose"), t10.debug = e11("debug"), t10.info = e11("info"), t10.warn = e11("warn"), t10.error = e11("error");
        }
        return e10.instance = function() {
          return this._instance || (this._instance = new e10()), this._instance;
        }, e10;
      }(), H = function(e10, t10) {
        var n10 = "function" == typeof Symbol && e10[Symbol.iterator];
        if (!n10) return e10;
        var r10, i3, s2 = n10.call(e10), a2 = [];
        try {
          for (; (void 0 === t10 || t10-- > 0) && !(r10 = s2.next()).done; ) a2.push(r10.value);
        } catch (e11) {
          i3 = { error: e11 };
        } finally {
          try {
            r10 && !r10.done && (n10 = s2.return) && n10.call(s2);
          } finally {
            if (i3) throw i3.error;
          }
        }
        return a2;
      }, z = function(e10, t10, n10) {
        if (n10 || 2 == arguments.length) for (var r10, i3 = 0, s2 = t10.length; i3 < s2; i3++) !r10 && i3 in t10 || (r10 || (r10 = Array.prototype.slice.call(t10, 0, i3)), r10[i3] = t10[i3]);
        return e10.concat(r10 || Array.prototype.slice.call(t10));
      }, W = "context", K = new N(), q = function() {
        function e10() {
        }
        return e10.getInstance = function() {
          return this._instance || (this._instance = new e10()), this._instance;
        }, e10.prototype.setGlobalContextManager = function(e11) {
          return U(W, e11, Y.instance());
        }, e10.prototype.active = function() {
          return this._getContextManager().active();
        }, e10.prototype.with = function(e11, t10, n10) {
          for (var r10, i3 = [], s2 = 3; s2 < arguments.length; s2++) i3[s2 - 3] = arguments[s2];
          return (r10 = this._getContextManager()).with.apply(r10, z([e11, t10, n10], H(i3), false));
        }, e10.prototype.bind = function(e11, t10) {
          return this._getContextManager().bind(e11, t10);
        }, e10.prototype._getContextManager = function() {
          return x(W) || K;
        }, e10.prototype.disable = function() {
          this._getContextManager().disable(), B(W, Y.instance());
        }, e10;
      }(), J = q.getInstance(), X = e.i(257493), Z = e.i(499219), Q = e.i(20174), ee = e.i(224058);
      let et = {}, en = {};
      function er(e10, t10) {
        et[e10] = et[e10] || [], et[e10].push(t10);
      }
      function ei(e10, t10) {
        if (!en[e10]) {
          en[e10] = true;
          try {
            t10();
          } catch (t11) {
            X.DEBUG_BUILD && Q.debug.error(`Error while instrumenting ${e10}`, t11);
          }
        }
      }
      function es(e10, t10) {
        let n10 = e10 && et[e10];
        if (n10) for (let r10 of n10) try {
          r10(t10);
        } catch (t11) {
          X.DEBUG_BUILD && Q.debug.error(`Error while triggering instrumentation handler.
Type: ${e10}
Name: ${(0, ee.getFunctionName)(r10)}
Error:`, t11);
        }
      }
      let ea = null;
      function eo() {
        ea = Z.GLOBAL_OBJ.onerror, Z.GLOBAL_OBJ.onerror = function(e10, t10, n10, r10, i3) {
          return es("error", { column: r10, error: i3, line: n10, msg: e10, url: t10 }), !!ea && ea.apply(this, arguments);
        }, Z.GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = true;
      }
      let eu = null;
      function ec() {
        eu = Z.GLOBAL_OBJ.onunhandledrejection, Z.GLOBAL_OBJ.onunhandledrejection = function(e10) {
          return es("unhandledrejection", e10), !eu || eu.apply(this, arguments);
        }, Z.GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
      }
      var el = e.i(153393), ep = e.i(654534);
      let ed = false;
      function ef() {
        if (!ed) {
          let t10, n10;
          e10.tag = "sentry_tracingErrorCallback", ed = true, er(t10 = "error", e10), ei(t10, eo), er(n10 = "unhandledrejection", e10), ei(n10, ec);
        }
        function e10() {
          let e11 = (0, el.getActiveSpan)(), t10 = e11 && (0, el.getRootSpan)(e11);
          if (t10) {
            let e12 = "internal_error";
            X.DEBUG_BUILD && Q.debug.log(`[Tracing] Root span: ${e12} -> Global error occurred`), t10.setStatus({ code: ep.SPAN_STATUS_ERROR, message: e12 });
          }
        }
      }
      var e_ = e.i(935872);
      function eh(e10, t10, n10 = [t10], r10 = "npm") {
        let i3 = e10._metadata || {};
        i3.sdk || (i3.sdk = { name: `sentry.javascript.${t10}`, packages: n10.map((e11) => ({ name: `${r10}:@sentry/${e11}`, version: e_.SDK_VERSION })), version: e_.SDK_VERSION }), e10._metadata = i3;
      }
      var eg = e.i(412115), em = e.i(304229), eE = e.i(505893);
      function eS(e10) {
        return "isRelative" in e10;
      }
      function ev(e10, t10) {
        let n10 = 0 >= e10.indexOf("://") && 0 !== e10.indexOf("//"), r10 = t10 ?? (n10 ? "thismessage:/" : void 0);
        try {
          if ("canParse" in URL && !URL.canParse(e10, r10)) return;
          let t11 = new URL(e10, r10);
          if (n10) return { isRelative: n10, pathname: t11.pathname, search: t11.search, hash: t11.hash };
          return t11;
        } catch {
        }
      }
      function eT(e10) {
        if (eS(e10)) return e10.pathname;
        let t10 = new URL(e10);
        return t10.search = "", t10.hash = "", ["80", "443"].includes(t10.port) && (t10.port = ""), t10.password && (t10.password = "%filtered%"), t10.username && (t10.username = "%filtered%"), t10.toString();
      }
      function ey(e10) {
        if (!e10) return {};
        let t10 = e10.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
        if (!t10) return {};
        let n10 = t10[6] || "", r10 = t10[8] || "";
        return { host: t10[4], path: t10[5], protocol: t10[2], search: n10, hash: r10, relative: t10[5] + n10 + r10 };
      }
      function eR(e10) {
        return e10.split(/[?#]/, 1)[0];
      }
      function eA(e10) {
        let { protocol: t10, host: n10, path: r10 } = e10, i3 = n10?.replace(/^.*@/, "[filtered]:[filtered]@").replace(/(:80)$/, "").replace(/(:443)$/, "") || "";
        return `${t10 ? `${t10}://` : ""}${i3}${r10}`;
      }
      function eI(e10, t10 = true) {
        if (e10.startsWith("data:")) {
          let n10 = e10.match(/^data:([^;,]+)/), r10 = n10 ? n10[1] : "text/plain", i3 = e10.includes(";base64,"), s2 = e10.indexOf(","), a2 = "";
          if (t10 && -1 !== s2) {
            let t11 = e10.slice(s2 + 1);
            a2 = t11.length > 10 ? `${t11.slice(0, 10)}... [truncated]` : t11;
          }
          return `data:${r10}${i3 ? ",base64" : ""}${a2 ? `,${a2}` : ""}`;
        }
        return e10;
      }
      let eb = "telemetry.sdk.language", eO = "telemetry.sdk.name", eC = "telemetry.sdk.version";
      var eN = e.i(187709);
      function eL(e10, t10) {
        var n10, r10, i3, s2;
        let a2, o2 = t10?.getDsn(), u2 = t10?.getOptions().tunnel;
        return n10 = e10, r10 = o2, !(!(a2 = ev(n10)) || eS(a2)) && !!r10 && a2.host.includes(r10.host) && /(^|&|\?)sentry_key=/.test(a2.search) || (i3 = e10, !!(s2 = u2) && eP(i3) === eP(s2));
      }
      function eP(e10) {
        return "/" === e10[e10.length - 1] ? e10.slice(0, -1) : e10;
      }
      var ew = e.i(765434), eD = e.i(842495);
      class eM {
        constructor(e10) {
          this._maxSize = e10, this._cache = /* @__PURE__ */ new Map();
        }
        get size() {
          return this._cache.size;
        }
        get(e10) {
          let t10 = this._cache.get(e10);
          if (void 0 !== t10) return this._cache.delete(e10), this._cache.set(e10, t10), t10;
        }
        set(e10, t10) {
          if (this._cache.size >= this._maxSize) {
            let e11 = this._cache.keys().next().value;
            this._cache.delete(e11);
          }
          this._cache.set(e10, t10);
        }
        remove(e10) {
          let t10 = this._cache.get(e10);
          return t10 && this._cache.delete(e10), t10;
        }
        clear() {
          this._cache.clear();
        }
        keys() {
          return Array.from(this._cache.keys());
        }
        values() {
          let e10 = [];
          return this._cache.forEach((t10) => e10.push(t10)), e10;
        }
      }
      var eU = e.i(12862), ex = e.i(257645), eB = e.i(263382), ek = e.i(225376), e$ = e.i(294482), eF = e.i(50850), eG = e.i(883250), eG = eG, ej = e.i(958648), eV = e.i(598261), eY = e.i(875641), eH = e.i(162308), ez = eG, eW = e.i(776970);
      (m = u || (u = {}))[m.NONE = 0] = "NONE", m[m.SAMPLED = 1] = "SAMPLED";
      var eK = "0000000000000000", eq = "00000000000000000000000000000000", eJ = { traceId: eq, spanId: eK, traceFlags: u.NONE }, eX = function() {
        function e10(e11) {
          void 0 === e11 && (e11 = eJ), this._spanContext = e11;
        }
        return e10.prototype.spanContext = function() {
          return this._spanContext;
        }, e10.prototype.setAttribute = function(e11, t10) {
          return this;
        }, e10.prototype.setAttributes = function(e11) {
          return this;
        }, e10.prototype.addEvent = function(e11, t10) {
          return this;
        }, e10.prototype.addLink = function(e11) {
          return this;
        }, e10.prototype.addLinks = function(e11) {
          return this;
        }, e10.prototype.setStatus = function(e11) {
          return this;
        }, e10.prototype.updateName = function(e11) {
          return this;
        }, e10.prototype.end = function(e11) {
        }, e10.prototype.isRecording = function() {
          return false;
        }, e10.prototype.recordException = function(e11, t10) {
        }, e10;
      }(), eZ = a("OpenTelemetry Context Key SPAN");
      function eQ(e10) {
        return e10.getValue(eZ) || void 0;
      }
      function e0() {
        return eQ(q.getInstance().active());
      }
      function e1(e10, t10) {
        return e10.setValue(eZ, t10);
      }
      function e2(e10) {
        return e10.deleteValue(eZ);
      }
      function e4(e10, t10) {
        return e1(e10, new eX(t10));
      }
      function e5(e10) {
        var t10;
        return null == (t10 = eQ(e10)) ? void 0 : t10.spanContext();
      }
      var e3 = /^([0-9a-f]{32})$/i, e9 = /^[0-9a-f]{16}$/i;
      function e6(e10) {
        return e3.test(e10) && e10 !== eq;
      }
      function e8(e10) {
        var t10;
        return e6(e10.traceId) && (t10 = e10.spanId, e9.test(t10) && t10 !== eK);
      }
      function e7(e10) {
        return new eX(e10);
      }
      var te = q.getInstance(), tt = function() {
        function e10() {
        }
        return e10.prototype.startSpan = function(e11, t10, n10) {
          if (void 0 === n10 && (n10 = te.active()), null == t10 ? void 0 : t10.root) return new eX();
          var r10, i3 = n10 && e5(n10);
          return "object" == typeof (r10 = i3) && "string" == typeof r10.spanId && "string" == typeof r10.traceId && "number" == typeof r10.traceFlags && e8(i3) ? new eX(i3) : new eX();
        }, e10.prototype.startActiveSpan = function(e11, t10, n10, r10) {
          if (!(arguments.length < 2)) {
            2 == arguments.length ? a2 = t10 : 3 == arguments.length ? (i3 = t10, a2 = n10) : (i3 = t10, s2 = n10, a2 = r10);
            var i3, s2, a2, o2 = null != s2 ? s2 : te.active(), u2 = this.startSpan(e11, i3, o2), c2 = e1(o2, u2);
            return te.with(c2, a2, void 0, u2);
          }
        }, e10;
      }(), tn = new tt(), tr = function() {
        function e10(e11, t10, n10, r10) {
          this._provider = e11, this.name = t10, this.version = n10, this.options = r10;
        }
        return e10.prototype.startSpan = function(e11, t10, n10) {
          return this._getTracer().startSpan(e11, t10, n10);
        }, e10.prototype.startActiveSpan = function(e11, t10, n10, r10) {
          var i3 = this._getTracer();
          return Reflect.apply(i3.startActiveSpan, i3, arguments);
        }, e10.prototype._getTracer = function() {
          if (this._delegate) return this._delegate;
          var e11 = this._provider.getDelegateTracer(this.name, this.version, this.options);
          return e11 ? (this._delegate = e11, this._delegate) : tn;
        }, e10;
      }(), ti = new (function() {
        function e10() {
        }
        return e10.prototype.getTracer = function(e11, t10, n10) {
          return new tt();
        }, e10;
      }())(), ts = function() {
        function e10() {
        }
        return e10.prototype.getTracer = function(e11, t10, n10) {
          var r10;
          return null != (r10 = this.getDelegateTracer(e11, t10, n10)) ? r10 : new tr(this, e11, t10, n10);
        }, e10.prototype.getDelegate = function() {
          var e11;
          return null != (e11 = this._delegate) ? e11 : ti;
        }, e10.prototype.setDelegate = function(e11) {
          this._delegate = e11;
        }, e10.prototype.getDelegateTracer = function(e11, t10, n10) {
          var r10;
          return null == (r10 = this._delegate) ? void 0 : r10.getTracer(e11, t10, n10);
        }, e10;
      }(), ta = "trace", to = function() {
        function e10() {
          this._proxyTracerProvider = new ts(), this.wrapSpanContext = e7, this.isSpanContextValid = e8, this.deleteSpan = e2, this.getSpan = eQ, this.getActiveSpan = e0, this.getSpanContext = e5, this.setSpan = e1, this.setSpanContext = e4;
        }
        return e10.getInstance = function() {
          return this._instance || (this._instance = new e10()), this._instance;
        }, e10.prototype.setGlobalTracerProvider = function(e11) {
          var t10 = U(ta, this._proxyTracerProvider, Y.instance());
          return t10 && this._proxyTracerProvider.setDelegate(e11), t10;
        }, e10.prototype.getTracerProvider = function() {
          return x(ta) || this._proxyTracerProvider;
        }, e10.prototype.getTracer = function(e11, t10) {
          return this.getTracerProvider().getTracer(e11, t10);
        }, e10.prototype.disable = function() {
          B(ta, Y.instance()), this._proxyTracerProvider = new ts();
        }, e10;
      }().getInstance();
      (E = c || (c = {}))[E.INTERNAL = 0] = "INTERNAL", E[E.SERVER = 1] = "SERVER", E[E.CLIENT = 2] = "CLIENT", E[E.PRODUCER = 3] = "PRODUCER", E[E.CONSUMER = 4] = "CONSUMER";
      var tu = function() {
        function e10() {
        }
        return e10.prototype.inject = function(e11, t10) {
        }, e10.prototype.extract = function(e11, t10) {
          return e11;
        }, e10.prototype.fields = function() {
          return [];
        }, e10;
      }(), tc = { get: function(e10, t10) {
        if (null != e10) return e10[t10];
      }, keys: function(e10) {
        return null == e10 ? [] : Object.keys(e10);
      } }, tl = { set: function(e10, t10, n10) {
        null != e10 && (e10[t10] = n10);
      } }, tp = a("OpenTelemetry Baggage Key");
      function td(e10) {
        return e10.getValue(tp) || void 0;
      }
      function tf() {
        return td(q.getInstance().active());
      }
      function t_(e10, t10) {
        return e10.setValue(tp, t10);
      }
      function th(e10) {
        return e10.deleteValue(tp);
      }
      var tg = function(e10, t10) {
        var n10 = "function" == typeof Symbol && e10[Symbol.iterator];
        if (!n10) return e10;
        var r10, i3, s2 = n10.call(e10), a2 = [];
        try {
          for (; (void 0 === t10 || t10-- > 0) && !(r10 = s2.next()).done; ) a2.push(r10.value);
        } catch (e11) {
          i3 = { error: e11 };
        } finally {
          try {
            r10 && !r10.done && (n10 = s2.return) && n10.call(s2);
          } finally {
            if (i3) throw i3.error;
          }
        }
        return a2;
      }, tm = function(e10) {
        var t10 = "function" == typeof Symbol && Symbol.iterator, n10 = t10 && e10[t10], r10 = 0;
        if (n10) return n10.call(e10);
        if (e10 && "number" == typeof e10.length) return { next: function() {
          return e10 && r10 >= e10.length && (e10 = void 0), { value: e10 && e10[r10++], done: !e10 };
        } };
        throw TypeError(t10 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }, tE = function() {
        function e10(e11) {
          this._entries = e11 ? new Map(e11) : /* @__PURE__ */ new Map();
        }
        return e10.prototype.getEntry = function(e11) {
          var t10 = this._entries.get(e11);
          if (t10) return Object.assign({}, t10);
        }, e10.prototype.getAllEntries = function() {
          return Array.from(this._entries.entries()).map(function(e11) {
            var t10 = tg(e11, 2);
            return [t10[0], t10[1]];
          });
        }, e10.prototype.setEntry = function(t10, n10) {
          var r10 = new e10(this._entries);
          return r10._entries.set(t10, n10), r10;
        }, e10.prototype.removeEntry = function(t10) {
          var n10 = new e10(this._entries);
          return n10._entries.delete(t10), n10;
        }, e10.prototype.removeEntries = function() {
          for (var t10, n10, r10 = [], i3 = 0; i3 < arguments.length; i3++) r10[i3] = arguments[i3];
          var s2 = new e10(this._entries);
          try {
            for (var a2 = tm(r10), o2 = a2.next(); !o2.done; o2 = a2.next()) {
              var u2 = o2.value;
              s2._entries.delete(u2);
            }
          } catch (e11) {
            t10 = { error: e11 };
          } finally {
            try {
              o2 && !o2.done && (n10 = a2.return) && n10.call(a2);
            } finally {
              if (t10) throw t10.error;
            }
          }
          return s2;
        }, e10.prototype.clear = function() {
          return new e10();
        }, e10;
      }(), tS = Symbol("BaggageEntryMetadata"), tv = Y.instance();
      function tT(e10) {
        return void 0 === e10 && (e10 = {}), new tE(new Map(Object.entries(e10)));
      }
      var ty = "propagation", tR = new tu(), tA = function() {
        function e10() {
          this.createBaggage = tT, this.getBaggage = td, this.getActiveBaggage = tf, this.setBaggage = t_, this.deleteBaggage = th;
        }
        return e10.getInstance = function() {
          return this._instance || (this._instance = new e10()), this._instance;
        }, e10.prototype.setGlobalPropagator = function(e11) {
          return U(ty, e11, Y.instance());
        }, e10.prototype.inject = function(e11, t10, n10) {
          return void 0 === n10 && (n10 = tl), this._getGlobalPropagator().inject(e11, t10, n10);
        }, e10.prototype.extract = function(e11, t10, n10) {
          return void 0 === n10 && (n10 = tc), this._getGlobalPropagator().extract(e11, t10, n10);
        }, e10.prototype.fields = function() {
          return this._getGlobalPropagator().fields();
        }, e10.prototype.disable = function() {
          B(ty, Y.instance());
        }, e10.prototype._getGlobalPropagator = function() {
          return x(ty) || tR;
        }, e10;
      }().getInstance();
      (S = l || (l = {}))[S.UNSET = 0] = "UNSET", S[S.OK = 1] = "OK", S[S.ERROR = 2] = "ERROR";
      let tI = "[_0-9a-z-*/]", tb = `[a-z]${tI}{0,255}`, tO = `[a-z0-9]${tI}{0,240}@[a-z]${tI}{0,13}`, tC = RegExp(`^(?:${tb}|${tO})$`), tN = /^[ -~]{0,255}[!-~]$/, tL = /,|=/;
      class tP {
        _internalState = /* @__PURE__ */ new Map();
        constructor(e10) {
          e10 && this._parse(e10);
        }
        set(e10, t10) {
          let n10 = this._clone();
          return n10._internalState.has(e10) && n10._internalState.delete(e10), n10._internalState.set(e10, t10), n10;
        }
        unset(e10) {
          let t10 = this._clone();
          return t10._internalState.delete(e10), t10;
        }
        get(e10) {
          return this._internalState.get(e10);
        }
        serialize() {
          return this._keys().reduce((e10, t10) => (e10.push(t10 + "=" + this.get(t10)), e10), []).join(",");
        }
        _parse(e10) {
          !(e10.length > 512) && (this._internalState = e10.split(",").reverse().reduce((e11, t10) => {
            let n10 = t10.trim(), r10 = n10.indexOf("=");
            if (-1 !== r10) {
              let i3 = n10.slice(0, r10), s2 = n10.slice(r10 + 1, t10.length);
              tC.test(i3) && tN.test(s2) && !tL.test(s2) && e11.set(i3, s2);
            }
            return e11;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }
        _keys() {
          return Array.from(this._internalState.keys()).reverse();
        }
        _clone() {
          let e10 = new tP();
          return e10._internalState = new Map(this._internalState), e10;
        }
      }
      a("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
      (v = p || (p = {}))[v.NOT_RECORD = 0] = "NOT_RECORD", v[v.RECORD = 1] = "RECORD", v[v.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
      let tw = a("sentry_scopes");
      a("sentry_fork_isolation_scope"), a("sentry_fork_set_scope"), a("sentry_fork_set_isolation_scope");
      "u" < typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__;
      var tD = e.i(951615), tM = e.i(646665), tU = e.i(496874), tx = e.i(360748), tB = e.i(835848);
      let tk = [];
      function t$(e10, t10) {
        for (let n10 of t10) n10?.afterAllSetup && n10.afterAllSetup(e10);
      }
      function tF(e10, t10, n10) {
        if (n10[t10.name]) {
          X.DEBUG_BUILD && Q.debug.log(`Integration skipped because it was already installed: ${t10.name}`);
          return;
        }
        if (n10[t10.name] = t10, tk.includes(t10.name) || "function" != typeof t10.setupOnce || (t10.setupOnce(), tk.push(t10.name)), t10.setup && "function" == typeof t10.setup && t10.setup(e10), "function" == typeof t10.preprocessEvent) {
          let n11 = t10.preprocessEvent.bind(t10);
          e10.on("preprocessEvent", (t11, r10) => n11(t11, r10, e10));
        }
        if ("function" == typeof t10.processEvent) {
          let n11 = t10.processEvent.bind(t10), r10 = Object.assign((t11, r11) => n11(t11, r11, e10), { id: t10.name });
          e10.addEventProcessor(r10);
        }
        X.DEBUG_BUILD && Q.debug.log(`Integration installed: ${t10.name}`);
      }
      var tG = e.i(102393), tj = e.i(966474);
      e.i(294736), e.i(652434);
      var tV = e.i(57890);
      function tY(e10, t10) {
        var n10, r10, i3, s2;
        let a2, o2 = t10 ?? (s2 = e10, tH().get(s2)) ?? [];
        if (0 === o2.length) return;
        let u2 = e10.getOptions(), c2 = (n10 = u2._metadata, r10 = u2.tunnel, i3 = e10.getDsn(), a2 = {}, n10?.sdk && (a2.sdk = { name: n10.sdk.name, version: n10.sdk.version }), r10 && i3 && (a2.dsn = (0, tM.dsnToString)(i3)), (0, tU.createEnvelope)(a2, [[{ type: "log", item_count: o2.length, content_type: "application/vnd.sentry.items.log+json" }, { items: o2 }]]));
        tH().set(e10, []), e10.emit("flushLogs"), e10.sendEnvelope(c2);
      }
      function tH() {
        return (0, tG.getGlobalSingleton)("clientToLogBufferMap", () => /* @__PURE__ */ new WeakMap());
      }
      function tz(e10, t10) {
        var n10, r10, i3, s2;
        let a2, o2 = t10 ?? (s2 = e10, tW().get(s2)) ?? [];
        if (0 === o2.length) return;
        let u2 = e10.getOptions(), c2 = (n10 = u2._metadata, r10 = u2.tunnel, i3 = e10.getDsn(), a2 = {}, n10?.sdk && (a2.sdk = { name: n10.sdk.name, version: n10.sdk.version }), r10 && i3 && (a2.dsn = (0, tM.dsnToString)(i3)), (0, tU.createEnvelope)(a2, [[{ type: "trace_metric", item_count: o2.length, content_type: "application/vnd.sentry.items.trace-metric+json" }, { items: o2 }]]));
        tW().set(e10, []), e10.emit("flushMetrics"), e10.sendEnvelope(c2);
      }
      function tW() {
        return (0, tG.getGlobalSingleton)("clientToMetricBufferMap", () => /* @__PURE__ */ new WeakMap());
      }
      var tK = e.i(298881), tq = e.i(269728);
      let tJ = Symbol.for("SentryBufferFullError");
      function tX(e10 = 100) {
        let t10 = /* @__PURE__ */ new Set();
        return { get $() {
          return Array.from(t10);
        }, add: function(n10) {
          if (!(t10.size < e10)) return (0, tq.rejectedSyncPromise)(tJ);
          let r10 = n10();
          return t10.add(r10), r10.then(() => {
            t10.delete(r10);
          }, () => {
            t10.delete(r10);
          }), r10;
        }, drain: function(e11) {
          if (!t10.size) return (0, tq.resolvedSyncPromise)(true);
          let n10 = Promise.allSettled(Array.from(t10)).then(() => true);
          return e11 ? Promise.race([n10, new Promise((t11) => setTimeout(() => t11(false), e11))]) : n10;
        } };
      }
      var tZ = eG;
      function tQ(e10) {
        let t10 = [];
        e10.message && t10.push(e10.message);
        try {
          let n10 = e10.exception.values[e10.exception.values.length - 1];
          n10?.value && (t10.push(n10.value), n10.type && t10.push(`${n10.type}: ${n10.value}`));
        } catch {
        }
        return t10;
      }
      var t0 = e.i(274779), t1 = e.i(775403), t2 = e.i(133245), t4 = eG, t5 = e.i(469599);
      let t3 = "Not capturing exception because it's already been captured.", t9 = "Discarded session because of missing or non-string release", t6 = Symbol.for("SentryInternalError"), t8 = Symbol.for("SentryDoNotSendEventError");
      function t7(e10) {
        return { message: e10, [t6]: true };
      }
      function ne(e10) {
        return { message: e10, [t8]: true };
      }
      function nt(e10) {
        return !!e10 && "object" == typeof e10 && t6 in e10;
      }
      function nn(e10) {
        return !!e10 && "object" == typeof e10 && t8 in e10;
      }
      function nr(e10, t10, n10, r10, i3) {
        let s2, a2 = 0, o2 = false;
        e10.on(n10, () => {
          a2 = 0, clearTimeout(s2), o2 = false;
        }), e10.on(t10, (t11) => {
          (a2 += r10(t11)) >= 8e5 ? i3(e10) : o2 || (o2 = true, s2 = setTimeout(() => {
            i3(e10);
          }, 5e3));
        }), e10.on("flush", () => {
          i3(e10);
        });
      }
      class ni {
        constructor(e10) {
          if (this._options = e10, this._integrations = {}, this._numProcessing = 0, this._outcomes = {}, this._hooks = {}, this._eventProcessors = [], this._promiseBuffer = tX(e10.transportOptions?.bufferSize ?? 64), e10.dsn ? this._dsn = (0, tM.makeDsn)(e10.dsn) : X.DEBUG_BUILD && Q.debug.warn("No DSN provided, client will not send events."), this._dsn) {
            const t10 = function(e11, t11, n10) {
              let r10, i3, s2;
              return t11 || `${r10 = e11.protocol ? `${e11.protocol}:` : "", i3 = e11.port ? `:${e11.port}` : "", `${r10}//${e11.host}${i3}${e11.path ? `/${e11.path}` : ""}/api/`}${e11.projectId}/envelope/?${s2 = { sentry_version: "7" }, e11.publicKey && (s2.sentry_key = e11.publicKey), n10 && (s2.sentry_client = `${n10.name}/${n10.version}`), new URLSearchParams(s2).toString()}`;
            }(this._dsn, e10.tunnel, e10._metadata ? e10._metadata.sdk : void 0);
            this._transport = e10.transport({ tunnel: this._options.tunnel, recordDroppedEvent: this.recordDroppedEvent.bind(this), ...e10.transportOptions, url: t10 });
          }
          this._options.enableLogs = this._options.enableLogs ?? this._options._experiments?.enableLogs, this._options.enableLogs && nr(this, "afterCaptureLog", "flushLogs", nc, tY), (this._options.enableMetrics ?? this._options._experiments?.enableMetrics ?? true) && nr(this, "afterCaptureMetric", "flushMetrics", nu, tz);
        }
        captureException(e10, t10, n10) {
          let r10 = (0, t1.uuid4)();
          if ((0, t1.checkOrSetAlreadyCaught)(e10)) return X.DEBUG_BUILD && Q.debug.log(t3), r10;
          let i3 = { event_id: r10, ...t10 };
          return this._process(() => this.eventFromException(e10, i3).then((e11) => this._captureEvent(e11, i3, n10)).then((e11) => e11), "error"), i3.event_id;
        }
        captureMessage(e10, t10, n10, r10) {
          let i3 = { event_id: (0, t1.uuid4)(), ...n10 }, s2 = (0, tj.isParameterizedString)(e10) ? e10 : String(e10), a2 = (0, tj.isPrimitive)(e10), o2 = a2 ? this.eventFromMessage(s2, t10, i3) : this.eventFromException(e10, i3);
          return this._process(() => o2.then((e11) => this._captureEvent(e11, i3, r10)), a2 ? "unknown" : "error"), i3.event_id;
        }
        captureEvent(e10, t10, n10) {
          let r10 = (0, t1.uuid4)();
          if (t10?.originalException && (0, t1.checkOrSetAlreadyCaught)(t10.originalException)) return X.DEBUG_BUILD && Q.debug.log(t3), r10;
          let i3 = { event_id: r10, ...t10 }, s2 = e10.sdkProcessingMetadata || {}, a2 = s2.capturedSpanScope, o2 = s2.capturedSpanIsolationScope, u2 = ns(e10.type);
          return this._process(() => this._captureEvent(e10, i3, a2 || n10, o2), u2), i3.event_id;
        }
        captureSession(e10) {
          this.sendSession(e10), (0, tK.updateSession)(e10, { init: false });
        }
        getDsn() {
          return this._dsn;
        }
        getOptions() {
          return this._options;
        }
        getSdkMetadata() {
          return this._options._metadata;
        }
        getTransport() {
          return this._transport;
        }
        async flush(e10) {
          let t10 = this._transport;
          if (!t10) return true;
          this.emit("flush");
          let n10 = await this._isClientDoneProcessing(e10), r10 = await t10.flush(e10);
          return n10 && r10;
        }
        async close(e10) {
          let t10 = await this.flush(e10);
          return this.getOptions().enabled = false, this.emit("close"), t10;
        }
        getEventProcessors() {
          return this._eventProcessors;
        }
        addEventProcessor(e10) {
          this._eventProcessors.push(e10);
        }
        init() {
          (this._isEnabled() || this._options.integrations.some(({ name: e10 }) => e10.startsWith("Spotlight"))) && this._setupIntegrations();
        }
        getIntegrationByName(e10) {
          return this._integrations[e10];
        }
        addIntegration(e10) {
          let t10 = this._integrations[e10.name];
          tF(this, e10, this._integrations), t10 || t$(this, [e10]);
        }
        sendEvent(e10, t10 = {}) {
          this.emit("beforeSendEvent", e10, t10);
          let n10 = (0, tB.createEventEnvelope)(e10, this._dsn, this._options._metadata, this._options.tunnel);
          for (let e11 of t10.attachments || []) n10 = (0, tU.addItemToEnvelope)(n10, (0, tU.createAttachmentEnvelopeItem)(e11));
          this.sendEnvelope(n10).then((t11) => this.emit("afterSendEvent", e10, t11));
        }
        sendSession(e10) {
          let { release: t10, environment: n10 = tx.DEFAULT_ENVIRONMENT } = this._options;
          if ("aggregates" in e10) {
            let r11 = e10.attrs || {};
            if (!r11.release && !t10) {
              X.DEBUG_BUILD && Q.debug.warn(t9);
              return;
            }
            r11.release = r11.release || t10, r11.environment = r11.environment || n10, e10.attrs = r11;
          } else {
            if (!e10.release && !t10) {
              X.DEBUG_BUILD && Q.debug.warn(t9);
              return;
            }
            e10.release = e10.release || t10, e10.environment = e10.environment || n10;
          }
          this.emit("beforeSendSession", e10);
          let r10 = (0, tB.createSessionEnvelope)(e10, this._dsn, this._options._metadata, this._options.tunnel);
          this.sendEnvelope(r10);
        }
        recordDroppedEvent(e10, t10, n10 = 1) {
          if (this._options.sendClientReports) {
            let r10 = `${e10}:${t10}`;
            X.DEBUG_BUILD && Q.debug.log(`Recording outcome: "${r10}"${n10 > 1 ? ` (${n10} times)` : ""}`), this._outcomes[r10] = (this._outcomes[r10] || 0) + n10;
          }
        }
        on(e10, t10) {
          let n10 = this._hooks[e10] = this._hooks[e10] || /* @__PURE__ */ new Set(), r10 = (...e11) => t10(...e11);
          return n10.add(r10), () => {
            n10.delete(r10);
          };
        }
        emit(e10, ...t10) {
          let n10 = this._hooks[e10];
          n10 && n10.forEach((e11) => e11(...t10));
        }
        async sendEnvelope(e10) {
          if (this.emit("beforeEnvelope", e10), this._isEnabled() && this._transport) try {
            return await this._transport.send(e10);
          } catch (e11) {
            return X.DEBUG_BUILD && Q.debug.error("Error while sending envelope:", e11), {};
          }
          return X.DEBUG_BUILD && Q.debug.error("Transport disabled"), {};
        }
        _setupIntegrations() {
          var e10;
          let t10, { integrations: n10 } = this._options;
          this._integrations = (e10 = this, t10 = {}, n10.forEach((n11) => {
            n11 && tF(e10, n11, t10);
          }), t10), t$(this, n10);
        }
        _updateSessionFromEvent(e10, t10) {
          let n10 = "fatal" === t10.level, r10 = false, i3 = t10.exception?.values;
          if (i3) {
            for (let e11 of (r10 = true, n10 = false, i3)) if (e11.mechanism?.handled === false) {
              n10 = true;
              break;
            }
          }
          let s2 = "ok" === e10.status;
          (s2 && 0 === e10.errors || s2 && n10) && ((0, tK.updateSession)(e10, { ...n10 && { status: "crashed" }, errors: e10.errors || Number(r10 || n10) }), this.captureSession(e10));
        }
        async _isClientDoneProcessing(e10) {
          let t10 = 0;
          for (; !e10 || t10 < e10; ) {
            if (await new Promise((e11) => setTimeout(e11, 1)), !this._numProcessing) return true;
            t10++;
          }
          return false;
        }
        _isEnabled() {
          return false !== this.getOptions().enabled && void 0 !== this._transport;
        }
        _prepareEvent(e10, t10, n10, r10) {
          let i3 = this.getOptions(), s2 = Object.keys(this._integrations);
          return !t10.integrations && s2?.length && (t10.integrations = s2), this.emit("preprocessEvent", e10, t10), e10.type || r10.setLastEventId(e10.event_id || t10.event_id), (0, t2.prepareEvent)(i3, e10, t10, n10, this, r10).then((e11) => (null === e11 || (this.emit("postprocessEvent", e11, t10), e11.contexts = { trace: (0, eE.getTraceContextFromScope)(n10), ...e11.contexts }, e11.sdkProcessingMetadata = { dynamicSamplingContext: (0, eB.getDynamicSamplingContextFromScope)(this, n10), ...e11.sdkProcessingMetadata }), e11));
        }
        _captureEvent(e10, t10 = {}, n10 = (0, eE.getCurrentScope)(), r10 = (0, eE.getIsolationScope)()) {
          return X.DEBUG_BUILD && na(e10) && Q.debug.log(`Captured error event \`${tQ(e10)[0] || "<unknown>"}\``), this._processEvent(e10, t10, n10, r10).then((e11) => e11.event_id, (e11) => {
            X.DEBUG_BUILD && (nn(e11) ? Q.debug.log(e11.message) : nt(e11) ? Q.debug.warn(e11.message) : Q.debug.warn(e11));
          });
        }
        _processEvent(e10, t10, n10, r10) {
          let i3 = this.getOptions(), { sampleRate: s2 } = i3, a2 = no(e10), o2 = na(e10), u2 = e10.type || "error", c2 = `before send for type \`${u2}\``, l2 = void 0 === s2 ? void 0 : (0, eH.parseSampleRate)(s2);
          if (o2 && "number" == typeof l2 && (0, t4.safeMathRandom)() > l2) return this.recordDroppedEvent("sample_rate", "error"), (0, tq.rejectedSyncPromise)(ne(`Discarding event because it's not included in the random sample (sampling rate = ${s2})`));
          let p2 = ns(e10.type);
          return this._prepareEvent(e10, t10, n10, r10).then((e11) => {
            if (null === e11) throw this.recordDroppedEvent("event_processor", p2), ne("An event processor returned `null`, will not send event.");
            return t10.data && true === t10.data.__sentry__ ? e11 : function(e12, t11) {
              let n11 = `${t11} must return \`null\` or a valid event.`;
              if ((0, tj.isThenable)(e12)) return e12.then((e13) => {
                if (!(0, tj.isPlainObject)(e13) && null !== e13) throw t7(n11);
                return e13;
              }, (e13) => {
                throw t7(`${t11} rejected with ${e13}`);
              });
              if (!(0, tj.isPlainObject)(e12) && null !== e12) throw t7(n11);
              return e12;
            }(function(e12, t11, n11, r11) {
              let { beforeSend: i4, beforeSendTransaction: s3, beforeSendSpan: a3, ignoreSpans: o3 } = t11, u3 = n11;
              if (na(u3) && i4) return i4(u3, r11);
              if (no(u3)) {
                if (a3 || o3) {
                  let t12 = function(e13) {
                    let { trace_id: t13, parent_span_id: n12, span_id: r12, status: i5, origin: s4, data: a4, op: o4 } = e13.contexts?.trace ?? {};
                    return { data: a4 ?? {}, description: e13.transaction, op: o4, parent_span_id: n12, span_id: r12 ?? "", start_timestamp: e13.start_timestamp ?? 0, status: i5, timestamp: e13.timestamp, trace_id: t13 ?? "", origin: s4, profile_id: a4?.[eg.SEMANTIC_ATTRIBUTE_PROFILE_ID], exclusive_time: a4?.[eg.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME], measurements: e13.measurements, is_segment: true };
                  }(u3);
                  if (o3?.length && (0, t5.shouldIgnoreSpan)(t12, o3)) return null;
                  if (a3) {
                    let e13 = a3(t12);
                    if (e13) u3 = (0, t0.merge)(n11, { type: "transaction", timestamp: e13.timestamp, start_timestamp: e13.start_timestamp, transaction: e13.description, contexts: { trace: { trace_id: e13.trace_id, span_id: e13.span_id, parent_span_id: e13.parent_span_id, op: e13.op, status: e13.status, origin: e13.origin, data: { ...e13.data, ...e13.profile_id && { [eg.SEMANTIC_ATTRIBUTE_PROFILE_ID]: e13.profile_id }, ...e13.exclusive_time && { [eg.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: e13.exclusive_time } } } }, measurements: e13.measurements });
                    else (0, el.showSpanDropWarning)();
                  }
                  if (u3.spans) {
                    let t13 = [], n12 = u3.spans;
                    for (let e13 of n12) {
                      if (o3?.length && (0, t5.shouldIgnoreSpan)(e13, o3)) {
                        (0, t5.reparentChildSpans)(n12, e13);
                        continue;
                      }
                      if (a3) {
                        let n13 = a3(e13);
                        n13 ? t13.push(n13) : ((0, el.showSpanDropWarning)(), t13.push(e13));
                      } else t13.push(e13);
                    }
                    let r12 = u3.spans.length - t13.length;
                    r12 && e12.recordDroppedEvent("before_send", "span", r12), u3.spans = t13;
                  }
                }
                if (s3) {
                  if (u3.spans) {
                    let e13 = u3.spans.length;
                    u3.sdkProcessingMetadata = { ...n11.sdkProcessingMetadata, spanCountBeforeProcessing: e13 };
                  }
                  return s3(u3, r11);
                }
              }
              return u3;
            }(this, i3, e11, t10), c2);
          }).then((i4) => {
            if (null === i4) {
              if (this.recordDroppedEvent("before_send", p2), a2) {
                let t11 = 1 + (e10.spans || []).length;
                this.recordDroppedEvent("before_send", "span", t11);
              }
              throw ne(`${c2} returned \`null\`, will not send event.`);
            }
            let s3 = n10.getSession() || r10.getSession();
            if (o2 && s3 && this._updateSessionFromEvent(s3, i4), a2) {
              let e11 = (i4.sdkProcessingMetadata?.spanCountBeforeProcessing || 0) - (i4.spans ? i4.spans.length : 0);
              e11 > 0 && this.recordDroppedEvent("before_send", "span", e11);
            }
            let u3 = i4.transaction_info;
            return a2 && u3 && i4.transaction !== e10.transaction && (i4.transaction_info = { ...u3, source: "custom" }), this.sendEvent(i4, t10), i4;
          }).then(null, (e11) => {
            if (nn(e11) || nt(e11)) throw e11;
            throw this.captureException(e11, { mechanism: { handled: false, type: "internal" }, data: { __sentry__: true }, originalException: e11 }), t7(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${e11}`);
          });
        }
        _process(e10, t10) {
          this._numProcessing++, this._promiseBuffer.add(e10).then((e11) => (this._numProcessing--, e11), (e11) => (this._numProcessing--, e11 === tJ && this.recordDroppedEvent("queue_overflow", t10), e11));
        }
        _clearOutcomes() {
          let e10 = this._outcomes;
          return this._outcomes = {}, Object.entries(e10).map(([e11, t10]) => {
            let [n10, r10] = e11.split(":");
            return { reason: n10, category: r10, quantity: t10 };
          });
        }
        _flushOutcomes() {
          var e10;
          let t10;
          X.DEBUG_BUILD && Q.debug.log("Flushing outcomes...");
          let n10 = this._clearOutcomes();
          if (0 === n10.length) {
            X.DEBUG_BUILD && Q.debug.log("No outcomes to send");
            return;
          }
          if (!this._dsn) {
            X.DEBUG_BUILD && Q.debug.log("No dsn provided, will not send outcomes");
            return;
          }
          X.DEBUG_BUILD && Q.debug.log("Sending outcomes:", n10);
          let r10 = (e10 = this._options.tunnel && (0, tM.dsnToString)(this._dsn), t10 = [{ type: "client_report" }, { timestamp: (0, tV.dateTimestampInSeconds)(), discarded_events: n10 }], (0, tU.createEnvelope)(e10 ? { dsn: e10 } : {}, [t10]));
          this.sendEnvelope(r10);
        }
      }
      function ns(e10) {
        return "replay_event" === e10 ? "replay" : e10 || "error";
      }
      function na(e10) {
        return void 0 === e10.type;
      }
      function no(e10) {
        return "transaction" === e10.type;
      }
      function nu(e10) {
        let t10 = 0;
        return e10.name && (t10 += 2 * e10.name.length), (t10 += 8) + nl(e10.attributes);
      }
      function nc(e10) {
        let t10 = 0;
        return e10.message && (t10 += 2 * e10.message.length), t10 + nl(e10.attributes);
      }
      function nl(e10) {
        if (!e10) return 0;
        let t10 = 0;
        return Object.values(e10).forEach((e11) => {
          Array.isArray(e11) ? t10 += e11.length * np(e11[0]) : (0, tj.isPrimitive)(e11) ? t10 += np(e11) : t10 += 100;
        }), t10;
      }
      function np(e10) {
        return "string" == typeof e10 ? 2 * e10.length : "number" == typeof e10 ? 8 : 4 * ("boolean" == typeof e10);
      }
      var nd = e.i(150666);
      function nf(e10, t10) {
        return e10(t10.stack || "", 1);
      }
      function n_(e10, t10) {
        let n10 = { type: t10.name || t10.constructor.name, value: (0, tj.isError)(t10) && "__sentry_fetch_url_host__" in t10 && "string" == typeof t10.__sentry_fetch_url_host__ ? `${t10.message} (${t10.__sentry_fetch_url_host__})` : t10.message }, r10 = nf(e10, t10);
        return r10.length && (n10.stacktrace = { frames: r10 }), n10;
      }
      class nh extends ni {
        constructor(e10) {
          ef(), function(e11) {
            let t10 = e11._metadata?.sdk, n10 = t10?.name && t10?.version ? `${t10?.name}/${t10?.version}` : void 0;
            e11.transportOptions = { ...e11.transportOptions, headers: { ...n10 && { "user-agent": n10 }, ...e11.transportOptions?.headers } };
          }(e10), super(e10), this._setUpMetricsProcessing();
        }
        eventFromException(e10, t10) {
          let n10 = function(e11, t11, n11, r10) {
            let i3 = r10?.data && r10.data.mechanism || { handled: true, type: "generic" }, [s2, a2] = function(e12, t12, n12, r11) {
              if ((0, tj.isError)(n12)) return [n12, void 0];
              if (t12.synthetic = true, (0, tj.isPlainObject)(n12)) {
                let t13 = e12?.getOptions().normalizeDepth, i5 = { __serialized__: (0, nd.normalizeToSize)(n12, t13) }, s3 = function(e13) {
                  for (let t14 in e13) if (Object.prototype.hasOwnProperty.call(e13, t14)) {
                    let n13 = e13[t14];
                    if (n13 instanceof Error) return n13;
                  }
                }(n12);
                if (s3) return [s3, i5];
                let a3 = function(e13) {
                  if ("name" in e13 && "string" == typeof e13.name) {
                    let t15 = `'${e13.name}' captured as exception`;
                    return "message" in e13 && "string" == typeof e13.message && (t15 += ` with message '${e13.message}'`), t15;
                  }
                  if ("message" in e13 && "string" == typeof e13.message) return e13.message;
                  let t14 = (0, eN.extractExceptionKeysForMessage)(e13);
                  if ((0, tj.isErrorEvent)(e13)) return `Event \`ErrorEvent\` captured as exception with message \`${e13.message}\``;
                  let n13 = function(e14) {
                    try {
                      let t15 = Object.getPrototypeOf(e14);
                      return t15 ? t15.constructor.name : void 0;
                    } catch {
                    }
                  }(e13);
                  return `${n13 && "Object" !== n13 ? `'${n13}'` : "Object"} captured as exception with keys: ${t14}`;
                }(n12), o3 = r11?.syntheticException || Error(a3);
                return o3.message = a3, [o3, i5];
              }
              let i4 = r11?.syntheticException || Error(n12);
              return i4.message = `${n12}`, [i4, void 0];
            }(e11, i3, n11, r10), o2 = { exception: { values: [n_(t11, s2)] } };
            return a2 && (o2.extra = a2), (0, t1.addExceptionTypeValue)(o2, void 0, void 0), (0, t1.addExceptionMechanism)(o2, i3), { ...o2, event_id: r10?.event_id };
          }(this, this._options.stackParser, e10, t10);
          return n10.level = "error", (0, tq.resolvedSyncPromise)(n10);
        }
        eventFromMessage(e10, t10 = "info", n10) {
          return (0, tq.resolvedSyncPromise)(function(e11, t11, n11 = "info", r10, i3) {
            let s2 = { event_id: r10?.event_id, level: n11 };
            if (i3 && r10?.syntheticException) {
              let n12 = nf(e11, r10.syntheticException);
              n12.length && (s2.exception = { values: [{ value: t11, stacktrace: { frames: n12 } }] }, (0, t1.addExceptionMechanism)(s2, { synthetic: true }));
            }
            if ((0, tj.isParameterizedString)(t11)) {
              let { __sentry_template_string__: e12, __sentry_template_values__: n12 } = t11;
              return s2.logentry = { message: e12, params: n12 }, s2;
            }
            return s2.message = t11, s2;
          }(this._options.stackParser, e10, t10, n10, this._options.attachStacktrace));
        }
        captureException(e10, t10, n10) {
          return ng(t10), super.captureException(e10, t10, n10);
        }
        captureEvent(e10, t10, n10) {
          return !e10.type && e10.exception?.values && e10.exception.values.length > 0 && ng(t10), super.captureEvent(e10, t10, n10);
        }
        captureCheckIn(e10, t10, n10) {
          var r10, i3, s2;
          let a2, o2, u2 = "checkInId" in e10 && e10.checkInId ? e10.checkInId : (0, t1.uuid4)();
          if (!this._isEnabled()) return X.DEBUG_BUILD && Q.debug.warn("SDK not enabled, will not capture check-in."), u2;
          let { release: c2, environment: l2, tunnel: p2 } = this.getOptions(), d2 = { check_in_id: u2, monitor_slug: e10.monitorSlug, status: e10.status, release: c2, environment: l2 };
          "duration" in e10 && (d2.duration = e10.duration), t10 && (d2.monitor_config = { schedule: t10.schedule, checkin_margin: t10.checkinMargin, max_runtime: t10.maxRuntime, timezone: t10.timezone, failure_issue_threshold: t10.failureIssueThreshold, recovery_threshold: t10.recoveryThreshold });
          let [f2, _2] = (r10 = this, n10 ? (0, eE.withScope)(n10, () => {
            let e11 = (0, el.getActiveSpan)(), t11 = e11 ? (0, el.spanToTraceContext)(e11) : (0, eE.getTraceContextFromScope)(n10);
            return [e11 ? (0, eB.getDynamicSamplingContextFromSpan)(e11) : (0, eB.getDynamicSamplingContextFromScope)(r10, n10), t11];
          }) : [void 0, void 0]);
          _2 && (d2.contexts = { trace: _2 });
          let h2 = (i3 = this.getSdkMetadata(), s2 = this.getDsn(), a2 = { sent_at: (/* @__PURE__ */ new Date()).toISOString() }, i3?.sdk && (a2.sdk = { name: i3.sdk.name, version: i3.sdk.version }), p2 && s2 && (a2.dsn = (0, tM.dsnToString)(s2)), f2 && (a2.trace = f2), o2 = [{ type: "check_in" }, d2], (0, tU.createEnvelope)(a2, [o2]));
          return X.DEBUG_BUILD && Q.debug.log("Sending checkin:", e10.monitorSlug, e10.status), this.sendEnvelope(h2), u2;
        }
        _prepareEvent(e10, t10, n10, r10) {
          return this._options.platform && (e10.platform = e10.platform || this._options.platform), this._options.runtime && (e10.contexts = { ...e10.contexts, runtime: e10.contexts?.runtime || this._options.runtime }), this._options.serverName && (e10.server_name = e10.server_name || this._options.serverName), super._prepareEvent(e10, t10, n10, r10);
        }
        _setUpMetricsProcessing() {
          this.on("processMetric", (e10) => {
            this._options.serverName && (e10.attributes = { "server.address": this._options.serverName, ...e10.attributes });
          });
        }
      }
      function ng(e10) {
        let t10 = (0, eE.getIsolationScope)().getScopeData().sdkProcessingMetadata.requestSession;
        if (t10) {
          let n10 = e10?.mechanism?.handled ?? true;
          n10 && "crashed" !== t10.status ? t10.status = "errored" : n10 || (t10.status = "crashed");
        }
      }
      var ez = eG, eG = eG;
      function nm(e10, t10) {
        return !!e10 && "object" == typeof e10 && !!e10[t10];
      }
      function nE(e10) {
        return "string" == typeof e10 ? e10 : e10 ? nm(e10, "url") ? e10.url : e10.toString ? e10.toString() : "" : "";
      }
      Z.GLOBAL_OBJ;
      var nS = e.i(606691), nv = e.i(433798);
      function nT(e10) {
        return e10.split(",").some((e11) => e11.trim().startsWith(ew.SENTRY_BAGGAGE_KEY_PREFIX));
      }
      function ny(e10, t10, n10, r10) {
        let i3 = { url: eI(e10), type: "fetch", "http.method": n10, [eg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: r10, [eg.SEMANTIC_ATTRIBUTE_SENTRY_OP]: "http.client" };
        return t10 && (eS(t10) || (i3["http.url"] = eI(t10.href), i3["server.address"] = t10.host), t10.search && (i3["http.query"] = t10.search), t10.hash && (i3["http.fragment"] = t10.hash)), i3;
      }
      function nR(e10, t10) {
        let n10 = (0, eE.getClient)(), r10 = (0, eE.getIsolationScope)();
        if (!n10) return;
        let { beforeBreadcrumb: i3 = null, maxBreadcrumbs: s2 = 100 } = n10.getOptions();
        if (s2 <= 0) return;
        let a2 = { timestamp: (0, tV.dateTimestampInSeconds)(), ...e10 }, o2 = i3 ? (0, Q.consoleSandbox)(() => i3(a2, t10)) : a2;
        null !== o2 && (n10.emit && n10.emit("beforeAddBreadcrumb", o2, t10), r10.addBreadcrumb(o2, s2));
      }
      function nA(e10) {
        return parseInt(e10 || "", 10) || void 0;
      }
      function nI(e10, t10) {
        let n10 = (0, ee.getFramesFromEvent)(e10), r10 = (0, ee.getFramesFromEvent)(t10);
        if (!n10 && !r10) return true;
        if (n10 && !r10 || !n10 && r10 || r10.length !== n10.length) return false;
        for (let e11 = 0; e11 < r10.length; e11++) {
          let t11 = r10[e11], i3 = n10[e11];
          if (t11.filename !== i3.filename || t11.lineno !== i3.lineno || t11.colno !== i3.colno || t11.function !== i3.function) return false;
        }
        return true;
      }
      function nb(e10, t10) {
        let n10 = e10.fingerprint, r10 = t10.fingerprint;
        if (!n10 && !r10) return true;
        if (n10 && !r10 || !n10 && r10) return false;
        try {
          return n10.join("") === r10.join("");
        } catch {
          return false;
        }
      }
      function nO(e10) {
        return e10.exception?.values?.[0];
      }
      let nC = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/, /^ResizeObserver loop completed with undelivered notifications.$/, /^Cannot redefine property: googletag$/, /^Can't find variable: gmo$/, /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/, `can't redefine non-configurable property "solana"`, "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)", "Can't find variable: _AutofillCallbackHandler", /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/, /^Java exception was raised during method invocation$/];
      function nN(e10 = {}, t10 = {}) {
        return { allowUrls: [...e10.allowUrls || [], ...t10.allowUrls || []], denyUrls: [...e10.denyUrls || [], ...t10.denyUrls || []], ignoreErrors: [...e10.ignoreErrors || [], ...t10.ignoreErrors || [], ...e10.disableErrorDefaults ? [] : nC], ignoreTransactions: [...e10.ignoreTransactions || [], ...t10.ignoreTransactions || []] };
      }
      function nL(e10) {
        try {
          let t10 = [...e10.exception?.values ?? []].reverse().find((e11) => e11.mechanism?.parent_id === void 0 && e11.stacktrace?.frames?.length), n10 = t10?.stacktrace?.frames;
          return n10 ? function(e11 = []) {
            for (let t11 = e11.length - 1; t11 >= 0; t11--) {
              let n11 = e11[t11];
              if (n11 && "<anonymous>" !== n11.filename && "[native code]" !== n11.filename) return n11.filename || null;
            }
            return null;
          }(n10) : null;
        } catch {
          return X.DEBUG_BUILD && Q.debug.error(`Cannot extract url for event ${(0, t1.getEventDescription)(e10)}`), null;
        }
      }
      let nP = /* @__PURE__ */ new WeakMap();
      function nw(e10) {
        return Array.isArray(e10.errors);
      }
      function nD(e10, t10, n10) {
        e10.mechanism = { handled: true, type: "auto.core.linked_errors", ...nw(n10) && { is_exception_group: true }, ...e10.mechanism, exception_id: t10 };
      }
      function nM(e10, t10, n10, r10) {
        e10.mechanism = { handled: true, ...e10.mechanism, type: "chained", source: t10, exception_id: n10, parent_id: r10 };
      }
      function nU() {
        "console" in Z.GLOBAL_OBJ && Q.CONSOLE_LEVELS.forEach(function(e10) {
          e10 in Z.GLOBAL_OBJ.console && (0, eN.fill)(Z.GLOBAL_OBJ.console, e10, function(t10) {
            return Q.originalConsoleMethods[e10] = t10, function(...t11) {
              es("console", { args: t11, level: e10 });
              let n10 = Q.originalConsoleMethods[e10];
              n10?.apply(Z.GLOBAL_OBJ.console, t11);
            };
          });
        });
      }
      function nx(e10) {
        return "util" in Z.GLOBAL_OBJ && "function" == typeof Z.GLOBAL_OBJ.util.format ? Z.GLOBAL_OBJ.util.format(...e10) : (0, ex.safeJoin)(e10, " ");
      }
      let nB = ["X-Client-IP", "X-Forwarded-For", "Fly-Client-IP", "CF-Connecting-IP", "Fastly-Client-Ip", "True-Client-Ip", "X-Real-IP", "X-Cluster-Client-IP", "X-Forwarded", "Forwarded-For", "Forwarded", "X-Vercel-Forwarded-For"], nk = { cookies: true, data: true, headers: true, query_string: true, url: true }, n$ = /* @__PURE__ */ new Map(), nF = /* @__PURE__ */ new Set(["ai.generateText", "ai.streamText", "ai.generateObject", "ai.streamObject", "ai.embed", "ai.embedMany"]), nG = /* @__PURE__ */ new Set(["ai.generateText.doGenerate", "ai.streamText.doStream", "ai.generateObject.doGenerate", "ai.streamObject.doStream"]), nj = /* @__PURE__ */ new Set(["ai.embed.doEmbed", "ai.embedMany.doEmbed"]);
      (T = d || (d = {}))[T.NOT_RECORD = 0] = "NOT_RECORD", T[T.RECORD = 1] = "RECORD", T[T.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
      var nV = Y.instance();
      let nY = { [eO]: "opentelemetry", "process.runtime.name": "browser", [eb]: "webjs", [eC]: "2.5.0" }, nH = (e10) => null !== e10 && "object" == typeof e10 && "function" == typeof e10.then;
      class nz {
        _rawAttributes;
        _asyncAttributesPending = false;
        _schemaUrl;
        _memoizedAttributes;
        static FromAttributeList(e10, t10) {
          let n10 = new nz({}, t10);
          return n10._rawAttributes = nq(e10), n10._asyncAttributesPending = e10.filter(([e11, t11]) => nH(t11)).length > 0, n10;
        }
        constructor(e10, t10) {
          const n10 = e10.attributes ?? {};
          this._rawAttributes = Object.entries(n10).map(([e11, t11]) => (nH(t11) && (this._asyncAttributesPending = true), [e11, t11])), this._rawAttributes = nq(this._rawAttributes), this._schemaUrl = function(e11) {
            if ("string" == typeof e11 || void 0 === e11) return e11;
            nV.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.", e11);
          }(t10?.schemaUrl);
        }
        get asyncAttributesPending() {
          return this._asyncAttributesPending;
        }
        async waitForAsyncAttributes() {
          if (this.asyncAttributesPending) {
            for (let e10 = 0; e10 < this._rawAttributes.length; e10++) {
              let [t10, n10] = this._rawAttributes[e10];
              this._rawAttributes[e10] = [t10, nH(n10) ? await n10 : n10];
            }
            this._asyncAttributesPending = false;
          }
        }
        get attributes() {
          if (this.asyncAttributesPending && nV.error("Accessing resource attributes before async attributes settled"), this._memoizedAttributes) return this._memoizedAttributes;
          let e10 = {};
          for (let [t10, n10] of this._rawAttributes) {
            if (nH(n10)) {
              nV.debug(`Unsettled resource attribute ${t10} skipped`);
              continue;
            }
            null != n10 && (e10[t10] ??= n10);
          }
          return this._asyncAttributesPending || (this._memoizedAttributes = e10), e10;
        }
        getRawAttributes() {
          return this._rawAttributes;
        }
        get schemaUrl() {
          return this._schemaUrl;
        }
        merge(e10) {
          var t10, n10;
          let r10, i3, s2;
          if (null == e10) return this;
          let a2 = (t10 = this, n10 = e10, r10 = t10?.schemaUrl, s2 = void 0 === (i3 = n10?.schemaUrl) || "" === i3, void 0 === r10 || "" === r10 ? i3 : s2 || r10 === i3 ? r10 : void nV.warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.', r10, i3));
          return nz.FromAttributeList([...e10.getRawAttributes(), ...this.getRawAttributes()], a2 ? { schemaUrl: a2 } : void 0);
        }
      }
      function nW(e10, t10) {
        return nz.FromAttributeList(Object.entries(e10), t10);
      }
      function nK() {
        return nW({ "service.name": function() {
          if (void 0 === n) try {
            let e10 = globalThis.process.argv0;
            n = e10 ? `unknown_service:${e10}` : "unknown_service";
          } catch {
            n = "unknown_service";
          }
          return n;
        }(), [eb]: nY[eb], [eO]: nY[eO], [eC]: nY[eC] });
      }
      function nq(e10) {
        return e10.map(([e11, t10]) => nH(t10) ? [e11, t10.catch((t11) => {
          nV.debug("promise rejection for resource attribute: %s - %s", e11, t11);
        })] : [e11, t10]);
      }
      void 0 === globalThis.performance && (globalThis.performance = { timeOrigin: 0, now: () => Date.now() });
      class nJ extends nh {
        constructor(e10) {
          eh(e10, "vercel-edge"), e10._metadata = e10._metadata || {}, super({ ...e10, platform: "javascript", runtime: { name: "vercel-edge" }, serverName: e10.serverName || process.env.SENTRY_NAME });
        }
        async flush(e10) {
          let t10 = this.traceProvider;
          return await t10?.forceFlush(), this.getOptions().sendClientReports && this._flushOutcomes(), super.flush(e10);
        }
      }
      let nX = a("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
      function nZ(e10) {
        return e10.setValue(nX, true);
      }
      function nQ(e10) {
        return true === e10.getValue(nX);
      }
      let n0 = "baggage";
      class n1 {
        inject(e10, t10, n10) {
          let r10 = tA.getBaggage(e10);
          if (!r10 || nQ(e10)) return;
          let i3 = r10.getAllEntries().map(([e11, t11]) => {
            let n11 = `${encodeURIComponent(e11)}=${encodeURIComponent(t11.value)}`;
            return void 0 !== t11.metadata && (n11 += ";" + t11.metadata.toString()), n11;
          }).filter((e11) => e11.length <= 4096).slice(0, 180).reduce((e11, t11) => {
            let n11 = `${e11}${"" !== e11 ? "," : ""}${t11}`;
            return n11.length > 8192 ? e11 : n11;
          }, "");
          i3.length > 0 && n10.set(t10, n0, i3);
        }
        extract(e10, t10, n10) {
          let r10 = n10.get(t10, n0), i3 = Array.isArray(r10) ? r10.join(",") : r10;
          if (!i3) return e10;
          let s2 = {};
          return 0 === i3.length || (i3.split(",").forEach((e11) => {
            let t11 = function(e12) {
              let t12, n11, r11;
              if (!e12) return;
              let i4 = e12.indexOf(";"), s3 = -1 === i4 ? e12 : e12.substring(0, i4), a2 = s3.indexOf("=");
              if (a2 <= 0) return;
              let o2 = s3.substring(0, a2).trim(), u2 = s3.substring(a2 + 1).trim();
              if (o2 && u2) {
                try {
                  t12 = decodeURIComponent(o2), n11 = decodeURIComponent(u2);
                } catch {
                  return;
                }
                if (-1 !== i4 && i4 < e12.length - 1) {
                  var c2;
                  "string" != typeof (c2 = e12.substring(i4 + 1)) && (tv.error("Cannot create baggage metadata from unknown type: " + typeof c2), c2 = ""), r11 = { __TYPE__: tS, toString: function() {
                    return c2;
                  } };
                }
                return { key: t12, value: n11, metadata: r11 };
              }
            }(e11);
            if (t11) {
              let e12 = { value: t11.value };
              t11.metadata && (e12.metadata = t11.metadata), s2[t11.key] = e12;
            }
          }), 0 === Object.entries(s2).length) ? e10 : tA.setBaggage(e10, tA.createBaggage(s2));
        }
        fields() {
          return [n0];
        }
      }
      function n2(e10) {
        let t10 = {};
        if ("object" != typeof e10 || null == e10) return t10;
        for (let r10 in e10) {
          var n10;
          if (!Object.prototype.hasOwnProperty.call(e10, r10)) continue;
          if ("string" != typeof (n10 = r10) || "" === n10) {
            nV.warn(`Invalid attribute key: ${r10}`);
            continue;
          }
          let i3 = e10[r10];
          if (!n4(i3)) {
            nV.warn(`Invalid attribute value set for key: ${r10}`);
            continue;
          }
          Array.isArray(i3) ? t10[r10] = i3.slice() : t10[r10] = i3;
        }
        return t10;
      }
      function n4(e10) {
        return null == e10 || (Array.isArray(e10) ? function(e11) {
          let t10;
          for (let n10 of e11) {
            if (null == n10) continue;
            let e12 = typeof n10;
            if (e12 !== t10) {
              if (!t10 && n5(e12)) {
                t10 = e12;
                continue;
              }
              return false;
            }
          }
          return true;
        }(e10) : n5(typeof e10));
      }
      function n5(e10) {
        switch (e10) {
          case "number":
          case "boolean":
          case "string":
            return true;
        }
        return false;
      }
      function n3(e10) {
        try {
          var t10;
          nV.error((t10 = e10, "string" == typeof t10 ? t10 : JSON.stringify(function(e11) {
            let t11 = {}, n10 = e11;
            for (; null !== n10; ) Object.getOwnPropertyNames(n10).forEach((e12) => {
              if (t11[e12]) return;
              let r10 = n10[e12];
              r10 && (t11[e12] = String(r10));
            }), n10 = Object.getPrototypeOf(n10);
            return t11;
          }(t10))));
        } catch {
        }
      }
      function n9(e10) {
        let t10 = process.env[e10];
        if (null == t10 || "" === t10.trim()) return;
        let n10 = Number(t10);
        return isNaN(n10) ? void nV.warn(`Unknown value ${JSON.stringify(t10, null, 2)} for ${e10}, expected a number, using defaults`) : n10;
      }
      let n6 = "http.method", n8 = "http.url", n7 = "http.status_code", re = "exception.message", rt = "exception.type", rn = "http.request.method", rr = "http.response.status_code", ri = "url.full", rs = performance;
      function ra(e10) {
        return [Math.trunc(e10 / 1e3), Math.round(e10 % 1e3 * 1e6)];
      }
      function ro(e10) {
        return Array.isArray(e10) && 2 === e10.length && "number" == typeof e10[0] && "number" == typeof e10[1];
      }
      function ru(e10) {
        return ro(e10) || "number" == typeof e10 || e10 instanceof Date;
      }
      function rc(e10, t10) {
        let n10 = [e10[0] + t10[0], e10[1] + t10[1]];
        return n10[1] >= 1e9 && (n10[1] -= 1e9, n10[0] += 1), n10;
      }
      let rl = "[_0-9a-z-*/]", rp = `[a-z]${rl}{0,255}`, rd = `[a-z0-9]${rl}{0,240}@[a-z]${rl}{0,13}`, rf = RegExp(`^(?:${rp}|${rd})$`), r_ = /^[ -~]{0,255}[!-~]$/, rh = /,|=/;
      class rg {
        __init() {
          this._internalState = /* @__PURE__ */ new Map();
        }
        constructor(e10) {
          rg.prototype.__init.call(this), e10 && this._parse(e10);
        }
        set(e10, t10) {
          let n10 = this._clone();
          return n10._internalState.has(e10) && n10._internalState.delete(e10), n10._internalState.set(e10, t10), n10;
        }
        unset(e10) {
          let t10 = this._clone();
          return t10._internalState.delete(e10), t10;
        }
        get(e10) {
          return this._internalState.get(e10);
        }
        serialize() {
          return this._keys().reduce((e10, t10) => (e10.push(t10 + "=" + this.get(t10)), e10), []).join(",");
        }
        _parse(e10) {
          !(e10.length > 512) && (this._internalState = e10.split(",").reverse().reduce((e11, t10) => {
            let n10 = t10.trim(), r10 = n10.indexOf("=");
            if (-1 !== r10) {
              let i3 = n10.slice(0, r10), s2 = n10.slice(r10 + 1, t10.length);
              rf.test(i3) && r_.test(s2) && !rh.test(s2) && e11.set(i3, s2);
            }
            return e11;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }
        _keys() {
          return Array.from(this._internalState.keys()).reverse();
        }
        _clone() {
          let e10 = new rg();
          return e10._internalState = new Map(this._internalState), e10;
        }
      }
      let rm = Function.prototype.toString, rE = rm.call(Object), rS = Object.getPrototypeOf, rv = Object.prototype, rT = rv.hasOwnProperty, ry = Symbol ? Symbol.toStringTag : void 0, rR = rv.toString;
      function rA(e10) {
        var t10, n10, r10;
        if (null == (t10 = e10) || "object" != typeof t10 || "[object Object]" !== (null == (n10 = e10) ? void 0 === n10 ? "[object Undefined]" : "[object Null]" : ry && ry in Object(n10) ? function(e11) {
          let t11 = rT.call(e11, ry), n11 = e11[ry], r11 = false;
          try {
            e11[ry] = void 0, r11 = true;
          } catch {
          }
          let i4 = rR.call(e11);
          return r11 && (t11 ? e11[ry] = n11 : delete e11[ry]), i4;
        }(n10) : (r10 = n10, rR.call(r10)))) return false;
        let i3 = rS(e10);
        if (null === i3) return true;
        let s2 = rT.call(i3, "constructor") && i3.constructor;
        return "function" == typeof s2 && s2 instanceof s2 && rm.call(s2) === rE;
      }
      function rI(e10) {
        return rO(e10) ? e10.slice() : e10;
      }
      function rb(e10, t10, n10) {
        let r10 = n10.get(e10[t10]) || [];
        for (let n11 = 0, i3 = r10.length; n11 < i3; n11++) {
          let i4 = r10[n11];
          if (i4.key === t10 && i4.obj === e10) return true;
        }
        return false;
      }
      function rO(e10) {
        return Array.isArray(e10);
      }
      function rC(e10) {
        return "function" == typeof e10;
      }
      function rN(e10) {
        return !rL(e10) && !rO(e10) && !rC(e10) && "object" == typeof e10;
      }
      function rL(e10) {
        return "string" == typeof e10 || "number" == typeof e10 || "boolean" == typeof e10 || void 0 === e10 || e10 instanceof Date || e10 instanceof RegExp || null === e10;
      }
      class rP {
        __init() {
          this.attributes = {};
        }
        __init2() {
          this.links = [];
        }
        __init3() {
          this.events = [];
        }
        __init4() {
          this._droppedAttributesCount = 0;
        }
        __init5() {
          this._droppedEventsCount = 0;
        }
        __init6() {
          this._droppedLinksCount = 0;
        }
        __init7() {
          this.status = { code: l.UNSET };
        }
        __init8() {
          this.endTime = [0, 0];
        }
        __init9() {
          this._ended = false;
        }
        __init10() {
          this._duration = [-1, -1];
        }
        constructor(e10) {
          rP.prototype.__init.call(this), rP.prototype.__init2.call(this), rP.prototype.__init3.call(this), rP.prototype.__init4.call(this), rP.prototype.__init5.call(this), rP.prototype.__init6.call(this), rP.prototype.__init7.call(this), rP.prototype.__init8.call(this), rP.prototype.__init9.call(this), rP.prototype.__init10.call(this);
          const t10 = Date.now();
          this._spanContext = e10.spanContext, this._performanceStartTime = rs.now(), this._performanceOffset = t10 - (this._performanceStartTime + rs.timeOrigin), this._startTimeProvided = null != e10.startTime, this._spanLimits = e10.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = e10.spanProcessor, this.name = e10.name, this.parentSpanContext = e10.parentSpanContext, this.kind = e10.kind, this.links = e10.links || [], this.startTime = this._getTime(e10.startTime ?? t10), this.resource = e10.resource, this.instrumentationScope = e10.scope, null != e10.attributes && this.setAttributes(e10.attributes), this._spanProcessor.onStart(this, e10.context);
        }
        spanContext() {
          return this._spanContext;
        }
        setAttribute(e10, t10) {
          if (null == t10 || this._isSpanEnded()) return this;
          if (0 === e10.length) return nV.warn(`Invalid attribute key: ${e10}`), this;
          if (!n4(t10)) return nV.warn(`Invalid attribute value set for key: ${e10}`), this;
          let { attributeCountLimit: n10 } = this._spanLimits;
          return void 0 !== n10 && Object.keys(this.attributes).length >= n10 && !Object.prototype.hasOwnProperty.call(this.attributes, e10) ? this._droppedAttributesCount++ : this.attributes[e10] = this._truncateToSize(t10), this;
        }
        setAttributes(e10) {
          for (let [t10, n10] of Object.entries(e10)) this.setAttribute(t10, n10);
          return this;
        }
        addEvent(e10, t10, n10) {
          if (this._isSpanEnded()) return this;
          let { eventCountLimit: r10 } = this._spanLimits;
          if (0 === r10) return nV.warn("No events allowed."), this._droppedEventsCount++, this;
          void 0 !== r10 && this.events.length >= r10 && (0 === this._droppedEventsCount && nV.debug("Dropping extra events."), this.events.shift(), this._droppedEventsCount++), ru(t10) && (ru(n10) || (n10 = t10), t10 = void 0);
          let i3 = n2(t10);
          return this.events.push({ name: e10, attributes: i3, time: this._getTime(n10), droppedAttributesCount: 0 }), this;
        }
        addLink(e10) {
          return this.links.push(e10), this;
        }
        addLinks(e10) {
          return this.links.push(...e10), this;
        }
        setStatus(e10) {
          return this._isSpanEnded() || (this.status = { ...e10 }, null != this.status.message && "string" != typeof e10.message && (nV.warn(`Dropping invalid status.message of type '${typeof e10.message}', expected 'string'`), delete this.status.message)), this;
        }
        updateName(e10) {
          return this._isSpanEnded() || (this.name = e10), this;
        }
        end(e10) {
          var t10, n10;
          let r10, i3;
          this._isSpanEnded() ? nV.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`) : (this.endTime = this._getTime(e10), this._duration = (t10 = this.startTime, r10 = (n10 = this.endTime)[0] - t10[0], (i3 = n10[1] - t10[1]) < 0 && (r10 -= 1, i3 += 1e9), [r10, i3]), this._duration[0] < 0 && (nV.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0]), this._droppedEventsCount > 0 && nV.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`), this._spanProcessor.onEnding && this._spanProcessor.onEnding(this), this._ended = true, this._spanProcessor.onEnd(this));
        }
        _getTime(e10) {
          if ("number" == typeof e10 && e10 <= rs.now()) {
            var t10;
            return t10 = e10 + this._performanceOffset, rc(ra(rs.timeOrigin), ra("number" == typeof t10 ? t10 : rs.now()));
          }
          if ("number" == typeof e10) return ra(e10);
          if (e10 instanceof Date) return ra(e10.getTime());
          if (ro(e10)) return e10;
          if (this._startTimeProvided) return ra(Date.now());
          let n10 = rs.now() - this._performanceStartTime;
          return rc(this.startTime, ra(n10));
        }
        isRecording() {
          return false === this._ended;
        }
        recordException(e10, t10) {
          let n10 = {};
          "string" == typeof e10 ? n10[re] = e10 : e10 && (e10.code ? n10[rt] = e10.code.toString() : e10.name && (n10[rt] = e10.name), e10.message && (n10[re] = e10.message), e10.stack && (n10["exception.stacktrace"] = e10.stack)), n10[rt] || n10[re] ? this.addEvent("exception", n10, t10) : nV.warn(`Failed to record an exception ${e10}`);
        }
        get duration() {
          return this._duration;
        }
        get ended() {
          return this._ended;
        }
        get droppedAttributesCount() {
          return this._droppedAttributesCount;
        }
        get droppedEventsCount() {
          return this._droppedEventsCount;
        }
        get droppedLinksCount() {
          return this._droppedLinksCount;
        }
        _isSpanEnded() {
          if (this._ended) {
            let e10 = Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
            nV.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, e10);
          }
          return this._ended;
        }
        _truncateToLimitUtil(e10, t10) {
          return e10.length <= t10 ? e10 : e10.substring(0, t10);
        }
        _truncateToSize(e10) {
          let t10 = this._attributeValueLengthLimit;
          return t10 <= 0 ? (nV.warn(`Attribute value limit must be positive, got ${t10}`), e10) : "string" == typeof e10 ? this._truncateToLimitUtil(e10, t10) : Array.isArray(e10) ? e10.map((e11) => "string" == typeof e11 ? this._truncateToLimitUtil(e11, t10) : e11) : e10;
        }
      }
      (y = f || (f = {}))[y.NOT_RECORD = 0] = "NOT_RECORD", y[y.RECORD = 1] = "RECORD", y[y.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
      class rw {
        shouldSample() {
          return { decision: f.NOT_RECORD };
        }
        toString() {
          return "AlwaysOffSampler";
        }
      }
      class rD {
        shouldSample() {
          return { decision: f.RECORD_AND_SAMPLED };
        }
        toString() {
          return "AlwaysOnSampler";
        }
      }
      class rM {
        constructor(e10) {
          this._root = e10.root, this._root || (n3(Error("ParentBasedSampler must have a root sampler configured")), this._root = new rD()), this._remoteParentSampled = e10.remoteParentSampled ?? new rD(), this._remoteParentNotSampled = e10.remoteParentNotSampled ?? new rw(), this._localParentSampled = e10.localParentSampled ?? new rD(), this._localParentNotSampled = e10.localParentNotSampled ?? new rw();
        }
        shouldSample(e10, t10, n10, r10, i3, s2) {
          let a2 = to.getSpanContext(e10);
          return a2 && e8(a2) ? a2.isRemote ? a2.traceFlags & u.SAMPLED ? this._remoteParentSampled.shouldSample(e10, t10, n10, r10, i3, s2) : this._remoteParentNotSampled.shouldSample(e10, t10, n10, r10, i3, s2) : a2.traceFlags & u.SAMPLED ? this._localParentSampled.shouldSample(e10, t10, n10, r10, i3, s2) : this._localParentNotSampled.shouldSample(e10, t10, n10, r10, i3, s2) : this._root.shouldSample(e10, t10, n10, r10, i3, s2);
        }
        toString() {
          return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
        }
      }
      class rU {
        constructor(e10 = 0) {
          this._ratio = this._normalize(e10), this._upperBound = Math.floor(4294967295 * this._ratio);
        }
        shouldSample(e10, t10) {
          return { decision: e6(t10) && this._accumulate(t10) < this._upperBound ? f.RECORD_AND_SAMPLED : f.NOT_RECORD };
        }
        toString() {
          return `TraceIdRatioBased{${this._ratio}}`;
        }
        _normalize(e10) {
          return "number" != typeof e10 || isNaN(e10) ? 0 : e10 >= 1 ? 1 : e10 <= 0 ? 0 : e10;
        }
        _accumulate(e10) {
          let t10 = 0;
          for (let n10 = 0; n10 < e10.length / 8; n10++) {
            let r10 = 8 * n10;
            t10 = (t10 ^ parseInt(e10.slice(r10, r10 + 8), 16)) >>> 0;
          }
          return t10;
        }
      }
      function rx() {
        return { sampler: rB(), forceFlushTimeoutMillis: 3e4, generalLimits: { attributeValueLengthLimit: n9("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0, attributeCountLimit: n9("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128 }, spanLimits: { attributeValueLengthLimit: n9("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0, attributeCountLimit: n9("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128, linkCountLimit: n9("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128, eventCountLimit: n9("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128, attributePerEventCountLimit: n9("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128, attributePerLinkCountLimit: n9("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128 } };
      }
      function rB() {
        let e10 = function(e11) {
          let t10 = process.env[e11];
          if (null != t10 && "" !== t10.trim()) return t10;
        }("OTEL_TRACES_SAMPLER") ?? _.ParentBasedAlwaysOn;
        switch (e10) {
          case _.AlwaysOn:
            return new rD();
          case _.AlwaysOff:
            return new rw();
          case _.ParentBasedAlwaysOn:
            return new rM({ root: new rD() });
          case _.ParentBasedAlwaysOff:
            return new rM({ root: new rw() });
          case _.TraceIdRatio:
            return new rU(rk());
          case _.ParentBasedTraceIdRatio:
            return new rM({ root: new rU(rk()) });
          default:
            return nV.error(`OTEL_TRACES_SAMPLER value "${e10}" invalid, defaulting to "${_.ParentBasedAlwaysOn}".`), new rM({ root: new rD() });
        }
      }
      function rk() {
        let e10 = n9("OTEL_TRACES_SAMPLER_ARG");
        return null == e10 ? (nV.error("OTEL_TRACES_SAMPLER_ARG is blank, defaulting to 1."), 1) : e10 < 0 || e10 > 1 ? (nV.error(`OTEL_TRACES_SAMPLER_ARG=${e10} was given, but it is out of range ([0..1]), defaulting to 1.`), 1) : e10;
      }
      (R = _ || (_ = {})).AlwaysOff = "always_off", R.AlwaysOn = "always_on", R.ParentBasedAlwaysOff = "parentbased_always_off", R.ParentBasedAlwaysOn = "parentbased_always_on", R.ParentBasedTraceIdRatio = "parentbased_traceidratio", R.TraceIdRatio = "traceidratio";
      let r$ = 1 / 0;
      class rF {
        constructor() {
          rF.prototype.__init.call(this), rF.prototype.__init2.call(this);
        }
        __init() {
          this.generateTraceId = rj(16);
        }
        __init2() {
          this.generateSpanId = rj(8);
        }
      }
      let rG = tD.Buffer.allocUnsafe(16);
      function rj(e10) {
        return function() {
          for (let t10 = 0; t10 < e10 / 4; t10++) rG.writeUInt32BE(4294967296 * Math.random() >>> 0, 4 * t10);
          for (let t10 = 0; t10 < e10; t10++) if (rG[t10] > 0) break;
          else t10 === e10 - 1 && (rG[e10 - 1] = 1);
          return rG.toString("hex", 0, e10);
        };
      }
      class rV {
        constructor(e10, t10, n10, r10) {
          const i3 = function(e11) {
            let t11 = { sampler: rB() }, n11 = rx(), r11 = Object.assign({}, n11, t11, e11);
            return r11.generalLimits = Object.assign({}, n11.generalLimits, e11.generalLimits || {}), r11.spanLimits = Object.assign({}, n11.spanLimits, e11.spanLimits || {}), r11;
          }(t10);
          this._sampler = i3.sampler, this._generalLimits = i3.generalLimits, this._spanLimits = i3.spanLimits, this._idGenerator = t10.idGenerator || new rF(), this._resource = n10, this._spanProcessor = r10, this.instrumentationScope = e10;
        }
        startSpan(e10, t10 = {}, n10 = J.active()) {
          let r10, i3, s2;
          t10.root && (n10 = to.deleteSpan(n10));
          let a2 = to.getSpan(n10);
          if (nQ(n10)) return nV.debug("Instrumentation suppressed, returning Noop Span"), to.wrapSpanContext(eJ);
          let o2 = a2?.spanContext(), l2 = this._idGenerator.generateSpanId();
          o2 && to.isSpanContextValid(o2) ? (i3 = o2.traceId, s2 = o2.traceState, r10 = o2) : i3 = this._idGenerator.generateTraceId();
          let p2 = t10.kind ?? c.INTERNAL, f2 = (t10.links ?? []).map((e11) => ({ context: e11.context, attributes: n2(e11.attributes) })), _2 = n2(t10.attributes), h2 = this._sampler.shouldSample(n10, i3, e10, p2, _2, f2);
          s2 = h2.traceState ?? s2;
          let g2 = { traceId: i3, spanId: l2, traceFlags: h2.decision === d.RECORD_AND_SAMPLED ? u.SAMPLED : u.NONE, traceState: s2 };
          if (h2.decision === d.NOT_RECORD) return nV.debug("Recording is off, propagating context in a non-recording span"), to.wrapSpanContext(g2);
          let m2 = n2(Object.assign(_2, h2.attributes));
          return new rP({ resource: this._resource, scope: this.instrumentationScope, context: n10, spanContext: g2, name: e10, kind: p2, links: f2, parentSpanContext: r10, attributes: m2, startTime: t10.startTime, spanProcessor: this._spanProcessor, spanLimits: this._spanLimits });
        }
        startActiveSpan(e10, t10, n10, r10) {
          let i3, s2, a2;
          if (arguments.length < 2) return;
          2 == arguments.length ? a2 = t10 : 3 == arguments.length ? (i3 = t10, a2 = n10) : (i3 = t10, s2 = n10, a2 = r10);
          let o2 = s2 ?? J.active(), u2 = this.startSpan(e10, i3, o2), c2 = to.setSpan(o2, u2);
          return J.with(c2, a2, void 0, u2);
        }
        getGeneralLimits() {
          return this._generalLimits;
        }
        getSpanLimits() {
          return this._spanLimits;
        }
      }
      class rY {
        constructor(e10) {
          this._spanProcessors = e10;
        }
        forceFlush() {
          let e10 = [];
          for (let t10 of this._spanProcessors) e10.push(t10.forceFlush());
          return new Promise((t10) => {
            Promise.all(e10).then(() => {
              t10();
            }).catch((e11) => {
              n3(e11 || Error("MultiSpanProcessor: forceFlush failed")), t10();
            });
          });
        }
        onStart(e10, t10) {
          for (let n10 of this._spanProcessors) n10.onStart(e10, t10);
        }
        onEnding(e10) {
          for (let t10 of this._spanProcessors) t10.onEnding && t10.onEnding(e10);
        }
        onEnd(e10) {
          for (let t10 of this._spanProcessors) t10.onEnd(e10);
        }
        shutdown() {
          let e10 = [];
          for (let t10 of this._spanProcessors) e10.push(t10.shutdown());
          return new Promise((t10, n10) => {
            Promise.all(e10).then(() => {
              t10();
            }, n10);
          });
        }
      }
      (A = h || (h = {}))[A.resolved = 0] = "resolved", A[A.timeout = 1] = "timeout", A[A.error = 2] = "error", A[A.unresolved = 3] = "unresolved";
      class rH {
        __init() {
          this._tracers = /* @__PURE__ */ new Map();
        }
        constructor(e10 = {}) {
          rH.prototype.__init.call(this);
          const t10 = function(...e11) {
            let t11 = e11.shift(), n11 = /* @__PURE__ */ new WeakMap();
            for (; e11.length > 0; ) t11 = function e12(t12, n12, r10 = 0, i3) {
              let s2;
              if (!(r10 > 20)) {
                if (r10++, rL(t12) || rL(n12) || rC(n12)) s2 = rI(n12);
                else if (rO(t12)) {
                  if (s2 = t12.slice(), rO(n12)) for (let e13 = 0, t13 = n12.length; e13 < t13; e13++) s2.push(rI(n12[e13]));
                  else if (rN(n12)) {
                    let e13 = Object.keys(n12);
                    for (let t13 = 0, r11 = e13.length; t13 < r11; t13++) {
                      let r12 = e13[t13];
                      s2[r12] = rI(n12[r12]);
                    }
                  }
                } else if (rN(t12)) if (rN(n12)) {
                  var a2, o2;
                  if (a2 = t12, o2 = n12, !(rA(a2) && rA(o2))) return n12;
                  s2 = Object.assign({}, t12);
                  let u2 = Object.keys(n12);
                  for (let a3 = 0, o3 = u2.length; a3 < o3; a3++) {
                    let o4 = u2[a3], c2 = n12[o4];
                    if (rL(c2)) void 0 === c2 ? delete s2[o4] : s2[o4] = c2;
                    else {
                      let a4 = s2[o4];
                      if (rb(t12, o4, i3) || rb(n12, o4, i3)) delete s2[o4];
                      else {
                        if (rN(a4) && rN(c2)) {
                          let e13 = i3.get(a4) || [], r11 = i3.get(c2) || [];
                          e13.push({ obj: t12, key: o4 }), r11.push({ obj: n12, key: o4 }), i3.set(a4, e13), i3.set(c2, r11);
                        }
                        s2[o4] = e12(s2[o4], c2, r10, i3);
                      }
                    }
                  }
                } else s2 = n12;
                return s2;
              }
            }(t11, e11.shift(), 0, n11);
            return t11;
          }({}, rx(), function(e11) {
            let t11 = Object.assign({}, e11.spanLimits);
            return t11.attributeCountLimit = e11.spanLimits?.attributeCountLimit ?? e11.generalLimits?.attributeCountLimit ?? n9("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? n9("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128, t11.attributeValueLengthLimit = e11.spanLimits?.attributeValueLengthLimit ?? e11.generalLimits?.attributeValueLengthLimit ?? n9("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? n9("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? r$, Object.assign({}, e11, { spanLimits: t11 });
          }(e10));
          this._resource = t10.resource ?? nK(), this._config = Object.assign({}, t10, { resource: this._resource });
          const n10 = [];
          e10.spanProcessors?.length && n10.push(...e10.spanProcessors), this._activeSpanProcessor = new rY(n10);
        }
        getTracer(e10, t10, n10) {
          let r10 = `${e10}@${t10 || ""}:${n10?.schemaUrl || ""}`;
          return this._tracers.has(r10) || this._tracers.set(r10, new rV({ name: e10, version: t10, schemaUrl: n10?.schemaUrl }, this._config, this._resource, this._activeSpanProcessor)), this._tracers.get(r10);
        }
        forceFlush() {
          let e10 = this._config.forceFlushTimeoutMillis, t10 = this._activeSpanProcessor._spanProcessors.map((t11) => new Promise((n10) => {
            let r10, i3 = setTimeout(() => {
              n10(Error(`Span processor did not completed within timeout period of ${e10} ms`)), r10 = h.timeout;
            }, e10);
            t11.forceFlush().then(() => {
              clearTimeout(i3), r10 !== h.timeout && n10(r10 = h.resolved);
            }).catch((e11) => {
              clearTimeout(i3), r10 = h.error, n10(e11);
            });
          }));
          return new Promise((e11, n10) => {
            Promise.all(t10).then((t11) => {
              let r10 = t11.filter((e12) => e12 !== h.resolved);
              r10.length > 0 ? n10(r10) : e11();
            }).catch((e12) => n10([e12]));
          });
        }
        shutdown() {
          return this._activeSpanProcessor.shutdown();
        }
      }
      let rz = "sentry.parentIsRemote";
      function rW(e10) {
        return "parentSpanId" in e10 ? e10.parentSpanId : "parentSpanContext" in e10 ? e10.parentSpanContext?.spanId : void 0;
      }
      function rK(e10) {
        return !!e10.attributes && "object" == typeof e10.attributes;
      }
      let rq = "sentry-trace", rJ = "baggage", rX = "sentry.dsc", rZ = "sentry.sampled_not_recording", rQ = "sentry.url", r0 = a("sentry_scopes"), r1 = a("sentry_fork_isolation_scope"), r2 = a("sentry_fork_set_scope"), r4 = a("sentry_fork_set_isolation_scope"), r5 = "_scopeContext";
      function r3(e10) {
        return e10.getValue(r0);
      }
      function r9(e10, t10) {
        return e10.setValue(r0, t10);
      }
      function r6(e10) {
        let { traceFlags: t10, traceState: n10 } = e10, r10 = !!n10 && "1" === n10.get(rZ);
        if (t10 === u.SAMPLED) return true;
        if (r10) return false;
        let i3 = n10 ? n10.get(rX) : void 0, s2 = i3 ? (0, ew.baggageHeaderToDynamicSamplingContext)(i3) : void 0;
        return s2?.sampled === "true" || s2?.sampled !== "false" && void 0;
      }
      function r8(e10, t10, n10) {
        let r10 = t10[rn] || t10[n6];
        if (r10) return function({ name: e11, kind: t11, attributes: n11 }, r11) {
          var i4, s3;
          let a3, o3, u2, l2, p2, d2, f2, _2 = ["http"];
          switch (t11) {
            case c.CLIENT:
              _2.push("client");
              break;
            case c.SERVER:
              _2.push("server");
          }
          n11["sentry.http.prefetch"] && _2.push("prefetch");
          let { urlPath: h2, url: g2, query: m2, fragment: E2, hasRoute: S2 } = (i4 = n11, s3 = t11, a3 = i4["http.target"], o3 = i4[n8] || i4[ri], u2 = i4["http.route"], p2 = (l2 = "string" == typeof o3 ? ey(o3) : void 0) ? eA(l2) : void 0, d2 = l2?.search || void 0, f2 = l2?.hash || void 0, "string" == typeof u2 ? { urlPath: u2, url: p2, query: d2, fragment: f2, hasRoute: true } : s3 === c.SERVER && "string" == typeof a3 ? { urlPath: eR(a3), url: p2, query: d2, fragment: f2, hasRoute: false } : l2 ? { urlPath: p2, url: p2, query: d2, fragment: f2, hasRoute: false } : "string" == typeof a3 ? { urlPath: eR(a3), url: p2, query: d2, fragment: f2, hasRoute: false } : { urlPath: void 0, url: p2, query: d2, fragment: f2, hasRoute: false });
          if (!h2) return { ...ie(e11, n11), op: _2.join(".") };
          let v2 = n11["sentry.graphql.operation"], T2 = `${r11} ${h2}`, y2 = v2 ? `${T2} (${function(e12) {
            if (Array.isArray(e12)) {
              let t12 = e12.slice().sort();
              return t12.length <= 5 ? t12.join(", ") : `${t12.slice(0, 5).join(", ")}, +${t12.length - 5}`;
            }
            return `${e12}`;
          }(v2)})` : T2, R2 = {};
          g2 && (R2.url = g2), m2 && (R2["http.query"] = m2), E2 && (R2["http.fragment"] = E2);
          let A2 = t11 === c.CLIENT || t11 === c.SERVER, I2 = n11[eg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN] || "manual", b2 = !`${I2}`.startsWith("auto"), O2 = "custom" === n11[eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE], C2 = n11[eg.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME], { description: N2, source: L2 } = O2 || null != C2 || !A2 && b2 ? ie(e11, n11) : { description: y2, source: S2 || "/" === h2 ? "route" : "url" };
          return { op: _2.join("."), description: N2, source: L2, data: R2 };
        }({ attributes: t10, name: e10, kind: n10 }, r10);
        let i3 = t10["db.system.name"] || t10["db.system"], s2 = "string" == typeof t10[eg.SEMANTIC_ATTRIBUTE_SENTRY_OP] && t10[eg.SEMANTIC_ATTRIBUTE_SENTRY_OP].startsWith("cache.");
        if (i3 && !s2) return function({ attributes: e11, name: t11 }) {
          let n11 = e11[eg.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
          if ("string" == typeof n11) return { op: "db", description: n11, source: e11[eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] || "custom" };
          if ("custom" === e11[eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]) return { op: "db", description: t11, source: "custom" };
          let r11 = e11["db.statement"];
          return { op: "db", description: r11 ? r11.toString() : t11, source: "task" };
        }({ attributes: t10, name: e10 });
        let a2 = "custom" === t10[eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] ? "custom" : "route";
        if (t10["rpc.service"]) return { ...ie(e10, t10, "route"), op: "rpc" };
        if (t10["messaging.system"]) return { ...ie(e10, t10, a2), op: "message" };
        let o2 = t10["faas.trigger"];
        return o2 ? { ...ie(e10, t10, a2), op: o2.toString() } : { op: void 0, description: e10, source: "custom" };
      }
      function r7(e10) {
        let t10 = rK(e10) ? e10.attributes : {};
        return r8(e10.name ? e10.name : "<unknown>", t10, "number" == typeof e10.kind ? e10.kind : c.INTERNAL);
      }
      function ie(e10, t10, n10 = "custom") {
        let r10 = t10[eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] || n10, i3 = t10[eg.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
        return i3 && "string" == typeof i3 ? { description: i3, source: r10 } : { description: e10, source: r10 };
      }
      function it() {
        return to.getActiveSpan();
      }
      let ir = "u" < typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__;
      function ii({ dsc: e10, sampled: t10 }) {
        let n10 = e10 ? (0, ew.dynamicSamplingContextToSentryBaggageHeader)(e10) : void 0, r10 = new rg(), i3 = n10 ? r10.set(rX, n10) : r10;
        return false === t10 ? i3.set(rZ, "1") : i3;
      }
      let is = /* @__PURE__ */ new Set();
      function ia(e10) {
        is.add(e10);
      }
      class io extends n1 {
        constructor() {
          super(), ia("SentryPropagator"), this._urlMatchesTargetsMap = new eM(100);
        }
        inject(e10, t10, n10) {
          if (nQ(e10)) {
            ir && Q.debug.log("[Tracing] Not injecting trace data for url because tracing is suppressed.");
            return;
          }
          let r10 = to.getSpan(e10), i3 = r10 && function(e11) {
            let t11 = (0, el.spanToJSON)(e11).data, n11 = t11[n8] || t11[ri];
            if ("string" == typeof n11) return n11;
            let r11 = e11.spanContext().traceState?.get(rQ);
            if (r11) return r11;
          }(r10), { tracePropagationTargets: s2, propagateTraceparent: a2 } = (0, eE.getClient)()?.getOptions() || {};
          if (!function(e11, t11, n11) {
            if ("string" != typeof e11 || !t11) return true;
            let r11 = n11?.get(e11);
            if (void 0 !== r11) return ir && !r11 && Q.debug.log(iu, e11), r11;
            let i4 = (0, ex.stringMatchesSomePattern)(e11, t11);
            return n11?.set(e11, i4), ir && !i4 && Q.debug.log(iu, e11), i4;
          }(i3, s2, this._urlMatchesTargetsMap)) {
            ir && Q.debug.log("[Tracing] Not injecting trace data for url because it does not match tracePropagationTargets:", i3);
            return;
          }
          let o2 = function(e11) {
            try {
              let t11 = e11[rJ];
              return Array.isArray(t11) ? t11.join(",") : t11;
            } catch {
              return;
            }
          }(t10), u2 = tA.getBaggage(e10) || tA.createBaggage({}), { dynamicSamplingContext: c2, traceId: l2, spanId: p2, sampled: d2 } = ic(e10);
          if (o2) {
            let e11 = (0, ew.parseBaggageHeader)(o2);
            e11 && Object.entries(e11).forEach(([e12, t11]) => {
              u2 = u2.setEntry(e12, { value: t11 });
            });
          }
          c2 && (u2 = Object.entries(c2).reduce((e11, [t11, n11]) => n11 ? e11.setEntry(`${ew.SENTRY_BAGGAGE_KEY_PREFIX}${t11}`, { value: n11 }) : e11, u2)), l2 && l2 !== eq && (n10.set(t10, rq, (0, eU.generateSentryTraceHeader)(l2, p2, d2)), a2 && n10.set(t10, "traceparent", (0, eU.generateTraceparentHeader)(l2, p2, d2))), super.inject(tA.setBaggage(e10, u2), t10, n10);
        }
        extract(e10, t10, n10) {
          let r10 = n10.get(t10, rq), i3 = n10.get(t10, rJ);
          return ip(il(e10, { sentryTrace: r10 ? Array.isArray(r10) ? r10[0] : r10 : void 0, baggage: i3 }));
        }
        fields() {
          return [rq, rJ, "traceparent"];
        }
      }
      let iu = "[Tracing] Not injecting trace data for url because it does not match tracePropagationTargets:";
      function ic(e10, t10 = {}) {
        let n10 = to.getSpan(e10);
        if (n10?.spanContext().isRemote) {
          let e11 = n10.spanContext();
          return { dynamicSamplingContext: (0, eB.getDynamicSamplingContextFromSpan)(n10), traceId: e11.traceId, spanId: void 0, sampled: r6(e11) };
        }
        if (n10) {
          let e11 = n10.spanContext();
          return { dynamicSamplingContext: (0, eB.getDynamicSamplingContextFromSpan)(n10), traceId: e11.traceId, spanId: e11.spanId, sampled: r6(e11) };
        }
        let r10 = t10.scope || r3(e10)?.scope || (0, eE.getCurrentScope)(), i3 = t10.client || (0, eE.getClient)(), s2 = r10.getPropagationContext();
        return { dynamicSamplingContext: i3 ? (0, eB.getDynamicSamplingContextFromScope)(i3, r10) : void 0, traceId: s2.traceId, spanId: s2.propagationSpanId, sampled: s2.sampled };
      }
      function il(e10, { sentryTrace: t10, baggage: n10 }) {
        let { traceId: r10, parentSpanId: i3, sampled: s2, dsc: a2 } = (0, eU.propagationContextFromHeaders)(t10, n10), o2 = (0, eE.getClient)(), c2 = (0, ew.baggageHeaderToDynamicSamplingContext)(n10);
        if (!i3 || o2 && !(0, eU.shouldContinueTrace)(o2, c2?.org_id)) return e10;
        let l2 = function({ spanId: e11, traceId: t11, sampled: n11, dsc: r11 }) {
          let i4 = ii({ dsc: r11, sampled: n11 });
          return { traceId: t11, spanId: e11, isRemote: true, traceFlags: n11 ? u.SAMPLED : u.NONE, traceState: i4 };
        }({ traceId: r10, spanId: i3, sampled: s2, dsc: a2 });
        return to.setSpanContext(e10, l2);
      }
      function ip(e10) {
        let t10 = r3(e10);
        return r9(e10, { scope: t10 ? t10.scope : (0, eE.getCurrentScope)().clone(), isolationScope: t10 ? t10.isolationScope : (0, eE.getIsolationScope)() });
      }
      function id(e10, t10, n10) {
        let r10 = iE(), { name: i3, parentSpan: s2 } = e10;
        return iy(s2)(() => {
          let s3 = iv(e10.scope, e10.forceTransaction), a2 = e10.onlyIfParent && !to.getSpan(s3) ? nZ(s3) : s3, o2 = iS(e10);
          if (!(0, eD.hasSpansEnabled)()) {
            let e11 = nQ(a2) ? a2 : nZ(a2);
            return J.with(e11, () => r10.startActiveSpan(i3, o2, e11, (e12) => J.with(s3, () => (0, ek.handleCallbackErrors)(() => t10(e12), () => {
              void 0 === (0, el.spanToJSON)(e12).status && e12.setStatus({ code: l.ERROR });
            }, n10 ? () => e12.end() : void 0))));
          }
          return r10.startActiveSpan(i3, o2, a2, (e11) => (0, ek.handleCallbackErrors)(() => t10(e11), () => {
            void 0 === (0, el.spanToJSON)(e11).status && e11.setStatus({ code: l.ERROR });
          }, n10 ? () => e11.end() : void 0));
        });
      }
      function i_(e10, t10) {
        return id(e10, t10, true);
      }
      function ih(e10, t10) {
        return id(e10, (e11) => t10(e11, () => e11.end()), false);
      }
      function ig(e10) {
        let t10 = iE(), { name: n10, parentSpan: r10 } = e10;
        return iy(r10)(() => {
          let r11 = iv(e10.scope, e10.forceTransaction), i3 = e10.onlyIfParent && !to.getSpan(r11) ? nZ(r11) : r11, s2 = iS(e10);
          return (0, eD.hasSpansEnabled)() || (i3 = nQ(i3) ? i3 : nZ(i3)), t10.startSpan(n10, s2, i3);
        });
      }
      function im(e10, t10) {
        let n10 = e10 ? to.setSpan(J.active(), e10) : to.deleteSpan(J.active());
        return J.with(n10, () => t10((0, eE.getCurrentScope)()));
      }
      function iE() {
        let e10 = (0, eE.getClient)();
        return e10?.tracer || to.getTracer("@sentry/opentelemetry", e_.SDK_VERSION);
      }
      function iS(e10) {
        var t10;
        let { startTime: n10, attributes: r10, kind: i3, op: s2, links: a2 } = e10, o2 = "number" == typeof n10 ? (t10 = n10) < 9999999999 ? 1e3 * t10 : t10 : n10;
        return { attributes: s2 ? { [eg.SEMANTIC_ATTRIBUTE_SENTRY_OP]: s2, ...r10 } : r10, kind: i3, links: a2, startTime: o2 };
      }
      function iv(e10, t10) {
        let n10 = function(e11) {
          if (e11) {
            let t11 = e11[r5];
            if (t11) return t11;
          }
          return J.active();
        }(e10), r10 = to.getSpan(n10);
        if (!r10 || !t10) return n10;
        let i3 = to.deleteSpan(n10), { spanId: s2, traceId: a2 } = r10.spanContext(), o2 = r6(r10.spanContext()), c2 = (0, el.getRootSpan)(r10), l2 = ii({ dsc: (0, eB.getDynamicSamplingContextFromSpan)(c2), sampled: o2 }), p2 = { traceId: a2, spanId: s2, isRemote: true, traceFlags: o2 ? u.SAMPLED : u.NONE, traceState: l2 };
        return to.setSpanContext(i3, p2);
      }
      function iT(e10, t10) {
        var n10;
        let r10;
        return n10 = J.active(), r10 = ip(il(n10, e10)), J.with(r10, t10);
      }
      function iy(e10) {
        return void 0 !== e10 ? (t10) => im(e10, t10) : (e11) => e11();
      }
      function iR(e10) {
        let t10 = nZ(J.active());
        return J.with(t10, e10);
      }
      function iA({ span: e10, scope: t10, client: n10, propagateTraceparent: r10 } = {}) {
        let i3 = (t10 && t10[r5]) ?? J.active();
        if (e10) {
          let { scope: t11 } = (0, em.getCapturedScopesOnSpan)(e10);
          i3 = t11 && t11[r5] || to.setSpan(J.active(), e10);
        }
        let { traceId: s2, spanId: a2, sampled: o2, dynamicSamplingContext: u2 } = ic(i3, { scope: t10, client: n10 }), c2 = { "sentry-trace": (0, eU.generateSentryTraceHeader)(s2, a2, o2), baggage: (0, ew.dynamicSamplingContextToSentryBaggageHeader)(u2) };
        return r10 && (c2.traceparent = (0, eU.generateTraceparentHeader)(s2, a2, o2)), c2;
      }
      function iI(e10) {
        return true === e10.attributes[rz] ? void 0 : rW(e10);
      }
      function ib(e10, t10) {
        let n10 = e10.get(t10.id);
        return n10?.span ? n10 : n10 && !n10.span ? (n10.span = t10.span, n10.parentNode = t10.parentNode, n10) : (e10.set(t10.id, t10), t10);
      }
      let iO = { 1: "cancelled", 2: "unknown_error", 3: "invalid_argument", 4: "deadline_exceeded", 5: "not_found", 6: "already_exists", 7: "permission_denied", 8: "resource_exhausted", 9: "failed_precondition", 10: "aborted", 11: "out_of_range", 12: "unimplemented", 13: "internal_error", 14: "unavailable", 15: "data_loss", 16: "unauthenticated" };
      function iC(e10) {
        let t10 = rK(e10) ? e10.attributes : {}, n10 = e10.status ? e10.status : void 0;
        if (n10) {
          if (n10.code === l.OK) return { code: ep.SPAN_STATUS_OK };
          else if (n10.code === l.ERROR) {
            let e11;
            if (void 0 === n10.message) {
              let e12 = iN(t10);
              if (e12) return e12;
            }
            return n10.message && (e11 = n10.message, Object.values(iO).includes(e11)) ? { code: ep.SPAN_STATUS_ERROR, message: n10.message } : { code: ep.SPAN_STATUS_ERROR, message: "internal_error" };
          }
        }
        let r10 = iN(t10);
        return r10 || (n10?.code === l.UNSET ? { code: ep.SPAN_STATUS_OK } : { code: ep.SPAN_STATUS_ERROR, message: "unknown_error" });
      }
      function iN(e10) {
        let t10 = e10[rr] || e10[n7], n10 = e10["rpc.grpc.status_code"], r10 = "number" == typeof t10 ? t10 : "string" == typeof t10 ? parseInt(t10) : void 0;
        return "number" == typeof r10 ? (0, ep.getSpanStatusFromHttpCode)(r10) : "string" == typeof n10 ? { code: ep.SPAN_STATUS_ERROR, message: iO[n10] || "unknown_error" } : void 0;
      }
      class iL {
        constructor(e10) {
          this._finishedSpanBucketSize = e10?.timeout || 300, this._finishedSpanBuckets = Array(this._finishedSpanBucketSize).fill(void 0), this._lastCleanupTimestampInS = Math.floor((0, eG.safeDateNow)() / 1e3), this._spansToBucketEntry = /* @__PURE__ */ new WeakMap(), this._sentSpans = /* @__PURE__ */ new Map(), this._debouncedFlush = function(e11, t10, n10) {
            let r10, i3, s2, a2 = n10?.maxWait ? Math.max(n10.maxWait, 1) : 0, o2 = n10?.setTimeoutImpl || setTimeout;
            function u2() {
              return c2(), r10 = e11();
            }
            function c2() {
              void 0 !== i3 && clearTimeout(i3), void 0 !== s2 && clearTimeout(s2), i3 = s2 = void 0;
            }
            function l2() {
              return i3 && clearTimeout(i3), i3 = o2(u2, 1), a2 && void 0 === s2 && (s2 = o2(u2, a2)), r10;
            }
            return l2.cancel = c2, l2.flush = function() {
              return void 0 !== i3 || void 0 !== s2 ? u2() : r10;
            }, l2;
          }(this.flush.bind(this), 0, { maxWait: 100 });
        }
        export(e10) {
          let t10 = Math.floor((0, eG.safeDateNow)() / 1e3);
          if (this._lastCleanupTimestampInS !== t10) {
            let e11 = 0;
            this._finishedSpanBuckets.forEach((n11, r11) => {
              n11 && n11.timestampInS <= t10 - this._finishedSpanBucketSize && (e11 += n11.spans.size, this._finishedSpanBuckets[r11] = void 0);
            }), e11 > 0 && ir && Q.debug.log(`SpanExporter dropped ${e11} spans because they were pending for more than ${this._finishedSpanBucketSize} seconds.`), this._lastCleanupTimestampInS = t10;
          }
          let n10 = t10 % this._finishedSpanBucketSize, r10 = this._finishedSpanBuckets[n10] || { timestampInS: t10, spans: /* @__PURE__ */ new Set() };
          this._finishedSpanBuckets[n10] = r10, r10.spans.add(e10), this._spansToBucketEntry.set(e10, r10);
          let i3 = iI(e10);
          (!i3 || this._sentSpans.has(i3)) && this._debouncedFlush();
        }
        flush() {
          let e10 = this._finishedSpanBuckets.flatMap((e11) => e11 ? Array.from(e11.spans) : []);
          this._flushSentSpanCache();
          let t10 = this._maybeSend(e10), n10 = t10.size, r10 = e10.length - n10;
          ir && Q.debug.log(`SpanExporter exported ${n10} spans, ${r10} spans are waiting for their parent spans to finish`);
          let i3 = (0, eG.safeDateNow)() + 3e5;
          for (let e11 of t10) {
            this._sentSpans.set(e11.spanContext().spanId, i3);
            let t11 = this._spansToBucketEntry.get(e11);
            t11 && t11.spans.delete(e11);
          }
          this._debouncedFlush.cancel();
        }
        clear() {
          this._finishedSpanBuckets = this._finishedSpanBuckets.fill(void 0), this._sentSpans.clear(), this._debouncedFlush.cancel();
        }
        _maybeSend(e10) {
          let t10 = function(e11) {
            let t11 = /* @__PURE__ */ new Map();
            for (let n11 of e11) !function(e12, t12) {
              let n12 = t12.spanContext().spanId, r10 = iI(t12);
              if (!r10) return ib(e12, { id: n12, span: t12, children: [] });
              let i3 = function(e13, t13) {
                let n13 = e13.get(t13);
                return n13 || ib(e13, { id: t13, children: [] });
              }(e12, r10), s2 = ib(e12, { id: n12, span: t12, parentNode: i3, children: [] });
              i3.children.push(s2);
            }(t11, n11);
            return Array.from(t11, function([e12, t12]) {
              return t12;
            });
          }(e10), n10 = /* @__PURE__ */ new Set();
          for (let e11 of this._getCompletedRootNodes(t10)) {
            let t11 = e11.span;
            n10.add(t11);
            let r10 = function(e12) {
              let { op: t12, description: n11, data: r11, origin: i4 = "manual", source: s3 } = iP(e12), a2 = (0, em.getCapturedScopesOnSpan)(e12), o2 = e12.attributes[eg.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE], u2 = { [eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: s3, [eg.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]: o2, [eg.SEMANTIC_ATTRIBUTE_SENTRY_OP]: t12, [eg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: i4, ...r11, ...iw(e12.attributes) }, { links: c2 } = e12, { traceId: l2, spanId: p2 } = e12.spanContext(), d2 = rW(e12), f2 = iC(e12), _2 = { parent_span_id: d2, span_id: p2, trace_id: l2, data: u2, origin: i4, op: t12, status: (0, el.getStatusMessage)(f2), links: (0, el.convertSpanLinksForEnvelope)(c2) }, h2 = u2[rr];
              return { contexts: { trace: _2, otel: { resource: e12.resource.attributes }, ..."number" == typeof h2 ? { response: { status_code: h2 } } : void 0 }, spans: [], start_timestamp: (0, el.spanTimeInputToSeconds)(e12.startTime), timestamp: (0, el.spanTimeInputToSeconds)(e12.endTime), transaction: n11, type: "transaction", sdkProcessingMetadata: { capturedSpanScope: a2.scope, capturedSpanIsolationScope: a2.isolationScope, sampleRate: o2, dynamicSamplingContext: (0, eB.getDynamicSamplingContextFromSpan)(e12) }, ...s3 && { transaction_info: { source: s3 } } };
            }(t11);
            if (e11.parentNode && this._sentSpans.has(e11.parentNode.id)) {
              let e12 = r10.contexts?.trace?.data;
              e12 && (e12["sentry.parent_span_already_sent"] = true);
            }
            let i3 = r10.spans || [];
            for (let t12 of e11.children) !function e12(t13, n11, r11) {
              let i4 = t13.span;
              if (i4 && r11.add(i4), !i4) return void t13.children.forEach((t14) => {
                e12(t14, n11, r11);
              });
              let s3 = i4.spanContext().spanId, a2 = i4.spanContext().traceId, o2 = rW(i4), { attributes: u2, startTime: c2, endTime: l2, links: p2 } = i4, { op: d2, description: f2, data: _2, origin: h2 = "manual" } = iP(i4), g2 = { [eg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: h2, [eg.SEMANTIC_ATTRIBUTE_SENTRY_OP]: d2, ...iw(u2), ..._2 }, m2 = iC(i4), E2 = { span_id: s3, trace_id: a2, data: g2, description: f2, parent_span_id: o2, start_timestamp: (0, el.spanTimeInputToSeconds)(c2), timestamp: (0, el.spanTimeInputToSeconds)(l2) || void 0, status: (0, el.getStatusMessage)(m2), op: d2, origin: h2, measurements: (0, ej.timedEventsToMeasurements)(i4.events), links: (0, el.convertSpanLinksForEnvelope)(p2) };
              n11.push(E2), t13.children.forEach((t14) => {
                e12(t14, n11, r11);
              });
            }(t12, i3, n10);
            r10.spans = i3.length > 1e3 ? i3.sort((e12, t12) => e12.start_timestamp - t12.start_timestamp).slice(0, 1e3) : i3;
            let s2 = (0, ej.timedEventsToMeasurements)(t11.events);
            s2 && (r10.measurements = s2), (0, eV.captureEvent)(r10);
          }
          return n10;
        }
        _flushSentSpanCache() {
          let e10 = (0, eG.safeDateNow)();
          for (let [t10, n10] of this._sentSpans.entries()) n10 <= e10 && this._sentSpans.delete(t10);
        }
        _nodeIsCompletedRootNodeOrHasSentParent(e10) {
          return !!e10.span && (!e10.parentNode || this._sentSpans.has(e10.parentNode.id));
        }
        _getCompletedRootNodes(e10) {
          return e10.filter((e11) => this._nodeIsCompletedRootNodeOrHasSentParent(e11));
        }
      }
      function iP(e10) {
        var t10;
        let n10, r10, i3, s2, a2, o2, { op: u2, source: l2, origin: p2 } = (o2 = (a2 = e10.attributes)[eg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN], { origin: o2, op: a2[eg.SEMANTIC_ATTRIBUTE_SENTRY_OP], source: a2[eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] }), { op: d2, description: f2, source: _2, data: h2 } = r7(e10);
        return { op: u2 || d2, description: f2, source: l2 || _2, origin: p2, data: { ...h2, ...(n10 = (t10 = e10).attributes, r10 = {}, t10.kind !== c.INTERNAL && (r10["otel.kind"] = c[t10.kind]), (i3 = n10[n7]) && (r10[rr] = i3), (s2 = function(e11) {
          if (!rK(e11)) return {};
          let t11 = e11.attributes[ri] || e11.attributes[n8], n11 = { url: t11, "http.method": e11.attributes[rn] || e11.attributes[n6] };
          !n11["http.method"] && n11.url && (n11["http.method"] = "GET");
          try {
            if ("string" == typeof t11) {
              let e12 = ey(t11);
              n11.url = eA(e12), e12.search && (n11["http.query"] = e12.search), e12.hash && (n11["http.fragment"] = e12.hash);
            }
          } catch {
          }
          return n11;
        }(t10)).url && (r10.url = s2.url), s2["http.query"] && (r10["http.query"] = s2["http.query"].slice(1)), s2["http.fragment"] && (r10["http.fragment"] = s2["http.fragment"].slice(1)), r10) } };
      }
      function iw(e10) {
        let t10 = { ...e10 };
        return delete t10[eg.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE], delete t10[rz], delete t10[eg.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME], t10;
      }
      class iD {
        constructor(e10) {
          ia("SentrySpanProcessor"), this._exporter = new iL(e10);
        }
        async forceFlush() {
          this._exporter.flush();
        }
        async shutdown() {
          this._exporter.clear();
        }
        onStart(e10, t10) {
          let n10, r10, i3;
          n10 = to.getSpan(t10), r10 = r3(t10), n10 && !n10.spanContext().isRemote && (0, el.addChildSpanToSpan)(n10, e10), n10?.spanContext().isRemote && e10.setAttribute(rz, true), t10 === b && (r10 = { scope: (0, eF.getDefaultCurrentScope)(), isolationScope: (0, eF.getDefaultIsolationScope)() }), r10 && (0, em.setCapturedScopesOnSpan)(e10, r10.scope, r10.isolationScope), (0, eY.logSpanStart)(e10), i3 = (0, eE.getClient)(), i3?.emit("spanStart", e10);
        }
        onEnd(e10) {
          let t10;
          (0, eY.logSpanEnd)(e10), t10 = (0, eE.getClient)(), t10?.emit("spanEnd", e10), this._exporter.export(e10);
        }
      }
      class iM {
        constructor(e10) {
          this._client = e10, ia("SentrySampler");
        }
        shouldSample(e10, t10, n10, r10, i3, s2) {
          var a2;
          let o2, u2 = this._client.getOptions(), l2 = (a2 = e10, (o2 = to.getSpan(a2)) && e8(o2.spanContext()) ? o2 : void 0), p2 = l2?.spanContext();
          if (!(0, eD.hasSpansEnabled)(u2)) return iU({ decision: void 0, context: e10, spanAttributes: i3 });
          let d2 = i3[n6] || i3[rn];
          if (r10 === c.CLIENT && d2 && (!l2 || p2?.isRemote)) return iU({ decision: void 0, context: e10, spanAttributes: i3 });
          let _2 = l2 ? function(e11, t11, n11) {
            let r11 = e11.spanContext();
            if (e8(r11) && r11.traceId === t11) {
              if (r11.isRemote) {
                let t13 = r6(e11.spanContext());
                return ir && Q.debug.log(`[Tracing] Inheriting remote parent's sampled decision for ${n11}: ${t13}`), t13;
              }
              let t12 = r6(r11);
              return ir && Q.debug.log(`[Tracing] Inheriting parent's sampled decision for ${n11}: ${t12}`), t12;
            }
          }(l2, t10, n10) : void 0;
          if (!(!l2 || p2?.isRemote)) return iU({ decision: _2 ? f.RECORD_AND_SAMPLED : f.NOT_RECORD, context: e10, spanAttributes: i3 });
          let { description: h2, data: g2, op: m2 } = r8(n10, i3, r10), E2 = { ...g2, ...i3 };
          m2 && (E2[eg.SEMANTIC_ATTRIBUTE_SENTRY_OP] = m2);
          let S2 = { decision: true };
          if (this._client.emit("beforeSampling", { spanAttributes: E2, spanName: h2, parentSampled: _2, parentContext: p2 }, S2), !S2.decision) return iU({ decision: void 0, context: e10, spanAttributes: i3 });
          let { isolationScope: v2 } = r3(e10) ?? {}, T2 = p2?.traceState ? p2.traceState.get(rX) : void 0, y2 = T2 ? (0, ew.baggageHeaderToDynamicSamplingContext)(T2) : void 0, R2 = (0, eH.parseSampleRate)(y2?.sample_rand) ?? (0, ez.safeMathRandom)(), [A2, I2, b2] = (0, eW.sampleSpan)(u2, { name: h2, attributes: E2, normalizedRequest: v2?.getScopeData().sdkProcessingMetadata.normalizedRequest, parentSampled: _2, parentSampleRate: (0, eH.parseSampleRate)(y2?.sample_rate) }, R2), O2 = `${d2}`.toUpperCase();
          return "OPTIONS" === O2 || "HEAD" === O2 ? (ir && Q.debug.log(`[Tracing] Not sampling span because HTTP method is '${O2}' for ${n10}`), iU({ decision: f.NOT_RECORD, context: e10, spanAttributes: i3, sampleRand: R2, downstreamTraceSampleRate: 0 })) : (A2 || void 0 !== _2 || (ir && Q.debug.log("[Tracing] Discarding root span because its trace was not chosen to be sampled."), this._client.recordDroppedEvent("sample_rate", "transaction")), { ...iU({ decision: A2 ? f.RECORD_AND_SAMPLED : f.NOT_RECORD, context: e10, spanAttributes: i3, sampleRand: R2, downstreamTraceSampleRate: b2 ? I2 : void 0 }), attributes: { [eg.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]: b2 ? I2 : void 0 } });
        }
        toString() {
          return "SentrySampler";
        }
      }
      function iU({ decision: e10, context: t10, spanAttributes: n10, sampleRand: r10, downstreamTraceSampleRate: i3 }) {
        var s2, a2;
        let o2, u2, c2, l2, p2 = (s2 = t10, a2 = n10, o2 = to.getSpan(s2), u2 = o2?.spanContext(), c2 = u2?.traceState || new rg(), (l2 = a2[n8] || a2[ri]) && "string" == typeof l2 && (c2 = c2.set(rQ, l2)), c2);
        return (void 0 !== i3 && (p2 = p2.set("sentry.sample_rate", `${i3}`)), void 0 !== r10 && (p2 = p2.set("sentry.sample_rand", `${r10}`)), void 0 == e10) ? { decision: f.NOT_RECORD, traceState: p2 } : e10 === f.NOT_RECORD ? { decision: e10, traceState: p2.set(rZ, "1") } : { decision: e10, traceState: p2 };
      }
      let ix = "u" < typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__, iB = /* @__PURE__ */ new WeakMap();
      class ik {
        constructor(e10 = 30) {
          this.$ = [], this._taskProducers = [], this._bufferSize = e10;
        }
        add(e10) {
          return this._taskProducers.length >= this._bufferSize ? Promise.reject(tJ) : (this._taskProducers.push(e10), Promise.resolve({}));
        }
        drain(e10) {
          let t10 = [...this._taskProducers];
          return this._taskProducers = [], new Promise((n10) => {
            let r10 = setTimeout(() => {
              e10 && e10 > 0 && n10(false);
            }, e10);
            Promise.all(t10.map((e11) => e11().then(null, () => {
            }))).then(() => {
              clearTimeout(r10), n10(true);
            });
          });
        }
      }
      function i$(e10) {
        return function(e11, t10, n10 = tX(e11.bufferSize || 64)) {
          let r10 = {};
          return { send: function(i3) {
            let s2 = [];
            if ((0, tU.forEachEnvelopeItem)(i3, (t11, n11) => {
              let i4 = (0, tU.envelopeItemTypeToDataCategory)(n11);
              !function(e12, t12, n12 = (0, tZ.safeDateNow)()) {
                return (e12[t12] || e12.all || 0) > n12;
              }(r10, i4) ? s2.push(t11) : e11.recordDroppedEvent("ratelimit_backoff", i4);
            }), 0 === s2.length) return Promise.resolve({});
            let a2 = (0, tU.createEnvelope)(i3[0], s2), o2 = (t11) => {
              if ((0, tU.envelopeContainsItemType)(a2, ["client_report"])) {
                X.DEBUG_BUILD && Q.debug.warn(`Dropping client report. Will not send outcomes (reason: ${t11}).`);
                return;
              }
              (0, tU.forEachEnvelopeItem)(a2, (n11, r11) => {
                e11.recordDroppedEvent(t11, (0, tU.envelopeItemTypeToDataCategory)(r11));
              });
            };
            return n10.add(() => t10({ body: (0, tU.serializeEnvelope)(a2) }).then((e12) => (void 0 !== e12.statusCode && (e12.statusCode < 200 || e12.statusCode >= 300) && X.DEBUG_BUILD && Q.debug.warn(`Sentry responded with status code ${e12.statusCode} to sent event.`), r10 = function(e13, { statusCode: t11, headers: n11 }, r11 = (0, tZ.safeDateNow)()) {
              let i4 = { ...e13 }, s3 = n11?.["x-sentry-rate-limits"], a3 = n11?.["retry-after"];
              if (s3) for (let e14 of s3.trim().split(",")) {
                let [t12, n12, , , s4] = e14.split(":", 5), a4 = parseInt(t12, 10), o3 = (isNaN(a4) ? 60 : a4) * 1e3;
                if (n12) for (let e15 of n12.split(";")) "metric_bucket" === e15 ? (!s4 || s4.split(";").includes("custom")) && (i4[e15] = r11 + o3) : i4[e15] = r11 + o3;
                else i4.all = r11 + o3;
              }
              else a3 ? i4.all = r11 + function(e14, t12 = (0, tZ.safeDateNow)()) {
                let n12 = parseInt(`${e14}`, 10);
                if (!isNaN(n12)) return 1e3 * n12;
                let r12 = Date.parse(`${e14}`);
                return isNaN(r12) ? 6e4 : r12 - t12;
              }(a3, r11) : 429 === t11 && (i4.all = r11 + 6e4);
              return i4;
            }(r10, e12), e12), (e12) => {
              throw o2("network_error"), X.DEBUG_BUILD && Q.debug.error("Encountered error running transport request:", e12), e12;
            })).then((e12) => e12, (e12) => {
              if (e12 === tJ) return X.DEBUG_BUILD && Q.debug.error("Skipped sending event because buffer is full."), o2("queue_overflow"), Promise.resolve({});
              throw e12;
            });
          }, flush: (e12) => n10.drain(e12) };
        }(e10, function(t10) {
          let n10 = { body: t10.body, method: "POST", headers: e10.headers, ...e10.fetchOptions };
          return (0, nv.suppressTracing)(() => fetch(e10.url, n10).then((e11) => ({ statusCode: e11.status, headers: { "x-sentry-rate-limits": e11.headers.get("X-Sentry-Rate-Limits"), "retry-after": e11.headers.get("Retry-After") } })));
        }, new ik(e10.bufferSize));
      }
      let iF = ["addListener", "on", "once", "prependListener", "prependOnceListener"];
      class iG {
        constructor() {
          iG.prototype.__init.call(this), iG.prototype.__init2.call(this);
        }
        bind(e10, t10) {
          return "object" == typeof t10 && null !== t10 && "on" in t10 ? this._bindEventEmitter(e10, t10) : "function" == typeof t10 ? this._bindFunction(e10, t10) : t10;
        }
        _bindFunction(e10, t10) {
          let n10 = this, r10 = function(...r11) {
            return n10.with(e10, () => t10.apply(this, r11));
          };
          return Object.defineProperty(r10, "length", { enumerable: false, configurable: true, writable: false, value: t10.length }), r10;
        }
        _bindEventEmitter(e10, t10) {
          return void 0 !== this._getPatchMap(t10) || (this._createPatchMap(t10), iF.forEach((n10) => {
            void 0 !== t10[n10] && (t10[n10] = this._patchAddListener(t10, t10[n10], e10));
          }), "function" == typeof t10.removeListener && (t10.removeListener = this._patchRemoveListener(t10, t10.removeListener)), "function" == typeof t10.off && (t10.off = this._patchRemoveListener(t10, t10.off)), "function" == typeof t10.removeAllListeners && (t10.removeAllListeners = this._patchRemoveAllListeners(t10, t10.removeAllListeners))), t10;
        }
        _patchRemoveListener(e10, t10) {
          let n10 = this;
          return function(r10, i3) {
            let s2 = n10._getPatchMap(e10)?.[r10];
            if (void 0 === s2) return t10.call(this, r10, i3);
            let a2 = s2.get(i3);
            return t10.call(this, r10, a2 || i3);
          };
        }
        _patchRemoveAllListeners(e10, t10) {
          let n10 = this;
          return function(r10) {
            let i3 = n10._getPatchMap(e10);
            return void 0 !== i3 && (0 == arguments.length ? n10._createPatchMap(e10) : void 0 !== i3[r10] && delete i3[r10]), t10.apply(this, arguments);
          };
        }
        _patchAddListener(e10, t10, n10) {
          let r10 = this;
          return function(i3, s2) {
            if (r10._wrapped) return t10.call(this, i3, s2);
            let a2 = r10._getPatchMap(e10);
            void 0 === a2 && (a2 = r10._createPatchMap(e10));
            let o2 = a2[i3];
            void 0 === o2 && (o2 = /* @__PURE__ */ new WeakMap(), a2[i3] = o2);
            let u2 = r10.bind(n10, s2);
            o2.set(s2, u2), r10._wrapped = true;
            try {
              return t10.call(this, i3, u2);
            } finally {
              r10._wrapped = false;
            }
          };
        }
        _createPatchMap(e10) {
          let t10 = /* @__PURE__ */ Object.create(null);
          return e10[this._kOtListeners] = t10, t10;
        }
        _getPatchMap(e10) {
          return e10[this._kOtListeners];
        }
        __init() {
          this._kOtListeners = Symbol("OtListeners");
        }
        __init2() {
          this._wrapped = false;
        }
      }
      class ij extends iG {
        constructor() {
          super();
          const e10 = Z.GLOBAL_OBJ.AsyncLocalStorage;
          e10 ? this._asyncLocalStorage = new e10() : (ix && Q.debug.warn("Tried to register AsyncLocalStorage async context strategy in a runtime that doesn't support AsyncLocalStorage."), this._asyncLocalStorage = { getStore() {
          }, run(e11, t10, ...n10) {
            return t10.apply(this, n10);
          }, disable() {
          } });
        }
        active() {
          return this._asyncLocalStorage.getStore() ?? b;
        }
        with(e10, t10, n10, ...r10) {
          let i3 = null == n10 ? t10 : t10.bind(n10);
          return this._asyncLocalStorage.run(e10, i3, ...r10);
        }
        enable() {
          return this;
        }
        disable() {
          return this._asyncLocalStorage.disable(), this;
        }
      }
      let iV = (0, ee.createStackParser)([90, (I = void 0, r = /^\s*[-]{4,}$/, i = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/, s = /at (?:async )?(.+?) \(data:(.*?),/, (e10) => {
        let t10 = e10.match(s);
        if (t10) return { filename: `<data:${t10[2]}>`, function: t10[1] };
        let n10 = e10.match(i);
        if (n10) {
          let e11, t11, r10, i3, s2;
          if (n10[1]) {
            let s3 = (r10 = n10[1]).lastIndexOf(".");
            if ("." === r10[s3 - 1] && s3--, s3 > 0) {
              e11 = r10.slice(0, s3), t11 = r10.slice(s3 + 1);
              let n11 = e11.indexOf(".Module");
              n11 > 0 && (r10 = r10.slice(n11 + 1), e11 = e11.slice(0, n11));
            }
            i3 = void 0;
          }
          t11 && (i3 = e11, s2 = t11), "<anonymous>" === t11 && (s2 = void 0, r10 = void 0), void 0 === r10 && (s2 = s2 || ee.UNKNOWN_FUNCTION, r10 = i3 ? `${i3}.${s2}` : s2);
          let a2 = (0, ee.normalizeStackTracePath)(n10[2]), o2 = "native" === n10[5];
          return a2 || !n10[5] || o2 || (a2 = n10[5]), { filename: a2 ? decodeURI(a2) : void 0, module: I ? I(a2) : void 0, function: r10, lineno: nA(n10[3]), colno: nA(n10[4]), in_app: function(e12, t12 = false) {
            return !(t12 || e12 && !e12.startsWith("/") && !e12.match(/^[A-Z]:/) && !e12.startsWith(".") && !e12.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//)) && void 0 !== e12 && !e12.includes("node_modules/");
          }(a2 || "", o2) };
        }
        if (e10.match(r)) return { filename: e10 };
      })]);
      function iY(e10) {
        let n10;
        return [{ name: "Dedupe", processEvent(e11) {
          if (e11.type) return e11;
          try {
            var t10, r10, i3, s2, a2, o2;
            let u2, c2, l2, p2;
            if (t10 = e11, (r10 = n10) && (i3 = t10, s2 = r10, u2 = i3.message, c2 = s2.message, (u2 || c2) && (!u2 || c2) && (u2 || !c2) && u2 === c2 && nb(i3, s2) && nI(i3, s2) && 1 || (a2 = t10, o2 = r10, l2 = nO(o2), p2 = nO(a2), l2 && p2 && l2.type === p2.type && l2.value === p2.value && nb(a2, o2) && nI(a2, o2)))) return X.DEBUG_BUILD && Q.debug.warn("Event dropped due to being a duplicate of previously captured event."), null;
          } catch {
          }
          return n10 = e11;
        } }, ((e11 = {}) => ({ .../* @__PURE__ */ ((e12 = {}) => {
          let t10;
          return { name: "EventFilters", setup(n11) {
            t10 = nN(e12, n11.getOptions());
          }, processEvent: (n11, r10, i3) => (t10 || (t10 = nN(e12, i3.getOptions())), !function(e13, t11) {
            if (e13.type) {
              if ("transaction" === e13.type && function(e14, t12) {
                if (!t12?.length) return false;
                let n13 = e14.transaction;
                return !!n13 && (0, ex.stringMatchesSomePattern)(n13, t12);
              }(e13, t11.ignoreTransactions)) return X.DEBUG_BUILD && Q.debug.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${(0, t1.getEventDescription)(e13)}`), true;
            } else {
              var n12, r11, i4;
              if (n12 = e13, r11 = t11.ignoreErrors, r11?.length && tQ(n12).some((e14) => (0, ex.stringMatchesSomePattern)(e14, r11))) return X.DEBUG_BUILD && Q.debug.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${(0, t1.getEventDescription)(e13)}`), true;
              if (i4 = e13, i4.exception?.values?.length && !i4.message && !i4.exception.values.some((e14) => e14.stacktrace || e14.type && "Error" !== e14.type || e14.value)) return X.DEBUG_BUILD && Q.debug.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${(0, t1.getEventDescription)(e13)}`), true;
              if (function(e14, t12) {
                if (!t12?.length) return false;
                let n13 = nL(e14);
                return !!n13 && (0, ex.stringMatchesSomePattern)(n13, t12);
              }(e13, t11.denyUrls)) return X.DEBUG_BUILD && Q.debug.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${(0, t1.getEventDescription)(e13)}.
Url: ${nL(e13)}`), true;
              if (!function(e14, t12) {
                if (!t12?.length) return true;
                let n13 = nL(e14);
                return !n13 || (0, ex.stringMatchesSomePattern)(n13, t12);
              }(e13, t11.allowUrls)) return X.DEBUG_BUILD && Q.debug.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${(0, t1.getEventDescription)(e13)}.
Url: ${nL(e13)}`), true;
            }
            return false;
          }(n11, t10) ? n11 : null) };
        })(e11), name: "InboundFilters" }))(), { name: "FunctionToString", setupOnce() {
          t = Function.prototype.toString;
          try {
            Function.prototype.toString = function(...e11) {
              let n11 = (0, eN.getOriginalFunction)(this), r10 = nP.has((0, eE.getClient)()) && void 0 !== n11 ? n11 : this;
              return t.apply(r10, e11);
            };
          } catch {
          }
        }, setup(e11) {
          nP.set(e11, true);
        } }, { name: "ConversationId", setup(e11) {
          e11.on("spanStart", (e12) => {
            let t10 = (0, eE.getCurrentScope)().getScopeData(), n11 = (0, eE.getIsolationScope)().getScopeData(), r10 = t10.conversationId || n11.conversationId;
            r10 && e12.setAttribute(eg.GEN_AI_CONVERSATION_ID_ATTRIBUTE, r10);
          });
        } }, ((e11 = {}) => {
          let t10 = e11.limit || 5, n11 = e11.key || "cause";
          return { name: "LinkedErrors", preprocessEvent(e12, r10, i3) {
            !function(e13, t11, n12, r11, i4, s2) {
              if (!i4.exception?.values || !s2 || !(0, tj.isInstanceOf)(s2.originalException, Error)) return;
              let a2 = i4.exception.values.length > 0 ? i4.exception.values[i4.exception.values.length - 1] : void 0;
              a2 && (i4.exception.values = function e14(t12, n13, r12, i5, s3, a3, o2, u2) {
                if (a3.length >= r12 + 1) return a3;
                let c2 = [...a3];
                if ((0, tj.isInstanceOf)(i5[s3], Error)) {
                  nD(o2, u2, i5);
                  let a4 = t12(n13, i5[s3]), l2 = c2.length;
                  nM(a4, s3, l2, u2), c2 = e14(t12, n13, r12, i5[s3], s3, [a4, ...c2], a4, l2);
                }
                return nw(i5) && i5.errors.forEach((a4, l2) => {
                  if ((0, tj.isInstanceOf)(a4, Error)) {
                    nD(o2, u2, i5);
                    let p2 = t12(n13, a4), d2 = c2.length;
                    nM(p2, `errors[${l2}]`, d2, u2), c2 = e14(t12, n13, r12, a4, s3, [p2, ...c2], p2, d2);
                  }
                }), c2;
              }(e13, t11, r11, s2.originalException, n12, i4.exception.values, a2, 0));
            }(n_, i3.getOptions().stackParser, n11, t10, e12, r10);
          } };
        })(), ((e11 = {}) => {
          let t10 = void 0 === e11.breadcrumbs || e11.breadcrumbs, n11 = e11.shouldCreateSpanForRequest, r10 = new eM(100), i3 = new eM(100), s2 = {};
          function a2(e12) {
            let t11 = (0, eE.getClient)();
            if (!t11) return false;
            let n12 = t11.getOptions();
            if (void 0 === n12.tracePropagationTargets) return true;
            let r11 = i3.get(e12);
            if (void 0 !== r11) return r11;
            let s3 = (0, ex.stringMatchesSomePattern)(e12, n12.tracePropagationTargets);
            return i3.set(e12, s3), s3;
          }
          function o2(e12) {
            if (void 0 === n11) return true;
            let t11 = r10.get(e12);
            if (void 0 !== t11) return t11;
            let i4 = n11(e12);
            return r10.set(e12, i4), i4;
          }
          return { name: "WinterCGFetch", setupOnce() {
            let e12;
            er(e12 = "fetch", (e13) => {
              let n12 = (0, eE.getClient)();
              n12 && iB.get(n12) && !eL(e13.fetchData.url, n12) && (!function(e14, t11, n13, r11, i4) {
                if (!e14.fetchData) return;
                let { method: s3, url: a3 } = e14.fetchData, o3 = (0, eD.hasSpansEnabled)() && t11(a3);
                if (e14.endTimestamp && o3) {
                  var u2, c2, l2;
                  let t12, n14 = e14.fetchData.__span;
                  if (!n14) return;
                  let s4 = r11[n14];
                  s4 && (function(e15, t13) {
                    if (t13.response) {
                      (0, ep.setHttpStatus)(e15, t13.response.status);
                      let n15 = t13.response?.headers?.get("content-length");
                      if (n15) {
                        let t14 = parseInt(n15);
                        t14 > 0 && e15.setAttribute("http.response_content_length", t14);
                      }
                    } else t13.error && e15.setStatus({ code: ep.SPAN_STATUS_ERROR, message: "internal_error" });
                    e15.end();
                  }(s4, e14), u2 = s4, c2 = e14, t12 = "object" == typeof (l2 = i4) && null !== l2 ? l2.onRequestSpanEnd : void 0, t12?.(u2, { headers: c2.response?.headers, error: c2.error }), delete r11[n14]);
                  return;
                }
                let { spanOrigin: p2 = "auto.http.browser", propagateTraceparent: d2 = false } = "object" == typeof i4 ? i4 : { spanOrigin: i4 }, f2 = !!(0, el.getActiveSpan)(), _2 = o3 && f2 ? (0, nv.startInactiveSpan)(function(e15, t12, n14) {
                  if (e15.startsWith("data:")) {
                    let r13 = eI(e15);
                    return { name: `${t12} ${r13}`, attributes: ny(e15, void 0, t12, n14) };
                  }
                  let r12 = ev(e15), i5 = r12 ? eT(r12) : e15;
                  return { name: `${t12} ${i5}`, attributes: ny(e15, r12, t12, n14) };
                }(a3, s3, p2)) : new nS.SentryNonRecordingSpan();
                if (e14.fetchData.__span = _2.spanContext().spanId, r11[_2.spanContext().spanId] = _2, n13(e14.fetchData.url)) {
                  let t12 = e14.args[0], n14 = { ...e14.args[1] || {} }, r12 = function(e15, t13, n15, r13) {
                    var i5;
                    let s4 = function(e16 = {}) {
                      let t14 = e16.client || (0, eE.getClient)();
                      if (!(0, eV.isEnabled)() || !t14) return {};
                      let n16 = (0, tG.getMainCarrier)(), r14 = (0, e$.getAsyncContextStrategy)(n16);
                      if (r14.getTraceData) return r14.getTraceData(e16);
                      let i6 = e16.scope || (0, eE.getCurrentScope)(), s5 = e16.span || (0, el.getActiveSpan)(), a5 = s5 ? (0, el.spanToTraceHeader)(s5) : function(e17) {
                        let { traceId: t15, sampled: n17, propagationSpanId: r15 } = e17.getPropagationContext();
                        return (0, eU.generateSentryTraceHeader)(t15, r15, n17);
                      }(i6), o5 = s5 ? (0, eB.getDynamicSamplingContextFromSpan)(s5) : (0, eB.getDynamicSamplingContextFromScope)(t14, i6), u4 = (0, ew.dynamicSamplingContextToSentryBaggageHeader)(o5);
                      if (!eU.TRACEPARENT_REGEXP.test(a5)) return Q.debug.warn("Invalid sentry-trace data. Cannot generate trace data"), {};
                      let c4 = { "sentry-trace": a5, baggage: u4 };
                      return e16.propagateTraceparent && (c4.traceparent = s5 ? (0, el.spanToTraceparentHeader)(s5) : function(e17) {
                        let { traceId: t15, sampled: n17, propagationSpanId: r15 } = e17.getPropagationContext();
                        return (0, eU.generateTraceparentHeader)(t15, r15, n17);
                      }(i6)), c4;
                    }({ span: n15, propagateTraceparent: r13 }), a4 = s4["sentry-trace"], o4 = s4.baggage, u3 = s4.traceparent;
                    if (!a4) return;
                    let c3 = t13.headers || ((0, tj.isRequest)(e15) ? e15.headers : void 0);
                    if (!c3) return { ...s4 };
                    if (i5 = c3, "u" > typeof Headers && (0, tj.isInstanceOf)(i5, Headers)) {
                      let e16 = new Headers(c3);
                      if (e16.get("sentry-trace") || e16.set("sentry-trace", a4), r13 && u3 && !e16.get("traceparent") && e16.set("traceparent", u3), o4) {
                        let t14 = e16.get("baggage");
                        t14 ? nT(t14) || e16.set("baggage", `${t14},${o4}`) : e16.set("baggage", o4);
                      }
                      return e16;
                    }
                    if (Array.isArray(c3)) {
                      let e16 = [...c3];
                      c3.find((e17) => "sentry-trace" === e17[0]) || e16.push(["sentry-trace", a4]), r13 && u3 && !c3.find((e17) => "traceparent" === e17[0]) && e16.push(["traceparent", u3]);
                      let t14 = c3.find((e17) => "baggage" === e17[0] && nT(e17[1]));
                      return o4 && !t14 && e16.push(["baggage", o4]), e16;
                    }
                    {
                      let e16 = "sentry-trace" in c3 ? c3["sentry-trace"] : void 0, t14 = "traceparent" in c3 ? c3.traceparent : void 0, n16 = "baggage" in c3 ? c3.baggage : void 0, i6 = n16 ? Array.isArray(n16) ? [...n16] : [n16] : [], s5 = n16 && (Array.isArray(n16) ? n16.find((e17) => nT(e17)) : nT(n16));
                      o4 && !s5 && i6.push(o4);
                      let l3 = { ...c3, "sentry-trace": e16 ?? a4, baggage: i6.length > 0 ? i6.join(",") : void 0 };
                      return r13 && u3 && !t14 && (l3.traceparent = u3), l3;
                    }
                  }(t12, n14, (0, eD.hasSpansEnabled)() && f2 ? _2 : void 0, d2);
                  r12 && (e14.args[1] = n14, n14.headers = r12);
                }
                let h2 = (0, eE.getClient)();
                if (h2) {
                  let t12 = { input: e14.args, response: e14.response, startTimestamp: e14.startTimestamp, endTimestamp: e14.endTimestamp };
                  h2.emit("beforeOutgoingRequestSpan", _2, t12);
                }
              }(e13, o2, a2, s2, { spanOrigin: "auto.http.wintercg_fetch" }), t10 && function(e14) {
                let { startTimestamp: t11, endTimestamp: n13 } = e14;
                if (!n13) return;
                let r11 = { method: e14.fetchData.method, url: e14.fetchData.url };
                if (e14.error) nR({ category: "fetch", data: r11, level: "error", type: "http" }, { data: e14.error, input: e14.args, startTimestamp: t11, endTimestamp: n13 });
                else {
                  let i4 = e14.response;
                  r11.request_body_size = e14.fetchData.request_body_size, r11.response_body_size = e14.fetchData.response_body_size, r11.status_code = i4?.status;
                  let s3 = { input: e14.args, response: i4, startTimestamp: t11, endTimestamp: n13 }, a3 = function(e15) {
                    if (void 0 !== e15) return e15 >= 400 && e15 < 500 ? "warning" : e15 >= 500 ? "error" : void 0;
                  }(r11.status_code);
                  nR({ category: "fetch", data: r11, type: "http", level: a3 }, s3);
                }
              }(e13));
            }), ei(e12, () => function(e13, t11 = false) {
              (0, eN.fill)(Z.GLOBAL_OBJ, "fetch", function(t12) {
                return function(...n12) {
                  let r11 = Error(), { method: i4, url: s3 } = function(e14) {
                    if (0 === e14.length) return { method: "GET", url: "" };
                    if (2 === e14.length) {
                      let [t14, n13] = e14;
                      return { url: nE(t14), method: nm(n13, "method") ? String(n13.method).toUpperCase() : (0, tj.isRequest)(t14) && nm(t14, "method") ? String(t14.method).toUpperCase() : "GET" };
                    }
                    let t13 = e14[0];
                    return { url: nE(t13), method: nm(t13, "method") ? String(t13.method).toUpperCase() : "GET" };
                  }(n12), a3 = { args: n12, fetchData: { method: i4, url: s3 }, startTimestamp: 1e3 * (0, tV.timestampInSeconds)(), virtualError: r11, headers: function(e14) {
                    let [t13, n13] = e14;
                    try {
                      if ("object" == typeof n13 && null !== n13 && "headers" in n13 && n13.headers) return new Headers(n13.headers);
                      if ((0, tj.isRequest)(t13)) return new Headers(t13.headers);
                    } catch {
                    }
                  }(n12) };
                  return e13 || es("fetch", { ...a3 }), t12.apply(Z.GLOBAL_OBJ, n12).then(async (t13) => (e13 ? e13(t13) : es("fetch", { ...a3, endTimestamp: 1e3 * (0, tV.timestampInSeconds)(), response: t13 }), t13), (e14) => {
                    es("fetch", { ...a3, endTimestamp: 1e3 * (0, tV.timestampInSeconds)(), error: e14 }), (0, tj.isError)(e14) && void 0 === e14.stack && (e14.stack = r11.stack, (0, eN.addNonEnumerableProperty)(e14, "framesToPop", 1));
                    let t13 = (0, eE.getClient)(), n13 = t13?.getOptions().enhanceFetchErrorMessages ?? "always";
                    if (false !== n13 && e14 instanceof TypeError && ("Failed to fetch" === e14.message || "Load failed" === e14.message || "NetworkError when attempting to fetch resource." === e14.message)) try {
                      let t14 = new URL(a3.fetchData.url).host;
                      "always" === n13 ? e14.message = `${e14.message} (${t14})` : (0, eN.addNonEnumerableProperty)(e14, "__sentry_fetch_url_host__", t14);
                    } catch {
                    }
                    throw e14;
                  });
                };
              });
            }(void 0, void 0));
          }, setup(e12) {
            iB.set(e12, true);
          } };
        })(), ((e11 = {}) => {
          let t10 = new Set(e11.levels || Q.CONSOLE_LEVELS);
          return { name: "Console", setup(e12) {
            let n11;
            er(n11 = "console", ({ args: n12, level: r10 }) => {
              (0, eE.getClient)() === e12 && t10.has(r10) && function(e13, t11) {
                let n13 = { category: "console", data: { arguments: t11, logger: "console" }, level: "warn" === e13 ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(e13) ? e13 : "log", message: nx(t11) };
                if ("assert" === e13) if (false !== t11[0]) return;
                else {
                  let e14 = t11.slice(1);
                  n13.message = e14.length > 0 ? `Assertion failed: ${nx(e14)}` : "Assertion failed", n13.data.arguments = e14;
                }
                nR(n13, { input: t11, level: e13 });
              }(r10, n12);
            }), ei(n11, nU);
          } };
        })(), ...e10.sendDefaultPii ? [((e11 = {}) => {
          let t10 = { ...nk, ...e11.include };
          return { name: "RequestData", processEvent(e12, n11, r10) {
            let { sdkProcessingMetadata: i3 = {} } = e12, { normalizedRequest: s2, ipAddress: a2 } = i3, o2 = { ...t10, ip: t10.ip ?? r10.getOptions().sendDefaultPii };
            return s2 && function(e13, t11, n12, r11) {
              var i4, s3;
              let a3, o3;
              if (e13.request = { ...e13.request, ...(i4 = t11, s3 = r11, a3 = {}, o3 = { ...i4.headers }, s3.headers && (a3.headers = o3, s3.cookies || delete o3.cookie, s3.ip || nB.forEach((e14) => {
                delete o3[e14];
              })), a3.method = i4.method, s3.url && (a3.url = i4.url), s3.cookies && (a3.cookies = i4.cookies || (o3?.cookie ? function(e14) {
                let t12 = {}, n13 = 0;
                for (; n13 < e14.length; ) {
                  let r12 = e14.indexOf("=", n13);
                  if (-1 === r12) break;
                  let i5 = e14.indexOf(";", n13);
                  if (-1 === i5) i5 = e14.length;
                  else if (i5 < r12) {
                    n13 = e14.lastIndexOf(";", r12 - 1) + 1;
                    continue;
                  }
                  let s4 = e14.slice(n13, r12).trim();
                  if (void 0 === t12[s4]) {
                    let n14 = e14.slice(r12 + 1, i5).trim();
                    34 === n14.charCodeAt(0) && (n14 = n14.slice(1, -1));
                    try {
                      t12[s4] = -1 !== n14.indexOf("%") ? decodeURIComponent(n14) : n14;
                    } catch {
                      t12[s4] = n14;
                    }
                  }
                  n13 = i5 + 1;
                }
                return t12;
              }(o3.cookie) : void 0) || {}), s3.query_string && (a3.query_string = i4.query_string), s3.data && (a3.data = i4.data), a3) }, r11.ip) {
                let r12 = t11.headers && function(e14) {
                  let t12 = {};
                  for (let n13 of Object.keys(e14)) t12[n13.toLowerCase()] = e14[n13];
                  return nB.map((e15) => {
                    let n13 = t12[e15.toLowerCase()], r13 = Array.isArray(n13) ? n13.join(";") : n13;
                    return "Forwarded" === e15 ? function(e16) {
                      if (!e16) return null;
                      for (let t13 of e16.split(";")) if (t13.startsWith("for=")) return t13.slice(4);
                      return null;
                    }(r13) : r13?.split(",").map((e16) => e16.trim());
                  }).reduce((e15, t13) => t13 ? e15.concat(t13) : e15, []).find((e15) => {
                    var t13;
                    return null !== e15 && (t13 = e15, /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/.test(t13));
                  }) || null;
                }(t11.headers) || n12.ipAddress;
                r12 && (e13.user = { ...e13.user, ip_address: r12 });
              }
            }(e12, s2, { ipAddress: a2 }, o2), e12;
          } };
        })()] : []];
      }
      var iH = e.i(465549);
      let iz = "next.span_type", iW = "sentry.drop_transaction";
      var iK = e.i(830232);
      let iq = Z.GLOBAL_OBJ;
      var iJ = e.i(193597), iX = e.i(499200);
      let iZ = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
      function iQ(...e10) {
        let t10 = "", n10 = false;
        for (let r10 = e10.length - 1; r10 >= -1 && !n10; r10--) {
          let i3 = r10 >= 0 ? e10[r10] : "/";
          i3 && (t10 = `${i3}/${t10}`, n10 = "/" === i3.charAt(0));
        }
        return t10 = function(e11, t11) {
          let n11 = 0;
          for (let t12 = e11.length - 1; t12 >= 0; t12--) {
            let r10 = e11[t12];
            "." === r10 ? e11.splice(t12, 1) : ".." === r10 ? (e11.splice(t12, 1), n11++) : n11 && (e11.splice(t12, 1), n11--);
          }
          if (t11) for (; n11--; ) e11.unshift("..");
          return e11;
        }(t10.split("/").filter((e11) => !!e11), !n10).join("/"), (n10 ? "/" : "") + t10 || ".";
      }
      function i0(e10) {
        let t10 = 0;
        for (; t10 < e10.length && "" === e10[t10]; t10++) ;
        let n10 = e10.length - 1;
        for (; n10 >= 0 && "" === e10[n10]; n10--) ;
        return t10 > n10 ? [] : e10.slice(t10, n10 - t10 + 1);
      }
      let i1 = Z.GLOBAL_OBJ, i2 = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
      i2 && function(e10 = {}) {
        if (ef(), process.env.NEXT_PHASE === iJ.PHASE_PRODUCTION_BUILD) return;
        !iH.DEBUG_BUILD && e10.debug && console.warn("[@sentry/nextjs] You have enabled `debug: true`, but Sentry debug logging was removed from your bundle (likely via `withSentryConfig({ disableLogger: true })` / `webpack.treeshake.removeDebugLogging: true`). Set that option to `false` to see Sentry debug output.");
        let t10 = iY(e10), n10 = process.env._sentryRewriteFramesDistDir || i1._sentryRewriteFramesDistDir;
        n10 && t10.push((({ distDirName: e11 }) => {
          let t11 = e11.replace(/(\/|\\)$/, ""), n11 = RegExp(`.*${t11.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")}`);
          return { ...((e12 = {}) => {
            let t12 = e12.root, n12 = e12.prefix || "app:///", r11 = "window" in Z.GLOBAL_OBJ && !!Z.GLOBAL_OBJ.window, i4 = e12.iteratee || function({ isBrowser: e13, root: t13, prefix: n13 }) {
              return (r12) => {
                if (!r12.filename) return r12;
                let i5 = /^[a-zA-Z]:\\/.test(r12.filename) || r12.filename.includes("\\") && !r12.filename.includes("/"), s2 = /^\//.test(r12.filename);
                if (e13) {
                  if (t13) {
                    let e14 = r12.filename;
                    0 === e14.indexOf(t13) && (r12.filename = e14.replace(t13, n13));
                  }
                } else if (i5 || s2) {
                  let e14, s3, a2 = i5 ? r12.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/") : r12.filename, o2 = t13 ? function(e15, t14) {
                    e15 = iQ(e15).slice(1), t14 = iQ(t14).slice(1);
                    let n14 = i0(e15.split("/")), r13 = i0(t14.split("/")), i6 = Math.min(n14.length, r13.length), s4 = i6;
                    for (let e16 = 0; e16 < i6; e16++) if (n14[e16] !== r13[e16]) {
                      s4 = e16;
                      break;
                    }
                    let a3 = [];
                    for (let e16 = s4; e16 < n14.length; e16++) a3.push("..");
                    return (a3 = a3.concat(r13.slice(s4))).join("/");
                  }(t13, a2) : (e14 = a2.length > 1024 ? `<truncated>${a2.slice(-1024)}` : a2, (s3 = iZ.exec(e14)) ? s3.slice(1) : [])[2] || "";
                  r12.filename = `${n13}${o2}`;
                }
                return r12;
              };
            }({ isBrowser: r11, root: t12, prefix: n12 });
            return { name: "RewriteFrames", processEvent(e13) {
              let t13 = e13;
              return e13.exception && Array.isArray(e13.exception.values) && (t13 = function(e14) {
                try {
                  return { ...e14, exception: { ...e14.exception, values: e14.exception.values.map((e15) => {
                    var t14;
                    return { ...e15, ...e15.stacktrace && { stacktrace: { ...t14 = e15.stacktrace, frames: t14?.frames?.map((e16) => i4(e16)) } } };
                  }) } };
                } catch {
                  return e14;
                }
              }(t13)), t13;
            } };
          })({ iteratee: (e12) => (e12.filename = e12.filename?.replace(n11, "app:///_next"), e12) }), name: "DistDirRewriteFrames" };
        })({ distDirName: n10 }));
        let r10 = { defaultIntegrations: t10, release: process.env._sentryRelease || i1._sentryRelease, ...e10 };
        eh(r10, "nextjs", ["nextjs", "vercel-edge"]);
        let i3 = function(e11 = {}) {
          var t11, n11;
          let r11, i4, s2;
          function a2() {
            let e12 = r3(J.active());
            return e12 || { scope: (0, eF.getDefaultCurrentScope)(), isolationScope: (0, eF.getDefaultIsolationScope)() };
          }
          function u2() {
            return a2().scope;
          }
          function c2() {
            return a2().isolationScope;
          }
          if ((0, e$.setAsyncContextStrategy)({ withScope: function(e12) {
            let t12 = J.active();
            return J.with(t12, () => e12(u2()));
          }, withSetScope: function(e12, t12) {
            let n12 = e12[r5] || J.active();
            return J.with(n12.setValue(r2, e12), () => t12(e12));
          }, withSetIsolationScope: function(e12, t12) {
            let n12 = J.active();
            return J.with(n12.setValue(r4, e12), () => t12(c2()));
          }, withIsolationScope: function(e12) {
            let t12 = J.active();
            return J.with(t12.setValue(r1, true), () => e12(c2()));
          }, getCurrentScope: u2, getIsolationScope: c2, startSpan: i_, startSpanManual: ih, startInactiveSpan: ig, getActiveSpan: it, suppressTracing: iR, getTraceData: iA, continueTrace: iT, withActiveSpan: im }), (0, eE.getCurrentScope)().update(e11.initialScope), void 0 === e11.defaultIntegrations && (e11.defaultIntegrations = iY(e11)), void 0 === e11.dsn && process.env.SENTRY_DSN && (e11.dsn = process.env.SENTRY_DSN), void 0 === e11.tracesSampleRate && process.env.SENTRY_TRACES_SAMPLE_RATE) {
            let t12 = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE);
            isFinite(t12) && (e11.tracesSampleRate = t12);
          }
          if (void 0 === e11.release) {
            let t12 = function(e12) {
              if (process.env.SENTRY_RELEASE) return process.env.SENTRY_RELEASE;
              if (Z.GLOBAL_OBJ.SENTRY_RELEASE?.id) return Z.GLOBAL_OBJ.SENTRY_RELEASE.id;
              let t13 = process.env.GITHUB_SHA || process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_SHA || process.env.CI_BUILD_REF || process.env.CI_COMMIT_SHA || process.env.BITBUCKET_COMMIT, n12 = process.env.APPVEYOR_PULL_REQUEST_HEAD_COMMIT || process.env.APPVEYOR_REPO_COMMIT || process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || process.env.AWS_COMMIT_ID || process.env.BUILD_SOURCEVERSION || process.env.GIT_CLONE_COMMIT_HASH || process.env.BUDDY_EXECUTION_REVISION || process.env.BUILDKITE_COMMIT || process.env.CIRCLE_SHA1 || process.env.CIRRUS_CHANGE_IN_REPO || process.env.CF_REVISION || process.env.CM_COMMIT || process.env.CF_PAGES_COMMIT_SHA || process.env.DRONE_COMMIT_SHA || process.env.FC_GIT_COMMIT_SHA || process.env.HEROKU_TEST_RUN_COMMIT_VERSION || process.env.HEROKU_SLUG_COMMIT || process.env.RAILWAY_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT || process.env.SEMAPHORE_GIT_SHA || process.env.TRAVIS_PULL_REQUEST_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.VERCEL_GITLAB_COMMIT_SHA || process.env.VERCEL_BITBUCKET_COMMIT_SHA || process.env.ZEIT_GITHUB_COMMIT_SHA || process.env.ZEIT_GITLAB_COMMIT_SHA || process.env.ZEIT_BITBUCKET_COMMIT_SHA, r12 = process.env.CI_COMMIT_ID || process.env.SOURCE_COMMIT || process.env.SOURCE_VERSION || process.env.GIT_COMMIT || process.env.COMMIT_REF || process.env.BUILD_VCS_NUMBER || process.env.CI_COMMIT_SHA;
              return t13 || n12 || r12 || void 0;
            }();
            void 0 !== t12 && (e11.release = t12);
          }
          e11.environment = e11.environment || process.env.SENTRY_ENVIRONMENT || ((r11 = process.env.VERCEL_ENV) ? `vercel-${r11}` : void 0) || "production";
          let l2 = new nJ({ ...e11, stackParser: (0, ee.stackParserFromStackParserOptions)(e11.stackParser || iV), integrations: function(e12) {
            let t12, n12, r12 = e12.defaultIntegrations || [], i5 = e12.integrations;
            if (r12.forEach((e13) => {
              e13.isDefaultInstance = true;
            }), Array.isArray(i5)) t12 = [...r12, ...i5];
            else if ("function" == typeof i5) {
              let e13 = i5(r12);
              t12 = Array.isArray(e13) ? e13 : [e13];
            } else t12 = r12;
            return n12 = {}, t12.forEach((e13) => {
              let { name: t13 } = e13, r13 = n12[t13];
              r13 && !r13.isDefaultInstance && e13.isDefaultInstance || (n12[t13] = e13);
            }), Object.values(n12);
          }(e11), transport: e11.transport || i$ });
          return (0, eE.getCurrentScope)().setClient(l2), l2.init(), e11.skipOpenTelemetrySetup || ((t11 = l2).getOptions().debug && (nV.disable(), nV.setLogger({ error: Q.debug.error, warn: Q.debug.warn, info: Q.debug.log, debug: Q.debug.log, verbose: Q.debug.log }, o.DEBUG)), i4 = new rH({ sampler: new iM(t11), resource: nK().merge(nW({ "service.name": "edge", "service.namespace": "sentry", "service.version": e_.SDK_VERSION })), forceFlushTimeoutMillis: 500, spanProcessors: [new iD({ timeout: t11.getOptions().maxSpanWaitDuration })] }), s2 = (n11 = ij, class extends n11 {
            constructor(...e12) {
              super(...e12), ia("SentryContextManager");
            }
            with(e12, t12, n12, ...r12) {
              let i5 = r3(e12), s3 = i5?.scope || (0, eE.getCurrentScope)(), a3 = i5?.isolationScope || (0, eE.getIsolationScope)(), o2 = true === e12.getValue(r1), u3 = e12.getValue(r2), c3 = e12.getValue(r4), l3 = u3 || s3.clone(), p2 = r9(e12, { scope: l3, isolationScope: c3 || (o2 ? a3.clone() : a3) }).deleteValue(r1).deleteValue(r2).deleteValue(r4);
              return (0, eN.addNonEnumerableProperty)(l3, r5, p2), super.with(p2, t12, n12, ...r12);
            }
            getAsyncLocalStorageLookup() {
              return { asyncLocalStorage: this._asyncLocalStorage, contextSymbol: r0 };
            }
          }), to.setGlobalTracerProvider(i4), tA.setGlobalPropagator(new io()), J.setGlobalContextManager(new s2()), t11.traceProvider = i4, function() {
            if (!ix) return;
            let e12 = Array.from(is), t12 = ["SentryContextManager", "SentryPropagator"];
            for (let n12 of ((0, eD.hasSpansEnabled)() && t12.push("SentrySpanProcessor"), t12)) e12.includes(n12) || Q.debug.error(`You have to set up the ${n12}. Without this, the OpenTelemetry & Sentry integration will not work properly.`);
            e12.includes("SentrySampler") || Q.debug.warn("You have to set up the SentrySampler. Without this, the OpenTelemetry & Sentry integration may still work, but sample rates set for the Sentry SDK will not be respected. If you use a custom sampler, make sure to use `wrapSamplingDecision`.");
          }()), l2.on("createDsc", (e12, t12) => {
            if (!t12) return;
            let n12 = (0, el.spanToJSON)(t12).data[eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE], { description: r12 } = t12.name ? r7(t12) : { description: void 0 };
            if ("url" !== n12 && r12 && (e12.transaction = r12), (0, eD.hasSpansEnabled)()) {
              let n13 = r6(t12.spanContext());
              e12.sampled = void 0 == n13 ? void 0 : String(n13);
            }
          }), l2.on("preprocessEvent", (e12) => {
            let t12 = it();
            if (!t12 || "transaction" === e12.type) return;
            e12.contexts = { trace: (0, el.spanToTraceContext)(t12), ...e12.contexts };
            let n12 = (0, el.getRootSpan)(t12);
            return e12.sdkProcessingMetadata = { dynamicSamplingContext: (0, eB.getDynamicSamplingContextFromSpan)(n12), ...e12.sdkProcessingMetadata }, e12;
          }), l2;
        }(r10);
        i3?.on("spanStart", (e11) => {
          let t11 = (0, el.spanToJSON)(e11).data, n11 = (0, el.getRootSpan)(e11), r11 = e11 === n11;
          if (!function(e12, t12) {
            let n12 = t12?.[iz] === "Middleware.execute", r12 = t12?.[eg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN] === "auto.http.otel.node_fetch";
            if (!n12 && !r12) return;
            let i4 = function(e13) {
              let t13 = iq._sentryRewritesTunnelPath || process.env._sentryRewritesTunnelPath;
              if (!t13) return false;
              let n13 = e13["http.target"];
              return "string" == typeof n13 && (n13.split("?")[0] || "").startsWith(t13);
            }(t12 || {}), s2 = function(e13) {
              if (!(e13.attributes && "object" == typeof e13.attributes)) return false;
              let { attributes: t13 } = e13, n13 = t13["http.url"] || t13["url.full"];
              return !!n13 && eL(n13.toString(), (0, eE.getClient)());
            }(e12);
            (i4 || s2) && e12.setAttribute(iW, true);
          }(e11, t11), t11?.["next.span_type"] !== void 0 && e11.setAttribute(eg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, "auto"), t11?.["next.span_type"] === "Middleware.execute" && (e11.setAttribute(eg.SEMANTIC_ATTRIBUTE_SENTRY_OP, "http.server.middleware"), e11.setAttribute(eg.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, "url")), t11?.[iz] === "BaseServer.handleRequest" && r11) {
            let t12 = (0, em.getCapturedScopesOnSpan)(e11), n12 = (t12.isolationScope || (0, eE.getIsolationScope)()).clone(), r12 = t12.scope || (0, eE.getCurrentScope)(), i4 = J.active().getValue(tw);
            i4 && (i4.isolationScope = n12), (0, em.setCapturedScopesOnSpan)(e11, r12, n12);
          }
          r11 && function(e12, t12) {
            if (!e12) return;
            let n12 = e12 instanceof Headers || "object" == typeof e12 && "get" in e12 ? (0, iK.winterCGHeadersToDict)(e12) : e12, r12 = (0, iK.httpHeadersToSpanAttributes)(n12, (0, eE.getClient)()?.getOptions().sendDefaultPii ?? false);
            t12 && t12.setAttributes(r12);
          }((0, eE.getIsolationScope)().getScopeData().sdkProcessingMetadata?.normalizedRequest?.headers, n11);
        }), i3?.on("preprocessEvent", (e11) => {
          if ("transaction" === e11.type && e11.contexts?.trace?.data?.["next.span_type"] === "Middleware.execute" && e11.contexts?.trace?.data?.["next.span_name"] && e11.transaction) {
            let t11 = e11.contexts.trace.data["next.span_name"];
            if ("string" == typeof t11) {
              let n11 = t11.match(/^middleware (GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/);
              n11 ? e11.transaction = `middleware ${n11[1]}` : e11.transaction = eR(e11.contexts.trace.data["next.span_name"]);
            }
          }
          !function(e12) {
            var t11;
            let n11;
            if ("transaction" !== e12.type || e12.contexts?.trace?.op !== "http.server" || !e12.contexts?.trace?.data) return;
            let r11 = (0, eE.getClient)();
            if (!r11?.getOptions().sendDefaultPii) return;
            let i4 = e12.contexts.trace.data, s2 = i4["next.route"] || i4["http.route"], a2 = i4["http.target"];
            if (!s2) return;
            let o2 = e12.sdkProcessingMetadata?.capturedSpanIsolationScope?.getScopeData(), u2 = o2?.sdkProcessingMetadata?.normalizedRequest?.headers, c2 = (t11 = a2?.toString(), (n11 = function(e13) {
              let t12 = e13?.referer;
              if (t12) try {
                let e14 = new URL(t12);
                return eT(e14);
              } catch {
                return;
              }
            }(u2)) || function(e13, t12, n12, r12) {
              let i5, s3 = r12 ?? ((i5 = e13.split("/").filter((e14) => e14 && !(e14.startsWith("(") && e14.endsWith(")")))).length > 0 ? `/${i5.join("/")}` : "/"), a3 = n12?.["x-forwarded-proto"], o3 = n12?.["x-forwarded-host"] || n12?.host;
              if (!a3 || !o3) return s3;
              let u3 = ev(`${a3}://${o3}${s3}`);
              return u3 ? eT(u3) : s3;
            }(s2, 0, u2, t11));
            c2 && o2?.sdkProcessingMetadata && (o2.sdkProcessingMetadata.normalizedRequest = o2.sdkProcessingMetadata.normalizedRequest || {}, o2.sdkProcessingMetadata.normalizedRequest.url = c2);
          }(e11);
        }), i3?.on("spanEnd", (e11) => {
          e11 === (0, el.getRootSpan)(e11) && (0, iX.waitUntil)((0, iX.flushSafelyWithTimeout)());
        }), (0, eE.getGlobalScope)().addEventProcessor(Object.assign((e11) => "transaction" !== e11.type ? e11 : e11.contexts?.trace?.data?.[iW] ? null : e11, { id: "NextLowQualityTransactionsFilter" }));
        try {
          (0, eE.getGlobalScope)().setTag("turbopack", true);
        } catch {
        }
      }({ dsn: i2, sendDefaultPii: false, tracesSampleRate: 0.1, environment: "production" }), e.s([], 925973);
    }]);
  }
});

// .next/server/edge/chunks/node_modules_@sentry_f05d8265._.js
var require_node_modules_sentry_f05d8265 = __commonJS({
  ".next/server/edge/chunks/node_modules_@sentry_f05d8265._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/node_modules_@sentry_f05d8265._.js", 935872, (t) => {
      "use strict";
      t.s(["SDK_VERSION", () => "10.38.0"]);
    }, 499219, (t) => {
      "use strict";
      let e = globalThis;
      t.s(["GLOBAL_OBJ", () => e]);
    }, 102393, (t) => {
      "use strict";
      var e = t.i(935872), n = t.i(499219);
      function r() {
        return i(n.GLOBAL_OBJ), n.GLOBAL_OBJ;
      }
      function i(t2) {
        let n2 = t2.__SENTRY__ = t2.__SENTRY__ || {};
        return n2.version = n2.version || e.SDK_VERSION, n2[e.SDK_VERSION] = n2[e.SDK_VERSION] || {};
      }
      function s(t2, r2, i2 = n.GLOBAL_OBJ) {
        let a = i2.__SENTRY__ = i2.__SENTRY__ || {}, o = a[e.SDK_VERSION] = a[e.SDK_VERSION] || {};
        return o[t2] || (o[t2] = r2());
      }
      t.s(["getGlobalSingleton", () => s, "getMainCarrier", () => r, "getSentryCarrier", () => i]);
    }, 257493, (t) => {
      "use strict";
      let e = "u" < typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__;
      t.s(["DEBUG_BUILD", () => e]);
    }, 147660, 966474, (t) => {
      "use strict";
      let e = Object.prototype.toString;
      function n(t2) {
        switch (e.call(t2)) {
          case "[object Error]":
          case "[object Exception]":
          case "[object DOMException]":
          case "[object WebAssembly.Exception]":
            return true;
          default:
            return g(t2, Error);
        }
      }
      function r(t2, n2) {
        return e.call(t2) === `[object ${n2}]`;
      }
      function i(t2) {
        return r(t2, "ErrorEvent");
      }
      function s(t2) {
        return r(t2, "String");
      }
      function a(t2) {
        return "object" == typeof t2 && null !== t2 && "__sentry_template_string__" in t2 && "__sentry_template_values__" in t2;
      }
      function o(t2) {
        return null === t2 || a(t2) || "object" != typeof t2 && "function" != typeof t2;
      }
      function c(t2) {
        return r(t2, "Object");
      }
      function u(t2) {
        return "u" > typeof Event && g(t2, Event);
      }
      function l(t2) {
        return "u" > typeof Element && g(t2, Element);
      }
      function p(t2) {
        return r(t2, "RegExp");
      }
      function d(t2) {
        return !!(t2?.then && "function" == typeof t2.then);
      }
      function _(t2) {
        return c(t2) && "nativeEvent" in t2 && "preventDefault" in t2 && "stopPropagation" in t2;
      }
      function g(t2, e2) {
        try {
          return t2 instanceof e2;
        } catch {
          return false;
        }
      }
      function f(t2) {
        return !!("object" == typeof t2 && null !== t2 && (t2.__isVue || t2._isVue || t2.__v_isVNode));
      }
      function h(t2) {
        return "u" > typeof Request && g(t2, Request);
      }
      t.s(["isElement", () => l, "isError", () => n, "isErrorEvent", () => i, "isEvent", () => u, "isInstanceOf", () => g, "isParameterizedString", () => a, "isPlainObject", () => c, "isPrimitive", () => o, "isRegExp", () => p, "isRequest", () => h, "isString", () => s, "isSyntheticEvent", () => _, "isThenable", () => d, "isVueViewModel", () => f], 966474);
      let m = t.i(499219).GLOBAL_OBJ;
      function S(t2, e2 = {}) {
        if (!t2) return "<unknown>";
        try {
          let n2, r2 = t2, i2 = [], a2 = 0, o2 = 0, c2 = Array.isArray(e2) ? e2 : e2.keyAttrs, u2 = !Array.isArray(e2) && e2.maxStringLength || 80;
          for (; r2 && a2++ < 5 && (n2 = function(t3, e3) {
            let n3 = [];
            if (!t3?.tagName) return "";
            if (m.HTMLElement && t3 instanceof HTMLElement && t3.dataset) {
              if (t3.dataset.sentryComponent) return t3.dataset.sentryComponent;
              if (t3.dataset.sentryElement) return t3.dataset.sentryElement;
            }
            n3.push(t3.tagName.toLowerCase());
            let r3 = e3?.length ? e3.filter((e4) => t3.getAttribute(e4)).map((e4) => [e4, t3.getAttribute(e4)]) : null;
            if (r3?.length) r3.forEach((t4) => {
              n3.push(`[${t4[0]}="${t4[1]}"]`);
            });
            else {
              t3.id && n3.push(`#${t3.id}`);
              let e4 = t3.className;
              if (e4 && s(e4)) for (let t4 of e4.split(/\s+/)) n3.push(`.${t4}`);
            }
            for (let e4 of ["aria-label", "type", "name", "title", "alt"]) {
              let r4 = t3.getAttribute(e4);
              r4 && n3.push(`[${e4}="${r4}"]`);
            }
            return n3.join("");
          }(r2, c2), "html" !== n2 && (!(a2 > 1) || !(o2 + 3 * i2.length + n2.length >= u2))); ) i2.push(n2), o2 += n2.length, r2 = r2.parentNode;
          return i2.reverse().join(" > ");
        } catch {
          return "<unknown>";
        }
      }
      t.s(["htmlTreeAsString", () => S], 147660);
    }, 20174, (t) => {
      "use strict";
      var e = t.i(102393), n = t.i(257493), r = t.i(499219);
      let i = ["debug", "info", "warn", "error", "log", "assert", "trace"], s = {};
      function a(t2) {
        if (!("console" in r.GLOBAL_OBJ)) return t2();
        let e2 = r.GLOBAL_OBJ.console, n2 = {}, i2 = Object.keys(s);
        i2.forEach((t3) => {
          let r2 = s[t3];
          n2[t3] = e2[t3], e2[t3] = r2;
        });
        try {
          return t2();
        } finally {
          i2.forEach((t3) => {
            e2[t3] = n2[t3];
          });
        }
      }
      function o() {
        return u().enabled;
      }
      function c(t2, ...e2) {
        n.DEBUG_BUILD && o() && a(() => {
          r.GLOBAL_OBJ.console[t2](`Sentry Logger [${t2}]:`, ...e2);
        });
      }
      function u() {
        return n.DEBUG_BUILD ? (0, e.getGlobalSingleton)("loggerSettings", () => ({ enabled: false })) : { enabled: false };
      }
      let l = { enable: function() {
        u().enabled = true;
      }, disable: function() {
        u().enabled = false;
      }, isEnabled: o, log: function(...t2) {
        c("log", ...t2);
      }, warn: function(...t2) {
        c("warn", ...t2);
      }, error: function(...t2) {
        c("error", ...t2);
      } };
      t.s(["CONSOLE_LEVELS", () => i, "consoleSandbox", () => a, "debug", () => l, "originalConsoleMethods", () => s]);
    }, 187709, 883250, (t) => {
      "use strict";
      let e;
      var n = t.i(257493), r = t.i(147660), i = t.i(20174), s = t.i(966474);
      function a(t2, e2, r2) {
        if (!(e2 in t2)) return;
        let s2 = t2[e2];
        if ("function" != typeof s2) return;
        let a2 = r2(s2);
        "function" == typeof a2 && function(t3, e3) {
          try {
            let n2 = e3.prototype || {};
            t3.prototype = e3.prototype = n2, o(t3, "__sentry_original__", e3);
          } catch {
          }
        }(a2, s2);
        try {
          t2[e2] = a2;
        } catch {
          n.DEBUG_BUILD && i.debug.log(`Failed to replace method "${e2}" in object`, t2);
        }
      }
      function o(t2, e2, r2) {
        try {
          Object.defineProperty(t2, e2, { value: r2, writable: true, configurable: true });
        } catch {
          n.DEBUG_BUILD && i.debug.log(`Failed to add non-enumerable property "${e2}" to object`, t2);
        }
      }
      function c(t2) {
        return t2.__sentry_original__;
      }
      function u(t2) {
        if ((0, s.isError)(t2)) return { message: t2.message, name: t2.name, stack: t2.stack, ...p(t2) };
        if (!(0, s.isEvent)(t2)) return t2;
        {
          let e2 = { type: t2.type, target: l(t2.target), currentTarget: l(t2.currentTarget), ...p(t2) };
          return "u" > typeof CustomEvent && (0, s.isInstanceOf)(t2, CustomEvent) && (e2.detail = t2.detail), e2;
        }
      }
      function l(t2) {
        try {
          return (0, s.isElement)(t2) ? (0, r.htmlTreeAsString)(t2) : Object.prototype.toString.call(t2);
        } catch {
          return "<unknown>";
        }
      }
      function p(t2) {
        if ("object" != typeof t2 || null === t2) return {};
        {
          let e2 = {};
          for (let n2 in t2) Object.prototype.hasOwnProperty.call(t2, n2) && (e2[n2] = t2[n2]);
          return e2;
        }
      }
      function d(t2) {
        let e2 = Object.keys(u(t2));
        return e2.sort(), e2[0] ? e2.join(", ") : "[object has no keys]";
      }
      t.s(["addNonEnumerableProperty", () => o, "convertToPlainObject", () => u, "extractExceptionKeysForMessage", () => d, "fill", () => a, "getOriginalFunction", () => c], 187709);
      var _ = t.i(499219);
      function g(t2) {
        if (void 0 !== e) return e ? e(t2) : t2();
        let n2 = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__"), r2 = _.GLOBAL_OBJ;
        return n2 in r2 && "function" == typeof r2[n2] ? (e = r2[n2])(t2) : (e = null, t2());
      }
      function f() {
        return g(() => Math.random());
      }
      function h() {
        return g(() => Date.now());
      }
      t.s(["safeDateNow", () => h, "safeMathRandom", () => f, "withRandomSafeContext", () => g], 883250);
    }, 224058, (t) => {
      "use strict";
      let e = /\(error: (.*)\)/, n = /captureMessage|captureException/;
      function r(...t2) {
        let i2 = t2.sort((t3, e2) => t3[0] - e2[0]).map((t3) => t3[1]);
        return (t3, r2 = 0, a2 = 0) => {
          let o2 = [], c2 = t3.split("\n");
          for (let t4 = r2; t4 < c2.length; t4++) {
            let n2 = c2[t4];
            n2.length > 1024 && (n2 = n2.slice(0, 1024));
            let r3 = e.test(n2) ? n2.replace(e, "$1") : n2;
            if (!r3.match(/\S*Error: /)) {
              for (let t5 of i2) {
                let e2 = t5(r3);
                if (e2) {
                  o2.push(e2);
                  break;
                }
              }
              if (o2.length >= 50 + a2) break;
            }
          }
          var u2 = o2.slice(a2);
          if (!u2.length) return [];
          let l2 = Array.from(u2);
          return /sentryWrapped/.test(s(l2).function || "") && l2.pop(), l2.reverse(), n.test(s(l2).function || "") && (l2.pop(), n.test(s(l2).function || "") && l2.pop()), l2.slice(0, 50).map((t4) => ({ ...t4, filename: t4.filename || s(l2).filename, function: t4.function || "?" }));
        };
      }
      function i(t2) {
        return Array.isArray(t2) ? r(...t2) : t2;
      }
      function s(t2) {
        return t2[t2.length - 1] || {};
      }
      let a = "<anonymous>";
      function o(t2) {
        try {
          if (!t2 || "function" != typeof t2) return a;
          return t2.name || a;
        } catch {
          return a;
        }
      }
      function c(t2) {
        let e2 = t2.exception;
        if (e2) {
          let t3 = [];
          try {
            return e2.values.forEach((e3) => {
              e3.stacktrace.frames && t3.push(...e3.stacktrace.frames);
            }), t3;
          } catch {
          }
        }
      }
      function u(t2) {
        return "__v_isVNode" in t2 && t2.__v_isVNode ? "[VueVNode]" : "[VueViewModel]";
      }
      function l(t2) {
        let e2 = t2?.startsWith("file://") ? t2.slice(7) : t2;
        return e2?.match(/\/[A-Z]:/) && (e2 = e2.slice(1)), e2;
      }
      t.s(["UNKNOWN_FUNCTION", () => "?", "createStackParser", () => r, "getFramesFromEvent", () => c, "getFunctionName", () => o, "getVueInternalName", () => u, "normalizeStackTracePath", () => l, "stackParserFromStackParserOptions", () => i]);
    }, 505893, 257645, 775403, 57890, 298881, 274779, 699316, 652434, 392906, 50850, 294482, (t) => {
      "use strict";
      let e, n;
      var r = t.i(102393), i = t.i(257493), s = t.i(187709), a = t.i(883250), o = t.i(966474), c = t.i(224058);
      function u(t2, e2 = 0) {
        return "string" != typeof t2 || 0 === e2 || t2.length <= e2 ? t2 : `${t2.slice(0, e2)}...`;
      }
      function l(t2, e2) {
        let n2 = t2, r2 = n2.length;
        if (r2 <= 150) return n2;
        e2 > r2 && (e2 = r2);
        let i2 = Math.max(e2 - 60, 0);
        i2 < 5 && (i2 = 0);
        let s2 = Math.min(i2 + 140, r2);
        return s2 > r2 - 5 && (s2 = r2), s2 === r2 && (i2 = Math.max(s2 - 140, 0)), n2 = n2.slice(i2, s2), i2 > 0 && (n2 = `'{snip} ${n2}`), s2 < r2 && (n2 += " {snip}"), n2;
      }
      function p(t2, e2) {
        if (!Array.isArray(t2)) return "";
        let n2 = [];
        for (let e3 = 0; e3 < t2.length; e3++) {
          let r2 = t2[e3];
          try {
            (0, o.isVueViewModel)(r2) ? n2.push((0, c.getVueInternalName)(r2)) : n2.push(String(r2));
          } catch {
            n2.push("[value cannot be serialized]");
          }
        }
        return n2.join(e2);
      }
      function d(t2, e2, n2 = false) {
        return !!(0, o.isString)(t2) && ((0, o.isRegExp)(e2) ? e2.test(t2) : !!(0, o.isString)(e2) && (n2 ? t2 === e2 : t2.includes(e2)));
      }
      function _(t2, e2 = [], n2 = false) {
        return e2.some((e3) => d(t2, e3, n2));
      }
      t.s(["isMatchingPattern", () => d, "safeJoin", () => p, "snipLine", () => l, "stringMatchesSomePattern", () => _, "truncate", () => u], 257645);
      var g = t.i(499219);
      function f(t2 = function() {
        let t3 = g.GLOBAL_OBJ;
        return t3.crypto || t3.msCrypto;
      }()) {
        try {
          if (t2?.randomUUID) return (0, a.withRandomSafeContext)(() => t2.randomUUID()).replace(/-/g, "");
        } catch {
        }
        return e || (e = "10000000100040008000100000000000"), e.replace(/[018]/g, (t3) => (t3 ^ (15 & 16 * (0, a.safeMathRandom)()) >> t3 / 4).toString(16));
      }
      function h(t2) {
        return t2.exception?.values?.[0];
      }
      function m(t2) {
        let { message: e2, event_id: n2 } = t2;
        if (e2) return e2;
        let r2 = h(t2);
        return r2 ? r2.type && r2.value ? `${r2.type}: ${r2.value}` : r2.type || r2.value || n2 || "<unknown>" : n2 || "<unknown>";
      }
      function S(t2, e2, n2) {
        let r2 = t2.exception = t2.exception || {}, i2 = r2.values = r2.values || [], s2 = i2[0] = i2[0] || {};
        s2.value || (s2.value = e2 || ""), s2.type || (s2.type = n2 || "Error");
      }
      function E(t2, e2) {
        let n2 = h(t2);
        if (!n2) return;
        let r2 = n2.mechanism;
        if (n2.mechanism = { type: "generic", handled: true, ...r2, ...e2 }, e2 && "data" in e2) {
          let t3 = { ...r2?.data, ...e2.data };
          n2.mechanism.data = t3;
        }
      }
      function T(t2) {
        if (function(t3) {
          try {
            return t3.__sentry_captured__;
          } catch {
          }
        }(t2)) return true;
        try {
          (0, s.addNonEnumerableProperty)(t2, "__sentry_captured__", true);
        } catch {
        }
        return false;
      }
      function y() {
        return (0, a.safeDateNow)() / 1e3;
      }
      function b() {
        return (n ?? (n = function() {
          let { performance: t2 } = g.GLOBAL_OBJ;
          if (!t2?.now || !t2.timeOrigin) return y;
          let e2 = t2.timeOrigin;
          return () => (e2 + (0, a.withRandomSafeContext)(() => t2.now())) / 1e3;
        }()))();
      }
      function v(t2) {
        let e2 = b(), n2 = { sid: f(), init: true, timestamp: e2, started: e2, duration: 0, status: "ok", errors: 0, ignoreDuration: false, toJSON: () => {
          var t3;
          return t3 = n2, { sid: `${t3.sid}`, init: t3.init, started: new Date(1e3 * t3.started).toISOString(), timestamp: new Date(1e3 * t3.timestamp).toISOString(), status: t3.status, errors: t3.errors, did: "number" == typeof t3.did || "string" == typeof t3.did ? `${t3.did}` : void 0, duration: t3.duration, abnormal_mechanism: t3.abnormal_mechanism, attrs: { release: t3.release, environment: t3.environment, ip_address: t3.ipAddress, user_agent: t3.userAgent } };
        } };
        return t2 && I(n2, t2), n2;
      }
      function I(t2, e2 = {}) {
        if (e2.user && (!t2.ipAddress && e2.user.ip_address && (t2.ipAddress = e2.user.ip_address), t2.did || e2.did || (t2.did = e2.user.id || e2.user.email || e2.user.username)), t2.timestamp = e2.timestamp || b(), e2.abnormal_mechanism && (t2.abnormal_mechanism = e2.abnormal_mechanism), e2.ignoreDuration && (t2.ignoreDuration = e2.ignoreDuration), e2.sid && (t2.sid = 32 === e2.sid.length ? e2.sid : f()), void 0 !== e2.init && (t2.init = e2.init), !t2.did && e2.did && (t2.did = `${e2.did}`), "number" == typeof e2.started && (t2.started = e2.started), t2.ignoreDuration) t2.duration = void 0;
        else if ("number" == typeof e2.duration) t2.duration = e2.duration;
        else {
          let e3 = t2.timestamp - t2.started;
          t2.duration = e3 >= 0 ? e3 : 0;
        }
        e2.release && (t2.release = e2.release), e2.environment && (t2.environment = e2.environment), !t2.ipAddress && e2.ipAddress && (t2.ipAddress = e2.ipAddress), !t2.userAgent && e2.userAgent && (t2.userAgent = e2.userAgent), "number" == typeof e2.errors && (t2.errors = e2.errors), e2.status && (t2.status = e2.status);
      }
      function A(t2, e2) {
        let n2 = {};
        e2 ? n2 = { status: e2 } : "ok" === t2.status && (n2 = { status: "exited" }), I(t2, n2);
      }
      t.s(["addExceptionMechanism", () => E, "addExceptionTypeValue", () => S, "checkOrSetAlreadyCaught", () => T, "getEventDescription", () => m, "uuid4", () => f], 775403), t.s(["dateTimestampInSeconds", () => y, "timestampInSeconds", () => b], 57890), t.s(["closeSession", () => A, "makeSession", () => v, "updateSession", () => I], 298881);
      var C = t.i(20174);
      function N(t2, e2, n2 = 2) {
        if (!e2 || "object" != typeof e2 || n2 <= 0) return e2;
        if (t2 && 0 === Object.keys(e2).length) return t2;
        let r2 = { ...t2 };
        for (let t3 in e2) Object.prototype.hasOwnProperty.call(e2, t3) && (r2[t3] = N(r2[t3], e2[t3], n2 - 1));
        return r2;
      }
      function x() {
        return f();
      }
      function R() {
        return f().substring(16);
      }
      t.s(["merge", () => N], 274779), t.s(["generateSpanId", () => R, "generateTraceId", () => x], 699316);
      let O = "_sentrySpan";
      function D(t2, e2) {
        e2 ? (0, s.addNonEnumerableProperty)(t2, O, e2) : delete t2[O];
      }
      function U(t2) {
        return t2[O];
      }
      t.s(["_getSpanForScope", () => U, "_setSpanForScope", () => D], 652434);
      class B {
        constructor() {
          this._notifyingListeners = false, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._attachments = [], this._user = {}, this._tags = {}, this._attributes = {}, this._extra = {}, this._contexts = {}, this._sdkProcessingMetadata = {}, this._propagationContext = { traceId: x(), sampleRand: (0, a.safeMathRandom)() };
        }
        clone() {
          let t2 = new B();
          return t2._breadcrumbs = [...this._breadcrumbs], t2._tags = { ...this._tags }, t2._attributes = { ...this._attributes }, t2._extra = { ...this._extra }, t2._contexts = { ...this._contexts }, this._contexts.flags && (t2._contexts.flags = { values: [...this._contexts.flags.values] }), t2._user = this._user, t2._level = this._level, t2._session = this._session, t2._transactionName = this._transactionName, t2._fingerprint = this._fingerprint, t2._eventProcessors = [...this._eventProcessors], t2._attachments = [...this._attachments], t2._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }, t2._propagationContext = { ...this._propagationContext }, t2._client = this._client, t2._lastEventId = this._lastEventId, t2._conversationId = this._conversationId, D(t2, this[O]), t2;
        }
        setClient(t2) {
          this._client = t2;
        }
        setLastEventId(t2) {
          this._lastEventId = t2;
        }
        getClient() {
          return this._client;
        }
        lastEventId() {
          return this._lastEventId;
        }
        addScopeListener(t2) {
          this._scopeListeners.push(t2);
        }
        addEventProcessor(t2) {
          return this._eventProcessors.push(t2), this;
        }
        setUser(t2) {
          return this._user = t2 || { email: void 0, id: void 0, ip_address: void 0, username: void 0 }, this._session && I(this._session, { user: t2 }), this._notifyScopeListeners(), this;
        }
        getUser() {
          return this._user;
        }
        setConversationId(t2) {
          return this._conversationId = t2 || void 0, this._notifyScopeListeners(), this;
        }
        setTags(t2) {
          return this._tags = { ...this._tags, ...t2 }, this._notifyScopeListeners(), this;
        }
        setTag(t2, e2) {
          return this.setTags({ [t2]: e2 });
        }
        setAttributes(t2) {
          return this._attributes = { ...this._attributes, ...t2 }, this._notifyScopeListeners(), this;
        }
        setAttribute(t2, e2) {
          return this.setAttributes({ [t2]: e2 });
        }
        removeAttribute(t2) {
          return t2 in this._attributes && (delete this._attributes[t2], this._notifyScopeListeners()), this;
        }
        setExtras(t2) {
          return this._extra = { ...this._extra, ...t2 }, this._notifyScopeListeners(), this;
        }
        setExtra(t2, e2) {
          return this._extra = { ...this._extra, [t2]: e2 }, this._notifyScopeListeners(), this;
        }
        setFingerprint(t2) {
          return this._fingerprint = t2, this._notifyScopeListeners(), this;
        }
        setLevel(t2) {
          return this._level = t2, this._notifyScopeListeners(), this;
        }
        setTransactionName(t2) {
          return this._transactionName = t2, this._notifyScopeListeners(), this;
        }
        setContext(t2, e2) {
          return null === e2 ? delete this._contexts[t2] : this._contexts[t2] = e2, this._notifyScopeListeners(), this;
        }
        setSession(t2) {
          return t2 ? this._session = t2 : delete this._session, this._notifyScopeListeners(), this;
        }
        getSession() {
          return this._session;
        }
        update(t2) {
          if (!t2) return this;
          let e2 = "function" == typeof t2 ? t2(this) : t2, { tags: n2, attributes: r2, extra: i2, user: s2, contexts: a2, level: c2, fingerprint: u2 = [], propagationContext: l2, conversationId: p2 } = (e2 instanceof B ? e2.getScopeData() : (0, o.isPlainObject)(e2) ? t2 : void 0) || {};
          return this._tags = { ...this._tags, ...n2 }, this._attributes = { ...this._attributes, ...r2 }, this._extra = { ...this._extra, ...i2 }, this._contexts = { ...this._contexts, ...a2 }, s2 && Object.keys(s2).length && (this._user = s2), c2 && (this._level = c2), u2.length && (this._fingerprint = u2), l2 && (this._propagationContext = l2), p2 && (this._conversationId = p2), this;
        }
        clear() {
          return this._breadcrumbs = [], this._tags = {}, this._attributes = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._session = void 0, this._conversationId = void 0, D(this, void 0), this._attachments = [], this.setPropagationContext({ traceId: x(), sampleRand: (0, a.safeMathRandom)() }), this._notifyScopeListeners(), this;
        }
        addBreadcrumb(t2, e2) {
          let n2 = "number" == typeof e2 ? e2 : 100;
          if (n2 <= 0) return this;
          let r2 = { timestamp: y(), ...t2, message: t2.message ? u(t2.message, 2048) : t2.message };
          return this._breadcrumbs.push(r2), this._breadcrumbs.length > n2 && (this._breadcrumbs = this._breadcrumbs.slice(-n2), this._client?.recordDroppedEvent("buffer_overflow", "log_item")), this._notifyScopeListeners(), this;
        }
        getLastBreadcrumb() {
          return this._breadcrumbs[this._breadcrumbs.length - 1];
        }
        clearBreadcrumbs() {
          return this._breadcrumbs = [], this._notifyScopeListeners(), this;
        }
        addAttachment(t2) {
          return this._attachments.push(t2), this;
        }
        clearAttachments() {
          return this._attachments = [], this;
        }
        getScopeData() {
          return { breadcrumbs: this._breadcrumbs, attachments: this._attachments, contexts: this._contexts, tags: this._tags, attributes: this._attributes, extra: this._extra, user: this._user, level: this._level, fingerprint: this._fingerprint || [], eventProcessors: this._eventProcessors, propagationContext: this._propagationContext, sdkProcessingMetadata: this._sdkProcessingMetadata, transactionName: this._transactionName, span: this[O], conversationId: this._conversationId };
        }
        setSDKProcessingMetadata(t2) {
          return this._sdkProcessingMetadata = N(this._sdkProcessingMetadata, t2, 2), this;
        }
        setPropagationContext(t2) {
          return this._propagationContext = t2, this;
        }
        getPropagationContext() {
          return this._propagationContext;
        }
        captureException(t2, e2) {
          let n2 = e2?.event_id || f();
          if (!this._client) return i.DEBUG_BUILD && C.debug.warn("No client configured on scope - will not capture exception!"), n2;
          let r2 = Error("Sentry syntheticException");
          return this._client.captureException(t2, { originalException: t2, syntheticException: r2, ...e2, event_id: n2 }, this), n2;
        }
        captureMessage(t2, e2, n2) {
          let r2 = n2?.event_id || f();
          if (!this._client) return i.DEBUG_BUILD && C.debug.warn("No client configured on scope - will not capture message!"), r2;
          let s2 = n2?.syntheticException ?? Error(t2);
          return this._client.captureMessage(t2, e2, { originalException: t2, syntheticException: s2, ...n2, event_id: r2 }, this), r2;
        }
        captureEvent(t2, e2) {
          let n2 = e2?.event_id || f();
          return this._client ? this._client.captureEvent(t2, { ...e2, event_id: n2 }, this) : i.DEBUG_BUILD && C.debug.warn("No client configured on scope - will not capture event!"), n2;
        }
        _notifyScopeListeners() {
          this._notifyingListeners || (this._notifyingListeners = true, this._scopeListeners.forEach((t2) => {
            t2(this);
          }), this._notifyingListeners = false);
        }
      }
      function k() {
        return (0, r.getGlobalSingleton)("defaultCurrentScope", () => new B());
      }
      function w() {
        return (0, r.getGlobalSingleton)("defaultIsolationScope", () => new B());
      }
      t.s(["Scope", () => B], 392906), t.s(["getDefaultCurrentScope", () => k, "getDefaultIsolationScope", () => w], 50850);
      class L {
        constructor(t2, e2) {
          let n2, r2;
          n2 = t2 || new B(), r2 = e2 || new B(), this._stack = [{ scope: n2 }], this._isolationScope = r2;
        }
        withScope(t2) {
          let e2, n2 = this._pushScope();
          try {
            e2 = t2(n2);
          } catch (t3) {
            throw this._popScope(), t3;
          }
          return (0, o.isThenable)(e2) ? e2.then((t3) => (this._popScope(), t3), (t3) => {
            throw this._popScope(), t3;
          }) : (this._popScope(), e2);
        }
        getClient() {
          return this.getStackTop().client;
        }
        getScope() {
          return this.getStackTop().scope;
        }
        getIsolationScope() {
          return this._isolationScope;
        }
        getStackTop() {
          return this._stack[this._stack.length - 1];
        }
        _pushScope() {
          let t2 = this.getScope().clone();
          return this._stack.push({ client: this.getClient(), scope: t2 }), t2;
        }
        _popScope() {
          return !(this._stack.length <= 1) && !!this._stack.pop();
        }
      }
      function M() {
        let t2 = (0, r.getMainCarrier)(), e2 = (0, r.getSentryCarrier)(t2);
        return e2.stack = e2.stack || new L(k(), w());
      }
      function P(t2) {
        return M().withScope(t2);
      }
      function $(t2, e2) {
        let n2 = M();
        return n2.withScope(() => (n2.getStackTop().scope = t2, e2(t2)));
      }
      function G(t2) {
        return M().withScope(() => t2(M().getIsolationScope()));
      }
      function j(t2) {
        let e2 = (0, r.getMainCarrier)();
        (0, r.getSentryCarrier)(e2).acs = t2;
      }
      function F(t2) {
        let e2 = (0, r.getSentryCarrier)(t2);
        return e2.acs ? e2.acs : { withIsolationScope: G, withScope: P, withSetScope: $, withSetIsolationScope: (t3, e3) => G(e3), getCurrentScope: () => M().getScope(), getIsolationScope: () => M().getIsolationScope() };
      }
      function J() {
        return F((0, r.getMainCarrier)()).getCurrentScope();
      }
      function Y() {
        return F((0, r.getMainCarrier)()).getIsolationScope();
      }
      function V() {
        return (0, r.getGlobalSingleton)("globalScope", () => new B());
      }
      function z(...t2) {
        let e2 = F((0, r.getMainCarrier)());
        if (2 === t2.length) {
          let [n2, r2] = t2;
          return n2 ? e2.withSetScope(n2, r2) : e2.withScope(r2);
        }
        return e2.withScope(t2[0]);
      }
      function H(...t2) {
        let e2 = F((0, r.getMainCarrier)());
        if (2 === t2.length) {
          let [n2, r2] = t2;
          return n2 ? e2.withSetIsolationScope(n2, r2) : e2.withIsolationScope(r2);
        }
        return e2.withIsolationScope(t2[0]);
      }
      function K() {
        return J().getClient();
      }
      function W(t2) {
        let { traceId: e2, parentSpanId: n2, propagationSpanId: r2 } = t2.getPropagationContext(), i2 = { trace_id: e2, span_id: r2 || R() };
        return n2 && (i2.parent_span_id = n2), i2;
      }
      t.s(["getAsyncContextStrategy", () => F, "setAsyncContextStrategy", () => j], 294482), t.s(["getClient", () => K, "getCurrentScope", () => J, "getGlobalScope", () => V, "getIsolationScope", () => Y, "getTraceContextFromScope", () => W, "withIsolationScope", () => H, "withScope", () => z], 505893);
    }, 830232, (t) => {
      "use strict";
      function e(t2) {
        let e2 = {};
        try {
          t2.forEach((t3, n2) => {
            "string" == typeof t3 && (e2[n2] = t3);
          });
        } catch {
        }
        return e2;
      }
      function n(t2) {
        let e2 = /* @__PURE__ */ Object.create(null);
        try {
          Object.entries(t2).forEach(([t3, n2]) => {
            "string" == typeof n2 && (e2[t3] = n2);
          });
        } catch {
        }
        return e2;
      }
      let r = ["auth", "token", "secret", "session", "password", "passwd", "pwd", "key", "jwt", "bearer", "sso", "saml", "csrf", "xsrf", "credentials", "set-cookie", "cookie"], i = ["x-forwarded-", "-user"];
      function s(t2, e2 = false) {
        let n2 = {};
        try {
          Object.entries(t2).forEach(([t3, r2]) => {
            if (null == r2) return;
            let i2 = t3.toLowerCase();
            if (("cookie" === i2 || "set-cookie" === i2) && "string" == typeof r2 && "" !== r2) {
              let t4 = "set-cookie" === i2, s2 = r2.indexOf(";"), a2 = t4 && -1 !== s2 ? r2.substring(0, s2) : r2;
              for (let r3 of t4 ? [a2] : a2.split("; ")) {
                let t5 = r3.indexOf("="), s3 = -1 !== t5 ? r3.substring(0, t5) : r3, a3 = -1 !== t5 ? r3.substring(t5 + 1) : "", c = s3.toLowerCase();
                o(n2, i2, c, a3, e2);
              }
            } else o(n2, i2, "", r2, e2);
          });
        } catch {
        }
        return n2;
      }
      function a(t2) {
        return t2.replace(/-/g, "_");
      }
      function o(t2, e2, n2, s2, o2) {
        var c, u;
        let l = n2 ? `http.request.header.${a(e2)}.${a(n2)}` : `http.request.header.${a(e2)}`, p = (c = n2 || e2, u = s2, (o2 ? r.some((t3) => c.includes(t3)) : [...i, ...r].some((t3) => c.includes(t3))) ? "[Filtered]" : Array.isArray(u) ? u.map((t3) => null != t3 ? String(t3) : t3).join(";") : "string" == typeof u ? u : void 0);
        void 0 !== p && (t2[l] = p);
      }
      t.s(["headersToDict", () => n, "httpHeadersToSpanAttributes", () => s, "winterCGHeadersToDict", () => e]);
    }, 412115, (t) => {
      "use strict";
      t.s(["GEN_AI_CONVERSATION_ID_ATTRIBUTE", () => "gen_ai.conversation.id", "SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME", () => "sentry.exclusive_time", "SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD", () => "http.request.method", "SEMANTIC_ATTRIBUTE_PROFILE_ID", () => "sentry.profile_id", "SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME", () => "sentry.custom_span_name", "SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT", () => "sentry.measurement_unit", "SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE", () => "sentry.measurement_value", "SEMANTIC_ATTRIBUTE_SENTRY_OP", () => "sentry.op", "SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN", () => "sentry.origin", "SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE", () => "sentry.previous_trace_sample_rate", "SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE", () => "sentry.sample_rate", "SEMANTIC_ATTRIBUTE_SENTRY_SOURCE", () => "sentry.source", "SEMANTIC_ATTRIBUTE_URL_FULL", () => "url.full"]);
    }, 765434, (t) => {
      "use strict";
      var e = t.i(257493), n = t.i(20174), r = t.i(966474);
      let i = "sentry-", s = /^sentry-/;
      function a(t2) {
        let e2 = c(t2);
        if (!e2) return;
        let n2 = Object.entries(e2).reduce((t3, [e3, n3]) => (e3.match(s) && (t3[e3.slice(i.length)] = n3), t3), {});
        return Object.keys(n2).length > 0 ? n2 : void 0;
      }
      function o(t2) {
        if (t2) {
          var r2 = Object.entries(t2).reduce((t3, [e2, n2]) => (n2 && (t3[`${i}${e2}`] = n2), t3), {});
          return 0 !== Object.keys(r2).length ? Object.entries(r2).reduce((t3, [r3, i2], s2) => {
            let a2 = `${encodeURIComponent(r3)}=${encodeURIComponent(i2)}`, o2 = 0 === s2 ? a2 : `${t3},${a2}`;
            return o2.length > 8192 ? (e.DEBUG_BUILD && n.debug.warn(`Not adding key: ${r3} with val: ${i2} to baggage header due to exceeding baggage size limits.`), t3) : o2;
          }, "") : void 0;
        }
      }
      function c(t2) {
        if (t2 && ((0, r.isString)(t2) || Array.isArray(t2))) return Array.isArray(t2) ? t2.reduce((t3, e2) => (Object.entries(u(e2)).forEach(([e3, n2]) => {
          t3[e3] = n2;
        }), t3), {}) : u(t2);
      }
      function u(t2) {
        return t2.split(",").map((t3) => {
          let e2 = t3.indexOf("=");
          return -1 === e2 ? [] : [t3.slice(0, e2), t3.slice(e2 + 1)].map((t4) => {
            try {
              return decodeURIComponent(t4.trim());
            } catch {
              return;
            }
          });
        }).reduce((t3, [e2, n2]) => (e2 && n2 && (t3[e2] = n2), t3), {});
      }
      t.s(["SENTRY_BAGGAGE_KEY_PREFIX", () => i, "baggageHeaderToDynamicSamplingContext", () => a, "dynamicSamplingContextToSentryBaggageHeader", () => o, "parseBaggageHeader", () => c]);
    }, 225376, (t) => {
      "use strict";
      var e = t.i(966474);
      function n(t2, r, i = () => {
      }, s = () => {
      }) {
        var a, o, c, u;
        let l;
        try {
          l = t2();
        } catch (t3) {
          throw r(t3), i(), t3;
        }
        return a = l, o = r, c = i, u = s, (0, e.isThenable)(a) ? a.then((t3) => (c(), u(t3), t3), (t3) => {
          throw o(t3), c(), t3;
        }) : (c(), u(a), a);
      }
      t.s(["handleCallbackErrors", () => n]);
    }, 842495, (t) => {
      "use strict";
      var e = t.i(505893);
      function n(t2) {
        if ("boolean" == typeof __SENTRY_TRACING__ && !__SENTRY_TRACING__) return false;
        let n2 = t2 || (0, e.getClient)()?.getOptions();
        return !!n2 && (null != n2.tracesSampleRate || !!n2.tracesSampler);
      }
      t.s(["hasSpansEnabled", () => n]);
    }, 162308, (t) => {
      "use strict";
      function e(t2) {
        if ("boolean" == typeof t2) return Number(t2);
        let e2 = "string" == typeof t2 ? parseFloat(t2) : t2;
        if (!("number" != typeof e2 || isNaN(e2)) && !(e2 < 0) && !(e2 > 1)) return e2;
      }
      t.s(["parseSampleRate", () => e]);
    }, 654534, 304229, (t) => {
      "use strict";
      function e(t2) {
        if (t2 < 400 && t2 >= 100) return { code: 1 };
        if (t2 >= 400 && t2 < 500) switch (t2) {
          case 401:
            return { code: 2, message: "unauthenticated" };
          case 403:
            return { code: 2, message: "permission_denied" };
          case 404:
            return { code: 2, message: "not_found" };
          case 409:
            return { code: 2, message: "already_exists" };
          case 413:
            return { code: 2, message: "failed_precondition" };
          case 429:
            return { code: 2, message: "resource_exhausted" };
          case 499:
            return { code: 2, message: "cancelled" };
          default:
            return { code: 2, message: "invalid_argument" };
        }
        if (t2 >= 500 && t2 < 600) switch (t2) {
          case 501:
            return { code: 2, message: "unimplemented" };
          case 503:
            return { code: 2, message: "unavailable" };
          case 504:
            return { code: 2, message: "deadline_exceeded" };
        }
        return { code: 2, message: "internal_error" };
      }
      function n(t2, n2) {
        t2.setAttribute("http.response.status_code", n2);
        let r2 = e(n2);
        "unknown_error" !== r2.message && t2.setStatus(r2);
      }
      t.s(["SPAN_STATUS_ERROR", () => 2, "SPAN_STATUS_OK", () => 1, "SPAN_STATUS_UNSET", () => 0, "getSpanStatusFromHttpCode", () => e, "setHttpStatus", () => n], 654534);
      var r = t.i(187709), i = t.i(499219);
      let s = "_sentryScope", a = "_sentryIsolationScope";
      function o(t2, e2, n2) {
        t2 && ((0, r.addNonEnumerableProperty)(t2, a, function(t3) {
          try {
            let e3 = i.GLOBAL_OBJ.WeakRef;
            if ("function" == typeof e3) return new e3(t3);
          } catch {
          }
          return t3;
        }(n2)), (0, r.addNonEnumerableProperty)(t2, s, e2));
      }
      function c(t2) {
        return { scope: t2[s], isolationScope: function(t3) {
          if (t3) {
            if ("object" == typeof t3 && "deref" in t3 && "function" == typeof t3.deref) try {
              return t3.deref();
            } catch {
              return;
            }
            return t3;
          }
        }(t2[a]) };
      }
      t.s(["getCapturedScopesOnSpan", () => c, "setCapturedScopesOnSpan", () => o], 304229);
    }, 646665, (t) => {
      "use strict";
      var e = t.i(257493), n = t.i(20174);
      let r = /^o(\d+)\./, i = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
      function s(t2, e2 = false) {
        let { host: n2, path: r2, pass: i2, port: a2, projectId: o2, protocol: c2, publicKey: u } = t2;
        return `${c2}://${u}${e2 && i2 ? `:${i2}` : ""}@${n2}${a2 ? `:${a2}` : ""}/${r2 ? `${r2}/` : r2}${o2}`;
      }
      function a(t2) {
        return { protocol: t2.protocol, publicKey: t2.publicKey || "", pass: t2.pass || "", host: t2.host, port: t2.port || "", path: t2.path || "", projectId: t2.projectId };
      }
      function o(t2) {
        let e2, n2 = t2.getOptions(), { host: i2 } = t2.getDsn() || {};
        if (n2.orgId) e2 = String(n2.orgId);
        else {
          let t3;
          i2 && (t3 = i2.match(r), e2 = t3?.[1]);
        }
        return e2;
      }
      function c(t2) {
        let r2 = "string" == typeof t2 ? function(t3) {
          let e2 = i.exec(t3);
          if (!e2) return void (0, n.consoleSandbox)(() => {
            console.error(`Invalid Sentry Dsn: ${t3}`);
          });
          let [r3, s2, o2 = "", c2 = "", u = "", l = ""] = e2.slice(1), p = "", d = l, _ = d.split("/");
          if (_.length > 1 && (p = _.slice(0, -1).join("/"), d = _.pop()), d) {
            let t4 = d.match(/^\d+/);
            t4 && (d = t4[0]);
          }
          return a({ host: c2, pass: o2, path: p, projectId: d, port: u, protocol: r3, publicKey: s2 });
        }(t2) : a(t2);
        if (r2 && function(t3) {
          if (!e.DEBUG_BUILD) return true;
          let { port: r3, projectId: i2, protocol: s2 } = t3;
          return !["protocol", "publicKey", "host", "projectId"].find((e2) => !t3[e2] && (n.debug.error(`Invalid Sentry Dsn: ${e2} missing`), true)) && (i2.match(/^\d+$/) ? "http" !== s2 && "https" !== s2 ? (n.debug.error(`Invalid Sentry Dsn: Invalid protocol ${s2}`), false) : !(r3 && isNaN(parseInt(r3, 10))) || (n.debug.error(`Invalid Sentry Dsn: Invalid port ${r3}`), false) : (n.debug.error(`Invalid Sentry Dsn: Invalid projectId ${i2}`), false));
        }(r2)) return r2;
      }
      t.s(["dsnToString", () => s, "extractOrgIdFromClient", () => o, "makeDsn", () => c]);
    }, 153393, 12862, (t) => {
      "use strict";
      var e = t.i(294482), n = t.i(102393), r = t.i(505893), i = t.i(412115), s = t.i(654534), a = t.i(304229), o = t.i(187709), c = t.i(699316), u = t.i(57890), l = t.i(20174), p = t.i(765434), d = t.i(646665), _ = t.i(162308), g = t.i(883250);
      let f = RegExp("^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$");
      function h(t2, e2) {
        let n2 = function(t3) {
          let e3;
          if (!t3) return;
          let n3 = t3.match(f);
          if (n3) return "1" === n3[3] ? e3 = true : "0" === n3[3] && (e3 = false), { traceId: n3[1], parentSampled: e3, parentSpanId: n3[2] };
        }(t2), r2 = (0, p.baggageHeaderToDynamicSamplingContext)(e2);
        if (!n2?.traceId) return { traceId: (0, c.generateTraceId)(), sampleRand: (0, g.safeMathRandom)() };
        let i2 = function(t3, e3) {
          let n3 = (0, _.parseSampleRate)(e3?.sample_rand);
          if (void 0 !== n3) return n3;
          let r3 = (0, _.parseSampleRate)(e3?.sample_rate);
          return r3 && t3?.parentSampled !== void 0 ? t3.parentSampled ? (0, g.safeMathRandom)() * r3 : r3 + (0, g.safeMathRandom)() * (1 - r3) : (0, g.safeMathRandom)();
        }(n2, r2);
        r2 && (r2.sample_rand = i2.toString());
        let { traceId: s2, parentSpanId: a2, parentSampled: o2 } = n2;
        return { traceId: s2, parentSpanId: a2, sampled: o2, dsc: r2 || {}, sampleRand: i2 };
      }
      function m(t2 = (0, c.generateTraceId)(), e2 = (0, c.generateSpanId)(), n2) {
        let r2 = "";
        return void 0 !== n2 && (r2 = n2 ? "-1" : "-0"), `${t2}-${e2}${r2}`;
      }
      function S(t2 = (0, c.generateTraceId)(), e2 = (0, c.generateSpanId)(), n2) {
        return `00-${t2}-${e2}-${n2 ? "01" : "00"}`;
      }
      function E(t2, e2) {
        let n2 = (0, d.extractOrgIdFromClient)(t2);
        return e2 && n2 && e2 !== n2 ? (l.debug.log(`Won't continue trace because org IDs don't match (incoming baggage: ${e2}, SDK options: ${n2})`), false) : !t2.getOptions().strictTraceContinuation || (!e2 || !!n2) && (!!e2 || !n2) || (l.debug.log(`Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${e2}, Sentry client: ${n2})`), false);
      }
      t.s(["TRACEPARENT_REGEXP", () => f, "generateSentryTraceHeader", () => m, "generateTraceparentHeader", () => S, "propagationContextFromHeaders", () => h, "shouldContinueTrace", () => E], 12862);
      var T = t.i(652434);
      let y = false;
      function b(t2) {
        let { spanId: e2, traceId: n2 } = t2.spanContext(), { data: r2, op: i2, parent_span_id: s2, status: a2, origin: o2, links: c2 } = R(t2);
        return { parent_span_id: s2, span_id: e2, trace_id: n2, data: r2, op: i2, status: a2, origin: o2, links: c2 };
      }
      function v(t2) {
        let { spanId: e2, traceId: n2, isRemote: r2 } = t2.spanContext(), i2 = r2 ? e2 : R(t2).parent_span_id, s2 = (0, a.getCapturedScopesOnSpan)(t2).scope;
        return { parent_span_id: i2, span_id: r2 ? s2?.getPropagationContext().propagationSpanId || (0, c.generateSpanId)() : e2, trace_id: n2 };
      }
      function I(t2) {
        let { traceId: e2, spanId: n2 } = t2.spanContext();
        return m(e2, n2, O(t2));
      }
      function A(t2) {
        let { traceId: e2, spanId: n2 } = t2.spanContext();
        return S(e2, n2, O(t2));
      }
      function C(t2) {
        return t2 && t2.length > 0 ? t2.map(({ context: { spanId: t3, traceId: e2, traceFlags: n2, ...r2 }, attributes: i2 }) => ({ span_id: t3, trace_id: e2, sampled: 1 === n2, attributes: i2, ...r2 })) : void 0;
      }
      function N(t2) {
        return "number" == typeof t2 ? x(t2) : Array.isArray(t2) ? t2[0] + t2[1] / 1e9 : t2 instanceof Date ? x(t2.getTime()) : (0, u.timestampInSeconds)();
      }
      function x(t2) {
        return t2 > 9999999999 ? t2 / 1e3 : t2;
      }
      function R(t2) {
        var e2;
        if ("function" == typeof t2.getSpanJSON) return t2.getSpanJSON();
        let { spanId: n2, traceId: r2 } = t2.spanContext();
        if ((e2 = t2).attributes && e2.startTime && e2.name && e2.endTime && e2.status) {
          let { attributes: e3, startTime: s2, name: a2, endTime: o2, status: c2, links: u2 } = t2;
          return { span_id: n2, trace_id: r2, data: e3, description: a2, parent_span_id: "parentSpanId" in t2 ? t2.parentSpanId : "parentSpanContext" in t2 ? t2.parentSpanContext?.spanId : void 0, start_timestamp: N(s2), timestamp: N(o2) || void 0, status: D(c2), op: e3[i.SEMANTIC_ATTRIBUTE_SENTRY_OP], origin: e3[i.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN], links: C(u2) };
        }
        return { span_id: n2, trace_id: r2, start_timestamp: 0, data: {} };
      }
      function O(t2) {
        let { traceFlags: e2 } = t2.spanContext();
        return 1 === e2;
      }
      function D(t2) {
        if (t2 && t2.code !== s.SPAN_STATUS_UNSET) return t2.code === s.SPAN_STATUS_OK ? "ok" : t2.message || "internal_error";
      }
      let U = "_sentryChildSpans", B = "_sentryRootSpan";
      function k(t2, e2) {
        let n2 = t2[B] || t2;
        (0, o.addNonEnumerableProperty)(e2, B, n2), t2[U] ? t2[U].add(e2) : (0, o.addNonEnumerableProperty)(t2, U, /* @__PURE__ */ new Set([e2]));
      }
      function w(t2) {
        let e2 = /* @__PURE__ */ new Set();
        return !function t3(n2) {
          if (!e2.has(n2) && O(n2)) for (let r2 of (e2.add(n2), n2[U] ? Array.from(n2[U]) : [])) t3(r2);
        }(t2), Array.from(e2);
      }
      function L(t2) {
        return t2[B] || t2;
      }
      function M() {
        let t2 = (0, n.getMainCarrier)(), i2 = (0, e.getAsyncContextStrategy)(t2);
        return i2.getActiveSpan ? i2.getActiveSpan() : (0, T._getSpanForScope)((0, r.getCurrentScope)());
      }
      function P() {
        y || ((0, l.consoleSandbox)(() => {
          console.warn("[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.");
        }), y = true);
      }
      t.s(["TRACE_FLAG_NONE", () => 0, "TRACE_FLAG_SAMPLED", () => 1, "addChildSpanToSpan", () => k, "convertSpanLinksForEnvelope", () => C, "getActiveSpan", () => M, "getRootSpan", () => L, "getSpanDescendants", () => w, "getStatusMessage", () => D, "showSpanDropWarning", () => P, "spanIsSampled", () => O, "spanTimeInputToSeconds", () => N, "spanToJSON", () => R, "spanToTraceContext", () => v, "spanToTraceHeader", () => I, "spanToTraceparentHeader", () => A, "spanToTransactionTraceContext", () => b], 153393);
    }, 263382, 360748, (t) => {
      "use strict";
      let e = "production";
      t.s(["DEFAULT_ENVIRONMENT", () => e], 360748);
      var n = t.i(505893), r = t.i(412115), i = t.i(765434), s = t.i(646665), a = t.i(842495), o = t.i(187709), c = t.i(153393), u = t.i(304229);
      let l = "_frozenDsc";
      function p(t2, e2) {
        (0, o.addNonEnumerableProperty)(t2, l, e2);
      }
      function d(t2, n2) {
        let r2 = n2.getOptions(), { publicKey: i2 } = n2.getDsn() || {}, a2 = { environment: r2.environment || e, release: r2.release, public_key: i2, trace_id: t2, org_id: (0, s.extractOrgIdFromClient)(n2) };
        return n2.emit("createDsc", a2), a2;
      }
      function _(t2, e2) {
        let n2 = e2.getPropagationContext();
        return n2.dsc || d(n2.traceId, t2);
      }
      function g(t2) {
        let e2 = (0, n.getClient)();
        if (!e2) return {};
        let s2 = (0, c.getRootSpan)(t2), o2 = (0, c.spanToJSON)(s2), p2 = o2.data, _2 = s2.spanContext().traceState, g2 = _2?.get("sentry.sample_rate") ?? p2[r.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] ?? p2[r.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE];
        function f(t3) {
          return ("number" == typeof g2 || "string" == typeof g2) && (t3.sample_rate = `${g2}`), t3;
        }
        let h = s2[l];
        if (h) return f(h);
        let m = _2?.get("sentry.dsc"), S = m && (0, i.baggageHeaderToDynamicSamplingContext)(m);
        if (S) return f(S);
        let E = d(t2.spanContext().traceId, e2), T = p2[r.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE], y = o2.description;
        return "url" !== T && y && (E.transaction = y), (0, a.hasSpansEnabled)() && (E.sampled = String((0, c.spanIsSampled)(s2)), E.sample_rand = _2?.get("sentry.sample_rand") ?? (0, u.getCapturedScopesOnSpan)(s2).scope?.getPropagationContext().sampleRand.toString()), f(E), e2.emit("createDsc", E, s2), E;
      }
      t.s(["freezeDscOnSpan", () => p, "getDynamicSamplingContextFromScope", () => _, "getDynamicSamplingContextFromSpan", () => g], 263382);
    }, 875641, 776970, 606691, 150666, 496874, 469599, 835848, (t) => {
      "use strict";
      var e = t.i(257493), n = t.i(20174), r = t.i(153393);
      function i(t2) {
        if (!e.DEBUG_BUILD) return;
        let { description: i2 = "< unknown name >", op: s2 = "< unknown op >", parent_span_id: a2 } = (0, r.spanToJSON)(t2), { spanId: o2 } = t2.spanContext(), c2 = (0, r.spanIsSampled)(t2), u2 = (0, r.getRootSpan)(t2), l2 = u2 === t2, p2 = `[Tracing] Starting ${c2 ? "sampled" : "unsampled"} ${l2 ? "root " : ""}span`, d2 = [`op: ${s2}`, `name: ${i2}`, `ID: ${o2}`];
        if (a2 && d2.push(`parent ID: ${a2}`), !l2) {
          let { op: t3, description: e2 } = (0, r.spanToJSON)(u2);
          d2.push(`root ID: ${u2.spanContext().spanId}`), t3 && d2.push(`root op: ${t3}`), e2 && d2.push(`root description: ${e2}`);
        }
        n.debug.log(`${p2}
  ${d2.join("\n  ")}`);
      }
      function s(t2) {
        if (!e.DEBUG_BUILD) return;
        let { description: i2 = "< unknown name >", op: s2 = "< unknown op >" } = (0, r.spanToJSON)(t2), { spanId: a2 } = t2.spanContext(), o2 = (0, r.getRootSpan)(t2) === t2, c2 = `[Tracing] Finishing "${s2}" ${o2 ? "root " : ""}span "${i2}" with ID ${a2}`;
        n.debug.log(c2);
      }
      t.s(["logSpanEnd", () => s, "logSpanStart", () => i], 875641);
      var a = t.i(842495), o = t.i(162308);
      function c(t2, r2, i2) {
        let s2, c2;
        if (!(0, a.hasSpansEnabled)(t2)) return [false];
        "function" == typeof t2.tracesSampler ? (s2 = t2.tracesSampler({ ...r2, inheritOrSampleWith: (t3) => "number" == typeof r2.parentSampleRate ? r2.parentSampleRate : "boolean" == typeof r2.parentSampled ? Number(r2.parentSampled) : t3 }), c2 = true) : void 0 !== r2.parentSampled ? s2 = r2.parentSampled : void 0 !== t2.tracesSampleRate && (s2 = t2.tracesSampleRate, c2 = true);
        let u2 = (0, o.parseSampleRate)(s2);
        if (void 0 === u2) return e.DEBUG_BUILD && n.debug.warn(`[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(s2)} of type ${JSON.stringify(typeof s2)}.`), [false];
        if (!u2) return e.DEBUG_BUILD && n.debug.log(`[Tracing] Discarding transaction because ${"function" == typeof t2.tracesSampler ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`), [false, u2, c2];
        let l2 = i2 < u2;
        return !l2 && e.DEBUG_BUILD && n.debug.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(s2)})`), [l2, u2, c2];
      }
      t.s(["sampleSpan", () => c], 776970);
      var u = t.i(699316);
      class l {
        constructor(t2 = {}) {
          this._traceId = t2.traceId || (0, u.generateTraceId)(), this._spanId = t2.spanId || (0, u.generateSpanId)();
        }
        spanContext() {
          return { spanId: this._spanId, traceId: this._traceId, traceFlags: r.TRACE_FLAG_NONE };
        }
        end(t2) {
        }
        setAttribute(t2, e2) {
          return this;
        }
        setAttributes(t2) {
          return this;
        }
        setStatus(t2) {
          return this;
        }
        updateName(t2) {
          return this;
        }
        isRecording() {
          return false;
        }
        addEvent(t2, e2, n2) {
          return this;
        }
        addLink(t2) {
          return this;
        }
        addLinks(t2) {
          return this;
        }
        recordException(t2, e2) {
        }
      }
      t.s(["SentryNonRecordingSpan", () => l], 606691);
      var p = t.i(263382), d = t.i(646665), _ = t.i(102393), g = t.i(966474), f = t.i(187709), h = t.i(224058);
      function m(e2, n2 = 100, r2 = Infinity) {
        try {
          return function e3(n3, r3, i2 = Infinity, s2 = Infinity, a2 = /* @__PURE__ */ function() {
            let t2 = /* @__PURE__ */ new WeakSet();
            return [function(e4) {
              return !!t2.has(e4) || (t2.add(e4), false);
            }, function(e4) {
              t2.delete(e4);
            }];
          }()) {
            let [o2, c2] = a2;
            if (null == r3 || ["boolean", "string"].includes(typeof r3) || "number" == typeof r3 && Number.isFinite(r3)) return r3;
            let u2 = function(e4, n4) {
              try {
                var r4;
                let i3;
                if ("domain" === e4 && n4 && "object" == typeof n4 && n4._events) return "[Domain]";
                if ("domainEmitter" === e4) return "[DomainEmitter]";
                if (n4 === t.g) return "[Global]";
                if ("u" > typeof document && n4 === document) return "[Document]";
                if ((0, g.isVueViewModel)(n4)) return (0, h.getVueInternalName)(n4);
                if ((0, g.isSyntheticEvent)(n4)) return "[SyntheticEvent]";
                if ("number" == typeof n4 && !Number.isFinite(n4)) return `[${n4}]`;
                if ("function" == typeof n4) return `[Function: ${(0, h.getFunctionName)(n4)}]`;
                if ("symbol" == typeof n4) return `[${String(n4)}]`;
                if ("bigint" == typeof n4) return `[BigInt: ${String(n4)}]`;
                let s3 = (r4 = n4, i3 = Object.getPrototypeOf(r4), i3?.constructor ? i3.constructor.name : "null prototype");
                if (/^HTML(\w*)Element$/.test(s3)) return `[HTMLElement: ${s3}]`;
                return `[object ${s3}]`;
              } catch (t2) {
                return `**non-serializable** (${t2})`;
              }
            }(n3, r3);
            if (!u2.startsWith("[object ")) return u2;
            if (r3.__sentry_skip_normalization__) return r3;
            let l2 = "number" == typeof r3.__sentry_override_normalization_depth__ ? r3.__sentry_override_normalization_depth__ : i2;
            if (0 === l2) return u2.replace("object ", "");
            if (o2(r3)) return "[Circular ~]";
            if (r3 && "function" == typeof r3.toJSON) try {
              let t2 = r3.toJSON();
              return e3("", t2, l2 - 1, s2, a2);
            } catch {
            }
            let p2 = Array.isArray(r3) ? [] : {}, d2 = 0, _2 = (0, f.convertToPlainObject)(r3);
            for (let t2 in _2) {
              if (!Object.prototype.hasOwnProperty.call(_2, t2)) continue;
              if (d2 >= s2) {
                p2[t2] = "[MaxProperties ~]";
                break;
              }
              let n4 = _2[t2];
              p2[t2] = e3(t2, n4, l2 - 1, s2, a2), d2++;
            }
            return c2(r3), p2;
          }("", e2, n2, r2);
        } catch (t2) {
          return { ERROR: `**non-serializable** (${t2})` };
        }
      }
      t.s(["normalize", () => m, "normalizeToSize", () => function t2(e2, n2 = 3, r2 = 102400) {
        let i2 = m(e2, n2);
        return ~-encodeURI(JSON.stringify(i2)).split(/%..|./).length > r2 ? t2(e2, n2 - 1, r2) : i2;
      }], 150666);
      var S = t.i(499219);
      function E(t2, e2 = []) {
        return [t2, e2];
      }
      function T(t2, e2) {
        let [n2, r2] = t2;
        return [n2, [...r2, e2]];
      }
      function y(t2, e2) {
        for (let n2 of t2[1]) {
          let t3 = n2[0].type;
          if (e2(n2, t3)) return true;
        }
        return false;
      }
      function b(t2, e2) {
        return y(t2, (t3, n2) => e2.includes(n2));
      }
      function v(t2) {
        let e2 = (0, _.getSentryCarrier)(S.GLOBAL_OBJ);
        return e2.encodePolyfill ? e2.encodePolyfill(t2) : new TextEncoder().encode(t2);
      }
      function I(t2) {
        let [e2, n2] = t2, r2 = JSON.stringify(e2);
        function i2(t3) {
          "string" == typeof r2 ? r2 = "string" == typeof t3 ? r2 + t3 : [v(r2), t3] : r2.push("string" == typeof t3 ? v(t3) : t3);
        }
        for (let t3 of n2) {
          let [e3, n3] = t3;
          if (i2(`
${JSON.stringify(e3)}
`), "string" == typeof n3 || n3 instanceof Uint8Array) i2(n3);
          else {
            let t4;
            try {
              t4 = JSON.stringify(n3);
            } catch {
              t4 = JSON.stringify(m(n3));
            }
            i2(t4);
          }
        }
        return "string" == typeof r2 ? r2 : function(t3) {
          let e3 = new Uint8Array(t3.reduce((t4, e4) => t4 + e4.length, 0)), n3 = 0;
          for (let r3 of t3) e3.set(r3, n3), n3 += r3.length;
          return e3;
        }(r2);
      }
      function A(t2) {
        return [{ type: "span" }, t2];
      }
      function C(t2) {
        let e2 = "string" == typeof t2.data ? v(t2.data) : t2.data;
        return [{ type: "attachment", length: e2.length, filename: t2.filename, content_type: t2.contentType, attachment_type: t2.attachmentType }, e2];
      }
      let N = { session: "session", sessions: "session", attachment: "attachment", transaction: "transaction", event: "error", client_report: "internal", user_report: "default", profile: "profile", profile_chunk: "profile", replay_event: "replay", replay_recording: "replay", check_in: "monitor", feedback: "feedback", span: "span", raw_security: "security", log: "log_item", metric: "metric", trace_metric: "metric" };
      function x(t2) {
        return N[t2];
      }
      function R(t2) {
        if (!t2?.sdk) return;
        let { name: e2, version: n2 } = t2.sdk;
        return { name: e2, version: n2 };
      }
      function O(t2, e2, n2, r2) {
        let i2 = t2.sdkProcessingMetadata?.dynamicSamplingContext;
        return { event_id: t2.event_id, sent_at: (/* @__PURE__ */ new Date()).toISOString(), ...e2 && { sdk: e2 }, ...!!n2 && r2 && { dsn: (0, d.dsnToString)(r2) }, ...i2 && { trace: i2 } };
      }
      t.s(["addItemToEnvelope", () => T, "createAttachmentEnvelopeItem", () => C, "createEnvelope", () => E, "createEventEnvelopeHeaders", () => O, "createSpanEnvelopeItem", () => A, "envelopeContainsItemType", () => b, "envelopeItemTypeToDataCategory", () => x, "forEachEnvelopeItem", () => y, "getSdkMetadataForEnvelopeHeader", () => R, "serializeEnvelope", () => I], 496874);
      var D = t.i(257645);
      function U(t2) {
        n.debug.log(`Ignoring span ${t2.op} - ${t2.description} because it matches \`ignoreSpans\`.`);
      }
      function B(t2, n2) {
        if (!n2?.length || !t2.description) return false;
        for (let i2 of n2) {
          var r2;
          if ("string" == typeof (r2 = i2) || r2 instanceof RegExp) {
            if ((0, D.isMatchingPattern)(t2.description, i2)) return e.DEBUG_BUILD && U(t2), true;
            continue;
          }
          if (!i2.name && !i2.op) continue;
          let n3 = !i2.name || (0, D.isMatchingPattern)(t2.description, i2.name), s2 = !i2.op || t2.op && (0, D.isMatchingPattern)(t2.op, i2.op);
          if (n3 && s2) return e.DEBUG_BUILD && U(t2), true;
        }
        return false;
      }
      function k(t2, e2) {
        let n2 = e2.parent_span_id, r2 = e2.span_id;
        if (n2) for (let e3 of t2) e3.parent_span_id === r2 && (e3.parent_span_id = n2);
      }
      function w(t2, e2, n2, r2) {
        let i2 = R(n2);
        return E({ sent_at: (/* @__PURE__ */ new Date()).toISOString(), ...i2 && { sdk: i2 }, ...!!r2 && e2 && { dsn: (0, d.dsnToString)(e2) } }, ["aggregates" in t2 ? [{ type: "sessions" }, t2] : [{ type: "session" }, t2.toJSON()]]);
      }
      function L(t2, e2, n2, r2) {
        let i2 = R(n2), s2 = t2.type && "replay_event" !== t2.type ? t2.type : "event";
        !function(t3, e3) {
          if (!e3) return;
          let n3 = t3.sdk || {};
          t3.sdk = { ...n3, name: n3.name || e3.name, version: n3.version || e3.version, integrations: [...t3.sdk?.integrations || [], ...e3.integrations || []], packages: [...t3.sdk?.packages || [], ...e3.packages || []], settings: t3.sdk?.settings || e3.settings ? { ...t3.sdk?.settings, ...e3.settings } : void 0 };
        }(t2, n2?.sdk);
        let a2 = O(t2, i2, r2, e2);
        return delete t2.sdkProcessingMetadata, E(a2, [[{ type: s2 }, t2]]);
      }
      function M(t2, e2) {
        let n2 = (0, p.getDynamicSamplingContextFromSpan)(t2[0]), i2 = e2?.getDsn(), s2 = e2?.getOptions().tunnel, a2 = { sent_at: (/* @__PURE__ */ new Date()).toISOString(), ...!!n2.trace_id && !!n2.public_key && { trace: n2 }, ...!!s2 && i2 && { dsn: (0, d.dsnToString)(i2) } }, { beforeSendSpan: o2, ignoreSpans: c2 } = e2?.getOptions() || {}, u2 = c2?.length ? t2.filter((t3) => !B((0, r.spanToJSON)(t3), c2)) : t2, l2 = t2.length - u2.length;
        l2 && e2?.recordDroppedEvent("before_send", "span", l2);
        let _2 = o2 ? (t3) => {
          let e3 = (0, r.spanToJSON)(t3), n3 = o2(e3);
          return n3 || ((0, r.showSpanDropWarning)(), e3);
        } : r.spanToJSON, g2 = [];
        for (let t3 of u2) {
          let e3 = _2(t3);
          e3 && g2.push(A(e3));
        }
        return E(a2, g2);
      }
      t.s(["reparentChildSpans", () => k, "shouldIgnoreSpan", () => B], 469599), t.s(["createEventEnvelope", () => L, "createSessionEnvelope", () => w, "createSpanEnvelope", () => M], 835848);
    }, 958648, (t) => {
      "use strict";
      t.i(257493);
      var e = t.i(412115);
      function n(t2) {
        if (!t2 || 0 === t2.length) return;
        let n2 = {};
        return t2.forEach((t3) => {
          let r = t3.attributes || {}, i = r[e.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT], s = r[e.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE];
          "string" == typeof i && "number" == typeof s && (n2[t3.name] = { value: s, unit: i });
        }), n2;
      }
      t.i(20174), t.i(153393), t.s(["timedEventsToMeasurements", () => n]);
    }, 598261, 433798, 269728, 294736, 133245, (t) => {
      "use strict";
      let e, n, r, i;
      var s = t.i(505893), a = t.i(257493);
      t.i(298881);
      var o = t.i(294482), c = t.i(102393), u = t.i(412115);
      t.i(765434);
      var l = t.i(20174);
      t.i(225376);
      var p = t.i(842495), d = t.i(162308), _ = t.i(699316), g = t.i(883250), f = t.i(652434), h = t.i(153393);
      t.i(12862);
      var m = t.i(263382), S = t.i(875641), E = t.i(776970), T = t.i(606691), y = t.i(835848), b = t.i(57890), v = t.i(958648), I = t.i(304229);
      class A {
        constructor(t2 = {}) {
          this._traceId = t2.traceId || (0, _.generateTraceId)(), this._spanId = t2.spanId || (0, _.generateSpanId)(), this._startTime = t2.startTimestamp || (0, b.timestampInSeconds)(), this._links = t2.links, this._attributes = {}, this.setAttributes({ [u.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "manual", [u.SEMANTIC_ATTRIBUTE_SENTRY_OP]: t2.op, ...t2.attributes }), this._name = t2.name, t2.parentSpanId && (this._parentSpanId = t2.parentSpanId), "sampled" in t2 && (this._sampled = t2.sampled), t2.endTimestamp && (this._endTime = t2.endTimestamp), this._events = [], this._isStandaloneSpan = t2.isStandalone, this._endTime && this._onSpanEnded();
        }
        addLink(t2) {
          return this._links ? this._links.push(t2) : this._links = [t2], this;
        }
        addLinks(t2) {
          return this._links ? this._links.push(...t2) : this._links = t2, this;
        }
        recordException(t2, e2) {
        }
        spanContext() {
          let { _spanId: t2, _traceId: e2, _sampled: n2 } = this;
          return { spanId: t2, traceId: e2, traceFlags: n2 ? h.TRACE_FLAG_SAMPLED : h.TRACE_FLAG_NONE };
        }
        setAttribute(t2, e2) {
          return void 0 === e2 ? delete this._attributes[t2] : this._attributes[t2] = e2, this;
        }
        setAttributes(t2) {
          return Object.keys(t2).forEach((e2) => this.setAttribute(e2, t2[e2])), this;
        }
        updateStartTime(t2) {
          this._startTime = (0, h.spanTimeInputToSeconds)(t2);
        }
        setStatus(t2) {
          return this._status = t2, this;
        }
        updateName(t2) {
          return this._name = t2, this.setAttribute(u.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, "custom"), this;
        }
        end(t2) {
          this._endTime || (this._endTime = (0, h.spanTimeInputToSeconds)(t2), (0, S.logSpanEnd)(this), this._onSpanEnded());
        }
        getSpanJSON() {
          return { data: this._attributes, description: this._name, op: this._attributes[u.SEMANTIC_ATTRIBUTE_SENTRY_OP], parent_span_id: this._parentSpanId, span_id: this._spanId, start_timestamp: this._startTime, status: (0, h.getStatusMessage)(this._status), timestamp: this._endTime, trace_id: this._traceId, origin: this._attributes[u.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN], profile_id: this._attributes[u.SEMANTIC_ATTRIBUTE_PROFILE_ID], exclusive_time: this._attributes[u.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME], measurements: (0, v.timedEventsToMeasurements)(this._events), is_segment: this._isStandaloneSpan && (0, h.getRootSpan)(this) === this || void 0, segment_id: this._isStandaloneSpan ? (0, h.getRootSpan)(this).spanContext().spanId : void 0, links: (0, h.convertSpanLinksForEnvelope)(this._links) };
        }
        isRecording() {
          return !this._endTime && !!this._sampled;
        }
        addEvent(t2, e2, n2) {
          a.DEBUG_BUILD && l.debug.log("[Tracing] Adding an event to span:", t2);
          let r2 = C(e2) ? e2 : n2 || (0, b.timestampInSeconds)(), i2 = C(e2) ? {} : e2 || {}, s2 = { name: t2, time: (0, h.spanTimeInputToSeconds)(r2), attributes: i2 };
          return this._events.push(s2), this;
        }
        isStandaloneSpan() {
          return !!this._isStandaloneSpan;
        }
        _onSpanEnded() {
          let t2 = (0, s.getClient)();
          if (t2 && t2.emit("spanEnd", this), !(this._isStandaloneSpan || this === (0, h.getRootSpan)(this))) return;
          if (this._isStandaloneSpan) return void (this._sampled ? function(t3) {
            let e3 = (0, s.getClient)();
            if (!e3) return;
            let n2 = t3[1];
            n2 && 0 !== n2.length ? e3.sendEnvelope(t3) : e3.recordDroppedEvent("before_send", "span");
          }((0, y.createSpanEnvelope)([this], t2)) : (a.DEBUG_BUILD && l.debug.log("[Tracing] Discarding standalone span because its trace was not chosen to be sampled."), t2 && t2.recordDroppedEvent("sample_rate", "span")));
          let e2 = this._convertSpanToTransaction();
          e2 && ((0, I.getCapturedScopesOnSpan)(this).scope || (0, s.getCurrentScope)()).captureEvent(e2);
        }
        _convertSpanToTransaction() {
          if (!N((0, h.spanToJSON)(this))) return;
          this._name || (a.DEBUG_BUILD && l.debug.warn("Transaction has no name, falling back to `<unlabeled transaction>`."), this._name = "<unlabeled transaction>");
          let { scope: t2, isolationScope: e2 } = (0, I.getCapturedScopesOnSpan)(this), n2 = t2?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
          if (true !== this._sampled) return;
          let r2 = (0, h.getSpanDescendants)(this).filter((t3) => {
            var e3;
            return t3 !== this && !((e3 = t3) instanceof A && e3.isStandaloneSpan());
          }).map((t3) => (0, h.spanToJSON)(t3)).filter(N), i2 = this._attributes[u.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
          delete this._attributes[u.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME], r2.forEach((t3) => {
            delete t3.data[u.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
          });
          let s2 = { contexts: { trace: (0, h.spanToTransactionTraceContext)(this) }, spans: r2.length > 1e3 ? r2.sort((t3, e3) => t3.start_timestamp - e3.start_timestamp).slice(0, 1e3) : r2, start_timestamp: this._startTime, timestamp: this._endTime, transaction: this._name, type: "transaction", sdkProcessingMetadata: { capturedSpanScope: t2, capturedSpanIsolationScope: e2, dynamicSamplingContext: (0, m.getDynamicSamplingContextFromSpan)(this) }, request: n2, ...i2 && { transaction_info: { source: i2 } } }, o2 = (0, v.timedEventsToMeasurements)(this._events);
          return o2 && Object.keys(o2).length && (a.DEBUG_BUILD && l.debug.log("[Measurements] Adding measurements to transaction event", JSON.stringify(o2, void 0, 2)), s2.measurements = o2), s2;
        }
      }
      function C(t2) {
        return t2 && "number" == typeof t2 || t2 instanceof Date || Array.isArray(t2);
      }
      function N(t2) {
        return !!t2.start_timestamp && !!t2.timestamp && !!t2.span_id && !!t2.trace_id;
      }
      t.i(654534);
      let x = "__SENTRY_SUPPRESS_TRACING__";
      function R(t2) {
        let e2 = B();
        if (e2.startInactiveSpan) return e2.startInactiveSpan(t2);
        let n2 = function(t3) {
          let e3 = { isStandalone: (t3.experimental || {}).standalone, ...t3 };
          if (t3.startTime) {
            let n3 = { ...e3 };
            return n3.startTimestamp = (0, h.spanTimeInputToSeconds)(t3.startTime), delete n3.startTime, n3;
          }
          return e3;
        }(t2), { forceTransaction: r2, parentSpan: i2 } = t2;
        return (t2.scope ? (e3) => (0, s.withScope)(t2.scope, e3) : void 0 !== i2 ? (t3) => O(i2, t3) : (t3) => t3())(() => {
          let e3 = (0, s.getCurrentScope)(), a2 = function(t3, e4) {
            if (e4) return e4;
            if (null === e4) return;
            let n3 = (0, f._getSpanForScope)(t3);
            if (!n3) return;
            let r3 = (0, s.getClient)();
            return (r3 ? r3.getOptions() : {}).parentSpanIsAlwaysRootSpan ? (0, h.getRootSpan)(n3) : n3;
          }(e3, i2);
          return t2.onlyIfParent && !a2 ? new T.SentryNonRecordingSpan() : function({ parentSpan: t3, spanArguments: e4, forceTransaction: n3, scope: r3 }) {
            let i3;
            if (!(0, p.hasSpansEnabled)()) {
              let r4 = new T.SentryNonRecordingSpan();
              if (n3 || !t3) {
                let t4 = { sampled: "false", sample_rate: "0", transaction: e4.name, ...(0, m.getDynamicSamplingContextFromSpan)(r4) };
                (0, m.freezeDscOnSpan)(r4, t4);
              }
              return r4;
            }
            let a3 = (0, s.getIsolationScope)();
            if (t3 && !n3) i3 = function(t4, e5, n4) {
              let { spanId: r4, traceId: i4 } = t4.spanContext(), a4 = !e5.getScopeData().sdkProcessingMetadata[x] && (0, h.spanIsSampled)(t4), o2 = a4 ? new A({ ...n4, parentSpanId: r4, traceId: i4, sampled: a4 }) : new T.SentryNonRecordingSpan({ traceId: i4 });
              (0, h.addChildSpanToSpan)(t4, o2);
              let c2 = (0, s.getClient)();
              return c2 && (c2.emit("spanStart", o2), n4.endTimestamp && c2.emit("spanEnd", o2)), o2;
            }(t3, r3, e4), (0, h.addChildSpanToSpan)(t3, i3);
            else if (t3) {
              let n4 = (0, m.getDynamicSamplingContextFromSpan)(t3), { traceId: s2, spanId: a4 } = t3.spanContext(), o2 = (0, h.spanIsSampled)(t3);
              i3 = k({ traceId: s2, parentSpanId: a4, ...e4 }, r3, o2), (0, m.freezeDscOnSpan)(i3, n4);
            } else {
              let { traceId: t4, dsc: n4, parentSpanId: s2, sampled: o2 } = { ...a3.getPropagationContext(), ...r3.getPropagationContext() };
              i3 = k({ traceId: t4, parentSpanId: s2, ...e4 }, r3, o2), n4 && (0, m.freezeDscOnSpan)(i3, n4);
            }
            return (0, S.logSpanStart)(i3), (0, I.setCapturedScopesOnSpan)(i3, r3, a3), i3;
          }({ parentSpan: a2, spanArguments: n2, forceTransaction: r2, scope: e3 });
        });
      }
      function O(t2, e2) {
        let n2 = B();
        return n2.withActiveSpan ? n2.withActiveSpan(t2, e2) : (0, s.withScope)((n3) => ((0, f._setSpanForScope)(n3, t2 || void 0), e2(n3)));
      }
      function D(t2) {
        let e2 = B();
        return e2.suppressTracing ? e2.suppressTracing(t2) : (0, s.withScope)((e3) => {
          e3.setSDKProcessingMetadata({ [x]: true });
          let n2 = t2();
          return e3.setSDKProcessingMetadata({ [x]: void 0 }), n2;
        });
      }
      function U(t2) {
        return (0, s.withScope)((e2) => (e2.setPropagationContext({ traceId: (0, _.generateTraceId)(), sampleRand: (0, g.safeMathRandom)() }), a.DEBUG_BUILD && l.debug.log(`Starting a new trace with id ${e2.getPropagationContext().traceId}`), O(null, t2)));
      }
      function B() {
        let t2 = (0, c.getMainCarrier)();
        return (0, o.getAsyncContextStrategy)(t2);
      }
      function k(t2, e2, n2) {
        let r2 = (0, s.getClient)(), i2 = r2?.getOptions() || {}, { name: o2 = "" } = t2, c2 = { spanAttributes: { ...t2.attributes }, spanName: o2, parentSampled: n2 };
        r2?.emit("beforeSampling", c2, { decision: false });
        let p2 = c2.parentSampled ?? n2, _2 = c2.spanAttributes, g2 = e2.getPropagationContext(), [f2, h2, m2] = e2.getScopeData().sdkProcessingMetadata[x] ? [false] : (0, E.sampleSpan)(i2, { name: o2, parentSampled: p2, attributes: _2, parentSampleRate: (0, d.parseSampleRate)(g2.dsc?.sample_rate) }, g2.sampleRand), S2 = new A({ ...t2, attributes: { [u.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "custom", [u.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]: void 0 !== h2 && m2 ? h2 : void 0, ..._2 }, sampled: f2 });
        return !f2 && r2 && (a.DEBUG_BUILD && l.debug.log("[Tracing] Discarding root span because its trace was not chosen to be sampled."), r2.recordDroppedEvent("sample_rate", "transaction")), r2 && r2.emit("spanStart", S2), S2;
      }
      t.s(["startInactiveSpan", () => R, "startNewTrace", () => U, "suppressTracing", () => D], 433798);
      var w = t.i(966474), L = t.i(775403), M = t.i(360748);
      function P(t2) {
        return new G((e2) => {
          e2(t2);
        });
      }
      function $(t2) {
        return new G((e2, n2) => {
          n2(t2);
        });
      }
      class G {
        constructor(t2) {
          this._state = 0, this._handlers = [], this._runExecutor(t2);
        }
        then(t2, e2) {
          return new G((n2, r2) => {
            this._handlers.push([false, (e3) => {
              if (t2) try {
                n2(t2(e3));
              } catch (t3) {
                r2(t3);
              }
              else n2(e3);
            }, (t3) => {
              if (e2) try {
                n2(e2(t3));
              } catch (t4) {
                r2(t4);
              }
              else r2(t3);
            }]), this._executeHandlers();
          });
        }
        catch(t2) {
          return this.then((t3) => t3, t2);
        }
        finally(t2) {
          return new G((e2, n2) => {
            let r2, i2;
            return this.then((e3) => {
              i2 = false, r2 = e3, t2 && t2();
            }, (e3) => {
              i2 = true, r2 = e3, t2 && t2();
            }).then(() => {
              i2 ? n2(r2) : e2(r2);
            });
          });
        }
        _executeHandlers() {
          if (0 === this._state) return;
          let t2 = this._handlers.slice();
          this._handlers = [], t2.forEach((t3) => {
            t3[0] || (1 === this._state && t3[1](this._value), 2 === this._state && t3[2](this._value), t3[0] = true);
          });
        }
        _runExecutor(t2) {
          let e2 = (t3, e3) => {
            if (0 === this._state) {
              if ((0, w.isThenable)(e3)) return void e3.then(n2, r2);
              this._state = t3, this._value = e3, this._executeHandlers();
            }
          }, n2 = (t3) => {
            e2(1, t3);
          }, r2 = (t3) => {
            e2(2, t3);
          };
          try {
            t2(n2, r2);
          } catch (t3) {
            r2(t3);
          }
        }
      }
      t.s(["rejectedSyncPromise", () => $, "resolvedSyncPromise", () => P], 269728);
      var j = t.i(392906);
      t.i(224058);
      var F = t.i(499219), J = t.i(150666), Y = t.i(274779);
      function V(t2, e2) {
        var n2, r2, i2, s2, a2, o2, c2, u2;
        let l2, p2, d2, { fingerprint: _2, span: g2, breadcrumbs: f2, sdkProcessingMetadata: S2 } = e2;
        (function(t3, e3) {
          let { extra: n3, tags: r3, user: i3, contexts: s3, level: a3, transactionName: o3 } = e3;
          Object.keys(n3).length && (t3.extra = { ...n3, ...t3.extra }), Object.keys(r3).length && (t3.tags = { ...r3, ...t3.tags }), Object.keys(i3).length && (t3.user = { ...i3, ...t3.user }), Object.keys(s3).length && (t3.contexts = { ...s3, ...t3.contexts }), a3 && (t3.level = a3), o3 && "transaction" !== t3.type && (t3.transaction = o3);
        })(t2, e2), g2 && (n2 = t2, r2 = g2, n2.contexts = { trace: (0, h.spanToTraceContext)(r2), ...n2.contexts }, n2.sdkProcessingMetadata = { dynamicSamplingContext: (0, m.getDynamicSamplingContextFromSpan)(r2), ...n2.sdkProcessingMetadata }, l2 = (0, h.getRootSpan)(r2), (p2 = (0, h.spanToJSON)(l2).description) && !n2.transaction && "transaction" === n2.type && (n2.transaction = p2)), i2 = t2, s2 = _2, i2.fingerprint = i2.fingerprint ? Array.isArray(i2.fingerprint) ? i2.fingerprint : [i2.fingerprint] : [], s2 && (i2.fingerprint = i2.fingerprint.concat(s2)), i2.fingerprint.length || delete i2.fingerprint, a2 = t2, o2 = f2, d2 = [...a2.breadcrumbs || [], ...o2], a2.breadcrumbs = d2.length ? d2 : void 0, c2 = t2, u2 = S2, c2.sdkProcessingMetadata = { ...c2.sdkProcessingMetadata, ...u2 };
      }
      function z(t2, e2) {
        let { extra: n2, tags: r2, attributes: i2, user: s2, contexts: a2, level: o2, sdkProcessingMetadata: c2, breadcrumbs: u2, fingerprint: l2, eventProcessors: p2, attachments: d2, propagationContext: _2, transactionName: g2, span: f2 } = e2;
        H(t2, "extra", n2), H(t2, "tags", r2), H(t2, "attributes", i2), H(t2, "user", s2), H(t2, "contexts", a2), t2.sdkProcessingMetadata = (0, Y.merge)(t2.sdkProcessingMetadata, c2, 2), o2 && (t2.level = o2), g2 && (t2.transactionName = g2), f2 && (t2.span = f2), u2.length && (t2.breadcrumbs = [...t2.breadcrumbs, ...u2]), l2.length && (t2.fingerprint = [...t2.fingerprint, ...l2]), p2.length && (t2.eventProcessors = [...t2.eventProcessors, ...p2]), d2.length && (t2.attachments = [...t2.attachments, ...d2]), t2.propagationContext = { ...t2.propagationContext, ..._2 };
      }
      function H(t2, e2, n2) {
        t2[e2] = (0, Y.merge)(t2[e2], n2, 1);
      }
      function K(t2, e2) {
        let n2 = (0, s.getGlobalScope)().getScopeData();
        return t2 && z(n2, t2.getScopeData()), e2 && z(n2, e2.getScopeData()), n2;
      }
      t.s(["applyScopeDataToEvent", () => V, "getCombinedScopeData", () => K], 294736);
      var W = t.i(257645);
      function q(t2, s2, o2, c2, u2, p2) {
        var d2, _2, g2;
        let f2, { normalizeDepth: h2 = 3, normalizeMaxBreadth: m2 = 1e3 } = t2, S2 = { ...s2, event_id: s2.event_id || o2.event_id || (0, L.uuid4)(), timestamp: s2.timestamp || (0, b.dateTimestampInSeconds)() }, E2 = o2.integrations || t2.integrations.map((t3) => t3.name);
        (function(t3, e2) {
          let { environment: n2, release: r2, dist: i2, maxValueLength: s3 } = e2;
          t3.environment = t3.environment || n2 || M.DEFAULT_ENVIRONMENT, !t3.release && r2 && (t3.release = r2), !t3.dist && i2 && (t3.dist = i2);
          let a2 = t3.request;
          a2?.url && s3 && (a2.url = (0, W.truncate)(a2.url, s3)), s3 && t3.exception?.values?.forEach((t4) => {
            t4.value && (t4.value = (0, W.truncate)(t4.value, s3));
          });
        })(S2, t2), d2 = S2, (_2 = E2).length > 0 && (d2.sdk = d2.sdk || {}, d2.sdk.integrations = [...d2.sdk.integrations || [], ..._2]), u2 && u2.emit("applyFrameMetadata", s2), void 0 === s2.type && (g2 = S2, f2 = function(t3) {
          let s3 = F.GLOBAL_OBJ._sentryDebugIds, a2 = F.GLOBAL_OBJ._debugIds;
          if (!s3 && !a2) return {};
          let o3 = s3 ? Object.keys(s3) : [], c3 = a2 ? Object.keys(a2) : [];
          if (i && o3.length === n && c3.length === r) return i;
          n = o3.length, r = c3.length, i = {}, e || (e = {});
          let u3 = (n2, r2) => {
            for (let s4 of n2) {
              let n3 = r2[s4], a3 = e?.[s4];
              if (a3 && i && n3) i[a3[0]] = n3, e && (e[s4] = [a3[0], n3]);
              else if (n3) {
                let r3 = t3(s4);
                for (let t4 = r3.length - 1; t4 >= 0; t4--) {
                  let a4 = r3[t4], o4 = a4?.filename;
                  if (o4 && i && e) {
                    i[o4] = n3, e[s4] = [o4, n3];
                    break;
                  }
                }
              }
            }
          };
          return s3 && u3(o3, s3), a2 && u3(c3, a2), i;
        }(t2.stackParser), g2.exception?.values?.forEach((t3) => {
          t3.stacktrace?.frames?.forEach((t4) => {
            t4.filename && (t4.debug_id = f2[t4.filename]);
          });
        }));
        let T2 = function(t3, e2) {
          if (!e2) return t3;
          let n2 = t3 ? t3.clone() : new j.Scope();
          return n2.update(e2), n2;
        }(c2, o2.captureContext);
        o2.mechanism && (0, L.addExceptionMechanism)(S2, o2.mechanism);
        let y2 = u2 ? u2.getEventProcessors() : [], v2 = K(p2, T2), I2 = [...o2.attachments || [], ...v2.attachments];
        return I2.length && (o2.attachments = I2), V(S2, v2), function(t3, e2, n2, r2 = 0) {
          try {
            let i2 = function t4(e3, n3, r3, i3) {
              let s3 = r3[i3];
              if (!e3 || !s3) return e3;
              let o3 = s3({ ...e3 }, n3);
              return (a.DEBUG_BUILD && null === o3 && l.debug.log(`Event processor "${s3.id || "?"}" dropped event`), (0, w.isThenable)(o3)) ? o3.then((e4) => t4(e4, n3, r3, i3 + 1)) : t4(o3, n3, r3, i3 + 1);
            }(e2, n2, t3, r2);
            return (0, w.isThenable)(i2) ? i2 : P(i2);
          } catch (t4) {
            return $(t4);
          }
        }([...y2, ...v2.eventProcessors], S2, o2).then((t3) => (t3 && function(t4) {
          let e2 = {};
          if (t4.exception?.values?.forEach((t5) => {
            t5.stacktrace?.frames?.forEach((t6) => {
              t6.debug_id && (t6.abs_path ? e2[t6.abs_path] = t6.debug_id : t6.filename && (e2[t6.filename] = t6.debug_id), delete t6.debug_id);
            });
          }), 0 === Object.keys(e2).length) return;
          t4.debug_meta = t4.debug_meta || {}, t4.debug_meta.images = t4.debug_meta.images || [];
          let n2 = t4.debug_meta.images;
          Object.entries(e2).forEach(([t5, e3]) => {
            n2.push({ type: "sourcemap", code_file: t5, debug_id: e3 });
          });
        }(t3), "number" == typeof h2 && h2 > 0) ? function(t4, e2, n2) {
          if (!t4) return null;
          let r2 = { ...t4, ...t4.breadcrumbs && { breadcrumbs: t4.breadcrumbs.map((t5) => ({ ...t5, ...t5.data && { data: (0, J.normalize)(t5.data, e2, n2) } })) }, ...t4.user && { user: (0, J.normalize)(t4.user, e2, n2) }, ...t4.contexts && { contexts: (0, J.normalize)(t4.contexts, e2, n2) }, ...t4.extra && { extra: (0, J.normalize)(t4.extra, e2, n2) } };
          return t4.contexts?.trace && r2.contexts && (r2.contexts.trace = t4.contexts.trace, t4.contexts.trace.data && (r2.contexts.trace.data = (0, J.normalize)(t4.contexts.trace.data, e2, n2))), t4.spans && (r2.spans = t4.spans.map((t5) => ({ ...t5, ...t5.data && { data: (0, J.normalize)(t5.data, e2, n2) } }))), t4.contexts?.flags && r2.contexts && (r2.contexts.flags = (0, J.normalize)(t4.contexts.flags, 3, n2)), r2;
        }(t3, h2, m2) : t3);
      }
      function X(t2) {
        if (t2) {
          var e2;
          return (e2 = t2) instanceof j.Scope || "function" == typeof e2 || Object.keys(t2).some((t3) => Q.includes(t3)) ? { captureContext: t2 } : t2;
        }
      }
      let Q = ["user", "level", "extra", "contexts", "tags", "fingerprint", "propagationContext"];
      function Z(t2, e2) {
        return (0, s.getCurrentScope)().captureException(t2, X(e2));
      }
      function tt(t2, e2) {
        return (0, s.getCurrentScope)().captureEvent(t2, e2);
      }
      async function te(t2) {
        let e2 = (0, s.getClient)();
        return e2 ? e2.flush(t2) : (a.DEBUG_BUILD && l.debug.warn("Cannot flush events. No client defined."), Promise.resolve(false));
      }
      function tn() {
        let t2 = (0, s.getClient)();
        return t2?.getOptions().enabled !== false && !!t2?.getTransport();
      }
      t.s(["parseEventHintOrCaptureContext", () => X, "prepareEvent", () => q], 133245), t.s(["captureEvent", () => tt, "captureException", () => Z, "flush", () => te, "isEnabled", () => tn], 598261);
    }, 485935, (t) => {
      "use strict";
      var e = t.i(499219);
      function n(t2) {
        let n2 = e.GLOBAL_OBJ[Symbol.for("@vercel/request-context")], r = n2?.get?.();
        r?.waitUntil && r.waitUntil(t2);
      }
      t.s(["vercelWaitUntil", () => n]);
    }, 465549, (t) => {
      "use strict";
      let e = "u" < typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__;
      t.s(["DEBUG_BUILD", () => e]);
    }, 499200, (t) => {
      "use strict";
      var e = t.i(485935), n = t.i(20174), r = t.i(598261), i = t.i(499219), s = t.i(465549);
      async function a() {
        try {
          s.DEBUG_BUILD && n.debug.log("Flushing events..."), await (0, r.flush)(2e3), s.DEBUG_BUILD && n.debug.log("Done flushing events");
        } catch (t2) {
          s.DEBUG_BUILD && n.debug.log("Error while flushing events:\n", t2);
        }
      }
      function o(t2) {
        var n2;
        "function" == typeof c()?.waitUntil ? (n2 = t2, c()?.waitUntil(n2)) : (0, e.vercelWaitUntil)(t2);
      }
      function c() {
        let t2 = Symbol.for("__cloudflare-context__");
        return i.GLOBAL_OBJ[t2]?.ctx;
      }
      t.s(["flushSafelyWithTimeout", () => a, "waitUntil", () => o]);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_b0bc9966.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_b0bc9966 = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_b0bc9966.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_b0bc9966.js", { otherChunks: ["chunks/[root-of-the-server]__f1390a54._.js", "chunks/_0727c437._.js", "chunks/node_modules_@sentry_f05d8265._.js"], runtimeModuleIds: [559858] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = /* @__PURE__ */ new WeakMap();
      function r(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let n = r.prototype, o = Object.prototype.hasOwnProperty, u = "u" > typeof Symbol && Symbol.toStringTag;
      function l(e2, t2, r2) {
        o.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function i(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = s(t2), e2[t2] = r2), r2;
      }
      function s(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function a(e2, t2) {
        l(e2, "__esModule", { value: true }), u && l(e2, u, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          if ("number" == typeof o2) if (0 === o2) l(e2, n2, { value: t2[r2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[r2] ? l(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : l(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      n.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = i(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, a(n2, e2);
      }, n.j = function(e2, r2) {
        var n2, u2;
        let l2, s2, a2;
        null != r2 ? s2 = (l2 = i(this.c, r2)).exports : (l2 = this.m, s2 = this.e);
        let c2 = (n2 = l2, u2 = s2, (a2 = t.get(n2)) || (t.set(n2, a2 = []), n2.exports = n2.namespaceObject = new Proxy(u2, { get(e3, t2) {
          if (o.call(e3, t2) || "default" === t2 || "__esModule" === t2) return Reflect.get(e3, t2);
          for (let e4 of a2) {
            let r3 = Reflect.get(e4, t2);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t2 = Reflect.ownKeys(e3);
          for (let e4 of a2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t2.includes(r3) || t2.push(r3);
          return t2;
        } })), a2);
        "object" == typeof e2 && null !== e2 && c2.push(e2);
      }, n.v = function(e2, t2) {
        (null != t2 ? i(this.c, t2) : this.m).exports = e2;
      }, n.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? i(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let c = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, f = [null, c({}), c([]), c(c)];
      function d(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !f.includes(t3); t3 = c(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), a(t2, n2), t2;
      }
      function h(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function p(e2) {
        let t2 = N(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = d(r2, h(r2), r2 && r2.__esModule);
      }
      function m(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function b(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function y() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      n.i = p, n.A = function(e2) {
        return this.r(e2)(p.bind(this));
      }, n.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, n.r = function(e2) {
        return N(e2, this.m).exports;
      }, n.f = function(e2) {
        function t2(t3) {
          if (t3 = m(t3), o.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = m(t3), o.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let O = Symbol("turbopack queues"), g = Symbol("turbopack exports"), w = Symbol("turbopack error");
      function _(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      n.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: l2, promise: i2 } = y(), s2 = Object.assign(i2, { [g]: r2.exports, [O]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), s2.catch(() => {
          });
        } }), a2 = { get: () => s2, set(e3) {
          e3 !== s2 && (s2[g] = e3);
        } };
        Object.defineProperty(r2, "exports", a2), Object.defineProperty(r2, "namespaceObject", a2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (O in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [g]: {}, [O]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[g] = e5, _(t4);
                }, (e5) => {
                  r4[w] = e5, _(t4);
                }), r4;
              }
            }
            return { [g]: e4, [O]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[w]) throw e4[w];
            return e4[g];
          }), { promise: u3, resolve: l3 } = y(), i3 = Object.assign(() => l3(r3), { queueCount: 0 });
          function s3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (i3.queueCount++, e4.push(i3)));
          }
          return t3.map((e4) => e4[O](s3)), i3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? l2(s2[w] = e3) : u2(s2[g]), _(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let C = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function j(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      C.prototype = URL.prototype, n.U = C, n.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, n.g = globalThis;
      let k = r.prototype;
      var U, R = ((U = R || {})[U.Runtime = 0] = "Runtime", U[U.Parent = 1] = "Parent", U[U.Update = 2] = "Update", U);
      let P = /* @__PURE__ */ new Map();
      n.M = P;
      let v = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
      async function $(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return M(e2, t2, A(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!P.has(e3) || v.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let l2 = r2.moduleChunks || [], i2 = l2.map((e3) => T.get(e3)).filter((e3) => e3);
        if (i2.length > 0) {
          if (i2.length === l2.length) return void await Promise.all(i2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of l2) T.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = M(e2, t2, A(n3));
            T.set(n3, r4), i2.push(r4);
          }
          n2 = Promise.all(i2);
        } else {
          for (let o3 of (n2 = M(e2, t2, A(r2.path)), l2)) T.has(o3) || T.set(o3, n2);
        }
        for (let e3 of o2) v.has(e3) || v.set(e3, n2);
        await n2;
      }
      k.l = function(e2) {
        return $(1, this.m.id, e2);
      };
      let x = Promise.resolve(void 0), E = /* @__PURE__ */ new WeakMap();
      function M(t2, r2, n2) {
        let o2 = e.loadChunkCached(t2, n2), u2 = E.get(o2);
        if (void 0 === u2) {
          let e2 = E.set.bind(E, o2, x);
          u2 = o2.then(e2).catch((e3) => {
            let o3;
            switch (t2) {
              case 0:
                o3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case 1:
                o3 = `from module ${r2}`;
                break;
              case 2:
                o3 = "from an HMR update";
                break;
              default:
                j(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let u3 = Error(`Failed to load chunk ${n2} ${o3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw u3.name = "ChunkLoadError", u3;
          }), E.set(o2, u2);
        }
        return u2;
      }
      function A(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      k.L = function(e2) {
        return M(1, this.m.id, e2);
      }, k.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, k.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, k.b = function(e2) {
        let t2 = new Blob([`self.TURBOPACK_WORKER_LOCATION = ${JSON.stringify(location.origin)};
self.TURBOPACK_CHUNK_SUFFIX = ${JSON.stringify("")};
self.TURBOPACK_NEXT_CHUNK_URLS = ${JSON.stringify(e2.reverse().map(A), null, 2)};
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => self.TURBOPACK_WORKER_LOCATION + c).reverse());`], { type: "text/javascript" });
        return URL.createObjectURL(t2);
      };
      let K = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      n.w = function(t2, r2, n2) {
        return e.loadWebAssembly(1, this.m.id, t2, r2, n2);
      }, n.u = function(t2, r2) {
        return e.loadWebAssemblyModule(1, this.m.id, t2, r2);
      };
      let S = {};
      n.c = S;
      let N = (e2, t2) => {
        let r2 = S[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return q(e2, R.Parent, t2.id);
      };
      function q(e2, t2, n2) {
        let o2 = P.get(e2);
        if ("function" != typeof o2) throw Error(function(e3, t3, r2) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r2}`;
              break;
            case 1:
              n3 = `because it was required from module ${r2}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              j(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, n2));
        let u2 = s(e2), l2 = u2.exports;
        S[e2] = u2;
        let i2 = new r(u2, l2);
        try {
          o2(i2, u2, l2);
        } catch (e3) {
          throw u2.error = e3, e3;
        }
        return u2.namespaceObject && u2.exports !== u2.namespaceObject && d(u2.exports, u2.namespaceObject), u2;
      }
      function L(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          let t3 = decodeURIComponent(("u" > typeof TURBOPACK_NEXT_CHUNK_URLS ? TURBOPACK_NEXT_CHUNK_URLS.pop() : e2.getAttribute("src")).replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3, r3, n3) {
          let o2 = 1;
          for (; o2 < e2.length; ) {
            let t4 = e2[o2], n4 = o2 + 1;
            for (; n4 < e2.length && "function" != typeof e2[n4]; ) n4++;
            if (n4 === e2.length) throw Error("malformed chunk format, expected a factory function");
            if (!r3.has(t4)) {
              let u2 = e2[n4];
              for (Object.defineProperty(u2, "name", { value: "module evaluation" }); o2 < n4; o2++) t4 = e2[o2], r3.set(t4, u2);
            }
            o2 = n4 + 1;
          }
        }(t2, 0, P)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : d(n2, h(n2), true);
      }
      n.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? d(t2.default, h(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), n.x = B, e = { registerChunk(e2, t2) {
        I.add(e2), function(e3) {
          let t3 = W.get(e3);
          if (null != t3) {
            for (let r2 of t3) r2.requiredChunks.delete(e3), 0 === r2.requiredChunks.size && F(r2.runtimeModuleIds, r2.chunkPath);
            W.delete(e3);
          }
        }(e2), null != t2 && (0 === t2.otherChunks.length ? F(t2.runtimeModuleIds, e2) : function(e3, t3, r2) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r2, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = b(e4);
            if (I.has(t4)) continue;
            n2.add(t4);
            let r3 = W.get(t4);
            null == r3 && (r3 = /* @__PURE__ */ new Set(), W.set(t4, r3)), r3.add(o2);
          }
          0 === o2.requiredChunks.size && F(o2.runtimeModuleIds, o2.chunkPath);
        }(e2, t2.otherChunks.filter((e3) => {
          var t3;
          return t3 = b(e3), K.test(t3);
        }), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      }, async loadWebAssembly(e2, t2, r2, n2, o2) {
        let u2 = await H(r2, n2);
        return await WebAssembly.instantiate(u2, o2);
      }, loadWebAssemblyModule: async (e2, t2, r2, n2) => H(r2, n2) };
      let I = /* @__PURE__ */ new Set(), W = /* @__PURE__ */ new Map();
      function F(e2, t2) {
        for (let r2 of e2) !function(e3, t3) {
          let r3 = S[t3];
          if (r3) {
            if (r3.error) throw r3.error;
            return;
          }
          q(t3, R.Runtime, e3);
        }(t2, r2);
      }
      async function H(e2, t2) {
        let r2;
        try {
          r2 = t2();
        } catch (e3) {
        }
        if (!r2) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
        return r2;
      }
      let X = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: L }, X.forEach(L);
    })();
  }
});

// .next/server/edge/chunks/[root-of-the-server]__2112c9b3._.js
var require_root_of_the_server_2112c9b3 = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__2112c9b3._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__2112c9b3._.js", 951615, (e, r, t) => {
      r.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 435825, (e, r, t) => {
      self._ENTRIES ||= {};
      let h = Promise.resolve().then(() => e.i(558217));
      h.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(h, { get(e2, r2) {
        if ("then" === r2) return (r3, t3) => e2.then(r3, t3);
        let t2 = (...t3) => e2.then((e3) => (0, e3[r2])(...t3));
        return t2.then = (t3, h2) => e2.then((e3) => e3[r2]).then(t3, h2), t2;
      } });
    }]);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__4d77b799._.js
var require_root_of_the_server_4d77b799 = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__4d77b799._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__4d77b799._.js", 828042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, s = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = {}, l = { RequestCookies: () => g, ResponseCookies: () => m, parseCookie: () => h, parseSetCookie: () => d, stringifyCookie: () => c };
      for (var u in l) n(o, u, { get: l[u], enumerable: true });
      function c(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function h(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, s2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != s2 ? s2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function d(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = h(e2), { domain: s2, expires: i2, httponly: a2, maxage: o2, path: l2, samesite: u2, secure: c2, partitioned: d2, priority: g2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m2, y, b = { name: t2, value: decodeURIComponent(r2), domain: s2, ...i2 && { expires: new Date(i2) }, ...a2 && { httpOnly: true }, ..."string" == typeof o2 && { maxAge: Number(o2) }, path: l2, ...u2 && { sameSite: p.includes(m2 = (m2 = u2).toLowerCase()) ? m2 : void 0 }, ...c2 && { secure: true }, ...g2 && { priority: f.includes(y = (y = g2).toLowerCase()) ? y : void 0 }, ...d2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2, o2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of i(t2)) a.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(o2 = s(t2, l2)) || o2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), o);
      var p = ["strict", "lax", "none"], f = ["low", "medium", "high"], g = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of h(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => c(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => c(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, m = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const s2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(s2) ? s2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, s3, i2, a2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, i2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (n3 = o2, o2 += 1, l2(), s3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (i2 = true, o2 = s3, a2.push(e4.substring(t3, n3)), t3 = o2) : o2 = n3 + 1;
              } else o2 += 1;
              (!i2 || o2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(s2)) {
            const t3 = d(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, s2 = this._parsed;
          return s2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = c(r3);
              t3.append("set-cookie", e4);
            }
          }(s2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(c).join("; ");
        }
      };
    }, 311646, (e) => {
      "use strict";
      function t(e7) {
        return Symbol.for(e7);
      }
      var r, n, s, i, a, o, l, u, c, h, d, p, f, g = new function e7(t2) {
        var r2 = this;
        r2._currentContext = t2 ? new Map(t2) : /* @__PURE__ */ new Map(), r2.getValue = function(e9) {
          return r2._currentContext.get(e9);
        }, r2.setValue = function(t3, n2) {
          var s2 = new e7(r2._currentContext);
          return s2._currentContext.set(t3, n2), s2;
        }, r2.deleteValue = function(t3) {
          var n2 = new e7(r2._currentContext);
          return n2._currentContext.delete(t3), n2;
        };
      }(), m = function(e7, t2) {
        var r2 = "function" == typeof Symbol && e7[Symbol.iterator];
        if (!r2) return e7;
        var n2, s2, i2 = r2.call(e7), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e9) {
          s2 = { error: e9 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (s2) throw s2.error;
          }
        }
        return a2;
      }, y = function(e7, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, s2 = 0, i2 = t2.length; s2 < i2; s2++) !n2 && s2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, s2)), n2[s2] = t2[s2]);
        return e7.concat(n2 || Array.prototype.slice.call(t2));
      }, b = function() {
        function e7() {
        }
        return e7.prototype.active = function() {
          return g;
        }, e7.prototype.with = function(e9, t2, r2) {
          for (var n2 = [], s2 = 3; s2 < arguments.length; s2++) n2[s2 - 3] = arguments[s2];
          return t2.call.apply(t2, y([r2], m(n2), false));
        }, e7.prototype.bind = function(e9, t2) {
          return t2;
        }, e7.prototype.enable = function() {
          return this;
        }, e7.prototype.disable = function() {
          return this;
        }, e7;
      }(), w = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : e.g, v = "1.9.0", _ = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, S = function(e7) {
        var t2 = /* @__PURE__ */ new Set([e7]), r2 = /* @__PURE__ */ new Set(), n2 = e7.match(_);
        if (!n2) return function() {
          return false;
        };
        var s2 = { major: +n2[1], minor: +n2[2], patch: +n2[3], prerelease: n2[4] };
        if (null != s2.prerelease) return function(t3) {
          return t3 === e7;
        };
        function i2(e9) {
          return r2.add(e9), false;
        }
        return function(e9) {
          if (t2.has(e9)) return true;
          if (r2.has(e9)) return false;
          var n3 = e9.match(_);
          if (!n3) return i2(e9);
          var a2 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
          if (null != a2.prerelease || s2.major !== a2.major) return i2(e9);
          if (0 === s2.major) return s2.minor === a2.minor && s2.patch <= a2.patch ? (t2.add(e9), true) : i2(e9);
          return s2.minor <= a2.minor ? (t2.add(e9), true) : i2(e9);
        };
      }(v), k = Symbol.for("opentelemetry.js.api." + v.split(".")[0]);
      function E(e7, t2, r2, n2) {
        void 0 === n2 && (n2 = false);
        var s2, i2 = w[k] = null != (s2 = w[k]) ? s2 : { version: v };
        if (!n2 && i2[e7]) {
          var a2 = Error("@opentelemetry/api: Attempted duplicate registration of API: " + e7);
          return r2.error(a2.stack || a2.message), false;
        }
        if (i2.version !== v) {
          var a2 = Error("@opentelemetry/api: Registration of version v" + i2.version + " for " + e7 + " does not match previously registered API v" + v);
          return r2.error(a2.stack || a2.message), false;
        }
        return i2[e7] = t2, r2.debug("@opentelemetry/api: Registered a global for " + e7 + " v" + v + "."), true;
      }
      function T(e7) {
        var t2, r2, n2 = null == (t2 = w[k]) ? void 0 : t2.version;
        if (n2 && S(n2)) return null == (r2 = w[k]) ? void 0 : r2[e7];
      }
      function R(e7, t2) {
        t2.debug("@opentelemetry/api: Unregistering a global for " + e7 + " v" + v + ".");
        var r2 = w[k];
        r2 && delete r2[e7];
      }
      var O = function(e7, t2) {
        var r2 = "function" == typeof Symbol && e7[Symbol.iterator];
        if (!r2) return e7;
        var n2, s2, i2 = r2.call(e7), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e9) {
          s2 = { error: e9 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (s2) throw s2.error;
          }
        }
        return a2;
      }, x = function(e7, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, s2 = 0, i2 = t2.length; s2 < i2; s2++) !n2 && s2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, s2)), n2[s2] = t2[s2]);
        return e7.concat(n2 || Array.prototype.slice.call(t2));
      }, C = function() {
        function e7(e9) {
          this._namespace = e9.namespace || "DiagComponentLogger";
        }
        return e7.prototype.debug = function() {
          for (var e9 = [], t2 = 0; t2 < arguments.length; t2++) e9[t2] = arguments[t2];
          return A("debug", this._namespace, e9);
        }, e7.prototype.error = function() {
          for (var e9 = [], t2 = 0; t2 < arguments.length; t2++) e9[t2] = arguments[t2];
          return A("error", this._namespace, e9);
        }, e7.prototype.info = function() {
          for (var e9 = [], t2 = 0; t2 < arguments.length; t2++) e9[t2] = arguments[t2];
          return A("info", this._namespace, e9);
        }, e7.prototype.warn = function() {
          for (var e9 = [], t2 = 0; t2 < arguments.length; t2++) e9[t2] = arguments[t2];
          return A("warn", this._namespace, e9);
        }, e7.prototype.verbose = function() {
          for (var e9 = [], t2 = 0; t2 < arguments.length; t2++) e9[t2] = arguments[t2];
          return A("verbose", this._namespace, e9);
        }, e7;
      }();
      function A(e7, t2, r2) {
        var n2 = T("diag");
        if (n2) return r2.unshift(t2), n2[e7].apply(n2, x([], O(r2), false));
      }
      (l = r || (r = {}))[l.NONE = 0] = "NONE", l[l.ERROR = 30] = "ERROR", l[l.WARN = 50] = "WARN", l[l.INFO = 60] = "INFO", l[l.DEBUG = 70] = "DEBUG", l[l.VERBOSE = 80] = "VERBOSE", l[l.ALL = 9999] = "ALL";
      var P = function(e7, t2) {
        var r2 = "function" == typeof Symbol && e7[Symbol.iterator];
        if (!r2) return e7;
        var n2, s2, i2 = r2.call(e7), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e9) {
          s2 = { error: e9 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (s2) throw s2.error;
          }
        }
        return a2;
      }, j = function(e7, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, s2 = 0, i2 = t2.length; s2 < i2; s2++) !n2 && s2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, s2)), n2[s2] = t2[s2]);
        return e7.concat(n2 || Array.prototype.slice.call(t2));
      }, I = function() {
        function e7() {
          function e9(e10) {
            return function() {
              for (var t3 = [], r2 = 0; r2 < arguments.length; r2++) t3[r2] = arguments[r2];
              var n2 = T("diag");
              if (n2) return n2[e10].apply(n2, j([], P(t3), false));
            };
          }
          var t2 = this;
          t2.setLogger = function(e10, n2) {
            if (void 0 === n2 && (n2 = { logLevel: r.INFO }), e10 === t2) {
              var s2, i2, a2, o2 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
              return t2.error(null != (s2 = o2.stack) ? s2 : o2.message), false;
            }
            "number" == typeof n2 && (n2 = { logLevel: n2 });
            var l2 = T("diag"), u2 = function(e11, t3) {
              function n3(r2, n4) {
                var s3 = t3[r2];
                return "function" == typeof s3 && e11 >= n4 ? s3.bind(t3) : function() {
                };
              }
              return e11 < r.NONE ? e11 = r.NONE : e11 > r.ALL && (e11 = r.ALL), t3 = t3 || {}, { error: n3("error", r.ERROR), warn: n3("warn", r.WARN), info: n3("info", r.INFO), debug: n3("debug", r.DEBUG), verbose: n3("verbose", r.VERBOSE) };
            }(null != (i2 = n2.logLevel) ? i2 : r.INFO, e10);
            if (l2 && !n2.suppressOverrideMessage) {
              var c2 = null != (a2 = Error().stack) ? a2 : "<failed to generate stacktrace>";
              l2.warn("Current logger will be overwritten from " + c2), u2.warn("Current logger will overwrite one already registered from " + c2);
            }
            return E("diag", u2, t2, true);
          }, t2.disable = function() {
            R("diag", t2);
          }, t2.createComponentLogger = function(e10) {
            return new C(e10);
          }, t2.verbose = e9("verbose"), t2.debug = e9("debug"), t2.info = e9("info"), t2.warn = e9("warn"), t2.error = e9("error");
        }
        return e7.instance = function() {
          return this._instance || (this._instance = new e7()), this._instance;
        }, e7;
      }(), $ = function(e7, t2) {
        var r2 = "function" == typeof Symbol && e7[Symbol.iterator];
        if (!r2) return e7;
        var n2, s2, i2 = r2.call(e7), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e9) {
          s2 = { error: e9 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (s2) throw s2.error;
          }
        }
        return a2;
      }, N = function(e7, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, s2 = 0, i2 = t2.length; s2 < i2; s2++) !n2 && s2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, s2)), n2[s2] = t2[s2]);
        return e7.concat(n2 || Array.prototype.slice.call(t2));
      }, U = "context", L = new b(), D = function() {
        function e7() {
        }
        return e7.getInstance = function() {
          return this._instance || (this._instance = new e7()), this._instance;
        }, e7.prototype.setGlobalContextManager = function(e9) {
          return E(U, e9, I.instance());
        }, e7.prototype.active = function() {
          return this._getContextManager().active();
        }, e7.prototype.with = function(e9, t2, r2) {
          for (var n2, s2 = [], i2 = 3; i2 < arguments.length; i2++) s2[i2 - 3] = arguments[i2];
          return (n2 = this._getContextManager()).with.apply(n2, N([e9, t2, r2], $(s2), false));
        }, e7.prototype.bind = function(e9, t2) {
          return this._getContextManager().bind(e9, t2);
        }, e7.prototype._getContextManager = function() {
          return T(U) || L;
        }, e7.prototype.disable = function() {
          this._getContextManager().disable(), R(U, I.instance());
        }, e7;
      }(), q = D.getInstance(), B = I.instance(), M = (u = function(e7, t2) {
        return (u = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e9, t3) {
          e9.__proto__ = t3;
        } || function(e9, t3) {
          for (var r2 in t3) Object.prototype.hasOwnProperty.call(t3, r2) && (e9[r2] = t3[r2]);
        })(e7, t2);
      }, function(e7, t2) {
        if ("function" != typeof t2 && null !== t2) throw TypeError("Class extends value " + String(t2) + " is not a constructor or null");
        function r2() {
          this.constructor = e7;
        }
        u(e7, t2), e7.prototype = null === t2 ? Object.create(t2) : (r2.prototype = t2.prototype, new r2());
      }), W = function() {
        function e7() {
        }
        return e7.prototype.createGauge = function(e9, t2) {
          return ee;
        }, e7.prototype.createHistogram = function(e9, t2) {
          return et;
        }, e7.prototype.createCounter = function(e9, t2) {
          return Z;
        }, e7.prototype.createUpDownCounter = function(e9, t2) {
          return er;
        }, e7.prototype.createObservableGauge = function(e9, t2) {
          return es;
        }, e7.prototype.createObservableCounter = function(e9, t2) {
          return en;
        }, e7.prototype.createObservableUpDownCounter = function(e9, t2) {
          return ei;
        }, e7.prototype.addBatchObservableCallback = function(e9, t2) {
        }, e7.prototype.removeBatchObservableCallback = function(e9) {
        }, e7;
      }(), H = function() {
      }, z = function(e7) {
        function t2() {
          return null !== e7 && e7.apply(this, arguments) || this;
        }
        return M(t2, e7), t2.prototype.add = function(e9, t3) {
        }, t2;
      }(H), V = function(e7) {
        function t2() {
          return null !== e7 && e7.apply(this, arguments) || this;
        }
        return M(t2, e7), t2.prototype.add = function(e9, t3) {
        }, t2;
      }(H), K = function(e7) {
        function t2() {
          return null !== e7 && e7.apply(this, arguments) || this;
        }
        return M(t2, e7), t2.prototype.record = function(e9, t3) {
        }, t2;
      }(H), F = function(e7) {
        function t2() {
          return null !== e7 && e7.apply(this, arguments) || this;
        }
        return M(t2, e7), t2.prototype.record = function(e9, t3) {
        }, t2;
      }(H), G = function() {
        function e7() {
        }
        return e7.prototype.addCallback = function(e9) {
        }, e7.prototype.removeCallback = function(e9) {
        }, e7;
      }(), J = function(e7) {
        function t2() {
          return null !== e7 && e7.apply(this, arguments) || this;
        }
        return M(t2, e7), t2;
      }(G), X = function(e7) {
        function t2() {
          return null !== e7 && e7.apply(this, arguments) || this;
        }
        return M(t2, e7), t2;
      }(G), Y = function(e7) {
        function t2() {
          return null !== e7 && e7.apply(this, arguments) || this;
        }
        return M(t2, e7), t2;
      }(G), Q = new W(), Z = new z(), ee = new K(), et = new F(), er = new V(), en = new J(), es = new X(), ei = new Y();
      function ea() {
        return Q;
      }
      var eo = new (function() {
        function e7() {
        }
        return e7.prototype.getMeter = function(e9, t2, r2) {
          return Q;
        }, e7;
      }())(), el = "metrics", eu = function() {
        function e7() {
        }
        return e7.getInstance = function() {
          return this._instance || (this._instance = new e7()), this._instance;
        }, e7.prototype.setGlobalMeterProvider = function(e9) {
          return E(el, e9, I.instance());
        }, e7.prototype.getMeterProvider = function() {
          return T(el) || eo;
        }, e7.prototype.getMeter = function(e9, t2, r2) {
          return this.getMeterProvider().getMeter(e9, t2, r2);
        }, e7.prototype.disable = function() {
          R(el, I.instance());
        }, e7;
      }().getInstance(), ec = function() {
        function e7() {
        }
        return e7.prototype.inject = function(e9, t2) {
        }, e7.prototype.extract = function(e9, t2) {
          return e9;
        }, e7.prototype.fields = function() {
          return [];
        }, e7;
      }(), eh = { get: function(e7, t2) {
        if (null != e7) return e7[t2];
      }, keys: function(e7) {
        return null == e7 ? [] : Object.keys(e7);
      } }, ed = { set: function(e7, t2, r2) {
        null != e7 && (e7[t2] = r2);
      } }, ep = t("OpenTelemetry Baggage Key");
      function ef(e7) {
        return e7.getValue(ep) || void 0;
      }
      function eg() {
        return ef(D.getInstance().active());
      }
      function em(e7, t2) {
        return e7.setValue(ep, t2);
      }
      function ey(e7) {
        return e7.deleteValue(ep);
      }
      var eb = function(e7, t2) {
        var r2 = "function" == typeof Symbol && e7[Symbol.iterator];
        if (!r2) return e7;
        var n2, s2, i2 = r2.call(e7), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = i2.next()).done; ) a2.push(n2.value);
        } catch (e9) {
          s2 = { error: e9 };
        } finally {
          try {
            n2 && !n2.done && (r2 = i2.return) && r2.call(i2);
          } finally {
            if (s2) throw s2.error;
          }
        }
        return a2;
      }, ew = function(e7) {
        var t2 = "function" == typeof Symbol && Symbol.iterator, r2 = t2 && e7[t2], n2 = 0;
        if (r2) return r2.call(e7);
        if (e7 && "number" == typeof e7.length) return { next: function() {
          return e7 && n2 >= e7.length && (e7 = void 0), { value: e7 && e7[n2++], done: !e7 };
        } };
        throw TypeError(t2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }, ev = function() {
        function e7(e9) {
          this._entries = e9 ? new Map(e9) : /* @__PURE__ */ new Map();
        }
        return e7.prototype.getEntry = function(e9) {
          var t2 = this._entries.get(e9);
          if (t2) return Object.assign({}, t2);
        }, e7.prototype.getAllEntries = function() {
          return Array.from(this._entries.entries()).map(function(e9) {
            var t2 = eb(e9, 2);
            return [t2[0], t2[1]];
          });
        }, e7.prototype.setEntry = function(t2, r2) {
          var n2 = new e7(this._entries);
          return n2._entries.set(t2, r2), n2;
        }, e7.prototype.removeEntry = function(t2) {
          var r2 = new e7(this._entries);
          return r2._entries.delete(t2), r2;
        }, e7.prototype.removeEntries = function() {
          for (var t2, r2, n2 = [], s2 = 0; s2 < arguments.length; s2++) n2[s2] = arguments[s2];
          var i2 = new e7(this._entries);
          try {
            for (var a2 = ew(n2), o2 = a2.next(); !o2.done; o2 = a2.next()) {
              var l2 = o2.value;
              i2._entries.delete(l2);
            }
          } catch (e9) {
            t2 = { error: e9 };
          } finally {
            try {
              o2 && !o2.done && (r2 = a2.return) && r2.call(a2);
            } finally {
              if (t2) throw t2.error;
            }
          }
          return i2;
        }, e7.prototype.clear = function() {
          return new e7();
        }, e7;
      }(), e_ = Symbol("BaggageEntryMetadata"), eS = I.instance();
      function ek(e7) {
        return void 0 === e7 && (e7 = {}), new ev(new Map(Object.entries(e7)));
      }
      function eE(e7) {
        return "string" != typeof e7 && (eS.error("Cannot create baggage metadata from unknown type: " + typeof e7), e7 = ""), { __TYPE__: e_, toString: function() {
          return e7;
        } };
      }
      var eT = "propagation", eR = new ec(), eO = function() {
        function e7() {
          this.createBaggage = ek, this.getBaggage = ef, this.getActiveBaggage = eg, this.setBaggage = em, this.deleteBaggage = ey;
        }
        return e7.getInstance = function() {
          return this._instance || (this._instance = new e7()), this._instance;
        }, e7.prototype.setGlobalPropagator = function(e9) {
          return E(eT, e9, I.instance());
        }, e7.prototype.inject = function(e9, t2, r2) {
          return void 0 === r2 && (r2 = ed), this._getGlobalPropagator().inject(e9, t2, r2);
        }, e7.prototype.extract = function(e9, t2, r2) {
          return void 0 === r2 && (r2 = eh), this._getGlobalPropagator().extract(e9, t2, r2);
        }, e7.prototype.fields = function() {
          return this._getGlobalPropagator().fields();
        }, e7.prototype.disable = function() {
          R(eT, I.instance());
        }, e7.prototype._getGlobalPropagator = function() {
          return T(eT) || eR;
        }, e7;
      }().getInstance();
      (c = n || (n = {}))[c.NONE = 0] = "NONE", c[c.SAMPLED = 1] = "SAMPLED";
      var ex = "0000000000000000", eC = "00000000000000000000000000000000", eA = { traceId: eC, spanId: ex, traceFlags: n.NONE }, eP = function() {
        function e7(e9) {
          void 0 === e9 && (e9 = eA), this._spanContext = e9;
        }
        return e7.prototype.spanContext = function() {
          return this._spanContext;
        }, e7.prototype.setAttribute = function(e9, t2) {
          return this;
        }, e7.prototype.setAttributes = function(e9) {
          return this;
        }, e7.prototype.addEvent = function(e9, t2) {
          return this;
        }, e7.prototype.addLink = function(e9) {
          return this;
        }, e7.prototype.addLinks = function(e9) {
          return this;
        }, e7.prototype.setStatus = function(e9) {
          return this;
        }, e7.prototype.updateName = function(e9) {
          return this;
        }, e7.prototype.end = function(e9) {
        }, e7.prototype.isRecording = function() {
          return false;
        }, e7.prototype.recordException = function(e9, t2) {
        }, e7;
      }(), ej = t("OpenTelemetry Context Key SPAN");
      function eI(e7) {
        return e7.getValue(ej) || void 0;
      }
      function e$() {
        return eI(D.getInstance().active());
      }
      function eN(e7, t2) {
        return e7.setValue(ej, t2);
      }
      function eU(e7) {
        return e7.deleteValue(ej);
      }
      function eL(e7, t2) {
        return eN(e7, new eP(t2));
      }
      function eD(e7) {
        var t2;
        return null == (t2 = eI(e7)) ? void 0 : t2.spanContext();
      }
      var eq = /^([0-9a-f]{32})$/i, eB = /^[0-9a-f]{16}$/i;
      function eM(e7) {
        return eq.test(e7) && e7 !== eC;
      }
      function eW(e7) {
        return eB.test(e7) && e7 !== ex;
      }
      function eH(e7) {
        return eM(e7.traceId) && eW(e7.spanId);
      }
      function ez(e7) {
        return new eP(e7);
      }
      var eV = D.getInstance(), eK = function() {
        function e7() {
        }
        return e7.prototype.startSpan = function(e9, t2, r2) {
          if (void 0 === r2 && (r2 = eV.active()), null == t2 ? void 0 : t2.root) return new eP();
          var n2, s2 = r2 && eD(r2);
          return "object" == typeof (n2 = s2) && "string" == typeof n2.spanId && "string" == typeof n2.traceId && "number" == typeof n2.traceFlags && eH(s2) ? new eP(s2) : new eP();
        }, e7.prototype.startActiveSpan = function(e9, t2, r2, n2) {
          if (!(arguments.length < 2)) {
            2 == arguments.length ? a2 = t2 : 3 == arguments.length ? (s2 = t2, a2 = r2) : (s2 = t2, i2 = r2, a2 = n2);
            var s2, i2, a2, o2 = null != i2 ? i2 : eV.active(), l2 = this.startSpan(e9, s2, o2), u2 = eN(o2, l2);
            return eV.with(u2, a2, void 0, l2);
          }
        }, e7;
      }(), eF = new eK(), eG = function() {
        function e7(e9, t2, r2, n2) {
          this._provider = e9, this.name = t2, this.version = r2, this.options = n2;
        }
        return e7.prototype.startSpan = function(e9, t2, r2) {
          return this._getTracer().startSpan(e9, t2, r2);
        }, e7.prototype.startActiveSpan = function(e9, t2, r2, n2) {
          var s2 = this._getTracer();
          return Reflect.apply(s2.startActiveSpan, s2, arguments);
        }, e7.prototype._getTracer = function() {
          if (this._delegate) return this._delegate;
          var e9 = this._provider.getDelegateTracer(this.name, this.version, this.options);
          return e9 ? (this._delegate = e9, this._delegate) : eF;
        }, e7;
      }(), eJ = new (function() {
        function e7() {
        }
        return e7.prototype.getTracer = function(e9, t2, r2) {
          return new eK();
        }, e7;
      }())(), eX = function() {
        function e7() {
        }
        return e7.prototype.getTracer = function(e9, t2, r2) {
          var n2;
          return null != (n2 = this.getDelegateTracer(e9, t2, r2)) ? n2 : new eG(this, e9, t2, r2);
        }, e7.prototype.getDelegate = function() {
          var e9;
          return null != (e9 = this._delegate) ? e9 : eJ;
        }, e7.prototype.setDelegate = function(e9) {
          this._delegate = e9;
        }, e7.prototype.getDelegateTracer = function(e9, t2, r2) {
          var n2;
          return null == (n2 = this._delegate) ? void 0 : n2.getTracer(e9, t2, r2);
        }, e7;
      }(), eY = "trace", eQ = function() {
        function e7() {
          this._proxyTracerProvider = new eX(), this.wrapSpanContext = ez, this.isSpanContextValid = eH, this.deleteSpan = eU, this.getSpan = eI, this.getActiveSpan = e$, this.getSpanContext = eD, this.setSpan = eN, this.setSpanContext = eL;
        }
        return e7.getInstance = function() {
          return this._instance || (this._instance = new e7()), this._instance;
        }, e7.prototype.setGlobalTracerProvider = function(e9) {
          var t2 = E(eY, this._proxyTracerProvider, I.instance());
          return t2 && this._proxyTracerProvider.setDelegate(e9), t2;
        }, e7.prototype.getTracerProvider = function() {
          return T(eY) || this._proxyTracerProvider;
        }, e7.prototype.getTracer = function(e9, t2) {
          return this.getTracerProvider().getTracer(e9, t2);
        }, e7.prototype.disable = function() {
          R(eY, I.instance()), this._proxyTracerProvider = new eX();
        }, e7;
      }().getInstance();
      let eZ = { context: q, diag: B, metrics: eu, propagation: eO, trace: eQ };
      e.s(["default", 0, eZ], 47071), e.i(47071);
      var e0 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }], e1 = function() {
        for (var e7 = 0; e7 < e0.length; e7++) this[e0[e7].n] = /* @__PURE__ */ function(e9) {
          return function() {
            for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
            if (console) {
              var n2 = console[e9];
              if ("function" != typeof n2 && (n2 = console.log), "function" == typeof n2) return n2.apply(console, t2);
            }
          };
        }(e0[e7].c);
      };
      (h = s || (s = {}))[h.INT = 0] = "INT", h[h.DOUBLE = 1] = "DOUBLE", (d = i || (i = {}))[d.NOT_RECORD = 0] = "NOT_RECORD", d[d.RECORD = 1] = "RECORD", d[d.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED", (p = a || (a = {}))[p.INTERNAL = 0] = "INTERNAL", p[p.SERVER = 1] = "SERVER", p[p.CLIENT = 2] = "CLIENT", p[p.PRODUCER = 3] = "PRODUCER", p[p.CONSUMER = 4] = "CONSUMER", (f = o || (o = {}))[f.UNSET = 0] = "UNSET", f[f.OK = 1] = "OK", f[f.ERROR = 2] = "ERROR";
      var e2 = "[_0-9a-z-*/]", e3 = RegExp("^(?:[a-z]" + e2 + "{0,255}|" + ("[a-z0-9]" + e2 + "{0,240}@[a-z]") + e2 + "{0,13})$"), e4 = /^[ -~]{0,255}[!-~]$/, e6 = /,|=/, e5 = function() {
        function e7(e9) {
          this._internalState = /* @__PURE__ */ new Map(), e9 && this._parse(e9);
        }
        return e7.prototype.set = function(e9, t2) {
          var r2 = this._clone();
          return r2._internalState.has(e9) && r2._internalState.delete(e9), r2._internalState.set(e9, t2), r2;
        }, e7.prototype.unset = function(e9) {
          var t2 = this._clone();
          return t2._internalState.delete(e9), t2;
        }, e7.prototype.get = function(e9) {
          return this._internalState.get(e9);
        }, e7.prototype.serialize = function() {
          var e9 = this;
          return this._keys().reduce(function(t2, r2) {
            return t2.push(r2 + "=" + e9.get(r2)), t2;
          }, []).join(",");
        }, e7.prototype._parse = function(e9) {
          !(e9.length > 512) && (this._internalState = e9.split(",").reverse().reduce(function(e10, t2) {
            var r2 = t2.trim(), n2 = r2.indexOf("=");
            if (-1 !== n2) {
              var s2 = r2.slice(0, n2), i2 = r2.slice(n2 + 1, t2.length);
              e3.test(s2) && e4.test(i2) && !e6.test(i2) && e10.set(s2, i2);
            }
            return e10;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }, e7.prototype._keys = function() {
          return Array.from(this._internalState.keys()).reverse();
        }, e7.prototype._clone = function() {
          var t2 = new e7();
          return t2._internalState = new Map(this._internalState), t2;
        }, e7;
      }();
      function e8(e7) {
        return new e5(e7);
      }
      e.s(["DiagConsoleLogger", () => e1, "DiagLogLevel", () => r, "INVALID_SPANID", () => ex, "INVALID_SPAN_CONTEXT", () => eA, "INVALID_TRACEID", () => eC, "ProxyTracer", () => eG, "ProxyTracerProvider", () => eX, "ROOT_CONTEXT", () => g, "SamplingDecision", () => i, "SpanKind", () => a, "SpanStatusCode", () => o, "TraceFlags", () => n, "ValueType", () => s, "baggageEntryMetadataFromString", () => eE, "context", () => q, "createContextKey", () => t, "createNoopMeter", () => ea, "createTraceState", () => e8, "default", 0, eZ, "defaultTextMapGetter", () => eh, "defaultTextMapSetter", () => ed, "diag", () => B, "isSpanContextValid", () => eH, "isValidSpanId", () => eW, "isValidTraceId", () => eM, "metrics", () => eu, "propagation", () => eO, "trace", () => eQ], 311646);
    }, 871498, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, s, i = {};
        i.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var s2 = {}, i2 = t2.split(n), a = (r3 || {}).decode || e2, o = 0; o < i2.length; o++) {
            var l = i2[o], u = l.indexOf("=");
            if (!(u < 0)) {
              var c = l.substr(0, u).trim(), h = l.substr(++u, l.length).trim();
              '"' == h[0] && (h = h.slice(1, -1)), void 0 == s2[c] && (s2[c] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(h, a));
            }
          }
          return s2;
        }, i.serialize = function(e3, t2, n2) {
          var i2 = n2 || {}, a = i2.encode || r2;
          if ("function" != typeof a) throw TypeError("option encode is invalid");
          if (!s.test(e3)) throw TypeError("argument name is invalid");
          var o = a(t2);
          if (o && !s.test(o)) throw TypeError("argument val is invalid");
          var l = e3 + "=" + o;
          if (null != i2.maxAge) {
            var u = i2.maxAge - 0;
            if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
            l += "; Max-Age=" + Math.floor(u);
          }
          if (i2.domain) {
            if (!s.test(i2.domain)) throw TypeError("option domain is invalid");
            l += "; Domain=" + i2.domain;
          }
          if (i2.path) {
            if (!s.test(i2.path)) throw TypeError("option path is invalid");
            l += "; Path=" + i2.path;
          }
          if (i2.expires) {
            if ("function" != typeof i2.expires.toUTCString) throw TypeError("option expires is invalid");
            l += "; Expires=" + i2.expires.toUTCString();
          }
          if (i2.httpOnly && (l += "; HttpOnly"), i2.secure && (l += "; Secure"), i2.sameSite) switch ("string" == typeof i2.sameSite ? i2.sameSite.toLowerCase() : i2.sameSite) {
            case true:
            case "strict":
              l += "; SameSite=Strict";
              break;
            case "lax":
              l += "; SameSite=Lax";
              break;
            case "none":
              l += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return l;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, s = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = i;
      })();
    }, 299734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, s, i;
        var a = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function s2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function i2(e4, t3, n3, i3, a3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var o3 = new s2(n3, i3 || e4, a3), l2 = r3 ? r3 + t3 : t3;
            return e4._events[l2] ? e4._events[l2].fn ? e4._events[l2] = [e4._events[l2], o3] : e4._events[l2].push(o3) : (e4._events[l2] = o3, e4._eventsCount++), e4;
          }
          function a2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function o2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), o2.prototype.eventNames = function() {
            var e4, n3, s3 = [];
            if (0 === this._eventsCount) return s3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && s3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? s3.concat(Object.getOwnPropertySymbols(e4)) : s3;
          }, o2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var s3 = 0, i3 = n3.length, a3 = Array(i3); s3 < i3; s3++) a3[s3] = n3[s3].fn;
            return a3;
          }, o2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, o2.prototype.emit = function(e4, t3, n3, s3, i3, a3) {
            var o3 = r3 ? r3 + e4 : e4;
            if (!this._events[o3]) return false;
            var l2, u2, c = this._events[o3], h = arguments.length;
            if (c.fn) {
              switch (c.once && this.removeListener(e4, c.fn, void 0, true), h) {
                case 1:
                  return c.fn.call(c.context), true;
                case 2:
                  return c.fn.call(c.context, t3), true;
                case 3:
                  return c.fn.call(c.context, t3, n3), true;
                case 4:
                  return c.fn.call(c.context, t3, n3, s3), true;
                case 5:
                  return c.fn.call(c.context, t3, n3, s3, i3), true;
                case 6:
                  return c.fn.call(c.context, t3, n3, s3, i3, a3), true;
              }
              for (u2 = 1, l2 = Array(h - 1); u2 < h; u2++) l2[u2 - 1] = arguments[u2];
              c.fn.apply(c.context, l2);
            } else {
              var d, p = c.length;
              for (u2 = 0; u2 < p; u2++) switch (c[u2].once && this.removeListener(e4, c[u2].fn, void 0, true), h) {
                case 1:
                  c[u2].fn.call(c[u2].context);
                  break;
                case 2:
                  c[u2].fn.call(c[u2].context, t3);
                  break;
                case 3:
                  c[u2].fn.call(c[u2].context, t3, n3);
                  break;
                case 4:
                  c[u2].fn.call(c[u2].context, t3, n3, s3);
                  break;
                default:
                  if (!l2) for (d = 1, l2 = Array(h - 1); d < h; d++) l2[d - 1] = arguments[d];
                  c[u2].fn.apply(c[u2].context, l2);
              }
            }
            return true;
          }, o2.prototype.on = function(e4, t3, r4) {
            return i2(this, e4, t3, r4, false);
          }, o2.prototype.once = function(e4, t3, r4) {
            return i2(this, e4, t3, r4, true);
          }, o2.prototype.removeListener = function(e4, t3, n3, s3) {
            var i3 = r3 ? r3 + e4 : e4;
            if (!this._events[i3]) return this;
            if (!t3) return a2(this, i3), this;
            var o3 = this._events[i3];
            if (o3.fn) o3.fn !== t3 || s3 && !o3.once || n3 && o3.context !== n3 || a2(this, i3);
            else {
              for (var l2 = 0, u2 = [], c = o3.length; l2 < c; l2++) (o3[l2].fn !== t3 || s3 && !o3[l2].once || n3 && o3[l2].context !== n3) && u2.push(o3[l2]);
              u2.length ? this._events[i3] = 1 === u2.length ? u2[0] : u2 : a2(this, i3);
            }
            return this;
          }, o2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && a2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, o2.prototype.off = o2.prototype.removeListener, o2.prototype.addListener = o2.prototype.on, o2.prefixed = r3, o2.EventEmitter = o2, e3.exports = o2;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, s2 = e4.length;
            for (; s2 > 0; ) {
              let i2 = s2 / 2 | 0, a2 = n2 + i2;
              0 >= r3(e4[a2], t3) ? (n2 = ++a2, s2 -= i2 + 1) : s2 = i2;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let s2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(s2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class s2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let i2 = (e4, t3, r4) => new Promise((i3, a2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void i3(e4);
            let o2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  i3(r4());
                } catch (e5) {
                  a2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, o3 = r4 instanceof Error ? r4 : new s2(n3);
              "function" == typeof e4.cancel && e4.cancel(), a2(o3);
            }, t3);
            n2(e4.then(i3, a2), () => {
              clearTimeout(o2);
            });
          });
          e3.exports = i2, e3.exports.default = i2, e3.exports.TimeoutError = s2;
        } }, o = {};
        function l(e3) {
          var t2 = o[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = o[e3] = { exports: {} }, n2 = true;
          try {
            a[e3](r3, r3.exports, l), n2 = false;
          } finally {
            n2 && delete o[e3];
          }
          return r3.exports;
        }
        l.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var u = {};
        Object.defineProperty(u, "__esModule", { value: true }), e2 = l(993), r2 = l(816), n = l(821), s = () => {
        }, i = new r2.TimeoutError(), u.default = class extends e2 {
          constructor(e3) {
            var t2, r3, i2, a2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = s, this._resolveIdle = s, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (a2 = null == (i2 = e3.interval) ? void 0 : i2.toString()) ? a2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = s, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = s, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, s2) => {
              let a2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let a3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && s2(i);
                  });
                  n2(await a3);
                } catch (e4) {
                  s2(e4);
                }
                this._next();
              };
              this._queue.enqueue(a2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = u;
      })();
    }, 478500, (e, t, r) => {
      t.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 369307, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return l;
      }, withRequest: function() {
        return o;
      } };
      for (var s in n) Object.defineProperty(r, s, { enumerable: true, get: n[s] });
      let i = new (e.r(478500)).AsyncLocalStorage();
      function a(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function o(e2, t2, r2) {
        let n2 = a(e2, t2);
        return n2 ? i.run(n2, r2) : r2();
      }
      function l(e2, t2) {
        let r2 = i.getStore();
        return r2 || (e2 && t2 ? a(e2, t2) : void 0);
      }
    }, 928325, (e, t, r) => {
      "use strict";
      var n = e.i(951615);
      Object.defineProperty(r, "__esModule", { value: true });
      var s = { handleFetch: function() {
        return u;
      }, interceptFetch: function() {
        return c;
      }, reader: function() {
        return o;
      } };
      for (var i in s) Object.defineProperty(r, i, { enumerable: true, get: s[i] });
      let a = e.r(369307), o = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function l(e2, t2) {
        let { url: r2, method: s2, headers: i2, body: a2, cache: o2, credentials: l2, integrity: u2, mode: c2, redirect: h, referrer: d, referrerPolicy: p } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: s2, headers: [...Array.from(i2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u2, mode: c2, redirect: h, referrer: d, referrerPolicy: p } };
      }
      async function u(e2, t2) {
        let r2 = (0, a.getTestReqInfo)(t2, o);
        if (!r2) return e2(t2);
        let { testData: s2, proxyPort: i2 } = r2, u2 = await l(s2, t2), c2 = await e2(`http://localhost:${i2}`, { method: "POST", body: JSON.stringify(u2), next: { internal: true } });
        if (!c2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${c2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let h = await c2.json(), { api: d } = h;
        switch (d) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: s3 } = e3.response;
              return new Response(s3 ? n.Buffer.from(s3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(h);
          default:
            return d;
        }
      }
      function c(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : u(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 494165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return o;
      }, wrapRequestHandler: function() {
        return l;
      } };
      for (var s in n) Object.defineProperty(r, s, { enumerable: true, get: n[s] });
      let i = e.r(369307), a = e.r(928325);
      function o() {
        return (0, a.interceptFetch)(e.g.fetch);
      }
      function l(e2) {
        return (t2, r2) => (0, i.withRequest)(t2, a.reader, () => e2(t2, r2));
      }
    }, 399929, (e, t, r) => {
      "use strict";
      let n;
      Object.defineProperty(r, "__esModule", { value: true }), r.parseCookie = h, r.parse = h, r.stringifyCookie = function(e2, t2) {
        let r2 = t2?.encode || encodeURIComponent, n2 = [];
        for (let t3 of Object.keys(e2)) {
          let a2 = e2[t3];
          if (void 0 === a2) continue;
          if (!s.test(t3)) throw TypeError(`cookie name is invalid: ${t3}`);
          let o2 = r2(a2);
          if (!i.test(o2)) throw TypeError(`cookie val is invalid: ${a2}`);
          n2.push(`${t3}=${o2}`);
        }
        return n2.join("; ");
      }, r.stringifySetCookie = d, r.serialize = d, r.parseSetCookie = function(e2, t2) {
        let r2 = t2?.decode || m, n2 = e2.length, s2 = p(e2, 0, n2), i2 = f(e2, 0, s2), a2 = -1 === i2 ? { name: "", value: r2(g(e2, 0, s2)) } : { name: g(e2, 0, i2), value: r2(g(e2, i2 + 1, s2)) }, o2 = s2 + 1;
        for (; o2 < n2; ) {
          let t3 = p(e2, o2, n2), r3 = f(e2, o2, t3), s3 = -1 === r3 ? g(e2, o2, t3) : g(e2, o2, r3), i3 = -1 === r3 ? void 0 : g(e2, r3 + 1, t3);
          switch (s3.toLowerCase()) {
            case "httponly":
              a2.httpOnly = true;
              break;
            case "secure":
              a2.secure = true;
              break;
            case "partitioned":
              a2.partitioned = true;
              break;
            case "domain":
              a2.domain = i3;
              break;
            case "path":
              a2.path = i3;
              break;
            case "max-age":
              i3 && l.test(i3) && (a2.maxAge = Number(i3));
              break;
            case "expires":
              if (!i3) break;
              let u2 = new Date(i3);
              Number.isFinite(u2.valueOf()) && (a2.expires = u2);
              break;
            case "priority":
              if (!i3) break;
              let c2 = i3.toLowerCase();
              ("low" === c2 || "medium" === c2 || "high" === c2) && (a2.priority = c2);
              break;
            case "samesite":
              if (!i3) break;
              let h2 = i3.toLowerCase();
              ("lax" === h2 || "strict" === h2 || "none" === h2) && (a2.sameSite = h2);
          }
          o2 = t3 + 1;
        }
        return a2;
      }, r.stringifySetCookie = d, r.serialize = d;
      let s = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/, i = /^[\u0021-\u003A\u003C-\u007E]*$/, a = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, o = /^[\u0020-\u003A\u003D-\u007E]*$/, l = /^-?\d+$/, u = Object.prototype.toString, c = ((n = function() {
      }).prototype = /* @__PURE__ */ Object.create(null), n);
      function h(e2, t2) {
        let r2 = new c(), n2 = e2.length;
        if (n2 < 2) return r2;
        let s2 = t2?.decode || m, i2 = 0;
        do {
          let t3 = f(e2, i2, n2);
          if (-1 === t3) break;
          let a2 = p(e2, i2, n2);
          if (t3 > a2) {
            i2 = e2.lastIndexOf(";", t3 - 1) + 1;
            continue;
          }
          let o2 = g(e2, i2, t3);
          void 0 === r2[o2] && (r2[o2] = s2(g(e2, t3 + 1, a2))), i2 = a2 + 1;
        } while (i2 < n2);
        return r2;
      }
      function d(e2, t2, r2) {
        let n2 = "object" == typeof e2 ? e2 : { ...r2, name: e2, value: String(t2) }, l2 = ("object" == typeof t2 ? t2 : r2)?.encode || encodeURIComponent;
        if (!s.test(n2.name)) throw TypeError(`argument name is invalid: ${n2.name}`);
        let c2 = n2.value ? l2(n2.value) : "";
        if (!i.test(c2)) throw TypeError(`argument val is invalid: ${n2.value}`);
        let h2 = n2.name + "=" + c2;
        if (void 0 !== n2.maxAge) {
          if (!Number.isInteger(n2.maxAge)) throw TypeError(`option maxAge is invalid: ${n2.maxAge}`);
          h2 += "; Max-Age=" + n2.maxAge;
        }
        if (n2.domain) {
          if (!a.test(n2.domain)) throw TypeError(`option domain is invalid: ${n2.domain}`);
          h2 += "; Domain=" + n2.domain;
        }
        if (n2.path) {
          if (!o.test(n2.path)) throw TypeError(`option path is invalid: ${n2.path}`);
          h2 += "; Path=" + n2.path;
        }
        if (n2.expires) {
          var d2;
          if (d2 = n2.expires, "[object Date]" !== u.call(d2) || !Number.isFinite(n2.expires.valueOf())) throw TypeError(`option expires is invalid: ${n2.expires}`);
          h2 += "; Expires=" + n2.expires.toUTCString();
        }
        if (n2.httpOnly && (h2 += "; HttpOnly"), n2.secure && (h2 += "; Secure"), n2.partitioned && (h2 += "; Partitioned"), n2.priority) switch ("string" == typeof n2.priority ? n2.priority.toLowerCase() : void 0) {
          case "low":
            h2 += "; Priority=Low";
            break;
          case "medium":
            h2 += "; Priority=Medium";
            break;
          case "high":
            h2 += "; Priority=High";
            break;
          default:
            throw TypeError(`option priority is invalid: ${n2.priority}`);
        }
        if (n2.sameSite) switch ("string" == typeof n2.sameSite ? n2.sameSite.toLowerCase() : n2.sameSite) {
          case true:
          case "strict":
            h2 += "; SameSite=Strict";
            break;
          case "lax":
            h2 += "; SameSite=Lax";
            break;
          case "none":
            h2 += "; SameSite=None";
            break;
          default:
            throw TypeError(`option sameSite is invalid: ${n2.sameSite}`);
        }
        return h2;
      }
      function p(e2, t2, r2) {
        let n2 = e2.indexOf(";", t2);
        return -1 === n2 ? r2 : n2;
      }
      function f(e2, t2, r2) {
        let n2 = e2.indexOf("=", t2);
        return n2 < r2 ? n2 : -1;
      }
      function g(e2, t2, r2) {
        let n2 = t2, s2 = r2;
        do {
          let t3 = e2.charCodeAt(n2);
          if (32 !== t3 && 9 !== t3) break;
        } while (++n2 < s2);
        for (; s2 > n2; ) {
          let t3 = e2.charCodeAt(s2 - 1);
          if (32 !== t3 && 9 !== t3) break;
          s2--;
        }
        return e2.slice(n2, s2);
      }
      function m(e2) {
        if (-1 === e2.indexOf("%")) return e2;
        try {
          return decodeURIComponent(e2);
        } catch (t2) {
          return e2;
        }
      }
    }, 739990, (e, t, r) => {
    }, 164445, (e, t, r) => {
      var n = { 226: function(t2, r2) {
        !function(n2, s2) {
          "use strict";
          var i2 = "function", a = "undefined", o = "object", l = "string", u = "major", c = "model", h = "name", d = "type", p = "vendor", f = "version", g = "architecture", m = "console", y = "mobile", b = "tablet", w = "smarttv", v = "wearable", _ = "embedded", S = "Amazon", k = "Apple", E = "ASUS", T = "BlackBerry", R = "Browser", O = "Chrome", x = "Firefox", C = "Google", A = "Huawei", P = "Microsoft", j = "Motorola", I = "Opera", $ = "Samsung", N = "Sharp", U = "Sony", L = "Xiaomi", D = "Zebra", q = "Facebook", B = "Chromium OS", M = "Mac OS", W = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, H = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, z = function(e2, t3) {
            return typeof e2 === l && -1 !== V(t3).indexOf(V(e2));
          }, V = function(e2) {
            return e2.toLowerCase();
          }, K = function(e2, t3) {
            if (typeof e2 === l) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === a ? e2 : e2.substring(0, 350);
          }, F = function(e2, t3) {
            for (var r3, n3, s3, a2, l2, u2, c2 = 0; c2 < t3.length && !l2; ) {
              var h2 = t3[c2], d2 = t3[c2 + 1];
              for (r3 = n3 = 0; r3 < h2.length && !l2 && h2[r3]; ) if (l2 = h2[r3++].exec(e2)) for (s3 = 0; s3 < d2.length; s3++) u2 = l2[++n3], typeof (a2 = d2[s3]) === o && a2.length > 0 ? 2 === a2.length ? typeof a2[1] == i2 ? this[a2[0]] = a2[1].call(this, u2) : this[a2[0]] = a2[1] : 3 === a2.length ? typeof a2[1] !== i2 || a2[1].exec && a2[1].test ? this[a2[0]] = u2 ? u2.replace(a2[1], a2[2]) : void 0 : this[a2[0]] = u2 ? a2[1].call(this, u2, a2[2]) : void 0 : 4 === a2.length && (this[a2[0]] = u2 ? a2[3].call(this, u2.replace(a2[1], a2[2])) : void 0) : this[a2] = u2 || void 0;
              c2 += 2;
            }
          }, G = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === o && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if (z(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if (z(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, J = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, X = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [h, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [h, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [h, f], [/opios[\/ ]+([\w\.]+)/i], [f, [h, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [h, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [h, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [h, "UC" + R]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [h, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [h, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [h, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [h, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [h, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[h, /(.+)/, "$1 Secure " + R], f], [/\bfocus\/([\w\.]+)/i], [f, [h, x + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [h, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [h, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [h, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [h, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [h, "MIUI " + R]], [/fxios\/([-\w\.]+)/i], [f, [h, x]], [/\bqihu|(qi?ho?o?|360)browser/i], [[h, "360 " + R]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[h, /(.+)/, "$1 " + R], f], [/(comodo_dragon)\/([\w\.]+)/i], [[h, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [h, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [h], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[h, q], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [h, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [h, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [h, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [h, O + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[h, O + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [h, "Android " + R]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [h, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [h, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, h], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [h, [f, G, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [h, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[h, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [h, x + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [h, f], [/(cobalt)\/([\w\.]+)/i], [h, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[g, "amd64"]], [/(ia32(?=;))/i], [[g, V]], [/((?:i[346]|x)86)[;\)]/i], [[g, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[g, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[g, "armhf"]], [/windows (ce|mobile); ppc;/i], [[g, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[g, /ower/, "", V]], [/(sun4\w)[;\)]/i], [[g, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[g, V]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [p, $], [d, b]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [p, $], [d, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [c, [p, k], [d, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [p, k], [d, b]], [/(macintosh);/i], [c, [p, k]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [p, N], [d, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [p, A], [d, b]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [c, [p, A], [d, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [p, L], [d, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [p, L], [d, b]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [p, "OPPO"], [d, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [p, "Vivo"], [d, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [p, "Realme"], [d, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [p, j], [d, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [p, j], [d, b]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [p, "LG"], [d, b]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [p, "LG"], [d, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [p, "Lenovo"], [d, b]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [p, "Nokia"], [d, y]], [/(pixel c)\b/i], [c, [p, C], [d, b]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [p, C], [d, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [p, U], [d, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [p, U], [d, b]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [p, "OnePlus"], [d, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [p, S], [d, b]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [p, S], [d, y]], [/(playbook);[-\w\),; ]+(rim)/i], [c, p, [d, b]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [p, T], [d, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [p, E], [d, b]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [p, E], [d, y]], [/(nexus 9)/i], [c, [p, "HTC"], [d, b]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [p, [c, /_/g, " "], [d, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [p, "Acer"], [d, b]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [p, "Meizu"], [d, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [p, c, [d, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [p, c, [d, b]], [/(surface duo)/i], [c, [p, P], [d, b]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [p, "Fairphone"], [d, y]], [/(u304aa)/i], [c, [p, "AT&T"], [d, y]], [/\bsie-(\w*)/i], [c, [p, "Siemens"], [d, y]], [/\b(rct\w+) b/i], [c, [p, "RCA"], [d, b]], [/\b(venue[\d ]{2,7}) b/i], [c, [p, "Dell"], [d, b]], [/\b(q(?:mv|ta)\w+) b/i], [c, [p, "Verizon"], [d, b]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [p, "Barnes & Noble"], [d, b]], [/\b(tm\d{3}\w+) b/i], [c, [p, "NuVision"], [d, b]], [/\b(k88) b/i], [c, [p, "ZTE"], [d, b]], [/\b(nx\d{3}j) b/i], [c, [p, "ZTE"], [d, y]], [/\b(gen\d{3}) b.+49h/i], [c, [p, "Swiss"], [d, y]], [/\b(zur\d{3}) b/i], [c, [p, "Swiss"], [d, b]], [/\b((zeki)?tb.*\b) b/i], [c, [p, "Zeki"], [d, b]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[p, "Dragon Touch"], c, [d, b]], [/\b(ns-?\w{0,9}) b/i], [c, [p, "Insignia"], [d, b]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [p, "NextBook"], [d, b]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[p, "Voice"], c, [d, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[p, "LvTel"], c, [d, y]], [/\b(ph-1) /i], [c, [p, "Essential"], [d, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [p, "Envizen"], [d, b]], [/\b(trio[-\w\. ]+) b/i], [c, [p, "MachSpeed"], [d, b]], [/\btu_(1491) b/i], [c, [p, "Rotor"], [d, b]], [/(shield[\w ]+) b/i], [c, [p, "Nvidia"], [d, b]], [/(sprint) (\w+)/i], [p, c, [d, y]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [p, P], [d, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [p, D], [d, b]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [p, D], [d, y]], [/smart-tv.+(samsung)/i], [p, [d, w]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [p, $], [d, w]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[p, "LG"], [d, w]], [/(apple) ?tv/i], [p, [c, k + " TV"], [d, w]], [/crkey/i], [[c, O + "cast"], [p, C], [d, w]], [/droid.+aft(\w)( bui|\))/i], [c, [p, S], [d, w]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [c, [p, N], [d, w]], [/(bravia[\w ]+)( bui|\))/i], [c, [p, U], [d, w]], [/(mitv-\w{5}) bui/i], [c, [p, L], [d, w]], [/Hbbtv.*(technisat) (.*);/i], [p, c, [d, w]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[p, K], [c, K], [d, w]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[d, w]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [p, c, [d, m]], [/droid.+; (shield) bui/i], [c, [p, "Nvidia"], [d, m]], [/(playstation [345portablevi]+)/i], [c, [p, U], [d, m]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [p, P], [d, m]], [/((pebble))app/i], [p, c, [d, v]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [c, [p, k], [d, v]], [/droid.+; (glass) \d/i], [c, [p, C], [d, v]], [/droid.+; (wt63?0{2,3})\)/i], [c, [p, D], [d, v]], [/(quest( 2| pro)?)/i], [c, [p, q], [d, v]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [p, [d, _]], [/(aeobc)\b/i], [c, [p, S], [d, _]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [d, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [d, b]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[d, b]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[d, y]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [p, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [h, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [h, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [h, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, h]], os: [[/microsoft (windows) (vista|xp)/i], [h, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [h, [f, G, J]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[h, "Windows"], [f, G, J]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [h, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[h, M], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, h], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [h, f], [/\(bb(10);/i], [f, [h, T]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [h, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [h, x + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [h, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [h, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [h, O + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[h, B], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [h, f], [/(sunos) ?([\w\.\d]*)/i], [[h, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [h, f]] }, Y = function(e2, t3) {
            if (typeof e2 === o && (t3 = e2, e2 = void 0), !(this instanceof Y)) return new Y(e2, t3).getResult();
            var r3 = typeof n2 !== a && n2.navigator ? n2.navigator : void 0, s3 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), m2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, w2 = t3 ? W(X, t3) : X, v2 = r3 && r3.userAgent == s3;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[h] = void 0, t4[f] = void 0, F.call(t4, s3, w2.browser), t4[u] = typeof (e3 = t4[f]) === l ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, v2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[h] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[g] = void 0, F.call(e3, s3, w2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[p] = void 0, e3[c] = void 0, e3[d] = void 0, F.call(e3, s3, w2.device), v2 && !e3[d] && m2 && m2.mobile && (e3[d] = y), v2 && "Macintosh" == e3[c] && r3 && typeof r3.standalone !== a && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[c] = "iPad", e3[d] = b), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[h] = void 0, e3[f] = void 0, F.call(e3, s3, w2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[h] = void 0, e3[f] = void 0, F.call(e3, s3, w2.os), v2 && !e3[h] && m2 && "Unknown" != m2.platform && (e3[h] = m2.platform.replace(/chrome os/i, B).replace(/macos/i, M)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return s3;
            }, this.setUA = function(e3) {
              return s3 = typeof e3 === l && e3.length > 350 ? K(e3, 350) : e3, this;
            }, this.setUA(s3), this;
          };
          if (Y.VERSION = "1.0.35", Y.BROWSER = H([h, f, u]), Y.CPU = H([g]), Y.DEVICE = H([c, p, d, m, y, w, b, v, _]), Y.ENGINE = Y.OS = H([h, f]), typeof r2 !== a) t2.exports && (r2 = t2.exports = Y), r2.UAParser = Y;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== Y && e.v(Y);
          else typeof n2 !== a && (n2.UAParser = Y);
          var Q = typeof n2 !== a && (n2.jQuery || n2.Zepto);
          if (Q && !Q.ua) {
            var Z = new Y();
            Q.ua = Z.getResult(), Q.ua.get = function() {
              return Z.getUA();
            }, Q.ua.set = function(e2) {
              Z.setUA(e2);
              var t3 = Z.getResult();
              for (var r3 in t3) Q.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, s = {};
      function i(e2) {
        var t2 = s[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = s[e2] = { exports: {} }, a = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, i), a = false;
        } finally {
          a && delete s[e2];
        }
        return r2.exports;
      }
      i.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = i(226);
    }, 708946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function s(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var i = Array.isArray;
      function a() {
      }
      var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), d = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), m = Symbol.for("react.activity"), y = Symbol.for("react.view_transition"), b = Symbol.iterator, w = Object.prototype.hasOwnProperty, v = Object.assign;
      function _(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: o, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function S(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === o;
      }
      var k = /\/+/g;
      function E(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function T(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], u2 = 0;
        return !function e3(t3, r3, n3, u3, c2) {
          var h2, d2, p2, f2 = typeof t3;
          ("undefined" === f2 || "boolean" === f2) && (t3 = null);
          var m2 = false;
          if (null === t3) m2 = true;
          else switch (f2) {
            case "bigint":
            case "string":
            case "number":
              m2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case o:
                case l:
                  m2 = true;
                  break;
                case g:
                  return e3((m2 = t3._init)(t3._payload), r3, n3, u3, c2);
              }
          }
          if (m2) return c2 = c2(t3), m2 = "" === u3 ? "." + E(t3, 0) : u3, i(c2) ? (n3 = "", null != m2 && (n3 = m2.replace(k, "$&/") + "/"), e3(c2, r3, n3, "", function(e4) {
            return e4;
          })) : null != c2 && (S(c2) && (h2 = c2, d2 = n3 + (null == c2.key || t3 && t3.key === c2.key ? "" : ("" + c2.key).replace(k, "$&/") + "/") + m2, c2 = _(h2.type, d2, h2.props)), r3.push(c2)), 1;
          m2 = 0;
          var y2 = "" === u3 ? "." : u3 + ":";
          if (i(t3)) for (var w2 = 0; w2 < t3.length; w2++) f2 = y2 + E(u3 = t3[w2], w2), m2 += e3(u3, r3, n3, f2, c2);
          else if ("function" == typeof (w2 = null === (p2 = t3) || "object" != typeof p2 ? null : "function" == typeof (p2 = b && p2[b] || p2["@@iterator"]) ? p2 : null)) for (t3 = w2.call(t3), w2 = 0; !(u3 = t3.next()).done; ) f2 = y2 + E(u3 = u3.value, w2++), m2 += e3(u3, r3, n3, f2, c2);
          else if ("object" === f2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(a, a) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, u3, c2);
            throw Error(s(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return m2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, u2++);
        }), n2;
      }
      function R(e2) {
        if (-1 === e2._status) {
          var t2 = e2._result;
          (t2 = t2()).then(function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = t3);
          }, function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = t3);
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function O() {
        return /* @__PURE__ */ new WeakMap();
      }
      function x() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = m, r.Children = { map: T, forEach: function(e2, t2, r2) {
        T(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return T(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return T(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!S(e2)) throw Error(s(143));
        return e2;
      } }, r.Fragment = u, r.Profiler = h, r.StrictMode = c, r.Suspense = p, r.ViewTransition = y, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(O);
          void 0 === (t2 = r2.get(e2)) && (t2 = x(), r2.set(e2, t2)), r2 = 0;
          for (var s2 = arguments.length; r2 < s2; r2++) {
            var i2 = arguments[r2];
            if ("function" == typeof i2 || "object" == typeof i2 && null !== i2) {
              var a2 = t2.o;
              null === a2 && (t2.o = a2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = a2.get(i2)) && (t2 = x(), a2.set(i2, t2));
            } else null === (a2 = t2.p) && (t2.p = a2 = /* @__PURE__ */ new Map()), void 0 === (t2 = a2.get(i2)) && (t2 = x(), a2.set(i2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var o2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = o2;
          } catch (e3) {
            throw (o2 = t2).s = 2, o2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(s(267, e2));
        var n2 = v({}, e2.props), i2 = e2.key;
        if (null != t2) for (a2 in void 0 !== t2.key && (i2 = "" + t2.key), t2) w.call(t2, a2) && "key" !== a2 && "__self" !== a2 && "__source" !== a2 && ("ref" !== a2 || void 0 !== t2.ref) && (n2[a2] = t2[a2]);
        var a2 = arguments.length - 2;
        if (1 === a2) n2.children = r2;
        else if (1 < a2) {
          for (var o2 = Array(a2), l2 = 0; l2 < a2; l2++) o2[l2] = arguments[l2 + 2];
          n2.children = o2;
        }
        return _(e2.type, i2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, s2 = {}, i2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (i2 = "" + t2.key), t2) w.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (s2[n2] = t2[n2]);
        var a2 = arguments.length - 2;
        if (1 === a2) s2.children = r2;
        else if (1 < a2) {
          for (var o2 = Array(a2), l2 = 0; l2 < a2; l2++) o2[l2] = arguments[l2 + 2];
          s2.children = o2;
        }
        if (e2 && e2.defaultProps) for (n2 in a2 = e2.defaultProps) void 0 === s2[n2] && (s2[n2] = a2[n2]);
        return _(e2, i2, s2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: d, render: e2 };
      }, r.isValidElement = S, r.lazy = function(e2) {
        return { $$typeof: g, _payload: { _status: -1, _result: e2 }, _init: R };
      }, r.memo = function(e2, t2) {
        return { $$typeof: f, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-f93b9fd4-20251217";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(708946);
    }, 558217, (e) => {
      "use strict";
      let t, r, n;
      async function s() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      let i = null;
      async function a() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        i || (i = s());
        let e10 = await i;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function o(...e10) {
        let t10 = await s();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let l = null;
      function u() {
        return l || (l = a()), l;
      }
      function c(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r10) {
            if ("then" === r10) return {};
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r10, n10, s2) {
            if ("function" == typeof s2[0]) return s2[0](t10);
            throw Object.defineProperty(Error(c(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      u();
      class h extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class d extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class p extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let f = "_N_T_", g = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function m(e10) {
        var t10, r10, n10, s2, i2, a2 = [], o2 = 0;
        function l2() {
          for (; o2 < e10.length && /\s/.test(e10.charAt(o2)); ) o2 += 1;
          return o2 < e10.length;
        }
        for (; o2 < e10.length; ) {
          for (t10 = o2, i2 = false; l2(); ) if ("," === (r10 = e10.charAt(o2))) {
            for (n10 = o2, o2 += 1, l2(), s2 = o2; o2 < e10.length && "=" !== (r10 = e10.charAt(o2)) && ";" !== r10 && "," !== r10; ) o2 += 1;
            o2 < e10.length && "=" === e10.charAt(o2) ? (i2 = true, o2 = s2, a2.push(e10.substring(t10, n10)), t10 = o2) : o2 = n10 + 1;
          } else o2 += 1;
          (!i2 || o2 >= e10.length) && a2.push(e10.substring(t10, e10.length));
        }
        return a2;
      }
      function y(e10) {
        let t10 = {}, r10 = [];
        if (e10) for (let [n10, s2] of e10.entries()) "set-cookie" === n10.toLowerCase() ? (r10.push(...m(s2)), t10[n10] = 1 === r10.length ? r10[0] : r10) : t10[n10] = s2;
        return t10;
      }
      function b(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...g, GROUP: { builtinReact: [g.reactServerComponents, g.actionBrowser], serverOnly: [g.reactServerComponents, g.actionBrowser, g.instrument, g.middleware], neutralTarget: [g.apiNode, g.apiEdge], clientOnly: [g.serverSideRendering, g.appPagesBrowser], bundled: [g.reactServerComponents, g.actionBrowser, g.serverSideRendering, g.appPagesBrowser, g.shared, g.instrument, g.middleware], appPages: [g.reactServerComponents, g.serverSideRendering, g.appPagesBrowser, g.actionBrowser] } });
      let w = Symbol("response"), v = Symbol("passThrough"), _ = Symbol("waitUntil");
      class S {
        constructor(e10, t10) {
          this[v] = false, this[_] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[w] || (this[w] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[v] = true;
        }
        waitUntil(e10) {
          if ("external" === this[_].kind) return (0, this[_].function)(e10);
          this[_].promises.push(e10);
        }
      }
      class k extends S {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function E(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function T(e10) {
        let t10 = e10.indexOf("#"), r10 = e10.indexOf("?"), n10 = r10 > -1 && (t10 < 0 || r10 < t10);
        return n10 || t10 > -1 ? { pathname: e10.substring(0, n10 ? r10 : t10), query: n10 ? e10.substring(r10, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function R(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: s2 } = T(e10);
        return `${t10}${r10}${n10}${s2}`;
      }
      function O(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: s2 } = T(e10);
        return `${r10}${t10}${n10}${s2}`;
      }
      function x(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r10 } = T(e10);
        return r10 === t10 || r10.startsWith(t10 + "/");
      }
      let C = /* @__PURE__ */ new WeakMap();
      function A(e10, t10) {
        let r10;
        if (!t10) return { pathname: e10 };
        let n10 = C.get(t10);
        n10 || (n10 = t10.map((e11) => e11.toLowerCase()), C.set(t10, n10));
        let s2 = e10.split("/", 2);
        if (!s2[1]) return { pathname: e10 };
        let i2 = s2[1].toLowerCase(), a2 = n10.indexOf(i2);
        return a2 < 0 ? { pathname: e10 } : (r10 = t10[a2], { pathname: e10 = e10.slice(r10.length + 1) || "/", detectedLocale: r10 });
      }
      let P = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function j(e10, t10) {
        return new URL(String(e10).replace(P, "localhost"), t10 && String(t10).replace(P, "localhost"));
      }
      let I = Symbol("NextURLInternal");
      class $ {
        constructor(e10, t10, r10) {
          let n10, s2;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n10 = t10, s2 = r10 || {}) : s2 = r10 || t10 || {}, this[I] = { url: j(e10, n10 ?? s2.base), options: s2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r10, n10, s2;
          let i2 = function(e11, t11) {
            let { basePath: r11, i18n: n11, trailingSlash: s3 } = t11.nextConfig ?? {}, i3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : s3 };
            r11 && x(i3.pathname, r11) && (i3.pathname = function(e12, t12) {
              if (!x(e12, t12)) return e12;
              let r12 = e12.slice(t12.length);
              return r12.startsWith("/") ? r12 : `/${r12}`;
            }(i3.pathname, r11), i3.basePath = r11);
            let a3 = i3.pathname;
            if (i3.pathname.startsWith("/_next/data/") && i3.pathname.endsWith(".json")) {
              let e12 = i3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              i3.buildId = e12[0], a3 = "index" !== e12[1] ? `/${e12.slice(1).join("/")}` : "/", true === t11.parseData && (i3.pathname = a3);
            }
            if (n11) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(i3.pathname) : A(i3.pathname, n11.locales);
              i3.locale = e12.detectedLocale, i3.pathname = e12.pathname ?? i3.pathname, !e12.detectedLocale && i3.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(a3) : A(a3, n11.locales)).detectedLocale && (i3.locale = e12.detectedLocale);
            }
            return i3;
          }(this[I].url.pathname, { nextConfig: this[I].options.nextConfig, parseData: true, i18nProvider: this[I].options.i18nProvider }), a2 = function(e11, t11) {
            let r11;
            if (t11?.host && !Array.isArray(t11.host)) r11 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r11 = e11.hostname;
            }
            return r11.toLowerCase();
          }(this[I].url, this[I].options.headers);
          this[I].domainLocale = this[I].options.i18nProvider ? this[I].options.i18nProvider.detectDomainLocale(a2) : function(e11, t11, r11) {
            if (e11) {
              for (let n11 of (r11 && (r11 = r11.toLowerCase()), e11)) if (t11 === n11.domain?.split(":", 1)[0].toLowerCase() || r11 === n11.defaultLocale.toLowerCase() || n11.locales?.some((e12) => e12.toLowerCase() === r11)) return n11;
            }
          }(null == (t10 = this[I].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, a2);
          let o2 = (null == (r10 = this[I].domainLocale) ? void 0 : r10.defaultLocale) || (null == (s2 = this[I].options.nextConfig) || null == (n10 = s2.i18n) ? void 0 : n10.defaultLocale);
          this[I].url.pathname = i2.pathname, this[I].defaultLocale = o2, this[I].basePath = i2.basePath ?? "", this[I].buildId = i2.buildId, this[I].locale = i2.locale ?? o2, this[I].trailingSlash = i2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r10, n10) {
            if (!t11 || t11 === r10) return e11;
            let s2 = e11.toLowerCase();
            return !n10 && (x(s2, "/api") || x(s2, `/${t11.toLowerCase()}`)) ? e11 : R(e11, `/${t11}`);
          }((e10 = { basePath: this[I].basePath, buildId: this[I].buildId, defaultLocale: this[I].options.forceLocale ? void 0 : this[I].defaultLocale, locale: this[I].locale, pathname: this[I].url.pathname, trailingSlash: this[I].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = E(t10)), e10.buildId && (t10 = O(R(t10, `/_next/data/${e10.buildId}`), "/" === e10.pathname ? "index.json" : ".json")), t10 = R(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : O(t10, "/") : E(t10);
        }
        formatSearch() {
          return this[I].url.search;
        }
        get buildId() {
          return this[I].buildId;
        }
        set buildId(e10) {
          this[I].buildId = e10;
        }
        get locale() {
          return this[I].locale ?? "";
        }
        set locale(e10) {
          var t10, r10;
          if (!this[I].locale || !(null == (r10 = this[I].options.nextConfig) || null == (t10 = r10.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[I].locale = e10;
        }
        get defaultLocale() {
          return this[I].defaultLocale;
        }
        get domainLocale() {
          return this[I].domainLocale;
        }
        get searchParams() {
          return this[I].url.searchParams;
        }
        get host() {
          return this[I].url.host;
        }
        set host(e10) {
          this[I].url.host = e10;
        }
        get hostname() {
          return this[I].url.hostname;
        }
        set hostname(e10) {
          this[I].url.hostname = e10;
        }
        get port() {
          return this[I].url.port;
        }
        set port(e10) {
          this[I].url.port = e10;
        }
        get protocol() {
          return this[I].url.protocol;
        }
        set protocol(e10) {
          this[I].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[I].url = j(e10), this.analyze();
        }
        get origin() {
          return this[I].url.origin;
        }
        get pathname() {
          return this[I].url.pathname;
        }
        set pathname(e10) {
          this[I].url.pathname = e10;
        }
        get hash() {
          return this[I].url.hash;
        }
        set hash(e10) {
          this[I].url.hash = e10;
        }
        get search() {
          return this[I].url.search;
        }
        set search(e10) {
          this[I].url.search = e10;
        }
        get password() {
          return this[I].url.password;
        }
        set password(e10) {
          this[I].url.password = e10;
        }
        get username() {
          return this[I].url.username;
        }
        set username(e10) {
          this[I].url.username = e10;
        }
        get basePath() {
          return this[I].basePath;
        }
        set basePath(e10) {
          this[I].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new $(String(this), this[I].options);
        }
      }
      var N, U, L, D, q, B, M, W, H, z, V, K, F, G, J, X, Y, Q, Z, ee, et, er, en, es, ei, ea, eo, el, eu, ec, eh, ed, ep, ef = e.i(828042);
      let eg = Symbol("internal request");
      class em extends Request {
        constructor(e10, t10 = {}) {
          const r10 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          b(r10), e10 instanceof Request ? super(e10, t10) : super(r10, t10);
          const n10 = new $(r10, { headers: y(this.headers), nextConfig: t10.nextConfig });
          this[eg] = { cookies: new ef.RequestCookies(this.headers), nextUrl: n10, url: n10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[eg].cookies;
        }
        get nextUrl() {
          return this[eg].nextUrl;
        }
        get page() {
          throw new d();
        }
        get ua() {
          throw new p();
        }
        get url() {
          return this[eg].url;
        }
      }
      class ey {
        static get(e10, t10, r10) {
          let n10 = Reflect.get(e10, t10, r10);
          return "function" == typeof n10 ? n10.bind(e10) : n10;
        }
        static set(e10, t10, r10, n10) {
          return Reflect.set(e10, t10, r10, n10);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let eb = Symbol("internal response"), ew = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function ev(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [n10, s2] of e10.request.headers) t10.set("x-middleware-request-" + n10, s2), r11.push(n10);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class e_ extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          const r10 = this.headers, n10 = new Proxy(new ef.ResponseCookies(r10), { get(e11, n11, s2) {
            switch (n11) {
              case "delete":
              case "set":
                return (...s3) => {
                  let i2 = Reflect.apply(e11[n11], e11, s3), a2 = new Headers(r10);
                  return i2 instanceof ef.ResponseCookies && r10.set("x-middleware-set-cookie", i2.getAll().map((e12) => (0, ef.stringifyCookie)(e12)).join(",")), ev(t10, a2), i2;
                };
              default:
                return ey.get(e11, n11, s2);
            }
          } });
          this[eb] = { cookies: n10, url: t10.url ? new $(t10.url, { headers: y(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[eb].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new e_(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!ew.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n10 = "object" == typeof t10 ? t10 : {}, s2 = new Headers(null == n10 ? void 0 : n10.headers);
          return s2.set("Location", b(e10)), new e_(null, { ...n10, headers: s2, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", b(e10)), ev(t10, r10), new e_(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), ev(e10, t10), new e_(null, { ...e10, headers: t10 });
        }
      }
      function eS(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, n10 = new URL(e10, t10), s2 = n10.origin === r10.origin;
        return { url: s2 ? n10.toString().slice(r10.origin.length) : n10.toString(), isRelative: s2 };
      }
      let ek = "next-router-prefetch", eE = ["rsc", "next-router-state-tree", ek, "next-hmr-refresh", "next-router-segment-prefetch"], eT = "_rsc";
      class eR extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new eR();
        }
      }
      class eO extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, n10) {
            if ("symbol" == typeof r10) return ey.get(t10, r10, n10);
            let s2 = r10.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === s2);
            if (void 0 !== i2) return ey.get(t10, i2, n10);
          }, set(t10, r10, n10, s2) {
            if ("symbol" == typeof r10) return ey.set(t10, r10, n10, s2);
            let i2 = r10.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            return ey.set(t10, a2 ?? r10, n10, s2);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return ey.has(t10, r10);
            let n10 = r10.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 !== s2 && ey.has(t10, s2);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return ey.deleteProperty(t10, r10);
            let n10 = r10.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 === s2 || ey.deleteProperty(t10, s2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return eR.callable;
              default:
                return ey.get(e11, t10, r10);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new eO(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, n10] of this.entries()) e10.call(t10, n10, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let ex = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class eC {
        disable() {
          throw ex;
        }
        getStore() {
        }
        run() {
          throw ex;
        }
        exit() {
          throw ex;
        }
        enterWith() {
          throw ex;
        }
        static bind(e10) {
          return e10;
        }
      }
      let eA = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function eP() {
        return eA ? new eA() : new eC();
      }
      let ej = eP();
      class eI extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new eI();
        }
      }
      class e$ {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return eI.callable;
              default:
                return ey.get(e11, t10, r10);
            }
          } });
        }
      }
      let eN = Symbol.for("next.mutated.cookies");
      class eU {
        static wrap(e10, t10) {
          let r10 = new ef.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let n10 = [], s2 = /* @__PURE__ */ new Set(), i2 = () => {
            let e11 = ej.getStore();
            if (e11 && (e11.pathWasRevalidated = 1), n10 = r10.getAll().filter((e12) => s2.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n10) {
                let r11 = new ef.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, a2 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case eN:
                return n10;
              case "delete":
                return function(...t12) {
                  s2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), a2;
                  } finally {
                    i2();
                  }
                };
              case "set":
                return function(...t12) {
                  s2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), a2;
                  } finally {
                    i2();
                  }
                };
              default:
                return ey.get(e11, t11, r11);
            }
          } });
          return a2;
        }
      }
      function eL(e10, t10) {
        if ("action" !== e10.phase) throw new eI();
      }
      var eD = ((N = eD || {}).handleRequest = "BaseServer.handleRequest", N.run = "BaseServer.run", N.pipe = "BaseServer.pipe", N.getStaticHTML = "BaseServer.getStaticHTML", N.render = "BaseServer.render", N.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", N.renderToResponse = "BaseServer.renderToResponse", N.renderToHTML = "BaseServer.renderToHTML", N.renderError = "BaseServer.renderError", N.renderErrorToResponse = "BaseServer.renderErrorToResponse", N.renderErrorToHTML = "BaseServer.renderErrorToHTML", N.render404 = "BaseServer.render404", N), eq = ((U = eq || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", U.loadComponents = "LoadComponents.loadComponents", U), eB = ((L = eB || {}).getRequestHandler = "NextServer.getRequestHandler", L.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", L.getServer = "NextServer.getServer", L.getServerRequestHandler = "NextServer.getServerRequestHandler", L.createServer = "createServer.createServer", L), eM = ((D = eM || {}).compression = "NextNodeServer.compression", D.getBuildId = "NextNodeServer.getBuildId", D.createComponentTree = "NextNodeServer.createComponentTree", D.clientComponentLoading = "NextNodeServer.clientComponentLoading", D.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", D.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", D.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", D.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", D.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", D.sendRenderResult = "NextNodeServer.sendRenderResult", D.proxyRequest = "NextNodeServer.proxyRequest", D.runApi = "NextNodeServer.runApi", D.render = "NextNodeServer.render", D.renderHTML = "NextNodeServer.renderHTML", D.imageOptimizer = "NextNodeServer.imageOptimizer", D.getPagePath = "NextNodeServer.getPagePath", D.getRoutesManifest = "NextNodeServer.getRoutesManifest", D.findPageComponents = "NextNodeServer.findPageComponents", D.getFontManifest = "NextNodeServer.getFontManifest", D.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", D.getRequestHandler = "NextNodeServer.getRequestHandler", D.renderToHTML = "NextNodeServer.renderToHTML", D.renderError = "NextNodeServer.renderError", D.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", D.render404 = "NextNodeServer.render404", D.startResponse = "NextNodeServer.startResponse", D.route = "route", D.onProxyReq = "onProxyReq", D.apiResolver = "apiResolver", D.internalFetch = "internalFetch", D), eW = ((q = eW || {}).startServer = "startServer.startServer", q), eH = ((B = eH || {}).getServerSideProps = "Render.getServerSideProps", B.getStaticProps = "Render.getStaticProps", B.renderToString = "Render.renderToString", B.renderDocument = "Render.renderDocument", B.createBodyResult = "Render.createBodyResult", B), ez = ((M = ez || {}).renderToString = "AppRender.renderToString", M.renderToReadableStream = "AppRender.renderToReadableStream", M.getBodyResult = "AppRender.getBodyResult", M.fetch = "AppRender.fetch", M), eV = ((W = eV || {}).executeRoute = "Router.executeRoute", W), eK = ((H = eK || {}).runHandler = "Node.runHandler", H), eF = ((z = eF || {}).runHandler = "AppRouteRouteHandlers.runHandler", z), eG = ((V = eG || {}).generateMetadata = "ResolveMetadata.generateMetadata", V.generateViewport = "ResolveMetadata.generateViewport", V), eJ = ((K = eJ || {}).execute = "Middleware.execute", K);
      let eX = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), eY = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function eQ(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let eZ = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: e0, propagation: e1, trace: e2, SpanStatusCode: e3, SpanKind: e4, ROOT_CONTEXT: e6 } = t = e.r(311646);
      class e5 extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let e8 = (e10, t10) => {
        "object" == typeof t10 && null !== t10 && t10 instanceof e5 && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && (e10.recordException(t10), e10.setAttribute("error.type", t10.name)), e10.setStatus({ code: e3.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, e9 = /* @__PURE__ */ new Map(), e7 = t.createContextKey("next.rootSpanId"), te = 0, tt = { set(e10, t10, r10) {
        e10.push({ key: t10, value: r10 });
      } }, tr = (n = new class e {
        getTracerInstance() {
          return e2.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return e0;
        }
        getTracePropagationData() {
          let e10 = e0.active(), t10 = [];
          return e1.inject(e10, t10, tt), t10;
        }
        getActiveScopeSpan() {
          return e2.getSpan(null == e0 ? void 0 : e0.active());
        }
        withPropagatedContext(e10, t10, r10) {
          let n10 = e0.active();
          if (e2.getSpanContext(n10)) return t10();
          let s2 = e1.extract(n10, e10, r10);
          return e0.with(s2, t10);
        }
        trace(...e10) {
          let [t10, r10, n10] = e10, { fn: s2, options: i2 } = "function" == typeof r10 ? { fn: r10, options: {} } : { fn: n10, options: { ...r10 } }, a2 = i2.spanName ?? t10;
          if (!eX.has(t10) && "1" !== process.env.NEXT_OTEL_VERBOSE || i2.hideSpan) return s2();
          let o2 = this.getSpanContext((null == i2 ? void 0 : i2.parentSpan) ?? this.getActiveScopeSpan());
          o2 || (o2 = (null == e0 ? void 0 : e0.active()) ?? e6);
          let l2 = o2.getValue(e7), u2 = "number" != typeof l2 || !e9.has(l2), c2 = te++;
          return i2.attributes = { "next.span_name": a2, "next.span_type": t10, ...i2.attributes }, e0.with(o2.setValue(e7, c2), () => this.getTracerInstance().startActiveSpan(a2, i2, (e11) => {
            let r11;
            eZ && t10 && eY.has(t10) && (r11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n11 = false, a3 = () => {
              !n11 && (n11 = true, e9.delete(c2), r11 && performance.measure(`${eZ}:next-${(t10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: r11, end: performance.now() }));
            };
            if (u2 && e9.set(c2, new Map(Object.entries(i2.attributes ?? {}))), s2.length > 1) try {
              return s2(e11, (t11) => e8(e11, t11));
            } catch (t11) {
              throw e8(e11, t11), t11;
            } finally {
              a3();
            }
            try {
              let t11 = s2(e11);
              if (eQ(t11)) return t11.then((t12) => (e11.end(), t12)).catch((t12) => {
                throw e8(e11, t12), t12;
              }).finally(a3);
              return e11.end(), a3(), t11;
            } catch (t11) {
              throw e8(e11, t11), a3(), t11;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r10, n10, s2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eX.has(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n10;
            "function" == typeof e11 && "function" == typeof s2 && (e11 = e11.apply(this, arguments));
            let i2 = arguments.length - 1, a2 = arguments[i2];
            if ("function" != typeof a2) return t10.trace(r10, e11, () => s2.apply(this, arguments));
            {
              let n11 = t10.getContext().bind(e0.active(), a2);
              return t10.trace(r10, e11, (e12, t11) => (arguments[i2] = function(e13) {
                return null == t11 || t11(e13), n11.apply(this, arguments);
              }, s2.apply(this, arguments)));
            }
          } : s2;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, n10 = this.getSpanContext((null == r10 ? void 0 : r10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r10, n10);
        }
        getSpanContext(e10) {
          return e10 ? e2.setSpan(e0.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = e0.active().getValue(e7);
          return e9.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r10 = e0.active().getValue(e7), n10 = e9.get(r10);
          n10 && !n10.has(e10) && n10.set(e10, t10);
        }
        withSpan(e10, t10) {
          let r10 = e2.setSpan(e0.active(), e10);
          return e0.with(r10, t10);
        }
      }(), () => n), tn = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(tn);
      class ts {
        constructor(e10, t10, r10, n10) {
          var s2;
          const i2 = e10 && function(e11, t11) {
            let r11 = eO.from(e11.headers);
            return { isOnDemandRevalidate: r11.get("x-prerender-revalidate") === t11.previewModeId, revalidateOnlyGenerated: r11.has("x-prerender-revalidate-if-generated") };
          }(t10, e10).isOnDemandRevalidate, a2 = null == (s2 = r10.get(tn)) ? void 0 : s2.value;
          this._isEnabled = !!(!i2 && a2 && e10 && a2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: tn, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: tn, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function ti(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r10 = e10.headers["x-middleware-set-cookie"], n10 = new Headers();
          for (let e11 of m(r10)) n10.append("set-cookie", e11);
          for (let e11 of new ef.ResponseCookies(n10).getAll()) t10.set(e11);
        }
      }
      let ta = eP();
      class to extends Error {
        constructor(e10, t10) {
          super(`Invariant: ${e10.endsWith(".") ? e10 : e10 + "."} This is a bug in Next.js.`, t10), this.name = "InvariantError";
        }
      }
      var tl = e.i(299734), tu = e.i(951615);
      process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let tc = Symbol.for("@next/cache-handlers-map"), th = Symbol.for("@next/cache-handlers-set"), td = globalThis;
      function tp() {
        if (td[tc]) return td[tc].entries();
      }
      async function tf(e10, t10) {
        if (!e10) return t10();
        let r10 = tg(e10);
        try {
          return await t10();
        } finally {
          var n10, s2;
          let t11, i2, a2 = (n10 = r10, s2 = tg(e10), t11 = new Set(n10.pendingRevalidatedTags.map((e11) => {
            let t12 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t12}`;
          })), i2 = new Set(n10.pendingRevalidateWrites), { pendingRevalidatedTags: s2.pendingRevalidatedTags.filter((e11) => {
            let r11 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t11.has(`${e11.tag}:${r11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(s2.pendingRevalidates).filter(([e11]) => !(e11 in n10.pendingRevalidates))), pendingRevalidateWrites: s2.pendingRevalidateWrites.filter((e11) => !i2.has(e11)) });
          await ty(e10, a2);
        }
      }
      function tg(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function tm(e10, t10, r10) {
        if (0 === e10.length) return;
        let n10 = function() {
          if (td[th]) return td[th].values();
        }(), s2 = [], i2 = /* @__PURE__ */ new Map();
        for (let t11 of e10) {
          let e11, r11 = t11.profile;
          for (let [t12] of i2) if ("string" == typeof t12 && "string" == typeof r11 && t12 === r11 || "object" == typeof t12 && "object" == typeof r11 && JSON.stringify(t12) === JSON.stringify(r11) || t12 === r11) {
            e11 = t12;
            break;
          }
          let n11 = e11 || r11;
          i2.has(n11) || i2.set(n11, []), i2.get(n11).push(t11.tag);
        }
        for (let [e11, o2] of i2) {
          let i3;
          if (e11) {
            let t11;
            if ("object" == typeof e11) t11 = e11;
            else if ("string" == typeof e11) {
              var a2;
              if (!(t11 = null == r10 || null == (a2 = r10.cacheLifeProfiles) ? void 0 : a2[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            t11 && (i3 = { expire: t11.expire });
          }
          for (let t11 of n10 || []) e11 ? s2.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o2, i3)) : s2.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o2));
          t10 && s2.push(t10.revalidateTag(o2, i3));
        }
        await Promise.all(s2);
      }
      async function ty(e10, t10) {
        let r10 = (null == t10 ? void 0 : t10.pendingRevalidatedTags) ?? e10.pendingRevalidatedTags ?? [], n10 = (null == t10 ? void 0 : t10.pendingRevalidates) ?? e10.pendingRevalidates ?? {}, s2 = (null == t10 ? void 0 : t10.pendingRevalidateWrites) ?? e10.pendingRevalidateWrites ?? [];
        return Promise.all([tm(r10, e10.incrementalCache, e10), ...Object.values(n10), ...s2]);
      }
      let tb = eP();
      class tw {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new tl.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if (eQ(e10)) this.waitUntil || tv(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t10;
          this.waitUntil || tv();
          let r10 = ta.getStore();
          r10 && this.workUnitStores.add(r10);
          let n10 = tb.getStore(), s2 = n10 ? n10.rootTaskSpawnPhase : null == r10 ? void 0 : r10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let i2 = (t10 = async () => {
            try {
              await tb.run({ rootTaskSpawnPhase: s2 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, eA ? eA.bind(t10) : eC.bind(t10));
          this.callbackQueue.add(i2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = ej.getStore();
          if (!e10) throw Object.defineProperty(new to("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return tf(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new to("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function tv() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function t_(e10) {
        let t10, r10 = { then: (n10, s2) => (t10 || (t10 = Promise.resolve(e10())), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(n10, s2)) };
        return r10;
      }
      class tS {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function tk() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let tE = Symbol.for("@next/request-context");
      async function tT(e10, t10, r10) {
        let n10 = /* @__PURE__ */ new Set();
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r11 = e11.split("/");
            for (let e12 = 1; e12 < r11.length + 1; e12++) {
              let n11 = r11.slice(0, e12).join("/");
              n11 && (n11.endsWith("/page") || n11.endsWith("/route") || (n11 = `${n11}${!n11.endsWith("/") ? "/" : ""}layout`), t12.push(n11));
            }
          }
          return t12;
        })(e10)) t11 = `${f}${t11}`, n10.add(t11);
        if (t10.pathname && (!r10 || 0 === r10.size)) {
          let e11 = `${f}${t10.pathname}`;
          n10.add(e11);
        }
        n10.has(`${f}/`) && n10.add(`${f}/index`), n10.has(`${f}/index`) && n10.add(`${f}/`);
        let s2 = Array.from(n10);
        return { tags: s2, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = tp();
          if (r11) for (let [n11, s3] of r11) "getExpiration" in s3 && t11.set(n11, t_(async () => s3.getExpiration(e11)));
          return t11;
        }(s2) };
      }
      class tR extends em {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new h({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tO = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tx = (e10, t10) => tr().withPropagatedContext(e10.headers, t10, tO), tC = false;
      async function tA(t10) {
        var r10, n10, s2, i2;
        let a2, o2, l2, c2, h2;
        !function() {
          if (!tC && (tC = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t11, wrapRequestHandler: r11 } = e.r(494165);
            t11(), tx = r11(tx);
          }
        }(), await u();
        let d2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = t10.request.url.replace(/\.rsc($|\?)/, "$1");
        let p2 = t10.bypassNextUrl ? new URL(t10.request.url) : new $(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...p2.searchParams.keys()]) {
          let t11 = p2.searchParams.getAll(e10), r11 = function(e11) {
            for (let t12 of ["nxtP", "nxtI"]) if (e11 !== t12 && e11.startsWith(t12)) return e11.substring(t12.length);
            return null;
          }(e10);
          if (r11) {
            for (let e11 of (p2.searchParams.delete(r11), t11)) p2.searchParams.append(r11, e11);
            p2.searchParams.delete(e10);
          }
        }
        let f2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in p2 && (f2 = p2.buildId || "", p2.buildId = "");
        let g2 = function(e10) {
          let t11 = new Headers();
          for (let [r11, n11] of Object.entries(e10)) for (let e11 of Array.isArray(n11) ? n11 : [n11]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t11.append(r11, e11));
          return t11;
        }(t10.request.headers), m2 = g2.has("x-nextjs-data"), y2 = "1" === g2.get("rsc");
        m2 && "/index" === p2.pathname && (p2.pathname = "/");
        let b2 = /* @__PURE__ */ new Map();
        if (!d2) for (let e10 of eE) {
          let t11 = g2.get(e10);
          null !== t11 && (b2.set(e10, t11), g2.delete(e10));
        }
        let w2 = p2.searchParams.get(eT), v2 = new tR({ page: t10.page, input: ((c2 = (l2 = "string" == typeof p2) ? new URL(p2) : p2).searchParams.delete(eT), l2 ? c2.toString() : c2).toString(), init: { body: t10.request.body, headers: g2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        m2 && Object.defineProperty(v2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: tk() }) }));
        let S2 = t10.request.waitUntil ?? (null == (r10 = null == (h2 = globalThis[tE]) ? void 0 : h2.get()) ? void 0 : r10.waitUntil), E2 = new k({ request: v2, page: t10.page, context: S2 ? { waitUntil: S2 } : void 0 });
        if ((a2 = await tx(v2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page || "/proxy" === t10.page || "/src/proxy" === t10.page) {
            let e10 = E2.waitUntil.bind(E2), r11 = new tS();
            return tr().trace(eJ.execute, { spanName: `middleware ${v2.method}`, attributes: { "http.target": v2.nextUrl.pathname, "http.method": v2.method } }, async () => {
              try {
                var n11, s3, i3, a3, l3, u2;
                let c3 = tk(), h3 = await tT("/", v2.nextUrl, null), d3 = (l3 = v2.nextUrl, u2 = (e11) => {
                  o2 = e11;
                }, function(e11, t11, r12, n12, s4, i4, a4, o3, l4, u3, c4, h4) {
                  function d4(e12) {
                    r12 && r12.setHeader("Set-Cookie", e12);
                  }
                  let p4 = {};
                  return { type: "request", phase: e11, implicitTags: i4, url: { pathname: n12.pathname, search: n12.search ?? "" }, rootParams: s4, get headers() {
                    return p4.headers || (p4.headers = function(e12) {
                      let t12 = eO.from(e12);
                      for (let e13 of eE) t12.delete(e13);
                      return eO.seal(t12);
                    }(t11.headers)), p4.headers;
                  }, get cookies() {
                    if (!p4.cookies) {
                      let e12 = new ef.RequestCookies(eO.from(t11.headers));
                      ti(t11, e12), p4.cookies = e$.seal(e12);
                    }
                    return p4.cookies;
                  }, set cookies(value) {
                    p4.cookies = value;
                  }, get mutableCookies() {
                    if (!p4.mutableCookies) {
                      var f3, g3;
                      let e12, n13 = (f3 = t11.headers, g3 = a4 || (r12 ? d4 : void 0), e12 = new ef.RequestCookies(eO.from(f3)), eU.wrap(e12, g3));
                      ti(t11, n13), p4.mutableCookies = n13;
                    }
                    return p4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!p4.userspaceMutableCookies) {
                      var m3;
                      let e12;
                      m3 = this, p4.userspaceMutableCookies = e12 = new Proxy(m3.mutableCookies, { get(t12, r13, n13) {
                        switch (r13) {
                          case "delete":
                            return function(...r14) {
                              return eL(m3, "cookies().delete"), t12.delete(...r14), e12;
                            };
                          case "set":
                            return function(...r14) {
                              return eL(m3, "cookies().set"), t12.set(...r14), e12;
                            };
                          default:
                            return ey.get(t12, r13, n13);
                        }
                      } });
                    }
                    return p4.userspaceMutableCookies;
                  }, get draftMode() {
                    return p4.draftMode || (p4.draftMode = new ts(l4, t11, this.cookies, this.mutableCookies)), p4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: u3, serverComponentsHmrCache: c4 || globalThis.__serverComponentsHmrCache, devFallbackParams: null };
                }("action", v2, void 0, l3, {}, h3, u2, null, c3, false, void 0, null)), p3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r12, buildId: n12, previouslyRevalidatedTags: s4, nonce: i4 }) {
                  var a4;
                  let o3 = !t11.shouldWaitOnAllReady && !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, l4 = t11.dev ?? false, u3 = l4 || o3 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), c4 = { isStaticGeneration: o3, page: e11, route: (a4 = e11.split("/").reduce((e12, t12, r13, n13) => t12 ? "(" === t12[0] && t12.endsWith(")") || "@" === t12[0] || ("page" === t12 || "route" === t12) && r13 === n13.length - 1 ? e12 : `${e12}/${t12}` : e12, "")).startsWith("/") ? a4 : `/${a4}`, incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, isBuildTimePrerendering: t11.nextExport, hasReadableErrorStacks: t11.hasReadableErrorStacks, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, isDraftMode: t11.isDraftMode, isPrefetchRequest: r12, buildId: n12, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", nonce: i4, afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r13, onAfterTaskError: n13 } = e12;
                    return new tw({ waitUntil: t12, onClose: r13, onTaskError: n13 });
                  }(t11), cacheComponentsEnabled: t11.cacheComponents, dev: l4, previouslyRevalidatedTags: s4, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = tp();
                    if (t12) for (let [r13, n13] of t12) "refreshTags" in n13 && e12.set(r13, t_(async () => n13.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: eA ? eA.snapshot() : function(e12, ...t12) {
                    return e12(...t12);
                  }, shouldTrackFetchMetrics: u3, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t11.store = c4, c4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (s3 = t10.request.nextConfig) || null == (n11 = s3.experimental) ? void 0 : n11.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (a3 = t10.request.nextConfig) || null == (i3 = a3.experimental) ? void 0 : i3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r11.onClose.bind(r11), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === v2.headers.get(ek), buildId: f2 ?? "", previouslyRevalidatedTags: [] });
                return await ej.run(p3, () => ta.run(d3, t10.handler, v2, E2));
              } finally {
                setTimeout(() => {
                  r11.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(v2, E2);
        })) && !(a2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        a2 && o2 && a2.headers.set("set-cookie", o2);
        let T2 = null == a2 ? void 0 : a2.headers.get("x-middleware-rewrite");
        if (a2 && T2 && (y2 || !d2)) {
          let e10 = new $(T2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          d2 || e10.host !== v2.nextUrl.host || (e10.buildId = f2 || e10.buildId, a2.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r11, isRelative: o3 } = eS(e10.toString(), p2.toString());
          !d2 && m2 && a2.headers.set("x-nextjs-rewrite", r11);
          let l3 = !o3 && (null == (i2 = t10.request.nextConfig) || null == (s2 = i2.experimental) || null == (n10 = s2.clientParamParsingOrigins) ? void 0 : n10.some((t11) => new RegExp(t11).test(e10.origin)));
          y2 && (o3 || l3) && (p2.pathname !== e10.pathname && a2.headers.set("x-nextjs-rewritten-path", e10.pathname), p2.search !== e10.search && a2.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (a2 && T2 && y2 && w2) {
          let e10 = new URL(T2);
          e10.searchParams.has(eT) || (e10.searchParams.set(eT, w2), a2.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let R2 = null == a2 ? void 0 : a2.headers.get("Location");
        if (a2 && R2 && !d2) {
          let e10 = new $(R2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          a2 = new Response(a2.body, a2), e10.host === p2.host && (e10.buildId = f2 || e10.buildId, a2.headers.set("Location", eS(e10, p2).url)), m2 && (a2.headers.delete("Location"), a2.headers.set("x-nextjs-redirect", eS(e10.toString(), p2.toString()).url));
        }
        let O2 = a2 || e_.next(), x2 = O2.headers.get("x-middleware-override-headers"), C2 = [];
        if (x2) {
          for (let [e10, t11] of b2) O2.headers.set(`x-middleware-request-${e10}`, t11), C2.push(e10);
          C2.length > 0 && O2.headers.set("x-middleware-override-headers", x2 + "," + C2.join(","));
        }
        return { response: O2, waitUntil: ("internal" === E2[_].kind ? Promise.all(E2[_].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: v2.fetchMetrics };
      }
      var tP = e.i(399929);
      tP.parse, tP.serialize;
      let tj = { path: "/", sameSite: "lax", httpOnly: false, maxAge: 3456e4 }, tI = /^(.*)[.](0|[1-9][0-9]*)$/;
      function t$(e10, t10) {
        if (e10 === t10) return true;
        let r10 = e10.match(tI);
        return !!r10 && r10[1] === t10;
      }
      function tN(e10, t10, r10) {
        let n10 = r10 ?? 3180, s2 = encodeURIComponent(t10);
        if (s2.length <= n10) return [{ name: e10, value: t10 }];
        let i2 = [];
        for (; s2.length > 0; ) {
          let e11 = s2.slice(0, n10), t11 = e11.lastIndexOf("%");
          t11 > n10 - 3 && (e11 = e11.slice(0, t11));
          let r11 = "";
          for (; e11.length > 0; ) try {
            r11 = decodeURIComponent(e11);
            break;
          } catch (t12) {
            if (t12 instanceof URIError && "%" === e11.at(-3) && e11.length > 3) e11 = e11.slice(0, e11.length - 3);
            else throw t12;
          }
          i2.push(r11), s2 = s2.slice(e11.length);
        }
        return i2.map((t11, r11) => ({ name: `${e10}.${r11}`, value: t11 }));
      }
      async function tU(e10, t10) {
        let r10 = await t10(e10);
        if (r10) return r10;
        let n10 = [];
        for (let r11 = 0; ; r11++) {
          let s2 = `${e10}.${r11}`, i2 = await t10(s2);
          if (!i2) break;
          n10.push(i2);
        }
        return n10.length > 0 ? n10.join("") : null;
      }
      let tL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), tD = " 	\n\r=".split(""), tq = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < tD.length; t10 += 1) e10[tD[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < tL.length; t10 += 1) e10[tL[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function tB(e10) {
        let t10 = [], r10 = 0, n10 = 0;
        if (function(e11, t11) {
          for (let r11 = 0; r11 < e11.length; r11 += 1) {
            let n11 = e11.charCodeAt(r11);
            if (n11 > 55295 && n11 <= 56319) {
              let t12 = (n11 - 55296) * 1024 & 65535;
              n11 = (e11.charCodeAt(r11 + 1) - 56320 & 65535 | t12) + 65536, r11 += 1;
            }
            !function(e12, t12) {
              if (e12 <= 127) return t12(e12);
              if (e12 <= 2047) {
                t12(192 | e12 >> 6), t12(128 | 63 & e12);
                return;
              }
              if (e12 <= 65535) {
                t12(224 | e12 >> 12), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                return;
              }
              if (e12 <= 1114111) {
                t12(240 | e12 >> 18), t12(128 | e12 >> 12 & 63), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                return;
              }
              throw Error(`Unrecognized Unicode codepoint: ${e12.toString(16)}`);
            }(n11, t11);
          }
        }(e10, (e11) => {
          for (r10 = r10 << 8 | e11, n10 += 8; n10 >= 6; ) {
            let e12 = r10 >> n10 - 6 & 63;
            t10.push(tL[e12]), n10 -= 6;
          }
        }), n10 > 0) for (r10 <<= 6 - n10, n10 = 6; n10 >= 6; ) {
          let e11 = r10 >> n10 - 6 & 63;
          t10.push(tL[e11]), n10 -= 6;
        }
        return t10.join("");
      }
      function tM(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, n10 = { utf8seq: 0, codepoint: 0 }, s2 = 0, i2 = 0;
        for (let t11 = 0; t11 < e10.length; t11 += 1) {
          let a2 = tq[e10.charCodeAt(t11)];
          if (a2 > -1) for (s2 = s2 << 6 | a2, i2 += 6; i2 >= 8; ) (function(e11, t12, r11) {
            if (0 === t12.utf8seq) {
              if (e11 <= 127) return r11(e11);
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e11 >> 7 - r12 & 1) == 0) {
                t12.utf8seq = r12;
                break;
              }
              if (2 === t12.utf8seq) t12.codepoint = 31 & e11;
              else if (3 === t12.utf8seq) t12.codepoint = 15 & e11;
              else if (4 === t12.utf8seq) t12.codepoint = 7 & e11;
              else throw Error("Invalid UTF-8 sequence");
              t12.utf8seq -= 1;
            } else if (t12.utf8seq > 0) {
              if (e11 <= 127) throw Error("Invalid UTF-8 sequence");
              t12.codepoint = t12.codepoint << 6 | 63 & e11, t12.utf8seq -= 1, 0 === t12.utf8seq && r11(t12.codepoint);
            }
          })(s2 >> i2 - 8 & 255, n10, r10), i2 -= 8;
          else if (-2 === a2) continue;
          else throw Error(`Invalid Base64-URL character "${e10.at(t11)}" at position ${t11}`);
        }
        return t10.join("");
      }
      let tW = "base64-";
      async function tH({ getAll: e10, setAll: t10, setItems: r10, removedItems: n10 }, s2) {
        let i2 = s2.cookieEncoding, a2 = s2.cookieOptions ?? null, o2 = await e10([...r10 ? Object.keys(r10) : [], ...n10 ? Object.keys(n10) : []]), l2 = o2?.map(({ name: e11 }) => e11) || [], u2 = Object.keys(n10).flatMap((e11) => l2.filter((t11) => t$(t11, e11))), c2 = Object.keys(r10).flatMap((e11) => {
          let t11 = new Set(l2.filter((t12) => t$(t12, e11))), n11 = r10[e11];
          "base64url" === i2 && (n11 = tW + tB(n11));
          let s3 = tN(e11, n11);
          return s3.forEach((e12) => {
            t11.delete(e12.name);
          }), u2.push(...t11), s3;
        }), h2 = { ...tj, ...a2, maxAge: 0 }, d2 = { ...tj, ...a2, maxAge: tj.maxAge };
        delete h2.name, delete d2.name, await t10([...u2.map((e11) => ({ name: e11, value: "", options: h2 })), ...c2.map(({ name: e11, value: t11 }) => ({ name: e11, value: t11, options: d2 }))]);
      }
      class tz extends Error {
        constructor(e10, t10 = "FunctionsError", r10) {
          super(e10), this.name = t10, this.context = r10;
        }
      }
      class tV extends tz {
        constructor(e10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", e10);
        }
      }
      class tK extends tz {
        constructor(e10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", e10);
        }
      }
      class tF extends tz {
        constructor(e10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e10);
        }
      }
      (F = en || (en = {})).Any = "any", F.ApNortheast1 = "ap-northeast-1", F.ApNortheast2 = "ap-northeast-2", F.ApSouth1 = "ap-south-1", F.ApSoutheast1 = "ap-southeast-1", F.ApSoutheast2 = "ap-southeast-2", F.CaCentral1 = "ca-central-1", F.EuCentral1 = "eu-central-1", F.EuWest1 = "eu-west-1", F.EuWest2 = "eu-west-2", F.EuWest3 = "eu-west-3", F.SaEast1 = "sa-east-1", F.UsEast1 = "us-east-1", F.UsWest1 = "us-west-1", F.UsWest2 = "us-west-2";
      function tG(e10, t10) {
        var r10 = {};
        for (var n10 in e10) Object.prototype.hasOwnProperty.call(e10, n10) && 0 > t10.indexOf(n10) && (r10[n10] = e10[n10]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var s2 = 0, n10 = Object.getOwnPropertySymbols(e10); s2 < n10.length; s2++) 0 > t10.indexOf(n10[s2]) && Object.prototype.propertyIsEnumerable.call(e10, n10[s2]) && (r10[n10[s2]] = e10[n10[s2]]);
        return r10;
      }
      "function" == typeof SuppressedError && SuppressedError;
      class tJ {
        constructor(e10, { headers: t10 = {}, customFetch: r10, region: n10 = en.Any } = {}) {
          this.url = e10, this.headers = t10, this.region = n10, this.fetch = /* @__PURE__ */ ((e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12))(r10);
        }
        setAuth(e10) {
          this.headers.Authorization = `Bearer ${e10}`;
        }
        invoke(e10) {
          var t10, r10, n10, s2;
          return t10 = this, r10 = arguments, n10 = void 0, s2 = function* (e11, t11 = {}) {
            var r11;
            let n11, s3;
            try {
              let i2, { headers: a2, method: o2, body: l2, signal: u2, timeout: c2 } = t11, h2 = {}, { region: d2 } = t11;
              d2 || (d2 = this.region);
              let p2 = new URL(`${this.url}/${e11}`);
              d2 && "any" !== d2 && (h2["x-region"] = d2, p2.searchParams.set("forceFunctionRegion", d2)), l2 && (a2 && !Object.prototype.hasOwnProperty.call(a2, "Content-Type") || !a2) ? "u" > typeof Blob && l2 instanceof Blob || l2 instanceof ArrayBuffer ? (h2["Content-Type"] = "application/octet-stream", i2 = l2) : "string" == typeof l2 ? (h2["Content-Type"] = "text/plain", i2 = l2) : "u" > typeof FormData && l2 instanceof FormData ? i2 = l2 : (h2["Content-Type"] = "application/json", i2 = JSON.stringify(l2)) : i2 = !l2 || "string" == typeof l2 || "u" > typeof Blob && l2 instanceof Blob || l2 instanceof ArrayBuffer || "u" > typeof FormData && l2 instanceof FormData ? l2 : JSON.stringify(l2);
              let f2 = u2;
              c2 && (s3 = new AbortController(), n11 = setTimeout(() => s3.abort(), c2), u2 ? (f2 = s3.signal, u2.addEventListener("abort", () => s3.abort())) : f2 = s3.signal);
              let g2 = yield this.fetch(p2.toString(), { method: o2 || "POST", headers: Object.assign(Object.assign(Object.assign({}, h2), this.headers), a2), body: i2, signal: f2 }).catch((e12) => {
                throw new tV(e12);
              }), m2 = g2.headers.get("x-relay-error");
              if (m2 && "true" === m2) throw new tK(g2);
              if (!g2.ok) throw new tF(g2);
              let y2 = (null != (r11 = g2.headers.get("Content-Type")) ? r11 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === y2 ? yield g2.json() : "application/octet-stream" === y2 || "application/pdf" === y2 ? yield g2.blob() : "text/event-stream" === y2 ? g2 : "multipart/form-data" === y2 ? yield g2.formData() : yield g2.text(), error: null, response: g2 };
            } catch (e12) {
              return { data: null, error: e12, response: e12 instanceof tF || e12 instanceof tK ? e12.context : void 0 };
            } finally {
              n11 && clearTimeout(n11);
            }
          }, new (n10 || (n10 = Promise))(function(e11, i2) {
            function a2(e12) {
              try {
                l2(s2.next(e12));
              } catch (e13) {
                i2(e13);
              }
            }
            function o2(e12) {
              try {
                l2(s2.throw(e12));
              } catch (e13) {
                i2(e13);
              }
            }
            function l2(t11) {
              var r11;
              t11.done ? e11(t11.value) : ((r11 = t11.value) instanceof n10 ? r11 : new n10(function(e12) {
                e12(r11);
              })).then(a2, o2);
            }
            l2((s2 = s2.apply(t10, r10 || [])).next());
          });
        }
      }
      var tX = class extends Error {
        constructor(e10) {
          super(e10.message), this.name = "PostgrestError", this.details = e10.details, this.hint = e10.hint, this.code = e10.code;
        }
      }, tY = class {
        constructor(e10) {
          var t10, r10, n10;
          this.shouldThrowOnError = false, this.method = e10.method, this.url = e10.url, this.headers = new Headers(e10.headers), this.schema = e10.schema, this.body = e10.body, this.shouldThrowOnError = null != (t10 = e10.shouldThrowOnError) && t10, this.signal = e10.signal, this.isMaybeSingle = null != (r10 = e10.isMaybeSingle) && r10, this.urlLengthLimit = null != (n10 = e10.urlLengthLimit) ? n10 : 8e3, e10.fetch ? this.fetch = e10.fetch : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(e10, t10) {
          return this.headers = new Headers(this.headers), this.headers.set(e10, t10), this;
        }
        then(e10, t10) {
          var r10 = this;
          void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json");
          let n10 = (0, this.fetch)(this.url.toString(), { method: this.method, headers: this.headers, body: JSON.stringify(this.body), signal: this.signal }).then(async (e11) => {
            var t11, n11, s2, i2;
            let a2 = null, o2 = null, l2 = null, u2 = e11.status, c2 = e11.statusText;
            if (e11.ok) {
              if ("HEAD" !== r10.method) {
                let t12 = await e11.text();
                "" === t12 || (o2 = "text/csv" === r10.headers.get("Accept") || r10.headers.get("Accept") && (null == (s2 = r10.headers.get("Accept")) ? void 0 : s2.includes("application/vnd.pgrst.plan+text")) ? t12 : JSON.parse(t12));
              }
              let i3 = null == (t11 = r10.headers.get("Prefer")) ? void 0 : t11.match(/count=(exact|planned|estimated)/), h2 = null == (n11 = e11.headers.get("content-range")) ? void 0 : n11.split("/");
              i3 && h2 && h2.length > 1 && (l2 = parseInt(h2[1])), r10.isMaybeSingle && "GET" === r10.method && Array.isArray(o2) && (o2.length > 1 ? (a2 = { code: "PGRST116", details: `Results contain ${o2.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, o2 = null, l2 = null, u2 = 406, c2 = "Not Acceptable") : o2 = 1 === o2.length ? o2[0] : null);
            } else {
              let t12 = await e11.text();
              try {
                a2 = JSON.parse(t12), Array.isArray(a2) && 404 === e11.status && (o2 = [], a2 = null, u2 = 200, c2 = "OK");
              } catch (r11) {
                404 === e11.status && "" === t12 ? (u2 = 204, c2 = "No Content") : a2 = { message: t12 };
              }
              if (a2 && r10.isMaybeSingle && (null == a2 || null == (i2 = a2.details) ? void 0 : i2.includes("0 rows")) && (a2 = null, u2 = 200, c2 = "OK"), a2 && r10.shouldThrowOnError) throw new tX(a2);
            }
            return { error: a2, data: o2, count: l2, status: u2, statusText: c2 };
          });
          return this.shouldThrowOnError || (n10 = n10.catch((e11) => {
            var t11, r11, n11, s2, i2, a2;
            let o2 = "", l2 = "", u2 = "", c2 = null == e11 ? void 0 : e11.cause;
            if (c2) {
              let t12 = null != (r11 = null == c2 ? void 0 : c2.message) ? r11 : "", a3 = null != (n11 = null == c2 ? void 0 : c2.code) ? n11 : "";
              o2 = `${null != (s2 = null == e11 ? void 0 : e11.name) ? s2 : "FetchError"}: ${null == e11 ? void 0 : e11.message}

Caused by: ${null != (i2 = null == c2 ? void 0 : c2.name) ? i2 : "Error"}: ${t12}`, a3 && (o2 += ` (${a3})`), (null == c2 ? void 0 : c2.stack) && (o2 += `
${c2.stack}`);
            } else o2 = null != (a2 = null == e11 ? void 0 : e11.stack) ? a2 : "";
            let h2 = this.url.toString().length;
            return (null == e11 ? void 0 : e11.name) === "AbortError" || (null == e11 ? void 0 : e11.code) === "ABORT_ERR" ? (u2 = "", l2 = "Request was aborted (timeout or manual cancellation)", h2 > this.urlLengthLimit && (l2 += `. Note: Your request URL is ${h2} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)) : ((null == c2 ? void 0 : c2.name) === "HeadersOverflowError" || (null == c2 ? void 0 : c2.code) === "UND_ERR_HEADERS_OVERFLOW") && (u2 = "", l2 = "HTTP headers exceeded server limits (typically 16KB)", h2 > this.urlLengthLimit && (l2 += `. Your request URL is ${h2} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)), { error: { message: `${null != (t11 = null == e11 ? void 0 : e11.name) ? t11 : "FetchError"}: ${null == e11 ? void 0 : e11.message}`, details: o2, hint: l2, code: u2 }, data: null, count: null, status: 0, statusText: "" };
          })), n10.then(e10, t10);
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      }, tQ = class extends tY {
        select(e10) {
          let t10 = false, r10 = (null != e10 ? e10 : "*").split("").map((e11) => /\s/.test(e11) && !t10 ? "" : ('"' === e11 && (t10 = !t10), e11)).join("");
          return this.url.searchParams.set("select", r10), this.headers.append("Prefer", "return=representation"), this;
        }
        order(e10, { ascending: t10 = true, nullsFirst: r10, foreignTable: n10, referencedTable: s2 = n10 } = {}) {
          let i2 = s2 ? `${s2}.order` : "order", a2 = this.url.searchParams.get(i2);
          return this.url.searchParams.set(i2, `${a2 ? `${a2},` : ""}${e10}.${t10 ? "asc" : "desc"}${void 0 === r10 ? "" : r10 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(e10, { foreignTable: t10, referencedTable: r10 = t10 } = {}) {
          let n10 = void 0 === r10 ? "limit" : `${r10}.limit`;
          return this.url.searchParams.set(n10, `${e10}`), this;
        }
        range(e10, t10, { foreignTable: r10, referencedTable: n10 = r10 } = {}) {
          let s2 = void 0 === n10 ? "offset" : `${n10}.offset`, i2 = void 0 === n10 ? "limit" : `${n10}.limit`;
          return this.url.searchParams.set(s2, `${e10}`), this.url.searchParams.set(i2, `${t10 - e10 + 1}`), this;
        }
        abortSignal(e10) {
          return this.signal = e10, this;
        }
        single() {
          return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this;
        }
        maybeSingle() {
          return "GET" === this.method ? this.headers.set("Accept", "application/json") : this.headers.set("Accept", "application/vnd.pgrst.object+json"), this.isMaybeSingle = true, this;
        }
        csv() {
          return this.headers.set("Accept", "text/csv"), this;
        }
        geojson() {
          return this.headers.set("Accept", "application/geo+json"), this;
        }
        explain({ analyze: e10 = false, verbose: t10 = false, settings: r10 = false, buffers: n10 = false, wal: s2 = false, format: i2 = "text" } = {}) {
          var a2;
          let o2 = [e10 ? "analyze" : null, t10 ? "verbose" : null, r10 ? "settings" : null, n10 ? "buffers" : null, s2 ? "wal" : null].filter(Boolean).join("|"), l2 = null != (a2 = this.headers.get("Accept")) ? a2 : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${i2}; for="${l2}"; options=${o2};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(e10) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${e10}`), this;
        }
      };
      let tZ = RegExp("[,()]");
      var t0 = class extends tQ {
        eq(e10, t10) {
          return this.url.searchParams.append(e10, `eq.${t10}`), this;
        }
        neq(e10, t10) {
          return this.url.searchParams.append(e10, `neq.${t10}`), this;
        }
        gt(e10, t10) {
          return this.url.searchParams.append(e10, `gt.${t10}`), this;
        }
        gte(e10, t10) {
          return this.url.searchParams.append(e10, `gte.${t10}`), this;
        }
        lt(e10, t10) {
          return this.url.searchParams.append(e10, `lt.${t10}`), this;
        }
        lte(e10, t10) {
          return this.url.searchParams.append(e10, `lte.${t10}`), this;
        }
        like(e10, t10) {
          return this.url.searchParams.append(e10, `like.${t10}`), this;
        }
        likeAllOf(e10, t10) {
          return this.url.searchParams.append(e10, `like(all).{${t10.join(",")}}`), this;
        }
        likeAnyOf(e10, t10) {
          return this.url.searchParams.append(e10, `like(any).{${t10.join(",")}}`), this;
        }
        ilike(e10, t10) {
          return this.url.searchParams.append(e10, `ilike.${t10}`), this;
        }
        ilikeAllOf(e10, t10) {
          return this.url.searchParams.append(e10, `ilike(all).{${t10.join(",")}}`), this;
        }
        ilikeAnyOf(e10, t10) {
          return this.url.searchParams.append(e10, `ilike(any).{${t10.join(",")}}`), this;
        }
        regexMatch(e10, t10) {
          return this.url.searchParams.append(e10, `match.${t10}`), this;
        }
        regexIMatch(e10, t10) {
          return this.url.searchParams.append(e10, `imatch.${t10}`), this;
        }
        is(e10, t10) {
          return this.url.searchParams.append(e10, `is.${t10}`), this;
        }
        isDistinct(e10, t10) {
          return this.url.searchParams.append(e10, `isdistinct.${t10}`), this;
        }
        in(e10, t10) {
          let r10 = Array.from(new Set(t10)).map((e11) => "string" == typeof e11 && tZ.test(e11) ? `"${e11}"` : `${e11}`).join(",");
          return this.url.searchParams.append(e10, `in.(${r10})`), this;
        }
        notIn(e10, t10) {
          let r10 = Array.from(new Set(t10)).map((e11) => "string" == typeof e11 && tZ.test(e11) ? `"${e11}"` : `${e11}`).join(",");
          return this.url.searchParams.append(e10, `not.in.(${r10})`), this;
        }
        contains(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `cs.${t10}`) : Array.isArray(t10) ? this.url.searchParams.append(e10, `cs.{${t10.join(",")}}`) : this.url.searchParams.append(e10, `cs.${JSON.stringify(t10)}`), this;
        }
        containedBy(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `cd.${t10}`) : Array.isArray(t10) ? this.url.searchParams.append(e10, `cd.{${t10.join(",")}}`) : this.url.searchParams.append(e10, `cd.${JSON.stringify(t10)}`), this;
        }
        rangeGt(e10, t10) {
          return this.url.searchParams.append(e10, `sr.${t10}`), this;
        }
        rangeGte(e10, t10) {
          return this.url.searchParams.append(e10, `nxl.${t10}`), this;
        }
        rangeLt(e10, t10) {
          return this.url.searchParams.append(e10, `sl.${t10}`), this;
        }
        rangeLte(e10, t10) {
          return this.url.searchParams.append(e10, `nxr.${t10}`), this;
        }
        rangeAdjacent(e10, t10) {
          return this.url.searchParams.append(e10, `adj.${t10}`), this;
        }
        overlaps(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `ov.${t10}`) : this.url.searchParams.append(e10, `ov.{${t10.join(",")}}`), this;
        }
        textSearch(e10, t10, { config: r10, type: n10 } = {}) {
          let s2 = "";
          "plain" === n10 ? s2 = "pl" : "phrase" === n10 ? s2 = "ph" : "websearch" === n10 && (s2 = "w");
          let i2 = void 0 === r10 ? "" : `(${r10})`;
          return this.url.searchParams.append(e10, `${s2}fts${i2}.${t10}`), this;
        }
        match(e10) {
          return Object.entries(e10).forEach(([e11, t10]) => {
            this.url.searchParams.append(e11, `eq.${t10}`);
          }), this;
        }
        not(e10, t10, r10) {
          return this.url.searchParams.append(e10, `not.${t10}.${r10}`), this;
        }
        or(e10, { foreignTable: t10, referencedTable: r10 = t10 } = {}) {
          let n10 = r10 ? `${r10}.or` : "or";
          return this.url.searchParams.append(n10, `(${e10})`), this;
        }
        filter(e10, t10, r10) {
          return this.url.searchParams.append(e10, `${t10}.${r10}`), this;
        }
      }, t1 = class {
        constructor(e10, { headers: t10 = {}, schema: r10, fetch: n10, urlLengthLimit: s2 = 8e3 }) {
          this.url = e10, this.headers = new Headers(t10), this.schema = r10, this.fetch = n10, this.urlLengthLimit = s2;
        }
        cloneRequestState() {
          return { url: new URL(this.url.toString()), headers: new Headers(this.headers) };
        }
        select(e10, t10) {
          let { head: r10 = false, count: n10 } = null != t10 ? t10 : {}, s2 = false, i2 = (null != e10 ? e10 : "*").split("").map((e11) => /\s/.test(e11) && !s2 ? "" : ('"' === e11 && (s2 = !s2), e11)).join(""), { url: a2, headers: o2 } = this.cloneRequestState();
          return a2.searchParams.set("select", i2), n10 && o2.append("Prefer", `count=${n10}`), new t0({ method: r10 ? "HEAD" : "GET", url: a2, headers: o2, schema: this.schema, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit });
        }
        insert(e10, { count: t10, defaultToNull: r10 = true } = {}) {
          var n10;
          let { url: s2, headers: i2 } = this.cloneRequestState();
          if (t10 && i2.append("Prefer", `count=${t10}`), r10 || i2.append("Prefer", "missing=default"), Array.isArray(e10)) {
            let t11 = e10.reduce((e11, t12) => e11.concat(Object.keys(t12)), []);
            if (t11.length > 0) {
              let e11 = [...new Set(t11)].map((e12) => `"${e12}"`);
              s2.searchParams.set("columns", e11.join(","));
            }
          }
          return new t0({ method: "POST", url: s2, headers: i2, schema: this.schema, body: e10, fetch: null != (n10 = this.fetch) ? n10 : fetch, urlLengthLimit: this.urlLengthLimit });
        }
        upsert(e10, { onConflict: t10, ignoreDuplicates: r10 = false, count: n10, defaultToNull: s2 = true } = {}) {
          var i2;
          let { url: a2, headers: o2 } = this.cloneRequestState();
          if (o2.append("Prefer", `resolution=${r10 ? "ignore" : "merge"}-duplicates`), void 0 !== t10 && a2.searchParams.set("on_conflict", t10), n10 && o2.append("Prefer", `count=${n10}`), s2 || o2.append("Prefer", "missing=default"), Array.isArray(e10)) {
            let t11 = e10.reduce((e11, t12) => e11.concat(Object.keys(t12)), []);
            if (t11.length > 0) {
              let e11 = [...new Set(t11)].map((e12) => `"${e12}"`);
              a2.searchParams.set("columns", e11.join(","));
            }
          }
          return new t0({ method: "POST", url: a2, headers: o2, schema: this.schema, body: e10, fetch: null != (i2 = this.fetch) ? i2 : fetch, urlLengthLimit: this.urlLengthLimit });
        }
        update(e10, { count: t10 } = {}) {
          var r10;
          let { url: n10, headers: s2 } = this.cloneRequestState();
          return t10 && s2.append("Prefer", `count=${t10}`), new t0({ method: "PATCH", url: n10, headers: s2, schema: this.schema, body: e10, fetch: null != (r10 = this.fetch) ? r10 : fetch, urlLengthLimit: this.urlLengthLimit });
        }
        delete({ count: e10 } = {}) {
          var t10;
          let { url: r10, headers: n10 } = this.cloneRequestState();
          return e10 && n10.append("Prefer", `count=${e10}`), new t0({ method: "DELETE", url: r10, headers: n10, schema: this.schema, fetch: null != (t10 = this.fetch) ? t10 : fetch, urlLengthLimit: this.urlLengthLimit });
        }
      };
      function t2(e10) {
        return (t2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function t3(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var n10 = Object.getOwnPropertySymbols(e10);
          t10 && (n10 = n10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, n10);
        }
        return r10;
      }
      function t4(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? t3(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var n10;
              (n10 = function(e12, t13) {
                if ("object" != t2(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var n11 = r12.call(e12, t13 || "default");
                  if ("object" != t2(n11)) return n11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == t2(n10) ? n10 : n10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : t3(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      var t6 = class e10 {
        constructor(e11, { headers: t10 = {}, schema: r10, fetch: n10, timeout: s2, urlLengthLimit: i2 = 8e3 } = {}) {
          this.url = e11, this.headers = new Headers(t10), this.schemaName = r10, this.urlLengthLimit = i2;
          const a2 = null != n10 ? n10 : globalThis.fetch;
          void 0 !== s2 && s2 > 0 ? this.fetch = (e12, t11) => {
            let r11 = new AbortController(), n11 = setTimeout(() => r11.abort(), s2), i3 = null == t11 ? void 0 : t11.signal;
            if (i3) {
              if (i3.aborted) return clearTimeout(n11), a2(e12, t11);
              let s3 = () => {
                clearTimeout(n11), r11.abort();
              };
              return i3.addEventListener("abort", s3, { once: true }), a2(e12, t4(t4({}, t11), {}, { signal: r11.signal })).finally(() => {
                clearTimeout(n11), i3.removeEventListener("abort", s3);
              });
            }
            return a2(e12, t4(t4({}, t11), {}, { signal: r11.signal })).finally(() => clearTimeout(n11));
          } : this.fetch = a2;
        }
        from(e11) {
          if (!e11 || "string" != typeof e11 || "" === e11.trim()) throw Error("Invalid relation name: relation must be a non-empty string.");
          return new t1(new URL(`${this.url}/${e11}`), { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit });
        }
        schema(t10) {
          return new e10(this.url, { headers: this.headers, schema: t10, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit });
        }
        rpc(e11, t10 = {}, { head: r10 = false, get: n10 = false, count: s2 } = {}) {
          var i2;
          let a2, o2, l2 = new URL(`${this.url}/rpc/${e11}`), u2 = (e12) => null !== e12 && "object" == typeof e12 && (!Array.isArray(e12) || e12.some(u2)), c2 = r10 && Object.values(t10).some(u2);
          c2 ? (a2 = "POST", o2 = t10) : r10 || n10 ? (a2 = r10 ? "HEAD" : "GET", Object.entries(t10).filter(([e12, t11]) => void 0 !== t11).map(([e12, t11]) => [e12, Array.isArray(t11) ? `{${t11.join(",")}}` : `${t11}`]).forEach(([e12, t11]) => {
            l2.searchParams.append(e12, t11);
          })) : (a2 = "POST", o2 = t10);
          let h2 = new Headers(this.headers);
          return c2 ? h2.set("Prefer", s2 ? `count=${s2},return=minimal` : "return=minimal") : s2 && h2.set("Prefer", `count=${s2}`), new t0({ method: a2, url: l2, headers: h2, schema: this.schemaName, body: o2, fetch: null != (i2 = this.fetch) ? i2 : fetch, urlLengthLimit: this.urlLengthLimit });
        }
      };
      let t5 = class {
        static detectEnvironment() {
          var t10;
          if ("u" > typeof WebSocket) return { type: "native", constructor: WebSocket };
          if ("u" > typeof globalThis && void 0 !== globalThis.WebSocket) return { type: "native", constructor: globalThis.WebSocket };
          if (void 0 !== e.g.WebSocket) return { type: "native", constructor: e.g.WebSocket };
          if ("u" > typeof globalThis && void 0 !== globalThis.WebSocketPair && void 0 === globalThis.WebSocket) return { type: "cloudflare", error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.", workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime." };
          if ("u" > typeof globalThis && globalThis.EdgeRuntime || "u" > typeof navigator && (null == (t10 = navigator.userAgent) ? void 0 : t10.includes("Vercel-Edge"))) return { type: "unsupported", error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.", workaround: "Use serverless functions or a different deployment target for WebSocket functionality." };
          let r10 = globalThis.process;
          if (r10) {
            let e10 = r10.versions;
            if (e10 && e10.node) {
              let t11 = parseInt(e10.node.replace(/^v/, "").split(".")[0]);
              return t11 >= 22 ? void 0 !== globalThis.WebSocket ? { type: "native", constructor: globalThis.WebSocket } : { type: "unsupported", error: `Node.js ${t11} detected but native WebSocket not found.`, workaround: "Provide a WebSocket implementation via the transport option." } : { type: "unsupported", error: `Node.js ${t11} detected without native WebSocket support.`, workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })' };
            }
          }
          return { type: "unsupported", error: "Unknown JavaScript runtime without WebSocket support.", workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation." };
        }
        static getWebSocketConstructor() {
          let e10 = this.detectEnvironment();
          if (e10.constructor) return e10.constructor;
          let t10 = e10.error || "WebSocket not supported in this environment.";
          throw e10.workaround && (t10 += `

Suggested solution: ${e10.workaround}`), Error(t10);
        }
        static createWebSocket(e10, t10) {
          return new (this.getWebSocketConstructor())(e10, t10);
        }
        static isWebSocketSupported() {
          try {
            let e10 = this.detectEnvironment();
            return "native" === e10.type || "ws" === e10.type;
          } catch (e10) {
            return false;
          }
        }
      }, t8 = "2.0.0";
      (G = es || (es = {}))[G.connecting = 0] = "connecting", G[G.open = 1] = "open", G[G.closing = 2] = "closing", G[G.closed = 3] = "closed", (J = ei || (ei = {})).closed = "closed", J.errored = "errored", J.joined = "joined", J.joining = "joining", J.leaving = "leaving", (X = ea || (ea = {})).close = "phx_close", X.error = "phx_error", X.join = "phx_join", X.reply = "phx_reply", X.leave = "phx_leave", X.access_token = "access_token", (eo || (eo = {})).websocket = "websocket", (Y = el || (el = {})).Connecting = "connecting", Y.Open = "open", Y.Closing = "closing", Y.Closed = "closed";
      class t9 {
        constructor(e10) {
          this.HEADER_LENGTH = 1, this.USER_BROADCAST_PUSH_META_LENGTH = 6, this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 }, this.BINARY_ENCODING = 0, this.JSON_ENCODING = 1, this.BROADCAST_EVENT = "broadcast", this.allowedMetadataKeys = [], this.allowedMetadataKeys = null != e10 ? e10 : [];
        }
        encode(e10, t10) {
          return e10.event !== this.BROADCAST_EVENT || e10.payload instanceof ArrayBuffer || "string" != typeof e10.payload.event ? t10(JSON.stringify([e10.join_ref, e10.ref, e10.topic, e10.event, e10.payload])) : t10(this._binaryEncodeUserBroadcastPush(e10));
        }
        _binaryEncodeUserBroadcastPush(e10) {
          var t10;
          return this._isArrayBuffer(null == (t10 = e10.payload) ? void 0 : t10.payload) ? this._encodeBinaryUserBroadcastPush(e10) : this._encodeJsonUserBroadcastPush(e10);
        }
        _encodeBinaryUserBroadcastPush(e10) {
          var t10, r10;
          let n10 = null != (r10 = null == (t10 = e10.payload) ? void 0 : t10.payload) ? r10 : new ArrayBuffer(0);
          return this._encodeUserBroadcastPush(e10, this.BINARY_ENCODING, n10);
        }
        _encodeJsonUserBroadcastPush(e10) {
          var t10, r10;
          let n10 = null != (r10 = null == (t10 = e10.payload) ? void 0 : t10.payload) ? r10 : {}, s2 = new TextEncoder().encode(JSON.stringify(n10)).buffer;
          return this._encodeUserBroadcastPush(e10, this.JSON_ENCODING, s2);
        }
        _encodeUserBroadcastPush(e10, t10, r10) {
          let n10 = e10.topic, s2 = null != (p2 = e10.ref) ? p2 : "", i2 = null != (f2 = e10.join_ref) ? f2 : "", a2 = e10.payload.event, o2 = this.allowedMetadataKeys ? this._pick(e10.payload, this.allowedMetadataKeys) : {}, l2 = 0 === Object.keys(o2).length ? "" : JSON.stringify(o2);
          if (i2.length > 255) throw Error(`joinRef length ${i2.length} exceeds maximum of 255`);
          if (s2.length > 255) throw Error(`ref length ${s2.length} exceeds maximum of 255`);
          if (n10.length > 255) throw Error(`topic length ${n10.length} exceeds maximum of 255`);
          if (a2.length > 255) throw Error(`userEvent length ${a2.length} exceeds maximum of 255`);
          if (l2.length > 255) throw Error(`metadata length ${l2.length} exceeds maximum of 255`);
          let u2 = this.USER_BROADCAST_PUSH_META_LENGTH + i2.length + s2.length + n10.length + a2.length + l2.length, c2 = new ArrayBuffer(this.HEADER_LENGTH + u2), h2 = new DataView(c2), d2 = 0;
          h2.setUint8(d2++, this.KINDS.userBroadcastPush), h2.setUint8(d2++, i2.length), h2.setUint8(d2++, s2.length), h2.setUint8(d2++, n10.length), h2.setUint8(d2++, a2.length), h2.setUint8(d2++, l2.length), h2.setUint8(d2++, t10), Array.from(i2, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(s2, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(n10, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(a2, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(l2, (e11) => h2.setUint8(d2++, e11.charCodeAt(0)));
          var p2, f2, g2 = new Uint8Array(c2.byteLength + r10.byteLength);
          return g2.set(new Uint8Array(c2), 0), g2.set(new Uint8Array(r10), c2.byteLength), g2.buffer;
        }
        decode(e10, t10) {
          if (this._isArrayBuffer(e10)) return t10(this._binaryDecode(e10));
          if ("string" == typeof e10) {
            let [r10, n10, s2, i2, a2] = JSON.parse(e10);
            return t10({ join_ref: r10, ref: n10, topic: s2, event: i2, payload: a2 });
          }
          return t10({});
        }
        _binaryDecode(e10) {
          let t10 = new DataView(e10), r10 = t10.getUint8(0), n10 = new TextDecoder();
          if (r10 === this.KINDS.userBroadcast) return this._decodeUserBroadcast(e10, t10, n10);
        }
        _decodeUserBroadcast(e10, t10, r10) {
          let n10 = t10.getUint8(1), s2 = t10.getUint8(2), i2 = t10.getUint8(3), a2 = t10.getUint8(4), o2 = this.HEADER_LENGTH + 4, l2 = r10.decode(e10.slice(o2, o2 + n10));
          o2 += n10;
          let u2 = r10.decode(e10.slice(o2, o2 + s2));
          o2 += s2;
          let c2 = r10.decode(e10.slice(o2, o2 + i2));
          o2 += i2;
          let h2 = e10.slice(o2, e10.byteLength), d2 = a2 === this.JSON_ENCODING ? JSON.parse(r10.decode(h2)) : h2, p2 = { type: this.BROADCAST_EVENT, event: u2, payload: d2 };
          return i2 > 0 && (p2.meta = JSON.parse(c2)), { join_ref: null, ref: null, topic: l2, event: this.BROADCAST_EVENT, payload: p2 };
        }
        _isArrayBuffer(e10) {
          var t10;
          return e10 instanceof ArrayBuffer || (null == (t10 = null == e10 ? void 0 : e10.constructor) ? void 0 : t10.name) === "ArrayBuffer";
        }
        _pick(e10, t10) {
          return e10 && "object" == typeof e10 ? Object.fromEntries(Object.entries(e10).filter(([e11]) => t10.includes(e11))) : {};
        }
      }
      class t7 {
        constructor(e10, t10) {
          this.callback = e10, this.timerCalc = t10, this.timer = void 0, this.tries = 0, this.callback = e10, this.timerCalc = t10;
        }
        reset() {
          this.tries = 0, clearTimeout(this.timer), this.timer = void 0;
        }
        scheduleTimeout() {
          clearTimeout(this.timer), this.timer = setTimeout(() => {
            this.tries = this.tries + 1, this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }
      (Q = eu || (eu = {})).abstime = "abstime", Q.bool = "bool", Q.date = "date", Q.daterange = "daterange", Q.float4 = "float4", Q.float8 = "float8", Q.int2 = "int2", Q.int4 = "int4", Q.int4range = "int4range", Q.int8 = "int8", Q.int8range = "int8range", Q.json = "json", Q.jsonb = "jsonb", Q.money = "money", Q.numeric = "numeric", Q.oid = "oid", Q.reltime = "reltime", Q.text = "text", Q.time = "time", Q.timestamp = "timestamp", Q.timestamptz = "timestamptz", Q.timetz = "timetz", Q.tsrange = "tsrange", Q.tstzrange = "tstzrange";
      let re = (e10, t10, r10 = {}) => {
        var n10;
        let s2 = null != (n10 = r10.skipTypes) ? n10 : [];
        return t10 ? Object.keys(t10).reduce((r11, n11) => (r11[n11] = rt(n11, e10, t10, s2), r11), {}) : {};
      }, rt = (e10, t10, r10, n10) => {
        let s2 = t10.find((t11) => t11.name === e10), i2 = null == s2 ? void 0 : s2.type, a2 = r10[e10];
        return i2 && !n10.includes(i2) ? rr(i2, a2) : rn(a2);
      }, rr = (e10, t10) => {
        if ("_" === e10.charAt(0)) return ro(t10, e10.slice(1, e10.length));
        switch (e10) {
          case eu.bool:
            return rs(t10);
          case eu.float4:
          case eu.float8:
          case eu.int2:
          case eu.int4:
          case eu.int8:
          case eu.numeric:
          case eu.oid:
            return ri(t10);
          case eu.json:
          case eu.jsonb:
            return ra(t10);
          case eu.timestamp:
            return rl(t10);
          case eu.abstime:
          case eu.date:
          case eu.daterange:
          case eu.int4range:
          case eu.int8range:
          case eu.money:
          case eu.reltime:
          case eu.text:
          case eu.time:
          case eu.timestamptz:
          case eu.timetz:
          case eu.tsrange:
          case eu.tstzrange:
          default:
            return rn(t10);
        }
      }, rn = (e10) => e10, rs = (e10) => {
        switch (e10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return e10;
        }
      }, ri = (e10) => {
        if ("string" == typeof e10) {
          let t10 = parseFloat(e10);
          if (!Number.isNaN(t10)) return t10;
        }
        return e10;
      }, ra = (e10) => {
        if ("string" == typeof e10) try {
          return JSON.parse(e10);
        } catch (e11) {
        }
        return e10;
      }, ro = (e10, t10) => {
        if ("string" != typeof e10) return e10;
        let r10 = e10.length - 1, n10 = e10[r10];
        if ("{" === e10[0] && "}" === n10) {
          let n11, s2 = e10.slice(1, r10);
          try {
            n11 = JSON.parse("[" + s2 + "]");
          } catch (e11) {
            n11 = s2 ? s2.split(",") : [];
          }
          return n11.map((e11) => rr(t10, e11));
        }
        return e10;
      }, rl = (e10) => "string" == typeof e10 ? e10.replace(" ", "T") : e10, ru = (e10) => {
        let t10 = new URL(e10);
        return t10.protocol = t10.protocol.replace(/^ws/i, "http"), t10.pathname = t10.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, ""), "" === t10.pathname || "/" === t10.pathname ? t10.pathname = "/api/broadcast" : t10.pathname = t10.pathname + "/api/broadcast", t10.href;
      };
      class rc {
        constructor(e10, t10, r10 = {}, n10 = 1e4) {
          this.channel = e10, this.event = t10, this.payload = r10, this.timeout = n10, this.sent = false, this.timeoutTimer = void 0, this.ref = "", this.receivedResp = null, this.recHooks = [], this.refEvent = null;
        }
        resend(e10) {
          this.timeout = e10, this._cancelRefEvent(), this.ref = "", this.refEvent = null, this.receivedResp = null, this.sent = false, this.send();
        }
        send() {
          this._hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload, ref: this.ref, join_ref: this.channel._joinRef() }));
        }
        updatePayload(e10) {
          this.payload = Object.assign(Object.assign({}, this.payload), e10);
        }
        receive(e10, t10) {
          var r10;
          return this._hasReceived(e10) && t10(null == (r10 = this.receivedResp) ? void 0 : r10.response), this.recHooks.push({ status: e10, callback: t10 }), this;
        }
        startTimeout() {
          if (this.timeoutTimer) return;
          this.ref = this.channel.socket._makeRef(), this.refEvent = this.channel._replyEventName(this.ref);
          let e10 = (e11) => {
            this._cancelRefEvent(), this._cancelTimeout(), this.receivedResp = e11, this._matchReceive(e11);
          };
          this.channel._on(this.refEvent, {}, e10), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout);
        }
        trigger(e10, t10) {
          this.refEvent && this.channel._trigger(this.refEvent, { status: e10, response: t10 });
        }
        destroy() {
          this._cancelRefEvent(), this._cancelTimeout();
        }
        _cancelRefEvent() {
          this.refEvent && this.channel._off(this.refEvent, {});
        }
        _cancelTimeout() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = void 0;
        }
        _matchReceive({ status: e10, response: t10 }) {
          this.recHooks.filter((t11) => t11.status === e10).forEach((e11) => e11.callback(t10));
        }
        _hasReceived(e10) {
          return this.receivedResp && this.receivedResp.status === e10;
        }
      }
      (Z = ec || (ec = {})).SYNC = "sync", Z.JOIN = "join", Z.LEAVE = "leave";
      class rh {
        constructor(e10, t10) {
          this.channel = e10, this.state = {}, this.pendingDiffs = [], this.joinRef = null, this.enabled = false, this.caller = { onJoin: () => {
          }, onLeave: () => {
          }, onSync: () => {
          } };
          const r10 = (null == t10 ? void 0 : t10.events) || { state: "presence_state", diff: "presence_diff" };
          this.channel._on(r10.state, {}, (e11) => {
            let { onJoin: t11, onLeave: r11, onSync: n10 } = this.caller;
            this.joinRef = this.channel._joinRef(), this.state = rh.syncState(this.state, e11, t11, r11), this.pendingDiffs.forEach((e12) => {
              this.state = rh.syncDiff(this.state, e12, t11, r11);
            }), this.pendingDiffs = [], n10();
          }), this.channel._on(r10.diff, {}, (e11) => {
            let { onJoin: t11, onLeave: r11, onSync: n10 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(e11) : (this.state = rh.syncDiff(this.state, e11, t11, r11), n10());
          }), this.onJoin((e11, t11, r11) => {
            this.channel._trigger("presence", { event: "join", key: e11, currentPresences: t11, newPresences: r11 });
          }), this.onLeave((e11, t11, r11) => {
            this.channel._trigger("presence", { event: "leave", key: e11, currentPresences: t11, leftPresences: r11 });
          }), this.onSync(() => {
            this.channel._trigger("presence", { event: "sync" });
          });
        }
        static syncState(e10, t10, r10, n10) {
          let s2 = this.cloneDeep(e10), i2 = this.transformState(t10), a2 = {}, o2 = {};
          return this.map(s2, (e11, t11) => {
            i2[e11] || (o2[e11] = t11);
          }), this.map(i2, (e11, t11) => {
            let r11 = s2[e11];
            if (r11) {
              let n11 = t11.map((e12) => e12.presence_ref), s3 = r11.map((e12) => e12.presence_ref), i3 = t11.filter((e12) => 0 > s3.indexOf(e12.presence_ref)), l2 = r11.filter((e12) => 0 > n11.indexOf(e12.presence_ref));
              i3.length > 0 && (a2[e11] = i3), l2.length > 0 && (o2[e11] = l2);
            } else a2[e11] = t11;
          }), this.syncDiff(s2, { joins: a2, leaves: o2 }, r10, n10);
        }
        static syncDiff(e10, t10, r10, n10) {
          let { joins: s2, leaves: i2 } = { joins: this.transformState(t10.joins), leaves: this.transformState(t10.leaves) };
          return r10 || (r10 = () => {
          }), n10 || (n10 = () => {
          }), this.map(s2, (t11, n11) => {
            var s3;
            let i3 = null != (s3 = e10[t11]) ? s3 : [];
            if (e10[t11] = this.cloneDeep(n11), i3.length > 0) {
              let r11 = e10[t11].map((e11) => e11.presence_ref), n12 = i3.filter((e11) => 0 > r11.indexOf(e11.presence_ref));
              e10[t11].unshift(...n12);
            }
            r10(t11, i3, n11);
          }), this.map(i2, (t11, r11) => {
            let s3 = e10[t11];
            if (!s3) return;
            let i3 = r11.map((e11) => e11.presence_ref);
            s3 = s3.filter((e11) => 0 > i3.indexOf(e11.presence_ref)), e10[t11] = s3, n10(t11, s3, r11), 0 === s3.length && delete e10[t11];
          }), e10;
        }
        static map(e10, t10) {
          return Object.getOwnPropertyNames(e10).map((r10) => t10(r10, e10[r10]));
        }
        static transformState(e10) {
          return Object.getOwnPropertyNames(e10 = this.cloneDeep(e10)).reduce((t10, r10) => {
            let n10 = e10[r10];
            return "metas" in n10 ? t10[r10] = n10.metas.map((e11) => (e11.presence_ref = e11.phx_ref, delete e11.phx_ref, delete e11.phx_ref_prev, e11)) : t10[r10] = n10, t10;
          }, {});
        }
        static cloneDeep(e10) {
          return JSON.parse(JSON.stringify(e10));
        }
        onJoin(e10) {
          this.caller.onJoin = e10;
        }
        onLeave(e10) {
          this.caller.onLeave = e10;
        }
        onSync(e10) {
          this.caller.onSync = e10;
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel._joinRef();
        }
      }
      (ee = eh || (eh = {})).ALL = "*", ee.INSERT = "INSERT", ee.UPDATE = "UPDATE", ee.DELETE = "DELETE", (et = ed || (ed = {})).BROADCAST = "broadcast", et.PRESENCE = "presence", et.POSTGRES_CHANGES = "postgres_changes", et.SYSTEM = "system", (er = ep || (ep = {})).SUBSCRIBED = "SUBSCRIBED", er.TIMED_OUT = "TIMED_OUT", er.CLOSED = "CLOSED", er.CHANNEL_ERROR = "CHANNEL_ERROR";
      class rd {
        constructor(e10, t10 = { config: {} }, r10) {
          var n10, s2;
          if (this.topic = e10, this.params = t10, this.socket = r10, this.bindings = {}, this.state = ei.closed, this.joinedOnce = false, this.pushBuffer = [], this.subTopic = e10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, t10.config), this.timeout = this.socket.timeout, this.joinPush = new rc(this, ea.join, this.params, this.timeout), this.rejoinTimer = new t7(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs), this.joinPush.receive("ok", () => {
            this.state = ei.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((e11) => e11.send()), this.pushBuffer = [];
          }), this._onClose(() => {
            this.rejoinTimer.reset(), this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`), this.state = ei.closed, this.socket._remove(this);
          }), this._onError((e11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, e11), this.state = ei.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("timeout", () => {
            this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), this.state = ei.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("error", (e11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, e11), this.state = ei.errored, this.rejoinTimer.scheduleTimeout());
          }), this._on(ea.reply, {}, (e11, t11) => {
            this._trigger(this._replyEventName(t11), e11);
          }), this.presence = new rh(this), this.broadcastEndpointURL = ru(this.socket.endPoint), this.private = this.params.config.private || false, !this.private && (null == (s2 = null == (n10 = this.params.config) ? void 0 : n10.broadcast) ? void 0 : s2.replay)) throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
        }
        subscribe(e10, t10 = this.timeout) {
          var r10, n10, s2;
          if (this.socket.isConnected() || this.socket.connect(), this.state == ei.closed) {
            let { config: { broadcast: i2, presence: a2, private: o2 } } = this.params, l2 = null != (n10 = null == (r10 = this.bindings.postgres_changes) ? void 0 : r10.map((e11) => e11.filter)) ? n10 : [], u2 = !!this.bindings[ed.PRESENCE] && this.bindings[ed.PRESENCE].length > 0 || (null == (s2 = this.params.config.presence) ? void 0 : s2.enabled) === true, c2 = {}, h2 = { broadcast: i2, presence: Object.assign(Object.assign({}, a2), { enabled: u2 }), postgres_changes: l2, private: o2 };
            this.socket.accessTokenValue && (c2.access_token = this.socket.accessTokenValue), this._onError((t11) => null == e10 ? void 0 : e10(ep.CHANNEL_ERROR, t11)), this._onClose(() => null == e10 ? void 0 : e10(ep.CLOSED)), this.updateJoinPayload(Object.assign({ config: h2 }, c2)), this.joinedOnce = true, this._rejoin(t10), this.joinPush.receive("ok", async ({ postgres_changes: t11 }) => {
              var r11;
              if (this.socket._isManualToken() || this.socket.setAuth(), void 0 === t11) {
                null == e10 || e10(ep.SUBSCRIBED);
                return;
              }
              {
                let n11 = this.bindings.postgres_changes, s3 = null != (r11 = null == n11 ? void 0 : n11.length) ? r11 : 0, i3 = [];
                for (let r12 = 0; r12 < s3; r12++) {
                  let s4 = n11[r12], { filter: { event: a3, schema: o3, table: l3, filter: u3 } } = s4, c3 = t11 && t11[r12];
                  if (c3 && c3.event === a3 && rd.isFilterValueEqual(c3.schema, o3) && rd.isFilterValueEqual(c3.table, l3) && rd.isFilterValueEqual(c3.filter, u3)) i3.push(Object.assign(Object.assign({}, s4), { id: c3.id }));
                  else {
                    this.unsubscribe(), this.state = ei.errored, null == e10 || e10(ep.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
                    return;
                  }
                }
                this.bindings.postgres_changes = i3, e10 && e10(ep.SUBSCRIBED);
                return;
              }
            }).receive("error", (t11) => {
              this.state = ei.errored, null == e10 || e10(ep.CHANNEL_ERROR, Error(JSON.stringify(Object.values(t11).join(", ") || "error")));
            }).receive("timeout", () => {
              null == e10 || e10(ep.TIMED_OUT);
            });
          }
          return this;
        }
        presenceState() {
          return this.presence.state;
        }
        async track(e10, t10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: e10 }, t10.timeout || this.timeout);
        }
        async untrack(e10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, e10);
        }
        on(e10, t10, r10) {
          return this.state === ei.joined && e10 === ed.PRESENCE && (this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`), this.unsubscribe().then(async () => await this.subscribe())), this._on(e10, t10, r10);
        }
        async httpSend(e10, t10, r10 = {}) {
          var n10;
          if (null == t10) return Promise.reject("Payload is required for httpSend()");
          let s2 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" };
          this.socket.accessTokenValue && (s2.Authorization = `Bearer ${this.socket.accessTokenValue}`);
          let i2 = { method: "POST", headers: s2, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: e10, payload: t10, private: this.private }] }) }, a2 = await this._fetchWithTimeout(this.broadcastEndpointURL, i2, null != (n10 = r10.timeout) ? n10 : this.timeout);
          if (202 === a2.status) return { success: true };
          let o2 = a2.statusText;
          try {
            let e11 = await a2.json();
            o2 = e11.error || e11.message || o2;
          } catch (e11) {
          }
          return Promise.reject(Error(o2));
        }
        async send(e10, t10 = {}) {
          var r10, n10;
          if (this._canPush() || "broadcast" !== e10.type) return new Promise((r11) => {
            var n11, s2, i2;
            let a2 = this._push(e10.type, e10, t10.timeout || this.timeout);
            "broadcast" !== e10.type || (null == (i2 = null == (s2 = null == (n11 = this.params) ? void 0 : n11.config) ? void 0 : s2.broadcast) ? void 0 : i2.ack) || r11("ok"), a2.receive("ok", () => r11("ok")), a2.receive("error", () => r11("error")), a2.receive("timeout", () => r11("timed out"));
          });
          {
            console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
            let { event: s2, payload: i2 } = e10, a2 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" };
            this.socket.accessTokenValue && (a2.Authorization = `Bearer ${this.socket.accessTokenValue}`);
            let o2 = { method: "POST", headers: a2, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: s2, payload: i2, private: this.private }] }) };
            try {
              let e11 = await this._fetchWithTimeout(this.broadcastEndpointURL, o2, null != (r10 = t10.timeout) ? r10 : this.timeout);
              return await (null == (n10 = e11.body) ? void 0 : n10.cancel()), e11.ok ? "ok" : "error";
            } catch (e11) {
              if ("AbortError" === e11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(e10) {
          this.joinPush.updatePayload(e10);
        }
        unsubscribe(e10 = this.timeout) {
          this.state = ei.leaving;
          let t10 = () => {
            this.socket.log("channel", `leave ${this.topic}`), this._trigger(ea.close, "leave", this._joinRef());
          };
          this.joinPush.destroy();
          let r10 = null;
          return new Promise((n10) => {
            (r10 = new rc(this, ea.leave, {}, e10)).receive("ok", () => {
              t10(), n10("ok");
            }).receive("timeout", () => {
              t10(), n10("timed out");
            }).receive("error", () => {
              n10("error");
            }), r10.send(), this._canPush() || r10.trigger("ok", {});
          }).finally(() => {
            null == r10 || r10.destroy();
          });
        }
        teardown() {
          this.pushBuffer.forEach((e10) => e10.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = ei.closed, this.bindings = {};
        }
        async _fetchWithTimeout(e10, t10, r10) {
          let n10 = new AbortController(), s2 = setTimeout(() => n10.abort(), r10), i2 = await this.socket.fetch(e10, Object.assign(Object.assign({}, t10), { signal: n10.signal }));
          return clearTimeout(s2), i2;
        }
        _push(e10, t10, r10 = this.timeout) {
          if (!this.joinedOnce) throw `tried to push '${e10}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
          let n10 = new rc(this, e10, t10, r10);
          return this._canPush() ? n10.send() : this._addToPushBuffer(n10), n10;
        }
        _addToPushBuffer(e10) {
          if (e10.startTimeout(), this.pushBuffer.push(e10), this.pushBuffer.length > 100) {
            let e11 = this.pushBuffer.shift();
            e11 && (e11.destroy(), this.socket.log("channel", `discarded push due to buffer overflow: ${e11.event}`, e11.payload));
          }
        }
        _onMessage(e10, t10, r10) {
          return t10;
        }
        _isMember(e10) {
          return this.topic === e10;
        }
        _joinRef() {
          return this.joinPush.ref;
        }
        _trigger(e10, t10, r10) {
          var n10, s2;
          let i2 = e10.toLocaleLowerCase(), { close: a2, error: o2, leave: l2, join: u2 } = ea;
          if (r10 && [a2, o2, l2, u2].indexOf(i2) >= 0 && r10 !== this._joinRef()) return;
          let c2 = this._onMessage(i2, t10, r10);
          if (t10 && !c2) throw "channel onMessage callbacks must return the payload, modified or unmodified";
          ["insert", "update", "delete"].includes(i2) ? null == (n10 = this.bindings.postgres_changes) || n10.filter((e11) => {
            var t11, r11, n11;
            return (null == (t11 = e11.filter) ? void 0 : t11.event) === "*" || (null == (n11 = null == (r11 = e11.filter) ? void 0 : r11.event) ? void 0 : n11.toLocaleLowerCase()) === i2;
          }).map((e11) => e11.callback(c2, r10)) : null == (s2 = this.bindings[i2]) || s2.filter((e11) => {
            var r11, n11, s3, a3, o3, l3;
            if (!["broadcast", "presence", "postgres_changes"].includes(i2)) return e11.type.toLocaleLowerCase() === i2;
            if ("id" in e11) {
              let i3 = e11.id, a4 = null == (r11 = e11.filter) ? void 0 : r11.event;
              return i3 && (null == (n11 = t10.ids) ? void 0 : n11.includes(i3)) && ("*" === a4 || (null == a4 ? void 0 : a4.toLocaleLowerCase()) === (null == (s3 = t10.data) ? void 0 : s3.type.toLocaleLowerCase()));
            }
            {
              let r12 = null == (o3 = null == (a3 = null == e11 ? void 0 : e11.filter) ? void 0 : a3.event) ? void 0 : o3.toLocaleLowerCase();
              return "*" === r12 || r12 === (null == (l3 = null == t10 ? void 0 : t10.event) ? void 0 : l3.toLocaleLowerCase());
            }
          }).map((e11) => {
            if ("object" == typeof c2 && "ids" in c2) {
              let e12 = c2.data, { schema: t11, table: r11, commit_timestamp: n11, type: s3, errors: i3 } = e12;
              c2 = Object.assign(Object.assign({}, { schema: t11, table: r11, commit_timestamp: n11, eventType: s3, new: {}, old: {}, errors: i3 }), this._getPayloadRecords(e12));
            }
            e11.callback(c2, r10);
          });
        }
        _isClosed() {
          return this.state === ei.closed;
        }
        _isJoined() {
          return this.state === ei.joined;
        }
        _isJoining() {
          return this.state === ei.joining;
        }
        _isLeaving() {
          return this.state === ei.leaving;
        }
        _replyEventName(e10) {
          return `chan_reply_${e10}`;
        }
        _on(e10, t10, r10) {
          let n10 = e10.toLocaleLowerCase(), s2 = { type: n10, filter: t10, callback: r10 };
          return this.bindings[n10] ? this.bindings[n10].push(s2) : this.bindings[n10] = [s2], this;
        }
        _off(e10, t10) {
          let r10 = e10.toLocaleLowerCase();
          return this.bindings[r10] && (this.bindings[r10] = this.bindings[r10].filter((e11) => {
            var n10;
            return !((null == (n10 = e11.type) ? void 0 : n10.toLocaleLowerCase()) === r10 && rd.isEqual(e11.filter, t10));
          })), this;
        }
        static isEqual(e10, t10) {
          if (Object.keys(e10).length !== Object.keys(t10).length) return false;
          for (let r10 in e10) if (e10[r10] !== t10[r10]) return false;
          return true;
        }
        static isFilterValueEqual(e10, t10) {
          return (null != e10 ? e10 : void 0) === (null != t10 ? t10 : void 0);
        }
        _rejoinUntilConnected() {
          this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin();
        }
        _onClose(e10) {
          this._on(ea.close, {}, e10);
        }
        _onError(e10) {
          this._on(ea.error, {}, (t10) => e10(t10));
        }
        _canPush() {
          return this.socket.isConnected() && this._isJoined();
        }
        _rejoin(e10 = this.timeout) {
          this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), this.state = ei.joining, this.joinPush.resend(e10));
        }
        _getPayloadRecords(e10) {
          let t10 = { new: {}, old: {} };
          return ("INSERT" === e10.type || "UPDATE" === e10.type) && (t10.new = re(e10.columns, e10.record)), ("UPDATE" === e10.type || "DELETE" === e10.type) && (t10.old = re(e10.columns, e10.old_record)), t10;
        }
      }
      let rp = () => {
      }, rf = [1e3, 2e3, 5e3, 1e4], rg = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class rm {
        constructor(e10, t10) {
          var r10;
          if (this.accessTokenValue = null, this.apiKey = null, this._manuallySetToken = false, this.channels = [], this.endPoint = "", this.httpEndpoint = "", this.headers = {}, this.params = {}, this.timeout = 1e4, this.transport = null, this.heartbeatIntervalMs = 25e3, this.heartbeatTimer = void 0, this.pendingHeartbeatRef = null, this.heartbeatCallback = rp, this.ref = 0, this.reconnectTimer = null, this.vsn = t8, this.logger = rp, this.conn = null, this.sendBuffer = [], this.serializer = new t9(), this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.accessToken = null, this._connectionState = "disconnected", this._wasManualDisconnect = false, this._authPromise = null, this._heartbeatSentAt = null, this._resolveFetch = (e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12), !(null == (r10 = null == t10 ? void 0 : t10.params) ? void 0 : r10.apikey)) throw Error("API key is required to connect to Realtime");
          this.apiKey = t10.params.apikey, this.endPoint = `${e10}/${eo.websocket}`, this.httpEndpoint = ru(e10), this._initializeOptions(t10), this._setupReconnectionTimer(), this.fetch = this._resolveFetch(null == t10 ? void 0 : t10.fetch);
        }
        connect() {
          if (!(this.isConnecting() || this.isDisconnecting() || null !== this.conn && this.isConnected())) {
            if (this._setConnectionState("connecting"), this.accessToken && !this._authPromise && this._setAuthSafely("connect"), this.transport) this.conn = new this.transport(this.endpointURL());
            else try {
              this.conn = t5.createWebSocket(this.endpointURL());
            } catch (t10) {
              this._setConnectionState("disconnected");
              let e10 = t10.message;
              if (e10.includes("Node.js")) throw Error(`${e10}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
              throw Error(`WebSocket not available: ${e10}`);
            }
            this._setupConnectionHandlers();
          }
        }
        endpointURL() {
          return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: this.vsn }));
        }
        disconnect(e10, t10) {
          if (!this.isDisconnecting()) if (this._setConnectionState("disconnecting", true), this.conn) {
            let r10 = setTimeout(() => {
              this._setConnectionState("disconnected");
            }, 100);
            this.conn.onclose = () => {
              clearTimeout(r10), this._setConnectionState("disconnected");
            }, "function" == typeof this.conn.close && (e10 ? this.conn.close(e10, null != t10 ? t10 : "") : this.conn.close()), this._teardownConnection();
          } else this._setConnectionState("disconnected");
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(e10) {
          let t10 = await e10.unsubscribe();
          return 0 === this.channels.length && this.disconnect(), t10;
        }
        async removeAllChannels() {
          let e10 = await Promise.all(this.channels.map((e11) => e11.unsubscribe()));
          return this.channels = [], this.disconnect(), e10;
        }
        log(e10, t10, r10) {
          this.logger(e10, t10, r10);
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case es.connecting:
              return el.Connecting;
            case es.open:
              return el.Open;
            case es.closing:
              return el.Closing;
            default:
              return el.Closed;
          }
        }
        isConnected() {
          return this.connectionState() === el.Open;
        }
        isConnecting() {
          return "connecting" === this._connectionState;
        }
        isDisconnecting() {
          return "disconnecting" === this._connectionState;
        }
        channel(e10, t10 = { config: {} }) {
          let r10 = `realtime:${e10}`, n10 = this.getChannels().find((e11) => e11.topic === r10);
          if (n10) return n10;
          {
            let r11 = new rd(`realtime:${e10}`, t10, this);
            return this.channels.push(r11), r11;
          }
        }
        push(e10) {
          let { topic: t10, event: r10, payload: n10, ref: s2 } = e10, i2 = () => {
            this.encode(e10, (e11) => {
              var t11;
              null == (t11 = this.conn) || t11.send(e11);
            });
          };
          this.log("push", `${t10} ${r10} (${s2})`, n10), this.isConnected() ? i2() : this.sendBuffer.push(i2);
        }
        async setAuth(e10 = null) {
          this._authPromise = this._performAuth(e10);
          try {
            await this._authPromise;
          } finally {
            this._authPromise = null;
          }
        }
        _isManualToken() {
          return this._manuallySetToken;
        }
        async sendHeartbeat() {
          var e10;
          if (!this.isConnected()) {
            try {
              this.heartbeatCallback("disconnected");
            } catch (e11) {
              this.log("error", "error in heartbeat callback", e11);
            }
            return;
          }
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this._heartbeatSentAt = null, this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            try {
              this.heartbeatCallback("timeout");
            } catch (e11) {
              this.log("error", "error in heartbeat callback", e11);
            }
            this._wasManualDisconnect = false, null == (e10 = this.conn) || e10.close(1e3, "heartbeat timeout"), setTimeout(() => {
              var e11;
              this.isConnected() || null == (e11 = this.reconnectTimer) || e11.scheduleTimeout();
            }, 100);
            return;
          }
          this._heartbeatSentAt = Date.now(), this.pendingHeartbeatRef = this._makeRef(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
          try {
            this.heartbeatCallback("sent");
          } catch (e11) {
            this.log("error", "error in heartbeat callback", e11);
          }
          this._setAuthSafely("heartbeat");
        }
        onHeartbeat(e10) {
          this.heartbeatCallback = e10;
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e10) => e10()), this.sendBuffer = []);
        }
        _makeRef() {
          let e10 = this.ref + 1;
          return e10 === this.ref ? this.ref = 0 : this.ref = e10, this.ref.toString();
        }
        _leaveOpenTopic(e10) {
          let t10 = this.channels.find((t11) => t11.topic === e10 && (t11._isJoined() || t11._isJoining()));
          t10 && (this.log("transport", `leaving duplicate topic "${e10}"`), t10.unsubscribe());
        }
        _remove(e10) {
          this.channels = this.channels.filter((t10) => t10.topic !== e10.topic);
        }
        _onConnMessage(e10) {
          this.decode(e10.data, (e11) => {
            if ("phoenix" === e11.topic && "phx_reply" === e11.event && e11.ref && e11.ref === this.pendingHeartbeatRef) {
              let t11 = this._heartbeatSentAt ? Date.now() - this._heartbeatSentAt : void 0;
              try {
                this.heartbeatCallback("ok" === e11.payload.status ? "ok" : "error", t11);
              } catch (e12) {
                this.log("error", "error in heartbeat callback", e12);
              }
              this._heartbeatSentAt = null, this.pendingHeartbeatRef = null;
            }
            let { topic: t10, event: r10, payload: n10, ref: s2 } = e11, i2 = s2 ? `(${s2})` : "", a2 = n10.status || "";
            this.log("receive", `${a2} ${t10} ${r10} ${i2}`.trim(), n10), this.channels.filter((e12) => e12._isMember(t10)).forEach((e12) => e12._trigger(r10, n10, s2)), this._triggerStateCallbacks("message", e11);
          });
        }
        _clearTimer(e10) {
          var t10;
          "heartbeat" === e10 && this.heartbeatTimer ? (clearInterval(this.heartbeatTimer), this.heartbeatTimer = void 0) : "reconnect" === e10 && (null == (t10 = this.reconnectTimer) || t10.reset());
        }
        _clearAllTimers() {
          this._clearTimer("heartbeat"), this._clearTimer("reconnect");
        }
        _setupConnectionHandlers() {
          this.conn && ("binaryType" in this.conn && (this.conn.binaryType = "arraybuffer"), this.conn.onopen = () => this._onConnOpen(), this.conn.onerror = (e10) => this._onConnError(e10), this.conn.onmessage = (e10) => this._onConnMessage(e10), this.conn.onclose = (e10) => this._onConnClose(e10), this.conn.readyState === es.open && this._onConnOpen());
        }
        _teardownConnection() {
          if (this.conn) {
            if (this.conn.readyState === es.open || this.conn.readyState === es.connecting) try {
              this.conn.close();
            } catch (e10) {
              this.log("error", "Error closing connection", e10);
            }
            this.conn.onopen = null, this.conn.onerror = null, this.conn.onmessage = null, this.conn.onclose = null, this.conn = null;
          }
          this._clearAllTimers(), this._terminateWorker(), this.channels.forEach((e10) => e10.teardown());
        }
        _onConnOpen() {
          this._setConnectionState("connected"), this.log("transport", `connected to ${this.endpointURL()}`), (this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).then(() => {
            this.flushSendBuffer();
          }).catch((e10) => {
            this.log("error", "error waiting for auth on connect", e10), this.flushSendBuffer();
          }), this._clearTimer("reconnect"), this.worker ? this.workerRef || this._startWorkerHeartbeat() : this._startHeartbeat(), this._triggerStateCallbacks("open");
        }
        _startHeartbeat() {
          this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let e10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(e10), this.workerRef.onerror = (e11) => {
            this.log("worker", "worker error", e11.message), this._terminateWorker();
          }, this.workerRef.onmessage = (e11) => {
            "keepAlive" === e11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _terminateWorker() {
          this.workerRef && (this.log("worker", "terminating worker"), this.workerRef.terminate(), this.workerRef = void 0);
        }
        _onConnClose(e10) {
          var t10;
          this._setConnectionState("disconnected"), this.log("transport", "close", e10), this._triggerChanError(), this._clearTimer("heartbeat"), this._wasManualDisconnect || null == (t10 = this.reconnectTimer) || t10.scheduleTimeout(), this._triggerStateCallbacks("close", e10);
        }
        _onConnError(e10) {
          this._setConnectionState("disconnected"), this.log("transport", `${e10}`), this._triggerChanError(), this._triggerStateCallbacks("error", e10);
          try {
            this.heartbeatCallback("error");
          } catch (e11) {
            this.log("error", "error in heartbeat callback", e11);
          }
        }
        _triggerChanError() {
          this.channels.forEach((e10) => e10._trigger(ea.error));
        }
        _appendParams(e10, t10) {
          if (0 === Object.keys(t10).length) return e10;
          let r10 = e10.match(/\?/) ? "&" : "?", n10 = new URLSearchParams(t10);
          return `${e10}${r10}${n10}`;
        }
        _workerObjectUrl(e10) {
          let t10;
          if (e10) t10 = e10;
          else {
            let e11 = new Blob([rg], { type: "application/javascript" });
            t10 = URL.createObjectURL(e11);
          }
          return t10;
        }
        _setConnectionState(e10, t10 = false) {
          this._connectionState = e10, "connecting" === e10 ? this._wasManualDisconnect = false : "disconnecting" === e10 && (this._wasManualDisconnect = t10);
        }
        async _performAuth(e10 = null) {
          let t10, r10 = false;
          if (e10) t10 = e10, r10 = true;
          else if (this.accessToken) try {
            t10 = await this.accessToken();
          } catch (e11) {
            this.log("error", "Error fetching access token from callback", e11), t10 = this.accessTokenValue;
          }
          else t10 = this.accessTokenValue;
          r10 ? this._manuallySetToken = true : this.accessToken && (this._manuallySetToken = false), this.accessTokenValue != t10 && (this.accessTokenValue = t10, this.channels.forEach((e11) => {
            let r11 = { access_token: t10, version: "realtime-js/2.94.0" };
            t10 && e11.updateJoinPayload(r11), e11.joinedOnce && e11._isJoined() && e11._push(ea.access_token, { access_token: t10 });
          }));
        }
        async _waitForAuthIfNeeded() {
          this._authPromise && await this._authPromise;
        }
        _setAuthSafely(e10 = "general") {
          this._isManualToken() || this.setAuth().catch((t10) => {
            this.log("error", `Error setting auth in ${e10}`, t10);
          });
        }
        _triggerStateCallbacks(e10, t10) {
          try {
            this.stateChangeCallbacks[e10].forEach((r10) => {
              try {
                r10(t10);
              } catch (t11) {
                this.log("error", `error in ${e10} callback`, t11);
              }
            });
          } catch (t11) {
            this.log("error", `error triggering ${e10} callbacks`, t11);
          }
        }
        _setupReconnectionTimer() {
          this.reconnectTimer = new t7(async () => {
            setTimeout(async () => {
              await this._waitForAuthIfNeeded(), this.isConnected() || this.connect();
            }, 10);
          }, this.reconnectAfterMs);
        }
        _initializeOptions(e10) {
          var t10, r10, n10, s2, i2, a2, o2, l2, u2, c2, h2, d2;
          switch (this.transport = null != (t10 = null == e10 ? void 0 : e10.transport) ? t10 : null, this.timeout = null != (r10 = null == e10 ? void 0 : e10.timeout) ? r10 : 1e4, this.heartbeatIntervalMs = null != (n10 = null == e10 ? void 0 : e10.heartbeatIntervalMs) ? n10 : 25e3, this.worker = null != (s2 = null == e10 ? void 0 : e10.worker) && s2, this.accessToken = null != (i2 = null == e10 ? void 0 : e10.accessToken) ? i2 : null, this.heartbeatCallback = null != (a2 = null == e10 ? void 0 : e10.heartbeatCallback) ? a2 : rp, this.vsn = null != (o2 = null == e10 ? void 0 : e10.vsn) ? o2 : t8, (null == e10 ? void 0 : e10.params) && (this.params = e10.params), (null == e10 ? void 0 : e10.logger) && (this.logger = e10.logger), ((null == e10 ? void 0 : e10.logLevel) || (null == e10 ? void 0 : e10.log_level)) && (this.logLevel = e10.logLevel || e10.log_level, this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel })), this.reconnectAfterMs = null != (l2 = null == e10 ? void 0 : e10.reconnectAfterMs) ? l2 : (e11) => rf[e11 - 1] || 1e4, this.vsn) {
            case "1.0.0":
              this.encode = null != (u2 = null == e10 ? void 0 : e10.encode) ? u2 : (e11, t11) => t11(JSON.stringify(e11)), this.decode = null != (c2 = null == e10 ? void 0 : e10.decode) ? c2 : (e11, t11) => t11(JSON.parse(e11));
              break;
            case t8:
              this.encode = null != (h2 = null == e10 ? void 0 : e10.encode) ? h2 : this.serializer.encode.bind(this.serializer), this.decode = null != (d2 = null == e10 ? void 0 : e10.decode) ? d2 : this.serializer.decode.bind(this.serializer);
              break;
            default:
              throw Error(`Unsupported serializer version: ${this.vsn}`);
          }
          this.worker && (this.workerUrl = null == e10 ? void 0 : e10.workerUrl);
        }
      }
      var ry = class extends Error {
        constructor(e10, t10) {
          super(e10), this.name = "IcebergError", this.status = t10.status, this.icebergType = t10.icebergType, this.icebergCode = t10.icebergCode, this.details = t10.details, this.isCommitStateUnknown = "CommitStateUnknownException" === t10.icebergType || [500, 502, 504].includes(t10.status) && t10.icebergType?.includes("CommitState") === true;
        }
        isNotFound() {
          return 404 === this.status;
        }
        isConflict() {
          return 409 === this.status;
        }
        isAuthenticationTimeout() {
          return 419 === this.status;
        }
      };
      async function rb(e10) {
        return e10 && "none" !== e10.type ? "bearer" === e10.type ? { Authorization: `Bearer ${e10.token}` } : "header" === e10.type ? { [e10.name]: e10.value } : "custom" === e10.type ? await e10.getHeaders() : {} : {};
      }
      function rw(e10) {
        return e10.join("");
      }
      var rv = class {
        constructor(e10, t10 = "") {
          this.client = e10, this.prefix = t10;
        }
        async listNamespaces(e10) {
          let t10 = e10 ? { parent: rw(e10.namespace) } : void 0;
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces`, query: t10 })).data.namespaces.map((e11) => ({ namespace: e11 }));
        }
        async createNamespace(e10, t10) {
          let r10 = { namespace: e10.namespace, properties: t10?.properties };
          return (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces`, body: r10 })).data;
        }
        async dropNamespace(e10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${rw(e10.namespace)}` });
        }
        async loadNamespaceMetadata(e10) {
          return { properties: (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${rw(e10.namespace)}` })).data.properties };
        }
        async namespaceExists(e10) {
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${rw(e10.namespace)}` }), true;
          } catch (e11) {
            if (e11 instanceof ry && 404 === e11.status) return false;
            throw e11;
          }
        }
        async createNamespaceIfNotExists(e10, t10) {
          try {
            return await this.createNamespace(e10, t10);
          } catch (e11) {
            if (e11 instanceof ry && 409 === e11.status) return;
            throw e11;
          }
        }
      };
      function r_(e10) {
        return e10.join("");
      }
      var rS = class {
        constructor(e10, t10 = "", r10) {
          this.client = e10, this.prefix = t10, this.accessDelegation = r10;
        }
        async listTables(e10) {
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${r_(e10.namespace)}/tables` })).data.identifiers;
        }
        async createTable(e10, t10) {
          let r10 = {};
          return this.accessDelegation && (r10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${r_(e10.namespace)}/tables`, body: t10, headers: r10 })).data.metadata;
        }
        async updateTable(e10, t10) {
          let r10 = await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${r_(e10.namespace)}/tables/${e10.name}`, body: t10 });
          return { "metadata-location": r10.data["metadata-location"], metadata: r10.data.metadata };
        }
        async dropTable(e10, t10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${r_(e10.namespace)}/tables/${e10.name}`, query: { purgeRequested: String(t10?.purge ?? false) } });
        }
        async loadTable(e10) {
          let t10 = {};
          return this.accessDelegation && (t10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${r_(e10.namespace)}/tables/${e10.name}`, headers: t10 })).data.metadata;
        }
        async tableExists(e10) {
          let t10 = {};
          this.accessDelegation && (t10["X-Iceberg-Access-Delegation"] = this.accessDelegation);
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${r_(e10.namespace)}/tables/${e10.name}`, headers: t10 }), true;
          } catch (e11) {
            if (e11 instanceof ry && 404 === e11.status) return false;
            throw e11;
          }
        }
        async createTableIfNotExists(e10, t10) {
          try {
            return await this.createTable(e10, t10);
          } catch (r10) {
            if (r10 instanceof ry && 409 === r10.status) return await this.loadTable({ namespace: e10.namespace, name: t10.name });
            throw r10;
          }
        }
      }, rk = class {
        constructor(e10) {
          let t10 = "v1";
          e10.catalogName && (t10 += `/${e10.catalogName}`);
          const r10 = e10.baseUrl.endsWith("/") ? e10.baseUrl : `${e10.baseUrl}/`;
          this.client = function(e11) {
            let t11 = e11.fetchImpl ?? globalThis.fetch;
            return { async request({ method: r11, path: n10, query: s2, body: i2, headers: a2 }) {
              let o2 = function(e12, t12, r12) {
                let n11 = new URL(t12, e12);
                if (r12) for (let [e13, t13] of Object.entries(r12)) void 0 !== t13 && n11.searchParams.set(e13, t13);
                return n11.toString();
              }(e11.baseUrl, n10, s2), l2 = await rb(e11.auth), u2 = await t11(o2, { method: r11, headers: { ...i2 ? { "Content-Type": "application/json" } : {}, ...l2, ...a2 }, body: i2 ? JSON.stringify(i2) : void 0 }), c2 = await u2.text(), h2 = (u2.headers.get("content-type") || "").includes("application/json"), d2 = h2 && c2 ? JSON.parse(c2) : c2;
              if (!u2.ok) {
                let e12 = h2 ? d2 : void 0, t12 = e12?.error;
                throw new ry(t12?.message ?? `Request failed with status ${u2.status}`, { status: u2.status, icebergType: t12?.type, icebergCode: t12?.code, details: e12 });
              }
              return { status: u2.status, headers: u2.headers, data: d2 };
            } };
          }({ baseUrl: r10, auth: e10.auth, fetchImpl: e10.fetch }), this.accessDelegation = e10.accessDelegation?.join(","), this.namespaceOps = new rv(this.client, t10), this.tableOps = new rS(this.client, t10, this.accessDelegation);
        }
        async listNamespaces(e10) {
          return this.namespaceOps.listNamespaces(e10);
        }
        async createNamespace(e10, t10) {
          return this.namespaceOps.createNamespace(e10, t10);
        }
        async dropNamespace(e10) {
          await this.namespaceOps.dropNamespace(e10);
        }
        async loadNamespaceMetadata(e10) {
          return this.namespaceOps.loadNamespaceMetadata(e10);
        }
        async listTables(e10) {
          return this.tableOps.listTables(e10);
        }
        async createTable(e10, t10) {
          return this.tableOps.createTable(e10, t10);
        }
        async updateTable(e10, t10) {
          return this.tableOps.updateTable(e10, t10);
        }
        async dropTable(e10, t10) {
          await this.tableOps.dropTable(e10, t10);
        }
        async loadTable(e10) {
          return this.tableOps.loadTable(e10);
        }
        async namespaceExists(e10) {
          return this.namespaceOps.namespaceExists(e10);
        }
        async tableExists(e10) {
          return this.tableOps.tableExists(e10);
        }
        async createNamespaceIfNotExists(e10, t10) {
          return this.namespaceOps.createNamespaceIfNotExists(e10, t10);
        }
        async createTableIfNotExists(e10, t10) {
          return this.tableOps.createTableIfNotExists(e10, t10);
        }
      }, rE = class extends Error {
        constructor(e10, t10 = "storage", r10, n10) {
          super(e10), this.__isStorageError = true, this.namespace = t10, this.name = "vectors" === t10 ? "StorageVectorsError" : "StorageError", this.status = r10, this.statusCode = n10;
        }
      };
      function rT(e10) {
        return "object" == typeof e10 && null !== e10 && "__isStorageError" in e10;
      }
      var rR = class extends rE {
        constructor(e10, t10, r10, n10 = "storage") {
          super(e10, n10, t10, r10), this.name = "vectors" === n10 ? "StorageVectorsApiError" : "StorageApiError", this.status = t10, this.statusCode = r10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      }, rO = class extends rE {
        constructor(e10, t10, r10 = "storage") {
          super(e10, r10), this.name = "vectors" === r10 ? "StorageVectorsUnknownError" : "StorageUnknownError", this.originalError = t10;
        }
      };
      let rx = (e10) => {
        if (Array.isArray(e10)) return e10.map((e11) => rx(e11));
        if ("function" == typeof e10 || e10 !== Object(e10)) return e10;
        let t10 = {};
        return Object.entries(e10).forEach(([e11, r10]) => {
          t10[e11.replace(/([-_][a-z])/gi, (e12) => e12.toUpperCase().replace(/[-_]/g, ""))] = rx(r10);
        }), t10;
      };
      function rC(e10) {
        return (rC = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function rA(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var n10 = Object.getOwnPropertySymbols(e10);
          t10 && (n10 = n10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, n10);
        }
        return r10;
      }
      function rP(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? rA(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var n10;
              (n10 = function(e12, t13) {
                if ("object" != rC(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var n11 = r12.call(e12, t13 || "default");
                  if ("object" != rC(n11)) return n11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == rC(n10) ? n10 : n10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : rA(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      let rj = (e10) => {
        var t10;
        return e10.msg || e10.message || e10.error_description || ("string" == typeof e10.error ? e10.error : null == (t10 = e10.error) ? void 0 : t10.message) || JSON.stringify(e10);
      }, rI = async (e10, t10, r10, n10) => {
        if (e10 && "object" == typeof e10 && "status" in e10 && "ok" in e10 && "number" == typeof e10.status && !(null == r10 ? void 0 : r10.noResolveJson)) {
          let r11 = e10.status || 500;
          "function" == typeof e10.json ? e10.json().then((e11) => {
            let s2 = (null == e11 ? void 0 : e11.statusCode) || (null == e11 ? void 0 : e11.code) || r11 + "";
            t10(new rR(rj(e11), r11, s2, n10));
          }).catch(() => {
            t10(new rR(e10.statusText || `HTTP ${r11} error`, r11, r11 + "", n10));
          }) : t10(new rR(e10.statusText || `HTTP ${r11} error`, r11, r11 + "", n10));
        } else t10(new rO(rj(e10), e10, n10));
      };
      async function r$(e10, t10, r10, n10, s2, i2, a2) {
        return new Promise((o2, l2) => {
          let u2;
          e10(r10, (u2 = { method: t10, headers: (null == n10 ? void 0 : n10.headers) || {} }, "GET" === t10 || "HEAD" === t10 || !i2 || (((e11) => {
            if ("object" != typeof e11 || null === e11) return false;
            let t11 = Object.getPrototypeOf(e11);
            return (null === t11 || t11 === Object.prototype || null === Object.getPrototypeOf(t11)) && !(Symbol.toStringTag in e11) && !(Symbol.iterator in e11);
          })(i2) ? (u2.headers = rP({ "Content-Type": "application/json" }, null == n10 ? void 0 : n10.headers), u2.body = JSON.stringify(i2)) : u2.body = i2, (null == n10 ? void 0 : n10.duplex) && (u2.duplex = n10.duplex)), rP(rP({}, u2), s2))).then((e11) => {
            if (!e11.ok) throw e11;
            if (null == n10 ? void 0 : n10.noResolveJson) return e11;
            if ("vectors" === a2) {
              let t11 = e11.headers.get("content-type");
              if ("0" === e11.headers.get("content-length") || 204 === e11.status || !t11 || !t11.includes("application/json")) return {};
            }
            return e11.json();
          }).then((e11) => o2(e11)).catch((e11) => rI(e11, l2, n10, a2));
        });
      }
      function rN(e10 = "storage") {
        return { get: async (t10, r10, n10, s2) => r$(t10, "GET", r10, n10, s2, void 0, e10), post: async (t10, r10, n10, s2, i2) => r$(t10, "POST", r10, s2, i2, n10, e10), put: async (t10, r10, n10, s2, i2) => r$(t10, "PUT", r10, s2, i2, n10, e10), head: async (t10, r10, n10, s2) => r$(t10, "HEAD", r10, rP(rP({}, n10), {}, { noResolveJson: true }), s2, void 0, e10), remove: async (t10, r10, n10, s2, i2) => r$(t10, "DELETE", r10, s2, i2, n10, e10) };
      }
      let { get: rU, post: rL, put: rD, head: rq, remove: rB } = rN("storage"), rM = rN("vectors");
      var rW = class {
        constructor(e10, t10 = {}, r10, n10 = "storage") {
          this.shouldThrowOnError = false, this.url = e10, this.headers = t10, this.fetch = /* @__PURE__ */ ((e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12))(r10), this.namespace = n10;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        async handleOperation(e10) {
          try {
            return { data: await e10(), error: null };
          } catch (e11) {
            if (this.shouldThrowOnError) throw e11;
            if (rT(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }, rH = class {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10;
        }
        then(e10, t10) {
          return this.execute().then(e10, t10);
        }
        async execute() {
          try {
            return { data: (await this.downloadFn()).body, error: null };
          } catch (e10) {
            if (this.shouldThrowOnError) throw e10;
            if (rT(e10)) return { data: null, error: e10 };
            throw e10;
          }
        }
      };
      r = Symbol.toStringTag;
      var rz = class {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10, this[r] = "BlobDownloadBuilder", this.promise = null;
        }
        asStream() {
          return new rH(this.downloadFn, this.shouldThrowOnError);
        }
        then(e10, t10) {
          return this.getPromise().then(e10, t10);
        }
        catch(e10) {
          return this.getPromise().catch(e10);
        }
        finally(e10) {
          return this.getPromise().finally(e10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        async execute() {
          try {
            return { data: await (await this.downloadFn()).blob(), error: null };
          } catch (e10) {
            if (this.shouldThrowOnError) throw e10;
            if (rT(e10)) return { data: null, error: e10 };
            throw e10;
          }
        }
      };
      let rV = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, rK = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      var rF = class extends rW {
        constructor(e10, t10 = {}, r10, n10) {
          super(e10, t10, n10, "storage"), this.bucketId = r10;
        }
        async uploadOrUpdate(e10, t10, r10, n10) {
          var s2 = this;
          return s2.handleOperation(async () => {
            let i2, a2 = rP(rP({}, rK), n10), o2 = rP(rP({}, s2.headers), "POST" === e10 && { "x-upsert": String(a2.upsert) }), l2 = a2.metadata;
            "u" > typeof Blob && r10 instanceof Blob ? ((i2 = new FormData()).append("cacheControl", a2.cacheControl), l2 && i2.append("metadata", s2.encodeMetadata(l2)), i2.append("", r10)) : "u" > typeof FormData && r10 instanceof FormData ? ((i2 = r10).has("cacheControl") || i2.append("cacheControl", a2.cacheControl), l2 && !i2.has("metadata") && i2.append("metadata", s2.encodeMetadata(l2))) : (i2 = r10, o2["cache-control"] = `max-age=${a2.cacheControl}`, o2["content-type"] = a2.contentType, l2 && (o2["x-metadata"] = s2.toBase64(s2.encodeMetadata(l2))), ("u" > typeof ReadableStream && i2 instanceof ReadableStream || i2 && "object" == typeof i2 && "pipe" in i2 && "function" == typeof i2.pipe) && !a2.duplex && (a2.duplex = "half")), (null == n10 ? void 0 : n10.headers) && (o2 = rP(rP({}, o2), n10.headers));
            let u2 = s2._removeEmptyFolders(t10), c2 = s2._getFinalPath(u2), h2 = await ("PUT" == e10 ? rD : rL)(s2.fetch, `${s2.url}/object/${c2}`, i2, rP({ headers: o2 }, (null == a2 ? void 0 : a2.duplex) ? { duplex: a2.duplex } : {}));
            return { path: u2, id: h2.Id, fullPath: h2.Key };
          });
        }
        async upload(e10, t10, r10) {
          return this.uploadOrUpdate("POST", e10, t10, r10);
        }
        async uploadToSignedUrl(e10, t10, r10, n10) {
          var s2 = this;
          let i2 = s2._removeEmptyFolders(e10), a2 = s2._getFinalPath(i2), o2 = new URL(s2.url + `/object/upload/sign/${a2}`);
          return o2.searchParams.set("token", t10), s2.handleOperation(async () => {
            let e11, t11 = rP({ upsert: rK.upsert }, n10), a3 = rP(rP({}, s2.headers), { "x-upsert": String(t11.upsert) });
            return "u" > typeof Blob && r10 instanceof Blob ? ((e11 = new FormData()).append("cacheControl", t11.cacheControl), e11.append("", r10)) : "u" > typeof FormData && r10 instanceof FormData ? (e11 = r10).append("cacheControl", t11.cacheControl) : (e11 = r10, a3["cache-control"] = `max-age=${t11.cacheControl}`, a3["content-type"] = t11.contentType), { path: i2, fullPath: (await rD(s2.fetch, o2.toString(), e11, { headers: a3 })).Key };
          });
        }
        async createSignedUploadUrl(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => {
            let n10 = r10._getFinalPath(e10), s2 = rP({}, r10.headers);
            (null == t10 ? void 0 : t10.upsert) && (s2["x-upsert"] = "true");
            let i2 = await rL(r10.fetch, `${r10.url}/object/upload/sign/${n10}`, {}, { headers: s2 }), a2 = new URL(r10.url + i2.url), o2 = a2.searchParams.get("token");
            if (!o2) throw new rE("No token returned by API");
            return { signedUrl: a2.toString(), path: e10, token: o2 };
          });
        }
        async update(e10, t10, r10) {
          return this.uploadOrUpdate("PUT", e10, t10, r10);
        }
        async move(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => await rL(n10.fetch, `${n10.url}/object/move`, { bucketId: n10.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: n10.headers }));
        }
        async copy(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => ({ path: (await rL(n10.fetch, `${n10.url}/object/copy`, { bucketId: n10.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: n10.headers })).Key }));
        }
        async createSignedUrl(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => {
            let s2 = n10._getFinalPath(e10), i2 = await rL(n10.fetch, `${n10.url}/object/sign/${s2}`, rP({ expiresIn: t10 }, (null == r10 ? void 0 : r10.transform) ? { transform: r10.transform } : {}), { headers: n10.headers }), a2 = (null == r10 ? void 0 : r10.download) ? `&download=${true === r10.download ? "" : r10.download}` : "";
            return { signedUrl: encodeURI(`${n10.url}${i2.signedURL}${a2}`) };
          });
        }
        async createSignedUrls(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => {
            let s2 = await rL(n10.fetch, `${n10.url}/object/sign/${n10.bucketId}`, { expiresIn: t10, paths: e10 }, { headers: n10.headers }), i2 = (null == r10 ? void 0 : r10.download) ? `&download=${true === r10.download ? "" : r10.download}` : "";
            return s2.map((e11) => rP(rP({}, e11), {}, { signedUrl: e11.signedURL ? encodeURI(`${n10.url}${e11.signedURL}${i2}`) : null }));
          });
        }
        download(e10, t10) {
          let r10 = void 0 !== (null == t10 ? void 0 : t10.transform) ? "render/image/authenticated" : "object", n10 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {}), s2 = n10 ? `?${n10}` : "", i2 = this._getFinalPath(e10);
          return new rz(() => rU(this.fetch, `${this.url}/${r10}/${i2}${s2}`, { headers: this.headers, noResolveJson: true }), this.shouldThrowOnError);
        }
        async info(e10) {
          var t10 = this;
          let r10 = t10._getFinalPath(e10);
          return t10.handleOperation(async () => rx(await rU(t10.fetch, `${t10.url}/object/info/${r10}`, { headers: t10.headers })));
        }
        async exists(e10) {
          let t10 = this._getFinalPath(e10);
          try {
            return await rq(this.fetch, `${this.url}/object/${t10}`, { headers: this.headers }), { data: true, error: null };
          } catch (e11) {
            if (this.shouldThrowOnError) throw e11;
            if (rT(e11) && e11 instanceof rO) {
              let t11 = e11.originalError;
              if ([400, 404].includes(null == t11 ? void 0 : t11.status)) return { data: false, error: e11 };
            }
            throw e11;
          }
        }
        getPublicUrl(e10, t10) {
          let r10 = this._getFinalPath(e10), n10 = [], s2 = (null == t10 ? void 0 : t10.download) ? `download=${true === t10.download ? "" : t10.download}` : "";
          "" !== s2 && n10.push(s2);
          let i2 = void 0 !== (null == t10 ? void 0 : t10.transform) ? "render/image" : "object", a2 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {});
          "" !== a2 && n10.push(a2);
          let o2 = n10.join("&");
          return "" !== o2 && (o2 = `?${o2}`), { data: { publicUrl: encodeURI(`${this.url}/${i2}/public/${r10}${o2}`) } };
        }
        async remove(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rB(t10.fetch, `${t10.url}/object/${t10.bucketId}`, { prefixes: e10 }, { headers: t10.headers }));
        }
        async list(e10, t10, r10) {
          var n10 = this;
          return n10.handleOperation(async () => {
            let s2 = rP(rP(rP({}, rV), t10), {}, { prefix: e10 || "" });
            return await rL(n10.fetch, `${n10.url}/object/list/${n10.bucketId}`, s2, { headers: n10.headers }, r10);
          });
        }
        async listV2(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => {
            let n10 = rP({}, e10);
            return await rL(r10.fetch, `${r10.url}/object/list-v2/${r10.bucketId}`, n10, { headers: r10.headers }, t10);
          });
        }
        encodeMetadata(e10) {
          return JSON.stringify(e10);
        }
        toBase64(e10) {
          return void 0 !== tu.Buffer ? tu.Buffer.from(e10).toString("base64") : btoa(e10);
        }
        _getFinalPath(e10) {
          return `${this.bucketId}/${e10.replace(/^\/+/, "")}`;
        }
        _removeEmptyFolders(e10) {
          return e10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        transformOptsToQueryString(e10) {
          let t10 = [];
          return e10.width && t10.push(`width=${e10.width}`), e10.height && t10.push(`height=${e10.height}`), e10.resize && t10.push(`resize=${e10.resize}`), e10.format && t10.push(`format=${e10.format}`), e10.quality && t10.push(`quality=${e10.quality}`), t10.join("&");
        }
      };
      let rG = { "X-Client-Info": "storage-js/2.94.0" };
      var rJ = class extends rW {
        constructor(e10, t10 = {}, r10, n10) {
          const s2 = new URL(e10);
          (null == n10 ? void 0 : n10.useNewHostname) && /supabase\.(co|in|red)$/.test(s2.hostname) && !s2.hostname.includes("storage.supabase.") && (s2.hostname = s2.hostname.replace("supabase.", "storage.supabase.")), super(s2.href.replace(/\/$/, ""), rP(rP({}, rG), t10), r10, "storage");
        }
        async listBuckets(e10) {
          var t10 = this;
          return t10.handleOperation(async () => {
            let r10 = t10.listBucketOptionsToQueryString(e10);
            return await rU(t10.fetch, `${t10.url}/bucket${r10}`, { headers: t10.headers });
          });
        }
        async getBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rU(t10.fetch, `${t10.url}/bucket/${e10}`, { headers: t10.headers }));
        }
        async createBucket(e10, t10 = { public: false }) {
          var r10 = this;
          return r10.handleOperation(async () => await rL(r10.fetch, `${r10.url}/bucket`, { id: e10, name: e10, type: t10.type, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: r10.headers }));
        }
        async updateBucket(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await rD(r10.fetch, `${r10.url}/bucket/${e10}`, { id: e10, name: e10, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: r10.headers }));
        }
        async emptyBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rL(t10.fetch, `${t10.url}/bucket/${e10}/empty`, {}, { headers: t10.headers }));
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rB(t10.fetch, `${t10.url}/bucket/${e10}`, {}, { headers: t10.headers }));
        }
        listBucketOptionsToQueryString(e10) {
          let t10 = {};
          return e10 && ("limit" in e10 && (t10.limit = String(e10.limit)), "offset" in e10 && (t10.offset = String(e10.offset)), e10.search && (t10.search = e10.search), e10.sortColumn && (t10.sortColumn = e10.sortColumn), e10.sortOrder && (t10.sortOrder = e10.sortOrder)), Object.keys(t10).length > 0 ? "?" + new URLSearchParams(t10).toString() : "";
        }
      }, rX = class extends rW {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rP(rP({}, rG), t10), r10, "storage");
        }
        async createBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rL(t10.fetch, `${t10.url}/bucket`, { name: e10 }, { headers: t10.headers }));
        }
        async listBuckets(e10) {
          var t10 = this;
          return t10.handleOperation(async () => {
            let r10 = new URLSearchParams();
            (null == e10 ? void 0 : e10.limit) !== void 0 && r10.set("limit", e10.limit.toString()), (null == e10 ? void 0 : e10.offset) !== void 0 && r10.set("offset", e10.offset.toString()), (null == e10 ? void 0 : e10.sortColumn) && r10.set("sortColumn", e10.sortColumn), (null == e10 ? void 0 : e10.sortOrder) && r10.set("sortOrder", e10.sortOrder), (null == e10 ? void 0 : e10.search) && r10.set("search", e10.search);
            let n10 = r10.toString(), s2 = n10 ? `${t10.url}/bucket?${n10}` : `${t10.url}/bucket`;
            return await rU(t10.fetch, s2, { headers: t10.headers });
          });
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rB(t10.fetch, `${t10.url}/bucket/${e10}`, {}, { headers: t10.headers }));
        }
        from(e10) {
          var t10 = this;
          if (!(!(!e10 || "string" != typeof e10 || 0 === e10.length || e10.length > 100 || e10.trim() !== e10 || e10.includes("/") || e10.includes("\\")) && /^[\w!.\*'() &$@=;:+,?-]+$/.test(e10))) throw new rE("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
          let r10 = new rk({ baseUrl: this.url, catalogName: e10, auth: { type: "custom", getHeaders: async () => t10.headers }, fetch: this.fetch }), n10 = this.shouldThrowOnError;
          return new Proxy(r10, { get(e11, t11) {
            let r11 = e11[t11];
            return "function" != typeof r11 ? r11 : async (...t12) => {
              try {
                return { data: await r11.apply(e11, t12), error: null };
              } catch (e12) {
                if (n10) throw e12;
                return { data: null, error: e12 };
              }
            };
          } });
        }
      }, rY = class extends rW {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rP(rP({}, rG), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async createIndex(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/CreateIndex`, e10, { headers: t10.headers }) || {});
        }
        async getIndex(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await rM.post(r10.fetch, `${r10.url}/GetIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: r10.headers }));
        }
        async listIndexes(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/ListIndexes`, e10, { headers: t10.headers }));
        }
        async deleteIndex(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await rM.post(r10.fetch, `${r10.url}/DeleteIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: r10.headers }) || {});
        }
      }, rQ = class extends rW {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rP(rP({}, rG), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async putVectors(e10) {
          var t10 = this;
          if (e10.vectors.length < 1 || e10.vectors.length > 500) throw Error("Vector batch size must be between 1 and 500 items");
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/PutVectors`, e10, { headers: t10.headers }) || {});
        }
        async getVectors(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/GetVectors`, e10, { headers: t10.headers }));
        }
        async listVectors(e10) {
          var t10 = this;
          if (void 0 !== e10.segmentCount) {
            if (e10.segmentCount < 1 || e10.segmentCount > 16) throw Error("segmentCount must be between 1 and 16");
            if (void 0 !== e10.segmentIndex && (e10.segmentIndex < 0 || e10.segmentIndex >= e10.segmentCount)) throw Error(`segmentIndex must be between 0 and ${e10.segmentCount - 1}`);
          }
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/ListVectors`, e10, { headers: t10.headers }));
        }
        async queryVectors(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/QueryVectors`, e10, { headers: t10.headers }));
        }
        async deleteVectors(e10) {
          var t10 = this;
          if (e10.keys.length < 1 || e10.keys.length > 500) throw Error("Keys batch size must be between 1 and 500 items");
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/DeleteVectors`, e10, { headers: t10.headers }) || {});
        }
      }, rZ = class extends rW {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rP(rP({}, rG), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async createBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/CreateVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }) || {});
        }
        async getBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/GetVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }));
        }
        async listBuckets(e10 = {}) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/ListVectorBuckets`, e10, { headers: t10.headers }));
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await rM.post(t10.fetch, `${t10.url}/DeleteVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }) || {});
        }
      }, r0 = class extends rZ {
        constructor(e10, t10 = {}) {
          super(e10, t10.headers || {}, t10.fetch);
        }
        from(e10) {
          return new r1(this.url, this.headers, e10, this.fetch);
        }
        async createBucket(e10) {
          return super.createBucket.call(this, e10);
        }
        async getBucket(e10) {
          return super.getBucket.call(this, e10);
        }
        async listBuckets(e10 = {}) {
          return super.listBuckets.call(this, e10);
        }
        async deleteBucket(e10) {
          return super.deleteBucket.call(this, e10);
        }
      }, r1 = class extends rY {
        constructor(e10, t10, r10, n10) {
          super(e10, t10, n10), this.vectorBucketName = r10;
        }
        async createIndex(e10) {
          return super.createIndex.call(this, rP(rP({}, e10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async listIndexes(e10 = {}) {
          return super.listIndexes.call(this, rP(rP({}, e10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async getIndex(e10) {
          return super.getIndex.call(this, this.vectorBucketName, e10);
        }
        async deleteIndex(e10) {
          return super.deleteIndex.call(this, this.vectorBucketName, e10);
        }
        index(e10) {
          return new r2(this.url, this.headers, this.vectorBucketName, e10, this.fetch);
        }
      }, r2 = class extends rQ {
        constructor(e10, t10, r10, n10, s2) {
          super(e10, t10, s2), this.vectorBucketName = r10, this.indexName = n10;
        }
        async putVectors(e10) {
          return super.putVectors.call(this, rP(rP({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async getVectors(e10) {
          return super.getVectors.call(this, rP(rP({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async listVectors(e10 = {}) {
          return super.listVectors.call(this, rP(rP({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async queryVectors(e10) {
          return super.queryVectors.call(this, rP(rP({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async deleteVectors(e10) {
          return super.deleteVectors.call(this, rP(rP({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
      }, r3 = class extends rJ {
        constructor(e10, t10 = {}, r10, n10) {
          super(e10, t10, r10, n10);
        }
        from(e10) {
          return new rF(this.url, this.headers, e10, this.fetch);
        }
        get vectors() {
          return new r0(this.url + "/vector", { headers: this.headers, fetch: this.fetch });
        }
        get analytics() {
          return new rX(this.url + "/iceberg", this.headers, this.fetch);
        }
      };
      let r4 = "2.94.0", r6 = { "X-Client-Info": `gotrue-js/${r4}` }, r5 = "X-Supabase-Api-Version", r8 = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, r9 = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class r7 extends Error {
        constructor(e10, t10, r10) {
          super(e10), this.__isAuthError = true, this.name = "AuthError", this.status = t10, this.code = r10;
        }
      }
      function ne(e10) {
        return "object" == typeof e10 && null !== e10 && "__isAuthError" in e10;
      }
      class nt extends r7 {
        constructor(e10, t10, r10) {
          super(e10, t10, r10), this.name = "AuthApiError", this.status = t10, this.code = r10;
        }
      }
      class nr extends r7 {
        constructor(e10, t10) {
          super(e10), this.name = "AuthUnknownError", this.originalError = t10;
        }
      }
      class nn extends r7 {
        constructor(e10, t10, r10, n10) {
          super(e10, r10, n10), this.name = t10, this.status = r10;
        }
      }
      class ns extends nn {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      function ni(e10) {
        return ne(e10) && "AuthSessionMissingError" === e10.name;
      }
      class na extends nn {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class no extends nn {
        constructor(e10) {
          super(e10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class nl extends nn {
        constructor(e10, t10 = null) {
          super(e10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class nu extends nn {
        constructor() {
          super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
        }
      }
      class nc extends nn {
        constructor(e10, t10) {
          super(e10, "AuthRetryableFetchError", t10, void 0);
        }
      }
      function nh(e10) {
        return ne(e10) && "AuthRetryableFetchError" === e10.name;
      }
      class nd extends nn {
        constructor(e10, t10, r10) {
          super(e10, "AuthWeakPasswordError", t10, "weak_password"), this.reasons = r10;
        }
      }
      class np extends nn {
        constructor(e10) {
          super(e10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let nf = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), ng = " 	\n\r=".split(""), nm = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < ng.length; t10 += 1) e10[ng[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < nf.length; t10 += 1) e10[nf[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function ny(e10, t10, r10) {
        if (null !== e10) for (t10.queue = t10.queue << 8 | e10, t10.queuedBits += 8; t10.queuedBits >= 6; ) r10(nf[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
        else if (t10.queuedBits > 0) for (t10.queue = t10.queue << 6 - t10.queuedBits, t10.queuedBits = 6; t10.queuedBits >= 6; ) r10(nf[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
      }
      function nb(e10, t10, r10) {
        let n10 = nm[e10];
        if (n10 > -1) for (t10.queue = t10.queue << 6 | n10, t10.queuedBits += 6; t10.queuedBits >= 8; ) r10(t10.queue >> t10.queuedBits - 8 & 255), t10.queuedBits -= 8;
        else if (-2 === n10) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e10)}"`);
      }
      function nw(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, n10 = { utf8seq: 0, codepoint: 0 }, s2 = { queue: 0, queuedBits: 0 }, i2 = (e11) => {
          !function(e12, t11, r11) {
            if (0 === t11.utf8seq) {
              if (e12 <= 127) return r11(e12);
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e12 >> 7 - r12 & 1) == 0) {
                t11.utf8seq = r12;
                break;
              }
              if (2 === t11.utf8seq) t11.codepoint = 31 & e12;
              else if (3 === t11.utf8seq) t11.codepoint = 15 & e12;
              else if (4 === t11.utf8seq) t11.codepoint = 7 & e12;
              else throw Error("Invalid UTF-8 sequence");
              t11.utf8seq -= 1;
            } else if (t11.utf8seq > 0) {
              if (e12 <= 127) throw Error("Invalid UTF-8 sequence");
              t11.codepoint = t11.codepoint << 6 | 63 & e12, t11.utf8seq -= 1, 0 === t11.utf8seq && r11(t11.codepoint);
            }
          }(e11, n10, r10);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) nb(e10.charCodeAt(t11), s2, i2);
        return t10.join("");
      }
      function nv(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, n10 = (e11) => {
          t10.push(e11);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) nb(e10.charCodeAt(t11), r10, n10);
        return new Uint8Array(t10);
      }
      function n_(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, n10 = (e11) => {
          t10.push(e11);
        };
        return e10.forEach((e11) => ny(e11, r10, n10)), ny(null, r10, n10), t10.join("");
      }
      let nS = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), nk = async (e10, t10, r10) => {
        await e10.setItem(t10, JSON.stringify(r10));
      }, nE = async (e10, t10) => {
        let r10 = await e10.getItem(t10);
        if (!r10) return null;
        try {
          return JSON.parse(r10);
        } catch (e11) {
          return r10;
        }
      }, nT = async (e10, t10) => {
        await e10.removeItem(t10);
      };
      class nR {
        constructor() {
          this.promise = new nR.promiseConstructor((e10, t10) => {
            this.resolve = e10, this.reject = t10;
          });
        }
      }
      function nO(e10) {
        let t10 = e10.split(".");
        if (3 !== t10.length) throw new np("Invalid JWT structure");
        for (let e11 = 0; e11 < t10.length; e11++) if (!r9.test(t10[e11])) throw new np("JWT not in base64url format");
        return { header: JSON.parse(nw(t10[0])), payload: JSON.parse(nw(t10[1])), signature: nv(t10[2]), raw: { header: t10[0], payload: t10[1] } };
      }
      async function nx(e10) {
        return await new Promise((t10) => {
          setTimeout(() => t10(null), e10);
        });
      }
      function nC(e10) {
        return ("0" + e10.toString(16)).substr(-2);
      }
      async function nA(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => String.fromCharCode(e11)).join("");
      }
      async function nP(e10) {
        return "u" > typeof crypto && void 0 !== crypto.subtle && "u" > typeof TextEncoder ? btoa(await nA(e10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), e10);
      }
      async function nj(e10, t10, r10 = false) {
        let n10 = function() {
          let e11 = new Uint32Array(56);
          if ("u" < typeof crypto) {
            let e12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", t11 = e12.length, r11 = "";
            for (let n11 = 0; n11 < 56; n11++) r11 += e12.charAt(Math.floor(Math.random() * t11));
            return r11;
          }
          return crypto.getRandomValues(e11), Array.from(e11, nC).join("");
        }(), s2 = n10;
        r10 && (s2 += "/PASSWORD_RECOVERY"), await nk(e10, `${t10}-code-verifier`, s2);
        let i2 = await nP(n10), a2 = n10 === i2 ? "plain" : "s256";
        return [i2, a2];
      }
      nR.promiseConstructor = Promise;
      let nI = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, n$ = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function nN(e10) {
        if (!n$.test(e10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      function nU() {
        return new Proxy({}, { get: (e10, t10) => {
          if ("__isUserNotAvailableProxy" === t10) return true;
          if ("symbol" == typeof t10) {
            let e11 = t10.toString();
            if ("Symbol(Symbol.toPrimitive)" === e11 || "Symbol(Symbol.toStringTag)" === e11 || "Symbol(util.inspect.custom)" === e11) return;
          }
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t10}" property of the session object is not supported. Please use getUser() instead.`);
        }, set: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }, deleteProperty: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        } });
      }
      function nL(e10) {
        return JSON.parse(JSON.stringify(e10));
      }
      let nD = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10), nq = [502, 503, 504];
      async function nB(e10) {
        var t10;
        let r10, n10;
        if (!("object" == typeof e10 && null !== e10 && "status" in e10 && "ok" in e10 && "json" in e10 && "function" == typeof e10.json)) throw new nc(nD(e10), 0);
        if (nq.includes(e10.status)) throw new nc(nD(e10), e10.status);
        try {
          r10 = await e10.json();
        } catch (e11) {
          throw new nr(nD(e11), e11);
        }
        let s2 = function(e11) {
          let t11 = e11.headers.get(r5);
          if (!t11 || !t11.match(nI)) return null;
          try {
            return /* @__PURE__ */ new Date(`${t11}T00:00:00.0Z`);
          } catch (e12) {
            return null;
          }
        }(e10);
        if (s2 && s2.getTime() >= r8["2024-01-01"].timestamp && "object" == typeof r10 && r10 && "string" == typeof r10.code ? n10 = r10.code : "object" == typeof r10 && r10 && "string" == typeof r10.error_code && (n10 = r10.error_code), n10) {
          if ("weak_password" === n10) throw new nd(nD(r10), e10.status, (null == (t10 = r10.weak_password) ? void 0 : t10.reasons) || []);
          else if ("session_not_found" === n10) throw new ns();
        } else if ("object" == typeof r10 && r10 && "object" == typeof r10.weak_password && r10.weak_password && Array.isArray(r10.weak_password.reasons) && r10.weak_password.reasons.length && r10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true)) throw new nd(nD(r10), e10.status, r10.weak_password.reasons);
        throw new nt(nD(r10), e10.status || 500, n10);
      }
      async function nM(e10, t10, r10, n10) {
        var s2;
        let i2 = Object.assign({}, null == n10 ? void 0 : n10.headers);
        i2[r5] || (i2[r5] = r8["2024-01-01"].name), (null == n10 ? void 0 : n10.jwt) && (i2.Authorization = `Bearer ${n10.jwt}`);
        let a2 = null != (s2 = null == n10 ? void 0 : n10.query) ? s2 : {};
        (null == n10 ? void 0 : n10.redirectTo) && (a2.redirect_to = n10.redirectTo);
        let o2 = Object.keys(a2).length ? "?" + new URLSearchParams(a2).toString() : "", l2 = await nW(e10, t10, r10 + o2, { headers: i2, noResolveJson: null == n10 ? void 0 : n10.noResolveJson }, {}, null == n10 ? void 0 : n10.body);
        return (null == n10 ? void 0 : n10.xform) ? null == n10 ? void 0 : n10.xform(l2) : { data: Object.assign({}, l2), error: null };
      }
      async function nW(e10, t10, r10, n10, s2, i2) {
        let a2, o2, l2 = (o2 = { method: t10, headers: (null == n10 ? void 0 : n10.headers) || {} }, "GET" === t10 ? o2 : (o2.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == n10 ? void 0 : n10.headers), o2.body = JSON.stringify(i2), Object.assign(Object.assign({}, o2), s2)));
        try {
          a2 = await e10(r10, Object.assign({}, l2));
        } catch (e11) {
          throw console.error(e11), new nc(nD(e11), 0);
        }
        if (a2.ok || await nB(a2), null == n10 ? void 0 : n10.noResolveJson) return a2;
        try {
          return await a2.json();
        } catch (e11) {
          await nB(e11);
        }
      }
      function nH(e10) {
        var t10, r10, n10;
        let s2 = null;
        (n10 = e10).access_token && n10.refresh_token && n10.expires_in && (s2 = Object.assign({}, e10), e10.expires_at || (s2.expires_at = (r10 = e10.expires_in, Math.round(Date.now() / 1e3) + r10)));
        return { data: { session: s2, user: null != (t10 = e10.user) ? t10 : e10 }, error: null };
      }
      function nz(e10) {
        let t10 = nH(e10);
        return !t10.error && e10.weak_password && "object" == typeof e10.weak_password && Array.isArray(e10.weak_password.reasons) && e10.weak_password.reasons.length && e10.weak_password.message && "string" == typeof e10.weak_password.message && e10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true) && (t10.data.weak_password = e10.weak_password), t10;
      }
      function nV(e10) {
        var t10;
        return { data: { user: null != (t10 = e10.user) ? t10 : e10 }, error: null };
      }
      function nK(e10) {
        return { data: e10, error: null };
      }
      function nF(e10) {
        let { action_link: t10, email_otp: r10, hashed_token: n10, redirect_to: s2, verification_type: i2 } = e10;
        return { data: { properties: { action_link: t10, email_otp: r10, hashed_token: n10, redirect_to: s2, verification_type: i2 }, user: Object.assign({}, tG(e10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function nG(e10) {
        return e10;
      }
      let nJ = ["global", "local", "others"];
      class nX {
        constructor({ url: e10 = "", headers: t10 = {}, fetch: r10 }) {
          this.url = e10, this.headers = t10, this.fetch = nS(r10), this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) }, this.oauth = { listClients: this._listOAuthClients.bind(this), createClient: this._createOAuthClient.bind(this), getClient: this._getOAuthClient.bind(this), updateClient: this._updateOAuthClient.bind(this), deleteClient: this._deleteOAuthClient.bind(this), regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this) };
        }
        async signOut(e10, t10 = nJ[0]) {
          if (0 > nJ.indexOf(t10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${nJ.join(", ")}`);
          try {
            return await nM(this.fetch, "POST", `${this.url}/logout?scope=${t10}`, { headers: this.headers, jwt: e10, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async inviteUserByEmail(e10, t10 = {}) {
          try {
            return await nM(this.fetch, "POST", `${this.url}/invite`, { body: { email: e10, data: t10.data }, headers: this.headers, redirectTo: t10.redirectTo, xform: nV });
          } catch (e11) {
            if (ne(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async generateLink(e10) {
          try {
            let { options: t10 } = e10, r10 = tG(e10, ["options"]), n10 = Object.assign(Object.assign({}, r10), t10);
            return "newEmail" in r10 && (n10.new_email = null == r10 ? void 0 : r10.newEmail, delete n10.newEmail), await nM(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: n10, headers: this.headers, xform: nF, redirectTo: null == t10 ? void 0 : t10.redirectTo });
          } catch (e11) {
            if (ne(e11)) return { data: { properties: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async createUser(e10) {
          try {
            return await nM(this.fetch, "POST", `${this.url}/admin/users`, { body: e10, headers: this.headers, xform: nV });
          } catch (e11) {
            if (ne(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async listUsers(e10) {
          var t10, r10, n10, s2, i2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await nM(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (s2 = null == (n10 = null == e10 ? void 0 : e10.perPage) ? void 0 : n10.toString()) ? s2 : "" }, xform: nG });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null != (i2 = u2.headers.get("x-total-count")) ? i2 : 0, d2 = null != (o2 = null == (a2 = u2.headers.get("link")) ? void 0 : a2.split(",")) ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r11}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (ne(e11)) return { data: { users: [] }, error: e11 };
            throw e11;
          }
        }
        async getUserById(e10) {
          nN(e10);
          try {
            return await nM(this.fetch, "GET", `${this.url}/admin/users/${e10}`, { headers: this.headers, xform: nV });
          } catch (e11) {
            if (ne(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUserById(e10, t10) {
          nN(e10);
          try {
            return await nM(this.fetch, "PUT", `${this.url}/admin/users/${e10}`, { body: t10, headers: this.headers, xform: nV });
          } catch (e11) {
            if (ne(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async deleteUser(e10, t10 = false) {
          nN(e10);
          try {
            return await nM(this.fetch, "DELETE", `${this.url}/admin/users/${e10}`, { headers: this.headers, body: { should_soft_delete: t10 }, xform: nV });
          } catch (e11) {
            if (ne(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async _listFactors(e10) {
          nN(e10.userId);
          try {
            let { data: t10, error: r10 } = await nM(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/factors`, { headers: this.headers, xform: (e11) => ({ data: { factors: e11 }, error: null }) });
            return { data: t10, error: r10 };
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteFactor(e10) {
          nN(e10.userId), nN(e10.id);
          try {
            return { data: await nM(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/factors/${e10.id}`, { headers: this.headers }), error: null };
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _listOAuthClients(e10) {
          var t10, r10, n10, s2, i2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await nM(this.fetch, "GET", `${this.url}/admin/oauth/clients`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (s2 = null == (n10 = null == e10 ? void 0 : e10.perPage) ? void 0 : n10.toString()) ? s2 : "" }, xform: nG });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null != (i2 = u2.headers.get("x-total-count")) ? i2 : 0, d2 = null != (o2 = null == (a2 = u2.headers.get("link")) ? void 0 : a2.split(",")) ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r11}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (ne(e11)) return { data: { clients: [] }, error: e11 };
            throw e11;
          }
        }
        async _createOAuthClient(e10) {
          try {
            return await nM(this.fetch, "POST", `${this.url}/admin/oauth/clients`, { body: e10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _getOAuthClient(e10) {
          try {
            return await nM(this.fetch, "GET", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _updateOAuthClient(e10, t10) {
          try {
            return await nM(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${e10}`, { body: t10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteOAuthClient(e10) {
          try {
            return await nM(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _regenerateOAuthClientSecret(e10) {
          try {
            return await nM(this.fetch, "POST", `${this.url}/admin/oauth/clients/${e10}/regenerate_secret`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      function nY(e10 = {}) {
        return { getItem: (t10) => e10[t10] || null, setItem: (t10, r10) => {
          e10[t10] = r10;
        }, removeItem: (t10) => {
          delete e10[t10];
        } };
      }
      globalThis;
      class nQ extends Error {
        constructor(e10) {
          super(e10), this.isAcquireTimeout = true;
        }
      }
      function nZ(e10) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(e10)) throw Error(`@supabase/auth-js: Address "${e10}" is invalid.`);
        return e10.toLowerCase();
      }
      class n0 extends Error {
        constructor({ message: e10, code: t10, cause: r10, name: n10 }) {
          var s2;
          super(e10, { cause: r10 }), this.__isWebAuthnError = true, this.name = null != (s2 = null != n10 ? n10 : r10 instanceof Error ? r10.name : void 0) ? s2 : "Unknown Error", this.code = t10;
        }
      }
      class n1 extends n0 {
        constructor(e10, t10) {
          super({ code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: t10, message: e10 }), this.name = "WebAuthnUnknownError", this.originalError = t10;
        }
      }
      let n2 = new class {
        createNewAbortSignal() {
          if (this.controller) {
            let e11 = Error("Cancelling existing WebAuthn API call for new one");
            e11.name = "AbortError", this.controller.abort(e11);
          }
          let e10 = new AbortController();
          return this.controller = e10, e10.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let e10 = Error("Manually cancelling existing WebAuthn API call");
            e10.name = "AbortError", this.controller.abort(e10), this.controller = void 0;
          }
        }
      }();
      function n3(e10) {
        return "localhost" === e10 || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e10);
      }
      async function n4(e10) {
        try {
          let t10 = await navigator.credentials.create(e10);
          if (!t10) return { data: null, error: new n1("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new n1("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            var r10, n10, s2;
            let { publicKey: i2 } = t11;
            if (!i2) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new n0({ message: "Registration ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("ConstraintError" === e11.name) {
              if ((null == (r10 = i2.authenticatorSelection) ? void 0 : r10.requireResidentKey) === true) return new n0({ message: "Discoverable credentials were required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT", cause: e11 });
              else if ("conditional" === t11.mediation && (null == (n10 = i2.authenticatorSelection) ? void 0 : n10.userVerification) === "required") return new n0({ message: "User verification was required during automatic registration but it could not be performed", code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE", cause: e11 });
              else if ((null == (s2 = i2.authenticatorSelection) ? void 0 : s2.userVerification) === "required") return new n0({ message: "User verification was required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT", cause: e11 });
            } else if ("InvalidStateError" === e11.name) return new n0({ message: "The authenticator was previously registered", code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED", cause: e11 });
            else if ("NotAllowedError" === e11.name) return new n0({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("NotSupportedError" === e11.name) return new n0(0 === i2.pubKeyCredParams.filter((e12) => "public-key" === e12.type).length ? { message: 'No entry in pubKeyCredParams was of type "public-key"', code: "ERROR_MALFORMED_PUBKEYCREDPARAMS", cause: e11 } : { message: "No available authenticator supported any of the specified pubKeyCredParams algorithms", code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!n3(t12)) return new n0({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (i2.rp.id !== t12) return new n0({ message: `The RP ID "${i2.rp.id}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("TypeError" === e11.name) {
              if (i2.user.id.byteLength < 1 || i2.user.id.byteLength > 64) return new n0({ message: "User ID was not between 1 and 64 characters", code: "ERROR_INVALID_USER_ID_LENGTH", cause: e11 });
            } else if ("UnknownError" === e11.name) return new n0({ message: "The authenticator was unable to process the specified options, or could not create a new credential", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new n0({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      async function n6(e10) {
        try {
          let t10 = await navigator.credentials.get(e10);
          if (!t10) return { data: null, error: new n1("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new n1("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            let { publicKey: r10 } = t11;
            if (!r10) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new n0({ message: "Authentication ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("NotAllowedError" === e11.name) return new n0({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!n3(t12)) return new n0({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (r10.rpId !== t12) return new n0({ message: `The RP ID "${r10.rpId}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("UnknownError" === e11.name) return new n0({ message: "The authenticator was unable to process the specified options, or could not create a new assertion signature", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new n0({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      let n5 = { hints: ["security-key"], authenticatorSelection: { authenticatorAttachment: "cross-platform", requireResidentKey: false, userVerification: "preferred", residentKey: "discouraged" }, attestation: "direct" }, n8 = { userVerification: "preferred", hints: ["security-key"], attestation: "direct" };
      function n9(...e10) {
        let t10 = (e11) => null !== e11 && "object" == typeof e11 && !Array.isArray(e11), r10 = (e11) => e11 instanceof ArrayBuffer || ArrayBuffer.isView(e11), n10 = {};
        for (let s2 of e10) if (s2) for (let e11 in s2) {
          let i2 = s2[e11];
          if (void 0 !== i2) if (Array.isArray(i2)) n10[e11] = i2;
          else if (r10(i2)) n10[e11] = i2;
          else if (t10(i2)) {
            let r11 = n10[e11];
            t10(r11) ? n10[e11] = n9(r11, i2) : n10[e11] = n9(i2);
          } else n10[e11] = i2;
        }
        return n10;
      }
      class n7 {
        constructor(e10) {
          this.client = e10, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this);
        }
        async _enroll(e10) {
          return this.client.mfa.enroll(Object.assign(Object.assign({}, e10), { factorType: "webauthn" }));
        }
        async _challenge({ factorId: e10, webauthn: t10, friendlyName: r10, signal: n10 }, s2) {
          var i2, a2, o2, l2, u2;
          try {
            let { data: c2, error: h2 } = await this.client.mfa.challenge({ factorId: e10, webauthn: t10 });
            if (!c2) return { data: null, error: h2 };
            let d2 = null != n10 ? n10 : n2.createNewAbortSignal();
            if ("create" === c2.webauthn.type) {
              let { user: e11 } = c2.webauthn.credential_options.publicKey;
              if (!e11.name) if (r10) e11.name = `${e11.id}:${r10}`;
              else {
                let t11 = (await this.client.getUser()).data.user, r11 = (null == (i2 = null == t11 ? void 0 : t11.user_metadata) ? void 0 : i2.name) || (null == t11 ? void 0 : t11.email) || (null == t11 ? void 0 : t11.id) || "User";
                e11.name = `${e11.id}:${r11}`;
              }
              e11.displayName || (e11.displayName = e11.name);
            }
            switch (c2.webauthn.type) {
              case "create": {
                let t11 = (a2 = c2.webauthn.credential_options.publicKey, o2 = null == s2 ? void 0 : s2.create, n9(n5, a2, o2 || {})), { data: r11, error: n11 } = await n4({ publicKey: t11, signal: d2 });
                if (r11) return { data: { factorId: e10, challengeId: c2.id, webauthn: { type: c2.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: n11 };
              }
              case "request": {
                let t11 = (l2 = c2.webauthn.credential_options.publicKey, u2 = null == s2 ? void 0 : s2.request, n9(n8, l2, u2 || {})), { data: r11, error: n11 } = await n6(Object.assign(Object.assign({}, c2.webauthn.credential_options), { publicKey: t11, signal: d2 }));
                if (r11) return { data: { factorId: e10, challengeId: c2.id, webauthn: { type: c2.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: n11 };
              }
            }
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            return { data: null, error: new nr("Unexpected error in challenge", e11) };
          }
        }
        async _verify({ challengeId: e10, factorId: t10, webauthn: r10 }) {
          return this.client.mfa.verify({ factorId: t10, challengeId: e10, webauthn: r10 });
        }
        async _authenticate({ factorId: e10, webauthn: { rpId: t10, rpOrigins: r10, signal: n10 } = {} }, s2) {
          if (!t10) return { data: null, error: new r7("rpId is required for WebAuthn authentication") };
          try {
            1;
            return { data: null, error: new nr("Browser does not support WebAuthn", null) };
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            return { data: null, error: new nr("Unexpected error in authenticate", e11) };
          }
        }
        async _register({ friendlyName: e10, webauthn: { rpId: t10, rpOrigins: r10, signal: n10 } = {} }, s2) {
          if (!t10) return { data: null, error: new r7("rpId is required for WebAuthn registration") };
          try {
            1;
            return { data: null, error: new nr("Browser does not support WebAuthn", null) };
          } catch (e11) {
            if (ne(e11)) return { data: null, error: e11 };
            return { data: null, error: new nr("Unexpected error in register", e11) };
          }
        }
      }
      if ("object" != typeof globalThis) try {
        Object.defineProperty(Object.prototype, "__magic__", { get: function() {
          return this;
        }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
      } catch (e10) {
        "u" > typeof self && (self.globalThis = self);
      }
      let se = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: r6, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false, throwOnError: false, lockAcquireTimeout: 1e4 };
      async function st(e10, t10, r10) {
        return await r10();
      }
      let sr = {};
      class sn {
        get jwks() {
          var e10, t10;
          return null != (t10 = null == (e10 = sr[this.storageKey]) ? void 0 : e10.jwks) ? t10 : { keys: [] };
        }
        set jwks(e10) {
          sr[this.storageKey] = Object.assign(Object.assign({}, sr[this.storageKey]), { jwks: e10 });
        }
        get jwks_cached_at() {
          var e10, t10;
          return null != (t10 = null == (e10 = sr[this.storageKey]) ? void 0 : e10.cachedAt) ? t10 : Number.MIN_SAFE_INTEGER;
        }
        set jwks_cached_at(e10) {
          sr[this.storageKey] = Object.assign(Object.assign({}, sr[this.storageKey]), { cachedAt: e10 });
        }
        constructor(e10) {
          var t10;
          this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.autoRefreshTickTimeout = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log;
          const r10 = Object.assign(Object.assign({}, se), e10);
          this.storageKey = r10.storageKey, this.instanceID = null != (t10 = sn.nextInstanceID[this.storageKey]) ? t10 : 0, sn.nextInstanceID[this.storageKey] = this.instanceID + 1, this.logDebugMessages = !!r10.debug, "function" == typeof r10.debug && (this.logger = r10.debug), this.instanceID, this.persistSession = r10.persistSession, this.autoRefreshToken = r10.autoRefreshToken, this.admin = new nX({ url: r10.url, headers: r10.headers, fetch: r10.fetch }), this.url = r10.url, this.headers = r10.headers, this.fetch = nS(r10.fetch), this.lock = r10.lock || st, this.detectSessionInUrl = r10.detectSessionInUrl, this.flowType = r10.flowType, this.hasCustomAuthorizationHeader = r10.hasCustomAuthorizationHeader, this.throwOnError = r10.throwOnError, this.lockAcquireTimeout = r10.lockAcquireTimeout, r10.lock ? this.lock = r10.lock : (this.persistSession, this.lock = st), this.jwks || (this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER), this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this), webauthn: new n7(this) }, this.oauth = { getAuthorizationDetails: this._getAuthorizationDetails.bind(this), approveAuthorization: this._approveAuthorization.bind(this), denyAuthorization: this._denyAuthorization.bind(this), listGrants: this._listOAuthGrants.bind(this), revokeGrant: this._revokeOAuthGrant.bind(this) }, this.persistSession ? (r10.storage ? this.storage = r10.storage : (this.memoryStorage = {}, this.storage = nY(this.memoryStorage)), r10.userStorage && (this.userStorage = r10.userStorage)) : (this.memoryStorage = {}, this.storage = nY(this.memoryStorage)), this.initialize().catch((e11) => {
            this._debug("#initialize()", "error", e11);
          });
        }
        isThrowOnErrorEnabled() {
          return this.throwOnError;
        }
        _returnResult(e10) {
          if (this.throwOnError && e10 && e10.error) throw e10.error;
          return e10;
        }
        _logPrefix() {
          return `GoTrueClient@${this.storageKey}:${this.instanceID} (${r4}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
        }
        _debug(...e10) {
          return this.logDebugMessages && this.logger(this._logPrefix(), ...e10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(this.lockAcquireTimeout, async () => await this._initialize()))()), await this.initializePromise;
        }
        async _initialize() {
          try {
            return await this._recoverAndRefresh(), { error: null };
          } catch (e10) {
            if (ne(e10)) return this._returnResult({ error: e10 });
            return this._returnResult({ error: new nr("Unexpected error during initialization", e10) });
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(e10) {
          var t10, r10, n10;
          try {
            let { data: s2, error: i2 } = await nM(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.data) ? r10 : {}, gotrue_meta_security: { captcha_token: null == (n10 = null == e10 ? void 0 : e10.options) ? void 0 : n10.captchaToken } }, xform: nH });
            if (i2 || !s2) return this._returnResult({ data: { user: null, session: null }, error: i2 });
            let a2 = s2.session, o2 = s2.user;
            return s2.session && (await this._saveSession(s2.session), await this._notifyAllSubscribers("SIGNED_IN", a2)), this._returnResult({ data: { user: o2, session: a2 }, error: null });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signUp(e10) {
          var t10, r10, n10;
          try {
            let s2;
            if ("email" in e10) {
              let { email: r11, password: n11, options: i3 } = e10, a3 = null, o3 = null;
              "pkce" === this.flowType && ([a3, o3] = await nj(this.storage, this.storageKey)), s2 = await nM(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == i3 ? void 0 : i3.emailRedirectTo, body: { email: r11, password: n11, data: null != (t10 = null == i3 ? void 0 : i3.data) ? t10 : {}, gotrue_meta_security: { captcha_token: null == i3 ? void 0 : i3.captchaToken }, code_challenge: a3, code_challenge_method: o3 }, xform: nH });
            } else if ("phone" in e10) {
              let { phone: t11, password: i3, options: a3 } = e10;
              s2 = await nM(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: t11, password: i3, data: null != (r10 = null == a3 ? void 0 : a3.data) ? r10 : {}, channel: null != (n10 = null == a3 ? void 0 : a3.channel) ? n10 : "sms", gotrue_meta_security: { captcha_token: null == a3 ? void 0 : a3.captchaToken } }, xform: nH });
            } else throw new no("You must provide either an email or phone number and a password");
            let { data: i2, error: a2 } = s2;
            if (a2 || !i2) return await nT(this.storage, `${this.storageKey}-code-verifier`), this._returnResult({ data: { user: null, session: null }, error: a2 });
            let o2 = i2.session, l2 = i2.user;
            return i2.session && (await this._saveSession(i2.session), await this._notifyAllSubscribers("SIGNED_IN", o2)), this._returnResult({ data: { user: l2, session: o2 }, error: null });
          } catch (e11) {
            if (await nT(this.storage, `${this.storageKey}-code-verifier`), ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithPassword(e10) {
          try {
            let t10;
            if ("email" in e10) {
              let { email: r11, password: n11, options: s2 } = e10;
              t10 = await nM(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: r11, password: n11, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, xform: nz });
            } else if ("phone" in e10) {
              let { phone: r11, password: n11, options: s2 } = e10;
              t10 = await nM(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: r11, password: n11, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, xform: nz });
            } else throw new no("You must provide either an email or phone number and a password");
            let { data: r10, error: n10 } = t10;
            if (n10) return this._returnResult({ data: { user: null, session: null }, error: n10 });
            if (!r10 || !r10.session || !r10.user) {
              let e11 = new na();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return r10.session && (await this._saveSession(r10.session), await this._notifyAllSubscribers("SIGNED_IN", r10.session)), this._returnResult({ data: Object.assign({ user: r10.user, session: r10.session }, r10.weak_password ? { weakPassword: r10.weak_password } : null), error: n10 });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOAuth(e10) {
          var t10, r10, n10, s2;
          return await this._handleProviderSignIn(e10.provider, { redirectTo: null == (t10 = e10.options) ? void 0 : t10.redirectTo, scopes: null == (r10 = e10.options) ? void 0 : r10.scopes, queryParams: null == (n10 = e10.options) ? void 0 : n10.queryParams, skipBrowserRedirect: null == (s2 = e10.options) ? void 0 : s2.skipBrowserRedirect });
        }
        async exchangeCodeForSession(e10) {
          return await this.initializePromise, this._acquireLock(this.lockAcquireTimeout, async () => this._exchangeCodeForSession(e10));
        }
        async signInWithWeb3(e10) {
          let { chain: t10 } = e10;
          switch (t10) {
            case "ethereum":
              return await this.signInWithEthereum(e10);
            case "solana":
              return await this.signInWithSolana(e10);
            default:
              throw Error(`@supabase/auth-js: Unsupported chain "${t10}"`);
          }
        }
        async signInWithEthereum(e10) {
          var t10, r10, n10, s2, i2, a2, o2, l2, u2, c2, h2, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let { chain: c3, wallet: h3, statement: g2, options: m2 } = e10;
            if ("object" != typeof h3 || !(null == m2 ? void 0 : m2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            let y2 = new URL(null != (t10 = null == m2 ? void 0 : m2.url) ? t10 : window.location.href), b2 = await h3.request({ method: "eth_requestAccounts" }).then((e11) => e11).catch(() => {
              throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid");
            });
            if (!b2 || 0 === b2.length) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
            let w2 = nZ(b2[0]), v2 = null == (r10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : r10.chainId;
            v2 || (v2 = parseInt(await h3.request({ method: "eth_chainId" }), 16)), p2 = function(e11) {
              var t11;
              let { chainId: r11, domain: n11, expirationTime: s3, issuedAt: i3 = /* @__PURE__ */ new Date(), nonce: a3, notBefore: o3, requestId: l3, resources: u3, scheme: c4, uri: h4, version: d3 } = e11;
              if (!Number.isInteger(r11)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r11}`);
              if (!n11) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
              if (a3 && a3.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a3}`);
              if (!h4) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
              if ("1" !== d3) throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d3}`);
              if (null == (t11 = e11.statement) ? void 0 : t11.includes("\n")) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e11.statement}`);
              let p3 = nZ(e11.address), f3 = c4 ? `${c4}://${n11}` : n11, g3 = e11.statement ? `${e11.statement}
` : "", m3 = `${f3} wants you to sign in with your Ethereum account:
${p3}

${g3}`, y3 = `URI: ${h4}
Version: ${d3}
Chain ID: ${r11}${a3 ? `
Nonce: ${a3}` : ""}
Issued At: ${i3.toISOString()}`;
              if (s3 && (y3 += `
Expiration Time: ${s3.toISOString()}`), o3 && (y3 += `
Not Before: ${o3.toISOString()}`), l3 && (y3 += `
Request ID: ${l3}`), u3) {
                let e12 = "\nResources:";
                for (let t12 of u3) {
                  if (!t12 || "string" != typeof t12) throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t12}`);
                  e12 += `
- ${t12}`;
                }
                y3 += e12;
              }
              return `${m3}
${y3}`;
            }({ domain: y2.host, address: w2, statement: g2, uri: y2.href, version: "1", chainId: v2, nonce: null == (n10 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : n10.nonce, issuedAt: null != (i2 = null == (s2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : s2.issuedAt) ? i2 : /* @__PURE__ */ new Date(), expirationTime: null == (a2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : a2.expirationTime, notBefore: null == (o2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : o2.notBefore, requestId: null == (l2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : l2.requestId, resources: null == (u2 = null == m2 ? void 0 : m2.signInWithEthereum) ? void 0 : u2.resources }), f2 = await h3.request({ method: "personal_sign", params: [(d2 = p2, "0x" + Array.from(new TextEncoder().encode(d2), (e11) => e11.toString(16).padStart(2, "0")).join("")), w2] });
          }
          try {
            let { data: t11, error: r11 } = await nM(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "ethereum", message: p2, signature: f2 }, (null == (c2 = e10.options) ? void 0 : c2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (h2 = e10.options) ? void 0 : h2.captchaToken } } : null), xform: nH });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new na();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSolana(e10) {
          var t10, r10, n10, s2, i2, a2, o2, l2, u2, c2, h2, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let { chain: h3, wallet: d3, statement: g2, options: m2 } = e10;
            if ("object" != typeof d3 || !(null == m2 ? void 0 : m2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            let y2 = new URL(null != (t10 = null == m2 ? void 0 : m2.url) ? t10 : window.location.href);
            if ("signIn" in d3 && d3.signIn) {
              let e11, t11 = await d3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == m2 ? void 0 : m2.signInWithSolana), { version: "1", domain: y2.host, uri: y2.href }), g2 ? { statement: g2 } : null));
              if (Array.isArray(t11) && t11[0] && "object" == typeof t11[0]) e11 = t11[0];
              else if (t11 && "object" == typeof t11 && "signedMessage" in t11 && "signature" in t11) e11 = t11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in e11 && "signature" in e11 && ("string" == typeof e11.signedMessage || e11.signedMessage instanceof Uint8Array) && e11.signature instanceof Uint8Array) p2 = "string" == typeof e11.signedMessage ? e11.signedMessage : new TextDecoder().decode(e11.signedMessage), f2 = e11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in d3) || "function" != typeof d3.signMessage || !("publicKey" in d3) || "object" != typeof d3 || !d3.publicKey || !("toBase58" in d3.publicKey) || "function" != typeof d3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              p2 = [`${y2.host} wants you to sign in with your Solana account:`, d3.publicKey.toBase58(), ...g2 ? ["", g2, ""] : [""], "Version: 1", `URI: ${y2.href}`, `Issued At: ${null != (n10 = null == (r10 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : r10.issuedAt) ? n10 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null == (s2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : s2.notBefore) ? [`Not Before: ${m2.signInWithSolana.notBefore}`] : [], ...(null == (i2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : i2.expirationTime) ? [`Expiration Time: ${m2.signInWithSolana.expirationTime}`] : [], ...(null == (a2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : a2.chainId) ? [`Chain ID: ${m2.signInWithSolana.chainId}`] : [], ...(null == (o2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : o2.nonce) ? [`Nonce: ${m2.signInWithSolana.nonce}`] : [], ...(null == (l2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : l2.requestId) ? [`Request ID: ${m2.signInWithSolana.requestId}`] : [], ...(null == (c2 = null == (u2 = null == m2 ? void 0 : m2.signInWithSolana) ? void 0 : u2.resources) ? void 0 : c2.length) ? ["Resources", ...m2.signInWithSolana.resources.map((e12) => `- ${e12}`)] : []].join("\n");
              let e11 = await d3.signMessage(new TextEncoder().encode(p2), "utf8");
              if (!e11 || !(e11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              f2 = e11;
            }
          }
          try {
            let { data: t11, error: r11 } = await nM(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: p2, signature: n_(f2) }, (null == (h2 = e10.options) ? void 0 : h2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (d2 = e10.options) ? void 0 : d2.captchaToken } } : null), xform: nH });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new na();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _exchangeCodeForSession(e10) {
          let t10 = await nE(this.storage, `${this.storageKey}-code-verifier`), [r10, n10] = (null != t10 ? t10 : "").split("/");
          try {
            if (!r10 && "pkce" === this.flowType) throw new nu();
            let { data: t11, error: s2 } = await nM(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: e10, code_verifier: r10 }, xform: nH });
            if (await nT(this.storage, `${this.storageKey}-code-verifier`), s2) throw s2;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new na();
              return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign(Object.assign({}, t11), { redirectType: null != n10 ? n10 : null }), error: s2 });
          } catch (e11) {
            if (await nT(this.storage, `${this.storageKey}-code-verifier`), ne(e11)) return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithIdToken(e10) {
          try {
            let { options: t10, provider: r10, token: n10, access_token: s2, nonce: i2 } = e10, { data: a2, error: o2 } = await nM(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: r10, id_token: n10, access_token: s2, nonce: i2, gotrue_meta_security: { captcha_token: null == t10 ? void 0 : t10.captchaToken } }, xform: nH });
            if (o2) return this._returnResult({ data: { user: null, session: null }, error: o2 });
            if (!a2 || !a2.session || !a2.user) {
              let e11 = new na();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return a2.session && (await this._saveSession(a2.session), await this._notifyAllSubscribers("SIGNED_IN", a2.session)), this._returnResult({ data: a2, error: o2 });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOtp(e10) {
          var t10, r10, n10, s2, i2;
          try {
            if ("email" in e10) {
              let { email: n11, options: s3 } = e10, i3 = null, a2 = null;
              "pkce" === this.flowType && ([i3, a2] = await nj(this.storage, this.storageKey));
              let { error: o2 } = await nM(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: n11, data: null != (t10 = null == s3 ? void 0 : s3.data) ? t10 : {}, create_user: null == (r10 = null == s3 ? void 0 : s3.shouldCreateUser) || r10, gotrue_meta_security: { captcha_token: null == s3 ? void 0 : s3.captchaToken }, code_challenge: i3, code_challenge_method: a2 }, redirectTo: null == s3 ? void 0 : s3.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: o2 });
            }
            if ("phone" in e10) {
              let { phone: t11, options: r11 } = e10, { data: a2, error: o2 } = await nM(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: t11, data: null != (n10 = null == r11 ? void 0 : r11.data) ? n10 : {}, create_user: null == (s2 = null == r11 ? void 0 : r11.shouldCreateUser) || s2, gotrue_meta_security: { captcha_token: null == r11 ? void 0 : r11.captchaToken }, channel: null != (i2 = null == r11 ? void 0 : r11.channel) ? i2 : "sms" } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == a2 ? void 0 : a2.message_id }, error: o2 });
            }
            throw new no("You must provide either an email or phone number.");
          } catch (e11) {
            if (await nT(this.storage, `${this.storageKey}-code-verifier`), ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async verifyOtp(e10) {
          var t10, r10;
          try {
            let n10, s2;
            "options" in e10 && (n10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo, s2 = null == (r10 = e10.options) ? void 0 : r10.captchaToken);
            let { data: i2, error: a2 } = await nM(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, e10), { gotrue_meta_security: { captcha_token: s2 } }), redirectTo: n10, xform: nH });
            if (a2) throw a2;
            if (!i2) throw Error("An error occurred on token verification.");
            let o2 = i2.session, l2 = i2.user;
            return (null == o2 ? void 0 : o2.access_token) && (await this._saveSession(o2), await this._notifyAllSubscribers("recovery" == e10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", o2)), this._returnResult({ data: { user: l2, session: o2 }, error: null });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSSO(e10) {
          var t10, r10, n10, s2;
          try {
            let i2 = null, a2 = null;
            "pkce" === this.flowType && ([i2, a2] = await nj(this.storage, this.storageKey));
            let o2 = await nM(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e10 ? { provider_id: e10.providerId } : null), "domain" in e10 ? { domain: e10.domain } : null), { redirect_to: null != (r10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo) ? r10 : void 0 }), (null == (n10 = null == e10 ? void 0 : e10.options) ? void 0 : n10.captchaToken) ? { gotrue_meta_security: { captcha_token: e10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: i2, code_challenge_method: a2 }), headers: this.headers, xform: nK });
            return null == (s2 = o2.data) || s2.url, this._returnResult(o2);
          } catch (e11) {
            if (await nT(this.storage, `${this.storageKey}-code-verifier`), ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async reauthenticate() {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._reauthenticate());
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) throw r10;
              if (!t10) throw new ns();
              let { error: n10 } = await nM(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: t10.access_token });
              return this._returnResult({ data: { user: null, session: null }, error: n10 });
            });
          } catch (e10) {
            if (ne(e10)) return this._returnResult({ data: { user: null, session: null }, error: e10 });
            throw e10;
          }
        }
        async resend(e10) {
          try {
            let t10 = `${this.url}/resend`;
            if ("email" in e10) {
              let { email: r10, type: n10, options: s2 } = e10, { error: i2 } = await nM(this.fetch, "POST", t10, { headers: this.headers, body: { email: r10, type: n10, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, redirectTo: null == s2 ? void 0 : s2.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: i2 });
            }
            if ("phone" in e10) {
              let { phone: r10, type: n10, options: s2 } = e10, { data: i2, error: a2 } = await nM(this.fetch, "POST", t10, { headers: this.headers, body: { phone: r10, type: n10, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == i2 ? void 0 : i2.message_id }, error: a2 });
            }
            throw new no("You must provide either an email or phone number and a type");
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async getSession() {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => this._useSession(async (e10) => e10));
        }
        async _acquireLock(e10, t10) {
          this._debug("#_acquireLock", "begin", e10);
          try {
            if (this.lockAcquired) {
              let e11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), r10 = (async () => (await e11, await t10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await r10;
                } catch (e12) {
                }
              })()), r10;
            }
            return await this.lock(`lock:${this.storageKey}`, e10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let e11 = t10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await e11;
                  } catch (e12) {
                  }
                })()), await e11; this.pendingInLock.length; ) {
                  let e12 = [...this.pendingInLock];
                  await Promise.all(e12), this.pendingInLock.splice(0, e12.length);
                }
                return await e11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(e10) {
          this._debug("#_useSession", "begin");
          try {
            let t10 = await this.__loadSession();
            return await e10(t10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let t10 = null, r10 = await nE(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", r10), null !== r10 && (this._isValidSession(r10) ? t10 = r10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !t10) return { data: { session: null }, error: null };
            let n10 = !!t10.expires_at && 1e3 * t10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${n10 ? "" : " not"} expired`, "expires_at", t10.expires_at), !n10) {
              if (this.userStorage) {
                let e11 = await nE(this.userStorage, this.storageKey + "-user");
                (null == e11 ? void 0 : e11.user) ? t10.user = e11.user : t10.user = nU();
              }
              if (this.storage.isServer && t10.user && !t10.user.__isUserNotAvailableProxy) {
                var e10;
                let r11 = { value: this.suppressGetSessionWarning };
                t10.user = (e10 = t10.user, new Proxy(e10, { get: (e11, t11, n11) => {
                  if ("__isInsecureUserWarningProxy" === t11) return true;
                  if ("symbol" == typeof t11) {
                    let r12 = t11.toString();
                    if ("Symbol(Symbol.toPrimitive)" === r12 || "Symbol(Symbol.toStringTag)" === r12 || "Symbol(util.inspect.custom)" === r12 || "Symbol(nodejs.util.inspect.custom)" === r12) return Reflect.get(e11, t11, n11);
                  }
                  return r11.value || "string" != typeof t11 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), r11.value = true), Reflect.get(e11, t11, n11);
                } })), r11.value && (this.suppressGetSessionWarning = true);
              }
              return { data: { session: t10 }, error: null };
            }
            let { data: s2, error: i2 } = await this._callRefreshToken(t10.refresh_token);
            if (i2) return this._returnResult({ data: { session: null }, error: i2 });
            return this._returnResult({ data: { session: s2 }, error: null });
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(e10) {
          if (e10) return await this._getUser(e10);
          await this.initializePromise;
          let t10 = await this._acquireLock(this.lockAcquireTimeout, async () => await this._getUser());
          return t10.data.user && (this.suppressGetSessionWarning = true), t10;
        }
        async _getUser(e10) {
          try {
            if (e10) return await nM(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: e10, xform: nV });
            return await this._useSession(async (e11) => {
              var t10, r10, n10;
              let { data: s2, error: i2 } = e11;
              if (i2) throw i2;
              return (null == (t10 = s2.session) ? void 0 : t10.access_token) || this.hasCustomAuthorizationHeader ? await nM(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null != (n10 = null == (r10 = s2.session) ? void 0 : r10.access_token) ? n10 : void 0, xform: nV }) : { data: { user: null }, error: new ns() };
            });
          } catch (e11) {
            if (ne(e11)) return ni(e11) && (await this._removeSession(), await nT(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async updateUser(e10, t10 = {}) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._updateUser(e10, t10));
        }
        async _updateUser(e10, t10 = {}) {
          try {
            return await this._useSession(async (r10) => {
              let { data: n10, error: s2 } = r10;
              if (s2) throw s2;
              if (!n10.session) throw new ns();
              let i2 = n10.session, a2 = null, o2 = null;
              "pkce" === this.flowType && null != e10.email && ([a2, o2] = await nj(this.storage, this.storageKey));
              let { data: l2, error: u2 } = await nM(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == t10 ? void 0 : t10.emailRedirectTo, body: Object.assign(Object.assign({}, e10), { code_challenge: a2, code_challenge_method: o2 }), jwt: i2.access_token, xform: nV });
              if (u2) throw u2;
              return i2.user = l2.user, await this._saveSession(i2), await this._notifyAllSubscribers("USER_UPDATED", i2), this._returnResult({ data: { user: i2.user }, error: null });
            });
          } catch (e11) {
            if (await nT(this.storage, `${this.storageKey}-code-verifier`), ne(e11)) return this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async setSession(e10) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._setSession(e10));
        }
        async _setSession(e10) {
          try {
            if (!e10.access_token || !e10.refresh_token) throw new ns();
            let t10 = Date.now() / 1e3, r10 = t10, n10 = true, s2 = null, { payload: i2 } = nO(e10.access_token);
            if (i2.exp && (n10 = (r10 = i2.exp) <= t10), n10) {
              let { data: t11, error: r11 } = await this._callRefreshToken(e10.refresh_token);
              if (r11) return this._returnResult({ data: { user: null, session: null }, error: r11 });
              if (!t11) return { data: { user: null, session: null }, error: null };
              s2 = t11;
            } else {
              let { data: n11, error: i3 } = await this._getUser(e10.access_token);
              if (i3) return this._returnResult({ data: { user: null, session: null }, error: i3 });
              s2 = { access_token: e10.access_token, refresh_token: e10.refresh_token, user: n11.user, token_type: "bearer", expires_in: r10 - t10, expires_at: r10 }, await this._saveSession(s2), await this._notifyAllSubscribers("SIGNED_IN", s2);
            }
            return this._returnResult({ data: { user: s2.user, session: s2 }, error: null });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          }
        }
        async refreshSession(e10) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._refreshSession(e10));
        }
        async _refreshSession(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              if (!e10) {
                let { data: n11, error: s3 } = t10;
                if (s3) throw s3;
                e10 = null != (r10 = n11.session) ? r10 : void 0;
              }
              if (!(null == e10 ? void 0 : e10.refresh_token)) throw new ns();
              let { data: n10, error: s2 } = await this._callRefreshToken(e10.refresh_token);
              return s2 ? this._returnResult({ data: { user: null, session: null }, error: s2 }) : n10 ? this._returnResult({ data: { user: n10.user, session: n10 }, error: null }) : this._returnResult({ data: { user: null, session: null }, error: null });
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _getSessionFromURL(e10, t10) {
          try {
            throw new nl("No browser detected.");
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: { session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        _isImplicitGrantCallback(e10) {
          return "function" == typeof this.detectSessionInUrl ? this.detectSessionInUrl(new URL(window.location.href), e10) : !!(e10.access_token || e10.error_description);
        }
        async _isPKCECallback(e10) {
          let t10 = await nE(this.storage, `${this.storageKey}-code-verifier`);
          return !!(e10.code && t10);
        }
        async signOut(e10 = { scope: "global" }) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._signOut(e10));
        }
        async _signOut({ scope: e10 } = { scope: "global" }) {
          return await this._useSession(async (t10) => {
            var r10;
            let { data: n10, error: s2 } = t10;
            if (s2 && !ni(s2)) return this._returnResult({ error: s2 });
            let i2 = null == (r10 = n10.session) ? void 0 : r10.access_token;
            if (i2) {
              let { error: t11 } = await this.admin.signOut(i2, e10);
              if (t11 && !(ne(t11) && "AuthApiError" === t11.name && (404 === t11.status || 401 === t11.status || 403 === t11.status) || ni(t11))) return this._returnResult({ error: t11 });
            }
            return "others" !== e10 && (await this._removeSession(), await nT(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ error: null });
          });
        }
        onAuthStateChange(e10) {
          let t10 = Symbol("auth-callback"), r10 = { id: t10, callback: e10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", t10), this.stateChangeEmitters.delete(t10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", t10), this.stateChangeEmitters.set(t10, r10), (async () => {
            await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
              this._emitInitialSession(t10);
            });
          })(), { data: { subscription: r10 } };
        }
        async _emitInitialSession(e10) {
          return await this._useSession(async (t10) => {
            var r10, n10;
            try {
              let { data: { session: n11 }, error: s2 } = t10;
              if (s2) throw s2;
              await (null == (r10 = this.stateChangeEmitters.get(e10)) ? void 0 : r10.callback("INITIAL_SESSION", n11)), this._debug("INITIAL_SESSION", "callback id", e10, "session", n11);
            } catch (t11) {
              await (null == (n10 = this.stateChangeEmitters.get(e10)) ? void 0 : n10.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", e10, "error", t11), console.error(t11);
            }
          });
        }
        async resetPasswordForEmail(e10, t10 = {}) {
          let r10 = null, n10 = null;
          "pkce" === this.flowType && ([r10, n10] = await nj(this.storage, this.storageKey, true));
          try {
            return await nM(this.fetch, "POST", `${this.url}/recover`, { body: { email: e10, code_challenge: r10, code_challenge_method: n10, gotrue_meta_security: { captcha_token: t10.captchaToken } }, headers: this.headers, redirectTo: t10.redirectTo });
          } catch (e11) {
            if (await nT(this.storage, `${this.storageKey}-code-verifier`), ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async getUserIdentities() {
          var e10;
          try {
            let { data: t10, error: r10 } = await this.getUser();
            if (r10) throw r10;
            return this._returnResult({ data: { identities: null != (e10 = t10.user.identities) ? e10 : [] }, error: null });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async linkIdentity(e10) {
          return "token" in e10 ? this.linkIdentityIdToken(e10) : this.linkIdentityOAuth(e10);
        }
        async linkIdentityOAuth(e10) {
          try {
            let { data: t10, error: r10 } = await this._useSession(async (t11) => {
              var r11, n10, s2, i2, a2;
              let { data: o2, error: l2 } = t11;
              if (l2) throw l2;
              let u2 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e10.provider, { redirectTo: null == (r11 = e10.options) ? void 0 : r11.redirectTo, scopes: null == (n10 = e10.options) ? void 0 : n10.scopes, queryParams: null == (s2 = e10.options) ? void 0 : s2.queryParams, skipBrowserRedirect: true });
              return await nM(this.fetch, "GET", u2, { headers: this.headers, jwt: null != (a2 = null == (i2 = o2.session) ? void 0 : i2.access_token) ? a2 : void 0 });
            });
            if (r10) throw r10;
            return this._returnResult({ data: { provider: e10.provider, url: null == t10 ? void 0 : t10.url }, error: null });
          } catch (t10) {
            if (ne(t10)) return this._returnResult({ data: { provider: e10.provider, url: null }, error: t10 });
            throw t10;
          }
        }
        async linkIdentityIdToken(e10) {
          return await this._useSession(async (t10) => {
            var r10;
            try {
              let { error: n10, data: { session: s2 } } = t10;
              if (n10) throw n10;
              let { options: i2, provider: a2, token: o2, access_token: l2, nonce: u2 } = e10, { data: c2, error: h2 } = await nM(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, jwt: null != (r10 = null == s2 ? void 0 : s2.access_token) ? r10 : void 0, body: { provider: a2, id_token: o2, access_token: l2, nonce: u2, link_identity: true, gotrue_meta_security: { captcha_token: null == i2 ? void 0 : i2.captchaToken } }, xform: nH });
              if (h2) return this._returnResult({ data: { user: null, session: null }, error: h2 });
              if (!c2 || !c2.session || !c2.user) return this._returnResult({ data: { user: null, session: null }, error: new na() });
              return c2.session && (await this._saveSession(c2.session), await this._notifyAllSubscribers("USER_UPDATED", c2.session)), this._returnResult({ data: c2, error: h2 });
            } catch (e11) {
              if (await nT(this.storage, `${this.storageKey}-code-verifier`), ne(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
              throw e11;
            }
          });
        }
        async unlinkIdentity(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, n10;
              let { data: s2, error: i2 } = t10;
              if (i2) throw i2;
              return await nM(this.fetch, "DELETE", `${this.url}/user/identities/${e10.identity_id}`, { headers: this.headers, jwt: null != (n10 = null == (r10 = s2.session) ? void 0 : r10.access_token) ? n10 : void 0 });
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _refreshAccessToken(e10) {
          let t10 = `#_refreshAccessToken(${e10.substring(0, 5)}...)`;
          this._debug(t10, "begin");
          try {
            var r10, n10;
            let s2 = Date.now();
            return await (r10 = async (r11) => (r11 > 0 && await nx(200 * Math.pow(2, r11 - 1)), this._debug(t10, "refreshing attempt", r11), await nM(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: e10 }, headers: this.headers, xform: nH })), n10 = (e11, t11) => {
              let r11 = 200 * Math.pow(2, e11);
              return t11 && nh(t11) && Date.now() + r11 - s2 < 3e4;
            }, new Promise((e11, t11) => {
              (async () => {
                for (let s3 = 0; s3 < 1 / 0; s3++) try {
                  let t12 = await r10(s3);
                  if (!n10(s3, null, t12)) return void e11(t12);
                } catch (e12) {
                  if (!n10(s3, e12)) return void t11(e12);
                }
              })();
            }));
          } catch (e11) {
            if (this._debug(t10, "error", e11), ne(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          } finally {
            this._debug(t10, "end");
          }
        }
        _isValidSession(e10) {
          return "object" == typeof e10 && null !== e10 && "access_token" in e10 && "refresh_token" in e10 && "expires_at" in e10;
        }
        async _handleProviderSignIn(e10, t10) {
          let r10 = await this._getUrlForProvider(`${this.url}/authorize`, e10, { redirectTo: t10.redirectTo, scopes: t10.scopes, queryParams: t10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", e10, "options", t10, "url", r10), { data: { provider: e10, url: r10 }, error: null };
        }
        async _recoverAndRefresh() {
          var e10, t10;
          let r10 = "#_recoverAndRefresh()";
          this._debug(r10, "begin");
          try {
            let n10 = await nE(this.storage, this.storageKey);
            if (n10 && this.userStorage) {
              let t11 = await nE(this.userStorage, this.storageKey + "-user");
              !this.storage.isServer && Object.is(this.storage, this.userStorage) && !t11 && (t11 = { user: n10.user }, await nk(this.userStorage, this.storageKey + "-user", t11)), n10.user = null != (e10 = null == t11 ? void 0 : t11.user) ? e10 : nU();
            } else if (n10 && !n10.user && !n10.user) {
              let e11 = await nE(this.storage, this.storageKey + "-user");
              e11 && (null == e11 ? void 0 : e11.user) ? (n10.user = e11.user, await nT(this.storage, this.storageKey + "-user"), await nk(this.storage, this.storageKey, n10)) : n10.user = nU();
            }
            if (this._debug(r10, "session from storage", n10), !this._isValidSession(n10)) {
              this._debug(r10, "session is not valid"), null !== n10 && await this._removeSession();
              return;
            }
            let s2 = (null != (t10 = n10.expires_at) ? t10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(r10, `session has${s2 ? "" : " not"} expired with margin of 90000s`), s2) {
              if (this.autoRefreshToken && n10.refresh_token) {
                let { error: e11 } = await this._callRefreshToken(n10.refresh_token);
                e11 && (console.error(e11), nh(e11) || (this._debug(r10, "refresh failed with a non-retryable error, removing the session", e11), await this._removeSession()));
              }
            } else if (n10.user && true === n10.user.__isUserNotAvailableProxy) try {
              let { data: e11, error: t11 } = await this._getUser(n10.access_token);
              !t11 && (null == e11 ? void 0 : e11.user) ? (n10.user = e11.user, await this._saveSession(n10), await this._notifyAllSubscribers("SIGNED_IN", n10)) : this._debug(r10, "could not get user data, skipping SIGNED_IN notification");
            } catch (e11) {
              console.error("Error getting user data:", e11), this._debug(r10, "error getting user data, skipping SIGNED_IN notification", e11);
            }
            else await this._notifyAllSubscribers("SIGNED_IN", n10);
          } catch (e11) {
            this._debug(r10, "error", e11), console.error(e11);
            return;
          } finally {
            this._debug(r10, "end");
          }
        }
        async _callRefreshToken(e10) {
          var t10, r10;
          if (!e10) throw new ns();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          let n10 = `#_callRefreshToken(${e10.substring(0, 5)}...)`;
          this._debug(n10, "begin");
          try {
            this.refreshingDeferred = new nR();
            let { data: t11, error: r11 } = await this._refreshAccessToken(e10);
            if (r11) throw r11;
            if (!t11.session) throw new ns();
            await this._saveSession(t11.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", t11.session);
            let n11 = { data: t11.session, error: null };
            return this.refreshingDeferred.resolve(n11), n11;
          } catch (e11) {
            if (this._debug(n10, "error", e11), ne(e11)) {
              let r11 = { data: null, error: e11 };
              return nh(e11) || await this._removeSession(), null == (t10 = this.refreshingDeferred) || t10.resolve(r11), r11;
            }
            throw null == (r10 = this.refreshingDeferred) || r10.reject(e11), e11;
          } finally {
            this.refreshingDeferred = null, this._debug(n10, "end");
          }
        }
        async _notifyAllSubscribers(e10, t10, r10 = true) {
          let n10 = `#_notifyAllSubscribers(${e10})`;
          this._debug(n10, "begin", t10, `broadcast = ${r10}`);
          try {
            this.broadcastChannel && r10 && this.broadcastChannel.postMessage({ event: e10, session: t10 });
            let n11 = [], s2 = Array.from(this.stateChangeEmitters.values()).map(async (r11) => {
              try {
                await r11.callback(e10, t10);
              } catch (e11) {
                n11.push(e11);
              }
            });
            if (await Promise.all(s2), n11.length > 0) {
              for (let e11 = 0; e11 < n11.length; e11 += 1) console.error(n11[e11]);
              throw n11[0];
            }
          } finally {
            this._debug(n10, "end");
          }
        }
        async _saveSession(e10) {
          this._debug("#_saveSession()", e10), this.suppressGetSessionWarning = true, await nT(this.storage, `${this.storageKey}-code-verifier`);
          let t10 = Object.assign({}, e10), r10 = t10.user && true === t10.user.__isUserNotAvailableProxy;
          if (this.userStorage) {
            !r10 && t10.user && await nk(this.userStorage, this.storageKey + "-user", { user: t10.user });
            let e11 = Object.assign({}, t10);
            delete e11.user;
            let n10 = nL(e11);
            await nk(this.storage, this.storageKey, n10);
          } else {
            let e11 = nL(t10);
            await nk(this.storage, this.storageKey, e11);
          }
        }
        async _removeSession() {
          this._debug("#_removeSession()"), this.suppressGetSessionWarning = false, await nT(this.storage, this.storageKey), await nT(this.storage, this.storageKey + "-code-verifier"), await nT(this.storage, this.storageKey + "-user"), this.userStorage && await nT(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()"), this.visibilityChangedCallback, this.visibilityChangedCallback = null;
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let e10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = e10, e10 && "object" == typeof e10 && "function" == typeof e10.unref ? e10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(e10);
          let t10 = setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
          this.autoRefreshTickTimeout = t10, t10 && "object" == typeof t10 && "function" == typeof t10.unref ? t10.unref() : "u" > typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(t10);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let e10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, e10 && clearInterval(e10);
          let t10 = this.autoRefreshTickTimeout;
          this.autoRefreshTickTimeout = null, t10 && clearTimeout(t10);
        }
        async startAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
        }
        async stopAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
        }
        async _autoRefreshTokenTick() {
          this._debug("#_autoRefreshTokenTick()", "begin");
          try {
            await this._acquireLock(0, async () => {
              try {
                let e10 = Date.now();
                try {
                  return await this._useSession(async (t10) => {
                    let { data: { session: r10 } } = t10;
                    if (!r10 || !r10.refresh_token || !r10.expires_at) return void this._debug("#_autoRefreshTokenTick()", "no session");
                    let n10 = Math.floor((1e3 * r10.expires_at - e10) / 3e4);
                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${n10} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), n10 <= 3 && await this._callRefreshToken(r10.refresh_token);
                  });
                } catch (e11) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", e11);
                }
              } finally {
                this._debug("#_autoRefreshTokenTick()", "end");
              }
            });
          } catch (e10) {
            if (e10.isAcquireTimeout || e10 instanceof nQ) this._debug("auto refresh token tick lock not available");
            else throw e10;
          }
        }
        async _handleVisibilityChange() {
          return this._debug("#_handleVisibilityChange()"), this.autoRefreshToken && this.startAutoRefresh(), false;
        }
        async _onVisibilityChanged(e10) {
          let t10 = `#_onVisibilityChanged(${e10})`;
          this._debug(t10, "visibilityState", document.visibilityState), "visible" === document.visibilityState ? (this.autoRefreshToken && this._startAutoRefresh(), e10 || (await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
            "visible" !== document.visibilityState ? this._debug(t10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting") : await this._recoverAndRefresh();
          }))) : "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(e10, t10, r10) {
          let n10 = [`provider=${encodeURIComponent(t10)}`];
          if ((null == r10 ? void 0 : r10.redirectTo) && n10.push(`redirect_to=${encodeURIComponent(r10.redirectTo)}`), (null == r10 ? void 0 : r10.scopes) && n10.push(`scopes=${encodeURIComponent(r10.scopes)}`), "pkce" === this.flowType) {
            let [e11, t11] = await nj(this.storage, this.storageKey), r11 = new URLSearchParams({ code_challenge: `${encodeURIComponent(e11)}`, code_challenge_method: `${encodeURIComponent(t11)}` });
            n10.push(r11.toString());
          }
          if (null == r10 ? void 0 : r10.queryParams) {
            let e11 = new URLSearchParams(r10.queryParams);
            n10.push(e11.toString());
          }
          return (null == r10 ? void 0 : r10.skipBrowserRedirect) && n10.push(`skip_http_redirect=${r10.skipBrowserRedirect}`), `${e10}?${n10.join("&")}`;
        }
        async _unenroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              let { data: n10, error: s2 } = t10;
              return s2 ? this._returnResult({ data: null, error: s2 }) : await nM(this.fetch, "DELETE", `${this.url}/factors/${e10.factorId}`, { headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _enroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, n10;
              let { data: s2, error: i2 } = t10;
              if (i2) return this._returnResult({ data: null, error: i2 });
              let a2 = Object.assign({ friendly_name: e10.friendlyName, factor_type: e10.factorType }, "phone" === e10.factorType ? { phone: e10.phone } : "totp" === e10.factorType ? { issuer: e10.issuer } : {}), { data: o2, error: l2 } = await nM(this.fetch, "POST", `${this.url}/factors`, { body: a2, headers: this.headers, jwt: null == (r10 = null == s2 ? void 0 : s2.session) ? void 0 : r10.access_token });
              return l2 ? this._returnResult({ data: null, error: l2 }) : ("totp" === e10.factorType && "totp" === o2.type && (null == (n10 = null == o2 ? void 0 : o2.totp) ? void 0 : n10.qr_code) && (o2.totp.qr_code = `data:image/svg+xml;utf-8,${o2.totp.qr_code}`), this._returnResult({ data: o2, error: null }));
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _verify(e10) {
          return this._acquireLock(this.lockAcquireTimeout, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10, n10, s2;
                let { data: i2, error: a2 } = t10;
                if (a2) return this._returnResult({ data: null, error: a2 });
                let o2 = Object.assign({ challenge_id: e10.challengeId }, "webauthn" in e10 ? { webauthn: Object.assign(Object.assign({}, e10.webauthn), { credential_response: "create" === e10.webauthn.type ? (n10 = e10.webauthn.credential_response, "toJSON" in n10 && "function" == typeof n10.toJSON ? n10.toJSON() : { id: n10.id, rawId: n10.id, response: { attestationObject: n_(new Uint8Array(n10.response.attestationObject)), clientDataJSON: n_(new Uint8Array(n10.response.clientDataJSON)) }, type: "public-key", clientExtensionResults: n10.getClientExtensionResults(), authenticatorAttachment: null != (s2 = n10.authenticatorAttachment) ? s2 : void 0 }) : function(e11) {
                  var t11;
                  if ("toJSON" in e11 && "function" == typeof e11.toJSON) return e11.toJSON();
                  let r11 = e11.getClientExtensionResults(), n11 = e11.response;
                  return { id: e11.id, rawId: e11.id, response: { authenticatorData: n_(new Uint8Array(n11.authenticatorData)), clientDataJSON: n_(new Uint8Array(n11.clientDataJSON)), signature: n_(new Uint8Array(n11.signature)), userHandle: n11.userHandle ? n_(new Uint8Array(n11.userHandle)) : void 0 }, type: "public-key", clientExtensionResults: r11, authenticatorAttachment: null != (t11 = e11.authenticatorAttachment) ? t11 : void 0 };
                }(e10.webauthn.credential_response) }) } : { code: e10.code }), { data: l2, error: u2 } = await nM(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/verify`, { body: o2, headers: this.headers, jwt: null == (r10 = null == i2 ? void 0 : i2.session) ? void 0 : r10.access_token });
                return u2 ? this._returnResult({ data: null, error: u2 }) : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + l2.expires_in }, l2)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", l2), this._returnResult({ data: l2, error: u2 }));
              });
            } catch (e11) {
              if (ne(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          });
        }
        async _challenge(e10) {
          return this._acquireLock(this.lockAcquireTimeout, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10;
                let { data: n10, error: s2 } = t10;
                if (s2) return this._returnResult({ data: null, error: s2 });
                let i2 = await nM(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/challenge`, { body: e10, headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
                if (i2.error) return i2;
                let { data: a2 } = i2;
                if ("webauthn" !== a2.type) return { data: a2, error: null };
                switch (a2.webauthn.type) {
                  case "create":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: function(e11) {
                      if (!e11) throw Error("Credential creation options are required");
                      if ("u" > typeof PublicKeyCredential && "parseCreationOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseCreationOptionsFromJSON) return PublicKeyCredential.parseCreationOptionsFromJSON(e11);
                      let { challenge: t11, user: r11, excludeCredentials: n11 } = e11, s3 = tG(e11, ["challenge", "user", "excludeCredentials"]), i3 = nv(t11).buffer, a3 = Object.assign(Object.assign({}, r11), { id: nv(r11.id).buffer }), o2 = Object.assign(Object.assign({}, s3), { challenge: i3, user: a3 });
                      if (n11 && n11.length > 0) {
                        o2.excludeCredentials = Array(n11.length);
                        for (let e12 = 0; e12 < n11.length; e12++) {
                          let t12 = n11[e12];
                          o2.excludeCredentials[e12] = Object.assign(Object.assign({}, t12), { id: nv(t12.id).buffer, type: t12.type || "public-key", transports: t12.transports });
                        }
                      }
                      return o2;
                    }(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                  case "request":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: function(e11) {
                      if (!e11) throw Error("Credential request options are required");
                      if ("u" > typeof PublicKeyCredential && "parseRequestOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseRequestOptionsFromJSON) return PublicKeyCredential.parseRequestOptionsFromJSON(e11);
                      let { challenge: t11, allowCredentials: r11 } = e11, n11 = tG(e11, ["challenge", "allowCredentials"]), s3 = nv(t11).buffer, i3 = Object.assign(Object.assign({}, n11), { challenge: s3 });
                      if (r11 && r11.length > 0) {
                        i3.allowCredentials = Array(r11.length);
                        for (let e12 = 0; e12 < r11.length; e12++) {
                          let t12 = r11[e12];
                          i3.allowCredentials[e12] = Object.assign(Object.assign({}, t12), { id: nv(t12.id).buffer, type: t12.type || "public-key", transports: t12.transports });
                        }
                      }
                      return i3;
                    }(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                }
              });
            } catch (e11) {
              if (ne(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          });
        }
        async _challengeAndVerify(e10) {
          let { data: t10, error: r10 } = await this._challenge({ factorId: e10.factorId });
          return r10 ? this._returnResult({ data: null, error: r10 }) : await this._verify({ factorId: e10.factorId, challengeId: t10.id, code: e10.code });
        }
        async _listFactors() {
          var e10;
          let { data: { user: t10 }, error: r10 } = await this.getUser();
          if (r10) return { data: null, error: r10 };
          let n10 = { all: [], phone: [], totp: [], webauthn: [] };
          for (let r11 of null != (e10 = null == t10 ? void 0 : t10.factors) ? e10 : []) n10.all.push(r11), "verified" === r11.status && n10[r11.factor_type].push(r11);
          return { data: n10, error: null };
        }
        async _getAuthenticatorAssuranceLevel(e10) {
          var t10, r10, n10, s2;
          if (e10) try {
            let { payload: n11 } = nO(e10), s3 = null;
            n11.aal && (s3 = n11.aal);
            let i3 = s3, { data: { user: a3 }, error: o3 } = await this.getUser(e10);
            if (o3) return this._returnResult({ data: null, error: o3 });
            (null != (r10 = null == (t10 = null == a3 ? void 0 : a3.factors) ? void 0 : t10.filter((e11) => "verified" === e11.status)) ? r10 : []).length > 0 && (i3 = "aal2");
            let l3 = n11.amr || [];
            return { data: { currentLevel: s3, nextLevel: i3, currentAuthenticationMethods: l3 }, error: null };
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
          let { data: { session: i2 }, error: a2 } = await this.getSession();
          if (a2) return this._returnResult({ data: null, error: a2 });
          if (!i2) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
          let { payload: o2 } = nO(i2.access_token), l2 = null;
          o2.aal && (l2 = o2.aal);
          let u2 = l2;
          return (null != (s2 = null == (n10 = i2.user.factors) ? void 0 : n10.filter((e11) => "verified" === e11.status)) ? s2 : []).length > 0 && (u2 = "aal2"), { data: { currentLevel: l2, nextLevel: u2, currentAuthenticationMethods: o2.amr || [] }, error: null };
        }
        async _getAuthorizationDetails(e10) {
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              return n10 ? this._returnResult({ data: null, error: n10 }) : r10 ? await nM(this.fetch, "GET", `${this.url}/oauth/authorizations/${e10}`, { headers: this.headers, jwt: r10.access_token, xform: (e11) => ({ data: e11, error: null }) }) : this._returnResult({ data: null, error: new ns() });
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _approveAuthorization(e10, t10) {
          try {
            return await this._useSession(async (t11) => {
              let { data: { session: r10 }, error: n10 } = t11;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new ns() });
              let s2 = await nM(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: r10.access_token, body: { action: "approve" }, xform: (e11) => ({ data: e11, error: null }) });
              return s2.data && s2.data.redirect_url, s2;
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _denyAuthorization(e10, t10) {
          try {
            return await this._useSession(async (t11) => {
              let { data: { session: r10 }, error: n10 } = t11;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!r10) return this._returnResult({ data: null, error: new ns() });
              let s2 = await nM(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: r10.access_token, body: { action: "deny" }, xform: (e11) => ({ data: e11, error: null }) });
              return s2.data && s2.data.redirect_url, s2;
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _listOAuthGrants() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              return r10 ? this._returnResult({ data: null, error: r10 }) : t10 ? await nM(this.fetch, "GET", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: t10.access_token, xform: (e11) => ({ data: e11, error: null }) }) : this._returnResult({ data: null, error: new ns() });
            });
          } catch (e10) {
            if (ne(e10)) return this._returnResult({ data: null, error: e10 });
            throw e10;
          }
        }
        async _revokeOAuthGrant(e10) {
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: n10 } = t10;
              return n10 ? this._returnResult({ data: null, error: n10 }) : r10 ? (await nM(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: r10.access_token, query: { client_id: e10.clientId }, noResolveJson: true }), { data: {}, error: null }) : this._returnResult({ data: null, error: new ns() });
            });
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async fetchJwk(e10, t10 = { keys: [] }) {
          let r10 = t10.keys.find((t11) => t11.kid === e10);
          if (r10) return r10;
          let n10 = Date.now();
          if ((r10 = this.jwks.keys.find((t11) => t11.kid === e10)) && this.jwks_cached_at + 6e5 > n10) return r10;
          let { data: s2, error: i2 } = await nM(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (i2) throw i2;
          return s2.keys && 0 !== s2.keys.length && (this.jwks = s2, this.jwks_cached_at = n10, r10 = s2.keys.find((t11) => t11.kid === e10)) ? r10 : null;
        }
        async getClaims(e10, t10 = {}) {
          try {
            var r10;
            let n10, s2 = e10;
            if (!s2) {
              let { data: e11, error: t11 } = await this.getSession();
              if (t11 || !e11.session) return this._returnResult({ data: null, error: t11 });
              s2 = e11.session.access_token;
            }
            let { header: i2, payload: a2, signature: o2, raw: { header: l2, payload: u2 } } = nO(s2);
            (null == t10 ? void 0 : t10.allowExpired) || function(e11) {
              if (!e11) throw Error("Missing exp claim");
              if (e11 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            }(a2.exp);
            let c2 = !i2.alg || i2.alg.startsWith("HS") || !i2.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(i2.kid, (null == t10 ? void 0 : t10.keys) ? { keys: t10.keys } : null == t10 ? void 0 : t10.jwks);
            if (!c2) {
              let { error: e11 } = await this.getUser(s2);
              if (e11) throw e11;
              return { data: { claims: a2, header: i2, signature: o2 }, error: null };
            }
            let h2 = function(e11) {
              switch (e11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            }(i2.alg), d2 = await crypto.subtle.importKey("jwk", c2, h2, true, ["verify"]);
            if (!await crypto.subtle.verify(h2, d2, o2, (r10 = `${l2}.${u2}`, n10 = [], !function(e11, t11) {
              for (let r11 = 0; r11 < e11.length; r11 += 1) {
                let n11 = e11.charCodeAt(r11);
                if (n11 > 55295 && n11 <= 56319) {
                  let t12 = (n11 - 55296) * 1024 & 65535;
                  n11 = (e11.charCodeAt(r11 + 1) - 56320 & 65535 | t12) + 65536, r11 += 1;
                }
                !function(e12, t12) {
                  if (e12 <= 127) return t12(e12);
                  if (e12 <= 2047) {
                    t12(192 | e12 >> 6), t12(128 | 63 & e12);
                    return;
                  }
                  if (e12 <= 65535) {
                    t12(224 | e12 >> 12), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                    return;
                  }
                  if (e12 <= 1114111) {
                    t12(240 | e12 >> 18), t12(128 | e12 >> 12 & 63), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                    return;
                  }
                  throw Error(`Unrecognized Unicode codepoint: ${e12.toString(16)}`);
                }(n11, t11);
              }
            }(r10, (e11) => n10.push(e11)), new Uint8Array(n10)))) throw new np("Invalid JWT signature");
            return { data: { claims: a2, header: i2, signature: o2 }, error: null };
          } catch (e11) {
            if (ne(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
      }
      sn.nextInstanceID = {};
      let ss = sn, si = "";
      si = "u" > typeof Deno ? "deno" : "u" > typeof document ? "web" : "u" > typeof navigator && "ReactNative" === navigator.product ? "react-native" : "node";
      let sa = { headers: { "X-Client-Info": `supabase-js-${si}/2.94.0` } }, so = { schema: "public" }, sl = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, su = {};
      function sc(e10) {
        return (sc = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function sh(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var n10 = Object.getOwnPropertySymbols(e10);
          t10 && (n10 = n10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, n10);
        }
        return r10;
      }
      function sd(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? sh(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var n10;
              (n10 = function(e12, t13) {
                if ("object" != sc(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var n11 = r12.call(e12, t13 || "default");
                  if ("object" != sc(n11)) return n11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == sc(n10) ? n10 : n10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : sh(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      var sp = class extends ss {
        constructor(e10) {
          super(e10);
        }
      }, sf = class {
        constructor(e10, t10, r10) {
          var n10, s2, i2;
          this.supabaseUrl = e10, this.supabaseKey = t10;
          const a2 = function(e11) {
            let t11 = null == e11 ? void 0 : e11.trim();
            if (!t11) throw Error("supabaseUrl is required.");
            if (!t11.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
              return new URL(t11.endsWith("/") ? t11 : t11 + "/");
            } catch (e12) {
              throw Error("Invalid supabaseUrl: Provided URL is malformed.");
            }
          }(e10);
          if (!t10) throw Error("supabaseKey is required.");
          this.realtimeUrl = new URL("realtime/v1", a2), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", a2), this.storageUrl = new URL("storage/v1", a2), this.functionsUrl = new URL("functions/v1", a2);
          const o2 = `sb-${a2.hostname.split(".")[0]}-auth-token`, l2 = function(e11, t11) {
            var r11, n11;
            let { db: s3, auth: i3, realtime: a3, global: o3 } = e11, { db: l3, auth: u2, realtime: c2, global: h2 } = t11, d2 = { db: sd(sd({}, l3), s3), auth: sd(sd({}, u2), i3), realtime: sd(sd({}, c2), a3), storage: {}, global: sd(sd(sd({}, h2), o3), {}, { headers: sd(sd({}, null != (r11 = null == h2 ? void 0 : h2.headers) ? r11 : {}), null != (n11 = null == o3 ? void 0 : o3.headers) ? n11 : {}) }), accessToken: async () => "" };
            return e11.accessToken ? d2.accessToken = e11.accessToken : delete d2.accessToken, d2;
          }(null != r10 ? r10 : {}, { db: so, realtime: su, auth: sd(sd({}, sl), {}, { storageKey: o2 }), global: sa });
          this.storageKey = null != (n10 = l2.auth.storageKey) ? n10 : "", this.headers = null != (s2 = l2.global.headers) ? s2 : {}, l2.accessToken ? (this.accessToken = l2.accessToken, this.auth = new Proxy({}, { get: (e11, t11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null != (i2 = l2.auth) ? i2 : {}, this.headers, l2.global.fetch), this.fetch = /* @__PURE__ */ ((e11, t11, r11) => {
            let n11 = r11 ? (...e12) => r11(...e12) : (...e12) => fetch(...e12), s3 = Headers;
            return async (r12, i3) => {
              var a3;
              let o3 = null != (a3 = await t11()) ? a3 : e11, l3 = new s3(null == i3 ? void 0 : i3.headers);
              return l3.has("apikey") || l3.set("apikey", e11), l3.has("Authorization") || l3.set("Authorization", `Bearer ${o3}`), n11(r12, sd(sd({}, i3), {}, { headers: l3 }));
            };
          })(t10, this._getAccessToken.bind(this), l2.global.fetch), this.realtime = this._initRealtimeClient(sd({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, l2.realtime)), this.accessToken && Promise.resolve(this.accessToken()).then((e11) => this.realtime.setAuth(e11)).catch((e11) => console.warn("Failed to set initial Realtime auth token:", e11)), this.rest = new t6(new URL("rest/v1", a2).href, { headers: this.headers, schema: l2.db.schema, fetch: this.fetch, timeout: l2.db.timeout, urlLengthLimit: l2.db.urlLengthLimit }), this.storage = new r3(this.storageUrl.href, this.headers, this.fetch, null == r10 ? void 0 : r10.storage), l2.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new tJ(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        from(e10) {
          return this.rest.from(e10);
        }
        schema(e10) {
          return this.rest.schema(e10);
        }
        rpc(e10, t10 = {}, r10 = { head: false, get: false, count: void 0 }) {
          return this.rest.rpc(e10, t10, r10);
        }
        channel(e10, t10 = { config: {} }) {
          return this.realtime.channel(e10, t10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(e10) {
          return this.realtime.removeChannel(e10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        async _getAccessToken() {
          var e10, t10;
          if (this.accessToken) return await this.accessToken();
          let { data: r10 } = await this.auth.getSession();
          return null != (e10 = null == (t10 = r10.session) ? void 0 : t10.access_token) ? e10 : this.supabaseKey;
        }
        _initSupabaseAuthClient({ autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: n10, userStorage: s2, storageKey: i2, flowType: a2, lock: o2, debug: l2, throwOnError: u2 }, c2, h2) {
          let d2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new sp({ url: this.authUrl.href, headers: sd(sd({}, d2), c2), storageKey: i2, autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: n10, userStorage: s2, flowType: a2, lock: o2, debug: l2, throwOnError: u2, fetch: h2, hasCustomAuthorizationHeader: Object.keys(this.headers).some((e11) => "authorization" === e11.toLowerCase()) });
        }
        _initRealtimeClient(e10) {
          return new rm(this.realtimeUrl.href, sd(sd({}, e10), {}, { params: sd(sd({}, { apikey: this.supabaseKey }), null == e10 ? void 0 : e10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((e10, t10) => {
            this._handleTokenChanged(e10, "CLIENT", null == t10 ? void 0 : t10.access_token);
          });
        }
        _handleTokenChanged(e10, t10, r10) {
          ("TOKEN_REFRESHED" === e10 || "SIGNED_IN" === e10) && this.changedAccessToken !== r10 ? (this.changedAccessToken = r10, this.realtime.setAuth(r10)) : "SIGNED_OUT" === e10 && (this.realtime.setAuth(), "STORAGE" == t10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      };
      if (function() {
        let e10 = globalThis.process;
        if (!e10) return false;
        let t10 = e10.version;
        if (null == t10) return false;
        let r10 = t10.match(/^v(\d+)\./);
        return !!r10 && 18 >= parseInt(r10[1], 10);
      }() && console.warn("\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217"), e.i(739990), "u" > typeof process && process.env?.npm_package_name) {
        let e10 = process.env.npm_package_name;
        ["@supabase/auth-helpers-nextjs", "@supabase/auth-helpers-react", "@supabase/auth-helpers-remix", "@supabase/auth-helpers-sveltekit"].includes(e10) && console.warn(`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551 \u26A0\uFE0F  IMPORTANT: Package Consolidation Notice                                \u2551
\u2551                                                                            \u2551
\u2551 The ${e10.padEnd(35)} package name is deprecated.  \u2551
\u2551                                                                            \u2551
\u2551 You are now using @supabase/ssr - a unified solution for all frameworks.  \u2551
\u2551                                                                            \u2551
\u2551 The auth-helpers packages have been consolidated into @supabase/ssr       \u2551
\u2551 to provide better maintenance and consistent APIs across frameworks.      \u2551
\u2551                                                                            \u2551
\u2551 Please update your package.json to use @supabase/ssr directly:            \u2551
\u2551   npm uninstall ${e10.padEnd(42)} \u2551
\u2551   npm install @supabase/ssr                                               \u2551
\u2551                                                                            \u2551
\u2551 For more information, visit:                                              \u2551
\u2551 https://supabase.com/docs/guides/auth/server-side                         \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
    `);
      }
      e.i(164445), "u" < typeof URLPattern || URLPattern;
      var sg = e.i(40049);
      if (/* @__PURE__ */ new WeakMap(), sg.default.unstable_postpone, false === ("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("needs to bail out of prerendering at this point because it used") && "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      async function sm(e10) {
        if (e10.nextUrl.pathname.startsWith("/debug-auth")) return e_.redirect(new URL("/", e10.url));
        let t10 = e_.next({ request: e10 }), r10 = "https://ejdwrepyuznanwujidai.supabase.co", n10 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZHdyZXB5dXpuYW53dWppZGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjk3NTYsImV4cCI6MjA4Mzk0NTc1Nn0.MRJe6csColzMRDpAWa-Ma99noAk6n8SbnXXHP2rNAJ4";
        if (!r10 || !n10 || r10.includes("placeholder")) return t10;
        let s2 = function(e11, t11, r11) {
          if (!e11 || !t11) throw Error(`Your project's URL and Key are required to create a Supabase client!

Check your Supabase project's API settings to find these values

https://supabase.com/dashboard/project/_/settings/api`);
          let { storage: n11, getAll: s3, setAll: i3, setItems: a2, removedItems: o2 } = function(e12, t12) {
            let r12, n12, s4 = e12.cookies ?? null, i4 = e12.cookieEncoding, a3 = {}, o3 = {};
            if (s4) if ("get" in s4) {
              let e13 = async (e14) => {
                let t13 = e14.flatMap((e15) => [e15, ...Array.from({ length: 5 }).map((t14, r14) => `${e15}.${r14}`)]), r13 = [];
                for (let e15 = 0; e15 < t13.length; e15 += 1) {
                  let n13 = await s4.get(t13[e15]);
                  (n13 || "string" == typeof n13) && r13.push({ name: t13[e15], value: n13 });
                }
                return r13;
              };
              if (r12 = async (t13) => await e13(t13), "set" in s4 && "remove" in s4) n12 = async (e14) => {
                for (let t13 = 0; t13 < e14.length; t13 += 1) {
                  let { name: r13, value: n13, options: i5 } = e14[t13];
                  n13 ? await s4.set(r13, n13, i5) : await s4.remove(r13, i5);
                }
              };
              else if (t12) n12 = async () => {
                console.warn("@supabase/ssr: createServerClient was configured without set and remove cookie methods, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness. Consider switching to the getAll and setAll cookie methods instead of get, set and remove which are deprecated and can be difficult to use correctly.");
              };
              else throw Error("@supabase/ssr: createBrowserClient requires configuring a getAll and setAll cookie method (deprecated: alternatively both get, set and remove can be used)");
            } else if ("getAll" in s4) if (r12 = async () => await s4.getAll(), "setAll" in s4) n12 = s4.setAll;
            else if (t12) n12 = async () => {
              console.warn("@supabase/ssr: createServerClient was configured without the setAll cookie method, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness.");
            };
            else throw Error("@supabase/ssr: createBrowserClient requires configuring both getAll and setAll cookie methods (deprecated: alternatively both get, set and remove can be used)");
            else throw Error(`@supabase/ssr: ${t12 ? "createServerClient" : "createBrowserClient"} requires configuring getAll and setAll cookie methods (deprecated: alternatively use get, set and remove).`);
            else if (t12 || 1) if (t12) throw Error("@supabase/ssr: createServerClient must be initialized with cookie options that specify getAll and setAll functions (deprecated, not recommended: alternatively use get, set and remove)");
            else r12 = () => [], n12 = () => {
              throw Error("@supabase/ssr: createBrowserClient in non-browser runtimes (including Next.js pre-rendering mode) was not initialized cookie options that specify getAll and setAll functions (deprecated: alternatively use get, set and remove), but they were needed");
            };
            else r12 = () => {
              let e13;
              return Object.keys(e13 = (0, tP.parse)(document.cookie)).map((t13) => ({ name: t13, value: e13[t13] ?? "" }));
            }, n12 = (e13) => {
              e13.forEach(({ name: e14, value: t13, options: r13 }) => {
                document.cookie = (0, tP.serialize)(e14, t13, r13);
              });
            };
            return t12 ? { getAll: r12, setAll: n12, setItems: a3, removedItems: o3, storage: { isServer: true, getItem: async (e13) => {
              if ("string" == typeof a3[e13]) return a3[e13];
              if (o3[e13]) return null;
              let t13 = await r12([e13]), n13 = await tU(e13, async (e14) => {
                let r13 = t13?.find(({ name: t14 }) => t14 === e14) || null;
                return r13 ? r13.value : null;
              });
              if (!n13) return null;
              let s5 = n13;
              return "string" == typeof n13 && n13.startsWith(tW) && (s5 = tM(n13.substring(tW.length))), s5;
            }, setItem: async (t13, s5) => {
              t13.endsWith("-code-verifier") && await tH({ getAll: r12, setAll: n12, setItems: { [t13]: s5 }, removedItems: {} }, { cookieOptions: e12?.cookieOptions ?? null, cookieEncoding: i4 }), a3[t13] = s5, delete o3[t13];
            }, removeItem: async (e13) => {
              delete a3[e13], o3[e13] = true;
            } } } : { getAll: r12, setAll: n12, setItems: a3, removedItems: o3, storage: { isServer: false, getItem: async (e13) => {
              let t13 = await r12([e13]), n13 = await tU(e13, async (e14) => {
                let r13 = t13?.find(({ name: t14 }) => t14 === e14) || null;
                return r13 ? r13.value : null;
              });
              if (!n13) return null;
              let s5 = n13;
              return n13.startsWith(tW) && (s5 = tM(n13.substring(tW.length))), s5;
            }, setItem: async (t13, s5) => {
              let a4 = await r12([t13]), o4 = new Set((a4?.map(({ name: e13 }) => e13) || []).filter((e13) => t$(e13, t13))), l3 = s5;
              "base64url" === i4 && (l3 = tW + tB(s5));
              let u2 = tN(t13, l3);
              u2.forEach(({ name: e13 }) => {
                o4.delete(e13);
              });
              let c2 = { ...tj, ...e12?.cookieOptions, maxAge: 0 }, h2 = { ...tj, ...e12?.cookieOptions, maxAge: tj.maxAge };
              delete c2.name, delete h2.name;
              let d2 = [...[...o4].map((e13) => ({ name: e13, value: "", options: c2 })), ...u2.map(({ name: e13, value: t14 }) => ({ name: e13, value: t14, options: h2 }))];
              d2.length > 0 && await n12(d2);
            }, removeItem: async (t13) => {
              let s5 = await r12([t13]), i5 = (s5?.map(({ name: e13 }) => e13) || []).filter((e13) => t$(e13, t13)), a4 = { ...tj, ...e12?.cookieOptions, maxAge: 0 };
              delete a4.name, i5.length > 0 && await n12(i5.map((e13) => ({ name: e13, value: "", options: a4 })));
            } } };
          }({ ...r11, cookieEncoding: r11?.cookieEncoding ?? "base64url" }, true), l2 = new sf(e11, t11, { ...r11, global: { ...r11?.global, headers: { ...r11?.global?.headers, "X-Client-Info": "supabase-ssr/0.8.0 createServerClient" } }, auth: { ...r11?.cookieOptions?.name ? { storageKey: r11.cookieOptions.name } : null, ...r11?.auth, flowType: "pkce", autoRefreshToken: false, detectSessionInUrl: false, persistSession: true, storage: n11, ...r11?.cookies && "encode" in r11.cookies && "tokens-only" === r11.cookies.encode ? { userStorage: r11?.auth?.userStorage ?? /* @__PURE__ */ function(e12 = {}) {
            return { getItem: (t12) => e12[t12] || null, setItem: (t12, r12) => {
              e12[t12] = r12;
            }, removeItem: (t12) => {
              delete e12[t12];
            } };
          }() } : null } });
          return l2.auth.onAuthStateChange(async (e12) => {
            (Object.keys(a2).length > 0 || Object.keys(o2).length > 0) && ("SIGNED_IN" === e12 || "TOKEN_REFRESHED" === e12 || "USER_UPDATED" === e12 || "PASSWORD_RECOVERY" === e12 || "SIGNED_OUT" === e12 || "MFA_CHALLENGE_VERIFIED" === e12) && await tH({ getAll: s3, setAll: i3, setItems: a2, removedItems: o2 }, { cookieOptions: r11?.cookieOptions ?? null, cookieEncoding: r11?.cookieEncoding ?? "base64url" });
          }), l2;
        }(r10, n10, { cookies: { getAll: () => e10.cookies.getAll(), setAll(r11) {
          r11.forEach(({ name: t11, value: r12, options: n11 }) => {
            e10.cookies.set(t11, r12);
          }), t10 = e_.next({ request: e10 }), r11.forEach(({ name: r12, value: n11, options: s3 }) => {
            let i3 = "https:" === e10.nextUrl.protocol || true;
            t10.cookies.set(r12, n11, { ...s3, secure: i3, sameSite: "lax", path: "/" });
          });
        } } }), i2 = null;
        try {
          let { data: { session: e11 } } = await s2.auth.getSession();
          i2 = e11;
        } catch (e11) {
          return console.error("Middleware: Supabase connection error", e11), t10;
        }
        if ([].some((t11) => e10.nextUrl.pathname.startsWith(t11)) && !i2) {
          let t11 = new URL("/auth/login", e10.url);
          return t11.searchParams.set("redirect", e10.nextUrl.pathname), e_.redirect(t11);
        }
        if (e10.nextUrl.pathname.startsWith("/admin")) {
          if (!i2) {
            let t11 = new URL("/auth/login", e10.url);
            return t11.searchParams.set("redirect", e10.nextUrl.pathname), e_.redirect(t11);
          }
          try {
            let { data: t11 } = await s2.from("profiles").select("role").eq("id", i2.user.id).single();
            if (!t11 || "admin" !== t11.role) return e_.redirect(new URL("/", e10.url));
          } catch (t11) {
            return console.error("Middleware: Profile query error", t11), e_.redirect(new URL("/", e10.url));
          }
        }
        return t10;
      }
      RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)`), RegExp(`\\n\\s+at __next_metadata_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_viewport_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_outlet_boundary__[\\n\\s]`), e.s([], 985835), e.i(985835), e.s(["config", 0, { matcher: ["/admin/:path*", "/debug-auth"] }, "middleware", () => sm], 196592);
      var sy = e.i(196592);
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let sb = { ...sy }, sw = "/middleware", sv = sb.middleware || sb.default;
      if ("function" != typeof sv) throw new class extends Error {
        constructor(e10) {
          super(e10), this.stack = "";
        }
      }(`The Middleware file "${sw}" must export a function named \`middleware\` or a default function.`);
      e.s(["default", 0, (e10) => tA({ ...e10, page: sw, handler: async (...e11) => {
        try {
          return await sv(...e11);
        } catch (s2) {
          let t10 = e11[0], r10 = new URL(t10.url), n10 = r10.pathname + r10.search;
          throw await o(s2, { path: n10, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), s2;
        }
      } })], 558217);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_851fa7d3.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_851fa7d3 = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_851fa7d3.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_851fa7d3.js", { otherChunks: ["chunks/[root-of-the-server]__2112c9b3._.js", "chunks/[root-of-the-server]__4d77b799._.js"], runtimeModuleIds: [435825] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = /* @__PURE__ */ new WeakMap();
      function r(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let n = r.prototype, o = Object.prototype.hasOwnProperty, u = "u" > typeof Symbol && Symbol.toStringTag;
      function l(e2, t2, r2) {
        o.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function i(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = s(t2), e2[t2] = r2), r2;
      }
      function s(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function a(e2, t2) {
        l(e2, "__esModule", { value: true }), u && l(e2, u, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          if ("number" == typeof o2) if (0 === o2) l(e2, n2, { value: t2[r2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[r2] ? l(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : l(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      n.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = i(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, a(n2, e2);
      }, n.j = function(e2, r2) {
        var n2, u2;
        let l2, s2, a2;
        null != r2 ? s2 = (l2 = i(this.c, r2)).exports : (l2 = this.m, s2 = this.e);
        let c2 = (n2 = l2, u2 = s2, (a2 = t.get(n2)) || (t.set(n2, a2 = []), n2.exports = n2.namespaceObject = new Proxy(u2, { get(e3, t2) {
          if (o.call(e3, t2) || "default" === t2 || "__esModule" === t2) return Reflect.get(e3, t2);
          for (let e4 of a2) {
            let r3 = Reflect.get(e4, t2);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t2 = Reflect.ownKeys(e3);
          for (let e4 of a2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t2.includes(r3) || t2.push(r3);
          return t2;
        } })), a2);
        "object" == typeof e2 && null !== e2 && c2.push(e2);
      }, n.v = function(e2, t2) {
        (null != t2 ? i(this.c, t2) : this.m).exports = e2;
      }, n.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? i(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let c = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, f = [null, c({}), c([]), c(c)];
      function d(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !f.includes(t3); t3 = c(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), a(t2, n2), t2;
      }
      function h(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function p(e2) {
        let t2 = N(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = d(r2, h(r2), r2 && r2.__esModule);
      }
      function m(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function b(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function y() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      n.i = p, n.A = function(e2) {
        return this.r(e2)(p.bind(this));
      }, n.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, n.r = function(e2) {
        return N(e2, this.m).exports;
      }, n.f = function(e2) {
        function t2(t3) {
          if (t3 = m(t3), o.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = m(t3), o.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let O = Symbol("turbopack queues"), g = Symbol("turbopack exports"), w = Symbol("turbopack error");
      function _(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      n.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: l2, promise: i2 } = y(), s2 = Object.assign(i2, { [g]: r2.exports, [O]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), s2.catch(() => {
          });
        } }), a2 = { get: () => s2, set(e3) {
          e3 !== s2 && (s2[g] = e3);
        } };
        Object.defineProperty(r2, "exports", a2), Object.defineProperty(r2, "namespaceObject", a2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (O in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [g]: {}, [O]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[g] = e5, _(t4);
                }, (e5) => {
                  r4[w] = e5, _(t4);
                }), r4;
              }
            }
            return { [g]: e4, [O]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[w]) throw e4[w];
            return e4[g];
          }), { promise: u3, resolve: l3 } = y(), i3 = Object.assign(() => l3(r3), { queueCount: 0 });
          function s3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (i3.queueCount++, e4.push(i3)));
          }
          return t3.map((e4) => e4[O](s3)), i3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? l2(s2[w] = e3) : u2(s2[g]), _(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let C = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function j(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      C.prototype = URL.prototype, n.U = C, n.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, n.g = globalThis;
      let k = r.prototype;
      var U, R = ((U = R || {})[U.Runtime = 0] = "Runtime", U[U.Parent = 1] = "Parent", U[U.Update = 2] = "Update", U);
      let v = /* @__PURE__ */ new Map();
      n.M = v;
      let P = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
      async function $(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return M(e2, t2, A(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!v.has(e3) || P.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let l2 = r2.moduleChunks || [], i2 = l2.map((e3) => T.get(e3)).filter((e3) => e3);
        if (i2.length > 0) {
          if (i2.length === l2.length) return void await Promise.all(i2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of l2) T.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = M(e2, t2, A(n3));
            T.set(n3, r4), i2.push(r4);
          }
          n2 = Promise.all(i2);
        } else {
          for (let o3 of (n2 = M(e2, t2, A(r2.path)), l2)) T.has(o3) || T.set(o3, n2);
        }
        for (let e3 of o2) P.has(e3) || P.set(e3, n2);
        await n2;
      }
      k.l = function(e2) {
        return $(1, this.m.id, e2);
      };
      let x = Promise.resolve(void 0), E = /* @__PURE__ */ new WeakMap();
      function M(t2, r2, n2) {
        let o2 = e.loadChunkCached(t2, n2), u2 = E.get(o2);
        if (void 0 === u2) {
          let e2 = E.set.bind(E, o2, x);
          u2 = o2.then(e2).catch((e3) => {
            let o3;
            switch (t2) {
              case 0:
                o3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case 1:
                o3 = `from module ${r2}`;
                break;
              case 2:
                o3 = "from an HMR update";
                break;
              default:
                j(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let u3 = Error(`Failed to load chunk ${n2} ${o3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw u3.name = "ChunkLoadError", u3;
          }), E.set(o2, u2);
        }
        return u2;
      }
      function A(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      k.L = function(e2) {
        return M(1, this.m.id, e2);
      }, k.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, k.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, k.b = function(e2) {
        let t2 = new Blob([`self.TURBOPACK_WORKER_LOCATION = ${JSON.stringify(location.origin)};
self.TURBOPACK_CHUNK_SUFFIX = ${JSON.stringify("")};
self.TURBOPACK_NEXT_CHUNK_URLS = ${JSON.stringify(e2.reverse().map(A), null, 2)};
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => self.TURBOPACK_WORKER_LOCATION + c).reverse());`], { type: "text/javascript" });
        return URL.createObjectURL(t2);
      };
      let K = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      n.w = function(t2, r2, n2) {
        return e.loadWebAssembly(1, this.m.id, t2, r2, n2);
      }, n.u = function(t2, r2) {
        return e.loadWebAssemblyModule(1, this.m.id, t2, r2);
      };
      let S = {};
      n.c = S;
      let N = (e2, t2) => {
        let r2 = S[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return q(e2, R.Parent, t2.id);
      };
      function q(e2, t2, n2) {
        let o2 = v.get(e2);
        if ("function" != typeof o2) throw Error(function(e3, t3, r2) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r2}`;
              break;
            case 1:
              n3 = `because it was required from module ${r2}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              j(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, n2));
        let u2 = s(e2), l2 = u2.exports;
        S[e2] = u2;
        let i2 = new r(u2, l2);
        try {
          o2(i2, u2, l2);
        } catch (e3) {
          throw u2.error = e3, e3;
        }
        return u2.namespaceObject && u2.exports !== u2.namespaceObject && d(u2.exports, u2.namespaceObject), u2;
      }
      function L(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          let t3 = decodeURIComponent(("u" > typeof TURBOPACK_NEXT_CHUNK_URLS ? TURBOPACK_NEXT_CHUNK_URLS.pop() : e2.getAttribute("src")).replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3, r3, n3) {
          let o2 = 1;
          for (; o2 < e2.length; ) {
            let t4 = e2[o2], n4 = o2 + 1;
            for (; n4 < e2.length && "function" != typeof e2[n4]; ) n4++;
            if (n4 === e2.length) throw Error("malformed chunk format, expected a factory function");
            if (!r3.has(t4)) {
              let u2 = e2[n4];
              for (Object.defineProperty(u2, "name", { value: "module evaluation" }); o2 < n4; o2++) t4 = e2[o2], r3.set(t4, u2);
            }
            o2 = n4 + 1;
          }
        }(t2, 0, v)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : d(n2, h(n2), true);
      }
      n.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? d(t2.default, h(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), n.x = B, e = { registerChunk(e2, t2) {
        I.add(e2), function(e3) {
          let t3 = W.get(e3);
          if (null != t3) {
            for (let r2 of t3) r2.requiredChunks.delete(e3), 0 === r2.requiredChunks.size && F(r2.runtimeModuleIds, r2.chunkPath);
            W.delete(e3);
          }
        }(e2), null != t2 && (0 === t2.otherChunks.length ? F(t2.runtimeModuleIds, e2) : function(e3, t3, r2) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r2, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = b(e4);
            if (I.has(t4)) continue;
            n2.add(t4);
            let r3 = W.get(t4);
            null == r3 && (r3 = /* @__PURE__ */ new Set(), W.set(t4, r3)), r3.add(o2);
          }
          0 === o2.requiredChunks.size && F(o2.runtimeModuleIds, o2.chunkPath);
        }(e2, t2.otherChunks.filter((e3) => {
          var t3;
          return t3 = b(e3), K.test(t3);
        }), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      }, async loadWebAssembly(e2, t2, r2, n2, o2) {
        let u2 = await H(r2, n2);
        return await WebAssembly.instantiate(u2, o2);
      }, loadWebAssemblyModule: async (e2, t2, r2, n2) => H(r2, n2) };
      let I = /* @__PURE__ */ new Set(), W = /* @__PURE__ */ new Map();
      function F(e2, t2) {
        for (let r2 of e2) !function(e3, t3) {
          let r3 = S[t3];
          if (r3) {
            if (r3.error) throw r3.error;
            return;
          }
          q(t3, R.Runtime, e3);
        }(t2, r2);
      }
      async function H(e2, t2) {
        let r2;
        try {
          r2 = t2();
        } catch (e3) {
        }
        if (!r2) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
        return r2;
      }
      let X = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: L }, X.forEach(L);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/debug-auth(\\\\.json)?[\\/#\\?]?$"] }];
    require_root_of_the_server_f1390a54();
    require_c437();
    require_node_modules_sentry_f05d8265();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_b0bc9966();
    require_root_of_the_server_2112c9b3();
    require_root_of_the_server_4d77b799();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_851fa7d3();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": { "NEXT_PUBLIC_SUPABASE_URL": "https://ejdwrepyuznanwujidai.supabase.co", "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZHdyZXB5dXpuYW53dWppZGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjk3NTYsImV4cCI6MjA4Mzk0NTc1Nn0.MRJe6csColzMRDpAWa-Ma99noAk6n8SbnXXHP2rNAJ4" }, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": false, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [{ "protocol": "https", "hostname": "**.supabase.co" }, { "protocol": "https", "hostname": "lh3.googleusercontent.com" }, { "protocol": "https", "hostname": "**.r2.dev" }, { "protocol": "https", "hostname": "**.r2.cloudflarestorage.com" }, { "protocol": "https", "hostname": "maayaauvuu.com" }], "qualities": [75], "unoptimized": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": true, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": {}, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/Users/twissu/Desktop/Personal/e-commerce/my-ecommerce", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "dynamicOnHover": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": false, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": false, "lockDistDir": true, "isolatedDevBuild": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": false, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.js", "turbopack": { "root": "/Users/twissu/Desktop/Personal/e-commerce/my-ecommerce" }, "distDirRoot": ".next" };
var BuildId = "C2WdUPJMOX37CtWPioJnS";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin", "regex": "^/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin(?:/)?$" }, { "page": "/admin/brands", "regex": "^/admin/brands(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/brands(?:/)?$" }, { "page": "/admin/categories", "regex": "^/admin/categories(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/categories(?:/)?$" }, { "page": "/admin/fix-images", "regex": "^/admin/fix\\-images(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/fix\\-images(?:/)?$" }, { "page": "/admin/footer", "regex": "^/admin/footer(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/footer(?:/)?$" }, { "page": "/admin/hero", "regex": "^/admin/hero(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/hero(?:/)?$" }, { "page": "/admin/orders", "regex": "^/admin/orders(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/orders(?:/)?$" }, { "page": "/admin/products", "regex": "^/admin/products(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/products(?:/)?$" }, { "page": "/admin/products/new", "regex": "^/admin/products/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/products/new(?:/)?$" }, { "page": "/admin/referral/analytics", "regex": "^/admin/referral/analytics(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/referral/analytics(?:/)?$" }, { "page": "/admin/referral/network", "regex": "^/admin/referral/network(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/referral/network(?:/)?$" }, { "page": "/admin/referral/top6", "regex": "^/admin/referral/top6(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/referral/top6(?:/)?$" }, { "page": "/admin/seed", "regex": "^/admin/seed(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/seed(?:/)?$" }, { "page": "/admin/settings", "regex": "^/admin/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/settings(?:/)?$" }, { "page": "/admin/setup-hero", "regex": "^/admin/setup\\-hero(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/setup\\-hero(?:/)?$" }, { "page": "/admin/spin", "regex": "^/admin/spin(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/spin(?:/)?$" }, { "page": "/admin/types", "regex": "^/admin/types(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/types(?:/)?$" }, { "page": "/admin/users", "regex": "^/admin/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/users(?:/)?$" }, { "page": "/api/admin/brands", "regex": "^/api/admin/brands(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/brands(?:/)?$" }, { "page": "/api/admin/fix-image-urls", "regex": "^/api/admin/fix\\-image\\-urls(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/fix\\-image\\-urls(?:/)?$" }, { "page": "/api/admin/hero", "regex": "^/api/admin/hero(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/hero(?:/)?$" }, { "page": "/api/admin/orders", "regex": "^/api/admin/orders(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/orders(?:/)?$" }, { "page": "/api/admin/products", "regex": "^/api/admin/products(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/products(?:/)?$" }, { "page": "/api/admin/products/bulk", "regex": "^/api/admin/products/bulk(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/products/bulk(?:/)?$" }, { "page": "/api/admin/referral-analytics", "regex": "^/api/admin/referral\\-analytics(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/referral\\-analytics(?:/)?$" }, { "page": "/api/admin/referral-network", "regex": "^/api/admin/referral\\-network(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/referral\\-network(?:/)?$" }, { "page": "/api/admin/spin/products", "regex": "^/api/admin/spin/products(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/spin/products(?:/)?$" }, { "page": "/api/admin/spin/statistics", "regex": "^/api/admin/spin/statistics(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/spin/statistics(?:/)?$" }, { "page": "/api/admin/top6", "regex": "^/api/admin/top6(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/top6(?:/)?$" }, { "page": "/api/admin/users", "regex": "^/api/admin/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/users(?:/)?$" }, { "page": "/api/admin/users/search", "regex": "^/api/admin/users/search(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/users/search(?:/)?$" }, { "page": "/api/auth/otp/send", "regex": "^/api/auth/otp/send(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/otp/send(?:/)?$" }, { "page": "/api/auth/otp/verify", "regex": "^/api/auth/otp/verify(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/otp/verify(?:/)?$" }, { "page": "/api/auth/reset-password", "regex": "^/api/auth/reset\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/reset\\-password(?:/)?$" }, { "page": "/api/cart", "regex": "^/api/cart(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/cart(?:/)?$" }, { "page": "/api/coins/confirm", "regex": "^/api/coins/confirm(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/coins/confirm(?:/)?$" }, { "page": "/api/coins/purchase", "regex": "^/api/coins/purchase(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/coins/purchase(?:/)?$" }, { "page": "/api/coins/transactions", "regex": "^/api/coins/transactions(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/coins/transactions(?:/)?$" }, { "page": "/api/hero", "regex": "^/api/hero(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/hero(?:/)?$" }, { "page": "/api/images/upload", "regex": "^/api/images/upload(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/images/upload(?:/)?$" }, { "page": "/api/orders", "regex": "^/api/orders(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/orders(?:/)?$" }, { "page": "/api/promo/validate", "regex": "^/api/promo/validate(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/promo/validate(?:/)?$" }, { "page": "/api/qpay/check", "regex": "^/api/qpay/check(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/qpay/check(?:/)?$" }, { "page": "/api/qpay/confirm", "regex": "^/api/qpay/confirm(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/qpay/confirm(?:/)?$" }, { "page": "/api/referral/create-code", "regex": "^/api/referral/create\\-code(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/referral/create\\-code(?:/)?$" }, { "page": "/api/referral/stats", "regex": "^/api/referral/stats(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/referral/stats(?:/)?$" }, { "page": "/api/referral/validate", "regex": "^/api/referral/validate(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/referral/validate(?:/)?$" }, { "page": "/api/search/autocomplete", "regex": "^/api/search/autocomplete(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/search/autocomplete(?:/)?$" }, { "page": "/api/spin/eligibility", "regex": "^/api/spin/eligibility(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/spin/eligibility(?:/)?$" }, { "page": "/api/spin/history", "regex": "^/api/spin/history(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/spin/history(?:/)?$" }, { "page": "/api/spin/play", "regex": "^/api/spin/play(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/spin/play(?:/)?$" }, { "page": "/api/spin/products", "regex": "^/api/spin/products(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/spin/products(?:/)?$" }, { "page": "/api/wishlist", "regex": "^/api/wishlist(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/wishlist(?:/)?$" }, { "page": "/api/ws/referral", "regex": "^/api/ws/referral(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/ws/referral(?:/)?$" }, { "page": "/auth/callback", "regex": "^/auth/callback(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/callback(?:/)?$" }, { "page": "/auth/forgot-password", "regex": "^/auth/forgot\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/forgot\\-password(?:/)?$" }, { "page": "/auth/login", "regex": "^/auth/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/login(?:/)?$" }, { "page": "/auth/signup", "regex": "^/auth/signup(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/signup(?:/)?$" }, { "page": "/cart", "regex": "^/cart(?:/)?$", "routeKeys": {}, "namedRegex": "^/cart(?:/)?$" }, { "page": "/categories", "regex": "^/categories(?:/)?$", "routeKeys": {}, "namedRegex": "^/categories(?:/)?$" }, { "page": "/checkout", "regex": "^/checkout(?:/)?$", "routeKeys": {}, "namedRegex": "^/checkout(?:/)?$" }, { "page": "/checkout/success", "regex": "^/checkout/success(?:/)?$", "routeKeys": {}, "namedRegex": "^/checkout/success(?:/)?$" }, { "page": "/compare", "regex": "^/compare(?:/)?$", "routeKeys": {}, "namedRegex": "^/compare(?:/)?$" }, { "page": "/debug-auth", "regex": "^/debug\\-auth(?:/)?$", "routeKeys": {}, "namedRegex": "^/debug\\-auth(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/products", "regex": "^/products(?:/)?$", "routeKeys": {}, "namedRegex": "^/products(?:/)?$" }, { "page": "/profile", "regex": "^/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/profile(?:/)?$" }, { "page": "/robots.txt", "regex": "^/robots\\.txt(?:/)?$", "routeKeys": {}, "namedRegex": "^/robots\\.txt(?:/)?$" }, { "page": "/sale", "regex": "^/sale(?:/)?$", "routeKeys": {}, "namedRegex": "^/sale(?:/)?$" }, { "page": "/search", "regex": "^/search(?:/)?$", "routeKeys": {}, "namedRegex": "^/search(?:/)?$" }, { "page": "/sitemap.xml", "regex": "^/sitemap\\.xml(?:/)?$", "routeKeys": {}, "namedRegex": "^/sitemap\\.xml(?:/)?$" }], "dynamic": [{ "page": "/admin/products/[id]/edit", "regex": "^/admin/products/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/products/(?<nxtPid>[^/]+?)/edit(?:/)?$" }, { "page": "/api/admin/brands/[id]", "regex": "^/api/admin/brands/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/brands/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/categories/[id]", "regex": "^/api/admin/categories/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/categories/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/orders/[id]", "regex": "^/api/admin/orders/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/orders/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/products/[id]", "regex": "^/api/admin/products/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/products/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/users/[id]", "regex": "^/api/admin/users/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/users/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/images/r2/[...key]", "regex": "^/api/images/r2/(.+?)(?:/)?$", "routeKeys": { "nxtPkey": "nxtPkey" }, "namedRegex": "^/api/images/r2/(?<nxtPkey>.+?)(?:/)?$" }, { "page": "/api/orders/[id]", "regex": "^/api/orders/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/orders/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/orders/[id]/cancel", "regex": "^/api/orders/([^/]+?)/cancel(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/orders/(?<nxtPid>[^/]+?)/cancel(?:/)?$" }, { "page": "/api/products/[id]", "regex": "^/api/products/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/products/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/products/[id]/recommendations", "regex": "^/api/products/([^/]+?)/recommendations(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/products/(?<nxtPid>[^/]+?)/recommendations(?:/)?$" }, { "page": "/api/products/[id]/reviews", "regex": "^/api/products/([^/]+?)/reviews(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/products/(?<nxtPid>[^/]+?)/reviews(?:/)?$" }, { "page": "/api/products/[id]/stock", "regex": "^/api/products/([^/]+?)/stock(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/products/(?<nxtPid>[^/]+?)/stock(?:/)?$" }, { "page": "/api/products/[id]/variant-stock", "regex": "^/api/products/([^/]+?)/variant\\-stock(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/products/(?<nxtPid>[^/]+?)/variant\\-stock(?:/)?$" }, { "page": "/categories/[...slug]", "regex": "^/categories/(.+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/categories/(?<nxtPslug>.+?)(?:/)?$" }, { "page": "/products/[slug]", "regex": "^/products/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/products/(?<nxtPslug>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/:path*", "headers": [{ "key": "X-Frame-Options", "value": "DENY" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }, { "key": "Content-Security-Policy-Report-Only", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: wss:; frame-ancestors 'none';" }], "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/brands": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/brands", "dataRoute": "/admin/brands.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/categories": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/categories", "dataRoute": "/admin/categories.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/fix-images": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/fix-images", "dataRoute": "/admin/fix-images.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/footer": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/footer", "dataRoute": "/admin/footer.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/hero": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/hero", "dataRoute": "/admin/hero.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/orders": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/orders", "dataRoute": "/admin/orders.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/products/new": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/products/new", "dataRoute": "/admin/products/new.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/referral/analytics": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/referral/analytics", "dataRoute": "/admin/referral/analytics.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/referral/network": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/referral/network", "dataRoute": "/admin/referral/network.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/referral/top6": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/referral/top6", "dataRoute": "/admin/referral/top6.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/seed": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/seed", "dataRoute": "/admin/seed.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/settings": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/settings", "dataRoute": "/admin/settings.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/setup-hero": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/setup-hero", "dataRoute": "/admin/setup-hero.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/spin": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/spin", "dataRoute": "/admin/spin.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/types": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/types", "dataRoute": "/admin/types.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/admin/users": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/admin/users", "dataRoute": "/admin/users.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/auth/forgot-password": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/auth/forgot-password", "dataRoute": "/auth/forgot-password.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/auth/login": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/auth/login", "dataRoute": "/auth/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/auth/signup": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/auth/signup", "dataRoute": "/auth/signup.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/cart": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/cart", "dataRoute": "/cart.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/categories": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 300, "initialExpireSeconds": 31536e3, "srcRoute": "/categories", "dataRoute": "/categories.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/checkout": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/checkout", "dataRoute": "/checkout.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/checkout/success": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/checkout/success", "dataRoute": "/checkout/success.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/compare": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/compare", "dataRoute": "/compare.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/debug-auth": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/debug-auth", "dataRoute": "/debug-auth.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 300, "initialExpireSeconds": 31536e3, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/profile": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/profile", "dataRoute": "/profile.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/robots.txt": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "text/plain", "x-next-cache-tags": "_N_T_/layout,_N_T_/robots.txt/layout,_N_T_/robots.txt/route,_N_T_/robots.txt" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/robots.txt", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "86ebe101269fac28030cc4b8e717e2f3", "previewModeSigningKey": "b3d6df6740cb856e6428d582b775f7978323d121f3f70b460ade61947000e1f3", "previewModeEncryptionKey": "ffacd6d4f49bf5e366279fb68aa63a88b3263c00d1b465b5a39a104dfcfcd821" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/[root-of-the-server]__f1390a54._.js", "server/edge/chunks/_0727c437._.js", "server/edge/chunks/node_modules_@sentry_f05d8265._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_b0bc9966.js", "server/edge/chunks/[root-of-the-server]__2112c9b3._.js", "server/edge/chunks/[root-of-the-server]__4d77b799._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_851fa7d3.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "originalSource": "/admin/:path*" }, { "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/debug-auth(\\\\.json)?[\\/#\\?]?$", "originalSource": "/debug-auth" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "C2WdUPJMOX37CtWPioJnS", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "gwtuEtSoIA8RQvt5tsHjk/rr5Te4suA216Qty5u28WM=", "__NEXT_PREVIEW_MODE_ID": "86ebe101269fac28030cc4b8e717e2f3", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "ffacd6d4f49bf5e366279fb68aa63a88b3263c00d1b465b5a39a104dfcfcd821", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "b3d6df6740cb856e6428d582b775f7978323d121f3f70b460ade61947000e1f3" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathRoutesManifest = { "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/admin/brands/page": "/admin/brands", "/admin/categories/page": "/admin/categories", "/admin/fix-images/page": "/admin/fix-images", "/admin/footer/page": "/admin/footer", "/admin/hero/page": "/admin/hero", "/admin/orders/page": "/admin/orders", "/admin/page": "/admin", "/admin/products/[id]/edit/page": "/admin/products/[id]/edit", "/admin/products/new/page": "/admin/products/new", "/admin/products/page": "/admin/products", "/admin/referral/analytics/page": "/admin/referral/analytics", "/admin/referral/network/page": "/admin/referral/network", "/admin/referral/top6/page": "/admin/referral/top6", "/admin/seed/page": "/admin/seed", "/admin/settings/page": "/admin/settings", "/admin/setup-hero/page": "/admin/setup-hero", "/admin/spin/page": "/admin/spin", "/admin/types/page": "/admin/types", "/admin/users/page": "/admin/users", "/api/admin/brands/[id]/route": "/api/admin/brands/[id]", "/api/admin/brands/route": "/api/admin/brands", "/api/admin/categories/[id]/route": "/api/admin/categories/[id]", "/api/admin/fix-image-urls/route": "/api/admin/fix-image-urls", "/api/admin/hero/route": "/api/admin/hero", "/api/admin/orders/[id]/route": "/api/admin/orders/[id]", "/api/admin/orders/route": "/api/admin/orders", "/api/admin/products/[id]/route": "/api/admin/products/[id]", "/api/admin/products/bulk/route": "/api/admin/products/bulk", "/api/admin/products/route": "/api/admin/products", "/api/admin/referral-analytics/route": "/api/admin/referral-analytics", "/api/admin/referral-network/route": "/api/admin/referral-network", "/api/admin/spin/products/route": "/api/admin/spin/products", "/api/admin/spin/statistics/route": "/api/admin/spin/statistics", "/api/admin/top6/route": "/api/admin/top6", "/api/admin/users/[id]/route": "/api/admin/users/[id]", "/api/admin/users/route": "/api/admin/users", "/api/admin/users/search/route": "/api/admin/users/search", "/api/auth/otp/send/route": "/api/auth/otp/send", "/api/auth/otp/verify/route": "/api/auth/otp/verify", "/api/auth/reset-password/route": "/api/auth/reset-password", "/api/cart/route": "/api/cart", "/api/coins/confirm/route": "/api/coins/confirm", "/api/coins/purchase/route": "/api/coins/purchase", "/api/coins/transactions/route": "/api/coins/transactions", "/api/hero/route": "/api/hero", "/api/images/r2/[...key]/route": "/api/images/r2/[...key]", "/api/images/upload/route": "/api/images/upload", "/api/orders/[id]/cancel/route": "/api/orders/[id]/cancel", "/api/orders/[id]/route": "/api/orders/[id]", "/api/orders/route": "/api/orders", "/api/products/[id]/recommendations/route": "/api/products/[id]/recommendations", "/api/products/[id]/reviews/route": "/api/products/[id]/reviews", "/api/products/[id]/route": "/api/products/[id]", "/api/products/[id]/stock/route": "/api/products/[id]/stock", "/api/products/[id]/variant-stock/route": "/api/products/[id]/variant-stock", "/api/promo/validate/route": "/api/promo/validate", "/api/qpay/check/route": "/api/qpay/check", "/api/qpay/confirm/route": "/api/qpay/confirm", "/api/referral/create-code/route": "/api/referral/create-code", "/api/referral/stats/route": "/api/referral/stats", "/api/referral/validate/route": "/api/referral/validate", "/api/search/autocomplete/route": "/api/search/autocomplete", "/api/spin/eligibility/route": "/api/spin/eligibility", "/api/spin/history/route": "/api/spin/history", "/api/spin/play/route": "/api/spin/play", "/api/spin/products/route": "/api/spin/products", "/api/wishlist/route": "/api/wishlist", "/api/ws/referral/route": "/api/ws/referral", "/auth/callback/route": "/auth/callback", "/auth/forgot-password/page": "/auth/forgot-password", "/auth/login/page": "/auth/login", "/auth/signup/page": "/auth/signup", "/cart/page": "/cart", "/categories/[...slug]/page": "/categories/[...slug]", "/categories/page": "/categories", "/checkout/page": "/checkout", "/checkout/success/page": "/checkout/success", "/compare/page": "/compare", "/debug-auth/page": "/debug-auth", "/favicon.ico/route": "/favicon.ico", "/page": "/", "/products/[slug]/page": "/products/[slug]", "/products/page": "/products", "/profile/page": "/profile", "/robots.txt/route": "/robots.txt", "/sale/page": "/sale", "/search/page": "/search", "/sitemap.xml/route": "/sitemap.xml" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {});
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
