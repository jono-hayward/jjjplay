import { searchAppleMusic, searchSpotify, searchYouTube } from "./helpers.js";

const search = {
  title: 'The Trouble With Us',
  artist: 'Marcus Marr & Chet Faker'
};

console.table([
  {
    'Service': 'Apple Music',
    'Result': await searchAppleMusic( search, true )
  },
  {
    'Service': 'Spotify',
    'Result': await searchSpotify( search, true )
  },
  {
    'Service': 'YouTube Music',
    'Result': await searchYouTube( search, true )
  }
]);