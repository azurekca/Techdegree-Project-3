/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/

/* Form works without JavaScript - Progressive Enhancement

    The user should still have access to all form fields and payment information if JS isn't working for whatever reason. For example, when the JS is removed from the project:
        The “Other” text field under the "Job Role" section should be visible
        All information for Bitcoin, PayPal or Credit Card payments should be visible. */

const selectTitle = document.getElementById('title');
const otherJobRoleInput = document.getElementById('other-title');
const shirtDesignSelect = document.getElementById('design');
const activityCheckboxes = document.querySelectorAll('.activities input[type="checkbox"]');

document.addEventListener('DOMContentLoaded', () => {
	otherJobRoleInput.style.display = 'none';
	setShirtColorOptions();
	// if user reloads page, reset the color dropdown
	shirtDesignSelect.options[0].selected = true;
});

/* ”Job Role” section */
selectTitle.addEventListener('change', function() {
	// if other was selected, show other input field
	if (this.value === 'other') {
		otherJobRoleInput.style.display = '';
	} else {
		otherJobRoleInput.style.display = 'none';
	}
});

/* ”T-Shirt Info” section */
function setShirtColorOptions(design = 'none') {
	const shirtColors = document.getElementById('color');
	let selectedFlag = false;

	for (let i = 0; i < shirtColors.options.length; i++) {
		if (shirtColors.options[i].innerText.includes(design)) {
			shirtColors.options[i].hidden = false;
			if (!selectedFlag) {
				shirtColors.options[i].selected = true;
				selectedFlag = true;
			}
		} else {
			shirtColors.options[i].hidden = true;
			shirtColors.options[i].selected = false;
		}
	}
	if (design === 'none') {
		// if a design isn't selected, hide all the colors and the color dropdown
		// and change the label to tell the user to pick a design
		shirtColors.previousElementSibling.textContent = 'Please select a T-shirt theme';
		shirtColors.hidden = true;
	} else {
		// change the label for the color dropdown
		shirtColors.previousElementSibling.textContent = 'Color:';
		// show the color dropdown
		shirtColors.hidden = false;
		// set focus to the color dropdown
		shirtColors.focus();
	}
}

shirtDesignSelect.addEventListener('change', function() {
	switch (this.value) {
		case 'js puns':
			// display js pun shirt options
			setShirtColorOptions('Puns');
			// show color dropdown
			break;
		case 'heart js':
			setShirtColorOptions('I');
			break;
		default:
			setShirtColorOptions();
			break;
	}
});

/* ”Register for Activities” section

Some events are at the same day and time as others. If the user selects a workshop, don't allow selection of a workshop at the same day and time -- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.
As a user selects activities, a running total should display below the list of checkboxes. For example, if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300. */

// add event listener to all the checkboxes
for (let i = 0; i < activityCheckboxes.length; i++) {
	activityCheckboxes[i].addEventListener('change', () => {
    const checkedActivities = getCheckedActivities();
    // add checked class
    event.target.parentElement.classList.toggle('checked');
		// console.log(checkedActivities);
		disableConflictingActivities();
      // keep track of the running total
      // <span id="activities-total"></span>
      
	});
}

// get an array of the checked activities
function getCheckedActivities() {
	const checkedActivities = [];
	// loop through checked activities and return false if more than one activity has the same data-day-and-time
	for (let i = 0; i < activityCheckboxes.length; i++) {
		if (activityCheckboxes[i].checked) {
			checkedActivities.push(activityCheckboxes[i]);
		}
	}
	return checkedActivities;
}

function disableConflictingActivities() {
  // search through options and if there is a match toggle disabled
  const checkedDayAndTime = event.target.dataset.dayAndTime;
  const checkboxName = event.target.name;
  console.log(checkedDayAndTime, checkboxName);
  if (checkedDayAndTime) {
    // loop through all checkboxes to see if there is a match
    for (let i = 0; i < activityCheckboxes.length; i++) {
      if (checkboxName !== activityCheckboxes[i].name &&
          checkedDayAndTime === activityCheckboxes[i].dataset.dayAndTime) {
            activityCheckboxes[i].disabled = !(activityCheckboxes[i].disabled);
            activityCheckboxes[i].parentElement.classList.toggle('disabled');
      }
    }
  }
}
/* "Payment Info" section

    Display payment sections based on the payment option chosen in the select menu.
    The "Credit Card" payment option should be selected by default. Display the #credit-card div, and hide the "PayPal" and "Bitcoin" information. Payment option in the select menu should match the payment option displayed on the page.
    When a user selects the "PayPal" payment option, the PayPal information should display, and the credit card and “Bitcoin” information should be hidden.
    When a user selects the "Bitcoin" payment option, the Bitcoin information should display, and the credit card and “PayPal” information should be hidden.

NOTE: The user should not be able to select the "Select Payment Method" option from the payment select menu, because the user should not be able to submit the form without a chosen payment option. */

/* Form Validation

If any of the following validation errors exist, prevent the user from submitting the form:

    Name field can't be blank.
    Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example.
    User must select at least one checkbox under the "Register for Activities" section of the form.
    If the selected payment option is "Credit Card," make sure the user has supplied a Credit Card number, a Zip Code, and a 3 number CVV value before the form can be submitted.
        Credit Card field should only accept a number between 13 and 16 digits.
        The Zip Code field should accept a 5-digit number.
        The CVV should only accept a number that is exactly 3 digits long. 
        
  Make sure your validation is only validating Credit Card info if Credit Card is the selected payment method.*/

/* Form validation messages

    Provide some kind of indication when there’s a validation error. The field’s borders could turn red, for example, or even better for the user would be if a red text message appeared near the field.
    The following fields should have some obvious form of an error indication:
        Name field
        Email field
        Register for Activities checkboxes (at least one must be selected)
        Credit Card number (Only if Credit Card payment method is selected)
        Zip Code (Only if Credit Card payment method is selected)
        CVV (Only if Credit Card payment method is selected)

Note: Error messages or indications should not be visible by default. They should only show upon submission, or after some user interaction.

Note: If a user tries to submit an empty form, there should be an error indication or message displayed for the name field, the email field, the activity section, and the credit card fields if credit card is the selected payment method. */
