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
      '2026-12-22': {
        '18:30': '2004855135680',
        '20:30': '2004877104389'
      },
      '2026-12-24': {
        '14:30': '2004855330262',
        '16:30': '2004877133476',
        '18:30': '2004877135482',
        '20:30': '2004877136485'
      },
      '2026-12-25': {
        '14:30': '2004877151530',
        '16:30': '2004877153536',
        '18:30': '2004877155542',
        '20:30': '2004877156545'
      },
      '2026-12-26': {
        '14:30': '2004877183626',
        '16:30': '2004877179614',
        '18:30': '2004877180617',
        '20:30': '2004877182623'
      },
      '2026-12-27': {
        '14:30': '2004877195662',
        '16:30': '2004877198671',
        '18:30': '2004877201680'
      },
      '2026-12-31': {
        '14:30': '2004877220737',
        '16:30': '2004877221740',
        '18:30': '2004877223746',
        '20:30': '2004877224749'
      },
      '2027-01-01': {
        '14:30': '2004877225752',
        '16:30': '2004877226755',
        '18:30': '2004877227758'
      },
      '2027-01-05': {
        '18:30': '2004877132473'
      },
      '2027-01-06': {
        '18:30': '2004877147518'
      },
      '2027-01-07': {
        '16:30': '2004877171590',
        '18:30': '2004877154539'
      },
      '2027-01-12': {
        '16:30': '2004877187638',
        '18:30': '2004877181620'
      },
      '2027-01-13': {
        '16:30': '2004877193656',
        '18:30': '2004877199674'
      },
      '2027-01-14': {
        '16:30': '2004877216725',
        '18:30': '2004877215722'
      },
      '2027-02-02': {
        '18:30': '2004877419331'
      },
      '2027-02-03': {
        '18:30': '2004877421337'
      },
      '2027-02-04': {
        '16:30': '2004877423343',
        '18:30': '2004877425349'
      },
      '2027-02-06': {
        '14:30': '2004877429361',
        '16:30': '2004877431367',
        '18:30': '2004877433373'
      },
      '2027-02-07': {
        '14:30': '2004877434376',
        '16:30': '2004877443403',
        '18:30': '2004877438388'
      },
      '2027-02-08': {
        '14:30': '2004877463463',
        '16:30': '2004877465469',
        '18:30': '2004877467475'
      },
      '2027-02-09': {
        '14:30': '2004877468478',
        '16:30': '2004877469481',
        '18:30': '2004877470484'
      },
      '2027-02-17': {
        '18:30': '2004877426352'
      },
      '2027-02-18': {
        '18:30': '2004877430364'
      },
      '2027-02-19': {
        '16:30': '2004877437385',
        '18:30': '2004877440394'
      }
    };

    var offPeakDates = [
      '2026-12-22',
      '2027-01-05', '2027-01-06', '2027-01-07',
      '2027-01-12', '2027-01-13', '2027-01-14',
      '2027-02-02', '2027-02-03', '2027-02-04',
      '2027-02-17', '2027-02-18', '2027-02-19'
    ];

    var peakDates = [
      '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-27', '2026-12-31',
      '2027-01-01',
      '2027-02-06', '2027-02-07', '2027-02-08', '2027-02-09'
    ];

    var standardDates = [];
    var closedDates = [];

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
        timezone: 'Asia/Hong_Kong',
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