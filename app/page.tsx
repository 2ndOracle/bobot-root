"use client";

import { useEffect, useRef, useState } from "react";

const stierlitzJokes = [
  "Штирлиц выстрелил вслепую. Слепая упала.",
  "Штирлиц всю ночь топил печь. Наутро печь утонула.",
  "Штирлиц подошёл к окну. Из окна дуло. Штирлиц закрыл дуло газетой.",
  "Штирлиц шёл по лесу и увидел голубые ели. Голубые не только ели, но и пили.",
];

type Ladybug = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  phase: number;
};

function LadybugSwarm({ inverted }: { inverted: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const textColor = "#b7ff00";
    const bugs: Ladybug[] = [];
    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;
    let width = 0;
    let height = 0;

    const arrangeParticles = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const nextBugs: Ladybug[] = [];
      const count = 22;
      const bugSize = Math.max(17, Math.min(width * 0.057, 25));
      const clusterCenterX = width * (width < 700 ? 0.5 : 0.46);
      const clusterWidth = Math.min(width * (width < 700 ? 0.68 : 0.42), 440);
      const clusterCenterY = height * 0.79;

      for (let index = 0; index < count; index += 1) {
        const column = index % 11;
        const row = Math.floor(index / 11);
        const targetX =
          clusterCenterX - clusterWidth / 2 + (clusterWidth / 10) * column;
        const targetY =
          clusterCenterY + (row - 0.5) * bugSize * 2.1 + (column % 2) * 4;
        const previous = bugs[index];
        nextBugs.push({
          x: previous?.x ?? targetX + (Math.random() - 0.5) * 80,
          y: previous?.y ?? targetY + (Math.random() - 0.5) * 70,
          targetX,
          targetY,
          velocityX: previous?.velocityX ?? 0,
          velocityY: previous?.velocityY ?? 0,
          size: bugSize * (0.86 + (index % 3) * 0.1),
          phase: index * 0.73,
        });
      }

      bugs.splice(0, bugs.length, ...nextBugs);
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };

    const releasePointer = () => {
      pointer.active = false;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      context.save();
      context.fillStyle = textColor;
      context.font = `800 ${Math.min(width * 0.14, 56)}px Arial, Helvetica, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        "КОРОВКИ",
        width * (width < 700 ? 0.5 : 0.46),
        height * 0.79,
      );
      context.restore();

      bugs.forEach((bug, bugIndex) => {
        const crawlX = Math.sin(time * 0.0014 + bug.phase) * 5;
        const crawlY = Math.cos(time * 0.0017 + bug.phase) * 4;
        bug.velocityX += (bug.targetX + crawlX - bug.x) * 0.01;
        bug.velocityY += (bug.targetY + crawlY - bug.y) * 0.01;

        if (pointer.active) {
          const deltaX = bug.x - pointer.x;
          const deltaY = bug.y - pointer.y;
          const distance = Math.max(Math.hypot(deltaX, deltaY), 1);
          const reach = 120;

          if (distance < reach) {
            const force = ((reach - distance) / reach) * 3.1;
            bug.velocityX += (deltaX / distance) * force;
            bug.velocityY += (deltaY / distance) * force;
          }
        }

        bug.velocityX *= 0.92;
        bug.velocityY *= 0.92;
        bug.x += bug.velocityX;
        bug.y += bug.velocityY;

        const edge = bug.size;
        if (bug.x < edge || bug.x > width - edge) {
          bug.x = Math.max(edge, Math.min(width - edge, bug.x));
          bug.velocityX *= -0.6;
        }
        if (bug.y < edge || bug.y > height - edge) {
          bug.y = Math.max(edge, Math.min(height - edge, bug.y));
          bug.velocityY *= -0.6;
        }

        const angle =
          Math.atan2(bug.velocityY, bug.velocityX) +
          Math.PI / 2 +
          Math.sin(time * 0.001 + bugIndex) * 0.08;

        context.save();
        context.translate(bug.x, bug.y);
        context.rotate(angle);
        context.lineCap = "round";
        context.strokeStyle = "#171714";
        context.lineWidth = Math.max(1.2, bug.size * 0.075);

        [-0.3, 0.3].forEach((legPosition) => {
          context.beginPath();
          context.moveTo(-bug.size * 0.42, legPosition * bug.size);
          context.quadraticCurveTo(
            -bug.size * 0.66,
            legPosition * bug.size,
            -bug.size * 0.72,
            legPosition * bug.size + bug.size * 0.16,
          );
          context.stroke();
          context.beginPath();
          context.moveTo(bug.size * 0.42, legPosition * bug.size);
          context.quadraticCurveTo(
            bug.size * 0.66,
            legPosition * bug.size,
            bug.size * 0.72,
            legPosition * bug.size + bug.size * 0.16,
          );
          context.stroke();
        });

        context.fillStyle = "#171714";
        context.beginPath();
        context.ellipse(0, 0, bug.size * 0.61, bug.size * 0.7, 0, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "#ff5a4b";
        context.beginPath();
        context.ellipse(-bug.size * 0.23, bug.size * 0.06, bug.size * 0.37, bug.size * 0.56, -0.14, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.ellipse(bug.size * 0.23, bug.size * 0.06, bug.size * 0.37, bug.size * 0.56, 0.14, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "#171714";
        context.beginPath();
        context.arc(0, -bug.size * 0.61, bug.size * 0.34, 0, Math.PI * 2);
        context.fill();

        [
          [-0.28, -0.09],
          [-0.22, 0.3],
          [0.28, -0.09],
          [0.22, 0.3],
        ].forEach(([spotX, spotY]) => {
          context.beginPath();
          context.arc(spotX * bug.size, spotY * bug.size, bug.size * 0.09, 0, Math.PI * 2);
          context.fill();
        });

        context.strokeStyle = "#171714";
        context.lineWidth = Math.max(1, bug.size * 0.06);
        [-1, 1].forEach((side) => {
          context.beginPath();
          context.moveTo(side * bug.size * 0.13, -bug.size * 0.82);
          context.quadraticCurveTo(
            side * bug.size * 0.28,
            -bug.size * 1.02,
            side * bug.size * 0.42,
            -bug.size * 0.94,
          );
          context.stroke();
          context.fillStyle = "#171714";
          context.beginPath();
          context.arc(
            side * bug.size * 0.42,
            -bug.size * 0.94,
            bug.size * 0.055,
            0,
            Math.PI * 2,
          );
          context.fill();
        });

        context.fillStyle = "#ffffff";
        [-1, 1].forEach((side) => {
          context.beginPath();
          context.arc(side * bug.size * 0.13, -bug.size * 0.68, bug.size * 0.09, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = "#171714";
          context.beginPath();
          context.arc(side * bug.size * 0.13, -bug.size * 0.68, bug.size * 0.038, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = "#ffffff";
        });

        context.strokeStyle = "rgba(255,255,255,0.6)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(-bug.size * 0.13, -bug.size * 0.3);
        context.quadraticCurveTo(-bug.size * 0.28, 0, -bug.size * 0.21, bug.size * 0.24);
        context.stroke();
        context.restore();
      });

      frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(arrangeParticles);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerdown", updatePointer);
    canvas.addEventListener("pointerleave", releasePointer);
    canvas.addEventListener("pointerup", releasePointer);
    arrangeParticles();
    frame = window.requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerdown", updatePointer);
      canvas.removeEventListener("pointerleave", releasePointer);
      canvas.removeEventListener("pointerup", releasePointer);
      window.cancelAnimationFrame(frame);
    };
  }, [inverted]);

  return (
    <div className="ladybug-toy">
      <canvas
        ref={canvasRef}
        className="ladybug-canvas"
        aria-label="Божьи коровки закрывают надпись «Коровки» и разбегаются от курсора."
      >
        Коровки
      </canvas>
    </div>
  );
}

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [oddMode, setOddMode] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      cursorRef.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursorRef.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <main className={oddMode ? "site odd-mode" : "site"}>
      <div className="cursor-glow" ref={cursorRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="BOBOT — наверх">
          BOBOT<span>®</span>
        </a>
        <p className="location">53.2° N / 50.1° E</p>
        <button
          className="mode-switch"
          type="button"
          aria-pressed={oddMode}
          onClick={() => setOddMode((value) => !value)}
        >
          <span className="status-dot" />
          {oddMode ? "серьёзность выключена" : "compiling..."}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>
            Играю со
            <br />
            <span className="serif">ШРИФТАМИ</span>
            <br />
            в интернете
            <span className="period">.</span>
          </h1>
        </div>

        <LadybugSwarm inverted={oddMode} />
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...stierlitzJokes, ...stierlitzJokes].map((joke, index) => (
            <span className="ticker-joke" key={`${joke}-${index}`}>
              {joke}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <section className="projects" aria-labelledby="projects-heading">
        <div className="projects-intro">
          <p className="section-number">01 / ПРОЕКТЫ</p>
          <h2 id="projects-heading">Проекты</h2>
        </div>

        <a
          className="project-card project-card-main"
          href="https://propose.bobot.click"
          target="_blank"
          rel="noreferrer"
        >
          <div className="card-top">
            <span className="card-status">● ЗАКРЫТ</span>
            <span className="card-year">2026</span>
          </div>
          <div className="card-body">
            <p className="card-kicker">SaaS / B2B / AI</p>
            <h3>Propose</h3>
            <p>
              AI-сервис для создания коммерческих предложений. Проект закрыт в сентябре 2026 года.
            </p>
          </div>
          <div className="card-footer">
            <span>О проекте</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </div>
        </a>

        <a
          className="project-card project-card-sellsync"
          href="https://sellsync.bobot.click"
          target="_blank"
          rel="noreferrer"
        >
          <div className="card-top">
            <span className="card-status">● LIVE</span>
            <span className="card-year">2026</span>
          </div>
          <div className="card-body">
            <p className="card-kicker">GOOGLE SHEETS ADD-ON / WB + OZON</p>
            <h3>SellSync</h3>
            <p>
              WB и Ozon в одной таблице.
              <br />
              Бесплатно.
            </p>
          </div>
          <div className="card-footer">
            <span>Открыть проект</span>
            <span className="arrow" aria-hidden="true">↗</span>
          </div>
        </a>

      </section>

      <footer>
        <p>© 2026 Александр</p>
      </footer>
    </main>
  );
}
