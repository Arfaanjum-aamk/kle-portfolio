import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import heroPhoto from '@/assets/kletu-school-of-mechanical-engineering.webp'
import mobilePhoto from '@/assets/kletu-school-mobile-crop.webp'
import { Logo } from '@/components/Logo'

/** Technical corner mark, purely decorative. */
function BlueprintAccents() {
  return (
    <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
      <g fill="none" stroke="rgba(56,189,248,0.55)" strokeWidth="1.5">
        <path d="M28 64V28h36" />
      </g>
    </svg>
  )
}

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]">
      {/* Photo panel: left on desktop, compact crop on top for mobile */}
      <section className="relative isolate overflow-hidden bg-ink-900 lg:min-h-screen" aria-label="KLE Technological University School of Mechanical Engineering">
        <picture>
          <source media="(min-width: 1024px)" srcSet={heroPhoto} />
          <img
            src={mobilePhoto}
            alt="KLE Technological University School of Mechanical Engineering building with its angular glass facade"
            className="h-60 w-full object-cover object-[50%_15%] sm:h-72 lg:absolute lg:inset-0 lg:h-full lg:object-[50%_30%]"
            fetchPriority="high"
          />
        </picture>
        {/* Overlay keeps text legible while leaving the building visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/30 to-ink-950/40 lg:bg-gradient-to-tr lg:from-ink-950/90 lg:via-ink-950/15 lg:to-ink-950/35" />
        <div className="blueprint-grid absolute inset-0 hidden opacity-70 lg:block" />
        <BlueprintAccents />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-12">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9 lg:h-11 lg:w-11" />
            <div>
              <p className="font-display text-base font-semibold leading-tight text-white sm:text-lg lg:text-2xl">Engineering Portfolio Studio</p>
              <p className="text-xs text-steel-300 lg:text-sm">KLE Technological University</p>
            </div>
          </div>
          <p className="mt-3 hidden font-mono text-sm tracking-[0.2em] text-amber-eng lg:block">DESIGN. ANALYSE. BUILD. TEST. IMPROVE.</p>
          <p className="mt-2 text-[11px] font-mono tracking-widest text-amber-eng lg:hidden">Design. Analyse. Build. Test. Improve.</p>
        </div>
      </section>

      {/* Form panel */}
      <main className="flex flex-col justify-center px-5 py-8 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-steel-300">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 border-t border-ink-700 pt-5 text-sm text-steel-300">{footer}</div>}
          <p className="mt-8 text-center text-xs text-steel-500">
            <Link to="/" className="hover:text-steel-100">Engineering Portfolio Studio</Link> · School of Mechanical Engineering, Hubballi
          </p>
        </div>
      </main>
    </div>
  )
}
