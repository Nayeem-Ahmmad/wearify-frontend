const ProductGridSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
          <div className="aspect-square bg-slate-200" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </>
  )
}

export default ProductGridSkeleton