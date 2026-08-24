import type { APIRoute } from 'astro';
import catalogData from '../data/women.json';
import { assertCatalog, listedWomen } from '../lib/catalog';

export const prerender = true;

export const GET: APIRoute = () => {
	assertCatalog(catalogData);
	const names = listedWomen(catalogData)
		.map((woman) => woman.name)
		.sort((a, b) => a.localeCompare(b));

	return new Response(`${names.join('\n')}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
