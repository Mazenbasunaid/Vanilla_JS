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
    buttonGroupElem; // The toolbar containing the color and action buttons
    selectedColor = null; // The currently selected color for time slots
    lastClickedTimeSlot = null; // The last clicked time slot element

    // Constructor for the Calendar class
    constructor(options) {
        super(options); // Call the parent (Application) class constructor
        this.initTimetable(); // Initialize the timetable
    }

    // Initialize the timetable
    initTimetable() {
        // Create the toolbar and the table, then add them to the page in that order
        this.initButtons();

        const containerElem = document.createElement('div');
        containerElem.className = 'timetable-container';
        this.gridElem = document.createElement('table');
        this.gridElem.className = 'table timetable';
        this.initTimeSlots();
        containerElem.appendChild(this.gridElem);

        this.target.appendChild(this.buttonGroupElem);
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
            headerElem.scope = 'col';
            // Set the header cell's text content based on the current day
            headerElem.textContent = day === 0 ? "Time" : Calendar.days[day - 1];
            if (day === 0) {
                headerElem.className = 'time-col';
            }
            // Add the header cell to the header row
            headerRow.appendChild(headerElem);
        }

        // Add the header row to the table head and table head to the grid element
        thead.appendChild(headerRow);
        this.gridElem.appendChild(thead);

        // Create table body
        this.tbody = document.createElement('tbody');

        // Create one table row for each period
        for (let period = 1; period <= Calendar.periods; period++) {
            this.tbody.appendChild(this.createRow());
        }

        // Add the table body to the grid element
        this.gridElem.appendChild(this.tbody);
    }

    // Create one table row: a time input followed by one editable time slot per day
    createRow() {
        const rowElem = document.createElement('tr');

        // Loop through days and create a cell for each day
        for (let day = 0; day < Calendar.days.length + 1; day++) {
            const cellElem = document.createElement('td');
            if (day === 0) {
                // If it's the first cell, create a time input for the period
                const periodElem = document.createElement('input');
                periodElem.type = 'time';
                periodElem.className = 'form-control form-control-sm';
                periodElem.setAttribute('aria-label', 'Start time');
                cellElem.appendChild(periodElem);
            } else {
                // If it's not the first cell, make it an editable time slot
                cellElem.className = 'time-slot';
                cellElem.setAttribute('contenteditable', 'true');
                // Add a click event listener to update (and highlight) the last clicked time slot
                cellElem.addEventListener('click', () => {
                    this.lastClickedTimeSlot?.classList.remove('active');
                    this.lastClickedTimeSlot = cellElem;
                    cellElem.classList.add('active');
                });
            }
            rowElem.appendChild(cellElem);
        }

        return rowElem;
    }

    // Initialize the buttons for the timetable
    initButtons() {
        // Create the toolbar container
        const buttonGroupElem = document.createElement('div');
        buttonGroupElem.className = 'timetable-toolbar';

        // Color buttons are grouped together, action buttons get their own group
        const colorGroupElem = document.createElement('div');
        colorGroupElem.className = 'btn-group';
        const actionGroupElem = document.createElement('div');
        actionGroupElem.className = 'btn-group';

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
            // Add the button to the color group
            colorGroupElem.appendChild(buttonElem);
        });

        // Create the "Save", "Add Row" and "Remove Row" buttons
        const actions = [
            { label: 'Save', className: 'btn btn-outline-secondary', handler: () => this.saveTable() },
            { label: 'Add Row', className: 'btn btn-outline-primary', handler: () => this.addRow() },
            { label: 'Remove Row', className: 'btn btn-outline-danger', handler: () => this.removeRow() }
        ];

        actions.forEach(action => {
            const buttonElem = document.createElement('button');
            buttonElem.className = action.className;
            buttonElem.type = 'button';
            buttonElem.textContent = action.label;
            buttonElem.addEventListener('click', action.handler);
            actionGroupElem.appendChild(buttonElem);
        });

        buttonGroupElem.appendChild(colorGroupElem);
        buttonGroupElem.appendChild(actionGroupElem);

        // Set the toolbar as a property of the class
        this.buttonGroupElem = buttonGroupElem;
    }

    // Add a new row to the timetable
    addRow() {
        this.tbody.appendChild(this.createRow());
    }

    // Remove the last row from the timetable
    removeRow() {
        // Always keep at least one row
        if (this.tbody.rows.length > 1) {
            const lastRow = this.tbody.rows[this.tbody.rows.length - 1];
            if (lastRow.contains(this.lastClickedTimeSlot)) {
                this.lastClickedTimeSlot = null;
            }
            this.tbody.deleteRow(-1);
        }
    }

    // Save the current timetable as an image
    saveTable() {
        // Convert the timetable to a canvas and save it as a .png image
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
        Array.from(this.gridElem.querySelectorAll('tr')).forEach((row) => {
            Array.from(row.children).forEach((cell, cellIndex) => {
                // Get the bounding rectangle of the current cell
                const cellRect = cell.getBoundingClientRect();
                const x = cellRect.x - tableRect.x;
                const y = cellRect.y - tableRect.y;

                // Set the fill style based on the cell's background color
                const bgColor = getComputedStyle(cell).backgroundColor;
                ctx.fillStyle = bgColor === 'rgba(0, 0, 0, 0)' ? 'white' : bgColor;

                // Fill the cell with the fill style on the canvas
                ctx.fillRect(x, y, cellRect.width, cellRect.height);

                // Draw the cell border on the canvas
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x, y, cellRect.width, cellRect.height);

                // Get the text of the cell: the time input's value for the first column, otherwise the typed text
                let text;
                const input = cell.querySelector('input[type="time"]');
                if (cellIndex === 0 && input) {
                    text = input.value;
                } else {
                    text = cell.textContent;
                }

                // If there's any text content, draw it on the canvas
                if (text) {
                    ctx.font = '14px Arial';
                    ctx.fillStyle = 'black';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';
                    ctx.fillText(text, x + cellRect.width / 2, y + cellRect.height / 2, cellRect.width - 8);
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
