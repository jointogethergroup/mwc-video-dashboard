import React from 'react';

function VideoUpload(props) {
    return (
        <div className="modal-mwc">
            <div className="modal-mwc-videos-area">

                <div className="modal-mwc-videos-sessions-container upload">

                    <div className="modal-mwc-videos-session-header">

                        <div className="modal-mwc-videos-session-header-wrapper">
                            <strong>Session Title</strong><br />
                            <strong>Date:</strong> 23-06-2021<br />
                            <strong>Time:</strong> 09:00-10h00<br />
                            <strong>Room:</strong> Room1
                        </div>

                    </div>

                    <div className="modal-mwc-videos-session-content-container upload">
                        <div className="modal-mwc-videos-session-content-wrapper">
                            <h3>Upload Video</h3>
                            <form>
                                <input type="file" id="myFile" name="filename" />
                                <input className="btn-submit" type="submit" />
                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default VideoUpload;