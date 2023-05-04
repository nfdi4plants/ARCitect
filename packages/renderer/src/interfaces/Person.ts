import {Property,PropertyTree} from './Property.ts';

class Person extends PropertyTree {
  constructor(){
    super([
      new Property('ORCID'),
      new Property('firstName'),
      new Property('lastName'),
      new Property('email'),
      new Property('phone'),
      new Property('fax'),
      new Property('address'),
      new Property('affiliation'),
    ]);
  }
}

export default Person;
