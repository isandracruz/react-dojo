import { useState } from "react"
import { Lightbulb, BookOpen, CheckCircle2, Circle } from "lucide-react"
import { Playground } from "@/components/Playground"
import { navigate } from "@/hooks/useHashRoute"
import { cn } from "@/lib/utils"
import type { Exercise } from "@/content/exercises"
import { useProgress } from "@/hooks/useProgress"

interface ExercisePageProps {
  exercise: Exercise
  prev?: Exercise
  next?: Exercise
}

const difficultyColor: Record<string, string> = {
  "básico":     "text-[var(--color-fg-dim)]",
  "intermedio": "text-[var(--color-fg-muted)]",
  "avanzado":   "text-[var(--color-fg)]",
}

export function ExercisePage({ exercise, prev, next }: ExercisePageProps) {
  const [showSolution, setShowSolution] = useState(false)
  const { completedExercises, toggleExerciseCompleted } = useProgress()
  const isCompleted = completedExercises.has(exercise.id)

  return (
    <article className="mx-auto max-w-[1000px] px-8 py-20 md:px-12 md:py-28">
      {/* Kicker */}
      <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
        <span>práctica</span>
        <span className="h-px w-4 bg-[var(--color-fg-faint)]" />
        <span className={difficultyColor[exercise.difficulty] ?? "text-[var(--color-fg-dim)]"}>
          {exercise.difficulty}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-mono text-[32px] font-medium leading-none text-[var(--color-fg)]">
        {exercise.title}
      </h1>

      {/* Lede */}
      <p className="mt-6 text-[17px] leading-[1.65] text-[var(--color-fg-muted)]">
        {exercise.lede}
      </p>

      <hr className="mt-12 border-none border-t border-[var(--color-line)]" />

      {/* Objetivos */}
      <section className="mt-10">
        <h2 className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
          Objetivos
        </h2>
        <ol className="space-y-2">
          {exercise.objectives.map((o, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.65] text-[var(--color-fg-muted)]">
              <span className="mt-[1px] shrink-0 font-mono text-[12px] text-[var(--color-fg-faint)] w-4 text-right">
                {i + 1}.
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Playground */}
      <section className="mt-12">
        <div className="mb-2 flex items-center justify-between text-[11px] text-[var(--color-fg-dim)]">
          <span>{showSolution ? "solución" : "tu código"}</span>
          <button
            onClick={() => setShowSolution((v) => !v)}
            className={cn(
              "transition-colors text-[11px]",
              showSolution
                ? "text-[var(--color-fg)]"
                : "text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]",
            )}
          >
            {showSolution ? "← volver al starter" : "ver solución →"}
          </button>
        </div>
        <div className={showSolution ? "hidden" : ""}>
          <Playground
            key={`${exercise.id}-start`}
            files={exercise.starter}
            dependencies={exercise.dependencies}
          />
        </div>
        <div className={showSolution ? "" : "hidden"}>
          <Playground
            key={`${exercise.id}-sol`}
            files={exercise.solution}
            dependencies={exercise.dependencies}
          />
        </div>
      </section>

      {/* Hint */}
      {exercise.hint && (
        <section className="mt-8">
          <details className="group">
            <summary className="cursor-pointer select-none text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)] hover:text-[var(--color-fg)] transition-colors list-none flex items-center gap-2">
              <Lightbulb className="h-[13px] w-[13px]" strokeWidth={1.8} />
              <span>Pista</span>
            </summary>
            <p className="mt-3 rounded-md border border-[var(--color-line)] px-4 py-3 text-[14px] leading-[1.65] text-[var(--color-fg-muted)]">
              {exercise.hint}
            </p>
          </details>
        </section>
      )}

      {/* Conceptos relacionados */}
      {exercise.relatedConcepts && exercise.relatedConcepts.length > 0 && (
        <section className="mt-10">
          <h3 className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
            <BookOpen className="h-[13px] w-[13px]" strokeWidth={1.8} />
            Conceptos relacionados
          </h3>
          <div className="flex flex-wrap gap-2">
            {exercise.relatedConcepts.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); navigate(id) }}
                className="inline-block rounded border border-[var(--color-line)] px-3 py-1 font-mono text-[13px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-line-strong)] hover:text-[var(--color-fg)]"
              >
                {id}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Marcar como completado */}
      <div className="mt-12">
        <button
          onClick={() => toggleExerciseCompleted(exercise.id)}
          className={cn(
            "flex items-center gap-2 rounded-md border px-4 py-2 text-[14px] transition-colors",
            isCompleted
              ? "border-green-500/40 bg-green-500/5 text-green-600 dark:text-green-400"
              : "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-[15px] w-[15px]" strokeWidth={1.8} />
          ) : (
            <Circle className="h-[15px] w-[15px]" strokeWidth={1.8} />
          )}
          {isCompleted ? "Completado" : "Marcar como completado"}
        </button>
      </div>

      {/* Footer nav */}
      <nav className="mt-14 flex items-start justify-between gap-8 border-t border-[var(--color-line)] pt-8 text-[14px]">
        {prev ? (
          <a
            href={`#learn/${prev.id}`}
            onClick={(e) => { e.preventDefault(); navigate(`learn/${prev.id}`) }}
            className="group flex flex-col gap-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            <span className="text-[12px] text-[var(--color-fg-dim)]">← anterior</span>
            <span className="text-[var(--color-fg)]">{prev.label}</span>
          </a>
        ) : <span />}
        {next ? (
          <a
            href={`#learn/${next.id}`}
            onClick={(e) => { e.preventDefault(); navigate(`learn/${next.id}`) }}
            className="group flex flex-col items-end gap-1 text-right text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            <span className="text-[12px] text-[var(--color-fg-dim)]">siguiente →</span>
            <span className="text-[var(--color-fg)]">{next.label}</span>
          </a>
        ) : <span />}
      </nav>
    </article>
  )
}
