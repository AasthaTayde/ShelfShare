const Notification = require("../models/Notification");

// Get notifications of logged-in user

exports.getNotifications = async (req, res) => {

  try {

    const notifications = await Notification.find({

      user: req.user.id,

    }).sort({

      createdAt: -1,

    });

    res.status(200).json({

      success: true,

      count: notifications.length,

      notifications,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// Mark notification as read

exports.markAsRead = async (req, res) => {

  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {

      return res.status(404).json({

        success: false,

        message: "Notification not found",

      });

    }

    if (notification.user.toString() !== req.user.id) {

      return res.status(403).json({

        success: false,

        message: "Unauthorized",

      });

    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({

      success: true,

      message: "Notification marked as read",

      notification,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
exports.markAsRead = async (req, res) => {

    try {
  
      const notification = await Notification.findById(req.params.id);
  
      if (!notification) {
  
        return res.status(404).json({
  
          success: false,
  
          message: "Notification not found",
  
        });
  
      }
  
      if (notification.user.toString() !== req.user.id) {
  
        return res.status(403).json({
  
          success: false,
  
          message: "Unauthorized",
  
        });
  
      }
  
      notification.isRead = true;
  
      await notification.save();
  
      res.status(200).json({
  
        success: true,
  
        message: "Notification marked as read",
  
      });
  
    } catch (error) {
  
      res.status(500).json({
  
        success: false,
  
        message: error.message,
  
      });
  
    }
  
  };