import React, { useEffect, useState } from 'react';
import { fetchStats } from '../api';

/**
 * StatsPage Component
 * Displays user progress statistics including total sessions and recent set history.
 */
const StatsPage = () => {
    // State to hold fetched statistics
    const [stats, setStats] = useState<any>(null);

    // Fetch stats on component mount
    useEffect(() => {
        fetchStats().then(setStats);
    }, []);

    return (
        <div>
            <h1 className="headline">Statistics</h1>

            {/* Top Level Metrics */}
            <div className="flex-row mb-4">
                <div className="card" style={{flex: 1, marginRight: '4px'}}>
                    <div className="section-label">Sessions</div>
                    <div style={{fontSize: '2rem'}}>{stats?.total_sessions || 0}</div>
                </div>
                <div className="card" style={{flex: 1, marginLeft: '4px'}}>
                     <div className="section-label">Weight Lifted</div>
                     {/* Placeholder for future volume calculation */}
                     <div style={{fontSize: '2rem'}}>--</div>
                </div>
            </div>

            {/* List of Recent Sets */}
            <div className="card">
                <div className="section-label">Recent History</div>
                {stats?.recent_activity?.map((set: any) => (
                    <div key={set.id} style={{padding: '8px 0', borderBottom: '1px solid #eee'}}>
                        {new Date(set.completed_at).toLocaleDateString()} - Set {set.set_index}: {set.weight}lbs x {set.reps}
                    </div>
                ))}
            </div>

            {/* Placeholder for Graphs/Charts */}
            <div className="card text-center">
                <p>More charts coming soon...</p>
            </div>
        </div>
    );
};

export default StatsPage;
