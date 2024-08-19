const express = require('express');
const Notification = require('../models/Notification');
const jwtMiddleware = require('../jwtmiddleware');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/create', jwtMiddleware, async (req, res) => {
  try {
      const adminId = req.user.employeeId; // Get the ID of the admin creating the task
      const employeeId = req.user.subEmployeeId; // Get the ID of the admin creating the task
      const assignedByname = req.user.name; // Get the assignedByname from req.user
      const { recipientId, taskId, message, title, description, startDate, deadlineDate, startTime, endTime, status } = req.body;

      // Transform recipientId array of strings into an array of objects
      const recipientObjects = recipientId.map(id => ({ recipientId: id }));

      // Create a new notification with both userId (admin) and recipientId (transformed array)
      const notification = new Notification({
          userId: adminId ? adminId : employeeId, // ID of the admin creating the task
          recipientId: recipientObjects, // Transformed recipient ID array
          taskId, // ID of the newly created task
          message,
          assignedByname, // Dynamically determined name
          title,
          description,
          startDate,
          deadlineDate,
          startTime,
          endTime,
          status
      });

      // Save the task and notification to the database
      await notification.save();

      res.status(201).json({ message: 'Notification sent successfully' });
  } catch (error) {
      console.error('Error creating task and notification:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Create Notification Route
router.post('/notifications', async (req, res) => {
  const {
    userId,
    recipientId,
    taskId,
    title,
    description,
    startDate,
    deadlineDate,
    startTime,
    endTime,
    status,
    assignedByname,
    message,
  } = req.body;

  try {
    const notification = new Notification({
      userId,
      recipientId,
      taskId,
      title,
      description,
      startDate,
      deadlineDate,
      startTime,
      endTime,
      status,
      assignedByname,
      message,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/getMyNotification', jwtMiddleware, async (req, res) => {
  try {
    const employeeId = req.user.subEmployeeId; // Get the employee ID from the JWT token

    console.log(employeeId);

    // Fetch notifications where recipientId matches employeeId and isRead is false
    const notifications = await Notification.aggregate([
      { $unwind: "$recipientId" },
      {
        $match: {
          "recipientId.recipientId": employeeId,
          "recipientId.isRead": false,
        }
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          recipientId: { $push: "$recipientId" },
          taskId: { $first: "$taskId" },
          title: { $first: "$title" },
          description: { $first: "$description" },
          startDate: { $first: "$startDate" },
          deadlineDate: { $first: "$deadlineDate" },
          startTime: { $first: "$startTime" },
          endTime: { $first: "$endTime" },
          status: { $first: "$status" },
          assignedByname: { $first: "$assignedByname" },
          message: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
        }
      }
    ]);

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: 'No unread notifications found' });
    }

    // Update the isRead field to true for the fetched notifications
    await Notification.updateMany(
      {
        "_id": { $in: notifications.map(n => n._id) },
        "recipientId.recipientId": employeeId
      },
      {
        $set: { "recipientId.$[elem].isRead": true }
      },
      {
        arrayFilters: [{ "elem.recipientId": employeeId }]
      }
    );

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/getUnreadNotificationCount', jwtMiddleware, async (req, res) => {
  try {
    const employeeId = req.user.subEmployeeId; // Get the employee ID from the JWT token

    const unreadCount = await Notification.aggregate([
      { $unwind: "$recipientId" },
      {
        $match: {
          "recipientId.recipientId": employeeId,
          "recipientId.isRead": false,
        }
      },
      {
        $count: "unreadCount"
      }
    ]);

    // If no unread notifications found, return a count of 0
    const count = unreadCount.length > 0 ? unreadCount[0].unreadCount : 0;

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/getAll', async (req, res) => {
  try {
      const notifications = await Notification.find();
      res.status(200).json(notifications);
  } catch (error) {
      console.error('Error retrieving notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.get('/notifications', jwtMiddleware, async (req, res) => {
    try {
      const subEmployeeId = req.user.subEmployeeId;
  
      if (!subEmployeeId) {
        return res.status(400).json({ error: 'Invalid subEmployeeId' });
      }
  
      // Retrieve unread notifications for the subemployee
      const notifications = await Notification.find({ recipientId: subEmployeeId, isRead: false }).sort({ createdAt: -1 });
  
      // If no notifications are found, send a 404 response
      if (!notifications.length) {
        return res.status(404).json({ message: 'No unread notifications found' });
      }
  
      // Send the notifications with a 200 status code
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error retrieving notifications:', error);
  
      // Send a 500 status code for server errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



router.get('/notification', jwtMiddleware, async (req, res) => {
    try {
      const subEmployeeId = req.user.employeeId;
  
      if (!subEmployeeId) {
        return res.status(400).json({ error: 'Invalid employeeId' });
      }
  
      // Retrieve unread notifications for the subemployee
      const notifications = await Notification.find({ recipientId: subEmployeeId, isRead: false }).sort({ createdAt: -1 });
  
      // If no notifications are found, send a 404 response
      if (!notifications.length) {
        return res.status(404).json({ message: 'No unread notifications found' });
      }
  
      // Send the notifications with a 200 status code
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error retrieving notifications:', error);
  
      // Send a 500 status code for server errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  router.get('/notification/emp', async (req, res) => {
    try {
        const subEmployeeId = req.body;
  
        if (!subEmployeeId) {
            return res.status(400).json({ error: 'Invalid employeeId' });
        }
  
        // Retrieve unread notifications for the subemployee
        const notifications = await Notification.find({ 
            'recipientId.recipientId': subEmployeeId, 
            'recipientId.isRead': false 
        }).sort({ createdAt: -1 });
  
        // If no notifications are found, send a 404 response
        if (!notifications.length) {
          console.log(notifications.length)

            return res.status(404).json({ message: 'No unread notifications found' });
        }
  
        // Send the notifications with a 200 status code
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
  
        // Send a 500 status code for server errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// PUT route to mark a notification as read when clicking on a task
router.put('/:notificationId/read', async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        // Find the notification by its ID
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Mark the notification as read
        notification.isRead = true;

        // Save the updated notification
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
