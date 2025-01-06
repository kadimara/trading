import { Octokit } from 'octokit';
import type { Trade } from './Trade';

const repo = 'trading-journal';
const path = 'trades.json';

export const getUser = async (octokit: Octokit) => {
	const { data } = await octokit.rest.users.getAuthenticated();
	return data;
};

export const getTrades = async (octokit: Octokit, login: string): Promise<Trade[]> => {
	const { data } = await octokit.rest.repos.getContent({
		mediaType: { format: 'raw' },
		owner: login,
		repo: repo,
		path: path
	});
	return JSON.parse(data as unknown as string) as Trade[];
};

export const setTrades = async (octokit: Octokit, owner: string, trades: Trade[]) => {
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
			owner,
			repo,
			path,
			message: `Trades updated`,
			content: base64Content,
			sha: file.sha // This is the file's SHA (needed for updates)
		});
		console.log('File updated successfully!');
	}
};
