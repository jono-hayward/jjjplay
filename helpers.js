export const parse = song => ({
  started: song.played_time,
  title: song.recording.title,
  artist: song.recording.artists[0].name,
  album: song.release.title,
  artwork: song.release.artwork[0].sizes[3].url || ''
});


export const clockEmoji = (timezone, time) => {
  
  const options = { timeZone: timezone };
  const timeString = new Date(time).toLocaleTimeString('en-AU', options);
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