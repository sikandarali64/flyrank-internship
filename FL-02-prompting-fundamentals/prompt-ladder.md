# FL-02 — Prompt Fundamentals on Real Tasks
**Track:** General AI Fluency | **Week:** 2

## Task
Build a Simple Calculator in Node.js

---

## Version 0 — Lazy Prompt
**Technique:** Baseline (no technique)
**Prompt:** `Build a calculator in node js`
**Output Excerpt:** Basic function with no structure, no error handling
**Note:** Output was too generic. No operations specified, just a basic code dump with no terminal interaction.

---

## Version 1 — Role Assignment
**Technique:** Role Assignment
**Prompt:** `You are a senior Node.js developer. Build a calculator in Node.js.`
**Output Excerpt:** Added class structure and comments
**Note:** Role made AI write cleaner code with proper comments. But still missing context about who is using it.

---

## Version 2 — Context and Motivation
**Technique:** Context and Motivation
**Prompt:** `You are a senior Node.js developer. I am a CS student learning backend development. Build a simple calculator in Node.js that runs in terminal.`
**Output Excerpt:** Terminal-based calculator with readline, beginner friendly
**Note:** Context changed everything. Code became simpler and beginner friendly. Before it was too complex for my level.

---

## Version 3 — Few-Shot Examples
**Technique:** Few-Shot Examples
**Prompt:** 
```
You are a senior Node.js developer.
I am a CS student learning backend.
Build a simple calculator in Node.js that runs in terminal.

Example interactions:
Input: 5 + 3 → Output: Result: 8
Input: 10 / 2 → Output: Result: 5
Input: abc → Output: Error: Please enter valid numbers
```
**Output Excerpt:** Calculator matching exact input/output format from examples
**Note:** Examples made AI understand exact format I wanted. Output messages now match my style.

---

## Version 4 — Output Structure
**Technique:** Output Structure
**Prompt:**
```
You are a senior Node.js developer.
I am a CS student learning backend.
Build a simple calculator in Node.js that runs in terminal.
Give me exactly:
1) index.js file with calculator logic
2) How to run it
3) Supported operations list
4) Error handling for wrong inputs
```
**Output Excerpt:** Perfectly structured response with 4 clear sections
**Note:** Structure format removed guesswork. Got organized sections I could directly use.

---

## Version 5 — Step Decomposition
**Technique:** Step Decomposition
**Prompt:**
```
You are a senior Node.js developer.
I am a CS student learning backend.
Build a simple calculator in Node.js step by step:
Step 1: Take user input from terminal
Step 2: Parse numbers and operator
Step 3: Perform calculation
Step 4: Handle division by zero
Step 5: Handle invalid input
Step 6: Ask for next calculation
```
**Output Excerpt:** Clean step by step code with comments per step
**Note:** ❌ This made it slightly worse. Too many steps made AI over-comment every line. Code became harder to read. Version 4 was better.

---

## Cross-Model Comparison

**Prompt used:**
```
You are a senior Node.js developer. I am a CS student.
Build a simple calculator in Node.js that runs in terminal.
Give me: 1) index.js 2) How to run it 3) Error handling. Keep code minimal.
```

**Claude Output:**
Clean minimal code, proper error handling, followed instructions precisely, no extra features added.

**ChatGPT Output:**
More verbose, added unrequested features like calculation history, over-explained basic concepts.

**Difference:**
Claude followed instructions more precisely and kept code minimal. ChatGPT added unrequested features which was overwhelming for a beginner. Claude won for this specific task.

---

## Final Reusable Template

```
You are a senior [LANGUAGE] developer.
I am a [YOUR LEVEL] student learning [TOPIC].
Build a [WHAT YOU WANT] that runs in [WHERE].

Give me:
1) Main file with complete code
2) How to run it (one command)
3) Error cases handled
4) Keep code simple, minimal comments

Example:
Input: [your example]
Output: [expected result]
```

---

## Key Learnings
- ✅ **Version 4 was best** — Structured prompts with clear output format
- ⚠️ **Version 5 over-complicated** — Too many steps made code harder to read
- 📌 **Role + Context + Examples** — This 3-part formula works best
- 🎯 **Output structure matters** — Explicit formatting beats generic requests
