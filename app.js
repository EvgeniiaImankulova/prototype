const restaurants = [
  {
    id: 1,
    name: 'Test PJP - Marina Diamond',
    legalEntity: 'UAE',
    address: '20/2, улица Советская, Кострома, Костромская область, Россия',
    template: 'WEB-11353-без-дневных-интеров',
    timezone: '(UTC+3:00) Европа/Москва'
  },
  {
    id: 2,
    name: 'Test PJP - Mamzar Centre',
    legalEntity: 'UAE',
    address: 'переулок Джамбула, 21, Санкт-Петербург, Санкт-Петербург, Russia, -',
    template: 'Default',
    timezone: '(UTC+3:00) Европа/Москва'
  },
  {
    id: 3,
    name: 'Test PJP - Wafi Mall',
    legalEntity: 'UAE',
    address: 'оренбургская область, Клещева, деревня Клещнева',
    template: 'Default',
    timezone: '(UTC+11:00) Азия/Средне­кольмск'
  },
  {
    id: 4,
    name: 'WEB10585',
    legalEntity: 'UAE',
    address: 'Москва, Москва, Варшавское шоссе, 118к1',
    template: 'WEB-11353-без-дневных-интеров',
    timezone: '(UTC+3:00) Европа/Москва'
  }
];

let sortColumn = null;
let sortDirection = 'asc';

function renderTable() {
  const tbody = document.getElementById('restaurantsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  let data = [...restaurants];

  if (sortColumn) {
    data.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';

      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal, 'ru');
      } else {
        return bVal.localeCompare(aVal, 'ru');
      }
    });
  }

  data.forEach((restaurant) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    const nameLink = document.createElement('a');
    nameLink.href = '#';
    nameLink.textContent = restaurant.name;
    nameLink.style.color = 'var(--secondary)';
    nameLink.style.textDecoration = 'none';
    nameLink.style.fontWeight = '500';
    nameLink.addEventListener('click', (e) => {
      e.preventDefault();
    });
    tdName.appendChild(nameLink);

    const tdLegal = document.createElement('td');
    tdLegal.textContent = restaurant.legalEntity;

    const tdAddress = document.createElement('td');
    tdAddress.textContent = restaurant.address;

    const tdTemplate = document.createElement('td');
    tdTemplate.textContent = restaurant.template;

    const tdTimezone = document.createElement('td');
    tdTimezone.textContent = restaurant.timezone;

    tr.appendChild(tdName);
    tr.appendChild(tdLegal);
    tr.appendChild(tdAddress);
    tr.appendChild(tdTemplate);
    tr.appendChild(tdTimezone);

    tbody.appendChild(tr);
  });
}

document.querySelectorAll('.sortable').forEach((th) => {
  th.addEventListener('click', () => {
    const column = th.getAttribute('data-column');

    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }

    document.querySelectorAll('.sortable').forEach((el) => {
      el.classList.remove('sort-asc', 'sort-desc');
    });

    th.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');

    renderTable();
  });
});

const addBtn = document.getElementById('addRestaurantBtn');
if (addBtn) {
  addBtn.addEventListener('click', () => {
    alert('Функция добавления ресторана будет здесь');
  });
}

renderTable();
