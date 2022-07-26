# xt8
xt8, pronounced "state", is a small, pluggable pub/sub, proxy based
(hence the x) application state manager.


## Example

```javascript
import {create, subscribe} from 'xt8';
const state = create({});
subscribe('hello.world', () => console.log('Hello world!'));
state.hello = {world: 0}; // -> Hello, World!
```


## Why
I want a small easily maintainable state manager. xt8 is 140 lines plus
another 160 lines of included plugins for validation.

I want to start easy and I don't want to define actions for setting simple
properties. If I write something real complex, I use Redux (you should, too!).
But for most cases, Redux is overkill.

Still I want to be able to later migrate to an immutable state, if I think
the complexity calls for it. xt8 let's me do this without changing calls to
the initial dumb state implementation.


## Documentation

```javascript
import {create} from 'xt8';
```

"create" returns an ECMAScript Proxy Object. This mostly just proxies
property gets and sets to the underlying plain state object (you may also
use classes e.g. with getters and setters instead of a plain object). The only
thing it really does is wrap sub-objects in nested Proxies and handles setting
deep sub-object (e.g. state.obj = {foo: 'bar'}) so that deep subscriptions and
hooks are called (in this example e.g. the subscriptions for 'obj.foo', 'obj',
and '\*').

Apart of that it handles subscriptions and hooks. These are fascilities that
make it easy for you to get notified on any changes (with subscriptions) and
implement custom behavior using hooks.


### Subscription

```javascript
import {create, subscribe, unsubscribe} from 'xt8';

const state = create({});

subscribe(onAny); // Shorthand for: subscribe('*', onAny);
subscribe('a',    onA);
subscribe('a.b', onAB);

state.c = {d: 0}; // triggers onAny (once)
state.a = {};     // triggers onAny & onA
state.a.b = 0;    // triggers all three subscriptions
state.a = {b: 0}; // triggers all three subscriptions

unsubscribe(onAny); // Shorthand for: unsubscribe('*', onAny);
unsubscribe('a',    onA);
unsubscribe('a.b', onAB);

function onAny() {console.log('"*"   triggered');}
function onA(  ) {console.log('"a"   triggered');}
function onAB( ) {console.log('"a.b" triggered');}
```

Note: Subscriptions are triggered after a delay (in a new stack). Thus if you
make many changes to the state in a function, each handler will be called at
most once.


### Hooks

In addition to the pub/sub API explained above, xt8 has a "hooks" API that lets
you hook into any gets, sets, and deletes on your state. getHooks can return
computed values, thus allowing the implementation of immutable state while
maintaining the straightforward API. setHooks and delHooks let you validate
and even compute any changes to the state.

Registering hooks let's you completely customize xt8's behavior and are thus
a kind of plugin API. The hook API is a bit alike request- or page-routing APIs
in that you register hooks for given paths (or for the global '\*' path). Hooks
then get called if their respective path is affected.

All hooks get called like the respective ECMAScript Proxy handler functions
with an additional argument in front: the affected path:

```javascript
import {hookDel, hookGet, hookSet, CONTINUE} from 'xt8';

// shorthand for hookDel('*', ...):
hookDel(                (path, target, prop)        => CONTINUE);
hookGet('one.path',     (path, target, prop)        => CONTINUE);
hookSet('another.path', (path, target, prop, value) => CONTINUE);
```

`path` is always the path for which the hook was called - e.g. "one.path" for
the get-hook. `target` is the host object of the affected property. `prop` is
the key of the affected property, e.g. "path" for the get-hook. `value` is the
value passed to a setter.

Hook-handlers *MUST* return specific values. All hooks *MAY* return `CONTINUE`.
This signifies, that the call was not handled. This is essential for validators
among others that check whether a change is okay, but don't process it to effect
any changes. The hook handler will then proceed to call further hooks or enact
the proxie's default behavior.

When not returning `CONTINUE` setHooks and del-hooks *MUST* return trueish or
falseish in order to signify, whether the change was successful. Falseish will
raise an exception! If a getHook returns anything but `CONTINUE`, that return
value will be passed to the code that triggered the get.

### Shipped Plugins

xt8 ships a couple of plugins for validation:
```javascript
import {int} from 'xt8';
int('count');
```
This enforces that `state.count` is only ever set to integer values.
It is a shorthand call for
```javascript
import {hookSet, intValidator} from 'xt8';
hookSet('count', intValidator);
```
You should never need the latter syntax, but if you happen to want o unreegister
a validation, then you'll need
```javascript
import {unhookSet, int, intValidator} from 'xt8';
int('count');
unhookSet('count', intValidator);
```

Thus most validators come in pairs and those that generate closures return those
for your unregistering.

The following validators are available:
* *mustHave* property must exist; setup function registers get-, set-, and del-hooks
* *mustHaveOwn* own property must exist; setup function registers get-, set-, and del-hooks
* *addPropOnlyArray* properties can be added only to arrays, not objects; set-hook
* *delPropOnlyArray* properties can be deleted only from arrays, not objects; del-hook 
* *sameType* setters cannot change the type (typeof) of the affected property
* *oneOf* validate set against enum (value array)
* *int* property only accepts intergers in set
* *configureTempla* allows you to define the structure of your state in one call, see demo

The actual validators have the same name as their respective setup-functions
with an appended "Validator". You'll also need to use the actual validators
instead of setup functions if you for example want to register `mustHave` only
for setters. In this case, getters would just return undefined und deletes
would silently delete a non-existing property.

`configureTemplate` is pretty specific and does a relative lot of things. It
provides a very easy way of defining and enforcing the structure and typografy
of your state store. It's a good way to get started with a project. It will help
you remain consistent while you keep adding stuff to your state and perpetually
remind you to clean up previous versions of your state, should they linger
somewhere. However, in later phases of your project, you may want to replace
this somewhat simple template mechanism with a more elaborate state validation
engine of your own design. Please refer to the demo on how to use
`configureTemplate`.


I hope you find xt8 useful.
