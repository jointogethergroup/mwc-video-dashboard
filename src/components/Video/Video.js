import React from 'react';

function Video(props) {

    let url_array;
    let url = props.vimeo_url;
    let isLiveRecurring = false; 
    
    // suport to recurring live event -> é preciso transformar o URL directo para o URL de embed
    if (props.vimeo_url !== undefined && props.vimeo_url !== "") {
        url_array = props.vimeo_url.split("/");
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
        if (props.vimeo_url !== undefined && props.vimeo_url !== "") {
            url = props.vimeo_url + '?autopause=0';
        }
    }
    


    return (
        <div className="content-mwc-videos-container">
            <div className="session-details">
                {props.type}<br />
                <strong>{props.title}</strong><br />
                {props.time_start} | {props.time_end}<br />
                <strong>Room:</strong> {props.room}<br />
                <strong>URL:</strong> <a href={props.vimeo_url} target="blank">{props.vimeo_url}</a><br/>
                <strong>Embed:</strong> {url}<br />
                <strong>Key:</strong> {props.vimeo_key}<br />
                <hr />
            </div>                        
            <div className="content-mwc-videos-iframe-wrapper">
                {url !== undefined && url !== "" ?
                <iframe src={url} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                : null }
            </div>
            <div className="content-mwc-videos-btns-wrapper">
                <div className="content-mwc-videos-btns videos">Videos</div>
                <div className="content-mwc-videos-btns upload">Upload</div>
            </div>
        </div>
    );
}

export default Video;