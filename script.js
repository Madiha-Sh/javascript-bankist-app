'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// // Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];


// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-03-23T07:42:02.383Z',
    '2022-03-28T09:15:04.904Z',
    '2022-04-25T10:17:24.185Z',
    '2022-03-08T14:11:59.604Z',
    '2022-03-27T17:01:17.194Z',
    '2022-04-20T23:36:17.929Z',
    '2022-04-22T10:51:36.790Z',
    '2022-04-23T21:31:17.178Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-03-23T07:42:02.383Z',
    '2022-03-28T09:15:04.904Z',
    '2022-04-25T10:17:24.185Z',
    '2022-03-08T14:11:59.604Z',
    '2022-03-27T17:01:17.194Z',
    '2022-04-20T23:36:17.929Z',
    '2022-04-22T10:51:36.790Z',
    '2022-04-23T21:31:17.178Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerDates = document.querySelector('.movements__date');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// LOGIN

let currentAccount, timer;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    // create current date and time
    // internationalizing date
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: 'numeric',
      // weekday: 'long'
    };
    // const locale = navigator.language;
    labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // const date = `${now.getDate()}`.padStart(2,0);
    // const month = `${now.getMonth()+1}`.padStart(2,0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2,0);
    // const minutes = `${now.getMinutes()}`.padStart(2,0);
    // labelDate.textContent = `${date}/${month}/${year}, ${hours}:${minutes}`;

    // empty login credentials
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // calling timer
    if(timer) clearInterval(timer);
    timer = startLogoutTimer();
    uiUpdate(currentAccount);
  }
});

// logout timer function
const startLogoutTimer = () => {

  const tick = () => {
    const min = String(Math.trunc(time/60)).padStart(2, 0);
    const sec = String(time%60).padStart(2, 0);
    // In each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // at 0 sec, stop the timer
    if(time === 0) {
      clearInterval(timer);
      // logout the user
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      // labelTimer.textContent = '00:00';
    }
    // decrease 1s from timer
    time--;
  }
  // set timer to 5 min --> 5*60 = 300sec
  let time = 120;
  // call timer every sec
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}


// UI update

const uiUpdate = (acc) => {
  // display movements
  displayMovements(acc);

  // display balance
  calculateCurrentBalance(acc);

  // display summary
  calculateCurrentSummary(acc);
}


// format date function
const formatMovementDate = (date, locale) => {

  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  }

  const daysPassed = calcDaysPassed(new Date(), date)
  console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) {
    return `${daysPassed} days ago`
  }
  else {
    // const day = `${date.getDate()}`.padStart(2,0);
    // const month = `${date.getMonth()+1}`.padStart(2,0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

// number format function
const numberFormatter = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

// display movements
const displayMovements = (acc, isSorted) => {
  containerMovements.innerHTML = '';

  const movs = isSorted ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
  
    const formattedMov = numberFormatter(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;
      
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}


// sorting the movements data
let isSorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});


// usernames
const createUsernames = (accounts) => {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(user => user[0])
      .join("");
  })
}
createUsernames(accounts);

// current balance function
const calculateCurrentBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, curr) => acc+curr, 0);

  const formattedBalance = numberFormatter(acc.balance, acc.locale, acc.currency);

  labelBalance.innerHTML = `${formattedBalance}`;
}

// current summary function
const calculateCurrentSummary = (acc) => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc+curr, 0);
  labelSumIn.textContent = `${numberFormatter(incomes, acc.locale, acc.currency)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc+curr, 0);
  // labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  labelSumOut.textContent = `${numberFormatter(Math.abs(out), acc.locale, acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate)/100)
    .filter((int, i, arr) => {
      // console.log(arr); 
      return int >= 1;
    })
    .reduce((acc, int) => acc+int, 0);
  labelSumInterest.textContent = `${numberFormatter(interest, acc.locale, acc.currency)}`
}

// transfering money
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";

  if(amount > 0 && recieverAccount && amount <= currentAccount.balance && recieverAccount?.username !== currentAccount.username) {
    console.log("money transfered");

    // transfer
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    // UI update
    uiUpdate(currentAccount);

    // Reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
})

// close account
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && currentAccount.pin === Number(inputClosePin.value)) {
    // find the index
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // display UI and login message
    labelWelcome.textContent = `Log in to get started`;
    accounts.splice(index, 1)
    containerApp.style.opacity = 0;
  }
  
  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
  console.log(accounts);
})

// loan
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if(loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {
    setTimeout(() => {
      console.log('approved');
      currentAccount.movements.push(loanAmount);
      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      uiUpdate(currentAccount);
    }, 2500);
    
    // Reset the timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }

  inputLoanAmount.value = "";
})


/////////////////////////////////////////////////
///////////////////////////////////////////////// 
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


/////////////////////////////////////////////////