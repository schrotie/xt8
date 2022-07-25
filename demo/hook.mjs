import {create, hookDel, hookGet, hookSet, CONTINUE} from '../index.mjs';

const obj   = {};
const state = create(obj);

const str = v => JSON.stringify(v);

// This will get called, whenever any property is set
hookSet((path, target, prop, value) => {
	console.log(`set ${path} on ${str(target)}[${prop}] to ${str(value)}`);
	return CONTINUE; // tells the hook processor to call next callback
});

hookDel('a.b', (path, target, prop) => {
	const str = v => JSON.stringify(v);
	console.log(`delete ${path} on ${str(target)}[${prop}]`);
	delete obj.a.b;
	return true; // tells hook processor that delete was processed successfully
});

hookGet('c', (path, target, prop) => {
	console.log(`get ${path} from ${str(target)}[${prop}]`);
	return 'computed value';
});

state.a = {};          // -> set a on {}[a] to {}
state.a.b = '';        // -> set a.b on {}[b] to ""
delete state.a.b;      // -> delete a.b on {"b":""}[b]
console.log(state.c);  // -> get c from {"a":{}}[c]
                       // -> computed value
