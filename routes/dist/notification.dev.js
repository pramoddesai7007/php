"use strict";

var express = require('express');

var Notification = require('../models/Notification');

var jwtMiddleware = require('../jwtmiddleware');

var _require = require('express-validator'),
    body = _require.body,
    validationResult = _require.validationResult;

var router = express.Router();
router.post('/create', jwtMiddleware, function _callee(req, res) {
  var adminId, employeeId, assignedByname, _req$body, recipientId, taskId, message, title, description, startDate, deadlineDate, startTime, endTime, status, recipientObjects, notification;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          adminId = req.user.employeeId; // Get the ID of the admin creating the task

          employeeId = req.user.subEmployeeId; // Get the ID of the admin creating the task

          assignedByname = req.user.name; // Get the assignedByname from req.user

          _req$body = req.body, recipientId = _req$body.recipientId, taskId = _req$body.taskId, message = _req$body.message, title = _req$body.title, description = _req$body.description, startDate = _req$body.startDate, deadlineDate = _req$body.deadlineDate, startTime = _req$body.startTime, endTime = _req$body.endTime, status = _req$body.status; // Transform recipientId array of strings into an array of objects

          recipientObjects = recipientId.map(function (id) {
            return {
              recipientId: id
            };
          }); // Create a new notification with both userId (admin) and recipientId (transformed array)

          notification = new Notification({
            userId: adminId ? adminId : employeeId,
            // ID of the admin creating the task
            recipientId: recipientObjects,
            // Transformed recipient ID array
            taskId: taskId,
            // ID of the newly created task
            message: message,
            assignedByname: assignedByname,
            // Dynamically determined name
            title: title,
            description: description,
            startDate: startDate,
            deadlineDate: deadlineDate,
            startTime: startTime,
            endTime: endTime,
            status: status
          }); // Save the task and notification to the database

          _context.next = 9;
          return regeneratorRuntime.awrap(notification.save());

        case 9:
          res.status(201).json({
            message: 'Notification sent successfully'
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error creating task and notification:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // Create Notification Route

router.post('/notifications', function _callee2(req, res) {
  var _req$body2, userId, recipientId, taskId, title, description, startDate, deadlineDate, startTime, endTime, status, assignedByname, message, notification;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, userId = _req$body2.userId, recipientId = _req$body2.recipientId, taskId = _req$body2.taskId, title = _req$body2.title, description = _req$body2.description, startDate = _req$body2.startDate, deadlineDate = _req$body2.deadlineDate, startTime = _req$body2.startTime, endTime = _req$body2.endTime, status = _req$body2.status, assignedByname = _req$body2.assignedByname, message = _req$body2.message;
          _context2.prev = 1;
          notification = new Notification({
            userId: userId,
            recipientId: recipientId,
            taskId: taskId,
            title: title,
            description: description,
            startDate: startDate,
            deadlineDate: deadlineDate,
            startTime: startTime,
            endTime: endTime,
            status: status,
            assignedByname: assignedByname,
            message: message
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(notification.save());

        case 5:
          res.status(201).json({
            message: 'Notification created successfully',
            notification: notification
          });
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error(_context2.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.get('/getMyNotification', jwtMiddleware, function _callee3(req, res) {
  var employeeId, notifications;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          employeeId = req.user.subEmployeeId; // Get the employee ID from the JWT token

          console.log(employeeId); // Fetch notifications where recipientId matches employeeId and isRead is false

          _context3.next = 5;
          return regeneratorRuntime.awrap(Notification.aggregate([{
            $unwind: "$recipientId"
          }, {
            $match: {
              "recipientId.recipientId": employeeId,
              "recipientId.isRead": false
            }
          }, {
            $group: {
              _id: "$_id",
              userId: {
                $first: "$userId"
              },
              recipientId: {
                $push: "$recipientId"
              },
              taskId: {
                $first: "$taskId"
              },
              title: {
                $first: "$title"
              },
              description: {
                $first: "$description"
              },
              startDate: {
                $first: "$startDate"
              },
              deadlineDate: {
                $first: "$deadlineDate"
              },
              startTime: {
                $first: "$startTime"
              },
              endTime: {
                $first: "$endTime"
              },
              status: {
                $first: "$status"
              },
              assignedByname: {
                $first: "$assignedByname"
              },
              message: {
                $first: "$message"
              },
              createdAt: {
                $first: "$createdAt"
              }
            }
          }]));

        case 5:
          notifications = _context3.sent;

          if (!(!notifications || notifications.length === 0)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'No unread notifications found'
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(Notification.updateMany({
            "_id": {
              $in: notifications.map(function (n) {
                return n._id;
              })
            },
            "recipientId.recipientId": employeeId
          }, {
            $set: {
              "recipientId.$[elem].isRead": true
            }
          }, {
            arrayFilters: [{
              "elem.recipientId": employeeId
            }]
          }));

        case 10:
          res.status(200).json({
            notifications: notifications
          });
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching notifications:', _context3.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/getUnreadNotificationCount', jwtMiddleware, function _callee4(req, res) {
  var employeeId, unreadCount, count;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          employeeId = req.user.subEmployeeId; // Get the employee ID from the JWT token

          _context4.next = 4;
          return regeneratorRuntime.awrap(Notification.aggregate([{
            $unwind: "$recipientId"
          }, {
            $match: {
              "recipientId.recipientId": employeeId,
              "recipientId.isRead": false
            }
          }, {
            $count: "unreadCount"
          }]));

        case 4:
          unreadCount = _context4.sent;
          // If no unread notifications found, return a count of 0
          count = unreadCount.length > 0 ? unreadCount[0].unreadCount : 0;
          res.status(200).json({
            unreadCount: count
          });
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching unread notification count:', _context4.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.get('/getAll', function _callee5(req, res) {
  var notifications;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Notification.find());

        case 3:
          notifications = _context5.sent;
          res.status(200).json(notifications);
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error('Error retrieving notifications:', _context5.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/notifications', jwtMiddleware, function _callee6(req, res) {
  var subEmployeeId, notifications;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          subEmployeeId = req.user.subEmployeeId;

          if (subEmployeeId) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'Invalid subEmployeeId'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(Notification.find({
            recipientId: subEmployeeId,
            isRead: false
          }).sort({
            createdAt: -1
          }));

        case 6:
          notifications = _context6.sent;

          if (notifications.length) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'No unread notifications found'
          }));

        case 9:
          // Send the notifications with a 200 status code
          res.status(200).json(notifications);
          _context6.next = 16;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.error('Error retrieving notifications:', _context6.t0); // Send a 500 status code for server errors

          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.get('/notification', jwtMiddleware, function _callee7(req, res) {
  var subEmployeeId, notifications;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          subEmployeeId = req.user.employeeId;

          if (subEmployeeId) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Invalid employeeId'
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(Notification.find({
            recipientId: subEmployeeId,
            isRead: false
          }).sort({
            createdAt: -1
          }));

        case 6:
          notifications = _context7.sent;

          if (notifications.length) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'No unread notifications found'
          }));

        case 9:
          // Send the notifications with a 200 status code
          res.status(200).json(notifications);
          _context7.next = 16;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error('Error retrieving notifications:', _context7.t0); // Send a 500 status code for server errors

          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.get('/notification/emp', function _callee8(req, res) {
  var subEmployeeId, notifications;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          subEmployeeId = req.body;

          if (subEmployeeId) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: 'Invalid employeeId'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(Notification.find({
            'recipientId.recipientId': subEmployeeId,
            'recipientId.isRead': false
          }).sort({
            createdAt: -1
          }));

        case 6:
          notifications = _context8.sent;

          if (notifications.length) {
            _context8.next = 10;
            break;
          }

          console.log(notifications.length);
          return _context8.abrupt("return", res.status(404).json({
            message: 'No unread notifications found'
          }));

        case 10:
          // Send the notifications with a 200 status code
          res.status(200).json(notifications);
          _context8.next = 17;
          break;

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          console.error('Error retrieving notifications:', _context8.t0); // Send a 500 status code for server errors

          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
}); // PUT route to mark a notification as read when clicking on a task

router.put('/:notificationId/read', function _callee9(req, res) {
  var notificationId, notification;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          notificationId = req.params.notificationId; // Find the notification by its ID

          _context9.next = 4;
          return regeneratorRuntime.awrap(Notification.findById(notificationId));

        case 4:
          notification = _context9.sent;

          if (notification) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            error: 'Notification not found'
          }));

        case 7:
          // Mark the notification as read
          notification.isRead = true; // Save the updated notification

          _context9.next = 10;
          return regeneratorRuntime.awrap(notification.save());

        case 10:
          res.json(notification);
          _context9.next = 17;
          break;

        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](0);
          console.error('Error marking notification as read:', _context9.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
module.exports = router;