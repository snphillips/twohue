import chroma from 'chroma-js';


let colorRound = {

  name: 'chroma-js',
  solutionColor1: chroma.random().hex(),
  solutionColor2: chroma.random().hex(),
  wrongColors: [
    chroma.random().hex(), chroma.random().hex(), chroma.random().hex(), chroma.random().hex()
  ],
  get targetColor() {
    return chroma.blend( chroma(this.solutionColor1).hex(), chroma(this.solutionColor2).hex(), 'multiply');
  },
  get solutionColors() {
    return [chroma(this.solutionColor1).hex(), chroma(this.solutionColor2).hex()]
  },
  get allColorBubbles() {
   return [this.solutionColor1, this.solutionColor2, this.wrongColors[0], this.wrongColors[1], this.wrongColors[2], this.wrongColors[3] ]
  }
};



export default colorRound;
