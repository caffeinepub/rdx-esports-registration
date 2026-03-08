import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { AlertTriangle, Home, Link2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

type RedirectState = "loading" | "redirecting" | "not_found" | "error";

export function RedirectPage() {
  const { code } = useParams({ strict: false }) as { code: string };
  const { actor, isFetching } = useActor();
  const [state, setState] = useState<RedirectState>("loading");
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const resolved = useRef(false);

  useEffect(() => {
    if (!actor || isFetching || resolved.current) return;
    if (!code) {
      setState("not_found");
      return;
    }

    resolved.current = true;

    actor
      .resolveShortUrl(code)
      .then((url) => {
        if (url) {
          setTargetUrl(url);
          setState("redirecting");
          window.location.replace(url);
        } else {
          setState("not_found");
        }
      })
      .catch(() => {
        setState("error");
      });
  }, [actor, isFetching, code]);

  return (
    <div
      className="min-h-screen bg-dark-base flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 40%, oklch(0.55 0.25 22 / 0.06) 0%, transparent 60%), radial-gradient(circle at 80% 80%, oklch(0.78 0.18 75 / 0.04) 0%, transparent 50%)",
      }}
    >
      <div className="text-center max-w-md space-y-6">
        {/* Logo mark */}
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{
            background: "oklch(0.78 0.18 75 / 0.1)",
            border: "2px solid oklch(0.78 0.18 75 / 0.3)",
            boxShadow: "0 0 30px oklch(0.78 0.18 75 / 0.15)",
          }}
        >
          <Link2 className="w-7 h-7 text-gold" />
        </div>

        {/* Loading state */}
        {(state === "loading" || state === "redirecting") && (
          <motion.div
            data-ocid="redirect.loading_state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
            <h1 className="font-display font-black uppercase tracking-widest text-xl text-foreground">
              {state === "redirecting" ? "Redirecting…" : "Looking up link…"}
            </h1>
            {targetUrl && (
              <p className="text-xs text-muted-foreground font-mono truncate max-w-sm mx-auto">
                → {targetUrl}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              You will be redirected automatically.
            </p>
          </motion.div>
        )}

        {/* Not found state */}
        {state === "not_found" && (
          <motion.div
            data-ocid="redirect.error_state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div
              className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
              style={{
                background: "oklch(0.577 0.245 27 / 0.1)",
                border: "2px solid oklch(0.577 0.245 27 / 0.4)",
              }}
            >
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display font-black uppercase tracking-widest text-2xl text-foreground">
                Link Not Found
              </h1>
              <p className="text-sm text-muted-foreground">
                The short link{" "}
                <code
                  className="font-mono px-1.5 py-0.5 rounded text-xs"
                  style={{
                    background: "oklch(0.18 0.01 270)",
                    color: "oklch(0.88 0.18 80)",
                    border: "1px solid oklch(0.25 0.04 270)",
                  }}
                >
                  /r/{code}
                </code>{" "}
                does not exist or has been deleted.
              </p>
            </div>
            <Button
              asChild
              data-ocid="redirect.home.button"
              className="font-display font-bold uppercase tracking-widest text-sm transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.88 0.20 80))",
                color: "oklch(0.1 0 0)",
                border: "none",
                boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.3)",
              }}
            >
              <a href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </a>
            </Button>
          </motion.div>
        )}

        {/* Error state */}
        {state === "error" && (
          <motion.div
            data-ocid="redirect.error_state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h1 className="font-display font-black uppercase tracking-widest text-2xl text-foreground">
                Something Went Wrong
              </h1>
              <p className="text-sm text-muted-foreground">
                Could not resolve this link. Please try again later.
              </p>
            </div>
            <Button
              asChild
              data-ocid="redirect.home.button"
              className="font-display font-bold uppercase tracking-widest text-sm transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.88 0.20 80))",
                color: "oklch(0.1 0 0)",
                border: "none",
              }}
            >
              <a href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </a>
            </Button>
          </motion.div>
        )}

        {/* Branding */}
        <p className="text-[11px] text-muted-foreground/50 font-display uppercase tracking-widest">
          RDX ESPORTS — URL Shortener
        </p>
      </div>
    </div>
  );
}
