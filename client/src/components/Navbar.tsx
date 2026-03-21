import { Cancel01Icon, Menu02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-outline-variant/10">
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
                <Link
                    to={"/"}
                    className="flex gap-2 text-2xl font-bold tracking-tighter text-on-surface"
                >
                    <img
                        src="/assets/factube_logo.png"
                        width={50}
                        height={50}
                    />
                    <span>
                        Fact
                        <span className="font-medium">Tube</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-tertiary-container hover:text-primary transition-colors duration-300 text-sm font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className="text-tertiary-container hover:text-primary transition-colors duration-300 text-sm font-medium"
                    >
                        About
                    </Link>
                </div>

                <motion.button
                    className="md:hidden text-on-surface"
                    onClick={() => setMenuOpen(!menuOpen)}
                    animate={{ x: menuOpen ? 2 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <HugeiconsIcon
                        icon={menuOpen ? Cancel01Icon : Menu02Icon}
                        size={24}
                    />
                </motion.button>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -12,
                                filter: "blur(8px)",
                            }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 22,
                                mass: 0.8,
                            }}
                            className="absolute top-full right-6 mt-2 w-48 bg-white rounded-xl ring-1 ring-outline-variant/15 shadow-xl overflow-hidden z-50 md:hidden"
                        >
                            <Link
                                to="/"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center px-5 py-4 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
                            >
                                Home
                            </Link>
                            <div className="h-px bg-outline-variant/10" />
                            <Link
                                to="/about"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center px-5 py-4 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
                            >
                                About
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
