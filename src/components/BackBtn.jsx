"use client"

import videoStore from "@/utils/zustand";
import { useRouter } from "next/navigation"

export default function BackBtn() {
    const router = useRouter();
    const {fullScreen, setFullScreen} = videoStore();
  return !fullScreen?(
    <div className=" py-4 px-6">
    <button className=" p-3 rounded-full bg-slate-50" onClick={()=>router.back()}>
    <img width="20" height="20" className="pr-1" src="https://img.icons8.com/ios-filled/50/000000/back.png" alt="back"/>
    </button>
    </div>
  ):(
    <></>
  )
}
