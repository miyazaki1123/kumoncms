import { slideToggle, slideUp, slideDown } from "./slideToggle.js";
export function sideNav() {
  /**
   * Sticky Sidebar JavaScript Plugin.
   * @version 3.3.1
   * @author Ahmed Bouhuolia <a.bouhuolia@gmail.com>
   * @license The MIT License (MIT)
   */
  const StickySidebar = /* @__PURE__ */ (() => {
    const EVENT_KEY = ".stickySidebar";
    const DEFAULTS2 = {
      /**
       * Additional top spacing of the element when it becomes sticky.
       * @type {Numeric|Function}
       */
      topSpacing: 0,
      /**
       * Additional bottom spacing of the element when it becomes sticky.
       * @type {Numeric|Function}
       */
      bottomSpacing: 0,
      /**
       * Container sidebar selector to know what the beginning and end of sticky element.
       * @type {String|False}
       */
      containerSelector: false,
      /**
       * Inner wrapper selector.
       * @type {String}
       */
      innerWrapperSelector: ".inner-wrapper-sticky",
      /**
       * The name of CSS class to apply to elements when they have become stuck.
       * @type {String|False}
       */
      stickyClass: "is-affixed",
      /**
       * Detect when sidebar and its container change height so re-calculate their dimensions.
       * @type {Boolean}
       */
      resizeSensor: true,
      /**
       * The sidebar returns to its normal position if its width below this value.
       * @type {Numeric}
       */
      minWidth: false,
    };
    class StickySidebar2 {
      /**
       * Sticky Sidebar Constructor.
       * @constructor
       * @param {HTMLElement|String} sidebar - The sidebar element or sidebar selector.
       * @param {Object} options - The options of sticky sidebar.
       */
      constructor(sidebar, options = {}) {
        this.options = StickySidebar2.extend(DEFAULTS2, options);
        this.sidebar =
          "string" === typeof sidebar
            ? document.querySelector(sidebar)
            : sidebar;
        if ("undefined" === typeof this.sidebar)
          throw new Error("There is no specific sidebar element.");
        this.sidebarInner = false;
        this.container = this.sidebar.parentElement;
        this.affixedType = "STATIC";
        this.direction = "down";
        this.support = {
          transform: false,
          transform3d: false,
        };
        this._initialized = false;
        this._reStyle = false;
        this._breakpoint = false;
        this._resizeListeners = [];
        this.dimensions = {
          translateY: 0,
          topSpacing: 0,
          lastTopSpacing: 0,
          bottomSpacing: 0,
          lastBottomSpacing: 0,
          sidebarHeight: 0,
          sidebarWidth: 0,
          containerTop: 0,
          containerHeight: 0,
          viewportHeight: 0,
          viewportTop: 0,
          lastViewportTop: 0,
        };
        ["handleEvent"].forEach((method) => {
          this[method] = this[method].bind(this);
        });
        this.initialize();
      }
      /**
       * Initializes the sticky sidebar by adding inner wrapper, define its container,
       * min-width breakpoint, calculating dimensions, adding helper classes and inline style.
       * @private
       */
      initialize() {
        this._setSupportFeatures();
        if (this.options.innerWrapperSelector) {
          this.sidebarInner = this.sidebar.querySelector(
            this.options.innerWrapperSelector
          );
          if (null === this.sidebarInner) this.sidebarInner = false;
        }
        if (!this.sidebarInner) {
          let wrapper = document.createElement("div");
          wrapper.setAttribute("class", "inner-wrapper-sticky");
          this.sidebar.appendChild(wrapper);
          while (this.sidebar.firstChild != wrapper)
            wrapper.appendChild(this.sidebar.firstChild);
          this.sidebarInner = this.sidebar.querySelector(
            ".inner-wrapper-sticky"
          );
        }
        if (this.options.containerSelector) {
          let containers = document.querySelectorAll(
            this.options.containerSelector
          );
          containers = Array.prototype.slice.call(containers);
          containers.forEach((container, item) => {
            if (!container.contains(this.sidebar)) return;
            this.container = container;
          });
          if (!containers.length)
            throw new Error("The container does not contains on the sidebar.");
        }
        if ("function" !== typeof this.options.topSpacing)
          this.options.topSpacing = parseInt(this.options.topSpacing) || 0;
        if ("function" !== typeof this.options.bottomSpacing)
          this.options.bottomSpacing =
            parseInt(this.options.bottomSpacing) || 0;
        this._widthBreakpoint();
        this.calcDimensions();
        this.stickyPosition();
        this.bindEvents();
        this._initialized = true;
      }
      /**
       * Bind all events of sticky sidebar plugin.
       * @protected
       */
      bindEvents() {
        window.addEventListener("resize", this, {
          passive: true,
          capture: false,
        });
        window.addEventListener("scroll", this, {
          passive: true,
          capture: false,
        });
        this.sidebar.addEventListener("update" + EVENT_KEY, this);
        if (this.options.resizeSensor && "undefined" !== typeof ResizeSensor) {
          new ResizeSensor(this.sidebarInner, this.handleEvent);
          new ResizeSensor(this.container, this.handleEvent);
        }
      }
      /**
       * Handles all events of the plugin.
       * @param {Object} event - Event object passed from listener.
       */
      handleEvent(event) {
        this.updateSticky(event);
      }
      /**
       * Calculates dimensions of sidebar, container and screen viewpoint
       * @public
       */
      calcDimensions() {
        if (this._breakpoint) return;
        var dims = this.dimensions;
        dims.containerTop = StickySidebar2.offsetRelative(this.container).top;
        dims.containerHeight = this.container.clientHeight;
        dims.containerBottom = dims.containerTop + dims.containerHeight;
        dims.sidebarHeight = this.sidebarInner.offsetHeight;
        dims.sidebarWidth = this.sidebar.offsetWidth;
        dims.viewportHeight = window.innerHeight;
        this._calcDimensionsWithScroll();
      }
      /**
       * Some dimensions values need to be up-to-date when scrolling the page.
       * @private
       */
      _calcDimensionsWithScroll() {
        var dims = this.dimensions;
        dims.sidebarLeft = StickySidebar2.offsetRelative(this.sidebar).left;
        dims.viewportTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        dims.viewportBottom = dims.viewportTop + dims.viewportHeight;
        dims.viewportLeft =
          document.documentElement.scrollLeft || document.body.scrollLeft;
        dims.topSpacing = this.options.topSpacing;
        dims.bottomSpacing = this.options.bottomSpacing;
        if ("function" === typeof dims.topSpacing)
          dims.topSpacing = parseInt(dims.topSpacing(this.sidebar)) || 0;
        if ("function" === typeof dims.bottomSpacing)
          dims.bottomSpacing = parseInt(dims.bottomSpacing(this.sidebar)) || 0;
        if ("VIEWPORT-TOP" === this.affixedType) {
          if (dims.topSpacing < dims.lastTopSpacing) {
            dims.translateY += dims.lastTopSpacing - dims.topSpacing;
            this._reStyle = true;
          }
        } else if ("VIEWPORT-BOTTOM" === this.affixedType) {
          if (dims.bottomSpacing < dims.lastBottomSpacing) {
            dims.translateY += dims.lastBottomSpacing - dims.bottomSpacing;
            this._reStyle = true;
          }
        }
        dims.lastTopSpacing = dims.topSpacing;
        dims.lastBottomSpacing = dims.bottomSpacing;
      }
      /**
       * Determine whether the sidebar is bigger than viewport.
       * @public
       * @return {Boolean}
       */
      isSidebarFitsViewport() {
        return this.dimensions.sidebarHeight < this.dimensions.viewportHeight;
      }
      /**
       * Observe browser scrolling direction top and down.
       */
      observeScrollDir() {
        var dims = this.dimensions;
        if (dims.lastViewportTop === dims.viewportTop) return;
        var furthest = "down" === this.direction ? Math.min : Math.max;
        if (
          dims.viewportTop === furthest(dims.viewportTop, dims.lastViewportTop)
        )
          this.direction = "down" === this.direction ? "up" : "down";
      }
      /**
       * Gets affix type of sidebar according to current scrollTop and scrollLeft.
       * Holds all logical affix of the sidebar when scrolling up and down and when sidebar
       * is bigger than viewport and vice versa.
       * @public
       * @return {String|False} - Proper affix type.
       */
      getAffixType() {
        var dims = this.dimensions,
          affixType = false;
        this._calcDimensionsWithScroll();
        var sidebarBottom = dims.sidebarHeight + dims.containerTop;
        var colliderTop = dims.viewportTop + dims.topSpacing;
        var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
        if ("up" === this.direction) {
          if (colliderTop <= dims.containerTop) {
            dims.translateY = 0;
            affixType = "STATIC";
          } else if (colliderTop <= dims.translateY + dims.containerTop) {
            dims.translateY = colliderTop - dims.containerTop;
            affixType = "VIEWPORT-TOP";
          } else if (
            !this.isSidebarFitsViewport() &&
            dims.containerTop <= colliderTop
          ) {
            affixType = "VIEWPORT-UNBOTTOM";
          }
        } else {
          if (this.isSidebarFitsViewport()) {
            if (dims.sidebarHeight + colliderTop >= dims.containerBottom) {
              dims.translateY = dims.containerBottom - sidebarBottom;
              affixType = "CONTAINER-BOTTOM";
            } else if (colliderTop >= dims.containerTop) {
              dims.translateY = colliderTop - dims.containerTop;
              affixType = "VIEWPORT-TOP";
            }
          } else {
            if (dims.containerBottom <= colliderBottom) {
              dims.translateY = dims.containerBottom - sidebarBottom;
              affixType = "CONTAINER-BOTTOM";
            } else if (sidebarBottom + dims.translateY <= colliderBottom) {
              dims.translateY = colliderBottom - sidebarBottom;
              affixType = "VIEWPORT-BOTTOM";
            } else if (dims.containerTop + dims.translateY <= colliderTop) {
              affixType = "VIEWPORT-UNBOTTOM";
            }
          }
        }
        dims.translateY = Math.max(0, dims.translateY);
        dims.translateY = Math.min(dims.containerHeight, dims.translateY);
        dims.lastViewportTop = dims.viewportTop;
        return affixType;
      }
      /**
       * Gets inline style of sticky sidebar wrapper and inner wrapper according
       * to its affix type.
       * @private
       * @param {String} affixType - Affix type of sticky sidebar.
       * @return {Object}
       */
      _getStyle(affixType) {
        if ("undefined" === typeof affixType) return;
        var style2 = { inner: {}, outer: {} };
        var dims = this.dimensions;
        switch (affixType) {
          case "VIEWPORT-TOP":
            style2.inner = {
              position: "fixed",
              top: dims.topSpacing,
              left: dims.sidebarLeft - dims.viewportLeft,
              width: dims.sidebarWidth,
            };
            break;
          case "VIEWPORT-BOTTOM":
            style2.inner = {
              position: "fixed",
              top: "auto",
              left: dims.sidebarLeft,
              bottom: dims.bottomSpacing,
              width: dims.sidebarWidth,
            };
            break;
          case "CONTAINER-BOTTOM":
          case "VIEWPORT-UNBOTTOM":
            let translate = this._getTranslate(0, dims.translateY + "px");
            if (translate) style2.inner = { transform: translate };
            else
              style2.inner = {
                position: "absolute",
                top: dims.translateY,
                width: dims.sidebarWidth,
              };
            break;
        }
        switch (affixType) {
          case "VIEWPORT-TOP":
          case "VIEWPORT-BOTTOM":
          case "VIEWPORT-UNBOTTOM":
          case "CONTAINER-BOTTOM":
            style2.outer = { height: dims.sidebarHeight, position: "relative" };
            break;
        }
        style2.outer = StickySidebar2.extend(
          { height: "", position: "" },
          style2.outer
        );
        style2.inner = StickySidebar2.extend(
          {
            position: "relative",
            top: "",
            left: "",
            bottom: "",
            width: "",
            transform: this._getTranslate(),
          },
          style2.inner
        );
        return style2;
      }
      /**
       * Cause the sidebar to be sticky according to affix type by adding inline
       * style, adding helper class and trigger events.
       * @function
       * @protected
       * @param {string} force - Update sticky sidebar position by force.
       */
      stickyPosition(force) {
        if (this._breakpoint) return;
        force = this._reStyle || force || false;
        this.options.topSpacing;
        this.options.bottomSpacing;
        var affixType = this.getAffixType();
        var style2 = this._getStyle(affixType);
        if ((this.affixedType != affixType || force) && affixType) {
          let affixEvent =
            "affix." +
            affixType.toLowerCase().replace("viewport-", "") +
            EVENT_KEY;
          StickySidebar2.eventTrigger(this.sidebar, affixEvent);
          if ("STATIC" === affixType)
            StickySidebar2.removeClass(this.sidebar, this.options.stickyClass);
          else StickySidebar2.addClass(this.sidebar, this.options.stickyClass);
          for (let key in style2.outer) {
            "number" === typeof style2.outer[key] ? "px" : "";
            this.sidebar.style[key] = style2.outer[key];
          }
          for (let key in style2.inner) {
            let _unit = "number" === typeof style2.inner[key] ? "px" : "";
            this.sidebarInner.style[key] = style2.inner[key] + _unit;
          }
          let affixedEvent =
            "affixed." +
            affixType.toLowerCase().replace("viewport-", "") +
            EVENT_KEY;
          StickySidebar2.eventTrigger(this.sidebar, affixedEvent);
        } else {
          if (this._initialized)
            this.sidebarInner.style.left = style2.inner.left;
        }
        this.affixedType = affixType;
      }
      /**
       * Breakdown sticky sidebar when window width is below `options.minWidth` value.
       * @protected
       */
      _widthBreakpoint() {
        if (window.innerWidth <= this.options.minWidth) {
          this._breakpoint = true;
          this.affixedType = "STATIC";
          this.sidebar.removeAttribute("style");
          StickySidebar2.removeClass(this.sidebar, this.options.stickyClass);
          this.sidebarInner.removeAttribute("style");
        } else {
          this._breakpoint = false;
        }
      }
      /**
       * Switches between functions stack for each event type, if there's no
       * event, it will re-initialize sticky sidebar.
       * @public
       */
      updateSticky(event = {}) {
        if (this._running) return;
        this._running = true;
        ((eventType) => {
          requestAnimationFrame(() => {
            switch (eventType) {
              case "scroll":
                this._calcDimensionsWithScroll();
                this.observeScrollDir();
                this.stickyPosition();
                break;
              case "resize":
              default:
                this._widthBreakpoint();
                this.calcDimensions();
                this.stickyPosition(true);
                break;
            }
            this._running = false;
          });
        })(event.type);
      }
      /**
       * Set browser support features to the public property.
       * @private
       */
      _setSupportFeatures() {
        var support = this.support;
        support.transform = StickySidebar2.supportTransform();
        support.transform3d = StickySidebar2.supportTransform(true);
      }
      /**
       * Get translate value, if the browser supports transfrom3d, it will adopt it.
       * and the same with translate. if browser doesn't support both return false.
       * @param {Number} y - Value of Y-axis.
       * @param {Number} x - Value of X-axis.
       * @param {Number} z - Value of Z-axis.
       * @return {String|False}
       */
      _getTranslate(y = 0, x = 0, z = 0) {
        if (this.support.transform3d)
          return "translate3d(" + y + ", " + x + ", " + z + ")";
        else if (this.support.translate)
          return "translate(" + y + ", " + x + ")";
        else return false;
      }
      /**
       * Destroy sticky sidebar plugin.
       * @public
       */
      destroy() {
        window.removeEventListener("resize", this, { caption: false });
        window.removeEventListener("scroll", this, { caption: false });
        this.sidebar.classList.remove(this.options.stickyClass);
        this.sidebar.style.minHeight = "";
        this.sidebar.removeEventListener("update" + EVENT_KEY, this);
        var styleReset = { inner: {}, outer: {} };
        styleReset.inner = {
          position: "",
          top: "",
          left: "",
          bottom: "",
          width: "",
          transform: "",
        };
        styleReset.outer = { height: "", position: "" };
        for (let key in styleReset.outer)
          this.sidebar.style[key] = styleReset.outer[key];
        for (let key in styleReset.inner)
          this.sidebarInner.style[key] = styleReset.inner[key];
        if (this.options.resizeSensor && "undefined" !== typeof ResizeSensor) {
          ResizeSensor.detach(this.sidebarInner, this.handleEvent);
          ResizeSensor.detach(this.container, this.handleEvent);
        }
      }
      /**
       * Determine if the browser supports CSS transform feature.
       * @function
       * @static
       * @param {Boolean} transform3d - Detect transform with translate3d.
       * @return {String}
       */
      static supportTransform(transform3d) {
        var result = false,
          property = transform3d ? "perspective" : "transform",
          upper = property.charAt(0).toUpperCase() + property.slice(1),
          prefixes = ["Webkit", "Moz", "O", "ms"],
          support = document.createElement("support"),
          style2 = support.style;
        (property + " " + prefixes.join(upper + " ") + upper)
          .split(" ")
          .forEach(function (property2, i) {
            if (style2[property2] !== void 0) {
              result = property2;
              return false;
            }
          });
        return result;
      }
      /**
       * Trigger custom event.
       * @static
       * @param {DOMObject} element - Target element on the DOM.
       * @param {String} eventName - Event name.
       * @param {Object} data -
       */
      static eventTrigger(element, eventName, data) {
        try {
          var event = new CustomEvent(eventName, { detail: data });
        } catch (e) {
          var event = document.createEvent("CustomEvent");
          event.initCustomEvent(eventName, true, true, data);
        }
        element.dispatchEvent(event);
      }
      /**
       * Extend options object with defaults.
       * @function
       * @static
       */
      static extend(defaults, options) {
        var results = {};
        for (let key in defaults) {
          if ("undefined" !== typeof options[key]) results[key] = options[key];
          else results[key] = defaults[key];
        }
        return results;
      }
      /**
       * Get current coordinates left and top of specific element.
       * @static
       */
      static offsetRelative(element) {
        var result = { left: 0, top: 0 };
        do {
          let offsetTop = element.offsetTop;
          let offsetLeft = element.offsetLeft;
          if (!isNaN(offsetTop)) result.top += offsetTop;
          if (!isNaN(offsetLeft)) result.left += offsetLeft;
          element =
            "BODY" === element.tagName
              ? element.parentElement
              : element.offsetParent;
        } while (element);
        return result;
      }
      /**
       * Add specific class name to specific element.
       * @static
       * @param {ObjectDOM} element
       * @param {String} className
       */
      static addClass(element, className) {
        if (!StickySidebar2.hasClass(element, className)) {
          if (element.classList) element.classList.add(className);
          else element.className += " " + className;
        }
      }
      /**
       * Remove specific class name to specific element
       * @static
       * @param {ObjectDOM} element
       * @param {String} className
       */
      static removeClass(element, className) {
        if (StickySidebar2.hasClass(element, className)) {
          if (element.classList) element.classList.remove(className);
          else
            element.className = element.className.replace(
              new RegExp(
                "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
                "gi"
              ),
              " "
            );
        }
      }
      /**
       * Determine weather the element has specific class name.
       * @static
       * @param {ObjectDOM} element
       * @param {String} className
       */
      static hasClass(element, className) {
        if (element.classList) return element.classList.contains(className);
        else
          return new RegExp("(^| )" + className + "( |$)", "gi").test(
            element.className
          );
      }
    }
    return StickySidebar2;
  })();
let sidebar2;
  function toggleSIdebar() {
    const sidebar = new StickySidebar("#navi", {
      containerSelector: ".site-main",
      innerWrapperSelector: "#navi #navi__inner",
      topSpacing: 140,
      bottomSpacing: 0,
    });
    if (document.querySelector(".right")) {
      sidebar2 = new StickySidebar(".right", {
        containerSelector: ".site-main",
        innerWrapperSelector: ".right .genre1",
        topSpacing: 10,
        bottomSpacing: 20,
      });
    }

    window.addEventListener("load", function () {
      sidebar.updateSticky();
      if (document.querySelector(".right")) {
        sidebar2.updateSticky();
      }
    });

    if (document.querySelector('[name="blog_id"]')) {
      document
        .querySelectorAll('[name="blog_id"]')
        .forEach(function (e, index) {
          e.addEventListener("change", function () {
            sidebar2.updateSticky();
            setTimeout(function () {
              sidebar.updateSticky();
              if (document.querySelector(".right")) {
                sidebar2.updateSticky();
              }
            }, 300); // 0.1秒（100ms）
          });
        });
    }
  }

  // #navi が追加されたら実行
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && node.matches && node.matches("#navi")) {
          toggleSIdebar();
          observer.disconnect(); // 一度だけ実行する場合はオブザーバー解除
          return;
        }
      }
    }
  });

  // body（もしくは親要素）を監視
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  toggleSIdebar();
}
