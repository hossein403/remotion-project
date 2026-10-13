import React from 'react';
import {Composition} from 'remotion';
import {MrChera, TOTAL_FRAMES} from './MrChera';
import {FPS} from './settings';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MrChera"
      component={MrChera}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
