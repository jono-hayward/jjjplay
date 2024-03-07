import 'dotenv/config';

import SpotifyWebApi from 'spotify-web-api-node';
import YouTubeMusicAPI from 'youtube-music-api';

export const parse = song => {
  const { played_time, recording, release } = song;
  const { title: recordingTitle, artists, artwork, releases } = recording || {};
  
  if (played_time && recordingTitle && artists) {
    const result = {
      started: new Date( played_time ),
      title: recordingTitle,
      artist: artists[0]?.name,
      album: release?.title || ''
    };

    if ( artists[0].links && artists[0].links.length ) {
      const link = artists[0].links[0];
      if ( link.service_id === 'unearthed' ) {
        result.unearthed = link.url;
      }
    }
  
    const artworkSource = artwork?.[0] || (releases?.[0]?.artwork?.[0] && releases[0].artwork[0]);
    if (artworkSource) {
      result.artwork = getImg(artworkSource);
    }

    return result;
  } else {
    console.error( '⚠️ Failed to parse song', song );
  }
  return false;
};



const getImg = art => {
  
  if ( art.sizes && art.sizes.length ) {

    let largest;

    for ( const img of art.sizes ) {
      largest = ( img.aspect_ratio === '1x1' && img.width <= 1000 ) ? img.url : largest;
    }

    return largest;

  } else if ( art.url ) {

    return art.url;

  }

  return false;

}

const findByteRange = (largerString, substring) => {
  const encoder = new TextEncoder();
  const largerStringBytes = encoder.encode( largerString );
  const substringBytes = encoder.encode( substring );

  let start = -1;
  let end = -1;
  let currentIndex = 0;

  for ( let i = 0; i < largerStringBytes.length; i++ ) {
    if ( largerStringBytes[i] === substringBytes[currentIndex] ) {
      if ( currentIndex === 0 ) {
        start = i;
      }
      currentIndex++;
      if ( currentIndex === substringBytes.length ) {
        end = i + 1;
        break;
      }
    } else if ( currentIndex > 0 ) {
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

  const params = new URLSearchParams( {
    limit: 1,
    country: 'AU',
    media: 'music',
    entity: 'musicTrack',
    term: `${sanitise_song( song.title )} ${song.artist}`,
  } );

  const url = `${base}?${params.toString()}`;

  const response = await fetch( url );
  if ( response.ok ) {
    
    const results = await response.json();
    if ( results.resultCount ) {
      return results.results[0].trackViewUrl;
    }
    
    debug && console.log( 'Raw Apple Music results', results );
    
  } else {
    console.error( '⚠️ Failed to search Apple music', response );
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
  
  if ( result && result.body && result.body.tracks && result.body.tracks.total ) {
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

  if ( result && result.content ) {
    return `https://music.youtube.com/watch?v=${result.content[0].videoId}`;
  }

  return false;

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

  return emojiMap[currentTime] || '🕜';
}


export const addLink = ( postObject, label, url ) => {

  const { start, end } = findByteRange( postObject.text, label );

  if ( start && end ) {
    postObject.facets.push({
      index: {
        byteStart: start,
        byteEnd: end
      },
      features: [{
        $type: 'app.bsky.richtext.facet#link',
        uri: url
      }]
    });
    return true;
  }

  return false;
}

export const getTZDiff = ( targetTZ ) => {

  const systemTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get the current time in milliseconds for both time zones
  const now1 = new Date().toLocaleString ('en-AU', { timeZone: systemTZ } );
  const now2 = new Date().toLocaleString ('en-AU', { timeZone: targetTZ } );

  // Calculate the time difference in milliseconds
  const diff = new Date(now2) - new Date(now1);

  // Return difference in minutes
  return Math.floor( diff / ( 1000 * 60 ) );
}