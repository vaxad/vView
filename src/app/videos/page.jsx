import MiniPlayer from '@/components/MiniPlayer';

import VideoCard from '@/components/VideoCard';
import { videos } from '@/utils/constants';

export default function Page() {

  return (
    <div>
      <div className=' flex flex-col gap-2 p-6'>
        <h1 className='text-3xl font-bold'>Videos</h1>
        <p className=' text-lg'>Browse through videos</p>
      </div>
      <div className='  grid grid-cols-1 md:grid-cols-3 gap-2 p-4'>
        {videos.map((item, idx)=>{
            return(
                <VideoCard key={idx} filePath={item}/>
            )
        })}
        </div>
    <MiniPlayer/>
    </div>
  )
}
