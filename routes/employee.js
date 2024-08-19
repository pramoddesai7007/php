
require('dotenv').config();


const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken'); // Import the 'jsonwebtoken' library
const jwtMiddleware = require('../jwtmiddleware');
const Employee = require('../models/Employee');
const SubEmployee = require('../models/SubEmployee');
const Salary = require('../models/Salary');
const Sales = require('../models/Sales');
const Task = require('../models/Task');
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET

// Route to register (sign up) an employee
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

router.post('/register', [
    // Validation rules using express-validator
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('adminCompanyName').notEmpty().withMessage('Admin Company Name is required'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format'), // Add phone number validation
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check if an employee with the same email already exists
        const existingEmployee = await Employee.findOne({ email: req.body.email });

        if (existingEmployee) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Find the admin user ID based on the selected admin company name
        const adminCompany = await Company.findOne({ companyName: req.body.adminCompanyName });

        if (!adminCompany) {
            return res.status(404).json({ error: 'Admin Company not found' });
        }

        // Hash the password using bcryptjs
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new employee with the adminUserId automatically set
        const newEmployee = new Employee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            adminUserId: adminCompany._id, // Assign the adminUserId from the lookup
            adminCompanyName: req.body.adminCompanyName,
            phoneNumber: req.body.phoneNumber, // Add phoneNumber
            companyId: req.body.companyId, // Assign the companyId from the request
            role: "Admin"
        });

        await newEmployee.save();

        // Create a new Subemployee with the details of the registered Employee as a supervisor
        const newSubemployee = new SubEmployee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            adminUserId: adminCompany._id,
            adminCompanyName: req.body.adminCompanyName,
            phoneNumber: req.body.phoneNumber,
            role: "Admin",
            type: req.body.type
        });

        await newSubemployee.save();

        res.status(201).json({ message: 'Employee registered successfully and stored as supervisor in Subemployee collection' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the provided credentials are for the super admin
        if (email === 'superadmin@gmail.com' && password === '@123456') {
            const token = jwt.sign(
                { email, role: 'superAdmin' },
                ADMIN_JWT_SECRET
            );
            console.log("Superadmin enters")
            return res.status(200).json({ message: 'Authentication successful', token });
        }

        // Check if an employee with the provided email exists
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, employee.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Determine the role of the employee (admin or sub-employee)
        let role;
        if (employee.adminCompanyName) {
            // This is an admin employee
            role = 'admin';
        } else {
            // This is a sub-employee
            role = 'sub-employee';
        }

        // Create a JWT token with the employee's information and role
        const token = jwt.sign(
            { email: employee.email, role, adminUserId: employee.adminUserId, adminCompanyName: employee.adminCompanyName, companyId: employee.companyId, employeeId: employee._id, name: employee.name },
            ADMIN_JWT_SECRET
        );

        return res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Route to edit an employee's information by ID and update it
router.put('/edit/:id', [
    // Validation rules using express-validator (customize as needed)
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('adminCompanyName').optional().notEmpty().withMessage('Admin Company Name is required'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format'), // Add phone number validation

], async (req, res) => {
    const employeeId = req.params.id;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Find the employee by ID
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Update employee information based on the provided fields
        if (req.body.name) {
            employee.name = req.body.name;
        }
        if (req.body.email) {
            employee.email = req.body.email;
        }
        // if (req.body.password) {
        //     const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //     employee.password = hashedPassword;
        // }
        if (req.body.adminCompanyName) {
            // Find the admin company ID based on the selected admin company name
            const adminCompany = await Company.findOne({ companyName: req.body.adminCompanyName });
            if (!adminCompany) {
                return res.status(404).json({ error: 'Admin Company not found' });
            }
            employee.adminUserId = adminCompany._id;
            employee.adminCompanyName = req.body.adminCompanyName;
        }

        if (req.body.phoneNumber) {
            employee.phoneNumber = req.body.phoneNumber; // Update phoneNumber
        }

        // Save the updated employee
        await employee.save();

        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/delete/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        // Use findByIdAndDelete to delete the employee from the Employee collection
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Find the corresponding record in the subEmployee collection based on a shared attribute (e.g., employeeName)
        const employeeEmail = deletedEmployee.email; // Adjust this based on your schema
        const deletedSubEmployee = await SubEmployee.findOneAndDelete({ email: employeeEmail });

        // Check if the employee was also found and deleted in the subEmployee collection
        if (!deletedSubEmployee) {
            return res.status(500).json({ error: 'Failed to delete from subEmployee collection' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// http://localhost:5000/api/employee/list
router.get('/list', async (req, res) => {
    try {
        // Retrieve all employee records from the database
        const employees = await Employee.find();

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.delete('/employee/deleteProfilePicture', jwtMiddleware, async (req, res) => {
    try {
        const employeeId = req.user.employeeId;

        // Find the employee by ID
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Check if there is a profile picture to delete
        if (employee.profilePicture) {
            const profilePicturePath = path.join(__dirname, '..', employee.profilePicture);

            // Delete the profile picture from the file system
            fs.unlink(profilePicturePath, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Failed to delete profile picture' });
                }

                // Update the employee record to remove the profile picture reference
                employee.profilePicture = '';
                await employee.save();

                res.status(200).json({ message: 'Profile picture deleted successfully' });
            });
        } else {
            res.status(400).json({ error: 'No profile picture to delete' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.get('/getEmpDetails', jwtMiddleware, async (req, res) => {
    const employeeId = req.user.subEmployeeId   ;



    console.log(employeeId);
    
    try {
      let employee = await Employee.findById(employeeId);
      
      if (!employee) {
        employee = await SubEmployee.findById(employeeId);
      }
      
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  router.get('/getEmpDetailsForAdmin', jwtMiddleware, async (req, res) => {
    const employeeId = req.user.employeeId   ;



    console.log(employeeId);
    
    try {
      let employee = await Employee.findById(employeeId);
      
    
      
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  





router.post('/registersub', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('adminname').notEmpty().withMessage('Invalid adminname format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('adminCompanyName').notEmpty().withMessage('Admin Company Name is required'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format'), // Add phone number validation

], jwtMiddleware, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {

        const authenticatedUser = req.user; // Get the authenticated user

        console.log('authenticatedUser:', authenticatedUser);
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Create the sub-employee and associate it with the company
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log('hashedPassword:', hashedPassword);

        const newSubEmployee = new SubEmployee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phoneNumber: req.body.phoneNumber, // Add phoneNumber
            adminUserId: authenticatedUser._id, // Assign the adminUserId from the authenticated user
            adminname: req.body.adminname, // Assign the adminUserId from the authenticated user
            adminCompanyName: authenticatedUser.adminCompanyName,
            type: req.body.type,
            // companyId: authenticatedUser.companyId, // Assign the companyId from the authenticated user
        });

        const subEmployee = await newSubEmployee.save();
        console.log(subEmployee)

        res.status(201).json({ message: 'Sub-employee registered successfully', subEmployee });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// create Employee
router.post('/registersales', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('adminname').notEmpty().withMessage('Invalid adminname format'),
    body('shiftHours').notEmpty().withMessage('ShiftHours is required'),
    body('adminCompanyName').notEmpty().withMessage('Admin Company Name is required'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number format'), // Add phone number validation

], jwtMiddleware, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the authenticated user (admin) exists and has the necessary privileges

        const authenticatedUser = req.user; // Get the authenticated user

        console.log('authenticatedUser:', authenticatedUser);
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Create the sub-employee and associate it with the company
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log('hashedPassword:', hashedPassword);

        const newSales = new Sales({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            shiftHours: req.body.shiftHours,
            phoneNumber: req.body.phoneNumber,
            adminname: req.body.adminname, 
            adminUserId: authenticatedUser._id,
            adminCompanyName: authenticatedUser.adminCompanyName,
            // companyId: authenticatedUser.companyId, // Assign the companyId from the authenticated user
        });

        const sales = await newSales.save();
        console.log(sales)

        res.status(201).json({ message: 'Sub-employee registered successfully', sales });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







router.get('/subemployees/clock-inn', jwtMiddleware, async (req, res) => {
    try {
        const authenticatedUser = req.user;

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


router.get('/subemployees/list', jwtMiddleware, async (req, res) => {
    try {
        const authenticatedUser = req.user;

        // Check if user is authenticated
        if (!authenticatedUser) {
            console.error('Access denied: User not authenticated');
            return res.status(403).json({ error: 'Access denied: User not authenticated' });
        }

        let employees = [];
        let salesEmp = [];

        // Fetch data based on user role
        if (authenticatedUser.role === 'admin') {
            console.log('Admin Company Name:', authenticatedUser.adminCompanyName);
            employees = await SubEmployee.find({ adminCompanyName: authenticatedUser.adminCompanyName });
            salesEmp = await Sales.find({ adminCompanyName: authenticatedUser.adminCompanyName });
        } else {
            console.log('Employee Company Name:', authenticatedUser.companyName);
            salesEmp = await Sales.find({ adminCompanyName: authenticatedUser.adminCompanyName });
            employees = await SubEmployee.find({ adminCompanyName: authenticatedUser.adminCompanyName });
        }

        // Combine both lists into one array
        const combinedList = [...salesEmp, ...employees];

        // Return combined list in the response
        res.status(200).json(combinedList);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






router.get('/subemployeesForTimeCard/list', jwtMiddleware, async (req, res) => {
    try {
        const authenticatedUser = req.user;

        // Check if user is authenticated
        if (!authenticatedUser) {
            console.error('Access denied: User not authenticated');
            return res.status(403).json({ error: 'Access denied: User not authenticated' });
        }

        let employees = [];
        let salesEmp = [];

        // Fetch data based on user role
        if (authenticatedUser.role === 'admin') {
            console.log('Admin Company Name:', authenticatedUser.adminCompanyName);
            employees = await SubEmployee.find({ adminCompanyName: authenticatedUser.adminCompanyName });
        
        } else {
            console.log('Employee Company Name:', authenticatedUser.companyName);
    
            employees = await SubEmployee.find({ adminCompanyName: authenticatedUser.adminCompanyName });
        }

        // Combine both lists into one array
        const combinedList = [ ...employees];

        // Return combined list in the response
        res.status(200).json(combinedList);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





/////////////////// not is USE
router.get('/subemployee/list', async (req, res) => {
    try {

        let employees;

        employees = await SubEmployee.find();

        console.log('Employees:', employees);

        res.status(200).json(employees);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/deleteProfilePicture/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        if (employee.profilePicture) {
            employee.profilePicture = null;
            await employee.save();

            res.status(200).json({ message: 'Profile picture reference removed successfully' });
        } else {
            res.status(400).json({ error: 'No profile picture to delete' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/subemployees/company', jwtMiddleware, async (req, res) => {
    try {
        const authenticatedUser = req.user;

        console.log('Authenticated User:', authenticatedUser);

        if (authenticatedUser.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Not an admin' });
        }

        const company = await Company.findOne({ _id: authenticatedUser.adminUserId });

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Deactivate sub-employees
router.put('/subemployees/deactivate', jwtMiddleware, async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const { ids } = req.body;

        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: User not authorized' });
        }

        await SubEmployee.updateMany(
            { _id: { $in: ids } },
            { $set: { status: 'deactive' } }
        );

        res.status(200).json({ message: 'Sub-employees deactivated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Activate sub-employees
router.put('/subemployees/activate', jwtMiddleware, async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const { ids } = req.body;

        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: User not authorized' });
        }

        await SubEmployee.updateMany(
            { _id: { $in: ids } },
            { $set: { status: 'active' } }
        );

        res.status(200).json({ message: 'Sub-employees activated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
