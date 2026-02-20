import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface CardProps {
  href: string
  icon?: LucideIcon
  iconEmoji?: string
  title: string
  description: string
  className?: string
}

export function Card({ href, icon: Icon, iconEmoji, title, description, className = '' }: CardProps) {
  return (
    <Link
      href={href}
      className={`group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200 ${className}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {Icon && (
            <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
              <Icon className="h-6 w-6 text-primary-600" />
            </div>
          )}
          {iconEmoji && (
            <div className="text-4xl">{iconEmoji}</div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
}
