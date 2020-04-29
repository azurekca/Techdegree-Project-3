/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/

/* Form works without JavaScript - Progressive Enhancement

    The user should still have access to all form fields and payment information if JS isn't working for whatever reason. For example, when the JS is removed from the project:
        The “Other” text field under the "Job Role" section should be visible
        All information for Bitcoin, PayPal or Credit Card payments should be visible. */

let isValid = false;

const form = document.querySelector('form');
const userNameInput = document.getElementById('name');
const userEmailInput = document.getElementById('mail');
const userTitleSelect = document.getElementById('title');
const otherJobRoleInput = document.getElementById('other-title');
const shirtDesignSelect = document.getElementById('design');
const activityCheckboxes = document.querySelectorAll('.activities input[type="checkbox"]');
const paymentSelect = document.getElementById('payment');
const totalSpan = document.createElement('span');
totalSpan.classList.add('total');
document.querySelector('.activities').appendChild(totalSpan);

document.addEventListener('DOMContentLoaded', () => {
	otherJobRoleInput.style.display = 'none';
	setShirtColorOptions();
	// if user reloads page, reset the color dropdown
	shirtDesignSelect.options[0].selected = true;
	// hide span that displays the total
	totalSpan.classList.add('hide');
	// select credit card payment method as default
	paymentSelect.options[1].selected = true;
	// disable 'select payment method' option
	paymentSelect.options[0].disabled = true;
	// show credit card payment section and hide the rest
	displayPayment('credit-card');
});

/* ”Job Role” section */
userTitleSelect.addEventListener('change', function() {
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

/* ”Register for Activities” section */

// add event listener to all the checkboxes
for (let i = 0; i < activityCheckboxes.length; i++) {
	activityCheckboxes[i].addEventListener('change', () => {
		// add checked class
		event.target.parentElement.classList.toggle('checked');
		disableConflictingActivities();
		//update the total cost when user checks/unchecks activities
		const cost = totalCost();
		// update form to display total cost
		if (cost > 0) {
			totalSpan.textContent = `Your total cost: $${cost}`;
			totalSpan.classList.remove('hide');
		} else {
			// if no activities selected, hide the displayed total
			totalSpan.textContent = '';
			totalSpan.classList.add('hide');
		}
	});
}

function disableConflictingActivities() {
	// search through options and if there is a match to the checkbox that was just changed, toggle disabled
	const checkedDayAndTime = event.target.dataset.dayAndTime;
	const checkboxName = event.target.name;
	if (checkedDayAndTime) {
		// loop through all checkboxes to see if there is a match
		for (let i = 0; i < activityCheckboxes.length; i++) {
			if (
				checkboxName !== activityCheckboxes[i].name &&
				checkedDayAndTime === activityCheckboxes[i].dataset.dayAndTime
			) {
				activityCheckboxes[i].disabled = !activityCheckboxes[i].disabled;
				activityCheckboxes[i].parentElement.classList.toggle('disabled');
			}
		}
	}
}

function totalCost() {
	let total = 0;
	// loop over checked activites and sum up the total
	for (let i = 0; i < activityCheckboxes.length; i++) {
		if (activityCheckboxes[i].checked) {
			total += +activityCheckboxes[i].dataset.cost;
		}
	}
	return total;
}

/* "Payment Info" section */

paymentSelect.addEventListener('change', () => {
	const selected = paymentSelect.value.replace(' ', '-');
	displayPayment(selected);
});

function displayPayment(paymentOption) {
	for (let i = 1; i < paymentSelect.options.length; i++) {
		const option = paymentSelect.options[i].value.replace(' ', '-');
		document.getElementById(option).style.display = 'none';
		document.getElementById(option).classList.add('hide');
	}
	document.getElementById(paymentOption).style.display = '';
	document.getElementById(paymentOption).classList.remove('hide');
}
/* Form Validation

If any of the following validation errors exist, prevent the user from submitting the form:

    - Name field can't be blank.
    - Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example. \w+@\w+\.\w
    - User must select at least one checkbox under the "Register for Activities" section of the form.
    - If the selected payment option is "Credit Card," make sure the user has supplied a Credit Card number, a Zip Code, and a 3 number CVV value before the form can be submitted.
        - Credit Card field should only accept a number between 13 and 16 digits.
        - The Zip Code field should accept a 5-digit number.
        - The CVV should only accept a number that is exactly 3 digits long. 
        
  Make sure your validation is only validating Credit Card info if Credit Card is the selected payment method.*/
function isNameValid() {
	return userNameInput.value.length > 0;
}

function isActivityChecked() {
	for (let i = 0; i < activityCheckboxes.length; i++) {
		if (activityCheckboxes[i].checked) {
			return true;
		}
	}
}

function isEmailValid(email) {
	return /^[^@]+@[^@]+\.[a-z]+$/i.test(email);
}

function isCreditCardValid(cc) {
	// Credit card is between 13 and 16 digits
	return /^\d{13, 16}$/.test(cc);
}

function isMailingCodeValid(code) {
	// Zip Code is 5-digits
	// or Postal Code is letter/number/letter[optional space]number/letter/number
	return /(^\d{5}$|^[a-z]\d[a-z] ?\d[a-z]\d$)/i.test(code);
}
function isCVVvalid(cvv) {
	// CVV is 3 digits
	return /^\d{3}$/.test(cvv);
}

form.addEventListener('submit', () => {
	if (!isValid) event.preventDefault();
});

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
