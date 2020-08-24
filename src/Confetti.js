import React from 'react'
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

  const snakeJazz = this.props.confettiFalling
export default () => {


  // const { width, height } = useWindowSize()



  return (
    <Confetti
        // width={width}
        // height={height}
        // is the confetti falling or not?
        run={snakeJazz}
        numberOfPieces={200}
        recycle={false}
        tweenDuration={200}
        colors={this.props.colorRound.allColorBubbles}
        opacity={0.5}
        gravity={0.4}
        // initialVelocityX={10}
        // initialVelocityY={100}
    />
  )
}







