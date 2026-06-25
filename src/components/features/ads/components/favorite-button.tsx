'use client'

import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  onClick: () => void
  isFavorite?: boolean
  isLoading?: boolean
}

export const FavoriteButton = ({ onClick, isFavorite = false, isLoading = false }: FavoriteButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className='absolute top-0 right-0 transition-all active:scale-95 disabled:opacity-50'
    >
      <Heart
        size={20}
        className={`transition-colors ${isFavorite ? 'fill-current text-red-500' : 'text-gray-400 hover:text-red-500'}`}
      />
    </button>
  )
}
