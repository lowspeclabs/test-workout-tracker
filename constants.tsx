
import { Exercise, WorkoutTemplate } from './types';

export const EXERCISES: Exercise[] = [
  { id: '1', name: 'Goblet Squat', cues: ['Keep chest tall', 'Elbows touch knees'], targetMuscle: 'Legs', equipment: ['Dumbbell'], category: 'Home', difficulty: 'Beginner' },
  { id: '2', name: 'Barbell Squat', cues: ['Hips back first', 'Drive through heels'], targetMuscle: 'Legs', equipment: ['Barbell'], category: 'Gym', difficulty: 'Advanced' },
  { id: '3', name: 'Push Up', cues: ['Body in straight line', 'Elbows at 45 degrees'], targetMuscle: 'Chest', equipment: [], category: 'Bodyweight', difficulty: 'Beginner' },
  { id: '4', name: 'Bench Press', cues: ['Bar to mid-chest', 'Feet flat on floor'], targetMuscle: 'Chest', equipment: ['Barbell', 'Bench'], category: 'Gym', difficulty: 'Advanced' },
  { id: '5', name: 'Band Pull-Aparts', cues: ['Shoulders down', 'Squeeze blades'], targetMuscle: 'Shoulders', equipment: ['Resistance Bands'], category: 'Bands', difficulty: 'Beginner' },
  { id: '6', name: 'Deadlift', cues: ['Brace core', 'Shoulders over bar'], targetMuscle: 'Legs', equipment: ['Barbell'], category: 'Gym', difficulty: 'Advanced' },
  { id: '7', name: 'Lat Pulldown', cues: ['Chest up', 'Pull to upper chest'], targetMuscle: 'Back', equipment: ['Cable Machine'], category: 'Gym', difficulty: 'Intermediate' }
];

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'w1',
    name: 'Upper Body A',
    duration: 45,
    intensity: 'High',
    steps: [
      { exerciseId: '4', sets: 4, reps: 8, rest: 120, weight: 135 },
      { exerciseId: '7', sets: 3, reps: 12, rest: 90, weight: 100 },
      { exerciseId: '5', sets: 3, reps: 15, rest: 60, weight: 0 }
    ],
    image: 'https://picsum.photos/seed/gym1/800/450'
  },
  {
    id: 'w2',
    name: 'Lower Body Focus',
    duration: 50,
    intensity: 'Moderate',
    steps: [
      { exerciseId: '2', sets: 5, reps: 5, rest: 180, weight: 185 },
      { exerciseId: '1', sets: 3, reps: 12, rest: 90, weight: 40 }
    ],
    image: 'https://picsum.photos/seed/gym2/800/450'
  }
];
