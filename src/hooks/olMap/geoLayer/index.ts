import { Group, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON.js";
import { Style, Text, Fill, Stroke } from "ol/style";
import { Map as OlMap } from "ol";
import { ALL_EXTENT } from "@/data/province";
import { transformExtent } from "ol/proj";
import { EPSG4326 } from "@/config/mapConfig";
import { intersects } from "ol/extent";

const createLayerStyle = (feature: any) => {
  // const text = new Text({
  //     text: feature.get("name_zh") || feature.get("name"),
  //     fill: new Fill({ color: "black" }),
  //     stroke: new Stroke({ color: "white", width: 1 }),
  // });

  const stroke = new Stroke({
    color: feature.get("name") === "China" ? "transparent" : "red",
    width: 2,
  });

  return [
    new Style({
      // text,
      stroke,
    }),
  ];
};

const CreateLayer = (url: string) => {
  const layer = new VectorLayer({
    source: new VectorSource({
      url,
      format: new GeoJSON(),
    }),
  });

  layer.setStyle(createLayerStyle);

  return layer;
};

enum LayerIndex {
  Zero = 0,
  First = 5,
  Second = 6,
}

interface LayerMapItem {
  name: string;
  layer: VectorLayer<any>;
}

class GeoLayer {
  layerCacheMap: Record<LayerIndex, Record<string, LayerMapItem>>;

  constructor() {
    this.layerCacheMap = {
      [LayerIndex.Zero]: {},
      [LayerIndex.First]: {},
      [LayerIndex.Second]: {},
    };
  }

  #initGeoViewListener(map: OlMap) {
    map.getView().on("change", (event) => {
      const zoom = event.target.getZoom(); // 获取新的缩放级别
      const mapView = event.target;
      // 用地图的DOM宽高计算当前视图对应的地理经纬度范围
      const currentExtent = mapView.calculateExtent(map.getSize());
      // 稳妥起见 再次转换为EPSG4326
      const transformedExtent = transformExtent(
        currentExtent,
        mapView.getProjection(),
        EPSG4326
      );

      for (const _index in this.layerCacheMap) {
        const index = parseInt(_index, 10) as LayerIndex;
        if (index <= LayerIndex.First) continue;

        if (zoom > index) {
          for (const key in ALL_EXTENT) {
            const extent = ALL_EXTENT[key];
            // 加载视图所在的省份贴图
            const isCityInView = intersects(extent, transformedExtent);
            const layerCache = this.layerCacheMap[index][key];
            if (!layerCache || !layerCache.layer) continue;

            const layer = layerCache.layer;
            if (isCityInView) {
              if (!layer.getVisible()) layer.setVisible(true);
            } else {
              // 切走的省份贴图不展示
              layer.setVisible(false);
            }
          }
        } else {
          // 缩小后关闭省份贴图
          for (const key in ALL_EXTENT) {
            const layerCache = this.layerCacheMap[index][key];
            if (layerCache && layerCache.layer)
              layerCache.layer.setVisible(false);
          }
        }
      }
    });
  }

  #addLayerCache(type: LayerIndex, name: string, layer: VectorLayer<any>) {
    if (type < LayerIndex.Second) {
      layer.setVisible(false);
    }

    if (!this.layerCacheMap[type]) {
      this.layerCacheMap[type] = {};
    }

    if (!this.layerCacheMap[type][name]) {
      this.layerCacheMap[type][name] = {
        name,
        layer,
      };
    }
  }

  createBaseGeoLayer(map: OlMap) {
    const asiaLayer = CreateLayer("/geojson/asia.json");
    const chinaLayer = CreateLayer("/geojson/china.json");
    const japanLayer = CreateLayer("/geojson/japan.json");
    this.#addLayerCache(LayerIndex.Zero, "asia", asiaLayer);
    this.#addLayerCache(LayerIndex.First, "china", chinaLayer);
    this.#addLayerCache(LayerIndex.Second, "japan", japanLayer);

    map.addLayer(
      new Group({
        layers: [asiaLayer, chinaLayer, japanLayer],
      })
    );
  }

  createProvinceGeoLayer(map: OlMap) {
    for (const key in ALL_EXTENT) {
      const layer = new VectorLayer({
        source: new VectorSource({
          url: `/geojson/china/${key}.json`,
          format: new GeoJSON(),
        }),
        renderBuffer: 100,
      });
      // 缓存
      this.#addLayerCache(LayerIndex.Second, key, layer);

      layer.setStyle(createLayerStyle);

      if (!map.getLayers().getArray().includes(layer)) {
        map.addLayer(layer);
      }
    }
    this.#initGeoViewListener(map);
  }
}

export default GeoLayer;
