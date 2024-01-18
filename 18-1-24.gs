function sendLineNotify() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("แก้ชื่อชีต"); // eg: "สรุปยอดขาย"
  const data = sheet.getRange("แก้ช่วงข้อมูล").getValues(); // eg: A1:C
  const names = new Set(data.map(c => c[0]));
  const lineToken = "แก้ Line Token ตรงนี้"; // eg: "aaaaaaaaaaaaaasgsb333Zx2"

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
    const message = group.map(c => `${c[1]} ${c[2]}`);

    const text = `\n${name}\n${message.join("\n")}`;

    lineSender(text, lineToken);
  }
}
