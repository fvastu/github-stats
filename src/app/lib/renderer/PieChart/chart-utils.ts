import * as d3 from "d3";
import { JSDOM } from "jsdom";
import { D3G, D3SVG } from "../../common/types";
import {
  DEFAULT_TEXT_SETTINGS,
  LEGEND_ITEM_CIRCLE_RADIUS,
  LEGEND_ITEM_PADDING,
  LEGEND_PADDING,
  LEGEND_TEXT_VERTICAL_OFFSET,
} from "./constants";
import { PieChartSettings, PieChartSlice } from "./types";

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
const body = d3.select(dom.window.document.querySelector("body"));

export const getHtml = () => body.html();

// Helper function to add chart label
export const addChartText = (
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

// Helper function to create the SVG element
export const createSvgElement = (
  size: number,
  height: number,
  isSemiCircle: boolean
) => {
  const svg = body
    .append("svg")
    .attr("viewBox", `0 0 ${size} ${isSemiCircle ? size / 2 : height}`)
    .attr("xmlns", "http://www.w3.org/2000/svg");

  return svg;
};

export const addArcs = (
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
  const { tau, gap, innerRadius, outerRadius, cornerRadius, isSemiCircle } =
    arcSettings;

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
      .style("font-size", `${Math.min(5000 / innerRadius, 35)}px`)
      .text(label);
  });
};

export const addLegend = ({
  svg,
  slices,
  textColor,
  verticalOffset,
}: {
  svg: D3SVG;
  slices: PieChartSlice[];
  textColor: string;
  verticalOffset: number;
}) => {
  const labels = slices.map(({ label }) => label ?? "");

  const legendGroup = svg.append("g").attr("class", "legend-group");

  const legendItems = legendGroup
    .selectAll(".legend-item")
    .data(labels)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("fill", (_, i) => slices[i].color)
    .attr("transform", function (_, i) {
      const xOffset = computeLegendItemPosition(labels, i) + LEGEND_PADDING;
      return `translate(${xOffset}, ${LEGEND_TEXT_VERTICAL_OFFSET + verticalOffset})`;
    });

  legendItems.append("circle").attr("r", LEGEND_ITEM_CIRCLE_RADIUS);

  legendItems
    .append("text")
    .attr("text-anchor", "start")
    .attr("x", LEGEND_ITEM_CIRCLE_RADIUS + 5)
    .attr("y", LEGEND_ITEM_CIRCLE_RADIUS / 2)
    .attr("fill", textColor)
    .text((d) => d);
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
