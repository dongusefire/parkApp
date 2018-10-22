var countdown = 20,seconds = mui('.seconds')[0],get_code = mui('.get_code')[0];
function sendCode(){
	if(countdown == 0){
		seconds.style.display = 'none';
		get_code.style.display = 'inline';
		countdown = 20;
		return;
	}else{
		mui('.num')[0].innerText = countdown;
		countdown--;
	}
	setTimeout(function(){
		sendCode()
	},1000);
};
var Apply_forword = {
	ws:null,
	wo:null,
	isWX:'',
	auths:{},
	UserOpenid:null,
	status:'',
	balance:0,
	loading:null,
	accountVal:-1,
	code:'',
	bindEvent:function(){
		var _this = this;
		mui.plusReady(function(){
			_this.ws = plus.webview.currentWebview();
			_this.wo = _this.ws.opener();
			_this.getOauth();
			_this.profitBalance();
			_this.getUserOpenid();
		});
		mui('.g-content').on('tap','.get_code',function(){
			var phone_number = plus.storage.getItem('phone_number');
			smsSend(phone_number,4,function(res,textStatus,xhr){
				get_code.style.display = 'none';
				seconds.style.display = 'inline';
				sendCode();
			},function(xhr,status){
				
			});
		});
		mui('.g-content').on('tap','.changewx',function(){
			_this.status  = '更新';
			_this.wxlogin();
		});
		mui('.g-content').on('tap','.bindwx',function(){
			_this.status  = '绑定';
			_this.wxlogin();
		});
		mui('.g-content').on('tap','#forwardBtn',function(){
			var val = app.trim(mui('#account-input')[0].value);
			var p1 = /^[0-9]+(\.\d+)?$/,str='';
			var code = mui('#code')[0].value;
			if(_this.UserOpenid==null){
				str = '您还未绑定提现微信';
			}else if(!p1.test(val) || val==0){
				str='提现金额只能为正整数和小数';
			}else if(Number(val)<10){
				str='提现金额不能小于10';
			}else if(val>_this.balance){
				str='您最多可提现'+_this.balance;
			}else if(!/^\d{6}$/.test(code)){
				str = '请输入正确的验证码';
			};
			if(str!=''){
				mui.toast(str);
			}else{
				_this.accountVal = val;
				_this.code = code;
				_this.addUserOpenid(_this.UserOpenid);
			};
		});
	},
	wxlogin:function(){ //登录微信
		if(this.isWX==''){
			mui.alert('未检测到本机安装了微信',app.name+'提示');
			return false;
		};
		var auth=this.auths[this.isWX],_this=this;
		if(auth){
			var w=null;
			if(plus.os.name=="Android"){
				w=plus.nativeUI.showWaiting();
			};
			document.addEventListener("pause",function(){
				setTimeout(function(){
					w&&w.close();w=null;
				},2000);
			}, false );
			auth.login(function(){
				w&&w.close();w=null;
				console.log("登录认证成功："+JSON.stringify(auth.authResult))
				_this.getUserInfo(auth);
			},function(e){
				w&&w.close();w=null;
				console.log("["+e.code+"]："+e.message);
				console.log("详情错误信息请参考授权登录(OAuth)规范文档：http://www.html5plus.org/#specification#/specification/OAuth.html",null,"登录失败["+e.code+"]："+e.message);
			});
		}else{
			mui.alert("无效的登录认证通道！",app.name+'提示');
		};
	},
	getUserInfo:function(auth){ //获取用户信息
		var _this = this;
		auth.getUserInfo(function(data){
			console.log("获取用户信息成功：",JSON.stringify(auth.userInfo));
			var nickname=auth.userInfo.nickname||auth.userInfo.name||auth.userInfo.miliaoNick;
			_this.UserOpenid = auth.userInfo.openid;
			_this.updateView(nickname);
			//_this.updateUserOpenid(auth.userInfo.openid,nickname);
		},function(e){
			console.log("获取用户信息失败：","["+e.code+"]："+e.message);
			mui.alert(_this.status+'失败',app.name+'提示');
		});
	},
	profitBalance:function(){ //查询用户收益余额
		var _this = this,token = plus.storage.getItem('token');
		var loading = plus.nativeUI.showWaiting('正在查询收益余额...');
		mui.ajax(AJAX_PATH+'/profit/balance?token='+token,{
			type:'get',
			dataType:'json',
			success:function(res){
				loading.close();
				if(res.code==200){
					if(res.data[0].balance){
						_this.balance = res.data[0].balance;
					};
				}else if(res.code==509){
					_this.profitBalance();
				}else if(res.code!=502 &&res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			},
			error:function(){
				loading.close();
				mui.alert('服务器错误,请稍后重试',app.name+'提示');
			}
		});
	},
	getOauth:function(){ //获取客户端登录通道
		var _this = this;
		plus.oauth.getServices(function(services){
			for(var i in services){
				var service = services[i];
				if(service.description=='微信'){
					_this.auths[service.id]=service;
					_this.isWX = service.id;
				};
			};
		},function(e){
			mui.alert("获取登录认证失败："+e.message,app.name+'提示');
		});
	},
	updateView:function(name){ //根据用户是否绑定了账户来更新视图
		var wbd = $('.wbd'),binded = $('.binded'),bindwx = $('.bindwx'),changewx = $('.changewx');
		if(name){
			wbd.hide();
			binded.find('span').text(name);
			binded.css('display','inline-block');
			bindwx.hide();
			changewx.css('display','inline');
		}else{
			wbd.css('display','inline-block');
			binded.hide();
			bindwx.css('display','inline');
			changewx.hide();
		};
		$('.wei').show();
	},
	getUserOpenid:function(){ //获取用户绑定的openid
		var _this = this,token = plus.storage.getItem('token');
		mui.ajax(AJAX_PATH+'/user/openid/search?token='+token,{
			data:{
				os:'wx_open'
			},
			type:'get',
			dataType:'json',
			success:function(res){
				if(res.code==200){
					if(res.data && res.data.openid!=''){
						_this.UserOpenid = res.data.openid;
						_this.updateView(res.data.nickname);
					}else{
						_this.UserOpenid = null;
						_this.updateView();
					};
				}else if(res.code==509){
					_this.getUserOpenid();
				}else if(res.code!=502 &&res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			},
			error:function(){
				mui.alert('服务器错误,请稍后重试',app.name+'提示');
			}
		});
	},
	addUserOpenid:function(id){ //添加提现账号
		var _this = this,token = plus.storage.getItem('token');
		if(this.loading==null){
			this.loading = plus.nativeUI.showWaiting('正在发送提现申请...',{back:"none"});
		};
		console.log(JSON.stringify({
			type:'wx_app',
			account:id
		}))
		//type（wx_app--微信app，alipay--支付宝，bank--银行卡,wx_gzh--微信公众号，wx_h5--微信H5） 
		mui.ajax(AJAX_PATH+'/user/forward/account?token='+token,{
			type:'post',
			data:JSON.stringify({
				type:'wx_app',
				account:id
			}),
			dataType:'json',
			success:function(res){
				if(res.code==200 || res.code==500){
					_this.forwardApply(id);
				}else if(res.code==509){
					_this.addUserOpenid(id);
				}else if(res.code!=502 &&res.code!=503){
					if(_this.loading!=null){
						_this.loading.close();
						_this.loading = null;
					};
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			},
			error:function(){
				if(_this.loading!=null){
					_this.loading.close();
					_this.loading = null;
				};
				mui.alert('服务器错误,请稍后重试',app.name+'提示');
			}
		});
	},
	forwardApply:function(id){ //申请提现
		var _this = this,token = plus.storage.getItem('token'),amount = _this.accountVal;
		//type（wx_app--微信app，alipay--支付宝，bank--银行卡,wx_gzh--微信公众号，wx_h5--微信H5） 
		mui.ajax(AJAX_PATH+'/user/forward/apply?token='+token,{
			type:'post',
			data:JSON.stringify({
				amount:amount,
				openid:id,
				code:_this.code
			}),
			dataType:'json',
			success:function(res){
				if(_this.loading!=null){
					_this.loading.close();
					_this.loading = null;
				};
				if(res.code==200){
					mui.toast('提现成功');
					mui('#account-input')[0].value='';
					_this.accountVal = '';
					setTimeout(function(){
						mui.openWindow({
							url:'Bring_success.html',
							id:'Bring_success.html',
							styles:{
								popGesture: "close",
								statusbar:{
									background:"#fff" 
								}
							},
							extras:{
								price:amount
							}
					   });
					},1500);
				}else if(res.code==509){
					_this.forwardApply(id);
				}else if(res.code!=502 &&res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			},
			error:function(){
				if(_this.loading!=null){
					_this.loading.close();
					_this.loading = null;
				};
				mui.alert('服务器错误,请稍后重试',app.name+'提示');
			}
		});
	},
	updateUserOpenid:function(id,name){ //更新或者绑定用户的openid
		var _this = this,token = plus.storage.getItem('token');
		var loading = plus.nativeUI.showWaiting('正在'+_this.status+'...');
		mui.ajax(AJAX_PATH+'/user/openid/update?token='+token,{
			type:'post',
			data:JSON.stringify({
				app_openid:id,
				nickname:name
			}),
			dataType:'json',
			success:function(res){
				loading.close();
				if(res.code==200){
					_this.updateView(name);
					_this.UserOpenid = id;
					mui.toast(_this.status+'成功');
				}else if(res.code==509){
					_this.updateUserOpenid(id,name);
				}else if(res.code!=502 &&res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			},
			error:function(){
				loading.close();
				mui.alert('服务器错误,请稍后重试',app.name+'提示');
			}
		});
	},
	init:function(){
		this.bindEvent();
	}
}
Apply_forword.init();