import React from "react";
import axios from "axios";
import { Radio } from "bootstrap";

import $ from "jquery";

// const bootstrap = require('bootstrap');

// import $ from "jquery";
import datepicker from "../assets/js/bootstrap-datepicker.js";
import customjs from "../assets/js/script.js";
import "../assets/css/datepicker.css";
import "../assets/css/style.css";
import "../assets/css/responsive.css";
import { Panel, Well, Fade, Collapse, Button } from "react-bootstrap";

import {sc, u, wallet} from "@cityofzion/neon-js";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { injectNOS, nosProps } from "@nosplatform/api-functions/lib/react";

const styles = { 
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

const scriptHash = "b9d6e6c6f005f0b89e53e7422cf2be22bcee0122"
const known_integer_keys = []


class Vote extends React.Component {

  async componentDidMount() {
    var addr_string = await this.get_address_string()
    var my_invites = await this.get_my_invites(addr_string)
    var list = []
    for (var i=0; i<my_invites.length; i++) {
        var invite = await this.get_event(my_invites[i])
        var invited = []
        var accepted = []
        var declined = []
        for (var [k,v] of invite.get("guests")) {
            console.log(k + " ==== " + v)
            if (v == "invited") {
                invited.push(k)
            }
            else if (v == "accepted") {
                accepted.push(k)
            }
            else {
                declined.push(k)
            }
        }
        // TODO add location in smart contract
        list.push({"id": my_invites[i], "subject": invite.get("text"), "date": invite.get("date"), "from": invite.get("owner"), "location": invite.get("location"), "acceptUsers": accepted, "rejectUsers": declined, "to": invited})
    }

    this.setState({
        eventList: list,
        currentUser: addr_string
    });

    console.log(JSON.stringify(list, null, 4));
  }

  constructor(props) {
    super(props);
    this.state = {
      currentUser: "",
      inputValue: "",
      eventList: [
//      {
//        subject: "When Binance 111?",
//        date: "29/07/2018",
//        acceptUsers: ["Bob", "Michal", "Geoff", "Kelvin"],
//        rejectUsers: ["Qiangji", "alan"],
//        from: "Geoff",
//        to: [
//          "user1",
//          "Bob",
//          "Michal",
//          "Geoff",
//          "Kelvin",
//          "Wendy",
//          "miaomiao"
//        ],
//        location: "3 Blawayn roda, Mongolisa, 3425"
//      },
//      {
//        subject: "When Binance 222 ?",
//        date: "30/07/2018",
//        acceptUsers: [],
//        rejectUsers: ["Qiangji", "alan", "Geoff"],
//        from: "user1",
//        to: [
//          "user1",
//          "Bob",
//          "Michal",
//          "Geoff",
//          "Kelvin",
//          "Wendy",
//          "miaomiao"
//        ],
//        location: "3 Blawayn roda, Mongolisa, 3425"
//      },
//      {
//        subject: "When Binance 333 ?",
//        date: "31/07/2018",
//        acceptUsers: ["Bob", "Geoff", "Kelvin"],
//        rejectUsers: ["Qiangji"],
//        from: "geoff",
//        to: [
//          "user1",
//          "Bob",
//          "Michal",
//          "Geoff",
//          "Kelvin",
//          "Wendy",
//          "miaomiao"
//        ],
//        location: "3 Blawayn roda, Mongolisa, 3425"
//      },
//      {
//        subject: "When Binance 444 ?",
//        date: "13/07/2018",
//        acceptUsers: ["Bob", "Kelvin"],
//        rejectUsers: ["Qiangji", "Geoff"],
//        from: "user1",
//        to: [
//          "user1",
//          "Bob",
//          "Michal",
//          "Geoff",
//          "Kelvin",
//          "Wendy",
//          "miaomiao"
//        ],
//        location: "3 Blawayn roda, Mongolisa, 3425"
//      },
//      {
//        subject: "When Binance 5555 ?",
//        date: "14/07/2018",
//        acceptUsers: ["Bob"],
//        rejectUsers: [],
//        from: "user1",
//        to: [
//          "user1",
//          "Bob",
//          "Michal",
//          "Geoff",
//          "Kelvin",
//          "Wendy",
//          "miaomiao"
//        ],
//        location: "3 Blawayn roda, Mongolisa, 3425"
//      },
//      {
//        subject: "When Binance 6666?",
//        date: "15/07/2018",
//        acceptUsers: ["Kelvin"],
//        rejectUsers: ["Qiangji"],
//        from: "user1",
//        to: [
//          "user1",
//          "Bob",
//          "Michal",
//          "Geoff",
//          "Kelvin",
//          "Wendy",
//          "miaomiao"
//        ],
//        location: "3 Blawayn roda, Mongolisa, 3425"
//      }
      ]
    };
    // console.log("hahahah");
    // console.log(this.state.eventList.filter(e => e.from == "user1").length);
  }

    randomize() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }   


  handleCreate = e => {
    e.preventDefault();
    console.log(this.state);
    console.log(
      this.subjectInput.value,
      this.locInput.value,
      this.pplInput.value,
      this.dptInput.value
    );
    
    var id = this.randomize()
    this.create_invite(id, this.subjectInput.value, this.dptInput.value, this.locInput.value, this.pplInput.value) 

    this.setState({
      eventList: [
        ...this.state.eventList,
        {
          subject: this.subjectInput.value,
          location: this.locInput.value,
          to: this.pplInput.value.toString().split(","),
          date: this.dptInput.value,
          acceptUsers: [],
          rejectUsers: [],
          from: this.state.currentUser
        }
      ]
    });
    // currentId: this.state.currentId + 1;
    // });
  };

  handeleEventConfirmation = (item, str, e) => {
    console.log(item);
    const eventList = this.state.eventList;
    console.log(eventList.length);
    if (str == "yes") {
      item.acceptUsers.push(this.state.currentUser)
      this.accept(item.id)
    }
    else {
      item.rejectUsers.push(this.state.currentUser);
      this.decline(item.id)
    }
    this.forceUpdate();
    this.setState({ eventList: eventList });
  };


    // =============== HELPER FUNCS ===============
    // ============================================
    handlePostId(e) {
        this.setState({
            postId: e.target.value
        });
    }

    handlePostTitle(e) {
        this.setState({
            postTitle: e.target.value
        });
    }

    handlePost(e) {
        this.setState({
            post: e.target.value
        });
    }

    handleMap = async func => {
        var result = await func;
        var deserial = sc.deserialize(result)
        var map = this.process_map(deserial)
        return map
    }

    handleArray = async func => {
        var result = await func;
        var deserial = sc.deserialize(result)
        console.log("DESERIALIZED THIS")
        var array = this.process_array(deserial)
        return array
    }

    process_map(d) {
        if (d.type != "Map") {
            return null
        }   
        var new_map = new Map();
        var key;
        var value;
        for (var i=0; i<d.value.length; i++) {
            key = this.convert_type(d.value[i].key)
            // Handle known Integer keys as Integer (rather than ByteArray)
            if (known_integer_keys.indexOf(key) >= 0) {
                d.value[i].value.type = "Integer"
            }   
            value = this.convert_type(d.value[i].value)
            new_map.set(key, value);
        }   
        return new_map
    };

    process_array(d) {
        if (d.type != "Array") {
            return null
        }
        var new_array = [];
        var value;
        for (var i=0; i<d.value.length; i++) {
            new_array.push(this.convert_type(d.value[i]));
        }
        return new_array
    };

    convert_type(v) {
        var value;
        if (v.type == "ByteArray") {
            value = u.hexstring2str(v.value)
        }
        if (v.type == "Integer") {
            value = parseInt(u.reverseHex(v.value), 16)
        }
        if (v.type == "Array") {
            value = this.process_array(v)
        }
        if (v.type == "Map") {
            value = this.process_map(v)
        }
        return value
    }

    handleStorage(key, enc_in, dec_out) {
        return this.props.nos.getStorage({scriptHash, key, encodeInput: enc_in, decodeOutput: dec_out});
    } 

    // ================ Invite API ==================
    // ===============================================

    async get_event(eventId) {
        var q = await this.handleMap(this.handleStorage(eventId, true, false))
        // DEBUG
        for (var [key, value] of q) {
          console.log(key + ' = ' + value);
        }
        return q
    }

    async accept(inviteId) {
        var address = await this.props.nos.getAddress();
        console.log(address);
    
        var operation = "Accept";
        var args = [address, inviteId];
        console.log("=============== ACCEPTING ==============")
        console.log(address)
        console.log(inviteId)
        console.log("========================================")
        var invoke = { 
            scriptHash,
            operation,
            args};
            //encodeArgs: false };

        var txid = await this.props.nos.invoke(invoke);

        // DEBUG
        console.log(txid);
    }   

    async decline(inviteId) {
        var address = await this.props.nos.getAddress();
        console.log(address);
    
        var operation = "Decline";
        var args = [address, inviteId];
        var invoke = {
            scriptHash,
            operation,
            args};
            //encodeArgs: false };

        var txid = await this.props.nos.invoke(invoke);

        // DEBUG
        console.log(txid);
    }

    hexToString (hex) {
        var string = ''; 
        for (var i = 0; i < hex.length; i += 2) {
          string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return string;
    }  

    async get_address_string() {
        
        var address = await this.props.nos.getAddress()
        console.log(address)
        var encoded_address = u.reverseHex(wallet.getScriptHashFromAddress(address))
        console.log(encoded_address)
        var addr_string = this.hexToString(encoded_address)
        console.log(addr_string)
        return addr_string
    }

    async get_my_invites(wallet_id) {
        console.log("AAAAAAAAAAAAAA")
        var q = await this.handleArray(this.handleStorage(wallet_id, true, false))
        console.log("BBBBBBBBBBBBB")
        console.log(q)
        // DEBUG
      //for (var [key, value] of q) {
      //  console.log(key + ' = ' + value);
      //}
        return q
    }

    async create_invite(inviteId, text, date, loc, invitees) {
        var address = await this.props.nos.getAddress();
        console.log(address);
        
        var operation = "CreateInvite";
        console.log("Invitees = " + invitees)
        var tmp_args = [address, inviteId, text, date, loc];
        var invitees_array = invitees.split(",")
        console.log("After split = " + invitees_array)
        var args = tmp_args.concat(invitees_array)
        var invoke = {
            scriptHash,
            operation,
            args};
            //encodeArgs: false };

        var txid = await this.props.nos.invoke(invoke);

        // DEBUG
        console.log(txid);
    }

    async remove_invite(inviteId) {
        var address = await this.props.nos.getAddress();
        console.log(address);
        
        var operation = "RemoveInvite";
        var args = [address, inviteId];
        var invoke = {
            scriptHash,
            operation,
            args};
            //encodeArgs: false };

        var txid = await this.props.nos.invoke(invoke);

        // DEBUG
        console.log(txid);
    }



  render() {
    // let totalYes = 0
    // let totalNo = 0
    // this.state.eventList.forEach((item) => {
    //     item.Status ? totalYes++ : totalNo++
    // })

    return (
      <div className="page-wrapper">
        <section
          className="schedule-section"
          id="schedule-tab"
          style={{ "background-image": "url(../image/8.jpg);" }}
        >
          <div className="overlay-bg" />
          <div className="container schedule-wrap">
            <div className="section-title text-center">
              <h3>
                Event <span>Schedule</span>
              </h3>
            </div>
            <div className="schedule-area">
              <div className="schedule-tab-title">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <td
                          className="item active"
                          data-tab-name="inviteRecived"
                        >
                          <div className="item-text">
                            <i className="fa fa-calendar" aria-hidden="true" />
                            <h5>Recived</h5>
                          </div>
                        </td>
                        <td className="item" data-tab-name="inviteSend">
                          <div className="item-text">
                            <i className="fa fa-calendar" aria-hidden="true" />
                            <h5>Sent</h5>
                          </div>
                        </td>
                        <td className="item" data-tab-name="inviteCreate">
                          <div className="item-text">
                            <i className="fa fa-calendar" aria-hidden="true" />
                            <h5>Create New</h5>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="schedule-tab-content clearfix">
                <div id="inviteRecived">
                  <div className="inner-box  table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Subject</th>
                          <th>Location</th>
                          <th>Decision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* geoff is currentUser */}
                        {this.state.eventList
                          .filter(e => e.from != this.state.currentUser)
                          .map((item, index) => {
                            let decision = "";
                            var current_user = this.state.currentUser;
                            if (item.acceptUsers.indexOf(this.state.currentUser) >= 0) {
                              decision = "yes";
                            } else if (item.rejectUsers.indexOf(this.state.currentUser) >= 0) {
                              decision = "no";
                            } else {
                              decision = "unknown";
                            }
                            // const userDecision = item.acceptUsers.includes("Geoff") ? true : ;
                            console.log(decision);
                            return (
                              <tr>
                                <td className="time">
                                  <i
                                    className="fa fa-clock-o"
                                    aria-hidden="true"
                                  />
                                  <strong>{item.date}</strong>
                                </td>
                                <td className="subject">{item.subject}</td>
                                <td className="subject">{item.location}</td>
                                <td className="venue">
                                  <div
                                    className="btn-group"
                                    id="status"
                                    data-toggle="buttons"
                                  >
                                    {decision == "unknown" ? (
                                      <span>
                                        <label
                                          className="btn btn-default btn-on"
                                          onClick={e =>
                                            this.handeleEventConfirmation(
                                              item,
                                              "yes",
                                              e
                                            )
                                          }
                                        >
                                          <input
                                            type="radio"
                                            value="1"
                                            name="multifeatured_module[module_id][status]"
                                          />Confirm
                                        </label>
                                        <label
                                          className="btn btn-default btn-off"
                                          onClick={e =>
                                            this.handeleEventConfirmation(
                                              item,
                                              "no",
                                              e
                                            )
                                          }
                                        >
                                          <input
                                            type="radio"
                                            value="0"
                                            name="multifeatured_module[module_id][status]"
                                          />Reject
                                        </label>
                                      </span>
                                    ) : decision == "yes" ? (
                                      <label className="btn btn-default btn-on active">
                                        <input
                                          type="radio"
                                          value="1"
                                          name="multifeatured_module[module_id][status]"
                                          checked="checked"
                                        />Accepted
                                      </label>
                                    ) : (
                                      <label className="btn btn-default btn-on active">
                                        <input
                                          type="radio"
                                          value="1"
                                          name="multifeatured_module[module_id][status]"
                                          checked="checked"
                                        />Rejected
                                      </label>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="inviteSend">
                  <div className="inner-box table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Subject</th>
                          <th>Where</th>
                          <th>Sent To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.eventList
                          .filter(e => e.from == this.state.currentUser)
                          .map((item, index) => {
                            return (
                              <tr>
                                <td className="time">
                                  <i
                                    className="fa fa-clock-o"
                                    aria-hidden="true"
                                  />
                                  <strong>{item.date}</strong>
                                </td>
                                <td className="subject">{item.subject}</td>
                                <td className="subject">{item.location}</td>
                                <td className="venue">
                                  {item.to.map((v, i) => {
                                    return (
                                      <button className="btn m-1 btninvite">
                                        {v}
                                      </button>
                                    );
                                  })}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="inviteCreate">
                  <form
                    id="contact-form"
                    name="contact_form"
                    className="default-form"
                    novalidate="novalidate"
                    onSubmit={this.handleCreate}
                  >
                    <div className="row">
                      <div className="col-md-12 col-sm-6 col-xs-12">
                        <div className="col-md-4 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Subject"
                              ref={input => {
                                this.subjectInput = input;
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <div
                              id="datepicker"
                              className="input-group date"
                              data-date-format="mm-dd-yyyy"
                            >
                              <input
                                className="form-control"
                                type="text"
                                readonly=""
                                ref={input => {
                                  this.dptInput = input;
                                }}
                              />
                              <span className="input-group-addon">
                                <i
                                  className="fa fa-calendar"
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Address"
                              ref={input => {
                                this.locInput = input;
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 col-sm-6 col-xs-12">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="People"
                              ref={input => {
                                this.pplInput = input;
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group text-center">
                          <input
                            id="form_botcheck"
                            name="form_botcheck"
                            className="form-control"
                            type="hidden"
                            value=""
                          />
                          <button
                            id="btn-create"
                            className="btn-style-one"
                            type="submit"
                            data-tab-name="inviteSend"
                            onClick={this.handleCreate}
                          >
                            send message
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}


Vote.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(Vote));

