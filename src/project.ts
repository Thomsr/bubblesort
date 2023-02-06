import {makeProject} from '@motion-canvas/core/lib';
import Intro from '../audio/intro.mp4'
import intro from './scenes/intro?scene';
import example1 from './scenes/example1?scene'

export default makeProject({
  scenes: [
    intro,
    example1
  ],
  background: '#141414',
  audio: Intro,
});
 