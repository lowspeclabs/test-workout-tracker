
export type Goal = 'Weight Loss' | 'Strength' | 'Mobility' | 'Event Prep';
export type Experience = 'Beginner' | 'Regular';
export type Site = 'Home' | 'Gym' | 'Both';

export interface UserProfile {
  name: string;
  onboarded: boolean;
  goals: Goal[];
  experience: Experience;
  trainingSite: Site;
  equipment: string[];
  darkMode: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  cues: string[];
  targetMuscle: string;
  equipment: string[];
  category: 'Home' | 'Gym' | 'Bands' | 'Bodyweight';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface WorkoutStep {
  exerciseId: string;
  sets: number;
  reps: number;
  rest: number;
  weight?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  duration: number;
  intensity: 'Low' | 'Moderate' | 'High';
  steps: WorkoutStep[];
  image?: string;
}

export interface SetLog {
  exerciseId: string;
  setIndex: number;
  reps: number;
  weight: number;
  timestamp: number;
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  startTime: number;
  endTime?: number;
  logs: SetLog[];
}
