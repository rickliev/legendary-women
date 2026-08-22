import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const widths = [480, 960];
const formats = [
	{ extension: 'avif', options: { quality: 50, effort: 4 } },
	{ extension: 'webp', options: { quality: 78, effort: 4 } },
];
const catalog = JSON.parse(await readFile('src/data/women.json', 'utf8'));
const outputDirectory = path.join('public', 'images', 'women', 'optimized');

await mkdir(outputDirectory, { recursive: true });

for (const woman of catalog) {
	const imagePath = decodeURIComponent(new URL(woman.image.url, 'https://local.invalid').pathname);
	const input = path.join('public', imagePath.replace(/^[/\\]+/, ''));

	for (const width of widths) {
		for (const format of formats) {
			const output = path.join(outputDirectory, `${woman.slug}-${width}.${format.extension}`);
			await sharp(input)
				.rotate()
				.resize({ width })
				[format.extension](format.options)
				.toFile(output);
		}
	}
}

console.log(`Generated ${catalog.length * widths.length * formats.length} optimized portraits.`);
