import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold tracking-[-0.01em] transition-[color,background-color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-grail)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-mint text-navy shadow-[0_0_0_0_rgb(55_245_199/0)] hover:shadow-[0_10px_40px_-10px_rgb(55_245_199/0.65)]",
  outline: "border border-white/20 text-white hover:border-mint/70 hover:text-mint",
  ghost: "text-white hover:text-mint",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base md:h-[3.75rem] md:px-8 md:text-[1.05rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  icon?: "arrow" | "external" | "none";
};

function Inner({ children, icon = "arrow", variant }: Pick<CommonProps, "children" | "icon" | "variant">) {
  const Icon = icon === "external" ? ArrowUpRight : ArrowRight;
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-white/35 transition-transform duration-500 ease-[var(--ease-grail)] [clip-path:polygon(0_0,85%_0,100%_100%,15%_100%)] group-hover/btn:translate-x-full"
        />
      )}
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
      {icon !== "none" && (
        <Icon
          aria-hidden="true"
          className={cn(
            "relative size-[1.1em] transition-transform duration-300 ease-[var(--ease-grail)]",
            icon === "external"
              ? "group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
              : "group-hover/btn:translate-x-1",
          )}
        />
      )}
    </>
  );
}

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

export function ButtonLink({ href, external, variant = "primary", size = "md", className, children, icon, ...rest }: LinkProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        <Inner variant={variant} icon={icon ?? "external"}>
          {children}
        </Inner>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner variant={variant} icon={icon}>
        {children}
      </Inner>
    </Link>
  );
}

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", size = "md", className, children, icon = "none", ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner variant={variant} icon={icon}>
        {children}
      </Inner>
    </button>
  );
}
