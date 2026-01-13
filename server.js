
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize Database
const db = new sqlite3.Database('./paperfit.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDb();
  }
});

function initializeDb() {
  db.serialize(() => {
    // User Profile
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      experience_level TEXT,
      primary_site TEXT,
      goals TEXT,
      preferences TEXT
    )`);

    // Exercises
    db.run(`CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cues TEXT,
      movement_pattern TEXT,
      equipment_required TEXT,
      modifications TEXT
    )`);

    // Workouts
    db.run(`CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      tags TEXT,
      description TEXT
    )`);

    // Workout Exercises (Steps)
    db.run(`CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER,
      exercise_id INTEGER,
      sets INTEGER,
      reps_range TEXT,
      rest_seconds INTEGER,
      order_index INTEGER,
      FOREIGN KEY(workout_id) REFERENCES workouts(id),
      FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    )`);

    // Sessions
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER,
      start_time TEXT,
      end_time TEXT,
      completed BOOLEAN,
      FOREIGN KEY(workout_id) REFERENCES workouts(id)
    )`);

    // Sets Log
    db.run(`CREATE TABLE IF NOT EXISTS sets_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER,
      exercise_id INTEGER,
      set_index INTEGER,
      reps INTEGER,
      weight REAL,
      rpe INTEGER,
      completed_at TEXT,
      FOREIGN KEY(session_id) REFERENCES sessions(id),
      FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    )`);

    // Seed initial data if empty
    db.get("SELECT count(*) as count FROM exercises", (err, row) => {
        if (row && row.count === 0) {
            seedData();
        }
    });
  });
}

function seedData() {
    console.log("Seeding data...");
    const exercises = [
        { name: 'Goblet Squat', cues: 'Chest up, knees out', pattern: 'squat', equipment: 'kettlebell/dumbbell', mods: 'bodyweight squat' },
        { name: 'Push Up', cues: 'Core tight, elbows 45 degrees', pattern: 'push', equipment: 'bodyweight', mods: 'knee pushup' },
        { name: 'Dumbbell Row', cues: 'Flat back, pull to hip', pattern: 'pull', equipment: 'dumbbell', mods: 'band row' },
        { name: 'Glute Bridge', cues: 'Squeeze glutes at top', pattern: 'hinge', equipment: 'bodyweight', mods: '' },
        { name: 'Plank', cues: 'Straight line from head to heels', pattern: 'core', equipment: 'bodyweight', mods: '' }
    ];

    const stmt = db.prepare("INSERT INTO exercises (name, cues, movement_pattern, equipment_required, modifications) VALUES (?, ?, ?, ?, ?)");
    exercises.forEach(ex => {
        stmt.run(ex.name, ex.cues, ex.pattern, ex.equipment, ex.mods);
    });
    stmt.finalize();

    db.run("INSERT INTO workouts (name, tags, description) VALUES (?, ?, ?)", ['Beginner Strength A', 'gym,home', 'Full body strength basics'], function(err) {
        if (!err) {
            const workoutId = this.lastID;
            // Add exercises to workout
            const steps = [
                { exId: 1, sets: 3, reps: '8-12', rest: 60, order: 1 }, // Goblet Squat
                { exId: 2, sets: 3, reps: '8-12', rest: 60, order: 2 }, // Push Up
                { exId: 3, sets: 3, reps: '10-15', rest: 60, order: 3 } // DB Row
            ];
            const stepStmt = db.prepare("INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps_range, rest_seconds, order_index) VALUES (?, ?, ?, ?, ?, ?)");
            steps.forEach(s => {
                stepStmt.run(workoutId, s.exId, s.sets, s.reps, s.rest, s.order);
            });
            stepStmt.finalize();
        }
    });
}

// --- API Endpoints ---

// Get all workouts
app.get('/api/workouts', (req, res) => {
    db.all("SELECT * FROM workouts", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get specific workout details
app.get('/api/workouts/:id', (req, res) => {
    const workoutId = req.params.id;
    db.get("SELECT * FROM workouts WHERE id = ?", [workoutId], (err, workout) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!workout) return res.status(404).json({ error: "Workout not found" });

        db.all(`
            SELECT we.*, e.name as exercise_name, e.cues, e.movement_pattern
            FROM workout_exercises we
            JOIN exercises e ON we.exercise_id = e.id
            WHERE we.workout_id = ?
            ORDER BY we.order_index`,
            [workoutId], (err, exercises) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ ...workout, exercises });
            });
    });
});

// Start a session
app.post('/api/sessions', (req, res) => {
    const { workout_id } = req.body;
    const startTime = new Date().toISOString();
    db.run("INSERT INTO sessions (workout_id, start_time, completed) VALUES (?, ?, 0)", [workout_id, startTime], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, workout_id, start_time: startTime });
    });
});

// Log a set
app.post('/api/sessions/:id/sets', (req, res) => {
    const sessionId = req.params.id;
    const { exercise_id, set_index, reps, weight, rpe } = req.body;
    const completedAt = new Date().toISOString();

    db.run(`INSERT INTO sets_log (session_id, exercise_id, set_index, reps, weight, rpe, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sessionId, exercise_id, set_index, reps, weight, rpe, completedAt],
            function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, status: "success" });
    });
});

// Complete session
app.patch('/api/sessions/:id/complete', (req, res) => {
    const sessionId = req.params.id;
    const endTime = new Date().toISOString();
    db.run("UPDATE sessions SET end_time = ?, completed = 1 WHERE id = ?", [endTime, sessionId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: "success", end_time: endTime });
    });
});

// Get Stats (Simple summary)
app.get('/api/stats', (req, res) => {
    db.get("SELECT COUNT(*) as total_sessions FROM sessions WHERE completed = 1", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all("SELECT * FROM sets_log ORDER BY completed_at DESC LIMIT 5", (err, recentSets) => {
             res.json({
                 total_sessions: row.total_sessions,
                 recent_activity: recentSets
             });
        });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
