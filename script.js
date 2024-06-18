const cashInput = document.getElementById("cash");
const changeOutputElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

const totalPriceSpan = document.querySelector("#total-container span");
const numpad = document.getElementById("numpad");
const drawerChangeContainer = document.getElementById("drawer-change");

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

const purchaseItem = () => {
  const cashInputValue = Number(cashInput.value);
  console.log(`Cash Input Value: ${cashInputValue}`)
  if (cashInputValue < price) {
    alert("Customer does not have enough money to purchase the item")
  } else if (cashInputValue === price) {
    updateChangeContent("No change due - customer paid with exact cash")
  } else {
    const changeArray = calculateChange(cashInputValue);
    const changeHTML = changeArray.map((changeItem, idx) => {
      if (typeof changeItem[1] === "number") {
        changeItem[1] = `$${changeItem[1]}`
      }
      return `<p>${changeItem.join(": ")}</p>`
    }).join(" ")
    updateChangeContent(changeHTML)
  }
}

const updateChangeContent = (html) => {
  changeOutputElement.innerHTML = html;
}

const calculateTotalCidChange = (changeArray) => {
  return Number(changeArray.map(item => item[1]).reduce((acc, currValue) => acc += currValue, 0).toFixed(2));
}

const calculateChange = (cashInputValue) => {
  let remainingChange = Number((cashInputValue - price).toFixed(2));
  let changeArray = []
  const cidCopy = JSON.parse(JSON.stringify(cid));
  while (remainingChange > 0 && calculateTotalCidChange(cidCopy) > 0) {
    console.info("In while loop 1")
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

      const changeToPush = [changeTypeName];

      while (remainingChange >= changeNumber && cidCopy[i][1] > 0) {
        console.info("In while loop 2")
        remainingChange = Number((remainingChange - changeNumber).toFixed(2));
        if (changeToPush.length === 2) {
          changeToPush[1] = Number((changeToPush[1] + changeNumber).toFixed(2));
        } else {
          changeToPush.push(changeNumber)
        }
        cidCopy[i][1] = Number(cidCopy[i][1] - changeNumber.toFixed(2));
      }
      if (changeToPush.length === 2) {
        changeArray.push(changeToPush);
      }
    }
  }
  if (remainingChange > 0) {
    changeArray = [["Status", "INSUFFICIENT_FUNDS"]]
  } else if (calculateTotalCidChange(cidCopy) > 0) {
    changeArray.unshift(["Status", "OPEN"])
    cid = cidCopy;
    updateCidContent();
  } else {
    cid = cidCopy;
    changeArray.unshift(["Status", "CLOSED"])
    updateCidContent();
  }
  return changeArray;
}

const updateCidContent = () => {
  drawerChangeContainer.innerHTML = cid.map(item => `<p>${item[0]}: <span>${item[1]}`).join(" ");
}

purchaseBtn.addEventListener("click", purchaseItem)

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

Array.from(document.getElementsByClassName("numpad-btn")).map((btn, index) => btn.textContent = index+1)
