import { describe, expect, it } from 'vitest';
import { calculateRoi, type RoiInputs } from './roi';

const base: RoiInputs = {
  sgaSpend: 10_000_000,
  sgaSavingsRate: 2,
  openCostSpend: 5_000_000,
  openCostSavingsRate: 3,
  implementationCost: 100_000,
  annualSubscriptionCost: 50_000,
  horizonYears: 3,
};

describe('calculateRoi', () => {
  it('computes savings, ROI and payback', () => {
    const result = calculateRoi(base);

    expect(result.sgaSavings).toBe(200_000);
    expect(result.openCostSavings).toBe(150_000);
    expect(result.grossAnnualSavings).toBe(350_000);
    expect(result.netAnnualSavings).toBe(300_000);
    expect(result.totalCost).toBe(250_000);
    expect(result.totalNetBenefit).toBe(800_000);
    expect(result.roiPercent).toBe(320);
    expect(result.paybackMonths).toBeCloseTo(4);
  });

  it('reports no payback when run cost exceeds savings', () => {
    const result = calculateRoi({ ...base, annualSubscriptionCost: 500_000 });

    expect(result.netAnnualSavings).toBeLessThan(0);
    expect(result.paybackMonths).toBeNull();
  });

  it('returns null ROI when there is no investment', () => {
    const result = calculateRoi({ ...base, implementationCost: 0, annualSubscriptionCost: 0 });

    expect(result.roiPercent).toBeNull();
  });
});
