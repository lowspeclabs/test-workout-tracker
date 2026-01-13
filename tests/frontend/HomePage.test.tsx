
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../../src/pages/HomePage';
import { BrowserRouter } from 'react-router-dom';

// Mock API calls
vi.mock('../../src/api', () => ({
  fetchStats: vi.fn(() => Promise.resolve({ total_sessions: 10, recent_activity: [] })),
  fetchWorkouts: vi.fn(() => Promise.resolve([
      { id: 1, name: 'Test Workout', description: 'Test Desc', tags: 'test' }
  ])),
}));

describe('HomePage Component', () => {
    it('renders the header and stats', async () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

        // Check for Header
        expect(screen.getByText('PaperFit Daily')).toBeInTheDocument();

        // Check for Stats (wait for effect to load)
        await waitFor(() => {
            expect(screen.getByText('10')).toBeInTheDocument();
        });

        // Check for Recommended Workout
        await waitFor(() => {
             expect(screen.getByText('Test Workout')).toBeInTheDocument();
        });
    });
});
