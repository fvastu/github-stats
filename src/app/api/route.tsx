import { NextResponse } from "next/server";
import { pieChartDemo } from "../lib/renderer/PieChart";

export const GET = async () => {
  // This is the key part - set the headers to tell the browser to download the file
  const headers = new Headers();

  // remember to change the filename here
  headers.append("Content-Type", "image/svg+xml");

  //const svg = barChartDemoVertical();
  const svg = pieChartDemo();
  return new NextResponse(svg, { headers });
};
