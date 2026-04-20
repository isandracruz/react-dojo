import { useEffect, useRef } from "react"
import { type Concept } from "@/content/concepts"
import { navigate } from "@/hooks/useHashRoute"
import { useProgress } from "@/hooks/useProgress"

interface ConceptPageProps {
  concept: Concept
  prev?: Concept
  next?: Concept
}

export function ConceptPage({ concept, prev, next }: ConceptPageProps) {
  const { markConceptVisited } = useProgress()
  const bottomRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = bottomRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) markConceptVisited(concept.id) },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [concept.id, markConceptVisited])

  return (
    <article className="mx-auto max-w-[720px] px-8 py-20 md:px-12 md:py-28">
      {/* Kicker */}
      <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
        <span>{concept.kicker}</span>
      </div>

      {/* Hook name */}
      <h1 className="font-mono text-[32px] font-medium leading-none text-[var(--color-fg)]">
        {concept.label}
      </h1>

      {/* Tagline */}
      <p className="mt-3 text-[15px] font-medium text-[var(--color-fg-muted)]">
        {concept.title}
      </p>

      {/* Lede */}
      <p className="mt-6 text-[17px] leading-[1.65] text-[var(--color-fg-muted)]">
        {concept.lede}
      </p>

      {/* Divider */}
      <hr className="mt-12 border-none border-t border-[var(--color-line)]" />

      {/* Sections */}
      <div className="mt-10 space-y-10">
        {concept.sections.map((s, i) => (
          <section key={i}>
            {s.heading && (
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-fg)]">
                {s.heading}
              </h2>
            )}
            <div className="prose">{s.body}</div>
          </section>
        ))}
      </div>

      {/* Playground — rompe el contenedor para usar más ancho */}
      <div className="mt-12 -mx-8 md:-mx-12 lg:-mx-24">{concept.playground}</div>

      {/* Pitfalls */}
      {concept.pitfalls && concept.pitfalls.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
            Tropiezos comunes
          </h2>
          <ul className="rounded-lg border border-[var(--color-line)] overflow-hidden">
            {concept.pitfalls.map((p, i) => (
              <li
                key={i}
                className="flex gap-4 px-5 py-4 text-[14px] leading-[1.65] text-[var(--color-fg-muted)] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[var(--color-line)]"
              >
                <span className="mt-[1px] shrink-0 font-mono text-[11px] text-[var(--color-fg-faint)] w-4 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer nav */}
      <nav ref={bottomRef} className="mt-24 flex items-start justify-between gap-8 border-t border-[var(--color-line)] pt-8 text-[14px]">
        {prev ? (
          <a
            href={`#${prev.id}`}
            onClick={(e) => { e.preventDefault(); navigate(prev.id) }}
            className="group flex flex-col gap-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            <span className="text-[12px] text-[var(--color-fg-dim)]">← anterior</span>
            <span className="font-mono text-[var(--color-fg)]">{prev.label}</span>
          </a>
        ) : <span />}
        {next ? (
          <a
            href={`#${next.id}`}
            onClick={(e) => { e.preventDefault(); navigate(next.id) }}
            className="group flex flex-col items-end gap-1 text-right text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            <span className="text-[12px] text-[var(--color-fg-dim)]">siguiente →</span>
            <span className="font-mono text-[var(--color-fg)]">{next.label}</span>
          </a>
        ) : <span />}
      </nav>
    </article>
  )
}
