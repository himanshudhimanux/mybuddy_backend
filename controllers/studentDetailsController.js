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
