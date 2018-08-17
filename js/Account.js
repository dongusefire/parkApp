var Account = {
	ws:null,
	wo:null,
	type:'',
	item:[],
	codeList:function(){
		var token = plus.storage.getItem('token'),_this=this;
		var _url = '';
		if(_this.type=='in'){
			_url = '/user/code/list/usercode';
		}else{
			_url = '/user/code/list/othercode';
		};
		mui.ajax(AJAX_PATH+_url+'?token='+token,{
			type:'get',
			dataType:'json',
			success:function(res){
				if(res.code==200){
					var _html = '',data=res.data;
					_this.item = data;
					for(var i=0;i<data.length;i++){
						var checked = '';
						if(data[i].codename==_this.ws.codename){
							checked = 'checked="checked"'
						};
						_html +='<label class="item-box mui-radio" data-ind="'+i+'">'+
							'<p class="item-icon"><span class="logo"></span></p>'+
							'<p class="item-title">'+data[i].codename+'</p>'+
							'<p class="num"><span class="one">'+data[i].codenum+'</span><span class="su">数量</span></p>'+
							'<input name="payType" class="pay-type" type="radio"'+checked+'>'+
						'</label>';
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
			_this.type = _this.ws.assetsType;
			_this.codeList();
		});
		mui('.accountList').on('tap','.item-box',function(){
			var i = this.dataset.ind;
			mui.fire(_this.wo,'update',{
				type:_this.type,
				item:_this.item[i].codelist,
				codenum:_this.item[i].codenum,
				codename:_this.item[i].codename
			});
			_this.ws.close();
		});
	},
	init:function(){
		this.bindEvent();
	}
};
Account.init();