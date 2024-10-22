var storedMsg;
const ticketEvent = (t) => {
    //設定訂票當日的日期時間
    if(t===''){
        alert("Please input the time you want!");
        return;
    }

    let today = new Date().toISOString().slice(0, 10);
    const targetDate = new Date(today+'T'+ t +':00');
    console.log("targetDate=>"+targetDate);
    const currentTime = new Date();
    
    if (currentTime < targetDate) {
        //計算延遲時間
        const delay = targetDate.getTime() - currentTime.getTime();
        //延遲執行按鈕
        setTimeout(function() {
            chrome.runtime.sendMessage({ action: 'pageReloaded'});
        }, delay);
    } else {
        console.log('Current time is after the target date, button will not be clicked.');
    }
};

function checkURL() {
    var currentURL = window.location.href;
    if (currentURL.indexOf('tixcraft.com/activity/detail') > 0 ) {
        var c_url = currentURL.replace("https://tixcraft.com/activity/detail", "/activity/game");
        var link = document.querySelector('a[href="' + c_url + '"]');
        if (link) {
            link.click();
            clickToTicket();
        } else{
            setTimeout(function() {checkURL()}, 1000);
        }
    }
}
var _count = 0;
function clickToTicket() {
    // 获取所有符合条件的按钮
    var buttons = document.querySelectorAll('button.btn.btn-primary.text-bold.m-0');
    
    // 检查是否至少有两个按钮
    if (buttons.length >= 2) {
        var button = buttons[2];
        console.log('clickToTicket: more button');
        chrome.runtime.sendMessage({ action: 'page2Next' });
        try {
            button.click();
        } catch (error) {
            console.error('clickToTicket: failed to click button', error);
        }
    }else{
        var button = buttons[0];
        console.log('clickToTicket: one button');
        chrome.runtime.sendMessage({ action: 'page2Next' });
        try {
            button.click();
        } catch (error) {
            console.error('clickToTicket: failed to click button', error);
        }
    } 

        if (_count < 5){
            console.log('clickToTicket: no button');
            setTimeout(function() { checkURL(); }, 500);
            _count++;
        }

}

async function getOrder() {
    var aElements = document.querySelectorAll('ul.area-list li.select_form_a a');
    var bElements = document.querySelectorAll('ul.area-list li.select_form_b a');
    var cElements = document.querySelectorAll('ul.area-list li.select_form_c a');
    
    var priceToSelect = storedMsg.targetPrice; // 指定要選擇的價格

    // 同時處理 bElements 和 aElements，並取得結果
    const [bFound, aFound, cFound] = await Promise.all([
        processList(aElements, priceToSelect),
        processList(bElements, priceToSelect),
        processList(cElements, priceToSelect)
    ]);

    // 如果沒有找到指定價格的元素，發送消息並提示用戶
    if (!bFound && !aFound && !cFound) {
        //chrome.runtime.sendMessage({ action: 'soudOutReload' });
        console.warn(`未找到價格 ${priceToSelect} 的座位選項。${cFound}${bFound}${aFound}`);
        alert(`未找到價格 ${priceToSelect} 的座位選項。`); // 提示用戶
    }
}

async function processList(elements, priceToSelect) {
    for (let element of elements) {
        if (element.textContent.includes(priceToSelect)) {
            element.click(); // 點擊包含該價格的元素
            await buyTicket(); // 呼叫購票函數，假設這是個非同步函數
            return true; // 找到符合的價格後，返回 true
        }
    }
    return false; // 沒有找到時返回 false
}




// function getOrder() {
//     // 獲取所有價格的 <a> 標籤
//     var bElements = document.querySelectorAll('ul.area-list li.select_form_b a');
//     var aElements = document.querySelectorAll('ul.area-list li.select_form_a a');
//     var priceToSelect = storedMsg.targetPrice; // 指定要選擇的價格
//     var found = false; // 標記是否找到指定價格

//     for (var aElement of bElements) {
//         // 檢查每個 <a> 標籤的文本內容是否包含指定的價格
//         if (aElement.textContent.includes(priceToSelect)) {
//             aElement.click(); // 點擊包含該價格的元素
//             buyTicket(); // 呼叫購票函數
//             found = true; // 設置找到標記
//             break; // 找到後直接跳出循環
//         }
//     }
    

// }

// function clickToTicket() {
//     var rows = document.querySelectorAll('tr.gridc.fcTxt');
//     var buttonToClick = null;
    
//     // 如果 targetDate 存在，尝试找到匹配的按钮
//     if (storedMsg.targetDate) {
//         var targetDate = storedMsg.targetDate.replace(/-/g, '/');
//         console.log(targetDate);
//         rows.forEach(function (row) {
//             var dateText = row.querySelector('td:first-child').textContent.trim();
//             if (dateText.includes(targetDate)) {
//                 buttonToClick = row.querySelector('button.btn.btn-primary.text-bold.m-0');
//             }
//         });
//     }

//     // 如果找到了按钮，点击它；否则随机选择第一行的按钮
//     if (buttonToClick) {
//         chrome.runtime.sendMessage({ action: 'page2Next' });
//         buttonToClick.click();
//     } else if (rows.length > 0) {
//         // 随机选择第一行的按钮
//         buttonToClick = rows[0].querySelector('button.btn.btn-primary.text-bold.m-0');
//         if (buttonToClick) {
//             chrome.runtime.sendMessage({ action: 'page2Next' });
//             buttonToClick.click();
//         } else {
//             // 如果没有按钮，继续尝试
//             setTimeout(function() { clickToTicket(); }, 1000);
//         }
//     } else {
//         // 如果没有行，停止尝试
//         console.error('No rows found to click.');
//     }
// }

// function getOrder(){
//     var aElement = document.querySelector('ul.area-list li.select_form_b a');
//     if (aElement) {
//         aElement.click();
//         buyTicket();
//     }else{
//         chrome.runtime.sendMessage({ action: 'soudOutReload' });
//     }
    
// }


function buyTicket() {
    //選張數
    console.log('選張數');
    var s_element = document.querySelector('.form-select.mobile-select');
    if (s_element) {
        s_element.selectedIndex = storedMsg.targetQuantity;
        var checkboxElement = document.getElementById("TicketForm_agree");
        checkboxElement.checked = true;

        //檢查是否已經加載了 Tesseract 腳本
        if (!window.Tesseract) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            document.head.appendChild(script);

            console.log("等待腳本加載完畢");
            script.onload = function() {
                goOCR();
            };
        } else {
            console.log("如果腳本已經加載，直接識別驗證碼");
            goOCR();
        }
    } else {
        setTimeout(function() { buyTicket() }, 1000);
    }
}

function goOCR() {
    setTimeout(async function() {
        // 抓取 <img> 元素的 src 屬性
        const imgElement = document.getElementById('TicketForm_verifyCode-image');
        if (imgElement) {
            const image = imgElement.src; // 取得 img 的 src
            console.error('image:'+image);
            try {
                const worker = await Tesseract.createWorker();
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(image);
                console.log(text);
                var inputElement = document.getElementById("TicketForm_verifyCode");
                inputElement.value = text;
                await worker.terminate();
            } catch (error) {
                console.error('OCR 識別錯誤:', error);
            }
        } else {
            console.error('找不到圖片元素');
        }
    }, 4000);
}
    

function reset(){
    window.location.reload();
}


var count = 0;
const onMessage = (message) => {
  switch (message.action) {
    case "SETTIME":
        chrome.storage.local.set({ storedMessage: message }, function() {
            console.log('Message saved in storage:', message);
            ticketEvent(message.startTime);
        });

        break;
    case "RESET":
        reset();
        break;
    case "GETTICKET":
        chrome.storage.local.get('storedMessage', function(result) {
            if (result.storedMessage) {
                console.log('Retrieved message:', result.storedMessage);
                storedMsg =result.storedMessage;
                console.log('storedMsg:', storedMsg);
                checkURL(result.storedMessage.targetDate);
            }
        });
        
        
        break;
    case "PAGE2TICKET":
        chrome.storage.local.get('storedMessage', function(result) {
            if (result.storedMessage) {
                console.log('Retrieved message:', result.storedMessage);
                storedMsg =result.storedMessage;
                getOrder();
            }
        });
        
        break;
    case "SOLDOUT":
        if (count < 5) {
            setTimeout(function() {
                chrome.storage.local.get('storedMessage', function(result) {
                    if (result.storedMessage) {
                        console.log('Retrieved message:', result.storedMessage);
                        storedMsg =result.storedMessage;
                        getOrder();
                    }
                });
                
                count++;
            }, 10000);
        }
        break;
    case "BUY2TICKET":
        chrome.storage.local.get('storedMessage', function(result) {
            if (result.storedMessage) {
                console.log('Retrieved message:', result.storedMessage);
                storedMsg =result.storedMessage;
                buyTicket();
            }
        });
        
        break;
    default:
      break;
  }
};


chrome.runtime.onMessage.addListener(onMessage);
