import React from 'react';
import VideoDetail from './VideoDetail'

function VideoList(props) {
    return (
        
    
        <div className="modal-mwc" style="display:none;">


        <div className="modal-mwc-videos-area">

            <div className="modal-mwc-videos-sessions-container">

                <div className="modal-mwc-videos-session-header">
                    <div className="modal-mwc-videos-session-header-wrapper">
                        <strong>Session Title</strong><br />
                        <strong>Date:</strong> 23-06-2021<br />
                        <strong>Time:</strong> 09:00-10h00<br />
                        <strong>Room:</strong> Room1
                    </div>
                </div>

                <div className="modal-mwc-videos-session-content-container">
                    <div className="modal-mwc-videos-session-content-wrapper">

                        <VideoDetail></VideoDetail>
                        <VideoDetail></VideoDetail>
                        <VideoDetail></VideoDetail>
                        <VideoDetail></VideoDetail>

                    </div>
                </div>
            </div>
        </div>
    </div>
   




    );
}

export default VideoList;