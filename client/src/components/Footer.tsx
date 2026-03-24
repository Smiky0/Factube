import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-background-dark w-full py-6 px-8 border-t border-text/60">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
                <span className="font-semibold text-secondary">
                    Fact
                    <span className="font-medium text-text">Tube</span>
                </span>
                <p className="font-mono text-xs uppercase tracking-widest text-tertiary-container">
                    © {new Date().getFullYear()} FactTube
                </p>
                <div className="flex gap-8">
                    <Link
                        to="https://github.com/Smiky0/Factube/blob/main/LICENSE"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[12px] uppercase tracking-widest text-text hover:text-secondary transition-colors"
                    >
                        LICENSE
                    </Link>
                </div>
            </div>
        </footer>
    );
}
