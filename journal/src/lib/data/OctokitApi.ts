import type { Octokit } from 'octokit';
import type { Trade } from './Trade';

const repo = 'trading';
const path = 'trades.json';
const branch = 'database_dev';

export class OctokitApi {
	public static async getUser(octokit: Octokit) {
		try {
			const { data } = await octokit.rest.users.getAuthenticated();
			console.log('Token is valid. Authenticated as:', data.login);
			return data;
		} catch (error) {
			console.error('An error occurred:', error);
			return null;
		}
	}

	public static async getTrades(octokit: Octokit, owner: string | undefined): Promise<Trade[]> {
		try {
			const { data } = await octokit.rest.repos.getContent({
				owner: owner || '',
				repo: repo,
				path: path,
				ref: branch,
				// Cache disabled
				// https://github.com/octokit/octokit.js/issues/890
				headers: {
					'If-None-Match': ''
				}
			});

			if ('content' in data) {
				return JSON.parse(atob(data.content)) as Trade[];
			}
			return [];
		} catch (error) {
			console.error('An error occurred while fetching trades:', error);
			return [];
		}
	}

	public static async setTrades(octokit: Octokit, owner: string, trades: Trade[]) {
		try {
			const { data } = await octokit.rest.repos.getContent({
				owner: owner || '',
				repo: repo,
				path: path,
				ref: branch
			});
			// Check if it's an array (directory) or a single file
			const file = Array.isArray(data) ? data[0] : data;
			if ('sha' in file) {
				const base64Content = btoa(JSON.stringify(trades));
				await octokit.rest.repos.createOrUpdateFileContents({
					owner: owner,
					repo: repo,
					path: path,
					branch: branch,
					message: `Trades synced`,
					content: base64Content,
					sha: file.sha // This is the file's SHA (needed for updates)
				});

				console.log('File updated successfully!');
				return true;
			}
		} catch (error) {
			console.error('An error occurred while setting trades:', error);
		}
		return false;
	}
}
