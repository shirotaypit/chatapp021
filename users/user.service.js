var bcrypt = require('bcryptjs');

const db = require('../_helpers/db');
const User = db.User;
const saltRounds = 10;

module.exports = {
     create
 };

// ユーザーモデルを作成し、データベースに保存する
function create(userParam) {

    const user = new User();
	user.nickName = userParam.nickName;
	// 画像はオプションです。デフォルト画像を使用して選択されていません
	if(userParam.ufile){
		user.userImage=userParam.ufile;

	}
    if (userParam.passCode) {
		// ハッシュパスコードを保存する
        user.passCode = bcrypt.hashSync(userParam.passCode, bcrypt.genSaltSync(saltRounds));
    }
    // save user
     user.save();

}

function getById(id) {
    return User.findById(id).select('-hash');
}


