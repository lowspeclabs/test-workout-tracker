import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStats, fetchWorkouts } from '../api';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [recommendedWorkout, setRecommendedWorkout] = useState<any>(null);

  useEffect(() => {
    fetchStats().then(setStats);
    // For MVP, just grab the first workout as recommended
    fetchWorkouts().then(workouts => {
        if (workouts.length > 0) setRecommendedWorkout(workouts[0]);
    });
  }, []);

  const handleStartWorkout = () => {
    if (recommendedWorkout) {
      navigate(`/session/${recommendedWorkout.id}`);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <header className="mb-4">
        <div className="section-label">{today}</div>
        <h1 className="headline">PaperFit Daily</h1>
      </header>

      <section>
        <div className="flex-row mb-4">
            <div className="card" style={{flex: 1, marginRight: '8px'}}>
                <div className="section-label">Streak</div>
                <div style={{fontSize: '2rem', fontWeight: 'bold'}}>3 Days</div>
            </div>
            <div className="card" style={{flex: 1, marginLeft: '8px'}}>
                <div className="section-label">Completed</div>
                <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{stats?.total_sessions || 0}</div>
            </div>
        </div>
      </section>

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
