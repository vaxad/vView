"use client"

import videoStore from "@/utils/zustand"
import Player from "./VideoPlayer";

export default function MiniPlayer() {
    const {miniPlayer} = videoStore();
  return miniPlayer?(
    <div className=" absolute bottom-0 right-0 w-[300px] aspect-video" >
        <Player miniPlayer={true}/>
    </div>
  ):(
    <></>
  )
}
