import type { APIRoute } from 'astro';
import catalogData from '../data/women.json';
import { assertCatalog, categorySlug, listedWomen } from '../lib/catalog';

export const prerender = true;

const escapeXml = (value: string): string => value
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
	if (!site) throw new Error('Astro site URL is required to generate sitemap.xml.');

	assertCatalog(catalogData);
	const women = listedWomen(catalogData);
	const categories = [...new Set(women.flatMap((woman) => woman.categories))];
	const paths = [
		'/',
		'/catalog/',
		'/about/',
		...categories.map((category) => `/categories/${categorySlug(category)}/`),
		...women.map((woman) => `/women/${woman.slug}/`),
	];
	const urls = paths
		.map((path) => `\t<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`)
		.join('\n');

	return new Response([
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		urls,
		'</urlset>',
		'',
	].join('\n'), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
