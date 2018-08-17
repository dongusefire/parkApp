mui.init();
var Register_change = {
	ws:null,
	assets_in:null,
	assets_out:null,
	assets_codenameIn:'',
	assets_codenameOut:'',
	assets_codenumIn:'',
	assets_codenumOut:'',
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
	validateAssets:function(){
		var str ='';
		if(this.assets_in==null){
			str = '请选择换出资产';
		}else if(this.assets_out==null){
			str = '请选择换入资产';
		};
		if(str!=''){
			mui.alert(str,app.name+'提示');
			return false;
		}else{
			return true;
		};
	},
	pendingCreate:function(){
		var token = plus.storage.getItem('token'),_this=this;
		plus.nativeUI.showWaiting('正在提交...');
		mui.ajax(AJAX_PATH+'/user/pending/create?token='+token,{
			type:'post',
			dataType:'json',
			data:JSON.stringify({
				in_sn:_this.assets_in[0].order_sn,
				out_sn:_this.assets_out[0].order_sn
			}),
			success:function(res){
				plus.nativeUI.closeWaiting();
				if(res.code==200){
					mui.toast('挂单成功');
					_this.updateData();
				}else if(res.code==509){
					_this.pendingCreate();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				}
			}
		});
	},
	updateData:function(){
		var Nocard = $('.Nocard-wrap .list');
		if(this.assets_in.length==1){
			this.assets_in=null;
			Nocard.eq(0).removeClass('outcard');
			Nocard.eq(0).find('.out').html('请选择换出资产');
			Nocard.eq(0).find('.yu').html('剩余：0');
		}else{
			this.assets_in.splice(0,1);//删除数组中第一个
			this.assets_codenumIn--;
			Nocard.eq(0).find('.yu').html('剩余：'+this.assets_codenumIn);
		};
		if(this.assets_Out.length==1){
			this.assets_Out=null;
			Nocard.eq(1).removeClass('incard');
			Nocard.eq(1).find('.out').html('请选择换入资产');
			Nocard.eq(1).find('.yu').html('剩余：0');
		}else{
			this.assets_in.assets_Out(0,1);//删除数组中第一个
			this.assets_codenumOut--;
			Nocard.eq(1).find('.yu').html('剩余：'+this.assets_codenumOut);
		};
	},
	insertData:function(type,data,num,name){
		var Nocard = $('.Nocard-wrap .list'),i=0;
		if(type=='in'){
			this.assets_in = data;
			this.assets_codenameIn = name;
			this.assets_codenumIn = num;
			Nocard.eq(i).addClass('outcard');
		}else{
			i=1;
			this.assets_codenameOut = name;
			this.assets_codenumOut = num;
			Nocard.eq(i).addClass('incard');
			this.assets_out = data;
		};
		Nocard.eq(i).find('.out').html(name);
		Nocard.eq(i).find('.yu').html('剩余：'+num);
	},
	bindEvent:function(){
		var _this = this;
		mui.plusReady(function(){
			_this.ws = plus.webview.currentWebview();
		});
		mui('.g-content').on('tap','.c_assets',function(){
			var type = this.dataset.type,codename=_this.assets_codenameIn;
			var webviewOption = _this.webviewOption;
			if(type=='out'){
				codename = _this.assets_codenameOut;
			};
			webviewOption.extras = {
				assetsType:type,
				codename:codename
			};
			webviewOption.styles.statusbar.background = "#fff";
			mui.openWindow('Account.html','Account.html',webviewOption);
		});
		mui('.g-content').on('tap','#openList',function(){
			var webviewOption = _this.webviewOption;
			webviewOption.styles.statusbar.background = "#6d93ff";
			mui.openWindow('Register.html','Register.html',webviewOption);
		});
		mui('.g-content').on('tap','.register',function(){
			var type = this.dataset.type;
			if(_this.validateAssets()){
				mui.confirm('如果因为交换不成功，且原订单未按时使用，预定费用不退费。','确认挂单吗？',['取消','确定'],function(e){
					if(e.index==1){ //点击确定
						_this.pendingCreate();
					};
				});
			};
		});
		window.addEventListener('update',function(event){
			var data = event.detail;
			_this.insertData(data.type,data.item,data.codenum,data.codename)
		});
	},
	init:function(){
		this.bindEvent();
	}
};
Register_change.init();
