import { User } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Innertube } from "youtubei.js";
import StatusScreen from "./StatusScreen";
const BASE_URL = import.meta.env.VITE_BASE_URL;
type VideoInfo = Awaited<ReturnType<Innertube["getInfo"]>>;

export default function VideoDetails({ video_id }: { video_id: string }) {
    const [info, setInfo] = useState<VideoInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [exception, setException] = useState<string>();
    useEffect(() => {
        const response = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${BASE_URL}/api/video_details?q=${video_id}`,
                );
                if (!res.ok) {
                    setException(res.statusText);
                }
                const data = await res.json();
                setInfo(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
                // console.log("HERE");
            }
        };
        response();
    }, [video_id]);

    if (loading)
        return (
            <StatusScreen
                type="loading"
                message="Fetching data from YouTube..."
            />
        );
    if (!loading && !info)
        return (
            <StatusScreen
                type="error"
                message="No video data found."
                reason={exception}
            />
        );
    return (
        <section className="mt-32 flex flex-col lg:flex-row gap-12 items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-8 group"
            >
                <div className="relative max-w-xl rounded-2xl overflow-hidden bg-background-dark ring-1 ring-background-dark aspect-video shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                    <img
                        src={
                            info?.basic_info?.thumbnail?.[0]?.url ||
                            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt="Video thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded text-[12px] font-mono uppercase tracking-widest text-white">
                        {info?.basic_info?.like_count || "0"} Likes
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-4 space-y-8"
            >
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-text leading-snug">
                        {info?.basic_info.title || "Title Not Found"}
                    </h2>
                    <div className="flex items-center gap-3 pt-2">
                        <div className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center">
                            <HugeiconsIcon icon={User} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text/90">
                                {info?.basic_info.author || "Unknown"}
                            </p>
                            <p className="text-[12px] font-mono text-text/80 uppercase">
                                {info?.secondary_info?.owner?.subscriber_count
                                    .text || "0 Subscribers"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/80 rounded-xl ring-1 ring-background-dark">
                        <p className="font-mono text-[12px] text-text/90 uppercase mb-1 font-semibold">
                            Views
                        </p>
                        <p className="text-xl font-bold text-text/80">
                            {info?.basic_info.view_count || "0"}
                        </p>
                    </div>
                    <div className="p-4 bg-white/80 rounded-xl ring-1 ring-background-dark">
                        <p className="font-mono text-[12px] text-text/90 uppercase mb-1">
                            Published
                        </p>
                        <p className="text-xl font-bold text-text/80">
                            {info?.primary_info?.published.text || "0"}
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
