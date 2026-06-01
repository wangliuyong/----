var Qt = Object.defineProperty;
var Jt = (n, e, t) => e in n ? Qt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var E = (n, e, t) => Jt(n, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = globalThis, Ge = $e.ShadowRoot && ($e.ShadyCSS === void 0 || $e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, je = Symbol(), ot = /* @__PURE__ */ new WeakMap();
let Pt = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== je) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Ge && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = ot.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && ot.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ft = (n) => new Pt(typeof n == "string" ? n : n + "", void 0, je), en = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((r, s, i) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[i + 1], n[0]);
  return new Pt(t, n, je);
}, tn = (n, e) => {
  if (Ge) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = $e.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, n.appendChild(r);
  }
}, lt = Ge ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Ft(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: nn, defineProperty: rn, getOwnPropertyDescriptor: sn, getOwnPropertyNames: an, getOwnPropertySymbols: on, getPrototypeOf: ln } = Object, G = globalThis, ct = G.trustedTypes, cn = ct ? ct.emptyScript : "", Oe = G.reactiveElementPolyfillSupport, oe = (n, e) => n, Ae = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? cn : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, Ze = (n, e) => !nn(n, e), ut = { attribute: !0, type: String, converter: Ae, reflect: !1, useDefault: !1, hasChanged: Ze };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), G.litPropertyMetadata ?? (G.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let J = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ut) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && rn(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: i } = sn(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: s, set(o) {
      const a = s == null ? void 0 : s.call(this);
      i == null || i.call(this, o), this.requestUpdate(e, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(oe("elementProperties"))) return;
    const e = ln(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(oe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(oe("properties"))) {
      const t = this.properties, r = [...an(t), ...on(t)];
      for (const s of r) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, s] of t) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const s = this._$Eu(t, r);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) t.unshift(lt(s));
    } else e !== void 0 && t.push(lt(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return tn(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostConnected) == null ? void 0 : r.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostDisconnected) == null ? void 0 : r.call(t);
    });
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    var i;
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const o = (((i = r.converter) == null ? void 0 : i.toAttribute) !== void 0 ? r.converter : Ae).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var i, o;
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = r.getPropertyOptions(s), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((i = a.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? a.converter : Ae;
      this._$Em = s;
      const l = c.fromAttribute(t, a.type);
      this[s] = l ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, i) {
    var o;
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (i = this[e]), r ?? (r = a.getPropertyOptions(e)), !((r.hasChanged ?? Ze)(i, t) || r.useDefault && r.reflect && i === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(a._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: s, wrapped: i }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), i !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, o] of s) {
        const { wrapped: a } = o, c = this[i];
        a !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, o, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((s) => {
        var i;
        return (i = s.hostUpdate) == null ? void 0 : i.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
J.elementStyles = [], J.shadowRootOptions = { mode: "open" }, J[oe("elementProperties")] = /* @__PURE__ */ new Map(), J[oe("finalized")] = /* @__PURE__ */ new Map(), Oe == null || Oe({ ReactiveElement: J }), (G.reactiveElementVersions ?? (G.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis, ht = (n) => n, Se = le.trustedTypes, pt = Se ? Se.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, It = "$lit$", q = `lit$${Math.random().toFixed(9).slice(2)}$`, Lt = "?" + q, un = `<${Lt}>`, X = document, he = () => X.createComment(""), pe = (n) => n === null || typeof n != "object" && typeof n != "function", We = Array.isArray, hn = (n) => We(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", ze = `[ 	
\f\r]`, se = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, gt = />/g, j = RegExp(`>|${ze}(?:([^\\s"'>=/]+)(${ze}*=${ze}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, mt = /"/g, Ot = /^(?:script|style|textarea|title)$/i, pn = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), Q = pn(1), ee = Symbol.for("lit-noChange"), C = Symbol.for("lit-nothing"), bt = /* @__PURE__ */ new WeakMap(), Z = X.createTreeWalker(X, 129);
function zt(n, e) {
  if (!We(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pt !== void 0 ? pt.createHTML(e) : e;
}
const dn = (n, e) => {
  const t = n.length - 1, r = [];
  let s, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = se;
  for (let a = 0; a < t; a++) {
    const c = n[a];
    let l, u, b = -1, f = 0;
    for (; f < c.length && (o.lastIndex = f, u = o.exec(c), u !== null); ) f = o.lastIndex, o === se ? u[1] === "!--" ? o = dt : u[1] !== void 0 ? o = gt : u[2] !== void 0 ? (Ot.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = j) : u[3] !== void 0 && (o = j) : o === j ? u[0] === ">" ? (o = s ?? se, b = -1) : u[1] === void 0 ? b = -2 : (b = o.lastIndex - u[2].length, l = u[1], o = u[3] === void 0 ? j : u[3] === '"' ? mt : ft) : o === mt || o === ft ? o = j : o === dt || o === gt ? o = se : (o = j, s = void 0);
    const v = o === j && n[a + 1].startsWith("/>") ? " " : "";
    i += o === se ? c + un : b >= 0 ? (r.push(l), c.slice(0, b) + It + c.slice(b) + q + v) : c + q + (b === -2 ? a : v);
  }
  return [zt(n, i + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class de {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let i = 0, o = 0;
    const a = e.length - 1, c = this.parts, [l, u] = dn(e, t);
    if (this.el = de.createElement(l, r), Z.currentNode = this.el.content, t === 2 || t === 3) {
      const b = this.el.content.firstChild;
      b.replaceWith(...b.childNodes);
    }
    for (; (s = Z.nextNode()) !== null && c.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const b of s.getAttributeNames()) if (b.endsWith(It)) {
          const f = u[o++], v = s.getAttribute(b).split(q), y = /([.?@])?(.*)/.exec(f);
          c.push({ type: 1, index: i, name: y[2], strings: v, ctor: y[1] === "." ? fn : y[1] === "?" ? mn : y[1] === "@" ? bn : Re }), s.removeAttribute(b);
        } else b.startsWith(q) && (c.push({ type: 6, index: i }), s.removeAttribute(b));
        if (Ot.test(s.tagName)) {
          const b = s.textContent.split(q), f = b.length - 1;
          if (f > 0) {
            s.textContent = Se ? Se.emptyScript : "";
            for (let v = 0; v < f; v++) s.append(b[v], he()), Z.nextNode(), c.push({ type: 2, index: ++i });
            s.append(b[f], he());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Lt) c.push({ type: 2, index: i });
      else {
        let b = -1;
        for (; (b = s.data.indexOf(q, b + 1)) !== -1; ) c.push({ type: 7, index: i }), b += q.length - 1;
      }
      i++;
    }
  }
  static createElement(e, t) {
    const r = X.createElement("template");
    return r.innerHTML = e, r;
  }
}
function te(n, e, t = n, r) {
  var o, a;
  if (e === ee) return e;
  let s = r !== void 0 ? (o = t._$Co) == null ? void 0 : o[r] : t._$Cl;
  const i = pe(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== i && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), i === void 0 ? s = void 0 : (s = new i(n), s._$AT(n, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = s : t._$Cl = s), s !== void 0 && (e = te(n, s._$AS(n, e.values), s, r)), e;
}
class gn {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? X).importNode(t, !0);
    Z.currentNode = s;
    let i = Z.nextNode(), o = 0, a = 0, c = r[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let l;
        c.type === 2 ? l = new ge(i, i.nextSibling, this, e) : c.type === 1 ? l = new c.ctor(i, c.name, c.strings, this, e) : c.type === 6 && (l = new kn(i, this, e)), this._$AV.push(l), c = r[++a];
      }
      o !== (c == null ? void 0 : c.index) && (i = Z.nextNode(), o++);
    }
    return Z.currentNode = X, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class ge {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, s) {
    this.type = 2, this._$AH = C, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = te(this, e, t), pe(e) ? e === C || e == null || e === "" ? (this._$AH !== C && this._$AR(), this._$AH = C) : e !== this._$AH && e !== ee && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : hn(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== C && pe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(X.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var i;
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = de.createElement(zt(r.h, r.h[0]), this.options)), r);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s) this._$AH.p(t);
    else {
      const o = new gn(s, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = bt.get(e.strings);
    return t === void 0 && bt.set(e.strings, t = new de(e)), t;
  }
  k(e) {
    We(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const i of e) s === t.length ? t.push(r = new ge(this.O(he()), this.O(he()), this, this.options)) : r = t[s], r._$AI(i), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = ht(e).nextSibling;
      ht(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Re {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, i) {
    this.type = 1, this._$AH = C, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = C;
  }
  _$AI(e, t = this, r, s) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = te(this, e, t, 0), o = !pe(e) || e !== this._$AH && e !== ee, o && (this._$AH = e);
    else {
      const a = e;
      let c, l;
      for (e = i[0], c = 0; c < i.length - 1; c++) l = te(this, a[r + c], t, c), l === ee && (l = this._$AH[c]), o || (o = !pe(l) || l !== this._$AH[c]), l === C ? e = C : e !== C && (e += (l ?? "") + i[c + 1]), this._$AH[c] = l;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === C ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class fn extends Re {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === C ? void 0 : e;
  }
}
class mn extends Re {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== C);
  }
}
class bn extends Re {
  constructor(e, t, r, s, i) {
    super(e, t, r, s, i), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = te(this, e, t, 0) ?? C) === ee) return;
    const r = this._$AH, s = e === C && r !== C || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, i = e !== C && (r === C || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class kn {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    te(this, e);
  }
}
const De = le.litHtmlPolyfillSupport;
De == null || De(de, ge), (le.litHtmlVersions ?? (le.litHtmlVersions = [])).push("3.3.3");
const xn = (n, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const i = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = s = new ge(e.insertBefore(he(), i), i, void 0, t ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis;
class ce extends J {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = xn(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return ee;
  }
}
var Ct;
ce._$litElement$ = !0, ce.finalized = !0, (Ct = W.litElementHydrateSupport) == null || Ct.call(W, { LitElement: ce });
const Ne = W.litElementPolyfillSupport;
Ne == null || Ne({ LitElement: ce });
(W.litElementVersions ?? (W.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yn = (n) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(n, e);
  }) : customElements.define(n, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wn = { attribute: !0, type: String, converter: Ae, reflect: !1, hasChanged: Ze }, $n = (n = wn, e, t) => {
  const { kind: r, metadata: s } = t;
  let i = globalThis.litPropertyMetadata.get(s);
  if (i === void 0 && globalThis.litPropertyMetadata.set(s, i = /* @__PURE__ */ new Map()), r === "setter" && ((n = Object.create(n)).wrapped = !0), i.set(t.name, n), r === "accessor") {
    const { name: o } = t;
    return { set(a) {
      const c = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, c, n, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, n, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = t;
    return function(a) {
      const c = this[o];
      e.call(this, a), this.requestUpdate(o, c, n, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function fe(n) {
  return (e, t) => typeof t == "object" ? $n(n, e, t) : ((r, s, i) => {
    const o = s.hasOwnProperty(i);
    return s.constructor.createProperty(i, r), o ? Object.getOwnPropertyDescriptor(s, i) : void 0;
  })(n, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ne(n) {
  return fe({ ...n, state: !0, attribute: !1 });
}
function Xe() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var Y = Xe();
function Dt(n) {
  Y = n;
}
var ue = { exec: () => null };
function A(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const r = {
    replace: (s, i) => {
      let o = typeof i == "string" ? i : i.source;
      return o = o.replace(I.caret, "$1"), t = t.replace(s, o), r;
    },
    getRegex: () => new RegExp(t, e)
  };
  return r;
}
var I = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`),
  htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i")
}, vn = /^(?:[ \t]*(?:\n|$))+/, An = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Sn = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, me = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, _n = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ve = /(?:[*+-]|\d{1,9}[.)])/, Nt = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Mt = A(Nt).replace(/bull/g, Ve).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), En = A(Nt).replace(/bull/g, Ve).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ye = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Tn = /^[^\n]+/, Ke = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Rn = A(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ke).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Cn = A(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ve).getRegex(), Ce = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Qe = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Pn = A(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Qe).replace("tag", Ce).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ht = A(Ye).replace("hr", me).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ce).getRegex(), Fn = A(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ht).getRegex(), Je = {
  blockquote: Fn,
  code: An,
  def: Rn,
  fences: Sn,
  heading: _n,
  hr: me,
  html: Pn,
  lheading: Mt,
  list: Cn,
  newline: vn,
  paragraph: Ht,
  table: ue,
  text: Tn
}, kt = A(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", me).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ce).getRegex(), In = {
  ...Je,
  lheading: En,
  table: kt,
  paragraph: A(Ye).replace("hr", me).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", kt).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ce).getRegex()
}, Ln = {
  ...Je,
  html: A(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Qe).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: ue,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: A(Ye).replace("hr", me).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Mt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, On = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, zn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Bt = /^( {2,}|\\)\n(?!\s*$)/, Dn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Pe = /[\p{P}\p{S}]/u, et = /[\s\p{P}\p{S}]/u, Ut = /[^\s\p{P}\p{S}]/u, Nn = A(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, et).getRegex(), qt = /(?!~)[\p{P}\p{S}]/u, Mn = /(?!~)[\s\p{P}\p{S}]/u, Hn = /(?:[^\s\p{P}\p{S}]|~)/u, Bn = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Gt = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Un = A(Gt, "u").replace(/punct/g, Pe).getRegex(), qn = A(Gt, "u").replace(/punct/g, qt).getRegex(), jt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Gn = A(jt, "gu").replace(/notPunctSpace/g, Ut).replace(/punctSpace/g, et).replace(/punct/g, Pe).getRegex(), jn = A(jt, "gu").replace(/notPunctSpace/g, Hn).replace(/punctSpace/g, Mn).replace(/punct/g, qt).getRegex(), Zn = A(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Ut).replace(/punctSpace/g, et).replace(/punct/g, Pe).getRegex(), Wn = A(/\\(punct)/, "gu").replace(/punct/g, Pe).getRegex(), Xn = A(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Vn = A(Qe).replace("(?:-->|$)", "-->").getRegex(), Yn = A(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Vn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), _e = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Kn = A(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _e).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Zt = A(/^!?\[(label)\]\[(ref)\]/).replace("label", _e).replace("ref", Ke).getRegex(), Wt = A(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ke).getRegex(), Qn = A("reflink|nolink(?!\\()", "g").replace("reflink", Zt).replace("nolink", Wt).getRegex(), tt = {
  _backpedal: ue,
  // only used for GFM url
  anyPunctuation: Wn,
  autolink: Xn,
  blockSkip: Bn,
  br: Bt,
  code: zn,
  del: ue,
  emStrongLDelim: Un,
  emStrongRDelimAst: Gn,
  emStrongRDelimUnd: Zn,
  escape: On,
  link: Kn,
  nolink: Wt,
  punctuation: Nn,
  reflink: Zt,
  reflinkSearch: Qn,
  tag: Yn,
  text: Dn,
  url: ue
}, Jn = {
  ...tt,
  link: A(/^!?\[(label)\]\((.*?)\)/).replace("label", _e).getRegex(),
  reflink: A(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _e).getRegex()
}, Be = {
  ...tt,
  emStrongRDelimAst: jn,
  emStrongLDelim: qn,
  url: A(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, er = {
  ...Be,
  br: A(Bt).replace("{2,}", "*").getRegex(),
  text: A(Be.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, we = {
  normal: Je,
  gfm: In,
  pedantic: Ln
}, ie = {
  normal: tt,
  gfm: Be,
  breaks: er,
  pedantic: Jn
}, tr = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, xt = (n) => tr[n];
function N(n, e) {
  if (e) {
    if (I.escapeTest.test(n))
      return n.replace(I.escapeReplace, xt);
  } else if (I.escapeTestNoEncode.test(n))
    return n.replace(I.escapeReplaceNoEncode, xt);
  return n;
}
function yt(n) {
  try {
    n = encodeURI(n).replace(I.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function wt(n, e) {
  var i;
  const t = n.replace(I.findPipe, (o, a, c) => {
    let l = !1, u = a;
    for (; --u >= 0 && c[u] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), r = t.split(I.splitPipe);
  let s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !((i = r.at(-1)) != null && i.trim()) && r.pop(), e)
    if (r.length > e)
      r.splice(e);
    else
      for (; r.length < e; ) r.push("");
  for (; s < r.length; s++)
    r[s] = r[s].trim().replace(I.slashPipe, "|");
  return r;
}
function ae(n, e, t) {
  const r = n.length;
  if (r === 0)
    return "";
  let s = 0;
  for (; s < r && n.charAt(r - s - 1) === e; )
    s++;
  return n.slice(0, r - s);
}
function nr(n, e) {
  if (n.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    if (n[r] === "\\")
      r++;
    else if (n[r] === e[0])
      t++;
    else if (n[r] === e[1] && (t--, t < 0))
      return r;
  return t > 0 ? -2 : -1;
}
function $t(n, e, t, r, s) {
  const i = e.href, o = e.title || null, a = n[1].replace(s.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  const c = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: i,
    title: o,
    text: a,
    tokens: r.inlineTokens(a)
  };
  return r.state.inLink = !1, c;
}
function rr(n, e, t) {
  const r = n.match(t.other.indentCodeCompensation);
  if (r === null)
    return e;
  const s = r[1];
  return e.split(`
`).map((i) => {
    const o = i.match(t.other.beginningSpace);
    if (o === null)
      return i;
    const [a] = o;
    return a.length >= s.length ? i.slice(s.length) : i;
  }).join(`
`);
}
var Ee = class {
  // set by the lexer
  constructor(n) {
    E(this, "options");
    E(this, "rules");
    // set by the lexer
    E(this, "lexer");
    this.options = n || Y;
  }
  space(n) {
    const e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(n) {
    const e = this.rules.block.code.exec(n);
    if (e) {
      const t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? t : ae(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], r = rr(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: r
      };
    }
  }
  heading(n) {
    const e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const r = ae(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (t = r.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  hr(n) {
    const e = this.rules.block.hr.exec(n);
    if (e)
      return {
        type: "hr",
        raw: ae(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = ae(e[0], `
`).split(`
`), r = "", s = "";
      const i = [];
      for (; t.length > 0; ) {
        let o = !1;
        const a = [];
        let c;
        for (c = 0; c < t.length; c++)
          if (this.rules.other.blockquoteStart.test(t[c]))
            a.push(t[c]), o = !0;
          else if (!o)
            a.push(t[c]);
          else
            break;
        t = t.slice(c);
        const l = a.join(`
`), u = l.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${l}` : l, s = s ? `${s}
${u}` : u;
        const b = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, i, !0), this.lexer.state.top = b, t.length === 0)
          break;
        const f = i.at(-1);
        if ((f == null ? void 0 : f.type) === "code")
          break;
        if ((f == null ? void 0 : f.type) === "blockquote") {
          const v = f, y = v.raw + `
` + t.join(`
`), w = this.blockquote(y);
          i[i.length - 1] = w, r = r.substring(0, r.length - v.raw.length) + w.raw, s = s.substring(0, s.length - v.text.length) + w.text;
          break;
        } else if ((f == null ? void 0 : f.type) === "list") {
          const v = f, y = v.raw + `
` + t.join(`
`), w = this.list(y);
          i[i.length - 1] = w, r = r.substring(0, r.length - f.raw.length) + w.raw, s = s.substring(0, s.length - v.raw.length) + w.raw, t = y.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: r,
        tokens: i,
        text: s
      };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim();
      const r = t.length > 1, s = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = r ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = r ? t : "[*+-]");
      const i = this.rules.other.listItemRegex(t);
      let o = !1;
      for (; n; ) {
        let c = !1, l = "", u = "";
        if (!(e = i.exec(n)) || this.rules.block.hr.test(n))
          break;
        l = e[0], n = n.substring(l.length);
        let b = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (T) => " ".repeat(3 * T.length)), f = n.split(`
`, 1)[0], v = !b.trim(), y = 0;
        if (this.options.pedantic ? (y = 2, u = b.trimStart()) : v ? y = e[1].length + 1 : (y = e[2].search(this.rules.other.nonSpaceChar), y = y > 4 ? 1 : y, u = b.slice(y), y += e[1].length), v && this.rules.other.blankLine.test(f) && (l += f + `
`, n = n.substring(f.length + 1), c = !0), !c) {
          const T = this.rules.other.nextBulletRegex(y), p = this.rules.other.hrRegex(y), h = this.rules.other.fencesBeginRegex(y), d = this.rules.other.headingBeginRegex(y), m = this.rules.other.htmlBeginRegex(y);
          for (; n; ) {
            const g = n.split(`
`, 1)[0];
            let k;
            if (f = g, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), k = f) : k = f.replace(this.rules.other.tabCharGlobal, "    "), h.test(f) || d.test(f) || m.test(f) || T.test(f) || p.test(f))
              break;
            if (k.search(this.rules.other.nonSpaceChar) >= y || !f.trim())
              u += `
` + k.slice(y);
            else {
              if (v || b.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || h.test(b) || d.test(b) || p.test(b))
                break;
              u += `
` + f;
            }
            !v && !f.trim() && (v = !0), l += g + `
`, n = n.substring(g.length + 1), b = k.slice(y);
          }
        }
        s.loose || (o ? s.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (o = !0));
        let w = null, _;
        this.options.gfm && (w = this.rules.other.listIsTask.exec(u), w && (_ = w[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: l,
          task: !!w,
          checked: _,
          loose: !1,
          text: u,
          tokens: []
        }), s.raw += l;
      }
      const a = s.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      s.raw = s.raw.trimEnd();
      for (let c = 0; c < s.items.length; c++)
        if (this.lexer.state.top = !1, s.items[c].tokens = this.lexer.blockTokens(s.items[c].text, []), !s.loose) {
          const l = s.items[c].tokens.filter((b) => b.type === "space"), u = l.length > 0 && l.some((b) => this.rules.other.anyLine.test(b.raw));
          s.loose = u;
        }
      if (s.loose)
        for (let c = 0; c < s.items.length; c++)
          s.items[c].loose = !0;
      return s;
    }
  }
  html(n) {
    const e = this.rules.block.html.exec(n);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(n) {
    const e = this.rules.block.def.exec(n);
    if (e) {
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: r,
        title: s
      };
    }
  }
  table(n) {
    var o;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = wt(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (o = e[3]) != null && o.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === r.length) {
      for (const a of r)
        this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < t.length; a++)
        i.header.push({
          text: t[a],
          tokens: this.lexer.inline(t[a]),
          header: !0,
          align: i.align[a]
        });
      for (const a of s)
        i.rows.push(wt(a, i.header.length).map((c, l) => ({
          text: c,
          tokens: this.lexer.inline(c),
          header: !1,
          align: i.align[l]
        })));
      return i;
    }
  }
  lheading(n) {
    const e = this.rules.block.lheading.exec(n);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(n) {
    const e = this.rules.block.paragraph.exec(n);
    if (e) {
      const t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  text(n) {
    const e = this.rules.block.text.exec(n);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(n) {
    const e = this.rules.inline.escape.exec(n);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(n) {
    const e = this.rules.inline.tag.exec(n);
    if (e)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(n) {
    const e = this.rules.inline.link.exec(n);
    if (e) {
      const t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t))
          return;
        const i = ae(t.slice(0, -1), "\\");
        if ((t.length - i.length) % 2 === 0)
          return;
      } else {
        const i = nr(e[2], "()");
        if (i === -2)
          return;
        if (i > -1) {
          const a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let r = e[2], s = "";
      if (this.options.pedantic) {
        const i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], s = i[3]);
      } else
        s = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), $t(e, {
        href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
        title: s && s.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      const r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[r.toLowerCase()];
      if (!s) {
        const i = t[0].charAt(0);
        return {
          type: "text",
          raw: i,
          text: i
        };
      }
      return $t(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!r || r[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const i = [...r[0]].length - 1;
      let o, a, c = i, l = 0;
      const u = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, e = e.slice(-1 * n.length + i); (r = u.exec(e)) != null; ) {
        if (o = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !o) continue;
        if (a = [...o].length, r[3] || r[4]) {
          c += a;
          continue;
        } else if ((r[5] || r[6]) && i % 3 && !((i + a) % 3)) {
          l += a;
          continue;
        }
        if (c -= a, c > 0) continue;
        a = Math.min(a, a + c + l);
        const b = [...r[0]][0].length, f = n.slice(0, i + r.index + b + a);
        if (Math.min(i, a) % 2) {
          const y = f.slice(1, -1);
          return {
            type: "em",
            raw: f,
            text: y,
            tokens: this.lexer.inlineTokens(y)
          };
        }
        const v = f.slice(2, -2);
        return {
          type: "strong",
          raw: f,
          text: v,
          tokens: this.lexer.inlineTokens(v)
        };
      }
    }
  }
  codespan(n) {
    const e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const r = this.rules.other.nonSpaceChar.test(t), s = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && s && (t = t.substring(1, t.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: t
      };
    }
  }
  br(n) {
    const e = this.rules.inline.br.exec(n);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(n) {
    const e = this.rules.inline.del.exec(n);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(n) {
    const e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: r,
        tokens: [
          {
            type: "text",
            raw: t,
            text: t
          }
        ]
      };
    }
  }
  url(n) {
    var t;
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let r, s;
      if (e[2] === "@")
        r = e[0], s = "mailto:" + r;
      else {
        let i;
        do
          i = e[0], e[0] = ((t = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : t[0]) ?? "";
        while (i !== e[0]);
        r = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: r,
        href: s,
        tokens: [
          {
            type: "text",
            raw: r,
            text: r
          }
        ]
      };
    }
  }
  inlineText(n) {
    const e = this.rules.inline.text.exec(n);
    if (e) {
      const t = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        escaped: t
      };
    }
  }
}, M = class Ue {
  constructor(e) {
    E(this, "tokens");
    E(this, "options");
    E(this, "state");
    E(this, "tokenizer");
    E(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Y, this.options.tokenizer = this.options.tokenizer || new Ee(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: I,
      block: we.normal,
      inline: ie.normal
    };
    this.options.pedantic ? (t.block = we.pedantic, t.inline = ie.pedantic) : this.options.gfm && (t.block = we.gfm, this.options.breaks ? t.inline = ie.breaks : t.inline = ie.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: we,
      inline: ie
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Ue(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Ue(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(I.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    var s, i, o;
    for (this.options.pedantic && (e = e.replace(I.tabCharGlobal, "    ").replace(I.spaceLine, "")); e; ) {
      let a;
      if ((i = (s = this.options.extensions) == null ? void 0 : s.block) != null && i.some((l) => (a = l.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1))
        continue;
      if (a = this.tokenizer.space(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        a.raw.length === 1 && l !== void 0 ? l.raw += `
` : t.push(a);
        continue;
      }
      if (a = this.tokenizer.code(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "paragraph" || (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + a.raw, l.text += `
` + a.text, this.inlineQueue.at(-1).src = l.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.fences(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.heading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.hr(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.blockquote(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.list(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.html(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.def(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "paragraph" || (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + a.raw, l.text += `
` + a.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = {
          href: a.href,
          title: a.title
        });
        continue;
      }
      if (a = this.tokenizer.table(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.lheading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let c = e;
      if ((o = this.options.extensions) != null && o.startBlock) {
        let l = 1 / 0;
        const u = e.slice(1);
        let b;
        this.options.extensions.startBlock.forEach((f) => {
          b = f.call({ lexer: this }, u), typeof b == "number" && b >= 0 && (l = Math.min(l, b));
        }), l < 1 / 0 && l >= 0 && (c = e.substring(0, l + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(c))) {
        const l = t.at(-1);
        r && (l == null ? void 0 : l.type) === "paragraph" ? (l.raw += `
` + a.raw, l.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(a), r = c.length !== e.length, e = e.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + a.raw, l.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(a);
        continue;
      }
      if (e) {
        const l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else
          throw new Error(l);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    var a, c, l;
    let r = e, s = null;
    if (this.tokens.links) {
      const u = Object.keys(this.tokens.links);
      if (u.length > 0)
        for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; )
          u.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; )
      r = r.slice(0, s.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; )
      r = r.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let i = !1, o = "";
    for (; e; ) {
      i || (o = ""), i = !1;
      let u;
      if ((c = (a = this.options.extensions) == null ? void 0 : a.inline) != null && c.some((f) => (u = f.call({ lexer: this }, e, t)) ? (e = e.substring(u.raw.length), t.push(u), !0) : !1))
        continue;
      if (u = this.tokenizer.escape(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.tag(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.link(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(u.raw.length);
        const f = t.at(-1);
        u.type === "text" && (f == null ? void 0 : f.type) === "text" ? (f.raw += u.raw, f.text += u.text) : t.push(u);
        continue;
      }
      if (u = this.tokenizer.emStrong(e, r, o)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.codespan(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.br(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.del(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.autolink(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (!this.state.inLink && (u = this.tokenizer.url(e))) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      let b = e;
      if ((l = this.options.extensions) != null && l.startInline) {
        let f = 1 / 0;
        const v = e.slice(1);
        let y;
        this.options.extensions.startInline.forEach((w) => {
          y = w.call({ lexer: this }, v), typeof y == "number" && y >= 0 && (f = Math.min(f, y));
        }), f < 1 / 0 && f >= 0 && (b = e.substring(0, f + 1));
      }
      if (u = this.tokenizer.inlineText(b)) {
        e = e.substring(u.raw.length), u.raw.slice(-1) !== "_" && (o = u.raw.slice(-1)), i = !0;
        const f = t.at(-1);
        (f == null ? void 0 : f.type) === "text" ? (f.raw += u.raw, f.text += u.text) : t.push(u);
        continue;
      }
      if (e) {
        const f = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(f);
          break;
        } else
          throw new Error(f);
      }
    }
    return t;
  }
}, Te = class {
  // set by the parser
  constructor(n) {
    E(this, "options");
    E(this, "parser");
    this.options = n || Y;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var i;
    const r = (i = (e || "").match(I.notSpaceStart)) == null ? void 0 : i[0], s = n.replace(I.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + N(r) + '">' + (t ? s : N(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : N(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    const e = n.ordered, t = n.start;
    let r = "";
    for (let o = 0; o < n.items.length; o++) {
      const a = n.items[o];
      r += this.listitem(a);
    }
    const s = e ? "ol" : "ul", i = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + s + i + `>
` + r + "</" + s + `>
`;
  }
  listitem(n) {
    var t;
    let e = "";
    if (n.task) {
      const r = this.checkbox({ checked: !!n.checked });
      n.loose ? ((t = n.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (n.tokens[0].text = r + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = r + " " + N(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
        type: "text",
        raw: r + " ",
        text: r + " ",
        escaped: !0
      }) : e += r + " ";
    }
    return e += this.parser.parse(n.tokens, !!n.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let s = 0; s < n.header.length; s++)
      t += this.tablecell(n.header[s]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let s = 0; s < n.rows.length; s++) {
      const i = n.rows[s];
      t = "";
      for (let o = 0; o < i.length; o++)
        t += this.tablecell(i[o]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    const e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${N(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const r = this.parser.parseInline(t), s = yt(n);
    if (s === null)
      return r;
    n = s;
    let i = '<a href="' + n + '"';
    return e && (i += ' title="' + N(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    const s = yt(n);
    if (s === null)
      return N(t);
    n = s;
    let i = `<img src="${n}" alt="${t}"`;
    return e && (i += ` title="${N(e)}"`), i += ">", i;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : N(n.text);
  }
}, nt = class {
  // no need for block level renderers
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
}, H = class qe {
  constructor(e) {
    E(this, "options");
    E(this, "renderer");
    E(this, "textRenderer");
    this.options = e || Y, this.options.renderer = this.options.renderer || new Te(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new nt();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new qe(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new qe(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    var s, i;
    let r = "";
    for (let o = 0; o < e.length; o++) {
      const a = e[o];
      if ((i = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && i[a.type]) {
        const l = a, u = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (u !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(l.type)) {
          r += u || "";
          continue;
        }
      }
      const c = a;
      switch (c.type) {
        case "space": {
          r += this.renderer.space(c);
          continue;
        }
        case "hr": {
          r += this.renderer.hr(c);
          continue;
        }
        case "heading": {
          r += this.renderer.heading(c);
          continue;
        }
        case "code": {
          r += this.renderer.code(c);
          continue;
        }
        case "table": {
          r += this.renderer.table(c);
          continue;
        }
        case "blockquote": {
          r += this.renderer.blockquote(c);
          continue;
        }
        case "list": {
          r += this.renderer.list(c);
          continue;
        }
        case "html": {
          r += this.renderer.html(c);
          continue;
        }
        case "paragraph": {
          r += this.renderer.paragraph(c);
          continue;
        }
        case "text": {
          let l = c, u = this.renderer.text(l);
          for (; o + 1 < e.length && e[o + 1].type === "text"; )
            l = e[++o], u += `
` + this.renderer.text(l);
          t ? r += this.renderer.paragraph({
            type: "paragraph",
            raw: u,
            text: u,
            tokens: [{ type: "text", raw: u, text: u, escaped: !0 }]
          }) : r += u;
          continue;
        }
        default: {
          const l = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent)
            return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return r;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    var s, i;
    let r = "";
    for (let o = 0; o < e.length; o++) {
      const a = e[o];
      if ((i = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && i[a.type]) {
        const l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          r += l || "";
          continue;
        }
      }
      const c = a;
      switch (c.type) {
        case "escape": {
          r += t.text(c);
          break;
        }
        case "html": {
          r += t.html(c);
          break;
        }
        case "link": {
          r += t.link(c);
          break;
        }
        case "image": {
          r += t.image(c);
          break;
        }
        case "strong": {
          r += t.strong(c);
          break;
        }
        case "em": {
          r += t.em(c);
          break;
        }
        case "codespan": {
          r += t.codespan(c);
          break;
        }
        case "br": {
          r += t.br(c);
          break;
        }
        case "del": {
          r += t.del(c);
          break;
        }
        case "text": {
          r += t.text(c);
          break;
        }
        default: {
          const l = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent)
            return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return r;
  }
}, He, ve = (He = class {
  constructor(n) {
    E(this, "options");
    E(this, "block");
    this.options = n || Y;
  }
  /**
   * Process markdown before marked
   */
  preprocess(n) {
    return n;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(n) {
    return n;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(n) {
    return n;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? M.lex : M.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? H.parse : H.parseInline;
  }
}, E(He, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), He), sr = class {
  constructor(...n) {
    E(this, "defaults", Xe());
    E(this, "options", this.setOptions);
    E(this, "parse", this.parseMarkdown(!0));
    E(this, "parseInline", this.parseMarkdown(!1));
    E(this, "Parser", H);
    E(this, "Renderer", Te);
    E(this, "TextRenderer", nt);
    E(this, "Lexer", M);
    E(this, "Tokenizer", Ee);
    E(this, "Hooks", ve);
    this.use(...n);
  }
  /**
   * Run callback for every token
   */
  walkTokens(n, e) {
    var r, s;
    let t = [];
    for (const i of n)
      switch (t = t.concat(e.call(this, i)), i.type) {
        case "table": {
          const o = i;
          for (const a of o.header)
            t = t.concat(this.walkTokens(a.tokens, e));
          for (const a of o.rows)
            for (const c of a)
              t = t.concat(this.walkTokens(c.tokens, e));
          break;
        }
        case "list": {
          const o = i;
          t = t.concat(this.walkTokens(o.items, e));
          break;
        }
        default: {
          const o = i;
          (s = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && s[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((a) => {
            const c = o[a].flat(1 / 0);
            t = t.concat(this.walkTokens(c, e));
          }) : o.tokens && (t = t.concat(this.walkTokens(o.tokens, e)));
        }
      }
    return t;
  }
  use(...n) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      const r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((s) => {
        if (!s.name)
          throw new Error("extension name required");
        if ("renderer" in s) {
          const i = e.renderers[s.name];
          i ? e.renderers[s.name] = function(...o) {
            let a = s.renderer.apply(this, o);
            return a === !1 && (a = i.apply(this, o)), a;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const i = e[s.level];
          i ? i.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), t.renderer) {
        const s = this.defaults.renderer || new Te(this.defaults);
        for (const i in t.renderer) {
          if (!(i in s))
            throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i))
            continue;
          const o = i, a = t.renderer[o], c = s[o];
          s[o] = (...l) => {
            let u = a.apply(s, l);
            return u === !1 && (u = c.apply(s, l)), u || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        const s = this.defaults.tokenizer || new Ee(this.defaults);
        for (const i in t.tokenizer) {
          if (!(i in s))
            throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i))
            continue;
          const o = i, a = t.tokenizer[o], c = s[o];
          s[o] = (...l) => {
            let u = a.apply(s, l);
            return u === !1 && (u = c.apply(s, l)), u;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        const s = this.defaults.hooks || new ve();
        for (const i in t.hooks) {
          if (!(i in s))
            throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i))
            continue;
          const o = i, a = t.hooks[o], c = s[o];
          ve.passThroughHooks.has(i) ? s[o] = (l) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(s, l)).then((b) => c.call(s, b));
            const u = a.call(s, l);
            return c.call(s, u);
          } : s[o] = (...l) => {
            let u = a.apply(s, l);
            return u === !1 && (u = c.apply(s, l)), u;
          };
        }
        r.hooks = s;
      }
      if (t.walkTokens) {
        const s = this.defaults.walkTokens, i = t.walkTokens;
        r.walkTokens = function(o) {
          let a = [];
          return a.push(i.call(this, o)), s && (a = a.concat(s.call(this, o))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return M.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return H.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (t, r) => {
      const s = { ...r }, i = { ...this.defaults, ...s }, o = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && s.async === !1)
        return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      i.hooks && (i.hooks.options = i, i.hooks.block = n);
      const a = i.hooks ? i.hooks.provideLexer() : n ? M.lex : M.lexInline, c = i.hooks ? i.hooks.provideParser() : n ? H.parse : H.parseInline;
      if (i.async)
        return Promise.resolve(i.hooks ? i.hooks.preprocess(t) : t).then((l) => a(l, i)).then((l) => i.hooks ? i.hooks.processAllTokens(l) : l).then((l) => i.walkTokens ? Promise.all(this.walkTokens(l, i.walkTokens)).then(() => l) : l).then((l) => c(l, i)).then((l) => i.hooks ? i.hooks.postprocess(l) : l).catch(o);
      try {
        i.hooks && (t = i.hooks.preprocess(t));
        let l = a(t, i);
        i.hooks && (l = i.hooks.processAllTokens(l)), i.walkTokens && this.walkTokens(l, i.walkTokens);
        let u = c(l, i);
        return i.hooks && (u = i.hooks.postprocess(u)), u;
      } catch (l) {
        return o(l);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const r = "<p>An error occurred:</p><pre>" + N(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, V = new sr();
function S(n, e) {
  return V.parse(n, e);
}
S.options = S.setOptions = function(n) {
  return V.setOptions(n), S.defaults = V.defaults, Dt(S.defaults), S;
};
S.getDefaults = Xe;
S.defaults = Y;
S.use = function(...n) {
  return V.use(...n), S.defaults = V.defaults, Dt(S.defaults), S;
};
S.walkTokens = function(n, e) {
  return V.walkTokens(n, e);
};
S.parseInline = V.parseInline;
S.Parser = H;
S.parser = H.parse;
S.Renderer = Te;
S.TextRenderer = nt;
S.Lexer = M;
S.lexer = M.lex;
S.Tokenizer = Ee;
S.Hooks = ve;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
H.parse;
M.lex;
var vt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ir(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Me = { exports: {} }, At;
function ar() {
  return At || (At = 1, (function(n) {
    var e = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */
    var t = (function(r) {
      var s = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, i = 0, o = {}, a = {
        /**
         * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
         * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
         * additional languages or plugins yourself.
         *
         * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
         *
         * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.manual = true;
         * // add a new <script> to load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        manual: r.Prism && r.Prism.manual,
        /**
         * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
         * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
         * own worker, you don't want it to do this.
         *
         * By setting this value to `true`, Prism will not add its own listeners to the worker.
         *
         * You obviously have to change this value before Prism executes. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.disableWorkerMessageHandler = true;
         * // Load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        disableWorkerMessageHandler: r.Prism && r.Prism.disableWorkerMessageHandler,
        /**
         * A namespace for utility methods.
         *
         * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
         * change or disappear at any time.
         *
         * @namespace
         * @memberof Prism
         */
        util: {
          encode: function p(h) {
            return h instanceof c ? new c(h.type, p(h.content), h.alias) : Array.isArray(h) ? h.map(p) : h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          },
          /**
           * Returns the name of the type of the given value.
           *
           * @param {any} o
           * @returns {string}
           * @example
           * type(null)      === 'Null'
           * type(undefined) === 'Undefined'
           * type(123)       === 'Number'
           * type('foo')     === 'String'
           * type(true)      === 'Boolean'
           * type([1, 2])    === 'Array'
           * type({})        === 'Object'
           * type(String)    === 'Function'
           * type(/abc+/)    === 'RegExp'
           */
          type: function(p) {
            return Object.prototype.toString.call(p).slice(8, -1);
          },
          /**
           * Returns a unique number for the given object. Later calls will still return the same number.
           *
           * @param {Object} obj
           * @returns {number}
           */
          objId: function(p) {
            return p.__id || Object.defineProperty(p, "__id", { value: ++i }), p.__id;
          },
          /**
           * Creates a deep clone of the given object.
           *
           * The main intended use of this function is to clone language definitions.
           *
           * @param {T} o
           * @param {Record<number, any>} [visited]
           * @returns {T}
           * @template T
           */
          clone: function p(h, d) {
            d = d || {};
            var m, g;
            switch (a.util.type(h)) {
              case "Object":
                if (g = a.util.objId(h), d[g])
                  return d[g];
                m = /** @type {Record<string, any>} */
                {}, d[g] = m;
                for (var k in h)
                  h.hasOwnProperty(k) && (m[k] = p(h[k], d));
                return (
                  /** @type {any} */
                  m
                );
              case "Array":
                return g = a.util.objId(h), d[g] ? d[g] : (m = [], d[g] = m, /** @type {Array} */
                /** @type {any} */
                h.forEach(function($, x) {
                  m[x] = p($, d);
                }), /** @type {any} */
                m);
              default:
                return h;
            }
          },
          /**
           * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
           *
           * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
           *
           * @param {Element} element
           * @returns {string}
           */
          getLanguage: function(p) {
            for (; p; ) {
              var h = s.exec(p.className);
              if (h)
                return h[1].toLowerCase();
              p = p.parentElement;
            }
            return "none";
          },
          /**
           * Sets the Prism `language-xxxx` class of the given element.
           *
           * @param {Element} element
           * @param {string} language
           * @returns {void}
           */
          setLanguage: function(p, h) {
            p.className = p.className.replace(RegExp(s, "gi"), ""), p.classList.add("language-" + h);
          },
          /**
           * Returns the script element that is currently executing.
           *
           * This does __not__ work for line script element.
           *
           * @returns {HTMLScriptElement | null}
           */
          currentScript: function() {
            if (typeof document > "u")
              return null;
            if (document.currentScript && document.currentScript.tagName === "SCRIPT")
              return (
                /** @type {any} */
                document.currentScript
              );
            try {
              throw new Error();
            } catch (m) {
              var p = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(m.stack) || [])[1];
              if (p) {
                var h = document.getElementsByTagName("script");
                for (var d in h)
                  if (h[d].src == p)
                    return h[d];
              }
              return null;
            }
          },
          /**
           * Returns whether a given class is active for `element`.
           *
           * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
           * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
           * given class is just the given class with a `no-` prefix.
           *
           * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
           * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
           * ancestors have the given class or the negated version of it, then the default activation will be returned.
           *
           * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
           * version of it, the class is considered active.
           *
           * @param {Element} element
           * @param {string} className
           * @param {boolean} [defaultActivation=false]
           * @returns {boolean}
           */
          isActive: function(p, h, d) {
            for (var m = "no-" + h; p; ) {
              var g = p.classList;
              if (g.contains(h))
                return !0;
              if (g.contains(m))
                return !1;
              p = p.parentElement;
            }
            return !!d;
          }
        },
        /**
         * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
         *
         * @namespace
         * @memberof Prism
         * @public
         */
        languages: {
          /**
           * The grammar for plain, unformatted text.
           */
          plain: o,
          plaintext: o,
          text: o,
          txt: o,
          /**
           * Creates a deep copy of the language with the given id and appends the given tokens.
           *
           * If a token in `redef` also appears in the copied language, then the existing token in the copied language
           * will be overwritten at its original position.
           *
           * ## Best practices
           *
           * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
           * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
           * understand the language definition because, normally, the order of tokens matters in Prism grammars.
           *
           * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
           * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
           *
           * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
           * @param {Grammar} redef The new tokens to append.
           * @returns {Grammar} The new language created.
           * @public
           * @example
           * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
           *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
           *     // at its original position
           *     'comment': { ... },
           *     // CSS doesn't have a 'color' token, so this token will be appended
           *     'color': /\b(?:red|green|blue)\b/
           * });
           */
          extend: function(p, h) {
            var d = a.util.clone(a.languages[p]);
            for (var m in h)
              d[m] = h[m];
            return d;
          },
          /**
           * Inserts tokens _before_ another token in a language definition or any other grammar.
           *
           * ## Usage
           *
           * This helper method makes it easy to modify existing languages. For example, the CSS language definition
           * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
           * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
           * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
           * this:
           *
           * ```js
           * Prism.languages.markup.style = {
           *     // token
           * };
           * ```
           *
           * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
           * before existing tokens. For the CSS example above, you would use it like this:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'cdata', {
           *     'style': {
           *         // token
           *     }
           * });
           * ```
           *
           * ## Special cases
           *
           * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
           * will be ignored.
           *
           * This behavior can be used to insert tokens after `before`:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'comment', {
           *     'comment': Prism.languages.markup.comment,
           *     // tokens after 'comment'
           * });
           * ```
           *
           * ## Limitations
           *
           * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
           * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
           * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
           * deleting properties which is necessary to insert at arbitrary positions.
           *
           * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
           * Instead, it will create a new object and replace all references to the target object with the new one. This
           * can be done without temporarily deleting properties, so the iteration order is well-defined.
           *
           * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
           * you hold the target object in a variable, then the value of the variable will not change.
           *
           * ```js
           * var oldMarkup = Prism.languages.markup;
           * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
           *
           * assert(oldMarkup !== Prism.languages.markup);
           * assert(newMarkup === Prism.languages.markup);
           * ```
           *
           * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
           * object to be modified.
           * @param {string} before The key to insert before.
           * @param {Grammar} insert An object containing the key-value pairs to be inserted.
           * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
           * object to be modified.
           *
           * Defaults to `Prism.languages`.
           * @returns {Grammar} The new grammar object.
           * @public
           */
          insertBefore: function(p, h, d, m) {
            m = m || /** @type {any} */
            a.languages;
            var g = m[p], k = {};
            for (var $ in g)
              if (g.hasOwnProperty($)) {
                if ($ == h)
                  for (var x in d)
                    d.hasOwnProperty(x) && (k[x] = d[x]);
                d.hasOwnProperty($) || (k[$] = g[$]);
              }
            var R = m[p];
            return m[p] = k, a.languages.DFS(a.languages, function(P, B) {
              B === R && P != p && (this[P] = k);
            }), k;
          },
          // Traverse a language definition with Depth First Search
          DFS: function p(h, d, m, g) {
            g = g || {};
            var k = a.util.objId;
            for (var $ in h)
              if (h.hasOwnProperty($)) {
                d.call(h, $, h[$], m || $);
                var x = h[$], R = a.util.type(x);
                R === "Object" && !g[k(x)] ? (g[k(x)] = !0, p(x, d, null, g)) : R === "Array" && !g[k(x)] && (g[k(x)] = !0, p(x, d, $, g));
              }
          }
        },
        plugins: {},
        /**
         * This is the most high-level function in Prism’s API.
         * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
         * each one of them.
         *
         * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
         *
         * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
         * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
         * @memberof Prism
         * @public
         */
        highlightAll: function(p, h) {
          a.highlightAllUnder(document, p, h);
        },
        /**
         * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
         * {@link Prism.highlightElement} on each one of them.
         *
         * The following hooks will be run:
         * 1. `before-highlightall`
         * 2. `before-all-elements-highlight`
         * 3. All hooks of {@link Prism.highlightElement} for each element.
         *
         * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
         * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
         * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
         * @memberof Prism
         * @public
         */
        highlightAllUnder: function(p, h, d) {
          var m = {
            callback: d,
            container: p,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          a.hooks.run("before-highlightall", m), m.elements = Array.prototype.slice.apply(m.container.querySelectorAll(m.selector)), a.hooks.run("before-all-elements-highlight", m);
          for (var g = 0, k; k = m.elements[g++]; )
            a.highlightElement(k, h === !0, m.callback);
        },
        /**
         * Highlights the code inside a single element.
         *
         * The following hooks will be run:
         * 1. `before-sanity-check`
         * 2. `before-highlight`
         * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
         * 4. `before-insert`
         * 5. `after-highlight`
         * 6. `complete`
         *
         * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
         * the element's language.
         *
         * @param {Element} element The element containing the code.
         * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
         * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
         * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
         * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
         *
         * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
         * asynchronous highlighting to work. You can build your own bundle on the
         * [Download page](https://prismjs.com/download.html).
         * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
         * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
         * @memberof Prism
         * @public
         */
        highlightElement: function(p, h, d) {
          var m = a.util.getLanguage(p), g = a.languages[m];
          a.util.setLanguage(p, m);
          var k = p.parentElement;
          k && k.nodeName.toLowerCase() === "pre" && a.util.setLanguage(k, m);
          var $ = p.textContent, x = {
            element: p,
            language: m,
            grammar: g,
            code: $
          };
          function R(B) {
            x.highlightedCode = B, a.hooks.run("before-insert", x), x.element.innerHTML = x.highlightedCode, a.hooks.run("after-highlight", x), a.hooks.run("complete", x), d && d.call(x.element);
          }
          if (a.hooks.run("before-sanity-check", x), k = x.element.parentElement, k && k.nodeName.toLowerCase() === "pre" && !k.hasAttribute("tabindex") && k.setAttribute("tabindex", "0"), !x.code) {
            a.hooks.run("complete", x), d && d.call(x.element);
            return;
          }
          if (a.hooks.run("before-highlight", x), !x.grammar) {
            R(a.util.encode(x.code));
            return;
          }
          if (h && r.Worker) {
            var P = new Worker(a.filename);
            P.onmessage = function(B) {
              R(B.data);
            }, P.postMessage(JSON.stringify({
              language: x.language,
              code: x.code,
              immediateClose: !0
            }));
          } else
            R(a.highlight(x.code, x.grammar, x.language));
        },
        /**
         * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
         * and the language definitions to use, and returns a string with the HTML produced.
         *
         * The following hooks will be run:
         * 1. `before-tokenize`
         * 2. `after-tokenize`
         * 3. `wrap`: On each {@link Token}.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @param {string} language The name of the language definition passed to `grammar`.
         * @returns {string} The highlighted HTML.
         * @memberof Prism
         * @public
         * @example
         * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
         */
        highlight: function(p, h, d) {
          var m = {
            code: p,
            grammar: h,
            language: d
          };
          if (a.hooks.run("before-tokenize", m), !m.grammar)
            throw new Error('The language "' + m.language + '" has no grammar.');
          return m.tokens = a.tokenize(m.code, m.grammar), a.hooks.run("after-tokenize", m), c.stringify(a.util.encode(m.tokens), m.language);
        },
        /**
         * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
         * and the language definitions to use, and returns an array with the tokenized code.
         *
         * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
         *
         * This method could be useful in other contexts as well, as a very crude parser.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @returns {TokenStream} An array of strings and tokens, a token stream.
         * @memberof Prism
         * @public
         * @example
         * let code = `var foo = 0;`;
         * let tokens = Prism.tokenize(code, Prism.languages.javascript);
         * tokens.forEach(token => {
         *     if (token instanceof Prism.Token && token.type === 'number') {
         *         console.log(`Found numeric literal: ${token.content}`);
         *     }
         * });
         */
        tokenize: function(p, h) {
          var d = h.rest;
          if (d) {
            for (var m in d)
              h[m] = d[m];
            delete h.rest;
          }
          var g = new b();
          return f(g, g.head, p), u(p, g, h, g.head, 0), y(g);
        },
        /**
         * @namespace
         * @memberof Prism
         * @public
         */
        hooks: {
          all: {},
          /**
           * Adds the given callback to the list of callbacks for the given hook.
           *
           * The callback will be invoked when the hook it is registered for is run.
           * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
           *
           * One callback function can be registered to multiple hooks and the same hook multiple times.
           *
           * @param {string} name The name of the hook.
           * @param {HookCallback} callback The callback function which is given environment variables.
           * @public
           */
          add: function(p, h) {
            var d = a.hooks.all;
            d[p] = d[p] || [], d[p].push(h);
          },
          /**
           * Runs a hook invoking all registered callbacks with the given environment variables.
           *
           * Callbacks will be invoked synchronously and in the order in which they were registered.
           *
           * @param {string} name The name of the hook.
           * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
           * @public
           */
          run: function(p, h) {
            var d = a.hooks.all[p];
            if (!(!d || !d.length))
              for (var m = 0, g; g = d[m++]; )
                g(h);
          }
        },
        Token: c
      };
      r.Prism = a;
      function c(p, h, d, m) {
        this.type = p, this.content = h, this.alias = d, this.length = (m || "").length | 0;
      }
      c.stringify = function p(h, d) {
        if (typeof h == "string")
          return h;
        if (Array.isArray(h)) {
          var m = "";
          return h.forEach(function(R) {
            m += p(R, d);
          }), m;
        }
        var g = {
          type: h.type,
          content: p(h.content, d),
          tag: "span",
          classes: ["token", h.type],
          attributes: {},
          language: d
        }, k = h.alias;
        k && (Array.isArray(k) ? Array.prototype.push.apply(g.classes, k) : g.classes.push(k)), a.hooks.run("wrap", g);
        var $ = "";
        for (var x in g.attributes)
          $ += " " + x + '="' + (g.attributes[x] || "").replace(/"/g, "&quot;") + '"';
        return "<" + g.tag + ' class="' + g.classes.join(" ") + '"' + $ + ">" + g.content + "</" + g.tag + ">";
      };
      function l(p, h, d, m) {
        p.lastIndex = h;
        var g = p.exec(d);
        if (g && m && g[1]) {
          var k = g[1].length;
          g.index += k, g[0] = g[0].slice(k);
        }
        return g;
      }
      function u(p, h, d, m, g, k) {
        for (var $ in d)
          if (!(!d.hasOwnProperty($) || !d[$])) {
            var x = d[$];
            x = Array.isArray(x) ? x : [x];
            for (var R = 0; R < x.length; ++R) {
              if (k && k.cause == $ + "," + R)
                return;
              var P = x[R], B = P.inside, rt = !!P.lookbehind, st = !!P.greedy, Xt = P.alias;
              if (st && !P.pattern.global) {
                var Vt = P.pattern.toString().match(/[imsuy]*$/)[0];
                P.pattern = RegExp(P.pattern.source, Vt + "g");
              }
              for (var it = P.pattern || P, F = m.next, D = g; F !== h.tail && !(k && D >= k.reach); D += F.value.length, F = F.next) {
                var K = F.value;
                if (h.length > p.length)
                  return;
                if (!(K instanceof c)) {
                  var be = 1, O;
                  if (st) {
                    if (O = l(it, D, p, rt), !O || O.index >= p.length)
                      break;
                    var ke = O.index, Yt = O.index + O[0].length, U = D;
                    for (U += F.value.length; ke >= U; )
                      F = F.next, U += F.value.length;
                    if (U -= F.value.length, D = U, F.value instanceof c)
                      continue;
                    for (var re = F; re !== h.tail && (U < Yt || typeof re.value == "string"); re = re.next)
                      be++, U += re.value.length;
                    be--, K = p.slice(D, U), O.index -= D;
                  } else if (O = l(it, 0, K, rt), !O)
                    continue;
                  var ke = O.index, xe = O[0], Fe = K.slice(0, ke), at = K.slice(ke + xe.length), Ie = D + K.length;
                  k && Ie > k.reach && (k.reach = Ie);
                  var ye = F.prev;
                  Fe && (ye = f(h, ye, Fe), D += Fe.length), v(h, ye, be);
                  var Kt = new c($, B ? a.tokenize(xe, B) : xe, Xt, xe);
                  if (F = f(h, ye, Kt), at && f(h, F, at), be > 1) {
                    var Le = {
                      cause: $ + "," + R,
                      reach: Ie
                    };
                    u(p, h, d, F.prev, D, Le), k && Le.reach > k.reach && (k.reach = Le.reach);
                  }
                }
              }
            }
          }
      }
      function b() {
        var p = { value: null, prev: null, next: null }, h = { value: null, prev: p, next: null };
        p.next = h, this.head = p, this.tail = h, this.length = 0;
      }
      function f(p, h, d) {
        var m = h.next, g = { value: d, prev: h, next: m };
        return h.next = g, m.prev = g, p.length++, g;
      }
      function v(p, h, d) {
        for (var m = h.next, g = 0; g < d && m !== p.tail; g++)
          m = m.next;
        h.next = m, m.prev = h, p.length -= g;
      }
      function y(p) {
        for (var h = [], d = p.head.next; d !== p.tail; )
          h.push(d.value), d = d.next;
        return h;
      }
      if (!r.document)
        return r.addEventListener && (a.disableWorkerMessageHandler || r.addEventListener("message", function(p) {
          var h = JSON.parse(p.data), d = h.language, m = h.code, g = h.immediateClose;
          r.postMessage(a.highlight(m, a.languages[d], d)), g && r.close();
        }, !1)), a;
      var w = a.util.currentScript();
      w && (a.filename = w.src, w.hasAttribute("data-manual") && (a.manual = !0));
      function _() {
        a.manual || a.highlightAll();
      }
      if (!a.manual) {
        var T = document.readyState;
        T === "loading" || T === "interactive" && w && w.defer ? document.addEventListener("DOMContentLoaded", _) : window.requestAnimationFrame ? window.requestAnimationFrame(_) : window.setTimeout(_, 16);
      }
      return a;
    })(e);
    n.exports && (n.exports = t), typeof vt < "u" && (vt.Prism = t), t.languages.markup = {
      comment: {
        pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
        greedy: !0
      },
      prolog: {
        pattern: /<\?[\s\S]+?\?>/,
        greedy: !0
      },
      doctype: {
        // https://www.w3.org/TR/xml/#NT-doctypedecl
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
          "internal-subset": {
            pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
            lookbehind: !0,
            greedy: !0,
            inside: null
            // see below
          },
          string: {
            pattern: /"[^"]*"|'[^']*'/,
            greedy: !0
          },
          punctuation: /^<!|>$|[[\]]/,
          "doctype-tag": /^DOCTYPE/i,
          name: /[^\s<>'"]+/
        }
      },
      cdata: {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        greedy: !0
      },
      tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/,
            inside: {
              punctuation: /^<\/?/,
              namespace: /^[^\s>\/:]+:/
            }
          },
          "special-attr": [],
          "attr-value": {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
            inside: {
              punctuation: [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                {
                  pattern: /^(\s*)["']|["']$/,
                  lookbehind: !0
                }
              ]
            }
          },
          punctuation: /\/?>/,
          "attr-name": {
            pattern: /[^\s>\/]+/,
            inside: {
              namespace: /^[^\s>\/:]+:/
            }
          }
        }
      },
      entity: [
        {
          pattern: /&[\da-z]{1,8};/i,
          alias: "named-entity"
        },
        /&#x?[\da-f]{1,8};/i
      ]
    }, t.languages.markup.tag.inside["attr-value"].inside.entity = t.languages.markup.entity, t.languages.markup.doctype.inside["internal-subset"].inside = t.languages.markup, t.hooks.add("wrap", function(r) {
      r.type === "entity" && (r.attributes.title = r.content.replace(/&amp;/, "&"));
    }), Object.defineProperty(t.languages.markup.tag, "addInlined", {
      /**
       * Adds an inlined language to markup.
       *
       * An example of an inlined language is CSS with `<style>` tags.
       *
       * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addInlined('style', 'css');
       */
      value: function(s, i) {
        var o = {};
        o["language-" + i] = {
          pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
          lookbehind: !0,
          inside: t.languages[i]
        }, o.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var a = {
          "included-cdata": {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            inside: o
          }
        };
        a["language-" + i] = {
          pattern: /[\s\S]+/,
          inside: t.languages[i]
        };
        var c = {};
        c[s] = {
          pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
            return s;
          }), "i"),
          lookbehind: !0,
          greedy: !0,
          inside: a
        }, t.languages.insertBefore("markup", "cdata", c);
      }
    }), Object.defineProperty(t.languages.markup.tag, "addAttribute", {
      /**
       * Adds an pattern to highlight languages embedded in HTML attributes.
       *
       * An example of an inlined language is CSS with `style` attributes.
       *
       * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addAttribute('style', 'css');
       */
      value: function(r, s) {
        t.languages.markup.tag.inside["special-attr"].push({
          pattern: RegExp(
            /(^|["'\s])/.source + "(?:" + r + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
            "i"
          ),
          lookbehind: !0,
          inside: {
            "attr-name": /^[^\s=]+/,
            "attr-value": {
              pattern: /=[\s\S]+/,
              inside: {
                value: {
                  pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                  lookbehind: !0,
                  alias: [s, "language-" + s],
                  inside: t.languages[s]
                },
                punctuation: [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  /"|'/
                ]
              }
            }
          }
        });
      }
    }), t.languages.html = t.languages.markup, t.languages.mathml = t.languages.markup, t.languages.svg = t.languages.markup, t.languages.xml = t.languages.extend("markup", {}), t.languages.ssml = t.languages.xml, t.languages.atom = t.languages.xml, t.languages.rss = t.languages.xml, (function(r) {
      var s = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
      r.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
          pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + s.source + ")*?" + /(?:;|(?=\s*\{))/.source),
          inside: {
            rule: /^@[\w-]+/,
            "selector-function-argument": {
              pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
              lookbehind: !0,
              alias: "selector"
            },
            keyword: {
              pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
              lookbehind: !0
            }
            // See rest below
          }
        },
        url: {
          // https://drafts.csswg.org/css-values-3/#urls
          pattern: RegExp("\\burl\\((?:" + s.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
          greedy: !0,
          inside: {
            function: /^url/i,
            punctuation: /^\(|\)$/,
            string: {
              pattern: RegExp("^" + s.source + "$"),
              alias: "url"
            }
          }
        },
        selector: {
          pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + s.source + ")*(?=\\s*\\{)"),
          lookbehind: !0
        },
        string: {
          pattern: s,
          greedy: !0
        },
        property: {
          pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
          lookbehind: !0
        },
        important: /!important\b/i,
        function: {
          pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
          lookbehind: !0
        },
        punctuation: /[(){};:,]/
      }, r.languages.css.atrule.inside.rest = r.languages.css;
      var i = r.languages.markup;
      i && (i.tag.addInlined("style", "css"), i.tag.addAttribute("style", "css"));
    })(t), t.languages.clike = {
      comment: [
        {
          pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
          lookbehind: !0,
          greedy: !0
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: !0,
          greedy: !0
        }
      ],
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
      },
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
          punctuation: /[.\\]/
        }
      },
      keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
      boolean: /\b(?:false|true)\b/,
      function: /\b\w+(?=\()/,
      number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
      operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
      punctuation: /[{}[\];(),.:]/
    }, t.languages.javascript = t.languages.extend("clike", {
      "class-name": [
        t.languages.clike["class-name"],
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
          lookbehind: !0
        }
      ],
      keyword: [
        {
          pattern: /((?:^|\})\s*)catch\b/,
          lookbehind: !0
        },
        {
          pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
          lookbehind: !0
        }
      ],
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
      number: {
        pattern: RegExp(
          /(^|[^\w$])/.source + "(?:" + // constant
          (/NaN|Infinity/.source + "|" + // binary integer
          /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
          /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
          /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
          /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
          /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
        ),
        lookbehind: !0
      },
      operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    }), t.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, t.languages.insertBefore("javascript", "keyword", {
      regex: {
        pattern: RegExp(
          // lookbehind
          // eslint-disable-next-line regexp/no-dupe-characters-character-class
          /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
          // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
          // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
          // with the only syntax, so we have to define 2 different regex patterns.
          /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          "regex-source": {
            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
            lookbehind: !0,
            alias: "language-regex",
            inside: t.languages.regex
          },
          "regex-delimiter": /^\/|\/$/,
          "regex-flags": /^[a-z]+$/
        }
      },
      // This must be declared before keyword because we use "function" inside the look-forward
      "function-variable": {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: "function"
      },
      parameter: [
        {
          pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
          lookbehind: !0,
          inside: t.languages.javascript
        },
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
          lookbehind: !0,
          inside: t.languages.javascript
        },
        {
          pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
          lookbehind: !0,
          inside: t.languages.javascript
        },
        {
          pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
          lookbehind: !0,
          inside: t.languages.javascript
        }
      ],
      constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    }), t.languages.insertBefore("javascript", "string", {
      hashbang: {
        pattern: /^#!.*/,
        greedy: !0,
        alias: "comment"
      },
      "template-string": {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: !0,
        inside: {
          "template-punctuation": {
            pattern: /^`|`$/,
            alias: "string"
          },
          interpolation: {
            pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
            lookbehind: !0,
            inside: {
              "interpolation-punctuation": {
                pattern: /^\$\{|\}$/,
                alias: "punctuation"
              },
              rest: t.languages.javascript
            }
          },
          string: /[\s\S]+/
        }
      },
      "string-property": {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: !0,
        greedy: !0,
        alias: "property"
      }
    }), t.languages.insertBefore("javascript", "operator", {
      "literal-property": {
        pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: !0,
        alias: "property"
      }
    }), t.languages.markup && (t.languages.markup.tag.addInlined("script", "javascript"), t.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
      "javascript"
    )), t.languages.js = t.languages.javascript, (function() {
      if (typeof t > "u" || typeof document > "u")
        return;
      Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
      var r = "Loading…", s = function(w, _) {
        return "✖ Error " + w + " while fetching file: " + _;
      }, i = "✖ Error: File does not exist or is empty", o = {
        js: "javascript",
        py: "python",
        rb: "ruby",
        ps1: "powershell",
        psm1: "powershell",
        sh: "bash",
        bat: "batch",
        h: "c",
        tex: "latex"
      }, a = "data-src-status", c = "loading", l = "loaded", u = "failed", b = "pre[data-src]:not([" + a + '="' + l + '"]):not([' + a + '="' + c + '"])';
      function f(w, _, T) {
        var p = new XMLHttpRequest();
        p.open("GET", w, !0), p.onreadystatechange = function() {
          p.readyState == 4 && (p.status < 400 && p.responseText ? _(p.responseText) : p.status >= 400 ? T(s(p.status, p.statusText)) : T(i));
        }, p.send(null);
      }
      function v(w) {
        var _ = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(w || "");
        if (_) {
          var T = Number(_[1]), p = _[2], h = _[3];
          return p ? h ? [T, Number(h)] : [T, void 0] : [T, T];
        }
      }
      t.hooks.add("before-highlightall", function(w) {
        w.selector += ", " + b;
      }), t.hooks.add("before-sanity-check", function(w) {
        var _ = (
          /** @type {HTMLPreElement} */
          w.element
        );
        if (_.matches(b)) {
          w.code = "", _.setAttribute(a, c);
          var T = _.appendChild(document.createElement("CODE"));
          T.textContent = r;
          var p = _.getAttribute("data-src"), h = w.language;
          if (h === "none") {
            var d = (/\.(\w+)$/.exec(p) || [, "none"])[1];
            h = o[d] || d;
          }
          t.util.setLanguage(T, h), t.util.setLanguage(_, h);
          var m = t.plugins.autoloader;
          m && m.loadLanguages(h), f(
            p,
            function(g) {
              _.setAttribute(a, l);
              var k = v(_.getAttribute("data-range"));
              if (k) {
                var $ = g.split(/\r\n?|\n/g), x = k[0], R = k[1] == null ? $.length : k[1];
                x < 0 && (x += $.length), x = Math.max(0, Math.min(x - 1, $.length)), R < 0 && (R += $.length), R = Math.max(0, Math.min(R, $.length)), g = $.slice(x, R).join(`
`), _.hasAttribute("data-start") || _.setAttribute("data-start", String(x + 1));
              }
              T.textContent = g, t.highlightElement(T);
            },
            function(g) {
              _.setAttribute(a, u), T.textContent = g;
            }
          );
        }
      }), t.plugins.fileHighlight = {
        /**
         * Executes the File Highlight plugin for all matching `pre` elements under the given container.
         *
         * Note: Elements which are already loaded or currently loading will not be touched by this method.
         *
         * @param {ParentNode} [container=document]
         */
        highlight: function(_) {
          for (var T = (_ || document).querySelectorAll(b), p = 0, h; h = T[p++]; )
            t.highlightElement(h);
        }
      };
      var y = !1;
      t.fileHighlight = function() {
        y || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), y = !0), t.plugins.fileHighlight.highlight.apply(this, arguments);
      };
    })();
  })(Me)), Me.exports;
}
var or = ar();
const lr = /* @__PURE__ */ ir(or);
var St = {}, _t;
function cr() {
  return _t || (_t = 1, (function(n) {
    n.languages.typescript = n.languages.extend("javascript", {
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
        lookbehind: !0,
        greedy: !0,
        inside: null
        // see below
      },
      builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
    }), n.languages.typescript.keyword.push(
      /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
      // keywords that have to be followed by an identifier
      /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
      // This is for `import type *, {}`
      /\btype\b(?=\s*(?:[\{*]|$))/
    ), delete n.languages.typescript.parameter, delete n.languages.typescript["literal-property"];
    var e = n.languages.extend("typescript", {});
    delete e["class-name"], n.languages.typescript["class-name"].inside = e, n.languages.insertBefore("typescript", "function", {
      decorator: {
        pattern: /@[$\w\xA0-\uFFFF]+/,
        inside: {
          at: {
            pattern: /^@/,
            alias: "operator"
          },
          function: /^[\s\S]+/
        }
      },
      "generic-function": {
        // e.g. foo<T extends "bar" | "baz">( ...
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
        greedy: !0,
        inside: {
          function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
          generic: {
            pattern: /<[\s\S]+/,
            // everything after the first <
            alias: "class-name",
            inside: e
          }
        }
      }
    }), n.languages.ts = n.languages.typescript;
  })(Prism)), St;
}
cr();
(function(n) {
  var e = "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b", t = {
    pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
    lookbehind: !0,
    alias: "punctuation",
    // this looks reasonably well in all themes
    inside: null
    // see below
  }, r = {
    bash: t,
    environment: {
      pattern: RegExp("\\$" + e),
      alias: "constant"
    },
    variable: [
      // [0]: Arithmetic Environment
      {
        pattern: /\$?\(\([\s\S]+?\)\)/,
        greedy: !0,
        inside: {
          // If there is a $ sign at the beginning highlight $(( and )) as variable
          variable: [
            {
              pattern: /(^\$\(\([\s\S]+)\)\)/,
              lookbehind: !0
            },
            /^\$\(\(/
          ],
          number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
          // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
          operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
          // If there is no $ sign at the beginning highlight (( and )) as punctuation
          punctuation: /\(\(?|\)\)?|,|;/
        }
      },
      // [1]: Command Substitution
      {
        pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
        greedy: !0,
        inside: {
          variable: /^\$\(|^`|\)$|`$/
        }
      },
      // [2]: Brace expansion
      {
        pattern: /\$\{[^}]+\}/,
        greedy: !0,
        inside: {
          operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
          punctuation: /[\[\]]/,
          environment: {
            pattern: RegExp("(\\{)" + e),
            lookbehind: !0,
            alias: "constant"
          }
        }
      },
      /\$(?:\w+|[#?*!@$])/
    ],
    // Escape sequences from echo and printf's manuals, and escaped quotes.
    entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
  };
  n.languages.bash = {
    shebang: {
      pattern: /^#!\s*\/.*/,
      alias: "important"
    },
    comment: {
      pattern: /(^|[^"{\\$])#.*/,
      lookbehind: !0
    },
    "function-name": [
      // a) function foo {
      // b) foo() {
      // c) function foo() {
      // but not “foo {”
      {
        // a) and c)
        pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
        lookbehind: !0,
        alias: "function"
      },
      {
        // b)
        pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
        alias: "function"
      }
    ],
    // Highlight variable names as variables in for and select beginnings.
    "for-or-select": {
      pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
      alias: "variable",
      lookbehind: !0
    },
    // Highlight variable names as variables in the left-hand part
    // of assignments (“=” and “+=”).
    "assign-left": {
      pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
      inside: {
        environment: {
          pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + e),
          lookbehind: !0,
          alias: "constant"
        }
      },
      alias: "variable",
      lookbehind: !0
    },
    // Highlight parameter names as variables
    parameter: {
      pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
      alias: "variable",
      lookbehind: !0
    },
    string: [
      // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
      {
        pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
        lookbehind: !0,
        greedy: !0,
        inside: r
      },
      // Here-document with quotes around the tag
      // → No expansion (so no “inside”).
      {
        pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          bash: t
        }
      },
      // “Normal” string
      {
        // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
        pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
        lookbehind: !0,
        greedy: !0,
        inside: r
      },
      {
        // https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
        pattern: /(^|[^$\\])'[^']*'/,
        lookbehind: !0,
        greedy: !0
      },
      {
        // https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
        pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
        greedy: !0,
        inside: {
          entity: r.entity
        }
      }
    ],
    environment: {
      pattern: RegExp("\\$?" + e),
      alias: "constant"
    },
    variable: r.variable,
    function: {
      pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
      lookbehind: !0
    },
    keyword: {
      pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
      lookbehind: !0
    },
    // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
    builtin: {
      pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
      lookbehind: !0,
      // Alias added to make those easier to distinguish from strings.
      alias: "class-name"
    },
    boolean: {
      pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
      lookbehind: !0
    },
    "file-descriptor": {
      pattern: /\B&\d\b/,
      alias: "important"
    },
    operator: {
      // Lots of redirections here, but not just that.
      pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
      inside: {
        "file-descriptor": {
          pattern: /^\d/,
          alias: "important"
        }
      }
    },
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
    number: {
      pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
      lookbehind: !0
    }
  }, t.inside = n.languages.bash;
  for (var s = [
    "comment",
    "function-name",
    "for-or-select",
    "assign-left",
    "parameter",
    "string",
    "environment",
    "function",
    "keyword",
    "builtin",
    "boolean",
    "file-descriptor",
    "operator",
    "punctuation",
    "number"
  ], i = r.variable[1].inside, o = 0; o < s.length; o++)
    i[s[o]] = n.languages.bash[s[o]];
  n.languages.sh = n.languages.bash, n.languages.shell = n.languages.bash;
})(Prism);
const Et = "http://localhost:3001/api";
function Tt(n, e) {
  return `${n.replace(/\/$/, "")}${e.startsWith("/") ? e : `/${e}`}`;
}
async function Rt(n) {
  const e = await fetch(n);
  if (!e.ok)
    throw new Error(`请求失败: ${e.status}`);
  return e.json();
}
const ur = `
  :host {
    display: block;
    width: 100%;
    color: #1f2937;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
  }

  :host([theme='dark']) {
    color: #f3f4f6;
  }

  h1, h2, h3 {
    margin: 0 0 0.75rem;
    font-weight: 700;
  }

  a {
    color: #2563eb;
  }

  :host([theme='dark']) a {
    color: #60a5fa;
  }

  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    background: #fff;
  }

  :host([theme='dark']) .card {
    border-color: #374151;
    background: #1f2937;
  }

  .muted {
    color: #6b7280;
    font-size: 0.875rem;
  }

  :host([theme='dark']) .muted {
    color: #9ca3af;
  }

  .error {
    color: #dc2626;
    padding: 1rem;
    text-align: center;
  }
`;
var hr = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, z = (n, e, t, r) => {
  for (var s = r > 1 ? void 0 : r ? pr(e, t) : e, i = n.length - 1, o; i >= 0; i--)
    (o = n[i]) && (s = (r ? o(e, t, s) : o(s)) || s);
  return r && s && hr(e, t, s), s;
};
let L = class extends ce {
  constructor() {
    super(...arguments), this.theme = "light", this.apiBase = Et, this.articleId = "", this.mode = "list", this.articles = [], this.detail = null, this.filterCategory = "", this.filterTag = "", this.error = "", this.loading = !0;
  }
  connectedCallback() {
    super.connectedCallback(), this.load();
  }
  updated(n) {
    (n.has("articleId") || n.has("mode") || n.has("apiBase")) && this.load();
  }
  async load() {
    this.loading = !0, this.error = "";
    const n = this.apiBase || Et;
    try {
      if (this.mode === "detail" && this.articleId)
        this.detail = await Rt(
          Tt(n, `/article/${this.articleId}`)
        ), this.articles = [];
      else {
        const e = new URLSearchParams();
        this.filterCategory && e.set("category", this.filterCategory), this.filterTag && e.set("tag", this.filterTag);
        const t = e.toString() ? `?${e}` : "";
        this.articles = await Rt(
          Tt(n, `/article/list${t}`)
        ), this.detail = null;
      }
    } catch {
      this.error = "博客加载失败";
    } finally {
      this.loading = !1;
    }
  }
  renderMarkdown(n) {
    const e = S.parse(n, { async: !1 }), t = document.createElement("div");
    return t.innerHTML = e, t.querySelectorAll("pre code").forEach((r) => {
      lr.highlightElement(r);
    }), t.innerHTML;
  }
  get categories() {
    return [...new Set(this.articles.map((n) => n.category).filter(Boolean))];
  }
  render() {
    return this.loading ? Q`<p class="muted">加载中...</p>` : this.error ? Q`<p class="error">${this.error}</p>` : this.mode === "detail" && this.detail ? Q`
        <a class="back" href="/blog">← 返回列表</a>
        <article>
          <h1>${this.detail.title}</h1>
          <p class="muted">
            ${new Date(this.detail.publishedAt).toLocaleDateString("zh-CN")}
            ${this.detail.category ? ` · ${this.detail.category}` : C}
          </p>
          <div
            class="article-body"
            .innerHTML=${this.renderMarkdown(this.detail.content)}
          ></div>
        </article>
      ` : Q`
      <h1>博客</h1>
      <div class="toolbar">
        <select
          @change=${(n) => {
      this.filterCategory = n.target.value, this.load();
    }}
        >
          <option value="">全部分类</option>
          ${this.categories.map(
      (n) => Q`<option value=${n}>${n}</option>`
    )}
        </select>
        <input
          placeholder="按标签筛选"
          .value=${this.filterTag}
          @change=${(n) => {
      this.filterTag = n.target.value, this.load();
    }}
        />
        <button type="button" @click=${() => void this.load()}>筛选</button>
      </div>

      ${this.articles.map(
      (n) => Q`
          <div class="card list-item">
            <h2>
              <a href="/blog/${n.id}">${n.title}</a>
            </h2>
            <p class="muted">${n.summary || ""}</p>
            <p class="muted">
              ${new Date(n.publishedAt).toLocaleDateString("zh-CN")}
            </p>
          </div>
        `
    )}
    `;
  }
};
L.styles = [
  Ft(ur),
  en`
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      select,
      button {
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background: #fff;
        cursor: pointer;
      }
      :host([theme='dark']) select,
      :host([theme='dark']) button {
        background: #374151;
        border-color: #4b5563;
        color: #f3f4f6;
      }
      .list-item {
        margin-bottom: 1rem;
      }
      .article-body :is(pre, code) {
        font-family: ui-monospace, monospace;
      }
      .article-body pre {
        background: #111827;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
      }
      .back {
        margin-bottom: 1rem;
      }
    `
];
z([
  fe({ type: String })
], L.prototype, "theme", 2);
z([
  fe({ type: String, attribute: "api-base" })
], L.prototype, "apiBase", 2);
z([
  fe({ type: String, attribute: "article-id" })
], L.prototype, "articleId", 2);
z([
  fe({ type: String })
], L.prototype, "mode", 2);
z([
  ne()
], L.prototype, "articles", 2);
z([
  ne()
], L.prototype, "detail", 2);
z([
  ne()
], L.prototype, "filterCategory", 2);
z([
  ne()
], L.prototype, "filterTag", 2);
z([
  ne()
], L.prototype, "error", 2);
z([
  ne()
], L.prototype, "loading", 2);
L = z([
  yn("wc-blog")
], L);
export {
  L as WcBlog
};
