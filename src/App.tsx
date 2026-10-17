import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import UpdateBanner from "./components/UpdateBanner";

const SIZES = [
  { label: "S", value: 128, hint: "128px" },
  { label: "M", value: 256, hint: "256px" },
  { label: "L", value: 512, hint: "512px" },
];

const PRESETS = [
  { name: "Classic", dark: "#000000", light: "#ffffff" },
  { name: "Mint", dark: "#0b2b1f", light: "#8fe388" },
  { name: "Navy", dark: "#1e3a5f", light: "#f5f0e6" },
  { name: "Plum", dark: "#4a2440", light: "#fdf2f8" },
];

function App() {
  const [content, setContent] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(256);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasContent = content.trim().length > 0;

  useEffect(() => {
    if (!canvasRef.current || !hasContent) return;

    QRCode.toCanvas(canvasRef.current, content, {
      width: qrSize,
      margin: 2,
      color: {
        dark: qrColor,
        light: backgroundColor,
      },
    });
  }, [content, qrColor, backgroundColor, qrSize, hasContent]);

  const handleDownload = () => {
    if (!canvasRef.current || !hasContent) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleReset = () => {
    setContent("");
    setQrColor("#000000");
    setBackgroundColor("#ffffff");
    setQrSize(256);
  };

  const applyPreset = (dark: string, light: string) => {
    setQrColor(dark);
    setBackgroundColor(light);
  };

  const activePreset = PRESETS.findIndex(
    (p) => p.dark === qrColor && p.light === backgroundColor,
  );

  return (
    <>
      <UpdateBanner />
      <main className="relative min-h-screen overflow-hidden bg-[#07181f] px-4 py-8 text-white sm:px-6 sm:py-12">
        {/* Faint dot texture: brand identity, shared with the portfolio */}
        <div
          className="dot-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold tracking-tight">
              Marcel<span className="text-[#8fe388]">.</span>
              <span className="ml-2 font-medium text-white/40">QR Generator</span>
            </p>
            <p className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/50 sm:block">
              100% in your browser
            </p>
          </div>

          {/* Header: tight, this is a tool not a landing page */}
          <header className="mt-10 mb-8 text-center sm:mt-14 sm:mb-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Make a QR code<span className="text-[#8fe388]">.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#9fb3ba]">
              Type text or a link, get a scannable QR code. Restyle it if you
              want, then download the PNG.
            </p>
          </header>

          {/* Tool */}
          <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            {/* Settings */}
            <section className="rounded-[24px] bg-[#0a1b21] p-6 ring-1 ring-white/[0.08] sm:p-8">
              <div>
                <label
                  htmlFor="qr-content"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Text or link
                </label>
                <textarea
                  id="qr-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="https://marchanggara.my.id"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#07181f] p-4 text-[15px] text-white placeholder:text-white/25 outline-none transition focus:border-[#8fe388]/60 focus:ring-2 focus:ring-[#8fe388]/20"
                />
              </div>

              <div className="mt-7">
                <p className="mb-2 text-sm font-semibold text-white">Size</p>
                <div
                  role="radiogroup"
                  aria-label="QR code size"
                  className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#07181f] p-1.5"
                >
                  {SIZES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      aria-checked={qrSize === s.value}
                      onClick={() => setQrSize(s.value)}
                      className={`rounded-xl px-2 py-2.5 transition ${
                        qrSize === s.value
                          ? "bg-[#8fe388] text-[#07181f]"
                          : "text-white/55 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="block text-sm font-semibold leading-5">
                        {s.label}
                      </span>
                      <span
                        className={`block text-[11px] font-normal leading-4 ${
                          qrSize === s.value
                            ? "text-[#07181f]/60"
                            : "text-white/30"
                        }`}
                      >
                        {s.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-2 text-sm font-semibold text-white">Colors</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p, i) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p.dark, p.light)}
                      aria-pressed={activePreset === i}
                      title={p.name}
                      className={`flex items-center gap-2 rounded-full border py-2 pl-2 pr-3.5 text-xs font-medium transition ${
                        activePreset === i
                          ? "border-[#8fe388]/60 bg-[#8fe388]/10 text-white"
                          : "border-white/10 bg-[#07181f] text-white/60 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span className="flex overflow-hidden rounded-full ring-1 ring-white/20">
                        <span
                          className="h-5 w-5"
                          style={{ backgroundColor: p.dark }}
                        />
                        <span
                          className="h-5 w-5"
                          style={{ backgroundColor: p.light }}
                        />
                      </span>
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#07181f] p-3 transition hover:border-white/25">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(event) => setQrColor(event.target.value)}
                      aria-label="QR code color"
                      className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span>
                      <span className="block text-xs font-medium text-white/45">
                        Code
                      </span>
                      <span className="block font-mono text-xs text-white/85">
                        {qrColor.toUpperCase()}
                      </span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#07181f] p-3 transition hover:border-white/25">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(event) =>
                        setBackgroundColor(event.target.value)
                      }
                      aria-label="Background color"
                      className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span>
                      <span className="block text-xs font-medium text-white/45">
                        Background
                      </span>
                      <span className="block font-mono text-xs text-white/85">
                        {backgroundColor.toUpperCase()}
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-7 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/55 transition hover:border-white/25 hover:text-white"
              >
                Reset everything
              </button>
            </section>

            {/* Preview */}
            <section className="flex flex-col rounded-[24px] bg-[#0a1b21] p-6 ring-1 ring-white/[0.08] sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-white">Preview</h2>
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    hasContent ? "text-[#8fe388]" : "text-white/35"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      hasContent ? "bg-[#8fe388]" : "bg-white/25"
                    }`}
                  />
                  {hasContent ? "Ready" : "Waiting for input"}
                </span>
              </div>

              <div className="flex flex-1 items-center justify-center rounded-2xl bg-white p-6 shadow-[0_0_60px_rgba(143,227,136,0.07)]">
                {hasContent ? (
                  <canvas
                    ref={canvasRef}
                    className="h-auto w-full max-w-[280px]"
                    aria-label="Generated QR code"
                  />
                ) : (
                  <div className="flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-center">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-300"
                      aria-hidden="true"
                    >
                      ✦
                    </span>
                    <p className="mt-4 text-sm font-semibold text-slate-500">
                      Nothing here yet
                    </p>
                    <p className="mt-1 px-6 text-xs leading-5 text-slate-400">
                      Type something on the left and your QR code appears here
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!hasContent}
                className="mt-6 w-full rounded-2xl bg-[#8fe388] px-5 py-4 text-[15px] font-bold text-[#07181f] transition hover:bg-[#a5ef9f] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#8fe388]"
              >
                Download PNG
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-white/35">
                {hasContent
                  ? "Scan it with your phone to double-check before sharing."
                  : "The button wakes up once you type something."}
              </p>
            </section>
          </div>

          <footer className="mt-10 text-center text-xs text-white/30">
            Built with React + TypeScript. Your text never leaves this page.
          </footer>
        </div>
      </main>
    </>
  );
}

export default App;
