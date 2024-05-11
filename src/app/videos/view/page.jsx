import BackBtn from "@/components/BackBtn";
import VideoDetails from "@/components/VideoDetails";
import Player from "@/components/VideoPlayer";

export default function Page() {

  return (
    <div className="flex flex-col relative h-full">
      <BackBtn />
      <div className=" flex flex-col md:flex-row h-full">
        <Player />
        <VideoDetails />
      </div>
    </div>
  )
}
