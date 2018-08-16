mui.init({
	swipeBack: true //启用右滑关闭功能
});
var vm = new Vue({
	el:'.mui-content',
	data:{
		items:[],
		items2:[],
		items3:[],
		items4:[],
		items5:[]
	},
	methods:{
		getData:function(){
			this.token = plus.storage.getItem('token');
			if(this.token && this.token!=''){
				this.readData();
			}else{
				login('尚未登录或登录已过期')
			};
		},
		readData:function(params){
			var this_ = this;
			token = plus.storage.getItem('token');
			if(!params){
				params='';	
			};
			mui.ajax(AJAX_PATH+'/user/pending/list?token='+token,{
				data:{"status":params},
				type:'post',
				dataType:'json',
				success:function(res){
					if(res.code==200){
						if(params==2){
							//进行中
							this_.items2 = res.data
						}else if(params==4){
							//已完成
							this_.items3 = res.data
						}else if(params==6){
							//已撤销
							this_.items4 = res.data
						}else if(params==5){
							//已关闭
							this_.items5 = res.data
						}else if(params==''){
							this_.items = res.data
						};
					}else if(res.code==509){
						this_.readData(params);
					}else if(res.code!=502 && res.code!=503){
						mui.alert(res.msg,app.name+'提示','确定',null);
					}
				}
			})
		}
	}
})
mui.plusReady(function(){
	vm.getData()
	document.getElementById("all").addEventListener('tap',function(){
		vm.readData()
	})
	document.getElementById("running").addEventListener('tap',function(){
		vm.readData(2)
		
	})
	document.getElementById("finished").addEventListener('tap',function(){
		vm.readData(4)
	})
	document.getElementById("cancel").addEventListener('tap',function(){
		vm.readData(6)
	})
	document.getElementById("shutDown").addEventListener('tap',function(){
		vm.readData(5)
	})
})
window.addEventListener('readData',function(){
	vm.readData();
});
