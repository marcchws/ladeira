import { describe, expect, it } from 'vitest';
import { climb, commuteDays, elevationAt, gaugeMax, gradeAt, length, range, rise, sizeFor } from './model';

describe('the climb', () => {
  it('runs 600 m and rises 63 m, rounded', () => {
    expect(length).toBe(600);
    expect(Math.round(rise)).toBe(63);
  });

  it('reads the grade of each segment, boundaries included', () => {
    expect(gradeAt(0)).toBe(0.04);
    expect(gradeAt(100)).toBe(0.04);
    expect(gradeAt(101)).toBe(0.1);
    expect(gradeAt(300)).toBe(0.18);
    expect(gradeAt(600)).toBe(0.06);
  });

  it('interpolates the height along a segment', () => {
    expect(elevationAt(50)).toBeCloseTo(2, 6);
    expect(elevationAt(250)).toBeCloseTo(19, 6);
    expect(elevationAt(600)).toBeCloseTo(rise, 6);
  });

  it('lets the legs carry the flat start and the motor the steep part', () => {
    const flat = climb(50);
    expect(flat.motor).toBe(Math.max(0, flat.need - 120));
    const steep = climb(300);
    expect(steep.legs).toBe(120);
    expect(steep.motor).toBe(steep.need - 120);
    expect(steep.motor).toBeLessThanOrEqual(600);
  });

  it('needs about 600 W for 98.5 kg at 12 km/h on 18%', () => {
    // 98.5 kg × 9.81 × 3.333 m/s × (0.18 + 0.006)
    expect(climb(300).need).toBe(599);
  });

  it('caps the motor at its 600 W peak when the load is heavy', () => {
    const c = climb(300, 130);
    expect(c.motor).toBe(600);
    expect(c.legs).toBe(c.need - 600);
  });
});

describe('the range', () => {
  it('gives the page’s claims at 75 kg: 110 km in Eco on the flat, 40 km in Climb on steep streets', () => {
    expect(range('eco', 'flat', 75)).toBe(110);
    expect(range('climb', 'steep', 75)).toBe(40);
  });

  it('goes less far with more weight, and stays inside the gauge', () => {
    expect(range('climb', 'steep', 120)).toBeLessThan(range('climb', 'steep', 75));
    expect(range('climb', 'steep', 120)).toBe(30);
    expect(range('eco', 'flat', 50)).toBeLessThanOrEqual(gaugeMax + 1);
  });

  it('counts whole days of an 8 km round-trip commute', () => {
    expect(commuteDays(110)).toBe(6);
    expect(commuteDays(15)).toBe(0);
  });
});

describe('the size rule', () => {
  it('suggests S, M or L inside 155 to 195 cm', () => {
    expect(sizeFor(155)).toBe('S');
    expect(sizeFor(168)).toBe('S');
    expect(sizeFor(169)).toBe('M');
    expect(sizeFor(181)).toBe('M');
    expect(sizeFor(182)).toBe('L');
    expect(sizeFor(195)).toBe('L');
  });

  it('has no size outside our range', () => {
    expect(sizeFor(154)).toBeNull();
    expect(sizeFor(196)).toBeNull();
  });
});
