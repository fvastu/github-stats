import { BarChartDirection, BarChartSettingsShapeType } from "./types";

export const MONOCHROME_BLUE = "#3498db";
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = DEFAULT_WIDTH / 2;
export const DEFAULT_CHART_TEXT = {
  label: "",
  color: "black",
  size: (14 * DEFAULT_WIDTH) / 1000,
};

export const DEFAULT_SETTINGS_BAR_CHART: BarChartSettingsShapeType = {
  gap: 10,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  barWidth: 50,
  direction: "vertical" as BarChartDirection,
  cornerRadius: 5,
  labelPosition: "center",
  labelColor: "#FFF",
};
