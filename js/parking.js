mui.init();
//点击返回按钮，隐藏当前webview
document.getElementById('hideView').addEventListener('tap',function(){
	plus.webview.hide("parking.html");
});
mui('#parking-list').on('tap','.parking',function(){
	var id = this.getAttribute('id');
	plus.webview.currentWebview().opener().evalJS('home.bespeak('+vm.items[id].parking_lot_number+')');
});
mui('#parking-list').on('tap','.goRoute',function(e){
	var id = this.getAttribute('id');
	plus.webview.currentWebview().opener().evalJS('home.createRoute('+vm.items[id].longitude+','+vm.items[id].latitude+')');
    e.stopPropagation();
});
mui.plusReady(function(){
	
})