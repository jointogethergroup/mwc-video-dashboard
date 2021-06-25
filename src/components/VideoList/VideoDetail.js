import React, { Component } from 'react';
import axios from 'axios'

class VideoDetail extends Component {
    
    state = {
        videos:[]
    }

    componentDidMount(){
        this.loadVideoDetails()
    }

    loadVideoDetails = () => {
        let data = {
            headers: {
                "x-auth-token": this.props.token,
                "content-type": "application/json",
            }
        };
        
        console.log("https://virtual-venue-api-staging.herokuapp.com/api/vimeo/video/" + this.props.clip.clip_id + "/files")

        axios.get("https://virtual-venue-api-staging.herokuapp.com/api/vimeo/video/" + this.props.clip.clip_id + "/files", data) 
        .then(response => {
            this.setState({
                videos:response.data
            })
        })
        .catch(error => { console.log(error.message); })
    }
    
    render() {

        const videos = this.state.videos !== undefined && this.state.videos.length> 0 
            ? this.state.videos.map((el,index) => {
                return(
                    <React.Fragment>
                        <strong>Quality: {el.quality}</strong> | Type: {el.type} [{el.width}x{el.height}]<br/>
                        Created: {el.created_time} <br/><br/>
                        Size: {el.size_short} <br/>
                        <div className="content-mwc-videos-btns"> <a href={el.link} download>Download </a></div>
                        <br/>
                        <hr />  
                    </React.Fragment>
                )
            })
            : null

        return (
            <div className="content-mwc-videos-container">
                <div className="session-details">
                    {videos}
                </div>
                {/* <div className="content-mwc-videos-iframe-wrapper">
                    <iframe src="https://player.vimeo.com/video/561744874" width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                </div> */}
                
            </div>
        );
    }
}

export default VideoDetail;

