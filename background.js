chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if (message.action === 'pageReloaded') {
        chrome.tabs.query({},function(tabs){     
            tabs.forEach(function(tab){
                if(new URL(tab.url).hostname === "tixcraft.com"){ //因無法直接抓取manifest.json的content_scripts matches, 使用網域來指定要傳送message的tab
                    chrome.tabs.reload(tab.id);
                    setTimeout(function() {
                        chrome.tabs.sendMessage(tab.id, { action: 'GETTICKET' });
                        console.log('GETTICKET!'+tab.id);
                    }, 1000);
                }
            });
         });
    }else if (message.action === 'page2Next') {
        chrome.tabs.query({},function(tabs){     
            tabs.forEach(function(tab){
                if(new URL(tab.url).hostname === "tixcraft.com"){ 
                    setTimeout(function() {
                        chrome.tabs.sendMessage(tab.id, { action: 'PAGE2TICKET' });
                        console.log('PAGE2TICKET!(1)'+tab.id);
                    }, 1000);

                }
            });
         });
    }else if (message.action === 'soudOutReload') {
        chrome.tabs.query({},function(tabs){     
            tabs.forEach(function(tab){
                if(new URL(tab.url).hostname === "tixcraft.com"){ //因無法直接抓取manifest.json的content_scripts matches, 使用網域來指定要傳送message的tab
                    chrome.tabs.reload(tab.id);
                    setTimeout(function() {
                        chrome.tabs.sendMessage(tab.id, { action: 'SOLDOUT' });
                    }, 1000);
                }
            });
         });
    }

});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // 确保页面已经加载完成
    if (changeInfo.status === 'complete') {
        // 检查页面的URL是否符合条件
        console.log(tab.url);
        if (tab.url.indexOf('tixcraft.com/ticket/ticket') > 0) {
            console.log(changeInfo.status + ';' + tab.url);
            setTimeout(function() {
                chrome.tabs.sendMessage(tabId, { action: 'BUY2TICKET', url: tab.url });
                console.log('BUY2TICKET!(1)'+tab.id);
            }, 1000);
        }
    }
});