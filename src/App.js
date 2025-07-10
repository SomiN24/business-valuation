import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const initialState = {
    yii: "", dcp: "", icp: "", rif: "", rpc: "", os: "",
    ele: "", sle: "", mle: "", ale: "", anle: "", loc: "",
    tip: "", cif: "", ltrca: "", ltbca: "", lia: "", pm: "",
    tr: "", debt: "", assets: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [output, setOutput] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  const labelMap = {
    yii: "Years in Industry",
    dcp: "Domestic Client Pool",
    icp: "International Client Pool",
    rif: "Regulation Issues Faced",
    rpc: "Retention per 100 Customers",
    os: "Office Size (No. of Employees)",
    ele: "Executive Level Employees",
    sle: "Senior Level Employees",
    mle: "Mid Level Employees",
    ale: "Associative Level Employees",
    anle: "Analyst Level Employees",
    loc: "Number of Locations",
    tip: "Technology & IP Involved",
    cif: "Compliance Issues Faced",
    ltrca: "Long Term Revenue Contracts",
    ltbca: "Long Term Borrowing Contracts",
    lia: "Number of Liabilities",
    pm: "Avg. Profit Margin (Last 5 Years) (In %)",
    tr: "Total Revenue",
    debt: "Total Debt",
    assets: "Total Assets"
  };

  const calculate = () => {
    const f = formData;
    const ev = f.tr - f.debt + f.assets;

    const scale = (val, levels) => {
      for (const [condition, score] of levels) {
        if (condition(val)) return score;
      }
      return 0;
    };

    let total = 0;

    total += scale(f.yii, [
      [v => v <= 5, 2], [v => v <= 10, 8], [v => v <= 15, 18],
      [v => v <= 20, 32], [v => v > 20, 50]
    ]);

    total += scale(f.dcp, [
      [v => v <= 25, 2], [v => v <= 50, 8], [v => v <= 75, 18],
      [v => v <= 100, 32], [v => v > 100, 50]
    ]);

    total += scale(f.icp, [
      [v => v <= 25, 4], [v => v <= 50, 12], [v => v <= 75, 24],
      [v => v <= 100, 40], [v => v > 100, 60]
    ]);

    total += scale(f.rif, [
      [v => v === 0, 0], [v => v <= 6, -4], [v => v <= 10, -12],
      [v => v > 10, -24]
    ]);

    total += scale(f.rpc, [
      [v => v <= 15, 4], [v => v <= 25, 12], [v => v <= 35, 24],
      [v => v <= 45, 40], [v => v > 45, 60]
    ]);

    total += scale(f.os, [
      [v => v <= 20, 4], [v => v <= 26, 12], [v => v <= 32, 24],
      [v => v > 32, 40]
    ]);

    total += scale(f.ele, [
      [v => v <= 2, 2], [v => v <= 6, 4], [v => v <= 10, 6], [v => v > 10, 8]
    ]);

    total += scale(f.sle, [
      [v => v <= 2, 1.6], [v => v <= 6, 3.2], [v => v <= 10, 4.8], [v => v > 10, 6.4]
    ]);

    total += scale(f.mle, [
      [v => v <= 2, 1.2], [v => v <= 6, 2.4], [v => v <= 10, 3.6], [v => v > 10, 4.8]
    ]);

    total += scale(f.ale, [
      [v => v <= 2, 0.8], [v => v <= 6, 1.6], [v => v <= 10, 2.4], [v => v > 10, 3.2]
    ]);

    total += scale(f.anle, [
      [v => v <= 2, 0.4], [v => v <= 6, 0.8], [v => v <= 10, 1.2], [v => v > 10, 1.6]
    ]);

    total += scale(f.loc, [
      [v => v <= 2, 4], [v => v <= 5, 12], [v => v <= 10, 24]
    ]);

    total += scale(f.tip, [
      [v => v <= 5, 2], [v => v <= 10, 12], [v => v <= 15, 24]
    ]);

    total += scale(f.cif, [
      [v => v === 0, 0], [v => v <= 5, -8], [v => v <= 10, -18], [v => v <= 15, -32]
    ]);

    total += scale(f.ltrca, [
      [v => v === 0, 4], [v => v <= 5, 12], [v => v <= 10, 24], [v => v > 10, 10]
    ]);

    total += scale(f.lia, [
      [v => v === 0, 0], [v => v <= 5, -8], [v => v <= 10, -18]
    ]);

    total += scale(f.pm, [
      [v => v <= 20, 2], [v => v <= 30, 8], [v => v <= 40, 18],
      [v => v <= 50, 32], [v => v <= 60, 50], [v => v > 60, 72]
    ]);

    total += scale(ev, [
      [v => v <= 3e6, 2], [v => v <= 5e6, 5], [v => v <= 7e6, 9],
      [v => v <= 9e6, 14], [v => v <= 11e6, 20], [v => v <= 30e6, 27],
      [v => v <= 50e6, 35], [v => v <= 100e6, 44], [v => v <= 150e6, 54],
      [v => v <= 200e6, 65], [v => v > 200e6, 77]
    ]);

    const average = total / 17;
    let payout;

    if (average < 8) payout = ev / 2.5;
    else if (average < 14) payout = ev * 1.75;
    else if (average < 18) payout = ev * 2;
    else payout = ev * 5;

    const verdict =
      average < 5 ? "Performance is severely lacking, and the professional practice falls significantly below acceptable standards. There is little or no competence demonstrated. The business shows significant weaknesses in financial health, operations, and market positioning." :
      average < 8 ? "Performance is below average and does not meet basic expectations. Improvement is necessary in several key areas. It faces challenges that require strategic changes to enhance value." :
      average < 11 ? "The professional practice meets minimum standards, but there is room for improvement in several aspects. Performance is basic and may require further training, experience or improvements in efficiency." :
      average < 14 ? "The professional practice meets most expectations and demonstrates competence in essential areas. There may still be some room for improvement in certain aspects." :
      average < 17 ? "Performance is solid and generally meets expectations. The professional practice demonstrates a good level of competence and consistency. The business exhibits strong financial health, operational efficiency, and market positioning." :
      average < 20 ? "Performance consistently exceeds expectations and demonstrates a high level of competence. There is room for minor improvements, but overall, it's impressive. " :
      average === 20 ? "The professional practice is exceptional and consistently goes beyond expectations. There are very few areas needing improvement, and the quality of work is outstanding. Performance is flawless and sets a benchmark for excellence in the field. The professional practice consistently demonstrates superior skills, knowledge, and innovation.":
      "The professional practice is outstanding and consistently exceeds expectations. It demonstrates exceptional skills, knowledge, and innovation. The business shows remarkable financial health, operational excellence, and market leadership.";
    setOutput({ ev, total, average, payout, verdict });
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">📊 Business Valuation Estimator</h1>
      <div className="row">
        {Object.keys(formData).map((key, index) => (
          <div className="col-md-4 mb-3" key={key}>
            <label className="form-label">{labelMap[key]}</label>
            <input
              type="number"
              className="form-control"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center my-4">
        <button className="btn btn-primary btn-lg px-5" onClick={calculate}>
          Estimate Valuation
        </button>
      </div>

      {output && (
        <div className="card shadow p-4 mb-4">
          <h4 className="mb-3">📈 Valuation Results</h4>
          <p><strong>Enterprise Value:</strong> ₹{output.ev.toLocaleString()}</p>
          <p><strong>Total Score:</strong> {output.total.toFixed(2)}</p>
          <p><strong>Average Score:</strong> {output.average.toFixed(2)}</p>
          <p><strong>Estimated Payout:</strong> ₹{output.payout.toLocaleString()}</p>
          <p><strong>Verdict:</strong> {output.verdict}</p>
        </div>
      )}
    </div>
  );
};

export default App;
