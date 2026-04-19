import { Logo } from "@/components/Logo"
import { navigate } from "@/hooks/useHashRoute"
import { allConcepts, categories } from "@/content/concepts"
import { allExercises } from "@/content/exercises"
import { ArrowRight, Dumbbell } from "lucide-react"

export function WelcomePage() {
  return (
    <div className="flex min-h-[calc(100vh-84px)] items-center justify-center px-8 py-20">
      <div className="flex flex-col items-center text-center max-w-[420px]">

        {/* Logo */}
        <Logo className="mb-8 h-8 w-auto" />

        {/* Title */}
        <h1 className="font-mono text-[30px] font-medium leading-none text-[var(--color-fg)]">
          React Dojo
        </h1>

        {/* Description */}
        <p className="mt-4 text-[16px] leading-[1.7] text-[var(--color-fg-muted)]">
          React se aprende practicando. Cada concepto tiene explicación, playground interactivo y ejercicios de código real — sin atajos.
        </p>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-4 text-[12px] text-[var(--color-fg-dim)]">
          <span>{allConcepts.length} conceptos</span>
          <span className="h-3 w-px bg-[var(--color-fg-faint)]" />
          <span>{allExercises.length} ejercicios</span>
          <span className="h-3 w-px bg-[var(--color-fg-faint)]" />
          <span>{categories.length} categorías</span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate(allConcepts[0].id)}
            className="flex items-center gap-2 rounded-md border border-[var(--color-fg)] bg-[var(--color-fg)] px-5 py-2.5 text-[13px] font-medium text-[var(--color-bg)] transition-opacity hover:opacity-80"
          >
            Comenzar
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button
            onClick={() => navigate(`learn/${allExercises[0].id}`)}
            className="flex items-center gap-2 rounded-md border border-[var(--color-line-strong)] px-5 py-2.5 text-[13px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
          >
            <Dumbbell className="h-3.5 w-3.5" strokeWidth={1.8} />
            Practicar
          </button>
        </div>

      </div>
    </div>
  )
}
