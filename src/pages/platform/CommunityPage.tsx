import React, { useState, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useUser } from '../../context/UserContext';
import { CommunityDiscussion, DiscussionCategory } from '../../types/community';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import {
  Users,
  MessageSquare,
  Flame,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  Pin,
  Clock,
  Tag,
  AlertTriangle,
  Trash2,
  Edit2,
  CheckCircle2,
  Flag,
  Share2,
  ExternalLink,
  ChevronRight,
  X,
  Code2,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: (DiscussionCategory | 'All')[] = [
  'All',
  'SQL & Databases',
  'Python & Data Science',
  'Spreadsheets & Modeling',
  'Statistics & Mathematics',
  'Data Visualization & BI',
  'Business Analytics',
  'Portfolio Reviews',
  'Career & Interviews',
  'General Discussion',
];

export const CommunityPage: React.FC = () => {
  const {
    user,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    addReply,
    deleteReply,
    toggleUpvoteDiscussion,
    reportDiscussion,
  } = useUser();

  const [selectedCategory, setSelectedCategory] = useState<DiscussionCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'discussed'>('recent');

  // Modal & Drawer States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [reportingDiscussionId, setReportingDiscussionId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Spam or promotional content');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState<CommunityDiscussion | null>(null);
  const [editContent, setEditContent] = useState('');
  const [discussionToDelete, setDiscussionToDelete] = useState<string | null>(null);

  // New Discussion Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DiscussionCategory>('SQL & Databases');
  const [newDomainId, setNewDomainId] = useState<string>('sql-relational-databases');
  const [newContent, setNewContent] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newTags, setNewTags] = useState<string[]>(['SQL', 'BestPractices']);
  const [createError, setCreateError] = useState('');

  // Reply Form State
  const [replyInput, setReplyInput] = useState('');

  const discussions = user.discussions || [];

  // Filtered and Sorted Discussions
  const filteredDiscussions = useMemo(() => {
    return discussions
      .filter(d => {
        if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = d.title.toLowerCase().includes(q);
          const matchContent = d.content.toLowerCase().includes(q);
          const matchAuthor = d.authorName.toLowerCase().includes(q);
          const matchTag = d.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchContent && !matchAuthor && !matchTag) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned discussions always stay at the top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (sortBy === 'popular') return b.upvotes - a.upvotes;
        if (sortBy === 'discussed') return b.replies.length - a.replies.length;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [discussions, selectedCategory, searchQuery, sortBy]);

  const activeThread = discussions.find(d => d.id === activeThreadId) || null;

  // Handlers
  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (trimmed && !newTags.includes(trimmed)) {
      setNewTags([...newTags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewTags(newTags.filter(t => t !== tag));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setCreateError('Please enter a clear discussion question or title.');
      return;
    }
    if (!newContent.trim()) {
      setCreateError('Please provide context or code in the discussion description.');
      return;
    }

    const created = createDiscussion({
      title: newTitle.trim(),
      category: newCategory,
      domainId: newDomainId,
      content: newContent.trim(),
      tags: newTags,
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags(['SQL', 'BestPractices']);
    setCreateError('');
    setActiveThreadId(created.id);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThreadId) return;

    addReply(activeThreadId, replyInput.trim());
    setReplyInput('');
  };

  const handleConfirmDelete = () => {
    if (discussionToDelete) {
      deleteDiscussion(discussionToDelete);
      if (activeThreadId === discussionToDelete) {
        setActiveThreadId(null);
      }
      setDiscussionToDelete(null);
    }
  };

  const handleSaveEdit = () => {
    if (editingDiscussion && editContent.trim()) {
      updateDiscussion(editingDiscussion.id, editContent.trim());
      setEditingDiscussion(null);
      setEditContent('');
    }
  };

  const handleConfirmReport = () => {
    if (reportingDiscussionId) {
      reportDiscussion(reportingDiscussionId, reportReason);
      setReportSuccess(true);
      setTimeout(() => {
        setReportingDiscussionId(null);
        setReportSuccess(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb items={[{ label: 'Community & Discussions' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-lime">
              Peer Knowledge Exchange
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-ivory tracking-tight">
            Analytical Discussions & Insights Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Ask technical questions, get feedback on portfolio architectures, discuss tricky SQL window functions, and share verified analytical resources.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Discussion (+25 XP)
        </Button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-lime text-midnight border-lime font-bold shadow-sm'
                : 'bg-charcoal border-charcoal-border text-slate-300 hover:border-slate-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions, authors, or tags (e.g. WindowFunctions)..."
            className="w-full pl-9 pr-4 py-2 bg-charcoal border border-charcoal-border rounded-xl text-xs text-soft-ivory placeholder-slate-500 focus:outline-none focus:border-lime"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-charcoal border border-charcoal-border rounded-lg px-2.5 py-1.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Upvoted</option>
            <option value="discussed">Most Replies</option>
          </select>
        </div>
      </div>

      {/* Layout Grid: Discussions List & Active Thread Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Discussions List */}
        <div className={`${activeThread ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4`}>
          {filteredDiscussions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-charcoal/50 border border-charcoal-border border-dashed space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-soft-ivory">No discussions found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No threads match your current filter or search criteria. Be the first to start a conversation in this category!
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Start Discussion
              </Button>
            </div>
          ) : (
            filteredDiscussions.map(discussion => {
              const isSelected = activeThreadId === discussion.id;
              const isAuthor = discussion.authorId === user.id;

              return (
                <article
                  key={discussion.id}
                  onClick={() => setActiveThreadId(discussion.id)}
                  className={`p-5 rounded-2xl bg-charcoal border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-lime shadow-lg bg-charcoal-muted'
                      : 'border-charcoal-border hover:border-slate-600'
                  }`}
                >
                  {/* Pinned & Reported Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      {discussion.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-lime bg-lime/10 px-2 py-0.5 rounded border border-lime/30">
                          <Pin className="w-3 h-3" /> PINNED
                        </span>
                      )}
                      <Badge variant="cyan" size="sm">
                        {discussion.category}
                      </Badge>
                      {discussion.isReported && (
                        <span className="text-[10px] font-mono text-orange flex items-center gap-1 bg-orange/10 px-1.5 py-0.5 rounded border border-orange/30">
                          <Flag className="w-3 h-3" /> Under Review
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-soft-ivory group-hover:text-lime transition-colors tracking-tight leading-snug">
                    {discussion.title}
                  </h3>

                  {/* Content Snippet */}
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {discussion.content.replace(/```[\s\S]*?```/g, '[Code Block]')}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {discussion.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-midnight border border-charcoal-border text-[10px] font-mono text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 mt-4 border-t border-charcoal-border/50 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-midnight border border-charcoal-border flex items-center justify-center text-[10px] text-lime font-bold">
                        {discussion.authorName.charAt(0)}
                      </div>
                      <span className="text-slate-300 font-medium">
                        {discussion.authorName}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 text-[11px]">
                        {discussion.authorRole}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleUpvoteDiscussion(discussion.id);
                        }}
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors ${
                          discussion.upvotedByUser
                            ? 'text-lime bg-lime/10 border border-lime/30'
                            : 'text-slate-400 hover:text-soft-ivory'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{discussion.upvotes}</span>
                      </button>

                      <span className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3 h-3" />
                        <span>{discussion.replies.length}</span>
                      </span>

                      {/* Author Edit / Delete */}
                      {isAuthor && (
                        <div className="flex items-center gap-1.5 ml-1">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setEditingDiscussion(discussion);
                              setEditContent(discussion.content);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-cyan"
                            title="Edit discussion"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setDiscussionToDelete(discussion.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-orange"
                            title="Delete discussion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {!isAuthor && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setReportingDiscussionId(discussion.id);
                          }}
                          className="p-1 text-slate-500 hover:text-orange"
                          title="Report content"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Column: Active Thread Detail Drawer */}
        {activeThread && (
          <div className="lg:col-span-6 bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-6 shadow-xl sticky top-20 max-h-[85vh] overflow-y-auto scrollbar-thin">
            {/* Thread Header */}
            <div className="flex items-start justify-between gap-3 border-b border-charcoal-border pb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="cyan" size="sm">
                    {activeThread.category}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(activeThread.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-soft-ivory tracking-tight">
                  {activeThread.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span className="text-lime font-semibold">{activeThread.authorName}</span>
                  <span>({activeThread.authorRole})</span>
                </div>
              </div>

              <button
                onClick={() => setActiveThreadId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-soft-ivory hover:bg-midnight transition-colors"
                title="Close discussion view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Thread Content */}
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-midnight/50 p-4 rounded-xl border border-charcoal-border font-sans">
              {activeThread.content}
            </div>

            {/* Tags Strip */}
            <div className="flex flex-wrap gap-1.5">
              {activeThread.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-midnight border border-charcoal-border text-[11px] font-mono text-cyan"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Thread Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-charcoal-border/50 text-xs">
              <button
                onClick={() => toggleUpvoteDiscussion(activeThread.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  activeThread.upvotedByUser
                    ? 'bg-lime/20 border-lime text-lime font-semibold'
                    : 'bg-midnight border-charcoal-border text-slate-300 hover:border-slate-400'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{activeThread.upvotes} Upvotes</span>
              </button>

              <button
                onClick={() => setReportingDiscussionId(activeThread.id)}
                className="text-slate-500 hover:text-orange flex items-center gap-1 text-[11px]"
              >
                <Flag className="w-3 h-3" /> Report issue
              </button>
            </div>

            {/* Replies Section */}
            <div className="space-y-4 pt-4 border-t border-charcoal-border">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-soft-ivory flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-lime" />
                  Replies & Solutions ({activeThread.replies.length})
                </h4>
              </div>

              {activeThread.replies.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No replies yet. Be the first to share your analytical perspective!
                </p>
              ) : (
                <div className="space-y-3">
                  {activeThread.replies.map(reply => {
                    const isReplyAuthor = reply.authorId === user.id;
                    return (
                      <div
                        key={reply.id}
                        className="p-3.5 rounded-xl bg-midnight/70 border border-charcoal-border space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-soft-ivory">{reply.authorName}</span>
                            <span className="text-[10px] text-slate-400">({reply.authorRole})</span>
                            {reply.isAcceptedAnswer && (
                              <Badge variant="lime" size="sm">
                                Accepted Answer
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                            {isReplyAuthor && (
                              <button
                                onClick={() => deleteReply(activeThread.id, reply.id)}
                                className="text-slate-500 hover:text-orange"
                                title="Delete reply"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Reply Input */}
              <form onSubmit={handleReplySubmit} className="space-y-2 pt-2">
                <textarea
                  rows={3}
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  placeholder="Contribute your analytical perspective, SQL query pattern, or advice..."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-3 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!replyInput.trim()}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Post Reply (+15 XP)
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW DISCUSSION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-charcoal border border-charcoal-border rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl font-sans my-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-bold text-soft-ivory">Start a New Discussion</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-soft-ivory"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-orange/10 border border-orange/30 text-orange text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Discussion Question / Title <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. When should you use QUALIFY vs subquery for window function filtering in DuckDB?"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl px-4 py-2 text-sm text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Category <span className="text-orange">*</span>
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as DiscussionCategory)}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Associated Domain
                  </label>
                  <select
                    value={newDomainId}
                    onChange={e => setNewDomainId(e.target.value)}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl px-3 py-2 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                  >
                    {CURRICULUM_DOMAINS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Context, Code Snippets & Details <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Explain the technical problem, code attempts, or portfolio architectural decisions you want peer perspectives on..."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-4 text-xs font-mono text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Relevant Tags
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag (e.g. WindowFunctions, DuckDB, Pandas)"
                    className="flex-1 bg-midnight border border-charcoal-border rounded-xl px-3 py-1.5 text-xs text-soft-ivory"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
                    Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {newTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-midnight border border-charcoal-border text-xs text-cyan flex items-center gap-1.5"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-orange"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-charcoal-border">
                <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
                  Publish Discussion (+25 XP)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DISCUSSION MODAL */}
      {editingDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <h3 className="text-base font-bold text-soft-ivory">Edit Your Discussion</h3>
              <button onClick={() => setEditingDiscussion(null)} className="text-slate-400">
                ✕
              </button>
            </div>
            <textarea
              rows={6}
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full bg-midnight border border-charcoal-border rounded-xl p-3 text-xs text-soft-ivory font-mono focus:outline-none focus:border-lime"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingDiscussion(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETION CONFIRMATION MODAL */}
      {discussionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center gap-3 text-orange">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-soft-ivory">Delete Discussion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this discussion thread and all its associated replies?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDiscussionToDelete(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT MODAL */}
      {reportingDiscussionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center gap-2.5 text-orange">
              <Flag className="w-5 h-5" />
              <h3 className="text-base font-bold text-soft-ivory">Report Discussion Content</h3>
            </div>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-lime/10 border border-lime/30 text-lime text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you. Your report has been submitted to platform moderators for review.</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400">
                  Please identify why this discussion violates community safety or technical accuracy guidelines:
                </p>
                <div className="space-y-2">
                  {[
                    'Spam or promotional content',
                    'Harassment or disrespectful language',
                    'Harmful or malicious code snippets',
                    'Factually incorrect or misleading guidance',
                  ].map(reason => (
                    <label
                      key={reason}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-midnight border border-charcoal-border text-xs text-slate-300 cursor-pointer hover:border-slate-500"
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        className="accent-lime"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setReportingDiscussionId(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleConfirmReport}>
                    Submit Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
