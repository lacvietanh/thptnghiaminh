var APIURL;
if (location.hostname != 'thptnghiaminh.akivn.net') {
  APIURL = `${location.protocol}//${location.hostname}:3030/api/`
} else {
  APIURL = `${location.protocol}//${location.host}/api/`
}

const home = {
  loadUser: () => {
    let tb = $id('LibraryTable')
      , tbody = tb.querySelector('tbody')
      , thead = tb.querySelector('thead tr')
      , html = ''
      ;
    fetch(APIURL + '?v=listUsers').then(r => r.json()).then(j => {
      if (j) {
        console.log(j) // deb
        let keys = (Object.keys(j[0]).length) // deb
        if (keys > 6) { //admin
          thead.innerHTML += `
            <th class=has-text-info>UserName</th>
            <th class=has-text-info>Email</th>
            <th class=has-text-info>Địa chỉ</th>
            <th class=has-text-info>Sửa</th>
          `;
          j.forEach(e => {
            html += `<tr>
              <td class="counter child"></td>
              <td>${e.fullname}</td>
              <td>${e.classroom}</td>
              <td>${e.phone}</td>
              <td>${e.joined}</td>
              <td>${e.fbid}</td>
              <td>${e.birthday}</td>
              <td>${e.username}</td>
              <td>${e.email}</td>
              <td>${e.address}</td>
              <td>
                <button class="button is-small">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </td>
            </tr>`;
          })
        } else { // general users 
          j.forEach(e => {
            html += `
          <tr>
            <td class="counter child"></td>
            <td>${e.fullname}</td>
            <td>${e.classroom}</td>
            <td>${e.phone}</td>
            <td>${e.joined}</td>
            <td>${e.fbid}</td>
            <td>${e.birthday}</td>
          </tr>
          `
          });
        }
        tbody.innerHTML = html;
        sorttable.makeSortable(tb);
      }
    })
  }
}
addEventListener('load', () => {
  if (location.pathname == '/') {
    home.loadUser();
    $qs('#tabs-1 li#Members').click()
  }
})