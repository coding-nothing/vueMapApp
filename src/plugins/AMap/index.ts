import AMapLoader from '@amap/amap-jsapi-loader'

window._AMapSecurityConfig = {
    // 设置安全密钥
    securityJsCode: "ff895f5ced5bbdea8e28d2eb174ae997"
}

let AMap = await AMapLoader.load({
    key: 'ef7e1c07b9f63e42bef9600e2e5eafe2',
    version: '2.0',
    plugins: ['AMap.Driving', 'AMap.DragRoute', 'AMap.Geocoder']
});

export { AMap }