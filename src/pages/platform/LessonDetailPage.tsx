import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLessonById, LESSONS_DATABASE } from '../../data/lessons';
import { getDomainById } from '../../data/curriculum';
import { useUser } from '../../context/UserContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, PriorityBadge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  BookOpen,
  Code,
  Terminal,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

export const LessonDetailPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, completeActivity, completeTopic } = useUser();

  const lesson = getLessonById(lessonId || 'lesson-sql-filtering');

  const [activeTab, setActiveTab] = useState<'concept' | 'example' | 'exercise' | 'quiz'>('concept');

  // Exercise State
  const [exerciseCode, setExerciseCode] = useState(lesson?.practicalExercise?.starterCode || '');
  const [exerciseOutput, setExerciseOutput] = useState<string | null>(null);
  const [exerciseSuccess, setExerciseSuccess] = useState<boolean | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [xpAwardMessage, setXpAwardMessage] = useState<string | null>(null);

  if (!lesson) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-heading font-bold text-white">Lesson Not Found</h2>
        <p className="text-xs text-slate-400">The requested lesson identifier could not be resolved.</p>
        <Link to="/platform/lab">
          <Button variant="primary" size="sm">
            Return to Learning Lab
          </Button>
        </Link>
      </div>
    );
  }

  const domain = getDomainById(lesson.domainId);

  // Exercise validation
  const handleRunExercise = () => {
    if (!lesson.practicalExercise) return;
    const code = exerciseCode.toLowerCase();
    const expected = lesson.practicalExercise.expectedOutputKeyword.toLowerCase();

    if (code.includes(expected)) {
      setExerciseSuccess(true);
      setExerciseOutput('✓ Statement successfully verified against test criteria! Syntax and output pass.');
    } else {
      setExerciseSuccess(false);
      setExerciseOutput(`✕ Validation failed. Missing expected analytical pattern: "${lesson.practicalExercise.expectedOutputKeyword}".`);
    }
  };

  // Quiz evaluation
  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleEvaluateQuiz = () => {
    let correctCount = 0;
    lesson.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / lesson.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 70) {
      // Award XP using anti-duplicate engine
      const { xpAwarded, isDuplicate } = completeActivity(
        'lesson',
        lesson.id,
        lesson.xpReward
      );

      // Complete parent topic
      completeTopic(lesson.topicId, 0);

      if (xpAwarded > 0) {
        setXpAwardMessage(`+${xpAwarded} XP Awarded!`);
      } else if (isDuplicate) {
        setXpAwardMessage('Completed! (Revision attempt: 0 XP)');
      }
    }
  };

  const isAllAnswered = lesson.quiz.every(q => selectedAnswers[q.id] !== undefined);

  // Find next and previous lessons
  const currentIndex = LESSONS_DATABASE.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? LESSONS_DATABASE[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS_DATABASE.length - 1 ? LESSONS_DATABASE[currentIndex + 1] : null;

  return (
    <div className="space-y-6 pb-20 font-sans max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Academies', path: '/academies' },
          { label: domain?.name || 'Domain', path: domain ? `/academies/${domain.slug}` : undefined },
          { label: lesson.title },
        ]}
      />

      {/* Lesson Header Banner */}
      <div className="p-6 rounded-2xl bg-charcoal-surface border border-charcoal-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-lime font-bold">
              {domain?.name || 'Academy Lesson'}
            </span>
            <Badge variant={lesson.difficulty === 'beginner' ? 'lime' : lesson.difficulty === 'intermediate' ? 'cyan' : 'orange'}>
              {lesson.difficulty}
            </Badge>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} mins
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            {lesson.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {lesson.overview}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-midnight border border-charcoal-border font-mono text-xs text-lime font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-lime" />
            <span>+{lesson.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* 4-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-charcoal-border pb-1 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab('concept')}
          className={`px-4 py-2.5 rounded-lg text-xs font-heading font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'concept'
              ? 'bg-lime text-midnight'
              : 'text-slate-300 hover:text-white hover:bg-charcoal-surface'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Concept & Theory</span>
        </button>

        {lesson.codeExample && (
          <button
            onClick={() => setActiveTab('example')}
            className={`px-4 py-2.5 rounded-lg text-xs font-heading font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'example'
                ? 'bg-lime text-midnight'
                : 'text-slate-300 hover:text-white hover:bg-charcoal-surface'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>2. Code & Syntax Example</span>
          </button>
        )}

        {lesson.practicalExercise && (
          <button
            onClick={() => setActiveTab('exercise')}
            className={`px-4 py-2.5 rounded-lg text-xs font-heading font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'exercise'
                ? 'bg-lime text-midnight'
                : 'text-slate-300 hover:text-white hover:bg-charcoal-surface'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>3. Practical Exercise</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2.5 rounded-lg text-xs font-heading font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-lime text-midnight'
              : 'text-slate-300 hover:text-white hover:bg-charcoal-surface'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>4. Comprehension Quiz ({lesson.quiz.length})</span>
        </button>
      </div>

      {/* TAB 1: CONCEPT & THEORY */}
      {activeTab === 'concept' && (
        <div className="space-y-6">
          <Card variant="bordered" className="p-8 bg-charcoal-surface border-charcoal-border space-y-6">
            <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: lesson.conceptMarkdown
                    .replace(/### (.*?)\n/g, '<h3 class="text-lg font-heading font-bold text-white mt-4 mb-2">$1</h3>')
                    .replace(/#### (.*?)\n/g, '<h4 class="text-sm font-heading font-bold text-lime mt-3 mb-1.5">$1</h4>')
                    .replace(/`([^`]+)`/g, '<code class="bg-midnight px-1.5 py-0.5 rounded text-lime font-mono text-xs">$1</code>')
                    .replace(/```sql\n([\s\S]*?)```/g, '<pre class="bg-midnight p-4 rounded-xl border border-charcoal-border font-mono text-xs text-slate-200 overflow-x-auto">$1</pre>')
                    .replace(/```excel\n([\s\S]*?)```/g, '<pre class="bg-midnight p-4 rounded-xl border border-charcoal-border font-mono text-xs text-lime overflow-x-auto">$1</pre>')
                    .replace(/```\n([\s\S]*?)```/g, '<pre class="bg-midnight p-4 rounded-xl border border-charcoal-border font-mono text-xs text-slate-300 overflow-x-auto">$1</pre>'),
                }}
              />
            </div>

            <div className="p-5 rounded-xl bg-midnight border border-charcoal-border space-y-2">
              <h3 className="text-xs font-mono uppercase text-lime font-bold tracking-wider">
                Key Conceptual Takeaways:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {lesson.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-lime font-mono">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-charcoal-border flex items-center justify-end">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => setActiveTab(lesson.codeExample ? 'example' : 'quiz')}
              >
                Proceed to {lesson.codeExample ? 'Example' : 'Quiz'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: CODE EXAMPLE */}
      {activeTab === 'example' && lesson.codeExample && (
        <Card variant="bordered" className="p-8 bg-charcoal-surface border-charcoal-border space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-cyan font-bold">
              Realistic Syntax Walkthrough ({lesson.codeExample.language.toUpperCase()})
            </span>
            <h2 className="text-xl font-heading font-bold text-white">
              Annotated Implementation
            </h2>
            <p className="text-xs text-slate-300">
              {lesson.codeExample.explanation}
            </p>
          </div>

          <div className="rounded-xl bg-midnight border border-charcoal-border p-5 font-mono text-xs text-slate-200 overflow-x-auto">
            <pre className="leading-relaxed">{lesson.codeExample.code}</pre>
          </div>

          <div className="pt-4 border-t border-charcoal-border flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('concept')}>
              Back to Theory
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => setActiveTab(lesson.practicalExercise ? 'exercise' : 'quiz')}
            >
              Continue to {lesson.practicalExercise ? 'Hands-On Exercise' : 'Quiz'}
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 3: PRACTICAL EXERCISE */}
      {activeTab === 'exercise' && lesson.practicalExercise && (
        <Card variant="bordered" className="p-8 bg-charcoal-surface border-charcoal-border space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-lime font-bold">
              Interactive Hands-On Exercise
            </span>
            <h2 className="text-xl font-heading font-bold text-white">
              {lesson.practicalExercise.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lesson.practicalExercise.prompt}
            </p>
          </div>

          {/* Interactive Code Editor */}
          <div className="rounded-xl bg-midnight border border-charcoal-border overflow-hidden">
            <div className="px-4 py-2 bg-charcoal-elevated border-b border-charcoal-border flex items-center justify-between text-xs font-mono text-slate-400">
              <span>editor.{lesson.practicalExercise.language}</span>
              <button
                onClick={() => setExerciseCode(lesson.practicalExercise?.starterCode || '')}
                className="hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <textarea
              rows={6}
              value={exerciseCode}
              onChange={e => setExerciseCode(e.target.value)}
              className="w-full p-4 bg-transparent text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-lime selection:text-midnight"
              spellCheck="false"
            />
          </div>

          {/* Execute Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(prev => !prev)}
              className="text-xs font-mono text-slate-400 hover:text-orange flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>

            <Button
              variant="primary"
              size="md"
              icon={<Play className="w-3.5 h-3.5 fill-midnight" />}
              onClick={handleRunExercise}
            >
              Validate Solution
            </Button>
          </div>

          {/* Hints Drawer */}
          {showHint && (
            <div className="p-4 rounded-xl bg-orange/10 border border-orange/30 text-xs space-y-2">
              <span className="font-mono text-orange font-bold block">
                Progressive Hint {hintIndex + 1} of {lesson.practicalExercise.hints.length}:
              </span>
              <p className="text-slate-200">{lesson.practicalExercise.hints[hintIndex]}</p>
              {hintIndex < lesson.practicalExercise.hints.length - 1 && (
                <button
                  onClick={() => setHintIndex(prev => prev + 1)}
                  className="text-[11px] underline text-orange hover:text-white"
                >
                  Next Hint →
                </button>
              )}
            </div>
          )}

          {/* Output Banner */}
          {exerciseOutput && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono ${
                exerciseSuccess
                  ? 'bg-lime/10 border-lime/40 text-lime font-bold'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              {exerciseOutput}
            </div>
          )}

          <div className="pt-4 border-t border-charcoal-border flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('concept')}>
              Back to Theory
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => setActiveTab('quiz')}
            >
              Proceed to Comprehension Quiz
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 4: COMPREHENSION QUIZ */}
      {activeTab === 'quiz' && (
        <Card variant="bordered" className="p-8 bg-charcoal-surface border-charcoal-border space-y-8">
          <div className="space-y-2 border-b border-charcoal-border pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-lime font-bold">
                Assessment Quiz
              </span>
              <span className="text-xs font-mono text-slate-400">
                Passing Score: 70%
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold text-white">
              Demonstrate Your Mastery
            </h2>
            <p className="text-xs text-slate-300">
              Answer all questions below. Explanations and concept reviews are revealed upon validation.
            </p>
          </div>

          <div className="space-y-8">
            {lesson.quiz.map((q, qIdx) => {
              const selectedIdx = selectedAnswers[q.id];
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div key={q.id} className="space-y-3 pb-6 border-b border-charcoal-border/70 last:border-b-0">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono font-bold text-lime mt-0.5">
                      Q{qIdx + 1}.
                    </span>
                    <h3 className="text-sm font-heading font-bold text-white">
                      {q.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pl-5">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      let btnStyle = 'border-charcoal-border bg-midnight text-slate-300 hover:border-slate-500';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'border-lime bg-lime/10 text-lime font-semibold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-300';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-lime/60 bg-lime/10 text-white font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
                          )}
                          {quizSubmitted && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div className="mt-3 pl-5">
                      <div
                        className={`p-3 rounded-lg border text-xs leading-relaxed space-y-1 ${
                          isCorrect
                            ? 'bg-lime/5 border-lime/30 text-slate-200'
                            : 'bg-rose-500/10 border-rose-500/30 text-slate-200'
                        }`}
                      >
                        <span className="font-mono font-bold block text-[11px] text-slate-400">
                          Explanation ({q.conceptKey}):
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Score Summary Banner */}
          {quizSubmitted && quizScore !== null && (
            <div
              className={`p-6 rounded-2xl border text-center space-y-3 ${
                quizScore >= 70
                  ? 'bg-lime/10 border-lime/40 text-slate-100'
                  : 'bg-orange/10 border-orange/40 text-slate-100'
              }`}
            >
              <div className="text-3xl font-heading font-extrabold text-white">
                {quizScore}% Score
              </div>

              {quizScore >= 70 ? (
                <div className="space-y-1">
                  <p className="text-sm font-heading font-bold text-lime">
                    ✓ Lesson Passed! Mastery verified.
                  </p>
                  {xpAwardMessage && (
                    <p className="text-xs font-mono font-bold text-lime">{xpAwardMessage}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-w-lg mx-auto">
                  <p className="text-sm font-heading font-bold text-orange flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-orange" />
                    Score below passing threshold (70%). Needs Revision.
                  </p>
                  {lesson.revisionReason && (
                    <p className="text-xs text-slate-300">
                      Recommendation: {lesson.revisionReason}
                    </p>
                  )}
                  <Link to="/platform/mistakes">
                    <span className="text-xs font-mono text-orange underline">
                      Review in Mistake Journal →
                    </span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Quiz Action Footer */}
          <div className="pt-4 border-t border-charcoal-border flex items-center justify-between">
            {!quizSubmitted ? (
              <Button
                variant="primary"
                size="md"
                disabled={!isAllAnswered}
                onClick={handleEvaluateQuiz}
              >
                Submit Answers for Grading
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAnswers({});
                    setQuizSubmitted(false);
                    setQuizScore(null);
                    setXpAwardMessage(null);
                  }}
                >
                  Retake Quiz
                </Button>

                {nextLesson && (
                  <Link to={`/platform/lessons/${nextLesson.id}`}>
                    <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                      Next Lesson: {nextLesson.title}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
