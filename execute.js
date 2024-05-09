
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
            chrome.runtime.sendMessage({ action: 'pageReloaded' });
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

function clickToTicket(){
    var button = document.querySelector('button.btn.btn-primary.text-bold.m-0');
    if (button) {
        chrome.runtime.sendMessage({ action: 'page2Next' });
        button.click();
    } else{
        setTimeout(function() {clickToTicket()}, 1000);
    }
}
function getOrder(){
    var aElement = document.querySelector('ul.area-list li.select_form_b a');
    if (aElement) {
        aElement.click();
        buyTicket();
    }else{
        chrome.runtime.sendMessage({ action: 'soudOutReload' });
    }
    
}

function buyTicket() {
    //選張數
    console.log('選張數');
    var s_element = document.querySelector('.form-select.mobile-select');
    if (s_element) {
        s_element.selectedIndex = 2;
        var checkboxElement = document.getElementById("TicketForm_agree");
        checkboxElement.checked = true;
        //TODO OCR辨識會找不到 tesseract
        //checkOCR();

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        document.head.appendChild(script);
        setTimeout(function() {
             //識別驗證碼
             const image = 'https://tixcraft.com/ticket/captcha?v=663adf0402f8e0.22876880';
             (async () => {
                 const worker = await Tesseract.createWorker();
                 await worker.load();
                 await worker.loadLanguage('eng');
                 await worker.initialize('eng');
                 const { data: { text } } = await worker.recognize(image);
                 console.log(text);
                 var inputElement = document.getElementById("TicketForm_verifyCode");
                 inputElement.value = text;
                 await worker.terminate();
             })();
        }, 4000);
    } else {
        setTimeout(function() {buyTicket()}, 1000);
    }
}

function checkOCR(){
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.onload = function() {

        setTimeout(function() {
            //識別驗證碼
            const image = 'https://tixcraft.com/ticket/captcha?v=663adf0402f8e0.22876880';
            (async () => {
                const worker = await Tesseract.createWorker();
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(image);
                console.log(text);
                var inputElement = document.getElementById("TicketForm_verifyCode");
                inputElement.value = text;
                await worker.terminate();
            })();
        }, 2000);
        
    };
    document.head.appendChild(script);
}

function reset(){
    window.location.reload();
}


const onMessage = (message) => {
  switch (message.action) {
    case "SETTIME":
        ticketEvent(message.startTime);
        break;
    case "RESET":
        reset();
        break;
    case "GETTICKET":
        checkURL();
        break;
    case "PAGE2TICKET":
        getOrder();
        break;
    case "SOLDOUT":
        getOrder();
        break;
    case "BUY2TICKET":
        buyTicket();
        break;
    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);

setInterval( console.log("AAA"), 2000);