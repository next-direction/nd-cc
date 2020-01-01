!function (e, t) {'object' == typeof exports && 'object' == typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define([], t) : 'object' == typeof exports ? exports.Paragraph = t() : e.Paragraph = t();}(window, function () {
  return function (e) {
    var t = {};

    function n (r) {
      if (t[r]) return t[r].exports;
      var o = t[r] = { i: r, l: !1, exports: {} };
      return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }

    return n.m = e, n.c = t, n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: r,
      });
    }, n.r = function (e) {'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });}, n.t = function (e, t) {
      if (1 & t && (e = n(e)), 8 & t) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (n.r(r), Object.defineProperty(r, 'default', {
        enumerable: !0,
        value: e,
      }), 2 & t && 'string' != typeof e) for (var o in e) n.d(r, o, function (t) {return e[t];}.bind(null, o));
      return r;
    }, n.n = function (e) {
      var t = e && e.__esModule ? function () {return e.default;} : function () {return e;};
      return n.d(t, 'a', t), t;
    }, n.o = function (e, t) {return Object.prototype.hasOwnProperty.call(e, t);}, n.p = '/', n(n.s = 0);
  }([function (e, t, n) {
    function r (e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, 'value' in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }

    function o (e, t, n) {return t && r(e.prototype, t), n && r(e, n), e;}

    n(1).toString();
    /**
     * Base Paragraph Block for the Editor.js.
     * Represents simple paragraph
     *
     * @author CodeX (team@codex.so)
     * @copyright CodeX 2018
     * @license The MIT License (MIT)
     */
    var i = function () {
      function e (t) {
        var n = t.data, r = t.config, o = t.api;
        !function (e, t) {if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');}(this, e), this.api = o, this._CSS = {
          block: this.api.styles.block,
          wrapper: 'ce-paragraph',
        }, this.onKeyUp = this.onKeyUp.bind(this), this._placeholder = r.placeholder ? r.placeholder : e.DEFAULT_PLACEHOLDER, this._data = {}, this._element = this.drawView(), this.data = n;
      }

      return o(e, null, [{ key: 'DEFAULT_PLACEHOLDER', get: function () {return '';} }]), o(e, [{
        key: 'onKeyUp',
        value: function (e) {'Backspace' !== e.code && 'Delete' !== e.code || '' === this._element.textContent && (this._element.innerHTML = '');},
      }, {
        key: 'drawView', value: function () {
          var e = document.createElement('DIV');
          return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = !0, e.dataset.placeholder = this._placeholder, e.addEventListener('keyup', this.onKeyUp), e;
        },
      }, { key: 'render', value: function () {return this._element;} }, {
        key: 'merge', value: function (e) {
          var t = { text: this.data.text + e.text };
          this.data = t;
        },
      }, { key: 'validate', value: function (e) {return '' !== e.text.trim();} }, { key: 'save', value: function (e) {return { text: e.innerHTML };} }, {
        key: 'onPaste',
        value: function (e) {
          var t = { text: e.detail.data.innerHTML };
          this.data = t;
        },
      }, {
        key: 'data', get: function () {
          var e = this._element.innerHTML;
          return this._data.text = e, this._data;
        }, set: function (e) {this._data = e || {}, this._element.innerHTML = this._data.text || '';},
      }], [{ key: 'conversionConfig', get: function () {return { export: 'text', import: 'text' };} }, {
        key: 'sanitize',
        get: function () {return { text: { br: !0 } };},
      }, { key: 'pasteConfig', get: function () {return { tags: ['P'] };} }, { key: 'toolbox', get: function () {return { icon: n(6).default, title: 'Text' };} }]), e;
    }();
    e.exports = i;
  }, function (e, t, n) {
    var r = n(2);
    'string' == typeof r && (r = [[e.i, r, '']]);
    var o = { hmr: !0, transform: void 0, insertInto: void 0 };
    n(4)(r, o);
    r.locals && (e.exports = r.locals);
  }, function (e, t, n) {(e.exports = n(3)(!1)).push([e.i, '.ce-paragraph {\n    line-height: 1.6em;\n    outline: none;\n}\n\n.ce-paragraph[data-placeholder]:empty::before{\n  content: attr(data-placeholder);\n  color: #707684;\n  font-weight: normal;\n  opacity: 0;\n}\n\n/** Show placeholder at the first paragraph if Editor is empty */\n.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty::before {\n  opacity: 1;\n}\n\n.codex-editor--toolbox-opened .ce-block:first-child .ce-paragraph[data-placeholder]:empty::before,\n.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty:focus::before {\n  opacity: 0;\n}\n\n.ce-paragraph p:first-of-type{\n    margin-top: 0;\n}\n\n.ce-paragraph p:last-of-type{\n    margin-bottom: 0;\n}\n', '']);}, function (e, t) {
    e.exports = function (e) {
      var t = [];
      return t.toString = function () {
        return this.map(function (t) {
          var n = function (e, t) {
            var n = e[1] || '', r = e[3];
            if (!r) return n;
            if (t && 'function' == typeof btoa) {
              var o = (a = r, '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(a)))) + ' */'),
                i = r.sources.map(function (e) {return '/*# sourceURL=' + r.sourceRoot + e + ' */';});
              return [n].concat(i).concat([o]).join('\n');
            }
            var a;
            return [n].join('\n');
          }(t, e);
          return t[2] ? '@media ' + t[2] + '{' + n + '}' : n;
        }).join('');
      }, t.i = function (e, n) {
        'string' == typeof e && (e = [[null, e, '']]);
        for (var r = {}, o = 0; o < this.length; o++) {
          var i = this[o][0];
          'number' == typeof i && (r[i] = !0);
        }
        for (o = 0; o < e.length; o++) {
          var a = e[o];
          'number' == typeof a[0] && r[a[0]] || (n && !a[2] ? a[2] = n : n && (a[2] = '(' + a[2] + ') and (' + n + ')'), t.push(a));
        }
      }, t;
    };
  }, function (e, t, n) {
    var r, o, i = {}, a = (r = function () {return window && document && document.all && !window.atob;}, function () {return void 0 === o && (o = r.apply(this, arguments)), o;}),
      s = function (e) {
        var t = {};
        return function (e) {
          if ('function' == typeof e) return e();
          if (void 0 === t[e]) {
            var n = function (e) {return document.querySelector(e);}.call(this, e);
            if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {n = n.contentDocument.head;} catch (e) {n = null;}
            t[e] = n;
          }
          return t[e];
        };
      }(), c = null, u = 0, f = [], l = n(5);

    function p (e, t) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n], o = i[r.id];
        if (o) {
          o.refs++;
          for (var a = 0; a < o.parts.length; a++) o.parts[a](r.parts[a]);
          for (; a < r.parts.length; a++) o.parts.push(m(r.parts[a], t));
        } else {
          var s = [];
          for (a = 0; a < r.parts.length; a++) s.push(m(r.parts[a], t));
          i[r.id] = { id: r.id, refs: 1, parts: s };
        }
      }
    }

    function d (e, t) {
      for (var n = [], r = {}, o = 0; o < e.length; o++) {
        var i = e[o], a = t.base ? i[0] + t.base : i[0], s = { css: i[1], media: i[2], sourceMap: i[3] };
        r[a] ? r[a].parts.push(s) : n.push(r[a] = { id: a, parts: [s] });
      }
      return n;
    }

    function h (e, t) {
      var n = s(e.insertInto);
      if (!n) throw new Error('Couldn\'t find a style target. This probably means that the value for the \'insertInto\' parameter is invalid.');
      var r = f[f.length - 1];
      if ('top' === e.insertAt) r ? r.nextSibling ? n.insertBefore(t, r.nextSibling) : n.appendChild(t) : n.insertBefore(t, n.firstChild), f.push(t); else if ('bottom' === e.insertAt) n.appendChild(t); else {
        if ('object' != typeof e.insertAt || !e.insertAt.before) throw new Error('[Style Loader]\n\n Invalid value for parameter \'insertAt\' (\'options.insertAt\') found.\n Must be \'top\', \'bottom\', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n');
        var o = s(e.insertInto + ' ' + e.insertAt.before);
        n.insertBefore(t, o);
      }
    }

    function v (e) {
      if (null === e.parentNode) return !1;
      e.parentNode.removeChild(e);
      var t = f.indexOf(e);
      t >= 0 && f.splice(t, 1);
    }

    function y (e) {
      var t = document.createElement('style');
      return void 0 === e.attrs.type && (e.attrs.type = 'text/css'), b(t, e.attrs), h(e, t), t;
    }

    function b (e, t) {Object.keys(t).forEach(function (n) {e.setAttribute(n, t[n]);});}

    function m (e, t) {
      var n, r, o, i;
      if (t.transform && e.css) {
        if (!(i = t.transform(e.css))) return function () {};
        e.css = i;
      }
      if (t.singleton) {
        var a = u++;
        n = c || (c = y(t)), r = w.bind(null, n, a, !1), o = w.bind(null, n, a, !0);
      } else e.sourceMap && 'function' == typeof URL && 'function' == typeof URL.createObjectURL && 'function' == typeof URL.revokeObjectURL && 'function' == typeof Blob && 'function' == typeof btoa ? (n = function (e) {
        var t = document.createElement('link');
        return void 0 === e.attrs.type && (e.attrs.type = 'text/css'), e.attrs.rel = 'stylesheet', b(t, e.attrs), h(e, t), t;
      }(t), r = function (e, t, n) {
        var r = n.css, o = n.sourceMap, i = void 0 === t.convertToAbsoluteUrls && o;
        (t.convertToAbsoluteUrls || i) && (r = l(r));
        o && (r += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))) + ' */');
        var a = new Blob([r], { type: 'text/css' }), s = e.href;
        e.href = URL.createObjectURL(a), s && URL.revokeObjectURL(s);
      }.bind(null, n, t), o = function () {v(n), n.href && URL.revokeObjectURL(n.href);}) : (n = y(t), r = function (e, t) {
        var n = t.css, r = t.media;
        r && e.setAttribute('media', r);
        if (e.styleSheet) e.styleSheet.cssText = n; else {
          for (; e.firstChild;) e.removeChild(e.firstChild);
          e.appendChild(document.createTextNode(n));
        }
      }.bind(null, n), o = function () {v(n);});
      return r(e), function (t) {
        if (t) {
          if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap) return;
          r(e = t);
        } else o();
      };
    }

    e.exports = function (e, t) {
      if ('undefined' != typeof DEBUG && DEBUG && 'object' != typeof document) throw new Error('The style-loader cannot be used in a non-browser environment');
      (t = t || {}).attrs = 'object' == typeof t.attrs ? t.attrs : {}, t.singleton || 'boolean' == typeof t.singleton || (t.singleton = a()), t.insertInto || (t.insertInto = 'head'), t.insertAt || (t.insertAt = 'bottom');
      var n = d(e, t);
      return p(n, t), function (e) {
        for (var r = [], o = 0; o < n.length; o++) {
          var a = n[o];
          (s = i[a.id]).refs--, r.push(s);
        }
        e && p(d(e, t), t);
        for (o = 0; o < r.length; o++) {
          var s;
          if (0 === (s = r[o]).refs) {
            for (var c = 0; c < s.parts.length; c++) s.parts[c]();
            delete i[s.id];
          }
        }
      };
    };
    var g, x = (g = [], function (e, t) {return g[e] = t, g.filter(Boolean).join('\n');});

    function w (e, t, n, r) {
      var o = n ? '' : r.css;
      if (e.styleSheet) e.styleSheet.cssText = x(t, o); else {
        var i = document.createTextNode(o), a = e.childNodes;
        a[t] && e.removeChild(a[t]), a.length ? e.insertBefore(i, a[t]) : e.appendChild(i);
      }
    }
  }, function (e, t) {
    e.exports = function (e) {
      var t = 'undefined' != typeof window && window.location;
      if (!t) throw new Error('fixUrls requires window.location');
      if (!e || 'string' != typeof e) return e;
      var n = t.protocol + '//' + t.host, r = n + t.pathname.replace(/\/[^\/]*$/, '/');
      return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (e, t) {
        var o, i = t.trim().replace(/^"(.*)"$/, function (e, t) {return t;}).replace(/^'(.*)'$/, function (e, t) {return t;});
        return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i) ? e : (o = 0 === i.indexOf('//') ? i : 0 === i.indexOf('/') ? n + i : r + i.replace(/^\.\//, ''), 'url(' + JSON.stringify(o) + ')');
      });
    };
  }, function (e, t, n) {
    'use strict';
    n.r(t), t.default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 -0.3 9 11.4" width="12" height="14">\n  <path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"/>\n</svg>\n';
  }]);
});
