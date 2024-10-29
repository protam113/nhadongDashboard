'use client';


const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
    const date = dateParam ? new Date(dateParam) : new Date();

    // Dữ liệu mẫu
    const sampleEvents = [
        {
            id: 1,
            title: "Hội thảo công nghệ",
            description: "Thảo luận về các xu hướng công nghệ mới.",
            startTime: new Date("2024-10-30T10:00:00"),
        },
        {
            id: 2,
            title: "Lớp học trực tuyến",
            description: "Học Python cho người mới bắt đầu.",
            startTime: new Date("2024-10-30T14:00:00"),
        },
        {
            id: 3,
            title: "Cuộc họp phụ huynh",
            description: "Cuộc họp cho phụ huynh về học tập của học sinh.",
            startTime: new Date("2024-10-30T16:00:00"),
        },
    ];

    // Lọc dữ liệu mẫu theo ngày
    const filteredEvents = sampleEvents.filter(event => {
        const eventDate = new Date(event.startTime);
        return (
            eventDate.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)
        );
    });

    return filteredEvents.map((event) => (
        <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            key={event.id}
        >
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs">
                    {event.startTime.toLocaleTimeString("en-UK", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                </span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
        </div>
    ));
};

export default EventList;
