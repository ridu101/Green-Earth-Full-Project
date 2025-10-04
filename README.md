



#### 1) What is the difference between var, let, and const?
Answer: Difference between var, let, and const

var

Function-scoped (not block-scoped).

Can be re-declared and updated.

Hoisted (moved to top of scope with value undefined).

let

Block-scoped.

Can be updated, but cannot be re-declared in the same scope.

Hoisted but not initialized → causes Temporal Dead Zone.

const

Block-scoped.

Cannot be re-assigned or re-declared.

Must be initialized when declared.

#### 2) What is the difference between map(), forEach(), and filter()? 
Answer: Difference between map(), forEach(), and filter()

map()

Returns a new array with transformed values.

Used when you want to create a modified version of an array.

forEach()

Loops through elements.

Does not return a new array (returns undefined).

Mainly used for side effects (logging, updating external variables).

filter()

Returns a new array containing only elements that pass a condition.


#### 3) What are arrow functions in ES6?
Answer: A shorter syntax for writing functions.

They do not have their own this (they use this from the surrounding scope → lexical this).

Cleaner and concise compared to function.


#### 4) How does destructuring assignment work in ES6?
Answer: Destructuring allows you to unpack values from arrays or objects into variables in a simpler way.

#### 5) Explain template literals in ES6. How are they different from string concatenation?
Answer: Template literals use backticks (``) instead of quotes.

Allow string interpolation using ${} syntax.

Support multi-line strings without \n. 

Difference:

Concatenation uses +, messy for multi-values.

Template literals are cleaner, easier to read, and support expressions directly inside strings.



