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
			var this_ = this;
			token = plus.storage.getItem('token');
			mui.ajax(AJAX_PATH+'/user/code/list/person?token='+token,{
				type:'get',
				dataType:'json',
				success:function(res){
					if(res.code==200){
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
function getTotal(){
	var _this = this;
	mui.ajax(AJAX_PATH+'/user/code/list/person?token='+token,{
		type:'get',
		dataType:'json',
		success:function(res){
			if(res.code==200){
				total = res.data.codetotle;
				$(".Total h3").html(total);
			}else if(res.code==509){
				_this.getTotal();
			}else if(res.code!=502 && res.code!=503){
				mui.alert(res.msg,app.name+'提示','确定',null);
			}
		}
	})
}
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
	getTotal();
	//跳转
	document.getElementById("footer").addEventListener('tap',function(){
		toTrade()
	})
});

//设置更新事件
window.addEventListener('readData',function(){
	vm.readData();
});

