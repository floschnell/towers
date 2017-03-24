import React from 'react';
import FieldContainer from '../../Field/FieldContainer';
import {
  View
} from 'react-native';

export default class Board extends React.Component {

  render() {

    const renderField = (field, x, y) => {
      const key = `field-${y}-${x}`;

      return <FieldContainer key={key} color={field.color} x={x} y={y} surfaceSize={this.props.size} />;
    };

    const renderRow = (row, y) => 
      row.map((field, x) => {
        const fieldX = this.props.reverse ? 7 - x : x;
        const fieldY = this.props.reverse ? 7 - y : y;

        return renderField(field, fieldX, fieldY);
      });

    const renderRows = () => 
      this.props.fields.map((row, y) => 
        renderRow(row, y)
      );
    
    return <View style={{
        width: this.props.size,
        height: this.props.size,
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'black'
      }}>
      {renderRows()}
    </View>;
  }
}

Board.defaultProps = {
  fields: []
}

Board.propTypes = {
  fields: React.PropTypes.array
}