// UserCardsContainer.tsx (New Server Component)
import UserCard from '../design/UserCard';

const user = {
    admin: {
        count: async () => 10,
    },
    manager: {
        count: async () => 20,
    },
    user: {
        count: async () => 100,
    },
    parent: {
        count: async () => 50,
    },
};

const UserCardsContainer = async () => {
    const adminCount = await user.admin.count();
    const managerCount = await user.manager.count();
    const userCount = await user.user.count();
    const parentCount = await user.parent.count();

    return (
        <div className="flex space-x-4">
            <UserCard type="admin" count={adminCount} />
            <UserCard type="manager" count={managerCount} />
            <UserCard type="user" count={userCount} />
            <UserCard type="parent" count={parentCount} />
        </div>
    );
};

export default UserCardsContainer;
