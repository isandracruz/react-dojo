import { Origami } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return <Origami className={className} color="#61DAFB" strokeWidth={1.5} aria-hidden />
}
