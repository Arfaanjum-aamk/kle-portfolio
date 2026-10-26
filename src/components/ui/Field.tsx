import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: ReactNode
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, id, className = '', ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const msgId = `${inputId}-msg`
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-steel-300">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className="field-input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error || hint ? msgId : undefined}
        {...rest}
      />
      {(error || hint) && (
        <p id={msgId} role={error ? 'alert' : undefined} className={`mt-1.5 text-xs ${error ? 'text-red-300' : 'text-steel-500'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
})

export const PasswordField = forwardRef<HTMLInputElement, FieldProps>(function PasswordField(
  { label, error, hint, id, className = '', ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const msgId = `${inputId}-msg`
  const [visible, setVisible] = useState(false)
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-steel-300">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          className="field-input pr-11"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || hint ? msgId : undefined}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-steel-500 hover:text-steel-100 focus-visible:text-cyanx focus-visible:outline-none"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {(error || hint) && (
        <p id={msgId} role={error ? 'alert' : undefined} className={`mt-1.5 text-xs ${error ? 'text-red-300' : 'text-steel-500'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
})
