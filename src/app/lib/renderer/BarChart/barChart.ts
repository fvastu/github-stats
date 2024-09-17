import * as d3 from "d3";
import { JSDOM } from "jsdom";
import { generateShades } from "../../colors";
import { D3G, D3SVG } from "../../common/types";
import { DEFAULT_CHART_TEXT, DEFAULT_SETTINGS_BAR_CHART } from "./constants";
import {
  BarChartDataType,
  BarChartLabelPosition,
  BarChartSettingsChartTextType,
  BarChartSettingsType,
} from "./types";

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
const body = d3.select(dom.window.document.querySelector("body"));

export const getHtml = () => body.html();

const addChartText = (
  svg: D3SVG,
  width: number,
  height: number,
  textSettings: Partial<BarChartSettingsChartTextType>
) => {
  const {
    label = DEFAULT_CHART_TEXT.label,
    color = DEFAULT_CHART_TEXT.color,
    size = DEFAULT_CHART_TEXT.size,
  } = textSettings;

  svg
    .append("text")
    .attr("transform", `translate(${width / 2}, ${30})`)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", `${size}px`)
    .attr("fill", color)
    .text(label);
};

const createSvgElement = (width: number, height: number) => {
  return body
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("xmlns", "http://www.w3.org/2000/svg");
};

const generateBarsVertical = ({
  g,
  values,
  barWidth,
  gap,
  width,
  height,
  barHeightScale,
  monochromeShades,
  cornerRadius,
  labelPosition,
  labelColor,
}: {
  g: D3G;
  values: Array<BarChartDataType>;
  barWidth: number;
  gap: number;
  width: number;
  height: number;
  barHeightScale: d3.ScaleLinear<number, number>;
  monochromeShades: string[];
  cornerRadius: number;
  labelPosition: BarChartLabelPosition;
  labelColor: string;
}) => {
  values.forEach(({ value, color, label }, index) => {
    const position = index * (barWidth + gap);
    const barSize = barHeightScale(value);
    const barColor = monochromeShades.length
      ? monochromeShades[monochromeShades.length - 1 - index]
      : color;

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
  });
};

const generateBarsHorizontal = ({
  g,
  values,
  barWidth,
  gap,
  width,
  height,
  barHeightScale,
  monochromeShades,
  cornerRadius,
  labelPosition,
  labelColor,
}: {
  g: D3G;
  values: Array<BarChartDataType>;
  barWidth: number;
  gap: number;
  width: number;
  height: number;
  barHeightScale: d3.ScaleLinear<number, number>;
  monochromeShades: string[];
  cornerRadius: number;
  labelPosition: BarChartLabelPosition;
  labelColor: string;
}) => {
  values.forEach(({ value, color, label }, index) => {
    const position = index * (barWidth + gap);
    const barSize = barHeightScale(value);
    const barColor = monochromeShades.length
      ? monochromeShades[monochromeShades.length - 1 - index]
      : color;

    g.append("rect")
      .attr("x", 0)
      .attr("y", position)
      .attr("width", barSize)
      .attr("height", barWidth)
      .attr("rx", cornerRadius)
      .attr("fill", barColor);

    if (label) {
      const xLabelPositionMap = {
        start: 5, // just a small offset
        center: barSize / 2,
        end: barSize,
      };
      g.append("text")
        .attr("x", xLabelPositionMap[labelPosition])
        .attr("y", position + barWidth / 2)
        .attr("text-anchor", "start")
        .style("fill", labelColor)
        .style("font-size", `${(12 * width) / 1000}px`)
        .attr("alignment-baseline", "middle")
        .text(label);
    }
  });
};

export const createBarChartSvg = (
  values: Array<BarChartDataType>,
  config: Partial<BarChartSettingsType>
): string => {
  const { shape = {}, chartText = {}, legend = {}, monochromeColor } = config;

  const {
    gap = DEFAULT_SETTINGS_BAR_CHART.gap,
    width = DEFAULT_SETTINGS_BAR_CHART.width,
    height = DEFAULT_SETTINGS_BAR_CHART.height,
    barWidth = DEFAULT_SETTINGS_BAR_CHART.barWidth,
    direction = DEFAULT_SETTINGS_BAR_CHART.direction,
    cornerRadius = DEFAULT_SETTINGS_BAR_CHART.cornerRadius,
    labelPosition = DEFAULT_SETTINGS_BAR_CHART.labelPosition,
    labelColor = DEFAULT_SETTINGS_BAR_CHART.labelColor,
  } = shape;

  const {
    label = DEFAULT_CHART_TEXT.label,
    color = DEFAULT_CHART_TEXT.color,
    size = DEFAULT_CHART_TEXT.size,
  } = chartText;

  const svg = createSvgElement(width, height);
  addChartText(svg, width, height, { label, color, size });

  const g = svg.append("g").attr("transform", `translate(0, 50)`);

  const barSizeScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (d) => d.value) || 1])
    .range(direction === "vertical" ? [0, height - 50] : [0, width - 100]);

  const monochromeShades = monochromeColor
    ? generateShades(monochromeColor, values.length)
    : [];

  if (direction === "vertical") {
    generateBarsVertical({
      g,
      values,
      barWidth,
      gap,
      width,
      height,
      barHeightScale: barSizeScale,
      monochromeShades,
      cornerRadius,
      labelPosition,
      labelColor,
    });
  } else {
    generateBarsHorizontal({
      g,
      values,
      barWidth,
      gap,
      width,
      height,
      barHeightScale: barSizeScale,
      monochromeShades,
      cornerRadius,
      labelPosition,
      labelColor,
    });
  }

  return getHtml();
};
