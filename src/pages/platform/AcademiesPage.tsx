import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import { DomainClassification, PriorityLevel } from '../../types/curriculum';
import { useUser } from '../../context/UserContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, ClassificationBadge, PriorityBadge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import {
  Search,
  Filter,
  Check,
  Plus,
  BookOpen,
  ArrowRight,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const AcademiesPage: React.FC = () => {
  const { user, toggleDomainSelection } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  const classifications = useMemo(() => {
    const set = new Set<string>();
    CURRICULUM_DOMAINS.forEach(d => set.add(d.classification));
    return ['ALL', ...Array.from(set)];
  }, []);

  const priorityLevels = ['ALL', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];

  const filteredDomains = useMemo(() => {
    return CURRICULUM_DOMAINS.filter(domain => {
      const matchesSearch =
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesClassification =
        selectedClassification === 'ALL' || domain.classification === selectedClassification;

      const matchesPriority =
        selectedPriority === 'ALL' || domain.defaultPriority === selectedPriority;

      return matchesSearch && matchesClassification && matchesPriority;
    });
  }, [searchQuery, selectedClassification, selectedPriority]);

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb items={[{ label: 'Academies Directory' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-lime font-bold">
              Authoritative Master Curriculum
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            15 Skill Academies
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            The complete 15-domain knowledge library. Retaining every original classification, subtopic, and priority tier. Browse independently or customize your personal roadmap.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-charcoal-elevated px-3 py-2 rounded-lg border border-charcoal-border shrink-0">
          Selected in Journey:{' '}
          <span className="text-lime font-bold">{user.selectedDomainIds.length}</span> of 15
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-charcoal-surface p-4 rounded-xl border border-charcoal-border">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search domains, topics, or tools (e.g. SQL, Cohort, Tableau, BigQuery, Pandas)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-midnight border border-charcoal-border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lime/60 font-sans"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono uppercase tracking-wider text-[11px] shrink-0">
            Priority Tier:
          </span>
          {priorityLevels.map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedPriority(lvl)}
              className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                selectedPriority === lvl
                  ? 'bg-lime text-midnight font-bold'
                  : 'bg-charcoal-elevated text-slate-300 hover:text-white border border-charcoal-border'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Classification Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono uppercase tracking-wider text-[11px] shrink-0">
            Classification:
          </span>
          {classifications.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClassification(cls)}
              className={`px-2 py-0.5 rounded text-[11px] font-heading uppercase transition-colors ${
                selectedClassification === cls
                  ? 'bg-cyan text-midnight font-bold'
                  : 'bg-midnight text-slate-400 hover:text-white border border-charcoal-border'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDomains.map(domain => {
          const isSelected = user.selectedDomainIds.includes(domain.id);
          const totalSubtopics = domain.topics.reduce((acc, t) => acc + t.subtopics.length, 0);

          return (
            <Card
              key={domain.id}
              variant="interactive"
              className="p-6 flex flex-col justify-between border-charcoal-border hover:border-lime/50 transition-all group"
            >
              <div>
                {/* Domain Top Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ACADEMY {domain.number.toString().padStart(2, '0')}
                  </span>
                  <PriorityBadge level={domain.defaultPriority} />
                </div>

                {/* Title */}
                <Link to={`/academies/${domain.slug}`}>
                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-lime transition-colors mb-2">
                    {domain.name}
                  </h3>
                </Link>

                {/* Original Classification Label */}
                <div className="mb-3">
                  <ClassificationBadge classification={domain.classification} size="sm" />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {domain.description}
                </p>

                {/* Tools */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {domain.tools.slice(0, 3).map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-midnight border border-charcoal-border text-slate-400"
                    >
                      {tool}
                    </span>
                  ))}
                  {domain.tools.length > 3 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                      +{domain.tools.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-charcoal-border flex items-center justify-between gap-2">
                <div className="text-[11px] font-mono text-slate-400">
                  <span>{domain.topics.length} topics</span> • <span>{totalSubtopics} subtopics</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => {
                      e.preventDefault();
                      toggleDomainSelection(domain.id);
                    }}
                    title={isSelected ? 'Remove from My Journey' : 'Add to My Journey'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-lime/20 border-lime/40 text-lime'
                        : 'bg-charcoal-elevated border-charcoal-border text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>

                  <Link to={`/academies/${domain.slug}`}>
                    <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredDomains.length === 0 && (
        <div className="text-center py-16 bg-charcoal-surface rounded-xl border border-charcoal-border p-8">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-heading font-bold text-white mb-1">No academies match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, priority tier, or classification filter to view the syllabus domains.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedClassification('ALL');
              setSelectedPriority('ALL');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};
