import { Collection, Feature, Map as OlMap } from "ol";
import { platformModifierKeyOnly } from "ol/events/condition";
import { getWidth } from "ol/extent";
import { Geometry } from "ol/geom";
import { DragBox, Select } from "ol/interaction.js";
import { Vector as VectorLayer } from "ol/layer";
import { Cluster } from "ol/source";
import { Fill, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";

/**
 *提供框选功能
 *
 * @class SelectBox
 */
class SelectBox {
  select: Select;
  dragBox: DragBox;
  dragFeatureList: Collection<Feature<Geometry>>;
  constructor(map: OlMap) {
    this.select = new Select();
    this.dragBox = new DragBox({
      condition: platformModifierKeyOnly,
    });
    map.addInteraction(this.select);
    map.addInteraction(this.dragBox);
    this.dragFeatureList = this.select.getFeatures();
    this.dragBox.on("boxend", () => {
      const boxExtent = this.dragBox.getGeometry().getExtent();

      // if the extent crosses the antimeridian process each world separately
      const worldExtent = map.getView().getProjection().getExtent();
      const worldWidth = getWidth(worldExtent);
      const startWorld = Math.floor(
        (boxExtent[0] - worldExtent[0]) / worldWidth
      );
      const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth);

      for (let world = startWorld; world <= endWorld; ++world) {
        const left = Math.max(
          boxExtent[0] - world * worldWidth,
          worldExtent[0]
        );
        const right = Math.min(
          boxExtent[2] - world * worldWidth,
          worldExtent[2]
        );
        const extent = [left, boxExtent[1], right, boxExtent[3]];
        const targetLayerList = (map.getLayers()?.getArray() ?? []).filter(
          (layer: any) => {
            return layer.get("layerID") !== "tileLayer";
          }
        ) as VectorLayer<any>[];

        let boxFeatures = [] as Feature[];
        targetLayerList.forEach((targetLayer) => {
          boxFeatures = boxFeatures.concat(
            targetLayer
              ?.getSource()
              ?.getFeaturesInExtent(extent)
              .filter(
                (feature: Feature) =>
                  !this.dragFeatureList.getArray().includes(feature) &&
                  feature?.getGeometry()?.intersectsExtent(extent)
              )
          );
        });

        // features that intersect the box geometry are added to the
        // collection of selected features

        // if the view is not obliquely rotated the box geometry and
        // its extent are equalivalent so intersecting features can
        // be added directly to the collection
        const rotation = map.getView().getRotation();
        const oblique = rotation % (Math.PI / 2) !== 0;

        // when the view is obliquely rotated the box extent will
        // exceed its geometry so both the box and the candidate
        // feature geometries are rotated around a common anchor
        // to confirm that, with the box geometry aligned with its
        // extent, the geometries intersect
        if (oblique) {
          const anchor = [0, 0];
          const geometry = this.dragBox.getGeometry().clone();
          geometry.translate(-world * worldWidth, 0);
          geometry.rotate(-rotation, anchor);
          const extent = geometry.getExtent();
          boxFeatures.forEach((feature: Feature) => {
            const geometry = feature?.getGeometry()?.clone();
            geometry?.rotate(-rotation, anchor);
            if (geometry?.intersectsExtent(extent) ?? false) {
              this.dragFeatureList.push(feature);
            }
          });
        } else {
          this.dragFeatureList.extend(boxFeatures);
        }
        console.log(`选点${this.dragFeatureList.getLength()}个：`);
        this.dragFeatureList.getArray().forEach((feature: Feature) => {
          console.log(feature.get("name"));
        });
      }
    });
  }
}

export default SelectBox;
