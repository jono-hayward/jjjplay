import 'dotenv/config';

const config = {
  station:        process.env.STATION,
  timezone:       process.env.TIMEZONE,
};

const now = new Date('2025-02-10T09:30:00+11:00');

const params = new URLSearchParams( {
  station: config.station,
  order: 'asc', // We want them in descending order to always get the latest, even if for some reason there's more results than our limit
  tz: config.timezone,
  limit: 200,
  from: now.toISOString().replace('Z', '+00:00:00'),
} );

const API = `https://music.abcradio.net.au/api/v1/plays/search.json?${params.toString()}`;
const scrape = async () => fetch( API ).then( response => response.json() );


console.log( 'Querying:' );
console.log( API );
const tracks = await scrape();
console.log( JSON.stringify(tracks.items, null, 2) );

/*
const params = new URLSearchParams({
  station: config.station,
  tz: config.timezone,
  from: latest.toISOString().replace('Z', '+00:00:00'), // Turn the ISO string into something the ABC API will accept
  limit: 20,
  order: 'desc', // We want them in descending order to always get the latest, even if for some reason there's more results than our limit
});

const API = `https://music.abcradio.net.au/api/v1/plays/search.json?${params.toString()}`;

const scrape = async () => fetch(API).then(response => response.json());
const tracks = await scrape();
*/
