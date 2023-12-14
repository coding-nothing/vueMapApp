
import { AMap } from '@/plugins/AMap'

/**
 *驾驶路线服务
 *
 * @class Driving
 */
class Driving {
  driving:any
  /**
   * Creates an instance of Driving.
   * @param {*} map AMap.map 实例
   * @memberof Driving
   */
  constructor(map:any) {
    this.driving = new AMap.Driving({
      map: map,
      policy: AMap.DrivingPolicy.LEAST_TIME,
      showTraffic: true,
      province: '浙'
    });
  }

  setRoute(lnglats:Array<Lnglat>) {
    // 根据起终点经纬度规划驾车导航路线
    this.driving.search(...lnglats, function (status: string, result: string) {
      if (status === 'complete') {
          console.log('绘制驾车路线完成')
          // ElMessage('绘制驾车路线完成')
      } else {
          console.log('获取驾车数据失败：' + result)
          // ElMessage('获取驾车数据失败：' + result)
      }
      })
  }
}

export default Driving