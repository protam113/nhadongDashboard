// NewForm.tsx
import React from 'react';
import { Select } from 'antd';
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, InsertTable, toolbarPlugin, tablePlugin } from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';

const { Option } = Select;

interface NewFormProps {
    sections: any[];
    selectedType: string | undefined;
    setSelectedType: (value: string | undefined) => void;
    handleAddSection: (type: string) => void;
    handleChangeContent: (index: number, value: string) => void; // Đảm bảo có dòng này
}

const NewForm: React.FC<NewFormProps> = ({
                                             sections,
                                             selectedType,
                                             setSelectedType,
                                             handleAddSection,
                                             handleChangeContent,
                                         }) => {
    return (
        <div>
            {/* Phần Chọn loại trường */}
            <div className="mb-4">
                <h3 className="font-medium">Chọn loại trường để thêm:</h3>
                <Select
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={setSelectedType}
                    value={selectedType}
                >
                    <Option value="title">Thêm Tiêu Đề</Option>
                    <Option value="desc">Thêm Mô Tả</Option>
                    <Option value="image">Thêm Hình Ảnh</Option>
                    <Option value="content">Thêm Nội Dung</Option>
                </Select>
                <button
                    onClick={() => {
                        if (selectedType) {
                            handleAddSection(selectedType);
                        }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                    Thêm
                </button>
            </div>

            {/* MDX Editor */}
            <div className="mb-4">
                {sections.map((section, index) => (
                    <div key={index} className="mb-4 border p-2 rounded-md">
                        <h3 className="font-bold">Phần {index + 1}: {section.type}</h3>
                        <MDXEditor
                            markdown={section.content}
                            onChange={(value) => handleChangeContent(index, value)} // Gọi hàm để cập nhật nội dung
                            plugins={[
                                toolbarPlugin({
                                    toolbarContents: () => (
                                        <>
                                            <UndoRedo />
                                            <BoldItalicUnderlineToggles />
                                            <InsertTable />
                                        </>
                                    ),
                                }),
                                tablePlugin(),
                            ]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewForm;