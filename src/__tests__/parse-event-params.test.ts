import { describe, it, expect } from 'vitest';
import { parseEventParams } from '@/lib/parse-event-params';

describe('parseEventParams', () => {
  describe('engine events', () => {
    it('parses NoteCreated', () => {
      expect(parseEventParams('NoteCreated', ['0x1', '0xholder', '1000'])).toEqual({
        noteId: '0x1',
        holder: '0xholder',
        notional: '1000',
      });
    });

    it('parses NoteStateChanged', () => {
      expect(parseEventParams('NoteStateChanged', ['0x1', '2', '4'])).toEqual({
        noteId: '0x1',
        fromState: '2',
        toState: '4',
      });
    });

    it('parses CouponPaid', () => {
      expect(parseEventParams('CouponPaid', ['0x1', '500', 'true'])).toEqual({
        noteId: '0x1',
        amount: '500',
        memoryPaid: 'true',
      });
    });

    it('parses single-param event EmergencyPaused', () => {
      expect(parseEventParams('EmergencyPaused', ['0x1'])).toEqual({
        noteId: '0x1',
      });
    });
  });

  describe('vault events', () => {
    it('parses DepositRequested', () => {
      expect(parseEventParams('DepositRequested', ['1', '0xdepositor', '500'])).toEqual({
        requestId: '1',
        depositor: '0xdepositor',
        amount: '500',
      });
    });

    it('parses DepositClaimed with 3 params', () => {
      expect(parseEventParams('DepositClaimed', ['1', '0xnote', '42'])).toEqual({
        requestId: '1',
        noteId: '0xnote',
        tokenId: '42',
      });
    });
  });

  describe('streamer events', () => {
    it('parses CouponStreamStarted with 4 params', () => {
      expect(
        parseEventParams('CouponStreamStarted', ['0x1', '0xholder', '42', '100']),
      ).toEqual({
        noteId: '0x1',
        holder: '0xholder',
        streamId: '42',
        amount: '100',
      });
    });
  });

  describe('notetoken events', () => {
    it('parses NoteMinted', () => {
      expect(parseEventParams('NoteMinted', ['0x1', '0xholder', '1'])).toEqual({
        noteId: '0x1',
        holder: '0xholder',
        amount: '1',
      });
    });
  });

  describe('edge cases', () => {
    it('returns empty object for unknown event', () => {
      expect(parseEventParams('UnknownEvent', ['a', 'b'])).toEqual({});
    });

    it('handles partial params (fewer than schema)', () => {
      const result = parseEventParams('NoteCreated', ['0x1']);
      expect(result).toEqual({ noteId: '0x1' });
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('handles empty params array', () => {
      expect(parseEventParams('NoteCreated', [])).toEqual({});
    });

    it('ignores extra params beyond schema', () => {
      const result = parseEventParams('EmergencyPaused', ['0x1', 'extra', 'more']);
      expect(result).toEqual({ noteId: '0x1' });
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('handles empty string event signature', () => {
      expect(parseEventParams('', ['a'])).toEqual({});
    });
  });

  describe('schema completeness', () => {
    const allEvents = [
      'NoteCreated', 'NoteStateChanged', 'CouponPaid', 'CouponMissed',
      'CouponStreamed', 'NoteAutocalled', 'NoteSettled', 'RequestPricing',
      'EmergencyPaused', 'EmergencyResumed', 'NoteCancelled',
      'DepositRequested', 'DepositReadyToClaim', 'DepositClaimed', 'DepositRefunded',
      'CouponStreamStarted', 'CouponStreamCancelled', 'CouponWithdrawn',
      'NoteMinted', 'NoteBurned',
    ];

    it('has schemas for all 20 event types', () => {
      for (const event of allEvents) {
        const result = parseEventParams(event, Array(10).fill('test'));
        expect(Object.keys(result).length).toBeGreaterThan(0);
      }
    });
  });
});
