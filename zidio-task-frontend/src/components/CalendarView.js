import React from "react";
import { format, parseISO, getYear, getMonth } from "date-fns";

const CalendarView = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="w-full bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Calendar View</h2>
                <p className="text-gray-600 text-center">No tasks available. Add some tasks to get started!</p>
            </div>
        );
    }

    // Group tasks by year and month
    const tasksByMonthYear = tasks.reduce((acc, task) => {
        const date = parseISO(task.deadline);
        const year = getYear(date);
        const month = getMonth(date); // 0 = January, 11 = December
        const formattedDate = format(date, "yyyy-MM-dd");

        if (!acc[year]) acc[year] = {};
        if (!acc[year][month]) acc[year][month] = {};
        if (!acc[year][month][formattedDate]) acc[year][month][formattedDate] = [];

        acc[year][month][formattedDate].push(task);
        return acc;
    }, {});

    return (
        <div className="bg-blue-50 rounded-lg p-4 mt-9 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Calendar View</h2>

            <div className="overflow-hidden"> {/* Scrollbar added after 1 month */}
                {Object.keys(tasksByMonthYear)
                    .sort((a, b) => a - b) // Sort by year ascending
                    .map((year) => (
                        <div key={year} className="mb-10">
                            {Object.keys(tasksByMonthYear[year])
                                .sort((a, b) => a - b) // Sort by month ascending
                                .map((month) => {
                                    const daysInMonth = new Date(year, Number(month) + 1, 0).getDate(); // Get total days in month

                                    return (
                                        <div key={month} className="mb-8">
                                            <h3 className="text-lg font-bold text-gray-800 text-center bg-gray-200 py-2 rounded mr-5">
                                                {format(new Date(year, month), "MMMM yyyy")}
                                            </h3>

                                            <div className="grid grid-cols-7 gap-2 mt-2">
                                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                                    const date = format(new Date(year, month, day), "yyyy-MM-dd");

                                                    return (
                                                        <div key={day} className="p-2 border rounded bg-white flex flex-col mr-5">
                                                            <h4 className="font-bold text-sm">{day}</h4>
                                                            {tasksByMonthYear[year][month][date] ? (
                                                                tasksByMonthYear[year][month][date].map((task) => (
                                                                    <div
                                                                        key={task._id}
                                                                        className="mt-2 bg-blue-100 text-blue-600 text-xs rounded px-2 py-1"
                                                                    >
                                                                        {task.title}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs text-gray-400">No tasks</p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CalendarView;
