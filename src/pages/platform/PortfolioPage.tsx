import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useUser } from '../../context/UserContext';
import { PortfolioProject, ProjectType } from '../../types/portfolio';
import { PROJECT_TEMPLATES } from '../../data/projectTemplatesData';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import { ProjectEditorModal } from '../../components/portfolio/ProjectEditorModal';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Globe,
  Lock,
  Share2,
  Trash2,
  Edit3,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, deleteProject, publishProject, unpublishProject, updatePortfolioVisibility } = useUser();

  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTemplatesGallery, setShowTemplatesGallery] = useState<boolean>(false);

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<PortfolioProject | null>(null);
  const [inspectingProject, setInspectingProject] = useState<PortfolioProject | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const projects = user.portfolioProjects || [];
  const visibility = user.portfolioVisibility || {
    isPublic: true,
    highlightProjectIds: [],
    showContactEmail: true,
    showAchievements: true,
    allowComments: true,
  };

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (activeStatusFilter === 'published' && p.status !== 'published') return false;
      if (activeStatusFilter === 'draft' && p.status !== 'draft') return false;
      if (selectedDomain !== 'all' && p.domainId !== selectedDomain) return false;
      if (selectedType !== 'all' && p.projectType !== selectedType) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.shortDescription.toLowerCase().includes(query);
        const matchesTools = p.tools.some(t => t.toLowerCase().includes(query));
        const matchesSkills = p.skillsDemonstrated.some(s => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTools && !matchesSkills) return false;
      }

      return true;
    });
  }, [projects, activeStatusFilter, selectedDomain, selectedType, searchQuery]);

  // Counts
  const publishedCount = projects.filter(p => p.status === 'published').length;
  const draftCount = projects.filter(p => p.status === 'draft').length;

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (project: PortfolioProject) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const handleCopyShareableUrl = () => {
    const url = `${window.location.origin}/portfolio/${user.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleToggleVisibility = () => {
    updatePortfolioVisibility({ isPublic: !visibility.isPublic });
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb items={[{ label: 'Portfolio Builder' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <FolderGit2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-lime">
              Executive Career Proof
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-ivory tracking-tight">
            Analytical Portfolio Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Document rigorous end-to-end data narratives: commercial problem framing, dataset hygiene, SQL/Python modeling, and executive-level recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplatesGallery(prev => !prev)}
            icon={<Sparkles className="w-3.5 h-3.5 text-lime" />}
          >
            {showTemplatesGallery ? 'Hide Blueprints' : 'Starter Blueprints (8)'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            icon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Public Visibility & Share Controls Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-charcoal border border-charcoal-border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              visibility.isPublic
                ? 'bg-lime/10 border-lime/30 text-lime'
                : 'bg-charcoal-muted border-charcoal-border text-slate-400'
            }`}
          >
            {visibility.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-soft-ivory">
                Public Portfolio URL
              </span>
              <Badge variant={visibility.isPublic ? 'lime' : 'neutral'} size="sm">
                {visibility.isPublic ? 'Live Public' : 'Private / Unlisted'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {visibility.isPublic
                ? `${publishedCount} published project${publishedCount === 1 ? '' : 's'} visible to external visitors and recruiters.`
                : 'Your portfolio is currently private. Only you can view your case studies.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToggleVisibility}
            icon={visibility.isPublic ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
          >
            {visibility.isPublic ? 'Set Private' : 'Make Public'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/portfolio/${user.id}`)}
            icon={<Eye className="w-3.5 h-3.5" />}
          >
            Preview Public Page
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyShareableUrl}
            icon={copiedLink ? <Check className="w-3.5 h-3.5 text-lime" /> : <Share2 className="w-3.5 h-3.5" />}
          >
            {copiedLink ? 'Copied Link!' : 'Share Portfolio'}
          </Button>
        </div>
      </div>

      {/* Starter Templates Gallery (Expandable) */}
      {showTemplatesGallery && (
        <div className="p-6 rounded-2xl bg-charcoal border border-lime/30 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime" />
              <h2 className="text-sm font-bold text-soft-ivory uppercase tracking-wider font-mono">
                8 Starter Project Blueprints (Coding & Non-Coding)
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Select a blueprint to load industry-standard problem statements, objectives, and workflow outlines.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROJECT_TEMPLATES.map(tmpl => (
              <div
                key={tmpl.id}
                className="p-4 rounded-xl bg-midnight/70 border border-charcoal-border hover:border-lime/50 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => {
                  setEditingProject(null);
                  setIsEditorOpen(true);
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <Badge variant="cyan" size="sm">
                      {tmpl.projectType.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-400">{tmpl.difficulty}</span>
                  </div>
                  <h4 className="text-sm font-bold text-soft-ivory group-hover:text-lime transition-colors">
                    {tmpl.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {tmpl.summary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-charcoal-border/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-300">~{tmpl.estimatedHours}h depth</span>
                  <span className="text-lime group-hover:underline flex items-center gap-1">
                    Start Blueprint →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-charcoal border border-charcoal-border overflow-x-auto scrollbar-thin">
            <button
              onClick={() => setActiveStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStatusFilter === 'all'
                  ? 'bg-midnight text-lime font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStatusFilter === 'published'
                  ? 'bg-midnight text-lime font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setActiveStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeStatusFilter === 'draft'
                  ? 'bg-midnight text-orange font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, tool, or skill..."
              className="w-full pl-9 pr-4 py-2 bg-charcoal border border-charcoal-border rounded-xl text-xs text-soft-ivory placeholder-slate-500 focus:outline-none focus:border-lime"
            />
          </div>
        </div>

        {/* Secondary Modality & Domain Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedDomain}
            onChange={e => setSelectedDomain(e.target.value)}
            className="bg-charcoal border border-charcoal-border rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-lime"
          >
            <option value="all">All Domains (15)</option>
            {CURRICULUM_DOMAINS.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-charcoal border border-charcoal-border rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-lime"
          >
            <option value="all">All Modalities</option>
            <option value="coding">Coding (SQL / Python)</option>
            <option value="spreadsheet">Spreadsheet Analysis</option>
            <option value="business_case">Business Case Study</option>
            <option value="bi_dashboard">BI & Dashboard</option>
            <option value="statistical_study">Statistical Study</option>
          </select>

          {(selectedDomain !== 'all' || selectedType !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="text-orange hover:underline text-[11px]"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal/50 border border-charcoal-border border-dashed space-y-4">
          <div className="w-12 h-12 rounded-xl bg-charcoal flex items-center justify-center mx-auto text-slate-400 border border-charcoal-border">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-soft-ivory">No projects found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {searchQuery || selectedDomain !== 'all' || selectedType !== 'all'
                ? 'No projects match your current filter criteria. Try resetting your search filters.'
                : 'You have not created any projects in this view yet. Start with a blank canvas or pick one of our 8 blueprints.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(proj => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-charcoal border border-charcoal-border hover:border-slate-600 transition-all flex flex-col justify-between shadow-sm relative group"
            >
              <div className="space-y-4">
                {/* Status and Type Pills */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={proj.status === 'published' ? 'lime' : 'neutral'} size="sm">
                      {proj.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant="cyan" size="sm">
                      {proj.projectType.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(proj.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title and Short Description */}
                <div>
                  <h3
                    onClick={() => setInspectingProject(proj)}
                    className="text-lg font-bold text-soft-ivory hover:text-lime transition-colors cursor-pointer tracking-tight"
                  >
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                    {proj.shortDescription}
                  </p>
                </div>

                {/* Problem Statement Snippet */}
                <div className="p-3 rounded-xl bg-midnight/50 border border-charcoal-border/70 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-lime block mb-1">
                    Problem Focus:
                  </span>
                  <p className="text-slate-300 line-clamp-2 leading-relaxed">
                    {proj.problemStatement}
                  </p>
                </div>

                {/* Tools & Skills */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tools.slice(0, 4).map(tool => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded bg-charcoal-muted border border-charcoal-border text-[10px] font-mono text-cyan"
                      >
                        {tool}
                      </span>
                    ))}
                    {proj.tools.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                        +{proj.tools.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-5 border-t border-charcoal-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectingProject(proj)}
                    className="text-xs text-slate-300 hover:text-lime flex items-center gap-1 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" /> Read Case Study
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="text-xs text-slate-300 hover:text-cyan flex items-center gap-1 font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {proj.status === 'published' ? (
                    <button
                      onClick={() => unpublishProject(proj.id)}
                      className="text-xs text-slate-400 hover:text-orange transition-colors"
                      title="Unpublish to Draft"
                    >
                      Unpublish
                    </button>
                  ) : (
                    <button
                      onClick={() => publishProject(proj.id)}
                      className="text-xs text-lime hover:underline transition-colors font-medium"
                      title="Publish to public portfolio"
                    >
                      Publish (+150 XP)
                    </button>
                  )}
                  <button
                    onClick={() => setProjectToDelete(proj)}
                    className="p-1 rounded text-slate-500 hover:text-orange hover:bg-orange/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <ProjectEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialProject={editingProject}
        onSaved={saved => {
          // state synced via UserContext
        }}
      />

      {/* Deletion Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center gap-3 text-orange">
              <span className="p-2 rounded-xl bg-orange/10 border border-orange/20">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-soft-ivory">Delete Project</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-soft-ivory">"{projectToDelete.title}"</strong>? This will permanently remove its case study narrative and visual artifacts.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setProjectToDelete(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Inspection Drawer/Modal */}
      {inspectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-charcoal border border-charcoal-border rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl font-sans my-6">
            <div className="flex items-start justify-between gap-4 border-b border-charcoal-border pb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={inspectingProject.status === 'published' ? 'lime' : 'neutral'} size="sm">
                    {inspectingProject.status.toUpperCase()}
                  </Badge>
                  <Badge variant="cyan" size="sm">
                    {inspectingProject.projectType.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    {inspectingProject.domainName}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-soft-ivory tracking-tight">
                  {inspectingProject.title}
                </h2>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {inspectingProject.shortDescription}
                </p>
              </div>

              <button
                onClick={() => setInspectingProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-midnight transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">
                  1. Business Context & Problem Statement
                </h4>
                <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border text-slate-200 whitespace-pre-wrap">
                  {inspectingProject.problemStatement}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">
                  2. Dataset & Hygiene
                </h4>
                <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border flex flex-wrap gap-4 text-xs font-mono text-cyan">
                  <span>Name: {inspectingProject.datasetInfo?.name}</span>
                  {inspectingProject.datasetInfo?.rowCount && (
                    <span>Records: {inspectingProject.datasetInfo.rowCount.toLocaleString()}</span>
                  )}
                  {inspectingProject.datasetInfo?.source && (
                    <span>Source: {inspectingProject.datasetInfo.source}</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">
                  3. Methodology & Technical Approach
                </h4>
                <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border font-mono text-xs text-slate-200 whitespace-pre-wrap">
                  {inspectingProject.methodology}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">
                  4. Findings & Evidence Analysis
                </h4>
                <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border font-mono text-xs text-slate-200 whitespace-pre-wrap">
                  {inspectingProject.analysisAndFindings}
                </div>
              </div>

              {inspectingProject.visualizations?.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">
                    Visual Evidence Tables
                  </h4>
                  <div className="space-y-3">
                    {inspectingProject.visualizations.map(viz => (
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
                <h4 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">
                  5. Actionable Executive Recommendations
                </h4>
                <div className="p-4 rounded-xl bg-midnight/60 border border-charcoal-border text-soft-ivory whitespace-pre-wrap">
                  {inspectingProject.conclusionsAndRecommendations}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-charcoal-border flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const proj = inspectingProject;
                  setInspectingProject(null);
                  handleOpenEditModal(proj);
                }}
                icon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Open in Editor
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setInspectingProject(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
