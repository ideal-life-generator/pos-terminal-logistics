
/*
globals: angular, window

	List of used element methods available in JQuery but not in JQuery Lite

		element.before(elem)
		element.height()
		element.outerHeight(true)
		element.height(value) = only for Top/Bottom padding elements
		element.scrollTop()
		element.scrollTop(value)
 */

(function() {
  angular.module('ui.scroll', []).directive('uiScrollViewport', [
    '$log', function() {
      return {
        controller: [
          '$scope', '$element', function(scope, element) {
            this.viewport = element;
            return this;
          }
        ]
      };
    }
  ]).directive('uiScroll', [
    '$log', '$injector', '$rootScope', '$timeout', function(console, $injector, $rootScope, $timeout) {
      return {
        require: ['?^uiScrollViewport'],
        transclude: 'element',
        priority: 1000,
        terminal: true,
        compile: function(elementTemplate, attr, linker) {
          return function($scope, element, $attr, controllers) {
            var adapter, adapterAttr, adjustBuffer, adjustRowHeight, applyUpdate, bof, bottomVisiblePos, buffer, bufferPadding, bufferSize, builder, clipBottom, clipTop, datasource, datasourceName, doAdjustment, enqueueFetch, eof, eventListener, fetch, finalize, first, getValueChain, hideElementBeforeAppend, insert, isDatasource, isLoading, itemName, loading, log, match, next, pending, reload, removeFromBuffer, resizeAndResizeHandler, ridActual, scrollHeight, shouldLoadBottom, shouldLoadTop, showElementAfterRender, topVisible, topVisibleElement, topVisibleItem, topVisiblePos, topVisibleScope, viewport, viewportScope, wheelHandler;
            log = console.debug || console.log;
            match = $attr.uiScroll.match(/^\s*(\w+)\s+in\s+([\w\.]+)\s*$/);
            if (!match) {
              throw new Error("Expected uiScroll in form of '_item_ in _datasource_' but got '" + $attr.uiScroll + "'");
            }
            itemName = match[1];
            datasourceName = match[2];
            isDatasource = function(datasource) {
              return angular.isObject(datasource) && datasource.get && angular.isFunction(datasource.get);
            };
            getValueChain = function(targetScope, target, isSet) {
              var chain;
              if (!targetScope) {
                return;
              }
              chain = target.match(/^([\w]+)\.(.+)$/);
              if (!chain || chain.length !== 3) {
                if (isSet && !angular.isObject(targetScope[target])) {
                  return targetScope[target] = {};
                }
                return targetScope[target];
              }
              if (isSet && !angular.isObject(targetScope[chain[1]])) {
                targetScope[chain[1]] = {};
              }
              return getValueChain(targetScope[chain[1]], chain[2], isSet);
            };
            datasource = getValueChain($scope, datasourceName);
            if (!isDatasource(datasource)) {
              datasource = $injector.get(datasourceName);
              if (!isDatasource(datasource)) {
                throw new Error("" + datasourceName + " is not a valid datasource");
              }
            }
            if ($attr.adapter) {
              adapterAttr = getValueChain($scope, $attr.adapter, true);
            }
            bufferSize = Math.max(3, +$attr.bufferSize || 10);
            bufferPadding = function() {
              return viewport.outerHeight() * Math.max(0.1, +$attr.padding || 0.1);
            };
            scrollHeight = function(elem) {
              var _ref;
              return (_ref = elem[0].scrollHeight) != null ? _ref : elem[0].document.documentElement.scrollHeight;
            };
            builder = null;
            adapter = {};
            linker($scope.$new(), function(template) {
              var bottomPadding, createPadding, padding, repeaterType, topPadding, viewport;
              repeaterType = template[0].localName;
              if (repeaterType === 'dl') {
                throw new Error("ui-scroll directive does not support <" + template[0].localName + "> as a repeating tag: " + template[0].outerHTML);
              }
              if (repeaterType !== 'li' && repeaterType !== 'tr') {
                repeaterType = 'div';
              }
              viewport = controllers[0] && controllers[0].viewport ? controllers[0].viewport : angular.element(window);
              viewport.css({
                'overflow-y': 'auto',
                'display': 'block'
              });
              padding = function(repeaterType) {
                var div, result, table;
                switch (repeaterType) {
                  case 'tr':
                    table = angular.element('<table><tr><td><div></div></td></tr></table>');
                    div = table.find('div');
                    result = table.find('tr');
                    result.paddingHeight = function() {
                      return div.height.apply(div, arguments);
                    };
                    return result;
                  default:
                    result = angular.element("<" + repeaterType + "></" + repeaterType + ">");
                    result.paddingHeight = result.height;
                    return result;
                }
              };
              createPadding = function(padding, element, direction) {
                element[{
                  top: 'before',
                  bottom: 'after'
                }[direction]](padding);
                return {
                  paddingHeight: function() {
                    return padding.paddingHeight.apply(padding, arguments);
                  },
                  insert: function(element) {
                    return padding[{
                      top: 'after',
                      bottom: 'before'
                    }[direction]](element);
                  }
                };
              };
              topPadding = createPadding(padding(repeaterType), element, 'top');
              bottomPadding = createPadding(padding(repeaterType), element, 'bottom');
              $scope.$on('$destroy', function() {
                return template.remove();
              });
              return builder = {
                viewport: viewport,
                topPadding: topPadding.paddingHeight,
                bottomPadding: bottomPadding.paddingHeight,
                append: bottomPadding.insert,
                prepend: topPadding.insert,
                bottomDataPos: function() {
                  return scrollHeight(viewport) - bottomPadding.paddingHeight();
                },
                topDataPos: function() {
                  return topPadding.paddingHeight();
                }
              };
            });
            viewport = builder.viewport;
            viewportScope = viewport.scope() || $rootScope;
            if (angular.isDefined($attr.topVisible)) {
              topVisibleItem = function(item) {
                return viewportScope[$attr.topVisible] = item;
              };
            }
            if (angular.isDefined($attr.topVisibleElement)) {
              topVisibleElement = function(element) {
                return viewportScope[$attr.topVisibleElement] = element;
              };
            }
            if (angular.isDefined($attr.topVisibleScope)) {
              topVisibleScope = function(scope) {
                return viewportScope[$attr.topVisibleScope] = scope;
              };
            }
            topVisible = function(item) {
              if (topVisibleItem) {
                topVisibleItem(item.scope[itemName]);
              }
              if (topVisibleElement) {
                topVisibleElement(item.element);
              }
              if (topVisibleScope) {
                topVisibleScope(item.scope);
              }
              if (datasource.topVisible) {
                return datasource.topVisible(item);
              }
            };
            if (angular.isDefined($attr.isLoading)) {
              loading = function(value) {
                viewportScope[$attr.isLoading] = value;
                if (datasource.loading) {
                  return datasource.loading(value);
                }
              };
            } else {
              loading = function(value) {
                if (datasource.loading) {
                  return datasource.loading(value);
                }
              };
            }
            ridActual = 0;
            first = 1;
            next = 1;
            buffer = [];
            pending = [];
            eof = false;
            bof = false;
            isLoading = false;
            removeFromBuffer = function(start, stop) {
              var i, _i;
              for (i = _i = start; start <= stop ? _i < stop : _i > stop; i = start <= stop ? ++_i : --_i) {
                buffer[i].scope.$destroy();
                buffer[i].element.remove();
              }
              return buffer.splice(start, stop - start);
            };
            reload = function() {
              ridActual++;
              first = 1;
              next = 1;
              removeFromBuffer(0, buffer.length);
              builder.topPadding(0);
              builder.bottomPadding(0);
              pending = [];
              eof = false;
              bof = false;
              return adjustBuffer(ridActual);
            };
            bottomVisiblePos = function() {
              return viewport.scrollTop() + viewport.outerHeight();
            };
            topVisiblePos = function() {
              return viewport.scrollTop();
            };
            shouldLoadBottom = function() {
              return !eof && builder.bottomDataPos() < bottomVisiblePos() + bufferPadding();
            };
            clipBottom = function() {
              var bottomHeight, i, item, itemHeight, itemTop, newRow, overage, rowTop, _i, _ref;
              bottomHeight = 0;
              overage = 0;
              for (i = _i = _ref = buffer.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
                item = buffer[i];
                itemTop = item.element.offset().top;
                newRow = rowTop !== itemTop;
                rowTop = itemTop;
                if (newRow) {
                  itemHeight = item.element.outerHeight(true);
                }
                if (builder.bottomDataPos() - bottomHeight - itemHeight > bottomVisiblePos() + bufferPadding()) {
                  if (newRow) {
                    bottomHeight += itemHeight;
                  }
                  overage++;
                  eof = false;
                } else {
                  if (newRow) {
                    break;
                  }
                  overage++;
                }
              }
              if (overage > 0) {
                builder.bottomPadding(builder.bottomPadding() + bottomHeight);
                removeFromBuffer(buffer.length - overage, buffer.length);
                return next -= overage;
              }
            };
            shouldLoadTop = function() {
              return !bof && (builder.topDataPos() > topVisiblePos() - bufferPadding());
            };
            clipTop = function() {
              var item, itemHeight, itemTop, newRow, overage, rowTop, topHeight, _i, _len;
              topHeight = 0;
              overage = 0;
              for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                item = buffer[_i];
                itemTop = item.element.offset().top;
                newRow = rowTop !== itemTop;
                rowTop = itemTop;
                if (newRow) {
                  itemHeight = item.element.outerHeight(true);
                }
                if (builder.topDataPos() + topHeight + itemHeight < topVisiblePos() - bufferPadding()) {
                  if (newRow) {
                    topHeight += itemHeight;
                  }
                  overage++;
                  bof = false;
                } else {
                  if (newRow) {
                    break;
                  }
                  overage++;
                }
              }
              if (overage > 0) {
                builder.topPadding(builder.topPadding() + topHeight);
                removeFromBuffer(0, overage);
                return first += overage;
              }
            };
            enqueueFetch = function(rid, direction) {
              if (!isLoading) {
                isLoading = true;
                loading(true);
              }
              if (pending.push(direction) === 1) {
                return fetch(rid);
              }
            };
            hideElementBeforeAppend = function(element) {
              element.displayTemp = element.css('display');
              return element.css('display', 'none');
            };
            showElementAfterRender = function(element) {
              if (element.hasOwnProperty('displayTemp')) {
                return element.css('display', element.displayTemp);
              }
            };
            insert = function(index, item) {
              var itemScope, toBeAppended, wrapper;
              itemScope = $scope.$new();
              itemScope[itemName] = item;
              toBeAppended = index > first;
              itemScope.$index = index;
              if (toBeAppended) {
                itemScope.$index--;
              }
              wrapper = {
                scope: itemScope
              };
              linker(itemScope, function(clone) {
                wrapper.element = clone;
                if (toBeAppended) {
                  if (index === next) {
                    hideElementBeforeAppend(clone);
                    builder.append(clone);
                    return buffer.push(wrapper);
                  } else {
                    buffer[index - first].element.after(clone);
                    return buffer.splice(index - first + 1, 0, wrapper);
                  }
                } else {
                  hideElementBeforeAppend(clone);
                  builder.prepend(clone);
                  return buffer.unshift(wrapper);
                }
              });
              return {
                appended: toBeAppended,
                wrapper: wrapper
              };
            };
            adjustRowHeight = function(appended, wrapper) {
              var newHeight;
              if (appended) {
                return builder.bottomPadding(Math.max(0, builder.bottomPadding() - wrapper.element.outerHeight(true)));
              } else {
                newHeight = builder.topPadding() - wrapper.element.outerHeight(true);
                if (newHeight >= 0) {
                  return builder.topPadding(newHeight);
                } else {
                  return viewport.scrollTop(viewport.scrollTop() + wrapper.element.outerHeight(true));
                }
              }
            };
            doAdjustment = function(rid, finalize) {
              var item, itemHeight, itemTop, newRow, rowTop, topHeight, _i, _len, _results;
              if (shouldLoadBottom()) {
                enqueueFetch(rid, true);
              } else {
                if (shouldLoadTop()) {
                  enqueueFetch(rid, false);
                }
              }
              if (finalize) {
                finalize(rid);
              }
              if (pending.length === 0) {
                topHeight = 0;
                _results = [];
                for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                  item = buffer[_i];
                  itemTop = item.element.offset().top;
                  newRow = rowTop !== itemTop;
                  rowTop = itemTop;
                  if (newRow) {
                    itemHeight = item.element.outerHeight(true);
                  }
                  if (newRow && (builder.topDataPos() + topHeight + itemHeight < topVisiblePos())) {
                    _results.push(topHeight += itemHeight);
                  } else {
                    if (newRow) {
                      topVisible(item);
                    }
                    break;
                  }
                }
                return _results;
              }
            };
            adjustBuffer = function(rid, newItems, finalize) {
              if (newItems && newItems.length) {
                return $timeout(function() {
                  var elt, itemTop, row, rowTop, rows, _i, _j, _len, _len1;
                  rows = [];
                  for (_i = 0, _len = newItems.length; _i < _len; _i++) {
                    row = newItems[_i];
                    elt = row.wrapper.element;
                    showElementAfterRender(elt);
                    itemTop = elt.offset().top;
                    if (rowTop !== itemTop) {
                      rows.push(row);
                      rowTop = itemTop;
                    }
                  }
                  for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
                    row = rows[_j];
                    adjustRowHeight(row.appended, row.wrapper);
                  }
                  return doAdjustment(rid, finalize);
                });
              } else {
                return doAdjustment(rid, finalize);
              }
            };
            finalize = function(rid, newItems) {
              return adjustBuffer(rid, newItems, function() {
                pending.shift();
                if (pending.length === 0) {
                  isLoading = false;
                  return loading(false);
                } else {
                  return fetch(rid);
                }
              });
            };
            fetch = function(rid) {
              var direction;
              direction = pending[0];
              if (direction) {
                if (buffer.length && !shouldLoadBottom()) {
                  return finalize(rid);
                } else {
                  return datasource.get(next, bufferSize, function(result) {
                    var item, newItems, _i, _len;
                    if ((rid && rid !== ridActual) || $scope.$$destroyed) {
                      return;
                    }
                    newItems = [];
                    if (result.length < bufferSize) {
                      eof = true;
                      builder.bottomPadding(0);
                    }
                    if (result.length > 0) {
                      clipTop();
                      for (_i = 0, _len = result.length; _i < _len; _i++) {
                        item = result[_i];
                        newItems.push(insert(++next, item));
                      }
                    }
                    return finalize(rid, newItems);
                  });
                }
              } else {
                if (buffer.length && !shouldLoadTop()) {
                  return finalize(rid);
                } else {
                  return datasource.get(first - bufferSize, bufferSize, function(result) {
                    var i, newItems, _i, _ref;
                    if ((rid && rid !== ridActual) || $scope.$$destroyed) {
                      return;
                    }
                    newItems = [];
                    if (result.length < bufferSize) {
                      bof = true;
                      builder.topPadding(0);
                    }
                    if (result.length > 0) {
                      if (buffer.length) {
                        clipBottom();
                      }
                      for (i = _i = _ref = result.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
                        newItems.unshift(insert(--first, result[i]));
                      }
                    }
                    return finalize(rid, newItems);
                  });
                }
              }
            };
            resizeAndResizeHandler = function() {
              if (!$rootScope.$$phase && !isLoading) {
                adjustBuffer();
                return $scope.$apply();
              }
            };
            viewport.bind('resize', resizeAndResizeHandler);
            viewport.bind('scroll', resizeAndResizeHandler);
            wheelHandler = function(event) {
              var scrollTop, yMax;
              scrollTop = viewport[0].scrollTop;
              yMax = viewport[0].scrollHeight - viewport[0].clientHeight;
              if ((scrollTop === 0 && !bof) || (scrollTop === yMax && !eof)) {
                return event.preventDefault();
              }
            };
            viewport.bind('mousewheel', wheelHandler);
            $scope.$watch(datasource.revision, function() {
              return reload();
            });
            if (datasource.scope) {
              eventListener = datasource.scope.$new();
            } else {
              eventListener = $scope.$new();
            }
            $scope.$on('$destroy', function() {
              var item, _i, _len;
              for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                item = buffer[_i];
                item.scope.$destroy();
                item.element.remove();
              }
              viewport.unbind('resize', resizeAndResizeHandler);
              viewport.unbind('scroll', resizeAndResizeHandler);
              return viewport.unbind('mousewheel', wheelHandler);
            });
            applyUpdate = function(wrapper, newItems) {
              var i, inserted, item, ndx, newItem, oldItemNdx, _i, _j, _k, _len, _len1, _len2;
              inserted = [];
              if (angular.isArray(newItems)) {
                if (newItems.length) {
                  if (newItems.length === 1 && newItems[0] === wrapper.scope[itemName]) {

                  } else {
                    ndx = wrapper.scope.$index;
                    if (ndx > first) {
                      oldItemNdx = ndx - first;
                    } else {
                      oldItemNdx = 1;
                    }
                    for (i = _i = 0, _len = newItems.length; _i < _len; i = ++_i) {
                      newItem = newItems[i];
                      inserted.push(insert(ndx + i, newItem));
                    }
                    removeFromBuffer(oldItemNdx, oldItemNdx + 1);
                    for (i = _j = 0, _len1 = buffer.length; _j < _len1; i = ++_j) {
                      item = buffer[i];
                      item.scope.$index = first + i;
                    }
                  }
                } else {
                  removeFromBuffer(wrapper.scope.$index - first, wrapper.scope.$index - first + 1);
                  next--;
                  for (i = _k = 0, _len2 = buffer.length; _k < _len2; i = ++_k) {
                    item = buffer[i];
                    item.scope.$index = first + i;
                  }
                }
              }
              return inserted;
            };
            adapter.applyUpdates = function(arg1, arg2) {
              var inserted, wrapper, _i, _len, _ref, _ref1;
              inserted = [];
              ridActual++;
              if (angular.isFunction(arg1)) {
                _ref = buffer.slice(0);
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  wrapper = _ref[_i];
                  inserted.concat(inserted, applyUpdate(wrapper, arg1(wrapper.scope[itemName], wrapper.scope, wrapper.element)));
                }
              } else {
                if (arg1 % 1 === 0) {
                  if ((0 <= (_ref1 = arg - first - 1) && _ref1 < buffer.length)) {
                    inserted = applyUpdate(buffer[arg1 - first], arg2);
                  }
                } else {
                  throw new Error("applyUpdates - " + arg1 + " is not a valid index or outside of range");
                }
              }
              return adjustBuffer(ridActual, inserted);
            };
            if (adapterAttr) {
              angular.extend(adapterAttr, adapter);
            }
            adapter.update = function(locator, newItem) {
              var wrapper, _fn, _i, _len, _ref;
              if (angular.isFunction(locator)) {
                _fn = function(wrapper) {
                  return locator(wrapper.scope);
                };
                for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                  wrapper = buffer[_i];
                  _fn(wrapper);
                }
              } else {
                if ((0 <= (_ref = locator - first - 1) && _ref < buffer.length)) {
                  buffer[locator - first - 1].scope[itemName] = newItem;
                }
              }
              return null;
            };
            adapter["delete"] = function(locator) {
              var i, item, temp, wrapper, _fn, _i, _j, _k, _len, _len1, _len2, _ref;
              if (angular.isFunction(locator)) {
                temp = [];
                for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                  item = buffer[_i];
                  temp.unshift(item);
                }
                _fn = function(wrapper) {
                  if (locator(wrapper.scope)) {
                    removeFromBuffer(temp.length - 1 - i, temp.length - i);
                    return next--;
                  }
                };
                for (i = _j = 0, _len1 = temp.length; _j < _len1; i = ++_j) {
                  wrapper = temp[i];
                  _fn(wrapper);
                }
              } else {
                if ((0 <= (_ref = locator - first - 1) && _ref < buffer.length)) {
                  removeFromBuffer(locator - first - 1, locator - first);
                  next--;
                }
              }
              for (i = _k = 0, _len2 = buffer.length; _k < _len2; i = ++_k) {
                item = buffer[i];
                item.scope.$index = first + i;
              }
              return adjustBuffer();
            };
            adapter.insert = function(locator, item) {
              var i, inserted, _i, _len, _ref;
              inserted = [];
              if (angular.isFunction(locator)) {
                throw new Error('not implemented - Insert with locator function');
              } else {
                if ((0 <= (_ref = locator - first - 1) && _ref < buffer.length)) {
                  inserted.push(insert(locator, item));
                  next++;
                }
              }
              for (i = _i = 0, _len = buffer.length; _i < _len; i = ++_i) {
                item = buffer[i];
                item.scope.$index = first + i;
              }
              return adjustBuffer(null, inserted);
            };
            eventListener.$on("insert.item", function(event, locator, item) {
              return adapter.insert(locator, item);
            });
            eventListener.$on("update.items", function(event, locator, newItem) {
              return adapter.update(locator, newItem);
            });
            return eventListener.$on("delete.items", function(event, locator) {
              return adapter["delete"](locator);
            });
          };
        }
      };
    }
  ]);


  /*
  //# sourceURL=src/scripts/ui-scroll.js
   */

}).call(this);
