import { Menu02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-outline-variant/10">
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
                <Link
                    to={"/"}
                    className="text-2xl font-bold tracking-tighter text-on-surface"
                >
                    FactTube
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

                <button className="md:hidden text-on-surface">
                    <HugeiconsIcon icon={Menu02Icon} size={24} />
                </button>
            </div>
        </nav>
    );
}
