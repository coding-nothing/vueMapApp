import { Collection } from "ol";
import {
  Interaction,
  Translate,
  defaults as defaultInteractions,
} from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
/**
 *提供框选功能
 *
 * @class drag
 */
class drag {
  dragCollection: Collection<Interaction>;
  constructor(layers: VectorLayer<VectorSource>[]) {
    const translate = new Translate({
      layers: layers,
    });
    this.dragCollection = defaultInteractions().extend([translate]);
  }
}

export default drag;
