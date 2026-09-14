'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './IntroCanvasScrubber.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 300;
const BATCH_SIZE = 30;

function frameSrc(index: number): string {
  return `/intro-sequence/frame_${String(index + 1).padStart(3, '0')}.webp`;
}

interface IntroCanvasScrubberProps {
  children?: React.ReactNode;
}

export default function IntroCanvasScrubber({ children }: IntroCanvasScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const webAppLayerRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef<number>(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [mounted, setMounted] = useState(false);

  // Cover-fit canvas draw logic
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Find requested frame or fallback to nearest loaded frame
    let img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = frameIdx - offset;
        const next = frameIdx + offset;
        if (prev >= 0 && imagesRef.current[prev]?.complete && imagesRef.current[prev]!.naturalWidth > 0) {
          img = imagesRef.current[prev];
          break;
        }
        if (next < TOTAL_FRAMES && imagesRef.current[next]?.complete && imagesRef.current[next]!.naturalWidth > 0) {
          img = imagesRef.current[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Aspect-ratio cover calculation
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Resize canvas to fill viewport with device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initially hide navbar during intro animation
    document.documentElement.style.setProperty('--intro-nav-opacity', '0');
    document.documentElement.style.setProperty('--intro-nav-pointer', 'none');
    document.documentElement.style.setProperty('--intro-nav-transform', 'translateY(-100%)');

    handleResize();

    // 1. Preload frame 0 immediately for instant render
    const frame0 = new Image();
    frame0.src = frameSrc(0);
    frame0.onload = () => {
      imagesRef.current[0] = frame0;
      drawFrame(0);
    };

    // 2. Preload frames 1-30 in first batch
    for (let i = 1; i < Math.min(BATCH_SIZE, TOTAL_FRAMES); i++) {
      const img = new Image();
      img.src = frameSrc(i);
      const idx = i;
      img.onload = () => {
        imagesRef.current[idx] = img;
        if (currentFrameRef.current === idx) {
          drawFrame(idx);
        }
      };
    }

    // 3. Stream background preloading in batches of 30 with small timeouts
    let currentBatch = 1;
    const totalBatches = Math.ceil(TOTAL_FRAMES / BATCH_SIZE);

    const loadNextBatch = () => {
      if (currentBatch >= totalBatches) return;
      const start = currentBatch * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, TOTAL_FRAMES);

      for (let i = start; i < end; i++) {
        if (imagesRef.current[i]) continue;
        const img = new Image();
        img.src = frameSrc(i);
        const idx = i;
        img.onload = () => {
          imagesRef.current[idx] = img;
          if (currentFrameRef.current === idx) {
            drawFrame(idx);
          }
        };
      }

      currentBatch++;
      if (currentBatch < totalBatches) {
        setTimeout(loadNextBatch, 40);
      }
    };

    const streamTimer = setTimeout(loadNextBatch, 150);

    // 4. Initialize GSAP ScrollTrigger
    const container = containerRef.current;
    const pinnedWrapper = pinnedWrapperRef.current;

    if (container && pinnedWrapper) {
      triggerRef.current = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedWrapper,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(p * (TOTAL_FRAMES - 1)))
          );

          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }

          // 5. Seamless Homepage Fade-In at ~85%-90%:
          // At 85%-90%, camera settles in front of reception desk logo:
          // Apply smooth blur to canvas, and fade in the homepage layer (Hero) & navbar
          if (p >= 0.85) {
            const t = Math.min(1, (p - 0.85) / 0.12);
            const blurVal = t * 20;

            if (canvasRef.current) {
              canvasRef.current.style.filter = `blur(${blurVal.toFixed(1)}px) brightness(${(1 - t * 0.2).toFixed(2)})`;
            }
            if (backdropRef.current) {
              backdropRef.current.style.backdropFilter = `blur(${blurVal.toFixed(1)}px)`;
              backdropRef.current.style.backgroundColor = `rgba(13, 10, 9, ${(t * 0.35).toFixed(2)})`;
            }
            if (webAppLayerRef.current) {
              webAppLayerRef.current.style.opacity = String(t.toFixed(3));
              webAppLayerRef.current.style.pointerEvents = t >= 0.9 ? 'auto' : 'none';
            }

            // Simultaneously fade in navbar
            document.documentElement.style.setProperty('--intro-nav-opacity', String(t.toFixed(3)));
            document.documentElement.style.setProperty('--intro-nav-pointer', t >= 0.9 ? 'auto' : 'none');
            document.documentElement.style.setProperty('--intro-nav-transform', `translateY(${((1 - t) * -15).toFixed(1)}px)`);
          } else {
            if (canvasRef.current) {
              canvasRef.current.style.filter = 'none';
            }
            if (backdropRef.current) {
              backdropRef.current.style.backdropFilter = 'none';
              backdropRef.current.style.backgroundColor = 'transparent';
            }
            if (webAppLayerRef.current) {
              webAppLayerRef.current.style.opacity = '0';
              webAppLayerRef.current.style.pointerEvents = 'none';
            }

            // Keep navbar completely hidden during animation
            document.documentElement.style.setProperty('--intro-nav-opacity', '0');
            document.documentElement.style.setProperty('--intro-nav-pointer', 'none');
            document.documentElement.style.setProperty('--intro-nav-transform', 'translateY(-100%)');
          }
        },
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(streamTimer);
      window.removeEventListener('resize', handleResize);
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      // Reset navbar styles when navigating away
      document.documentElement.style.removeProperty('--intro-nav-opacity');
      document.documentElement.style.removeProperty('--intro-nav-pointer');
      document.documentElement.style.removeProperty('--intro-nav-transform');
    };
  }, [mounted, drawFrame, handleResize]);

  return (
    <div ref={containerRef} className={styles.introContainer} id="intro-sequence">
      <div ref={pinnedWrapperRef} className={styles.pinnedWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        
        {/* Backdrop blur layer */}
        <div ref={backdropRef} className={styles.backdropFilterLayer} />

        {/* Homepage UI layer (Hero) that fades in smoothly at 85%-90% */}
        <div ref={webAppLayerRef} className={styles.webAppLayer}>
          {children}
        </div>
      </div>
    </div>
  );
}
