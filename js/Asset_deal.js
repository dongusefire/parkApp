mui.init();
var vm = new Vue({
	el:'.box-main',
	data:{
		items:[],
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
			var this_ = this,total='';
			token = plus.storage.getItem('token');
			plus.nativeUI.showWaiting('正在获取...',{back:'none'});
			mui.ajax(AJAX_PATH+'/user/code/list/person?token='+token,{
				type:'get',
				dataType:'json',
				success:function(res){
					plus.nativeUI.closeWaiting();
					if(res.code==200){
						total = res.data.codetotle;
						$(".Total h3").html(total);
						this_.items = res.data.codelist;
					}else if(res.code==509){
						this_.readData();
					}else if(res.code!=502 && res.code!=503){
						mui.alert(res.msg,app.name+'提示','确定',null);
					}
				}
			})
		}
	}
});
function toTrade(){
	mui.openWindow({
		url:'Register_change.html',
		id:'Register_change.html',
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
}
mui.plusReady(function(){
	vm.getData();
	//跳转
	document.getElementById("footer").addEventListener('tap',function(){
		if(vm.items && vm.items.length!=0){
			toTrade()
		}else{
			mui.alert('您没有资产，无法进行交换！',app.name+'提示');
		};
	})
});

//设置更新事件
window.addEventListener('readData',function(){
	vm.readData();
});

