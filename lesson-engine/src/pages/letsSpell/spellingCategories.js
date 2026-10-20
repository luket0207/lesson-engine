import bearImage from '../../assets/images/animals/bear.png';
import catImage from '../../assets/images/animals/cat.png';
import cowImage from '../../assets/images/animals/cow.png';
import dogImage from '../../assets/images/animals/dog.png';
import duckImage from '../../assets/images/animals/duck.png';
import fishImage from '../../assets/images/animals/fish.png';
import foxImage from '../../assets/images/animals/fox.png';
import frogImage from '../../assets/images/animals/frog.png';
import lionImage from '../../assets/images/animals/lion.png';
import pigImage from '../../assets/images/animals/pig.png';
import appleImage from '../../assets/images/food/apple.png';
import breadImage from '../../assets/images/food/bread.png';
import cakeImage from '../../assets/images/food/cake.png';
import cornImage from '../../assets/images/food/corn.png';
import eggImage from '../../assets/images/food/egg.png';
import hamImage from '../../assets/images/food/ham.png';
import pizzaImage from '../../assets/images/food/pizza.png';
import riceImage from '../../assets/images/food/rice.png';
import soupImage from '../../assets/images/food/soup.png';
import sushiImage from '../../assets/images/food/sushi.png';
import baseballImage from '../../assets/images/sports/baseball.png';
import boxingImage from '../../assets/images/sports/boxing.png';
import golfImage from '../../assets/images/sports/golf.png';
import karateImage from '../../assets/images/sports/karate.png';
import pingPongImage from '../../assets/images/sports/pingpong.png';
import rugbyImage from '../../assets/images/sports/rugby.png';
import soccerImage from '../../assets/images/sports/soccer.png';
import sumoImage from '../../assets/images/sports/sumo.png';
import swimmingImage from '../../assets/images/sports/swimming.png';
import tennisImage from '../../assets/images/sports/tennis.png';
import beltImage from '../../assets/images/clothes/belt.png';
import coatImage from '../../assets/images/clothes/coat.png';
import dressImage from '../../assets/images/clothes/dress.png';
import hatImage from '../../assets/images/clothes/hat.png';
import shirtImage from '../../assets/images/clothes/shirt.png';
import shoeImage from '../../assets/images/clothes/shoe.png';
import shortsImage from '../../assets/images/clothes/shorts.png';
import skirtImage from '../../assets/images/clothes/skirt.png';
import sockImage from '../../assets/images/clothes/sock.png';
import vestImage from '../../assets/images/clothes/vest.png';

const createItem = (categoryId, id, word, image) => ({
  id: `${categoryId}-${id}`,
  word,
  image,
  categoryId,
});

export const SPELLING_CATEGORIES = [
  {
    id: 'animals',
    displayName: 'Animals',
    imageFolder: 'src/assets/images/animals/',
    items: [
      createItem('animals', 'cat', 'Cat', catImage),
      createItem('animals', 'dog', 'Dog', dogImage),
      createItem('animals', 'pig', 'Pig', pigImage),
      createItem('animals', 'cow', 'Cow', cowImage),
      createItem('animals', 'fox', 'Fox', foxImage),
      createItem('animals', 'bear', 'Bear', bearImage),
      createItem('animals', 'lion', 'Lion', lionImage),
      createItem('animals', 'fish', 'Fish', fishImage),
      createItem('animals', 'frog', 'Frog', frogImage),
      createItem('animals', 'duck', 'Duck', duckImage),
    ],
  },
  {
    id: 'food',
    displayName: 'Food',
    imageFolder: 'src/assets/images/food/',
    items: [
      createItem('food', 'egg', 'Egg', eggImage),
      createItem('food', 'ham', 'Ham', hamImage),
      createItem('food', 'rice', 'Rice', riceImage),
      createItem('food', 'corn', 'Corn', cornImage),
      createItem('food', 'cake', 'Cake', cakeImage),
      createItem('food', 'soup', 'Soup', soupImage),
      createItem('food', 'bread', 'Bread', breadImage),
      createItem('food', 'pizza', 'Pizza', pizzaImage),
      createItem('food', 'sushi', 'Sushi', sushiImage),
      createItem('food', 'apple', 'Apple', appleImage),
    ],
  },
  {
    id: 'sports',
    displayName: 'Sports',
    imageFolder: 'src/assets/images/sports/',
    items: [
      createItem('sports', 'golf', 'Golf', golfImage),
      createItem('sports', 'sumo', 'Sumo', sumoImage),
      createItem('sports', 'rugby', 'Rugby', rugbyImage),
      createItem('sports', 'tennis', 'Tennis', tennisImage),
      createItem('sports', 'soccer', 'Soccer', soccerImage),
      createItem('sports', 'karate', 'Karate', karateImage),
      createItem('sports', 'boxing', 'Boxing', boxingImage),
      createItem('sports', 'baseball', 'Baseball', baseballImage),
      createItem('sports', 'swimming', 'Swimming', swimmingImage),
      createItem('sports', 'ping-pong', 'Ping Pong', pingPongImage),
    ],
  },
  {
    id: 'clothes',
    displayName: 'Clothes',
    imageFolder: 'src/assets/images/clothes/',
    items: [
      createItem('clothes', 'hat', 'Hat', hatImage),
      createItem('clothes', 'sock', 'Sock', sockImage),
      createItem('clothes', 'coat', 'Coat', coatImage),
      createItem('clothes', 'shoe', 'Shoe', shoeImage),
      createItem('clothes', 'vest', 'Vest', vestImage),
      createItem('clothes', 'belt', 'Belt', beltImage),
      createItem('clothes', 'shirt', 'Shirt', shirtImage),
      createItem('clothes', 'skirt', 'Skirt', skirtImage),
      createItem('clothes', 'dress', 'Dress', dressImage),
      createItem('clothes', 'shorts', 'Shorts', shortsImage),
    ],
  },
];

export default SPELLING_CATEGORIES;
