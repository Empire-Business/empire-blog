import Link from 'next/link'
import { Github, BookOpen, Sparkles, Terminal } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-bold text-white">Vibe Coding Docs</span>
            </div>
            <p className="text-sm text-gray-400">
              Empire Vibe Coding - desenvolvimento com IA para iniciantes. Comece a programar sem saber programar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Documentação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/commands" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                  <Terminal className="h-4 w-4" />
                  <span>Comandos</span>
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-primary-400 transition-colors">
                  Glossário
                </Link>
              </li>
              <li>
                <Link href="/flags" className="hover:text-primary-400 transition-colors">
                  Bandeiras Vermelhas
                </Link>
              </li>
              <li>
                <Link href="/troubleshooting" className="hover:text-primary-400 transition-colors">
                  Troubleshooting
                </Link>
              </li>
              <li>
                <Link href="/protocols" className="hover:text-primary-400 transition-colors">
                  Protocolos
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/Empire-Business/empire-vibe-coding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-primary-400 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <Link href="/github" className="hover:text-primary-400 transition-colors">
                  Como Contribuir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {currentYear} <a href="https://empire-business.com" className="hover:text-primary-400">Empire Business</a>. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            Licença MIT - Código aberto para todos.
          </p>
        </div>
      </div>
    </footer>
  )
}
