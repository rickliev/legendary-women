import type { ApplicationInsights } from '@microsoft/applicationinsights-web';

export type FavoriteEvent = 'favorite_added' | 'favorite_removed';
export type FavoriteSource = 'catalog' | 'profile';

let appInsightsPromise: Promise<ApplicationInsights | undefined> | undefined;

function getAppInsights(): Promise<ApplicationInsights | undefined> {
	if (appInsightsPromise) return appInsightsPromise;
	const connectionString = import.meta.env.PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING;
	appInsightsPromise = (async () => {
		if (!import.meta.env.PROD || !connectionString) return undefined;

		const { ApplicationInsights } = await import('@microsoft/applicationinsights-web');
		const instance = new ApplicationInsights({
			config: {
				connectionString,
				disableAjaxTracking: true,
				disableFetchTracking: true,
				enableAutoRouteTracking: false,
				enableUnhandledPromiseRejectionTracking: true,
			},
		});
		instance.loadAppInsights();
		return instance;
	})();
	return appInsightsPromise;
}

export function trackPageView(): void {
	void getAppInsights().then((appInsights) => {
		appInsights?.trackPageView({
			name: document.title,
			uri: `${window.location.origin}${window.location.pathname}`,
		});
	});
}

export function trackFavorite(event: FavoriteEvent, slug: string, source: FavoriteSource): void {
	void getAppInsights().then((appInsights) => {
		appInsights?.trackEvent(
			{ name: event },
			{ woman_slug: slug, source },
		);
	});
}
