

import DefaultLayout from "@/components/layout/DefautLayout";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {/* LEFT */}
            <DefaultLayout>

                {children}
            </DefaultLayout>
        </div>
    );
}