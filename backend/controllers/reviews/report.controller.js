import Report from "../models/report.model.js";

// Create a new report
export const createReport = async (req, res, next) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

// Get all reports
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

// Get a report by ID
export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

// Update a report
export const updateReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

// Delete a report
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    next(error);
  }
};

