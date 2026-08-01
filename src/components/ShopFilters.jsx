import { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { getCategories, getBrands } from '../api/products'

const ShopFilters = ({ filters, onChange }) => {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    getCategories().then((data) => setCategories(data.results || data)).catch(() => setCategories([]))
    getBrands().then((data) => setBrands(data.results || data)).catch(() => setBrands([]))
  }, [])

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-slate-900 mb-3 text-sm">Category</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleChange('category', '')}
              className="accent-blue-600"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => handleChange('category', cat.slug)}
                className="accent-blue-600"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold text-slate-900 mb-3 text-sm">Brand</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="radio"
              name="brand"
              checked={!filters.brand}
              onChange={() => handleChange('brand', '')}
              className="accent-blue-600"
            />
            All Brands
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === String(brand.id)}
                onChange={() => handleChange('brand', String(brand.id))}
                className="accent-blue-600"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold text-slate-900 mb-3 text-sm">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => handleChange('min_price', e.target.value)}
            className="w-1/2 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 transition-all duration-300"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => handleChange('max_price', e.target.value)}
            className="w-1/2 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 transition-all duration-300"
          />
        </div>

        <div className="mt-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.on_sale === 'true'}
              onChange={(e) => handleChange('on_sale', e.target.checked ? 'true' : '')}
              className="accent-orange-500"
            />
            <span className="flex items-center gap-1.5">🔥 On Sale Only</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default ShopFilters