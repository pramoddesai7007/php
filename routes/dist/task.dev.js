"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var _require = require('express-validator'),
    body = _require.body,
    validationResult = _require.validationResult;

var multer = require('multer');

var path = require('path');

var Task = require('../models/Task'); // Import your Task model


var SubEmployee = require('../models/SubEmployee');

var jwtMiddleware = require('../jwtmiddleware');

var Salary = require('../models/Salary');

var Notification = require('../models/Notification');

var Employee = require('../models/Employee');

var cron = require('node-cron');

var moment = require('moment');

cron.schedule('* * * * *', function _callee() {
  var currentDate, asiaTime, formattedCurrentTime, tasks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, task;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          currentDate = new Date();
          currentDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

          asiaTime = DateTime.now().setZone('Asia/Kolkata'); // const currentTime = asiaTime.toLocaleString(DateTime.TIME_SIMPLE).toUpperCase(); // Convert to upper case

          formattedCurrentTime = asiaTime.toFormat('hh:mm a'); // Format time as "01:02 PM"

          _context.next = 7;
          return regeneratorRuntime.awrap(Task.find({
            status: 'pending',
            $or: [{
              deadlineDate: {
                $lt: currentDate
              }
            }, {
              deadlineDate: currentDate,
              endTime: {
                $lte: formattedCurrentTime
              }
            }]
          }));

        case 7:
          tasks = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 11;
          _iterator = tasks[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 21;
            break;
          }

          task = _step.value;
          task.status = 'overdue';
          _context.next = 18;
          return regeneratorRuntime.awrap(task.save());

        case 18:
          _iteratorNormalCompletion = true;
          _context.next = 13;
          break;

        case 21:
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](11);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 27:
          _context.prev = 27;
          _context.prev = 28;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 30:
          _context.prev = 30;

          if (!_didIteratorError) {
            _context.next = 33;
            break;
          }

          throw _iteratorError;

        case 33:
          return _context.finish(30);

        case 34:
          return _context.finish(27);

        case 35:
          _context.next = 40;
          break;

        case 37:
          _context.prev = 37;
          _context.t1 = _context["catch"](0);
          console.error('Error updating overdue tasks:', _context.t1);

        case 40:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 37], [11, 23, 27, 35], [28,, 30, 34]]);
});
console.log('Task scheduler started.'); // Configure multer to use specific destinations for uploaded files

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    // Determine the destination folder based on the file type
    if (file.fieldname === 'pictures') {
      cb(null, 'uploads/pictures'); // Save pictures in the "pictures" folder
    } else if (file.fieldname === 'audio') {
      cb(null, 'uploads/audio'); // Save audio files in the "audio" folder
    } else if (file.fieldname === 'profilePicture') {
      cb(null, 'uploads/profile-pictures'); // Save profile pictures in the "profile-pictures" folder
    } else if (file.fieldname === 'imagePath') {
      cb(null, 'uploads/task-pictures'); // Save profile pictures in the "profile-pictures" folder
    } else {
      cb(new Error('Invalid file fieldname'));
    }
  },
  filename: function filename(req, file, cb) {
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
var upload = multer({
  storage: storage
});
router.put('/uploadProfileImage', upload.single('profilePicture'), jwtMiddleware, function _callee2(req, res) {
  var employeeEmail, update, employee;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          employeeEmail = req.user.email;
          update = {};

          if (req.file) {
            update.profilePicture = req.file.path;
          }

          _context2.next = 6;
          return regeneratorRuntime.awrap(SubEmployee.findOneAndUpdate({
            email: employeeEmail
          }, update, {
            "new": true
          }));

        case 6:
          employee = _context2.sent;

          if (employee) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'Employee not found'
          }));

        case 9:
          res.status(200).json({
            message: 'Profile picture updated',
            employee: employee
          });
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json(_context2.t0.message);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.put('/upload', jwtMiddleware, upload.single('profilePicture'), function _callee3(req, res) {
  var adminEmail, update, employee;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          adminEmail = req.user.email;
          update = {};

          if (req.file) {
            update.profilePicture = req.file.path;
          }

          console.log(adminEmail);
          _context3.next = 7;
          return regeneratorRuntime.awrap(Employee.findOneAndUpdate({
            email: adminEmail
          }, update, {
            "new": true
          }));

        case 7:
          employee = _context3.sent;

          if (employee) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Admin not found'
          }));

        case 12:
          res.status(200).json({
            message: 'Profile picture updated',
            employee: employee
          });
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json(_context3.t0.message);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.get('/profileIMG', jwtMiddleware, function _callee4(req, res) {
  var adminEmail, employee;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          adminEmail = req.user.email;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Employee.findOne({
            email: adminEmail
          }));

        case 4:
          employee = _context4.sent;

          if (employee) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Admin not found'
          }));

        case 7:
          res.status(200).json({
            message: 'Profile retrieved successfully',
            profilePicture: employee.profilePicture
          });
          _context4.next = 13;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.put('/uploadEmp', upload.single('profilePicture'), jwtMiddleware, function _callee5(req, res) {
  var employeeEmail, update, employee;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          employeeEmail = req.user.email;
          update = {};

          if (req.file) {
            update.profilePicture = req.file.path;
          }

          _context5.next = 6;
          return regeneratorRuntime.awrap(SubEmployee.findOneAndUpdate({
            email: employeeEmail
          }, update, {
            "new": true
          }));

        case 6:
          employee = _context5.sent;

          if (employee) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Employee not found'
          }));

        case 9:
          res.status(200).json({
            message: 'Profile picture updated',
            employee: employee
          });
          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json(_context5.t0.message);

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
~router.get('/taskCounts', jwtMiddleware, function _callee6(req, res) {
  var userId, currentDate, receivedTasks, completedTasks, pendingTasks, overdueTasks, todayAddedTasks, sendTasks, taskCounts;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.subEmployeeId; // Make sure you have the user ID available in the request

          currentDate = new Date(); // Get the current date
          // Fetch the counts from your database

          _context6.next = 5;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignTo: userId
          }));

        case 5:
          receivedTasks = _context6.sent;
          _context6.next = 8;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignTo: userId,
            status: 'completed'
          }));

        case 8:
          completedTasks = _context6.sent;
          _context6.next = 11;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignTo: userId,
            status: 'pending'
          }));

        case 11:
          pendingTasks = _context6.sent;
          _context6.next = 14;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignTo: userId,
            status: 'overdue'
          }));

        case 14:
          overdueTasks = _context6.sent;
          _context6.next = 17;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedByEmp: userId,
            startDate: new Date().toISOString().split('T')[0]
          }));

        case 17:
          todayAddedTasks = _context6.sent;
          _context6.next = 20;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedByEmp: userId
          }));

        case 20:
          sendTasks = _context6.sent;
          // Create an object to hold the task counts
          taskCounts = {
            receivedTasks: receivedTasks,
            completedTasks: completedTasks,
            pendingTasks: pendingTasks,
            overdueTasks: overdueTasks,
            todayAddedTasks: todayAddedTasks,
            sendTasks: sendTasks
          }; // Return the counts as JSON response
          // console.log(taskCounts)

          res.status(200).json(taskCounts);
          _context6.next = 29;
          break;

        case 25:
          _context6.prev = 25;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 29:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 25]]);
});
router.get('/adminTaskCounts', jwtMiddleware, function _callee7(req, res) {
  var adminId, userId, receivedTasks, totalEmployeeTasks, completedTasks, pendingTasks, overdueTasks, todayAddedTasks, sendTasks, adminTaskCounts;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          adminId = req.user.employeeId;
          userId = req.user.employeeId; // Modify this based on how your admin user is identified

          console.log(adminId);
          _context7.next = 6;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignTo: userId
          }));

        case 6:
          receivedTasks = _context7.sent;
          _context7.next = 9;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedBy: adminId
          }));

        case 9:
          totalEmployeeTasks = _context7.sent;
          _context7.next = 12;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedBy: adminId,
            status: 'completed'
          }));

        case 12:
          completedTasks = _context7.sent;
          _context7.next = 15;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedBy: adminId,
            status: 'pending'
          }));

        case 15:
          pendingTasks = _context7.sent;
          _context7.next = 18;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedBy: adminId,
            status: 'overdue'
          }));

        case 18:
          overdueTasks = _context7.sent;
          _context7.next = 21;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedBy: adminId,
            startDate: new Date().toISOString().split('T')[0]
          }));

        case 21:
          todayAddedTasks = _context7.sent;
          _context7.next = 24;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignedBy: adminId
          }));

        case 24:
          sendTasks = _context7.sent;
          adminTaskCounts = {
            receivedTasks: receivedTasks,
            totalEmployeeTasks: totalEmployeeTasks,
            completedTasks: completedTasks,
            pendingTasks: pendingTasks,
            overdueTasks: overdueTasks,
            todayAddedTasks: todayAddedTasks,
            sendTasks: sendTasks
          }; // Return the counts as JSON response

          res.status(200).json(adminTaskCounts);
          _context7.next = 33;
          break;

        case 29:
          _context7.prev = 29;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 33:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 29]]);
}); // Create Task API
// router.post('/create', upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), [
//   // Validation rules using express-validator
//   body('title').notEmpty().withMessage('Title is required'),
//   body('description').notEmpty().withMessage('Description is required'),
//   body('assignTo').isArray().withMessage('Assignees are required'),
//   body('startDate').notEmpty().withMessage('Start Date is required'),
//   body('deadlineDate').notEmpty().withMessage('Deadline Date is required'),
//   body('startTime').notEmpty().withMessage('Start Time is required'),
//   body('endTime').notEmpty().withMessage('End Time is required'),
// ], jwtMiddleware, async (req, res) => {
//   // Check for validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { title, description, startDate, startTime, deadlineDate, reminderDate, endTime, reminderTime, assignTo } = req.body;
//   console.log(req.body)
//   let picturePath; // Initialize picturePath as undefined
//   let audioPath; // Initialize audioPath as undefined
//   // Check if picture and audio files were included in the request
//   if (req.files && req.files.picture) {
//     picturePath = req.files.picture[0].path;
//   }
//   if (req.files && req.files.audio) {
//     audioPath = req.files.audio[0].path;
//   }
//   try {
//     const assignedBy = req.user.employeeId;
//     // Validate if the specified employees exist
//     const employees = await SubEmployee.find({ _id: { $in: assignTo } });
//     if (employees.length !== assignTo.length) {
//       const nonExistentEmployees = assignTo.filter(empId => !employees.map(emp => emp._id.toString()).includes(empId));
//       return res.status(404).json({ error: `Employees with IDs ${nonExistentEmployees.join(', ')} not found` });
//     }
//     const tasks = assignTo.map(assigneeId => {
//       const employee = employees.find(emp => emp._id.toString() === assigneeId);
//       return new Task({
//         title,
//         description,
//         startDate,
//         startTime,
//         deadlineDate,
//         reminderDate,
//         endTime,
//         reminderTime,
//         assignTo: employee._id,
//         assignedBy,
//         phoneNumber: employee.phoneNumber,
//         picture: picturePath,
//         audio: audioPath,
//       });
//     });
//     await Task.insertMany(tasks);
//     res.status(201).json({ message: 'Tasks created successfully', tasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// router.post('/create', upload.fields([
//   { name: 'picture', maxCount: 10 }, // Allow up to 10 pictures
//   { name: 'audio', maxCount: 1 }
// ]), [
//   // Validation rules using express-validator
//   body('title').notEmpty().withMessage('Title is required'),
//   body('description').notEmpty().withMessage('Description is required'),
//   body('assignTo').isArray().withMessage('Assignees are required'),
//   body('startDate').notEmpty().withMessage('Start Date is required'),
//   body('deadlineDate').notEmpty().withMessage('Deadline Date is required'),
//   body('startTime').notEmpty().withMessage('Start Time is required'),
//   body('endTime').notEmpty().withMessage('End Time is required'),
// ], jwtMiddleware, async (req, res) => {
//   // Check for validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { title, description, startDate, startTime, deadlineDate, reminderDate, endTime, reminderTime, assignTo } = req.body;
//   console.log(req.body);
//   let audioPath;
//   let picturePaths = []; // Initialize as an empty array for pictures
//   // Check if picture files were included in the request
//   if (req.files && req.files.picture) {
//     picturePaths = req.files.picture.map(file => file.path); // Store paths of all pictures
//   }
//   // Check if audio files were included in the request
//   if (req.files && req.files.audio) {
//     audioPath = req.files.audio[0].path;
//   }
//   try {
//     const assignedBy = req.user.employeeId;
//     // Validate if the specified employees exist
//     const employees = await SubEmployee.find({ _id: { $in: assignTo } });
//     if (employees.length !== assignTo.length) {
//       const nonExistentEmployees = assignTo.filter(empId => !employees.map(emp => emp._id.toString()).includes(empId));
//       return res.status(404).json({ error: `Employees with IDs ${nonExistentEmployees.join(', ')} not found` });
//     }
//     const tasks = assignTo.map(assigneeId => {
//       const employee = employees.find(emp => emp._id.toString() === assigneeId);
//       return new Task({
//         title,
//         description,
//         startDate,
//         startTime,
//         deadlineDate,
//         reminderDate,
//         endTime,
//         reminderTime,
//         assignTo: employee._id,
//         assignedBy,
//         phoneNumber: employee.phoneNumber,
//         pictures: picturePaths, // Save picture paths
//         audio: audioPath,
//       });
//     });
//     await Task.insertMany(tasks);
//     res.status(201).json({ message: 'Tasks created successfully', tasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// 

router.post('/uploadTaskImage', jwtMiddleware, upload.fields([{
  name: 'pictures',
  maxCount: 10
}]), function _callee8(req, res) {
  var errors, picturePaths;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          // Check if there are any errors in the uploaded files
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context8.next = 3;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          picturePaths = []; // Check if pictures are uploaded and process them

          if (!(req.files && req.files.pictures)) {
            _context8.next = 8;
            break;
          }

          picturePaths = req.files.pictures.map(function (file) {
            return file.path;
          });
          _context8.next = 9;
          break;

        case 8:
          return _context8.abrupt("return", res.status(400).json({
            error: 'No pictures uploaded'
          }));

        case 9:
          try {
            // Assume you need to save the image paths in the database or process them further
            // For demonstration, let's assume we're just returning the file paths
            res.status(201).json({
              message: 'Images uploaded successfully',
              pictures: picturePaths
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({
              error: 'Internal Server Error'
            });
          }

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  });
});
router.post('/createNewApproach', jwtMiddleware, [body('title').notEmpty().withMessage('Title is empty please fill'), body('description').notEmpty().withMessage('Description is required'), body('assignTo').isArray({
  min: 1
}).withMessage('Assignees are required'), body('startDate').notEmpty().withMessage('Start Date is required'), body('deadlineDate').notEmpty().withMessage('Deadline Date is required'), body('startTime').notEmpty().withMessage('Start Time is required'), body('endTime').notEmpty().withMessage('End Time is required')], function _callee9(req, res) {
  var errors, _req$body, title, description, startDate, startTime, deadlineDate, reminderDate, endTime, reminderTime, assignTo, status, pictures, audio, audioPath, picturePaths, assignedBy, employees, nonExistentEmployees, tasks, createdTasks, formattedResponse;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context9.next = 3;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body = req.body, title = _req$body.title, description = _req$body.description, startDate = _req$body.startDate, startTime = _req$body.startTime, deadlineDate = _req$body.deadlineDate, reminderDate = _req$body.reminderDate, endTime = _req$body.endTime, reminderTime = _req$body.reminderTime, assignTo = _req$body.assignTo, status = _req$body.status, pictures = _req$body.pictures, audio = _req$body.audio;
          audioPath = audio;
          picturePaths = Array.isArray(pictures) ? pictures : [pictures];
          _context9.prev = 6;
          assignedBy = req.user.employeeId;
          _context9.next = 10;
          return regeneratorRuntime.awrap(SubEmployee.find({
            _id: {
              $in: assignTo
            }
          }));

        case 10:
          employees = _context9.sent;

          if (!(employees.length !== assignTo.length)) {
            _context9.next = 14;
            break;
          }

          nonExistentEmployees = assignTo.filter(function (empId) {
            return !employees.map(function (emp) {
              return emp._id.toString();
            }).includes(empId);
          });
          return _context9.abrupt("return", res.status(404).json({
            error: "Employees with IDs ".concat(nonExistentEmployees.join(', '), " not found")
          }));

        case 14:
          tasks = assignTo.map(function (assigneeId) {
            var employee = employees.find(function (emp) {
              return emp._id.toString() === assigneeId;
            });
            return new Task({
              title: title,
              description: description,
              startDate: startDate,
              startTime: startTime,
              deadlineDate: deadlineDate,
              reminderDate: reminderDate,
              endTime: endTime,
              reminderTime: reminderTime,
              assignTo: employee._id,
              assignedBy: assignedBy,
              phoneNumber: employee.phoneNumber,
              pictures: picturePaths,
              audio: audioPath,
              status: status
            });
          });
          _context9.next = 17;
          return regeneratorRuntime.awrap(Task.insertMany(tasks));

        case 17:
          createdTasks = _context9.sent;
          // Format the response to include ObjectId in the specified format
          formattedResponse = createdTasks.map(function (task) {
            return {
              _id: {
                $oid: task._id.toString()
              },
              title: task.title,
              description: task.description,
              assignTo: task.assignTo.map(function (id) {
                return {
                  $oid: id.toString()
                };
              }),
              startDate: {
                $date: task.startDate.toISOString()
              },
              deadlineDate: {
                $date: task.deadlineDate.toISOString()
              },
              reminderDate: task.reminderDate ? {
                $date: task.reminderDate.toISOString()
              } : null,
              startTime: task.startTime,
              endTime: task.endTime,
              reminderTime: task.reminderTime,
              pictures: task.pictures,
              phoneNumber: task.phoneNumber,
              isRead: task.isRead,
              status: task.status,
              assignedBy: {
                $oid: task.assignedBy.toString()
              },
              empRemarkToList: task.empRemarkToList,
              remarkToList: task.remarkToList,
              __v: task.__v,
              createdAt: {
                $date: task.createdAt.toISOString()
              },
              updatedAt: {
                $date: task.updatedAt.toISOString()
              }
            };
          });
          res.status(201).json({
            message: 'Tasks created successfully',
            tasks: formattedResponse
          });
          _context9.next = 26;
          break;

        case 22:
          _context9.prev = 22;
          _context9.t0 = _context9["catch"](6);
          console.error(_context9.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 26:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[6, 22]]);
});
router.post('/create', jwtMiddleware, upload.fields([{
  name: '`pictures`',
  maxCount: 10
}, {
  name: 'audio',
  maxCount: 1
}]), [body('title').notEmpty().withMessage('Title is empty please fill'), body('description').notEmpty().withMessage('Description is required'), body('assignTo').isArray({
  min: 1
}).withMessage('Assignees are required'), body('startDate').notEmpty().withMessage('Start Date is required'), body('deadlineDate').notEmpty().withMessage('Deadline Date is required'), body('startTime').notEmpty().withMessage('Start Time is required'), body('endTime').notEmpty().withMessage('End Time is required')], function _callee10(req, res) {
  var errors, _req$body2, title, description, startDate, startTime, deadlineDate, reminderDate, endTime, reminderTime, assignTo, status, audioPath, picturePaths, assignedBy, employees, nonExistentEmployees, tasks, createdTasks, formattedResponse;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context10.next = 3;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, startDate = _req$body2.startDate, startTime = _req$body2.startTime, deadlineDate = _req$body2.deadlineDate, reminderDate = _req$body2.reminderDate, endTime = _req$body2.endTime, reminderTime = _req$body2.reminderTime, assignTo = _req$body2.assignTo, status = _req$body2.status;
          picturePaths = [];

          if (req.files && req.files.pictures) {
            picturePaths = req.files.pictures.map(function (file) {
              return file.path;
            });
          }

          if (req.files && req.files.audio) {
            audioPath = req.files.audio[0].path;
          }

          _context10.prev = 7;
          assignedBy = req.user.employeeId;
          _context10.next = 11;
          return regeneratorRuntime.awrap(SubEmployee.find({
            _id: {
              $in: assignTo
            }
          }));

        case 11:
          employees = _context10.sent;

          if (!(employees.length !== assignTo.length)) {
            _context10.next = 15;
            break;
          }

          nonExistentEmployees = assignTo.filter(function (empId) {
            return !employees.map(function (emp) {
              return emp._id.toString();
            }).includes(empId);
          });
          return _context10.abrupt("return", res.status(404).json({
            error: "Employees with IDs ".concat(nonExistentEmployees.join(', '), " not found")
          }));

        case 15:
          tasks = assignTo.map(function (assigneeId) {
            var employee = employees.find(function (emp) {
              return emp._id.toString() === assigneeId;
            });
            return new Task({
              title: title,
              description: description,
              startDate: startDate,
              startTime: startTime,
              deadlineDate: deadlineDate,
              reminderDate: reminderDate,
              endTime: endTime,
              reminderTime: reminderTime,
              assignTo: employee._id,
              assignedBy: assignedBy,
              phoneNumber: employee.phoneNumber,
              pictures: picturePaths,
              audio: audioPath,
              status: status
            });
          });
          _context10.next = 18;
          return regeneratorRuntime.awrap(Task.insertMany(tasks));

        case 18:
          createdTasks = _context10.sent;
          // Format the response to include ObjectId in the specified format
          formattedResponse = createdTasks.map(function (task) {
            return {
              _id: {
                $oid: task._id.toString()
              },
              title: task.title,
              description: task.description,
              assignTo: task.assignTo.map(function (id) {
                return {
                  $oid: id.toString()
                };
              }),
              startDate: {
                $date: task.startDate.toISOString()
              },
              deadlineDate: {
                $date: task.deadlineDate.toISOString()
              },
              reminderDate: task.reminderDate ? {
                $date: task.reminderDate.toISOString()
              } : null,
              startTime: task.startTime,
              endTime: task.endTime,
              reminderTime: task.reminderTime,
              pictures: task.pictures,
              phoneNumber: task.phoneNumber,
              isRead: task.isRead,
              status: task.status,
              assignedBy: {
                $oid: task.assignedBy.toString()
              },
              empRemarkToList: task.empRemarkToList,
              remarkToList: task.remarkToList,
              __v: task.__v,
              createdAt: {
                $date: task.createdAt.toISOString()
              },
              updatedAt: {
                $date: task.updatedAt.toISOString()
              }
            };
          });
          res.status(201).json({
            message: 'Tasks created successfully',
            tasks: formattedResponse
          });
          _context10.next = 27;
          break;

        case 23:
          _context10.prev = 23;
          _context10.t0 = _context10["catch"](7);
          console.error(_context10.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 27:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[7, 23]]);
});
router.post('/uploadAudio', jwtMiddleware, upload.single('audio'), [body('taskId').notEmpty().withMessage('Task ID is required')], function _callee11(req, res) {
  var errors, taskId, audioPath, task;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context11.next = 3;
            break;
          }

          return _context11.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          taskId = req.body.taskId;

          if (!req.file) {
            _context11.next = 8;
            break;
          }

          audioPath = req.file.path;
          _context11.next = 9;
          break;

        case 8:
          return _context11.abrupt("return", res.status(400).json({
            error: 'No audio file uploaded'
          }));

        case 9:
          _context11.prev = 9;
          _context11.next = 12;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 12:
          task = _context11.sent;

          if (task) {
            _context11.next = 15;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 15:
          // Update the task with the audio path
          task.audio = audioPath;
          _context11.next = 18;
          return regeneratorRuntime.awrap(task.save());

        case 18:
          res.status(200).json({
            message: 'Audio uploaded successfully',
            audioPath: audioPath
          });
          _context11.next = 25;
          break;

        case 21:
          _context11.prev = 21;
          _context11.t0 = _context11["catch"](9);
          console.error(_context11.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 25:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[9, 21]]);
});
router.post('/createSubemployeeTask', upload.fields([{
  name: 'pictures',
  maxCount: 10
}, {
  name: 'audio',
  maxCount: 1
}]), [// Validation rules using express-validator
body('title').notEmpty().withMessage('Title is required'), body('description').notEmpty().withMessage('Description is required'), body('assignTo').isArray({
  min: 1
}).withMessage('Assignees are required'), body('startDate').notEmpty().withMessage('Start Date is required'), body('deadlineDate').notEmpty().withMessage('Deadline Date is required'), body('startTime').notEmpty().withMessage('Start Time is required'), body('endTime').notEmpty().withMessage('End Time is required')], jwtMiddleware, function _callee12(req, res) {
  var errors, _req$body3, title, description, startDate, startTime, deadlineDate, reminderDate, reminderTime, endTime, assignTo, audioPath, picturePaths, assignedByEmp, employees, nonExistentEmployees, tasks;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context12.next = 3;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body3 = req.body, title = _req$body3.title, description = _req$body3.description, startDate = _req$body3.startDate, startTime = _req$body3.startTime, deadlineDate = _req$body3.deadlineDate, reminderDate = _req$body3.reminderDate, reminderTime = _req$body3.reminderTime, endTime = _req$body3.endTime, assignTo = _req$body3.assignTo;
          picturePaths = [];

          if (req.files && req.files.pictures) {
            picturePaths = req.files.pictures.map(function (file) {
              return file.path;
            });
          }

          if (req.files && req.files.audio) {
            audioPath = req.files.audio[0].path;
          }

          _context12.prev = 7;
          assignedByEmp = req.user.subEmployeeId;
          _context12.next = 11;
          return regeneratorRuntime.awrap(SubEmployee.find({
            _id: {
              $in: assignTo
            }
          }));

        case 11:
          employees = _context12.sent;

          if (!(employees.length !== assignTo.length)) {
            _context12.next = 15;
            break;
          }

          nonExistentEmployees = assignTo.filter(function (empId) {
            return !employees.map(function (emp) {
              return emp._id.toString();
            }).includes(empId);
          });
          return _context12.abrupt("return", res.status(404).json({
            error: "Employees with IDs ".concat(nonExistentEmployees.join(', '), " not found")
          }));

        case 15:
          tasks = assignTo.map(function (assigneeId) {
            var employee = employees.find(function (emp) {
              return emp._id.toString() === assigneeId;
            });
            return new Task({
              title: title,
              description: description,
              startDate: startDate,
              startTime: startTime,
              deadlineDate: deadlineDate,
              reminderDate: reminderDate,
              reminderTime: reminderTime,
              endTime: endTime,
              assignTo: employee._id,
              assignedByEmp: assignedByEmp,
              // phoneNumber: employee.phoneNumber,
              pictures: picturePaths,
              audio: audioPath
            });
          });
          _context12.next = 18;
          return regeneratorRuntime.awrap(Task.insertMany(tasks));

        case 18:
          res.status(201).json({
            message: 'Tasks created successfully',
            tasks: tasks
          });
          _context12.next = 25;
          break;

        case 21:
          _context12.prev = 21;
          _context12.t0 = _context12["catch"](7);
          console.error(_context12.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 25:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[7, 21]]);
});
router.get('/listNEW', jwtMiddleware, function _callee13(req, res) {
  var userId, _req$query, assignTo, startDate, endDate, adminCompanyName, subEmployees, subEmployeeIds, userCompany, companyAdmins, adminIds, taskFilter, tasks;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          userId = req.user.employeeId;
          _req$query = req.query, assignTo = _req$query.assignTo, startDate = _req$query.startDate, endDate = _req$query.endDate;
          adminCompanyName = req.user.adminCompanyName;
          _context13.next = 6;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 6:
          subEmployees = _context13.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          }); // Find the company ID associated with the given admin user ID

          _context13.next = 10;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 10:
          userCompany = _context13.sent;

          if (userCompany) {
            _context13.next = 13;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 13:
          _context13.next = 15;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 15:
          companyAdmins = _context13.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context13.next = 18;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 18:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          });
          taskFilter = {
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          }

          if (startDate || endDate) {
            taskFilter.$and = [];

            if (startDate) {
              taskFilter.$and.push({
                startDate: {
                  $gte: new Date(startDate)
                }
              });
            }

            if (endDate) {
              taskFilter.$and.push({
                deadlineDate: {
                  $lte: new Date(endDate)
                }
              });
            }
          }

          _context13.next = 24;
          return regeneratorRuntime.awrap(Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 24:
          tasks = _context13.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context13.next = 27;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            error: 'Tasks not found'
          }));

        case 27:
          // Send the list of tasks as a JSON response
          res.json({
            tasks: tasks
          });
          _context13.next = 34;
          break;

        case 30:
          _context13.prev = 30;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 34:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 30]]);
});
router.get('/list', jwtMiddleware, function _callee14(req, res) {
  var userId, _req$query2, assignTo, startDate, endDate, adminCompanyName, subEmployees, subEmployeeIds, userCompany, companyAdmins, adminIds, taskFilter, tasks;

  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          userId = req.user.employeeId;
          _req$query2 = req.query, assignTo = _req$query2.assignTo, startDate = _req$query2.startDate, endDate = _req$query2.endDate;
          adminCompanyName = req.user.adminCompanyName;
          _context14.next = 6;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 6:
          subEmployees = _context14.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          }); // Find the company ID associated with the given admin user ID

          _context14.next = 10;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 10:
          userCompany = _context14.sent;

          if (userCompany) {
            _context14.next = 13;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 13:
          _context14.next = 15;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 15:
          companyAdmins = _context14.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context14.next = 18;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 18:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          });
          taskFilter = {
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          }

          if (startDate || endDate) {
            taskFilter.$and = [];

            if (startDate) {
              taskFilter.$and.push({
                startDate: {
                  $gte: new Date(startDate)
                }
              });
            }

            if (endDate) {
              taskFilter.$and.push({
                deadlineDate: {
                  $lte: new Date(endDate)
                }
              });
            }
          } // Fetch tasks based on the filter


          _context14.next = 24;
          return regeneratorRuntime.awrap(Task.find(taskFilter));

        case 24:
          tasks = _context14.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context14.next = 27;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            error: 'Tasks not found'
          }));

        case 27:
          // Send the list of tasks as a JSON response
          res.json({
            tasks: tasks
          });
          _context14.next = 34;
          break;

        case 30:
          _context14.prev = 30;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 34:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 30]]);
});
router.get('/listTaskEmp', jwtMiddleware, function _callee15(req, res) {
  var userId, _req$query3, startDate, endDate, query, tasks;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.subEmployeeId; // Extract startDate and endDate from the query parameters

          _req$query3 = req.query, startDate = _req$query3.startDate, endDate = _req$query3.endDate; // Create a query object

          query = {
            assignTo: userId
          }; // Add date filters if provided

          if (startDate && endDate) {
            query = _objectSpread({}, query, {
              startDate: {
                $gte: new Date(startDate)
              },
              deadlineDate: {
                $lte: new Date(endDate)
              }
            });
          } // Find tasks matching the query


          _context15.next = 7;
          return regeneratorRuntime.awrap(Task.find(query).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 7:
          tasks = _context15.sent;

          if (!(tasks.length === 0)) {
            _context15.next = 10;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            error: 'No tasks found'
          }));

        case 10:
          // Send the list of tasks as a JSON response
          res.json({
            tasks: tasks
          });
          _context15.next = 17;
          break;

        case 13:
          _context15.prev = 13;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/:taskId', jwtMiddleware, function _callee16(req, res) {
  var taskId, task;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          taskId = req.params.taskId;
          _context16.next = 4;
          return regeneratorRuntime.awrap(Task.findById(taskId).populate('assignedBy', 'name').populate('assignedByEmp', 'name'));

        case 4:
          task = _context16.sent;

          if (task) {
            _context16.next = 7;
            break;
          }

          return _context16.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 7:
          res.status(200).json(task);
          _context16.next = 13;
          break;

        case 10:
          _context16.prev = 10;
          _context16.t0 = _context16["catch"](0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get('/tasks/active-users', function _callee17(req, res) {
  var sevenDaysAgo, activeEmployees, activeEmployeeDetails, uniqueEmployeeDetails;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          // Calculate the date 7 days ago
          sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          _context17.next = 5;
          return regeneratorRuntime.awrap(Task.aggregate([{
            $match: {
              assignedBy: {
                $exists: true
              },
              startDate: {
                $gt: sevenDaysAgo
              }
            }
          }, {
            $group: {
              _id: '$assignedBy',
              latestTaskStartDate: {
                $max: '$startDate'
              }
            }
          }, {
            $project: {
              _id: 0,
              employeeId: '$_id'
            }
          }]));

        case 5:
          activeEmployees = _context17.sent;

          if (!(!activeEmployees || activeEmployees.length === 0)) {
            _context17.next = 8;
            break;
          }

          return _context17.abrupt("return", res.status(200).json([]));

        case 8:
          _context17.next = 10;
          return regeneratorRuntime.awrap(Task.aggregate([{
            $match: {
              assignedBy: {
                $in: activeEmployees.map(function (emp) {
                  return emp.employeeId;
                })
              }
            }
          }, {
            $lookup: {
              from: 'employees',
              // The name of the Employee collection
              localField: 'assignedBy',
              foreignField: '_id',
              as: 'employeeDetails'
            }
          }, {
            $lookup: {
              from: 'subemployees',
              // The name of the SubEmployee collection
              localField: 'assignedBy',
              foreignField: '_id',
              as: 'subEmployeeDetails'
            }
          }, {
            $project: {
              employeeDetails: 1,
              subEmployeeDetails: 1
            }
          }]));

        case 10:
          activeEmployeeDetails = _context17.sent;
          uniqueEmployeeDetails = [];
          activeEmployeeDetails.forEach(function (entry) {
            var employee = entry.employeeDetails[0] || {};
            var subEmployee = entry.subEmployeeDetails[0] || {};
            var existingEntry = uniqueEmployeeDetails.find(function (item) {
              return item.email === (employee.email || subEmployee.email);
            });

            if (!existingEntry) {
              uniqueEmployeeDetails.push({
                name: employee.name || subEmployee.name,
                phoneNumber: employee.phoneNumber || subEmployee.phoneNumber,
                email: employee.email || subEmployee.email,
                adminCompanyName: employee.adminCompanyName || subEmployee.adminCompanyName
              });
            }
          });
          res.status(200).json(uniqueEmployeeDetails);
          _context17.next = 20;
          break;

        case 16:
          _context17.prev = 16;
          _context17.t0 = _context17["catch"](0);
          console.error(_context17.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 20:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.get('/tasks/inactive-users', function _callee18(req, res) {
  var sevenDaysAgo, activeEmployees, allEmployeeDetails, allSubEmployeeDetails, allEmployeeAndSubEmployeeDetails, uniqueEmployeeAndSubEmployeeDetails, uniqueEmails, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, entry, email, inactiveEmployees;

  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          _context18.next = 5;
          return regeneratorRuntime.awrap(Task.aggregate([{
            $match: {
              assignedBy: {
                $exists: true
              },
              startDate: {
                $lt: sevenDaysAgo
              }
            }
          }, {
            $group: {
              _id: '$assignedBy',
              latestTaskStartDate: {
                $max: '$startDate'
              }
            }
          }, {
            $project: {
              _id: 0,
              employeeId: '$_id',
              latestTaskStartDate: 1
            }
          }]));

        case 5:
          activeEmployees = _context18.sent;
          _context18.next = 8;
          return regeneratorRuntime.awrap(Employee.aggregate([{
            $lookup: {
              from: 'tasks',
              localField: '_id',
              foreignField: 'assignedBy',
              as: 'assignedTasks'
            }
          }, {
            $project: {
              name: 1,
              phoneNumber: 1,
              email: 1,
              adminCompanyName: 1,
              assignedTasks: 1
            }
          }]));

        case 8:
          allEmployeeDetails = _context18.sent;
          _context18.next = 11;
          return regeneratorRuntime.awrap(SubEmployee.aggregate([{
            $lookup: {
              from: 'tasks',
              localField: '_id',
              foreignField: 'assignedBy',
              as: 'assignedTasks'
            }
          }, {
            $project: {
              name: 1,
              phoneNumber: 1,
              email: 1,
              adminCompanyName: 1,
              assignedTasks: 1
            }
          }]));

        case 11:
          allSubEmployeeDetails = _context18.sent;
          allEmployeeAndSubEmployeeDetails = [].concat(_toConsumableArray(allEmployeeDetails), _toConsumableArray(allSubEmployeeDetails));
          uniqueEmployeeAndSubEmployeeDetails = [];
          uniqueEmails = new Set();
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context18.prev = 18;

          for (_iterator2 = allEmployeeAndSubEmployeeDetails[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            entry = _step2.value;
            email = entry.email;

            if (!uniqueEmails.has(email)) {
              uniqueEmployeeAndSubEmployeeDetails.push(entry);
              uniqueEmails.add(email);
            }
          }

          _context18.next = 26;
          break;

        case 22:
          _context18.prev = 22;
          _context18.t0 = _context18["catch"](18);
          _didIteratorError2 = true;
          _iteratorError2 = _context18.t0;

        case 26:
          _context18.prev = 26;
          _context18.prev = 27;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 29:
          _context18.prev = 29;

          if (!_didIteratorError2) {
            _context18.next = 32;
            break;
          }

          throw _iteratorError2;

        case 32:
          return _context18.finish(29);

        case 33:
          return _context18.finish(26);

        case 34:
          inactiveEmployees = uniqueEmployeeAndSubEmployeeDetails.filter(function (entry) {
            var assignedTasks = entry.assignedTasks || [];
            var latestTaskStartDate = Math.max.apply(Math, _toConsumableArray(assignedTasks.map(function (task) {
              return new Date(task.startDate);
            })));
            return !latestTaskStartDate || latestTaskStartDate < sevenDaysAgo;
          });
          res.status(200).json(inactiveEmployees);
          _context18.next = 42;
          break;

        case 38:
          _context18.prev = 38;
          _context18.t1 = _context18["catch"](0);
          console.error(_context18.t1);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 42:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 38], [18, 22, 26, 34], [27,, 29, 33]]);
});
router.get('/tasks/pendingNEW/', jwtMiddleware, function _callee19(req, res) {
  var userId, _req$query4, assignTo, startDate, endDate, adminCompanyName, employeeId, userCompany, filter, _tasks, subEmployees, subEmployeeIds, companyAdmins, adminIds, taskFilter, tasks;

  return regeneratorRuntime.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          userId = req.user.employeeId;
          _req$query4 = req.query, assignTo = _req$query4.assignTo, startDate = _req$query4.startDate, endDate = _req$query4.endDate;
          adminCompanyName = req.user.adminCompanyName;
          employeeId = req.user.subEmployeeId;
          console.log(userId);
          console.log(employeeId); // Find the user's company

          _context19.next = 9;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 9:
          userCompany = _context19.sent;

          if (userCompany) {
            _context19.next = 18;
            break;
          }

          // If userCompany is not found, look for tasks assigned to this employee
          filter = {
            assignTo: employeeId,
            status: 'pending'
          };
          _context19.next = 14;
          return regeneratorRuntime.awrap(Task.find(filter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 14:
          _tasks = _context19.sent;

          if (!(!_tasks || _tasks.length === 0)) {
            _context19.next = 17;
            break;
          }

          return _context19.abrupt("return", res.status(200).json({
            status: 0,
            message: 'No pending tasks found for this employee',
            tasks: _tasks
          }));

        case 17:
          return _context19.abrupt("return", res.status(200).json({
            status: 1,
            message: 'Successfully fetched pending tasks',
            tasks: _tasks
          }));

        case 18:
          _context19.next = 20;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 20:
          subEmployees = _context19.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          });
          _context19.next = 24;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 24:
          companyAdmins = _context19.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context19.next = 27;
            break;
          }

          return _context19.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 27:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          }); // Create the task filter

          taskFilter = {
            status: 'pending',
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          }; // Filter by assignTo if provided

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          } // Add date filters if provided


          if (startDate || endDate) {
            taskFilter.$and = [];

            if (startDate) {
              taskFilter.$and.push({
                startDate: {
                  $gte: new Date(startDate)
                }
              });
            }

            if (endDate) {
              taskFilter.$and.push({
                deadlineDate: {
                  $lte: new Date(endDate)
                }
              });
            }
          } // Find the tasks based on the filter


          _context19.next = 33;
          return regeneratorRuntime.awrap(Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 33:
          tasks = _context19.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context19.next = 36;
            break;
          }

          return _context19.abrupt("return", res.status(200).json({
            status: 0,
            message: 'No pending tasks found ',
            tasks: tasks
          }));

        case 36:
          return _context19.abrupt("return", res.status(200).json({
            status: 0,
            message: ' pending tasks',
            tasks: tasks
          }));

        case 39:
          _context19.prev = 39;
          _context19.t0 = _context19["catch"](0);
          console.error(_context19.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 43:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 39]]);
});
router.get('/tasks/count', jwtMiddleware, function _callee20(req, res) {
  var employeeId, employeeExists, totalTasks, pendingTasks, allTasks, pendingTaskList, completedTaskList;
  return regeneratorRuntime.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          // const employeeId = req.params.employeeId;
          employeeId = req.user.employeeId; // Validate if the employee exists

          _context20.next = 4;
          return regeneratorRuntime.awrap(Employee.findById(employeeId));

        case 4:
          employeeExists = _context20.sent;

          if (employeeExists) {
            _context20.next = 7;
            break;
          }

          return _context20.abrupt("return", res.status(404).json({
            message: 'Employee not found'
          }));

        case 7:
          _context20.next = 9;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignTo: employeeId
          }));

        case 9:
          totalTasks = _context20.sent;
          _context20.next = 12;
          return regeneratorRuntime.awrap(Task.countDocuments({
            assignTo: employeeId,
            status: 'pending'
          }));

        case 12:
          pendingTasks = _context20.sent;
          _context20.next = 15;
          return regeneratorRuntime.awrap(Task.find({
            assignTo: employeeId
          }).populate('assignedBy', 'name').populate('assignTo', 'name').sort({
            deadlineDate: 1
          }));

        case 15:
          allTasks = _context20.sent;
          // Separate pending and completed tasks
          pendingTaskList = allTasks.filter(function (task) {
            return task.status === 'pending';
          });
          completedTaskList = allTasks.filter(function (task) {
            return task.status === 'completed';
          }); // Send the result back to the client

          res.status(200).json({
            employeeId: employeeId,
            totalTasks: totalTasks,
            pendingTasks: pendingTasks,
            pendingTaskList: pendingTaskList,
            completedTaskList: completedTaskList
          });
          _context20.next = 25;
          break;

        case 21:
          _context20.prev = 21;
          _context20.t0 = _context20["catch"](0);
          console.error('Error fetching task data:', _context20.t0);
          res.status(500).json({
            message: 'Server Error'
          });

        case 25:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
router.get('/tasks/pending', jwtMiddleware, function _callee21(req, res) {
  var userId, _req$query5, assignTo, startDate, endDate, adminCompanyName, subEmployees, subEmployeeIds, userCompany, companyAdmins, adminIds, taskFilter, tasks;

  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          userId = req.user.employeeId;
          _req$query5 = req.query, assignTo = _req$query5.assignTo, startDate = _req$query5.startDate, endDate = _req$query5.endDate;
          adminCompanyName = req.user.adminCompanyName; // Find sub-employees of the same company

          _context21.next = 6;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 6:
          subEmployees = _context21.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          }); // Find the company ID associated with the given admin user ID

          _context21.next = 10;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 10:
          userCompany = _context21.sent;

          if (userCompany) {
            _context21.next = 13;
            break;
          }

          return _context21.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 13:
          _context21.next = 15;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 15:
          companyAdmins = _context21.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context21.next = 18;
            break;
          }

          return _context21.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 18:
          // Get an array of admin IDs from the found company admins
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          }); // Create a filter object for the task query

          taskFilter = {
            status: 'pending',
            // Filter for pending tasks
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          }; // Add assignTo filter if provided

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          } // Add date filters if provided


          if (startDate || endDate) {
            taskFilter.$and = [];

            if (startDate) {
              taskFilter.$and.push({
                startDate: {
                  $gte: new Date(startDate)
                }
              });
            }

            if (endDate) {
              taskFilter.$and.push({
                deadlineDate: {
                  $lte: new Date(endDate)
                }
              });
            }
          } // Fetch pending tasks based on the filter


          _context21.next = 24;
          return regeneratorRuntime.awrap(Task.find(taskFilter));

        case 24:
          tasks = _context21.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context21.next = 27;
            break;
          }

          return _context21.abrupt("return", res.status(404).json({
            error: 'Pending tasks not found'
          }));

        case 27:
          // Send the list of pending tasks as a JSON response
          res.status(200).json({
            tasks: tasks
          });
          _context21.next = 34;
          break;

        case 30:
          _context21.prev = 30;
          _context21.t0 = _context21["catch"](0);
          console.error(_context21.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 34:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 30]]);
}); // router.get('/tasks/pending', jwtMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.employeeId;
//     const { assignTo, startDate, endDate } = req.query;
//     // Create a filter object for the pending tasks query
//     let taskFilter = {
//       status: 'pending',
//       assignedBy: userId
//     };
//     // Add assignedTo filter if provided
//     if (assignTo) {
//       taskFilter.assignTo = { $in: [assignTo] };
//     }
//     // Add date filters if provided
//     if (startDate || endDate) {
//       taskFilter.$and = [];
//       if (startDate) {
//         taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
//       }
//       if (endDate) {
//         taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
//       }
//     }
//     // Fetch pending tasks based on the filter
//     const pendingTasks = await Task.find(taskFilter);
//     // Send the list of pending tasks as a JSON response
//     res.json({ pendingTasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
//  Get pending task to Employee
// router.get('/tasks/pending', jwtMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.employeeId;
//     const { assignTo, startDate, endDate } = req.query;
//     // Create a filter object for the pending tasks query
//     let taskFilter = {
//       status: 'pending',
//       assignedBy: userId
//     };
//     // Add assignedTo filter if provided
//     if (assignTo) {
//       taskFilter.assignTo = { $in: [assignTo] };
//     }
//     // Add date filters if provided
//     if (startDate || endDate) {
//       taskFilter.$and = [];
//       if (startDate) {
//         taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
//       }
//       if (endDate) {
//         taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
//       }
//     }
//     // Fetch pending tasks based on the filter
//     const pendingTasks = await Task.find(taskFilter);
//     // Send the list of pending tasks as a JSON response
//     res.json({ pendingTasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
//  Get pending task to Employee

router.get('/tasks/pendingByEmp', jwtMiddleware, function _callee22(req, res) {
  var userId, tasks;
  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin

          _context22.next = 4;
          return regeneratorRuntime.awrap(Task.find({
            assignTo: userId,
            status: 'pending'
          }).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 4:
          tasks = _context22.sent;
          ;

          if (tasks) {
            _context22.next = 8;
            break;
          }

          return _context22.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 8:
          res.status(200).json(tasks);
          _context22.next = 14;
          break;

        case 11:
          _context22.prev = 11;
          _context22.t0 = _context22["catch"](0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/tasks/pendingByEmpNEW', jwtMiddleware, function _callee23(req, res) {
  var userId, tasks;
  return regeneratorRuntime.async(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin

          _context23.next = 4;
          return regeneratorRuntime.awrap(Task.find({
            assignTo: userId,
            status: 'pending'
          }));

        case 4:
          tasks = _context23.sent;

          if (tasks) {
            _context23.next = 7;
            break;
          }

          return _context23.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 7:
          res.status(200).json(tasks);
          _context23.next = 13;
          break;

        case 10:
          _context23.prev = 10;
          _context23.t0 = _context23["catch"](0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.put('/complete/:taskId', upload.single('imagePath'), function _callee26(req, res) {
  var taskId, update, task;
  return regeneratorRuntime.async(function _callee26$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          taskId = req.params.taskId;
          _context26.prev = 1;
          update = {
            status: 'completed'
          };

          if (req.file) {
            update.imagePath = req.file.path;
          }

          _context26.next = 6;
          return regeneratorRuntime.awrap(Task.findByIdAndUpdate(taskId, update, {
            "new": true
          }));

        case 6:
          task = _context26.sent;
          router.get('/tasks/pendingByEmp', jwtMiddleware, function _callee24(req, res) {
            var userId, tasks;
            return regeneratorRuntime.async(function _callee24$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    _context24.prev = 0;
                    userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin

                    _context24.next = 4;
                    return regeneratorRuntime.awrap(Task.find({
                      assignTo: userId,
                      status: 'pending'
                    }));

                  case 4:
                    tasks = _context24.sent;

                    if (tasks) {
                      _context24.next = 7;
                      break;
                    }

                    return _context24.abrupt("return", res.status(404).json({
                      error: 'Task not found'
                    }));

                  case 7:
                    res.status(200).json(tasks);
                    _context24.next = 13;
                    break;

                  case 10:
                    _context24.prev = 10;
                    _context24.t0 = _context24["catch"](0);
                    res.status(500).json({
                      error: 'Internal Server Error'
                    });

                  case 13:
                  case "end":
                    return _context24.stop();
                }
              }
            }, null, null, [[0, 10]]);
          });
          router.get('/tasks/pendingByEmpNew', jwtMiddleware, function _callee25(req, res) {
            var userId, tasks;
            return regeneratorRuntime.async(function _callee25$(_context25) {
              while (1) {
                switch (_context25.prev = _context25.next) {
                  case 0:
                    _context25.prev = 0;
                    userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin
                    // const tasks = await Task.find({ assignTo: userId, status: 'pending' });

                    _context25.next = 4;
                    return regeneratorRuntime.awrap(Task.find({
                      assignTo: userId,
                      status: 'pending'
                    }).populate('assignTo', 'name'));

                  case 4:
                    tasks = _context25.sent;

                    if (tasks) {
                      _context25.next = 7;
                      break;
                    }

                    return _context25.abrupt("return", res.status(404).json({
                      error: 'Task not found'
                    }));

                  case 7:
                    res.status(200).json(tasks);
                    _context25.next = 13;
                    break;

                  case 10:
                    _context25.prev = 10;
                    _context25.t0 = _context25["catch"](0);
                    res.status(500).json({
                      error: 'Internal Server Error'
                    });

                  case 13:
                  case "end":
                    return _context25.stop();
                }
              }
            }, null, null, [[0, 10]]);
          });

          if (task) {
            _context26.next = 11;
            break;
          }

          return _context26.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 11:
          res.status(200).json({
            message: 'Task marked as complete',
            task: task
          });
          _context26.next = 17;
          break;

        case 14:
          _context26.prev = 14;
          _context26.t0 = _context26["catch"](1);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context26.stop();
      }
    }
  }, null, null, [[1, 14]]);
}); // router.get('/tasks/completed', jwtMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.employeeId;
//     // Find all tasks with a status of 'completed'
//     const completedTasks = await Task.find({ status: 'completed', assignedBy: userId });
//     // Send the list of completed tasks as a JSON response
//     res.json({ completedTasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// router.get('/tasks/completed', jwtMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.employeeId;
//     const { assignTo, startDate, endDate } = req.query;
//     // Create a filter object for the completed tasks query
//     let taskFilter = {
//       status: 'completed',
//       assignedBy: userId
//     };
//     // Add assignedTo filter if provided
//     if (assignTo) {
//       taskFilter.assignTo = { $in: [assignTo] };
//     }
//     // Add date filters if provided
//     if (startDate || endDate) {
//       taskFilter.$and = [];
//       if (startDate) {
//         taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
//       }
//       if (endDate) {
//         taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
//       }
//     }
//     // Fetch completed tasks based on the filter
//     const completedTasks = await Task.find(taskFilter);
//     console.log(completedTasks)
//     // Send the list of completed tasks as a JSON response
//     res.json({ completedTasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/tasks/completed', jwtMiddleware, function _callee27(req, res) {
  var userId, _req$query6, assignTo, startDate, endDate, adminCompanyName, employees, subEmployees, allEmployeeIds, userCompany, companyAdmins, adminIds, taskFilter, completedTasks;

  return regeneratorRuntime.async(function _callee27$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          _context27.prev = 0;
          userId = req.user.employeeId;
          _req$query6 = req.query, assignTo = _req$query6.assignTo, startDate = _req$query6.startDate, endDate = _req$query6.endDate;
          adminCompanyName = req.user.adminCompanyName; // Find employees and sub-employees of the same company

          _context27.next = 6;
          return regeneratorRuntime.awrap(Employee.find({
            adminCompanyName: adminCompanyName
          }));

        case 6:
          employees = _context27.sent;
          _context27.next = 9;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 9:
          subEmployees = _context27.sent;
          allEmployeeIds = [].concat(_toConsumableArray(employees.map(function (employee) {
            return employee._id;
          })), _toConsumableArray(subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          }))); // Find the company ID associated with the given admin user ID

          _context27.next = 13;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 13:
          userCompany = _context27.sent;

          if (userCompany) {
            _context27.next = 16;
            break;
          }

          return _context27.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 16:
          _context27.next = 18;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 18:
          companyAdmins = _context27.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context27.next = 21;
            break;
          }

          return _context27.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 21:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          });
          taskFilter = {
            status: 'completed',
            $or: [{
              assignedByEmp: {
                $in: allEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          }

          if (startDate || endDate) {
            taskFilter.$and = [];

            if (startDate) {
              taskFilter.$and.push({
                startDate: {
                  $gte: new Date(startDate)
                }
              });
            }

            if (endDate) {
              taskFilter.$and.push({
                deadlineDate: {
                  $lte: new Date(endDate)
                }
              });
            }
          }

          _context27.next = 27;
          return regeneratorRuntime.awrap(Task.find(taskFilter));

        case 27:
          completedTasks = _context27.sent;

          if (!(!completedTasks || completedTasks.length === 0)) {
            _context27.next = 30;
            break;
          }

          return _context27.abrupt("return", res.status(404).json({
            error: 'Completed tasks not found'
          }));

        case 30:
          res.status(200).json({
            completedTasks: completedTasks
          });
          _context27.next = 37;
          break;

        case 33:
          _context27.prev = 33;
          _context27.t0 = _context27["catch"](0);
          console.error(_context27.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 37:
        case "end":
          return _context27.stop();
      }
    }
  }, null, null, [[0, 33]]);
});
router.get('/tasks/completedNew', jwtMiddleware, function _callee28(req, res) {
  var userId, _req$query7, assignTo, startDate, endDate, adminCompanyName, employeeId, employees, subEmployees, allEmployeeIds, userCompany, filter, tasks, companyAdmins, adminIds, taskFilter, completedTasks;

  return regeneratorRuntime.async(function _callee28$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          _context28.prev = 0;
          userId = req.user.employeeId;
          _req$query7 = req.query, assignTo = _req$query7.assignTo, startDate = _req$query7.startDate, endDate = _req$query7.endDate;
          adminCompanyName = req.user.adminCompanyName;
          employeeId = req.user.subEmployeeId;
          console.log(userId);
          console.log(employeeId); // Find employees and sub-employees of the same company

          _context28.next = 9;
          return regeneratorRuntime.awrap(Employee.find({
            adminCompanyName: adminCompanyName
          }));

        case 9:
          employees = _context28.sent;
          _context28.next = 12;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 12:
          subEmployees = _context28.sent;
          allEmployeeIds = [].concat(_toConsumableArray(employees.map(function (employee) {
            return employee._id;
          })), _toConsumableArray(subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          }))); // Find the company ID associated with the given admin user ID

          _context28.next = 16;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 16:
          userCompany = _context28.sent;

          if (userCompany) {
            _context28.next = 25;
            break;
          }

          // If userCompany is not found, look for tasks assigned to this employee
          filter = {
            assignTo: employeeId,
            status: 'completed'
          };
          _context28.next = 21;
          return regeneratorRuntime.awrap(Task.find(filter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 21:
          tasks = _context28.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context28.next = 24;
            break;
          }

          return _context28.abrupt("return", res.status(200).json({
            status: 0,
            message: 'No pending tasks found for this employee',
            tasks: tasks
          }));

        case 24:
          return _context28.abrupt("return", res.status(200).json({
            status: 1,
            message: 'Successfully fetched pending tasks',
            tasks: tasks
          }));

        case 25:
          _context28.next = 27;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 27:
          companyAdmins = _context28.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context28.next = 30;
            break;
          }

          return _context28.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 30:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          });
          taskFilter = {
            status: 'completed',
            $or: [{
              assignedByEmp: {
                $in: allEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          }

          if (startDate || endDate) {
            taskFilter.$and = [];

            if (startDate) {
              taskFilter.$and.push({
                startDate: {
                  $gte: new Date(startDate)
                }
              });
            }

            if (endDate) {
              taskFilter.$and.push({
                deadlineDate: {
                  $lte: new Date(endDate)
                }
              });
            }
          }

          _context28.next = 36;
          return regeneratorRuntime.awrap(Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 36:
          completedTasks = _context28.sent;

          if (!(!completedTasks || completedTasks.length === 0)) {
            _context28.next = 39;
            break;
          }

          return _context28.abrupt("return", res.status(200).json({
            status: 0,
            message: 'No pending tasks found for this employee',
            completedTasks: completedTasks
          }));

        case 39:
          return _context28.abrupt("return", res.status(200).json({
            status: 1,
            message: 'Successfully fetched pending tasks',
            completedTasks: completedTasks
          }));

        case 42:
          _context28.prev = 42;
          _context28.t0 = _context28["catch"](0);
          console.error(_context28.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 46:
        case "end":
          return _context28.stop();
      }
    }
  }, null, null, [[0, 42]]);
}); // List of all completed task to Employee
// router.get('/tasks/completedByEmp', jwtMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.subEmployeeId;
//     // Find all tasks with a status of 'completed'
//     const completedTasks = await Task.find({ status: 'completed', assignTo: userId });
//     // Send the list of completed tasks as a JSON response
//     res.json({ completedTasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/tasks/completedByEmp', jwtMiddleware, function _callee29(req, res) {
  var userId, _req$query8, startDate, endDate, query, completedTasks;

  return regeneratorRuntime.async(function _callee29$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _context29.prev = 0;
          userId = req.user.subEmployeeId; // Extract startDate and endDate from the query parameters

          _req$query8 = req.query, startDate = _req$query8.startDate, endDate = _req$query8.endDate; // Create a query object

          query = {
            status: 'completed',
            assignTo: userId
          }; // Add date filters if provided

          if (startDate && endDate) {
            query = _objectSpread({}, query, {
              startDate: {
                $gte: new Date(startDate)
              },
              deadlineDate: {
                $lte: new Date(endDate)
              }
            });
          } // Find tasks matching the query


          _context29.next = 7;
          return regeneratorRuntime.awrap(Task.find(query));

        case 7:
          completedTasks = _context29.sent;

          if (!(completedTasks.length === 0)) {
            _context29.next = 10;
            break;
          }

          return _context29.abrupt("return", res.status(404).json({
            error: 'No tasks found'
          }));

        case 10:
          // Send the list of completed tasks as a JSON response
          res.json({
            completedTasks: completedTasks
          });
          _context29.next = 17;
          break;

        case 13:
          _context29.prev = 13;
          _context29.t0 = _context29["catch"](0);
          console.error(_context29.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context29.stop();
      }
    }
  }, null, null, [[0, 13]]);
}); // mark as open for Admin

router.put('/open/:taskId', jwtMiddleware, function _callee30(req, res) {
  var taskId, updates, task;
  return regeneratorRuntime.async(function _callee30$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          taskId = req.params.taskId;
          updates = req.body;
          _context30.prev = 2;
          _context30.next = 5;
          return regeneratorRuntime.awrap(Task.findByIdAndUpdate(taskId, updates, {
            "new": true
          }));

        case 5:
          task = _context30.sent;

          if (task) {
            _context30.next = 8;
            break;
          }

          return _context30.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 8:
          // Check if you need to update the status to "pending"
          if (req.body.startDate !== task.startDate || req.body.deadlineDate !== task.deadlineDate || req.body.assignTo !== task.assignTo) {
            task.status = 'pending';
          } // Save the updated task


          _context30.next = 11;
          return regeneratorRuntime.awrap(task.save());

        case 11:
          return _context30.abrupt("return", res.status(200).json({
            message: 'Task updated',
            task: task
          }));

        case 14:
          _context30.prev = 14;
          _context30.t0 = _context30["catch"](2);
          console.error(_context30.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context30.stop();
      }
    }
  }, null, null, [[2, 14]]);
});
router.put('/edit/:taskId', jwtMiddleware, upload.fields([{
  name: 'pictures',
  maxCount: 10
}, {
  name: 'audio',
  maxCount: 1
}]), function _callee31(req, res) {
  var taskId, updatedTaskData, task, key, newPictures, newTask;
  return regeneratorRuntime.async(function _callee31$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          _context31.prev = 0;
          taskId = req.params.taskId;
          updatedTaskData = JSON.parse(req.body.taskData);
          _context31.next = 5;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 5:
          task = _context31.sent;

          if (task) {
            _context31.next = 8;
            break;
          }

          return _context31.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 8:
          if (!(task.assignedBy.toString() !== req.user.employeeId)) {
            _context31.next = 10;
            break;
          }

          return _context31.abrupt("return", res.status(403).json({
            error: 'Unauthorized: You are not the creator of this task'
          }));

        case 10:
          // Update task data except for pictures and audio
          for (key in updatedTaskData) {
            if (Object.prototype.hasOwnProperty.call(updatedTaskData, key) && key !== 'pictures') {
              task[key] = updatedTaskData[key];
            }
          } // Update pictures array with the updatedTaskData


          task.pictures = updatedTaskData.pictures || []; // Check if new picture files were uploaded and add them to the task's pictures field

          if (req.files['pictures']) {
            newPictures = req.files['pictures'].map(function (file) {
              return "uploads/pictures/".concat(file.filename);
            });
            task.pictures = task.pictures.concat(newPictures);
          } // Check if a new audio file was uploaded and update the task's audio field


          if (req.files['audio']) {
            task.audio = "uploads/audio/".concat(req.files['audio'][0].filename);
          }

          _context31.next = 16;
          return regeneratorRuntime.awrap(task.save());

        case 16:
          newTask = _context31.sent;
          console.log(newTask);
          res.status(200).json({
            message: 'Task updated successfully',
            newTask: newTask
          });
          _context31.next = 25;
          break;

        case 21:
          _context31.prev = 21;
          _context31.t0 = _context31["catch"](0);
          console.error(_context31.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 25:
        case "end":
          return _context31.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
router.put('/editEmp/:taskId', jwtMiddleware, upload.fields([{
  name: 'pictures',
  maxCount: 10
}, {
  name: 'audio',
  maxCount: 1
}]), function _callee32(req, res) {
  var taskId, updatedTaskData, task, key, newPictures, newTask;
  return regeneratorRuntime.async(function _callee32$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          _context32.prev = 0;
          taskId = req.params.taskId; // console.log('Received taskId:', taskId); // Add this line to log the received taskId

          updatedTaskData = JSON.parse(req.body.taskData); // Extract the task data from the JSON string
          // Retrieve the task by its ID from the database

          _context32.next = 5;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 5:
          task = _context32.sent;

          if (task) {
            _context32.next = 8;
            break;
          }

          return _context32.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 8:
          if (!(task.assignedByEmp.toString() !== req.user.subEmployeeId)) {
            _context32.next = 10;
            break;
          }

          return _context32.abrupt("return", res.status(403).json({
            error: 'Unauthorized: You are not the creator of this task'
          }));

        case 10:
          // Update task data except for picture
          for (key in updatedTaskData) {
            if (Object.prototype.hasOwnProperty.call(updatedTaskData, key) && key !== 'pictures') {
              task[key] = updatedTaskData[key];
            }
          } // Check if a new picture file was uploaded and update the task's picture field
          // if (req.files['picture']) {
          //   task.picture = `uploads/pictures/${req.files['picture'][0].filename}`; // Update the picture URL
          //   // console.log(req.file)
          // }


          task.pictures = updatedTaskData.pictures || []; // Check if new picture files were uploaded and add them to the task's pictures field

          if (req.files['pictures']) {
            newPictures = req.files['pictures'].map(function (file) {
              return "uploads/pictures/".concat(file.filename);
            });
            task.pictures = task.pictures.concat(newPictures);
          }

          if (req.files['audio']) {
            task.audio = "uploads/audio/".concat(req.files['audio'][0].filename); // Update the audio URL
          } // Save the updated task back to the database


          _context32.next = 16;
          return regeneratorRuntime.awrap(task.save());

        case 16:
          newTask = _context32.sent;
          res.status(200).json({
            message: 'Task updated successfully',
            newTask: newTask
          });
          _context32.next = 24;
          break;

        case 20:
          _context32.prev = 20;
          _context32.t0 = _context32["catch"](0);
          console.error(_context32.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 24:
        case "end":
          return _context32.stop();
      }
    }
  }, null, null, [[0, 20]]);
}); // Delete Task API Endpoint

router["delete"]('/delete/:taskId', jwtMiddleware, function _callee33(req, res) {
  var taskId, task;
  return regeneratorRuntime.async(function _callee33$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          _context33.prev = 0;
          taskId = req.params.taskId;
          _context33.next = 4;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 4:
          task = _context33.sent;

          if (task) {
            _context33.next = 7;
            break;
          }

          return _context33.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 7:
          if (!(task.assignedBy.toString() !== req.user.employeeId && task.assignedBy.toString() !== req.user.subEmployeeId)) {
            _context33.next = 9;
            break;
          }

          return _context33.abrupt("return", res.status(403).json({
            error: 'Unauthorized: You are not the creator of this task'
          }));

        case 9:
          _context33.next = 11;
          return regeneratorRuntime.awrap(Task.findByIdAndDelete(taskId));

        case 11:
          res.status(200).json({
            message: 'Task deleted successfully'
          });
          _context33.next = 18;
          break;

        case 14:
          _context33.prev = 14;
          _context33.t0 = _context33["catch"](0);
          console.error(_context33.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context33.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); // get pending/ Received task to Employee
// router.get('/tasksList/assignedTo', jwtMiddleware,async (req, res) => {
//   try {
//     // Extract sub-employee ID from the decoded JWT token
//     const subEmployeeId = req.user.subEmployeeId;
//     console.log(subEmployeeId)
//     // Find tasks assigned to the sub-employee
//     const currentDate = new Date();
//      currentDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison
//      console.log(currentDate)
//      const asiaTime = DateTime.now().setZone('Asia/Kolkata');
//      // const currentTime = asiaTime.toLocaleString(DateTime.TIME_SIMPLE).toUpperCase(); // Convert to upper case
//      const formattedCurrentTime = asiaTime.toFormat('hh:mm a'); // Format time as "01:02 PM"
//      console.log("currentTime in Asia:", formattedCurrentTime);
//     // Find pending tasks where assignedBy field matches any of the admin IDs
//     const tasks = await Task.find({
//       assignTo: subEmployeeId,
//       $and: [
//         { deadlineDate: { $gte: currentDate } },
//         { endTime: { $gt: formattedCurrentTime} }
//       ],
//       status: 'pending'
//     }).populate('assignedBy', 'name');;
//     // const tasks = await Task.find({ assignTo: subEmployeeId, status: 'pending' }).populate('assignedBy', 'name');
//     console.log(tasks)
//     if (!tasks) {
//       // If no tasks are found, return an empty array or an appropriate response
//       return res.status(404).json({ error: 'No tasks found' });
//     }
//     // Return the list of tasks as a JSON response
//     res.status(200).json({ tasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// router.get('/tasksList/assignedTo', jwtMiddleware, async (req, res) => {
//   try {
//     // Extract sub-employee ID from the decoded JWT token
//     const subEmployeeId = req.user.subEmployeeId;
//     // console.log(subEmployeeId);
//     // Find tasks assigned to the sub-employee
//     const tasks = await Task.find({
//       assignTo: subEmployeeId,
//       status: 'pending'
//     }).populate('assignedBy', 'name');
//     // console.log(tasks);
//     if (!tasks) {
//       // If no tasks are found, return an empty array or an appropriate response
//       return res.status(404).json({ error: 'No tasks found' });
//     }
//     // Return the list of tasks as a JSON response
//     res.status(200).json({ tasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/tasksList/assignedTo', jwtMiddleware, function _callee34(req, res) {
  var subEmployeeId, _req$query9, startDate, endDate, query, tasks;

  return regeneratorRuntime.async(function _callee34$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          _context34.prev = 0;
          // Extract sub-employee ID from the decoded JWT token
          subEmployeeId = req.user.subEmployeeId; // Extract startDate and endDate from the query parameters

          _req$query9 = req.query, startDate = _req$query9.startDate, endDate = _req$query9.endDate; // Create a query object

          query = {
            assignTo: subEmployeeId,
            status: 'pending'
          }; // Add date filters if provided

          if (startDate && endDate) {
            query = _objectSpread({}, query, {
              startDate: {
                $gte: new Date(startDate)
              },
              deadlineDate: {
                $lte: new Date(endDate)
              }
            });
          } // Find tasks matching the query


          _context34.next = 7;
          return regeneratorRuntime.awrap(Task.find(query).populate('assignedBy', 'name'));

        case 7:
          tasks = _context34.sent;

          if (!(tasks.length === 0)) {
            _context34.next = 10;
            break;
          }

          return _context34.abrupt("return", res.status(404).json({
            error: 'No tasks found'
          }));

        case 10:
          // Return the list of tasks as a JSON response
          res.status(200).json({
            tasks: tasks
          });
          _context34.next = 17;
          break;

        case 13:
          _context34.prev = 13;
          _context34.t0 = _context34["catch"](0);
          console.error(_context34.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context34.stop();
      }
    }
  }, null, null, [[0, 13]]);
});

var _require2 = require('luxon'),
    DateTime = _require2.DateTime; // Get overdue task for Admin in one company
// router.get('/tasks/overdue', jwtMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.employeeId;
//     // Find tasks where the assignedBy field matches the user's ID
//     const overdueTasks = await Task.find({
//       assignedBy: userId,
//       status: "overdue"
//     });
//     // console.log("currentDate", currentDate);
//     // console.log('Overdue Tasks:', overdueTasks);
//     if (!overdueTasks || overdueTasks.length === 0) {
//       // console.log('No overdue tasks found.');
//       return res.status(404).json({ error: 'No overdue tasks found' });
//     }
//     // Return the list of overdue tasks as a JSON response
//     res.status(200).json({ overdueTasks });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.get('/tasks/overdueFor', jwtMiddleware, function _callee35(req, res) {
  var userId, assignTo, adminCompanyName, subEmployees, subEmployeeIds, userCompany, companyAdmins, adminIds, taskFilter, currentDate, tasks, overdueTasks;
  return regeneratorRuntime.async(function _callee35$(_context35) {
    while (1) {
      switch (_context35.prev = _context35.next) {
        case 0:
          _context35.prev = 0;
          userId = req.user.employeeId;
          assignTo = req.query.assignTo;
          adminCompanyName = req.user.adminCompanyName;
          _context35.next = 6;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 6:
          subEmployees = _context35.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          });
          _context35.next = 10;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 10:
          userCompany = _context35.sent;

          if (userCompany) {
            _context35.next = 13;
            break;
          }

          return _context35.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 13:
          _context35.next = 15;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 15:
          companyAdmins = _context35.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context35.next = 18;
            break;
          }

          return _context35.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 18:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          });
          taskFilter = {
            status: 'pending',
            // Fetch only pending tasks
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          }

          currentDate = new Date(); // Fetch the tasks using the filter

          _context35.next = 24;
          return regeneratorRuntime.awrap(Task.find(taskFilter));

        case 24:
          tasks = _context35.sent;
          // Filter tasks whose deadline and end time have passed
          overdueTasks = tasks.filter(function (task) {
            var taskDeadline = new Date(task.deadlineDate);
            var taskEndTime = task.endTime.split(' ');
            var taskEndHourMinute = taskEndTime[0].split(':');
            var taskEndHours = parseInt(taskEndHourMinute[0]);
            var taskEndMinutes = parseInt(taskEndHourMinute[1]); // Adjust hour for PM time

            if (taskEndTime[1] === 'PM' && taskEndHours !== 12) {
              taskEndHours += 12;
            } else if (taskEndTime[1] === 'AM' && taskEndHours === 12) {
              taskEndHours = 0;
            } // Set the exact end time for the task


            taskDeadline.setHours(taskEndHours, taskEndMinutes, 0, 0); // Return true if the task is overdue

            return taskDeadline < currentDate;
          });

          if (!(!overdueTasks || overdueTasks.length === 0)) {
            _context35.next = 28;
            break;
          }

          return _context35.abrupt("return", res.status(404).json({
            error: 'No overdue tasks found'
          }));

        case 28:
          // Send the list of overdue tasks as a JSON response
          res.status(200).json({
            overdueTasks: overdueTasks
          });
          _context35.next = 35;
          break;

        case 31:
          _context35.prev = 31;
          _context35.t0 = _context35["catch"](0);
          console.error('Error:', _context35.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 35:
        case "end":
          return _context35.stop();
      }
    }
  }, null, null, [[0, 31]]);
});
router.get('/tasks/overdueNEW', jwtMiddleware, function _callee36(req, res) {
  var userId, employeeId, _req$query10, assignTo, startDate, endDate, adminCompanyName, today, subEmployees, subEmployeeIds, userCompany, tasks, companyAdmins, adminIds, taskFilter, overdueTasks;

  return regeneratorRuntime.async(function _callee36$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          _context36.prev = 0;
          userId = req.user.employeeId;
          employeeId = req.user.subEmployeeId;
          console.log(userId);
          console.log(employeeId);
          _req$query10 = req.query, assignTo = _req$query10.assignTo, startDate = _req$query10.startDate, endDate = _req$query10.endDate;
          adminCompanyName = req.user.adminCompanyName;
          today = new Date();
          _context36.next = 10;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 10:
          subEmployees = _context36.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          });
          _context36.next = 14;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 14:
          userCompany = _context36.sent;

          if (userCompany) {
            _context36.next = 22;
            break;
          }

          _context36.next = 18;
          return regeneratorRuntime.awrap(Task.find({
            assignTo: employeeId,
            status: {
              $in: ['pending', 'overdue']
            },
            deadlineDate: {
              $lt: today
            }
          }).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 18:
          tasks = _context36.sent;

          if (!(!tasks || tasks.length === 0)) {
            _context36.next = 21;
            break;
          }

          return _context36.abrupt("return", res.status(200).json({
            status: 0,
            message: 'Overdue List is Empty',
            tasks: tasks
          }));

        case 21:
          return _context36.abrupt("return", res.status(200).json({
            status: 1,
            message: 'Successfully fetched overdue tasks',
            tasks: tasks
          }));

        case 22:
          _context36.next = 24;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 24:
          companyAdmins = _context36.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context36.next = 27;
            break;
          }

          return _context36.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 27:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          });
          taskFilter = {
            status: {
              $in: ['pending', 'overdue']
            },
            deadlineDate: {
              $lt: today
            },
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          }

          _context36.next = 32;
          return regeneratorRuntime.awrap(Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 32:
          overdueTasks = _context36.sent;

          if (!(!overdueTasks || overdueTasks.length === 0)) {
            _context36.next = 35;
            break;
          }

          return _context36.abrupt("return", res.status(200).json({
            status: 0,
            message: 'Overdue List is Empty',
            overdueTasks: overdueTasks
          }));

        case 35:
          return _context36.abrupt("return", res.status(200).json({
            status: 1,
            message: 'Successfully fetched Overdue tasks',
            overdueTasks: overdueTasks
          }));

        case 38:
          _context36.prev = 38;
          _context36.t0 = _context36["catch"](0);
          console.error('Error:', _context36.t0);
          return _context36.abrupt("return", res.status(500).json({
            error: 'Internal Server Error'
          }));

        case 42:
        case "end":
          return _context36.stop();
      }
    }
  }, null, null, [[0, 38]]);
});
router.get('/tasks/totalTask', jwtMiddleware, function _callee37(req, res) {
  var userId, employeeId, _req$query11, assignTo, startDate, endDate, adminCompanyName, subEmployees, subEmployeeIds, userCompany, _totalTask, companyAdmins, adminIds, taskFilter, totalTask;

  return regeneratorRuntime.async(function _callee37$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          _context37.prev = 0;
          userId = req.user.employeeId;
          employeeId = req.user.subEmployeeId;
          console.log(userId);
          console.log(employeeId);
          _req$query11 = req.query, assignTo = _req$query11.assignTo, startDate = _req$query11.startDate, endDate = _req$query11.endDate;
          adminCompanyName = req.user.adminCompanyName;
          _context37.next = 9;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 9:
          subEmployees = _context37.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          });
          _context37.next = 13;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 13:
          userCompany = _context37.sent;

          if (userCompany) {
            _context37.next = 22;
            break;
          }

          _context37.next = 17;
          return regeneratorRuntime.awrap(Task.find({
            assignTo: employeeId
          }).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 17:
          _totalTask = _context37.sent;
          console.log(_totalTask.length);

          if (!(!_totalTask || _totalTask.length === 0)) {
            _context37.next = 21;
            break;
          }

          return _context37.abrupt("return", res.status(200).json({
            status: 0,
            message: 'Overdue List is Empty',
            totalTask: _totalTask
          }));

        case 21:
          return _context37.abrupt("return", res.status(200).json({
            status: 1,
            message: 'Successfully fetched overdue tasks',
            totalTask: _totalTask
          }));

        case 22:
          _context37.next = 24;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 24:
          companyAdmins = _context37.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context37.next = 27;
            break;
          }

          return _context37.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 27:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          });
          taskFilter = {
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };

          if (assignTo) {
            taskFilter.assignTo = {
              $in: [assignTo]
            };
          }

          _context37.next = 32;
          return regeneratorRuntime.awrap(Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 32:
          totalTask = _context37.sent;

          if (!(!totalTask || totalTask.length === 0)) {
            _context37.next = 35;
            break;
          }

          return _context37.abrupt("return", res.status(200).json({
            status: 0,
            message: 'Overdue List is Empty',
            totalTask: totalTask
          }));

        case 35:
          console.log(totalTask.length);
          return _context37.abrupt("return", res.status(200).json({
            status: 1,
            message: 'Successfully fetched Overdue tasks',
            totalTask: totalTask
          }));

        case 39:
          _context37.prev = 39;
          _context37.t0 = _context37["catch"](0);
          console.error('Error:', _context37.t0);
          return _context37.abrupt("return", res.status(500).json({
            error: 'Internal Server Error'
          }));

        case 43:
        case "end":
          return _context37.stop();
      }
    }
  }, null, null, [[0, 39]]);
});
router.get('/tasks/overdue', jwtMiddleware, function _callee38(req, res) {
  var userId, adminCompanyName, subEmployees, subEmployeeIds, userCompany, companyAdmins, adminIds, currentTime, taskFilter, tasks, overdueTasks;
  return regeneratorRuntime.async(function _callee38$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          _context38.prev = 0;
          userId = req.user.employeeId;
          adminCompanyName = req.user.adminCompanyName;
          _context38.next = 5;
          return regeneratorRuntime.awrap(SubEmployee.find({
            adminCompanyName: adminCompanyName
          }));

        case 5:
          subEmployees = _context38.sent;
          subEmployeeIds = subEmployees.map(function (subEmployee) {
            return subEmployee._id;
          }); // Fetch the user's company details

          _context38.next = 9;
          return regeneratorRuntime.awrap(Employee.findOne({
            _id: userId
          }).select('adminCompanyName'));

        case 9:
          userCompany = _context38.sent;

          if (userCompany) {
            _context38.next = 12;
            break;
          }

          return _context38.abrupt("return", res.status(404).json({
            error: 'User not found'
          }));

        case 12:
          _context38.next = 14;
          return regeneratorRuntime.awrap(Employee.find({
            adminUserId: req.user.adminUserId,
            adminCompanyName: userCompany.adminCompanyName
          }));

        case 14:
          companyAdmins = _context38.sent;

          if (!(!companyAdmins || companyAdmins.length === 0)) {
            _context38.next = 17;
            break;
          }

          return _context38.abrupt("return", res.status(404).json({
            error: 'Admins not found for the company'
          }));

        case 17:
          adminIds = companyAdmins.map(function (admin) {
            return admin._id;
          }); // Define the filter to find overdue tasks

          currentTime = new Date();
          taskFilter = {
            status: 'pending',
            $or: [{
              assignedByEmp: {
                $in: subEmployeeIds
              }
            }, {
              assignedBy: {
                $in: adminIds
              }
            }]
          };
          _context38.next = 22;
          return regeneratorRuntime.awrap(Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 22:
          tasks = _context38.sent;
          overdueTasks = tasks.filter(function (task) {
            var deadlineDate = new Date(task.deadlineDate); // Convert endTime to 24-hour format if needed

            var _task$endTime$split$m = task.endTime.split(':').map(Number),
                _task$endTime$split$m2 = _slicedToArray(_task$endTime$split$m, 2),
                endHour = _task$endTime$split$m2[0],
                endMinute = _task$endTime$split$m2[1];

            if (task.endTime.includes('PM') && endHour !== 12) endHour += 12;
            if (task.endTime.includes('AM') && endHour === 12) endHour = 0; // Handle the case where endTime is after midnight

            if (endHour < 0) endHour += 24; // Set hours and minutes to deadlineDate

            deadlineDate.setHours(endHour, endMinute, 0, 0); // Return true if the combined deadlineDate and endTime is in the past

            return deadlineDate < currentTime;
          });

          if (!(overdueTasks.length === 0)) {
            _context38.next = 26;
            break;
          }

          return _context38.abrupt("return", res.status(200).json({
            status: 0,
            message: 'No overdue tasks found',
            overdueTasks: overdueTasks
          }));

        case 26:
          res.status(200).json({
            status: 1,
            message: 'Tasks found',
            overdueTasks: overdueTasks
          });
          _context38.next = 33;
          break;

        case 29:
          _context38.prev = 29;
          _context38.t0 = _context38["catch"](0);
          console.error('Error:', _context38.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 33:
        case "end":
          return _context38.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
router.get('/tasks/over', jwtMiddleware, function _callee39(req, res) {
  var userId, _req$query12, startDate, endDate, query, overdueTasks;

  return regeneratorRuntime.async(function _callee39$(_context39) {
    while (1) {
      switch (_context39.prev = _context39.next) {
        case 0:
          _context39.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.subEmployeeId; // Extract startDate and endDate from the query parameters

          _req$query12 = req.query, startDate = _req$query12.startDate, endDate = _req$query12.endDate; // Create a query object

          query = {
            assignTo: userId,
            status: 'pending'
          }; // Add date filters if provided

          if (startDate && endDate) {
            query = _objectSpread({}, query, {
              startDate: {
                $gte: new Date(startDate)
              },
              deadlineDate: {
                $lte: new Date(endDate)
              }
            });
          } // Find tasks matching the query


          _context39.next = 7;
          return regeneratorRuntime.awrap(Task.find(query).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 7:
          overdueTasks = _context39.sent;
          ;

          if (!(overdueTasks.length === 0)) {
            _context39.next = 11;
            break;
          }

          return _context39.abrupt("return", res.status(404).json({
            error: 'No overdue tasks found'
          }));

        case 11:
          // Return the list of overdue tasks as a JSON response
          res.status(200).json({
            overdueTasks: overdueTasks
          });
          _context39.next = 18;
          break;

        case 14:
          _context39.prev = 14;
          _context39.t0 = _context39["catch"](0);
          console.error(_context39.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context39.stop();
      }
    }
  }, null, null, [[0, 14]]);
}); //Get the list of overdue task for reminder for admin

router.get('/over/status', jwtMiddleware, function _callee40(req, res) {
  var userId, overdueTasks;
  return regeneratorRuntime.async(function _callee40$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          _context40.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.employeeId || req.user.subEmployeeId; // Get the current date and time

          _context40.next = 4;
          return regeneratorRuntime.awrap(Task.find({
            assignTo: userId,
            // Use assignTo instead of assignedBy to find tasks assigned to the user
            status: "overdue",
            isRead: false
          }));

        case 4:
          overdueTasks = _context40.sent;

          if (!(!overdueTasks || overdueTasks.length === 0)) {
            _context40.next = 7;
            break;
          }

          return _context40.abrupt("return", res.status(404).json({
            error: 'No overdue tasks found'
          }));

        case 7:
          // Return the list of overdue tasks as a JSON response
          res.status(200).json({
            overdueTasks: overdueTasks
          });
          _context40.next = 14;
          break;

        case 10:
          _context40.prev = 10;
          _context40.t0 = _context40["catch"](0);
          console.error(_context40.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context40.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); // PUT route to mark a task as read when clicking on a task

router.put("/:taskId/read", function _callee41(req, res) {
  var taskId, task;
  return regeneratorRuntime.async(function _callee41$(_context41) {
    while (1) {
      switch (_context41.prev = _context41.next) {
        case 0:
          _context41.prev = 0;
          taskId = req.params.taskId; // Find the task by its ID

          _context41.next = 4;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 4:
          task = _context41.sent;

          if (task) {
            _context41.next = 7;
            break;
          }

          return _context41.abrupt("return", res.status(404).json({
            error: "Task not found"
          }));

        case 7:
          // Mark the task as read
          task.isRead = true; // Save the updated task

          _context41.next = 10;
          return regeneratorRuntime.awrap(task.save());

        case 10:
          res.json(task);
          _context41.next = 17;
          break;

        case 13:
          _context41.prev = 13;
          _context41.t0 = _context41["catch"](0);
          console.error("Error marking task as read:", _context41.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 17:
        case "end":
          return _context41.stop();
      }
    }
  }, null, null, [[0, 13]]);
}); //Get the list of task which are completed for Admin in reminder

router.get('/complete/status', jwtMiddleware, function _callee42(req, res) {
  var userId, completeTasks;
  return regeneratorRuntime.async(function _callee42$(_context42) {
    while (1) {
      switch (_context42.prev = _context42.next) {
        case 0:
          _context42.prev = 0;
          // Retrieve the user's ID from the JWT token if needed
          userId = req.user.employeeId || req.user.subEmployeeId; // Get the tasks with status "complete" and isRead set to false

          _context42.next = 4;
          return regeneratorRuntime.awrap(Task.find({
            assignTo: userId,
            // Uncomment and use this line if you need to filter by user ID
            status: "completed",
            isRead: false
          }));

        case 4:
          completeTasks = _context42.sent;

          if (!(!completeTasks || completeTasks.length === 0)) {
            _context42.next = 7;
            break;
          }

          return _context42.abrupt("return", res.status(404).json({
            error: 'No complete tasks found'
          }));

        case 7:
          // Return the list of complete tasks as a JSON response
          res.status(200).json({
            completeTasks: completeTasks
          });
          _context42.next = 14;
          break;

        case 10:
          _context42.prev = 10;
          _context42.t0 = _context42["catch"](0);
          console.error(_context42.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context42.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); // get tasks added on the current date to Admin

router.get('/tasks/today', jwtMiddleware, function _callee43(req, res) {
  var userId, currentDate, todayAddedTasks;
  return regeneratorRuntime.async(function _callee43$(_context43) {
    while (1) {
      switch (_context43.prev = _context43.next) {
        case 0:
          _context43.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.employeeId; // Get the current date as a string in the format "YYYY-MM-DD"

          currentDate = new Date().toISOString().split('T')[0]; // Find tasks where the assignedBy field matches the user's ID and the startDate is equal to the current date

          _context43.next = 5;
          return regeneratorRuntime.awrap(Task.find({
            assignedBy: userId,
            startDate: currentDate
          }));

        case 5:
          todayAddedTasks = _context43.sent;

          if (!(!todayAddedTasks || todayAddedTasks.length === 0)) {
            _context43.next = 8;
            break;
          }

          return _context43.abrupt("return", res.status(404).json({
            error: 'No tasks added today'
          }));

        case 8:
          // Return the list of tasks added today as a JSON response
          res.status(200).json({
            todayAddedTasks: todayAddedTasks
          });
          _context43.next = 15;
          break;

        case 11:
          _context43.prev = 11;
          _context43.t0 = _context43["catch"](0);
          console.error(_context43.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 15:
        case "end":
          return _context43.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/tasks/todayEmp', jwtMiddleware, function _callee44(req, res) {
  var userId, currentDate, todayAddedTasks;
  return regeneratorRuntime.async(function _callee44$(_context44) {
    while (1) {
      switch (_context44.prev = _context44.next) {
        case 0:
          _context44.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.subEmployeeId; // Get the current date as a string in the format "YYYY-MM-DD"

          currentDate = new Date().toISOString().split('T')[0]; // Find tasks where the assignedBy field matches the user's ID and the startDate is equal to the current date

          _context44.next = 5;
          return regeneratorRuntime.awrap(Task.find({
            assignedByEmp: userId,
            startDate: currentDate
          }));

        case 5:
          todayAddedTasks = _context44.sent;

          if (!(!todayAddedTasks || todayAddedTasks.length === 0)) {
            _context44.next = 8;
            break;
          }

          return _context44.abrupt("return", res.status(404).json({
            error: 'No tasks added today'
          }));

        case 8:
          // Return the list of tasks added today as a JSON response
          res.status(200).json({
            todayAddedTasks: todayAddedTasks
          });
          _context44.next = 15;
          break;

        case 11:
          _context44.prev = 11;
          _context44.t0 = _context44["catch"](0);
          console.error(_context44.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 15:
        case "end":
          return _context44.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/edit/:taskId', upload.fields([{
  name: 'picture',
  maxCount: 1
}, {
  name: 'audio',
  maxCount: 1
}]), [body('title').notEmpty().withMessage('Title is required'), body('description').notEmpty().withMessage('Description is required'), body('assignTo').notEmpty().withMessage('subEmployee ID is required'), body('startDate').notEmpty().withMessage('Start Date is required'), body('deadlineDate').notEmpty().withMessage('Deadline Date is required'), body('startTime').notEmpty().withMessage('Start Time is required'), body('endTime').notEmpty().withMessage('End Time is required')], jwtMiddleware, function _callee45(req, res) {
  var errors, _req$body4, title, description, startDate, startTime, deadlineDate, endTime, assignTo, taskId, task, picturePath, audioPath;

  return regeneratorRuntime.async(function _callee45$(_context45) {
    while (1) {
      switch (_context45.prev = _context45.next) {
        case 0:
          // Check for validation errors
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context45.next = 3;
            break;
          }

          return _context45.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body4 = req.body, title = _req$body4.title, description = _req$body4.description, startDate = _req$body4.startDate, startTime = _req$body4.startTime, deadlineDate = _req$body4.deadlineDate, endTime = _req$body4.endTime, assignTo = _req$body4.assignTo;
          taskId = req.params.taskId; // Check if the task with the given taskId exists

          _context45.next = 7;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 7:
          task = _context45.sent;

          if (task) {
            _context45.next = 10;
            break;
          }

          return _context45.abrupt("return", res.status(404).json({
            error: 'Task not found'
          }));

        case 10:
          picturePath = task.picture; // Retain the original picture path if no new picture is provided

          audioPath = task.audio; // Retain the original audio path if no new audio is provided
          // Check if picture and audio files were included in the request and update the paths accordingly

          if (req.files && req.files.picture && req.files.audio) {
            picturePath = req.files.picture[0].path;
            audioPath = req.files.audio[0].path;
          }

          _context45.prev = 13;
          // Update the task with the new information
          task.title = title;
          task.description = description;
          task.startDate = startDate;
          task.startTime = startTime;
          task.deadlineDate = deadlineDate;
          task.endTime = endTime;
          task.assignTo = assignTo;
          task.picture = picturePath;
          task.audio = audioPath;
          _context45.next = 25;
          return regeneratorRuntime.awrap(task.save());

        case 25:
          res.status(200).json({
            message: 'Task updated successfully',
            task: task
          });
          _context45.next = 31;
          break;

        case 28:
          _context45.prev = 28;
          _context45.t0 = _context45["catch"](13);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 31:
        case "end":
          return _context45.stop();
      }
    }
  }, null, null, [[13, 28]]);
});
router.get('/list/subemployee/sendTasks', jwtMiddleware, function _callee46(req, res) {
  var userId, _req$query13, startDate, endDate, query, tasks;

  return regeneratorRuntime.async(function _callee46$(_context46) {
    while (1) {
      switch (_context46.prev = _context46.next) {
        case 0:
          _context46.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.subEmployeeId; // Extract startDate and endDate from the query parameters

          _req$query13 = req.query, startDate = _req$query13.startDate, endDate = _req$query13.endDate; // Create a query object

          query = {
            assignedByEmp: userId
          }; // Add date filters if provided

          if (startDate && endDate) {
            query = _objectSpread({}, query, {
              startDate: {
                $gte: new Date(startDate)
              },
              deadlineDate: {
                $lte: new Date(endDate)
              }
            });
          } // Find tasks matching the query


          _context46.next = 7;
          return regeneratorRuntime.awrap(Task.find(query).populate('assignTo', 'name').populate('assignedBy', 'name'));

        case 7:
          tasks = _context46.sent;

          if (!(tasks.length === 0)) {
            _context46.next = 10;
            break;
          }

          return _context46.abrupt("return", res.status(404).json({
            error: 'No tasks found'
          }));

        case 10:
          // Send the list of tasks as a JSON response
          res.json({
            tasks: tasks
          });
          _context46.next = 17;
          break;

        case 13:
          _context46.prev = 13;
          _context46.t0 = _context46["catch"](0);
          console.error(_context46.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context46.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/list/employee/sendTasks', jwtMiddleware, function _callee47(req, res) {
  var userId, _req$query14, startDate, endDate, query, tasks;

  return regeneratorRuntime.async(function _callee47$(_context47) {
    while (1) {
      switch (_context47.prev = _context47.next) {
        case 0:
          _context47.prev = 0;
          // Retrieve the user's ID from the JWT token
          userId = req.user.employeeId; // Extract startDate and endDate from the query parameters

          _req$query14 = req.query, startDate = _req$query14.startDate, endDate = _req$query14.endDate; // Create a query object

          query = {
            assignedBy: userId
          }; // Add date filters if provided

          if (startDate && endDate) {
            query = _objectSpread({}, query, {
              startDate: {
                $gte: new Date(startDate)
              },
              deadlineDate: {
                $lte: new Date(endDate)
              }
            });
          } // Find tasks matching the query


          _context47.next = 7;
          return regeneratorRuntime.awrap(Task.find(query));

        case 7:
          tasks = _context47.sent;

          if (!(tasks.length === 0)) {
            _context47.next = 10;
            break;
          }

          return _context47.abrupt("return", res.status(404).json({
            error: 'No tasks found'
          }));

        case 10:
          // Send the list of tasks as a JSON response
          res.json({
            tasks: tasks
          });
          _context47.next = 17;
          break;

        case 13:
          _context47.prev = 13;
          _context47.t0 = _context47["catch"](0);
          console.error(_context47.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context47.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.post('/tasks/:taskId/remarkToList', jwtMiddleware, function _callee48(req, res) {
  var name, taskId, remark, task, adjustedTimestamp;
  return regeneratorRuntime.async(function _callee48$(_context48) {
    while (1) {
      switch (_context48.prev = _context48.next) {
        case 0:
          _context48.prev = 0;
          name = req.user.name;
          taskId = req.params.taskId;
          remark = req.body.remark;
          _context48.next = 6;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 6:
          task = _context48.sent;

          if (task) {
            _context48.next = 9;
            break;
          }

          return _context48.abrupt("return", res.status(404).send('Task not found'));

        case 9:
          adjustedTimestamp = moment().add(5, 'hours').add(30, 'minutes').toDate();
          task.remarkToList.push({
            remark: remark,
            timestamp: adjustedTimestamp,
            assignedBy: name
          }); // Append the new remark with timestamp

          _context48.next = 13;
          return regeneratorRuntime.awrap(task.save());

        case 13:
          res.status(200).json(task);
          _context48.next = 19;
          break;

        case 16:
          _context48.prev = 16;
          _context48.t0 = _context48["catch"](0);
          res.status(500).send(_context48.t0.message);

        case 19:
        case "end":
          return _context48.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.put('/tasks/:taskId/remarkToListNEW', jwtMiddleware, function _callee49(req, res) {
  var name, taskId, remark, task, adjustedTimestamp;
  return regeneratorRuntime.async(function _callee49$(_context49) {
    while (1) {
      switch (_context49.prev = _context49.next) {
        case 0:
          _context49.prev = 0;
          name = req.user.name;
          taskId = req.params.taskId;
          remark = req.body.remark;
          _context49.next = 6;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 6:
          task = _context49.sent;

          if (task) {
            _context49.next = 9;
            break;
          }

          return _context49.abrupt("return", res.status(404).send('Task not found'));

        case 9:
          adjustedTimestamp = moment().add(5, 'hours').add(30, 'minutes').toDate();
          task.remarkToList = [{
            remark: remark,
            timestamp: adjustedTimestamp,
            assignedBy: name
          }];
          _context49.next = 13;
          return regeneratorRuntime.awrap(task.save());

        case 13:
          res.status(200).json(task);
          _context49.next = 19;
          break;

        case 16:
          _context49.prev = 16;
          _context49.t0 = _context49["catch"](0);
          res.status(500).send(_context49.t0.message);

        case 19:
        case "end":
          return _context49.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.get('/tasks/:taskId/remarkToList', function _callee50(req, res) {
  var taskId, task;
  return regeneratorRuntime.async(function _callee50$(_context50) {
    while (1) {
      switch (_context50.prev = _context50.next) {
        case 0:
          _context50.prev = 0;
          taskId = req.params.id;
          _context50.next = 4;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 4:
          task = _context50.sent;

          if (task) {
            _context50.next = 7;
            break;
          }

          return _context50.abrupt("return", res.status(404).send('Task not found'));

        case 7:
          res.status(200).json(task.remarkToList);
          _context50.next = 13;
          break;

        case 10:
          _context50.prev = 10;
          _context50.t0 = _context50["catch"](0);
          res.status(500).send(_context50.t0.message);

        case 13:
        case "end":
          return _context50.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); // Add a remark toList

router.post('/tasks/:id/empRemarkToList', jwtMiddleware, function _callee51(req, res) {
  var name, taskId, remark, task, adjustedTimestamp;
  return regeneratorRuntime.async(function _callee51$(_context51) {
    while (1) {
      switch (_context51.prev = _context51.next) {
        case 0:
          _context51.prev = 0;
          name = req.user.name;
          taskId = req.params.id;
          remark = req.body.remark;
          _context51.next = 6;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 6:
          task = _context51.sent;

          if (task) {
            _context51.next = 9;
            break;
          }

          return _context51.abrupt("return", res.status(404).send('Task not found'));

        case 9:
          adjustedTimestamp = moment().add(5, 'hours').add(30, 'minutes').toDate();
          task.empRemarkToList.push({
            remark: remark,
            timestamp: adjustedTimestamp,
            assignedByEmp: name
          }); // Append the new remark with timestamp

          _context51.next = 13;
          return regeneratorRuntime.awrap(task.save());

        case 13:
          res.status(200).json(task);
          _context51.next = 19;
          break;

        case 16:
          _context51.prev = 16;
          _context51.t0 = _context51["catch"](0);
          res.status(500).send(_context51.t0.message);

        case 19:
        case "end":
          return _context51.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.get('/tasks/:id/empRemarkToList', function _callee52(req, res) {
  var taskId, task;
  return regeneratorRuntime.async(function _callee52$(_context52) {
    while (1) {
      switch (_context52.prev = _context52.next) {
        case 0:
          _context52.prev = 0;
          taskId = req.params.id;
          _context52.next = 4;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 4:
          task = _context52.sent;

          if (task) {
            _context52.next = 7;
            break;
          }

          return _context52.abrupt("return", res.status(404).send('Task not found'));

        case 7:
          res.status(200).json(task.empRemarkToList);
          _context52.next = 13;
          break;

        case 10:
          _context52.prev = 10;
          _context52.t0 = _context52["catch"](0);
          res.status(500).send(_context52.t0.message);

        case 13:
        case "end":
          return _context52.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router; ///