'use client';

import React, { useState } from 'react';
import { DayContent } from '../types/planner';

interface PlannerResultsProps {
  days: DayContent[];
  onUnlock: () => void;
  onReset: () => void;
}

export const PlannerResults: React.FC<PlannerResultsProps> = ({ days, onUnlock, onReset }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const dayOne = days.find((d) => d.dayNumber === 1);
  const remainingDays = days.filter((d) => d.dayNumber > 1);

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-slate-100 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            Generated Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Your 7-Day Content Roadmap
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white border border-slate-800 rounded-lg px-3 py-2 transition-all self-start sm:self-auto"
        >
          ← Create New Plan
        </button>
      </div>

      {/* Day 1: 100% Unlocked Preview Card */}
      {dayOne && (
        <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                ● Day 1 Free Preview (Ready to Post)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
                {dayOne.theme}
              </h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              {dayOne.formatSpecs}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Objective
              </span>
              <p className="text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {dayOne.objective}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1.5">
                Retention Hook (First 3 Seconds)
              </span>
              <div className="relative group">
                <p className="text-base font-medium text-white bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-xl">
                  {dayOne.hook}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(dayOne.hook, 101)}
                  className="absolute top-2 right-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-all"
                >
                  {copiedIndex === 101 ? 'Copied!' : 'Copy Hook'}
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Word-for-Word Script / Core Body
              </span>
              <div className="relative group">
                <p className="text-sm text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line leading-relaxed">
                  {dayOne.scriptBody}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(dayOne.scriptBody, 102)}
                  className="absolute top-2 right-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-all"
                >
                  {copiedIndex === 102 ? 'Copied!' : 'Copy Script'}
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Visual Cues & Camera Direction
              </span>
              <p className="text-xs sm:text-sm text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {dayOne.visualDirection}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Caption & Platform Hashtags
              </span>
              <p className="text-xs sm:text-sm text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 whitespace-pre-line">
                {dayOne.caption}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">
                Tailored Call to Action (CTA)
              </span>
              <p className="text-sm font-medium text-emerald-300 bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl">
                {dayOne.cta}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Callout Banner */}
      <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-900/40 border-2 border-indigo-500/50 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
        <span className="inline-block bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          Instant 7-Day Asset Unlock
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
          Unlock Days 2 through 7 for Just $7
        </h3>
        <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
          Get complete word-for-word scripts, retention hooks, anti-bait captions, and camera angles for the remaining 6 days aligned with your primary goal.
        </p>
        <button
          type="button"
          onClick={onUnlock}
          className="mt-6 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-base font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
        >
          Unlock Full 7-Day Plan ($7 One-Time)
        </button>
        <div className="mt-3 text-xs text-slate-400">
          Instant access • No subscriptions • Lifetime use
        </div>
      </div>

      {/* Days 2–7: Locked Curiosity Cards */}
      <div className="space-y-4">
        {remainingDays.map((day) => (
          <div
            key={day.dayNumber}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Day {day.dayNumber} • {day.formatSpecs}
                </span>
                <h4 className="text-lg font-bold text-slate-200 mt-0.5">
                  {day.theme}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {day.objective}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full shrink-0">
                <span>🔒 Locked</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};