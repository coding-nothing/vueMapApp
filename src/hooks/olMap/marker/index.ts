import Feature from 'ol/Feature';
import { Point } from "ol/geom";
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
/**
 *创建标记点图层
 *提供图层内标记点管理功能
 * @class MarkerLayer
 */
class MarkerLayer {
    layer: VectorLayer<VectorSource>
    #markers: Array<Feature>
    constructor() {
        this.layer = new VectorLayer({
            source: new VectorSource(),
        });
        this.#markers = []
    }
    /**
     *以默认icon添加标记点到图层
     *
     * @param {Lnglat} coordinate 标记点经纬度
     * @memberof MarkerLayer
     */
    addMarker(coordinate: Lnglat) {
        const marker = new Feature({
            geometry: new Point(coordinate)
        })
        // 设置标记要素的样式
        marker.setStyle(new Style({
            image: new Icon({
                src: '/public/images/marker.svg'
            })
        }));
        this.#markers.push(marker)
        this.layer.getSource()?.clear();
        this.layer.getSource()?.addFeature(marker)
    }
}

export default MarkerLayer