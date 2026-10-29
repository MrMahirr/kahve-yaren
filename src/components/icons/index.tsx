import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

/** Çizgi ikonları için ortak kabuk: 24×24 viewBox, currentColor, dekoratif. */
function StrokeIcon({ size = 24, strokeWidth = 1.75, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconArrowDown = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </StrokeIcon>
)

export const IconArrowRight = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </StrokeIcon>
)

export const IconPlus = (props: IconProps) => (
  <StrokeIcon size={16} {...props}>
    <path d="M12 5v14M5 12h14" />
  </StrokeIcon>
)

export const IconAlert = (props: IconProps) => (
  <StrokeIcon size={18} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </StrokeIcon>
)

export const IconCheck = (props: IconProps) => (
  <StrokeIcon size={32} strokeWidth={2} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </StrokeIcon>
)

export const IconClose = (props: IconProps) => (
  <StrokeIcon size={18} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </StrokeIcon>
)

export const IconMenu = (props: IconProps) => (
  <StrokeIcon size={20} {...props}>
    <path d="M4 8h16M4 16h16" />
  </StrokeIcon>
)

export const IconPin = (props: IconProps) => (
  <StrokeIcon size={20} strokeWidth={1.5} {...props}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </StrokeIcon>
)

export const IconClock = (props: IconProps) => (
  <StrokeIcon size={20} strokeWidth={1.5} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </StrokeIcon>
)

/** Marka logosu: fincan ve zeytin yeşili buhar oku. */
export const Logo = ({ size = 30, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="32" cy="36" r="17" fill="currentColor" />
    <path
      d="M25 15 L32 9 L39 15"
      fill="none"
      stroke="var(--color-filiz)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Şerit ve rozetteki sade fincan işareti. */
export const CupMark = ({ size = 26, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="32" cy="36" r="15" fill="currentColor" />
  </svg>
)
