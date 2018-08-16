mui.init();
var Register_change = {
	ws:null,
	in_sn:'',
	out_sn:'',
	webviewOption:{
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
	pendingCreate:function(){
		var token = plus.storage.getItem('token'),_this=this;
		plus.nativeUI.showWaiting('正在提交...');
		mui.ajax(AJAX_PATH+'/user/pending/create?token='+token,{
			type:'post',
			dataType:'json',
			data:{
				in_sn:'',
				out_sn:''
			},
			success:function(res){
				plus.nativeUI.closeWaiting();
				if(res.code==200){
					console.log('挂单成功!');
					mui.toast('挂单成功');
				}else if(res.code==509){
					_this.pendingCreate();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				}
			}
		});
	},
	bindEvent:function(){
		var _this = this;
		mui.plusReady(function(){
			_this.ws = plus.webview.currentWebview();
		});
		mui('.g-content').on('tap','.c_assets',function(){
			var type = this.dataset.type;
			_this.webviewOption.extras = {
				type:type
			};
			mui.openWindow('Account.html','Account.html',_this.webviewOption);
		});
		window.addEventListener('update',function(event){
			var data = event.detail;
		});
	},
	init:function(){
		this.bindEvent();
	}
};
Register_change.init();
