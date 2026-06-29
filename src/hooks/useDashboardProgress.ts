"use client";

import { useEffect, useState } from "react";

export type TimeMode = "15" | "30" | "60";

type SavedProgress = {
  date: string;
  checkedTasksByDay: {
    [day: string]: string[];
  };
  completedDays: number[];
  streak: number;
  lastCompletedDate: string | null;
};

const STORAGE_KEY = "creator-os-dashboard-progress";

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function getYesterdayDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

export function useDashboardProgress(currentDay: number) {
  const [timeMode, setTimeMode] = useState<TimeMode>("30");
  const [checkedTasksByDay, setCheckedTasksByDay] = useState<{
    [day: string]: string[];
  }>({});
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  const currentDayKey = String(currentDay);

  const checkedTasks = checkedTasksByDay[currentDayKey] || [];
  const completedToday = completedDays.includes(currentDay);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
  const parsed: SavedProgress = JSON.parse(saved);

  setCheckedTasksByDay(parsed.checkedTasksByDay || {});
  setCompletedDays(parsed.completedDays || []);
  setStreak(parsed.streak || 0);
  setLastCompletedDate(parsed.lastCompletedDate || null);
}

    setLoaded(true);
  }, [today]);

  useEffect(() => {
    if (!loaded) return;

    const data: SavedProgress = {
      date: today,
      checkedTasksByDay,
      completedDays,
      streak,
      lastCompletedDate,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    checkedTasksByDay,
    completedDays,
    streak,
    lastCompletedDate,
    loaded,
    today,
  ]);

  function toggleTask(taskId: string) {
    setCheckedTasksByDay((current) => {
      const currentTasks = current[currentDayKey] || [];

      let nextTasks: string[];

      if (currentTasks.includes(taskId)) {
        nextTasks = currentTasks.filter((id) => id !== taskId);
      } else {
        nextTasks = [...currentTasks, taskId];
      }

      return {
        ...current,
        [currentDayKey]: nextTasks,
      };
    });
  }

  function finishTodayMission(progress: number) {
    if (progress < 100) return;
    if (completedDays.includes(currentDay)) return;

    let newStreak = streak;

    if (lastCompletedDate !== today) {
      newStreak = 1;

      if (lastCompletedDate === yesterday) {
        newStreak = streak + 1;
      }
    }

    setCompletedDays((current) => [...current, currentDay]);
    setStreak(newStreak);
    setLastCompletedDate(today);
  }

  function resetToday() {
    setCheckedTasksByDay((current) => {
      return {
        ...current,
        [currentDayKey]: [],
      };
    });

    setCompletedDays((current) => current.filter((day) => day !== currentDay));
  }

  return {
  timeMode,
  setTimeMode,
  checkedTasks,
  completedToday,
  completedDays,
  streak,
  toggleTask,
  finishTodayMission,
  resetToday,
};
}