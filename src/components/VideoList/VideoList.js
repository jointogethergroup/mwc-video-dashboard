import React, { Component } from 'react';
import VideoDetail from './VideoDetail'
import AuthContext from '../../auht-context'
import axios from 'axios'

class VideoList extends Component {
    
    state = {
        clips:[],
        loaded:false
    }
    
    static contextType = AuthContext;

    componentDidMount(){
        this.loadClips()
    }
    
    loadClips = () => {
        let data = {
            headers: {
                "x-auth-token": this.context.token,
                "content-type": "application/json",
            }
        };
        axios.get("https://virtual-venue-api-staging.herokuapp.com/api/vimeo/live/" + this.props.vimeo_id + "/clips", data) 
        .then(response => {
            this.setState({
                clips:response.data,
                loaded: true
            })
        })
        .catch(error => { console.log(error.message); })
    }
    
    
    render() {

        const clips = this.state.clips !== undefined && this.state.clips.length > 0 
            ? this.state.clips.map((el, index) => {
                return (
                    <VideoDetail clip={el} token={this.context.token}></VideoDetail>
                )
            }) 
            : this.state.loaded 
                ?<div><strong>No video clips yet!</strong></div>
                :<div>Loading...</div>


        return (
            <div className="modal-mwc">
                <div className="modal-mwc-videos-area">

                    <div className="modal-mwc-videos-sessions-container">

                        <div className="modal-mwc-videos-session-header">
                            <div className="modal-mwc-videos-session-header-wrapper">
                                {this.props.type}<br />
                                <strong>{this.props.title}</strong><br />
                                {this.props.date_from} | {this.props.date_to}<br />
                                <strong>Room:</strong> {this.props.room}<br />
                            </div>
                        </div>

                        <div className="modal-mwc-videos-session-content-container">
                            <div className="modal-mwc-videos-session-content-wrapper">
                                {clips}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoList;
