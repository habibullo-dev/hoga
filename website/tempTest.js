 // Function to distribute widget customization on load


 // Function to create a new widget
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
         widget.innerHTML = `
         <div class="widget-content">
           ${html}
         </div>
       `;

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
 }