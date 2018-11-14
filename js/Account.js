//时间戳转换为时间格式
function timestampToTime(timestamp,str) {
	function p(s) {
		return s < 10 ? '0' + s: s;
	}
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() + ':';
    m = date.getMinutes();
    s = date.getSeconds();
    if(str=='start'){
    	return Y+M+p(D)+p(h)+p(m);
    }else{
    	return p(h)+p(m);
    };
}
var Account = {
	ws:null,
	wo:null,
	type:'',
	item:[],
	codetype:'',
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
					for(var i=0;i<data.length;i++){
						var checked = '',disabled='';
						if(data[i].codename==_this.ws.codename){
							checked = 'checked="checked"'
						};
						if(data[i].codetype!='0'){
							data[i].time = '<span>截至日期：</span><span>'+data[i].usertime+'</span>';
						}else{
							data[i].time = '<span>有效时间：</span><span>'+timestampToTime(data[i].start_time,'start')+'~'+timestampToTime(data[i].end_time,'end')+'</span>';
						};
						_html +='<label class="item-box mui-radio'+disabled+'">'+							
							'<p class="item-icon"><img src="../img/card-icon.png" class="logo" /></p>'+
							'<div class="item-title"><h3>'+data[i].codename+'</h3><p>'+data[i].time+'</p></div>'+
//							'<p class="num"><span class="one">'+data[i].codenum+'</span><span class="su">数量</span></p>'+
							'<input name="payType" class="pay-type" data-codetype="'+data[i].codetype+'" data-ind="'+i+'" type="radio"'+checked+'>'+
						'</label>';
					};
					_this.item = data;
					console.log(_html,'文本')
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
			_this.codetype = _this.ws.cardtype;
			_this.codeList();
		});
		mui('.accountList').on('tap','.pay-type',function(){
			var i = this.dataset.ind,codetype=this.dataset.codetype;
			if(_this.codetype=='' || codetype==_this.codetype){
				mui.fire(_this.wo,'update',{
					type:_this.type,
					item:_this.item[i],
					cardtype:codetype
				});
				_this.ws.close();
			}else{
				mui.alert('只能选择同一种资产进行交换',app.name+'提示');
			};
		});
	},
	init:function(){
		this.bindEvent();
	}
};
Account.init();