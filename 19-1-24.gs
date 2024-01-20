function sendLineNotify() {

  const dateFormat = "dd/MM/yyyy";
  const timeFormat = "HH:mm";

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName("Change Sheet Name");
  const data = sheet.getRange("Change Data Range").getValues();
  const lineToken = "Change Line Token";

  const alert = "Change Alert text";

//// Set columns

  const mainArr = {
    company: 6,
    po: 2,
    dueDate: 9,
    sendDate: 10,
    sendTime: 11
  };

  const iterateArr = {
    items: 5,
    qty: 7,
    unit: 8,
    pr: 0,
  };

  const { company, po, dueDate, sendDate, sendTime } = mainArr;
  const { items, qty, unit, pr } = iterateArr;

  const names = new Set(data.map(c => c[company]));
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
  };

  const _timeFormat = (format, date = new Date()) => { return Utilities.formatDate(date, "GMT+7", format) };

  const today = _timeFormat(dateFormat);
  const time = _timeFormat(timeFormat);


  // for (const [i, name] of Array.from(names).entries()) {
  for (const name of names) {

    if (!name) continue;

    const group = data.filter(r => r[company] == name);

    const message = group.map(r => `${r[items]} จำนวน ${r[qty]} ${r[unit]}\n${r[pr]}\n`);

    const [_company, _po, _dueDate, _sendDate, _sendTime] = group.map(r => [r[company], r[po], r[dueDate], r[sendDate], r[sendTime]])[0];

    const text = `\n${alert}\n\n${_company}\n${_po}\n\n${message.join("\n")}\nDue Date: ${_timeFormat(dateFormat, _dueDate)}`;

    const date = _timeFormat(dateFormat, _sendDate);
    const timer = _timeFormat(timeFormat, _sendTime);

    const isAllowed = date === today && timer === time;

    if (isAllowed) lineSender(text, lineToken);
  }
}
