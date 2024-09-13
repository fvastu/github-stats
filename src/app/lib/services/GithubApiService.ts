import { Logger } from "../common/Logger";
import { Retry } from "../common/Retry";
import { EServiceKindError, ServiceError } from "../common/types";
import {
  GitHubUserActivity,
  GitHubUserIssue,
  GitHubUserPullRequest,
  GitHubUserRepository,
  UserInfo,
} from "../common/types/userInfo";
import { GithubRepository } from "../repository/GithubRepository";
import {
  queryUserActivity,
  queryUserIssue,
  queryUserPullRequest,
  queryUserRepository,
} from "../schemas";
import { requestGithubData } from "./request";

// Need to be here - Exporting from another file makes array of null
export const TOKENS = [
  process.env.GITHUB_ACCESS_TOKEN as string,
  process.env.GITHUB_ACCESS_TOKEN2 as string,
];

export class GithubApiService extends GithubRepository {
  async requestUserRepository(
    username: string
  ): Promise<GitHubUserRepository | ServiceError> {
    return await this.executeQuery<GitHubUserRepository>(queryUserRepository, {
      username,
    });
  }
  async requestUserActivity(
    username: string
  ): Promise<GitHubUserActivity | ServiceError> {
    return await this.executeQuery<GitHubUserActivity>(queryUserActivity, {
      username,
    });
  }
  async requestUserIssue(
    username: string
  ): Promise<GitHubUserIssue | ServiceError> {
    return await this.executeQuery<GitHubUserIssue>(queryUserIssue, {
      username,
    });
  }
  async requestUserPullRequest(
    username: string
  ): Promise<GitHubUserPullRequest | ServiceError> {
    return await this.executeQuery<GitHubUserPullRequest>(
      queryUserPullRequest,
      { username }
    );
  }
  async requestUserInfo(username: string): Promise<UserInfo | ServiceError> {
    // Avoid to call others if one of them is null
    const repository = await this.requestUserRepository(username);

    if (repository instanceof ServiceError) {
      Logger.error(repository);
      return repository;
    }

    const promises = Promise.allSettled([
      this.requestUserActivity(username),
      this.requestUserIssue(username),
      this.requestUserPullRequest(username),
    ]);
    const [activity, issue, pullRequest] = await promises;
    const status = [activity.status, issue.status, pullRequest.status];

    if (status.includes("rejected")) {
      Logger.error(`Can not find a user with username:' ${username}'`);
      return new ServiceError("Not found", EServiceKindError.NOT_FOUND);
    }

    return new UserInfo(
      (activity as PromiseFulfilledResult<GitHubUserActivity>).value,
      (issue as PromiseFulfilledResult<GitHubUserIssue>).value,
      (pullRequest as PromiseFulfilledResult<GitHubUserPullRequest>).value,
      repository
    );
  }
  async executeQuery<T = unknown>(
    query: string,
    variables: { [key: string]: string }
  ) {
    try {
      const retry = new Retry(
        TOKENS.length,
        3 // CONSTANTS.DEFAULT_GITHUB_RETRY_DELAY
      );
      return await retry.fetch<Promise<T>>(async ({ attempt }) => {
        return await requestGithubData(query, variables, TOKENS[attempt]);
      });
    } catch (error: any) {
      if (error.cause instanceof ServiceError) {
        Logger.error(error.cause.message);
        return error.cause;
      }
      if (error instanceof Error && error.cause) {
        Logger.error(JSON.stringify(error.cause, null, 2));
      } else {
        Logger.error(error);
      }
      return new ServiceError("not found", EServiceKindError.NOT_FOUND);
    }
  }
}
