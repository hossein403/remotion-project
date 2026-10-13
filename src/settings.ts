// ===================== SETTINGS (edit these) =====================
export const FPS = 30;
export const CAMERA_SPEED = 0.7; // 1 = original camera speed, 0.7 = 30% slower
export const CROSSFADE = 0.6; // seconds of fade between clips
export const HAS_VOICE = false; // set to true after adding public/voice.mp3
// =================================================================

export type RGB = [number, number, number];
export type Glow = {
  x: number; // left, % of the picture
  y: number; // top, %
  w: number; // width, %
  h: number; // height, %
  color: RGB;
  base: number; // brightness 0..1
  mode: 'steady' | 'pulse' | 'siren';
};
export type Label = {file: string; t0: number; t1: number; x: number; y: number}; // t0/t1 = seconds from the start of the clip; x/y in px on a 1920x1080 frame
export type Clip = {
  file: string; // picture in the public/ folder
  seconds: number; // length of this clip
  z: [number, number]; // zoom start -> end
  o: [[number, number], [number, number]]; // focus point in %, start -> end
  glows?: Glow[];
  snow?: boolean;
  labels?: Label[];
};

export const CLIPS: Clip[] = [
  {
    // panel 13 (12 s): the map with three pins - slow push-in, pulsing red pins, three "reason" labels
    file: 'p13.png',
    seconds: 12,
    z: [1.0, 1.25],
    o: [[50, 55], [55, 45]],
    glows: [
      {x: 66, y: 10, w: 9, h: 16, color: [255, 70, 60], base: 0.35, mode: 'pulse'},
      {x: 28.8, y: 26, w: 9, h: 16, color: [255, 70, 60], base: 0.35, mode: 'pulse'},
      {x: 54.7, y: 49, w: 9, h: 16, color: [255, 70, 60], base: 0.35, mode: 'pulse'},
    ],
    labels: [
      {file: 'label_r1.png', t0: 3.0, t1: 5.6, x: 60, y: 860},
      {file: 'label_r2.png', t0: 5.7, t1: 8.6, x: 60, y: 860},
      {file: 'label_r3.png', t0: 8.7, t1: 12.0, x: 60, y: 860},
    ],
  },
  {
    // panel 14 (10 s): quarantine street - slow pan right to left, falling snow, flickering street lamps
    file: 'p14.png',
    seconds: 10,
    z: [1.2, 1.2],
    o: [[70, 55], [35, 55]],
    snow: true,
    glows: [
      {x: 37, y: 0, w: 11, h: 19, color: [255, 190, 80], base: 0.22, mode: 'steady'},
      {x: 45.5, y: 13, w: 9, h: 17, color: [255, 190, 80], base: 0.22, mode: 'steady'},
      {x: 65, y: 14, w: 8, h: 15, color: [255, 190, 80], base: 0.22, mode: 'steady'},
    ],
    labels: [{file: 'label_q.png', t0: 0.4, t1: 5.0, x: 60, y: 860}],
  },
  {
    // panel 15 (10 s): airport screening - slow push-in, blinking red siren
    file: 'p15.png',
    seconds: 10,
    z: [1.0, 1.3],
    o: [[50, 60], [50, 50]],
    glows: [{x: 47, y: 9, w: 10, h: 18, color: [255, 40, 40], base: 0.6, mode: 'siren'}],
    labels: [{file: 'label_a.png', t0: 0.4, t1: 4.6, x: 60, y: 860}],
  },
];
