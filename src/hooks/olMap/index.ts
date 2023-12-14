
import { Map as OlMap, Overlay, View } from 'ol';
import { EPSG4326, MAP_DEFAULT_OPTIONS } from '@/config/mapConfig'
import Select from 'ol/interaction/Select';
import { transform, transformExtent } from 'ol/proj';
import GeoLayer from '@/hooks/olMap/geoLayer'
import BaseLayer from 'ol/layer/Base';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { EventTypes } from 'ol/Observable';
/**
 *openLayers地图服务 使用GeoJson创建
 *默认添加标记点图层
 * @class OLMap
 */
class OLMap {
    map: OlMap
    geoLayerMng: GeoLayer
    eventListener: Map<string, Array<Function>>

    constructor(elementRef: HTMLElement, isOnlineMap: Boolean = true) {
        this.geoLayerMng = new GeoLayer()
        this.eventListener = new Map()
        this.map = new OlMap({
            target: elementRef,
            layers: [],
        });
        this.#setupMap(isOnlineMap)
    }
    // 使用在线地图：OSM
    #setupOnlineMap() {
        this.map.addLayer(
            new TileLayer({
                source: new OSM()
            })
        )
        this.map.setView(
            new View({
                center: MAP_DEFAULT_OPTIONS.center,
                constrainResolution: true,
                zoom: 14,
                projection: EPSG4326
            })
        )
    }
    // 加载离线地图
    #setupOfflineMap() {
        const { center, zoom, minZoom, maxZoom, extent } = MAP_DEFAULT_OPTIONS;
        // 根据地图源限制地图放缩
        this.map.setView(
            new View({
                center: center,
                zoom,
                minZoom,
                maxZoom,
                constrainResolution: true,
                extent: transformExtent(extent, EPSG4326, this.map.getView().getProjection())
            })
        )
        this.geoLayerMng.createBaseGeoLayer(this.map)
        this.geoLayerMng.createProvinceGeoLayer(this.map)
    }
    #setupMap(isOnlineMap: Boolean) {
        if (isOnlineMap) {
            this.#setupOnlineMap()
        } else {
            this.#setupOfflineMap()
        }
    }
    // 私有禁止
    #dispatchMapListener(event: string, ...args: any[]) {
        if (this.eventListener.has(event)) {
            const listeners = [...(this.eventListener.get(event) as Array<Function>)]
            listeners.forEach(listener => {
                listener(...args)
            })
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
            this.eventListener.set(event, [callback])
        } else {
            this.eventListener.get(event)?.push(callback)
        }
        this.map.on((event as any as EventTypes), (...args: any) => {
            this.#dispatchMapListener(event, ...args)
        })
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
                this.eventListener.get(event)?.splice(index, 1)
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
        this.map.addLayer(layer)
    }
    /**
     *添加交互
     *
     * @param {Select} interaction
     * @memberof OLMap
     */
    addInter(interaction: Select) {
        this.map.addInteraction(interaction)
    }
    /**
     *添加元素到地图上
     *
     * @param {HTMLElement} element
     * @memberof OLMap
     */
    addOverlay(element: HTMLElement, coordinate: Lnglat) {
        const overlay = new Overlay({
            element
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
        const curProj = this.map.getView().getProjection()
        return transform(coordinate, curProj, targetProj)
    }
}

export default OLMap