import fs from 'fs';

export const lookup = (entity) => {
    const artist_file = fs.readFileSync('artists.json', 'utf8');
    
	if (artist_file) {
		const artists = JSON.parse(artist_file);
        if (entity in artists) {
            return artists[entity];
        }
	}
    
    return false;
}