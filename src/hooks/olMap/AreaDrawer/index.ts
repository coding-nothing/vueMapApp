import { EventTypes } from "ol/Observable";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Draw, Snap } from "ol/interaction";
import { Type as GeoType } from "ol/geom/Geometry";
/**
 * 多边形绘制
 * @class AreaDrawer
 */
class AreaDrawer {
  eventListener: Map<string, Array<Function>>;
  draw: Draw;
  snap: Snap;

  constructor(layer: VectorLayer<any>, type: GeoType = "Polygon") {
    const source = layer.getSource() as VectorSource;
    this.draw = new Draw({
      source: source,
      type: type,
    });
    this.snap = new Snap({ source: source });
    this.eventListener = new Map();
  }
  /**
   *初始化绘制事件订阅
   *
   * @param {string} event
   * @param {Function} callback
   * @memberof AreaDrawer
   */
  initDrawListener(event: string, callback: Function) {
    if (!this.eventListener.get(event)) {
      this.eventListener.set(event, [callback]);
    } else {
      this.eventListener.get(event)?.push(callback);
    }
    this.draw.on(event as any as EventTypes, (...args: any) => {
      this.#dispatchDrawListener(event, ...args);
    });
  }
  /**
   *移除事件订阅
   *
   * @param {string} event
   * @param {Function} callback
   * @memberof AreaDrawer
   */
  removeDrawListener(event: string, callback: Function) {
    if (this.eventListener.get(event)?.length ?? 0) {
      let listeners = this.eventListener.get(event) as Array<Function>;
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        this.eventListener.get(event)?.splice(index, 1);
      }
    }
  }

  #dispatchDrawListener(event: string, ...args: any[]) {
    if (this.eventListener.has(event)) {
      const listeners = [...(this.eventListener.get(event) as Array<Function>)];
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
}

export default AreaDrawer;
