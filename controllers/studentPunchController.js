const StudentPunch = require("../models/StudnetPunch")


const createStudentPunch = async (req, res) => {
    try {
      const { studentId } = req.params;
      const { type } = req.body;
  
      if (!studentId || !type) {
        return res.status(400).json({
          success: false,
          message: "studentId and type (IN or OUT) are required",
        });
      }
  
      if (!['IN', 'OUT'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "type must be either 'IN' or 'OUT'",
        });
      }
  
      const newPunch = new StudentPunch({
        studentId,
        type,
        punchTime: new Date(),
      });
  
      await newPunch.save();
  
      res.status(201).json({
        success: true,
        message: `Punch ${type} recorded successfully`,
        data: {
          studentId,
          type,
          punchTime: newPunch.punchTime,
        }
      });
  
    } catch (error) {
      console.error("Create Punch Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  


  const getTodayPunchTimes = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      if (!studentId) {
        return res.status(400).json({ success: false, message: "StudentId is required" });
      }
  
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      // Find today's punch entries
      const punches = await StudentPunch.find({
        studentId,
        punchTime: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ punchTime: 1 }).lean();
  
      if (!punches.length) {
        return res.status(404).json({
          success: false,
          message: "No punch data available for today",
        });
      }
  
      const punchIn = punches.find(p => p.type === 'IN');
      const punchOut = punches.reverse().find(p => p.type === 'OUT');
  
      res.status(200).json({
        success: true,
        data: {
          punchInTime: punchIn?.punchTime || null,
          punchOutTime: punchOut?.punchTime || null,
        }
      });
  
    } catch (error) {
      console.error("Punch Time Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  
  module.exports={
    createStudentPunch,
    getTodayPunchTimes
  }