import {CONTINUE, hookDel, hookGet, hookSet} from './hook.mjs';

const all = [hookDel, hookGet, hookSet];
function register(path, validator, ...hooks) {
	for(const hook of hooks) hook(path || '*', validator);
}

export function mustHave(path) {register(path, mustHaveValidator, ...all);}
export function mustHaveValidator(path, target, prop) {
	if((prop in target) || isWellKnownSymbol(prop)) return CONTINUE;
	throw new Error(`Cannot access non-existing property "${path}"`);
}

export function isWellKnownSymbol(s) {
	if(typeof s !== 'symbol') return false;
	const symbols = Object.getOwnPropertyNames(Symbol).map(n => Symbol[n]);
	return symbols.indexOf(s) !== -1;
}

export function mustHaveOwn(path) {
	register(path, mustHaveOwnValidator, ...all);}
export function mustHaveOwnValidator(path, target, prop) {
	if(Object.prototype.hasOwnProperty.call(target, prop)) return CONTINUE;
	throw new Error(`Cannot access non-own property "${path}"`);
}

export function addPropOnlyArray(path) {
	register(path, addPropOnlyArrayValidator, hookSet);}
export function addPropOnlyArrayValidator(path, target, prop) {
	if(Object.prototype.hasOwnProperty.call(target, prop)) return CONTINUE;
	if(Array.isArray(target) && (prop == target.length))   return CONTINUE;
	throw new Error(`Adding "${path}" to store  is not allowed`);
}

export function delPropOnlyArray(path) {
	register(path, delPropOnlyArrayValidator, hookDel);}
export function delPropOnlyArrayValidator(path, target, prop) {
	if(Array.isArray(target)) return CONTINUE;
	throw new Error(`Deleting ${path} from store  is not allowed`);
}

export function sameType(path) {register(path, sameTypeValidator, hookSet);}
export function sameTypeValidator(path, target, prop, value) {
	if(typeof target[prop] === typeof value) return CONTINUE;
	throw new TypeError(`Cannot set ${typeof value} "${value}" to "${path}", \
must be type ${typeof target[prop]}`);
}

export function oneOf(path, values) {
	const validator = oneOfValidator(values);
	register(path, validator, hookSet);
	return validator;
}
export function oneOfValidator(enumarr) {
	return function(path, target, prop, value) {
		if(enumarr.indexOf(value) !== -1) return CONTINUE;
		const valid = enumarr.map(el => `"${el}"`).join(', ');
		throw new TypeError(
			`Invalid value "${value}" for "${path}", must be one of ${valid}`,
		);
	};
}

export function int(path) {register(path, intValidator, hookSet);}
export function intValidator(path, target, prop, value) {
	if((typeof value === 'number') && !(value % 1)) return CONTINUE;
	throw new TypeError(`Cannot set ${typeof value} "${value}" to "${path}", \
must be integer`);
}
