import { CheckmarkCircle03Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function TranscriptContent() {
    return (
        <section className="mt-32 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/10 pb-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">
                        AI Checked Facts.
                    </h3>
                    <p className="text-tertiary-container text-sm max-w-md">
                        Machine-generated refinement of the video content,
                        optimized for clarity and quick reading.
                    </p>
                </div>
                <button className="group flex items-center gap-2 bg-surface-container-highest text-on-surface px-6 py-3 rounded-full hover:scale-[1.02] transition-all ring-1 ring-outline-variant/15 cursor-pointer">
                    <HugeiconsIcon icon={Copy01Icon} size={14} />
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                        Copy to Clipboard
                    </span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-surface-container-low rounded-2xl p-8 md:p-12 relative overflow-hidden group"
            >
                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>

                <div className="relative space-y-8 text-on-surface/80 leading-relaxed text-base md:text-lg">
                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                        The evolution of digital design has brought us to a
                        point where the convergence of engineering precision and
                        artistic intuition is no longer a luxury, but a
                        necessity. In this comprehensive breakdown, we examine
                        the underlying structures that define the most
                        successful interfaces of the current decade. We begin by
                        looking at the concept of 'Invisible Scaffolding'—the
                        grid systems that guide the eye without ever being seen
                        by the user. These frameworks are built upon centuries
                        of typographic tradition, yet adapted for the
                        high-refresh-rate displays of the modern era.
                    </p>
                    <p>
                        Furthermore, the role of kinetic motion cannot be
                        overstated. When an element moves across a screen, it's
                        not merely an animation; it's a piece of communication.
                        It tells the user where they came from, where they are
                        going, and what the hierarchy of the current state truly
                        is. We observe this through the subtle easing of
                        transitions and the intentional use of spatial depth.
                        The layering of surfaces—what we often refer to as
                        'Tonal Elevation'—replaces the heavy drop shadows of the
                        past with a more sophisticated interplay of light and
                        material properties.
                    </p>
                    <p>
                        As we delve deeper into the metadata of user
                        interaction, we find that the most impactful tools are
                        those that prioritize the content above all else.
                        FactTube embodies this philosophy by stripping away the
                        noise of the global web and focusing the user's
                        attention on the distilled essence of the medium. By
                        leveraging these advanced architectural principles, we
                        create environments that feel both expansive and
                        intimate, allowing for a level of focus that is
                        increasingly rare in our hyper-connected world. The
                        ultimate goal is not just to build a tool, but to
                        architect an experience that resonates on a fundamental
                        human level through precise minimalism.
                    </p>
                    <p>
                        In conclusion, the path forward for digital architects
                        lies in the mastery of these subtle balances. Between
                        the loud and the quiet, the complex and the simple, the
                        machine and the human. As we continue to refine our
                        tools, we must remember that every pixel carries weight,
                        and every interaction is a silent dialogue between the
                        creator and the consumer.
                    </p>
                </div>

                <div className="mt-12 flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl ring-1 ring-outline-variant/15 max-w-fit">
                    {/* <CheckCircle2 size={18} className="text-primary" /> */}
                    <HugeiconsIcon icon={CheckmarkCircle03Icon} size={18} />
                    <p className="font-mono text-[10px] text-tertiary-container uppercase tracking-widest">
                        Analysis complete • 1,420 tokens processed
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
