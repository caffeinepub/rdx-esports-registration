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
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Phone,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
  ZoomIn,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Registration } from "../backend";
import {
  useDeleteAllRegistrations,
  useDeleteRegistration,
  useListRegistrations,
  useResetRegistrations,
} from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function ImagePreviewModal({
  src,
  label,
  onClose,
}: { src: string; label: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        data-ocid="admin.image_preview.modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "oklch(0.05 0 0 / 0.92)" }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full rounded-xl overflow-hidden"
          style={{
            border: "1px solid oklch(0.78 0.18 75 / 0.4)",
            boxShadow: "0 0 40px oklch(0.78 0.18 75 / 0.2)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: "oklch(0.12 0.005 270)" }}
          >
            <span className="text-xs font-display uppercase tracking-widest text-gold/80 font-semibold">
              {label}
            </span>
            <button
              type="button"
              data-ocid="admin.image_preview.close_button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <img
            src={src}
            alt={label}
            className="w-full object-contain max-h-[70vh]"
            style={{ background: "oklch(0.08 0 0)" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ImageThumb({
  blob,
  label,
}: { blob: { getDirectURL(): string } | undefined; label: string }) {
  const [preview, setPreview] = useState(false);

  if (!blob) {
    return (
      <div
        className="w-14 h-14 rounded flex items-center justify-center"
        style={{
          background: "oklch(0.18 0.01 270)",
          border: "1px solid oklch(0.25 0.04 270)",
        }}
      >
        <ImageIcon className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  }

  const url = blob.getDirectURL();

  return (
    <>
      <button
        type="button"
        onClick={() => setPreview(true)}
        className="relative group focus:outline-none"
        title={`View ${label}`}
      >
        <img
          src={url}
          alt={label}
          className="w-14 h-14 rounded object-cover transition-all duration-200 group-hover:brightness-75"
          style={{ border: "1px solid oklch(0.78 0.18 75 / 0.3)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-5 h-5 text-white drop-shadow" />
        </div>
      </button>
      {preview && (
        <ImagePreviewModal
          src={url}
          label={label}
          onClose={() => setPreview(false)}
        />
      )}
    </>
  );
}

function RegistrationCard({
  registration,
  index,
}: { registration: Registration; index: number }) {
  const { mutate: deleteRegistration, isPending: isDeleting } =
    useDeleteRegistration();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`admin.table.row.item.${index + 1}`}
      className="rdx-card rounded-lg p-5 space-y-4"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <ImageThumb blob={registration.teamLogoUrl} label="Team Logo" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-black uppercase tracking-wide text-foreground text-base truncate">
                {registration.teamName}
              </h3>
              <Badge
                variant="outline"
                className="text-xs font-display font-bold tracking-wider shrink-0"
                style={{
                  borderColor: "oklch(0.78 0.18 75 / 0.5)",
                  color: "oklch(0.78 0.18 75)",
                  background: "oklch(0.78 0.18 75 / 0.08)",
                }}
              >
                {registration.id}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDate(registration.registeredAt)}
            </span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                data-ocid={`admin.table.row.delete_button.${index + 1}`}
                className="flex items-center gap-1.5 h-8 px-3 font-display font-bold uppercase tracking-wider text-xs"
                disabled={isDeleting}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid="admin.delete.dialog"
              style={{
                background: "oklch(0.12 0.005 270)",
                border: "1px solid oklch(0.25 0.04 270)",
              }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display font-black uppercase tracking-widest text-foreground">
                  Remove Registration?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This will permanently remove{" "}
                  <span className="text-foreground font-semibold">
                    {registration.teamName}
                  </span>{" "}
                  ({registration.id}) from the tournament. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-ocid="admin.delete.cancel_button"
                  style={{
                    background: "oklch(0.18 0.01 270)",
                    border: "1px solid oklch(0.3 0.04 270)",
                    color: "oklch(0.85 0.01 270)",
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="admin.delete.confirm_button"
                  onClick={() => deleteRegistration(registration.id)}
                  style={{
                    background: "oklch(0.577 0.245 27 / 0.9)",
                    border: "1px solid oklch(0.577 0.245 27)",
                    color: "white",
                  }}
                >
                  Yes, Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-gold/50 flex-shrink-0" />
          <span className="text-foreground/80">{registration.phoneNumber}</span>
        </div>

        {registration.referredBy && (
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-gold/50 flex-shrink-0" />
            <span className="text-foreground/80">
              Referred by: {registration.referredBy}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 sm:col-span-2">
          <ExternalLink className="w-3.5 h-3.5 text-gold/50 flex-shrink-0" />
          <a
            href={registration.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 hover:text-gold transition-colors underline-offset-2 hover:underline truncate"
          >
            {registration.whatsappLink}
          </a>
        </div>
      </div>

      {/* Image row */}
      <div className="flex items-center gap-4 pt-1 flex-wrap">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          Photos:
        </span>
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <ImageThumb blob={registration.teamLogoUrl} label="Team Logo" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Logo
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ImageThumb
              blob={registration.proofOfPaymentUrl}
              label="Proof of Payment"
            />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Payment
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function downloadTeamNamesCSV(registrations: Registration[]) {
  const header = "Team Name";
  const rows = registrations.map((r) => `"${r.teamName.replace(/"/g, '""')}"`);
  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "registered_teams.csv";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function AdminPage() {
  const { data: registrations, isLoading, isError } = useListRegistrations();
  const { mutate: deleteAll, isPending: isDeletingAll } =
    useDeleteAllRegistrations();
  const { mutate: resetRegistrations, isPending: isResetting } =
    useResetRegistrations();

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
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{
                background: "oklch(0.78 0.18 75 / 0.15)",
                border: "1px solid oklch(0.78 0.18 75 / 0.4)",
              }}
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
            </div>
            <div>
              <span className="font-display font-black uppercase tracking-widest text-sm text-gold">
                RDX ESPORTS
              </span>
              <span className="font-display text-xs uppercase tracking-widest text-muted-foreground ml-2">
                Admin Panel
              </span>
            </div>
          </div>
          <Link
            to="/"
            data-ocid="admin.link"
            className="text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gold" />
              <h1 className="font-display font-black uppercase tracking-widest text-2xl md:text-3xl text-foreground">
                Registrations
              </h1>
              {registrations && (
                <Badge
                  className="font-display font-bold tracking-wider"
                  style={{
                    background: "oklch(0.78 0.18 75 / 0.15)",
                    border: "1px solid oklch(0.78 0.18 75 / 0.4)",
                    color: "oklch(0.88 0.18 80)",
                  }}
                >
                  {registrations.length} Teams
                </Badge>
              )}
            </div>
            {registrations && registrations.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  data-ocid="admin.download_sheet.button"
                  onClick={() => downloadTeamNamesCSV(registrations)}
                  className="flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs px-3 h-8"
                  style={{
                    color: "oklch(0.65 0.2 145)",
                    border: "1px solid oklch(0.65 0.2 145 / 0.35)",
                    background: "oklch(0.65 0.2 145 / 0.08)",
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sheet
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      data-ocid="admin.delete_all.open_modal_button"
                      className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30 font-display font-bold uppercase tracking-wider text-xs px-3 h-8"
                      disabled={isDeletingAll}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    data-ocid="admin.delete_all.dialog"
                    style={{
                      background: "oklch(0.12 0.005 270)",
                      border: "1px solid oklch(0.25 0.04 270)",
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display font-black uppercase tracking-widest text-foreground">
                        Remove All Registrations?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will permanently delete all{" "}
                        <span className="text-foreground font-semibold">
                          {registrations.length} team
                          {registrations.length !== 1 ? "s" : ""}
                        </span>{" "}
                        from the tournament. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        data-ocid="admin.delete_all.cancel_button"
                        style={{
                          background: "oklch(0.18 0.01 270)",
                          border: "1px solid oklch(0.3 0.04 270)",
                          color: "oklch(0.85 0.01 270)",
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid="admin.delete_all.confirm_button"
                        onClick={() => deleteAll()}
                        style={{
                          background: "oklch(0.577 0.245 27 / 0.9)",
                          border: "1px solid oklch(0.577 0.245 27)",
                          color: "white",
                        }}
                      >
                        Yes, Remove All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      data-ocid="admin.reset.open_modal_button"
                      className="flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs px-3 h-8"
                      disabled={isResetting}
                      style={{
                        color: "oklch(0.78 0.18 65)",
                        border: "1px solid oklch(0.78 0.18 65 / 0.35)",
                        background: "oklch(0.78 0.18 65 / 0.08)",
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset &amp; Restart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    data-ocid="admin.reset.dialog"
                    style={{
                      background: "oklch(0.12 0.005 270)",
                      border: "1px solid oklch(0.25 0.04 270)",
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display font-black uppercase tracking-widest text-foreground">
                        Reset &amp; Restart Numbering?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will delete all registered teams and restart the ID
                        counter from{" "}
                        <span
                          className="font-semibold"
                          style={{ color: "oklch(0.78 0.18 65)" }}
                        >
                          RDX-001
                        </span>
                        . The next team to register will get ID RDX-001. This
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        data-ocid="admin.reset.cancel_button"
                        style={{
                          background: "oklch(0.18 0.01 270)",
                          border: "1px solid oklch(0.3 0.04 270)",
                          color: "oklch(0.85 0.01 270)",
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid="admin.reset.confirm_button"
                        onClick={() => resetRegistrations()}
                        style={{
                          background: "oklch(0.68 0.18 65 / 0.9)",
                          border: "1px solid oklch(0.78 0.18 65)",
                          color: "oklch(0.10 0.005 270)",
                          fontWeight: 700,
                        }}
                      >
                        Yes, Reset &amp; Restart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            View and manage all tournament registrations
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div data-ocid="admin.loading_state" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rdx-card rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton
                    className="w-10 h-10 rounded"
                    style={{ background: "oklch(0.18 0.01 270)" }}
                  />
                  <div className="space-y-2">
                    <Skeleton
                      className="h-4 w-32"
                      style={{ background: "oklch(0.18 0.01 270)" }}
                    />
                    <Skeleton
                      className="h-3 w-24"
                      style={{ background: "oklch(0.18 0.01 270)" }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton
                    className="h-3 w-full"
                    style={{ background: "oklch(0.18 0.01 270)" }}
                  />
                  <Skeleton
                    className="h-3 w-full"
                    style={{ background: "oklch(0.18 0.01 270)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div
            data-ocid="admin.error_state"
            className="flex items-center gap-3 p-6 rounded-lg"
            style={{
              background: "oklch(0.577 0.245 27 / 0.1)",
              border: "1px solid oklch(0.577 0.245 27 / 0.4)",
            }}
          >
            <ShieldCheck className="w-5 h-5 text-destructive" />
            <p className="text-destructive">
              Failed to load registrations. Please refresh the page.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && registrations?.length === 0 && (
          <motion.div
            data-ocid="admin.empty_state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-lg"
            style={{
              background: "oklch(0.12 0.005 270)",
              border: "1px solid oklch(0.25 0.04 270)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{
                background: "oklch(0.78 0.18 75 / 0.08)",
                border: "2px solid oklch(0.78 0.18 75 / 0.2)",
              }}
            >
              <Users className="w-7 h-7 text-gold/40" />
            </div>
            <h3 className="font-display font-black uppercase tracking-widest text-lg text-muted-foreground">
              No Registrations Yet
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Teams will appear here once they register.
            </p>
          </motion.div>
        )}

        {/* Registrations list */}
        {!isLoading &&
          !isError &&
          registrations &&
          registrations.length > 0 && (
            <div data-ocid="admin.table" className="space-y-4">
              {registrations.map((reg, i) => (
                <RegistrationCard key={reg.id} registration={reg} index={i} />
              ))}
            </div>
          )}
      </main>
    </div>
  );
}
