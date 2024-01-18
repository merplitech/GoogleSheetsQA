function sendLineNotify() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("81");
  const data = sheet.getRange("I7:K").getValues();
  const names = new Set(data.map(c => c[0]));
  const lineToken = "bUPgnvsHeH6MXy6zHGMtnq16bqFPyri77inr0sK5MGI";

  const lineSender = (message, token) => {
    
    const formData = {
      'message': message,
    };
    const options = {
      'method': 'post',
      'headers': { 'Authorization': "Bearer " + token },
      'contentType': 'application/x-www-form-urlencoded',
      'payload': formData
    };
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
  }

  for (const name of names) {

    if (!name) continue;

    const group = data.filter(r => r[0] == name);
    const message = group.map(c => `${c[1]} ${c[2]}`)

    let text = name;
    text = `\n${name}\n${message.join("\n")}`;

    lineSender(text, lineToken);
  }
}
