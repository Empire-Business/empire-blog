'use client'

import Link from 'next/link'
import { BookOpen, Github, Menu, X, Terminal } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/commands', label: 'Comandos', icon: Terminal },
    { href: '/glossary', label: 'Glossário' },
    { href: '/flags', label: 'Bandeiras Vermelhas' },
    { href: '/troubleshooting', label: 'Troubleshooting' },
    { href: '/protocols', label: 'Protocolos' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Vibe Coding Docs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center text-gray-700 hover:text-primary-600 transition-colors"
              >
                {link.icon && <link.icon className="h-4 w-4 mr-1" />}
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/Empire-Business/empire-vibe-coding"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/Empire-Business/empire-vibe-coding"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors py-2"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
