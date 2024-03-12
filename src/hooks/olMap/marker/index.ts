// import { EPSG4326 } from "@/config/mapConfig";
import Feature from "ol/Feature";
import { Coordinate } from "ol/coordinate";
// import { GeoJSON } from "ol/format";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import { Cluster } from "ol/source";
import CircleStyle from "ol/style/Circle";
/**
 *创建标记点图层
 *提供图层内标记点管理功能
 * @class MarkerLayer
 */
class MarkerLayer {
  layer: VectorLayer<any> | undefined;
  #markers: Array<Feature>;
  constructor(layerID: string = "vectorLayer") {
    this.layer = new VectorLayer({
      source: new VectorSource(),
      properties: {
        layerID,
      },
    });
    this.#markers = [];
  }
  /**
   *生成feature样式 显示聚合数量
   *
   * @param {Feature} feature
   * @return {*}
   * @memberof MarkerLayer
   */
  getStyle() {
    return new Style({
      image: new Icon({
        src: "/public/images/marker.svg",
      }),
    });
  }
  setImage(imgUrl: string) {
    return new Style({
      image: new Icon({
        src: imgUrl,
      }),
    });
  }
  /**
   *根据坐标批量生成feature
   *
   * @param {Array<Coordinate>} coordList 84坐标数组
   * @return {*}
   * @memberof MarkerLayer
   */
  getFeatures(coordList: Array<Coordinate>) {
    const featureList = coordList.map((e) => {
      const feature = new Feature(new Point(e));
      feature.setStyle(this.getStyle());
      return feature;
    });
    return featureList;
  }
  /**
   *添加标记点到图层
   *附带默认样式与icon
   *每次添加标记都清空图层上所有source
   * @param {Lnglat} coordinate 标记点经纬度 4326
   * @param {string} imgUrl 标记点icon资源绝对路径
   * @memberof MarkerLayer
   */
  addMarker(coordinate: Lnglat, markerID: string, imgUrl: string = "") {
    const marker = new Feature({ geometry: new Point(coordinate), markerID });
    // 设置标记要素的样式
    marker.setStyle(imgUrl ? this.setImage(imgUrl) : this.getStyle());
    this.#markers.push(marker);
    this.layer?.getSource()?.clear();
    this.layer?.getSource()?.addFeature(marker);
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
    const featureList = this.getFeatures(coordList);
    this.#markers = [...featureList];
    this.layer?.getSource()?.clear();
    this.layer = new VectorLayer({
      properties: {
        layerID: "clusterLayer",
      },
      source: new Cluster({
        source: new VectorSource({
          features: featureList,
        }),
      }),
      style: (feature) => {
        return new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: "#fff",
            }),
            fill: new Fill({
              color: "#3399CC",
            }),
          }),
          text: new Text({
            text: feature.get("features").length.toString(),
            fill: new Fill({
              color: "white",
            }),
          }),
        });
      },
    });
  }
}

export default MarkerLayer;
