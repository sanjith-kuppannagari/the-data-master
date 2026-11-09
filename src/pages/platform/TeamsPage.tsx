import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useUser } from '../../context/UserContext';
import { Team, TeamMember, TeamRole, TeamTask, TeamTaskStatus } from '../../types/team';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import {
  Users,
  UserPlus,
  Plus,
  Trophy,
  CheckCircle2,
  Clock,
  MessageSquare,
  Shield,
  Layers,
  ArrowRight,
  Send,
  AlertCircle,
  Copy,
  Check,
  Briefcase,
  FileText,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const TeamsPage: React.FC = () => {
  const {
    user,
    createTeam,
    joinTeam,
    leaveTeam,
    assignTeamTask,
    updateTeamTaskStatus,
    postTeamMessage,
    assignTeamChallenge,
    submitTeamChallenge,
  } = useUser();

  const teams = user.teams || [];
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [copiedCode, setCopiedCode] = useState(false);

  // Modals
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [isSubmitChallengeOpen, setIsSubmitChallengeOpen] = useState(false);

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamDomain, setNewTeamDomain] = useState('SQL & Relational Databases');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // New Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Team Message form
  const [messageInput, setMessageInput] = useState('');

  // Challenge submission form
  const [challengeDeliverable, setChallengeDeliverable] = useState('');

  const activeTeam = teams.find(t => t.id === selectedTeamId) || teams[0] || null;

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const created = createTeam(newTeamName.trim(), newTeamDesc.trim(), newTeamDomain);
    setSelectedTeamId(created.id);
    setIsCreateTeamOpen(false);
    setNewTeamName('');
    setNewTeamDesc('');
  };

  const handleJoinTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    const res = joinTeam(joinCodeInput.trim());
    if (res.success && res.team) {
      setSelectedTeamId(res.team.id);
      setIsJoinTeamOpen(false);
      setJoinCodeInput('');
      setJoinError('');
    } else {
      setJoinError(res.message);
    }
  };

  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeTeam) return;

    const assignee = activeTeam.members.find(m => m.userId === taskAssigneeId);

    assignTeamTask(activeTeam.id, {
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      assignedToUserId: taskAssigneeId || user.id,
      assignedToName: assignee?.name || user.name,
      status: 'todo',
      dueDate: taskDueDate || '2026-11-20',
    });

    setIsAssignTaskOpen(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssigneeId('');
    setTaskDueDate('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeTeam) return;

    postTeamMessage(activeTeam.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSubmitChallengeDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeDeliverable.trim() || !activeTeam?.activeChallenge) return;

    submitTeamChallenge(
      activeTeam.id,
      activeTeam.activeChallenge.challengeId,
      challengeDeliverable.trim()
    );

    setIsSubmitChallengeOpen(false);
    setChallengeDeliverable('');
  };

  const handleSelectChallenge = (chId: string, chTitle: string) => {
    if (!activeTeam) return;
    assignTeamChallenge(activeTeam.id, chId, chTitle);
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb items={[{ label: 'Collaborative Learning & Teams' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-lime">
              Peer Learning Squads
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-ivory tracking-tight">
            Collaborative Teams & Challenges
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Form dedicated analytical squads, divide complex investigation milestones, conduct peer query reviews, and conquer team challenges together.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsJoinTeamOpen(true)}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Join with Code
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateTeamOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Team (+50 XP)
          </Button>
        </div>
      </div>

      {/* Team Tabs Switcher */}
      {teams.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {teams.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTeamId(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-2 ${
                (activeTeam?.id === t.id)
                  ? 'bg-charcoal border-lime text-lime font-bold shadow-md'
                  : 'bg-midnight border-charcoal-border text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-midnight border border-charcoal-border text-[10px] font-mono text-cyan">
                {t.members.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Active Team Main View */}
      {!activeTeam ? (
        <div className="p-12 text-center rounded-2xl bg-charcoal/50 border border-charcoal-border border-dashed space-y-4">
          <Users className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-soft-ivory">You haven't joined a team yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Collaborating with peers accelerates learning by 3.2x. Join an existing analytical syndicate with an invite code, or create your own team to delegate tasks.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsJoinTeamOpen(true)}>
              Join with Code (Try "AAS701")
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsCreateTeamOpen(true)}>
              Create Team
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Team Overview Banner */}
          <div className="p-6 rounded-2xl bg-charcoal border border-charcoal-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-soft-ivory tracking-tight">
                  {activeTeam.name}
                </h2>
                <Badge variant="cyan" size="sm">
                  {activeTeam.focusDomain}
                </Badge>
                {activeTeam.creatorId === user.id && (
                  <Badge variant="lime" size="sm">
                    Team Lead
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {activeTeam.description}
              </p>
            </div>

            {/* Invite Code Pill */}
            <div className="p-3.5 rounded-xl bg-midnight border border-charcoal-border flex items-center gap-3 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Invite Code
                </span>
                <span className="text-base font-bold font-mono text-lime">
                  {activeTeam.inviteCode}
                </span>
              </div>
              <button
                onClick={() => handleCopyInviteCode(activeTeam.inviteCode)}
                className="p-2 rounded-lg bg-charcoal border border-charcoal-border text-slate-300 hover:text-soft-ivory transition-colors"
                title="Copy Invite Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-lime" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Grid: Members Roster & Responsibility Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Team Roster (4 cols) */}
            <div className="lg:col-span-4 bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan" />
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
                    Squad Roster ({activeTeam.members.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Roles Assigned</span>
              </div>

              <div className="space-y-3">
                {activeTeam.members.map(member => (
                  <div
                    key={member.userId}
                    className="p-3 rounded-xl bg-midnight/60 border border-charcoal-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-charcoal border border-charcoal-border flex items-center justify-center font-bold text-lime text-xs shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-soft-ivory">{member.name}</span>
                          {member.userId === user.id && (
                            <span className="text-[10px] text-lime font-mono">(You)</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block capitalize font-mono">
                          {member.role === 'lead' ? '⭐ Team Lead' : member.role === 'analyst' ? '🔬 Analyst' : '🔍 Reviewer'}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={member.role === 'lead' ? 'lime' : member.role === 'analyst' ? 'cyan' : 'neutral'}
                      size="sm"
                    >
                      {member.role.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>

              {activeTeam.members.length === 1 && (
                <div className="p-3 rounded-xl bg-lime/5 border border-lime/20 text-xs text-slate-300">
                  <p className="font-medium text-lime mb-1">Invite Collaborators</p>
                  Share your squad code <strong className="font-mono text-soft-ivory">{activeTeam.inviteCode}</strong> with peers so they can join your team.
                </div>
              )}
            </div>

            {/* Responsibility Matrix / Task Board (8 cols) */}
            <div className="lg:col-span-8 bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-lime" />
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
                    Responsibility Matrix & Deliverables ({activeTeam.tasks.length})
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssignTaskOpen(true)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Assign Task
                </Button>
              </div>

              {activeTeam.tasks.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-midnight/40 border border-charcoal-border border-dashed text-xs text-slate-400 space-y-2">
                  <p>No responsibilities assigned to squad members yet.</p>
                  <Button variant="secondary" size="sm" onClick={() => setIsAssignTaskOpen(true)}>
                    Assign First Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeTeam.tasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-midnight/60 border border-charcoal-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-soft-ivory">{task.title}</h4>
                          <Badge
                            variant={
                              task.status === 'completed'
                                ? 'lime'
                                : task.status === 'in_progress'
                                ? 'cyan'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {task.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                          <span>Assignee: <strong className="text-slate-300">{task.assignedToName || 'Unassigned'}</strong></span>
                          <span>•</span>
                          <span>Due: {task.dueDate || 'Ongoing'}</span>
                        </div>
                      </div>

                      {/* Status Transition Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {task.status !== 'completed' && (
                          <button
                            onClick={() => updateTeamTaskStatus(activeTeam.id, task.id, 'completed')}
                            className="text-xs px-2.5 py-1 rounded-lg bg-lime/10 border border-lime/30 text-lime hover:bg-lime/20 flex items-center gap-1 font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Mark Done
                          </button>
                        )}
                        {task.status === 'todo' && (
                          <button
                            onClick={() => updateTeamTaskStatus(activeTeam.id, task.id, 'in_progress')}
                            className="text-xs px-2.5 py-1 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan hover:bg-cyan/20 font-medium"
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Team Challenge Studio */}
          <div className="p-6 rounded-2xl bg-charcoal border border-charcoal-border space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-lime" />
                  <h3 className="text-sm font-bold text-soft-ivory uppercase tracking-wider font-mono">
                    Squad Challenge Arena
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tackle Phase 4 challenges collectively. Submit a team deliverable for evaluation and mutual XP.
                </p>
              </div>

              {!activeTeam.activeChallenge ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Choose challenge:</span>
                  <select
                    onChange={e => {
                      if (e.target.value) {
                        const [id, title] = e.target.value.split('|');
                        handleSelectChallenge(id, title);
                      }
                    }}
                    className="bg-midnight border border-charcoal-border rounded-lg px-2.5 py-1 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                  >
                    <option value="">Select challenge...</option>
                    <option value="ch-01|E-Commerce Omnichannel Churn & Cohort Retention">
                      CH-01: Omnichannel Churn
                    </option>
                    <option value="ch-02|Payment Gateway Latency & Anomaly Investigation">
                      CH-02: Payment Gateway Anomaly
                    </option>
                    <option value="ch-03|Multi-Touch Marketing Attribution Model">
                      CH-03: Marketing Attribution
                    </option>
                    <option value="ch-04|Multi-Territory Gross Margin Sensitivity">
                      CH-04: Margin Sensitivity
                    </option>
                  </select>
                </div>
              ) : (
                <Badge variant={activeTeam.activeChallenge.status === 'submitted' ? 'lime' : 'cyan'}>
                  {activeTeam.activeChallenge.status === 'submitted' ? 'Graded & Submitted' : 'In Progress'}
                </Badge>
              )}
            </div>

            {/* Active Challenge Card */}
            {activeTeam.activeChallenge ? (
              <div className="p-5 rounded-xl bg-midnight/70 border border-charcoal-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-lime uppercase tracking-wider block">
                      Active Challenge:
                    </span>
                    <h4 className="text-base font-bold text-soft-ivory">
                      {activeTeam.activeChallenge.challengeTitle}
                    </h4>
                  </div>

                  {activeTeam.activeChallenge.status !== 'submitted' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsSubmitChallengeOpen(true)}
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Submit Team Deliverable (+100 XP)
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 bg-lime/10 px-3 py-1.5 rounded-lg border border-lime/30 text-lime font-mono text-xs font-bold">
                      <Trophy className="w-4 h-4" /> Score: {activeTeam.activeChallenge.score}/100
                    </div>
                  )}
                </div>

                {activeTeam.activeChallenge.status === 'submitted' && (
                  <div className="p-4 rounded-xl bg-charcoal border border-charcoal-border space-y-2 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-lime block">
                      Evaluation Feedback:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {activeTeam.activeChallenge.feedback}
                    </p>
                    <div className="pt-2 border-t border-charcoal-border/50 text-[11px] text-slate-400 font-mono">
                      Deliverable: "{activeTeam.activeChallenge.teamDeliverableText?.slice(0, 120)}..."
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No active challenge assigned. Select a challenge from the dropdown above to begin squad investigation.
              </p>
            )}
          </div>

          {/* Team Discussion & Notes Board */}
          <div className="p-6 rounded-2xl bg-charcoal border border-charcoal-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
                  Squad Notes & Activity Stream ({activeTeam.messages.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Team Internal</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin">
              {activeTeam.messages.map(msg => (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl bg-midnight/60 border border-charcoal-border flex items-start gap-3 text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-charcoal border border-charcoal-border flex items-center justify-center font-bold text-cyan text-[11px] shrink-0">
                    {msg.authorName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-soft-ivory">{msg.authorName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post message input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Post an internal squad note, code snippet reference, or query..."
                className="flex-1 bg-midnight border border-charcoal-border rounded-xl px-4 py-2 text-xs text-soft-ivory focus:outline-none focus:border-lime"
              />
              <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                Post
              </Button>
            </form>
          </div>

          {/* Transparent Infrastructure Disclaimer */}
          <div className="p-4 rounded-2xl bg-midnight border border-charcoal-border text-xs text-slate-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-slate-300 font-medium">Local Squad Persistence Notice</p>
              <p className="leading-relaxed">
                In this client deployment, squad state, tasks, and discussion entries are preserved locally. Real-time multiplayer WebSockets and automated teammate email notifications will be activated upon Supabase backend configuration in Phase 7.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {isCreateTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-lime" />
                <h3 className="text-base font-bold text-soft-ivory">Create Analytical Squad</h3>
              </div>
              <button onClick={() => setIsCreateTeamOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Squad Name <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="e.g. Delta Cohort Analysts"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-2.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Focus Domain
                </label>
                <select
                  value={newTeamDomain}
                  onChange={e => setNewTeamDomain(e.target.value)}
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-2 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                >
                  {CURRICULUM_DOMAINS.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Team Objectives & Mission
                </label>
                <textarea
                  rows={3}
                  value={newTeamDesc}
                  onChange={e => setNewTeamDesc(e.target.value)}
                  placeholder="e.g. Weekly squad meetings to solve business simulations and benchmark SQL execution plans."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-2.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-charcoal-border">
                <Button variant="ghost" size="sm" onClick={() => setIsCreateTeamOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Create Squad (+50 XP)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOIN TEAM MODAL */}
      {isJoinTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan" />
                <h3 className="text-base font-bold text-soft-ivory">Join Analytical Squad</h3>
              </div>
              <button onClick={() => setIsJoinTeamOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            {joinError && (
              <div className="p-3 rounded-xl bg-orange/10 border border-orange/30 text-orange text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{joinError}</span>
              </div>
            )}

            <form onSubmit={handleJoinTeamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Squad Invite Code <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. AAS701"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-3 text-center text-base font-mono uppercase tracking-widest text-lime focus:outline-none focus:border-lime"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Enter <strong>AAS701</strong> to join the sample Alpha Analytics Syndicate.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-charcoal-border">
                <Button variant="ghost" size="sm" onClick={() => setIsJoinTeamOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={<Check className="w-3.5 h-3.5" />}>
                  Join Squad
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TASK MODAL */}
      {isAssignTaskOpen && activeTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <h3 className="text-base font-bold text-soft-ivory">Assign Squad Responsibility</h3>
              <button onClick={() => setIsAssignTaskOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Task Title <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Profile null distribution and write CTE window function"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-2.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                    Assignee
                  </label>
                  <select
                    value={taskAssigneeId}
                    onChange={e => setTaskAssigneeId(e.target.value)}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl p-2 text-xs text-soft-ivory"
                  >
                    <option value="">Select teammate...</option>
                    {activeTeam.members.map(m => (
                      <option key={m.userId} value={m.userId}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl p-2 text-xs text-soft-ivory"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-charcoal-border">
                <Button variant="ghost" size="sm" onClick={() => setIsAssignTaskOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Assign Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT TEAM CHALLENGE MODAL */}
      {isSubmitChallengeOpen && activeTeam?.activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <div>
                <h3 className="text-base font-bold text-soft-ivory">Submit Squad Deliverable</h3>
                <p className="text-slate-400 text-[11px]">
                  {activeTeam.activeChallenge.challengeTitle}
                </p>
              </div>
              <button onClick={() => setIsSubmitChallengeOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitChallengeDeliverable} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Collaborative Analytical Executive Memo <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={6}
                  value={challengeDeliverable}
                  onChange={e => setChallengeDeliverable(e.target.value)}
                  placeholder="Synthesize your squad's combined findings, query optimizations, root causes, and business impact recommendations..."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-3 text-xs font-mono text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-charcoal-border">
                <Button variant="ghost" size="sm" onClick={() => setIsSubmitChallengeOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!challengeDeliverable.trim()}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Submit Deliverable (+100 XP)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
