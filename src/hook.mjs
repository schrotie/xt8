export const CONTINUE = Symbol('continue');

const del = new Map();
const get = new Map();
const set = new Map();

export const     hookDel =     hook(del);
export const     hookGet =     hook(get);
export const     hookSet =     hook(set);
export const   unhookDel =   unhook(del);
export const   unhookGet =   unhook(get);
export const   unhookSet =   unhook(set);
export const callHookDel = callHook(del);
export const callHookGet = callHook(get);
export const callHookSet = callHook(set);

function hook(hooks) {return function hook(path, callback) {
	if(typeof path == 'function') return hook('*', path);
	if(!hooks.has(path)) hooks.set(path, []);
	hooks.get(path).push(callback);
};}

function unhook(hooks) {return function unhook(path, callback) {
	if(typeof path == 'function') return unhook('*', path);
	const callbacks = hooks.get(path);
	if(!callbacks) throw new Error(`Cannot unhook "${path}" - hook not found`);
	const idx = callbacks.indexOf(callback);
	if(idx === -1) throw new Error(`Cannot unhook "${path}" - hook not found`);
	callbacks.splice(idx, 1);
	if(!callbacks.length) hooks.delete(path);
};}

function callHook(hooks) {return function* callHook(path, ...args) {
	path = path.join('.');
	for(const res of results(hooks.get('*'),  path, args)) return yield res;
	for(const res of results(hooks.get(path), path, args)) return yield res;
};}

function* results(callbacks, path, args) {
	if(callbacks) {for(const callback of callbacks) {
		const result = callback(path, ...args);
		if(result !== CONTINUE) yield result;
	}}
}
