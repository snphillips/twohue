import Chroma from 'chroma-js';
// ===============================================
// Hard-coded game-rounds. One day will make dynamic...
// ....one day.
// ===============================================

const colorRounds = [
{
  name: 'practice-orange',
  targetColor: '#f99356',
  solutionColors:['rgb(255, 0, 0)', 'rgb(237, 244, 33)'],
  solutionColor1: 'rgb(255, 0, 0)',
  solutionColor2: 'rgb(237, 244, 33)',
  wrongColors: ['rgb(177, 10, 136)', 'rgb(10, 177, 53)','rgb(203, 107, 5)', 'rgb(0, 0, 255)'],
  allColorBubbles: [ 'rgb(255, 0, 0)', 'rgb(237, 244, 33)', 'rgb(0, 0, 255)', 'rgb(177, 10, 136)',
  'rgb(10, 177, 53)', 'rgb(203, 107, 5)'],
},
{
  name: 'practice-orange',
  targetColor: '#f99356',
  solutionColors:['rgb(255, 0, 0)', 'rgb(237, 244, 33)'],
  solutionColor1: 'rgb(255, 0, 0)',
  solutionColor2: 'rgb(237, 244, 33)',
  wrongColors: ['rgb(177, 10, 136)', 'rgb(10, 177, 53)','rgb(203, 107, 5)', 'rgb(0, 0, 255)'],
  allColorBubbles: [ 'rgb(255, 0, 0)', 'rgb(237, 244, 33)', 'rgb(0, 0, 255)', 'rgb(177, 10, 136)',
  'rgb(10, 177, 53)', 'rgb(203, 107, 5)'],
},
{
  name: 'purple',
  targetColor: '#a35791',
  solutionColors:['rgb(255, 0, 0)','rgb(0, 0, 255)'],
  solutionColor1: 'rgb(255, 0, 0)',
  solutionColor2: 'rgb(0, 0, 255)',
  wrongColors: ['rgb(177, 10, 136)','rgb(177, 10, 136)','rgb(237, 244, 33)','rgb(203, 107, 5)'],
  allColorBubbles: [ 'rgb(255, 0, 0)', 'rgb(0, 0, 255)', 'rgb(177, 10, 136)', 'rgb(10, 177, 53)', 'rgb(237, 244, 33)', 'rgb(203, 107, 5)'],
},
{
  name: 'cmyk-01',
  targetColor: '#b397fc',
  solutionColors:['rgb(0, 255, 255)', 'rgb(255, 0, 255)'],
  solutionColor1: 'rgb(0, 255, 255)',
  solutionColor2: 'rgb(255, 0, 255)',
  wrongColors: ['rgb(255,255,0)', 'rgb(255, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0,255,0)'],
  allColorBubbles: ['rgb(0, 255, 255)', 'rgb(255, 0, 255)', 'rgb(255,255,0)',
  'rgb(255, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0,255,0)'],
},
{
  name: 'cmyk2-02',
  targetColor: '#935691',
  solutionColors:['rgb(0, 0, 0)','rgb(255, 0, 255)'],
  solutionColor1: 'rgb(0, 0, 0)',
  solutionColor2: 'rgb(255, 0, 255)',
  wrongColors: ['rgb(0, 255, 255)', 'rgb(255,255,0)', 'rgb(255,0,0)','rgb(0,255,0)'],
  allColorBubbles: ['rgb(0, 255, 255)', 'rgb(255, 0, 255)', 'rgb(255,255,0)',
  'rgb(255, 0, 0)', 'rgb(0, 0, 0)', 'rgb(0,255,0)'],
},
{
  name: 'lime green',
  targetColor: 'rgba(125, 202, 84, 1)',
  solutionColors:['rgb(245, 248, 23)','rgb(0, 153, 51)'],
  solutionColor1: 'rgb(245, 248, 23)',
  solutionColor2: 'rgb(0, 153, 51)',
  wrongColors: ['rgb(38, 74, 191)','rgb(14, 229, 136)','rgb(158,  237, 81)','rgb(223,  171, 12)'],
  allColorBubbles: ['rgb(245, 248, 23)', 'rgb(0, 153, 51)', 'rgb(38, 74, 191)',
  'rgb(14, 229, 136)', 'rgb(158,  237, 81)', 'rgb(223,  171, 12)'],
},
{
  name: 'blue',
  targetColor: 'rgba(93, 124, 251, 1)',
  solutionColors: ['rgb(112, 3, 251)', 'rgb(3, 236, 251)'],
  solutionColor1: 'rgb(112, 3, 251)',
  solutionColor2: 'rgb(3, 236, 251)',
  wrongColors: ['rgb(3, 112, 251)', 'rgb(37, 3, 251)', 'rgb(78, 122, 209)', 'rgb(133, 203, 245)'],
  allColorBubbles: ['rgb(112, 3, 251)', 'rgb(3, 236, 251)', 'rgb(3, 112, 251)',
  'rgb(37, 3, 251)', 'rgb(78, 122, 209)', 'rgb(133, 203, 245)'],
},
{
  name: 'pinky',
  targetColor: 'rgb(244, 118, 150)',
  solutionColors: ['rgb(239, 37, 58)','rgb(250, 157, 252)'],
  solutionColor1: 'rgb(239, 37, 58)',
  solutionColor2: 'rgb(250, 157, 252)',
  wrongColors: ['rgb(106, 108, 235)', 'rgb(169, 106, 235)', 'rgb(236, 93, 139)', 'rgb(111, 37, 239)'],
  allColorBubbles: ['rgb(239, 37, 58)', 'rgb(250, 157, 252)', 'rgb(106, 108, 235)', 'rgb(169, 106, 235)', 'rgb(236, 93, 139)', 'rgb(111, 37, 239)'],
},
{
  name: 'fawn',
  targetColor: 'rgb(207, 181, 95)',
  solutionColors:['rgb(174, 131, 68)','rgb(236, 223, 18)'],
  solutionColor1: 'rgb(174, 131, 68)',
  solutionColor2: 'rgb(236, 223, 18)',
  wrongColors: ['rgb(202, 173, 10)', 'rgb(176, 209, 28)','rgb(247, 243, 214)','rgb(148, 104, 16 )'],
  allColorBubbles: ['rgb(174, 131, 68)', 'rgb(236, 223, 18)', 'rgb(202, 173, 10)', 'rgb(176, 209, 28)', 'rgb(247, 243, 214)', 'rgb(148, 104, 16 )'],
},
{
  name: 'rose',
  targetColor: 'rgb(144, 112, 153)',
  solutionColors:['rgb(122, 22, 75)','rgb(133, 158, 220)'],
  solutionColor1: 'rgb(122, 22, 75)',
  solutionColor2: 'rgb(133, 158, 220)',
  wrongColors: ['rgb(95, 2, 68)', 'rgb(22, 22, 75)','rgb(19, 15, 25)', 'rgb(175, 74, 127)'],
  allColorBubbles: ['rgb(122, 22, 75)', 'rgb(133, 158, 220)', 'rgb(95, 2, 68)', 'rgb(22, 22, 75)', 'rgb(19, 15, 25)', 'rgb(175, 74, 127)'],
},
{
  name: 'green-gray',
  targetColor: 'rgba(157, 161, 154, 1)',
  solutionColors:['rgb(180, 123, 112)','rgb(112, 180, 171)'],
  solutionColor1: 'rgb(180, 123, 112)',
  solutionColor2: 'rgb(112, 180, 171)',
  wrongColors: ['rgb(112, 180, 118)', 'rgb(112, 124, 180)','rgb(161, 112, 180)','rgb(180, 146, 112)' ],
  allColorBubbles: ['rgb(180, 123, 112)', 'rgb(112, 180, 171)', 'rgb(112, 180, 118)', 'rgb(112, 124, 180)', 'rgb(161, 112, 180)', 'rgb(180, 146, 112)'],
}
];


export default colorRounds;
