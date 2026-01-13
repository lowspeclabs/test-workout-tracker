import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWorkoutDetails, startSession, logSet, completeSession } from '../api';
import { X, CheckCircle } from 'lucide-react';

/**
 * SessionPlayer Component
 *
 * This is the core workout interface. It guides the user through the workout one exercise at a time.
 * Features:
 * - Loads workout details and starts a tracking session.
 * - Displays exercise cues, targets, and rest times.
 * - Allows logging of weight and reps for each set.
 * - Enforces rest timers between sets.
 * - Handles transitions between exercises and workout completion.
 */
const SessionPlayer = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  // State: Workout Data
  const [workout, setWorkout] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Which exercise are we on?
  const [sessionId, setSessionId] = useState<number | null>(null); // Database ID for this session

  // State: Session Progress
  // Tracks the sets completed for the *current* exercise only.
  // When exercise changes, this resets.
  const [setsLogged, setSetsLogged] = useState<any[]>([]);

  // State: Input Fields
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  // State: Rest Timer
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);

  // Initial Load: Fetch workout and start session
  useEffect(() => {
    if (workoutId) {
      fetchWorkoutDetails(parseInt(workoutId)).then(setWorkout);
      startSession(parseInt(workoutId)).then(res => setSessionId(res.id));
    }
  }, [workoutId]);

  // Timer Logic: Countdown for rest periods
  useEffect(() => {
    let interval: any;
    if (isResting && restTimeLeft > 0) {
        interval = setInterval(() => {
            setRestTimeLeft(prev => prev - 1);
        }, 1000);
    } else if (restTimeLeft === 0 && isResting) {
        setIsResting(false); // Timer finished
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  if (!workout) return <div>Loading session...</div>;

  const currentStep = workout.exercises[currentStepIndex];
  const currentSetNumber = setsLogged.length + 1;
  const isLastExercise = currentStepIndex === workout.exercises.length - 1;

  // Handler: Log a completed set
  const handleLogSet = async () => {
      if (!sessionId) return;

      // Save to backend
      await logSet(sessionId, {
          exercise_id: currentStep.exercise_id,
          set_index: currentSetNumber,
          reps: parseInt(reps),
          weight: parseFloat(weight),
          rpe: 0 // Default RPE for MVP
      });

      // Update local state
      setSetsLogged([...setsLogged, { reps, weight }]);

      // Logic: Are there more sets for this exercise?
      if (setsLogged.length + 1 < currentStep.sets) {
          // Yes: Start Rest Timer
          setRestTimeLeft(currentStep.rest_seconds);
          setIsResting(true);
      } else {
          // No: Exercise Complete
          if (isLastExercise) {
              // Workout Complete
              await completeSession(sessionId);
              alert("Workout Complete!");
              navigate('/');
          } else {
              // Move to Next Exercise
              setCurrentStepIndex(prev => prev + 1);
              setSetsLogged([]); // Reset set tracker for new exercise
              setIsResting(false);
              setWeight('');
              setReps('');
          }
      }
  };

  // Handler: User wants to skip the rest timer
  const handleSkipRest = () => {
      setRestTimeLeft(0);
      setIsResting(false);
  }

  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff'}}>
      {/* Top Navigation Bar */}
      <div className="flex-row" style={{padding: '16px', borderBottom: '1px solid #eee'}}>
          {/* Close Button */}
          <X onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
          <div style={{fontWeight: 'bold'}}>{workout.name}</div>
          {/* Finish Early Button */}
          <div onClick={() => { completeSession(sessionId!).then(() => navigate('/')) }} style={{cursor: 'pointer', color: 'var(--accent-color)'}}>
              Finish
          </div>
      </div>

      {/* Main Exercise Content */}
      <div style={{flex: 1, padding: '16px', overflowY: 'auto'}}>
          {/* Progress Indicator */}
          <div className="section-label">Exercise {currentStepIndex + 1} of {workout.exercises.length}</div>
          <h2 style={{fontSize: '2rem', marginBottom: '8px'}}>{currentStep.exercise_name}</h2>

          {/* Cues Card */}
          <div className="card" style={{background: '#f9f9f9'}}>
              <div style={{fontWeight: 'bold'}}>Cues</div>
              <p>{currentStep.cues}</p>
          </div>

          {/* Targets Row */}
          <div className="flex-row mb-4">
              <div style={{textAlign: 'center', flex: 1}}>
                  <div className="section-label">Target</div>
                  <div style={{fontSize: '1.5rem'}}>{currentStep.sets} x {currentStep.reps_range}</div>
              </div>
              <div style={{textAlign: 'center', flex: 1}}>
                 <div className="section-label">Rest</div>
                 <div style={{fontSize: '1.5rem'}}>{currentStep.rest_seconds}s</div>
              </div>
          </div>

          {/* Input Area (Logging Card) */}
          <div className="card">
              <div className="flex-row mb-2">
                  <div style={{flex: 1, marginRight: '8px'}}>
                      <label className="section-label">Weight (lbs)</label>
                      <input
                        type="number"
                        className="btn btn-secondary"
                        style={{textAlign: 'left', padding: '12px'}}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="0"
                      />
                  </div>
                  <div style={{flex: 1, marginLeft: '8px'}}>
                      <label className="section-label">Reps</label>
                      <input
                        type="number"
                        className="btn btn-secondary"
                        style={{textAlign: 'left', padding: '12px'}}
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="0"
                      />
                  </div>
              </div>
              <div style={{textAlign: 'center', margin: '8px 0', fontSize: '0.8rem', color: '#666'}}>
                  Set {currentSetNumber} of {currentStep.sets}
              </div>
          </div>

          {/* History of Sets for Current Exercise */}
          {setsLogged.length > 0 && (
              <div className="mb-4">
                  <div className="section-label">Completed Sets</div>
                  {setsLogged.map((s: any, idx) => (
                      <div key={idx} className="flex-row" style={{padding: '8px 0', borderBottom: '1px solid #eee'}}>
                          <span>Set {idx+1}</span>
                          <span>{s.weight}lbs x {s.reps}</span>
                          <CheckCircle size={16} color="green" />
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Footer / Rest Overlay */}
      {isResting ? (
          // Full screen overlay for Rest Mode
          <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(0,0,0,0.9)', color: 'white',
              padding: '32px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50%'
          }}>
              <div className="section-label" style={{color: '#aaa'}}>Resting</div>
              <div style={{fontSize: '4rem', fontWeight: 'bold', marginBottom: '16px'}}>
                  {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
              </div>
              <button className="btn btn-primary" onClick={handleSkipRest} style={{maxWidth: '200px'}}>Skip Rest</button>
          </div>
      ) : (
        // Standard Action Bar
        <div style={{padding: '16px', borderTop: '1px solid #eee'}}>
            <button className="btn btn-primary" onClick={handleLogSet}>LOG SET</button>
        </div>
      )}
    </div>
  );
};

export default SessionPlayer;
