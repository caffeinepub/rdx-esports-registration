import { Button } from "@/components/ui/button";
import { Calendar, Hash, RotateCcw, Trophy, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Registration } from "../backend";

interface ConfirmationCardProps {
  registration: Registration;
  onRegisterAnother: () => void;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function ConfirmationCard({
  registration,
  onRegisterAnother,
}: ConfirmationCardProps) {
  const logoUrl = registration.teamLogoUrl?.getDirectURL();

  return (
    <div
      data-ocid="registration.success_state"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "oklch(0.06 0 0 / 0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-md"
      >
        {/* Certificate card */}
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.14 0.02 270) 0%, oklch(0.10 0.005 270) 100%)",
            border: "1px solid oklch(0.78 0.18 75 / 0.5)",
            boxShadow:
              "0 0 60px oklch(0.78 0.18 75 / 0.25), 0 0 120px oklch(0.78 0.18 75 / 0.1), inset 0 1px 0 oklch(0.78 0.18 75 / 0.3)",
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/60 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold/60 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold/60 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/60 rounded-br-lg" />

          {/* Top strip */}
          <div
            className="h-2 w-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.55 0.25 22), oklch(0.78 0.18 75), oklch(0.55 0.25 22))",
            }}
          />

          <div className="p-8 space-y-6">
            {/* Trophy icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="flex justify-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.78 0.18 75 / 0.2), oklch(0.78 0.18 75 / 0.05))",
                  border: "2px solid oklch(0.78 0.18 75 / 0.6)",
                  boxShadow: "0 0 20px oklch(0.78 0.18 75 / 0.4)",
                }}
              >
                <Trophy className="w-8 h-8 text-gold" />
              </div>
            </motion.div>

            {/* Main heading */}
            <div className="text-center space-y-1">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-xl font-black uppercase tracking-widest text-gold glow-text-gold"
              >
                THANK YOU FOR
              </motion.h2>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-2xl font-black uppercase tracking-widest text-gold glow-text-gold"
              >
                REGISTERING
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-muted-foreground uppercase tracking-widest mt-1"
              >
                RDX ESPORTS TOURNAMENT
              </motion.p>
            </div>

            {/* Divider */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.18 75 / 0.5), transparent)",
              }}
            />

            {/* Registration ID */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 p-3 rounded"
              style={{
                background: "oklch(0.78 0.18 75 / 0.08)",
                border: "1px solid oklch(0.78 0.18 75 / 0.3)",
              }}
            >
              <Hash className="w-4 h-4 text-gold flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Registration ID
                </p>
                <p className="font-display font-bold text-gold text-lg tracking-wider">
                  {registration.id}
                </p>
              </div>
            </motion.div>

            {/* Team info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Team Logo"
                  className="w-14 h-14 rounded object-cover border-2 border-gold/30"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded flex items-center justify-center"
                  style={{
                    background: "oklch(0.55 0.25 22 / 0.2)",
                    border: "2px solid oklch(0.55 0.25 22 / 0.4)",
                  }}
                >
                  <Users className="w-6 h-6 text-crimson" />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Team Name
                </p>
                <p className="font-display font-bold text-foreground text-lg uppercase">
                  {registration.teamName}
                </p>
              </div>
            </motion.div>

            {/* Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3"
            >
              <Calendar className="w-4 h-4 text-gold/60" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Registered On
                </p>
                <p className="text-sm text-foreground font-medium">
                  {formatDate(registration.registeredAt)}
                </p>
              </div>
            </motion.div>

            {/* Divider */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.18 75 / 0.3), transparent)",
              }}
            />

            {/* Footer signature */}
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                Designed by NAVEEN
              </p>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={onRegisterAnother}
                className="w-full font-display font-bold uppercase tracking-widest"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.25 22), oklch(0.45 0.22 22))",
                  border: "1px solid oklch(0.62 0.28 18 / 0.5)",
                  color: "oklch(0.98 0.005 85)",
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Register Another Team
              </Button>
            </motion.div>
          </div>

          {/* Bottom strip */}
          <div
            className="h-2 w-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.55 0.25 22), oklch(0.78 0.18 75), oklch(0.55 0.25 22))",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
