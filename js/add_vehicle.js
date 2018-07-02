mui.init();
var provinceItems = ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新'];
var cityItems = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var vm = new Vue({
	el:'.mui-content',
	data:{
		phone_number:'',
		car_number:'',
		code:'',
		province:'京',
		city:'',
		carArr:[],
		maxlen:'5',
		cityItems:cityItems,
		provinceItems:provinceItems,
		provinceBox:false,
		cityBox:false,
		plateIndex:null,
		plateInput:'',
		isDefault:true,
		isSend:false,
		num:60,
		token:plus.storage.getItem('token')
	},
	methods:{
		setInput:function(e){
			this.carArr = e.target.value.toUpperCase().split('');
			this.plateInput = e.target.value;
			console.log(e.target.value)
			this.plateIndex = e.target.value==''? 0:e.target.value.length-1;
		},
		focusInput:function(event){
			this.plateIndex = event.target.value==''? 0:event.target.value.length-1;
			event.currentTarget.style.marginLeft = '-100%';
		},
		blurInput:function(event){
			this.plateIndex = null;
			event.currentTarget.style.marginLeft = '0';
		},
		selectProvince:function(str){
			this.province = str;
			this.toggleProvince('close');
			if(this.city==''){
				this.toggleCity('open');
			};
		},
		selectCity:function(str){
			this.city = str;
			this.toggleCity('close');
			if(this.plateInput.length!=this.maxlen){
				document.querySelectorAll('.plateInput')[0].focus();
			};
		},
		addNum:function(){
			this.maxlen=6;
		},
		toggleProvince:function(str){
			if(str=='open'){
				this.provinceBox = true;
			}else{
				this.provinceBox = false;
			};
		},
		validate_tel:function(num){
			var pre = /^1\d{10}$/;
			if(!pre.test(num)){
				mui.alert('请输入正确的手机号','系统提示','确定',null);
				return false;
			};
			return true;
		},
		toggleCity:function(str){
			if(str=='open'){
				this.cityBox = true;
			}else{
				this.cityBox = false;
			};
		},
		sendCode:function(){
			var _this = this;
			if(_this.num == 0){
				_this.num = 60;
				return;
			}else{
				_this.num--;
			};
			setTimeout(function(){
				_this.sendCode()
			},1000);
		},
		//发送验证码
		send:function(){
			var _this = this;
			if(!_this.validate_tel(this.phone_number)){
				return false;
			};
			smsSend(this.phone_number,2,function(res,textStatus,xhr){
				_this.isSend = true;
				_this.sendCode();
			},function(){});
		},
		addVehicle:function(){
			var _this = this;
			if(_this.city==''){
				mui.alert('请选择正确的车牌字母','系统提示','确定',null);
				return false;
			};
			if(_this.plateInput.length!=_this.maxlen){
				mui.alert('请输入正确的车牌号码','系统提示','确定',null);
				return false;
			};
			if(!_this.validate_tel(_this.phone_number)){
				return false;
			};
			if(!/^\d{6}$/.test(_this.code)){
				mui.alert('请输入正确的验证码','系统提示','确定',null);
				return false;
			};
			this.car_number = _this.province+_this.city+_this.plateInput;
			var jsonData = JSON.stringify({
				phone_number:this.phone_number,code:this.code,car_number:this.car_number
			});
			mui.ajax(AJAX_PATH+'/user/car/add?token='+this.token,{
				data:jsonData,
				dataType:'json',
				type:'post',
				success:function(res,textStatus,xhr){
					if(res.code==200){
						mui.toast('添加成功')
					}else{
						mui.alert(res.msg,'系统提示','确定',null);
					};
				}
			});
		}
	}
})
