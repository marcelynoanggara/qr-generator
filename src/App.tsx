import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import UpdateBanner from "./components/UpdateBanner";

function App() {
  const [content, setContent] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(256);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !content.trim()) return;

    QRCode.toCanvas(canvasRef.current, content, {
      width: qrSize,
      margin: 2,
      color: {
        dark: qrColor,
        light: backgroundColor,
      },
    });
  }, [content, qrColor, backgroundColor, qrSize]);

  const handleDownload = () => {
    if (!canvasRef.current || !content.trim()) return;

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

  return (
    <>
      <UpdateBanner />
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-cyan-400">
            Simple QR Maker
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Create your QR code
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Generate a clean, customizable QR code from any text or URL.
          </p>
        </header>

        {/* Main Card */}
        <div className="grid overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl md:grid-cols-2">
          {/* Settings */}
          <section className="border-b border-slate-800 p-6 sm:p-8 md:border-b-0 md:border-r">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                QR Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customize your QR code.
              </p>
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="qr-content"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Text or URL
              </label>

              <textarea
                id="qr-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="https://example.com"
                className="min-h-32 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Size */}
            <div className="mt-6">
              <label
                htmlFor="qr-size"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Size
              </label>

              <select
                id="qr-size"
                value={qrSize}
                onChange={(event) =>
                  setQrSize(Number(event.target.value))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              >
                <option value={128}>128 × 128 px</option>
                <option value={256}>256 × 256 px</option>
                <option value={512}>512 × 512 px</option>
              </select>
            </div>

            {/* Colors */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="qr-color"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  QR Color
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2">
                  <input
                    id="qr-color"
                    type="color"
                    value={qrColor}
                    onChange={(event) =>
                      setQrColor(event.target.value)
                    }
                    className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />

                  <span className="text-xs text-slate-400">
                    {qrColor.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="background-color"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Background
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2">
                  <input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(event) =>
                      setBackgroundColor(event.target.value)
                    }
                    className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />

                  <span className="text-xs text-slate-400">
                    {backgroundColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Reset settings
            </button>
          </section>

          {/* Preview */}
          <section className="flex flex-col items-center justify-center bg-slate-950 p-6 sm:p-8">
            <div className="mb-5 flex w-full items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Preview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {content.trim()
                    ? "Your QR code is ready."
                    : "Enter content to generate."}
                </p>
              </div>

              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  content.trim()
                    ? "bg-emerald-400"
                    : "bg-slate-600"
                }`}
              />
            </div>

            {/* QR Preview */}
            <div className="flex aspect-square w-full max-w-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
              {content.trim() ? (
                <canvas
                  ref={canvasRef}
                  className="max-h-full max-w-full"
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
                    <span className="text-2xl text-slate-400">
                      QR
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    No QR code yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Enter text or a URL
                  </p>
                </div>
              )}
            </div>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={!content.trim()}
              className="mt-6 w-full max-w-[300px] rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Download PNG
            </button>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-600">
          Built with React, TypeScript, Tailwind CSS & Vite
        </footer>
      </div>
      </main>
    </>
  );
}

export default App;