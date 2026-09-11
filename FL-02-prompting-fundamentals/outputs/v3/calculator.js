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

async function runCalculator() {
  console.log('=== Simple Calculator ===\n');
  
  let continueCalculation = true;

  while (continueCalculation) {
    const input = await askQuestion('Enter calculation (e.g., 5 + 3): ');
    
    // Parse input
    const parts = input.split(' ');
    
    if (parts.length !== 3) {
      console.log('Error: Please enter valid numbers\n');
      continue;
    }

    const num1 = parseFloat(parts[0]);
    const operator = parts[1];
    const num2 = parseFloat(parts[2]);

    // Validate numbers
    if (isNaN(num1) || isNaN(num2)) {
      console.log('Error: Please enter valid numbers\n');
      continue;
    }

    // Calculate
    let result;
    try {
      switch(operator) {
        case '+':
          result = num1 + num2;
          break;
        case '-':
          result = num1 - num2;
          break;
        case '*':
          result = num1 * num2;
          break;
        case '/':
          if (num2 === 0) {
            console.log('Error: Cannot divide by zero\n');
            continue;
          }
          result = num1 / num2;
          break;
        default:
          console.log('Error: Please enter valid numbers\n');
          continue;
      }
      
      console.log(`Result: ${result}\n`);
    } catch(error) {
      console.log('Error: Please enter valid numbers\n');
    }
  }

  rl.close();
}

runCalculator();
