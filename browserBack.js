/**
 * ブラウザのバックボタンを無効化する。
 * iPad Safariの場合はページのリロードを行う。
 * 【制約事項】
 * ・ブラウザがhistory APIおよびaddEventListnerに対応していない場合は機能しない
 * ・iOS Safariは戻るボタン押下後にページの内のconfirmダイアログが起動しなくなるバグがある。
 *   そのため、暫定措置としてエラーページに遷移させる。
 */
$(function() {
    // iPad safariの履歴上限数30
    var browserBackHistCount = 30;
    var errTitle = 'システムエラー';
    var errMessage1 = 'ブラウザの戻るボタンは使用できません。';
    var errMessage2 = '閉じるボタンを押して終了し、トップ画面から再度ご利用ください。'

    // history APIの利用可否を確認
    if (window.history && window.history.pushState) {
        history.pushState('dummy', null, null);
        // popstateイベントハンドラを設定
        $(window).off('popstate');
        $(window).on('popstate', function(event){
            // 履歴上限数+1分追加
            alert('popstate1')
            for (var i = 0; i <= browserBackHistCount; i++) {
                history.pushState('dummy', null, null);
            }

            // iOS Safariのバグ回避のため、戻るボタン押下時にはエラーページに遷移する
            if (typeof(browsertype) !== 'undefined' && browsertype == 'safari'){
                // エラーページの場合は何もしない
                if (location.pathname.indexOf('AIASP.xhtml') == -1) {

                    // エラーページ用のパラメータ設定
                    var compKind = 0;
                    var systemType = '-';
                    // 事業会社(画面により変数名が異なる）
                    if (typeof companyKind !== 'undefined') {
                        compKind = companyKind;
                    } else if (typeof companykind !== 'undefined') {
                        compKind = companykind;
                    }
                    if (compKind == 1) {
                        systemType = 'MS';
                    } else if (compKind == 2) {
                        systemType = 'AD';
                    }
                    // ユーザID
                    var uid = '-';
                    var urlparams = encodeURI('SYSTEM_TYPE='  + systemType +
                                    '&ERROR_TITLE=' + errTitle +
                                    '&ERROR_MSG='   + errMessage1 + '</br>' + errMessage2 +
                                    '&ERROR_USERID=' + uid +
                                    '&BROWSERTYPE=' + browsertype +
                                    '&MOBILETYPE=' + mobiletype);

                    // 遷移
                    window.top.location.href = '../AIASP.xhtml?' + urlparams;
                }
            }
            return false;
        });
    }
});