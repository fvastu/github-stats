export const queryUserActivity = `
  query userInfo($username: String!) {
    user(login: $username) {
    id
      login
      name
      avatarUrl
      bio
      company
      location
      email
      twitterUsername
      websiteUrl
      status {
        createdAt
        emoji
        message
      }
      createdAt
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        totalPullRequestReviewContributions
      }
      organizations(first: 1) {
        totalCount
      }
      following {
        totalCount
      }
      anyPinnableItems
      pinnedItems(first: 6) {
        totalCount
        nodes {
          ... on Gist {
            name
          }
          ... on Repository {
            name
          }
        }
      }
      sponsoring {
        totalCount
      }
      sponsors {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      publicKeys(first: 5) {
        totalCount
        nodes {
          key
        }
      }
    }
  }
`;

export const queryUserIssue = `
  query userInfo($username: String!) {
    user(login: $username) {
      openIssues: issues(states: OPEN) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
    }
  }
`;

export const queryUserPullRequest = `
  query userInfo($username: String!) {
    user(login: $username) {
      pullRequests(first: 1) {
        totalCount
      }
    }
  }
`;

export const queryUserRepository = `
  query userInfo($username: String!) {
    user(login: $username) {
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
        totalCount
        nodes {
          languages(first: 3, orderBy: {direction:DESC, field: SIZE}) {
            nodes {
              name
            }
          }
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`;
