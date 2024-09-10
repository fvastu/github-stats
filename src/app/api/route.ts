import { NextResponse } from "next/server";
import { GithubRepositoryService } from "../lib/repository/GithubRepository";
import { GithubApiService } from "../lib/services/GithubApiService";

const serviceProvider = new GithubApiService();
const client = new GithubRepositoryService(serviceProvider).repository;
const username = "fvastu";

export const GET = async () => {
  const userResponseInfo = await client.requestUserInfo(username);
  return NextResponse.json(userResponseInfo);
};
