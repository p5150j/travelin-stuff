import FadeUp from "./FadeUp";

interface Props {
  /** Tiny letterspaced label above the title. Omitted when there's nothing to say. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/**
 * The eyebrow + display-title + subtitle block at the top of /blog, /cities and
 * /cities/[city]. Extracted because all three had byte-identical class strings —
 * three copies of a type scale is three chances for it to drift.
 */
export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <FadeUp className="border-b border-border pb-10 mb-12">
      {eyebrow && <p className="label mb-5 block">{eyebrow}</p>}
      <h1 className="font-serif text-[2.75rem] sm:text-6xl font-bold text-ink leading-[0.98] tracking-[-0.025em]">
        {title}
      </h1>
      {subtitle && <p className="text-muted mt-4 text-[1.0625rem]">{subtitle}</p>}
    </FadeUp>
  );
}
