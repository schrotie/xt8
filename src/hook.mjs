export {CONTINUE} from './HookMap.mjs';

import HookMap from './HookMap.mjs';
const del = new HookMap();
const get = new HookMap();
const set = new HookMap();

export const     hookDel =     hook(del);
export const     hookGet =     hook(get);
export const     hookSet =     hook(set);
export const   unhookDel =   unhook(del);
export const   unhookGet =   unhook(get);
export const   unhookSet =   unhook(set);
export const callHookDel = callHook(del);
export const callHookGet = callHook(get);
export const callHookSet = callHook(set);
export const listHookDel = listHook(del);
export const listHookGet = listHook(get);
export const listHookSet = listHook(set);

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
	if(!callbacks.length) hooks.del(path);
};}

function callHook(hooks) {return function* callHook(path, ...args) {
	for(const res of hooks.call(path, args)) return yield res;
};}

function listHook(hooks) {return function(path) {return hooks.list(path);};}
