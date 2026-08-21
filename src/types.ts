export type Category =
	| 'Arts & Literature'
	| 'Aviation & Exploration'
	| 'Business & Philanthropy'
	| 'Civil Rights'
	| 'Education & Advocacy'
	| 'Environment'
	| 'Healthcare'
	| 'Politics & Law'
	| 'Science & Technology'
	| 'Sports';

export interface LifeDate {
	date: string | null;
	display: string;
}

export interface Quote {
	text: string;
	source: string;
}

export interface Source {
	label: string;
	url: string | null;
}

export interface Woman {
	slug: string;
	name: string;
	fullName: string;
	hidden?: boolean;
	showLifeDates?: boolean;
	born: LifeDate;
	died: LifeDate | null;
	categories: Category[];
	summary: string;
	bio: string;
	accomplishments: string[];
	quote?: Quote | null;
	quotes?: Quote[];
	wikipediaUrl?: string;
	profileUrl?: string;
	profileLabel?: string;
	image: {
		url: string;
		alt: string;
		credit: string;
		license: string;
		source: string;
	};
	sources: Source[];
}
