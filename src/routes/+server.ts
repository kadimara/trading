import { json } from '@sveltejs/kit';
import * as fs from 'fs';
import trades from '$lib/data/trades.json';

export const POST = async ({ request, cookies }) => {
	const { trades } = await request.json();
	fs.writeFileSync('./src/lib/data/trades.json', JSON.stringify(trades));
	return json({ trades }, { status: 201 });
};
