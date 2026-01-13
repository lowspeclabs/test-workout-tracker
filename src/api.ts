export const API_BASE = 'http://localhost:3001/api';

export const fetchWorkouts = async () => {
  const response = await fetch(`${API_BASE}/workouts`);
  return response.json();
};

export const fetchWorkoutDetails = async (id: number) => {
  const response = await fetch(`${API_BASE}/workouts/${id}`);
  return response.json();
};

export const startSession = async (workoutId: number) => {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workout_id: workoutId })
  });
  return response.json();
};

export const logSet = async (sessionId: number, data: any) => {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const completeSession = async (sessionId: number) => {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, {
        method: 'PATCH'
    });
    return response.json();
}

export const fetchStats = async () => {
    const response = await fetch(`${API_BASE}/stats`);
    return response.json();
}
