import {publish} from './subscribe.mjs';
import {callHookDel, callHookGet, callHookSet} from './hook.mjs';

export function create(obj, path = []) {
	return new Proxy(obj, new OHandler(path));
}

class OHandler {
	constructor(path) {this.path = path;}
	get(target, prop) {
		const path = [...this.path, prop.toString()];
		for(const result of callHookGet(path, target, prop)) return result;
		const p = target[prop];
		switch(typeof p) {
			case 'function': return p; // new Proxy(p, new FHandler(path, target));
			case 'object':   return create(p, path);
			default: return p;
		}
	}
	set(target, prop, value) {
		const path = [...this.path, prop.toString()];
		for(const result of callHookSet(path, target, prop, value)) return result;
		if(typeof target[prop] === 'object') {
			setSubObject(path, target[prop], value);
		}
		else setProp(path, target, prop, value);
		return true;
	}
	deleteProperty(target, prop) {
		const path = [...this.path, prop.toString()];
		for(const result of callHookDel(path, target, prop)) return result;
		// console.log('deleteProperty', target, prop);
		Reflect.deleteProperty(target, prop);
		publish(path);
		return true;
	}
}

function setSubObject(path, target, value) {
	const proxy = create(target, path);
	Object.assign(proxy, value);
	const keys = Object.keys(value);
	const del = Object.keys(target).filter(key => keys.indexOf(key) === -1);
	for(const key of del) delete proxy[key];
}

function setProp(path, target, prop, value) {
	Reflect.set(target, prop, value);
	publish(path);
}

/*
// class FHandler extends OHandler {
// 	constructor(path, that) {super(path); this.that = that;}
class FHandler {
	constructor(path, that) {this.path = path; this.that = that;}
	apply(target, thisArg, argumentsList) {
		if(thisArg === this) {
			return Reflect.apply(target, this.that, argumentsList);
		}
		else return Reflect.apply(target, thisArg, argumentsList);
	}
}
*/
