

export default function ChatFont() {

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1">
            <h1 className="text-4xl font-bold text-primary-500 mb-4">
                MaristChat
            </h1>
            <p className="text-gray-600 text-lg">
                Giáo lý nhà Thờ trong tầm tay bạn
            </p>
            <p className="pb-5">
                Hãy đặt tất cả các câu hỏi của bạn vào ChatGPT này để phục vụ Giáo
                hội.
                <br/>
                Nhờ trí tuệ nhân tạo, bạn sẽ nhận được câu trả lời phù hợp với
                giáo lý Công giáo.
            </p>
            <div className="flex space-x-4 mb-6">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full">
                    Bằng chứng về sự tồn tại của chúa?
                </button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full">
                    Bảy bí tích là gì?
                </button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full">
                    Tại sao Isaac lại là nhân vật cứu thế?
                </button>
            </div>
        </div>
    );
}

