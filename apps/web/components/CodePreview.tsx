'use client';

import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { clsx } from 'clsx';
import { Copy, Check, ShieldAlert, ShieldCheck, ShieldQuestion, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { ValidationResult, ValidationIssue } from 'core';

interface CodePreviewProps {
  files: Record<string, string>;
  validation?: ValidationResult;
}

export function CodePreview({ files, validation }: CodePreviewProps) {
  const filenames = Object.keys(files);
  const [activeTab, setActiveTab] = useState(filenames[0] || '');
  const [showSecurity, setShowSecurity] = useState(false);
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
    if (filename.endsWith('.dockerfile') || filename.includes('Dockerfile')) return 'dockerfile';
    return 'javascript';
  };

  const activeIssues = validation?.issues.filter(i => i.file === activeTab) || [];
  const hasIssues = (validation?.issues.length || 0) > 0;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'MEDIUM': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'LOW': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <ShieldQuestion className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col h-full border border-gray-700">
      <div className="flex items-center justify-between bg-gray-800 px-2 pt-2 border-b border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          {filenames.map((name) => (
            <button
              key={name}
              onClick={() => {
                setActiveTab(name);
                setShowSecurity(false);
              }}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap flex items-center gap-2',
                activeTab === name && !showSecurity
                  ? 'bg-gray-900 text-indigo-400 border-t border-l border-r border-gray-700'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              )}
            >
              {name}
              {validation?.issues.some(i => i.file === name) && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          ))}
          {validation && (
            <button
              onClick={() => setShowSecurity(true)}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap flex items-center gap-2 ml-4',
                showSecurity
                  ? 'bg-gray-900 text-indigo-400 border-t border-l border-r border-gray-700'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              )}
            >
              {validation.success ? (
                <ShieldCheck className="w-4 h-4 text-green-500" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-500" />
              )}
              Security Report
              <span className="px-1.5 py-0.5 rounded-full bg-gray-700 text-xs text-gray-300">
                {validation.summary.total}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden group">
        {!showSecurity && (
          <button
            onClick={copyToClipboard}
            className="absolute right-4 top-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-all opacity-0 group-hover:opacity-100 z-10"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        )}

        <div className="h-full overflow-auto custom-scrollbar">
          {showSecurity ? (
            <div className="p-6 bg-gray-900 h-full">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="text-indigo-400" />
                Security & Syntax Analysis
              </h3>
              
              {validation?.issues.length === 0 ? (
                <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-6 text-center">
                  <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-green-400 font-medium text-lg">No Issues Found</h4>
                  <p className="text-green-300/70 text-sm mt-1">Static analysis passed successfully. No misconfigurations detected.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {[
                      { label: 'Critical', count: validation?.summary.critical, color: 'text-red-600', bg: 'bg-red-900/20' },
                      { label: 'High', count: validation?.summary.high, color: 'text-red-500', bg: 'bg-red-800/20' },
                      { label: 'Medium', count: validation?.summary.medium, color: 'text-yellow-500', bg: 'bg-yellow-900/20' },
                      { label: 'Low', count: validation?.summary.low, color: 'text-blue-400', bg: 'bg-blue-900/20' },
                      { label: 'Total', count: validation?.summary.total, color: 'text-gray-300', bg: 'bg-gray-800' },
                    ].map(stat => (
                      <div key={stat.label} className={clsx(stat.bg, 'rounded-lg p-3 text-center border border-white/5')}>
                        <div className={clsx('text-2xl font-bold', stat.color)}>{stat.count}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden">
                    {validation?.issues.map((issue, idx) => (
                      <div key={`${issue.id}-${idx}`} className="p-4 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getSeverityIcon(issue.severity)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">{issue.id}</span>
                              <span className="text-xs font-medium text-indigo-400 uppercase">{issue.tool}</span>
                              <span className="text-xs text-gray-500">{issue.file}{issue.line ? `:${issue.line}` : ''}</span>
                            </div>
                            <h5 className="text-sm font-semibold text-gray-200">{issue.title}</h5>
                            <p className="text-sm text-gray-400 mt-1">{issue.message}</p>
                            <button 
                              onClick={() => {
                                setActiveTab(issue.file);
                                setShowSecurity(false);
                              }}
                              className="text-xs text-indigo-400 hover:underline mt-2 inline-block"
                            >
                              View in code
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 h-full">
              <Highlight
                theme={themes.vsDark}
                code={files[activeTab] || ''}
                language={getLanguage(activeTab)}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={clsx(className, 'text-sm font-mono')} style={style}>
                    {tokens.map((line, i) => {
                      const lineProps = getLineProps({ line });
                      const lineNumber = i + 1;
                      const lineIssue = activeIssues.find(iss => iss.line === lineNumber);
                      
                      return (
                        <div 
                          key={i} 
                          {...lineProps} 
                          className={clsx(
                            lineProps.className,
                            lineIssue && (
                              lineIssue.severity === 'CRITICAL' || lineIssue.severity === 'HIGH' 
                                ? 'bg-red-900/30 border-l-2 border-red-500 -ml-1 pl-1' 
                                : 'bg-yellow-900/20 border-l-2 border-yellow-500 -ml-1 pl-1'
                            )
                          )}
                        >
                          <span className={clsx(
                            'inline-block w-8 text-right pr-4 select-none',
                            lineIssue ? 'text-red-400 font-bold' : 'text-gray-600'
                          )}>
                            {lineNumber}
                          </span>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                          {lineIssue && (
                            <span className="ml-4 text-[10px] text-red-400/70 italic inline-block whitespace-nowrap">
                              {lineIssue.title}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </pre>
                )}
              </Highlight>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
