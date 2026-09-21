export type RoiInputs = {
  sgaSpend: number;
  sgaSavingsRate: number;
  openCostSpend: number;
  openCostSavingsRate: number;
  implementationCost: number;
  annualSubscriptionCost: number;
  horizonYears: number;
};

export type RoiResults = {
  sgaSavings: number;
  openCostSavings: number;
  grossAnnualSavings: number;
  netAnnualSavings: number;
  totalCost: number;
  totalNetBenefit: number;
  roiPercent: number | null;
  paybackMonths: number | null;
};

export function calculateRoi(inputs: RoiInputs): RoiResults {
  const sgaSavings = inputs.sgaSpend * (inputs.sgaSavingsRate / 100);
  const openCostSavings = inputs.openCostSpend * (inputs.openCostSavingsRate / 100);
  const grossAnnualSavings = sgaSavings + openCostSavings;
  const netAnnualSavings = grossAnnualSavings - inputs.annualSubscriptionCost;

  const totalCost = inputs.implementationCost + inputs.annualSubscriptionCost * inputs.horizonYears;
  const totalNetBenefit = grossAnnualSavings * inputs.horizonYears - totalCost;

  const roiPercent = totalCost > 0 ? (totalNetBenefit / totalCost) * 100 : null;
  const paybackMonths =
    netAnnualSavings > 0 ? (inputs.implementationCost / netAnnualSavings) * 12 : null;

  return {
    sgaSavings,
    openCostSavings,
    grossAnnualSavings,
    netAnnualSavings,
    totalCost,
    totalNetBenefit,
    roiPercent,
    paybackMonths,
  };
}

export const currency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
