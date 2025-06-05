// -------- PURCHASE DETAILS --------
exports.getPurchaseDetails = async (req, res) => {
  const { studentId } = req.params;

  return res.json({
    success: true,
    data: [
      {
        purchaseId: "PUR001",
        itemName: "Advanced Math Course",
        price: 999
      },
      {
        purchaseId: "PUR002",
        itemName: "Science Material",
        price: 499
      }
    ]
  });
};

// -------- SMS DETAILS --------
exports.getSmsDetails = async (req, res) => {
  const { studentId } = req.params;

  return res.json({
    success: true,
    data: [
      {
        smsId: "SMS001",
        content: "Your test is scheduled at 3PM today."
      },
      {
        smsId: "SMS002",
        content: "Please submit your assignment by tomorrow."
      }
    ]
  });
};

// -------- STUDENT DOCUMENTS --------
exports.getStudentDocuments = async (req, res) => {
  const { studentId } = req.params;

  return res.json({
    success: true,
    data: [
      {
        docId: "DOC001",
        name: "Aadhar Card",
        downloadUrl: "https://example.com/docs/aadhar001.pdf"
      },
      {
        docId: "DOC002",
        name: "10th Marksheet",
        downloadUrl: "https://example.com/docs/marksheet10.pdf"
      }
    ]
  });
};


// -------- ATTENDANCE FROM MACHINE (with optional date filter) --------
exports.getStudentAttendanceFromMachine = async (req, res) => {
  const { studentId } = req.params;
  const { date } = req.query;

  // Dummy data
  const attendanceRecords = [
    {
      date: "2025-06-04",
      status: "Present",
      time: "09:03 AM",
      machineId: "MCH001",
      userId: studentId
    },
    {
      date: "2025-06-03",
      status: "Absent",
      time: null,
      machineId: "MCH001",
      userId: studentId
    },
    {
      date: "2025-06-02",
      status: "Present",
      time: "08:57 AM",
      machineId: "MCH001",
      userId: studentId
    }
  ];

  // Agar date query param hai to filter karo
  const filteredData = date
    ? attendanceRecords.filter(record => record.date === date)
    : attendanceRecords;

  return res.json({
    success: true,
    data: filteredData
  });
};
