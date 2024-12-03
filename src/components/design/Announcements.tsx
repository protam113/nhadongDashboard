// 'use client';


// const Announcements = async () => {
//     // Dữ liệu mẫu
//     const sampleAnnouncements = [
//         {
//             id: 1,
//             title: "Thông báo 1",
//             description: "Đây là mô tả cho thông báo 1.",
//             date: new Date("2024-10-30T10:00:00"),
//         },
//         {
//             id: 2,
//             title: "Thông báo 2",
//             description: "Đây là mô tả cho thông báo 2.",
//             date: new Date("2024-10-29T14:00:00"),
//         },
//         {
//             id: 3,
//             title: "Thông báo 3",
//             description: "Đây là mô tả cho thông báo 3.",
//             date: new Date("2024-10-28T16:00:00"),
//         },
//     ];

//     // Giả lập việc lấy dữ liệu từ cơ sở dữ liệu
//     const data = sampleAnnouncements.slice(0, 3); // Lấy tối đa 3 thông báo

//     return (
//         <div className="bg-white p-4 rounded-md">
//             <div className="flex items-center justify-between">
//                 <h1 className="text-xl font-semibold">Announcements</h1>
//                 <span className="text-xs text-gray-400">View All</span>
//             </div>
//             <div className="flex flex-col gap-4 mt-4">
//                 {data[0] && (
//                     <div className="bg-lamaSkyLight rounded-md p-4">
//                         <div className="flex items-center justify-between">
//                             <h2 className="font-medium">{data[0].title}</h2>
//                             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                                 {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
//                             </span>
//                         </div>
//                         <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
//                     </div>
//                 )}
//                 {data[1] && (
//                     <div className="bg-lamaPurpleLight rounded-md p-4">
//                         <div className="flex items-center justify-between">
//                             <h2 className="font-medium">{data[1].title}</h2>
//                             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                                 {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
//                             </span>
//                         </div>
//                         <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
//                     </div>
//                 )}
//                 {data[2] && (
//                     <div className="bg-lamaYellowLight rounded-md p-4">
//                         <div className="flex items-center justify-between">
//                             <h2 className="font-medium">{data[2].title}</h2>
//                             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
//                                 {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
//                             </span>
//                         </div>
//                         <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Announcements;
