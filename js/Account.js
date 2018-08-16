var Account = {
	ws:null,
	wo:null,
	type:'',
	codeList:function(){
		var token = plus.storage.getItem('token'),_this=this;
		mui.ajax(AJAX_PATH+'/user/code/list?token='+token,{
			type:'get',
			dataType:'json',
			data:{
				type:_this.type
			},
			success:function(res){
				console.log(JSON.stringify(res),'返回的数据')
				if(res.code==200){
					var _html = '',data=res.data;
					for(var i=0;i<data.length;i++){
						_html +='<a class="item-box mui-radio" data-sn="'+data[i].order_sn+'">'+
							'<p class="item-icon"><span class="logo"></span></p>'+
							'<p class="item-title">'+data[i].park_name+'</p>'+
							'<p class="num"><span class="one">1</span><span class="su">数量</span></p>'+
							'<input name="payType" class="pay-type" type="radio">'+
						'</a>';
					};
					mui('.accountList')[0].innerHTML = _html;
				}else if(res.code==509){
					_this.codeList();
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
			_this.wo = _this.ws.opener();
			_this.type = _this.ws.type;
		});
		mui('.accountList').on('tap','.item-box',function(){
			var sn = this.dataset.sn;
			mui.fire(_this.wo,'update',{
				type:_this.type,
				sn:sn
			});
		});
	},
	init:function(){
		this.bindEvent();
		this.codeList();
	}
};
Account.init();