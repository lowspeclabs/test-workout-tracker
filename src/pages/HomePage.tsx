import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStats, fetchWorkouts } from '../api';

/**
 * HomePage Component
 * Displays the daily dashboard, including streaks, summary stats, and a recommended workout.
 */
const HomePage = () => {
  const navigate = useNavigate();

  // State for user statistics (sessions count, recent activity)
  const [stats, setStats] = useState<any>(null);

  // State for the recommended workout to display
  const [recommendedWorkout, setRecommendedWorkout] = useState<any>(null);

  // Load data on component mount
  useEffect(() => {
    fetchStats().then(setStats);

    // Fetch workouts to find a recommendation.
    // MVP Strategy: Defaults to the first available workout.
    fetchWorkouts().then(workouts => {
        if (workouts.length > 0) setRecommendedWorkout(workouts[0]);
    });
  }, []);

  // Navigate to the session player with the recommended workout
  const handleStartWorkout = () => {
    if (recommendedWorkout) {
      navigate(`/session/${recommendedWorkout.id}`);
    }
  };

  // Format today's date for the newspaper header (e.g., "Monday, January 1")
  const todayDateString = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* Header Section */}
      <header className="mb-4">
        <div className="section-label">{todayDateString}</div>
        <h1 className="headline">PaperFit Daily</h1>
      </header>

      {/* Stats Summary Section */}
      <section>
        <div className="flex-row mb-4">
            <div className="card" style={{flex: 1, marginRight: '8px'}}>
                <div className="section-label">Streak</div>
                {/* Streak is currently hardcoded for MVP */}
                <div style={{fontSize: '2rem', fontWeight: 'bold'}}>3 Days</div>
            </div>
            <div className="card" style={{flex: 1, marginLeft: '8px'}}>
                <div className="section-label">Completed</div>
                <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{stats?.total_sessions || 0}</div>
            </div>
        </div>
      </section>

      {/* Recommended Workout Card */}
      <section className="mb-4">
        <div className="section-label">Recommended Workout</div>
        {recommendedWorkout ? (
            <div className="card">
            <h2>{recommendedWorkout.name}</h2>
            <p>{recommendedWorkout.description}</p>
            <div className="mb-4">
                <span style={{background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'}}>
                    {recommendedWorkout.tags}
                </span>
            </div>
            <button className="btn btn-primary" onClick={handleStartWorkout}>
                Start Today's Workout
            </button>
            </div>
        ) : (
            <p>Loading recommendations...</p>
        )}
      </section>

      {/* Recent Activity Feed */}
      <section>
        <div className="section-label">Recent Activity</div>
        {stats?.recent_activity && stats.recent_activity.length > 0 ? (
            <div className="card">
                <ul style={{listStyle: 'none', padding: 0}}>
                    {stats.recent_activity.map((set: any) => (
                        <li key={set.id} style={{borderBottom: '1px solid #eee', padding: '8px 0'}}>
                            Set {set.set_index}: {set.weight}lbs x {set.reps}
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <div className="card">No recent activity</div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
