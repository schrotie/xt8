import {
	CONTINUE,
	hookDel,
	hookGet,
	hookSet,
	unhookDel,
	unhookGet,
	unhookSet,
} from './hook.mjs';
import {create} from './proxy.mjs';
import {
	/* delPropOnlyArray, delPropOnlyArrayValidator, */isWellKnownSymbol,
} from './validate.mjs';

export function configureTemplate(template) {
	const getter = getFromTemplate(template);
	const setter = setAsInTemplate(template);
	// delPropOnlyArray('*');
	hookGet(getter);
	hookSet(setter);
	return revert(getter, setter);
}

function revert(getter, setter) {return function() {
	// unhookDel(delPropOnlyArrayValidator);
	unhookGet(getter);
	unhookSet(setter);
};}

function getFromTemplate(template) {return function(path, target, prop) {
	if((prop in target) || isWellKnownSymbol(prop)) return CONTINUE;
	path = path.split('.');
	const tmplProp = getPath(template, path);
	if(Array.isArray(tmplProp)     ) return create(target[prop] = [], path);
	if(typeof tmplProp === 'object') return create(target[prop] = {}, path);
	return null;
};}

function setAsInTemplate(template) {return function(path, target, prop, value) {
	path = path.split('.');
	if(Array.isArray(target)) {
		return setArrayAsInTemplate(template, path, target, prop, value);
	}
	else {
		if(value === null) return CONTINUE;
		if((typeof getPath(template, path)) === (typeof value)) return CONTINUE;
		throw new Error(`Cannot set invalid type "${typeof value}" ("${value}") \
to path "${path}"`);
	}
};}

function setArrayAsInTemplate(template, path, target, prop, value) {
	if(!/^\d+$/.test(prop) && (prop in target)) return CONTINUE;
	validateLength(path, target, prop);
	validateProperty(template, [...path.slice(0, -1), 0], value);
	return CONTINUE;
}

function validateLength(path, target, prop) {
	if(!/^\d+$/.test(prop) || (prop > target.length)) {
		throw new Error(`Cannot set invalid index "${path.join('.')}"`);
	}
}

function validateProperty(template, path, value) {
	if(value === null) return;
	if((typeof getPath(template, path)) !== (typeof value)) {
		throw new TypeError(`Cannot set invalid type "${typeof value}" \
("${value}") to path "${path.join('.')}"`);
	}
	if(Array.isArray(value))           validateArray( template, path, value);
	else if(typeof value === 'object') validateObject(template, path, value);
}

function validateArray(template, path, value) {
	for(const el of value) validateProperty(template, [...path, 0], el);
}

function validateObject(template, path, value) {
	for(const [key, v] of Object.entries(value)) {
		validateProperty(template, [...path, key], v);
	}
}

function getPath(obj, path) {
	for(const key of path) {
		if(Array.isArray(obj) && /^\d+$/.test(key)) {
			obj = obj[0];
			continue;
		}
		if(!(key in obj)) unknownError(path);
		obj = obj[key];
	}
	return obj;
}

function unknownError(path) {
	throw new Error(`Cannot access unknown property "${path.join('.')}"`);
}
