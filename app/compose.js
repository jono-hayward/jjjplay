import {
    searchAppleMusic,
    searchGenius,
    searchSpotify,
    searchYouTube,
    clockEmoji,
    addFacet,
} from "./helpers.js";


/**
 * Compose the bluesky post based on a song
 * @param {*} song 
 */
export const compose = async ( song, config, db ) => {

    const timeOptions = {
        timeStyle: 'short',
        timeZone: config.timezone,
    };

    const lines = [];
    
    // Begin our bluesky post
    const postObject = {
        langs: ['en-AU', 'en'],
        createdAt: song.started.toISOString(),
        facets: [],
    };

    // Used during Hottest 100
    // if ( song.count ) {
	  //   console.log('Track count found!');
    //   lines.push( `🥁 2024 Hottest 200 - #${song.count}`, `` );
    // } else {
	  //   console.log('No track count found :(');
    // }
    
    lines.push(
        `#NowPlaying`,
        `${clockEmoji( config.timezone, song.started )} ${song.started.toLocaleTimeString( 'en-AU', timeOptions )}`,
        ``,
        `🎵 ${song.title}`,
        `🧑‍🎤 ${song.artist}`,  
    );
    
    // If the album and the song title are the same it's usually a single, and it looks weird
    if ( song.album && song.album !== song.title ) {
        lines.push( `💿 ${song.album}` );
    }

    song.unearthed && lines.push(
        ``,
        `🌱 Triple J Unearthed`,
    );

    // Search the music streaming services for our song
    const streamingLinks = [];
    console.log( '🔍 Searching streaming services...' );
    
    const appleMusic = await searchAppleMusic( song );
    appleMusic && streamingLinks.push({
        service: 'Apple Music',
        url: appleMusic,
    }) && console.log( '✅ Found song on Apple Music' );
    
    const spotify = await searchSpotify( song );
    spotify && streamingLinks.push({
        service: 'Spotify',
        url: spotify,
    }) && console.log( '✅ Found song on Spotify' );
    
    const yt = await searchYouTube( song );
    yt && streamingLinks.push({
        service: 'YouTube Music',
        url: yt,
    }) && console.log( '✅ Found song on YouTube Music' );
    
    // Add found streaming services to the post
    streamingLinks.length && lines.push(
        ``,
        `🎧 ${streamingLinks.map( service => service.service ).join(' / ')}`
    );

    // Look for lyrics
    const genius = await searchGenius( song );
    genius && lines.push(
        ``,
        `📝 Lyrics`,
    ) && console.log( '✅ Found lyrics on Genius' );
    
    
    // Put the post together
    postObject.text = lines.join('\n');

    addFacet( postObject, 'tag', '#NowPlaying', '#NowPlaying' );

    if (db) {
        // Search for the artist in our bluesky links file
        console.log( '🦋 Searching for saved Bluesky profiles...' );
        
        const lookup = await db.hGetAll(`artist:${song.artist_entity}`);
        if (Object.keys(lookup).length) {
            console.log( '✅ Bluesky profile found, adding mention to post.' );
            addFacet( postObject, 'mention', song.artist, lookup.did );
        }
    }
    
    // Add the link facets to the post
    for ( const stream of streamingLinks ) {
        addFacet( postObject, 'link', stream.service, stream.url );
    }

    // Add unearthed link
    song.unearthed && addFacet( postObject, 'link', 'Triple J Unearthed', song.unearthed );

    // Add Genius link
    genius && addFacet( postObject, 'link', 'Lyrics', genius );

    return postObject;
}
