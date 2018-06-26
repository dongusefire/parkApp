mui.init();
var home = {
	ws:null,
	map:null,
	wo:null,
	point:{
		lng:'',
		lat:''
	},
	list:[
		{
			address:"测试1",
			carPortCount:2000,
			carPortSurplusCount:1989,
			distance:"1887997",
			ltdCode:"2000001",
			maxPrice:0.33,
			minPrice:0.33,
			parkCode:"20000010002",
			parkingName:"安居宝园区停车场",
			longitude:116.396367,
			latitude:40.089076,
			status:0,
		},
		{
			address:"测试2",
			carPortCount:2000,
			carPortSurplusCount:1989,
			distance:"1887997",
			ltdCode:"2000001",
			maxPrice:0.17,
			minPrice:0.17,
			parkCode:"20000010002",
			parkingName:"安居宝园区停车场2",
			longitude:116.22945,
			latitude:40.076029,
			status:1,
		},
		{
			address:"测试3",
			carPortCount:2000,
			carPortSurplusCount:1989,
			distance:"1887997",
			ltdCode:"2000001",
			maxPrice:0.22,
			minPrice:0.1,
			parkCode:"20000010002",
			parkingName:"安居宝园区停车场3",
			longitude:116.239992,
			latitude:40.015259,
			status:2
		}
	],
	activeParking:'', //当前显示的Parking
	getUserLocation:function(){ 
		var _this=this;
		this.map.getUserLocation(function(state, point){ //获取用户的当前位置信息
			if( 0 == state ){
				_this.point={
					lng:point.longitude,
					lat:point.latitude
				};
				_this.setCenter(point);
			}else{
				alert( "Failed!" );//用户拒绝授权
			};
		});
	},
	createSearchView:function(){//创建覆盖在地图上的搜索窗口
		var _url ='home_search.html'
		this.ws.append(plus.webview.create(_url,_url,{
			top:'56px',
			left:'7%',
			height:'40px',
			width:'86%',
			position:'absolute',
			scrollIndicator:'none',
			background:'transparent'
		}));
	},
	createParking:function(){
		var _url = 'home_parking.html';
		var list = this.list;
		for(var i=0;i<list.length;i++){
			var sub = plus.webview.create(_url,list[i].parkingName,{
				bottom:'7px',
				left:'3%',
				height:'96px',
				width:'94%',
				position:'absolute',
				scrollIndicator:'none',
				background:'transparent'
			},list[i]);
			sub.hide();
			this.createMarker(list[i].longitude,list[i].latitude,list[i].status,i);
			this.ws.append(sub);
		};
	},
	createMarker:function(lng,lat,status,k){//创建地图标点Marker对象
		var Icon = '/img/jh.png';
		var _this = this;
		var marker=new plus.maps.Marker(new plus.maps.Point(lng,lat));
		if(status==1){
			Icon = '/img/ls.png';
		}else if(status==2){
			Icon = '/img/sh.png';
		};
		marker.setIcon(Icon);
		marker.uuid = k; //给当前的Marker对象自定义一个属性
		marker.onclick = function(marker){
			if(_this.activeParking==_this.list[marker.uuid].parkingName){
				return false;
			};
			if(mui.os.ios){
				plus.webview.show(_this.list[marker.uuid].parkingName);
			}else{
				plus.webview.show(_this.list[marker.uuid].parkingName,"fade-in",300);
			};
			if(_this.activeParking!=''){
				plus.webview.hide(_this.activeParking);
			};
			_this.activeParking = _this.list[marker.uuid].parkingName;
		};
		this.map.addOverlay(marker);
	},
	createRoute:function(lng,lat){ //创建地图中的路线对象
//		var routeObj = new plus.maps.Route(new plus.maps.Point(this.point.lng,this.point.lat),new plus.maps.Point(lng,lat));
//		routeObj.routeTip='导航';
//		console.log(lng,lat,'route',JSON.stringify(routeObj))
//		this.map.addOverlay(routeObj);
	},
	showUserLocation:function(){ //打开用户位置
		this.map.showUserLocation( true );
	},
	hideUserLocation:function(){//关闭用户位置
		this.map.showUserLocation( false );
	},
	getCurrentCenter:function(){ //获取地图中心点
		this.map.getCurrentCenter(function(state, point){
			if( 0 == state ){
				console.log(JSON.stringify(point))
			}else{
				console.log( "Failed!" );//未获取到
			};
		})
	},
	setCenter:function(point){ //设置地图中心点
		this.map.setCenter(point);
		this.showUserLocation();
	},
	bindEvent:function(){
		this.map.onclick = function(point){  //获取当前用户点击的地里位置
			console.log(JSON.stringify(point),'点击地图')
		}
	}, 
	init:function(){
		// 获取窗口对象
		this.ws=plus.webview.currentWebview();
		this.wo=this.ws.opener(); //opener获取当前Webview窗口的创建者
		//创建map对象http://www.html5plus.org/doc/zh_cn/maps.html#plus.maps.Map.Map(id,options)
		this.map = new plus.maps.Map('map');
		this.getUserLocation();
		this.createSearchView();
		this.createParking();
		this.bindEvent();
	}
}
mui.plusReady(function(){
	if(!home.ws){
		home.init();
	};
})