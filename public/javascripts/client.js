function render(getJsonData) {
	// 一旦全部の会話を消去してから再描画する（暫定：力技）
	document.getElementById('area').innerHTML = '';
	// 受信したjsonデータを自分と相手に分けて描画する
	for (var i in getJsonData) {
		if (getJsonData[i].fromAddress == myid) {
			var cts = "";
			cts = "<div class='myText'>";

			if (getJsonData[i].message && !getJsonData[i].image) {
				cts += "  <div class='text'>" + getJsonData[i].message + "</div>";
				cts += "  <div class='date'>" + getJsonData[i].timeStamp + "</div>";
			}
			if (getJsonData[i].image && !getJsonData[i].message) {
				cts += "  <div class='imageData'><img src='" + getJsonData[i].image + "'  height='120px' width='140px' style='border-radius:5px;'/></div>";
				cts += "  <div class='imageDate'>" + getJsonData[i].timeStamp + "</div>";
			}
			if (getJsonData[i].image && getJsonData[i].message) {
				cts += "  <div class='text'>" + getJsonData[i].message + "</div>";
				cts += "  <div class='date'>" + getJsonData[i].timeStamp + "</div>";
				cts += "  <div class='imageData'><img src='" + getJsonData[i].image + "'  height='120px' width='140px' style='border-radius:5px;'/><div>";
				cts += "  <div class='textImageDate'>" + getJsonData[i].timeStamp + "</div>";
			}
			if (getJsonData[i].stampTitle) {
				cts += "  <div class='imageData'><img src='/files/stamps/" + getJsonData[i].stampTitle + ".png'  height='120px' width='120px'/></div>";
				cts += "  <div class='imageDate'>" + getJsonData[i].timeStamp + "</div>";
			}

			cts += "</div>";
			$('.contents').append(cts);

		} else {
			var cts = "";
			cts = "<div class='flText'>";
			// 友達IDからアイコン画像ファイル名を生成している
			if (fimage) {
				cts += "  <figure><img src='" + fimage + "'/></figure>";
			} else {
				cts += "  <figure><img src='/images/defaultFace.png'/></figure>";
			}
			cts += "  <div class='flText-text'>";
			if (getJsonData[i].message && !getJsonData[i].image) {
				cts += "  <div class='text'>" + getJsonData[i].message + "</div>";
				cts += "  <div class='date'>" + getJsonData[i].timeStamp + "</div>";
			}
			if (getJsonData[i].image && !getJsonData[i].message) {
				cts += "  <div class='imageData'><img src='" + getJsonData[i].image + "'  height='120px' width='140px' style='border-radius:5px;'/></div>";
				cts += "  <div class='imageDate'>" + getJsonData[i].timeStamp + "</div>";
			}
			if (getJsonData[i].image && getJsonData[i].message) {
				cts += "  <div class='text'>" + getJsonData[i].message + "</div>";
				cts += "  <div class='date'>" + getJsonData[i].timeStamp + "</div>";
				cts += "  <div class='imageData'><img src='" + getJsonData[i].image + "'  height='120px' width='140px' style='border-radius:5px;'/><div>";
				cts += "  <div class='textImageDate'>" + getJsonData[i].timeStamp + "</div>";
			}
			if (getJsonData[i].stampTitle) {
				cts += "  <div class='imageData'><img src='/files/stamps/" + getJsonData[i].stampTitle + ".png'  height='120px' width='120px'/></div>";
				cts += "  <div class='imageDate'>" + getJsonData[i].timeStamp + "</div>";
			}
			cts += "  </div>";
			cts += "</div>";
			$('.contents').append(cts);
		}
	}
	// 描画が終わったら画面下までスクロールさせる
	var obj = document.getElementById('area');
	obj.scrollTop = document.getElementById('area').scrollHeight;
}

// ポップアップ画面にスタンプをレンダリングする
function renderStamps(getJsonData) {

	for (var i in getJsonData) {
		var cts = "";
		cts += "<tr>";
		cts += "<td style='text-align: center;'>";
		cts += "<img src='/files/stamps/" + getJsonData[i] + "' class='stampImage' id='' height='50px' width='50px' style='border-radius: 100%;' onclick='pushStamp(this,event)'/>";
		cts += "</td>";
		cts += "<td style='text-align: center;'>";
		cts += "<label class='stampTitle'>" + getJsonData[i].replace(".png", ""); +"</label>";
		cts += "</td>";
		cts += " </tr>";
		$('.stampTable').append(cts);

	}


}
// スタンプデータをサーバーに送信します
function pushStamp(current, event) {
	event.preventDefault();
	$('#stampModalLong').modal('hide');
	pushMessage($(current).parent().parent().find('.stampTitle').text());
}

// getを行いjsonデータを受領して描画関数に渡す
function getMessages() {
	fetch('/api/messages?f1ID=' + f1id)
		.then((data) => {
			if (data.status != 200) {
				handleError(data);
			} else {
				return data.json()
			}
		})
		.then((json) => {
			var getJsonData = json;
			render(getJsonData);
		});
}
//エラーページにリダイレクト
function handleError(data) {
	if (data.status == 403) {
		window.location.href = '/errorpage?errorcode=' + data.status;
	} else {
		window.location.href = '/errorpage?errorcode=' + data.status;
	}
}

// 入力データをサーバーにポストする
function pushMessage(stampTitle) {
	document.getElementById('error').innerHTML = '';
	var text = $(".newMessage").val();
	var imageData = $(".imageData").val();
	var stampData = stampTitle;

	if (text != '' || imageData != '' || stampData != '') {
		fetch('/api/messages', {
			method: "POST",
			headers: { 'Content-Type': 'application/json', },
			body: JSON.stringify({ mess: text, image: imageData, stampLabel: stampData, f1ID: f1id }),
		})
			.then((data) => {
				if (data.status != 200) {
					handleError(data);
				}
				getMessages();
				// 入力領域をクリアする
				document.getElementById('inp').value = "";
			});

	}
}
$(function () {
	$("#upload-link").on('click', function (e) {
		e.preventDefault();
		$("#imageFiles").trigger('click');
	});

});

$(function () {
	$("#imageFiles").on("change", function (evt) {
		document.getElementById('error').innerHTML = '';
		var files = evt.target.files;
		if (files.length == 0) return;
		targetFile = files[0];
		if (!targetFile.type.match(/image/)) {
			document.getElementById("error").innerHTML = 'Select Image File';
			return;
		}
		var breader = new FileReader();
		breader.onload = readJPEGFile;
		breader.readAsBinaryString(targetFile);


	});
});

// 登録済みのすべてのスタンプを取得
function getStamps() {
	document.getElementById('error').innerHTML = '';
	fetch('/api/stamps')
		.then((data) => {
			if (data.status != 200) {
				handleError(data);
			} else {
				return data.json()
			}
		})
		.then((json) => {
			var getJsonData = json;
			renderStamps(getJsonData);
		});
}

function readJPEGFile(evt) {

	var bin = evt.target.result;
	var sigJFIF = String.fromCharCode(0x4A, 0x46, 0x49, 0x46, 0x00);
	var sigEXIF = String.fromCharCode(0x45, 0x78, 0x69, 0x66, 0x00);
	var head = bin.substr(6, 5);

	if (sigJFIF != head && sigEXIF != head) {
		document.getElementById("error").innerHTML = "Image file type should be JPEG";
		return;
	}

	var reader = new FileReader();
	reader.onload = function (e) {
		var image = new Image();
		image.src = reader.result;
		image.onload = function () {

			var height = this.height;
			var width = this.width;
			if (height > 1000 && width > 1000) {
				document.getElementById("error").innerHTML = 'Image file size should be less than 1000 x 1000';
				return;
			} else {
				$(".imageData").val(reader.result);
				pushMessage();
			}
		}
	}
	reader.readAsDataURL(targetFile);



}

// 3秒ごとに再描画のgetを行う
setInterval("getMessages()", 3000);

$(getMessages);