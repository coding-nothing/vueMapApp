import { EPSG4326 } from "@/config/mapConfig";
import Feature from "ol/Feature";
import { Coordinate } from "ol/coordinate";
import { GeoJSON } from "ol/format";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Icon } from "ol/style";
/**
 *创建标记点图层
 *提供图层内标记点管理功能
 * @class MarkerLayer
 */
class MarkerLayer {
  layer: VectorLayer<VectorSource>;
  #markers: Array<Feature>;
  constructor() {
    this.layer = new VectorLayer({
      source: new VectorSource(),
    });
    this.#markers = [];
  }
  /**
   *添加标记点到图层
   *附带默认样式与icon
   *每次添加标记都清空图层上所有source
   * @param {Lnglat} coordinate 标记点经纬度 4326
   * @memberof MarkerLayer
   */
  addMarker(coordinate: Lnglat) {
    const marker = new Feature({
      geometry: new Point(coordinate),
    });
    // 设置标记要素的样式
    marker.setStyle(
      new Style({
        image: new Icon({
          src: "/public/images/marker.svg",
        }),
      })
    );
    this.#markers.push(marker);
    this.layer.getSource()?.clear();
    this.layer.getSource()?.addFeature(marker);
  }
  /**
   *批量添加多个点位
   *附带默认样式与icon
   *每次添加标记都清空图层上所有source
   *
   * @param {Array<Coordinate>} coordList 4326坐标数组
   * @memberof MarkerLayer
   */
  batchAddMarker(coordList: Array<Coordinate>) {
    const featureList = coordList.map((e) => {
      const feature = new Feature({
        geometry: new Point(e),
        custom: {
          id: Math.ceil(Math.random() * 100000),
        },
        fromLayerID: "addFeaturesLayer",
      });
      feature.setStyle(
        new Style({
          image: new Icon({
            src: "/public/images/marker.svg",
          }),
        })
      );
      return feature;
    });
    this.#markers = [...featureList];
    this.layer.getSource()?.clear();
    this.layer.getSource()?.addFeatures(featureList);
  }
  /**
   *批量添加多个点位
   *附带默认样式与icon
   *每次添加标记都清空图层上所有source
   *
   * @param {GeoJSON} geoJson geojson格式的点位列表
   * @memberof MarkerLayer
   */
  batchAddGeoJsonMarkr(geoJson: GeoJSON) {
    const featureList = new GeoJSON().readFeatures(geoJson, {
      featureProjection: EPSG4326,
    }) as Array<Feature>;
    this.#markers = [...featureList];
    this.layer.getSource()?.clear();
    this.layer.getSource()?.addFeatures(featureList);
  }
}

export default MarkerLayer;
