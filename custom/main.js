
// get here your access token: https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/ and substitute in the code:
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZTg5ZDVlYy1iMjMyLTQ1MzMtYThjYi1lNTExMzM2MGJjYTgiLCJpZCI6MTM3NTYxLCJpYXQiOjE2ODM3MTk1MTJ9.F_ycgxy9PPYlCbmFCHdn4f4BcHXFjh2Nn1qGpcaEZwg";
var Weather = {};
Weather.main = {
  symbols: [],
  count: 0,
  init: function () {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      baseLayerPicker: false,
      animation: false,
      fullscreenButton: false,
      homeButton: false,
      infoBox: false,
      timeline: false,
      scene3DOnly: true
    });
    this.addSymbols();
    this.planFly(this.count);
  },
  fly: function (position, duration, height, fileDownload) {
    var _this = this;
    this.viewer.camera.flyTo({
      duration: duration,
      destination: Cesium.Cartesian3.fromDegrees(position[0], position[1] - (fileDownload ? 5 : 3), height),
      orientation: {
        heading: 0,
        pitch: -Cesium.Math.PI_OVER_THREE,
        roll: 0.0
      },
      complete: function () {
        _this.count++;
        _this.planFly(_this.count);
        if (fileDownload) {
          _this.addDataFromFile(fileDownload);
        }
      }
    });
  },
  fly2: function (position, duration, height, fileDownload) {
    var _this = this;
    this.viewer.camera.flyTo({
      duration: duration,
      destination: Cesium.Cartesian3.fromDegrees(position[0], position[1] - 5, height),
      orientation: {
        heading: 0,
        pitch: -0.5,
        roll: 0.0
      },
      complete: function () {
        _this.count++;
        _this.planFly(_this.count);
        if (fileDownload) {
          _this.addDataFromFile(fileDownload);
        }
      }
    });
  },
  planFly: function (count) {
    var _this = this;
    if (count === 0) {
      this.fly([12, 39], 6, 1000000, 'dataI');
    } else if (count === 1) {
      setTimeout(function () {
        _this.fly([9.3, 43.5], 4, 1000000, null);
      }, 1000);
    } else if (count === 2) {
      this.fly([2, 44], 4, 1000000, 'dataFR');
    } else if (count === 3) {
      setTimeout(function () {
        _this.fly([2, 46], 2, 1000000, null);
      }, 1000);
    } else if (count === 4) {
      this.fly2([-3, 52], 4, 300000, 'dataUK');
    }
  },
  addLabel: function (val, position, sym) {
    if (sym) {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1]),
        billboard: this.symbols[sym]
      });
    } else {
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(position[0], position[1]),
        billboard: {
          image: 'custom/img/icon-temperature.png',
          scale: .5,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        label: {
          text: val + '\u00b0',
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0.0, -30.0),
          eyeOffset: new Cesium.Cartesian3(0, 0, -100)
        }
      });
    }
  },
  addSymbols: function () {
    this.symbols['Clouds'] = new Cesium.BillboardGraphics();
    this.symbols['Clouds'].image = new Cesium.ConstantProperty('custom/img/cloud.png');
    this.symbols['Clouds'].scale = 0.8;

    this.symbols['Clear'] = new Cesium.BillboardGraphics();
    this.symbols['Clear'].image = new Cesium.ConstantProperty('custom/img/sun.png');
    this.symbols['Clear'].scale = 0.8;

    this.symbols['Mist'] = new Cesium.BillboardGraphics();
    this.symbols['Mist'].image = new Cesium.ConstantProperty('custom/img/cloud.png');
    this.symbols['Mist'].scale = 0.8;

    this.symbols['Rain'] = new Cesium.BillboardGraphics();
    this.symbols['Rain'].image = new Cesium.ConstantProperty('custom/img/rain.png');
    this.symbols['Rain'].scale = 0.8;
  },
  addDataFromFile: function (name) {
    var _this = this;
    $.ajax({
      dataType: "json",
      url: 'custom/data/' + name + '.json',
      success: function (data) {
        $.each(data.list, function (index, value) {
          _this.addLabel(value.main.temp.toFixed(1), [value.coord.lon, value.coord.lat],
              value.isShowSym ? value.weather[0].main : null);
        });
      }
    });
  }
};

