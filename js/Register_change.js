mui.init();
var Register_change = {
	ws:null,
	type:'',
	assets_in:null,
	assets_out:null,
	in_id:'',
	out_id:'',
	assets_codenameIn:'',
	assets_codenameOut:'',
	assets_codenumIn:'',
	assets_codenumOut:'',
	assets_addressIn:'',
	assets_addressOut:'',
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
		var token = plus.storage.getItem('token'),_this=this,data='';
		plus.nativeUI.showWaiting('正在提交...');
		if(_this.type=='0'){
			data = JSON.stringify({
				in_sn:_this.assets_in[0].order_sn,
				out_sn:_this.assets_out[0].order_sn
			})
		}else{
			data = JSON.stringify({
				in_id:_this.assets_in[0].id,
				out_id:_this.assets_out[0].id
			})
		};
		mui.ajax(AJAX_PATH+'/user/pending/create?token='+token,{
			type:'post',
			dataType:'json',
			data:data,
			success:function(res){
				plus.nativeUI.closeWaiting();
				if(res.code==200){
					mui.toast('挂单成功');
					setTimeout(function(){
						mui.openWindow('Register.html','Register.html',{styles:{
							bottom:0,
							top:0,
							width:'100%',
							popGesture: "close",
							statusbar:{
								background:"#6d93ff" 
							}
						}});
						_this.updateData();
					},1000)
				}else if(res.code==509){
					_this.pendingCreate();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				}
			}
		});
	},
	//挂单成功后，更新页面数据
	updateData:function(){
		var Nocard = $('.Nocard-wrap .list');
		if(this.assets_in.length==1){
			this.assets_in=null;
			Nocard.eq(0).removeClass('outcard');
			Nocard.eq(0).find('.out').html('请选择换出资产');
			Nocard.eq(0).find('.yu').html('剩余：0');
		}else{
			this.assets_in.splice(0,1);//删除数组中第一个
			this.insertData('in',this.assets_in,this.assets_codenumIn-1,this.assets_codenameIn,this.assets_addressIn);
		};
		if(this.assets_out.length==1){
			this.assets_out=null;
			Nocard.eq(1).removeClass('incard');
			Nocard.eq(1).find('.out').html('请选择换入资产');
			Nocard.eq(1).find('.yu').html('剩余：0');
		}else{
			this.assets_out.splice(0,1);//删除数组中第一个
			this.insertData('out',this.assets_out,this.assets_codenumOut-1,this.assets_codenameOut,this.assets_addressOut);
		};
	},
	//资产的类型，当前资产的所有数据，当前资产的数量，当前资产的名称，资产的地址
	insertData:function(Atype,data,num,name,address){
		var Nocard = $('.Nocard-wrap .list'),i=0;
		if(Atype=='in'){
			this.assets_in = data;
			this.assets_codenameIn = name;
			this.assets_codenumIn = num;
			this.assets_addressIn = address;
			Nocard.eq(i).addClass('outcard');
			Nocard.eq(i).find('.address').html(address);
		}else{
			i=1;
			this.assets_out = data;
			this.assets_codenameOut = name;
			this.assets_codenumOut = num;
			this.assets_addressOut = address;
			Nocard.eq(i).addClass('incard');
			//如果资产有地址，就展示
			if(address && address!=''){
				Nocard.eq(i).find('.address').html(address);
			};
		};
		Nocard.eq(i).find('.out').html(name);
		Nocard.eq(i).find('.time').children('span').eq(0).html(data[0].start_time);
		Nocard.eq(i).find('.time').children('span').eq(1).html(data[0].end_time);
		Nocard.eq(i).find('.yu').html('剩余：'+num);
		if(this.type==1){
			$('.addr').show();
		};
	},
	bindEvent:function(){
		var _this = this;
		mui.plusReady(function(){
			_this.ws = plus.webview.currentWebview();
		});
//		换出资产中的选择资产按钮
		mui('.g-content').on('tap','.c_assets',function(){
			var type = this.dataset.type,codename=_this.assets_codenameOut;
			var webviewOption = _this.webviewOption;
			webviewOption.extras = {
				assetsType:type,
				codename:codename,
				cardtype:_this.type
			};
			webviewOption.styles.statusbar.background = "#fff";
			//type是资产的类型，通过不同的类型，打开不同的界面
			mui.openWindow('Account-'+type+'.html','Account-'+type+'.html',webviewOption);
		});
//		换入资产中的选择资产按钮
			mui('.g-content').on('tap','.c_assetsfugai',function(){
//				alert("123")
			var type = this.dataset.type,codename=_this.assets_codenameIn;
			var webviewOption = _this.webviewOption;
			webviewOption.extras = {
				assetsType:type,
				codename:codename,
				cardtype:_this.type
			};
			webviewOption.styles.statusbar.background = "#fff";
			mui.openWindow('Account-'+type+'.html','Account-'+type+'.html',webviewOption);
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
//			alert(JSON.stringify(event.detail))//这个是接受过来的数据
			var data = event.detail;
			_this.type = data.cardtype;
			_this.insertData(data.type,data.item,data.codenum,data.codename,data.address);
		});
	},
	init:function(){
		this.bindEvent();
	}
};
Register_change.init();
