var vm = new Vue({
	el:'.mui-content',
	data:{
		items:[],
		page:1,
		maxPage:1,
		point:{
			longitude:'',
			latitude:''
		},
		isSort:false,
		sort:'智能排序'
	},
	methods:{
		readData:function(res,point){ //初始化第一次的数据
			var list = res.data.list;
			for(var i=0;i<list.lenth;i++){
				list[i].distance = (list[i].distance/1000).toFixed(3)
			};
			this.items = list;
			this.point = point;
			mui.init();
		},
		getParking:function(sort){
			var _this= this;
			console.log(this.point)
			mui.ajax(AJAX_PATH+'/parkinglot/search',{
				data:{
					"longitude":this.point.longitude,
					"latitude":this.point.latitude,
					"sort":sort  //distance-距离，price-价格，number-车位数量
				},
				dataType:'json',
				type:'POST',
				success:function(res,textStatus,xhr){
					if(res.code==200){
						_this.items = res.data.list;
					}else{
						mui.alert(res.msg,'系统提示','确定',null);
					};
				}
			});
		},
		sortToggle:function(){
			this.isSort = !this.isSort;
		}
	}
});
window.addEventListener('readData',function(event){
  vm.readData(event.detail.data,event.detail.point);
});
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
document.querySelector('#sort.mui-table-view-radio').addEventListener('selected',function(e){
	vm.getParking(e.detail.el.dataset.sort);
	vm.isSort = false;
});
