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
            
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
        
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const templates = await ShiftTemplate.find({
                managerId: managerId,
                dayOfWeek: dayOfWeek
            });

            res.status(200).json({message: `${dayOfWeek} ${managerId}`});
            if(templates.length === 0) {
                continue;
            }

            let emps = []

            for (const template of templates) {
                const employees = await Employee.aggregate([
                    {
                        $match: {
                            positions: template.positionId // Match documents where the position array contains the specified position ID (template.position)
                        }
                    },
                    {
                        $project: {
                            sliceOfArray: { $slice: [`$availability.${template.dayOfWeek}`, parseInt(template.startTime.split(':')[0]), parseInt(template.endTime.split(':')[0])] }
                        }
                    },
                    {
                        $match: {
                            sliceOfArray: { $all: [true] }
                        }
                    }
                  ]);

                if (getEmployeesByPosition.length === 0) {
                    emps.push(["0"]);
                }
                else {
                    emps.push(employees);
                }
            }

            while(emps.length != 0) {
                let shortestArray = emps[0]; // Initialize with the first array
                let shortestLength = emps[0].length; // Initialize with the length of the first array
                let index = 0;

                for (let i = 1; i < emps.length; i++) {
                    if (emps[i].length < shortestLength) {
                        shortestArray = emps[i];
                        shortestLength = emps[i].length;
                        index = i;
                    }
                }

                let template = templates[index];
                let empId = "0";

                if(shortestArray[0] != "0") {
                    for(const emp in shortestArray) {
                        const shifts = await Shift.find({ 
                            empId: emp._id,
                            date: { $gte: date, $lt: nextDate },
                        });
                        if (shifts.length === 0) {
                            empId = emp._id;
                            break;
                        }
                    }
                    
                    if(empId != "0") {
                        const newShift = new Shift({
                            _id: new mongoose.Types.ObjectId(),
                            date: date,
                            empId: empId,
                            templateId: template._id
                        });
                        
                        
                        await newShift.save();
                        
                        shifts.push( newShift._id );
                    }
                }

                emps.splice(index, 1);
                templates.splice(index, 1);

            }
        
        }

        const newSched = new Schedule({
            _id: new mongoose.Types.ObjectId(),
            startDate: startDate,
            endDate: endDate,
            managerId: managerId
        });

        newSched.save();
        
        res.status(200).json({message: 'Schedule generated successfully', schedule: newSched});

      } 
      
      catch (error) {
        console.log({message: 'Error generating schedule shift:', error: error.toString()})
        res.status(400).json({message: 'Error generating schedule shift:', error: error.toString()});
      }
};

