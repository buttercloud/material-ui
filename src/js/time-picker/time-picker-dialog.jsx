var React = require('react');
var Classable = require('../mixins/classable');
var WindowListenable = require('../mixins/window-listenable');
var DateTime = require('../utils/date-time');
var KeyCode = require('../utils/key-code');
var DialogWindow = require('../dialog-window');
var FlatButton = require('../flat-button');
var TimeDisplay = require('./time-display');
var Clock = require('./clock');

var TimePickerDialog = React.createClass({

  mixins: [Classable, WindowListenable],

  propTypes: {
    initialTime: React.PropTypes.object,
    onAccept: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onDismiss: React.PropTypes.func
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },

  getInitialState: function() {
    return {
      displayDate: DateTime.getFirstDayOfMonth(this.props.initialTime),
      selectedTime: this.props.initialTime
    };
  },

  render: function() {
    var {
      initialTime,
      onAccept,
      ...other
    } = this.props;
    var classes = this.getClasses('mui-time-picker-dialog');
    var actions = [
      <FlatButton
        key={0}
        label="Cancel"
        secondary={true}
        onTouchTap={this._handleCancelTouchTap} />,
      <FlatButton
        key={1}
        label="OK"
        secondary={true}
        onTouchTap={this._handleOKTouchTap} />
    ];

    if(this.props.autoOk){
      actions = actions.slice(0, 1);
    }

    return (
      <DialogWindow {...other}
        ref="dialogWindow"
        className={classes}
        actions={actions}
        contentClassName="mui-time-picker-dialog-window"
        onDismiss={this._handleDialogDismiss}
        onShow={this._handleDialogShow}
        repositionOnUpdate={false}>

        <div className='mui-time-picker-clock-and-display'> 
          <TimeDisplay
            ref="time-display"
            selectedTime={this.state.selectedTime}/>
          <Clock
            ref="clock"
            onSelectedTime={this._onSelectedTime}
            initialTime={this.props.initialTime}
            isActive={this.state.isCalendarActive} />

        </div>
      </DialogWindow>
    );
  },

  show: function() {
    this.refs.dialogWindow.show();
  },

  dismiss: function() {
    this.refs.dialogWindow.dismiss();
  },

  _onSelectedTime: function(d){
    this.setState({
      selectedTime: d
    });
    if(this.props.autoOk){
      setTimeout(this._handleOKTouchTap.bind(this), 300);
    }
  },

  _handleCancelTouchTap: function() {
    this.dismiss();
  },

  _handleOKTouchTap: function() {
    this.dismiss();
    if (this.props.onAccept) {
      this.props.onAccept(this.refs.clock.getSelectedTime());
    }
  },

  _handleDialogShow: function() {
    if(this.props.onShow) {
      this.props.onShow();
    }
  },

  _handleDialogDismiss: function() {
    if(this.props.onDismiss) {
      this.props.onDismiss();
    }
  },

  _handleWindowKeyUp: function(e) {
    if (this.refs.dialogWindow.isOpen()) {
      switch (e.keyCode) {
        case KeyCode.ENTER:
          this._handleOKTouchTap();
          break;
      }
    }
  }

});

module.exports = TimePickerDialog;
