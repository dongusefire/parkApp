mui.init();
var home = {
	ws:null,
	map:null,
	wo:null,
	page:1,
	maxPage:1,
	point:{
		lng:'',
		lat:''
	},
	list:[],
	ParkingView:null,
	activeParking:'', //当前显示的Parking
	getUserLocation:function(){ 
		var _this=this;
		this.map.getUserLocation(function(state, point){ //获取用户的当前位置信息
			if( 0 == state ){
				console.log(JSON.stringify(point))
				_this.point={
					lng:point.longitude,
					lat:point.latitude
				};
				_this.setCenter(point);
				_this.getParking(point,'');
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
			var sub = plus.webview.create(_url,list[i].parking_lot_number,{
				bottom:'7px',
				left:'3%',
				height:'96px',
				width:'94%',
				position:'absolute',
				scrollIndicator:'none',
				background:'transparent'
			},list[i]);
			sub.hide();
			this.createMarker(list[i].longitude,list[i].latitude,list[i].free_number,i);
			this.ws.append(sub);
		};
	},
	createMarker:function(lng,lat,status,k){//创建地图标点Marker对象
		var Icon = '/img/ls.png';
		if(status<=5){
			Icon = '/img/jh.png';
		}else if(status==0){
			Icon = '/img/sh.png';
		};
		var _this = this;
		var marker=new plus.maps.Marker(new plus.maps.Point(lng,lat));
		marker.setIcon(Icon);
		marker.uuid = k; //给当前的Marker对象自定义一个属性
		marker.onclick = function(marker){
			if(_this.activeParking==_this.list[marker.uuid].parking_lot_number){
				return false;
			};
			if(mui.os.ios){
				plus.webview.show(_this.list[marker.uuid].parking_lot_number);
			}else{
				plus.webview.show(_this.list[marker.uuid].parking_lot_number,"fade-in",300);
			};
			if(_this.activeParking!=''){
				plus.webview.hide(_this.activeParking);
			};
			_this.activeParking = _this.list[marker.uuid].parking_lot_number;
		};
		this.map.addOverlay(marker);
	},
	createParkingView:function(){ //创建列表页窗口
		this.ParkingView = plus.webview.create('parking.html','parking.html',{
			statusbar:{
				background:"#fff" 
			},
			top:0,
			left:0,
			width:'100%',
			height:'100%',
			position:"absolute",
			zindex:9
		});
	},
	openSearch:function(){
		var options = {
			styles:{
				popGesture: "close", //popGesture窗口的侧滑返回功能。可取值"none"：无侧滑返回功能；"close"：侧滑返回关闭Webview窗口；"hide"：侧滑返回隐藏webview窗口
				statusbar:{  //statusbar窗口状态栏样式。仅在应用设置为沉浸式状态栏样式下有效，设置此属性后将自动保留系统状态栏区域不被Webview窗口占用。http://www.dcloud.io/docs/api/zh_cn/webview.html#plus.webview.WebviewStatusbarStyles
					background:"#fff" 
				}
			},
			extras:{
				point:this.point
			}
		};
		mui.openWindow('search.html','search.html',options);
	},
	bespeak:function(num){  //打开预定页面
		var options = {
			styles:{
				popGesture: "close", //popGesture窗口的侧滑返回功能。可取值"none"：无侧滑返回功能；"close"：侧滑返回关闭Webview窗口；"hide"：侧滑返回隐藏webview窗口
				statusbar:{  //statusbar窗口状态栏样式。仅在应用设置为沉浸式状态栏样式下有效，设置此属性后将自动保留系统状态栏区域不被Webview窗口占用。http://www.dcloud.io/docs/api/zh_cn/webview.html#plus.webview.WebviewStatusbarStyles
					background:"#fff" 
				}
			},
			extras:{
				parking_lot_num:num
			}
		};
		mui.openWindow('order.html','order.html',options);
	},
	createRoute:function(lng,lat){ //调用地图导航
		var address = localStorage.getItem('parking_lot_address');
		var point = this.point;
		if(point.lng!='' &&point.lng!=null){
			// 设置目标位置坐标点和其实位置坐标点
			var dst = new plus.maps.Point(lng,lat); // 终点坐标
			var src = new plus.maps.Point(point.lng,point.lat); // 起点坐标
			plus.maps.openSysMap(dst,address,src);
		}else{
			mui.alert('未获取到您的位置，无法进行导航');
		}
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
		var _this = this;
		this.map.onclick = function(point){  //获取当前用户点击的地里位置
			console.log(JSON.stringify(point),'点击地图')
		};
		mui('.header-bar').on('tap','#openMenu',function(){
			_this.ParkingView.show('pop-in');
//			if(mui.os.ios){
//				plus.webview.show("parking.html");
//			}else{
//				plus.webview.show("parking.html","fade-in",300);
//			};
		});
	},
	getParking:function(point,sort){
		var _this= this;
		mui.ajax(AJAX_PATH+'/parkinglot/search',{
			data:{
				"longitude":point.longitude,
				"latitude":point.latitude,
				"sort":sort  //distance-距离，price-价格，number-车位数量
			},
			dataType:'json',
			type:'POST',
			success:function(res,textStatus,xhr){
				if(res.code==200){
					_this.list = res.data.list;
					_this.createParking();
					//初始化列表页的数据
					mui.fire(plus.webview.getWebviewById('parking.html'),'readData',{
					    data:res,
					    point:point
					});
				}else{
					mui.alert(res.msg,'系统提示','确定',null);
				};
			}
		});
	},
	init:function(){
		// 获取窗口对象
		this.ws=plus.webview.currentWebview();
		this.wo=this.ws.opener(); //opener获取当前Webview窗口的创建者
		//创建map对象http://www.html5plus.org/doc/zh_cn/maps.html#plus.maps.Map.Map(id,options)
		this.map = new plus.maps.Map('map');
		this.getUserLocation();
		this.createSearchView();
		this.createParkingView();
		this.bindEvent();
	}
}
mui.plusReady(function(){
	if(!home.ws){
		home.init();
	};
})