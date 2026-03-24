'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StackConfigurationSchema, StackConfiguration } from 'core/client';
import { ChevronRight, ChevronLeft, Loader2, Github } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

interface WizardProps {
  onGenerate: (data: StackConfiguration) => Promise<void>;
  onChange?: (data: StackConfiguration) => void;
  loading: boolean;
}

const STEPS = [
  { id: 'project', title: 'Project Info' },
  { id: 'stack', title: 'Stack' },
  { id: 'database', title: 'Database' },
  { id: 'infrastructure', title: 'Infrastructure' },
  { id: 'git', title: 'Git Settings' },
];

export function Wizard({ onGenerate, onChange, loading }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { data: session } = useSession();
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<StackConfiguration>({
    resolver: zodResolver(StackConfigurationSchema),
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      backend: { language: 'nodejs', version: '22' },
      frontend: { framework: 'nextjs', version: '15' },
      database: { type: 'postgres', version: '16' },
      proxy: 'nginx',
      infrastructure: [],
    },
  });

  const formData = watch();

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  useEffect(() => {
    if (session) {
      setLoadingRepos(true);
      fetch('/api/github/repos')
        .then(res => res.json())
        .then(data => {
          if (data.repositories) {
            setRepositories(data.repositories);
          }
        })
        .finally(() => setLoadingRepos(false));
    }
  }, [session]);

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: StackConfiguration) => {
    onGenerate(data);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                {...register('projectName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="my-awesome-app"
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Backend Language</label>
                <select
                  {...register('backend.language')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="nodejs">Node.js</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Version</label>
                <input
                  {...register('backend.version')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Frontend Framework</label>
                <select
                  {...register('frontend.framework')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="nextjs">Next.js</option>
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Version</label>
                <input
                  {...register('frontend.version')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Database Type</label>
                <select
                  {...register('database.type')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="postgres">Postgres</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Version</label>
                <input
                  {...register('database.version')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Infrastructure (IaC)</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="terraform"
                  {...register('infrastructure')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Terraform</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="kubernetes"
                  {...register('infrastructure')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Kubernetes</span>
              </label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Git Integration</h3>
            {!session ? (
              <button
                type="button"
                onClick={() => signIn('github')}
                className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Github className="w-5 h-5 mr-3 text-gray-900" />
                Connect GitHub
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <img
                    src={session.user?.image || ''}
                    alt={session.user?.name || ''}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">Connected to GitHub</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Repository</label>
                  {loadingRepos ? (
                    <div className="flex items-center space-x-2 mt-2 text-gray-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading repositories...</span>
                    </div>
                  ) : repositories.length > 0 ? (
                    <select
                      {...register('git.repository')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                      <option value="">Choose a repository</option>
                      {repositories.map(repo => (
                        <option key={repo.id} value={repo.full_name}>
                          {repo.full_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-1 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                      <p className="text-xs text-yellow-700">
                        No authorized repositories found. Make sure the GitHub App is installed and has access to your repos.
                      </p>
                    </div>
                  )}
                </div>

                {watch('git.repository') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target Branch</label>
                    <input
                      {...register('git.branch')}
                      placeholder="main"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-xs mt-1 text-gray-500">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2 h-1 bg-gray-200 rounded">
          <div
            className="absolute top-0 left-0 h-1 bg-indigo-600 rounded transition-all duration-300"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-[200px]">{renderStep()}</div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={back}
            disabled={currentStep === 0 || loading}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          {currentStep === STEPS.length - 1 ? (
            <button
              type="submit"
              disabled={loading || !isValid}
              className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Generate Stack
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
