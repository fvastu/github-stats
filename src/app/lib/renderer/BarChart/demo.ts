import { createBarChartSvg } from "./barChart";
import { BarChartDirection, BarChartSettingsType } from "./types";

const barChartData = [
  { value: 80, color: "orange", label: "C#" },
  { value: 120, color: "red", label: "Javascript" },
  { value: 60, color: "blue", label: "CSS" },
  { value: 150, color: "green", label: "Python" },
  { value: 90, color: "purple", label: "Java" },
];

const configVertical: Partial<BarChartSettingsType> = {
  shape: {
    direction: "vertical" as BarChartDirection,
    barWidth: 50,
    gap: 10,
    width: 1000,
    height: 500,
  },
  chartText: {
    label: "Programming Languages - Vertical",
    color: "black",
    size: 24,
  },
};

const configHorizontal: Partial<BarChartSettingsType> = {
  shape: {
    direction: "horizontal" as BarChartDirection,
    barWidth: 30,
    gap: 15,
    width: 1000,
    height: 400,
    labelPosition: "start",
  },
  chartText: {
    label: "Programming Languages - Horizontal",
    color: "black",
    size: 24,
  },
};

export const barChartDemoVertical = (): string => {
  return createBarChartSvg(barChartData, configVertical);
};

export const barChartDemoHorizontal = (): string => {
  return createBarChartSvg(barChartData, configHorizontal);
};
