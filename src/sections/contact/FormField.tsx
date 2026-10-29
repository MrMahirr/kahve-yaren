import type { ReactNode } from 'react'
import { IconAlert } from '@/components/icons'
import { errorId } from './fieldClasses'

type FormFieldProps = {
  id: string
  label: string
  error?: string
  /** Etiketin sağındaki ek bilgi (ör. karakter sayacı). */
  aside?: ReactNode
  /** Girdi öğesi; `id`, `aria-invalid` ve `aria-describedby={errorId(id)}` taşımalıdır. */
  children: ReactNode
}

/** Etiket + girdi + hata metni; hata, girdiye aria-describedby ile bağlıdır. */
export function FormField({ id, label, error, aside, children }: FormFieldProps) {
  const labelElement = (
    <label htmlFor={id} className="mono-label text-dem">
      {label}
    </label>
  )

  return (
    <div className="flex flex-col gap-1.5">
      {aside ? (
        <div className="flex items-baseline justify-between gap-3">
          {labelElement}
          {aside}
        </div>
      ) : (
        labelElement
      )}
      {children}
      <span
        id={errorId(id)}
        className="flex items-center gap-1.5 text-sm text-kiremit empty:hidden"
      >
        {error && (
          <>
            <IconAlert className="flex-none" />
            <span>{error}</span>
          </>
        )}
      </span>
    </div>
  )
}
