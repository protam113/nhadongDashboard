// 'use client';


// import Image from "next/image";
// import AttendanceChart from "../chart/AttendanceChart";

// const AttendanceChartContainer = async () => {
//     const today = new Date();
//     const dayOfWeek = today.getDay();
//     const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

//     const lastMonday = new Date(today);
//     lastMonday.setDate(today.getDate() - daysSinceMonday);

//     // Dữ liệu mẫu
//     const sampleAttendanceData = [
//         { date: new Date("2024-10-23"), present: true },  // Monday
//         { date: new Date("2024-10-24"), present: false }, // Tuesday
//         { date: new Date("2024-10-25"), present: true },  // Wednesday
//         { date: new Date("2024-10-26"), present: false }, // Thursday
//         { date: new Date("2024-10-27"), present: true },  // Friday
//         { date: new Date("2024-10-30"), present: true },  // Wednesday
//     ];

//     // Sử dụng dữ liệu mẫu thay vì gọi đến cơ sở dữ liệu
//     const resData = sampleAttendanceData.filter(item => item.date >= lastMonday);

//     const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

//     const attendanceMap: { [key: string]: { present: number; absent: number } } =
//         {
//             Mon: { present: 0, absent: 0 },
//             Tue: { present: 0, absent: 0 },
//             Wed: { present: 0, absent: 0 },
//             Thu: { present: 0, absent: 0 },
//             Fri: { present: 0, absent: 0 },
//         };

//     resData.forEach((item) => {
//         const itemDate = new Date(item.date);
//         const dayOfWeek = itemDate.getDay();

//         if (dayOfWeek >= 1 && dayOfWeek <= 5) {
//             const dayName = daysOfWeek[dayOfWeek - 1];

//             if (item.present) {
//                 attendanceMap[dayName].present += 1;
//             } else {
//                 attendanceMap[dayName].absent += 1;
//             }
//         }
//     });

//     const data = daysOfWeek.map((day) => ({
//         name: day,
//         present: attendanceMap[day].present,
//         absent: attendanceMap[day].absent,
//     }));

//     return (
//         <div className="bg-white rounded-lg p-4 h-full">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-lg font-semibold">Attendance</h1>
//                 <Image src="/moreDark.png" alt="" width={20} height={20} />
//             </div>
//             <AttendanceChart data={data} />
//         </div>
//     );
// };

// export default AttendanceChartContainer;
