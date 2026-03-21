import Innertube from "youtubei.js";

export async function getVideoDetails(video_id: string) {
    // console.log("vid id: ", video_id);
    const youtube = await Innertube.create();
    const vidInfo = await youtube.getInfo(video_id);
    // console.log("got sum");
    return vidInfo;
}
