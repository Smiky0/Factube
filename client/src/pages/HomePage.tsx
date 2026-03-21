import React, { useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Link01Icon } from "@hugeicons/core-free-icons";
import VideoDetails from "../components/VideoDetails";
import TranscriptContent from "../components/TranscriptContent";
import Footer from "../components/Footer";
import { youtube_parser } from "../lib/youtubeParser";

export default function App() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<string>("");
    const [videoID, setVideoID] = useState<string>("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            const vid_id = youtube_parser(url);
            if (!vid_id) {
                setStatus("Invalid URL. Try putting a valid URL");
                return;
            } else {
                // console.log(vid_id);
                setVideoID(vid_id);
			}
			setStatus("")
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 max-w-7xl mx-auto px-6 md:px-8 py-16 lg:py-24 w-full">
                {/* Hero Section */}
                <section className="max-w-4xl mx-auto text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-on-surface leading-tight">
                            Refine your{" "}
                            <span className="text-primary">facts.</span>
                        </h1>
                        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-tertiary-container">
                            Streamline video analysis in seconds
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSearch}
                        className="relative group max-w-2xl mx-auto"
                    >
                        <div className="flex flex-col md:flex-row gap-4 p-2 bg-surface-container-low rounded-xl ring-1 ring-outline-variant/15 shadow-2xl shadow-black/20 focus-within:ring-primary/50 transition-all duration-300">
                            <div className="flex-1 flex items-center px-4">
                                <HugeiconsIcon
                                    icon={Link01Icon}
                                    size={18}
                                    className="mr-3"
                                />
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste YouTube URL here..."
                                    className="bg-transparent outline-none border-none focus:ring-0 w-full text-on-surface placeholder:text-tertiary-container/50 py-3 text-sm md:text-base"
                                />
                            </div>
                            <button
                                type="submit"
                                className="cta-gradient text-background font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 whitespace-nowrap"
                            >
                                <div className="flex group cursor-pointer">
                                    <span className="uppercase tracking-widest text-[10px] font-bold">
                                        Search
                                    </span>
                                    <HugeiconsIcon
                                        icon={ArrowRight02Icon}
                                        className="group-hover:translate-x-2 transition-all duration-300"
                                    />
                                </div>
                            </button>
                        </div>
                    </motion.form>
                </section>

                {/*  invalid url */}
                {status && (
                    <div className="flex justify-center items-center m-10 text-red-400">
                        {status}
                    </div>
                )}

                {/* Video Detail Section */}
                {videoID && <VideoDetails video_id={videoID} />}

                {/* Transcript/Content Block */}
                {videoID && <TranscriptContent video_id={videoID} />}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
