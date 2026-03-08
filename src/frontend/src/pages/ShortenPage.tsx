import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Home,
  Link2,
  Loader2,
  MousePointerClick,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ShortUrl } from "../backend";
import {
  useCreateShortUrl,
  useDeleteShortUrl,
  useListShortUrls,
} from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function truncateUrl(url: string, max = 48): string {
  if (url.length <= max) return url;
  return `${url.slice(0, max)}…`;
}

function ShortUrlRow({
  item,
  index,
}: {
  item: ShortUrl;
  index: number;
}) {
  const { mutate: deleteUrl, isPending: isDeleting } = useDeleteShortUrl();
  const shortUrl = `${window.location.origin}/r/${item.code}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <motion.tr
      data-ocid={`shorten.list.row.item.${index + 1}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-b last:border-0"
      style={{ borderColor: "oklch(0.25 0.04 270 / 0.5)" }}
    >
      {/* Short code */}
      <td className="py-3 px-4 align-middle">
        <div className="flex items-center gap-2">
          <code
            className="font-mono text-xs px-2 py-1 rounded font-bold"
            style={{
              background: "oklch(0.78 0.18 75 / 0.1)",
              color: "oklch(0.88 0.18 80)",
              border: "1px solid oklch(0.78 0.18 75 / 0.25)",
            }}
          >
            {item.code}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded transition-all duration-150 hover:scale-110 active:scale-95 text-muted-foreground hover:text-gold"
            title="Copy short URL"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </td>

      {/* Original URL */}
      <td className="py-3 px-4 align-middle hidden md:table-cell">
        <a
          href={item.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors"
          title={item.originalUrl}
        >
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
          <span className="truncate max-w-xs">
            {truncateUrl(item.originalUrl)}
          </span>
        </a>
      </td>

      {/* Clicks */}
      <td className="py-3 px-4 align-middle">
        <div className="flex items-center gap-1.5">
          <MousePointerClick className="w-3.5 h-3.5 text-gold/50" />
          <span className="text-xs font-display font-bold text-foreground/80">
            {item.clicks.toString()}
          </span>
        </div>
      </td>

      {/* Date */}
      <td className="py-3 px-4 align-middle hidden sm:table-cell">
        <span className="text-xs text-muted-foreground">
          {formatDate(item.createdAt)}
        </span>
      </td>

      {/* Delete */}
      <td className="py-3 px-4 align-middle text-right">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              data-ocid={`shorten.list.delete_button.${index + 1}`}
              disabled={isDeleting}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
              title="Delete"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            data-ocid="shorten.delete.dialog"
            style={{
              background: "oklch(0.12 0.005 270)",
              border: "1px solid oklch(0.25 0.04 270)",
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display font-black uppercase tracking-widest text-foreground">
                Delete Short URL?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will permanently remove the short link{" "}
                <span
                  className="font-mono font-bold"
                  style={{ color: "oklch(0.88 0.18 80)" }}
                >
                  /r/{item.code}
                </span>
                . Anyone using this link will get a "not found" message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid="shorten.delete.cancel_button"
                style={{
                  background: "oklch(0.18 0.01 270)",
                  border: "1px solid oklch(0.3 0.04 270)",
                  color: "oklch(0.85 0.01 270)",
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid="shorten.delete.confirm_button"
                onClick={() => deleteUrl(item.code)}
                style={{
                  background: "oklch(0.577 0.245 27 / 0.9)",
                  border: "1px solid oklch(0.577 0.245 27)",
                  color: "white",
                }}
              >
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </motion.tr>
  );
}

export function ShortenPage() {
  const [urlInput, setUrlInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<ShortUrl | null>(null);
  const [copiedResult, setCopiedResult] = useState(false);

  const createMutation = useCreateShortUrl();
  const { data: shortUrls, isLoading, isError } = useListShortUrls();

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setInputError("Please enter a URL.");
      return;
    }
    if (!validateUrl(trimmed)) {
      setInputError(
        'Please enter a valid URL starting with "http://" or "https://".',
      );
      return;
    }

    try {
      const result = await createMutation.mutateAsync({ originalUrl: trimmed });
      setLastCreated(result);
      setUrlInput("");
    } catch (err) {
      setInputError(
        err instanceof Error ? err.message : "Failed to shorten URL.",
      );
    }
  };

  const handleCopyResult = async () => {
    if (!lastCreated) return;
    const short = `${window.location.origin}/r/${lastCreated.code}`;
    try {
      await navigator.clipboard.writeText(short);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } catch {
      // fallback
    }
  };

  const resultUrl = lastCreated
    ? `${window.location.origin}/r/${lastCreated.code}`
    : null;

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-border/30"
        style={{
          background: "oklch(0.10 0.005 270 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{
                background: "oklch(0.78 0.18 75 / 0.15)",
                border: "1px solid oklch(0.78 0.18 75 / 0.4)",
              }}
            >
              <Link2 className="w-4 h-4 text-gold" />
            </div>
            <div>
              <span className="font-display font-black uppercase tracking-widest text-sm text-gold">
                RDX ESPORTS
              </span>
              <span className="font-display text-xs uppercase tracking-widest text-muted-foreground ml-2">
                URL Shortener
              </span>
            </div>
          </div>
          <Link
            to="/"
            data-ocid="shorten.home.link"
            className="flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Site
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/60">
            Free Tool
          </p>
          <h1
            className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.05 85) 0%, oklch(0.78 0.18 75) 50%, oklch(0.62 0.22 60) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px oklch(0.78 0.18 75 / 0.3))",
            }}
          >
            URL Shortener
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Shorten any long URL instantly. Share clean, memorable links.
          </p>
        </motion.div>

        {/* Shortener Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rdx-card rounded-xl p-6 md:p-8 space-y-5"
        >
          <form onSubmit={handleShorten} className="space-y-4">
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Input
                  data-ocid="shorten.url.input"
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (inputError) setInputError(null);
                    if (lastCreated) setLastCreated(null);
                  }}
                  placeholder="https://your-long-url.com/very/long/path"
                  className="font-mono text-sm bg-dark-elevated border-border/50 focus:border-gold/50"
                  autoComplete="url"
                />
                <AnimatePresence>
                  {inputError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-1.5 text-xs text-destructive"
                    >
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      {inputError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Button
                type="submit"
                data-ocid="shorten.submit_button"
                disabled={createMutation.isPending}
                className="font-display font-black uppercase tracking-widest text-sm px-6 shrink-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: createMutation.isPending
                    ? "oklch(0.25 0 0)"
                    : "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.88 0.20 80))",
                  color: createMutation.isPending
                    ? "oklch(0.55 0 0)"
                    : "oklch(0.1 0 0)",
                  border: "none",
                  boxShadow: createMutation.isPending
                    ? "none"
                    : "0 0 20px oklch(0.78 0.18 75 / 0.35)",
                }}
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-1.5" />
                    Shorten
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Result */}
          <AnimatePresence>
            {lastCreated && resultUrl && (
              <motion.div
                data-ocid="shorten.result.success_state"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="rounded-lg p-4 space-y-3"
                style={{
                  background: "oklch(0.55 0.18 145 / 0.08)",
                  border: "1px solid oklch(0.55 0.18 145 / 0.4)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.55 0.18 145 / 0.2)" }}
                  >
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-xs font-display font-bold uppercase tracking-widest text-green-400">
                    Link Created!
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono"
                    style={{
                      borderColor: "oklch(0.55 0.18 145 / 0.4)",
                      color: "oklch(0.65 0.14 145)",
                      background: "oklch(0.55 0.18 145 / 0.05)",
                    }}
                  >
                    {lastCreated.code}
                  </Badge>
                </div>

                <div
                  className="flex items-center gap-2 rounded-md px-3 py-2"
                  style={{
                    background: "oklch(0.08 0 0)",
                    border: "1px solid oklch(0.25 0.04 270 / 0.6)",
                  }}
                >
                  <a
                    href={resultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 font-mono text-sm font-bold truncate hover:underline"
                    style={{ color: "oklch(0.88 0.18 80)" }}
                  >
                    {resultUrl}
                  </a>
                  <button
                    type="button"
                    data-ocid="shorten.copy.button"
                    onClick={handleCopyResult}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-display font-bold uppercase tracking-wide transition-all duration-150 hover:scale-105 active:scale-95 shrink-0"
                    style={{
                      background: copiedResult
                        ? "oklch(0.55 0.18 145 / 0.2)"
                        : "oklch(0.78 0.18 75 / 0.15)",
                      border: copiedResult
                        ? "1px solid oklch(0.55 0.18 145 / 0.5)"
                        : "1px solid oklch(0.78 0.18 75 / 0.4)",
                      color: copiedResult
                        ? "oklch(0.65 0.14 145)"
                        : "oklch(0.88 0.18 80)",
                    }}
                  >
                    {copiedResult ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Original:{" "}
                  <span className="font-mono">
                    {truncateUrl(lastCreated.originalUrl, 60)}
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* URLs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-black uppercase tracking-widest text-lg text-foreground">
                Your Links
              </h2>
              {shortUrls && shortUrls.length > 0 && (
                <Badge
                  className="font-display font-bold tracking-wider text-xs"
                  style={{
                    background: "oklch(0.78 0.18 75 / 0.15)",
                    border: "1px solid oklch(0.78 0.18 75 / 0.4)",
                    color: "oklch(0.88 0.18 80)",
                  }}
                >
                  {shortUrls.length}
                </Badge>
              )}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div data-ocid="shorten.list.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rdx-card rounded-lg p-4 flex items-center gap-4"
                >
                  <Skeleton
                    className="h-6 w-16 rounded"
                    style={{ background: "oklch(0.18 0.01 270)" }}
                  />
                  <Skeleton
                    className="h-4 flex-1"
                    style={{ background: "oklch(0.18 0.01 270)" }}
                  />
                  <Skeleton
                    className="h-4 w-12"
                    style={{ background: "oklch(0.18 0.01 270)" }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div
              data-ocid="shorten.list.error_state"
              className="flex items-center gap-3 p-5 rounded-lg"
              style={{
                background: "oklch(0.577 0.245 27 / 0.1)",
                border: "1px solid oklch(0.577 0.245 27 / 0.4)",
              }}
            >
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">
                Failed to load links. Please refresh the page.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && shortUrls?.length === 0 && (
            <motion.div
              data-ocid="shorten.list.empty_state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-14 rounded-lg"
              style={{
                background: "oklch(0.12 0.005 270)",
                border: "1px solid oklch(0.25 0.04 270)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{
                  background: "oklch(0.78 0.18 75 / 0.08)",
                  border: "2px solid oklch(0.78 0.18 75 / 0.2)",
                }}
              >
                <Link2 className="w-6 h-6 text-gold/40" />
              </div>
              <h3 className="font-display font-black uppercase tracking-widest text-base text-muted-foreground">
                No Links Yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Shorten a URL above to get started.
              </p>
            </motion.div>
          )}

          {/* Table */}
          {!isLoading && !isError && shortUrls && shortUrls.length > 0 && (
            <div
              data-ocid="shorten.list.table"
              className="rdx-card rounded-xl overflow-hidden"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: "oklch(0.10 0.005 270)",
                      borderBottom: "1px solid oklch(0.25 0.04 270 / 0.8)",
                    }}
                  >
                    <th className="py-3 px-4 text-left text-[11px] font-display font-bold uppercase tracking-widest text-gold/60">
                      Short Code
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-display font-bold uppercase tracking-widest text-gold/60 hidden md:table-cell">
                      Original URL
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-display font-bold uppercase tracking-widest text-gold/60">
                      Clicks
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-display font-bold uppercase tracking-widest text-gold/60 hidden sm:table-cell">
                      Created
                    </th>
                    <th className="py-3 px-4 text-right text-[11px] font-display font-bold uppercase tracking-widest text-gold/60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shortUrls.map((item, i) => (
                    <ShortUrlRow key={item.code} item={item} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-border/30 mt-10">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/60 hover:text-gold transition-colors underline-offset-2 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
