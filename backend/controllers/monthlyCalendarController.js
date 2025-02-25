const mongoose = require('mongoose');

const TodoSchema = require('../models/todoSchema');

module.exports = async function monthlyCalendarController(requestBody) {
    try {

        const stringifiedBody = {};
        for (const key in requestBody) 
        {
          stringifiedBody[key] = String(requestBody[key]);
        }
        const { username, email, monthyear } = stringifiedBody;
        const [month, year] = monthyear.split('/');

        // Query the database to find all todos that match the given month and year
        const todos = await TodoSchema.aggregate([
            {
                $match: {
                    username,
                    email,
                    $expr: {
                        $and: [
                            { $eq: [{ $month: { $dateFromString: { dateString: "$deadline", format: "%m/%d/%Y" } } }, parseInt(month)] },
                            { $eq: [{ $year: { $dateFromString: { dateString: "$deadline", format: "%m/%d/%Y" } } }, parseInt(year)] }
                        ]
                    }
                }
            }
        ]);

        return todos;
    } catch (error) {
    }
}