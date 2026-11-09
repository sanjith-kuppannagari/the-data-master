import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useUser } from '../../context/UserContext';
import { buildCalendarMonthData, MONTH_NAMES } from '../../services/calendarEngine';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import { PlannedSession } from '../../types/calendar';
import {
  Calendar as CalendarIcon,
  Flame,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  FolderGit2,
  Trophy,
  Target,
  Trash2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LearningCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, addPlannedSession, updatePlannedSession, deletePlannedSession } = useUser();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().split('T')[0]);

  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDomainId, setSessionDomainId] = useState('sql-relational-databases');
  const [sessionMinutes, setSessionMinutes] = useState(30);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionDate, setSessionDate] = useState(today.toISOString().split('T')[0]);

  // Build calendar matrix
  const calendarData = useMemo(() => {
    return buildCalendarMonthData(user, currentYear, currentMonth);
  }, [user, currentYear, currentMonth]);

  // Selected day activity data
  const selectedDayActivity = useMemo(() => {
    const matchedDay = calendarData.days.find(d => d.date === selectedDate);
    return matchedDay?.activity || null;
  }, [calendarData, selectedDate]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  // Schedule modal submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim()) return;

    const domainObj = CURRICULUM_DOMAINS.find(d => d.id === sessionDomainId);

    addPlannedSession({
      date: sessionDate,
      title: sessionTitle.trim(),
      domainId: sessionDomainId,
      domainName: domainObj?.name || 'Data Analytics',
      targetMinutes: Number(sessionMinutes),
      notes: sessionNotes.trim(),
      completed: false,
    });

    setIsScheduleModalOpen(false);
    setSessionTitle('');
    setSessionNotes('');
    setSelectedDate(sessionDate);
  };

  const weeklyProgressPercent = Math.min(
    100,
    Math.round((calendarData.weeklyActualMinutes / calendarData.weeklyTargetMinutes) * 100)
  );

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Breadcrumb items={[{ label: 'Learning Calendar' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-lime">
              Commitment & Consistency Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-soft-ivory tracking-tight">
            Learning Calendar & Schedule
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Review actual historical study sessions, track streak persistence, schedule upcoming milestones, and prioritize revision triggers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-charcoal p-2.5 rounded-xl border border-charcoal-border font-mono text-xs">
            <Flame className="w-4 h-4 text-orange fill-orange shrink-0" />
            <span className="text-soft-ivory font-bold">{user.currentStreak} Day Streak</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSessionDate(selectedDate);
              setIsScheduleModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Plan Study Session
          </Button>
        </div>
      </div>

      {/* Weekly Goal Commitment Card */}
      <div className="p-5 rounded-2xl bg-charcoal border border-charcoal-border flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-lime" />
            <span className="text-sm font-semibold text-soft-ivory">
              Weekly Learning Goal Progress
            </span>
            <Badge variant={weeklyProgressPercent >= 100 ? 'lime' : 'neutral'} size="sm">
              {weeklyProgressPercent}% Achieved
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            {calendarData.weeklyActualMinutes} tracked minutes of {calendarData.weeklyTargetMinutes} min weekly target.
          </p>
        </div>

        <div className="flex-1 max-w-md space-y-1.5">
          <ProgressBar value={weeklyProgressPercent} variant="lime" size="sm" />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0 min</span>
            <span>Target: {calendarData.weeklyTargetMinutes} min/wk</span>
          </div>
        </div>
      </div>

      {/* Month Navigation Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-charcoal p-4 rounded-2xl border border-charcoal-border">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-midnight border border-charcoal-border text-slate-300 hover:text-soft-ivory transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-midnight border border-charcoal-border text-slate-300 hover:text-soft-ivory transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-base font-bold text-soft-ivory font-mono ml-2">
            {calendarData.monthName} {calendarData.year}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToday}
            className="text-xs px-3 py-1 rounded-lg bg-midnight border border-charcoal-border text-slate-300 hover:text-lime font-mono transition-colors"
          >
            Today
          </button>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400 border-l border-charcoal-border pl-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime" /> Practice Solved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan" /> Challenge / Simulation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange" /> Revision Needed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" /> Planned Session
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Grid & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-charcoal border border-charcoal-border shadow-sm space-y-4">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-slate-400 pb-2 border-b border-charcoal-border">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="font-semibold">{day}</div>
            ))}
          </div>

          {/* Month Days Matrix */}
          <div className="grid grid-cols-7 gap-2">
            {calendarData.days.map((dayItem, index) => {
              const isSelected = selectedDate === dayItem.date;
              const { activity } = dayItem;

              return (
                <div
                  key={`${dayItem.date}-${index}`}
                  onClick={() => setSelectedDate(dayItem.date)}
                  className={`min-h-[72px] sm:min-h-[82px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                    isSelected
                      ? 'border-lime bg-lime/10 shadow-md ring-1 ring-lime/40'
                      : dayItem.isToday
                      ? 'border-lime/60 bg-charcoal hover:border-lime'
                      : dayItem.isCurrentMonth
                      ? 'border-charcoal-border bg-midnight/70 hover:border-slate-500'
                      : 'border-transparent bg-midnight/20 opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        dayItem.isToday
                          ? 'text-lime font-black'
                          : dayItem.isCurrentMonth
                          ? 'text-soft-ivory'
                          : 'text-slate-500'
                      }`}
                    >
                      {dayItem.dayNumber}
                    </span>
                    {dayItem.isToday && (
                      <span className="text-[9px] font-mono text-lime uppercase font-bold">Today</span>
                    )}
                  </div>

                  {/* Activity Indicator Dots */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activity.exercisesAttempted > 0 && (
                      <span
                        className="w-2 h-2 rounded-full bg-lime shrink-0"
                        title={`${activity.exercisesAttempted} exercises attempted`}
                      />
                    )}
                    {activity.challengesCompleted > 0 && (
                      <span
                        className="w-2 h-2 rounded-full bg-cyan shrink-0"
                        title={`${activity.challengesCompleted} challenges completed`}
                      />
                    )}
                    {activity.revisionReminders.length > 0 && (
                      <span
                        className="w-2 h-2 rounded-full bg-orange shrink-0"
                        title="Revision reminder"
                      />
                    )}
                    {activity.plannedSessions.length > 0 && (
                      <span
                        className="w-2 h-2 rounded-full bg-white shrink-0"
                        title={`${activity.plannedSessions.length} planned sessions`}
                      />
                    )}
                  </div>

                  {/* Tracked Minutes Badge */}
                  {activity.minutesSpent > 0 && (
                    <span className="text-[10px] font-mono text-lime/90 mt-1">
                      {activity.minutesSpent}m
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-5 shadow-sm sticky top-20">
          <div className="border-b border-charcoal-border pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lime block mb-1">
              Selected Date Ledger
            </span>
            <h3 className="text-base font-bold text-soft-ivory font-mono">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </h3>
          </div>

          {selectedDayActivity ? (
            <div className="space-y-4 text-xs">
              {/* Daily Stats Summary */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-midnight border border-charcoal-border">
                  <span className="text-[10px] text-slate-400 block">Verified Time</span>
                  <span className="text-sm font-bold text-lime">
                    {selectedDayActivity.minutesSpent > 0 ? `${selectedDayActivity.minutesSpent}m` : '0m'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-midnight border border-charcoal-border">
                  <span className="text-[10px] text-slate-400 block">Exercises</span>
                  <span className="text-sm font-bold text-cyan">
                    {selectedDayActivity.exercisesAttempted} attempted
                  </span>
                </div>
              </div>

              {/* Planned Sessions on this Date */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-300">
                    Planned Study Sessions ({selectedDayActivity.plannedSessions.length})
                  </span>
                  <button
                    onClick={() => {
                      setSessionDate(selectedDate);
                      setIsScheduleModalOpen(true);
                    }}
                    className="text-lime hover:underline text-[11px] font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>

                {selectedDayActivity.plannedSessions.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic font-mono">
                    No planned sessions for this date.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayActivity.plannedSessions.map(session => (
                      <div
                        key={session.id}
                        className="p-3 rounded-xl bg-midnight border border-charcoal-border flex items-start justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                session.completed ? 'line-through text-slate-500' : 'text-soft-ivory'
                              }`}
                            >
                              {session.title}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {session.domainName} • {session.targetMinutes}m target
                          </div>
                          {session.notes && (
                            <p className="text-[11px] text-slate-400">{session.notes}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() =>
                              updatePlannedSession(session.id, { completed: !session.completed })
                            }
                            className={`p-1 rounded transition-colors ${
                              session.completed ? 'text-lime' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title="Toggle completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePlannedSession(session.id)}
                            className="p-1 rounded text-slate-500 hover:text-orange"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Revision Reminders on this Date */}
              {selectedDayActivity.revisionReminders.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-charcoal-border/50">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-orange flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Revision Alerts:
                  </span>
                  <div className="space-y-1.5">
                    {selectedDayActivity.revisionReminders.map((rem, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-orange/10 border border-orange/30 text-orange flex items-center justify-between"
                      >
                        <span className="font-mono text-[11px] truncate">{rem}</span>
                        <button
                          onClick={() => navigate('/platform/mistakes')}
                          className="text-[10px] font-bold underline shrink-0 ml-2"
                        >
                          Revise Now →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4 font-mono">
              Select a date on the calendar to view its verified telemetry ledger.
            </p>
          )}
        </div>
      </div>

      {/* PLAN STUDY SESSION MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-charcoal border border-charcoal-border rounded-2xl p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-lime" />
                <h3 className="text-base font-bold text-soft-ivory">Schedule Study Session</h3>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Session Date <span className="text-orange">*</span>
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-2.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Focus Topic / Goal <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={e => setSessionTitle(e.target.value)}
                  placeholder="e.g. Master SQL Window Functions CTEs"
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-2.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                    Curriculum Domain
                  </label>
                  <select
                    value={sessionDomainId}
                    onChange={e => setSessionDomainId(e.target.value)}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl p-2 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                  >
                    {CURRICULUM_DOMAINS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                    Target Minutes
                  </label>
                  <select
                    value={sessionMinutes}
                    onChange={e => setSessionMinutes(Number(e.target.value))}
                    className="w-full bg-midnight border border-charcoal-border rounded-xl p-2 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                  >
                    <option value={15}>15 mins (Bite-sized)</option>
                    <option value={30}>30 mins (Standard)</option>
                    <option value={45}>45 mins (Deep Dive)</option>
                    <option value={60}>60 mins (Intensive)</option>
                    <option value={90}>90 mins (Workshop)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono uppercase tracking-wider">
                  Preparation Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  placeholder="e.g. Revisit Mistake Journal exercise #3 before attempting the challenge."
                  className="w-full bg-midnight border border-charcoal-border rounded-xl p-2.5 text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-charcoal-border">
                <Button variant="ghost" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Save Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
