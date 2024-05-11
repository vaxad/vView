import {create} from 'zustand';
import { videos } from './constants';

const videoStore = create(set => ({
  currentVideo: videos[0],
  prevVids: [],
  nextVids: videos.slice(1),
  setCurrentVideo: (video) => set(state => (
    { prevVids: [state.currentVideo,...state.prevVids.filter((item)=>item!==state.currentVideo)],
      nextVids: [...state.nextVids.filter((item)=>item!==video), state.currentVideo],
      currentVideo: video}
)),
  fullScreen: false,
  setFullScreen: (val) => set(state => (
    {
      fullScreen: val
    }
  )),
  miniPlayer: false,
  setMiniPlayer: (val) => set(state => (
    {
      miniPlayer:val
    }
  ))
}));

export default videoStore;