# Vanilla Tabs
<p align="center">
  <a href="https://sagirk.github.io/vanilla-tabs">
    <img src="./assets/vanilla-tabs-logo.png" alt="Vanilla Tabs logo" width="192" height="192">
  </a>

  <h3 align="center">Vanilla Tabs</h3>

  <p align="center">
    A zero-dependency, vanilla JavaScript, URI fragment-driven tabbing system
    <br>
    <a href="https://sagirk.github.io/vanilla-tabs/src/index.html"><strong>Play with Vanilla Tabs demo »</strong></a>
    <br>
    <br>
    <a href="https://sagirk.github.io/vanilla-tabs">Explore Vanilla Tabs docs</a>
    ·
    <a href="https://github.com/sagirk/vanilla-tabs/issues/new">Report bug</a>
    ·
    <a href="https://github.com/sagirk/vanilla-tabs/issues/new">Request feature</a>
  </p>
</p>

<br>

## Table of contents
- [Vanilla Tabs](#vanilla-tabs)
  - [Table of contents](#table-of-contents)
  - [Demo](#demo)
    - [How to use](#how-to-use)
    - [Edge cases](#edge-cases)
  - [Tabbing system](#tabbing-system)
    - [Features](#features)
    - [Nice-to-haves](#nice-to-haves)
    - [Design choices and tradeoffs](#design-choices-and-tradeoffs)
  - [Code style](#code-style)
    - [Folder structure](#folder-structure)
    - [Style guides, linters and configs](#style-guides-linters-and-configs)
    - [Convenience npm scripts for linting](#convenience-npm-scripts-for-linting)
    - [Editor preferences](#editor-preferences)
  - [Requirements](#requirements)
  - [License](#license)

## Demo
Check out the [live demo][]

### How to use
1. Press on any of the three tabs ("Days of the week", "Date picker", "User input") to view its content
    - Days of the week — today's day is checked by default
    - Date picker — today's date, month, and year are selected by default
    - User input — an inviting empty text box with no default text
    - Note: In the "Date picker" tab, the date, month, and year options are initialised via JavaScript

2. Press the "Run" button to populate the "Result" text box based on the currently selected tab
    - Days of the week — a comma separated string of the currently checked days of the week, each represented by three letter acronyms consisting of the first three letters of the day's name
    - Date picker — entered date in the format `DD/MM/YYYY`
    - User input — simply equal to the user entered string

3. Enter a string in the "User input" tab and press "Run" to parse back to the appropriate tab
    - The input string can be either of:
      1. A comma separated string of three letter acronyms of days of the week
          - For example, on typing `MON, TUE` and pressing "Run", the "Days of the week" tab will be selected with Monday and Tuesday check boxes selected
      2. A valid date in the format `DD/MM/YYYY`
          - For example, on typing `15/1/2019` and pressing "Run", the "Date picker" tab will be selected with 15 in Date, 1 in Month and 2019 in Year selected
    - The three letter acronyms of days of the week are not case-sensitive and a space after the comma is optional (e.g., `Mon,tUe, weD, THu,fRI` is valid, but `ABC, def` is not)
    - The valid range for values in DD is 1-31, MM is 1-12 and YYYY is 2008-2028 (as long as the current year is 2018, otherwise current year +10/-10) and the only supported separator is `/` (e.g., `15/1/2019` is valid, but `32-13-2029` is not)
    - In case multiple dates are specified, only the first date will be parsed and the remaining dates will be ignored
    - In case day(s) and dates are specified together, the order of days and dates doesn't matter

### Edge cases
Known edge cases when parsing a string from the "User input" tab and how they are handled:
1. Invalid day(s)
    - There will be no change to values in the "Days of the week" tab. The "User input" tab will remain active with the input simply shown in the "Result" text box
    - e.g., `WDE, TUH, FIR`

2. Invalid first date
    - Since only the first date is parsed, there will be no change to values in the "Date picker" tab. The "User input" tab will remain active with the input simply shown in the "Result" text box
    - e.g., `32/1/2010 15/1/2019`

3. Valid day(s) and invalid date
    - The "Days of the week" tab will be selected with the valid day(s) selected. There will be no change to values in the "Date picker" tab
    - e.g., `32/1/2019 SAT, SNU`

4. Invalid day(s) and valid date
    - The "Date picker" tab will be selected with the specified date, month and year values selected. There will be no change to values in the "Days of the week" tab
    - e.g., `MNO, TEU 15/1/2019`

5. Valid day(s) and valid date
    - The "Date picker" tab will be selected but the specified values will be populated in the "Date picker" and the "Days of the week" tabs both
    - e.g., `MON, TUE 15/1/2019`

## Tabbing system

### Features
- Supports right-click and shift-click (and doesn’t select in these cases)
- Loads the correct panel if you start with a hash
- Supports native browser navigation (using back/forward buttons)
- Supports the keyboard
- Since tabs are clickable, the user can open in a new tab/window and the page correctly loads with the correct tab open
- Passes [@remy][]'s _shitmus_ test

  > **The shitmus test**
  >
  > Like a litmus test, here’s a couple of quick ways you can tell if a tabbing system is poorly implemented:
  >
  > • Change tab, then use the Back button (or keyboard shortcut) and it breaks
  > • The tab isn’t a link, so you can’t open it in a new tab
  >
  > These two basic things are, to me, the bare minimum that a tabbing system should have.
  >
  > — [Remy Sharp][] in [How Tabs Should Work][]

### Nice-to-haves
1. Add missing ARIA roles and accessibility
    - Note: this is mandatory (not just a nice-to-have) in certain use-cases. Thankfully, it is quite cheap to add, in fact. The only reason I skipped it here is because I was aiming for a barebones PoC. Do not, I repeat, do not skip this in an app built for production.
    - Add `aria-role` set to `tab` for the tabs, and `tabpanel` for the panels
    - Set `aria-controls` on the tabs to point to their related panel (by `id`)
    - Add `tabindex=0` to all the tab elements
    - When adding `.selected` class to the tab, also set `aria-selected=true` and, inversely, when removing `.selected` class, set `aria-selected=false`
    - When hiding the panels, add `aria-hidden=true`, and when showing a specific panel, set `aria-hidden=false` on it

1. No annoying page jumps
    - Note: this isn't an issue you'll run into in our app currently, since there is no content below the fold yet
    - On long pages with content below the fold, an annoying problem is that the page jumps when a tab is selected. That’s due to the browser following the default behaviour of an internal link on the page
    - Solution (albeit a bit hacky): hook a `click` handler on the tab and strip the `id` attribute off the target panel when the user tries to navigate to it, and then put it back on once `switchTabs()` starts to run. This change will mean the browser has nowhere to navigate to for that moment, and won’t jump the page

### Design choices and tradeoffs
1. No support for nested tabs
    - With URI fragment, multiple hashes don’t work, and comma-separated hash fragments don’t make any sense to control multiple tabs (since they don't actually link to anything).
    - Thoughts: explore query strings or full URL updates for a more robust URL-driven tabbing system

1. Other components that depend on the URI fragment may not play nice
    - By exclusively using the browser URL and the `hashchange` event on the window to drive the tabbing system, we get Back button support and a bunch of other features for free. But this also gives rise to the possibility of our tabs and other components that store their state in the URI fragment breaking each other
    - Thoughts: use the URL only for routing between components/pages, and move other state into a separate store elsewhere (a simple POJO, localStorage, etc.)

1. Limited browser support
    - In older browsers, `NodeList` isn't iterable and `NodeList.forEach()` isn't available. However, it is easily polyfill-able by putting a [simple forEach implementation][] on `NodeList.prototype`
      ```javascript
      if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function forEach(array, callback, optionalThis) {
          // ...
          // forEach body from the above linked implementation
          // ...
        };
      }
      ```
    - ES6 syntax isn't supported in old browsers
    - Thoughts: Include polyfills for missing features in old browsers and use Babel to transpile ES6 down to ES5

## Code style

### Folder structure
```
.
├── assets           # Static assets
├── src              # Source files
│   ├── index.html
│   ├── main.js
│   └── screen.css
└── README.md
```

### Style guides, linters and configs
The project follows the coding conventions laid out in the style guides below. It uses the corresponding configs for linters to catch errors automatically

| #.  | Language   | Style Guide                       | Linter           | Linter Config                                                       |
| --- | ---------- | --------------------------------- | ---------------- | ------------------------------------------------------------------- |
| 1.  | JavaScript | [Airbnb JavaScript Style Guide][] | [ESLint][]       | [eslint-config-airbnb-base][]                                       |
| 2.  | CSS        | [CSS Code Guide][] by [@mdo][]    | [Stylelint][]    | [stylelint-config-standard][] + [.stylelintrc][] from [Bootstrap][] |
| 3.  | HTML       | [HTML Code Guide][] by [@mdo][]   | [HTMLLint][]     | [.htmllintrc][] from [Bootstrap][]                                  |
| 4.  | Markdown   | [Markdownlint Rules][]            | [Markdownlint][] | [.markdownlint.json][] from [Airbnb JavaScript Style Guide][]       |

### Convenience npm scripts for linting
1. IMPORTANT! Do this first.
    - `npm install`: install the above listed linters and configs

2. Then run the below scripts as needed
    - `npm run lint`: lint JavaScript, CSS, HTML and Markdown files and show the output in the terminal
    - `npm run lint-js`: lint JavaScript files only
    - `npm run lint-css`: lint CSS files only
    - `npm run lint-html`: lint HTML files only
    - `npm run lint-md`: lint Markdown files only

### Editor preferences
Set editor to the following settings to avoid common code inconsistencies and dirty diffs:
- Use soft-tabs set to two spaces
- Trim trailing white space on save
- Set encoding to UTF-8
- Add new line at end of files

These preferences are documented and applied to the project's [.editorconfig][] file.

## Requirements
A modern browser

Tested with:
- Chrome
- Firefox
- Edge

## License
The MIT License (MIT)
Copyright © 2018 [Sagir Khan][]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- Links -->
[live demo]: https://sagirk.github.io/vanilla-tabs/src/index.html

[@remy]: https://github.com/remy
[remy sharp]: https://twitter.com/rem
[how tabs should work]: https://24ways.org/2015/how-tabs-should-work/

[simple foreach implementation]: https://github.com/sagirk/simpleTest/blob/master/example/forEach.html#L34-L46

[airbnb javascript style guide]: https://github.com/airbnb/javascript
[eslint]: https://github.com/eslint/eslint
[eslint-config-airbnb-base]: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base

[@mdo]: https://github.com/mdo
[bootstrap]: https://github.com/twbs/bootstrap

[css code guide]: http://codeguide.co/#css
[stylelint]: https://github.com/stylelint/stylelint
[stylelint-config-standard]: https://github.com/stylelint/stylelint-config-standard
[.stylelintrc]: https://github.com/twbs/bootstrap/blob/v4-dev/.stylelintrc

[html code guide]: http://codeguide.co/#html
[htmllint]: https://github.com/htmllint/htmllint-cli
[.htmllintrc]: https://github.com/twbs/bootstrap/blob/v4-dev/build/.htmllintrc

[markdownlint rules]: https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md
[markdownlint]: https://github.com/igorshubovych/markdownlint-cli
[.markdownlint.json]: https://github.com/airbnb/javascript/blob/master/linters/.markdownlint.json

[.editorconfig]: .editorconfig

[sagir khan]: https://sagirk.com