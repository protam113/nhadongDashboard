// // QueueItem.tsx
// import React from 'react';
// import { Select } from 'antd';
// import type { QueueItemProps } from './types'; // Định nghĩa các kiểu dữ liệu nếu cần
//
// const { Option } = Select;
//
// const QueueItem: React.FC<QueueItemProps> = ({ item, onStatusChange }) => {
//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'approved':
//                 return '#82DD55';
//             case 'pending':
//                 return '#EDB95E';
//             case 'rejected':
//                 return '#E23636';
//             default:
//                 return '#000';
//         }
//     };
//
//     const handleStatusChange = (value: string) => {
//         onStatusChange(value, item.id);
//     };
//
//     return (
//         <>
//             {/* Các cột dữ liệu khác */}
//             <td>{item.id}</td>
//             <td>{new Date(item.created_date).toLocaleString()}</td>
//             <td>{new Date(item.updated_date).toLocaleString()}</td>
//             <td>
//                 {/* Hiển thị dữ liệu chi tiết ở đây */}
//             </td>
//             <td>{item.description}</td>
//             <td>
//                 {item.action}
//             </td>
//             <td>
//                 {item.status === 'pending' ? (
//                     <Select defaultValue={item.status} onChange={handleStatusChange}>
//                         <Option value="approved" style={{ color: '#82DD55' }}>Approved</Option>
//                         <Option value="rejected" style={{ color: '#E23636' }}>Rejected</Option>
//                     </Select>
//                 ) : (
//                     <span style={{ color: getStatusColor(item.status) }}>{item.status}</span>
//                 )}
//             </td>
//         </>
//     );
// };
//
// export default QueueItem;

const Page = () => {
    return(
        <div>
            <p>Study </p>
        </div>
    )
}
export default Page;