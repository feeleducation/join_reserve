$('form').submit(function (event) {
    const form = document.forms[0];
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        if (!(form.classList.contains("was-validated"))) {
            form.classList.add("was-validated");
        }
        return false;
    }

    if (window.confirm('フォームを送信しますか？')) {
    }
    else {
        return false; // 「キャンセル」なら送信しない
    }

    const date = $('select[name="date"]').val();
    const parentName = $('input[name="parent-name"]').val();
    const remarks = $('textarea[name="remarks"]').val();

    const grade = [$('select[name="grade2"]').val(), $('select[name="grade3"]').val(), $('select[name="grade4"]').val()];
    const name = [$('input[name="name2"]').val(), $('input[name="name3"]').val(), $('input[name="name4"]').val()];
    let grade_name = ($('select[name="grade1"]').val() + "・" + $('input[name="name1"]').val() + "\n");
    for(let i=0; i<3; i++){
        if(grade[i]){
            grade_name += grade[i] + "・" + name[i] + "\n";
        }
    }

    let sendText = "【理科実験教室参加申込】\n\n" +
                   "○参加される日程：\n" + date + "\n" +
                   "○保護者様の氏名：\n" + parentName + "\n" +
                   "○お子様の学年・氏名：\n" + grade_name +
                   "○備考：\n" + remarks;
    
    sendMessage(sendText);
    return false;
});



function sendMessage(sendText) {
    liff.sendMessages([
        {
            type: 'text',
            text: sendText
        }
    ])
    .then(() => {
        // window.alert('メッセージを送信しました');
        console.log('Message Sending success', 'text: ' + sendText);
        liff.closeWindow();
    })
    .catch((error) => {
        console.log('message sending failed ', error, 'text: ' + sendText);
        window.alert('フォームの送信に失敗しました： ' + error + "\nもう1度お試しください。改善されないようでしたらチャットにてお問い合わせください。");
    });
}

const params = (new URL(document.location)).searchParams;
const key = params.get('key');



$(document).ready(function () {
    const liffId = "2005901176-7naRRXkN"; //LIFF IDを入力
    console.log(`init liff, ID : ${liffId}`);
    initializeLiff(liffId);
    
    canAccept();
})

const http = new XMLHttpRequest();
http.onreadystatechange = function() {
    switch ( http.readyState ) {
        case 0:
            // 未初期化状態.
            console.log( 'uninitialized!' );
            break;
        case 1: // データ送信中.
            console.log( 'loading...' );
            break;
        case 2: // 応答待ち.
            console.log( 'loaded.' );
            break;
        case 3: // データ受信中.
            console.log( 'interactive... '+http.responseText.length+' bytes.' );
            break;
        case 4: // データ受信完了.
            if( http.status == 200 || http.status == 304 ) {
                var data = http.responseText; // responseXML もあり
                console.log( 'COMPLETE! :'+data );
                if(Number(data) == 0){
                    window.alert("今回の理科実験教室は申込者数が定員に達したため、参加申込を終了しました。申し訳ありません。\n次回以降の参加をお待ちしております。\nご質問等がありましたら、LINEのチャットにてお願いします。");
                    liff.closeWindow();
                    return value;
                }
            } else {
                console.log( 'Failed. HttpStatus: '+http.statusText );
            }
            break;
    }
};

function canAccept () {
    // const http = new XMLHttpRequest();
    //const url = "https://script.google.com/macros/s/AKfycbys8WyK6y4vLZeFs8efM4uXyQ0-aoVc2Fk4xH295MqMRYzP0Jw-E6i4q8WXxvrZsuikLg/exec"; //  + "?name=" + eventName;
    const url = "https://script.google.com/macros/s/AKfycbw4TMuwhkcXIAHxOL1hp87XtCv6PzY7kCMieJ2xLAr-kbrEHcMllIrm_8xGYHec_K2IGg/exec";
    http.open("GET", url);
    http.responseType = "text";
    http.send();
}

function initializeLiff(liffId) {
    liff
        .init({
            liffId: liffId
        })
        .then(() => {
            // Webブラウザからアクセスされた場合は、LINEにログインする
            if (!liff.isInClient() && !liff.isLoggedIn()) {
                window.alert("LINEアカウントにログインしてください。");
                liff.login({ redirectUri: location.href });
            } else {
                console.log('Login Success');
            }
        })
        .catch((err) => {
            console.log('LIFF Initialization failed ', err);
        });
}

function childRequired(field, pairId){
    const pairField = document.getElementById(pairId);
    if(field.value.length > 0 || pairField.value.length > 0) {
        console.log("required set", field.id, pairId);
        field.setAttribute("required", true);
        pairField.setAttribute("required", true);
    }
    else {
        console.log("required remove", field.id, pairId);
        field.removeAttribute("required");
        pairField.removeAttribute("required");
    }
}
