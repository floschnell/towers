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
      return <FieldContainer key={key} color={field.color} surfaceSize={this.props.size} />;
    };
    
    return <View style={{width: this.props.size, height: this.props.size, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'green' }}>
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