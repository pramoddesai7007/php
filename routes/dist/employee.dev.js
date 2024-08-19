"use strict";

require('dotenv').config();

var express = require('express');

var router = express.Router();

var _require = require('express-validator'),
    body = _require.body,
    validationResult = _require.validationResult;

var bcrypt = require('bcryptjs');

var Company = require('../models/Company');

var jwt = require('jsonwebtoken'); // Import the 'jsonwebtoken' library


var jwtMiddleware = require('../jwtmiddleware');

var Employee = require('../models/Employee');

var SubEmployee = require('../models/SubEmployee');

var Salary = require('../models/Salary');

var Sales = require('../models/Sales');

var Task = require('../models/Task');

var ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET; // Route to register (sign up) an employee
// http://localhost:5000/api/employee/register
// router.post('/register', [
//     // Validation rules using express-validator
//     body('name').notEmpty().withMessage('Name is required'),
//     body('email').isEmail().withMessage('Invalid email format'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//     body('adminCompanyName').notEmpty().withMessage('Admin Company Name is required'),
//     body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format'), // Add phone number validation
// ], async (req, res) => {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         // Check if an employee with the same email already exists
//         const existingEmployee = await Employee.findOne({ email: req.body.email });
//         if (existingEmployee) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }
//         // Find the admin user ID based on the selected admin company name
//         const adminCompany = await Company.findOne({ companyName: req.body.adminCompanyName });
//         if (!adminCompany) {
//             return res.status(404).json({ error: 'Admin Company not found' });
//         }
//         // Hash the password using bcryptjs
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         // Create a new employee with the adminUserId automatically set
//         const newEmployee = new Employee({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword,
//             adminUserId: adminCompany._id, // Assign the adminUserId from the lookup
//             adminCompanyName: req.body.adminCompanyName,
//             phoneNumber: req.body.phoneNumber, // Add phoneNumber
//             companyId: req.body.companyId, // Assign the companyId from the request
//         });
//         await newEmployee.save();
//         res.status(201).json({ message: 'Employee registered successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post('/register', [// Validation rules using express-validator
body('name').notEmpty().withMessage('Name is required'), body('email').isEmail().withMessage('Invalid email format'), body('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long'), body('adminCompanyName').notEmpty().withMessage('Admin Company Name is required'), body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format') // Add phone number validation
], function _callee(req, res) {
  var errors, existingEmployee, adminCompany, hashedPassword, newEmployee, newSubemployee;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Check for validation errors
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(Employee.findOne({
            email: req.body.email
          }));

        case 6:
          existingEmployee = _context.sent;

          if (!existingEmployee) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Email already in use'
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(Company.findOne({
            companyName: req.body.adminCompanyName
          }));

        case 11:
          adminCompany = _context.sent;

          if (adminCompany) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: 'Admin Company not found'
          }));

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 16:
          hashedPassword = _context.sent;
          // Create a new employee with the adminUserId automatically set
          newEmployee = new Employee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            adminUserId: adminCompany._id,
            // Assign the adminUserId from the lookup
            adminCompanyName: req.body.adminCompanyName,
            phoneNumber: req.body.phoneNumber,
            // Add phoneNumber
            companyId: req.body.companyId,
            // Assign the companyId from the request
            role: "Admin"
          });
          _context.next = 20;
          return regeneratorRuntime.awrap(newEmployee.save());

        case 20:
          // Create a new Subemployee with the details of the registered Employee as a supervisor
          newSubemployee = new SubEmployee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            adminUserId: adminCompany._id,
            adminCompanyName: req.body.adminCompanyName,
            phoneNumber: req.body.phoneNumber,
            role: "Admin",
            type: req.body.type
          });
          _context.next = 23;
          return regeneratorRuntime.awrap(newSubemployee.save());

        case 23:
          res.status(201).json({
            message: 'Employee registered successfully and stored as supervisor in Subemployee collection'
          });
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](3);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 26]]);
}); // Admin Login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         // Check if an employee with the provided email exists
//         const employee = await Employee.findOne({ email });
//         if (!employee) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }
//         // Verify the password
//         const isPasswordValid = await bcrypt.compare(password, employee.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }
//         // Determine the role of the employee (admin or sub-employee)
//         let role;
//         if (employee.adminCompanyName) {
//             // This is an admin employee
//             role = 'admin';
//         } else {
//             // This is a sub-employee
//             role = 'sub-employee';
//         }
//         // Create a JWT token with the employee's information and role
//         const token = jwt.sign({ email: employee.email, role, adminUserId: employee.adminUserId, adminCompanyName: employee.adminCompanyName, companyId: employee.companyId, employeeId: employee._id, name: employee.name }, ADMIN_JWT_SECRET,);
//         return res.status(200).json({ message: 'Authentication successful', token });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post('/login', function _callee2(req, res) {
  var _req$body, email, password, _token, employee, isPasswordValid, role, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context2.prev = 1;

          if (!(email === 'superadmin@gmail.com' && password === '@123456')) {
            _context2.next = 6;
            break;
          }

          _token = jwt.sign({
            email: email,
            role: 'superAdmin'
          }, ADMIN_JWT_SECRET);
          console.log("Superadmin enters");
          return _context2.abrupt("return", res.status(200).json({
            message: 'Authentication successful',
            token: _token
          }));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(Employee.findOne({
            email: email
          }));

        case 8:
          employee = _context2.sent;

          if (employee) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            error: 'Invalid credentials'
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(bcrypt.compare(password, employee.password));

        case 13:
          isPasswordValid = _context2.sent;

          if (isPasswordValid) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            error: 'Invalid credentials'
          }));

        case 16:
          if (employee.adminCompanyName) {
            // This is an admin employee
            role = 'admin';
          } else {
            // This is a sub-employee
            role = 'sub-employee';
          } // Create a JWT token with the employee's information and role


          token = jwt.sign({
            email: employee.email,
            role: role,
            adminUserId: employee.adminUserId,
            adminCompanyName: employee.adminCompanyName,
            companyId: employee.companyId,
            employeeId: employee._id,
            name: employee.name
          }, ADMIN_JWT_SECRET);
          return _context2.abrupt("return", res.status(200).json({
            message: 'Authentication successful',
            token: token
          }));

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 21]]);
}); // Route to edit an employee's information by ID and update it

router.put('/edit/:id', [// Validation rules using express-validator (customize as needed)
body('name').optional().notEmpty().withMessage('Name is required'), body('email').optional().isEmail().withMessage('Invalid email format'), body('password').optional().isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long'), body('adminCompanyName').optional().notEmpty().withMessage('Admin Company Name is required'), body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format') // Add phone number validation
], function _callee3(req, res) {
  var employeeId, errors, employee, adminCompany;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          employeeId = req.params.id; // Check for validation errors

          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 4:
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Employee.findById(employeeId));

        case 7:
          employee = _context3.sent;

          if (employee) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Employee not found'
          }));

        case 10:
          // Update employee information based on the provided fields
          if (req.body.name) {
            employee.name = req.body.name;
          }

          if (req.body.email) {
            employee.email = req.body.email;
          } // if (req.body.password) {
          //     const hashedPassword = await bcrypt.hash(req.body.password, 10);
          //     employee.password = hashedPassword;
          // }


          if (!req.body.adminCompanyName) {
            _context3.next = 20;
            break;
          }

          _context3.next = 15;
          return regeneratorRuntime.awrap(Company.findOne({
            companyName: req.body.adminCompanyName
          }));

        case 15:
          adminCompany = _context3.sent;

          if (adminCompany) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Admin Company not found'
          }));

        case 18:
          employee.adminUserId = adminCompany._id;
          employee.adminCompanyName = req.body.adminCompanyName;

        case 20:
          if (req.body.phoneNumber) {
            employee.phoneNumber = req.body.phoneNumber; // Update phoneNumber
          } // Save the updated employee


          _context3.next = 23;
          return regeneratorRuntime.awrap(employee.save());

        case 23:
          res.status(200).json({
            message: 'Employee updated successfully',
            employee: employee
          });
          _context3.next = 29;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](4);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 26]]);
});
router["delete"]('/delete/:id', function _callee4(req, res) {
  var employeeId, deletedEmployee, employeeEmail, deletedSubEmployee;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          employeeId = req.params.id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Employee.findByIdAndDelete(employeeId));

        case 4:
          deletedEmployee = _context4.sent;

          if (deletedEmployee) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Employee not found'
          }));

        case 7:
          // Find the corresponding record in the subEmployee collection based on a shared attribute (e.g., employeeName)
          employeeEmail = deletedEmployee.email; // Adjust this based on your schema

          _context4.next = 10;
          return regeneratorRuntime.awrap(SubEmployee.findOneAndDelete({
            email: employeeEmail
          }));

        case 10:
          deletedSubEmployee = _context4.sent;

          if (deletedSubEmployee) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(500).json({
            error: 'Failed to delete from subEmployee collection'
          }));

        case 13:
          res.status(200).json({
            message: 'Employee deleted successfully'
          });
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](1);
          console.error(_context4.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 16]]);
}); // http://localhost:5000/api/employee/list

router.get('/list', function _callee5(req, res) {
  var employees;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Employee.find());

        case 3:
          employees = _context5.sent;
          res.status(200).json(employees);
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router["delete"]('/employee/deleteProfilePicture', jwtMiddleware, function _callee7(req, res) {
  var employeeId, employee, profilePicturePath;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          employeeId = req.user.employeeId; // Find the employee by ID

          _context7.next = 4;
          return regeneratorRuntime.awrap(Employee.findById(employeeId));

        case 4:
          employee = _context7.sent;

          if (employee) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: 'Employee not found'
          }));

        case 7:
          // Check if there is a profile picture to delete
          if (employee.profilePicture) {
            profilePicturePath = path.join(__dirname, '..', employee.profilePicture); // Delete the profile picture from the file system

            fs.unlink(profilePicturePath, function _callee6(err) {
              return regeneratorRuntime.async(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      if (!err) {
                        _context6.next = 3;
                        break;
                      }

                      console.error(err);
                      return _context6.abrupt("return", res.status(500).json({
                        error: 'Failed to delete profile picture'
                      }));

                    case 3:
                      // Update the employee record to remove the profile picture reference
                      employee.profilePicture = '';
                      _context6.next = 6;
                      return regeneratorRuntime.awrap(employee.save());

                    case 6:
                      res.status(200).json({
                        message: 'Profile picture deleted successfully'
                      });

                    case 7:
                    case "end":
                      return _context6.stop();
                  }
                }
              });
            });
          } else {
            res.status(400).json({
              error: 'No profile picture to delete'
            });
          }

          _context7.next = 14;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get('/getEmpDetails', jwtMiddleware, function _callee8(req, res) {
  var employeeId, employee;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          employeeId = req.user.employeeId;
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(Employee.findById(employeeId));

        case 4:
          employee = _context8.sent;

          if (employee) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: 'Employee not found'
          }));

        case 7:
          res.status(200).json(employee);
          _context8.next = 13;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](1);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 10]]);
}); // create Employee

router.post('/registersub', [// Validation rules using express-validator
body('name').notEmpty().withMessage('Name is required'), body('email').isEmail().withMessage('Invalid email format'), body('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long'), body('adminCompanyName').notEmpty().withMessage('Admin Company Name is required'), body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format') // Add phone number validation
], jwtMiddleware, function _callee9(req, res) {
  var errors, authenticatedUser, hashedPassword, newSubEmployee, subEmployee;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          // Check for validation errors
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context9.next = 3;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _context9.prev = 3;
          // Check if the authenticated user (admin) exists and has the necessary privileges
          authenticatedUser = req.user; // Get the authenticated user

          console.log('authenticatedUser:', authenticatedUser);

          if (!(!authenticatedUser || authenticatedUser.role !== 'admin')) {
            _context9.next = 8;
            break;
          }

          return _context9.abrupt("return", res.status(403).json({
            error: 'Access denied'
          }));

        case 8:
          _context9.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 10:
          hashedPassword = _context9.sent;
          console.log('hashedPassword:', hashedPassword);
          newSubEmployee = new SubEmployee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phoneNumber: req.body.phoneNumber,
            // Add phoneNumber
            adminUserId: authenticatedUser._id,
            // Assign the adminUserId from the authenticated user
            adminCompanyName: authenticatedUser.adminCompanyName,
            type: req.body.type // companyId: authenticatedUser.companyId, // Assign the companyId from the authenticated user

          });
          _context9.next = 15;
          return regeneratorRuntime.awrap(newSubEmployee.save());

        case 15:
          subEmployee = _context9.sent;
          console.log(subEmployee);
          res.status(201).json({
            message: 'Sub-employee registered successfully',
            subEmployee: subEmployee
          });
          _context9.next = 23;
          break;

        case 20:
          _context9.prev = 20;
          _context9.t0 = _context9["catch"](3);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 23:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[3, 20]]);
}); // create Employee

router.post('/registersales', [// Validation rules using express-validator
body('name').notEmpty().withMessage('Name is required'), body('email').isEmail().withMessage('Invalid email format'), body('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long'), body('shiftHours').notEmpty().withMessage('ShiftHours is required'), body('adminCompanyName').notEmpty().withMessage('Admin Company Name is required'), body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format') // Add phone number validation
], jwtMiddleware, function _callee10(req, res) {
  var errors, authenticatedUser, hashedPassword, newSales, sales;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          // Check for validation errors
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context10.next = 3;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _context10.prev = 3;
          // Check if the authenticated user (admin) exists and has the necessary privileges
          authenticatedUser = req.user; // Get the authenticated user

          console.log('authenticatedUser:', authenticatedUser);

          if (!(!authenticatedUser || authenticatedUser.role !== 'admin')) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return", res.status(403).json({
            error: 'Access denied'
          }));

        case 8:
          _context10.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 10:
          hashedPassword = _context10.sent;
          console.log('hashedPassword:', hashedPassword);
          newSales = new Sales({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            shiftHours: req.body.shiftHours,
            phoneNumber: req.body.phoneNumber,
            adminUserId: authenticatedUser._id,
            adminCompanyName: authenticatedUser.adminCompanyName // companyId: authenticatedUser.companyId, // Assign the companyId from the authenticated user

          });
          _context10.next = 15;
          return regeneratorRuntime.awrap(newSales.save());

        case 15:
          sales = _context10.sent;
          console.log(sales);
          res.status(201).json({
            message: 'Sub-employee registered successfully',
            sales: sales
          });
          _context10.next = 23;
          break;

        case 20:
          _context10.prev = 20;
          _context10.t0 = _context10["catch"](3);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 23:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[3, 20]]);
});
router.get('/subemployees/clock-inn', jwtMiddleware, function _callee11(req, res) {
  var authenticatedUser, employees, emailList, clockRecords;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          authenticatedUser = req.user;

          if (authenticatedUser) {
            _context11.next = 5;
            break;
          }

          console.error('Access denied: User not authenticated');
          return _context11.abrupt("return", res.status(403).json({
            error: 'Access denied: User not authenticated'
          }));

        case 5:
          if (!(authenticatedUser.role === 'admin')) {
            _context11.next = 12;
            break;
          }

          console.log('Admin Company Name:', authenticatedUser.adminCompanyName);
          _context11.next = 9;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: authenticatedUser.adminCompanyName
          }));

        case 9:
          employees = _context11.sent;
          _context11.next = 16;
          break;

        case 12:
          console.log('Employee Company Name:', authenticatedUser.companyName);
          _context11.next = 15;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: authenticatedUser.adminCompanyName
          }));

        case 15:
          employees = _context11.sent;

        case 16:
          if (!(employees.length === 0)) {
            _context11.next = 18;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'No sub-employees found for this company.'
          }));

        case 18:
          emailList = employees.map(function (employee) {
            return employee.email;
          });
          _context11.next = 21;
          return regeneratorRuntime.awrap(Salary.find({
            email: {
              $in: emailList
            }
          }));

        case 21:
          clockRecords = _context11.sent;

          if (!(clockRecords.length === 0)) {
            _context11.next = 24;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'No clock records found for the sub-employees.'
          }));

        case 24:
          res.status(200).json(clockRecords);
          _context11.next = 31;
          break;

        case 27:
          _context11.prev = 27;
          _context11.t0 = _context11["catch"](0);
          console.error('Error:', _context11.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 31:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 27]]);
});
router.get('/subemployees/list', jwtMiddleware, function _callee12(req, res) {
  var authenticatedUser, employees;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          console.log('Authenticated User:');
          _context12.prev = 1;
          authenticatedUser = req.user;
          console.log('Authenticated User:', authenticatedUser);

          if (authenticatedUser) {
            _context12.next = 7;
            break;
          }

          console.error('Access denied: User not authenticated');
          return _context12.abrupt("return", res.status(403).json({
            error: 'Access denied: User not authenticated'
          }));

        case 7:
          if (!(authenticatedUser.role === 'admin')) {
            _context12.next = 14;
            break;
          }

          console.log('Admin Company Name:', authenticatedUser.adminCompanyName); // Fetch Subemployees based on adminCompanyName

          _context12.next = 11;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: authenticatedUser.adminCompanyName
          }));

        case 11:
          employees = _context12.sent;
          _context12.next = 18;
          break;

        case 14:
          console.log('Employee Company Name:', authenticatedUser.companyName);
          _context12.next = 17;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: authenticatedUser.adminCompanyName
          }));

        case 17:
          employees = _context12.sent;

        case 18:
          console.log('Employees:', employees);
          res.status(200).json(employees);
          _context12.next = 26;
          break;

        case 22:
          _context12.prev = 22;
          _context12.t0 = _context12["catch"](1);
          console.error('Error:', _context12.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 26:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[1, 22]]);
}); /////////////////// not is USE

router.get('/subemployee/list', function _callee13(req, res) {
  var employees;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(SubEmployee.find());

        case 3:
          employees = _context13.sent;
          console.log('Employees:', employees);
          res.status(200).json(employees);
          _context13.next = 12;
          break;

        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](0);
          console.error('Error:', _context13.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 12:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router["delete"]('/deleteProfilePicture/:id', function _callee14(req, res) {
  var employeeId, employee;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          employeeId = req.params.id; // Find the employee by ID

          _context14.next = 4;
          return regeneratorRuntime.awrap(Employee.findById(employeeId));

        case 4:
          employee = _context14.sent;

          if (employee) {
            _context14.next = 7;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            error: 'Employee not found'
          }));

        case 7:
          if (!employee.profilePicture) {
            _context14.next = 14;
            break;
          }

          // Update the employee record to set the profilePicture field to null
          employee.profilePicture = null;
          _context14.next = 11;
          return regeneratorRuntime.awrap(employee.save());

        case 11:
          res.status(200).json({
            message: 'Profile picture reference removed successfully'
          });
          _context14.next = 15;
          break;

        case 14:
          res.status(400).json({
            error: 'No profile picture to delete'
          });

        case 15:
          _context14.next = 21;
          break;

        case 17:
          _context14.prev = 17;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 21:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 17]]);
}); // Get company of Employee

router.get('/subemployees/company', jwtMiddleware, function _callee15(req, res) {
  var authenticatedUser, company;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          authenticatedUser = req.user;
          console.log('Authenticated User:', authenticatedUser);

          if (!(authenticatedUser.role !== 'admin')) {
            _context15.next = 5;
            break;
          }

          return _context15.abrupt("return", res.status(403).json({
            error: 'Access denied: Not an admin'
          }));

        case 5:
          _context15.next = 7;
          return regeneratorRuntime.awrap(Company.findOne({
            _id: authenticatedUser.adminUserId
          }));

        case 7:
          company = _context15.sent;

          if (company) {
            _context15.next = 10;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            error: 'Company not found'
          }));

        case 10:
          res.status(200).json(company);
          _context15.next = 17;
          break;

        case 13:
          _context15.prev = 13;
          _context15.t0 = _context15["catch"](0);
          console.error('Error:', _context15.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 13]]);
}); // Deactivate sub-employees

router.put('/subemployees/deactivate', jwtMiddleware, function _callee16(req, res) {
  var authenticatedUser, ids;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          authenticatedUser = req.user;
          ids = req.body.ids;

          if (!(!authenticatedUser || authenticatedUser.role !== 'admin')) {
            _context16.next = 5;
            break;
          }

          return _context16.abrupt("return", res.status(403).json({
            error: 'Access denied: User not authorized'
          }));

        case 5:
          _context16.next = 7;
          return regeneratorRuntime.awrap(SubEmployee.updateMany({
            _id: {
              $in: ids
            }
          }, {
            $set: {
              status: 'deactive'
            }
          }));

        case 7:
          res.status(200).json({
            message: 'Sub-employees deactivated successfully'
          });
          _context16.next = 14;
          break;

        case 10:
          _context16.prev = 10;
          _context16.t0 = _context16["catch"](0);
          console.error('Error:', _context16.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); // Activate sub-employees

router.put('/subemployees/activate', jwtMiddleware, function _callee17(req, res) {
  var authenticatedUser, ids;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          authenticatedUser = req.user;
          ids = req.body.ids;

          if (!(!authenticatedUser || authenticatedUser.role !== 'admin')) {
            _context17.next = 5;
            break;
          }

          return _context17.abrupt("return", res.status(403).json({
            error: 'Access denied: User not authorized'
          }));

        case 5:
          _context17.next = 7;
          return regeneratorRuntime.awrap(SubEmployee.updateMany({
            _id: {
              $in: ids
            }
          }, {
            $set: {
              status: 'active'
            }
          }));

        case 7:
          res.status(200).json({
            message: 'Sub-employees activated successfully'
          });
          _context17.next = 14;
          break;

        case 10:
          _context17.prev = 10;
          _context17.t0 = _context17["catch"](0);
          console.error('Error:', _context17.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;