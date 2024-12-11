import { useCreateSchedule } from "@/hooks/schedule/useSchedule";
import React from "react";
import { Button, Form, Input, Select } from "antd";

const { Option } = Select;

const feastPriority = [
  "Lễ trọng",
  "Lễ kính",
  "Lễ nhớ",
  "Lễ nhớ tùy ý",
  "Lễ nhớ tùy ý*",
];

const CreateSchedule = ({ scheduleId }: { scheduleId: string }) => {
  const [form] = Form.useForm();

  const { mutate } = useCreateSchedule(scheduleId);

  const handleSubmit = (values: any) => {
    // Handle form submission
    mutate(values);
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="feast_name"
          label="Tên Lễ"
          rules={[{ required: true, message: "Hãy nhập tên lễ" }]}
        >
          <Input placeholder="Nhập tên lễ" />
        </Form.Item>

        <Form.Item
          name="feast_type"
          label="Loại Lễ"
          rules={[{ required: true, message: "Hãy chọn loại lễ" }]}
        >
          <Select style={{ width: "100%" }} placeholder="Chọn loại lễ">
            {feastPriority.map((priority, index) => (
              <Option key={index} value={priority}>
                {priority}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo Lễ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateSchedule;
