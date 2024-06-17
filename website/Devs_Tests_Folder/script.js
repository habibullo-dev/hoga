$(document).ready(function () {
  const gridContainer = $("#grid-container");
  const addWidgetBtns = $(".add-widget-btn");
  const editBtn = $("#edit-btn");
  const saveBtn = $("#save-btn");
  const deleteWidgetSection = $(".delete-buttons");
  const editPanel = $("#edit-panel");
  const gridSize = 20; // Size of each cell
  const activeWidgets = {}; // Store active widgets
  let takenPositions = []; // Store positions
  let editPanelInitialized = false; // Track edit panel

  editPanel.hide(); // Hide the panel initially

  // Check Grid Size
  console.log("Grid Size:", gridSize);
  console.log("Grid Width:", gridContainer.width());
  console.log("Grid Height:", gridContainer.height());

  function addWidget(type) {
    console.log("Adding widget of type:", type);
    // Check if widget already exists
    if (activeWidgets[type]) {
      activeWidgets[type].remove(); // Remove existing widget
      delete activeWidgets[type];
    }

    // Create the new widget element
    const widget = $(
      '<div class="widget ' +
        type +
        '">Widget: ' +
        type.charAt(0).toUpperCase() +
        type.slice(1) +
        '<div class="delete-btn"></div></div>'
    );
    gridContainer.append(widget);

    // Calculate initial size based on type
    const initialSize = getInitialSize(type);

    // Calculate the next available position for the widget
    const nextPosition = findNextAvailablePosition(widget);
    console.log("Next position:", nextPosition);
    widget.css({
      top: nextPosition.top + "px",
      left: nextPosition.left + "px",
      width: initialSize.width + "px",
      height: initialSize.height + "px",
      position: "absolute",
    });

    // Make the widget draggable and resizable
    widget
      .draggable({
        containment: "#grid-container",
        grid: [gridSize, gridSize],
        start: function (event, ui) {
          $(this).css("z-index", 999);
        },
        drag: function (event, ui) {
          console.log("Widget position:", ui.position);
        },
        stop: function (event, ui) {
          console.log("Draggable stopped.");
          checkOverlap(ui.helper);
          updateTakenPositions(); // Update taken positions after dragging stops
        },
      })
      .resizable({
        handles: "n, e, s, w, se", // Allow resizing from all sides and bottom right corner
        containment: "#grid-container",
        grid: [gridSize, gridSize], // Set the grid for resizing
        minWidth: getMinWidth(type), // Custom minimum width based on widget type
        minHeight: getMinHeight(type), // Custom minimum height based on widget type
        maxWidth: getMaxWidth(type), // Custom maximum width based on widget type
        maxHeight: getMaxHeight(type), // Custom maximum height based on widget type
        alsoResize: ".widget-content", // Dynamically adjust the size of the widget's content
        stop: function (event, ui) {
          console.log("Resizing stopped");
          const newPosition = $(this).position();
          console.log("New position after resize:", newPosition);
          adjustContent($(this));
          updateTakenPositions();
        },
      });

    // Store the widget
    activeWidgets[type] = widget;

    // Update the delete widget section
    updateDeleteWidgetSection();

    // Update the add widget section
    console.log("Added widget. Updating taken positions...");
    updateAddWidgetSection();
    updateTakenPositions(); // Ensure taken positions are updated after adding a widget
  }

  // Function to get initial size based on widget type
  function getInitialSize(type) {
    switch (type) {
      case "music-player":
        return { width: 200, height: 150 };
      case "calendar":
        return { width: 300, height: 300 };
      case "tasks-list":
        return { width: 250, height: 200 };
      case "stopwatch":
        return { width: 150, height: 150 };
      case "youtube-player":
        return { width: 400, height: 300 };
      case "weather":
        return { width: 200, height: 200 };
      default:
        return { width: 200, height: 200 }; // Default size
    }
  }

  // Function to get the custom min width
  function getMinWidth(type) {
    switch (type) {
      case "music-player":
        return 150;
      case "calendar":
        return 100;
      case "tasks-list":
        return 120;
      case "stopwatch":
        return 100;
      case "youtube-player":
        return 200;
      case "weather":
        return 150;
      default:
        return 100;
    }
  }

  // Function to get the custom min height
  function getMinHeight(type) {
    switch (type) {
      case "music-player":
        return 100;
      case "calendar":
        return 150;
      case "tasks-list":
        return 150;
      case "stopwatch":
        return 80;
      case "youtube-player":
        return 150;
      case "weather":
        return 100;
      default:
        return 80;
    }
  }

  // Function to get the custom max width
  function getMaxWidth(type) {
    switch (type) {
      case "music-player":
        return 400;
      case "calendar":
        return 590;
      case "tasks-list":
        return 250;
      case "stopwatch":
        return 200;
      case "youtube-player":
        return 400;
      case "weather":
        return 300;
      default:
        return 600;
    }
  }

  // Function to get the custom max height
  function getMaxHeight(type) {
    switch (type) {
      case "music-player":
        return 250;
      case "calendar":
        return 490;
      case "tasks-list":
        return 400;
      case "stopwatch":
        return 150;
      case "youtube-player":
        return 300;
      case "weather":
        return 200;
      default:
        return 600;
    }
  }

  // Function to find next available position for widget
  function findNextAvailablePosition(widget) {
    const gridWidth = gridContainer.width();
    const gridHeight = gridContainer.height();
    const cols = Math.floor(gridWidth / gridSize);
    const rows = Math.floor(gridHeight / gridSize);

    // Log the grid dimensions
    console.log("Grid Width:", gridWidth);
    console.log("Grid Height:", gridHeight);
    console.log("Cols:", cols);
    console.log("Rows:", rows);

    let foundPosition = null; // Initialize variable to store found position

    // Loop through each cell in the grid to find the first available space
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const top = r * gridSize;
        const left = c * gridSize;

        // Check if the position is not occupied
        if (!isOccupied(top, left)) {
          // Store the position and break out of the loop
          foundPosition = { top, left };
          break;
        }
      }
      // If position is found, break out of the outer loop
      if (foundPosition) break;
    }

    // If no available position found, return default position at top left
    return foundPosition || { top: 0, left: 0 };
  }

  // Function to check if position is occupied
  function isOccupied(top, left) {
    // Debugging isOccupied()
    console.log("Checking Position:", top, left);
    return takenPositions.some((pos) => pos.top === top && pos.left === left);
  }

  // Function to update taken positions
  function updateTakenPositions() {
    takenPositions = []; // Reset takenPositions array
    $(".widget").each(function () {
      const pos = $(this).position();
      const width = $(this).outerWidth();
      const height = $(this).outerHeight();
      const colSpan = Math.ceil(width / gridSize);
      const rowSpan = Math.ceil(height / gridSize);
      for (let r = 0; r < rowSpan; r++) {
        for (let c = 0; c < colSpan; c++) {
          takenPositions.push({
            top: pos.top + r * gridSize,
            left: pos.left + c * gridSize,
          });
        }
      }
    });
  }

  // Update taken positions after dragging and resizing stops
  $(".widget").on("dragstop resizestop", function () {
    updateTakenPositions();
  });

  // Function to check overlap / collision
  function checkOverlap(widget) {
    const widgetPos = widget.position();
    const widgetWidth = widget.outerWidth();
    const widgetHeight = widget.outerHeight();

    $(".widget")
      .not(widget)
      .each(function () {
        const pos = $(this).position();
        const width = $(this).outerWidth();
        const height = $(this).outerHeight();
        if (
          !(
            widgetPos.left + widgetWidth <= pos.left ||
            widgetPos.left >= pos.left + width ||
            widgetPos.top + widgetHeight <= pos.top ||
            widgetPos.top >= pos.top + height
          )
        ) {
          const nextPosition = findNextAvailablePosition(widget);
          widget.css({
            top: nextPosition.top + "px",
            left: nextPosition.left + "px",
          });
        }
      });
  }

  // Function to adjust content based on widget type
  function adjustContent(widget) {
    const type = widget.attr("class").split(" ")[1];
    const width = widget.width();
    const height = widget.height();

    switch (type) {
      case "music-player":
        adjustMusicPlayerContent(widget, width, height);
        break;
      case "calendar":
        adjustCalendarContent(widget, width, height);
        break;
      case "tasks-list":
        adjustTasksListContent(widget, width, height);
        break;
      case "stopwatch":
        adjustStopwatchContent(widget, width, height);
        break;
      case "youtube-player":
        adjustYouTubePlayerContent(widget, width, height);
        break;
      case "weather":
        adjustWeatherContent(widget, width, height);
        break;
      default:
        break;
    }

    // Ensure content doesn't overflow
    widget.find(".widget-content").css("overflow", "auto");

    // Re-enable resizing after adjusting content
    widget.resizable({
      handles: "n, e, s, w, se",
      containment: "#grid-container",
      grid: [gridSize, gridSize],
      minWidth: getMinWidth(type),
      minHeight: getMinHeight(type),
      maxWidth: getMaxWidth(type),
      maxHeight: getMaxHeight(type),
      alsoResize: ".widget-content",
      stop: function (event, ui) {
        console.log("Resizing stopped");
        const newPosition = $(this).position();
        console.log("New position after resize:", newPosition);
        adjustContent($(this));
        updateTakenPositions();
      },
    });
  }

  function adjustMusicPlayerContent(widget, width, height) {
    widget.html(`
      <div class="player">
        <div class="player__album">
          <img src="https://www.billboard.com/wp-content/uploads/2023/07/SZA-SOS-album-art-billboard-1240.jpg?w=800" alt="Album Art" />
        </div>
        <div class="player__info">
          <div class="player__details">
            <h2 class="player__song-title">Now Playing: Song Title</h2>
            <p class="player__artist">Artist Name</p>
          </div>
          <div class="player__controls">
            <button class="player__btn player__btn--play">&#9658;</button>
            <button class="player__btn player__btn--pause">&#10074;&#10074;</button>
            <button class="player__btn player__btn--next">&#9899</button> 
          </div>
        </div>
      </div>
    `);
  }

  // Function to check music player width and apply styles
  function checkMusicPlayerSize() {
    const musicPlayer = $(".widget.music-player");

    if (musicPlayer.length > 0) {
      const width = musicPlayer.width();
      const height = musicPlayer.height();
      console.log("Music Player Width:", width);
      console.log("Music Player Height:", height);

      // Reset classes before applying new ones
      musicPlayer.removeClass(
        "super-small-music-player small-music-player medium-music-player large-music-player"
      );

      // Check multiple conditions
      if (width < 190 && height < 199) {
        musicPlayer.addClass("super-small-music-player");
        console.log("Added super small-music-player class");
      } else if (width < 200 && height < 250) {
        musicPlayer.addClass("small-music-player");
        console.log("Added small-music-player class");
      } else if (width < 300 && height < 400) {
        musicPlayer.addClass("medium-music-player");
        console.log("Added medium-music-player class");
      } else {
        musicPlayer.addClass("large-music-player");
        console.log("Added large-music-player class");
      }
    }
  }

  // Initial check on document ready
  checkMusicPlayerSize();

  // Check on window resize
  $(window).on("resize", checkMusicPlayerSize);

  // Music Player Alternative
  // function adjustMusicPlayerContent(widget) {
  //   $.ajax({
  //     url: "music-player.html",
  //     method: "GET",
  //     dataType: "html",
  //     success: function (data) {
  //       widget.html(data);
  //       // Re-enable resizable functionality for the widget after content is loaded
  //       widget.resizable({
  //         handles: "n, e, s, w, se",
  //         containment: "#grid-container",
  //         grid: [gridSize, gridSize],
  //         minWidth: getMinWidth("music-player"),
  //         minHeight: getMinHeight("music-player"),
  //         maxWidth: getMaxWidth("music-player"),
  //         maxHeight: getMaxHeight("music-player"),
  //         alsoResize: ".widget-content",
  //         stop: function (event, ui) {
  //           adjustContent($(this));
  //           updateTakenPositions();
  //         },
  //       });
  //     },
  //     error: function (xhr, status, error) {
  //       const msg = `Error loading music-player.html: ${xhr.status} ${xhr.statusText}`;
  //       widget.html(
  //         `<div class="music-player-content"><div>${msg}</div></div>`
  //       );
  //     },
  //   });
  // }

  // Function to adjust calendar content

  // Calendar
  function adjustCalendarContent(widget, width, height) {
    // Clear existing content and classes
    widget
      .empty()
      .removeClass(
        "day-view three-day-view seven-day-view two-weeks-view full-month-view"
      );

    // Determine which view to display based on width and height
    if (width < 170 && height < 170) {
      // Day view
      generateCalendarContent(widget, 1);
      widget.addClass("day-view");
      console.log("Switched to day view");
    } else if (width < 310 && height < 170) {
      // 3-day view
      generateCalendarContent(widget, 3);
      widget.addClass("three-day-view");
      console.log("Switched to 3-day view");
    } else if (width < 600 && height < 170) {
      // 7-day view
      generateCalendarContent(widget, 7);
      widget.addClass("seven-day-view");
      console.log("Switched to 7-day view");
    } else if (width < 600 && height < 300) {
      // 2-weeks view
      generateCalendarContent(widget, 14);
      widget.addClass("two-weeks-view");
      console.log("Switched to 2-weeks view");
    } else {
      // Full month view (default)
      const daysInMonth = 30; // Replace with actual number of days in the current month
      generateCalendarContent(widget, daysInMonth);
      widget.addClass("full-month-view");
      console.log("Switched to full month view");
    }
  }

  // Function to generate calendar content dynamically
  function generateCalendarContent(widget, daysCount) {
    const currentDate = new Date();
    const currentMonth = getMonthName(currentDate.getMonth()); // Get month name from helper function
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate(); // Get the current day of the month
    const currentDayOfWeek = currentDate.getDay(); // Get the current day of the week (0 = Sunday, 6 = Saturday)
    const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentYear); // Get total days in the current month
    const days = [];

    let startDay, endDay;

    if (daysCount === 1) {
      // 1-day view: Only show the current day
      startDay = currentDay;
      endDay = currentDay;
    } else if (daysCount === 3) {
      // 3-day view: Show current day and surrounding days
      startDay = Math.max(1, currentDay - 1);
      endDay = Math.min(daysInMonth, currentDay + 1);
    } else if (daysCount === 7) {
      // 2-weeks view: Show current week and next week
      startDay = currentDay - currentDayOfWeek + 1; // Start from the current week's Sunday
      endDay = Math.min(daysInMonth, startDay + 6); // Show 14 days (current week + next week)
    } else if (daysCount === 14) {
      // 2-weeks view: Show current week and next week
      startDay = currentDay - currentDayOfWeek + 1; // Start from the current week's Sunday
      endDay = Math.min(daysInMonth, startDay + 13); // Show 14 days (current week + next week)
    } else {
      // Full month view
      startDay = 1; // Always start from the 1st day of the month
      endDay = daysInMonth; // End at the last day of the month
    }

    // Generate day items based on startDay and endDay
    for (let i = startDay; i <= endDay; i++) {
      let dayClass = "";
      if (i === currentDay) {
        dayClass = "current-day";
      } else if (i < 1 || i > daysInMonth) {
        // Handle out-of-range days
        dayClass = "out-of-range";
      }
      days.push(`<div class="day-item ${dayClass}">${i}</div>`);
    }

    widget.html(`
        <div class="calendar-content">
            <div class="calendar-header">${currentMonth}</div>
            <div class="calendar-grid">
                ${generateDayLabels(daysCount)}
                ${days.join("")}
            </div>
        </div>
    `);
  }

  // Helper function to get the month name
  function getMonthName(monthIndex) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthIndex];
  }

  // Helper function to get the number of days in a month
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Helper function to generate day labels based on view
  function generateDayLabels(daysCount) {
    let dayLabels = "";

    // Check if it's a day view (1-day or 3-day)
    if (daysCount === 1 || daysCount === 3) {
      // Generate only the necessary day labels
      for (let i = 0; i < daysCount; i++) {
        dayLabels += `<div class="day-label">${getDayLabel(i)}</div>`;
      }
    } else {
      // Generate all day labels for week and month views
      dayLabels = `
            <div class="day-label">Sun</div>
            <div class="day-label">Mon</div>
            <div class="day-label">Tue</div>
            <div class="day-label">Wed</div>
            <div class="day-label">Thu</div>
            <div class="day-label">Fri</div>
            <div class="day-label">Sat</div>
        `;
    }

    return dayLabels;
  }

  // Helper function to get day labels for 1-day or 3-day views
  function getDayLabel(index) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[index];
  }

  // Initial check on document ready
  $(document).ready(function () {
    const calendarWidget = $(".calendar-widget-selector");

    function adjustCalendarWidget() {
      const width = calendarWidget.width();
      const height = calendarWidget.height();
      adjustCalendarContent(calendarWidget, width, height);
    }

    // Initial adjustment
    adjustCalendarWidget();

    // Check on window resize
    $(window).on("resize", function () {
      adjustCalendarWidget();
    });
  });

  // Function to adjust tasks list content
  function adjustTasksListContent(widget, width, height) {
    widget.html(`
        <div class="tasks-list-content">
            <div class="task-item"><input type="checkbox" checked> Task 1</div>
            <div class="task-item"><input type="checkbox" checked> Task 2</div>
            <div class="task-item"><input type="checkbox"> Task 3</div>
            <input type="text" class="new-task-input" placeholder="New Task">
            <button class="add-task-btn">+</button>
        </div>
    `);
  }

  // Function to adjust stopwatch content
  function adjustStopwatchContent(widget, width, height) {
    widget.html(`
        <div class="stopwatch-content">
          <div>00:00:00</div>
          <button>Start</button>
          <button>Stop</button>
          <button>Reset</button>
        </div>
      `);
  }

  // Function to adjust YouTube player content
  function adjustYouTubePlayerContent(widget, width, height) {
    widget.html(`
        <div class="youtube-player-content">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
        </div>
      `);
  }

  // Function to adjust weather content
  function adjustWeatherContent(widget, width, height) {
    widget.html(`
        <div class="weather-content">
          <div class="weather-day">
            <div class="day-name">Monday</div>
            <div class="weather-icon">
              <img src="https://img.icons8.com/color/48/000000/sun--v1.png"/>
            </div>
            <div class="temperature">25°C</div>
          </div>
          <div class="weather-day">
            <div class="day-name">Tuesday</div>
            <div class="weather-icon">
              <img src="https://img.icons8.com/color/48/000000/partly-cloudy-day--v1.png"/>
            </div>
            <div class="temperature">22°C</div>
          </div>
          <div class="weather-day">
            <div class="day-name">Wednesday</div>
            <div class="weather-icon">
              <img src="https://img.icons8.com/color/48/000000/rain--v1.png"/>
            </div>
            <div class="temperature">18°C</div>
          </div>
        </div>
      `);
  }

  // Function to update delete widget section
  function updateDeleteWidgetSection() {
    deleteWidgetSection.empty(); // Clear previous delete buttons
    for (const type in activeWidgets) {
      let displayName = "";
      switch (
        type // Map widget types to display names
      ) {
        case "music-player":
          displayName = "Music Player";
          break;
        case "calendar":
          displayName = "Calendar";
          break;
        case "tasks-list":
          displayName = "Tasks List";
          break;
        case "stopwatch":
          displayName = "Stopwatch";
          break;
        case "youtube-player":
          displayName = "YouTube Player";
          break;
        case "weather":
          displayName = "Weather";
          break;
        default:
          displayName = type;
          break;
      }
      deleteWidgetSection.append(
        `<button class="delete-widget-btn" data-type="${type}">${displayName}</button>`
      );
    }
    $(".delete-widget-btn").click(function () {
      const widgetType = $(this).data("type");
      activeWidgets[widgetType].remove(); // Remove the widget from the DOM
      delete activeWidgets[widgetType];
      updateTakenPositions(); // Update taken positions after deletion
      updateDeleteWidgetSection(); // Update the delete widget section
      updateAddWidgetSection(); // Update the add widget section
    });
  }

  function updateAddWidgetSection() {
    addWidgetBtns.show(); // Show all add widget buttons first
    for (const type in activeWidgets) {
      addWidgetBtns.filter(`[data-type="${type}"]`).hide(); // Hide the button for active widget type
    }
  }

  //   // Event listener for edit button
  editBtn.click(function () {
    if (!editPanelInitialized) {
      editPanel.show(); // Show edit panel
      updateAddWidgetSection(); // Update the add widget section
      editBtn.hide(); // Hide edit button
      saveBtn.show(); // Show save button
      editPanelInitialized = true; // Set edit panel initialization flag
    } else {
      editPanel.toggle(); // Toggle edit panel visibility
      addWidgetBtns.toggle(); // Toggle add widget buttons visibility
      deleteWidgetSection.toggle(); // Toggle delete widget section visibility
      saveBtn.toggle(); // Toggle save button visibility
      updateAddWidgetSection(); // Update the add widget section

      // Re-enable draggable and resizable functionalities for each widget
      $(".widget").draggable("enable").resizable("enable");
    }
  });

  saveBtn.click(function () {
    // Check if the elements are initialized as draggable before disabling them
    $(".widget.ui-draggable").each(function () {
      if ($(this).data("ui-draggable")) {
        console.log("Disabling draggable:", this);
        $(this).draggable("disable");
      }
    });

    // Check if the elements are initialized as resizable before disabling them
    $(".widget.ui-resizable").each(function () {
      if ($(this).data("ui-resizable")) {
        console.log("Disabling resizable:", this);
        $(this).resizable("disable");
      }
    });

    // Hide add widget buttons, delete widget section, and save button
    editPanel.hide(); // Hide edit panel
    addWidgetBtns.hide();
    deleteWidgetSection.hide();
    saveBtn.hide();
    // Show edit button
    editBtn.show();
  });

  // Log all the info after clicking save
  function logWidgetInfo() {
    const widgetsInfo = [];

    $(".widget").each(function () {
      const widget = $(this);
      const type = widget.attr("class").split(" ")[1];
      const position = widget.position();
      const width = widget.width();
      const height = widget.height();
      const isActive = activeWidgets[type] !== undefined;

      widgetsInfo.push({
        type: type,
        isActive: isActive,
        position: { top: position.top, left: position.left },
        size: { width: width, height: height },
      });
    });

    console.log("Widget Information:", widgetsInfo);
  }

  $("#save-btn").on("click", function () {
    logWidgetInfo();
  });

  // Event listener for add widget buttons
  addWidgetBtns.click(function () {
    const type = $(this).data("type");
    addWidget(type);
  });
});
