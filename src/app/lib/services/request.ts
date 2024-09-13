import { EServiceKindError } from "../common/types/EServiceKindError";
import {
  GithubErrorResponse,
  GithubExceedError,
  QueryDefaultResponse,
} from "../common/types/Request";
import { ServiceError } from "../common/types/ServiceError";

const baseURL = process.env.GITHUB_API || "https://api.github.com/graphql";

export async function requestGithubData<T = unknown>(
  query: string,
  variables: Record<string, any> = {}, // Use Record<string, any> for flexibility
  token: string
): Promise<T> {
  if (!token) throw new Error("GitHub API token is required.");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };

  const body = JSON.stringify({ query, variables });

  try {
    const response = await fetch(baseURL, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      // Check for HTTP errors
      const errorData = await response.json();
      throw new Error(`HTTP Error: ${response.status} - ${errorData.message}`);
    }

    const responseData = (await response.json()) as QueryDefaultResponse<{
      user: T;
    }>;

    // Check if the response contains the expected data
    if (responseData.data?.user) {
      return responseData.data.user;
    }

    // Handle GraphQL errors safely
    if (
      responseData.errors &&
      Array.isArray(responseData.errors) &&
      responseData.errors.length > 0
    ) {
      throw new Error(
        responseData.errors[0].message || "Unknown GraphQL Error"
      );
    }

    throw new Error("No data or errors returned in the GraphQL response.");
  } catch (error) {
    // Handle unexpected errors or GraphQL-specific errors
    throw handleError(error as GithubErrorResponse | GithubExceedError);
  }
}

function handleError(
  reponseErrors: GithubErrorResponse | GithubExceedError
): ServiceError {
  let isRateLimitExceeded = false;
  const arrayErrors = (reponseErrors as GithubErrorResponse)?.errors || [];
  const objectError = (reponseErrors as GithubExceedError) || {};

  if (Array.isArray(arrayErrors)) {
    isRateLimitExceeded = arrayErrors.some((error) =>
      error.type.includes(EServiceKindError.RATE_LIMIT)
    );
  }

  if (objectError?.message) {
    isRateLimitExceeded = objectError?.message.includes("rate limit");
  }

  if (isRateLimitExceeded) {
    throw new ServiceError("Rate limit exceeded", EServiceKindError.RATE_LIMIT);
  }

  throw new ServiceError("unknown error", EServiceKindError.NOT_FOUND);
}
