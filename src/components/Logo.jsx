const Logo = ({ dark = false }) => {
  const textColor = dark ? 'text-white' : 'text-slate-900'

  return (
    <a href="/" className="flex items-center gap-2 select-none">
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wearifyGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
        <path d="M20 20 L35 65 L50 35 L65 65 L80 20" stroke="url(#wearifyGradient)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className={`text-2xl font-extrabold tracking-tight ${textColor}`}>
        Wearify
      </span>
    </a>
  )
}

export default Logo