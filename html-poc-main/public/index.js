/**
 * ASR相关
 */
let websocket = null;
let task_id = ''; // asr会话的全局id
/**
 * 录音相关
 */
let mediaLib = null; // 录音降采样处理器实例
let stream = null; // 本地录音流
let isRecording = false; // 是否在录音
/**
 * aliyun-avatar-sdk
 */
let broadcastingAvatarSDK = null; // aliyun-avatar-sdk实例

function getAnswerFromPrivateGPT(question){
  // 创建并触发事件
    var event = new CustomEvent('myCustomEvent', { detail: { key: question} });
    window.dispatchEvent(event);
}

async function startRecording() {
  const AccessToken = getValue('AccessToken');
  websocket = new getWebSocket(AccessToken);
    
  websocket.onerror = function(error) {
    console.log('ASR服务 WebSocket发生错误：', error);
  };

  websocket.onclose = function() {
    console.log('ASR服务 WebSocket连接已关闭');
  };
  let isAnswer = false
  websocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if(data.header.name === "SentenceEnd"){
      if(isAnswer)return
      isAnswer = true
      const result = data.payload.result;
      console.log('asr识别结果：', result);
      getAnswerFromPrivateGPT(result)
      fetch('https://motionverseapi.deepscience.cn/v3.0/api/AnswerCollectMotion', {
        method: 'POST',
        headers: {  
          access_token: localStorage.getItem('MotionAccessToken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: result
        }),
      }).then(res => res.json()).then(res => {
        console.log('获取问答：', res)
        isAnswer = false
        if(res.code == 0){
          if(res.data?.answerDmeasyData.answer == '抱歉，我还没想好怎么回答您的问题'){

          }else if(res.data?.ttsSynthesizeData?.audio_url){
                        // 获取iframe dom
                        var iframeDom = document.getElementById('iframeDom')
                        const question = res.data.answerDmeasyData?.simquery
                        const host = 'http://localhost:1234/'
                        iframeDom.contentWindow.postMessage({ type: 'AudioBroadcast', data: res.data?.ttsSynthesizeData?.audio_url, bodyMotion:3, isFirst:false }, '*')
                        if(question.indexOf('开车门') > -1){
                            // 向父级页面发送消息
                            setTimeout(() => {
                              window.parent.postMessage('carOpen', host);
                            },3000)
                        }else if(question.indexOf('关车门') > -1 || question.indexOf('关闭车门') > -1||question.indexOf('关下车门') > -1){
                            setTimeout(() => {
                                window.parent.postMessage('carClose', host);
                            },3000)
                        }else if(question.indexOf('看下车内') > -1 || question.indexOf('看看车内') > -1 || question.indexOf('车内') > -1){
                            setTimeout(() => {
                              window.parent.postMessage('carIn', host);
                            },5000)
                        }else if(question.indexOf('看下车身') > -1 || question.indexOf('看看车身') > -1|| question.indexOf('车身') > -1){
                          setTimeout(() => {
                            window.parent.postMessage('carOut', host);
                          },3000)
                        }else if(question.indexOf('转动看看') > -1|| question.indexOf('转下看看') > -1){
                          setTimeout(() => {
                            window.parent.postMessage('autoRotate', host);
                          },3000)
                        }else if(question.indexOf('停止转动') > -1|| question.indexOf('停下转动') > -1|| question.indexOf('不用转动') > -1){
                          setTimeout(() => {
                            window.parent.postMessage('stopRotate', host);
                          },5000)
                        }else if(question.indexOf('金色款式') > -1 || question.indexOf('金属款式') > -1){
                          setTimeout(() => {
                            window.parent.postMessage('changeToGoldColor', host);
                          },5000)
                        }else if(question.indexOf('黑色款式') > -1 || question.indexOf('黑色的款式') > -1){
                          setTimeout(() => {
                            window.parent.postMessage('changeToBlackColor', host);
                          },5000)
                        }else if(question.indexOf('请开车灯') > -1 || question.indexOf('开车灯') > -1|| question.indexOf('开下车灯') > -1){
                          setTimeout(() => {
                            window.parent.postMessage('turnOnHeadlight', host);
                          },5000)
                        }else if(question.indexOf('关车灯') > -1 || question.indexOf('关闭车灯') > -1|| question.indexOf('关下车灯') > -1){
                          setTimeout(() => {
                            window.parent.postMessage('turnOffHeadlight', host);
                          },5000)
                        }
                    }
        }
      }).catch(err => {
        console.log(err, 'err')
        isAnswer = false
      })
   }
  }

  websocket.onopen = async function(){
    console.log('ASR服务 WebSocket连接已打开',websocket);
    if(websocket.readyState !== 1) return;
    task_id = generateUUID(32);
    websocket.send(JSON.stringify({
      "header": {
          "message_id": generateUUID(),
          "task_id": task_id,
          "namespace": "SpeechTranscriber",
          "name": "StartTranscription",
          "appkey": getValue('ASR-Appkey')
      },
      "payload": {
          "format": "PCM",
          "sample_rate": 16000,
          "enable_intermediate_result": true,
          "enable_punctuation_prediction": true,
          "enable_inverse_text_normalization": true
      }
    }));
  
    /**
     * 重新实例化AvatarMedia
     */
    mediaLib = new window.Media({
      video: false,
      audio: {
        fps: 5,
      }
    });
    /**重新开启录音 */
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      isRecording = true;
      mediaLib?.setStream(stream);
    } catch (e) {
      throw Error( "未获取到录音权限");
    }
  
    mediaLib.on('data', data => {
      const { audio } = data;
      if(audio !== undefined){
        websocket.send(audio);
      }
    })
  };


}

function stopRecording() {
  if(websocket.readyState !== 1) return;
  /**给ASR传递结束消息 */
  websocket.send(JSON.stringify({
    "header": {
        "message_id": generateUUID(),
        "task_id": task_id,
        "namespace": "SpeechTranscriber",
        "name": "StopTranscription",
        "appkey": getValue('ASR-Appkey')
    }
  }));
  websocket.close();
  websocket = null;
  task_id = '';
  if (!isRecording) return;
  stream?.getTracks().forEach((track) => {
    track.stop();
  });
  isRecording = false;
  mediaLib.destory();
  mediaLib = null;

}

function startAvatar(){
  broadcastingAvatarSDK = new BroadcastingAvatarSDK({
    channel: {
      userId: getValue('userId'),
      channelId: getValue('channelId'),
      appId: getValue('appId'),
      nonce: getValue('nonce'),
      expiredTime: getValue('expiredTime'),
      gslb: getValue('gslb').replace(/\'/g, '"'),
      token: getValue('token'),
    },
    videoDOM: document.getElementsByClassName('video-box')[0],
    onError: (e) => {console.log(e)},
  });

  broadcastingAvatarSDK.init().then(() => {
    // 等同于onInitSuccess
    console.log('rtc拉流成功');
  });
}

function stopAvatar(){
  broadcastingAvatarSDK?.destroy();
  broadcastingAvatarSDK = null;
}

async function getAssessToken(){
  connectPrivateGPT()
  let appid = '169828592329388000'
  let secret = '31eba3aa7ef3c406a59bb4bbf930b68f5c99a5e5'
  let timestamp = new Date().getTime() // 当前时间戳
  let str = appid + timestamp + secret // 组合字符串 
  // 计算SHA-1哈希
  const sign = CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex);
  let url = `https://motionverseapi.deepscience.cn/users/getAppToken?appid=${appid}&secret=${secret}&timestamp=${timestamp}&sign=${sign}`
  const getAccessToken = await fetch(url).then(res => res.json()).then(res => {
    if(res?.code == 0){
      localStorage.setItem('MotionAccessToken', res.data.access_token)
    }
  })
  return getAccessToken
}

async function connectPrivateGPT() {
  let websocket = new WebSocket('ws://127.0.0.1:8001/queue/join');
  websocket.onerror = function(error) {
    console.log('privateGPt WebSocket发生错误：', error);
  };
  websocket.onclose = function() {
    console.log('privateGPt WebSocket连接已关闭');
  };
  websocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data,"=======privateGPt收到消息")
  }
  websocket.onopen = async function(){
    console.log('privateGPt WebSocket连接已打开',websocket);
    
  };
}

