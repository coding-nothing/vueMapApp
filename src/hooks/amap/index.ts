
import { AMap } from '@/plugins/AMap'
import { HANGZHOU_POINT } from '../../config/mapConfig'
/**
 *高德地图AMap基础服务
 *
 * @class AMapMap
 */
class AMapMap {
  map: any
  eventListener: Map<string, Array<Function>>
  markers: any
  markerLnglats: Array<Lnglat>
  /**
   * Creates an instance of AMapMap.
   * @param {string} container: 挂载地图canvas的DOM id
   * @memberof AMapMap
   */
  constructor(container:string) {
    this.markerLnglats = []
    this.map = new AMap.Map(container, {
      viewMode: '2D',
      resizeEnable: true,
      center: HANGZHOU_POINT, // 指定地图中心点
      zoom: 12 // 指定地图缩放级别
    })
    this.eventListener = new Map()
  }
  // 私有禁止
  #dispatchMapListener(event:string, ...args: any[]) {
    if (this.eventListener.has(event)) {
      const listeners = [...(this.eventListener.get(event)as Array<Function>)]
      listeners.forEach(listener => {
        listener(...args)
      })
    }
  }
  /**
   *初始化地图事件订阅
   *
   * @param {string} event 订阅的事件
   * @param {Function} callback 事件回调
   * @memberof AMapMap
   */
  initMapListener(event:string, callback:Function) {
    if (!this.eventListener.get(event)) {
      this.eventListener.set(event, [callback])
    } else {
      this.eventListener.get(event)?.push(callback)
    }
    this.map.on(event, (...args: any) => {
      this.#dispatchMapListener(event, ...args)
    })
  }
  /**
   *移除事件订阅
   *
   * @param {string} event 订阅的事件
   * @param {Function} callback 事件回调
   * @memberof AMapMap
   */
  removeMapListener(event:string, callback:Function) {
    if (this.eventListener.get(event)?.length ?? 0) {
      let listeners = this.eventListener.get(event) as Array<Function>;
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        this.eventListener.get(event)?.splice(index, 1)
        this.map.off(event, callback)
      }
    }
  }
  /**
   *创建标记
   *
   * @param {Lnglat} lnglat 标记点经纬度
   * @memberof AMapMap
   */
  setMarker(lnglat: Lnglat) {
    const marker = new AMap.Marker({
      position: lnglat,
    })
    this.markers.push(marker)

    const markerLnglat = new AMap.LngLat(...lnglat)
    this.markerLnglats.push(markerLnglat)

    this.map.add(marker)
  }

  /**
   *移除上个标记
   *
   * @memberof AMapMap
   */
  removeMarker() {
    this.map.remove(this.markers.shift())
    this.markerLnglats.shift()

  }
}

export default AMapMap