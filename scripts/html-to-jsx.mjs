import fs from 'fs';

const ATTR = {
  class: 'className',
  for: 'htmlFor',
  autocomplete: 'autoComplete',
  novalidate: 'noValidate',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  srcset: 'srcSet',
  crossorigin: 'crossOrigin',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'letter-spacing': 'letterSpacing',
  'dominant-baseline': 'dominantBaseline',
  'alignment-baseline': 'alignmentBaseline',
  viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio',
};

const BOOLEAN = new Set(['checked', 'open', 'required', 'novalidate', 'disabled', 'readonly']);

function cssProp(name) {
  if (name.startsWith('--')) return name;
  if (name.startsWith('-webkit-')) {
    const rest = name.slice(8).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return 'Webkit' + rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function jsString(value) {
  return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function styleObject(raw) {
  const parts = raw.split(';').map((p) => p.trim()).filter(Boolean);
  const fields = parts.map((part) => {
    const i = part.indexOf(':');
    const key = cssProp(part.slice(0, i).trim());
    const val = part.slice(i + 1).trim();
    const k = key.startsWith('--') ? jsString(key) : key;
    return `${k}: ${jsString(val)}`;
  });
  return `{{${fields.join(', ')}}}`;
}

function attrName(name) {
  const lower = name.toLowerCase();
  if (ATTR[lower]) return ATTR[lower];
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  if (name.includes('-')) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

function convertAttrs(raw) {
  const attrs = [];
  const re = /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1];
    const hasValue = m[0].includes('=');
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    if (name === 'onclick' || name === 'onmouseover' || name === 'onmouseout') continue;
    if (name.toLowerCase() === 'style') {
      attrs.push(`style=${styleObject(value)}`);
      continue;
    }
    const jsName = name.toLowerCase() === 'checked' ? 'defaultChecked' : attrName(name);
    if (!hasValue || BOOLEAN.has(name.toLowerCase())) {
      attrs.push(jsName);
      continue;
    }
    attrs.push(`${jsName}=${jsString(value)}`);
  }
  return attrs.length ? ' ' + attrs.join(' ') : '';
}

function convert(html) {
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<header\b[\s\S]*?<\/header>/i, '');
  html = html.replace(/<script\b[\s\S]*?<\/script>/i, '');
  html = html.replace(/&nbsp;/g, '\u00A0');
  html = html.replace(/&amp;/g, '&');
  html = html.replace(/&quot;/g, '"');

  let out = '';
  const re = /<\/?([A-Za-z][\w:-]*)([^>]*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[4] != null) {
      const text = m[4].replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
      if (text.trim() === '' && !text.includes('\u00A0')) {
        out += text.includes('\n') ? '\n' : '';
        continue;
      }
      out += text;
      continue;
    }
    const tag = m[1];
    const closing = m[0].startsWith('</');
    const self = m[3] === '/' || /^(img|input|br|hr|source|meta|link|path|circle|rect|stop|ellipse|line|polyline|polygon|animate|animateMotion|animateTransform)$/i.test(tag) && !html.slice(re.lastIndex).startsWith(`</${tag}`);
    if (closing) {
      out += `</${tag}>`;
      continue;
    }
    let attrs = convertAttrs(m[2] || '');
    if (tag === 'button' && /classList\.remove\('sent'\)/.test(m[2] || '')) {
      attrs += ` onClick={() => document.getElementById('formcard')?.classList.remove('sent')}`;
    }
    const isVoid = m[3] === '/' || /^(img|input|br|hr|source|meta|link)$/i.test(tag);
    // SVG elements that were self-closed in the source
    const sourceSelf = m[3] === '/';
    if (sourceSelf || isVoid) out += `<${tag}${attrs} />`;
    else out += `<${tag}${attrs}>`;
  }
  return out.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

const which = process.argv[2];
const src = fs.readFileSync(process.argv[3], 'utf8');
const jsx = convert(src);
fs.writeFileSync(process.argv[4], jsx);
console.log(which, 'chars', jsx.length);
