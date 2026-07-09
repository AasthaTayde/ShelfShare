// Get all requests sent by buyer

exports.getBuyerRequests = async (req, res) => {

    try {
  
      const requests = await Request.find({
        buyer: req.user.id,
      })
        .populate("book")
        .populate("seller", "name email");
  
      res.status(200).json({
  
        success: true,
  
        count: requests.length,
  
        requests,
  
      });
  
    } catch (error) {
  
      res.status(500).json({
  
        success: false,
  
        message: error.message,
  
      });
  
    }
  
  };