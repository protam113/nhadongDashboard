import { useEventRegisterList } from "@/hooks/event/useEventRegistion";

const RegisterList = (currentPage: number, postId: string, status: string, refreshKey: number) => {
  // Đảm bảo rằng status luôn là 'pending'
  const filters = { status };


  const { data, isLoading, isError } = useEventRegisterList(
    postId,          // Truyền đúng postId vào đây
    currentPage,     // Truyền đúng currentPage
    filters,         // Truyền filters chứa status
    refreshKey       // Truyền refreshKey
  );

  const queueData = data?.results || [];

  return {
    queueData,
    next: data?.next,
    isLoading,
    isError,
  };
};

export default RegisterList;

  
  