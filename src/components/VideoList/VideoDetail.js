import React from 'react';

function VideoDetail(props) {
    return (
        <div className="content-mwc-videos-container">
            <div className="session-details">
                <strong>Video 1</strong>
                <hr />
            </div>
            <div className="content-mwc-videos-iframe-wrapper">
                <iframe src="https://player.vimeo.com/video/561744874" width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="content-mwc-videos-btns-wrapper">
                <div className="content-mwc-videos-btns">Download</div>
            </div>
        </div>
    );
}

export default VideoDetail;