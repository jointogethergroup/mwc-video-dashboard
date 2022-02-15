
import React, { Component } from 'react';
import Vimeo from 'vimeo'

class VideoUpload extends Component {
    
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
      }

    state = {
        client_id : "",
        client_secret : "",
        access_token : "",
        filePath:""
    }

    vimeoClient = new Vimeo.Vimeo(this.state.client_id, this.state.client_secret, this.state.access_token);


    handleSubmit(event) {
        event.preventDefault();
        //this.setState({filePath:this.fileInput.current.files[0]})
        this.uploadVideo('c:/Videos/' + this.fileInput.current.files[0].name, 'demo-demo.mp4') 
      }

    uploadVideo = (file_path, presentation_title) => {
        this.vimeoClient.upload(
            file_path,
            {
            'name': presentation_title,
            'description': '',
            'privacy': {
                'view': 'disable',
                'embed': 'whitelist',
                'download': '0',
                'comments': 'nobody'
                },
            'embed': {
                'buttons': {
                'like': '0',
                'watchlater': '0',
                'share': '0',
                'embed': '0',
                'fullscreen': '1',
                'scaling': '1'
                },
                'logos': { 'vimeo': '0' },
                'title': { 'name': 'hide', 'owner': 'hide', 'portrait': 'hide' },
                'playbar': '1',
                'volume': '1',
                'speed': '0',
                'color': '00adef'
                }
            },
            (uri) => {
                console.log(uri)
            },
            function (bytes_uploaded, bytes_total) {
                var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
                console.log(bytes_uploaded, bytes_total, percentage + '%')
            },
            function (error) {
                if (error) {
                    console.log('Failed because: ' + error)
                    console.log(file_path)
                }
            }
        )

    }
    
    render() {


        return (
            <div className="modal-mwc">
            <div className="modal-mwc-videos-area">

                <div className="modal-mwc-videos-sessions-container upload">

                    <div className="modal-mwc-videos-session-header">
                        <div className="modal-mwc-close-btn" onClick={this.props.close}>Close</div>
                        <div className="modal-mwc-videos-session-header-wrapper">
                            {this.props.type}<br />
                            <strong>{this.props.title}</strong><br />
                            {this.props.date_from} | {this.props.date_to}<br />
                            <strong>Room:</strong> {this.props.room}<br />
                        </div>

                    </div>

                    <div className="modal-mwc-videos-session-content-container upload">
                        <div className="modal-mwc-videos-session-content-wrapper">
                            {/* <h3>Upload Video</h3>
                            <form onSubmit={this.handleSubmit}>
                                <input type="file" id="file-id" name="file-id" ref={this.fileInput} />
                                <input className="btn-submit" type="submit" />
                            </form> */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
        );
    }
}

export default VideoUpload;

