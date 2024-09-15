export type PieChartSlice = {
  startAngle: number;
  endAngle: number;
  color: string;
  label?: string;
};

export type PieChartShapeSettings = {
  cornerRadius: number;
  gap: number;
  size: number;
  innerRadius: number;
  isSemiCircle: boolean;
};

export type PieChartTextSettings = {
  label: string;
  color: string;
  size: number;
};

export type PieChartLegendSettings = {
  position: "top" | "bottom";
  color: string;
  size: number;
};

export type PieChartSettings = {
  shape: Partial<PieChartShapeSettings>;
  monochrome: string;
  chartText: Partial<PieChartTextSettings>;
  legend: Partial<PieChartLegendSettings>;
};
