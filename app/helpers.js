import 'dotenv/config';

import SpotifyWebApi from 'spotify-web-api-node';
import YouTubeMusicAPI from 'youtube-music-api';

export const parse = song => {

  const result = {
    started: song.played_time,
    title: song.recording.title,
    artist: song.recording.artists[0].name,
    album: song.release.title
  };

  if ( song.recording.artwork.length ) {
    result.artwork = getImg( song.recording.artwork[0] )
  } else if ( song.recording.releases.length && song.recording.releases[0].artwork.length ) {
    result.artwork = getImg( song.recording.releases[0].artwork[0] )
  }
  
  return result;

};


const getImg = art => {
  
  if ( art.sizes.length ) {

    let largest = null;

    for ( const img of art.sizes ) {
      if ( img.aspect_ratio === '1x1' && img.width <= 800 &&  ( !largest || img.width > largest.width ) ) {
        largest = img.url;
      }
    }

    return largest;

  } else if ( art.url ) {

    return art.url;

  }

  return false;

}

export const findByteRange = (largerString, substring) => {
  const encoder = new TextEncoder();
  const largerStringBytes = encoder.encode(largerString);
  const substringBytes = encoder.encode(substring);

  let start = -1;
  let end = -1;
  let currentIndex = 0;

  for (let i = 0; i < largerStringBytes.length; i++) {
    if (largerStringBytes[i] === substringBytes[currentIndex]) {
      if (currentIndex === 0) {
        start = i;
      }
      currentIndex++;
      if (currentIndex === substringBytes.length) {
        end = i + 1;
        break;
      }
    } else if (currentIndex > 0) {
      // If substring match was broken, reset currentIndex
      currentIndex = 0;
    }
  }

  return { start, end };
}

const sanitise_song = song => song
  .replace( 'ft. ', '' );

export const searchAppleMusic = async (song, debug=false) => {

  const base = 'https://itunes.apple.com/search';

  const p = {
    limit: 1,
    country: 'AU',
    media: 'music',
    entity: 'musicTrack',
    term: `${sanitise_song( song.title )} ${song.artist}`,
  }

  const params = new URLSearchParams( p );

  const url = `${base}?${params.toString()}`;

  const response = await fetch( url );
  const results = await response.json();
  
  debug && console.log( 'Raw Apple Music results', results );

  if ( results.resultCount ) {
    return results.results[0].trackViewUrl;
  }

  return false;
};

export const searchSpotify = async (song, debug=false) => {

  var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT,
    clientSecret: process.env.SPOTIFY_SECRET,
  });
  
  // Retrieve an access token.
  await spotifyApi.clientCredentialsGrant().then(
    data => spotifyApi.setAccessToken(data.body['access_token']),
    err  => console.log('Something went wrong when retrieving an access token', err)
  );

  const result = await spotifyApi.searchTracks( `track:${sanitise_song( song.title )} artist:${song.artist}`, {
    limit: 1,
    country: 'AU',
    type: 'track',
  } );
  
  debug && console.log( 'Raw Spotify results', result );
  
  if ( result.body.tracks && result.body.tracks.total ) {
    return result.body.tracks.items[0].external_urls.spotify;
  }
  
  return false;
};

export const searchYouTube = async (song, debug=false) => {

  const yt = new YouTubeMusicAPI();
  await yt.initalize();
  yt.ytcfg.VISITOR_DATA = '';

  const result = await yt.search( `${sanitise_song( song.title )} ${song.artist}`, 'song' );
  
  debug && console.log( 'Raw YouTube Music results', result );

  if ( result.content ) {
    return `https://music.youtube.com/watch?v=${result.content[0].videoId}`;
  }

};

export const clockEmoji = (timezone, time) => {
  
  const options = { timeZone: timezone };
  const timeString = new Date( time ).toLocaleTimeString('en-AU', options);
  const [hours, minutes] = timeString.split(':');
  const closestHalfHour = Math.floor((minutes / 60) * 2) / 2;
  const currentTime = parseInt(hours) + closestHalfHour;
    
  const emojiMap = {
    0: "🕛",
    0.5: "🕧",
    1: "🕐",
    1.5: "🕜",
    2: "🕑",
    2.5: "🕝",
    3: "🕒",
    3.5: "🕞",
    4: "🕓",
    4.5: "🕟",
    5: "🕔",
    5.5: "🕠",
    6: "🕕",
    6.5: "🕡",
    7: "🕖",
    7.5: "🕢",
    8: "🕗",
    8.5: "🕣",
    9: "🕘",
    9.5: "🕤",
    10: "🕙",
    10.5: "🕥",
    11: "🕚",
    11.5: "🕦",
    12: "🕛"
  };

  return emojiMap[currentTime];
}