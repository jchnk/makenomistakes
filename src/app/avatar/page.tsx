"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type Palette = "sky" | "paper" | "navy";
type Format = "square" | "linkedin" | "x";

const FMTS: Record<Format, { w: number; h: number; label: string }> = {
  square: { w: 1080, h: 1080, label: "1080×1080" },
  linkedin: { w: 1584, h: 396, label: "1584×396" },
  x: { w: 1500, h: 500, label: "1500×500" },
};

const PALS = {
  sky: { bg: "#2e7fd9", bar: "237,243,251", pos: true, chrome: "#a8cef5", text: "#edf3fb", dim: "#a8cef5" },
  paper: { bg: "#edf3fb", bar: "27,84,158", pos: false, chrome: "#2e7fd9", text: "#0a1b33", dim: "#4a6c96" },
  navy: { bg: "#0a1b33", bar: "168,206,245", pos: true, chrome: "#2e7fd9", text: "#edf3fb", dim: "#6d93c4" },
};

function drawHud(
  x: CanvasRenderingContext2D,
  W: number,
  H: number,
  P: (typeof PALS)[Palette],
  name: string
) {
  const k = Math.max(Math.min(W, H) / 1080, (W / 1584) * 0.8);
  const pad = 50 * k;
  try {
    (x as unknown as Record<string, string>).letterSpacing = (5 * k).toFixed(1) + "px";
  } catch {}

  const txt = (str: string, fx: number, fy: number) => {
    x.shadowColor = P.bg;
    x.shadowBlur = 16;
    x.fillText(str, fx, fy);
    x.fillText(str, fx, fy);
    x.fillText(str, fx, fy);
    x.shadowBlur = 0;
  };

  const cx = W * 0.5,
    cy = H * 0.44,
    r = Math.min(W, H) * 0.315;
  x.strokeStyle = P.chrome;
  x.lineWidth = 2.6 * k;
  x.setLineDash([10 * k, 16 * k]);
  x.beginPath();
  x.arc(cx, cy, r, 0, 7);
  x.stroke();
  x.setLineDash([]);
  for (let a = 0; a < 8; a++) {
    const ang = (a * Math.PI) / 4;
    x.beginPath();
    x.moveTo(cx + Math.cos(ang) * (r + 8 * k), cy + Math.sin(ang) * (r + 8 * k));
    x.lineTo(cx + Math.cos(ang) * (r + 26 * k), cy + Math.sin(ang) * (r + 26 * k));
    x.stroke();
  }
  x.fillStyle = P.chrome;
  x.font = (22 * k).toFixed(0) + "px 'JetBrains Mono', monospace";
  x.textAlign = "left";
  x.textBaseline = "alphabetic";
  txt("[" + Math.round(cx) + "," + Math.round(cy) + "]", cx + r * 0.76, cy - r * 0.78);

  x.fillStyle = P.text;
  x.beginPath();
  x.moveTo(pad + 14 * k, pad - 2 * k);
  x.lineTo(pad, pad + 24 * k);
  x.lineTo(pad + 28 * k, pad + 24 * k);
  x.closePath();
  x.fill();
  x.font = "700 " + (28 * k).toFixed(0) + "px 'Space Grotesk', sans-serif";
  txt("MAKE NO MISTAKES", pad + 44 * k, pad + 22 * k);

  x.font = (22 * k).toFixed(0) + "px 'JetBrains Mono', monospace";
  x.textAlign = "right";
  txt("N 52°14′ · E 21°01′", W - pad, pad + 20 * k);

  const nm = (name || "").trim();
  let hsh = 426;
  for (let ci = 0; ci < nm.length; ci++) hsh = (hsh * 31 + nm.charCodeAt(ci)) % 1000000;
  txt("TICKET NO. " + String(hsh).padStart(6, "0"), W - pad, H - pad - 44 * k);
  txt("SEP 4–10 · WARSAW", W - pad, H - pad - 8 * k);

  x.textAlign = "left";
  const nameUpper = nm.toUpperCase();
  const ty = H - pad - 118 * k;
  if (nameUpper) {
    x.fillStyle = P.text;
    x.font = "700 " + (34 * k).toFixed(0) + "px 'Space Grotesk', sans-serif";
    txt(nameUpper, pad, ty - 62 * k);
  }
  x.fillStyle = P.text;
  x.font = "700 " + (50 * k).toFixed(0) + "px 'Space Grotesk', sans-serif";
  txt("MAKES NO MISTAKES", pad, ty);
  x.font = (24 * k).toFixed(0) + "px 'JetBrains Mono', monospace";
  txt("AT THE AI HACKATHON · WARSAW", pad, ty + 40 * k);

  x.fillStyle = P.text;
  let bx = pad;
  let i = 0;
  const by = H - pad - 34 * k,
    bh = 34 * k;
  while (bx < pad + Math.min(W, H) * 0.4) {
    const w = (((i * 7) % 5) + 2) * k;
    if (i % 3 !== 1) x.fillRect(bx, by, w, bh);
    bx += w + (((i * 5) % 4) + 3) * k;
    i++;
  }
  try {
    (x as unknown as Record<string, string>).letterSpacing = "0px";
  } catch {}
}

function paint(
  cv: HTMLCanvasElement,
  img: HTMLImageElement | null,
  state: { pal: Palette; zoom: number; offX: number; offY: number; contrast: number; hud: boolean; name: string; fmt: Format }
) {
  const F = FMTS[state.fmt];
  const W = F.w,
    H = F.h;
  if (cv.width !== W || cv.height !== H) {
    cv.width = W;
    cv.height = H;
  }
  const x = cv.getContext("2d")!;
  const P = PALS[state.pal];
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalAlpha = 1;
  x.setLineDash([]);
  x.fillStyle = P.bg;
  x.fillRect(0, 0, W, H);

  if (img) {
    const iw = img.width,
      ih = img.height;
    const s = Math.max(W / iw, H / ih) * state.zoom;
    const dx = (W - iw * s) / 2 + state.offX * W * 0.5;
    const dy = (H - ih * s) / 2 + state.offY * H * 0.5;
    const tmp = document.createElement("canvas");
    tmp.width = W;
    tmp.height = H;
    const t = tmp.getContext("2d")!;
    t.imageSmoothingQuality = "high";
    t.drawImage(img, dx, dy, iw * s, ih * s);
    let d: Uint8ClampedArray;
    try {
      d = t.getImageData(0, 0, W, H).data;
    } catch {
      return;
    }

    const ROW = 5,
      COL = 3;
    const samples: number[] = [];
    for (let sy = 2; sy < H; sy += ROW * 3) {
      for (let sx = 1; sx < W; sx += COL * 3) {
        const k = (sy * W + sx) * 4;
        if (d[k + 3] < 30) continue;
        samples.push(0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]);
      }
    }
    samples.sort((a, b) => a - b);
    const lo = samples.length ? samples[(samples.length * 0.03) | 0] : 0;
    const hi = samples.length ? samples[Math.min(samples.length - 1, (samples.length * 0.97) | 0)] : 255;
    const span = Math.max(1, hi - lo);
    const con = state.contrast;

    x.fillStyle = "rgb(" + P.bar + ")";
    for (let sy = 2; sy < H; sy += ROW) {
      for (let sx = 0; sx < W; sx += COL) {
        const k = (sy * W + sx) * 4;
        if (d[k + 3] < 30) continue;
        const lum = 0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2];
        let nl = (lum - lo) / span;
        nl = Math.max(0, Math.min(1, 0.5 + (nl - 0.5) * con));
        const v = P.pos ? nl : 1 - nl;
        if (v < 0.06) continue;
        x.globalAlpha = Math.min(1, 0.16 + v * 0.95);
        const hgt = Math.max(0.5, v * (ROW - 0.6));
        x.fillRect(sx, sy - hgt / 2, COL, hgt);
      }
    }
    x.globalAlpha = 1;
  }

  if (state.hud) drawHud(x, W, H, P, state.name);
}

export default function AvatarPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const [hasImage, setHasImage] = useState(false);
  const [pal, setPal] = useState<Palette>("sky");
  const [zoom, setZoom] = useState(1);
  const [offX, setOffX] = useState(0);
  const [offY, setOffY] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [hud, setHud] = useState(true);
  const [name, setName] = useState("");
  const [fmt, setFmt] = useState<Format>("square");

  const repaint = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const cv = canvasRef.current;
      if (!cv) return;
      paint(cv, imgRef.current, { pal, zoom, offX, offY, contrast, hud, name, fmt });
    });
  }, [pal, zoom, offX, offY, contrast, hud, name, fmt]);

  useEffect(() => {
    repaint();
  }, [repaint]);

  useEffect(() => {
    if (document.fonts?.ready) document.fonts.ready.then(repaint);
  }, [repaint]);

  const loadImage = useCallback(
    (src: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imgRef.current = img;
        setHasImage(true);
      };
      img.src = src;
    },
    []
  );

  const onFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => loadImage(r.result as string);
      r.readAsDataURL(f);
      e.target.value = "";
    },
    [loadImage]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (!f || !f.type.startsWith("image/")) return;
      const r = new FileReader();
      r.onload = () => loadImage(r.result as string);
      r.readAsDataURL(f);
    },
    [loadImage]
  );

  const onDownload = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.toBlob((b) => {
      if (!b) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = "mnm-" + fmt + ".png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, "image/png");
  }, [fmt]);

  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!imgRef.current) return;
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offX, oy: offY };
    },
    [offX, offY]
  );

  const onCanvasPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragRef.current) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const F = FMTS[fmt];
      const dx = (e.clientX - dragRef.current.sx) * (F.w / r.width) / (F.w * 0.5);
      const dy = (e.clientY - dragRef.current.sy) * (F.h / r.height) / (F.h * 0.5);
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      setOffX(clamp(dragRef.current.ox + dx));
      setOffY(clamp(dragRef.current.oy + dy));
    },
    [fmt]
  );

  const onCanvasPointerUp = useCallback(() => {
    dragRef.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      if (!imgRef.current) return;
      e.preventDefault();
      setZoom((z) => Math.round(Math.max(1, Math.min(2.5, z * (e.deltaY < 0 ? 1.06 : 0.94))) * 100) / 100);
    },
    []
  );

  const onDblClick = useCallback(() => {
    if (!imgRef.current) return;
    setZoom(1);
    setOffX(0);
    setOffY(0);
  }, []);

  return (
    <div className="font-mono text-[#0a1b33] bg-[#edf4fc] min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center gap-4 px-4 sm:px-11 py-4 border-b border-[rgba(10,27,51,0.18)]">
        <a href="/" className="flex items-center gap-[11px] no-underline text-[#0a1b33]">
          <span
            className="inline-block w-0 h-0"
            style={{ borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderBottom: "15px solid #2e7fd9" }}
          />
          <span className="font-sans font-bold text-[14px] tracking-[0.04em]">MAKE NO MISTAKES</span>
        </a>
        <span className="text-[10.5px] tracking-[0.24em] text-[#4a6c96] hidden sm:inline">
          AVATAR&nbsp;TOOL&nbsp;·&nbsp;GRAWIURA
        </span>
        <span className="ml-auto text-[10.5px] tracking-[0.18em] text-[#4a6c96] hidden sm:inline">
          SEP&nbsp;4–10&nbsp;·&nbsp;WARSZAWA
        </span>
      </nav>

      {/* Main */}
      <main className="flex-1 flex justify-center px-4 sm:px-11 py-8 sm:py-11 pb-16">
        <div className="w-full max-w-[1180px] flex flex-col gap-7">
          {/* Header */}
          <header className="flex flex-col gap-2 max-w-[720px]">
            <h1 className="font-serif text-[32px] sm:text-[46px] font-normal leading-[1.05] tracking-[-0.01em] m-0">
              Zrób sobie awatar.
            </h1>
            <p className="text-[13px] leading-[1.7] text-[#4a6c96] m-0" style={{ textWrap: "pretty" as never }}>
              Zapisz swoje zdjęcie profilowe (LinkedIn: otwórz profil → kliknij zdjęcie → zapisz albo
              zrób zrzut), upuść je poniżej — narzędzie zamieni je w grawiurę w stylu hero z syrenką.
              Pobierz PNG 1080×1080 i wrzuć jako zdjęcie profilowe na czas hackathonu.
            </p>
          </header>

          {/* Grid: preview + controls */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,560px)_minmax(300px,1fr)] gap-8 items-start">
            {/* Preview */}
            <div
              className="bg-[#0a1b33] p-[14px] box-border"
              style={{
                clipPath: "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
            >
              <div
                className="relative"
                style={{
                  clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={FMTS[fmt].w}
                  height={FMTS[fmt].h}
                  className="block w-full h-auto cursor-grab touch-none"
                  onPointerDown={onCanvasPointerDown}
                  onPointerMove={onCanvasPointerMove}
                  onPointerUp={onCanvasPointerUp}
                  onPointerCancel={onCanvasPointerUp}
                  onWheel={onWheel}
                  onDoubleClick={onDblClick}
                />
                {!hasImage && (
                  <div className="absolute inset-[14px] border-2 border-dashed border-[rgba(237,243,251,0.55)] flex flex-col items-center justify-center gap-3 text-center text-[#edf3fb] p-6 box-border">
                    <span className="font-sans font-bold text-[20px]">Upuść zdjęcie tutaj</span>
                    <span className="text-[11.5px] leading-[1.7] text-[#a8cef5] max-w-[320px]">
                      albo wybierz plik po prawej. Najlepiej działa portret na spokojnym tle.
                    </span>
                    <label className="cursor-pointer">
                      <span className="text-[#a8cef5] font-mono text-[11px] tracking-[0.16em] underline underline-offset-[3px]">
                        WYBIERZ PLIK →
                      </span>
                      <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-[22px]">
              {/* 01 / ZDJĘCIE */}
              <div className="flex flex-col gap-[10px] border-t-2 border-[#0a1b33] pt-[14px]">
                <span className="text-[11px] tracking-[0.22em] text-[#2e7fd9]">01 / ZDJĘCIE</span>
                <label className="inline-flex items-center justify-center gap-[10px] border-2 border-[#0a1b33] bg-white px-[18px] py-[13px] cursor-pointer font-sans font-bold text-[14px] hover:bg-[#e2edfa]">
                  Wgraj zdjęcie
                  <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                </label>
                <span className="text-[11px] leading-[1.65] text-[#4a6c96]">
                  Zdjęcie zostaje w przeglądarce — nic nie wysyłamy.
                </span>
              </div>

              {/* 02 / PALETA */}
              <div className="flex flex-col gap-[10px] border-t-2 border-[#0a1b33] pt-[14px]">
                <span className="text-[11px] tracking-[0.22em] text-[#2e7fd9]">02 / PALETA</span>
                <div className="flex gap-[10px]">
                  {(["sky", "paper", "navy"] as Palette[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPal(p)}
                      className="w-16 h-11 border-2 border-[#0a1b33] cursor-pointer flex items-center justify-center font-mono text-[14px] p-0"
                      style={{
                        background: PALS[p].bg,
                        color: PALS[p].text,
                      }}
                    >
                      {pal === p ? "✓" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* 03 / KADR */}
              <div className="flex flex-col gap-3 border-t-2 border-[#0a1b33] pt-[14px]">
                <span className="text-[11px] tracking-[0.22em] text-[#2e7fd9]">03 / KADR</span>
                <span className="text-[11px] leading-[1.65] text-[#4a6c96]">
                  Złap i przeciągnij zdjęcie na podglądzie, przybliżaj scrollem, dwuklik resetuje kadr.
                </span>
                <SliderRow label="ZOOM" value={zoom} displayValue={Math.round(zoom * 100) + "%"} min={1} max={2.5} step={0.01} onChange={setZoom} />
                <SliderRow label="POZIOMO" value={offX} displayValue={(offX > 0 ? "+" : "") + Math.round(offX * 100)} min={-1} max={1} step={0.01} onChange={setOffX} />
                <SliderRow label="PIONOWO" value={offY} displayValue={(offY > 0 ? "+" : "") + Math.round(offY * 100)} min={-1} max={1} step={0.01} onChange={setOffY} />
                <SliderRow label="KONTRAST" value={contrast} displayValue={contrast.toFixed(2) + "×"} min={0.5} max={1.8} step={0.01} onChange={setContrast} />
              </div>

              {/* 04 / PODPIS + HUD */}
              <div className="flex flex-col gap-[10px] border-t-2 border-[#0a1b33] pt-[14px]">
                <span className="text-[11px] tracking-[0.22em] text-[#2e7fd9]">04 / PODPIS + HUD</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Imię i nazwisko (opcjonalnie)"
                  className="border-2 border-[#0a1b33] bg-white outline-none font-mono text-[13px] text-[#0a1b33] px-[14px] py-3"
                />
                <button
                  onClick={() => setHud((h) => !h)}
                  className="self-start border-2 border-[#0a1b33] bg-white cursor-pointer font-mono text-[11px] tracking-[0.16em] px-[14px] py-[9px] hover:bg-[#e2edfa]"
                >
                  RAMKA HUD: {hud ? "ON" : "OFF"}
                </button>
              </div>

              {/* 05 / FORMAT */}
              <div className="flex flex-col gap-[10px] border-t-2 border-[#0a1b33] pt-[14px]">
                <span className="text-[11px] tracking-[0.22em] text-[#2e7fd9]">05 / FORMAT</span>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      { key: "square" as Format, label: "AWATAR · LINKEDIN / X · 1080×1080" },
                      { key: "linkedin" as Format, label: "BANER LINKEDIN · 1584×396" },
                      { key: "x" as Format, label: "BANER X · 1500×500" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFmt(f.key)}
                      className="flex justify-between items-center border-2 border-[#0a1b33] bg-white cursor-pointer font-mono text-[11.5px] tracking-[0.1em] px-[14px] py-[10px] text-left hover:bg-[#e2edfa]"
                    >
                      <span>{f.label}</span>
                      {fmt === f.key && <span className="text-[#2e7fd9] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download */}
              <div className="flex flex-col gap-2 border-t-2 border-[#0a1b33] pt-4">
                <button
                  onClick={onDownload}
                  className="border-none cursor-pointer bg-[#2e7fd9] text-[#edf4fc] font-sans font-bold text-[16px] px-5 py-[15px] hover:bg-[#1b549e]"
                >
                  Pobierz PNG {FMTS[fmt].label} ↓
                </button>
                <span className="text-[11px] leading-[1.65] text-[#4a6c96]">
                  Awatar jest przycinany do koła — trzymaj twarz w środku kadru. Banery wgrywasz w
                  ustawieniach profilu.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(10,27,51,0.18)] px-4 sm:px-11 py-4 flex justify-between text-[10.5px] tracking-[0.18em] text-[#4a6c96]">
        <span>MAKE&nbsp;NO&nbsp;MISTAKES&nbsp;·&nbsp;AI&nbsp;HACKATHON</span>
        <span>KOLEKTYW3&nbsp;×&nbsp;PRELINT</span>
      </footer>
    </div>
  );
}

function SliderRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10.5px] tracking-[0.14em] text-[#4a6c96]">
        <span>{label}</span>
        <span>{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
