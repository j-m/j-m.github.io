
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
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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

    const routes = writable({});

    function addRoute(title, component, path, props) {
      routes.update(value => {
        value[path] = {title, component, props};
        return value
      });
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
    	let { title, component, path, props = [] } = $$props;

      addRoute(title, component, path, props);

    	const writable_props = ['title', 'component', 'path', 'props'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('component' in $$props) $$invalidate('component', component = $$props.component);
    		if ('path' in $$props) $$invalidate('path', path = $$props.path);
    		if ('props' in $$props) $$invalidate('props', props = $$props.props);
    	};

    	$$self.$capture_state = () => {
    		return { title, component, path, props };
    	};

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('component' in $$props) $$invalidate('component', component = $$props.component);
    		if ('path' in $$props) $$invalidate('path', path = $$props.path);
    		if ('props' in $$props) $$invalidate('props', props = $$props.props);
    	};

    	return { title, component, path, props };
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["title", "component", "path", "props"]);
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

    	get props() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Router.svelte generated by Svelte v3.12.1 */

    function create_fragment$1(ctx) {
    	var switch_instance_anchor, current;

    	var switch_instance_spread_levels = [
    		ctx.props
    	];

    	var switch_value = ctx.component;

    	function switch_props(ctx) {
    		let switch_instance_props = {};
    		for (var i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}
    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
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
    			var switch_instance_changes = (changed.props) ? get_spread_update(switch_instance_spread_levels, [
    									get_spread_object(ctx.props)
    								]) : {};

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

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
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
    	let { defaultTitle, defaultComponent, defaultProps = [] } = $$props;

      let component = defaultComponent;
      let props = defaultProps;
      routes.subscribe(value => {
    		const route = value[document.location.pathname];
        document.title = (route) ? route.title : defaultTitle;
        $$invalidate('component', component =  (route) ? route.component : defaultComponent);
        $$invalidate('props', props = (route) ? route.props : defaultProps);
    	});

    	const writable_props = ['defaultTitle', 'defaultComponent', 'defaultProps'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('defaultTitle' in $$props) $$invalidate('defaultTitle', defaultTitle = $$props.defaultTitle);
    		if ('defaultComponent' in $$props) $$invalidate('defaultComponent', defaultComponent = $$props.defaultComponent);
    		if ('defaultProps' in $$props) $$invalidate('defaultProps', defaultProps = $$props.defaultProps);
    	};

    	$$self.$capture_state = () => {
    		return { defaultTitle, defaultComponent, defaultProps, component, props };
    	};

    	$$self.$inject_state = $$props => {
    		if ('defaultTitle' in $$props) $$invalidate('defaultTitle', defaultTitle = $$props.defaultTitle);
    		if ('defaultComponent' in $$props) $$invalidate('defaultComponent', defaultComponent = $$props.defaultComponent);
    		if ('defaultProps' in $$props) $$invalidate('defaultProps', defaultProps = $$props.defaultProps);
    		if ('component' in $$props) $$invalidate('component', component = $$props.component);
    		if ('props' in $$props) $$invalidate('props', props = $$props.props);
    	};

    	return {
    		defaultTitle,
    		defaultComponent,
    		defaultProps,
    		component,
    		props
    	};
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["defaultTitle", "defaultComponent", "defaultProps"]);
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

    	get defaultProps() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultProps(value) {
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
            if (_data === void 0) { _data = []; }
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
                return this._transposed;
            },
            enumerable: true,
            configurable: true
        });
        OatyArray.prototype.get = function (keyName, keyValue) {
            if (this._transposed[keyName] === undefined) {
                throw new ReferenceError("The key '" + keyName + "' has not been transposed");
            }
            if (keyValue === undefined) {
                return this._transposed[keyName];
            }
            return this._transposed[keyName][keyValue];
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
                    if (datum[key] === undefined) {
                        continue;
                    }
                    if (this._transposed[key] === undefined) {
                        this._transposed[key] = (_a = {}, _a[datum[key]] = [datum], _a);
                        continue;
                    }
                    if (this._transposed[key][datum[key]] === undefined) {
                        this._transposed[key][datum[key]] = [datum];
                        continue;
                    }
                    this._transposed[key][datum[key]].push(datum);
                }
            }
        };
        return OatyArray;
    }());
    exports.OatyArray = OatyArray;
    });

    unwrapExports(dist);
    var dist_1 = dist.OatyArray;

    var Tagable_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    var Tagable = (function () {
        function Tagable(data) {
            if (data === void 0) { data = {}; }
            this._tags = data.tags || {};
            this._resources = data.resources || {};
            this._tagged = new dist.OatyArray(data.tagged);
        }
        Object.defineProperty(Tagable.prototype, "resources", {
            get: function () {
                return this._resources;
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
                return this._tags;
            },
            enumerable: true,
            configurable: true
        });
        Tagable.prototype.import = function (data) {
            var _a;
            Object.assign(this._tags, data.tags);
            Object.assign(this._resources, data.resources);
            (_a = this._tagged).push.apply(_a, data.tagged || []);
        };
        Tagable.prototype.export = function () {
            return JSON.stringify({
                resources: this.resources,
                tagged: this.tagged,
                tags: this.tags
            });
        };
        Tagable.prototype.addResource = function (resourceID, resource) {
            if (this._resources[resourceID]) {
                throw Error("Resource ID '" + resourceID + "' is already in use");
            }
            this._resources[resourceID] = resource;
        };
        Tagable.prototype.addTag = function (tagID, tag) {
            if (this._tags[tagID]) {
                throw Error("Tag ID '" + tagID + "' is already in use");
            }
            this._tags[tagID] = tag;
        };
        Tagable.prototype.tagResource = function (tagged) {
            if (this._resources[tagged.resourceID] === undefined) {
                throw Error("Unknown resource '" + tagged.resourceID + "'");
            }
            if (this._tags[tagged.tagID] === undefined) {
                throw Error("Unknown tag '" + tagged.tagID + "'");
            }
            this._tagged.push(tagged);
        };
        Tagable.prototype.getTags = function (resourceID) {
            var _this = this;
            var tagged = this._tagged.get('resourceID', resourceID);
            return tagged.map(function (tag) { return (_this._tags[tag.tagID]); });
        };
        Tagable.prototype.getResources = function (tagID) {
            var _this = this;
            var tagged = this._tagged.get('tagID', tagID);
            return tagged.map(function (tag) { return (_this._resources[tag.resourceID]); });
        };
        return Tagable;
    }());
    exports.Tagable = Tagable;
    //# sourceMappingURL=Tagable.js.map
    });

    unwrapExports(Tagable_1);
    var Tagable_2 = Tagable_1.Tagable;

    const tagable = new Tagable_2();
    const data = fetch(`resources/data/tagable.json`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const json = data.then(response => response.json());
    const imported = json.then(json => tagable.import(json));

    async function getTagsByResourceID(resourceid) {
      return imported.then(() => tagable.getTags(resourceid))
    }

    async function getResources() {
      return imported.then(() => tagable.resources)
    }

    async function getTags(){
      return imported.then(() => tagable.tags)
    }

    /* src\routes\Home\Tag.svelte generated by Svelte v3.12.1 */

    const file = "src\\routes\\Home\\Tag.svelte";

    function create_fragment$2(ctx) {
    	var a, div, t, a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			t = text(ctx.title);
    			this.h();
    		},

    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { href: true }, false);
    			var a_nodes = children(a);

    			div = claim_element(a_nodes, "DIV", { class: true }, false);
    			var div_nodes = children(div);

    			t = claim_text(div_nodes, ctx.title);
    			div_nodes.forEach(detach_dev);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 6, 2, 89);
    			attr_dev(a, "href", a_href_value = "tag/" + ctx.tagID);
    			add_location(a, file, 5, 0, 63);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(div, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data_dev(t, ctx.title);
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
    	let { tagID, title } = $$props;

    	const writable_props = ['tagID', 'title'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Tag> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('tagID' in $$props) $$invalidate('tagID', tagID = $$props.tagID);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    	};

    	$$self.$capture_state = () => {
    		return { tagID, title };
    	};

    	$$self.$inject_state = $$props => {
    		if ('tagID' in $$props) $$invalidate('tagID', tagID = $$props.tagID);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    	};

    	return { tagID, title };
    }

    class Tag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["tagID", "title"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Tag", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.tagID === undefined && !('tagID' in props)) {
    			console.warn("<Tag> was created without expected prop 'tagID'");
    		}
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<Tag> was created without expected prop 'title'");
    		}
    	}

    	get tagID() {
    		throw new Error("<Tag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tagID(value) {
    		throw new Error("<Tag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Tag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
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

    // (29:2) {:else}
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
    			add_location(h2, file$1, 29, 2, 634);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block_1.name, type: "else", source: "(29:2) {:else}", ctx });
    	return block;
    }

    // (27:2) {#if logo}
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
    			add_location(img, file$1, 27, 2, 575);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2.name, type: "if", source: "(27:2) {#if logo}", ctx });
    	return block;
    }

    // (35:2) {#if github}
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
    			add_location(img, file$1, 35, 33, 883);
    			attr_dev(a, "class", "url");
    			attr_dev(a, "href", ctx.github);
    			add_location(a, file$1, 35, 2, 852);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(35:2) {#if github}", ctx });
    	return block;
    }

    // (44:2) {:else}
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
    			add_location(p, file$1, 44, 2, 1155);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(44:2) {:else}", ctx });
    	return block;
    }

    // (40:2) {#if tags}
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(40:2) {#if tags}", ctx });
    	return block;
    }

    // (41:2) {#each tags as tag}
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(41:2) {#each tags as tag}", ctx });
    	return block;
    }

    function create_fragment$3(ctx) {
    	var div1, p0, t0, t1, t2, time, t3, t4, t5, img, t6, p1, t7, t8, a, t9, a_href_value, t10, t11, p2, t12, div0, current_block_type_index, if_block2, current;

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
    			p0 = element("p");
    			t0 = text("Age: ");
    			t1 = text(ctx.age);
    			t2 = text(" | Date: ");
    			time = element("time");
    			t3 = text(ctx.date);
    			t4 = space();
    			if_block0.c();
    			t5 = space();
    			img = element("img");
    			t6 = space();
    			p1 = element("p");
    			t7 = text(ctx.description);
    			t8 = space();
    			a = element("a");
    			t9 = text("Read more");
    			t10 = space();
    			if (if_block1) if_block1.c();
    			t11 = space();
    			p2 = element("p");
    			t12 = space();
    			div0 = element("div");
    			if_block2.c();
    			this.h();
    		},

    		l: function claim(nodes) {
    			div1 = claim_element(nodes, "DIV", { class: true }, false);
    			var div1_nodes = children(div1);

    			p0 = claim_element(div1_nodes, "P", { class: true }, false);
    			var p0_nodes = children(p0);

    			t0 = claim_text(p0_nodes, "Age: ");
    			t1 = claim_text(p0_nodes, ctx.age);
    			t2 = claim_text(p0_nodes, " | Date: ");

    			time = claim_element(p0_nodes, "TIME", { datetime: true }, false);
    			var time_nodes = children(time);

    			t3 = claim_text(time_nodes, ctx.date);
    			time_nodes.forEach(detach_dev);
    			p0_nodes.forEach(detach_dev);
    			t4 = claim_space(div1_nodes);
    			if_block0.l(div1_nodes);
    			t5 = claim_space(div1_nodes);

    			img = claim_element(div1_nodes, "IMG", { class: true, alt: true, src: true }, false);
    			var img_nodes = children(img);

    			img_nodes.forEach(detach_dev);
    			t6 = claim_space(div1_nodes);

    			p1 = claim_element(div1_nodes, "P", { class: true }, false);
    			var p1_nodes = children(p1);

    			t7 = claim_text(p1_nodes, ctx.description);
    			p1_nodes.forEach(detach_dev);
    			t8 = claim_space(div1_nodes);

    			a = claim_element(div1_nodes, "A", { href: true, class: true }, false);
    			var a_nodes = children(a);

    			t9 = claim_text(a_nodes, "Read more");
    			a_nodes.forEach(detach_dev);
    			t10 = claim_space(div1_nodes);
    			if (if_block1) if_block1.l(div1_nodes);
    			t11 = claim_space(div1_nodes);

    			p2 = claim_element(div1_nodes, "P", { class: true }, false);
    			var p2_nodes = children(p2);

    			p2_nodes.forEach(detach_dev);
    			t12 = claim_space(div1_nodes);

    			div0 = claim_element(div1_nodes, "DIV", { class: true }, false);
    			var div0_nodes = children(div0);

    			if_block2.l(div0_nodes);
    			div0_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(time, "datetime", "2018/02/24");
    			add_location(time, file$1, 25, 37, 512);
    			attr_dev(p0, "class", "date");
    			add_location(p0, file$1, 25, 2, 477);
    			attr_dev(img, "class", "preview");
    			attr_dev(img, "alt", "preview");
    			attr_dev(img, "src", ctx.preview);
    			add_location(img, file$1, 31, 2, 677);
    			attr_dev(p1, "class", "description");
    			add_location(p1, file$1, 32, 2, 732);
    			attr_dev(a, "href", a_href_value = "project/" + ctx.title);
    			attr_dev(a, "class", "readmore");
    			add_location(a, file$1, 33, 2, 776);
    			attr_dev(p2, "class", "caption");
    			add_location(p2, file$1, 37, 2, 1010);
    			attr_dev(div0, "class", "tags");
    			add_location(div0, file$1, 38, 2, 1052);
    			attr_dev(div1, "class", "project");
    			add_location(div1, file$1, 24, 0, 452);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(p0, t2);
    			append_dev(p0, time);
    			append_dev(time, t3);
    			append_dev(div1, t4);
    			if_block0.m(div1, null);
    			append_dev(div1, t5);
    			append_dev(div1, img);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(p1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, a);
    			append_dev(a, t9);
    			append_dev(div1, t10);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t11);
    			append_dev(div1, p2);
    			p2.innerHTML = ctx.caption;
    			append_dev(div1, t12);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.age) {
    				set_data_dev(t1, ctx.age);
    			}

    			if (!current || changed.date) {
    				set_data_dev(t3, ctx.date);
    			}

    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block0) {
    				if_block0.p(changed, ctx);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);
    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t5);
    				}
    			}

    			if (!current || changed.preview) {
    				attr_dev(img, "src", ctx.preview);
    			}

    			if (!current || changed.description) {
    				set_data_dev(t7, ctx.description);
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
    					if_block1.m(div1, t11);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || changed.caption) {
    				p2.innerHTML = ctx.caption;
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
    	let { id, age, caption, date, description, github, logo, preview, title } = $$props;

      let tags;

      onMount(async function() {
        $$invalidate('tags', tags = await getTagsByResourceID(id));
      });

    	const writable_props = ['id', 'age', 'caption', 'date', 'description', 'github', 'logo', 'preview', 'title'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('age' in $$props) $$invalidate('age', age = $$props.age);
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('date' in $$props) $$invalidate('date', date = $$props.date);
    		if ('description' in $$props) $$invalidate('description', description = $$props.description);
    		if ('github' in $$props) $$invalidate('github', github = $$props.github);
    		if ('logo' in $$props) $$invalidate('logo', logo = $$props.logo);
    		if ('preview' in $$props) $$invalidate('preview', preview = $$props.preview);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    	};

    	$$self.$capture_state = () => {
    		return { id, age, caption, date, description, github, logo, preview, title, tags };
    	};

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('age' in $$props) $$invalidate('age', age = $$props.age);
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('date' in $$props) $$invalidate('date', date = $$props.date);
    		if ('description' in $$props) $$invalidate('description', description = $$props.description);
    		if ('github' in $$props) $$invalidate('github', github = $$props.github);
    		if ('logo' in $$props) $$invalidate('logo', logo = $$props.logo);
    		if ('preview' in $$props) $$invalidate('preview', preview = $$props.preview);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('tags' in $$props) $$invalidate('tags', tags = $$props.tags);
    	};

    	return {
    		id,
    		age,
    		caption,
    		date,
    		description,
    		github,
    		logo,
    		preview,
    		title,
    		tags
    	};
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["id", "age", "caption", "date", "description", "github", "logo", "preview", "title"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Project", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.id === undefined && !('id' in props)) {
    			console.warn("<Project> was created without expected prop 'id'");
    		}
    		if (ctx.age === undefined && !('age' in props)) {
    			console.warn("<Project> was created without expected prop 'age'");
    		}
    		if (ctx.caption === undefined && !('caption' in props)) {
    			console.warn("<Project> was created without expected prop 'caption'");
    		}
    		if (ctx.date === undefined && !('date' in props)) {
    			console.warn("<Project> was created without expected prop 'date'");
    		}
    		if (ctx.description === undefined && !('description' in props)) {
    			console.warn("<Project> was created without expected prop 'description'");
    		}
    		if (ctx.github === undefined && !('github' in props)) {
    			console.warn("<Project> was created without expected prop 'github'");
    		}
    		if (ctx.logo === undefined && !('logo' in props)) {
    			console.warn("<Project> was created without expected prop 'logo'");
    		}
    		if (ctx.preview === undefined && !('preview' in props)) {
    			console.warn("<Project> was created without expected prop 'preview'");
    		}
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<Project> was created without expected prop 'title'");
    		}
    	}

    	get id() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get age() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set age(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get caption() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
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

    	get logo() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logo(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preview() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preview(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Home\Projects.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\routes\\Home\\Projects.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.id = list[i][0];
    	child_ctx.data = list[i][1];
    	return child_ctx;
    }

    // (17:2) {:else}
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
    			add_location(p, file$2, 17, 4, 353);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(p);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$1.name, type: "else", source: "(17:2) {:else}", ctx });
    	return block;
    }

    // (15:2) {#each Object.entries(projects) as [id, data]}
    function create_each_block$1(ctx) {
    	var current;

    	var project_spread_levels = [
    		{ id: ctx.id },
    		ctx.data
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
    									project_spread_levels[0],
    			get_spread_object(ctx.data)
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(15:2) {#each Object.entries(projects) as [id, data]}", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var div, current;

    	let each_value = Object.entries(ctx.projects);

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    		each_1_else.c();
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			this.h();
    		},

    		l: function claim(nodes) {
    			div = claim_element(nodes, "DIV", { id: true }, false);
    			var div_nodes = children(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(div_nodes);
    			}

    			div_nodes.forEach(detach_dev);
    			this.h();
    		},

    		h: function hydrate() {
    			attr_dev(div, "id", "projects");
    			add_location(div, file$2, 13, 0, 239);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.projects) {
    				each_value = Object.entries(ctx.projects);

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
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}

    			if (each_value.length) {
    				if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			} else if (!each_1_else) {
    				each_1_else = create_else_block$1(ctx);
    				each_1_else.c();
    				each_1_else.m(div, null);
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
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);

    			if (each_1_else) each_1_else.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	

      let projects = [];
      onMount(async () => {
        $$invalidate('projects', projects = await getResources());
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

    /* src\routes\Home\index.svelte generated by Svelte v3.12.1 */

    function create_fragment$5(ctx) {
    	var current;

    	var projects = new Projects({ $$inline: true });

    	const block = {
    		c: function create() {
    			projects.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			projects.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(projects, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(projects, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Index", options, id: create_fragment$5.name });
    	}
    }

    /* src\routes\Project\Project.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\routes\\Project\\Project.svelte";

    function create_fragment$6(ctx) {
    	var h1, t0, t1, html_tag;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(ctx.title);
    			t1 = space();
    			this.h();
    		},

    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {}, false);
    			var h1_nodes = children(h1);

    			t0 = claim_text(h1_nodes, ctx.title);
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			this.h();
    		},

    		h: function hydrate() {
    			add_location(h1, file$3, 5, 0, 64);
    			html_tag = new HtmlTag(ctx.body, null);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			html_tag.m(target, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data_dev(t0, ctx.title);
    			}

    			if (changed.body) {
    				html_tag.p(ctx.body);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h1);
    				detach_dev(t1);
    				html_tag.d();
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { title, body } = $$props;

    	const writable_props = ['title', 'body'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('body' in $$props) $$invalidate('body', body = $$props.body);
    	};

    	$$self.$capture_state = () => {
    		return { title, body };
    	};

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('body' in $$props) $$invalidate('body', body = $$props.body);
    	};

    	return { title, body };
    }

    class Project$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$6, safe_not_equal, ["title", "body"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Project", options, id: create_fragment$6.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<Project> was created without expected prop 'title'");
    		}
    		if (ctx.body === undefined && !('body' in props)) {
    			console.warn("<Project> was created without expected prop 'body'");
    		}
    	}

    	get title() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Project\routes.svelte generated by Svelte v3.12.1 */

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.project = list[i];
    	return child_ctx;
    }

    // (15:0) {#each resources as project}
    function create_each_block$2(ctx) {
    	var current;

    	var route = new Route({
    		props: {
    		title: ctx.project.data.title,
    		path: "/project/" + ctx.project.data.title,
    		component: Project$1,
    		props: ctx.project.data
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			route.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			route.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var route_changes = {};
    			if (changed.resources) route_changes.title = ctx.project.data.title;
    			if (changed.resources) route_changes.path = "/project/" + ctx.project.data.title;
    			if (changed.resources) route_changes.props = ctx.project.data;
    			route.$set(route_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$2.name, type: "each", source: "(15:0) {#each resources as project}", ctx });
    	return block;
    }

    function create_fragment$7(ctx) {
    	var each_1_anchor, current;

    	let each_value = ctx.resources;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
    			if (changed.resources || changed.Project) {
    				each_value = ctx.resources;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	

    let resources = [];
    onMount(async () => {
      $$invalidate('resources', resources = await getResources());
    });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('resources' in $$props) $$invalidate('resources', resources = $$props.resources);
    	};

    	return { resources };
    }

    class Routes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Routes", options, id: create_fragment$7.name });
    	}
    }

    /* src\routes\Tag\Tag.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\routes\\Tag\\Tag.svelte";

    function create_fragment$8(ctx) {
    	var h1, t0, t1, html_tag;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(ctx.title);
    			t1 = space();
    			this.h();
    		},

    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {}, false);
    			var h1_nodes = children(h1);

    			t0 = claim_text(h1_nodes, ctx.title);
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			this.h();
    		},

    		h: function hydrate() {
    			add_location(h1, file$4, 5, 0, 64);
    			html_tag = new HtmlTag(ctx.body, null);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			html_tag.m(target, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data_dev(t0, ctx.title);
    			}

    			if (changed.body) {
    				html_tag.p(ctx.body);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h1);
    				detach_dev(t1);
    				html_tag.d();
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { title, body } = $$props;

    	const writable_props = ['title', 'body'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Tag> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('body' in $$props) $$invalidate('body', body = $$props.body);
    	};

    	$$self.$capture_state = () => {
    		return { title, body };
    	};

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('body' in $$props) $$invalidate('body', body = $$props.body);
    	};

    	return { title, body };
    }

    class Tag$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$8, safe_not_equal, ["title", "body"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Tag", options, id: create_fragment$8.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<Tag> was created without expected prop 'title'");
    		}
    		if (ctx.body === undefined && !('body' in props)) {
    			console.warn("<Tag> was created without expected prop 'body'");
    		}
    	}

    	get title() {
    		throw new Error("<Tag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Tag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Tag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Tag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Tag\routes.svelte generated by Svelte v3.12.1 */

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.tag = list[i];
    	return child_ctx;
    }

    // (16:0) {#each tags as tag}
    function create_each_block$3(ctx) {
    	var current;

    	var route = new Route({
    		props: {
    		title: ctx.tag.id,
    		path: "/tag/" + ctx.tag.id,
    		component: Tag$1,
    		props: ctx.tag.data
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			route.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			route.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var route_changes = {};
    			if (changed.tags) route_changes.title = ctx.tag.id;
    			if (changed.tags) route_changes.path = "/tag/" + ctx.tag.id;
    			if (changed.tags) route_changes.props = ctx.tag.data;
    			route.$set(route_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$3.name, type: "each", source: "(16:0) {#each tags as tag}", ctx });
    	return block;
    }

    function create_fragment$9(ctx) {
    	var each_1_anchor, current;

    	let each_value = ctx.tags;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
    			if (changed.tags || changed.Tag) {
    				each_value = ctx.tags;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	

    let tags = [];
    onMount(async () => {
      $$invalidate('tags', tags = await getTags());
    });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('tags' in $$props) $$invalidate('tags', tags = $$props.tags);
    	};

    	return { tags };
    }

    class Routes$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$9, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Routes", options, id: create_fragment$9.name });
    	}
    }

    /* src\routes\Privacy.svelte generated by Svelte v3.12.1 */

    const file$5 = "src\\routes\\Privacy.svelte";

    function create_fragment$a(ctx) {
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$a.name, type: "component", source: "", ctx });
    	return block;
    }

    class Privacy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$a, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Privacy", options, id: create_fragment$a.name });
    	}
    }

    /* src\routes\Sitemap.svelte generated by Svelte v3.12.1 */

    const file$6 = "src\\routes\\Sitemap.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(h1, file$6, 0, 0, 0);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$b.name, type: "component", source: "", ctx });
    	return block;
    }

    class Sitemap extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$b, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Sitemap", options, id: create_fragment$b.name });
    	}
    }

    /* src\routes\index.svelte generated by Svelte v3.12.1 */

    function create_fragment$c(ctx) {
    	var t0, t1, t2, t3, current;

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

    	var projectroutes = new Routes({ $$inline: true });

    	var tagroutes = new Routes$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			router.$$.fragment.c();
    			t0 = space();
    			route0.$$.fragment.c();
    			t1 = space();
    			route1.$$.fragment.c();
    			t2 = space();
    			projectroutes.$$.fragment.c();
    			t3 = space();
    			tagroutes.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			router.$$.fragment.l(nodes);
    			t0 = claim_space(nodes);
    			route0.$$.fragment.l(nodes);
    			t1 = claim_space(nodes);
    			route1.$$.fragment.l(nodes);
    			t2 = claim_space(nodes);
    			projectroutes.$$.fragment.l(nodes);
    			t3 = claim_space(nodes);
    			tagroutes.$$.fragment.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(projectroutes, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(tagroutes, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);

    			transition_in(route0.$$.fragment, local);

    			transition_in(route1.$$.fragment, local);

    			transition_in(projectroutes.$$.fragment, local);

    			transition_in(tagroutes.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(projectroutes.$$.fragment, local);
    			transition_out(tagroutes.$$.fragment, local);
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

    			if (detaching) {
    				detach_dev(t2);
    			}

    			destroy_component(projectroutes, detaching);

    			if (detaching) {
    				detach_dev(t3);
    			}

    			destroy_component(tagroutes, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$c.name, type: "component", source: "", ctx });
    	return block;
    }

    class Index$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$c, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Index", options, id: create_fragment$c.name });
    	}
    }

    var app = new Index$1({
    	target: document.body.querySelector('app'),
    	hydrate: true
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
