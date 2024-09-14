import * as d3 from "d3";
import { generateShades } from "../colors";
const { JSDOM } = require("jsdom");

const MONOCHROME_BLUE = "#3498db";
const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = DEFAULT_WIDTH / 2;

type PieChartDataType = {
  startAngle: number;
  endAngle: number;
  color: string;
  label?: string;
};

type PieChartSettingsShapeType = {
  cornerRadius: number;
  gap: number;
  width: number;
  height: number;
  innerRadius: number;
  outerRadius: number;
  isSemiCircle: boolean;
};

type PieChartSettingsChartTextType = {
  label: string;
  color: string;
  size: number;
};

type PieChartSettingsType = {
  shape: Partial<PieChartSettingsShapeType>;
  monochrome: string;
  chartText: Partial<PieChartSettingsChartTextType>;
};

const DEFAULT_CHART_TEXT: PieChartSettingsChartTextType = {
  label: "",
  color: "black",
  size: (14 * DEFAULT_WIDTH) / 1000,
};

const DEFAULT_SHAPE: PieChartSettingsShapeType = {
  isSemiCircle: false,
  cornerRadius: 0,
  gap: 0,
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  outerRadius: DEFAULT_HEIGHT / 2 - 10,
  innerRadius: (DEFAULT_HEIGHT / 2 - 10) * 0.75,
};

const createPieChartSvg = (
  values: PieChartDataType[],
  config: Partial<PieChartSettingsType>
): string => {
  const { shape = {}, chartText = {}, monochrome = MONOCHROME_BLUE } = config;

  const {
    cornerRadius = DEFAULT_SHAPE["cornerRadius"],
    gap = DEFAULT_SHAPE["gap"],
    width = DEFAULT_SHAPE["width"],
    height = DEFAULT_SHAPE["height"],
    innerRadius = DEFAULT_SHAPE["innerRadius"],
    outerRadius = DEFAULT_SHAPE["outerRadius"],
    isSemiCircle = DEFAULT_SHAPE["isSemiCircle"],
  } = shape;

  const {
    label = DEFAULT_CHART_TEXT["label"],
    color = DEFAULT_CHART_TEXT["color"],
    size = DEFAULT_CHART_TEXT["size"],
  } = chartText;

  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  const body = d3.select(dom.window.document.querySelector("body"));

  const tau = isSemiCircle ? Math.PI : 2 * Math.PI;

  const svg = body
    .append("svg")
    .attr("viewBox", [0, 0, width, height].toString())
    .attr("xmlns", "http://www.w3.org/2000/svg");

  svg
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", `${size}px`)
    .attr("fill", color)
    .text(label);

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const createArc = (startAngle: number, endAngle: number) => {
    return d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(cornerRadius || 0);
  };

  const monochromeShades = monochrome
    ? generateShades(monochrome, values.length)
    : [];

  values.forEach(({ startAngle, endAngle, color, label }, index) => {
    const colorArc = monochrome
      ? monochromeShades[monochromeShades.length - 1 - index]
      : color;
    const semiCircleCorrection = isSemiCircle ? 0.5 * tau : 0;
    const arcStart = startAngle * tau + gap - semiCircleCorrection;
    const arcEnd = endAngle * tau + gap - semiCircleCorrection;

    const backgroundArc = createArc(
      startAngle * tau - semiCircleCorrection,
      tau / (isSemiCircle ? 2 : 1)
    );
    g.append("path")
      .datum({ endAngle: tau })
      .style("fill", "#ddd")
      // @ts-ignore
      .attr("d", backgroundArc);

    const foregroundArc = createArc(arcStart, arcEnd);
    g.append("path")
      .datum({ endAngle: arcEnd })
      .style("fill", colorArc)
      // @ts-ignore
      .attr("d", foregroundArc);

    if (!label) return;

    const labelArc = createArc(arcStart, arcEnd);

    g.append("text")
      .attr("x", function (d: any) {
        return labelArc.centroid(d)[0];
      })
      .attr("y", function (d: any) {
        return labelArc.centroid(d)[1];
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", "#FFF")
      .style("font-size", `${(14 * width) / 1000}px`)
      .text(label);
  });

  return body.html();
};

const arcsDataDefault: PieChartDataType[] = [
  { startAngle: 0, endAngle: 0.127, color: "orange", label: "C#" },
  { startAngle: 0.127, endAngle: 0.357, color: "red", label: "Javascript" },
  { startAngle: 0.357, endAngle: 0.6, color: "blue", label: "CSS" },
  { startAngle: 0.6, endAngle: 0.8, color: "green", label: "Python" },
  { startAngle: 0.8, endAngle: 0.9, color: "purple", label: "Java" },
];

export const pieChartDemo = (): string => {
  return createPieChartSvg(arcsDataDefault, {
    shape: {
      cornerRadius: 0,
      innerRadius: 80,
      width: 1000,
      isSemiCircle: false,
    },
    chartText: {
      label: "Hey",
    },
  });
};
