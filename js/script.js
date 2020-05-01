/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/

// Global variables for form elements
const form = document.querySelector('form');
const inputs = document.getElementsByTagName('input');
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

/**
 * Object of objects for the input validation requirements and associated tip text
 */
const validators = {
	name  : {
		regex         : /^[a-z]+$/i,
		badPatternTip : 'Name can only contain letters',
		emptyTip      : 'Please enter your name'
	},
	mail  : {
		regex         : /^[^@]+@[^@]+\.[a-z]+$/i,
		badPatternTip : 'Please enter a valid email: "person@sample.com"',
		emptyTip      : 'Please enter your email'
	},
	ccnum : {
		regex         : /^(\d{4} ?){3}\d{1,4}$/,
		badPatternTip : 'A valid credit card number is between 13 and 16 digits',
		emptyTip      : 'Please enter your credit card information'
	},
	zip   : {
		regex         : /(^\d{5}$|^[a-z]\d[a-z] ?\d[a-z]\d$)/i,
		badPatternTip : 'Please a Zip code: 5-digits or Postal Code: "A0A 0A0"'
	},
	cvv   : {
		regex         : /^\d{3}$/,
		badPatternTip : 'Please enter the 3-digit CVV that can be found on the back of your card'
	}
};

/**
 * Setup initial form view
 */
function init() {
	// add event listeners to inputs for validation
	setupInputListeners(validators);
	// hide job role - other
	otherJobRoleInput.style.display = 'none';
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

/* ------ ”Job Role” section ------ */
// add event listener to job role select to show/hide 'other' field
userTitleSelect.addEventListener('change', function() {
	if (this.value === 'other') {
		otherJobRoleInput.style.display = '';
	} else {
		otherJobRoleInput.style.display = 'none';
	}
});

/* ------ ”T-Shirt Info” section ------ */
/**
 * limits the t-shirt color options to only show those corresponding to the selected design
 * @param {string} design string specifying which design set to show
 */
function setShirtColorOptions(design = 'none') {
	// T-shirt color select element
	const shirtColors = document.getElementById('color');
	// boolean flag to select first t-shirt color of design set
	let selectedFlag = false;

	for (let i = 0; i < shirtColors.options.length; i++) {
		if (shirtColors.options[i].innerText.includes(design)) {
			// show select options of the selected design
			shirtColors.options[i].hidden = false;
			// select the first t-shirt color of the new set so the user doesn't see an invalid option
			if (!selectedFlag) {
				shirtColors.options[i].selected = true;
				selectedFlag = true;
			}
		} else {
			// hide and unselect inapplicable color options
			shirtColors.options[i].hidden = true;
			shirtColors.options[i].selected = false;
		}
	}
	// if no design selected, hide the color select and change its label
	// otherwise show the color select, change its label and set focus on it
	if (design === 'none') {
		shirtColors.previousElementSibling.textContent = 'Please select a T-shirt theme';
		shirtColors.hidden = true;
	} else {
		shirtColors.previousElementSibling.textContent = 'Color:';
		shirtColors.hidden = false;
		shirtColors.focus();
	}
}

// add event listener to t-shirt design dropdown to call function
// that displays corrsponding t-shirt colors
shirtDesignSelect.addEventListener('change', function() {
	switch (this.value) {
		case 'js puns':
			setShirtColorOptions('Puns');
			break;
		case 'heart js':
			setShirtColorOptions('I');
			break;
		default:
			setShirtColorOptions();
			break;
	}
});

/* ------ ”Register for Activities” section ------ */
/**
 * Looks through all activities to disable any that are at a conflicting day/time
 */
function disableConflictingActivities() {
	const checkedDayAndTime = event.target.dataset.dayAndTime; // day/time of checked activity
	const checkboxName = event.target.name; // name attribute of checked activity
	if (checkedDayAndTime) {
		// loop through all checkboxes to see if there is a matching day/time for any of the other activities
		for (let i = 0; i < activityCheckboxes.length; i++) {
			if (
				checkboxName !== activityCheckboxes[i].name && // don't compare the day/time of the checkbox that triggered event
				checkedDayAndTime === activityCheckboxes[i].dataset.dayAndTime
			) {
				// disable conflicting activity and style
				activityCheckboxes[i].disabled = !activityCheckboxes[i].disabled;
				activityCheckboxes[i].parentElement.classList.toggle('disabled');
			}
		}
	}
}
/**
 * calculates the total cost of the selected activities
 * @returns {number}
 */
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
// add event listener to all the checkboxes to validate activities
// selected and keep a running total of costs
for (let i = 0; i < activityCheckboxes.length; i++) {
	activityCheckboxes[i].addEventListener('change', () => {
		// style checked activities
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

/* ------ "Payment Info" section ------ */
/**
 * Shows just the selected payment option section
 * @param {string} paymentOption a value from the select payment dropdown
 */
function displayPayment(paymentOption) {
	// first hide all the payment option sections
	for (let i = 1; i < paymentSelect.options.length; i++) {
		const option = paymentSelect.options[i].value.replace(' ', '-');
		document.getElementById(option).style.display = 'none';
		document.getElementById(option).classList.add('hide');
	}
	// then show just the selected payment option section
	document.getElementById(paymentOption).style.display = '';
	document.getElementById(paymentOption).classList.remove('hide');
}

// add event listener to payment dropdown
paymentSelect.addEventListener('change', () => {
	const selected = paymentSelect.value.replace(' ', '-');
	displayPayment(selected);
});

/* ------ Form Validation ------ */
/**
 * I don't know how to document this, advice appreciated!
 * Takes an object of validation information and returns an anonymous
 * function that will be assigned to an 'input' event listener
 * code modified from Treehouse Regex Course
 * @param {object} validator 
 */
function createListener(validator) {
	return event => {
		const targetElem = event.target; // element that triggered the event
		const text = targetElem.value; // user input in target element
		const label = targetElem.previousElementSibling;	// label for target element
		const showEmptyTip = !text;	// boolean: true if empty; false otherwise
		const showBadPatternTip = !validator.regex.test(text); // boolean: result of regex test on user input, true if false
		const emptyTip = validator.emptyTip; // tip to show user if field is empty
		const badPatternTip = validator.badPatternTip; // tip to show user if regex failed

		// reset validation message and style
		label.removeAttribute('data-tip');
		label.classList.remove('invalid');

		if (showEmptyTip) {
			// if input field is empty, notify user it is required
			if (emptyTip) targetElem.placeholder = emptyTip;
			targetElem.classList.add('invalid');
		} else if (showBadPatternTip) {
			// if user input failed validation regex pattern, notify user
			if (badPatternTip) label.setAttribute('data-tip', badPatternTip);
			targetElem.classList.add('invalid');
			label.classList.add('invalid');
		} else {
			// input ok, remove all validation notifications
			label.removeAttribute('data-tip');
			targetElem.placeholder = '';
			targetElem.classList.remove('invalid');
		}
	};
}
/**
 * adds event listner for 'input' event on all inputs with validation requirements
 * @param {object} validators 
 */
function setupInputListeners(validators) {
	// loop through all inputs on form
	for (let i = 0; i < inputs.length; i++) {
		// find id attribute: will match to validators object keys
		// remove hyphen from id as object keys cannot contain special characters
		const id = inputs[i].id.replace('-', '');
		if (validators[id]) {
			// if input has required validation parameters, add event listener to input
			inputs[i].addEventListener('input', createListener(validators[id]));
		}
	}
}

// add event listner to form to validate data on submit
form.addEventListener('submit', () => {
	/**
	 * Checks given element for a class attribute indicating invalid input
	 * @param {element} elem 
	 */
	function checkIfInvalid(elem) {
		return elem.classList.contains('invalid');
	}
	/**
 * Looks through all the activity checkboxes to see if at least one has been checked
 * notifies user if none are checked
 */
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
	// boolean to say the form is valid. Starts as true and will be set false if any validation requirement failed
	let isValid = true;  
	let scrollTo; // Position on form to scroll to if input is invalid

	// manually trigger all the input events just in case user did not enter a required field
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].dispatchEvent(new Event('input'));
	}

	// if credit card selected validate credit card fields
	if (paymentSelect.value === 'credit card') {
		if (checkIfInvalid(ccNumInput)) isValid = false;
		if (checkIfInvalid(zipInput)) isValid = false;
		if (checkIfInvalid(cvvInput)) isValid = false;
	}
	// check if at least one activity was selected
	if (!activityChecked()) {
		isValid = false;
		scrollTo = document.querySelector('.activities');
	}
	// check if a valid email was given
	if (checkIfInvalid(userEmailInput)) {
		isValid = false;
		scrollTo = document.querySelector('fieldset');
	}
	// check if a valid name was given
	if (checkIfInvalid(userNameInput)) {
		isValid = false;
		scrollTo = document.querySelector('fieldset');
	}

	// scroll to element if any was set
	if (scrollTo) scrollTo.scrollIntoView({ behavior: 'smooth' });
	// if anything failed validation prevent form submission
	if (!isValid) event.preventDefault();
});
