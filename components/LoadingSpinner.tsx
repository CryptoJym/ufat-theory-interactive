'use client'

interface Props {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function LoadingSpinner({ text = 'Loading...', size = 'medium' }: Props) {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-3',
    large: 'h-16 w-16 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-transparent border-indigo-600 ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-4 text-gray-600 text-sm animate-pulse">{text}</p>
      )}
    </div>
  )
}