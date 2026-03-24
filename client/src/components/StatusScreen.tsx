// src/components/StatusScreen.tsx
import { motion } from "motion/react";

type StatusScreenProps = {
    type: "loading" | "error";
    message: string;
    reason?: string;
};

export default function StatusScreen({
    type,
    message,
    reason,
}: StatusScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-100 gap-3"
        >
            {type === "loading" ?
                <div className="w-8 h-8 border-8 border-gray-200 border-t-primary rounded-full animate-spin" />
            :   <div className="w-18 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-12 h-2 rounded-full bg-primary" />
                </div>
            }
            <p className="text-sm font-medium text-text">{message}</p>
            {reason && (
                <p className="text-xs text-text max-w-sm text-center">
                    {reason}
                </p>
            )}
        </motion.div>
    );
}
