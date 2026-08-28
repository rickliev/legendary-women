import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const width = 1200;
const height = 630;
const outputDirectory = path.join('public', 'images', 'social');

const asDataUri = async (filePath) => {
	const contents = await readFile(filePath);
	return `data:image/png;base64,${contents.toString('base64')}`;
};

const render = async (name, markup) => {
	await sharp(Buffer.from(markup))
		.flatten({ background: '#3b123c' })
		.jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
		.toFile(path.join(outputDirectory, `${name}.jpg`));
};

await mkdir(outputDirectory, { recursive: true });

const fullLogo = await asDataUri(path.join('public', 'brand', 'legend_logo.png'));
const emblem = await asDataUri(path.join('public', 'brand', 'legend_small.png'));

await render('home', `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
	<defs>
		<linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#18091f"/>
			<stop offset=".58" stop-color="#3b123c"/>
			<stop offset="1" stop-color="#23102d"/>
		</linearGradient>
		<radialGradient id="glow">
			<stop offset="0" stop-color="#d5a84b" stop-opacity=".28"/>
			<stop offset="1" stop-color="#d5a84b" stop-opacity="0"/>
		</radialGradient>
	</defs>
	<rect width="1200" height="630" fill="url(#background)"/>
	<circle cx="1015" cy="40" r="360" fill="url(#glow)"/>
	<circle cx="1040" cy="530" r="225" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="2"/>
	<circle cx="1040" cy="530" r="150" fill="none" stroke="#ffffff" stroke-opacity=".06" stroke-width="2"/>
	<path d="M80 102h90" stroke="#d5a84b" stroke-width="4"/>
	<text x="80" y="155" fill="#e5bc68" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4">LEAGUE OF LEGENDARY WOMEN</text>
	<text x="76" y="270" fill="#fffdf9" font-family="Georgia, serif" font-size="82">Bold minds.</text>
	<text x="76" y="363" fill="#e5bc68" font-family="Georgia, serif" font-size="82" font-style="italic">Brave lives.</text>
	<text x="82" y="438" fill="#ffffff" fill-opacity=".75" font-family="Arial, sans-serif" font-size="28">Stories of influential women who changed the world.</text>
	<image href="${fullLogo}" x="785" y="145" width="350" height="274"/>
	<text x="82" y="548" fill="#ffffff" fill-opacity=".55" font-family="Arial, sans-serif" font-size="22" letter-spacing="2">WOMEN.APPXPERT.NET</text>
</svg>`);

await render('catalog', `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
	<defs>
		<linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#210a28"/>
			<stop offset="1" stop-color="#4a1646"/>
		</linearGradient>
		<radialGradient id="glow">
			<stop offset="0" stop-color="#d5a84b" stop-opacity=".24"/>
			<stop offset="1" stop-color="#d5a84b" stop-opacity="0"/>
		</radialGradient>
	</defs>
	<rect width="1200" height="630" fill="#fbf7f0"/>
	<rect x="0" y="0" width="1200" height="630" fill="url(#panel)"/>
	<circle cx="1050" cy="115" r="350" fill="url(#glow)"/>
	<rect x="65" y="65" width="1070" height="500" rx="28" fill="#ffffff" fill-opacity=".045" stroke="#ffffff" stroke-opacity=".12" stroke-width="2"/>
	<text x="110" y="152" fill="#e5bc68" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="5">THE CATALOG</text>
	<text x="106" y="274" fill="#fffdf9" font-family="Georgia, serif" font-size="80">Every story.</text>
	<text x="106" y="367" fill="#e5bc68" font-family="Georgia, serif" font-size="80" font-style="italic">One remarkable catalog.</text>
	<text x="112" y="438" fill="#ffffff" fill-opacity=".72" font-family="Arial, sans-serif" font-size="27">Explore women in science, civil rights, politics, arts, sports, and more.</text>
	<image href="${emblem}" x="895" y="88" width="220" height="184" opacity=".94"/>
	<text x="112" y="516" fill="#ffffff" fill-opacity=".52" font-family="Arial, sans-serif" font-size="21" letter-spacing="2">LEAGUE OF LEGENDARY WOMEN</text>
</svg>`);

console.log(`Generated 2 social preview images at ${width}x${height}.`);
