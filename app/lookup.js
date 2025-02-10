import fs from 'fs';
import path from 'path';

const artist_file = fs.readFileSync('artists.json', 'utf8');

if (artist_file) {
	const artists = JSON.parse(artist_file);
	console.log(artists);
}

process.exit(0);
