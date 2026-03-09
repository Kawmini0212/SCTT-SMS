const DegreeProgram = require('../models/DegreeProgram');

class DegreeProgramController {
    // Get all degree programs
    async getAllPrograms(req, res, next) {
        try {
            const programs = await DegreeProgram.findAll();

            res.json({
                success: true,
                data: programs
            });
        } catch (error) {
            next(error);
        }
    }

    // Get degree program by ID
    async getProgramById(req, res, next) {
        try {
            const { id } = req.params;
            const program = await DegreeProgram.findById(id);

            if (!program) {
                return res.status(404).json({
                    success: false,
                    message: 'Degree program not found'
                });
            }

            res.json({
                success: true,
                data: program
            });
        } catch (error) {
            next(error);
        }
    }

    // Create degree program
    async createProgram(req, res, next) {
        try {
            const programData = req.body;

            // Check if program code exists
            const existing = await DegreeProgram.findByCode(programData.programCode);
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Program code already exists'
                });
            }

            const result = await DegreeProgram.create(programData);

            res.status(201).json({
                success: true,
                message: 'Degree program created successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // Update degree program
    async updateProgram(req, res, next) {
        try {
            const { id } = req.params;
            const programData = req.body;

            const existing = await DegreeProgram.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Degree program not found'
                });
            }

            const updated = await DegreeProgram.update(id, programData);

            if (updated) {
                res.json({
                    success: true,
                    message: 'Degree program updated successfully'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update degree program'
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // Delete degree program
    async deleteProgram(req, res, next) {
        try {
            const { id } = req.params;

            const program = await DegreeProgram.findById(id);
            if (!program) {
                return res.status(404).json({
                    success: false,
                    message: 'Degree program not found'
                });
            }

            const deleted = await DegreeProgram.delete(id);

            if (deleted) {
                res.json({
                    success: true,
                    message: 'Degree program deleted successfully'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete degree program'
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DegreeProgramController();
