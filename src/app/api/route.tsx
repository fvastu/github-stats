import { NextResponse } from "next/server";
import { barChartDemoVertical } from "../lib/renderer/barChart";
import { GithubApiService } from "../lib/services/GithubApiService";
const serviceProvider = new GithubApiService();

export const GET = async () => {
  // This is the key part - set the headers to tell the browser to download the file
  const headers = new Headers();
  // remember to change the filename here
  headers.append("Content-Type", "image/svg+xml");
  const svg = barChartDemoVertical();
  return new NextResponse(svg, { headers });

  // Return the SVG element.
  // const user = await client.requestUserInfo(username);
  // if (!(user instanceof ServiceError)) {
  //   const { totalFollowers } = user;
  //   const element = userEngagementRenderer({ totalFollowers });
  //   return new ImageResponse(element);
  // }
  // return NextResponse.json({});
};
