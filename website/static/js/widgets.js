// Define widgets as a global object
window.widgets = {}; //🚧modified to window-level var

window.DOMstorage = {};
let gridContainer;
let widgetsClicked = [];
let createWidget;

async function distribWidgetSettings(_settings) {
  await new Promise(resolve => {
    document.addEventListener("DOMContentLoaded", resolve);
  });
  Object.keys(_settings).forEach((key) => {
    console.log("!! At the time of running DistribWidgetSettings, what is widgetSettingsBulk?", widgetSettingsBulk)
    console.log("!! widgetSettingsBulk and key? ", widgetSettingsBulk[key])
    console.log("Distributing widget settings!: ", key, typeof key)
    if (widgetSettingsBulk[key]["active"]) {
      createWidget(key, true)
    } else {
      console.log(`${key} was not active: ${widgetSettingsBulk[key]["active"]}`)
    }
  })
}



document.addEventListener("DOMContentLoaded", function () {


  // Function to create a new widget
  createWidget = async function (widgetId, startUp) {
    console.log("Running Widget Creator - ", widgetId)
    const existingWidget = widgets[widgetId];
    if (!existingWidget) {
      console.log("!!Creating new Widget after DOM: ", widgetId)
      console.log("DOM Loaded!")
      const widgetHtml = `../static/html/${widgetId}.html`; // Path to HTML content
      const widgetCss = `../static/css/${widgetId}.css`; // Path to CSS styling
      const widgetScript = `../static/js/${widgetId}.js`; // Path to JS

      console.log("WIDGEY", widgetHtml, widgetCss, widgetScript)

      // Get initial size based on widget ID
      const { width, height } = getInitialSize(widgetId);

      // Get custom min and max dimensions based on widget ID
      const minWidth = getMinWidth(widgetId);
      const minHeight = getMinHeight(widgetId);
      const maxWidth = getMaxWidth(widgetId);
      const maxHeight = getMaxHeight(widgetId);

      // Create widget element
      const widget = document.createElement("div");
      widget.classList.add("widget", `widget-${widgetId}`);
      widget.dataset.id = widgetId;

      // Fetch HTML content from external file
      fetch(widgetHtml)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load HTML: ${response.status}`);
          }
          return response.text();
        })
        .then(async (html) => {
          // Load HTML content into widget
          widget.innerHTML = `${html}`
          DOMstorage[widgetId] = widget
            ;

          // After HTML is loaded, ensure any scripts and styles are processed
          // processScripts(widget);

          // Set initial styles and attributes
          widget.style.position = "absolute";
          widget.style.left = "0px";
          widget.style.top = "60px";
          widget.style.width = `${width}px`; // Initial width based on ID
          widget.style.height = `${height}px`; // Initial height based on ID
          widget.style.backgroundColor = "transparent";
          // widget.style.border = "1px solid black";
          widget.style.overflow = "hidden";
          widget.style.resize = "both";
          widget.style.zIndex = "1";
          widget.style.flexDirection = "column";
          widget.style.display = "flex";

          // Make widget draggable and resizable
          $(widget)
            .draggable({
              containment: "parent",
              grid: [10, 10],
            })
            .resizable({
              containment: "parent",
              minWidth: minWidth,
              minHeight: minHeight,
              maxWidth: maxWidth,
              maxHeight: maxHeight,
            });

          // Append widget to grid container
          gridContainer.appendChild(widget);

          // Position the widget dynamically
          positionWidget(widget);

          // Load CSS stylesheet for the widget
          loadWidgetStylesheet(widgetCss);

          // Load Scripts for the widget
          await loadWidgetScript(widgetScript, () => {
            console.log(`Script ${widgetScript} executed`);
          });

          // checkMusicPlayerSize();
          //   // Call size checking function to apply styles based on initial size
          //   if (widgetType === "music-player") {
          //     checkMusicPlayerSize();
          //   } else if (widgetType === "calendar") {
          //     // Call function for calendar widget size checking
          //   } else if (widgetType === "tasks-list") {
          //     // Call function for tasks list widget size checking
          //   }

          // Store widget instance
          widgets[widgetId] = widget;
          autoSetupWidget(widgetSettingsBulk[widgetId], widget, startUp);
          console.log("!!BEFORE AUTOSETUP WIDGET WHAT THE STATUS OF WIDGETSETTINGSBULK, ", widgetSettingsBulk)

          //   // Call function to restore widget state (if any)
          //   restoreWidgetState(widgetId);
        })
        .catch((error) => {
          console.error("Error loading HTML:", error);
          // If HTML load fails, show default content
          widget.innerHTML = `
          <div class="widget-content">
            <h2>Default Widget Content</h2>
            <p>This is the default content for widget ${widgetId}.</p>
          </div>
        `;

          // Set styles for default content
          widget.style.position = "absolute";
          widget.style.left = "10px";
          widget.style.top = "30px";
          widget.style.width = "200px";
          widget.style.height = "150px";
          widget.style.backgroundColor = "lightblue";
          widget.style.border = "1px solid black";
          widget.style.borderRadius = "5px";
          widget.style.overflow = "hidden";
          widget.style.resize = "both";
          widget.style.zIndex = "1";

          // Make widget draggable and resizable
          $(widget)
            .draggable({
              containment: "parent",
              grid: [10, 10],
            })
            .resizable({
              containment: "parent",
              minHeight: 100,
              minWidth: 100,
              maxWidth: 400,
              maxHeight: 300,
            });

          // Append widget to grid container
          gridContainer.appendChild(widget);

          // Position the widget dynamically
          positionWidget(widget);

          // Store widget instance
          widgets[widgetId] = widget;
        });
      /*       console.log("TRACK WIDGET DOM 1,", widgetSettingsBulk[widgetId]["widgetDOM"])⚠️⚠️⚠️
            widgetSettingsBulk[widgetId]["widgetDOM"] = widget//🚧adding widget cont to settings to track its DOM
            console.log("TRACK WIDGET DOM 2,", widgetSettingsBulk[widgetId]["widgetDOM"]) */
    } else {
      console.log("!!Widget already exists: ", widgetId)
    }
  }//createWidget End


  let editClicked = false; // Flag to track if Edit (w-edit) is clicked
  let saveClicked = false; // Flag to track if Save (w-save) is clicked

  gridContainer = document.getElementById("grid-container");
  const editButton = document.getElementById("w-edit");
  const saveButton = document.getElementById("w-save");
  const layoutButton = document.getElementById("w-layout"); // The layout button
  const sidebarMenu = document.querySelector(".sidebar-menu"); // Sidebar menu element
  const widgetButtons = [editButton, saveButton];

  const widgets = document.querySelectorAll(".tooltip img");
  window.otherWidgets = Array.from(widgets).filter( //🚧changed to window global var
    (widget) => !widgetButtons.includes(widget)
  );

  // Event listener for Edit (w-edit) button
  editButton.addEventListener("click", editBtnClick);
  function editBtnClick() { //🚧changed to named function for reuse.
    console.log("!!clicked edit Button")
    editClicked = true;
    saveClicked = false; // Reset saveClicked when Edit is clicked
    document
      .querySelector(".notch-container")
      .setAttribute("data-edit-mode", "true");
    editButton.style.display = "none";
    saveButton.style.display = "inline-block";
    restoreWidgetStates(); // Restore widget states on Edit click
    enableWidgetInteractions(); // Enable draggable and resizable
    enableOtherWidgets(); // Enable click on other widgets
  }

  function enableWidgetInteractions() {
    // Enable draggable for active widgets
    widgetsClicked.forEach((widgetId) => {
      const widget = widgets[widgetId];
      if (widget) {
        $(widget).draggable("enable");
        $(widget).resizable("enable");
      }
    });
  }

  // Event listener for Save (w-save) button
  saveButton.addEventListener("click", saveBtnClick);
  function saveBtnClick(_skipOverWrite) { //🚧changed to named function for reuse.
    console.log("!!clicked save Button")
    if (editClicked) {
      saveButton.style.display = "none";
      editButton.style.display = "inline-block";
      document
        .querySelector(".notch-container")
        .removeAttribute("data-edit-mode");
      saveClicked = true; // Set saveClicked to true on Save click
      saveWidgetStates(_skipOverWrite); // Save widget states on Save click
      disableWidgetInteractions(); // Disable draggable and resizable
      createNotification(); // Add notification on Save click
      hideSidebar();
    }
  }

  function disableWidgetInteractions() {
    // Disable draggable for active widgets
    widgetsClicked.forEach((widgetId) => {
      const widget = widgets[widgetId];
      if (widget) {
        $(widget).draggable("disable");
        $(widget).resizable("disable");
      }
    });
  }

  // Event listener for each widget in otherWidgets
  otherWidgets.forEach((widget) => {
    widget.addEventListener("click", function () {
      if (
        editClicked &&
        !saveClicked &&
        widget.id !== "w-edit" &&
        widget.id !== "w-save" &&
        widget.id !== "w-layout"
      ) {
        toggleWidgetState(widget);
      }
    });
  });

  // Event listener for layout button
  layoutButton.addEventListener("click", function () {
    if (editClicked && !saveClicked) {
      toggleSidebar();
    }
  });

  // Function to toggle the sidebar
  function toggleSidebar() {
    if (
      sidebarMenu.style.display === "none" ||
      sidebarMenu.style.display === ""
    ) {
      sidebarMenu.style.display = "block";
    } else {
      sidebarMenu.style.display = "none";
    }
  }

  // Function to hide the sidebar
  function hideSidebar() {
    sidebarMenu.style.display = "none";
  }

  // Function to toggle widget state
  function toggleWidgetState(widget, noCreate) {

    if (noCreate) {
      console.log("!! noCreate was TRUE ", noCreate)
    } else {
      console.log("!! noCreate was FALSE ", noCreate)
    }

    const widgetId = widget.id;
    if (widget.classList.contains("clicked")) {
      widget.classList.remove("clicked");
      resetWidgetStyles(widget);
      // Remove from widgetsClicked array
      widgetsClicked = widgetsClicked.filter((id) => id !== widgetId);
      console.log("!!toggleWidgetState - what is the widget ", widget) //this is just the fucking image
      console.log("!!toggleWidgetState - what is the widgetId ", widgetId)
      // Remove widget from grid
      if (widgets[widgetId]) {
        gridContainer.removeChild(widgets[widgetId]);
        console.log("!!toggleWidgetState - what is widgets[widgetId], ", widgets[widgetId]) //THIS IS THE DAMN DIV! FINALLY
        widgetSettingsBulk[widgetId].active = false;//🚧consider the widget as inactive.
        delete widgets[widgetId];

      }
    } else {
      widget.classList.add("clicked");
      applyWidgetStyles(widget);
      // Add to widgetsClicked array if not already present
      if (!widgetsClicked.includes(widgetId)) {
        widgetsClicked.push(widgetId);
        // Call createWidget function when widget is clicked
        if (!noCreate) {
          createWidget(widgetId);
        }
      }
    }
  }

  // Function to apply widget styles when clicked
  function applyWidgetStyles(widget) {
    if (widget !== editButton && widget !== saveButton) {
      widget.style.backgroundColor = "orangered";
      widget.style.filter = "invert(1)";
      widget.style.borderRadius = "5px";
    }
  }

  // Function to reset widget styles when unclicked
  function resetWidgetStyles(widget) {
    if (widget !== editButton && widget !== saveButton) {
      widget.style.backgroundColor = "";
      widget.style.filter = "";
      widget.style.borderRadius = "";
    }
  }

  // Function to restore widget states
  function restoreWidgetStates() {
    otherWidgets.forEach((widget) => {
      const widgetId = widget.id;
      if (widgetsClicked.includes(widgetId)) {
        // Restore clicked state
        widget.classList.add("clicked");
        applyWidgetStyles(widget);
      } else {
        // Restore unclicked state
        widget.classList.remove("clicked");
        resetWidgetStyles(widget);
      }
    });
  }

  // Function to enable other widgets
  function enableOtherWidgets() {
    otherWidgets.forEach((widget) => {
      widget.classList.remove("disabled");
    });
  }

  //   // Function to save widget states
  //   function saveWidgetStates() {
  //     const widgetStates = [];

  //     // Iterate over widgets that are clicked
  //     widgetsClicked.forEach((widgetId) => {
  //       const widget = widgets[widgetId];

  //       // Get widget position and size
  //       const widgetState = {
  //         id: widgetId,
  //         left: widget.style.left,
  //         top: widget.style.top,
  //         width: widget.style.width,
  //         height: widget.style.height,
  //       };

  //       // Push widget state to widgetStates array
  //       widgetStates.push(widgetState);
  //     });

  //     // Log or process widgetStates array as needed
  //     console.log("Active Widget States:", widgetStates);
  //   }

  let saveTimer; // Variable to store the auto-save timer

  // Function to initialize auto-save timer
  function initializeAutoSave() {
    // Clear any existing timer
    if (saveTimer) clearInterval(saveTimer);

    // Set a new timer for auto-save every 20 minutes
    saveTimer = setInterval(autoSave, 20 * 60 * 1000);

    console.log("Auto-save initialized.");
  }

  // Function to perform auto-save
  function autoSave() {
    console.log("Auto-saving...");

    // Perform your auto-save operation here
    saveWidgetStates();
  }

  // Function to save widget states with dynamic data points
  function saveWidgetStates(_skipOverWrite) {
    //let widgetStates = [] 🚧CHANGED ARRAY STORAGE TO WINDOW-LEVEL OBJ STORAGE LOGIC - See above
    console.log("!!Calling saveWidgetStates")
    // Iterate over widgets that are clicked or active
    widgetsClicked.forEach((widgetId) => {
      console.log("!!how many widgets considered clicked? ", widgetsClicked)

      const widget = widgets[widgetId];
      // Initialize widgetData object
      console.log("!!current widget's data: ", widget.style.top)
      let widgetData = {
        id: widgetId,
        position: {
          left: widget.style.left,
          top: widget.style.top,
        },
        size: {
          width: widget.style.width,
          height: widget.style.height,
        },
        active: true, //🚧 Added new data: active. Defined to make sure js checks if the widget was opened or closed when initalizing page
      };


      console.log("!! WIDGET SAVE< WHAT IS WIDGET DATA", widgetData)
      // Extract additional data based on widgetId
      switch (widgetId) {
        // case "w-spotify":
        //   // Extract music player specific data
        //   widgetData.songTitle = widget.querySelector(
        //     ".player__song-title"
        //   ).textContent;
        //   widgetData.artist =
        //     widget.querySelector(".player__artist").textContent;
        //   widgetData.albumArt = widget
        //     .querySelector(".player__album img")
        //     .getAttribute("src");
        //   break;
        case "w-calendar":
          // Extract calendar specific data
          widgetData.events = []; // Placeholder for events data
          break;
        case "w-tasks":
          // Extract tasks list specific data and save
          widgetData.taskList = extractTaskData();
          saveTaskListSetup(); // Save the extracted task data
          break;
        case "w-timer":
          // Extract stopwatch specific data
          widgetData.timerValue = "00:00:00"; // Placeholder for timer value
          break;
        // case "w-youtube":
        //   // Extract YouTube player specific data
        //   widgetData.videoTitle = widget.querySelector(
        //     ".youtube-player__title"
        //   ).textContent;
        //   widgetData.videoUrl = widget
        //     .querySelector(".youtube-player__video")
        //     .getAttribute("src");
        //   break;
        case "w-weather":
          // Extract weather widget specific data
          widgetData.temperature = "23°C"; // Placeholder for temperature
          widgetData.location = "New York"; // Placeholder for location
          break;
        default:
          // Handle default case or any additional widgets
          break;
      }

      // Push widgetData to widgetStates array
      //widgetStates.push(widgetData); 🚧CHANGED ARRAY STORAGE TO OBJ STORAGE LOGIC - See below
      // Move widgetData as K/V pair to window.widgetStates
      console.log("!!WHAT IS WIDGETSETTINGSBULK PRESAVE, ", widgetSettingsBulk[widgetId])
      console.log("Is _skipOverwrite present?", _skipOverWrite)
      if (_skipOverWrite != "confirm _skipOverWrite") {
        console.log("Overwriting bulk triggered.")
        widgetSettingsBulk[widgetId] = widgetData
      }
      console.log("!!WHAT IS WIDGETSETTINGSBULK POSTSAVE, ", widgetSettingsBulk[widgetId])

    });

    // Log or process widgetStates array as needed
    console.log("Active Widget States:", widgetSettingsBulk);
    saveSettings();
  }

  // Call initializeAutoSave() to start the auto-save mechanism
  initializeAutoSave();

  // Function to create notification
  function createNotification() {
    console.log("!!Created a notif!")
    const notification = document.createElement("div");
    notification.classList.add("notification");

    // Styles
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "white";
    notification.style.fontFamily = "Albert Sans";
    notification.style.color = "black";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "8px";
    notification.style.zIndex = "1000";
    notification.style.opacity = "1";
    notification.style.transition = "opacity 0.5s ease-in-out";

    // Create and style the icon image
    const icon = document.createElement("img");
    icon.src = "../static/images/logo-rev.png";
    icon.alt = "Icon";
    icon.style.width = "40px"; // Adjust the width of the icon as needed
    icon.style.display = "block"; // Ensure icon is on its own line

    // Create and style the text element
    const text = document.createElement("div");
    text.textContent = "Changes successfully saved.";
    text.style.marginTop = "5px"; // Adjust spacing between icon and text
    text.style.fontSize = "0.9rem"; // Adjust font size of the text

    // Append icon and text to notification container
    notification.appendChild(icon);
    notification.appendChild(text);

    document.body.appendChild(notification);

    // Fade out after 2 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.remove();
      }, 500); // Remove element after fade out animation
    }, 2000);
  }

  //   // Function to determine widget type based on widgetId
  //   function determineWidgetType(widgetId) {
  //     switch (widgetId) {
  //       case "w-spotify":
  //         return "music-player";
  //       case "w-calendar":
  //         return "calendar";
  //       case "w-tasks":
  //         return "tasks-list";
  //       case "w-timer":
  //         return "stopwatch";
  //       case "w-youtube":
  //         return "youtube-player";
  //       case "w-weather":
  //         return "weather";
  //       default:
  //         return "default"; // Default type
  //     }
  //   }

  // Function to get initial size based on widget type
  function getInitialSize(widgetId) {
    switch (widgetId) {
      case "w-spotify":
        return { width: 300, height: "" };
      case "w-calendar":
        return { width: 300, height: 300 };
      case "w-tasks":
        return { width: 220, height: 200 };
      case "w-timer":
        return { width: "fit-content", height: "fit-content" };
      case "w-youtube":
        return { width: 400, height: "fit-content" };
      case "w-weather":
        return { width: 200, height: 200 };
      case "w-search":
        return { width: 270, height: "fit-content" };
      default:
        return { width: 200, height: 200 }; // Default size
    }
  }

  function getMinWidth(widgetId) {
    switch (widgetId) {
      case "w-spotify":
        return 150;
      case "w-calendar":
        return 100;
      case "w-tasks":
        return 150;
      case "w-timer":
        return 300;
      case "w-youtube":
        return 200;
      case "w-weather":
        return 150;
      case "w-search":
        return 200;
      default:
        return 100;
    }
  }

  function getMaxWidth(widgetId) {
    switch (widgetId) {
      case "w-spotify":
        return 400;
      case "w-calendar":
        return 590;
      case "w-tasks":
        return 400;
      case "w-timer":
        return 500;
      case "w-youtube":
        return 430;
      case "w-weather":
        return 300;
      case "w-search":
        return 400;
      default:
        return 600;
    }
  }

  function getMinHeight(widgetId) {
    switch (widgetId) {
      case "w-spotify":
        return 100;
      case "w-calendar":
        return 150;
      case "w-tasks":
        return 100;
      case "w-timer":
        return 150;
      case "w-youtube":
        return 150;
      case "w-weather":
        return 100;
      case "w-search":
        return 250;
      default:
        return 80;
    }
  }

  function getMaxHeight(widgetId) {
    switch (widgetId) {
      case "w-spotify":
        return 250;
      case "w-calendar":
        return 490;
      case "w-tasks":
        return 400;
      case "w-timer":
        return 300;
      case "w-youtube":
        return 430;
      case "w-weather":
        return 200;
      case "search":
        return 350;
      default:
        return 500;
    }
  }



  /* // Function to create a new widget //🚧MOVING OUT OF DOMCONTENT LOAD
  function createWidget(widgetId) {
    const existingWidget = widgets[widgetId];
    if (!existingWidget) {
      const widgetHtml = `./templates/${widgetId}.html`; // Path to HTML content
      const widgetCss = `./static/css/${widgetId}.css`; // Path to CSS styling
      const widgetScript = `./static/js/${widgetId}.js`; // Path to JS

      // Get initial size based on widget ID
      const { width, height } = getInitialSize(widgetId);

      // Get custom min and max dimensions based on widget ID
      const minWidth = getMinWidth(widgetId);
      const minHeight = getMinHeight(widgetId);
      const maxWidth = getMaxWidth(widgetId);
      const maxHeight = getMaxHeight(widgetId);

      // Create widget element
      const widget = document.createElement("div");
      widget.classList.add("widget", `widget-${widgetId}`);
      widget.dataset.id = widgetId;

      // Fetch HTML content from external file
      fetch(widgetHtml)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load HTML: ${response.status}`);
          }
          return response.text();
        })
        .then((html) => {
          // Load HTML content into widget
          widget.innerHTML = `${html}`;

          // After HTML is loaded, ensure any scripts and styles are processed
          // processScripts(widget);

          // Set initial styles and attributes
          widget.style.position = "absolute";
          widget.style.left = "0px";
          widget.style.top = "60px";
          widget.style.width = `${width}px`; // Initial width based on ID
          widget.style.height = `${height}px`; // Initial height based on ID
          widget.style.backgroundColor = "transparent";
          // widget.style.border = "1px solid black";
          widget.style.overflow = "hidden";
          widget.style.resize = "both";
          widget.style.zIndex = "1";
          widget.style.flexDirection = "column";
          widget.style.display = "flex";

          // Make widget draggable and resizable
          $(widget)
            .draggable({
              containment: "parent",
              grid: [10, 10],
            })
            .resizable({
              containment: "parent",
              minWidth: minWidth,
              minHeight: minHeight,
              maxWidth: maxWidth,
              maxHeight: maxHeight,
            });

          // Append widget to grid container
          gridContainer.appendChild(widget);

          // Position the widget dynamically
          positionWidget(widget);

          // Load CSS stylesheet for the widget
          loadWidgetStylesheet(widgetCss);

          // Load Scripts for the widget
          loadWidgetScript(widgetScript, () => {
            console.log(`Script ${widgetScript} executed`);
          });

          // checkMusicPlayerSize();
          //   // Call size checking function to apply styles based on initial size
          //   if (widgetType === "music-player") {
          //     checkMusicPlayerSize();
          //   } else if (widgetType === "calendar") {
          //     // Call function for calendar widget size checking
          //   } else if (widgetType === "tasks-list") {
          //     // Call function for tasks list widget size checking
          //   }

          // Store widget instance
          widgets[widgetId] = widget;

          //   // Call function to restore widget state (if any)
          //   restoreWidgetState(widgetId);
        })
        .catch((error) => {
          console.error("Error loading HTML:", error);
          // If HTML load fails, show default content
          widget.innerHTML = `
            <div class="widget-content">
              <h2>Default Widget Content</h2>
              <p>This is the default content for widget ${widgetId}.</p>
            </div>
          `;

          // Set styles for default content
          widget.style.position = "absolute";
          widget.style.left = "10px";
          widget.style.top = "30px";
          widget.style.width = "200px";
          widget.style.height = "150px";
          widget.style.backgroundColor = "lightblue";
          widget.style.border = "1px solid black";
          widget.style.borderRadius = "5px";
          widget.style.overflow = "hidden";
          widget.style.resize = "both";
          widget.style.zIndex = "1";

          // Make widget draggable and resizable
          $(widget)
            .draggable({
              containment: "parent",
              grid: [10, 10],
            })
            .resizable({
              containment: "parent",
              minHeight: 100,
              minWidth: 100,
              maxWidth: 400,
              maxHeight: 300,
            });

          // Append widget to grid container
          gridContainer.appendChild(widget);

          // Position the widget dynamically
          positionWidget(widget);

          // Store widget instance
          widgets[widgetId] = widget;
        });
    }
  } */

  // // Process Styles from HTML
  // function processScripts(container) {
  //   // Extract scripts and stylesheets from the loaded HTML
  //   const scripts = container.querySelectorAll("script");
  //   const stylesheets = container.querySelectorAll('link[rel="stylesheet"]');

  //   // Load stylesheets
  //   stylesheets.forEach((stylesheet) => {
  //     const link = document.createElement("link");
  //     link.rel = "stylesheet";
  //     link.href = stylesheet.href;
  //     document.head.appendChild(link);
  //   });

  // Function to load JavaScript file dynamically
  function loadWidgetScript(jsFile, callback) { //🚧changed to promise for async running purpose
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = jsFile;
      script.type = "text/javascript";
      script.onload = () => {
        console.log(`JavaScript file loaded: ${jsFile}`);
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${jsFile}`));
      };
      document.body.appendChild(script);
    });
  }

  // // Timer Panel
  // const wTimer = document.getElementById("w-timer");
  // const iframe = document.getElementById("task-frame");

  // // Ensure iframe is initially hidden
  // if (iframe) {
  //   iframe.style.display = "none";
  // }

  // // Toggle visibility of iframe when w-timer is clicked
  // if (wTimer && iframe) {
  //   wTimer.addEventListener("click", function () {
  //     iframe.style.display = iframe.style.display === "none" ? "block" : "none";
  //     console.log("w-timer clicked. iframe display:", iframe.style.display);
  //   });
  // } else {
  //   console.error("w-timer or iframe element not found.");
  // }

  // Function to load CSS stylesheet dynamically
  function loadWidgetStylesheet(cssFile) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = cssFile;
    document.head.appendChild(link);
    console.log("CSS stylesheet loaded:", cssFile);
  }

  loadWidgetStylesheet("../css/styles.css");

  // // Log iframe load events for debugging
  // iframe.addEventListener("load", function () {
  //   console.log("iframe loaded successfully.");
  // });

  // Function to load CSS stylesheet dynamically
  function loadWidgetStylesheet(cssFile) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = cssFile;
    document.head.appendChild(link);
  }

  // Function to position the widget dynamically
  function positionWidget(widget) {
    const existingWidgets = document.querySelectorAll(".widget");
    const gridRect = gridContainer.getBoundingClientRect(); // Get dimensions of grid container

    // Initial position
    let left = 0;
    let top = 100;

    // Variables to track the largest bottom and right edges
    let maxRight = 0;
    let maxBottom = 0;

    // Calculate position based on existing widgets
    existingWidgets.forEach((existingWidget) => {
      const rect = existingWidget.getBoundingClientRect();

      // Update maxRight and maxBottom to the largest right and bottom edges found
      maxRight = Math.max(maxRight, rect.right);
      maxBottom = Math.max(maxBottom, rect.bottom);
    });

    // Check if there's enough space on the right
    if (maxRight + widget.offsetWidth + 10 <= gridRect.right) {
      left = maxRight + 10;
    } else {
      // Move to the next row
      left = 10;
      top = maxBottom + 10;
    }

    // Ensure widget does not overflow the bottom
    if (top + widget.offsetHeight > gridRect.bottom) {
      top = 10; // Reset to the top if it overflows
    }

    // Set the position of the new widget
    widget.style.left = `${left}px`;
    widget.style.top = `${top}px`;
  }

  function autoSetupWidget(widget, widgetElem, startUp) { //🚧
    console.log("!! - autoSetupWidget, the fuck is widget, widgetElem?", widget, widgetElem)

    try {
      // Toggles state of widget (IN ISLAND) to activate if active=true.
      if (widget.active) {
        console.log("!! autoSetupWidget - Widget detected as active: ", widget, widget.active)
        //momentarily simulates edit, widget creation then close.
        const decoupleId = document.querySelectorAll(`#${widget["id"]}`);
        console.log("!!how many id duplicates?: ", decoupleId)
        startUp ? editBtnClick() : console.log("Not start-up, edit button click aborted")
        toggleWidgetState(decoupleId[1], true)
        startUp ? saveBtnClick("confirm _skipOverWrite") : console.log("Not start-up, save button click aborted")
      }

      // Automatically sets up position of widget 
      widgetElem.style.left = widget.position.left; //This assumes the measurement value is stored in as well: ex: `250px` or `20vw`
      widgetElem.style.top = widget.position.top;

      // Automatically resizes widget
      widgetElem.style.width = widget.size.width
      widgetElem.style.height = widget.size.height

    } catch (error) {
      //console.log(`Widget properties not found for: Widget: ${widget.id}, DOM: ${widgetElem}`)
      console.log(`Error type: ${error} - Restoring default styling`)
      //console.log("WIDGETELEM TOP: ", widgetElem.style.top)
    }


  }

});


