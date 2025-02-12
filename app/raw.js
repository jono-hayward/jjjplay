import 'dotenv/config';

const config = {
  station:        process.env.STATION,
  timezone:       process.env.TIMEZONE,
};

const now = new Date('2025-02-12T03:14:00+11:00');
// now.setHours( now.getHours() - 8 );
// now.setMinutes( now.getMinutes() - 10 );

console.log(now.toISOString());

// process.exit(0);

const params = new URLSearchParams( {
  station: config.station,
  order: 'asc', // We want them in descending order to always get the latest, even if for some reason there's more results than our limit
  tz: config.timezone,
  limit: 1,
  from: now.toISOString().replace('Z', '+00:00:00'), // Turn the ISO string into something the ABC API will accept
} );

const API = `https://music.abcradio.net.au/api/v1/plays/search.json?${params.toString()}`;
const scrape = async () => fetch( API ).then( response => response.json() );


console.log( 'Querying:' );
console.log( API );
const tracks = await scrape();
console.log( tracks.items[0] );
console.log( tracks.items[0].recording?.artists[0] );