(() => {
    "use strict";
    const modules_flsModules = {};
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) {
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    tabsTitles[index].setAttribute("data-tabs-title", "");
                    tabsContentItem.setAttribute("data-tabs-item", "");
                    if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                    tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
                }));
            }
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) ;
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                headerItemHeight = document.querySelector(headerItem).offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if ("click" === e.type) {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if ("watcherCallback" === e.type && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if ("navigator" === targetElement.dataset.watch) {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    var __defProp = Object.defineProperty;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
    var __publicField = (obj, key, value) => {
        __defNormalProp(obj, "symbol" !== typeof key ? key + "" : key, value);
        return value;
    };
    const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const INTEGER_REGEXP = /^-?[0-9]\d*$/;
    const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    const STRONG_PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isEmpty = value => {
        let newVal = value;
        if ("string" === typeof value) newVal = value.trim();
        return !newVal;
    };
    const isEmail = value => EMAIL_REGEXP.test(value);
    const isLengthMoreThanMax = (value, len) => value.length > len;
    const isLengthLessThanMin = (value, len) => value.length < len;
    const isNumber = value => {
        if ("string" !== typeof value) return false;
        return !isNaN(+value) && !isNaN(parseFloat(value));
    };
    const isInteger = value => INTEGER_REGEXP.test(value);
    const isPassword = value => PASSWORD_REGEXP.test(value);
    const isStrongPassword = value => STRONG_PASSWORD_REGEXP.test(value);
    const isNumberMoreThanMax = (value, len) => value > len;
    const isNumberLessThanMin = (value, len) => value < len;
    const isInvalidOrEmptyString = value => "string" !== typeof value || "" === value;
    var Rules = (Rules2 => {
        Rules2["Required"] = "required";
        Rules2["Email"] = "email";
        Rules2["MinLength"] = "minLength";
        Rules2["MaxLength"] = "maxLength";
        Rules2["Password"] = "password";
        Rules2["Number"] = "number";
        Rules2["Integer"] = "integer";
        Rules2["MaxNumber"] = "maxNumber";
        Rules2["MinNumber"] = "minNumber";
        Rules2["StrongPassword"] = "strongPassword";
        Rules2["CustomRegexp"] = "customRegexp";
        Rules2["MinFilesCount"] = "minFilesCount";
        Rules2["MaxFilesCount"] = "maxFilesCount";
        Rules2["Files"] = "files";
        return Rules2;
    })(Rules || {});
    var GroupRules = (GroupRules2 => {
        GroupRules2["Required"] = "required";
        return GroupRules2;
    })(GroupRules || {});
    var CustomStyleTagIds = (CustomStyleTagIds2 => {
        CustomStyleTagIds2["Label"] = "label";
        CustomStyleTagIds2["LabelArrow"] = "labelArrow";
        return CustomStyleTagIds2;
    })(CustomStyleTagIds || {});
    const defaultDictionary = [ {
        key: Rules.Required,
        dict: {
            en: "The field is required"
        }
    }, {
        key: Rules.Email,
        dict: {
            en: "Email has invalid format"
        }
    }, {
        key: Rules.MaxLength,
        dict: {
            en: "The field must contain a maximum of :value characters"
        }
    }, {
        key: Rules.MinLength,
        dict: {
            en: "The field must contain a minimum of :value characters"
        }
    }, {
        key: Rules.Password,
        dict: {
            en: "Password must contain minimum eight characters, at least one letter and one number"
        }
    }, {
        key: Rules.StrongPassword,
        dict: {
            en: "Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
        }
    }, {
        key: Rules.Number,
        dict: {
            en: "Value should be a number"
        }
    }, {
        key: Rules.MaxNumber,
        dict: {
            en: "Number should be less or equal than :value"
        }
    }, {
        key: Rules.MinNumber,
        dict: {
            en: "Number should be more or equal than :value"
        }
    }, {
        key: Rules.MinFilesCount,
        dict: {
            en: "Files count should be more or equal than :value"
        }
    }, {
        key: Rules.MaxFilesCount,
        dict: {
            en: "Files count should be less or equal than :value"
        }
    }, {
        key: Rules.Files,
        dict: {
            en: "Uploaded files have one or several invalid properties (extension/size/type etc)."
        }
    } ];
    const DEFAULT_ERROR_FIELD_MESSAGE = "Value is incorrect";
    const isPromise = val => "object" === typeof val && null !== val && "then" in val && "function" === typeof val.then;
    const getNodeParents = el => {
        let elem = el;
        const els = [];
        while (elem) {
            els.unshift(elem);
            elem = elem.parentNode;
        }
        return els;
    };
    const getClosestParent = (groups, parents) => {
        const reversedParents = [ ...parents ].reverse();
        for (let i = 0, len = reversedParents.length; i < len; ++i) {
            const parent = reversedParents[i];
            for (const key in groups) {
                const group = groups[key];
                if (group.groupElem === parent) return [ key, group ];
            }
        }
        return null;
    };
    const getClassList = classList => {
        if (Array.isArray(classList)) return classList.filter((cls => cls.length > 0));
        if ("string" === typeof classList && classList.trim()) return [ ...classList.split(" ").filter((cls => cls.length > 0)) ];
        return [];
    };
    const isElement = element => element instanceof Element || element instanceof HTMLDocument;
    const errorLabelCss = `.just-validate-error-label[data-tooltip=true]{position:fixed;padding:4px 8px;background:#423f3f;color:#fff;white-space:nowrap;z-index:10;border-radius:4px;transform:translateY(-5px)}.just-validate-error-label[data-tooltip=true]:before{content:'';width:0;height:0;border-left:solid 5px transparent;border-right:solid 5px transparent;border-bottom:solid 5px #423f3f;position:absolute;z-index:3;display:block;bottom:-5px;transform:rotate(180deg);left:calc(50% - 5px)}.just-validate-error-label[data-tooltip=true][data-direction=left]{transform:translateX(-5px)}.just-validate-error-label[data-tooltip=true][data-direction=left]:before{right:-7px;bottom:auto;left:auto;top:calc(50% - 2px);transform:rotate(90deg)}.just-validate-error-label[data-tooltip=true][data-direction=right]{transform:translateX(5px)}.just-validate-error-label[data-tooltip=true][data-direction=right]:before{right:auto;bottom:auto;left:-7px;top:calc(50% - 2px);transform:rotate(-90deg)}.just-validate-error-label[data-tooltip=true][data-direction=bottom]{transform:translateY(5px)}.just-validate-error-label[data-tooltip=true][data-direction=bottom]:before{right:auto;bottom:auto;left:calc(50% - 5px);top:-5px;transform:rotate(0)}`;
    const TOOLTIP_ARROW_HEIGHT = 5;
    const defaultGlobalConfig = {
        errorFieldStyle: {
            color: "#b81111",
            border: "1px solid #B81111"
        },
        errorFieldCssClass: "just-validate-error-field",
        successFieldCssClass: "just-validate-success-field",
        errorLabelStyle: {
            color: "#b81111"
        },
        errorLabelCssClass: "just-validate-error-label",
        successLabelCssClass: "just-validate-success-label",
        focusInvalidField: true,
        lockForm: true,
        testingMode: false,
        validateBeforeSubmitting: false
    };
    class JustValidate {
        constructor(form, globalConfig, dictLocale) {
            __publicField(this, "form", null);
            __publicField(this, "fields", {});
            __publicField(this, "groupFields", {});
            __publicField(this, "errors", {});
            __publicField(this, "isValid", false);
            __publicField(this, "isSubmitted", false);
            __publicField(this, "globalConfig", defaultGlobalConfig);
            __publicField(this, "errorLabels", {});
            __publicField(this, "successLabels", {});
            __publicField(this, "eventListeners", []);
            __publicField(this, "dictLocale", defaultDictionary);
            __publicField(this, "currentLocale", "en");
            __publicField(this, "customStyleTags", {});
            __publicField(this, "onSuccessCallback");
            __publicField(this, "onFailCallback");
            __publicField(this, "onValidateCallback");
            __publicField(this, "tooltips", []);
            __publicField(this, "lastScrollPosition");
            __publicField(this, "isScrollTick");
            __publicField(this, "fieldIds", new Map);
            __publicField(this, "getKeyByFieldSelector", (field => this.fieldIds.get(field)));
            __publicField(this, "getFieldSelectorByKey", (key => {
                for (const [fieldSelector, k] of this.fieldIds) if (key === k) return fieldSelector;
                return;
            }));
            __publicField(this, "getCompatibleFields", (() => {
                const fields = {};
                Object.keys(this.fields).forEach((key => {
                    let newKey = key;
                    const fieldSelector = this.getFieldSelectorByKey(key);
                    if ("string" === typeof fieldSelector) newKey = fieldSelector;
                    fields[newKey] = {
                        ...this.fields[key]
                    };
                }));
                return fields;
            }));
            __publicField(this, "setKeyByFieldSelector", (field => {
                if (this.fieldIds.has(field)) return this.fieldIds.get(field);
                const key = String(this.fieldIds.size + 1);
                this.fieldIds.set(field, key);
                return key;
            }));
            __publicField(this, "refreshAllTooltips", (() => {
                this.tooltips.forEach((item => {
                    item.refresh();
                }));
            }));
            __publicField(this, "handleDocumentScroll", (() => {
                this.lastScrollPosition = window.scrollY;
                if (!this.isScrollTick) {
                    window.requestAnimationFrame((() => {
                        this.refreshAllTooltips();
                        this.isScrollTick = false;
                    }));
                    this.isScrollTick = true;
                }
            }));
            __publicField(this, "formSubmitHandler", (ev => {
                ev.preventDefault();
                this.isSubmitted = true;
                this.validateHandler(ev);
            }));
            __publicField(this, "handleFieldChange", (target => {
                let foundKey;
                for (const key in this.fields) {
                    const field = this.fields[key];
                    if (field.elem === target) {
                        foundKey = key;
                        break;
                    }
                }
                if (!foundKey) return;
                this.fields[foundKey].touched = true;
                this.validateField(foundKey, true);
            }));
            __publicField(this, "handleGroupChange", (target => {
                let foundKey;
                for (const key in this.groupFields) {
                    const group = this.groupFields[key];
                    if (group.elems.find((elem => elem === target))) {
                        foundKey = key;
                        break;
                    }
                }
                if (!foundKey) return;
                this.groupFields[foundKey].touched = true;
                this.validateGroup(foundKey, true);
            }));
            __publicField(this, "handlerChange", (ev => {
                if (!ev.target) return;
                this.handleFieldChange(ev.target);
                this.handleGroupChange(ev.target);
                this.renderErrors();
            }));
            this.initialize(form, globalConfig, dictLocale);
        }
        initialize(form, globalConfig, dictLocale) {
            this.form = null;
            this.errors = {};
            this.isValid = false;
            this.isSubmitted = false;
            this.globalConfig = defaultGlobalConfig;
            this.errorLabels = {};
            this.successLabels = {};
            this.eventListeners = [];
            this.customStyleTags = {};
            this.tooltips = [];
            this.currentLocale = "en";
            if ("string" === typeof form) {
                const elem = document.querySelector(form);
                if (!elem) throw Error(`Form with ${form} selector not found! Please check the form selector`);
                this.setForm(elem);
            } else if (form instanceof HTMLFormElement) this.setForm(form); else throw Error(`Form selector is not valid. Please specify a string selector or a DOM element.`);
            this.globalConfig = {
                ...defaultGlobalConfig,
                ...globalConfig
            };
            if (dictLocale) this.dictLocale = [ ...dictLocale, ...defaultDictionary ];
            if (this.isTooltip()) {
                const styleTag = document.createElement("style");
                styleTag.textContent = errorLabelCss;
                this.customStyleTags[CustomStyleTagIds.Label] = document.head.appendChild(styleTag);
                this.addListener("scroll", document, this.handleDocumentScroll);
            }
        }
        getLocalisedString(rule, ruleValue, customMsg) {
            var _a;
            const search = null != customMsg ? customMsg : rule;
            let localisedStr = null == (_a = this.dictLocale.find((item => item.key === search))) ? void 0 : _a.dict[this.currentLocale];
            if (!localisedStr) if (customMsg) localisedStr = customMsg;
            if (localisedStr && void 0 !== ruleValue) switch (rule) {
              case Rules.MaxLength:
              case Rules.MinLength:
              case Rules.MaxNumber:
              case Rules.MinNumber:
              case Rules.MinFilesCount:
              case Rules.MaxFilesCount:
                localisedStr = localisedStr.replace(":value", String(ruleValue));
            }
            return localisedStr || customMsg || DEFAULT_ERROR_FIELD_MESSAGE;
        }
        getFieldErrorMessage(fieldRule, elem) {
            const msg = "function" === typeof fieldRule.errorMessage ? fieldRule.errorMessage(this.getElemValue(elem), this.fields) : fieldRule.errorMessage;
            return this.getLocalisedString(fieldRule.rule, fieldRule.value, msg);
        }
        getFieldSuccessMessage(successMessage, elem) {
            const msg = "function" === typeof successMessage ? successMessage(this.getElemValue(elem), this.fields) : successMessage;
            return this.getLocalisedString(void 0, void 0, msg);
        }
        getGroupErrorMessage(groupRule) {
            return this.getLocalisedString(groupRule.rule, void 0, groupRule.errorMessage);
        }
        getGroupSuccessMessage(groupRule) {
            if (!groupRule.successMessage) return;
            return this.getLocalisedString(void 0, void 0, groupRule.successMessage);
        }
        setFieldInvalid(key, fieldRule) {
            this.fields[key].isValid = false;
            this.fields[key].errorMessage = this.getFieldErrorMessage(fieldRule, this.fields[key].elem);
        }
        setFieldValid(key, successMessage) {
            this.fields[key].isValid = true;
            if (void 0 !== successMessage) this.fields[key].successMessage = this.getFieldSuccessMessage(successMessage, this.fields[key].elem);
        }
        setGroupInvalid(key, groupRule) {
            this.groupFields[key].isValid = false;
            this.groupFields[key].errorMessage = this.getGroupErrorMessage(groupRule);
        }
        setGroupValid(key, groupRule) {
            this.groupFields[key].isValid = true;
            this.groupFields[key].successMessage = this.getGroupSuccessMessage(groupRule);
        }
        getElemValue(elem) {
            switch (elem.type) {
              case "checkbox":
                return elem.checked;

              case "file":
                return elem.files;

              default:
                return elem.value;
            }
        }
        validateGroupRule(key, elems, groupRule) {
            switch (groupRule.rule) {
              case GroupRules.Required:
                if (elems.every((elem => !elem.checked))) this.setGroupInvalid(key, groupRule); else this.setGroupValid(key, groupRule);
            }
        }
        validateFieldRule(key, elem, fieldRule, afterInputChanged = false) {
            const ruleValue = fieldRule.value;
            const elemValue = this.getElemValue(elem);
            if (fieldRule.plugin) {
                const result = fieldRule.plugin(elemValue, this.getCompatibleFields());
                if (!result) this.setFieldInvalid(key, fieldRule);
                return;
            }
            switch (fieldRule.rule) {
              case Rules.Required:
                if (isEmpty(elemValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.Email:
                if (isInvalidOrEmptyString(elemValue)) break;
                if (!isEmail(elemValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.MaxLength:
                if (void 0 === ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if ("number" !== typeof ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] should be a number. The field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if (isInvalidOrEmptyString(elemValue)) break;
                if (isLengthMoreThanMax(elemValue, ruleValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.MinLength:
                if (void 0 === ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if ("number" !== typeof ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] should be a number. The field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if (isInvalidOrEmptyString(elemValue)) break;
                if (isLengthLessThanMin(elemValue, ruleValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.Password:
                if (isInvalidOrEmptyString(elemValue)) break;
                if (!isPassword(elemValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.StrongPassword:
                if (isInvalidOrEmptyString(elemValue)) break;
                if (!isStrongPassword(elemValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.Number:
                if (isInvalidOrEmptyString(elemValue)) break;
                if (!isNumber(elemValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.Integer:
                if (isInvalidOrEmptyString(elemValue)) break;
                if (!isInteger(elemValue)) this.setFieldInvalid(key, fieldRule);
                break;

              case Rules.MaxNumber:
                {
                    if (void 0 === ruleValue) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        break;
                    }
                    if ("number" !== typeof ruleValue) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        break;
                    }
                    if (isInvalidOrEmptyString(elemValue)) break;
                    const num = +elemValue;
                    if (Number.isNaN(num) || isNumberMoreThanMax(num, ruleValue)) this.setFieldInvalid(key, fieldRule);
                    break;
                }

              case Rules.MinNumber:
                {
                    if (void 0 === ruleValue) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. The field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        break;
                    }
                    if ("number" !== typeof ruleValue) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        break;
                    }
                    if (isInvalidOrEmptyString(elemValue)) break;
                    const num = +elemValue;
                    if (Number.isNaN(num) || isNumberLessThanMin(num, ruleValue)) this.setFieldInvalid(key, fieldRule);
                    break;
                }

              case Rules.CustomRegexp:
                {
                    if (void 0 === ruleValue) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        return;
                    }
                    let regexp;
                    try {
                        regexp = new RegExp(ruleValue);
                    } catch (e) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] should be a valid regexp. This field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        break;
                    }
                    const str = String(elemValue);
                    if ("" !== str && !regexp.test(str)) this.setFieldInvalid(key, fieldRule);
                    break;
                }

              case Rules.MinFilesCount:
                if (void 0 === ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if ("number" !== typeof ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if (Number.isFinite(null == elemValue ? void 0 : elemValue.length) && elemValue.length < ruleValue) {
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                break;

              case Rules.MaxFilesCount:
                if (void 0 === ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if ("number" !== typeof ruleValue) {
                    console.error(`Value for ${fieldRule.rule} rule for [${key}] field should be a number. The field will be always invalid.`);
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                if (Number.isFinite(null == elemValue ? void 0 : elemValue.length) && elemValue.length > ruleValue) {
                    this.setFieldInvalid(key, fieldRule);
                    break;
                }
                break;

              case Rules.Files:
                {
                    if (void 0 === ruleValue) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field is not defined. This field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        return;
                    }
                    if ("object" !== typeof ruleValue) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field should be an object. This field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        return;
                    }
                    const filesConfig = ruleValue.files;
                    if ("object" !== typeof filesConfig) {
                        console.error(`Value for ${fieldRule.rule} rule for [${key}] field should be an object with files array. This field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        return;
                    }
                    const isFilePropsInvalid = (file, fileConfig) => {
                        const minSizeInvalid = Number.isFinite(fileConfig.minSize) && file.size < fileConfig.minSize;
                        const maxSizeInvalid = Number.isFinite(fileConfig.maxSize) && file.size > fileConfig.maxSize;
                        const nameInvalid = Array.isArray(fileConfig.names) && !fileConfig.names.includes(file.name);
                        const extInvalid = Array.isArray(fileConfig.extensions) && !fileConfig.extensions.includes(file.name.split(".")[file.name.split(".").length - 1]);
                        const typeInvalid = Array.isArray(fileConfig.types) && !fileConfig.types.includes(file.type);
                        return minSizeInvalid || maxSizeInvalid || nameInvalid || extInvalid || typeInvalid;
                    };
                    if ("object" === typeof elemValue && null !== elemValue) for (let fileIdx = 0, len = elemValue.length; fileIdx < len; ++fileIdx) {
                        const file = elemValue.item(fileIdx);
                        if (!file) {
                            this.setFieldInvalid(key, fieldRule);
                            break;
                        }
                        const filesInvalid = isFilePropsInvalid(file, filesConfig);
                        if (filesInvalid) {
                            this.setFieldInvalid(key, fieldRule);
                            break;
                        }
                    }
                    break;
                }

              default:
                {
                    if ("function" !== typeof fieldRule.validator) {
                        console.error(`Validator for custom rule for [${key}] field should be a function. This field will be always invalid.`);
                        this.setFieldInvalid(key, fieldRule);
                        return;
                    }
                    const result = fieldRule.validator(elemValue, this.getCompatibleFields());
                    if ("boolean" !== typeof result && "function" !== typeof result) console.error(`Validator return value for [${key}] field should be boolean or function. It will be cast to boolean.`);
                    if ("function" === typeof result) if (afterInputChanged) this.fields[key].asyncCheckPending = true; else {
                        this.fields[key].asyncCheckPending = false;
                        const promise = result();
                        if (!isPromise(promise)) {
                            console.error(`Validator function for custom rule for [${key}] field should return a Promise. This field will be always invalid.`);
                            this.setFieldInvalid(key, fieldRule);
                            return;
                        }
                        return promise.then((resp => {
                            if (!resp) this.setFieldInvalid(key, fieldRule);
                        })).catch((() => {
                            this.setFieldInvalid(key, fieldRule);
                        }));
                    }
                    if (!result) this.setFieldInvalid(key, fieldRule);
                }
            }
        }
        isFormValid() {
            let isValid = true;
            for (let i = 0, len = Object.values(this.fields).length; i < len; ++i) {
                const item = Object.values(this.fields)[i];
                if (void 0 === item.isValid) {
                    isValid = void 0;
                    break;
                }
                if (false === item.isValid) {
                    isValid = false;
                    break;
                }
            }
            for (let i = 0, len = Object.values(this.groupFields).length; i < len; ++i) {
                const item = Object.values(this.groupFields)[i];
                if (void 0 === item.isValid) {
                    isValid = void 0;
                    break;
                }
                if (false === item.isValid) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        }
        validateField(key, afterInputChanged = false) {
            var _a;
            const field = this.fields[key];
            field.isValid = true;
            const promises = [];
            [ ...field.rules ].reverse().forEach((rule => {
                const res = this.validateFieldRule(key, field.elem, rule, afterInputChanged);
                if (isPromise(res)) promises.push(res);
            }));
            if (field.isValid) this.setFieldValid(key, null == (_a = field.config) ? void 0 : _a.successMessage);
            return Promise.allSettled(promises).finally((() => {
                var _a2;
                if (afterInputChanged) null == (_a2 = this.onValidateCallback) ? void 0 : _a2.call(this, {
                    isValid: this.isFormValid(),
                    isSubmitted: this.isSubmitted,
                    fields: this.getCompatibleFields(),
                    groups: {
                        ...this.groupFields
                    }
                });
            }));
        }
        revalidateField(fieldSelector) {
            if ("string" !== typeof fieldSelector && !isElement(fieldSelector)) throw Error(`Field selector is not valid. Please specify a string selector or a valid DOM element.`);
            const key = this.getKeyByFieldSelector(fieldSelector);
            if (!key || !this.fields[key]) {
                console.error(`Field not found. Check the field selector.`);
                return Promise.reject();
            }
            return new Promise((resolve => {
                this.validateField(key, true).finally((() => {
                    this.clearFieldStyle(key);
                    this.clearFieldLabel(key);
                    this.renderFieldError(key, true);
                    resolve(!!this.fields[key].isValid);
                }));
            }));
        }
        revalidateGroup(groupSelector) {
            if ("string" !== typeof groupSelector && !isElement(groupSelector)) throw Error(`Group selector is not valid. Please specify a string selector or a valid DOM element.`);
            const key = this.getKeyByFieldSelector(groupSelector);
            if (!key || !this.groupFields[key]) {
                console.error(`Group not found. Check the group selector.`);
                return Promise.reject();
            }
            return new Promise((resolve => {
                this.validateGroup(key).finally((() => {
                    this.clearFieldLabel(key);
                    this.renderGroupError(key, true);
                    resolve(!!this.groupFields[key].isValid);
                }));
            }));
        }
        validateGroup(key, afterInputChanged = false) {
            const group = this.groupFields[key];
            const promises = [];
            [ ...group.rules ].reverse().forEach((rule => {
                const res = this.validateGroupRule(key, group.elems, rule);
                if (isPromise(res)) promises.push(res);
            }));
            return Promise.allSettled(promises).finally((() => {
                var _a;
                if (afterInputChanged) null == (_a = this.onValidateCallback) ? void 0 : _a.call(this, {
                    isValid: this.isFormValid(),
                    isSubmitted: this.isSubmitted,
                    fields: this.getCompatibleFields(),
                    groups: {
                        ...this.groupFields
                    }
                });
            }));
        }
        focusInvalidField() {
            for (const key in this.fields) {
                const field = this.fields[key];
                if (!field.isValid) {
                    setTimeout((() => field.elem.focus()), 0);
                    break;
                }
            }
        }
        afterSubmitValidation(forceRevalidation = false) {
            this.renderErrors(forceRevalidation);
            if (this.globalConfig.focusInvalidField) this.focusInvalidField();
        }
        validate(forceRevalidation = false) {
            return new Promise((resolve => {
                const promises = [];
                Object.keys(this.fields).forEach((key => {
                    const promise = this.validateField(key);
                    if (isPromise(promise)) promises.push(promise);
                }));
                Object.keys(this.groupFields).forEach((key => {
                    const promise = this.validateGroup(key);
                    if (isPromise(promise)) promises.push(promise);
                }));
                Promise.allSettled(promises).then((() => {
                    var _a;
                    this.afterSubmitValidation(forceRevalidation);
                    null == (_a = this.onValidateCallback) ? void 0 : _a.call(this, {
                        isValid: this.isFormValid(),
                        isSubmitted: this.isSubmitted,
                        fields: this.getCompatibleFields(),
                        groups: {
                            ...this.groupFields
                        }
                    });
                    resolve(!!promises.length);
                }));
            }));
        }
        revalidate() {
            return new Promise((resolve => {
                this.validateHandler(void 0, true).finally((() => {
                    if (this.globalConfig.focusInvalidField) this.focusInvalidField();
                    resolve(this.isValid);
                }));
            }));
        }
        validateHandler(ev, forceRevalidation = false) {
            if (this.globalConfig.lockForm) this.lockForm();
            return this.validate(forceRevalidation).finally((() => {
                var _a, _b;
                if (this.globalConfig.lockForm) this.unlockForm();
                if (this.isValid) null == (_a = this.onSuccessCallback) ? void 0 : _a.call(this, ev); else null == (_b = this.onFailCallback) ? void 0 : _b.call(this, this.getCompatibleFields(), this.groupFields);
            }));
        }
        setForm(form) {
            this.form = form;
            this.form.setAttribute("novalidate", "novalidate");
            this.removeListener("submit", this.form, this.formSubmitHandler);
            this.addListener("submit", this.form, this.formSubmitHandler);
        }
        addListener(type, elem, handler) {
            elem.addEventListener(type, handler);
            this.eventListeners.push({
                type,
                elem,
                func: handler
            });
        }
        removeListener(type, elem, handler) {
            elem.removeEventListener(type, handler);
            this.eventListeners = this.eventListeners.filter((item => item.type !== type || item.elem !== elem));
        }
        addField(fieldSelector, rules, config) {
            if ("string" !== typeof fieldSelector && !isElement(fieldSelector)) throw Error(`Field selector is not valid. Please specify a string selector or a valid DOM element.`);
            let elem;
            if ("string" === typeof fieldSelector) elem = this.form.querySelector(fieldSelector); else elem = fieldSelector;
            if (!elem) throw Error(`Field doesn't exist in the DOM! Please check the field selector.`);
            if (!Array.isArray(rules) || !rules.length) throw Error(`Rules argument should be an array and should contain at least 1 element.`);
            rules.forEach((item => {
                if (!("rule" in item || "validator" in item || "plugin" in item)) throw Error(`Rules argument must contain at least one rule or validator property.`);
                if (!item.validator && !item.plugin && (!item.rule || !Object.values(Rules).includes(item.rule))) throw Error(`Rule should be one of these types: ${Object.values(Rules).join(", ")}. Provided value: ${item.rule}`);
            }));
            const key = this.setKeyByFieldSelector(fieldSelector);
            this.fields[key] = {
                elem,
                rules,
                isValid: void 0,
                touched: false,
                config
            };
            this.setListeners(elem);
            if (this.isSubmitted || this.globalConfig.validateBeforeSubmitting) this.validateField(key);
            return this;
        }
        removeField(fieldSelector) {
            if ("string" !== typeof fieldSelector && !isElement(fieldSelector)) throw Error(`Field selector is not valid. Please specify a string selector or a valid DOM element.`);
            const key = this.getKeyByFieldSelector(fieldSelector);
            if (!key || !this.fields[key]) {
                console.error(`Field not found. Check the field selector.`);
                return this;
            }
            const type = this.getListenerType(this.fields[key].elem.type);
            this.removeListener(type, this.fields[key].elem, this.handlerChange);
            this.clearErrors();
            delete this.fields[key];
            return this;
        }
        removeGroup(group) {
            if ("string" !== typeof group) throw Error(`Group selector is not valid. Please specify a string selector.`);
            const key = this.getKeyByFieldSelector(group);
            if (!key || !this.groupFields[key]) {
                console.error(`Group not found. Check the group selector.`);
                return this;
            }
            this.groupFields[key].elems.forEach((elem => {
                const type = this.getListenerType(elem.type);
                this.removeListener(type, elem, this.handlerChange);
            }));
            this.clearErrors();
            delete this.groupFields[key];
            return this;
        }
        addRequiredGroup(groupField, errorMessage, config, successMessage) {
            if ("string" !== typeof groupField && !isElement(groupField)) throw Error(`Group selector is not valid. Please specify a string selector or a valid DOM element.`);
            let elem;
            if ("string" === typeof groupField) elem = this.form.querySelector(groupField); else elem = groupField;
            if (!elem) throw Error(`Group selector not found! Please check the group selector.`);
            const inputs = elem.querySelectorAll("input");
            const childrenInputs = Array.from(inputs).filter((input => {
                const parent = getClosestParent(this.groupFields, getNodeParents(input));
                if (!parent) return true;
                return parent[1].elems.find((elem2 => elem2 !== input));
            }));
            const key = this.setKeyByFieldSelector(groupField);
            this.groupFields[key] = {
                rules: [ {
                    rule: GroupRules.Required,
                    errorMessage,
                    successMessage
                } ],
                groupElem: elem,
                elems: childrenInputs,
                touched: false,
                isValid: void 0,
                config
            };
            inputs.forEach((input => {
                this.setListeners(input);
            }));
            return this;
        }
        getListenerType(type) {
            switch (type) {
              case "checkbox":
              case "select-one":
              case "file":
              case "radio":
                return "change";

              default:
                return "input";
            }
        }
        setListeners(elem) {
            const type = this.getListenerType(elem.type);
            this.removeListener(type, elem, this.handlerChange);
            this.addListener(type, elem, this.handlerChange);
        }
        clearFieldLabel(key) {
            var _a, _b;
            null == (_a = this.errorLabels[key]) ? void 0 : _a.remove();
            null == (_b = this.successLabels[key]) ? void 0 : _b.remove();
        }
        clearFieldStyle(key) {
            var _a, _b, _c, _d;
            const field = this.fields[key];
            const errorStyle = (null == (_a = field.config) ? void 0 : _a.errorFieldStyle) || this.globalConfig.errorFieldStyle;
            Object.keys(errorStyle).forEach((key2 => {
                field.elem.style[key2] = "";
            }));
            const successStyle = (null == (_b = field.config) ? void 0 : _b.successFieldStyle) || this.globalConfig.successFieldStyle || {};
            Object.keys(successStyle).forEach((key2 => {
                field.elem.style[key2] = "";
            }));
            field.elem.classList.remove(...getClassList((null == (_c = field.config) ? void 0 : _c.errorFieldCssClass) || this.globalConfig.errorFieldCssClass), ...getClassList((null == (_d = field.config) ? void 0 : _d.successFieldCssClass) || this.globalConfig.successFieldCssClass));
        }
        clearErrors() {
            var _a, _b;
            Object.keys(this.errorLabels).forEach((key => this.errorLabels[key].remove()));
            Object.keys(this.successLabels).forEach((key => this.successLabels[key].remove()));
            for (const key in this.fields) this.clearFieldStyle(key);
            for (const key in this.groupFields) {
                const group = this.groupFields[key];
                const errorStyle = (null == (_a = group.config) ? void 0 : _a.errorFieldStyle) || this.globalConfig.errorFieldStyle;
                Object.keys(errorStyle).forEach((key2 => {
                    group.elems.forEach((elem => {
                        var _a2;
                        elem.style[key2] = "";
                        elem.classList.remove(...getClassList((null == (_a2 = group.config) ? void 0 : _a2.errorFieldCssClass) || this.globalConfig.errorFieldCssClass));
                    }));
                }));
                const successStyle = (null == (_b = group.config) ? void 0 : _b.successFieldStyle) || this.globalConfig.successFieldStyle || {};
                Object.keys(successStyle).forEach((key2 => {
                    group.elems.forEach((elem => {
                        var _a2;
                        elem.style[key2] = "";
                        elem.classList.remove(...getClassList((null == (_a2 = group.config) ? void 0 : _a2.successFieldCssClass) || this.globalConfig.successFieldCssClass));
                    }));
                }));
            }
            this.tooltips = [];
        }
        isTooltip() {
            return !!this.globalConfig.tooltip;
        }
        lockForm() {
            const elems = this.form.querySelectorAll("input, textarea, button, select");
            for (let i = 0, len = elems.length; i < len; ++i) {
                elems[i].setAttribute("data-just-validate-fallback-disabled", elems[i].disabled ? "true" : "false");
                elems[i].setAttribute("disabled", "disabled");
                elems[i].style.pointerEvents = "none";
                elems[i].style.webkitFilter = "grayscale(100%)";
                elems[i].style.filter = "grayscale(100%)";
            }
        }
        unlockForm() {
            const elems = this.form.querySelectorAll("input, textarea, button, select");
            for (let i = 0, len = elems.length; i < len; ++i) {
                if ("true" !== elems[i].getAttribute("data-just-validate-fallback-disabled")) elems[i].removeAttribute("disabled");
                elems[i].style.pointerEvents = "";
                elems[i].style.webkitFilter = "";
                elems[i].style.filter = "";
            }
        }
        renderTooltip(elem, errorLabel, position) {
            var _a;
            const {top, left, width, height} = elem.getBoundingClientRect();
            const errorLabelRect = errorLabel.getBoundingClientRect();
            const pos = position || (null == (_a = this.globalConfig.tooltip) ? void 0 : _a.position);
            switch (pos) {
              case "left":
                errorLabel.style.top = `${top + height / 2 - errorLabelRect.height / 2}px`;
                errorLabel.style.left = `${left - errorLabelRect.width - TOOLTIP_ARROW_HEIGHT}px`;
                break;

              case "top":
                errorLabel.style.top = `${top - errorLabelRect.height - TOOLTIP_ARROW_HEIGHT}px`;
                errorLabel.style.left = `${left + width / 2 - errorLabelRect.width / 2}px`;
                break;

              case "right":
                errorLabel.style.top = `${top + height / 2 - errorLabelRect.height / 2}px`;
                errorLabel.style.left = `${left + width + TOOLTIP_ARROW_HEIGHT}px`;
                break;

              case "bottom":
                errorLabel.style.top = `${top + height + TOOLTIP_ARROW_HEIGHT}px`;
                errorLabel.style.left = `${left + width / 2 - errorLabelRect.width / 2}px`;
                break;
            }
            errorLabel.dataset.direction = pos;
            const refresh = () => {
                this.renderTooltip(elem, errorLabel, position);
            };
            return {
                refresh
            };
        }
        createErrorLabelElem(key, errorMessage, config) {
            const errorLabel = document.createElement("div");
            errorLabel.innerHTML = errorMessage;
            const customErrorLabelStyle = this.isTooltip() ? null == config ? void 0 : config.errorLabelStyle : (null == config ? void 0 : config.errorLabelStyle) || this.globalConfig.errorLabelStyle;
            Object.assign(errorLabel.style, customErrorLabelStyle);
            errorLabel.classList.add(...getClassList((null == config ? void 0 : config.errorLabelCssClass) || this.globalConfig.errorLabelCssClass), "just-validate-error-label");
            if (this.isTooltip()) errorLabel.dataset.tooltip = "true";
            if (this.globalConfig.testingMode) errorLabel.dataset.testId = `error-label-${key}`;
            this.errorLabels[key] = errorLabel;
            return errorLabel;
        }
        createSuccessLabelElem(key, successMessage, config) {
            if (void 0 === successMessage) return null;
            const successLabel = document.createElement("div");
            successLabel.innerHTML = successMessage;
            const customSuccessLabelStyle = (null == config ? void 0 : config.successLabelStyle) || this.globalConfig.successLabelStyle;
            Object.assign(successLabel.style, customSuccessLabelStyle);
            successLabel.classList.add(...getClassList((null == config ? void 0 : config.successLabelCssClass) || this.globalConfig.successLabelCssClass), "just-validate-success-label");
            if (this.globalConfig.testingMode) successLabel.dataset.testId = `success-label-${key}`;
            this.successLabels[key] = successLabel;
            return successLabel;
        }
        renderErrorsContainer(label, errorsContainer) {
            const container = errorsContainer || this.globalConfig.errorsContainer;
            if ("string" === typeof container) {
                const elem = this.form.querySelector(container);
                if (elem) {
                    elem.appendChild(label);
                    return true;
                } else console.error(`Error container with ${container} selector not found. Errors will be rendered as usual`);
            }
            if (container instanceof Element) {
                container.appendChild(label);
                return true;
            }
            if (void 0 !== container) console.error(`Error container not found. It should be a string or existing Element. Errors will be rendered as usual`);
            return false;
        }
        renderGroupLabel(elem, label, errorsContainer, isSuccess) {
            if (!isSuccess) {
                const renderedInErrorsContainer = this.renderErrorsContainer(label, errorsContainer);
                if (renderedInErrorsContainer) return;
            }
            elem.appendChild(label);
        }
        renderFieldLabel(elem, label, errorsContainer, isSuccess) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (!isSuccess) {
                const renderedInErrorsContainer = this.renderErrorsContainer(label, errorsContainer);
                if (renderedInErrorsContainer) return;
            }
            if ("checkbox" === elem.type || "radio" === elem.type) {
                const labelElem = document.querySelector(`label[for="${elem.getAttribute("id")}"]`);
                if ("label" === (null == (_b = null == (_a = elem.parentElement) ? void 0 : _a.tagName) ? void 0 : _b.toLowerCase())) null == (_d = null == (_c = elem.parentElement) ? void 0 : _c.parentElement) ? void 0 : _d.appendChild(label); else if (labelElem) null == (_e = labelElem.parentElement) ? void 0 : _e.appendChild(label); else null == (_f = elem.parentElement) ? void 0 : _f.appendChild(label);
            } else null == (_g = elem.parentElement) ? void 0 : _g.appendChild(label);
        }
        showLabels(fields, isError) {
            Object.keys(fields).forEach(((fieldName, i) => {
                const error = fields[fieldName];
                const key = this.getKeyByFieldSelector(fieldName);
                if (!key || !this.fields[key]) {
                    console.error(`Field not found. Check the field selector.`);
                    return;
                }
                const field = this.fields[key];
                field.isValid = !isError;
                this.clearFieldStyle(key);
                this.clearFieldLabel(key);
                this.renderFieldError(key, false, error);
                if (0 === i && this.globalConfig.focusInvalidField) setTimeout((() => field.elem.focus()), 0);
            }));
        }
        showErrors(fields) {
            if ("object" !== typeof fields) throw Error("[showErrors]: Errors should be an object with key: value format");
            this.showLabels(fields, true);
        }
        showSuccessLabels(fields) {
            if ("object" !== typeof fields) throw Error("[showSuccessLabels]: Labels should be an object with key: value format");
            this.showLabels(fields, false);
        }
        renderFieldError(key, forced = false, message) {
            var _a, _b, _c, _d, _e, _f;
            const field = this.fields[key];
            if (false === field.isValid) this.isValid = false;
            if (void 0 === field.isValid || !forced && !this.isSubmitted && !field.touched && void 0 === message) return;
            if (field.isValid) {
                if (!field.asyncCheckPending) {
                    const successLabel = this.createSuccessLabelElem(key, void 0 !== message ? message : field.successMessage, field.config);
                    if (successLabel) this.renderFieldLabel(field.elem, successLabel, null == (_a = field.config) ? void 0 : _a.errorsContainer, true);
                    field.elem.classList.add(...getClassList((null == (_b = field.config) ? void 0 : _b.successFieldCssClass) || this.globalConfig.successFieldCssClass));
                }
                return;
            }
            field.elem.classList.add(...getClassList((null == (_c = field.config) ? void 0 : _c.errorFieldCssClass) || this.globalConfig.errorFieldCssClass));
            const errorLabel = this.createErrorLabelElem(key, void 0 !== message ? message : field.errorMessage, field.config);
            this.renderFieldLabel(field.elem, errorLabel, null == (_d = field.config) ? void 0 : _d.errorsContainer);
            if (this.isTooltip()) this.tooltips.push(this.renderTooltip(field.elem, errorLabel, null == (_f = null == (_e = field.config) ? void 0 : _e.tooltip) ? void 0 : _f.position));
        }
        renderGroupError(key, force = true) {
            var _a, _b, _c, _d;
            const group = this.groupFields[key];
            if (false === group.isValid) this.isValid = false;
            if (void 0 === group.isValid || !force && !this.isSubmitted && !group.touched) return;
            if (group.isValid) {
                group.elems.forEach((elem => {
                    var _a2, _b2;
                    Object.assign(elem.style, (null == (_a2 = group.config) ? void 0 : _a2.successFieldStyle) || this.globalConfig.successFieldStyle);
                    elem.classList.add(...getClassList((null == (_b2 = group.config) ? void 0 : _b2.successFieldCssClass) || this.globalConfig.successFieldCssClass));
                }));
                const successLabel = this.createSuccessLabelElem(key, group.successMessage, group.config);
                if (successLabel) this.renderGroupLabel(group.groupElem, successLabel, null == (_a = group.config) ? void 0 : _a.errorsContainer, true);
                return;
            }
            this.isValid = false;
            group.elems.forEach((elem => {
                var _a2, _b2;
                Object.assign(elem.style, (null == (_a2 = group.config) ? void 0 : _a2.errorFieldStyle) || this.globalConfig.errorFieldStyle);
                elem.classList.add(...getClassList((null == (_b2 = group.config) ? void 0 : _b2.errorFieldCssClass) || this.globalConfig.errorFieldCssClass));
            }));
            const errorLabel = this.createErrorLabelElem(key, group.errorMessage, group.config);
            this.renderGroupLabel(group.groupElem, errorLabel, null == (_b = group.config) ? void 0 : _b.errorsContainer);
            if (this.isTooltip()) this.tooltips.push(this.renderTooltip(group.groupElem, errorLabel, null == (_d = null == (_c = group.config) ? void 0 : _c.tooltip) ? void 0 : _d.position));
        }
        renderErrors(forceRevalidation = false) {
            if (!this.isSubmitted && !forceRevalidation && !this.globalConfig.validateBeforeSubmitting) return;
            this.clearErrors();
            this.isValid = true;
            for (const key in this.groupFields) this.renderGroupError(key);
            for (const key in this.fields) this.renderFieldError(key);
        }
        destroy() {
            this.eventListeners.forEach((event => {
                this.removeListener(event.type, event.elem, event.func);
            }));
            Object.keys(this.customStyleTags).forEach((key => {
                this.customStyleTags[key].remove();
            }));
            this.clearErrors();
            if (this.globalConfig.lockForm) this.unlockForm();
        }
        refresh() {
            this.destroy();
            if (!this.form) console.error("Cannot initialize the library! Form is not defined"); else {
                this.initialize(this.form, this.globalConfig);
                Object.keys(this.fields).forEach((key => {
                    const fieldSelector = this.getFieldSelectorByKey(key);
                    if (fieldSelector) this.addField(fieldSelector, [ ...this.fields[key].rules ], this.fields[key].config);
                }));
            }
        }
        setCurrentLocale(locale) {
            if ("string" !== typeof locale && void 0 !== locale) {
                console.error("Current locale should be a string");
                return;
            }
            this.currentLocale = locale;
            if (this.isSubmitted) this.validate();
        }
        onSuccess(callback) {
            this.onSuccessCallback = callback;
            return this;
        }
        onFail(callback) {
            this.onFailCallback = callback;
            return this;
        }
        onValidate(callback) {
            this.onValidateCallback = callback;
            return this;
        }
    }
    var MouseCoords = {
        getX: function(e) {
            if (e.pageX) return e.pageX; else if (e.clientX) return e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
            return 0;
        },
        getY: function(e) {
            if (e.pageY) return e.pageY; else if (e.clientY) return e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
            return 0;
        }
    };
    document.onmousemove = function(e) {
        let value = sessionStorage.getItem("test");
        if (1 != value) {
            if (!e) e = window.event;
            MouseCoords.getX(e);
            let coordY = MouseCoords.getY(e);
            if (coordY <= 3) {
                sessionStorage.setItem("test", 1);
                modules_flsModules.popup.open("#last-chance");
            }
        }
    };
    const animItems = document.querySelectorAll(".animation-item");
    if (animItems.length > 0) {
        window.addEventListener("scroll", animOnScroll);
        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 2;
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) animItemPoint = window.innerHeight - window.innerHeight / animStart;
                if (pageYOffset > animItemOffset - animItemPoint && pageYOffset < animItemOffset + animItemHeight) animItem.classList.add("active"); else if (!animItem.classList.contains("animation-no-hide")) animItem.classList.remove("active");
            }
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(), scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
        setTimeout((() => {
            animOnScroll();
        }), 300);
    }
    function initSliders() {
        if (document.querySelector(".swiper")) new Swiper(".swiper ", {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 24,
            speed: 1e3,
            loop: false,
            watchOverflow: true,
            preloadImages: false,
            parallax: true,
            pagination: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    spaceBetween: 20
                },
                530: {
                    spaceBetween: 20
                },
                992: {
                    spaceBetween: 20
                },
                1268: {
                    spaceBetween: 24
                },
                1550: {
                    spaceBetween: 24
                }
            },
            on: {}
        });
        if (document.querySelector(".swiper-examples")) new Swiper(".swiper-examples", {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 24,
            speed: 1e3,
            loop: false,
            watchOverflow: true,
            preloadImages: false,
            parallax: true,
            pagination: true,
            pagination: {
                el: ".swiper-pagination-examples",
                clickable: true
            },
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    spaceBetween: 20
                },
                530: {
                    spaceBetween: 20
                },
                992: {
                    spaceBetween: 20
                },
                1268: {
                    spaceBetween: 24
                },
                1550: {
                    spaceBetween: 24
                }
            },
            on: {}
        });
        if (document.querySelector(".swiper-reviews")) new Swiper(".swiper-reviews", {
            observer: true,
            observeParents: true,
            slidesPerView: "auto",
            spaceBetween: 24,
            speed: 1e3,
            loop: false,
            watchOverflow: true,
            preloadImages: false,
            parallax: true,
            pagination: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    spaceBetween: 20
                },
                530: {
                    spaceBetween: 20
                },
                992: {
                    spaceBetween: 20
                },
                1268: {
                    spaceBetween: 24
                },
                1550: {
                    spaceBetween: 24
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    window.addEventListener("DOMContentLoaded", (function() {
        [].forEach.call(document.querySelectorAll("#basic_phone"), (function(input) {
            var keyCode;
            function mask(event) {
                event.keyCode && (keyCode = event.keyCode);
                var pos = this.selectionStart;
                if (pos < 3) event.preventDefault();
                var matrix = "+7 (___) ___ ____", i = 0, def = matrix.replace(/\D/g, ""), val = this.value.replace(/\D/g, ""), new_value = matrix.replace(/[_\d]/g, (function(a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                }));
                i = new_value.indexOf("_");
                if (-1 != i) {
                    i < 5 && (i = 3);
                    new_value = new_value.slice(0, i);
                }
                var reg = matrix.substr(0, this.value.length).replace(/_+/g, (function(a) {
                    return "\\d{1," + a.length + "}";
                })).replace(/[+()]/g, "\\$&");
                reg = new RegExp("^" + reg + "$");
                if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
                if ("blur" == event.type && this.value.length < 5) this.value = "";
            }
            input.addEventListener("input", mask, false);
            input.addEventListener("focus", mask, false);
            input.addEventListener("blur", mask, false);
            input.addEventListener("keydown", mask, false);
        }));
    }));
    const script_form = new JustValidate("#form");
    script_form.addField("#basic_name", [ {
        rule: "required",
        errorMessage: "Введите имя"
    }, {
        rule: "minLength",
        value: 2,
        errorMessage: "Введите имя должно содержать не менее 2 букв"
    }, {
        rule: "maxLength",
        value: 30,
        errorMessage: "Введите имя должно содержать не более 30 букв"
    } ]).addField("#basic_phone", [ {
        rule: "customRegexp",
        value: /^((8|\+[0-9])[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,15}$/,
        errorMessage: "Неверное значение"
    }, {
        rule: "required",
        errorMessage: "Введите корректный номер"
    }, {
        rule: "minLength",
        value: 17,
        errorMessage: "Введите корректный номер"
    } ]).onSuccess((event => {
        sessionStorage.setItem("test", 1);
        modules_flsModules.popup.open("#finish");
        event.preventDefault();
        console.log("good");
    }));
    const form_1 = new JustValidate("#form_1");
    form_1.addField("#basic_name", [ {
        rule: "required",
        errorMessage: "Введите имя"
    }, {
        rule: "minLength",
        value: 2,
        errorMessage: "Введите имя должно содержать не менее 2 букв"
    }, {
        rule: "maxLength",
        value: 30,
        errorMessage: "Введите имя должно содержать не более 30 букв"
    } ]).addField("#basic_phone", [ {
        rule: "required",
        errorMessage: "Введите корректный номер"
    }, {
        rule: "minLength",
        value: 17,
        errorMessage: "Введите корректный номер"
    } ]).onSuccess((event => {
        sessionStorage.setItem("test", 1);
        modules_flsModules.popup.open("#finish");
        event.preventDefault();
        console.log("good");
    }));
    const formPopup = new JustValidate("#form-popup");
    formPopup.addField("#basic_name", [ {
        rule: "required",
        errorMessage: "Введите имя"
    }, {
        rule: "minLength",
        value: 2,
        errorMessage: "Введите имя должно содержать не менее 2 букв"
    }, {
        rule: "maxLength",
        value: 30,
        errorMessage: "Введите имя должно содержать не более 30 букв"
    } ]).addField("#basic_phone", [ {
        rule: "required",
        errorMessage: "Введите корректный номер"
    }, {
        rule: "minLength",
        value: 17,
        errorMessage: "Введите корректный номер"
    } ]).onSuccess((event => {
        sessionStorage.setItem("test", 1);
        modules_flsModules.popup.open("#finish");
        event.preventDefault();
        console.log("good");
    }));
    window["FLS"] = false;
    addLoadedClass();
    menuInit();
    tabs();
    pageNavigation();
})();