require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SubEmployee = require('../models/SubEmployee');
const Sales = require('../models/Sales');
const jwtMiddleware = require('../jwtmiddleware');
const Employee = require('../models/Employee');
const Salary = require('../models/Salary');



// const SUBEMPLOYEE_JWT_SECRET = "YourSubEmployeeSecretKey"
const SUBEMPLOYEE_JWT_SECRET = process.env.SUBEMPLOYEE_JWT_SECRET



router.get('/subemployees/clock-inn', jwtMiddleware, async (req, res) => {
  try {
    const authenticatedUser = req.user;
    console.log('Authenticated User:', authenticatedUser);

    if (!authenticatedUser) {
      console.error('Access denied: User not authenticated');
      return res.status(403).json({ error: 'Access denied: User not authenticated' });
    }

    let employees;

    if (authenticatedUser.role === 'admin') {
      console.log('Admin Company Name:', authenticatedUser.adminCompanyName);
      employees = await SubEmployee.find({ adminCompanyName: authenticatedUser.adminCompanyName });
    } else {
      console.log('Employee Company Name:', authenticatedUser.companyName);
      employees = await SubEmployee.find({ adminCompanyName: authenticatedUser.adminCompanyName });
    }

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No sub-employees found for this company.' });
    }

    const emailList = employees.map(employee => employee.email);
    const clockRecords = await Salary.find({ email: { $in: emailList } });

    if (clockRecords.length === 0) {
      return res.status(404).json({ message: 'No clock records found for the sub-employees.' });
    }

    res.status(200).json(clockRecords);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});











router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  console.log(email);
  console.log(password);

  try {
    // Find the sub-employee by email
    const subEmployee = await SubEmployee.findOne({ email });


    console.log("false");
    if (!subEmployee) {

      const salesEmployee = await Sales.findOne({ email });
      console.log(salesEmployee);
      const isPasswordValid = await bcrypt.compare(password, salesEmployee.password);


      console.log("isPasswordValid");


      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });

      }

      console.log("isPasswordValid");


      const token = jwt.sign(
        { subEmployeeId: Sales._id, email: Sales.email,
           role: 'Sales emp', adminCompanyName: salesEmployee.adminCompanyName,
            name: Sales.name },
        SUBEMPLOYEE_JWT_SECRET,
      );


      console.log("token");


      return res.status(200).json({ message: 'Authentication successful', token });
    }

    const isPasswordValid = await bcrypt.compare(password, subEmployee.password);

    console.log(isPasswordValid)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    // Create a JWT token with the sub-employee's information
    const token = jwt.sign(
      { subEmployeeId: subEmployee._id, email: subEmployee.email, role: 'sub-employee', adminCompanyName: subEmployee.adminCompanyName, name: subEmployee.name, type: subEmployee.type },
      SUBEMPLOYEE_JWT_SECRET,
    );
    
    return res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update Sub-employee
router.put('/update/:id', jwtMiddleware, async (req, res) => {
  const subEmployeeId = req.params.id;
  const { name, email, password, phoneNumber } = req.body;

  try {
    // Find the sub-employee by ID
    const subEmployee = await SubEmployee.findById(subEmployeeId);

    if (!subEmployee) {
      return res.status(404).json({ error: 'Sub-employee not found' });
    }

    // Update sub-employee fields selectively
    if (name) {
      subEmployee.name = name;
    }
    if (email) {
      subEmployee.email = email;
    }

    // if (password) {
    //   // Only update the password if a new password is provided
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   subEmployee.password = hashedPassword;
    // }
    if (phoneNumber) {
      subEmployee.phoneNumber = phoneNumber;
    }

    // Save the updated sub-employee
    await subEmployee.save();

    return res.status(200).json({ message: 'Sub-employee updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete Sub-employee
router.delete('/delete/:id', jwtMiddleware, async (req, res) => {
  const subEmployeeId = req.params.id;

  try {
    // Find the sub-employee by ID
    const subEmployee = await SubEmployee.findByIdAndDelete(subEmployeeId);

    if (!subEmployee) {
      return res.status(404).json({ error: 'Sub-employee not found' });
    }

    return res.status(200).json({ message: 'Sub-employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// router.get('/:id', jwtMiddleware, async (req, res) => {
//   const employeeId = req.params.id;

//   try {
//     // Find the employee by ID
//     const employee = await SubEmployee.findById(employeeId);

//     if (!employee) {
//       return res.status(404).json({ error: 'Employee not found' });
//     }

//     res.status(200).json(employee);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/:id', jwtMiddleware, async (req, res) => {
  const employeeId = req.params.id;

  try {

    // Find the employee by ID
    let employee;
    if (employeeId === req.user.employeeId) {
      employee = await Employee.findById(employeeId);
    } else {
      employee = await SubEmployee.findById(employeeId);
    }

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
