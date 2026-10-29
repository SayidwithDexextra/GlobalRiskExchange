// Minimal port of the Claude Design runtime (support.js) that renders the precompiled
// Inside Look template with exactly the same rules as the design tool:
//   {{ expr }} resolution, sc-if, sc-for, style strings -> style objects, style-hover pseudo classes,
//   event attribute names, and the DCLogic base class (synchronous state merged on setState).
// Ported from dc-runtime src/expr.ts, encode.ts, compile.ts, logic.ts, pseudo.ts, component.ts.
/* eslint-disable */
import * as React from 'react';

const h = React.createElement;

// ---------- expr.ts ----------
const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;
function parensWrapWhole(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length - 1; i++) {
    if (expr[i] === '(') depth++;
    else if (expr[i] === ')') { depth--; if (depth === 0) return false; }
  }
  return true;
}
function findTopLevelEquality(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (depth === 0 && (c === '=' || c === '!') && expr[i + 1] === '=') {
      if (i > 0 && (expr[i - 1] === '=' || expr[i - 1] === '!')) continue;
      if (!expr.slice(0, i).trim()) continue;
      const op = expr[i + 2] === '=' ? c + '==' : c + '=';
      return { index: i, op };
    }
  }
  return null;
}
function resolvePath(vals, expr) {
  const head = expr.match(IDENT_RE);
  if (!head) return undefined;
  let cur = vals == null ? undefined : vals[head[0]];
  let i = head[0].length;
  while (i < expr.length) {
    if (expr[i] === '.') {
      const m = expr.slice(i + 1).match(IDENT_RE) || expr.slice(i + 1).match(/^\d+/);
      if (!m) return undefined;
      cur = cur == null ? undefined : cur[m[0]];
      i += 1 + m[0].length;
    } else if (expr[i] === '[') {
      let depth = 1, j = i + 1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === '[') depth++;
        else if (expr[j] === ']') { depth--; if (depth === 0) break; }
        j++;
      }
      if (depth !== 0) return undefined;
      const key = resolve(vals, expr.slice(i + 1, j));
      cur = cur == null ? undefined : cur[key];
      i = j + 1;
    } else return undefined;
  }
  return cur;
}
export function resolve(vals, src) {
  const expr = String(src).trim();
  if (!expr) return undefined;
  if (expr[0] === '(' && expr[expr.length - 1] === ')' && parensWrapWhole(expr)) return resolve(vals, expr.slice(1, -1));
  const eq = findTopLevelEquality(expr);
  if (eq) {
    const lv = resolve(vals, expr.slice(0, eq.index));
    const rv = resolve(vals, expr.slice(eq.index + eq.op.length));
    switch (eq.op) {
      case '===': return lv === rv;
      case '!==': return lv !== rv;
      case '==': return lv == rv;
      default: return lv != rv;
    }
  }
  if (expr[0] === '!') return !resolve(vals, expr.slice(1));
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  if (expr === 'null') return null;
  if (expr === 'undefined') return undefined;
  if (NUMBER_RE.test(expr)) return Number(expr);
  if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) return expr.slice(1, -1);
  return resolvePath(vals, expr);
}

// ---------- encode.ts ----------
const EVENT_MAP = {
  onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onsubmit: 'onSubmit', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp',
  onmousedown: 'onMouseDown', onmouseup: 'onMouseUp', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave', onfocus: 'onFocus',
  onblur: 'onBlur', onmousemove: 'onMouseMove', onmouseover: 'onMouseOver', onmouseout: 'onMouseOut', onpointerdown: 'onPointerDown',
  onpointerup: 'onPointerUp', onpointermove: 'onPointerMove', onpointerenter: 'onPointerEnter', onpointerleave: 'onPointerLeave',
  ontouchstart: 'onTouchStart', ontouchend: 'onTouchEnd', ontouchmove: 'onTouchMove',
};
// React accepts these SVG attributes under their camelCase names (it writes the same DOM attribute).
const SVG_ATTR = {
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray', 'stroke-dashoffset': 'strokeDashoffset', 'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'text-anchor': 'textAnchor',
  'font-family': 'fontFamily', 'font-size': 'fontSize', 'font-weight': 'fontWeight', 'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity', 'dominant-baseline': 'dominantBaseline', 'letter-spacing': 'letterSpacing',
};
function kebabToCamel(s) { return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }
export function cssToObj(css) {
  const o = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o;
}
function attrValue(raw, vals) {
  const whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/);
  if (whole) return resolve(vals, whole[1]);
  if (raw.includes('{{')) {
    const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
    return parts.map((s, i) => (i & 1 ? resolve(vals, s) ?? '' : s)).join('');
  }
  return raw;
}

// ---------- pseudo.ts (style-hover="..." etc.) ----------
function scanUnquotedUrl(css, i) {
  if ((css[i] !== 'u' && css[i] !== 'U') || css.slice(i, i + 4).toLowerCase() !== 'url(' || /[a-z0-9_-]/i.test(css[i - 1] ?? '')) return -1;
  let j = i + 4;
  while (j < css.length && /\s/.test(css[j])) j++;
  if (css[j] === '"' || css[j] === "'") return -1;
  while (j < css.length && css[j] !== ')') { if (css[j] === '\\') j++; j++; }
  return j < css.length ? j + 1 : css.length;
}
function stripComments(css) {
  let out = '', quote = '';
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      if (c === '\\') { out += c + (css[i + 1] ?? ''); i++; continue; }
      if (c === quote) quote = '';
      out += c;
    } else if (c === "'" || c === '"') { quote = c; out += c; }
    else if (c === '/' && css[i + 1] === '*') { const end = css.indexOf('*/', i + 2); i = end === -1 ? css.length : end + 1; out += ' '; }
    else { const end = scanUnquotedUrl(css, i); if (end === -1) out += c; else { out += css.slice(i, end); i = end - 1; } }
  }
  return out;
}
function importantify(css) {
  css = stripComments(css);
  const decls = [];
  let start = 0, depth = 0, quote = '';
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; }
    else if (c === "'" || c === '"') quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (c === ';' && depth === 0) { decls.push(css.slice(start, i)); start = i + 1; }
    else { const end = scanUnquotedUrl(css, i); if (end !== -1) i = end - 1; }
  }
  decls.push(css.slice(start));
  return decls.map((d) => d.trim()).filter(Boolean).map((d) => (/!\s*important$/i.test(d) ? d : d + ' !important')).join(';');
}
// Deterministic class names (hash of pseudo + css) so server and client render the same markup.
const pseudoCache = new Map();
let pseudoSheet = null;
function pseudoClass(pseudo, css) {
  const k = pseudo + '|' + css;
  let cls = pseudoCache.get(k);
  if (!cls) {
    let x = 5381;
    for (let i = 0; i < k.length; i++) x = ((x << 5) + x + k.charCodeAt(i)) | 0;
    cls = 'scp' + (x >>> 0).toString(36);
    pseudoCache.set(k, cls);
    if (typeof document !== 'undefined') {
      if (!pseudoSheet) { pseudoSheet = document.createElement('style'); pseudoSheet.setAttribute('data-dx-il-pseudo', ''); document.head.appendChild(pseudoSheet); }
      const isEl = pseudo === 'before' || pseudo === 'after';
      const sel = isEl ? '.' + cls + '::' + pseudo : '.' + cls + ':' + pseudo;
      try { pseudoSheet.sheet.insertRule(sel + '{' + (isEl ? css : importantify(css)) + '}', pseudoSheet.sheet.cssRules.length); } catch (e) {}
    }
  } else if (typeof document !== 'undefined' && !pseudoSheet) {
    // Cache filled during a server render in the same process: make sure the rules exist in the browser.
    pseudoCache.delete(k);
    return pseudoClass(pseudo, css);
  }
  return cls;
}

// ---------- compile.ts (renders the precompiled tree) ----------
function renderText(parts, vals, key) {
  return h(React.Fragment, { key }, ...parts.map((p, i) => {
    if (!(i & 1)) return p;
    const v = resolve(vals, p);
    if (v === undefined || v === null || typeof v === 'boolean') return null;
    if (React.isValidElement(v) || Array.isArray(v)) return h(React.Fragment, { key: i }, v);
    return h('span', { key: i, className: 'sc-interp' }, String(v));
  }));
}
function renderNode(n, vals, key) {
  if (typeof n === 'string') return n;
  switch (n[0]) {
    case 'i': return renderText(n[1], vals, key);
    case 'c': {
      const v = attrValue(n[1], vals);
      return v ? h(React.Fragment, { key }, n[2].map((c, j) => renderNode(c, vals, j))) : null;
    }
    case 'f': {
      let list = attrValue(n[1], vals);
      if (!Array.isArray(list)) list = [];
      const as = n[2];
      return h(React.Fragment, { key }, list.map((item, i) => {
        const sub = { ...vals, [as]: item, $index: i };
        return h(React.Fragment, { key: i }, n[3].map((c, j) => renderNode(c, sub, j)));
      }));
    }
    case 's': return h(React.Fragment, { key }, resolve(vals, n[1]) ?? null);
    case 'e': {
      const [, tag, attrs, kids] = n;
      const props = { key };
      const pseudo = [];
      for (const [name, raw] of attrs) {
        if (name.startsWith('style-')) { pseudo.push(pseudoClass(name.slice(6), raw)); continue; }
        let k = name;
        if (k === 'class') k = 'className';
        else if (k === 'for') k = 'htmlFor';
        else if (k.startsWith('on')) k = EVENT_MAP[k] || 'on' + k[2].toUpperCase() + k.slice(3);
        else if (SVG_ATTR[k]) k = SVG_ATTR[k];
        let v = attrValue(raw, vals);
        if (k === 'style' && typeof v === 'string') v = cssToObj(v);
        if ((k === 'value' || k === 'checked') && v === undefined) v = k === 'checked' ? false : '';
        props[k] = v;
      }
      if (pseudo.length) props.className = [props.className, ...pseudo].filter(Boolean).join(' ');
      return h(tag, props, ...kids.map((c, j) => renderNode(c, vals, j)));
    }
  }
  return null;
}
export function renderTree(tree, vals) {
  return tree.map((n, i) => renderNode(n, vals || {}, i));
}

// ---------- logic.ts ----------
export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.__host = undefined;
  }
  setState(update, cb) { this.__host && this.__host.__setLogicState(update, cb); }
  forceUpdate() { this.__host && this.__host.forceUpdate(); }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() { return {}; }
}

// ---------- component.ts (host wrapper) ----------
// Holds a DCLogic instance and re-renders when its state changes, exactly like the design runtime.
export function createDCComponent(Logic, tree, displayName) {
  class DCHost extends React.Component {
    constructor(props) {
      super(props);
      this.state = { __v: 0 };
      this.logic = new Logic(this.userProps());
      this.logic.__host = this;
    }
    userProps() { const { children, ...rest } = this.props; return rest; }
    __setLogicState(update, cb) {
      const prev = this.logic.state;
      const patch = typeof update === 'function' ? update(prev) : update;
      this.logic.state = { ...prev, ...patch };
      this.setState((s) => ({ __v: s.__v + 1 }), cb);
    }
    componentDidMount() { try { this.logic.componentDidMount(); } catch (e) { console.error(e); } }
    componentDidUpdate(prevProps) { try { this.logic.componentDidUpdate(prevProps); } catch (e) { console.error(e); } }
    componentWillUnmount() { try { this.logic.componentWillUnmount(); } catch (e) { console.error(e); } }
    render() {
      const userProps = this.userProps();
      this.logic.props = userProps;
      const vals = { ...userProps, ...(this.logic.renderVals() || {}) };
      return h('div', { className: 'sc-host', 'data-sc-name': displayName }, renderTree(tree, vals));
    }
  }
  DCHost.displayName = displayName;
  return DCHost;
}
