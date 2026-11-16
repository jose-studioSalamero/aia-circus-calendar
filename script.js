document.addEventListener('DOMContentLoaded', function() {
  console.log('Document ready, starting calendar initialization...');

  // Function to wait for FullCalendar to load
  function waitForFullCalendar() {
    if (typeof FullCalendar !== 'undefined') {
      console.log('FullCalendar is available, initializing calendar...');
      initializeCalendar();
    } else {
      console.log('FullCalendar not yet loaded, waiting...');
      setTimeout(waitForFullCalendar, 100);
    }
  }

  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function initializeCalendar() {
    // Enhanced locale detection
    function detectLocale() {
      const currentPath = window.location.pathname;
      let calendarLocale = 'en'; // default

      console.log('Current path:', currentPath);

      if (currentPath.includes('/zh-hant-hk/') || currentPath.includes('/hk/')) {
        calendarLocale = 'zh-hk'; // Try Hong Kong specific locale first
      } else if (currentPath.includes('/zh-hans-hk/')) {
        calendarLocale = 'zh-cn';
      } else if (currentPath.includes('/zh/')) {
        calendarLocale = 'zh';
      }

      // Fallback if specific locale isn't available
      const availableLocales = ['en', 'zh-cn', 'zh-tw', 'zh-hk', 'zh'];
      if (!availableLocales.includes(calendarLocale)) {
        calendarLocale = 'en';
      }

      console.log('Detected calendar locale:', calendarLocale);
      return calendarLocale;
    }

    // Function to translate view selector buttons
    function translateViewButtons() {
      const currentPath = window.location.pathname;
      let translations = {};

      if (currentPath.includes('/zh-hant-hk/') || currentPath.includes('/hk/')) {
        // Traditional Chinese (Hong Kong)
        translations = {
          'dayGridMonth': '月',
          'timeGridWeek': '週', 
          'timeGridDay': '日'
        };
      } else if (currentPath.includes('/zh-hans-hk/') || currentPath.includes('/zh-cn/')) {
        // Simplified Chinese
        translations = {
          'dayGridMonth': '月',
          'timeGridWeek': '週',
          'timeGridDay': '日'
        };
      }

      // Apply translations if needed
      if (Object.keys(translations).length > 0) {
        setTimeout(function() {
          document.querySelectorAll('.fc-button').forEach(function(button) {
            const buttonText = button.textContent.trim();
            if (buttonText === 'month' && translations['dayGridMonth']) {
              button.textContent = translations['dayGridMonth'];
            } else if (buttonText === 'week' && translations['timeGridWeek']) {
              button.textContent = translations['timeGridWeek'];
            } else if (buttonText === 'day' && translations['timeGridDay']) {
              button.textContent = translations['timeGridDay'];
            }
          });
        }, 100);
      }
    }

    var calendarEl = document.getElementById('divCalendar');
    if (!calendarEl) {
      console.error('Calendar container #divCalendar not found!');
      return;
    }

    // Collect events from your CMS (if any)
    var myEvents = [];

    if (typeof $ !== 'undefined') {
      $('.ec-col-item').each(function(){
        var eventTitle = $(this).find('.title').text();
        var startDate = $(this).find('.start-date').text();
        var startEnd = $(this).find('.end-date').text();
        var eventUrl = $(this).find('.url').text();
        var eventAllday = $(this).find('.allday').text();
        var eventClassName = $(this).find('.classname').text();
        var webflowLink = $(this).find('.webflow-link').attr('href');

        myEvents.push({
          title: eventTitle,
          start: startDate,
          end: startEnd,
          url: webflowLink,
          allDay: eventAllday === 'true',
          className: eventClassName
        });
      });
    }

    // Event mapping with new Event IDs
    var eventMapping = {
      // December 2025
      '2025-12-22': {
        '18:30': '1974957032649', // 6:30 PM
        '20:30': '1974957798941'  // 8:30 PM
      },
      '2025-12-23': {
        '16:30': '1974957878178', // 4:30 PM
        '18:30': '1974957964436'  // 6:30 PM
      },
      '2025-12-24': {
        '14:30': '1974956052718', // 2:30 PM
        '16:30': '1974958020604', // 4:30 PM
        '18:30': '1974958073763', // 6:30 PM
        '20:30': '1974958149991'  // 8:30 PM
      },
      '2025-12-25': {
        '14:30': '1974960082772', // 2:30 PM
        '16:30': '1974958290411', // 4:30 PM
        '18:30': '1974958298435', // 6:30 PM
        '20:30': '1974958303450'  // 8:30 PM
      },
      '2025-12-26': {
        '14:30': '1974958362627', // 2:30 PM
        '16:30': '1974958383690', // 4:30 PM
        '18:30': '1974958422807', // 6:30 PM
        '20:30': '1974958444873'  // 8:30 PM
      },
      '2025-12-27': {
        '14:30': '1974958592314', // 2:30 PM
        '16:30': '1974958595323', // 4:30 PM
        '18:30': '1974958604350'  // 6:30 PM
      },
      '2025-12-28': {
        '14:30': '1974958640458', // 2:30 PM
        '16:30': '1974958645473', // 4:30 PM
        '18:30': '1974958649485'  // 6:30 PM
      },
      '2025-12-29': {
        '16:30': '1974949957487', // 4:30 PM
        '18:30': '1974958712674'  // 6:30 PM
      },
      '2025-12-30': {
        '16:30': '1974958735743', // 4:30 PM
        '18:30': '1974958741761'  // 6:30 PM
      },
      '2025-12-31': {
        '14:30': '1974958809965', // 2:30 PM
        '16:30': '1974958813977', // 4:30 PM
        '18:30': '1974958815983', // 6:30 PM
        '20:30': '1974958822001'  // 8:30 PM
      },

      // January 2026
      '2026-01-01': {
        '14:30': '1974959081778', // 2:30 PM
        '16:30': '1974959106853', // 4:30 PM
        '18:30': '1974959125910'  // 6:30 PM
      },
      '2026-01-02': {
        '16:30': '1974959311465', // 4:30 PM
        '18:30': '1974959377663'  // 6:30 PM
      },
      '2026-01-03': {
        '14:30': '1974959481975', // 2:30 PM
        '16:30': '1974959484984', // 4:30 PM
        '18:30': '1974959486990'  // 6:30 PM
      },
      '2026-01-04': {
        '14:30': '1974959526107', // 2:30 PM
        '16:30': '1974959528113', // 4:30 PM
        '18:30': '1974959529116'  // 6:30 PM
      },
      '2026-01-06': {
        '18:30': '1974959993505'  // 6:30 PM
      },
      '2026-01-07': {
        '18:30': '1974959995511', // 6:30 PM
      },
      '2026-01-08': {
        '16:30': '1974960289390', // 4:30 PM
        '18:30': '1974960291396', // 6:30 PM
      },
      '2026-01-09': {
        '16:30': '1974960476951', // 4:30 PM
        '18:30': '1974960495005', // 6:30 PM
        '20:30': '1974960499017'  // 8:30 PM
      },
      '2026-01-10': {
        '14:30': '1974960798914', // 2:30 PM
        '16:30': '1974960800920', // 4:30 PM
        '18:30': '1974960802926'  // 6:30 PM
      },
      '2026-01-11': {
        '14:30': '1974957303459', // 2:30 PM
        '16:30': '1974957464942', // 4:30 PM
        '18:30': '1974957529134'  // 6:30 PM
      },
      '2026-01-13': {
        '18:30': '1974957659524'  // 6:30 PM
      },
      '2026-01-14': {
        '18:30': '1974957763836'  // 6:30 PM
      },
      '2026-01-15': {
        '16:30': '1974957858118', // 4:30 PM
        '18:30': '1974957917295'  // 6:30 PM
      },
      '2026-01-16': {
        '18:30': '1974957946382', // 6:30 PM
        '20:30': '1974957958418'  // 8:30 PM
      },
      '2026-01-17': {
        '14:30': '1974958577269', // 2:30 PM
        '16:30': '1974958593317', // 4:30 PM
        '18:30': '1974958605353'  // 6:30 PM
      },
      '2026-01-18': {
        '14:30': '1974958769845', // 2:30 PM
        '16:30': '1974958772854', // 4:30 PM
        '18:30': '1974958788902'  // 6:30 PM
      },
      '2026-01-20': {
        '18:30': '1974959039652'  // 6:30 PM (only one show listed)
      },
      '2026-01-21': {
        '16:30': '1974959231225', // 4:30 PM
        '18:30': '1974959242258'  // 6:30 PM
      },
      '2026-01-22': {
        '16:30': '1974959464924', // 4:30 PM
        '18:30': '1974959480972'  // 6:30 PM
      },
      '2026-01-23': {
        '16:30': '1974959482978', // 4:30 PM
      },

      // February 2026
      '2026-02-04': {
        '18:30': '1974960791893'  // 6:30 PM (only one show listed)
      },
      '2026-02-05': {
        '16:30': '1974960799917', // 4:30 PM
        '18:30': '1974960801923'  // 6:30 PM
      },
      '2026-02-06': {
        '16:30': '1974960872133', // 4:30 PM
        '18:30': '1974960875142'  // 6:30 PM
      },
      '2026-02-07': {
        '14:30': '1974960930307', // 2:30 PM
        '16:30': '1974960932313', // 4:30 PM
        '18:30': '1974960933316', // 6:30 PM
      },
      '2026-02-08': {
        '16:30': '1974961044649', // 4:30 PM
        '18:30': '1974961055682'  // 6:30 PM
      },
      '2026-02-10': {
        '18:30': '1974958591311'  // 6:30 PM (only one show listed)
      },
      '2026-02-11': {
        '18:30': '1974958644470'  // 6:30 PM
      },
      '2026-02-12': {
        '16:30': '1974958709665', // 4:30 PM
        '18:30': '1974958742764'  // 6:30 PM
      },
      '2026-02-13': {
        '16:30': '1974958937346', // 4:30 PM
        '18:30': '1974959073754'  // 6:30 PM
      },
      '2026-02-14': {
        '16:30': '1974957346588', // 4:30 PM
        '18:30': '1974957421813'  // 6:30 PM
      },
      '2026-02-15': {
        '16:30': '1974957525122', // 4:30 PM
        '18:30': '1974957604359'  // 6:30 PM
      },
      '2026-02-16': {
        '16:30': '1974957698641', // 4:30 PM
        '18:30': '1974957730737', // 6:30 PM
      },
      '2026-02-17': {
        '14:30': '1974960010556', // 2:30 PM
        '16:30': '1974960016574', // 4:30 PM
        '18:30': '1974960065721'  // 6:30 PM
      },
      '2026-02-18': {
        '14:30': '1974960099823', // 2:30 PM
        '16:30': '1974960073745', // 4:30 PM
        '18:30': '1974960125901'  // 6:30 PM
      },
      '2026-02-19': {
        '14:30': '1974960390693', // 2:30 PM
        '16:30': '1974960473942', // 4:30 PM
        '18:30': '1974960572236'  // 6:30 PM
      },
      '2026-02-20': {
        '16:30': '1974960754782', // 4:30 PM
        '18:30': '1974960803929', // 6:30 PM
      },
      '2026-02-21': {
        '16:30': '1974960820980', // 4:30 PM
        '18:30': '1974960859094', // 6:30 PM
      },
      '2026-02-22': {
        '14:30': '1974960885172', // 2:30 PM
        '16:30': '1974960898211'  // 4:30 PM
      },
      '2026-02-24': {
        '18:30': '1974959213171'  // 6:30 PM (only one show listed)
      },
      '2026-02-25': {
        '18:30': '1974959292408'  // 6:30 PM
      },
      '2026-02-26': {
        '16:30': '1974959378666', // 4:30 PM
        '18:30': '1974959465927'  // 6:30 PM
      },
      '2026-02-27': {
        '16:30': '1974959492005', // 4:30 PM
        '18:30': '1974959521092'  // 6:30 PM
      },
      '2026-02-28': {
        '14:30': '1974957857115', // 2:30 PM
        '16:30': '1974957883193', // 4:30 PM
        '18:30': '1974957919301', // 6:30 PM
      },

      // March 2026
      '2026-03-01': {
        '16:30': '1974958324513', // 4:30 PM
        '18:30': '1974958379678'  // 6:30 PM
      }
    };

    var offPeakDates = [
      '2025-12-22', '2025-12-23',
      '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08',
      '2026-01-12', '2026-01-13', '2026-01-14', '2026-01-15',
      '2026-01-19', '2026-01-20', '2026-01-21', '2026-01-22', '2026-01-23',
      '2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29', '2026-01-30',
      '2026-02-02', '2026-02-03', '2026-02-04', '2026-02-05', '2026-02-06',
      '2026-02-09', '2026-02-10', '2026-02-11', '2026-02-12', '2026-02-13',
      '2026-02-23', '2026-02-24', '2026-02-25', '2026-02-26', '2026-02-27'
    ];

    var peakDates = [
      '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-31',
      '2026-01-01',
      '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22'
    ];

    var standardDates = [
      '2025-12-29', '2025-12-30',
      '2026-01-02', '2026-01-03', '2026-01-04',
      '2026-01-10', '2026-01-11',
      '2026-01-17', '2026-01-18',
      '2026-01-24', '2026-01-25', '2026-01-31',
      '2026-02-01', '2026-02-07', '2026-02-08',
      '2026-02-14', '2026-02-15', '2026-02-16', '2026-02-28',
      '2026-03-01'
    ];

    var closedDates = [
      '2026-01-09', '2026-01-16'
    ];

    // Function to get pricing type for styling
    function getPricingType(dateStr) {
      if (offPeakDates.includes(dateStr)) return 'off-peak';
      if (peakDates.includes(dateStr)) return 'peak';
      if (standardDates.includes(dateStr)) return 'standard';
      if (closedDates.includes(dateStr)) return 'closed';
      return 'unavailable';
    }

    // Function to generate show events for all available dates
    function generateShowEvents() {
      var showEvents = [];
      var showTimes = [
        { time: '14:30', display: '2:30 PM' },
        { time: '16:30', display: '4:30 PM' },
        { time: '18:30', display: '6:30 PM' },
        { time: '20:30', display: '8:30 PM' }
      ];

      // Get all available dates (excluding closed dates)
      var allAvailableDates = [
        ...offPeakDates,
        ...peakDates,
        ...standardDates
      ];

      allAvailableDates.forEach(function(dateStr) {
        if (eventMapping[dateStr]) {
          showTimes.forEach(function(showTime) {
            var eventId = eventMapping[dateStr][showTime.time];
            if (eventId) {
              var startDateTime = dateStr + 'T' + showTime.time + ':00';
              var endTime = parseInt(showTime.time.split(':')[0]) + 1; // Add 1 hour
              var endTimeStr = (endTime < 10 ? '0' : '') + endTime + ':' + showTime.time.split(':')[1];
              var endDateTime = dateStr + 'T' + endTimeStr + ':00';

              var pricingType = getPricingType(dateStr);

              showEvents.push({
                title: 'AIA Circus Show',
                start: startDateTime,
                end: endDateTime,
                className: 'circus-show circus-' + pricingType,
                display: 'block',
                extendedProps: {
                  eventId: eventId,
                  dateStr: dateStr,
                  showTime: showTime.display,
                  pricingType: pricingType
                }
              });
            }
          });
        }
      });

      console.log('Generated', showEvents.length, 'show events');
      return showEvents;
    }

    // Add generated show events to myEvents
    var showEvents = generateShowEvents();
    myEvents = myEvents.concat(showEvents);

    var currentViewDate = new Date('2025-12-01');

    // Create separate static widgets for each event
    var widgetsInitialized = false;
    var createdButtons = {};

    function createStaticWidgetsOnce() {
      if (widgetsInitialized || !window.EBWidgets) {
        return;
      }

      console.log('Creating static widgets for all events...');

      // Create a hidden container for all buttons
      var buttonContainer = document.createElement('div');
      buttonContainer.id = 'eventbrite-buttons-container';
      buttonContainer.style.display = 'none';
      document.body.appendChild(buttonContainer);

      // Create a button and widget for each unique event ID
      var processedEventIds = new Set();
      Object.keys(eventMapping).forEach(function(dateStr) {
        var eventData = eventMapping[dateStr];
        Object.keys(eventData).forEach(function(timeKey) {
          var eventId = eventData[timeKey];

          if (processedEventIds.has(eventId)) {
            return; // Skip if already processed
          }
          processedEventIds.add(eventId);

          var buttonId = 'eventbrite-widget-modal-trigger-' + eventId;

          // Create button
          var button = document.createElement('button');
          button.id = buttonId;
          button.type = 'button';
          button.textContent = 'Buy Tickets';
          button.style.display = 'none';
          buttonContainer.appendChild(button);

          // Create widget
          try {
            window.EBWidgets.createWidget({
              widgetType: 'checkout',
              eventId: eventId,
              modal: true,
              modalTriggerElementId: buttonId,
              onOrderComplete: function() {
                console.log('Order complete for event:', eventId);
              }
            });

            createdButtons[eventId] = button;
            console.log('Created widget for event:', eventId);

          } catch (error) {
            console.error('Error creating widget for event:', eventId, error);
          }
        });
      });

      widgetsInitialized = true;
      console.log('All static widgets created successfully');
    }

    function openEventbriteForDate(dateStr, showTime) {
      var eventData = eventMapping[dateStr];
      var eventId = null;

      if (eventData) {
        if (showTime) {
          // Convert display time back to 24hr format
          var timeKey = showTime.replace(' PM', '').replace(' AM', '');
          if (showTime.includes('PM') && !timeKey.startsWith('12')) {
            var hour = parseInt(timeKey.split(':')[0]) + 12;
            timeKey = hour + ':30';
          } else if (showTime.includes('AM') && timeKey.startsWith('12')) {
            timeKey = '00:30';
          } else if (showTime.includes('AM')) {
            timeKey = timeKey.split(':')[0].padStart(2, '0') + ':30';
          }
          eventId = eventData[timeKey];
          console.log('Looking for time key:', timeKey, 'Found eventId:', eventId);
        } else {
          // If no specific time, use the first available event
          eventId = Object.values(eventData)[0];
          console.log('No specific time, using first event:', eventId);
        }
      }

      if (!eventId) {
        console.log('No event ID found for date:', dateStr, 'time:', showTime);
        return;
      }

      var button = createdButtons[eventId];
      if (!button) {
        console.error('No button found for event:', eventId);
        return;
      }

      var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      console.log('Triggering widget for date:', dateStr, 'Event ID:', eventId);

      button.click();

      if (window.innerWidth <= 768) {
        setTimeout(function() {
          window.scrollTo(scrollLeft, scrollPosition);
        }, 150);

        setTimeout(function() {
          window.scrollTo(scrollLeft, scrollPosition);
        }, 500);
      }
    }

    function loadEventbriteScript() {
      if (!window.EBWidgets && !document.querySelector('script[src*="eb_widgets.js"]')) {
        var script = document.createElement('script');
        script.src = 'https://www.eventbrite.hk/static/widgets/eb_widgets.js';
        script.onload = function() {
          console.log('Eventbrite script loaded successfully');
          setTimeout(createStaticWidgetsOnce, 100);
        };
        script.onerror = function() {
          console.error('Failed to load Eventbrite script');
        };
        document.head.appendChild(script);
        console.log('Loading Eventbrite script...');
      } else if (window.EBWidgets) {
        setTimeout(createStaticWidgetsOnce, 100);
      }
    }

    function getMainMonthFromView(viewStart, viewEnd) {
      var midPoint = new Date(viewStart.getTime() + (viewEnd.getTime() - viewStart.getTime()) / 2);
      return midPoint;
    }

    function isDateSelectable(date, viewDate) {
      // If viewDate is null (week/day view), all dates are selectable
      if (!viewDate || !calendar) {
        return true;
      }

      // For month view, only show events from the current month
      if (calendar.view.type === 'dayGridMonth') {
        return date.getMonth() === viewDate.getMonth() && date.getFullYear() === viewDate.getFullYear();
      }

      // For week/day views, all dates are selectable
      return true;
    }

    function applyClassToDate(info) {
      var dateStr = info.date.toISOString().split('T')[0];
      var isSelectable = isDateSelectable(info.date, currentViewDate);

      info.el.classList.remove('off-peak', 'peak', 'standard', 'closed', 'disabled-date');

      // For week/day views, don't add disabled-date class
      if (!isSelectable && calendar && calendar.view.type === 'dayGridMonth') {
        info.el.classList.add('disabled-date');
        return;
      }

      if (offPeakDates.includes(dateStr)) {
        info.el.classList.add('off-peak');
      } else if (peakDates.includes(dateStr)) {
        info.el.classList.add('peak');
      } else if (standardDates.includes(dateStr)) {
        info.el.classList.add('standard');
      } else if (closedDates.includes(dateStr)) {
        info.el.classList.add('closed');
      }

      // Add visual feedback for clickable dates
      if (eventMapping[dateStr]) {
        info.el.style.cursor = 'pointer';
        info.el.setAttribute('title', 'Click to purchase tickets');
      }
    }

    // Enhanced function to apply classes to day headers only
    function applyAllDateClassesAllViews() {
      setTimeout(function() {
        // Month view (existing)
        document.querySelectorAll('.fc-daygrid-day[data-date]').forEach(function(dayEl) {
          var dateStr = dayEl.getAttribute('data-date');
          if (dateStr) {
            applyColorToElement(dayEl, dateStr);
          }
        });

        // Week and Day views - apply colors only to headers
        applyHeaderStyling();
      }, 50);
    }

    // New function to apply styling only to day headers
    function applyHeaderStyling() {
      setTimeout(function() {
        document.querySelectorAll('.fc-col-header-cell').forEach(function(headerCell) {
          var dateAttr = headerCell.getAttribute('data-date');
          if (!dateAttr) {
            // Try to find date from associated column
            var dayCol = headerCell.closest('.fc-daygrid-day, .fc-timegrid-col');
            if (dayCol) {
              dateAttr = dayCol.getAttribute('data-date');
            }
          }

          if (dateAttr) {
            var date = new Date(dateAttr);
            var isSelectable = isDateSelectable(date, currentViewDate);

            // Remove existing classes
            headerCell.classList.remove('off-peak', 'peak', 'standard', 'closed', 'disabled-date');

            if (!isSelectable) {
              headerCell.classList.add('disabled-date');
              return;
            }

            if (offPeakDates.includes(dateAttr)) {
              headerCell.classList.add('off-peak');
            } else if (peakDates.includes(dateAttr)) {
              headerCell.classList.add('peak');
            } else if (standardDates.includes(dateAttr)) {
              headerCell.classList.add('standard');
            } else if (closedDates.includes(dateAttr)) {
              headerCell.classList.add('closed');
            }
          }
        });

        // For day view - style header and time slots
        if (calendar && calendar.view && calendar.view.type === 'timeGridDay') {
          // Get the actual displayed date from the timegrid column or header
          var currentDate = null;

          // Try to get date from timegrid column first
          var timegridCol = document.querySelector('.fc-timegrid-col[data-date]');
          if (timegridCol) {
            currentDate = timegridCol.getAttribute('data-date');
          }

          // Fallback: try to get from header
          if (!currentDate) {
            var headerCell = document.querySelector('.fc-col-header-cell[data-date]');
            if (headerCell) {
              currentDate = headerCell.getAttribute('data-date');
            }
          }

          // Final fallback: use calendar's view date but add a day to correct timezone issue
          if (!currentDate) {
            var viewDate = new Date(calendar.view.currentStart);
            viewDate.setDate(viewDate.getDate() + 1); // Add one day to correct the offset
            currentDate = viewDate.toISOString().split('T')[0];
          }

          console.log('Day view current date:', currentDate); // Debug line

          // Style the header to be white with black text
          document.querySelectorAll('.fc-col-header-cell').forEach(function(headerCell) {
            headerCell.classList.add('day-view-header');
            headerCell.classList.remove('off-peak', 'peak', 'standard', 'closed', 'disabled-date');
          });

          // Style the time slots based on the day's pricing
          var date = new Date(currentDate);
          var isSelectable = isDateSelectable(date, currentViewDate);
          var dayClass = '';

          console.log('Checking date:', currentDate, 'in arrays:');
          console.log('Off-peak includes:', offPeakDates.includes(currentDate));
          console.log('Peak includes:', peakDates.includes(currentDate));
          console.log('Standard includes:', standardDates.includes(currentDate));
          console.log('Closed includes:', closedDates.includes(currentDate));

          if (!isSelectable) {
            dayClass = 'disabled-day';
          } else if (offPeakDates.includes(currentDate)) {
            dayClass = 'off-peak-day';
          } else if (peakDates.includes(currentDate)) {
            dayClass = 'peak-day';
          } else if (standardDates.includes(currentDate)) {
            dayClass = 'standard-day';
          } else if (closedDates.includes(currentDate)) {
            dayClass = 'closed-day';
          }

          console.log('Applied day class:', dayClass); // Debug line

          // Apply the class to all time slots
          document.querySelectorAll('.fc-timegrid-slot.fc-timegrid-slot-lane').forEach(function(slot) {
            slot.classList.remove('off-peak-day', 'peak-day', 'standard-day', 'closed-day', 'disabled-day');
            if (dayClass) {
              slot.classList.add(dayClass);
            }
          });
        } else {
          // Remove day view classes when not in day view
          document.querySelectorAll('.fc-col-header-cell').forEach(function(headerCell) {
            headerCell.classList.remove('day-view-header');
          });
          document.querySelectorAll('.fc-timegrid-slot.fc-timegrid-slot-lane').forEach(function(slot) {
            slot.classList.remove('off-peak-day', 'peak-day', 'standard-day', 'closed-day', 'disabled-day');
          });
        }
      }, 100);
    }

    // Helper function to apply color classes to any element (for month view)
    function applyColorToElement(element, dateStr) {
      var date = new Date(dateStr);
      var isSelectable = isDateSelectable(date, currentViewDate);

      element.classList.remove('off-peak', 'peak', 'standard', 'closed', 'disabled-date');

      // For week/day views, don't add disabled-date class
      if (!isSelectable && calendar && calendar.view.type === 'dayGridMonth') {
        element.classList.add('disabled-date');
        return;
      }

      if (offPeakDates.includes(dateStr)) {
        element.classList.add('off-peak');
      } else if (peakDates.includes(dateStr)) {
        element.classList.add('peak');
      } else if (standardDates.includes(dateStr)) {
        element.classList.add('standard');
      } else if (closedDates.includes(dateStr)) {
        element.classList.add('closed');
      }

      // Add visual feedback for clickable dates
      if (eventMapping[dateStr]) {
        element.style.cursor = 'pointer';
        element.setAttribute('title', 'Click to purchase tickets');
      }
    }

    // Helper function to get current view date for day view
    function getCurrentViewDate() {
      if (calendar && calendar.view && calendar.view.currentStart) {
        return calendar.view.currentStart.toISOString().split('T')[0];
      }
      return null;
    }

    // Enhanced function to remove day character
    function removeDayCharacter() {
      setTimeout(function() {
        const dayNumbers = document.querySelectorAll('.fc-daygrid-day-number');
        dayNumbers.forEach(function(element) {
          if (element.textContent) {
            // Remove various day suffixes for different locales
            element.textContent = element.textContent
              .replace('日', '')     // Japanese/Chinese
              .replace('號', '')     // Traditional Chinese alternative
              .replace('号', '')     // Simplified Chinese alternative
              .trim();
          }
        });
      }, 50);
    }

    // Debounced versions for better performance
    const debouncedApplyClasses = debounce(applyAllDateClassesAllViews, 100);
    const debouncedRemoveDayChar = debounce(removeDayCharacter, 100);

    // Initialize FullCalendar with enhanced configuration
    try {
      var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: detectLocale(),
        dayNumberFormat: { day: 'numeric' },
        dayHeaderFormat: { weekday: 'short' },
        titleFormat: { year: 'numeric', month: 'long' },
        initialView: 'dayGridMonth',
        height: 'auto',
        firstDay: 1, // Start week on Monday
        allDaySlot: false,           // Remove all-day row
        slotMinTime: '14:30:00',     // Start at 2:30 PM
        slotMaxTime: '21:30:00',     // End at 11:00 PM
        slotDuration: '00:30:00',    // 30-minute intervals
        eventMinHeight: 25,          // Minimum height for events
        eventShortHeight: 20,        // Height for short events

        // Add view-specific header formats
        views: {
          timeGridWeek: {
            dayHeaderFormat: { weekday: 'short', month: 'short', day: 'numeric' },
            slotLabelFormat: {
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }
          },
          timeGridDay: {
            dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric' },
            slotLabelFormat: {
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }
          }
        },

        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        validRange: {
          start: '2026-02-01',
          end: '2026-03-02' //2026-03-02 or 2026-01-12
        },
        initialDate: '2025-12-22',
        events: myEvents,
        selectable: true,
        fixedWeekCount: false,
        showNonCurrentDates: false,

        // Custom day cell content to remove day characters
        dayCellContent: function(info) {
          return { html: info.dayNumberText.replace(/[日號号]/g, '') };
        },

        // Enhanced event display for different views
        eventContent: function(info) {
          if (info.event.classNames.includes('circus-show')) {
            var showTime = info.event.extendedProps.showTime;
            var view = info.view.type;

            if (view === 'dayGridMonth') {
              // Extract just the time from the showTime (e.g., "2:30 PM" becomes "2:30")
              var timeOnly = showTime.replace(' PM', '').replace(' AM', '');
              return { html: '<div style="font-size: 12px; color: black; line-height: 1; padding: 1px;">' + timeOnly + '</div>' };
            } else {
              return { html: '<div style="font-size: 11px; font-weight: bold; color: black;">' + showTime + '</div>' };
            }
          }
          return true; // Use default rendering for other events
        },

        // Enhanced event click handling
        eventClick: function(info) {
          if (info.jsEvent) {
            info.jsEvent.preventDefault();
            info.jsEvent.stopPropagation();
          }

          var event = info.event;
          var eventId = event.extendedProps.eventId;
          var dateStr = event.extendedProps.dateStr;
          var showTime = event.extendedProps.showTime; // Get the specific show time

          if (eventId && dateStr && showTime) {
            console.log('Event clicked:', dateStr, 'Time:', showTime, 'Opening Eventbrite...');
            openEventbriteForDate(dateStr, showTime); // Pass the specific show time
            return false;
          } else {
            console.log('Missing event data - eventId:', eventId, 'dateStr:', dateStr, 'showTime:', showTime);
          }
        },
        datesSet: function(info) {
          console.log('Current view changed to:', info.start, 'to', info.end);
          console.log('View type:', calendar.view.type);

          if (calendar.view.type === 'dayGridMonth') {
            // For month view, use the main month logic
            var mainMonth = getMainMonthFromView(info.start, info.end);
            currentViewDate = new Date(mainMonth.getFullYear(), mainMonth.getMonth(), 1);
          } else {
            // For week/day views, don't restrict by month - show all events in the range
            currentViewDate = null; // This will disable month filtering
          }

          debouncedApplyClasses();
          debouncedRemoveDayChar();
          translateViewButtons();
        },
        dayCellDidMount: function(info) {
          applyClassToDate(info);
        },

        // Modified event rendering - all events white with black text
        eventDidMount: function(info) {
          if (info.event.classNames.includes('circus-show')) {
            // Apply white background with black text for all events
            info.el.style.backgroundColor = 'white';
            info.el.style.borderColor = '#ddd';
            info.el.style.color = 'black';
            info.el.style.cursor = 'pointer';
            info.el.setAttribute('title', 'Click to purchase tickets');
            // Always show events regardless of month
            info.el.style.display = 'block';
          }
        }
      });

      // Start initialization
      loadEventbriteScript();
      calendar.render();
      translateViewButtons();
      applyAllDateClassesAllViews();
      removeDayCharacter();

      console.log('Calendar initialized successfully with locale:', detectLocale());
      console.log('Total events loaded:', myEvents.length);

    } catch (error) {
      console.error('Error initializing FullCalendar:', error);
    }
  }

  // Start waiting for FullCalendar
  waitForFullCalendar();
});