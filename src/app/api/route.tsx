import { NextResponse } from "next/server";
import { echartsDemo } from "../lib/renderer/test";

export const GET = async () => {
  // This is the key part - set the headers to tell the browser to download the file
  const headers = new Headers();
  // remember to change the filename here
  headers.append("Content-Type", "image/svg+xml");
  const svg = echartsDemo();
  console.log({ svg });
  // const svg = barChartDemoHorizontal();
  // const svg = semiCirclePieChartDemo();
  return new NextResponse(svg, { headers });
};
