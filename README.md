# Weekly Timetable (Vanilla JS)

A weekly timetable planner built with plain JavaScript: no framework, no build
step. Built as a university web programming exercise in DOM manipulation,
ES classes, and dynamic module loading.

## Stack

- Vanilla JavaScript (ES modules, classes, dynamic `import()`)
- Bootstrap 5.3 (CSS only, via CDN)
- HTML Canvas for exporting the timetable as an image

## Features

- Monday–Sunday grid with a time picker for each row
- Editable cells: click one and type
- Colour-code cells by category (Break, Gym, Study, TV, Friends, Work)
- Add and remove rows
- Save the timetable as a PNG

## Getting started

The app uses ES modules, so it has to be served over HTTP. Opening
`index.html` directly from disk won't work. Any static server will do:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` and click **Calendar**.

## Project structure

```
├── index.html          # Page shell and app menu
├── main.js             # Loads the selected app with dynamic import()
├── style.css
└── app/
    ├── Application.js  # Base class shared by apps
    └── Calendar/       # The timetable app
```
