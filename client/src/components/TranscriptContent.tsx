import { CheckmarkCircle03Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface Claim {
    id: number;
    claim: string;
    verdict: string;
    explanation: string;
    source: string | null;
    confidence: number;
    timestamp_seconds: number;
}

interface Facts {
    overall_verdict: string;
    summary: string;
    claims: Claim[];
    ignored: { timestamp_seconds: number; reason: string; text: string }[];
}

export default function TranscriptContent({ video_id }: { video_id: string }) {
    const [facts, setFacts] = useState<Facts | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    useEffect(() => {
        // console.log("video: ", video_id);
        const response = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/url?q=${video_id}`, {
                    method: "POST",
                });
                const data = await res.json();
                const conclusion =
                    typeof data.conclusion === "string" ?
                        JSON.parse(data.conclusion)
                    :   data.conclusion;

                setFacts(conclusion);
            } catch (err) {
                console.log(err);
            } finally {
                // console.log("facts", facts);
                setLoading(false);
            }
        };
        response();
    }, [video_id]);
    if (loading)
        return (
            <div className="flex justify-center items-center m-10">
                Fetching facts...{" "}
            </div>
        );
    if (!loading && !facts)
        return (
            <div className="flex justify-center items-center m-10">
                Unable to get facts checked.
            </div>
        );
    return (
        <section className="mt-32 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/10 pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-primary/60">
                            Powered by AI
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight">
                        Fact Check Results
                    </h3>
                    <p className="text-on-surface/50 text-sm max-w-md leading-relaxed">
                        Each claim in this video has been individually verified
                        and rated for accuracy.
                    </p>
                </div>
                <button
                    onClick={() => {
                        const text = facts?.claims
                            ?.map(
                                (c) =>
                                    `[${c.verdict.toUpperCase()}] ${c.claim}\n${c.explanation}`,
                            )
                            .join("\n\n");
                        navigator.clipboard
                            .writeText(
                                `Overall: ${facts?.overall_verdict}\n\n${facts?.summary}\n\n${text}`,
                            )
                            .then(() => {
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000); // reset after 2s
                            });
                    }}
                    className="group flex items-center gap-2 bg-surface-container-highest text-on-surface px-6 py-3 rounded-full hover:scale-[1.02] transition-all ring-1 ring-outline-variant/15 cursor-pointer"
                >
                    <HugeiconsIcon
                        icon={copied ? CheckmarkCircle03Icon : Copy01Icon}
                        size={14}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                        {copied ? "Copied!" : "Copy to Clipboard"}
                    </span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-surface-container-low rounded-2xl p-8 md:p-12 relative overflow-hidden"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

                <div className="relative space-y-8">
                    {/* Overall verdict + summary */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                    facts?.overall_verdict === "true" ?
                                        "bg-green-500/20 text-green-400"
                                    : facts?.overall_verdict === "false" ?
                                        "bg-red-500/20 text-red-400"
                                    :   "bg-yellow-500/20 text-yellow-400"
                                }`}
                            >
                                {facts?.overall_verdict === "true" ?
                                    "✓ Accurate"
                                : facts?.overall_verdict === "false" ?
                                    "✗ Inaccurate"
                                :   "⚠ Misleading"}
                            </span>
                            <span className="text-xs text-on-surface/40 font-mono uppercase tracking-widest">
                                Overall Verdict
                            </span>
                        </div>
                        <p className="text-on-surface/70 text-base md:text-lg leading-relaxed">
                            {facts?.summary}
                        </p>
                    </div>

                    <div className="h-px bg-outline-variant/20" />

                    {/* Claims */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-on-surface/40">
                            Claims Analyzed ({facts?.claims?.length})
                        </h3>
                        {facts?.claims?.map((claim) => (
                            <div
                                key={claim.id}
                                className="rounded-xl p-5 bg-surface-container-lowest ring-1 ring-outline-variant/15 space-y-2"
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                                            claim.verdict === "true" ?
                                                "bg-green-500/20 text-green-400"
                                            : claim.verdict === "false" ?
                                                "bg-red-500/20 text-red-400"
                                            :   "bg-yellow-500/20 text-yellow-400"
                                        }`}
                                    >
                                        {claim.verdict === "true" ?
                                            "True"
                                        : claim.verdict === "false" ?
                                            "False"
                                        :   "Misleading"}
                                    </span>
                                    <p className="text-on-surface/90 text-sm md:text-base font-medium leading-snug">
                                        {claim.claim}
                                    </p>
                                </div>

                                <p className="text-on-surface/50 text-sm leading-relaxed pl-1">
                                    {claim.explanation}
                                </p>

                                <div className="flex items-center justify-between pt-1">
                                    {claim.source ?
                                        <a
                                            href={claim.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] text-primary/70 hover:text-primary underline underline-offset-2 truncate max-w-[70%]"
                                        >
                                            {claim.source}
                                        </a>
                                    :   <span />}
                                    <span className="text-[10px] font-mono text-on-surface/30 shrink-0">
                                        {Math.round(claim.confidence * 100)}%
                                        confidence
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex items-center gap-3 p-4 bg-surface-container-lowest rounded-xl ring-1 ring-outline-variant/15 max-w-fit">
                    <HugeiconsIcon
                        icon={CheckmarkCircle03Icon}
                        size={18}
                        className="text-primary"
                    />
                    <p className="font-mono text-[10px] text-tertiary-container uppercase tracking-widest">
                        Analysis complete
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
