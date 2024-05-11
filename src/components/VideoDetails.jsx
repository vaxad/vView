"use client"

import { extractVideoTitle, generateRandomColor } from "@/utils/constants"
import videoStore from "@/utils/zustand"
import { useEffect, useState } from "react"

const VideoDetails = () => {
    const { currentVideo, fullScreen, prevVids, nextVids } = videoStore()
    const [color, setColor] = useState("#000000")
    useEffect(() => {
        setColor(generateRandomColor())
    }, [currentVideo])

    return !fullScreen ? (
        <div className=" flex p-6 w-full md:w-1/3 rounded-lg">
            <div className=" flex flex-col p-6 w-full rounded-lg" style={{ backgroundColor: color }}>
                <h1 className=" text-2xl font-bold">Title:{" " + extractVideoTitle(currentVideo)}</h1>
                <div className=" flex flex-row justify-between items-center gap-2">
                    <h2 className=" text-base font-semibold">
                        Prev:{" " + extractVideoTitle(prevVids.length > 0 ? prevVids[0] : "-")}
                    </h2>
                    <h2 className=" text-base font-semibold">
                        Next:{" " + extractVideoTitle(nextVids.length > 0 ? nextVids[0] : "-")}
                    </h2>
                </div>
                <div className=" flex flex-row gap-4 py-3 justify-between">
                    <div className=" flex flex-col gap-1">
                        <h2 className=" text-lg font-semibold">Previous List:</h2>
                        {prevVids.map((item, idx) => {
                            return (
                                <h3 className=" text-sm " key={`${idx}-prevListItem`}>{extractVideoTitle(item)}</h3>
                            )
                        })}
                    </div>
                    <div className=" flex flex-col gap-1">
                        <h2 className=" text-lg font-semibold">Next List:</h2>
                        {nextVids.map((item, idx) => {
                            return (
                                <h3 className=" text-sm " key={`${idx}-nextListItem`}>{extractVideoTitle(item)}</h3>
                            )
                        })}
                    </div>
                </div>
                <div className=" h-full flex flex-col justify-end">
                    <h2 className=" text-xs w-full text-center">{"(This color is randomly generated)"}</h2>
                </div>
            </div>
        </div>
    ) : (
        <></>
    )
}

export default VideoDetails
