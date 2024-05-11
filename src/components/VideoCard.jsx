"use client"
import { extractVideoTitle } from "@/utils/constants";
import videoStore from "@/utils/zustand"
import {useRouter} from "next/navigation"

const VideoCard = ({filePath}) => {
  const {setCurrentVideo, setMiniPlayer} = videoStore();
  const router= useRouter();
  return(
    <div onClick={()=>{
      setMiniPlayer(false)
      setCurrentVideo(filePath);
      router.push(`/videos/view`)
      console.log(filePath)
    }} className=" cursor-pointer px-6 py-4 w-full rounded-lg border bg-zinc-950 hover:bg-slate-50 text-slate-50 hover:text-zinc-950 transition-all border-slate-50 ">{extractVideoTitle(filePath)}</div>
  )
}

export default VideoCard