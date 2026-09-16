'use client';

import React, { useState } from 'react';
import { PlannerForm } from '../../../components/PlannerForm';
import { PlannerResults } from '../../../components/PlannerResults';
import { PlannerFormData, DayContent } from '../../../types/planner';

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState<DayContent[] | null>(null);

  const handleFormSubmit = async (data: PlannerFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to generate blueprint');
      }

      const result = await res.json();
      setDays(result.days);
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockPayment = () => {
    const stripeUrl = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_URL;
    if (stripeUrl) {
      window.location.href = stripeUrl;
    } else {
      alert('Please set NEXT_PUBLIC_STRIPE_PAYMENT_URL in .env.local');
    }
  };

  const handleReset = () => {
    setDays(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-3">
          Creator OS Engine
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          7-Day Content Engine
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base">
          No prompts. No blank page. Just answer a few questions and get your full 7-day high-converting roadmap.
        </p>
      </div>

      {/* Dynamic Content: Form vs Results */}
      {!days ? (
        <PlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      ) : (
        <PlannerResults 
          days={days} 
          onUnlock={handleUnlockPayment} 
          onReset={handleReset} 
        />
      )}
    </main>
  );
}