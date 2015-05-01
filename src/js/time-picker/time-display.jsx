var React = require('react');
var Classable = require('../mixins/classable');
var DateTime = require('../utils/date-time');
var SlideInTransitionGroup = require('../transition-groups/slide-in');

var TimeDisplay = React.createClass({

  mixins: [Classable],

  propTypes: {
    selectedTime: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      transitionDirection: 'up',
      isAM: true
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var direction;
    if (nextProps.selectedTime !== this.props.selectedTime) {
      direction = nextProps.selectedTime > this.props.selectedTime ? 'up' : 'down';
      this.setState({
        transitionDirection: direction
      });
    }
  },

  render: function() {
    var {
      selectedTime,
      ...other
    } = this.props;
    var classes = this.getClasses('mui-time-picker-time-display');


    var hoursIn12Hr = DateTime.padTime(DateTime.to12Hr(this.props.selectedTime).getHours());
    var hours = DateTime.padTime(this.props.selectedTime.getHours());
    var minutes = DateTime.padTime(this.props.selectedTime.getMinutes());

    return (
      <div {...other} className={classes}>
        <div className="mui-time-picker-time-display-time">

          <SlideInTransitionGroup
            className="mui-time-picker-time-display-12hr"
            direction={this.state.transitionDirection}>
            <div>{hoursIn12Hr}:{minutes}<small>{DateTime.isAM(this.props.selectedTime) ? 'AM' : 'PM'}</small></div>
          </SlideInTransitionGroup>

          <SlideInTransitionGroup
            className="mui-time-picker-time-display-24hr"
            direction={this.state.transitionDirection}>
            <div>{hours}:{minutes}</div>
          </SlideInTransitionGroup>

        </div>

      </div>
    );
  }

});

module.exports = TimeDisplay;