import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { LESSONS_DATABASE } from '../../data/lessons';
import { getDomainById } from '../../data/curriculum';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { SQLWorkspace } from '../../components/workspaces/SQLWorkspace';
import { PythonWorkspace } from '../../components/workspaces/PythonWorkspace';
import { SpreadsheetWorkspace } from '../../components/workspaces/SpreadsheetWorkspace';
import {
  Clock,
  BookOpen,
  ArrowRight,
  Database,
  Code2,
  Table,
} from 'lucide-react';

export const LearningLabPage: React.FC = () => {
  const { user } = useUser();
  const [activeSandboxTab, setActiveSandboxTab] = useState<'sql' | 'python' | 'spreadsheet'>('sql');

  return (
    <div className="space-y-8 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-border pb-3">
        <Breadcrumb
          items={[
            { label: 'Learning Lab', path: '/platform/lab' },
            { label: 'Interactive Learning & Execution Lab' },
          ]}
        />
        <div className="flex items-center gap-2">
          <Badge variant="lime">Live SQLite WASM + Python Skulpt</Badge>
        </div>
      </div>

      {/* Featured Structured Lessons Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-lime" />
              Structured Bite-Sized Lessons
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Comprehensive pedagogical modules complete with theory, real-world scenarios, code examples, hands-on exercises, and quizzes.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {LESSONS_DATABASE.length} lessons available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS_DATABASE.map((lesson) => {
            const domain = getDomainById(lesson.domainId);
            const isCompleted = user.completedActivityIds.some((id) =>
              id.includes(lesson.id)
            );

            return (
              <Card
                key={lesson.id}
                variant="interactive"
                className="p-5 bg-charcoal-surface border-charcoal-border hover:border-lime/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 font-semibold truncate max-w-[150px]">
                      {domain?.name || 'Academy'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          lesson.difficulty === 'beginner'
                            ? 'lime'
                            : lesson.difficulty === 'intermediate'
                            ? 'cyan'
                            : 'orange'
                        }
                      >
                        {lesson.difficulty}
                      </Badge>
                      <span className="text-lime font-bold">+{lesson.xpReward} XP</span>
                    </div>
                  </div>

                  <h3 className="text-base font-heading font-bold text-white mb-1.5 leading-snug">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    {lesson.overview}
                  </p>
                </div>

                <div className="pt-3 border-t border-charcoal-border flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} min
                  </span>

                  <Link to={`/platform/lessons/${lesson.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                    >
                      {isCompleted ? 'Review' : 'Start Lesson'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Live Multi-Engine Sandbox Exploration Workspace */}
      <div className="space-y-4 pt-6 border-t border-charcoal-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-cyan font-bold block mb-1">
              Open Sandbox Exploration
            </span>
            <h2 className="text-xl font-heading font-bold text-white">
              Live SQL, Python & Spreadsheet Execution Workbench
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-[#171C26] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveSandboxTab('sql')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeSandboxTab === 'sql'
                  ? 'bg-[#C6F36B] text-[#101827]'
                  : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> SQL Engine
            </button>
            <button
              type="button"
              onClick={() => setActiveSandboxTab('python')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeSandboxTab === 'python'
                  ? 'bg-[#C6F36B] text-[#101827]'
                  : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Python Runtime
            </button>
            <button
              type="button"
              onClick={() => setActiveSandboxTab('spreadsheet')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeSandboxTab === 'spreadsheet'
                  ? 'bg-[#C6F36B] text-[#101827]'
                  : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Spreadsheet Grid
            </button>
          </div>
        </div>

        {activeSandboxTab === 'sql' && <SQLWorkspace />}
        {activeSandboxTab === 'python' && <PythonWorkspace />}
        {activeSandboxTab === 'spreadsheet' && <SpreadsheetWorkspace />}
      </div>
    </div>
  );
};
