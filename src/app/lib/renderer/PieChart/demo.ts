import { createPieChartSvg } from "./pieChart";
import { PieChartSlice } from "./types";

// ====== Example usage ===== //
const exampleSlices: PieChartSlice[] = [
  { startAngle: 0, endAngle: 0.127, color: "orange", label: "C#" },
  { startAngle: 0.127, endAngle: 0.357, color: "red", label: "JavaScript" },
  { startAngle: 0.357, endAngle: 0.6, color: "blue", label: "CSS" },
  { startAngle: 0.6, endAngle: 0.8, color: "green", label: "Python" },
  { startAngle: 0.8, endAngle: 0.9, color: "purple", label: "Java" },
];

export const pieChartDemo = (): string => {
  return createPieChartSvg(exampleSlices, {
    shape: {
      cornerRadius: 0,
      size: 800,
      innerRadius: 0,
      isSemiCircle: false,
    },
    chartText: {
      label: "Example Pie Chart",
    },
    legend: {
      position: "top",
      size: 12,
    },
  });
};
