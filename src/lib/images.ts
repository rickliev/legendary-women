export type PortraitFormat = 'avif' | 'webp';

const portraitWidths = [480, 960] as const;

export function portraitSrcSet(slug: string, format: PortraitFormat): string {
	return portraitWidths
		.map((width) => `/images/women/optimized/${slug}-${width}.${format} ${width}w`)
		.join(', ');
}
