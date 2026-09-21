import { useMemo, useState } from 'react';
import './App.css';
import { calculateRoi, currency, type RoiInputs } from './roi';

const formatYears = (years: number) => `${years} ${years === 1 ? 'year' : 'years'}`;

const defaults: RoiInputs = {
  sgaSpend: 50_000_000,
  sgaSavingsRate: 2,
  openCostSpend: 20_000_000,
  openCostSavingsRate: 2,
  implementationCost: 250_000,
  annualSubscriptionCost: 150_000,
  horizonYears: 3,
};

function MoneyField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {hint && <span className="field-hint">{hint}</span>}
      <div className="money-input">
        <span>$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString('en-US')}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value.replace(/\D/g, '')) || 0))}
        />
      </div>
    </label>
  );
}

function RateSlider({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label} <strong>{value.toFixed(1)}%</strong>
      </span>
      <span className="field-hint">{hint}</span>
      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="scale">
        <span>1%</span>
        <span>3%</span>
      </div>
    </label>
  );
}

export default function App() {
  const [inputs, setInputs] = useState<RoiInputs>(defaults);
  const results = useMemo(() => calculateRoi(inputs), [inputs]);

  const set = <K extends keyof RoiInputs>(key: K) => (value: RoiInputs[K]) =>
    setInputs((current) => ({ ...current, [key]: value }));

  return (
    <main className="page">
      <header>
        <h1>ROI Business Case</h1>
        <p>
          Estimate the annual value of improved spend visibility and better resource allocation,
          then compare it against the cost of the program.
        </p>
      </header>

      <section className="panel">
        <h2>1. Reduced SG&amp;A expenses</h2>
        <MoneyField
          label="Annual SG&A spend"
          hint="Total selling, general and administrative expense per year."
          value={inputs.sgaSpend}
          onChange={set('sgaSpend')}
        />
        <RateSlider
          label="Savings rate"
          hint="1%–3% through improved visibility, spend optimization and cost reduction."
          value={inputs.sgaSavingsRate}
          onChange={set('sgaSavingsRate')}
        />
        <p className="line-result">Annual savings: {currency(results.sgaSavings)}</p>
      </section>

      <section className="panel">
        <h2>2. Optimizing the right resources</h2>
        <MoneyField
          label="Annual open cost base"
          hint="Addressable labour / contractor / open cost spend per year."
          value={inputs.openCostSpend}
          onChange={set('openCostSpend')}
        />
        <RateSlider
          label="Savings rate"
          hint="1%–3% of open cost savings from optimizing the right resources."
          value={inputs.openCostSavingsRate}
          onChange={set('openCostSavingsRate')}
        />
        <p className="line-result">Annual savings: {currency(results.openCostSavings)}</p>
      </section>

      <section className="panel">
        <h2>3. Investment</h2>
        <MoneyField
          label="One-time implementation cost"
          value={inputs.implementationCost}
          onChange={set('implementationCost')}
        />
        <MoneyField
          label="Annual subscription / run cost"
          value={inputs.annualSubscriptionCost}
          onChange={set('annualSubscriptionCost')}
        />
        <label className="field">
          <span className="field-label">
            Time horizon <strong>{formatYears(inputs.horizonYears)}</strong>
          </span>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={inputs.horizonYears}
            onChange={(event) => set('horizonYears')(Number(event.target.value))}
          />
          <div className="scale">
            <span>1 yr</span>
            <span>5 yrs</span>
          </div>
        </label>
      </section>

      <section className="panel results">
        <h2>Results</h2>
        <div className="grid">
          <div className="metric">
            <span>Gross annual savings</span>
            <strong>{currency(results.grossAnnualSavings)}</strong>
          </div>
          <div className="metric">
            <span>Net annual savings</span>
            <strong>{currency(results.netAnnualSavings)}</strong>
          </div>
          <div className="metric">
            <span>{inputs.horizonYears}-year net benefit</span>
            <strong>{currency(results.totalNetBenefit)}</strong>
          </div>
          <div className="metric highlight">
            <span>{inputs.horizonYears}-year ROI</span>
            <strong>
              {results.roiPercent === null ? '—' : `${Math.round(results.roiPercent)}%`}
            </strong>
          </div>
          <div className="metric">
            <span>Payback period</span>
            <strong>
              {results.paybackMonths === null
                ? 'No payback'
                : `${results.paybackMonths.toFixed(1)} months`}
            </strong>
          </div>
          <div className="metric">
            <span>Total cost ({formatYears(inputs.horizonYears)})</span>
            <strong>{currency(results.totalCost)}</strong>
          </div>
        </div>
        <button type="button" className="reset" onClick={() => setInputs(defaults)}>
          Reset to example values
        </button>
      </section>
    </main>
  );
}
