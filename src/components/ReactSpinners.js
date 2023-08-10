import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

export default function ReactSpinner({ loadingSpinner }) {
  return (
    <span className='react-spinner'>
      <BounceLoader sizeUnit={'px'} size={30} color={'#000'} loading={loadingSpinner} />
    </span>
  );
}
