import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50">
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 max-h-[92%] rounded-t-[2rem] glass-strong shadow-float flex flex-col"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-white/15" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-6 pt-2 pb-3">
                <div className="text-lg font-semibold">{title}</div>
                <button onClick={onClose} className="w-9 h-9 rounded-full glass flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto no-scrollbar px-6 pb-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
