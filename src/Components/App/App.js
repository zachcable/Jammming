import React, { Component } from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName:'hardcode playlist name',
      playlistTracks:[]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }
  addTrack(track){
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id ===track.id)) {
      return;
    }
    else {
      this.setState(
        {
          playlistTracks:[...this.state.playlistTracks,track]
        }
      );
    }
  }
  removeTrack(track){
    let filteredArray = this.state.playlistTracks.filter(item => item.id !== track.id);
    this.setState({playlistTracks:filteredArray});
  }
  updatePlaylistName(name){
    this.setState({playlistName:name});
  }
  async savePlaylist(){
    let trackURIs=this.state.playlistTracks.map(track=> {return track.uri});
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    //this.updatePlaylistName('New Playlist');
    this.setState({playlistTracks:[], playlistName:'New Playlist'});
  }
  async search(term){
    console.log(term);
    if(term===''){
      term = 'default search';
    }
    let results = await Spotify.search(term);
    console.log(results);
    this.setState({searchResults: results});
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
/*
{
  name:'Hard Code Search Results Name 1',
  artist:'hardcode results Artist 1',
  album:'hardcode results Album 1',
  id:'hardode results id 1'
},
{
  name:'Hard Code Search Results Name 2',
  artist:'hardcode results Artist 2',
  album:'hardcode results Album 2',
  id:'hardode results id 2'
}
{
  name:'Hardcode playlist tracks name 1',
  artist:'hardcode playlist tracks artist 1',
  album:'hardcode playlist tracks album 1',
  id:'hardcode playlist tracks id 1'
},
{
  name:'Hardcode playlist tracks name 2',
  artist:'hardcode playlist tracks artist 2',
  album:'hardcode playlist tracks album 2',
  id:'hardcode playlist tracks id 2'
}
*/
