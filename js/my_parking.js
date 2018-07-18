mui.init();
var myParking = {
	webviewOptions:{
		styles:{
			bottom:0,
			top:0,
			width:'100%',
			popGesture: "close",
			statusbar:{
				background:"#fff" 
			}
		}
	},
	bindeEvent:function(){
		var mc = mui('.mui-content'),_this = this;
		mc.on('tap','.addvehicle',function(){
			mui.openWindow('newParkSpace.html','newParkSpace.html',_this.webviewOptions);
		})
	},
	init:function(){
		this.bindeEvent();
	}
}
mui.plusReady(function(){
	myParking.init();
})