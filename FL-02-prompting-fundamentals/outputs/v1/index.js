const readline = require("readline");
const { add, subtract, multiply, divide } = require("./calculator");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const operations = {
  1: { name: "Add", fn: add },
  2: { name: "Subtract", fn: subtract },
  3: { name: "Multiply", fn: multiply },
  4: { name: "Divide", fn: divide },
};

function showMenu() {
  console.log("\n--- Simple Calculator ---");
  console.log("1. Add");
  console.log("2. Subtract");
  console.log("3. Multiply");
  console.log("4. Divide");
  console.log("5. Exit");
}

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  let running = true;

  while (running) {
    showMenu();
    const choice = await ask("\nChoose an operation (1-5): ");

    if (choice === "5") {
      running = false;
      console.log("Goodbye!");
      break;
    }

    const op = operations[choice];
    if (!op) {
      console.log("Invalid choice. Try again.");
      continue;
    }

    const a = parseFloat(await ask("Enter first number: "));
    const b = parseFloat(await ask("Enter second number: "));

    if (isNaN(a) || isNaN(b)) {
      console.log("Invalid numbers. Try again.");
      continue;
    }

    try {
      const result = op.fn(a, b);
      console.log(`\nResult: ${a} ${op.name === "Add" ? "+" : op.name === "Subtract" ? "-" : op.name === "Multiply" ? "*" : "/"} ${b} = ${result}`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  rl.close();
}

main();
