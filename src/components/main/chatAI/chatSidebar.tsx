
export default function ChatSidebar() {

    return (
        <aside
            className=' w-64
            shadow-md bg-white flex flex-col transition-all duration-300 relative cursor-pointer'
        >

            <div className="p-4">

                    <h1 className="text-2xl font-bold mb-6 text-primary-500">
                        MaristChat
                    </h1>
            </div>

            <ul className="space-y-4 p-4">
                <li className="flex items-center space-x-4 hover:text-yellow-300">
                     <span>Chat</span>
                </li>
                <li className="flex items-center space-x-4 hover:text-yellow-300">
          <span>Documentation</span>
                </li>
                <li className="flex items-center space-x-4 hover:text-yellow-300">
              <span>Facebook</span>
                </li>
                <li className="flex items-center space-x-4 hover:text-yellow-300">
        <span>Make a donation</span>
                </li>
                <li className="flex items-center space-x-4 hover:text-yellow-300">
                  <span>Language</span>
                </li>
            </ul>
        </aside>
    );
}

