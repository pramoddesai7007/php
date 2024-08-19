"use strict";

// //import connectToDatabase from '../../lib/db';
// const Salary = require('../models/Salary');
// //const { getCoordinates } = require('../../lib/location');
// const express = require('express');
// const router = express.Router();
// const getLocation = require('../utils/geoLocation');
// const fs = require('fs');
// const path = require('path');
// const jwtMiddleware = require('../jwtmiddleware');
// const SubEmployee = require('../models/SubEmployee');
// // const IP_FILE = path.join(__dirname, 'IP.json'); // Adjust path as needed
// // Function to read IP addresses from the file
// const readIPAddressesed = (companyName) => {
//   try {
//     const filePath = getFilePath(companyName);
//     const data = fs.readFileSync(filePath, 'utf8');
//     console.log(data);
//     return JSON.parse(data); // Assuming the JSON file contains an array of IP addresses
//   } catch (err) {
//     console.error('Error reading IP addresses:', err);
//     return [];
//   }
// };
// const getFilePath = (companyName) => {
//   return path.join(__dirname, `${companyName}_ips.json`);
// };
// const writeIPAddresses = (companyName, ipAddresses) => {
//   const filePath = getFilePath(companyName);
//   fs.writeFileSync(filePath, JSON.stringify(ipAddresses, null, 2), 'utf8');
// };
// const readIPAddresses = (companyName) => {
//   const filePath = getFilePath(companyName);
//   if (!fs.existsSync(filePath)) {
//     return [];
//   }
//   const data = fs.readFileSync(filePath, 'utf8');
//   return JSON.parse(data);
// };
// // POST endpoint to clock in
// // router.post('/clock-ins', jwtMiddleware, async (req, res) => {
// //   const company = req.user.adminCompanyName
// //   const { email, role, ip, lat, long } = req.body;
// //   const now = new Date();
// //   console.log(now);
// //   console.log(email);
// //   console.log(role);
// //   console.log(ip);
// //   console.log(lat);
// //   console.log(long);
// //   let coordinates;
// //   if (role === 'Sales Employee') {
// //     coordinates = {
// //       lat,
// //       long
// //     };
// //   } else {
// //     const validIPs = readIPAddressesed(company);
// //     if (validIPs.includes(ip)) {
// //       coordinates = {
// //         lat,
// //         long
// //       };
// //     } else {
// //       return res.status(403).json({ message: 'Invalid work location tracked' });
// //     }
// //   }
// //   if (!coordinates) {
// //     return res.status(500).json({ message: 'Failed to get location' });
// //   }
// //   try {
// //     const salary = await Salary.findOne({ email });
// //     if (!salary) {
// //       return res.status(404).json({ message: 'Employee not found' });
// //     }
// //     salary.clockRecords.push({
// //       clockIn: now,
// //       clockInCoordinates: coordinates,
// //       clockOut: null,
// //       clockOutCoordinates: null,
// //       workDuration: null
// //     });
// //     await salary.save();
// //     res.status(200).json({ message: 'Clocked in successfully' });
// //   } catch (error) {
// //     console.error('Error saving clock record:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // });
// router.post('/clock-ins', jwtMiddleware, async (req, res) => {
// const company = req.user.adminCompanyName;
//   const { email, role, ip, lat, long } = req.body;
//   const now = new Date();
//   let coordinates;
//   if (role === 'Sales Employee') {
//     coordinates = {
//       lat,
//       long
//     };
//   } else {
//     const validIPs = readIPAddressesed(company);
//     if (validIPs.includes(ip)) {
//       coordinates = {
//         lat,
//         long
//       };
//     } else {
//       return res.status(403).json({ message: 'Invalid work location tracked' });
//     }
//   }
//   if (!coordinates) {
//     return res.status(500).json({ message: 'Failed to get location' });
//   }
//   try {
//     const salary = await Salary.findOne({ email });
//     if (!salary) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     // Check for existing clockIn record on the same day
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const existingRecord = salary.clockRecords.find(record => {
//       const recordDate = new Date(record.clockIn);
//       return recordDate >= today && recordDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
//     });
//     if (existingRecord) {
//       // Update existing record with new clockIn time
//       existingRecord.clockIn = now;
//       existingRecord.clockInCoordinates = coordinates;
//       existingRecord.clockOut = null;
//       existingRecord.clockOutCoordinates = null;
//       existingRecord.workDuration = null;
//     } else {
//       // Create a new clockIn record
//       salary.clockRecords.push({
//         clockIn: now,
//         clockInCoordinates: coordinates,
//         clockOut: null,
//         clockOutCoordinates: null,
//         workDuration: null
//       });
//     }
//     await salary.save();
//     res.status(200).json({ message: 'Clocked in successfully' });
//   } catch (error) {
//     console.error('Error saving clock record:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
// router.post('/clock-outs', jwtMiddleware, async (req, res) => {
//   const company = req.user.adminCompanyName
//   const { email, role, ip, lat, long } = req.body;
//   const l = lat;
//   const lo = long;
//   //const now = new Date("2024-06-25T14:06:20.143+00:00");
//   const now = new Date();
//   console.log(now)
//   // Static coordinates for testing
//   let coordinates;
//   if (role === 'Sales Employee') {
//     coordinates = {
//       lat: l,
//       long: lo
//     };
//   } else {
//     const validIPs = readIPAddressesed(company);
//     if (validIPs.includes(ip)) {
//       coordinates = {
//         lat: l,
//         long: lo
//       };
//     } else {
//       return res.status(403).json({ message: 'Invalid work location tracked' });
//     }
//   }
//   console.log(coordinates);
//   if (!coordinates) {
//     return res.status(500).json({ message: 'Failed to get location' });
//   }
//   try {
//     const salary = await Salary.findOne({ email });
//     if (!salary) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     const lastClockRecord = salary.clockRecords[salary.clockRecords.length - 1];
//     if (!lastClockRecord || !lastClockRecord.clockIn) {
//       return res.status(400).json({ message: 'No active clock-in found' });
//     }
//     const workDuration = (now - new Date(lastClockRecord.clockIn)) / (1000 * 60 * 60); // Duration in hours
//     console.log('Calculated work duration:', workDuration);
//     lastClockRecord.clockOut = now;
//     lastClockRecord.clockOutCoordinates = coordinates;
//     lastClockRecord.workDuration = workDuration;
//     await salary.save();
//     res.status(200).json({ message: 'Clocked out successfully' });
//   } catch (error) {
//     console.error('Error during clock-out:', error);
//     res.status(500).json({ message: error.message });
//   }
// });
// // router.post('/calculate-salary', async (req, res) => {
// //   const { name, email, startDate, endDate } = req.body;
// //   const start = new Date(startDate);
// //   const end = new Date(endDate);
// //   const salary = await Salary.findOne({ name, email });
// //   if (!salary) {
// //     return res.status(404).json({ message: 'Employee not found' });
// //   }
// //   let totalHours = 0;
// //   salary.clockRecords.forEach(record => {
// //     if (record.clockIn >= start && record.clockOut <= end) {
// //       totalHours += record.workDuration;
// //     }
// //   });
// //   console.log(totalHours);
// //   console.log(salary.hourlyRate);
// //   const total = totalHours * salary.hourlyRate;
// //   res.status(200).json({ total });
// // });
// // router.post('/calculate-salary', async (req, res) => {
// //   const { name, email, startDate, endDate } = req.body;
// //   // Function to normalize date to midnight UTC
// //   const normalizeDate = (date) => {
// //     const normalized = new Date(date);
// //     normalized.setUTCHours(0, 0, 0, 0);
// //     return normalized;
// //   };
// //   const start = normalizeDate(startDate);
// //   const end = normalizeDate(endDate);
// //   const salary = await Salary.findOne({ name, email });
// //   if (!salary) {
// //     return res.status(404).json({ message: 'Employee not found' });
// //   }
// //   let totalHours = 0;
// //   salary.clockRecords.forEach(record => {
// //     const clockIn = normalizeDate(record.clockIn);
// //     const clockOut = normalizeDate(record.clockOut);
// //     if (clockIn >= start && clockOut <= end) {
// //       totalHours += record.workDuration;
// //     }
// //   });
// //   const total = totalHours * salary.hourlyRate;
// //   res.status(200).json({ total });
// // });
// router.post('/calculate-salary/:employeeId', async (req, res) => {
//   const { employeeId } = req.params;
//   const { startDate, endDate } = req.body;
//   // Function to normalize date to midnight UTC
//   const normalizeDate = (date) => {
//     const normalized = new Date(date);
//     normalized.setUTCHours(0, 0, 0, 0);
//     return normalized;
//   };
//   const start = normalizeDate(startDate);
//   const end = normalizeDate(endDate);
//   try {
//     // Find the employee in subEmployee model
//     const employee = await SubEmployee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     // Now find the salary using the employee's name or email
//     const salary = await Salary.findOne({ email: employee.email });
//     if (!salary) {
//       return res.status(404).json({ message: 'Salary information not found' });
//     }
//     let totalHours = 0;
//     salary.clockRecords.forEach(record => {
//       const clockIn = normalizeDate(record.clockIn);
//       const clockOut = normalizeDate(record.clockOut);
//       if (clockIn >= start && clockOut <= end) {
//         totalHours += record.workDuration;
//       }
//     });
//     const total = totalHours * salary.hourlyRate;
//     res.status(200).json({ total });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// router.get('/employee/subemployees/details', async (req, res) => {
//   const { name } = req.query;
//   try {
//     const employee = await Salary.findOne({ name });
//     if (!employee) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     res.status(200).json({ email: employee.email });
//   } catch (error) {
//     console.error('Error fetching employee details:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// router.post('/set-rate', async (req, res) => {
//   const { name, email, hourlyRate, companyName } = req.body;
//   const salary = await Salary.findOneAndUpdate(
//     { name, email, companyName },
//     { hourlyRate },
//     { new: true, upsert: true }
//   );
//   if (!salary) {
//     return res.status(404).json({ message: 'Employee not found' });
//   }
//   res.status(200).json({ message: 'Hourly rate updated successfully', salary });
// });
// router.get('/salary', jwtMiddleware, async (req, res) => {
//   const { name, startDate, endDate } = req.query;
//   if (!name || !startDate || !endDate) {
//     return res.status(400).json({ message: 'Name, startDate, and endDate are required' });
//   }
//   try {
//     const start = new Date(startDate);
//     start.setUTCHours(0, 0, 0, 0);  // Set the start date to the beginning of the day
//     const end = new Date(endDate);
//     end.setUTCHours(23, 59, 59, 999);  // Set the end date to the end of the day
//     const adminCompanyName = req.user.adminCompanyName; // Extracted from the token
//     console.log(adminCompanyName)
//     const salaries = await Salary.find({
//       name: name,
//       'clockRecords.clockIn': { $gte: start, $lte: end },
//       companyName: adminCompanyName  // Include company filter
//     });
//     console.log(salaries)
//     res.status(200).json(salaries);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });
// router.get('/empSalary', jwtMiddleware, async (req, res) => {
//   const { startDate, endDate } = req.query;
//   const name = req.user.name; // Extracted from the token
//   if (!name || !startDate || !endDate) {
//     return res.status(400).json({ message: 'Name, startDate, and endDate are required' });
//   }
//   try {
//     const start = new Date(startDate);
//     start.setUTCHours(0, 0, 0, 0);  // Set the start date to the beginning of the day
//     const end = new Date(endDate);
//     end.setUTCHours(23, 59, 59, 999);  // Set the end date to the end of the day
//     // console.log(adminCompanyName)
//     const salaries = await Salary.find({
//       name: name,
//       'clockRecords.clockIn': { $gte: start, $lte: end },
//       name: name  // Include company filter
//     });
//     console.log(salaries)
//     res.status(200).json(salaries);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });
// router.put('/salary/:recordId', jwtMiddleware, async (req, res) => {
//   const { clockIn, clockOut } = req.body;
//   const recordId = req.params.recordId; // Get recordId from URL parameters
//   if (!recordId) {
//     return res.status(400).json({ message: 'Record ID not found' });
//   }
//   // console.log(recordId); // Log the recordId to verify
//   try {
//     // Find the salary by _id
//     let salary = await Salary.findOne({ 'clockRecords._id': recordId });
//     // console.log(salary); // Log the found salary to verify
//     if (salary) {
//       // Update clockIn and/or clockOut within clockRecords
//       salary.clockRecords.forEach(record => {
//         // console.log("record._id",record._id); // Log record._id for each clockRecords object
//         if (record._id.toString() === recordId.toString()) { // Corrected to access record._id
//           if (clockIn) {
//             record.clockIn = new Date(clockIn);
//           }
//           if (clockOut) {
//             record.clockOut = new Date(clockOut);
//           }
//         }
//       });
//       await salary.save(); // Save the updated salary object
//       console.log("salary", salary); // Log the updated salary object
//       res.status(200).json(salary); // Respond with the updated salary object
//     } else {
//       return res.status(404).json({ message: 'Record not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });
// // Delete Salary Record
// router.delete('/salary/:id', jwtMiddleware, async (req, res) => {
//   const { id: recordId } = req.params; // Getting recordId from params
//   try {
//     // Find the salary document and pull the specific clock record
//     const result = await Salary.updateOne(
//       { 'clockRecords._id': recordId },
//       { $pull: { clockRecords: { _id: recordId } } }
//     );
//     if (result.nModified === 0) {
//       return res.status(404).json({ message: 'Salary record not found' });
//     }
//     res.status(200).json({ message: 'Salary record deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });
// router.post('/ip', jwtMiddleware, (req, res) => {
//   const { ip } = req.body;
//   const companyName = req.user.adminCompanyName;
//   if (!ip) {
//     return res.status(400).json({ message: 'IP address is required' });
//   }
//   if (!companyName) {
//     return res.status(400).json({ message: 'Company name is required' });
//   }
//   const ipAddresses = readIPAddresses(companyName);
//   // Check if the IP address already exists
//   if (ipAddresses.includes(ip)) {
//     return res.status(400).json({ message: 'IP address already exists' });
//   }
//   // Add the new IP address to the list
//   ipAddresses.push(ip);
//   writeIPAddresses(companyName, ipAddresses);
//   res.status(201).json({ message: 'IP address stored successfully', ip });
// });
// router.get('/ip', jwtMiddleware, (req, res) => {
//   const companyName = req.user.adminCompanyName;
//   if (!companyName) {
//     return res.status(400).json({ message: 'Company name is required' });
//   }
//   const ipAddresses = readIPAddresses(companyName);
//   res.status(200).json(ipAddresses);
// });
// router.post('/calculate-hourly-wage', (req, res) => {
//   const { totalSalary, days, dailyShift } = req.body;
//   if (!totalSalary || !days || !dailyShift) {
//     return res.status(400).json({ error: 'Please provide totalSalary, days, and dailyShift' });
//   }
//   const hourlyRate = (totalSalary / days) / dailyShift;
//   res.json({ hourlyRate });
// });
// module.exports = router;
// New Route Lat Long Imp
var Salary = require('../models/Salary');

var SubEmployee = require('../models/SubEmployee');

var express = require('express');

var router = express.Router();

var getLocation = require('../utils/geoLocation');

var fs = require('fs');

var path = require('path');

var jwtMiddleware = require('../jwtmiddleware');

var axios = require('axios'); // const IP_FILE = path.join(__dirname, 'IP.json'); // Adjust path as needed


var getFilePath = function getFilePath(companyName) {
  return path.join(__dirname, "../data/".concat(companyName, "_ips.json"));
};

router.get('/clock-inn/:email', function _callee(req, res) {
  var email, subEmployee, clockRecords;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = req.params.email;
          console.log(email);
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(Salary.find({
            email: email
          }));

        case 5:
          subEmployee = _context.sent;

          if (subEmployee) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'No clock records found for this sub-employee.'
          }));

        case 8:
          clockRecords = subEmployee;
          res.status(200).json(clockRecords);
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](2);
          console.error('Error retrieving clock records:', _context.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 12]]);
});

var haversineDistance = function haversineDistance(lat1, lon1, lat2, lon2) {
  var toRadians = function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  };

  var R = 6371e3; // Radius of Earth in meters

  var φ1 = toRadians(lat1);
  var φ2 = toRadians(lat2);
  var Δφ = toRadians(lat2 - lat1);
  var Δλ = toRadians(lon2 - lon1);
  var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

router.post('/clock-innNEW', jwtMiddleware, function _callee2(req, res) {
  var _req$body, email, role, org, latitude, longitude, now, coordinates, subEmployee, adminCompanyName, companyData, matchingLocations, isValidLocation, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, location, distance, salary, today, existingRecord;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, role = _req$body.role, org = _req$body.org, latitude = _req$body.latitude, longitude = _req$body.longitude;
          now = new Date();
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(SubEmployee.findOne({
            email: email
          }));

        case 5:
          subEmployee = _context2.sent;

          if (subEmployee) {
            _context2.next = 9;
            break;
          }

          console.log(email);
          return _context2.abrupt("return", res.status(404).json({
            message: "Sub-employee not found for ".concat(email)
          }));

        case 9:
          adminCompanyName = subEmployee.adminCompanyName;
          companyData = readCompanyData(adminCompanyName);

          if (!(role === 'Sales Employee')) {
            _context2.next = 15;
            break;
          }

          coordinates = {
            latitude: latitude,
            longitude: longitude
          };
          _context2.next = 49;
          break;

        case 15:
          matchingLocations = companyData.filter(function (entry) {
            return entry.adminCompanyName === adminCompanyName && entry.org === org;
          });
          isValidLocation = false;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 20;
          _iterator = matchingLocations[Symbol.iterator]();

        case 22:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 32;
            break;
          }

          location = _step.value;
          distance = haversineDistance(latitude, longitude, location.latitude, location.longitude);
          console.log(distance);

          if (!(distance <= 45)) {
            _context2.next = 29;
            break;
          }

          isValidLocation = true;
          return _context2.abrupt("break", 32);

        case 29:
          _iteratorNormalCompletion = true;
          _context2.next = 22;
          break;

        case 32:
          _context2.next = 38;
          break;

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](20);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 38:
          _context2.prev = 38;
          _context2.prev = 39;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 41:
          _context2.prev = 41;

          if (!_didIteratorError) {
            _context2.next = 44;
            break;
          }

          throw _iteratorError;

        case 44:
          return _context2.finish(41);

        case 45:
          return _context2.finish(38);

        case 46:
          if (isValidLocation) {
            _context2.next = 48;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            status: 0,
            message: 'Invalid Location: You are not within 45 meters of the allowed location.'
          }));

        case 48:
          coordinates = {
            latitude: latitude,
            longitude: longitude
          };

        case 49:
          if (coordinates) {
            _context2.next = 51;
            break;
          }

          return _context2.abrupt("return", res.status(500).json({
            message: 'Failed to get location'
          }));

        case 51:
          _context2.next = 53;
          return regeneratorRuntime.awrap(Salary.findOne({
            email: email
          }));

        case 53:
          salary = _context2.sent;

          if (salary) {
            _context2.next = 56;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Salary is empty"
          }));

        case 56:
          today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          existingRecord = salary.clockRecords.find(function (record) {
            var recordDate = new Date(record.clockIn);
            return recordDate >= today && recordDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          });

          if (existingRecord) {
            existingRecord.clockIn = now;
            existingRecord.clockInCoordinates = coordinates;
            existingRecord.clockOut = null;
            existingRecord.clockOutCoordinates = null;
            existingRecord.workDuration = null;
          } else {
            salary.clockRecords.push({
              clockIn: now,
              clockInCoordinates: coordinates,
              clockOut: null,
              clockOutCoordinates: null,
              workDuration: null
            });
          }

          _context2.next = 61;
          return regeneratorRuntime.awrap(salary.save());

        case 61:
          res.status(200).json({
            status: 1,
            message: 'Clock-in has been done successfully'
          });
          _context2.next = 68;
          break;

        case 64:
          _context2.prev = 64;
          _context2.t1 = _context2["catch"](2);
          console.error('Error saving clock record:', _context2.t1);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 68:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 64], [20, 34, 38, 46], [39,, 41, 45]]);
}); // const readIPAddresses = (companyName) => {
//     const filePath = getFilePath(companyName);
//     if (fs.existsSync(filePath)) {
//         const data = fs.readFileSync(filePath);
//         return JSON.parse(data);
//     }
//     return [];
// };

var readIPAddresses = function readIPAddresses(companyName) {
  try {
    var filePath = getFilePath(companyName);
    var data = fs.readFileSync(filePath, 'utf8');
    var ipList = JSON.parse(data);
    return ipList.map(function (entry) {
      return entry.latitude;
    }); // Extract IP addresses from the array of objects
  } catch (err) {
    console.error('Error reading IP addresses:', err);
    return [];
  }
};

var writeIPAddresses = function writeIPAddresses(companyName, ipAddresses) {
  var filePath = getFilePath(companyName);
  fs.writeFileSync(filePath, JSON.stringify(ipAddresses, null, 2));
}; // Function to read IP addresses from the file


var readIPAddressesed = function readIPAddressesed(companyName) {
  try {
    var filePath = getFilePath(companyName);
    var data = fs.readFileSync(filePath, 'utf8');
    console.log(data);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading IP addresses:', err);
    return [];
  }
}; // const haversineDistance = (coords1, coords2) => {
//   const toRad = (x) => x * Math.PI / 180;
//   const R = 6371; // Radius of Earth in km
//   const dLat = toRad(coords2.latitude - coords1.latitude);
//   const dLon = toRad(coords2.longitude - coords1.longitude);
//   const lat1 = toRad(coords1.latitude);
//   const lat2 = toRad(coords2.latitude);
//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
//   return R * c; // Distance in km
// };


var readCompanyData = function readCompanyData(companyName) {
  try {
    var filePath = getFilePath(companyName);
    var data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading company data:', err);
    return [];
  }
}; // router.post('/clock-inn', jwtMiddleware, async (req, res) => {
//   const company = req.user.adminCompanyName;
//   const { email, role, ip, latitude, longitude } = req.body;
//   const now = new Date();
//   let coordinates;
//   if (role === 'Sales Employee') {
//     coordinates = { latitude, longitude };
//   } else {
//     const validIPs = readIPAddresses(company);
//     console.log(validIPs);
//     if (validIPs.includes(ip)) {
//       coordinates = { latitude, longitude };
//     } else {
//       return res.status(403).json({ message: 'Invalid work location tracked' });
//     }
//   }
//   if (!coordinates) {
//     return res.status(500).json({ message: 'Failed to get location' });
//   }
//   try {
//     const salary = await Salary.findOne({ email });
//     if (!salary) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     // Check for existing clockIn record on the same day
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const existingRecord = salary.clockRecords.find(record => {
//       const recordDate = new Date(record.clockIn);
//       return recordDate >= today && recordDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
//     });
//     if (existingRecord) {
//       // Update existing record with new clockIn time
//       existingRecord.clockIn = now;
//       existingRecord.clockInCoordinates = coordinates;
//       existingRecord.clockOut = null;
//       existingRecord.clockOutCoordinates = null;
//       existingRecord.workDuration = null;
//     } else {
//       // Create a new clockIn record
//       salary.clockRecords.push({
//         clockIn: now,
//         clockInCoordinates: coordinates,
//         clockOut: null,
//         clockOutCoordinates: null,
//         workDuration: null
//       });
//     }
//     await salary.save();
//     res.status(200).json({ message: 'Clocked in successfully' });
//   } catch (error) {
//     console.error('Error saving clock record:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
// router.post('/clock-inn', async (req, res) => {
//   const { email, role, latitude, longitude } = req.body;
//   const now = new Date();
//   let coordinates;
//   try {
//     const subEmployee = await SubEmployee.findOne({ email });
//     if (!subEmployee) {
//       return res.status(404).json({ message: 'Sub-employee not found' });
//     }
//     const adminCompanyName = subEmployee.adminCompanyName;
//     console.log(adminCompanyName);
//     const companyData = readCompanyData(adminCompanyName);
//     console.log(companyData);
//     if (role === 'Sales Employee') {
//       coordinates = { latitude, longitude };
//     } else {
//       const matchingLocations = companyData.filter(entry => entry.adminCompanyName === adminCompanyName);
//       console.log("matchingLocations", matchingLocations);
//       let isValidLocation = false;
//       for (const location of matchingLocations) {
//         const distance = haversineDistance({ latitude, longitude }, { latitude: location.latitude, longitude: location.longitude });
//         console.log(distance.toString())
//         if (distance <= 100) {
//           isValidLocation = true;
//           break;
//         }
//       }
//       if (!isValidLocation) {
//         return res.status(403).json({ message: 'Invalid work location tracked' });
//       }
//       coordinates = { latitude, longitude };
//     }
//     if (!coordinates) {
//       return res.status(500).json({ message: 'Failed to get location' });
//     }
//     const salary = await Salary.findOne({ email });
//     if (!salary) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const existingRecord = salary.clockRecords.find(record => {
//       const recordDate = new Date(record.clockIn);
//       return recordDate >= today && recordDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
//     });
//     if (existingRecord) {
//       existingRecord.clockIn = now;
//       existingRecord.clockInCoordinates = coordinates;
//       existingRecord.clockOut = null;
//       existingRecord.clockOutCoordinates = null;
//       existingRecord.workDuration = null;
//     } else {
//       salary.clockRecords.push({
//         clockIn: now,
//         clockInCoordinates: coordinates,
//         clockOut: null,
//         clockOutCoordinates: null,
//         workDuration: null
//       });
//     }
//     await salary.save();
//     res.status(200).json({ message: 'Clocked in successfully' });
//   } catch (error) {
//     console.error('Error saving clock record:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


router.post('/clock-outtNEW', function _callee3(req, res) {
  var _req$body2, email, role, latitude, longitude, org, now, coordinates, subEmployee, adminCompanyName, companyData, matchingLocations, isValidLocation, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, location, distance, salary, lastClockRecord, workDuration;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, role = _req$body2.role, latitude = _req$body2.latitude, longitude = _req$body2.longitude, org = _req$body2.org;
          now = new Date();
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(SubEmployee.findOne({
            email: email
          }));

        case 5:
          subEmployee = _context3.sent;

          if (subEmployee) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Sub-employee not found'
          }));

        case 8:
          adminCompanyName = subEmployee.adminCompanyName;
          console.log(adminCompanyName);
          companyData = readCompanyData(adminCompanyName);
          console.log(companyData);

          if (!(role === 'Sales Employee')) {
            _context3.next = 16;
            break;
          }

          coordinates = {
            latitude: latitude,
            longitude: longitude
          };
          _context3.next = 51;
          break;

        case 16:
          matchingLocations = companyData.filter(function (entry) {
            return entry.adminCompanyName === adminCompanyName && entry.org === org;
          });
          console.log("matchingLocations", matchingLocations);
          isValidLocation = false;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context3.prev = 22;
          _iterator2 = matchingLocations[Symbol.iterator]();

        case 24:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context3.next = 34;
            break;
          }

          location = _step2.value;
          distance = haversineDistance(latitude, longitude, location.latitude, location.longitude);
          console.log(distance);

          if (!(distance <= 45)) {
            _context3.next = 31;
            break;
          }

          isValidLocation = true;
          return _context3.abrupt("break", 34);

        case 31:
          _iteratorNormalCompletion2 = true;
          _context3.next = 24;
          break;

        case 34:
          _context3.next = 40;
          break;

        case 36:
          _context3.prev = 36;
          _context3.t0 = _context3["catch"](22);
          _didIteratorError2 = true;
          _iteratorError2 = _context3.t0;

        case 40:
          _context3.prev = 40;
          _context3.prev = 41;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 43:
          _context3.prev = 43;

          if (!_didIteratorError2) {
            _context3.next = 46;
            break;
          }

          throw _iteratorError2;

        case 46:
          return _context3.finish(43);

        case 47:
          return _context3.finish(40);

        case 48:
          if (isValidLocation) {
            _context3.next = 50;
            break;
          }

          return _context3.abrupt("return", res.status(200).json({
            status: 0,
            message: 'Clocked out failed: You are not within 45 meters of the allowed location.'
          }));

        case 50:
          coordinates = {
            latitude: latitude,
            longitude: longitude
          };

        case 51:
          if (coordinates) {
            _context3.next = 53;
            break;
          }

          return _context3.abrupt("return", res.status(500).json({
            message: 'Failed to get location'
          }));

        case 53:
          _context3.prev = 53;
          _context3.next = 56;
          return regeneratorRuntime.awrap(Salary.findOne({
            email: email
          }));

        case 56:
          salary = _context3.sent;

          if (salary) {
            _context3.next = 59;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Employee not found'
          }));

        case 59:
          lastClockRecord = salary.clockRecords[salary.clockRecords.length - 1];

          if (!(!lastClockRecord || !lastClockRecord.clockIn)) {
            _context3.next = 62;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'No active clock-in found'
          }));

        case 62:
          workDuration = (now - new Date(lastClockRecord.clockIn)) / (1000 * 60 * 60); // Duration in hours

          lastClockRecord.clockOut = now;
          lastClockRecord.clockOutCoordinates = coordinates;
          lastClockRecord.workDuration = workDuration;
          _context3.next = 68;
          return regeneratorRuntime.awrap(salary.save());

        case 68:
          res.status(200).json({
            status: 1,
            message: 'Clocked out successfully'
          });
          _context3.next = 75;
          break;

        case 71:
          _context3.prev = 71;
          _context3.t1 = _context3["catch"](53);
          console.error('Error during clock-out:', _context3.t1);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 75:
          _context3.next = 81;
          break;

        case 77:
          _context3.prev = 77;
          _context3.t2 = _context3["catch"](2);
          console.error('Error processing request:', _context3.t2);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 81:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 77], [22, 36, 40, 48], [41,, 43, 47], [53, 71]]);
}); // router.post('/clock-outt', async (req, res) => {
//   const { email, role, latitude, longitude } = req.body;
//   const now = new Date();
//   let coordinates;
//   try {
//     const subEmployee = await SubEmployee.findOne({ email });
//     if (!subEmployee) {
//       return res.status(404).json({ message: 'Sub-employee not found' });
//     }
//     const adminCompanyName = subEmployee.adminCompanyName;
//     console.log(adminCompanyName);
//     const companyData = readCompanyData(adminCompanyName);
//     console.log(companyData);
//     if (role === 'Sales Employee') {
//       coordinates = { latitude, longitude };
//     } else {
//       const matchingLocations = companyData.filter(entry => entry.adminCompanyName === adminCompanyName);
//       console.log("matchingLocations", matchingLocations);
//       let isValidLocation = false;
//       for (const location of matchingLocations) {
//         const distance = haversineDistance({ latitude, longitude }, { latitude: location.latitude, longitude: location.longitude });
//         console.log(distance.toString())
//         if (distance <= 100) {
//           isValidLocation = true;
//           break;
//         }
//       }
//       if (!isValidLocation) {
//         return res.status(403).json({ message: 'Invalid work location tracked' });
//       }
//       coordinates = { latitude, longitude };
//     }
//     if (!coordinates) {
//       return res.status(500).json({ message: 'Failed to get location' });
//     }
//     try {
//       const salary = await Salary.findOne({ email });
//       if (!salary) {
//         return res.status(404).json({ message: 'Employee not found' });
//       }
//       const lastClockRecord = salary.clockRecords[salary.clockRecords.length - 1];
//       if (!lastClockRecord || !lastClockRecord.clockIn) {
//         return res.status(400).json({ message: 'No active clock-in found' });
//       }
//       const workDuration = (now - new Date(lastClockRecord.clockIn)) / (1000 * 60 * 60); // Duration in hours
//       lastClockRecord.clockOut = now;
//       lastClockRecord.clockOutCoordinates = coordinates;
//       lastClockRecord.workDuration = workDuration;
//       await salary.save();
//       res.status(200).json({ message: 'Clocked out successfully' });
//     } catch (error) {
//       console.error('Error during clock-out:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.post('/calculate-salaryNEW/:email', jwtMiddleware, function _callee4(req, res) {
  var email, _req$body3, startDate, endDate, normalizeDate, start, end, employee, salary, totalHours, total;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          email = req.params.email;
          _req$body3 = req.body, startDate = _req$body3.startDate, endDate = _req$body3.endDate;
          console.log("Email from request params: ".concat(email));

          normalizeDate = function normalizeDate(date) {
            var normalized = new Date(date);
            normalized.setUTCHours(0, 0, 0, 0);
            return normalized;
          };

          start = normalizeDate(startDate);
          end = normalizeDate(endDate);
          _context4.prev = 6;
          _context4.next = 9;
          return regeneratorRuntime.awrap(SubEmployee.findOne({
            email: email
          }));

        case 9:
          employee = _context4.sent;
          console.log("Employee found: ".concat(employee));

          if (employee) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Employee not found'
          }));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(Salary.findOne({
            email: employee.email
          }));

        case 15:
          salary = _context4.sent;

          if (salary) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Salary information not found'
          }));

        case 18:
          totalHours = 1;
          salary.clockRecords.forEach(function (record) {
            var clockIn = normalizeDate(record.clockIn);
            var clockOut = normalizeDate(record.clockOut);

            if (clockIn >= start && clockOut <= end) {
              totalHours += record.workDuration;
            }
          });
          total = totalHours * salary.hourlyRate;
          res.status(200).json({
            total: total
          });
          _context4.next = 28;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](6);
          console.error('Error calculating salary:', _context4.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 24]]);
});
router.post('/calculate-salary/:employeeId', function _callee5(req, res) {
  var employeeId, _req$body4, startDate, endDate, normalizeDate, start, end, employee, salary, totalHours, total;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          employeeId = req.params.employeeId;
          _req$body4 = req.body, startDate = _req$body4.startDate, endDate = _req$body4.endDate; // Function to normalize date to midnight UTC

          normalizeDate = function normalizeDate(date) {
            var normalized = new Date(date);
            normalized.setUTCHours(0, 0, 0, 0);
            return normalized;
          };

          start = normalizeDate(startDate);
          end = normalizeDate(endDate);
          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap(SubEmployee.findById(employeeId));

        case 8:
          employee = _context5.sent;

          if (employee) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Employee not found'
          }));

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(Salary.findOne({
            email: employee.email
          }));

        case 13:
          salary = _context5.sent;

          if (salary) {
            _context5.next = 16;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Salary information not found'
          }));

        case 16:
          totalHours = 0;
          salary.clockRecords.forEach(function (record) {
            var clockIn = normalizeDate(record.clockIn);
            var clockOut = normalizeDate(record.clockOut);

            if (clockIn >= start && clockOut <= end) {
              totalHours += record.workDuration;
            }
          });
          total = totalHours * salary.hourlyRate;
          res.status(200).json({
            total: total
          });
          _context5.next = 26;
          break;

        case 22:
          _context5.prev = 22;
          _context5.t0 = _context5["catch"](5);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 22]]);
});
router.get('/employee/subemployees/details', function _callee6(req, res) {
  var name, employee;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          name = req.query.name;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Salary.findOne({
            name: name
          }));

        case 4:
          employee = _context6.sent;

          if (employee) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Employee not found'
          }));

        case 7:
          res.status(200).json({
            email: employee.email
          });
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](1);
          console.error('Error fetching employee details:', _context6.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
router.post('/set-rate', function _callee7(req, res) {
  var _req$body5, name, email, hourlyRate, companyName, salary;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body5 = req.body, name = _req$body5.name, email = _req$body5.email, hourlyRate = _req$body5.hourlyRate, companyName = _req$body5.companyName; //await connectToDatabase();

          _context7.next = 3;
          return regeneratorRuntime.awrap(Salary.findOneAndUpdate({
            name: name,
            email: email,
            companyName: companyName
          }, {
            hourlyRate: hourlyRate
          }, {
            "new": true,
            upsert: true
          }));

        case 3:
          salary = _context7.sent;

          if (salary) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'Employee not found'
          }));

        case 6:
          res.status(200).json({
            message: 'Hourly rate updated successfully',
            salary: salary
          });

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // router.get('/salary', jwtMiddleware, async (req, res) => {
//   const { name, startDate, endDate } = req.query;
//   if (!name || !startDate || !endDate) {
//     return res.status(400).json({ message: 'Name, startDate, and endDate are required' });
//   }
//   try {
//     const start = new Date(startDate);
//     start.setUTCHours(0, 0, 0, 0);  // Set the start date to the beginning of the day
//     const end = new Date(endDate);
//     end.setUTCHours(23, 59, 59, 999);  // Set the end date to the end of the day
//     const adminCompanyName = req.user.adminCompanyName; // Extracted from the token
//     console.log(adminCompanyName)
//     const salaries = await Salary.find({
//       name: name,
//       'clockRecords.clockIn': { $gte: start, $lte: end },
//       companyName: adminCompanyName  // Include company filter
//     });
//     console.log(salaries)
//     res.status(200).json(salaries);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

router.get('/salary', jwtMiddleware, function _callee8(req, res) {
  var _req$query, name, startDate, endDate, today, start, end, adminCompanyName, query, salaries;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$query = req.query, name = _req$query.name, startDate = _req$query.startDate, endDate = _req$query.endDate; // Get today's date in UTC

          today = new Date();
          today.setUTCHours(0, 0, 0, 0); // Determine the start and end date for the query

          start = startDate ? new Date(startDate) : today;
          start.setUTCHours(0, 0, 0, 0); // Set the start date to the beginning of the day

          end = endDate ? new Date(endDate) : new Date(today);
          end.setUTCHours(23, 59, 59, 999); // Set the end date to the end of the day

          _context8.prev = 7;
          adminCompanyName = req.user.adminCompanyName; // Extracted from the token
          // Build the query object

          query = {
            'clockRecords.clockIn': {
              $gte: start,
              $lte: end
            },
            companyName: adminCompanyName
          }; // Add the name filter if provided

          if (name) {
            query.name = name;
          }

          _context8.next = 13;
          return regeneratorRuntime.awrap(Salary.find(query));

        case 13:
          salaries = _context8.sent;
          res.status(200).json(salaries);
          _context8.next = 20;
          break;

        case 17:
          _context8.prev = 17;
          _context8.t0 = _context8["catch"](7);
          res.status(500).json({
            message: 'Server error',
            error: _context8.t0
          });

        case 20:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[7, 17]]);
}); // router.get('/empSalary', jwtMiddleware, async (req, res) => {
//   const { startDate, endDate } = req.query;
//   const name = req.user.name; // Extracted from the token
//   if (!name || !startDate || !endDate) {
//     return res.status(400).json({ message: 'Name, startDate, and endDate are required' });
//   }
//   try {
//     const start = new Date(startDate);
//     start.setUTCHours(0, 0, 0, 0);  // Set the start date to the beginning of the day
//     const end = new Date(endDate);
//     end.setUTCHours(23, 59, 59, 999);  // Set the end date to the end of the day
//     // console.log(adminCompanyName)
//     const salaries = await Salary.find({
//       name: name,
//       'clockRecords.clockIn': { $gte: start, $lte: end },
//       name: name  // Include company filter
//     });
//     console.log(salaries)
//     res.status(200).json(salaries);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

router.get('/empSalary', jwtMiddleware, function _callee9(req, res) {
  var _req$query2, startDate, endDate, name, today, start, end, salaries;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$query2 = req.query, startDate = _req$query2.startDate, endDate = _req$query2.endDate;
          name = req.user.name; // Extracted from the token

          if (name) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: 'Name is required'
          }));

        case 4:
          _context9.prev = 4;
          // If startDate and endDate are not provided, use today's date
          today = new Date();

          if (!startDate) {
            startDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }

          if (!endDate) {
            endDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }

          start = new Date(startDate);
          start.setUTCHours(0, 0, 0, 0); // Set the start date to the beginning of the day

          end = new Date(endDate);
          end.setUTCHours(23, 59, 59, 999); // Set the end date to the end of the day

          _context9.next = 14;
          return regeneratorRuntime.awrap(Salary.find({
            name: name,
            'clockRecords.clockIn': {
              $gte: start,
              $lte: end
            }
          }));

        case 14:
          salaries = _context9.sent;
          res.status(200).json(salaries);
          _context9.next = 21;
          break;

        case 18:
          _context9.prev = 18;
          _context9.t0 = _context9["catch"](4);
          res.status(500).json({
            message: 'Server error',
            error: _context9.t0
          });

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[4, 18]]);
});
router.put('/salary/:recordId', jwtMiddleware, function _callee10(req, res) {
  var _req$body6, clockIn, clockOut, recordId, salary;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body6 = req.body, clockIn = _req$body6.clockIn, clockOut = _req$body6.clockOut;
          recordId = req.params.recordId; // Get recordId from URL parameters

          if (recordId) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            message: 'Record ID not found'
          }));

        case 4:
          _context10.prev = 4;
          _context10.next = 7;
          return regeneratorRuntime.awrap(Salary.findOne({
            'clockRecords._id': recordId
          }));

        case 7:
          salary = _context10.sent;

          if (!salary) {
            _context10.next = 16;
            break;
          }

          // Update clockIn and/or clockOut within clockRecords
          salary.clockRecords.forEach(function (record) {
            // console.log("record._id",record._id); // Log record._id for each clockRecords object
            if (record._id.toString() === recordId.toString()) {
              // Corrected to access record._id
              if (clockIn) {
                record.clockIn = new Date(clockIn);
              }

              if (clockOut) {
                record.clockOut = new Date(clockOut);
              }
            }
          });
          _context10.next = 12;
          return regeneratorRuntime.awrap(salary.save());

        case 12:
          // Save the updated salary object
          console.log("salary", salary); // Log the updated salary object

          res.status(200).json(salary); // Respond with the updated salary object

          _context10.next = 17;
          break;

        case 16:
          return _context10.abrupt("return", res.status(404).json({
            message: 'Record not found'
          }));

        case 17:
          _context10.next = 22;
          break;

        case 19:
          _context10.prev = 19;
          _context10.t0 = _context10["catch"](4);
          res.status(500).json({
            message: 'Server error',
            error: _context10.t0
          });

        case 22:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[4, 19]]);
}); // Delete Salary Record

router["delete"]('/salary/:id', jwtMiddleware, function _callee11(req, res) {
  var recordId, result;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          recordId = req.params.id; // Getting recordId from params

          _context11.prev = 1;
          _context11.next = 4;
          return regeneratorRuntime.awrap(Salary.updateOne({
            'clockRecords._id': recordId
          }, {
            $pull: {
              clockRecords: {
                _id: recordId
              }
            }
          }));

        case 4:
          result = _context11.sent;

          if (!(result.nModified === 0)) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'Salary record not found'
          }));

        case 7:
          res.status(200).json({
            message: 'Salary record deleted successfully'
          });
          _context11.next = 13;
          break;

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context11.t0
          });

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
var IPAPI_URL = 'https://ipapi.co';
router.post('/ip', jwtMiddleware, function _callee12(req, res) {
  var ip, companyName, adminName, ipAddresses, response, _response$data, latitude, longitude, org;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          ip = req.body.ip;
          companyName = req.user.adminCompanyName;
          adminName = req.user.adminName;

          if (ip) {
            _context12.next = 5;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            message: 'IP address is required'
          }));

        case 5:
          if (companyName) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            message: 'Company name is required'
          }));

        case 7:
          ipAddresses = readIPAddressesed(companyName); // Check if the IP address already exists

          if (!ipAddresses.some(function (entry) {
            return entry.ip === ip;
          })) {
            _context12.next = 10;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            message: 'IP address already exists'
          }));

        case 10:
          _context12.prev = 10;
          _context12.next = 13;
          return regeneratorRuntime.awrap(axios.get("".concat(IPAPI_URL, "/").concat(ip, "/json")));

        case 13:
          response = _context12.sent;
          _response$data = response.data, latitude = _response$data.latitude, longitude = _response$data.longitude, org = _response$data.org;

          if (!(!latitude || !longitude)) {
            _context12.next = 17;
            break;
          }

          return _context12.abrupt("return", res.status(400).json({
            message: 'Unable to fetch geolocation data'
          }));

        case 17:
          // Add the new IP address along with latitude, longitude, and adminName to the list
          ipAddresses.push({
            ip: ip,
            latitude: latitude,
            longitude: longitude,
            adminCompanyName: companyName,
            org: org,
            adminName: adminName
          }); // Write updated IP addresses back to storage

          writeIPAddresses(companyName, ipAddresses);
          res.status(201).json({
            message: 'IP address stored successfully',
            ip: ip,
            latitude: latitude,
            longitude: longitude,
            org: org
          });
          _context12.next = 26;
          break;

        case 22:
          _context12.prev = 22;
          _context12.t0 = _context12["catch"](10);
          console.error('Error fetching geolocation data:', _context12.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 26:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[10, 22]]);
}); // GET endpoint to fetch all IP addresses with their geolocation data

router.get('/ip', jwtMiddleware, function (req, res) {
  var companyName = req.user.adminCompanyName;

  if (!companyName) {
    return res.status(400).json({
      message: 'Company name is required'
    });
  }

  var ipAddresses = readIPAddressesed(companyName);
  res.status(200).json(ipAddresses);
});
router.post('/calculate-hourly-wage', function (req, res) {
  var _req$body7 = req.body,
      totalSalary = _req$body7.totalSalary,
      days = _req$body7.days,
      dailyShift = _req$body7.dailyShift;

  if (!totalSalary || !days || !dailyShift) {
    return res.status(400).json({
      error: 'Please provide totalSalary, days, and dailyShift'
    });
  }

  var hourlyRate = totalSalary / days / dailyShift;
  res.json({
    hourlyRate: hourlyRate
  });
});
router.post('/employee-work-hours', jwtMiddleware, function _callee13(req, res) {
  var _req$body8, email, date, adminEmployee, adminCompanyName, queryDate, startOfDay, endOfDay, employees, results;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body8 = req.body, email = _req$body8.email, date = _req$body8.date;
          _context13.prev = 1;
          _context13.next = 4;
          return regeneratorRuntime.awrap(SubEmployee.findOne({
            email: email
          }));

        case 4:
          adminEmployee = _context13.sent;

          if (adminEmployee) {
            _context13.next = 7;
            break;
          }

          return _context13.abrupt("return", res.status(404).json({
            message: 'Admin employee not found'
          }));

        case 7:
          adminCompanyName = adminEmployee.adminCompanyName; // Parse the date or use today's date

          queryDate = date ? new Date(date) : new Date();
          startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
          endOfDay = new Date(queryDate.setHours(23, 59, 59, 999)); // Find employees in the same company and their work records for the specified date

          _context13.next = 13;
          return regeneratorRuntime.awrap(Salary.find({
            companyName: adminCompanyName
          }));

        case 13:
          employees = _context13.sent;
          results = employees.map(function (employee) {
            var clockRecords = employee.clockRecords.filter(function (record) {
              var clockInDate = new Date(record.clockIn);
              return clockInDate >= startOfDay && clockInDate <= endOfDay;
            }).map(function (record) {
              return {
                clockIn: record.clockIn,
                clockOut: record.clockOut,
                workDuration: record.workDuration,
                clockInCoordinates: record.clockInCoordinates,
                clockOutCoordinates: record.clockOutCoordinates
              };
            });
            return {
              name: employee.name,
              email: employee.email,
              clockRecords: clockRecords
            };
          });
          res.status(200).json(results);
          _context13.next = 22;
          break;

        case 18:
          _context13.prev = 18;
          _context13.t0 = _context13["catch"](1);
          console.error('Error fetching employee work hours:', _context13.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 22:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[1, 18]]);
});
module.exports = router;