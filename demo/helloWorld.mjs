import {create, subscribe} from '../index.mjs';

const state = create(new (class {
	get greeting() {return `${this.address}, ${this.whom}!`;}
}));

subscribe(() => console.log('*'));
subscribe('whom', () => console.log('whom'));

state.address = 'Hello';
state.whom = 'World';

console.log(state.greeting);
// Hello, World!
// *
// whom
