mui.init();
var newParkSpace = {
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
		mc.on('tap','#openChooseParkSpace',function(){
			mui.openWindow('chooseParkSpace.html','chooseParkSpace.html',_this.webviewOptions);
		})
	},
	init:function(){
		this.bindeEvent();
	}
}
mui.plusReady(function(){
	newParkSpace.init();
})