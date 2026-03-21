import Innertube from "youtubei.js";

export default async function fetchVideoDetails({
    video_id,
}: {
    video_id: string;
}) {
    const youtube = await Innertube.create();
    const info = await youtube.getInfo(video_id);
    return info;
}
