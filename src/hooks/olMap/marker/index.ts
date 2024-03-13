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
import { MarkerIconMap } from "@/data/marker.ts";
/**
 *创建标记点图层
 *提供图层内标记点管理功能
 * @class MarkerLayer
 */
class MarkerLayer {
  layer: VectorLayer<any> | undefined;
  markerList: Array<Feature>;
  constructor(layerID: string = "vectorLayer") {
    this.layer = new VectorLayer({
      source: new VectorSource(),
      properties: {
        layerID,
      },
    });
    this.markerList = [];
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
   * @param {Coordinate} coordinate
   * @param {MarkerData} markerData
   * @memberof MarkerLayer
   */
  addMarker(coordinate: Coordinate, markerData: MarkerData) {
    const marker = new Feature({
      geometry: new Point(coordinate),
      ...markerData,
    });
    // 设置标记要素的样式
    marker.setStyle(
      markerData.imgUrl.normal
        ? this.setImage(markerData.imgUrl.normal)
        : this.getStyle()
    );
    this.markerList.push(marker);
    this.layer?.getSource()?.addFeature(marker);
  }
  /**
   *更改标记点的位置icon和ID
   *
   * @param {Lnglat} coordinate 标记点新坐标
   * @param {string} markerID 标记点新ID
   * @param {string} [imgUrl=""] 标记点新icon
   * @memberof MarkerLayer
   */
  changeMarker(
    coordinate: Lnglat,
    markerID: string,
    imgUrl: string = "/public/vite.svg"
  ) {
    const marker = new Feature({ geometry: new Point(coordinate), markerID });
    // 设置标记要素的样式
    marker.setStyle(imgUrl ? this.setImage(imgUrl) : this.getStyle());
    this.markerList = [marker];
    this.layer?.getSource()?.clear();
    this.layer?.getSource()?.addFeature(marker);
  }
  /**
   *切换marker状态
   *
   * @param {Feature} feature
   * @memberof MarkerLayer
   */
  toggleMarkerIcon(feature: Feature) {
    const featureIconMap = MarkerIconMap[feature.get("type")];
    const iconUrl = feature.get("selected")
      ? featureIconMap.sel
      : featureIconMap.normal;
    feature.setStyle(
      new Style({
        image: new Icon({
          src: iconUrl,
        }),
      })
    );
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
    this.markerList = [...featureList];
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
