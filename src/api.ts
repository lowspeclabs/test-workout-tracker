// The base URL for the backend API.
// Note: In a real Android build, this might need to change to the hosted URL or local IP.
export const API_BASE = 'http://localhost:3001/api';

/**
 * Fetches the list of all available workout templates.
 * @returns Promise resolving to an array of workouts.
 */
export const fetchWorkouts = async () => {
  const response = await fetch(`${API_BASE}/workouts`);
  return response.json();
};

/**
 * Fetches details for a specific workout, including its exercises.
 * @param id The ID of the workout to retrieve.
 * @returns Promise resolving to the workout object with an 'exercises' array.
 */
export const fetchWorkoutDetails = async (id: number) => {
  const response = await fetch(`${API_BASE}/workouts/${id}`);
  return response.json();
};

/**
 * Starts a new workout session.
 * @param workoutId The ID of the workout being performed.
 * @returns Promise resolving to the created session object (including session ID).
 */
export const startSession = async (workoutId: number) => {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workout_id: workoutId })
  });
  return response.json();
};

/**
 * Logs a completed set for the current session.
 * @param sessionId The ID of the active session.
 * @param data Object containing { exercise_id, set_index, reps, weight, rpe }
 * @returns Promise resolving to the log result.
 */
export const logSet = async (sessionId: number, data: any) => {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

/**
 * Marks a session as complete.
 * @param sessionId The ID of the session to finish.
 * @returns Promise resolving to the completion status.
 */
export const completeSession = async (sessionId: number) => {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, {
        method: 'PATCH'
    });
    return response.json();
}

/**
 * Fetches user statistics (total sessions, recent activity).
 * @returns Promise resolving to the stats object.
 */
export const fetchStats = async () => {
    const response = await fetch(`${API_BASE}/stats`);
    return response.json();
}
