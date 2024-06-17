const cashInput = document.getElementById("cash");
const changeOutputElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

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
      return changeItem.join(": ")
// "Status: OPEN TWENTY: $60 TEN: $20 FIVE: $15 ONE: $1 QUARTER: $0.5 DIME: $0.2 PENNY: $0.04"
    }).join(" ")
    updateChangeContent(changeHTML)
  }
}

const updateChangeContent = (html) => {
  changeOutputElement.innerHTML = html;
}

const calculateTotalCidChange = () => {
  return Number(cid.map(item => item[1]).reduce((acc, currValue) => acc += currValue, 0).toFixed(2));
}

const calculateChange = (cashInputValue) => {
  let remainingChange = Number((cashInputValue - price).toFixed(2));
  let changeArray = []
  while (remainingChange > 0 && calculateTotalCidChange() > 0) {
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

      while (remainingChange >= changeNumber && cid[i][1] > 0) {
        console.info("In while loop 2")
        remainingChange = Number((remainingChange - changeNumber).toFixed(2));
        if (changeToPush.length === 2) {
          changeToPush[1] = Number((changeToPush[1] + changeNumber).toFixed(2));
        } else {
          changeToPush.push(changeNumber)
        }
        cid[i][1] = Number(cid[i][1] - changeNumber.toFixed(2));
      }
      if (changeToPush.length === 2) {
        changeArray.push(changeToPush);
      }
    }
  }
  if (remainingChange > 0) {
    changeArray = [["Status", "INSUFFICIENT_FUNDS"]]
  } else if (calculateTotalCidChange() > 0) {
    changeArray.unshift(["Status", "OPEN"])
  } else {
    changeArray.unshift(["Status", "CLOSED"])
  }
  return changeArray;
}

purchaseBtn.addEventListener("click", purchaseItem)
