// Навигация по секциям формы (второй уровень меню)
document.querySelectorAll('.nav__subitem').forEach((link) => {
  link.addEventListener('click', (e) => {
    // Разрешаем переход по якорю с плавной прокруткой
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Переключаем активный подпункт
      document.querySelectorAll('.nav__subitem').forEach((l) => l.classList.remove('nav__subitem--active'));
      link.classList.add('nav__subitem--active');
    }
  });
});

// ---------------------------
// CRM интеграция (заглушка)
// ---------------------------
(function initCrmBindings() {
  const crmData = {
    corpName: 'Test PJP - Mamzar Centre',
    corpUid: '123-123-123',
  };

  const nameInput = document.getElementById('corpName');
  const uidInput = document.getElementById('corpUid');

  if (uidInput) {
    uidInput.value = crmData.corpUid;
    uidInput.disabled = true;
  }

  if (nameInput) {
    nameInput.value = crmData.corpName;
  }
})();

// --------------------------------------
// Переключение поля "Роялти по умолчанию"
// --------------------------------------
(function initRoyaltyToggle() {
  const toggle = document.getElementById('franchiseToggle');
  const royaltyField = document.getElementById('royaltyField');
  if (!toggle || !royaltyField) return;

  const applyVisibility = () => {
    royaltyField.style.display = toggle.checked ? '' : 'none';
  };

  toggle.addEventListener('change', applyVisibility);
  applyVisibility();
})();

// --------------------------------------
// Список мест приготовления блюд (CRUD)
// --------------------------------------
(function initPrepPlaces() {
  const listRoot = document.getElementById('prepPlacesList');
  const input = document.getElementById('prepPlaceInput');
  const addBtn = document.getElementById('prepPlaceAdd');
  if (!listRoot || !input || !addBtn) return;

  /** @type {{ id: string, name: string }[]} */
  let places = [
    { id: cryptoRandomId(), name: '01 Бар' },
    { id: cryptoRandomId(), name: '02 Кухня' },
  ];

  /** @type {string|null} */
  let editingPlaceId = null;

  function cryptoRandomId() {
    // Простая генерация ID без внешних зависимостей
    return 'id-' + Math.random().toString(36).slice(2, 9);
  }

  function render() {
    listRoot.innerHTML = '';
    places.forEach((place) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.gap = '8px';
      row.style.padding = '8px 10px';
      row.style.border = '1px solid #eee';
      row.style.borderRadius = '6px';

      const nameEl = document.createElement('div');
      nameEl.style.flex = '1';
      let nameInputEl = null;
      if (editingPlaceId === place.id) {
        nameInputEl = document.createElement('input');
        nameInputEl.type = 'text';
        nameInputEl.className = 'field__input';
        nameInputEl.value = place.name;
        nameInputEl.style.width = '100%';
        nameEl.appendChild(nameInputEl);
        // Фокус после вставки
        setTimeout(() => nameInputEl && nameInputEl.focus(), 0);
      } else {
        nameEl.textContent = place.name;
      }

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '8px';

      if (editingPlaceId === place.id) {
        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'icon-btn';
        saveBtn.title = 'Сохранить';
        saveBtn.setAttribute('aria-label', 'Сохранить');
        saveBtn.innerHTML = '<img src="icons/add_circle.svg" alt="" style="width: 20px; height: 20px; transform: rotate(45deg);" />';
        saveBtn.addEventListener('click', () => {
          const val = (nameInputEl ? nameInputEl.value : '').trim();
          if (val) {
            place.name = val;
          }
          editingPlaceId = null;
          render();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'icon-btn';
        cancelBtn.title = 'Отменить';
        cancelBtn.setAttribute('aria-label', 'Отменить');
        cancelBtn.innerHTML = '<img src="icons/icon-action-delete.svg" alt="" style="width: 20px; height: 20px; opacity: .6;" />';
        cancelBtn.addEventListener('click', () => {
          editingPlaceId = null;
          render();
        });

        // Save on Enter
        if (nameInputEl) {
          nameInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveBtn.click();
            }
          });
        }

        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
      } else {
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'icon-btn';
        editBtn.title = 'Редактировать';
        editBtn.setAttribute('aria-label', 'Редактировать');
        editBtn.innerHTML = '<img src="icons/mode.svg" alt="" style="width: 20px; height: 20px;" />';
        editBtn.addEventListener('click', () => {
          editingPlaceId = place.id;
          render();
        });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'icon-btn';
        delBtn.title = 'Удалить';
        delBtn.setAttribute('aria-label', 'Удалить');
        delBtn.innerHTML = '<img src="icons/icon-action-delete.svg" alt="" style="width: 20px; height: 20px;" />';
        delBtn.addEventListener('click', () => {
          places = places.filter((p) => p.id !== place.id);
          render();
        });

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
      }

      row.appendChild(nameEl);
      row.appendChild(actions);
      listRoot.appendChild(row);
    });
  }

  addBtn.addEventListener('click', () => {
    const value = input.value.trim();
    if (!value) return;
    places.push({ id: cryptoRandomId(), name: value });
    input.value = '';
    render();
  });

  render();
})();

// --------------------------------------
// Таблица курсов (CRUD)
// --------------------------------------
(function initCourses() {
  const tbody = document.getElementById('coursesTableBody');
  const nameInput = document.getElementById('courseNameInput');
  const addBtn = document.getElementById('courseAddBtn');
  if (!tbody || !nameInput || !addBtn) return;

  /** @type {{ id: string, order: number, name: string }[]} */
  let courses = [
    { id: rid(), order: 1, name: 'Курс основной (Main)' },
    { id: rid(), order: 2, name: 'Десерты (Dessert)' },
  ];

  /** @type {string|null} */
  let editingCourseId = null;

  function rid() {
    return 'c-' + Math.random().toString(36).slice(2, 9);
  }

  function nextOrder() {
    return courses.length ? Math.max(...courses.map((c) => c.order)) + 1 : 1;
  }

  function render() {
    // сортировка по порядку
    courses.sort((a, b) => a.order - b.order);
    tbody.innerHTML = '';
    courses.forEach((course) => {
      const tr = document.createElement('tr');

      const tdOrder = document.createElement('td');
      tdOrder.style.padding = '8px 10px';
      tdOrder.style.borderBottom = '1px solid #eee';
      tdOrder.textContent = String(course.order);

      const tdName = document.createElement('td');
      tdName.style.padding = '8px 10px';
      tdName.style.borderBottom = '1px solid #eee';
      let nameInputEl = null;
      if (editingCourseId === course.id) {
        nameInputEl = document.createElement('input');
        nameInputEl.type = 'text';
        nameInputEl.className = 'field__input';
        nameInputEl.value = course.name;
        nameInputEl.style.width = '100%';
        tdName.appendChild(nameInputEl);
        setTimeout(() => nameInputEl && nameInputEl.focus(), 0);
      } else {
        tdName.textContent = course.name;
      }

      const tdActions = document.createElement('td');
      tdActions.style.padding = '8px 10px';
      tdActions.style.borderBottom = '1px solid #eee';

      if (editingCourseId === course.id) {
        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'icon-btn';
        saveBtn.title = 'Сохранить';
        saveBtn.setAttribute('aria-label', 'Сохранить');
        saveBtn.innerHTML = '<img src="icons/add_circle.svg" alt="" style="width: 20px; height: 20px; transform: rotate(45deg);" />';
        saveBtn.addEventListener('click', () => {
          const val = (nameInputEl ? nameInputEl.value : '').trim();
          if (val) {
            course.name = val;
          }
          editingCourseId = null;
          render();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'icon-btn';
        cancelBtn.title = 'Отменить';
        cancelBtn.setAttribute('aria-label', 'Отменить');
        cancelBtn.innerHTML = '<img src="icons/icon-action-delete.svg" alt="" style="width: 20px; height: 20px; opacity: .6;" />';
        cancelBtn.addEventListener('click', () => {
          editingCourseId = null;
          render();
        });

        if (nameInputEl) {
          nameInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveBtn.click();
            }
          });
        }

        tdActions.appendChild(saveBtn);
        tdActions.appendChild(cancelBtn);
      } else {
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'icon-btn';
        editBtn.title = 'Редактировать';
        editBtn.setAttribute('aria-label', 'Редактировать');
        editBtn.innerHTML = '<img src="icons/mode.svg" alt="" style="width: 20px; height: 20px;" />';
        editBtn.addEventListener('click', () => {
          editingCourseId = course.id;
          render();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'icon-btn';
        deleteBtn.title = 'Удалить';
        deleteBtn.setAttribute('aria-label', 'Удалить');
        deleteBtn.innerHTML = '<img src="icons/icon-action-delete.svg" alt="" style="width: 20px; height: 20px;" />';
        deleteBtn.addEventListener('click', () => {
          courses = courses.filter((c) => c.id !== course.id);
          // Перенумерация порядков
          courses.forEach((c, idx) => (c.order = idx + 1));
          render();
        });

        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
      }

      tr.appendChild(tdOrder);
      tr.appendChild(tdName);
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
  }

  addBtn.addEventListener('click', () => {
    const value = nameInput.value.trim();
    if (!value) return;
    courses.push({ id: rid(), order: nextOrder(), name: value });
    nameInput.value = '';
    render();
  });

  render();
})();
