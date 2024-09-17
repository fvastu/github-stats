export type BarChartDataType = {
  value: number;
  color: string;
  label?: string;
};

export type BarChartDirection = "horizontal" | "vertical";

export type BarChartLabelPosition = "start" | "center" | "end";

export type BarChartSettingsShapeType = {
  gap: number;
  width: number;
  height: number;
  barWidth: number;
  direction: BarChartDirection;
  cornerRadius: number;
  labelPosition: BarChartLabelPosition;
  labelColor: string;
};

export type BarChartSettingsChartTextType = {
  label: string;
  color: string;
  size: number;
};

export type BarChartSettingsLegendType = {
  position: "start" | "center" | "end";
};

export type BarChartSettingsType = {
  shape: Partial<BarChartSettingsShapeType>;
  chartText: Partial<BarChartSettingsChartTextType>;
  legend: Partial<BarChartSettingsLegendType>;
  monochromeColor: string;
};
