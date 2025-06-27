/**
 * JavaScriptによる入力チェックを行います。
 * @return
 */
function inputCheck() {
	return variableInputCheck(checkContents);
}
/**
 * JavaScriptによる入力チェックを行います。
 * @param 入力チェックを行う変数名
 * @author yamamoto
 * @return
 */
function variableInputCheck(checkContents) {
	result = true;

	label : {
		for (i in checkContents) {
			document.getElementById(i).style.backgroundColor = "white";
			for (j in checkContents[i].Contents) {
				for (k in checkContents[i].Contents[j]) {
					var msg = this[k](i
									, checkContents[i].FieldName
									, checkContents[i].Contents[j][k]);
					if (msg != "") {
						alert(msg);
						document.getElementById(i).focus();
						document.getElementById(i).style.backgroundColor = "lightpink";

						result = false;
						break label;
					}
				}
			}
		}
	}
	return result;
}
/**
 * 入力必須チェックを行います。
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function requiredCheck(fieldID, fieldName, option) {
	var msg = "";
	if (0 == document.getElementById(fieldID).value.length) {
		msg = fieldName + "を入力してください。";
	}
	return msg;
}

/**
 * 数値チェックを行います。
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function numberCheck(fieldID, fieldName, option) {
	var msg = "";
	if (isNaN('0' + document.getElementById(fieldID).value + '0')) {
		msg = fieldName + "は数値を入力してください。";
	}
	return msg;
}

/**
 * 入力文字数チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function exact_lengthCheck(fieldID, fieldName, option) {
	var msg = "";
	var val = document.getElementById(fieldID).value;
	if (val != ""){
		if (option != val.length) {
			msg = fieldName + "は" + option + "文字で入力してください。";
		}
	}
	return msg;
}

/**
 * 最小文字数チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function min_lengthCheck(fieldID, fieldName, option) {
	var msg = "";
	var val = document.getElementById(fieldID).value;
	if (val != ""){
		if (val.length < option) {
			msg = fieldName + "は" + option + "文字以上で入力してください。";
		}
	}
	return msg;
}

/**
 * 最大文字数チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function max_lengthCheck(fieldID, fieldName, option) {
	var msg = "";
	var val = document.getElementById(fieldID).value;
	if (val != ""){
		if (val.length > option) {
			msg = fieldName + "は" + option + "文字以下で入力してください。";
		}
	}
	return msg;
}

/**
 * 最大文字数チェック(改行除く)
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function max_lengthCheck_CRLF(fieldID, fieldName, option) {
	var msg = "";
	var mojiVal = document.getElementById(fieldID).value;
	var val = mojiVal.replace(/\n|\r\n/g,"");

	if (val != ""){
		if (val.length > option) {
			msg = fieldName + "は" + option + "文字以下で入力してください。";
		}
	}
	return msg;
}

/**
 * 半角英字チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function alphaCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^([a-z])+$/i;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は半角アルファベットを入力してください。";
	    }
	}
	return msg;
}

/**
 * 半角英数字チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function alpha_numericCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^([a-z0-9])+$/i;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は半角英数字を入力してください。";
	    }
	}
	return msg;
}

/**
 * 半角英数ダッシュチェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function alpha_dashCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^([-a-z0-9_-])+$/i;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は半角英数字、アンダースコア(_)、ハイフン(-)以外は入力できません。";
	    }
	}
	return msg;
}

/**
 * 整数チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function integerCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^[\-+]?[0-9]+$/;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は数字を入力してください。";
	    }
	}
	return msg;
}

/**
 * 自然数チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function is_naturalCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^[0-9]+$/;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は数字を入力してください。";
	    }
	}
	return msg;
}

/**
 * 0以外自然数チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function is_natural_no_zeroCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^[0-9]+$/;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex) || val == 0) {
	    	msg = fieldName + "は0より大きい数字を入力してください。";
	    }
	}
	return msg;
}

/**
 * 数字ハイフンチェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function zip_Check(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^([0-9-])+$/i;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は数字、ハイフン(-)以外は入力できません。";
	    }
	}
	return msg;
}


/**
 * base64チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_base64Check(fieldID, fieldName, option) {
	var msg = "";
	var regex = /[^a-zA-Z0-9\/\+=]/;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は入力内容に誤りがあります。";
	    }
	}
	return msg;
}

/**
 * 日付の妥当性チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_dateCheck(fieldID, fieldName, option) {
	var msg = "";
	var base = fieldID.split("_");
	var sy = document.getElementById(base[0] + "_1").value;
	var sm = document.getElementById(base[0] + "_2").value;
	var sd = document.getElementById(base[0] + "_3").value;
	var y = parseInt(sy);
	var m = parseInt(sm,10);
	var d = parseInt(sd,10);
	var di = new Date(y,m-1,d);
	if (sy == ""
		&& sm == ""
		&& sd == ""){
	}else{
		if(di.getFullYear() != y || di.getMonth() != m-1 || di.getDate() != d){
	    	msg = fieldName + "に正しい日付を入力してください。";
	    }
	}
	return msg;
}

/**
 * 日付の必須チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function date_requireCheck(fieldID, fieldName) {
	var msg = "";
	var base = fieldID.split("_");
	var sy = document.getElementById(base[0] + "_1").value;
	var sm = document.getElementById(base[0] + "_2").value;
	var sd = document.getElementById(base[0] + "_3").value;

	if (sy == ""
		&& sm == ""
		&& sd == ""){
	  	msg = fieldName + "を指定して下さい。";
	}

	return msg;
}

/**
 * 選択必須チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function radio_requiredCheck(fieldID, fieldName, option) {
	var msg = fieldName + "を選択してください。";
	var radioList = document.getElementsByName(fieldID);
	for(var i=0; i<radioList.length; i++){
		if (radioList[i].checked) {
			msg = "";
			break;
		}
	}
	return msg;
}

/**
 * チェックボックス必須チェックを行います。
 * @param fieldID
 * @param fieldName
 * @param option[]
 * @return
 */
function checkbox_requiredCheck(fieldID, fieldName, option) {
	var msg = fieldName + "を選択してください。";
	var base = fieldID.split("_");
	for(var i=1; i<=option; i++){
		var field = base[0] + "_" + i;
		if (document.getElementById(field).checked) {
			msg = "";
			break;
		}
	}
	return msg;
}

/**
 * メールアドレスチェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_emailCheck(fieldID, fieldName, option) {
	var msg = "";
	var base = fieldID.split("_");
	var regex = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
	var add1 = document.getElementById(base[0] + "_1").value;
	var add2 = document.getElementById(base[0] + "_2").value;
	var val = add1 + "@" + add2;
	if (!(add1 == "" && add2 == "")){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は正しいEmailアドレスを入力してください。";
	    }
	}
	return msg;
}

/**
 * 比較チェック
 * @param fieldID
 * @param fieldName
 * @param option[比較元,比較先]
 * @return
 */
function matchesCheck(fieldID, fieldName, option) {
	var msg = "";
	var val = document.getElementById(option[0]).value;
	var confval = document.getElementById(option[1]).value;
    if (val != confval) {
    	msg = fieldName + "が異なっています。";
    }
	return msg;
}

/**
 * リストボックス両選択チェック
 * TODO
 * 		選択されたリストボックスが両方選択された時のエラーチェック
 * @param fieldID
 * @param fieldName
 * @param option[比較元,比較元フィールド名]
 * @return
 */
function hojin_valueCheck(fieldID, fieldName, option) {
	var msg = "";
	if(document.getElementById(fieldID).value.length > 0)
	{
		if(document.getElementById(option[0]).value.length > 0)
		{
    		msg = "前法人格と後法人格を両方指定することはできません。";
    	}
    }
	return msg;
}

/**
 * リストボックス選択時文字入力チェック
 * TODO
 * 		リストボックス選択時に対象が未入力の時のエラーチェック
 * @param fieldID
 * @param fieldName
 * @param option[比較元1,比較元2]
 * @return
 */
function kaisha_valueCheck(fieldID, fieldName, option) {
	var msg = "";
	if(document.getElementById(option[0]).value.length > 0 || document.getElementById(option[1]).value.length > 0)
	{
		if(document.getElementById(fieldID).value.length == 0)
		{
    		msg = fieldName + "が未入力です。";
    	}
    }
	return msg;
}

/**
 * 全角チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function zenkakuCheck(fieldID, fieldName, option) {
	var msg = "";
	var val = document.getElementById(fieldID).value;
	for(var i=0; i < val.length; i++){
		if(escape(val.charAt(i)).length < 4){
		    msg = fieldName + "は全角で入力してください。";
		}
	}
	return msg;
}

/**
 * メールアドレス用文字数チェック
 * @param fieldID
 * @param fieldName
 * @param option	最大文字数
 * @return
 */
function email_max_lengthCheck(fieldID, fieldName, option) {
	var msg = "";
	var base = fieldID.split("_");
	var add1 = document.getElementById(base[0] + "_1").value;
	var add2 = document.getElementById(base[0] + "_2").value;
	var val = add1 + "@" + add2;
	if (!(add1 == "" && add2 == "")){
	    if (val.length > option) {
	    	msg = fieldName + "は半角" + option + "文字以内で入力してください。";
	    }
	}
	return msg;
}

/**
 * 時間チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_require_time(fieldID, fieldName, option) {
	var msg = "";
	var add1 = document.getElementById(fieldID + "_1").value;
	var add2 = document.getElementById(fieldID + "_2").value;

	if (add1 == "" || add2 == ""){
		msg = fieldName + "を指定して下さい";
	}
	return msg;
}

/**
 * 時間チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_time(fieldID, fieldName, option) {
	var msg = "";
	var add1 = document.getElementById(fieldID + "_1").value;
	var add2 = document.getElementById(fieldID + "_2").value;

	if (add1 != "" && add2 == ""){
		msg = fieldName + "の時間を正しく指定して下さい";
	}

	if (add1 == "" && add2 != ""){
		msg = fieldName + "の時間を正しく指定して下さい";
	}

	return msg;
}

/**
 * 日付の整合性チェック
 * @param fieldID
 * @param fieldName
 * @param option[比較元1,比較元2]
 * @return
 */
function valid_date_consistency_Check(fieldID, fieldName, option) {
	var msg = "";
	var base1 = option[0].split("_");
	var base2 = option[1].split("_");
	var sy = document.getElementById(base1[0] + "_1").value;
	var sm = document.getElementById(base1[0] + "_2").value;
	var sd = document.getElementById(base1[0] + "_3").value;
	var ey = document.getElementById(base2[0] + "_1").value;
	var em = document.getElementById(base2[0] + "_2").value;
	var ed = document.getElementById(base2[0] + "_3").value;
	if (sy == ""
		&& sm == ""
		&& sd == ""
		&& ey == ""
		&& em == ""
		&& ed == ""){
	}else{
		var sday = sy + sm + sd;
		var eday = ey + em + ed;
		if(sday > eday){
	    	msg = "終了日が開始日より前の日付となっています。";
	    }
	}
	return msg;
}

/**
 * 掲載期間チェック
 * @param fieldID
 * @param fieldName
 * @param option[日付,比較元]
 * @return
 * @author kubota 2009.12.15
 */
function vaild_period_Check(fieldID, fieldName, option) {
	var msg = "";
	var base1 = fieldID.split("_");
	var base2 = option[0].split("_");
	var kikan = document.getElementById(option[1]).value;
	var year1 = document.getElementById(base1[0] + "_1").value;
	var month1 = document.getElementById(base1[0] + "_2").value;
	var day1 = document.getElementById(base1[0] + "_3").value;
	var year2 = document.getElementById(base2[0] + "_1").value;
	var month2 = document.getElementById(base2[0] + "_2").value;
	var day2 = document.getElementById(base2[0] + "_3").value;
	if (year1 == ""
		&& month1 == ""
		&& day1 == ""
		&& year2 == ""
		&& month2 == ""
		&& day2 == ""){
	}else{
		var dt2 = new Date(year1, month1 - 1, day1);
	    var dt1 = new Date(year2, month2 - 1, day2);
	    var diff = dt1 - dt2;
	    var inp_kikan = diff / 86400000;//1日は86400000ミリ秒

		if(inp_kikan < 0){
			inp_kikan = inp_kikan * -1;
		}
	    var inp_kikan = inp_kikan+1;

		// +1をしないと、日付の差に支障が出るため　修正：2009/12/18
		if((inp_kikan) < kikan){
	    	msg = "掲載期間が掲載単位未満になっています。";
	    }
	}
	return msg;
}

/**
 * 最大期間チェック
 * @param fieldID
 * @param fieldName
 * @param option[日付1,日付2,最大期間]
 * @return
 * @author omura 2009.12.15
 */
function vaild_dateCompare(fieldID1,fieldID2) {
	var msg = "";

	var year1 = document.getElementById(fieldID1 + "_1").value;
	var month1 = document.getElementById(fieldID1 + "_2").value;
	var day1 = document.getElementById(fieldID1 + "_3").value;
	var year2 = document.getElementById(fieldID2 + "_1").value;
	var month2 = document.getElementById(fieldID2 + "_2").value;
	var day2 = document.getElementById(fieldID2 + "_3").value;
	if (year2 == "" &&
		month2 == "" &&
		day2 == ""){
	}else{
		var dt1 = new Date(year1, month1 - 1, day1);
	    var dt2 = new Date(year2, month2 - 1, day2);


		if(dt1 >= dt2){
	    	msg = "公開日より有効期限を後にして下さい。";
	    }
	}
	return msg;
}

/**
 * 日付がチェック
 * TODO
 * 		掲載開始日が当日より前かチェックする
 * @param fieldID
 * @param fieldName
 * @param option    システム日付
 * @return
 * @author kubota 2009.12.15
 */
function vaild_kaishiCheck(fieldID, fieldName, option) {
	var msg = "";
	var base1 = fieldID.split("_");
	var sysday = document.getElementById(option).value;
	var sy = document.getElementById(base1[0] + "_1").value;
	var sm = document.getElementById(base1[0] + "_2").value;
	var sd = document.getElementById(base1[0] + "_3").value;

	if (sy == ""
		&& sm == ""
		&& sd == ""){
	}else{
		var sday = sy + sm + sd;
		var a = sysday.split(".");

		var nowday = a[0] + a[1] + a[2];

		if(sday < nowday){
	    	msg = fieldName + "が当日より前の日付になっています。";
	    }
	}
	return msg;
}

/**
 * バイト数チェック
 * @param fieldID
 * @param fieldName
 * @return
 * @author omura 2009.12.16
 */
function max_byteCheck(fieldID, fieldName, option){
	var msg = "";
    var ret = 0;
    var val = document.getElementById(fieldID).value;
    for (var i = 0; i < val.length; i++) {
        var c = val.charCodeAt(i);
        // Shift_JIS: 0x0 - 0x80, 0xa0  , 0xa1   - 0xdf  , 0xfd   - 0xff
        // Unicode  : 0x0 - 0x80, 0xf8f0, 0xff61 - 0xff9f, 0xf8f1 - 0xf8f3
        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            ret += 1;
        } else {
            ret += 2;
        }
    }
    if(ret > option){
    	msg = fieldName + "は全角" + option/2 + "文字(半角" + option + "文字)以内で入力してください。";
    }
    return msg;
}

/**
 * 複数フィールド必須入力チェック(すべてNULLは許可)
 * @param fieldID
 * @param fieldName
 * @param option チェックするフィールド数
 * @return
 * @author yamamoto 2009.12.24
 */
function multiRequiredCheck(fieldID, fieldName, option){
	var msg = "";
	var base1 = fieldID.split("_");
	var cnt = 0;
	var field_nmae = "";
	var field = "";
	for(var i = 1; i <= option; i++){
		field_nmae = base1[0] + "_" + i;
		field = document.getElementById(field_nmae).value;
		if(field != ""){
			cnt = cnt + 1;
		}
	}
	if(cnt != 0 && cnt != option){
		msg = fieldName + "を入力してください。";
	}
    return msg;
}


/**
 * URLチェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_urlCheck(fieldID, fieldName, option) {
	var msg = "";
	var base = fieldID.split("_");
	var regex = /^(http|HTTP|ftp)(s|S)?:\/\/+[A-Za-z0-9]+\.[A-Za-z0-9]/;
	var val = document.getElementById(fieldID).value;
	if (!(val == "")){
	    if (!val.match(regex)) {
	    	msg = fieldName + "は正しいURLを入力してください。";
	    }
	}
	return msg;
}

/**
 * ログインIDのチェック
 * mailアドレス＠で区切らないもの
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_idCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
	var val = document.getElementById(fieldID).value;
	if (val != '') {
    	if (!val.match(regex)) {
    		msg = fieldName + "は正しいEmailアドレスを入力してください。";
    	}
    }
	return msg;
}

/**
 * 行数チェック
 * @param fieldID
 * @param fieldName
 * @param option  [0]:1行の文字数
 *                [1]:許可行数
 *                [2]:行数カウント方法の判別
 *                    値あり⇒matchを使用(空白行をカウントできる。)
 *                    値なし⇒splitを使用(空白行をカウントできない。)
 * @return
 * @author omura 2009.12.16
 */
function multi_lineCheck(fieldID, fieldName, option){
	var msg = "";
	var ret = 0;
	var val = document.getElementById(fieldID).value;
	line_data = val.split(/(\n|\r)+/g);

	for(var j = 0; j < line_data.length; j++){
		ret = 0;
		for (var i = 0; i < line_data[j].length; i++) {
			//var c = val.charCodeAt(i); //2010.04.06 chg fuka
			var c = line_data[j].charCodeAt(i);
			if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
				ret += 1;
			} else {
				ret += 2;
			}
		}
		if(ret > option[0]){
			msg = fieldName + "は1行" + Math.floor(option[0]/2) + "文字(半角" + option[0] + "文字)以内で入力してください。";
			break;
		}
	}

	if(msg == ""){
		var count_line = 0;
		//add 2010.04.01 fuka カウント方法の変更
		if(option[2]){
			var n = val.match(/\r/g);
			if(n){
				count_line = n.length + 1;
			}else{
				var n2 = val.match(/\n/g);
				if(n2){
					count_line = n2.length + 1;
				}else{
					count_line = 1;
				}
			}
		}else{
			for(i = line_data.length - 1; i >= 0; i--){
				var h_line_date = line_data[i].replace(/(\n|\r)+/g, '');
				if(h_line_date != ""){
					count_line += 1;
				}
			}
		}
		if(count_line > option[1]){
			msg = fieldName + "は" + option[1] + "行以内で入力してください。";
		}
	}
	return msg;
}

/**
 * ひらがなチェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function hiraganaCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^([ぁ-んー 　])+$/i;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "はひらがなを入力してください。";
	    }
	}
	return msg;
}

/**
 * カタカナチェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function katakanCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /^([ァ-ヶー 　])+$/i;
	var val = document.getElementById(fieldID).value;
	if (val != ""){
	    if (!val.match(regex)) {
	    	msg = fieldName + "はカタカナを入力してください。";
	    }
	}
	return msg;
}


/**
 * 日付の妥当性チェック(年月のみも可)
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_yearsCheck(fieldID, fieldName, option) {
	var msg = "";
	var base = fieldID.split("_");
	var sy = document.getElementById(base[0] + "_1").value;
	var sm = document.getElementById(base[0] + "_2").value;
	var sd = document.getElementById(base[0] + "_3").value;
	var y = parseInt(sy);
	var m = parseInt(sm,10);
	var d = parseInt(sd,10);
	if(sd == ""){
		var di = new Date(y,m-1);
	}else{
		var di = new Date(y,m-1,d);
	}
	if (sy == ""
		&& sm == ""
		&& sd == ""){
	}else if(sy != ""
			&& sm != ""
			&& sd == ""){
		if(di.getFullYear() != y || di.getMonth() != m-1){
			msg = fieldName + "に正しい日付を入力してください。";
	    }
	}else{
		if(di.getFullYear() != y || di.getMonth() != m-1 || di.getDate() != d){
			msg = fieldName + "に正しい日付を入力してください。";
	    }
	}
	return msg;
}

/**
 * 求人広告概要画面での画像チェック
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function gazo_check(fieldID, fieldName, option) {
	var msg = "";
	var gazo = document.getElementById(fieldID).value;
	var gazo_data = document.getElementById(option[0]).value;
	var free_gazo = document.getElementById(option[1]).value;

	if(gazo == '' && gazo_data == '' && free_gazo == '')
	{
		msg = "画像を選択してください。";
	}

	return msg;
}

function checkExtention(fieldID,fieldName,option) {

	var msg = "";

	var fileName = document.getElementById(fieldID).value;

	if (!fileName) {
	  return msg;
	}

	var fileTypes = fileName.split(".");
	var len = fileTypes.length;
	if (len === 0) {
	  return msg;
	}
	ret = fileTypes[len - 1];
	if (option.indexOf(ret.toLowerCase()) == -1) {
		msg = "[" + fieldName + "]ファイルの拡張子が違います。\n";
		msg = msg + "許可されている拡張子は" + option + "です。";
	}

	return msg;
}

/**
 * カラーコードチェック
 * #dddddd
 * @param fieldID
 * @param fieldName
 * @param option
 * @return
 */
function valid_colorCheck(fieldID, fieldName, option) {
	var msg = "";
	var regex = /#[a-zA-Z0-9]/i;
	var val = document.getElementById(fieldID).value;
	if (val != '') {
    	if (!val.match(regex)) {
    		msg = fieldName + "は色を指定してください。";
    	}
    }
	return msg;
}
