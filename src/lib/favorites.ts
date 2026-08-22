import { trackFavorite, type FavoriteSource } from './analytics';

const favoritesKey = 'legendary-women:favorites';

export function getFavorites(): Set<string> {
	try {
		return new Set(JSON.parse(localStorage.getItem(favoritesKey) || '[]'));
	} catch {
		return new Set();
	}
}

export function toggleFavorite(slug: string, source: FavoriteSource): Set<string> {
	const favorites = getFavorites();
	const removing = favorites.has(slug);
	removing ? favorites.delete(slug) : favorites.add(slug);
	localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
	trackFavorite(removing ? 'favorite_removed' : 'favorite_added', slug, source);
	return favorites;
}

export function updateFavoriteButton(button: HTMLButtonElement, favorites: Set<string>): void {
	const slug = button.dataset.favorite;
	if (!slug) return;

	const selected = favorites.has(slug);
	const name = button.dataset.favoriteName || 'this profile';
	button.setAttribute('aria-pressed', String(selected));
	button.setAttribute('aria-label', `${selected ? 'Remove' : 'Add'} ${name} ${selected ? 'from' : 'to'} favorites`);
	const icon = button.querySelector('span');
	if (icon) icon.textContent = selected ? '♥' : '♡';
}
