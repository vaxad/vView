import BackBtn from "@/components/BackBtn";
import VideoDetails from "@/components/VideoDetails";
import Player from "@/components/VideoPlayer";

export default function Page() {
    
  return (
    <div className="flex flex-col relative">
      <BackBtn/>
      <div className=" flex flex-row">
  <Player />
  <VideoDetails/>
  </div>
   </div>
  )
}
