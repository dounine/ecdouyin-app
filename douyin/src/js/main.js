/**
 * 常用JS变量:
 * agentEvent = 代理模式下自动点击模块
 * acEvent= 无障碍模式下自动点击模块
 * device = 设备信息模块
 * file = 文件处理模块
 * http = HTTP网络请求模块
 * shell = shell命令模块
 * thread= 多线程模块
 * image = 图色查找模块
 * utils= 工具类模块
 * global = 全局快捷方式模块
 * 常用java变量：
 *  context : Android的Context对象
 *  javaLoader : java的类加载器对象
 * 导入Java类或者包：
 *  importClass(类名) = 导入java类
 *      例如: importClass(java.io.File) 导入java的 File 类
 *  importPackage(包名) =导入java包名下的所有类
 *      例如: importPackage(java.util) 导入java.util下的类
 *
 */

function downloadQrcode(url) {
    logd('download qrcode from -> ' + url);
    let downloadPath = "/sdcard/DCIM/scan.png"
    file.deleteAllFile(downloadPath)
    let downStatus = http.downloadFile(
        url,
        downloadPath,
        3000
    )
    logd("download status -> " + downStatus);
    sleep(1000)
    let insertImage = utils.insertImageToAlbum(downloadPath);
    logd("insert image to album -> " + insertImage);
}

function clearQrcode() {
    let downloadPath = "/sdcard/DCIM/scan.png"
    file.deleteAllFile(downloadPath)
}

function getPageData(page) {
    return JSON.stringify({
        "type": "sync",
        "data": {
            "page": page
        }
    })
}

function stopAndStart() {
    clearQrcode()
    shell.stopApp("com.tencent.mm")
    utils.openApp("com.tencent.mm")
}

function main() {
    //开始再这里编写代码了！！
    // toast("Hello World");
    // var name = readConfigString("name");
    // logd("姓名: " + name);
    // logd("年龄: " + readConfigString("age"));
    // logd("听音乐: " + readConfigString("music"));
    // logd("是不是一年级: " + readConfigString("one"));
    // logd("备注: " + readConfigString("mark"));
    // //如果自动化服务正常
    // if (!autoServiceStart(3)) {
    //     logd("自动化服务启动失败，无法执行脚本")
    //     exit();
    //     return;
    // }
    // logd("开始执行脚本...")
    // home();
    // downloadQrcode('http://192.168.0.97:30000/file/image?path=/tmp/ec/2021-05-08/screen_7765738843915052813_04E663DA37D1F6F581567CA36EA607FC.jpg')

    // let payFinishButton = text("完成")
    // let payFinishButtonExit = waitExistNode(payFinishButton, 3 * 1000)
    // if (payFinishButtonExit) {
    //     click(payFinishButton)
    // }

    // 输入密码
    // let node = index(1).depth(13).drawingOrder(2).getOneNodeInfo(1000)
    // clickPoint(node.bounds.left - 10, node.bounds.top) //1按键
    // clickPoint(node.bounds.left + 10, node.bounds.top) //2按键
    // logd(getRunningActivity());
    // shell.stopApp("com.tencent.mm")
    // utils.openApp("com.tencent.mm")
    // sleep(3 * 1000)
    // let fanxianSelector = text("发现")
    // let fanxianExit = waitExistNode(fanxianSelector, 3 * 1000)
    // if (fanxianExit) {
    //     click(fanxianSelector)
    // }
    // utils.openActivity({
    //     "pkg":"com.tencent.mm",
    //     "className":"com.tencent.mm.ui.LauncherUI"
    // })
    // shell.execCommand("am start -n com.tencent.mm/com.tencent.mm.plugin.scanner.ui.BaseScanUI")
    // let downloadPath = "/sdcard/DCIM/scan.png"
    // file.deleteAllFile(downloadPath)

    // let payPageSelector = text("请输入支付密码")
    // let payPageExit = waitExistNode(payPageSelector, 3 * 1000)
    // logd('ff '+payPageExit);
    //
    // let passwordButton = index(1).depth(13).drawingOrder(2)
    //     .clz("android.widget.ImageView")
    //     .getOneNodeInfo(3 * 1000)
    // // logd("支付输入密码 " + JSON.stringify(passwordButton));
    // clickPoint(passwordButton.bounds.left - 10, passwordButton.bounds.top) //1按键
    //
    // if (true) return

    let result = [];
    // var ws = http.newWebsocket("ws://192.168.0.97:30000/mechine/hello", null);
    var ws = http.newWebsocket("wss://ecdy.61week.com/mechine/hello", null);
    //设置连接打开的时候监听器
    ws.onOpen(function (ws1, code, msg) {
        logi("onOpen code " + code + "  msg:" + msg);
    })
    //设置有文本信息监听器
    ws.onText(function (ws1, dataText) {
        logi(" onText " + dataText);
        let data = JSON.parse(dataText)
        if (data.type === 'order') {
            let orderId = data.data.orderId;
            let image = data.data.image;
            let domain = data.data.domain;
            let money = data.data.money;
            let volume = data.data.volume;
            let platform = data.data.platform;
            let timeout = data.data.timeout.length;
            downloadQrcode(domain + "/file/image?path=" + image)

            let notTimeout = true;
            setTimeout(function () {
                logd("超时了");
                notTimeout = false
                ws.sendText(getPageData("jumped_timeout_page"))
            }, parseInt(timeout) * 1000)


            if (getRunningActivity() !== "com.tencent.mm.ui.LauncherUI") {
                utils.openApp("com.tencent.mm")
                sleep(3 * 1000)
            }
            let fanxianSelector = text("发现")
            let fanxianExit = waitExistNode(fanxianSelector, 3 * 1000)
            if (fanxianExit && notTimeout) {
                logd("找到发现按钮、点击 -> " + click(fanxianSelector));
                sleep(1000)
                let scanSelector = text("扫一扫")
                let scanButtonExit = waitExistNode(scanSelector, 3 * 1000)
                if (scanButtonExit && notTimeout) {
                    ws.sendText(getPageData("jumped_wechat_page"))
                    logd("找到扫一扫按钮、点击 -> " + click(scanSelector));
                    sleep(1000)
                    let imageChooseButtonSelector = index(0).depth(10).drawingOrder(1).clz("android.widget.ImageView")
                    let imageChooseButtonExit = waitExistNode(imageChooseButtonSelector, 3 * 1000)
                    if (imageChooseButtonExit && notTimeout) {
                        ws.sendText(getPageData("jumped_scanned_page"))
                        logd("找到图片选择按钮、点击 -> " + click(imageChooseButtonSelector));
                        sleep(1000)

                        let downChooseSelector = text("所有图片")
                        let downChooseExit = waitExistNode(downChooseSelector, 3 * 1000)
                        if (downChooseExit && notTimeout) {
                            click(downChooseSelector)
                            sleep(1000)
                            let dcimSelector = text("DCIM")
                            let dcimExit = waitExistNode(dcimSelector, 3 * 1000)
                            if (dcimExit && notTimeout) {
                                ws.sendText(getPageData("jumped_qrcode_choose_page"))
                                click(dcimSelector)
                                sleep(1000)
                                logd("找到二维码图片、点击 -> " + clickPoint(100, 200));
                                sleep(1500)
                                let nowPaySelector = text("立即支付")
                                let nowPaySelectorExit = waitExistNode(nowPaySelector, 3 * 1000)
                                if (nowPaySelectorExit && notTimeout) {
                                    ws.sendText(getPageData("jumped_qrcode_identify_page"))
                                    logd("识别二维码、点击支付 -> " + click(nowPaySelector));
                                    sleep(1000)
                                    let payPageSelector = text("请输入支付密码")
                                    let payPageExit = waitExistNode(payPageSelector, 3 * 1000)
                                    if (payPageExit && notTimeout) {
                                        let passwordButton = index(1).depth(13).drawingOrder(2)
                                            .clz("android.widget.ImageView")
                                            .getOneNodeInfo(3 * 1000)
                                        logd("支付输入密码 " + JSON.stringify(passwordButton));
                                        clickPoint(passwordButton.bounds.left - 10, passwordButton.bounds.top) //1按键
                                        sleep(500)
                                        clickPoint(passwordButton.bounds.left - 10, passwordButton.bounds.top) //1按键
                                        sleep(500)
                                        clickPoint(passwordButton.bounds.left - 10, passwordButton.bounds.top) //1按键

                                        sleep(500)
                                        clickPoint(passwordButton.bounds.left + 10, passwordButton.bounds.top) //2按键
                                        sleep(500)
                                        clickPoint(passwordButton.bounds.left + 10, passwordButton.bounds.top) //2按键
                                        sleep(500)
                                        clickPoint(passwordButton.bounds.left + 10, passwordButton.bounds.top) //2按键
                                        sleep(1000)

                                        let payFinishButton = text("完成")
                                        let payFinishButtonExit = waitExistNode(payFinishButton, 3 * 1000)
                                        if (payFinishButtonExit) {
                                            logd("支付完成");
                                            // click(payFinishButton)
                                            ws.sendText(getPageData("jumped_pay_success_page"))
                                            stopAndStart()
                                        } else {
                                            logd("支付失败");
                                            ws.sendText(getPageData("jumped_pay_fail_page"))
                                            stopAndStart()
                                        }
                                    } else {
                                        logd("找不到二维码图片");
                                        ws.sendText(getPageData("jumped_qrcode_un_identify_page"))
                                        stopAndStart()
                                    }
                                } else {
                                    logd("识别二维码失败");
                                    ws.sendText(getPageData("jumped_pay_fail_page"))
                                    stopAndStart()
                                }

                            } else {
                                logd("DCIM 图片类型找不到");
                            }
                        } else {
                            logd("找不到下拉图片类型");
                        }
                    } else {
                        logd("找不到图片选择");
                    }
                } else {
                    logd("找不到扫一扫");
                }
            } else {
                logd("找不到发现按键");
            }

        }
    })
    //设置关闭时候的监听器
    ws.onClose(function (ws1, code, reason) {
        logi(" onClose  " + code + "  reason : " + reason + " remote:");
    })
    ws.onError(function (ws1, msg) {
        logi(" onError  " + msg);
        result[0] = "error";
    })
    // bytes 是 java的bytes数组 对象
    ws.onBinary(function (ws1, bytes) {
        //转成java的
        logi(" onBinary  " + new java.lang.String(bytes));
    })
    let r = ws.connectBlocking(10000);
    //let r = ws.connect();
    logd("connect {} rr = {}", result[0], r);
    logd("isconnect " + ws.isConnected());
    while (true) {
        sleep(3000)
        if (ws.isConnected()) {
            sleep(1000)
        } else {
            //重置链接
            let reset = ws.reset();
            logd("reset {}", reset)
            if (reset) {
                logd("开始重连...");
                let rc = ws.connectBlocking(10000);
                logd("重连--> " + rc);
            }
        }
    }
    logd("isClosed " + ws.isClosed())
    sleep(1000)
    //关闭连接
    ws.close();
    // ws.onOpen(function (ws1,code,msg){
    //     logd("onOpen code "+code +"  msg:"+msg);
    // })
    // //设置有文本信息监听器
    // ws.onText(function (ws1,text){
    //     logd(" onText "+text);
    // })
    // //设置关闭时候的监听器
    // ws.onClose(function (ws1,code,reason){
    //     logd(" onClose  "+code +"  reason : "+reason+" remote:");
    // })
    // ws.onError(function (ws1,msg){
    //     logd(" onError  "+msg );
    // })
    //
    // sleep(30);

    // var request = image.requestScreenCapture(10000,0);
    // if (!request) {
    //     request = image.requestScreenCapture(10000,0);
    // }
    // logd("申请截图结果... "+request)
    // //申请完权限等1s再截图,否则会截不到图
    // sleep(1000)
    // var imageX = image.captureFullScreen();
    // var r = image.toBase64Format(imageX,"jpg",50);
    // toast("result "+r);
    // //图片要回收
    // image.recycle(imageX )
}

function autoServiceStart(time) {
    for (var i = 0; i < time; i++) {
        if (isServiceOk()) {
            return true;
        }
        var started = startEnv();
        logd("第" + (i + 1) + "次启动服务结果: " + started);
        if (isServiceOk()) {
            return true;
        }
    }
    return isServiceOk();
}

main();
