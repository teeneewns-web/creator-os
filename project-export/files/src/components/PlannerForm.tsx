'use client';

import React, { useState } from 'react';
import { PlannerFormData } from '../types/planner';
interface PlannerFormProps {
  onSubmit: (data: PlannerFormData) => void;
  isLoading: boolean;
}

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PlannerFormData>({
    goal: 'leads',
    role: 'Solo Business Owner',
    platform: 'facebook',
    niche: '',
    audience: '',
    offer: '',
    tone: 'bold',
    format: 'short_video',
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100">
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-indigo-500 h-full transition-all duration-300"
          style={{ width: `${(step / 6) * 100}%` }}
        />
      </div>

      <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase mb-2">
        Step {step} of 6
      </div>

      {/* Step 1: Goal */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">What is your primary goal this week?</h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'followers', label: 'Get More Followers & Reach' },
              { id: 'authority', label: 'Build Trust & Authority' },
              { id: 'leads', label: 'Generate Leads / Inquiries' },
              { id: 'sales', label: 'Sell a Product or Service' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormData({ ...formData, goal: item.id as any })}
                className={`p-4 rounded-xl text-left border transition-all ${
                  formData.goal === item.id 
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-medium' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Primary Platform */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Where do you post primarily?</h2>
          <div className="grid grid-cols-2 gap-3">
            {['facebook', 'instagram', 'tiktok', 'linkedin'].map((plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => setFormData({ ...formData, platform: plat as any })}
                className={`p-4 rounded-xl text-center capitalize border transition-all ${
                  formData.platform === plat 
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-medium' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Niche / Core Topic */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">What is your niche or core topic?</h2>
          <p className="text-sm text-slate-400">Keep it clear and specific (e.g., B2B Lead Gen, Fitness for Busy Moms).</p>
          <input
            type="text"
            placeholder="e.g., Real Estate Investing in Texas"
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Step 4: Target Audience */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Who are you speaking to?</h2>
          <input
            type="text"
            placeholder="e.g., Solo business owners, Busy professionals"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Step 5: Offer (Optional unless Leads/Sales) */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">What are you promoting?</h2>
          <p className="text-sm text-slate-400">
            {formData.goal === 'sales' || formData.goal === 'leads' 
              ? 'Required for your chosen goal.' 
              : 'Optional. Leave blank if you strictly want audience growth.'}
          </p>
          <input
            type="text"
            placeholder="e.g., 1-on-1 Consultation, $47 Workshop, Free Audit"
            value={formData.offer}
            onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Step 6: Tone & Content Format */}
      {step === 6 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-3">Tone of Voice</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bold', label: 'Direct & Bold' },
                { id: 'relatable', label: 'Casual & Warm' },
                { id: 'authoritative', label: 'Authoritative' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, tone: t.id as any })}
                  className={`p-3 text-xs rounded-lg border transition-all ${
                    formData.tone === t.id 
                      ? 'border-indigo-500 bg-indigo-500/10 text-white font-medium' 
                      : 'border-slate-800 text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Content Format</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'short_video', label: 'Short Video (Reels/TikTok)' },
                { id: 'carousel', label: 'Carousel / Slides' },
                { id: 'text_post', label: 'Text Post' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, format: f.id as any })}
                  className={`p-3 text-xs rounded-lg border transition-all ${
                    formData.format === f.id 
                      ? 'border-indigo-500 bg-indigo-500/10 text-white font-medium' 
                      : 'border-slate-800 text-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="text-sm text-slate-400 hover:text-white"
          >
            Back
          </button>
        ) : <div />}

        {step < 6 ? (
          <button
            type="button"
            onClick={nextStep}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={isLoading || !formData.niche}
            onClick={() => onSubmit(formData)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
          >
            {isLoading ? 'Generating Blueprint...' : 'Generate 7-Day Plan'}
          </button>
        )}
      </div>
    </div>
  );
};