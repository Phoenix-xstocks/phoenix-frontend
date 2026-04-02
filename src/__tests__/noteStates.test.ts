import { describe, it, expect } from 'vitest';
import { NoteState, NOTE_STATE_CONFIG } from '@/lib/noteStates';

describe('NoteState enum', () => {
  it('has exactly 12 states', () => {
    const numericValues = Object.values(NoteState).filter(
      (v) => typeof v === 'number',
    );
    expect(numericValues).toHaveLength(12);
  });

  it('maps states to correct numeric values', () => {
    expect(NoteState.Created).toBe(0);
    expect(NoteState.Priced).toBe(1);
    expect(NoteState.Active).toBe(2);
    expect(NoteState.ObservationPending).toBe(3);
    expect(NoteState.Autocalled).toBe(4);
    expect(NoteState.MaturityCheck).toBe(5);
    expect(NoteState.KISettle).toBe(6);
    expect(NoteState.NoKISettle).toBe(7);
    expect(NoteState.Settled).toBe(8);
    expect(NoteState.Rolled).toBe(9);
    expect(NoteState.Cancelled).toBe(10);
    expect(NoteState.EmergencyPaused).toBe(11);
  });
});

describe('NOTE_STATE_CONFIG', () => {
  const allStates = [
    NoteState.Created,
    NoteState.Priced,
    NoteState.Active,
    NoteState.ObservationPending,
    NoteState.Autocalled,
    NoteState.MaturityCheck,
    NoteState.KISettle,
    NoteState.NoKISettle,
    NoteState.Settled,
    NoteState.Rolled,
    NoteState.Cancelled,
    NoteState.EmergencyPaused,
  ];

  it('has config for every state', () => {
    for (const state of allStates) {
      expect(NOTE_STATE_CONFIG[state]).toBeDefined();
    }
  });

  it('every config has non-empty label', () => {
    for (const state of allStates) {
      expect(NOTE_STATE_CONFIG[state].label.length).toBeGreaterThan(0);
    }
  });

  it('every config has non-empty description', () => {
    for (const state of allStates) {
      expect(NOTE_STATE_CONFIG[state].description.length).toBeGreaterThan(0);
    }
  });

  it('color values use text- prefix', () => {
    for (const state of allStates) {
      expect(NOTE_STATE_CONFIG[state].color).toMatch(/^text-/);
    }
  });

  it('bgColor values use bg- prefix', () => {
    for (const state of allStates) {
      expect(NOTE_STATE_CONFIG[state].bgColor).toMatch(/^bg-/);
    }
  });
});
