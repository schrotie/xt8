import {configureTemplate, create} from '../index.mjs';

const state = create({});
configureTemplate({
	atom: 0,
	obj: {
		atom: 0,
		obj: {atom: 0},
		array: [{a: 0, b: 0}],
	},
});

// console.log(state.foo);         // -> Error, not in template
console.log(state.atom);           // -> null
console.log(state);                // -> {}
state.obj.obj.atom = 1;
console.log(state);                // -> { obj: { obj: { atom: 1 } } }
// state.obj.obj.atom = '1';       // -> Error, invalid type
state.obj.array.push({a: 42, b: 4711});
console.log(state.obj.array);      // -> [ { a: 42, b: 4711 } ]
// state.obj.array.push(666);      // -> Error, invalid type
state.obj.array.push({a: 0});
console.log(state.obj.array);      // -> [ { a: 42, b: 4711 }, { a: 0 } ]
// state.obj.array.push({a: '0'}); // -> Error, invalid type
// state.obj.array.push({c: 0});   // -> Error, unknown property
