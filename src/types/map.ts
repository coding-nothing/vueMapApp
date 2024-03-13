type Lnglat = [number, number];
type MarkerInfo = {
  lnglat: Lnglat;
  addressDscb: string;
};
type MarkerData = {
  id: string;
  type: string;
  name: string;
  imgUrl: {
    normal: string;
    sel: string;
  };
};
