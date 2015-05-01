var React = require('react');
var Classable = require('../mixins/classable');
var WindowListenable = require('../mixins/window-listenable');
var DateTime = require('../utils/date-time');
var KeyCode = require('../utils/key-code');
var TimeDisplay = require('./time-display');
var SlideInTransitionGroup = require('../transition-groups/slide-in');
var FlatButton = require('../flat-button');

var Clock = React.createClass({

  mixins: [Classable, WindowListenable],

  propTypes: {
    initialTime: React.PropTypes.object,
    isActive: React.PropTypes.bool,
    onSelectedTime: React.PropTypes.func
  },

  windowListeners: {
    'keydown': '_handleWindowKeyDown'
  },

  getDefaultProps: function() {
    return {
      initialTime: new Date()
    };
  },

  getInitialState: function() {
    return {
      selectedTime: DateTime.roundMinutesToNearest(this.props.initialTime, 15)
    };
  },

  render: function() {
    var in12hr = this.isAM() ? this.state.selectedTime : DateTime.to12Hr(this.state.selectedTime);

    var hourButtons = [];
    for(var i=1; i <= 12; i++) {
      hourButtons.push(<div onClick={this.setHours.bind(null, i)} className={in12hr.getHours() == i ? 'selected hbtn' : 'hbtn'}>{i}</div>)
    };

    var minuteButtons = [];
    for(var i=0; i <= 3; i++) {
      m = i*15;
      minuteButtons.push(<div onClick={this.setMinutes.bind(null, m)} className={in12hr.getMinutes() == m ? 'selected mbtn' : 'mbtn'}>{m}</div>)
    };

    console.log(this.state.selectedTime);
    console.log(this.isAM());

    return (
      <div className="mui-time-picker-clock-container">
        <div className="clock">
          <div className="clock-face">
            <div>
              {hourButtons}
            </div>
            <div>
              {minuteButtons}
            </div>
          </div>
        </div>
        <div className="am-pm"> 
          <FlatButton className="am" label="AM" secondary={!this.isAM()} onClick={this.toggleAM.bind(null, true)} />
          <FlatButton className="pm" label="PM" secondary={this.isAM()} onClick={this.toggleAM.bind(null, false)} />
        </div>
      </div>
    );
  },

  isAM: function() {
    return DateTime.isAM(this.state.selectedTime);
  },

  toggleAM: function(toAM) {
    var dt = (toAM ? DateTime.to12Hr(this.state.selectedTime) : DateTime.to24Hr(this.state.selectedTime));
    this.setState({selectedTime: dt});
    this.props.onSelectedTime(dt);
  },

  setHours: function(h) {
    var isAM = DateTime.isAM(this.state.selectedTime);
    var dt = new Date(this.state.selectedTime.setHours(h));
    dt = isAM ? dt : DateTime.to24Hr(dt,false);
    this.setState({
      selectedTime: dt
    })
    this.props.onSelectedTime(dt);
  },

  setMinutes: function(h) {
    var dt = new Date(this.state.selectedTime.setMinutes(h))
    this.setState({
      selectedTime: dt
    })
    this.props.onSelectedTime(dt);
  },

  getSelectedTime: function() {
    return this.state.selectedTime;
  }

});

module.exports = Clock;