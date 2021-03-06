import React from 'react';
import classes from './Category.module.css';
import PinkButton from '../../UI/Button/PinkButton';

export default function Category(props) {
  let imageClasses = [classes.Image];
  if (props.name === 'גלידה') {
    imageClasses.push(classes.Icecream);
  } else {
    if (props.name === 'יוגורט') {
      imageClasses.push(classes.Yogurt);
    } else {
      if (props.name === 'וופל בלגי') {
        imageClasses.push(classes.Waffle);
      }
    }
  }
  return (
    <div className={classes.Card}>
      <div className={imageClasses.join(' ')}> </div>
      <div className={classes.MoreInfo}>
        <h3> {props.name}</h3>
        <p>{props.description}</p>
        <PinkButton text='ראה עוד' />
      </div>
    </div>
  );
}
