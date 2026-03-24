import { Link01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const steps = [
    {
        title: "Paste a YouTube URL",
        desc: "Drop in any YouTube video link. Factube extracts the video ID and checks if it has already been analyzed.",
    },
    {
        title: "Transcript is fetched",
        desc: "The full video transcript is retrieved automatically, including timestamps for every segment.",
    },
    {
        title: "Claims are extracted",
        desc: "An AI model reads through the transcript and identifies hard factual claims — statistics, dates, scientific statements, and attributions. Jokes, opinions, and filler are ignored.",
    },
    {
        title: "Each claim is verified",
        desc: "Every claim is cross-checked and assigned a verdict with an explanation and source link where available.",
    },
    {
        title: "Results are cached",
        desc: "Once analyzed, results are saved. Any future visitor gets the result instantly — no re-processing needed.",
    },
];

const verdicts = [
    {
        label: "True",
        style: "bg-green-50 text-green-900",
        desc: "The claim is factually accurate and supported by evidence.",
    },
    {
        label: "False",
        style: "bg-red-50 text-red-900",
        desc: "The claim is factually incorrect based on available knowledge.",
    },
    {
        label: "Misleading",
        style: "bg-amber-50 text-amber-900",
        desc: "The claim has some truth but is framed in a deceptive or incomplete way.",
    },
    {
        label: "Unverifiable",
        style: "bg-gray-100 text-gray-600",
        desc: "The claim cannot be confirmed or denied with available sources.",
    },
];

const limitations = [
    "Videos without captions or auto-generated transcripts cannot be analyzed.",
    "AI verdicts reflect the model's knowledge cutoff and may not account for very recent events.",
    "Satire and clearly comedic content may occasionally be misidentified as factual claims.",
    "Factube is a research aid, not a replacement for independent verification on critical topics.",
];

export default function About() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto px-5 py-10"
        >
            {/* hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-3">
                    <img
                        src="/assets/factube_logo.png"
                        width={50}
                        height={50}
                    />
                    <span className="text-xl font-medium text-gray-900">
                        FactTube
                    </span>
                </div>
                <p className="text-sm text-text/80 leading-relaxed">
                    Factube automatically fact-checks YouTube videos by
                    analyzing their transcripts and verifying claims against
                    trusted sources — so you don't have to do the research
                    yourself.
                </p>
            </motion.div>

            <hr className="border-text mb-8" />

            {/* how it works */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <p className="text-xs font-medium text-text/90 uppercase tracking-wider mb-4">
                    How it works
                </p>
                <div className="divide-y divide-gray-100">
                    {steps.map((step, i) => (
                        <div key={i} className="flex gap-4 py-4">
                            <div className="w-6 h-6 rounded-full bg-background-dark flex items-center justify-center text-xs font-medium text-text shrink-0 mt-0.5">
                                {i + 1}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text/90 mb-1">
                                    {step.title}
                                </p>
                                <p className="text-sm text-text/80 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <hr className="border-text mb-8" />

            {/* verdict types */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8"
            >
                <p className="text-xs font-medium text-text/90 uppercase tracking-wider mb-4">
                    Verdict types
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {verdicts.map((v) => (
                        <div
                            key={v.label}
                            className="bg-white/80 rounded-lg p-3"
                        >
                            <span
                                className={`inline-block text-xs font-medium px-2 py-0.5 rounded mb-2 ${v.style}`}
                            >
                                {v.label}
                            </span>
                            <p className="text-xs text-text/80 leading-relaxed">
                                {v.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>

            <hr className="border-text mb-8" />

            {/* limitations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <p className="text-xs font-medium text-text/90 uppercase tracking-wider mb-4">
                    Limitations
                </p>
                <ul className="space-y-2">
                    {limitations.map((l, i) => (
                        <li
                            key={i}
                            className="flex gap-3 text-sm text-text/80 leading-relaxed"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-background-dark shrink-0 mt-2" />
                            {l}
                        </li>
                    ))}
                </ul>
            </motion.div>

            <hr className="border-text mb-8" />

            {/* contact */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-8"
            >
                <p className="text-xs font-medium text-text/90 uppercase tracking-wider mb-4">
                    Get in touch
                </p>
                <p className="text-sm text-text/80 leading-relaxed mb-4">
                    Factube is an open-source side project. If you've found a
                    bug, have a feature idea, or just want to say hi — the
                    GitHub repo is the best place to reach out.
                </p>
                <Link
                    to="https://github.com/smiky0/factube"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
                >
                    <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">
                            GitHub — smiky0/factube
                        </p>
                        <p className="text-xs text-text/60">
                            Source code, issues, and contributions
                        </p>
                    </div>
                    <HugeiconsIcon icon={Link01Icon} />
                </Link>
                <p className="text-xs text-text/80 leading-relaxed mt-4">
                    For bug reports or feature requests, please open an issue on
                    GitHub rather than sending a direct message — it keeps
                    things organized and lets others follow along too.
                </p>
            </motion.div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-text/80">
                    Built to make information more trustworthy.
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {[
                        "Hono",
                        "React",
                        "Gemini",
                        "Supabase",
                        "youtubei.js",
                        "TypeScript",
                    ].map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-text/60"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
