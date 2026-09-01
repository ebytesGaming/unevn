import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { WaitlistHero } from "@/components/ui/waitlist-hero";
import { Pricing } from "@/components/ui/pricing";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";
import { TaskSteps } from "@/components/ui/task-steps";
import { Button } from "@/components/ui/button";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import MultistepForm from "@/components/ui/multistep-form";
import AdminDashboard from "@/components/ui/admin-dashboard";
import { AuthForm } from "@/components/ui/sign-in-1";
import { PixelHero } from "@/components/ui/pixel-perfect-hero";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const MAINTENANCE_MODE = true;

function MaintenancePage() {
  useEffect(() => {
    const WORDMARK =
      '<svg width="1600" height="300" viewBox="0 0 1600 300" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<text x="800" y="205" text-anchor="middle" fill="#F4F4F0" font-family="-apple-system, BlinkMacSystemFont, \'SF Pro Display\', Helvetica, Arial, sans-serif" font-size="170" font-weight="900" letter-spacing="-4">UNEVN STUDIOS</text>' +
      '</svg>';

    const PALETTE = [[255, 255, 255], [226, 232, 240], [191, 205, 225]];
    const FORMATS = ["dot", "dot", "square"];
    const SIZE_SMALL = [2.2, 3.8];
    const SIZE_BIG = [4.2, 5.8];
    const BIG_CHANCE = 0.09;
    const GAP = 5;
    const SPEED = 2;
    const SEED = 1337;
    const GAMMA = 0.55;
    const DUR = 8;
    const TAU = Math.PI * 2;

    function noise(x: number, y: number, t: number) {
      const a = x + 0.7 * Math.sin(1.2 * y + t);
      const r = y + 0.7 * Math.cos(1.1 * x - t);
      return (Math.sin(1.3 * a + 0.6 * t) + Math.cos(1.5 * r - 0.5 * t) + Math.sin((a + r) * 0.9 + 0.3 * t)) / 3;
    }

    function snowfall(p: { nx: number; ny: number; offset: number; }, t: number, n: { swirl?: number; sway?: number; axis?: string; freq?: number; fall?: number; trail?: number; wind?: number; }) {
      const swirl = n.swirl ? n.swirl * noise(3 * p.nx, 3 * p.ny, 0.5 * t) : 0;
      const sway = (n.sway || 0) * Math.sin(0.8 * t + p.offset * TAU + 4 * p.ny) + swirl;
      const i = n.axis === "x" ? p.nx : p.ny;
      const l = n.axis === "x" ? p.ny : p.nx;
      const o = i * (n.freq || 0) - t * (n.fall || 0) + p.offset * (n.freq || 0) + sway + (n.wind || 0) * l;
      const s = o - Math.floor(o);
      return s < (n.trail || 0) ? 1 - s / (n.trail || 1) : 0;
    }

    function squall(p: { nx: number; ny: number; offset: number }, t: number) {
      const band = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(3 * p.nx - 0.5 * t), 2);
      const flake = snowfall(p, t, { fall: 0.26, freq: 5, trail: 0.4, sway: 0.14, wind: 0.8 });
      return {
        a: 0.32 + 0.68 * band * Math.pow(flake, 1.8),
        p: 0.7 * p.offset,
      };
    }

    function lerpRGB(a: number[], b: number[], t: number) {
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }

    function mixPalette(p: number) {
      const e = Math.max(0, Math.min(1, p)) * (PALETTE.length - 1);
      const r = Math.floor(e);
      const s = e - r;
      return lerpRGB(PALETTE[r], PALETTE[Math.min(PALETTE.length - 1, r + 1)], s);
    }

    const canvasElement = document.getElementById("storm-canvas") as HTMLCanvasElement | null;
    const hostElement = document.getElementById("storm") as HTMLElement | null;
    const ctx2d = canvasElement?.getContext("2d");
    if (!canvasElement || !hostElement || !ctx2d) return;

    const canvas = canvasElement;
    const host = hostElement;
    const ctx = ctx2d;

    let particles: Array<any> = [];
    let maskImg: HTMLImageElement | null = null;
    let maskReady = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const playing = !reduced;
    let tNow = 0;
    let t0 = performance.now();
    let visible = true;

    function lcg(seed: number) {
      let e = seed >>> 0;
      return function () {
        e = (1664525 * e + 0x3c6ef35f) >>> 0;
        return e / 0xffffffff;
      };
    }

    function makeMask(w: number, h: number) {
      if (!maskImg || !maskReady || !maskImg.width || !maskImg.height) return null;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const g = off.getContext("2d");
      if (!g) return null;
      const scale = Math.min(w / maskImg.width, h / maskImg.height);
      const dw = maskImg.width * scale;
      const dh = maskImg.height * scale;
      g.drawImage(maskImg, (w - dw) / 2, (h - dh) / 2, dw, dh);
      let data: Uint8ClampedArray | null = null;
      try {
        data = g.getImageData(0, 0, w, h).data;
      } catch {
        return null;
      }
      return function (x: number, y: number) {
        const ix = Math.min(w - 1, Math.max(0, Math.round(x)));
        const iy = Math.min(h - 1, Math.max(0, Math.round(y)));
        const i = (iy * w + ix) * 4;
        const lum = (0.299 * data![i] + 0.587 * data![i + 1] + 0.114 * data![i + 2]) / 255;
        return Math.pow(lum * (data![i + 3] / 255), GAMMA);
      };
    }

    function rebuild() {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sample = makeMask(w, h);
      const rand = lcg(SEED);
      const cols = Math.ceil(w / GAP);
      const rows = Math.ceil(h / GAP);
      const ox = (w - (cols - 1) * GAP) / 2;
      const oy = (h - (rows - 1) * GAP) / 2;
      const cx = (cols - 1) / 2;
      const cy = (rows - 1) / 2;
      const maxd = Math.hypot(cx, cy) || 1;
      particles = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const format = FORMATS[Math.floor(rand() * FORMATS.length)];
          const range = rand() < BIG_CHANCE ? SIZE_BIG : SIZE_SMALL;
          const size = range[0] + rand() * (range[1] - range[0]);
          const px = ox + x * GAP;
          const py = oy + y * GAP;
          particles.push({
            cx: px,
            cy: py,
            nx: cols > 1 ? x / (cols - 1) : 0.5,
            ny: rows > 1 ? y / (rows - 1) : 0.5,
            dist: Math.hypot(x - cx, y - cy) / maxd,
            format,
            size,
            phase: rand() * Math.PI * 2,
            speed: 0.6 + 2.6 * rand(),
            offset: rand(),
            mask: sample ? sample(px, py) : 1,
          });
        }
      }
    }

    function drawParticle(p: any, t: number) {
      const field = squall(p, t);
      let alpha = field.a;
      const rgb = mixPalette(field.p);
      alpha = Math.max(0, Math.min(1, alpha));
      if (p.mask < 1) alpha = p.mask * (0.3 + 0.7 * alpha);
      if (alpha <= 0.005) return;
      ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")";
      const hx = p.cx;
      const hy = p.cy;
      const d = p.size;
      const r = d / 2;
      if (p.format === "square") ctx.fillRect(hx - r, hy - r, d, d);
      else {
        ctx.beginPath();
        ctx.arc(hx, hy, r, 0, TAU);
        ctx.fill();
      }
    }

    function render(t: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) drawParticle(particles[i], t);
    }

    function apply(t: number) {
      tNow = ((t % DUR) + DUR) % DUR;
      render(tNow * SPEED);
    }

    function tick(now: number) {
      if (playing && visible) {
        tNow = ((now - t0) / 1000) % DUR;
        render(tNow * SPEED);
      }
      requestAnimationFrame(tick);
    }

    const img = new Image();
    img.onload = function () {
      maskImg = img;
      maskReady = true;
      rebuild();
      apply(tNow);
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(WORDMARK);

    rebuild();
    apply(0);
    requestAnimationFrame(tick);

    window.addEventListener("resize", function () {
      rebuild();
      apply(tNow);
    });

    if (typeof ResizeObserver !== "undefined") {
      let lastW = host.clientWidth;
      let lastH = host.clientHeight;
      new ResizeObserver(function () {
        if (host.clientWidth !== lastW || host.clientHeight !== lastH) {
          lastW = host.clientWidth;
          lastH = host.clientHeight;
          rebuild();
          apply(tNow);
        }
      }).observe(host);
    }

    if (typeof IntersectionObserver !== "undefined") {
      new IntersectionObserver(function (entries) {
        const on = entries[0] && entries[0].isIntersecting;
        if (on === visible) return;
        visible = !!on;
        if (visible) t0 = performance.now() - tNow * 1000;
      }, { rootMargin: "120px" }).observe(canvas);
    }

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && playing) t0 = performance.now() - tNow * 1000;
    });

    document.getElementById("checkStatusBtn")?.addEventListener("click", function () {
      document.getElementById("statusLine")?.classList.add("show");
    });
    document.getElementById("refreshBtn")?.addEventListener("click", function () {
      window.location.reload();
    });
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg: #0c0c0d;
          --card-border: rgba(244, 244, 240, 0.18);
          --fg: #f4f4f0;
          --muted: #9a9a9d;
          --offline: #e5484d;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { color-scheme: dark; }
        html, body {
          min-height: 100%;
          background: var(--bg);
          color: var(--fg);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .maintenance-wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 1.5rem;
          background: var(--bg);
        }
        .maintenance-wordmark-wrap {
          width: 100%;
          max-width: 920px;
          background: var(--bg);
        }
        .maintenance-storm {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 5.333333333333333;
          background: var(--bg);
        }
        .maintenance-storm canvas { display: block; width: 100%; height: 100%; }
        .maintenance-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          max-width: 26rem;
          width: 100%;
          padding: 3rem 1.5rem;
          border: 1px dashed var(--card-border);
          border-radius: 0.75rem;
          text-align: center;
          background: var(--bg);
        }
        .maintenance-empty-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .maintenance-empty-media img {
          width: 10rem;
          filter: grayscale(1) invert(1) opacity(0.9);
          margin-bottom: 0.5rem;
        }
        .maintenance-empty-title {
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .maintenance-empty-description {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--muted);
        }
        .maintenance-empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
          width: 100%;
        }
        .maintenance-buttons {
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 0.5rem;
        }
        .maintenance-button {
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 0.4rem;
          padding: 0.5rem 0.9rem;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
        }
        .maintenance-btn-outline {
          background: transparent;
          color: var(--fg);
          border: 1px solid var(--card-border);
        }
        .maintenance-btn-outline:hover { background: rgba(244, 244, 240, 0.06); }
        .maintenance-btn-solid {
          background: var(--fg);
          color: var(--bg);
          border: 1px solid var(--fg);
        }
        .maintenance-btn-solid:hover { opacity: 0.85; }
        .maintenance-status {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: var(--muted);
          min-height: 1.2rem;
          opacity: 0;
          transform: translateY(-2px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .maintenance-status.show {
          opacity: 1;
          transform: translateY(0);
        }
        .maintenance-status .dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 999px;
          background: var(--offline);
          box-shadow: 0 0 0 3px rgba(229, 72, 77, 0.18);
        }
        .maintenance-status .label {
          color: var(--offline);
          font-weight: 600;
        }
      `}</style>

      <div className="maintenance-wrap">
        <div className="maintenance-wordmark-wrap">
          <div className="maintenance-storm" id="storm" role="img" aria-label="Unevn Studios">
            <canvas id="storm-canvas"></canvas>
          </div>
        </div>
        <div className="maintenance-empty">
          <div className="maintenance-empty-header">
            <div className="maintenance-empty-media">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNzIwIiBoZWlnaHQ9IjYwNi40NjUiIHZpZXdCb3g9IjAgMCA3MjAgNjA2LjQ2NSIgcm9sZT0iaW1nIiBhcnRpc3Q9IkthdGVyaW5hIExpbXBpdHNvdW5pIiBzb3VyY2U9Imh0dHBzOi8vdW5kcmF3LmNvLyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYzOS43NSAtMjgyLjA2MykiPjxyZWN0IHdpZHRoPSI0NjkiIGhlaWdodD0iMTA5IiByeD0iOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzY4Ljc1IDc3OS41MjcpIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjI5OSIvPjxwYXRoIGQ9Ik0xMS4zODQsMi44NDZhOC41NDgsOC41NDgsMCwwLDAtOC41MzgsOC41MzhWOTYuNzY4YTguNTQ4LDguNTQ4LDAsMCwwLDguNTM4LDguNTM4SDQ1OC4yMjRhOC41NDgsOC41NDgsMCwwLDAsOC41MzgtOC41MzhWMTEuMzg0YTguNTQ4LDguNTQ4LDAsMCwwLTguNTM4LTguNTM4SDExLjM4NG0wLTIuODQ2SDQ1OC4yMjRhMTEuMzg0LDExLjM4NCwwLDAsMSwxMS4zODQsMTEuMzg0Vjk2Ljc2OGExMS4zODQsMTEuMzg0LDAsMCwxLTExLjM4NCwxMS4zODRIMTEuMzg0QTExLjM4NCwxMS4zODQsMCwwLDEsMCw5Ni43NjhWMTEuMzg0QTExLjM4NCwxMS4zODQsMCwwLDEsMTEuMzg0LDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NjguMTgxIDc4MC4wNDMpIiBmaWxsPSIjMDkwODE0Ii8+PHJlY3Qgd2lkdGg9IjQ2OSIgaGVpZ2h0PSIxMDgiIHJ4PSI4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NjguNzUgNTY5LjUyNykiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMjk5Ii8+PHBhdGggZD0iTTExLjM4NCwyLjg0NmE4LjU0OCw4LjU0OCwwLDAsMC04LjUzOCw4LjUzOFY5Ni43NjhhOC41NDgsOC41NDgsMCwwLDAsOC41MzgsOC41MzhINDU4LjIyNGE4LjU0OCw4LjU0OCwwLDAsMCw4LjUzOC04LjUzOFYxMS4zODRhOC41NDgsOC41NDgsMCwwLDAtOC41MzgtOC41MzhIMTEuMzg0bTAtMi44NDZINDU4LjIyNGExMS4zODQsMTEuMzg0LDAsMCwxLDExLjM4NCwxMS4zODRWOTYuNzY4YTExLjM4NCwxMS4zODQsMCwwLDEtMTEuMzg0LDExLjM4NEgxMS4zODRBMTEuMzg0LDExLjM4NCwwLDAsMSwwLDk2Ljc2OFYxMS4zODRBMTEuMzg0LDExLjM4NCwwLDAsMSwxMS4zODQsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc2OC4xODEgNTY5LjQzMSkiIGZpbGw9IiMwOTA4MTQiLz48cGF0aCBkPSJNNTQ4LjY3NSwyMzUuMjMzaC0yLjg0NlYxMjguNDQzSDM0Mi44MlYxMjUuNkg1NDguNjc1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzY4LjE4MiAzMzUuMTk3KSIgZmlsbD0iIzNmM2Q1NiIvPjxjaXJjbGUgY3g9IjM5LjUzMiIgY3k9IjM5LjUzMiIgcj0iMzkuNTMyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MzkuNzUgNDE0LjQwNykiIGZpbGw9IiM2YzYzZmYiLz48cGF0aCBkPSJNNTIxLjksMzU2LjUzNWE0LjQsNC40LDAsMCwxLTMuNTE4LTEuNzU5TDUwNy42LDM0MC40YTQuNCw0LjQsMCwwLDEsNy4wMzYtNS4yNzdsNy4wNTYsOS40MDcsMTguMTIyLTI3LjE4M2E0LjQsNC40LDAsMCwxLDcuMzE4LDQuODc5bC0yMS41NywzMi4zNTVhNC40LDQuNCwwLDAsMS0zLjUzNywxLjk1N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MS45ODcgMTE3Ljk4KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02MDYuOTMsMjM1LjIzM2gtMi44NDZWMTI1LjZIODA5LjkzOXYyLjg0Nkg2MDYuOTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NzguNzEyIDMzNS4xOTcpIiBmaWxsPSIjM2YzZDU2Ii8+PGNpcmNsZSBjeD0iMzkuNTMyIiBjeT0iMzkuNTMyIiByPSIzOS41MzIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyODAuNjg1IDQxNC40MDcpIiBmaWxsPSIjNmM2M2ZmIi8+PHBhdGggZD0iTTk3Mi4zLDM1Ni41MzVhNC40LDQuNCwwLDAsMS0zLjUxOC0xLjc1OUw5NTcuOTkzLDM0MC40YTQuNCw0LjQsMCwxLDEsNy4wMzYtNS4yNzdsNy4wNTYsOS40MDcsMTguMTIyLTI3LjE4M2E0LjQsNC40LDAsMSwxLDcuMzE4LDQuODc5bC0yMS41NywzMi4zNTVhNC40LDQuNCwwLDAsMS0zLjUzNywxLjk1N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM0Mi41MjkgMTE3Ljk4KSIgZmlsbD0iI2ZmZiIvPjxyZWN0IHdpZHRoPSIyLjg0NiIgaGVpZ2h0PSIyMjcuMzI4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5OTguNDAzIDM0My4xMDQpIiBmaWxsPSIjM2YzZDU2Ii8+PGNpcmNsZSBjeD0iMzkuNTMyIiBjeT0iMzkuNTMyIiByPSIzOS41MzIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk2NC4yMDcgMjgyLjA2MykiIGZpbGw9IiM2YzYzZmYiLz48cGF0aCBkPSJNNzQ5LjksMjYzLjUzNWE0LjQsNC40LDAsMCwxLTMuNTE4LTEuNzU5TDczNS42LDI0Ny40YTQuNCw0LjQsMCwwLDEsNy4wMzYtNS4yNzdsNy4wNTYsOS40MDcsMTguMTIyLTI3LjE4M2E0LjQsNC40LDAsMCwxLDcuMzE4LDQuODc5bC0yMS41NywzMi4zNTVhNC40LDQuNCwwLDAsMS0zLjUzNywxLjk1N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0OC40NDQgNzguNjM2KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02MjMuMDg3LDQ3NC43NDFhOS45NzMsOS45NzMsMCwwLDEtOS45NjEtOS45NjFWNDM5LjE2NWE5Ljk2MSw5Ljk2MSwwLDAsMSwxOS45MjMsMFY0NjQuNzhBOS45NzMsOS45NzMsMCwwLDEsNjIzLjA4Nyw0NzQuNzQxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk3LjAwMyAxNzEuNDY4KSIgZmlsbD0iIzZjNjNmZiIvPjxwYXRoIGQ9Ik02NDMuMDg3LDQ3NC43NDFhOS45NzMsOS45NzMsMCwwLDEtOS45NjEtOS45NjFWNDM5LjE2NWE5Ljk2MSw5Ljk2MSwwLDAsMSwxOS45MjMsMFY0NjQuNzhhOS45NzMsOS45NzMsMCwwLDEtOS45NjIsOS45NjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDUuNDY0IDE3MS40NjgpIiBmaWxsPSIjNmM2M2ZmIi8+PHBhdGggZD0iTTY2My4wODcsNDc0Ljc0MWE5Ljk3Myw5Ljk3MywwLDAsMS05Ljk2MS05Ljk2MVY0MzkuMTY1YTkuOTYxLDkuOTYxLDAsMCwxLDE5LjkyMywwVjQ2NC43OEE5Ljk3Myw5Ljk3MywwLDAsMSw2NjMuMDg3LDQ3NC43NDFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTMuOTI1IDE3MS40NjgpIiBmaWxsPSIjNmM2M2ZmIi8+PHBhdGggZD0iTTY4My4wODcsNDc0Ljc0MWE5Ljk3Myw5Ljk3MywwLDAsMS05Ljk2Mi05Ljk2MVY0MzkuMTY1YTkuOTYxLDkuOTYxLDAsMCwxLDE5LjkyMywwVjQ2NC43OGE5Ljk3Myw5Ljk3MywwLDAsMS05Ljk2MSw5Ljk2MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMi4zODYgMTcxLjQ2OCkiIGZpbGw9IiM2YzYzZmYiLz48cGF0aCBkPSJNMjQxLjEzMSwyLjc2OUguNjM1YTIuMTM1LDIuMTM1LDAsMCwxLDAtNC4yNjloMjQwLjVhMi4xMzUsMi4xMzUsMCwwLDEsMCw0LjI2OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk1My4yNTUgNjA3LjU3NCkiIGZpbGw9IiMwOTA4MTQiLz48cGF0aCBkPSJNMjQxLjEzMSwyLjc2OUguNjM1YTIuMTM1LDIuMTM1LDAsMCwxLDAtNC4yNjloMjQwLjVhMi4xMzUsMi4xMzUsMCwwLDEsMCw0LjI2OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk1My4yNTUgNjI1LjY1MikiIGZpbGw9IiMwOTA4MTQiLz48cGF0aCBkPSJNMjQxLjEzMSwyLjc2OUguNjM1YTIuMTM1LDIuMTM1LDAsMCwxLDAtNC4yNjloMjQwLjVhMi4xMzUsMi4xMzUsMCwwLDEsMCw0LjI2OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk1My4yNTUgNjQzLjcyOSkiIGZpbGw9IiMwOTA4MTQiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NjguMTgxIDY3Ni4xNikiPjxyZWN0IHdpZHRoPSI0NjkiIGhlaWdodD0iMTA3IiByeD0iOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC41NjkgMC4zNjcpIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjI5OSIvPjxwYXRoIGQ9Ik0xMS4zODQsMi44NDZhOC41NDgsOC41NDgsMCwwLDAtOC41MzgsOC41MzhWOTYuNzY4YTguNTQ4LDguNTQ4LDAsMCwwLDguNTM4LDguNTM4SDQ1OC4yMjRhOC41NDgsOC41NDgsMCwwLDAsOC41MzgtOC41MzhWMTEuMzg0YTguNTQ4LDguNTQ4LDAsMCwwLTguNTM4LTguNTM4SDExLjM4NG0wLTIuODQ2SDQ1OC4yMjRhMTEuMzg0LDExLjM4NCwwLDAsMSwxMS4zODQsMTEuMzg0Vjk2Ljc2OGExMS4zODQsMTEuMzg0LDAsMCwxLTExLjM4NCwxMS4zODRIMTEuMzg0QTExLjM4NCwxMS4zODQsMCwwLDEsMCw5Ni43NjhWMTEuMzg0QTExLjM4NCwxMS4zODQsMCwwLDEsMTEuMzg0LDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIiBmaWxsPSIjMDkwODE0Ii8+PHBhdGggZD0iTTYyMy4wODcsNDc0Ljc0MWE5Ljk3Myw5Ljk3MywwLDAsMS05Ljk2MS05Ljk2MVY0MzkuMTY1YTkuOTYxLDkuOTYxLDAsMCwxLDE5LjkyMywwVjQ2NC43OEE5Ljk3Myw5Ljk3MywwLDAsMSw2MjMuMDg3LDQ3NC43NDFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTcwLjc2NCAtMzk4LjA0KSIgZmlsbD0iIzZjNjNmZiIvPjxwYXRoIGQ9Ik02NDMuMDg3LDQ3NC43NDFhOS45NzMsOS45NzMsMCwwLDEtOS45NjEtOS45NjFWNDM5LjE2NWE5Ljk2MSw5Ljk2MSwwLDAsMSwxOS45MjMsMFY0NjQuNzhhOS45NzMsOS45NzMsMCwwLDEtOS45NjIsOS45NjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYyLjMwMyAtMzk4LjA0KSIgZmlsbD0iIzZjNjNmZiIvPjxwYXRoIGQ9Ik02NjMuMDg3LDQ3NC43NDFhOS45NzMsOS45NzMsMCwwLDEtOS45NjEtOS45NjFWNDM5LjE2NWE5Ljk2MSw5Ljk2MSwwLDAsMSwxOS45MjMsMFY0NjQuNzhBOS45NzMsOS45NzMsMCwwLDEsNjYzLjA4Nyw0NzQuNzQxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU1My44NDIgLTM5OC4wNCkiIGZpbGw9IiNmMmYyZjIiLz48cGF0aCBkPSJNNjgzLjA4Nyw0NzQuNzQxYTkuOTczLDkuOTczLDAsMCwxLTkuOTYyLTkuOTYxVjQzOS4xNjVhOS45NjEsOS45NjEsMCwwLDEsMTkuOTIzLDBWNDY0Ljc4YTkuOTczLDkuOTczLDAsMCwxLTkuOTYxLDkuOTYxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU0NS4zODEgLTM5OC4wNCkiIGZpbGw9IiM2YzYzZmYiLz48cGF0aCBkPSJNMjQxLjEzMSwyLjc2OUguNjM1YTIuMTM1LDIuMTM1LDAsMCwxLDAtNC4yNjloMjQwLjVhMi4xMzUsMi4xMzUsMCwwLDEsMCw0LjI2OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4NS40ODggMzguMDY2KSIgZmlsbD0iIzA5MDgxNCIvPjxwYXRoIGQ9Ik0yNDEuMTMxLDIuNzY5SC42MzVhMi4xMzUsMi4xMzUsMCwwLDEsMC00LjI2OWgyNDAuNWEyLjEzNSwyLjEzNSwwLDAsMSwwLDQuMjY5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg1LjQ4OCA1Ni4xNDMpIiBmaWxsPSIjMDkwODE0Ii8+PHBhdGggZD0iTTI0MS4xMzEsMi43NjlILjYzNWEyLjEzNSwyLjEzNSwwLDAsMSwwLTQuMjY5aDI0MC41YTIuMTM1LDIuMTM1LDAsMCwxLDAsNC4yNjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxODUuNDg4IDc0LjIyKSIgZmlsbD0iIzA5MDgxNCIvPjwvZz48cGF0aCBkPSJNNjIzLjA4Nyw0NzQuNzQxYTkuOTczLDkuOTczLDAsMCwxLTkuOTYxLTkuOTYxVjQzOS4xNjVhOS45NjEsOS45NjEsMCwwLDEsMTkuOTIzLDBWNDY0Ljc4QTkuOTczLDkuOTczLDAsMCwxLDYyMy4wODcsNDc0Ljc0MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5Ny4wMDMgMzgyLjAwMykiIGZpbGw9IiM2YzYzZmYiLz48cGF0aCBkPSJNNjQzLjA4Nyw0NzQuNzQxYTkuOTczLDkuOTczLDAsMCwxLTkuOTYxLTkuOTYxVjQzOS4xNjVhOS45NjEsOS45NjEsMCwwLDEsMTkuOTIzLDBWNDY0Ljc4YTkuOTczLDkuOTczLDAsMCwxLTkuOTYyLDkuOTYxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjA1LjQ2NCAzODIuMDAzKSIgZmlsbD0iIzZjNjNmZiIvPjxwYXRoIGQ9Ik02NjMuMDg3LDQ3NC43NDFhOS45NzMsOS45NzMsMCwwLDEtOS45NjEtOS45NjFWNDM5LjE2NWE5Ljk2MSw5Ljk2MSwwLDAsMSwxOS45MjMsMFY0NjQuNzhBOS45NzMsOS45NzMsMCwwLDEsNjYzLjA4Nyw0NzQuNzQxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjEzLjkyNSAzODIuMDAzKSIgZmlsbD0iIzZjNjNmZiIvPjxwYXRoIGQ9Ik02ODMuMDg3LDQ3NC43NDFhOS45NzMsOS45NzMsMCwwLDEtOS45NjItOS45NjFWNDM5LjE2NWE5Ljk2MSw5Ljk2MSwwLDAsMSwxOS45MjMsMFY0NjQuNzhhOS45NzMsOS45NzMsMCwwLDEtOS45NjEsOS45NjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMjIuMzg2IDM4Mi4wMDMpIiBmaWxsPSIjZjJmMmYyIi8+PHBhdGggZD0iTTI0MS4xMzEsMi43NjlILjYzNWEyLjEzNSwyLjEzNSwwLDAsMSwwLTQuMjY5aDI0MC41YTIuMTM1LDIuMTM1LDAsMCwxLDAsNC4yNjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5NTMuMjU1IDgxOC4xMDkpIiBmaWxsPSIjMDkwODE0Ii8+PHBhdGggZD0iTTI0MS4xMzEsMi43NjlILjYzNWEyLjEzNSwyLjEzNSwwLDAsMSwwLTQuMjY5aDI0MC41YTIuMTM1LDIuMTM1LDAsMCwxLDAsNC4yNjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5NTMuMjU1IDgzNi4xODYpIiBmaWxsPSIjMDkwODE0Ii8+PHBhdGggZD0iTTI0MS4xMzEsMi43NjlILjYzNWEyLjEzNSwyLjEzNSwwLDAsMSwwLTQuMjY5aDI0MC41YTIuMTM1LDIuMTM1LDAsMCwxLDAsNC4yNjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5NTMuMjU1IDg1NC4yNjMpIiBmaWxsPSIjMDkwODE0Ii8+PC9nPjwvc3ZnPg=="
                alt=""
              />
            </div>
            <div className="maintenance-empty-title">Under Maintenance</div>
            <div className="maintenance-empty-description">
              We&apos;re currently performing scheduled maintenance. We should be back shortly. Thank you for your patience.
            </div>
          </div>

          <div className="maintenance-empty-content">
            <div className="maintenance-buttons">
              <button className="maintenance-button maintenance-btn-outline" id="checkStatusBtn">Check Status</button>
              <button className="maintenance-button maintenance-btn-solid" id="refreshBtn">Refresh Page</button>
            </div>
            <div className="maintenance-status" id="statusLine">
              <span className="dot"></span>
              <span>Status: <span className="label">Offline</span></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const PROJECT_STEPS = [
  { id: "brief", label: "You send the brief", meta: "Day 0" },
  { id: "draft", label: "Working draft built", meta: "Day 2" },
  { id: "revise", label: "Revisions", meta: "Day 3" },
  { id: "launch", label: "Site goes live", meta: "Day 4" },
];

function ProcessDemo() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const wait = current >= PROJECT_STEPS.length ? 2600 : 1300;
    const t = setTimeout(
      () => setCurrent((c) => (c >= PROJECT_STEPS.length ? 0 : c + 1)),
      wait,
    );
    return () => clearTimeout(t);
  }, [current]);

  return (
    <motion.div
      whileHover={{ y: -8, rotate: -1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface/80 backdrop-blur px-5 pt-4 pb-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-border">
        <span className="size-2 rounded-full bg-white/60" />
        <span className="size-2 rounded-full bg-white/40" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-[11px] text-muted-2">
          brief → live
        </span>
      </div>
      <TaskSteps steps={PROJECT_STEPS} current={current} label="Project timeline" />
    </motion.div>
  );
}

function NavBar() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const goToSignIn = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const destination = event.currentTarget.href;
    setIsTransitioning(true);
    window.setTimeout(() => { window.location.href = destination; }, 420);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-background/65 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45"
    >
      {isTransitioning && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-background" />}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#hero" className="flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold tracking-tight text-foreground">
          <img src="/logo.png" alt="Unevn Studios" className="size-6" />
          Unevn Studios
        </a>
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm text-muted-foreground">
          <a href="#process" className="hover:text-foreground transition-colors">Process</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials-heading" className="hover:text-foreground transition-colors">Clients</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button size="sm" asChild className="rounded-full">
            <a href="/login" onClick={goToSignIn}>Sign in</a>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen bg-[#101010] px-6 py-24 text-center text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl flex-col items-center justify-center border border-white/[0.04] bg-[#0b0b0b] px-6 py-16 shadow-2xl">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-[var(--font-display)] text-[clamp(7rem,22vw,13rem)] font-bold leading-none tracking-[-0.08em]"
        >
          404
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-8 space-y-3"
        >
          <h1 className="font-[var(--font-display)] text-xl font-semibold">Page not found</h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-5">
            <Button asChild>
              <a href="/">Go home</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/#process">Browse pages</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:items-start">
        <div>
          <div className="flex items-center gap-2 font-[var(--font-display)] text-base font-semibold text-foreground">
            <img src="/logo.png" alt="Unevn Studios" className="size-5" />
            Unevn Studios
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-2">
            Websites, built plainly, priced fairly — from $100 CAD.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-2">Contact</p>
          <div className="mt-4 flex flex-col items-start gap-2 font-mono text-sm">
            <a href="mailto:hello@unevnstudios.ca" className="text-muted-foreground transition-colors hover:text-foreground">hello@unevnstudios.ca</a>
            <a href="mailto:legal@unevnstudios.ca" className="text-muted-foreground transition-colors hover:text-foreground">legal@unevnstudios.ca</a>
          </div>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-2">Explore</p>
          <div className="mt-4 flex flex-col items-start gap-2 font-mono text-sm md:items-end">
            <a href="#process" className="text-muted-foreground transition-colors hover:text-foreground">Process</a>
            <a href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <a href="#testimonials-heading" className="text-muted-foreground transition-colors hover:text-foreground">Clients</a>
            <a href="#hero" className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">Back to top <ArrowUpRight className="size-3.5" /></a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default function App() {
  const path = window.location.pathname;

  if (path === "/preview") {
    return (
      <>
        <PixelHero
          word1="Silent"
          word2="Precision."
          description="Interfaces with refined motion. Every calculated detail delivers an elevated digital experience."
          primaryCta="Explore Design"
          primaryCtaMobile="Explore"
          secondaryCta="View GitHub"
          secondaryCtaMobile="GitHub"
          githubUrl="https://github.com"
        />
        <AnimatedTestimonials
          testimonials={[
            {
              id: 1,
              name: "Alex Johnson",
              role: "Full Stack Developer",
              company: "TechFlow",
              content:
                "This starter template saved me weeks of setup time. The Supabase integration is flawless, and the UI components are beautiful and easy to customize. Worth every penny!",
              rating: 5,
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              id: 2,
              name: "Sarah Miller",
              role: "Frontend Engineer",
              company: "DesignHub",
              content:
                "I've used many starter templates, but this one stands out for its clean architecture and attention to detail. The TypeScript support is excellent, and the documentation is comprehensive.",
              rating: 5,
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              id: 3,
              name: "Michael Chen",
              role: "Product Manager",
              company: "InnovateLabs",
              content:
                "Our team was able to launch our MVP in record time thanks to this template. The authentication flow and user management features worked right out of the box. Highly recommended!",
              rating: 5,
              avatar: "https://randomuser.me/api/portraits/men/46.jpg",
            },
          ]}
          trustedCompanies={["Google", "Microsoft", "Airbnb", "Spotify", "Netflix"]}
        />
      </>
    );
  }

  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  useEffect(() => {
    const disableContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);
    return () => document.removeEventListener("contextmenu", disableContextMenu);
  }, []);

  if (["/start-a-project", "/help", "/docs"].includes(path)) {
    return <NotFound />;
  }

  if (path === "/consultation") {
    return <MultistepForm />;
  }

  if (path === "/login" || path === "/sign-in") {
    return <AuthForm plan={new URLSearchParams(window.location.search).get("plan") || "your project"} />;
  }

  if (path === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <WaitlistHero />

      <motion.section
        id="process"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14 } },
        }}
        className="relative px-6 py-24"
      >
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 text-center md:text-left"
          >
            <div className="inline-flex rounded-3xl border border-border px-4 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              How it runs
            </div>
            <TextBlockAnimation blockColor="#ffffff" duration={0.7}>
              <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Brief to live site, in days
              </h2>
            </TextBlockAnimation>
            <TextBlockAnimation blockColor="#555555" stagger={0.06}>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                No discovery calls, no decks. Send what the site's for, see a
                working draft within days, and get a couple of quick revision
                rounds before it goes live.
              </p>
            </TextBlockAnimation>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0, x: 40, rotate: 2 }, visible: { opacity: 1, x: 0, rotate: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProcessDemo />
          </motion.div>
        </div>
      </motion.section>

      <Pricing />

      <TestimonialsSection />

      <Footer />
    </div>
  );
}
