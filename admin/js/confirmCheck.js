/**
 * JavaScriptによる共通チェックを行います。
 * @return
 */

/**
 * 登録する等の確認メッセージを表示します。
 */
function registConfirm() {
	result = false;
	if(window.confirm('登録してよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 登録する等の確認メッセージを表示します。
 */
function shitagakiConfirm() {
	result = false;
	if(window.confirm('下書き(ステータス:非公開)保存します。よろしいですか？')){
		return true;
	}
	return result;
}

/**
 * 登録する等の確認メッセージを表示します。
 */
function compConfirm() {
	result = false;
	if(window.confirm('編集完了として保存します。よろしいですか？')){
		return true;
	}
	return result;
}

/**
 * 削除する等の確認メッセージを表示します。
 */
function deleteConfirm() {
	result = false;
	if(window.confirm('削除してよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * メールを送信する等の確認メッセージを表示します。
 */
function address_mailConfirm() {
	result = false;
	if(window.confirm('入力されたメールアドレスにメールを送信します。\nよろしいですか?')){
		return true;
	}
	return result;
}


/**
 * メールを送信する等の確認メッセージを表示します。
 */
function mailConfirm() {
	result = false;
	if(window.confirm('対象者へメールが送信されます。\nよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 変更する等の確認メッセージを表示します。
 */
function updateConfirm() {
	result = false;
	if(window.confirm('変更してよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 取り消し等の確認メッセージを表示します。
 */
function backoutConfirm() {
	result = false;
	if(window.confirm('取消してよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 初期化状態に戻す等の確認メッセージを表示します。
 */
function initializationConfirm() {
	result = false;
	if(window.confirm('データは初期化状態に戻ります。\nよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 閉じる等の確認メッセージを表示します。
 */
function closeConfirm() {
	result = false;
	if(window.confirm('ウィンドウを閉じます。\n入力データは反映されません。よろしいですか?')){
		return true;
	}
	return result;
}

/**
 * キャンセル等の確認メッセージを表示します。
 */
function cancelConfirm() {
	result = false;
	if(window.confirm('キャンセルしてよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 送付区分の変更の確認メッセージを表示します。
 */
function soufuConfirm() {
	result = false;
	if(window.confirm('送付区分を送付済に変更します。\nよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 上記の内容で購入する等の確認メッセージを表示します。
 */
function checkbuyConfirm() {
	result = false;
	if(window.confirm('上記の内容で購入します。\nよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 入力された情報は削除されます等の確認メッセージを表示します。
 */
function agreement_cancelConfirm() {
	result = false;
	if(window.confirm('入力された情報は削除されます。\nよろしいですか?')){
		return true;
	}
	return result;
}

/**
 * 入力された情報は削除されます等の確認メッセージを表示します。
 */
function agreement_nendoConfirm() {
	result = false;
	if(window.confirm('年度更新を実行すると元に戻せません。\nよろしいですか?')){
		return true;
	}
	return result;
}
