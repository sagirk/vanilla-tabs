document.addEventListener('DOMContentLoaded', function () {
  /**
   * 1. Convert the three `<div>` tags (`days-of-the-week`, `date-picker`, `user-input`) into tabs.
   *    - Focus on functionality rather than appearance.
   */

  // Tabs
  var daysOfTheWeekTab = document.getElementById('days-of-the-week-tab');
  var datePickerTab = document.getElementById('date-picker-tab');
  var userInputTab = document.getElementById('user-input-tab');

  // Content for tabs
  var daysOfTheWeek = document.getElementById('days-of-the-week');
  var datePicker = document.getElementById('date-picker');
  var userInput = document.getElementById('user-input');

  // Containers
  var tabs = document.getElementById('tabs');
  var tabContent = document.getElementById('tab-content');

  // Make daysOfTheWeek the default tab
  if (!tabContent.innerHTML) {
    tabContent.innerHTML = daysOfTheWeek.outerHTML;
  }

  // Attach a handler for click events on tab — use event delegation for performance
  tabs.addEventListener('click', function (clickEvent) {
    if (clickEvent.target === daysOfTheWeekTab) {
      tabContent.innerHTML = daysOfTheWeek.outerHTML;
    } else if (clickEvent.target === datePickerTab) {
      tabContent.innerHTML = datePicker.outerHTML;
    } else if (clickEvent.target === userInputTab) {
      tabContent.innerHTML = userInput.outerHTML;
    }
  });

  var run = document.getElementById('run');
  var result = document.getElementById('result');

  /**
   * 2. Use JavaScript to fill in the correct day, month, and year values in the "Date picker" tab.
   */

  var today = new Date();
  var currentDay = today.getDate();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();

  // Fill in days
  var daySelect = document.getElementById('day');

  var listOfDays = Array.from({length: 31}, function(day, index) {
    return index + 1;
  });

  var dayOptions = listOfDays.map(function (day) {
    if (day === currentDay) {
      return '<option selected>' + day + '</option>';
    }
    return '<option>' + day + '</option>';
  }).join('\n');

  daySelect.innerHTML = dayOptions;

  // Fill in months
  var monthSelect = document.getElementById('month');

  var listOfMonths = Array.from({length: 12}, function(month, index) {
    return index + 1;
  });

  var monthOptions = listOfMonths.map(function (month) {
    if (month === currentMonth) {
      return '<option selected>' + month + '</option>';
    }
    return '<option>' + month + '</option>';
  }).join('\n');

  monthSelect.innerHTML = monthOptions;

  // Fill in years
  var yearSelect = document.getElementById('year');

  var pastYears = Array.from({length: 10}, function(year, index) {
    return currentYear - (index + 1);
  });

  var futureYears = Array.from({length: 10}, function(year, index) {
    return currentYear + (index + 1);
  });

  var listOfYears = pastYears.concat(currentYear, futureYears).sort();

  var yearOptions = listOfYears.map(function (year) {
    if (year === currentYear) {
      return '<option selected>' + year + '</option>';
    }
    return '<option>' + year + '</option>';
  }).join('\n');

  yearSelect.innerHTML = yearOptions;

  // Fill in hidden date field
  var dateInput = document.getElementById('date');
  dateInput.value = daySelect.value + '/' + monthSelect.value + '/' + yearSelect.value;

  /**
   * 3. When the "Run" button is pressed, the "Result" text box should be populated based on the currently selected tab:
   *    - Days of the week — a comma separated string of the currently checked days of the week. Use the three letter acronyms.
   *    - Date picker — entered date in the format `DD/MM/YYYY`
   *    - User input — simply equal to the user entered string.
   */

  var daysOfTheWeekSnapshot = Array.prototype.slice.apply(daysOfTheWeek.children);
  var checkedDays = daysOfTheWeekSnapshot.map(function (day) {
    if (day.checked) {
      return day.value;
    }
  }).filter(Boolean).join(', ');
  var selectedDate = dateInput.value;
  var userInputString = userInput.value;

  var run = document.getElementById('run');

  run.addEventListener('click', function (clickEvent) {
    clickEvent.preventDefault();

  });

  /**
   * 4. When user enters a string in the User input tab and Run is pressed, it should be parsed back to the appropriate tab.
   *    - For this task, you can assume that the user input is correct.
   *    - For example if the user types `MON, TUE`, the days of the week tab should be selected with Monday and Tuesday check boxes selected.
   */
});