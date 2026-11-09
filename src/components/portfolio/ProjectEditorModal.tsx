import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PortfolioProject, ProjectType, ProjectVisualization } from '../../types/portfolio';
import { PROJECT_TEMPLATES } from '../../data/projectTemplatesData';
import { useUser } from '../../context/UserContext';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import {
  X,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCode2,
  Table,
  Briefcase,
  LineChart,
  Brain,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: PortfolioProject | null;
  onSaved: (project: PortfolioProject) => void;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  onClose,
  initialProject,
  onSaved,
}) => {
  const { user, saveProject, publishProject } = useUser();

  const [activeTab, setActiveTab] = useState<'overview' | 'problem' | 'data_tools' | 'methodology' | 'recommendations' | 'preview'>('overview');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Form State
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [domainId, setDomainId] = useState<string>('sql-relational-databases');
  const [projectType, setProjectType] = useState<ProjectType>('coding');
  const [problemStatement, setProblemStatement] = useState<string>('');
  const [businessContext, setBusinessContext] = useState<string>('');
  const [datasetName, setDatasetName] = useState<string>('');
  const [datasetSource, setDatasetSource] = useState<string>('');
  const [datasetRowCount, setDatasetRowCount] = useState<string>('');
  const [datasetDescription, setDatasetDescription] = useState<string>('');
  const [linkedChallengeId, setLinkedChallengeId] = useState<string>('');
  const [tools, setTools] = useState<string[]>(['SQL', 'PostgreSQL']);
  const [toolInput, setToolInput] = useState<string>('');
  const [methodology, setMethodology] = useState<string>('');
  const [analysisAndFindings, setAnalysisAndFindings] = useState<string>('');
  const [visualizations, setVisualizations] = useState<ProjectVisualization[]>([]);
  const [conclusionsAndRecommendations, setConclusionsAndRecommendations] = useState<string>('');
  const [skillsDemonstrated, setSkillsDemonstrated] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
  const [outcomeInput, setOutcomeInput] = useState<string>('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize or reset form
  useEffect(() => {
    if (initialProject) {
      setId(initialProject.id);
      setTitle(initialProject.title);
      setShortDescription(initialProject.shortDescription);
      setDomainId(initialProject.domainId);
      setProjectType(initialProject.projectType);
      setProblemStatement(initialProject.problemStatement);
      setBusinessContext(initialProject.businessContext);
      setDatasetName(initialProject.datasetInfo?.name || '');
      setDatasetSource(initialProject.datasetInfo?.source || '');
      setDatasetRowCount(initialProject.datasetInfo?.rowCount ? String(initialProject.datasetInfo.rowCount) : '');
      setDatasetDescription(initialProject.datasetInfo?.description || '');
      setLinkedChallengeId(initialProject.linkedChallengeId || '');
      setTools(initialProject.tools || []);
      setMethodology(initialProject.methodology || '');
      setAnalysisAndFindings(initialProject.analysisAndFindings || '');
      setVisualizations(initialProject.visualizations || []);
      setConclusionsAndRecommendations(initialProject.conclusionsAndRecommendations || '');
      setSkillsDemonstrated(initialProject.skillsDemonstrated || []);
      setLearningOutcomes(initialProject.learningOutcomes || []);
      setStatus(initialProject.status);
    } else {
      setId(`proj-${Date.now()}`);
      setTitle('');
      setShortDescription('');
      setDomainId('sql-relational-databases');
      setProjectType('coding');
      setProblemStatement('');
      setBusinessContext('');
      setDatasetName('');
      setDatasetSource('');
      setDatasetRowCount('');
      setDatasetDescription('');
      setLinkedChallengeId('');
      setTools(['SQL', 'PostgreSQL']);
      setMethodology('');
      setAnalysisAndFindings('');
      setVisualizations([]);
      setConclusionsAndRecommendations('');
      setSkillsDemonstrated(['SQL Querying', 'Analytical Thinking']);
      setLearningOutcomes(['Mastered multi-table queries']);
      setStatus('draft');
    }
    setErrors({});
    setFeedbackMessage(null);
    setSelectedTemplateId('');
    setActiveTab('overview');
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  // Apply template
  const handleApplyTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = PROJECT_TEMPLATES.find(t => t.id === tmplId);
    if (!tmpl) return;

    setTitle(tmpl.title);
    setShortDescription(tmpl.summary);
    setDomainId(tmpl.domainId);
    setProjectType(tmpl.projectType);
    setProblemStatement(tmpl.problemStatement);
    setBusinessContext(tmpl.businessContext);
    setDatasetName(tmpl.sampleDatasetName);
    setDatasetSource('Curriculum Practice Repository');
    setDatasetRowCount('15000');
    setDatasetDescription(`Structured benchmark dataset for ${tmpl.title}`);
    setTools(tmpl.recommendedTools);
    setMethodology(tmpl.starterMarkdown.methodology);
    setAnalysisAndFindings(tmpl.starterMarkdown.analysisAndFindings);
    setConclusionsAndRecommendations(tmpl.starterMarkdown.conclusionsAndRecommendations);
    setSkillsDemonstrated(tmpl.objectives.map(o => o.split(':')[0] || o.slice(0, 30)));
    setLearningOutcomes(tmpl.expectedDeliverables);

    setFeedbackMessage({
      type: 'success',
      text: `Loaded starter blueprint "${tmpl.title}". Customize the sections with your own analytical findings!`,
    });
  };

  // Add tool tag
  const handleAddTool = () => {
    const trimmed = toolInput.trim();
    if (trimmed && !tools.includes(trimmed)) {
      setTools([...tools, trimmed]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (tool: string) => {
    setTools(tools.filter(t => t !== tool));
  };

  // Add skill tag
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skillsDemonstrated.includes(trimmed)) {
      setSkillsDemonstrated([...skillsDemonstrated, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsDemonstrated(skillsDemonstrated.filter(s => s !== skill));
  };

  // Add outcome tag
  const handleAddOutcome = () => {
    const trimmed = outcomeInput.trim();
    if (trimmed && !learningOutcomes.includes(trimmed)) {
      setLearningOutcomes([...learningOutcomes, trimmed]);
      setOutcomeInput('');
    }
  };

  const handleRemoveOutcome = (outcome: string) => {
    setLearningOutcomes(learningOutcomes.filter(o => o !== outcome));
  };

  // Add visualization item
  const handleAddVisualization = () => {
    const newViz: ProjectVisualization = {
      id: `viz-${Date.now()}`,
      title: 'Cohort Retention / KPI Diagnostic Chart',
      caption: 'Visual breakdown showing baseline vs experimental variance.',
      chartType: 'bar',
      dataSnapshot: '| Segment | Conversion % | Revenue Uplift |\n| --- | --- | --- |\n| Control | 3.4% | Baseline |\n| Variant | 4.8% | +$120K |',
    };
    setVisualizations([...visualizations, newViz]);
  };

  const handleRemoveVisualization = (vizId: string) => {
    setVisualizations(visualizations.filter(v => v.id !== vizId));
  };

  const handleUpdateVizSnapshot = (vizId: string, dataSnapshot: string) => {
    setVisualizations(
      visualizations.map(v => (v.id === vizId ? { ...v, dataSnapshot } : v))
    );
  };

  // Build current project object
  const buildProjectData = (targetStatus: 'draft' | 'published'): PortfolioProject => {
    const domainObj = CURRICULUM_DOMAINS.find(d => d.id === domainId);
    return {
      id: id || `proj-${Date.now()}`,
      userId: user.id,
      authorName: user.name,
      title: title.trim() || 'Untitled Analytical Project',
      shortDescription: shortDescription.trim(),
      domainId,
      domainName: domainObj ? domainObj.name : 'Data Analytics',
      projectType,
      problemStatement: problemStatement.trim(),
      businessContext: businessContext.trim(),
      datasetInfo: {
        name: datasetName.trim() || 'Custom Dataset',
        source: datasetSource.trim() || 'Observed Operations',
        rowCount: datasetRowCount ? parseInt(datasetRowCount, 10) : undefined,
        description: datasetDescription.trim(),
      },
      tools,
      methodology: methodology.trim(),
      analysisAndFindings: analysisAndFindings.trim(),
      visualizations,
      conclusionsAndRecommendations: conclusionsAndRecommendations.trim(),
      skillsDemonstrated,
      learningOutcomes,
      linkedChallengeId: linkedChallengeId || undefined,
      status: targetStatus,
      isPublic: targetStatus === 'published',
      createdAt: initialProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Save Draft
  const handleSaveDraft = () => {
    if (!title.trim()) {
      setErrors({ title: 'Project title is required even for drafts.' });
      setFeedbackMessage({ type: 'error', text: 'Please enter a project title before saving.' });
      return;
    }

    const projectData = buildProjectData('draft');
    saveProject(projectData);
    setStatus('draft');
    setFeedbackMessage({ type: 'success', text: 'Project draft saved successfully. You can safely resume editing at any time.' });
    onSaved(projectData);
  };

  // Validate and Publish
  const handlePublish = () => {
    const validationErrors: Record<string, string> = {};
    if (!title.trim()) validationErrors.title = 'Project title is required.';
    if (!shortDescription.trim()) validationErrors.shortDescription = 'Short description is required.';
    if (!problemStatement.trim()) validationErrors.problemStatement = 'Business problem statement is required.';
    if (!methodology.trim()) validationErrors.methodology = 'Investigation methodology is required.';
    if (!analysisAndFindings.trim()) validationErrors.analysisAndFindings = 'Key findings and analysis are required.';
    if (!conclusionsAndRecommendations.trim()) validationErrors.conclusionsAndRecommendations = 'Conclusions and recommendations are required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedbackMessage({
        type: 'error',
        text: 'Please complete all required sections before publishing to your public portfolio.',
      });
      // Jump to first errored tab
      if (validationErrors.title || validationErrors.shortDescription) setActiveTab('overview');
      else if (validationErrors.problemStatement) setActiveTab('problem');
      else if (validationErrors.methodology || validationErrors.analysisAndFindings) setActiveTab('methodology');
      else if (validationErrors.conclusionsAndRecommendations) setActiveTab('recommendations');
      return;
    }

    const projectData = buildProjectData('published');
    saveProject(projectData);
    publishProject(projectData.id);
    setStatus('published');
    setFeedbackMessage({
      type: 'success',
      text: 'Congratulations! Project published to your portfolio (+150 XP awarded).',
    });
    setTimeout(() => {
      onSaved(projectData);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-charcoal border border-charcoal-border rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-charcoal-border flex items-center justify-between bg-charcoal-muted shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <FileCode2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-soft-ivory">
                  {initialProject ? 'Edit Portfolio Project' : 'Structured Project Studio'}
                </h2>
                <Badge variant={status === 'published' ? 'lime' : 'neutral'} size="sm">
                  {status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Document rigorous analytical problem solving, business context, and quantifiable recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              icon={<Save className="w-3.5 h-3.5" />}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Publish (+150 XP)
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-charcoal transition-colors ml-2"
              title="Close editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback alert banner */}
        {feedbackMessage && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
              feedbackMessage.type === 'success'
                ? 'bg-lime/10 border-lime/30 text-lime'
                : 'bg-orange/10 border-orange/30 text-orange'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Starter Template Quick Picker (Only on new project or when draft) */}
        {!initialProject && status === 'draft' && (
          <div className="px-6 py-3 bg-midnight/40 border-b border-charcoal-border flex items-center gap-3 overflow-x-auto scrollbar-thin shrink-0">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-lime" />
              Load Template:
            </span>
            {PROJECT_TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tmpl.id)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap border transition-all ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-lime/20 border-lime text-lime font-medium shadow-sm'
                    : 'bg-charcoal border-charcoal-border text-slate-300 hover:border-slate-500'
                }`}
              >
                {tmpl.title.split(' ')[0]} {tmpl.title.split(' ')[1]}
              </button>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-charcoal-border flex items-center gap-1 bg-charcoal overflow-x-auto scrollbar-thin shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-lime text-lime'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Overview & Scope
          </button>
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'problem'
                ? 'border-lime text-lime'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Business Context
          </button>
          <button
            onClick={() => setActiveTab('data_tools')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'data_tools'
                ? 'border-lime text-lime'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Data & Tools
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'methodology'
                ? 'border-lime text-lime'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Methodology & Findings
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'recommendations'
                ? 'border-lime text-lime'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Recommendations & Outcomes
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`ml-auto px-3 py-2.5 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'border-cyan text-cyan'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Project Title <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  placeholder="e.g. E-Commerce Omnichannel Customer Churn & Cohort Investigation"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2.5 text-sm text-soft-ivory focus:outline-none focus:border-lime"
                />
                {errors.title && <p className="text-xs text-orange mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Short Executive Summary / Tagline <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={e => {
                    setShortDescription(e.target.value);
                    if (errors.shortDescription) setErrors({ ...errors, shortDescription: '' });
                  }}
                  placeholder="A concise 1-2 sentence description explaining the central analytical question and primary outcome."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2.5 text-sm text-soft-ivory focus:outline-none focus:border-lime resize-none"
                />
                {errors.shortDescription && <p className="text-xs text-orange mt-1">{errors.shortDescription}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Primary Domain
                  </label>
                  <select
                    value={domainId}
                    onChange={e => setDomainId(e.target.value)}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory focus:outline-none focus:border-lime"
                  >
                    {CURRICULUM_DOMAINS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Project Modality / Type
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value as ProjectType)}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory focus:outline-none focus:border-lime"
                  >
                    <option value="coding">Coding (SQL / Python / Scripting)</option>
                    <option value="spreadsheet">Spreadsheet Analysis (Excel / Formulas / Pivots)</option>
                    <option value="business_case">Business Case Study (Strategy / Root Cause / Operations)</option>
                    <option value="bi_dashboard">BI & Dashboard (Tableau / Power BI / Looker)</option>
                    <option value="statistical_study">Statistical Study (A/B Testing / Hypothesis)</option>
                  </select>
                </div>
              </div>

              {/* Link Completed Challenge or Playground Dataset */}
              <div className="p-4 rounded-xl bg-midnight/50 border border-charcoal-border space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-lime">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Link Existing Work (Optional)</span>
                </div>
                <p className="text-xs text-slate-400">
                  You can connect this project to a completed Phase 4 challenge to display verified badges.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Connect Phase 4 Challenge</label>
                    <select
                      value={linkedChallengeId}
                      onChange={e => setLinkedChallengeId(e.target.value)}
                      className="w-full bg-midnight border border-charcoal-border rounded-lg px-2.5 py-1.5 text-xs text-soft-ivory"
                    >
                      <option value="">None (Standalone Project)</option>
                      <option value="ch-01">CH-01: E-Commerce Churn Investigation</option>
                      <option value="ch-02">CH-02: Payment Gateway Anomaly Audit</option>
                      <option value="ch-03">CH-03: Marketing Attribution Modeling</option>
                      <option value="ch-04">CH-04: Multi-Territory Margin Sensitivity</option>
                      <option value="ch-05">CH-05: Executive BI Dashboard Specification</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Dataset Origin</label>
                    <input
                      type="text"
                      value={datasetName}
                      onChange={e => setDatasetName(e.target.value)}
                      placeholder="e.g. Retail_Sales_2025.csv"
                      className="w-full bg-midnight border border-charcoal-border rounded-lg px-2.5 py-1.5 text-xs text-soft-ivory"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROBLEM & CONTEXT */}
          {activeTab === 'problem' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-lime/5 border border-lime/20 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-lime">Observer Tip:</strong> Elite data portfolios hook reviewers by framing the problem around commercial risk or lost revenue rather than technical steps alone.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Business Problem Statement <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={4}
                  value={problemStatement}
                  onChange={e => {
                    setProblemStatement(e.target.value);
                    if (errors.problemStatement) setErrors({ ...errors, problemStatement: '' });
                  }}
                  placeholder="Detail the specific commercial crisis or question. E.g. Month-2 retention dropped from 64.8% to 41.2% in Latin America post-redesign, creating a $1.8M ARR revenue headwind."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2.5 text-sm text-soft-ivory focus:outline-none focus:border-lime"
                />
                {errors.problemStatement && <p className="text-xs text-orange mt-1">{errors.problemStatement}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Organizational Context & Stakeholders
                </label>
                <textarea
                  rows={3}
                  value={businessContext}
                  onChange={e => setBusinessContext(e.target.value)}
                  placeholder="Who are the primary decision makers? (e.g. Chief Product Officer, VP of Customer Success). What trade-offs were they balancing?"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2.5 text-sm text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>
            </div>
          )}

          {/* TAB 3: DATA & TOOLS */}
          {activeTab === 'data_tools' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Dataset Name
                  </label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={e => setDatasetName(e.target.value)}
                    placeholder="e.g. Transactions_2025.db"
                    className="w-full bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Data Source / System
                  </label>
                  <input
                    type="text"
                    value={datasetSource}
                    onChange={e => setDatasetSource(e.target.value)}
                    placeholder="e.g. Internal Event Logs / ERP"
                    className="w-full bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Row Count (Records)
                  </label>
                  <input
                    type="number"
                    value={datasetRowCount}
                    onChange={e => setDatasetRowCount(e.target.value)}
                    placeholder="e.g. 142000"
                    className="w-full bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Schema & Data Hygiene Overview
                </label>
                <textarea
                  rows={2}
                  value={datasetDescription}
                  onChange={e => setDatasetDescription(e.target.value)}
                  placeholder="Outline key schema tables, primary keys, and null/outlier handling protocols."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2 text-sm text-soft-ivory"
                />
              </div>

              {/* Tools Tags */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Tools & Technologies Used
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={e => setToolInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                    placeholder="Add tool (e.g. SQL, DuckDB, Python, Pandas, Tableau, Power BI)"
                    className="flex-1 bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory"
                  />
                  <Button variant="secondary" size="sm" onClick={handleAddTool} icon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map(tool => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-md bg-charcoal-muted border border-charcoal-border text-xs text-slate-200 flex items-center gap-1.5"
                    >
                      {tool}
                      <button
                        onClick={() => handleRemoveTool(tool)}
                        className="text-slate-400 hover:text-orange"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: METHODOLOGY & FINDINGS */}
          {activeTab === 'methodology' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Investigation Methodology & Approach <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={5}
                  value={methodology}
                  onChange={e => {
                    setMethodology(e.target.value);
                    if (errors.methodology) setErrors({ ...errors, methodology: '' });
                  }}
                  placeholder="Describe your step-by-step workflow: query design, cohort windows, data transformations, formulas, or statistical assumptions."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-lime"
                />
                {errors.methodology && <p className="text-xs text-orange mt-1">{errors.methodology}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Key Findings & Empirical Analysis <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={5}
                  value={analysisAndFindings}
                  onChange={e => {
                    setAnalysisAndFindings(e.target.value);
                    if (errors.analysisAndFindings) setErrors({ ...errors, analysisAndFindings: '' });
                  }}
                  placeholder="Detail the root cause and numbers uncovered. What was the critical inflection point or metric divergence?"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-lime"
                />
                {errors.analysisAndFindings && <p className="text-xs text-orange mt-1">{errors.analysisAndFindings}</p>}
              </div>

              {/* Visualizations and Data Tables */}
              <div className="p-4 rounded-xl bg-midnight/40 border border-charcoal-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                      Visual Artifacts & Data Tables ({visualizations.length})
                    </h4>
                    <p className="text-xs text-slate-400">
                      Add summary metrics, markdown tables, or chart snapshots supporting your analysis.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddVisualization}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Artifact
                  </Button>
                </div>

                {visualizations.map((viz, idx) => (
                  <div key={viz.id} className="p-3 bg-charcoal rounded-xl border border-charcoal-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-soft-ivory">Artifact #{idx + 1}: {viz.title}</span>
                      <button
                        onClick={() => handleRemoveVisualization(viz.id)}
                        className="text-xs text-orange/70 hover:text-orange flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={viz.dataSnapshot || ''}
                      onChange={e => handleUpdateVizSnapshot(viz.id, e.target.value)}
                      placeholder="Markdown table or formatted KPI breakdown..."
                      className="w-full bg-midnight border border-charcoal-border rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RECOMMENDATIONS & OUTCOMES */}
          {activeTab === 'recommendations' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Strategic Conclusions & Actionable Business Recommendations <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={5}
                  value={conclusionsAndRecommendations}
                  onChange={e => {
                    setConclusionsAndRecommendations(e.target.value);
                    if (errors.conclusionsAndRecommendations) setErrors({ ...errors, conclusionsAndRecommendations: '' });
                  }}
                  placeholder="Provide 3 concrete, prioritized executive actions. Quantify the expected upside or cost savings."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2.5 text-sm text-soft-ivory focus:outline-none focus:border-lime"
                />
                {errors.conclusionsAndRecommendations && (
                  <p className="text-xs text-orange mt-1">{errors.conclusionsAndRecommendations}</p>
                )}
              </div>

              {/* Skills tags */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Demonstrated Competencies / Skills
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="e.g. Window Functions, Cohort Analysis, DCF Modeling"
                    className="flex-1 bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory"
                  />
                  <Button variant="secondary" size="sm" onClick={handleAddSkill} icon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillsDemonstrated.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md bg-lime/10 border border-lime/30 text-xs text-lime flex items-center gap-1.5"
                    >
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="hover:text-orange">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning outcomes */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Key Learnings & Takeaways
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={outcomeInput}
                    onChange={e => setOutcomeInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                    placeholder="e.g. Mastered asynchronous pixel impact on checkout latency"
                    className="flex-1 bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-sm text-soft-ivory"
                  />
                  <Button variant="secondary" size="sm" onClick={handleAddOutcome} icon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {learningOutcomes.map(out => (
                    <span
                      key={out}
                      className="px-2.5 py-1 rounded-md bg-charcoal-muted border border-charcoal-border text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      {out}
                      <button onClick={() => handleRemoveOutcome(out)} className="hover:text-orange">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6 bg-midnight/60 p-6 rounded-2xl border border-charcoal-border">
              <div className="border-b border-charcoal-border pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="cyan" size="sm">
                    {projectType.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    {CURRICULUM_DOMAINS.find(d => d.id === domainId)?.name}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-soft-ivory tracking-tight mb-2">
                  {title || 'Untitled Analytical Project'}
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {shortDescription || 'Short description preview.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tools.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-charcoal text-[11px] font-mono text-cyan border border-charcoal-border">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">1. Business Problem</h3>
                  <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {problemStatement || 'Problem statement will appear here.'}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">2. Methodology</h3>
                  <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {methodology || 'Methodology details will appear here.'}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">3. Findings & Evidence</h3>
                  <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {analysisAndFindings || 'Findings will appear here.'}
                  </div>
                </div>

                {visualizations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">Visual Evidence Tables</h3>
                    <div className="space-y-3">
                      {visualizations.map(v => (
                        <div key={v.id} className="p-3 bg-charcoal rounded-xl border border-charcoal-border">
                          <p className="text-xs font-semibold text-soft-ivory mb-1">{v.title}</p>
                          <pre className="text-xs font-mono text-cyan overflow-x-auto p-2 bg-midnight rounded border border-charcoal-border">
                            {v.dataSnapshot}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-lime mb-1">4. Executive Recommendations</h3>
                  <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border text-sm text-soft-ivory whitespace-pre-wrap leading-relaxed">
                    {conclusionsAndRecommendations || 'Recommendations will appear here.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-charcoal-border bg-charcoal-muted flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400">
            {status === 'published' ? '✨ Published in public portfolio' : '📝 Draft mode: Not visible on public links'}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              icon={<Save className="w-3.5 h-3.5" />}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Publish Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
