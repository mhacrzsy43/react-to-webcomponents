/**
 * WebSocket
 * 
 */
function getWebSocket(AccessToken){
  const wssUrl = `wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1?token=${AccessToken}`;
  // 连接到WebSocket服务器
  return new WebSocket(wssUrl);
}