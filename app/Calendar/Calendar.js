// Import the Application class from Application.js
import Application from "../Application.js";

// Define the Calendar class extending the Application class
export default class Calendar extends Application {
    // Define class properties: days and periods
    static days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    static periods = 7;

    // Declare instance properties
    gridElem; // The main timetable grid (table) element
    tbody; // The table body element containing the time slots
    selectedColor = null; // The currently selected color for time slots
    lastClickedTimeSlot = null; // The last clicked time slot element

    // Constructor for the Calendar class
    constructor(target) {
        super(target); // Call the parent (Application) class constructor
        this.initTimetable(); // Initialize the timetable
    }

    // Initialize the timetable
    initTimetable() {
    // ... Create and set up the timetable container, grid, and buttons
        const containerElem = document.createElement('div');
        containerElem.className = 'timetable-container';
        this.gridElem = document.createElement('table');
        this.gridElem.className = 'table table-bordered';
        this.gridElem.style.backgroundColor = 'white';
        this.initTimeSlots();
        this.initButtons();
        this.target.insertBefore(this.buttonGroupElem, this.target.firstChild);
        const spacerElem = document.createElement('div');
        spacerElem.style.height = '20px';
        this.target.insertBefore(spacerElem, this.target.children[1]);
        containerElem.appendChild(this.gridElem);
        this.target.appendChild(containerElem);
    }

    // Initialize the time slots within the timetable
    initTimeSlots() {
        // Create table head and header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
    
        // Loop through days and create a header cell for each day
        for (let day = 0; day < Calendar.days.length + 1; day++) {
          const headerElem = document.createElement('th');
          // Set the header cell's text content based on the current day
          headerElem.textContent = day === 0 ? "Timetable" : Calendar.days[day - 1];
          // Add the header cell to the header row
          headerRow.appendChild(headerElem);
        }

        // Add the header row to the table head and table head to the grid element
        thead.appendChild(headerRow);
        this.gridElem.appendChild(thead);

        // Create table body
        this.tbody = document.createElement('tbody');

        // Loop through periods and create a table row for each period
        for (let period = 1; period <= Calendar.periods; period++) {
            const rowElem = document.createElement('tr');

            // Loop through days and create a cell for each day
            for (let day = 0; day < Calendar.days.length + 1; day++) {
                if (day === 0) {
                    // If it's the first cell, create a time input for the period
                    const periodElemWrapper = document.createElement('div');
                    periodElemWrapper.className = 'time-input-wrapper';
                    const periodElem = document.createElement('input');
                    periodElem.setAttribute('type', 'time');
                    periodElemWrapper.appendChild(periodElem);
                    rowElem.appendChild(periodElemWrapper);
                } else {
                    // If it's not the first cell, create a time slot
                    const timeSlot = document.createElement('td');
                    timeSlot.className = 'time-slot';
                    timeSlot.setAttribute('contenteditable', 'true');
                    // Add a click event listener to update the lastClickedTimeSlot
                    timeSlot.addEventListener('click', () => {
                        this.lastClickedTimeSlot = timeSlot;
                    });
                    rowElem.appendChild(timeSlot);
                }
            }

            // Add the row to the table body
            this.tbody.appendChild(rowElem);
        }

        // Add the table body to the grid element
        this.gridElem.appendChild(this.tbody);
    }

// Initialize the buttons for the timetable
initButtons() {
    // Create a button group container
    const buttonGroupElem = document.createElement('div');
    buttonGroupElem.className = 'btn-group';

    // Define button properties, including their labels and colors
    const buttonNames = [
        { label: 'Break', color: 'btn-primary' },
        { label: 'Gym', color: 'btn-secondary' },
        { label: 'Study', color: 'btn-success' },
        { label: 'TV', color: 'btn-danger' },
        { label: 'Friends', color: 'btn-warning' },
        { label: 'Work', color: 'btn-info' },
        { label: 'Deselect', color: 'btn-dark' }
    ];

    // Create buttons for each label and color and add a click event listener
    buttonNames.forEach(buttonData => {
        const buttonElem = document.createElement('button');
        buttonElem.className = `btn ${buttonData.color}`;
        buttonElem.type = 'button';
        buttonElem.textContent = buttonData.label;
        buttonElem.addEventListener('click', () => {
            // Set the selected color based on the clicked button, or set to null if deselecting
            this.selectedColor = buttonElem.classList.contains('btn-dark') ? null : buttonData.color;

            // If a time slot has been clicked, set its background color based on the selected color
            if (this.lastClickedTimeSlot !== null) {
                if (this.selectedColor !== null) {
                    const lightColor = this.selectedColor.replace('btn', 'bg-light');
                    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(`--${lightColor}`).trim();
                    this.lastClickedTimeSlot.style.backgroundColor = backgroundColor;
                } else {
                    this.lastClickedTimeSlot.style.backgroundColor = '';
                }
            }
        });
        // Add the button to the button group container
        buttonGroupElem.appendChild(buttonElem);
    });

    // Create the "Add Row" button and add a click event listener
    const addRowButton = document.createElement('button');
    addRowButton.className = 'btn btn-outline-primary';
    addRowButton.type = 'button';
    addRowButton.textContent = 'Add Row';
    addRowButton.addEventListener('click', () => {
        this.addRow();
    });

    // Create the "Remove Row" button and add a click event listener
    const removeRowButton = document.createElement('button');
    removeRowButton.className = 'btn btn-outline-danger';
    removeRowButton.type = 'button';
    removeRowButton.textContent = 'Remove Row';
    removeRowButton.addEventListener('click', () => {
        this.removeRow();
    });

    // Create the "Save" button and add a click event listener
    const saveButton = document.createElement('button');
    saveButton.className = 'btn btn-outline-secondary';
    saveButton.type = 'button';
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        this.saveTable();
    });

    // Add the save, add row, and remove row buttons to the button group container
    buttonGroupElem.appendChild(saveButton);
    buttonGroupElem.appendChild(addRowButton);
    buttonGroupElem.appendChild(removeRowButton);

    // Set the button group container as a property of the class
    this.buttonGroupElem = buttonGroupElem;
}

    // Add a new row to the timetable
    addRow() {
        // ... Create and add a new row with time slots
        const rowElem = document.createElement('tr');
        for (let day = 0; day < Calendar.days.length + 1; day++) {
            if (day === 0) {
                const periodElemWrapper = document.createElement('div');
                periodElemWrapper.className = 'time-input-wrapper';
                const periodElem = document.createElement('input');
                periodElem.setAttribute('type', 'time');
                periodElemWrapper.appendChild(periodElem);
                rowElem.appendChild(periodElemWrapper);
            } else {
                const timeSlot = document.createElement('td');
                timeSlot.className = 'time-slot';
                timeSlot.setAttribute('contenteditable', 'true');
                timeSlot.addEventListener('click', () => {
                    this.lastClickedTimeSlot = timeSlot;
                });
                rowElem.appendChild(timeSlot);
            }
        }
        this.tbody.appendChild(rowElem);
        }

    // Remove the last row from the timetable
    removeRow() {
        // ... Remove the last row from the tbody element
        if (this.tbody.rows.length > 1) {
            this.tbody.deleteRow(-1);
        }
    }

    // Save the current timetable as an image
    saveTable() {
        // ... Convert the timetable to a canvas and save it as a .png image
        const filename = 'timetable.png';

        // Create a new canvas element and get its 2D rendering context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Get the bounding rectangle of the grid element
        const tableRect = this.gridElem.getBoundingClientRect();
        
        // Set the canvas dimensions based on the grid element's dimensions
        canvas.width = tableRect.width;
        canvas.height = tableRect.height;
        
        // Loop through each row and cell of the grid element
        Array.from(this.gridElem.querySelectorAll('tr')).forEach((row, rowIndex) => {
          Array.from(row.children).forEach((cell, cellIndex) => {
            // Get the bounding rectangle of the current cell
            const cellRect = cell.getBoundingClientRect();
            
            // Set the fill style based on the cell's background color
            const bgColor = getComputedStyle(cell).backgroundColor;
            ctx.fillStyle = bgColor === 'rgba(0, 0, 0, 0)' ? 'white' : bgColor;

            // Fill the cell with the fill style on the canvas
            ctx.fillRect(cellRect.x - tableRect.x, cellRect.y - tableRect.y, cellRect.width, cellRect.height);
            
            // Set the line width and stroke style for cell borders
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            // Draw the cell border on the canvas
            ctx.strokeRect(cellRect.x - tableRect.x, cellRect.y - tableRect.y, cellRect.width, cellRect.height);
            
            // Declare a variable to hold the text content of the cell
            let text;
            if (cellIndex === 0) {
                // If it's the first cell, get the value of the time input
                const input = cell.querySelector('input[type="time"]');
                text = input ? input.value : '';
            } else {
                // If it's not the first cell, get the text content of the cell
                text = cell.textContent;
            }

            // If there's any text content, draw it on the canvas
            if (text) {
                ctx.font = '14px Arial';
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(text, cellRect.x - tableRect.x + cellRect.width / 2, cellRect.y - tableRect.y + cellRect.height / 2);
            }
          });
        });

        // Create an anchor element to download the image
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        // Trigger the download by clicking the link
        link.click();
    }      
}
