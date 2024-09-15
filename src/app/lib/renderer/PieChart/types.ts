export type LegendPosition = "top" | "bottom" | "none";

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
};

export type PieChartTextSettings = {
  label: string;
  color: string;
  size: number;
};

export type PieChartLegendSettings = {
  position: LegendPosition;
  color: string;
  size: number;
};

export type PieChartSettings = {
  shape: Partial<PieChartShapeSettings>;
  monochromeColor: string;
  chartText: Partial<PieChartTextSettings>;
  legend: Partial<PieChartLegendSettings>;
};
