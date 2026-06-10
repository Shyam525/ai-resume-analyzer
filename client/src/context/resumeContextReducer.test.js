import test from 'node:test';
import assert from 'node:assert/strict';

import { initialState, reducer, HISTORY_KEY, JOB_DESCRIPTION_KEY } from './resumeContextReducer.js';

test('reducer clears history without affecting the rest of the state', () => {
  const state = {
    ...initialState,
    history: [{ id: '1', fileName: 'resume.pdf' }],
    jobDescription: 'Senior React engineer',
  };

  const nextState = reducer(state, { type: 'CLEAR_HISTORY' });

  assert.deepEqual(nextState.history, []);
  assert.equal(nextState.jobDescription, 'Senior React engineer');
});

test('reducer preserves the default history storage keys', () => {
  assert.equal(HISTORY_KEY, 'resume-analyzer-history');
  assert.equal(JOB_DESCRIPTION_KEY, 'resume-analyzer-job-description');
});
