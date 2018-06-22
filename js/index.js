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
			address:"广东省广州萝岗区科学大道起云路6号",
			carPortCount:2000,
			carPortSurplusCount:1989,
			distance:"1887997",
			ltdCode:"2000001",
			maxPrice:0.33,
			minPrice:0.33,
			parkCode:"20000010002",
			parkingName:"安居宝园区停车场"
		},
		{
			address:"广东省广州萝岗区科学大道起云路2785号",
			carPortCount:2000,
			carPortSurplusCount:1989,
			distance:"1887997",
			ltdCode:"2000001",
			maxPrice:0.17,
			minPrice:0.17,
			parkCode:"20000010002",
			parkingName:"安居宝园区停车场2"
		},
		{
			address:"广东省广州萝岗区科学大道起云路99号",
			carPortCount:2000,
			carPortSurplusCount:1989,
			distance:"1887997",
			ltdCode:"2000001",
			maxPrice:0.22,
			minPrice:0.1,
			parkCode:"20000010002",
			parkingName:"安居宝园区停车场3"
		}
	],
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
		var _url = 'home_search.html';
		var list = this.list;
		for(var i=0;i<list.length;i++){
			var sub = plus.webview.create(_url,list[i].parkingName,{
				top:'56px',
				left:'7%',
				height:'40px',
				width:'86%',
				position:'absolute',
				scrollIndicator:'none',
				background:'transparent'
			},list[i]);
			sub.hide();
			this.ws.append(sub);
		};
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
	init:function(){
		// 获取窗口对象
		this.ws=plus.webview.currentWebview();
		this.wo=this.ws.opener(); //opener获取当前Webview窗口的创建者
		//创建map对象http://www.html5plus.org/doc/zh_cn/maps.html#plus.maps.Map.Map(id,options)
		this.map = new plus.maps.Map('map');
		this.getUserLocation();
		this.createSearchView();
	}
}
mui.plusReady(function(){
	if(!home.ws){
		home.init();
	};
})