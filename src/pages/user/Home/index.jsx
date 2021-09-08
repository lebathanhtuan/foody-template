import { useState, useEffect } from "react";
import { Space, Row, Col, Card, Tag, Input, Button, Select, Checkbox, Slider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

import { STORE_LIMIT } from '../../../constants/store';

import {
  getCategoryListAction,
  getStoreListAction,
  getTagListAction,
  getMenuListAction,
} from '../../../redux/actions';

function HomePage() {
  const [activeType, setActiveType] = useState('store');
  const [categoriesSelected, setCategoriesSelect] = useState([]);
  const [tagSelected, setTagSelect] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 30000000]);
  const [searchKey, setSearchKey] = useState('');

  const { categoryList } = useSelector((state) => state.categoryReducer);
  const { storeList } = useSelector((state) => state.storeReducer);

  const { tagList } = useSelector((state) => state.tagReducer);
  const { menuList } = useSelector((state) => state.menuReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (activeType === 'store') {
      dispatch(getCategoryListAction());
      dispatch(getStoreListAction({ page: 1 }));
    } else {
      dispatch(getTagListAction());
      dispatch(getMenuListAction({ page: 1 }));
    }
  }, [activeType]);

  function handleFilterCategory(value) {
    setCategoriesSelect(value);
    dispatch(getStoreListAction({
      page: 1,
      categoriesSelected: value,
      searchKey,
    }));
  }

  function handleFilterTag(id) {
    let newTagSelected = [...tagSelected];
    const tagIndex = tagSelected.findIndex((item) => item === id);
    if (tagIndex !== -1) {
      newTagSelected.splice(tagIndex, 1)
    } else {
      newTagSelected = [...newTagSelected, id]
    }
    setTagSelect(newTagSelected);
    // dispatch(getMenuListAction({
    //   page: 1,
    //   searchKey,
    // }));
  }

  function handleRangePrice(value) {
    setPriceRange(value);
    dispatch(getMenuListAction({
      page: 1,
      priceRange,
      searchKey,
    }));
  }

  function handleSearchStore(value) {
    setSearchKey(value);
    dispatch(getStoreListAction({
      page: 1,
      categoriesSelected,
      searchKey: value,
    }));
  }

  function handleShowMore() {
    dispatch(getStoreListAction({
      page: storeList.page + 1,
      searchKey: searchKey,
      categoriesSelected,
      more: true,
    }));
  }

  function renderSelectedFilter() {
    if (
      categoriesSelected.length === 0
      && !searchKey
    ) return null;
    return (
      <Space wrap style={{ marginBottom: 16 }}>
        Đang filter theo:
        {categoriesSelected.length > 0 && categoriesSelected.map((selectedItem, selectedIndex) => {
          const categorySelectedData = categoryList.data.find((categoryItem) => 
            categoryItem.id === selectedItem
          );
          return (
            <Tag
              key={`category-${selectedIndex}`}
              closable
              onClose={(e) => {
                e.preventDefault();
                const newCategoriesSelect = [...categoriesSelected];
                newCategoriesSelect.splice(selectedIndex, 1);
                setCategoriesSelect(newCategoriesSelect);
                dispatch(getStoreListAction({
                  page: 1,
                  categoriesSelected: newCategoriesSelect,
                  searchKey: searchKey
                }));
              }}>
              {categorySelectedData.name}
            </Tag>
          );
        })}
        {searchKey && (
          <Tag
            closable
            onClose={() => {
              setSearchKey('');
              dispatch(getStoreListAction({
                page: 1,
                categoriesSelected,
                searchKey: undefined,
              }));
            }}>
            {`Tìm theo từ khóa: ${searchKey}`}
          </Tag>
        )}
      </Space>
    )
  }

  function renderFilterOption() {
    if (activeType === 'store') {
      return (
        <Card title="Category Filter" size="small">
          {renderCategoryFilter()}
        </Card>
      )
    } else {
      return (
        <>
          <Card title="Category Filter" size="small">
            <Space size={[0, 8]} wrap>
              {renderTagFilter()}
            </Space>
          </Card>
          <Card title="Category Filter" size="small" style={{ marginTop: 16 }}>
            <Slider
              min={0}
              max={30000000}
              step={100000}
              range
              tipFormatter={(value) => value.toLocaleString()}
              onChange={(value) => handleRangePrice(value)}
              value={priceRange}
            />
          </Card>
        </>
      )
    }
  }

  function renderCategoryFilter() {
    const categoryCheckbox = categoryList.data.map((categoryItem) => ({ 
      label: categoryItem.name,
      value: categoryItem.id,
    }));
    return (
      <Checkbox.Group
        options={categoryCheckbox}
        onChange={(value) => handleFilterCategory(value)}
        value={categoriesSelected}
      />
    )
  }

  function renderTagFilter() {
    return tagList.data.map((tagItem, tagIndex) => (
      <Tag
        key={tagIndex}
        onClick={() => handleFilterTag(tagItem.id)}
        {...tagSelected.findIndex((item) => item === tagItem.id) !== -1 && { color: 'blue' }}
        style={{ cursor: 'pointer' }}
      >
        {tagItem.icon} {tagItem.name}
      </Tag>
    ))
  }

  function renderStoreList() {
    return storeList.data.map((storeItem, storeIndex) => {
      return (
        <Col span={6} key={`store-item-${storeItem.id}`}>
          <Link to={`/store/${storeItem.id}`}>
            <Card
              size="small"
              title={storeItem.name}
            >
              <div>{storeItem.address}</div>
            </Card>
          </Link>
        </Col>
      )
    })
  }

  function renderMenuList() {
    return menuList.data.map((menuItem, menuIndex) => {
      return (
        <Col span={6} key={`menu-item-${menuItem.id}`}>
          <Link to={`/menu/${menuItem.id}`}>
            <Card
              size="small"
              title={menuItem.name}
            >
              <div>{menuItem.price.toLocaleString()}</div>
            </Card>
          </Link>
        </Col>
      )
    })
  }

  return (
    <div>
      <div>Home Page</div>
      <div style={{ padding: 16 }}>
        <Row gutter={16}>
          <Col span={4}>
            {renderFilterOption()}
          </Col>
          <Col span={20}>
            <Input
              placeholder="Search..."
              onChange={(e) => handleSearchStore(e.target.value)}
              value={searchKey}
              addonBefore={
                <Select
                  value={activeType}
                  onChange={(value) => setActiveType(value)}
                  style={{ width: 120 }}
                >
                  <Select.Option value="store">Cửa hàng</Select.Option>
                  <Select.Option value="menu">Món ăn</Select.Option>
                </Select>
              }
              suffix={<SearchOutlined />}
              style={{ marginBottom: 16 }}
            />
            {renderSelectedFilter()}
            <Row gutter={[16, 16]}>
              {activeType === 'store' ? renderStoreList() : renderMenuList()}
            </Row>
            {storeList.data.length % STORE_LIMIT === 0 && (
              <Row justify="center" style={{ marginTop: 16 }}>
                <Button onClick={() => handleShowMore()}>
                  Show more
                </Button>
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HomePage;
