(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueValidator = factory());
}(this, function () { 'use strict';

    /**
     * Получить строковой переменной значения
     */
    function toString(value) {
        return value === undefined || value === null
          ? ''
          : value.toString().trim();
    }

    var ruleset = {
        textType: function(value, input, param) {
            value = toString(value);   //Требуется(установлен)проверьте, что значение должно быть преобразовано в строку, следующую используется, чтобы вычислить длину, или количество, или 0 является недопустимым
            var pattern =  /[`!?{}=*!;><#]/i ,
                valid = pattern.test(value);
            return {
                valid: valid,
                msg: ( valid ? 'Введены недопустимые символы, исправьте ваше сообщение' : '')
            };
        },

        /**
         *          RADIO\CHECKBOX
         * 
         */
        /**
         * Требуется(установлен)проверить
         */
        required: function(value, input) {      
            value = toString(value);   //Требуется(установлен)проверьте, что значение должно быть преобразовано в строку, следующую используется, чтобы вычислить длину, или количество, или 0 является недопустимым
            var valid = !!value.length,
                isCheckable = input.tagName === 'SELECT' ||
                              ['radio', 'checkbox'].indexOf(input.type) > -1;
            return {
                valid: valid,
                msg: valid ? '' : (isCheckable ? 'Пожалуйста, выберите пункт' : 'Пожалуйста, заполните это поле')
            };
        },
        /**
         *          MIN-LENGTH
         * 
         */
        /**
         * проверка на минимальную длину 
         * @param param {String} Минимальный входной сколько символов
         */
        minlength: function(value, input, param) {
            value = toString(value);   //Требуется(установлен)проверьте, что значение должно быть преобразовано в строку, следующую используется, чтобы вычислить длину, или количество, или 0 является недопустимым
            var valid = value.length >= parseInt(param);
            return {
                valid: valid,
                msg: (valid ? '' : 'Поле должно состоять минимум ' + param + ' символов'  )
            };
        },
        /**
         *          MAX-LENGTH
         * 
         */
        /**
         * проверка на максимальную длину 
         * Максимальная длина проверка, в основном, для IE9 для textarea То maxlength будет отсутствовать
         * @param param {String} Макстмальное кол-во слов
         */
        maxlength: function(value, input, param) {
            value = toString(value);   //Требуется(установлен)проверьте, что значение должно быть преобразовано в строку, следующую используется, чтобы вычислить длину, или количество, или 0 является недопустимым
            var valid = value.length <= parseInt(param);
            return {
                valid: valid,
                msg: (valid ? '' : 'Пожалуйста, заполните' + param + 'поле')
            };
        },
        /**
         *          EMAIL
         * 
         */
        /**
         * Формат почтового ящика 
         */
        emailType: function(value, input) {
            value = toString(value);   // valueДолжны быть преобразованы в строку, пустая тогда возврат напрямую
            var pattern =  /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
                valid = pattern.test(value);
            return {
                valid: valid,
                msg: (valid ? '' : 'Не верный формат почтового ящика ')
            };
        },
        /**
         *          PHONES
         * 
         */
        /**
         * Формат телефона 
         */
        phoneType: function(value, input) {
            value = toString(value);   // value Должны быть преобразованы в строку, пустая тогда возврат напрямую
            var pattern = /^1[3|4|5|7|8]\d{9}$/,
                valid = pattern.test(value);
            return {
                valid: valid,
                msg: (valid ? '' : 'Неверный формат номера телефона')
            };
        },
        /**
         * Формат стационарный 
         */
        localphoneType: function(value, input) {
            value = toString(value);   // value Должны быть преобразованы в строку, пустая тогда возврат напрямую
            var pattern = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
                valid = pattern.test(value);
            return {
                valid: valid,
                msg: (valid ? '' : 'код формата номера телефона не верен')
            };
        },
        /**
         *          NUMBERS
         * 
         */
        /**
         * Цифровой формат
         */
        numberType: function(value, input) {
            var valid = false,
                msg = 'Пожалуйста, введите цифры';
            if (isNaN(value)) return { valid: valid, msg: msg };
            var min = parseFloat(input.getAttribute('min'));
            var max = parseFloat(input.getAttribute('max'));
            min = isNaN(min) ? -Infinity : min;
            max = isNaN(max) ? Infinity : max;
            msg = value < min ? 'Минимальное количество символов' + min :
                  value > max ? 'Максимальное количество символов' + max : '';
            return {
                valid: !msg,
                msg: msg
            };
        },
        /**
         * Целочисленном формате 
         */
        integerType: function(value, input) {
            if (!/^\d*$/.test(toString(value))) {
                return {
                    valid: false,
                    msg: 'Пожалуйста, введите целое число'
                }
            }
            return ruleset.numberType(value, input);
        }
    };

    /**
     * Для всех элементов формы сразу проверить
     */
    function checkAll(vm, items, NS) {

        var promise,        //Содержит асинхронную проверку форма проверки результатов
            valid = true,   //Вернуть по умолчанию 
            //вернуть по умолчанию
            results = items.map(function(item) {
                return checkItem(vm, item, vm.$get(item.model), NS);
            });

        for (var i = 0; i < results.length; i++) {
            if (typeof results[i].then == 'function') {
                promise = results[i];
                continue;   //Асинхронные проверить результаты позже снова
            }
            if (results[i].valid === false) {
                valid = false;
                items[i].input.focus();
                break;
            }
        }

        if (valid && promise) { // В результате синхронизации, и нужно ждать асинхронный
            return promise.then(function(result) {
                return result.valid;
            });
        }
        return valid;
    }

    /**
     * Проверьте, указывает ли форма уступчив и возвращает результат проверки
     */
    function checkItem(vm, item, value, NS) {

        var ruleName,           //имя правила например required, minlength
            promise,            //Асинхронный результаты проверки 
            ruleResult,         //В стеке одно правило, чтобы проверить результаты
            input = item.input, //Элемент формы 
            result = {          //Проверить результат
                valid: true
            },
            //Будет проверять результаты синхронизации в viewmodel 
            markResult = function (result) {
                vm.$set(NS + '.' + item.model + '.valid', result.valid);
                vm.$set(NS + '.' + item.model + '.msg', result.msg);
            };

        //Для невидимый элемент формы, по умолчанию не проверяют
        if (!input.offsetHeight && input.getAttribute('force-valid') === null) {
            return result;
        }

        //Проверить каждое слово
        for (ruleName in item.rules) {
            if (!toString(value) && ruleName !== 'required') {
                ruleResult = result; // Для Non-требуется проверка, пропустить пустые значения
                continue;
            }
            ruleResult = checkRule(ruleName, value, input, item.rules[ruleName]);
            if (typeof ruleResult.then  == 'function') {    //Асинхронные проверьте правила возврата Promise
                promise = ruleResult;
                continue;   // Для продолжения синхронизации проверить все после переработки
            }
            result = ruleResult;
            if (!result.valid) {    //Проверка синхронизации не передается, непосредственно возвращает ошибку, в конце проверки
                break;
            }
        }
        if (result.valid && promise) { //Браузер-синхронизация на стороне проверить, а необходимость для асинхронных проверки
            result = promise.then(function(asyncResult) {
                markResult(asyncResult);
                return asyncResult;
            });
        } else {  //Не нужно ждать асинхронной проверки
            markResult(result);
        }
        return result;
    }

    /**
     * Проверить, является ли текущее значение соответствует спецификации
     * @return {Object} Проверить результат。Используются следующие поля:
     *      valid: Логическое, то ли на соответствие спецификации
     *      msg: Сообщение об ошибке, если не валидно
     */
    function checkRule(ruleName, value, input, param) {
        if (typeof ruleset[ruleName] !== 'function') {
            throw 'Правила проверки ' + ruleName + 'Не существует!';
        }
        return ruleset[ruleName](value, input, param);
    }

    /**
     * Проверка форм компонентов Vue.js 
     */


    //==================================================================
    //
    // Форма правила проверки установлено, каждое правило-это функция
    //
    // параметры фунциии:
    //     value {String} Пользователь заполнить или выбрать значение
    //     input {Node} связанные с input элементами
    //     param {String} Правила соответствующих параметров, таких как минимальное количество слов, заполнение и т.д.
    //
    // Функция возвращаемое значение-это объект, содержащий два свойства：
    //     valid {Bool} Соблюдение правил
    //     msg {String} Не соответствует сообщение об ошибке правило, когда
    //
    // Если процесс проверки является асинхронным, он может вернуть Promise,
    // То Promise Это resolve значение выше формата обьект
    //
    //==================================================================

    var VueValidator = {};

    // Зарегистрировать пользовательские правила( кастомные проверки)
    VueValidator.addRule = function(ruleName, func) {
        ruleset[ruleName] = func;
    }


    //==================================================================
    //
    //Регистрация  Vue.js directive
    //
    //==================================================================

    VueValidator.install = function(Vue) {

        Vue.directive('validator', {

            /**
             * Инициализировать правила проверки 
             */
            bind: function() {

                var vm = this.vm,           //directive    Принадлежит viewmodel
                    form = this.el,         //directive где форма в экземляре
                    NS = this.expression,   //validator  Namespace Примеры
                    modelMap = {};          //model -> item соответствует

                //Поиск должен проверить поле ввода и соответствующего model
                var items = vm._directives.filter(function(d) {
                    // Найти форма в пределах связанный с данными элемент форма 
                    return  d.name === 'model' &&
                            ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(d.el.tagName) > -1 &&
                            form.contains(d.el);
                }).map(function(d) {
                    return {
                        model: d.expression,
                        input: d.el
                    };
                });

                items.forEach(function(item) {
                    //Устанавить правила
                    item.rules = getRules(item);
                    // Обработка radio и   checkbox 
                    var type = item.input.type,
                        model = item.model;
                    if (type !== 'radio' && type !== 'checkbox') {
                        return;
                    }
                    if (modelMap[model]) { // Этот пункт переработки и предыдущие повторяются
                        modelMap[model].input = item.input;
                        item.duplicated = true;
                    } else {
                        modelMap[model] = item;
                    }
                });

                //Отфильтровать радио и флажок повторить для item
                items = items.filter(function(item) {
                    return !item.duplicated;
                });


                //Создание,Проверить результат,Объект
                vm.$set(NS, {});

                items.forEach(function(item) {
                    //Инициализация
                    initItem(item, vm, NS);
                });

                // Получить всю формы документа
                Object.defineProperty(vm[NS], '$valid', {
                    get: function() {
                        return checkAll(vm, items, NS);
                    }
                });

            },

            /**
             * Шаг привязка событий
             */
            unbind: function() {
            }
        });
    }


    /**
     * Для элемента формы, чтобы быть инициализирован
     */
    function initItem(item, vm, NS) {

        var el = document.createElement('em');

        //мониторинг model менять и проверять
        vm.$watch(item.model, function(value) {
            checkItem(vm, item, value, NS);
        });

        //Ошибка построения контейнера сообщений и инструкций
        vm.$set(NS + '.' + item.model, {
            valid: undefined,
            msg: ''
        });
        el.innerHTML = '{{' + NS + '.' + item.model + '.msg}}';
        item.input.parentNode.appendChild(el);
        vm.$compile(el);

        //Эл-т формы типа ошибки
        /** TODO: Использование метода compile обработки стилей, китайский вход, когда есть ошибка, использовать прямой путь
        item.input.setAttribute(':class', "{'error': !" + NS + "." + item.model + ".valid}");
        vm.$compile(item.input);
        */
        vm.$watch(NS + '.' + item.model + '.valid', function(valid) {
            //item.input.classList[valid === true ? 'remove': 'add']('error');
            var cls = item.input.className;
            if (valid === true) {
                item.input.className = cls.replace(/\berror\b/, '');
            } else {
                item.input.className = cls + ' error';
            }
        });
    }


    /**
     * От одного пункта правил доступа 
     * Может из входной свойства элемента получить
     */
    function getRules(item) {
        var rules = {},
            ruleName,
            ruleParam,
            inputType,
            input = item.input,
            model = item.model;
        for (ruleName in ruleset) {
            if (!ruleset.hasOwnProperty(ruleName)) {
                return;
            }
            inputType = input.getAttribute('data-type') || input.type;
            if (/(\w+)Type$/.test(ruleName)
                && (inputType + 'Type') === ruleName
            ) { //type Проверить
                rules[ruleName] = true;
                continue;
            }
            ruleParam = input.getAttribute(ruleName);
            if (ruleParam !== null) {
                rules[ruleName] = ruleParam || true;
            }
        }
        return rules;
    }

    return VueValidator;

}));