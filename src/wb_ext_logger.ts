/*!
 * Wunderbaum - ext-logger
 * Copyright (c) 2021, Martin Wendt. Released under the MIT license.
 * @VERSION, @DATE (https://github.com/mar10/wunderbaum)
 */

import { WunderbaumExtension } from "./common";
import { eventToString } from "./util";
import { Wunderbaum } from "./wunderbaum";

export class LoggerExtension extends WunderbaumExtension {
  constructor(tree: Wunderbaum) {
    super(tree, "logger", {});
  }

  onKeyEvent(data: any): boolean | undefined {
    this.tree.log("onKeyEvent", eventToString(data.event), data);
    return;
  }
}
