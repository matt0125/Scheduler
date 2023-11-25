// testImport.js (in the same directory as your test file)
const Employee = require('../models/Employee');
console.log('Employee in testImport:', Employee);

jest.mock('../models/Employee');
console.log('Employee in testImport after mock:', Employee);