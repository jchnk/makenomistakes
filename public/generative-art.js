// Generative art for Make No Mistakes — Warsaw concepts
// Silhouette source: syrenka-silhouette.png — traced 1:1 from a photo of the
// Powiśle monument (Ludwika Nitschowa, 1939). Landmarks measured on the mask.
// <mnm-syrenka>          — silhouette as displaced scanlines, drawn live
// <mnm-syrenka-contour>  — silhouette as nested iso-distance contours (red/brass)
// <mnm-garden>           — recursive botanical/mycelium growth, etching style

(function () {
  "use strict";

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function setupCanvas(host) {
    host.style.display = "block";
    if (!host.style.height) host.style.height = "100%";
    if (!host.style.width) host.style.width = "100%";
    if (host.parentElement && !host.clientHeight) host.style.height = "560px";
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = host.clientWidth || 588;
    const h = host.clientHeight || 620;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { canvas, ctx, w, h };
  }

  function watchVisible(host) {
    host._vis = true;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { for (const e of es) host._vis = e.isIntersecting; });
      io.observe(host);
    }
  }

  // shared animation loop: one synchronous first frame, then setTimeout(33)
  // (setTimeout keeps firing in hidden/occluded iframes where rAF never does,
  // so captures/exports still get painted frames); _vis gating, try/catch,
  // slow-frame kill-switch
  function runLoop(host, draw) {
    let slow = 0;
    try { draw(performance.now()); } catch (e) { return; }
    const tick = () => {
      if (host._vis !== false) {
        const t1 = performance.now();
        try { draw(t1); } catch (e) { return; }
        if (performance.now() - t1 > 90) { if (++slow > 6) return; } else slow = 0;
      }
      host._t = setTimeout(tick, host._vis === false ? 250 : 33);
    };
    host._t = setTimeout(tick, 33);
  }

  /* ---------------- REAL SILHOUETTE MASK ---------------- */

  const MASK_SRC = (window.__resources && window.__resources.syrenkaMask) || "./syrenka-silhouette.png";
  let _maskP = null;
  function loadMask() {
    if (!_maskP) {
      _maskP = new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => rej(new Error("syrenka mask failed to load"));
        im.src = MASK_SRC;
      });
    }
    return _maskP;
  }

  const PHOTO_SRC = (window.__resources && window.__resources.syrenkaPhoto) || "./syrenka-photo.png";
  let _photoP = null;
  function loadPhoto() {
    if (!_photoP) {
      _photoP = new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => rej(new Error("syrenka photo failed to load"));
        im.src = PHOTO_SRC;
      });
    }
    return _photoP;
  }

  // Landmarks in mask space (182 x 283), measured from the photo
  const LM = {
    shield: { x: 74, y: 130, r: 44 },
    swordHand: { x: 106, y: 42 },
    swordTip: { x: 12, y: 26 },
    anchors: [
      { x: 108, y: 40, label: "hand" },
      { x: 26, y: 208, label: "hip" },
      { x: 137, y: 196, label: "fin" },
    ],
  };

  // contain-fit the mask into a w×h canvas; returns pixel test + coord mapper
  // zoom > 1 scales up (cropping); yAlign 0..1 positions the crop vertically (0.5 = center)
  function fitMask(maskImg, w, h, zoom, yAlign) {
    const DW = maskImg.width, DH = maskImg.height;
    const s = Math.min(w / DW, h / DH) * (zoom || 1);
    const ox = (w - DW * s) / 2, oy = (h - DH * s) * (yAlign == null ? 0.5 : yAlign);
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const o = off.getContext("2d");
    o.drawImage(maskImg, ox, oy, DW * s, DH * s);
    const data = o.getImageData(0, 0, w, h).data;
    const inside = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return false;
      return data[(((y | 0) * w + (x | 0))) * 4 + 3] > 40;
    };
    // landmarks are measured in the 182x283 reference space; normalize
    const kx = DW / 182, ky = DH / 283;
    const map = (p) => ({ x: ox + p.x * kx * s, y: oy + p.y * ky * s });
    return { inside, map, s, ls: s * kx };
  }

  const PALETTES = {
    dark: {
      out: "rgba(157,184,214,0.10)", inn: "rgba(69,207,163,0.95)",
      hatch: "rgba(204,30,143,0.5)", hud: "#f0bc12", dot: "#f0bc12", caption: "#f0bc12",
    },
    cream: {
      out: "rgba(125,20,36,0.10)", inn: "rgba(125,20,36,0.92)",
      hatch: "rgba(176,141,63,0.6)", hud: "#b08d3f", dot: "#7d1424", caption: "#a3672f",
    },
    ink: {
      out: "rgba(26,20,16,0.09)", inn: "rgba(26,20,16,0.9)",
      hatch: "rgba(214,80,30,0.55)", hud: "#d6501e", dot: "#1a1410", caption: "#8a7a5c",
    },
  };

  /* ---------------- SYRENKA — SCANLINES ---------------- */

  class MnmSyrenka extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      setTimeout(() => this._init(), 0);
    }
    disconnectedCallback() { clearTimeout(this._t); cancelAnimationFrame(this._raf); }

    async _init() {
      const { ctx, w, h } = setupCanvas(this);
      watchVisible(this);
      const pal = PALETTES[this.getAttribute("palette")] || PALETTES.dark;
      let m;
      try { m = fitMask(await loadMask(), w, h); } catch (e) { return; }
      const { inside, map } = m;

      const GAP = 3.5, STEP = 2, TAIL = 12, DIAG = 9;
      const nLines = Math.ceil(h / GAP);
      const nDiag = Math.ceil((w + h) / DIAG);
      const sc = map(LM.shield);
      const shieldC = { x: sc.x, y: sc.y, r: LM.shield.r * m.ls };
      const hand = map(LM.swordHand), tip = map(LM.swordTip);
      const sword = { x1: hand.x, y1: hand.y, x2: tip.x, y2: tip.y };
      const anchors = LM.anchors.map(a => Object.assign({ label: a.label }, map(a)));
      const REVEAL = 6400, HOLD = 3200, CYCLE = REVEAL + HOLD;
      // start mid-HOLD so the very first frame is the completed figure
      const t0 = performance.now() - REVEAL;
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      let vecCount = 0;

      const draw = (now) => {
        const t = (now - t0) % CYCLE;
        const prog = Math.min(1, t / REVEAL);
        const breathe = now / 1100;
        ctx.clearRect(0, 0, w, h);
        vecCount = 0;

        // phase 1 — horizontal scanlines, cascading left-to-right sweep
        const p1 = Math.min(1, prog / 0.62);
        for (let li = 0; li < nLines; li++) {
          const lp = clamp((p1 * (nLines + TAIL) - li) / TAIL, 0, 1);
          if (lp <= 0) break;
          const xMax = w * easeOut(lp);
          const y = li * GAP + GAP / 2;
          drawScan(y, xMax, breathe);
          if (lp < 1) { ctx.fillStyle = pal.dot; ctx.fillRect(xMax - 1.5, y - 1.5, 3, 3); }
        }

        // phase 2 — diagonal hatch, second vector layer inside the figure
        const p2 = clamp((prog - 0.5) / 0.42, 0, 1);
        if (p2 > 0) {
          const shownD = Math.floor(nDiag * easeInOut(p2));
          ctx.strokeStyle = pal.hatch;
          ctx.lineWidth = 0.7;
          for (let di = 0; di < shownD; di++) {
            const c = di * DIAG - h;
            let run = null;
            for (let tt = 0; tt <= h; tt += 4) {
              const x = c + tt, y = tt;
              const isIn = x >= 0 && x <= w && inside(x, y);
              if (isIn) { if (!run) run = [x, y]; }
              else if (run) { seg(run[0], run[1], x, y); run = null; }
            }
            if (run) seg(run[0], run[1], c + h, h);
          }
        }

        // phase 3 — HUD: shield reticle, sword vector, anchor markers
        const ov = clamp((prog - 0.72) / 0.24, 0, 1);
        if (ov > 0) {
          ctx.save();
          ctx.globalAlpha = ov;
          ctx.strokeStyle = pal.hud; ctx.fillStyle = pal.hud; ctx.lineWidth = 1.6;
          // shield reticle
          ctx.beginPath(); ctx.arc(shieldC.x, shieldC.y, shieldC.r + 12, 0, 7); ctx.stroke();
          for (let a = 0; a < 8; a++) {
            const ang = a * Math.PI / 4 + now / 5000;
            ctx.beginPath();
            ctx.moveTo(shieldC.x + Math.cos(ang) * (shieldC.r + 6), shieldC.y + Math.sin(ang) * (shieldC.r + 6));
            ctx.lineTo(shieldC.x + Math.cos(ang) * (shieldC.r + 18), shieldC.y + Math.sin(ang) * (shieldC.r + 18));
            ctx.stroke();
          }
          const pulse = 0.5 + 0.5 * Math.sin(now / 300);
          ctx.globalAlpha = ov * (0.5 + 0.5 * pulse);
          ctx.beginPath(); ctx.arc(shieldC.x, shieldC.y, 4.5, 0, 7); ctx.fill();
          ctx.globalAlpha = ov;
          // sword vector with arrowhead at the tip
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(sword.x1, sword.y1); ctx.lineTo(sword.x2, sword.y2); ctx.stroke();
          const va = Math.atan2(sword.y2 - sword.y1, sword.x2 - sword.x1);
          ctx.beginPath();
          ctx.moveTo(sword.x2, sword.y2);
          ctx.lineTo(sword.x2 - Math.cos(va - 0.42) * 12, sword.y2 - Math.sin(va - 0.42) * 12);
          ctx.moveTo(sword.x2, sword.y2);
          ctx.lineTo(sword.x2 - Math.cos(va + 0.42) * 12, sword.y2 - Math.sin(va + 0.42) * 12);
          ctx.stroke();
          // anchors: crosses + coords
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.lineWidth = 1;
          for (const a of anchors) {
            ctx.beginPath();
            ctx.moveTo(a.x - 6, a.y); ctx.lineTo(a.x + 6, a.y);
            ctx.moveTo(a.x, a.y - 6); ctx.lineTo(a.x, a.y + 6);
            ctx.stroke();
            ctx.fillText(a.label + " [" + Math.round(a.x) + "," + Math.round(a.y) + "]", a.x + 10, a.y - 6);
          }
          ctx.restore();
        }

        // caption
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillStyle = pal.caption;
        ctx.fillText(prog < 1 ? "generating… " + Math.round(prog * 100) + "%" : "vectors: " + vecCount + " · Powiśle monument 1:1", 8, h - 10);

        function seg(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); vecCount++; }
      };

      const drawScan = (y, xMax, breathe) => {
        let run = [], runInside = false;
        const flush = () => {
          if (run.length < 2) { run = []; return; }
          ctx.beginPath();
          ctx.moveTo(run[0][0], run[0][1]);
          for (let i = 1; i < run.length; i++) ctx.lineTo(run[i][0], run[i][1]);
          ctx.strokeStyle = runInside ? pal.inn : pal.out;
          ctx.lineWidth = runInside ? 1.3 : 0.6;
          ctx.stroke(); vecCount++;
          run = [];
        };
        for (let x = 0; x <= xMax; x += STEP) {
          const isIn = inside(x, y);
          if (isIn !== runInside && run.length) { run.push([x, yD(x, y, isIn, breathe)]); flush(); }
          runInside = isIn;
          run.push([x, yD(x, y, isIn, breathe)]);
        }
        flush();
      };

      function yD(x, y, isIn, b) {
        if (!isIn) return y + Math.sin(x * 0.02 + y * 0.5) * 0.5;
        const wob = Math.sin(x * 0.05 + y * 0.12 + b) * 2.2 + Math.sin(x * 0.013 + y * 0.05 - b * 0.7) * 1.8;
        return y - 1.6 + wob * 0.8;
      }
      function easeInOut(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
      function easeOut(p) { return 1 - Math.pow(1 - p, 3); }

      runLoop(this, draw);
    }
  }

  /* ---------------- SYRENKA — ISO-CONTOURS (red/brass) ---------------- */

  class MnmSyrenkaContour extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      setTimeout(() => this._init(), 0);
    }
    disconnectedCallback() { clearTimeout(this._t); cancelAnimationFrame(this._raf); }

    async _init() {
      const { ctx, w, h } = setupCanvas(this);
      watchVisible(this);
      let m;
      try { m = fitMask(await loadMask(), w, h); } catch (e) { return; }

      // distance-into-shape field on a coarse grid (chamfer transform)
      const gs = 3;
      const gw = Math.floor(w / gs) + 1, gh = Math.floor(h / gs) + 1;
      const INF = 1e6;
      const f = new Float32Array(gw * gh);
      for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++)
        f[j * gw + i] = m.inside(i * gs, j * gs) ? INF : 0;
      for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
        const k = j * gw + i; if (!f[k]) continue;
        let v = f[k];
        if (i > 0) v = Math.min(v, f[k - 1] + 1);
        if (j > 0) {
          v = Math.min(v, f[k - gw] + 1);
          if (i > 0) v = Math.min(v, f[k - gw - 1] + 1.4);
          if (i < gw - 1) v = Math.min(v, f[k - gw + 1] + 1.4);
        }
        f[k] = v;
      }
      for (let j = gh - 1; j >= 0; j--) for (let i = gw - 1; i >= 0; i--) {
        const k = j * gw + i; if (!f[k]) continue;
        let v = f[k];
        if (i < gw - 1) v = Math.min(v, f[k + 1] + 1);
        if (j < gh - 1) {
          v = Math.min(v, f[k + gw] + 1);
          if (i < gw - 1) v = Math.min(v, f[k + gw + 1] + 1.4);
          if (i > 0) v = Math.min(v, f[k + gw - 1] + 1.4);
        }
        f[k] = v;
      }
      for (let k = 0; k < f.length; k++) f[k] = Math.min(f[k], 1e5) * gs;

      const RED = a => "rgba(125,20,36," + a + ")";
      const BRASS = a => "rgba(176,141,63," + a + ")";
      // outermost level (wob 0) IS the exact silhouette of the monument
      const LEVELS = [
        { d: 1.4, col: RED(0.85), lw: 1.7, wob: 0 },
        { d: 10, col: RED(0.6), lw: 1.1, wob: 1.6 },
        { d: 20, col: RED(0.42), lw: 1, wob: 2.2 },
        { d: 31, col: BRASS(0.75), lw: 1, wob: 2.6 },
        { d: 43, col: BRASS(0.55), lw: 1, wob: 3 },
        { d: 56, col: BRASS(0.38), lw: 1, wob: 3.4 },
      ];
      const sc = m.map(LM.shield);
      const shieldR = LM.shield.r * m.ls;
      const hand = m.map(LM.swordHand), tip = m.map(LM.swordTip);
      const anchors = LM.anchors.map(a => Object.assign({ label: a.label }, m.map(a)));

      const t0 = performance.now() - 5600;
      const REVEAL = 5600, HOLD = 3800, CYCLE = REVEAL + HOLD;
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const easeOut = p => 1 - Math.pow(1 - p, 3);
      const frac = (a, b, l) => (b === a) ? 0.5 : clamp((l - a) / (b - a), 0, 1);
      let vecCount = 0;

      const draw = (now) => {
        const t = (now - t0) % CYCLE;
        const prog = Math.min(1, t / REVEAL);
        const ph = now / 950;
        ctx.clearRect(0, 0, w, h);
        vecCount = 0;

        for (let li = 0; li < LEVELS.length; li++) {
          const L = LEVELS[li];
          const lp = clamp((prog - li * 0.08) / 0.45, 0, 1);
          if (lp <= 0) continue;
          const yMax = h * easeOut(Math.min(1, lp * 1.12));
          ctx.strokeStyle = L.col;
          ctx.lineWidth = L.lw;
          ctx.globalAlpha = Math.min(1, lp * 2.5);
          ctx.beginPath();
          const margin = L.wob + 3.5;
          for (let j = 0; j < gh - 1; j++) {
            const y = j * gs;
            if (y > yMax) break;
            for (let i = 0; i < gw - 1; i++) {
              const k = j * gw + i;
              const a = f[k], b = f[k + 1], c = f[k + gw + 1], d = f[k + gw];
              const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);
              if (lo > L.d + margin || hi < L.d - margin) continue;
              const lvl = L.d + (L.wob ? L.wob * Math.sin(i * 0.33 + j * 0.24 + ph + li * 1.7) : 0);
              let idx = 0;
              if (a > lvl) idx |= 1;
              if (b > lvl) idx |= 2;
              if (c > lvl) idx |= 4;
              if (d > lvl) idx |= 8;
              if (idx === 0 || idx === 15) continue;
              const x = i * gs;
              const T = [x + gs * frac(a, b, lvl), y];
              const R = [x + gs, y + gs * frac(b, c, lvl)];
              const B = [x + gs * frac(d, c, lvl), y + gs];
              const Lf = [x, y + gs * frac(a, d, lvl)];
              switch (idx) {
                case 1: case 14: sg(Lf, T); break;
                case 2: case 13: sg(T, R); break;
                case 3: case 12: sg(Lf, R); break;
                case 4: case 11: sg(R, B); break;
                case 6: case 9: sg(T, B); break;
                case 7: case 8: sg(Lf, B); break;
                case 5: sg(Lf, T); sg(R, B); break;
                case 10: sg(T, R); sg(Lf, B); break;
              }
            }
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // HUD — tarcza jako interfejs, wektor miecza, znaczniki
        const ov = clamp((prog - 0.68) / 0.28, 0, 1);
        if (ov > 0) {
          ctx.save();
          ctx.globalAlpha = ov;
          ctx.strokeStyle = "#b08d3f"; ctx.fillStyle = "#b08d3f"; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(sc.x, sc.y, shieldR + 12, 0, 7); ctx.stroke();
          for (let a = 0; a < 8; a++) {
            const ang = a * Math.PI / 4 + now / 5000;
            ctx.beginPath();
            ctx.moveTo(sc.x + Math.cos(ang) * (shieldR + 6), sc.y + Math.sin(ang) * (shieldR + 6));
            ctx.lineTo(sc.x + Math.cos(ang) * (shieldR + 18), sc.y + Math.sin(ang) * (shieldR + 18));
            ctx.stroke();
          }
          const pulse = 0.5 + 0.5 * Math.sin(now / 300);
          ctx.globalAlpha = ov * (0.5 + 0.5 * pulse);
          ctx.fillStyle = "#7d1424";
          ctx.beginPath(); ctx.arc(sc.x, sc.y, 4.5, 0, 7); ctx.fill();
          ctx.globalAlpha = ov;
          // sword vector
          ctx.strokeStyle = "#7d1424"; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(hand.x, hand.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
          const va = Math.atan2(tip.y - hand.y, tip.x - hand.x);
          ctx.beginPath();
          ctx.moveTo(tip.x, tip.y);
          ctx.lineTo(tip.x - Math.cos(va - 0.42) * 12, tip.y - Math.sin(va - 0.42) * 12);
          ctx.moveTo(tip.x, tip.y);
          ctx.lineTo(tip.x - Math.cos(va + 0.42) * 12, tip.y - Math.sin(va + 0.42) * 12);
          ctx.stroke();
          // anchors
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.fillStyle = "#7d1424"; ctx.lineWidth = 1;
          for (const a of anchors) {
            ctx.beginPath();
            ctx.moveTo(a.x - 6, a.y); ctx.lineTo(a.x + 6, a.y);
            ctx.moveTo(a.x, a.y - 6); ctx.lineTo(a.x, a.y + 6);
            ctx.stroke();
            ctx.fillText(a.label + " [" + Math.round(a.x) + "," + Math.round(a.y) + "]", a.x + 10, a.y - 6);
          }
          ctx.restore();
        }

        // caption
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#a3672f";
        ctx.fillText(prog < 1 ? "tracing contour… " + Math.round(prog * 100) + "%" : "vectors: " + vecCount + " · Powiśle monument 1:1", 8, h - 10);

        function sg(p, q) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); vecCount++; }
      };

      runLoop(this, draw);
    }
  }

  // Lens palettes: paper = hero bg (r,g,b), base = sketch scanlines, detail = engraving
  const LENS_PALETTES = {
    cream: { paper: "243,234,216", base: "rgba(125,20,36,0.5)", detail: "#4d0e1c", chrome: "#b08d3f", label: "#7d1424", caption: "#a3672f" },
    night: { paper: "16,29,41", base: "rgba(157,184,214,0.3)", detail: "#45cfa3", chrome: "#f0bc12", label: "#45cfa3", caption: "#6d8296" },
    bordo: { paper: "125,20,36", base: "rgba(243,234,216,0.45)", detail: "#f3ead8", chrome: "#b08d3f", label: "#f3ead8", caption: "rgba(243,234,216,0.65)" },
    cobalt: { paper: "43,75,223", base: "rgba(238,241,251,0.5)", detail: "#eef1fb", chrome: "#9db4ff", label: "#eef1fb", caption: "#9db4ff" },
    sky: { paper: "46,127,217", base: "rgba(237,243,251,0.5)", detail: "#edf3fb", chrome: "#a8cef5", label: "#edf3fb", caption: "#a8cef5" },
    forest: { paper: "14,32,24", base: "rgba(217,179,87,0.4)", detail: "#d9b357", chrome: "#e9dcc0", label: "#d9b357", caption: "#7a8f7f" },
    graphite: { paper: "236,227,209", base: "rgba(42,42,40,0.4)", detail: "#26241f", chrome: "#d6501e", label: "#26241f", caption: "#8a8578" },
  };

  /* ---------------- SYRENKA — ROAMING DETAIL LENS ---------------- */

  class MnmSyrenkaLens extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      setTimeout(() => this._init(), 0);
    }
    disconnectedCallback() {
      clearTimeout(this._t); clearTimeout(this._reinitT); cancelAnimationFrame(this._raf);
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
    }

    async _init() {
      const { canvas, ctx, w, h } = setupCanvas(this);
      // re-init when the flex layout resizes the host (initial measure can be stale)
      this._w = w; this._h = h;
      if (!this._ro && "ResizeObserver" in window) {
        this._ro = new ResizeObserver(() => {
          const cw = this.clientWidth, ch = this.clientHeight;
          if (!cw || !ch || (Math.abs(cw - this._w) <= 8 && Math.abs(ch - this._h) <= 8)) return;
          clearTimeout(this._reinitT);
          this._reinitT = setTimeout(() => {
            clearTimeout(this._t);
            while (this.firstChild) this.removeChild(this.firstChild);
            this._init();
          }, 150);
        });
        this._ro.observe(this);
      }
      const LP = LENS_PALETTES[this.getAttribute("palette")] || LENS_PALETTES.cream;
      watchVisible(this);
      let maskImg, photoImg;
      try {
        maskImg = await loadMask();
        photoImg = await loadPhoto();
      } catch (e) { return; }
      const m = fitMask(maskImg, w, h, parseFloat(this.getAttribute("zoom")) || 1, this.hasAttribute("y-align") ? parseFloat(this.getAttribute("y-align")) : 0.5);
      const dpr = canvas.width / w;
      const o0 = m.map({ x: 0, y: 0 });
      const DW = maskImg.width, DH = maskImg.height;

      // fitted photo luminance (grayscale, contrast-stretched, baked into the png)
      const po = document.createElement("canvas");
      po.width = w; po.height = h;
      const pctx = po.getContext("2d");
      pctx.imageSmoothingEnabled = true;
      pctx.drawImage(photoImg, o0.x, o0.y, DW * m.s, DH * m.s);
      const pd = pctx.getImageData(0, 0, w, h).data;
      const lumAt = (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return 1;
        const k = (((y | 0) * w + (x | 0))) * 4;
        if (pd[k + 3] < 40) return 1;
        return pd[k] / 255;
      };

      // base layer: coarse scanlines of the exact silhouette, pre-rendered once
      const base = document.createElement("canvas");
      base.width = w * dpr; base.height = h * dpr;
      const b = base.getContext("2d");
      b.scale(dpr, dpr);
      b.strokeStyle = LP.base;
      b.lineWidth = 1.1;
      for (let y = 2; y < h; y += 5) {
        let run = null;
        for (let x = 0; x <= w + 2; x += 2) {
          const isIn = x <= w && m.inside(x, y);
          if (isIn && run === null) run = x;
          else if (!isIn && run !== null) {
            b.beginPath(); b.moveTo(run, y); b.lineTo(x - 2, y); b.stroke();
            run = null;
          }
        }
      }

      // full engraving of the bronze, pre-rendered ONCE from the photo
      const detail = document.createElement("canvas");
      detail.width = w * dpr; detail.height = h * dpr;
      const dctx = detail.getContext("2d");
      dctx.scale(dpr, dpr);
      dctx.fillStyle = LP.detail;
      for (let y = 1; y < h; y += 2.1) {
        for (let x = 0; x < w; x += 2) {
          const lum = lumAt(x, y);
          if (lum > 0.96) continue;
          const v = 1 - lum;
          dctx.globalAlpha = Math.min(1, 0.25 + v * 0.9);
          const hgt = Math.max(0.35, v * 2.5);
          dctx.fillRect(x, y - hgt / 2, 2, hgt);
        }
      }
      dctx.globalAlpha = 1;

      // waypoints the lens visits on its own (mask space): head, hand, blade, shield, fin, waves
      const WPS = [
        { x: 61, y: 62 },
        { x: 106, y: 40 },
        { x: 20, y: 40 },
        { x: 74, y: 130 },
        { x: 137, y: 196 },
        { x: 80, y: 250 },
      ].map(p => m.map(p));
      const R = Math.max(56, Math.min(w, h) * 0.17);
      const pos = { x: WPS[0].x, y: WPS[0].y };
      let wi = 1, dwellUntil = 0;
      let mouse = null, mouseAt = -1e9;

      this.addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        mouse = { x: (e.clientX - r.left) * (w / r.width), y: (e.clientY - r.top) * (h / r.height) };
        mouseAt = performance.now();
      });

      let last = 0;
      const draw = (now) => {
        const dt = Math.min(80, last ? now - last : 16); last = now;
        const manual = mouse && (now - mouseAt < 2600);
        let target;
        if (manual) target = mouse;
        else {
          target = WPS[wi];
          const d = Math.hypot(target.x - pos.x, target.y - pos.y);
          if (d < 6) {
            if (!dwellUntil) dwellUntil = now + 1100;
            else if (now > dwellUntil) { wi = (wi + 1) % WPS.length; dwellUntil = 0; }
          }
        }
        const k = 1 - Math.pow(1 - (manual ? 0.16 : 0.05), dt / 16.7);
        pos.x += (target.x - pos.x) * k;
        pos.y += (target.y - pos.y) * k;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(base, 0, 0, w, h);

        // under the lens: the real bronze engraving (pre-rendered), rim fading to paper
        ctx.save();
        ctx.beginPath(); ctx.arc(pos.x, pos.y, R, 0, 7); ctx.clip();
        ctx.fillStyle = "rgb(" + LP.paper + ")";
        ctx.fillRect(pos.x - R, pos.y - R, R * 2, R * 2);
        ctx.drawImage(detail, 0, 0, w, h);
        const g = ctx.createRadialGradient(pos.x, pos.y, R * 0.68, pos.x, pos.y, R);
        g.addColorStop(0, "rgba(" + LP.paper + ",0)");
        g.addColorStop(1, "rgba(" + LP.paper + ",0.85)");
        ctx.fillStyle = g;
        ctx.fillRect(pos.x - R, pos.y - R, R * 2, R * 2);
        ctx.restore();

        // lens chrome
        ctx.strokeStyle = LP.chrome; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, R, 0, 7); ctx.stroke();
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath(); ctx.arc(pos.x, pos.y, R + 7, 0, 7); ctx.stroke();
        ctx.setLineDash([]);
        for (let a = 0; a < 4; a++) {
          const ang = a * Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(pos.x + Math.cos(ang) * (R - 9), pos.y + Math.sin(ang) * (R - 9));
          ctx.lineTo(pos.x + Math.cos(ang) * (R - 2), pos.y + Math.sin(ang) * (R - 2));
          ctx.stroke();
        }
        if (w >= 420 && h >= 300) {
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.fillStyle = LP.label;
          ctx.fillText("detail / bronze 1939 [" + Math.round(pos.x) + "," + Math.round(pos.y) + "]", pos.x + R * 0.74, pos.y - R * 0.74);
        }

        // caption (skip on miniature renders)
        if (w >= 420 && h >= 300) {
          ctx.font = "12px 'JetBrains Mono', monospace";
          ctx.fillStyle = LP.caption;
          ctx.fillText(manual ? "cursor: you" : "cursor: auto \u2014 move the mouse to take over", 8, h - 10);
        }
      };

      runLoop(this, draw);
    }
  }

  /* ---------------- LATENT GARDEN ---------------- */

  class MnmGarden extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      setTimeout(() => this._init(), 0);
    }
    disconnectedCallback() { clearTimeout(this._t); cancelAnimationFrame(this._raf); }

    _init() {
      const { ctx, w, h } = setupCanvas(this);
      watchVisible(this);
      const soil = h * 0.72;
      const MOSS = "74,93,58", SEPIA = "138,122,92", TERRA = "#b65a38";
      let rng, tips, done, doneAt;

      const reset = () => {
        rng = mulberry32(2026);
        tips = [];
        done = false; doneAt = 0;
        ctx.clearRect(0, 0, w, h);
        // soil line, dashed
        ctx.save();
        ctx.strokeStyle = "rgba(" + MOSS + ",0.5)";
        ctx.setLineDash([2, 5]);
        ctx.beginPath(); ctx.moveTo(24, soil); ctx.lineTo(w - 24, soil); ctx.stroke();
        ctx.restore();
        // trunk + main root
        tips.push(mkTip(w * 0.5, soil, -Math.PI / 2, 96, 0, false));
        tips.push(mkTip(w * 0.5, soil, Math.PI / 2, 60, 0, true));
        tips.push(mkTip(w * 0.5, soil, Math.PI / 2 + 0.55, 46, 1, true));
        tips.push(mkTip(w * 0.5, soil, Math.PI / 2 - 0.55, 46, 1, true));
      };

      function mkTip(x, y, ang, len, depth, root) {
        return { x, y, ang, left: len, len, depth, root, curve: (rng() - 0.5) * 0.02, phase: rng() * 6.28, hatch: 0 };
      }

      const MAXD = 7, ROOTD = 4;

      const step = (tip) => {
        const spd = 1.35;
        tip.ang += tip.curve + Math.sin(tip.phase + tip.left * 0.09) * 0.012;
        const nx = tip.x + Math.cos(tip.ang) * spd;
        const ny = tip.y + Math.sin(tip.ang) * spd;
        const width = Math.max(0.5, (tip.root ? 2.4 : 3.6) - tip.depth * 0.48);
        const alpha = tip.root ? 0.5 : 0.75 - tip.depth * 0.04;
        ctx.strokeStyle = "rgba(" + (tip.root ? SEPIA : MOSS) + "," + alpha + ")";
        ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(nx, ny); ctx.stroke();
        // etching hatch ticks
        tip.hatch += spd;
        if (tip.hatch > 6 && !tip.root && tip.depth < 6) {
          tip.hatch = 0;
          const pa = tip.ang + Math.PI / 2;
          const hl = 2.6 - tip.depth * 0.25;
          ctx.strokeStyle = "rgba(" + MOSS + ",0.28)";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(nx - Math.cos(pa) * hl, ny - Math.sin(pa) * hl);
          ctx.lineTo(nx + Math.cos(pa) * hl, ny + Math.sin(pa) * hl);
          ctx.stroke();
        }
        tip.x = nx; tip.y = ny; tip.left -= spd;

        if (tip.left <= 0) {
          const maxd = tip.root ? ROOTD : MAXD;
          if (tip.depth >= maxd || tip.y < 30 || tip.y > h - 20 || tip.x < 20 || tip.x > w - 20) {
            // terminal node = neuron
            if (!tip.root) {
              ctx.fillStyle = TERRA;
              ctx.beginPath(); ctx.arc(tip.x, tip.y, 2.6, 0, 7); ctx.fill();
              ctx.strokeStyle = "rgba(182,90,56,0.5)";
              ctx.lineWidth = 0.8;
              ctx.beginPath(); ctx.arc(tip.x, tip.y, 5.2, 0, 7); ctx.stroke();
            } else {
              ctx.fillStyle = "rgba(" + SEPIA + ",0.8)";
              ctx.beginPath(); ctx.arc(tip.x, tip.y, 1.4, 0, 7); ctx.fill();
            }
            return [];
          }
          const spread = tip.root ? 0.5 : 0.34 + rng() * 0.22;
          const nlen = tip.len * (0.68 + rng() * 0.12);
          const kids = [
            mkTip(tip.x, tip.y, tip.ang - spread, nlen, tip.depth + 1, tip.root),
            mkTip(tip.x, tip.y, tip.ang + spread, nlen, tip.depth + 1, tip.root),
          ];
          // occasional third shoot
          if (!tip.root && rng() < 0.22) kids.push(mkTip(tip.x, tip.y, tip.ang + (rng() - 0.5) * 0.2, nlen * 0.8, tip.depth + 1, false));
          // junction dot
          ctx.fillStyle = "rgba(" + (tip.root ? SEPIA : MOSS) + ",0.9)";
          ctx.beginPath(); ctx.arc(tip.x, tip.y, tip.root ? 1.2 : 1.7, 0, 7); ctx.fill();
          return kids;
        }
        return [tip];
      };

      const draw = (now) => {
        if (!done) {
          // advance a few substeps per frame for smooth-but-quick growth
          for (let k = 0; k < 3; k++) {
            let next = [];
            for (const tip of tips) next.push(...step(tip));
            tips = next;
            if (!tips.length) { done = true; doneAt = now; break; }
          }
        } else if (now - doneAt > 3500) {
          reset();
        }
      };

      reset();
      runLoop(this, draw);
    }
  }

  if (!customElements.get("mnm-syrenka")) customElements.define("mnm-syrenka", MnmSyrenka);
  if (!customElements.get("mnm-syrenka-contour")) customElements.define("mnm-syrenka-contour", MnmSyrenkaContour);
  if (!customElements.get("mnm-syrenka-lens")) customElements.define("mnm-syrenka-lens", MnmSyrenkaLens);
  if (!customElements.get("mnm-garden")) customElements.define("mnm-garden", MnmGarden);
})();
