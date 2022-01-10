import React from 'react';
//react-spinners is an npm package
import BounceLoader from 'react-spinners/BounceLoader';


export default function ReactSpinner(props) {
    return (
      <span className='react-spinner'>
        <BounceLoader
          sizeUnit={"px"}
          size={30}
          color={'#000'}
          loading={props.loadingSpinner}
        />
      </span>
    )
};
