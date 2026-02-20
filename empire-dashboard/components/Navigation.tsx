import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  description?: string
}

interface NavigationProps {
  items: NavItem[]
  title?: string
}

export function Navigation({ items, title }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {items.map(item => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-primary-50 border-l-4 border-primary-600' : 'border-l-4 border-transparent'
                }`}
              >
                <span className="flex-1">
                  <span className={`font-medium ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>
                    {item.label}
                  </span>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  )}
                </span>
                {isActive && <ChevronRight className="h-5 w-5 text-primary-600" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
