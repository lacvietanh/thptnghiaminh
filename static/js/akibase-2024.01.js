/*
AkiBase Javascript Library
Usage: BULMA css Library + akibase-2023.10.css, put inside head tag, no async, no defer.
https://github.com/lacvietanh/cloud.akivn.net/edit/main/README.md
### 2023.12.18:
- Move  UI.initDropDown() and UI.initNewTabClass() INTO the end of UI.initNav()
### 2023.12.19:
- 14:32: Add notification id, fix Notification{tag} to that id
### 2023.12.22:
- 16:00: change modal.load from innerHTML to append (style tag work!)
- add HTMLElement prototype bmShow/bmHide (classList.add/remove "is-hidden")
- add Function: humanReadbleSize
### 2023.12.23:
- 21:25: Add dispatchEvent 'navload' when nav already in this html page
### 2023.12.27:
- 07:22: fix navload eventListener syntax
- 13:55: optimize text for Fetch, loader
- 15:11: loader.FetchRun() NOW CAN EXECUTE SCRIPT INSIDE TARGET HTML FILE
- 15:15: modal.load fix: use loader.FetchRun => can execute script inside
- 16:55: rename akiFn to AkiFn
- 16:56: add AkiFn: toNonAccentVietnamese, AkiFixFileName
- 16:58: add AkiFn: hanziNeat (remove chinese punctuation)
- 18:07: rename AkiFixFileName to "fixFileName. Improve regex, make it keep number + latin + chinese + vn(to Latin)
### 2023.12.28
- 12:48 BUG FIX: fetchme: (notScript) will not recursively

## 2024
### 2024.01.04
- 00:16: modal.push: button => small, box classList + p-2, rename "type" = "box_or_mess"
### 2024.01.06
- 12:22 noti.add: fix animation apear
### 2024.01.11
- 08:20 initNav then initFooter then dispatchEvent 'navload' 
*/

HTMLElement.prototype.bmShow = function () { this.classList.remove('is-hidden') }
HTMLElement.prototype.bmHide = function () { this.classList.add('is-hidden') }
HTMLButtonElement.prototype.addloading = function () { this.classList.add('is-loading') }
HTMLButtonElement.prototype.removeloading = function () { this.classList.remove('is-loading') }
Boolean.prototype.toOnOff = function () {
  let r, v = this.valueOf()
  v ? r = 'ON' : r = 'OFF'
  return r
}
function $id(id) { return document.getElementById(id); }
function $qsa(s) { return document.querySelectorAll(s); }
function $qs(s) { return document.querySelector(s); }
function setHTML(id, _html) { $id(id).innerHTML = _html }
function humanReadableSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) return bytes + ' B'
  let u = -1; const r = 10 ** dp;
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  do { bytes /= thresh; ++u; }
  while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return bytes.toFixed(dp) + ' ' + units[u];
}
function Fetch(u, e) {
  fetch(u)
    .then(r => {
      if (r.status == 404) e.innerHTML = "err";
      else r.text().then(data => { e.innerHTML = data; })
    }).catch(er => console.log('Fetch Failed: ', er));
}
const AkiFn = {
  newCompactWindow(u = location.href, w = 500, h = 309) {
    window.open(u, "_blank", `
    menubar=no,scrollbars=yes,location=no,toolbar=no,width=${w},height=${h}
    `)
  }
  , randomStr(length) {
    var result = '';
    var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var l = c.length;
    for (var i = 0; i < length; i++) {
      result += c.charAt(Math.floor(Math.random() * l));
    }
    return result;
  }
  , removeAccents(x) {
    var s, t;
    s = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçỳýỷỹỵ";
    t = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = s.length; i < l; i++) {
      x = x.replace(RegExp(s[i], "gi"), t[i]);
    } return x;
  }
  , latinity(str) {
    var y = AkiFn.removeAccents(str).toLowerCase()
      .replace(/[^a-z0-9\-]/g, ' ')
      .replace(/-+/g, ' ').trim();
    return y;
  }
  , parseCookie() {
    return document.cookie
      .split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
  }
  , toNonAccentVietnamese(str) {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }
  , fixFileName(str, splitExt = false) {
    // Fun Fact: Thuật toán xử lý file name này ông Lạc Việt Anh đã cố gắng tìm kiếm và suy nghĩ suốt 3 năm nay mới làm được :V
    function run(s) {
      return AkiFn.toNonAccentVietnamese(s)
        .match(/\p{Script=Han}+|\p{Script=Latin}+|[a-zA-Z0-9-]+/gu).join(" ")
    }
    if (splitExt) {
      var parts = str.split('.');
      var f = str.replace(/\.[^/.]+$/, "") // fileName without Ext
      var e = parts[parts.length - 1]; // Ext
      return `${run(f)}.${e}`;
    } else return run(str)
  }
  , hanziNeat(str) {
    return str.split('').filter(c => /\p{Script=Han}/u.test(c)).join('')
  }
}

class loader {
  // <element class="fetchme" data-inf="$second|0">
  static loadingSpin
    = '<div class=loadingContainer><span class="loader is-loading is-inline-block"></span></div>';
  static init() {
    $qsa('.fetchme').forEach((e) => {
      e.innerHTML = this.loadingSpin;
      let url = e.dataset.url, inf;
      (e.dataset.inf) ? inf = e.dataset.inf : inf = false;
      // console.log(e,url,inf); // DEB 
      setTimeout(() => { this.FetchRun(url, e) }, 100);
      inf ? setInterval(() => { this.FetchRun(url, e) }, inf * 1000) : null;
    });
  }
  static FetchRun(u, e) {
    fetch(u).then(r => {
      if (r.status == 404) e.innerHTML = "err404";
      else {
        r.text().then(t => {
          var p = new DOMParser();
          var doc = p.parseFromString(t, "text/html")
          var ns = doc.body.childNodes
          var s = doc.body.querySelectorAll('script')
          e.innerHTML = '' // remove loadingspin
          ns.forEach(tag => {
            if (tag.tagName.toLowerCase() != "script") e.append(tag)
            else {
            }
          })
          s.forEach(scr => {
            let x = document.createElement('script');
            x.innerHTML = scr.innerHTML;
            e.appendChild(x);
          })
        })
      }
    }).catch(er => console.log(er))
  }
}
class CDR {
  // <div id="CDRedirect" data-name=[pageName] data-s=[timeOut(s)] data-url=[URL]></div>
  static run() {
    let e = $id("CDRedirect");
    if (e) {
      let sec = e.dataset.s
        , html1 = `<div>Chuyển đến trang <strong>${e.dataset.name}</strong>? `
        , html2 = `
              <i><span id=CDRsec>${sec}s</span><div></i>
              <a class="button is-info mr-1" href="${e.dataset.url}" target=_blank>GO</a>
            `
        , html3 = `
              <button class="button CDR_STOP" onclick=CDR.stop()>STOP</button>
            `;
      e.innerHTML = html1 + html2 + html3;
      var i = $id('CDRsec');//increase
      this.countdown = setInterval(function () {
        sec--; i.innerHTML = sec + 's';
        if (3 >= sec && sec >= 1) { noti.add(html1 + sec + 's' + html3, sec); }
        if (sec <= 0) {
          window.location.href = e.dataset.url;
          clearInterval(this.countdown);
        }
      }, 1000);
    } else {
      // console.warn("CDR.run() called but no element id 'CDRedirect' created!");
    }
  }
  static stop() {
    clearInterval(this.countdown);
    $qsa('.button.CDR_STOP').forEach((e) => { e.disabled = true; });
    $id('CDRsec').innerHTML = "";
    noti.add('Đã hủy đếm ngược chuyển trang!', 3);
  }
}
class fx {
  static clear(id) {
    ($id(id)) ? $id(id).classList.add('fx-clear-fade') : null;
  }
}

class modal {
  static pre = /*html*/`
    <div class="modal-background"></div>
      <div class="modal-content">
        <div id="ModalNode" class=""></div>
      </div>
    <button class="modal-close is-large" aria-label="close"></button>
  `;
  static footer = /*html*/`
    <div class="m-auto w-fit p-1">
    <button id=modalBtnSubmit class="button is-small is-primary"></button>
    </div>
  `;
  static push(node = '', box_or_mess = 'box', opt = { tit: '', col: '', btFunc: '', btName: '' }) {
    $id('MainModal').innerHTML = modal.pre;
    let title, color, btnCb, btnName
    title = opt.tit || 'Message'
    color = opt.col || 'dark'
    btnCb = opt.btFunc || modal.close
    btnName = opt.btName || 'OK'
    let html, mess = `
      <div class="message is-${color}">
        <div class="message-header">
          <p> ${title} </p>
          <button class="delete" aria-label="delete" onclick="modal.close()"></button>
        </div>
        <div class="message-body p-2"> ${node} </div>
      </div>
    `;
    if (box_or_mess == 'box') { html = node; $id('ModalNode').classList.add('box', 'p-2'); };
    if (box_or_mess == 'mess') { html = mess; }
    $id('ModalNode').innerHTML = html + modal.footer;
    $id('modalBtnSubmit').innerHTML = btnName;
    $id('modalBtnSubmit').addEventListener('click', btnCb);
    $id('MainModal').classList.add("is-active", "fadefx"); this.init();
  }
  static load(url) {
    // BUG Feb 20 6:20  <script> in url will not work. 
    $id('MainModal').innerHTML = this.pre; this.init();
    let e = $id('ModalNode');
    e.classList.add('box');
    $id('MainModal').classList.add("is-active", "fadefx");
    e.innerHTML = loader.loadingSpin;
    loader.FetchRun(url, e);
  }
  static close() {
    $id('MainModal').classList.remove("is-active", "fadefx");
    $id('ModalNode').innerHTML = '';
  }
  static init() {
    $qsa('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button')
      .forEach((e) => {
        e.addEventListener('click', (e) => { e.stopPropagation(); modal.close(); });
      });
  }
  static help() { console.log(this) }
}
class tabs {
  static init() {
    if ($qs("section.TAB") != null) { //if that page have TAB section:
      // Build tab heads:
      $qsa("section.TAB .TabHead ul li").forEach((e) => {
        e.innerHTML = /*html*/`
          <a>
            <span class="icon is-small"><i class="${e.dataset.icon}"></i></span>
            <span>${e.dataset.name}</span>
          </a>
        `;
      });
      // init first tab:
      $qs("section.TAB .TabHead ul li").classList.add('is-active');
      $qs(".TabBody div").classList.remove("is-hidden");
      // init click:
      $qsa(".tabs ul li").forEach((Tli) => {
        Tli.addEventListener("click", () => {
          (Tli.dataset.active) ? eval(Tli.dataset.active) : null; // run function when click tabHead
          let thisSection = Tli.parentElement.parentElement.parentElement.parentElement;
          thisSection.querySelector(".tabs ul li.is-active").classList.remove('is-active'); //remove First Active Element
          Tli.classList.add('is-active'); //Active itself 
          //show corresponding tab content:
          thisSection.querySelectorAll(".TabBody > div").forEach((z) => {
            z.classList.add('is-hidden')
          });  //hide all
          ($id(Tli.id + '-body'))
            ? $id(Tli.id + '-body').classList.remove('is-hidden')
            : console.warn('"' + Tli.id + '-body" id not found!');
        });
      });
    }
  }
  static next(TabsId, wrap = true) {
    let next;
    let tab = $id(TabsId); //the current TAB section
    let headList = tab.querySelectorAll('.TabHead ul li') || null;
    let onActive = tab.querySelector('.TabHead li.is-active') || null;
    let try_next = onActive.nextElementSibling;
    (!try_next && wrap) ? next = headList[0] : next = try_next;
    next.click();
  }
}
class UI {
  static init() {
    tabs.init()
    UI.initNav()
    UI.initDrag()
    UI.initNotification()
    UI.initZoomableImg()
    UI.initNewTabClass()
  }
  static initZoomableImg() {
    $qsa('img.zoomable').forEach((e) => {
      e.style = "cursor:zoom-in";
      e.addEventListener('click', () => {
        let z = e.cloneNode(true);
        z.style = ""//remove cursor:zoom-in
        z.width = "auto"; z.height = "auto";
        z.style.width = "100%";
        z.style.height = "auto";
        modal.push(z.outerHTML);
      });
    });
  }
  static initNewTabClass() {
    let s = document.createElement('span'); s.classList.add('icon')
    s.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i>`
    $qsa('a.navbar-item.newtab, .button.newtab').forEach(a => {
      if (a.classList.contains('icon-text')) {
        a.appendChild(s.cloneNode(true))
      } else {
        a.innerHTML = `<span>${a.innerHTML}</span>${s}`;
      }
    })
  }
  static initNav() {
    function _init() {
      var current_href = $qs(`nav a[href="${location.pathname}"]`) || null
      if (current_href) current_href.classList.add('is-active')
      // Make Bulma Burger Menu Interactive:
      const navBurger = $qs(".navbar-burger") || null
      const navMenu = $qs(".navbar-menu") || null
      if (navBurger && navMenu) {
        navBurger.addEventListener("click", (ev) => {
          ev.stopPropagation();
          navBurger.classList.toggle("is-active");
          navMenu.classList.toggle("is-active");
        })
      }
      UI.initDropDown()
      UI.initFooter()
    }
    if (!$qs('nav.navbar')) {
      fetch('/static/html/nav.html').then(r => r.text())
        .then(t => {
          var parser = new DOMParser();
          var nav = parser.parseFromString(t, "text/html");
          nav = nav.querySelector('nav')
          document.body.insertBefore(nav, document.body.firstChild);
          _init()
        }).catch(e => console.log(e))
    } else {
      _init()
    }
  }
  static initFooter() {
    if (!$qs('footer.footer')) {
      fetch('/static/html/footer.html').then(r => r.text())
        .then(t => {
          var parser = new DOMParser();
          var z = parser.parseFromString(t, "text/html");
          var f = z.querySelector('footer')
          document.body.appendChild(f)
          window.dispatchEvent(new Event('navload'))
        }).catch(e => console.log(e))
    } else {
      window.dispatchEvent(new Event('navload'))
    }
  }
  static initDropDown() {
    const navDropdown = $qsa(".navbar-item.has-dropdown") || null;
    if (navDropdown) {
      navDropdown.forEach((e) => {
        e.addEventListener("click", (ev) => {
          ev.stopPropagation();
          let z = e.querySelector(".navbar-dropdown");
          z.classList.toggle("is-active");
        });
      });
    }
    const generalDropdownBtn = $qsa(".dropdown:not(.is-hoverable) .dropdown-trigger button") || null;
    if (generalDropdownBtn) {
      generalDropdownBtn.forEach((btn) => {
        btn.parentElement.parentElement.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        btn.addEventListener("click", (event) => {
          event.stopPropagation();
          btn.parentElement.parentElement.classList.toggle('is-active');
        });
      });
    }
    // Trigger all dropdown close when click outside:
    document.addEventListener('click', (ev) => { if (ev.target) UI.closeAllDropdown() });
  }
  static closeAllDropdown() {
    let Arr = $qsa('.navbar-dropdown.is-active,.dropdown.is-active')
    Arr.forEach((e) => {
      e.classList.remove('is-active')
    });
    if (Arr.length) return true
    else return false;
  }
  static initDrag() {
    $qsa('.uploadArea').forEach((e) => {
      if (e.classList.contains('showExt')) {
        let AllowExts = e.accept.split(',').map(x => x.trim().slice(1));
        let help = document.createElement('div');
        help.classList.add('help', 'mb-1', 'tags');
        AllowExts.forEach(ext => {
          help.innerHTML += `<span class="tag is-light">${ext}</span>`;
        })
        e.parentElement.prepend(help)
      }
      e.addEventListener('dragenter', () => { UI.drag(e, 'enter') })
      e.addEventListener('dragleave', () => { UI.drag(e, 'leave') })
      e.addEventListener('drop', () => { UI.drag(e, 'drop') })
      e.addEventListener('change', () => {
        e.value ? UI.drag(e, 'drop') : UI.drag(e, 'leave')
      })
    })
  }
  static drag(e, type) {
    //<input type=file class=uploadArea>
    let txCol = { enter: "#cdc1a0", leave: "", drop: "#333333" }
    let bgCol = { enter: "#cdc1a0", leave: "", drop: "#fbf1bb" }
    let boCol = { enter: "#f14668", leave: "", drop: "#48c78e" }
    if (e.classList.contains('uploadArea')) {
      e.style = `
        color: ${txCol[type]};
        background-color: ${bgCol[type]};
        border-color: ${boCol[type]};
      `;
    }
  }
  static initNotification() {
    if (location.protocol == "https:") {
      navigator.serviceWorker.register('/static/js/sw_noti.js?r').then((registration) => {
        Notification.requestPermission((result) => {
          if (result === 'granted') {
            self.addEventListener('noti', (e) => {
              registration.showNotification(e.detail.title, {
                // actions: [
                //   { action: "OPEN", title: "OPEN", },
                // ],
                body: e.detail.body,
                icon: '/static/favicon/favicon-96x96.png',
                vibrate: [200, 100, 200, 100, 200, 100],
                tag: 'aki-noti-' + Date.now()
              });
            });
          }
        })
      })
    } else {
      console.warn("Notification register failed because protocol is not https");
    }
  }
  static fieldCheck(inpEle, stat = 0 | 1) {
    // make field success/danger and corresponding icon (xmark or check)
    let html = {
      0: `
      <span class="icon is-small is-right has-text-danger">
        <i class="fa-regular fa-circle-xmark"></i>
      </span>`,
      1: `
      <span class="icon is-small is-right has-text-success">
        <i class="fa-regular fa-circle-check"></i>
      </span>`
    }
    let p = inpEle.parentElement
    if (p.parentElement.classList.contains('field')) {
      p.classList.add('has-icons-right')
      let spanDynamic = p.querySelector('span.icon.is-right') || null;
      if (spanDynamic) spanDynamic.remove()
      let tmp = document.createElement('div')
      tmp.innerHTML = html[stat]
      p.append(tmp.querySelector('span'))
      if (stat == 1) {
        inpEle.classList.remove('is-danger')
        inpEle.classList.add('is-success')
        return true
      } else {
        inpEle.classList.remove('is-success')
        inpEle.classList.add('is-danger')
        inpEle.focus()
        return false
      }
    } else {
      console.warn(p.parentElement, 'not contains classList "field"');
    }
  }
  static makeCheck(e, x = true | false, type = 'is' | 'txt' | 'bg') {
    // make element danger/success 
    let bulmaClass = {
      is: { 0: 'is-danger', 1: 'is-success' },
      txt: { 0: 'has-text-danger', 1: 'has-text-success' },
      bg: { 0: 'has-background-danger', 1: 'has-background-success' },
    }
    if (x == 0) {
      e.classList.add(bulmaClass[type][0])
      e.classList.remove(bulmaClass[type][1])
      return false
    } else {
      e.classList.add(bulmaClass[type][1])
      e.classList.remove(bulmaClass[type][0])
      return true
    }
  }
}
class noti {
  static send(title = 'Title', body = "Body") {
    window.dispatchEvent(new CustomEvent(
      'noti', { detail: { title: title, body: body } }))
  }
  static add(mess = 'Notification', timeout = 10, bulmaClass = 'danger') {
    let t = timeout * 1000
      , pe = $id('NOTI_AREA') // pe: parent element
      , id = pe.children.length + 1;
    // Add stop Propagation for a href in mess:
    let messEle = document.createElement('span')
    messEle.innerHTML = mess
    messEle.querySelectorAll('a[href]')
      .forEach((a) => { a.setAttribute('onclick', 'event.stopPropagation()') });
    let noti = document.createElement('div')
    noti.id = 'noti_' + id;
    noti.classList.add('box', 'notification', `is-${bulmaClass}`)
    noti.innerHTML = `<div class="node has-text-centered">${messEle.innerHTML}</div>`
    noti.addEventListener('click', (ev) => {
      ev.stopPropagation(); fx.clear(`noti_${id}`)
    })
    pe.appendChild(noti)
    noti.addEventListener('animationend', (ev) => {
      if (ev.animationName == "fx-clear-fade") noti.remove()
    })
    setTimeout(() => { noti.classList.add('show') }, 100);
    //prepare auto remove:
    setTimeout(() => fx.clear(`noti_${id}`), t);
  }
  static clear() {
    let Arr = $qsa('.notification');
    Arr.forEach((n) => { fx.clear(n.id); });
    if (Arr.length) return true
    else return false;
  }
}
class KeyCommand {
  static init() {
    document.addEventListener('keydown', (e) => {
      // console.log(e.key);
      // Priority: modal > noti > Dropdown > closeBtn 
      if (e.key === 'Escape') {
        if (($id('MainModal').classList.contains("is-active"))) {
          modal.close()
        } else {
          if (!noti.clear()) {
            UI.closeAllDropdown() ? '' : $qsa('button.close').forEach(b => b.click());
          }
        }
      } else if (e.key === 'Enter') {
        ($id('modalBtnSubmit')) ? $id('modalBtnSubmit').click() : null;
      }
    });
  }
}
class slideshow {
  static AutoRunList = [];
  static init() {
    let idcount = 0, h1, h2, bg;
    //<div class="slideChild" data-h1="" data-h2="Fees management" data-bg=""></div>
    ($qsa('.slideShow') || []).forEach((s) => { // s: each Slideshow
      let chidCount = 0; idcount += 1;
      s.id = `slideShowContainer_${idcount} `
      s.dataset.select = 0; s.dataset.running = 0;
      s.innerHTML += '<div class="indicatorBox"></div>';
      s.querySelectorAll('.slideChild').forEach((e) => {
        (e.dataset.h1) ? h1 = e.dataset.h1 : h1 = "";
        (e.dataset.h2) ? h2 = e.dataset.h2 : h2 = "";
        (e.dataset.bg) ? bg = e.dataset.bg : bg = "";
        e.innerHTML = `
          <div class="ss-text">
            <h1 class="is-size-4"> ${h1} </h1>
            <h2 class="is-size-6"> ${h2} </h2>
          </div >
        `;
        e.style = `background-image: url('${bg}');`;
        e.parentElement.parentElement.querySelector('.indicatorBox').innerHTML += `
        <span class=indicator
        onmouseover  = "slideshow.select(this,${chidCount})"
        ontouchstart = "slideshow.select(this,${chidCount})"
        onmouseleave = "slideshow.run(this.parentElement.parentElement)"
        ontouchend = "slideshow.run(this.parentElement.parentElement)"
        ></span>
          `;
        chidCount += 1;
        s.dataset.chidCount = chidCount;
      });
      this.show(s, s.dataset.select);
      this.run(s);
    });
  }
  static run(slideObj) {
    let s = slideObj, x;
    if (s.dataset.running == 0) {
      x = setInterval(() => {
        ((+s.dataset.select + 1) == s.dataset.chidCount)
          ? s.dataset.select = 0
          : s.dataset.select++;
        this.show(s, s.dataset.select);
      }, 4000);
      s.dataset.running = 1;
      this.AutoRunList[s.id] = x;
    }
  }
  static select(indicator, i) {
    let s = indicator.parentElement.parentElement;
    clearInterval(this.AutoRunList[s.id]);
    s.dataset.select = i;
    s.dataset.running = 0;
    this.show(s);
  }
  static show(slideObj) {
    let slide = slideObj, i = slide.dataset.select;
    slide.querySelectorAll('.show').forEach((e) => { e.classList.remove('show') });
    slide.querySelectorAll('.slideChild')[i].classList.add('show');
    slide.querySelectorAll('.indicator')[i].classList.add('show');

  }
}
const AkiAuth = {
  regURL: "/api/?v=register",
  logged: undefined,
  uname: undefined,
  fname: undefined,
  init: () => {
    var AuthEle = $qs('.AUTH') || null
    if (AuthEle) {
      let uNameEle = $qs('.AUTH .user-fullname');
      fetch(APIURL + "?v=auth")
        .then(r => r.json())
        .then(j => {
          // console.log(j) // DEB
          noti.add(`Hello ${j.fname}(${j.uname})`, 1, 'warning')
          uNameEle.innerHTML = j.fname;
          if (j.admin) {
            uNameEle.classList.add('has-text-warning')
            uNameEle.title = "Tài khoản có quyền Admin"
          } else {
            uNameEle.classList.remove('has-text-warning')
            uNameEle.title = "Tài khoản thường"
          }
          AkiAuth.logged = j.logged; AkiAuth.uname = j.uname; AkiAuth.fname = j.fname
          if (j.logged) {
            // Change UI to LOGGED USER:
            $qsa('.AUTH .LOGGED0').forEach(e => { e.classList.add('is-hidden') })
            $qsa('.AUTH .LOGGED1').forEach(e => { e.classList.remove('is-hidden') })
          } else {
            // Change UI to GUEST USER:
            $qsa('.AUTH .LOGGED0').forEach(e => { e.classList.remove('is-hidden') })
            $qsa('.AUTH .LOGGED1').forEach(e => { e.classList.add('is-hidden') })
          }
          window.dispatchEvent(new Event('authload'))
        }).catch(e => { console.log(e); })
    } else {
      console.warn('No AUTH class found!');
    }
  },
  register: (regURL = AkiAuth.regURL) => {
    if (AkiAuth.logged) AkiAuth.logout()
    else {
      if (location.pathname + location.search != regURL) {
        location.href = regURL
      }
    }
  },
  login: () => {
    let f = $id('loginForm') || null
    if (f) {
      let UoE = f.querySelector('input[name=emailOrUname]')
      UoE.value = removeAccents(UoE.value).replaceAll(/[^A-Za-z0-9.@]/g, '')
      let uname = UoE.value
      let pass = f.querySelector('input[name=password]').value
      let data = new FormData();
      data.append("action", 'login');
      data.append("emailOrUname", uname);
      data.append("password", pass);
      fetch(APIURL, { method: "POST", body: data })
        .then(r => r.json())
        .then(j => {
          // console.log(j); // DEB
          if (j.logged) {
            noti.add(`Đăng nhập thành công!<br>${j.MESS}`, 3, 'success')
            if (location.pathname + location.search == AkiAuth.regURL) {
              location.href = '/#'
            } else {
              setTimeout(() => { location.reload() }, 500)
            }
          } else {
            noti.add(`${j.MESS}`, 3, 'danger')
          }
        })
    } else {
      noti.add('Lỗi, không có form đăng nhập', 2)
    }
  },
  logout: () => {
    if (AkiAuth.logged) {
      fetch(APIURL + "?v=logout").then(r => r.text())
        .then(t => {
          noti.add(t, 4, 'info');
          setTimeout(() => { location.reload() }, 900)
        })
    }
  }
}

class test {
  static lastCommand;
  static notiColors() {
    let arr = ['light', 'warning', 'success', 'primary', 'info', 'link', 'dark', 'danger'];
    arr.forEach((e, i) => {
      noti.add(`This is notification ${i + 1} for test Colors`, 99, e);
    });
  }
  static run() {
    let cmd = prompt('Enter command: ', this.lastCommand);
    this.lastCommand = cmd;
    eval(cmd);
  }
  static sendDelayNoti() {
    setTimeout(noti.send, 1000);
  }
}

function checkCompatibility() {
  // iOS Check:
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    let list_ok = ["15.2", "15.6", "13.2"]
      , list_er = ["14.3"]
      , $v = (navigator.appVersion)
        .match(/OS ((\d+_?){2,3})\s/)[0].match(/\d{1,2}_\d{1,2}/s)[0].replace(/_/g, ".");
    if (list_er.includes($v)) {
      noti.add(`
        Một số phiên bản < b > iOS</b > có lỗi khiến các trình duyệt web hoạt động không đúng: <br>
        <p class="has-text-left">
          Phiên bản có lỗi  (đã test): ${list_er.join(' ')} <br>
            Phiên bản ổn định (đã test): ${list_ok.join(' ')}
        </p><br>
          Phiên bản iOS của bạn: <b>${$v}</b>
          `, 25)
    }
  }
}
// addEventListener('navload', () => {
//   AkiAuth.init();
// }, { once: true })

addEventListener('DOMContentLoaded', () => {
  checkCompatibility();
  UI.init();
  modal.init();
  slideshow.init();
  loader.init();
  KeyCommand.init();
  CDR.run();
});

addEventListener('load', () => {

  $id("MAIN_PRELOAD").hidden = true;
});