const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Task = require('../models/Task'); // Import your Task model
const SubEmployee = require('../models/SubEmployee');
const jwtMiddleware = require('../jwtmiddleware');
const Salary = require('../models/Salary');
const Notification = require('../models/Notification');
const Employee = require('../models/Employee');
const cron = require('node-cron');
const moment = require('moment');



cron.schedule('* * * * *', async () => {
  try {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

    const asiaTime = DateTime.now().setZone('Asia/Kolkata');
    // const currentTime = asiaTime.toLocaleString(DateTime.TIME_SIMPLE).toUpperCase(); // Convert to upper case
    const formattedCurrentTime = asiaTime.toFormat('hh:mm a'); // Format time as "01:02 PM"


    const tasks = await Task.find({
      status: 'pending',
      $or: [
        { deadlineDate: { $lt: currentDate } },

        {
          deadlineDate: currentDate,
          endTime: { $lte: formattedCurrentTime }

        }
      ]
    });

    for (let task of tasks) {
      task.status = 'overdue';
      await task.save();
      // console.log(`Task ${task._id} is now overdue.`);
    }
  } catch (error) {
    console.error('Error updating overdue tasks:', error);
  }
});

console.log('Task scheduler started.');




// Configure multer to use specific destinations for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });


router.put('/uploadProfileImage', upload.single('profilePicture'), jwtMiddleware, async (req, res) => {
  try {
    const employeeEmail = req.user.email;
    const update = {};

    if (req.file) {
      update.profilePicture = req.file.path;
    }

    const employee = await SubEmployee.findOneAndUpdate({ email: employeeEmail }, update, { new: true });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Profile picture updated', employee });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/upload', jwtMiddleware, upload.single('profilePicture'), async (req, res) => {

  try {
    const adminEmail = req.user.email;
    const update = {};

    if (req.file) {
      update.profilePicture = req.file.path;
    }

    console.log(adminEmail);

    const employee = await Employee.findOneAndUpdate({ email: adminEmail }, update, { new: true });

    if (!employee) {
      return res.status(404).json({ error: 'Admin not found' });
    } else {

    }

    res.status(200).json({ message: 'Profile picture updated', employee });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/profileIMG', jwtMiddleware, async (req, res) => {
  try {
    const adminEmail = req.user.email;

    const employee = await Employee.findOne({ email: adminEmail });

    if (!employee) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      profilePicture: employee.profilePicture
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put('/uploadEmp', upload.single('profilePicture'), jwtMiddleware, async (req, res) => {
  try {
    const employeeEmail = req.user.email;
    const update = {};

    if (req.file) {
      update.profilePicture = req.file.path;
    }

    const employee = await SubEmployee.findOneAndUpdate({ email: employeeEmail }, update, { new: true });

    if (!employee) {
      // If no task is found with the given ID, return a 404 response
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Profile picture updated', employee });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
~

  router.get('/taskCounts', jwtMiddleware, async (req, res) => {
    try {
      // Retrieve the user's ID from the JWT token
      const userId = req.user.subEmployeeId ?? req.user.employeeId;
      console.log(userId); // Make sure you have the user ID available in the request
      const currentDate = new Date(); // Get the current date
      // Fetch the counts from your database
      const receivedTasks = await Task.countDocuments({ assignTo: userId });
      const completedTasks = await Task.countDocuments({ assignTo: userId, status: 'completed' });
      const pendingTasks = await Task.countDocuments({ assignTo: userId, status: 'pending' }); // Adjusted query for pending tasks with deadline less than or equal to current date
      const overdueTasks = await Task.countDocuments({ assignTo: userId, status: 'overdue' });
      const todayAddedTasks = await Task.countDocuments({ assignedByEmp: userId, startDate: new Date().toISOString().split('T')[0] });
      const sendTasks = await Task.countDocuments({ assignedByEmp: userId });

      console.log(userId);


      // Create an object to hold the task counts
      const taskCounts = {
        receivedTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        todayAddedTasks,
        sendTasks
      };

      // Return the counts as JSON response
      // console.log(taskCounts)
      res.status(200).json(taskCounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })


router.get('/adminTaskCounts', jwtMiddleware, async (req, res) => {
  try {
    const adminId = req.user.employeeId;
    const userId = req.user.subEmployeeId;
    console.log(adminId)
    console.log(userId)

    const receivedTasks = await Task.countDocuments({ assignTo: adminId });

    const totalEmployeeTasks = await Task.countDocuments({ assignedBy: adminId });
    const completedTasks = await Task.countDocuments({ assignedBy: adminId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ assignedBy: adminId, status: 'pending' }); // Adjusted query for pending tasks with deadline less than or equal to current date
    const overdueTasks = await Task.countDocuments({ assignedBy: adminId, status: 'overdue' });
    const todayAddedTasks = await Task.countDocuments({ assignedBy: adminId, startDate: new Date().toISOString().split('T')[0] });
    const sendTasks = await Task.countDocuments({ assignedBy: adminId });
    const receivedTask = await Task.countDocuments({ assignTo: adminId });

    const adminTaskCounts = {
      totalEmployeeTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      todayAddedTasks,
      sendTasks,
      receivedTask
    };

    res.status(200).json(adminTaskCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

















// Create Task API
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


router.post('/uploadTaskImage', upload.fields([
  { name: 'pictures', maxCount: 10 }
]), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let picturePaths = [];

  console.log(picturePaths);

  if (req.files && req.files.pictures) {
    picturePaths = req.files.pictures.map(file => file.path);
  } else {
    return res.status(400).json({ error: 'No pictures uploaded' });
  }
  try {
    res.status(201).json({ message: 'Images uploaded successfully', pictures: picturePaths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/createNewApproach', jwtMiddleware, [
  body('title').notEmpty().withMessage('Title is empty please fill'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignTo').isArray({ min: 1 }).withMessage('Assignees are required'),
  body('startDate').notEmpty().withMessage('Start Date is required'),
  body('deadlineDate').notEmpty().withMessage('Deadline Date is required'),
  body('startTime').notEmpty().withMessage('Start Time is required'),
  body('endTime').notEmpty().withMessage('End Time is required'),
  body('pictures').optional().isString().withMessage('Picture path should be a string'),  // Changed to string
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startDate, startTime, deadlineDate, reminderDate, endTime, reminderTime, assignTo, status, pictures, audio } = req.body;

  let audioPath = audio;
  let picturePath = pictures;  // Changed to single path

  try {
    const assignedBy = req.user.employeeId;

    const employees = await SubEmployee.find({ _id: { $in: assignTo } });
    if (employees.length !== assignTo.length) {
      const nonExistentEmployees = assignTo.filter(empId => !employees.map(emp => emp._id.toString()).includes(empId));
      return res.status(404).json({ error: `Employees with IDs ${nonExistentEmployees.join(', ')} not found` });
    }

    const tasks = assignTo.map(assigneeId => {
      const employee = employees.find(emp => emp._id.toString() === assigneeId);
      return new Task({
        title,
        description,
        startDate,
        startTime,
        deadlineDate,
        reminderDate,
        endTime,
        reminderTime,
        assignTo: employee._id,
        assignedBy,
        phoneNumber: employee.phoneNumber,
        pictures: picturePath,  // Single picture path
        audio: audioPath,
        status
      });
    });

    const createdTasks = await Task.insertMany(tasks);

    // Format the response to include ObjectId in the specified format
    const formattedResponse = createdTasks.map(task => ({
      _id: { $oid: task._id.toString() },
      title: task.title,
      description: task.description,
      assignTo: task.assignTo.map(id => ({ $oid: id.toString() })),
      startDate: { $date: task.startDate.toISOString() },
      deadlineDate: { $date: task.deadlineDate.toISOString() },
      reminderDate: task.reminderDate ? { $date: task.reminderDate.toISOString() } : null,
      startTime: task.startTime,
      endTime: task.endTime,
      reminderTime: task.reminderTime,
      pictures: task.pictures,  // Single 
      phoneNumber: task.phoneNumber,
      isRead: task.isRead,
      status: task.status,
      assignedBy: { $oid: task.assignedBy.toString() },
      empRemarkToList: task.empRemarkToList,
      remarkToList: task.remarkToList,
      __v: task.__v,
      createdAt: { $date: task.createdAt.toISOString() },
      updatedAt: { $date: task.updatedAt.toISOString() }
    }));

    res.status(201).json({ message: 'Tasks created successfully', tasks: formattedResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/createNewApproachForEMP/:assignedBy', jwtMiddleware, [
  body('title').notEmpty().withMessage('Title is empty please fill'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignTo').isArray({ min: 1 }).withMessage('Assignees are required'),
  body('startDate').notEmpty().withMessage('Start Date is required'),
  body('deadlineDate').notEmpty().withMessage('Deadline Date is required'),
  body('startTime').notEmpty().withMessage('Start Time is required'),
  body('endTime').notEmpty().withMessage('End Time is required'),
  body('pictures').optional().isString().withMessage('Picture path should be a string'),  // Changed to string
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log("createNewApproachForEMP/:assignedBy");

  const { title, description, startDate, startTime, deadlineDate, reminderDate, endTime, reminderTime, assignTo, status, pictures, audio } = req.body;

  let audioPath = audio;
  let picturePath = pictures;
  try {
    const assignedBy = req.params.assignedBy;
    console.log(assignedBy);


    const employees = await SubEmployee.find({ _id: { $in: assignTo } });
    if (employees.length !== assignTo.length) {
      const nonExistentEmployees = assignTo.filter(empId => !employees.map(emp => emp._id.toString()).includes(empId));
      return res.status(404).json({ error: `Employees with IDs ${nonExistentEmployees.join(', ')} not found` });
    }

    const tasks = assignTo.map(assigneeId => {
      const employee = employees.find(emp => emp._id.toString() === assigneeId);
      return new Task({
        title,
        description,
        startDate,
        startTime,
        deadlineDate,
        reminderDate,
        endTime,
        reminderTime,
        assignTo: employee._id,
        assignedBy,
        phoneNumber: employee.phoneNumber,
        pictures: picturePath,
        audio: audioPath,
        status
      });
    });

    const createdTasks = await Task.insertMany(tasks);

    // Format the response to include ObjectId in the specified format
    const formattedResponse = createdTasks.map(task => ({
      _id: { $oid: task._id.toString() },
      title: task.title,
      description: task.description,
      assignTo: task.assignTo.map(id => ({ $oid: id.toString() })),
      startDate: task.startDate.toISOString(),
      deadlineDate: task.deadlineDate.toISOString(),
      reminderDate: task.reminderDate ? task.reminderDate.toISOString() : null,
      startTime: task.startTime,
      endTime: task.endTime,
      reminderTime: task.reminderTime,
      pictures: task.pictures,
      phoneNumber: task.phoneNumber,
      isRead: task.isRead,
      status: task.status,
      assignedBy: { $oid: task.assignedBy },
      empRemarkToList: task.empRemarkToList,
      remarkToList: task.remarkToList,
      __v: task.__v,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    }));

    res.status(201).json({ message: 'Tasks created successfully', tasks: formattedResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/create', jwtMiddleware, upload.fields([
  { name: '`pictures`', maxCount: 10 },
  { name: 'audio', maxCount: 1 }
]), [
  body('title').notEmpty().withMessage('Title is empty please fill'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignTo').isArray({ min: 1 }).withMessage('Assignees are required'),
  body('startDate').notEmpty().withMessage('Start Date is required'),
  body('deadlineDate').notEmpty().withMessage('Deadline Date is required'),
  body('startTime').notEmpty().withMessage('Start Time is required'),
  body('endTime').notEmpty().withMessage('End Time is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startDate, startTime, deadlineDate, reminderDate, endTime, reminderTime, assignTo, status } = req.body;

  let audioPath;
  let picturePaths = [];

  if (req.files && req.files.pictures) {
    picturePaths = req.files.pictures.map(file => file.path);
  }

  if (req.files && req.files.audio) {
    audioPath = req.files.audio[0].path;
  }

  try {
    const assignedBy = req.user.employeeId;

    const employees = await SubEmployee.find({ _id: { $in: assignTo } });
    if (employees.length !== assignTo.length) {
      const nonExistentEmployees = assignTo.filter(empId => !employees.map(emp => emp._id.toString()).includes(empId));
      return res.status(404).json({ error: `Employees with IDs ${nonExistentEmployees.join(', ')} not found` });
    }

    const tasks = assignTo.map(assigneeId => {
      const employee = employees.find(emp => emp._id.toString() === assigneeId);
      return new Task({
        title,
        description,
        startDate,
        startTime,
        deadlineDate,
        reminderDate,
        endTime,
        reminderTime,
        assignTo: employee._id,
        assignedBy,
        phoneNumber: employee.phoneNumber,
        pictures: picturePaths,
        audio: audioPath,
        status
      });
    });

    const createdTasks = await Task.insertMany(tasks);

    // Format the response to include ObjectId in the specified format
    const formattedResponse = createdTasks.map(task => ({
      _id: { $oid: task._id.toString() },
      title: task.title,
      description: task.description,
      assignTo: task.assignTo.map(id => ({ $oid: id.toString() })),
      startDate: { $date: task.startDate.toISOString() },
      deadlineDate: { $date: task.deadlineDate.toISOString() },
      reminderDate: task.reminderDate ? { $date: task.reminderDate.toISOString() } : null,
      startTime: task.startTime,
      endTime: task.endTime,
      reminderTime: task.reminderTime,
      pictures: task.pictures,
      phoneNumber: task.phoneNumber,
      isRead: task.isRead,
      status: task.status,
      assignedBy: { $oid: task.assignedBy.toString() },
      empRemarkToList: task.empRemarkToList,
      remarkToList: task.remarkToList,
      __v: task.__v,
      createdAt: { $date: task.createdAt.toISOString() },
      updatedAt: { $date: task.updatedAt.toISOString() }
    }));

    res.status(201).json({ message: 'Tasks created successfully', tasks: formattedResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






router.post('/uploadAudio', jwtMiddleware, upload.single('audio'), [
  body('taskId').notEmpty().withMessage('Task ID is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { taskId } = req.body;
  let audioPath;

  if (req.file) {
    audioPath = req.file.path;
  } else {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }


    task.audio = audioPath;
    await task.save();

    res.status(200).json({ message: 'Audio uploaded successfully', audioPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/createSubemployeeTask', upload.fields([
  { name: 'pictures', maxCount: 10 },
  { name: 'audio', maxCount: 1 }
]), [
  // Validation rules using express-validator
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignTo').isArray({ min: 1 }).withMessage('Assignees are required'),
  body('startDate').notEmpty().withMessage('Start Date is required'),
  body('deadlineDate').notEmpty().withMessage('Deadline Date is required'),
  body('startTime').notEmpty().withMessage('Start Time is required'),
  body('endTime').notEmpty().withMessage('End Time is required'),
],
  jwtMiddleware,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, startDate, startTime, deadlineDate, reminderDate, reminderTime, endTime, assignTo } = req.body;
    let audioPath;
    let picturePaths = [];

    if (req.files && req.files.pictures) {
      picturePaths = req.files.pictures.map(file => file.path);
    }

    if (req.files && req.files.audio) {
      audioPath = req.files.audio[0].path;
    }

    try {
      const assignedByEmp = req.user.subEmployeeId;
      const employees = await SubEmployee.find({ _id: { $in: assignTo } });
      if (employees.length !== assignTo.length) {
        const nonExistentEmployees = assignTo.filter(empId => !employees.map(emp => emp._id.toString()).includes(empId));
        return res.status(404).json({ error: `Employees with IDs ${nonExistentEmployees.join(', ')} not found` });
      }

      const tasks = assignTo.map(assigneeId => {
        const employee = employees.find(emp => emp._id.toString() === assigneeId);
        return new Task({
          title,
          description,
          startDate,
          startTime,
          deadlineDate,
          reminderDate,
          reminderTime,
          endTime,
          assignTo: employee._id,
          assignedByEmp,
          // phoneNumber: employee.phoneNumber,
          pictures: picturePaths,
          audio: audioPath,
        });
      });

      await Task.insertMany(tasks);
      res.status(201).json({ message: 'Tasks created successfully', tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




router.get('/searchByAssignedBy/:id', jwtMiddleware, async (req, res) => {
  try {
    const id = req.params.id;


    // Validate that the ID is provided
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }

    // Find tasks where the given ID is in the 'assignedBy' field
    const tasks = await Task.find({ assignedBy: id })
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    // Check if any tasks were found
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found for the given assignedBy ID' });
    }

    // Send the list of tasks as a JSON response
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







router.get('/listNEW', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);


    // Find the company ID associated with the given admin user ID
    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all admins from the same company as the given admin user
    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });
    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    let taskFilter = {
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    if (startDate || endDate) {
      taskFilter.$and = [];
      if (startDate) {
        taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
      }
    }

    const tasks = await Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name');


    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'Tasks not found' });
    }

    // Send the list of tasks as a JSON response
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/tasksAssignedToAdmin/:id', jwtMiddleware, async (req, res) => {
  try {

    const id = req.params.id;
    console.log(id)

    // Validate that the ID is provided
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }

    // Find tasks where the given ID is in the 'assignTo' array
    const tasks = await Task.find({ assignTo: id })
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');


    console.log(tasks);

    // Check if any tasks were found
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found for the given ID' });
    }

    // Send the list of tasks as a JSON response
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})









router.get('/list', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);


    // Find the company ID associated with the given admin user ID
    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all admins from the same company as the given admin user
    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });
    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    let taskFilter = {
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    if (startDate || endDate) {
      taskFilter.$and = [];
      if (startDate) {
        taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
      }
    }

    // Fetch tasks based on the filter
    const tasks = await Task.find(taskFilter);




    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'Tasks not found' });
    }

    // Send the list of tasks as a JSON response
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/listTaskEmp', jwtMiddleware, async (req, res) => {
  try {
    // Retrieve the user's ID from the JWT token
    const userId = req.user.subEmployeeId;

    // Extract startDate and endDate from the query parameters
    const { startDate, endDate } = req.query;

    // Create a query object
    let query = { assignTo: userId };

    // Add date filters if provided
    if (startDate && endDate) {
      query = {
        ...query,
        startDate: { $gte: new Date(startDate) },
        deadlineDate: { $lte: new Date(endDate) }
      };
    }

    // Find tasks matching the query
    const tasks = await Task.find(query)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');


    if (tasks.length === 0) {

      return res.status(404).json({ error: 'No tasks found' });
    }

    // Send the list of tasks as a JSON response
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:taskId', jwtMiddleware, async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId)
      .populate('assignedBy', 'name')
      .populate('assignedByEmp', 'name');

    if (!task) {
      // If no task is found with the given ID, return a 404 response
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/tasks/active-users', async (req, res) => {
  try {
    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeEmployees = await Task.aggregate([
      {
        $match: {
          assignedBy: { $exists: true },
          startDate: { $gt: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: '$assignedBy',
          latestTaskStartDate: { $max: '$startDate' },
        },
      },
      {
        $project: {
          _id: 0,
          employeeId: '$_id',
        },
      },
    ]);

    if (!activeEmployees || activeEmployees.length === 0) {
      return res.status(200).json([]);
    }

    const activeEmployeeDetails = await Task.aggregate([
      {
        $match: {
          assignedBy: { $in: activeEmployees.map(emp => emp.employeeId) },
        },
      },
      {
        $lookup: {
          from: 'employees', // The name of the Employee collection
          localField: 'assignedBy',
          foreignField: '_id',
          as: 'employeeDetails',
        },
      },
      {
        $lookup: {
          from: 'subemployees', // The name of the SubEmployee collection
          localField: 'assignedBy',
          foreignField: '_id',
          as: 'subEmployeeDetails',
        },
      },
      {
        $project: {
          employeeDetails: 1,
          subEmployeeDetails: 1,
        },
      },
    ]);

    const uniqueEmployeeDetails = [];
    activeEmployeeDetails.forEach(entry => {
      const employee = entry.employeeDetails[0] || {};
      const subEmployee = entry.subEmployeeDetails[0] || {};

      const existingEntry = uniqueEmployeeDetails.find(
        item => item.email === (employee.email || subEmployee.email)
      );

      if (!existingEntry) {
        uniqueEmployeeDetails.push({
          name: employee.name || subEmployee.name,
          phoneNumber: employee.phoneNumber || subEmployee.phoneNumber,
          email: employee.email || subEmployee.email,
          adminCompanyName: employee.adminCompanyName || subEmployee.adminCompanyName,
        });
      }
    });

    res.status(200).json(uniqueEmployeeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/tasks/inactive-users', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeEmployees = await Task.aggregate([
      {
        $match: {
          assignedBy: { $exists: true },
          startDate: { $lt: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: '$assignedBy',
          latestTaskStartDate: { $max: '$startDate' },
        },
      },
      {
        $project: {
          _id: 0,
          employeeId: '$_id',
          latestTaskStartDate: 1,
        },
      },
    ]);

    const allEmployeeDetails = await Employee.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assignedBy',
          as: 'assignedTasks',
        },
      },
      {
        $project: {
          name: 1,
          phoneNumber: 1,
          email: 1,
          adminCompanyName: 1,
          assignedTasks: 1,
        },
      },
    ]);

    const allSubEmployeeDetails = await SubEmployee.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assignedBy',
          as: 'assignedTasks',
        },
      },
      {
        $project: {
          name: 1,
          phoneNumber: 1,
          email: 1,
          adminCompanyName: 1,
          assignedTasks: 1,
        },
      },
    ]);

    const allEmployeeAndSubEmployeeDetails = [...allEmployeeDetails, ...allSubEmployeeDetails];

    const uniqueEmployeeAndSubEmployeeDetails = [];
    const uniqueEmails = new Set();

    for (const entry of allEmployeeAndSubEmployeeDetails) {
      const email = entry.email;
      if (!uniqueEmails.has(email)) {
        uniqueEmployeeAndSubEmployeeDetails.push(entry);
        uniqueEmails.add(email);
      }
    }

    const inactiveEmployees = uniqueEmployeeAndSubEmployeeDetails.filter(entry => {
      const assignedTasks = entry.assignedTasks || [];
      const latestTaskStartDate = Math.max(...assignedTasks.map(task => new Date(task.startDate)));

      return !latestTaskStartDate || latestTaskStartDate < sevenDaysAgo;
    });

    res.status(200).json(inactiveEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/tasks/pendingNEW', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    const employeeId = req.user.subEmployeeId;
    console.log(userId);
    console.log(employeeId);


    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {

      const filter = {
        assignTo: employeeId,
        status: 'pending'
      };

      const tasks = await Task.find(filter)
        .populate('assignTo', 'name')
        .populate('assignedBy', 'name');

      if (!tasks || tasks.length === 0) {
        return res.status(200).json({ status: 0, message: 'No pending tasks found for this employee', tasks });
      }


      return res.status(200).json({ status: 1, message: 'Successfully fetched pending tasks', tasks });
    }


    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);

    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });
    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    // Create the task filter
    let taskFilter = {
      status: 'pending',
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    // Filter by assignTo if provided
    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    // Add date filters if provided
    if (startDate || endDate) {
      taskFilter.$and = [];
      if (startDate) {
        taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
      }
    }

    // Find the tasks based on the filter
    const tasks = await Task.find(taskFilter)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ status: 0, message: 'No pending tasks found ', tasks });

    }

    // Return the list of tasks
    return res.status(200).json({ status: 0, message: ' pending tasks', tasks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/tasks/adminRecievedTasks/:id', async (req, res) => {
  try {
    const assignToId = req.params.id;

    console.log(assignToId);


    const tasks = await Task.find({
      assignTo: assignToId,
      status: 'pending'
    }).populate('assignTo', 'name')
      .populate('assignedBy', 'name');;

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for the given ID' });
    }


    return res.status(200).json({ status: 0, message: ' recieved tasks', tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/tasks/totalEmpTask', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    const employeeId = req.user.subEmployeeId;
    console.log(userId);
    console.log(employeeId);


    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {

      const filter = {
        assignTo: employeeId,
      };

      const tasks = await Task.find(filter)
        .populate('assignTo', 'name')
        .populate('assignedBy', 'name');

      if (!tasks || tasks.length === 0) {
        return res.status(200).json({ status: 0, message: 'No  tasks found for this employee', tasks });
      }


      return res.status(200).json({ status: 1, message: 'Successfully fetched  tasks', tasks });
    }


    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);

    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });
    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    // Create the task filter
    let taskFilter = {
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    // Filter by assignTo if provided
    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    // Add date filters if provided
    if (startDate || endDate) {
      taskFilter.$and = [];
      if (startDate) {
        taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
      }
    }

    // Find the tasks based on the filter
    const tasks = await Task.find(taskFilter)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ status: 0, message: 'No tasks found ', tasks });

    }

    // Return the list of tasks
    return res.status(200).json({ status: 0, message: ' Total tasks', tasks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/tasks/AdminRecieved/:employeeId', jwtMiddleware, async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    console.log("employeeId : ");
    console.log(employeeId);

    const employeeExists = await SubEmployee.findById(employeeId);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found', });
    }

    const totalTasks = await Task.countDocuments({ assignTo: employeeId });
    const pendingTasks = await Task.countDocuments({ assignTo: employeeId, status: 'pending' });

    const allTasks = await Task.find({ assignTo: employeeId })
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name')
      .sort({ deadlineDate: 1 });

    const pendingTaskList = allTasks.filter(task => task.status === 'pending');

    res.status(200).json({
      employeeId: employeeId,
      totalTasks: totalTasks,
      pendingTasks: pendingTasks,
      pendingTaskList: pendingTaskList,
      // completedTaskList: completedTaskList
    });
  } catch (error) {
    console.error('Error fetching task data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});




router.get('/tasks/empRecievedTask', jwtMiddleware, async (req, res) => {
  try {
    const employeeId = req.params.subEmployeeId;


    console.log(employeeId);

    // Validate if the employee exists
    const employeeExists = await SubEmployee.findById(employeeId);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found', });
    }

    const totalTasks = await Task.countDocuments({ assignTo: employeeId });


    const allTasks = await Task.find({ assignTo: employeeId })
      .populate('assignedBy', 'name')
      .populate('assignTo', 'name')
      .sort({ deadlineDate: 1 });

    // Separate pending and completed tasks
    const pendingTaskList = allTasks.filter(task => task.status === 'pending');
    const completedTaskList = allTasks.filter(task => task.status === 'completed');

    // Send the result back to the client
    res.status(200).json({
      employeeId: employeeId,
      totalTasks: totalTasks,
      receivedTasks: allTasks,


    });
  } catch (error) {
    console.error('Error fetching task data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});









router.get('/tasks/pending', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    // Find sub-employees of the same company
    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);

    // Find the company ID associated with the given admin user ID
    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all admins from the same company as the given admin user
    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });
    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    // Get an array of admin IDs from the found company admins
    const adminIds = companyAdmins.map(admin => admin._id);

    // Create a filter object for the task query
    let taskFilter = {
      status: 'pending', // Filter for pending tasks
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    // Add assignTo filter if provided
    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    // Add date filters if provided
    if (startDate || endDate) {
      taskFilter.$and = [];
      if (startDate) {
        taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
      }
    }

    // Fetch pending tasks based on the filter
    const tasks = await Task.find(taskFilter);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'Pending tasks not found' });
    }

    // Send the list of pending tasks as a JSON response
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


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
router.get('/tasks/pendingByEmp', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin

    const tasks = await Task.find({ assignTo: userId, status: 'pending' }).populate('assignTo', 'name')
      .populate('assignedBy', 'name');;

    if (!tasks) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/tasks/pendingByEmpNEW', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin

    const tasks = await Task.find({ assignTo: userId, status: 'pending' });

    if (!tasks) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/complete/:taskId', upload.single('imagePath'), async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const update = { status: 'completed' };

    if (req.file) {
      update.imagePath = req.file.path;
    }

    const task = await Task.findByIdAndUpdate(taskId, update, { new: true });

    router.get('/tasks/pendingByEmp', jwtMiddleware, async (req, res) => {
      try {
        const userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin

        const tasks = await Task.find({ assignTo: userId, status: 'pending' });

        if (!tasks) {
          return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    router.get('/tasks/pendingByEmpNew', jwtMiddleware, async (req, res) => {
      try {
        const userId = req.user.subEmployeeId; // Replace with how you identify the employee/admin

        // const tasks = await Task.find({ assignTo: userId, status: 'pending' });
        const tasks = await Task.find({ assignTo: userId, status: 'pending' })
          .populate('assignTo', 'name');

        // const tasks = await Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name');

        if (!tasks) {
          return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task marked as complete', task });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// router.get('/tasks/completed', jwtMiddleware, async (req, res) => {
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

router.get('/tasks/completed', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    // Find employees and sub-employees of the same company
    const employees = await Employee.find({ adminCompanyName });
    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const allEmployeeIds = [
      ...employees.map(employee => employee._id),
      ...subEmployees.map(subEmployee => subEmployee._id)
    ];

    // Find the company ID associated with the given admin user ID
    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all admins from the same company as the given admin user
    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });
    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    let taskFilter = {
      status: 'completed',
      $or: [
        { assignedByEmp: { $in: allEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    if (startDate || endDate) {
      taskFilter.$and = [];
      if (startDate) {
        taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
      }
    }

    const completedTasks = await Task.find(taskFilter);

    if (!completedTasks || completedTasks.length === 0) {
      return res.status(404).json({ error: 'Completed tasks not found' });
    }

    res.status(200).json({ completedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/tasks/completedNew', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    const employeeId = req.user.subEmployeeId;
    console.log(userId);
    console.log(employeeId);


    // Find employees and sub-employees of the same company
    const employees = await Employee.find({ adminCompanyName });
    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const allEmployeeIds = [
      ...employees.map(employee => employee._id),
      ...subEmployees.map(subEmployee => subEmployee._id)
    ];

    // Find the company ID associated with the given admin user ID
    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      // If userCompany is not found, look for tasks assigned to this employee
      const filter = {
        assignTo: employeeId,
        status: 'completed'
      };

      const tasks = await Task.find(filter)
        .populate('assignTo', 'name')
        .populate('assignedBy', 'name');

      if (!tasks || tasks.length === 0) {
        return res.status(200).json({ status: 0, message: 'No pending tasks found for this employee', tasks });
      }

      // Return the filtered tasks and end execution
      return res.status(200).json({ status: 1, message: 'Successfully fetched pending tasks', tasks });
    }

    // Find all admins from the same company as the given admin user
    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });
    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    let taskFilter = {
      status: 'completed',
      $or: [
        { assignedByEmp: { $in: allEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    if (startDate || endDate) {
      taskFilter.$and = [];
      if (startDate) {
        taskFilter.$and.push({ startDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        taskFilter.$and.push({ deadlineDate: { $lte: new Date(endDate) } });
      }
    }

    const completedTasks = await Task.find(taskFilter).populate('assignTo', 'name').populate('assignedBy', 'name');


    if (!completedTasks || completedTasks.length === 0) {
      return res.status(200).json({ status: 0, message: 'No pending tasks found for this employee', completedTasks });

    }
    return res.status(200).json({ status: 1, message: 'Successfully fetched pending tasks', completedTasks });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// List of all completed task to Employee
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



router.get('/tasks/completedByEmp', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.subEmployeeId;

    // Extract startDate and endDate from the query parameters
    const { startDate, endDate } = req.query;

    // Create a query object
    let query = { status: 'completed', assignTo: userId };

    // Add date filters if provided
    if (startDate && endDate) {
      query = {
        ...query,
        startDate: { $gte: new Date(startDate) },
        deadlineDate: { $lte: new Date(endDate) }
      };
    }

    // Find tasks matching the query
    const completedTasks = await Task.find(query);

    if (completedTasks.length === 0) {
      // If no tasks are found, return a 404 response
      return res.status(404).json({ error: 'No tasks found' });
    }

    // Send the list of completed tasks as a JSON response
    res.json({ completedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// mark as open for Admin
router.put('/open/:taskId', jwtMiddleware, async (req, res) => {
  const taskId = req.params.taskId;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if you need to update the status to "pending"
    if (
      req.body.startDate !== task.startDate ||
      req.body.deadlineDate !== task.deadlineDate ||
      req.body.assignTo !== task.assignTo
    ) {
      task.status = 'pending';
    }

    // Save the updated task
    await task.save();

    return res.status(200).json({ message: 'Task updated', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/editNew/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const updates = req.body;

  try {
    // Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updates,
      { new: true, runValidators: true }
    );

    // If no task is found, return a 404 error
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return the updated task
    res.status(200).json(updatedTask);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});



router.put('/edit/:taskId', jwtMiddleware, upload.fields([{ name: 'pictures', maxCount: 10 }, { name: 'audio', maxCount: 1 }]), async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTaskData = JSON.parse(req.body.taskData);

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.assignedBy.toString() !== req.user.employeeId) {
      return res.status(403).json({ error: 'Unauthorized: You are not the creator of this task' });
    }

    // Update task data except for pictures and audio
    for (const key in updatedTaskData) {
      if (Object.prototype.hasOwnProperty.call(updatedTaskData, key) && key !== 'pictures') {
        task[key] = updatedTaskData[key];
      }
    }

    // Update pictures array with the updatedTaskData
    task.pictures = updatedTaskData.pictures || [];

    // Check if new picture files were uploaded and add them to the task's pictures field
    if (req.files['pictures']) {
      const newPictures = req.files['pictures'].map(file => `uploads/pictures/${file.filename}`);
      task.pictures = task.pictures.concat(newPictures);
    }

    // Check if a new audio file was uploaded and update the task's audio field
    if (req.files['audio']) {
      task.audio = `uploads/audio/${req.files['audio'][0].filename}`;
    }

    const newTask = await task.save();
    console.log(newTask);
    res.status(200).json({ message: 'Task updated successfully', newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.put('/editEmp/:taskId', jwtMiddleware, upload.fields([{ name: 'pictures', maxCount: 10 }, { name: 'audio', maxCount: 1 }]), async (req, res) => {
  try {
    const taskId = req.params.taskId;
    // console.log('Received taskId:', taskId); // Add this line to log the received taskId

    const updatedTaskData = JSON.parse(req.body.taskData); // Extract the task data from the JSON string

    // Retrieve the task by its ID from the database
    const task = await Task.findById(taskId);
    // console.log(task)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if the authenticated user has permission to edit the task
    if (task.assignedByEmp.toString() !== req.user.subEmployeeId) {

      return res.status(403).json({ error: 'Unauthorized: You are not the creator of this task' });
    }

    // Update task data except for picture
    for (const key in updatedTaskData) {
      if (Object.prototype.hasOwnProperty.call(updatedTaskData, key) && key !== 'pictures') {
        task[key] = updatedTaskData[key];
      }
    }


    // Check if a new picture file was uploaded and update the task's picture field
    // if (req.files['picture']) {
    //   task.picture = `uploads/pictures/${req.files['picture'][0].filename}`; // Update the picture URL
    //   // console.log(req.file)
    // }
    task.pictures = updatedTaskData.pictures || [];

    // Check if new picture files were uploaded and add them to the task's pictures field
    if (req.files['pictures']) {
      const newPictures = req.files['pictures'].map(file => `uploads/pictures/${file.filename}`);
      task.pictures = task.pictures.concat(newPictures);
    }

    if (req.files['audio']) {
      task.audio = `uploads/audio/${req.files['audio'][0].filename}`; // Update the audio URL
    }
    // Save the updated task back to the database
    const newTask = await task.save();

    res.status(200).json({ message: 'Task updated successfully', newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Delete Task API Endpoint
router.delete('/delete/:taskId', jwtMiddleware, async (req, res) => {

  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify if the user is authorized to delete the task (e.g., check if they are the creator or have permission)
    // if (task.assignedBy.toString() !== req.user.employeeId) {
    if (task.assignedBy.toString() !== req.user.employeeId && task.assignedBy.toString() !== req.user.subEmployeeId) {
      return res.status(403).json({ error: 'Unauthorized: You are not the creator of this task' });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// get pending/ Received task to Employee
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

router.get('/tasksList/assignedTo', jwtMiddleware, async (req, res) => {
  try {
    // Extract sub-employee ID from the decoded JWT token
    const subEmployeeId = req.user.subEmployeeId;

    // Extract startDate and endDate from the query parameters
    const { startDate, endDate } = req.query;

    // Create a query object
    let query = {
      assignTo: subEmployeeId,
      status: 'pending'
    };

    // Add date filters if provided
    if (startDate && endDate) {
      query = {
        ...query,
        startDate: { $gte: new Date(startDate) },
        deadlineDate: { $lte: new Date(endDate) }
      };
    }

    // Find tasks matching the query
    const tasks = await Task.find(query).populate('assignedBy', 'name');

    if (tasks.length === 0) {
      // If no tasks are found, return a 404 response
      return res.status(404).json({ error: 'No tasks found' });
    }

    // Return the list of tasks as a JSON response
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const { DateTime } = require('luxon');

// Get overdue task for Admin in one company

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




router.get('/tasks/overdueFor', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const { assignTo } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);

    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      return res.status(404).json({ error: 'User not found' });
    }

    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });

    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    let taskFilter = {
      status: 'pending',  // Fetch only pending tasks
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    const currentDate = new Date();

    // Fetch the tasks using the filter
    const tasks = await Task.find(taskFilter);

    // Filter tasks whose deadline and end time have passed
    const overdueTasks = tasks.filter(task => {
      const taskDeadline = new Date(task.deadlineDate);
      const taskEndTime = task.endTime.split(' ');
      const taskEndHourMinute = taskEndTime[0].split(':');
      let taskEndHours = parseInt(taskEndHourMinute[0]);
      const taskEndMinutes = parseInt(taskEndHourMinute[1]);

      // Adjust hour for PM time
      if (taskEndTime[1] === 'PM' && taskEndHours !== 12) {
        taskEndHours += 12;
      } else if (taskEndTime[1] === 'AM' && taskEndHours === 12) {
        taskEndHours = 0;
      }

      // Set the exact end time for the task
      taskDeadline.setHours(taskEndHours, taskEndMinutes, 0, 0);

      // Return true if the task is overdue
      return taskDeadline < currentDate;
    });

    if (!overdueTasks || overdueTasks.length === 0) {
      return res.status(404).json({ error: 'No overdue tasks found' });
    }

    // Send the list of overdue tasks as a JSON response
    res.status(200).json({ overdueTasks });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/tasks/overdueNEW', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const employeeId = req.user.subEmployeeId;

    console.log(userId);
    console.log(employeeId);

    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;

    const today = new Date();

    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);

    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {

      const tasks = await Task.find({
        assignTo: employeeId,
        status: { $in: ['pending', 'overdue'] },
        deadlineDate: { $lt: today }
      })
        .populate('assignTo', 'name')
        .populate('assignedBy', 'name');


      if (!tasks || tasks.length === 0) {
        return res.status(200).json({ status: 0, message: 'Overdue List is Empty', tasks });
      }
      return res.status(200).json({ status: 1, message: 'Successfully fetched overdue tasks', tasks });
    }

    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });

    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    let taskFilter = {
      status: { $in: ['pending', 'overdue'] },
      deadlineDate: { $lt: today },
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    const overdueTasks = await Task.find(taskFilter)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    if (!overdueTasks || overdueTasks.length === 0) {
      return res.status(200).json({ status: 0, message: 'Overdue List is Empty', overdueTasks });
    }

    return res.status(200).json({ status: 1, message: 'Successfully fetched Overdue tasks', overdueTasks });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/tasks/totalTask', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const employeeId = req.user.subEmployeeId;

    console.log(userId);
    console.log(employeeId);

    const { assignTo, startDate, endDate } = req.query;
    const adminCompanyName = req.user.adminCompanyName;


    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);

    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      // If the user company is not found, handle the task query here
      const totalTask = await Task.find({
        assignTo: employeeId,
      })
        .populate('assignTo', 'name')
        .populate('assignedBy', 'name');


      console.log(totalTask.length);

      if (!totalTask || totalTask.length === 0) {
        return res.status(200).json({ status: 0, message: 'Overdue List is Empty', totalTask });
      }
      return res.status(200).json({ status: 1, message: 'Successfully fetched overdue tasks', totalTask });



    }

    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });

    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    let taskFilter = {
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };


    if (assignTo) {
      taskFilter.assignTo = { $in: [assignTo] };
    }

    const totalTask = await Task.find(taskFilter)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    if (!totalTask || totalTask.length === 0) {
      return res.status(200).json({ status: 0, message: 'Overdue List is Empty', totalTask });
    }
    console.log(totalTask.length);



    return res.status(200).json({ status: 1, message: 'Successfully fetched Overdue tasks', totalTask });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/tasks/overdue', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.employeeId;
    const adminCompanyName = req.user.adminCompanyName;

    const subEmployees = await SubEmployee.find({ adminCompanyName });
    const subEmployeeIds = subEmployees.map(subEmployee => subEmployee._id);

    // Fetch the user's company details
    const userCompany = await Employee.findOne({ _id: userId }).select('adminCompanyName');
    if (!userCompany) {
      return res.status(404).json({ error: 'User not found' });
    }

    const companyAdmins = await Employee.find({
      adminUserId: req.user.adminUserId,
      adminCompanyName: userCompany.adminCompanyName
    });

    if (!companyAdmins || companyAdmins.length === 0) {
      return res.status(404).json({ error: 'Admins not found for the company' });
    }

    const adminIds = companyAdmins.map(admin => admin._id);

    // Define the filter to find overdue tasks
    const currentTime = new Date();

    const taskFilter = {
      status: 'pending',
      $or: [
        { assignedByEmp: { $in: subEmployeeIds } },
        { assignedBy: { $in: adminIds } }
      ]
    };

    const tasks = await Task.find(taskFilter)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    const overdueTasks = tasks.filter(task => {
      const deadlineDate = new Date(task.deadlineDate);

      // Convert endTime to 24-hour format if needed
      let [endHour, endMinute] = task.endTime.split(':').map(Number);
      if (task.endTime.includes('PM') && endHour !== 12) endHour += 12;
      if (task.endTime.includes('AM') && endHour === 12) endHour = 0;

      // Handle the case where endTime is after midnight
      if (endHour < 0) endHour += 24;

      // Set hours and minutes to deadlineDate
      deadlineDate.setHours(endHour, endMinute, 0, 0);

      // Return true if the combined deadlineDate and endTime is in the past
      return deadlineDate < currentTime;
    });

    if (overdueTasks.length === 0) {
      return res.status(200).json({ status: 0, message: 'No overdue tasks found', overdueTasks });
    }

    res.status(200).json({ status: 1, message: 'Tasks found', overdueTasks });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/tasks/over', jwtMiddleware, async (req, res) => {
  try {
    // Retrieve the user's ID from the JWT token
    const userId = req.user.subEmployeeId;

    // Extract startDate and endDate from the query parameters
    const { startDate, endDate } = req.query;

    // Create a query object
    let query = {
      assignTo: userId,
      status: 'pending'
    };

    // Add date filters if provided
    if (startDate && endDate) {
      query = {
        ...query,
        startDate: { $gte: new Date(startDate) },
        deadlineDate: { $lte: new Date(endDate) }
      };
    }

    // Find tasks matching the query
    const overdueTasks = await Task.find(query).populate('assignTo', 'name')
      .populate('assignedBy', 'name');;

    if (overdueTasks.length === 0) {
      // If no overdue tasks are found, return a 404 response
      return res.status(404).json({ error: 'No overdue tasks found' });
    }

    // Return the list of overdue tasks as a JSON response
    res.status(200).json({ overdueTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//Get the list of overdue task for reminder for admin
router.get('/over/status', jwtMiddleware, async (req, res) => {
  try {
    // Retrieve the user's ID from the JWT token
    const userId = req.user.employeeId || req.user.subEmployeeId;

    // Get the current date and time
    const overdueTasks = await Task.find({
      assignTo: userId, // Use assignTo instead of assignedBy to find tasks assigned to the user
      status: "overdue",
      isRead: false
    });

    if (!overdueTasks || overdueTasks.length === 0) {
      // If no overdue tasks are found, return an appropriate response
      return res.status(404).json({ error: 'No overdue tasks found' });
    }
    // Return the list of overdue tasks as a JSON response
    res.status(200).json({ overdueTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT route to mark a task as read when clicking on a task
router.put("/:taskId/read", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Find the task by its ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Mark the task as read
    task.isRead = true;

    // Save the updated task
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Error marking task as read:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get the list of task which are completed for Admin in reminder
router.get('/complete/status', jwtMiddleware, async (req, res) => {
  try {
    // Retrieve the user's ID from the JWT token if needed
    const userId = req.user.employeeId || req.user.subEmployeeId;

    // Get the tasks with status "complete" and isRead set to false
    const completeTasks = await Task.find({
      assignTo: userId, // Uncomment and use this line if you need to filter by user ID
      status: "completed",
      isRead: false
    });

    if (!completeTasks || completeTasks.length === 0) {
      // If no complete tasks are found, return an appropriate response
      return res.status(404).json({ error: 'No complete tasks found' });
    }
    // Return the list of complete tasks as a JSON response
    res.status(200).json({ completeTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// get tasks added on the current date to Admin
router.get('/tasks/today', jwtMiddleware, async (req, res) => {
  try {
    // Retrieve the user's ID from the JWT token
    const userId = req.user.employeeId;

    // Get the current date as a string in the format "YYYY-MM-DD"
    const currentDate = new Date().toISOString().split('T')[0];

    // Find tasks where the assignedBy field matches the user's ID and the startDate is equal to the current date
    const todayAddedTasks = await Task.find({
      assignedBy: userId,
      startDate: currentDate,
    });

    if (!todayAddedTasks || todayAddedTasks.length === 0) {
      // If no tasks were added today, return an appropriate response
      return res.status(404).json({ error: 'No tasks added today' });
    }

    // Return the list of tasks added today as a JSON response
    res.status(200).json({ todayAddedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/tasks/todayEmp', jwtMiddleware, async (req, res) => {
  try {
    // Retrieve the user's ID from the JWT token
    const userId = req.user.subEmployeeId;

    // Get the current date as a string in the format "YYYY-MM-DD"
    const currentDate = new Date().toISOString().split('T')[0];

    // Find tasks where the assignedBy field matches the user's ID and the startDate is equal to the current date
    const todayAddedTasks = await Task.find({
      assignedByEmp: userId,
      startDate: currentDate,
    });

    if (!todayAddedTasks || todayAddedTasks.length === 0) {
      // If no tasks were added today, return an appropriate response
      return res.status(404).json({ error: 'No tasks added today' });
    }

    // Return the list of tasks added today as a JSON response
    res.status(200).json({ todayAddedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/edit/:taskId', upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignTo').notEmpty().withMessage('subEmployee ID is required'),
  body('startDate').notEmpty().withMessage('Start Date is required'),
  body('deadlineDate').notEmpty().withMessage('Deadline Date is required'),
  body('startTime').notEmpty().withMessage('Start Time is required'),
  body('endTime').notEmpty().withMessage('End Time is required'),
], jwtMiddleware, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startDate, startTime, deadlineDate, endTime, assignTo } = req.body;
  const taskId = req.params.taskId;

  // Check if the task with the given taskId exists
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  let picturePath = task.picture; // Retain the original picture path if no new picture is provided
  let audioPath = task.audio; // Retain the original audio path if no new audio is provided

  // Check if picture and audio files were included in the request and update the paths accordingly
  if (req.files && req.files.picture && req.files.audio) {
    picturePath = req.files.picture[0].path;
    audioPath = req.files.audio[0].path;
  }

  try {
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

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/list/subemployee/sendTasks', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.subEmployeeId;

    const { startDate, endDate } = req.query;

    let query = { assignedByEmp: userId };

    if (startDate && endDate) {
      query = {
        ...query,
        startDate: { $gte: new Date(startDate) },
        deadlineDate: { $lte: new Date(endDate) }
      };
    }

    // Find tasks matching the query
    const tasks = await Task.find(query)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    if (tasks.length === 0) {
      // If no tasks are found, return a 404 response
      return res.status(404).json({ error: 'No tasks found' });
    }

    // Send the list of tasks as a JSON response
    res.json({ total: tasks.length, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/list/employee/assignedTasks', jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.subEmployeeId;

    console.log(userId);


    let query = { assignedBy: userId };


    const tasks = await Task.find(query)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    if (tasks.length === 0) {
      return res.status(200).json({ error: 'No tasks found' });
    }

    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







router.get('/list/employee/sendTasks', jwtMiddleware, async (req, res) => {
  try {
    // Retrieve the user's ID from the JWT token
    const userId = req.user.employeeId;



    console.log(userId);

    // Extract startDate and endDate from the query parameters
    const { startDate, endDate } = req.query;

    // Create a query object
    let query = { assignedBy: userId };

    // Add date filters if provided
    if (startDate && endDate) {
      query = {
        ...query,
        startDate: { $gte: new Date(startDate) },
        deadlineDate: { $lte: new Date(endDate) }
      };
    }


    const tasks = await Task.find(query)
      .populate('assignTo', 'name')
      .populate('assignedBy', 'name');

    if (tasks.length === 0) {
      // If no tasks are found, return a 404 response
      return res.status(404).json({ error: 'No tasks found' });
    }

    // Send the list of tasks as a JSON response
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/tasks/:taskId/remarkToList', jwtMiddleware, async (req, res) => {
  try {
    const name = req.user.name
    const taskId = req.params.taskId;
    const { remark } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    const adjustedTimestamp = moment().add(5, 'hours').add(30, 'minutes').toDate();

    task.remarkToList.push({ remark, timestamp: adjustedTimestamp, assignedBy: name });  // Append the new remark with timestamp
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});






router.put('/tasks/:taskId/remarkToListNEW', jwtMiddleware, async (req, res) => {
  try {
    const name = req.user.name;
    const taskId = req.params.taskId;
    const { remark } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    const adjustedTimestamp = moment().add(5, 'hours').add(30, 'minutes').toDate();

    task.remarkToList = [{ remark, timestamp: adjustedTimestamp, assignedBy: name }];

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});




router.get('/tasks/:taskId/remarkToList', async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.status(200).json(task.remarkToList);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



// Add a remark toList
router.post('/tasks/:id/empRemarkToList', jwtMiddleware, async (req, res) => {
  try {
    const name = req.user.name
    const taskId = req.params.id;
    const { remark } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    const adjustedTimestamp = moment().add(5, 'hours').add(30, 'minutes').toDate();

    task.empRemarkToList.push({ remark, timestamp: adjustedTimestamp, assignedByEmp: name });  // Append the new remark with timestamp
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/tasks/:id/empRemarkToList', async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.status(200).json(task.empRemarkToList);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router















///    