import React, { useEffect, useRef } from "react";
import logoImg from "../img/logo.png"; // Import your logo image
import "./ChemixIntro.css"; // Ensure ChemixIntro.css is in the same folder

const ChemixIntro = ({ onComplete }) => {
  const stageRef = useRef(null);
  const logoRef = useRef(null);
  const shadowRef = useRef(null);
  const textBlockRef = useRef(null);
  const solidTextRef = useRef(null);
  const hollowTextRef = useRef(null);
  const byTextRef = useRef(null);
  const brandTextRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    const shadow = shadowRef.current;
    const solidText = solidTextRef.current;
    const hollowText = hollowTextRef.current;
    const stage = stageRef.current;
    const textBlock = textBlockRef.current;

    const byText = byTextRef.current;
    const brandText = brandTextRef.current;
    const tagline = taglineRef.current;

    if (!stage || !logo) return;

    const stageRect = stage.getBoundingClientRect();
    const LOGO_W = 60;
    const STAGE_W = stageRect.width || 360;

    const FLOOR_Y = 20;
    const START_Y = -380;
    const LOGO_X = 0;

    const GRAVITY = 0.9;
    const DECAY = 0.4;
    const SQUASH_SPD = 0.55;
    const SQUASH_AMT = 0.009;
    const STOP_VEL = 1.5;

    let posY = START_Y;
    let velY = 0;
    let squashing = false;
    let squashT = 0;
    let settled = false;
    let animationFrameId = null;

    const moveLogo = (y, sx, sy) => {
      if (!logo) return;
      logo.style.top = y + "px";
      logo.style.left = LOGO_X + "px";
      logo.style.transform = `scaleX(${sx.toFixed(4)}) scaleY(${sy.toFixed(4)})`;
    };

    const moveShadow = (y, sx) => {
      if (!shadow) return;
      const dist = Math.abs(y - FLOOR_Y);
      const total = Math.abs(START_Y);
      const r = Math.max(0, 1 - dist / total);
      shadow.style.opacity = (r * 0.55).toFixed(3);
      shadow.style.transform = `scaleX(${Math.min(r * sx, 1).toFixed(3)}) scaleY(${(0.2 + r * 0.8).toFixed(3)})`;
    };

    const tweenX = (from, to, ms, rotA, rotB, passNumber, done) => {
      let t0 = null;
      const textRect = textBlock.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      const textLeft = textRect.left - stageBox.left;
      const textWidth = textRect.width;

      const step = (ts) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / ms, 1);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

        const currentX = from + (to - from) * e;
        logo.style.left = currentX.toFixed(1) + "px";
        logo.style.transform = `rotate(${(rotA + (rotB - rotA) * e).toFixed(1)}deg)`;

        if (passNumber === 1) {
          const logoRightEdge = currentX + LOGO_W;
          const textProgress = (logoRightEdge - textLeft) / textWidth;
          const clampedPct = Math.max(0, Math.min(100, textProgress * 100)).toFixed(1);
          solidText.style.clipPath = `polygon(0 0, ${clampedPct}% 0, ${clampedPct}% 100%, 0 100%)`;
        } else if (passNumber === 2) {
          const logoLeftEdge = currentX;
          const textProgress = (logoLeftEdge - textLeft) / textWidth;
          const clampedPct = Math.max(0, Math.min(100, textProgress * 100)).toFixed(1);
          solidText.style.clipPath = `polygon(0 0, ${clampedPct}% 0, ${clampedPct}% 100%, 0 100%)`;
          hollowText.style.clipPath = `polygon(${clampedPct}% 0, 100% 0, 100% 100%, ${clampedPct}% 100%)`;
        }

        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          if (done) done();
        }
      };
      requestAnimationFrame(step);
    };

    const scan = () => {
      const PASS = 1300;
      const startX = LOGO_X;
      const endX = STAGE_W - LOGO_W;

      logo.style.top = FLOOR_Y + "px";
      logo.style.transformOrigin = "center center";

      /* Pass 1 */
      tweenX(startX, endX, PASS, 0, 360, 1, () => {
        /* Pass 2 */
        tweenX(endX, startX, PASS, 360, 720, 2, () => {
          shadow.style.transition = "opacity 0.5s";
          shadow.style.opacity = "0";

          setTimeout(() => {
            logo.style.transition = "opacity 0.5s";
            logo.style.opacity = "0";

            tagline.style.opacity = "1";
            byText.classList.add("fade-in");

            setTimeout(() => {
              brandText.classList.add("bounce-in-rainbow");

              /* Final Step: Scale up text and trigger onComplete */
              setTimeout(() => {
                stage.classList.add("scale-up");

                /* Fade out intro overlay after scale up to reveal main app */
                setTimeout(() => {
                  if (onComplete) onComplete();
                }, 1000);
              }, 600);
            }, 150);
          }, 200);
        });
      });
    };

    const afterLand = () => {
      shadow.style.opacity = "0.45";
      setTimeout(scan, 320);
    };

    const tick = () => {
      if (settled) return;

      if (!squashing) {
        velY += GRAVITY;
        posY += velY;

        if (posY >= FLOOR_Y) {
          posY = FLOOR_Y;
          if (velY > STOP_VEL) {
            squashing = true;
            squashT = 0;
          } else {
            velY = 0;
            moveLogo(FLOOR_Y, 1, 1);
            moveShadow(FLOOR_Y, 1);
            settled = true;
            afterLand();
            return;
          }
        }

        moveLogo(posY, 1, 1);
        moveShadow(posY, 1);
      } else {
        squashT += SQUASH_SPD;
        const sf = Math.sin(squashT) * (velY * SQUASH_AMT);
        moveLogo(FLOOR_Y, 1 + sf, 1 - sf);
        moveShadow(FLOOR_Y, 1 + sf);

        if (squashT >= Math.PI) {
          squashing = false;
          velY = -Math.abs(velY) * DECAY;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    const start = () => {
      logo.style.opacity = "1";
      moveLogo(START_Y, 1, 1);
      animationFrameId = requestAnimationFrame(tick);
    };

    if (logo.complete && logo.naturalWidth > 0) {
      start();
    } else {
      logo.onload = start;
      logo.onerror = start;
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <div className="intro-body">
      <div id="stage" ref={stageRef}>
        <div id="shadow" ref={shadowRef}></div>
        <img id="logo" ref={logoRef} src={logoImg} alt="Chemix Logo" />

        <div id="textBlock" ref={textBlockRef}>
          <h1 className="title" id="solidText" ref={solidTextRef}>
            CHEMIX-<span>ENCYCLOPEDIA</span>
          </h1>
          <h1 className="title" id="hollowText" ref={hollowTextRef}>
            CHEMIX-<span>ENCYCLOPEDIA</span>
          </h1>
        </div>

        <div id="tagline" ref={taglineRef}>
          <span className="by-text" id="byText" ref={byTextRef}>
            By
          </span>
          <span className="brand-text" id="brandText" ref={brandTextRef}>
            TimedCoder
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChemixIntro;
