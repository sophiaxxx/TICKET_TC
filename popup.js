var getSelectedTab = (tab) => {
var tabId = tab.id;
var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);

document.getElementById('getTicket').addEventListener('click', () =>{
  var zombieTime= document.getElementById("timeInput").value; 
  console.log(zombieTime);
  sendMessage({ action: 'SETTIME', startTime: zombieTime });
} );
document.getElementById('reset').addEventListener('click', () => sendMessage({ action: 'RESET' }))
}
chrome.tabs.getSelected(null, getSelectedTab);
