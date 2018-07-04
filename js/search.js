mui.init();
mui.plusReady(function(){
	vm.getSearch();
	var ws = plus.webview.currentWebview();
	vm.point = ws.point;
})
var vm = new Vue({
	el:'.mui-content',
	data:{
		searchList:[],
		items:[],
		point:null,
		keywords:'',
	},
	methods:{
		getSearch:function(){
			var search = plus.storage.getItem('search');
			if(search &&search!=''){
				this.searchList = search.split('&');
			};
		},
		setSearch:function(){
			var str = this.keywords;
			if(str!=''){
				var list  = plus.storage.getItem('search');
				if(!list){ //如果是第一次获取的数据，那么就创建search的storage
					plus.storage.setItem('search',str);
				}else{
					if(list&&list!=''){
						plus.storage.setItem('search',list+'&'+str);
					};
				};
			};
			this.getParking();
		},
		getParking:function(){
			var _this= this;
			var jsonData = JSON.stringify({
					"longitude":this.point.lng,
					"latitude":this.point.lat,
					"sort":'distance',
					"keywords":this.keywords		
			});
			mui.ajax(AJAX_PATH+'/parkinglot/search',{
				data:jsonData,
				dataType:'json',
				type:'POST',
				success:function(res,textStatus,xhr){
					if(res.code==200){
						var _list = res.data.list;
						for(var i=0;i<_list.length;i++){
							_list[i].distance = (_list[i].distance/1000).toFixed(3)
						};
						_this.items = _list;
					}else{
						mui.alert(res.msg,'系统提示','确定',null);
					};
				}
			});
		}
	}
})
mui('.header-bar').on('change','#search-input',function(){
	vm.keywords = this.value.replace(/^\s+|\s+$/g, '');
	vm.setSearch();
})
