import { useEffect, useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { getReviews, postReview } from '../api/reviews'
import { useAuth } from '../context/AuthContext'
import { useToast } from './Toast'

const ReviewsSection = ({ productId }) => {
  const { authenticated } = useAuth()
  const { showToast } = useToast()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadReviews = () => {
    setLoading(true)
    getReviews(productId)
      .then((data) => setReviews(data.results || data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReviews()
  }, [productId])

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent: reviews.length ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await postReview(productId, rating, comment)
      setComment('')
      setRating(5)
      setShowForm(false)
      showToast('Review submitted successfully')
      loadReviews()
    } catch {
      showToast('Could not submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="grid md:grid-cols-[220px_1fr] gap-8 mb-8">
        <div className="text-center md:text-left">
          <p className="text-4xl font-bold text-slate-900">{average}</p>
          <div className="flex justify-center md:justify-start gap-0.5 my-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <FiStar
                key={i}
                size={16}
                className={i <= Math.round(average) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">{reviews.length} reviews</p>
        </div>

        <div className="space-y-1.5">
          {breakdown.map((b) => (
            <div key={b.star} className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-8">{b.star} star</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${b.percent}%` }}
                />
              </div>
              <span className="w-6 text-right">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {authenticated && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 text-sm font-medium text-blue-600 hover:underline"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)}>
                <FiStar
                  size={22}
                  className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product"
            rows={3}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-slate-400">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="pb-5 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar
                      key={i}
                      size={13}
                      className={i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewsSection