/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/

// Global variables for form elements
const form = document.querySelector('form');
// Basic info elements
const userNameInput = document.getElementById('name');
const userEmailInput = document.getElementById('mail');
const userTitleSelect = document.getElementById('title');
const otherJobRoleInput = document.getElementById('other-title');
// T-shirt info Elements
const shirtDesignSelect = document.getElementById('design');
// Activity elements
const activityCheckboxes = document.querySelectorAll('.activities input[type="checkbox"]');
// create span at bottom of activity checklist to show messages
const activitySpan = document.createElement('span');
activitySpan.classList.add('total');
document.querySelector('.activities').appendChild(activitySpan);
// Payment elements
const paymentSelect = document.getElementById('payment');
const ccNumInput = document.getElementById('cc-num');
const zipInput = document.getElementById('zip');
const cvvInput = document.getElementById('cvv');

function init() {
	otherJobRoleInput.style.display = 'none';
	setShirtColorOptions();
	// hide span that displays the total
	activitySpan.classList.add('hide');
	// select credit card payment method as default
	paymentSelect.options[1].selected = true;
	// disable 'select payment method' option
	paymentSelect.options[0].disabled = true;
	// show credit card payment section and hide the rest
	displayPayment('credit-card');
}

init();

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
			activitySpan.textContent = `Your total cost: $${cost}`;
			activitySpan.classList = 'total';
		} else {
			// if no activities selected, hide the displayed total
			activitySpan.textContent = '';
			activitySpan.classList.add('hide');
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

   
   
    - If the selected payment option is "Credit Card," make sure the user has supplied a Credit Card number, a Zip Code, and a 3 number CVV value before the form can be submitted.
        - Credit Card field should only accept a number between 13 and 16 digits.
        - The Zip Code field should accept a 5-digit number.
        - The CVV should only accept a number that is exactly 3 digits long. 
        
	Make sure your validation is only validating Credit Card info if Credit Card is the selected payment method.*/

// function inputValidationTest(element, message) {
// 	if (!element.value.length > 0) {
// 		element.classList.add('invalid');
// 		element.placeholder = message;
// 		return true;
// 	} else {
// 		element.classList.remove('invalid');
// 		element.placeholder = '';
// 		return false;
// 	}
// }

function activityChecked() {
	for (let i = 0; i < activityCheckboxes.length; i++) {
		if (activityCheckboxes[i].checked) {
			return true;
		}
	}
	// show error message
	activitySpan.textContent = 'Please select at least one activity';
	activitySpan.classList.add('invalid');
	activitySpan.classList.remove('hide');
}

const validators = {
	name        : {
		regex         : /^[a-z]+$/i,
		badPatternTip : 'Name can only contain letters',
		emptyTip      : 'Please enter your name'
	},
	email       : {
		regex         : /^[^@]+@[^@]+\.[a-z]+$/i,
		badPatternTip : 'Please enter a valid email: "person@sample.com"',
		emptyTip      : 'Please enter your email'
	},
	creditCard  : {
		regex         : /^(\d{4} ?){3}\d{1,4}$/,
		badPatternTip : 'A valid credit card number is between 13 and 16 digits',
		emptyTip      : 'Please enter your credit card information'
	},
	mailingCode : {
		regex         : /(^\d{5}$|^[a-z]\d[a-z] ?\d[a-z]\d$)/i,
		badPatternTip : 'Please a Zip code: 5-digits or Postal Code: "A0A 0A0"'
	},
	cvv         : {
		regex         : /^\d{3}$/,
		badPatternTip : 'Please enter the 3-digit CVV that can be found on the back of your card'
	}
};

// code modified from Treehouse Regex Course
function createListener(validator) {
	return event => {
		const targetElem = event.target;
		const text = targetElem.value;
		const label = targetElem.previousElementSibling;
		const showEmptyTip = !text;
		const showBadPatternTip = !validator.regex.test(text);
		const emptyTip = validator.emptyTip;
		const badPatternTip = validator.badPatternTip;
		if (showEmptyTip) {
			if (emptyTip) targetElem.placeholder = emptyTip;
			targetElem.classList.add('invalid');
		} else if (showBadPatternTip) {
			if (badPatternTip) label.setAttribute('data-tip', badPatternTip);
			targetElem.classList.add('invalid');
			label.classList.add('invalid');
		} else {
			label.setAttribute('data-tip', '');
			targetElem.placeholder = '';
			targetElem.classList.remove('invalid');
			label.classList.remove('invalid');
		}
	};
}

userNameInput.addEventListener('input', createListener(validators.name));
userEmailInput.addEventListener('input', createListener(validators.email));
ccNumInput.addEventListener('input', createListener(validators.creditCard));
zipInput.addEventListener('input', createListener(validators.mailingCode));
cvvInput.addEventListener('input', createListener(validators.cvv));

function checkIfInvalid(elem) {
	return elem.classList.contains('invalid');
}

form.addEventListener('submit', () => {
	let isValid = true;
	let scrollTo;

	const inputs = document.getElementsByTagName('input');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].dispatchEvent(new Event('input'));
	}
	// manually trigger all the input events
	// userNameInput.dispatchEvent(new Event('input'));
	// userEmailInput.dispatchEvent(new Event('input'));
	// ccNumInput.dispatchEvent(new Event('input'));
	// zipInput.dispatchEvent(new Event('input'));
	// cvvInput.dispatchEvent(new Event('input'));

	// if credit card selected validate credit card fields
	if (paymentSelect.value === 'credit card') {
		if (checkIfInvalid(ccNumInput)) isValid = false;
		if (checkIfInvalid(zipInput)) isValid = false;
		if (checkIfInvalid(cvvInput)) isValid = false;
	}

	if (!activityChecked()) {
		isValid = false;
		scrollTo = document.querySelector('.activities');
	}

	if (checkIfInvalid(userEmailInput)) {
		isValid = false;
		scrollTo = document.querySelector('fieldset');
	}
	if (checkIfInvalid(userNameInput)) {
		isValid = false;
		scrollTo = document.querySelector('fieldset');
	}

	if (scrollTo) scrollTo.scrollIntoView({ behavior: 'smooth' });
	if (!isValid) event.preventDefault();
});
