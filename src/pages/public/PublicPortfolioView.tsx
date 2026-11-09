import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { INITIAL_ACHIEVEMENTS } from '../../data/sampleData';
import {
  Globe,
  Lock,
  ExternalLink,
  FolderGit2,
  Award,
  Layers,
  Clock,
  CheckCircle2,
  Eye,
  Share2,
  Check,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

export const PublicPortfolioView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useUser();

  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const isOwner = !userId || userId === user.id;
  const visibility = user.portfolioVisibility || {
    isPublic: true,
    headline: user.targetRole,
    customBio: user.bio,
    highlightProjectIds: [],
    showContactEmail: true,
    showAchievements: true,
    allowComments: true,
  };

  // Only published and public projects
  const publishedProjects = (user.portfolioProjects || []).filter(
    p => p.status === 'published' && p.isPublic
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Check if private and not owner
  if (!visibility.isPublic && !isOwner) {
    return (
      <div className="min-h-screen bg-midnight text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-charcoal border border-charcoal-border rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-charcoal-muted border border-charcoal-border flex items-center justify-center mx-auto text-slate-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-soft-ivory">Portfolio is Private</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This analyst has configured their portfolio visibility to private mode. Please check back later or contact the analyst directly.
          </p>
          <Link to="/">
            <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Return to The Data Master
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight text-slate-100 font-sans selection:bg-lime/30 selection:text-lime">
      {/* Top Navigation Bar */}
      <header className="border-b border-charcoal-border bg-charcoal/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-midnight border border-charcoal-border flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse-subtle" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-soft-ivory font-mono">
                THE DATA MASTER
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Verified Portfolio</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isOwner && (
              <Link to="/platform/portfolio">
                <Button variant="outline" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                  Back to Studio
                </Button>
              </Link>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyLink}
              icon={copiedLink ? <Check className="w-3.5 h-3.5 text-lime" /> : <Share2 className="w-3.5 h-3.5" />}
            >
              {copiedLink ? 'Link Copied!' : 'Share Portfolio'}
            </Button>
          </div>
        </div>
      </header>

      {/* Owner preview alert */}
      {isOwner && (
        <div className="bg-lime/10 border-b border-lime/20 px-4 py-2.5 text-xs text-lime">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 shrink-0" />
              <span>
                <strong>Recruiter Preview:</strong> This is how external hiring managers view your published portfolio. Private drafts and personal account settings are strictly excluded.
              </span>
            </div>
            <Link to="/platform/portfolio" className="underline font-semibold hover:text-white shrink-0 ml-2">
              Edit Projects
            </Link>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Profile Hero Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-charcoal border border-charcoal-border relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-charcoal-border shadow-md shrink-0"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-soft-ivory tracking-tight">
                    {user.name}
                  </h1>
                  <Badge variant="lime" size="sm">
                    Verified Analyst
                  </Badge>
                  <Badge variant="cyan" size="sm">
                    Level {user.level}
                  </Badge>
                </div>
                <p className="text-base text-cyan font-medium">
                  {visibility.headline || user.targetRole}
                </p>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {visibility.customBio || user.bio}
                </p>

                {/* Social links */}
                <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
                  {user.githubUrl && (
                    <a
                      href={user.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-soft-ivory flex items-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-lime" />
                      <span>github.com/{user.githubUrl.split('/').pop()}</span>
                    </a>
                  )}
                  {user.linkedinUrl && (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-soft-ivory flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-cyan" />
                      <span>linkedin.com/in/{user.linkedinUrl.split('/').pop()}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Pill Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-midnight/70 border border-charcoal-border text-center">
                <span className="text-xl font-bold text-lime font-mono block">
                  {publishedProjects.length}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                  Case Studies
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-midnight/70 border border-charcoal-border text-center">
                <span className="text-xl font-bold text-cyan font-mono block">
                  {user.completedTopicIds?.length || 3}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                  Masteries
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-midnight/70 border border-charcoal-border text-center col-span-2 sm:col-span-1 md:col-span-2">
                <span className="text-xs font-bold text-soft-ivory font-mono block">
                  {user.experienceLevel}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  Track Experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Published Case Studies Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-lime" />
                <h2 className="text-lg font-bold text-soft-ivory uppercase tracking-wider font-mono">
                  Published Analytical Case Studies ({publishedProjects.length})
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Each project exhibits problem formulation, data integrity audits, SQL/Python modeling, and executive impact.
              </p>
            </div>
          </div>

          {publishedProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-charcoal border border-charcoal-border border-dashed space-y-3">
              <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-soft-ivory">No published case studies yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isOwner
                  ? 'Head to the Portfolio Builder to complete and publish your first analytical project.'
                  : 'This analyst has not published any public case studies yet.'}
              </p>
              {isOwner && (
                <Link to="/platform/portfolio">
                  <Button variant="primary" size="sm" icon={<FolderGit2 className="w-3.5 h-3.5" />}>
                    Open Portfolio Builder
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {publishedProjects.map((project, idx) => {
                const isExpanded = expandedProjectId === project.id;
                return (
                  <article
                    key={project.id}
                    className="p-6 sm:p-8 rounded-2xl bg-charcoal border border-charcoal-border space-y-6 shadow-sm hover:border-slate-600 transition-all"
                  >
                    {/* Project Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-xs font-mono font-bold text-lime">
                            CASE STUDY #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-slate-600">•</span>
                          <Badge variant="cyan" size="sm">
                            {project.projectType.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-slate-400 font-mono">
                            {project.domainName}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-soft-ivory tracking-tight">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                          {project.shortDescription}
                        </p>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setExpandedProjectId(isExpanded ? null : project.id)
                        }
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        {isExpanded ? 'Collapse Narrative' : 'Read Full Narrative'}
                      </Button>
                    </div>

                    {/* Tools and Skills Strip */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-charcoal-border/50">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">
                        Technologies:
                      </span>
                      {project.tools.map(tool => (
                        <span
                          key={tool}
                          className="px-2.5 py-0.5 rounded bg-midnight border border-charcoal-border text-[11px] font-mono text-cyan"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* Collapsed vs Expanded Content */}
                    {!isExpanded ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                        <div className="p-4 rounded-xl bg-midnight/50 border border-charcoal-border/70">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-lime block mb-1">
                            The Business Problem
                          </span>
                          <p className="line-clamp-3 leading-relaxed">
                            {project.problemStatement}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-midnight/50 border border-charcoal-border/70">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-lime block mb-1">
                            Executive Recommendation
                          </span>
                          <p className="line-clamp-3 leading-relaxed">
                            {project.conclusionsAndRecommendations}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 pt-4 border-t border-charcoal-border text-sm text-slate-300 leading-relaxed">
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1.5">
                            1. Business Problem Statement & Context
                          </h4>
                          <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {project.problemStatement}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1.5">
                            2. Dataset Information & Hygiene
                          </h4>
                          <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border flex flex-wrap gap-4 text-xs font-mono text-cyan">
                            <span>Dataset: {project.datasetInfo?.name}</span>
                            {project.datasetInfo?.rowCount && (
                              <span>Volume: {project.datasetInfo.rowCount.toLocaleString()} records</span>
                            )}
                            {project.datasetInfo?.source && (
                              <span>Source: {project.datasetInfo.source}</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1.5">
                            3. Analytical Methodology
                          </h4>
                          <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {project.methodology}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1.5">
                            4. Empirical Discoveries & Root-Cause Evidence
                          </h4>
                          <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {project.analysisAndFindings}
                          </div>
                        </div>

                        {project.visualizations?.length > 0 && (
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1.5">
                              Visual Evidence Tables
                            </h4>
                            <div className="space-y-3">
                              {project.visualizations.map(viz => (
                                <div key={viz.id} className="p-3 bg-midnight/60 rounded-xl border border-charcoal-border">
                                  <p className="text-xs font-semibold text-soft-ivory mb-1">{viz.title}</p>
                                  <pre className="text-xs font-mono text-cyan overflow-x-auto p-2 bg-midnight rounded border border-charcoal-border">
                                    {viz.dataSnapshot}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1.5">
                            5. Actionable Executive Recommendations & Dollar Impact
                          </h4>
                          <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border text-soft-ivory whitespace-pre-wrap leading-relaxed">
                            {project.conclusionsAndRecommendations}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Verified Achievements Section */}
        {visibility.showAchievements && (
          <section className="space-y-4 pt-6 border-t border-charcoal-border">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan" />
              <h2 className="text-sm font-bold text-soft-ivory uppercase tracking-wider font-mono">
                Verified Platform Badges & Milestones
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {INITIAL_ACHIEVEMENTS.slice(0, 3).map(ach => (
                <div
                  key={ach.id}
                  className="p-4 rounded-xl bg-charcoal border border-charcoal-border flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-lime/10 border border-lime/30 flex items-center justify-center text-lime shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-soft-ivory">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Platform Verification & Limitations Banner */}
        <div className="p-4 rounded-2xl bg-midnight border border-charcoal-border text-xs text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-slate-300 font-medium">
              Verified Candidate on THE DATA MASTER
            </p>
            <p className="leading-relaxed">
              Analytical projects on this portfolio are verified through browser-based query execution, cohort validations, and structured rubric grading. In this client-side demonstration, candidate state is persisted locally. Cloud multi-user sync and verifiable credential hashes are queued for Phase 7 backend infrastructure.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-border py-8 text-center text-xs text-slate-500 font-mono">
        THE DATA MASTER — Learn. Analyse. Master Data.
      </footer>
    </div>
  );
};
