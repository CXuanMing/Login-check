var close = document.getElementById('Close')
var model = document.getElementById('model')
// 获取登录按钮
var login = document.getElementById("login");
// 提交按钮
var tijiao = document.getElementById('tijiao')
// 获取登录模态框
var model = document.getElementById("model");
var username = document.getElementById('username')
var password = document.getElementById('password')
var tips = document.getElementById('tips')

close.onclick = function() {
	model.className = 'hide';
}
login.onclick = function() {
	model.className = "";
}
// 定义锁
var username_lock = false;
var password_lock = false;
// 检测用户名
username.onblur = function() {
	// 获取用户输入
	var val = this.value;
	var result = Strategy.use('notEmpty', val);
	// 判断
	if (result) {
		tips.innerHTML = result;
		var username_lock = false;
		return
	}
	var result1 = Strategy.use('allEN', val);
	if (result1) {
		tips.innerHTML = result1;
		var username_lock = false;
		return
	}
	console.log("通过");
	var username_lock = true;
	$.ajax({
		url: "/checkName",
		data: {
			username: val
		},
		type: "get",
		dataType: "json",
		success: function(data) {
			console.log(data)
		}
	})
}
// 密码
password.onblur = function() {
	// 获取输入内容
	var val = this.value;
	// 判定是否有内容
	var result = Strategy.use("notEmpty", val);
	// 判定结果
	if (result) {
		tips.innerHTML = result;
		password_lock = false;
		return;
	}
	// 判定是否符合要求
	var result1 = Strategy.use("allEN", val);
	if (result1) {
		password_lock = false;
		tips.innerHTML = result1;
		return;
	}
	console.log("通过");
	password_lock = true;
}
// 提交点击事件
tijiao.onclick = function() {
	// 当用户名密码为true的时候发送ajax
	if (username_lock && password_lock) {
		$.ajax({
			url: "/login",
			data: $("form").serialize(),
			type: "post",
			dataType: "json",
			success: function(data) {
				console.log(data)
			}
		})
	}
}




// 封装登陆策略
var Strategy = (function() {
	var s = {
		// 用户名 必须是以字母开头，只能包含字母数字下划线和减号，6到10位
		"allEN": function(str) {
			var reg = /^[a-zA-Z]{6,10}$/;
			if (reg.test(str)) {
				console.log("sad")
				return ""
			}
			return "必须是英文字母，长度6~10"
		},
		// 邮箱 必须有@，前边最少2个字符，字母或数字开头，域名部分最少1位，后缀可以是一级也可以是二级，最少两位
		"email": function(str) {
			var reg = /^[a-z0-9]{1}[a-z0-9_-]{1,}@[a-z0-9]{1,}(\.[a-z]{2,})*\.[a-z]{2,}$/;
			if (reg.test(str)) {
				return '输入正确'
			}
			return "请输入正确的邮箱"
		},
		// 手机号
		"phone": function(str) {
			var reg = /^1[345678]{1}\d{9}$/;
			if (reg.test(str)) {
				return "输入正确"
			}
			return "请输入正确的手机号"

		},
		// 不能为空白
		"notEmpty": function(str) {
			var reg = /^\s*$/;
			if (reg.test(str)) {
				return '必须填写内容'
			}
			return ""
		}
	}
	return {
		// 调用
		use: function(type, str) {
				return s[type](str)
		},
		// 添加
		add: function() {

		}
	}
})()