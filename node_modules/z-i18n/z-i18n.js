var vsprintf = require('sprintf').vsprintf,
    fs = require('fs').readFileSync,
    debug = require('debug')('i18n:debug'),
    warn = require('debug')('i18n:warn'),
    error = require('debug')('i18n:error'),
    _config = {},
    _translation = {};

/**
 * @public exports
 * @type {Object}
 */
var i18n = exports;

/**
 * Init function
 *
 * <code>
 *     // Require module i18n
 *     var i18n = require('z-i18n');
 *
 *     // Create config
 *     var config = {
 *          current_lang : 'en_GB',
 *          default_lang : 'en_GB'
 *     }
 *
 *     // Init i18n
 *     i18n.init(config);
 * </code>
 *
 * @param {Object} config
 */
i18n.init = function (config) {
    _config = config;
    if (!_config.hasOwnProperty('current_lang')) {
        _config.current_lang = 'en_GB';
    }
    if (!_config.hasOwnProperty('default_lang')) {
        _config.default_lang = 'en_GB';
    }
    _translation[_config.current_lang] = {};
    _translation[_config.default_lang] = {};
}

/**
 * Set translation
 * Use this function if you want use Redis store translation
 *
 * @url Tutorial https://kimtatthang.wordpress.com/2015/03/11/multiple-languages-i18n-l10n-in-your-node-js-express-and-redis/
 * @url Example  https://github.com/kimthangatm/test-node-js-z-i18n
 *
 * @param {Object} translation
 */
i18n.setTranslation = function (translation) {
    if (typeof translation === 'object') {
        _translation = translation;
    } else if (typeof translation === 'string') {
        _translation = JSON.parse(translation);
    }
}

/**
 * Get all translation
 *
 * This function use for test to get translation
 * @returns {Object}
 */
i18n.getTranslation = function () {
    return _translation;
}

/**
 * Set current language
 *
 * @param {String} lang
 */
i18n.setCurrentLang = function (lang) {
    _config.current_lang = lang;
}

/**
 * Get current language
 *
 * @returns {string|*}
 */
i18n.getCurrentLang = function () {
    return _config.current_lang;
}

/**
 * Set default language
 *
 * @param {String} lang
 */
i18n.setDefaultLang = function (lang) {
    _config.default_lang = lang;
}

/**
 * Get default language
 *
 * @returns {string|*}
 */
i18n.getDefaultLang = function () {
    return _config.default_lang;
}

/**
 * Add string path or arrray string path file translation
 *
 * @param {String|Array} filePath
 * @param {String} lang
 */
i18n.add = function (filePath, lang) {
    if (lang == undefined || lang == null) {
        lang = _config.current_lang;
    }
    var content = {};
    if (typeof filePath === 'string') {
        this.addFile(filePath, lang);
    } else if (Array.isArray(filePath)) {
        filePath.forEach(function (file) {
            this.addFile(filePath, lang);
        });
    }
}

/**
 * Add one file translation
 *
 * @param {String} filePath
 * @param {String} lang
 */
i18n.addFile = function (filePath, lang) {
    if(!_translation.hasOwnProperty(lang)){
        _translation[lang] = {};
    }
    try {
        try {
            var translate = JSON.parse(fs(filePath, 'utf8'));
            for (var key in translate) {
                _translation[lang][key] = translate[key];
            }
        } catch (parseError) {
            debug('z-i18n -> File ' + filePath + ' not json file!');
        }
    } catch (readError) {
        debug('z-i18n -> File ' + filePath + ' not exists!');
    }

}

/**
 * Get translation
 *
 * @param {String} str
 * @param {Array} args
 * @returns {String}
 */
i18n.__ = function (str) {
    var msg, namedValues, args;

    // Accept an object with named values as the last parameter
    // And collect all other arguments, except the first one in args
    if (
        arguments.length > 1 &&
        arguments[arguments.length - 1] !== null &&
        typeof arguments[arguments.length - 1] === "object"
    ) {
        //namedValues = arguments[arguments.length - 1];
        args = Array.prototype.slice.call(arguments, 1, -1);
    } else {
        //namedValues = {};
        args = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];
    }

    var translate = str;
    if (_translation.hasOwnProperty(_config.current_lang) && _translation[_config.current_lang][str]) {
        translate = _translation[_config.current_lang][str];
    }else{
        if (_translation.hasOwnProperty(_config.default_lang) && _translation[_config.default_lang][str]) {
            translate = _translation[_config.default_lang][str];
        }
    }

    if (args.length > 0) {
        try{
            return vsprintf(translate, args);
        }catch (error){
            return translate;
        }
    }
    return translate;
}