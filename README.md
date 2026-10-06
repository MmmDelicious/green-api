# Telegram Chat

Простой веб-интерфейс для отправки и получения текстовых сообщений в Telegram через [GREEN-API](https://green-api.com/telegram). Тестовое задание разрешает Telegram вместо MAX. Внешний вид взят с [web.max.ru](https://web.max.ru/), как требует ТЗ.

Стек: React 19, TypeScript, Vite. Никаких сторонних библиотек, кроме React.

## Возможности

- Вход по `idInstance` и `apiTokenInstance` из личного кабинета GREEN-API (проверяется через `getStateInstance`)
- Создание чата по номеру телефона (номер проверяется через `checkAccount`)
- Отправка текстовых сообщений: [SendMessage](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- Получение сообщений через [HTTP API](https://green-api.com/telegram/docs/api/receiving/technology-http-api/) (`receiveNotification` / `deleteNotification`)
- Несколько чатов в боковой панели, адаптивная вёрстка для мобильных

## Локальный запуск

Нужен Node.js 20 или новее.

```bash
git clone https://github.com/MmmDelicious/green-api.git
cd green-api
npm install
npm run dev
```

Откройте http://localhost:5173.

Сборка для продакшена: `npm run build`. Готовые файлы появятся в `dist/`.

## Как пользоваться

1. В [личном кабинете GREEN-API](https://console.green-api.com) создайте инстанс Telegram и авторизуйте его.
2. Введите на странице входа `idInstance` и `apiTokenInstance`.
3. Введите номер телефона получателя и нажмите «Создать чат».
4. Напишите сообщение. Ответ получателя появится в чате автоматически.

> В настройках инстанса должно быть включено получение уведомлений о входящих сообщениях, иначе ответы не придут.

## Структура

```
src/
  api/greenApi.ts        запросы к GREEN-API и разбор уведомлений
  hooks/useMessages.ts   цикл получения уведомлений
  components/            LoginForm, Messenger, NewChat, Chat
  types.ts               общие типы
  App.tsx                вход и выход
```
