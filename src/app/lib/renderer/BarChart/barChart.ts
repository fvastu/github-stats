import * as d3 from "d3";
import { generateShades } from "../../colors";
const { JSDOM } = require("jsdom");

const MONOCHROME_BLUE = "#3498db";
const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = DEFAULT_WIDTH / 2;

type BarChartDataType = {
  value: number;
  color: string;
  label?: string;
};

type BarChartDirection = "horizontal" | "vertical";

type BarChartSettingsShapeType = {
  gap: number;
  width: number;
  height: number;
  barWidth: number;
  direction: BarChartDirection;
  cornerRadius: number;
};

type BarChartSettingsChartTextType = {
  label: string;
  color: string;
  size: number;
};

type BarChartSettingsType = {
  shape: Partial<BarChartSettingsShapeType>;
  monochrome: string;
  chartText: Partial<BarChartSettingsChartTextType>;
};

const DEFAULT_CHART_TEXT = {
  label: "",
  color: "black",
  size: `${(14 * DEFAULT_WIDTH) / 1000}px`,
};

const DEFAULT_SHAPE = {
  gap: 10,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  barWidth: 50,
  direction: "vertical" as BarChartDirection,
  cornerRadius: 5,
};

// Function to generate bars
const generateBars = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  values: Array<BarChartDataType>,
  direction: BarChartDirection,
  barWidth: number,
  gap: number,
  width: number,
  height: number,
  barHeightScale: d3.ScaleLinear<number, number>,
  monochromeShades: string[],
  cornerRadius: number
) => {
  values.forEach(({ value, color, label }, index) => {
    const position = index * (barWidth + gap);
    const barSize = barHeightScale(value);

    const barColor = monochromeShades.length
      ? monochromeShades[monochromeShades.length - 1 - index]
      : color;

    if (direction === "vertical") {
      // Vertical bars
      g.append("rect")
        .attr("x", position)
        .attr("y", height - barSize)
        .attr("width", barWidth)
        .attr("height", barSize)
        .attr("rx", cornerRadius)
        .attr("fill", barColor);

      if (label) {
        g.append("text")
          .attr("x", position + barWidth / 2)
          .attr("y", height - barSize - 5)
          .attr("text-anchor", "middle")
          .style("fill", "#000")
          .style("font-size", `${(12 * width) / 1000}px`)
          .text(label);
      }
    } else {
      // Horizontal bars
      g.append("rect")
        .attr("x", 0)
        .attr("y", position)
        .attr("width", barSize)
        .attr("height", barWidth)
        .attr("rx", cornerRadius)
        .attr("fill", barColor);

      if (label) {
        g.append("text")
          .attr("x", barSize + 5)
          .attr("y", position + barWidth / 2)
          .attr("text-anchor", "start")
          .style("fill", "#000")
          .style("font-size", `${(12 * width) / 1000}px`)
          .attr("alignment-baseline", "middle")
          .text(label);
      }
    }
  });
};

export const createBarChartSvg = (
  values: Array<BarChartDataType>,
  config: Partial<BarChartSettingsType>
): string => {
  const { shape = {}, chartText = {}, monochrome } = config;

  const {
    gap = DEFAULT_SHAPE["gap"],
    width = DEFAULT_SHAPE["width"],
    height = DEFAULT_SHAPE["height"],
    barWidth = DEFAULT_SHAPE["barWidth"],
    direction = DEFAULT_SHAPE["direction"],
    cornerRadius = DEFAULT_SHAPE["cornerRadius"],
  } = shape;

  const {
    label = DEFAULT_CHART_TEXT["label"],
    color = DEFAULT_CHART_TEXT["color"],
    size = DEFAULT_CHART_TEXT["size"],
  } = chartText;

  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);

  const body: d3.Selection<HTMLBodyElement, unknown, null, undefined> =
    d3.select(dom.window.document.querySelector("body"));

  // Create the SVG container and set the viewbox
  const svg = body
    .append<SVGSVGElement>("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("xmlns", "http://www.w3.org/2000/svg");

  // Title of the chart
  svg
    .append("text")
    .attr("transform", `translate(${width / 2}, ${30})`)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", `${size}px`)
    .attr("fill", color)
    .text(label);

  const g = svg.append("g").attr("transform", `translate(0, 50)`);

  // Create scale based on direction
  const barSizeScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (d) => d.value) || 1])
    .range(direction === "vertical" ? [0, height - 50] : [0, width - 100]);

  // Generate monochrome shades if needed
  const monochromeShades = monochrome
    ? generateShades(monochrome, values.length)
    : [];

  // Call the function to generate bars
  generateBars(
    g,
    values,
    direction,
    barWidth,
    gap,
    width,
    height,
    barSizeScale,
    monochromeShades,
    cornerRadius
  );

  return body.html();
};

// Example usage:

const barChartData = [
  { value: 80, color: "orange", label: "C#" },
  { value: 120, color: "red", label: "Javascript" },
  { value: 60, color: "blue", label: "CSS" },
  { value: 150, color: "green", label: "Python" },
  { value: 90, color: "purple", label: "Java" },
];

// Configuration for the vertical bar chart
const configVertical = {
  shape: {
    direction: "vertical" as BarChartDirection,
    barWidth: 50,
    gap: 10,
    width: 1000,
    height: 500,
  },
  monochrome: "#3498db",
  chartText: {
    label: "Programming Languages - Vertical",
    color: "black",
    size: 24,
  },
};

// Configuration for the horizontal bar chart
const configHorizontal = {
  shape: {
    direction: "horizontal" as BarChartDirection,
    barWidth: 30,
    gap: 15,
    width: 1000,
    height: 400,
  },
  monochrome: "#e74c3c",
  chartText: {
    label: "Programming Languages - Horizontal",
    color: "black",
    size: 24,
  },
};

// Generate SVG for vertical chart
export const barChartDemoVertical = (): string => {
  return createBarChartSvg(barChartData, configVertical);
};

export const barChartDemoHorizontal = (): string => {
  return createBarChartSvg(barChartData, configHorizontal);
};
