import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Space,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SunEditor from 'suneditor-react';

import history from "../../../utils/history";
import { convertFileToBase64 } from "../../../utils/common";

import {
  getCategoryListAction,
  getStoreDetailAction,
  createStoreAction,
  editStoreAction,
} from "../../../redux/actions";

function ModifyStorePage({ match }) {
  const [uploadImages, setUploadImage] = useState([]);
  const [uploadError, setUploadError] = useState('');

  const storeId = match.params.id;

  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { storeDetail } = useSelector((state) => state.storeReducer);

  const dispatch = useDispatch();

  const [modifyStoreForm] = Form.useForm();

  const initialValues = storeId ? storeDetail.data : {};

  useEffect(() => {
    dispatch(getCategoryListAction());
  }, []);

  useEffect(() => {
    if (storeId) {
      dispatch(getStoreDetailAction({ id: storeId }));
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId && storeDetail.data.id) {
      modifyStoreForm.resetFields();
      setUploadImage([...storeDetail.data.images]);
    }
  }, [storeId, storeDetail.data]);

  async function handleUploadImage(value) {
    if (!["image/png", "image/jpeg"].includes(value.file.type)) {
      return setUploadError('File không đúng!');
    }
    if (value.file.size > 1024000) {
      return setUploadError('File quá nặng!');
    }
    setUploadError('');
    const imageBase64 = await convertFileToBase64(value.file);
    await setUploadImage([...uploadImages, imageBase64]);
  }

  function handleSubmitForm(values) {
    if (uploadImages.length === 0) {
      return setUploadError('Ảnh là bắt buộc!');
    }
    if (storeId) {
      dispatch(editStoreAction({
        id: storeId,
        data: {
          ...values,
          images: uploadImages,
        },
      }));
    } else {
      dispatch(createStoreAction({
        data: {
          ...values,
          images: uploadImages,
        },
      }));
    }
  }

  function renderCategoryOptions() {
    return categoryList.data.map((categoryItem, categoryIndex) => (
      <Select.Option
        value={categoryItem.id}
        key={`category-${categoryItem.id}`}
      >
        {categoryItem.name}
      </Select.Option>
    ));
  }

  function renderStoreImages() {
    return uploadImages.map((imageItem, imageIndex) => (
      <Col span={6}>
        <Image width="100%" src={imageItem} />
      </Col>
    ));
  }

  return (
    <div style={{ padding: 16 }}>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <h3>{storeId ? "Edit store" : "Create store"}</h3>
        <Space>
          <Button onClick={() => history.push("/admin/stores")}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => modifyStoreForm.submit()}>
            Save
          </Button>
        </Space>
      </Row>
      <div style={{ padding: 16, background: "#f6f6f6" }}>
        <Form
          form={modifyStoreForm}
          name="modify-store"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={initialValues}
          onFinish={(values) => handleSubmitForm(values)}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Row>
            <Col span={4} style={{ textAlign: "right" }}>
              <Space style={{ marginTop: 4 }} size={0}>
                <div
                  style={{
                    display: 'inline-block',
                    marginRight: '4px',
                    color: '#ff4d4f',
                    fontSize: '14px',
                    fontFamily: 'SimSun, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  *
                </div>
                <div style={{ marginRight: 8 }}>Image :</div>
              </Space>
            </Col>
            <Col span={20}>
              <Upload
                accept="image/*"
                listType="picture"
                beforeUpload={() => false}
                onChange={(value) => handleUploadImage(value)}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
              {uploadImages.length > 0 && (
                <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                  {renderStoreImages()}
                </Row>
              )}
              <div style={{ height: 24, color: '#ff4d4f' }}>
                {uploadError}
              </div>
            </Col>
          </Row>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please input your category!" }]}
          >
            <Select>{renderCategoryOptions()}</Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input your price!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
          >
            <SunEditor
              setOptions={{
                height: 300,
                font : [
                  'Segoe UI',
                  'Arial',
                  'tohoma',
                  'Courier New,Courier'
                ],
                buttonList : [
                  ['font', 'formatBlock', 'fontSize'],
                  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                  ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'list', 'table'],
                  ['link', 'image']
                ],
                defaultStyle: `font-family: 'Segoe UI', 'Aria', sans-serif; font-size: 14px;`,
              }}
              defaultValue={modifyStoreForm.getFieldValue('content')}
              onChange={(value) => modifyStoreForm.setFieldsValue({ content: value })}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ModifyStorePage;
