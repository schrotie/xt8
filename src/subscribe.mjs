const debouncing = new Map();
const events     = new Map();

export function subscribe(event, listener) {
	if(typeof event == 'function') return subscribe('*', event);
	const evts = events.get(event) || [];
	evts.push(listener);
	events.set(event, evts);
}

export function unsubscribe(event, listener) {
	if(typeof event == 'function') return unsubscribe('*', event);
	const evts = events.get(event) || [];
	const idx = evts.indexOf(listener);
	if(idx !== -1) evts.splice(idx, 1);
	if(!evts.length) events.delete(event);
	else events.set(event, evts);
}

export function publish(event) {
	// console.log('emit', event);
	for(let i = event.length; i; i--) callEvent(event.slice(0, i).join('.'));
	callEvent('*');
}

async function callEvent(event) {
	if(!events.has(event)) return;
	if(debouncing.has(event)) return;
	debouncing.set(event, true);
	await new Promise(resolve => setTimeout(resolve));
	debouncing.delete(event);
	// console.log('callEvent', event);
	const evt = events.get(event);
	for(const listener of evt) listener();
}
