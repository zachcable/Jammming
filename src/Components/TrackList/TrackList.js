import React, {Component} from 'react';
import './TrackList.css';
import Track from '../Track/Track';


class TrackList extends Component {
  render(){
    //console.log(this.props.tracks);
    //this.props.tracks.then(track=>{console.log(track);});
    /*try{
      this.props.tracks.map(track=>{
        console.log(track);
        return track;
      })
    }
    catch(error){
      console.log(error.message)
    }*/
      //console.log(this.props.tracks)

    return (
      <div className="TrackList">
          {this.props.tracks.map(track =>{
            //console.log(track);
            return (
              <Track
                track={track}
                key={track.id}
                onAdd={this.props.onAdd}
                isRemoval={this.props.isRemoval}
                onRemove={this.props.onRemove}
              />
            );
          })}
      </div>
    );
  }
}

export default TrackList;
