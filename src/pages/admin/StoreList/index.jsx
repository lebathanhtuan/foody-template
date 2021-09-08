import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Button,
  Table,
  Space,
  Popconfirm,
} from "antd";
import moment from 'moment';
import history from '../../../utils/history';

import {
  getCategoryListAction,
  getStoreListAction,
  deleteStoreAction,
} from '../../../redux/actions';

function StoreListPage(props) {

  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { storeList } = useSelector((state) => state.storeReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoryListAction());
    dispatch(getStoreListAction());
  }, []);

  const tableColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (value) => {
        const categoryData = categoryList.data.find((item) => item.id === value);
        if (categoryData) return categoryData.name;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Create At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => value && moment(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="primary"
              ghost
              onClick={() => history.push(`/admin/store/${record.id}/edit`)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this store?"
              onConfirm={() => dispatch(deleteStoreAction({ id: record.id }))}
              onCancel={() => null}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        )
      }
    },
  ];

  const tableData = storeList.data.map((storeItem, storeIndex) => {
    return {
      key: storeIndex,
      ...storeItem,
    }
  })

  return (
    <div style={{ padding: 16 }}>
      <div>Store Manage</div>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => history.push('/admin/store/create')}
        >
          Add Store
        </Button>
      </Row>
      <Table
        columns={tableColumn}
        dataSource={tableData}
        loading={storeList.load}
      />
    </div>
  );
}

export default StoreListPage;
