import { CheckmarkCircle03Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import StatusScreen from "./StatusScreen";
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
    const [exception, setException] = useState<string>();
    const [copied, setCopied] = useState<boolean>(false);
    useEffect(() => {
        // console.log("video: ", video_id);
        const response = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/url?q=${video_id}`, {
                    method: "POST",
                });
                // if status isnt 200
                if (!res.ok) {
                    // reutrn whatever server says.
                    setException(res.statusText);
                }
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
        return <StatusScreen type="loading" message="Fetching facts..." />;
    if (!loading && !facts)
        return (
            <StatusScreen
                type="error"
                message="Unable to check facts."
                reason={exception}
            />
        );
    return (
        <section className="mt-32 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-text pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[12px] uppercase tracking-widest bg-primary/20 px-3 py-0.3 rounded-full text-secondary/80">
                            Powered by AI
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-text/90 tracking-tight">
                        Fact Check Results
                    </h3>
                    <p className="text-text/80 text-sm max-w-2xl leading-relaxed">
                        Claims were extracted from the transcript and
                        cross-referenced against verified sources. AI can
                        occasionally miss nuance, always follow the source links
                        for full context.
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
                    className="group flex items-center gap-2 bg-background-dark/60 text-text px-6 py-3 rounded-full hover:scale-[1.02] transition-all ring-1 ring-text cursor-pointer"
                >
                    <HugeiconsIcon
                        icon={copied ? CheckmarkCircle03Icon : Copy01Icon}
                        size={14}
                    />
                    <span className="font-mono text-[12px] uppercase tracking-widest">
                        {copied ? "Copied!" : "Copy to Clipboard"}
                    </span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-background-dark/40 rounded-2xl p-8 md:p-12 relative overflow-hidden"
            >
                <div className="relative space-y-8">
                    {/* Overall verdict + summary */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                    facts?.overall_verdict === "true" ?
                                        "bg-green-500/20 text-green-700"
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
                            <span className="text-xs text-text/90 font-mono uppercase tracking-widest">
                                Overall Verdict
                            </span>
                        </div>
                        <p className="text-text/80 text-base md:text-lg leading-relaxed">
                            {facts?.summary}
                        </p>
                    </div>

                    <div className="h-px bg-outline-variant/20" />

                    {/* Claims */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-text/80">
                            Claims Analyzed ({facts?.claims?.length})
                        </h3>
                        {facts?.claims?.map((claim) => (
                            <div
                                key={claim.id}
                                className="rounded-xl p-5 bg-white/80 ring-1 ring-text/60 space-y-2"
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-0.5 shrink-0 px-2 py-0.5 rounded text-[12px] font-bold uppercase tracking-widest ${
                                            claim.verdict === "true" ?
                                                "bg-green-500/20 text-green-700"
                                            : claim.verdict === "false" ?
                                                "bg-red-500/20 text-red-700"
                                            :   "bg-yellow-500/20 text-yellow-700"
                                        }`}
                                    >
                                        {claim.verdict === "true" ?
                                            "True"
                                        : claim.verdict === "false" ?
                                            "False"
                                        :   "Misleading"}
                                    </span>
                                    <p className="text-text/90 text-sm md:text-base font-semibold leading-snug">
                                        {claim.claim}
                                    </p>
                                </div>

                                <p className="text-text/90 text-sm font-medium leading-relaxed pl-1">
                                    {claim.explanation}
                                </p>

                                <div className="flex items-center justify-between pt-1">
                                    {claim.source ?
                                        <a
                                            href={claim.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] text-secondary/80 hover:text-secondary underline underline-offset-2 truncate max-w-[70%]"
                                        >
                                            {claim.source}
                                        </a>
                                    :   <span />}
                                    <span className="text-[12px] font-mono text-text/80 shrink-0">
                                        {Math.round(claim.confidence * 100)}%
                                        confidence
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex items-center gap-3 p-4 bg-background rounded-xl ring-1 ring-text/80 max-w-fit">
                    <HugeiconsIcon
                        icon={CheckmarkCircle03Icon}
                        size={18}
                        className="text-secondary"
                    />
                    <p className="font-mono text-[12px] text-text/90 font-semibold uppercase tracking-widest">
                        Analysis complete
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
