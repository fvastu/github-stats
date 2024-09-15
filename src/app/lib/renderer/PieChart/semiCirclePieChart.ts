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
  LEGEND_TEXT_VERTICAL_OFFSET,
  MONOCHROME_BLUE,
} from "./constants";
import { PieChartSettings, PieChartSlice } from "./types";

/**
 * Creates an SVG element for a pie chart.
 */
export const createSemiCirclePieChartSvg = (
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
  if (legend.position !== "none") height -= 2 * LEGEND_CONTAINER_HEIGHT;

  // Change offsets according to the legend position "top/bottom"
  const offsetChartWithLegend =
    legend.position === "top" ? LEGEND_CONTAINER_HEIGHT : 0;

  // Calculate vertical offset for the legend based on its position and chart type
  let offsetLegendVerticalOffset;

  if (["top", "none"].includes(legend.position ?? "none")) {
    offsetLegendVerticalOffset = 0;
  } else {
    offsetLegendVerticalOffset =
      (height + LEGEND_CONTAINER_HEIGHT) / 2 - LEGEND_TEXT_VERTICAL_OFFSET;
  }

  const offsetChartText =
    legend.position === "none" ? 0 : -2 * LEGEND_CONTAINER_HEIGHT;

  // Define tau based on whether the chart is a semi-circle
  const tau = Math.PI;
  // Generate color shades only if monochromeColor is true
  if (monochromeColor) {
    const shades = generateShades(monochromeColor, slices.length);
    slices = slices.map((s, i) => ({
      ...s,
      color: shades[i],
    }));
  }

  // create an empty svg add attach meta informations
  // create an empty svg add attach meta informations
  const svg = createSvgElement(size, size, true);

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
    isSemiCircle: true,
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
  if (chartText.label)
    addChartText(svg, size, size + offsetChartText - innerRadius, {
      label: chartText.label,
      color: chartText.color,
    });

  return getHtml();
};
