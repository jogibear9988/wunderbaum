/*!
 * wunderbaum.ts
 *
 * A tree control.
 *
 * Copyright (c) 2021, Martin Wendt (https://wwWendt.de).
 * Released under the MIT license.
 *
 * @version @VERSION
 * @date @DATE
 */

import "./wunderbaum.scss";
import * as util from "./util";
import { WunderbaumNode } from "./wb_node";
// import { PersistoOptions } from "./wb_options";
import {
  ChangeType,
  default_debuglevel,
  NavigationMode,
  RENDER_PREFETCH,
  ROW_HEIGHT,
  TargetType,
  WunderbaumExtension,
  WunderbaumOptions,
} from "./common";
import { KeynavExtension } from "./wb_ext_keynav";
import { LoggerExtension } from "./wb_ext_logger";
import { extend } from "./util";

// const class_prefix = "wb-";
// const node_props: string[] = ["title", "key", "refKey"];

/**
 * A persistent plain object or array.
 *
 * See also [[WunderbaumOptions]].
 */
export class Wunderbaum {
  static version: string = "@VERSION"; // Set to semver by 'grunt release'
  static sequence = 0;

  /** The invisible root node, that holds all visible top level nodes. */
  readonly root: WunderbaumNode;
  readonly name: string;

  readonly element: HTMLElement;
  readonly treeElement: HTMLElement;
  readonly headerElement: HTMLElement;
  readonly nodeListElement: HTMLElement;
  readonly scrollContainer: HTMLElement;

  protected extensions: WunderbaumExtension[] = [];
  protected keyMap = new Map<string, WunderbaumNode>();
  protected refKeyMap = new Map<string, Set<WunderbaumNode>>();
  protected viewNodes = new Set<WunderbaumNode>();
  // protected rows: WunderbaumNode[] = [];
  // protected _rowCount = 0;
  activeNode: WunderbaumNode | null = null;
  activeColIdx = 0;
  focusNode: WunderbaumNode | null = null;
  cellNavMode = false;
  options: WunderbaumOptions;
  enableFilter = false;
  _enableUpdate = true;
  /** Shared properties, referenced by `node.type`. */
  types: any = {};
  /** List of column definitions. */
  columns: any[] = [];

  // ready: Promise<any>;

  constructor(options: WunderbaumOptions) {
    let opts = (this.options = util.extend(
      {
        source: null, // URL for GET/PUT, ajax options, or callback
        element: null,
        debugLevel: default_debuglevel, // 0:quiet, 1:normal, 2:verbose
        columns: null,
        types: null,
        navigationMode: NavigationMode.allow,
        // Events
        change: util.noop,
        error: util.noop,
        receive: util.noop,
      },
      options
    ));

    this.name = opts.name || "wb_" + ++Wunderbaum.sequence;
    this.root = new WunderbaumNode(this, <WunderbaumNode>(<unknown>null), {
      key: "__root__",
      name: "__root__",
    });

    this._registerExtension(new KeynavExtension(this));
    this._registerExtension(new LoggerExtension(this));

    // --- Evaluate options
    this.columns = opts.columns || [];
    delete opts.columns;
    this.types = opts.types || {};
    delete opts.types;

    if (opts.navigationMode === NavigationMode.force || opts.navigationMode === NavigationMode.start) {
      this.cellNavMode = true;
    }

    // --- Create Markup
    if (typeof opts.element === "string") {
      this.element = <HTMLElement>document.querySelector(opts.element);
    } else {
      this.element = opts.element;
    }
    this.treeElement = <HTMLElement>(
      this.element.querySelector("div.wunderbaum")
    );
    this.headerElement = <HTMLElement>(
      this.treeElement.querySelector("div.wb-header")
    );
    this.scrollContainer = <HTMLElement>(
      this.treeElement.querySelector("div.wb-scroll-container")
    );
    this.nodeListElement = <HTMLElement>(
      this.scrollContainer.querySelector("div.wb-node-list")
    );
    if (!this.nodeListElement) {
      alert("TODO: create markup");
    }
    (<any>this.treeElement)._wb_tree = this;

    // --- Load initial data
    if (opts.source) {
      this.nodeListElement.innerHTML =
        "<progress class='spinner'>loading...</progress>";
      this.load(opts.source).finally(() => {
        this.element.querySelector("progress.spinner")!.remove();
      });
    }
    // --- Bind listeners
    this.scrollContainer.addEventListener("scroll", (e: Event) => {
      this.updateViewport();
    });
    window.addEventListener("resize", (e: Event) => {
      this.updateViewport();
    });
    util.onEvent(this.nodeListElement, "click", "div.wb-row", (e) => {
      let info = this.getEventTarget(e),
        node = info.node;

      if (node) {
        node.setActive();
        if (info.type === TargetType.expander) {
          node.setExpanded(!node.isExpanded());
        } else if (info.type === TargetType.checkbox) {
          node.setSelected(!node.isSelected());
        }
      }
      // if(e.target.classList.)
      this.log("click", info);
    });
    // util.onEvent(
    //   this.treeElement,
    //   "mousemove",
    //   "div.wb-header span.wb-col",
    //   (e) => {
    //     // this.log("mouse", e.target);
    //   }
    // );
    util.onEvent(this.treeElement, "keydown", null, (e) => {
      this._callHook("onKeyEvent", { tree: this, event: e });
    });
  }

  /** */
  public static getTree(idxOrIdOrSelector?: any): Wunderbaum | null {
    idxOrIdOrSelector = idxOrIdOrSelector || ".wunderbaum";
    let elem = document.querySelector(idxOrIdOrSelector);
    return <Wunderbaum>(<any>elem!)._wb_tree;
  }

  /** */
  public static getNode(obj: any): WunderbaumNode | null {
    if (obj instanceof Event) {
      obj = obj.target;
    }
    if (obj instanceof Element) {
      let nodeElem = obj.closest("div.wb-row");
      if (nodeElem) {
        return <WunderbaumNode>(<any>nodeElem!)._wb_node;
      }
    }
    return null;
  }

  /** */
  protected _registerExtension(extension: WunderbaumExtension): void {
    this.extensions.push(extension);
  }

  /** Add node to tree's bookkeeping data structures. */
  _registerNode(node: WunderbaumNode): void {
    let key = node.key;
    util.assert(key != null && !this.keyMap.has(key));
    this.keyMap.set(key, node);
    let rk = node.refKey;
    if (rk) {
      let rks = this.refKeyMap.get(rk);  // Set of nodes with this refKey
      if (rks) {
        rks.add(node);
      } else {
        this.refKeyMap.set(rk, new Set());
      }
    }
  }

  /** Remove node from tree's bookkeeping data structures. */
  _unregisterNode(node: WunderbaumNode): void {
    const rk = node.refKey;
    if (rk) {
      const rks = this.refKeyMap.get(rk);
      if (rks && rks.delete(node) && !rks.size) {
        // We just removed the last element
        this.refKeyMap.delete(rk);
      }
    }
    // mark as disposed
    (node.tree as any) = null;
    (node.parent as any) = null;
  }

  /** Call all hook methods of all registered extensions.*/
  protected _callHook(hook: keyof WunderbaumExtension, data: any = {}): any {
    let res;
    let d = util.extend(
      {},
      { tree: this, options: this.options, result: undefined },
      data
    );

    for (let ext of this.extensions) {
      res = (<any>ext[hook]).call(ext, d);
      if (res === false) {
        break;
      }
      if (d.result !== undefined) {
        res = d.result;
      }
    }
    return res;
  }

  /** Call event if defined in options. */
  _trigger(event: string, extra?: any): any {
    let cb = this.options[event];
    if (!cb) { return; }
    let data = extend({}, { event: event, tree: this, options: this.options }, extra);
    let res = cb.call(this, data);
    return res;
  }

  /** Return the topmost visible node in the viewport */
  protected _firstNodeInView(complete = true) {
    let topIdx: number, node: WunderbaumNode;
    if (complete) {
      topIdx = Math.ceil(this.scrollContainer.scrollTop / ROW_HEIGHT);
    } else {
      topIdx = Math.floor(this.scrollContainer.scrollTop / ROW_HEIGHT);
    }
    // TODO: start searching from active node (reverse)
    this.visitRows((n) => {
      if (n._rowIdx === topIdx) {
        node = n;
        return false;
      }
    });
    return <WunderbaumNode>node!;
  }

  /** Return the lowest visible node in the viewport */
  protected _lastNodeInView(complete = true) {
    let bottomIdx: number, node: WunderbaumNode;
    if (complete) {
      bottomIdx =
        Math.floor(
          (this.scrollContainer.scrollTop + this.scrollContainer.clientHeight) /
          ROW_HEIGHT
        ) - 1;
    } else {
      bottomIdx =
        Math.ceil(
          (this.scrollContainer.scrollTop + this.scrollContainer.clientHeight) /
          ROW_HEIGHT
        ) - 1;
    }
    // TODO: start searching from active node
    this.visitRows((n) => {
      if (n._rowIdx === bottomIdx) {
        node = n;
        return false;
      }
    });
    return <WunderbaumNode>node!;
  }

  /** Return preceeding visible node in the viewport */
  protected _getPrevNodeInView(node?: WunderbaumNode, ofs = 1) {
    this.visitRows(
      (n) => {
        node = n;
        if (ofs-- <= 0) {
          return false;
        }
      },
      { reverse: true, start: node || this.getActiveNode() }
    );
    return node;
  }

  /** Return following visible node in the viewport */
  protected _getNextNodeInView(node?: WunderbaumNode, ofs = 1) {
    this.visitRows(
      (n) => {
        node = n;
        if (ofs-- <= 0) {
          return false;
        }
      },
      { reverse: false, start: node || this.getActiveNode() }
    );
    return node;
  }

  /** */
  expandAll(flag: boolean = true) {
    let tag = this.logTime("expandAll(" + flag + ")");
    let prev = this.enableUpdate(false);
    let res = this.root.expandAll(flag);
    this.enableUpdate(prev);
    this.logTimeEnd(tag);
    return res;
  }

  /** */
  count(visible = false) {
    if (visible) { return this.viewNodes.size; }
    return this.keyMap.size;
  }

  /** */
  _check() {
    let i = 0;
    this.visit((n) => { i++; });
    if(this.keyMap.size !== i) {this.logError(`_check failed: ${this.keyMap.size} !== ${i}`)}
    // util.assert(this.keyMap.size === i);
  }

  /** Find a node relative to another node.
   *
   * @param node
   * @param where 'down', 'first', 'last', 'left', 'parent', 'right', or 'up'.
   *   (Alternatively the keyCode that would normally trigger this move,
   *   e.g. `$.ui.keyCode.LEFT` = 'left'.
   * @param includeHidden Not yet implemented
   */
  findRelatedNode(node: WunderbaumNode, where: string, includeHidden = false) {
    let res = null;
    let pageSize = Math.floor(this.scrollContainer.clientHeight / ROW_HEIGHT);

    switch (where) {
      case "parent":
        if (node.parent && node.parent.parent) {
          res = node.parent;
        }
        break;
      case "first":
        // First visible node
        this.visit(function (n) {
          if (n.isVisible()) {
            res = n;
            return false;
          }
        });
        break;
      case "last":
        this.visit(function (n) {
          // last visible node
          if (n.isVisible()) {
            res = n;
          }
        });
        break;
      case "left":
        if (node.parent && node.parent.parent) {
          res = node.parent;
        }
        // if (node.expanded) {
        //   node.setExpanded(false);
        // } else if (node.parent && node.parent.parent) {
        //   res = node.parent;
        // }
        break;
      case "right":
        if (node.children && node.children.length) {
          res = node.children[0];
        }
        // if (this.cellNavMode) {
        //   throw new Error("Not implemented");
        // } else {
        //   if (!node.expanded && (node.children || node.lazy)) {
        //     node.setExpanded();
        //     res = node;
        //   } else if (node.children && node.children.length) {
        //     res = node.children[0];
        //   }
        // }
        break;
      case "up":
        res = this._getPrevNodeInView(node);
        break;
      case "down":
        res = this._getNextNodeInView(node);
        break;
      case "pageDown":
        let bottomNode = this._lastNodeInView();
        this.logDebug(where, this.focusNode, bottomNode);

        if (this.focusNode !== bottomNode) {
          res = bottomNode;
        } else {
          res = this._getNextNodeInView(node, pageSize);
        }
        break;
      case "pageUp":
        if (this.focusNode && this.focusNode._rowIdx === 0) {
          res = this.focusNode;
        } else {
          let topNode = this._firstNodeInView();
          if (this.focusNode !== topNode) {
            res = topNode;
          } else {
            res = this._getPrevNodeInView(node, pageSize);
          }
        }
        break;
      default:
        this.logWarning("Unknown relation '" + where + "'.");
    }
    return res;
  }

  /**
   * Return the currently active node or null.
   */
  getActiveNode() {
    return this.activeNode;
  }

  /** Return the first top level node if any (not the invisible root node).
   * @returns {FancytreeNode | null}
   */
  getFirstChild() {
    return this.root.getFirstChild();
  }

  /**
   * Return the currently active node or null.
   */
  getFocusNode() {
    return this.focusNode;
  }

  /** Return a {node: FancytreeNode, type: TYPE} object for a mouse event.
   *
   * @param {Event} event Mouse event, e.g. click, ...
   * @returns {object} Return a {node: FancytreeNode, type: TYPE} object
   *     TYPE: 'title' | 'prefix' | 'expander' | 'checkbox' | 'icon' | undefined
   */
  getEventTarget(event: Event) {
    let target = <Element>event.target,
      cl = target.classList,
      node = Wunderbaum.getNode(event.target),
      res = { node: node, type: TargetType.unknown, column: undefined };

    if (cl.contains("wb-title")) {
      res.type = TargetType.title;
    } else if (cl.contains("wb-expander")) {
      res.type =
        node!.hasChildren() === false ? TargetType.prefix : TargetType.expander;
    } else if (cl.contains("wb-checkbox")) {
      res.type = TargetType.checkbox;
    } else if (cl.contains("wb-icon") || cl.contains("wb-custom-icon")) {
      res.type = TargetType.icon;
    } else if (cl.contains("wb-node")) {
      res.type = TargetType.title;
    } else if (cl.contains("wb-col")) {
      res.type = TargetType.column;
      let idx = Array.prototype.indexOf.call(
        target.parentNode!.children,
        target
      );
      res.column = node?.tree.columns[idx];
      // Somewhere near the title
      // } else if (event && event.target) {
      //   $target = $(event.target);
      //   if ($target.is("ul[role=group]")) {
      //     // #nnn: Clicking right to a node may hit the surrounding UL
      //     tree = res.node && res.node.tree;
      //     (tree || FT).debug("Ignoring click on outer UL.");
      //     res.node = null;
      //   } else if ($target.closest(".wb-title").length) {
      //     // #228: clicking an embedded element inside a title
      //     res.type = "title";
      //   } else if ($target.closest(".wb-checkbox").length) {
      //     // E.g. <svg> inside checkbox span
      //     res.type = "checkbox";
      //   } else if ($target.closest(".wb-expander").length) {
      //     res.type = "expander";
      //   }
    }
    return res;
  }
  /** Return a string describing the affected node region for a mouse event.
   *
   * @param {Event} event Mouse event, e.g. click, mousemove, ...
   * @returns {string} 'title' | 'prefix' | 'expander' | 'checkbox' | 'icon' | undefined
   */
  getEventTargetType(event: Event) {
    return this.getEventTarget(event).type;
  }

  /**
   * Return readable string representation for this instance.
   * @internal
   */
  toString() {
    return "Wunderbaum<'" + this.name + "'>";
  }

  /* Log to console if opts.debugLevel >= 1 */
  log(...args: any[]) {
    if (this.options.debugLevel >= 1) {
      Array.prototype.unshift.call(args, this.toString());
      console.log.apply(console, args);
    }
  }

  /** Log to console if opts.debugLevel >= 4 */
  logDebug(...args: any[]) {
    if (this.options.debugLevel >= 4) {
      Array.prototype.unshift.call(args, this.toString());
      console.log.apply(console, args);
    }
  }

  /** Log error to console. */
  logError(...args: any[]) {
    Array.prototype.unshift.call(args, this.toString());
    console.error.apply(console, args);
  }

  /** @internal */
  logTime(label: string): string {
    if (this.options.debugLevel >= 1) {
      console.time(label);
    }
    return label;
  }

  /** @internal */
  logTimeEnd(label: string): void {
    if (this.options.debugLevel >= 1) {
      console.timeEnd(label);
    }
  }

  /** Log to console if opts.debugLevel >= 4 */
  logWarning(...args: any[]) {
    if (this.options.debugLevel >= 1) {
      Array.prototype.unshift.call(args, this.toString());
      console.warn.apply(console, args);
    }
  }

  /** */
  render(opts: any): boolean {
    let label = this.logTime("render");
    let idx = 0;
    let top = 0;
    let height = ROW_HEIGHT;
    let modified = false;
    let start = opts.startIdx;
    let end = opts.endIdx;
    let obsoleteViewNodes = this.viewNodes;

    this.viewNodes = new Set();
    let viewNodes = this.viewNodes;
    // this.debug("render", opts);
    util.assert(start != null && end != null);
    // this.root.children![1].expanded = true;

    this.visitRows(function (node) {
      let prevIdx = node._rowIdx;

      viewNodes.add(node);
      obsoleteViewNodes.delete(node);
      if (prevIdx !== idx) {
        node._rowIdx = idx;
        modified = true;
      }
      if (idx < start || idx > end) {
        node.removeMarkup();
      } else {
        // if (!node._rowElem || prevIdx != idx) {
        node.render({ top: top });
      }
      idx++;
      top += height;
    });
    for (let prevNode of obsoleteViewNodes) {
      prevNode.removeMarkup();
    }
    // Resize tree container
    this.nodeListElement.style.height = "" + top + "px";
    this.logTimeEnd(label);
    return modified;
  }

  renderHeader() {
    let headerRow = this.headerElement.querySelector(".wb-row");

    if (!headerRow) {
      util.assert(false);
    }
    for (let i = 0; i < this.columns.length; i++) {
      let col = this.columns[i];
      let colElem = <HTMLElement>headerRow!.children[i];
      colElem.style.left = col._ofsPx + "px";
      colElem.style.width = col._widthPx + "px";
      colElem.textContent = col.title || col.id;
    }
  }

  /**
   *
   * @param {boolean | PlainObject} [effects=false] animation options.
   * @param {object} [options=null] {topNode: null, effects: ..., parent: ...}
   *     this node will remain visible in
   *     any case, even if `this` is outside the scroll pane.
   * Make sure that a node is scrolled into the viewport.
   */
  scrollTo(opts: any) {
    const MARGIN = 1;
    const node = opts.node || this.getActiveNode();
    util.assert(node._rowIdx != null);
    const curTop = this.scrollContainer.scrollTop;
    const height = this.scrollContainer.clientHeight;
    const nodeOfs = node._rowIdx * ROW_HEIGHT;
    let newTop;

    if (nodeOfs > curTop) {
      if (nodeOfs + ROW_HEIGHT < curTop + height) {
        // Already in view
      } else {
        // Node is below viewport
        newTop = nodeOfs - height + ROW_HEIGHT - MARGIN;
      }
    } else if (nodeOfs < curTop) {
      // Node is above viewport
      newTop = nodeOfs + MARGIN;
    }
    this.log("scrollTo(" + nodeOfs + "): " + curTop + " => " + newTop, height);
    if (newTop != null) {
      this.scrollContainer.scrollTop = newTop;
      this.updateViewport();
    }
  }

  /** */
  setCellMode(flag = true) {
    flag = !!flag;
    // util.assert(this.cellNavMode);
    // util.assert(0 <= colIdx && colIdx < this.columns.length);
    if (flag === this.cellNavMode) { return; }
    // if( flag ) {
    // }else{
    // }
    // this.activeColIdx = 0;
    this.cellNavMode = flag;
    if( flag){
      this.setColumn(0)
    }
    this.treeElement.classList.toggle("wb-cell-mode", flag);
    this.setModified(this.activeNode, ChangeType.row);
  }

  /** */
  setColumn(colIdx: number) {
    util.assert(this.cellNavMode);
    util.assert(0 <= colIdx && colIdx < this.columns.length);
    this.activeColIdx = colIdx;
    // node.setActive(true, { column: tree.activeColIdx + 1 });
    this.setModified(this.activeNode, ChangeType.row);
    // Update `wb-active` class for all headers
    for (const rowDiv of this.headerElement.children) {
      let i = 0;
      for (const colDiv of rowDiv.children) {
        (<HTMLElement>colDiv).classList.toggle("wb-active", i++ === colIdx);
      }
    }
    // Update `wb-active` class for all cell divs
    for (const rowDiv of this.nodeListElement.children) {
      let i = 0;
      for (const colDiv of rowDiv.children) {
        (<HTMLElement>colDiv).classList.toggle("wb-active", i++ === colIdx);
      }
    }
  }

  /** */
  setModified(node: WunderbaumNode | null, change: ChangeType) { }

  /** Update column headers and width. */
  updateColumns(opts: any) {
    let modified = false;
    let minWidth = 4;
    let vpWidth = this.treeElement.clientWidth;
    let totalWeight = 0;
    let fixedWidth = 0;

    // Gather width requests
    for (let col of this.columns) {
      let cw = col.width;

      if (!cw || cw === "*") {
        col._weight = 1.0;
        totalWeight += 1.0;
      } else if (typeof cw === "number") {
        col._weight = cw;
        totalWeight += cw;
      } else if (typeof cw === "string" && cw.endsWith("px")) {
        col._weight = 0;
        let px = parseFloat(cw.slice(0, -2));
        if (col._widthPx != px) {
          modified = true;
          col._widthPx = px;
        }
        fixedWidth += px;
      } else {
        util.error("Invalid column width: " + cw);
      }
    }
    // Share remaining space between non-fixed columns
    let restPx = Math.max(0, vpWidth - fixedWidth);
    let ofsPx = 0;

    for (let col of this.columns) {
      if (col._weight) {
        let px = Math.max(minWidth, (restPx * col._weight) / totalWeight);
        if (col._widthPx != px) {
          modified = true;
          col._widthPx = px;
        }
      }
      col._ofsPx = ofsPx;
      ofsPx += col._widthPx;
    }
    // Every column has now a calculated `_ofsPx` and `_widthPx`
    if (modified) {
      this.renderHeader();
      if (opts.render !== false) {
        this.render({});
      }
    }
  }

  /** Render all rows that are visible in the viewport. */
  updateViewport() {
    let height = this.scrollContainer.clientHeight;
    let wantHeight =
      this.treeElement.clientHeight - this.headerElement.clientHeight;
    let ofs = this.scrollContainer.scrollTop;

    if (Math.abs(height - wantHeight) > 1.0) {
      this.log("resize", height, wantHeight);
      this.scrollContainer.style.height = wantHeight + "px";
    }

    this.updateColumns({ render: false });
    this.render({
      startIdx: Math.max(0, ofs / ROW_HEIGHT - RENDER_PREFETCH),
      endIdx: Math.max(0, (ofs + height) / ROW_HEIGHT + RENDER_PREFETCH),
    });
    this._trigger("update");
  }

  /** Call callback(node) for all nodes in hierarchical order (depth-first).
   *
   * @param {function} callback the callback function.
   *     Return false to stop iteration, return "skip" to skip this node and children only.
   * @returns {boolean} false, if the iterator was stopped.
   */
  visit(callback: (node: WunderbaumNode) => any) {
    return this.root.visit(callback, false);
  }

  /** Call fn(node) for all nodes in vertical order, top down (or bottom up).<br>
   * Stop iteration, if fn() returns false.<br>
   * Return false if iteration was stopped.
   *
   * @param callback the callback function.
   *     Return false to stop iteration, return "skip" to skip this node and children only.
   * @param [options]
   *     Defaults:
   *     {start: First tree node, reverse: false, includeSelf: true, includeHidden: false, wrap: false}
   * @returns {boolean} false if iteration was cancelled
   */
  visitRows(callback: (node: WunderbaumNode) => any, opts?: any): boolean {
    if (!this.root.hasChildren()) {
      return false;
    }
    if (opts && opts.reverse) {
      delete opts.reverse;
      return this._visitRowsUp(callback, opts);
    }
    opts = opts || {};
    let i,
      nextIdx,
      parent,
      res,
      siblings,
      stopNode: WunderbaumNode,
      siblingOfs = 0,
      skipFirstNode = opts.includeSelf === false,
      includeHidden = !!opts.includeHidden,
      checkFilter = !includeHidden && this.enableFilter,
      node: WunderbaumNode = opts.start || this.root.children![0];

    parent = node.parent;
    while (parent) {
      // visit siblings
      siblings = parent.children!;
      nextIdx = siblings.indexOf(node) + siblingOfs;
      util.assert(
        nextIdx >= 0,
        "Could not find " + node + " in parent's children: " + parent
      );

      for (i = nextIdx; i < siblings.length; i++) {
        node = siblings[i];
        if (node === stopNode!) {
          return false;
        }
        if (checkFilter && !node.match && !node.subMatchCount) {
          continue;
        }
        if (!skipFirstNode && callback(node) === false) {
          return false;
        }
        skipFirstNode = false;
        // Dive into node's child nodes
        if (
          node.children &&
          node.children.length &&
          (includeHidden || node.expanded)
        ) {
          res = node.visit(function (n: WunderbaumNode) {
            if (n === stopNode) {
              return false;
            }
            if (checkFilter && !n.match && !n.subMatchCount) {
              return "skip";
            }
            if (callback(n) === false) {
              return false;
            }
            if (!includeHidden && n.children && !n.expanded) {
              return "skip";
            }
          }, false);
          if (res === false) {
            return false;
          }
        }
      }
      // Visit parent nodes (bottom up)
      node = parent;
      parent = parent.parent;
      siblingOfs = 1; //

      if (!parent && opts.wrap) {
        this.log("visitRows(): wrap around");
        util.assert(opts.start, "`wrap` option requires `start`");
        stopNode = opts.start;
        opts.wrap = false;
        parent = this.root;
        siblingOfs = 0;
      }
    }
    return true;
  }

  /** Call fn(node) for all nodes in vertical order, bottom up.
   * @internal
   */
  protected _visitRowsUp(
    callback: (node: WunderbaumNode) => any,
    opts: any
  ): boolean {
    let children,
      idx,
      parent,
      includeHidden = !!opts.includeHidden,
      node = opts.start || this.root.children![0];

    if (opts.includeSelf !== false) {
      if (callback(node) === false) {
        return false;
      }
    }
    while (true) {
      parent = node.parent;
      children = parent.children;

      if (children[0] === node) {
        // If this is already the first sibling, goto parent
        node = parent;
        if (!node.parent) {
          break; // first node of the tree
        }
        children = parent.children;
      } else {
        // Otherwise, goto prev. sibling
        idx = children.indexOf(node);
        node = children[idx - 1];
        // If the prev. sibling has children, follow down to last descendant
        while (
          (includeHidden || node.expanded) &&
          node.children &&
          node.children.length
        ) {
          children = node.children;
          parent = node;
          node = children[children.length - 1];
        }
      }
      // Skip invisible
      if (!includeHidden && !node.isVisible()) {
        continue;
      }
      if (callback(node) === false) {
        return false;
      }
    }
    return true;
  }

  /** . */
  load(source: any) {
    return this.root.load(source);
  }

  /**
   *
   */
  public enableUpdate(flag: boolean): boolean {
    flag = flag !== false;
    if (!!this._enableUpdate === !!flag) {
      return flag;
    }
    this._enableUpdate = flag;
    if (flag) {
      this.logDebug("enableUpdate(true): redraw "); //, this._dirtyRoots);
      // this._callHook("treeStructureChanged", this, "enableUpdate");
      this.updateViewport();
    } else {
      // 	this._dirtyRoots = null;
      this.logDebug("enableUpdate(false)...");
    }
    return !flag; // return previous value
  }
}
