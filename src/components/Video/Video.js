import React, { Component } from 'react';

class Video extends Component {
    
    state = {}    

    render() {

        let url_array;
        let url = this.props.vimeo_url;
        let isLiveRecurring = false; 

        
        // suport to recurring live event -> é preciso transformar o URL directo para o URL de embed
        if (this.props.vimeo_url !== undefined && this.props.vimeo_url !== "") {
            url_array = this.props.vimeo_url.split("/");
            for (let index = 0; index < url_array.length; index++) {
                const element = url_array[index];
                if (element === "event"){
                    url = url_array[0] + '//' + url_array[2] + '/' + url_array[3] + '/' + url_array[4] + '/embed/' + url_array[5] 
                    isLiveRecurring = true;
                    break;
                }       
            }
        }

        // support para videos on-demand, para poderem tocar em consecutivo 
        if (!isLiveRecurring){
            if (this.props.vimeo_url !== undefined && this.props.vimeo_url !== "") {
                url = this.props.vimeo_url + '?autopause=0';
            }
        }

        return (
            <React.Fragment>
                <div className="content-mwc-videos-container">
                    <div className="session-details">
                        {this.props.type}<br />
                        <strong>{this.props.title}</strong><br />
                        {this.props.time_start} | {this.props.time_end}<br />
                        <strong>Room:</strong> {this.props.room}<br />
                        <strong>URL:</strong> <a href={this.props.vimeo_url} target="blank">{this.props.vimeo_url}</a><br/>
                        <strong>Embed:</strong> {url}<br />
                        <strong>Key:</strong> {this.props.vimeo_key}<br />
                        <hr />
                    </div>                        
                    <div className="content-mwc-videos-iframe-wrapper">
                        {url !== undefined && url !== "" ?
                        <iframe src={url} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                        : null }
                    </div>
                    <div className="content-mwc-videos-btns-wrapper">
                        <div className="content-mwc-videos-btns videos" onClick={() => this.props.showVideos(this.props.id)}>Videos</div>
                        <div className="content-mwc-videos-btns upload" onClick={() => this.props.uploadVideo(this.props.id)}>Upload</div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Video;