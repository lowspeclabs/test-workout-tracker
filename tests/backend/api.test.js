
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';

describe('Backend API Endpoints', () => {

    it('GET /api/workouts should return list of workouts', async () => {
        const res = await request(app).get('/api/workouts');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('description');
        }
    });

    it('POST /api/sessions should start a session', async () => {
        // First get a workout ID
        const workoutsRes = await request(app).get('/api/workouts');
        const workoutId = workoutsRes.body[0].id;

        const res = await request(app)
            .post('/api/sessions')
            .send({ workout_id: workoutId });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('start_time');
    });

    it('GET /api/stats should return stats object', async () => {
        const res = await request(app).get('/api/stats');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('total_sessions');
        expect(res.body).toHaveProperty('recent_activity');
    });
});
