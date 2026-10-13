import React from 'react';
import {AbsoluteFill, Audio, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {CAMERA_SPEED, CLIPS, Clip, CROSSFADE, FPS, Glow, HAS_VOICE} from './settings';

const STARTS: number[] = [];
let acc = 0;
for (const c of CLIPS) {
  STARTS.push(acc);
  acc += c.seconds;
}
export const TOTAL_SECONDS = acc;
export const TOTAL_FRAMES = Math.round(acc * FPS);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const GlowView: React.FC<{glow: Glow; t: number; frame: number; index: number}> = ({glow, t, frame, index}) => {
  let o = glow.base;
  if (glow.mode === 'steady') {
    o = glow.base + 0.08 * Math.sin(t * 7) + (random('flick-' + frame + '-' + index) - 0.5) * 0.06;
  } else if (glow.mode === 'pulse') {
    o = glow.base + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 0.8 + index * 1.3));
  } else {
    o = glow.base * 1.4 * Math.max(0, Math.sin(t * 2 * Math.PI * 1.4));
  }
  const [r, g, b] = glow.color;
  return (
    <div
      style={{
        position: 'absolute',
        left: glow.x + '%',
        top: glow.y + '%',
        width: glow.w + '%',
        height: glow.h + '%',
        background: `radial-gradient(closest-side, rgba(${r},${g},${b},0.8), rgba(${r},${g},${b},0))`,
        mixBlendMode: 'screen',
        opacity: clamp01(o),
        pointerEvents: 'none',
      }}
    />
  );
};

const FLAKES = Array.from({length: 140}, (_, i) => ({
  x: random('sx' + i) * 100,
  y: random('sy' + i) * 100,
  v: 5 + random('sv' + i) * 9, // % of the height per second
  r: 1.5 + random('sr' + i) * 2.5, // px
  p: random('sp' + i) * 6.28,
}));

const Snow: React.FC<{t: number}> = ({t}) => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {FLAKES.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: ((((f.x + 1.3 * Math.sin(t * 1.3 + f.p)) % 100) + 100) % 100) + '%',
            top: ((f.y + f.v * t) % 100) + '%',
            width: f.r * 2,
            height: f.r * 2,
            borderRadius: '50%',
            background: 'white',
            opacity: 0.85,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const ClipView: React.FC<{clip: Clip; index: number; t: number; frame: number}> = ({clip, index, t, frame}) => {
  const start = STARTS[index] - CROSSFADE / 2;
  const end = STARTS[index] + clip.seconds + CROSSFADE / 2;
  if (t < start || t > end) {
    return null;
  }
  const last = index === CLIPS.length - 1;
  const fadeIn = index > 0 ? (t - start) / CROSSFADE : t / 1.0;
  const fadeOut = !last ? (end - t) / CROSSFADE : (TOTAL_SECONDS - t) / 1.0;
  const opacity = clamp01(Math.min(fadeIn, fadeOut));
  const u = (t - start) / (end - start);
  const k = 0.5 - 0.5 * Math.cos(Math.PI * u); // gentle ease in/out
  const z = clip.z[0] + (clip.z[1] - clip.z[0]) * CAMERA_SPEED * k;
  const ox = clip.o[0][0] + (clip.o[1][0] - clip.o[0][0]) * CAMERA_SPEED * k;
  const oy = clip.o[0][1] + (clip.o[1][1] - clip.o[0][1]) * CAMERA_SPEED * k;
  const dx = Math.sin(t * 0.9) * 0.25 * CAMERA_SPEED;
  const dy = Math.cos(t * 0.7) * 0.2 * CAMERA_SPEED;
  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill
        style={{
          transformOrigin: `${ox}% ${oy}%`,
          transform: `translate(${dx}%, ${dy}%) scale(${z})`,
        }}
      >
        <Img src={staticFile(clip.file)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {(clip.glows || []).map((g, i) => (
          <GlowView key={i} glow={g} t={t} frame={frame} index={i} />
        ))}
      </AbsoluteFill>
      {clip.snow ? <Snow t={t} /> : null}
    </AbsoluteFill>
  );
};

const Labels: React.FC<{t: number}> = ({t}) => {
  const items: React.ReactNode[] = [];
  CLIPS.forEach((clip, ci) => {
    (clip.labels || []).forEach((l, li) => {
      const a = STARTS[ci] + l.t0;
      const b = STARTS[ci] + l.t1;
      if (t < a || t > b) {
        return;
      }
      const op = clamp01(Math.min((t - a) / 0.4, (b - t) / 0.4));
      items.push(
        <Img key={ci + '-' + li} src={staticFile(l.file)} style={{position: 'absolute', left: l.x, top: l.y, opacity: op}} />
      );
    });
  });
  return <AbsoluteFill style={{pointerEvents: 'none'}}>{items}</AbsoluteFill>;
};

export const MrChera: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {CLIPS.map((clip, i) => (
        <ClipView key={clip.file} clip={clip} index={i} t={t} frame={frame} />
      ))}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Labels t={t} />
      {HAS_VOICE ? <Audio src={staticFile('voice.mp3')} /> : null}
    </AbsoluteFill>
  );
};
