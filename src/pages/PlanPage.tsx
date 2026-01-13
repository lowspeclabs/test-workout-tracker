import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWorkouts } from '../api';

/**
 * PlanPage Component
 * Displays the library of available workout programs and allows starting a session.
 */
const PlanPage = () => {
  const navigate = useNavigate();
  // State to hold the list of available workouts
  const [workouts, setWorkouts] = useState<any[]>([]);

  // Fetch workout library on mount
  useEffect(() => {
    fetchWorkouts().then(setWorkouts);
  }, []);

  return (
    <div>
      <h1 className="headline">Workout Plan</h1>

      {/* Workout Library Section */}
      <div className="section-label">Library</div>
      {workouts.map(workout => (
        <div key={workout.id} className="card">
          <div className="flex-row">
            <div>
                <h3>{workout.name}</h3>
                <div style={{fontSize: '0.9rem', color: '#666'}}>{workout.description}</div>
            </div>
            {/* Start Button: Navigates to the session player for this workout */}
            <button className="btn btn-secondary" style={{width: 'auto'}} onClick={() => navigate(`/session/${workout.id}`)}>
                Start
            </button>
          </div>
        </div>
      ))}

      {/* Custom Workouts Placeholder (Future Feature) */}
      <div className="section-label">Custom</div>
      <div className="card text-center" style={{borderStyle: 'dashed'}}>
        <p>Create Custom Routine</p>
        <button className="btn btn-secondary" disabled>Coming Soon</button>
      </div>
    </div>
  );
};

export default PlanPage;
