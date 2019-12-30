<template>
    <div class="amap-page-container">
      <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo" :events="events">
      	<!-- 点标记 -->
        <el-amap-marker v-for="(marker, index) in markers" :key='index' :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
        <!-- 文本 -->
        <el-amap-text v-for="(text, index) in texts" :key='index' :text="text.text" :offset="text.offset" :position="text.position" :events="text.events" ref="textF"></el-amap-text>
        <!-- 折线 -->
        <el-amap-polyline ref="slidebar" :editable="polyline.editable"  :path="polyline.path" :events="polyline.events"></el-amap-polyline>
      </el-amap>
      <input type="text" ref="txt" @blur='getPoint'>
      <div class="toolbar">
       <!--  <button type="button" name="button" v-on:click="toggleVisible">toggle first marker</button>
        <button type="button" name="button" v-on:click="changePosition">change position</button>
        <button type="button" name="button" v-on:click="chnageDraggle">change draggle</button>
        <button type="button" name="button" v-on:click="removeMarker">remove marker</button> -->
        <button type="button" name="button" v-on:click="drawingSite">绘制站点</button>
        <button type="button" name="button" v-on:click="clearSite">清除站点</button>
        <button type="button" name="button" v-on:click="drawingLines">绘制线路</button>
        <button type="button" name="button" v-on:click="EditLines">编辑线路</button>
        <button type="button" name="button" v-on:click="clearDrawing">清除绘制</button>
        <button type="button" name="button" v-on:click="getPath">获取线路坐标</button>
      </div>
    </div>
  </template>
<style type="text/css" lang='scss'>
.amap-page-container {
	.amap-demo {
	  height: 700px;
	}
  input {
    position: absolute;
    display: none;
  }
}
</style>
 <script>
    const exampleComponents = {
      props: ['text'],
      template: `<div>text from  parent: {{text}}</div>`
    }
    module.exports = {
      name: 'amap-page',
      data() {
        return {
        	// 是否绘制站点
        	IsSite: false,
        	// 折线点的数组
        	path: [],
			slotStyle: {
				padding: '2px 8px',
				background: '#eee',
				color: '#333',
				border: '1px solid #aaa'
			},
			plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
			zoom: 10,
			center: [116.38916, 39.911843],
			events: {
				'click': (e) => {
				  if (this.IsSite) {
				  	console.log(e.lnglat.lng, e.lnglat.lat);
				  	let arr = [];
				  	arr[0] = e.lnglat.lng;
				  	arr[1] = e.lnglat.lat;
				  	this.path.push(arr);
					  this.addMarker(e.lnglat.lng, e.lnglat.lat);
				  }
				}
			},
			// 点数据
          markers: [],
          // 折线数据
          polyline: {
            path: [],
            lineJoin: 'round',
            events: {
              'click': (e) => {
                // alert('click polyline');
                console.log(this.$refs.slidebar.$$getPath())
              },
              'end': (e) => {
                let newPath = e.target.getPath().map(point => [point.lng, point.lat]);
                console.log(newPath);
              },
              // 添加节点
              'addnode': () => {
              	let arr = this.$refs.slidebar.$$getPath()
                console.log(arr);
                this.markers = []
                for (var i = 0; i < arr.length; i++) {
                  this.markers.push({position: []})
                }
                console.log(this.markers)
                for (var i = 0; i < arr.length; i++) {
                  this.markers[i].position = arr[i];
                  this.texts[i].position = arr[i];
                }
              },
              // 删除节点
              'removenode': () => {
                let arr = this.$refs.slidebar.$$getPath()
                console.log(arr);
                this.markers = []
                for (var i = 0; i < arr.length; i++) {
                  this.markers.push({position: []})
                }
                console.log(this.markers)
                for (var i = 0; i < arr.length; i++) {
                  this.markers[i].position = arr[i];
                  this.texts[i].position = arr[i];
                }
              },
              'adjust': () => {
                let arr = this.$refs.slidebar.$$getPath()
                console.log(arr)
              	for (var i = 0; i < arr.length; i++) {
                  this.markers[i].position = arr[i];
                  this.texts[i].position = arr[i];
                }
              }
            },
            editable: false
          },
          texts: [
          ],
          renderMarker: {
            position: [121.5273285, 31.21715058],
            contentRender: (h, instance) => {
              // if use jsx you can write in this
              // return <div style={{background: '#80cbc4', whiteSpace: 'nowrap', border: 'solid #ddd 1px', color: '#f00'}} onClick={() => ...}>marker inner text</div>
              return h(
                'div',
                {
                  style: {background: '#80cbc4', whiteSpace: 'nowrap', border: 'solid #ddd 1px', color: '#f00'},
                  on: {
                    click: () => {
                      const position = this.renderMarker.position;
                      this.renderMarker.position = [position[0] + 0.002, position[1] - 0.002];
                    }
                  }
                },
                ['marker inner text']
              )
            }
          }
        };
      },
      methods: {
        changePosition() {
          let position = this.markers[0].position;
          this.markers[0].position = [position[0] + 0.002, position[1] - 0.002];
        },
        chnageDraggle() {
          let draggable = this.markers[0].draggable;
          this.markers[0].draggable = !draggable;
        },
        toggleVisible() {
          let visableVar = this.markers[0].visible;
          this.markers[0].visible = !visableVar;
        },
        removeMarker() {
          if (!this.markers.length) return;
          this.markers.splice(this.markers.length - 1, 1);
        },
        // 改变折线的可编辑性
        changeEditable() {
          this.polyline.editable = !this.polyline.editable;
        },
        // 添加标记点
        addMarker(lng, lat) {
          let marker = {
            position: [lng, lat]
          };
          let txt = {
              position: [lng, lat],
              text: '3720473201',
              topWhenClick: true,
              offset: [30, 15],
              events: {
                click: (e) => {
                  console.log(e);
                  this.$refs.txt.style.left = e.pixel.x + 'px';
                  this.$refs.txt.style.top = e.pixel.y + 'px';
                  this.$refs.txt.style.display = 'block';
                }
              }
            }
          this.markers.push(marker);
          this.texts.push(txt);
        },
        // 绘制站点
        drawingSite() {
        	this.IsSite = !this.IsSite;
        	// if (this.IsSite) {
        	// 	alert('开始绘制站点')
        	// } else {
        	// 	alert('结束绘制站点')
        	// }
        },
        // 清除倒数第一个站点
        clearSite() {
          this.markers.pop();
          this.texts.pop();
          this.polyline.path.pop();
        },
        // 绘制线路
        drawingLines() {
        	this.polyline.path = this.path;
        	console.log(this.polyline.path);
        },
        // 清除绘制
        clearDrawing() {
        	this.markers = [];
        	this.polyline.path = [];
        	this.path = [];
          this.texts = [];
        },
        // 编辑线路
        EditLines() {
        	this.polyline.editable = !this.polyline.editable;
        },
        //获取折线数据
        getPath() {
        	console.log(this.polyline.path)
        },
        // 失去焦点事件
        getPoint(e) {
          console.log(e.target.value);
          console.log(this.$refs.textF[0].text)
          this.$refs.textF[0].text = e.target.value;
          this.$refs.txt.style.display = 'none';
        }
      }
    };
</script>