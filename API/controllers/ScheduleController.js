const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');
const ShiftTemplate = require('../models/ShiftTemplate');
const Position  = require('../models/Position');

exports.generateSchedule = async (req, res) => {
    try {
        const { managerId, startDate, endDate } = req.body;
    
        if (!managerId, !startDate, !endDate) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        for(i = 0; i < 2; i++)
        {
            if (i == 0)
                date = startDate;
            else
                date = endDate;
            
            if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
                return res.status(400).json({ message: 'Invalid date format' });
            }
        
            const [month, day, year] = date.split('-').map(d => parseInt(d, 10));
        
            if (isNaN(month) || month < 1 || month > 12 ||
                isNaN(day) || day < 1 || day > 31 ||
                isNaN(year) || year < 1000 || year > 9999) {
                return res.status(400).json({ message: 'Invalid date' });
            }
        
            
            const shiftDate = new Date(year, month - 1, day);
            if (!(shiftDate instanceof Date && !isNaN(shiftDate))) {
                return res.status(400).json({ message: 'Invalid date' });
            }
        }

        const manager = await Employee.findById(managerId);

        if (!manager)
            return res.status(404).json({message: "Could not find manager with that ID"});

        const templates = await ShiftTemplate.find({managerId: managerId});

        if(!templates || templates.length == 0)
            return res.status(404).json({message: "No shift templates found for that manager"});

        let shifts = [];
        const end = new Date(endDate);
        
        // For each day
        for (let date = new Date(startDate); date <= end; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
        
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            // Get the shift templates for manager by day
            const templates = await ShiftTemplate.find({
                managerId: managerId,
                dayOfWeek: dayOfWeek
            });
            
            // Skip empty days
            if(templates.length === 0) {
                continue;
            }

            let emps = []

            // Loop through templates and find possible employees for each
            for (const template of templates) {

                // Availability indexes
                const startIdx = parseInt(template.startTime.split(':')[0]);
                const endIdx = parseInt(template.endTime.split(':')[0]);

                // Find all employees matching manager and position
                const employees = await Employee.aggregate([
                    {
                        $match: {
                            managedBy: new mongoose.Types.ObjectId(managerId),
                            positions: template.positionId
                        }
                    }
                ]);

                // Filter by matching availability
                const avail = [];

                for (const emp of employees) {
                    avail.push(emp);
                    try{
                        for (i = startIdx; i < endIdx; i++) {
                            if (!emp.availability[dayOfWeek][i]) {
                                avail.splice(-1, 1);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        avail.splice(-1, 1);
                    }
                }
                
                
                // If no employees, add "empty employee value" of 0 to match template length
                if (avail.length === 0) {
                    emps.push(["0"]);
                }
                else {
                    emps.push(avail);
                }
            }

            if (emps.length != templates.length) {
                throw new Error("Internal error: emps.length != templates.length");
            }


            // Loop through employees and templates
            while(emps.length != 0) {
                let shortestArray = emps[0]; // Initialize with the first array
                let shortestLength = emps[0].length; // Initialize with the length of the first array
                let index = 0;

                // Find template with least number of employees
                for (let i = 1; i < emps.length; i++) {
                    if (emps[i].length < shortestLength) {
                        shortestArray = emps[i];
                        shortestLength = emps[i].length;
                        index = i;
                    }
                }

                let template = templates[index];

                // If there are emps in emps array
                if(shortestArray[0] != "0") {
                    // Assign first emp to shift that isnt already scheduled
                    for(const emp of shortestArray) {
                        
                        const empShifts = await Shift.find({ 
                            empId: { $exists: true, $eq: emp._id },
                            date: { $exists: true, $gte: date, $lt: nextDate },
                        });
                        
                        if (empShifts.length === 0) {                            
                            const newShift = new Shift({
                                _id: new mongoose.Types.ObjectId(),
                                empId: emp._id,
                                date: date,
                                templateId: template._id
                            });
                            
                            
                            await newShift.save();                            
                            shifts.push( newShift._id );

                            break;
                        }
                    }
                }

                // Remove employees and template from arrays
                emps.splice(index, 1);
                templates.splice(index, 1);

            }
        
        }

        const newSched = new Schedule({
            _id: new mongoose.Types.ObjectId(),
            startDate: startDate,
            endDate: endDate,
            managerId: managerId,
            shifts: shifts
        });

        newSched.save();
        
        res.status(200).json({message: 'Schedule generated successfully', schedule: newSched});

      } 
      
      catch (error) {
        console.log({message: 'Error generating schedule shift:', error: error.toString()})
        res.status(400).json({message: 'Error generating schedule shift:', error: error.toString()});
      }
};

exports.nuke = async (req, res) => {
    try {
      await Schedule.deleteMany({});
    } catch (error) {
      console.log('Error nuking schedule:', error);
      res.status(500).json({ message: 'Error nuking schedule', error: error.toString() });
    }
  };