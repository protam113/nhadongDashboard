// types.ts
import {RcFile} from "antd/es/upload";

/**
 authContext Interface
 **/

export interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    getToken: () => string | null; // Thêm getToken vào kiểu AuthContextType
}

/**
 PushButtonProps Interface
 **/
export interface PushButtonProps {
    href: string; // Đường dẫn để chuyển hướng
    label: string
}


/**
 Filters Interface
 **/
export interface Filters {
    [key: string]: string | number | string[] | undefined;
}

export interface SectionField {
    type: 'title' | 'description' | 'content' | 'link';
    value: string;
}

export interface Section {
    fields: SectionField[];
}


export interface Category {
    id: string;
    name: string;
    image: string;
}

export interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    link: string;
    image: string;
    created_date: string;
    updated_date: string;
    categories: Category[];
}

export interface EditCategoryItem {
    name: string;
    image: RcFile | null; // Chỉnh sửa kiểu file thành RcFile | null
}




/**
 New Event Interface
 **/


export interface NewEvent {
    title: string;
    description: string;
    category: string; // Mảng danh mục
    status: string;
    image: File[] | string | null;
}


export interface UpdateEvent {
    title: string| null;
    description: string| null;
    category: string| null
    status: string| null;
    image: File[] | string | null;
}


export interface NewDocs {
    title: string;
    description: string;
    content: string; // Mảng nội dung chi tiết
    link: string;
    category: string; // Mảng danh mục
    image: File[] | string;
  }

/**
 Event Interface
 **/

export interface EventList {
    id: string;
    title: string;
    description: string;
    content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    status: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    category: string;
    user: string;
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchEventListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: EventList[];
}


/**
 Schedule Interface
 **/

 interface Feasts {
    id: string;
    feast_name: string;
    feast_type: string;
  }
  
  interface ScheduleItem {
    id: string;
    day: Date;
    weekday: string;
    feasts: Feasts[];
  }
  
  export interface ScheduleList {
    results: ScheduleItem[]; 
    find: any // The correct property name for the array of schedule items
  }
  


/**
 BrowseQueue Interface
 **/

  export interface BrowseQueueResponse {
    data: any;  // Thay thế `any` bằng kiểu cụ thể nếu biết rõ kiểu dữ liệu trả về
    success: boolean;
}


/**
 NhaDong History Interface
 **/

 

export interface HistoryMonasteryResponse {
    id:string,
    about:string,
}




interface Documents {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_image: string;
}

export interface DocsList {
    id: string;
    title: string;
    description: string;
    content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    link: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    categories: Category[];
    user: Documents; // Sử dụng interface User đã khai báo ở trên
}


/**
 event register list Interface
 **/

 interface Field {
    label: string;
    value: string | null;
    field_type: string;
}

interface FieldsData {
    dob?: Field;
    email?: Field;
    image?: Field;
    location?: Field;
    pardoner?: Field;
    last_name?: Field;
    first_name?: Field;
    baptism_day?: Field;
    baptismal_at?: Field;
    phone_number?: Field;
    dad_last_name?: Field;
    mom_last_name?: Field;
    dad_first_name?: Field;
    mom_first_name?: Field;
    confirmation_at?: Field;
    parish_hometown?: Field;
    baptism_day_form?: Field;
    learning_process?: Field;
    baptismal_sponsor?: Field;
    confirmation_form?: Field;
    confirmation_mass?: Field;
    first_communion_day?: Field;
    confirmation_sponsor?: Field;
    religious_vocation_id?: Field;
    brothers_and_sisters_name?: Field;
    brothers_and_sisters_year?: Field;
}

 interface EventRegisterList {
    id:string,
    fields_data:   FieldsData,
    status: string,
    created_date:Date,

  }
  


  export interface EventRegisterListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: EventRegisterList[];
  }

  export interface SubmitEventRegister {
    registration_id: string ;
    status: string
  }


/**
 group post Interface
 **/

 
  export interface Group {
    groupId: string;
  }

  export interface Post {
   postId: string;
  }



interface Documents {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_image: string;
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchDocsListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: DocsList[];
}


/**
  post Interface
 **/


interface PostCategory {
    id: number;
    name: string;
    file: string;
  }
  
  interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_image: string;
  }
  
  interface PostList {
    id: number;
    title: string;
    description: string;
    content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    link: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    categories: PostCategory[];
    user: User; // Sử dụng interface User đã khai báo ở trên
  }
  
  // Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
 export interface FetchBLogsListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PostList[];
  }
  


  export interface NewPost {
    title: string;
    description: string;
    content: string; // Mảng nội dung chi tiết
    link: string;
    category: string[]; // Mảng danh mục
    image: File[] | string; // Hình ảnh chính cho bài viết
  }

  
/**
  change password Interface
 **/



  export interface ChangePassword {
    old_password: string;
    new_password: string;
  }
  
  export interface VerifyCode {
    email:string 
  }

  export interface ResetPassword {
    code:string, 
    new_password: string,
    email: string,
  }


  /**
  update profiile Interface
 **/

  export interface UpdateProfile {
    profile_image:File | null
    first_name: string| null;
    last_name: string| null;
    phone_number: string| null;
  }

