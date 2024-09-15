import * as d3 from "d3";
import { JSDOM } from "jsdom";
import { generateShades } from "../../colors";
import { D3G, D3SVG } from "../../common/types";
import { validatePositiveValue } from "../../validators";
import {
  DEFAULT_SHAPE_SETTINGS,
  DEFAULT_TEXT_SETTINGS,
  LEGEND_CONTAINER_HEIGHT,
  LEGEND_ITEM_CIRCLE_RADIUS,
  LEGEND_ITEM_PADDING,
  LEGEND_PADDING,
  LEGEND_TEXT_VERTICAL_OFFSET,
  MONOCHROME_BLUE,
} from "./constants";
import { PieChartSettings, PieChartSlice } from "./types";

/**
 * Adds a label to the center of the SVG element.
 */
const addChartLabel = (
  svg: D3SVG,
  width: number,
  height: number,
  textSettings: PieChartSettings["chartText"]
) => {
  const {
    label = DEFAULT_TEXT_SETTINGS.label,
    color = DEFAULT_TEXT_SETTINGS.color,
    size = DEFAULT_TEXT_SETTINGS.size,
  } = textSettings;

  svg
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", `${size}px`)
    .attr("fill", color)
    .text(label);
};

/**
 * Creates pie chart slices and appends them to the group element.
 */
const addArcs = (
  g: D3G,
  slices: PieChartSlice[],
  arcSettings: {
    tau: number;
    gap: number;
    innerRadius: number;
    outerRadius: number;
    cornerRadius: number;
    isSemiCircle: boolean;
    size: number;
  }
) => {
  const {
    tau,
    gap,
    innerRadius,
    outerRadius,
    cornerRadius,
    isSemiCircle,
    size,
  } = arcSettings;

  slices.forEach(({ startAngle, endAngle, color, label }, index) => {
    const createArc = (startAngle: number, endAngle: number) => {
      return d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .cornerRadius(cornerRadius);
    };

    const semiCircleCorrection = isSemiCircle ? 0.5 * tau : 0;
    const arcStart = startAngle * tau + gap - semiCircleCorrection;
    const arcEnd = endAngle * tau + gap - semiCircleCorrection;
    const semiCircleEndAngle = tau / (isSemiCircle ? 2 : 1);

    const backgroundArc = createArc(
      startAngle * tau - semiCircleCorrection,
      semiCircleEndAngle
    );

    g.append("path")
      .datum({ endAngle: tau })
      .style("fill", "#ddd")
      // @ts-ignore
      .attr("d", backgroundArc);

    const foregroundArc = createArc(arcStart, arcEnd);
    g.append("path")
      .datum({ endAngle: arcEnd })
      .style("fill", color)
      // @ts-ignore
      .attr("d", foregroundArc);

    if (!label) return;

    const labelArc = createArc(arcStart, arcEnd);

    g.append("text")
      .attr("x", (d: any) => labelArc.centroid(d)[0])
      .attr("y", (d: any) => labelArc.centroid(d)[1])
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", "#FFF")
      .style("opacity", 1)
      .style("font-size", `${(20 * size) / 1000}px`)
      .text(label);
  });
};

/**
 * Computes the x-position for each legend item based on its index.
 */
const computeLegendItemPosition = (
  labels: string[],
  index: number,
  fontSize: number = 12,
  fontFamily: string = "Arial"
): number => {
  if (index === 0) return 0;

  const previousLabels = labels.slice(0, index);

  // Create a canvas for measuring text width
  const canvas: HTMLCanvasElement = dom.window.document.createElement("canvas");
  const context: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  // Set font properties
  context.font = `${fontSize}px ${fontFamily}`;

  return previousLabels.reduce((acc: number, label: string) => {
    // Measure the width of the text
    const textWidth = context.measureText(label).width;

    // Add padding and circle radius
    const adjustedWidth = textWidth * 1.2; // Adjustment factor
    return (
      acc + 2 * LEGEND_ITEM_CIRCLE_RADIUS + adjustedWidth + LEGEND_ITEM_PADDING
    );
  }, 0);
};

/**
 * Adds a legend to the SVG element.
 */
const addLegend = (svg: D3SVG, slices: PieChartSlice[], color: string) => {
  const labels = slices.map(({ label }) => label);

  // Create a group element for the legend
  const legendGroup = svg.append("g").attr("class", "legend-group");

  const legendItems = legendGroup
    .selectAll(".legend-item")
    .data(labels)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("fill", function (_, i) {
      return slices[i].color;
    })
    .attr("transform", function (_, i) {
      const xOffset =
        computeLegendItemPosition(labels as string[], i) + LEGEND_PADDING;
      return `translate(${xOffset}, ${LEGEND_TEXT_VERTICAL_OFFSET})`;
    });

  // Append legend circles
  legendItems.append("circle").attr("r", LEGEND_ITEM_CIRCLE_RADIUS);

  // Append legend text
  legendItems
    .append("text")
    .attr("x", LEGEND_TEXT_VERTICAL_OFFSET)
    .attr("y", LEGEND_TEXT_VERTICAL_OFFSET - LEGEND_ITEM_CIRCLE_RADIUS)
    .attr("fill", color)
    .text((d) => d ?? "");
};

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
const body = d3.select(dom.window.document.querySelector("body"));

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
    monochrome = MONOCHROME_BLUE,
  } = settings;

  const {
    cornerRadius = DEFAULT_SHAPE_SETTINGS.cornerRadius,
    gap = DEFAULT_SHAPE_SETTINGS.gap,
    innerRadius = DEFAULT_SHAPE_SETTINGS.innerRadius,
    isSemiCircle = DEFAULT_SHAPE_SETTINGS.isSemiCircle,
    size = DEFAULT_SHAPE_SETTINGS.size,
  } = shape;

  let height = size;
  const width = size;

  // TODO: Validate settings using Yup or similar
  validatePositiveValue(innerRadius, "Inner Radius");
  validatePositiveValue(size, "Size");
  validatePositiveValue(gap, "Gap");
  validatePositiveValue(cornerRadius, "Corner Radius");

  // Adjust height if legend is present
  if (legend?.position) height -= LEGEND_CONTAINER_HEIGHT;

  // Define tau based on whether the chart is a semi-circle
  const tau = isSemiCircle ? Math.PI : 2 * Math.PI;

  // Generate color shades only if monochrome is true
  if (monochrome) {
    const shades = generateShades(monochrome, slices.length);

    slices = slices.map((s, i) => ({
      ...s,
      color: shades[i],
    }));
  }

  const svg = body
    .append("svg")
    .attr("viewBox", `0 0 ${size} ${size}`)
    .attr("xmlns", "http://www.w3.org/2000/svg");

  const chartGroup = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width / 2}, ${height / 2 + LEGEND_CONTAINER_HEIGHT})`
    );

  // Add arcs and add the background
  addArcs(chartGroup, slices, {
    tau,
    gap,
    innerRadius,
    outerRadius: height / 2,
    cornerRadius,
    isSemiCircle,
    size,
  });

  // Add legend
  addLegend(svg, slices, "black");

  // add the chart label (only center atm)
  addChartLabel(svg, size, size + LEGEND_CONTAINER_HEIGHT, {
    label: chartText.label,
    color: chartText.color,
    size: chartText.size,
  });

  return body.html();
};
