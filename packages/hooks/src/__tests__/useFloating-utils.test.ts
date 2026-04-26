import { describe, expect, it } from 'vitest';

import type { Dimensions, Rect } from '../hooks/useFloating/types';
import { computePosition } from '../hooks/useFloating/utils';

/**
 * Helper: create a viewport rect (the visible scrollable area).
 */
function viewport(top: number, left: number, width: number, height: number): Rect {
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

/**
 * Helper: create a reference element rect.
 */
function refRect(top: number, left: number, width: number, height: number): Rect {
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

describe('computePosition – flip logic', () => {
  const floatingSize: Dimensions = { width: 200, height: 300 };
  const offset = 8;

  it('flips from bottom to top when element does not fit below but fits above', () => {
    // Viewport: 0..600 vertically
    const vp = viewport(0, 0, 800, 600);
    // Reference near the bottom: top=350, height=40 → bottom=390
    // Space below = 600 - 390 = 210 (not enough for 300 + 8 = 308)
    // Space above = 350 - 0 = 350 (enough for 308)
    const ref = refRect(350, 100, 120, 40);

    const result = computePosition(ref, floatingSize, 'bottom-start', vp, offset);

    expect(result.finalPlacement).toBe('top-start');
    // Positioned above: top = ref.top - height - offset = 350 - 300 - 8 = 42
    expect(result.position.top).toBe(42);
  });

  it('flips from top to bottom when element does not fit above but fits below', () => {
    const vp = viewport(0, 0, 800, 600);
    // Reference near the top: top=50, height=40 → bottom=90
    // Space above = 50 (not enough for 308)
    // Space below = 600 - 90 = 510 (enough for 308)
    const ref = refRect(50, 100, 120, 40);

    const result = computePosition(ref, floatingSize, 'top-start', vp, offset);

    expect(result.finalPlacement).toBe('bottom-start');
    // Positioned below: top = ref.bottom + offset = 90 + 8 = 98
    expect(result.position.top).toBe(98);
  });

  it('does NOT flip when neither side fits and current side has more space', () => {
    const vp = viewport(0, 0, 800, 400);
    // Reference in the upper portion: top=100, height=40 → bottom=140
    // Space below = 400 - 140 = 260 (not enough for 308, but more than above)
    // Space above = 100 (not enough for 308, and less than below)
    const ref = refRect(100, 100, 120, 40);

    const result = computePosition(ref, floatingSize, 'bottom-start', vp, offset);

    // Should stay on bottom since below (260) > above (100)
    expect(result.finalPlacement).toBe('bottom-start');
    expect(result.position.top).toBe(148); // 140 + 8
  });

  it('does NOT flip when neither side fits and both sides have equal space', () => {
    const vp = viewport(0, 0, 800, 400);
    // Reference exactly centered: top=180, height=40 → bottom=220
    // Space below = 400 - 220 = 180
    // Space above = 180
    const ref = refRect(180, 100, 120, 40);

    const result = computePosition(ref, floatingSize, 'bottom-start', vp, offset);

    // Equal space → don't flip, stay on original side
    expect(result.finalPlacement).toBe('bottom-start');
  });

  it('flips when neither side fits but other side has more space', () => {
    const vp = viewport(0, 0, 800, 400);
    // Reference near bottom: top=300, height=40 → bottom=340
    // Space below = 400 - 340 = 60 (not enough for 308)
    // Space above = 300 (not enough for 308, but much more than 60)
    const ref = refRect(300, 100, 120, 40);

    const result = computePosition(ref, floatingSize, 'bottom-start', vp, offset);

    // Should flip to top since above (300) > below (60)
    expect(result.finalPlacement).toBe('top-start');
  });

  it('stays on original side when it already fits', () => {
    const vp = viewport(0, 0, 800, 800);
    // Reference near the top: top=50, height=40 → bottom=90
    // Space below = 800 - 90 = 710 (plenty for 308)
    const ref = refRect(50, 100, 120, 40);

    const result = computePosition(ref, floatingSize, 'bottom-start', vp, offset);

    expect(result.finalPlacement).toBe('bottom-start');
    expect(result.position.top).toBe(98); // 90 + 8
  });

  // --- Horizontal flip tests ---

  it('flips from right to left when element does not fit on right but fits on left', () => {
    const floatingH: Dimensions = { width: 300, height: 200 };
    const vp = viewport(0, 0, 600, 800);
    // Reference near right edge: left=400, width=50 → right=450
    // Space right = 600 - 450 = 150 (not enough for 308)
    // Space left = 400 (enough for 308)
    const ref = refRect(100, 400, 50, 40);

    const result = computePosition(ref, floatingH, 'right-start', vp, offset);

    expect(result.finalPlacement).toBe('left-start');
  });

  it('does NOT flip horizontally when current side has more space', () => {
    const floatingH: Dimensions = { width: 300, height: 200 };
    const vp = viewport(0, 0, 500, 800);
    // Reference at left=50, width=50 → right=100
    // Space right = 500 - 100 = 400 (not enough for 308, but more)
    // Space left = 50 (less)
    const ref = refRect(100, 50, 50, 40);

    const result = computePosition(ref, floatingH, 'right-start', vp, offset);

    // Should stay on right since right (400) > left (50)
    expect(result.finalPlacement).toBe('right-start');
  });
});
