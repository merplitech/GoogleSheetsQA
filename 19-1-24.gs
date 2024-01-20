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










Sort by Date


function sendLineNotify() {

  const dateFormat = "dd/MM/yyyy";
  const timeFormat = "HH:mm";

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName("sheet");
  const data = sheet.getRange("data").getValues();
  const lineToken = "Line Token";


  const alert = "รบกวนคอนเฟิร์มวันจัดส่งให้หน่อยค่ะ";

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

  const _timeFormat = (format, date) => {
    return Utilities.formatDate(date, "GMT+7", format)
  };

  const today = _timeFormat(dateFormat, new Date());
  const time = _timeFormat(timeFormat, new Date());


  const group = data.filter(r => r[sendDate] != "" && _timeFormat(dateFormat, r[sendDate]) == today)

  const names = new Set(group.map(c => c[company]));

  for (const name of names) {

    if (!name) continue;

    const group = data.filter(r => r[company] == name && r[sendDate] != "" && r[sendTime] != "");

    const message = group.map(r => `${r[items]} จำนวน ${r[qty]} ${r[unit]}\n${r[pr]}\n`);



    const {[company]: _company,[po]: _po, [dueDate]: _dueDate, [sendDate]: _sendDate, [sendTime]: _sendTime} = group[0];

    const text = `\n${alert}\n\n${_company}\n${_po}\n\n${message.join("\n")}\nDue Date: ${_timeFormat(dateFormat, _dueDate)}`;

    const isAllowed = _timeFormat(dateFormat,_sendDate) === today && _sendTime === time;

    if (isAllowed) lineSender(text, lineToken);


  }
}
