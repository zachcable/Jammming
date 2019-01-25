
let accessToken;

const clientID='c1a67728f905411ea5701033ef96484c';
const redirectURI="http://localhost:3000/";


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
  search(term){
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
  }
}

export default Spotify;
