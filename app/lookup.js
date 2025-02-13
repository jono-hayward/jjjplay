import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const lookup = (entity) => {
    const artist_file = fs.readFileSync(path.join(__dirname, '../artists.json'), 'utf8');

    if (artist_file) {
        const artists = JSON.parse(artist_file);
        if (entity in artists) {
            return artists[entity];
        }
    }

    return false;
};