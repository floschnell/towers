import React from 'react';
import FieldContainer from '../../Field/FieldContainer';
import css from './Board.styl';

export default class Board extends React.Component {
  
  render() {
    
    const boardState = this.props.fields;
    
    const renderRow = (row, y) => {
      const rowKey = `row-${y}`;
      return row.map(
          (field, x) => renderField(field, x, y)
        );
    };
    
    const renderField = (field, x, y) => {
      const key = `test-${y}-${x}`;
      return <FieldContainer key={key} x={x} y={y} color={field.color} onClick={this.props.onClick} surfaceSize={this.props.surfaceSize} />;
    };
    
    return <div className="board">
      {boardState.map(
        (row, y) => renderRow(row, y)
      )}
    </div>;
  }
}

Board.defaultProps = {
  fields: []
}

Board.propTypes = {
  fields: React.PropTypes.array
}
