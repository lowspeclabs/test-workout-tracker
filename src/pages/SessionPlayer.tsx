import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWorkoutDetails, startSession, logSet, completeSession } from '../api';
import { X, Clock, CheckCircle } from 'lucide-react';

const SessionPlayer = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [setsLogged, setSetsLogged] = useState<number[]>([]);

  // Inputs
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  // Rest
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);

  useEffect(() => {
    if (workoutId) {
      fetchWorkoutDetails(parseInt(workoutId)).then(setWorkout);
      startSession(parseInt(workoutId)).then(res => setSessionId(res.id));
    }
  }, [workoutId]);

  useEffect(() => {
    let interval: any;
    if (isResting && restTimeLeft > 0) {
        interval = setInterval(() => {
            setRestTimeLeft(prev => prev - 1);
        }, 1000);
    } else if (restTimeLeft === 0 && isResting) {
        setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  if (!workout) return <div>Loading session...</div>;

  const currentStep = workout.exercises[currentStepIndex];
  const currentSetNumber = setsLogged.length + 1;
  const isLastExercise = currentStepIndex === workout.exercises.length - 1;
  const isLastSet = setsLogged.length >= currentStep.sets;

  const handleLogSet = async () => {
      if (!sessionId) return;

      await logSet(sessionId, {
          exercise_id: currentStep.exercise_id,
          set_index: currentSetNumber,
          reps: parseInt(reps),
          weight: parseFloat(weight),
          rpe: 0
      });

      setSetsLogged([...setsLogged, { reps, weight }]);

      // If incomplete sets for this exercise, start rest
      if (setsLogged.length + 1 < currentStep.sets) {
          setRestTimeLeft(currentStep.rest_seconds);
          setIsResting(true);
      } else {
          // Finished exercise
          if (isLastExercise) {
              await completeSession(sessionId);
              alert("Workout Complete!");
              navigate('/');
          } else {
              setCurrentStepIndex(prev => prev + 1);
              setSetsLogged([]);
              setIsResting(false);
              setWeight(''); // reset or keep previous?
              setReps('');
          }
      }
  };

  const handleSkipRest = () => {
      setRestTimeLeft(0);
      setIsResting(false);
  }

  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff'}}>
      {/* Top Bar */}
      <div className="flex-row" style={{padding: '16px', borderBottom: '1px solid #eee'}}>
          <X onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
          <div style={{fontWeight: 'bold'}}>{workout.name}</div>
          <div onClick={() => { completeSession(sessionId!).then(() => navigate('/')) }} style={{cursor: 'pointer', color: 'var(--accent-color)'}}>
              Finish
          </div>
      </div>

      {/* Main Content */}
      <div style={{flex: 1, padding: '16px', overflowY: 'auto'}}>
          <div className="section-label">Exercise {currentStepIndex + 1} of {workout.exercises.length}</div>
          <h2 style={{fontSize: '2rem', marginBottom: '8px'}}>{currentStep.exercise_name}</h2>

          <div className="card" style={{background: '#f9f9f9'}}>
              <div style={{fontWeight: 'bold'}}>Cues</div>
              <p>{currentStep.cues}</p>
          </div>

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

          {/* Logging Area */}
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

          {/* Set History for this session */}
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

      {/* Bottom Bar / Rest Overlay */}
      {isResting ? (
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
        <div style={{padding: '16px', borderTop: '1px solid #eee'}}>
            <button className="btn btn-primary" onClick={handleLogSet}>LOG SET</button>
        </div>
      )}
    </div>
  );
};

export default SessionPlayer;
