const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('=== Step-by-Step Calculator ===\n');

  let shouldContinue = true;

  while (shouldContinue) {
    // Step 1: Take user input from terminal
    const userInput = await askQuestion('Enter: number operator number (e.g., 5 + 3)\n> ');

    // Step 2: Parse numbers and operator
    const tokens = userInput.trim().split(/\s+/);
    
    if (tokens.length !== 3) {
      console.log('❌ Error: Please enter valid numbers\n');
      continue;
    }

    const firstNumber = parseFloat(tokens[0]);
    const mathOperator = tokens[1];
    const secondNumber = parseFloat(tokens[2]);

    if (isNaN(firstNumber) || isNaN(secondNumber)) {
      console.log('❌ Error: Please enter valid numbers\n');
      continue;
    }

    // Step 3: Perform calculation
    let answer;
    let hasError = false;

    if (mathOperator === '+') {
      answer = firstNumber + secondNumber;
    } else if (mathOperator === '-') {
      answer = firstNumber - secondNumber;
    } else if (mathOperator === '*') {
      answer = firstNumber * secondNumber;
    } else if (mathOperator === '/') {
      // Step 4: Handle division by zero
      if (secondNumber === 0) {
        console.log('❌ Error: Cannot divide by zero\n');
        hasError = true;
      } else {
        answer = firstNumber / secondNumber;
      }
    } else {
      // Step 5: Handle invalid input
      console.log('❌ Error: Please enter valid numbers\n');
      hasError = true;
    }

    // Show result if no error
    if (!hasError) {
      console.log(`✅ Result: ${answer}\n`);
    }

    // Step 6: Ask for next calculation
    const nextCalc = await askQuestion('Calculate again? (yes/no): ');
    if (nextCalc.toLowerCase() !== 'yes' && nextCalc.toLowerCase() !== 'y') {
      shouldContinue = false;
    }
    console.log();
  }

  console.log('Thank you for using the calculator!');
  rl.close();
}

main();
