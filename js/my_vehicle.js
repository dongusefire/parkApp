mui.init();
var vm = new Vue({
	el:'.mui-content',
	data:{
		items:[],
		car_id:'',
		token:plus.storage.getItem('token')
	},
	created:function(){
		if(this.token && this.token!=''){
			this.readData();
		}else{
			login('尚未登录或登录已过期')
		};
	},
	methods:{
		openView:function(){
			mui.openWindow('add_vehicle.html','add_vehicle.html',{
				styles:{
					bottom:0,
					top:0,
					width:'100%',
					popGesture: "close",
					statusbar:{
						background:"#fff" 
					}
				}
			})
		},
		readData:function(){
			var _this = this;
			mui.ajax(AJAX_PATH+'/user/car/list?token='+this.token,{
				dataType:'json',
				type:'get',
				success:function(res,textStatus,xhr){
					if(res.code==200){
						_this.items = res.data;
					}else{
						mui.alert(res.msg,'系统提示','确定',null);
					};
				}
			});
		},
		changeDefault:function(index){
			var list = this.items;
			var oid = 0;
			var jsonData = JSON.stringify({car_number:list[index].car_number});
			for(var i=0;i<list.length;i++){
				if(list[i].default==1){
					oid = i;
				};
				if(i!=index){
					list[i].default = 0;
				}else{
					list[i].default = 1;
				};
			};
			mui.ajax(AJAX_PATH+'/user/car/default?token='+this.token,{
				data:jsonData,
				dataType:'json',
				type:'post',
				success:function(res,textStatus,xhr){
					if(res.code==200){
						mui.toast(res.msg)
					}else{
						for(var i=0;i<list.length;i++){
							if(i==oid){
								list[i].default = 1;
							}else{
								list[i].default = 0;
							};
						};
						mui.alert(res.msg,'系统提示','确定',null);
					};
				}
			});
		},
		removeVehicle:function(index){
			var list = this.items;
			var arr = [];
			var _this = this;
			var jsonData = JSON.stringify({car_number:list[index].car_number});
			mui.ajax(AJAX_PATH+'/user/car/delete?token='+this.token,{
				data:jsonData,
				dataType:'json',
				type:'post',
				success:function(res,textStatus,xhr){
					if(res.code==200){
						mui.toast(res.msg);
						for(var i=0;i<list.length;i++){
							if(i!=index){
								arr.push(list[i])
							};
						};
						_this.items = arr;
					}else{
						mui.alert(res.msg,'系统提示','确定',null);
					};
				}
			});
		}
	}
})
//设置更新事件
window.addEventListener('updata',function(){
	vm.readData();
});