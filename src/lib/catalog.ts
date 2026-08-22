import type { Category, Woman } from '../types';

export function listedWomen(women: Woman[]): Woman[] {
	return women.filter((woman) => !woman.hidden);
}

export function categorySlug(category: Category): string {
	return category
		.toLowerCase()
		.replace(/&/g, 'and')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

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
		if (!candidate.slug || !candidate.name || !candidate.summary || !(candidate.wikipediaUrl || candidate.profileUrl) || !candidate.image?.url) {
			throw new Error('Every catalog record requires a slug, name, summary, profile URL, and image.');
		}
		if (!candidate.categories?.length || !candidate.accomplishments?.length || !candidate.sources?.length) {
			throw new Error(`Catalog record "${candidate.slug}" is missing categories, accomplishments, or sources.`);
		}
		if (candidate.hidden !== undefined && typeof candidate.hidden !== 'boolean') {
			throw new Error(`Catalog record "${candidate.slug}" has an invalid hidden value.`);
		}
		if (slugs.has(candidate.slug)) {
			throw new Error(`Duplicate catalog slug: "${candidate.slug}".`);
		}
		slugs.add(candidate.slug);
	}
}
