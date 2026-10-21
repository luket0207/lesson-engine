import blueBoxImage from '../../assets/images/boxes/blue.png';
import greenBoxImage from '../../assets/images/boxes/green.png';
import orangeBoxImage from '../../assets/images/boxes/orange.png';
import purpleBoxImage from '../../assets/images/boxes/purple.png';
import redBoxImage from '../../assets/images/boxes/red.png';
import yellowBoxImage from '../../assets/images/boxes/yellow.png';

export const BOXES_BY_COLOR = Object.freeze({
  red: Object.freeze({ color: 'red', displayName: 'Red', image: redBoxImage }),
  blue: Object.freeze({ color: 'blue', displayName: 'Blue', image: blueBoxImage }),
  yellow: Object.freeze({
    color: 'yellow',
    displayName: 'Yellow',
    image: yellowBoxImage,
  }),
  green: Object.freeze({
    color: 'green',
    displayName: 'Green',
    image: greenBoxImage,
  }),
  orange: Object.freeze({
    color: 'orange',
    displayName: 'Orange',
    image: orangeBoxImage,
  }),
  purple: Object.freeze({
    color: 'purple',
    displayName: 'Purple',
    image: purpleBoxImage,
  }),
});

export const BOX_OPTIONS = Object.freeze(Object.values(BOXES_BY_COLOR));

export default BOXES_BY_COLOR;
