# Multi language z-i18n with Redis IO

* Download and install test project at (New version 1.0.2): [https://github.com/kimthangatm/test-node-js-z-i18n/](https://github.com/kimthangatm/test-node-js-z-i18n/ "Git Hub")

* New tutorial Node Js Mutiple language & more .. at : [https://kimtatthang.wordpress.com/2015/03/11/multiple-languages-i18n-l10n-in-your-node-js-express-and-redis/](https://kimtatthang.wordpress.com/2015/03/11/multiple-languages-i18n-l10n-in-your-node-js-express-and-redis/ "MULTIPLE LANGUAGES (I18N, L10N) IN YOUR NODE JS, EXPRESS & REDIS")

* Translation module with dynamic json storage in Redis and suport npm: express, z-form...

* When APP Node JS firt run, translation loaded loaded from file or Redis and never reload => Fast

# Example integrate z-i18n with Express + Redis

## Step 1: Install Redis
My computer is MacOS 10.10.2 and currently Redis version is 2.8.19, you can use guide bellow or visit: http://redis.io/download to download and install redis server

```
//Mac OS install
$ wget http://download.redis.io/releases/redis-2.8.19.tar.gz
$ tar xzf redis-2.8.19.tar.gz
$ cd redis-2.8.19
$ make
$ sudo make install
// Restart redis in background Mac OS
$ redis-server > /dev/null &
``` 
**Note:** `When Node Js application running, translation save on Redis, if you want reload cache please follow:`

*Typing into terminal*

```
$ redis-cli
//Result: 127.0.0.1:6379>
$ FLUSHALL
```

## Step 2: Create new project with Express Generator

`Open terminal and typing`

```
// # If you don't have express generator:
// # sudo npm install express-generator -g
cd ~
express test-i18n &amp;&amp; cd test-i18n
sudo npm install
sudo npm install redis z-i18n
sudo npm update
```

## Step 3: Create translation file

```
test-i18n/
└── languages
    ├── en_GB
    │   └── moduleA.en_GB.json
    └── nl_NL
        └── moduleA.nl_NL.json
 
//Code moduleA.en_GB.json
{
  "m_user_name_label" : "User name",
  "m_user_name" : "Enter your user name!",
  "hello_user_name" : "Hello, %s %s year old"
}
//Code moduleA.nl_NL.json
{
  "m_user_name_label" : "Gebruikersnaam",
  "m_user_name" : "Voer uw gebruikersnaam!",
  "hello_user_name" : "Hallo, %s %s jaar oud"
}
```

## Step 4: Configuration Redis and z-I18n
Open test-i18n/app.js and copy/pate bellow code after: var app = express();

```
var app = express();

// Require redis
var redis = require('redis').createClient();
 
// Require z-i18n
var i18n = require('z-i18n');
 
var languages = [
    'en_GB',
    'nl_NL',
    'vi_VN'
];
 
// Set current
i18n.init({current_lang: 'en_GB', default_lang : 'en_GB'});
 
// Or set current_lang/default_lang
// i18n.init({current_lang : 'en_GB', default_lang : 'en_GB'});
 
// Translations into the dutch language.
// i18n.init({current_lang : 'nl_NL', default_lang : 'en_GB'});
 
var languageRedisCache = 'LANGUAGE_CACHE_REDIS';
 
redis.get(languageRedisCache, function (error, result) {
    if (result == null) {
        i18n.add('languages/nl_NL/moduleA.nl_NL.json', 'nl_NL');
        i18n.add('languages/en_GB/moduleA.en_GB.json', 'en_GB');
        global.i18n = i18n;
        global._t = i18n.__;
        //global._ = i18n.__;
        redis.set(languageRedisCache, JSON.stringify(i18n.getTranslation()), redis.print);
    } else {
        i18n.setTranslation(result);
        global.i18n = i18n;
        global._t = i18n.__;
        //global._ = i18n.__;
    }
});
 
//Use middleware to set current language
app.use(function (req, res, next) {
    if (req.query.lang != undefined && languages.indexOf(req.query.lang) >= 0) {
        i18n.setCurrentLang(req.query.lang);
    }else{
        i18n.setCurrentLang(i18n.getDefaultLang());
    }
    next();
});
```

## Step 5: Open routes/index.js

```
var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.get('/', function (req, res, next) {
    var hello = _t('hello_user_name', 'ZaiChi', 25);
    res.render('index', {title: 'Express', hello : hello});
});
 
module.exports = router;
```

## Step 6: Open views/index.jade

```
extends layout
block content
    h1= title
    p Welcome to #{title}
    p "var hello = _t('hello_user_name', 'ZaiChi', 25);"
    p "============================"
    p Result: #{hello}
```

## Step 7: Running express project

`Open terminal and typing`

```
//cd "path_project"
cd ~/test-i18n/
node bin/www
// If you have grunt
grunt
// If you have nodemon
nodemon
```

## Step 8: Testing on browser:

1. Address: `127.0.0.1:3000` . App use default `“en_GB”`

2. Address: `127.0.0.1:3000?lang=nl_NL` . App switch `language “nl_NL”`

3. Address: `127.0.0.1:3000?lang=vi_VN` . Because `“vi_VN”` lang don’t have tranlation key “hello_user_name”, system get default `“hello_user_name”` in `default_language = “en_GB”`



