import type { Woman } from '../types';

export function assertCatalog(value: unknown): asserts value is Woman[] {
	if (!Array.isArray(value) || value.length === 0) {
		throw new Error('The women catalog must contain at least one record.');
	}

	const slugs = new Set<string>();

	for (const entry of value) {
		if (!entry || typeof entry !== 'object') {
			throw new Error('Every catalog record must be an object.');
		}

		const candidate = entry as Partial<Woman>;
		if (!candidate.slug || !candidate.name || !candidate.summary || !candidate.wikipediaUrl || !candidate.image?.url) {
			throw new Error('Every catalog record requires a slug, name, summary, Wikipedia URL, and image.');
		}
		if (!candidate.categories?.length || !candidate.accomplishments?.length || !candidate.sources?.length) {
			throw new Error(`Catalog record "${candidate.slug}" is missing categories, accomplishments, or sources.`);
		}
		if (slugs.has(candidate.slug)) {
			throw new Error(`Duplicate catalog slug: "${candidate.slug}".`);
		}
		slugs.add(candidate.slug);
	}
}
