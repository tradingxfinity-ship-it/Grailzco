"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  Loader2,
  Lock,
  Plus,
  ScanSearch,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { SelectField, TextArea, TextField } from "@/components/sell/Fields";
import { ImageDropzone, type UploadImage } from "@/components/sell/ImageDropzone";
import { LivePreview, type PreviewCard } from "@/components/sell/LivePreview";
import { ChipGroup, OptionList, StepHeader, StepTitle } from "@/components/sell/StepParts";
import { SubmissionSuccess } from "@/components/sell/SubmissionSuccess";
import { submissionNotice } from "@/content/copy";
import { formatBytes, prepareImage } from "@/lib/images";
import {
  BEST_TIMES,
  CATEGORY_OPTIONS,
  COLLECTION_TYPES,
  CONTACT_METHODS,
  ERA_OPTIONS,
  VALUE_OPTIONS,
  CONDITION_OPTIONS,
  GRADING_OPTIONS,
  LIMITS,
  MB,
  emptyCard,
  validateSubmission,
  type CardEntry,
  type FieldErrors,
  type SubmissionPayload,
} from "@/lib/submission";
import { cn } from "@/lib/cn";

type CardState = CardEntry & { id: string; images: UploadImage[]; messages: string[] };
type Status = "idle" | "submitting" | "success" | "error";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
const newCard = (id = uid()): CardState => ({ ...emptyCard(), id, images: [], messages: [] });

const STEPS = ["Start", "What you're selling", "Era", "Value", "Your cards", "Your details"] as const;
const LAST = STEPS.length - 1;

const INTRO_POINTS = [
  { icon: Clock, title: "About 2 minutes", body: "A few taps and some photos" },
  { icon: ScanSearch, title: "Reviewed individually", body: "A real look at every card" },
  { icon: ShieldCheck, title: "No obligation", body: "You decide what happens next" },
];

/** Which step an error key belongs to, so failed validation can jump back to it. */
const stepOf = (key: string) =>
  key === "collectionType"
    ? 1
    : key === "era"
      ? 2
      : key === "value"
        ? 3
        : key.startsWith("cards") || key === "images"
          ? 4
          : 5;

/** Step-by-step sell flow in a single focused card: intro, three quick questions, cards, contact. */
export function SubmissionForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [cards, setCards] = useState<CardState[]>(() => [newCard("first")]); // stable id for SSR hydration
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("first"); // card shown in the live preview
  const [step, setStep] = useState(0);
  const [collectionType, setCollectionType] = useState("");
  const [era, setEra] = useState("");
  const [value, setValue] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [bestTime, setBestTime] = useState("");
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startedAt = useRef(0);
  const inFlight = useRef(false);
  const submissionId = useRef(uid());
  const formTop = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const focusCardId = useRef<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Revoke preview URLs on unmount.
  const cardsRef = useRef(cards);
  cardsRef.current = cards;
  useEffect(
    () => () => cardsRef.current.forEach((c) => c.images.forEach((i) => i.url && URL.revokeObjectURL(i.url))),
    [],
  );

  // Move focus to the new step's question so keyboard and screen-reader users follow along.
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    scrollRef.current?.scrollTo({ top: 0 });
    requestAnimationFrame(() => document.getElementById(`step-${step}-title`)?.focus({ preventScroll: true }));
  }, [step]);
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  // Focus the name field of a newly added card.
  useEffect(() => {
    if (!focusCardId.current) return;
    document.getElementById(`card-${focusCardId.current}-name`)?.focus();
    focusCardId.current = null;
  }, [cards.length]);

  const busy = status === "submitting";
  const allImages = cards.flatMap((c) => c.images);
  const totalBytes = allImages.reduce((n, i) => n + (i.size ?? 0), 0);
  const processing = allImages.some((i) => i.status === "processing");

  const clearError = (key: string) =>
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });

  const updateCard = (id: string, patch: Partial<CardState>) =>
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const setCardField = (index: number, id: string, field: keyof CardEntry, value: string) => {
    updateCard(id, { [field]: value } as Partial<CardState>);
    clearError(`cards.${index}.${field}`);
  };

  const addImages = useCallback(async (cardId: string, cardIndex: number, files: File[]) => {
    const current = cardsRef.current;
    const card = current.find((c) => c.id === cardId);
    if (!card) return;
    setActiveId(cardId);
    const messages: string[] = [];
    const totalCount = current.reduce((n, c) => n + c.images.length, 0);
    const room = Math.min(LIMITS.maxImagesPerCard - card.images.length, LIMITS.maxImagesTotal - totalCount);
    if (files.length > room) {
      messages.push(
        room <= 0
          ? `Photo limit reached (${LIMITS.maxImagesPerCard} per card, ${LIMITS.maxImagesTotal} per submission).`
          : `Only ${room} more photo${room === 1 ? "" : "s"} can be added here — extra files were skipped.`,
      );
    }
    const accepted = files.slice(0, Math.max(0, room));
    const pending: UploadImage[] = accepted.map((f) => ({ id: uid(), name: f.name, status: "processing" }));
    setCards((cs) => cs.map((c) => (c.id === cardId ? { ...c, images: [...c.images, ...pending], messages } : c)));
    setErrors((e) => {
      const next = { ...e };
      delete next[`cards.${cardIndex}.images`];
      delete next.images;
      return next;
    });

    await Promise.all(
      accepted.map(async (file, i) => {
        const pid = pending[i].id;
        try {
          const { blob } = await prepareImage(file);
          setCards((cs) => {
            const used = cs.flatMap((c) => c.images).reduce((n, im) => n + (im.size ?? 0), 0);
            if (used + blob.size > LIMITS.maxTotalMB * MB) {
              return cs.map((c) =>
                c.id === cardId
                  ? {
                      ...c,
                      images: c.images.filter((im) => im.id !== pid),
                      messages: [
                        ...c.messages,
                        `“${file.name}” would take this submission past ${LIMITS.maxTotalMB} MB of photos.`,
                      ],
                    }
                  : c,
              );
            }
            const url = URL.createObjectURL(blob);
            return cs.map((c) =>
              c.id === cardId
                ? {
                    ...c,
                    images: c.images.map((im) =>
                      im.id === pid ? { ...im, status: "ready", blob, url, size: blob.size } : im,
                    ),
                  }
                : c,
            );
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : `“${file.name}” couldn't be added.`;
          setCards((cs) =>
            cs.map((c) =>
              c.id === cardId
                ? { ...c, images: c.images.filter((im) => im.id !== pid), messages: [...c.messages, msg] }
                : c,
            ),
          );
        }
      }),
    );
  }, []);

  const removeImage = (cardId: string, imageId: string) =>
    setCards((cs) =>
      cs.map((c) => {
        if (c.id !== cardId) return c;
        const img = c.images.find((i) => i.id === imageId);
        if (img?.url) URL.revokeObjectURL(img.url);
        return { ...c, images: c.images.filter((i) => i.id !== imageId), messages: [] };
      }),
    );

  const addCard = () => {
    if (cards.length >= LIMITS.maxCards) return;
    const c = newCard();
    focusCardId.current = c.id;
    setActiveId(c.id);
    setCards((cs) => [...cs, c]);
  };

  const removeCard = (id: string) => {
    const idx = cards.findIndex((c) => c.id === id);
    cards[idx]?.images.forEach((i) => i.url && URL.revokeObjectURL(i.url));
    setCards((cs) => cs.filter((c) => c.id !== id));
    // Card-indexed errors shift after removal; clear them and re-validate on next submit.
    setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !k.startsWith("cards."))));
    const prev = cards[idx - 1] ?? cards[idx + 1];
    if (id === activeId && prev) setActiveId(prev.id);
    if (prev) requestAnimationFrame(() => document.getElementById(`card-${prev.id}-name`)?.focus());
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('[aria-invalid="true"], [data-error="true"]');
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });

  const resetForm = () => {
    cards.forEach((c) => c.images.forEach((i) => i.url && URL.revokeObjectURL(i.url)));
    setFullName("");
    setEmail("");
    setPhone("");
    setConsent(false);
    setCollectionType("");
    setEra("");
    setValue("");
    setContactMethod("");
    setBestTime("");
    setStep(0);
    const fresh = newCard();
    setCards([fresh]);
    setActiveId(fresh.id);
    setErrors({});
    setServerError("");
    setProgress(0);
    submissionId.current = uid();
    startedAt.current = Date.now();
    setStatus("idle");
  };

  /** Pick an answer on a question step, then glide to the next step. */
  const pick = (setter: (v: string) => void, key: string) => (v: string) => {
    setter(v);
    clearError(key);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStep((s) => Math.min(s + 1, LAST)), 320);
  };

  const buildPayload = (): SubmissionPayload => ({
    collectionType,
    era,
    value,
    contactMethod,
    bestTime,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    consent,
    website,
    elapsedMs: Date.now() - startedAt.current,
    cards: cards.map(({ name, category, set, condition, grading, quantity, askingPrice, notes }) => ({
      name: name.trim(),
      category,
      set: set.trim(),
      condition,
      grading,
      quantity: quantity.trim(),
      askingPrice: askingPrice.trim(),
      notes: notes.trim(),
    })),
  });

  /** All problems for the whole form (photos included). */
  const findErrors = () => {
    const found = validateSubmission(buildPayload());
    if (allImages.length === 0) found.images = "Please add at least one photo so we can review your cards.";
    if (processing) found.images = "Please wait a moment — your photos are still being prepared.";
    return found;
  };

  /** Continue: only this step's problems block moving on. */
  const next = () => {
    const mine = Object.fromEntries(Object.entries(findErrors()).filter(([k]) => stepOf(k) === step));
    setErrors(mine);
    if (Object.keys(mine).length) return focusFirstError();
    setStep((s) => Math.min(s + 1, LAST));
  };
  const back = () => {
    setErrors({});
    setServerError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < LAST) return next(); // Enter key on an earlier step
    if (inFlight.current) return; // duplicate-submission guard
    setServerError("");

    const payload = buildPayload();
    const found = findErrors();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStep(Math.min(...Object.keys(found).map(stepOf)));
      focusFirstError();
      return;
    }

    const body = new FormData();
    body.append("payload", JSON.stringify(payload));
    body.append("submissionId", submissionId.current);
    cards.forEach((c, ci) =>
      c.images.forEach((img, ii) => {
        if (img.blob) body.append(`card-${ci}`, img.blob, `card-${ci + 1}-photo-${ii + 1}.jpg`);
      }),
    );

    inFlight.current = true;
    setStatus("submitting");
    setProgress(0);

    try {
      const res = await upload(body, setProgress);
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        if (res.fieldErrors) {
          setErrors(res.fieldErrors);
          setStep(Math.min(...Object.keys(res.fieldErrors).map(stepOf), LAST));
          focusFirstError();
        }
        setServerError(res.error);
      }
    } finally {
      inFlight.current = false;
    }
  }

  const errorCount = Object.keys(errors).length;
  const previewCards: PreviewCard[] = cards.map(({ images, ...c }) => ({
    ...c,
    photos: images.filter((im) => im.status === "ready" && im.url).map((im) => im.url!),
  }));
  const activeIndex = Math.max(
    0,
    cards.findIndex((c) => c.id === activeId),
  );

  return (
    <div
      ref={formTop}
      className="hairline relative mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-navy-800/80 shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)] backdrop-blur-sm"
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <div key="success" className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
            <SubmissionSuccess email={email} onReset={resetForm} />
          </div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            aria-busy={busy}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="shrink-0 px-6 pb-2 pt-5 sm:px-10 sm:pt-7">
              <StepHeader step={step} total={STEPS.length} onBack={step > 0 && !busy ? back : undefined} />
            </div>

            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-4 sm:px-10 sm:py-5"
            >
              {(errorCount > 0 || serverError) && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-2xl border border-[#ff9a9a]/40 bg-[#ff9a9a]/[0.07] p-5 text-[0.95rem] text-white"
                >
                  <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#ff9a9a]" />
                  <div>
                    {serverError ? (
                      <>
                        <p className="font-semibold">Your submission wasn&apos;t sent.</p>
                        <p className="mt-1 text-mist">{serverError} Your details are still here — you can try again.</p>
                      </>
                    ) : (
                      <p>
                        Please check{" "}
                        {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} below.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Honeypot — hidden from people and assistive tech */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {step === 0 && (
                    <div>
                      <p className="eyebrow flex items-center gap-2.5 [@media(max-height:700px)]:hidden">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />
                        Grailz Co · Sell your cards
                      </p>
                      <h1
                        id="step-0-title"
                        tabIndex={-1}
                        className="mt-4 font-display text-[clamp(2.1rem,4.4vw,3.25rem)] font-bold leading-[0.98] tracking-[-0.045em] text-white outline-none"
                      >
                        Let&apos;s see what
                        <br />
                        you&apos;ve <span className="text-mint">got.</span>
                      </h1>
                      <p className="lede mt-4 max-w-xl">
                        Answer a few quick questions and share some photos. Every submission is reviewed individually,
                        with no pressure and no obligation.
                      </p>
                      <ul className="mt-6 grid gap-3 sm:grid-cols-3 [@media(max-height:700px)]:mt-4 [@media(max-height:700px)]:gap-2">
                        {INTRO_POINTS.map(({ icon: Icon, title, body }) => (
                          <li key={title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-navy/50 p-4 [@media(max-height:700px)]:p-2.5">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint/10 text-mint [@media(max-height:700px)]:size-8">
                              <Icon aria-hidden="true" className="size-[1.1rem]" />
                            </span>
                            <span>
                              <span className="block text-[0.95rem] font-semibold text-white">{title}</span>
                              <span className="mt-0.5 block text-sm leading-snug text-mist [@media(max-height:700px)]:hidden">
                                {body}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step === 1 && (
                    <>
                      <StepTitle
                        id="step-1-title"
                        eyebrow="Step 1 · Your collection"
                        title="What are you looking to sell?"
                        hint="Pick the one that fits best. You'll add the details in a moment."
                      />
                      <OptionList
                        name="collectionType"
                        labelledBy="step-1-title"
                        options={COLLECTION_TYPES}
                        value={collectionType}
                        onPick={pick(setCollectionType, "collectionType")}
                        error={errors.collectionType}
                      />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <StepTitle
                        id="step-2-title"
                        eyebrow="Step 2 · Era"
                        title="When is most of it from?"
                        hint="A rough idea is plenty."
                      />
                      <OptionList
                        name="era"
                        labelledBy="step-2-title"
                        options={ERA_OPTIONS}
                        value={era}
                        onPick={pick(setEra, "era")}
                        error={errors.era}
                      />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <StepTitle
                        id="step-3-title"
                        eyebrow="Step 3 · Value"
                        title="Roughly what's it worth?"
                        hint="Your best estimate is totally fine. This just helps us review it."
                      />
                      <OptionList
                        name="value"
                        labelledBy="step-3-title"
                        options={VALUE_OPTIONS}
                        value={value}
                        onPick={pick(setValue, "value")}
                        error={errors.value}
                      />
                    </>
                  )}

                  {step === 4 && (
                    <fieldset disabled={busy} className="mx-0 min-w-0 border-0 p-0">
                      <StepTitle
                        id="step-4-title"
                        eyebrow="Step 4 · Your cards"
                        title="Tell us about your cards"
                        hint="Add each card you'd like us to look at, with photos. For big collections, add the highlights and describe the rest."
                      />
                      <div className="mt-8">
                        <ol className="space-y-6">
                          <AnimatePresence initial={false}>
                            {cards.map((card, i) => {
                              const k = (f: string) => errors[`cards.${i}.${f}`];
                              const pid = `card-${card.id}`;
                              return (
                                <motion.li
                                  key={card.id}
                                  layout="position"
                                  initial={{ opacity: 0, y: 16 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                  transition={{ duration: 0.45, ease: EASE }}
                                  className="hairline relative rounded-[1.5rem] bg-navy-800/70 p-5 sm:p-7"
                                  aria-labelledby={`${pid}-title`}
                                  onFocusCapture={() => setActiveId(card.id)}
                                >
                                  <div className="mb-6 flex items-center justify-between gap-4">
                                    <h3
                                      id={`${pid}-title`}
                                      className="flex items-center gap-3 font-display text-xl font-semibold tracking-[-0.02em]"
                                    >
                                      <span className="rounded-md bg-mint/10 px-2 py-1 font-mono text-xs text-mint">
                                        {String(i + 1).padStart(2, "0")}
                                      </span>
                                      {card.name.trim() ? (
                                        <span className="truncate">{card.name}</span>
                                      ) : (
                                        `Card ${i + 1}`
                                      )}
                                    </h3>
                                    {cards.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeCard(card.id)}
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm text-mist transition-colors hover:bg-white/5 hover:text-white"
                                        aria-label={`Remove card ${i + 1}${card.name ? ` (${card.name})` : ""}`}
                                      >
                                        <Trash2 aria-hidden="true" className="size-4" />
                                        Remove
                                      </button>
                                    )}
                                  </div>

                                  <div className="grid gap-6 md:grid-cols-6">
                                    <TextField
                                      id={`${pid}-name`}
                                      label="Card name or description"
                                      required
                                      placeholder="e.g. Charizard holo, Base Set"
                                      maxLength={LIMITS.text.cardName}
                                      value={card.name}
                                      error={k("name")}
                                      onChange={(e) => setCardField(i, card.id, "name", e.target.value)}
                                      className="md:col-span-6"
                                    />
                                    <SelectField
                                      id={`${pid}-category`}
                                      label="Category"
                                      options={CATEGORY_OPTIONS}
                                      value={card.category}
                                      error={k("category")}
                                      onChange={(e) => setCardField(i, card.id, "category", e.target.value)}
                                      className="md:col-span-3"
                                    />
                                    <TextField
                                      id={`${pid}-set`}
                                      label="Set or release"
                                      placeholder="e.g. Base Set, Evolving Skies"
                                      maxLength={LIMITS.text.set}
                                      value={card.set}
                                      error={k("set")}
                                      onChange={(e) => setCardField(i, card.id, "set", e.target.value)}
                                      className="md:col-span-3"
                                    />
                                    <SelectField
                                      id={`${pid}-condition`}
                                      label="Condition"
                                      required
                                      options={CONDITION_OPTIONS}
                                      value={card.condition}
                                      error={k("condition")}
                                      onChange={(e) => setCardField(i, card.id, "condition", e.target.value)}
                                      className="md:col-span-2"
                                    />
                                    <SelectField
                                      id={`${pid}-grading`}
                                      label="Grading status"
                                      required
                                      options={GRADING_OPTIONS}
                                      value={card.grading}
                                      error={k("grading")}
                                      onChange={(e) => setCardField(i, card.id, "grading", e.target.value)}
                                      className="md:col-span-2"
                                    />
                                    <TextField
                                      id={`${pid}-quantity`}
                                      label="Quantity"
                                      required
                                      type="number"
                                      inputMode="numeric"
                                      min={1}
                                      max={9999}
                                      step={1}
                                      value={card.quantity}
                                      error={k("quantity")}
                                      onChange={(e) => setCardField(i, card.id, "quantity", e.target.value)}
                                      className="md:col-span-2"
                                    />
                                    <TextField
                                      id={`${pid}-askingPrice`}
                                      label="Asking price"
                                      placeholder="If you have one in mind"
                                      maxLength={LIMITS.text.askingPrice}
                                      value={card.askingPrice}
                                      error={k("askingPrice")}
                                      onChange={(e) => setCardField(i, card.id, "askingPrice", e.target.value)}
                                      className="md:col-span-6"
                                    />
                                    <TextArea
                                      id={`${pid}-notes`}
                                      label="Additional information"
                                      placeholder="Edition, language, notable wear, grade and cert number, or details about a larger collection."
                                      maxLength={LIMITS.text.notes}
                                      value={card.notes}
                                      error={k("notes")}
                                      onChange={(e) => setCardField(i, card.id, "notes", e.target.value)}
                                      className="md:col-span-6"
                                    />
                                    <div className="md:col-span-6" data-error={!!k("images") || undefined}>
                                      <ImageDropzone
                                        cardNumber={i + 1}
                                        images={card.images}
                                        messages={card.messages}
                                        disabled={busy}
                                        error={k("images")}
                                        onAdd={(files) => addImages(card.id, i, files)}
                                        onRemove={(imgId) => removeImage(card.id, imgId)}
                                      />
                                    </div>
                                  </div>
                                </motion.li>
                              );
                            })}
                          </AnimatePresence>
                        </ol>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={addCard}
                            disabled={cards.length >= LIMITS.maxCards}
                            className="group inline-flex h-12 items-center gap-2.5 self-start rounded-full border border-dashed border-mint/50 px-5 text-[0.95rem] font-semibold text-mint transition-colors hover:border-mint hover:bg-mint/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Plus aria-hidden="true" className="size-4 transition-transform group-hover:rotate-90" />
                            Add another card
                          </button>
                          <p className="font-mono text-xs text-haze" aria-live="polite">
                            {cards.length}/{LIMITS.maxCards} cards · {allImages.length}/{LIMITS.maxImagesTotal} photos ·{" "}
                            {formatBytes(totalBytes)} of {LIMITS.maxTotalMB} MB
                          </p>
                        </div>
                        {errors.images && (
                          <p data-error="true" tabIndex={-1} className="mt-4 text-sm font-medium text-[#ff9a9a]">
                            {errors.images}
                          </p>
                        )}
                        {errors.cards && <p className="mt-4 text-sm font-medium text-[#ff9a9a]">{errors.cards}</p>}
                      </div>
                      <div className="mt-6 rounded-[1.5rem] border border-line bg-navy-900/40 p-5">
                        <LivePreview
                          compact
                          cards={previewCards}
                          activeIndex={activeIndex}
                          onSelect={(i) => setActiveId(cards[i].id)}
                        />
                      </div>
                    </fieldset>
                  )}

                  {step === 5 && (
                    <fieldset disabled={busy} className="mx-0 min-w-0 border-0 p-0">
                      <StepTitle
                        id="step-5-title"
                        eyebrow="Last step"
                        title="Where should we reach you?"
                        hint="We'll use these details to follow up about your submission. Fields marked * are required."
                      />
                      <div className="mt-5 space-y-4">
                        <div className="grid gap-x-5 gap-y-4 md:grid-cols-6">
                          <TextField
                            id="fullName"
                            label="Full name"
                            required
                            autoComplete="name"
                            maxLength={LIMITS.text.name}
                            value={fullName}
                            error={errors.fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              clearError("fullName");
                            }}
                            className="md:col-span-2"
                          />
                          <TextField
                            id="email"
                            label="Email address"
                            type="email"
                            inputMode="email"
                            required
                            autoComplete="email"
                            maxLength={LIMITS.text.email}
                            value={email}
                            error={errors.email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearError("email");
                            }}
                            className="md:col-span-2"
                          />
                          <TextField
                            id="phone"
                            label="Phone number"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            maxLength={LIMITS.text.phone}
                            value={phone}
                            error={errors.phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              clearError("phone");
                            }}
                            className="md:col-span-2"
                          />
                          <div className="md:col-span-3">
                            <ChipGroup
                              label="Best way to reach you"
                              options={CONTACT_METHODS}
                              value={contactMethod}
                              onChange={setContactMethod}
                            />
                          </div>
                          <div className="md:col-span-3">
                            <ChipGroup label="Best time" options={BEST_TIMES} value={bestTime} onChange={setBestTime} />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="consent" className="flex cursor-pointer items-start gap-4">
                            <span className="relative mt-0.5 flex size-6 shrink-0">
                              <input
                                id="consent"
                                type="checkbox"
                                checked={consent}
                                aria-invalid={!!errors.consent || undefined}
                                aria-describedby={errors.consent ? "consent-error" : undefined}
                                onChange={(e) => {
                                  setConsent(e.target.checked);
                                  clearError("consent");
                                }}
                                className={cn(
                                  "peer size-6 cursor-pointer appearance-none rounded-md border bg-navy-900 transition-colors checked:border-mint checked:bg-mint",
                                  errors.consent ? "border-[#ff9a9a]" : "border-white/30",
                                )}
                              />
                              <Check
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 m-auto size-4 text-navy opacity-0 peer-checked:opacity-100"
                                strokeWidth={3}
                              />
                            </span>
                            <span className="text-[0.95rem] leading-relaxed text-white/90">
                              I understand that the information and photos I provide will be used by Grailz Co to review
                              my submission and respond to me.{" "}
                              <span className="text-mint" aria-hidden="true">
                                *
                              </span>
                            </span>
                          </label>
                          {errors.consent && (
                            <p id="consent-error" className="mt-3 pl-10 text-sm font-medium text-[#ff9a9a]">
                              {errors.consent}
                            </p>
                          )}

                          <p className="sr-only" aria-live="assertive">
                            {busy ? "Submitting your cards, please wait." : ""}
                          </p>
                        </div>
                      </div>
                    </fieldset>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pinned actions */}
            <div className="shrink-0 border-t border-line bg-navy-800/90 px-6 py-3 sm:px-10 sm:py-4">
              {step === 0 && (
                <Button type="button" size="lg" onClick={() => setStep(1)} className="!h-12 w-full">
                  Let&apos;s get started <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              )}
              {step >= 1 && step <= 4 && (
                <Button type="button" size="lg" onClick={next} disabled={step === 4 && processing} className="w-full">
                  Continue <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              )}
              {step === LAST && (
                <Button type="submit" size="lg" icon={busy ? "none" : "arrow"} disabled={busy} className="!h-12 w-full">
                  {busy ? (
                    <span className="inline-flex items-center gap-2.5">
                      <Loader2 aria-hidden="true" className="size-5 animate-spin" />
                      {progress < 100 ? `Uploading… ${progress}%` : "Sending…"}
                    </span>
                  ) : (
                    "Submit Your Cards"
                  )}
                </Button>
              )}
              {busy ? (
                <div
                  className="mx-auto mt-3 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label="Upload progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div className="h-full bg-mint transition-[width] duration-200" style={{ width: `${progress}%` }} />
                </div>
              ) : (
                <p className="mt-2 flex items-center justify-center gap-2 text-center text-[0.7rem] text-haze [@media(max-height:700px)]:hidden">
                  <Lock aria-hidden="true" className="size-3.5" />
                  {step >= 1 && step <= 3
                    ? "Tap an answer to continue · Your details stay private"
                    : step === LAST
                      ? submissionNotice
                      : "Your details are only used to review and respond to your submission."}
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type UploadResult = { ok: true } | { ok: false; error: string; fieldErrors?: FieldErrors };

/** POST with upload progress. Resolves ok only when the server confirms delivery. */
function upload(body: FormData, onProgress: (p: number) => void): Promise<UploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/submit");
    xhr.responseType = "json";
    xhr.timeout = 120_000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const data = xhr.response as { ok?: boolean; error?: string; fieldErrors?: FieldErrors } | null;
      if (xhr.status >= 200 && xhr.status < 300 && data?.ok === true) return resolve({ ok: true });
      resolve({
        ok: false,
        error: data?.error ?? `Something went wrong on our side (error ${xhr.status}).`,
        fieldErrors: data?.fieldErrors,
      });
    };
    xhr.onerror = () => resolve({ ok: false, error: "We couldn't reach the server. Please check your connection." });
    xhr.ontimeout = () =>
      resolve({ ok: false, error: "The upload took too long. Please try again, perhaps with fewer photos." });
    xhr.send(body);
  });
}
