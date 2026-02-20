// Terminal Prompt Component
// Copy-ready prompt for terminal execution

'use client';

import { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import type { Task } from '@/lib/types';
import { getPrompt } from '@/lib/prompts';

interface TerminalPromptProps {
  task: Task;
  format?: 'full' | 'simple' | 'claude-cli';
  showHeader?: boolean;
}

export function TerminalPrompt({
  task,
  format = 'full',
  showHeader = true,
}: TerminalPromptProps) {
  const [copied, setCopied] = useState(false);

  const prompt = task.terminalPrompt || getPrompt(
    {
      agent: task.agent,
      subject: task.subject,
      description: task.description,
      protocol: task.protocol,
    },
    format
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Terminal Prompt</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      )}

      <div className="relative group">
        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
          {prompt}
        </pre>

        {!showHeader && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-300" />
            )}
          </button>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>Format:</span>
        <button className="hover:text-gray-700">Full</button>
        <button className="hover:text-gray-700">Simple</button>
        <button className="hover:text-gray-700">CLI</button>
        {task.protocol && (
          <a
            href={`/docs/PROTOCOLOS/${task.protocol}`}
            className="ml-auto flex items-center gap-1 hover:text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-3 h-3" />
            View Protocol
          </a>
        )}
      </div>
    </div>
  );
}

// Prompt generator for new tasks
interface PromptGeneratorProps {
  agent: string;
  subject: string;
  description: string;
  protocol?: string;
}

export function PromptGenerator({
  agent,
  subject,
  description,
  protocol,
}: PromptGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const prompt = getPrompt(
    {
      agent: agent as any,
      subject,
      description,
      protocol,
    },
    'full'
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Generated Prompt</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Prompt
            </>
          )}
        </button>
      </div>
      <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap max-h-64">
        {prompt}
      </pre>
    </div>
  );
}
