
<div style="text-align: center;">
    <img src="https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/logo.png" alt="Project Banner" />
</div>

## Описание
Это фронтенд часть веб-сервиса для проведения тестирования студентов в учебном заведении. Система предназначена для удобного управления тестами, студентами и преподавателями.


## Стек технологий
<div>
<img src="https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/react/react-original-wordmark.svg" title="React" alt="React" width="40" height="40"/>&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/typescript/typescript-original.svg" title="JavaScript" alt="JavaScript" width="40" height="40"/>&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/redux/redux-original.svg" title="Redux" alt="Redux " width="40" height="40"/>&nbsp;
</div>



## Основные Функции

- **Администратор**
    - Управление преподавателями и группами.
    - Генерация таблиц с данными о студентах и преподавателях в формате JPG (логин, пароль, ФИО).
    - Привязка преподавателей к группам для контроля их тестов.
    - Просмотр и сортировка тестов по группам.
    - Полный доступ к функционалу преподавателя.

- **Преподаватель**
    - Просмотр,добавление групп и доступ к их страницам.
    - Добавление тестов, привязанных к определённой группе.
    - Просмотр результатов тестов студентов с подробной статистикой.
    - Настройка тестов: добавление сроков, ограничение времени на выполнение, настройка видимости результатов.

- **Студент**
    - Доступ к тестам преподавателей, привязанных к группе студента.
    - Прохождение тестов с различными типами вопросов (текстовый ответ, одиночный выбор, множественный выбор).
    - Просмотр результатов, если преподаватель разрешил их отображение.



## Основные Страницы

### Главная Страница Администратора

На этой странице представлены:
1. Список преподавателей с функцией добавления новых.
2. Управление группами:
    - Создание, удаление, и просмотр таблицы студентов в группе.
    - Привязка преподавателей к группе.


![Admin main](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_admin_main.png)

---

### Главная Страница Преподавателя

На странице доступны:
1. Список всех групп с возможностью добавления и перехода на их страницы.
2. Список тестов с функцией сортировки по группам.
3. Возможность поделиться и удалить тест

![Teacher main](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_teacher_main.png)

---

### Главная Страница Студента

На странице отображаются:
1. Список преподавателей, привязанных к группе студента.
2. Тесты, с указанием информации о тесте.

![Student main](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_student_main.png)

---

### Страница Теста

При открытии теста отображается:
1. Информация о тесте:
    - Название, срок выполнения, количество вопросов, время прохождения.
2. Кнопка "Начать тест".

Во время прохождения теста:
- У каждого вопроса может быть:
    - Фото.
    - Ограничение по времени.
    - Тип вопроса: одиночный выбор, множественный выбор, текстовый ответ.
  

- У теста может быть:
  - Ограничение по времени выполнения
  
![test start](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_test_start.png)
![test question](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_test_question.png)

---

### Страница Создания Теста

На странице доступны:
1. Удобная форма для добавления вопросов:
    - Поля для ввода текста вопросов и вариантов ответов.
    - Автоматическое создание вопроса по шаблону.
2. Настройки теста:
    - Сроки выполнения.
    - Ограничение времени на выполнение.
    - Видимость результатов.
3. Таблица с результатами прохождения теста:
    - ФИО студента, оценка, дата начала, время завершения.
    - Информация о времени выполнения и статусе завершения теста.


![test edit form](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_test_edit.png)
![test start](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_test_settings.png)
![test stats](https://raw.githubusercontent.com/pashkov256/media/refs/heads/main/voprosnikum/page_test_stats.png)
---


