import { PieChartShapeSettings, PieChartTextSettings } from "./types";

// Default color for monochrome charts
export const MONOCHROME_BLUE = "#3498db";

// Default size for the chart
export const DEFAULT_SIZE = 1000;

// Legend item styles
export const LEGEND_ITEM_CIRCLE_RADIUS = 8;
export const LEGEND_ITEM_PADDING = 20;
export const LEGEND_TEXT_VERTICAL_OFFSET = 13;
export const LEGEND_CONTAINER_HEIGHT = 50;

// Padding to account for the legend's impact on chart size
export const LEGEND_PADDING =
  LEGEND_CONTAINER_HEIGHT + LEGEND_ITEM_CIRCLE_RADIUS;

export const DEFAULT_TEXT_SETTINGS: PieChartTextSettings = {
  label: "",
  color: "black",
  size: (12 * DEFAULT_SIZE) / 100,
};

export const DEFAULT_SHAPE_SETTINGS: PieChartShapeSettings = {
  isSemiCircle: false,
  cornerRadius: 0,
  gap: 0,
  size: DEFAULT_SIZE,
  innerRadius: (DEFAULT_SIZE / 2 - 10) * 0.75,
};
