import { AMap } from '@/plugins/AMap'
import { Coordinate } from 'ol/coordinate';
/**
 *地理编解码服务
 *
 * @class Geocoder
 */
class Geocoder {
    geocoder:any
    constructor() {
        this.geocoder = new AMap.Geocoder({
            radius: 1000,
            extension: 'all'
        });
    }
    async getAddress(lnglat4326: Lnglat|Coordinate) {
        return new Promise((resolve, reject) => {
          this.geocoder.getAddress(lnglat4326, (status:string, result:any) => {
            if (status === 'complete' && result.info === 'OK') {
              resolve(result.regeocode.formattedAddress);
            } else {
              reject(new Error('获取地址失败'));
            }
          });
        });
      }
}

export default Geocoder