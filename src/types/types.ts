// types.ts

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

export interface TextParallaxContentProps {
  subheading: string;
  heading: string;
  children: React.ReactNode;
}

export interface OverlayCopyProps {
  subheading: string;
  heading: string;
}


/*
  Khai Báo Thuộc Tính Category
*/
interface CategoryList {
    id: number;
    name: string;
    model: string;
    file: string;
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchCategoriesListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: CategoryList[];
}

export interface EditCategoryItem {
    name: string;
    image: File | string | null;
}


export interface CreateCategoryItem {
    name: string;
    model: string;
    image: File | string | null; // Use File type for file, or string if necessary
}

/**
 PushButtonProps Interface
 **/
export interface PushButtonProps {
    href: string;
    label: string
}


/**
 Filters Interface
 **/
export interface Filters {
    [key: string]: string | number | string[] | undefined;
}

/**
 Galery Interface
 **/

interface GaleryList {
  id: string;
  image: string; // Chỉnh sửa để phù hợp với giá trị null trong JSON
}

export interface FetchGaleryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GaleryList[];
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
    media: Media[] | null;

}

export interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  link: string;
  image: string;
  created_date: string;
  updated_date: string;
  category: Category;
  media: Media[] | null;
}


export interface UpdateVocation {
  status: string;
  id: string[];
}

interface MediaVideoList {
  id: string;
  content: string;
  image: string;
  link: string;
  create_date: string;
}

export interface FetchMediaVideoResponse {
  data: MediaVideoList[];
}

export interface NewVideo {
  content:string,
  link:string
  image: File | string | null; // Use File type for file, or string if necessary
}

/**
 New Event Interface
 **/


export interface NewEvent {
    title: string;
    description: string;
    category: string; // Mảng danh mục
    status: string;
    image: string | File[] | null; 
        file_type: string[]  | null; 
    file: File[] | string  | null;
    metadata: string[] | null;
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
    file_type: string[]  | null; 
    file: File[] | string  | null;
    metadata: string[] | null;
  }

  
  export interface EditDocs {
    title: string | null;
    description: string | null;
    content: string | null; // Mảng nội dung chi tiết
    link: string | null;
    category: string | null; // Mảng danh mục
    image: File[] | string | null; // Hình ảnh chính cho bài viết
    category_remove:string | null;
    file_type: string[]  | null; 
    file: File[] | string | null;
    metadata: string[] | null;
    media_remove:string[] | null;
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
    media:Media[] | null;
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
   thông kê truy cậpcập
  **/


  export interface StatisticalResponse  {
    today_views: number;
    total_views: number;
    filtered_views: Array<{
      id: number;
      total_views: number;
      date: string;
    }>;
  }

    /**
   thông kê người dùng
  **/


   export interface StatisticalUserResponse  {
    total_users: number;
    admin_percentage: string;
    manager_percentage: string;
    no_role_percentage: string;
    user_details: {
      admin_count: number;
      manager_count: number;
      no_role_count: number;
    }
    daily_user_counts: Array<{
      count: number;
      date: string;
    }>;
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
    about:string ,
    title:string,
    image:string,
    category:string,
}





export interface DocsList {
    id: string;
    title: string;
    description: string;
    content: string;
    link: string;
    image: string | null; 
    category: Category;
    user: User;
    media: Media[] | null;

}



interface VocationList {
  id:string,
  name:   string,
  status: string,
  email:Date,
  dob:string,
  phone_number:string,
  church:string,
  reason:string,
  created_date:string
}


export interface VocationRegisterListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VocationList[];
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
    email?: Field;
    last_name?: Field;
    first_name?: Field;
    phone_number?: Field;
  
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

  export interface GroupMemberData {
    groupId: string;
    groupName:string | null
  }


  export interface Post {
   postId: string;
  }


// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchDocsListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: DocsList[];
}
/*
  Donation Interface
*/

export interface EditDonation {
  title: string| null;
  description: string| null;
  content: string| null; // Có thể cần điều chỉnh nếu cấu trúc khác
  link: string| null;
  image: File[] | string| null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
  visibility: string| null;
  file_type: string[]  | null; 
  file: File[] | string | null;
  metadata: string[] | null;
  media_remove:string[] | null;
}

export interface NewDonation {
  title: string;
  description: string;
  content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
  link: string;
  image: File[] | string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
  visibility: string;
}
export interface Donation {
  id: string;
  title: string;
  description: string;
  content: string;
  link: string;
  visibility: string;
  image: string;
  media: Media[] | null;

}


export interface DonationDetail {
  id: string;
  title: string;
  description: string;
  content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
  link: string;
  image: string; // Chỉnh sửa để phù hợp với giá trị null trong JSON
  visibility: string;
  status:string;
  created_date: string
  updated_date: string
}

interface DonationList {
  id: string;
  title: string;
  description: string;
  content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
  link: string;
  image: string; // Chỉnh sửa để phù hợp với giá trị null trong JSON
  visibility: string;
  status:string;
  created_date: string
  updated_date: string
}

export interface FetchDonationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DonationList[];
}

/**
 chatAI Interface
 **/

type ChatItem = {
    content: string;
    response: string;
};

export type FetchChatListResponse = ChatItem[];

export interface NewChat {
    content: string;
}

/**
  post Interface
 **/


interface PostCategory {
    id: string;
    name: string;
    file: string;
  }
  
  interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_image: string;
  }

  interface Media {
    id:string | null;
    file:string| null;
    file_type:string| null;
    metadata:string| null;
  }

  
  interface PostList {
    id: string;
    title: string;
    description: string;
    content: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    link: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    categories: PostCategory[];
    user: User; 
    media: Media[] | null;
    created_date:string;
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
    image: File[] | string[]; // Hình ảnh chính cho bài viết
    file_type: string[]  | null; 
    file: File[] | string  | null;
    metadata: string[] | null;
  }

  export interface EditPost {
    title: string | null;
    description: string | null;
    content: string | null; // Mảng nội dung chi tiết
    link: string | null;
    category: string[] | null; // Mảng danh mục
    image: File[] | string | null; // Hình ảnh chính cho bài viết
    category_remove:string[] | null;
    file_type: string[]  | null; 
    file: File[] | string | null;
    metadata: string[] | null;
    media_remove:string[] | null;
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

  /**
  drawer Interface
 **/


  export interface FeastDrawerProps {
    visible: boolean;
    onClose: () => void;
    selectedDate: string | null;
    selectedFeast: any;
    scheduleId: string
  }


  /**
  Schedule Interface
 **/

  export interface CreateSchedule {
    feast_name: string;
    feast_type: string;
  }


  interface GroupList {
    id: number;
    name: string;
    founding_date: string; // Có thể cần điều chỉnh nếu cấu trúc khác
    link: string;
    image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
    created_date: string;
    updated_date: string;
    // user: Documents; // Sử dụng interface User đã khai báo ở trên
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchGroupListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: GroupList[];
}

export interface NewGroup {
  name: string;
  founding_date: Date | null;
  description: string;
  image?: File | string[] | null;
}


export interface NewGroupRole {
  name: string;
  description: string;
}

interface GroupMember {
  id: number;
  name: string;
  email: string; // Có thể cần điều chỉnh nếu cấu trúc khác
  link: string;
  dob: Date;
  phone_number:string;
  image: string | null; // Chỉnh sửa để phù hợp với giá trị null trong JSON
  role:string;
  join_date: Date;
  first_vows_date: Date;
  final_vows_date: Date;
  group:string
  created_date: Date;
  updated_date: Date;
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchGroupMemberListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GroupMember[];
}


export interface NewGroupMember {
  name: string;
  email: string;
  link: string;
  dob: Date;
  phone_number:string;
  image: File[] | string;
  role:string;
  join_date: Date;
  first_vows_date: Date | null;
  final_vows_date: Date | null;
  group:string
}


// Khai Báo Các Biến Có trong Queue
interface RequestUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_image: string;

}

interface BrowsedUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_image: string;

}

interface OldData {
  id: string;
  name: string;
  image: string;
  model: string;
}

interface NewData {
  id: string;
  name: string;
  image: string;
  model: string;
}


interface Data {
  old_data: OldData | null;
  new_data: NewData | null;
}

interface Queue {
  id: string;
  request_user:RequestUser | null;
  browsed_user:BrowsedUser | null;
  created_date: string;
  updated_date: string;
  data: Data;
  description: string;
  type: string;
  action: string;
  status: string;
}

// Khai Báo Các Thuộc Tính Không Có trong trường hiển thị
export interface FetchQueueListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Queue[];
}

/*
  Khai Báo Thuộc Tính Role
*/
interface Role {
  id: number;
  name: string;
  description: string;
}

export interface FetchRoleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}



interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_image: string;
  is_active: boolean;
  blocked: boolean;
}

export interface FetchUserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserData[];
}

export interface UserFilters {
  role?: string[]; // Use an array for role filters
  [key: string]: string | number | string[] | undefined;
}

