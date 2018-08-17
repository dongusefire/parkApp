mui.init({
	swipeBack: true //启用右滑关闭功能
});
var params='';
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
		readData:function(){
			var this_ = this;
			token = plus.storage.getItem('token');
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
						this_.readData();
					}else if(res.code!=502 && res.code!=503){
						mui.alert(res.msg,app.name+'提示','确定',null);
					}
				}
			})
		},
		backup:function(listId){
			token = plus.storage.getItem('token');
			var This = this;
			mui.ajax(AJAX_PATH+'/user/pending/cancel?token='+token,{
				type:'post',
				dataType:'json',
				data:{
					"id":listId
				},
				success:function(res){
					if(res.code==200){
						mui.alert('成功',app.name+'提示','确定',function(){
							This.readData();
						});
					}else if(res.code==509){
						This.backup(listId);
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
		params='';
		vm.readData()
	})
	document.getElementById("running").addEventListener('tap',function(){
		params=2;
		vm.readData()
		
	})
	document.getElementById("finished").addEventListener('tap',function(){
		params=4;
		vm.readData()
	})
	document.getElementById("cancel").addEventListener('tap',function(){
		params=6;
		vm.readData()
	})
	document.getElementById("shutDown").addEventListener('tap',function(){
		params=5;
		vm.readData()
	})
	mui(".mui-content").on('tap','.retreat',function(){
		var retreat = $(this).attr("data-id");
		vm.backup(retreat)
	})
})
window.addEventListener('readData',function(){
	vm.readData();
});

