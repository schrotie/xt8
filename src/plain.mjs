export function plain(node) {
	if(Array.isArray(node))      return node.map(plain);
	if(typeof node === 'object') return plainObject(node);
	return node;
}

function plainObject(node) {
	return Object.fromEntries(Object.entries(node)
		.map(([key, value]) => [key, plain(value)]),
	);
}
