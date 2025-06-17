import { Octokit } from 'octokit';
import type { H3Event } from 'h3';

const GITHUB_API_VERSION = '2022-11-28';
const REPO_OWNER = 'Nuxtbe';
const REPO_NAME = 'nuxtbe';
const PERMISSION = 'pull';

const setupServerOctokit = (event: H3Event) => {
  const { githubToken } = useRuntimeConfig(event);

  // Return Octokit instance if already initialized in event context
  if (event.context._octokit) return event.context._octokit;

  if (!githubToken) console.warn('no token given for server service');

  const octokit = new Octokit({ auth: githubToken });

  // Store the initialized Octokit instance in the event context for future use
  event.context._octokit = octokit;

  return event.context._octokit;
};

export default function (event: H3Event) {
  const octokit = setupServerOctokit(event);

  const getGitHubUsernameByEmail = async (email: string) => {
    const searchResult = await octokit.request('GET /search/users', {
      q: email,
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    });

    if (searchResult.data.items.length === 0) {
      console.debug(`User with email ${email} not found!`);

      throw createError({
        statusCode: 404,
        statusMessage: 'User with this email not found!',
      });
    }

    console.debug(`Successfully found user by email with github username: ${searchResult.data.items[0].login}`);

    return searchResult.data.items[0].login;
  };

  const addCollaborator = async (email: string) => {
    const username = await getGitHubUsernameByEmail(email);

    const response = await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      username,
      permission: PERMISSION,
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    });

    if (response.status !== 201 && response.status !== 204) {
      console.debug('Failed to add collaborator. Response:', response);
      throw createError({
        statusCode: response.status,
        statusMessage: 'Failed to add collaborator.',
      });
    }

    console.debug(`User ${username} successfully added as collaborator.`);

    return true;
  };

  return {
    getGitHubUsernameByEmail,
    addCollaborator,
  };
}
