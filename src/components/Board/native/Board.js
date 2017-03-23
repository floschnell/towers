import React from 'react';
import FieldContainer from '../../Field/FieldContainer';
import {
  View
} from 'react-native';

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
      const key = `field-${y}-${x}`;

      return <FieldContainer key={key} color={field.color} x={x} y={y} surfaceSize={this.props.size} />;
    };
    
    return <View style={{width: this.props.size, height: this.props.size, justifyContent:'flex-start', alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'black' }}>
      {boardState.map(
        (row, y) => renderRow(row, y)
      )}
    </View>;
  }
}

Board.defaultProps = {
  fields: []
}

Board.propTypes = {
  fields: React.PropTypes.array
}