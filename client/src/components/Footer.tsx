import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-surface-container-lowest w-full py-6 px-8 border-t border-outline-variant/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
                <div className="text-lg font-bold text-on-surface">
                    FactTube
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-tertiary-container">
                    © {new Date().getFullYear()} FactTube
                </p>
                <div className="flex gap-8">
                    <Link
                        to="https://github.com/Smiky0/Factube/blob/main/LICENSE"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-widest text-tertiary-container hover:text-primary transition-colors"
                    >
                        LICENSE
                    </Link>
                </div>
            </div>
        </footer>
    );
}
