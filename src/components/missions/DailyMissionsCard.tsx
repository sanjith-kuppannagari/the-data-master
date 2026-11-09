import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { evaluateUserMissions } from '../../services/missionEngine';
import { MissionGoal, MissionCadence } from '../../types/mission';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Check,
} from 'lucide-react';

export const DailyMissionsCard: React.FC = () => {
  const navigate = useNavigate();
  const { user, claimMissionReward } = useUser();
  const [activeCadence, setActiveCadence] = useState<MissionCadence>('daily');

  const missions = evaluateUserMissions(user);
  const filteredMissions = missions.filter(m => m.cadence === activeCadence);

  const completedCount = filteredMissions.filter(m => m.completed).length;
  const claimedCount = filteredMissions.filter(m => m.claimed).length;

  const handleClaim = (mission: MissionGoal) => {
    claimMissionReward(mission.id, mission.xpReward);
  };

  return (
    <div className="p-5 rounded-2xl bg-charcoal border border-charcoal-border space-y-4 shadow-sm font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-lime/10 text-lime border border-lime/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-soft-ivory">
              Curriculum Missions & Bounties
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {completedCount}/{filteredMissions.length} Complete
            </span>
          </div>
        </div>

        {/* Cadence Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-midnight border border-charcoal-border text-xs">
          <button
            onClick={() => setActiveCadence('daily')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeCadence === 'daily'
                ? 'bg-charcoal text-lime font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveCadence('weekly')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeCadence === 'weekly'
                ? 'bg-charcoal text-lime font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-3">
        {filteredMissions.map(mission => {
          const progressPercent = Math.min(
            100,
            Math.round((mission.currentCount / mission.targetCount) * 100)
          );

          return (
            <div
              key={mission.id}
              className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2.5 ${
                mission.claimed
                  ? 'bg-midnight/30 border-charcoal-border opacity-70'
                  : mission.completed
                  ? 'bg-lime/10 border-lime/40 shadow-sm'
                  : 'bg-midnight/70 border-charcoal-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        mission.claimed ? 'line-through text-slate-400' : 'text-soft-ivory'
                      }`}
                    >
                      {mission.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-lime">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                {/* Right Action */}
                <div className="shrink-0">
                  {mission.claimed ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-lime bg-lime/10 px-2 py-0.5 rounded border border-lime/30 font-bold">
                      <Check className="w-3 h-3" /> Claimed
                    </span>
                  ) : mission.completed ? (
                    <button
                      onClick={() => handleClaim(mission)}
                      className="px-2.5 py-1 rounded-lg bg-lime text-midnight hover:bg-lime/90 font-mono font-bold text-[11px] shadow-sm flex items-center gap-1 animate-pulse-subtle"
                    >
                      <Zap className="w-3 h-3 fill-midnight" /> Claim XP
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(mission.actionUrl)}
                      className="text-slate-300 hover:text-lime text-[11px] font-mono flex items-center gap-1"
                    >
                      {mission.actionLabel} →
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar & Subtext */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Progress</span>
                  <span className={mission.completed ? 'text-lime font-bold' : ''}>
                    {mission.currentCount} / {mission.targetCount}
                  </span>
                </div>
                <ProgressBar
                  value={progressPercent}
                  variant={mission.completed ? 'lime' : 'cyan'}
                  size="sm"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
