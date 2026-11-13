import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const control =
  "peer w-full rounded-xl border bg-navy-900/60 px-4 text-[1rem] text-white placeholder:text-haze transition-[border-color,box-shadow,background-color] duration-200 hover:border-white/30 focus:border-mint focus:bg-navy-900 focus:shadow-[0_0_0_4px_rgb(55_245_199/0.14)] focus:outline-none";

type BaseProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
};

function Label({ id, label, required }: Pick<BaseProps, "id" | "label" | "required">) {
  return (
    <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[0.92rem] font-medium text-white/90">
      <span>
        {label}
        {required && (
          <span className="ml-1 text-mint" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {!required && <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-haze">Optional</span>}
    </label>
  );
}

function Meta({ id, error, hint }: Pick<BaseProps, "id" | "error" | "hint">) {
  return (
    <>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-haze">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm font-medium text-[#ff9a9a]">
          <span aria-hidden="true" className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[#ff9a9a]" />
          {error}
        </p>
      )}
    </>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

type InputProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

export function TextField({ id, label, required, error, hint, className, ...rest }: InputProps) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <input
        id={id}
        name={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "h-[3.25rem]", error ? "border-[#ff9a9a]/70" : "border-white/15")}
        {...rest}
      />
      <Meta id={id} error={error} hint={hint} />
    </div>
  );
}

type SelectProps = BaseProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> & {
    options: readonly string[];
    placeholder?: string;
  };

export function SelectField({ id, label, required, error, hint, className, options, placeholder = "Select…", ...rest }: SelectProps) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          name={id}
          required={required}
          aria-required={required || undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(
            control,
            "h-[3.25rem] cursor-pointer appearance-none pr-11 invalid:text-haze [&>option]:bg-navy [&>option]:text-white",
            error ? "border-[#ff9a9a]/70" : "border-white/15",
          )}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mist" />
      </div>
      <Meta id={id} error={error} hint={hint} />
    </div>
  );
}

type AreaProps = BaseProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

export function TextArea({ id, label, required, error, hint, className, ...rest }: AreaProps) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} />
      <textarea
        id={id}
        name={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "min-h-[8rem] resize-y py-3.5 leading-relaxed", error ? "border-[#ff9a9a]/70" : "border-white/15")}
        {...rest}
      />
      <Meta id={id} error={error} hint={hint} />
    </div>
  );
}

export function FieldsetHeading({ index, title, description }: { index: string; title: string; description?: string }) {
  return (
    <legend className="mb-8 w-full p-0">
      <span className="flex items-center gap-4">
        <span className="flex size-9 items-center justify-center rounded-full border border-mint/50 font-mono text-xs text-mint">{index}</span>
        <span className="font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-white md:text-[1.85rem]">{title}</span>
      </span>
      {description && <span className="mt-2 block pl-[3.25rem] text-[0.95rem] text-mist">{description}</span>}
    </legend>
  );
}
