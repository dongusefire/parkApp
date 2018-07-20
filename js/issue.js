mui.init();
var date1,date2,time_start,time_end;
var issue = {
	bindEvent:function(){
		$('.week_day').on('tap','li',function(){
			jQuery(this).toggleClass('active');
		});
		mui('.chooseDate').on('tap','.startDate',function() {
			var _self = this;
			if(_self.picker) {
				_self.picker.show(function (rs) {
					_self.innerText =  rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
			} else {
				var optionsJson = this.getAttribute('data-options') || '{}';
				var options = JSON.parse(optionsJson);
				_self.picker = new mui.DtPicker(options);
				_self.picker.show(function(rs) {
					_self.innerText = rs.text;
					_self.picker.dispose();
					_self.picker = null;
					date1 = _self.innerText;
					
				});
				_self.picker.setSelectedValue(date1);
			}
		}, false);
		mui('.chooseDate').on('tap','.endDate',function() {
			var _self = this;
			if(_self.picker) {
				_self.picker.show(function (rs) {
					_self.innerText =  rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
			} else {
				var optionsJson = this.getAttribute('data-options') || '{}';
				var options = JSON.parse(optionsJson);
				_self.picker = new mui.DtPicker(options);
				_self.picker.show(function(rs) {
					_self.innerText = rs.text;
					_self.picker.dispose();
					_self.picker = null;
					date2 = _self.innerText;
				});
				_self.picker.setSelectedValue(date2);
			}
		}, false);
		mui('.chooseTime').on('tap','.start_time',function() {
			var _self = this;
			if(_self.picker) {
				_self.picker.show(function (rs) {
					_self.innerText =  rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
				
			} else {
				var options = {
					"type":"time",
					"customData":{
						"i":[{"text":"15","value":"15"},{"text":"30","value":"30"},{"text":"45","value":"45"},{"text":"00","value":"00"}]
					}
				}
				_self.picker = new mui.DtPicker(options);
				_self.picker.show(function(rs) {
					_self.innerText = rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
			}
		}, false);
		mui('.chooseTime').on('tap','.end_time',function() {
			var _self = this;
			if(_self.picker) {
				_self.picker.show(function (rs) {
					_self.innerText =  rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
			} else {
				var options = {
					"type":"time",
					"customData":{
						"i":[{"text":"15","value":"15"},{"text":"30","value":"30"},{"text":"45","value":"45"},{"text":"00","value":"00"}]
					}
				}
				_self.picker = new mui.DtPicker(options);
				_self.picker.show(function(rs) {
					_self.innerText = rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
			}
		}, false);
		mui('.mui-content').on('tap','.issue',function(){
			
		})
	},
	init:function(){
		this.bindEvent();
	}
}
issue.init();
