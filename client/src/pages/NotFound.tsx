import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
        >
            <p className="text-8xl font-bold text-gray-200 select-none mb-0 leading-none">
                404
            </p>
            <h1 className="text-xl font-medium text-gray-900 mt-2 mb-2">
                Page not found
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-8">
                The page you're looking for doesn't exist or may have been
                moved.
            </p>
            <Link
                to="/"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors"
            >
                ← Back to home
            </Link>
        </motion.div>
    );
}
