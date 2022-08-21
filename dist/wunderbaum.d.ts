declare module "util" {
    /*!
     * Wunderbaum - util
     * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
     * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
     */
    /** @module util */
    /** Readable names for `MouseEvent.button` */
    export const MOUSE_BUTTONS: {
        [key: number]: string;
    };
    export const MAX_INT = 9007199254740991;
    /**True if the client is using a macOS platform. */
    export const isMac: boolean;
    export type FunctionType = (...args: any[]) => any;
    export type EventCallbackType = (e: Event) => boolean | void;
    /**
     * A ES6 Promise, that exposes the resolve()/reject() methods.
     */
    export class Deferred {
        private thens;
        private catches;
        private status;
        private resolvedValue;
        private rejectedError;
        constructor();
        resolve(value?: any): void;
        reject(error?: any): void;
        then(cb: any): void;
        catch(cb: any): void;
        promise(): {
            then: (cb: any) => void;
            catch: (cb: any) => void;
        };
    }
    /**Throw an `Error` if `cond` is falsey. */
    export function assert(cond: any, msg?: string): void;
    /** Run `callback` when document was loaded. */
    export function documentReady(callback: () => void): void;
    /** Resolve when document was loaded. */
    export function documentReadyPromise(): Promise<void>;
    /**
     * Iterate over Object properties or array elements.
     *
     * @param obj `Object`, `Array` or null
     * @param callback(index, item) called for every item.
     *  `this` also contains the item.
     *  Return `false` to stop the iteration.
     */
    export function each(obj: any, callback: (index: number | string, item: any) => void | boolean): any;
    /** Shortcut for `throw new Error(msg)`.*/
    export function error(msg: string): void;
    /** Convert `<`, `>`, `&`, `"`, `'`, and `/` to the equivalent entities. */
    export function escapeHtml(s: string): string;
    /**Convert a regular expression string by escaping special characters (e.g. `"$"` -> `"\$"`) */
    export function escapeRegex(s: string): string;
    /** Convert `<`, `>`, `"`, `'`, and `/` (but not `&`) to the equivalent entities. */
    export function escapeTooltip(s: string): string;
    /** TODO */
    export function extractHtmlText(s: string): string;
    /**
     * Read the value from an HTML input element.
     *
     * If a `<span class="wb-col">` is passed, the first child input is used.
     * Depending on the target element type, `value` is interpreted accordingly.
     * For example for a checkbox, a value of true, false, or null is returned if
     * the element is checked, unchecked, or indeterminate.
     * For datetime input control a numerical value is assumed, etc.
     *
     * Common use case: store the new user input in the `change` event:
     *
     * ```ts
     *   change: (e) => {
     *     // Read the value from the input control that triggered the change event:
     *     let value = e.tree.getValueFromElem(e.element);
     *     //
     *     e.node.data[]
     *   },
     * ```
     * @param elem `<input>` or `<select>` element Also a parent `span.wb-col` is accepted.
     * @param coerce pass true to convert date/time inputs to `Date`.
     * @returns the value
     */
    export function getValueFromElem(elem: HTMLElement, coerce?: boolean): any;
    /**
     * Set the value of an HTML input element.
     *
     * If a `<span class="wb-col">` is passed, the first child input is used.
     * Depending on the target element type, `value` is interpreted accordingly.
     * For example a checkbox is set to checked, unchecked, or indeterminate if the
     * value is truethy, falsy, or `null`.
     * For datetime input control a numerical value is assumed, etc.
     *
     * @param elem `<input>` or `<select>` element Also a parent `span.wb-col` is accepted.
     * @param value a value that matches the target element.
     */
    export function setValueToElem(elem: HTMLElement, value: any): void;
    /** Create and return an unconnected `HTMLElement` from a HTML string. */
    export function elemFromHtml(html: string): HTMLElement;
    /** Return a HtmlElement from selector or cast an existing element. */
    export function elemFromSelector(obj: string | Element): HTMLElement | null;
    /** Return a EventTarget from selector or cast an existing element. */
    export function eventTargetFromSelector(obj: string | EventTarget): EventTarget | null;
    /**
     * Return a canonical descriptive string for a keyboard or mouse event.
     *
     * The result also contains a prefix for modifiers if any, for example
     * `"x"`, `"F2"`, `"Control+Home"`, or `"Shift+clickright"`.
     * This is especially useful in `switch` statements, to make sure that modifier
     * keys are considered and handled correctly.
     */
    export function eventToString(event: Event): string;
    /**
     * Copy allproperties from one or more source objects to a target object.
     *
     * @returns the modified target object.
     */
    export function extend(...args: any[]): any;
    /** Return true if `obj` is of type `array`. */
    export function isArray(obj: any): boolean;
    /** Return true if `obj` is of type `Object` and has no propertied. */
    export function isEmptyObject(obj: any): boolean;
    /** Return true if `obj` is of type `function`. */
    export function isFunction(obj: any): boolean;
    /** Return true if `obj` is of type `Object`. */
    export function isPlainObject(obj: any): boolean;
    /** A dummy function that does nothing ('no operation'). */
    export function noop(...args: any[]): any;
    /**
     * Bind one or more event handlers directly to an [[EventTarget]].
     *
     * @param element EventTarget or selector
     * @param eventNames
     * @param handler
     */
    export function onEvent(rootTarget: EventTarget | string, eventNames: string, handler: EventCallbackType): void;
    /**
     * Bind one or more event handlers using event delegation.
     *
     * E.g. handle all 'input' events for input and textarea elements of a given
     * form:
     * ```ts
     * onEvent("#form_1", "input", "input,textarea", function (e: Event) {
     *   console.log(e.type, e.target);
     * });
     * ```
     *
     * @param element EventTarget or selector
     * @param eventNames
     * @param selector
     * @param handler
     */
    export function onEvent(rootTarget: EventTarget | string, eventNames: string, selector: string, handler: EventCallbackType): void;
    /** Return a wrapped handler method, that provides `this._super`.
     *
     * ```ts
      // Implement `opts.createNode` event to add the 'draggable' attribute
      overrideMethod(ctx.options, "createNode", (event, data) => {
        // Default processing if any
        this._super.apply(this, event, data);
        // Add 'draggable' attribute
        data.node.span.draggable = true;
      });
      ```
      */
    export function overrideMethod(instance: any, methodName: string, handler: FunctionType, ctx?: any): void;
    /** Run function after ms milliseconds and return a promise that resolves when done. */
    export function setTimeoutPromise(this: unknown, callback: (...args: any[]) => void, ms: number): Promise<unknown>;
    /**
     * Wait `ms` microseconds.
     *
     * Example:
     * ```js
     * await sleep(1000);
     * ```
     * @param ms duration
     * @returns
     */
    export function sleep(ms: number): Promise<unknown>;
    /**
     * Set or rotate checkbox status with support for tri-state.
     *
     * An initial 'indeterminate' state becomes 'checked' on the first call.
     *
     * If the input element has the class 'wb-tristate' assigned, the sequence is:<br>
     * 'indeterminate' -> 'checked' -> 'unchecked' -> 'indeterminate' -> ...<br>
     * Otherwise we toggle like <br>
     * 'checked' -> 'unchecked' -> 'checked' -> ...
     */
    export function toggleCheckbox(element: HTMLElement | string, value?: boolean | null, tristate?: boolean): void;
    /**
     * Return `opts.NAME` if opts is valid and
     *
     * @param opts dict, object, or null
     * @param name option name (use dot notation to access extension option, e.g. `filter.mode`)
     * @param defaultValue returned when `opts` is not an object, or does not have a NAME property
     */
    export function getOption(opts: any, name: string, defaultValue?: any): any;
    /** Convert an Array or space-separated string to a Set. */
    export function toSet(val: any): Set<string>;
    /** Return a canonical string representation for an object's type (e.g. 'array', 'number', ...). */
    export function type(obj: any): string;
    /**
     * Return a function that can be called instead of `callback`, but guarantees
     * a limited execution rate.
     * The execution rate is calculated based on the runtime duration of the
     * previous call.
     * Example:
     * ```js
     * throttledFoo = util.adaptiveThrottle(foo.bind(this), {});
     * throttledFoo();
     * throttledFoo();
     * ```
     */
    export function adaptiveThrottle(this: unknown, callback: (...args: any[]) => void, options: any): (...args: any[]) => void;
}
declare module "deferred" {
    /*!
     * Wunderbaum - deferred
     * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
     * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
     */
    type PromiseCallbackType = (val: any) => void;
    type finallyCallbackType = () => void;
    /**
     * Implement a ES6 Promise, that exposes a resolve() and reject() method.
     *
     * Loosely mimics {@link https://api.jquery.com/category/deferred-object/ | jQuery.Deferred}.
     * Example:
     * ```js
     * function foo() {
     *   let dfd = new Deferred(),
     *   ...
     *   dfd.resolve('foo')
     *   ...
     *   return dfd.promise();
     * }
     * ```
     */
    export class Deferred {
        private _promise;
        protected _resolve: any;
        protected _reject: any;
        constructor();
        /** Resolve the [[Promise]]. */
        resolve(value?: any): void;
        /** Reject the [[Promise]]. */
        reject(reason?: any): void;
        /** Return the native [[Promise]] instance.*/
        promise(): Promise<any>;
        /** Call [[Promise.then]] on the embedded promise instance.*/
        then(cb: PromiseCallbackType): Promise<void>;
        /** Call [[Promise.catch]] on the embedded promise instance.*/
        catch(cb: PromiseCallbackType): Promise<any>;
        /** Call [[Promise.finally]] on the embedded promise instance.*/
        finally(cb: finallyCallbackType): Promise<any>;
    }
}
declare module "wb_extension_base" {
    import { Wunderbaum } from "wunderbaum";
    export type ExtensionsDict = {
        [key: string]: WunderbaumExtension;
    };
    export abstract class WunderbaumExtension {
        enabled: boolean;
        readonly id: string;
        readonly tree: Wunderbaum;
        readonly treeOpts: any;
        readonly extensionOpts: any;
        constructor(tree: Wunderbaum, id: string, defaults: any);
        /** Called on tree (re)init after all extensions are added, but before loading.*/
        init(): void;
        getPluginOption(name: string, defaultValue?: any): any;
        setPluginOption(name: string, value: any): void;
        setEnabled(flag?: boolean): void;
        onKeyEvent(data: any): boolean | undefined;
        onRender(data: any): boolean | undefined;
    }
}
declare module "wb_ext_dnd" {
    import { Wunderbaum } from "wunderbaum";
    import { WunderbaumExtension } from "wb_extension_base";
    import { WunderbaumNode } from "wb_node";
    import { WbNodeEventType } from "common";
    export type DropRegionType = "over" | "before" | "after";
    type DropRegionTypeSet = Set<DropRegionType>;
    export type DndOptionsType = {
        /**
         * Expand nodes after n milliseconds of hovering
         * Default: 1500
         */
        autoExpandMS: 1500;
        /**
         * true: Drag multiple (i.e. selected) nodes. Also a callback() is allowed
         * Default: false
         */
        multiSource: false;
        /**
         * Restrict the possible cursor shapes and modifier operations (can also be set in the dragStart event)
         * Default: "all"
         */
        effectAllowed: "all";
        /**
         * Default dropEffect ('copy', 'link', or 'move') when no modifier is pressed (overide in dragDrag, dragOver).
         * Default: "move"
         */
        dropEffectDefault: string;
        /**
         * Prevent dropping nodes from different Wunderbaum trees
         * Default: false
         */
        preventForeignNodes: boolean;
        /**
         * Prevent dropping items on unloaded lazy Wunderbaum tree nodes
         * Default: true
         */
        preventLazyParents: boolean;
        /**
         * Prevent dropping items other than Wunderbaum tree nodes
         * Default: false
         */
        preventNonNodes: boolean;
        /**
         * Prevent dropping nodes on own descendants
         * Default: true
         */
        preventRecursion: boolean;
        /**
         * Prevent dropping nodes under same direct parent
         * Default: false
         */
        preventSameParent: false;
        /**
         * Prevent dropping nodes 'before self', etc. (move only)
         * Default: true
         */
        preventVoidMoves: boolean;
        /**
         * Enable auto-scrolling while dragging
         * Default: true
         */
        scroll: boolean;
        /**
         * Active top/bottom margin in pixel
         * Default: 20
         */
        scrollSensitivity: 20;
        /**
         * Pixel per event
         * Default: 5
         */
        scrollSpeed: 5;
        /**
         * Optional callback passed to `toDict` on dragStart @since 2.38
         * Default: null
         */
        sourceCopyHook: null;
        /**
         * Callback(sourceNode, data), return true, to enable dnd drag
         * Default: null
         */
        dragStart?: WbNodeEventType;
        /**
         * Callback(sourceNode, data)
         * Default: null
         */
        dragDrag: null;
        /**
         * Callback(sourceNode, data)
         * Default: null
         */
        dragEnd: null;
        /**
         * Callback(targetNode, data), return true, to enable dnd drop
         * Default: null
         */
        dragEnter: null;
        /**
         * Callback(targetNode, data)
         * Default: null
         */
        dragOver: null;
        /**
         * Callback(targetNode, data), return false to prevent autoExpand
         * Default: null
         */
        dragExpand: null;
        /**
         * Callback(targetNode, data)
         * Default: null
         */
        dragDrop: null;
        /**
         * Callback(targetNode, data)
         * Default: null
         */
        dragLeave: null;
    };
    export class DndExtension extends WunderbaumExtension {
        protected srcNode: WunderbaumNode | null;
        protected lastTargetNode: WunderbaumNode | null;
        protected lastEnterStamp: number;
        protected lastAllowedDropRegions: DropRegionTypeSet | null;
        protected lastDropEffect: string | null;
        protected lastDropRegion: DropRegionType | false;
        constructor(tree: Wunderbaum);
        init(): void;
        /** Cleanup classes after target node is no longer hovered. */
        protected _leaveNode(): void;
        /** */
        protected unifyDragover(res: any): DropRegionTypeSet | false;
        /** */
        protected _calcDropRegion(e: DragEvent, allowed: DropRegionTypeSet | null): DropRegionType | false;
        protected autoScroll(event: DragEvent): number;
        protected onDragEvent(e: DragEvent): boolean;
        protected onDropEvent(e: DragEvent): boolean;
    }
}
declare module "wb_options" {
    /*!
     * Wunderbaum - utils
     * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
     * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
     */
    import { BoolOptionResolver, NavigationModeOption, WbNodeEventType, WbTreeEventType } from "common";
    import { DndOptionsType } from "wb_ext_dnd";
    export interface WbNodeData {
        title: string;
        key?: string;
        refKey?: string;
        expanded?: boolean;
        selected?: boolean;
        checkbox?: boolean | string;
        children?: Array<WbNodeData>;
    }
    export interface ColumnDefinition {
        /** Column ID (pass "*" for the main tree nodes column ) */
        id: string;
        /** Column header (defaults to id) */
        title: string;
        /** Column width or weight.
         * Either an absolute pixel value (e.g. `"50px"`) or a relative weight (e.g. `1`)
         * that is used to calculate the width  inside the remaining available space.
         * Default: `"*"`, which is interpreted as `1`.
         */
        width?: string | number;
        /** Only used for columns with a relative weight.
         * Default: `4px`.
         */
        minWidth?: string | number;
        /** Optional class names that are added to all `span.wb-col` elements of that column.*/
        classes?: string;
        /** Optional HTML content that is rendered into all `span.wb-col` elements of that column.*/
        html: string;
    }
    export interface TypeDefinition {
        /** En/disable checkbox for matching nodes.*/
        checkbox?: boolean | BoolOptionResolver;
        /** Optional class names that are added to all `div.wb-row` elements of matching nodes.*/
        classes?: string;
        /**Default icon for matching nodes.*/
        icon?: boolean | string | BoolOptionResolver;
        /**
         * See also {@link WunderbaumNode.getOption|WunderbaumNode.getOption()}
         * to evaluate `node.NAME` setting and `tree.types[node.type].NAME`.
         */
        _any: any;
    }
    /**
     * Available options for [[Wunderbaum]].
     *
     * Options are passed to the constructor as plain object:
     *
     * ```js
     * const tree = new mar10.Wunderbaum({
     *   id: "demo",
     *   element: document.querySelector("#demo-tree"),
     *   source: "url/of/data/request",
     *   ...
     * });
     * ```
     *
     * Event handlers are also passed as callbacks
     *
     * ```js
     * const tree = new mar10.Wunderbaum({
     *   ...
     *   init: (e) => {
     *     console.log(`Tree ${e.tree} was initialized and loaded.`)
     *   },
     *   activate: (e) => {
     *     console.log(`Node ${e.node} was activated.`)
     *   },
     *   ...
     * });
     * ```
     */
    export interface WunderbaumOptions {
        /**
         * The target `div` element (or selector) that shall become a Wunderbaum.
         */
        element: string | HTMLDivElement;
        /**
         * The identifier of this tree. Used to reference the instance, especially
         * when multiple trees are present (e.g. `tree = mar10.Wunderbaum.getTree("demo")`).
         *
         * Default: `"wb_" + COUNTER`.
         */
        id?: string;
        /**
         * Define the initial tree data. Typically a URL of an endpoint that serves
         * a JSON formatted structure, but also a callback, Promise, or static data
         * is allowed.
         *
         * Default: `{}`.
         */
        source?: string | Array<WbNodeData>;
        /**
         * Define shared attributes for multiple nodes of the same type.
         * This allows for more compact data models. Type definitions can be passed
         * as tree option, or be part of a `source` response.
         *
         * Default: `{}`.
         */
        types?: {
            [key: string]: TypeDefinition;
        };
        /**
         * A list of maps that define column headers. If this option is set,
         * Wunderbaum becomes a treegrid control instead of a plain tree.
         * Column definitions can be passed as tree option, or be part of a `source`
         * response.
         * Default: `[]` meaning this is a plain tree.
         */
        columns?: Array<ColumnDefinition>;
        /**
         * If true, add a `wb-skeleton` class to all nodes, that will result in a
         * 'glow' effect. Typically used with initial dummy nodes, while loading the
         * real data.
         * Default: false.
         */
        skeleton?: false;
        /**
         * Translation map for some system messages.
         */
        strings?: any;
        /**
         * 0:quiet, 1:errors, 2:warnings, 3:info, 4:verbose
         * Default: 3 (4 in local debug environment)
         */
        debugLevel: number;
        /**
         * Number of levels that are forced to be expanded, and have no expander icon.
         * Default: 0
         */
        minExpandLevel?: number;
        /**
         * Height of the header row div.
         * Default: 22
         */
        headerHeightPx: number;
        /**
         * Height of a node row div.
         * Default: 22
         */
        rowHeightPx?: number;
        /**
         * Collapse siblings when a node is expanded.
         * Default: false
         */
        autoCollapse?: boolean;
        /**
         * HTMLElement that receives the top nodes breadcrumb.
         * Default: undefined
         */
        attachBreadcrumb?: HTMLElement;
        /**
         * Default:  NavigationModeOption.startRow
         */
        navigationMode?: NavigationModeOption;
        /**
         * Show/hide header (pass bool or string)
         */
        header?: boolean | string | null;
        /**
         *
         */
        showSpinner?: boolean;
        /**
         * Default: true
         */
        checkbox?: boolean | "radio" | BoolOptionResolver;
        /**
         * Default: 200
         */
        updateThrottleWait?: number;
        /**
         * Default: true
         */
        enabled?: boolean;
        /**
         * Default: false
         */
        fixedCol?: boolean;
        /**
         * Default: true
         */
        quicksearch?: boolean;
        dnd?: DndOptionsType;
        edit: any;
        filter: any;
        grid: any;
        /**
         *
         * @category Callback
         */
        activate?: (e: WbNodeEventType) => void;
        /**
         *
         * @category Callback
         */
        change?: (e: WbNodeEventType) => void;
        /**
         *
         * Return `false` to prevent default handling, e.g. activating the node.
         * @category Callback
         */
        click?: (e: WbTreeEventType) => void;
        /**
         *
         * @category Callback
         */
        deactivate?: (e: WbNodeEventType) => void;
        /**
         *
         * @category Callback
         */
        discard?: (e: WbNodeEventType) => void;
        /**
         *
         * @category Callback
         */
        enhanceTitle?: (e: WbNodeEventType) => void;
        /**
         *
         * @category Callback
         */
        error?: (e: WbTreeEventType) => void;
        /**
         *
         * Check `e.flag` for status.
         * @category Callback
         */
        focus?: (e: WbTreeEventType) => void;
        /**
         * Fires when the tree markup was created and the initial source data was loaded.
         * Typical use cases would be activating a node, setting focus, enabling other
         * controls on the page, etc.<br>
         * Check `e.error` for status.
         * @category Callback
         */
        init?: (e: WbTreeEventType) => void;
        /**
         *
         * @category Callback
         */
        keydown?: (e: WbNodeEventType) => void;
        /**
         * Fires when a node that was marked 'lazy', is expanded for the first time.
         * Typically we return an endpoint URL or the Promise of a fetch request that
         * provides a (potentially nested) list of child nodes.
         * @category Callback
         */
        lazyLoad?: (e: WbNodeEventType) => void;
        /**
         * Fires when data was loaded (initial request, reload, or lazy loading),
         * after the data is applied and rendered.
         * @category Callback
         */
        load?: (e: WbNodeEventType) => void;
        /**
         * @category Callback
         */
        modifyChild?: (e: WbNodeEventType) => void;
        /**
         * Fires when data was fetched (initial request, reload, or lazy loading),
         * but before the data is applied and rendered.
         * Here we can modify and adjust the received data, for example to convert an
         * external response to native Wunderbaum syntax.
         * @category Callback
         */
        receive?: (e: WbNodeEventType) => void;
        /**
         * Fires when a node is about to be displayed.
         * The default HTML markup is already created, but not yet added to the DOM.
         * Now we can tweak the markup, create HTML elements in this node's column
         * cells, etc.
         * See also `Custom Rendering` for details.
         * @category Callback
         */
        render?: (e: WbNodeEventType) => void;
        /**
         *
         * @category Callback
         */
        renderStatusNode?: (e: WbNodeEventType) => void;
        /**
         *
         * Check `e.flag` for status.
         * @category Callback
         */
        select?: (e: WbNodeEventType) => void;
        /**
         * Fires when the viewport content was updated, after scroling, expanding etc.
         * @category Callback
         */
        update?: (e: WbTreeEventType) => void;
    }
}
declare module "wb_node" {
    /*!
     * Wunderbaum - wunderbaum_node
     * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
     * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
     */
    import "./wunderbaum.scss";
    import { Wunderbaum } from "wunderbaum";
    import { ChangeType, MatcherType, NodeAnyCallback, NodeStatusType, NodeVisitCallback, NodeVisitResponse, ApplyCommandType, AddNodeType, SetActiveOptions, SetExpandedOptions, SetSelectedOptions } from "common";
    import { WbNodeData } from "wb_options";
    /**
     * A single tree node.
     *
     * **NOTE:** <br>
     * Generally you should not modify properties directly, since this may break
     * the internal bookkeeping.
     */
    export class WunderbaumNode {
        static sequence: number;
        /** Reference to owning tree. */
        tree: Wunderbaum;
        /** Parent node (null for the invisible root node `tree.root`). */
        parent: WunderbaumNode;
        /** Name of the node.
         * @see Use {@link setTitle} to modify. */
        title: string;
        /** Unique key. Passed with constructor or defaults to `SEQUENCE`.
         * @see Use {@link setKey} to modify. */
        readonly key: string;
        /** Reference key. Unlike {@link key}, a `refKey` may occur multiple
         * times within a tree (in this case we have 'clone nodes').
         * @see Use {@link setKey} to modify.
         */
        readonly refKey: string | undefined;
        children: WunderbaumNode[] | null;
        checkbox?: boolean;
        colspan?: boolean;
        icon?: boolean | string;
        lazy: boolean;
        /** Expansion state.
         * @see {@link isExpandable}, {@link isExpanded}, {@link setExpanded}. */
        expanded: boolean;
        /** Selection state.
         * @see {@link isSelected}, {@link setSelected}. */
        selected: boolean;
        type?: string;
        tooltip?: string;
        /** Additional classes added to `div.wb-row`.
         * @see {@link hasClass}, {@link setClass}. */
        classes: Set<string> | null;
        /** Custom data that was passed to the constructor */
        data: any;
        statusNodeType?: string;
        _isLoading: boolean;
        _requestId: number;
        _errorInfo: any | null;
        _partsel: boolean;
        _partload: boolean;
        match?: boolean;
        subMatchCount?: number;
        subMatchBadge?: HTMLElement;
        /** @internal */
        titleWithHighlight?: string;
        _filterAutoExpanded?: boolean;
        _rowIdx: number | undefined;
        _rowElem: HTMLDivElement | undefined;
        constructor(tree: Wunderbaum, parent: WunderbaumNode, data: any);
        /**
         * Return readable string representation for this instance.
         * @internal
         */
        toString(): string;
        /** Call event handler if defined in tree.options.
         * Example:
         * ```js
         * node._callEvent("edit.beforeEdit", {foo: 42})
         * ```
         */
        _callEvent(type: string, extra?: any): any;
        /**
         * Append (or insert) a list of child nodes.
         *
         * Tip: pass `{ before: 0 }` to prepend children
         * @param {NodeData[]} nodeData array of child node definitions (also single child accepted)
         * @param  child node (or key or index of such).
         *     If omitted, the new children are appended.
         * @returns first child added
         */
        addChildren(nodeData: any, options?: any): WunderbaumNode;
        /**
         * Append or prepend a node, or append a child node.
         *
         * This a convenience function that calls addChildren()
         *
         * @param {NodeData} node node definition
         * @param [mode=child] 'before', 'after', 'firstChild', or 'child' ('over' is a synonym for 'child')
         * @returns new node
         */
        addNode(nodeData: WbNodeData, mode?: string): WunderbaumNode;
        /**
         * Apply a modification (or navigation) operation.
         *
         * @see {@link Wunderbaum.applyCommand}
         */
        applyCommand(cmd: ApplyCommandType, opts: any): any;
        /**
         * Add/remove one or more classes to `<div class='wb-row'>`.
         *
         * This also maintains `node.classes`, so the class will survive a re-render.
         *
         * @param className one or more class names. Multiple classes can be passed
         *     as space-separated string, array of strings, or set of strings.
         */
        setClass(className: string | string[] | Set<string>, flag?: boolean): void;
        /** */
        expandAll(flag?: boolean): Promise<void>;
        /**Find all nodes that match condition (excluding self).
         *
         * @param {string | function(node)} match title string to search for, or a
         *     callback function that returns `true` if a node is matched.
         */
        findAll(match: string | MatcherType): WunderbaumNode[];
        /** Return the direct child with a given key, index or null. */
        findDirectChild(ptr: number | string | WunderbaumNode): WunderbaumNode | null;
        /**Find first node that matches condition (excluding self).
         *
         * @param match title string to search for, or a
         *     callback function that returns `true` if a node is matched.
         */
        findFirst(match: string | MatcherType): WunderbaumNode | null;
        /** Find a node relative to self.
         *
         * @see {@link Wunderbaum.findRelatedNode|tree.findRelatedNode()}
         */
        findRelatedNode(where: string, includeHidden?: boolean): any;
        /** Return the `<span class='wb-col'>` element with a given index or id.
         * @returns {WunderbaumNode | null}
         */
        getColElem(colIdx: number | string): HTMLSpanElement;
        /** Return the first child node or null.
         * @returns {WunderbaumNode | null}
         */
        getFirstChild(): WunderbaumNode;
        /** Return the last child node or null.
         * @returns {WunderbaumNode | null}
         */
        getLastChild(): WunderbaumNode;
        /** Return node depth (starting with 1 for top level nodes). */
        getLevel(): number;
        /** Return the successive node (under the same parent) or null. */
        getNextSibling(): WunderbaumNode | null;
        /** Return the parent node (null for the system root node). */
        getParent(): WunderbaumNode | null;
        /** Return an array of all parent nodes (top-down).
         * @param includeRoot Include the invisible system root node.
         * @param includeSelf Include the node itself.
         */
        getParentList(includeRoot?: boolean, includeSelf?: boolean): any[];
        /** Return a string representing the hierachical node path, e.g. "a/b/c".
         * @param includeSelf
         * @param node property name or callback
         * @param separator
         */
        getPath(includeSelf?: boolean, part?: keyof WunderbaumNode | NodeAnyCallback, separator?: string): string;
        /** Return the preceeding node (under the same parent) or null. */
        getPrevSibling(): WunderbaumNode | null;
        /** Return true if node has children.
         * Return undefined if not sure, i.e. the node is lazy and not yet loaded.
         */
        hasChildren(): boolean;
        /** Return true if node has className set. */
        hasClass(className: string): boolean;
        /** Return true if this node is the currently active tree node. */
        isActive(): boolean;
        /** Return true if this node is a *direct* child of `other`.
         * (See also [[isDescendantOf]].)
         */
        isChildOf(other: WunderbaumNode): boolean;
        /** Return true if this node is a direct or indirect sub node of `other`.
         * (See also [[isChildOf]].)
         */
        isDescendantOf(other: WunderbaumNode): boolean;
        /** Return true if this node has children, i.e. the node is generally expandable.
         * If `andCollapsed` is set, we also check if this node is collapsed, i.e.
         * an expand operation is currently possible.
         */
        isExpandable(andCollapsed?: boolean): boolean;
        /** Return true if this node is currently in edit-title mode. */
        isEditing(): boolean;
        /** Return true if this node is currently expanded. */
        isExpanded(): boolean;
        /** Return true if this node is the first node of its parent's children. */
        isFirstSibling(): boolean;
        /** Return true if this node is the last node of its parent's children. */
        isLastSibling(): boolean;
        /** Return true if this node is lazy (even if data was already loaded) */
        isLazy(): boolean;
        /** Return true if node is lazy and loaded. For non-lazy nodes always return true. */
        isLoaded(): boolean;
        /** Return true if node is currently loading, i.e. a GET request is pending. */
        isLoading(): boolean;
        /** Return true if this node is a temporarily generated status node of type 'paging'. */
        isPagingNode(): boolean;
        /** (experimental) Return true if this node is partially loaded. */
        isPartload(): boolean;
        /** Return true if this node is partially selected (tri-state). */
        isPartsel(): boolean;
        /** Return true if this node has DOM representaion, i.e. is displayed in the viewport. */
        isRendered(): boolean;
        /** Return true if this node is the (invisible) system root node.
         * (See also [[isTopLevel()]].)
         */
        isRootNode(): boolean;
        /** Return true if this node is selected, i.e. the checkbox is set. */
        isSelected(): boolean;
        /** Return true if this node is a temporarily generated system node like
         * 'loading', 'paging', or 'error' (node.statusNodeType contains the type).
         */
        isStatusNode(): boolean;
        /** Return true if this a top level node, i.e. a direct child of the (invisible) system root node. */
        isTopLevel(): boolean;
        /** Return true if node is marked lazy but not yet loaded.
         * For non-lazy nodes always return false.
         */
        isUnloaded(): boolean;
        /** Return true if all parent nodes are expanded. Note: this does not check
         * whether the node is scrolled into the visible part of the screen or viewport.
         */
        isVisible(): boolean;
        protected _loadSourceObject(source: any): void;
        /** Download  data from the cloud, then call `.update()`. */
        load(source: any): Promise<void>;
        /**Load content of a lazy node. */
        loadLazy(forceReload?: boolean): Promise<void>;
        /** Alias for `logDebug` */
        log(...args: any[]): void;
        logDebug(...args: any[]): void;
        logError(...args: any[]): void;
        logInfo(...args: any[]): void;
        logWarn(...args: any[]): void;
        /** Expand all parents and optionally scroll into visible area as neccessary.
         * Promise is resolved, when lazy loading and animations are done.
         * @param {object} [opts] passed to `setExpanded()`.
         *     Defaults to {noAnimation: false, noEvents: false, scrollIntoView: true}
         */
        makeVisible(opts: any): Promise<any>;
        /** Move this node to targetNode. */
        moveTo(targetNode: WunderbaumNode, mode?: AddNodeType, map?: NodeAnyCallback): void;
        /** Set focus relative to this node and optionally activate.
         *
         * 'left' collapses the node if it is expanded, or move to the parent
         * otherwise.
         * 'right' expands the node if it is collapsed, or move to the first
         * child otherwise.
         *
         * @param where 'down', 'first', 'last', 'left', 'parent', 'right', or 'up'.
         *   (Alternatively the `event.key` that would normally trigger this move,
         *   e.g. `ArrowLeft` = 'left'.
         * @param options
         */
        navigate(where: string, options?: any): Promise<any>;
        /** Delete this node and all descendants. */
        remove(): void;
        /** Remove all descendants of this node. */
        removeChildren(): void;
        /** Remove all HTML markup from the DOM. */
        removeMarkup(): void;
        protected _getRenderInfo(): {
            [key: string]: any;
        };
        protected _createIcon(parentElem: HTMLElement, replaceChild?: HTMLElement): HTMLElement | null;
        /**
         * Create a whole new `<div class="wb-row">` element.
         * @see {@link Wunderbaumode.render}
         */
        protected _render_markup(opts: any): void;
        /**
         * Render `node.title`, `.icon` into an existing row.
         *
         * @see {@link Wunderbaumode.render}
         */
        protected _render_data(opts: any): void;
        /**
         * Update row classes to reflect active, focuses, etc.
         * @see {@link Wunderbaumode.render}
         */
        protected _render_status(opts: any): void;
        /**
         * Create or update node's markup.
         *
         * `options.change` defaults to ChangeType.data, which updates the title,
         * icon, and status. It also triggers the `render` event, that lets the user
         * create or update the content of embeded cell elements.<br>
         *
         * If only the status or other class-only modifications have changed,
         * `options.change` should be set to ChangeType.status instead for best
         * efficiency.
         */
        render(options?: any): void;
        /**
         * Remove all children, collapse, and set the lazy-flag, so that the lazyLoad
         * event is triggered on next expand.
         */
        resetLazy(): void;
        /** Convert node (or whole branch) into a plain object.
         *
         * The result is compatible with node.addChildren().
         *
         * @param include child nodes
         * @param callback(dict, node) is called for every node, in order to allow
         *     modifications.
         *     Return `false` to ignore this node or `"skip"` to include this node
         *     without its children.
         * @returns {NodeData}
         */
        toDict(recursive?: boolean, callback?: any): any;
        /** Return an option value that has a default, but may be overridden by a
         * callback or a node instance attribute.
         *
         * Evaluation sequence:
         *
         * - If `tree.options.<name>` is a callback that returns something, use that.
         * - Else if `node.<name>` is defined, use that.
         * - Else if `tree.types[<node.type>]` is a value, use that.
         * - Else if `tree.options.<name>` is a value, use that.
         * - Else use `defaultValue`.
         *
         * @param name name of the option property (on node and tree)
         * @param defaultValue return this if nothing else matched
         * {@link Wunderbaum.getOption|Wunderbaum.getOption()}
         */
        getOption(name: string, defaultValue?: any): any;
        /** Make sure that this node is visible in the viewport.
         * @see {@link Wunderbaum.scrollTo|Wunderbaum.scrollTo()}
         */
        scrollIntoView(options?: any): Promise<void>;
        /**
         * Activate this node, deactivate previous, send events, activate column and scroll int viewport.
         */
        setActive(flag?: boolean, options?: SetActiveOptions): Promise<void>;
        /**
         * Expand or collapse this node.
         */
        setExpanded(flag?: boolean, options?: SetExpandedOptions): Promise<void>;
        /**
         * Set keyboard focus here.
         * @see {@link setActive}
         */
        setFocus(flag?: boolean, options?: any): void;
        /** Set a new icon path or class. */
        setIcon(): void;
        /** Change node's {@link key} and/or {@link refKey}.  */
        setKey(key: string | null, refKey: string | null): void;
        /**
         * Schedule a render, typically called to update after a status or data change.
         *
         * `change` defaults to 'data', which handles modifcations of title, icon,
         * and column content. It can be reduced to 'ChangeType.status' if only
         * active/focus/selected state has changed.
         */
        setModified(change?: ChangeType): void;
        /** Modify the check/uncheck state. */
        setSelected(flag?: boolean, options?: SetSelectedOptions): void;
        /** Display node status (ok, loading, error, noData) using styles and a dummy child node. */
        setStatus(status: NodeStatusType, message?: string, details?: string): WunderbaumNode | null;
        /** Rename this node. */
        setTitle(title: string): void;
        /**
         * Trigger `modifyChild` event on a parent to signal that a child was modified.
         * @param {string} operation Type of change: 'add', 'remove', 'rename', 'move', 'data', ...
         */
        triggerModifyChild(operation: string, child: WunderbaumNode | null, extra?: any): void;
        /**
         * Trigger `modifyChild` event on node.parent(!).
         * @param {string} operation Type of change: 'add', 'remove', 'rename', 'move', 'data', ...
         * @param {object} [extra]
         */
        triggerModify(operation: string, extra?: any): void;
        /**
         * Call fn(node) for all child nodes in hierarchical order (depth-first).
         *
         * Stop iteration, if fn() returns false. Skip current branch, if fn()
         * returns "skip".<br>
         * Return false if iteration was stopped.
         *
         * @param {function} callback the callback function.
         *     Return false to stop iteration, return "skip" to skip this node and
         *     its children only.
         */
        visit(callback: NodeVisitCallback, includeSelf?: boolean): NodeVisitResponse;
        /** Call fn(node) for all parent nodes, bottom-up, including invisible system root.<br>
         * Stop iteration, if callback() returns false.<br>
         * Return false if iteration was stopped.
         *
         * @param callback the callback function. Return false to stop iteration
         */
        visitParents(callback: (node: WunderbaumNode) => boolean | void, includeSelf?: boolean): boolean;
        /**
         * Call fn(node) for all sibling nodes.<br>
         * Stop iteration, if fn() returns false.<br>
         * Return false if iteration was stopped.
         *
         * @param {function} fn the callback function.
         *     Return false to stop iteration.
         */
        visitSiblings(callback: (node: WunderbaumNode) => boolean | void, includeSelf?: boolean): boolean;
        /**
         * [ext-filter] Return true if this node is matched by current filter (or no filter is active).
         */
        isMatched(): boolean;
    }
}
declare module "common" {
    import { WunderbaumNode } from "wb_node";
    import { Wunderbaum } from "wunderbaum";
    export type MatcherType = (node: WunderbaumNode) => boolean;
    export type BoolOptionResolver = (node: WunderbaumNode) => boolean;
    export const DEFAULT_DEBUGLEVEL = 4;
    export const ROW_HEIGHT = 22;
    export const ICON_WIDTH = 20;
    export const ROW_EXTRA_PAD = 7;
    export const RENDER_MIN_PREFETCH = 5;
    export const RENDER_MAX_PREFETCH = 5;
    export const TEST_IMG: RegExp;
    export type NodeAnyCallback = (node: WunderbaumNode) => any;
    export type NodeVisitResponse = "skip" | boolean | void;
    export type NodeVisitCallback = (node: WunderbaumNode) => NodeVisitResponse;
    export type WbTreeEventType = {
        type: string;
        event: Event;
        tree: Wunderbaum;
        [key: string]: unknown;
    };
    export type WbNodeEventType = WbTreeEventType & {
        node: WunderbaumNode;
    };
    export type WbTreeCallbackType = (e: WbTreeEventType) => any;
    export type WbNodeCallbackType = (e: WbNodeEventType) => any;
    export type FilterModeType = null | "dim" | "hide";
    export type ApplyCommandType = "moveUp" | "moveDown" | "indent" | "outdent" | "remove" | "rename" | "addChild" | "addSibling" | "cut" | "copy" | "paste" | "down" | "first" | "last" | "left" | "pageDown" | "pageUp" | "parent" | "right" | "up";
    export type NodeFilterResponse = "skip" | "branch" | boolean | void;
    export type NodeFilterCallback = (node: WunderbaumNode) => NodeFilterResponse;
    export type AddNodeType = "before" | "after" | "prependChild" | "appendChild";
    export type DndModeType = "before" | "after" | "over";
    /** Possible values for `setModified()`. */
    export enum ChangeType {
        /** Re-render the whole viewport, headers, and all rows. */
        any = "any",
        /** Update current row title, icon, columns, and status. */
        data = "data",
        /** Redraw the header and update the width of all row columns. */
        header = "header",
        /** Re-render the whole current row. */
        row = "row",
        /** Alias for 'any'. */
        structure = "structure",
        /** Update current row's classes, to reflect active, selected, ... */
        status = "status",
        /** Update the 'top' property of all rows. */
        vscroll = "vscroll"
    }
    /** Possible values for `setStatus()`. */
    export enum NodeStatusType {
        ok = "ok",
        loading = "loading",
        error = "error",
        noData = "noData"
    }
    /** Define the subregion of a node, where an event occurred. */
    export enum TargetType {
        unknown = "",
        checkbox = "checkbox",
        column = "column",
        expander = "expander",
        icon = "icon",
        prefix = "prefix",
        title = "title"
    }
    export let iconMap: {
        error: string;
        loading: string;
        noData: string;
        expanderExpanded: string;
        expanderCollapsed: string;
        expanderLazy: string;
        checkChecked: string;
        checkUnchecked: string;
        checkUnknown: string;
        radioChecked: string;
        radioUnchecked: string;
        radioUnknown: string;
        folder: string;
        folderOpen: string;
        doc: string;
    };
    export const KEY_NODATA = "__not_found__";
    /** Initial navigation mode and possible transition. */
    export enum NavigationModeOption {
        startRow = "startRow",
        cell = "cell",
        startCell = "startCell",
        row = "row"
    }
    /** Tree's current navigation mode (see `tree.setNavigationMode()`). */
    export enum NavigationMode {
        row = "row",
        cellNav = "cellNav",
        cellEdit = "cellEdit"
    }
    /** Define which keys are handled by embedded <input> control, and should
     * *not* be passed to tree navigation handler in cell-edit mode. */
    export const INPUT_KEYS: {
        text: string[];
        number: string[];
        checkbox: any[];
        link: any[];
        radiobutton: string[];
        "select-one": string[];
        "select-multiple": string[];
    };
    /** Key codes that trigger grid navigation, even when inside an input element. */
    export const NAVIGATE_IN_INPUT_KEYS: Set<string>;
    /** Possible values for `node.setActive()`. */
    export type SetActiveOptions = {
        /** Generate (de)activate event, even if node already has this status. */
        retrigger?: boolean;
        /** Do not generate (de)activate event. */
        noEvents?: boolean;
        /** Optional original event that will be passed to the (de)activate handler. */
        event?: Event;
        /** Call {@link setColumn}. */
        colIdx?: number;
    };
    /** Possible values for `node.setExpanded()`. */
    export type SetExpandedOptions = {
        /** Ignore {@link minExpandLevel}. @default false */
        force?: boolean;
        /** Avoid smooth scrolling. @default false */
        noAnimation?: boolean;
        /** Do not send events. @default false */
        noEvents?: boolean;
        /** Scroll to bring expanded nodes into viewport. @default false */
        scrollIntoView?: boolean;
    };
    /** Possible values for `node.setSelected()`. */
    export type SetSelectedOptions = {
        /** Ignore restrictions. @default false */
        force?: boolean;
        /** Do not send events. @default false */
        noEvents?: boolean;
    };
    /** Map `KeyEvent.key` to navigation action. */
    export const KEY_TO_ACTION_DICT: {
        [key: string]: string;
    };
    /** Return a callback that returns true if the node title contains a substring (case-insensitive). */
    export function makeNodeTitleMatcher(s: string): MatcherType;
    /** Return a callback that returns true if the node title starts with a string (case-insensitive). */
    export function makeNodeTitleStartMatcher(s: string): MatcherType;
}
declare module "debounce" {
    /*!
     * debounce & throttle, taken from https://github.com/lodash/lodash v4.17.21
     * MIT License: https://raw.githubusercontent.com/lodash/lodash/4.17.21-npm/LICENSE
     * Modified for TypeScript type annotations.
     */
    type Procedure = (...args: any[]) => any;
    type DebounceOptions = {
        leading?: boolean;
        maxWait?: number;
        trailing?: boolean;
    };
    type ThrottleOptions = {
        leading?: boolean;
        trailing?: boolean;
    };
    export interface DebouncedFunction<F extends Procedure> {
        (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F>;
        cancel: () => void;
        flush: () => any;
        pending: () => boolean;
    }
    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked, or until the next browser frame is drawn. The debounced function
     * comes with a `cancel` method to cancel delayed `func` invocations and a
     * `flush` method to immediately invoke them. Provide `options` to indicate
     * whether `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. The `func` is invoked with the last arguments provided to the
     * debounced function. Subsequent calls to the debounced function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
     * invocation will be deferred until the next frame is drawn (typically about
     * 16ms).
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `debounce` and `throttle`.
     *
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0]
     *  The number of milliseconds to delay; if omitted, `requestAnimationFrame` is
     *  used (if available).
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', debounce(calculateLayout, 150))
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }))
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * const debounced = debounce(batchLog, 250, { 'maxWait': 1000 })
     * const source = new EventSource('/stream')
     * jQuery(source).on('message', debounced)
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel)
     *
     * // Check for pending invocations.
     * const status = debounced.pending() ? "Pending..." : "Ready"
     */
    export function debounce<F extends Procedure>(func: F, wait?: number, options?: DebounceOptions): DebouncedFunction<F>;
    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds (or once per browser frame). The throttled function
     * comes with a `cancel` method to cancel delayed `func` invocations and a
     * `flush` method to immediately invoke them. Provide `options` to indicate
     * whether `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
     * invocation will be deferred until the next frame is drawn (typically about
     * 16ms).
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `throttle` and `debounce`.
     *
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0]
     *  The number of milliseconds to throttle invocations to; if omitted,
     *  `requestAnimationFrame` is used (if available).
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', throttle(updatePosition, 100))
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * const throttled = throttle(renewToken, 300000, { 'trailing': false })
     * jQuery(element).on('click', throttled)
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel)
     */
    export function throttle<F extends Procedure>(func: F, wait?: number, options?: ThrottleOptions): DebouncedFunction<F>;
}
declare module "wb_ext_filter" {
    import { NodeFilterCallback } from "common";
    import { Wunderbaum } from "wunderbaum";
    import { WunderbaumExtension } from "wb_extension_base";
    export class FilterExtension extends WunderbaumExtension {
        queryInput?: HTMLInputElement;
        lastFilterArgs: IArguments | null;
        constructor(tree: Wunderbaum);
        init(): void;
        setPluginOption(name: string, value: any): void;
        _applyFilterNoUpdate(filter: string | NodeFilterCallback, branchMode: boolean, _opts: any): void;
        _applyFilterImpl(filter: string | NodeFilterCallback, branchMode: boolean, _opts: any): number;
        /**
         * [ext-filter] Dim or hide nodes.
         *
         * @param {boolean} [opts={autoExpand: false, leavesOnly: false}]
         */
        filterNodes(filter: string | NodeFilterCallback, opts: any): void;
        /**
         * [ext-filter] Dim or hide whole branches.
         *
         * @param {boolean} [opts={autoExpand: false}]
         */
        filterBranches(filter: string | NodeFilterCallback, opts: any): void;
        /**
         * [ext-filter] Re-apply current filter.
         */
        updateFilter(): void;
        /**
         * [ext-filter] Reset the filter.
         */
        clearFilter(): void;
    }
}
declare module "wb_ext_keynav" {
    import { Wunderbaum } from "wunderbaum";
    import { WunderbaumExtension } from "wb_extension_base";
    export class KeynavExtension extends WunderbaumExtension {
        constructor(tree: Wunderbaum);
        protected _getEmbeddedInputElem(elem: any, setFocus?: boolean): HTMLInputElement | null;
        onKeyEvent(data: any): boolean | undefined;
    }
}
declare module "wb_ext_logger" {
    import { WunderbaumExtension } from "wb_extension_base";
    import { Wunderbaum } from "wunderbaum";
    export class LoggerExtension extends WunderbaumExtension {
        readonly prefix: string;
        protected ignoreEvents: Set<string>;
        constructor(tree: Wunderbaum);
        init(): void;
        onKeyEvent(data: any): boolean | undefined;
    }
}
declare module "drag_observer" {
    export type DragCallbackArgType = {
        /** "dragstart", "drag", or "dragstop". */
        type: string;
        /** Original mouse or touch event that triggered the drag event. */
        event: MouseEvent | TouchEvent;
        /** Element which is currently dragged. */
        dragElem: HTMLElement | null;
        /** Relative horizontal drag distance since start. */
        dx: number;
        /** Relative vertical drag distance since start. */
        dy: number;
        /** False if drag was canceled. */
        apply?: boolean;
    };
    export type DragCallbackType = (e: DragCallbackArgType) => boolean | void;
    type DragObserverOptionsType = {
        /**Event target (typically `window.document`). */
        root: EventTarget;
        /**Event delegation selector.*/
        selector?: string;
        /**Minimum drag distance in px. */
        thresh?: number;
        /**Return `false` to cancel drag. */
        dragstart: DragCallbackType;
        drag?: DragCallbackType;
        dragstop?: DragCallbackType;
    };
    /**
     * Convert mouse- and touch events to 'dragstart', 'drag', and 'dragstop'.
     */
    export class DragObserver {
        protected _handler: any;
        protected root: EventTarget;
        protected start: {
            x: number;
            y: number;
            altKey: boolean;
            ctrlKey: boolean;
            metaKey: boolean;
            shiftKey: boolean;
        };
        protected dragElem: HTMLElement | null;
        protected dragging: boolean;
        protected events: string[];
        protected opts: DragObserverOptionsType;
        constructor(opts: DragObserverOptionsType);
        /** Unregister all event listeners. */
        disconnect(): void;
        getDragElem(): HTMLElement | null;
        isDragging(): boolean;
        stopDrag(cb_event?: DragCallbackArgType): void;
        protected handleEvent(e: MouseEvent): boolean | void;
    }
}
declare module "wb_ext_grid" {
    /*!
     * Wunderbaum - ext-grid
     * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
     * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
     */
    import { Wunderbaum } from "wunderbaum";
    import { WunderbaumExtension } from "wb_extension_base";
    import { DragCallbackArgType, DragObserver } from "drag_observer";
    export class GridExtension extends WunderbaumExtension {
        protected observer: DragObserver;
        constructor(tree: Wunderbaum);
        init(): void;
        protected handleDrag(e: DragCallbackArgType): void;
    }
}
declare module "wb_ext_edit" {
    /*!
     * Wunderbaum - ext-edit
     * Copyright (c) 2021-2022, Martin Wendt. Released under the MIT license.
     * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
     */
    import { Wunderbaum } from "wunderbaum";
    import { WunderbaumExtension } from "wb_extension_base";
    import { WunderbaumNode } from "wb_node";
    import { AddNodeType } from "common";
    import { WbNodeData } from "wb_options";
    export class EditExtension extends WunderbaumExtension {
        protected debouncedOnChange: (e: Event) => void;
        protected curEditNode: WunderbaumNode | null;
        protected relatedNode: WunderbaumNode | null;
        constructor(tree: Wunderbaum);
        protected _applyChange(eventName: string, node: WunderbaumNode, colElem: HTMLElement, extra: any): Promise<any>;
        protected _onChange(e: Event): void;
        init(): void;
        _preprocessKeyEvent(data: any): boolean | undefined;
        /** Return true if a title is currently being edited. */
        isEditingTitle(node?: WunderbaumNode): boolean;
        /** Start renaming, i.e. replace the title with an embedded `<input>`. */
        startEditTitle(node?: WunderbaumNode | null): void;
        /**
         *
         * @param apply
         * @returns
         */
        stopEditTitle(apply: boolean): void;
        _stopEditTitle(apply: boolean, opts: any): void;
        /**
         * Create a new child or sibling node and start edit mode.
         */
        createNode(mode?: AddNodeType, node?: WunderbaumNode | null, init?: string | WbNodeData): void;
    }
}
declare module "wunderbaum" {
    /*!
     * wunderbaum.ts
     *
     * A treegrid control.
     *
     * Copyright (c) 2021-2022, Martin Wendt (https://wwWendt.de).
     * https://github.com/mar10/wunderbaum
     *
     * Released under the MIT license.
     * @version @VERSION
     * @date @DATE
     */
    import "./wunderbaum.scss";
    import * as util from "util";
    import { ExtensionsDict, WunderbaumExtension } from "wb_extension_base";
    import { NavigationMode, ChangeType, FilterModeType, MatcherType, NodeStatusType, TargetType as NodeRegion, ApplyCommandType, SetActiveOptions } from "common";
    import { WunderbaumNode } from "wb_node";
    import { WunderbaumOptions } from "wb_options";
    /**
     * A persistent plain object or array.
     *
     * See also [[WunderbaumOptions]].
     */
    export class Wunderbaum {
        protected static sequence: number;
        protected enabled: boolean;
        /** Wunderbaum release version number "MAJOR.MINOR.PATCH". */
        static version: string;
        /** The invisible root node, that holds all visible top level nodes. */
        readonly root: WunderbaumNode;
        /** Unique tree ID as passed to constructor. Defaults to `"wb_SEQUENCE"`. */
        readonly id: string;
        /** The `div` container element that was passed to the constructor. */
        readonly element: HTMLDivElement;
        /** The `div.wb-header` element if any. */
        readonly headerElement: HTMLDivElement | null;
        /** The `div.wb-scroll-container` element that contains the `nodeListElement`. */
        readonly scrollContainerElement: HTMLDivElement;
        /** The `div.wb-node-list` element that contains all visible div.wb-row child elements. */
        readonly nodeListElement: HTMLDivElement;
        protected readonly _updateViewportThrottled: (...args: any) => void;
        protected extensionList: WunderbaumExtension[];
        protected extensions: ExtensionsDict;
        /** Merged options from constructor args and tree- and extension defaults. */
        options: WunderbaumOptions;
        protected keyMap: Map<string, WunderbaumNode>;
        protected refKeyMap: Map<string, Set<WunderbaumNode>>;
        protected treeRowCount: number;
        protected _disableUpdateCount: number;
        /** Currently active node if any. */
        activeNode: WunderbaumNode | null;
        /** Current node hat has keyboard focus if any. */
        focusNode: WunderbaumNode | null;
        /** Shared properties, referenced by `node.type`. */
        types: {
            [key: string]: any;
        };
        /** List of column definitions. */
        columns: any[];
        protected _columnsById: {
            [key: string]: any;
        };
        protected resizeObserver: ResizeObserver;
        protected changeRedrawRequestPending: boolean;
        /** A Promise that is resolved when the tree was initialized (similar to `init(e)` event). */
        readonly ready: Promise<any>;
        /** Expose some useful methods of the util.ts module as `Wunderbaum.util`. */
        static util: typeof util;
        /** Expose some useful methods of the util.ts module as `tree._util`. */
        _util: typeof util;
        filterMode: FilterModeType;
        /** @internal Use `setColumn()`/`getActiveColElem()`*/
        activeColIdx: number;
        /** @internal */
        navMode: NavigationMode;
        /** @internal */
        lastQuicksearchTime: number;
        /** @internal */
        lastQuicksearchTerm: string;
        protected lastClickTime: number;
        constructor(options: WunderbaumOptions);
        /**
         * Return a Wunderbaum instance, from element, id, index, or event.
         *
         * ```js
         * getTree();         // Get first Wunderbaum instance on page
         * getTree(1);        // Get second Wunderbaum instance on page
         * getTree(event);    // Get tree for this mouse- or keyboard event
         * getTree("foo");    // Get tree for this `tree.options.id`
         * getTree("#tree");  // Get tree for this matching element
         * ```
         */
        static getTree(el?: Element | Event | number | string | WunderbaumNode): Wunderbaum | null;
        /**
         * Return a WunderbaumNode instance from element or event.
         */
        static getNode(el: Element | Event): WunderbaumNode | null;
        /** @internal */
        protected _registerExtension(extension: WunderbaumExtension): void;
        /** Called on tree (re)init after markup is created, before loading. */
        protected _initExtensions(): void;
        /** Add node to tree's bookkeeping data structures. */
        _registerNode(node: WunderbaumNode): void;
        /** Remove node from tree's bookkeeping data structures. */
        _unregisterNode(node: WunderbaumNode): void;
        /** Call all hook methods of all registered extensions.*/
        protected _callHook(hook: keyof WunderbaumExtension, data?: any): any;
        /**
         * Call tree method or extension method if defined.
         *
         * Example:
         * ```js
         * tree._callMethod("edit.startEdit", "arg1", "arg2")
         * ```
         */
        _callMethod(name: string, ...args: any[]): any;
        /**
         * Call event handler if defined in tree or tree.EXTENSION options.
         *
         * Example:
         * ```js
         * tree._callEvent("edit.beforeEdit", {foo: 42})
         * ```
         */
        _callEvent(type: string, extra?: any): any;
        /** Return the node for  given row index. */
        protected _getNodeByRowIdx(idx: number): WunderbaumNode | null;
        /** Return the topmost visible node in the viewport. */
        getTopmostVpNode(complete?: boolean): WunderbaumNode;
        /** Return the lowest visible node in the viewport. */
        getLowestVpNode(complete?: boolean): WunderbaumNode;
        /** Return preceeding visible node in the viewport. */
        protected _getPrevNodeInView(node?: WunderbaumNode, ofs?: number): WunderbaumNode;
        /** Return following visible node in the viewport. */
        protected _getNextNodeInView(node?: WunderbaumNode, ofs?: number): WunderbaumNode;
        /**
         * Append (or insert) a list of toplevel nodes.
         *
         * @see {@link WunderbaumNode.addChildren}
         */
        addChildren(nodeData: any, options?: any): WunderbaumNode;
        /**
         * Apply a modification (or navigation) operation on the **tree or active node**.
         */
        applyCommand(cmd: ApplyCommandType, opts?: any): any;
        /**
         * Apply a modification (or navigation) operation on a **node**.
         * @see {@link WunderbaumNode.applyCommand}
         */
        applyCommand(cmd: ApplyCommandType, node: WunderbaumNode, opts?: any): any;
        /** Delete all nodes. */
        clear(): void;
        /**
         * Clear nodes and markup and detach events and observers.
         *
         * This method may be useful to free up resources before re-creating a tree
         * on an existing div, for example in unittest suites.
         * Note that this Wunderbaum instance becomes unusable afterwards.
         */
        destroy(): void;
        /**
         * Return `tree.option.NAME` (also resolving if this is a callback).
         *
         * See also {@link WunderbaumNode.getOption|WunderbaumNode.getOption()}
         * to evaluate `node.NAME` setting and `tree.types[node.type].NAME`.
         *
         * @param name option name (use dot notation to access extension option, e.g.
         * `filter.mode`)
         */
        getOption(name: string, defaultValue?: any): any;
        /**
         *
         * @param name
         * @param value
         */
        setOption(name: string, value: any): void;
        /**Return true if the tree (or one of its nodes) has the input focus. */
        hasFocus(): boolean;
        /** Run code, but defer `updateViewport()` until done. */
        runWithoutUpdate(func: () => any, hint?: any): void;
        /** Recursively expand all expandable nodes (triggers lazy load id needed). */
        expandAll(flag?: boolean): Promise<void>;
        /** Recursively select all nodes. */
        selectAll(flag?: boolean): void;
        /** Return the number of nodes in the data model.*/
        count(visible?: boolean): number;
        /** @internal sanity check. */
        _check(): void;
        /**
         * Find all nodes that matches condition.
         *
         * @param match title string to search for, or a
         *     callback function that returns `true` if a node is matched.
         *
         * @see {@link WunderbaumNode.findAll}
         */
        findAll(match: string | MatcherType): WunderbaumNode[];
        /**
         * Find first node that matches condition.
         *
         * @param match title string to search for, or a
         *     callback function that returns `true` if a node is matched.
         * @see {@link WunderbaumNode.findFirst}
         *
         */
        findFirst(match: string | MatcherType): WunderbaumNode;
        /**
         * Find first node that matches condition.
         *
         * @param match title string to search for, or a
         *     callback function that returns `true` if a node is matched.
         * @see {@link WunderbaumNode.findFirst}
         *
         */
        findKey(key: string): WunderbaumNode | undefined;
        /**
         * Find the next visible node that starts with `match`, starting at `startNode`
         * and wrap-around at the end.
         */
        findNextNode(match: string | MatcherType, startNode?: WunderbaumNode | null): WunderbaumNode | null;
        /**
         * Find a node relative to another node.
         *
         * @param node
         * @param where 'down', 'first', 'last', 'left', 'parent', 'right', or 'up'.
         *   (Alternatively the keyCode that would normally trigger this move,
         *   e.g. `$.ui.keyCode.LEFT` = 'left'.
         * @param includeHidden Not yet implemented
         */
        findRelatedNode(node: WunderbaumNode, where: string, includeHidden?: boolean): any;
        /**
         * Return the active cell (`span.wb-col`) of the currently active node or null.
         */
        getActiveColElem(): HTMLSpanElement;
        /**
         * Return the currently active node or null.
         */
        getActiveNode(): WunderbaumNode;
        /**
         * Return the first top level node if any (not the invisible root node).
         */
        getFirstChild(): WunderbaumNode;
        /**
         * Return the currently active node or null.
         */
        getFocusNode(): WunderbaumNode;
        /** Return a {node: WunderbaumNode, region: TYPE} object for a mouse event.
         *
         * @param {Event} event Mouse event, e.g. click, ...
         * @returns {object} Return a {node: WunderbaumNode, region: TYPE} object
         *     TYPE: 'title' | 'prefix' | 'expander' | 'checkbox' | 'icon' | undefined
         */
        static getEventInfo(event: Event): {
            tree: Wunderbaum;
            node: WunderbaumNode;
            region: NodeRegion;
            colDef: any;
            colIdx: number;
            colId: any;
            colElem: HTMLSpanElement;
        };
        /**
         * Return readable string representation for this instance.
         * @internal
         */
        toString(): string;
        /** Return true if any node is currently in edit-title mode. */
        isEditing(): boolean;
        /**
         * Return true if any node is currently beeing loaded, i.e. a Ajax request is pending.
         */
        isLoading(): boolean;
        /** Alias for {@link Wunderbaum.logDebug}.
         * @alias Wunderbaum.logDebug
         */
        log: (...args: any[]) => void;
        /** Log to console if opts.debugLevel >= 4 */
        logDebug(...args: any[]): void;
        /** Log error to console. */
        logError(...args: any[]): void;
        /** Log to console if opts.debugLevel >= 3 */
        logInfo(...args: any[]): void;
        /** @internal */
        logTime(label: string): string;
        /** @internal */
        logTimeEnd(label: string): void;
        /** Log to console if opts.debugLevel >= 2 */
        logWarn(...args: any[]): void;
        /**
         * Make sure that this node is vertically scrolled into the viewport.
         *
         * @param {object} [options=null] {topNode: null, effects: ..., parent: ...}
         *     this node will remain visible in
         *     any case, even if `this` is outside the scroll pane.
         */
        scrollTo(opts: any): void;
        /**
         * Make sure that this node is horizontally scrolled into the viewport.
         *
         * Used for `fixedCol` mode.
         *
         * @param {boolean | PlainObject} [effects=false] animation options.
         * @param {object} [options=null] {topNode: null, effects: ..., parent: ...}
         *     this node will remain visible in
         *     any case, even if `this` is outside the scroll pane.
         */
        scrollToHorz(opts: any): void;
        /**
         * Set column #colIdx to 'active'.
         *
         * This higlights the column header and -cells by adding the `wb-active` class.
         * Available in cell-nav and cell-edit mode, not in row-mode.
         */
        setColumn(colIdx: number): void;
        /** Set or remove keybaord focus to the tree container. */
        setActiveNode(key: string, flag?: boolean, options?: SetActiveOptions): void;
        /** Set or remove keybaord focus to the tree container. */
        setFocus(flag?: boolean): void;
        /** Schedule an update request to reflect a tree change. */
        setModified(change: ChangeType, options?: any): void;
        /** Schedule an update request to reflect a single node modification. */
        setModified(change: ChangeType, node: WunderbaumNode, options?: any): void;
        /** Get the tree's navigation mode. */
        getNavigationMode(): NavigationMode;
        /** Set the tree's navigation mode. */
        setNavigationMode(mode: NavigationMode): void;
        /** Disable mouse and keyboard interaction (return prev. state). */
        setEnabled(flag?: boolean): boolean;
        /** Return false if tree is disabled. */
        isEnabled(): boolean;
        /** Return true if tree has one or more data columns in addition to the plain nodes. */
        isGrid(): boolean;
        /** Display tree status (ok, loading, error, noData) using styles and a dummy root node. */
        setStatus(status: NodeStatusType, message?: string, details?: string): WunderbaumNode | null;
        /** Add or redefine node type definitions. */
        setTypes(types: any, replace?: boolean): void;
        /** Update column headers and width. */
        updateColumns(opts?: any): void;
        /** Create/update header markup from `this.columns` definition.
         * @internal
         */
        protected _renderHeaderMarkup(): void;
        /** Render header and all rows that are visible in the viewport (async, throttled). */
        updateViewport(immediate?: boolean): void;
        /**
         * This is the actual update method, which is wrapped inside a throttle method.
         * This protected method should not be called directly but via
         * `tree.updateViewport()` or `tree.setModified()`.
         * It calls `updateColumns()` and `_updateRows()`.
         * @internal
         */
        protected _updateViewport(): void;
        protected _updateRows(opts?: any): boolean;
        /**
         * Call callback(node) for all nodes in hierarchical order (depth-first).
         *
         * @param {function} callback the callback function.
         *     Return false to stop iteration, return "skip" to skip this node and
         *     children only.
         * @returns {boolean} false, if the iterator was stopped.
         */
        visit(callback: (node: WunderbaumNode) => any): import("common").NodeVisitResponse;
        /**
         * Call fn(node) for all nodes in vertical order, top down (or bottom up).
         *
         * Note that this considers expansion state, i.e. children of collapsed nodes
         * are skipped.
         *
         * Stop iteration, if fn() returns false.<br>
         * Return false if iteration was stopped.
         *
         * @param callback the callback function.
         *     Return false to stop iteration, return "skip" to skip this node and children only.
         * @param [options]
         *     Defaults:
         *     {start: First tree node, reverse: false, includeSelf: true, includeHidden: false, wrap: false}
         * @returns {boolean} false if iteration was canceled
         */
        visitRows(callback: (node: WunderbaumNode) => any, opts?: any): boolean;
        /**
         * Call fn(node) for all nodes in vertical order, bottom up.
         * @internal
         */
        protected _visitRowsUp(callback: (node: WunderbaumNode) => any, opts: any): boolean;
        /**
         * Reload the tree with a new source.
         *
         * Previous data is cleared. Note that also column- and type defintions may
         * be passed with the `source` object.
         */
        load(source: any): Promise<void>;
        /**
         * Disable render requests during operations that would trigger many updates.
         *
         * ```js
         * try {
         *   tree.enableUpdate(false);
         *   // ... (long running operation that would trigger many updates)
         *   foo();
         *   // ... NOTE: make sure that async operations have finished, e.g.
         *   await foo();
         * } finally {
         *   tree.enableUpdate(true);
         * }
         * ```
         */
        enableUpdate(flag: boolean): void;
        /**
         * [ext-filter] Reset the filter.
         *
         * @requires [[FilterExtension]]
         */
        clearFilter(): void;
        /**
         * [ext-filter] Return true if a filter is currently applied.
         *
         * @requires [[FilterExtension]]
         */
        isFilterActive(): boolean;
        /**
         * [ext-filter] Re-apply current filter.
         *
         * @requires [[FilterExtension]]
         */
        updateFilter(): void;
    }
}
