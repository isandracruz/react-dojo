import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"
import { navigate } from "@/hooks/useHashRoute"
import type { Quiz } from "@/content/quiz"
import { allQuizzes } from "@/content/quiz"
import { useProgress } from "@/hooks/useProgress"

interface QuizPageProps {
  quiz: Quiz
}

type AnswerState = "unanswered" | "correct" | "wrong"

interface QuizSession {
  currentIndex: number
  selected: number | null
  score: number
  finished: boolean
}

function sessionKey(id: string) {
  return `react-dojo-quiz-session-${id}`
}

function loadSession(id: string): QuizSession {
  try {
    const raw = localStorage.getItem(sessionKey(id))
    if (raw) return JSON.parse(raw)
  } catch {}
  return { currentIndex: 0, selected: null, score: 0, finished: false }
}

function saveSession(id: string, session: QuizSession) {
  localStorage.setItem(sessionKey(id), JSON.stringify(session))
}

function clearSession(id: string) {
  localStorage.removeItem(sessionKey(id))
}

export function QuizPage({ quiz }: QuizPageProps) {
  const initial = loadSession(quiz.id)
  const [currentIndex, setCurrentIndex] = useState(initial.currentIndex)
  const [selected, setSelected] = useState<number | null>(initial.selected)
  const [score, setScore] = useState(initial.score)
  const [finished, setFinished] = useState(initial.finished)

  const { saveQuizScore } = useProgress()
  const question = quiz.questions[currentIndex]
  const total = quiz.questions.length
  const answered = selected !== null

  useEffect(() => {
    saveSession(quiz.id, { currentIndex, selected, score, finished })
  }, [quiz.id, currentIndex, selected, score, finished])

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
    if (index === question.correctIndex) setScore((s) => s + 1)
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  function handleRestart() {
    clearSession(quiz.id)
    setCurrentIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  useEffect(() => {
    if (!finished) return
    const pct = Math.round((score / total) * 100)
    saveQuizScore(quiz.id, pct)
    if (pct >= 80) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
    }
  }, [finished, quiz.id, score, total, saveQuizScore])

  if (finished) {
    const pct = Math.round((score / total) * 100)
    return (
      <article className="mx-auto max-w-[640px] px-8 py-20 md:px-12 md:py-28">
        <div className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
          Quiz · {quiz.label}
        </div>
        <h1 className="font-mono text-[32px] font-medium leading-none text-[var(--color-fg)]">
          Resultado
        </h1>

        <div className="mt-12 rounded-xl border border-[var(--color-line)] p-8 text-center">
          <div className="font-mono text-[64px] font-medium leading-none text-[var(--color-fg)]">
            {score}/{total}
          </div>
          <div className="mt-3 text-[15px] text-[var(--color-fg-muted)]">
            {pct >= 80
              ? "Excelente — estás listo para la entrevista."
              : pct >= 50
              ? "Bien, pero repasa los temas que fallaste."
              : "Sigue practicando — vuelve a los conceptos."}
          </div>

          <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
            <div
              className="h-full rounded-full bg-[var(--color-fg)] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-right font-mono text-[12px] text-[var(--color-fg-dim)]">
            {pct}%
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleRestart}
            className="rounded-md border border-[var(--color-line)] px-4 py-2 text-[14px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            Reintentar
          </button>
          <div className="flex gap-2">
            {allQuizzes
              .filter((q) => q.id !== quiz.id)
              .map((q) => (
                <button
                  key={q.id}
                  onClick={() => navigate(`quiz/${q.id}`)}
                  className="rounded-md border border-[var(--color-line)] px-4 py-2 text-[14px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  {q.label}
                </button>
              ))}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="mx-auto max-w-[640px] px-8 py-20 md:px-12 md:py-28">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
          Quiz · {quiz.label}
        </span>
        <span className="font-mono text-[12px] text-[var(--color-fg-dim)]">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-10 h-[2px] w-full overflow-hidden rounded-full bg-[var(--color-line)]">
        <div
          className="h-full rounded-full bg-[var(--color-fg)] transition-all duration-300"
          style={{ width: `${((currentIndex + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <h2 className="text-[22px] font-medium leading-[1.4] text-[var(--color-fg)]">
        {question.question}
      </h2>

      <ul className="mt-8 space-y-3">
        {question.options.map((option, i) => {
          let state: AnswerState = "unanswered"
          if (answered) {
            if (i === question.correctIndex) state = "correct"
            else if (i === selected) state = "wrong"
          }

          return (
            <li key={i}>
              <button
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={cn(
                  "w-full rounded-lg border px-5 py-4 text-left text-[14px] leading-[1.5] transition-colors",
                  answered ? "cursor-default" : "cursor-pointer",
                  !answered &&
                    "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                  state === "correct" &&
                    "border-green-500/40 bg-green-500/5 text-[var(--color-fg)]",
                  state === "wrong" &&
                    "border-red-500/40 bg-red-500/5 text-[var(--color-fg-muted)]",
                  state === "unanswered" &&
                    answered &&
                    "border-[var(--color-line)] text-[var(--color-fg-faint)]",
                )}
              >
                <span className="mr-3 font-mono text-[12px] text-[var(--color-fg-dim)]">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <div className="mt-6 rounded-lg border border-[var(--color-line)] bg-[var(--color-bg-raise)] px-5 py-4">
          <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-dim)]">
            {selected === question.correctIndex ? "Correcto" : "Incorrecto"}
          </div>
          <p className="text-[14px] leading-[1.65] text-[var(--color-fg-muted)]">
            {question.explanation}
          </p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="mt-6 rounded-md bg-[var(--color-fg)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-bg)] transition-opacity hover:opacity-80"
        >
          {currentIndex < total - 1 ? "Siguiente →" : "Ver resultado"}
        </button>
      )}
    </article>
  )
}
