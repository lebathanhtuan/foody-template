import { useState, useEffect } from 'react';
import { Button, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import history from '../../../utils/history';

import {
  getStoreDetailAction,
  addToCartAction,
} from '../../../redux/actions';

function StoreDetailPage({ match }) {
  const [storeCount, setStoreCount] = useState(1);

  const storeId = parseInt(match.params.id);

  const { userInfo } = useSelector((state) => state.userReducer);
  const { storeDetail } = useSelector((state) => state.storeReducer);
  const { cartList } = useSelector((state) => state.cartReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStoreDetailAction({ id: storeId }));
  }, []);

  function handleAddToCart() {
    const cartData = [...cartList.data];
    const cartIndex = cartData.findIndex((item) => item.storeId === storeId);
    if (cartIndex !== -1) {
      cartData.splice(cartIndex, 1, {
        ...cartData[cartIndex],
        count: cartData[cartIndex].count + storeCount,
      });
      dispatch(addToCartAction({
        id: userInfo.data.id,
        data: { cart: cartData },
      }));
    } else {
      const newCartData = [
        ...cartData,
        {
          id: uuidv4(),
          storeId: storeId,
          name: storeDetail.data.name,
          price: storeDetail.data.price,
          count: storeCount,
        }
      ]
      dispatch(addToCartAction({
        id: userInfo.data.id,
        data: { cart: newCartData },
      }));
    }
    
  }

  return (
    <>
      <Button onClick={() => history.goBack()}>
        Quay lại
      </Button>
      {storeDetail.data.images && (
        <img
          src={storeDetail.data.images[0]}
          alt={storeDetail.data.name}
        />
      )}
      <div>Tên sản phẩm: {storeDetail.data.name}</div>
      <div>Hãng: {storeDetail.data.category?.name}</div>
      <div>
        Giá: {storeDetail.data.price >= 0 && storeDetail.data.price.toLocaleString()}
      </div>
      <InputNumber
        min={1}
        onChange={(value) => setStoreCount(value)}
        value={storeCount}
      />
      <div>
        <Button type="primary" onClick={() => handleAddToCart()}>
          Thêm vào giỏ
        </Button>
      </div>
    </>
  );
}

export default StoreDetailPage;
