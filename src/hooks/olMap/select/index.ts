import Select from 'ol/interaction/Select.js';
import { SelectEvent } from 'ol/interaction/Select.js';
import { pointerMove } from "ol/events/condition";
/**
 *创建交互：指定图层上的Features的pointerMove
 *
 * @class SelectInteraction
 */
class SelectInteraction {
    selection: Select

    constructor(layers:any) {
        this.selection = new Select({
            layers,
            condition: pointerMove,
            style: null
        })
    }
    /**
     *注册回调
     *
     * @param {Function} callback
     * @memberof SelectInteraction
     */
    initInteraction(callback: Function) {
        this.selection.on('select', (event:SelectEvent) => {
            callback(event)
        })
    }
}

export default SelectInteraction