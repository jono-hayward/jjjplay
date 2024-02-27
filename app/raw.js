const config = {
  timezone: process.env.timezone,
};

const API = `https://music.abcradio.net.au/api/v1/plays/triplej/now.json?tz=${config.timezone}`;
const scrape = async () => fetch( API ).then( response => response.json() );


const playing = await scrape();

console.log( playing );