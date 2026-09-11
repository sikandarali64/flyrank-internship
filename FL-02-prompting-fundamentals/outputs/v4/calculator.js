const readline = require('readline');

// ============================================
// SECTION 1: INPUT HANDLING - Setup terminal
// ============================================

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

// ============================================
// SECTION 2: PARSING - Extract numbers & operator
// ============================================

function parseInput(input) {
  const parts = input.trim().split(/\s+/);
  
  if (parts.length !== 3) {
    return null;
  }

  const num1 = parseFloat(parts[0]);
  const operator = parts[1];
  const num2 = parseFloat(parts[2]);

  if (isNaN(num1) || isNaN(num2)) {
    return null;
  }

  return { num1, operator, num2 };
}

// ============================================
// SECTION 3: CALCULATION - Perform operations
// ============================================

function calculate(num1, operator, num2) {
  switch(operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      if (num2 === 0) return null; // Error case
      return num1 / num2;
    default:
      return null; // Invalid operator
  }
}

// ============================================
// SECTION 4: ERROR HANDLING - Validate & report
// ============================================

async function main() {
  console.log('=== Simple Calculator ===');
  console.log('Supported: + - * /');
  console.log('Format: number operator number\n');

  let keepGoing = true;

  while (keepGoing) {
    const input = await askQuestion('Enter calculation: ');
    
    // Parse
    const parsed = parseInput(input);
    if (!parsed) {
      console.log('Error: Invalid format. Use "5 + 3"\n');
      continue;
    }

    // Calculate
    const result = calculate(parsed.num1, parsed.operator, parsed.num2);
    
    // Handle errors
    if (result === null) {
      if (parsed.operator === '/' && parsed.num2 === 0) {
        console.log('Error: Cannot divide by zero\n');
      } else {
        console.log('Error: Invalid operator\n');
      }
      continue;
    }

    // Success
    console.log(`Result: ${result}\n`);
  }

  rl.close();
}

main();
