'use client';

import React, { useState } from 'react';
import { Wizard } from '../../components/Wizard';
import { CodePreview } from '../../components/CodePreview';
import { StackConfiguration, ValidationResult } from 'core';
import { Terminal, Github, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<ValidationResult | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: StackConfiguration) => {
    setLoading(true);
    setError(null);
    setValidation(undefined);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate infrastructure code');
      }

      const data = await response.json();
      if (data.success) {
        setGeneratedFiles(data.files);
        if (data.validation) {
          setValidation(data.validation);
        }
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">IaC Gen</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">Documentation</a>
            <a href="#" className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Wizard */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Define your stack.</h2>
              <p className="mt-4 text-lg text-gray-500">
                Choose your tools, and we'll generate the production-ready infrastructure code for you.
              </p>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Validated by Default</h3>
                  <p className="text-xs text-gray-500">Every config is checked for security best practices.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Terminal className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Multi-Cloud Ready</h3>
                  <p className="text-xs text-gray-500">Generate for Docker, Kubernetes, and Terraform.</p>
                </div>
              </div>
            </div>

            <Wizard onGenerate={handleGenerate} loading={loading} />
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Right: Code Preview */}
          <div className="lg:sticky lg:top-8 h-[700px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Generated Code</h3>
              {Object.keys(generatedFiles).length > 0 && (
                <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {Object.keys(generatedFiles).length} files ready
                </span>
              )}
            </div>
            <CodePreview files={generatedFiles} validation={validation} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          Built for Reliability & Flow. © 2026 IaC Generator.
        </div>
      </footer>
    </div>
  );
}
