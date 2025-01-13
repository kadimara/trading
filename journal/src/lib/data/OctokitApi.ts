import type { Octokit } from 'octokit';
import type { Trade } from './Trade';

const repo = 'trading';
const path = 'trades.json';

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
				mediaType: { format: 'raw' },
				owner: owner || '',
				repo: repo,
				path: path
			});
			return JSON.parse(data as unknown as string) as Trade[];
		} catch (error) {
			console.error('An error occurred while fetching trades:', error);
			return [];
		}
	}

	public static async setTrades(octokit: Octokit, owner: string, trades: Trade[]) {
		try {
			const { data } = await octokit.rest.repos.getContent({
				owner: owner,
				repo: repo,
				path: path
			});
			// Check if it's an array (directory) or a single file
			const file = Array.isArray(data) ? data[0] : data;
			if ('sha' in file) {
				const base64Content = btoa(JSON.stringify(trades));
				await octokit.rest.repos.createOrUpdateFileContents({
					owner: owner,
					repo: repo,
					path: path,
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
