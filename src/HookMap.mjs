export const CONTINUE = Symbol('continue');

export default class HookMap {
	#here; #nested;
	constructor() {this.#here = new Map(); this.#nested = new Map();}
	has(path   ) {return this.#reflect('has',    path);}
	set(path, v) {return this.#reflect('set',    path, v);}
	get(path   ) {return this.#reflect('get',    path);}
	del(path   ) {return this.#reflect('delete', path);}

	list(path  ) {
		const entries = this.#list(path);
		function dummy() {}
		return Object.fromEntries(entries.map(([key, value]) => [key, dummy]));
	}
	#list(path  ) {
		return path.length ? this.#collectNested(path) : this.#collectHere();
	}
	#collectNested(path) {
		const get = key => this.#nested.has(key) ? this.#nested.get(key)
			.#list(path.slice(1)) : [];
		return get(path[0]).concat(get('*'));
	}
	#collectHere() {
		const entries = [];
		for(const entry of this.#here.entries()) {
			if(entry[0] !== '*') entries.push(entry);
		}
		return entries;
	}

	* call(path, args) {
		// console.log('call', path, args);
		const p = path.join('.');
		for(const result of caller(this.#callect(path), p, args)) yield result;
	}
	#callect(path) {
		// return this.#here.get('*');
		// nested, nestedWildcard, here, wildcard
		const getH = key => this.#here.has(key) ? this.#here.get(key) : [];
		const getN = key => this.#nested.has(key) ?
			this.#nested.get(key).#callect(path.slice(1)) : [];
		const arr = getH(path[0]).concat(getH('*'));
		return (path.length > 1) ?
			getN(path[0]).concat(getN('*')).concat(arr) :
			arr;
	}

	#reflect(op, path, ...arg) {
		if(!Array.isArray(path)) path = path.split('.');
		if(path.length === 1) return this.#here[op](path[0], ...arg);
		if(!this.#nested.has(path[0])) this.#nested.set(path[0], new HookMap());
		return this.#nested.get(path[0])[op](path.slice(1), ...arg);
	}
}

function* caller(callbacks, path, args) {
	if(!callbacks) return;
	// console.log('caller', callbacks, path, ...args);
	for(const callback of callbacks) {
		const result = callback(path, ...args);
		if(result !== CONTINUE) yield result;
	}
}
