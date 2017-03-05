import React from 'react';
import css from './Dialog.styl';

export default class Dialog extends React.Component {
  render() {
      const renderButtons = (buttons) => {
          return buttons.map((button, index) => <div key={index} className="button" onClick={button.action}>{button.text}</div>);
      }
      
    return <div className="dialog">
        {this.props.message}
        {renderButtons(this.props.buttons)}
      </div>;
  }
}