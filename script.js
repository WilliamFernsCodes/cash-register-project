// Get all elements
const cashInput = document.getElementById("cash");
const changeOutputElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

const totalPriceSpan = document.querySelector("#total-container span");
const numpad = document.getElementById("numpad");
const drawerChangeContainer = document.getElementById("drawer-change");

// set default price, and cash in drawer
let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Function to purchase item, when purchase button is clicked
const purchaseItem = () => {
  const cashInputValue = Number(cashInput.value);
  console.log(`Cash Input Value: ${cashInputValue}`)
  if (cashInputValue < price) {
    alert("Customer does not have enough money to purchase the item")
  } else if (cashInputValue === price) {
    updateChangeContent("No change due - customer paid with exact cash")
  } else {
    // handle the case where the costumer needs change
    const changeArray = calculateChange(cashInputValue);
    const changeHTML = changeArray.map(changeItem => {
      if (typeof changeItem[1] === "number") {
        changeItem[1] = `$${changeItem[1]}`
      }
      return `<p>${changeItem.join(": ")}</p>`
    }).join(" ")
    updateChangeContent(changeHTML)
  }
}

// function to update the change content html, to notify the user.
const updateChangeContent = (html) => {
  changeOutputElement.innerHTML = html;
}

// function to calculate total change left in the cash register drawer
const calculateTotalCidChange = (changeArray) => {
  return Number(changeArray.map(item => item[1]).reduce((acc, currValue) => acc += currValue, 0).toFixed(2));
}

// function to calculate all change, based of the cash the customer gives
const calculateChange = (cashInputValue) => {
  let remainingChange = Number((cashInputValue - price).toFixed(2)); // calculate the change
  let changeArray = [] // array to store all the change
  const cidCopy = JSON.parse(JSON.stringify(cid)); // deep copy the cash in drawer, to not directly modify it.

  // while loop. It will break when remainingChange <= 0, or when total change left is <= cidCopy. 
  while (remainingChange > 0 && calculateTotalCidChange(cidCopy) > 0) {
    // start at the highest bill. That is why the for loop is in reverse.
    for (let i = cid.length - 1; i >= 0; i--) {
      const changeType = cid[i];
      const [changeTypeName, changeTypeValue] = changeType;
      let changeNumber = 0;
      switch (changeTypeName) {
        case "PENNY":
          changeNumber = 0.01;
          break;
        case "NICKEL":
          changeNumber = 0.05;
          break;
        case "DIME":
          changeNumber = 0.1;
          break;
        case "QUARTER":
          changeNumber = 0.25;
          break;
        case "ONE":
          changeNumber = 1;
          break;
        case "FIVE":
          changeNumber = 5;
          break;
        case "TEN":
          changeNumber = 10;
          break;
        case "TWENTY":
          changeNumber = 20;
          break;
        default:
          changeNumber = 100;
          break;
      }

      console.info(`Change Number: ${changeNumber}`);

      // variable to store the change array item, that will be pushed later on.
      const changeToPush = [changeTypeName];

      // give change of the current changeType (for example: "HUNDRED"), until there is no longer enough of it left, or if remainning change is smaller than the change number (100 in this example)
      while (remainingChange >= changeNumber && cidCopy[i][1] > 0) {
        // minus the changeNumber from remainingChange
        remainingChange = Number((remainingChange - changeNumber).toFixed(2));
        if (changeToPush.length === 2) { // if a number was already previously pushed, (eg length will be 2), add changeNumber to that.
          changeToPush[1] = Number((changeToPush[1] + changeNumber).toFixed(2));
        } else { // else, this is the first time it adds it. Push it as a new item.
          changeToPush.push(changeNumber)
        }
        // subract the number from cash in drawer, since we just gave that to the customer
        cidCopy[i][1] = Number(cidCopy[i][1] - changeNumber.toFixed(2));
      }

      // if the length is longer than two (change was taken from drawer), then add it to the changeArray
      if (changeToPush.length === 2) {
        changeArray.push(changeToPush);
      }
    }
  }

  if (remainingChange > 0) { // if the remainingChange is bigger than 0 (meaning the drawer didn't have enough change), there is insufficient funds
    changeArray = [["Status", "INSUFFICIENT_FUNDS"]]
  } else if (calculateTotalCidChange(cidCopy) > 0) { // if the change in the drawer is more than 0 (there is change left), the cash regsiter is still open
    changeArray.unshift(["Status", "OPEN"])
    cid = cidCopy; // assign the copy to the real cash in drawer
    updateCidContent(); // update the cash in drawer content on the page
  } else { // else - the cash drawer doens't have any money in it, give the status that the drawer is closed
    changeArray.unshift(["Status", "CLOSED"])
    cid = cidCopy; // assign the copy to the real cash in drawer
    updateCidContent(); // update the cash in drawer content on the page
  }
  return changeArray; // return all the change
}

// function to update the cash in drawer element with all the remaining cash in the drawer
const updateCidContent = () => {
  drawerChangeContainer.innerHTML = cid.map(item => `<p>${item[0]}: <span>${item[1]}`).join(" ");
}

// add click event listener for purchase button, to purchase item.
purchaseBtn.addEventListener("click", purchaseItem)

// initial display content
totalPriceSpan.textContent = price;
updateCidContent()

for (let i = 0; i < 3; i++) {
numpad.innerHTML += `
  <div class="numpad-row">
    <div class="numpad-btn"></div>
    <div class="numpad-btn"></div>
    <div class="numpad-btn"></div>
  </div>
  `
}

// set number for each numpad button, and make so that when button is clicked, it actually inputs the number into the input 
const numpadButtons = Array.from(document.getElementsByClassName("numpad-btn"))
numpadButtons.map((btn, index) => {
  btn.textContent = index+1;
  btn.addEventListener("click", () => cashInput.value += index+1);
})
