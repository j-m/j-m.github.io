
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                for (let j = 0; j < node.attributes.length; j += 1) {
                    const attribute = node.attributes[j];
                    if (!attributes[attribute.name])
                        node.removeAttribute(attribute.name);
                }
                return nodes.splice(i, 1)[0]; // TODO strip unwanted attributes
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const routes = writable([]);

    function addRoute(title, component, path) {
      routes.update(
        currentRoutes => currentRoutes[path] = { 
          title, 
          component,
        }
      );
    }

    /* src\components\Route.svelte generated by Svelte v3.12.1 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { title, component, path } = $$props;

      addRoute({title, component, path});

    	const writable_props = ['title', 'component', 'path'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('component' in $$props) $$invalidate('component', component = $$props.component);
    		if ('path' in $$props) $$invalidate('path', path = $$props.path);
    	};

    	$$self.$capture_state = () => {
    		return { title, component, path };
    	};

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('component' in $$props) $$invalidate('component', component = $$props.component);
    		if ('path' in $$props) $$invalidate('path', path = $$props.path);
    	};

    	return { title, component, path };
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["title", "component", "path"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Route", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<Route> was created without expected prop 'title'");
    		}
    		if (ctx.component === undefined && !('component' in props)) {
    			console.warn("<Route> was created without expected prop 'component'");
    		}
    		if (ctx.path === undefined && !('path' in props)) {
    			console.warn("<Route> was created without expected prop 'path'");
    		}
    	}

    	get title() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Router.svelte generated by Svelte v3.12.1 */

    function create_fragment$1(ctx) {
    	var switch_instance_anchor, current;

    	var switch_value = ctx.component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		l: function claim(nodes) {
    			if (switch_instance) switch_instance.$$.fragment.l(nodes);
    			switch_instance_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (switch_value !== (switch_value = ctx.component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(switch_instance_anchor);
    			}

    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { defaultTitle, defaultComponent } = $$props;

      const component = get_store_value(routes)[document.location.pathname] || defaultComponent;

    	const writable_props = ['defaultTitle', 'defaultComponent'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('defaultTitle' in $$props) $$invalidate('defaultTitle', defaultTitle = $$props.defaultTitle);
    		if ('defaultComponent' in $$props) $$invalidate('defaultComponent', defaultComponent = $$props.defaultComponent);
    	};

    	$$self.$capture_state = () => {
    		return { defaultTitle, defaultComponent };
    	};

    	$$self.$inject_state = $$props => {
    		if ('defaultTitle' in $$props) $$invalidate('defaultTitle', defaultTitle = $$props.defaultTitle);
    		if ('defaultComponent' in $$props) $$invalidate('defaultComponent', defaultComponent = $$props.defaultComponent);
    	};

    	return {
    		defaultTitle,
    		defaultComponent,
    		component
    	};
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["defaultTitle", "defaultComponent"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Router", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.defaultTitle === undefined && !('defaultTitle' in props)) {
    			console.warn("<Router> was created without expected prop 'defaultTitle'");
    		}
    		if (ctx.defaultComponent === undefined && !('defaultComponent' in props)) {
    			console.warn("<Router> was created without expected prop 'defaultComponent'");
    		}
    	}

    	get defaultTitle() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultTitle(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultComponent() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultComponent(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var dist = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var OatyArray = /** @class */ (function () {
        function OatyArray(_data, _options) {
            if (_options === void 0) { _options = {}; }
            this._data = _data;
            this._options = _options;
            this._transposed = {};
            this.transpose(_data);
        }
        Object.defineProperty(OatyArray.prototype, "keys", {
            get: function () {
                return this._options.keys;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OatyArray.prototype, "length", {
            get: function () {
                return this._data.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OatyArray.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OatyArray.prototype, "transposed", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        OatyArray.prototype.get = function (keyName, keyValue) {
            return (keyValue === undefined)
                ? this._transposed[keyName]
                : (this._transposed[keyName] === undefined)
                    ? this._options.missingKeyReturns
                    : (this._transposed[keyName][keyValue] === undefined)
                        ? this._options.noResultsReturns
                        : this._transposed[keyName][keyValue];
        };
        OatyArray.prototype.push = function () {
            var _a;
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            this.transpose(data);
            return (_a = this._data).push.apply(_a, data);
        };
        OatyArray.prototype.transpose = function (data) {
            var _a;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var datum = data_1[_i];
                for (var _b = 0, _c = (this.keys || Object.keys(datum)); _b < _c.length; _b++) {
                    var key = _c[_b];
                    if (datum[key] !== undefined) {
                        (this._transposed[key] === undefined)
                            ? this._transposed[key] = (_a = {}, _a[datum[key]] = [datum], _a)
                            : ((this._transposed[key][datum[key]] === undefined)
                                ? this._transposed[key][datum[key]] = [datum]
                                : this._transposed[key][datum[key]].push(datum));
                    }
                }
            }
        };
        return OatyArray;
    }());
    exports.OatyArray = OatyArray;
    });

    unwrapExports(dist);
    var dist_1 = dist.OatyArray;

    var Tagged_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tagged = (function () {
        function Tagged(resourceID, tagID) {
            this.resourceID = resourceID;
            this.tagID = tagID;
        }
        return Tagged;
    }());
    exports.Tagged = Tagged;
    //# sourceMappingURL=Tagged.js.map
    });

    unwrapExports(Tagged_1);
    var Tagged_2 = Tagged_1.Tagged;

    var Tagable_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });


    var Tagable = (function () {
        function Tagable(data) {
            if (data === void 0) { data = {}; }
            this._resources = new dist.OatyArray(data.resources || []);
            this._tagged = new dist.OatyArray(data.tagged || []);
            this._tags = new dist.OatyArray(data.tags || []);
        }
        Object.defineProperty(Tagable.prototype, "resources", {
            get: function () {
                return this._resources.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tagable.prototype, "tagged", {
            get: function () {
                return this._tagged.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tagable.prototype, "tags", {
            get: function () {
                return this._tags.data;
            },
            enumerable: true,
            configurable: true
        });
        Tagable.prototype.import = function (data) {
            var _a, _b, _c;
            if (data.tags) {
                (_a = this._tags).push.apply(_a, data.tags);
            }
            if (data.tagged) {
                (_b = this._tagged).push.apply(_b, data.tagged);
            }
            if (data.resources) {
                (_c = this._resources).push.apply(_c, data.resources);
            }
        };
        Tagable.prototype.export = function () {
            return JSON.stringify({
                tags: this.tags,
                tagged: this.tagged,
                resources: this.resources
            });
        };
        Tagable.prototype.addResource = function (resource) {
            this._resources.push(resource);
        };
        Tagable.prototype.getResourceBy = function (property, value) {
            return this._resources.get(property, value);
        };
        Tagable.prototype.addTag = function (tag) {
            this._tags.push(tag);
        };
        Tagable.prototype.getTagBy = function (property, value) {
            return this._tags.get(property, value);
        };
        Tagable.prototype.tagResource = function (resource, tag) {
            this._tagged.push(new Tagged_1.Tagged(resource.id, tag.id));
        };
        Tagable.prototype.getTagsByResourceID = function (id) {
            return this._tagged.get('resourceID', id);
        };
        Tagable.prototype.getResourcesByTagID = function (id) {
            return this._tagged.get('tagID', id);
        };
        return Tagable;
    }());
    exports.Tagable = Tagable;
    //# sourceMappingURL=Tagable.js.map
    });

    unwrapExports(Tagable_1);
    var Tagable_2 = Tagable_1.Tagable;

    const tagable = new Tagable_2();

    function getTags(source) {
      return tagable.getTagsByResourceID(source)
    }

    async function load(){
      const data = await fetch(`tagable.json`, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      }).then(response => response.json());
      tagable.import(data);
      return tagable._resources.data
    }

    /* src\routes\Home\Tag.svelte generated by Svelte v3.12.1 */

    const file = "src\\routes\\Home\\Tag.svelte";

    function create_fragment$2(ctx) {
    	var a, div, t, a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			t = text(ctx.tagID);
    			this.h();
    		},

    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { href: true }, false);
    			var a_nodes = children(a);

    			div = claim_element(a_nodes, "DIV", { class: true }, false);
    			var div_nodes = children(div);

    			t = claim_text(div_nodes, ctx.tagID);
    			div_nodes.forEach(detach_dev);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 5, 2, 70);
    			attr_dev(a, "href", a_href_value = "tag/" + ctx.tagID);
    			add_location(a, file, 4, 0, 44);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.tagID) {
    				set_data_dev(t, ctx.tagID);
    			}

    			if ((changed.tagID) && a_href_value !== (a_href_value = "tag/" + ctx.tagID)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { tagID } = $$props;

    	const writable_props = ['tagID'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Tag> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('tagID' in $$props) $$invalidate('tagID', tagID = $$props.tagID);
    	};

    	$$self.$capture_state = () => {
    		return { tagID };
    	};

    	$$self.$inject_state = $$props => {
    		if ('tagID' in $$props) $$invalidate('tagID', tagID = $$props.tagID);
    	};

    	return { tagID };
    }

    class Tag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["tagID"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Tag", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.tagID === undefined && !('tagID' in props)) {
    			console.warn("<Tag> was created without expected prop 'tagID'");
    		}
    	}

    	get tagID() {
    		throw new Error("<Tag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tagID(value) {
    		throw new Error("<Tag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Home\Project.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\routes\\Home\\Project.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.tag = list[i];
    	return child_ctx;
    }

    // (26:2) {:else}
    function create_else_block_1(ctx) {
    	var h2, t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(ctx.title);
    			this.h();
    		},

    		l: function claim(nodes) {
    			h2 = claim_element(nodes, "H2", { class: true }, false);
    			var h2_nodes = children(h2);

    			t = claim_text(h2_nodes, ctx.title);
    			h2_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(h2, "class", "title");
    			add_location(h2, file$1, 26, 2, 495);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data_dev(t, ctx.title);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block_1.name, type: "else", source: "(26:2) {:else}", ctx });
    	return block;
    }

    // (24:2) {#if logo}
    function create_if_block_2(ctx) {
    	var img;

    	const block = {
    		c: function create() {
    			img = element("img");
    			this.h();
    		},

    		l: function claim(nodes) {
    			img = claim_element(nodes, "IMG", { class: true, alt: true, src: true }, false);
    			var img_nodes = children(img);

    			img_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(img, "class", "title");
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "src", ctx.logo);
    			add_location(img, file$1, 24, 2, 436);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.logo) {
    				attr_dev(img, "src", ctx.logo);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(img);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2.name, type: "if", source: "(24:2) {#if logo}", ctx });
    	return block;
    }

    // (32:2) {#if github}
    function create_if_block_1(ctx) {
    	var a, img;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			this.h();
    		},

    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { class: true, href: true }, false);
    			var a_nodes = children(a);

    			img = claim_element(a_nodes, "IMG", { alt: true, src: true }, false);
    			var img_nodes = children(img);

    			img_nodes.forEach(detach_dev);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(img, "alt", "GitHub Octocat");
    			attr_dev(img, "src", "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg");
    			add_location(img, file$1, 32, 33, 744);
    			attr_dev(a, "class", "url");
    			attr_dev(a, "href", ctx.github);
    			add_location(a, file$1, 32, 2, 713);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},

    		p: function update(changed, ctx) {
    			if (changed.github) {
    				attr_dev(a, "href", ctx.github);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(32:2) {#if github}", ctx });
    	return block;
    }

    // (41:2) {:else}
    function create_else_block(ctx) {
    	var p, t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading tags");
    			this.h();
    		},

    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true }, false);
    			var p_nodes = children(p);

    			t = claim_text(p_nodes, "Loading tags");
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(p, "class", "loading");
    			add_location(p, file$1, 41, 2, 1016);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(p);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(41:2) {:else}", ctx });
    	return block;
    }

    // (37:2) {#if tags}
    function create_if_block(ctx) {
    	var each_1_anchor, current;

    	let each_value = ctx.tags;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		l: function claim(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.tags) {
    				each_value = ctx.tags;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(37:2) {#if tags}", ctx });
    	return block;
    }

    // (38:2) {#each tags as tag}
    function create_each_block(ctx) {
    	var current;

    	var tag_spread_levels = [
    		ctx.tag
    	];

    	let tag_props = {};
    	for (var i = 0; i < tag_spread_levels.length; i += 1) {
    		tag_props = assign(tag_props, tag_spread_levels[i]);
    	}
    	var tag = new Tag({ props: tag_props, $$inline: true });

    	const block = {
    		c: function create() {
    			tag.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			tag.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(tag, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var tag_changes = (changed.tags) ? get_spread_update(tag_spread_levels, [
    									get_spread_object(ctx.tag)
    								]) : {};
    			tag.$set(tag_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(tag.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(tag.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(tag, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(38:2) {#each tags as tag}", ctx });
    	return block;
    }

    function create_fragment$3(ctx) {
    	var div1, t0, img, t1, p0, t2, t3, a, t4, a_href_value, t5, t6, p1, t7, div0, current_block_type_index, if_block2, current;

    	function select_block_type(changed, ctx) {
    		if (ctx.logo) return create_if_block_2;
    		return create_else_block_1;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block0 = current_block_type(ctx);

    	var if_block1 = (ctx.github) && create_if_block_1(ctx);

    	var if_block_creators = [
    		create_if_block,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type_1(changed, ctx) {
    		if (ctx.tags) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(null, ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if_block0.c();
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			p0 = element("p");
    			t2 = text(ctx.description);
    			t3 = space();
    			a = element("a");
    			t4 = text("Read more");
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			p1 = element("p");
    			t7 = space();
    			div0 = element("div");
    			if_block2.c();
    			this.h();
    		},

    		l: function claim(nodes) {
    			div1 = claim_element(nodes, "DIV", { class: true }, false);
    			var div1_nodes = children(div1);

    			if_block0.l(div1_nodes);
    			t0 = claim_space(div1_nodes);

    			img = claim_element(div1_nodes, "IMG", { class: true, alt: true, src: true }, false);
    			var img_nodes = children(img);

    			img_nodes.forEach(detach_dev);
    			t1 = claim_space(div1_nodes);

    			p0 = claim_element(div1_nodes, "P", { class: true }, false);
    			var p0_nodes = children(p0);

    			t2 = claim_text(p0_nodes, ctx.description);
    			p0_nodes.forEach(detach_dev);
    			t3 = claim_space(div1_nodes);

    			a = claim_element(div1_nodes, "A", { href: true, class: true }, false);
    			var a_nodes = children(a);

    			t4 = claim_text(a_nodes, "Read more");
    			a_nodes.forEach(detach_dev);
    			t5 = claim_space(div1_nodes);
    			if (if_block1) if_block1.l(div1_nodes);
    			t6 = claim_space(div1_nodes);

    			p1 = claim_element(div1_nodes, "P", { class: true }, false);
    			var p1_nodes = children(p1);

    			p1_nodes.forEach(detach_dev);
    			t7 = claim_space(div1_nodes);

    			div0 = claim_element(div1_nodes, "DIV", { class: true }, false);
    			var div0_nodes = children(div0);

    			if_block2.l(div0_nodes);
    			div0_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(img, "class", "preview");
    			attr_dev(img, "alt", "preview");
    			attr_dev(img, "src", ctx.preview);
    			add_location(img, file$1, 28, 2, 538);
    			attr_dev(p0, "class", "description");
    			add_location(p0, file$1, 29, 2, 593);
    			attr_dev(a, "href", a_href_value = "project/" + ctx.title);
    			attr_dev(a, "class", "readmore");
    			add_location(a, file$1, 30, 2, 637);
    			attr_dev(p1, "class", "caption");
    			add_location(p1, file$1, 34, 2, 871);
    			attr_dev(div0, "class", "tags");
    			add_location(div0, file$1, 35, 2, 913);
    			attr_dev(div1, "class", "project");
    			add_location(div1, file$1, 22, 0, 397);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, img);
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			append_dev(p0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, a);
    			append_dev(a, t4);
    			append_dev(div1, t5);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			p1.innerHTML = ctx.caption;
    			append_dev(div1, t7);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block0) {
    				if_block0.p(changed, ctx);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);
    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			}

    			if (!current || changed.preview) {
    				attr_dev(img, "src", ctx.preview);
    			}

    			if (!current || changed.description) {
    				set_data_dev(t2, ctx.description);
    			}

    			if ((!current || changed.title) && a_href_value !== (a_href_value = "project/" + ctx.title)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (ctx.github) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t6);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || changed.caption) {
    				p1.innerHTML = ctx.caption;
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block2 = if_blocks[current_block_type_index];
    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				}
    				transition_in(if_block2, 1);
    				if_block2.m(div0, null);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block2);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { logo, title, description, github, caption, preview, date } = $$props;

      let tags;

      onMount(async function() {
        $$invalidate('tags', tags = await getTags(title));
      });

    	const writable_props = ['logo', 'title', 'description', 'github', 'caption', 'preview', 'date'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('logo' in $$props) $$invalidate('logo', logo = $$props.logo);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('description' in $$props) $$invalidate('description', description = $$props.description);
    		if ('github' in $$props) $$invalidate('github', github = $$props.github);
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('preview' in $$props) $$invalidate('preview', preview = $$props.preview);
    		if ('date' in $$props) $$invalidate('date', date = $$props.date);
    	};

    	$$self.$capture_state = () => {
    		return { logo, title, description, github, caption, preview, date, tags };
    	};

    	$$self.$inject_state = $$props => {
    		if ('logo' in $$props) $$invalidate('logo', logo = $$props.logo);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('description' in $$props) $$invalidate('description', description = $$props.description);
    		if ('github' in $$props) $$invalidate('github', github = $$props.github);
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('preview' in $$props) $$invalidate('preview', preview = $$props.preview);
    		if ('date' in $$props) $$invalidate('date', date = $$props.date);
    		if ('tags' in $$props) $$invalidate('tags', tags = $$props.tags);
    	};

    	return {
    		logo,
    		title,
    		description,
    		github,
    		caption,
    		preview,
    		date,
    		tags
    	};
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["logo", "title", "description", "github", "caption", "preview", "date"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Project", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.logo === undefined && !('logo' in props)) {
    			console.warn("<Project> was created without expected prop 'logo'");
    		}
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<Project> was created without expected prop 'title'");
    		}
    		if (ctx.description === undefined && !('description' in props)) {
    			console.warn("<Project> was created without expected prop 'description'");
    		}
    		if (ctx.github === undefined && !('github' in props)) {
    			console.warn("<Project> was created without expected prop 'github'");
    		}
    		if (ctx.caption === undefined && !('caption' in props)) {
    			console.warn("<Project> was created without expected prop 'caption'");
    		}
    		if (ctx.preview === undefined && !('preview' in props)) {
    			console.warn("<Project> was created without expected prop 'preview'");
    		}
    		if (ctx.date === undefined && !('date' in props)) {
    			console.warn("<Project> was created without expected prop 'date'");
    		}
    	}

    	get logo() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logo(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get github() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set github(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preview() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preview(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Home\Projects.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\routes\\Home\\Projects.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.project = list[i];
    	return child_ctx;
    }

    // (18:0) {:else}
    function create_else_block$1(ctx) {
    	var p, t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("Loading projects...");
    			this.h();
    		},

    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", { class: true }, false);
    			var p_nodes = children(p);

    			t = claim_text(p_nodes, "Loading projects...");
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(p, "class", "loading");
    			add_location(p, file$2, 18, 0, 361);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(p);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$1.name, type: "else", source: "(18:0) {:else}", ctx });
    	return block;
    }

    // (14:0) {#if projects}
    function create_if_block$1(ctx) {
    	var each_1_anchor, current;

    	let each_value = ctx.projects;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		l: function claim(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.projects) {
    				each_value = ctx.projects;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(14:0) {#if projects}", ctx });
    	return block;
    }

    // (15:0) {#each projects as project}
    function create_each_block$1(ctx) {
    	var current;

    	var project_spread_levels = [
    		ctx.project.data
    	];

    	let project_props = {};
    	for (var i = 0; i < project_spread_levels.length; i += 1) {
    		project_props = assign(project_props, project_spread_levels[i]);
    	}
    	var project = new Project({ props: project_props, $$inline: true });

    	const block = {
    		c: function create() {
    			project.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			project.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(project, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var project_changes = (changed.projects) ? get_spread_update(project_spread_levels, [
    									get_spread_object(ctx.project.data)
    								]) : {};
    			project.$set(project_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(project.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(project.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(project, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(15:0) {#each projects as project}", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var div, current_block_type_index, if_block, current;

    	var if_block_creators = [
    		create_if_block$1,
    		create_else_block$1
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.projects) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			this.h();
    		},

    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { id: true }, false);
    			var div_nodes = children(div);

    			if_block.l(div_nodes);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(div, "id", "projects");
    			add_location(div, file$2, 12, 0, 244);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if_blocks[current_block_type_index].d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	

      let projects = [];
      onMount(async function(){
        $$invalidate('projects', projects = await load());
      });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('projects' in $$props) $$invalidate('projects', projects = $$props.projects);
    	};

    	return { projects };
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Projects", options, id: create_fragment$4.name });
    	}
    }

    /* src\routes\Home\Filter.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\routes\\Home\\Filter.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.sortOption = list[i];
    	return child_ctx;
    }

    // (24:4) {#each sortOptions as sortOption}
    function create_each_block$2(ctx) {
    	var option, t0_value = ctx.sortOption.text + "", t0, t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			this.h();
    		},

    		l: function claim(nodes) {
    			option = claim_element(nodes, "OPTION", { value: true }, false);
    			var option_nodes = children(option);

    			t0 = claim_text(option_nodes, t0_value);
    			t1 = claim_space(option_nodes);
    			option_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			option.__value = ctx.sortOption;
    			option.value = option.__value;
    			add_location(option, file$3, 24, 4, 725);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$2.name, type: "each", source: "(24:4) {#each sortOptions as sortOption}", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var div, input0, t0, input1, label0, t1, t2, input2, label1, t3, t4, input3, label2, t5, t6, select, t7, input4, label3, dispose;

    	let each_value = ctx.sortOptions;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			label0 = element("label");
    			t1 = text("Title");
    			t2 = space();
    			input2 = element("input");
    			label1 = element("label");
    			t3 = text("Description");
    			t4 = space();
    			input3 = element("input");
    			label2 = element("label");
    			t5 = text("Tag");
    			t6 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			input4 = element("input");
    			label3 = element("label");
    			this.h();
    		},

    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { id: true }, false);
    			var div_nodes = children(div);

    			input0 = claim_element(div_nodes, "INPUT", { placeholder: true, id: true }, false);
    			var input0_nodes = children(input0);

    			input0_nodes.forEach(detach_dev);
    			t0 = claim_space(div_nodes);

    			input1 = claim_element(div_nodes, "INPUT", { type: true, id: true }, false);
    			var input1_nodes = children(input1);

    			input1_nodes.forEach(detach_dev);

    			label0 = claim_element(div_nodes, "LABEL", { for: true }, false);
    			var label0_nodes = children(label0);

    			t1 = claim_text(label0_nodes, "Title");
    			label0_nodes.forEach(detach_dev);
    			t2 = claim_space(div_nodes);

    			input2 = claim_element(div_nodes, "INPUT", { type: true, id: true }, false);
    			var input2_nodes = children(input2);

    			input2_nodes.forEach(detach_dev);

    			label1 = claim_element(div_nodes, "LABEL", { for: true }, false);
    			var label1_nodes = children(label1);

    			t3 = claim_text(label1_nodes, "Description");
    			label1_nodes.forEach(detach_dev);
    			t4 = claim_space(div_nodes);

    			input3 = claim_element(div_nodes, "INPUT", { type: true, id: true }, false);
    			var input3_nodes = children(input3);

    			input3_nodes.forEach(detach_dev);

    			label2 = claim_element(div_nodes, "LABEL", { for: true }, false);
    			var label2_nodes = children(label2);

    			t5 = claim_text(label2_nodes, "Tag");
    			label2_nodes.forEach(detach_dev);
    			t6 = claim_space(div_nodes);

    			select = claim_element(div_nodes, "SELECT", {}, false);
    			var select_nodes = children(select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(select_nodes);
    			}

    			select_nodes.forEach(detach_dev);
    			t7 = claim_space(div_nodes);

    			input4 = claim_element(div_nodes, "INPUT", { type: true, id: true }, false);
    			var input4_nodes = children(input4);

    			input4_nodes.forEach(detach_dev);

    			label3 = claim_element(div_nodes, "LABEL", { for: true }, false);
    			var label3_nodes = children(label3);

    			label3_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(input0, "placeholder", "filter");
    			attr_dev(input0, "id", "search");
    			add_location(input0, file$3, 18, 2, 294);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "id", "title");
    			add_location(input1, file$3, 19, 2, 358);
    			attr_dev(label0, "for", "title");
    			add_location(label0, file$3, 19, 58, 414);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "description");
    			add_location(input2, file$3, 20, 2, 450);
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$3, 20, 70, 518);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "id", "tag");
    			add_location(input3, file$3, 21, 2, 566);
    			attr_dev(label2, "for", "tag");
    			add_location(label2, file$3, 21, 54, 618);
    			if (ctx.selected === void 0) add_render_callback(() => ctx.select_change_handler.call(select));
    			add_location(select, file$3, 22, 2, 650);
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "id", "ascending");
    			add_location(input4, file$3, 29, 2, 821);
    			attr_dev(label3, "for", "ascending");
    			add_location(label3, file$3, 29, 66, 885);
    			attr_dev(div, "id", "filter");
    			add_location(div, file$3, 17, 0, 273);

    			dispose = [
    				listen_dev(input0, "input", ctx.input0_input_handler),
    				listen_dev(input1, "change", ctx.input1_change_handler),
    				listen_dev(input2, "change", ctx.input2_change_handler),
    				listen_dev(input3, "change", ctx.input3_change_handler),
    				listen_dev(select, "change", ctx.select_change_handler),
    				listen_dev(input4, "change", ctx.input4_change_handler)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);

    			set_input_value(input0, ctx.filter);

    			append_dev(div, t0);
    			append_dev(div, input1);

    			input1.checked = ctx.title;

    			append_dev(div, label0);
    			append_dev(label0, t1);
    			append_dev(div, t2);
    			append_dev(div, input2);

    			input2.checked = ctx.description;

    			append_dev(div, label1);
    			append_dev(label1, t3);
    			append_dev(div, t4);
    			append_dev(div, input3);

    			input3.checked = ctx.tag;

    			append_dev(div, label2);
    			append_dev(label2, t5);
    			append_dev(div, t6);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, ctx.selected);

    			append_dev(div, t7);
    			append_dev(div, input4);

    			input4.checked = ctx.ascending;

    			append_dev(div, label3);
    		},

    		p: function update(changed, ctx) {
    			if (changed.filter && (input0.value !== ctx.filter)) set_input_value(input0, ctx.filter);
    			if (changed.title) input1.checked = ctx.title;
    			if (changed.description) input2.checked = ctx.description;
    			if (changed.tag) input3.checked = ctx.tag;

    			if (changed.sortOptions) {
    				each_value = ctx.sortOptions;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (changed.selected) select_option(select, ctx.selected);
    			if (changed.ascending) input4.checked = ctx.ascending;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let filter;

      let title = true;
      let description = true;
      let tag = true;

      let selected;
    	let sortOptions = [
    		{ id: 1, text: `Sort by...` },
    		{ id: 2, text: `Title` },
    		{ id: 3, text: `Date` }
      ];
      
      let ascending = true;

    	function input0_input_handler() {
    		filter = this.value;
    		$$invalidate('filter', filter);
    	}

    	function input1_change_handler() {
    		title = this.checked;
    		$$invalidate('title', title);
    	}

    	function input2_change_handler() {
    		description = this.checked;
    		$$invalidate('description', description);
    	}

    	function input3_change_handler() {
    		tag = this.checked;
    		$$invalidate('tag', tag);
    	}

    	function select_change_handler() {
    		selected = select_value(this);
    		$$invalidate('selected', selected);
    		$$invalidate('sortOptions', sortOptions);
    	}

    	function input4_change_handler() {
    		ascending = this.checked;
    		$$invalidate('ascending', ascending);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('filter' in $$props) $$invalidate('filter', filter = $$props.filter);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('description' in $$props) $$invalidate('description', description = $$props.description);
    		if ('tag' in $$props) $$invalidate('tag', tag = $$props.tag);
    		if ('selected' in $$props) $$invalidate('selected', selected = $$props.selected);
    		if ('sortOptions' in $$props) $$invalidate('sortOptions', sortOptions = $$props.sortOptions);
    		if ('ascending' in $$props) $$invalidate('ascending', ascending = $$props.ascending);
    	};

    	return {
    		filter,
    		title,
    		description,
    		tag,
    		selected,
    		sortOptions,
    		ascending,
    		input0_input_handler,
    		input1_change_handler,
    		input2_change_handler,
    		input3_change_handler,
    		select_change_handler,
    		input4_change_handler
    	};
    }

    class Filter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Filter", options, id: create_fragment$5.name });
    	}
    }

    /* src\routes\Home\index.svelte generated by Svelte v3.12.1 */

    function create_fragment$6(ctx) {
    	var t, current;

    	var filter = new Filter({ $$inline: true });

    	var projects = new Projects({ $$inline: true });

    	const block = {
    		c: function create() {
    			filter.$$.fragment.c();
    			t = space();
    			projects.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			filter.$$.fragment.l(nodes);
    			t = claim_space(nodes);
    			projects.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(filter, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(projects, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(filter.$$.fragment, local);

    			transition_in(projects.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(filter.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(filter, detaching);

    			if (detaching) {
    				detach_dev(t);
    			}

    			destroy_component(projects, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$6, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Index", options, id: create_fragment$6.name });
    	}
    }

    /* src\routes\Privacy.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\routes\\Privacy.svelte";

    function create_fragment$7(ctx) {
    	var h1, t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text("Privacy");
    			this.h();
    		},

    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {}, false);
    			var h1_nodes = children(h1);

    			t = claim_text(h1_nodes, "Privacy");
    			h1_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			add_location(h1, file$4, 0, 0, 0);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    class Privacy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$7, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Privacy", options, id: create_fragment$7.name });
    	}
    }

    /* src\routes\Sitemap.svelte generated by Svelte v3.12.1 */

    const file$5 = "src\\routes\\Sitemap.svelte";

    function create_fragment$8(ctx) {
    	var h1, t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text("Sitemap");
    			this.h();
    		},

    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {}, false);
    			var h1_nodes = children(h1);

    			t = claim_text(h1_nodes, "Sitemap");
    			h1_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			add_location(h1, file$5, 0, 0, 0);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    class Sitemap extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$8, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Sitemap", options, id: create_fragment$8.name });
    	}
    }

    /* src\routes\index.svelte generated by Svelte v3.12.1 */

    function create_fragment$9(ctx) {
    	var t0, t1, current;

    	var router = new Router({
    		props: {
    		defaultTitle: "Jonathan Marsh - Home",
    		defaultComponent: Index
    	},
    		$$inline: true
    	});

    	var route0 = new Route({
    		props: {
    		title: "Jonathan Marsh - Privacy",
    		path: "/privacy",
    		component: Privacy
    	},
    		$$inline: true
    	});

    	var route1 = new Route({
    		props: {
    		title: "Jonathan Marsh - Sitemap",
    		path: "/sitemap",
    		component: Sitemap
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			router.$$.fragment.c();
    			t0 = space();
    			route0.$$.fragment.c();
    			t1 = space();
    			route1.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			router.$$.fragment.l(nodes);
    			t0 = claim_space(nodes);
    			route0.$$.fragment.l(nodes);
    			t1 = claim_space(nodes);
    			route1.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);

    			transition_in(route0.$$.fragment, local);

    			transition_in(route1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(router, detaching);

    			if (detaching) {
    				detach_dev(t0);
    			}

    			destroy_component(route0, detaching);

    			if (detaching) {
    				detach_dev(t1);
    			}

    			destroy_component(route1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    class Index$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$9, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Index", options, id: create_fragment$9.name });
    	}
    }

    var app = new Index$1({
    	target: document.body.querySelector('app'),
    	hydrate: true
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
