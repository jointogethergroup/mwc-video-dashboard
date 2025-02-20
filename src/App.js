import React, { Component } from "react";
import "./App.css";
import Video from "./components/Video/Video";
import VideoList from "./components/VideoList/VideoList";
import VideoUpload from "./components/VideoUpload/VideoUpload";
import AuthContext from "./auht-context";
import axios from "axios";
import jwt from "jsonwebtoken";

class App extends Component {
  static contextType = AuthContext;

  state = {
    loginError: false,
    loginErrorCode: "",
    loggedIn: false,
    email: "",
    password: "",
    event_id: "486",
    filter_title: "",
    filter_track: "",
    filter_typology: "non-physical",
    filter_room: "",
    filter_day: "",
    filter_date_from: "",
    filter_date_to: "",
    max: 10,
    size: "M",
    sessions: [],
    sessionSelected: {},
    videosOpen: false,
    uploadOpen: false,
    loading: false,
    loading_count: 0,
    loading_total: 0,
    tracks: [],
    rooms: [],
    tracks_loaded: false,
    rooms_loaded: false,
  };

  componentDidMount() {
    const storedToken = localStorage.getItem("mwc.video.dashboard.token");

    if (storedToken) {
      const decoded = jwt.decode(storedToken, { complete: true });
      const exp = decoded.payload.exp;

      this.context.token = storedToken;
      this.context.authenticated = true;
      this.context.email = decoded.payload.email;
      this.context.event_id = decoded.payload.event_id;

      this.loadRoom(1);
      this.loadTrack(1);
    }
  }

  emailHandler = (event) => {
    this.setState({ email: event.target.value, loginError: false });
  };
  passwordHandler = (event) => {
    this.setState({ password: event.target.value, loginError: false });
  };

  loginHandler = () => {
    if (this.state.email != "" && this.state.password != "") {
      axios
        .post(
          "https://virtual-venue-api-staging.herokuapp.com/api/auth2",
          {
            email: this.state.email,
            password: this.state.password,
            event_id: this.state.event_id,
          },
          {
            "Content-Type": "application/json",
            Accept: "*/*",
          }
        )
        .then((response) => {
          localStorage.setItem(
            "mwc.video.dashboard.token",
            response.data.token
          );
          const decoded = jwt.decode(response.data.token, { complete: true });
          this.context.token = response.data.token;
          this.context.authenticated = true;
          this.context.email = decoded.payload.email;
          this.context.event_id = decoded.payload.event_id;

          this.setState({ loggedIn: true });

          this.loadRoom(1);
          this.loadTrack(1);
        })
        .catch((error) => {
          const errorCode =
            error.response !== undefined &&
            error.response.data !== undefined &&
            error.response.data !== ""
              ? error.response.data
              : "100";
          this.setState({ loginError: true, loginErrorCode: errorCode });
        });
    } else {
      this.setState({ loginError: true, loginErrorCode: "100" });
    }
  };

  logoutHandler = () => {
    localStorage.removeItem("mwc.video.dashboard.token");
    this.context.token = null;
    this.context.authenticated = false;
    this.context.email = "";
    this.context.event_id = null;
    this.setState({
      loggedIn: false,
      loginError: false,
      loginErrorCode: "",
      email: "",
      password: "",
      filter_title: "",
      filter_track: "",
      filter_typology: "",
      filter_room: "",
      filter_day: "",
      filter_date_from: "",
      filter_date_to: "",
      sessions: [],
      tracks: [],
      rooms: [],
    });
  };

  loadTrack = (page) => {
    axios.defaults.headers["X-APP-AUTHENTICATE"] = "rZtp3xI27ByRWaYp6pnT";

    axios
      .get(
        "https://gsma-asm.jemexonline.com/api/options/mwcb25/track?page=" + page
      ) // get the lis of programme SESSIONS - JEMEX
      .then((response) => {
        let next_page = 0;

        if (response.data) {
          const meta_page = response.data.meta.page * 1;
          const meta_count = response.data.meta.count * 1;
          const meta_limit = response.data.meta.limit * 1;
          const meta_total = response.data.meta.total * 1;

          if (meta_page * meta_limit < meta_total) {
            next_page = meta_page + 1;
          }

          const program_tracks = [];

          response.data.data.forEach((element) => {
            //if (element.status === 'active'){
            const track_new = {
              code: element.code,
              name: element.name_en,
              ordering: element.ordering,
            };
            program_tracks.push(track_new);
            //}
          });

          this.setState({
            tracks: this.state.tracks.concat(program_tracks),
            tracks_loaded: next_page > 0 ? false : true,
          });

          if (next_page > 0) {
            this.loadTrack(next_page);
          } else {
            if (this.state.rooms_loaded) {
              this.loadSession(1);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  loadRoom = (page) => {
    axios.defaults.headers["X-APP-AUTHENTICATE"] = "rZtp3xI27ByRWaYp6pnT";

    axios
      .get(
        "https://gsma-asm.jemexonline.com/api/options/mwcb25/auditorium?page=" +
          page
      ) // get the lis of programme SESSIONS - JEMEX
      .then((response) => {
        let next_page = 0;

        if (response.data) {
          const meta_page = response.data.meta.page * 1;
          const meta_count = response.data.meta.count * 1;
          const meta_limit = response.data.meta.limit * 1;
          const meta_total = response.data.meta.total * 1;

          if (meta_page * meta_limit < meta_total) {
            next_page = meta_page + 1;
          }

          const program_rooms = [];

          response.data.data.forEach((element) => {
            //if (element.status === 'active'){
            const room_new = {
              code: element.code,
              name: element.name_en,
              ordering: element.ordering,
            };
            program_rooms.push(room_new);
            //}
          });

          this.setState({
            rooms: this.state.rooms.concat(program_rooms),
            rooms_loaded: next_page > 0 ? false : true,
          });

          if (next_page > 0) {
            this.loadRoom(next_page);
          } else {
            if (this.state.tracks_loaded) {
              this.loadSession(1);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  loadSession = (page) => {
    axios.defaults.headers["X-APP-AUTHENTICATE"] = "rZtp3xI27ByRWaYp6pnT";

    axios
      .get("https://gsma-asm.jemexonline.com/api/sessions/mwcb25?page=" + page)
      .then((response) => {
        let next_page = 0;

        if (response.data) {
          const meta_page = response.data.meta.page * 1;
          const meta_count = response.data.meta.count * 1;
          const meta_limit = response.data.meta.limit * 1;
          const meta_total = response.data.meta.total * 1;

          if (meta_page * meta_limit < meta_total) {
            next_page = meta_page + 1;
          }

          const scientific_program = [];
          response.data.data.forEach((element) => {
            const room_details = this.state.rooms.find(
              (item) => item.code == element.auditorium_id
            );
            const track_details = this.state.tracks.find(
              (item) => item.code == element.track_id
            );

            /* if (track_details == null || track_details == undefined){
                  console.log(element)
                }
                if (room_details == null || room_details == undefined){
                  console.log(element)
                } */

            const session_new = {
              id: element.session_uuid,
              title: element.title_en,
              type_id: element.track_id,
              type:
                track_details !== null && track_details !== undefined
                  ? track_details.name
                  : "MISSING AUDITORIUM",
              typology: element.typology,
              room_id: element.auditorium_id,
              room:
                room_details !== null && room_details !== undefined
                  ? room_details.name
                  : "MISSING ROOM",
              room_order: element.auditorium_id,
              day_id: element.date,
              day: element.date,
              day_order: element.date,
              time_start: new Date(element.start_at * 1000).toISOString(),
              time_end: new Date(element.end_at * 1000).toISOString(),
              vimeo_id: element.online_video_id,
              vimeo_url: element.online_video_url,
              vimeo_key: element.rtmp_url,
            };

            scientific_program.push(session_new);
          });

          this.setState({
            sessions: this.state.sessions.concat(scientific_program),
            loading: next_page > 0 ? true : false,
            loading_count:
              meta_page * meta_limit > meta_total
                ? meta_total
                : meta_page * meta_limit,
            loading_total: meta_total,
          });
        }

        if (next_page > 0) {
          this.loadSession(next_page);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({ loading: false });
      });
  };

  onFilter = () => {};

  onSetAnwserHandler = (event) => {
    switch (event.target.name) {
      case "session-track":
        this.setState({
          filter_track: event.target.value !== "" ? event.target.value : null,
        });
        break;

      case "session-typology":
        this.setState({
          filter_typology:
            event.target.value !== "" ? event.target.value : null,
        });
        break;

      case "session-room":
        this.setState({
          filter_room: event.target.value !== "" ? event.target.value : null,
        });
        break;

      case "session-day":
        this.setState({
          filter_day: event.target.value !== "" ? event.target.value : null,
        });
        break;

      case "session-from-time":
        this.setState({
          filter_date_from:
            event.target.value !== "" ? event.target.value : null,
        });
        break;

      case "session-to-time":
        this.setState({
          filter_date_to: event.target.value !== "" ? event.target.value : null,
        });
        break;

      case "max-videos":
        this.setState({
          max: event.target.value !== "" ? event.target.value : null,
        });
        break;

      case "size-video":
        this.setState({
          size: event.target.value !== "" ? event.target.value : null,
        });
        break;
      default:
        break;
    }
  };

  onCommentsHandler = (text) => {
    this.setState({ filter_title: text });
  };

  showVideos = (sessionId) => {
    const selectSession = this.state.sessions.filter(
      (el) => el.id === sessionId
    );
    const selectSessionObj =
      selectSession !== undefined && selectSession.length > 0
        ? selectSession[0]
        : null;
    if (selectSessionObj) {
      this.setState((prevState, props) => {
        return {
          videosOpen: !prevState.videosOpen,
          sessionSelected: selectSessionObj,
        };
      });
    } else {
      this.setState((prevState, props) => {
        return {
          videosOpen: !prevState.videosOpen,
          sessionSelected: null,
        };
      });
    }
  };

  uploadVideo = (sessionId) => {
    const selectSession = this.state.sessions.filter(
      (el) => el.id === sessionId
    );
    const selectSessionObj =
      selectSession !== undefined && selectSession.length > 0
        ? selectSession[0]
        : null;
    if (selectSessionObj) {
      this.setState((prevState, props) => {
        return {
          uploadOpen: !prevState.uploadOpen,
          sessionSelected: selectSessionObj,
        };
      });
    } else {
      this.setState((prevState, props) => {
        return {
          uploadOpen: !prevState.uploadOpen,
          sessionSelected: null,
        };
      });
    }
  };

  render() {
    /* const uniqueTracks = [... new Set(this.state.sessions.map(data => data.type))].sort();
    const uniqueTypology = [... new Set(this.state.sessions.map(data => data.typology))].sort();
    const uniqueDays = [... new Set(this.state.sessions.map(data => data.day))].sort();
    const uniqueRooms = [... new Set(this.state.sessions.map(data => data.room))].sort();

    const tracks = uniqueTracks.map((el, index) => <option key={el} value={el}>{el}</option>)
    const typologies = uniqueTypology.map((el, index) => <option key={el} value={el}>{el}</option>)
    const days = uniqueDays.map((el, index) => <option key={el} value={el}>{el}</option>)
    const rooms = uniqueRooms.map((el, index) => <option key={el} value={el}>{el}</option>) */

    const uniqueTypology = [
      ...new Set(this.state.sessions.map((data) => data.typology)),
    ].sort();
    const uniqueDays = [
      ...new Set(this.state.sessions.map((data) => data.day)),
    ].sort();

    const tracks = this.state.tracks.map((el, index) => (
      <option key={el.code} value={el.code}>
        {el.name}
      </option>
    ));
    const typologies = uniqueTypology.map((el, index) => (
      <option key={el} value={el}>
        {el}
      </option>
    ));
    const days = uniqueDays.map((el, index) => (
      <option key={el} value={el}>
        {el}
      </option>
    ));
    const rooms = this.state.rooms.map((el, index) => (
      <option key={el.code} value={el.code}>
        {el.name}
      </option>
    ));

    const videos = this.state.sessions
      .filter((el) => el.vimeo_key !== undefined)
      .filter(
        (el) =>
          el.title
            .toUpperCase()
            .includes(this.state.filter_title.toUpperCase()) ||
          this.state.filter_title === "" ||
          this.state.filter_title === null ||
          this.state.filter_title === undefined
      )
      .filter(
        (el) =>
          el.type_id === this.state.filter_track ||
          this.state.filter_track === null ||
          this.state.filter_track === undefined ||
          this.state.filter_track === ""
      )
      .filter(
        (el) =>
          el.typology === this.state.filter_typology ||
          (this.state.filter_typology === "non-physical" &&
            el.typology === "Hybrid") ||
          (this.state.filter_typology === "non-physical" &&
            el.typology === "Virtual") ||
          this.state.filter_typology === null ||
          this.state.filter_typology === undefined ||
          this.state.filter_typology === ""
      )
      .filter(
        (el) =>
          el.day === this.state.filter_day ||
          this.state.filter_day === null ||
          this.state.filter_day === undefined ||
          this.state.filter_day === ""
      )
      .filter(
        (el) =>
          el.room_id === this.state.filter_room ||
          this.state.filter_room === null ||
          this.state.filter_room === undefined ||
          this.state.filter_room === ""
      )
      .filter((el, index) => {
        const start = el.time_start.replace(/T/g, " ").replace(/Z/g, "");
        const start_date = new Date(start);
        const start_hour = start_date.getHours();
        return (
          (start_hour >= this.state.filter_date_from ||
            this.state.filter_date_from === null ||
            this.state.filter_date_from === "" ||
            this.state.filter_date_from === undefined) &&
          (start_hour <= this.state.filter_date_to ||
            this.state.filter_date_to === null ||
            this.state.filter_date_to === "" ||
            this.state.filter_date_to === undefined)
        );
      })
      .slice(0, this.state.max)
      .map((el, index) => {
        return (
          <Video
            key={el.id}
            id={el.id}
            type={el.type}
            typology={el.typology}
            title={el.title}
            time_start={el.time_start}
            time_end={el.time_end}
            room={el.room}
            vimeo_id={el.vimeo_id}
            vimeo_url={el.vimeo_url}
            vimeo_key={el.vimeo_key}
            showVideos={this.showVideos}
            uploadVideo={this.uploadVideo}
          />
        );
      });

    const videoList = this.state.videosOpen ? (
      <VideoList
        id={this.state.sessionSelected.id}
        type={this.state.sessionSelected.type}
        title={this.state.sessionSelected.title}
        date_from={this.state.sessionSelected.time_start}
        date_to={this.state.sessionSelected.time_end}
        room={this.state.sessionSelected.room}
        vimeo_id={this.state.sessionSelected.vimeo_id}
        url={this.state.sessionSelected.vimeo_url}
        close={this.showVideos}
      />
    ) : null;

    const videoUpload = this.state.uploadOpen ? (
      <VideoUpload
        id={this.state.sessionSelected.id}
        type={this.state.sessionSelected.type}
        title={this.state.sessionSelected.title}
        date_from={this.state.sessionSelected.time_start}
        date_to={this.state.sessionSelected.time_end}
        room={this.state.sessionSelected.room}
        vimeo_id={this.state.sessionSelected.vimeo_id}
        url={this.state.sessionSelected.vimeo_url}
        close={this.uploadVideo}
      />
    ) : null;

    return (
      <React.Fragment>
        <div className="full-area-container">
          <div className="header-mwc">
            <img src="/img/logo.svg" />
            {this.loggedIn ||
            this.context.login(this.context.token) ||
            this.context.autoLogin() ? (
              <div className="header-logout" onClick={this.logoutHandler}>
                [LOGOUT]
              </div>
            ) : null}
          </div>

          <div className="content-mwc">
            {this.loggedIn ||
            this.context.login(this.context.token) ||
            this.context.autoLogin() ? (
              <React.Fragment>
                <div className="content-mwc-filters-area">
                  <div className="content-mwc-filters-area-wrapper">
                    <form>
                      <div className="input-container">
                        <label htmlFor="Session">Session</label>
                        <input
                          type="text"
                          id="session-title"
                          name="session-title"
                          onChange={(event) =>
                            this.onCommentsHandler(event.target.value)
                          }
                        />
                      </div>

                      <div className="input-container">
                        <label htmlFor="Track">Tracks</label>
                        <select
                          name="session-track"
                          id="session-track"
                          onChange={(event) => this.onSetAnwserHandler(event)}
                        >
                          <option value=""></option>
                          {tracks}
                        </select>
                      </div>

                      <div className="input-container">
                        <label htmlFor="Track">Typology</label>
                        <select
                          name="session-typology"
                          id="session-typology"
                          onChange={(event) => this.onSetAnwserHandler(event)}
                        >
                          <option value=""></option>
                          {typologies}
                          <option value="non-physical" selected>
                            Hybrid & Virtual
                          </option>
                        </select>
                      </div>

                      <div className="input-container">
                        <label htmlFor="Day">Day</label>
                        <select
                          name="session-day"
                          id="session-day"
                          onChange={(event) => this.onSetAnwserHandler(event)}
                        >
                          <option value=""></option>
                          {days}
                        </select>
                      </div>

                      <div className="input-container">
                        <label htmlFor="Room">Room</label>
                        <select
                          name="session-room"
                          id="session-room"
                          onChange={(event) => this.onSetAnwserHandler(event)}
                        >
                          <option value=""></option>
                          {rooms}
                        </select>
                      </div>

                      <div className="input-container">
                        <div className="time-form-wrapper-input">
                          <div className="input-container-time">
                            <label htmlFor="session-from-time">From</label>
                            <select
                              name="session-from-time"
                              id="session-from-time"
                              onChange={(event) =>
                                this.onSetAnwserHandler(event)
                              }
                            >
                              <option value=""></option>
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
                            <label htmlFor="session-to-time">To</label>
                            <select
                              name="session-to-time"
                              id="session-to-time"
                              onChange={(event) =>
                                this.onSetAnwserHandler(event)
                              }
                            >
                              <option value=""></option>
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
                            <label htmlFor="max-videos">Max</label>
                            <select
                              name="max-videos"
                              id="max-videos"
                              onChange={(event) =>
                                this.onSetAnwserHandler(event)
                              }
                            >
                              <option value="5">5</option>
                              <option value="10" defaultValue>
                                10
                              </option>
                              <option value="15">15</option>
                              <option value="20">20</option>
                              <option value="30">30</option>
                              <option value="50">50</option>
                            </select>
                          </div>
                          <div className="input-container-time">
                            <label htmlFor="size-video">Size</label>
                            <select
                              name="size-video"
                              id="size-video"
                              onChange={(event) =>
                                this.onSetAnwserHandler(event)
                              }
                            >
                              <option value="XS">XS</option>
                              <option value="S">S</option>
                              <option value="M" defaultValue>
                                M
                              </option>
                              <option value="L">L</option>
                              <option value="XL">XL</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="content-mwc-videos-area">
                  <div className="content-mwc-videos-area-wrapper">
                    {this.state.loading ? (
                      <div>
                        <p>
                          LOADING SESSIONS .... {this.state.loading_count} /{" "}
                          {this.state.loading_total}
                        </p>
                      </div>
                    ) : (
                      videos
                    )}
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="content-mwc-filters-area">
                  <div className="content-mwc-filters-area-wrapper">
                    <form>
                      <div className="input-container">
                        <label htmlFor="Emailn">Email:</label>
                        <input
                          type="text"
                          name="password"
                          id="password"
                          onChange={this.emailHandler}
                        />
                      </div>
                      <div className="input-container">
                        <label htmlFor="Password">Password:</label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          onChange={this.passwordHandler}
                        />
                      </div>
                      <div className="input-container-submit">
                        <div
                          className="content-mwc-videos-btns upload"
                          onClick={this.loginHandler}
                        >
                          Enter
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="content-mwc-videos-area">
                  <div className="content-mwc-videos-area-wrapper">
                    {this.state.loginError
                      ? "Incorrect username of password!"
                      : ""}
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        {videoList}
        {videoUpload}
      </React.Fragment>
    );
  } // render
}

export default App;
