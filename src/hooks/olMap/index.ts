import { Feature, Map as OlMap, Overlay, View } from "ol";
import { EPSG4326, MAP_DEFAULT_OPTIONS } from "@/config/mapConfig";
import Select from "ol/interaction/Select";
import { transform, transformExtent } from "ol/proj";
import GeoLayer from "@/hooks/olMap/geoLayer";
import BaseLayer from "ol/layer/Base";
import { XYZ } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { EventTypes } from "ol/Observable";
import { Group } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

// import { DragAndDrop, defaults as defaultInteractions } from "ol/interaction";
// import { GeoJSON } from "ol/format";
import VectorImageLayer from "ol/layer/VectorImage";
/**
 *openLayers地图服务 使用GeoJson创建
 *默认添加标记点图层
 * @class OLMap
 */
class OLMap {
  map: OlMap;
  geoLayerMng: GeoLayer;
  eventListener: Map<string, Array<Function>>;

  constructor(elementRef: HTMLElement, isOnlineMap: Boolean = true) {
    this.geoLayerMng = new GeoLayer();
    this.eventListener = new Map();
    // const dragAndDropInteraction = new DragAndDrop({
    //   formatConstructors: [GeoJSON],
    // });
    this.map = new OlMap({
      // interactions: defaultInteractions().extend([dragAndDropInteraction]),
      target: elementRef,
      layers: [],
    });
    // dragAndDropInteraction.on("addfeatures", (event) => {
    //   console.log("drag feature");
    //   const vectorSource = new VectorSource({
    //     features: event.features as Feature[],
    //   });
    //   this.map.addLayer(
    //     new VectorImageLayer({
    //       source: vectorSource,
    //     })
    //   );
    //   this.map.getView().fit(vectorSource.getExtent());
    // });
    this.#setupMap(isOnlineMap);
  }
  // 使用高德在线瓦片
  #setupOnlineMap() {
    const amapLayer = new TileLayer({
      visible: true,
      source: new XYZ({
        url: "https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
      }),
    });
    this.map.addLayer(
      new Group({
        layers: [amapLayer],
      })
    );
    this.map.setView(
      new View({
        center: MAP_DEFAULT_OPTIONS.center,
        constrainResolution: true,
        maxZoom: 18,
        minZoom: 3,
        projection: EPSG4326,
      })
    );
  }
  // 加载离线地图
  #setupOfflineMap() {
    this.map.setView(
      new View({
        center: MAP_DEFAULT_OPTIONS.center,
        constrainResolution: true,
        maxZoom: 18,
        minZoom: 3,
        // zoomFactor: 1.0,
        zoom: 11,
        projection: EPSG4326,
      })
    );
    this.map.addLayer(
      new TileLayer({
        source: new XYZ({
          tileUrlFunction: (coordinate) =>
            "http://192.168.1.175:3000/" +
            coordinate[0] +
            "/" +
            coordinate[1] +
            "/" +
            coordinate[2] +
            ".png",
        }),
      })
    );
  }
  #setGeoJsonMap() {
    this.geoLayerMng.createBaseGeoLayer(this.map);
    this.geoLayerMng.createProvinceGeoLayer(this.map);
  }
  #setupMap(isOnlineMap: Boolean) {
    if (isOnlineMap) {
      this.#setupOnlineMap();
    } else {
      this.#setupOfflineMap();
    }
  }
  setBorderView() {
    this.#setGeoJsonMap();
  }
  // 私有禁止
  #dispatchMapListener(event: string, ...args: any[]) {
    if (this.eventListener.has(event)) {
      const listeners = [...(this.eventListener.get(event) as Array<Function>)];
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
  /**
   *初始化地图事件订阅
   *
   * @param {string} event
   * @param {Function} callback
   * @memberof OLMap
   */
  initMapListener(event: string, callback: Function) {
    if (!this.eventListener.get(event)) {
      this.eventListener.set(event, [callback]);
    } else {
      this.eventListener.get(event)?.push(callback);
    }
    this.map.on(event as any as EventTypes, (...args: any) => {
      this.#dispatchMapListener(event, ...args);
    });
  }
  /**
   *移除事件订阅
   *
   * @param {string} event
   * @param {Function} callback
   * @memberof OLMap
   */
  removeMapListener(event: string, callback: Function) {
    if (this.eventListener.get(event)?.length ?? 0) {
      let listeners = this.eventListener.get(event) as Array<Function>;
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        this.eventListener.get(event)?.splice(index, 1);
      }
    }
  }
  /**
   *添加图层
   *
   * @param {BaseLayer} layer
   * @memberof OLMap
   */
  addLayer(layer: BaseLayer) {
    this.map.addLayer(layer);
  }
  /**
   *移除图层
   *
   * @param {BaseLayer} layer
   * @memberof OLMap
   */
  removeLayer(layer: BaseLayer) {
    this.map.removeLayer(layer);
  }
  /**
   *添加交互
   *
   * @param {Select} interaction
   * @memberof OLMap
   */
  addInter(interaction: Select) {
    this.map.addInteraction(interaction);
  }
  /**
   *添加元素到地图上
   *
   * @param {HTMLElement} element
   * @memberof OLMap
   */
  addOverlay(element: HTMLElement, coordinate: Lnglat) {
    const overlay = new Overlay({
      element,
    });

    overlay.setPosition(coordinate);

    this.map.addOverlay(overlay);
  }
  /**
   *设置地图上鼠标光标样式
   *
   * @param {string} type
   * @memberof OLMap
   */
  setPointer(type: string) {
    this.map.getTargetElement().style.cursor = type;
  }
  tranfromCoordinate(coordinate: any, targetProj: string) {
    const curProj = this.map.getView().getProjection();
    return transform(coordinate, curProj, targetProj);
  }
}

export default OLMap;
