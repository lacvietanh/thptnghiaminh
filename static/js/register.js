const INPUT_username = $qs('input[name=username]')
const INPUT_pw = $qs('input[name=password]')
const INPUT_pw2 = $qs('input[name=password2]')
const INPUT_email = $qs('input[name=ema]')

// FUNCTION CHECK :
const check_uname = async () => {
  let e = INPUT_username
  e.value = akiFn.removeAccents(e.value).replaceAll(/[^A-Za-z0-9.]/g, '')
  if (e.value.length < 3) {
    noti.add('Username tối thiểu 3 ký tự, chỉ cho phép chữ hoa, chữ thường, số, dấm chấm.')
    return UI.fieldCheck(e, 0)
  } else {
    let data = new FormData();
    data.append("action", 'checkUserName');
    data.append("username", e.value);
    let r = await fetch(APIURL, { method: "POST", body: data })
    let t = await r.text()
    if (t) {
      noti.add(`UserName đã tồn tại! (<b>${e.value}</b>)`)
      return UI.fieldCheck(e, 0)
    } else {
      return UI.fieldCheck(e, 1)
    }
  }
}
const check_pw1 = () => {
  let f = INPUT_pw, h = f.parentElement.nextElementSibling // help text
  let h1 = h.querySelector('span.cond1'), h2 = h.querySelector('span.cond2')
  let c1 = false, c2 = false;
  let cond1 = new RegExp('(?=.{6,})')
  cond1.test(f.value)
    ? c1 = UI.makeCheck(h1, 1, 'txt')
    : c1 = UI.makeCheck(h1, 0, 'txt')
  let cond2 = new RegExp('[^A-Za-z0-9.]')
  cond2.test(f.value)
    ? c2 = UI.makeCheck(h2, 0, 'txt')
    : c2 = UI.makeCheck(h2, 1, 'txt')
  if (c1 == true && c2 == true) {
    return UI.fieldCheck(f, 1)
  } else {
    return UI.fieldCheck(f, 0)
  }
}
const check_pw2 = () => {
  let f = INPUT_pw2, h = f.parentElement.nextElementSibling // help text
  if (INPUT_pw.value != f.value) {
    h.innerHTML = "Mật khẩu nhập lại không khớp!"
    UI.makeCheck(h, 0, 'txt')
    h.classList.remove('is-hidden')
    return UI.fieldCheck(f, 0)
  } else {
    UI.makeCheck(h, 1, 'txt')
    h.classList.add('is-hidden')
    return UI.fieldCheck(f, 1)
  }
}
const check_email = async () => {
  let f = INPUT_email, h = f.parentElement.nextElementSibling // help text
  let cond = new RegExp('(?=.{6,})')
  if (cond.test(f.value)) {
    let data = new FormData();
    data.append("action", 'checkEmailExist');
    data.append("ema", f.value);
    let r = await fetch(APIURL, { method: "POST", body: data })
    let t = await r.text()
    if (t != 'false') {
      h.innerHTML = `Email này đã được đăng ký!`
      UI.makeCheck(h, 0, 'txt')
      return UI.fieldCheck(f, 0)
    } else {
      h.innerHTML = "Email này có thể đăng ký"
      UI.makeCheck(h, 1, 'txt')
      return UI.fieldCheck(f, 1)
    }
  } else {
    h.innerHTML = "Email không hợp lệ"
    UI.makeCheck(h, 0, 'txt')
    return UI.fieldCheck(f, 0)
  }
}

// EventListener field CHECK :
INPUT_username.addEventListener('change', check_uname)
INPUT_pw.addEventListener('input', check_pw1)
INPUT_pw2.addEventListener('input', check_pw2)
INPUT_email.addEventListener('input', check_email)


const postRegister = async () => {
  if (await check_uname() === false) {
    noti.add('Vui lòng kiểm tra lại username!', 2)
  } else if (check_pw1() === false) {
    noti.add('Vui lòng kiểm tra lại mật khẩu!', 2)
  } else if (check_pw2() === false) {
    noti.add('Mật khẩu nhập lại không khớp!', 2)
  } else if (await check_email() === false) {
    noti.add('Vui lòng kiểm tra lại email!', 2)
  } else {
    let data = new FormData($id('registerForm'));
    data.append("action", 'register');
    let r = await fetch(APIURL, { method: "POST", body: data })
    let t = await r.json()
    let tmp = {
      0: { mess: 'thất bại', bulmaClass: 'danger' },
      1: { mess: 'thành công', bulmaClass: 'success' }
    }
    noti.add(`
        Đăng ký tài khoản <b>${t.secured_UserName}</b> ${tmp[t.STATUS]['mess']}
        <br>(${t.MESS})`, 15, tmp[t.STATUS]['bulmaClass'])
    // if (t.STATUS) modal.push(`<pre>${JSON.stringify(t, '', 2)}</pre>`)
  }
}
addEventListener('authload', () => {
  Auth.register();
})
addEventListener('DOMContentLoaded', () => {
  // AutoSet Birthday Year to 16 years ago:
  let Y = new Date(new Date().setFullYear(new Date().getFullYear() - 16)).getFullYear()
  $qs('input[name=birthday]').value = `${Y}-01-01`;


})