import { generateShades } from "../../colors";
import { validatePositiveValue } from "../../validators";
import {
  addArcs,
  addChartText,
  addLegend,
  createSvgElement,
  getHtml,
} from "./chart-utils";
import {
  DEFAULT_SHAPE_SETTINGS,
  LEGEND_CONTAINER_HEIGHT,
  MONOCHROME_BLUE,
} from "./constants";
import { PieChartSettings, PieChartSlice } from "./types";

const offsetChartTextMap: Record<string, number> = {
  none: 0,
  top: -LEGEND_CONTAINER_HEIGHT,
  bottom: LEGEND_CONTAINER_HEIGHT,
};

/**
 * Creates an SVG element for a pie chart.
 */
export const createPieChartSvg = (
  slices: PieChartSlice[],
  settings: Partial<PieChartSettings>
): string => {
  const {
    shape = {},
    chartText = {},
    legend = {},
    monochromeColor = MONOCHROME_BLUE,
  } = settings;

  const {
    cornerRadius = DEFAULT_SHAPE_SETTINGS.cornerRadius,
    gap = DEFAULT_SHAPE_SETTINGS.gap,
    innerRadius = DEFAULT_SHAPE_SETTINGS.innerRadius,
    size = DEFAULT_SHAPE_SETTINGS.size,
  } = shape;

  let height = size;
  const width = size;

  // TODO: Validate settings using Yup or similar
  validatePositiveValue(innerRadius, "Inner Radius");
  validatePositiveValue(size, "Size");
  validatePositiveValue(gap, "Gap");
  validatePositiveValue(cornerRadius, "Corner Radius");

  // Adjust height if legend is present (in every case - bottom or top)
  if (legend.position !== "none") height -= LEGEND_CONTAINER_HEIGHT;

  // Change offsets according to the legend position "top/bottom"
  const offsetChartWithLegend =
    legend.position === "top" ? LEGEND_CONTAINER_HEIGHT : 0;

  // Define vertical offset values based on legend position
  const offsetLegendVerticalOffsetMap: Record<string, number> = {
    top: 0,
    none: 0,
    default: height + offsetChartWithLegend,
  };

  // Determine the vertical offset for the legend
  const offsetLegendVerticalOffset =
    offsetLegendVerticalOffsetMap[legend.position ?? "default"];

  const offsetChartText =
    offsetChartTextMap[legend.position ?? "none"] ?? LEGEND_CONTAINER_HEIGHT;

  // Define tau based on whether the chart is a semi-circle
  const tau = 2 * Math.PI;

  // Generate color shades only if monochromeColor is true
  if (monochromeColor) {
    const shades = generateShades(monochromeColor, slices.length);
    slices = slices.map((s, i) => ({
      ...s,
      color: shades[i],
    }));
  }

  // create an empty svg add attach meta informations
  const svg = createSvgElement(size, size, false);

  // center the position of the chart
  const chart = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width / 2}, ${height / 2 + offsetChartWithLegend})`
    );

  // Add arcs and add the background
  addArcs(chart, slices, {
    tau,
    gap,
    innerRadius,
    outerRadius: height / 2,
    cornerRadius,
    isSemiCircle: false,
    size,
  });

  // Add legend if requested
  if (legend.position !== "none")
    addLegend({
      svg,
      slices,
      textColor: "black",
      verticalOffset: offsetLegendVerticalOffset,
    });

  // add the chart label (only center atm)
  addChartText(svg, size, size - offsetChartText, {
    label: chartText.label,
    color: chartText.color,
  });

  return getHtml();
};
