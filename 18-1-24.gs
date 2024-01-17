const data = function () {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("เปลี่ยนชื่อชีต"); // ชื่อชีต
  const data = sheet.getRange("เปลี่ยนช่วงข้อมูล").getValues(); // ช่วงข้อมูล
  const names = new Set(data.map(c => c[0]));
  const lineToken = "แก้ Line Token ตรงนี้"; // Line Notify Token

  const lineSender = (message, token) => {
    var formData = {
      'message': message,
    };
    var options = {
      'method': 'post',
      'headers': { 'Authorization': "Bearer " + token },
      'contentType': 'application/x-www-form-urlencoded',
      'payload': formData
    };
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
  }

  for (const name of Array.from(names)) {

    if (!name) return;

    const group = data.filter(r => r[0] == name);
    const message = group.map(c => `${c[1]} ${c[2]}`)

    let text = name;
    text = `\n${name}\n${message.join("\n")}`;

    lineSender(text,lineToken);
  }
}
