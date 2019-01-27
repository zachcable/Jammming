
let accessToken;

const clientID='c1a67728f905411ea5701033ef96484c';
const redirectURI="http://zachcablejamming.surge.sh";


let Spotify = {
  getAccessToken() {
    if(accessToken)
      return accessToken;
    else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/))
    {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

      window.setTimeout(() => accessToken = '', expiresIn*1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    }
    else
    {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
    }
  },
  async search(term){
    accessToken = Spotify.getAccessToken();
    let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}` ,
        {
          headers: {
                      Authorization:`Bearer ${accessToken}`
                   }
        });
    let jsonResponse = await response.json();
    //console.log(jsonResponse);
    let newTracks= []
    newTracks = jsonResponse.tracks.items.map(track =>(
      {
        id:track.id,
        name:track.name,
        artist:track.artists[0].name,
        album:track.album.name,
        uri:track.uri
      }
    ));
    return newTracks;
  },
  async savePlaylist(name, tracks) {
    if (!name || !tracks){
      return ''
    }
    else {
      accessToken= Spotify.getAccessToken();
      let headers = {Authorization:`Bearer ${accessToken}`};
      let userId;
      //Get user ID
      let response = await fetch(`https://api.spotify.com/v1/me`, {headers: headers});
      let jsonResponse = await response.json();
      userId=jsonResponse.id;
      //console.log(jsonResponse);
      //Make a new playlist for user and get playlistId
      let headers2 = {
        Authorization:`Bearer ${accessToken}`,
        "Content-Type":"application/json"
      }
      let response2 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists` ,
         {
           headers:headers2,
           method:'POST',
           body: JSON.stringify({
                    "name":name
                 })
         }
       )
      let jsonResponse2= await response2.json();
      let playlistId = await jsonResponse2.id;
      //console.log(jsonResponse2);

      //Add tracks to playlist
      let response3 = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers:headers2,
          method:'POST',
          body:JSON.stringify(
            {
              "uris":tracks
            }
          )
        }
      )
      return response3;
    }
  }
}

export default Spotify;
//make array of spotify uri strings
//console.log(tracks);
/*
let trackURIs= tracks.map(track=>{
  return `"spotify:track:${track}"`;
})
console.log(trackURIs);
*/
/*
accessToken = Spotify.getAccessToken();
let newTracks= fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
    {
      headers:{Authorization: `Bearer ${accessToken}`}
    }
  ).then(
    response =>
    {
      return response.json();
    }
  ).then(jsonResponse =>
    {
      if (jsonResponse) {
        //console.log(JSON.stringify(jsonResponse));
        return jsonResponse.tracks.items.map(track =>
                ({
                  id:track.id,
                  name:track.name,
                  artist:track.artists[0].name,
                  album:track.album.name,
                  uri:track.uri
                })
            );
      }
      else {
        return [];
      }
    }, networkError =>console.log(networkError.message)
  )
return newTracks;
*/
