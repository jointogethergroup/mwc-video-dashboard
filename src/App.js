
import React, { Component } from 'react';
import './App.css';
import Video from './components/Video/Video'
import AuthContext from './auht-context'
import axios from 'axios';
import jwt from 'jsonwebtoken'

class App extends Component {

  static contextType = AuthContext;
  
  state = {
    loginError:false,
    loginErrorCode:"",
    loggedIn: false,
    email:"",
    password:"",
    event_id:"364",
    filter_title:"",
    filter_track:"",
    filter_room:"",
    filter_day:"",
    filter_date_from:"",
    filter_date_to:"",
    max:10,
    size:'M',
    sessions:[]
  }

  componentDidMount(){
    const storedToken = localStorage.getItem('mwc.video.dashboard.token');    
    if (storedToken) {
        const decoded = jwt.decode(storedToken, {complete: true});        
        const exp = decoded.payload.exp;

        this.context.token = storedToken;
        this.context.authenticated = true;
        this.context.email = decoded.payload.email;
        this.context.event_id = decoded.payload.event_id;
    }
  }

  emailHandler = (event) => {
    this.setState({ email: event.target.value, loginError: false })
  }
  passwordHandler = (event) => {
      this.setState({ password: event.target.value, loginError: false })
  }

  loginHandler = () => {

    if (this.state.email != "" && this.state.password != "") {

        axios.post("https://virtual-venue-api-staging.herokuapp.com/api/auth2", {
            "email": this.state.email,
            "password": this.state.password,
            "event_id": this.state.event_id
          },
            {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        ).then(response => {

            localStorage.setItem('mwc.video.dashboard.token', response.data.token);
            const decoded = jwt.decode(response.data.token, { complete: true });
            this.context.token = response.data.token;
            this.context.authenticated = true;
            this.context.email = decoded.payload.email;
            this.context.event_id = decoded.payload.event_id;
            
            this.setState({loggedIn:true})

        }).catch(error => {
              const errorCode = error.response !== undefined && error.response.data !== undefined && error.response.data !== "" ? error.response.data : "100";
              this.setState({ loginError: true, loginErrorCode: errorCode })
          })

    } else {
        this.setState({ loginError: true, loginErrorCode: "100" });
    }
  }

  logoutHandler = () => {    
    localStorage.removeItem('mwc.video.dashboard.token');
    this.context.token = null;
    this.context.authenticated = false;
    this.context.email = '';
    this.context.event_id = null;
    this.setState({
      loggedIn:false,
      loginError:false,
      loginErrorCode:"",
      email:"",
      password:"",      
      filter_title:"",
      filter_track:"",
      filter_room:"",
      filter_day:"",
      filter_date_from:"",
      filter_date_to:"",
      sessions:[]
    })
}

  loadSession = () => {
    
    let data = {
        headers: {
            "x-auth-token": this.context.token,
            "content-type": "application/json",
        },
        params: {
          title:this.state.filter_title,
          track:this.state.filter_track,
          room:this.state.filter_room,
          day:this.state.filter_day,
          date_from:this.state.filter_date_from,
          date_to:this.state.filter_date_to
        }
    };

    axios.get("https://virtual-venue-api-staging.herokuapp.com/api/sessions/", data)    // get the details of the user
        .then(response => {
            this.setState({sessions:response.data})
        })
        .catch(error => { console.log(error.message); })
  }

  onFilter = () => {

  }

  render() {    

    const uniqueTracks = [... new Set(this.state.sessions.map(data => data.type))]
    const uniqueDays = [... new Set(this.state.sessions.map(data => data.day))]
    const uniqueRooms = [... new Set(this.state.sessions.map(data => data.room))]

    const tracks = uniqueTracks.map((el, index) => <option value={el}>{el}</option>)
    const days = uniqueDays.map((el, index) => <option value={el}>{el}</option>)
    const rooms = uniqueRooms.map((el, index) => <option value={el}>{el}</option>)


    const videos =  this.state.sessions.filter(el=>el.vimeo_key!==undefined).slice(0, this.state.max).map((el, index) => {
      return(
        <Video kye={el.id} type={el.type} 
                title={el.title}
                time_start={el.time_start}
                time_end={el.time_end}
                room={el.room}
                vimeo_id={el.vimeo_id}
                vimeo_url={el.vimeo_url}
                vimeo_key={el.vimeo_key}
        />
      )
    });

    return  (
      <div className="full-area-container">

          <div className="header-mwc">
              <img src="/img/logo.svg" />   
              {this.loggedIn || this.context.login(this.context.token) || this.context.autoLogin()              
              ? <div className="header-logout" onClick={this.logoutHandler}>[LOGOUT]</div>              
              : null}
          </div>

          <div className="content-mwc">
            
            {this.loggedIn || this.context.login(this.context.token) || this.context.autoLogin() 
            ?
            <React.Fragment>
              <div className="content-mwc-filters-area">
                  <div className="content-mwc-filters-area-wrapper">
                      
                      <form>

                          <div className="input-container">
                              <label htmlFor="Session">Session</label>
                              <input type="text" id="Session" name="Session" value="" />
                          </div>

                          <div className="input-container">
                              <label htmlFor="Track">Tracks</label>
                                <select name="Track" id="Track">
                                  {tracks}
                                </select>
                          </div>

                          <div className="input-container">
                              <label htmlFor="Day">Day</label>
                                <select name="Day" id="Day">
                                  {days}
                                </select>
                          </div>

                          <div className="input-container">
                              <label htmlFor="Room">Room</label>
                                <select name="Room" id="Room">
                                  {rooms}
                                </select>
                          </div>

                          <div className="input-container">
                            <div className="time-form-wrapper-input">
                                <div className="input-container-time">
                                    <label htmlFor="from-time">From</label>
                                    <select name="from-time" id="from-time">
                                      <option value="7">07:00</option>
                                      <option value="8">08:00</option>
                                      <option value="9">09:00</option>
                                      <option value="10">10:00</option>
                                      <option value="11">11:00</option>
                                      <option value="12">12:00</option>
                                      <option value="13">13:00</option>
                                      <option value="14">14:00</option>
                                      <option value="15">15:00</option>
                                      <option value="16">16:00</option>
                                      <option value="17">17:00</option>
                                      <option value="18">18:00</option>
                                      <option value="19">19:00</option>
                                      <option value="20">20:00</option>
                                    </select>
                                </div>
                                <div className="input-container-time">
                                    <label htmlFor="to-time">To</label>
                                    <select name="to-time" id="to-time">
                                    <option value="7">07:00</option>
                                      <option value="8">08:00</option>
                                      <option value="9">09:00</option>
                                      <option value="10">10:00</option>
                                      <option value="11">11:00</option>
                                      <option value="12">12:00</option>
                                      <option value="13">13:00</option>
                                      <option value="14">14:00</option>
                                      <option value="15">15:00</option>
                                      <option value="16">16:00</option>
                                      <option value="17">17:00</option>
                                      <option value="18">18:00</option>
                                      <option value="19">19:00</option>
                                      <option value="20">20:00</option>
                                    </select>
                                </div>
                            </div>
                          </div>

                          <div className="input-container">
                            <div className="time-form-wrapper-input">
                                <div className="input-container-time">
                                    <label htmlFor="from-time">Max</label>
                                    <select name="from-time" id="from-time">
                                      <option value="5">5</option>
                                      <option value="10" selected>10</option>
                                      <option value="15">15</option>
                                      <option value="20">20</option>
                                      <option value="30">30</option>
                                      <option value="50">50</option>
                                    </select>
                                </div>
                                <div className="input-container-time">
                                    <label htmlFor="to-time">Size</label>
                                    <select name="to-time" id="to-time">
                                    <option value="XS">XS</option>
                                      <option value="S">S</option>
                                      <option value="M" selected>M</option>
                                      <option value="L">L</option>
                                      <option value="XL">XL</option>
                                    </select>
                                </div>
                            </div>
                          </div>

                          <div className="input-container-submit">
                              <div className="content-mwc-videos-btns upload" onClick={this.loadSession}>Filter</div>
                          </div>

                      </form>

                  </div>
              </div>
              <div className="content-mwc-videos-area">
                  <div className="content-mwc-videos-area-wrapper">
                    {videos}
                  </div>
              </div>
            </React.Fragment>
            
            : 
            <React.Fragment>
              <div className="content-mwc-filters-area">
                <div className="content-mwc-filters-area-wrapper">  
                  <form>
                    <div className="input-container">
                        <label htmlFor="Emailn">Email:</label>
                        <input type="text" name="password" id="password" onChange={this.emailHandler} />
                    </div> 
                    <div className="input-container">
                        <label htmlFor="Password">Password:</label>
                        <input type="password" name="password" id="password" onChange={this.passwordHandler} />
                    </div> 
                    <div className="input-container-submit">
                        <div className="content-mwc-videos-btns upload" onClick={this.loginHandler}>Enter</div>
                    </div>
                  </form> 
                </div>
              </div>
              
              <div className="content-mwc-videos-area">
                <div className="content-mwc-videos-area-wrapper">
                {this.state.loginError 
                  ? "Incorrect username of password!"
                  : ""
                }
                </div>
              </div>
            </React.Fragment>
            }

          </div>
        </div>
    ) 

  }
}

export default App;



