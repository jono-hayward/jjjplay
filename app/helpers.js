import SpotifyWebApi from 'spotify-web-api-node';
import YouTubeMusicAPI from 'youtube-music-api';

export const parse = song => {
  const result = {
    started: song.played_time,
    title: song.recording.title,
    artist: song.recording.artists[0].name,
    album: song.release.title
  };

  if ( song.recording.releases[0].artwork ) {
    if (song.recording.releases[0].artwork[0].sizes ) {

      let largest = null;

      for ( const img of song.recording.releases[0].artwork[0].sizes ) {
        if ( img.aspect_ratio === '1x1' && img.width <= 800 &&  ( !largest || img.width > largest.width ) ) {
          largest = img;
        }
      }
      if ( largest ) {
        result.artwork = largest.url;
      }
    } else {
      result.artwork = song.recording.releases[0].artwork[0].url;
    }
  }
  
  return result;
};

const sanitise_song = song => song
  .replace( 'ft. ', '' );
  
const sanitise_artist = artist => artist
  .replace( ' x ', '' )
  .replace( ' X ', '' )
  .replace( ' + ', '' )
  .replace( ' & ', '' );

export const searchAppleMusic = async song => {

  const base = 'https://itunes.apple.com/search';

  const p = {
    limit: 1,
    country: 'AU',
    media: 'music',
    entity: 'musicTrack',
    term: `${sanitise_song( song.title )} ${sanitise_artist( song.artist )}`,
  }

  const params = new URLSearchParams( p );

  const url = `${base}?${params.toString()}`;

  const response = await fetch( url );
  const results = await response.json();

  if ( results.resultCount ) {
    return results.results[0].trackViewUrl;
  }

  return false;
};

export const searchSpotify = async song => {

  var spotifyApi = new SpotifyWebApi({
    clientId: process.env.spotify_client,
    clientSecret: process.env.spotify_secret,
  });
  
  // Retrieve an access token.
  await spotifyApi.clientCredentialsGrant().then(
    data => spotifyApi.setAccessToken(data.body['access_token']),
    err  => console.log('Something went wrong when retrieving an access token', err)
  );

  const result = await spotifyApi.searchTracks( `track:${sanitise_song( song.title )} artist:${sanitise_artist( song.artist )}`, {
    limit: 1,
    country: 'AU',
    type: 'track',
  } );
  
  if ( result.body.tracks && result.body.tracks.total ) {
    return result.body.tracks.items[0].external_urls.spotify;
  }
  
  return false;
};

export const searchYouTube = async song => {

  const yt = new YouTubeMusicAPI();
  await yt.initalize();

  const result = await yt.search( `${sanitise_song( song.title )} ${sanitise_artist( song.artist )}`, 'song' );

  if ( result.content ) {
    return `https://music.youtube.com/watch?v=${result.content[0].videoId}`;
  }

};