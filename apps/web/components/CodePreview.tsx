'use client';

import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { clsx } from 'clsx';
import { Copy, Check } from 'lucide-react';

interface CodePreviewProps {
  files: Record<string, string>;
}

export function CodePreview({ files }: CodePreviewProps) {
  const filenames = Object.keys(files);
  const [activeTab, setActiveTab] = useState(filenames[0] || '');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!activeTab && filenames.length > 0) {
      setActiveTab(filenames[0]);
    }
  }, [filenames, activeTab]);

  const copyToClipboard = () => {
    if (activeTab && files[activeTab]) {
      navigator.clipboard.writeText(files[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (filenames.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 flex items-center justify-center text-gray-500 italic">
        No files generated yet. Complete the wizard to see the code.
      </div>
    );
  }

  const getLanguage = (filename: string) => {
    if (filename.endsWith('.yml') || filename.endsWith('.yaml')) return 'yaml';
    if (filename.endsWith('.tf')) return 'hcl';
    if (filename.endsWith('.conf')) return 'nginx';
    return 'javascript';
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
      <div className="flex bg-gray-800 px-2 pt-2 border-b border-gray-700 overflow-x-auto scrollbar-hide">
        {filenames.map((name) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap',
              activeTab === name
                ? 'bg-gray-900 text-indigo-400 border-t border-l border-r border-gray-700'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden group">
        <button
          onClick={copyToClipboard}
          className="absolute right-4 top-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-all opacity-0 group-hover:opacity-100 z-10"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>

        <div className="h-full overflow-auto p-4 custom-scrollbar">
          <Highlight
            theme={themes.vsDark}
            code={files[activeTab] || ''}
            language={getLanguage(activeTab)}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={clsx(className, 'text-sm font-mono')} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="inline-block w-8 text-gray-600 select-none">{i + 1}</span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </div>
  );
}
