var getSelectedTab = (tab) => {
var tabId = tab.id;
var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);

document.getElementById('getTicket').addEventListener('click', () =>{
  var zombieTime= document.getElementById("timeInput").value; 
  // var date= document.getElementById("dateInput").value; 
  var price= document.getElementById("priceInput").value; 
  var quantity= document.getElementById("quantityInput").value; 
  console.log(zombieTime);
  sendMessage({ action: 'SETTIME', startTime: zombieTime, /*targetDate:date,*/ targetPrice:price, targetQuantity:quantity });
} );
document.getElementById('reset').addEventListener('click', () => sendMessage({ action: 'RESET' }))
}
chrome.tabs.getSelected(null, getSelectedTab);
