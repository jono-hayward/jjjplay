import 'dotenv/config';

const now = new Date();
now.setHours( now.getHours() - 8 );
now.setMinutes( now.getMinutes() - 10 );

const params = new URLSearchParams( {
  station: 'triplej',
  order: 'desc', // We want them in descending order to always get the latest, even if for some reason there's more results than our limit
  tz: 'Australia/Perth',
  limit: 20,
} );

const API = `https://music.abcradio.net.au/api/v1/plays/search.json?${params.toString()}`;
const scrape = async () => fetch( API ).then( response => response.json() );


console.log( 'Querying:' );
console.log( API );
const tracks = await scrape();
console.log( tracks.items[0] );