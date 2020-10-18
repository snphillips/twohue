import React from 'react';
import { css } from 'emotion';
//react-spinners is an npm package
import { BounceLoader} from 'react-spinners';

// const override = css`
//     margin: 0 auto;
// `;

export default class ReactSpinner extends React.Component {
  render() {
    return (
      <span className='react-spinner'>
        <BounceLoader
          // className={override}
          sizeUnit={"px"}
          size={30}
          color={'#000'}
          loading={this.props.loading}
        />
      </span>
    )
  }
}
