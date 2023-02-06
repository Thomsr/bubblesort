import {makeProject} from '@motion-canvas/core/lib';
import Intro from '../audio/intro.mp4'
import intro from './scenes/intro?scene';
import bubblesortIntro from './scenes/bubblesortIntro?scene';
import Example1 from './scenes/Examples/bubblesort1?scene'

export default makeProject({
  scenes: [
    intro,
    bubblesortIntro,
    Example1 
  ],
  background: '#141414',
  audio: Intro,
});
 