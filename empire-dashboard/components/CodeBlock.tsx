'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  copyable?: boolean
}

export function CodeBlock({ code, language = 'bash', showLineNumbers = true, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className="relative my-4">
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm text-gray-400 font-mono">{language}</span>
          {copyable && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-success-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Code content */}
        <div className="overflow-x-auto">
          <pre className="p-4 text-sm">
            <code className="font-mono text-gray-100">
              {showLineNumbers ? (
                lines.map((line, index) => (
                  <div key={index} className="flex hover:bg-gray-800">
                    <span className="w-12 flex-shrink-0 text-right pr-4 text-gray-600 select-none">
                      {index + 1}
                    </span>
                    <span className="flex-1">{line || ' '}</span>
                  </div>
                ))
              ) : (
                code
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
