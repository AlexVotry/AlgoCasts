addCss(settings.scriptLocation + 'components/bookmark/bookmark.min.css');

if (!applicationSettings.deploy.isKiosk) {
  (function ($$, $, undefined) {
    require(['dojo/domReady!'], function () {
      $$.defaultAdminView = applicationSettings.DefaultAdminViews['admin'];
      $$.user = null;
      $$.userHeight = 0;
      $$.saveToggle = false;
      $$.mailto = '';
      $$.isOpen = false;
      $$.loadTimeout = null;
      $$.ui = {
        dialog: null,
        button: undefined,
        anchor: undefined,
        isDocked: true,
      };

      $$.init = function () {
        $$.ui.dialog = $('div#menu-Views').dialog({
          closeText: 'Close',
          resizable: false,
          draggable: true,
          autoOpen: false,
          // on drag remove anchor
          open: function (event, ui) {
            $$.isOpen = true;
            if ($$.ui.anchor && $$.ui.isDocked) {
              $(event.target.parentElement).position({
                of: $('#' + $$.ui.anchor),
                my: 'left top',
                at: 'right top',
                collision: 'none none',
              });
            }
            if ($$.ui.button) {
              if ($$.isOpen) {
                $$.ui.button.addClass('selected');
              } else {
                $$.ui.button.removeClass('selected');
              }
            }
            if ($$.ui.isDocked) {
              $$.ui.dialog.parent().addClass('no-close');
            }
          },
          close: function (event, ui) {
            $$.isOpen = false;
            if ($$.ui.button) {
              if ($$.isOpen) {
                $$.ui.button.addClass('selected');
              } else {
                $$.ui.button.removeClass('selected');
              }
            }
            // if the close button was clicked, undock it.
            if (event.currentTarget) {
              $$.dockDialog();
            }
          },
          dragStart: function (event, ui) {
            bringSearchAndLineOutagesToTheBack();
          },
          dragStop: function (event, ui) {
            $$.ui.isDocked = false;
            $$.ui.dialog.parent().removeClass('no-close');
            $$.ui.dialog.removeClass('autocloseitem');
          },
        });

        $('div.bookmarkSave').click(function () {
          var name = $('input.bookmarkSaveName').val();
          $$.save(name, false);
        });
        $('div.bookmarkAdd').click(function () {
          if ($$.saveToggle) {
            var name = $('input.bookmarkSaveName').val();
            $$.save(name, false);
          } else {
            $$.saveToggle = true;
            $('div.save').show();
            $('div.bookmarkCancel').show();
            $('input.bookmarkSaveName').focus();
          }
        });
        $('input.bookmarkSaveName').bind('focus', function (event) {
          $$.listenForEnter(true);
          $(this).select();
        });
        $('input.bookmarkSaveName').bind('blur', function (event) {
          $$.listenForEnter(false);
        });
        $('div.bookmarkCancel').click(function () {
          $$.closeOptions();
        });
        $('.bookmarkSaveName').val('');

        $$.loadAllSettings('default');
        $$.getUserName();
      };
      $$.dockDialog = function () {
        $$.ui.isDocked = true;
        $$.ui.dialog.addClass('autocloseitem');
      };
      $$.openclose = function (ui, anchorClass) {
        $$.isOpen = !$$.isOpen;
        $$.ui.button = ui;
        $$.ui.anchor = anchorClass;
        if ($$.isOpen) {
          $('div#menu-Views').dialog('open');
        } else {
          $('div#menu-Views').dialog('close');
        }
      };
      $$.getUserName = function () {
        let userURL = './Handlers/getUserName.ashx';
        if (applicationSettings.deploy.isLocal) {
          userURL =
            'https://web-who.integralgis.local/PJM/DIMA/Handlers/getUserName.ashx';
        }

        $.ajax({
          type: 'GET',
          url: userURL,
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          success: function (response) {
            if (response) {
              $$.userName = response;
              $$.loadAllSettings('user');
            } else {
              notifier.log(
                'warning',
                'Favorites and email options are not available. No impact to data quality.',
                'Bookmark getUserName-no response'
              );
            }
          },
          error: function (response) {
            notifier.log(
              'error',
              'Favorites and email options are not available. No impact to data quality.',
              'Bookmark getUserName-failed load'
            );
            console.log('error: ' + JSON.stringify(response));
          },
        });
      };

      $$.listenForEnter = function (onoff) {
        if (onoff == false) {
          $('input.bookmarkSaveName').unbind('keypress');
          return;
        } else {
          $('input.bookmarkSaveName').unbind('keypress');
          $('input.bookmarkSaveName').bind('keypress', function (e) {
            var code = e.keyCode ? e.keyCode : e.which;
            switch (code) {
              case 13:
                var name = $('input.bookmarkSaveName').val();
                $$.save(name, false);
                //$("input.bookmarkSaveName").blur();
                break;
              default:
                var regex = new RegExp('^[a-zA-Z0-9]+$');
                var key = String.fromCharCode(
                  !e.charCode ? e.which : e.charCode
                );
                if (!regex.test(key)) {
                  e.preventDefault();
                  return false;
                }
                break;
            }
          });
        }
      };
      $$.load = function (json, admin, isStartupView) {
        $$.genReacFilterLoad = true;
        if ('undefined' != typeof schematic && schematic.isOn) {
          console.log('undefined');
          schematic.openclose($('li#schematics-navmenu'), 'schematics-navmenu');
          $$.load(json, admin, isStartupView);
          return;
        }

        if (
          !(
            navbar.isComponentReady &&
            layers.isComponentReady &&
            lineOutage.isComponentReady &&
            kVfilter.isComponentReady &&
            viewPicker.isComponentReady &&
            layers.other.Substations
          )
        ) {
          // console.log("bookmark: waiting for components to become ready.  will reload saved view in 500ms.")
          $$.genReacFilterNotReady = true;
          $$.loadTimeout = setTimeout(function () {
            // console.log(`should hit bookmark.load now with this info: ${json}`, performance.now());
            // if browser has been loading for 60s and dataEngine is done, reload page.
            //console.log(performance.now());
            //if ((performance.now() > 60000) && dataEngine && dataEngine.loaded && dataEngine.data.loaded) {
            //    window.location = window.location.href;
            //} else {
            window.clearTimeout($$.loadTimeout);
            $$.load(json, admin, isStartupView);
            //}
          }, 500);
          return;
        }
        var settings = JSON.parse(json);
        $$.set(settings);
      };
      $$.set = function (settings) {
        $$.genReacFilterSet = true;
        if (layers.commonLayers.suspend) {
          layers.commonLayers.suspend();
        }

        if (settings.zoom) {
          map.setLevel(settings.zoom);
        }

        if (settings.extent) {
          var extent = new esri.geometry.Extent(
            settings.extent[0],
            settings.extent[1],
            settings.extent[2],
            settings.extent[3],
            new esri.SpatialReference({ wkid: applicationSettings.projection })
          );

          navbar.setExtent(extent);
        }
        layers.toggleAll(0);

        if (settings.visibleLayers) {
          for (var x = 0; x < settings.visibleLayers.length; x++) {
            if (
              settings.visibleLayers[x] == 'Substations' ||
              settings.visibleLayers[x] == 'SubstationLabels' ||
              settings.visibleLayers[x] == 'ExternalSubstations' ||
              settings.visibleLayers[x] == 'ExternalSubstationLabels' ||
              settings.visibleLayers[x] == 'Backbone' ||
              settings.visibleLayers[x] == 'TransmissionLines'
            ) {
              layers.toggleSpecial(settings.visibleLayers[x], true);
            } else if (
              'undefined' !=
              typeof applicationSettings.deploy.serviceLayers[
                settings.visibleLayers[x]
              ]
            ) {
              layers.toggle(
                applicationSettings.deploy.serviceLayers[
                  settings.visibleLayers[x]
                ],
                true
              );

              if (
                applicationSettings.deploy.serviceLayers[
                  settings.visibleLayers[x]
                ] == applicationSettings.deploy.serviceLayers.PJMZones
              ) {
                $$.enableZoneSlider('enable');
              }
            }
          }
        }
        if (settings.basemap) {
          viewPicker.change(settings.basemap);
        }
        if (!EXTERNAL) {
          if (settings.pmu) {
            if (!document.getElementById('pmu').checked) {
              $('#pmu').prop('checked', true);
            }
            pmu.turnOn();
          } else {
            pmu.turnOffPMUNoUpdate();
          }
        }

        if (settings.genReacFilter) {
          genReacFilter.loadTree(settings.genReacFilter);
        } else {
          // reset genReacFilter
          genReacFilter.loadTree();
        }
        if (settings.weather) {
          weather.loadState(settings.weather);
        }
        //handle legacy 'selectedKV' settings for line display settings
        if (typeof settings.displayedKV === 'undefined') {
          var lineList = [];
          settings.selectedKV.forEach(function (line) {
            var tempLine = line.split('kvcb_')[1];
            //handle case where selectedKV has already been updated
            if (typeof tempLine === 'undefined') {
              tempLine = line;
            } else {
              if (tempLine === 'gt999') {
                tempLine = '1000';
              }
            }
            lineList.push(tempLine);
          });
          settings['displayedKV'] = lineList;
          delete settings.selectedKV;
          var admin = admin || false;
          var isStartupView = isStartupView || false;
          $$.update(settings, admin, isStartupView);
        }
        kVfilter.setByList(settings.displayedKV);
        $$.kVdefaultDisplay = settings.displayedKV; //for re-setting back to DIMA load defaults!
        layers.commonLayers.resume();
        // prevent race condition between bookmark load and default opening of lineOUtage
        if (lineOutage.autoOpenTimer) {
          clearTimeout(lineOutage.autoOpenTimer);
          lineOutage.autoOpen();
        }
        if ('undefined' != typeof settings.lineOutage) {
          lineOutage.set(settings.lineOutage);
        }
        if (settings.lines) {
          lineOutage.setBookmark(settings.lines);
        }

        if (settings.contingency) {
          //contingency.updateTable(settings.contingency[0], settings.contingency[1]);
          if (!contingency.isOpen) {
            contingency.openclose(
              $('li#contingency-navmenu'),
              'contingency-navmenu'
            );
          }
        }

        // set this last
        if (settings.schematicOn) {
          $('#schematics-navmenu').click();
        }
      };
      $$.loadById = function (id) {
        if (id && parseInt(id) > -1) {
          id = parseInt(id);

          $.ajax({
            url:
              applicationSettings.deploy.DefaultViewsServiceURL +
              'GetUserConfigById/',
            data: { user_config_id: id },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            processData: true,
            crossDomain: true,
            success: function (data, status, jqXHR) {
              var out = [];
              for (var x = 0; x < 1; x++) {
                $$.load(data[x].json);
                notifier.log(
                  'info',
                  `Loaded shared view "${data[x].display_name}"`,
                  'Bookmark LoadById-success'
                );
              }
            },
            error: function (xhr) {
              let xhrError = xhr.responseJSON.ExceptionMessage
                ? xhr.responseJSON.ExceptionMessage
                : xhr.statusText;
              console.log(xhrError);
              notifier.log('error', xhrError, 'Bookmark loadById-failed load');
            },
          });
        }
      };
      $$.getJSONById = function (id, callback) {
        if (id && parseInt(id) > -1) {
          id = parseInt(id);

          $.ajax({
            url:
              applicationSettings.deploy.DefaultViewsServiceURL +
              'GetUserConfigById/',
            data: { user_config_id: id },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            processData: true,
            crossDomain: true,
            success: function (data, status, jqXHR) {
              var out = [];
              for (var x = 0; x < 1; x++) {
                callback(data[x].json);
              }
            },
            error: function (xhr) {
              xhr.responseJSON.ExceptionMessage
                ? console.log(xhr.responseJSON.ExceptionMessage)
                : console.log(xhr.statusText);
            },
          });
        }
      };
      $$.save = function (name, overwrite) {
        if (name == '') {
          alert('Please enter a name.');
          return false;
        }
        name = name.replace("'", '');
        if ('undefined' == typeof overwrite) {
          overwrite = false;
        }

        // don't delete this.  if they don't wan't special chars in the name enable this code
        //var filter = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
        //if (filter.test(name)) {
        //    ok = true;
        //} else {
        //    $(".alphanumeric_error").show();
        //    return false;
        //}

        var settings = $$.getSettings(overwrite);
        //
        // if the schematic view is enabled the bookmark settings are masked.
        //
        if ('undefined' != typeof schematic && schematic.isOn) {
          let cached = schematic.getCachedBookmark();
          if (cached) {
            settings = cached;
            settings.schematicOn = 1;
          }
        }
        var obj = {
          user_name: $$.userName,
          display_name: name,
          json: JSON.stringify(settings),
          insert_date: new Date(Date.now()).toISOString(),
          update_date: new Date(Date.now()).toISOString(),
          view_type: 'user',
          update_user_id: $$.userName,
        };

        $.ajax({
          url:
            applicationSettings.deploy.DefaultViewsServiceURL +
            '/AddUserConfigs/?overwrite=' +
            overwrite,
          data: JSON.stringify(obj),
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          processData: true,
          crossDomain: true,
          success: function (data, status, jqXHR) {
            // 0=broke, 1=sucess, 2=overwrite?
            if (data == '2') {
              $$.promptForOverwrite();
            } else {
              $$.closeOptions();
              $$.clear();
              //notifier.log('info', 'saved view. Response is' + data + ' (0=broke 1=success 2=overwrite)');
            }
          },
          error: function (xhr, desc, err) {
            //console.log(xhr);
            console.log('Desc: ' + desc + '\nErr:' + err);
            $$.clear();
            notifier.alert(
              'error',
              'Loading and saving favorites is not available. No impact to data quality.',
              'Bookmark Error',
              'Call ITOC x2244'
            );
            notifier.log(
              'error',
              `Desc: ${desc} Err: ${err}`,
              'Bookmark Save- failed post'
            );
          },
        });

        return true;
      };

      $$.getSettings = function (overwrite) {
        var settings = {};
        settings.overwrite = overwrite;
        settings.name = name;
        settings.basemap = viewPicker.currentBaseMap;
        settings.zoom = map.getLevel();
        settings.extent = navbar.getExtent();
        settings.visibleLayers = layers.getVisibleByString();
        settings.displayedKV = kVfilter.getVisible();
        settings.pmu = dataEngine.pmu;
        settings.genReacFilter = genReacFilter.saveTree();
        settings.weather = weather.getState();
        settings.lines = lineOutage.getBookmark();
        settings.contingency = contingency.checked.length > 0 ? true : false;
        return settings;
      };
      $$.update = function (settings, admin, isStartupView) {
        // function to help update user's old style bookmark (with settings.checkedKV) to new style with "settingsKV".
        // The admin/default views must be updated manually. user_name = 'admin' and view_type = 'default'
        // note: there is one special 'view' that loads on page load;
        //       this view is defined the following three attributes being 'admin'
        //       user_name, display_name, view_type

        if (admin) {
          var userName = 'admin';
          var viewType = 'default';
          if (isStartupView) {
            viewType = 'admin';
            settings.name = 'admin';
          }
        } else {
          var userName = $$.userName;
          var viewType = 'user';
        }
        settings.overwrite = true;
        var obj = {
          user_name: userName,
          display_name: settings.name,
          json: JSON.stringify(settings),
          insert_date: new Date(Date.now()).toISOString(),
          update_date: new Date(Date.now()).toISOString(),
          view_type: viewType,
          update_user_id: $$.userName,
        };

        $.ajax({
          url:
            applicationSettings.deploy.DefaultViewsServiceURL +
            '/AddUserConfigs/?overwrite=true',
          data: JSON.stringify(obj),
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          processData: true,
          crossDomain: true,
          success: function (data, status, jqXHR) {
            // 0=broke, 1=sucess, 2=overwrite?
            if (data == '2') {
              $$.promptForOverwrite();
            } else {
              $$.closeOptions();
              $$.clear();
              //notifier.log('info', 'saved view. Response is' + data + ' (0=broke 1=success 2=overwrite)');
            }
          },
          error: function (xhr, desc, err) {
            //console.log(xhr);
            console.log('Desc: ' + desc + '\nErr:' + err);
            $$.clear();
            notifier.alert(
              'error',
              'Loading and saving favorites is not available. No impact to data quality.',
              'Bookmark Error',
              'Call ITOC x2244'
            );
            notifier.log(
              'error',
              `Desc: ${desc} Err: ${err}`,
              'Bookmark Update-failed post'
            );
          },
        });

        return true;
      };
      $$.promptForOverwrite = function () {
        $('#dialog-viewoverwrite').dialog({
          closeText: 'Close',
          resizable: false,
          height: 140,
          modal: true,
          buttons: {
            Overwrite: function () {
              var name = $('input.bookmarkSaveName').val();
              $$.save(name, true);
              $(this).dialog('close');
            },
            Cancel: function () {
              $(this).dialog('close');
            },
          },
        });
      };
      $$.clear = function () {
        $('.bookmarkSaveName').val('');
        $$.loadAllSettings('user');
      };
      $$.closeOptions = function () {
        $$.saveToggle = false;
        $('input.bookmarkSaveName').val('');
        $('div.save').hide();
        $('div.bookmarkCancel').hide();
        $('.alphanumeric_error').hide();
      };
      $$.loadAllSettings = function (type) {
        switch (type) {
          case 'user':
            $('#bookmarkconfigs_userlist').empty();

            $.ajax({
              url:
                applicationSettings.deploy.DefaultViewsServiceURL +
                'GetUserConfigByUserName/',
              data: { user_name: $$.userName },
              type: 'GET',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              processData: true,
              crossDomain: true,
              success: function (data, status, jqXHR) {
                if (data && data.length > 0 && $$.userName != null) {
                  $('div.load div.bookmarkuser').show();
                  $$.displayAllSettings(type, data, $$.userName);
                  //$$.resize();
                }
              },
              error: function (xhr) {
                if (xhr.responseJSON) {
                  xhr.responseJSON.ExceptionMessage
                    ? console.log(xhr.responseJSON.ExceptionMessage)
                    : console.log(xhr.statusText);
                  notifier.log(
                    'error',
                    xhr.responseJSON,
                    'Bookmark loadAllSettings-user failed load'
                  );
                }
              },
            });
            break;

          case 'default':
            $('#bookmarkconfigs_list').empty();
            $.ajax({
              url:
                applicationSettings.deploy.DefaultViewsServiceURL +
                'GetUserConfigByUserName/',
              data: { user_name: 'admin' },
              type: 'GET',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              processData: true,
              crossDomain: true,
              success: function (data, status, jqXHR) {
                if (data && data.length > 0) {
                  $$.displayAllSettings(type, data);
                }
              },
              error: function (xhr) {
                if (xhr.responseJSON) {
                  xhr.responseJSON.ExceptionMessage
                    ? console.log(xhr.responseJSON.ExceptionMessage)
                    : console.log(xhr.statusText);
                  notifier.log(
                    'error',
                    xhr.responseJSON,
                    'Bookmark loadAllSettings- default failed load'
                  );
                }
              },
            });
            break;
        }
      };

      $$.openMail = function () {
        var winObj = window.open($$.mailto);
        winObj.close();
      };
      $$.options = function (event, option, id) {
        event.stopPropagation();

        var href =
          window.location.href.split('?')[0] + '?loadView=' + id + ':' + option;
        var mailhref =
          '<' +
          window.location.href.split('?')[0] +
          '?loadView=' +
          id +
          ':' +
          option +
          '>';
        $$.mailto =
          'mailto:?subject=' +
          encodeURIComponent('DIMA View') +
          '&body=' +
          encodeURIComponent(mailhref);

        $('#dialog-viewoptions p.sharelink a.dimaviewlink')
          .attr('href', href)
          .text(href);
        $('#dialog-viewoptions p.sharelink a.dimamaillink').click(function () {
          $$.openMail();
          return false;
        });

        $('#dialog-viewoptions').dialog({
          closeText: 'Close',
          resizable: false,
          height: 200,
          modal: true,
          buttons: {
            Delete: function () {
              $.ajax({
                url:
                  applicationSettings.deploy.DefaultViewsServiceURL +
                  '/DeleteUserConfigs/' +
                  '?user_name=' +
                  $$.userName +
                  '&display_name=' +
                  option +
                  '&view_type=user',
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                processData: true,
                crossDomain: true,
                success: function (data, status, jqXHR) {
                  // status result // 0=broke, 1=sucess
                  if (data == '1') {
                    $$.closeOptions();
                    $$.clear();
                  }
                },
                error: function (xhr) {
                  xhr.responseJSON.ExceptionMessage
                    ? console.log(xhr.responseJSON.ExceptionMessage)
                    : console.log(xhr.statusText);
                },
              });

              $(this).dialog('close');
            },
            Cancel: function () {
              $(this).dialog('close');
            },
          },
        });

        function close_win() {
          mail.close();
        }
      };
      $$.displayAllSettings = function (type, response) {
        var list = [];
        var title = '';

        switch (type) {
          case 'user':
            for (var x = 0; x < response.length; x++) {
              if (response[x].display_name.length > 20) {
                title = response[x].display_name;
              }
              list.push(
                "<div class='bookmarklist_item' configId='" +
                  response[x].user_config_id +
                  "' name='bookmarkselect_config' title='" +
                  title +
                  "'><label class='options' name='" +
                  response[x].display_name +
                  "' configId='" +
                  response[x].user_config_id +
                  "'>►</label><label>" +
                  response[x].display_name +
                  '</label></div>'
              );
            }
            $('#bookmarkconfigs_userlist').append(list);
            $('#bookmarkconfigs_userlist div.bookmarklist_item').click(
              function () {
                $$.loadById($(this).attr('configId'));
              }
            );
            $(
              '#bookmarkconfigs_userlist div.bookmarklist_item label.options'
            ).click(function (evt) {
              $$.options(evt, $(this).attr('name'), $(this).attr('configId'));
            });
            break;

          case 'default':
            for (var y = 0; y < response.length; y++) {
              if (response[y].view_type != 'admin') {
                list.push(
                  "<div class='bookmarklist_item' configId='" +
                    response[y].user_config_id +
                    "' name='bookmarkselect_config' title='" +
                    title +
                    "'>" +
                    response[y].display_name +
                    '</div>'
                );
              }
            }
            $('#bookmarkconfigs_list').append(list);
            $('#bookmarkconfigs_list div.bookmarklist_item').click(function () {
              $$.loadById($(this).attr('configId'), true);
            });
            break;
        }
      };
      //$$.resize = function () {
      //    if ($$.userHeight <= 0) {
      //        var max = $("#map").height();
      //        var top = $("#topuserbookmark").position();
      //        var bottom = $(".navmenufooter").position();
      //        $$.userHeight = Math.abs((max - bottom.top) - (max - top.top));
      //        //console.log($$.userHeight);
      //    }
      //    $(".bookmarkuser").css("height", $$.userHeight + "px");
      //};
      $$.enableZoneSlider = function (isEnable) {
        var slider = $('.layer .slider-bar');
        $(slider).slider(isEnable);
      };

      $$.loadDefault = function () {
        $.ajax({
          url:
            applicationSettings.deploy.DefaultViewsServiceURL +
            'GetUserConfigByUserName/',
          data: { user_name: 'admin' },
          type: 'GET',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          processData: true,
          crossDomain: true,
          success: function (data, status, jqXHR) {
            if (data && data.length > 0) {
              for (var x = 0; x < data.length; x++) {
                if (data[x].view_type === 'admin') {
                  $$.load(data[x].json, true, true);
                  break;
                }
              }
            }
          },
          error: function (xhr) {
            var json = JSON.stringify($$.defaultAdminView);
            $$.load(json, true, true);
          },
        });
      };
    });
  })((window.bookmark = window.bookmark || {}), jQuery);
} else {
  /* this version is for the kiosk */
  (function ($$, $, undefined) {
    require(['dojo/domReady!'], function () {
      $$.defaultAdminView = applicationSettings.DefaultAdminViews['admin'];

      $$.init = function () {
        $('ul#menubuttons #views-navmenu').hide();
      };
      $$.loadDefault = function () {
        var json = JSON.stringify($$.defaultAdminView);
        $$.load(json, true, true);
      };
      $$.load = function (json, admin, isStartupView) {
        if (
          !(
            navbar.isComponentReady &&
            layers.isComponentReady &&
            lineOutage.isComponentReady &&
            kVfilter.isComponentReady &&
            viewPicker.isComponentReady &&
            layers.other.Substations
          )
        ) {
          //console.log("bookmark: waiting for components to become ready.  will reload saved view in 500ms.")
          $$.loadTimeout = setTimeout(function () {
            window.clearTimeout($$.loadTimeout);
            $$.load(json, admin, isStartupView);
          }, 500);
          return;
        }
        var settings = JSON.parse(json);
        $$.set(settings);
      };
      $$.set = function (settings) {
        if (layers.commonLayers.suspend) {
          layers.commonLayers.suspend();
        }

        if (settings.zoom) {
          map.setLevel(settings.zoom);
        }

        if (settings.extent) {
          var extent = new esri.geometry.Extent(
            settings.extent[0],
            settings.extent[1],
            settings.extent[2],
            settings.extent[3],
            new esri.SpatialReference({ wkid: applicationSettings.projection })
          );

          navbar.setExtent(extent);
        }
        layers.toggleAll(0);

        if (settings.visibleLayers) {
          for (var x = 0; x < settings.visibleLayers.length; x++) {
            if (
              settings.visibleLayers[x] != 'Substations' &&
              settings.visibleLayers[x] != 'SubstationLabels' &&
              'undefined' !=
                typeof applicationSettings.deploy.serviceLayers[
                  settings.visibleLayers[x]
                ]
            ) {
              layers.toggle(
                applicationSettings.deploy.serviceLayers[
                  settings.visibleLayers[x]
                ],
                true
              );
              if (
                applicationSettings.deploy.serviceLayers[
                  settings.visibleLayers[x]
                ] == applicationSettings.deploy.serviceLayers.PJMZones
              ) {
                $$.enableZoneSlider('enable');
              }
            } else {
              if (settings.visibleLayers[x] != 'SubstationLabels') {
                layers.toggleSpecial(settings.visibleLayers[x], true);
              }
            }
          }
        }
        if (settings.basemap) {
          viewPicker.change(settings.basemap);
        }
        if (settings.genReacFilter) {
          genReacFilter.loadTree(settings.genReacFilter);
        } else {
          // reset genReacFilter
          genReacFilter.loadTree();
        }
        if (settings.weather) {
          weather.loadState(settings.weather);
        }

        kVfilter.setByList(settings.displayedKV);
        layers.commonLayers.resume();
        // prevent race condition between bookmark load and default opening of lineOUtage
        if (lineOutage.autoOpenTimer) {
          clearTimeout(lineOutage.autoOpenTimer);
          lineOutage.autoOpen();
        }
        if ('undefined' != typeof settings.lineOutage) {
          lineOutage.set(settings.lineOutage);
        }
      };
      $$.enableZoneSlider = function (isEnable) {
        var slider = $('.layer .slider-bar');
        $(slider).slider(isEnable);
      };
    });
  })((window.bookmark = window.bookmark || {}), jQuery);
}
