# chat-widget-for-slack
Integration a website in-page chat and slack platform. Slack channel conversations on your own site.

## Getting Started (development)

- Clone the repo: 
```
git clone https://github.com/diglabby/chat-widget-for-slack.git
```
- Install latest [Node](https://nodejs.org/)

- install dependencies
```
npm install
```
- serve with hot reload at localhost:8080
```
npm run dev
```
- build for production with minification
latest build will appear in /dist directory
```
npm run build
```
- build for production and view the bundle analyzer report
```
npm run build --report
```
- run unit tests
```
npm run unit
```
- run e2e tests
```
npm run e2e
```
- run all tests
```
npm test
```

## Deployment

How to deploy this on a live system

- Download latest [build](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/diglabby/chat-widget-for-slack/tree/master/dist/slackChatWidget)
- Copy arhive to your site root directory and unpack;
- add line
```html
<script src="slackChatWidget/slackWidgetLoader.js"></script>
```
to 
```html
<head></head>
```
section of target page

- add your slack bot [token](https://slack.com/apps/manage/custom-integrations) inside file *"slackChatWidget/token.key"*

- add your slack channel inside *config.js*. 
```
channel: "XXXXXX"
```
- inside *config.js* you have all editable widget parameters. 

## Modules documentation
[docs](docs/)

## Built With

* [WEBPACK](https://webpack.js.org/) - Dependency Management

## Authors

* **it.falanster.by**

See also the list of [contributors](https://github.com/diglabby/chat-widget-for-slack/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to [`https://github.com/jackmoore/autosize`](https://github.com/jackmoore/autosize) - autosize plugin
