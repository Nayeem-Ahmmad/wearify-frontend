const Logo = ({ dark = false }) => {
  const textColor = dark ? 'text-white' : 'text-slate-900'
  const sellsColor = dark ? 'text-sky-400' : 'text-blue-600'

  return (
    <a href="/" className="inline-flex items-center select-none group">
      <span className={`font-serif italic text-3xl sm:text-4xl tracking-tight ${textColor} transition-transform duration-300 group-hover:scale-105`}>
        Wearify
        <span className={`${sellsColor} not-italic font-black`}>Sells</span>
      </span>
    </a>
  )
}

export default Logo