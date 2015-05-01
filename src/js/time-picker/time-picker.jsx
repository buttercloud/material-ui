var React = require('react');
var Classable = require('../mixins/classable');
var WindowListenable = require('../mixins/window-listenable');
var DateTime = require('../utils/date-time');
var KeyCode = require('../utils/key-code');
var TimePickerDialog = require('./time-picker-dialog');
var TextField = require('../text-field');

var TimePicker = React.createClass({

  mixins: [Classable, WindowListenable],

  propTypes: {
    defaultDate: React.PropTypes.object,
    formatTime: React.PropTypes.func,
    mode: React.PropTypes.oneOf(['portrait', 'landscape', 'inline']),
    onFocus: React.PropTypes.func,
    onTouchTap: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    minDate: React.PropTypes.object,
    maxDate: React.PropTypes.object,
    autoOk: React.PropTypes.bool,
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },

  getDefaultProps: function() {
    return {
      formatTime: DateTime.formatTime,
      autoOk: false
    };
  },

  getInitialState: function() {
    return {
      date: this.props.defaultDate,
      dialogTime: DateTime.roundMinutesToNearest(new Date(), 15)
    };
  },

  render: function() {
    var {
      formatTime,
      mode,
      onFocus,
      onTouchTap,
      onShow,
      onDismiss,
      autoOk,
      ...other
    } = this.props;
    var classes = this.getClasses('mui-time-picker', {
      'mui-is-landscape': this.props.mode === 'landscape',
      'mui-is-inline': this.props.mode === 'inline'
    });
    var defaultInputValue;

    if (this.props.defaultDate) {
      defaultInputValue = this.props.formatTime(this.props.defaultDate);
    }

    return (
      <div className={classes}>
        <TextField
          {...other}
          ref="input"
          defaultValue={defaultInputValue}
          onFocus={this._handleInputFocus}
          onTouchTap={this._handleInputTouchTap} />
        <TimePickerDialog
          autoOk={autoOk}
          ref="dialogWindow"
          initialTime={this.state.dialogTime}
          onAccept={this._handleDialogAccept}
          onShow={onShow}
          onDismiss={onDismiss} />
      </div>

    );
  },

  getTime: function() {
    return this.state.time;
  },

  setTime: function(d) {
    this.setState({
      date: d
    });
    this.refs.input.setValue(this.props.formatTime(d));
  },

  _handleDialogAccept: function(d) {
    this.setTime(d);
    if (this.props.onChange) this.props.onChange(null, d);
  },

  _handleInputFocus: function(e) {
    e.target.blur();
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleInputTouchTap: function(e) {
    this.setState({
      dialogTime: this.getTime()
    });

    this.refs.dialogWindow.show();
    if (this.props.onTouchTap) this.props.onTouchTap(e);
  },

  _handleWindowKeyUp: function(e) {
    //TO DO: open the dialog if input has focus
  }

});

module.exports = TimePicker;
