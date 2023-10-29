function generateUUID() {
  const generateRandomHex = (length) => {
    let result = '';
    const characters = 'abcdef0123456789';
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  };

  const uuid = `${generateRandomHex(8)}${generateRandomHex(4)}${generateRandomHex(4)}${generateRandomHex(4)}${generateRandomHex(12)}`;

  return uuid;
}

function getValue(id) {
  if(id == 'AccessToken'){
    return "c1f2db45332c4de0a1afcc6ee9b8a39c"
  }else if(id == 'ASR-Appkey'){
    return "YG5Hx595bmk6HZGl"
  }
  return localStorage.getItem(id);
  // return document.querySelector('#' + id).value.replace(/\s+/g, '');
}

const inputIds = ['nonce','gslb','appId','userId','expiredTime','token','channelId','AccessToken','ASR-Appkey'];
function saveValueToLocalStorage(){
  for(let i = 0; i < inputIds.length;++i){
    const id = inputIds[i];    
    document.querySelector('#' + id).addEventListener('change',(v) => {
      localStorage.setItem(id, v.target.value);
    });
  }
}

function getValueFromLocalStorage(){
  for(let i = 0; i < inputIds.length;++i){
    const id = inputIds[i];    
    document.querySelector('#' + id).value = localStorage.getItem(id);
  }
}
