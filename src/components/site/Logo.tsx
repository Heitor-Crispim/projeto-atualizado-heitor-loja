import { Link } from "@tanstack/react-router";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const color = variant === "dark" ? "text-foreground" : "text-white";
  return (
    <Link to="/" className={`flex items-center gap-2 ${color} group`}>
      <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand transition-transform group-hover:scale-125" />
      <span className="font-display text-base font-bold tracking-[0.18em] uppercase">
        Marcio Alegre
      </span>
    </Link>
  );
}
