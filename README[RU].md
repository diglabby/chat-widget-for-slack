# chat-widget-for-slack

Интеграция веб-сайта на странице чата и слабину платформы. Слабые разговоры каналов на вашем собственном сайте.

Интреграция чата на страницу любого веб-сайта и slack платформ.Простые каналы для диалогов на вашем сообственном сайте.

## Установка

Что вам нужно установить и как это сделать.

- Склонируйте репозиторий: `git clone https://github.com/twbs/bootstrap.git`
- Установите последню версию NodeJS (https://nodejs.org/)

Установите необходимые модули через npm внутри директории в которой был склонирован репозиторий следующей командой:
```
npm install

```
Для запуска dev сервера по адресу localhost:8080 используйте команду:

```
npm run dev
```

Для сборки проекта используйте команду:

```
npm run build
```
Последняя версия сборки появится в директории: /dist 

## Разработка

Как развернуть это в уже существующем проекте 

- Скачайте архив https://github.com/diglabby/chat-widget-for-slack/archive/master.zip
- Распакуйте архив;
- Перейдите в директорию chat-widget-for-slack-master/dist
- Скопируйте директорию slackChat в директорию вашего проекта с файлом "index"
- Откройте dist/php/requestHandler.php.sample
- Измените строку 
```
$token = '';
``` 
to 
```
$token = 'ВАШ ТОКЕН'; 
```
"ВАШ ТОКЕН" - это токен для вашего slack бота.

- Переименуйте файл requestHandler.php.sample, в файл requestHandler.php
- указажите путь к файлу requestHandler.php,в файле config.js

- Добавьте следующий код внутри своей страницы внутри тэга <head></head>  


```
 <script src="dist/config.js" ></script>
 <link href="dist/style.bundle.css" rel="stylesheet">
 <script type="dist/text/javascript" src="app.bundle.js">
```
- Внутри файла dist/config.js у вас находятся все настройки виджета

## Инструменты

* [WEBPACK](https://webpack.js.org/) - сборка проекта

## Авторы

* **it.falanster.by**

Смотрите также список участников [contributors](https://github.com/diglabby/chat-widget-for-slack/contributors) принимавших участие в проекте

## Лицензия

Этот проект распростроняеться под лицензией MIT - для подробностей смотрите файлы [LICENSE.md](LICENSE.md)  

## Acknowledgments

* Спасибо https://github.com/krasimir/absurd/blob/master/lib/processors/html/helpers/TemplateEngine.js за движок шаблонов;
