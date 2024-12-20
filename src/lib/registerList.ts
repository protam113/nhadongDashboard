import { useEventRegisterList } from "@/hooks/event/useEventRegistion";

const RegisterList = (currentPage: number, postId: string, refreshKey: number) => {
    const { data, isLoading, isError } = useEventRegisterList(
      postId,
      currentPage,
      refreshKey
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
  