import React from 'react';
//react-spinners is an npm package
import { BounceLoader} from 'react-spinners';


export default function ReactSpinner(props) {
    return (
      <span className='react-spinner'>
        <BounceLoader
          sizeUnit={"px"}
          size={30}
          color={'#000'}
          loading={this.props.loading}
        />
      </span>
    )
};
