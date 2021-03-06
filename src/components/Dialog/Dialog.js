import React from 'react';
import './Dialog.styl';
import PropTypes from 'prop-types';

/**
 * Renders a dialog window that consists of a message and buttons for interaction.
 */
export default class Dialog extends React.Component {
  /**
   * @override
   */
  render() {
    const renderButtons = (buttons) => {
      return buttons.map((button, index) => (
        <div key={index} className="button" onClick={button.action}>{button.text}</div>
      ));
    };

    return (
      <div className="dialog">
        {this.props.message}
        {renderButtons(this.props.buttons)}
      </div>
    );
  }
}

Dialog.propTypes = {
  message: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.object),
};
