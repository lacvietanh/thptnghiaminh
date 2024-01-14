const library = {
  init: () => {
    library.listAll();
  },
  AdminPost: () => {
    let f = new FormData($id('admin_manageLib_form'))
    f.append('action', 'UpdateLibraryData')
    fetch(APIURL, { method: 'post', body: f })
      .then(r => r.json())
      .then(j => {
        let col
        j.STATUS ? col = 'success' : col = 'danger'
        noti.add(j.MESS, 3, col)
        library.listAll()
      })
  },
  listAll: () => {
    fetch(APIURL + '?v=listLibrary').then(r => r.json()).then(j => {
      let html = '', tb = '', borBtn = '';
      tb = $qs('#LibraryTable tbody')
      j.forEach((row, i) => {
        borBtn = `<button class="button is-small is-success is-rounded"
         onclick="library.addCart('${row.bid}')"
         style="font-size:0.5rem;">
        <span class="icon m-0"><i class="fa-solid fa-plus fa-2x"></i></span>
        </button>
        `;
        html += `<tr>
        <td>${i}</td>
        <td>${row.updated}</td>
        <td>${row.bid}</td>
        <td>${row.bname}</td>
        <td>${row.categoryCode}</td>
        <td>${row.quantity}</td>
        <td>${row.available || ''}</td>
        <td>${row.price || ''}</td>
        <td>${row.updatedby || ''}</td>
        <td>${borBtn}</td>
        </tr>`;
      })
      tb.innerHTML = html;
    })
  }
}







addEventListener('DOMContentLoaded', () => {
  library.init();
  $qs("#tabs-library .TabHead li#Find").click()

})
addEventListener('authload', () => {
  if (Auth.logged) {
    $id('ManageLibrary').classList.remove('is-hidden')
    $qsa('#admin_manageLib_form input').forEach(e => {
      e.required = true;
    });
  }
})