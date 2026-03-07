import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  MessageCircle,
  Phone,
  User,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useRef, useState } from "react";
import type { Registration } from "../backend";
import { ConfirmationCard } from "../components/ConfirmationCard";
import { FileUpload } from "../components/FileUpload";
import { useCreateRegistration } from "../hooks/useQueries";

const RULES = [
  "NO EMOTE",
  "NO WALL BREAK",
  "NO ZONE BLOCK",
  "NO PC",
  "NO HACK",
  "NO PANEL",
  "NO REFUND",
  "NO ROOF",
  "ONLY FACE TO FACE",
];

const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/K8cAEuRcQUZF00gjiPAku7?mode=gi_t";

const SPONSORS = [
  {
    name: "TG ESPORTS",
    logo: "/assets/uploads/IMG-20260307-WA0006-1.jpg",
    color: "oklch(0.55 0.25 22)",
  },
  {
    name: "KD PAIYAN YT",
    logo: "/assets/uploads/20260205_183034-3.png",
    color: "oklch(0.78 0.18 75)",
  },
  {
    name: "TG PANEL",
    logo: "/assets/uploads/IMG-20260307-WA0005-2.jpg",
    color: "oklch(0.55 0.25 22)",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export function HomePage() {
  const formRef = useRef<HTMLDivElement>(null);
  const createMutation = useCreateRegistration();
  const [confirmedRegistration, setConfirmedRegistration] =
    useState<Registration | null>(null);

  // Form state
  const [teamName, setTeamName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [teamLogoFile, setTeamLogoFile] = useState<File | null>(null);
  const [proofOfPaymentFile, setProofOfPaymentFile] = useState<File | null>(
    null,
  );
  const [whatsappJoined, setWhatsappJoined] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resetForm = () => {
    setTeamName("");
    setPhoneNumber("");
    setReferredBy("");
    setTeamLogoFile(null);
    setProofOfPaymentFile(null);
    setWhatsappJoined(false);
    setFormError(null);
    setConfirmedRegistration(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!teamName.trim()) {
      setFormError("Team name is required.");
      return;
    }
    if (!teamLogoFile) {
      setFormError(
        "Team Logo image is required. Please upload your team logo.",
      );
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError("Phone number is required.");
      return;
    }
    if (!proofOfPaymentFile) {
      setFormError(
        "Proof of Payment image is required. Please upload your payment screenshot.",
      );
      return;
    }
    if (!whatsappJoined) {
      setFormError("You must join the WhatsApp group before submitting.");
      return;
    }

    try {
      const reg = await createMutation.mutateAsync({
        teamName: teamName.trim(),
        response: "",
        phoneNumber: phoneNumber.trim(),
        whatsappLink: WHATSAPP_GROUP_LINK,
        teamLogoFile,
        playerPhotoFile: null,
        paymentScreenshotFile: null,
        proofOfPaymentFile,
        referredBy: referredBy.trim() || null,
      });
      setConfirmedRegistration(reg);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-dark-base">
      {/* ── Hero ─────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1920x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.08 0 0 / 0.7) 0%, oklch(0.08 0 0 / 0.85) 60%, oklch(0.08 0 0) 100%)",
          }}
        />

        {/* Hex grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.78 0.18 75) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 space-y-6 max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center mb-4"
          >
            <img
              src="/assets/uploads/20260307_210819-1.png"
              alt="INFERNO'26"
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
              style={{
                filter: "drop-shadow(0 0 20px oklch(0.78 0.18 75 / 0.5))",
              }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-sm md:text-base uppercase tracking-[0.5em] text-gold/70 font-display"
          >
            presents
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="font-display font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-none"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.95 0.05 85) 0%, oklch(0.78 0.18 75) 50%, oklch(0.62 0.22 60) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 30px oklch(0.78 0.18 75 / 0.4))",
            }}
          >
            INFERNO'26
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-4 justify-center"
          >
            <div
              className="h-0.5 w-20 md:w-32"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.55 0.25 22))",
              }}
            />
            <Zap className="w-5 h-5 text-crimson" />
            <span className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Tournament
            </span>
            <Zap className="w-5 h-5 text-crimson" />
            <div
              className="h-0.5 w-20 md:w-32"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.55 0.25 22), transparent)",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button
              data-ocid="hero.primary_button"
              onClick={scrollToForm}
              size="lg"
              className="font-display font-black uppercase tracking-widest text-base md:text-lg px-10 py-6 mt-4 transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.88 0.20 80))",
                color: "oklch(0.1 0 0)",
                border: "none",
                boxShadow:
                  "0 0 30px oklch(0.78 0.18 75 / 0.5), 0 4px 20px oklch(0.08 0 0 / 0.5)",
              }}
            >
              REGISTER NOW
              <ChevronDown className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <ChevronDown className="w-6 h-6 text-gold/40" />
        </motion.div>
      </section>

      {/* ── Sponsors ─────────────────────────────── */}
      <section className="py-20 px-4 relative">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.55 0.25 22 / 0.1) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="font-display text-xs uppercase tracking-[0.4em] text-gold/60 mb-3"
            >
              RDX ESPORTS
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-3xl md:text-4xl font-black uppercase tracking-wide text-foreground"
            >
              We are proudly invites
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="mt-4 h-0.5 w-24 mx-auto"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.18 75), transparent)",
              }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPONSORS.map((sponsor, i) => (
              <motion.div
                key={sponsor.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 3}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rdx-card rounded-lg p-8 text-center cursor-default"
                style={{
                  borderColor: `${sponsor.color} / 0.4`,
                  boxShadow: `0 0 20px ${sponsor.color} / 0.1`,
                }}
              >
                <div
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 overflow-hidden"
                  style={{
                    border: `2px solid ${sponsor.color}`,
                    boxShadow: `0 0 20px ${sponsor.color} / 0.5`,
                  }}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3
                  className="font-display font-black uppercase tracking-widest text-base"
                  style={{ color: sponsor.color }}
                >
                  {sponsor.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                  PARTNER
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separator
        className="max-w-4xl mx-auto"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.18 75 / 0.3), transparent)",
        }}
      />

      {/* ── Rules Section ────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 justify-center mb-3"
            >
              <AlertTriangle className="w-5 h-5 text-crimson" />
              <span className="font-display text-xs uppercase tracking-[0.4em] text-crimson/80">
                Tournament Rules
              </span>
              <AlertTriangle className="w-5 h-5 text-crimson" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-3xl md:text-4xl font-black uppercase tracking-wide text-foreground"
            >
              Match Regulations
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
          >
            {RULES.map((rule, i) => (
              <motion.div
                key={rule}
                variants={fadeUp}
                custom={i * 0.5}
                className="flex items-center gap-3 p-4 rounded-md"
                style={{
                  background: "oklch(0.12 0.005 270)",
                  border: "1px solid oklch(0.55 0.25 22 / 0.3)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: "oklch(0.62 0.28 18)",
                    boxShadow: "0 0 6px oklch(0.62 0.28 18 / 0.8)",
                  }}
                />
                <span className="font-display font-bold text-sm uppercase tracking-widest text-foreground/90">
                  {rule}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Separator
        className="max-w-4xl mx-auto"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.18 75 / 0.3), transparent)",
        }}
      />

      {/* ── Registration Form ─────────────────────── */}
      <section id="register" ref={formRef} className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.p
              variants={fadeUp}
              className="font-display text-xs uppercase tracking-[0.4em] text-gold/60 mb-3"
            >
              Join The Battle
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-3xl md:text-4xl font-black uppercase tracking-wide"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.95 0.02 85))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Team Registration
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rdx-card rounded-xl p-6 md:p-8"
          >
            <form
              id="register-form"
              data-ocid="registration.form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Team Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="teamName"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold/80"
                >
                  <Users className="w-3.5 h-3.5" />
                  Team Name <span className="text-crimson">*</span>
                </Label>
                <Input
                  id="teamName"
                  data-ocid="registration.team_name.input"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  required
                  className="bg-dark-elevated border-border/50 focus:border-gold/50 font-display font-semibold"
                />
              </div>

              {/* Team Logo */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <FileUpload
                    label="Team Logo"
                    value={teamLogoFile}
                    onChange={setTeamLogoFile}
                    uploadButtonId="registration.team_logo.upload_button"
                  />
                  <p className="text-xs text-crimson flex items-center gap-1">
                    <span className="font-bold">*</span> Required
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold/80"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number <span className="text-crimson">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  data-ocid="registration.phone.input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="bg-dark-elevated border-border/50 focus:border-gold/50"
                />
              </div>

              {/* Referred By */}
              <div className="space-y-2">
                <Label
                  htmlFor="referredBy"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold/80"
                >
                  <User className="w-3.5 h-3.5" />
                  Referred By Name
                  <span className="text-muted-foreground normal-case tracking-normal font-normal text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="referredBy"
                  data-ocid="registration.referred_by.input"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder="Referral name (if any)"
                  className="bg-dark-elevated border-border/50 focus:border-gold/50"
                />
              </div>

              {/* WhatsApp Join */}
              <div
                className="rounded-lg p-5 space-y-3"
                style={{
                  background: "oklch(0.25 0.08 145 / 0.15)",
                  border: `1px solid ${whatsappJoined ? "oklch(0.55 0.18 145 / 0.8)" : "oklch(0.55 0.18 145 / 0.4)"}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <span className="font-display text-xs uppercase tracking-widest text-green-400/80 font-semibold">
                    Join Our WhatsApp Group
                  </span>
                  <span className="text-crimson text-xs font-bold">
                    * Required
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You must join the official tournament WhatsApp group before
                  submitting. Click below to join, then tick the checkbox.
                </p>
                <a
                  data-ocid="registration.whatsapp.button"
                  href={WHATSAPP_GROUP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-md font-display font-bold uppercase tracking-widest text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.50 0.18 145), oklch(0.60 0.20 148))",
                    color: "oklch(0.98 0 0)",
                    boxShadow: "0 0 15px oklch(0.50 0.18 145 / 0.4)",
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  JOIN WHATSAPP GROUP
                </a>
                <div className="flex items-center gap-3 pt-1">
                  <Checkbox
                    id="whatsapp-confirm"
                    data-ocid="registration.whatsapp.checkbox"
                    checked={whatsappJoined}
                    onCheckedChange={(checked) => setWhatsappJoined(!!checked)}
                    style={{
                      borderColor: whatsappJoined
                        ? "oklch(0.55 0.18 145)"
                        : undefined,
                    }}
                  />
                  <label
                    htmlFor="whatsapp-confirm"
                    className="text-xs text-green-300 cursor-pointer select-none flex items-center gap-1"
                  >
                    {whatsappJoined && (
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                    )}
                    I have joined the WhatsApp group
                  </label>
                </div>
              </div>

              {/* Payment section */}
              <div
                className="rounded-lg p-5 space-y-5"
                style={{
                  background: "oklch(0.78 0.18 75 / 0.04)",
                  border: "1px solid oklch(0.78 0.18 75 / 0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gold/60" />
                  <span className="font-display text-xs uppercase tracking-widest text-gold/70 font-semibold">
                    Payment Details
                  </span>
                </div>

                {/* Constant GPay QR Code */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold/70">
                    Scan to Pay (GPay / UPI)
                  </p>
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{ border: "1px solid oklch(0.78 0.18 75 / 0.25)" }}
                  >
                    <img
                      src="/assets/uploads/IMG-20260307-WA0021-1--1.jpg"
                      alt="GPay QR Code"
                      className="w-full max-w-xs mx-auto block object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    UPI ID: 8667720073@fam
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <FileUpload
                      label="Proof of Payment"
                      value={proofOfPaymentFile}
                      onChange={setProofOfPaymentFile}
                      uploadButtonId="registration.proof.upload_button"
                      dropzoneId="registration.proof.dropzone"
                    />
                    <p className="text-xs text-crimson flex items-center gap-1">
                      <span className="font-bold">*</span> Required – upload
                      your payment screenshot
                    </p>
                  </div>
                </div>
              </div>

              {/* Error state */}
              <AnimatePresence>
                {(formError || createMutation.isError) && (
                  <motion.div
                    data-ocid="registration.error_state"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-4 rounded-md"
                    style={{
                      background: "oklch(0.577 0.245 27 / 0.1)",
                      border: "1px solid oklch(0.577 0.245 27 / 0.4)",
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">
                      {formError ||
                        (createMutation.error?.message ??
                          "Registration failed. Please try again.")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                type="submit"
                data-ocid="registration.submit_button"
                disabled={createMutation.isPending}
                className="w-full font-display font-black uppercase tracking-widest text-base py-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
                    : "0 0 20px oklch(0.78 0.18 75 / 0.4), 0 4px 15px oklch(0.08 0 0 / 0.3)",
                }}
              >
                {createMutation.isPending ? (
                  <span
                    data-ocid="registration.loading_state"
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
                      style={{ borderTopColor: "oklch(0.55 0 0)" }}
                    />
                    REGISTERING...
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    SUBMIT REGISTRATION
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="py-8 px-4 text-center border-t border-border/30">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.18 75 / 0.4))",
              }}
            />
            <p className="text-xs font-display uppercase tracking-widest text-gold/50">
              DESIGNED BY BHUVI
            </p>
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.78 0.18 75 / 0.4), transparent)",
              }}
            />
          </div>
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
        </div>
      </footer>

      {/* ── Confirmation Card Overlay ─────────────── */}
      <AnimatePresence>
        {confirmedRegistration && (
          <ConfirmationCard
            registration={confirmedRegistration}
            onRegisterAnother={resetForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
