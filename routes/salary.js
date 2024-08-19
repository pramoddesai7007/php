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

const Salary = require('../models/Salary');
const SubEmployee = require('../models/SubEmployee');
const express = require('express');
const router = express.Router();
const getLocation = require('../utils/geoLocation');
const fs = require('fs');
const path = require('path');
const jwtMiddleware = require('../jwtmiddleware');
const axios = require('axios')

// const IP_FILE = path.join(__dirname, 'IP.json'); // Adjust path as needed
const getFilePath = (companyName) => path.join(__dirname, `../data/${companyName}_ips.json`);

router.get('/clock-inn/:email', async (req, res) => {
  const { email } = req.params; 
  console.log(email);

  try {
    const subEmployee = await Salary.find({ email });
    if (!subEmployee ) {
      return res.status(404).json({ message: 'No clock records found for this sub-employee.' });
    }
  
    const clockRecords = subEmployee;

  
    res.status(200).json(clockRecords);
  } catch (error) {
    console.error('Error retrieving clock records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/timestamp/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const subEmployee = await Salary.findOne({ email }); 
    if (!subEmployee || !subEmployee.clockRecords) {
      return res.status(404).json({ message: 'No clock records found for this sub-employee.' });
    }
  
    // Extracting relevant data from clockRecords
    const clockRecords = subEmployee.clockRecords.map(record => {
      const clockInDate = record.clockIn ? record.clockIn.toISOString() : null;
      const clockOutDate = record.clockOut ? record.clockOut.toISOString() : null;

      return {
        date: clockInDate ? clockInDate.substring(0, 10) : null, // Extracting date from ISO string
        clockIn: clockInDate ? clockInDate.substring(11, 19) : null, // Extracting time from ISO string
        clockOut: clockOutDate ? clockOutDate.substring(11, 19) : null, // Extracting time or null
        workDuration: record.workDuration !== null ? record.workDuration.toFixed(2) : null // Formatting work duration
      };
    });
  
    res.status(200).json(clockRecords);
  } catch (error) {
    console.error('Error retrieving clock records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = degrees => degrees * (Math.PI / 180);
  const R = 6371e3; // Radius of Earth in meters

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
};

router.post('/clock-innNEW', jwtMiddleware, async (req, res) => {
  const { email, role, org, latitude, longitude } = req.body; 
  const now = new Date();
  let coordinates;

  try {
    const subEmployee = await SubEmployee.findOne({ email });
    if (!subEmployee) {
      console.log(email);
      return res.status(404).json({ message: `Sub-employee not found for ${email}` });
    }

    const adminCompanyName = subEmployee.adminCompanyName;
    const companyData = readCompanyData(adminCompanyName);

    if (role === 'Sales Employee') {
      coordinates = { latitude, longitude };
    } else {
      const matchingLocations = companyData.filter(entry => 
        entry.adminCompanyName === adminCompanyName &&
        entry.org === org
      );

      let isValidLocation = false;
      for (const location of matchingLocations) {
        const distance = haversineDistance(latitude, longitude, location.latitude, location.longitude);

        console.log(distance);


        if (distance <= 45) { 
          isValidLocation = true;
          break;
        }
      }




      if (!isValidLocation) {
        return res.status(403).json({ status: 0, message: 'Invalid Location: You are not within 45 meters of the allowed location.' });
      }

      coordinates = { latitude, longitude };
    }

    if (!coordinates) {
      return res.status(500).json({ message: 'Failed to get location' });
    }

    const salary = await Salary.findOne({ email });
    if (!salary) {
      return res.status(404).json({ message: `Salary is empty` });
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const existingRecord = salary.clockRecords.find(record => {
      const recordDate = new Date(record.clockIn);
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

    await salary.save();

    res.status(200).json({ status: 1, message: 'Clock-in has been done successfully' });
  } catch (error) {
    console.error('Error saving clock record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// const readIPAddresses = (companyName) => {
//     const filePath = getFilePath(companyName);
//     if (fs.existsSync(filePath)) {
//         const data = fs.readFileSync(filePath);
//         return JSON.parse(data);
//     }
//     return [];
// };


const readIPAddresses = (companyName) => {
  try {
    const filePath = getFilePath(companyName);
    const data = fs.readFileSync(filePath, 'utf8');
    const ipList = JSON.parse(data);
    return ipList.map(entry => entry.latitude); // Extract IP addresses from the array of objects
  } catch (err) {
    console.error('Error reading IP addresses:', err);
    return [];
  }
};

const writeIPAddresses = (companyName, ipAddresses) => {
  const filePath = getFilePath(companyName);
  fs.writeFileSync(filePath, JSON.stringify(ipAddresses, null, 2));
};


// Function to read IP addresses from the file
const readIPAddressesed = (companyName) => {
  try {
    const filePath = getFilePath(companyName);
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(data);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading IP addresses:', err);
    return [];
  }
};


// const haversineDistance = (coords1, coords2) => {
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






const readCompanyData = (companyName) => {
  try {
    const filePath = getFilePath(companyName);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data); 
  } catch (err) {
    console.error('Error reading company data:', err);
    return [];
  }
};


// router.post('/clock-inn', jwtMiddleware, async (req, res) => {
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










router.post('/clock-outtNEW', async (req, res) => {
  const { email, role, latitude, longitude, org } = req.body;
  const now = new Date();

  let coordinates;
  try {
    const subEmployee = await SubEmployee.findOne({ email });
    if (!subEmployee) {
      return res.status(404).json({ message: 'Sub-employee not found' });
    }
    const adminCompanyName = subEmployee.adminCompanyName;
    console.log(adminCompanyName);
    const companyData = readCompanyData(adminCompanyName);
    console.log(companyData);

    if (role === 'Sales Employee') {
      coordinates = { latitude, longitude };
    } else {
      const matchingLocations = companyData.filter(entry => 
        entry.adminCompanyName === adminCompanyName &&
        entry.org === org
      );

      console.log("matchingLocations", matchingLocations);

      let isValidLocation = false;
      for (const location of matchingLocations) {
        const distance = haversineDistance(latitude, longitude, location.latitude, location.longitude);
        console.log(distance);
    
        if (distance <= 45) { 
        
          isValidLocation = true;
          break;
        }
      }

      if (!isValidLocation) {
        return res.status(200).json({ status: 0, message: 'Clocked out failed: You are not within 45 meters of the allowed location.' });
      }

      coordinates = { latitude, longitude };
    }

    if (!coordinates) {
      return res.status(500).json({ message: 'Failed to get location' });
    }

    try {
      const salary = await Salary.findOne({ email });
      if (!salary) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      const lastClockRecord = salary.clockRecords[salary.clockRecords.length - 1];

      if (!lastClockRecord || !lastClockRecord.clockIn) {
        return res.status(400).json({ message: 'No active clock-in found' });
      }

      const workDuration = (now - new Date(lastClockRecord.clockIn)) / (1000 * 60 * 60); // Duration in hours

      lastClockRecord.clockOut = now;
      lastClockRecord.clockOutCoordinates = coordinates;
      lastClockRecord.workDuration = workDuration;

      await salary.save();
      res.status(200).json({ status: 1, message: 'Clocked out successfully' });
    } catch (error) {
      console.error('Error during clock-out:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// router.post('/clock-outt', async (req, res) => {
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







router.post('/calculate-salaryNEW/:email', jwtMiddleware, async (req, res) => {
  const { email } = req.params;
  const { startDate, endDate } = req.body;

  console.log(`Email from request params: ${email}`);

    const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
  };

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  try {
    const employee = await SubEmployee.findOne({ email });
    console.log(`Employee found: ${employee}`);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const salary = await Salary.findOne({ email: employee.email });
    if (!salary) {
      return res.status(404).json({ message: 'Salary information not found' });
    }

    let totalHours = 1;

    salary.clockRecords.forEach(record => {
      const clockIn = normalizeDate(record.clockIn);
      const clockOut = normalizeDate(record.clockOut);

      if (clockIn >= start && clockOut <= end) {
        totalHours += record.workDuration;
      }
    });

    const total = totalHours * salary.hourlyRate;

    res.status(200).json({ total });
  } catch (error) {
    console.error('Error calculating salary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/calculate-salary/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.body;

  // Function to normalize date to midnight UTC
  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
  };

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  try {
    // Find the employee in subEmployee model
    const employee = await SubEmployee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Now find the salary using the employee's name or email
    const salary = await Salary.findOne({ email: employee.email });
    if (!salary) {
      return res.status(404).json({ message: 'Salary information not found' });
    }

    let totalHours = 0;

    salary.clockRecords.forEach(record => {
      const clockIn = normalizeDate(record.clockIn);
      const clockOut = normalizeDate(record.clockOut);

      if (clockIn >= start && clockOut <= end) {
        totalHours += record.workDuration;
      }
    });

    const total = totalHours * salary.hourlyRate;

    res.status(200).json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/employee/subemployees/details', async (req, res) => {
  const { name } = req.query;

  try {
    const employee = await Salary.findOne({ name });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ email: employee.email });
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.post('/set-rate', async (req, res) => {
  const { name, email, hourlyRate, companyName } = req.body;

  //await connectToDatabase();

  const salary = await Salary.findOneAndUpdate(
    { name, email, companyName },
    { hourlyRate },
    { new: true, upsert: true }
  );

  if (!salary) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  res.status(200).json({ message: 'Hourly rate updated successfully', salary });
});




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

router.get('/salary', jwtMiddleware, async (req, res) => {
  const { name, startDate, endDate } = req.query;

  // Get today's date in UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Determine the start and end date for the query
  const start = startDate ? new Date(startDate) : today;
  start.setUTCHours(0, 0, 0, 0);  // Set the start date to the beginning of the day

  const end = endDate ? new Date(endDate) : new Date(today);
  end.setUTCHours(23, 59, 59, 999);  // Set the end date to the end of the day

  try {
    const adminCompanyName = req.user.adminCompanyName; // Extracted from the token

    // Build the query object
    const query = {
      'clockRecords.clockIn': { $gte: start, $lte: end },
      companyName: adminCompanyName
    };

    // Add the name filter if provided
    if (name) {
      query.name = name;
    }

    const salaries = await Salary.find(query);
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



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



router.get('/empSalary', jwtMiddleware, async (req, res) => {
  let { startDate, endDate } = req.query;
  const name = req.user.name; // Extracted from the token

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    // If startDate and endDate are not provided, use today's date
    const today = new Date();
    if (!startDate) {
      startDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    if (!endDate) {
      endDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0); // Set the start date to the beginning of the day

    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999); // Set the end date to the end of the day

    const salaries = await Salary.find({
      name: name,
      'clockRecords.clockIn': { $gte: start, $lte: end }
    });

    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



router.put('/salary/:recordId', jwtMiddleware, async (req, res) => {
  const { clockIn, clockOut } = req.body;
  const recordId = req.params.recordId; // Get recordId from URL parameters

  if (!recordId) {
    return res.status(400).json({ message: 'Record ID not found' });
  }
  // console.log(recordId); // Log the recordId to verify

  try {
    // Find the salary by _id
    let salary = await Salary.findOne({ 'clockRecords._id': recordId });
    // console.log(salary); // Log the found salary to verify

    if (salary) {
      // Update clockIn and/or clockOut within clockRecords
      salary.clockRecords.forEach(record => {
        // console.log("record._id",record._id); // Log record._id for each clockRecords object

        if (record._id.toString() === recordId.toString()) { // Corrected to access record._id
          if (clockIn) {
            record.clockIn = new Date(clockIn);
          }
          if (clockOut) {
            record.clockOut = new Date(clockOut);
          }
        }
      });

      await salary.save(); // Save the updated salary object

      console.log("salary", salary); // Log the updated salary object

      res.status(200).json(salary); // Respond with the updated salary object
    } else {
      return res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});




// Delete Salary Record
router.delete('/salary/:id', jwtMiddleware, async (req, res) => {
  const { id: recordId } = req.params; // Getting recordId from params

  try {
    // Find the salary document and pull the specific clock record
    const result = await Salary.updateOne(
      { 'clockRecords._id': recordId },
      { $pull: { clockRecords: { _id: recordId } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.status(200).json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

const IPAPI_URL = 'https://ipapi.co';

router.post('/ip', jwtMiddleware, async (req, res) => {
  const { ip } = req.body;
  const companyName = req.user.adminCompanyName;
  const adminName = req.user.adminName;

  if (!ip) {
    return res.status(400).json({ message: 'IP address is required' });
  }

  if (!companyName) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  const ipAddresses = readIPAddressesed(companyName);

  // Check if the IP address already exists
  if (ipAddresses.some(entry => entry.ip === ip)) {
    return res.status(400).json({ message: 'IP address already exists' });
  }

  try {
    // Fetch geolocation data from ipapi
    const response = await axios.get(`${IPAPI_URL}/${ip}/json`);
    const { latitude, longitude, org } = response.data;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Unable to fetch geolocation data' });
    }

    // Add the new IP address along with latitude, longitude, and adminName to the list
    ipAddresses.push({ ip, latitude, longitude, adminCompanyName: companyName, org, adminName });

    // Write updated IP addresses back to storage
    writeIPAddresses(companyName, ipAddresses);

    res.status(201).json({ message: 'IP address stored successfully', ip, latitude, longitude, org });
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// GET endpoint to fetch all IP addresses with their geolocation data
router.get('/ip', jwtMiddleware, (req, res) => {
  const companyName = req.user.adminCompanyName;

  if (!companyName) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  const ipAddresses = readIPAddressesed(companyName);
  res.status(200).json(ipAddresses);
});



router.post('/calculate-hourly-wage', (req, res) => {
  const { totalSalary, days, dailyShift } = req.body;

  if (!totalSalary || !days || !dailyShift) {
    return res.status(400).json({ error: 'Please provide totalSalary, days, and dailyShift' });
  }

  const hourlyRate = (totalSalary / days) / dailyShift;

  res.json({ hourlyRate });
});


router.post('/employee-work-hours', jwtMiddleware, async (req, res) => {
  const { email, date } = req.body;

  try {
    // Find the admin employee by email
    const adminEmployee = await SubEmployee.findOne({ email: email });
    if (!adminEmployee) {
      return res.status(404).json({ message: 'Admin employee not found' });
    }

    const adminCompanyName = adminEmployee.adminCompanyName;

    // Parse the date or use today's date
    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    // Find employees in the same company and their work records for the specified date
    const employees = await Salary.find({ companyName: adminCompanyName });

    const results = employees.map(employee => {
      const clockRecords = employee.clockRecords.filter(record => {
        const clockInDate = new Date(record.clockIn);
        return clockInDate >= startOfDay && clockInDate <= endOfDay;
      }).map(record => ({
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        workDuration: record.workDuration,
        clockInCoordinates: record.clockInCoordinates,
        clockOutCoordinates: record.clockOutCoordinates
      }));

      return {
        name: employee.name,
        email: employee.email,
        clockRecords
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching employee work hours:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;











