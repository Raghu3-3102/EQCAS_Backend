import Certification from "../../models/CertificationModel/CertificationModel.js";
import renewal from "../../models/PastRSEdate/PastRSEdate.js";

export const getExpiredReports = async (req, res) => {
    try {

        const today = new Date();
        const expiredCertifications = await Certification.find({
            certificationExpiryDate: { $lt: today }
        }).select(
            "companyName certificationNumber certificationExpiryDate email attachment logo RenewalStatus"
        );

        res.status(200).json({
            success: true,
            data: expiredCertifications
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching expired reports",
            error: error.message,
        });
    }
}

export const getExpiredReportsByMonth = async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        const data = await Certification.aggregate([
            {
                $match: {
                    certificationExpiryDate: { $gte: startOfYear, $lt: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$certificationExpiryDate" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // ✅ Create object with month name as key & default value as 0
        const result = {};
        months.forEach(m => result[m] = 0);

        // ✅ Insert actual values from DB into result object
        data.forEach(item => {
            const monthIndex = item._id - 1;     // month from DB (1–12)
            result[months[monthIndex]] = item.count;
        });

        res.status(200).json({
            success: true,
            year,
            data: result   // <-- output becomes { Jan: 0, Feb: 10, ... }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExpiredReportsByWeek = async (req, res) => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0 = Jan

        const firstDay = new Date(year, month, 1);
        const nextMonth = new Date(year, month + 1, 1);

        const data = await Certification.aggregate([
            {
                $match: {
                    certificationExpiryDate: { $gte: firstDay, $lt: nextMonth }
                }
            },
            {
                $project: {
                    weekOfMonth: {
                        $ceil: {
                            $divide: [
                                { $dayOfMonth: "$certificationExpiryDate" },
                                7
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$weekOfMonth",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Total weeks in the current month (max 5)
        const totalWeeks = Math.ceil((nextMonth - firstDay) / (7 * 24 * 60 * 60 * 1000));

        // ✅ Create object like Week1: 0, Week2: 0, ...
        const result = {};
        for (let i = 1; i <= totalWeeks; i++) {
            result[`Week${i}`] = 0;
        }

        // ✅ Assign DB values to correct week
        data.forEach(item => {
            result[`Week${item._id}`] = item.count;
        });

        res.status(200).json({
            success: true,
            month,
            data: result    // returns { Week1: 0, Week2: 2, Week3: 0, ... }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExpiredReportsByDay = async (req, res) => {
    try {
        const today = new Date();

        // Monday → Sunday Range
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

        const data = await Certification.aggregate([
            {
                $match: {
                    certificationExpiryDate: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$certificationExpiryDate" }, // 1 = Sun ... 7 = Sat
                    count: { $sum: 1 }
                }
            }
        ]);

        // ✅ Day label mapping
        const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // ✅ Create object { Sun:0, Mon:0, ... }
        const result = {};
        dayMap.forEach(day => (result[day] = 0));

        // ✅ Assign values from DB result
        data.forEach(item => {
            const dayIndex = item._id - 1;
            const dayName = dayMap[dayIndex];
            result[dayName] = item.count;
        });

        res.status(200).json({
            success: true,
            week: "current week",
            data: result,  // returns { Sun:0, Mon:2, Tue:1, ... }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};







export const getFirstSurveillanceDueReports = async (req, res) => {
  try {
    const today = new Date();

    
    const firstSurveillanceReports = await Certification.find({
      firstSurveillanceAudit: { $lt: today },
    }).select(
      "companyName certificationNumber firstSurveillanceAudit firstSurveillanceNotes  email attachment logo certificationExpiryDate"
    );

       res.status(200).json({
            success: true,
            data: firstSurveillanceReports
        });
    

    
  }catch (error) {
     res.status(500).json({
            success: false,
            message: "Server error while fetching expired reports",
            error: error.message,
        });
  }
};

export const getFirstSurveillanceDueReportsByMonth = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const data = await Certification.aggregate([
      {
        $match: {
          firstSurveillanceAudit: { $gte: startOfYear, $lt: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: "$firstSurveillanceAudit" },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    months.forEach(m => result[m] = 0);

    data.forEach(item => {
      const monthIndex = item._id - 1;
      result[months[monthIndex]] = item.count;
    });

    res.status(200).json({
      success: true,
      year,
      data: result
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFirstSurveillanceDueReportsByWeek = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const nextMonth = new Date(year, month + 1, 1);

    const data = await Certification.aggregate([
      {
        $match: {
          firstSurveillanceAudit: { $gte: firstDay, $lt: nextMonth }
        }
      },
      {
        $project: {
          weekOfMonth: {
            $ceil: {
              $divide: [
                { $dayOfMonth: "$firstSurveillanceAudit" },
                7
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$weekOfMonth",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalWeeks = Math.ceil((nextMonth - firstDay) / (7 * 24 * 60 * 60 * 1000));

    const result = {};
    for (let i = 1; i <= totalWeeks; i++) {
      result[`Week${i}`] = 0;
    }

    data.forEach(item => {
      result[`Week${item._id}`] = item.count;
    });

    res.status(200).json({
      success: true,
      month,
      data: result
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFirstSurveillanceDueReportsByDay = async (req, res) => {
  try {
    const today = new Date();

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    const data = await Certification.aggregate([
      {
        $match: {
          firstSurveillanceAudit: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$firstSurveillanceAudit" },
          count: { $sum: 1 }
        }
      }
    ]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = {};
    days.forEach(day => (result[day] = 0));

    data.forEach(item => {
      const dayIndex = item._id - 1;
      const dayName = days[dayIndex];
      result[dayName] = item.count;
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};








export const secondSurveillanceReport = async (req, res) => {
    try {
        const today = new Date();
        const secondSurveillanceDue = await Certification.find({
            secondSurveillanceAudit: { $lt: today },
        }).select(
            "companyName certificationNumber secondSurveillanceAudit secondSurveillanceNotes email attachment logo certificationExpiryDate"
        );
        res.status(200).json({
            success: true,
            data: secondSurveillanceDue
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching second surveillance reports",
            error: error.message,
        });
    }
}

export const getSecondSurveillanceDueReportsByMonth = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const data = await Certification.aggregate([
      {
        $match: {
          secondSurveillanceAudit: { $gte: startOfYear, $lt: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: "$secondSurveillanceAudit" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to key-value pair object
    const result = {};
    monthNames.forEach((month, index) => {
      result[month] = 0;
    });

    data.forEach(item => {
      result[monthNames[item._id - 1]] = item.count;
    });

    res.status(200).json({
      success: true,
      year,
      data: result,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSecondSurveillanceDueReportsByWeek = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const nextMonth = new Date(year, month + 1, 1);

    const data = await Certification.aggregate([
      {
        $match: {
          secondSurveillanceAudit: { $gte: firstDay, $lt: nextMonth }
        }
      },
      {
        $project: {
          weekOfMonth: {
            $ceil: { $divide: [{ $dayOfMonth: "$secondSurveillanceAudit" }, 7] }
          }
        }
      },
      {
        $group: {
          _id: "$weekOfMonth",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalWeeks = Math.ceil(nextMonth.getDate() / 7);

    // Convert to key-value
    const result = {};
    for (let i = 1; i <= totalWeeks; i++) {
      result[`Week-${i}`] = 0;
    }

    data.forEach(item => {
      result[`Week-${item._id}`] = item.count;
    });

    res.status(200).json({
      success: true,
      month,
      data: result,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSecondSurveillanceDueReportsByDay = async (req, res) => {
  try {
    const today = new Date();

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const data = await Certification.aggregate([
      {
        $match: {
          secondSurveillanceAudit: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$secondSurveillanceAudit" }, // Sun=1 ... Sat=7
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to key-value object
    const result = {};
    dayNames.forEach(day => (result[day] = 0));

    data.forEach(item => {
      result[dayNames[item._id - 1]] = item.count;
    });

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// export const OverViewReportRenawalAudit = async (req, res)=>{
//     try {
//         const today = new Date();
//         const TotalExpired = await Certification.countDocuments({
//             certificationExpiryDate: { $lt: today },
//             RenewalStatus: "Pending"
//         })

       

//         const totalRenewed = await Certification.countDocuments({
//             certificationExpiryDate: { $lt: today },
//             RenewalStatus: "Renewed"
//         });

//         const renawalrate = ((totalRenewed / (TotalExpired + totalRenewed)) * 100).toFixed(2);

        
         



//         res.status(200).json({
//             success: true,
//             data: renewalDue
//         });
        
//     } catch (error) {
        
//     }
// }