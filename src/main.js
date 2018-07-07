/**
 * Task: Convert the three `<div>` tags (`days-of-the-week`, `date-picker`,
 *       `user-input`) into tabs
 */

// Get all the tabs
const tabs = document.querySelectorAll('.tab');

// Collect panel `id`s (from the anchor hash) into a `targets` array
const targets = [];
tabs.forEach((tab) => {
  targets.push(tab.hash);
});

// Use the panel `id`s collected in `targets` to get a collection of panels
const panels = document.querySelectorAll(targets.join(','));

// Switch tabs based on URL hash
let activeTab = null;
const switchTabs = function switchTabsBasedOnURLHash() {
  let selectedTab = window.location.hash;

  // If no tab is selected, default to the first tab
  if (!selectedTab) {
    [selectedTab] = targets;
  }

  // If the selected tab is not in our list of valid targets, either default to
  // the first tab or keep the active tab, if one has been selected previously
  // This ensures that other elements firing `hashchange` don't break our tabs
  if (targets.indexOf(selectedTab) === -1) {
    if (!activeTab) {
      [selectedTab] = targets;
    } else {
      selectedTab = activeTab;
    }
  }

  // Add `active` class to the selected tab; remove it from the rest
  tabs.forEach((tab) => {
    if (tab.hash === selectedTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Show the panel corresponding to the selected tab; hide the rest
  panels.forEach((panel) => {
    if (`#${panel.id}` === selectedTab) {
      panel.style.display = '';
    } else {
      panel.style.display = 'none';
    }
  });

  // Cache the selected tab
  activeTab = selectedTab;
};

// Invoke the first run manually and then keep listening for subsequent changes
// to window.location.hash
const initializeTabs = function initializeTabsAndAttachHashchangeListener() {
  switchTabs();
  window.addEventListener('hashchange', switchTabs);
};

initializeTabs();


/**
 * Task: Use JavaScript to fill in the correct date, month, and year values in
 *       the "Date picker" tab
 *
 * Bonus: Check the current day value in the "Days of the week" tab and select
 *        the current date, month and year values in the "Date picker" tab as
 *        defaults
 */

// Get today's day, date, month and year values
// Note: day and month are 0-indexed
const today = new Date();
const currentDay = today.getDay();
const currentDate = today.getDate();
const currentMonth = today.getMonth() + 1;
const currentYear = today.getFullYear();

// Lowercase full forms of days (these are also, on purpose, the corresponding
// days' checkbox `id`s in the "Days of the week" tab)
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Check today's day in the "Days of the week" tab as default
const currentDayCheckbox = document.getElementById(days[currentDay]);
currentDayCheckbox.checked = true;

// Select today's values as defaults and generate functions to map date, month
// and year values to `<option>` tags
const setDefaultOption = function setDefaultOptionAndReturnOptionMapper(defaultValue) {
  return function valueToOption(value) {
    if (value === defaultValue) {
      return `<option selected>${value}</option>`;
    }
    return `<option>${value}</option>`;
  };
};
const dateToOption = setDefaultOption(currentDate);
const monthToOption = setDefaultOption(currentMonth);
const yearToOption = setDefaultOption(currentYear);

// Fill in dates
const dateSelect = document.getElementById('date');
const listOfDates = Array.from({ length: 31 }, (value, index) => index + 1);
const dateOptions = listOfDates.map(dateToOption).join('');
dateSelect.innerHTML = dateOptions;

// Fill in months
const monthSelect = document.getElementById('month');
const listOfMonths = Array.from({ length: 12 }, (value, index) => index + 1);
const monthOptions = listOfMonths.map(monthToOption).join('');
monthSelect.innerHTML = monthOptions;

// Fill in years
const yearSelect = document.getElementById('year');
const pastYears = Array.from({ length: 10 }, (value, index) => currentYear - (index + 1));
const futureYears = Array.from({ length: 10 }, (value, index) => currentYear + (index + 1));
const listOfYears = [...pastYears, currentYear, ...futureYears].sort();
const yearOptions = listOfYears.map(yearToOption).join('');
yearSelect.innerHTML = yearOptions;


/**
 * Task: When user enters a string in the "User input" tab and "Run" is pressed,
 *       it should be parsed back to the appropriate tab.
 *       - For this task, you can assume that the user input is correct.
 *       - For example if the user types `MON, TUE`, the days of the week tab
 *         should be selected with Monday and Tuesday check boxes selected.
 */

// Constants for tab `id`s
const DAYS_OF_THE_WEEK = '#days-of-the-week';
const DATE_PICKER = '#date-picker';
const USER_INPUT = '#user-input';

// Callback for `Array.filter()` that returns false for falsy day values
const isValid = day => !!day;

const parseDays = function parseDays(input) {
  // Match a case-insensitive three letter acronym of a day and remember it
  // e.g., SUN or MON, TUE, WED or THU,FRI, SAT
  const dayFormat = /([A-Z]{3})/gi;
  const parsedDays = [];
  let dayMatch;

  // Find successive matches and collect into parsedDays, until none left
  do {
    dayMatch = dayFormat.exec(input);
    if (dayMatch) {
      parsedDays.push(dayMatch[1].toUpperCase());
    }
  } while (dayMatch);

  // Map user provided day acronyms to their lowercase full forms
  const daysAcronyms = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const acronymtoFullform = function daysAcronymtoLowercaseFullform(userProvidedDay) {
    const userProvidedDayIndex = daysAcronyms.indexOf(userProvidedDay);
    return days[userProvidedDayIndex];
  };
  const userProvidedDays = parsedDays.map(acronymtoFullform).filter(isValid);

  // Return parsed days only if at least one valid day was provided
  if (userProvidedDays.length > 0) {
    return userProvidedDays;
  }

  return false;
};

const checkDays = function checkDays(userProvidedDays) {
  // Check user provided days in the "Days of the week" tab; uncheck the rest
  days.forEach((day) => {
    if (userProvidedDays.indexOf(day) !== -1) {
      document.getElementById(day).checked = true;
    } else {
      document.getElementById(day).checked = false;
    }
  });
};

const parseDate = function parseDate(input) {
  // Match date with format DD/MM/YYYY and remember DD, MM and YYYY
  // e.g., 6/7/2018 or 31/12/2018
  const dateFormat = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  const parsedDate = dateFormat.exec(input);

  if (parsedDate) {
    const [, date, month, year] = parsedDate;

    const userProvidedDate = Number(date);
    const isDateValid = userProvidedDate >= 1 && userProvidedDate <= 31;

    const userProvidedMonth = Number(month);
    const isMonthValid = userProvidedMonth >= 1 && userProvidedMonth <= 12;

    const userProvidedYear = Number(year);
    const maxYearIndex = listOfYears.length - 1;
    const isYearValid = userProvidedYear >= listOfYears[0] && userProvidedYear <= listOfYears[maxYearIndex];

    // Return parsed date, month, year only if all the three of them are valid
    if (isDateValid && isMonthValid && isYearValid) {
      return { userProvidedDate, userProvidedMonth, userProvidedYear };
    }
  }

  return false;
};

const selectDate = function selectDate({ userProvidedDate, userProvidedMonth, userProvidedYear }) {
  // Select user provided date; unselect the rest
  const userProvidedDateIndex = userProvidedDate - 1;
  const dates = dateSelect.childNodes;
  dates.forEach((date, index) => {
    if (index === userProvidedDateIndex) {
      date.selected = true;
    } else {
      date.selected = false;
    }
  });

  // Select user provided month; unselect the rest
  const userProvidedMonthIndex = userProvidedMonth - 1;
  const months = monthSelect.childNodes;
  months.forEach((month, index) => {
    if (index === userProvidedMonthIndex) {
      month.selected = true;
    } else {
      month.selected = false;
    }
  });

  // Select user provided year; unselect the rest
  const userProvidedYearIndex = listOfYears.indexOf(userProvidedYear);
  const years = yearSelect.childNodes;
  years.forEach((year, index) => {
    if (index === userProvidedYearIndex) {
      year.selected = true;
    } else {
      year.selected = false;
    }
  });
};

const switchTab = function switchTab(selectedTab) {
  // Set the current `location.hash` to selectedTab, thereby triggering a
  // `hashchange` event which will be picked up by its listener callback
  // `switchTabs()`
  window.location.hash = selectedTab;
};

const parseUserInput = function parseDaysAndDateFromUserInput(input) {
  // Parse day(s) and date
  const parsedDays = parseDays(input);
  const parsedDate = parseDate(input);

  // If valid day(s) found, check them in the "Days of the week" tab and switch
  // to the aforementioned tab
  // If valid date, month and year values found, select them in the
  // "Date picker" tab and switch to the aforementioned tab
  //
  // Note: If input has both valid day(s) and date, select specified values in
  // the "Days of the week" and the "Date picker" tabs both and switch to
  // "Date picker" tab. This is accomplished by triggering a switch to the
  // "Date picker" tab last
  if (parsedDays) {
    checkDays(parsedDays);
    switchTab(DAYS_OF_THE_WEEK);
  }

  if (parsedDate) {
    selectDate(parsedDate);
    switchTab(DATE_PICKER);
  }
};


/**
 * Task: When the "Run" button is pressed, the "Result" text box should be
 *       populated based on the currently selected tab:
 *       - Days of the week — a comma separated string of the currently checked
 *         days of the week. Use the three letter acronyms.
 *       - Date picker — entered date in the format `DD/MM/YYYY`
 *       - User input — simply equal to the user entered string.
 */

// Get the checkboxes for all days
const dayCheckboxes = document.getElementsByClassName('check-day');

// Get the user input box, the result output box and the run button
const userInput = document.getElementById('input');
const readonlyResult = document.getElementById('result');
const runButton = document.getElementById('run');

const displayResult = function displayResultBasedOnActiveTab() {
  // If the "Days of the week" tab is active, display a comma separated string
  // of the currently checked days of the week, using the three letter acronyms.
  if (activeTab === DAYS_OF_THE_WEEK) {
    const daysOfTheWeek = [...dayCheckboxes];
    const checkedDays = daysOfTheWeek
      .map((day) => {
        if (day.checked) {
          return day.value;
        }
        return false;
      })
      .filter(isValid)
      .join(', ');
    readonlyResult.value = checkedDays;

  // If the "Date picker" tab is active, display entered date in the format
  // `DD/MM/YYYY`
  } else if (activeTab === DATE_PICKER) {
    const selectedDate = `${dateSelect.value}/${monthSelect.value}/${yearSelect.value}`;
    readonlyResult.value = selectedDate;

  // If the "User input" tab is active, simply display the user entered string
  // and parse it back to the appropriate tab
  } else if (activeTab === USER_INPUT) {
    const userProvidedInput = userInput.value;
    readonlyResult.value = userProvidedInput;
    parseUserInput(userProvidedInput);
  }
};

// When the "Run" button is clicked, populate the result output box based on the
// active tab
runButton.addEventListener('click', displayResult);
